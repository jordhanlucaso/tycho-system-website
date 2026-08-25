# Stabukk Tattoo Studio — Design direction

**Concept name:** PLATE / PRESS / SKIN
**One line:** An exhibition catalogue for a working atelier — the work is enormous, the talk is small.

---

## 1. Target customer

**Primary — "Jonas, 31, has three tattoos and wants a serious one."**
Not browsing for reassurance; browsing for **taste**. He can already tell competent work from
good work, and he is deciding whether this artist is worth waiting for. He does not want a
menu of services. He wants to see the work at a size where he can judge the line quality, and
then send one message that proves he is a serious client.

**Secondary — the collector / large-scale client.** Sleeve, back piece, multi-session. Long
consideration window, high value, will read the process page carefully because they are
committing to months of appointments.

**Tertiary — the design-literate walk-past.** Møllegaten is central Tønsberg. This person saw
the door, searched the name, and is deciding in eleven seconds whether this place is
interesting. The homepage has to *land* before it explains.

## 2. The page's main job

Make the work impossible to scroll past at speed, then convert the impressed visitor into a
**detailed enquiry** — not a "hei, hva koster en tatovering?" message.

Stabukk's honest problem is that almost nothing about it is publicly known. The design's job
is therefore to make **sparseness read as editorial restraint rather than as an empty site.**
A catalogue with six plates and no biography looks intentional. A brochure with six empty
sections looks abandoned. This direction exists to guarantee the first reading.

## 3. Aesthetic thesis

Not a tattoo *shop* — a **printing plate**. Stabukk is presented as an atelier that issues
work in editions: numbered plates, technical annotations, a heavy press-black ground, ink
that sits *on* the paper.

Where Eik is a clinic that reassures, Stabukk is a **gallery that asserts**. Eik answers
questions. Stabukk makes you want to ask one.

The visual grammar is **typographic**, not decorative: colossal expanded grotesque set at
sizes that crop and collide with the imagery, hard-edged blocks, registration marks, plate
numbers, and a monospace annotation layer. Nothing is ornamental. Everything looks like it
came off a press.

Reference field: art-book plate sections · Swiss exhibition posters · risograph print marks ·
contemporary fashion lookbooks.
Explicit anti-reference: metal band sites, nightclub flyers, horror aesthetics, dark SaaS
landing pages with a purple gradient.

## 4. Palette

| Token | Value | Role |
| --- | --- | --- |
| `--press` | `#0B0B0C` | Page ground. Press black, faintly blue-shifted. |
| `--press-raise` | `#141416` | Raised blocks, form ground. |
| `--paper` | `#EDEAE3` | Inverted sections — full-bleed "paper" spreads that break the black. |
| `--chalk` | `#F5F3EE` | Primary text on press. |
| `--ash` | `#8B8B8D` | Secondary text, annotations. |
| `--rule` | `rgba(245,243,238,0.16)` | Hairlines and plate borders. |
| `--registration` | `#D8452F` | **The single accent.** Printer's registration red. |

**Discipline:** the red is a *registration mark*, not a brand colour. It appears as crop
marks, the plate number of the active item, the focus ring, and the primary CTA — nothing
else. Never as a background wash, never as a gradient.

The **paper inversion** is structural: at least one full-bleed light spread per page. It gives
the site a physical rhythm (black plate → white spread → black plate) that no competitor has,
and it doubles as the accessibility escape valve — long-form reading always happens on paper,
never on press black.

Contrast: `--chalk` on `--press` = 17.2:1; `--press` on `--paper` = 16.4:1;
`--registration` used for large text/graphics only, never small body copy.

## 5. Typography

| Role | Family | Treatment |
| --- | --- | --- |
| Display | **Archivo, width 125 (Expanded), weight 800–900** | `clamp(3.2rem, 13vw, 11rem)`, leading **0.82**, tracking `-0.03em`, **UPPERCASE**. Set to the edge of the viewport, deliberately cropped by images. |
| Text | **Archivo, width 100, weight 400** | 17–18px, leading 1.6, measure 62ch. |
| Annotation | **Space Mono** | 10–12px, `0.16em` tracking, uppercase, `--ash`. Plate numbers, dimensions, dates, field metadata. |

The **width axis is the signature**. One family, two extreme widths — expanded shouting
against normal speaking — plus a typewriter annotation layer. This is the exact inverse of
Eik's serif-display / grotesk-text pairing, and it is what makes the two sites unmistakably
different families of object even in greyscale thumbnails.

Where Eik keeps display type small and lets space do the work, Stabukk sets display type
**as large as the viewport allows** and lets it collide with things.

## 6. Layout system

- **Broken, asymmetric grid.** 12 columns, but content deliberately occupies odd spans
  (2–9, 5–13, 1–7). Nothing is centred except by exception.
- **Full-bleed by default.** Images run edge-to-edge; the container is the browser, not a
  1180px box.
- **Overlap is allowed and intentional.** Display type crops behind and in front of imagery;
  plate captions hang into margins; sections overlap by negative margin at desktop.
- **Plate stack, not card grid.** Work is presented as a vertical sequence of numbered plates
  with alternating alignment, sized 62vw / 88vw / 44vw so the scroll has a rhythm — never a
  uniform 3-up grid.
- Registration marks (corner crop ticks) at the four corners of the viewport-scale sections.
- Mobile reverts to a single strong column, but keeps the oversized type, the plate numbers,
  and the full-bleed imagery. It must not degrade into a normal stacked template.

## 7. Photography treatment

- **High-contrast monochrome by default**, with a single hero item allowed in colour per page.
  Deep blacks, retained highlight detail, slight grain overlay (CSS, ~3% noise).
- Aspect ratios vary intentionally: 4:5, 1:1, 3:4, 16:9 in sequence.
- Captions are **hanging monospace annotations** in the margin — `PLATE 04 / BLACKWORK /
  UNDERARM / 2026` — not overlaid labels, not centred cutlines.
- Placeholder state: `PlateFrame` renders press-black with a fine grain, red corner
  registration ticks, a large plate number, and the label **`CLIENT PORTFOLIO IMAGE`**. At
  presentation size it reads as a deliberate un-inked plate, which is exactly the right
  metaphor for "your work goes here".

## 8. Motion

**More present than Eik, but never playful.** 380–620 ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Plate reveal:** clip-path wipe from the bottom edge as each plate enters — like a print
  being pulled. This is the site's one signature motion and it is used only on imagery.
- **Display-type mask-up:** headline lines rise from behind an overflow mask, 90 ms stagger.
- **Slow horizontal drift** on the studio marquee strip — one continuous, low-speed run, paused
  on hover and on `prefers-reduced-motion`.
- Registration-red crop ticks scale in on section entry.
- No scroll-jacking, no smooth-scroll hijack, no cursor followers, no WebGL.
- Reduced-motion: all wipes → instant, marquee → static, stagger → none.

## 9. Signature visual element

**The numbered plate.**

```
┌ ┐                                              PLATE 04
   [ full-bleed work ]
                          BLACKWORK / UNDERARM / 4 TIMER / 2026
└ ┘
```

Red corner registration ticks, a large plate number set in expanded Archivo hanging outside
the image edge, and a monospace technical annotation running along the bottom margin. Repeated
for work, for artists, for process steps, and for the booking form's own steps — the booking
flow is literally *"PLATE 01 / 02 / 03"*.

One idea, applied to everything, that could not be lifted onto Eik without destroying it.

## 10. Anti-patterns — reject on sight

- Purple/blue gradient on dark — the dark-SaaS tell.
- Glow, bloom, neon, glassmorphism, animated gradient mesh.
- Blackletter, horror drip fonts, distressed grunge textures, splatter.
- Skulls, pentagrams, occult iconography, barbed wire.
- Uniform 3-column card grids with equal-height cards.
- Centred everything.
- A dark hero with a centred slogan and two equal-weight buttons.
- Autoplaying video with sound.
- Cursor-follower blobs, magnetic buttons, letter-by-letter scramble text.
- Any invented artist name, style claim, price, award or founding year.

---

# Critique — "could these two be the same template?"

The required test: **if the logos and names disappeared, could these be mistaken for the same
template with different branding?**

Honest answer: **no**, and here is the audit that establishes it.

| Axis | Eik | Stabukk | Same? |
| --- | --- | --- | :-: |
| Ground | Light bone `#F4F1EA` | Press black `#0B0B0C` | ❌ |
| Display family | Instrument Serif (high-contrast serif) | Archivo Expanded 900 (grotesque) | ❌ |
| Display scale | `max 4.6rem` — restrained | `max 11rem` — viewport-scale | ❌ |
| Text family | Inter | Archivo | ❌ |
| Annotation | JetBrains Mono | Space Mono | ❌ |
| Grid | Symmetric, centred, 1180px max | Asymmetric, full-bleed, odd spans | ❌ |
| Overlap | Never | Structural | ❌ |
| Containment | Hairline-framed cards | Edge-to-edge plates | ❌ |
| Radius | 2px | 0px | ❌ |
| Accent | Oxidised copper `#A85A33` | Registration red `#D8452F` | ❌ |
| Photography | Bright, high-key, warm, true colour | High-contrast monochrome + grain | ❌ |
| Motion duration | 160–240 ms | 380–620 ms | ❌ |
| Signature motion | Fade-rise 12px | Clip-path print wipe | ❌ |
| Portfolio form | Uniform 4:5 editorial grid with captions below | Varied-ratio vertical plate stack, hanging margin captions | ❌ |
| Signature graphic | Hairline spec rule + numbered steps | Red registration ticks + plate numbers | ❌ |
| Route depth | 8 routes, service-page-led | 6 routes, work-led | ❌ |
| Voice | Reassuring, explanatory, second person | Declarative, sparse, third person | ❌ |

**Where the risk actually was, and what was changed:**

1. **Both were initially going to be dark.** The first pass had Eik on charcoal with a bone
   accent — which would have made the two sites *structurally identical objects with different
   fonts*. Eik was inverted to a light bone ground. This is the single decision that most
   separates them, and it happens to be the strategically stronger choice for Eik anyway,
   because a bright page answers the hygiene objection before the copy does.

2. **Both used a mono label layer.** This is a genuine shared device and it was nearly cut
   from Eik. It survives because the two uses are semantically opposite: Eik's mono is a
   *clinical datasheet* voice (`01 — KONSULTASJON`, `STØRRELSE / 8–12 CM`) set small, quiet,
   and aligned inside the grid; Stabukk's is a *printer's annotation* hanging outside the
   image in the margin. Different faces, different placement, different register. Verified
   at thumbnail size: they do not read as the same device.

3. **Both had a numbered-step process section.** Retained, because numbering a process is a
   content decision, not a style one — but the rendering was forced apart: Eik's steps are
   rows separated by hairline rules inside the centred grid; Stabukk's are full-bleed
   alternating-alignment plates with red ticks. Same information, unrecognisably different
   objects.

4. **Both would have had a 3-up portfolio grid.** Stabukk's was rebuilt as the varied-ratio
   plate stack specifically to break the resemblance. Eik keeps the disciplined grid because
   *for Eik, the grid is the point* — regularity signals precision to a nervous first-timer.

**Thumbnail test:** rendered at 200px wide with names removed, Eik is a pale, orderly,
rule-divided page and Stabukk is a black page with one enormous cropped word. They are not
confusable. Proceed to build.
