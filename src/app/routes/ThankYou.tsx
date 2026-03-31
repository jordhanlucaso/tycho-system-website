import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

const nextSteps = [
  {
    step: '1',
    title: 'Check your inbox',
    desc: "You'll get a confirmation email shortly. Check your spam folder if you don't see it.",
  },
  {
    step: '2',
    title: 'I review your request',
    desc: 'Within 1–2 business days, I look at your business and current online presence.',
  },
  {
    step: '3',
    title: 'You hear back with a clear next step',
    desc: "I'll reach out with honest guidance — whether that's a call, a proposal, or a recommendation.",
  },
  {
    step: '4',
    title: 'We move forward if it makes sense',
    desc: 'If a project is the right fit, we scope it out with a fixed proposal. No pressure either way.',
  },
]

export function ThankYou() {
  useEffect(() => {
    document.title = 'Request Received — Tycho Systems'
  }, [])

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='py-20'>
        <Container>
          <motion.div
            className='mx-auto max-w-2xl'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Success icon */}
            <div className='flex justify-center'>
              <motion.div
                className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <svg className='h-8 w-8 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </motion.div>
            </div>

            <div className='mt-6 text-center space-y-3'>
              <h1 className='text-gradient text-3xl font-semibold tracking-tight'>Got your request!</h1>
              <p className='text-[var(--text-secondary)]'>
                Thanks for reaching out. Here's what happens next.
              </p>
            </div>

            {/* Next steps */}
            <div className='mt-10 space-y-4'>
              {nextSteps.map((s, i) => (
                <motion.div
                  key={s.step}
                  className='glass flex items-start gap-4 rounded-xl p-5'
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                >
                  <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-semibold text-violet-400'>
                    {s.step}
                  </span>
                  <div>
                    <div className='text-sm font-semibold text-[var(--text-primary)]'>{s.title}</div>
                    <div className='mt-0.5 text-xs text-[var(--text-secondary)]'>{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              className='mt-10 flex flex-col items-center gap-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className='glass w-full rounded-2xl p-6 text-center space-y-3'>
                <p className='text-sm font-medium text-[var(--text-primary)]'>While you wait</p>
                <p className='text-xs text-[var(--text-secondary)]'>
                  Check out our packages and process to get a feel for how we work.
                </p>
                <a
                  href='/#packages'
                  className='inline-flex items-center gap-2 rounded-xl border border-[var(--border-primary)] px-5 py-2.5 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                >
                  See packages
                  <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                  </svg>
                </a>
              </div>

              <Link
                to='/'
                className='text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'
              >
                Back to home
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
