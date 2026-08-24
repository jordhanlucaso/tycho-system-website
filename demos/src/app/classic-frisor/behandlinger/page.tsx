import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, DemoBand, PrisRad, Seksjon } from "@/components/classic-frisor/Primitives";
import { treatmentGroups, treatments, openQuestions } from "@/data/classic-frisor";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Behandlinger — frisør på Nøtterøy | Classic",
  description:
    "Klipp, farge og styling på Teie. Hva hver behandling koster, hvor lang tid den tar, og hvordan du bestiller time.",
  path: "/classic-frisor/behandlinger",
  siteName: "Classic Frisør",
});

export default function Behandlinger() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Behandlinger", path: "/classic-frisor/behandlinger" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Behandlinger", path: "/classic-frisor/behandlinger" },
        ]}
      />

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <h1 className="cf-d1">Behandlinger</h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            Pris og tid ved hver behandling. Ingen av frisørene i Smidsrødveien publiserer
            dette i dag — det er den enkleste fordelen som finnes å ta.
            <DemoNote id="cf.06" />
          </p>
        </div>
      </section>

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <DemoBand merke="Eksempelinnhold — ingen av behandlingene er bekreftet av salongen">
            {treatmentGroups.map((group) => {
              const items = treatments.filter((t) => t.group === group.id);
              return (
                <Seksjon key={group.id} merke={group.label}>
                  <ul className="cf-prisliste">
                    {items.map((t) => (
                      <PrisRad
                        key={t.id}
                        navn={t.name}
                        blurb={t.blurb}
                        minutter={t.minutes}
                        pris={t.fromPrice}
                      />
                    ))}
                  </ul>
                </Seksjon>
              );
            })}
          </DemoBand>

          <div className="cf-btn-rad" style={{ marginTop: "2rem" }}>
            <Link href="/classic-frisor/bestill-time" className="cf-btn cf-btn--primar">
              Bestill time
            </Link>
          </div>
        </div>
      </section>

      {/* A visible list of gaps, on the page a customer would most want answered.
          Showing what we do not know is what makes everything unmarked believable. */}
      <section className="cf-band cf-band--alt">
        <div className="cf-shell">
          <Seksjon n="—" merke="Dette vet vi ikke ennå">
            <h2 className="cf-d2">Hva som mangler før dette kan publiseres</h2>
            <p className="cf-lead" style={{ marginTop: "1rem", marginBottom: "1.75rem" }}>
              Vi har ikke funnet noen offentlig kilde til behandlinger eller priser for
              denne salongen, så vi har ikke gjettet.
              <DemoNote id="cf.07" />
            </p>
            <ul className="cf-prisliste">
              {openQuestions
                .filter((q) => q.impact === "høy")
                .map((q) => (
                  <li key={q.field} className="cf-pris">
                    <span className="cf-pris__navn">{q.field}</span>
                    <span className="cf-pris__belop">
                      <span className="cf-data">Spørsmål {q.question}</span>
                    </span>
                    <p className="cf-pris__blurb">{q.why}</p>
                  </li>
                ))}
            </ul>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
