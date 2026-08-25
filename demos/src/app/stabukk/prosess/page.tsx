import Link from "next/link";
import { Anno, Section } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { stabukkAftercare, stabukkProcess } from "@/data/stabukk";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prosess og etterbehandling | Stabukk",
  description:
    "Slik jobber Stabukk i Tønsberg: fra forespørsel og skisse til økter og tilheling. Full veiledning for etterbehandling av fersk tatovering.",
  path: "/stabukk/prosess",
  siteName: "Stabukk Tattoo Studio",
});

export default function ProsessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stabukk Tattoo Studio", path: "/stabukk" },
          { name: "Prosess", path: "/stabukk/prosess" },
        ])}
      />

      <Section>
        <Anno reg>Plate 01 — Prosess</Anno>
        <h1 className="sbk-display sbk-d1" style={{ margin: "1.25rem 0 clamp(2rem, 5vw, 3.5rem)" }}>
          Prosess
        </h1>

        <ol className="sbk-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {stabukkProcess.map((step) => (
            <li key={step.n} className="sbk-step">
              <span className="sbk-step__n" aria-hidden="true">
                {step.n}
              </span>
              <div>
                <h2 className="sbk-step__title">{step.title}</h2>
                <p className="sbk-body">{step.body}</p>
                {step.meta ? (
                  <p className="sbk-anno" style={{ marginTop: "0.75rem" }}>
                    {step.meta === "SVARTID: TO_CONFIRM" ? "SVARTID BEKREFTES AV STUDIOET" : step.meta}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section variant="paper" id="etterbehandling">
        <Anno reg>Plate 02 — Etterbehandling</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.25rem 0 clamp(2rem, 5vw, 3rem)" }}>
          Tilheling
        </h2>
        <p className="sbk-body" style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
          De to første ukene avgjør hvordan arbeidet ser ut resten av livet.
        </p>

        <ol className="sbk-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {stabukkAftercare.map((item) => (
            <li key={item.n} className="sbk-step">
              <span className="sbk-step__n" aria-hidden="true">
                {item.n}
              </span>
              <div>
                <h3 className="sbk-step__title">{item.title}</h3>
                <p className="sbk-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="sbk-body" style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
          Er du i tvil om noe ser normalt ut: send oss et bilde. Ved feber eller rødhet som brer
          seg, kontakt lege.
        </p>
      </Section>

      <Section variant="raise">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <h2 className="sbk-display sbk-d2">
            Steg én
            <br />
            tar fem minutter
          </h2>
          <Link href="/stabukk/booking" className="sbk-btn">
            Send forespørsel →
          </Link>
        </div>
      </Section>
    </>
  );
}
