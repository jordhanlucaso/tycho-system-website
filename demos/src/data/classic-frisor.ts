/**
 * Classic Frisør — business data.
 *
 * Almost nothing about this salon is verified, and the data model says so rather than
 * papering over it. Every value is either checked against a primary source and dated, or it
 * is `TO_CONFIRM` — a Symbol, so it cannot be interpolated into copy or serialised into
 * JSON-LD by accident.
 *
 * The identity question is unresolved and is the largest single risk in the project:
 * Enhetsregisteret shows one hairdresser at Smidsrødveien 15 (a sole proprietorship named
 * SAEED, registered 08-10-2024) and a separate CLASSICFRISØR AS in Tønsberg with no Nøtterøy
 * sub-unit. We do not know which — if either — trades as the Google listing.
 *
 * See engagements/classic-frisor/research/classic-frisor-research.md §1.
 */

import { TO_CONFIRM, type Maybe } from "./types";

export interface Treatment {
  id: string;
  /** Customer-facing name, in the words a customer would use. */
  name: string;
  /** Which group it belongs to on /behandlinger. */
  group: "klipp" | "farge" | "styling";
  /**
   * `demo`       — illustrative concept copy. Rendered, but always visibly marked as such.
   * `to-confirm` — never rendered as an offering.
   */
  status: "confirmed" | "demo" | "to-confirm";
  /** Minutes. Unknown is honest; a guessed duration wastes a customer's lunch break. */
  minutes: Maybe<number>;
  /** NOK, "from" price. */
  fromPrice: Maybe<number>;
  blurb: string;
}

export interface Stylist {
  id: string;
  name: Maybe<string>;
  role: Maybe<string>;
  /** Never written by us. Only ever the stylist's own words, with consent. */
  bio: Maybe<string>;
  photo: string;
}

export interface OpenQuestion {
  field: string;
  why: string;
  /** Cross-reference into research/questions-for-owner.md */
  question: string;
  impact: "høy" | "middels" | "lav";
}

/**
 * Booking. The realistic Norwegian options are Fixit, Timma, a social DM flow, or the phone.
 *
 * We do not know which is in use, so the site does not assume. `provider` stays TO_CONFIRM
 * and the phone is the primary action — which is correct on day one and stays correct after
 * an integration, because the bar keeps both.
 */
export interface BookingProvider {
  name: string;
  bookingUrl: string;
  supportsStylistSelection: boolean;
}

export const booking: {
  provider: Maybe<BookingProvider>;
  phoneIsPrimary: boolean;
} = {
  provider: TO_CONFIRM,
  phoneIsPrimary: true,
};

export const salon = {
  /** The name as it should be presented. Place-led — see local-seo-strategy.md §1. */
  displayName: "Classic Frisør",
  place: "Teie",
  municipality: "Nøtterøy",

  /**
   * TO_CONFIRM_LEGAL_ENTITY. Two candidates, neither confirmed:
   *   SAEED (ENK, 934 237 498)   — the only hairdresser registered at Smidsrødveien 15
   *   CLASSICFRISØR AS (927 208 601) — Tønsberg, no registered Nøtterøy presence
   */
  legalEntity: TO_CONFIRM as Maybe<string>,
  orgNumber: TO_CONFIRM as Maybe<string>,

  /** `[W]` The Google listing shows this. A listing is not a primary source. */
  address: TO_CONFIRM as Maybe<string>,
  phoneDisplay: TO_CONFIRM as Maybe<string>,
  phoneE164: TO_CONFIRM as Maybe<string>,
  email: TO_CONFIRM as Maybe<string>,
  openingHours: TO_CONFIRM as Maybe<string>,

  /** `[V]` Enhetsregisteret: six hairdressing units are registered on this street. */
  streetSalonCount: 6,
} as const;

/**
 * Treatments.
 *
 * NOT ONE of these is confirmed. They are marked `demo` so the concept can show the shape of
 * the page, and every one renders inside a visibly-labelled demo band. Nothing here reaches
 * JSON-LD, and nothing here is presented as something the salon offers.
 *
 * The brief listed these as examples explicitly *not* verified. That is honoured literally.
 */
export const treatments: Treatment[] = [
  { id: "dameklipp", name: "Dameklipp", group: "klipp", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Klipp, vask og føn." },
  { id: "herreklipp", name: "Herreklipp", group: "klipp", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Klipp og styling." },
  { id: "barneklipp", name: "Barneklipp", group: "klipp", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "For de under tolv." },
  { id: "helfarge", name: "Helfarge", group: "farge", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Farge i hele lengden." },
  { id: "ettervekst", name: "Ettervekst", group: "farge", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Farge på utvekst." },
  { id: "striper", name: "Striper", group: "farge", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Folie eller hette." },
  { id: "balayage", name: "Balayage", group: "farge", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Malt overgang, mykere ettervekst." },
  { id: "toning", name: "Toning", group: "farge", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Justerer tone og glans." },
  { id: "styling", name: "Styling", group: "styling", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Vask, føn og legg." },
  { id: "kur", name: "Kur", group: "styling", status: "demo", minutes: TO_CONFIRM, fromPrice: TO_CONFIRM, blurb: "Pleie for tørt eller behandlet hår." },
];

export const treatmentGroups = [
  { id: "klipp", label: "Klipp" },
  { id: "farge", label: "Farge" },
  { id: "styling", label: "Styling og pleie" },
] as const;

/** No stylist is confirmed. The page renders the shape and the gap, never a person. */
export const stylists: Stylist[] = [
  { id: "s1", name: TO_CONFIRM, role: TO_CONFIRM, bio: TO_CONFIRM, photo: "CLIENT_PHOTO_STYLIST" },
];

export const processSteps = [
  { n: "01", title: "Finn behandlingen", body: "Se hva som kan bestilles, hvor lang tid det tar og hva det koster." },
  { n: "02", title: "Velg tidspunkt", body: "Bestill på nett hvis du vil, eller ring hvis det er enklere." },
  { n: "03", title: "Kom innom", body: "Smidsrødveien på Teie. Vi går gjennom hva du vil ha før vi begynner." },
  { n: "04", title: "Sett opp neste", body: "De fleste vet omtrent når de trenger neste time. Da tar vi den med en gang." },
] as const;

/** Photo briefs for the gallery — see content/photo-shot-list.md. */
export const workBriefs = [
  { id: "w1", brief: "Ferdig klipp bakfra, dagslys", ratio: "4:5" as const, token: "CLIENT_PHOTO_CUT" },
  { id: "w2", brief: "Hårtekstur tett på — bevegelse og glans", ratio: "1:1" as const, token: "CLIENT_PHOTO_TEXTURE" },
  { id: "w3", brief: "Hender som klipper", ratio: "4:5" as const, token: "CLIENT_PHOTO_HANDS" },
  { id: "w4", brief: "Fargearbeid — kun hvis farge bekreftes", ratio: "4:5" as const, token: "CLIENT_PHOTO_COLOR_WORK" },
  { id: "w5", brief: "Før og etter, samme lys og vinkel", ratio: "1:1" as const, token: "CLIENT_PHOTO_BEFORE_AFTER" },
  { id: "w6", brief: "Vaskestasjonen", ratio: "4:5" as const, token: "CLIENT_PHOTO_WASH" },
] as const;

export const openQuestions: OpenQuestion[] = [
  { field: "Juridisk enhet", why: "Vi finner ett foretak på adressen og ett med navnet i Tønsberg. Vi publiserer ikke feil selskap.", question: "1.1", impact: "høy" },
  { field: "Åpningstider", why: "Kreves for Google-profilen. Feil tider er den vanligste kilden til dårlige anmeldelser i bransjen.", question: "2.4", impact: "høy" },
  { field: "Telefonnummer", why: "Hele bookingveien går gjennom det i dag.", question: "2.2", impact: "høy" },
  { field: "Behandlingsliste", why: "Avgjør hvilke sider som kan lages og hva som kan bestilles.", question: "4.1", impact: "høy" },
  { field: "Priser", why: "Ingen konkurrent på gaten publiserer pris. Det er den enkleste fordelen som finnes.", question: "4.2", impact: "høy" },
  { field: "Bookingsystem", why: "Vi bygger ikke noe du allerede har. Har du Fixit eller Timma, kobler vi til det.", question: "5.1", impact: "høy" },
  { field: "Hvem jobber her", why: "I en liten salong er personen hele tillitshistorien. Vi dikter ikke opp navn.", question: "3.2", impact: "høy" },
  { field: "Bilder og samtykke", why: "Ekte bilder av eget arbeid er den sterkeste konverteringsressursen som finnes.", question: "6.4–6.6", impact: "høy" },
  { field: "Farge", why: "Halve behandlingssiden og hele påminnelses-logikken avhenger av om dere farger.", question: "4.1", impact: "middels" },
  { field: "Navn utad", why: "Tre virksomheter deler navnet. Vi anbefaler å lede med sted.", question: "1.4", impact: "middels" },
  { field: "Konsultasjon", why: "Avgjør om vi bygger et eget skjema for store fargejobber.", question: "4.7", impact: "middels" },
  { field: "Gavekort", why: "Nevnes ikke før det er bekreftet.", question: "4.9", impact: "lav" },
];
