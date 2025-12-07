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
