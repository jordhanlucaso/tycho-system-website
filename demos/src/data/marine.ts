/**
 * Marine Max — business data.
 *
 * Every value here is either verified against Brønnøysundregistrene (Enhetsregisteret API,
 * retrieved 23-08-2026) or marked TO_CONFIRM. Directory data (gulesider, 1881, proff) is
 * treated as unverified and does not appear as a claim anywhere in this file.
 *
 * See research/marine-max-research.md for the full provenance table.
 */

import { TO_CONFIRM, type BusinessProfile, type OpenQuestion, type ProcessStep, type ServiceEntry, type Symptom, type WorkItem } from "./types";

export const business: BusinessProfile = {
  /**
   * [V] Enhetsregisteret. NOT rendered anywhere on the site, and not emitted in JSON-LD.
   *
   * For an enkeltpersonforetak the registered name is the owner's full personal name, and
   * putting "Marine Max - Trond Erik Nielsen" in a footer reads as a person's home details
   * rather than a workshop's. The owner has no reason to want it there, and a customer has
   * no use for it. It stays in the data because the registry is what the trading name and
   * the 2005 registration date are verified against — the org number carries that publicly.
   *
   * The legal name itself is unchanged; this is a presentation decision. See research §3.4.
   */
  legalName: "Marine Max - Trond Erik Nielsen",
  displayName: "Marine Max",
  descriptor: "Båtservice",
  place: "Nøtterøy",
  orgNumber: "988 770 868",
  orgForm: "Enkeltpersonforetak",
  registeredSince: "2005-11-10", // [V] registreringsdatoEnhetsregisteret
  naceCode: "33.150",
  naceLabel: "Reparasjon og vedlikehold av sivile skip og båter",
  address: {
    street: "Bryggeveien 3B",
    postalCode: "3120",
    locality: "Nøtterøy",
    municipality: "Færder",
    country: "NO",
  },
  phoneDisplay: "920 11 867", // [V] registry `mobil`
  phoneE164: "+4792011867",
  email: TO_CONFIRM, // No public email found anywhere. Questionnaire 4.3
  openingHours: TO_CONFIRM, // Questionnaire 4.1. Never guessed — wrong hours cost trust
  areaServed: ["Nøtterøy", "Færder", "Tønsberg"],
};

/** The year count, derived rather than hardcoded so it cannot go stale. */
export function yearsRegistered(now: Date = new Date()): number {
  const start = new Date(business.registeredSince);
  let years = now.getFullYear() - start.getFullYear();
  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  if (beforeAnniversary) years -= 1;
  return years;
}

/**
 * The registry's free-text activity statement, verbatim — typo included.
 * Quoted (never paraphrased) on /om-marine-max as evidence, not as a service list.
 * It was filed in 2005 and may be entirely stale. See research §1.1.
 */
export const registryActivity = [
  "Kjøp, salg og reparasjon av motorer og båtmoterer.",
  "Kjøp, salg og reparasjon av anleggsmaskiner og landbruksmaskiner.",
];

/**
 * Services.
 *
 * Only `verified` entries get an indexed page of their own. `scope-unclear` entries are
 * shown but hedged — the registry says the activity exists, but not its boundary.
 * `to-confirm` entries are NEVER presented as offerings; they exist here so the demo layer
 * and /proposal can show what is still missing.
 */
export const services: ServiceEntry[] = [
  {
    id: "motorservice",
    slug: "/marine-max/batmotor-service",
    title: "Service på båtmotor",
    status: "verified",
    summary:
      "Vedlikehold og service på båtmotor. Registrert virksomhet siden 2005 er reparasjon og vedlikehold av båter og båtmotorer.",
    needs: [
      "Motormerke og modell — eller ett bilde av motorskiltet",
      "Omtrentlig årsmodell",
      "Hvor båten står i dag",
    ],
    source: "Enhetsregisteret NACE 33.150 + registrert aktivitet",
  },
  {
    id: "reparasjon",
    slug: "/marine-max/batreparasjon",
    title: "Reparasjon og feilsøking",
    status: "verified",
    summary:
      "Noe har sluttet å virke, eller det høres ikke riktig ut. Vi finner ut hva det er før vi bytter deler.",
    needs: [
      "Hva motoren gjør — og hva den ikke gjør",
      "Om den starter",
      "Når det begynte",
      "Bilde eller lydopptak hvis du har",
    ],
    source: "Enhetsregisteret NACE 33.150",
  },
  {
    id: "motorsalg",
    title: "Kjøp og salg av motorer",
    status: "scope-unclear",
    summary:
      "Registrert virksomhet omfatter kjøp og salg av motorer. Hvilke merker og hva som er på lager er ikke bekreftet.",
    source: "Enhetsregisteret, registrert aktivitet (2005)",
  },
  {
    id: "maskin",
    title: "Anleggs- og landbruksmaskiner",
    status: "scope-unclear",
    summary:
      "Registrert virksomhet omfatter også maskiner. Om dette fortsatt utføres er ikke bekreftet.",
    source: "Enhetsregisteret, registrert aktivitet (2005)",
  },
  // Below: never rendered as offerings. Present only so the gap is visible in /proposal.
  { id: "mobil", title: "Mobil service", status: "to-confirm", summary: "Ikke bekreftet." },
  { id: "klargjoring", title: "Vårklargjøring", status: "to-confirm", summary: "Ikke bekreftet." },
  { id: "konservering", title: "Konservering / vinter", status: "to-confirm", summary: "Ikke bekreftet." },
  { id: "opplag", title: "Vinteropplag", status: "to-confirm", summary: "Ikke bekreftet." },
  { id: "elektrisk", title: "Elektrisk arbeid", status: "to-confirm", summary: "Ikke bekreftet." },
  { id: "forsikring", title: "Forsikringsskader", status: "to-confirm", summary: "Ikke bekreftet." },
];

export const publicServices = services.filter((s) => s.status !== "to-confirm");
export const servicePages = services.filter((s) => s.status === "verified" && s.slug);

/**
 * Symptom-led content for /batreparasjon.
 *
 * This is generally-known marine mechanics, not a claim about Marine Max's diagnosis. It is
 * the only symptom-led content in this market — no competitor has any. See competitive
 * analysis §6.1, gap 4.
 */
export const symptoms: Symptom[] = [
  {
    id: "starter-ikke",
    symptom: "Motoren starter ikke",
    likely: "Batteri, tenning, drivstofftilførsel eller startmotor. Rekkefølgen på feilsøkingen avhenger av hva som skjer når du vrir om.",
    weNeed: "Skjer det noe når du vrir om? Klikk, ingenting, eller går den rundt uten å tenne?",
  },
  {
    id: "stopper",
    symptom: "Motoren stopper under gange",
    likely: "Ofte drivstoff — filter, luft i systemet eller tank. Kan også være overoppheting som slår inn.",
    weNeed: "Skjer det etter en viss tid, eller ved bestemt turtall?",
  },
  {
    id: "ujevn",
    symptom: "Går ujevnt eller mister kraft",
    likely: "Tenning, forgasser eller innsprøytning, eller en sylinder som ikke bidrar.",
    weNeed: "Er det verst kaldt eller varmt? Ved lavt eller høyt turtall?",
  },
  {
    id: "overopphet",
    symptom: "Blir for varm",
    likely: "Kjølevann. Ofte impeller, men kan være blokkering i inntaket eller termostat.",
    weNeed: "Kommer det vann ut av tellstrålen? Hvor lenge går den før varselet kommer?",
  },
  {
    id: "lyd",
    symptom: "Ny lyd fra drev eller motor",
    likely: "Kan være alt fra propell og lager til noe alvorlig. Verdt å høre på tidlig.",
    weNeed: "Et lydopptak med mobilen er ofte nok til å si noe. Når i turtallet kommer lyden?",
  },
  {
    id: "vibrasjon",
    symptom: "Vibrasjon i gange",
    likely: "Ofte propell — skade, ubalanse eller feil stigning. Kan også være aksling.",
    weNeed: "Bilde av propellen. Har du kjørt på noe?",
  },
];

export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Fortell oss om båten",
    body: "Send inn skjemaet eller ring. Har du et bilde av motorskiltet, har vi det meste vi trenger med én gang.",
  },
  {
    n: "02",
    title: "Vi vurderer jobben",
    body: "Vi ser på det du har sendt og tar kontakt. Ofte kan vi si noe om omfanget før båten er inne.",
  },
  {
    n: "03",
    title: "Avtal tid",
    body: "Vi blir enige om når jobben skal gjøres og hva den omfatter.",
  },
  {
    n: "04",
    title: "Tilbake på sjøen",
    body: "Du får vite hva som ble gjort og hva som ble byttet.",
  },
];

/** Photography placeholders. Each carries the exact brief from content/photo-shot-list.md. */
export const recentWork: WorkItem[] = [
  { id: "w1", brief: "Før og etter — samme utsnitt", ratio: "16:9", caption: "Fotoliste nr. 6" },
  { id: "w2", brief: "Ferdig jobb, detalj", ratio: "1:1", caption: "Fotoliste nr. 7" },
  { id: "w3", brief: "Åpen motor under service", ratio: "4:3", caption: "Fotoliste nr. 3" },
  { id: "w4", brief: "Båt inne til arbeid", ratio: "16:9", caption: "Fotoliste nr. 10" },
  { id: "w5", brief: "Feilsøking med måleinstrument", ratio: "4:3", caption: "Fotoliste nr. 4" },
  { id: "w6", brief: "Verktøy og benk, ovenfra", ratio: "1:1", caption: "Fotoliste nr. 8" },
];

/** Everything the site cannot say until Trond answers. Rendered in /proposal. */
export const openQuestions: OpenQuestion[] = [
  { field: "Motormerker", why: "Folk søker på merket sitt. Den enkeltopplysningen som gir størst utslag på synlighet.", question: "2.1", impact: "høy" },
  { field: "Mobil service", why: "Sterkeste mulige differensiering mot verksteder som krever at båten kommer til dem.", question: "3.2", impact: "høy" },
  { field: "Tjenesteliste", why: "Avgjør hvilke sider som kan lages og hva skjemaet kan tilby.", question: "1.1", impact: "høy" },
  { field: "Åpningstider", why: "Kreves for Google-profilen. Feil tider gir dårlige anmeldelser.", question: "4.1", impact: "høy" },
  { field: "E-postadresse", why: "Skjemaet trenger et sted å levere henvendelsene.", question: "4.3", impact: "høy" },
  { field: "Maskinarbeid", why: "Avgjør om nettsiden handler om båt alene eller båt pluss maskin.", question: "1.2", impact: "høy" },
  { field: "Innenbords / utenbords", why: "Endrer hele tjenestemenyen og skjemaets felter.", question: "2.3", impact: "middels" },
  { field: "Serviceområde", why: "Avgjør hvilke stedsnavn vi kan bruke i tekst og strukturerte data.", question: "3.3", impact: "middels" },
  { field: "Klargjøring og konservering", why: "Låser opp sesongkampanjer og årlige påminnelser.", question: "1.1", impact: "middels" },
  { field: "Vinteropplag", why: "Konkurrentene leder med dette. Vi antar ingenting.", question: "3.5", impact: "middels" },
  { field: "Autorisasjon", why: "«Autorisert» er et juridisk begrep. Skrives aldri uten bekreftelse.", question: "2.5", impact: "middels" },
  { field: "Bilder", why: "Sterkeste konverteringsressursen som finnes. Ingen konkurrent viser et menneske.", question: "5.4, 5.5", impact: "høy" },
  { field: "Anmeldelser", why: "Null i dag. Fem–ti ekte anmeldelser flytter mer enn noe annet vi kan bygge.", question: "5.1", impact: "høy" },
  { field: "Priser", why: "Det mest stilte, minst besvarte spørsmålet i bransjen.", question: "—", impact: "middels" },
  { field: "MVA-registrering", why: "Ehandelsloven § 8 krever at nettstedet oppgir om virksomheten er merverdiavgiftspliktig. Vi gjetter ikke på dette.", question: "4.6", impact: "middels" },
];
