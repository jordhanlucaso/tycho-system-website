"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Plate } from "@/components/marine/Primitives";
import { business } from "@/data/marine";
import { localStorageSink, notificationSummary } from "@/lib/adapters";
import {
  BOAT_LOCATIONS,
  CONTACT_PREFERENCES,
  EMAIL_RE,
  FUELS,
  MOUNTINGS,
  ONSETS,
  PHONE_RE,
  REQUEST_TYPES,
  ROUTE_LABEL,
  STARTS,
  URGENCY_LABEL,
  captureSource,
  formatDateNo,
  leadId,
  triage,
  type Attachment,
  type BoatLocationKind,
  type ContactPreference,
  type Fuel,
  type Mounting,
  type Onset,
  type RequestType,
  type ServiceLead,
  type StartsState,
} from "@/lib/lead";

const MAX_FILES = 6;
const MAX_BYTES = 8 * 1024 * 1024;

interface FieldError {
  id: string;
  label: string;
}

export function LeadForm() {
  const [type, setType] = useState<RequestType | "">("");
  const [boatMake, setBoatMake] = useState("");
  const [boatModel, setBoatModel] = useState("");
  const [boatYear, setBoatYear] = useState("");
  const [boatLength, setBoatLength] = useState("");
  const [engineMake, setEngineMake] = useState("");
  const [engineModel, setEngineModel] = useState("");
  const [engineYear, setEngineYear] = useState("");
  const [mounting, setMounting] = useState<Mounting>("vet-ikke");
  const [fuel, setFuel] = useState<Fuel>("vet-ikke");
  const [description, setDescription] = useState("");
  const [onset, setOnset] = useState<Onset | "">("");
  const [starts, setStarts] = useState<StartsState | "">("");
  const [locationKind, setLocationKind] = useState<BoatLocationKind | "">("");
  const [locationWhere, setLocationWhere] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactPref, setContactPref] = useState<ContactPreference>("telefon");
  const [preferredDate, setPreferredDate] = useState("");

  // Honeypot. A bot fills every field it finds; a human never sees this one.
  const [website, setWebsite] = useState("");

  const [errors, setErrors] = useState<FieldError[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [submitted, setSubmitted] = useState<ServiceLead | null>(null);

  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Focus is moved in an effect rather than in the submit handler, because the summary is
  // not in the DOM until React has committed the render that adds it.
  useEffect(() => {
    if (attempt > 0 && errors.length > 0) summaryRef.current?.focus();
  }, [attempt, errors]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const next: Attachment[] = [...files];
    for (const file of picked) {
      if (next.length >= MAX_FILES) break;
      if (file.size > MAX_BYTES) continue;
      next.push({
        kind: file.type.startsWith("video") ? "video" : "photo",
        name: file.name,
        size: file.size,
        mime: file.type,
      });
    }
    setFiles(next);
    e.target.value = "";
  }

  function validate(): FieldError[] {
    const found: FieldError[] = [];
    if (!type) found.push({ id: "felt-type", label: "Velg hva henvendelsen gjelder" });
    if (description.trim().length < 10)
      found.push({ id: "felt-beskrivelse", label: "Beskriv kort hva det gjelder" });
    if (!locationKind) found.push({ id: "felt-sted", label: "Velg hvor båten er" });
    if (!name.trim()) found.push({ id: "felt-navn", label: "Skriv inn navnet ditt" });
    if (!PHONE_RE.test(phone.trim()))
      found.push({ id: "felt-telefon", label: "Skriv inn et gyldig telefonnummer" });
    if (email.trim() && !EMAIL_RE.test(email.trim()))
      found.push({ id: "felt-epost", label: "E-postadressen ser ikke riktig ut" });
    return found;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (website) return; // honeypot tripped

    const found = validate();
    setErrors(found);
    setAttempt((a) => a + 1);
    if (found.length > 0) return;

    const core = {
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContact: contactPref,
        preferredDate: preferredDate || undefined,
      },
      boat: {
        make: boatMake.trim() || undefined,
        model: boatModel.trim() || undefined,
        year: boatYear.trim() || undefined,
        lengthFeet: boatLength.trim() || undefined,
      },
      engine: {
        make: engineMake.trim() || undefined,
        model: engineModel.trim() || undefined,
        year: engineYear.trim() || undefined,
        mounting,
        fuel,
      },
      request: {
        type: type as RequestType,
        description: description.trim(),
        onset: (onset || undefined) as Onset | undefined,
        starts: (starts || undefined) as StartsState | undefined,
      },
      location: {
        kind: locationKind as BoatLocationKind,
        where: locationWhere.trim() || undefined,
      },
      attachments: files,
    };

    const lead: ServiceLead = {
      id: leadId(),
      submittedAt: new Date().toISOString(), // ISO in storage, DD-MM-YYYY on screen
      ...core,
      source: captureSource(),
      triage: triage(core),
    };

    await localStorageSink.deliver(lead);
    setSubmitted(lead);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  if (submitted) return <SuccessState lead={submitted} headingRef={successRef} />;

  const errorFor = (id: string) => errors.find((e) => e.id === id);

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.length > 0 ? (
        <div
          className="mm-oppsummering"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
          aria-labelledby="feil-tittel"
        >
          <h2 id="feil-tittel" className="mm-d4">
            {errors.length === 1 ? "Ett felt mangler" : `${errors.length} felter mangler`}
          </h2>
          <ul>
            {errors.map((err) => (
              <li key={err.id}>
                <a href={`#${err.id}`}>{err.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ── 1. What ──────────────────────────────────────────────────────────────── */}
      <fieldset className="mm-fieldset-blokk">
        <legend>01 — Hva gjelder det</legend>

        <fieldset className="mm-gruppe" id="felt-type">
          <legend>Type henvendelse *</legend>
          <div className="mm-valg mm-valg--todelt">
            {REQUEST_TYPES.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  checked={type === option.value}
                  onChange={() => setType(option.value)}
                />
                <span>
                  {option.label}
                  <small>{option.hint}</small>
                </span>
              </label>
            ))}
          </div>
          {errorFor("felt-type") ? (
            <p className="mm-feil" style={{ marginTop: "0.5rem" }}>
              {errorFor("felt-type")?.label}
            </p>
          ) : null}
        </fieldset>

        <div className="mm-felt">
          <label htmlFor="felt-beskrivelse">Beskriv hva som skjer *</label>
          <p className="mm-felt__hint" id="hint-beskrivelse">
            Skriv som du ville forklart det på telefonen. «Starter, men dør etter et minutt»
            er mer nyttig enn «motorproblem».
          </p>
          <textarea
            id="felt-beskrivelse"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby="hint-beskrivelse"
            aria-invalid={errorFor("felt-beskrivelse") ? true : undefined}
          />
          {errorFor("felt-beskrivelse") ? (
            <p className="mm-feil">{errorFor("felt-beskrivelse")?.label}</p>
          ) : null}
        </div>

        <div className="mm-rutenett">
          <div className="mm-felt">
            <label htmlFor="felt-nar">Når begynte det?</label>
            <select id="felt-nar" value={onset} onChange={(e) => setOnset(e.target.value as Onset)}>
              <option value="">Velg …</option>
              {ONSETS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mm-felt">
            <label htmlFor="felt-starter">Starter motoren?</label>
            <select
              id="felt-starter"
              value={starts}
              onChange={(e) => setStarts(e.target.value as StartsState)}
            >
              <option value="">Velg …</option>
              {STARTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mm-mono mm-mono--dim" style={{ margin: 0 }}>
          Vi spør aldri «hvor haster det?»
          <DemoNote id="mm.16" />
        </p>
      </fieldset>

      {/* ── 2. Boat and engine ───────────────────────────────────────────────────── */}
      <fieldset className="mm-fieldset-blokk">
        <legend>02 — Båt og motor</legend>

        <p className="mm-felt__hint" style={{ marginBottom: "1rem" }}>
          Alt her er valgfritt. Har du et bilde av motorskiltet, kan du hoppe over det meste —
          merke, modell, årsmodell og serienummer står på skiltet.
        </p>

        <div className="mm-rutenett">
          <div className="mm-felt">
            <label htmlFor="felt-batmerke">Båtmerke</label>
            <input
              id="felt-batmerke"
              type="text"
              value={boatMake}
              onChange={(e) => setBoatMake(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-batmodell">Modell</label>
            <input
              id="felt-batmodell"
              type="text"
              value={boatModel}
              onChange={(e) => setBoatModel(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-batar">Årsmodell</label>
            <input
              id="felt-batar"
              type="text"
              inputMode="numeric"
              value={boatYear}
              onChange={(e) => setBoatYear(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-lengde">Lengde (fot)</label>
            <input
              id="felt-lengde"
              type="text"
              inputMode="numeric"
              value={boatLength}
              onChange={(e) => setBoatLength(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-motormerke">Motormerke</label>
            <input
              id="felt-motormerke"
              type="text"
              value={engineMake}
              onChange={(e) => setEngineMake(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-motormodell">Motormodell</label>
            <input
              id="felt-motormodell"
              type="text"
              value={engineModel}
              onChange={(e) => setEngineModel(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-motorar">Motorens årsmodell</label>
            <input
              id="felt-motorar"
              type="text"
              inputMode="numeric"
              value={engineYear}
              onChange={(e) => setEngineYear(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mm-rutenett">
          <div className="mm-felt">
            <label htmlFor="felt-montering">Innenbords eller utenbords</label>
            <select
              id="felt-montering"
              value={mounting}
              onChange={(e) => setMounting(e.target.value as Mounting)}
            >
              {MOUNTINGS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mm-felt">
            <label htmlFor="felt-drivstoff">Drivstoff</label>
            <select id="felt-drivstoff" value={fuel} onChange={(e) => setFuel(e.target.value as Fuel)}>
              {FUELS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* ── 3. Location ──────────────────────────────────────────────────────────── */}
      <fieldset className="mm-fieldset-blokk">
        <legend>03 — Hvor er båten</legend>

        <fieldset className="mm-gruppe" id="felt-sted">
          <legend>Båten står *</legend>
          <div className="mm-valg mm-valg--todelt">
            {BOAT_LOCATIONS.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="sted"
                  value={option.value}
                  checked={locationKind === option.value}
                  onChange={() => setLocationKind(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {errorFor("felt-sted") ? (
            <p className="mm-feil" style={{ marginTop: "0.5rem" }}>
              {errorFor("felt-sted")?.label}
            </p>
          ) : null}
        </fieldset>

        <div className="mm-felt">
          <label htmlFor="felt-hvor">Hvor, omtrent?</label>
          <p className="mm-felt__hint" id="hint-hvor">
            Havn, marina eller sted. Hjelper oss å vurdere hva som er praktisk mulig.
          </p>
          <input
            id="felt-hvor"
            type="text"
            value={locationWhere}
            onChange={(e) => setLocationWhere(e.target.value)}
            aria-describedby="hint-hvor"
          />
        </div>

        <p className="mm-mono mm-mono--dim" style={{ margin: 0 }}>
          Ingen konkurrenter spør om dette
          <DemoNote id="mm.17" />
        </p>
      </fieldset>

      {/* ── 4. Photos ────────────────────────────────────────────────────────────── */}
      <fieldset className="mm-fieldset-blokk">
        <legend>04 — Bilder</legend>

        <div className="mm-felt">
          <label htmlFor="felt-bilder">Legg ved bilder</label>
          <p className="mm-felt__hint" id="hint-bilder">
            Helst ett bilde av motorskiltet, og ett av det du lurer på. Maks {MAX_FILES}{" "}
            bilder, 8 MB hver.
          </p>
          {/* The native control's own text is browser chrome — it renders in the browser's
              UI language, not the page's, and its target is ~20px tall. Replaced visually;
              the input stays focusable and labelled. */}
          <label className="mm-filvelger" htmlFor="felt-bilder">
            <span className="mm-filvelger__knapp">Velg bilder</span>
            <span className="mm-filvelger__tekst">
              {files.length === 0
                ? "Eller ta bilde med mobilen"
                : `${files.length} av ${MAX_FILES} valgt`}
            </span>
            <input
              id="felt-bilder"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={onFiles}
              aria-describedby="hint-bilder"
            />
          </label>
        </div>

        {files.length > 0 ? (
          <ul className="mm-filer" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {files.map((file, i) => (
              <li className="mm-fil" key={`${file.name}-${i}`}>
                <span>
                  {file.name} · {(file.size / 1024).toFixed(0)} kB
                </span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, index) => index !== i))}
                >
                  Fjern
                  <span className="visually-hidden"> {file.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mm-mono mm-mono--dim" style={{ marginTop: "1rem", marginBottom: 0 }}>
          Bilder er valgfritt — skjemaet sendes uansett
          <DemoNote id="mm.18" />
        </p>
      </fieldset>

      {/* ── 5. Contact ───────────────────────────────────────────────────────────── */}
      <fieldset className="mm-fieldset-blokk">
        <legend>05 — Kontakt</legend>

        <div className="mm-rutenett">
          <div className="mm-felt">
            <label htmlFor="felt-navn">Navn *</label>
            <input
              id="felt-navn"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-invalid={errorFor("felt-navn") ? true : undefined}
            />
            {errorFor("felt-navn") ? <p className="mm-feil">{errorFor("felt-navn")?.label}</p> : null}
          </div>

          <div className="mm-felt">
            <label htmlFor="felt-telefon">Telefon *</label>
            <input
              id="felt-telefon"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              aria-invalid={errorFor("felt-telefon") ? true : undefined}
            />
            {errorFor("felt-telefon") ? (
              <p className="mm-feil">{errorFor("felt-telefon")?.label}</p>
            ) : null}
          </div>

          <div className="mm-felt">
            <label htmlFor="felt-epost">E-post</label>
            <input
              id="felt-epost"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={errorFor("felt-epost") ? true : undefined}
            />
            {errorFor("felt-epost") ? <p className="mm-feil">{errorFor("felt-epost")?.label}</p> : null}
          </div>

          <div className="mm-felt">
            <label htmlFor="felt-dato">Ønsket tidspunkt</label>
            <input
              id="felt-dato"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mm-felt">
          <label htmlFor="felt-kontaktmate">Hvordan vil du bli kontaktet?</label>
          <select
            id="felt-kontaktmate"
            value={contactPref}
            onChange={(e) => setContactPref(e.target.value as ContactPreference)}
          >
            {CONTACT_PREFERENCES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Honeypot — hidden from users and assistive tech, irresistible to bots.
            Preferred over a CAPTCHA, which suppresses genuine enquiries. */}
        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor="felt-nettsted">Nettsted</label>
          <input
            id="felt-nettsted"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </fieldset>

      <div className="mm-btn-rad">
        <button type="submit" className="mm-btn mm-btn--primar">
          Send inn
        </button>
        <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--sekundar">
          Eller ring {business.phoneDisplay}
        </a>
      </div>

      <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.25rem" }}>
        Demo: skjemaet lagres kun lokalt i nettleseren din. Ingenting sendes.
      </p>
    </form>
  );
}

/** Answers the two questions the customer actually has: did it go through, and when? */
function SuccessState({
  lead,
  headingRef,
}: {
  lead: ServiceLead;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const svar =
    lead.triage.urgency === "akutt"
      ? "Vi tar kontakt så snart som mulig i dag. Haster det, ring direkte."
      : lead.triage.urgency === "snarlig"
        ? "Vi tar kontakt innen ett døgn."
        : "Vi tar kontakt for å avtale tid.";

  return (
    <div className="mm-stabel">
      <div>
        <p className="mm-mono mm-varsel">Mottatt</p>
        <h2 className="mm-d2" tabIndex={-1} ref={headingRef} style={{ marginTop: "0.75rem" }}>
          Takk — vi har fått den
        </h2>
        <p className="mm-lead" style={{ marginTop: "1rem", maxWidth: "44ch" }}>
          {svar}
        </p>
      </div>

      <Plate
        title={`Referanse ${lead.id}`}
        rows={[
          { label: "Sendt", value: formatDateNo(lead.submittedAt) },
          { label: "Gjelder", value: REQUEST_TYPES.find((r) => r.value === lead.request.type)?.label ?? "—" },
          {
            label: "Båt",
            value: [lead.boat.make, lead.boat.model, lead.boat.year].filter(Boolean).join(" ") || "Ikke oppgitt",
          },
          {
            label: "Motor",
            value: [lead.engine?.make, lead.engine?.model].filter(Boolean).join(" ") || "Ikke oppgitt",
          },
          {
            label: "Båten står",
            value: BOAT_LOCATIONS.find((l) => l.value === lead.location.kind)?.label ?? "—",
          },
          { label: "Bilder", value: String(lead.attachments.length) },
          { label: "Kontakt", value: `${lead.customer.name} · ${lead.customer.phone}` },
        ]}
      />

      <div>
        <p className="mm-mono mm-mono--dim">
          Hva systemet gjorde med henvendelsen
          <DemoNote id="mm.19" />
        </p>

        <Plate
          title="Automatisk vurdering"
          rows={[
            { label: "Hastegrad", value: URGENCY_LABEL[lead.triage.urgency] },
            { label: "Ferdigstillingsgrad", value: `${lead.triage.completeness} %` },
            { label: "Neste steg", value: ROUTE_LABEL[lead.triage.route] },
            {
              label: "Merknader",
              value: lead.triage.flags.length ? lead.triage.flags.join(", ") : "Ingen",
            },
            { label: "SMS til Trond", value: notificationSummary(lead) },
          ]}
        />
      </div>

      <p>
        <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
          Ring {business.phoneDisplay}
        </a>
      </p>
    </div>
  );
}
