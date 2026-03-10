import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'

type CTABannerProps = {
  headline?: string
  subheadline?: string
  primaryLabel?: string
  primaryHref?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryHref?: string
  secondaryTo?: string
}

export function CTABanner({
  headline = 'Not sure where to start?',
  subheadline = 'Get a free 5-point check on your current website. No commitment, no hard sell.',
  primaryLabel = 'Get my free website check',
  primaryTo = '/website-check',
  primaryHref,
  secondaryLabel = 'See pricing',
  secondaryHref = '#pricing',
}: CTABannerProps) {
  return (
    <section className='relative border-t border-[var(--border-subtle)] py-16 overflow-hidden'>
      <div className='glow-orb left-1/3 top-0 h-64 w-64 bg-violet-600 opacity-20' />
      <div className='glow-orb right-1/4 bottom-0 h-48 w-48 bg-cyan-500 opacity-20' />

      <Container>
        <motion.div
          className='relative glass rounded-3xl px-8 py-12 text-center space-y-6'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight sm:text-3xl'>{headline}</h2>
          <p className='mx-auto max-w-md text-sm text-[var(--text-secondary)]'>{subheadline}</p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            {primaryTo ? (
              <Link
                to={primaryTo}
                className='rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
              >
                {primaryLabel}
              </Link>
            ) : (
              <a
                href={primaryHref ?? '#'}
                className='rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
              >
                {primaryLabel}
              </a>
            )}
            {secondaryLabel && (
              secondaryHref ? (
                <a
                  href={secondaryHref}
                  className='rounded-2xl border border-[var(--border-primary)] px-6 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                >
                  {secondaryLabel}
                </a>
              ) : (
                <Link
                  to={secondaryHref ?? '#'}
                  className='rounded-2xl border border-[var(--border-primary)] px-6 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                >
                  {secondaryLabel}
                </Link>
              )
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
