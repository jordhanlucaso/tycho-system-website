import { Link } from 'react-router'
import { site } from '../../../config/site'
import { emails, mailto, emailSubjects } from '../../../config/contact'
import { HashLink } from '../layout/HashLink'
import { Logo } from '../ui/Logo'

const navigate = [
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
  { href: '/resources', label: 'Resources' },
]

const navLinkClass = 'text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'

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
          <HashLink hash="top" className="mb-4 flex items-center gap-[11px]">
            <Logo size={24} />
            <span className="font-display text-[16px] font-semibold text-[var(--text-primary)]">
              {site.agencyName}
            </span>
          </HashLink>
          <p className="m-0 text-[13.5px] leading-[1.6] text-[var(--text-faint)]">
            Practical AI automation, websites and business systems for small businesses — and the
            people behind them.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
              Navigate
            </div>
            {navigate.map((link) =>
              link.href.startsWith('#') ? (
                <HashLink key={link.href} hash={link.href.slice(1)} className={navLinkClass}>
                  {link.label}
                </HashLink>
              ) : (
                <Link key={link.href} to={link.href} className={navLinkClass}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
              Contact
            </div>
            <a
              href={mailto(emails.contact)}
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {emails.contact}
            </a>
            <a
              href={mailto(emails.support, emailSubjects.support)}
              className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {emails.support}
            </a>
            <HashLink hash="contact" className={navLinkClass}>
              Start a project
            </HashLink>
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
