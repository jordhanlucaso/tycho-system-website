import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Disp, FotoBrief, Mangler, NapPlate, Plate, Seksjon } from "@/components/marine/Primitives";
import { business, processSteps, publicServices, recentWork, yearsRegistered } from "@/data/marine";
import { businessJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Båtservice på Nøtterøy — Marine Max",
  description:
    "Båtservice, motorservice og reparasjon på Nøtterøy og i Færder. Registrert og i drift siden 2005. Ring 920 11 867 eller send inn jobben.",
  path: "/marine-max",
  siteName: "Marine Max",
});

export default function Forsiden() {
  return (
    <>
      <JsonLd data={businessJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* ── Hero ──────────────────────────────────────────────────────────────────────
          Journey B first: what, where, and the phone action, inside the first viewport
          at 375px. The acute customer is standing next to a dead engine. */}
      <section className="mm-band mm-band--dark mm-band--flush mm-on-dark">
        <div className="mm-shell">
          <p className="mm-mono mm-mono--dim" style={{ marginBottom: "1rem" }}>
            Bryggeveien 3B · 3120 Nøtterøy · Færder
          </p>

          <h1 className="mm-d1">
            Båtservice
            <br />
            <Disp>på Nøtterøy</Disp>
          </h1>

          <p className="mm-lead" style={{ marginTop: "1.5rem", color: "var(--lyshavn)" }}>
            Service, reparasjon og feilsøking på båt og båtmotor. Du snakker med den
            samme personen som gjør jobben.
            <DemoNote id="mm.07" />
          </p>

          <div className="mm-btn-rad" style={{ marginTop: "2rem" }}>
            <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
              Ring {business.phoneDisplay}
            </a>
            <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
              Bestill service
            </Link>
          </div>

          <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
            Registrert på Nøtterøy siden {new Date(business.registeredSince).getFullYear()}
            <DemoNote id="mm.08" />
          </p>
        </div>
      </section>

      {/* ── Acute path ───────────────────────────────────────────────────────────────── */}
      <section className="mm-band mm-band--deep mm-on-dark" style={{ paddingBlock: "clamp(2rem, 4vw, 3rem)" }}>
        <div className="mm-shell">
          <Seksjon n="00" merke="Akutt">
            <h2 className="mm-d3">Står du ved båten nå?</h2>
            <p style={{ color: "var(--stal-lys)", marginTop: "0.75rem" }}>
              Ring direkte. Har du et bilde av motorskiltet og vet om motoren starter, er det
              nok til at vi kan si noe med én gang.
            </p>
            <p style={{ margin: 0 }}>
              <a href={`tel:${business.phoneE164}`} className="mm-lenke">
                {business.phoneDisplay}
              </a>
            </p>
          </Seksjon>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────────────────── */}
      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="01" merke="Tjenester">
            <h2 className="mm-d2"><Disp>Hva vi gjør</Disp></h2>
            <p style={{ marginTop: "1rem", color: "var(--blekk-svak)" }}>
              Under står bare det vi kan dokumentere. Registrert virksomhet er reparasjon og
              vedlikehold av båter og båtmotorer.
              <DemoNote id="mm.09" />
            </p>

            <div className="mm-tjenester" style={{ marginTop: "2rem" }}>
              {publicServices.map((service) => (
                <article className="mm-tjeneste" key={service.id}>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <p style={{ margin: 0 }}>
                    {service.slug ? (
                      <Link href={service.slug} className="mm-lenke">
                        Les mer om {service.title.toLowerCase()}
                      </Link>
                    ) : (
                      <Mangler>Omfang bekreftes</Mangler>
                    )}
                  </p>
                </article>
              ))}
            </div>

            <p style={{ marginTop: "1.75rem" }}>
              <Link href="/marine-max/tjenester" className="mm-lenke">
                Se alle tjenester
              </Link>
            </p>
          </Seksjon>
        </div>
      </section>

      {/* ── Why Marine Max ───────────────────────────────────────────────────────────── */}
      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="02" merke="Hvorfor oss">
            <h2 className="mm-d2">Hvorfor Marine Max</h2>

            <div className="mm-kolonner" style={{ marginTop: "1.75rem" }}>
              <div>
                <ul className="mm-liste">
                  <li>
                    <span>
                      <strong>Samme person hele veien.</strong> Marine Max er et
                      enkeltpersonforetak. Den som svarer på telefonen er den som står ved
                      motoren. Ingenting går via en servicedisk.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>På Nøtterøy siden 2005.</strong> Bryggeveien 3B ligger i
                      området vi jobber i — ikke i nabokommunen.
                    </span>
                  </li>
                  <li>
                    <span>
                      <strong>Vi finner ut hva det er før vi bytter deler.</strong> Feilsøking
                      først. Det er billigere for deg.
                    </span>
                  </li>
                </ul>

                <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.75rem" }}>
                  Vi skriver ikke «best», «størst» eller «ledende». Ingenting av det kan
                  dokumenteres.
                  <DemoNote id="mm.10" />
                </p>
              </div>

              <FotoBrief
                brief="Hender på en motor — nært, verktøy synlig"
                ratio="4:3"
                note="Fotoliste nr. 2"
              />
            </div>
          </Seksjon>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────────────────── */}
      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="03" merke="Slik foregår det">
            <h2 className="mm-d2"><Disp>Fra henvendelse til sjøen</Disp></h2>

            <div className="mm-steg" style={{ marginTop: "1.75rem" }}>
              {processSteps.map((step) => (
                <div className="mm-steg__rad" key={step.n}>
                  <p className="mm-steg__n" style={{ margin: 0 }}>
                    {step.n}
                  </p>
                  <div>
                    <h3 className="mm-d4">{step.title}</h3>
                    <p style={{ margin: "0.4rem 0 0", color: "var(--blekk-svak)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem" }}>
              Stegene justeres når vi vet hvordan Trond faktisk jobber.
            </p>
          </Seksjon>
        </div>
      </section>

      {/* ── Recent work ──────────────────────────────────────────────────────────────── */}
      <section className="mm-band mm-band--dark mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="04" merke="Tidligere arbeid">
            <h2 className="mm-d2">Tidligere arbeid</h2>
            <p style={{ marginTop: "1rem", color: "var(--stal-lys)" }}>
              Her skal det stå bilder av jobber Trond har gjort. Rammene under viser hvilke
              bilder vi trenger.
              <DemoNote id="mm.11" />
            </p>

            <div className="mm-galleri" style={{ marginTop: "1.75rem" }}>
              {recentWork.slice(0, 3).map((item) => (
                <FotoBrief key={item.id} brief={item.brief} ratio={item.ratio} note={item.caption} />
              ))}
            </div>

            <p style={{ marginTop: "1.75rem" }}>
              <Link href="/marine-max/tidligere-arbeid" className="mm-lenke">
                Se hele fotoplanen
              </Link>
            </p>
          </Seksjon>
        </div>
      </section>

      {/* ── Service area ─────────────────────────────────────────────────────────────── */}
      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="05" merke="Område">
            <h2 className="mm-d2">Hvor vi jobber</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Verkstedet ligger i Bryggeveien 3B på Nøtterøy, i Færder kommune. Vi jobber
                  for båteiere på Nøtterøy, i Færder og i Tønsberg-området.
                  <DemoNote id="mm.12" />
                </p>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Kjører vi ut til båten? Det er ikke bekreftet ennå, og derfor står det ikke
                  her.
                </p>
                <p>
                  <Link href="/marine-max/kontakt" className="mm-lenke">
                    Veibeskrivelse og kontakt
                  </Link>
                </p>
              </div>

              <Plate
                title="Område"
                rows={[
                  { label: "Verksted", value: "Bryggeveien 3B, 3120 Nøtterøy" },
                  { label: "Kommune", value: "Færder" },
                  { label: "Dekker", value: business.areaServed.join(", ") },
                  { label: "Mobil service", value: <Mangler /> },
                  { label: "Videre område", value: <Mangler /> },
                ]}
              />
            </div>
          </Seksjon>
        </div>
      </section>

      {/* ── Conversion ───────────────────────────────────────────────────────────────── */}
      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="06" merke="Ta kontakt">
            <h2 className="mm-d2">Fortell oss om båten</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p style={{ color: "var(--stal-lys)" }}>
                  Skjemaet tar to minutter. Har du et bilde av motorskiltet, trenger du nesten
                  ikke skrive noe — merke, modell, årsmodell og serienummer står på det.
                  <DemoNote id="mm.13" />
                </p>
                <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
                  <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--primar">
                    Bestill service
                  </Link>
                  <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--sekundar">
                    Ring {business.phoneDisplay}
                  </a>
                </div>
                <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
                  {yearsRegistered()} år registrert på Nøtterøy
                </p>
              </div>

              <NapPlate />
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
