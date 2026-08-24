import {
  TO_CONFIRM,
  type Artist,
  type FaqItem,
  type PortfolioItem,
  type ProcessStep,
  type StudioProfile,
} from "./types";

/**
 * STABUKK TATTOO STUDIO — demo content.
 *
 * VERIFIED  : name, address, category, Google rating/count, weekday hours (per brief).
 * TO_CONFIRM: everything else.
 *
 * Search returns effectively zero indexed information about this studio. It does not
 * appear in gulesider.no tattoo listings or any of the directories that list every other
 * Tønsberg studio. The Instagram handle @stabukk_olden refers to a place in Vestland,
 * ~450 km away, and is assumed unrelated — it is deliberately NOT linked.
 *
 * Because so little is known, this site is designed to hold less content, not to hide
 * emptiness behind invented copy. See design/stabukk-design-direction.md §2.
 */

export const stabukkStudio: StudioProfile = {
  slug: "stabukk",
  name: "Stabukk Tattoo Studio",
  address: {
    streetAddress: "Møllegaten 4",
    postalCode: "3111",
    addressLocality: "Tønsberg",
    addressRegion: "Vestfold",
    addressCountry: "NO",
  },
  addressDisplay: "Møllegaten 4, 3111 Tønsberg",
  phone: TO_CONFIRM,
  email: TO_CONFIRM,
  instagram: TO_CONFIRM,
  facebook: TO_CONFIRM,
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
  hoursNote: "Lørdag og søndag stengt. Kveldstimer etter avtale.",
  googleRating: { value: 5.0, count: 2 },
  schemaType: "TattooParlor",
  areaServed: ["Tønsberg", "Nøtterøy", "Færder", "Vestfold"],
};

export const stabukkHero = {
  plate: "PLATE 00",
  word: "STABUKK",
  sub: ["Tattoo studio", "Tønsberg"],
  lead:
    "Atelier i Møllegaten. Vi tar få arbeider av gangen og bruker tiden på dem.",
  cta: { label: "Book ditt neste arbeid", href: "/stabukk/booking" },
  secondary: { label: "Se arbeider", href: "/stabukk/arbeider" },
  marquee: "MØLLEGATEN 4 · TØNSBERG · MAN–FRE 10–16 · ETTER AVTALE ·",
};

export const stabukkStats = [
  { k: "STED", v: "Møllegaten 4", meta: "Tønsberg sentrum" },
  { k: "ÅPENT", v: "Man–fre 10–16", meta: "Kveld etter avtale" },
  { k: "GOOGLE", v: "5,0", meta: "2 vurderinger" },
] as const;

export const stabukkIntro = {
  plate: "PLATE 01",
  heading: ["Få arbeider.", "Mer tid på hvert."],
  body: [
    "Stabukk er et lite atelier midt i Tønsberg. Vi holder til i Møllegaten 4, fem minutter fra Torvet, og jobber på hverdager mellom ti og fire.",
    "Vi tar imot et begrenset antall arbeider av gangen. Det betyr lengre ventetid enn hos et walk-in-studio, og det betyr at arbeidet ditt får den tiden det trenger — fra første skisse til siste økt.",
  ],
  note: "Studioets historie, tatovører og stilarter fylles inn av Stabukk.",
};

export const stabukkProcess: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Forespørsel",
    meta: "NETTSKJEMA · CA. 5 MIN",
    body:
      "Du beskriver arbeidet: motiv, plassering, omtrentlig størrelse, svart-hvitt eller farge, og referanser hvis du har noen. Dette er hele grunnlaget vi trenger for å svare deg ordentlig.",
  },
  {
    n: "02",
    title: "Svar",
    meta: "SVARTID: TO_CONFIRM",
    body:
      "Du får vite om vi kan påta oss arbeidet, hvor mange økter det krever, hva det koster og når vi har plass. Kan vi ikke gjøre det, sier vi det med en gang.",
  },
  {
    n: "03",
    title: "Skisse",
    meta: "FØR TIMEN",
    body:
      "Vi tegner opp arbeidet før du kommer. Du ser skissen og kan be om endringer mens det fortsatt bare er papir.",
  },
  {
    n: "04",
    title: "Økt",
    meta: "AVTALT VARIGHET",
    body:
      "Lange arbeider deles i flere økter. Du får plan for hele forløpet, ikke bare første time.",
  },
  {
    n: "05",
    title: "Tilheling",
    meta: "14 DAGER",
    body:
      "Skriftlig veiledning med deg hjem. Ser noe feil ut i tilhelingen, tar du kontakt — det koster ingenting å spørre.",
  },
];

export const stabukkAftercare = [
  {
    n: "01",
    title: "Første døgn",
    body:
      "La bandasjen sitte så lenge du får beskjed om. Vask hendene før du tar på arbeidet. Skyll med lunkent vann og mild, uparfymert såpe, og klapp tørt med rent papir.",
  },
  {
    n: "02",
    title: "Dag 1–14",
    body:
      "Vask to ganger daglig. Smør et tynt lag salve — huden skal puste. Ikke plukk på skorper, ikke klø, ikke la sola treffe.",
  },
  {
    n: "03",
    title: "Unngå",
    body:
      "Bad, svømming, badstue, hard trening og stramme klær over arbeidet de første to ukene.",
  },
  {
    n: "04",
    title: "Ta kontakt hvis",
    body:
      "Rødhet brer seg, huden blir varm og hoven, det kommer væske, eller du får feber. Kontakt oss — og lege ved feber.",
  },
  {
    n: "05",
    title: "Resten av livet",
    body:
      "Solkrem med høy faktor. Det er den ene tingen som avgjør hvordan arbeidet ser ut om ti år.",
  },
] as const;

export const stabukkFaq: readonly FaqItem[] = [
  {
    q: "Tar dere imot walk-ins?",
    a: "Vi jobber etter avtale. Send inn en forespørsel, så får du svar med ledige tider.",
    demo: true,
  },
  {
    q: "Hvor lang er ventetiden?",
    a: "Varierer med hvor stort arbeidet er og hvor mange økter det krever. Du får et konkret svar på forespørselen din.",
  },
  {
    q: "Hva koster det?",
    a: "Prisen avhenger av størrelse, plassering og antall økter. Du får en ramme før du bestemmer deg. Timepris og minstepris bekreftes av studioet.",
    demo: true,
  },
  {
    q: "Kan jeg komme innom og se stedet?",
    a: "Ja. Vi holder til i Møllegaten 4, og er der på hverdager mellom ti og fire.",
  },
  {
    q: "Hvor gammel må jeg være?",
    a: "18 år, med gyldig legitimasjon.",
  },
  {
    q: "Gjør dere cover-ups?",
    a: "Send inn et godt bilde i dagslys sammen med forespørselen. Vi svarer ærlig på hva som er mulig.",
  },
];

/** Roster unknown. One structural slot, honestly labelled. */
export const stabukkArtists: readonly Artist[] = [
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
];

/** Varied ratios drive the plate-stack rhythm. See design direction §6. */
export const stabukkPortfolio: readonly PortfolioItem[] = [
  { id: "s01", artistId: TO_CONFIRM, style: "Blackwork", placement: "Underarm", palette: "blackgrey", meta: "4 TIMER", ratio: "4:5", alt: "Blackwork-arbeid på underarm", year: "2026" },
  { id: "s02", artistId: TO_CONFIRM, style: "Ornamental", placement: "Rygg", palette: "blackgrey", meta: "3 ØKTER", ratio: "16:9", alt: "Ornamentalt ryggarbeid", year: "2026" },
  { id: "s03", artistId: TO_CONFIRM, style: "Fineline", placement: "Nakke", palette: "blackgrey", meta: "2 TIMER", ratio: "1:1", alt: "Fineline-arbeid på nakke", year: "2026" },
  { id: "s04", artistId: TO_CONFIRM, style: "Illustrativ", placement: "Legg", palette: "blackgrey", meta: "6 TIMER", ratio: "3:4", alt: "Illustrativt arbeid på legg", year: "2025" },
  { id: "s05", artistId: TO_CONFIRM, style: "Farge", placement: "Overarm", palette: "colour", meta: "2 ØKTER", ratio: "4:5", alt: "Fargearbeid på overarm", year: "2025" },
  { id: "s06", artistId: TO_CONFIRM, style: "Blackwork", placement: "Bryst", palette: "blackgrey", meta: "5 TIMER", ratio: "16:9", alt: "Blackwork-arbeid på bryst", year: "2025" },
  { id: "s07", artistId: TO_CONFIRM, style: "Ornamental", placement: "Håndbak", palette: "blackgrey", meta: "3 TIMER", ratio: "1:1", alt: "Ornamentalt arbeid på håndbak", year: "2025" },
  { id: "s08", artistId: TO_CONFIRM, style: "Illustrativ", placement: "Lår", palette: "blackgrey", meta: "4 ØKTER", ratio: "3:4", alt: "Illustrativt arbeid på lår", year: "2024" },
];

export const stabukkPortfolioStyles = [
  "Alle",
  "Blackwork",
  "Ornamental",
  "Fineline",
  "Illustrativ",
  "Farge",
] as const;

export const stabukkToConfirm = [
  { field: "Tatovørens/tatovørenes navn og stilarter", why: "Uten et navn har siden ingen person å bygge tillit rundt. Dette er den viktigste manglende opplysningen." },
  { field: "Studioets historie — når startet dere, og hvorfor", why: "To–tre setninger fra dere selv erstatter det katalogsidene ellers finner på." },
  { field: "Telefonnummer og e-postadresse", why: "NAP-konsistens. Må være identisk på nettsted, Google-profil og alle katalogoppføringer." },
  { field: "Instagram- og Facebook-konto", why: "Går i `sameAs`. Vi har bevisst latt være å lenke til @stabukk_olden — den ser ut til å tilhøre et annet sted." },
  { field: "Bekreftelse på åpningstidene man–fre 10–16", why: "Ligger allerede i strukturerte data på demoen. Må stemme med Google-profilen." },
  { field: "Timepris, minstepris og depositum", why: "«Hva koster tatovering» er et av de mest kjøpsklare søkene i markedet." },
  { field: "Ventetid / hvor langt fram dere booker", why: "Brukes som ærlig forventningsstyring, og gjør at færre gir opp underveis." },
  { field: "Om dere tar cover-ups og retusj av andres arbeid", why: "Egen søkeintensjon som ingen i Tønsberg svarer på i dag." },
  { field: "Medlemskap i Norsk Tattoo Union eller tilsvarende", why: "Vises som merke hos to konkurrenter. Hevdes ikke uten bekreftelse." },
  { field: "15–30 bilder av eget arbeid i høy oppløsning", why: "Arbeidene er hele produktet på denne siden. Alle plater står tomme til dette foreligger." },
  { field: "Er dere ett studio eller flere tatovører?", why: "Avgjør om vi bygger én profil eller egne sider per tatovør — det er en arkitekturbeslutning, ikke en designdetalj." },
] as const;
