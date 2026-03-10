import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '../../components/layout/Container'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { getNiche } from '../../../config/niches'

export function NichePage() {
  const { niche: slug } = useParams<{ niche: string }>()
  const niche = getNiche(slug ?? '')

  useEffect(() => {
    if (niche) document.title = niche.metaTitle
  }, [niche])

  if (!niche) return <Navigate to='/404' replace />

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main>
        {/* Hero */}
        <section className='relative overflow-hidden py-20 sm:py-28'>
          <div className='glow-orb -top-32 left-1/4 h-96 w-96 bg-violet-600' />
          <div className='bg-grid absolute inset-0' />
          <Container>
            <motion.div
              className='relative max-w-2xl space-y-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className='inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--text-secondary)]'>
                <span className='h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' />
                Built for {niche.namePlural}
              </div>
              <h1 className='text-gradient text-4xl font-semibold tracking-tight sm:text-5xl'>{niche.headline}</h1>
              <p className='text-lg text-[var(--text-secondary)]'>{niche.subheadline}</p>
              <p className='text-sm text-[var(--text-secondary)] max-w-prose'>{niche.description}</p>
              <div className='flex flex-wrap gap-3'>
                <Link
                  to='/website-check'
                  className='rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
                >
                  Get a free website check
                </Link>
                <a
                  href='#pricing'
                  className='rounded-2xl border border-[var(--border-primary)] px-5 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                >
                  See pricing
                </a>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Pain points → Outcomes */}
        <section className='border-t border-[var(--border-subtle)] py-16'>
          <Container>
            <div className='grid gap-10 lg:grid-cols-2'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>Sound familiar?</h2>
                <ul className='space-y-3'>
                  {niche.painPoints.map((p) => (
                    <li key={p} className='flex items-start gap-3 text-sm text-[var(--text-secondary)]'>
                      <span className='mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center'>
                        <span className='text-[10px] text-red-400'>✕</span>
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>What changes</h2>
                <ul className='space-y-3'>
                  {niche.outcomes.map((o) => (
                    <li key={o} className='flex items-start gap-3 text-sm text-[var(--text-secondary)]'>
                      <span className='mt-0.5 h-4 w-4 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center'>
                        <span className='text-[10px] text-emerald-400'>✓</span>
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className='border-t border-[var(--border-subtle)] py-16'>
          <Container>
            <motion.h2
              className='text-gradient text-2xl font-semibold tracking-tight mb-8'
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Everything included for {niche.namePlural}
            </motion.h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {niche.features.map((f, i) => (
                <motion.div
                  key={f}
                  className='glass rounded-xl p-4 flex items-center gap-3'
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <span className='h-5 w-5 shrink-0 rounded-full bg-violet-500/10 flex items-center justify-center'>
                    <span className='text-[10px] text-violet-400'>✓</span>
                  </span>
                  <span className='text-sm text-[var(--text-secondary)]'>{f}</span>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className='border-t border-[var(--border-subtle)] py-16'>
          <Container>
            <motion.div
              className='glass rounded-3xl p-10 text-center space-y-5'
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className='text-gradient text-2xl font-semibold tracking-tight'>
                Ready to get more {niche.namePlural.toLowerCase()} customers?
              </h2>
              <p className='text-sm text-[var(--text-secondary)] max-w-md mx-auto'>
                Start with a free website check. We'll show you exactly what's holding your online presence back.
              </p>
              <Link
                to='/website-check'
                className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
              >
                Get my free website check
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
