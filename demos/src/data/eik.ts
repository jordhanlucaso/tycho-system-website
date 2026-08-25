import {
  TO_CONFIRM,
  type Artist,
  type FaqItem,
  type PortfolioItem,
  type ProcessStep,
  type StudioProfile,
} from "./types";

/**
 * EIK TATTOO & PIERCING — demo content.
 *
 * VERIFIED  : name, address, category, Google rating/count (per brief + directories).
 * TO_CONFIRM: artists, styles, hours, phone, email, prices, certifications, history.
 *
 * Third-party directories (blackink.no, finntatovering.com) publish contradictory,
 * partly machine-generated descriptions of this studio — see research/competitive-analysis.md
 * §1.3. Nothing from those sources is treated as fact here.
 */

export const eikStudio: StudioProfile = {
  slug: "eik",
  name: "Eik Tattoo & Piercing",
  address: {
    streetAddress: "Eikveien 64a",
    postalCode: "3122",
    addressLocality: "Tønsberg",
    addressRegion: "Vestfold",
    addressCountry: "NO",
  },
  addressDisplay: "Eikveien 64a, 3122 Tønsberg",
  phone: TO_CONFIRM,
  email: TO_CONFIRM,
  instagram: TO_CONFIRM,
  facebook: TO_CONFIRM,
  hours: TO_CONFIRM,
  hoursNote: TO_CONFIRM,
  googleRating: { value: 5.0, count: 4 },
  schemaType: "TattooParlor",
  areaServed: ["Tønsberg", "Nøtterøy", "Færder", "Vestfold"],
};

export const eikHero = {
  eyebrow: "Tatovering & piercing · Tønsberg",
  headline: ["Kroppen din.", "Din historie."],
  lead:
    "Vi tar oss tid til idéen før vi tar oss tid til huden. Send inn det du tenker på — du får svar fra oss med forslag, størrelse og prisramme før du booker time.",
  primaryCta: { label: "Send inn idéen din", href: "/eik/booking" },
  secondaryCta: { label: "Se arbeidene våre", href: "/eik/portefolje" },
  rule: { left: "00 — EIK TATTOO & PIERCING", right: "EIKVEIEN 64A · TØNSBERG" },
};

/** Short, concrete trust points. Only claims we can actually stand behind. */
export const eikTrustPoints = [
  {
    label: "GOOGLE",
    value: "5,0",
    body: "Snitt av 4 vurderinger på Google. Vi har få vurderinger — men vi har ingen dårlige.",
  },
  {
    label: "SVARTID",
    value: "TO_CONFIRM",
    body: "Hvor raskt studioet svarer på en henvendelse. Fylles inn av Eik.",
  },
  {
    label: "ALDERSGRENSE",
    value: "18 år",
    body: "Tatovering krever gyldig legitimasjon. Regler for piercing under 18 år bekreftes av studioet.",
  },
] as const;

export const eikServices = [
  {
    id: "tatovering",
    n: "01",
    title: "Tatovering",
    href: "/eik/tatovering",
    lead:
      "Fra små, fine linjer til større arbeider over flere økter. Vi tegner opp forslaget ditt før du bestemmer deg.",
    bullets: [
      "Gratis idésamtale før du binder deg til noe",
      "Du ser skissen før nålen kommer fram",
      "Fast prisramme avtalt på forhånd",
    ],
  },
  {
    id: "piercing",
    n: "02",
    title: "Piercing",
    href: "/eik/piercing",
    lead:
      "Piercing er et eget håndverk, ikke noe vi gjør ved siden av. Egen side med smykker, tilheling og aldersregler.",
    bullets: [
      "Smykker i implantatgodkjent materiale",
      "Tilhelingstid oppgitt for hvert sted",
      "Ettersyn inkludert etter første måned",
    ],
  },
] as const;

export const eikProcess: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Du sender inn idéen",
    meta: "5 MIN · NETTSKJEMA",
    body:
      "Motiv, størrelse, plassering, farge eller svart-hvitt, og eventuelle referansebilder. Jo mer vi vet, jo mindre må vi spørre om.",
  },
  {
    n: "02",
    title: "Du får svar med forslag",
    meta: "SVARTID: TO_CONFIRM",
    body:
      "Vi sier fra om idéen fungerer på det stedet du har tenkt, hva den vil koste, og hvor lang tid den tar. Er den ikke gjennomførbar, sier vi det med en gang.",
  },
  {
    n: "03",
    title: "Idésamtale i studio",
    meta: "20–30 MIN · UFORPLIKTENDE",
    body:
      "Vi ser på huden, plasseringen og skissen sammen. Du kan gå herfra uten å ha bestilt time.",
  },
  {
    n: "04",
    title: "Timen",
    meta: "AVTALT PÅ FORHÅND",
    body:
      "Du vet hva som skal skje, hvor lang tid det tar og hva det koster før du setter deg i stolen. Spis før du kommer.",
  },
  {
    n: "05",
    title: "Etterbehandling",
    meta: "14 DAGER",
    body:
      "Du får skriftlig veiledning med deg hjem, og du kan kontakte oss hvis noe ser feil ut. Det koster ingenting å spørre.",
  },
];

export const eikAftercareTattoo = [
  {
    n: "01",
    title: "De første timene",
    body:
      "La bandasjen sitte så lenge tatovøren sier. Når den tas av: vask hendene først, skyll tatoveringen med lunkent vann og mild, uparfymert såpe, og klapp den tørr med rent papir.",
  },
  {
    n: "02",
    title: "Dag 1–14",
    body:
      "Vask forsiktig to ganger daglig og smør et tynt lag med anbefalt salve. Tynt — ikke tykt. Huden skal puste, ikke ligge under et lokk.",
  },
  {
    n: "03",
    title: "Ikke gjør dette",
    body:
      "Ikke plukk eller klø på skorper. Ikke bad, svøm eller gå i badstue. Ikke tren hardt de første dagene. Ikke la sola treffe fersk tatovering.",
  },
  {
    n: "04",
    title: "Når du bør ta kontakt",
    body:
      "Økende varme, hevelse, rødhet som brer seg, væske eller feber er ikke normal tilheling. Ta kontakt med oss, og med lege hvis du har feber.",
  },
  {
    n: "05",
    title: "Etterpå",
    body:
      "Solkrem med høy faktor på tatoveringen resten av livet. Det er den ene tingen som avgjør hvordan den ser ut om ti år.",
  },
] as const;

export const eikAftercarePiercing = [
  {
    n: "01",
    title: "Rengjøring",
    body:
      "Skyll med steril saltvannsoppløsning to ganger daglig. Ikke bruk sprit, hydrogenperoksid eller salve — det tørker ut og forsinker tilhelingen.",
  },
  {
    n: "02",
    title: "La den være i fred",
    body:
      "Ikke vri på smykket. Ikke ta det ut for å «sjekke». Ikke bytt smykke før tilhelingstiden er ute — spør oss først.",
  },
  {
    n: "03",
    title: "Tilhelingstid",
    body:
      "Varierer med plassering, fra noen uker til godt over et år. Du får oppgitt tid for akkurat din piercing når du er her.",
  },
] as const;

export const eikFaq: readonly FaqItem[] = [
  {
    q: "Hva koster en tatovering hos dere?",
    a: "Prisrammen avtales før timen, basert på størrelse, plassering og detaljnivå. Minstepris og timepris bekreftes av studioet.",
    demo: true,
  },
  {
    q: "Må jeg vite nøyaktig hva jeg vil ha?",
    a: "Nei. De fleste kommer med en retning, ikke en ferdig tegning. Beskriv motivet, hvor det skal sitte og omtrent hvor stort — vi tegner opp resten sammen med deg.",
  },
  {
    q: "Er det vondt?",
    a: "Det svir, men det er til å holde ut. Ribbein, ankler og innsiden av overarmen kjennes mest. Vi tar pauser når du trenger det. Spis før du kommer, og ikke kom bakfull.",
  },
  {
    q: "Hvor gammel må jeg være?",
    a: "18 år for tatovering, med gyldig legitimasjon. Aldersregler for piercing bekreftes av studioet.",
    demo: true,
  },
  {
    q: "Kan dere dekke over en gammel tatovering?",
    a: "Ofte, men ikke alltid. Send inn et godt bilde i dagslys sammen med idéen din, så sier vi ærlig fra om hva som er mulig.",
  },
  {
    q: "Hvordan bestiller jeg time?",
    a: "Send inn idéen din via skjemaet. Du får svar med forslag, prisramme og ledige tider — uten at du må sende meldinger fram og tilbake.",
  },
  {
    q: "Kan jeg ta med meg noen?",
    a: "Ja, én person. Studioet er lite, og det blir fort trangt.",
    demo: true,
  },
];

/**
 * Artist roster — structural placeholders.
 *
 * Directory sites list names for this studio, but from a single unreliable source
 * (see research §1.3). We do not publish unverified names. These slots exist so the
 * client can see the layout their real team will occupy.
 */
export const eikArtists: readonly Artist[] = [
  {
    id: "artist-1",
    name: TO_CONFIRM,
    role: TO_CONFIRM,
    bio: TO_CONFIRM,
    styles: TO_CONFIRM,
    instagram: TO_CONFIRM,
    placeholder: true,
  },
  {
    id: "artist-2",
    name: TO_CONFIRM,
    role: TO_CONFIRM,
    bio: TO_CONFIRM,
    styles: TO_CONFIRM,
    instagram: TO_CONFIRM,
    placeholder: true,
  },
  {
    id: "artist-3",
    name: TO_CONFIRM,
    role: TO_CONFIRM,
    bio: TO_CONFIRM,
    styles: TO_CONFIRM,
    instagram: TO_CONFIRM,
    placeholder: true,
  },
];

/** Portfolio slots. No real imagery — every item renders a labelled placeholder frame. */
export const eikPortfolio: readonly PortfolioItem[] = [
  { id: "e01", artistId: TO_CONFIRM, style: "Fineline", placement: "Underarm", palette: "blackgrey", meta: "2 TIMER", ratio: "4:5", alt: "Fineline tatovering på underarm", year: "2026" },
  { id: "e02", artistId: TO_CONFIRM, style: "Botanisk", placement: "Skulder", palette: "blackgrey", meta: "3 TIMER", ratio: "4:5", alt: "Botanisk tatovering på skulder", year: "2026" },
  { id: "e03", artistId: TO_CONFIRM, style: "Blackwork", placement: "Legg", palette: "blackgrey", meta: "5 TIMER", ratio: "4:5", alt: "Blackwork tatovering på legg", year: "2026" },
  { id: "e04", artistId: TO_CONFIRM, style: "Piercing", placement: "Øre", palette: "colour", meta: "20 MIN", ratio: "4:5", alt: "Piercing i øre med implantatgodkjent smykke", year: "2026" },
  { id: "e05", artistId: TO_CONFIRM, style: "Ornamental", placement: "Rygg", palette: "blackgrey", meta: "6 TIMER", ratio: "4:5", alt: "Ornamental tatovering på rygg", year: "2025" },
  { id: "e06", artistId: TO_CONFIRM, style: "Farge", placement: "Overarm", palette: "colour", meta: "4 TIMER", ratio: "4:5", alt: "Tatovering i farger på overarm", year: "2025" },
  { id: "e07", artistId: TO_CONFIRM, style: "Fineline", placement: "Håndledd", palette: "blackgrey", meta: "1 TIME", ratio: "4:5", alt: "Liten fineline tatovering på håndledd", year: "2025" },
  { id: "e08", artistId: TO_CONFIRM, style: "Cover-up", placement: "Underarm", palette: "blackgrey", meta: "7 TIMER", ratio: "4:5", alt: "Cover-up av eldre tatovering på underarm", year: "2025" },
  { id: "e09", artistId: TO_CONFIRM, style: "Piercing", placement: "Nese", palette: "colour", meta: "15 MIN", ratio: "4:5", alt: "Nesepiercing utført i studio", year: "2025" },
];

export const eikPortfolioStyles = [
  "Alle",
  "Fineline",
  "Botanisk",
  "Blackwork",
  "Ornamental",
  "Farge",
  "Cover-up",
  "Piercing",
] as const;

/** Everything the client must supply before this can go live. Rendered on /proposal. */
export const eikToConfirm = [
  { field: "Tatovørenes navn, roller og stilarter", why: "Navngitte tatovører er det sterkeste tillitssignalet på siden, og gir hver tatovør en egen side å rangere på." },
  { field: "Åpningstider (eller «kun etter avtale»)", why: "Går i JSON-LD og må stemme nøyaktig med Google-profilen. To ulike kilder oppgir motstridende tider i dag." },
  { field: "Telefonnummer og e-postadresse", why: "Del av NAP-konsistens. Må være identisk overalt: nettsted, Google, Facebook, katalogsider." },
  { field: "Offisiell Instagram- og Facebook-konto", why: "Går i `sameAs` i strukturerte data og knytter profilene sammen for Google." },
  { field: "Minstepris og timepris for tatovering", why: "«Hva koster det» er en av de mest kjøpsklare søkene som finnes. Studioet som svarer, får henvendelsen." },
  { field: "Prisliste for piercing og smykker", why: "Piercing er transaksjonelt. Kunden vil ha pris og aldersregler før de tar kontakt." },
  { field: "Aldersgrense for piercing under 18 år", why: "Krav om verge må stå tydelig. Dette er både juridisk og praktisk viktig." },
  { field: "Depositum og avbestillingsregler", why: "Reduserer no-show og fjerner den vanskeligste samtalen fra tatovøren." },
  { field: "Medlemskap i Norsk Tattoo Union eller tilsvarende", why: "To konkurrenter viser dette som merke. Vi hevder det ikke uten bekreftelse." },
  { field: "20–40 bilder av eget arbeid i god oppløsning", why: "Porteføljen er produktet. Alle bilderammer på demoen er tomme til dette foreligger." },
  { field: "Faktisk svartid på henvendelser", why: "Brukes som synlig løfte på siden. Må være et tall studioet faktisk klarer å holde." },
] as const;
