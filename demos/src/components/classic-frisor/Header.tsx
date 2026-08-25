"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { CF_NAV } from "@/data/nav";

/**
 * The drawer's open state is scoped to the pathname it was opened on, so navigating closes
 * it by derivation rather than by an effect resetting state after the fact. React 19 flags
 * the effect version, and correctly — there is a frame where the drawer is open on the new
 * page before the effect runs.
 */
export function Header() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const setOpen = useCallback(
    (next: boolean) => setOpenOn(next ? pathname : null),
    [pathname],
  );

  return (
    <header className="cf-topp">
      <div className="cf-shell">
        <div className="cf-topp__rad">
          <Link href="/classic-frisor" className="cf-merke">
            <span className="cf-merke__navn">Classic Frisør</span>
            <span className="cf-merke__sted">Teie · Nøtterøy</span>
          </Link>

          <nav className="cf-topp__nav" aria-label="Hovedmeny">
            {CF_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/classic-frisor/bestill-time" className="cf-btn cf-btn--primar">
              Bestill time
            </Link>
          </nav>

          <button
            type="button"
            className="cf-burger"
            aria-expanded={open}
            aria-controls="cf-skuff"
            onClick={() => setOpen(!open)}
          >
            {open ? "Lukk" : "Meny"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="cf-skuff" id="cf-skuff">
          <div className="cf-shell">
            <nav aria-label="Meny">
              {CF_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/classic-frisor/bestill-time" onClick={() => setOpen(false)}>
                Bestill time
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
