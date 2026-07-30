# Tycho Systems Website

Marketing site, client dashboards and lead-magnet funnel for Tycho Systems —
practical AI automation, websites, integrations and internal systems for small
businesses.

## Stack

- **Frontend:** React 19 + TypeScript (strict) + Vite + Tailwind v4, deployed on Vercel.
- **Server:** Express 5 under `server/` (Bun/tsx in dev), deployed on Railway.
- **Data:** Supabase (`server/supabase/migrations/`).
- **CRM:** HubSpot (lead-magnet funnel). **Email:** Resend-compatible transactional adapter.

## Commands

```bash
npm run dev          # frontend (proxies /api to :3001)
npm run dev:server   # backend
npm run test         # vitest (frontend + server suites)
npm run lint
npm run build        # typecheck + production build + legal prerender
npm run gen:pdfs     # regenerate lead-magnet PDFs from src/content/resources/
```

## Business email

All public-facing addresses live in one typed source of truth,
`src/config/contact.ts` (domain **tychosystem.com**): `founder` (jordhan@),
`contact@`, `hello@`, `info@`, `support@`, `billing@`, `privacy@`, `resources@`,
`partners@`. Use `emails.*` and the `mailto()` helper instead of hard-coding an
address. The server mirrors this in `server/src/config/contact.ts`, which also
owns the **notification routing table** (category → destination). Destination
routing is server-side only and never exposed to the browser. The transactional
sender/reply-to are configured via env (`server/.env.example`), not in code.

## Where things live

- Site copy and structured content: `src/config/` (`site.ts`, `contact.ts`, `services.ts`, `leadMagnets.ts`, …)
- Lead-magnet funnel docs (setup, HubSpot properties, deployment checklist):
  `docs/lead-magnet-funnel.md`
- Nurture email copy: `docs/email-sequences.md` · Social link routing: `docs/social-content-links.md`
- Environment templates: `.env.example` (frontend) and `server/.env.example` (server).
  Never commit real secrets.
