import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, FotoBrief, Mangler, Plate, Seksjon } from "@/components/marine/Primitives";
import { business } from "@/data/marine";
import { breadcrumbJsonLd, mmServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Båtmotor service Nøtterøy — Marine Max",
  description:
    "Service og vedlikehold av båtmotor på Nøtterøy og i Færder. Fortell oss hva motoren gjør, så tar vi den derfra. Ring 920 11 867.",
  path: "/marine-max/batmotor-service",
  siteName: "Marine Max",
});

export default function MotorService() {
  return (
    <>
      <JsonLd
        data={mmServiceJsonLd({
          name: "Service på båtmotor",
          description:
            "Vedlikehold og service på båtmotor for båteiere på Nøtterøy, i Færder og i Tønsberg-området.",
          path: "/marine-max/batmotor-service",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Tjenester", path: "/marine-max/tjenester" },
          { name: "Motorservice", path: "/marine-max/batmotor-service" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Tjenester", path: "/marine-max/tjenester" },
          { name: "Motorservice", path: "/marine-max/batmotor-service" },
        ]}
      />

      <section className="mm-band mm-band--flush">
        <div className="mm-shell">
          <Seksjon n="01" merke="Motorservice">
            <h1 className="mm-d1">Service på båtmotor</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem" }}>
              Jevnlig service er det billigste vedlikeholdet som finnes. Det meste som ryker på
              sjøen, hadde gitt seg til kjenne på benken.
              <DemoNote id="mm.01" />
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.75rem" }}>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--primar">
                Bestill service
              </Link>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--sekundar">
                Ring {business.phoneDisplay}
              </a>
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Omfang">
            <h2 className="mm-d2">Hva som gjelder</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Marine Max har vært registrert for reparasjon og vedlikehold av båter og
                  båtmotorer siden 2005. Nøyaktig hvilke merker og motortyper vi tar, står
                  ikke her ennå — vi skriver det ikke før det er bekreftet.
                </p>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Er du i tvil om vi tar akkurat din motor, er telefonen raskeste vei til svar.
                </p>
                <p>
                  <Link href="/marine-max/batreparasjon" className="mm-lenke">
                    Har noe allerede sluttet å virke?
                  </Link>
                </p>
              </div>

              <Plate
                title="Motorservice"
                rows={[
                  { label: "Vi trenger", value: "Motormerke og modell — eller ett bilde av motorskiltet" },
                  { label: "Og gjerne", value: "Omtrentlig årsmodell og timer" },
                  { label: "Og", value: "Hvor båten står i dag" },
                  { label: "Merker", value: <Mangler /> },
                  { label: "Innenbords / utenbords", value: <Mangler /> },
                  { label: "Pris", value: <Mangler /> },
                ]}
              />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Motorskiltet">
            <h2 className="mm-d2">Ett bilde er nok</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Alle motorer har et skilt med merke, modell, årsmodell og serienummer. Tar du
                  et bilde av det, trenger du ikke vite hva noe av det heter — vi leser det.
                </p>
                <p>
                  Skiltet sitter som regel på motorbraketten, under toppdekselet eller på
                  siden av blokka.
                </p>
                <p>
                  <Link href="/marine-max/bestill-service" className="mm-lenke">
                    Send inn bilde og beskrivelse
                  </Link>
                </p>
              </div>
              <FotoBrief brief="Motorskilt, nært" ratio="1:1" note="Fotoliste nr. 11" />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="04" merke="Neste steg">
            <h2 className="mm-d2">Book service</h2>
            <p style={{ marginTop: "1rem", color: "var(--stal-lys)" }}>
              To minutter nå sparer en telefonrunde senere.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--primar">
                Bestill service
              </Link>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--sekundar">
                Ring {business.phoneDisplay}
              </a>
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
