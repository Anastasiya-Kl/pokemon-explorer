# Pokémon Explorer Frontend

Frontend for the Pokémon Explorer app.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind
- tRPC

The frontend calls the Go backend only through server-side tRPC procedures. Browser components do not call the Go backend directly.

## Environment Variables

| Name | Example |
| --- | --- |
| `BACKEND_URL` | `http://localhost:8080` |

`BACKEND_URL` is used only by the server-side tRPC layer and should not be prefixed with `NEXT_PUBLIC_`.

## Run Locally

Start the backend first on `http://localhost:8080`.

Create `.env`:

```bash
cp .env.example .env
```

```bash
npm install
npm run dev
```
The frontend runs on `http://localhost:3000`.

## Useful Commands

```bash
npm run check
npm run build
```

## Docker

The frontend is usually run through the root `docker-compose.yml`, which also starts the Go backend.
