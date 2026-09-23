"use client";

import { useId, useRef, useState } from "react";
import { EMPTY, validate, type EstimateFields, type Errors } from "./validate";

/**
 * The estimate request — DEMO MODE.
 *
 * Nothing is transmitted. There is no fetch, no action, no endpoint and no storage: the
 * submit handler validates, then swaps the form for a confirmation. This is a speculative
 * site for a business that has not hired us, so a real homeowner's phone number and home
 * address must not be captured by it, and there is nowhere legitimate to send one anyway.
 *
 * It still has to behave like a real form, because the point of the demo is that the owner
 * can picture a customer using it. So validation is real, focus moves to the first error,
 * and the confirmation states plainly that this was a demonstration rather than pretending
 * a lead was filed.
 *
 * Wiring it up later is one function: replace `handleSubmit`'s success branch with a POST.
 */
export default function EstimateForm({ topics }: { topics: string[] }) {
  const [fields, setFields] = useState<EstimateFields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const set = (key: keyof EstimateFields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    // Clear an error the moment the visitor starts fixing it, not on the next submit.
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);

    const firstError = Object.keys(found)[0];
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    // DEMO MODE: this is where a POST would go. Deliberately absent.
    setSent(true);
  }

  if (sent) {
    return (
      <div
        className="border-2 border-hr-brass bg-white p-8 sm:p-10"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-12 w-12 items-center justify-center bg-hr-brass-solid text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 font-hr-display text-[1.3rem] font-bold text-hr-ink">
          Thanks — this is a demonstration of the estimate request experience.
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-hr-ink-soft">
          Nothing was sent and nothing was stored. On the live site this is the point where
          the request reaches Heritage Roofing, with the details below already filled in.
        </p>
        <button
          type="button"
          onClick={() => {
            setFields(EMPTY);
            setSent(false);
          }}
          className="mt-6 inline-flex min-h-[48px] items-center border-2 border-hr-ink px-5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-hr-ink transition-colors hover:bg-hr-ink hover:text-white"
        >
          Try it again
        </button>
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full min-h-[50px] border border-hr-hairline bg-white px-3.5 text-[0.97rem] text-hr-ink placeholder:text-hr-ink-soft/55";
  const label = "block text-[0.78rem] font-bold uppercase tracking-[0.1em] text-hr-ink-soft";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${uid}-name`}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            className={field}
            value={fields.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            autoComplete="name"
          />
          {errors.name ? (
            <p id={`${uid}-name-err`} className="mt-1.5 text-[0.84rem] text-hr-brass-ink">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className={label} htmlFor={`${uid}-phone`}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            className={field}
            value={fields.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            autoComplete="tel"
          />
          {errors.phone ? (
            <p id={`${uid}-phone-err`} className="mt-1.5 text-[0.84rem] text-hr-brass-ink">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label className={label} htmlFor={`${uid}-email`}>
            Email <span className="font-medium normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            className={field}
            value={fields.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            autoComplete="email"
          />
          {errors.email ? (
            <p id={`${uid}-email-err`} className="mt-1.5 text-[0.84rem] text-hr-brass-ink">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className={label} htmlFor={`${uid}-address`}>
            Property address
          </label>
          <input
            id={`${uid}-address`}
            name="address"
            className={field}
            value={fields.address}
            onChange={(e) => set("address")(e.target.value)}
            autoComplete="street-address"
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor={`${uid}-topic`}>
          What do you need help with?
        </label>
        <select
          id={`${uid}-topic`}
          name="topic"
          className={field}
          value={fields.topic}
          onChange={(e) => set("topic")(e.target.value)}
        >
          <option value="">Choose one — or leave it if you are not sure</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor={`${uid}-message`}>
          What&rsquo;s happening?
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          className={`${field} py-3`}
          value={fields.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="When it started, where you see water, anything you have noticed."
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[56px] items-center justify-center bg-hr-brass-solid px-7 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-hr-brass-hover"
      >
        Request My Estimate
      </button>

      <p className="text-[0.82rem] leading-relaxed text-hr-ink-soft">
        This form is part of a website concept and is not connected to Heritage Roofing.
        Nothing you type is sent or stored.
      </p>
    </form>
  );
}
