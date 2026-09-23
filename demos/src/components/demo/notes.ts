/**
 * Demo annotation content for every client concept on this host.
 *
 * Lives in its own module and is loaded with a dynamic `import()` from `DemoNote`, ONLY
 * when the layer is switched on.
 *
 * This is not tidiness — it is the requirement. When this text was passed as `children` to
 * the client `DemoNote` component, React serialised it into the RSC flight payload of every
 * page. It never rendered in the DOM, so a DOM-based test passed, but the prose shipped to
 * every visitor inside `self.__next_f.push(...)` and was fully readable in view-source.
 *
 * Keyed by id, the page HTML now carries only `<DemoNote id="…" />`, and this module is
 * fetched as a separate chunk that a normal visitor never requests. `scripts/qa.mjs`
 * asserts it against the raw served HTML, not against the DOM — the DOM is what missed it.
 *
 * Ids are namespaced per client (`cr.`, `eik.`, `sbk.`, `cf.`) so several concepts share one
 * registry without one client's annotation ever surfacing on another's page.
 *
 * They are deliberately opaque rather than slugified titles. The id is the one part of an
 * annotation that *has* to cross the RSC boundary, so it lands in the flight payload of
 * every page — and `eik.det-eneste-tillitssignalet-vi-kan` would put a readable fragment of
 * Tycho's sales commentary into view-source on the client's own site. The id only needs to
 * be stable; the readable form is the `title` field sitting right next to it.
 */

import type { DemoCategory } from "./DemoLayer";

export interface DemoNoteContent {
  category: DemoCategory;
  title: string;
  body: string;
}

export const DEMO_NOTES: Record<string, DemoNoteContent> = {

  /* ── Calloway Roofing ─────────────────────────────────────────────────────────── */
  "cr.01": {
    category: "konvertering",
    title: "Prisen for en time er ett telefonnummer",
    body:
      "Heltbildet har to handlinger og ingen tredje. Den som allerede har bestemt seg ringer; den som ikke har det, ber om befaring. Tillitsmerket under knappene bærer ett tall og ett stedsnavn — begge hentet fra konfigurasjonen, ikke skrevet inn i komponenten, nettopp fordi et tall som følger malen videre til neste kunde blir en løgn der.",
  },
  "cr.02": {
    category: "lead",
    title: "To felt, ikke tolv",
    body:
      "Kortet som overlapper heltbildet spør om adresse og telefon. Ingenting annet. Den som står med en lekkasje fyller ikke ut et skjema med ni felt på mobil — og alt annet kan spørres om i telefonen etterpå. Det lange skjemaet finnes fortsatt nederst, for den som vil skrive det ned selv.",
  },
  "cr.03": {
    category: "lokal-seo",
    title: "Én tjeneste, ett kort, én intensjon",
    body:
      "Seks tjenester med hver sin overskrift og to linjer tekst. Det er strukturen en søkemotor kan lese som seks separate tilbud, og strukturen en kunde kan skanne på fem sekunder. På en ekte kundeleveranse blir hvert kort sin egen landingsside med samme overskrift.",
  },
  "cr.04": {
    category: "tillit",
    title: "Én omtale som sier noe konkret",
    body:
      "Én omtale som nevner råte over verandaen slår ti som sier «kjempefornøyd». Stjernene er dekorative og merket som det for skjermlesere — det ligger ingen aggregateRating i strukturerte data, fordi en vurdering oppfunnet i en mal er et regelbrudd hos Google og en løgn hos kunden.",
  },
  "cr.05": {
    category: "automatisering",
    title: "Skjemaet er ferdig koblet, men ikke her",
    body:
      "I den ekte byggen validerer skjemaet i nettleseren, validerer igjen på serveren, og sendes videre til den adressen kunden oppgir — Zapier, Make, et CRM. På denne demoverten er det ingen mottaker, så skjemaet validerer og bekrefter lokalt: en salgsdemo har ingen forsvarlig plass å legge en ekte persons telefonnummer.",
  },

  /* ── Eik Tattoo & Piercing ───────────────────────────────────────────────────── */
  "eik.01": {
    category: "lokal-seo",
    title: "Navn er det sterkeste tillitssignalet",
    body:
      "Alien's Tattoo viser fire navngitte tatovører med hver sin Instagram. Sniki Art har egen side og eget skjema per tatovør. Så snart Eik gir oss navnene, er dette den enkeltendringen som løfter både tillit og synlighet mest.",
  },
  "eik.02": {
    category: "lead",
    title: "Brief, ikke bare kontaktinfo",
    body:
      "Alle bookingskjemaene vi fant i Tønsberg samler inn hvem du er. Ingen samler inn hva du vil ha. Det er derfor hver eneste henvendelse i dag koster studioet seks til ti meldinger før en time kan settes.",
  },
  "eik.03": {
    category: "konvertering",
    title: "Ett tydelig mål",
    body:
      "Én dominerende handling — send inn idéen. Alt annet på siden er visuelt underordnet. Konkurrentene har tre til fem likestilte knapper i toppen, og besøkende velger da ofte ingen av dem.",
  },
  "eik.04": {
    category: "konvertering",
    title: "Ærlig med få vurderinger",
    body:
      "Fire vurderinger er lite — men fire av fire på topp er sterkere enn det ser ut som, hvis du sier det høyt. Å skjule antallet leser kunden som juks. Å vise det med kontekst bygger tillit.",
  },
  "eik.05": {
    category: "lokal-seo",
    title: "Én søkeintensjon, én side",
    body:
      "Den største konkurrenten i Tønsberg har alt på én side. Da konkurrerer «tatovering Tønsberg» og «piercing Tønsberg» om den samme tittelen, og siden rangerer godt på ingen av dem. To sider er to sjanser.",
  },
  "eik.06": {
    category: "portefolje",
    title: "Strukturert portefølje",
    body:
      "Hvert arbeid har egne felter for stil, plassering, farge og tatovør. Det er det som gjør filtrering mulig i dag — og egne stilsider mulig i morgen, uten å bygge noe nytt.",
  },
  "eik.07": {
    category: "lokal-seo",
    title: "Hvorfor feltene står tomme",
    body:
      "Katalogsider på nett oppgir allerede navn på tatovører her — fra én kilde som også skriver feilstavet norsk. Vi gjengir ikke opplysninger studioet ikke har bekreftet. Strukturen står klar; innholdet fyller dere inn.",
  },
  "eik.08": {
    category: "lokal-seo",
    title: "NAP-konsistens",
    body:
      "Navn, adresse og telefon må være identiske på nettsted, Google-profil, Facebook og katalogsider. Ett avvik svekker den lokale rangeringen. Alt her leses fra én datakilde, slik at det aldri kan sprike.",
  },
  "eik.09": {
    category: "lokal-seo",
    title: "Uimotsagt søkeord",
    body:
      "Den største konkurrenten i markedet tilbyr ikke piercing i det hele tatt, og ingen andre har en egen piercingside. «Piercing Tønsberg» står praktisk talt åpent — og Eik har ordet i selve navnet sitt.",
  },
  "eik.10": {
    category: "portefolje",
    title: "Rammene er ekte, bildene kommer",
    body:
      "Vi bruker aldri konkurrenters bilder eller generiske arkivbilder i en demo. Hver ramme viser hvilken informasjon det ferdige bildet skal ha — stil, plassering og tidsbruk — slik at layouten er ferdig testet når bildene kommer inn.",
  },
  "eik.11": {
    category: "lokal-seo",
    title: "FAQ med strukturerte data",
    body:
      "Svarene merkes opp som FAQPage, slik at de kan vises direkte i Google. Vi merker bare opp de svarene studioet har godkjent — resten publiseres uten markup til de er bekreftet.",
  },
  "eik.12": {
    category: "konvertering",
    title: "Innvendingen ingen svarer på",
    body:
      "Ingen av studioene i Tønsberg snakker til førstegangskunden. Det er den største og mest usikre gruppen i markedet — og den som trenger mest hjelp for å tørre å ta kontakt.",
  },
  "eik.13": {
    category: "lokal-seo",
    title: "«Hva koster tatovering»",
    body:
      "Ingen av de åtte studioene vi kartla i Tønsberg oppgir pris noe sted. Det er et av de mest kjøpsklare søkene som finnes i bransjen, og det står helt åpent.",
  },
  "eik.14": {
    category: "konvertering",
    title: "Forgrening på første spørsmål",
    body:
      "Ett spørsmål avgjør hele resten av skjemaet. Piercingkunder ser aldri felter om størrelse, stilart eller referansebilder. Kortere skjema gir høyere fullføring — uten at studioet får mindre informasjon.",
  },
  "eik.15": {
    category: "lead",
    title: "Størrelse som valg, ikke fritekst",
    body:
      "«Ca. sånn her» kan ikke sorteres eller prises. Faste størrelsesintervaller kan. Det er dette som gjør at en henvendelse kan rutes automatisk til riktig svar senere.",
  },
  "eik.16": {
    category: "automatisering",
    title: "Bilder som del av henvendelsen",
    body:
      "I dag kommer referansebilder som løse DM-er uten kobling til noen sak. Her følger de saken fra første melding — og i fase 2 legges de rett i kundekortet.",
  },
  "eik.17": {
    category: "automatisering",
    title: "Dette er hele poenget",
    body:
      "Henvendelsen er allerede strukturert: type, størrelse, plassering, stil, tidsramme og kilde. I fase 2 går akkurat dette objektet rett inn i CRM, utløser en kvitterings-e-post, og legger seg i riktig kø — uten at noen har åpnet Instagram.",
  },

  /* ── Stabukk Tattoo Studio ───────────────────────────────────────────────────── */
  "sbk.01": {
    category: "portefolje",
    title: "Platene står klare",
    body:
      "Ingen konkurrent- eller arkivbilder brukes i en demo. Hver plate viser hvilken informasjon det ferdige bildet skal bære, slik at layouten er ferdig testet den dagen bildene kommer inn.",
  },
  "sbk.02": {
    category: "lokal-seo",
    title: "Kart og Google-profil hører sammen",
    body:
      "Åpningstidene på siden er merket opp i strukturerte data. De må stemme nøyaktig med Google-profilen — ellers svekker de hverandre i stedet for å forsterke.",
  },
  "sbk.03": {
    category: "lead",
    title: "Forespørsel, ikke kontaktskjema",
    body:
      "Ingen av bookingskjemaene vi kartla i Tønsberg spør hva kunden faktisk vil ha. Derfor koster hver eneste henvendelse studioet seks til ti meldinger før en time kan settes. Dette skjemaet flytter den jobben over på skjemaet.",
  },
  "sbk.04": {
    category: "konvertering",
    title: "Ett mål, ikke fem",
    body:
      "Studioet har ingen nettside i dag. Hele forskjellen mellom «fant dem på Instagram» og «sendte inn en forespørsel» ligger i denne ene knappen.",
  },
  "sbk.05": {
    category: "lokal-seo",
    title: "Hvorfor vi ikke har skrevet mer",
    body:
      "Det finnes praktisk talt ingen offentlig informasjon om Stabukk på nett. Vi dikter ikke opp historie, stilarter eller erfaring for å fylle en side. Det som står her, kan dere stå inne for.",
  },
  "sbk.06": {
    category: "portefolje",
    title: "Arbeidet er produktet",
    body:
      "Hver plate har egne felter for retning, plassering, tidsbruk og år. Det gir filtrering nå — og egne sider per stilart senere, uten at noe må bygges om.",
  },
  "sbk.07": {
    category: "lokal-seo",
    title: "NAP-konsistens",
    body:
      "Navn, adresse og telefon må stå identisk på nettsted, Google-profil og alle katalogsider. Den største konkurrenten i markedet oppgir to forskjellige adresser på nett — det svekker dem lokalt, og det er en åpning her.",
  },
  "sbk.08": {
    category: "lokal-seo",
    title: "Det viktigste som mangler",
    body:
      "Et navn er det sterkeste tillitssignalet en tatoveringsside kan ha. Alien's Tattoo viser fire navngitte tatovører med hver sin Instagram. Så snart vi får navn, er dette den enkeltendringen som løfter både tillit og synlighet mest.",
  },
  "sbk.09": {
    category: "lead",
    title: "Omfang som valg, ikke fritekst",
    body:
      "Faste intervaller kan sorteres, prises og rutes. «Ganske stor» kan ikke. Dette ene feltet avgjør om en henvendelse kan behandles automatisk senere.",
  },
  "sbk.10": {
    category: "automatisering",
    title: "Hva som skjer bak kulissene",
    body:
      "Forespørselen er allerede strukturert: omfang, plassering, retning, tidsramme og kilde. I fase 2 går den rett i kundekortet, kvitteringen sendes automatisk, og saken havner i riktig kø — uten at noen har åpnet en innboks.",
  },

  /* ── Classic Frisør ───────────────────────────────────────────────────────── */
  "cf.01": {
    category: "lokal-seo",
    title: "Stedet står før navnet",
    body:
      "Tre virksomheter i Norge heter Classic Frisør, og Askøy-salongen eier classic-frisor.no. Å slåss om merkenavnet er et tap i sakte film. «Frisør på Teie» er søket ingen eier, og det er søket der det å faktisk ligge i Smidsrødveien er en reell fordel.",
  },
  "cf.02": {
    category: "konvertering",
    title: "Pris er det ingen andre svarer på",
    body:
      "Ingen av de seks frisørene i Smidsrødveien publiserer pris. Det er spørsmålet kundene stiller mest og får svar på minst. Å svare offentlig koster ingenting og er den enkleste fordelen som finnes i dette markedet.",
  },
  "cf.03": {
    category: "tillit",
    title: "Én stol er et argument, ikke en unnskyldning",
    body:
      "Teie Barber Shop har sju ansatte. Trix har drevet siden 1998. Classic vinner ikke på størrelse eller fartstid. «Samme person klipper deg hver gang» er noe en kjede strukturelt ikke kan si.",
  },
  "cf.04": {
    category: "tillit",
    title: "Ærlige plassholdere, ikke lånte bilder",
    body:
      "Hver ramme sier hvilket bilde som skal tas. Vi henter ikke bilder fra konkurrenter eller bildebanker. En tom ramme med en bestilling i er mer verdt enn et bilde av en modell som aldri har vært i salongen.",
  },
  "cf.05": {
    category: "lokal-seo",
    title: "Seks frisører i én gate",
    body:
      "Enhetsregisteret viser seks frisørforetak i Smidsrødveien. Én av dem har nettside. Kartet gir kunden seks nåler uten noen måte å skille dem. Den som er lettest å forstå på ti sekunder vinner.",
  },
  "cf.06": {
    category: "konvertering",
    title: "Tid er like viktig som pris",
    body:
      "«90 minutter» avgjør om noen kan komme i lunsjen. Det er ofte det virkelige spørsmålet bak «hva koster det». Begge deler står ved hver behandling.",
  },
  "cf.07": {
    category: "tillit",
    title: "En liste over hull, midt på siden",
    body:
      "Å vise hva vi ikke vet er det som gjør resten troverdig. Alternativet er en side som ser ferdig ut og som kunden ikke kan etterprøve.",
  },
  "cf.08": {
    category: "konvertering",
    title: "Vi bygger ikke booking du allerede har",
    body:
      "Fixit og Timma er vanlige i norske salonger. Har salongen ett av dem, kobler vi knappen dit. Har den ikke det, er telefon hovedveien — og strukturen er klar den dagen det endrer seg.",
  },
  "cf.09": {
    category: "tillit",
    title: "Navn skrives ikke av oss",
    body:
      "Ingen ansatte er registrert på foretaket. I en liten salong er personen hele tillitshistorien, men et navn og et bilde krever samtykke. Så snart det foreligger, er dette den enkeltendringen som løfter tilliten mest.",
  },
  "cf.10": {
    category: "tillit",
    title: "Bildeplanen er en bestilling",
    body:
      "Fjorten bilder, én økt. Rammene er sortert etter hva som blokkerer mest: uten de fire første kan ikke siden åpne i det hele tatt.",
  },
  "cf.11": {
    category: "lokal-seo",
    title: "NAP før strukturerte data",
    body:
      "Navn, adresse og telefon må være tegn for tegn like på nettsiden, Google-profilen og i katalogene. Vi publiserer ingen HairSalon-markup før den juridiske enheten er avklart — feil data i strukturerte data er verre enn ingen.",
  },
};
