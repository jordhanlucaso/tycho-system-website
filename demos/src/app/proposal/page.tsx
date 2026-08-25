import Link from "next/link";
import { LIVE_ENGAGEMENTS, proposalPath } from "@/data/engagements";
import { pageMetadata } from "@/lib/seo";

/**
 * Index over the sales documents.
 *
 * `/proposal` used to *be* the tattoo proposal. With three client concepts on one host that
 * is a live hazard: opening demo.tychosystem.com/proposal in front of Trond would have put
 * two tattoo studios on the screen. Each engagement now has its own path and this page only
 * points at them.
 */
export const metadata = pageMetadata({
  title: "Salgsunderlag — Tycho Systems",
  description: "Intern oversikt over salgsunderlag. Ikke for publisering.",
  path: "/proposal",
  siteName: "Tycho Systems",
  noindex: true,
});

/** Derived from the engagement registry — see src/data/engagements.ts. */
const PROPOSALS = LIVE_ENGAGEMENTS.map((engagement) => ({
  href: proposalPath(engagement),
  label: engagement.label,
  note: engagement.proposalNote,
}));

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

export default function ProposalIndex() {
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
      <main style={{ maxWidth: "760px", width: "100%", marginInline: "auto" }}>
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
            fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            margin: "1.25rem 0 1rem",
          }}
        >
          Salgsunderlag
        </h1>
        <p style={{ color: "#a8adb8", maxWidth: "60ch", lineHeight: 1.6, margin: 0 }}>
          Ett dokument per oppdrag. Vis dette til kunden først når demoen er sett.
        </p>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "2.5rem", display: "grid" }}>
          {PROPOSALS.map((p) => (
            <li key={p.href} style={{ borderTop: "1px solid rgba(240,242,246,0.12)" }}>
              <Link
                href={p.href}
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  padding: "1.25rem 0",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <strong style={{ fontSize: "1.0625rem", fontWeight: 600 }}>{p.label} →</strong>
                <span style={{ color: "#a8adb8", fontSize: "0.9375rem", lineHeight: 1.55 }}>
                  {p.note}
                </span>
              </Link>
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
          }}
        >
          <Link href="/" style={{ color: "#7aa5f5", textDecoration: "none" }}>
            ← Alle konseptdemoer
          </Link>
        </p>
      </main>
    </div>
  );
}
