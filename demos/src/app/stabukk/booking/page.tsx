import { DemoNote } from "@/components/demo/DemoLayer";
import { EnquiryForm } from "@/components/stabukk/EnquiryForm";
import { Anno, Section } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book tatovering i Tønsberg | Stabukk",
  description:
    "Send inn forespørsel til Stabukk Tattoo Studio i Tønsberg. Beskriv arbeidet, omfang og plassering — du får svar med antall økter, ventetid og prisramme.",
  path: "/stabukk/booking",
  siteName: "Stabukk Tattoo Studio",
});

export default function BookingPage() {
  return (
    <Section>
      <Anno reg>Plate 00 — Forespørsel</Anno>
      <h1 className="sbk-display sbk-d1" style={{ margin: "1.25rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
        Book
      </h1>
      <p className="sbk-lead" style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
        Ett skjema, tre deler. Fyll ut så mye du klarer — jo mer vi vet, jo mer konkret blir
        svaret du får tilbake.
        <DemoNote id="sbk.03" />
      </p>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stabukk Tattoo Studio", path: "/stabukk" },
          { name: "Book", path: "/stabukk/booking" },
        ])}
      />

      <EnquiryForm />
    </Section>
  );
}
