# Pokémon Explorer Backend

Go + Fiber API that wraps the public PokéAPI for the Pokémon Explorer app.

## Run Locally

```bash
go mod download
go run ./cmd/server
```

The server starts on `:8080` by default.

## Environment Variables

| Name | Default |
| --- | --- |
| `PORT` | `8080` |
| `POKEAPI_URL` | `https://pokeapi.co/api/v2` |

## Endpoints

- `GET /health`
- `GET /pokemon?page=1&pageSize=20&search=pika`
- `GET /pokemon/:name`
- `GET /pokemon/strongest`

## Cache

The backend uses a simple in-memory cache protected by `sync.RWMutex` for:

- Pokémon details by normalized name

- Pokémon index list used for search and pagination

- computed `/pokemon/strongest` result with a short TTL

The cache is intentionally in-memory only and is lost when the backend restarts.

## Strongest Pokémon

`GET /pokemon/strongest` fetches Pokémon details with bounded concurrency using `errgroup.SetLimit`, ranks by total base stats, and uses Pokémon ID as a deterministic tie-breaker.

The computed top result is cached with a short TTL to avoid recomputing the ranking on every request.

## Tests

Run backend tests:

```bash
go test ./...
```

## Docker

Build the backend image:

```bash
docker build -t pokemon-backend .
```

Run the backend container:

```bash
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e POKEAPI_URL=https://pokeapi.co/api/v2 \
  pokemon-backend
```
