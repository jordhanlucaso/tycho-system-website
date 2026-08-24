import Link from "next/link";
import { Section, SpecRule } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { eikProcess } from "@/data/eik";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Slik jobber vi — idé til time | Eik",
  description:
    "Fra idé til ferdig tatovering hos Eik i Tønsberg: hva skjer i idésamtalen, hvordan skissen lages, hva som avtales før timen, og hva som skjer etterpå.",
  path: "/eik/prosess",
  siteName: "Eik Tattoo & Piercing",
});

const PREP = [
  "Spis et ordentlig måltid før du kommer.",
  "Sov natten før. Trøtt hud og trøtt hode gjør timen tyngre.",
  "Ikke drikk alkohol dagen før eller samme dag.",
  "Ta med legitimasjon. Aldersgrensen er 18 år.",
  "Ha på klær som gir lett tilgang til stedet, og som tåler litt blekk.",
  "Sett av mer tid enn du tror. Vi jobber ikke fortere for å rekke noe.",
];

export default function ProsessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Slik jobber vi", path: "/eik/prosess" },
        ])}
      />

      <Section>
        <SpecRule left="01 — Slik jobber vi" right="Fra idé til ferdig" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Prosess</p>
          <div>
            <h1 className="eik-display eik-h1">Slik jobber vi</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              Fem steg fra du sender inn en idé til tatoveringen er grodd. Du skal vite hva som
              skjer på hvert av dem.
            </p>
          </div>
        </div>

        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikProcess.map((step) => (
            <li key={step.n} className="eik-step">
              <span className="eik-step__n">{step.n}</span>
              <span className="eik-step__title">{step.title}</span>
              <span>
                <span className="eik-step__body" style={{ display: "block" }}>
                  {step.body}
                </span>
                {step.meta ? (
                  <span className="eik-meta eik-step__meta" style={{ display: "block" }}>
                    {step.meta === "SVARTID: TO_CONFIRM" ? "SVARTID BEKREFTES AV STUDIOET" : step.meta}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="sunk" rule={{ left: "02 — Før timen", right: "Forberedelser" }}>
        <div className="eik-split">
          <p className="eik-meta">Sjekkliste</p>
          <div>
            <h2 className="eik-display eik-h2">Slik forbereder du deg.</h2>
            <ul className="eik-card__list" style={{ marginTop: "1.25rem", gap: "0.85rem" }}>
              {PREP.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section variant="ink">
        <div className="eik-cta-band">
          <div>
            <h2 className="eik-display eik-h2" style={{ color: "var(--bone)" }}>
              Steg én tar fem minutter.
            </h2>
            <p className="eik-body" style={{ marginTop: "0.75rem", color: "rgba(244,241,234,0.78)" }}>
              Beskriv idéen din, så tar vi det derfra.
            </p>
          </div>
          <p style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/eik/booking" className="eik-btn eik-btn--primary">
              Send inn idéen din
            </Link>
            <Link href="/eik/sporsmal" className="eik-btn eik-btn--ghost">
              Spørsmål og svar
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
