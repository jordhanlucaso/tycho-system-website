import Link from "next/link";
import type { ReactNode } from "react";
import { business, yearsRegistered } from "@/data/marine";
import { MM_NAV as NAV } from "@/data/nav";
import { isConfirmed } from "@/data/types";
import type { WorkItem } from "@/data/types";

/* ── The engine plate ──────────────────────────────────────────────────────────────────
   Every marine engine carries a riveted metal data plate: model, serial, year, in stamped
   label/value pairs. That object is this site's recurring component — native to the domain
   without being an illustration of it, and designed to hold gaps. */

export function Plate({
  title,
  rows,
  className = "",
}: {
  title?: string;
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={`mm-plate ${className}`.trim()}>
      {title ? <div className="mm-plate__hode mm-mono">{title}</div> : null}
      <dl style={{ margin: 0 }}>
        {rows.map((row) => (
          <div className="mm-plate__rad" key={row.label}>
            <dt className="mm-mono mm-mono--dim" style={{ margin: 0 }}>
              {row.label}
            </dt>
            <dd className="mm-plate__verdi" style={{ margin: 0 }}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The visible gap. A marked blank builds more trust than plausible filler — it proves that
 * everything not marked is real.
 */
export function Mangler({ children = "Bekreftes" }: { children?: ReactNode }) {
  return <span className="mm-mangler">{children}</span>;
}

/**
 * Barlow Condensed ships Ø with roughly 0.08em of trailing sidebearing that plain O does
 * not carry (measured: advance 55.4 vs 47.3 at 100px, while Å matches A exactly). The slash
 * overhangs the bowl and the face compensates in the metrics, so at display size
 * "NØTTERØY" reads as "NØ TTERØ Y" — a visible hole in the most repeated word on this site.
 *
 * Tracking cannot fix it: the excess is in one glyph's advance, so negative letter-spacing
 * closes every other pair before it closes this one. The correction has to be per-glyph.
 *
 * Only applied to display sizes. At body sizes the excess is ~1px and invisible.
 */
export function Disp({ children }: { children: string }) {
  const parts = children.split(/(Ø|ø)/);
  return (
    <>
      {parts.map((part, i) =>
        part === "Ø" || part === "ø" ? (
          <span className="mm-o" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Section with the technical-drawing title block. */
export function Seksjon({
  n,
  merke,
  children,
  id,
}: {
  n?: string;
  merke?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="mm-seksjon" id={id}>
      <div className="mm-seksjon__merke">
        {n ? <p className="mm-mono mm-mono--dim">{n}</p> : null}
        {merke ? <p className="mm-mono mm-mono--dim">{merke}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

/** Photo placeholder carrying the exact brief from content/photo-shot-list.md. */
export function FotoBrief({
  brief,
  ratio = "4:3",
  note,
}: {
  brief: string;
  ratio?: WorkItem["ratio"];
  note?: string;
}) {
  return (
    <figure className="mm-foto" data-ratio={ratio} style={{ margin: 0 }}>
      <span className="mm-foto__merk">Foto mangler</span>
      <figcaption className="mm-foto__brief">
        {brief}
        {note ? (
          <>
            <br />
            <span style={{ opacity: 0.75 }}>{note}</span>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function Brodsmuler({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav className="mm-brodsmuler" aria-label="Brødsmuler">
      <div className="mm-shell">
        <ol className="mm-mono mm-mono--dim">
          <li>
            <Link href="/marine-max">Forsiden</Link>
          </li>
          {trail.map((item, i) => (
            <li key={item.path}>
              <span aria-hidden="true" style={{ marginRight: "0.5rem" }}>
                /
              </span>
              {i === trail.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/**
 * The canonical NAP block. One source of truth, rendered identically everywhere.
 *
 * Name, address, phone — and deliberately not the organisasjonsnummer, which had crept in
 * here and is not NAP. Because this block renders on the homepage, on /kontakt and in the
 * footer, carrying the number meant a homepage visitor met it five times in one scroll.
 * It now appears once per page, in the footer bar. See the note in src/data/marine.ts.
 */
export function NapPlate({ title = "Kontakt" }: { title?: string }) {
  return (
    <Plate
      title={title}
      rows={[
        { label: "Foretak", value: `${business.displayName} ${business.descriptor}` },
        {
          label: "Adresse",
          value: (
            <>
              {business.address.street}
              <br />
              {business.address.postalCode} {business.address.locality}
              <br />
              {business.address.municipality} kommune
            </>
          ),
        },
        {
          label: "Telefon",
          value: (
            <a href={`tel:${business.phoneE164}`} className="mm-lenke">
              {business.phoneDisplay}
            </a>
          ),
        },
        {
          label: "E-post",
          value: isConfirmed(business.email) ? business.email : <Mangler />,
        },
        {
          label: "Åpningstider",
          value: isConfirmed(business.openingHours) ? (
            business.openingHours
          ) : (
            <Mangler>Bekreftes — ring for avtale</Mangler>
          ),
        },
      ]}
    />
  );
}

/** Fixed mobile action bar. Two actions, never more. */
export function Handlingslinje() {
  return (
    <div className="mm-handling">
      <a href={`tel:${business.phoneE164}`}>Ring oss</a>
      <Link href="/marine-max/bestill-service">Bestill service</Link>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mm-footer mm-on-dark">
      <div className="mm-shell">
        <div className="mm-footer__grid">
          <div>
            <p className="mm-mono mm-mono--dim" style={{ marginBottom: "0.75rem" }}>
              Marine Max · Båtservice · Nøtterøy
            </p>
            <p style={{ color: "var(--stal-lys)", fontSize: "0.95rem", maxWidth: "34ch" }}>
              Reparasjon og vedlikehold av båter og båtmotorer. Registrert på Nøtterøy siden{" "}
              {new Date(business.registeredSince).getFullYear()}.
            </p>
            <p className="mm-btn-rad" style={{ marginTop: "1.25rem" }}>
              <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
                Ring {business.phoneDisplay}
              </a>
            </p>
          </div>

          <nav className="mm-footer__nav" aria-label="Bunnmeny">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/marine-max/bestill-service">Bestill service</Link>
          </nav>

          <NapPlate title="Foretaksopplysninger" />
        </div>

        <div className="mm-footer__bunn mm-mono">
          <span>Org.nr {business.orgNumber}</span>
          <span>
            NACE {business.naceCode} — {business.naceLabel}
          </span>
          <span>{yearsRegistered()} år registrert</span>
        </div>

        <p
          className="mm-mono mm-mono--dim"
          style={{ marginTop: "1.25rem", marginBottom: 0, maxWidth: "62ch" }}
        >
          Konseptforslag utarbeidet av Tycho Systems. Ikke en offisiell nettside for Marine
          Max. Opplysninger merket «bekreftes» er ikke verifisert.
        </p>
      </div>
    </footer>
  );
}
