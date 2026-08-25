---
name: norway-local-business-seo
description: Local SEO for Norwegian businesses serving a specific area — NAP, LocalBusiness schema, service-area vs storefront, titles, service pages, GBP, reviews, Core Web Vitals. Use when building or auditing a site for a business whose customers search by place name.
---

# Norwegian local business SEO

For businesses whose customers search *service + stedsnavn*. Written for small operators —
one location, few pages, no content team.

## 0. The rule that overrides everything

**Never publish a claim you cannot verify.** Certifications, authorised-dealer status,
brands, hours, ratings, years of experience. An unverified claim in structured data is a
manual-action risk; on the page it is a lie the owner has to defend.

Represent unknowns as `TO_CONFIRM` in the data layer and strip them before serialisation.
Make it a test, not a discipline.

## 1. Search intent in Norwegian

Norwegians search in Norwegian, with the place name attached:

```
[tjeneste] [sted]        båtservice nøtterøy · rørlegger sandefjord
[tjeneste] i [sted]      tannlege i tønsberg
[problem]                varmtvannsbereder lekker
[tjeneste] nær meg       rørlegger nær meg
```

Practical consequences:

- **Æ, Ø, Å** — users type them, and Google handles both forms. Use correct orthography in
  content and titles. Use ASCII in **slugs** (`/batservice`, not `/båtservice`) — IDN slugs
  break when copied, shared and logged.
- **Compound words are single words.** `båtservice`, not `båt service`. Splitting them is
  the most common mistake in translated copy, and it reads as foreign.
- **Kommunereformen matters.** Many post towns are no longer municipalities (Nøtterøy → Færder,
  2018). People still search the old name. Use the post town in the address, and name both
  the post town and the municipality in body copy.
- **"nær meg"** cannot be targeted with text. It is served by GBP proximity. Do not make a
  "nær meg" page.

## 2. NAP

One canonical block. Byte-identical on the site, GBP, and every directory.

```
Bedriftsnavn
Gateadresse 1
1234 Poststed
000 00 000
```

- Postcode **before** place name. Always.
- Display phone grouped as Norwegians read it: mobile `000 00 000`, landline `00 00 00 00`.
- `href="tel:+47…"` and JSON-LD `telephone` must be **E.164** (`+4790011867`).
- Fix Æ/Ø/Å corruption in directories. `Notteroy` and `Nøtterøy` are different entities to a
  matching algorithm.

## 3. Schema type — pick the honest one

| Situation | Type |
| --- | --- |
| Customers visit a physical premises | `LocalBusiness` subtype |
| Work performed at the customer's location | `LocalBusiness` + `areaServed`, no `openingHours` |
| Trade/professional service, no retail | `ProfessionalService` |
| Retail premises | `Store` |
| Road vehicles only | `AutoRepair` — **not** for boats, machinery or bikes |

Emit only what is true:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://example.no/#business",
  "name": "Legal name",
  "alternateName": "Trading name",
  "address": { "@type": "PostalAddress", "streetAddress": "…",
               "postalCode": "3120", "addressLocality": "Nøtterøy",
               "addressCountry": "NO" },
  "telephone": "+4790011867",
  "areaServed": [{ "@type": "Place", "name": "Nøtterøy" }],
  "identifier": "988770868",   // organisasjonsnummer — a strong Norwegian entity signal
  "foundingDate": "2005-11-10" // only if registry-verifiable
}
```

**Omit — do not guess:** `aggregateRating`, `review`, `priceRange`, `openingHoursSpecification`,
`geo`, `award`, `numberOfEmployees`, `brand`.

Include `identifier` with the organisasjonsnummer whenever you have it. It is uniquely
Norwegian, machine-checkable against brreg, and disambiguates businesses with common names.

Every structured claim needs a **visible on-page counterpart**. Schema describes the page; it
does not add to it.

## 4. Service-area vs storefront

If customers do not visit:

- Do **not** emit `openingHoursSpecification` — there is nothing to open.
- Do emit `areaServed`, listing only real areas.
- On GBP, configure as a service-area business and **hide the address** if it is a home.
- Never list a town you have no presence in and do not travel to.

## 5. Titles and metas

- **≤ 60 characters.** Norwegian words are long; compounds eat the budget fast.
- Pattern: `[Tjeneste] [Sted] — [Merke]`.
- Put the place name in the **first half** — mobile SERPs truncate.
- Meta description ≤ 155 chars, in Norwegian, containing the action ("Ring …" / "Send inn …").
- Never duplicate a title or a description across pages.

## 6. Service pages

**One page per intent the business genuinely satisfies.**

Do not generate `/[tjeneste]-[sted]` for every town. For a single-location business that is a
doorway pattern — a spam-policy violation and, more practically, a claim of presence that
does not exist.

A service page earns indexing if it has: what the service covers, what it does not, what the
customer must supply, what happens next, and a way to start. If you cannot write those five
without inventing, the page is not ready.

## 7. Internal linking

- Hub (`/tjenester`) → spokes. Spokes cross-link once.
- Descriptive anchors. Never "les mer" or "klikk her".
- Every page links to the conversion page and exposes the phone number.
- Breadcrumbs, mirrored in `BreadcrumbList`.
- NAP in the footer sitewide.

## 8. Canonicals, sitemap, robots

- Self-referencing absolute canonical from a single `SITE_ORIGIN` constant.
- One slug convention (no trailing slash) — enforced.
- `sitemap.xml`: public, indexable URLs only. Never internal or `noindex` pages.
- `robots.txt`: reference the sitemap; `Disallow` internal routes.
- A `noindex` page must **also** be excluded from the sitemap. Contradicting yourself wastes
  crawl budget and signals carelessness.

## 9. Images

- Descriptive Norwegian filenames: `batmotor-service-notteroy.jpg`.
- Alt text describing the image, not stuffed with keywords. Decorative images: `alt=""`.
- Real photographs. Stock imagery destroys credibility for a local trade — and is often
  recognisably the same photo a competitor uses.
- Modern formats, explicit `width`/`height` (CLS), lazy-load below the fold, **eager** for the
  LCP image.

## 10. OpenGraph

```html
<meta property="og:locale" content="nb_NO">
```

Absolute URLs. Per-page title and description. An OG image with the business name and place
readable at thumbnail size — it is often seen first in a Messenger or SMS share, which is how
local recommendations actually travel.

## 11. Google Business Profile

For local queries the profile outranks the website. Order of operations:

1. **Claim or create.** Auto-generated unclaimed profiles are common.
2. **Primary category** — the single most important ranking field. One category, exactly right.
3. NAP identical to the site. Website URL set.
4. Hours — only if real. Wrong hours produce one-star reviews.
5. **Photos** — 10+ real ones, uploaded from the phone that took them.
6. Services mirroring the site's wording.
7. Monthly Posts.

**Naming:** the profile name must match real-world signage. Adding descriptors ("Bedrift
Båtservice") is a policy risk unless the business actually presents itself that way. Change
the signage first, then the profile.

## 12. Reviews

- Ask in person at handover. Highest yield moment.
- Short link or QR on the invoice.
- Reply to all of them.
- **Never** incentivise, gate on sentiment, or buy. In a small community it is noticed.
- A steady trickle beats a burst — a spike looks bought to both Google and humans.

## 13. Core Web Vitals

Local search is overwhelmingly mobile, often on poor coastal or rural connectivity.

- Static/prerendered HTML. Content must not require JavaScript.
- Self-host fonts, `font-display: swap`, subset to `latin` + Norwegian glyphs.
- LCP is usually the hero image or heading — preload it, never lazy-load it.
- Reserve dimensions for everything to keep CLS at zero.
- Minimal client JS. A brochure site with a form does not need a framework runtime on every
  route.

## 14. Audit checklist

```
☐ NAP identical: site, GBP, directories (incl. Æ/Ø/Å)
☐ lang="nb"  ·  og:locale=nb_NO
☐ Unique title ≤60 and description ≤155 per page
☐ Place name in first half of title
☐ One H1 per page, no heading-level skips
☐ Self-referencing canonical, absolute
☐ Sitemap: public pages only; noindex pages excluded
☐ robots.txt references sitemap
☐ Valid JSON-LD; no unverified fields; every claim visible on page
☐ E.164 in tel: and in JSON-LD
☐ Real photos with Norwegian filenames and honest alt text
☐ Phone tappable and reachable within one screen on mobile
☐ No horizontal overflow at 375px
☐ Renders without JavaScript
☐ GBP claimed, category correct, 10+ photos
☐ Review acquisition running
```
