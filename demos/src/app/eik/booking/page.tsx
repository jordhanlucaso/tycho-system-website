import { DemoNote } from "@/components/demo/DemoLayer";
import { BookingFlow } from "@/components/eik/BookingFlow";
import { Section, SpecRule } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bestill time i Tønsberg | Eik Tattoo",
  description:
    "Send inn tatoverings- eller piercingidéen din til Eik i Tønsberg. Beskriv motiv, størrelse og plassering, så får du svar med forslag, prisramme og ledig tid.",
  path: "/eik/booking",
  siteName: "Eik Tattoo & Piercing",
});

export default function BookingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Bestill time", path: "/eik/booking" },
        ])}
      />

      <Section>
        <SpecRule left="01 — Bestill time" right="Uforpliktende" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Henvendelse</p>
          <div>
            <h1 className="eik-display eik-h1">Send inn idéen din</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              Fem minutter her sparer deg for en uke med meldinger fram og tilbake. Du binder
              deg ikke til noe ved å sende inn.
              <DemoNote id="eik.02" />
            </p>
          </div>
        </div>

        <BookingFlow />
      </Section>
    </>
  );
}
