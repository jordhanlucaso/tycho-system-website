import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, FotoBrief, NapPlate, Seksjon } from "@/components/marine/Primitives";
import { business } from "@/data/marine";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt — Marine Max, Bryggeveien 3B Nøtterøy",
  description:
    "Marine Max, Bryggeveien 3B, 3120 Nøtterøy. Ring 920 11 867 for båtservice, motorservice og reparasjon i Færder og Tønsberg.",
  path: "/marine-max/kontakt",
  siteName: "Marine Max",
});

export default function Kontakt() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Kontakt", path: "/marine-max/kontakt" },
        ])}
      />
      <Brodsmuler trail={[{ name: "Kontakt", path: "/marine-max/kontakt" }]} />

      <section className="mm-band mm-band--dark mm-band--flush mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="01" merke="Kontakt">
            <h1 className="mm-d1">Kontakt</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem", color: "var(--lyshavn)" }}>
              Raskeste vei til svar er telefon. Skal det gjøres en jobb, er skjemaet bedre —
              da har vi opplysningene før vi snakker sammen.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.75rem" }}>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
                Ring {business.phoneDisplay}
              </a>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
                Bestill service
              </Link>
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Hvor vi er">
            <h2 className="mm-d2">Bryggeveien 3B</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Verkstedet ligger i Bryggeveien 3B, 3120 Nøtterøy, i Færder kommune.
                  <DemoNote id="mm.03" />
                </p>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Åpningstider er ikke bekreftet, og vi finner dem derfor ikke på. Ring for å
                  avtale når det passer.
                </p>
                <p>
                  <a
                    className="mm-lenke"
                    href="https://www.google.com/maps/search/?api=1&query=Bryggeveien+3B+3120+N%C3%B8tter%C3%B8y"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne i kart
                  </a>
                </p>
              </div>

              <NapPlate title="Marine Max" />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Verkstedet">
            <h2 className="mm-d2">Slik ser det ut</h2>
            <p style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              Folk vil vite hvor de kommer. Et bilde av bygget utenfra gjør at kunden kjenner
              seg igjen når han svinger inn.
            </p>
            <div style={{ marginTop: "1.75rem", maxWidth: "40rem" }}>
              <FotoBrief
                brief="Verkstedet utvendig, port åpen"
                ratio="16:9"
                note="Fotoliste nr. 5"
              />
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
