import { Archivo, Source_Sans_3 } from "next/font/google";

/**
 * Only the weights the design uses. Archivo carries every heading and the stat numerals;
 * Source Sans 3 carries body copy. A visitor to another concept on this host never
 * downloads either — fonts load from this layout, not the root one.
 */
export const archivo = Archivo({
  variable: "--font-cr-display-face",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const sourceSans = Source_Sans_3({
  variable: "--font-cr-text-face",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/** The class list that opens the `.cr` scope every rule in calloway-roofing.css hangs off. */
export const CR_SCOPE = `cr ${archivo.variable} ${sourceSans.variable}`;
