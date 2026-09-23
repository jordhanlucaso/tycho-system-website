import Link from "next/link";
import type { SiteConfig } from "@/data/heritage-roofing";
import { footerLinks } from "@/data/heritage-roofing";
import Logo from "./Logo";
import { Roofline } from "./Primitives";

/**
 * Footer.
 *
 * Carries the two things that are both verified and useful: the founding year and the
 * Alabama Home Builders Licensure Board number from the BBB profile. No manufacturer
 * certifications, no awards, and no "BBB Accredited" — the rating is A+, the business is
 * not accredited, and a footer is where that distinction usually gets lost.
 *
 * No street address. Public records disagree — one listing says Brevard Ave in Montgomery,
 * others point at Millbrook and a PO box — so `siteConfig.address` is null and the footer
 * shows a city and a region instead. Publishing the wrong address for a contractor, or a
 * home address, is not a small mistake.
 *
 * The concept notice sits on the last line, small but not hidden. It is the one thing on
 * the page that must never be ambiguous: this site is not operated by Heritage Roofing.
 */
export default function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="hr-dark hr-shingles bg-hr-slate-deep text-white">
      <Roofline className="text-hr-brass" />
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-[22rem] text-[0.92rem] leading-relaxed text-hr-muted">
              {config.extendedName} — serving {config.city} &amp; the {config.region} since{" "}
              {config.since}.
            </p>
            {/* No <address>: siteConfig.address is null until Justin confirms which of the
                conflicting public addresses customers should use. */}
            <p className="mt-4 text-[0.82rem] leading-relaxed text-hr-muted/80">
              {config.license.authority} · License #{config.license.number}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-brass-glow">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] text-hr-muted hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-brass-glow">
              Contact
            </h2>
            <a
              href={`tel:${config.phoneHref}`}
              className="hr-tel mt-4 inline-flex min-h-[44px] items-center font-hr-display text-[1.3rem] font-bold text-white"
            >
              {config.phone}
            </a>
            <p className="mt-2 text-[0.92rem] text-hr-muted">{config.serviceArea}</p>
            <Link
              href="/heritage-roofing/estimate"
              className="mt-5 inline-flex min-h-[46px] items-center bg-hr-brass-solid px-5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-white hover:bg-hr-brass-hover"
            >
              Request an Estimate
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hr-hairline-dark pt-6 text-[0.78rem] text-hr-muted/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {config.extendedName} · {config.location}
          </p>
          <p>Website concept by Tycho Systems · not an official Heritage Roofing website</p>
        </div>
      </div>
    </footer>
  );
}
