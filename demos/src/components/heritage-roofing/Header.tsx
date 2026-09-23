"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HR_NAV } from "./nav";
import Logo from "./Logo";

/**
 * Sticky header. Transparent over the hero, solid once the page moves.
 *
 * The scroll state is read with a passive listener rather than an IntersectionObserver
 * sentinel, because the header has to be solid on every route except the home page from
 * the first paint — a sentinel gives a one-frame flash of white-on-white on the inner
 * pages, where there is no dark hero underneath.
 */
export default function Header({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/heritage-roofing";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is open the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={`hr-header sticky top-0 z-50 border-b ${
        solid
          ? "border-hr-hairline bg-hr-paper/95 shadow-[0_1px_16px_rgba(28,34,36,0.07)] backdrop-blur"
          // Not `bg-transparent`. The header overlaps a photographic hero, so the colour
          // actually behind this white type is whatever the photo happens to be — and a
          // light sky in a replacement hero image would take the logo with it. Opaque
          // rather than translucent: the hero's own scrim is rgba(23,29,30,.95) at the
          // left, so a solid slate-deep bar is all but indistinguishable from transparent
          // there — and it is the only version whose contrast can actually be resolved.
          // A translucent fill composites against the page's warm paper: 1.12:1.
          : "border-transparent bg-hr-slate-deep"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center gap-4 px-5 sm:px-6">
        <Link
          href="/heritage-roofing"
          className="flex min-h-[44px] flex-none items-center"
          aria-label="Heritage Roofing — home"
        >
          <Logo onDark={!solid} />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-6 lg:flex">
          {HR_NAV.filter((i) => i.inHeader).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] items-center text-[0.88rem] font-medium transition-colors ${
                  solid
                    ? active
                      ? "text-hr-brass-ink"
                      : "text-hr-ink-soft hover:text-hr-ink"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-6">
          <a
            href={`tel:${phoneHref}`}
            className={`hr-tel hidden min-h-[44px] items-center text-[0.95rem] font-bold sm:inline-flex ${
              solid ? "text-hr-ink" : "text-white"
            }`}
          >
            {phone}
          </a>
          <Link
            href="/heritage-roofing/estimate"
            className="hidden min-h-[44px] items-center bg-hr-brass-solid px-5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-hr-brass-hover sm:inline-flex"
          >
            Get a Free Estimate
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="hr-drawer"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden ${
              solid ? "text-hr-ink" : "text-white"
            }`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="m6 6 12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="hr-drawer" className="border-t border-hr-hairline bg-hr-paper lg:hidden">
          <nav aria-label="Main" className="mx-auto max-w-7xl px-5 py-3 sm:px-6">
            {HR_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                // Closed here rather than on a pathname effect: tapping the link is the
                // event, and the drawer must not survive into the next page.
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center border-b border-hr-hairline text-[0.98rem] font-medium text-hr-ink last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
