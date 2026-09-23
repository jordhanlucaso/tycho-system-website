/**
 * Contrast-safe tokens derived from the single `accent` hex in config.
 *
 * The problem this solves: the template ships four accents — orange, yellow, red, blue —
 * and they sit two stops apart in luminance. One raw hex cannot be legible as small text
 * on a warm-white card *and* on a navy band, and white-on-yellow is unreadable at any
 * size. Picking per-accent overrides by hand would mean a colour decision in every client
 * build, which is exactly what this template exists to avoid.
 *
 * So the accent is treated as the brand hue, not as a literal paint value, and four
 * tokens are computed from it at build time:
 *
 *   --cr-accent            the hue itself. NON-TEXT ONLY: rules, dots, chip fills, borders,
 *                       the logo mark. Contrast minimums do not apply to these.
 *   --cr-accent-ink        accent text and icons on the light sections (paper / white).
 *                       Darkened until it clears 4.5:1.
 *   --cr-accent-on-dark    accent text and icons on the navy sections. Lightened until it
 *                       clears 4.5:1.
 *   --cr-accent-solid      solid button and badge background,
 *   --cr-accent-solid-fg   with the label colour that clears 4.5:1 against it,
 *   --cr-accent-solid-hover and the hover fill, moved away from that label rather than
 *                       always darker, so hover cannot drop the pair below AA.
 *
 * Mixing happens in OKLab, the same space as the `color-mix()` tints in globals.css, so a
 * derived token and a derived tint stay in the same hue family.
 */

type RGB = [number, number, number];

const PAPER: RGB = [246, 244, 241];
const WHITE: RGB = [255, 255, 255];
const INK: RGB = [16, 28, 46];
const INK_DEEP: RGB = [10, 17, 32];
const BLACK: RGB = [0, 0, 0];

/** WCAG AA for normal-size text. Large text would allow 3:1; nothing here relies on that. */
const AA = 4.5;

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "").trim();
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex([r, g, b]: RGB): string {
  const part = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

const toLinear = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (c: number) => {
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  return s * 255;
};

function luminance([r, g, b]: RGB): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrast(a: RGB, b: RGB): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function rgbToOklab([r, g, b]: RGB): RGB {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, A, B]: RGB): RGB {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** The same interpolation `color-mix(in oklab, a t%, b)` performs. */
function mix(a: RGB, b: RGB, t: number): RGB {
  const x = rgbToOklab(a);
  const y = rgbToOklab(b);
  return oklabToRgb([
    x[0] + (y[0] - x[0]) * t,
    x[1] + (y[1] - x[1]) * t,
    x[2] + (y[2] - x[2]) * t,
  ]);
}

/**
 * Smallest nudge of `accent` toward `toward` that clears `AA` against every background.
 * Returns the mix amount as well, so the caller can compare how far each option had to
 * travel. 1 means "even the pure endpoint did not get there", which only happens for a
 * foreground that was never viable.
 */
function nudge(accent: RGB, toward: RGB, backgrounds: RGB[]): { color: RGB; amount: number } {
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const candidate = mix(accent, toward, t);
    if (backgrounds.every((bg) => contrast(candidate, bg) >= AA)) {
      return { color: candidate, amount: t };
    }
  }
  return { color: toward, amount: 1 };
}

export type AccentTokens = {
  accent: string;
  accentInk: string;
  accentOnDark: string;
  accentSolid: string;
  accentSolidFg: string;
  accentSolidHover: string;
};

export function accentTokens(hex: string): AccentTokens {
  const accent = hexToRgb(hex);

  // Text on the light sections, and on the navy ones.
  const ink = nudge(accent, BLACK, [PAPER, WHITE]);
  const onDark = nudge(accent, WHITE, [INK, INK_DEEP]);

  // Solid buttons. The fill stays the configured hex — a CTA painted in a colour that is
  // not quite the client's brand colour is the one compromise a white-label template
  // cannot make — and the label takes whichever of white or ink clears AA against it.
  // White wins when both do. Only if neither passes (a mid-luminance accent) does the
  // fill get darkened to hold a white label.
  const whitePasses = contrast(accent, WHITE) >= AA;
  const inkPasses = contrast(accent, INK) >= AA;

  let solid = accent;
  let solidFg = WHITE;
  if (!whitePasses && inkPasses) {
    solidFg = INK;
  } else if (!whitePasses && !inkPasses) {
    solid = nudge(accent, BLACK, [WHITE]).color;
  }

  // Hover has to move the fill *away* from the label, not toward it: darkening a fill
  // that carries an ink label is what would quietly drop a button below AA on hover.
  const towardOnHover = solidFg === WHITE ? BLACK : WHITE;
  const hover = mix(solid, towardOnHover, 0.12);

  return {
    accent: rgbToHex(accent),
    accentInk: rgbToHex(ink.color),
    accentOnDark: rgbToHex(onDark.color),
    accentSolid: rgbToHex(solid),
    accentSolidFg: rgbToHex(solidFg),
    accentSolidHover: rgbToHex(
      contrast(hover, solidFg) >= AA ? hover : solid,
    ),
  };
}

/** The inline custom properties for the `.cr` scope wrapper. */
export function accentStyle(hex: string): Record<string, string> {
  const t = accentTokens(hex);
  return {
    "--cr-accent": t.accent,
    "--cr-accent-ink": t.accentInk,
    "--cr-accent-on-dark": t.accentOnDark,
    "--cr-accent-solid": t.accentSolid,
    "--cr-accent-solid-fg": t.accentSolidFg,
    "--cr-accent-solid-hover": t.accentSolidHover,
  };
}
