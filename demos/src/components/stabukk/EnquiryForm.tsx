"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import {
  EMAIL_RE,
  PALETTE_OPTIONS,
  PHONE_RE,
  PLACEMENT_OPTIONS,
  SIZE_OPTIONS,
  TIMING_OPTIONS,
  captureSource,
  enquiryId,
  formatDateNo,
  saveEnquiryLocally,
  triage,
  type Enquiry,
  type SizeValue,
  type TimingValue,
} from "@/lib/enquiry";
import { stabukkPortfolioStyles } from "@/data/stabukk";

/**
 * Stabukk enquiry — one page, three numbered plates.
 *
 * Deliberately a different interaction model from Eik's branching wizard. Stabukk's
 * customer is a returning client committing to a large piece; they are not nervous and
 * they are not in a hurry. A single scrollable brief they can review in full before
 * sending suits that audience, and it keeps the two sites from sharing a component idiom.
 *
 * Validation uses an error summary at the top (WCAG technique G139) rather than
 * per-step gating.
 */

type Errors = { field: string; label: string; message: string }[];

const STYLE_OPTIONS = stabukkPortfolioStyles.filter((s) => s !== "Alle");

export function EnquiryForm() {
  const [idea, setIdea] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [placement, setPlacement] = useState("");
  const [size, setSize] = useState<SizeValue | "">("");
  const [palette, setPalette] = useState("");
  const [timing, setTiming] = useState<TimingValue | "">("");
  const [referenceNames, setReferenceNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Errors>([]);
  const [attempt, setAttempt] = useState(0);
  const [submitted, setSubmitted] = useState<Enquiry | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Focus moves after the DOM has committed, not inside the submit handler — a rAF
  // scheduled during the same event can run before React has rendered the summary.
  // `attempt` is in the deps so a second failed submit re-announces the same errors.
  useEffect(() => {
    if (attempt > 0 && errors.length > 0) summaryRef.current?.focus();
  }, [attempt, errors]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const liveTriage = useMemo(
    () =>
      triage({
        kind: "tatovering",
        size: size === "" ? undefined : size,
        idea,
        placement,
        styles,
        referenceCount: referenceNames.length,
      }),
    [size, idea, placement, styles, referenceNames.length],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Errors = [];
    if (idea.trim().length < 10)
      found.push({ field: "idea", label: "Arbeidet", message: "Beskriv arbeidet med noen setninger." });
    if (!placement)
      found.push({ field: "placement", label: "Plassering", message: "Velg hvor på kroppen arbeidet skal sitte." });
    if (!size) found.push({ field: "size-xs", label: "Omfang", message: "Velg omtrentlig størrelse." });
    if (!timing) found.push({ field: "timing-asap", label: "Tid", message: "Velg når du ønsker time." });
    if (name.trim().length < 2)
      found.push({ field: "name", label: "Navn", message: "Skriv inn navnet ditt." });
    if (!EMAIL_RE.test(email))
      found.push({ field: "email", label: "E-post", message: "Skriv inn en gyldig e-postadresse." });
    if (!PHONE_RE.test(phone))
      found.push({ field: "phone", label: "Telefon", message: "Skriv inn et gyldig norsk telefonnummer." });
    if (!consent)
      found.push({ field: "consent", label: "Samtykke", message: "Du må godta at vi lagrer opplysningene." });

    setErrors(found);
    setAttempt((a) => a + 1);

    if (found.length > 0) return;

    const enquiry: Enquiry = {
      id: enquiryId(),
      studio: "stabukk",
      kind: "tatovering",
      submittedAt: new Date().toISOString(),
      contact: { name: name.trim(), email: email.trim(), phone: phone.trim(), consent },
      brief: {
        idea: idea.trim(),
        styles,
        placement,
        size: size === "" ? undefined : size,
        palette: palette || undefined,
        timing: (timing || "flexible") as TimingValue,
        referenceCount: referenceNames.length,
        referenceNames,
        notes: notes.trim(),
      },
      source: captureSource(),
      triage: liveTriage,
    };

    saveEnquiryLocally(enquiry);
    setSubmitted(enquiry);
  }

  const errorFor = (field: string) => errors.find((e) => e.field === field)?.message;

  if (submitted) return <SuccessPlate enquiry={submitted} ref={successRef} />;

  return (
    <form className="sbk-form" onSubmit={onSubmit} noValidate>
      {errors.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          style={{
            border: "1px solid var(--reg)",
            padding: "1.1rem 1.25rem",
            background: "rgba(216,69,47,0.08)",
          }}
        >
          <p className="sbk-anno sbk-anno--reg" style={{ marginBottom: "0.6rem" }}>
            {errors.length} felt mangler
          </p>
          <ul style={{ display: "grid", gap: "0.35rem", listStyle: "none", padding: 0 }}>
            {errors.map((err) => (
              <li key={err.field}>
                <a href={`#${err.field}`} style={{ color: "#ff8b78", fontSize: "0.9375rem" }}>
                  {err.label}: {err.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ---- PLATE 01 ---- */}
      <fieldset className="sbk-fieldset">
        <legend>Plate 01 — Arbeidet</legend>

        <div className="sbk-field">
          <label htmlFor="idea">Hva skal lages?</label>
          <p className="sbk-field__hint" id="idea-hint">
            Motiv, uttrykk, hva det skal si. To–tre setninger er nok til at vi kan svare
            ordentlig.
          </p>
          <textarea
            id="idea"
            className="sbk-textarea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            aria-describedby={errorFor("idea") ? "idea-hint idea-err" : "idea-hint"}
            aria-invalid={errorFor("idea") ? true : undefined}
          />
          {errorFor("idea") ? (
            <p className="sbk-error" id="idea-err">
              {errorFor("idea")}
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <span className="sbk-field__label" id="sbk-styles">
            Retning <span style={{ color: "var(--ash)" }}>(valgfritt)</span>
          </span>
          <div className="sbk-choices" role="group" aria-labelledby="sbk-styles">
            {STYLE_OPTIONS.map((style) => (
              <label key={style} className="sbk-choice">
                <input
                  type="checkbox"
                  checked={styles.includes(style)}
                  onChange={() =>
                    setStyles((prev) =>
                      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
                    )
                  }
                />
                <span>{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sbk-field">
          <label htmlFor="placement">Plassering</label>
          <select
            id="placement"
            className="sbk-select"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            aria-invalid={errorFor("placement") ? true : undefined}
            aria-describedby={errorFor("placement") ? "placement-err" : undefined}
          >
            <option value="">Velg plassering</option>
            {PLACEMENT_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errorFor("placement") ? (
            <p className="sbk-error" id="placement-err">
              {errorFor("placement")}
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <span className="sbk-field__label" id="sbk-size">
            Omfang
            <DemoNote id="sbk.09" />
          </span>
          <div className="sbk-choices" role="radiogroup" aria-labelledby="sbk-size">
            {SIZE_OPTIONS.map((option) => (
              <label key={option.value} className="sbk-choice">
                <input
                  id={`size-${option.value}`}
                  type="radio"
                  name="size"
                  value={option.value}
                  checked={size === option.value}
                  onChange={() => setSize(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errorFor("size-xs") ? <p className="sbk-error">{errorFor("size-xs")}</p> : null}
        </div>

        <div className="sbk-field">
          <span className="sbk-field__label" id="sbk-palette">
            Uttrykk
          </span>
          <div className="sbk-choices" role="radiogroup" aria-labelledby="sbk-palette">
            {PALETTE_OPTIONS.map((option) => (
              <label key={option.value} className="sbk-choice">
                <input
                  type="radio"
                  name="palette"
                  value={option.value}
                  checked={palette === option.value}
                  onChange={() => setPalette(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="sbk-rule" />

      {/* ---- PLATE 02 ---- */}
      <fieldset className="sbk-fieldset">
        <legend>Plate 02 — Referanser og tid</legend>

        <div className="sbk-field">
          <label htmlFor="refs">Referansebilder</label>
          <p className="sbk-field__hint" id="refs-hint">
            Bilder du liker, eller bilde av området på kroppen. I denne demoen registreres bare
            filnavnene — ingenting lastes opp.
          </p>
          <input
            id="refs"
            className="sbk-input"
            type="file"
            accept="image/*"
            multiple
            aria-describedby="refs-hint"
            onChange={(e) => setReferenceNames(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
          {referenceNames.length > 0 ? (
            <p className="sbk-anno" style={{ marginTop: "0.35rem" }}>
              {referenceNames.length} fil{referenceNames.length === 1 ? "" : "er"} valgt
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <span className="sbk-field__label" id="sbk-timing">
            Når
          </span>
          <div className="sbk-choices" role="radiogroup" aria-labelledby="sbk-timing">
            {TIMING_OPTIONS.map((option) => (
              <label key={option.value} className="sbk-choice">
                <input
                  id={`timing-${option.value}`}
                  type="radio"
                  name="timing"
                  value={option.value}
                  checked={timing === option.value}
                  onChange={() => setTiming(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errorFor("timing-asap") ? <p className="sbk-error">{errorFor("timing-asap")}</p> : null}
        </div>

        <div className="sbk-field">
          <label htmlFor="notes">Annet vi bør vite</label>
          <p className="sbk-field__hint" id="notes-hint">
            Arr i området, allergier, tidligere arbeid som skal dekkes eller bygges videre på.
          </p>
          <textarea
            id="notes"
            className="sbk-textarea"
            style={{ minHeight: "100px" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-describedby="notes-hint"
          />
        </div>
      </fieldset>

      <div className="sbk-rule" />

      {/* ---- PLATE 03 ---- */}
      <fieldset className="sbk-fieldset">
        <legend>Plate 03 — Kontakt</legend>

        <div className="sbk-field">
          <label htmlFor="name">Navn</label>
          <input
            id="name"
            className="sbk-input"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errorFor("name") ? true : undefined}
            aria-describedby={errorFor("name") ? "name-err" : undefined}
          />
          {errorFor("name") ? (
            <p className="sbk-error" id="name-err">
              {errorFor("name")}
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <label htmlFor="email">E-post</label>
          <input
            id="email"
            className="sbk-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errorFor("email") ? true : undefined}
            aria-describedby={errorFor("email") ? "email-err" : undefined}
          />
          {errorFor("email") ? (
            <p className="sbk-error" id="email-err">
              {errorFor("email")}
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            className="sbk-input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="400 00 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errorFor("phone") ? true : undefined}
            aria-describedby={errorFor("phone") ? "phone-err" : undefined}
          />
          {errorFor("phone") ? (
            <p className="sbk-error" id="phone-err">
              {errorFor("phone")}
            </p>
          ) : null}
        </div>

        <div className="sbk-field">
          <label className="sbk-checkbox" htmlFor="consent">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={errorFor("consent") ? true : undefined}
            />
            <span>
              Jeg godtar at Stabukk Tattoo Studio lagrer opplysningene over for å svare på
              forespørselen min.
            </span>
          </label>
          {errorFor("consent") ? <p className="sbk-error">{errorFor("consent")}</p> : null}
        </div>
      </fieldset>

      <div className="sbk-formnav">
        <button type="submit" className="sbk-btn">
          Send forespørsel →
        </button>
        <p className="sbk-anno">Uforpliktende</p>
      </div>
    </form>
  );
}

const ROUTE_LABEL: Record<string, string> = {
  quote: "Klar for prisforslag",
  consultation: "Bør inn til samtale",
  "needs-info": "Trenger ett oppfølgingsspørsmål",
  piercing: "Piercing",
};

function SuccessPlate({
  enquiry,
  ref,
}: {
  enquiry: Enquiry;
  ref: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="sbk-success sbk-ticks" ref={ref} tabIndex={-1} role="status">
      <p className="sbk-anno sbk-anno--reg">
        Mottatt · {formatDateNo(enquiry.submittedAt)} · Ref {enquiry.id.slice(0, 8).toUpperCase()}
      </p>
      <h2 className="sbk-display sbk-d2" style={{ margin: "1rem 0" }}>
        Takk.
        <br />
        Vi svarer deg.
      </h2>
      <p className="sbk-lead">
        Forespørselen din er komplett nok til at vi kan svare med omfang, antall økter og en
        prisramme — ikke bare «hei, send oss litt mer info».
      </p>

      <p className="sbk-body" style={{ marginTop: "1rem" }}>
        Du får svar på {enquiry.contact.email}.
        <DemoNote id="sbk.10" />
      </p>

      <dl className="sbk-summary">
        <div>
          <dt className="sbk-anno">Plassering</dt>
          <dd>{enquiry.brief.placement}</dd>
        </div>
        {enquiry.brief.size ? (
          <div>
            <dt className="sbk-anno">Omfang</dt>
            <dd>{SIZE_OPTIONS.find((s) => s.value === enquiry.brief.size)?.label}</dd>
          </div>
        ) : null}
        {enquiry.brief.styles.length > 0 ? (
          <div>
            <dt className="sbk-anno">Retning</dt>
            <dd>{enquiry.brief.styles.join(", ")}</dd>
          </div>
        ) : null}
        <div>
          <dt className="sbk-anno">Tid</dt>
          <dd>{TIMING_OPTIONS.find((t) => t.value === enquiry.brief.timing)?.label}</dd>
        </div>
        <div>
          <dt className="sbk-anno">Grunnlag</dt>
          <dd>
            {enquiry.triage.completeness}% komplett · {ROUTE_LABEL[enquiry.triage.route]}
            {enquiry.triage.flags.length > 0 ? ` · ${enquiry.triage.flags.join(", ")}` : ""}
          </dd>
        </div>
      </dl>

      <div className="sbk-formnav" style={{ marginTop: "2rem" }}>
        <Link href="/stabukk/arbeider" className="sbk-btn sbk-btn--line">
          Se arbeider
        </Link>
        <Link href="/stabukk/prosess" className="sbk-btn sbk-btn--line">
          Les om prosessen
        </Link>
      </div>
    </div>
  );
}
