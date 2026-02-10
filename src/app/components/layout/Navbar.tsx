import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { site } from '../../../config/site'
import { useAuth } from '../../lib/auth'
import { useCart } from '../../lib/cart'
import { useTheme } from '../../lib/theme'
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
  const { user, signOut } = useAuth()
  const cart = useCart()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className='sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--bg-primary-alpha)] backdrop-blur-xl'>
      <Container>
        <div className='flex h-16 items-center justify-between gap-3'>
          <a href='/' className='inline-flex items-center gap-2'>
            <img src='/logo.svg' alt={site.agencyName} className='h-9' />
          </a>

          <nav className='hidden items-center gap-5 md:flex'>
            {links.map((l) => (
              <a key={l.href} href={l.href} className='text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'>
                {l.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-3'>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              ) : (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                </svg>
              )}
            </button>

            {/* Cart button */}
            <button
              onClick={() => cart.toggleDrawer()}
              className='relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              aria-label='Open cart'
            >
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' />
              </svg>
              {cart.itemCount > 0 && (
                <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-semibold text-white'>
                  {cart.itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className='hidden items-center gap-2 sm:flex'>
                <Link to='/dashboard' className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-xs font-semibold text-white' title={user.email ?? 'Account'}>
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </Link>
                <button onClick={() => signOut()} className='text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to='/login' className='hidden rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex'>
                Sign in
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] md:hidden'
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
              className='overflow-hidden border-t border-[var(--border-subtle)] md:hidden'
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
                    className='rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                  >
                    {l.label}
                  </motion.a>
                ))}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                    className='mt-2 flex items-center gap-3 px-3 sm:hidden'
                  >
                    <Link to='/dashboard' onClick={() => setOpen(false)} className='text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'>
                      Dashboard
                    </Link>
                    <button onClick={() => { signOut(); setOpen(false) }} className='text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'>
                      Sign out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                    className='mt-2 sm:hidden'
                  >
                    <Link
                      to='/login'
                      onClick={() => setOpen(false)}
                      className='inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
                    >
                      Sign in
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}
