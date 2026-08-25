/**
 * Factual-integrity primitives.
 *
 * Every business fact on these demo sites is either VERIFIED (corroborated by a
 * first-party source) or TO_CONFIRM (unknown — must be supplied by the client).
 *
 * TO_CONFIRM values are never rendered as marketing claims. They render as a
 * visible, designed gap, and they are excluded from JSON-LD entirely — an
 * unverified claim in structured data is a liability for the client, not just
 * an SEO problem.
 */

export const TO_CONFIRM = Symbol.for("tycho.TO_CONFIRM");
export type ToConfirm = typeof TO_CONFIRM;

/** A value that may not be known yet. */
export type Maybe<T> = T | ToConfirm;

export function isConfirmed<T>(value: Maybe<T>): value is T {
  return value !== TO_CONFIRM;
}

/** Returns the value if confirmed, otherwise `undefined` — for JSON-LD assembly. */
export function confirmed<T>(value: Maybe<T>): T | undefined {
  return isConfirmed(value) ? value : undefined;
}

/**
 * Strips every key whose value is TO_CONFIRM, undefined, null, or an empty
 * array/object. Used to guarantee no placeholder ever reaches structured data.
 */
export function pruneUnconfirmed<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === TO_CONFIRM || value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      const arr = value.filter((v) => v !== TO_CONFIRM && v !== undefined && v !== null);
      if (arr.length === 0) continue;
      out[key] = arr;
      continue;
    }
    if (typeof value === "object") {
      const nested = pruneUnconfirmed(value as Record<string, unknown>);
      if (Object.keys(nested).length === 0) continue;
      out[key] = nested;
      continue;
    }
    if (typeof value === "string" && value.trim() === "") continue;
    out[key] = value;
  }
  return out as Partial<T>;
}

/** Provenance of a fact, so the demo layer can show the client where it came from. */
export type Provenance =
  | "verified"        // first-party or two independent sources
  | "weak"            // single third-party directory — shown only as an internal note
  | "demo-copy"       // written by Tycho Systems as illustrative placeholder copy
  | "to-confirm";     // unknown

export interface Fact<T> {
  value: Maybe<T>;
  provenance: Provenance;
  note?: string;
}

// ---------------------------------------------------------------------------

/** Already schema.org-shaped, so it can go straight into JSON-LD. */
export interface SchemaAddress {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
}

export interface OpeningHours {
  days: readonly (
    | "Monday" | "Tuesday" | "Wednesday" | "Thursday"
    | "Friday" | "Saturday" | "Sunday"
  )[];
  opens: string;
  closes: string;
}

export interface Artist {
  /** Stable slug used for filtering and future per-artist routes. */
  id: string;
  name: Maybe<string>;
  role: Maybe<string>;
  bio: Maybe<string>;
  styles: Maybe<readonly string[]>;
  instagram: Maybe<string>;
  /** Whether this artist slot is a structural placeholder awaiting client data. */
  placeholder: boolean;
}

export interface PortfolioItem {
  id: string;
  /** Artist id, or TO_CONFIRM while artist roster is unknown. */
  artistId: Maybe<string>;
  style: string;
  placement: string;
  /** Colour treatment — drives the portfolio filter. */
  palette: "blackgrey" | "colour";
  /** Approximate session length, illustrative only. */
  meta: string;
  /** Intrinsic aspect ratio, used to reserve layout space (prevents CLS). */
  ratio: "4:5" | "1:1" | "3:4" | "16:9" | "3:2";
  /** Alt text for the real image once supplied. */
  alt: string;
  year: string;
}

export interface FaqItem {
  q: string;
  a: string;
  /** True when the answer is illustrative demo copy the client must approve. */
  demo?: boolean;
}

export interface ProcessStep {
  n: string;
  title: string;
  body: string;
  meta?: string;
}

export interface StudioProfile {
  slug: string;
  name: string;
  legalNameNote?: string;
  address: SchemaAddress;
  /** Display form, Norwegian convention: "Gate Nr, Postnr Poststed". */
  addressDisplay: string;
  phone: Maybe<string>;
  email: Maybe<string>;
  instagram: Maybe<string>;
  facebook: Maybe<string>;
  hours: Maybe<readonly OpeningHours[]>;
  hoursNote: Maybe<string>;
  googleRating: Maybe<{ value: number; count: number }>;
  schemaType: "TattooParlor";
  areaServed: readonly string[];
}

/* ═══════════════════════════════════════════════════════════════════════════════════
   MARINE MAX — domain types

   Kept alongside the studio types rather than in a per-client module: the factual-
   integrity core above is the shared part, and every client's profile has to be built
   out of the same Maybe<T> so one prune path covers all of them.
   ═══════════════════════════════════════════════════════════════════════════════════ */

export interface PostalAddress {
  street: string;
  postalCode: string;
  locality: string;
  municipality: string;
  country: "NO";
}

/** A service the business may or may not offer. `status` gates whether it is shown at all. */
export interface ServiceEntry {
  id: string;
  slug?: string;
  title: string;
  /**
   * `verified`      — registry-supported. Shown, indexed, may have its own page.
   * `scope-unclear` — the activity exists but its boundary is unknown. Shown, hedged, no page.
   * `to-confirm`    — unknown. NEVER shown as an offering; listed only as an open question.
   */
  status: "verified" | "scope-unclear" | "to-confirm";
  summary: string;
  /** What the customer must supply for us to answer. Renders in the engine plate. */
  needs?: string[];
  /** Explicitly out of scope, so the customer does not waste an enquiry. */
  excludes?: string[];
  source?: string;
}

export interface OpenQuestion {
  field: string;
  why: string;
  /** Cross-reference into research/questions-for-trond.md */
  question: string;
  impact: "høy" | "middels" | "lav";
}

export interface Symptom {
  id: string;
  symptom: string;
  likely: string;
  weNeed: string;
}

export interface ProcessStep {
  n: string;
  title: string;
  body: string;
}

export interface WorkItem {
  id: string;
  /** The photograph brief — what Trond must supply. See content/photo-shot-list.md */
  brief: string;
  ratio: "16:9" | "4:3" | "1:1" | "3:4";
  caption: string;
}

export interface BusinessProfile {
  legalName: string;
  displayName: string;
  descriptor: string;
  place: string;
  orgNumber: string;
  orgForm: string;
  registeredSince: string; // ISO 8601. Displayed as DD-MM-YYYY.
  naceCode: string;
  naceLabel: string;
  address: PostalAddress;
  phoneDisplay: string;
  phoneE164: string;
  email: Maybe<string>;
  openingHours: Maybe<string>;
  areaServed: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════════════════
   THE RSC BOUNDARY

   `TO_CONFIRM` is a Symbol so it cannot be interpolated into copy or serialised into
   JSON-LD — `JSON.stringify` drops symbol values silently. React does not. A registered
   symbol passed as a prop to a "use client" component is serialised into the flight payload
   as `"$Stycho.TO_CONFIRM"`, which then sits in view-source on a page a client is looking at.

   So anything crossing into a client component goes through `forClient` first: unknown
   becomes *absent*, which is what an unknown was always supposed to look like on the wire.
   `scripts/qa.mjs` greps the served HTML for the sentinel and fails the run if it appears.
   ═══════════════════════════════════════════════════════════════════════════════════════ */

/** Every `Maybe<U>` field becomes `U | undefined`; everything else is left alone. */
export type Resolved<T> = {
  [K in keyof T]: ToConfirm extends T[K] ? Exclude<T[K], ToConfirm> | undefined : T[K];
};

function resolveValue(value: unknown): unknown {
  if (value === TO_CONFIRM) return undefined;
  if (Array.isArray(value)) return value.map(resolveValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveValue(v);
    return out;
  }
  return value;
}

/** Resolve a list of records for a client component prop. */
export function forClient<T extends object>(items: readonly T[]): Resolved<T>[] {
  return items.map((item) => resolveValue(item) as Resolved<T>);
}
