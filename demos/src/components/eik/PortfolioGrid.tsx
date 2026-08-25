"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioItem, Resolved } from "@/data/types";
import { PlaceholderFrame } from "./EikPrimitives";

/**
 * Eik portfolio — disciplined uniform grid.
 *
 * For Eik the regularity *is* the message: an anxious first-timer reads an orderly grid as
 * competence. (Stabukk deliberately does the opposite; see its plate stack.)
 *
 * Filtering is client-side over ~9 items — no virtualisation, no fetch, no dependency.
 * The viewer supports Escape, arrow keys, swipe, focus restoration and a live region.
 */
export function PortfolioGrid({
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
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const filtered = useMemo(
    () => (active === "Alle" ? items : items.filter((i) => i.style === active)),
    [items, active],
  );

  const close = useCallback(() => {
    if (openIndex !== null) triggerRefs.current[openIndex]?.focus();
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : filtered[openIndex];

  return (
    <>
      <div className="eik-filters" role="group" aria-label="Filtrer arbeider etter stil">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            className="eik-filter"
            aria-pressed={active === style}
            onClick={() => setActive(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {filtered.length} arbeider vises{active === "Alle" ? "" : ` i stilen ${active}`}.
      </p>

      <ul className="eik-grid">
        {filtered.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className="eik-tile"
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              onClick={() => setOpenIndex(index)}
              aria-haspopup="dialog"
            >
              <PlaceholderFrame
                ratio={item.ratio}
                spec={[`${item.style} / ${item.placement}`, item.meta]}
              />
              <figcaption>
                <span>
                  {item.style} · {item.placement}
                </span>
                <span aria-hidden="true">{item.year}</span>
              </figcaption>
              <span className="visually-hidden">
                Åpne større visning: {item.alt}, {item.year}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="eik-body" style={{ marginTop: "1.5rem" }}>
          Ingen arbeider i denne stilen ennå.
        </p>
      ) : null}

      {current && openIndex !== null ? (
        <div
          className="eik-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.style}, ${current.placement}`}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX ?? null;
            if (start === null || end === null) return;
            const dx = end - start;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <div className="eik-lightbox__top">
            <span className="eik-meta">
              {openIndex + 1} / {filtered.length}
            </span>
            <button ref={closeRef} type="button" className="eik-lightbox__close" onClick={close}>
              Lukk ✕
            </button>
          </div>

          <div className="eik-lightbox__stage">
            <PlaceholderFrame
              ratio={current.ratio}
              spec={[`${current.style} / ${current.placement}`, current.meta, current.year]}
            />
          </div>

          <div className="eik-lightbox__bottom">
            <p className="eik-meta">
              {current.style} · {current.placement} · {current.meta}
            </p>
            <div className="eik-lightbox__nav">
              <button type="button" onClick={() => step(-1)} aria-label="Forrige arbeid">
                ← Forrige
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Neste arbeid">
                Neste →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
