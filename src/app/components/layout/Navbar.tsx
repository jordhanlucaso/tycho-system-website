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
  return (
    <header className='sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur'>
      <Container>
        <div className='flex h-16 items-center justify-between gap-3'>
          <a href='#' className='inline-flex items-center gap-2'>
            <div className='grid h-9 w-9 place-items-center rounded-xl bg-black text-sm font-semibold text-white'>{site.agencyName.trim().slice(0, 1).toUpperCase()}</div>
            <div className='leading-tight'>
              <div className='text-sm font-semibold'>{site.agencyName}</div>
              <div className='text-xs text-neutral-600'>Web mockups • Delivery fast</div>
            </div>
          </a>

          <nav className='hidden items-center gap-5 md:flex'>
            {links.map((l) => (
              <a key={l.href} href={l.href} className='text-sm text-neutral-700 hover:text-black'>
                {l.label}
              </a>
            ))}
          </nav>

          <a href='#contact' className='rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90'>
            {site.ctas.primary}
          </a>
        </div>
      </Container>
    </header>
  )
}
