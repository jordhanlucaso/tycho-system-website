import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
    <header className='sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B1120]/80 backdrop-blur-xl'>
      <Container>
        <div className='flex h-16 items-center justify-between gap-3'>
          <a href='/' className='inline-flex items-center gap-2'>
            <div className='grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white'>
              {site.agencyName.trim().slice(0, 1).toUpperCase()}
            </div>
            <div className='leading-tight'>
              <div className='text-sm font-semibold text-white'>{site.agencyName}</div>
              <div className='text-xs text-slate-500'>Web mockups &middot; Delivery fast</div>
            </div>
          </a>

          <nav className='hidden items-center gap-5 md:flex'>
            {links.map((l) => (
              <a key={l.href} href={l.href} className='text-sm text-slate-400 transition-colors hover:text-white'>
                {l.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-3'>
            <a href='#contact' className='hidden rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex'>
              {site.ctas.primary}
            </a>

            <button
              onClick={() => setOpen(!open)}
              className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] text-slate-400 transition-colors hover:text-white md:hidden'
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

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className='overflow-hidden border-t border-white/[0.06] md:hidden'
            >
              <div className='flex flex-col gap-1 pb-4 pt-2'>
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className='rounded-xl px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white'
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  href='#contact'
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  className='mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:hidden'
                >
                  {site.ctas.primary}
                </motion.a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}
