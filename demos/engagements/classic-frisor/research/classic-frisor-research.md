# Classic Frisør, Nøtterøy — research

**Retrieved 24-08-2026.** Primary source is Brønnøysundregistrene (Enhetsregisteret open
API). Directory listings and Google Business data are treated as unverified.

## Provenance tags

| Tag | Meaning |
| --- | --- |
| `[V]` | Verified against a primary source, named below |
| `[W]` | Weak — single third-party source, internal note only, never published |
| `[TO_CONFIRM]` | Unknown. Must come from the owner |
| `[DEMO]` | Written by Tycho Systems as clearly-labelled concept copy |

---

## 1. The identity question, answered as far as public record allows

The brief flagged an ambiguity between the Nøtterøy Google listing and a registered company
called CLASSICFRISØR AS. **The registry resolves it, and the answer is not the obvious one.**

### 1.1 CLASSICFRISØR AS is a Tønsberg company with no Nøtterøy presence

`[V]` Enhetsregisteret, org. 927 208 601:

| Field | Value |
| --- | --- |
| Name | CLASSICFRISØR AS |
| Form | Aksjeselskap |
| Registered | 07-06-2021 (founded 19-05-2021) |
| Address | Svend Foyns gate 1A, 3126 Tønsberg — **kommune Tønsberg**, not Færder |
| NACE | 96.210 Frisering og barbering |
| Purpose | "Frisørvirksomhet" |
| MVA | Registered from 01-09-2021 |
| Sub-units | **Exactly one — also at Svend Foyns gate 1A, Tønsberg** |

That last row is the decisive one. A Norwegian company must register a sub-unit
(*underenhet*) for each fixed place of business. CLASSICFRISØR AS has one, and it is in
Tønsberg. **There is no registered CLASSICFRISØR AS presence at Smidsrødveien 15.**

### 1.2 One hairdresser is registered at Smidsrødveien 15, and it is not that company

`[V]` Enhetsregisteret, all NACE 96.210 units in Færder (kommune 3911), filtered to the
address:

| Field | Value |
| --- | --- |
| Name | **SAEED** |
| Org. | **934 237 498** |
| Form | **Enkeltpersonforetak** |
| Registered | **08-10-2024** |
| Address | Smidsrødveien 15, 3120 Nøtterøy (Færder) |
| NACE | 96.210 Frisering og barbering |
| Activity | "Frisering og skjønnhetspleie." |
| MVA | **Not registered** |
| Employees | None registered |

### 1.3 What this does and does not establish

**Established `[V]`:**

- Exactly one hairdressing business is registered at Smidsrødveien 15: the sole
  proprietorship **SAEED**, since 08-10-2024.
- CLASSICFRISØR AS (Tønsberg) has no registered unit at that address.
- `classic-frisor.no` belongs to an unrelated Classic Frisør operation (Kleppestø/Askøy)
  and is not a source for anything here.

**Not established — `TO_CONFIRM_LEGAL_ENTITY`:**

- That the Google listing "Classicfrisør" *is* SAEED. A trading name does not appear in the
  registry, so this is a strong inference from address + industry + exclusivity, not proof.
- Whether the salon rents a chair inside another business, or holds the lease itself.
- Whether there is any commercial link to CLASSICFRISØR AS in Tønsberg (a franchise, a
  shared name, a former employer, or pure coincidence).

**This is one question to the owner, and it must be asked before anything is published.**
See `questions-for-owner.md` §1. Until then the site carries no legal entity, no
organisation number and no structured data identifier.

### 1.4 Why it matters commercially, not just legally

Three names are in play — *Classicfrisør* (the listing), *CLASSICFRISØR AS* (a Tønsberg
company), *Classic Frisør* (Askøy, with the matching .no domain). A customer searching
"classic frisør" gets a mixed result set, and the Nøtterøy salon is the smallest and
newest of the three. **It should not fight for the bare brand term.** The recommendation is
to lead with place, not name — see `local-seo-strategy.md` §3.

---

## 2. What the business appears to be

`[V]` Registered 08-10-2024 — **under two years old**, and the newest hairdresser on its
street by fourteen years.

`[V]` Enkeltpersonforetak with no registered employees: a one-person operation, or close
to it. `[V]` Not MVA-registered, which in Norway means turnover under the 50 000 NOK
threshold or a registration not yet filed. Either reading points the same way: this is a
small, new, single-chair business.

`[W]` The public Google listing shows a 5.0 rating from **one** review, phone
+47 915 37 959, category "beauty salon / hair salon". Treated as unverified: a listing can
be created or edited by anyone, and one review is not a review footprint.

**None of these facts belong on the website.** They are the strategic picture, not copy.
"New" and "one chair" are exactly what the design should make into strengths without ever
stating them as claims.

---

## 3. Smidsrødveien is a hairdressing street

`[V]` Six hairdressing units registered on Smidsrødveien alone:

| No. | Business | Form | Registered | Employees |
| --- | --- | --- | --- | --- |
| 7 | TRIX FRISØR AS | AS | 1999 (founded 1998) | — |
| **15** | **SAEED — the subject** | **ENK** | **2024** | — |
| 9 | TEIE BARBER SHOP AS | AS | 2018 | **7** |
| 45 | LE MONDE FRISØR AS | AS | 2013 | — |
| 83 | PUDDER & PISTOLER | ENK | 2019 | — |
| 89 | HIMMEL OG HÅR | ENK | 2022 | — |

Trix is three doors away and has been trading for twenty-eight years. Teie Barber Shop is
two doors away with seven employees. **Classic cannot win this street on heritage or on
scale, and should not try.**

What it can win is the search. See §4.

---

## 4. The market gap: almost nobody here is findable

`[V]` Domain probe, 24-08-2026. Of the six salons on Smidsrødveien plus the two other named
competitors:

| Business | Website | Notes |
| --- | --- | --- |
| Bibbis Frisør | **bibbisfrisor.no** | WordPress + Yoast, GA, four salons, per-salon online booking |
| Teie Barber Shop | **teiebarbershop.no** | Client-rendered SPA — empty HTML shell, content needs JS |
| Trix Frisør | none found | — |
| Le Monde Frisør | none found | — |
| Harmony Hårpleie | none found | — |
| Himmel og Hår | none found | — |
| Pudder & Pistoler | none found | — |
| **Classic Frisør** | **none** | — |

`[W]` Absence of an obvious domain is not proof a business has no site; it may trade on
Facebook or under a name we did not guess. But the pattern is consistent and it is the
single most useful commercial finding in this research:

> **On the street where Classic sits, one competitor has a real website and one has a
> website search engines struggle to read. Everyone else is invisible except through Google
> Maps and word of mouth.**

A well-built, genuinely local, fast, bookable site is not a marginal gain in this market.
It is a category difference.

---

## 5. Booking expectations

`[V]` Bibbis operates per-salon online booking, offered as a choice of four salons
including "Bibbis Frisør Nøtterøy (Kirkeveien)". Their booking page is a routing page: pick
the salon, then go to that salon's booking.

`[V]` Teie Barbershop's meta description ends "Bestill time i dag!" — booking is the
intended action, but the page is JS-rendered so what happens next could not be read without
executing scripts.

`[TO_CONFIRM]` What Classic uses today. The realistic options in the Norwegian salon market
are Fixit, Timma, a Facebook/Instagram message flow, or the phone. **The site must not
assume.** It is built against a `BookingProvider` interface with a phone fallback that is
correct on day one and correct after an integration — see `src/data/classic-frisor.ts`.

---

## 6. Sources

| Source | Retrieved | Used for |
| --- | --- | --- |
| `data.brreg.no/enhetsregisteret/api/enheter/927208601` | 24-08-2026 | CLASSICFRISØR AS |
| `data.brreg.no/.../underenheter?overordnetEnhet=927208601` | 24-08-2026 | Its single Tønsberg sub-unit |
| `data.brreg.no/.../underenheter?naeringskode=96.210&kommunenummer=3911` | 24-08-2026 | All 35 Færder hairdressers |
| `data.brreg.no/enhetsregisteret/api/enheter/934237498` | 24-08-2026 | SAEED (ENK) |
| `bibbisfrisor.no`, `teiebarbershop.no` | 24-08-2026 | Competitor web presence |
| Google Business listing | reported in brief | `[W]` phone, rating, category |

**Not used:** `classic-frisor.no` (Askøy — different business), any competitor's photography,
copy, prices or staff information.
