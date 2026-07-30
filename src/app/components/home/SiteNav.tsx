import { Link } from 'react-router'
import { site } from '../../../config/site'
import { HashLink } from '../layout/HashLink'
import { Logo } from '../ui/Logo'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
  { href: '/resources', label: 'Resources' },
]

const linkClass =
  'rounded-lg px-[14px] py-2 text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'

/**
 * Sticky homepage nav: orbital mark + wordmark on the left, anchor links and a
 * primary "Start a project" action on the right. Wraps on narrow widths.
 *
 * Section links go through HashLink so they work from any route: on the
 * homepage they smooth-scroll, and from a subpage (e.g. /resources/*) they
 * navigate home to `/#section` first. The `/resources` link is a normal route.
 */
export function SiteNav() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-primary)]"
      style={{ backdropFilter: 'blur(14px)', background: 'var(--bg-primary-alpha)' }}
    >
      <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-[clamp(20px,6vw,80px)] py-4">
        <HashLink hash="top" className="flex items-center gap-[11px]">
          <Logo size={26} />
          <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {site.agencyName}
          </span>
        </HashLink>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) =>
            link.href.startsWith('#') ? (
              <HashLink key={link.href} hash={link.href.slice(1)} className={linkClass}>
                {link.label}
              </HashLink>
            ) : (
              <Link key={link.href} to={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          )}
          <HashLink
            hash="contact"
            className="ml-[6px] inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] bg-[var(--azure)] px-4 py-[9px] text-[14px] font-semibold text-[var(--bg-primary)] transition-colors hover:bg-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
          >
            Start a project
          </HashLink>
        </div>
      </nav>
    </header>
  )
}
