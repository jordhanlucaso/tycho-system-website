# Paste-ready prompt for Claude Code

> Copy everything in the block below into Claude Code, run from the root of your
> Tycho Systems website repository. Make sure the four files from this handoff
> folder (`Tycho Systems.dc.html`, `Tycho Design System.dc.html`,
> `README.md`, plus the `image-slot.js` / `support.js` runtime files) are
> accessible — either copied into the repo at `design_handoff/` or referenced by
> absolute path.

---

```
I'm redesigning the Tycho Systems website (https://tychosystem.com). I have a
finished high-fidelity design and a written spec. Your job is to implement this
design in THIS repository, using the stack and conventions already present here.

## Before you write anything
1. Detect the stack. Inspect package.json / framework config and tell me what
   this repo uses (e.g. Next.js, Astro, plain Vite/React, etc.), where pages and
   components live, how styling is done (CSS Modules, Tailwind, styled-components,
   plain CSS), and how fonts are currently loaded. Summarize this back to me
   before making changes.
2. Read the design references in ./design_handoff/:
   - `README.md` — the authoritative spec. Exact colors, type scale, spacing,
     section-by-section layout, copy, and interactions are all in there.
   - `Tycho Systems.dc.html` — the homepage design reference.
   - `Tycho Design System.dc.html` — the design-system / token reference.
   IMPORTANT: these `.dc.html` files are DESIGN REFERENCES, not production code.
   They use a custom rendering runtime (support.js) and inline styles for
   previewing. Do NOT copy them in verbatim or import support.js. Recreate the
   design natively in this repo's framework and styling system.

## What to build
A redesigned homepage with these sections in order: sticky nav, hero (with
animated starfield + orbital diagram), audience line, process (4 steps + an
"after launch" callout), selected work (3-image portfolio grid), services
(5 cards, including a flagged "AI agents" service), CTA, footer. Full details and
exact values are in README.md.

The hero visual has TWO variants behind a toggle: a 3D CSS solar system
(default) and a flat 2D orbital diagram. Implement the 3D one as the default and
expose the toggle if your stack makes that easy; otherwise ship the 3D variant.

## How to implement
- Establish design tokens FIRST, in whatever mechanism this repo uses (CSS
  custom properties, a Tailwind theme extend, a theme file). Token values are in
  README.md ("Design Tokens"). Everything else should consume these tokens.
- Load fonts the way this repo already loads fonts: Space Grotesk (display),
  IBM Plex Sans (body), IBM Plex Mono (labels). Use next/font, Astro fonts,
  Fontsource, or a <link>, matching existing convention.
- Build reusable components for the repeated patterns: Button (primary /
  secondary), PillBadge, StepCard, ServiceCard, SectionLabel (the mono
  "[ ... ]" eyebrow), Logo (the orbital SVG mark). Match the repo's existing
  component file structure and naming.
- The hero starfield is a <canvas> animation; the orbital diagram is an inline
  SVG with CSS keyframe rotations. Port both. The animation logic is in the
  <script> / logic section of `Tycho Systems.dc.html` — reference its behavior,
  but write it idiomatically for this stack (e.g. a useEffect hook in React).
  Respect prefers-reduced-motion: pause/disable both animations when set.
- The portfolio uses drag-and-drop image placeholders in the design. In
  production, replace those with normal responsive <img> elements (or the repo's
  image component, e.g. next/image) pointing at real project screenshots. Leave
  clearly-labeled placeholders if the images aren't available yet.
- Match the design responsively: it uses fluid clamp() type and
  auto-fit/minmax grids that collapse to single column on mobile. Preserve that
  behavior.

## Constraints
- Use this repo's existing patterns, libraries, and conventions over anything in
  the reference files. When in doubt, match the surrounding codebase.
- Accessibility: semantic landmarks (header/nav/main/section/footer), real
  heading hierarchy, descriptive link text, alt text on portfolio images, AA
  contrast (the spec colors already pass), visible focus states, and
  reduced-motion support.
- Keep copy EXACTLY as written in the spec unless I say otherwise.

## Process
Work section by section. After you've set up tokens + fonts + the nav and hero,
pause and show me before continuing so I can confirm the direction. Then proceed
through the remaining sections.
```

---

## Notes for you (the repo owner), not for Claude Code

- If your site is **not** yet a code repo (e.g. it's on a no-code/site builder),
  this prompt won't apply directly — tell me and I can prepare a different export
  (static HTML/CSS, or platform-specific instructions).
- The email used throughout the design is `hello@tychosystem.com` — change it
  in the spec if that's wrong before handing off.
- Portfolio images are placeholders. Have 3 real project screenshots ready and
  point Claude Code at them, or it will leave labeled gaps.
