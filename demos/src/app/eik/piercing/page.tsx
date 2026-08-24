import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Section, SpecRule, WorkFigure } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { eikAftercarePiercing, eikStudio } from "@/data/eik";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Piercing i Tønsberg | Eik Tattoo",
  description:
    "Piercing i Tønsberg. Implantatgodkjente smykker, oppgitt tilhelingstid for hvert sted, og ettersyn etter første måned. Bestill time på nett.",
  path: "/eik/piercing",
  siteName: "Eik Tattoo & Piercing",
});

/**
 * Piercing is Eik's uncontested keyword: the market leader (Sniki) shows no piercing
 * offer at all, and Alien's mentions it without giving it a page. This is the single
 * clearest local-SEO opening available to this client.
 */
const HEALING = [
  { k: "Øreflipp", v: "6–8 uker" },
  { k: "Helix", v: "4–6 måneder" },
  { k: "Conch", v: "6–9 måneder" },
  { k: "Tragus", v: "4–6 måneder" },
  { k: "Nese", v: "3–6 måneder" },
  { k: "Septum", v: "6–8 uker" },
  { k: "Navle", v: "6–12 måneder" },
];

export default function PiercingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Piercing", path: "/eik/piercing" },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          studio: eikStudio,
          name: "Piercing",
          description:
            "Piercing i Tønsberg med implantatgodkjente smykker og oppfølging gjennom tilhelingen.",
          path: "/eik/piercing",
        })}
      />

      <section className="eik-hero">
        <div className="eik-shell">
          <SpecRule left="01 — Piercing" right="Eikveien 64a · Tønsberg" />
          <div className="eik-hero__grid">
            <Reveal>
              <p className="eik-meta eik-hero__eyebrow">Tjeneste</p>
              <h1 className="eik-display eik-h1">Piercing i Tønsberg</h1>
              <p className="eik-lead" style={{ marginTop: "1.5rem" }}>
                Piercing er et eget håndverk, ikke noe vi gjør ved siden av. Du får vite
                tilhelingstid, hva du skal gjøre etterpå, og når du kan bytte smykke — før du
                setter deg.
              </p>
              <div className="eik-hero__cta">
                <Link href="/eik/booking" className="eik-btn eik-btn--primary">
                  Bestill piercingtime
                </Link>
                <a href="#tilheling" className="eik-btn eik-btn--ghost">
                  Se tilhelingstider
                </a>
                <DemoNote id="eik.09" />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <WorkFigure ratio="4:5" style="Piercing" placement="Leveres av Eik" meta="SMYKKEUTVALG" />
            </Reveal>
          </div>
        </div>
      </section>

      <Section variant="sunk" rule={{ left: "02 — Smykker", right: "Materiale og utvalg" }}>
        <div className="eik-split">
          <p className="eik-meta">Hva vi bruker</p>
          <div>
            <h2 className="eik-display eik-h2">Smykket avgjør hvordan det gror.</h2>
            <p className="eik-body" style={{ marginTop: "1rem" }}>
              Vi bruker implantatgodkjent materiale i førstegangspiercinger. Billige smykker er
              den vanligste grunnen til at en piercing ikke gror, og til at folk gir opp og tar
              den ut.
            </p>
            <dl className="eik-deflist" style={{ marginTop: "1.5rem" }}>
              <div>
                <dt>Materialer</dt>
                <dd><span className="eik-pending">Utvalg bekreftes av studioet</span></dd>
              </div>
              <div>
                <dt>Priser</dt>
                <dd><span className="eik-pending">Prisliste bekreftes av studioet</span></dd>
              </div>
              <div>
                <dt>Bytte av smykke</dt>
                <dd>Etter endt tilhelingstid. Spør oss først — vi hjelper deg gratis.</dd>
              </div>
              <div>
                <dt>Aldersgrense</dt>
                <dd><span className="eik-pending">Regler under 18 år bekreftes</span></dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section id="tilheling" rule={{ left: "03 — Tilhelingstid", right: "Omtrentlige tider" }}>
        <div className="eik-split">
          <p className="eik-meta">Hvor lang tid tar det</p>
          <div>
            <h2 className="eik-display eik-h2">Regn med lengre tid enn du tror.</h2>
            <p className="eik-body" style={{ marginTop: "1rem" }}>
              Tidene under er omtrentlige og gjelder normal tilheling. Brusk gror alltid
              saktere enn hud. Du får oppgitt tid for akkurat din piercing når du er her.
            </p>
            <dl className="eik-deflist" style={{ marginTop: "1.5rem" }}>
              {HEALING.map((h) => (
                <div key={h.k}>
                  <dt>{h.k}</dt>
                  <dd>{h.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section variant="ink" rule={{ left: "04 — Stell", right: "De første ukene" }}>
        <ol className="eik-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {eikAftercarePiercing.map((item) => (
            <li key={item.n} className="eik-step">
              <span className="eik-step__n">{item.n}</span>
              <span className="eik-step__title" style={{ color: "var(--bone)" }}>{item.title}</span>
              <span className="eik-step__body" style={{ color: "rgba(244,241,234,0.72)" }}>
                {item.body}
              </span>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/eik/etterbehandling" className="eik-link">
            Full veiledning for etterbehandling →
          </Link>
        </p>
      </Section>

      <Section variant="sunk">
        <div className="eik-cta-band">
          <div>
            <h2 className="eik-display eik-h2">Bestill piercingtime</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Velg hva du vil ha og når det passer. Du får svar med ledig tid og pris.
            </p>
          </div>
          <p>
            <Link href="/eik/booking" className="eik-btn eik-btn--primary">
              Bestill time
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
