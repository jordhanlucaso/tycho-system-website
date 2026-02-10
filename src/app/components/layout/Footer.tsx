import { Container } from './Container'
import { site } from '../../../config/site'

export function Footer() {
  return (
    <footer className='border-t border-[var(--border-subtle)]'>
      <Container>
        <div className='flex flex-col gap-3 py-10 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between'>
          <div>
            <span className='font-medium text-[var(--text-primary)]'>{site.agencyName}</span> &middot; {site.location}
          </div>
          <div className='flex flex-wrap gap-4'>
            <a className='transition-colors hover:text-[var(--text-primary)]' href='#services'>
              Services
            </a>
            <a className='transition-colors hover:text-[var(--text-primary)]' href='#mockups'>
              Mockups
            </a>
            <a className='transition-colors hover:text-[var(--text-primary)]' href='#pricing'>
              Pricing
            </a>
            <a className='transition-colors hover:text-[var(--text-primary)]' href='#contact'>
              Contact
            </a>
          </div>
        </div>
        <div className='border-t border-[var(--border-subtle)] py-6 text-xs text-[var(--text-faint)]'>
          &copy; {new Date().getFullYear()} {site.agencyName}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
