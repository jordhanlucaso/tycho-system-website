import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, Disp, FotoBrief, Seksjon } from "@/components/marine/Primitives";
import { business, symptoms } from "@/data/marine";
import { breadcrumbJsonLd, mmServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Båtreparasjon og feilsøking Nøtterøy — Marine Max",
  description:
    "Motoren starter ikke, stopper eller går ujevnt? Feilsøking og reparasjon av båtmotor på Nøtterøy. Ring 920 11 867 eller send inn problemet.",
  path: "/marine-max/batreparasjon",
  siteName: "Marine Max",
});

export default function Reparasjon() {
  return (
    <>
      <JsonLd
        data={mmServiceJsonLd({
          name: "Reparasjon og feilsøking på båtmotor",
          description:
            "Feilsøking og reparasjon av båt og båtmotor for båteiere på Nøtterøy, i Færder og i Tønsberg-området.",
          path: "/marine-max/batreparasjon",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Tjenester", path: "/marine-max/tjenester" },
          { name: "Reparasjon", path: "/marine-max/batreparasjon" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Tjenester", path: "/marine-max/tjenester" },
          { name: "Reparasjon", path: "/marine-max/batreparasjon" },
        ]}
      />

      <section className="mm-band mm-band--dark mm-band--flush mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="01" merke="Reparasjon">
            <h1 className="mm-d1">Når noe har sluttet å virke</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem", color: "var(--lyshavn)" }}>
              Vi finner ut hva det er før vi bytter deler. Det er billigere for deg, og det
              gjør at feilen ikke kommer tilbake.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.75rem" }}>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
                Ring {business.phoneDisplay}
              </a>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
                Send inn problemet
              </Link>
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Symptomer">
            <h2 className="mm-d2"><Disp>Hva gjør motoren?</Disp></h2>
            <p style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              Under står de vanligste symptomene, hva de som regel henger sammen med, og hva vi
              trenger å vite for å komme videre. Dette er generell motorlære — ikke en
              diagnose av din motor.
              <DemoNote id="mm.02" />
            </p>

            <div style={{ marginTop: "2rem", borderTop: "1px solid var(--linje)" }}>
              {symptoms.map((item) => (
                <article className="mm-symptom" key={item.id}>
                  <h3>{item.symptom}</h3>
                  <p>{item.likely}</p>
                  <p className="mm-mono mm-mono--dim">{item.weNeed}</p>
                </article>
              ))}
            </div>

            <p style={{ marginTop: "1.75rem" }}>
              <Link href="/marine-max/bestill-service" className="mm-lenke">
                Beskriv problemet ditt
              </Link>
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Feilsøking">
            <h2 className="mm-d2">Måling, ikke gjetting</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Å bytte deler til feilen forsvinner er en dyr måte å feilsøke på. Vi går
                  motsatt vei: finn ut hva som faktisk er galt, og bytt det.
                </p>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Har du et lydopptak av lyden, eller et bilde av det som ser galt ut, tar vi
                  gjerne imot det. Ofte er det nok til å si noe før båten er inne.
                </p>
                <p>
                  <Link href="/marine-max/batmotor-service" className="mm-lenke">
                    Er det snarere tid for service?
                  </Link>
                </p>
              </div>
              <FotoBrief
                brief="Feilsøking med måleinstrument"
                ratio="4:3"
                note="Fotoliste nr. 4"
              />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="04" merke="Neste steg">
            <h2 className="mm-d2">Står du ved båten?</h2>
            <p style={{ marginTop: "1rem", color: "var(--stal-lys)" }}>
              Ring direkte. Vet du om motoren starter, og har du et bilde av motorskiltet, kan
              vi ofte si noe med én gang.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
                Ring {business.phoneDisplay}
              </a>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
                Send inn problemet
              </Link>
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
