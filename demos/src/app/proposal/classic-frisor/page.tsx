import { openQuestions, salon } from "@/data/classic-frisor";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Forslag — Classic Frisør | Tycho Systems",
  description: "Internt salgsdokument for Classic Frisør. Ikke indeksert.",
  path: "/proposal/classic-frisor",
  siteName: "Classic Frisør",
  noindex: true,
});

function Del({
  n,
  tittel,
  children,
  dyp = false,
}: {
  n: string;
  tittel: string;
  children: React.ReactNode;
  dyp?: boolean;
}) {
  return (
    <section className={`cf-band${dyp ? " cf-band--dyp" : ""}`}>
      <div className="cf-shell">
        <p className="cf-eyebrow">{n}</p>
        <h2 className="cf-d2" style={{ marginBottom: "1.25rem" }}>
          {tittel}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Rad({ v, h }: { v: string; h: string }) {
  return (
    <li className="cf-pris">
      <span className="cf-pris__navn">{v}</span>
      <span className="cf-pris__belop">
        <span className="cf-data">{h}</span>
      </span>
    </li>
  );
}

export default function Proposal() {
  return (
    <>
      <section className="cf-band cf-band--dyp cf-band--flush">
        <div className="cf-shell">
          <p className="cf-eyebrow">Tycho Systems · Konseptforslag</p>
          <h1 className="cf-d1" style={{ marginTop: "1rem" }}>
            Classic Frisør
          </h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            Et forslag om å gjøre salongen i Smidsrødveien like lett å finne som den er å gå
            forbi — og like lett å bestille time hos.
          </p>
        </div>
      </section>

      <Del n="01" tittel="Dagens digitale situasjon">
        <p>
          Salongen har i dag en Google-oppføring og én anmeldelse. Ingen egen nettside. Alt
          en ny kunde kan finne ut på forhånd, er at det finnes en frisør på adressen.
        </p>
        <p>
          Det betyr at hvert eneste spørsmål — hva koster det, hvor lang tid tar det, hvem
          klipper meg, når har dere åpent — må stilles på telefon. Hver telefon er et avbrudd
          midt i en klipp, og hver kunde som ikke gidder å ringe, er en kunde du aldri
          hører om.
        </p>
      </Del>

      <Del n="02" tittel="Hvordan nye kunder søker" dyp>
        <p>
          En som nettopp har flyttet til Teie skriver «frisør Teie» eller «frisør Nøtterøy»
          på mobilen. Google svarer med et kart og en håndfull nåler.
        </p>
        <p>
          Da er valget avgjort av det som er lettest å forstå på ti sekunder: har de bilder,
          står prisene noe sted, ser det ut som noen har vært innom siden i år, og kan jeg
          bestille time uten å ringe.
        </p>
      </Del>

      <Del n="03" tittel="Konkurransen på Smidsrødveien">
        <p>
          Det er seks frisørforetak registrert i Smidsrødveien. Trix har drevet siden 1998,
          tre dører unna. Teie Barber Shop har sju ansatte, to dører unna.
        </p>
        <ul className="cf-prisliste" style={{ marginTop: "1.5rem" }}>
          <Rad v="Bibbis Frisør" h="Fire salonger · nettside · online booking" />
          <Rad v="Teie Barber Shop" h="Sju ansatte · nettside uten lesbart innhold" />
          <Rad v="Trix Frisør" h="Siden 1998 · ingen nettside funnet" />
          <Rad v="Le Monde Frisør" h="Ingen nettside funnet" />
          <Rad v="Harmony Hårpleie" h="Ingen nettside funnet" />
          <Rad v="Himmel og Hår" h="Ingen nettside funnet" />
        </ul>
        <p style={{ marginTop: "1.5rem" }}>
          Én av dem har en nettside som virkelig gjør jobben. Den nærmeste har en nettside
          som er tom uten JavaScript. Resten er usynlige utenfor kartet og nabopraten.
        </p>
        <p>
          <strong>Det er ikke mangel på frisører her. Det er mangel på frisører som er
          mulige å finne.</strong>
        </p>
      </Del>

      <Del n="04" tittel="Muligheten for Classic" dyp>
        <p>
          Classic kan ikke vinne på fartstid — Trix har tjueåtte år. Ikke på størrelse —
          barbershopen har sju ansatte. Ikke på bredde — Bibbis har tjue behandlinger og fire
          salonger.
        </p>
        <p className="cf-lead">
          Men Classic kan bli den salongen i gata som er lettest å finne, forstå og bestille
          time hos. Den plassen er ledig i dag.
        </p>
        <ul className="cf-prisliste" style={{ marginTop: "1.5rem" }}>
          <Rad v="Priser i klartekst" h="Ingen andre publiserer dem" />
          <Rad v="Et menneske, ikke en kjede" h="Samme frisør hver gang" />
          <Rad v="Booking i første skjermbilde" h="Ingen omvei" />
          <Rad v="Side som laster på mobil" h="Statisk, ikke JavaScript" />
        </ul>
      </Del>

      <Del n="05" tittel="Den nye kundereisen">
        <ul className="cf-prisliste">
          <Rad v="Søk" h="«frisør teie» på mobil" />
          <Rad v="Tillit" h="Bilder av eget arbeid, ekte person" />
          <Rad v="Behandling" h="Pris og tid står der" />
          <Rad v="Booking" h="Ett trykk, ingen telefon" />
          <Rad v="Besøk" h="Salongen vet hva som er bestilt" />
          <Rad v="Anmeldelse" h="Én melding samme kveld" />
          <Rad v="Gjenbesøk" h="Neste time satt i stolen" />
        </ul>
      </Del>

      <Del n="06" tittel="Nettside og booking" dyp>
        <p>
          Seks sider, ikke tjue. Forside, behandlinger med priser, frisøren, arbeid, bestill
          time, kontakt. Hver side har én oppgave.
        </p>
        <p>
          <strong>Vi bygger ikke et bookingsystem du allerede har.</strong> Bruker salongen
          Fixit eller Timma, kobler vi knappen rett dit. Bruker den telefon i dag, er telefon
          hovedveien — og strukturen er klar den dagen det endrer seg.
        </p>
      </Del>

      <Del n="07" tittel="Lokal synlighet">
        <p>
          Google-profilen er den viktigste eiendelen salongen har i dag, og den er ikke
          ferdig utfylt. Kategori, åpningstider, bilder, tjenester og en lenke til booking er
          gratis å fikse og betyr mer enn noe annet enkelttiltak.
        </p>
        <p>
          Vi anbefaler også å lede med sted framfor navn. Tre virksomheter i Norge heter
          Classic Frisør, og en av dem eier domenet. «Frisør på Teie» er søket ingen eier —
          og det er søket der det å faktisk ligge i Smidsrødveien er en fordel.
        </p>
      </Del>

      <Del n="08" tittel="Gjenbesøk og anmeldelser" dyp>
        <p>
          Hår vokser i forutsigbart tempo. Det er hele grunnen til at dette er en bedre
          gjenkjøpsbransje enn de fleste.
        </p>
        <p>
          Det billigste tiltaket er også det første: spør om anmeldelse i stolen, og send én
          melding med lenke samme kveld. Det krever ingen programvare. Å gå fra én til åtte
          ekte anmeldelser endrer hvordan oppføringen leses mer enn noen designendring kan.
        </p>
        <p>
          Neste time settes opp mens kunden fortsatt sitter i stolen. Det er det høyest
          konverterende øyeblikket i hele reisen, og det skjer uten at nettsiden er åpen.
        </p>
      </Del>

      <Del n="09" tittel="Anbefalt løsning">
        <ul className="cf-prisliste">
          <Rad v="Nettside, seks sider" h="Mobil først" />
          <Rad v="Behandlinger med pris og tid" h="Inkludert" />
          <Rad v="Frisørprofil" h="Inkludert" />
          <Rad v="Galleri" h="Inkludert" />
          <Rad v="Bookingkobling" h="Til eksisterende system" />
          <Rad v="Lokal SEO og Google-profil" h="Inkludert" />
          <Rad v="NAP-opprydding" h="Inkludert" />
          <Rad v="Analyse og konverteringssporing" h="Inkludert" />
          <Rad v="Klar for anmeldelser og påminnelser" h="Struktur, fase 2" />
        </ul>

        <div style={{ marginTop: "2.5rem" }}>
          <ul className="cf-prisliste">
            <Rad v="Vekst- og bookingsystem" h="32 900 kr" />
            <Rad v="Founding Partner" h="24 900 kr" />
            <Rad v="Tycho Care" h="1 490 kr / mnd" />
          </ul>
          <p style={{ marginTop: "1.5rem" }}>
            Founding Partner-prisen er en byttehandel, ikke en rabatt. Mot lavere pris får
            Tycho Systems bruke prosjektet i porteføljen, lage en case-studie, bruke
            samlede resultater, og be om en uttalelse etter levering.
          </p>
          <p style={{ color: "var(--espresso-myk)" }}>
            Vi ber om ærlig tilbakemelding — ikke om en positiv uttalelse. En uttalelse gis
            bare hvis du faktisk mener den.
          </p>
        </div>
      </Del>

      <Del n="10" tittel="Neste steg" dyp>
        <p>
          Nettsiden du har sett er et konsept. Den inneholder ingen påstander om salongen som
          ikke er bekreftet — alle hull står synlig merket, med vilje.
        </p>
        <p>Før noe kan publiseres, trenger vi svar på disse:</p>
        <ul className="cf-prisliste" style={{ marginTop: "1.25rem" }}>
          {openQuestions
            .filter((q) => q.impact === "høy")
            .map((q) => (
              <Rad key={q.field} v={q.field} h={`Spørsmål ${q.question}`} />
            ))}
        </ul>
        <p style={{ marginTop: "1.75rem" }}>
          Skjemaet tar omtrent ti minutter. Med de fem viktigste svarene går dette fra
          konsept til noe som kan publiseres.
        </p>
        <p className="cf-data" style={{ marginTop: "2.5rem" }}>
          {salon.displayName} · {salon.place} · Konseptforslag, ikke en publisert nettside
        </p>
      </Del>
    </>
  );
}
