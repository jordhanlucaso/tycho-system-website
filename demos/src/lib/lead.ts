/**
 * The service-lead data model.
 *
 * This is the commercial core of the project. Every competitor's enquiry route ends in a
 * free-text "Melding" box, which means the workshop still has to phone the customer to find
 * out what the job is. The form has saved nobody any time; it has only moved the discovery
 * call later.
 *
 * Here, everything enumerable is an enum. That is what makes routing, filtering, reporting
 * and later CRM integration possible at all — you cannot filter on free text.
 *
 * See .claude/skills/marine-service-lead-flow/SKILL.md
 */

// ── Enumerations ────────────────────────────────────────────────────────────────────────
// Only request types for services we have actually verified. Offering an option for a
// service Marine Max may not perform generates enquiries he has to decline.

export const REQUEST_TYPES = [
  { value: "service", label: "Service på motor", hint: "Planlagt vedlikehold" },
  { value: "reparasjon", label: "Reparasjon", hint: "Noe har sluttet å virke" },
  { value: "feilsoking", label: "Feilsøking", hint: "Vet ikke helt hva som er galt" },
  { value: "annet", label: "Annet", hint: "Beskriv det selv" },
] as const;
export type RequestType = (typeof REQUEST_TYPES)[number]["value"];

export const BOAT_LOCATIONS = [
  { value: "i-sjoen", label: "I sjøen" },
  { value: "pa-land", label: "På land" },
  { value: "pa-henger", label: "På henger" },
  { value: "vet-ikke", label: "Vet ikke ennå" },
] as const;
export type BoatLocationKind = (typeof BOAT_LOCATIONS)[number]["value"];

export const MOUNTINGS = [
  { value: "utenbords", label: "Utenbords" },
  { value: "innenbords", label: "Innenbords" },
  { value: "drev", label: "Drev / sterndrive" },
  { value: "vet-ikke", label: "Vet ikke" },
] as const;
export type Mounting = (typeof MOUNTINGS)[number]["value"];

export const FUELS = [
  { value: "bensin", label: "Bensin" },
  { value: "diesel", label: "Diesel" },
  { value: "vet-ikke", label: "Vet ikke" },
] as const;
export type Fuel = (typeof FUELS)[number]["value"];

/**
 * The single highest-information question in marine diagnosis. It splits electrical, fuel
 * and mechanical faults immediately, and it drives the urgency derivation below.
 */
export const STARTS = [
  { value: "ja", label: "Ja, den starter" },
  { value: "nei", label: "Nei, ingenting skjer" },
  { value: "delvis", label: "Den prøver, men vil ikke gå" },
  { value: "ikke-relevant", label: "Ikke relevant" },
] as const;
export type StartsState = (typeof STARTS)[number]["value"];

export const ONSETS = [
  { value: "i-dag", label: "I dag" },
  { value: "denne-uken", label: "Denne uken" },
  { value: "sesongen", label: "Tidligere i sesongen" },
  { value: "lenge", label: "Har vært slik lenge" },
  { value: "ukjent", label: "Vet ikke" },
] as const;
export type Onset = (typeof ONSETS)[number]["value"];

export const CONTACT_PREFERENCES = [
  { value: "telefon", label: "Telefon" },
  { value: "sms", label: "SMS" },
  { value: "epost", label: "E-post" },
] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number]["value"];

// ── Entities ────────────────────────────────────────────────────────────────────────────
// Nested by real-world entity: a boat outlives an owner, an engine can be replaced.

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  preferredContact: ContactPreference;
  preferredDate?: string; // ISO 8601 in storage; displayed DD-MM-YYYY
}

export interface Boat {
  make?: string;
  model?: string;
  year?: string;
  lengthFeet?: string;
}

export interface Engine {
  make?: string;
  model?: string;
  year?: string;
  mounting: Mounting;
  fuel: Fuel;
  hours?: string;
}

export interface ServiceRequest {
  type: RequestType;
  description: string;
  onset?: Onset;
  starts?: StartsState;
}

export interface BoatLocation {
  kind: BoatLocationKind;
  where?: string;
}

export interface Attachment {
  /** Video is modelled but the UI is photo-only — a large unreliable upload at a marina is
   *  a worse experience than none. The type is ready when the transport is. */
  kind: "photo" | "video";
  name: string;
  size: number;
  mime: string;
}

export interface LeadSource {
  landingPage: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type Urgency = "akutt" | "snarlig" | "planlagt";
export type Route = "ring-kunde-i-dag" | "svar-innen-24t" | "legg-i-ko";

export interface Triage {
  urgency: Urgency;
  /** 0–100: how much of the job is knowable before anyone picks up a phone. */
  completeness: number;
  route: Route;
  flags: string[];
}

export interface ServiceLead {
  id: string;
  submittedAt: string; // ISO 8601 always. Localised dates sort wrong.
  customer: Customer;
  boat: Boat;
  engine?: Engine;
  request: ServiceRequest;
  location: BoatLocation;
  attachments: Attachment[];
  source: LeadSource;
  triage: Triage;
}

// ── Triage ──────────────────────────────────────────────────────────────────────────────

/**
 * Urgency is derived, never asked. Ask a customer how urgent their problem is and every
 * one of them says "very".
 */
export function triage(
  input: Pick<ServiceLead, "request" | "boat" | "engine" | "location" | "customer" | "attachments">,
): Triage {
  const flags: string[] = [];

  const isFault = input.request.type === "reparasjon" || input.request.type === "feilsoking";
  const dead = input.request.starts === "nei" || input.request.starts === "delvis";

  let urgency: Urgency = "planlagt";
  if (isFault && dead) urgency = "akutt";
  else if (isFault) urgency = "snarlig";

  // A boat in the water with a dead engine cannot be moved under its own power.
  if (urgency === "akutt" && input.location.kind === "i-sjoen") {
    flags.push("bat-i-sjoen-uten-motor");
  }

  // Completeness: how much can be answered without a phone call.
  let score = 0;
  const engineIdentified = Boolean(input.engine?.make && input.engine?.model);
  const hasPhoto = input.attachments.some((a) => a.kind === "photo");

  // The engine plate is worth the most — a photo of it answers four fields at once.
  if (engineIdentified) score += 25;
  else if (hasPhoto) score += 20;
  else flags.push("mangler-motoropplysninger");

  if (hasPhoto) score += 15;
  else flags.push("ingen-bilder");

  if (input.request.description.trim().length >= 40) score += 20;
  else flags.push("kort-beskrivelse");

  if (input.location.kind !== "vet-ikke") score += 15;
  if (input.boat.make) score += 10;
  if (input.engine?.mounting && input.engine.mounting !== "vet-ikke") score += 5;
  if (input.engine?.fuel && input.engine.fuel !== "vet-ikke") score += 5;
  if (input.customer.phone) score += 5;

  const completeness = Math.min(100, score);

  const route: Route =
    urgency === "akutt" ? "ring-kunde-i-dag" : urgency === "snarlig" ? "svar-innen-24t" : "legg-i-ko";

  return { urgency, completeness, route, flags };
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  akutt: "Akutt",
  snarlig: "Snarlig",
  planlagt: "Planlagt",
};

export const ROUTE_LABEL: Record<Route, string> = {
  "ring-kunde-i-dag": "Ring kunden i dag",
  "svar-innen-24t": "Svar innen 24 timer",
  "legg-i-ko": "Legg i kø",
};

// ── Helpers ─────────────────────────────────────────────────────────────────────────────

export function leadId(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MM-${stamp}-${rand}`;
}

export function captureSource(): LeadSource {
  if (typeof window === "undefined") {
    return { landingPage: "", referrer: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    landingPage: window.location.pathname,
    referrer: document.referrer || "direkte",
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

/** ISO 8601 in storage, DD-MM-YYYY on screen. */
export function formatDateNo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("-");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Norwegian mobile/landline, optionally with +47 or 0047, spaces tolerated. */
export const PHONE_RE = /^(?:(?:\+|00)47)?[\s]?(?:\d[\s]?){8}$/;
