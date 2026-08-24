import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, Disp, Mangler, Plate, Seksjon } from "@/components/marine/Primitives";
import { business, publicServices, services } from "@/data/marine";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tjenester — båtservice og motorservice | Marine Max",
  description:
    "Service på båtmotor, reparasjon og feilsøking på Nøtterøy. Oversikt over hva Marine Max utfører, og hva som ennå ikke er bekreftet.",
  path: "/marine-max/tjenester",
  siteName: "Marine Max",
});

const openQuestions = services.filter((s) => s.status === "to-confirm");

export default function Tjenester() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Tjenester", path: "/marine-max/tjenester" },
        ])}
      />
      <Brodsmuler trail={[{ name: "Tjenester", path: "/marine-max/tjenester" }]} />

      <section className="mm-band mm-band--flush">
        <div className="mm-shell">
          <Seksjon n="01" merke="Tjenester">
            <h1 className="mm-d1"><Disp>Hva vi gjør</Disp></h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem" }}>
              Reparasjon og vedlikehold av båter og båtmotorer på Nøtterøy og i Færder.
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Bekreftet">
            <h2 className="mm-d2"><Disp>Dette utfører vi</Disp></h2>

            <div className="mm-tjenester" style={{ marginTop: "1.75rem" }}>
              {publicServices.map((service) => (
                <article className="mm-tjeneste" key={service.id}>
                  <div>
                    <h3>{service.title}</h3>
                    {service.status === "scope-unclear" ? (
                      <p style={{ marginTop: "0.5rem" }}>
                        <Mangler>Omfang bekreftes</Mangler>
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p>{service.summary}</p>
                    {service.needs ? (
                      <ul className="mm-liste" style={{ marginTop: "0.85rem" }}>
                        {service.needs.map((need) => (
                          <li key={need}>
                            <span>{need}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <p style={{ margin: 0 }}>
                    {service.slug ? (
                      <Link href={service.slug} className="mm-lenke">
                        Mer om dette
                      </Link>
                    ) : null}
                  </p>
                </article>
              ))}
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Ikke bekreftet">
            <h2 className="mm-d2">Dette vet vi ikke ennå</h2>
            <p style={{ marginTop: "1rem" }}>
              Vi har ikke funnet dekning for tjenestene under, og skriver dem derfor ikke som
              om de tilbys. De står her fordi de er de vanligste spørsmålene en båteier har.
              <DemoNote id="mm.15" />
            </p>

            <div style={{ marginTop: "1.75rem", maxWidth: "44rem" }}>
              <Plate
                title="Avventer bekreftelse"
                rows={openQuestions.map((service) => ({
                  label: service.title,
                  value: <Mangler />,
                }))}
              />
            </div>

            <p style={{ marginTop: "1.5rem" }}>
              Lurer du på om vi tar en bestemt jobb?{" "}
              <a href={`tel:${business.phoneE164}`} className="mm-lenke">
                Ring {business.phoneDisplay}
              </a>
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="04" merke="Neste steg">
            <h2 className="mm-d2">Fortell oss om båten</h2>
            <p style={{ marginTop: "1rem", color: "var(--stal-lys)" }}>
              Skjemaet tar to minutter og gjør at vi kan svare deg ordentlig med én gang.
            </p>
            <div className="mm-btn-rad" style={{ marginTop: "1.5rem" }}>
              <Link href="/marine-max/bestill-service" className="mm-btn mm-btn--primar">
                Bestill service
              </Link>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--sekundar">
                Ring {business.phoneDisplay}
              </a>
            </div>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
