# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The `@AGENTS.md` import above is load-bearing: this repo runs **Next.js 16** with the
> React Compiler enabled. APIs and conventions differ from older Next.js — consult
> `node_modules/next/dist/docs/` before writing framework code.

## Commands

```bash
npm run dev      # Next.js dev server (localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config via eslint-config-next)
```

There is no test suite. Verify changes by running `npm run dev` and exercising the flow.

## Environment

Local secrets live in `.env` (gitignored); see `.env.example`. **`.env` does not deploy
to Vercel** — production reads its own env vars from the Vercel dashboard, and a value set
locally but missing/wrong in Vercel is a common source of works-local-fails-in-prod bugs.

Required vars:

- `MP_ACCESS_TOKEN` — Mercado Pago server token. Format is `TEST-<digits>-...` / `APP_USR-...`.
  Do not confuse it with the MP *public key* (`TEST-<uuid>`); swapping them yields auth
  failures the SDK surfaces as `"Unexpected end of JSON input"` (empty response body).
- `NEXT_PUBLIC_APP_URL` — public base URL for MP `back_url`s. Optional; if empty,
  `getBaseUrl()` derives it from the request origin. MP **subscriptions require https**, so
  localhost won't work for that flow — use the deployed URL or an ngrok tunnel.
- `MP_PLAN_3000`, `MP_PLAN_5000` — preapproval *plan* ids used only by `/api/mercadopago`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — browser Supabase client.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only admin client; never exposed to the browser.

## Architecture

App Router project for a donations platform (Spanish UI; "marmian"). Donors onboard, get ONG
recommendations matched to their interests, and donate to campaigns via Mercado Pago.

**Data model — two sources, deliberately split:**

- **Static seed data** in `src/data/` (`ongs`, `campaigns`, `orgTypes`) is hand-authored
  TypeScript, not a database. These reference each other by numeric id: a `Campaign.ongId`
  points at an `Ong`, and both `Ong.categories` and donor `interests` are arrays of
  `orgTypes` ids. The recommendation logic and ONG/campaign pages all read from here.
- **Supabase (Postgres)** holds runtime data — the `donors` table written by
  `/api/donors`. Two clients exist by design: `src/lib/client.ts` (anon/publishable key,
  browser-safe) vs `src/lib/admin.ts` (service-role key, server-only, used in API routes
  to bypass RLS). Pick the admin client only inside `app/api/*` route handlers.

**Mercado Pago — three payment entry points, do not conflate them:**

- `src/lib/mp.ts` centralizes the MP client (`mpClient()`) and `back_url` base
  (`getBaseUrl()`). All SDK-based MP routes go through it.
- `/api/mp/preference` — one-time donation via Checkout Pro `Preference`. Returns
  `sandbox_init_point ?? init_point`.
- `/api/mp/subscription` — recurring monthly donation via dynamic `PreApproval`. Returns
  `init_point` only (the SDK exposes **no** `sandbox_init_point` for preapprovals — there is
  no separate sandbox URL; test mode is set by credentials + test buyer user, not the URL).
- `/api/mercadopago` — alternative recurring flow using **pre-created MP plans**
  (`MP_PLAN_*` env ids), returns a static `preapproval_plan_id` checkout link. Bypasses the SDK.

**Onboarding state** is client-side only: `src/lib/onboarding.ts` reads/writes
`{ name, interests }` to `localStorage` (key `onboarding-donante`), shared between the
form step and the recommendations step. SSR-guarded with `typeof window` checks.

**Routing layout:**

- `src/app/(dashboard)/` — route group for panel views (`donantes`, `organizacion`,
  `panel`); the parenthesized folder does not appear in the URL.
- `src/app/_components/` — colocated, non-routable shared components (leading underscore).
- Path alias `@/*` → `src/*`.

**Styling:** Tailwind v4 (via `@tailwindcss/postcss`, no JS config file) plus a global
Sass stylesheet at `src/assets/css/styles.scss`. Global CSS imported in `app/globals.css`.
