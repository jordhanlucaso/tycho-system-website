/**
 * The in-page sections. Drives the nav, the scrollspy and the footer.
 *
 * `BASE` is the concept prefix this host serves the client under. On handover it becomes
 * "" and every href below is already the one the client keeps.
 */
export const BASE = "/calloway-roofing";


export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Nav order differs from document order: services come before about in the markup. */
export const NAV_ITEMS = SECTIONS;

/**
 * Footer labels are free text in config. A label naming a section links to it; anything
 * else (a policy page a client adds later) falls back to the contact route.
 */
export function hrefForLabel(label: string): string {
  const match = SECTIONS.find((s) => s.label.toLowerCase() === label.trim().toLowerCase());
  return match ? `${BASE}#${match.id}` : `${BASE}/contact`;
}
