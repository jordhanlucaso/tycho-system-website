"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EIK_HEADER_NAV, EIK_NAV } from "@/data/nav";

export function EikHeader() {
  const pathname = usePathname();
  // The drawer is scoped to the route it was opened on, so a client navigation (or a
  // back/forward) closes it without an effect that resets state.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = useCallback(
    (next: boolean) => setOpenOn(next ? pathname : null),
    [pathname],
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Lock scroll, trap Escape, and move focus into the drawer while it is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const isCurrent = (href: string) => pathname === href;

  return (
    <>
      <header className="eik-header">
        <div className="eik-shell eik-header__inner">
          <Link href="/eik" className="eik-wordmark" aria-label="Eik Tattoo & Piercing – forside">
            Eik
            <span>Tattoo &amp; Piercing</span>
          </Link>

          <nav className="eik-nav" aria-label="Hovedmeny">
            {EIK_HEADER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/eik/booking" className="eik-btn eik-btn--primary eik-header__cta">
            Send inn idéen din
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className="eik-burger"
            aria-expanded={open}
            aria-controls="eik-drawer"
            onClick={() => setOpen(true)}
          >
            <span className="eik-burger__bars" aria-hidden="true">
              <i />
              <i />
            </span>
            Meny
          </button>
        </div>
      </header>

      {open ? (
        <div className="eik-drawer" id="eik-drawer" role="dialog" aria-modal="true" aria-label="Meny">
          <div className="eik-drawer__top">
            <span className="eik-wordmark" aria-hidden="true">
              Eik
              <span>Tattoo &amp; Piercing</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="eik-drawer__close"
              onClick={() => {
                setOpen(false);
                burgerRef.current?.focus();
              }}
            >
              Lukk ✕
            </button>
          </div>

          {/* Closed on click as well as by route derivation, so the overlay never
              lingers for a frame during a client transition. */}
          <nav className="eik-drawer__nav" aria-label="Meny" onClick={() => setOpen(false)}>
            {EIK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                <i aria-hidden="true">{item.n}</i>
                {item.label}
              </Link>
            ))}
            <Link href="/eik/sporsmal">
              <i aria-hidden="true">07</i>
              Spørsmål og svar
            </Link>
          </nav>

          <div className="eik-drawer__foot">
            <Link
              href="/eik/booking"
              className="eik-btn eik-btn--primary"
              onClick={() => setOpen(false)}
            >
              Send inn idéen din
            </Link>
            <p className="eik-meta">Eikveien 64a · 3122 Tønsberg</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
