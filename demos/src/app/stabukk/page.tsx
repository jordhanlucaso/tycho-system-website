import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Anno, Plate, Section, StudioFacts } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import {
  stabukkHero,
  stabukkIntro,
  stabukkPortfolio,
  stabukkProcess,
  stabukkStats,
} from "@/data/stabukk";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tatovering i Tønsberg | Stabukk Tattoo Studio",
  description:
    "Tatoveringsatelier i Møllegaten 4, Tønsberg sentrum. Vi tar få arbeider av gangen. Send inn en forespørsel og få svar med omfang, økter og prisramme.",
  path: "/stabukk",
  siteName: "Stabukk Tattoo Studio",
});

const MARQUEE_ITEMS = Array.from({ length: 6 }, () => stabukkHero.marquee);

export default function StabukkHome() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Stabukk Tattoo Studio", path: "/stabukk" }])} />

      {/* ---------------- HERO ---------------- */}
      <section className="sbk-hero sbk-bleed">
        <Anno reg>{stabukkHero.plate}</Anno>

        <h1 className="sbk-display sbk-d1 sbk-hero__word">{stabukkHero.word}</h1>

        <div className="sbk-hero__sub">
          {stabukkHero.sub.map((line) => (
            <Anno key={line}>{line}</Anno>
          ))}
        </div>

        <div className="sbk-hero__layout">
          <div>
            <p className="sbk-lead">{stabukkHero.lead}</p>
            <div className="sbk-hero__cta">
              <Link href={stabukkHero.cta.href} className="sbk-btn">
                {stabukkHero.cta.label}
              </Link>
              <Link href={stabukkHero.secondary.href} className="sbk-btn sbk-btn--line">
                {stabukkHero.secondary.label}
              </Link>
              <DemoNote id="sbk.04" />
            </div>
          </div>

          <Reveal className="sbk-hero__plate">
            <Plate
              ratio="4:5"
              number="00"
              spec={["Signaturarbeid", "Leveres av Stabukk"]}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="sbk-marquee" aria-hidden="true">
        <div className="sbk-marquee__track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ---------------- INTRO — paper spread ---------------- */}
      <Section variant="paper" ticks>
        <Anno reg>{stabukkIntro.plate}</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.5rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          {stabukkIntro.heading.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </h2>

        <div style={{ display: "grid", gap: "clamp(1.5rem,4vw,3rem)", gridTemplateColumns: "1fr" }}>
          <div style={{ maxWidth: "62ch" }}>
            {stabukkIntro.body.map((p) => (
              <p key={p} className="sbk-body">
                {p}
              </p>
            ))}
            <p className="sbk-anno" style={{ marginTop: "1.5rem" }}>
              {stabukkIntro.note}
              <DemoNote id="sbk.05" />
            </p>
          </div>

          <dl className="sbk-stats">
            {stabukkStats.map((stat) => (
              <div key={stat.k}>
                <dt className="sbk-anno">{stat.k}</dt>
                <dd>{stat.v}</dd>
                <p className="sbk-anno" style={{ marginTop: "0.5rem" }}>
                  {stat.meta}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ---------------- WORK ---------------- */}
      <Section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
            marginBottom: "clamp(2.5rem, 6vw, 4.5rem)",
          }}
        >
          <h2 className="sbk-display sbk-d2">Arbeider</h2>
          <Anno>Utvalg · {stabukkPortfolio.length} plater totalt</Anno>
        </div>

        <ul className="sbk-stack">
          {stabukkPortfolio.slice(0, 4).map((item, i) => {
            const width = ["a", "b", "c", "d"][i % 4];
            const plateNo = String(i + 1).padStart(2, "0");
            return (
              <Reveal as="li" key={item.id} className={`sbk-item sbk-item--${width}`}>
                <Plate
                  ratio={item.ratio}
                  number={plateNo}
                  spec={[`${item.style} / ${item.placement}`, item.meta]}
                />
                <div className="sbk-item__cap">
                  <span className="sbk-anno sbk-anno--reg">Plate {plateNo}</span>
                  <span className="sbk-anno">
                    {item.style} / {item.placement} / {item.meta} / {item.year}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <p style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}>
          <Link href="/stabukk/arbeider" className="sbk-link">
            Alle arbeider →
          </Link>
          <DemoNote id="sbk.06" />
        </p>
      </Section>

      {/* ---------------- PROCESS ---------------- */}
      <Section variant="raise">
        <Anno reg>Plate 02 — Prosess</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.5rem 0 clamp(2.5rem, 6vw, 4rem)" }}>
          Fra forespørsel
          <br />
          til ferdig arbeid
        </h2>

        <ol className="sbk-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {stabukkProcess.slice(0, 3).map((step) => (
            <li key={step.n} className="sbk-step">
              <span className="sbk-step__n" aria-hidden="true">
                {step.n}
              </span>
              <div>
                <h3 className="sbk-step__title">{step.title}</h3>
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

        <p style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}>
          <Link href="/stabukk/prosess" className="sbk-link">
            Hele prosessen →
          </Link>
        </p>
      </Section>

      {/* ---------------- VISIT — paper spread ---------------- */}
      <Section variant="paper">
        <Anno reg>Plate 03 — Besøk</Anno>
        <div
          style={{
            display: "grid",
            gap: "clamp(2rem, 5vw, 4rem)",
            marginTop: "1.5rem",
          }}
        >
          <h2 className="sbk-display sbk-d2">Møllegaten 4</h2>
          <div style={{ display: "grid", gap: "clamp(1.5rem, 4vw, 3rem)" }}>
            <StudioFacts />
            <div>
              <p className="sbk-body">
                Fem minutter fra Torvet. Vi holder åpent på hverdager mellom ti og fire, og tar
                kveldstimer etter avtale.
              </p>
              <p className="sbk-anno" style={{ marginTop: "1rem" }}>
                Samme opplysninger overalt
                <DemoNote id="sbk.07" />
              </p>
              <p style={{ marginTop: "2rem" }}>
                <Link href="/stabukk/booking" className="sbk-btn">
                  Send forespørsel →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
