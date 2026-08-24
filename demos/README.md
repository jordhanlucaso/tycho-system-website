# demo.tychosystem.com

Client concept demos, built by **Tycho Systems** as sales prototypes. One Next.js app,
deployed from this repo to its own subdomain, separate from the marketing site at the repo
root.

**None of these businesses has commissioned or approved the site built for them.** The whole
host is therefore blocked from indexing — see [Indexing](#indexing).

## What is here

| Path | Client | What it is |
| --- | --- | --- |
| `/` | — | Internal hub. `noindex`. |
| `/marine-max` | Marine Max, Nøtterøy | Boat and engine repair. 8 routes. Symptom-led repair page, structured service request. |
| `/eik` | Eik Tattoo & Piercing, Tønsberg | 9 routes. Light editorial direction, branching consultation flow. |
| `/stabukk` | Stabukk Tattoo Studio, Tønsberg | 6 routes. Press-black art-catalogue direction, single-page brief. |
| `/proposal` | — | Index of the sales documents. `noindex`. |
| `/proposal/marine-max` | Marine Max | Ten-section sales document. |
| `/proposal/tatovering-tonsberg` | Eik + Stabukk | Nine sections with a client switcher. |

Append `?demo=true` to any client URL for the Tycho annotation layer. It persists for the
session and is removed with `?demo=false`.

Research, design direction and sales material for each engagement live in
`engagements/<slug>/`.

## Lifecycle

`src/data/engagements.ts` is the **single source of truth**. The hub, the proposal index,
the sitemap and the QA route list all derive from it. Adding a client used to mean editing
six files and creating five asset trees; now it is one registry entry, and
`demo status` asserts that entry against the filesystem in both directions.

```bash
bun run demo status                          # what is live, what is overdue, registry drift
bun run demo new <slug> --name "X" --scope xx
bun run demo eject <concept> ../client-site  # a won concept → standalone app
bun run demo retire <engagement>             # a declined one → deleted
```

| Status | Meaning | Action |
| --- | --- | --- |
| `draft` | being built, never shown | — |
| `presented` | shown to the client; starts the retention clock | set `presented:` |
| `won` | client said yes | `eject`, then `retire` |
| `declined` | said no, or the clock ran out | `retire` |

**Retention is 60 days** from the date in `presented`. `demo status` exits non-zero on an
overdue engagement, on a `won`/`declined` one still being served, and on any drift — an
orphaned route directory, a registered concept with no pages, or a page that exists but is
in no route list.

`eject` copies the concept's routes (stripping the `/<slug>` prefix), components, data,
stylesheet (unscoped from `.<scope>`) and the engagement's research into a fresh Next.js
app with the demo layer removed and indexing switched on. It is a **starting point, not a
finished handover** — it prints the checklist of what to verify by hand.

`retire` deletes routes, components, data, proposal and docs, and deliberately *leaves* the
registry block, the demo notes and any nav entries, because each needs a judgement call.

The process for building a new demo is in `.claude/skills/client-demo-pipeline/SKILL.md`.

## Deployment

Two Vercel projects, one Git repo:

| Project | Root Directory | Domain | Framework |
| --- | --- | --- | --- |
| marketing site | *(repo root)* | `tychosystem.com` | Vite |
| demos | `demos` | `demo.tychosystem.com` | Next.js |

Set the demo project's **Root Directory** to `demos` in Vercel → Settings → General. It gets
its own `package.json` and lockfile, so Vercel installs and builds only this app. The root
project's build command is unchanged and never sees `demos/`; root `tsconfig.app.json`
includes only `src`, and `demos` is in the root ESLint `globalIgnores`.

DNS: a `CNAME` for `demo` pointing at `cname.vercel-dns.com`, then add
`demo.tychosystem.com` to the demos project.

### Environment

| Variable | Demo host | On handover to a client domain |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_ORIGIN` | `https://demo.tychosystem.com` | the client's real origin |
| `NEXT_PUBLIC_INDEXABLE` | unset | `true` |

Both are read in `src/lib/site.ts` and nothing else needs editing. Every canonical,
OpenGraph URL and JSON-LD `@id` derives from the first; the second is the master switch
described below. `vercel.json` also sends `X-Robots-Tag: noindex` on every response —
remove that file's `headers` block if this app is ever deployed as a client's live site.

## Indexing

Indexing is **opt-in, and the safe state is the default**. With `NEXT_PUBLIC_INDEXABLE`
unset:

- `robots.txt` is `Disallow: /`
- every page carries `noindex, nofollow`
- `sitemap.xml` is empty
- Vercel adds `X-Robots-Tag: noindex, nofollow, noarchive`

This is not caution for its own sake. These are speculative redesigns of real, named
businesses. Indexed, they would compete with the client's own listing for the client's own
brand name and put words in the owner's mouth that the owner never said.

The SEO architecture is unaffected and stays fully inspectable in view-source — canonicals,
structured data and the sitemap generator all still run, and the sitemap's route map is the
real one. Flipping the switch is part of a client's launch, not part of a sales demo.

## Run it

```bash
bun install
bun run dev            # http://localhost:3000
```

```bash
bun run build && bun run start   # production
bun run typecheck                # tsc --noEmit
bun run lint                     # eslint
```

## QA sweep

Crawls all 27 routes at 375 / 390 / 430 / 768 / 1024 / 1440, then runs interaction suites
(both tattoo booking flows, the marine enquiry flow, mobile drawers, the marine call bar,
demo layer, keyboard, reduced motion, no-JS). Writes `qa-report.json` and full-page
screenshots at 390 and 1440 into `qa-screenshots/`.

```bash
bun run build && npx next start -p 4311   # one shell
bun run qa                                # another
```

Uses the system Chromium through `playwright-core`, so no browser is downloaded. Override
with `CHROMIUM_PATH=... node scripts/qa.mjs http://localhost:3000`.

**It fails on:** HTTP errors, console/page errors, failed requests, horizontal overflow
(with culprit identification), missing or over-long titles/descriptions/canonicals, `h1`
count, heading-level skips, landmark count, unlabelled fields, missing alt text, **WCAG AA
contrast computed per element against its resolved background**, touch targets under 40px,
indexability that disagrees with `NEXT_PUBLIC_INDEXABLE`, `TO_CONFIRM` /
`aggregateRating` / `openingHoursSpecification` / `priceRange` leaking into JSON-LD, broken
internal links, and demo-layer leakage into normal mode.

`auditRawHtml` checks the **HTML actually served**, not the hydrated DOM. That distinction
has caught two real leaks; see below.

## How three brands share one app

`app/globals.css` owns only the reset, the a11y primitives and the Tycho demo layer. Each
client's design system is a separate stylesheet scoped under one wrapper class — `.eik`,
`.sbk`, `.mm` — applied by that client's nested layout, which also loads its own fonts. A
visitor to `/eik` never downloads Barlow.

Without the scope, three `:root` blocks and three sets of base element rules would overwrite
each other in whatever order the bundler happened to emit them.

## The RSC boundary

Two separate leaks have come out of the same root cause: **props passed to a `"use client"`
component are serialised into the flight payload even when the component renders `null`**.
They never appear in the DOM, so a DOM-based test passes, and they are fully readable in
view-source.

1. **Demo annotations.** Passing the sales prose as `children` shipped every annotation
   inside `self.__next_f.push(...)` on every page. `DemoNote` now takes only an `id`; the
   prose lives in `components/demo/notes.ts` and is fetched by dynamic `import()` only when
   the layer is switched on.
2. **The `TO_CONFIRM` sentinel.** It is a `Symbol` precisely so it cannot be interpolated
   into copy or serialised into JSON-LD — `JSON.stringify` drops symbol values silently.
   React does not: a registered symbol crossing into a client component is serialised as
   `"$Stycho.TO_CONFIRM"`. Anything crossing that boundary now goes through `forClient()` in
   `data/types.ts`, which turns unknown into *absent*.

`scripts/qa.mjs` asserts both against the served HTML.

## Factual integrity

Business facts are typed as `Maybe<T>` in `src/data/types.ts` and are either real or the
`TO_CONFIRM` symbol. `pruneUnconfirmed()` strips unconfirmed keys before anything reaches
JSON-LD; unconfirmed values render as a **visibly marked gap** in the UI instead.

Structured data never emits `aggregateRating`, `review`, `openingHoursSpecification`,
`priceRange`, `award` or `brand`. The QA sweep asserts this on every page.

Marine Max is verified from Brønnøysundregistrene (retrieved 23-08-2026): legal name, org
number, ENK form, registration date 10-11-2005, NACE 33.150, address, mobile number, no
registered employees. **Not claimed anywhere:** engine brands, authorised-dealer status,
certifications, mobile service, winterisation, storage, insurance work, prices, opening
hours, reviews, years of personal experience. See
`engagements/marine-max/research/questions-for-trond.md`.

## Layout

```
src/
  app/
    layout.tsx globals.css        <html>, reset, a11y, demo layer
    page.tsx                      the hub
    robots.ts sitemap.ts
    marine-max/  marine-max.css fonts.ts + 8 routes
    eik/         eik.css + 9 routes
    stabukk/     stabukk.css + 6 routes
    proposal/    index + one document per engagement
  components/
    marine/ eik/ stabukk/         per-client chrome and interactive parts
    demo/                         DemoLayer + the id-keyed notes registry
    shared/ proposal/
  data/     types.ts (integrity core + per-client domain types), marine.ts, eik.ts,
            stabukk.ts, nav.ts
  lib/      site.ts seo.ts jsonld.ts  ·  lead.ts adapters.ts (marine)  ·  enquiry.ts (tattoo)
engagements/
  marine-max/            research/ design/ content/ sales/
  tatovering-tonsberg/   research/ design/
scripts/qa.mjs
.claude/skills/          local-business-seo, norway-local-business-seo,
                         marine-service-lead-flow
```

Tailwind is imported in `globals.css` for its reset only — no utility classes carry brand
decisions, so no client's identity can drift into framework defaults.

## Enquiry data

Both enquiry flows write to `localStorage` only — no backend, no credentials, and no
personal data leaves the browser during a sales meeting. The value is the payload shape:
enumerated (not free-text) fields, attachments, UTM capture, and for Marine Max a derived
`triage` object with urgency, completeness and routing (`src/lib/lead.ts`).

`src/lib/adapters.ts` defines `LeadSink`, `Notifier` and `Scheduler` as interfaces with no
implementations that need credentials. The forms depend on `LeadSink` alone, so phase 2
binds a different implementation and touches no UI code.
