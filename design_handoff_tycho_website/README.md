# Handoff: Tycho Systems website redesign

## Overview
A full redesign of the Tycho Systems marketing homepage (https://tychosystem.com) — a studio that builds modern websites (and now AI agents) for local businesses and individuals. The redesign introduces a distinctive **"Web Observatory"** identity inspired by the astronomer Tycho Brahe: deep navy skies, precision-instrument geometry, technical monospace labels, and orbital motion. The goals: feel unique (not generic), build trust, make the process legible, and showcase work.

## About the design files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior. They are **not production code to copy directly**: the `.dc.html` files use a custom preview runtime (`support.js`) and inline styles for live editing. Your task is to **recreate these designs in the target codebase** using its existing framework, components, and styling conventions (React/Next, Astro, Vue, plain HTML/CSS — whatever the repo uses). If the repo has no framework yet, choose the most appropriate one and implement there.

- `Tycho Systems.dc.html` — the homepage design reference (open in a browser to view).
- `Tycho Design System.dc.html` — the design-system reference: brand mark, color tokens, type scale, components, motifs.
- `CLAUDE_CODE_PROMPT.md` — a paste-ready prompt to drive the implementation.
- `image-slot.js`, `support.js` — preview-runtime files. **Do not ship these**; they only make the references render.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interactions are all specified. Recreate the UI faithfully using the codebase's existing libraries and patterns.

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Sky / Base | `#0B1120` | Page background |
| Surface | `#0E1528` | Cards, panels |
| Raised | `#14203A` | Elevated surfaces (rarely used) |
| Hairline | `#FFFFFF` @ 6–14% opacity | Borders, dividers |
| Azure (primary) | `#6FA8FF` | Primary actions, links, accent geometry |
| Azure hover | `#8DBBFF` | Hover state of primary |
| Azure deep | `#3C6FD6` / `#2F5DBE` | Gradient shadow side of spheres |
| Gold (star) | `#E7B85C` | The single warm accent — the "fixed star". Used sparingly: logo dot, "after launch" callout, outer planet |
| Text primary | `#E9EEF9` | Headings, high-emphasis text |
| Text body | `#C7D0E4` / `#A9B4CC` | Body copy |
| Text muted | `#93A0BD` | Secondary copy |
| Text faint | `#6B7795` / `#4E5A77` | Mono labels, footer meta |

Accent glows are radial-gradients of `rgba(111,168,255,0.12–0.22)` fading to transparent — not box-shadows on big elements.

### Typography
- **Display / headings** — `Space Grotesk`, weight 600, letter-spacing `-0.02em` to `-0.025em`, line-height ~1.03. Fluid sizes via `clamp()` (hero ~`clamp(40px,6.2vw,76px)`; section H2 ~`clamp(28px,4vw,46px)`).
- **Body** — `IBM Plex Sans`, weight 400, line-height 1.6. Sizes 14–19px.
- **Labels / eyebrows / meta** — `IBM Plex Mono`, weight 400–500, UPPERCASE, letter-spacing `0.14em–0.20em`. Sizes 11–13px. The recurring eyebrow form is `[ Label · 01–04 ]` in azure.

Load all three (e.g. Google Fonts / Fontsource / next-font), matching the repo's font-loading convention.

### Spacing, radius, motion
- Section vertical padding: `clamp(56px,8vw,104px)`; page horizontal gutter: `clamp(20px,6vw,80px)`; max content width `1200px` (docs page `1080px`).
- Radius: pills `999px`; buttons `11px`; cards `14–16px`; icon tiles `10px`.
- Grids use `repeat(auto-fit, minmax(<min>, 1fr))` so they collapse to one column on mobile. Gaps 16–20px (1px gap + shared bg for the "joined" process grid).
- Motion: gentle float (`translateY` ±8px, 7s), orbital rotations (12–30s linear). **Respect `prefers-reduced-motion`** — disable starfield twinkle and all orbital/float animation.

## Screens / views — homepage, section by section

### 1. Nav (sticky)
Sticky top bar, `backdrop-filter: blur(14px)`, bg `rgba(11,17,32,0.72)`, 1px bottom hairline. Left: logo mark (24–26px orbital SVG) + "Tycho Systems" (Space Grotesk 600, 17px). Right: text links *Work / Process / Services* (muted, 14px, hover → primary text), then a primary button **"Start a project"** (azure bg, `#0B1120` text, radius 9px, `white-space:nowrap`). Collapses/wraps on narrow widths.

### 2. Hero
Two-column grid (`minmax(330px,1fr)` auto-fit), vertical padding `clamp(56px,9vw,108px)`.
- **Left:** pill badge ("Tycho Systems · Web Observatory" with a pulsing gold dot), H1 **"Websites, charted with precision."** (line break before "with precision"), sub-paragraph: *"We build modern websites — and the AI agents that run on them — for local businesses, mapped from first discovery to launch and watched over on every orbit after."*, two buttons (primary "Start a project →", secondary "See the work"), and a mono process micro-line.
- **Right — hero visual, TWO variants (see State):**
  - **3D solar system (default):** a CSS-3D scene — a plane tilted `rotateX(60deg)` (perspective `1100px`) holding 3 concentric elliptical orbit rings, a central glowing **sun** (54px, azure radial-gradient + soft glow), and 3 orbiting **planets** (outer gold 20px @30s, mid azure 13px @20s, inner azure 9px @12s). Each planet sits on a full-size rotor that spins; a nested counter-rotation (reverse, same duration) + `rotateX(-60deg)` keeps the sphere upright and camera-facing. A soft elliptical ground-glow sits under the system. The whole scene gently floats.
  - **2D orbit:** a flat `420×420` SVG — crosshair ticks, 4 concentric circles (one dashed), 3 small orbiting bodies (gold + two azures), and a gradient core with shadow dots.
- **Behind everything:** a full-bleed `<canvas>` starfield (faint twinkling points, ~90% azure / ~10% gold) + a large azure radial glow at top. Density is tweakable (see State).
- Below the hero, a full-width **process ribbon**: mono uppercase `Discovery · Design · Build · Launch · Care` (Care in gold), inside top/bottom hairlines.

### 3. Audience line
A single large statement (Space Grotesk 400, `clamp(20px,2.6vw,30px)`): *"Built for the businesses that hold a neighborhood together —"* in primary text, continuing *" restaurants, trades, studios, clinics, shops — and increasingly, the people behind them."* in muted. Signals the small-business → private-consumer transition.

### 4. Process
Eyebrow `[ The process · 01–04 ]`, H2 "From first contact to launch day.", short intro paragraph at right. Then a 4-column grid of **step cards** joined by 1px gaps over a hairline bg (rounded 16px, surface `#0E1528`): each card = mono number (01–04, azure), Space Grotesk 19px title, muted description.
- 01 Discovery — "We learn your business, your customers, and what a win actually looks like."
- 02 Design — "We chart the layout, voice, and look — and agree on the map before a line is built."
- 03 Build — "We construct a fast, accessible site, tested on every screen it will live on."
- 04 Launch — "We go live, hand over the keys, and make sure everything holds steady."

Below: the **"after launch" callout** — gold-bordered panel (`rgba(231,184,92,0.28)` border, `rgba(231,184,92,0.05)` bg, radius 16px): mono gold label "↻ After launch" + "We keep watch. Updates, fixes, and improvements on a simple monthly plan — whenever you need them, for as long as you need them."

### 5. Selected work
Eyebrow `[ Selected work ]`, H2 "A few things we've built." Then a 3-column grid (`minmax(290px,1fr)`) of **figures**: each a `16/11` image area (surface bg, 1px hairline, radius 16px) + a mono caption row (project label left, year right). In production these are real responsive `<img>` (or the repo's image component) of project screenshots. **Currently placeholders** — leave clearly-labeled gaps if real images aren't supplied. Captions: "RESTAURANT — full redesign '25", "HOME SERVICES — new build '25", "WELLNESS STUDIO — booking site '24".

### 6. Services
Slightly raised section bg. Eyebrow `[ What we build ]`, H2 "Everything a small business needs to look like a big one." Then a grid (`minmax(260px,1fr)`) of **5 service cards** (surface bg, 1px hairline, radius 16px). Each: a 38px icon tile (radius 10px, 1px border) with a mono glyph or small SVG, Space Grotesk 18px title, muted description.
- **New websites** (glyph `+`, azure) — "A modern site built from scratch around your goals and your customers."
- **Redesigns** (glyph `↺`, azure) — "A faster, sharper version of the site you already have — without the headache."
- **AI agents** (NEW — small constellation SVG icon, azure; card has a subtle azure gradient bg + a mono **"New"** pill in the top-right) — "Smart assistants that answer questions, book appointments, and follow up with customers — on your site, around the clock." This is a newly added service line; give it light visual emphasis but keep it within the system (azure, not a second gold).
- **Personal & portfolio** (glyph `★`, gold tile) — "For individuals and creators, not just businesses — a home for your name online."
- **Ongoing care** (glyph `↻`, azure) — "Hosting, updates, and support so your site never goes stale or breaks quietly."

### 7. CTA
Centered, generous padding, a bottom azure radial glow. Eyebrow `[ Set a course ]`, H2 **"Ready to put your business on the map?"**, sub-paragraph "Tell us where you are and where you want to be. We'll chart the route from there.", primary button "Start a project →" + a mono outline button showing the email `hello@tychosystem.com`.

### 8. Footer
Top hairline. Left: logo + name + tagline "Modern websites for local businesses — and the people behind them." Two link columns: **Navigate** (Work / Process / Services) and **Contact** (email / Start a project). Bottom strip (mono, faint): "© <year> Tycho Systems" left, "LAT 0.00 · LON 0.00 · CHARTED WITH PRECISION" right.

## Brand mark
An orbital glyph: outer ring (1.4px azure stroke), inner ring (azure @55% opacity), and a small **gold dot** at ~`(16.4, 9.6)` on a `26×26` viewBox — "a planet observed, and the fixed star you navigate by." Min size 20px; clear space = the ring's radius. On light backgrounds use `#0B1120` strokes and a darker gold (`#C99A2E`).

## Components to build (reusable)
- **Button** — primary (azure bg / dark text) and secondary (translucent white bg, 1px border, light text); radius 11px, 13×22px padding, mono "→" affix optional.
- **PillBadge** — translucent azure bg, 1px azure border, radius 999px, mono uppercase label, optional leading dot (gold pulsing variant for the hero).
- **SectionLabel** — the mono `[ … ]` eyebrow in azure.
- **StepCard** — mono index + title + muted copy.
- **ServiceCard** — icon tile + title + copy; supports an optional "New" pill and accent variant (the AI-agents card).
- **Logo** — the orbital SVG mark, sizable.
- **HeroVisual** — the 3D solar system (and optional 2D fallback) + starfield canvas.

## Interactions & behavior
- Anchor nav scrolls smoothly to `#work / #process / #services / #contact`.
- Buttons/links: hover lightens bg / brightens text; primary lifts `translateY(-1px)`.
- Starfield: `<canvas>` sized to its section via `getBoundingClientRect`, DPR-aware, `requestAnimationFrame` twinkle loop; rebuild on resize.
- Orbital/float motion: pure CSS keyframes (rotate / translateY).
- **Reduced motion / "animate off":** stop the twinkle loop (draw one static frame) and disable all CSS animation.

## State (design tweaks present in the reference)
The reference exposes three controls; treat as optional config in production (default to the first value):
- **heroVisual** — `"3D solar system"` (default) | `"2D orbit"`. Switches the hero visual.
- **animate** — boolean (default true). When false, all motion stops (use for reduced-motion).
- **starfield** — `"Dense" | "Balanced" (default) | "Sparse" | "Off"`. Controls star count.

Ship the **3D solar system** as the default hero. If wiring the toggle is cheap in your stack, expose it; otherwise the 2D variant can be dropped.

## Assets
- No external image assets ship with the design — the logo, hero visuals, and all icons are inline SVG/CSS (recreate them as components).
- Portfolio images are **user-supplied screenshots** (3 needed) — currently placeholders.
- Fonts: Space Grotesk, IBM Plex Sans, IBM Plex Mono (Google Fonts / Fontsource).
- Email used throughout: `hello@tychosystem.com` (confirm before shipping).

## Files in this bundle
- `Tycho Systems.dc.html` — homepage reference
- `Tycho Design System.dc.html` — design-system reference
- `CLAUDE_CODE_PROMPT.md` — paste-ready implementation prompt
- `image-slot.js`, `support.js` — preview runtime (do not ship)
