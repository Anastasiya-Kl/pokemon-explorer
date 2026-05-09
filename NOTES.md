- Asked Codex to scaffold the initial Go/Fiber endpoint and PokéAPI client.
  The generated structure was a useful starting point, but I manually reviewed the package boundaries between handler, service, client, and model.
  I kept Fiber-specific code in the handler layer, isolated external PokéAPI calls in the client, and kept DTO-to-response mapping in the service layer.

- Asked Codex how to structure caching for Pokémon data.
  It suggested a simple in-memory map, but I reviewed the concurrency implications because `/pokemon/strongest` fetches many details in parallel.
  I protected the detail cache with `sync.RWMutex`, normalized Pokémon names before using them as keys, and later added a short TTL cache for the computed `/pokemon/strongest` result to avoid recomputing the ranking on every request.

- Asked Codex how to implement `/pokemon` search on top of PokéAPI.
  The key limitation was that PokéAPI does not provide direct name search, and its list endpoint only returns `name` and `url`.
  I cached the lightweight Pokémon index, filtered names in the service layer, paginated the filtered result, and fetched details only for the visible page.

- Asked Codex to implement `/pokemon/strongest` with concurrency.
  The first version was partially right: it bounded outbound HTTP calls, but still scheduled one goroutine per Pokémon.
  I refactored it to use `errgroup.SetLimit` and reused the existing detail cache to avoid unnecessary repeated PokéAPI calls.

- Reviewed `/pokemon/strongest` for concurrency safety and deterministic output.
  I reviewed the concurrent result collection and used AI to sanity-check the shared-slice append risk, so I kept appends protected by a mutex.
  I independently noticed that equal `statTotal` values could produce unstable ordering, so I added a deterministic tie-breaker by Pokémon ID ascending.

- Asked Codex to scaffold the T3 frontend with tRPC procedures around the Go backend.
  The generated direction was useful, but I kept `BACKEND_URL` server-side instead of exposing it as `NEXT_PUBLIC_*`.
  React components call tRPC procedures, and only the tRPC server layer talks to the Go backend.

- Asked Codex to build the home page with search and pagination.
  The first version was functionally close, but it kept page and search state only in local React state, which broke context when navigating back from a detail page.
  I moved search and page into URL query params so refresh, pagination, and detail-page Back navigation preserve the user’s list context.

- I expected invalid detail routes like `/pokemon/not-a-real-pokemon` to need explicit handling, but the initial AI-assisted flow treated them like generic runtime failures.
  I changed the flow so the backend uses a typed not-found error, tRPC maps it to `NOT_FOUND`, and the detail route renders `not-found.tsx`.
  Backend or network failures still go through `error.tsx`, keeping expected 404s out of the generic error path.

- I expected some PokéAPI responses, especially less common forms, to have incomplete display data such as missing sprites or empty abilities/stats.
  The initial AI-generated UI assumed those fields would always render cleanly, so I added frontend fallbacks instead of inventing data on the backend.
  The backend response stays truthful, while the UI handles sparse API data with a reusable sprite placeholder and empty states for abilities and stats.

- Asked Codex to create the frontend Dockerfile and full Docker Compose setup.
  The first working version copied the whole frontend app into the runtime image, which was reliable but larger than needed.
  After verifying `docker compose up --build` worked end-to-end, I switched the frontend to Next.js standalone output and confirmed Docker networking uses `BACKEND_URL=http://backend:8080`, not `localhost`.

