import { Container } from './Container'
import { site } from '../../../config/site'

export function Footer() {
  return (
    <footer className='border-t border-white/[0.06]'>
      <Container>
        <div className='flex flex-col gap-3 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between'>
          <div>
            <span className='font-medium text-white'>{site.agencyName}</span> &middot; {site.location}
          </div>
          <div className='flex flex-wrap gap-4'>
            <a className='transition-colors hover:text-white' href='#services'>
              Services
            </a>
            <a className='transition-colors hover:text-white' href='#mockups'>
              Mockups
            </a>
            <a className='transition-colors hover:text-white' href='#pricing'>
              Pricing
            </a>
            <a className='transition-colors hover:text-white' href='#contact'>
              Contact
            </a>
          </div>
        </div>
        <div className='border-t border-white/[0.06] py-6 text-xs text-slate-600'>
          &copy; {new Date().getFullYear()} {site.agencyName}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
