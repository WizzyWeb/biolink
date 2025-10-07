## BioLink — Link in Bio with Analytics

A simple, modern "link in bio" app with profile editing, link management, and built‑in analytics (profile views and per‑link clicks). Edit mode and analytics are protected by a lightweight URL parameter gate.

### Features
- **Profile**: avatar, display name, bio
- **Links**: add, edit, delete, reorder; supports many platforms
- **Analytics**: profile views, total clicks, per‑link clicks and distribution
- **Edit Mode**: toggle editing via `?edit=true`
- **Share**: quick copy/share buttons for the public profile URL

### Tech Stack
- Client: React 18, Vite, Tailwind CSS, Radix UI, TanStack Query, Wouter
- Server: Express (ESM), Vite Dev Middleware (dev), static serving (prod)
- Database: Postgres (Neon), Drizzle ORM + drizzle‑kit

---

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file in the project root with your Postgres connection string (Neon or any Postgres):

```bash
echo 'DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require' > .env
```

3) Apply schema to the database (creates tables)

```bash
npx drizzle-kit push
# or via package script
npm run db:push
```

4) Seed demo data (optional but recommended)

```bash
NODE_ENV=development tsx server/seed.ts
```

5) Run the app in development

```bash
npm run dev
```

App will serve API and client from the same process. The port defaults to `5000` (or `process.env.PORT`).

---

## Scripts

- `npm run dev` — Starts Express with Vite middleware (development)
- `npm run build` — Builds client to `dist/public` and bundles server to `dist/index.js`
- `npm run start` — Runs the production server from `dist`
- `npm run db:push` — Applies Drizzle schema changes to the database

---

## Environment

Required:

- `DATABASE_URL` — Postgres connection string (e.g., Neon). The server will exit if it is missing.
- `PORT` (optional) — Defaults to `5000`.

The Drizzle config (`drizzle.config.ts`) also requires `DATABASE_URL` to be set when running migrations.

---

## Database & Migrations

- Schema lives in `shared/schema.ts`.
- Drizzle config: `drizzle.config.ts` outputs migrations to `./migrations`.
- Apply changes:

```bash
npm run db:push
```

### Seeding

The seed script creates a demo profile (`username: demo`) and a set of sample links:

```bash
NODE_ENV=development tsx server/seed.ts
```

---

## Development Workflow

```bash
# 1) Install
npm install

# 2) Configure env
echo 'DATABASE_URL=postgres://...' > .env

# 3) Apply schema
npm run db:push

# 4) (Optional) Seed demo data
NODE_ENV=development tsx server/seed.ts

# 5) Start dev server
npm run dev
```

Vite serves the client in middleware mode during development. In production, the server serves the built client from `dist/public`.

---

## Production Build & Run

```bash
# Build client and bundle server
npm run build

# Start production server
npm run start
```

The production server serves static files from `dist/public` and the API under `/api/*`.

---

## Using the App

### Public Profiles

- Visit `/{username}` to view a public profile. The project seeds `demo`, so `http://localhost:5000/demo` should work after seeding.

### Edit Mode (URL‑gated)

- To access edit controls on a profile page, append the query parameter `?edit=true`:

```
http://localhost:5000/{username}?edit=true
```

- When present, an Edit toggle appears in the top‑right. Toggle it to switch between View and Edit. In Edit mode you can:
  - Update profile info
  - Add/edit/delete/reorder links
  - Navigate to the Analytics dashboard

### Analytics

- From Edit mode, click "View Analytics". It routes to `/analytics/{profileId}`.
- The server endpoint `GET /api/analytics/:profileId` returns:
  - Profile views
  - Total link clicks
  - Per‑link clicks

---

## API Overview

Base URL: same origin as the client, under `/api`.

- `GET /api/profile/:username` — returns `{ profile, links }` and increments profile views
- `PATCH /api/profile/:id` — update profile fields
- `POST /api/links` — create a social link
- `PATCH /api/links/:id` — update a link
- `DELETE /api/links/:id` — delete a link
- `PATCH /api/links/reorder` — reorder links, body: `{ linkIds: string[] }`
- `POST /api/links/:id/click` — increments clicks and returns `{ url }`
- `GET /api/analytics/:profileId` — aggregated analytics

---

## Project Structure (key paths)

```
client/              # React app (Vite)
  src/
    pages/
      home.tsx       # Profile page with edit gate via ?edit=true
      analytics.tsx  # Analytics dashboard
server/
  index.ts           # Express app entry
  routes.ts          # API routes
  db.ts              # Drizzle + Neon setup
  storage.ts         # Storage layer (Drizzle queries)
  seed.ts            # Demo data seeding
shared/
  schema.ts          # Drizzle schema & zod validations
vite.config.ts       # Vite config (client build to dist/public)
```

---

## Notes & Tips
- Profile views increment on `GET /api/profile/:username`.
- Link clicks increment on `POST /api/links/:id/click` (also updates profile total clicks).
- In production, ensure your `DATABASE_URL` includes SSL (e.g., Neon uses `?sslmode=require`).

---

## License

MIT



