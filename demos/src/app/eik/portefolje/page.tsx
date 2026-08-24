import { forClient } from "@/data/types";
import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Section, SpecRule } from "@/components/eik/EikPrimitives";
import { PortfolioGrid } from "@/components/eik/PortfolioGrid";
import { JsonLd } from "@/components/shared/JsonLd";
import { eikPortfolio, eikPortfolioStyles } from "@/data/eik";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Portefølje — tatovering Tønsberg | Eik",
  description:
    "Arbeider fra Eik Tattoo & Piercing i Tønsberg. Filtrer på stil — fineline, botanisk, blackwork, ornamental, cover-up og piercing.",
  path: "/eik/portefolje",
  siteName: "Eik Tattoo & Piercing",
});

export default function PortfoliePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Portefølje", path: "/eik/portefolje" },
        ])}
      />

      <Section>
        <SpecRule left="01 — Portefølje" right="Alle arbeider" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Arbeider</p>
          <div>
            <h1 className="eik-display eik-h1">Arbeider</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              Filtrer på stil for å se om vi lager den typen arbeid du har i tankene. Trykk på
              et bilde for større visning.
            </p>
            <p className="eik-meta" style={{ marginTop: "1rem" }}>
              Bilder leveres av studioet
              <DemoNote id="eik.10" />
            </p>
          </div>
        </div>

        <PortfolioGrid items={forClient(eikPortfolio)} styles={eikPortfolioStyles} />
      </Section>

      <Section variant="sunk">
        <div className="eik-cta-band">
          <div>
            <h2 className="eik-display eik-h2">Så du noe som lignet?</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Send inn idéen din, så sier vi hva som er mulig — og hva det vil koste.
            </p>
          </div>
          <p>
            <Link href="/eik/booking" className="eik-btn eik-btn--primary">
              Send inn idéen din
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
