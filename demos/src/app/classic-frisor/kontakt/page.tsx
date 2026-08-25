import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  Brodsmuler,
  FotoBrief,
  Mangler,
  NapPlate,
  Seksjon,
} from "@/components/classic-frisor/Primitives";
import { sectionBriefs } from "@/data/classic-frisor";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt og åpningstider — Classic Frisør",
  description:
    "Adresse, telefon og åpningstider for Classic Frisør i Smidsrødveien på Teie, Nøtterøy.",
  path: "/classic-frisor/kontakt",
  siteName: "Classic Frisør",
});

export default function Kontakt() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Kontakt", path: "/classic-frisor/kontakt" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Kontakt", path: "/classic-frisor/kontakt" },
        ]}
      />

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <h1 className="cf-d1">Kontakt</h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            Smidsrødveien på Teie. Alt under står tomt til salongen har bekreftet det — vi
            legger ikke ut en adresse eller et nummer vi ikke har verifisert.
            <DemoNote id="cf.11" />
          </p>
        </div>
      </section>

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <div className="cf-kolonner">
            <div>
              <NapPlate title="Kontaktopplysninger" />

              <div className="cf-foto-hylse" style={{ marginTop: "1.5rem" }}>
                <FotoBrief
                  brief={sectionBriefs.contact.brief}
                  token={sectionBriefs.contact.token}
                  ratio={sectionBriefs.contact.ratio}
                />
              </div>
            </div>

            <div>
              <Seksjon merke="Hvorfor står det tomt">
                <h2 className="cf-d2">NAP må stemme overalt</h2>
                <p style={{ marginTop: "1rem" }}>
                  Navn, adresse og telefon må være identisk på nettsiden, på Google-profilen
                  og i alle kataloger. Ett tegn til forskjell er en annen adresse for en
                  maskin.
                </p>
                <p>
                  I dag finnes det flere virksomheter med liknende navn, og
                  Google-oppføringen er ikke bekreftet mot et foretak. Derfor publiserer vi
                  ingen strukturerte data om salongen ennå.
                </p>
                <p>
                  Status: <Mangler>Juridisk enhet ikke bekreftet</Mangler>
                </p>
              </Seksjon>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
