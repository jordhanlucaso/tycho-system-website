import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { PlaceholderFrame, Pending, Section, SpecRule } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { eikArtists } from "@/data/eik";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tatovører i Tønsberg | Eik Tattoo",
  description:
    "Møt tatovørene hos Eik Tattoo & Piercing i Tønsberg. Stilarter, arbeider og hvem du bør velge for det du har i tankene.",
  path: "/eik/artister",
  siteName: "Eik Tattoo & Piercing",
});

export default function ArtisterPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Tatovører", path: "/eik/artister" },
        ])}
      />

      <Section>
        <SpecRule left="01 — Tatovører" right="Eik Tattoo & Piercing" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Menneskene</p>
          <div>
            <h1 className="eik-display eik-h1">Tatovørene</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              Du blir tatovert av en person, ikke av et studio. Her legger vi inn hvem som jobber
              her, hva de er best på, og hvilke arbeider som er deres.
            </p>
          </div>
        </div>

        <ul className="eik-artists">
          {eikArtists.map((artist, i) => (
            <Reveal as="li" key={artist.id} delay={i * 70} className="eik-artist">
              <PlaceholderFrame ratio="3:4" spec={["Portrett av tatovør", "Leveres av Eik"]} />
              <p className="eik-artist__name">Tatovør {i + 1}</p>
              <Pending label="Navn bekreftes" />
              <p className="eik-body" style={{ fontSize: "0.9375rem" }}>
                Stilarter, kort presentasjon og lenke til egen Instagram legges inn her.
              </p>
            </Reveal>
          ))}
        </ul>

        <div className="eik-card" style={{ marginTop: "clamp(2rem, 5vw, 3.5rem)", maxWidth: "760px" }}>
          <p className="eik-meta">Merknad fra Tycho Systems</p>
          <h2 className="eik-display eik-h3">Hvorfor står det ingen navn her?</h2>
          <p className="eik-body" style={{ fontSize: "0.9688rem" }}>
            Flere katalogsider på nett oppgir allerede navn på tatovører ved dette studioet. Vi
            fant dem hos én kilde som også skriver tydelig maskingenerert norsk, og en annen
            katalog beskriver studioet på en måte som direkte motsier den første. Vi publiserer
            ikke opplysninger om en virksomhet uten at virksomheten selv har bekreftet dem.
            <DemoNote id="eik.01" />
          </p>
          <p className="eik-card__foot">
            <Link href="/eik/booking" className="eik-link">
              Send inn idéen din — vi foreslår riktig tatovør →
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
