# Local SEO strategy — Classic Frisør, Teie / Nøtterøy

## 0. No search volumes appear in this document

No keyword volume, difficulty or traffic estimate is stated anywhere here, because none was
measured. Every intent below is reasoned from how people describe this service in Norwegian
and from what competitors visibly target — not from a tool. **Any number in a proposal that
did not come from a measurement is a lie with a decimal point in it.**

What *is* measured: competitor presence, served-HTML readability, and the registry facts in
`classic-frisor-research.md`.

---

## 1. The single most important decision

**Do not compete for the brand term "classic frisør".**

`[V]` Three businesses share it: the Nøtterøy salon, CLASSICFRISØR AS in Tønsberg, and the
Askøy operation that owns `classic-frisor.no`. The Nøtterøy salon is the newest and smallest
of the three, and does not own the matching domain.

A search for the bare name returns a mixed set the salon cannot control. Chasing it means
losing slowly to two businesses with more history and better domains.

**Lead with place instead.** Nobody owns "frisør Teie". It is the search a person makes when
they are standing on Smidsrødveien or have just moved to the area, and it is the search
where being physically on that street is a genuine, defensible advantage.

### Recommended presentation

```
CLASSIC FRISØR
Teie · Nøtterøy
```

The legal name, whatever it turns out to be (§1 of the research), is unchanged. This is
signage and page-title order, not a rename. **Document before implementing** — done here.

---

## 2. Intent map

One page per intent. Not one page per place name — that is a doorway structure, and for a
single salon with one chair it would also be untrue.

| Intent | What the person wants | Page | Status |
| --- | --- | --- | --- |
| `frisør teie` / `frisør nøtterøy` | The nearest salon that can take them | `/` | ready |
| `frisørsalong nøtterøy` | Same, phrased longer | `/` | ready |
| `hårklipp nøtterøy` / `klippe seg teie` | A cut, soon, near here | `/behandlinger` | needs treatment list |
| `damefrisør` / `herrefrisør nøtterøy` | Confirmation the salon does *their* hair | `/behandlinger` | needs confirmation |
| `hårfarge nøtterøy` / `striper` / `balayage` | A colour service, and the price | `/behandlinger` + `/priser` | **blocked** — services unconfirmed |
| `frisør priser nøtterøy` | What it costs before calling | `/priser` | **blocked** — prices unconfirmed |
| `bestille time frisør nøtterøy` | To book, now | `/bestill-time` | **blocked** — provider unknown |
| `frisør åpent i dag` / `åpningstider` | Whether they can come today | `/kontakt` | **blocked** — hours unconfirmed |
| `[stylist name] frisør` | A specific person they were recommended | `/frisorene` | **blocked** — staff unconfirmed |

**Six of nine intents are blocked on the owner questionnaire.** That is the honest state of
this project, and it is exactly why the questionnaire is the first deliverable, not the last.

---

## 3. Page map

Titles ≤ 60 characters, service and place in the first half, brand last.

| Route | Title | Purpose |
| --- | --- | --- |
| `/` | `Frisør på Teie, Nøtterøy — Classic Frisør` | The landing page for place-intent |
| `/behandlinger` | `Behandlinger — frisør på Nøtterøy \| Classic` | What can be booked, and what it costs |
| `/frisorene` | `Frisøren — Classic Frisør, Teie` | The person. The trust page |
| `/arbeid` | `Arbeid — klipp og farge \| Classic Frisør` | Evidence, once photography exists |
| `/bestill-time` | `Bestill time — Classic Frisør, Nøtterøy` | The conversion page |
| `/kontakt` | `Kontakt og åpningstider — Classic Frisør` | NAP, map, hours |

**Deliberately not built:** a separate `/priser` page (prices belong beside each treatment,
not on a page a customer has to cross-reference), and any per-place-name landing page.

---

## 4. Internal linking spine

Every treatment links to booking. Booking links back to treatments for anyone who is not
sure what to book. The stylist page links to booking. Nothing links in a circle without a
next action.

```
/  →  /behandlinger  →  /bestill-time
│         ↑                  ↑
│         └──────────────────┘
├─→  /frisorene  →  /bestill-time
└─→  /kontakt    →  tel:
```

---

## 5. NAP

Name, Address, Phone — byte-identical everywhere they appear: the site, Google Business
Profile, Facebook, Instagram, and any directory.

`[TO_CONFIRM]` **All three are currently unverified for this business.** The listing shows
Smidsrødveien 15 and +47 915 37 959; the registry shows a sole proprietorship named SAEED at
that address. Until the owner confirms, the site renders the address and phone as visibly
marked gaps rather than guessing.

Rules once confirmed:

- Norwegian postcode order: `Smidsrødveien 15, 3120 Nøtterøy`
- Phone in E.164 for `tel:` links (`+4791537959`), spaced for display (`915 37 959`)
- ASCII slugs — `/frisorene`, not `/frisørene`
- `lang="nb"`, `og:locale=nb_NO`

---

## 6. Structured data

| Emit | When |
| --- | --- |
| `HairSalon` (subtype of `LocalBusiness`) | Once name, address and phone are confirmed |
| `address` / `telephone` | Same |
| `openingHoursSpecification` | **Only** once hours are confirmed. A wrong hour sends someone to a locked door |
| `Service` per treatment | Only for treatments the owner confirms |
| `identifier` (organisasjonsnummer) | Only once the legal entity is settled |
| `potentialAction: ReserveAction` | Only once a real booking URL exists |

| Never emit | Why |
| --- | --- |
| `aggregateRating` / `review` | One review is not a rating, and self-serving review markup is a manual-action risk |
| `priceRange` | Unverified |
| `founder`, `employee` | Unverified, and the owner's personal name is not ours to publish |
| `award`, `brand` | Unverified |

**Nothing on the current build emits `HairSalon` at all**, because §1 of the research is
unresolved. The emitter exists and is one confirmed field away from switching on.

---

## 7. Technical

- Static HTML for every route. The nearest competitor ships an empty shell that needs
  JavaScript to say anything at all — being readable without JS is a real edge here.
- One `h1` per page, in Norwegian, containing the service and the place.
- Self-referencing canonicals from a single origin constant.
- Sitemap lists only indexable 200s; the proposal is `noindex` and absent from it.
- Images: descriptive Norwegian `alt`, explicit dimensions, lazy below the fold.
- Core Web Vitals: no animation library, no carousel, no web font beyond the two the design
  needs, and no client JavaScript on any route that does not need it.

---

## 8. Google Business Profile

See `google-business-checklist.md`. **No external account is touched by this project.**
Order of operations matters: the profile cannot be corrected until §1 of the research is
answered, because the name on the profile is part of the ambiguity.
