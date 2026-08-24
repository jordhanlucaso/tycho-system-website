import Link from "next/link";
import { LIVE_ENGAGEMENTS, proposalPath } from "@/data/engagements";
import { pageMetadata } from "@/lib/seo";

/**
 * Internal hub. Never indexed — if this ranked, it would compete with the very pages it
 * links to, and it would put three prospective clients on one public page together.
 *
 * Styled inline rather than from a stylesheet: it belongs to no client, and giving it a
 * brand of its own would only invite someone to mistake it for one.
 */
export const metadata = pageMetadata({
  title: "Tycho Systems — konseptdemoer",
  description: "Intern oversikt over konseptdemoer. Ikke for publisering.",
  path: "/",
  siteName: "Tycho Systems",
  noindex: true,
});

/** Derived from the engagement registry — see src/data/engagements.ts. */
const DEMOS = LIVE_ENGAGEMENTS.flatMap((engagement) =>
  engagement.concepts.map((concept) => ({
    href: `/${concept.slug}`,
    label: concept.name,
    place: engagement.place,
    note: concept.blurb,
    pages: `${concept.routes.length} sider`,
    proposal: proposalPath(engagement),
  })),
);

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function Hub() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0f12",
        color: "#f0f2f6",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        display: "grid",
        alignContent: "center",
        padding: "clamp(2rem, 8vw, 6rem) clamp(1.25rem, 5vw, 4rem)",
      }}
    >
      <main style={{ maxWidth: "820px", width: "100%", marginInline: "auto" }}>
        <p
          style={{
            fontFamily: mono,
            fontSize: "0.6875rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#868d99",
            margin: 0,
          }}
        >
          Tycho Systems · Internt
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            margin: "1.25rem 0 1rem",
          }}
        >
          Konseptdemoer
        </h1>
        <p style={{ color: "#a8adb8", maxWidth: "62ch", lineHeight: 1.6, margin: 0 }}>
          Spekulative redesign laget som salgsunderlag. Ingen av bedriftene har bestilt eller
          godkjent dem, så hele dette domenet er sperret for indeksering. Legg til{" "}
          <code style={{ color: "#7aa5f5", fontFamily: mono }}>?demo=true</code> på en demo-URL
          for å slå på konseptvisningen med begrunnelser.
        </p>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "2.75rem", display: "grid" }}>
          {DEMOS.map((demo) => (
            <li key={demo.href} style={{ borderTop: "1px solid rgba(240,242,246,0.12)" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem 1.5rem",
                  alignItems: "baseline",
                  padding: "1.4rem 0 1.5rem",
                }}
              >
                <Link
                  href={demo.href}
                  style={{
                    fontSize: "1.1875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {demo.label} →
                </Link>
                <span style={{ fontFamily: mono, fontSize: "0.75rem", color: "#868d99" }}>
                  {demo.place} · {demo.pages}
                </span>
                <span
                  style={{
                    color: "#a8adb8",
                    fontSize: "0.9375rem",
                    lineHeight: 1.55,
                    flexBasis: "100%",
                  }}
                >
                  {demo.note}
                </span>
                <Link
                  href={demo.proposal}
                  style={{
                    fontFamily: mono,
                    fontSize: "0.75rem",
                    color: "#7aa5f5",
                    textDecoration: "none",
                  }}
                >
                  Salgsunderlag →
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p
          style={{
            borderTop: "1px solid rgba(240,242,246,0.12)",
            paddingTop: "1.4rem",
            margin: 0,
            fontFamily: mono,
            fontSize: "0.75rem",
            color: "#868d99",
          }}
        >
          <Link href="/proposal" style={{ color: "#7aa5f5", textDecoration: "none" }}>
            Alle salgsunderlag
          </Link>
        </p>
      </main>
    </div>
  );
}
