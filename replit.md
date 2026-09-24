# NBSRAC Conference Website

A standalone, responsive conference website for an NBSRAC Academic Society event. Event details are intentionally editable placeholders until confirmed.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/nbsrac-conference run dev` — run the conference site
- `pnpm --filter @workspace/nbsrac-conference run typecheck` — typecheck the conference site
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- The root `vercel.json` builds the conference site as a static Vercel deployment.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nbsrac-conference/src/App.tsx` — single-page conference site and interactions.
- `artifacts/nbsrac-conference/src/data/conference.ts` — editable conference and society content source.
- `artifacts/nbsrac-conference/src/index.css` — NBSRAC-inspired colors, typography, accessibility and responsive styles.
- `vercel.json` — static Vercel build and SPA rewrite for this site.

## Architecture decisions

- The conference site is a static React/Vite app; it does not require the shared API or database.
- Registration and contact forms validate in the browser only and do not send or store entered information.
- Unknown conference details remain visibly marked as unannounced rather than being invented.

## Product

A one-page academic conference site with calls for papers, speaker and schedule sections, registration interest, venue information, committee details, sponsor tiers, FAQ and contact links.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
