import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";

/**
 * Shared by the Marine Max site layout and its proposal layout, so the two cannot drift
 * apart and the font is only defined once. `next/font` must be called at module scope,
 * which is why this is a module rather than a function.
 *
 * Barlow Condensed is chosen by the Norwegian language, not by taste: compounds like
 * "båtmotorservice" and "vinterkonservering" will not fit a normal-width grotesque at
 * display size on a 375px screen without hyphenation or a size that stops carrying.
 */
export const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

export const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** The instrument-panel voice: every piece of technical data wears it. */
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

/** The class list that opens the `.mm` scope every rule in marine-max.css hangs off. */
export const MM_SCOPE = `mm ${barlow.variable} ${barlowCondensed.variable} ${plexMono.variable}`;
