import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import {
  PlaceholderFrame,
  Pending,
  Section,
  SpecRule,
  StudioDetails,
  WorkFigure,
} from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import {
  eikArtists,
  eikHero,
  eikPortfolio,
  eikProcess,
  eikServices,
  eikStudio,
  eikTrustPoints,
} from "@/data/eik";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tatovering og piercing i Tønsberg | Eik Tattoo & Piercing",
  description:
    "Tatovering og piercing i Tønsberg. Send inn idéen din med bilder og mål — du får svar med forslag, størrelse og prisramme før du booker time.",
  path: "/eik",
  siteName: "Eik Tattoo & Piercing",
});

export default function EikHome() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Eik Tattoo & Piercing", path: "/eik" }])} />

      {/* ---------------- HERO ---------------- */}
      <section className="eik-hero">
        <div className="eik-shell">
          <SpecRule left={eikHero.rule.left} right={eikHero.rule.right} />

          <div className="eik-hero__grid">
            <Reveal>
              <p className="eik-meta eik-hero__eyebrow">{eikHero.eyebrow}</p>
              <h1 className="eik-display eik-h1">
                {eikHero.headline.map((line) => (
                  <span key={line} style={{ display: "block" }}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="eik-lead" style={{ marginTop: "1.5rem" }}>
                {eikHero.lead}
              </p>

              <div className="eik-hero__cta">
                <Link href={eikHero.primaryCta.href} className="eik-btn eik-btn--primary">
                  {eikHero.primaryCta.label}
                </Link>
                <Link href={eikHero.secondaryCta.href} className="eik-btn eik-btn--ghost">
                  {eikHero.secondaryCta.label}
                </Link>
                <DemoNote id="eik.03" />
              </div>
            </Reveal>

            <Reveal delay={80} className="eik-hero__figure">
              <figure className="eik-figure">
                <PlaceholderFrame
                  ratio="4:5"
                  spec={["Hovedbilde / studio eller signaturarbeid", "Leveres av Eik"]}
                />
                <figcaption>
                  <span>Eikveien 64a · Tønsberg</span>
                  <span>Etter avtale</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST ---------------- */}
      <Section variant="tight">
        <ul className="eik-trust">
          {eikTrustPoints.map((point) => {
            const unknown = point.value === "TO_CONFIRM";
            return (
              <li key={point.label} className="eik-trust__item">
                <p className="eik-meta">{point.label}</p>
                {unknown ? (
                  <p className="eik-trust__value" data-unknown="true">
                    Bekreftes av studioet
                  </p>
                ) : (
                  <p className="eik-trust__value">{point.value}</p>
                )}
                <p className="eik-trust__body">{point.body}</p>
              </li>
            );
          })}
        </ul>
        <p className="eik-meta" style={{ marginTop: "1.25rem" }}>
          Vurderingene hentes fra Google-profilen. Vi oppgir antallet slik det er.
          <DemoNote id="eik.04" />
        </p>
      </Section>

      {/* ---------------- SERVICES ---------------- */}
      <Section
        variant="sunk"
        rule={{ left: "01 — Hva vi gjør", right: "Tatovering · Piercing" }}
      >
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">To håndverk</p>
          <div>
            <h2 className="eik-display eik-h2">To ting, gjort ordentlig.</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Vi gjør tatovering og piercing, og vi behandler dem som to forskjellige fag med
              hver sin forberedelse, hvert sitt utstyr og hver sin tilheling.
            </p>
          </div>
        </div>

        <div className="eik-services">
          {eikServices.map((service, i) => (
            <Reveal key={service.id} delay={i * 70} className="eik-card">
              <p className="eik-meta">{service.n}</p>
              <h3 className="eik-display eik-h3">{service.title}</h3>
              <p className="eik-body" style={{ fontSize: "0.9688rem" }}>
                {service.lead}
              </p>
              <ul className="eik-card__list">
                {service.bullets.map((b) => (
                  <li key={b}>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="eik-card__foot">
                <Link href={service.href} className="eik-link">
                  Les om {service.title.toLowerCase()} →
                </Link>
              </p>
            </Reveal>
          ))}
        </div>

        <p className="eik-meta" style={{ marginTop: "1.5rem" }}>
          Egne sider for hver tjeneste
          <DemoNote id="eik.05" />
        </p>
      </Section>

      {/* ---------------- PORTFOLIO ---------------- */}
      <Section rule={{ left: "02 — Arbeider", right: "Utvalg" }}>
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Portefølje</p>
          <div>
            <h2 className="eik-display eik-h2">Se hva vi faktisk lager.</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Alle arbeidene er merket med stil, plassering og omtrentlig tidsbruk — så du vet
              hva du ser på, og omtrent hva ditt eget vil kreve.
              <DemoNote id="eik.06" />
            </p>
          </div>
        </div>

        <ul className="eik-grid">
          {eikPortfolio.slice(0, 6).map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 50}>
              <WorkFigure
                ratio={item.ratio}
                style={item.style}
                placement={item.placement}
                meta={item.meta}
              />
            </Reveal>
          ))}
        </ul>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/eik/portefolje" className="eik-link">
            Se hele porteføljen →
          </Link>
        </p>
      </Section>

      {/* ---------------- PROCESS ---------------- */}
      <Section
        variant="ink"
        rule={{ left: "03 — Slik jobber vi", right: "Fra idé til ferdig" }}
      >
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Fem steg</p>
          <div>
            <h2 className="eik-display eik-h2" style={{ color: "var(--bone)" }}>
              Du skal vite hva som skjer, før det skjer.
            </h2>
          </div>
        </div>

        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikProcess.map((step) => (
            <li key={step.n} className="eik-step">
              <span className="eik-step__n">
                {step.n}
              </span>
              <span className="eik-step__title" style={{ color: "var(--bone)" }}>
                {step.title}
              </span>
              <span>
                <span
                  className="eik-step__body"
                  style={{ color: "rgba(244,241,234,0.72)", display: "block" }}
                >
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

        <p style={{ marginTop: "2rem" }}>
          <Link href="/eik/prosess" className="eik-link">
            Mer om hvordan vi jobber →
          </Link>
        </p>
      </Section>

      {/* ---------------- ARTISTS ---------------- */}
      <Section rule={{ left: "04 — Tatovører", right: "Eik Tattoo & Piercing" }}>
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">Menneskene</p>
          <div>
            <h2 className="eik-display eik-h2">Du blir tatovert av en person, ikke et studio.</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Navn, stilarter og bilder legges inn av studioet. Vi publiserer ingen navn vi ikke
              har fått bekreftet.
              <DemoNote id="eik.07" />
            </p>
          </div>
        </div>

        <ul className="eik-artists">
          {eikArtists.map((artist, i) => (
            <Reveal as="li" key={artist.id} delay={i * 60} className="eik-artist">
              <PlaceholderFrame ratio="3:4" spec={["Portrett av tatovør", "Leveres av Eik"]} />
              <p className="eik-artist__name">Tatovør {i + 1}</p>
              <Pending label="Navn og stilart bekreftes" />
            </Reveal>
          ))}
        </ul>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/eik/artister" className="eik-link">
            Om tatovørene →
          </Link>
        </p>
      </Section>

      {/* ---------------- VISIT + CTA ---------------- */}
      <Section variant="sunk" rule={{ left: "05 — Besøk oss", right: eikStudio.addressDisplay }}>
        <div className="eik-details">
          <div>
            <h2 className="eik-display eik-h2" style={{ marginBottom: "1.25rem" }}>
              Studioet
            </h2>
            <StudioDetails />
            <p className="eik-meta" style={{ marginTop: "1rem" }}>
              Samme opplysninger overalt
              <DemoNote id="eik.08" />
            </p>
          </div>

          <div className="eik-cta-band">
            <div>
              <h2 className="eik-display eik-h2">Har du en idé?</h2>
              <p className="eik-body" style={{ marginTop: "0.75rem" }}>
                Beskriv den med et par setninger. Du får svar med forslag, prisramme og ledige
                tider — uten meldinger fram og tilbake.
              </p>
              <p style={{ marginTop: "1.5rem" }}>
                <Link href="/eik/booking" className="eik-btn eik-btn--primary">
                  Send inn idéen din
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
