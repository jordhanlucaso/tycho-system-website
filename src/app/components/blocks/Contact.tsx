import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'
import { site } from '../../../config/site'

export function Contact() {
  return (
    <section id='contact' className='relative border-t border-[var(--border-subtle)] py-16'>
      <div className='glow-orb left-1/3 top-0 h-48 w-48 bg-cyan-500' />

      <Container>
        <div className='relative grid gap-10 lg:grid-cols-2 lg:items-center'>
          <motion.div
            className='space-y-5'
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Get in touch</h2>
            <p className='text-sm text-[var(--text-secondary)]'>
              Have a question before booking? Reach out and we'll get back to you within 24 hours.
            </p>

            <div className='space-y-3'>
              <a
                href={`mailto:${site.email}`}
                className='glass flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-[var(--bg-surface-hover)]'
              >
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10'>
                  <svg className='h-4 w-4 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <div>
                  <div className='text-xs text-[var(--text-muted)]'>Email</div>
                  <div className='text-sm font-medium text-[var(--text-primary)]'>{site.email}</div>
                </div>
              </a>
              <div className='glass flex items-center gap-3 rounded-xl p-4'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10'>
                  <svg className='h-4 w-4 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                </div>
                <div>
                  <div className='text-xs text-[var(--text-muted)]'>Location</div>
                  <div className='text-sm font-medium text-[var(--text-primary)]'>{site.location}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className='space-y-4'
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className='glass rounded-2xl p-6 space-y-4'>
              <div className='space-y-1'>
                <p className='text-xs font-semibold uppercase tracking-wider text-violet-400'>Best first step</p>
                <h3 className='text-base font-semibold text-[var(--text-primary)]'>Book a strategy call</h3>
                <p className='text-sm text-[var(--text-secondary)]'>
                  We'll talk through your business, what you need, and which package fits. No pressure, no hard sell — just honest guidance.
                </p>
              </div>
              <ul className='space-y-1.5 text-xs text-[var(--text-secondary)]'>
                {['Understand your goals', 'Review your current online presence', 'Recommend a package', 'Answer any questions'].map((item) => (
                  <li key={item} className='flex items-center gap-2'>
                    <span className='h-3.5 w-3.5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0'>
                      <span className='text-[8px] text-emerald-400'>&#10003;</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to='/website-check'
                className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
              >
                Book a strategy call
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </Link>
            </div>

            <p className='text-center text-xs text-[var(--text-faint)]'>
              Or email us directly at{' '}
              <a href={`mailto:${site.email}`} className='text-violet-400 hover:text-violet-300 transition-colors'>
                {site.email}
              </a>
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
