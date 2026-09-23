/**
 * Navigation lives in a plain module, not in the "use client" chrome components.
 *
 * Values exported from a client module cross the RSC boundary as client references, so a
 * server component importing them gets a proxy rather than the array — the footer would
 * fail at prerender time.
 */

export const EIK_NAV = [
  { href: "/eik/tatovering", label: "Tatovering", n: "01" },
  { href: "/eik/piercing", label: "Piercing", n: "02" },
  { href: "/eik/portefolje", label: "Portefølje", n: "03" },
  { href: "/eik/artister", label: "Tatovører", n: "04" },
  { href: "/eik/prosess", label: "Slik jobber vi", n: "05" },
  { href: "/eik/etterbehandling", label: "Etterbehandling", n: "06" },
] as const;

/** Header shows the first five; the drawer and footer show everything. */
export const EIK_HEADER_NAV = EIK_NAV.slice(0, 5);

export const SBK_NAV = [
  { href: "/stabukk/arbeider", label: "Arbeider", n: "01" },
  { href: "/stabukk/studio", label: "Studio", n: "02" },
  { href: "/stabukk/prosess", label: "Prosess", n: "03" },
  { href: "/stabukk/besok", label: "Besøk", n: "04" },
] as const;

export interface NavItem {
  href: string;
  label: string;
  n: string;
}

export const CF_NAV: NavItem[] = [
  { href: "/classic-frisor/behandlinger", label: "Behandlinger", n: "01" },
  { href: "/classic-frisor/frisorene", label: "Frisøren", n: "02" },
  { href: "/classic-frisor/arbeid", label: "Arbeid", n: "03" },
  { href: "/classic-frisor/kontakt", label: "Kontakt", n: "04" },
];
