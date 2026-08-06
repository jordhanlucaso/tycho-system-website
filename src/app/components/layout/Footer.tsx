import { Link } from 'react-router'
import { Container } from './Container'
import { HashLink } from './HashLink'
import { Logo } from '../ui/Logo'
import { site } from '../../../config/site'
import { CookieSettingsButton } from '../consent/CookieSettingsButton'

export function Footer() {
  return (
    <footer className='border-t border-[var(--border-primary)]'>
      <Container>
        <div className='flex flex-col gap-3 py-10 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-[11px]'>
            <Logo size={22} />
            <span className='font-display font-semibold text-[var(--text-primary)]'>{site.agencyName}</span>
            <span className='text-[var(--text-faint)]'>&middot; {site.location}</span>
          </div>
          <div className='flex flex-wrap gap-4'>
            <HashLink hash='work' className='transition-colors hover:text-[var(--text-primary)]'>
              Work
            </HashLink>
            <HashLink hash='process' className='transition-colors hover:text-[var(--text-primary)]'>
              Process
            </HashLink>
            <HashLink hash='services' className='transition-colors hover:text-[var(--text-primary)]'>
              Services
            </HashLink>
            <HashLink hash='contact' className='transition-colors hover:text-[var(--text-primary)]'>
              Contact
            </HashLink>
            <Link to='/terms' className='transition-colors hover:text-[var(--text-primary)]'>
              Terms
            </Link>
            <Link to='/privacy' className='transition-colors hover:text-[var(--text-primary)]'>
              Privacy
            </Link>
            <Link to='/refunds' className='transition-colors hover:text-[var(--text-primary)]'>
              Refunds
            </Link>
            <Link to='/cookies' className='transition-colors hover:text-[var(--text-primary)]'>
              Cookies
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
        <div className='border-t border-[var(--border-subtle)] py-6 font-mono text-[11.5px] tracking-[0.05em] text-[var(--text-fainter)]'>
          &copy; {new Date().getFullYear()} {site.agencyName} &middot; CHARTED WITH PRECISION
        </div>
      </Container>
    </footer>
  )
}
