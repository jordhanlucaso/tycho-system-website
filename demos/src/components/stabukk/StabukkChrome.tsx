"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SBK_NAV } from "@/data/nav";

export function StabukkHeader() {
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

  return (
    <>
      <header className="sbk-header">
        <div className="sbk-bleed sbk-header__inner">
          <Link href="/stabukk" className="sbk-mark" aria-label="Stabukk Tattoo Studio – forside">
            Stabukk
          </Link>

          <nav className="sbk-nav" aria-label="Hovedmeny">
            {SBK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/stabukk/booking" className="sbk-btn sbk-header__cta">
            Book
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className="sbk-burger"
            aria-expanded={open}
            aria-controls="sbk-drawer"
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true">
              <i />
              <i />
            </span>
            Meny
          </button>
        </div>
      </header>

      {open ? (
        <div className="sbk-drawer" id="sbk-drawer" role="dialog" aria-modal="true" aria-label="Meny">
          <div className="sbk-drawer__top">
            <span className="sbk-mark" aria-hidden="true">
              Stabukk
            </span>
            <button
              ref={closeRef}
              type="button"
              className="sbk-drawer__close"
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
          <nav className="sbk-drawer__nav" aria-label="Meny" onClick={() => setOpen(false)}>
            {SBK_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
                <i aria-hidden="true">{item.n}</i>
              </Link>
            ))}
            <Link href="/stabukk/booking">
              Book
              <i aria-hidden="true">05</i>
            </Link>
          </nav>

          <div className="sbk-drawer__foot">
            <p className="sbk-anno">Møllegaten 4 · 3111 Tønsberg · Man–fre 10–16</p>
            <Link href="/stabukk/booking" className="sbk-btn" onClick={() => setOpen(false)}>
              Send forespørsel
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
