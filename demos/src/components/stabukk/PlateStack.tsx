"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioItem, Resolved } from "@/data/types";
import { Plate } from "./StabukkPrimitives";

const WIDTHS = ["a", "b", "c", "d"] as const;

/**
 * Stabukk portfolio — the plate stack.
 *
 * Deliberately *not* a grid. Items alternate width and alignment (62% / 44% / 88% / 54%)
 * so the scroll has a rhythm and no two viewport-fulls look alike. This is the structural
 * opposite of Eik's uniform grid, and it is the main reason the two portfolios cannot be
 * mistaken for the same component with different colours.
 */
export function PlateStack({
  items,
  styles,
}: {
  items: readonly Resolved<PortfolioItem>[];
  styles: readonly string[];
}) {
  const [active, setActive] = useState("Alle");
  // The open index is stored together with the filter it was opened under, so changing
  // the filter invalidates it by derivation — no effect resetting state after the fact,
  // and no window where the index can point outside the filtered list.
  const [opened, setOpened] = useState<{ filter: string; index: number } | null>(null);
  const openIndex = opened && opened.filter === active ? opened.index : null;
  const setOpenIndex = (index: number | null) =>
    setOpened(index === null ? null : { filter: active, index });
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const filtered = useMemo(
    () => (active === "Alle" ? items : items.filter((i) => i.style === active)),
    [items, active],
  );

  const close = useCallback(() => {
    if (openIndex !== null) triggers.current[openIndex]?.focus();
    setOpened(null);
  }, [openIndex]);

  const step = useCallback(
    (delta: number) =>
      setOpened((current) =>
        current === null
          ? null
          : { ...current, index: (current.index + delta + filtered.length) % filtered.length },
      ),
    [filtered.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : filtered[openIndex];

  return (
    <>
      <div className="sbk-filters" role="group" aria-label="Filtrer arbeider">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            className="sbk-filter"
            aria-pressed={active === style}
            onClick={() => setActive(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {filtered.length} arbeider vises{active === "Alle" ? "" : ` i kategorien ${active}`}.
      </p>

      <ul className="sbk-stack">
        {filtered.map((item, index) => {
          const plateNo = String(index + 1).padStart(2, "0");
          return (
            <li key={item.id} className={`sbk-item sbk-item--${WIDTHS[index % WIDTHS.length]}`}>
              <button
                type="button"
                className="sbk-item__open"
                ref={(el) => {
                  triggers.current[index] = el;
                }}
                onClick={() => setOpenIndex(index)}
                aria-haspopup="dialog"
              >
                <Plate
                  ratio={item.ratio}
                  number={plateNo}
                  spec={[`${item.style} / ${item.placement}`, item.meta]}
                />
                <span className="visually-hidden">
                  Åpne plate {plateNo}: {item.alt}, {item.year}
                </span>
              </button>
              <div className="sbk-item__cap">
                <span className="sbk-anno sbk-anno--reg">Plate {plateNo}</span>
                <span className="sbk-anno">
                  {item.style} / {item.placement} / {item.meta} / {item.year}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="sbk-body" style={{ marginTop: "2rem" }}>
          Ingen arbeider i denne kategorien ennå.
        </p>
      ) : null}

      {current && openIndex !== null ? (
        <div
          className="sbk-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Plate ${String(openIndex + 1).padStart(2, "0")}, ${current.style}`}
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX ?? null;
            if (start === null || end === null) return;
            if (Math.abs(end - start) > 48) step(end - start < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="sbk-viewer__bar">
            <span className="sbk-anno sbk-anno--reg">
              Plate {String(openIndex + 1).padStart(2, "0")} / {filtered.length}
            </span>
            <button ref={closeRef} type="button" onClick={close}>
              Lukk ✕
            </button>
          </div>

          <div className="sbk-viewer__stage">
            <Plate
              ratio={current.ratio}
              spec={[`${current.style} / ${current.placement}`, current.meta, current.year]}
            />
          </div>

          <div className="sbk-viewer__bar">
            <span className="sbk-anno">
              {current.style} / {current.placement} / {current.meta}
            </span>
            <span className="sbk-viewer__nav">
              <button type="button" onClick={() => step(-1)} aria-label="Forrige plate">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Neste plate">
                →
              </button>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
