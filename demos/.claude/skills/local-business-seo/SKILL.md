---
name: local-business-seo
description: Portfolio and gallery SEO, and the structure of a conversion-focused local landing page, for visual local businesses (tattoo studios, salons, photographers, interiors). Use when the work is about ranking image-led pages or laying out a landing page that has to convert, not about local SEO fundamentals — for NAP, schema, service-area, titles, GBP and reviews use norway-local-business-seo instead.
---

# Portfolio SEO and local landing pages

> Scope note: sections 1–7, 9, 10 and 12 below overlap with `norway-local-business-seo`,
> which is the newer and more Norway-specific treatment and should be preferred where they
> disagree. The distinctive material here is **§8 Images and portfolio SEO** and
> **§11 Conversion-focused local landing page structure**. The two skills are worth merging.

# Local business SEO (Norwegian market)

Goal: rank for `<tjeneste> <by>` intent, and convert the click. Rankings without an
enquiry path are worthless; a beautiful enquiry path nobody finds is equally worthless.

## 1. One intent, one URL

The single most common failure in this market is the **one-page site**. A page can rank for
one primary intent. If `/` must serve *tatovering Tønsberg*, *piercing Tønsberg* and
*cover-up Tønsberg*, it ranks well for none.

Give every commercially distinct service its own route with its own title, H1, copy and
internal links:

```
/                       → brand + primary service + city
/tatovering             → primary service
/piercing               → second service (separate revenue line = separate page)
/tatovering/cover-up    → long-tail, only if there is real content to justify it
/priser                 → price intent is a distinct, high-commercial-value query
```

Do not create a page you cannot fill with genuinely useful content. A thin page is worse
than no page.

## 2. Metadata

**Title tag** — 50–60 chars. Pattern: `Primærtjeneste i <By> | <Merkenavn>`.
Put the service and the city first; the brand name last. Norwegians search for the service,
not the brand.

- ✅ `Tatovering og piercing i Tønsberg | Eik Tattoo`
- ❌ `Eik Tattoo & Piercing – Hjem`
- ❌ `Tatovering Tønsberg tattoo Tønsberg tatovør Tønsberg` (stuffing; will be rewritten by Google)

**Meta description** — 140–160 chars. Not a ranking factor; it is ad copy. Include the city,
one concrete differentiator, and an action.

- ✅ `Tatovering og piercing i Tønsberg. Send inn idéen din med bilder og mål – du får svar med forslag og pris før du booker time.`

**Per-page uniqueness is mandatory.** Duplicated titles/descriptions across routes actively
suppress the weaker page.

## 3. Heading hierarchy and semantic HTML

- Exactly **one `<h1>` per page**, containing the page's actual intent — usually service + city.
- Never skip levels. `h1 → h2 → h3`. Do not choose heading level for font size; choose it for
  structure and style it with CSS.
- Use real landmarks: `<header>`, `<nav>`, `<main>` (one per page), `<section>` with an
  accessible name, `<article>`, `<footer>`, `<address>` for the physical address,
  `<time datetime="…">` for hours and dates.
- Navigation, FAQ and lists must be real `<nav>`, `<dl>`/`<details>` and `<ul>` — not divs.

## 4. NAP consistency — the highest-leverage local factor

**N**ame, **A**ddress, **P**hone must be **byte-identical** everywhere: website footer,
JSON-LD, Google Business Profile, Facebook, gulesider.no, 1881.no, proff.no, industry
directories.

Norwegian specifics:
- Address format: `Gatenavn Nr, Postnr Poststed` — e.g. `Eikveien 64a, 3122 Tønsberg`.
  Norwegian postcodes come **before** the place name. Never render `Tønsberg 3122`.
- Keep `æ ø å` intact. Do not degrade to `ae/oe/aa` in visible text, and ensure the page is
  UTF-8 (`<html lang="nb">`).
- Phone in JSON-LD as E.164: `+4740228345`. Display it Norwegian-style: `402 28 345`.
- Pick one legal-vs-trading name and stick to it. `Retrospect Tattoo AS` and
  `Retrospect Tatovering & Piercing` are two entities as far as a crawler is concerned.

Store NAP **once** in a single data module and render every surface from it. Never retype it.

## 5. Structured data (JSON-LD)

Emit JSON-LD in a `<script type="application/ld+json">`. Prefer the most specific type:
`TattooParlor`, `HealthAndBeautyBusiness`, `HairSalon`, `Dentist` … falling back to
`LocalBusiness`.

```jsonc
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "@id": "https://example.no/#studio",       // stable identifier, reuse it in @id refs
  "name": "…",
  "url": "https://example.no/",
  "image": "https://example.no/og.jpg",       // absolute URLs only
  "telephone": "+47…",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Eikveien 64a",
    "postalCode": "3122",
    "addressLocality": "Tønsberg",
    "addressRegion": "Vestfold",
    "addressCountry": "NO"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "10:00", "closes": "16:00"
  }],
  "areaServed": [{ "@type": "City", "name": "Tønsberg" }],
  "sameAs": ["https://www.instagram.com/…", "https://www.facebook.com/…"]
}
```

**Rules that get sites penalised when broken:**
- Never emit `aggregateRating` or `review` for ratings you do not host and cannot verify.
  Self-serving review markup for third-party Google reviews is a manual-action risk.
- Never emit `priceRange`, `award`, `foundingDate` or `numberOfEmployees` you have not
  confirmed with the client.
- Every JSON-LD claim must also be **visible on the page**. Invisible markup is spam.
- Omit unknown fields entirely. Do not emit `"description": "TO_CONFIRM"` or empty strings.
- Add `FAQPage` only when the Q&A is genuinely on the page. Add `BreadcrumbList` on nested
  routes. Add `ImageObject`/`CreativeWork` for portfolio items once real work exists.

Validate with Google's Rich Results Test and schema.org validator before handover.

## 6. Canonical, OpenGraph, hreflang

- Self-referencing `<link rel="canonical">` on every page, absolute URL, one host, one
  protocol, consistent trailing-slash policy. Pick `https://` + non-`www` (or `www`) and
  301 everything else to it.
- OpenGraph: `og:title`, `og:description`, `og:image` (1200×630, absolute URL, <8 MB),
  `og:url`, `og:type`, `og:locale` = `nb_NO`, `og:site_name`. Add `twitter:card=summary_large_image`.
  Instagram/Facebook referral traffic is a primary channel for these businesses — the share
  card *is* the first impression.
- If you publish an English version, use reciprocal `hreflang` (`nb-NO`, `en`, `x-default`).
  Do not publish a half-translated English tree; a partial duplicate hurts more than it helps.

## 7. robots.txt and sitemap

```
User-agent: *
Allow: /
Sitemap: https://example.no/sitemap.xml
```

- Sitemap lists **only** canonical, indexable 200-status URLs. No redirects, no noindex pages.
- Include `lastmod` and keep it truthful.
- `noindex` staging, demo, thank-you and internal preview routes. A second indexed copy of a
  site on a staging subdomain is a real, common, self-inflicted ranking loss.

## 8. Images and portfolio SEO

For visual businesses the portfolio *is* the product, and image search is a real channel.

- **Alt text** describes the image for someone who cannot see it. Include style/subject and,
  where natural, the city — but write for the human first.
  - ✅ `Fineline botanisk tatovering på underarm, utført i Tønsberg`
  - ❌ `tatovering Tønsberg tattoo Tønsberg tatovør beste`
  - Decorative images get `alt=""`, never a keyword dump.
- Descriptive filenames: `fineline-botanisk-underarm.avif`, not `IMG_4821.jpg`.
- Serve AVIF/WebP, responsive `srcset`/`sizes`, explicit `width`/`height` to prevent CLS.
- `loading="lazy"` + `decoding="async"` for everything below the fold; the LCP hero image
  must be **eager** and `fetchpriority="high"`.
- Give each portfolio item structured attributes (artist, style, placement, body area). This
  powers on-site filtering *and* future per-style landing pages from the same data.

## 9. Internal linking

- Link with descriptive anchors — `Se hvordan piercing hos oss fungerer`, never `les mer` /
  `klikk her`.
- Every service page links to: the enquiry form, the relevant portfolio filter, aftercare, FAQ.
- Every portfolio filter view links back to its parent service page.
- Keep every commercial page ≤ 2 clicks from `/`.
- Footer carries NAP + full service list on every page — it is the site's most-crawled block.

## 10. Google Business Profile alignment

The GBP listing usually outranks the website for brand queries, so treat it as part of the site:

- Categories: one precise primary (`Tatoveringsstudio`), plus secondaries (`Piercingstudio`).
- Website field → the **most relevant page**, not always `/`. A piercing-led profile should
  point at `/piercing`.
- Hours must match the site's `openingHoursSpecification` exactly, including holiday hours.
- Use GBP Products/Services to mirror the site's service pages 1:1.
- Post real photos, geotagged where possible, on a recurring cadence.
- Reply to every review. Review **velocity and recency** matter more than raw count — a
  studio with 4 recent reviews is not hopeless against one with 60 old ones.
- Add UTM tags to the GBP website link so the profile's contribution is measurable.

## 11. Conversion-focused local landing page structure

Ranking is half the job. A local service page should run:

1. **H1 = service + city.** No riddles. `Tatovering i Tønsberg`.
2. **One sentence of what actually happens next**, then the primary CTA. Above the fold on a
   375 px phone — most local traffic arrives from Instagram on a phone.
3. **Proof**: real work, real reviews, named people, credentials you actually hold.
4. **Process**: what happens between enquiry and appointment, and how long it takes.
5. **Price honesty**: at minimum a starting price or hourly band, plus deposit policy.
   *"Hva koster det"* is one of the highest-intent queries in every service market, and the
   business that answers it wins the enquiry.
6. **Practical**: address, map, parking/transport, hours, age rules, accessibility.
7. **Repeat CTA** at the end of the page.

**One dominant conversion goal per page.** Competing CTAs of equal visual weight measurably
reduce completion. Everything else is a secondary, visually subordinate link.

**Collect a brief, not just a contact.** Asking size, placement, style, colour, budget band,
reference images and availability up front converts *slightly* worse per-visitor and
*dramatically* better per-hour-of-staff-time. Use progressive disclosure — branch the form on
the first answer so nobody sees an irrelevant field.

## 12. Audit checklist

```
[ ] One H1 per page, matching real search intent
[ ] Unique title (50–60) + description (140–160) on every route
[ ] Self-referencing canonical, single host + protocol + trailing-slash policy
[ ] html lang="nb", UTF-8, æøå intact
[ ] LocalBusiness/specific-type JSON-LD, validated, no unverified claims
[ ] NAP identical: site / JSON-LD / GBP / directories
[ ] Separate page per commercial service
[ ] robots.txt + sitemap.xml, canonical 200s only
[ ] Staging + demo routes noindexed
[ ] All images: descriptive alt, modern format, srcset, dimensions, lazy below fold
[ ] LCP image eager + fetchpriority="high"
[ ] Descriptive internal anchor text; commercial pages ≤2 clicks from /
[ ] Primary CTA above the fold at 375px
[ ] Price or price band answered somewhere
[ ] Core Web Vitals green on mobile (LCP <2.5s, INP <200ms, CLS <0.1)
[ ] No fabricated facts anywhere in copy or markup
```

## 13. Factual integrity

Never invent artist names, years of experience, awards, certifications, memberships,
customer counts, pricing or founding dates to fill a template. In regulated-adjacent trades
(tattoo, piercing, beauty, health) a fabricated hygiene or certification claim is a legal
exposure for the client, not just an SEO one.

Mark unknowns explicitly in the data layer (`TO_CONFIRM`), render them as a visible gap or
omit the block entirely, and hand the client a list of exactly what is needed. A site with
three honest sections outperforms one with nine invented ones — and it is the only version
you can ethically ship.
