import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, FotoBrief, Mangler, Plate, Seksjon } from "@/components/marine/Primitives";
import { business, registryActivity, yearsRegistered } from "@/data/marine";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Om Marine Max — båtservice på Nøtterøy siden 2005",
  description:
    "Marine Max er et enkeltpersonforetak i Bryggeveien 3B på Nøtterøy, registrert siden 2005. Reparasjon og vedlikehold av båter og båtmotorer.",
  path: "/marine-max/om-marine-max",
  siteName: "Marine Max",
});

export default function OmMarineMax() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Om Marine Max", path: "/marine-max/om-marine-max" },
        ])}
      />
      <Brodsmuler trail={[{ name: "Om Marine Max", path: "/marine-max/om-marine-max" }]} />

      <section className="mm-band mm-band--flush">
        <div className="mm-shell">
          <Seksjon n="01" merke="Om oss">
            <h1 className="mm-d1">Marine Max</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem" }}>
              Et enkeltpersonforetak i Bryggeveien 3B på Nøtterøy. Registrert og i drift siden
              2005 — {yearsRegistered()} år.
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Foretaket">
            <h2 className="mm-d2">Det som er dokumentert</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Marine Max ble registrert i Enhetsregisteret 10. november 2005, og har vært
                  registrert i Merverdiavgiftsregisteret siden september samme år. Foretaket
                  er registrert under næringskoden for reparasjon og vedlikehold av sivile skip
                  og båter.
                  <DemoNote id="mm.04" />
                </p>
                <p>
                  I registeret står denne beskrivelsen av virksomheten, slik den ble skrevet
                  ved registrering:
                </p>
                <blockquote
                  style={{
                    margin: "1.25rem 0",
                    paddingLeft: "1.25rem",
                    borderLeft: "2px solid var(--varsel)",
                    fontStyle: "italic",
                    color: "var(--blekk-svak)",
                  }}
                >
                  {registryActivity.map((line) => (
                    <p key={line} style={{ margin: 0 }}>
                      {line}
                    </p>
                  ))}
                </blockquote>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Teksten er over tjue år gammel og sier hva foretaket ble registrert for i
                  2005 — ikke nødvendigvis hva som utføres i dag. Derfor bruker vi den ikke som
                  tjenesteliste.
                </p>
              </div>

              <Plate
                title="Foretaksopplysninger"
                rows={[
                  { label: "Org.nr", value: business.orgNumber },
                  { label: "Form", value: business.orgForm },
                  { label: "Registrert", value: "10-11-2005" },
                  { label: "Næringskode", value: `${business.naceCode} — ${business.naceLabel}` },
                  { label: "Kilde", value: "Enhetsregisteret, brreg.no" },
                ]}
              />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Personen">
            <h2 className="mm-d2">Én person, hele veien</h2>
            <div className="mm-kolonner" style={{ marginTop: "1.5rem" }}>
              <div>
                <p>
                  Marine Max er et enkeltpersonforetak uten registrerte ansatte. Det betyr at
                  den som svarer når du ringer, er den samme som står ved motoren. Ingenting
                  går via en servicedisk, og ingenting blir borte mellom to ledd.
                </p>
                <p style={{ color: "var(--blekk-svak)" }}>
                  Her skal det stå noen linjer fra Trond selv, og et bilde av ham i verkstedet.
                  Vi dikter ikke opp en historie på hans vegne.
                  <DemoNote id="mm.05" />
                </p>
                <p style={{ marginTop: "1.25rem" }}>
                  <Mangler>Tekst og bilde fra Trond</Mangler>
                </p>
              </div>
              <FotoBrief
                brief="Portrett i verkstedet"
                ratio="3:4"
                note="Fotoliste nr. 1 — viktigst"
              />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="04" merke="Navnet">
            <h2 className="mm-d2">Om navnet</h2>
            <p style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              Det finnes et stort amerikansk båtfirma som heter MarineMax. Vi har ingen
              tilknytning til dem. Marine Max på Nøtterøy er et norsk enkeltpersonforetak,
              registrert i 2005, med org.nr {business.orgNumber}.
              <DemoNote id="mm.06" />
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="05" merke="Neste steg">
            <h2 className="mm-d2">Ta kontakt</h2>
            <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
                Ring {business.phoneDisplay}
              </a>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--sekundar">
                Bestill service
              </Link>
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
