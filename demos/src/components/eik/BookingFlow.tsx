"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import {
  EMAIL_RE,
  EXPERIENCE_OPTIONS,
  PALETTE_OPTIONS,
  PHONE_RE,
  PIERCING_OPTIONS,
  PLACEMENT_OPTIONS,
  SIZE_OPTIONS,
  TATTOO_STYLE_OPTIONS,
  TIMING_OPTIONS,
  captureSource,
  enquiryId,
  formatDateNo,
  saveEnquiryLocally,
  triage,
  type Enquiry,
  type EnquiryKind,
  type ExperienceValue,
  type SizeValue,
  type TimingValue,
} from "@/lib/enquiry";

/**
 * Eik consultation flow.
 *
 * The commercial argument, in one component: the studio currently learns *who* is asking
 * from Instagram DMs, and then spends six to ten messages learning *what* they want. This
 * form collects the brief up front, in enumerated fields that a CRM can route on, and
 * branches on the first answer so nobody ever sees an irrelevant question.
 *
 * Everything is local — no network call. The payload shape is the deliverable.
 */

type Errors = Record<string, string>;

const TATTOO_STEPS = ["Hva gjelder det?", "Om tatoveringen", "Referanser og tid", "Kontakt"] as const;
const PIERCING_STEPS = ["Hva gjelder det?", "Om piercingen", "Kontakt"] as const;

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<EnquiryKind | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Enquiry | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // brief
  const [idea, setIdea] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [placement, setPlacement] = useState("");
  const [size, setSize] = useState<SizeValue | "">("");
  const [palette, setPalette] = useState("");
  const [piercingType, setPiercingType] = useState("");
  const [preferredArtist, setPreferredArtist] = useState("");
  const [timing, setTiming] = useState<TimingValue | "">("");
  const [experience, setExperience] = useState<ExperienceValue | "">("");
  const [referenceNames, setReferenceNames] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const stepLabels = kind === "piercing" ? PIERCING_STEPS : TATTOO_STEPS;
  const lastStep = stepLabels.length - 1;

  const liveTriage = useMemo(
    () =>
      triage({
        kind: kind ?? "tatovering",
        size: size === "" ? undefined : size,
        idea,
        placement,
        styles,
        referenceCount: referenceNames.length,
        experience: experience === "" ? undefined : experience,
      }),
    [kind, size, idea, placement, styles, referenceNames.length, experience],
  );

  // Move focus to the new step heading so screen-reader and keyboard users are not
  // silently teleported to a different set of fields. Runs after commit — a rAF scheduled
  // inside the click handler can fire before React has rendered the new step.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (submitted) headingRef.current?.focus();
  }, [submitted]);

  function validate(current: number): Errors {
    const next: Errors = {};
    if (current === 0 && !kind) next.kind = "Velg tatovering eller piercing.";

    if (kind === "tatovering") {
      if (current === 1) {
        if (idea.trim().length < 10) next.idea = "Skriv noen ord om hva du ser for deg.";
        if (!placement) next.placement = "Velg hvor på kroppen den skal sitte.";
        if (!size) next.size = "Velg omtrentlig størrelse.";
      }
      if (current === 2 && !timing) next.timing = "Velg når du ønsker time.";
    }

    if (kind === "piercing") {
      if (current === 1) {
        if (!piercingType) next.piercingType = "Velg hvilken piercing det gjelder.";
        if (!timing) next.timing = "Velg når du ønsker time.";
      }
    }

    if (current === lastStep) {
      if (name.trim().length < 2) next.name = "Skriv inn navnet ditt.";
      if (!EMAIL_RE.test(email)) next.email = "Skriv inn en gyldig e-postadresse.";
      if (!PHONE_RE.test(phone)) next.phone = "Skriv inn et gyldig norsk telefonnummer (8 siffer).";
      if (!consent) next.consent = "Du må godta at vi lagrer opplysningene for å svare deg.";
    }
    return next;
  }

  function goNext() {
    const found = validate(step);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStep((s) => Math.min(s + 1, lastStep));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(lastStep);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const enquiry: Enquiry = {
      id: enquiryId(),
      studio: "eik",
      kind: kind ?? "tatovering",
      submittedAt: new Date().toISOString(),
      contact: { name: name.trim(), email: email.trim(), phone: phone.trim(), consent },
      brief: {
        idea: idea.trim(),
        styles,
        placement,
        size: size === "" ? undefined : size,
        palette: palette || undefined,
        piercingType: piercingType || undefined,
        preferredArtist: preferredArtist || undefined,
        timing: (timing || "flexible") as TimingValue,
        experience: experience === "" ? undefined : experience,
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

  if (submitted) return <SuccessState enquiry={submitted} headingRef={headingRef} />;

  const progress = ((step + 1) / stepLabels.length) * 100;

  return (
    <form className="eik-form" onSubmit={onSubmit} noValidate>
      <div>
        <div className="eik-progress">
          <span className="eik-meta">
            Steg {step + 1} av {stepLabels.length}
          </span>
          <span className="eik-progress__track">
            <span className="eik-progress__fill" style={{ width: `${progress}%` }} />
          </span>
        </div>
        <h2 className="eik-display eik-h2" tabIndex={-1} ref={headingRef}>
          {stepLabels[step]}
        </h2>
      </div>

      {/* ---------------- Step 0 — branch ---------------- */}
      {step === 0 ? (
        <fieldset className="eik-fieldset">
          <legend>01 — Type henvendelse</legend>
          <p className="eik-body">
            Vi stiller ulike spørsmål avhengig av hva du skal ha, så du slipper å svare på noe
            som ikke gjelder deg.
            <DemoNote id="eik.14" />
          </p>

          <div className="eik-cards-choice">
            {(
              [
                { value: "tatovering", title: "Tatovering", hint: "Nytt motiv, påbygg eller cover-up" },
                { value: "piercing", title: "Piercing", hint: "Ny piercing eller bytte av smykke" },
              ] as const
            ).map((option) => (
              <label key={option.value} className="eik-choice-card">
                <input
                  type="radio"
                  name="kind"
                  value={option.value}
                  checked={kind === option.value}
                  onChange={() => {
                    setKind(option.value);
                    setErrors({});
                  }}
                />
                <span>
                  <b>{option.title}</b>
                  <i>{option.hint}</i>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="kind" message={errors.kind} />
        </fieldset>
      ) : null}

      {/* ---------------- Tattoo step 1 ---------------- */}
      {kind === "tatovering" && step === 1 ? (
        <>
          <fieldset className="eik-fieldset">
            <legend>02 — Idéen</legend>
            <div className="eik-field">
              <label htmlFor="idea">Hva ser du for deg?</label>
              <p className="eik-field__hint" id="idea-hint">
                Motiv, stemning, hva det betyr for deg. To–tre setninger holder.
              </p>
              <textarea
                id="idea"
                className="eik-textarea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                aria-describedby={errors.idea ? "idea-hint idea-error" : "idea-hint"}
                aria-invalid={errors.idea ? true : undefined}
                placeholder="F.eks. en liten botanisk gren på innsiden av underarmen, tynne linjer, ikke for mørk."
              />
              <FieldError id="idea" message={errors.idea} />
            </div>

            <div className="eik-field">
              <span id="styles-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Stilart <span style={{ fontWeight: 400, color: "var(--steel)" }}>(valgfritt, flere mulig)</span>
              </span>
              <div className="eik-choices" role="group" aria-labelledby="styles-label">
                {TATTOO_STYLE_OPTIONS.map((style) => (
                  <label key={style} className="eik-choice">
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
          </fieldset>

          <fieldset className="eik-fieldset">
            <legend>03 — Plassering og omfang</legend>
            <div className="eik-field">
              <label htmlFor="placement">Hvor på kroppen?</label>
              <select
                id="placement"
                className="eik-select"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                aria-invalid={errors.placement ? true : undefined}
                aria-describedby={errors.placement ? "placement-error" : undefined}
              >
                <option value="">Velg plassering</option>
                {PLACEMENT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <FieldError id="placement" message={errors.placement} />
            </div>

            <div className="eik-field">
              <span id="size-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Omtrentlig størrelse
                <DemoNote id="eik.15" />
              </span>
              <div className="eik-cards-choice" role="radiogroup" aria-labelledby="size-label">
                {SIZE_OPTIONS.map((option) => (
                  <label key={option.value} className="eik-choice-card">
                    <input
                      type="radio"
                      name="size"
                      value={option.value}
                      checked={size === option.value}
                      onChange={() => setSize(option.value)}
                    />
                    <span>
                      <b>{option.label}</b>
                      <i>{option.hint}</i>
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id="size" message={errors.size} />
            </div>

            <div className="eik-field">
              <span id="palette-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Svart-hvitt eller farger?
              </span>
              <div className="eik-choices" role="radiogroup" aria-labelledby="palette-label">
                {PALETTE_OPTIONS.map((option) => (
                  <label key={option.value} className="eik-choice">
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
        </>
      ) : null}

      {/* ---------------- Tattoo step 2 ---------------- */}
      {kind === "tatovering" && step === 2 ? (
        <>
          <fieldset className="eik-fieldset">
            <legend>04 — Referanser</legend>
            <div className="eik-field">
              <label htmlFor="refs">Referansebilder</label>
              <p className="eik-field__hint" id="refs-hint">
                Bilder du liker, eller bilde av stedet på kroppen. I denne demoen registreres
                bare filnavnene — ingenting lastes opp.
              </p>
              <input
                id="refs"
                className="eik-input"
                type="file"
                accept="image/*"
                multiple
                aria-describedby="refs-hint"
                onChange={(e) =>
                  setReferenceNames(Array.from(e.target.files ?? []).map((f) => f.name))
                }
              />
              {referenceNames.length > 0 ? (
                <p className="eik-meta" style={{ marginTop: "0.35rem" }}>
                  {referenceNames.length} fil{referenceNames.length === 1 ? "" : "er"} valgt
                </p>
              ) : null}
              <DemoNote id="eik.16" />
            </div>

            <div className="eik-field">
              <label htmlFor="artist">Ønsket tatovør</label>
              <select
                id="artist"
                className="eik-select"
                value={preferredArtist}
                onChange={(e) => setPreferredArtist(e.target.value)}
              >
                <option value="">Ingen preferanse — foreslå gjerne</option>
                <option value="to-confirm">Tatovørliste fylles inn av studioet</option>
              </select>
              <p className="eik-field__hint">
                Feltet er klart. Navnene legges inn når vi får dem fra Eik.
              </p>
            </div>
          </fieldset>

          <fieldset className="eik-fieldset">
            <legend>05 — Tid</legend>
            <div className="eik-field">
              <span id="timing-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Når ønsker du time?
              </span>
              <div className="eik-choices" role="radiogroup" aria-labelledby="timing-label">
                {TIMING_OPTIONS.map((option) => (
                  <label key={option.value} className="eik-choice">
                    <input
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
              <FieldError id="timing" message={errors.timing} />
            </div>

            <div className="eik-field">
              <span id="exp-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Har du tatoveringer fra før? <span style={{ fontWeight: 400, color: "var(--steel)" }}>(valgfritt)</span>
              </span>
              <div className="eik-choices" role="radiogroup" aria-labelledby="exp-label">
                {EXPERIENCE_OPTIONS.map((option) => (
                  <label key={option.value} className="eik-choice">
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      checked={experience === option.value}
                      onChange={() => setExperience(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="eik-field">
              <label htmlFor="notes">Noe mer vi bør vite?</label>
              <p className="eik-field__hint" id="notes-hint">
                Allergier, medisiner, arr i området, eller om du gruer deg. Alt hjelper.
              </p>
              <textarea
                id="notes"
                className="eik-textarea"
                style={{ minHeight: "96px" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                aria-describedby="notes-hint"
              />
            </div>
          </fieldset>
        </>
      ) : null}

      {/* ---------------- Piercing step 1 ---------------- */}
      {kind === "piercing" && step === 1 ? (
        <fieldset className="eik-fieldset">
          <legend>02 — Piercingen</legend>
          <div className="eik-field">
            <label htmlFor="piercing">Hvilken piercing?</label>
            <select
              id="piercing"
              className="eik-select"
              value={piercingType}
              onChange={(e) => setPiercingType(e.target.value)}
              aria-invalid={errors.piercingType ? true : undefined}
              aria-describedby={errors.piercingType ? "piercingType-error" : undefined}
            >
              <option value="">Velg piercing</option>
              {PIERCING_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <FieldError id="piercingType" message={errors.piercingType} />
          </div>

          <div className="eik-field">
            <span id="ptiming-label" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Når ønsker du time?
            </span>
            <div className="eik-choices" role="radiogroup" aria-labelledby="ptiming-label">
              {TIMING_OPTIONS.map((option) => (
                <label key={option.value} className="eik-choice">
                  <input
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
            <FieldError id="timing" message={errors.timing} />
          </div>

          <div className="eik-field">
            <label htmlFor="pnotes">Noe vi bør vite?</label>
            <p className="eik-field__hint" id="pnotes-hint">
              Allergier, tidligere piercinger som ikke grodde, eller ønsker om smykke.
            </p>
            <textarea
              id="pnotes"
              className="eik-textarea"
              style={{ minHeight: "96px" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-describedby="pnotes-hint"
            />
          </div>
          <p className="eik-body" style={{ fontSize: "0.875rem" }}>
            Er du under 18 år, må du ha med foresatt. Nøyaktige aldersregler bekreftes av
            studioet.
          </p>
        </fieldset>
      ) : null}

      {/* ---------------- Contact step ---------------- */}
      {step === lastStep && kind ? (
        <fieldset className="eik-fieldset">
          <legend>{kind === "piercing" ? "03" : "06"} — Kontakt</legend>
          <div className="eik-field">
            <label htmlFor="name">Navn</label>
            <input
              id="name"
              className="eik-input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <FieldError id="name" message={errors.name} />
          </div>

          <div className="eik-field">
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              className="eik-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <FieldError id="email" message={errors.email} />
          </div>

          <div className="eik-field">
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              className="eik-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="400 00 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            <FieldError id="phone" message={errors.phone} />
          </div>

          <div className="eik-field">
            <label className="eik-checkbox" htmlFor="consent">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                Jeg godtar at Eik Tattoo &amp; Piercing lagrer opplysningene over for å svare på
                henvendelsen min.
              </span>
            </label>
            <FieldError id="consent" message={errors.consent} />
          </div>
        </fieldset>
      ) : null}

      <div className="eik-formnav">
        {step > 0 ? (
          <button type="button" className="eik-btn eik-btn--ghost" onClick={goBack}>
            ← Tilbake
          </button>
        ) : null}

        {step < lastStep ? (
          <button
            type="button"
            className="eik-btn eik-btn--primary"
            onClick={goNext}
            disabled={step === 0 && !kind}
          >
            Neste →
          </button>
        ) : (
          <button type="submit" className="eik-btn eik-btn--primary">
            Send inn henvendelsen
          </button>
        )}

        {step === lastStep ? (
          <p className="eik-meta" style={{ flexBasis: "100%" }}>
            Du binder deg ikke til noe ved å sende inn.
          </p>
        ) : null}
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="eik-error" id={`${id}-error`} role="alert">
      {message}
    </p>
  );
}

const ROUTE_LABEL: Record<string, string> = {
  piercing: "Piercing — kan settes rett i timeboka",
  quote: "Klar for prisforslag",
  consultation: "Bør inn til idésamtale",
  "needs-info": "Trenger ett oppfølgingsspørsmål",
};

function SuccessState({
  enquiry,
  headingRef,
}: {
  enquiry: Enquiry;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const { triage: t } = enquiry;
  return (
    <div className="eik-success" role="status" aria-live="polite">
      <div className="eik-success__mark" aria-hidden="true">
        ✓
      </div>
      <p className="eik-meta">Henvendelse mottatt · {formatDateNo(enquiry.submittedAt)}</p>
      <h2
        className="eik-display eik-h2"
        style={{ margin: "0.5rem 0 0.75rem" }}
        tabIndex={-1}
        ref={headingRef}
      >
        Takk, {enquiry.contact.name.split(" ")[0]}.
      </h2>
      <p className="eik-lead">
        Vi har alt vi trenger for å svare deg ordentlig. Du får en e-post til{" "}
        {enquiry.contact.email} med forslag, prisramme og ledige tider.
      </p>

      <p className="eik-body" style={{ marginTop: "1rem", fontSize: "0.9375rem" }}>
        Referanse: <strong>{enquiry.id.slice(0, 8).toUpperCase()}</strong>
        <DemoNote id="eik.17" />
      </p>

      <dl className="eik-summary">
        <div>
          <dt>Type</dt>
          <dd>{enquiry.kind === "piercing" ? "Piercing" : "Tatovering"}</dd>
        </div>
        {enquiry.brief.piercingType ? (
          <div>
            <dt>Piercing</dt>
            <dd>{enquiry.brief.piercingType}</dd>
          </div>
        ) : null}
        {enquiry.brief.placement ? (
          <div>
            <dt>Plassering</dt>
            <dd>{enquiry.brief.placement}</dd>
          </div>
        ) : null}
        {enquiry.brief.size ? (
          <div>
            <dt>Størrelse</dt>
            <dd>{SIZE_OPTIONS.find((s) => s.value === enquiry.brief.size)?.label}</dd>
          </div>
        ) : null}
        {enquiry.brief.styles.length > 0 ? (
          <div>
            <dt>Stilart</dt>
            <dd>{enquiry.brief.styles.join(", ")}</dd>
          </div>
        ) : null}
        <div>
          <dt>Tidsramme</dt>
          <dd>{TIMING_OPTIONS.find((o) => o.value === enquiry.brief.timing)?.label}</dd>
        </div>
        <div>
          <dt>Grunnlag</dt>
          <dd>
            {t.completeness}% komplett · {ROUTE_LABEL[t.route]}
            {t.flags.length > 0 ? ` · ${t.flags.join(", ")}` : ""}
          </dd>
        </div>
      </dl>

      <div className="eik-formnav" style={{ marginTop: "1.75rem" }}>
        <Link href="/eik/etterbehandling" className="eik-btn eik-btn--ghost">
          Les om etterbehandling
        </Link>
        <Link href="/eik/portefolje" className="eik-btn eik-btn--ghost">
          Se flere arbeider
        </Link>
      </div>
    </div>
  );
}
