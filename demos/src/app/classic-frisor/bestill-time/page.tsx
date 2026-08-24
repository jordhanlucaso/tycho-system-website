import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, Mangler, NapPlate, Seksjon } from "@/components/classic-frisor/Primitives";
import { booking, treatments, treatmentGroups } from "@/data/classic-frisor";
import { isConfirmed } from "@/data/types";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bestill time — Classic Frisør, Nøtterøy",
  description:
    "Bestill time hos Classic Frisør på Teie. Velg behandling, se hvor lang tid den tar, og få en tid som passer.",
  path: "/classic-frisor/bestill-time",
  siteName: "Classic Frisør",
});

export default function BestillTime() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Bestill time", path: "/classic-frisor/bestill-time" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Bestill time", path: "/classic-frisor/bestill-time" },
        ]}
      />

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <h1 className="cf-d1">Bestill time</h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            {isConfirmed(booking.provider)
              ? "Velg behandling og tidspunkt."
              : "Slik ser bookingen ut når vi vet hvilket system salongen bruker."}
            <DemoNote id="cf.08" />
          </p>
        </div>
      </section>

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <div className="cf-kolonner">
            <div>
              <Seksjon n="01" merke="Bookingsystem">
                <h2 className="cf-d2">Vi bygger ikke noe salongen allerede har</h2>
                <p style={{ marginTop: "1rem" }}>
                  Bruker salongen Fixit eller Timma i dag, kobler vi denne knappen rett dit.
                  Bruker den telefon, er telefon hovedveien — og siden er klar for booking
                  den dagen det endrer seg.
                </p>
                <p>
                  Vi vet ikke hvilket i dag: <Mangler>Bookingsystem ikke bekreftet</Mangler>
                </p>

                <div className="cf-btn-rad" style={{ marginTop: "1.75rem" }}>
                  {isConfirmed(booking.provider) ? (
                    <a
                      href={booking.provider.bookingUrl}
                      className="cf-btn cf-btn--primar"
                      rel="noopener"
                    >
                      Gå til booking
                    </a>
                  ) : (
                    <Link href="/classic-frisor/kontakt" className="cf-btn cf-btn--primar">
                      Kontakt salongen
                    </Link>
                  )}
                </div>
              </Seksjon>

              <Seksjon n="02" merke="Behandling">
                <h2 className="cf-d2">Hva vil du bestille?</h2>
                <p style={{ marginTop: "1rem" }}>
                  Når behandlingslisten er bekreftet, velger kunden her og går rett videre med
                  riktig tid satt av.
                </p>
                <ul className="cf-prisliste" style={{ marginTop: "1.25rem" }}>
                  {treatmentGroups.map((g) => (
                    <li key={g.id} className="cf-pris">
                      <span className="cf-pris__navn">{g.label}</span>
                      <span className="cf-pris__belop">
                        <span className="cf-data">
                          {treatments.filter((t) => t.group === g.id).length} behandlinger
                        </span>
                      </span>
                      <p className="cf-pris__blurb">
                        <Mangler>Ikke bekreftet</Mangler>
                      </p>
                    </li>
                  ))}
                </ul>
              </Seksjon>
            </div>

            <NapPlate title="Kontakt" />
          </div>
        </div>
      </section>
    </>
  );
}
