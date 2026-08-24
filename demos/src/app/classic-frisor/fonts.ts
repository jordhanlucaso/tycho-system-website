import { Fraunces, Inter } from "next/font/google";

/**
 * Shared by the site layout and the proposal layout so the two cannot drift.
 *
 * Fraunces carries the warmth the direction asks for without tipping into luxury, and it
 * draws Æ Ø Å properly. Only the weights actually used are requested — a variable font with
 * every axis loaded costs more on a 3G phone than the design gains.
 */
export const fraunces = Fraunces({
  variable: "--font-cf-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-cf-text",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

/** The class list that opens the `.cf` scope every rule in classic-frisor.css hangs off. */
export const CF_SCOPE = `cf ${inter.variable} ${fraunces.variable}`;
