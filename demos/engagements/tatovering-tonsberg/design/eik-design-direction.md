# Eik Tattoo & Piercing — Design direction

**Concept name:** SKIN / STEEL / INK
**One line:** The calm, exacting confidence of a very good treatment room.

---

## 1. Target customer

**Primary — "Kari, 26, first real tattoo."**
Found the studio on Instagram. Wants something small, fine-lined, personal. Has never been
tattooed and is quietly anxious about three things she will not say out loud: *is it clean*,
*will they laugh at my idea*, and *how much is this going to cost*. She is browsing on a
phone, at night, and she will not phone anybody. She needs permission to start.

**Secondary — piercing customer.** Often younger, sometimes a parent booking for a teenager.
High-intent, low-consideration: they want to know jewellery, price, age rules, healing time,
and whether they can come this week. This customer is transactional and currently completely
unserved by any Tønsberg website.

**Tertiary — returning/experienced client.** Knows what they want, needs the shortest possible
path to a brief they can submit.

## 2. The page's main job

Move the anxious first-timer from *"this looks nice"* to *"I have sent my idea"* in a single
phone session, without a message being sent to a human.

Everything else — portfolio, aftercare, FAQ, artist pages — exists to remove one specific
objection on the way to that form. If a section removes no objection, it does not ship.

## 3. Aesthetic thesis

Tattooing is a **clinical craft performed on a human body**, and the honest, un-clichéd
version of that is not a rock bar. It is closer to a dermatology clinic designed by someone
with taste: bright, quiet, hygienic, precise, warm.

So the site is **light**. Bone-white paper, hairline rules, generous air, one warm metal
accent. In a market where every tattoo site is dark, being the calm bright one is both
differentiating *and* strategically correct — it answers the hygiene question before the copy
does.

The organising metaphor is a **technical datasheet**: numbered steps, spec labels, aligned
columns, measured values. Precision as reassurance.

Reference field: Scandinavian pharmacy packaging · Aesop store signage · a well-set surgical
instrument catalogue · Kinfolk-era editorial layout.
Explicit anti-reference: rock posters, neon, distressed textures, flash-sheet collage.

## 4. Palette

| Token | Value | Role |
| --- | --- | --- |
| `--bone` | `#F4F1EA` | Page ground. Warm, not white — paper, not screen. |
| `--bone-deep` | `#E8E3D8` | Alternating section bands, input fields. |
| `--ink` | `#16130F` | Primary text, footer ground. Near-black, warm-shifted. |
| `--graphite` | `#4A463F` | Secondary text. |
| `--steel` | `#8E9299` | Meta text, rules, disabled. The only cool hue in the system. |
| `--hairline` | `rgba(22,19,15,0.14)` | The 1px rule that builds the whole grid. |
| `--copper` | `#A85A33` | **The single accent.** Oxidised copper. CTAs, active states, focus. |
| `--copper-deep` | `#8A4526` | Accent hover / AA-safe accent text on bone. |

**Discipline:** copper appears at most **twice per viewport**. It marks the conversion path
and nothing else. No accent-coloured decoration, ever. Contrast: `--copper-deep` on `--bone`
= 5.1:1; body `--graphite` on `--bone` = 8.4:1; `--steel` used only ≥14 px semibold or as
non-essential meta.

## 5. Typography

| Role | Family | Treatment |
| --- | --- | --- |
| Display | **Instrument Serif** | High-contrast editorial serif. Tight tracking (`-0.02em`), optically loose leading (0.95–1.05). Sentence case, never all-caps. |
| Text/UI | **Inter** | 400/500/600. Body 17px mobile → 18px desktop, leading 1.65, measure capped at 68ch. |
| Spec labels | **JetBrains Mono** | 11–12px, `letter-spacing: 0.14em`, uppercase, `--steel`. Used for section numbers, field metadata, categorical values. |

The mono is not decoration — it is the datasheet voice. `01 — KONSULTASJON`,
`STØRRELSE / 8–12 CM`, `PLASSERING / UNDERARM`. It carries all machine-readable-feeling
information so the serif never has to shout.

Display scale is restrained on purpose: `clamp(2.4rem, 6vw, 4.6rem)` for h1. This site does
not use size to create impact; it uses **space and alignment**.

## 6. Layout system

- **Strict, symmetric 12-column grid**, max content width 1180px, centred. Nothing overlaps,
  nothing is rotated, nothing bleeds unpredictably. Order *is* the message.
- **Hairline rules as structure.** Every section opens with a full-width 1px rule carrying a
  mono section number on the left and a short label on the right. The rules are the visible
  skeleton — like a spec sheet.
- **Two-column asymmetric text blocks** (4/8 split): mono label column left, prose right.
  Collapses to stacked on mobile with the label above.
- Generous vertical rhythm: 96px section padding mobile, 160px desktop.
- Cards have **1px hairline borders and 2px radius** — barely-there corners. No shadows
  anywhere on the site. Shadows imply softness; this brand implies precision.

## 7. Photography treatment

- **Bright, high-key, warm-neutral.** Skin tones true, no crushed blacks, no teal-orange grade.
- Portrait 4:5 for work, 3:2 for studio/environment.
- Contained in hairline frames with a small mono caption strip *below* the frame carrying
  style / placement / artist. The caption is part of the image unit, not an overlay — nothing
  is ever printed on top of the work.
- Until real work is supplied, every slot renders a `PlaceholderFrame`: bone gradient, hairline
  border, centred mono label **`CLIENT PORTFOLIO IMAGE`** plus the spec metadata that the real
  image will carry. It reads as a considered spec, not a broken image.

## 8. Motion

**Deliberately minimal.** 160–240 ms, `cubic-bezier(0.2, 0, 0, 1)`.
- Fade-and-rise reveal (12px) on section entry, staggered 60 ms.
- Underline draw on text links, left-to-right.
- Copper fill transition on the primary button.
- **No parallax, no scroll-jacking, no marquees, no counters.** A clinic does not gesticulate.
- Everything inside `@media (prefers-reduced-motion: reduce)` collapses to opacity-only or
  nothing.

## 9. Signature visual element

**The spec rule.**

```
──────────────────────────────────────────────────────────────
01 — SLIK JOBBER VI                            TØNSBERG · EIKVEIEN 64A
```

A full-bleed hairline with mono metadata straddling it, repeated as the opening move of every
single section on every page. It is cheap to render, impossible to mistake for a template,
and it makes a sparse content set look like an intentional catalogue rather than an unfinished
site. Combined with the numbered consultation steps, it gives Eik one ownable graphic idea
that scales from the hero to the booking form's field labels.

## 10. Anti-patterns — reject on sight

- Dark hero with a big centred slogan.
- Gothic/blackletter/tattoo-script anything.
- Red-on-black.
- Skulls, roses, snakes, flames, barbed wire as decoration.
- Neon glow, gradient mesh, glassmorphism, "AI purple".
- Full-width parallax hero video.
- More than one accent colour.
- Any drop shadow.
- Stock photography of tattoos we do not own.
- Fabricated review counts, artist bios, years of experience, or hygiene certifications.
- Three equally-weighted CTAs in the hero.
