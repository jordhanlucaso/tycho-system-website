import { useState } from 'react'
import { site } from '../../../config/site'
import { Container } from './Container'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#mockups', label: 'Mockups' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' }
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className='sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur'>
      <Container>
        <div className='flex h-16 items-center justify-between gap-3'>
          <a href='/' className='inline-flex items-center gap-2'>
            <div className='grid h-9 w-9 place-items-center rounded-xl bg-black text-sm font-semibold text-white'>{site.agencyName.trim().slice(0, 1).toUpperCase()}</div>
            <div className='leading-tight'>
              <div className='text-sm font-semibold'>{site.agencyName}</div>
              <div className='text-xs text-neutral-600'>Web mockups &middot; Delivery fast</div>
            </div>
          </a>

          <nav className='hidden items-center gap-5 md:flex'>
            {links.map((l) => (
              <a key={l.href} href={l.href} className='text-sm text-neutral-700 hover:text-black'>
                {l.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-3'>
            <a href='#contact' className='hidden rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 sm:inline-flex'>
              {site.ctas.primary}
            </a>

            <button
              onClick={() => setOpen(!open)}
              className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 md:hidden'
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                {open ? (
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className='border-t border-neutral-200 pb-4 pt-2 md:hidden'>
            <div className='flex flex-col gap-1'>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className='rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-black'
                >
                  {l.label}
                </a>
              ))}
              <a
                href='#contact'
                onClick={() => setOpen(false)}
                className='mt-2 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 sm:hidden'
              >
                {site.ctas.primary}
              </a>
            </div>
          </nav>
        )}
      </Container>
    </header>
  )
}
