import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Section, SpecRule, WorkFigure } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { eikPortfolio, eikProcess, eikStudio } from "@/data/eik";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tatovering i Tønsberg | Eik Tattoo",
  description:
    "Tatovering i Tønsberg — fra små finelinearbeider til større motiver over flere økter. Send inn idéen din og få forslag, prisramme og ledige tider tilbake.",
  path: "/eik/tatovering",
  siteName: "Eik Tattoo & Piercing",
});

const PRICE_FACTORS = [
  { k: "Størrelse", v: "Jo større flate, jo flere timer." },
  { k: "Detaljnivå", v: "Tynne linjer og skygge tar lengre tid enn massiv svart." },
  { k: "Plassering", v: "Ribbein, hender og hals er mer krevende enn underarm." },
  { k: "Antall økter", v: "Store arbeider deles opp, og prises per økt." },
];

export default function TatoveringPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Tatovering", path: "/eik/tatovering" },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          studio: eikStudio,
          name: "Tatovering",
          description:
            "Tatovering i Tønsberg. Idésamtale, skisse og avtalt prisramme før timen settes.",
          path: "/eik/tatovering",
        })}
      />

      <section className="eik-hero">
        <div className="eik-shell">
          <SpecRule left="01 — Tatovering" right="Eikveien 64a · Tønsberg" />
          <div className="eik-hero__grid">
            <Reveal>
              <p className="eik-meta eik-hero__eyebrow">Tjeneste</p>
              <h1 className="eik-display eik-h1">Tatovering i Tønsberg</h1>
              <p className="eik-lead" style={{ marginTop: "1.5rem" }}>
                Vi tegner opp arbeidet før vi begynner, og du får se skissen før nålen kommer
                fram. Du skal aldri sitte i stolen og lure på hva som skjer.
              </p>
              <div className="eik-hero__cta">
                <Link href="/eik/booking" className="eik-btn eik-btn--primary">
                  Send inn idéen din
                </Link>
                <Link href="/eik/portefolje" className="eik-btn eik-btn--ghost">
                  Se arbeider
                </Link>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <WorkFigure ratio="4:5" style="Signaturarbeid" placement="Leveres av Eik" meta="TATOVERING" />
            </Reveal>
          </div>
        </div>
      </section>

      <Section variant="sunk" rule={{ left: "02 — Første tatovering", right: "Vanlige spørsmål før du tør" }}>
        <div className="eik-split">
          <p className="eik-meta">For deg som ikke har gjort det før</p>
          <div>
            <h2 className="eik-display eik-h2">Du trenger ikke ha alt klart.</h2>
            <p className="eik-body" style={{ marginTop: "1rem" }}>
              De aller fleste som tar kontakt har en retning, ikke en ferdig tegning. Det holder
              lenge. Beskriv motivet, hvor det skal sitte og omtrent hvor stort — så tegner vi
              opp resten sammen med deg.
            </p>
            <p className="eik-body">
              Det svir, men det er til å holde ut, og vi tar pauser når du trenger det. Spis før
              du kommer. Ikke kom bakfull. Du kan ta med deg én person.
              <DemoNote id="eik.12" />
            </p>
          </div>
        </div>
      </Section>

      <Section rule={{ left: "03 — Pris", right: "Hva som avgjør" }}>
        <div className="eik-split">
          <p className="eik-meta">Prisgrunnlag</p>
          <div>
            <h2 className="eik-display eik-h2">Du får prisrammen før du sier ja.</h2>
            <p className="eik-body" style={{ marginTop: "1rem" }}>
              Vi setter aldri i gang uten at du vet hva det kommer til å koste. Fire ting avgjør
              prisen:
            </p>
            <dl className="eik-deflist" style={{ marginTop: "1.5rem" }}>
              {PRICE_FACTORS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
              <div>
                <dt>Timepris</dt>
                <dd>
                  <span className="eik-pending">Bekreftes av studioet</span>
                </dd>
              </div>
              <div>
                <dt>Minstepris</dt>
                <dd>
                  <span className="eik-pending">Bekreftes av studioet</span>
                </dd>
              </div>
            </dl>
            <p className="eik-meta" style={{ marginTop: "1rem" }}>
              Pris som egen seksjon
              <DemoNote id="eik.13" />
            </p>
          </div>
        </div>
      </Section>

      <Section variant="ink" rule={{ left: "04 — Fra idé til ferdig", right: "Fem steg" }}>
        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikProcess.slice(0, 4).map((step) => (
            <li key={step.n} className="eik-step">
              <span className="eik-step__n">{step.n}</span>
              <span className="eik-step__title" style={{ color: "var(--bone)" }}>{step.title}</span>
              <span className="eik-step__body" style={{ color: "rgba(244,241,234,0.72)" }}>
                {step.body}
              </span>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/eik/prosess" className="eik-link">
            Hele prosessen, steg for steg →
          </Link>
        </p>
      </Section>

      <Section rule={{ left: "05 — Utvalgte arbeider", right: "Tatovering" }}>
        <ul className="eik-grid">
          {eikPortfolio
            .filter((p) => p.style !== "Piercing")
            .slice(0, 6)
            .map((item, i) => (
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

      <Section variant="sunk">
        <div className="eik-cta-band">
          <div>
            <h2 className="eik-display eik-h2">Klar til å sende inn idéen?</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Fem minutter nå sparer deg for en uke med meldinger fram og tilbake.
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
