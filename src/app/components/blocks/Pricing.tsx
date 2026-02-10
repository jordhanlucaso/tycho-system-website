import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { tiers } from '../../../config/pricing'
import { useCart } from '../../lib/cart'

export function Pricing() {
  const cart = useCart()

  return (
    <section id='pricing' className='relative border-t border-[var(--border-subtle)] py-16'>
      {/* Accent glow */}
      <div className='glow-orb right-1/4 top-0 h-64 w-64 bg-cyan-500' />

      <Container>
        <motion.div
          className='relative space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Simple pricing</h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>Clear packages. You can always customize if needed.</p>
        </motion.div>

        <div className='relative mt-8 grid gap-4 lg:grid-cols-3'>
          {tiers.map((t, i) => {
            const inCart = cart.hasItem(t.id)
            return (
              <motion.div
                key={t.name}
                className={`glass glass-hover glow-border rounded-2xl p-6 transition-all ${i === 1 ? 'ring-1 ring-violet-500/30' : ''}`}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <div className='space-y-2'>
                  <div className='text-base font-semibold text-[var(--text-primary)]'>{t.name}</div>
                  <div className='flex items-end gap-2'>
                    <div className='text-gradient text-3xl font-semibold'>{t.price}</div>
                    <div className='pb-1 text-sm text-[var(--text-muted)]'>/{t.note}</div>
                  </div>
                </div>

                <ul className='mt-5 space-y-2 text-sm text-[var(--text-secondary)]'>
                  {t.features.map((f) => (
                    <li key={f} className='flex gap-2'>
                      <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60' />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => inCart ? cart.removeItem(t.id) : (cart.addItem(t), cart.setOpen(true))}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    inCart
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90'
                  }`}
                >
                  {inCart ? (
                    <>
                      <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
                      Added to cart
                    </>
                  ) : (
                    t.cta
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>

        <p className='relative mt-6 text-xs text-[var(--text-faint)]'>*Prices shown are starting points. Final quote depends on scope and content.</p>
      </Container>
    </section>
  )
}
