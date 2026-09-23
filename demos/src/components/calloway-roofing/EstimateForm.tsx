"use client";

import { useId, useState } from "react";
import Icon from "./Icon";
import { JOB_TYPES, isBot, validateEstimate, type FieldErrors } from "./validate";
import { track } from "./track";

type EstimateFormProps = {
  /** Shown in the success state so the caller knows who has their details. */
  businessName: string;
};

export function EstimateForm({ businessName }: EstimateFormProps) {
  const id = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "done">("idle");

  /** Validates and confirms locally — see the note in ./validate.ts. */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      address: String(data.get("address") ?? ""),
      jobType: String(data.get("jobType") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    const result = validateEstimate(input);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    if (!isBot(input)) track("lead_submit", { form: "estimate", jobType: result.value.jobType });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center">
        <span className="accent-soft-strong mx-auto grid h-14 w-14 place-items-center rounded-full text-[var(--cr-accent-on-dark)]">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-cr-display text-2xl font-bold tracking-[-0.02em] text-white">
          Request received
        </h3>
        <p className="mx-auto mt-3 max-w-[380px] text-[15px] leading-relaxed text-white/70">
          {businessName} will call you back with a written estimate within one business day. If it
          is an emergency, call us now rather than waiting.
        </p>
      </div>
    );
  }

  const labelClass = "mb-1.5 block text-[14px] font-semibold text-white/80";
  const controlClass =
    "min-h-12 w-full rounded-lg border bg-white/[0.07] px-4 text-[15px] text-white placeholder:text-white/40";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            Your name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            placeholder="Jane Whitfield"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={`${controlClass} ${errors.name ? "border-[#ff9c94]" : "border-white/20"}`}
          />
          <FieldError id={`${id}-name-error`} message={errors.name} />
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(704) 555-0123"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={`${controlClass} ${errors.phone ? "border-[#ff9c94]" : "border-white/20"}`}
          />
          <FieldError id={`${id}-phone-error`} message={errors.phone} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-address`} className={labelClass}>
            Property address
          </label>
          <input
            id={`${id}-address`}
            name="address"
            autoComplete="street-address"
            placeholder="Street, suburb"
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? `${id}-address-error` : undefined}
            className={`${controlClass} ${errors.address ? "border-[#ff9c94]" : "border-white/20"}`}
          />
          <FieldError id={`${id}-address-error`} message={errors.address} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-jobType`} className={labelClass}>
            What do you need?
          </label>
          <select
            id={`${id}-jobType`}
            name="jobType"
            defaultValue=""
            aria-invalid={errors.jobType ? true : undefined}
            aria-describedby={errors.jobType ? `${id}-jobType-error` : undefined}
            className={`${controlClass} ${errors.jobType ? "border-[#ff9c94]" : "border-white/20"}`}
          >
            <option value="" disabled>
              Choose a job type
            </option>
            {JOB_TYPES.map((job) => (
              <option key={job.value} value={job.value} className="text-cr-ink">
                {job.label}
              </option>
            ))}
          </select>
          <FieldError id={`${id}-jobType-error`} message={errors.jobType} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={labelClass}>
            Anything we should know? <span className="font-normal text-white/65">(optional)</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            placeholder="Age of the roof, where it leaks, whether a claim is open…"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={`w-full rounded-lg border bg-white/[0.07] px-4 py-3 text-[15px] leading-relaxed text-white placeholder:text-white/40 ${
              errors.message ? "border-[#ff9c94]" : "border-white/20"
            }`}
          />
          <FieldError id={`${id}-message-error`} message={errors.message} />
        </div>
      </div>

      {/* Honeypot: off-screen, out of the tab order, never focusable by a person. */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        className="accent-button mt-6 min-h-13 w-full rounded-lg text-base font-bold transition-colors"
      >
        Request My Free Estimate
      </button>

      <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-white/55">
        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cr-accent-on-dark)]" />
        No obligation, no door-knocking, no sharing your details. We call once, and only about
        your roof.
      </p>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] font-semibold text-[#ff9c94]">
      {message}
    </p>
  );
}

export default EstimateForm;
