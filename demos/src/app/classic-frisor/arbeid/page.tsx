import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { JsonLd } from "@/components/shared/JsonLd";
import { Brodsmuler, FotoBrief, Seksjon } from "@/components/classic-frisor/Primitives";
import { workBriefs } from "@/data/classic-frisor";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Arbeid — klipp og farge | Classic Frisør",
  description:
    "Bilder av arbeid fra salongen på Teie. Bildeplanen viser nøyaktig hvilke bilder som skal tas.",
  path: "/classic-frisor/arbeid",
  siteName: "Classic Frisør",
});

export default function Arbeid() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Arbeid", path: "/classic-frisor/arbeid" },
        ])}
      />
      <Brodsmuler
        trail={[
          { name: "Forsiden", path: "/classic-frisor" },
          { name: "Arbeid", path: "/classic-frisor/arbeid" },
        ]}
      />

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <h1 className="cf-d1">Arbeid</h1>
          <p className="cf-lead" style={{ marginTop: "1.25rem" }}>
            Ingenting her er hentet fra en bildebank eller fra en konkurrent. Hver ramme er en
            bestilling: dette er bildet som skal stå her.
            <DemoNote id="cf.10" />
          </p>
        </div>
      </section>

      <section className="cf-band cf-band--flush">
        <div className="cf-shell">
          <Seksjon merke="Bildeplan">
            <div className="cf-galleri">
              {workBriefs.map((w) => (
                <FotoBrief key={w.id} brief={w.brief} token={w.token} ratio={w.ratio} />
              ))}
            </div>
            <p style={{ marginTop: "1.75rem", color: "var(--espresso-myk)" }}>
              Fjorten bilder, én økt, omtrent halvannen time. Hele planen står i
              bildelisten som følger forslaget.
            </p>
            <p>
              <Link href="/classic-frisor/bestill-time" className="cf-lenke">
                Bestill time →
              </Link>
            </p>
          </Seksjon>
        </div>
      </section>
    </>
  );
}
