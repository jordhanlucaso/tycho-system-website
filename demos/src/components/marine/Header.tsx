"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { business } from "@/data/marine";
import { MM_HEADER_NAV as HEADER_NAV, MM_NAV as NAV } from "@/data/nav";

export function Header() {
  const pathname = usePathname();
  // The drawer is scoped to the route it was opened on, so a client navigation (or a
  // back/forward) closes it by derivation rather than via a state-reset effect.
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

  const isCurrent = (href: string) => pathname === href;

  return (
    <>
      <header className="mm-header mm-on-dark">
        <div className="mm-shell mm-header__inner">
          {/* Name + category + place, as one semantic unit. This is how the business stops
              competing with a NYSE-listed American company for its own name. */}
          <Link href="/marine-max" className="mm-merke" aria-label="Marine Max Båtservice Nøtterøy – forsiden">
            <b>Marine Max</b>
            <span>Båtservice · Nøtterøy</span>
          </Link>

          <nav className="mm-nav" aria-label="Hovedmeny">
            {HEADER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a href={`tel:${business.phoneE164}`} className="mm-header__ring">
            {business.phoneDisplay}
          </a>

          <button
            ref={burgerRef}
            type="button"
            className="mm-burger"
            aria-expanded={open}
            aria-controls="mm-drawer"
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
        <div className="mm-drawer" id="mm-drawer" role="dialog" aria-modal="true" aria-label="Meny">
          <div className="mm-drawer__topp">
            <span className="mm-merke" aria-hidden="true">
              <b>Marine Max</b>
              <span>Båtservice · Nøtterøy</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="mm-drawer__lukk"
              onClick={() => {
                setOpen(false);
                burgerRef.current?.focus();
              }}
            >
              Lukk ✕
            </button>
          </div>

          {/* Closed on click as well as by route derivation, so the overlay never lingers
              for a frame during a client transition. */}
          <nav className="mm-drawer__nav" aria-label="Meny" onClick={() => setOpen(false)}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                <i aria-hidden="true">{item.n}</i>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mm-drawer__fot">
            <a href={`tel:${business.phoneE164}`} className="mm-btn mm-btn--primar">
              Ring {business.phoneDisplay}
            </a>
            <Link
              href="/marine-max/bestill-service"
              className="mm-btn mm-btn--sekundar"
              onClick={() => setOpen(false)}
            >
              Bestill service
            </Link>
            <p className="mm-mono mm-mono--dim" style={{ margin: 0 }}>
              {business.address.street} · {business.address.postalCode}{" "}
              {business.address.locality}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
