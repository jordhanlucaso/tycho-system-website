"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import { BASE, NAV_ITEMS } from "./nav";

type HeaderProps = {
  businessName: string;
  tagline: string;
  phone: string;
};

export function Header({ businessName, tagline, phone }: HeaderProps) {
  /**
   * The header is rendered once by the layout, for both routes. On the contact route the
   * in-page sections do not exist, so the nav links back to the front page and the
   * scrollspy stays off.
   */
  const pathname = usePathname();
  const variant = pathname === BASE ? "home" : "subpage";
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Shadow appears once the page has moved, not before.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy. The band across the upper third of the viewport decides the active section,
  // so a heading scrolling into view wins before it reaches the middle of the screen.
  useEffect(() => {
    if (variant !== "home") return;
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-88px 0px -62% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [variant]);

  // Sheet: lock the page, close on Escape, hand focus in and back out again.
  useEffect(() => {
    if (!sheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sheetOpen]);

  const closeSheet = () => {
    setSheetOpen(false);
    toggleRef.current?.focus();
  };

  const hrefFor = (id: string) => (variant === "home" ? `#${id}` : `${BASE}#${id}`);
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <header
      className={`sticky top-0 z-50 bg-cr-ink transition-shadow duration-200 ${
        scrolled ? "shadow-[0_10px_30px_-12px_rgba(5,10,20,.65)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-6">
        {/* No aria-label: the accessible name has to contain the visible text, tagline included. */}
        <Link href={BASE} className="rounded-lg py-1">
          <Logo businessName={businessName} tagline={tagline} />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={hrefFor(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold transition-colors ${
                      isActive ? "text-white" : "text-white/65 hover:text-white"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        className={`absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-[var(--cr-accent)] transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={variant === "home" ? "#contact" : "#contact-form"}
            className="accent-button hidden min-h-11 items-center rounded-lg px-5 text-[15px] font-bold transition-colors md:inline-flex"
          >
            Get a Free Estimate
          </a>
          <a
            href={telHref}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-white md:hidden"
            aria-label={`Call ${phone}`}
          >
            <Icon name="phone" className="h-5 w-5" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            aria-controls="mobile-menu"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white lg:hidden"
          >
            <Icon name="menu" className="h-6 w-6" title="Open menu" />
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <div
          id="mobile-menu"
          ref={sheetRef}
          className="fixed inset-0 z-50 flex flex-col bg-cr-ink-deep lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between px-5 py-3">
            <Logo businessName={businessName} tagline={tagline} />
            <button
              type="button"
              onClick={closeSheet}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white"
            >
              <Icon name="close" className="h-6 w-6" title="Close menu" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="border-b border-white/10">
                  <a
                    href={hrefFor(item.id)}
                    onClick={closeSheet}
                    className="flex min-h-14 items-center font-cr-display text-2xl font-bold text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 px-5 pb-8">
            <a
              href={variant === "home" ? "#contact" : "#contact-form"}
              onClick={closeSheet}
              className="accent-button flex min-h-12 items-center justify-center rounded-lg text-base font-bold"
            >
              Get a Free Estimate
            </a>
            <a
              href={telHref}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 text-base font-semibold text-white"
            >
              <Icon name="phone" className="h-5 w-5" />
              Call {phone}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
