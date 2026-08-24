/**
 * Enquiry data model — the actual product behind both demos.
 *
 * The form on these sites writes to `localStorage` and nothing else, because they are
 * sales prototypes. The *shape* below is the part that matters: it is designed so that
 * Phase 2 can post the identical payload to a CRM, a transactional email, a calendar
 * hold and a classifier without any change to the form components.
 *
 * Design decisions worth defending in the meeting:
 *  - `kind` branches the whole form. A piercing enquiry never sees a tattoo field.
 *  - Sizes, budgets and placements are **enumerated**, not free text. Free text cannot be
 *    routed, filtered, priced or reported on; enums can. This is the difference between
 *    a contact form and a lead system.
 *  - `triage` is computed client-side from answers the customer already gave — no extra
 *    questions, no extra friction — and is what lets Phase 2 route automatically.
 *  - `source`/`utm` are captured so the studio can finally tell whether Instagram or
 *    Google actually produces bookings.
 */

export type EnquiryKind = "tatovering" | "piercing";

export const SIZE_OPTIONS = [
  { value: "xs", label: "Under 5 cm", hint: "Liten, ofte én time" },
  { value: "s", label: "5–10 cm", hint: "1–2 timer" },
  { value: "m", label: "10–20 cm", hint: "2–4 timer" },
  { value: "l", label: "20–30 cm", hint: "Ofte flere økter" },
  { value: "xl", label: "Over 30 cm", hint: "Flere økter" },
  { value: "unsure", label: "Vet ikke ennå", hint: "Helt greit — vi hjelper deg" },
] as const;

export const PLACEMENT_OPTIONS = [
  "Underarm", "Overarm", "Skulder", "Rygg", "Bryst", "Legg",
  "Lår", "Håndledd", "Nakke", "Ribbein", "Hånd/finger", "Annet",
] as const;

export const PALETTE_OPTIONS = [
  { value: "blackgrey", label: "Svart og grått" },
  { value: "colour", label: "Farger" },
  { value: "unsure", label: "Usikker" },
] as const;

export const TATTOO_STYLE_OPTIONS = [
  "Fineline", "Botanisk", "Blackwork", "Ornamental",
  "Illustrativ", "Realisme", "Farge", "Cover-up", "Vet ikke",
] as const;

export const PIERCING_OPTIONS = [
  "Øreflipp", "Helix", "Conch", "Tragus", "Nese",
  "Septum", "Navle", "Øyenbryn", "Annet",
] as const;

export const TIMING_OPTIONS = [
  { value: "asap", label: "Så snart som mulig" },
  { value: "1m", label: "Innen en måned" },
  { value: "3m", label: "I løpet av 2–3 måneder" },
  { value: "flexible", label: "Jeg har god tid" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "first", label: "Dette blir min første" },
  { value: "few", label: "Jeg har noen fra før" },
  { value: "many", label: "Jeg har mange" },
] as const;

export type SizeValue = (typeof SIZE_OPTIONS)[number]["value"];
export type TimingValue = (typeof TIMING_OPTIONS)[number]["value"];
export type ExperienceValue = (typeof EXPERIENCE_OPTIONS)[number]["value"];

export interface Enquiry {
  /** Client-generated id; becomes the CRM external id in Phase 2. */
  id: string;
  studio: "eik" | "stabukk";
  kind: EnquiryKind;
  submittedAt: string; // ISO 8601 — always stored ISO, always displayed DD-MM-YYYY
  contact: {
    name: string;
    email: string;
    phone: string;
    consent: boolean;
  };
  brief: {
    idea: string;
    styles: string[];
    placement: string;
    size?: SizeValue;
    palette?: string;
    piercingType?: string;
    preferredArtist?: string;
    timing: TimingValue;
    experience?: ExperienceValue;
    referenceCount: number;
    referenceNames: string[];
    notes: string;
  };
  source: {
    referrer: string;
    utm: Record<string, string>;
    path: string;
  };
  triage: Triage;
}

export interface Triage {
  /** Rough session-count band, derived from size. Not a price. */
  scope: "single-session" | "multi-session" | "unknown";
  /** How complete the brief is. Drives whether a human needs to ask follow-ups at all. */
  completeness: number; // 0–100
  /** Routing hint for Phase 2 automation. */
  route: "piercing" | "consultation" | "quote" | "needs-info";
  flags: string[];
}

const SINGLE_SESSION: SizeValue[] = ["xs", "s", "m"];

export function triage(input: {
  kind: EnquiryKind;
  size?: SizeValue;
  idea: string;
  placement: string;
  styles: string[];
  referenceCount: number;
  experience?: ExperienceValue;
}): Triage {
  const flags: string[] = [];

  const scope: Triage["scope"] =
    input.kind === "piercing"
      ? "single-session"
      : input.size == null || input.size === "unsure"
        ? "unknown"
        : SINGLE_SESSION.includes(input.size)
          ? "single-session"
          : "multi-session";

  // Completeness is the number the studio should actually care about: how much of the
  // back-and-forth the form already removed.
  let completeness = 0;
  if (input.idea.trim().length >= 40) completeness += 30;
  else if (input.idea.trim().length >= 15) completeness += 15;
  if (input.placement) completeness += 20;
  if (input.kind === "piercing" || (input.size && input.size !== "unsure")) completeness += 20;
  if (input.styles.length > 0 && !input.styles.includes("Vet ikke")) completeness += 15;
  if (input.referenceCount > 0) completeness += 15;
  completeness = Math.min(100, completeness);

  if (input.experience === "first") flags.push("første tatovering");
  if (input.styles.includes("Cover-up")) flags.push("cover-up — trenger bilde");
  if (["Hånd/finger", "Nakke", "Ribbein"].includes(input.placement)) {
    flags.push("krevende plassering");
  }
  if (scope === "multi-session") flags.push("flere økter");

  const route: Triage["route"] =
    input.kind === "piercing"
      ? "piercing"
      : completeness < 45
        ? "needs-info"
        : scope === "multi-session"
          ? "consultation"
          : "quote";

  return { scope, completeness, route, flags };
}

/** Stable id without pulling in a uuid dependency. */
export function enquiryId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `enq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Reads UTM parameters so the studio can attribute enquiries to a channel. */
export function captureSource(): Enquiry["source"] {
  if (typeof window === "undefined") {
    return { referrer: "", utm: {}, path: "" };
  }
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_")) utm[key] = value;
  }
  return {
    referrer: document.referrer,
    utm,
    path: window.location.pathname,
  };
}

/**
 * Demo persistence. In Phase 1 this is a POST to a Next route handler that writes to the
 * studio's inbox; in Phase 2 the same payload fans out to CRM, email and calendar.
 */
export function saveEnquiryLocally(enquiry: Enquiry): void {
  if (typeof window === "undefined") return;
  try {
    const key = `tycho.enquiries.${enquiry.studio}`;
    const existing = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Enquiry[];
    window.localStorage.setItem(key, JSON.stringify([enquiry, ...existing].slice(0, 25)));
  } catch {
    // Private-mode / quota failures must never break the success state the customer sees.
  }
}

/** DD-MM-YYYY for display; storage stays ISO 8601. */
export function formatDateNo(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Norwegian mobile: 8 digits, optional +47 / 0047 prefix, spaces tolerated. */
export const PHONE_RE = /^(?:(?:\+|00)47)?[\s]?(?:\d[\s]?){8}$/;
