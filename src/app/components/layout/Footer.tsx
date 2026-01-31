import { Container } from './Container'
import { site } from '../../../config/site'

export function Footer() {
  return (
    <footer className='border-t border-neutral-200 bg-white'>
      <Container>
        <div className='flex flex-col gap-3 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between'>
          <div>
            <span className='font-medium text-neutral-900'>{site.agencyName}</span> · {site.location}
          </div>
          <div className='flex flex-wrap gap-4'>
            <a className='hover:text-black' href='#services'>
              Services
            </a>
            <a className='hover:text-black' href='#mockups'>
              Mockups
            </a>
            <a className='hover:text-black' href='#pricing'>
              Pricing
            </a>
            <a className='hover:text-black' href='#contact'>
              Contact
            </a>
          </div>
        </div>
        <div className='border-t border-neutral-200 py-6 text-xs text-neutral-500'>
          © {new Date().getFullYear()} {site.agencyName}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
