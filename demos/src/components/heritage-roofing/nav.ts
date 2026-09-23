/**
 * Navigation lives in a plain module rather than inside the header component, so the
 * footer and the drawer read the same list and cannot drift out of step with it.
 *
 * `inHeader` keeps the desktop bar to six items. Roof repair and replacement are reachable
 * from the problem cards, the roofing hub and the footer — putting all eight in the header
 * crowds it without helping anyone decide.
 */
export type NavItem = { href: string; label: string; inHeader: boolean };

export const HR_NAV: NavItem[] = [
  { href: "/heritage-roofing", label: "Home", inHeader: false },
  { href: "/heritage-roofing/roofing", label: "Roofing", inHeader: true },
  { href: "/heritage-roofing/commercial-roofing", label: "Commercial", inHeader: true },
  { href: "/heritage-roofing/roof-repair", label: "Roof Repair", inHeader: false },
  { href: "/heritage-roofing/roof-replacement", label: "Roof Replacement", inHeader: false },
  { href: "/heritage-roofing/gutters", label: "Gutters", inHeader: true },
  { href: "/heritage-roofing/siding", label: "Siding", inHeader: true },
  { href: "/heritage-roofing/about", label: "About", inHeader: true },
  { href: "/heritage-roofing/contact", label: "Contact", inHeader: true },
];
