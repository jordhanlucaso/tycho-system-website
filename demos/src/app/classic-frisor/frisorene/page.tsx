import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, FotoBrief, Mangler, Seksjon } from "@/components/classic-frisor/Primitives";
import { stylists } from "@/data/classic-frisor";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frisøren — Classic Frisør, Teie",
  description:
    "Hvem som klipper deg hos Classic Frisør på Teie. Én stol, samme frisør hver gang.",
  path: "/classic-frisor/frisorene",
  siteName: "Classic Frisør",
});

export default function Frisorene() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Frisøren", path: "/classic-frisor/frisorene" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Frisøren", path: "/classic-frisor/frisorene" },
        ]}
      />

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <h1 className="cf-d1">Frisøren</h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            I en salong med én stol er personen hele historien. Det er også den eneste delen
            av denne siden vi ikke kan skrive selv.
            <DemoNote id="cf.09" />
          </p>
        </div>
      </section>

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <div className="cf-kolonner cf-kolonner--smal">
            <div className="cf-galleri" style={{ gridTemplateColumns: "1fr" }}>
              {stylists.map((s) => (
                <FotoBrief
                  key={s.id}
                  brief="Portrett ved stolen, dagslys, ikke posert"
                  token={s.photo}
                  ratio="4:5"
                />
              ))}
            </div>

            <div>
              <Seksjon merke="Hvem jobber her">
                <h2 className="cf-d2">Navn kommer fra salongen, ikke fra oss</h2>
                <p style={{ marginTop: "1rem" }}>
                  Vi finner ingen ansatte registrert på foretaket. Det er helt normalt for et
                  lite foretak — men det betyr at vi ikke kan skrive noe om hvem som jobber
                  her uten at salongen sier det selv.
                </p>
                <ul className="cf-prisliste" style={{ marginTop: "1.5rem" }}>
                  <li className="cf-pris">
                    <span className="cf-pris__navn">Navn</span>
                    <span className="cf-pris__belop">
                      <Mangler>Ikke bekreftet</Mangler>
                    </span>
                  </li>
                  <li className="cf-pris">
                    <span className="cf-pris__navn">Rolle</span>
                    <span className="cf-pris__belop">
                      <Mangler>Ikke bekreftet</Mangler>
                    </span>
                  </li>
                  <li className="cf-pris">
                    <span className="cf-pris__navn">Erfaring</span>
                    <span className="cf-pris__belop">
                      <Mangler>Ikke bekreftet</Mangler>
                    </span>
                    <p className="cf-pris__blurb">
                      Vi skriver aldri «20 års erfaring» med mindre frisøren oppgir tallet selv.
                    </p>
                  </li>
                </ul>

                <p style={{ marginTop: "1.5rem" }}>
                  <Link href="/classic-frisor/bestill-time" className="cf-lenke">
                    Bestill time →
                  </Link>
                </p>
              </Seksjon>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
