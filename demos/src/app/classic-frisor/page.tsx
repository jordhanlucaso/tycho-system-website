import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import {
  DemoBand,
  FotoBrief,
  Mangler,
  NapPlate,
  PrisRad,
  Seksjon,
} from "@/components/classic-frisor/Primitives";
import {
  heroBrief,
  processSteps,
  salon,
  treatments,
  workBriefs,
} from "@/data/classic-frisor";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frisør på Teie, Nøtterøy — Classic Frisør",
  description:
    "Frisørsalong i Smidsrødveien på Teie. Klipp, farge og styling. Se hva det koster og hvor lang tid det tar, og bestill time.",
  path: "/classic-frisor",
  siteName: "Classic Frisør",
});

/** The six treatments shown on the homepage — the rest live on /behandlinger. */
const forsideBehandlinger = treatments.slice(0, 6);

export default function Forsiden() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────────────
          Answers the three things a person on a phone needs in the first viewport:
          what kind of business, where it is, and what to do next. Nothing above the
          booking action but the name of the service and the name of the street. */}
      <section className="cf-band cf-band--dyp cf-band--flush">
        <div className="cf-shell cf-hero-rutenett">
          <div>
          <p className="cf-eyebrow">Smidsrødveien · Teie · Nøtterøy</p>
          <h1 className="cf-d1">
            Frisør på Teie
            <DemoNote id="cf.01" />
          </h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            Klipp, farge og styling i Smidsrødveien. Én stol, samme frisør hver gang.
          </p>

          <div className="cf-btn-rad" style={{ marginTop: "2rem" }}>
            <Link href="/classic-frisor/bestill-time" className="cf-btn cf-btn--primar">
              Bestill time
            </Link>
            <Link href="/classic-frisor/behandlinger" className="cf-btn cf-btn--sekundar">
              Se behandlinger
            </Link>
          </div>

          <p className="cf-data" style={{ marginTop: "2rem" }}>
            Åpningstider: <Mangler>Ikke bekreftet</Mangler>
          </p>
          </div>

          <div className="cf-hero-ramme">
            <FotoBrief brief={heroBrief.brief} token={heroBrief.token} ratio={heroBrief.ratio} />
          </div>
        </div>
      </section>

      {/* ── Treatments + prices ──────────────────────────────────────────────────────
          The signature element. Competitive analysis §6 found that no salon in this
          market publishes prices — so the most distinctive thing on this page is the
          salon answering the question everyone else avoids. */}
      <section className="cf-band">
        <div className="cf-shell">
          <Seksjon n="01" merke="Behandlinger">
            <div className="cf-kolonner">
              <div>
                <h2 className="cf-d2">Hva det koster, før du ringer</h2>
                <p className="cf-lead" style={{ marginTop: "1rem" }}>
                  Pris og tid står ved hver behandling. Du skal slippe å ringe for å finne
                  ut om du har råd eller rekker det i lunsjen.
                  <DemoNote id="cf.02" />
                </p>
              </div>

              <div>
                <DemoBand merke="Eksempel — behandlinger og priser ikke bekreftet">
                  <ul className="cf-prisliste">
                    {forsideBehandlinger.map((t) => (
                      <PrisRad
                        key={t.id}
                        navn={t.name}
                        minutter={t.minutes}
                        pris={t.fromPrice}
                      />
                    ))}
                  </ul>
                </DemoBand>

                <p style={{ marginTop: "1.25rem" }}>
                  <Link href="/classic-frisor/behandlinger" className="cf-lenke">
                    Se alle behandlinger →
                  </Link>
                </p>
              </div>
            </div>
          </Seksjon>
        </div>
      </section>

      {/* ── Why here ─────────────────────────────────────────────────────────────────
          Verified differentiators only. The one genuinely defensible claim available
          today is the street itself — six salons, and this is the one you walked past. */}
      <section className="cf-band cf-band--alt">
        <div className="cf-shell">
          <Seksjon n="02" merke="Hvorfor her">
            <div className="cf-kolonner cf-kolonner--smal">
              <div>
                <h2 className="cf-d2">Salongen i gata di</h2>
              </div>
              <div>
                <p>
                  Det er seks frisører i Smidsrødveien. Vi er den du går forbi — ikke den du
                  må kjøre til.
                  <DemoNote id="cf.03" />
                </p>
                <p>
                  Én stol betyr at det er samme person som klipper deg hver gang. Du slipper
                  å forklare håret ditt på nytt.
                </p>
                <p style={{ color: "var(--espresso-myk)" }}>
                  Alt annet vi kunne skrevet her — år i bransjen, utdanning, spesialfelt —
                  står tomt til salongen har bekreftet det. <Mangler>Venter på svar</Mangler>
                </p>
              </div>
            </div>
          </Seksjon>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────────────────────────────────────── */}
      <section className="cf-band">
        <div className="cf-shell">
          <Seksjon n="03" merke="Arbeid">
            <h2 className="cf-d2">Ekte bilder, ikke bildebank</h2>
            <p className="cf-lead" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
              Rammene under viser nøyaktig hvilke bilder som skal tas. Ingenting her er hentet
              fra en konkurrent eller en bildebank.
              <DemoNote id="cf.04" />
            </p>

            <div className="cf-galleri">
              {workBriefs.slice(0, 3).map((w) => (
                <FotoBrief key={w.id} brief={w.brief} token={w.token} ratio={w.ratio} />
              ))}
            </div>

            <p style={{ marginTop: "1.5rem" }}>
              <Link href="/classic-frisor/arbeid" className="cf-lenke">
                Se hele bildeplanen →
              </Link>
            </p>
          </Seksjon>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────────────── */}
      <section className="cf-band cf-band--alt">
        <div className="cf-shell">
          <Seksjon n="04" merke="Slik gjør vi det">
            <ol className="cf-steg">
              {processSteps.map((s) => (
                <li key={s.n}>
                  <span className="cf-steg__n">{s.n}</span>
                  <h3 className="cf-d3">{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </Seksjon>
        </div>
      </section>

      {/* ── Location + final CTA ─────────────────────────────────────────────────── */}
      <section className="cf-band cf-band--dyp">
        <div className="cf-shell">
          <Seksjon n="05" merke="Finn oss">
            <div className="cf-kolonner">
              <div>
                <h2 className="cf-d2">Smidsrødveien, Teie</h2>
                <p className="cf-lead" style={{ marginTop: "1rem" }}>
                  {salon.streetSalonCount} frisører deler denne gata. Vi er den som er lettest
                  å finne fram til — og å bestille time hos.
                  <DemoNote id="cf.05" />
                </p>
                <div className="cf-btn-rad" style={{ marginTop: "1.75rem" }}>
                  <Link href="/classic-frisor/bestill-time" className="cf-btn cf-btn--primar">
                    Bestill time
                  </Link>
                  <Link href="/classic-frisor/kontakt" className="cf-btn cf-btn--sekundar">
                    Kontakt
                  </Link>
                </div>
              </div>

              <NapPlate />
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
