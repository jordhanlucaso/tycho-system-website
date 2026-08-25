"use client";

import Link from "next/link";
import { useState } from "react";

export interface ClientBlock {
  slug: "eik" | "stabukk";
  name: string;
  address: string;
  demoHref: string;
  situation: readonly string[];
  gaps: readonly string[];
  strengths: readonly string[];
  toConfirm: readonly { field: string; why: string }[];
}

/**
 * Lets one proposal document serve two meetings. The salesperson switches client at the
 * top and every client-specific block follows — current situation, gaps, and the list of
 * information Tycho needs before anything can go live.
 */
export function ClientTabs({ clients }: { clients: readonly ClientBlock[] }) {
  const [active, setActive] = useState(0);
  const client = clients[active];

  return (
    <>
      <div
        role="tablist"
        aria-label="Velg studio"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}
      >
        {clients.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            id={`tab-${c.slug}`}
            aria-selected={i === active}
            aria-controls={`panel-${c.slug}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((a) => (a + 1) % clients.length);
              if (e.key === "ArrowLeft") setActive((a) => (a - 1 + clients.length) % clients.length);
            }}
            className={i === active ? "tsp-btn" : "tsp-btn tsp-btn--line"}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${client.slug}`} aria-labelledby={`tab-${client.slug}`}>
        <div className="tsp-cards tsp-cards--2">
          <div className="tsp-card">
            <p className="tsp-mono">Slik ser det ut i dag</p>
            <h3>{client.name}</h3>
            <p className="tsp-mono">{client.address}</p>
            <ul className="tsp-list" style={{ marginTop: "0.5rem" }}>
              {client.situation.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tsp-card">
            <p className="tsp-mono">Det som allerede fungerer</p>
            <ul className="tsp-list tsp-list--check">
              {client.strengths.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="tsp-mono" style={{ marginTop: "1rem" }}>
              Det som mangler
            </p>
            <ul className="tsp-list tsp-list--gap">
              {client.gaps.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>
            Opplysninger vi trenger fra {client.name}
          </h3>
          <p className="tsp-body" style={{ marginBottom: "1.25rem" }}>
            Ingenting under er oppdiktet i demoen. Feltene står synlig tomme til dere fyller dem
            inn — det er et bevisst valg, ikke en mangel.
          </p>
          <dl className="tsp-confirm">
            {client.toConfirm.map((item) => (
              <div key={item.field}>
                <dt>{item.field}</dt>
                <dd>{item.why}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="tsp-actions">
          <Link href={client.demoHref} className="tsp-btn">
            Åpne demoen for {client.name} →
          </Link>
          <Link href={`${client.demoHref}?demo=true`} className="tsp-btn tsp-btn--line">
            Åpne med konseptvisning
          </Link>
        </div>
      </div>
    </>
  );
}
