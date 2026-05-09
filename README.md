# Pokémon Explorer

A small full-stack Pokémon Explorer built for a home assignment. It uses the public PokéAPI as the data source, with in-memory caching in the Go backend.

## Tech Stack

- Backend: Go, Fiber
- Frontend: Next.js App Router, React, TypeScript, Tailwind, tRPC
- External API: PokéAPI
- Cache: in-memory cache in the Go backend
- Docker: Docker Compose for running backend and frontend together
- CI: GitHub Actions for backend formatting/tests and frontend check/build

## Run With Docker Compose

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8080/health`

In Docker, the frontend uses:

```bash
BACKEND_URL=http://backend:8080
```

## Run Locally Without Docker

Start the backend:

```bash
cd backend
go mod download
go run ./cmd/server
```

Start the frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

For local development, `frontend/.env` should contain:

```env
BACKEND_URL=http://localhost:8080
```

Then open `http://localhost:3000`.

## Checks

```bash
cd backend && go test ./...
cd ../frontend && npm run check && npm run build
```

## Main Backend Endpoints

- `GET /health`
- `GET /pokemon?page=1&pageSize=20&search=pika`
- `GET /pokemon/:name`
- `GET /pokemon/strongest`

The frontend calls these backend endpoints only through tRPC procedures.

## Design Choices

- The Go backend owns PokéAPI calls, response mapping, pagination, search, caching, and strongest Pokémon calculation.
- The frontend talks to the backend through tRPC instead of calling the Go API directly from browser components.
- Clean response models are returned to the frontend instead of raw PokéAPI responses.
- The backend uses an in-memory cache for Pokémon details by name, the Pokémon index, and the computed `/pokemon/strongest` result.
- `/pokemon/strongest` uses bounded concurrency with `errgroup.SetLimit`.
- I kept persistence out of scope because the assignment does not require data durability; in-memory caching keeps the app simple to run.
- Search and pagination state are stored in URL query params, so refreshes and detail-page back navigation preserve the user’s context.
- Tests: table-driven Go test for strongest-ranking logic.

## Trade-offs

- All cache data is in-memory and is lost when the backend restarts.
- Cold requests can be slower because the backend may need to fetch details from PokéAPI before caches are warm.
- The backend depends on PokéAPI availability and latency.
- The computed `/pokemon/strongest` result has a short TTL, which avoids recomputation during runtime but does not provide persistence.
- Expected not-found cases use typed backend errors and dedicated not-found UI; unexpected backend/API failures use broader recovery messages.

## What I Would Improve With More Time

- Add broader backend tests around service mapping, pagination normalization, and error paths.
- Add stronger observability around longer strongest calculations, such as structured logs and request timing.
- Add SQLite persistence if the product requirement was to keep computed rankings across backend restarts.
- Replace simple loading states with route-specific skeletons for a more polished perceived loading experience.
