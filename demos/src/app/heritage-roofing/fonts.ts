import { Bitter, Libre_Franklin } from "next/font/google";

/**
 * Bitter is a slab serif: it reads as a trade that predates the internet, which is the
 * whole brief — an established Alabama contractor. It carries every heading and nothing
 * else. Libre Franklin carries body copy, navigation and form labels; an American
 * grotesque wide enough to stay readable at 15px on a phone held outdoors.
 *
 * Only the weights the design uses. A visitor to another concept on this host downloads
 * neither: fonts load from this layout, not the root one.
 */
export const bitter = Bitter({
  variable: "--font-hr-display-face",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const libreFranklin = Libre_Franklin({
  variable: "--font-hr-text-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** The class list that opens the `.hr` scope every rule in heritage-roofing.css hangs off. */
export const HR_SCOPE = `hr ${bitter.variable} ${libreFranklin.variable}`;
