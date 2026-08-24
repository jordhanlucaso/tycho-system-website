import { forClient } from "@/data/types";
import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Anno, Section } from "@/components/stabukk/StabukkPrimitives";
import { PlateStack } from "@/components/stabukk/PlateStack";
import { JsonLd } from "@/components/shared/JsonLd";
import { stabukkPortfolio, stabukkPortfolioStyles } from "@/data/stabukk";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Arbeider — tatovering Tønsberg | Stabukk",
  description:
    "Arbeider fra Stabukk Tattoo Studio i Tønsberg. Blackwork, ornamental, fineline og illustrativ tatovering — filtrer på retning og se hver plate i full størrelse.",
  path: "/stabukk/arbeider",
  siteName: "Stabukk Tattoo Studio",
});

export default function ArbeiderPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stabukk Tattoo Studio", path: "/stabukk" },
          { name: "Arbeider", path: "/stabukk/arbeider" },
        ])}
      />

      <Section>
        <Anno reg>Plate 01 — Arbeider</Anno>
        <h1
          className="sbk-display sbk-d1"
          style={{ margin: "1.25rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          Arbeider
        </h1>
        <p className="sbk-lead" style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          Filtrer på retning. Trykk på en plate for full visning — piltaster og sveip fungerer.
          <DemoNote id="sbk.01" />
        </p>

        <PlateStack items={forClient(stabukkPortfolio)} styles={stabukkPortfolioStyles} />
      </Section>

      <Section variant="paper">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <h2 className="sbk-display sbk-d2">Vil du ha noe lignende?</h2>
            <p className="sbk-body" style={{ marginTop: "1rem" }}>
              Send inn forespørselen, så svarer vi med omfang, antall økter og prisramme.
            </p>
          </div>
          <Link href="/stabukk/booking" className="sbk-btn">
            Send forespørsel →
          </Link>
        </div>
      </Section>
    </>
  );
}
