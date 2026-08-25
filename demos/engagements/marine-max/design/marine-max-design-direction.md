# Designretning — Marine Max

**Konsept: VERKSTED · SJØ · ÉN MANN**

---

## 1. Target customer

**Primary — "Ola, 47, Nøtterøy."** Owns a 21-foot boat with an outboard he does not fully
understand. Uses it maybe twenty days a year. It is not a hobby, it is a thing the family
does in summer. When something goes wrong he has no idea whether it is serious or trivial,
and he is slightly embarrassed about that.

He is not shopping for a yacht service. He wants **a competent person who will tell him
straight what is wrong and what it costs**, and who will not make him feel stupid.

He finds businesses by asking at the marina, and by searching on his phone while standing
next to the boat.

**Secondary — "Marit, 38."** Bought a used boat this spring. Wants a service before the
family uses it. Is comparing two workshops on their websites and will pick the one that
seems most reachable and most straightforward. She would rather not phone a stranger.

**Neither of them is impressed by a marina.** Both are slightly intimidated by one.

---

## 2. Brand thesis

> **A boat workshop is not a lifestyle brand. It is a person with tools and an opinion about
> your engine.**

Every marine website in this market makes the same category error: it sells *boating* —
sunset, spray, teak, freedom — to a customer whose actual emotional state is *mild anxiety
about a machine*. The photography is of boats being enjoyed. The customer's boat is not
being enjoyed; it is broken, or about to be.

Marine Max should look like **the inside of the workshop, not the view from the boat.**

The design's whole job is to convert *"I don't know if this is a big problem"* into *"I know
who to call, and I've already told him what's wrong."*

Three commitments follow:

1. **Say what it is, immediately.** What, where, and what to do next — inside the first
   viewport, on the smallest phone.
2. **Show the gaps.** Where a fact is unconfirmed, the design shows a marked blank rather
   than filling it with something plausible. A visible gap is more trustworthy than smooth
   copy, and it is the honest state of the project.
3. **Never be more polished than the business.** A one-person workshop with a website that
   looks like a Series-B SaaS product reads as a front. Credibility here comes from
   plainness.

---

## 3. Palette

Derived from what is actually in a Norwegian boat workshop in November: cold daylight
through a roller door, painted steel, oil, marine safety equipment.

| Token | Hex | Role |
| --- | --- | --- |
| `--dypvann` | `#0C1A24` | Primary dark. Deep, cold, slightly green — the Oslofjord in poor weather. Not corporate navy |
| `--dypvann-dyp` | `#081219` | Deeper wells, footer, mobile action bar |
| `--grafitt` | `#28313A` | Secondary surfaces, borders on dark |
| `--stål` | `#5C6874` | Muted steel. Secondary text on dark |
| `--lyshavn` | `#F3F0EA` | Warm off-white. Paper, not white — screens at a marina in sunlight are punishing, and pure white glares |
| `--lyshavn-dyp` | `#E5E0D6` | Alternate light band, card fills |
| `--kritt` | `#FBFAF7` | Highest light |
| `--varsel` | `#E2571C` | **Safety orange.** Graphics, borders, display-size type |
| `--varsel-dyp` | `#C4460F` | Button fill — white on it measures 4.96:1 |
| `--varsel-tekst` | `#AA3A0B` | Small orange text on light — 5.56:1 / 4.81:1 |
| `--varsel-lys` | `#F4813F` | Small orange text on dark — 6.78:1 |

| `--blekk` | `#141A1F` | Body text on light |
| `--blekk-svak` | `#4B5560` | Secondary text on light |

The orange is split four ways **by contrast requirement, not by taste**. The three-token
version this document originally specified failed AA for small text at 4.36:1 and 3.77:1 —
caught by measurement during QA, not by eye. See §14.

**On the orange.** It is not a decorative accent chosen for contrast. Safety orange is the
actual colour of marine safety equipment — redningsvest, nødbluss, markørbøyer. It is the one
colour that is *native to the domain* without being a cliché, because no competitor uses it;
they all use blue. It appears **only** on primary actions and on the urgent-path elements.
Nowhere else. Its scarcity is what makes it work as a call-to-action.

**On the blue.** `#0C1A24` is deliberately desaturated toward green-black. Every marine site
in this market uses a saturated corporate blue (`#0B5FA5` and neighbours). Ours reads as
*water in bad weather*, which is when engines fail — not as a bank.

---

## 4. Typography

| Role | Family | Weights |
| --- | --- | --- |
| Display | **Barlow Condensed** | 600, 700 |
| Body / UI | **Barlow** | 400, 500, 600 |
| Technical data | **IBM Plex Mono** | 400, 500 |

**Why Barlow Condensed, functionally.** Norwegian compounds are brutally long —
`båtmotorservice`, `vinterkonservering`, `feilsøking`. At display size on a 375px screen, a
normal-width grotesque forces either a hyphenation break or a font size so small the headline
stops being a headline. Barlow Condensed fits `BÅTSERVICE PÅ NØTTERØY` on one line at a size
that still carries. **This is a typographic decision made by the language, not by taste.**

Its character is also correct: Barlow is a low-contrast grotesk drawn from Californian public
signage and industrial lettering. It looks stencilled, municipal, functional. It looks like
something painted on the side of a workshop.

**IBM Plex Mono** carries every piece of technical data — organisasjonsnummer, address,
field labels, engine specifications, the `bekreftes` markers. It is the instrument-panel
voice, and it is what makes the *engine plate* (§6) read as a data plate rather than a card.

Rules:
- Display is **uppercase with positive tracking**. Condensed lowercase at large size gets
  cramped.
- Body never exceeds **66 characters** per line.
- Body minimum **17px** on mobile. The reader is 47 and outdoors.
- Mono at 12–13px, uppercase, tracked `0.08em`.

---

## 5. Layout

**The system is a technical document, not a marketing page.**

- **Full-width horizontal rules** separating every section, edge to edge. A spec sheet, not
  a stack of floating cards.
- **Left-aligned everything.** No centred body copy anywhere. Centred text is the single
  fastest way to look like a template.
- **Asymmetric two-column** on desktop: a narrow mono label column (~200px) and a wide
  content column. The label column carries section numbers and category tags — like a
  drawing's title block. Collapses to stacked on mobile with the label above.
- **12-column grid at ≥1024px**, single column below 768px. Content max-width 1240px; text
  measure capped independently of the container.
- **Generous vertical rhythm** — `clamp()` scaled section padding. Space is what
  communicates competence; density communicates a template.

**No cards with drop shadows.** Blocks are separated by rules and background bands. This is
the most consequential anti-SaaS decision in the system.

---

## 6. Signature element — the engine plate

Every marine engine has a **riveted metal data plate**: model, serial, year, power, in
stamped label/value pairs inside a hard rectangular border.

That object is the site's recurring component. It appears as:

- the **NAP block** in the footer and on `/kontakt`
- the **service specification** on each service page (what is covered, what is needed from
  you, what happens next)
- the **enquiry summary** in the form's success state
- the **`bekreftes` gaps** — an unconfirmed fact renders as a plate row with the value slot
  visibly empty and marked

Construction: 1px `--grafitt` border, no radius, mono uppercase label left, value right,
hairline rule between rows, a corner notch top-left drawn in CSS.

**Why it earns its place:** it is native to the domain without being an illustration of it —
no anchors, no wheels, no waves. And it is *functionally honest*: a data plate is precisely
where you look for verified facts about a machine, which is exactly what the component holds.
It is also the component that makes a `TO_CONFIRM` gap look deliberate rather than broken.

---

## 7. Photography

**Documentary workshop realism.** Every placeholder in the build is labelled with the exact
shot required. See `content/photo-shot-list.md`.

| Do | Don't |
| --- | --- |
| Hands on an engine, dirt visible | Boats at sunset |
| Available light + honest flash | Teal-and-orange grading |
| Tight crops on mechanical detail | Wide aspirational seascapes |
| Trond's actual face, actual workshop | Stock models in branded polo shirts |
| Real customer boats, with permission | AI-generated yachts |

**Treatment:** minimal. Slight contrast lift, no filter, no duotone, no colour overlay.
Grading a workshop photo makes it look like advertising, and advertising is exactly what this
customer discounts.

**In the demo**, every image is a placeholder frame carrying the shot brief in mono. They are
plainly labelled as briefs, never dressed up to look like content. A client should be able to
see at a glance which parts of the site are waiting on him.

---

## 8. Motion

**Almost none — and that is the art direction, not an omission.**

- No scroll-triggered reveals. No parallax. No counters. No carousels.
- Transitions only on interactive state: 120ms on hover, focus, and disclosure.
- The mobile action bar is fixed and does not animate in or out.
- `prefers-reduced-motion: reduce` removes what little remains.

Justification: the highest-value visitor is standing next to a broken engine on a bad mobile
connection. Motion costs them time and battery and communicates nothing. A site that renders
instantly and holds still is a functional statement about the business — and it is the
opposite of every competitor's builder-template animation.

---

## 9. Components

| Component | Purpose |
| --- | --- |
| `Plate` | The engine-plate data block. §6 |
| `Rule` | Full-bleed section divider |
| `SectionHead` | Mono number + label in the title-block column |
| `ServiceCard` | Rule-separated, not a shadowed card. Title, scope, link |
| `Symptom` | Symptom → likely area → what we need from you |
| `Pending` | The visible `bekreftes` gap |
| `PhotoBrief` | Labelled placeholder frame carrying the shot brief |
| `CallBar` | Fixed mobile action bar: RING · BESTILL |
| `LeadForm` | The structured enquiry. See `marine-service-lead-flow` skill |
| `Step` | Numbered process row |

---

## 10. Trust strategy

Trust must be built almost entirely from **verified** material, because almost nothing is
confirmed. Ranked by strength:

1. **"På Nøtterøy siden 2005"** — registry-verifiable, and stronger than any competitor's
   claim precisely because it can be checked. Placed in the first viewport.
2. **Organisasjonsnummer, printed.** 988 770 868, in the footer plate on every page. A real
   Norwegian trust convention, and almost nobody bothers.
3. **A named person.** Not one competitor puts a human on their site. This is free
   differentiation and structurally uncopyable by a five-employee shop.
4. **The visible gaps.** Counter-intuitively, a marked `bekreftes` gap builds more trust than
   filled-in plausible copy — it demonstrates that everything *not* marked is real.
5. **Real photographs of real work** — the strongest asset, currently absent, entirely
   dependent on Trond.

**Explicitly not used:** testimonials (none exist), star ratings (none exist), "X fornøyde
kunder" (unknown), badges, certification logos (unverified), "markedsledende".

---

## 11. Mobile strategy

Mobile is the **primary** design target, not a responsive afterthought. The acute customer is
on a phone, outdoors, at the boat.

- **Phone reachable at all times.** A fixed bottom action bar — `RING 920 11 867` and
  `BESTILL SERVICE` — from the first scroll on every page. Two actions, never more.
- Bar height respects `env(safe-area-inset-bottom)`; body padding reserves its space so it
  never covers content.
- The first viewport at 375px must contain: what it is, where it is, and the phone action.
- Touch targets ≥ 44×44px, form controls ≥ 48px tall.
- `inputmode="tel"` / `type="tel"` / `autocomplete` on every relevant field — the keyboard
  should be correct on first tap.
- Photo capture opens the camera directly.
- **No horizontal overflow at 375px.** Tested, not assumed.

---

## 12. Anti-patterns — banned in this project

**Visual**

1. Wave dividers, SVG or otherwise
2. Anchor, helm-wheel, compass or rope iconography
3. Sunset, tropical or aspirational-yacht photography
4. Saturated corporate blue (`#0B5FA5` and its neighbours)
5. Blue-to-cyan gradients, anywhere
6. Rounded white cards with drop shadows on a tinted background
7. Centred hero text over a full-bleed photo
8. Large meaningless numbers ("500+ fornøyde kunder")
9. Badge/logo strips of unverified certifications
10. Stock photography of any kind
11. AI-generated marine imagery
12. Emoji as interface iconography

**Copy** — the brief's banned phrases, plus their neighbours

13. "Vi brenner for…"
14. "Din trygghet er vår lidenskap"
15. "Kvalitet i alle ledd"
16. "Vi tar din opplevelse til neste nivå"
17. "Din partner på sjøen"
18. "Med hjerte for båtliv"
19. Any superlative that is not verifiable ("best", "ledende", "størst")
20. Translated-sounding Norwegian — split compounds, English word order

**Structural**

21. Cookie banner (nothing is tracked, so nothing to consent to)
22. Newsletter signup
23. Live-chat widget
24. Carousels
25. Scroll-jacking
26. A blog nobody will write

---

## 13. Design critique — performed before implementation

**Q: Does this look like a template with a boat photo dropped in?**

The failure mode for this brief is real: dark navy + orange accent + condensed uppercase +
full-bleed hero is *precisely* the default of every construction/automotive/trades template
on ThemeForest. Getting the palette and the typeface right does not by itself avoid the
category.

Three decisions were made specifically to break out of it:

1. **Rules and bands instead of cards.** The trades template is built from shadowed cards on
   a tinted background. Removing cards entirely — and separating everything with full-bleed
   hairlines — changes the page's fundamental texture more than any colour choice.
2. **The title-block column.** The narrow mono label column on the left of each section is a
   technical-drawing convention, not a web-template one. It is the strongest single signal
   that this is a document about machinery.
3. **No motion.** Every trades template announces itself with scroll reveals and counters.
   Their absence is conspicuous in the right way.

**Q: Is the orange doing work, or is it decoration?**

Risk identified: safety orange is *also* the trades-template default accent. What separates
it here is enforcement — it is bound to primary actions and the acute path **only**. It never
appears in a heading, a border, an icon, or a hover state on a secondary element. If it
starts spreading during implementation, it becomes decoration and the whole palette collapses
into the template it was chosen to escape. **This is the thing to check in the post-build
critique.**

**Q: Does the design survive having almost no content?**

This is the real test. Most of the service list is `TO_CONFIRM` and there are no photographs.
A design that depends on a photo grid and testimonials would be a shell.

The engine-plate component is the answer: it is *designed to hold gaps*. A plate with an
empty, marked value row is a legitimate visual state rather than a broken one. The site is
consequently honest at its current completeness and gets stronger — rather than merely
fuller — as Trond answers.

**Verdict: proceed.** Re-examine the orange discipline and the card-free texture against
screenshots after the build.

---

## 14. Post-build design critique

Performed against full-page screenshots at 390 and 1440 after the first clean QA pass.

### Finding 1 — the orange had become decoration. Fixed.

§13 predicted exactly this and named it as the thing to check. The prediction was correct.

By the end of the first build, safety orange appeared on: primary buttons, section numbers
(`01`, `02`…), step numbers, list bullets, fieldset legends, inline link underlines, the
plate corner notch, the hero address line, and the footer brand line. Nine surfaces.

That is decoration, and it dissolves the one thing that made the palette work — scarcity.
With orange on every section number, an orange button stops meaning *press this*.

**The rule was made explicit and enforced in code:** orange marks things you can act on that
advance the conversion — primary buttons, the phone path, inline links, error alerts, focus
rings. It is *not* used for numbering, metadata, bullets or legends. Those went to
`--blekk-svak` / `--stal-lys`. The rule is now a comment at the palette definition so the
next person to touch the file sees the constraint before the colour.

One documented exception: the **plate corner notch** stays orange. It is 14px, it is the
identifying mark of the signature component, and removing it makes the plate read as a card
— which is the thing the whole layout system exists to avoid.

### Finding 2 — the file input was browser chrome. Fixed.

The native `<input type="file">` rendered "Choose Files / No file chosen" — in English, on a
Norwegian page, because that string comes from the browser's UI language and not the
document's. It was also ~20px tall.

This was on **the single highest-value field on the site**. The whole competitive argument is
that no rival accepts a photo; shipping that field as unstyled browser chrome in the wrong
language undercuts the argument at the exact point it should land.

Replaced with a labelled 88px drop target, a proper Norwegian button ("Velg bilder"), a live
count, and `:focus-within` moving the focus ring to the visible surface. The input remains in
the DOM, focusable and labelled.

### Finding 3 — contrast failures invisible to the eye. Fixed.

The QA sweep's per-element contrast audit found the accent orange `#c4460f` at **4.36:1** on
the light ground and **3.77:1** on the alternate band — both below AA for small text. Neither
was apparent by eye; both would have shipped.

The orange is now split four ways *by contrast requirement*: `--varsel` for graphics and
display type, `--varsel-dyp` as button fill (white on it = 4.96:1), `--varsel-tekst`
`#aa3a0b` for small text on light (5.56:1 / 4.81:1), `--varsel-lys` for small text on dark
(6.78:1). Every value is measured and recorded in a comment beside it.

### What the critique did NOT change

- **The card-free texture holds.** At 1440 the page reads as a technical document — full-bleed
  rules, background bands, a title-block column. It does not read as a trades template. This
  was the biggest risk in §13 and the mitigation worked.
- **The gaps look deliberate.** The `bekreftes` markers read as a design state rather than as
  missing content, which was the load-bearing assumption of the whole factual-integrity
  approach. It survives contact with the real page.
- **The hero answers what/where/what-next in the first 390px viewport**, with both actions
  visible without scrolling. Verified in the screenshot, not assumed.

### Known limitation, not fixed

At 1440 the hero's right half is empty. Filling it would require a photograph — and the
photograph does not exist yet. Inventing a composition to fill the space (a gradient, an
abstract shape, a stock image) would violate the project's central rule. **The empty half is
the correct state of an honest page and is reserved for shot nr. 2 in the photo list.** It is
noted here so it reads as a decision rather than an oversight.

### Finding 4 — the sales layer was leaking into every page. Fixed.

The most serious finding, and the one my own test missed.

The demo annotations were written as `children` of a client component:

```tsx
<DemoNote category="tillit" title="…">Ingen av konkurrentene …</DemoNote>
```

`DemoNote` returns `null` when the layer is off, so `document.querySelectorAll(".tsd-notat")`
found nothing and the QA check passed. But **React serialises a client component's props into
the RSC flight payload regardless of whether the component renders them.** Every annotation —
all 19, including the ones describing competitors' weaknesses — shipped inside
`self.__next_f.push(...)` on every page load, fully readable in view-source and fully
indexable.

The brief is explicit: *"Do NOT show this layer to normal website visitors."* It was being
shown to all of them.

**Fix:** annotations moved to `src/components/demo/notes.ts`, keyed by id. `DemoNote` now
takes only `id` and pulls the content with a dynamic `import()` that runs *only when the
layer is enabled*. The page HTML carries `<DemoNote id="…" />` and nothing else; the prose is
a separate chunk a normal visitor never requests.

**The lesson is about the test, not the code.** The check was measuring the DOM when the
requirement was about the wire. `auditRawHtml()` was added to fetch the served HTML directly
and assert against annotation fingerprints — that is the assertion that would have caught it,
and it now runs on every route.

### Finding 5 — the typeface mis-fits Ø. Fixed.

At display size the homepage h1 read as "NØ TTERØ Y". Measured advance widths in the loaded
font confirmed why:

| Glyph | Advance @100px |
| --- | --- |
| O | 47.3 |
| **Ø** | **55.4** (+17%) |
| A | 48.2 |
| Å | 48.2 (+0%) |

Barlow Condensed gives Ø ~0.08em of trailing sidebearing to clear the overhanging slash;
Å needs none and gets none. Rendering "NØTTERØY" beside "NOTTEROY" at 2× made it obvious —
the second is evenly spaced, the first has a hole after each Ø.

Negative tracking cannot fix this: the excess sits in one glyph's advance, so tightening
closes every *other* pair first. Tested at -0.005em and -0.02em; the hole survived both while
the rest of the word got cramped.

**Fix:** a `<Disp>` component wraps Ø in a span carrying `margin-right: -0.062em`, applied to
the seven display headings that contain the letter. Body sizes are untouched — the excess is
about 1px there and invisible.

This is worth the machinery because **"Nøtterøy" is the most repeated word on the site** and
appears in the h1 of the homepage. A site whose typeface was chosen *because of* the Norwegian
language should not then set the Norwegian alphabet badly.

Also fixed alongside it: `line-height` on headings went from 1.02 to 1.08 (1.1 at `.mm-d1`).
The ring on Å and the stroke on Ø sit above cap height, so the tight leading that suits
condensed Latin caps made them collide with the descenders of the line above.
