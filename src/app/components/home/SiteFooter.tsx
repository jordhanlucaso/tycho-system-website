import { Link } from 'react-router-dom'
import { site } from '../../../config/site'
import { Logo } from '../ui/Logo'

const navigate = [
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
]

/**
 * Footer: brand + tagline, Navigate / Contact link columns, and a mono bottom
 * strip with the copyright and the "charted with precision" coordinates.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-primary)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-x-12 gap-y-8 px-[clamp(20px,6vw,80px)] py-[clamp(40px,5vw,60px)]">
        <div className="max-w-[300px]">
          <a href="#top" className="mb-4 flex items-center gap-[11px]">
            <Logo size={24} />
            <span className="font-display text-[16px] font-semibold text-[var(--text-primary)]">
              {site.agencyName}
            </span>
          </a>
          <p className="m-0 text-[13.5px] leading-[1.6] text-[var(--text-faint)]">
            Modern websites for local businesses — and the people behind them.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
              Navigate
            </div>
            {navigate.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
              Contact
            </div>
            <a
              href={`mailto:${site.email}`}
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {site.email}
            </a>
            <a
              href="#contact"
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Start a project
            </a>
          </div>

          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
              Legal
            </div>
            <Link
              to="/terms"
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Privacy
            </Link>
            <Link
              to="/refunds"
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 px-[clamp(20px,6vw,80px)] py-[18px] font-mono text-[11.5px] tracking-[0.05em] text-[var(--text-fainter)]">
          <span>© {year} {site.agencyName}</span>
          <span>LAT 0.00 · LON 0.00 · CHARTED WITH PRECISION</span>
        </div>
      </div>
    </footer>
  )
}
