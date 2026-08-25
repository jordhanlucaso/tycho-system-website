/**
 * The engagement registry — the single source of truth for what lives on this host.
 *
 * Adding a client used to mean hand-editing six files (hub, proposal index, sitemap, QA
 * route list, nav, notes) and creating five asset trees. Six chances to forget one, and the
 * same six to miss when deleting a demo that was declined. Everything derivable is now
 * derived from here; `scripts/demo.mjs status` asserts this file against the filesystem and
 * reports drift in either direction.
 *
 * Two levels, because they are genuinely different things:
 *
 *   Engagement — one sales opportunity. Has a proposal, a docs folder under engagements/,
 *                and a lifecycle. `tatovering-tonsberg` is one engagement covering two
 *                studios, because it was pitched as one job.
 *   Concept    — one site root. Has routes, a CSS scope, a data module and a component
 *                directory. This is what ejects to a standalone repo when a client says yes.
 */

/** Days a demo stays up after it has been presented, before `status` flags it overdue. */
export const RETENTION_DAYS = 60;

export type EngagementStatus =
  /** Being built. On the demo host, never presented. */
  | "draft"
  /** Shown to the client. The retention clock runs from `presented`. */
  | "presented"
  /** Client said yes. Eject to its own repo, then retire from here. */
  | "won"
  /** Client said no, or the clock ran out. Retire. */
  | "declined";

export interface ConceptRoute {
  /** Absolute path as served, e.g. "/marine-max/tjenester". */
  path: string;
  /** Sitemap priority, used only once the concept is indexable. */
  priority: number;
}

export interface Concept {
  /** URL segment and route-folder name: src/app/<slug>. */
  slug: string;
  /** The CSS scope class its stylesheet hangs off, without the dot. */
  scope: string;
  /** Client-facing name. */
  name: string;
  /** One line for the hub. */
  blurb: string;
  routes: readonly ConceptRoute[];
  /** Paths relative to demos/, for `status` drift checks and for `eject`. */
  componentDir: string;
  dataModule: string;
  stylesheet: string;
}

export interface Engagement {
  /** Folder name under engagements/, and the proposal segment. */
  slug: string;
  label: string;
  place: string;
  status: EngagementStatus;
  /** ISO 8601 everywhere in storage. Rendered DD-MM-YYYY. */
  started: string;
  /** Set when the proposal is actually shown. Starts the retention clock. */
  presented?: string;
  /** Set when the client decides, either way. */
  decided?: string;
  proposalNote: string;
  concepts: readonly Concept[];
}

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    slug: "marine-max",
    label: "Marine Max",
    place: "Båtverksted · Nøtterøy",
    status: "draft",
    started: "2026-08-23",
    proposalNote:
      "Ti seksjoner: situasjon, søk, konkurranse, kundereise, nettsted, automatisering, neste steg.",
    concepts: [
      {
        slug: "marine-max",
        scope: "mm",
        name: "Marine Max",
        blurb:
          "Verksted / Sjø / Én mann — symptomstyrt reparasjonsside og strukturert serviceforespørsel.",
        componentDir: "src/components/marine",
        dataModule: "src/data/marine.ts",
        stylesheet: "src/app/marine-max/marine-max.css",
        routes: [
          { path: "/marine-max", priority: 1.0 },
          { path: "/marine-max/tjenester", priority: 0.9 },
          { path: "/marine-max/batmotor-service", priority: 0.9 },
          { path: "/marine-max/batreparasjon", priority: 0.9 },
          { path: "/marine-max/tidligere-arbeid", priority: 0.6 },
          { path: "/marine-max/om-marine-max", priority: 0.7 },
          { path: "/marine-max/bestill-service", priority: 0.9 },
          { path: "/marine-max/kontakt", priority: 0.8 },
        ],
      },
    ],
  },
  {
    slug: "tatovering-tonsberg",
    label: "Tatovering i Tønsberg",
    place: "Tatoveringsstudioer · Tønsberg",
    status: "draft",
    started: "2026-08-20",
    proposalNote: "Eik og Stabukk i ett dokument med klientveksler. Ni seksjoner.",
    concepts: [
      {
        slug: "eik",
        scope: "eik",
        name: "Eik Tattoo & Piercing",
        blurb: "Skin / Steel / Ink — lys, redaksjonell, presis. Forgrenet bookingflyt.",
        componentDir: "src/components/eik",
        dataModule: "src/data/eik.ts",
        stylesheet: "src/app/eik/eik.css",
        routes: [
          { path: "/eik", priority: 1.0 },
          { path: "/eik/tatovering", priority: 0.9 },
          { path: "/eik/piercing", priority: 0.9 },
          { path: "/eik/portefolje", priority: 0.8 },
          { path: "/eik/artister", priority: 0.7 },
          { path: "/eik/prosess", priority: 0.7 },
          { path: "/eik/etterbehandling", priority: 0.6 },
          { path: "/eik/sporsmal", priority: 0.6 },
          { path: "/eik/booking", priority: 0.9 },
        ],
      },
      {
        slug: "stabukk",
        scope: "sbk",
        name: "Stabukk Tattoo Studio",
        blurb: "Plate / Press / Skin — svart, platebasert portefølje, ett skjema.",
        componentDir: "src/components/stabukk",
        dataModule: "src/data/stabukk.ts",
        stylesheet: "src/app/stabukk/stabukk.css",
        routes: [
          { path: "/stabukk", priority: 1.0 },
          { path: "/stabukk/arbeider", priority: 0.9 },
          { path: "/stabukk/studio", priority: 0.8 },
          { path: "/stabukk/prosess", priority: 0.7 },
          { path: "/stabukk/besok", priority: 0.7 },
          { path: "/stabukk/booking", priority: 0.9 },
        ],
      },
    ],
  },
  {
    slug: "classic-frisor",
    label: "Classic Frisør",
    place: "Frisørsalong · Teie, Nøtterøy",
    status: "draft",
    started: "2026-08-24",
    proposalNote:
      "Ti seksjoner: situasjon, søk, konkurransen på Smidsrødveien, kundereise, booking, lokal synlighet, gjenbesøk, tilbud, neste steg.",
    concepts: [
      {
        slug: "classic-frisor",
        scope: "cf",
        name: "Classic Frisør",
        blurb:
          "Stol / Lys / Gate — priser i klartekst der ingen konkurrent publiserer dem, og booking i første skjermbilde.",
        componentDir: "src/components/classic-frisor",
        dataModule: "src/data/classic-frisor.ts",
        stylesheet: "src/app/classic-frisor/classic-frisor.css",
        routes: [
          { path: "/classic-frisor", priority: 1.0 },
          { path: "/classic-frisor/behandlinger", priority: 0.9 },
          { path: "/classic-frisor/bestill-time", priority: 0.9 },
          { path: "/classic-frisor/frisorene", priority: 0.7 },
          { path: "/classic-frisor/arbeid", priority: 0.6 },
          { path: "/classic-frisor/kontakt", priority: 0.8 },
        ],
      },
    ],
  },
];

/* ── Derived views. Nothing below should ever be hand-maintained. ───────────────────── */

/** Engagements still occupying the host. `won` and `declined` are awaiting retirement. */
export const LIVE_ENGAGEMENTS = ENGAGEMENTS.filter(
  (e) => e.status === "draft" || e.status === "presented",
);

export const CONCEPTS: readonly Concept[] = ENGAGEMENTS.flatMap((e) => e.concepts);

export function proposalPath(engagement: Engagement | string): string {
  return `/proposal/${typeof engagement === "string" ? engagement : engagement.slug}`;
}

export function engagementOf(conceptSlug: string): Engagement | undefined {
  return ENGAGEMENTS.find((e) => e.concepts.some((c) => c.slug === conceptSlug));
}

/** Every client-facing route, for the sitemap. Excludes the hub and the proposals. */
export const CLIENT_ROUTES: readonly ConceptRoute[] = CONCEPTS.flatMap((c) => c.routes);

/** Every route this app serves, for the QA sweep. */
export const ALL_ROUTES: readonly string[] = [
  "/",
  "/proposal",
  ...ENGAGEMENTS.map((e) => proposalPath(e)),
  ...CLIENT_ROUTES.map((r) => r.path),
];

/** Retention deadline, or null for a demo that has not been presented yet. */
export function retireBy(engagement: Engagement): Date | null {
  if (!engagement.presented) return null;
  const due = new Date(engagement.presented);
  due.setDate(due.getDate() + RETENTION_DAYS);
  return due;
}

export function daysLeft(engagement: Engagement, now: Date = new Date()): number | null {
  const due = retireBy(engagement);
  if (!due) return null;
  return Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
}
