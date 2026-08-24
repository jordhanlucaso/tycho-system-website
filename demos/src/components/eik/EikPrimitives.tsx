import Link from "next/link";
import type { ReactNode } from "react";
import { eikStudio } from "@/data/eik";
import { isConfirmed } from "@/data/types";
import { EIK_NAV } from "@/data/nav";

/**
 * The spec rule — Eik's signature graphic device.
 * A full-width hairline with monospace metadata straddling it, opening every section.
 */
export function SpecRule({ left, right }: { left: string; right?: string }) {
  return (
    <div className="eik-rule" role="presentation">
      <span className="eik-rule__label">{left}</span>
      <span className="eik-rule__line" />
      {right ? <span className="eik-rule__label eik-rule__label--end">{right}</span> : null}
    </div>
  );
}

const RATIOS: Record<string, string> = {
  "4:5": "4 / 5",
  "1:1": "1 / 1",
  "3:4": "3 / 4",
  "16:9": "16 / 9",
  "3:2": "3 / 2",
};

/**
 * Portfolio placeholder.
 *
 * No competitor photography is used anywhere on these demos, and no stock imagery is
 * passed off as the studio's work. Each slot renders the metadata the real image will
 * carry, so the layout is presentation-ready and the gap is unmistakably deliberate.
 */
export function PlaceholderFrame({
  ratio = "4:5",
  spec,
}: {
  ratio?: keyof typeof RATIOS | string;
  spec?: readonly string[];
}) {
  return (
    <div className="eik-frame" style={{ aspectRatio: RATIOS[ratio] ?? "4 / 5" }}>
      <p className="eik-frame__label">
        <b>Client portfolio image</b>
        {spec?.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
}

export function WorkFigure({
  ratio,
  style,
  placement,
  meta,
}: {
  ratio: string;
  style: string;
  placement: string;
  meta: string;
}) {
  return (
    <figure className="eik-figure">
      <PlaceholderFrame ratio={ratio} spec={[`${style} / ${placement}`, meta]} />
      <figcaption>
        <span>
          {style} · {placement}
        </span>
        <span>{meta}</span>
      </figcaption>
    </figure>
  );
}

/** Renders a confirmed value, or a clearly marked gap the client must fill. */
export function Pending({ label = "Bekreftes av studioet" }: { label?: string }) {
  return <span className="eik-pending">{label}</span>;
}

export function Section({
  id,
  rule,
  children,
  variant,
}: {
  id?: string;
  rule?: { left: string; right?: string };
  children: ReactNode;
  variant?: "sunk" | "ink" | "tight";
}) {
  const variantClass =
    variant === "sunk"
      ? " eik-section--sunk"
      : variant === "ink"
        ? " eik-section--ink"
        : variant === "tight"
          ? " eik-section--tight"
          : "";
  return (
    <section id={id} className={`eik-section${variantClass}`}>
      <div className="eik-shell">
        {rule ? <SpecRule left={rule.left} right={rule.right} /> : null}
        {children}
      </div>
    </section>
  );
}

export function StudioDetails() {
  const hours = eikStudio.hours;
  return (
    <dl className="eik-deflist">
      <div>
        <dt>Adresse</dt>
        <dd>
          <address>
            {eikStudio.address.streetAddress}
            <br />
            {eikStudio.address.postalCode} {eikStudio.address.addressLocality}
          </address>
        </dd>
      </div>
      <div>
        <dt>Åpningstider</dt>
        <dd>{isConfirmed(hours) ? "Se oversikt" : <Pending />}</dd>
      </div>
      <div>
        <dt>Telefon</dt>
        <dd>{isConfirmed(eikStudio.phone) ? eikStudio.phone : <Pending />}</dd>
      </div>
      <div>
        <dt>E-post</dt>
        <dd>{isConfirmed(eikStudio.email) ? eikStudio.email : <Pending />}</dd>
      </div>
      <div>
        <dt>Instagram</dt>
        <dd>{isConfirmed(eikStudio.instagram) ? eikStudio.instagram : <Pending />}</dd>
      </div>
      <div>
        <dt>Aldersgrense</dt>
        <dd>18 år for tatovering. Gyldig legitimasjon kreves.</dd>
      </div>
    </dl>
  );
}

export function EikFooter() {
  return (
    <footer className="eik-footer">
      <div className="eik-shell">
        <div className="eik-footer__grid">
          <div>
            <p className="eik-footer__wordmark">Eik Tattoo &amp; Piercing</p>
            <address style={{ fontStyle: "normal" }}>
              {eikStudio.addressDisplay}
              <br />
              Norge
            </address>
            <p style={{ marginTop: "0.75rem" }}>
              Tatovering og piercing i Tønsberg. Vi tar imot arbeider etter avtale — send inn
              idéen din, så hører du fra oss.
            </p>
          </div>

          <div>
            <h2>Sider</h2>
            <ul>
              {EIK_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/eik/sporsmal">Spørsmål og svar</Link>
              </li>
              <li>
                <Link href="/eik/booking">Send inn idéen din</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Kontakt</h2>
            <ul>
              <li>Telefon: bekreftes</li>
              <li>E-post: bekreftes</li>
              <li>Instagram: bekreftes</li>
              <li>Åpningstider: bekreftes</li>
            </ul>
            <p style={{ marginTop: "0.9rem", fontSize: "0.8125rem", opacity: 0.75 }}>
              Kontaktopplysningene fylles inn av studioet før lansering.
            </p>
          </div>
        </div>

        <div className="eik-footer__base">
          <span>© {new Date().getFullYear()} Eik Tattoo &amp; Piercing</span>
          <span>Eikveien 64a · 3122 Tønsberg</span>
          <span>Konseptdemo · Tycho Systems</span>
        </div>
      </div>
    </footer>
  );
}
