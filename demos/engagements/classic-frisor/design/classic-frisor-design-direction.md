# Design direction — Classic Frisør

**Concept: STOL · LYS · GATE**
*(the chair, the light, the street)*

---

## 1. Who this is for

`[V]` from research: a one-chair salon, registered October 2024, at Smidsrødveien 15 —
between a salon that has traded since 1998 and a barber shop with seven employees.

**"Kari, 34."** Lives on Teie. Walks past the salon. Has been going to the same place for
years out of inertia rather than loyalty. Searches `frisør teie` on her phone on a Tuesday
evening. Wants to know it will look good, roughly what it costs, and whether she can get in
this week. **Will not ring to ask the price.**

**"Ahmed, 41."** New to the island. Knows nobody. Searches `frisør nøtterøy`. Gets a map
with six pins on one street and no way to tell them apart. **Picks whichever one gives him
the most confidence in ten seconds.**

Both decisions are made on a phone, in under a minute, mostly on evidence the salon has not
yet published.

## 2. Brand thesis

> A chain sells consistency. A one-chair salon sells the opposite: **the same hands, every
> time, on your street.**

The design has to make small feel *chosen* rather than *all they could afford*. That is the
entire art direction problem, and it is solved with space and restraint, not decoration. The
cheapest-looking thing a small salon can do is imitate a big one.

## 3. Palette

Warm, low-chroma, daylight. A salon is a room people sit in for an hour looking at
themselves in a mirror — the palette should flatter skin, not compete with it.

| Token | Value | Role | Contrast |
| --- | --- | --- | --- |
| `--kalk` | `#f4f1ec` | Page ground. Warm off-white, not grey | — |
| `--kalk-dyp` | `#e8e3da` | Alternate bands | — |
| `--papir` | `#fbf9f6` | Cards, raised surfaces | — |
| `--espresso` | `#2b2320` | Body text, dark bands | 13.4:1 on kalk |
| `--espresso-myk` | `#4d423c` | Secondary text | 7.6:1 on kalk |
| `--leire` | `#a86a4f` | Muted clay — the accent | graphics only |
| `--leire-dyp` | `#8a5238` | Button fill: white on it = 5.4:1 | fills |
| `--leire-tekst` | `#7a4229` | Small clay text on light | 6.4:1 |
| `--salvie` | `#7d8b76` | Soft sage. Quiet second accent | graphics |
| `--linje` | `#d9d2c7` | Hairlines | — |

**The accent rule, written here because it always drifts:** clay marks the booking path and
nothing else. Not section numbers, not bullets, not decorative rules. The pre-build critique
in §12 predicts this will be violated; the post-build review checks it.

**Explicitly rejected:** pink, rose-gold, gold-on-black, marble, gradients of any kind.
These read as "beauty template" and they are what every competitor's customer has already
learned to skim past.

## 4. Typography

| Role | Face | Why |
| --- | --- | --- |
| Display | **Fraunces** — optical size, low contrast | A serif with warmth and a slight oddness. Editorial rather than luxury. Handles Æ Ø Å properly |
| Text | **Inter** | Neutral, excellent at 16–18px on a phone in daylight |
| Detail | **Inter**, tracked caps | Prices, durations, hours — data, not decoration |

**No script face anywhere.** A script font is the single fastest way to look like every
other salon site, and it fails at small sizes on the exact device most customers use.

Display sizes get tight tracking and generous leading — Norwegian compounds like
*frisørsalong* and *ettervekst* are long, and cramped leading collides Å's ring with the
line above.

## 5. Layout

- One column on mobile. Two, asymmetric, above 900px — never a symmetric three-card grid,
  which is the SaaS tell.
- Generous vertical rhythm. Whitespace is the budget the client did not have to pay for.
- Alternating warm bands to separate sections without rules or boxes.
- Content max-width 66ch. Prices right-aligned in their own column so they can be scanned.

## 6. The signature element: the price line

Not a card. A **line** — treatment on the left, duration in the middle, price on the right,
hairline beneath. Like a menu in a good restaurant.

```
Dameklipp            60 min            fra 650 kr
Herreklipp           30 min            fra 450 kr
```

This is the design's central argument, because §7 of the competitive analysis found that
**nobody in this market publishes prices**. The most distinctive thing on the page is the
salon answering the question everyone else avoids. Form follows the commercial insight.

## 7. Photography

Everything real, nothing stock. See `content/photo-shot-list.md`.

Placeholders are **visibly briefs**, not grey boxes — each frame states the shot it is
waiting for, which turns an empty gallery into a to-do list the owner can act on and makes
the concept honest in the meeting.

Direction: available daylight, no flash, no beauty retouching, natural skin and hair tone.
Hands and hair rather than posed faces. The room as it actually is.

## 8. Motion

Almost none. No reveal-on-scroll, no parallax, no carousel, no animation library.

One exception: a 120ms colour transition on interactive elements, so a tap feels answered.
`prefers-reduced-motion` removes even that.

## 9. Trust, in the absence of facts

The hard problem: almost nothing is verified. The design turns that into a feature.

- **Named gaps.** Unconfirmed values render as a marked "mangler" element, not as filler.
  Visible gaps make everything unmarked credible.
- **Evidence over adjectives.** "Frisør på Teie siden 2024" if confirmed, never "years of
  experience".
- **The person.** Once consent exists, one real portrait beats every trust badge.
- **Prices in public.** The strongest available trust signal, and it costs nothing.

## 10. Mobile

- Persistent bottom bar: `BESTILL TIME` (clay fill) + `RING` (outline). 60px, reserved.
- Hidden ≥768px.
- First viewport answers: hair salon, Teie/Nøtterøy, and the booking action.
- 44px minimum targets, 48px primary.

## 11. Anti-patterns

Pink or rose-gold · gold on black · marble · script fonts · gradients · "Where beauty meets
quality" · stock models · fake Instagram grids · scroll animation · carousels · three-card
symmetric grids · popup booking modals · "Ring for pris" · hero video · particle effects ·
before/after sliders · testimonial carousels with invented quotes · star ratings that are not
real · "Vi brenner for hår" · countdown offers · chat bubbles · badge walls.

## 12. Pre-build critique — written before any code

1. **The clay will spread.** It always does. It will end up on section numbers and list
   bullets and stop meaning "book". *Check at build end.*
2. **The price line only works if prices exist.** Everything is `TO_CONFIRM`. The design's
   central element may render as a wall of gaps — that must look deliberate, not broken.
3. **Fraunces is a variable font with optical sizing.** Easy to load too many axes and cost
   more than it is worth on a 3G phone. *Check the transferred weight.*
4. **"Warm off-white + serif" is one step from a wedding-photographer site.** The correction
   is the data typography — tracked caps and right-aligned figures keep it a salon, not a
   mood board.
5. **The gallery may be empty for months.** Placeholders must carry the shot brief or the
   page reads as unfinished rather than as awaiting the client.

---

## 13. Post-build critique

Written after the first QA sweep and a visual review of the screenshots at 390 and 1440.
Five findings, all fixed.

### Finding 1 — the price line looked broken, exactly as predicted

**§12.2 called this.** With every price and duration unconfirmed, each row rendered *two*
identically-weighted grey chips — "Tid" and "Pris" — which competed with each other and with
the treatment name. The rows scanned as a failed table rather than a menu, and the signature
element of the whole design was its weakest moment.

The fix was editorial, not cosmetic: when nothing is confirmed, **say so once**. `PrisRad`
now renders a single `Pris og tid ikke bekreftet` marker instead of two. Row padding came
down from 1.05rem to 0.9rem to tighten the rhythm.

For now the empty state *is* the only state, so it had to be designed, not tolerated.

### Finding 2 — the accent drifted, exactly as predicted

**§12.1 called this too.** Clay had spread to four surfaces that are not actions: the eyebrow
on dark bands, the demo-band label, the active nav underline, and the `CLIENT_PHOTO_*`
tokens. Pulled back to four: primary button fill, inline links, their dark-band variant, and
the mobile book action. The rule is now stated as a comment at the palette definition.

### Finding 3 — a specificity bug made the primary CTA fail contrast

`.cf-topp__nav a { color: inherit }` has specificity (0,1,1); `.cf-btn--primar { color: #fff }`
has (0,1,0). The header's "Bestill time" button therefore rendered espresso-on-clay at
**2.45:1** — a WCAG AA failure on the single most important control on the site.

Invisible to visual review: at a glance it reads as a dark button with dark text and looks
intentional. The contrast audit caught it on all six routes at once. Fixed by excluding
buttons from the nav rule (`a:not(.cf-btn)`) rather than escalating specificity.

### Finding 4 — the footer is dark but is not a dark band

`.cf-data` is `--espresso-myk` and the `.cf-band--dyp` override never reached `.cf-footer`,
which is its own element. Result: `Smidsrødveien, Teie` rendered at **1.58:1** in the footer
of every page. Fixed with explicit light-on-dark tokens scoped to `.cf-footer`.

### Finding 5 — two grid blowouts

`grid-template-columns: repeat(2, 1fr)` on the photo grid: a grid item defaults to
`min-width: auto` and refuses to shrink below its content, so the long unbreakable
`CLIENT_PHOTO_BEFORE_AFTER` tokens pushed columns past the viewport — 76px of horizontal
overflow at 430, 34px at 1024. Fixed with `minmax(0, 1fr)` plus `overflow-wrap: anywhere`.

Separately, `white-space: nowrap` on `.cf-pris__belop` is right for "fra 650 kr" and wrong
for the long descriptors the same cell carries in the proposal tables — 82px of overflow at
375. Removed; a short price has nothing to wrap at anyway.

### What the pre-build critique got wrong

§12.3 worried Fraunces would cost too much on a 3G phone. Only two weights are requested and
`next/font` subsets them, so it did not turn out to be the problem the note anticipated.
§12.4 and §12.5 held up: the data typography does keep it from reading as a wedding site,
and the photo briefs do read as a work order rather than as an unfinished page.
