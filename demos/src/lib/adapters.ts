/**
 * Integration seams for Phase 2.
 *
 * Interfaces only — no implementations that require credentials, no dependencies, no
 * network calls. A speculative sales demo must be runnable by anyone who clones it, and
 * nothing here should ever be a reason to put a secret in this repo.
 *
 * The point of this file is the architectural claim it makes: the expensive part of adding
 * a CRM, an SMS notifier or a reminder scheduler is not the integration — it is the data
 * model, and the data model is already built and already collecting the right fields
 * (src/lib/lead.ts). Phase 2 binds a different implementation of `LeadSink` and touches no
 * UI code at all.
 *
 * See research/automation-opportunities.md §7.
 */

import type { ServiceLead, Urgency } from "./lead";

export interface DeliveryResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/** Where a submitted enquiry goes. The form depends on this and nothing else. */
export interface LeadSink {
  readonly name: string;
  deliver(lead: ServiceLead): Promise<DeliveryResult>;
}

export interface NotificationMessage {
  to: string;
  /** Deliberately short. The workshop owner has oily hands and a phone in a pocket —
   *  he needs enough to decide whether to interrupt the job, not the whole form. */
  summary: string;
  urgency: Urgency;
  link?: string;
}

export interface Notifier {
  readonly name: string;
  notify(message: NotificationMessage): Promise<DeliveryResult>;
}

export interface ScheduledTask {
  kind: "service-reminder" | "review-request" | "follow-up" | "seasonal";
  /** ISO 8601. Always. */
  dueAt: string;
  leadId: string;
  payload: Record<string, string>;
}

export interface Scheduler {
  readonly name: string;
  schedule(task: ScheduledTask): Promise<DeliveryResult>;
}

// ── The only implementation shipped ─────────────────────────────────────────────────────

const STORAGE_KEY = "marinemax.leads";

/**
 * Demo sink. Writes to localStorage and nowhere else.
 *
 * Deliberate: the demo can be shown to Trond without provisioning anything, and no personal
 * data leaves the browser during a sales meeting.
 */
export const localStorageSink: LeadSink = {
  name: "localStorage (demo)",
  async deliver(lead) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const existing: ServiceLead[] = raw ? JSON.parse(raw) : [];
      existing.unshift(lead);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      return { ok: true, id: lead.id };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Ukjent feil" };
    }
  },
};

/**
 * The SMS Trond would receive in Phase 2. Rendered in the demo layer so the value is
 * visible during the sales conversation rather than merely described.
 */
export function notificationSummary(lead: ServiceLead): string {
  const engine = [lead.engine?.make, lead.engine?.model].filter(Boolean).join(" ");
  const photos = lead.attachments.length;
  return [
    lead.triage.urgency.toUpperCase(),
    "—",
    engine || "motor ikke oppgitt",
    lead.request.starts === "nei" ? "starter ikke." : "",
    `Båt ${labelFor(lead.location.kind)}.`,
    photos ? `${photos} bilde${photos === 1 ? "" : "r"}.` : "Ingen bilder.",
    `${lead.customer.name}, ${lead.customer.phone}.`,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");
}

function labelFor(kind: string): string {
  switch (kind) {
    case "i-sjoen":
      return "i sjøen";
    case "pa-land":
      return "på land";
    case "pa-henger":
      return "på henger";
    default:
      return "ukjent sted";
  }
}
