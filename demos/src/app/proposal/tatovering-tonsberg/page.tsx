import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "../proposal.css";
import { ClientTabs, type ClientBlock } from "@/components/proposal/ClientTabs";
import { eikToConfirm } from "@/data/eik";
import { stabukkToConfirm } from "@/data/stabukk";
import { pageMetadata } from "@/lib/seo";

const sans = IBM_Plex_Sans({
  variable: "--font-tsp",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-tsp-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Internal sales document — must never be indexed. */
export const metadata = pageMetadata({
  title: "Forslag — nettsted og kundesystem | Tycho Systems",
  description: "Internt salgsunderlag for Tycho Systems. Ikke for publisering.",
  path: "/proposal",
  siteName: "Tycho Systems",
  noindex: true,
});

const SECTIONS = [
  { n: "01", id: "situasjon", title: "Dagens situasjon" },
  { n: "02", id: "mulighet", title: "Muligheten" },
  { n: "03", id: "konkurrenter", title: "Konkurransebildet" },
  { n: "04", id: "opplevelse", title: "Foreslått opplevelse" },
  { n: "05", id: "kundereise", title: "Kundereisen" },
  { n: "06", id: "system", title: "Nettstedet som system" },
  { n: "07", id: "automatisering", title: "Automatiseringsmuligheter" },
  { n: "08", id: "leveranse", title: "Hva Tycho Systems ville gjort" },
  { n: "09", id: "neste", title: "Neste steg" },
];

const CLIENTS: ClientBlock[] = [
  {
    slug: "eik",
    name: "Eik Tattoo & Piercing",
    address: "Eikveien 64a, 3122 Tønsberg",
    demoHref: "/eik",
    situation: [
      "Ingen egen nettside. Alt kunden finner om studioet er skrevet av andre.",
      "To ulike bransjekataloger beskriver studioet på måter som motsier hverandre — den ene på tydelig maskingenerert norsk.",
      "Kundedialogen ser ut til å gå gjennom Instagram-meldinger, uten struktur eller historikk.",
      "Ingen sted der pris, aldersgrense, tilhelingstid eller ventetid er besvart.",
    ],
    strengths: [
      "5,0 i snitt på Google — ingen dårlige vurderinger.",
      "Piercing i selve navnet, i et marked der markedslederen ikke tilbyr piercing i det hele tatt.",
      "Personlig oppfølging framheves i vurderingene — det er en reell forskjell, ikke markedsføring.",
    ],
    gaps: [
      "Ingen søkbar tilstedeværelse på «tatovering Tønsberg» eller «piercing Tønsberg».",
      "Ingen strukturert måte å ta imot en henvendelse på.",
      "Ingen synlig portefølje utenfor Instagram.",
      "Ingen kontroll over egen beskrivelse i søkeresultatene.",
    ],
    toConfirm: eikToConfirm,
  },
  {
    slug: "stabukk",
    name: "Stabukk Tattoo Studio",
    address: "Møllegaten 4, 3111 Tønsberg",
    demoHref: "/stabukk",
    situation: [
      "Ingen egen nettside, og praktisk talt ingen indeksert informasjon om studioet i det hele tatt.",
      "Studioet mangler i bransjekatalogene som ellers lister alle tatovører i Tønsberg.",
      "Konkurrenter med færre vurderinger rangerer høyere — utelukkende fordi de har sider som finnes.",
      "Ingen offentlig informasjon om hvem som tatoverer, hvilke stilarter, eller hva det koster.",
    ],
    strengths: [
      "5,0 i snitt på Google.",
      "Adresse midt i Tønsberg sentrum — markedslederen er selv uklar på om den holder til i Tønsberg eller på Nøtterøy.",
      "Hverdagsåpent 10–16 leser som atelier, ikke walk-in-butikk. Det er en posisjon, ikke en begrensning.",
    ],
    gaps: [
      "Ingen synlighet overhodet på lokale søk.",
      "Ingen portefølje tilgjengelig utenfor sosiale medier.",
      "Ingen måte for en interessert kunde å ta kontakt strukturert.",
      "Ingen navn knyttet til studioet offentlig — det svekker tillit før første kontakt.",
    ],
    toConfirm: stabukkToConfirm,
  },
];

const COMPETITORS = [
  {
    name: "Sniki Art",
    position: "Markedsleder. Kollektiv med gjestetatovører, siden 2018.",
    strength: "Egen side og eget skjema per tatovør. Sterkeste vurderingsvolum.",
    weakness: "To ulike adresser oppgitt på nett. To domener indeksert samtidig.",
  },
  {
    name: "Alien's Tattoo",
    position: "Best utførte tradisjonelle nettside i markedet.",
    strength: "Navngitte tatovører, vurderinger, unionsmerke, etterbehandling, god norsk tone.",
    weakness: "Alt ligger på én side. Kan ikke rangere på tjeneste- eller stilspesifikke søk.",
  },
  {
    name: "Art & Tattoo Studio Z",
    position: "Lang fartstid, dypt portefølje-arkiv 2020–2025.",
    strength: "Høy troverdighet: unionsmedlem, 26 års dokumentert erfaring.",
    weakness: "Booking kun via e-post. Utdatert design, svak mobil, tynn metadata.",
  },
  {
    name: "Retrospect Tattoo",
    position: "Registrert 2022, sentralt i Tønsberg.",
    strength: "Reell, etablert konkurrent med fysisk lokale i sentrum.",
    weakness: "Domenet svarte ikke da vi undersøkte. Tilstedeværelsen er i praksis Facebook.",
  },
];

const JOURNEY = [
  {
    n: "01",
    stage: "Oppdager",
    now: "Ser et bilde på Instagram. Ingen kontekst, ingen pris, ingen adresse.",
    next: "Kommer til en side som svarer på hvor, hva og omtrent hva det koster.",
  },
  {
    n: "02",
    stage: "Bygger tillit",
    now: "Må lete etter vurderinger selv, i Google Maps eller på Facebook.",
    next: "Ser arbeider, navngitte tatovører og vurderinger på samme side.",
  },
  {
    n: "03",
    stage: "Utforsker arbeid",
    now: "Scroller en Instagram-feed uten filtrering eller merking.",
    next: "Filtrerer på stil og plassering, ser tidsbruk per arbeid.",
  },
  {
    n: "04",
    stage: "Forstår prosessen",
    now: "Vet ikke hva som skjer, hva det koster, eller om idéen i det hele tatt er mulig.",
    next: "Leser fem steg fra idé til ferdig, og hva som avgjør prisen.",
  },
  {
    n: "05",
    stage: "Sender idé",
    now: "Skriver «hei, hva koster en tatovering?» i en DM. Så begynner runddansen.",
    next: "Fyller ut et skjema med motiv, størrelse, plassering, farge og referanser.",
  },
  {
    n: "06",
    stage: "Booker",
    now: "Seks til ti meldinger senere settes kanskje en time.",
    next: "Får ett svar med forslag, prisramme og ledige tider.",
  },
];

const PIPELINE = [
  { phase: "1", label: "Nettsted", note: "Sider, portefølje, innhold" },
  { phase: "1", label: "Lead-fangst", note: "Strukturert forespørsel" },
  { phase: "1", label: "Varsling", note: "E-post til studioet" },
  { phase: "2", label: "CRM", note: "Kundekort og historikk" },
  { phase: "2", label: "Kvittering", note: "Automatisk svar til kunden" },
  { phase: "2", label: "Booking", note: "Kalender og depositum" },
  { phase: "2", label: "Påminnelse", note: "Færre no-shows" },
  { phase: "2", label: "Etterbehandling", note: "Automatisk oppfølging" },
  { phase: "2", label: "Vurdering", note: "Forespørsel etter tilheling" },
];

export default function ProposalPage() {
  return (
    <div className={`tsp ${sans.variable} ${mono.variable}`}>
      <a className="skip-link" href="#dok">
        Hopp til innhold
      </a>

      <header className="tsp-cover">
        <div className="tsp-shell">
          <p className="tsp-mono">Tycho Systems · Konseptforslag · Konfidensielt</p>
          <h1>
            Nettsted, lead-fangst og et kundesystem som tåler å vokse — for tatoveringsstudioer i
            Tønsberg.
          </h1>
          <p className="lead">
            To studioer med toppvurderinger og null synlighet. Dette dokumentet viser hva som
            faktisk mangler, hva konkurrentene gjør og ikke gjør, og hva vi ville bygget først.
          </p>

          <div className="tsp-cover__meta">
            <span className="tsp-mono">Utarbeidet 20-08-2026</span>
            <span className="tsp-mono">Marked: Tønsberg / Vestfold</span>
            <span className="tsp-mono">Studioer kartlagt: 8</span>
          </div>

          <nav className="tsp-toc" aria-label="Innhold">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                <span className="tsp-mono">{s.n}</span>
                <span>{s.title}</span>
                <span className="tsp-mono">→</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="dok">
        {/* 01 */}
        <section className="tsp-section" id="situasjon">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">01 — Dagens situasjon</p>
              <h2>Andre eier fortellingen om virksomheten deres.</h2>
              <p className="tsp-body">
                Ingen av de to studioene har egen nettside. Det betyr ikke bare at de er usynlige
                i søk — det betyr at det en potensiell kunde leser om dem, er skrevet av
                katalogsider som tjener penger på trafikken, ikke av studioet.
              </p>
            </div>
            <ClientTabs clients={CLIENTS} />
          </div>
        </section>

        {/* 02 */}
        <section className="tsp-section" id="mulighet">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">02 — Muligheten</p>
              <h2>Fire hull som ingen i Tønsberg har tettet.</h2>
              <p className="tsp-body">
                Vi kartla åtte tatoveringsvirksomheter i og rundt Tønsberg. Mønsteret var
                påfallende likt hos alle.
              </p>
            </div>

            <div className="tsp-cards tsp-cards--2">
              <div className="tsp-card">
                <p className="tsp-mono">Hull 01</p>
                <h3>Ingen samler inn en brief</h3>
                <p className="tsp-body">
                  Alle bookingskjemaer i markedet samler inn <strong>hvem du er</strong>. Ingen
                  samler inn <strong>hva du vil ha</strong>. Derfor betaler hvert eneste studio
                  samme avgift: et titalls meldinger per henvendelse før en time kan settes.
                </p>
              </div>
              <div className="tsp-card">
                <p className="tsp-mono">Hull 02</p>
                <h3>Ingen har egne tjeneste- eller stilsider</h3>
                <p className="tsp-body">
                  De ledende sidene er én-sidere. «Piercing Tønsberg», «cover-up tatovering
                  Tønsberg» og «første tatovering» står i praksis ubesatt.
                </p>
              </div>
              <div className="tsp-card">
                <p className="tsp-mono">Hull 03</p>
                <h3>Ingen bruker strukturerte data</h3>
                <p className="tsp-body">
                  Ingen LocalBusiness-oppmerking, ingen åpningstider i markup, ingen
                  FAQ-oppmerking noe sted i markedet. Hele flaten for rike søkeresultater står
                  tom.
                </p>
              </div>
              <div className="tsp-card">
                <p className="tsp-mono">Hull 04</p>
                <h3>Ingen er art direction-drevet</h3>
                <p className="tsp-body">
                  I en bransje der produktet <em>er</em> visuell smak, viser ingen av nettsidene
                  visuell smak. Det er en uvanlig stor åpning for et studio som tør å se
                  annerledes ut.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 */}
        <section className="tsp-section" id="konkurrenter">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">03 — Konkurransebildet</p>
              <h2>Hva de sterkeste faktisk gjør.</h2>
            </div>

            <div className="tsp-tablewrap">
              <table className="tsp-table">
                <thead>
                  <tr>
                    <th scope="col">Aktør</th>
                    <th scope="col">Posisjon</th>
                    <th scope="col">Styrke</th>
                    <th scope="col">Svakhet vi kan bruke</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{c.position}</td>
                      <td className="tsp-yes">{c.strength}</td>
                      <td className="tsp-no">{c.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="tsp-body" style={{ marginTop: "1.5rem" }}>
              Full gjennomgang med kilder ligger i <code>research/competitive-analysis.md</code>.
              Merk at flere av opplysningene om studioene sirkulerer på katalogsider som
              publiserer maskingenerert innhold — vi har markert hva som er verifisert og hva som
              ikke er det.
            </p>
          </div>
        </section>

        {/* 04 */}
        <section className="tsp-section" id="opplevelse">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">04 — Foreslått opplevelse</p>
              <h2>To studioer, to helt forskjellige nettsteder.</h2>
              <p className="tsp-body">
                Vi bygger ikke samme mal to ganger. De to demoene deler ingen visuell logikk —
                ikke bakgrunn, ikke typografi, ikke rutenett, ikke bevegelse, ikke
                porteføljeform.
              </p>
            </div>

            <div className="tsp-cards tsp-cards--2">
              <div className="tsp-card">
                <p className="tsp-mono">Eik — Skin / Steel / Ink</p>
                <h3>Rolig, lyst, presist</h3>
                <p className="tsp-body">
                  Beinhvit bakgrunn, redaksjonell antikva, hårfine linjer og et
                  datablad-aktig system av nummererte steg. Retter seg mot
                  førstegangskunden: en lys, ryddig side svarer på hygienespørsmålet før teksten
                  rekker å gjøre det.
                </p>
                <Link href="/eik" className="tsp-btn tsp-btn--line" style={{ marginTop: "0.5rem" }}>
                  Se demoen →
                </Link>
              </div>
              <div className="tsp-card">
                <p className="tsp-mono">Stabukk — Plate / Press / Skin</p>
                <h3>Svart, stort, redaksjonelt</h3>
                <p className="tsp-body">
                  Trykksverte, kolossal bred grotesk, asymmetrisk rutenett og arbeider
                  presentert som nummererte plater i en kunstkatalog. Retter seg mot den erfarne
                  kunden som velger etter smak — og gjør at et lite innholdsgrunnlag leser som
                  redaksjonell tilbakeholdenhet framfor en tom side.
                </p>
                <Link href="/stabukk" className="tsp-btn tsp-btn--line" style={{ marginTop: "0.5rem" }}>
                  Se demoen →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 05 */}
        <section className="tsp-section" id="kundereise">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">05 — Kundereisen</p>
              <h2>Fra Instagram til avtalt time.</h2>
              <p className="tsp-body">
                Samme kunde, samme interesse — forskjellen ligger i hvor mye friksjon som står
                mellom nysgjerrighet og henvendelse.
              </p>
            </div>

            <div className="tsp-journey">
              <div className="tsp-journey__row">
                <span className="tsp-mono">#</span>
                <span className="tsp-mono">Steg</span>
                <span className="tsp-mono">I dag</span>
                <span className="tsp-mono">Med nettstedet</span>
              </div>
              {JOURNEY.map((row) => (
                <div className="tsp-journey__row" key={row.n}>
                  <span className="tsp-mono">{row.n}</span>
                  <strong>{row.stage}</strong>
                  <span className="tsp-journey__now">{row.now}</span>
                  <span className="tsp-journey__next">{row.next}</span>
                </div>
              ))}
            </div>

            <p className="tsp-body" style={{ marginTop: "1.5rem" }}>
              Vi lover ingen prosenter. Poenget er enklere enn som så:{" "}
              <strong>
                å fjerne friksjon mellom det å oppdage studioet og det å starte en samtale
              </strong>
              , og å flytte den samtalen fra en innboks til et system.
            </p>
          </div>
        </section>

        {/* 06 */}
        <section className="tsp-section" id="system">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">06 — Nettstedet som system</p>
              <h2>Nettsiden er bare den delen kunden ser.</h2>
              <p className="tsp-body">
                Bak den ligger den delen som faktisk sparer tid. Vi bygger fase 1 slik at fase 2
                kan kobles på uten at noe må bygges om.
              </p>
            </div>

            <div className="tsp-pipe">
              {PIPELINE.map((node) => (
                <div key={node.label} className="tsp-pipe__node" data-phase={node.phase}>
                  <b>{node.label}</b>
                  <span>{node.note}</span>
                  <span className="tsp-mono">Fase {node.phase}</span>
                </div>
              ))}
            </div>

            <div className="tsp-cards tsp-cards--2" style={{ marginTop: "2rem" }}>
              <div className="tsp-phase tsp-phase--1">
                <div className="tsp-phase__head">
                  <p className="tsp-mono">Fase 1</p>
                  <h3>Nettsted og konverteringssystem</h3>
                </div>
                <div className="tsp-phase__body">
                  <ul className="tsp-list tsp-list--check">
                    <li><span>Egne sider per tjeneste, med egen tittel og eget innhold</span></li>
                    <li><span>Strukturert portefølje med filtrering og fullskjermvisning</span></li>
                    <li><span>Forespørselsskjema som samler inn en reell brief</span></li>
                    <li><span>Lokal SEO: metadata, strukturerte data, sitemap, NAP-konsistens</span></li>
                    <li><span>Innhold om prosess, etterbehandling, pris og aldersgrense</span></li>
                    <li><span>Mobilførst, WCAG AA, rask lasting</span></li>
                    <li><span>Varsling på e-post når en forespørsel kommer inn</span></li>
                  </ul>
                </div>
              </div>

              <div className="tsp-phase">
                <div className="tsp-phase__head">
                  <p className="tsp-mono">Fase 2 — valgfri</p>
                  <h3>Kunde- og lead-automatisering</h3>
                </div>
                <div className="tsp-phase__body">
                  <ul className="tsp-list">
                    <li><span>CRM med kundekort, historikk og referansebilder på saken</span></li>
                    <li><span>Automatisk kvittering til kunden med forventet svartid</span></li>
                    <li><span>Ruting av forespørsel til riktig tatovør eller kø</span></li>
                    <li><span>Kalender, depositum og avbestillingsregler</span></li>
                    <li><span>Påminnelse før time — direkte mot no-shows</span></li>
                    <li><span>Automatisk etterbehandlingsoppfølging etter to uker</span></li>
                    <li><span>Forespørsel om Google-vurdering når arbeidet er grodd</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 */}
        <section className="tsp-section" id="automatisering">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">07 — Automatiseringsmuligheter</p>
              <h2>Der tiden faktisk forsvinner i dag.</h2>
            </div>

            <div className="tsp-cards tsp-cards--3">
              <div className="tsp-card">
                <h3>Runddansen i DM</h3>
                <p className="tsp-body">
                  Motiv, størrelse, plassering, farge, referanser og ledig tid samles inn én
                  melding av gangen. Skjemaet henter alt i ett steg — og fordi svarene er faste
                  valg, kan de sorteres og rutes automatisk.
                </p>
              </div>
              <div className="tsp-card">
                <h3>Ingen oversikt over henvendelser</h3>
                <p className="tsp-body">
                  Ingen vet hvor mange som spurte i forrige måned, hva de spurte om, eller hvor
                  mange som aldri fikk svar. Strukturerte forespørsler gir det tallet uten ekstra
                  arbeid.
                </p>
              </div>
              <div className="tsp-card">
                <h3>Vurderinger som aldri blir bedt om</h3>
                <p className="tsp-body">
                  Begge studioer har 5,0 — og henholdsvis fire og to vurderinger. En automatisk
                  forespørsel når arbeidet er grodd er den billigste veksten som finnes for et
                  lokalt studio.
                </p>
              </div>
              <div className="tsp-card">
                <h3>No-shows og avbestillinger</h3>
                <p className="tsp-body">
                  Depositumsregler og automatisk påminnelse fjerner den vanskeligste samtalen fra
                  tatovøren og legger den i systemet.
                </p>
              </div>
              <div className="tsp-card">
                <h3>Etterbehandling som spørsmål</h3>
                <p className="tsp-body">
                  De samme spørsmålene stilles etter hver eneste time. En automatisk melding
                  etter to uker svarer på dem før de blir stilt.
                </p>
              </div>
              <div className="tsp-card">
                <h3>Ingen kanalinnsikt</h3>
                <p className="tsp-body">
                  Skjemaet fanger kilde og kampanjeparametre, slik at studioet endelig kan se om
                  det er Instagram eller Google som gir timer — ikke bare klikk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 08 */}
        <section className="tsp-section" id="leveranse">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">08 — Hva Tycho Systems ville gjort</p>
              <h2>Arbeidet, i rekkefølge.</h2>
            </div>

            <div className="tsp-journey">
              {[
                ["01", "Innhentingsmøte", "Én time. Vi går gjennom listen over opplysninger vi mangler, og henter inn bilder av eget arbeid."],
                ["02", "Innhold og struktur", "Sidekart, tekst på norsk, tjenestesider, etterbehandling, spørsmål og svar."],
                ["03", "Design og bygg", "Egen art direction per studio. Ingen mal gjenbrukes."],
                ["04", "Teknisk SEO", "Metadata, strukturerte data, sitemap, robots, ytelse, tilgjengelighet."],
                ["05", "Skjema og varsling", "Forespørselsskjema i drift, med e-postvarsel til studioet."],
                ["06", "Google-profil", "Kategorier, åpningstider, tjenester og lenke rettet opp mot nettstedet."],
                ["07", "Katalogopprydding", "Samme navn, adresse og telefon overalt. Feilaktige oppføringer korrigeres."],
                ["08", "Overlevering", "Dere kan oppdatere portefølje og tekst selv. Vi drifter og følger opp."],
              ].map(([n, title, body]) => (
                <div className="tsp-journey__row" key={n}>
                  <span className="tsp-mono">{n}</span>
                  <strong>{title}</strong>
                  <span className="tsp-body" style={{ gridColumn: "span 2" }}>
                    {body}
                  </span>
                </div>
              ))}
            </div>

            <p className="tsp-body" style={{ marginTop: "1.5rem" }}>
              Fase 2 settes i gang først når fase 1 har vært i drift lenge nok til at vi vet hvor
              volumet faktisk ligger. Å automatisere en prosess ingen har målt, er å bygge feil
              ting raskt.
            </p>
          </div>
        </section>

        {/* 09 */}
        <section className="tsp-section" id="neste">
          <div className="tsp-shell">
            <div className="tsp-section__head">
              <p className="tsp-mono">09 — Neste steg</p>
              <h2>Ett møte, én liste, én beslutning.</h2>
            </div>

            <div className="tsp-next">
              <ol className="tsp-list" style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <span>
                    <strong>Se demoen sammen.</strong> Femten minutter på telefon eller skjerm.
                    Dere sier hva som stemmer og hva som ikke stemmer om studioet.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Fyll ut listen.</strong> Alt vi mangler står i seksjon 01. Ingenting
                    er diktet opp i demoen — feltene står åpne til dere fyller dem.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Send oss arbeidene deres.</strong> 20–40 bilder i god oppløsning.
                    Porteføljen er produktet; alt annet er innramming.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Så gir vi et fastpristilbud på fase 1.</strong> Fase 2 er valgfri, og
                    tas først når fase 1 er i drift.
                  </span>
                </li>
              </ol>

              <div className="tsp-actions">
                <Link href="/eik?demo=true" className="tsp-btn">
                  Åpne Eik-demoen
                </Link>
                <Link href="/stabukk?demo=true" className="tsp-btn tsp-btn--line">
                  Åpne Stabukk-demoen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="tsp-foot">
        <div className="tsp-shell" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 2rem", justifyContent: "space-between", width: "100%" }}>
          <span className="tsp-mono">Tycho Systems · Konseptforslag</span>
          <span className="tsp-mono">Ikke publisert · noindex</span>
          <span className="tsp-mono">Utarbeidet 20-08-2026</span>
        </div>
      </footer>
    </div>
  );
}
