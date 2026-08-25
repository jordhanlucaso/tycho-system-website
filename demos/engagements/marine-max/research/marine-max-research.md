# Marine Max — grunnlagsresearch

Research conducted 23-08-2026 by Tycho Systems.

**Provenance tags used throughout this repo:**

| Tag | Meaning |
| --- | --- |
| `[V]` | Verified against an authoritative primary source (named inline) |
| `[W]` | Weak — appears in a third-party directory or aggregator, not independently confirmed |
| `[TO_CONFIRM]` | Unknown. Must come from Trond before it can be published |
| `[DEMO]` | Placeholder copy written by Tycho to show a layout. Not a claim about the business |

Rule applied without exception: **no `[W]` item is ever rendered as a factual claim on the website, and no `[W]` item ever enters structured data.**

---

## 1. What is verified

Source: Brønnøysundregistrene, Enhetsregisteret open API
(`https://data.brreg.no/enhetsregisteret/api/enheter/988770868`), retrieved 23-08-2026.

| Field | Value | Tag |
| --- | --- | --- |
| Legal name | `MARINE MAX - Trond Erik Nielsen` | `[V]` |
| Organisation number | 988 770 868 | `[V]` |
| Organisation form | ENK (Enkeltpersonforetak) | `[V]` |
| Registered in Enhetsregisteret | **10-11-2005** | `[V]` |
| Registered in Merverdiavgiftsregisteret | 01-09-2005 | `[V]` |
| Registered in Foretaksregisteret | 29-01-2020 | `[V]` |
| NACE code | 33.150 — Reparasjon og vedlikehold av sivile skip og båter | `[V]` |
| Registered address | Bryggeveien 3B, 3120 Nøtterøy | `[V]` |
| Municipality | Færder (3911) | `[V]` |
| Mobile | 920 11 867 | `[V]` |
| Registered employees | None registered (`harRegistrertAntallAnsatte: false`) | `[V]` |
| Bankruptcy / winding up | No | `[V]` |
| Language form | Bokmål | `[V]` |

### 1.1 The registered activity statement — read this carefully

The registry stores a free-text `aktivitet` field written by the owner:

> "Kjøp, salg og reparasjon av motorer og båtmoterer. Kjøp, salg og
> reparasjon av anleggsmaskiner og landbruksmaskiner."

Three observations that matter commercially:

1. **It is broader than "boat service".** It explicitly names *anleggsmaskiner*
   (construction machinery) and *landbruksmaskiner* (agricultural machinery). The brief
   assumed a pure marine workshop. The registry does not say that.
2. **It includes buying and selling**, not only repair — of both motors and machines.
3. **"båtmoterer" is a typo** for *båtmotorer*. This is the owner's own text, entered once
   and never revisited. It is a small but telling signal of how much attention the
   business's digital surface has had.

**This statement was filed at registration and may be up to 20 years stale.** The brief is
explicit — and correct — that an old registry description must not be read as a current
service menu. It tells us what Trond *registered to do in 2005*, not what he *does in 2026*.

Therefore: **`33.150` and the phone number are facts. The activity text is a question.**
It is the single most important item in `questions-for-trond.md`.

### 1.2 The company age finding — a real, usable differentiator

Marine Max has been continuously registered since **10-11-2005** and VAT-registered since
01-09-2005. VAT registration in Norway requires taxable turnover above the threshold, so
this is evidence of real trading activity, not a dormant shell. `[V]`

Set against the competitive field (§2 of `competitive-analysis.md`), this is significant:
the two most visible local competitors were registered in **2022** and **2023**. Marine Max
predates both by nearly two decades.

This is the one substantial trust claim we can make **today, without asking Trond
anything**, because it is machine-verifiable by anyone at brreg.no. The site states it in
the precise, defensible form:

> "Registrert og i drift på Nøtterøy siden 2005."

It does **not** say "20 års erfaring" — that is a claim about a *person*, and the registry
only documents a *company*. Trond may have worked on engines for far longer, or the ENK may
have been part-time for stretches. Until he confirms, the registry formulation is the
honest ceiling.

### 1.3 Move to Foretaksregisteret in 2020

Registration in Foretaksregisteret (29-01-2020) is optional for an ENK unless it buys goods
for resale or has employees — an ENK that *sells goods* is required to register. Combined
with the "kjøp, salg" language, this is consistent with a business that trades in motors and
parts, not only labour. `[V]` for the registration date; the inference is `[TO_CONFIRM]`.

---

## 2. What is NOT verified — and is therefore absent from the website

Everything below appears nowhere on the built site as a factual claim. Where a layout needs
the shape of such content, the site renders a visibly marked gap instead.

| Item | Status | Why it matters |
| --- | --- | --- |
| Engine brands serviced | `[TO_CONFIRM]` | Highest-value SEO and trust content that exists. See §3 |
| Authorised dealer / workshop status | `[TO_CONFIRM]` | Never assumed. Legal exposure if wrong |
| Certifications | `[TO_CONFIRM]` | — |
| Inboard / outboard / sterndrive scope | `[TO_CONFIRM]` | Changes the whole service menu |
| Petrol / diesel scope | `[TO_CONFIRM]` | — |
| Mobile service | `[TO_CONFIRM]` | Would be a major differentiator if true |
| Winter storage / opplag | `[TO_CONFIRM]` | Explicitly not assumed. Competitors lead with it |
| Winterisation (klargjøring/konservering) | `[TO_CONFIRM]` | Drives the seasonal automation case |
| Insurance-claim work | `[TO_CONFIRM]` | — |
| Diagnostics equipment | `[TO_CONFIRM]` | — |
| Marine electrical work | `[TO_CONFIRM]` | — |
| Opening hours | `[TO_CONFIRM]` | Not published anywhere we could find |
| Email address | `[TO_CONFIRM]` | Only a mobile number is public |
| Prices / hourly rate | `[TO_CONFIRM]` | — |
| Warranty terms | `[TO_CONFIRM]` | — |
| Review scores | `[TO_CONFIRM]` | None found. See §4 |
| Whether machinery work is still performed | `[TO_CONFIRM]` | The registry says yes; 2005 said yes |
| Service area boundary | `[TO_CONFIRM]` | Site claims Nøtterøy/Færder/Tønsberg only |

### 2.1 The Mercury signal — a worked example of why we do not guess

A Gule Sider category listing associated with Bryggeveien 3B surfaces the keyword cluster
"mercury motors, boat motors, boat mechanics, boat parts, boat accessories, propeller
services". `[W]`

It is tempting to turn this into "Vi utfører service på Mercury". We did not, because:

- Directory keyword clusters are **assigned by the directory** for category matching. They
  are frequently inherited from the NACE code or from a generic marine template, not
  supplied by the business.
- "Mercury" appearing in a keyword list is not evidence of authorised status, of current
  stock, or even of a preference — Mercury is simply the most common outboard brand in
  Norway, so it appears in near-every marine directory record.
- Publishing "Mercury" wrongly would be a brand claim about a third party on a page Trond
  is legally responsible for.

So it becomes question 5 in `questions-for-trond.md`, not a line of copy. This is the
general pattern for every `[W]` item found.

---

## 3. The brand-search problem: "Marine Max" vs "MarineMax"

### 3.1 The collision

`MarineMax, Inc.` (NYSE: HZO) is the largest recreational boat and yacht retailer in the
United States — 130+ locations, founded 1998, with `marinemax.com` as a high-authority
domain and a very large branded backlink profile. `[V]` (Wikipedia, marinemax.com,
GlobalData company profile.)

The Norwegian ENK registered its name in 2005 — after the US company existed, though there
is no evidence of any relationship, and none is implied.

`marinemax.no` currently resolves in DNS but returned no HTTP response when checked on
23-08-2026. `[V]` for the observation. Whether the domain is registered, parked, or
available must be confirmed at **norid.no** before any domain decision — a DNS record is not
proof of ownership status.

### 3.2 Why this cannot be fought head-on

Ranking a new single-page-worth-of-content Norwegian site for the bare query
**"marine max"** against a NYSE-listed retailer's domain authority is not a realistic
objective, and pursuing it would waste the entire content budget on a term that, in any
case, **does not describe what Trond sells**.

Worse, the term has a *demand-quality* problem independent of difficulty: a Norwegian boat
owner typing "marine max" is either (a) already a customer looking for the phone number, or
(b) looking for the American retailer. Neither is a new customer.

### 3.3 The strategic consequence — do not optimise for the brand, optimise for the need

The searches that produce a *new paying customer* never contain the brand name at all. They
contain a **problem** and a **place**:

> `båtservice nøtterøy` · `båtmotor service nøtterøy` · `båtverksted færder`
> `båtreparasjon tønsberg` · `utenbordsmotor service tønsberg`

These are winnable, because they are contested by a handful of small local firms — not by a
NYSE-listed corporation. The competitive analysis shows several of them have no website at
all.

### 3.4 Recommendation — presentation-layer differentiation, no legal change

**Do not change the registered company name.** Changing an ENK's registered name is
paperwork with tax, invoicing and banking consequences, and it is unnecessary.

Instead, the *presented* brand on every surface becomes a name-plus-category-plus-place
lockup:

```
MARINE MAX
BÅTSERVICE · NØTTERØY
```

Rendered in the site's HTML as a single semantic unit, and mirrored exactly in:

- the `<title>` of every page — always `… | Marine Max Båtservice Nøtterøy`
- the JSON-LD `name` (legal name) plus `alternateName` (`Marine Max Båtservice`)
- the Google Business Profile name field — **only if it matches real-world signage**,
  see the GBP note below
- every directory listing (NAP consistency)

**Why this works.** It stops competing on the ambiguous token "marine max" and starts
competing on "marine max **båtservice nøtterøy**" — a phrase the American company will never
target, will never rank for, and has no relevance to. Google's local pack is a different
index from organic web results; proximity and category relevance dominate there, and a
NYSE-listed Florida retailer does not appear in a Nøtterøy local pack.

Secondary effect: it makes the business **self-describing in a search result**. A user
scanning a SERP sees what the business does and where it is, without clicking. That lifts
click-through on exactly the queries we want to win.

**GBP naming caveat.** Google's guidelines require the profile name to be the real-world
name as shown on signage and marketing. Appending a descriptor is a policy risk if it is not
genuinely part of how the business presents itself. The honest sequence is: adopt
"Marine Max Båtservice" on the van, the invoice footer and the workshop sign *first*, then
the GBP name reflects reality rather than gaming it. This is in the GBP checklist as a
sequenced action, not a quick win.

---

## 4. Current digital footprint

Searches performed 23-08-2026 across Google-indexed sources.

| Surface | Finding | Tag |
| --- | --- | --- |
| Own website | **None found.** No first-party domain serving content | `[V]` |
| Google Business Profile | Not confirmed either way — must be checked while signed in | `[TO_CONFIRM]` |
| Reviews anywhere | **None found** on any indexed surface | `[V]` for "not found" |
| Facebook page | None found | `[V]` for "not found" |
| Directory presence | Present in gulesider.no, 1881.no, proff.no, registry aggregators | `[W]` |

### 4.1 What this actually means

The business's search identity is **entirely owned by third parties**. Every result a
potential customer sees is a page that:

- someone else generates, from registry data, with no input from Trond
- carries no services, no photographs, no proof of work, no opening hours
- shows competitors in the sidebar — directories monetise by selling the traffic that
  arrives looking for *you* to whoever pays them
- reproduces the 2005 activity text, typo and all

The gap is therefore not "the website could be better". There is no website. Twenty years of
real trading has produced **zero first-party digital surface**, while two firms founded in
2022 and 2023 already outrank it comprehensively.

That asymmetry — old business, new competitors, inverted visibility — is the entire sales
argument, and it is factual.

---

## 5. Local search intent

We are deliberately **not** stating search volumes. No keyword tool was available, and the
brief correctly prohibits inventing them. What follows is an intent model derived from query
structure and from what competitor sites are built to answer — not a volume forecast.

Full mapping in `local-seo-strategy.md`. Summary of the two intents that drive the design:

**Journey B — acute problem (highest commercial value, worst-served today).**
Query shape: symptom + place, or symptom alone on mobile with location services on.
*"båtmotor starter ikke"*, *"båtverksted nøtterøy"*. The user is often physically at the
boat, on a phone, frustrated, and will call the first business that visibly does this work
nearby. Time-to-phone-tap is the only metric that matters. Every competitor makes this user
scroll.

**Journey A — planned service (seasonal, plannable, repeatable).**
Query shape: service + place. *"båtservice nøtterøy"*, *"klargjøring båt vår"*. The user is
comparing two or three workshops, wants to know scope and to book without a phone call, and
is receptive to a structured form. This is the customer worth capturing into a system,
because they come back every year.

The site is built so the hero serves B in the first viewport and A immediately below it,
rather than compromising into a hero that serves neither.

---

## 6. Sources

- Brønnøysundregistrene Enhetsregisteret API — `data.brreg.no/enhetsregisteret/api/enheter/988770868`
- Brønnøysundregistrene, NACE 33.150 filtered by kommune 3911 (Færder) — 25 registered units
- jarlsomarina.no
- ulvikenmotor.no
- nøtterøybåtsenter.no (`xn--ntterybtsenter-rib11ae.no`)
- proff.no, gulesider.no, 1881.no (directory listings — `[W]` only)
- en.wikipedia.org/wiki/MarineMax, marinemax.com

**Access note:** the Tønsberg & Færder Marineservice site
(`xn--tnsberg-frder-marineservice-as-vuc18c.com`) failed DNS resolution from this network on
23-08-2026 across repeated attempts. Findings about that competitor come from search-result
snippets, their Facebook page listing and the registry, and are tagged `[W]` accordingly in
`competitive-analysis.md`. This should be re-checked before the client meeting — an
intermittently unreachable competitor site is itself worth knowing about.
