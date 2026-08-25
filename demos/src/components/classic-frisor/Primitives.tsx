import Link from "next/link";
import type { ReactNode } from "react";
import { isConfirmed, type Maybe } from "@/data/types";
import { salon, booking } from "@/data/classic-frisor";
import { CF_NAV } from "@/data/nav";

/**
 * A value we have not confirmed, rendered as a designed gap rather than as filler.
 *
 * Visible gaps are what make everything unmarked on the page credible. The alternative —
 * quietly omitting the row — reads as a finished site that simply has less to say.
 */
export function Mangler({ children }: { children: ReactNode }) {
  return <span className="cf-mangler">{children}</span>;
}

/** Render a confirmed value, or the gap. Never a guess, never an empty string. */
export function Verdi({ value, mangler }: { value: Maybe<string>; mangler: string }) {
  return isConfirmed(value) ? <>{value}</> : <Mangler>{mangler}</Mangler>;
}

export function Seksjon({
  n,
  merke,
  children,
}: {
  n?: string;
  merke: string;
  children: ReactNode;
}) {
  return (
    <section className="cf-seksjon">
      <div className="cf-seksjon__hode">
        <p className="cf-eyebrow">
          {n ? `${n} · ` : ""}
          {merke}
        </p>
      </div>
      {children}
    </section>
  );
}

/**
 * A band of illustrative concept copy, labelled so it cannot be read as fact.
 * The brief is explicit that demo content is allowed — but never as a business claim.
 */
export function DemoBand({ merke, children }: { merke: string; children: ReactNode }) {
  return (
    <div className="cf-demoband">
      <span className="cf-demoband__merke">{merke}</span>
      {children}
    </div>
  );
}

/**
 * One line of the price list — the design's signature element.
 *
 * The post-build review found this reading as a *broken table* rather than a menu when
 * empty: two identically-weighted "Tid" and "Pris" gap chips per row competed with each
 * other and with the treatment name. The pre-build critique predicted exactly this
 * (design direction §12.2) — the empty state has to look deliberate, because for now the
 * empty state is the only state.
 *
 * The fix is editorial, not cosmetic: when nothing is confirmed, say so **once**.
 */
export function PrisRad({
  navn,
  blurb,
  minutter,
  pris,
}: {
  navn: string;
  blurb?: string;
  minutter: Maybe<number>;
  pris: Maybe<number>;
}) {
  const harTid = isConfirmed(minutter);
  const harPris = isConfirmed(pris);

  return (
    <li className="cf-pris">
      <span className="cf-pris__navn">{navn}</span>

      {harTid || harPris ? (
        <>
          <span className="cf-pris__tid">
            {harTid ? `${minutter} min` : <Mangler>Tid</Mangler>}
          </span>
          <span className="cf-pris__belop">
            {harPris ? `fra ${pris} kr` : <Mangler>Pris</Mangler>}
          </span>
        </>
      ) : (
        <span className="cf-pris__belop">
          <Mangler>Pris og tid ikke bekreftet</Mangler>
        </span>
      )}

      {blurb ? <p className="cf-pris__blurb">{blurb}</p> : null}
    </li>
  );
}

export function FotoBrief({
  brief,
  token,
  ratio,
}: {
  brief: string;
  token: string;
  ratio: "4:5" | "1:1" | "3:2" | "16:9";
}) {
  return (
    <figure className={`cf-foto cf-foto--${ratio.replace(":", "-")}`}>
      <figcaption>
        <span className="cf-foto__token">{token}</span>
        <p className="cf-foto__brief">{brief}</p>
      </figcaption>
    </figure>
  );
}

export function Brodsmuler({ trail }: { trail: readonly { name: string; path: string }[] }) {
  return (
    <nav className="cf-brodsmuler" aria-label="Brødsmuler">
      <div className="cf-shell">
        <ol>
          {trail.map((item, i) => (
            <li key={item.path}>
              {i < trail.length - 1 ? (
                <>
                  <Link href={item.path}>{item.name}</Link>
                  <span aria-hidden="true"> / </span>
                </>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/**
 * The canonical NAP block — name, address, phone — rendered identically everywhere from one
 * source. Every field is currently unconfirmed, which is the honest state of this project
 * and is exactly what the client needs to see.
 */
export function NapPlate({ title = "Salongen" }: { title?: string }) {
  return (
    <div className="cf-plate">
      <p className="cf-plate__tittel">{title}</p>
      <dl>
        <dt>Navn</dt>
        <dd>{salon.displayName}</dd>

        <dt>Adresse</dt>
        <dd>
          <Verdi value={salon.address} mangler="Adresse ikke bekreftet" />
        </dd>

        <dt>Telefon</dt>
        <dd>
          {isConfirmed(salon.phoneDisplay) && isConfirmed(salon.phoneE164) ? (
            <a href={`tel:${salon.phoneE164}`} className="cf-lenke">
              {salon.phoneDisplay}
            </a>
          ) : (
            <Mangler>Nummer ikke bekreftet</Mangler>
          )}
        </dd>

        <dt>Åpningstider</dt>
        <dd>
          <Verdi value={salon.openingHours} mangler="Tider ikke bekreftet" />
        </dd>

        <dt>Booking</dt>
        <dd>
          {isConfirmed(booking.provider) ? (
            booking.provider.name
          ) : (
            <Mangler>System ikke bekreftet</Mangler>
          )}
        </dd>
      </dl>
    </div>
  );
}

/**
 * The mobile action bar.
 *
 * Two actions, never three. `RING` is the honest primary today because no booking provider
 * is confirmed — and it stays correct after an integration, because the bar keeps both.
 */
export function Handlingslinje() {
  return (
    <div className="cf-handling">
      <Link href="/classic-frisor/bestill-time" className="cf-handling__book">
        Bestill time
      </Link>
      {isConfirmed(salon.phoneE164) ? (
        <a href={`tel:${salon.phoneE164}`} className="cf-handling__ring">
          Ring
        </a>
      ) : (
        <Link href="/classic-frisor/kontakt" className="cf-handling__ring">
          Kontakt
        </Link>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="cf-footer">
      <div className="cf-shell">
        <div className="cf-footer__rutenett">
          <div>
            <h2 className="cf-d3">Classic Frisør</h2>
            <p style={{ marginTop: "0.6rem", maxWidth: "32ch" }}>
              Frisør på Teie, Nøtterøy. Klipp, farge og styling.
            </p>
            <p className="cf-btn-rad" style={{ marginTop: "1.25rem" }}>
              <Link href="/classic-frisor/bestill-time" className="cf-btn cf-btn--primar">
                Bestill time
              </Link>
            </p>
          </div>

          <nav className="cf-footer__nav" aria-label="Bunnmeny">
            {CF_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div>
            <p className="cf-data" style={{ marginBottom: "0.6rem" }}>
              Smidsrødveien, Teie
            </p>
            <p style={{ fontSize: "0.94rem", margin: 0 }}>
              <Verdi value={salon.address} mangler="Adresse ikke bekreftet" />
            </p>
          </div>
        </div>

        <div className="cf-footer__bunn">
          <span>Konseptforslag fra Tycho Systems</span>
          <span>Ikke en publisert nettside</span>
        </div>
      </div>
    </footer>
  );
}
