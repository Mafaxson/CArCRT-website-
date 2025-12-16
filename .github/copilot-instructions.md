# Copilot Instructions for CArCRT Website

## Project Overview
- **Stack:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- **Backend:** Node.js (Express), SQLite (intern groups), Supabase (cloud data)
- **Monorepo:** All code (frontend, backend, config, data) is in a single repo.

## Key Architecture
- **Frontend:**
  - Located in `src/` (pages, components, hooks, lib, config)
  - Uses React Router for navigation (`src/pages/`)
  - UI components in `src/components/` and `src/components/ui/`
  - Data fetching via Supabase client (`src/lib/supabaseClient.ts`)
- **Backend:**
  - Express server in `server.js` (API, uploads, email, SQLite)
  - SQLite DB for intern groups (`internGroups.db.js`)
  - Supabase for cloud data (see `src/config/supabase.ts`)
  - API proxied in dev via Vite config (`/api` → `localhost:3001`)

## Developer Workflows
- **Start full stack (dev):**
  - `npm run dev:full` (runs Vite + backend server)
- **Frontend only:**
  - `npm run dev`
- **Backend only:**
  - `npm run dev:server`
- **Production build:**
  - `npm run build` (then `npm start`)
- **Lint:**
  - `npm run lint`
- **Check deployment:**
  - `npm run check`

## Data & API Patterns
- **Supabase:**
  - Use `supabase` client for cloud data (auth, storage, etc.)
  - Config in `src/config/supabase.ts`
- **SQLite:**
  - Used for intern groups only (see `internGroups.db.js`)
- **API:**
  - Custom endpoints in `server.js` (see Express routes)
  - All `/api` requests proxied to backend in dev

## Project Conventions
- **Path Aliases:** Use `@/` for `src/` (see `vite.config.ts`)
- **UI:** Use shadcn-ui and Radix primitives for new components
- **Data:** Static data in `data/` and `public/data/` (JSON)
- **Uploads:** User uploads in `public/uploads/` or `public/lovable-uploads/`
- **Env:** Use `.env` for secrets (not committed)

## Integration Points
- **Email:** Outbound via Nodemailer (see `server.js`)
- **Supabase:** For most dynamic data (auth, storage, etc.)
- **SQLite:** Only for intern groups (legacy/local)

## Examples
- **Supabase usage:** `src/lib/supabaseClient.ts`
- **API route:** See Express handlers in `server.js`
- **Component pattern:** `src/components/ShareStoryForm.tsx`
- **Page pattern:** `src/pages/Index.tsx`

## Additional Notes
- **Lovable integration:** Project can be edited via [Lovable](https://lovable.dev/) or locally
- **Deployment:** See `README.md` and `COMPLETE-DEPLOYMENT-GUIDE.md` for details

---

_If any section is unclear or missing, please provide feedback for improvement._
