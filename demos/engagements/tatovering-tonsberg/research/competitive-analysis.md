# Competitive analysis — Tattoo studios in Tønsberg

Prepared by Tycho Systems · Research date: 20-08-2026
Scope: two prospective clients (Eik Tattoo & Piercing, Stabukk Tattoo Studio) and the
Tønsberg / Nøtterøy tattoo market they compete in.

---

## 0. How to read this document

Every factual claim below is tagged:

| Tag | Meaning |
| --- | --- |
| **[V]** | Verified — corroborated by a first-party source (the business's own site) or by two independent sources. |
| **[W]** | Weak — appeared in a single third-party directory, not corroborated. Treat as a hypothesis, not a fact. |
| **[TO_CONFIRM]** | Unknown. Must be asked directly of the client. Never rendered as a marketing claim. |

This tagging is not academic caution. Several of the Norwegian tattoo directories that rank
for these businesses publish **auto-generated, partly fabricated descriptions**. See §1.3.

---

## 1. The two prospective clients

### 1.1 Eik Tattoo & Piercing

| Field | Value | Tag |
| --- | --- | --- |
| Name | Eik Tattoo & Piercing | **[V]** |
| Address | Eikveien 64a, 3122 Tønsberg | **[V]** (consistent across all sources) |
| Category | Tattoo and piercing studio | **[V]** |
| Google rating | 5.0 | **[V]** (matches brief; low sample) |
| Google review count | 4 | **[V]** |
| Own website | **None found.** No first-party domain surfaced in any search. | **[V — negative]** |
| Instagram | `@eik_ink` claimed by directory; a related account `@chrilleink` describes itself as "ChrilleInk / EikInk" | **[W]** |
| Artists | "Max Shy", "Olsen", "Chrille" per blackink.no | **[W]** — do not publish |
| Styles | "Fineline, minimalist, botanical" per blackink.no | **[W]** — do not publish |
| Opening hours | Directory A: "no fixed hours, appointment only". Directory B: implies established shop hours. **Sources conflict.** | **[TO_CONFIRM]** |
| Booking method | "All booking via Instagram DM" per blackink.no | **[W]** — but plausible, and the whole commercial thesis if true |

**The single most important finding:** Eik has a 5.0 rating and *no website*. Its entire
discoverable identity is owned by third parties — Google Business Profile, Instagram, and
SEO-farm directories. Eik does not control its own search result.

### 1.2 Stabukk Tattoo Studio

| Field | Value | Tag |
| --- | --- | --- |
| Name | Stabukk Tattoo Studio | **[V]** (per brief) |
| Address | Møllegaten 4, 3111 Tønsberg | **[V]** (per brief; not independently corroborated online) |
| Category | Tattoo studio / artist | **[V]** |
| Google rating | 5.0 (2 reviews) | **[V]** (per brief) |
| Hours | Mon–Fri approx. 10:00–16:00 | **[V]** (per brief) |
| Own website | **None found.** | **[V — negative]** |
| Anything else | Artists, styles, history, services, pricing, contact | **[TO_CONFIRM]** |

Search returns effectively **zero** indexed information about Stabukk. It does not appear in
gulesider.no tattoo listings, proff.no, or any of the tattoo directories that list every
other Tønsberg studio. An Instagram account `@stabukk_olden` exists but "Olden" is a village
in Vestland, ~450 km away — **assumed unrelated, do not link**.

Stabukk is not merely under-marketed. It is close to **invisible** in the channels where
tattoo customers actually search. Competitors with objectively fewer reviews outrank it
simply by having pages that exist.

### 1.3 Why the directory data cannot be trusted

`blackink.no/studio/eik/` describes Eik with the phrase *"Fürsteklasses blekk"*. The correct
Norwegian is *"førsteklasses"*. `Fürst-` is a German construction. This is a machine-generated
string, not copy a Norwegian studio wrote or approved.

`finntatovering.com` describes the same studio as *"toppmoderne studio med lange tradisjoner"*
(state-of-the-art studio with long traditions) — a description that directly contradicts
blackink's "small, intimate studio without fixed hours".

**Both cannot be true.** Two SEO farms have independently invented a personality for a
business that never wrote its own description. Whatever a customer currently learns about
Eik before contacting them, Eik did not write and cannot correct.

This is a sales argument, not a technical one, and it belongs in the pitch.

---

## 2. Competitor landscape

### 2.1 Sniki Art Custom Tattoo — the market leader

- **URL:** snikiart.com **[V]**
- **Positioning:** Custom tattoo + PMU (permanent makeup) collective. Founded 2018. Run by
  Synne Natalia T. Dalen, described as having formal art education. **[V]**
- **Model:** A collective — several resident and guest artists, each booking independently. **[V]**
- **Information architecture:** Home → *meet our artists* → per-artist page → per-artist
  enquiry form. Plus Studio info/bio, Kontakt, Festival. **[V]**
- **Conversion mechanism:** **Per-artist enquiry forms.** This is the strongest single
  competitive feature in the market — the customer self-routes to the right artist before
  a human is involved. **[V]**
- **Languages:** English and Norwegian routes (`/en/…`). **[V]**

**Strengths:** artist-level portfolios and booking; guest-artist programme creates recurring
"new content" events; bilingual; strongest review volume in the market; a festival/community
angle nobody else has.

**Weaknesses — exploitable:**
- **NAP inconsistency.** The studio is described in one place as being *"at Teie on Nøtterøy
  just outside the city of Tønsberg"* and elsewhere as *"Caspari artspace Fayesgt 5-7
  Tønsberg"*. **[V]** Two different addresses in the wild is a real local-SEO liability, and
  it means "tatovering **Tønsberg**" is not cleanly theirs to own.
- Split domains (`snikiart.com` and a `nyside.snikiart.com` staging/second site both indexed)
  — dilutes authority and creates duplicate content. **[V]**
- Collective model dilutes a single studio voice; the customer must do the routing work.
- No piercing offer surfaced. **Eik's piercing service is uncontested at the top of this market.**

### 2.2 Alien's Tattoo — the best-executed conventional site

- **URL:** alienstattoo.no · Baglergaten 7, Tønsberg · 402 28 345 **[V]**
- **Title tag:** *"Tatovering og piercing i Tønsberg | Alien's Tattoo Studio"* — textbook
  local-intent title. **[V]**
- **IA:** Single-page with anchor nav — Home, Services, Book Appointment, Aftercare, Our Work,
  Reviews, Contact. **[V]**
- **Conversion:** One booking form with hCaptcha, 18+ / pregnancy notice. Norwegian CTAs
  ("Bestill time", "Se vårt arbeid"). **[V]**
- **Trust:** 4 named artists with Instagram links, 4 testimonials sourced from Google and
  Facebook, Norsk Tattoounion membership badge, detailed 3–4 week aftercare guide. **[V]**
- Built by an agency ("Hjemmesidehuset"). **[V]**

**Strengths:** the complete trust stack — named artists, reviews, union badge, aftercare,
age policy — all above the fold-to-form journey. Excellent Norwegian copy tone.

**Weaknesses — exploitable:**
- **Single-page architecture.** Everything lives on `/`. That means one URL, one title tag,
  one H1 competing for *tatovering Tønsberg*, *piercing Tønsberg*, *cover-up Tønsberg*,
  *fineline Tønsberg* simultaneously. They cannot rank for style- or service-specific
  long-tail intent because they have no page to rank. **This is the largest single SEO
  opening in the market.**
- Generic booking form: collects contact details, not *briefing* details. The studio still
  has to DM back and forth to learn size, placement, colour, budget, references.
- Visual identity is competent-but-anonymous — clean sans-serif, black/white, agency default.
  Nothing about the design is memorable or ownable.

### 2.3 Art & Tattoo Studio Z

- Øvre Langgate 14, 3110 Tønsberg · 450 28 885 / 971 43 896 · tattoobyeine@gmail.com **[V]**
- Booking is **email only**, stated in prose. **[V]**
- Deep portfolio archive spanning 2020–2025; Norsk Tattoounion member; artist with 26 years'
  documented experience; also sells piercing jewellery. **[V]**
- **Weaknesses:** dated design, no online booking, weak mobile experience, thin metadata, no
  structured data, no Maps embed. High credibility, low conversion machinery.

### 2.4 Retrospect Tattoo AS

- Storgaten 11, 3126 Tønsberg. Org.nr. 930 018 384. Established 09-09-2022. Daily manager
  Birk Veili. **[V]** (Brønnøysund/proff-derived)
- The domain `retrospect.tattoo` did not resolve at research time **[V]** and its title
  metadata references *"LOCK STOCK TATTOO"*, suggesting a rebrand, a domain in transition,
  or an abandoned site.
- Primary presence is Facebook. **[V]**
- **Read:** a real, registered, central-Tønsberg competitor whose web presence is currently
  broken. Whoever fixes theirs first takes the ground.

### 2.5 Others in the market

- **Lock Stock Tattoo** — Øvre Langgate 45. Listed on Tattoodo. **[V]** Presence appears
  platform-dependent rather than self-owned.
- **Krem Tattoo** (`@krem.tbg`) — Stoltenbergs gate 36. Instagram-only. **[V]**

---

## 3. Market pattern — the actual opportunity

Reading all seven businesses together, a very clear pattern emerges:

| Capability | Sniki | Alien's | Studio Z | Retrospect | Lock Stock | Krem | Eik | Stabukk |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Own website | ✅ | ✅ | ✅ | ⚠️ broken | ❌ | ❌ | ❌ | ❌ |
| Per-service landing pages | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Structured enquiry form | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Form collects a *brief* (size/placement/colour/budget) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Aftercare content | ⚠️ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reviews shown on site | ⚠️ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Visible pricing / deposit policy | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Structured data (LocalBusiness JSON-LD) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Distinctive art direction | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Four gaps nobody in Tønsberg has closed:**

1. **Nobody collects a proper brief.** Every booking form in this market collects *who you
   are*. None collects *what you want* — style, size, placement, colour, budget band,
   reference images, availability. So every studio in Tønsberg pays the same tax: 6–10
   Instagram messages per enquiry before a consultation can even be scheduled.

2. **Nobody has service- or style-level landing pages.** The dominant sites are one-pagers or
   near-one-pagers. *"piercing Tønsberg"*, *"cover-up tatovering Tønsberg"*, *"fineline
   tatovering Tønsberg"*, *"første tatovering"* are all effectively unclaimed long-tail.

3. **Nobody publishes structured data.** No LocalBusiness schema, no opening hours markup, no
   review markup anywhere in this market. The rich-result surface is unoccupied.

4. **Nobody is art-directed.** Every site in Tønsberg is either an agency default or a dated
   portfolio archive. In a market where the product *is* visual taste, no studio's website
   demonstrates visual taste. This is an unusually large opening for a design-led studio.

---

## 4. Opportunities for Eik Tattoo & Piercing

1. **Own the piercing keyword outright.** Sniki (market leader) shows no piercing offer.
   Alien's mentions piercing but has no piercing page. Eik is the only prospect with
   piercing in its *name*. A dedicated, genuinely useful piercing page — jewellery types,
   healing times, age rules, aftercare — is a clean uncontested win for *"piercing Tønsberg"*.
2. **Convert the 5.0 rating into visible trust.** A perfect rating that lives only inside
   Google Maps does no work on the path from Instagram to enquiry. Surface it on-site.
3. **Replace DM booking with a structured brief.** If booking really is Instagram-DM-only
   **[W]**, this is the highest-value change available: same enquiry volume, a fraction of
   the messaging.
4. **Take the "first tattoo" audience.** Nobody addresses the nervous first-timer — what
   happens, what it costs, does it hurt, can I bring someone. Fineline/small-work
   positioning **[W]** aligns naturally if confirmed.
5. **Reclaim the narrative from the SEO farms.** See §1.3.

## 5. Opportunities for Stabukk Tattoo Studio

1. **There is no floor to climb from — which means no legacy to undo.** Any indexed,
   structured, fast page is an immediate improvement over zero.
2. **Own the "sentrum" position.** Møllegaten 4 is central Tønsberg. Sniki's leading
   competitor is ambiguous about whether it's even *in* Tønsberg (§2.1). Stabukk can state
   plainly and consistently: central Tønsberg, walk-in distance from Torvet.
3. **Differentiate on art direction, not feature count.** Stabukk cannot out-feature Sniki's
   collective, and shouldn't try. It can out-*look* every studio in the county. In a taste
   market that is the durable advantage.
4. **Weekday-hours honesty as positioning.** Mon–Fri 10–16 **[V]** is unusual in this trade
   and reads as *atelier*, not *walk-in shop*. Lean into it rather than hiding it.
5. **The scarcity of information is itself a brand opportunity** — an atelier that shows work
   rather than talking about itself. This lets a genuinely sparse content set look
   *intentional* rather than *empty*, which matters while `TO_CONFIRM` fields are unfilled.

---

## 6. Deliberate non-goals

- **Do not copy Sniki's per-artist-page architecture for Stabukk.** We do not know how many
  artists Stabukk has **[TO_CONFIRM]**. Building an architecture that requires 4 artists and
  filling it with 1 looks worse than not building it.
- **Do not copy Alien's single-page layout.** Its weakness is the thing we're selling against.
- **Do not reuse any competitor photography.** All portfolio slots ship as clearly labelled
  placeholders until the client supplies real work.
- **Do not claim union membership, certifications, hygiene approvals or years of experience**
  for either client. Alien's and Studio Z display Norsk Tattoounion badges **[V]**. Whether
  Eik or Stabukk hold that membership is **[TO_CONFIRM]** and must never be assumed.

---

## Sources

- https://blackink.no/studio/eik/ *(low reliability — see §1.3)*
- https://finntatovering.com/vestfold/eik-tattoo-piercing-tonsberg/ *(low reliability)*
- https://www.instagram.com/chrilleink/
- https://www.snikiart.com/
- https://nyside.snikiart.com/en/studio-info-bio/
- https://www.alienstattoo.no/
- https://studioz.no/ · https://studioz.no/tattoo/
- https://www.proff.no/selskap/retrospect-tattoo-as/tønsberg/personlig-tjenesteyting/IFDPIS006Y9
- https://www.facebook.com/p/Retrospect-Tattoo-61555352067658/
- https://www.tattoodo.com/studios/LOCK_STOCK/
- https://www.instagram.com/krem.tbg/
- https://www.gulesider.no/tattoo+tønsberg/bedrifter
