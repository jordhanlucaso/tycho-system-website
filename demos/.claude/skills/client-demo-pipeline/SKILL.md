---
name: client-demo-pipeline
description: The end-to-end process for building a speculative client demo and its sales proposal on demo.tychosystem.com — research, registry, scoped build, QA gate, and the won/declined lifecycle. Use whenever a brief arrives for a new prospective client site in the demos/ app, or when adding, ejecting or retiring a concept.
---

# Client demo pipeline

A demo is a **sales instrument for a business that has not hired us**. Every rule below
follows from that one fact.

## 0. Non-negotiables

| Rule | Why | Enforced by |
| --- | --- | --- |
| Never invent a business fact | We are writing about a real named company | `TO_CONFIRM` + `pruneUnconfirmed` + QA |
| Nothing here may be indexed | It would compete with the client's own listing | `INDEXABLE` gate + QA |
| Client CSS lives under one scope class | Several brands share one app | `demo status` + QA |
| Nothing crosses the RSC boundary but ids | Props land in view-source even when null-rendered | `auditRawHtml` in QA |
| Research before pixels | The positioning comes out of the registry, not taste | — |

## 1. Research first, and do not skip it

Do not open an editor until the research file exists.

- **Brønnøysundregistrene is the primary source**, not a directory listing:
  `data.brreg.no/enhetsregisteret/api/enheter/{orgnr}` and
  `?naeringskode=&kommunenummer=` to enumerate competitors in the same NACE + municipality.
- **WebSearch is US-indexed and near-useless for Norwegian local queries.** Do not build a
  competitive picture from it.
- An old free-text `aktivitet` field describes what was registered years ago, **not** what
  is offered today. Never convert it into a service list.
- Tag every fact `[V]` verified / `[W]` weak / `[TO_CONFIRM]` / `[DEMO]`.
- Registration date is often the strongest positioning fact available, and it is
  machine-checkable. Check it against the competitors' dates.

Write, under `engagements/<slug>/research/`:
`<slug>-research.md`, `competitive-analysis.md`, `questions-for-<owner>.md`,
`local-seo-strategy.md`, `automation-opportunities.md`.

If the evidence does not answer *"why should a customer choose them?"* — **say so and put
the question in the questionnaire.** Do not invent the answer.

## 2. Register before you build

```bash
bun run demo new <slug> --name "Client Name" --scope xx
```

Then add the block it prints to `src/data/engagements.ts`. The hub, the proposal index, the
sitemap and the QA route list all derive from that entry — nothing else needs editing, and
nothing else should be edited.

```bash
bun run demo status     # must be clean before and after every session
```

## 3. Build

Order matters: data → routes → CSS → notes → proposal.

- `src/data/<slug>.ts` — every field is real or `TO_CONFIRM`. `TO_CONFIRM` is a Symbol so it
  cannot be interpolated into copy or serialised into JSON-LD.
- Routes under `src/app/<slug>/`. Slugs are the ones the SEO plan specifies; the `/<slug>`
  prefix exists only because several clients share a host, and is stripped on eject.
- `src/app/<slug>/<slug>.css` — **every rule inside `.<scope>`**. Reset, `.skip-link`,
  `.visually-hidden` and the demo layer are in `app/globals.css`. Never redefine them.
- Fonts load in the client's own layout, never the root layout.
- Demo annotations: `<DemoNote id="xx.NN" />` only, with prose in
  `src/components/demo/notes.ts`. Ids stay opaque — a slugified title leaks the commentary
  into the flight payload.
- JSON-LD emits only what is visible on the page and verified. Never `aggregateRating`,
  `review`, `openingHoursSpecification`, `priceRange`, `award`, `brand`, or a personal
  legal name.

Copy: specific and local. Banned openers — *"Vi brenner for…"*, *"Din trygghet er vår
lidenskap"*, *"Kvalitet i alle ledd"*, *"Vi tar din opplevelse til neste nivå"*.

## 4. The proposal

`src/app/proposal/<engagement>/page.tsx`, `noindex`, listed automatically at `/proposal`.

Sell the outcome, not the stack. Do not explain React or Next.js unless asked. **No
fabricated ROI** — no "+300% customers", no invented traffic estimates. The honest
argument is the gap analysis plus what the competitors demonstrably do not do.

Give it a layout that supplies the client's CSS scope but **not** the site chrome — a
proposal wearing the client's header reads as a page of their site rather than a document
about it.

## 5. QA gate — the definition of done

```bash
bun run build && npx next start -p 4311   # one shell
bun run qa                                # another
```

Must be `PASS`. It checks console errors, broken links, horizontal overflow, heading
structure, landmarks, labels, alt text, WCAG AA contrast per element against its resolved
background, touch targets, indexability, and — via `auditRawHtml` — that no annotation
prose, `TO_CONFIRM` sentinel or personal name reaches the served HTML.

Then **look at the screenshots** in `qa-screenshots/` at 390 and 1440, write one explicit
design critique into `engagements/<slug>/design/`, fix what it finds, and run again.

## 6. Lifecycle

| Status | Meaning | Action |
| --- | --- | --- |
| `draft` | being built | — |
| `presented` | shown to the client; sets the retention clock | set `presented:` to the date |
| `won` | client said yes | `demo eject`, then `demo retire` |
| `declined` | said no, or the clock ran out | `demo retire` |

Retention is **60 days** from `presented`. `demo status` flags overdue engagements.

```bash
bun run demo eject <concept> ../<client>-site   # standalone app, demo layer stripped
bun run demo retire <engagement>                # deletes routes, components, data, docs
```

`eject` is a starting point, not a finished handover — it prints the checklist of what a
human must verify. `retire` deletes files but deliberately leaves the registry block, the
notes and any nav entries, because each needs a judgement call.

## 7. Deliverables checklist

- [ ] `engagements/<slug>/research/` — 5 documents, every fact tagged
- [ ] `engagements/<slug>/design/<slug>-design-direction.md` — with a pre-build critique
- [ ] `engagements/<slug>/content/photo-shot-list.md` if photography is needed
- [ ] `engagements/<slug>/sales/demo-script.md` — a 5-minute presentation
- [ ] Registry entry, and `demo status` clean
- [ ] Proposal at `/proposal/<engagement>`
- [ ] `typecheck`, `lint`, `build` clean; `qa` PASS
- [ ] Post-build critique appended to the design direction
