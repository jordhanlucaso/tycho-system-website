import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, Disp, FotoBrief, Seksjon } from "@/components/marine/Primitives";
import { business, recentWork } from "@/data/marine";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tidligere arbeid — Marine Max båtservice",
  description:
    "Bilder av utført arbeid på båt og båtmotor. Fotoplanen for Marine Max, med rammene som venter på bilder fra verkstedet.",
  path: "/marine-max/tidligere-arbeid",
  siteName: "Marine Max",
});

export default function TidligereArbeid() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/marine-max" },
          { name: "Tidligere arbeid", path: "/marine-max/tidligere-arbeid" },
        ])}
      />
      <Brodsmuler trail={[{ name: "Tidligere arbeid", path: "/marine-max/tidligere-arbeid" }]} />

      <section className="mm-band mm-band--flush">
        <div className="mm-shell">
          <Seksjon n="01" merke="Arbeid">
            <h1 className="mm-d1">Tidligere arbeid</h1>
            <p className="mm-lead" style={{ marginTop: "1.25rem" }}>
              Her skal det stå bilder av jobber Trond har gjort. Rammene under viser nøyaktig
              hvilke bilder vi trenger — og hvorfor.
              <DemoNote id="mm.14" />
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band">
        <div className="mm-shell">
          <Seksjon n="02" merke="Fotoplan">
            <h2 className="mm-d2">Bilder vi trenger</h2>
            <div className="mm-galleri" style={{ marginTop: "1.75rem" }}>
              {recentWork.map((item) => (
                <FotoBrief
                  key={item.id}
                  brief={item.brief}
                  ratio={item.ratio}
                  note={item.caption}
                />
              ))}
            </div>
            <p className="mm-mono mm-mono--dim" style={{ marginTop: "1.5rem" }}>
              Full liste med anbefalt format og prioritet: content/photo-shot-list.md
            </p>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--alt">
        <div className="mm-shell">
          <Seksjon n="03" merke="Før og etter">
            <h2 className="mm-d2"><Disp>To bilder gjør hele jobben</Disp></h2>
            <p style={{ marginTop: "1rem", maxWidth: "62ch" }}>
              Ta ett bilde når båten kommer inn, og ett fra samme sted når den er ferdig. Ingen
              av verkstedene i området gjør dette, og det er det mest overbevisende en
              verkstedside kan vise.
            </p>
            <div className="mm-galleri" style={{ marginTop: "1.75rem" }}>
              <FotoBrief brief="Før — samme utsnitt" ratio="16:9" note="Fotoliste nr. 6" />
              <FotoBrief brief="Etter — samme utsnitt" ratio="16:9" note="Fotoliste nr. 6" />
            </div>
          </Seksjon>
        </div>
      </section>

      <section className="mm-band mm-band--deep mm-on-dark">
        <div className="mm-shell">
          <Seksjon n="04" merke="Neste steg">
            <h2 className="mm-d2">Skal vi se på båten din?</h2>
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
