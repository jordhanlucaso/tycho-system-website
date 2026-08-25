import Link from "next/link";
import { DemoNote } from "@/components/demo/DemoLayer";
import { Anno, Plate, Section, StudioFacts } from "@/components/stabukk/StabukkPrimitives";
import { JsonLd } from "@/components/shared/JsonLd";
import { Reveal } from "@/components/shared/Reveal";
import { stabukkArtists, stabukkIntro } from "@/data/stabukk";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Studioet i Møllegaten | Stabukk Tønsberg",
  description:
    "Stabukk Tattoo Studio holder til i Møllegaten 4 i Tønsberg sentrum. Om atelieret, hvem som jobber her og hvordan vi tar imot arbeider.",
  path: "/stabukk/studio",
  siteName: "Stabukk Tattoo Studio",
});

export default function StudioPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stabukk Tattoo Studio", path: "/stabukk" },
          { name: "Studio", path: "/stabukk/studio" },
        ])}
      />

      <Section>
        <Anno reg>Plate 01 — Studio</Anno>
        <h1 className="sbk-display sbk-d1" style={{ margin: "1.25rem 0 clamp(2rem, 5vw, 3rem)" }}>
          Atelieret
        </h1>

        <div style={{ display: "grid", gap: "clamp(2rem, 5vw, 4rem)" }}>
          <div style={{ maxWidth: "62ch" }}>
            {stabukkIntro.body.map((p) => (
              <p key={p} className="sbk-body">
                {p}
              </p>
            ))}
          </div>

          <Reveal className="sbk-item sbk-item--c">
            <Plate ratio="16:9" number="01" spec={["Studiobilde — Møllegaten 4", "Leveres av Stabukk"]} />
            <div className="sbk-item__cap">
              <span className="sbk-anno sbk-anno--reg">Plate 01</span>
              <span className="sbk-anno">Interiør / Møllegaten 4 / Tønsberg</span>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section variant="paper">
        <Anno reg>Plate 02 — Tatovører</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.25rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          Hvem jobber her
        </h2>

        <ul style={{ display: "grid", gap: "clamp(2rem, 5vw, 3.5rem)", listStyle: "none", padding: 0 }}>
          {stabukkArtists.map((artist, i) => (
            <Reveal
              as="li"
              key={artist.id}
              className={`sbk-item sbk-item--${i % 2 === 0 ? "p1" : "p2"}`}
            >
              <Plate ratio="4:5" number={String(i + 1).padStart(2, "0")} label="Portrett" spec={["Leveres av Stabukk"]} />
              <div className="sbk-item__cap">
                <span className="sbk-pending">Navn bekreftes</span>
                <span className="sbk-anno">Retning og presentasjon fylles inn</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <div style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)", maxWidth: "62ch" }}>
          <h3 className="sbk-display sbk-d3">Merknad fra Tycho Systems</h3>
          <p className="sbk-body" style={{ marginTop: "1rem" }}>
            Vi fant ingen offentlig tilgjengelig informasjon om hvem som tatoverer hos Stabukk.
            Studioet står ikke oppført i bransjekatalogene som ellers lister alle tatovører i
            Tønsberg, og vi har bevisst latt være å knytte studioet til Instagram-kontoer vi
            ikke kan bekrefte tilhører dere.
            <DemoNote id="sbk.08" />
          </p>
        </div>
      </Section>

      <Section variant="raise">
        <Anno reg>Plate 03 — Praktisk</Anno>
        <h2 className="sbk-display sbk-d2" style={{ margin: "1.25rem 0 clamp(1.5rem, 4vw, 2.5rem)" }}>
          Praktisk
        </h2>
        <div style={{ display: "grid", gap: "clamp(2rem, 5vw, 3rem)" }}>
          <StudioFacts />
          <p>
            <Link href="/stabukk/booking" className="sbk-btn">
              Send forespørsel →
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
