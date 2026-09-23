"use client";

import { useId, useState } from "react";
import Icon from "./Icon";
import { isBot, validateInspection, type FieldErrors } from "./validate";
import { track } from "./track";

/**
 * The card that overlaps the hero. Two fields is the whole point — it is the low-friction
 * path for someone who will not scroll to the contact form.
 */
export function InspectionBar() {
  const id = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "done">("idle");

  /**
   * Validate, then confirm. There is no request: on the live build this posts to the
   * client's webhook, but a demo host has nowhere to put a real person's phone number,
   * and collecting one would be worse than not working at all.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      address: String(data.get("address") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    const result = validateInspection(input);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    if (!isBot(input)) track("lead_submit", { form: "inspection" });
    setStatus("done");
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="relative z-10 -mt-[38px]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="card-hairline rounded-2xl bg-white p-6 shadow-[0_18px_40px_-24px_rgba(16,28,46,.35)] sm:p-7">
          {status === "done" ? (
            <div className="flex items-start gap-4">
              <span className="accent-soft grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--cr-accent-ink)]">
                <Icon name="check" className="h-6 w-6" />
              </span>
              <div>
                <h2 id={`${id}-heading`} className="font-cr-display text-xl font-bold tracking-[-0.02em]">
                  Inspection requested
                </h2>
                <p className="mt-1 text-[15px] text-cr-ink/70">
                  We will call to confirm a time, usually within the hour during business hours.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center">
              <div>
                <h2
                  id={`${id}-heading`}
                  className="font-cr-display text-[22px] font-bold leading-tight tracking-[-0.02em]"
                >
                  Book a free roof inspection
                </h2>
                <p className="mt-1.5 flex items-center gap-2 text-[15px] text-cr-ink/60">
                  <Icon name="clock" className="h-4 w-4 text-[var(--cr-accent-ink)]" />
                  Booked in 60 seconds
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Field
                  id={`${id}-address`}
                  name="address"
                  label="Property address"
                  placeholder="Property address"
                  autoComplete="street-address"
                  error={errors.address}
                />
                <Field
                  id={`${id}-phone`}
                  name="phone"
                  label="Phone number"
                  placeholder="Phone number"
                  type="tel"
                  autoComplete="tel"
                  error={errors.phone}
                />

                {/* Honeypot. Off-screen rather than display:none so bots that skip hidden
                    fields still fill it, and out of the tab order for everyone else. */}
                <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor={`${id}-company`}>Company</label>
                  <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  className="accent-button min-h-12 rounded-lg px-7 text-base font-bold transition-colors sm:self-start"
                >
                  Book Now
                </button>

              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  type?: string;
  autoComplete?: string;
};

function Field({ id, name, label, placeholder, error, type = "text", autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-cr-ink placeholder:text-cr-ink/45 ${
          error ? "border-[#b42318]" : "border-cr-hairline"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-[#b42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default InspectionBar;
