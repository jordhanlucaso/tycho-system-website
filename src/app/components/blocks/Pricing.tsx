import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from '../layout/Container'
import { websitePackages, carePlans, addOns, type Package } from '../../../config/pricing'
import { useCart } from '../../lib/cart'

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US')}`
}

function WebsiteCard({ pkg, i, cart }: { pkg: Package; i: number; cart: ReturnType<typeof useCart> }) {
  const inCart = cart.hasItem(pkg.id)
  const deposit = pkg.depositPriceInCents ?? pkg.priceInCents

  return (
    <motion.div
      className={`glass glass-hover glow-border flex flex-col rounded-2xl p-6 ${pkg.recommended ? 'ring-1 ring-violet-500/40' : ''}`}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: i * 0.07 }}
    >
      {pkg.recommended && (
        <div className='mb-3 inline-flex w-fit rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400'>
          Most popular
        </div>
      )}

      <div className='space-y-1'>
        <div className='text-xs font-mono text-[var(--text-faint)]'>{pkg.sku}</div>
        <div className='text-lg font-semibold text-[var(--text-primary)]'>{pkg.name}</div>
        {pkg.description && (
          <div className='text-xs text-[var(--text-muted)]'>{pkg.description}</div>
        )}
        <div className='flex items-end gap-2 pt-2'>
          <div className='text-gradient text-3xl font-semibold leading-tight'>{pkg.price}</div>
          <div className='pb-1 text-sm text-[var(--text-muted)]'>one-time</div>
        </div>
        <div className='text-xs text-[var(--text-secondary)]'>
          {fmt(deposit)} deposit · {fmt(pkg.priceInCents - deposit)} remaining
        </div>
      </div>

      <div className='mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]'>
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

      <ul className='mt-4 flex-1 space-y-2 text-sm text-[var(--text-secondary)]'>
        {pkg.features.map((f) => (
          <li key={f} className='flex gap-2'>
            <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/60' />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {pkg.outOfScope && pkg.outOfScope.length > 0 && (
        <div className='mt-4 rounded-lg border border-[var(--border-subtle)] px-3 py-2'>
          <div className='mb-1 text-xs font-medium text-[var(--text-faint)]'>Not included</div>
          <ul className='space-y-0.5'>
            {pkg.outOfScope.map((item) => (
              <li key={item} className='flex gap-2 text-xs text-[var(--text-faint)]'>
                <span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--text-faint)]' />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => { cart.addItem(pkg); cart.setOpen(true) }}
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
            Selected
          </>
        ) : pkg.cta}
      </button>
    </motion.div>
  )
}

function CarePlanCard({ plan, i }: { plan: Package; i: number }) {
  return (
    <motion.div
      className={`glass flex flex-col rounded-2xl p-5 ${plan.recommended ? 'ring-1 ring-violet-500/20' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
    >
      {plan.recommended && (
        <div className='mb-2 inline-flex w-fit rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400'>
          Most popular
        </div>
      )}
      <div className='text-sm font-semibold text-[var(--text-primary)]'>{plan.name}</div>
      <div className='mt-1 flex items-end gap-1'>
        <span className='text-gradient text-xl font-semibold'>{plan.price}</span>
        <span className='pb-0.5 text-xs text-[var(--text-muted)]'>/mo</span>
      </div>
      <ul className='mt-3 flex-1 space-y-1.5'>
        {plan.features.map((f) => (
          <li key={f} className='flex gap-2 text-xs text-[var(--text-secondary)]'>
            <span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/60' />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Pricing() {
  const [addOnsOpen, setAddOnsOpen] = useState(false)
  const cart = useCart()

  return (
    <section id='packages' className='relative border-t border-[var(--border-subtle)] py-16'>
      <div className='glow-orb right-1/4 top-0 h-64 w-64 bg-cyan-500' />

      <Container>
        {/* Header */}
        <motion.div
          className='relative space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>
            Packages
          </h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>
            Fixed scope, clear pricing, and a predictable process. Pick the package that fits your business.
          </p>
          <p className='text-xs text-[var(--text-muted)]'>
            If your project falls outside the listed scope, we'll recommend a custom quote instead.
          </p>
        </motion.div>

        {/* Website package cards */}
        <div className='relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {websitePackages.map((pkg, i) => (
            <WebsiteCard key={pkg.id} pkg={pkg} i={i} cart={cart} />
          ))}
        </div>

        {/* Care plans — informational, available after launch */}
        <div className='relative mt-14'>
          <div className='mb-5 flex flex-wrap items-start gap-3 sm:items-center'>
            <div>
              <h3 className='text-base font-semibold text-[var(--text-primary)]'>Monthly care plans</h3>
              <p className='mt-0.5 text-xs text-[var(--text-muted)]'>
                Available after your website launches. Billed monthly, cancel with 30 days notice.
              </p>
            </div>
            <span className='ml-auto shrink-0 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400'>
              Available after launch
            </span>
          </div>

          <div className='grid gap-4 sm:grid-cols-3'>
            {carePlans.map((plan, i) => (
              <CarePlanCard key={plan.id} plan={plan} i={i} />
            ))}
          </div>

          <p className='mt-4 text-xs text-[var(--text-faint)]'>
            Care plans are set up after your project is delivered. First 30 days included free with any website package.
          </p>
        </div>

        {/* Add-ons collapsible */}
        <div className='relative mt-10'>
          <button
            onClick={() => setAddOnsOpen(!addOnsOpen)}
            className='flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${addOnsOpen ? 'rotate-90' : ''}`}
              fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
            Fixed-price add-ons
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
                        <div className='mt-0.5 text-sm font-semibold text-gradient'>{addon.price}</div>
                      </div>
                    ))}
                  </div>
                  <p className='mt-5 text-xs text-[var(--text-faint)]'>
                    Add-ons are scoped per project.{' '}
                    <a href='#contact' className='text-violet-400 transition-colors hover:text-violet-300'>
                      Get in touch
                    </a>{' '}
                    to discuss requirements.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Custom project CTA */}
        <motion.div
          className='relative mt-10 glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className='text-sm font-semibold text-[var(--text-primary)]'>Need something custom?</div>
            <p className='mt-1 max-w-md text-xs text-[var(--text-secondary)]'>
              Custom projects such as booking systems, multi-location websites, multilingual builds, and advanced integrations are quoted separately.
            </p>
          </div>
          <Link
            to='/website-check'
            className='shrink-0 inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-500/20'
          >
            Request Custom Quote
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
