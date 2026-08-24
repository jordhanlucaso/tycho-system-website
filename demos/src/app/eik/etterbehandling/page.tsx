import Link from "next/link";
import { Section, SpecRule } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { eikAftercarePiercing, eikAftercareTattoo } from "@/data/eik";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Etterbehandling tatovering | Eik",
  description:
    "Slik steller du en fersk tatovering eller piercing: vask, salve, hva du skal unngå, tilhelingstid og når du bør ta kontakt med studioet eller lege.",
  path: "/eik/etterbehandling",
  siteName: "Eik Tattoo & Piercing",
});

export default function EtterbehandlingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Etterbehandling", path: "/eik/etterbehandling" },
        ])}
      />

      <Section>
        <SpecRule left="01 — Etterbehandling" right="Tatovering og piercing" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Stell</p>
          <div>
            <h1 className="eik-display eik-h1">Etterbehandling</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              De to første ukene avgjør hvordan arbeidet ser ut resten av livet. Her er alt du
              trenger — og du kan alltid kontakte oss hvis noe ser feil ut.
            </p>
          </div>
        </div>

        <h2 className="eik-display eik-h2" style={{ marginBottom: "1.25rem" }}>
          Tatovering
        </h2>
        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikAftercareTattoo.map((item) => (
            <li key={item.n} className="eik-step">
              <span className="eik-step__n">{item.n}</span>
              <span className="eik-step__title">{item.title}</span>
              <span className="eik-step__body">{item.body}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="sunk" rule={{ left: "02 — Piercing", right: "Tilheling" }}>
        <h2 className="eik-display eik-h2" style={{ marginBottom: "1.25rem" }}>
          Piercing
        </h2>
        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikAftercarePiercing.map((item) => (
            <li key={item.n} className="eik-step">
              <span className="eik-step__n">{item.n}</span>
              <span className="eik-step__title">{item.title}</span>
              <span className="eik-step__body">{item.body}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="ink">
        <div className="eik-split">
          <p className="eik-meta">Viktig</p>
          <div>
            <h2 className="eik-display eik-h2" style={{ color: "var(--bone)" }}>
              Er du i tvil, spør oss.
            </h2>
            <p className="eik-body" style={{ marginTop: "1rem", color: "rgba(244,241,234,0.78)" }}>
              Det koster ingenting å sende et bilde og spørre om noe ser normalt ut. Vi vil mye
              heller svare på ti unødvendige spørsmål enn å oppdage en infeksjon for sent.
            </p>
            <p className="eik-body" style={{ color: "rgba(244,241,234,0.78)" }}>
              Ved feber, kraftig hevelse eller rødhet som brer seg: kontakt lege. Det er ikke
              vanlig tilheling.
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              <Link href="/eik/booking" className="eik-btn eik-btn--primary">
                Kontakt studioet
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
