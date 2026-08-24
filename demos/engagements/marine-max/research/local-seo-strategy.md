# Lokal SEO-strategi — Marine Max

**No search volumes appear in this document.** No keyword tool was available, and inventing
volume figures would make every downstream decision unauditable. What follows is an *intent
model* — derived from query grammar, from what competitor sites are structured to answer,
and from how Norwegian boat owners phrase problems. Priorities are reasoned, not measured.

When Trond confirms the service list, this should be re-run against Search Console data from
the live site — real query data from his own domain beats any third-party estimate.

---

## 1. The core constraint

Two facts shape everything:

1. **A NYSE-listed company owns the brand term.** See `marine-max-research.md` §3. We do not
   contest "marine max".
2. **Only verified services get an indexed page.** Most of the service menu is
   `[TO_CONFIRM]`. So this strategy ships in two phases, and Phase 2 is gated on the
   questionnaire — not on budget.

The brief's warning against thin SEO pages is the operative constraint. It is trivial to
generate `/batservice-notteroy`, `/batservice-tonsberg`, `/batservice-faerder`,
`/batservice-tjome` with the place name swapped. That is a doorway-page pattern, it violates
Google's spam policies, and for a business with one location it is also a lie —
`/batservice-tjome` would imply a Tjøme presence that does not exist.

**Rule applied: one page per intent the business can genuinely satisfy. Place names live in
the content and the schema, not in a page-per-town matrix.**

---

## 2. Intent map

| # | Query cluster | Intent | Journey | Target page | Priority |
| --- | --- | --- | --- | --- | --- |
| 1 | båtservice nøtterøy · båtverksted nøtterøy · båtservice færder | Find a workshop nearby | A | `/` | **1** |
| 2 | båtmotor service nøtterøy · motorservice båt tønsberg · utenbordsmotor service | Engine service specifically | A | `/batmotor-service` | **1** |
| 3 | båtreparasjon nøtterøy · reparasjon båtmotor tønsberg | Something is broken | B | `/batreparasjon` | **1** |
| 4 | båtmotor starter ikke · båtmotor stopper · motoren går ujevnt | Symptom, acute | B | `/batreparasjon` (symptom section) | **2** |
| 5 | båtverksted tønsberg · båtservice tønsberg | Adjacent town | A | `/` + `/tjenester` | 2 |
| 6 | [merke] service nøtterøy — e.g. mercury service | Brand-specific | A/B | **blocked** — needs Q2.1 | **1 when unblocked** |
| 7 | mobil båtservice · båtmekaniker kommer til båten | Mobile service | B | **blocked** — needs Q3.2 | **1 if confirmed** |
| 8 | klargjøring båt vår · konservering båt høst | Seasonal | A | **blocked** — needs Q1.1 | 2 if confirmed |
| 9 | vinteropplag båt nøtterøy | Storage | A | **blocked** — needs Q3.5 | 3 if confirmed |
| 10 | marine max nøtterøy | Branded, existing customer | — | `/` | 3 (defensive) |

Clusters 6 and 7 are marked priority 1 *when unblocked* deliberately: brand terms and mobile
service are the two highest-value clusters available to this business, and both are one
questionnaire answer away. That is the argument for getting the questionnaire back.

### 2.1 What is deliberately not targeted

- **"marine max"** as a primary target — conceded to the US company.
- **Any town without a presence** — Sandefjord, Horten, Larvik, Tjøme. Not until §3.5 confirms.
- **"båt til salgs"** — a different business.
- **Generic "båt"** head terms — no commercial intent, unwinnable, worthless.

---

## 3. Page map, titles and H1s

Titles are ≤ 60 characters so they do not truncate in a mobile SERP. Every title ends in the
brand lockup; every H1 states the service and the place in natural Norwegian.

### `/` — Homepage
- **Title:** `Båtservice på Nøtterøy — Marine Max` (35)
- **Meta:** `Båtservice, motorservice og reparasjon på Nøtterøy. Registrert og i drift siden 2005. Ring 920 11 867 eller send inn jobben.`
- **H1:** `Båtservice på Nøtterøy`
- **Intent:** 1, 5, 10. Must serve Journey B in the first viewport.

### `/tjenester` — Service overview
- **Title:** `Tjenester — båtservice og motorservice | Marine Max` (50)
- **H1:** `Hva vi gjør`
- **Job:** hub page; links to every verified service page. Internal-link spine.

### `/batmotor-service` — Engine service
- **Title:** `Båtmotor service Nøtterøy — Marine Max` (37)
- **Meta:** `Service og vedlikehold av båtmotor på Nøtterøy og i Færder. Fortell oss hva motoren gjør, så tar vi den derfra.`
- **H1:** `Service på båtmotor`
- **Intent:** 2. Highest-value planned-work page.

### `/batreparasjon` — Repair and fault-finding
- **Title:** `Båtreparasjon og feilsøking Nøtterøy — Marine Max` (48)
- **H1:** `Når noe har sluttet å virke`
- **Intent:** 3, 4. Carries the symptom list — **the only symptom-led page in this market.**

### `/om-marine-max` — About
- **Title:** `Om Marine Max — båtservice på Nøtterøy siden 2005` (48)
- **H1:** `Marine Max`
- **Job:** the tenure fact, the person, the workshop. Pure trust page.

### `/tidligere-arbeid` — Work
- **Title:** `Tidligere arbeid — Marine Max båtservice` (40)
- **H1:** `Tidligere arbeid`
- **Job:** proof. Currently placeholders; becomes the strongest page once photos exist.

### `/bestill-service` — Enquiry
- **Title:** `Bestill service — Marine Max Nøtterøy` (37)
- **H1:** `Fortell oss om båten`
- **Job:** conversion. Long-tail entry for "bestille service båt".

### `/kontakt` — Contact
- **Title:** `Kontakt — Marine Max, Bryggeveien 3B Nøtterøy` (44)
- **H1:** `Kontakt`
- **Job:** NAP, map, phone. Ranks for "marine max telefon" / navigational queries.

### Not built until unblocked
`/mobil-batservice` (Q3.2) · `/batservice-[merke]` (Q2.1) · `/klargjoring-vinteropplag` (Q1.1, Q3.5)

---

## 4. Internal linking

A hub-and-spoke spine, kept small on purpose — eight pages do not need a link graph.

```
                    /  (hub)
                    │
     ┌──────────────┼──────────────┬─────────────┐
     ▼              ▼              ▼             ▼
 /tjenester   /om-marine-max  /tidligere-   /kontakt
     │                          arbeid
     ├──► /batmotor-service ──┐
     └──► /batreparasjon ─────┤
                              ▼
                      /bestill-service
```

Rules applied in the build:

- **Every** page links to `/bestill-service` and exposes the phone number. No dead ends.
- Service pages cross-link to each other once, in body copy, with descriptive anchors
  ("service på båtmotoren" — never "les mer" or "klikk her").
- `/tidligere-arbeid` links back into the service page matching each job type.
- Breadcrumbs on every non-home page, mirrored in `BreadcrumbList` JSON-LD.
- The footer carries the full NAP on every page — one consistent block, one source of truth.

---

## 5. NAP consistency

The canonical block. This exact form, character for character, everywhere:

```
Marine Max
Bryggeveien 3B
3120 Nøtterøy
920 11 867
```

| Rule | Reason |
| --- | --- |
| Postcode **before** place name | Norwegian convention. `3120 Nøtterøy`, never `Nøtterøy 3120` |
| Display phone as `920 11 867` | How a Norwegian reads a mobile number: 3-2-3 |
| `tel:+4792011867` in the href | E.164 required for the dialler to work internationally |
| `+4792011867` in JSON-LD | E.164 in structured data, always |
| "Nøtterøy" with **ø**, not "Notteroy" | Directories mangle this. It must be corrected wherever found |
| Municipality is **Færder** | Nøtterøy has not been its own kommune since 2018. Post town is still Nøtterøy |

**Action outside the site:** audit gulesider.no, 1881.no and proff.no for variants. Every
inconsistent NAP record dilutes the entity signal Google builds for the business.

---

## 6. Structured data

Implemented in `src/lib/jsonld.ts`. Emitted only where factually supported.

### 6.1 What is emitted

- **`ProfessionalService`** on `/` — a boat workshop is not `Store` (no retail premises
  verified) and not `AutoRepair` (that is road vehicles). `ProfessionalService` is the
  honest supertype.
  Fields: `name` (legal name), `alternateName` ("Marine Max Båtservice"), `address`
  (`PostalAddress`), `telephone` (E.164), `url`, `areaServed`, `foundingDate: "2005-11-10"`,
  `identifier` (org.nr 988770868), `knowsLanguage: "no"`.
- **`Service`** on each verified service page, with `provider` referencing the business by
  `@id` and `areaServed` naming Nøtterøy, Færder, Tønsberg.
- **`BreadcrumbList`** on every non-home page.
- **`WebSite`** on `/` with `alternateName`, to support the entity's name disambiguation.

### 6.2 What is NOT emitted, and why

| Never emitted | Reason |
| --- | --- |
| `aggregateRating` / `review` | No reviews exist. Fabricating them is a manual-action risk and a lie |
| `openingHoursSpecification` | Hours unknown. Omitted entirely — a wrong hour sends someone to a closed workshop |
| `priceRange` | Unknown |
| `award`, `hasCredential` | Unknown |
| `brand` / `makesOffer` naming engine brands | Blocked on Q2.1. Naming a brand you are not authorised for is a trademark problem |
| `numberOfEmployees` | Registry says none registered; publishing "0" is misleading |
| `geo` coordinates | Not surveyed. A wrong pin is worse than no pin |

Enforced in code: `pruneUnconfirmed()` strips any `TO_CONFIRM` value before serialisation,
and the QA sweep fails the build if `TO_CONFIRM` or `aggregateRating` appears in any page's
JSON-LD. Integrity is a test, not a promise.

### 6.3 `foundingDate` — the one date we can prove

`2005-11-10` comes from Enhetsregisteret and matches the visible on-page claim ("siden
2005"). Every structured claim has a visible counterpart — that is the rule from the SEO
skill, and this is the only date that satisfies it.

---

## 7. Technical SEO

| Item | Implementation |
| --- | --- |
| `lang` | `<html lang="nb">` |
| Canonicals | Self-referencing absolute, from `NEXT_PUBLIC_SITE_ORIGIN` |
| Sitemap | `src/app/sitemap.ts` — public routes only. `/proposal` excluded |
| robots.txt | `src/app/robots.ts` — `Disallow: /proposal` |
| `/proposal` | `noindex, nofollow` in metadata **and** disallowed. Belt and braces |
| OpenGraph | `og:locale: nb_NO`, per-page title/description, absolute URLs |
| Trailing slashes | Consistent, no-slash. One URL per page |
| Rendering | Static prerender for every route. No client-side-only content |
| hreflang | None. Single-language site — an unnecessary hreflang is a bug source |

**No `/en` version.** The customer is Norwegian, searching in Norwegian, on Nøtterøy. An
English translation would split authority and serve nobody.

---

## 8. Google Business Profile checklist

**No external account was touched.** This is strategy for Trond to execute.

The GBP matters more than the website for cluster 1. For "båtverksted nøtterøy" on a phone,
the local pack occupies the first screen and organic results start below it.

### 8.1 Ownership first

☐ Sign in and search the business name + address. Determine whether a profile exists.
Registry-derived profiles are often auto-generated and unclaimed.
☐ If it exists → **claim it** (postcard/phone verification).
☐ If not → **create it**. This is the single highest-leverage action in the project, and it
is free.

### 8.2 Categories

☐ Primary: **Båtreparasjonsverksted** (Boat repair shop) — matches NACE 33.150.
☐ Secondary, only if confirmed: *Motorbåtforhandler*, *Maskinreparasjonsverksted*.
☐ Do **not** add categories for services not performed. Category spam suppresses the profile.

### 8.3 Core fields

☐ Name — see naming caveat in `marine-max-research.md` §3.4. Signage first, then GBP.
☐ Address `Bryggeveien 3B, 3120 Nøtterøy` — exact NAP.
☐ Phone `920 11 867` — must match the site exactly.
☐ Website → the new domain, once live.
☐ Opening hours — **only once Q4.1 is answered.** Wrong hours are worse than none; a
customer who drives to a closed workshop leaves a one-star review.
☐ Service area — Nøtterøy, Færder, Tønsberg. Only what Q3.3 confirms.
☐ Services list — mirror the site's verified services exactly, same wording.
☐ Description (750 chars) — lead with *båtservice, motorservice, Nøtterøy, siden 2005*.

### 8.4 Photos — the highest-ROI item after claiming

☐ Minimum 10 real photographs. See `content/photo-shot-list.md`.
☐ Exterior, interior/workshop, at-work, owner portrait, completed jobs.
☐ Upload from the phone that took them (EXIF location is a corroborating signal).
☐ **No stock photography.** Google's own data shows profiles with real photos get materially
more interaction — and stock yacht imagery actively damages a workshop's credibility.

### 8.5 Reviews

☐ Zero today. **Target: 5–10 genuine reviews within 60 days.**
☐ Ask in person at handover, when the customer is happiest — not by mass email.
☐ Use a short link or QR on the invoice. Friction kills review rates.
☐ Reply to every review, positive and negative. Replies are visible and are a ranking-adjacent
trust signal.
☐ **Never** incentivise, gate, or buy reviews. Against Google policy, and this is a
community where it would be noticed.

### 8.6 Ongoing

☐ One Post per month — seasonal ("nå tar vi imot vårklargjøring"), or a finished job.
☐ Enable messaging **only if** Trond will answer within a day. An unanswered message channel
is displayed as such and is worse than no channel.
☐ Keep Q&A seeded with the questions from §6 of the questionnaire.

---

## 9. Content opportunities

Ranked by value, gated where honesty requires it.

1. **Symptom pages** — "motoren starter ikke", "motoren går ujevnt", "unormal lyd fra
   drevet". Nobody in this market has these. They match Journey B exactly and can be written
   from generally-known marine mechanics without claiming anything about Marine Max. *Shipped
   in a limited form on `/batreparasjon`; expandable to standalone pages.*
2. **"Hva koster en båtservice?"** — the most-asked, least-answered question in the trade.
   Cannot be published without Q on pricing. High value when unblocked.
3. **Brand pages** — blocked on Q2.1. Highest raw traffic potential.
4. **Seasonal guides** — spring commissioning, autumn lay-up. Blocked on Q1.1.
5. **Completed work with real photos** — not "content" in the SEO sense but the strongest
   conversion asset available, and it feeds GBP posts.

**Explicitly rejected:** a blog. A sole operator will not maintain it, an abandoned blog is a
negative quality signal, and none of the above requires blog infrastructure to publish.
