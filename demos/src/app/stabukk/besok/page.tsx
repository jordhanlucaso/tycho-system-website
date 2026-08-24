import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Anno, Plate, Section, StudioFacts } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { stabukkFaq } from "@/data/stabukk";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Besøk oss i Tønsberg | Stabukk",
  description:
    "Slik finner du Stabukk Tattoo Studio i Tønsberg sentrum: adresse, åpningstider, aldersgrense og svar på de vanligste spørsmålene før du booker.",
  path: "/stabukk/besok",
  siteName: "Stabukk Tattoo Studio",
});

export default function BesokPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stabukk Tattoo Studio", path: "/stabukk" },
          { name: "Besøk", path: "/stabukk/besok" },
        ])}
      />
      <JsonLd data={faqJsonLd(stabukkFaq)} />

      <Section>
        <Anno reg>Plate 01 — Besøk</Anno>
        <h1
          className="sbk-display sbk-d1 sbk-d1--long"
          style={{ margin: "1.25rem 0 clamp(2rem, 5vw, 3rem)" }}
        >
          Møllegaten
          <br />4
        </h1>

        <div style={{ display: "grid", gap: "clamp(2rem, 5vw, 4rem)" }}>
          <p className="sbk-lead">
            Tønsberg sentrum, fem minutter fra Torvet. Hverdager mellom ti og fire, kveldstimer
            etter avtale.
          </p>

          <Reveal className="sbk-item sbk-item--c">
            <Plate ratio="16:9" number="01" label="Fasade / inngang" spec={["Leveres av Stabukk"]} />
            <div className="sbk-item__cap">
              <span className="sbk-anno sbk-anno--reg">Plate 01</span>
              <span className="sbk-anno">Møllegaten 4 / 3111 Tønsberg</span>
            </div>
          </Reveal>

          <StudioFacts />

          <p className="sbk-anno">
            Kart legges inn når adressen er bekreftet mot Google-profilen
            <DemoNote id="sbk.02" />
          </p>
        </div>
      </Section>

      <Section variant="paper">
        <Anno reg>Plate 02 — Spørsmål</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.25rem 0 clamp(2rem, 5vw, 3rem)" }}>
          Spørsmål og svar
        </h2>

        <div className="sbk-faq">
          {stabukkFaq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <div className="sbk-faq__a">
                <p>{item.a}</p>
                {item.demo ? (
                  <p className="sbk-pending" style={{ marginTop: "0.75rem" }}>
                    Svaret bekreftes av studioet
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>

        <p style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}>
          <Link href="/stabukk/booking" className="sbk-btn">
            Send forespørsel →
          </Link>
        </p>
      </Section>
    </>
  );
}
