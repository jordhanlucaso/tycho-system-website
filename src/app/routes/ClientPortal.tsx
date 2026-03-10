import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../lib/auth'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

export function ClientPortal() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Client Portal — Tycho Systems'
  }, [])

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading || !user) return null

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <motion.div
            className='mx-auto max-w-2xl'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className='flex items-start justify-between gap-4 flex-wrap'>
              <div>
                <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Client Portal</h1>
                <p className='mt-1 text-sm text-[var(--text-secondary)]'>
                  Signed in as <span className='text-[var(--text-primary)] font-medium'>{user.email}</span>
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className='rounded-xl border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              >
                Sign out
              </button>
            </div>

            <div className='mt-8 space-y-4'>
              {/* Dashboard links */}
              <Link
                to='/dashboard'
                className='glass glass-hover glow-border flex items-center justify-between rounded-2xl p-5 transition-all'
              >
                <div>
                  <div className='text-sm font-semibold text-[var(--text-primary)]'>My Dashboard</div>
                  <div className='mt-0.5 text-xs text-[var(--text-secondary)]'>Sites, invoices, and account settings</div>
                </div>
                <svg className='h-4 w-4 text-[var(--text-muted)]' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </Link>

              {/* Coming soon placeholder */}
              <div className='glass rounded-2xl p-5 space-y-3 opacity-60'>
                <div className='flex items-center gap-2'>
                  <div className='text-sm font-semibold text-[var(--text-primary)]'>Project Updates</div>
                  <span className='rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400'>Coming soon</span>
                </div>
                <div className='text-xs text-[var(--text-secondary)]'>Track the progress of your website build in real time.</div>
              </div>

              <div className='glass rounded-2xl p-5 space-y-3 opacity-60'>
                <div className='flex items-center gap-2'>
                  <div className='text-sm font-semibold text-[var(--text-primary)]'>Content Requests</div>
                  <span className='rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400'>Coming soon</span>
                </div>
                <div className='text-xs text-[var(--text-secondary)]'>Submit small edits and update requests directly from here.</div>
              </div>
            </div>

            <div className='mt-8 rounded-xl border border-[var(--border-subtle)] p-4'>
              <p className='text-xs text-[var(--text-muted)]'>
                Need help?{' '}
                <a href='mailto:hello@tychosystems.com' className='text-violet-400 hover:text-violet-300 transition-colors'>
                  Email us directly
                </a>{' '}
                or{' '}
                <Link to='/#contact' className='text-violet-400 hover:text-violet-300 transition-colors'>
                  use the contact form
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
