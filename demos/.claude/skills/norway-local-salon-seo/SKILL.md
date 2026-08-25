---
name: norway-local-salon-seo
description: Local SEO for Norwegian hair salons, barbers and beauty businesses — NAP, HairSalon schema, treatment pages, stylist pages, opening hours, booking URLs, Google Business Profile and review footprint. Use when building or auditing a site for a salon whose customers search by place name.
---

# Norwegian local salon SEO

## 0. The rule that overrides everything

**Never publish an unverified business fact to win a search.** Hours, prices, treatments,
staff, certifications. A salon page that ranks and then sends someone to a locked door has
done worse than not ranking. Unknown → a visible gap on the page, and absent from schema.

## 1. How Norwegians search for a salon

Two intents, and they want different pages:

| Intent | Query shape | Wants |
| --- | --- | --- |
| **Place** | `frisør <sted>`, `frisørsalong <sted>` | The nearest one that can take them |
| **Treatment** | `balayage <sted>`, `herreklipp <sted>`, `frisør priser <sted>` | Confirmation + price |

Place-intent is won by the homepage. Treatment-intent needs its own section or page — but
only for treatments the salon confirms it performs.

- Compounds are written closed: `hårfarge`, `damefrisør`, `frisørsalong`. Do not split them.
- Æ/Ø/Å never appear in slugs: `/frisorene`, `/bestill-time`, `/arbeid`.
- Neighbourhood beats municipality when the neighbourhood is where people say they live.
  On Nøtterøy, *Teie* is the high street and *Nøtterøy* is the island — use both, in that
  order, when the salon is on Teie.

## 2. NAP

Byte-identical on the site, Google Business Profile, Facebook, Instagram and every directory.

- Norwegian order: `Gate Nr, Postnr Poststed`
- `tel:` in E.164 (`+4791537959`), displayed spaced (`915 37 959`)
- One source of truth in the codebase; render it from there everywhere
- A trading name and a registered name can differ. Check the registry before publishing
  either — sole proprietorships are registered under a personal name

## 3. Schema

`HairSalon` (a `LocalBusiness` subtype). `BarberShop` if it is genuinely a barber.
`BeautySalon` only if hair is not the main service.

| Emit | Condition |
| --- | --- |
| `name`, `address`, `telephone`, `url` | Confirmed NAP |
| `openingHoursSpecification` | Hours confirmed. Never guessed |
| `Service` per treatment | Treatment confirmed, and visible on the page |
| `potentialAction: ReserveAction` | A real booking URL exists |
| `identifier` | Organisasjonsnummer, once the entity is settled |

Never: `aggregateRating`, `review`, `priceRange`, `award`, `brand`, `employee` without
consent. Self-serving review markup for third-party reviews is a manual-action risk.

## 4. Titles and metas

≤ 60 characters. Service and place first, brand last.

- `Frisør på Teie, Nøtterøy — Classic Frisør` ✓
- `Classic Frisør — Velkommen til oss!` ✗ — no service, no place, no reason to click

Descriptions 140–160 characters, written as ad copy, ending in the action.

## 5. Treatment pages

One page per intent, never per place name. A salon with one location does not get a page per
surrounding village — that is a doorway structure and it is also a lie.

Each treatment needs: what it is, roughly what it costs, roughly how long it takes, and a
booking link. **Price and duration are the two things customers most want and least often
get** — publishing them is usually the biggest single differentiator available.

## 6. Stylist pages

In a small salon the person *is* the brand, and a named stylist is often the strongest trust
signal on the site. But: never write a biography the person did not give you, and get
consent before publishing a name or a photograph.

## 7. Opening hours

The most frequently wrong data in this industry. Publish once, in one place, rendered
everywhere from that constant, and mirrored on the Google profile. Update **before**
holidays.

## 8. Reviews

Small salons under-ask, dramatically. The gap between one review and eight changes how a
listing reads more than any design change.

Ask at the chair, follow with one message and a direct link. Reply to all of them. Never
incentivise, never write them, never fabricate a count or a quote.

## 9. Booking URL

If the salon already uses Fixit, Timma or similar — **link to it, do not rebuild it**. Put
the same URL on the site's primary CTA and on the Google profile's booking field. If there
is no provider, the phone is the booking system: make `tel:` the primary action and design
for it properly.

## 10. Core Web Vitals

Salon traffic is overwhelmingly mobile, often on a phone in the street.

- Static HTML. A client-rendered SPA hides content from anything that does not run scripts
- Explicit image dimensions — CLS on a gallery is the usual failure
- Two web fonts maximum
- No carousel, no animation library, no client JS on routes that do not need it

## 11. Audit checklist

- [ ] NAP identical on site, GBP and socials
- [ ] `lang="nb"`, `og:locale=nb_NO`
- [ ] One `h1` per page with service + place
- [ ] Titles ≤ 60, unique per route
- [ ] Self-referencing canonicals
- [ ] Sitemap lists only indexable 200s
- [ ] Schema matches what is visible on the page, and omits everything unconfirmed
- [ ] Hours match the Google profile exactly
- [ ] Booking link identical on site and profile
- [ ] Content present in served HTML without JavaScript
- [ ] Norwegian `alt` text on every image
