import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from '../layout/Container'
import { oneTimePackages, monthlyPlans, addOns, type PricingTier } from '../../../config/pricing'
import { useCart } from '../../lib/cart'

type Tab = 'one-time' | 'monthly'

function OneTimeCard({ pkg, i, cart }: { pkg: PricingTier; i: number; cart: ReturnType<typeof useCart> }) {
  const inCart = cart.hasItem(pkg.id)

  return (
    <motion.div
      className='glass glass-hover glow-border flex flex-col rounded-2xl p-6'
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.07 }}
    >
      <div className='space-y-1'>
        <div className='text-base font-semibold text-[var(--text-primary)]'>{pkg.name}</div>
        {pkg.description && (
          <div className='text-xs text-[var(--text-muted)]'>{pkg.description}</div>
        )}
        <div className='flex items-end gap-2 pt-1'>
          <div className='text-gradient text-2xl font-semibold leading-tight'>{pkg.price}</div>
          <div className='pb-0.5 text-sm text-[var(--text-muted)]'>one-time</div>
        </div>
      </div>

      {(pkg.delivery || pkg.revisions) && (
        <div className='mt-3 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]'>
          {pkg.delivery && (
            <span className='flex items-center gap-1'>
              <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              {pkg.delivery}
            </span>
          )}
          {pkg.revisions && (
            <span className='flex items-center gap-1'>
              <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              {pkg.revisions}
            </span>
          )}
        </div>
      )}

      <ul className='mt-4 flex-1 space-y-2 text-sm text-[var(--text-secondary)]'>
        {pkg.features.map((f) => (
          <li key={f} className='flex gap-2'>
            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60' />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => inCart ? cart.removeItem(pkg.id) : (cart.addItem(pkg), cart.setOpen(true))}
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
          pkg.cta
        )}
      </button>
    </motion.div>
  )
}

function MonthlyCard({ plan, i, cart }: { plan: PricingTier; i: number; cart: ReturnType<typeof useCart> }) {
  const inCart = cart.hasItem(plan.id)

  return (
    <motion.div
      className={`glass glass-hover glow-border flex flex-col rounded-2xl p-6 transition-all ${plan.recommended ? 'ring-1 ring-violet-500/30' : ''}`}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.1 }}
    >
      {plan.recommended && (
        <div className='mb-3 inline-flex w-fit rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400'>
          Recommended
        </div>
      )}

      <div className='space-y-1'>
        <div className='text-base font-semibold text-[var(--text-primary)]'>{plan.name}</div>
        {plan.description && (
          <div className='text-xs text-[var(--text-muted)]'>{plan.description}</div>
        )}
        <div className='flex items-end gap-2 pt-1'>
          <div className='text-gradient text-2xl font-semibold leading-tight'>{plan.price}</div>
          <div className='pb-0.5 text-sm text-[var(--text-muted)]'>/mo</div>
        </div>
      </div>

      <ul className='mt-5 flex-1 space-y-2 text-sm text-[var(--text-secondary)]'>
        {plan.features.map((f) => (
          <li key={f} className='flex gap-2'>
            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60' />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => inCart ? cart.removeItem(plan.id) : (cart.addItem(plan), cart.setOpen(true))}
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
          plan.cta
        )}
      </button>

      <p className='mt-3 text-center text-xs text-[var(--text-faint)]'>
        First 30 days free after project delivery. Then billed monthly. Cancel with 30 days notice.
      </p>
    </motion.div>
  )
}

export function Pricing() {
  const [tab, setTab] = useState<Tab>('one-time')
  const [addOnsOpen, setAddOnsOpen] = useState(false)
  const cart = useCart()

  return (
    <section id='pricing' className='relative border-t border-[var(--border-subtle)] py-16'>
      <div className='glow-orb right-1/4 top-0 h-64 w-64 bg-cyan-500' />

      <Container>
        <motion.div
          className='relative space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Simple, transparent pricing</h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>One-time website packages and optional monthly care plans. All prices in USD. No hidden fees.</p>
        </motion.div>

        {/* Tab switcher + quiz link */}
        <div className='mt-8 flex flex-wrap items-center gap-4'>
        <div className='relative inline-flex rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-1'>
          <button
            onClick={() => setTab('one-time')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'one-time'
                ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            One-time projects
          </button>
          <button
            onClick={() => setTab('monthly')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'monthly'
                ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Monthly plans
          </button>
        </div>
        <Link
          to='/quiz'
          className='flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-violet-400 transition-colors'
        >
          <span>✦</span> Not sure? Take the quiz
          <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
          </svg>
        </Link>
        </div>

        <AnimatePresence mode='wait'>
          {tab === 'one-time' ? (
            <motion.div
              key='one-time'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className='relative mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
            >
              {oneTimePackages.map((pkg, i) => (
                <OneTimeCard key={pkg.id} pkg={pkg} i={i} cart={cart} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key='monthly'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className='relative mt-6 grid gap-4 lg:grid-cols-3'
            >
              {monthlyPlans.map((plan, i) => (
                <MonthlyCard key={plan.id} plan={plan} i={i} cart={cart} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add-ons collapsible */}
        <div className='relative mt-10'>
          <button
            onClick={() => setAddOnsOpen(!addOnsOpen)}
            className='flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${addOnsOpen ? 'rotate-90' : ''}`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
            Available add-ons
          </button>

          <AnimatePresence>
            {addOnsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className='overflow-hidden'
              >
                <div className='glass mt-4 rounded-2xl p-6'>
                  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {addOns.map((addon) => (
                      <div key={addon.id}>
                        <div className='text-sm font-medium text-[var(--text-primary)]'>{addon.name}</div>
                        <div className='mt-0.5 text-xs text-[var(--text-muted)]'>{addon.price}</div>
                      </div>
                    ))}
                  </div>
                  <p className='mt-5 text-xs text-[var(--text-faint)]'>
                    All add-ons are scoped per project.{' '}
                    <a href='#contact' className='text-violet-400 transition-colors hover:text-violet-300'>
                      Get in touch
                    </a>{' '}
                    to discuss your requirements.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className='relative mt-6 text-xs text-[var(--text-faint)]'>
          *Price ranges reflect scope variations. Final quote depends on your specific requirements and content.
        </p>
      </Container>
    </section>
  )
}
