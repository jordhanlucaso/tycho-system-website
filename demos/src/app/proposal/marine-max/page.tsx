import Link from "next/link";
import { Plate, Seksjon } from "@/components/marine/Primitives";
import { business, openQuestions, services } from "@/data/marine";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Forslag — Marine Max | Tycho Systems",
  description: "Internt salgsdokument. Ikke indeksert.",
  path: "/proposal/marine-max",
  siteName: "Marine Max",
  noindex: true,
});

function Del({
  n,
  tittel,
  children,
  variant,
}: {
  n: string;
  tittel: string;
  children: React.ReactNode;
  variant?: "alt" | "dark" | "deep";
}) {
  const cls =
    variant === "dark"
      ? "mm-band mm-band--dark mm-on-dark"
      : variant === "deep"
        ? "mm-band mm-band--deep mm-on-dark"
        : variant === "alt"
          ? "mm-band mm-band--alt"
          : "mm-band";
  return (
    <section className={cls}>
      <div className="mm-shell">
        <Seksjon n={n} merke="Forslag">
          <h2 className="mm-d2">{tittel}</h2>
          <div style={{ marginTop: "1.25rem" }}>{children}</div>
        </Seksjon>
      </div>
    </section>
  );
}

export default function Proposal() {
  const toConfirm = services.filter((s) => s.status === "to-confirm");

  return (
    <>
      <section className="mm-band mm-band--deep mm-band--flush mm-on-dark">
        <div className="mm-shell">
          <p className="mm-mono mm-varsel">Tycho Systems · Konseptforslag</p>
          <h1 className="mm-d1" style={{ marginTop: "1rem" }}>
            Marine Max
          </h1>
          <p className="mm-lead" style={{ marginTop: "1.25rem", color: "var(--lyshavn)" }}>
            Et forslag til hvordan folk som leter etter båtservice rundt Nøtterøy, Færder og
            Tønsberg kan finne deg — og hvordan henvendelsene kan komme ferdig beskrevet.
          </p>
          <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
            Utarbeidet 23-08-2026 · Ikke en offisiell nettside for Marine Max
          </p>
        </div>
      </section>

      <Del n="01" tittel="Hva skjer i dag?">
        <p>
          Marine Max har ingen egen nettside. Alt en potensiell kunde finner når han søker, er
          sider andre har laget: Brønnøysund-oppslag, gulesider, 1881, proff. De sidene er
          bygget av registerdata, ikke av deg.
        </p>
        <p>De viser ikke hva du gjør. De viser ikke bilder. De viser ikke åpningstider.</p>
        <p>
          Og de tjener penger på å vise konkurrentene dine i margen, ved siden av oppføringen
          din. Trafikken som leter etter <em>deg</em>, selges videre.
        </p>
        <p>
          Beskrivelsen som ligger i registeret ble skrevet i 2005 og har en skrivefeil i seg —
          «båtmoterer». Den har stått uendret i tjue år. Det er ingen kritikk; det er bare et
          bilde på hvor lite oppmerksomhet den digitale siden av bedriften har fått.
        </p>
      </Del>

      <Del n="02" tittel="Hvordan folk søker etter båtservice" variant="alt">
        <p>Det er i praksis to helt forskjellige kunder.</p>
        <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
          <Plate
            title="Kunde A — planlagt"
            rows={[
              { label: "Søker", value: "«båtservice nøtterøy»" },
              { label: "Situasjon", value: "Hjemme, sammenligner to verksteder" },
              { label: "Vil vite", value: "Omfang, når, omtrent hva det koster" },
              { label: "Vil helst", value: "Slippe å ringe en fremmed" },
              { label: "Verdi", value: "Kommer tilbake hvert år" },
            ]}
          />
          <Plate
            title="Kunde B — akutt"
            rows={[
              { label: "Søker", value: "«båtmotor starter ikke»" },
              { label: "Situasjon", value: "Står ved båten, på mobil" },
              { label: "Vil vite", value: "Hvem kan hjelpe nå" },
              { label: "Gjør", value: "Ringer den første som tydelig gjør dette" },
              { label: "Verdi", value: "Høyest — og dårligst betjent i dag" },
            ]}
          />
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          Ingen av nettsidene i området er bygget for kunde B. Alle er organisert rundt
          bedriftens egen tjenesteliste, ikke rundt problemet kunden har.
        </p>
      </Del>

      <Del n="03" tittel="Konkurransen rundt Nøtterøy">
        <p>
          Det er 25 registrerte foretak for reparasjon og vedlikehold av båter i Færder
          kommune alene. Men bare fire–fem av dem er egentlig synlige på nett.
        </p>
        <div style={{ marginTop: "1.5rem", maxWidth: "46rem" }}>
          <Plate
            title="De mest synlige"
            rows={[
              { label: "Jarlsø Marina", value: "Travelift 80 t, oppvarmet opplag, autorisert Volvo Penta. Ingen bestillingsskjema" },
              { label: "Nøtterøy Båtsenter", value: "Registrert 2023. Nettbutikk og skjema med seks felter" },
              { label: "T&F Marineservice", value: "Registrert 2022. Fem ansatte. Domenet er uleselig punycode" },
              { label: "Ulviken Motorsenter", value: "Først og fremst MC og hageredskap. Båt er en sidelinje" },
              { label: "Marine Max", value: "Registrert 2005. Ingen nettside" },
            ]}
          />
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          <strong>Det er dette som er hovedpoenget:</strong> de to mest synlige konkurrentene
          ble registrert i 2022 og 2023. Du har vært i drift siden 2005. En kunde som søker i
          dag, får inntrykk av at de nye er de etablerte — og at du ikke finnes.
        </p>
        <p>Synligheten står stikk motsatt av virkeligheten.</p>
      </Del>

      <Del n="04" tittel="Muligheten for Marine Max" variant="alt">
        <p>Fire ting mangler hos <em>alle</em> i markedet. Ikke én av dem har:</p>
        <ul className="mm-liste" style={{ marginTop: "1rem" }}>
          <li><span><strong>Strukturert informasjon om jobben.</strong> Alle skjemaene ender i én fritekstboks. Verkstedet må ringe for å finne ut hva det gjelder.</span></li>
          <li><span><strong>Bilder fra kunden.</strong> Ingen ber om det. Ett bilde av motorskiltet svarer på fire spørsmål.</span></li>
          <li><span><strong>Et ansikt.</strong> Ingen av dem viser et menneske. For et enmannsforetak er det gratis differensiering — og umulig for et firma med fem ansatte å kopiere.</span></li>
          <li><span><strong>Innhold for den akutte kunden.</strong> Ingen har en side som svarer på «motoren starter ikke».</span></li>
        </ul>
        <p style={{ marginTop: "1.5rem" }}>
          Ingen av de fire krever kapital. De krever bare at noen gjør dem.
        </p>
      </Del>

      <Del n="05" tittel="Ny digital kundereise" variant="dark">
        <p style={{ color: "var(--stal-lys)" }}>
          Fra søk til ferdig jobb, med færrest mulig ledd som kan svikte.
        </p>
        <div style={{ marginTop: "1.5rem", maxWidth: "46rem" }}>
          <Plate
            title="Kundereise"
            rows={[
              { label: "01 Søk", value: "«båtservice nøtterøy» på mobil" },
              { label: "02 Treff", value: "Google-profil og egen nettside — ikke en katalog" },
              { label: "03 Forstår", value: "Hva, hvor og hvordan, i første skjermbilde" },
              { label: "04 Stoler", value: "Registrert siden 2005, org.nr, ekte bilder, et navn" },
              { label: "05 Handler", value: "Ringer, eller sender inn jobben med bilde" },
              { label: "06 Du svarer", value: "Med opplysningene allerede på plass" },
              { label: "07 Etterpå", value: "Anmeldelse, og påminnelse neste år" },
            ]}
          />
        </div>
      </Del>

      <Del n="06" tittel="Nettsiden">
        <p>Åtte sider. Ingen av dem finnes for å fylle plass.</p>
        <div style={{ marginTop: "1.5rem", maxWidth: "46rem" }}>
          <Plate
            title="Sidekart"
            rows={[
              { label: "/", value: "Hva, hvor, ring. Bygget for den akutte kunden først" },
              { label: "/marine-max/tjenester", value: "Det vi kan dokumentere — og det vi ikke vet" },
              { label: "/marine-max/batmotor-service", value: "Planlagt service. Motorskilt-forklaringen" },
              { label: "/marine-max/batreparasjon", value: "Symptomer. Markedets eneste side av sitt slag" },
              { label: "/marine-max/tidligere-arbeid", value: "Fotoplan. Blir sterkest når bildene kommer" },
              { label: "/marine-max/om-marine-max", value: "Foretaket, registeret, personen" },
              { label: "/marine-max/bestill-service", value: "Den strukturerte forespørselen" },
              { label: "/marine-max/kontakt", value: "Adresse, telefon, kart" },
            ]}
          />
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          Vi har med vilje <em>ikke</em> laget én side per tettsted. Det er en teknikk som
          bryter med Googles retningslinjer, og for én bedrift med ett verksted er det dessuten
          en påstand om å være steder du ikke er.
        </p>
      </Del>

      <Del n="07" tittel="Google og lokal synlighet" variant="alt">
        <p>
          For søk som «båtverksted nøtterøy» på mobil fyller Google-kartet hele første skjerm.
          Nettsiden kommer under. Derfor er Google-profilen minst like viktig som nettsiden — og
          den er gratis.
        </p>
        <ul className="mm-liste" style={{ marginTop: "1rem" }}>
          <li><span>Overta eller opprette profilen. Høyest utbytte av alt i prosjektet.</span></li>
          <li><span>Riktig hovedkategori: båtreparasjonsverksted.</span></li>
          <li><span>Adresse og telefon helt likt som på nettsiden, tegn for tegn.</span></li>
          <li><span>Minst ti ekte bilder, tatt med mobilen din.</span></li>
          <li><span>Åpningstider — men bare når vi vet dem. Feil tider gir dårlige anmeldelser.</span></li>
          <li><span>Fem–ti ekte anmeldelser fra faste kunder. Du har null i dag.</span></li>
        </ul>
        <p style={{ marginTop: "1.5rem" }}>Full sjekkliste i research/local-seo-strategy.md §8.</p>
      </Del>

      <Del n="08" tittel="Serviceforespørsler" variant="dark">
        <p style={{ color: "var(--stal-lys)" }}>
          Konkurrentenes skjema spør om båtmerke, motortype, navn, telefon, e-post og «melding».
          Alt som betyr noe havner i fritekst. Verkstedet må fortsatt ringe for å finne ut hva
          jobben er. Skjemaet har ikke spart noen tid — det har bare flyttet telefonsamtalen.
        </p>
        <p style={{ color: "var(--stal-lys)" }}>Vårt skjema spør i stedet om:</p>
        <ul className="mm-liste" style={{ marginTop: "1rem" }}>
          <li><span>Om motoren starter — det enkeltspørsmålet som sier mest om en motorfeil</span></li>
          <li><span>Hvor båten står: i sjøen, på land eller på henger. Avgjør om jobben er mulig</span></li>
          <li><span>Når det begynte</span></li>
          <li><span>Bilder — kameraet åpnes direkte på mobil</span></li>
        </ul>
        <p style={{ marginTop: "1.5rem", color: "var(--stal-lys)" }}>
          Og det regner ut hastegrad selv, av det som ble sendt inn. Vi spør aldri «hvor haster
          det?» — alle svarer «veldig».
        </p>
        <p style={{ color: "var(--stal-lys)" }}>
          Du får en SMS du kan lese med skitne hender:{" "}
          <span className="mm-mono mm-varsel">
            «AKUTT — Mercury 60hk starter ikke. Båt på henger, Nøtterøy. 3 bilder. Ola, 900 00 000.»
          </span>
        </p>
      </Del>

      <Del n="09" tittel="Automatisering">
        <p>
          Ingenting av dette bygges nå. Det er fase 2, og bare hvis du vil. Men datamodellen er
          allerede laget slik at det kan kobles på uten å bygge nettsiden om.
        </p>
        <div style={{ marginTop: "1.5rem", maxWidth: "46rem" }}>
          <Plate
            title="Muligheter"
            rows={[
              { label: "Kvittering", value: "Kunden får bekreftelse med én gang, og vet når du svarer" },
              { label: "Varsling", value: "SMS til deg med det du trenger for å prioritere" },
              { label: "Anmeldelse", value: "Forespørsel noen dager etter ferdig jobb" },
              { label: "Årlig påminnelse", value: "«Motoren din hadde service i fjor på denne tiden»" },
              { label: "Vårkampanje", value: "Flytter bookinger fra mai til mars. Samme antall timer, bedre fordelt" },
              { label: "Historikk", value: "Hva som ble gjort på hver båt, hvert år" },
            ]}
          />
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          <strong>Den beste er også den billigste:</strong> én SMS i februar til fjorårets
          kunder. Den krever ingen ny tjeneste og ingenting nytt fra deg — bare en dato du
          allerede kjenner.
        </p>
        <p style={{ color: "var(--blekk-svak)" }}>
          Vi foreslår <em>ikke</em> påminnelser om konservering eller vinteropplag, fordi vi
          ikke vet om du tilbyr det. En påminnelse om noe du ikke gjør, gir deg henvendelser du
          må avvise.
        </p>
      </Del>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="10" merke="Åpne punkter">
            <h2 className="mm-d2">Det vi trenger fra deg</h2>
            <p style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              Nettsiden er bygget uten å finne på noe. Der vi ikke vet, står det tomt og merket.
              Under er alt som mangler, sortert etter hvor mye det betyr.
            </p>
            <div style={{ marginTop: "1.75rem", maxWidth: "52rem" }}>
              <Plate
                title={`${openQuestions.length} åpne punkter`}
                rows={openQuestions.map((q) => ({
                  label: `${q.field} · ${q.impact}`,
                  value: q.why,
                }))}
              />
            </div>
            <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem" }}>
              Tjenester som ikke kan vises i dag: {toConfirm.map((s) => s.title).join(" · ")}
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              Spørreskjemaet tar ti minutter: research/questions-for-trond.md
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="11" merke="Neste steg">
            <h2 className="mm-d2">Neste steg</h2>
            <div style={{ marginTop: "1.5rem", maxWidth: "46rem" }}>
              <Plate
                title="Rekkefølge"
                rows={[
                  { label: "1", value: "Du svarer på de fem viktigste spørsmålene" },
                  { label: "2", value: "Du tar tre bilder: deg i verkstedet, hender på en motor, bygget utenfra" },
                  { label: "3", value: "Vi overtar eller oppretter Google-profilen" },
                  { label: "4", value: "Nettsiden ferdigstilles med dine opplysninger" },
                  { label: "5", value: "Du spør fem faste kunder om en anmeldelse" },
                  { label: "6", value: "Fase 2 vurderes — bare hvis fase 1 gir noe" },
                ]}
              />
            </div>
            <p style={{ marginTop: "1.75rem", color: "var(--stal-lys)" }}>
              Tycho Systems bygger kundeanskaffelses- og driftssystemer for lokale bedrifter.
              Nettsiden er den synlige delen av et system — ikke leveransen i seg selv.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
              <Link href="/marine-max" className="mm-btn mm-btn--primar">
                Se nettsiden
              </Link>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
                Prøv skjemaet
              </Link>
            </div>
            <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.75rem", marginBottom: 0 }}>
              {business.legalName} · Org.nr {business.orgNumber} · Konseptforslag, ikke en
              bestilling
            </p>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
