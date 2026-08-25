import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, Seksjon } from "@/components/marine/Primitives";
import { LeadForm } from "@/components/marine/LeadForm";
import { business } from "@/data/marine";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bestill service — Marine Max Nøtterøy",
  description:
    "Fortell oss om båten og motoren, legg ved et bilde, så tar vi kontakt. Båtservice og reparasjon på Nøtterøy.",
  path: "/marine-max/bestill-service",
  siteName: "Marine Max",
});

export default function BestillService() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Bestill service", path: "/marine-max/bestill-service" },
        ])}
      />
      <Brodsmuler trail={[{ name: "Bestill service", path: "/marine-max/bestill-service" }]} />

      <section className="mm-band mm-band--flush">
        <div className="mm-shell">
          <Seksjon n="01" merke="Serviceforespørsel">
            <h1 className="mm-d1">Fortell oss om båten</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem" }}>
              Bare fire felter er obligatoriske. Resten hjelper oss å svare deg ordentlig
              første gang — og sparer deg for en telefonrunde.
            </p>
            <p style={{ marginTop: "1rem" }}>
              Haster det?{" "}
              <a href={`tel:${business.phoneE164}`} className="mm-lenke">
                Ring {business.phoneDisplay}
              </a>
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <div style={{ maxWidth: "48rem" }}>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
