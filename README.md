# Inventory + Local Search

Full-stack inventory management and consumer search platform built with Next.js 14 (App Router), Supabase Postgres, Prisma, and Tailwind CSS. The project provides:
- **Merchant Portal** to manage stores, items, inventory, and media uploads.
- **Consumer Search App** to discover products in nearby stores with Mapbox maps.

## Tech Stack
- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS for UI
- Prisma ORM with Supabase Postgres
- Supabase Auth & Storage
- Mapbox GL for maps

## System Architecture (text diagram)
```
[Next.js App Router]
  ├─ UI Layer (React + Tailwind)
  │    ├─ Merchant Portal (auth, dashboard, inventory CRUD, uploads)
  │    └─ Consumer App (search, store/item detail, map)
  ├─ API Routes (app/api)
  │    ├─ Auth: /api/auth/signup, /api/auth/login (Supabase)
  │    ├─ Stores CRUD: /api/stores
  │    ├─ Items CRUD: /api/items
  │    ├─ Inventory CRUD: /api/inventory
  │    └─ Search: /api/search (text + geo + stock filter)
  ├─ Services
  │    ├─ Prisma Client (Postgres via Supabase)
  │    ├─ Supabase Admin (auth, storage, RLS policies)
  │    └─ Mapbox Client (tiles, geocoding)
  └─ Data
       ├─ PostgreSQL (Supabase) with RLS for store ownership
       ├─ Storage (Supabase buckets) for item images
       └─ Mapbox tiles/geocoding for maps + location search
```

## Roadmap
- **Phase 1**: Repo initialization, env templates, architecture diagram, roadmap (this file).
- **Phase 2**: Prisma schema (User, Store, Item, Inventory), migrations, Supabase connection, RLS policies.
- **Phase 3**: API routes for auth, stores, items, inventory, search with validation and error handling.
- **Phase 4**: Merchant Portal pages (auth, dashboard, inventory, items, uploads, store settings).
- **Phase 5**: Consumer Search pages (home search, results, store detail, item detail, Mapbox map).
- **Phase 6**: Module definitions (auth, db, api, components, hooks, utils) with integration notes.
- **Phase 7**: Final assembly, run instructions, deployment guide (Vercel + Supabase), expansion notes (mobile, barcode, AI search).

## Quick Start (summary)
- Install dependencies: `pnpm install` or `npm install`.
- Copy `.env.example` to `.env.local` and fill Supabase + Mapbox keys.
- Run dev server: `pnpm dev` (Next.js + API routes).
- Run Prisma migrations: `pnpm prisma migrate dev`.

More detailed run/deploy guides are provided later in this repository.

## Directory Layout
- `app/api/**`: Next.js API routes (auth, stores, items, inventory, search).
- `app/merchant/**`: Merchant portal pages (auth, dashboard, items, inventory, store settings).
- `app/consumer/**`: Consumer search flows (home, search, store detail, item detail).
- `components/**`: Reusable UI + feature components (merchant image upload, map).
- `lib/**`: Prisma client, Supabase clients, auth helpers, validation schemas.
- `prisma/**`: Prisma schema + migrations.
- `supabase/policies.sql`: Suggested Supabase RLS policies.

## Run Locally
1) Install deps: `pnpm install` (or `npm install`).
2) Copy envs: `cp .env.example .env.local` and fill Supabase + Mapbox values.
3) Apply DB schema: `pnpm prisma migrate dev`.
4) Start dev server: `pnpm dev` then open `http://localhost:3000`.
5) Seed data (optional): use API routes with `curl` or the merchant UI.

## Deploy (Vercel + Supabase)
1) Create Supabase project, set DB password, and create a storage bucket (default `item-images`).
2) Run migrations: `pnpm prisma migrate deploy` using the Supabase connection string.
3) Apply RLS policies from `supabase/policies.sql` inside the Supabase SQL editor.
4) Set Vercel env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
5) Deploy via `vercel` CLI or Git integration; Vercel will build Next.js + Prisma.

## Modules (Phase 6)
- **auth**: `app/api/auth/*`, `lib/auth.ts`, Supabase admin client.
- **db**: `prisma/schema.prisma`, `prisma/migrations/*`, `lib/prisma.ts`.
- **api**: `app/api/stores|items|inventory|search`, shared validation in `lib/validators.ts`.
- **components**: UI primitives (`components/ui/*`), merchant image upload, consumer map.
- **hooks/utils**: Validation schemas, auth context helper, Prisma/Supabase clients.

## Future Expansion
- Expo React Native app can reuse API + validation schemas.
- Barcode scanning: add native module to Expo or web camera barcode scanner; post to `/api/search`.
- AI search: embed item metadata and use vector search (Supabase pgvector) before filtering by inventory.
- Multi-store merchant teams: add `Team` model and membership with RLS adjustments.
