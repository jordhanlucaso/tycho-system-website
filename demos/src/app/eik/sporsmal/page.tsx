import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Section, SpecRule } from "@/components/eik/EikPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { eikFaq } from "@/data/eik";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Spørsmål og svar | Eik Tønsberg",
  description:
    "Vanlige spørsmål om tatovering og piercing i Tønsberg: pris, aldersgrense, smerte, cover-up, forberedelser og hvordan du bestiller time hos Eik.",
  path: "/eik/sporsmal",
  siteName: "Eik Tattoo & Piercing",
});

export default function SporsmalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Eik Tattoo & Piercing", path: "/eik" },
          { name: "Spørsmål og svar", path: "/eik/sporsmal" },
        ])}
      />
      {/* Only client-approved answers are published as FAQPage markup. */}
      <JsonLd data={faqJsonLd(eikFaq)} />

      <Section>
        <SpecRule left="01 — Spørsmål og svar" right="Tatovering og piercing" />
        <div className="eik-split" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
          <p className="eik-meta">FAQ</p>
          <div>
            <h1 className="eik-display eik-h1">Spørsmål og svar</h1>
            <p className="eik-lead" style={{ marginTop: "1.25rem" }}>
              De spørsmålene folk faktisk stiller — svart på her, så du slipper å spørre.
              <DemoNote id="eik.11" />
            </p>
          </div>
        </div>

        <div className="eik-faq">
          {eikFaq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <div className="eik-faq__answer">
                <p>{item.a}</p>
                {item.demo ? (
                  <p className="eik-pending" style={{ marginTop: "0.75rem" }}>
                    Svaret bekreftes av studioet
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section variant="sunk">
        <div className="eik-cta-band">
          <div>
            <h2 className="eik-display eik-h2">Fant du ikke svaret?</h2>
            <p className="eik-body" style={{ marginTop: "0.75rem" }}>
              Skriv spørsmålet i skjemaet, så svarer vi deg direkte.
            </p>
          </div>
          <p>
            <Link href="/eik/booking" className="eik-btn eik-btn--primary">
              Send inn spørsmål eller idé
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
