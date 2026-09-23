/**
 * Form validation for the Calloway Roofing demo.
 *
 * The standalone template validates with Zod, shared between the browser and its
 * `/api/lead` route. This host has neither: it is static, and a sales demo has no CRM
 * behind it. So the rules are hand-written here and applied in the browser only, and the
 * forms confirm locally instead of posting anywhere.
 *
 * The rules are kept identical to the template's schema on purpose — a demo that accepts
 * input the real build would reject is a demo that lies about the build.
 */

export type FieldErrors = Record<string, string>;

export type Result<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

export type JobType =
  | "replacement"
  | "repair"
  | "storm"
  | "metal"
  | "gutters"
  | "inspection";

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "replacement", label: "Roof replacement" },
  { value: "repair", label: "Roof repair or leak" },
  { value: "storm", label: "Storm or hail damage" },
  { value: "metal", label: "Metal roofing" },
  { value: "gutters", label: "Gutters and drainage" },
  { value: "inspection", label: "Inspection or maintenance" },
];

const JOB_VALUES = new Set(JOB_TYPES.map((j) => j.value));

function phoneError(value: string): string | null {
  if (value.length < 7) return "Enter a phone number we can reach you on";
  if (value.length > 32) return "That does not look like a phone number";
  if (!/^[0-9+()\-.\s]+$/.test(value)) return "Digits, spaces and + ( ) - only";
  return null;
}

export type InspectionLead = { address: string; phone: string };

export function validateInspection(input: Record<string, string>): Result<InspectionLead> {
  const address = input.address.trim();
  const phone = input.phone.trim();
  const errors: FieldErrors = {};

  if (address.length < 5) errors.address = "Enter the property address";
  else if (address.length > 160) errors.address = "Address is too long";

  const p = phoneError(phone);
  if (p) errors.phone = p;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { address, phone } };
}

export type EstimateLead = {
  name: string;
  phone: string;
  address: string;
  jobType: JobType;
  message: string;
};

export function validateEstimate(input: Record<string, string>): Result<EstimateLead> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();
  const jobType = input.jobType.trim();
  const message = input.message.trim();
  const errors: FieldErrors = {};

  if (name.length < 2) errors.name = "Enter your name";
  else if (name.length > 80) errors.name = "That name is too long";

  const p = phoneError(phone);
  if (p) errors.phone = p;

  if (address.length < 5) errors.address = "Enter the property address";
  else if (address.length > 160) errors.address = "Address is too long";

  if (!JOB_VALUES.has(jobType as JobType)) errors.jobType = "Choose the closest job type";

  if (message.length > 1200) errors.message = "Keep it under 1200 characters";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, phone, address, jobType: jobType as JobType, message } };
}

/**
 * Honeypot. Real people never see the field, so anything in it is a bot. The template's
 * route returns a normal success and drops the lead; here there is nothing to drop, so the
 * form simply shows the same confirmation it shows anyone else.
 */
export function isBot(input: Record<string, string>): boolean {
  return (input.company ?? "").trim() !== "";
}
