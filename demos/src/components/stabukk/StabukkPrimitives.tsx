import Link from "next/link";
import type { ReactNode } from "react";
import { stabukkStudio } from "@/data/stabukk";
import { isConfirmed } from "@/data/types";
import { SBK_NAV } from "@/data/nav";

const RATIOS: Record<string, string> = {
  "4:5": "4 / 5",
  "1:1": "1 / 1",
  "3:4": "3 / 4",
  "16:9": "16 / 9",
  "3:2": "3 / 2",
};

/**
 * The numbered plate — Stabukk's signature object.
 *
 * Red corner registration ticks, a large plate number hanging in the top-right, a fine
 * CSS grain, and no photograph. Until the studio supplies real work, an un-inked plate is
 * the honest and — deliberately — the flattering metaphor.
 */
export function Plate({
  ratio = "4:5",
  number,
  label = "Client portfolio image",
  spec,
}: {
  ratio?: string;
  number?: string;
  label?: string;
  spec?: readonly string[];
}) {
  return (
    <div className="sbk-plate" style={{ aspectRatio: RATIOS[ratio] ?? "4 / 5" }}>
      <span className="sbk-plate__tick sbk-plate__tick--tl" aria-hidden="true" />
      <span className="sbk-plate__tick sbk-plate__tick--br" aria-hidden="true" />
      {number ? (
        <span className="sbk-plate__num" aria-hidden="true">
          {number}
        </span>
      ) : null}
      <p className="sbk-plate__label">
        <b>{label}</b>
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

export function Anno({ children, reg = false }: { children: ReactNode; reg?: boolean }) {
  return <p className={`sbk-anno${reg ? " sbk-anno--reg" : ""}`}>{children}</p>;
}

export function Section({
  id,
  children,
  variant,
  ticks = false,
}: {
  id?: string;
  children: ReactNode;
  variant?: "paper" | "raise";
  ticks?: boolean;
}) {
  const variantClass =
    variant === "paper" ? " sbk-section--paper" : variant === "raise" ? " sbk-section--raise" : "";
  return (
    <section id={id} className={`sbk-section${variantClass}${ticks ? " sbk-ticks" : ""}`}>
      <div className="sbk-bleed">{children}</div>
    </section>
  );
}

export function StudioFacts() {
  const hours = stabukkStudio.hours;
  return (
    <dl className="sbk-deflist">
      <div>
        <dt className="sbk-anno">Adresse</dt>
        <dd>
          <address>
            {stabukkStudio.address.streetAddress}
            <br />
            {stabukkStudio.address.postalCode} {stabukkStudio.address.addressLocality}
          </address>
        </dd>
      </div>
      <div>
        <dt className="sbk-anno">Åpent</dt>
        <dd>
          {isConfirmed(hours) ? (
            <>
              <time dateTime="Mo-Fr 10:00-16:00">Mandag–fredag 10:00–16:00</time>
              {isConfirmed(stabukkStudio.hoursNote) ? (
                <>
                  <br />
                  <span className="sbk-anno">{stabukkStudio.hoursNote}</span>
                </>
              ) : null}
            </>
          ) : (
            <span className="sbk-pending">Bekreftes</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="sbk-anno">Telefon</dt>
        <dd>
          {isConfirmed(stabukkStudio.phone) ? stabukkStudio.phone : <span className="sbk-pending">Bekreftes</span>}
        </dd>
      </div>
      <div>
        <dt className="sbk-anno">E-post</dt>
        <dd>
          {isConfirmed(stabukkStudio.email) ? stabukkStudio.email : <span className="sbk-pending">Bekreftes</span>}
        </dd>
      </div>
      <div>
        <dt className="sbk-anno">Instagram</dt>
        <dd>
          {isConfirmed(stabukkStudio.instagram) ? (
            stabukkStudio.instagram
          ) : (
            <span className="sbk-pending">Bekreftes</span>
          )}
        </dd>
      </div>
      <div>
        <dt className="sbk-anno">Aldersgrense</dt>
        <dd>18 år. Gyldig legitimasjon.</dd>
      </div>
    </dl>
  );
}

export function StabukkFooter() {
  return (
    <footer className="sbk-footer">
      <div className="sbk-bleed">
        <p className="sbk-footer__word" aria-hidden="true">
          Stabukk
        </p>

        <div className="sbk-footer__grid">
          <div>
            <h2>Studio</h2>
            <address style={{ fontStyle: "normal" }}>
              Stabukk Tattoo Studio
              <br />
              {stabukkStudio.addressDisplay}
            </address>
            <p className="sbk-anno" style={{ marginTop: "0.75rem" }}>
              Man–fre 10:00–16:00
            </p>
          </div>

          <div>
            <h2>Sider</h2>
            <ul>
              {SBK_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/stabukk/booking">Book</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2>Kontakt</h2>
            <ul>
              <li>Telefon: bekreftes</li>
              <li>E-post: bekreftes</li>
              <li>Instagram: bekreftes</li>
            </ul>
            <p className="sbk-anno" style={{ marginTop: "0.9rem" }}>
              Fylles inn av studioet før lansering
            </p>
          </div>
        </div>

        <div className="sbk-footer__base sbk-anno">
          <span>© {new Date().getFullYear()} Stabukk Tattoo Studio</span>
          <span>Møllegaten 4 · Tønsberg</span>
          <span>Konseptdemo · Tycho Systems</span>
        </div>
      </div>
    </footer>
  );
}
