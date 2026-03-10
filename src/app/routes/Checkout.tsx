import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../lib/cart'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { CartDrawer } from '../components/layout/CartDrawer'

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US')}`
}

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

export function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Checkout — Tycho Systems'
  }, [])

  useEffect(() => {
    if (cart.itemCount === 0) navigate('/', { replace: true })
  }, [cart.itemCount, navigate])

  if (cart.itemCount === 0) return null

  const oneTimeItems = cart.items.filter((i) => !i.recurring)
  const recurringItems = cart.items.filter((i) => i.recurring)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:     form.get('name') as string,
          customerEmail:    form.get('email') as string,
          customerBusiness: form.get('business') as string,
          customerPhone:    form.get('phone') as string || undefined,
          items: cart.items.map((i) => ({
            name:         i.name,
            priceInCents: i.priceInCents,
            recurring:    i.recurring,
            delivery:     i.delivery,
            revisions:    i.revisions,
            features:     i.features,
            description:  i.description,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create agreement')

      // Store contract details for the signing page
      sessionStorage.setItem('contract_id', data.contractId)
      sessionStorage.setItem('contract_text', data.contractText)
      sessionStorage.setItem('checkout_email', form.get('email') as string)

      navigate('/checkout/sign')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress indicator */}
            <div className='flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8'>
              <span className='flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white text-xs font-medium'>1</span>
              <span className='text-[var(--text-primary)] font-medium'>Your details</span>
              <span className='text-[var(--text-faint)]'>→</span>
              <span className='flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-primary)] text-xs font-medium text-[var(--text-muted)]'>2</span>
              <span>Sign agreement</span>
              <span className='text-[var(--text-faint)]'>→</span>
              <span className='flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-primary)] text-xs font-medium text-[var(--text-muted)]'>3</span>
              <span>Payment</span>
            </div>

            <h1 className='text-gradient text-3xl font-semibold tracking-tight'>Your details</h1>
            <p className='mt-2 text-sm text-[var(--text-secondary)]'>
              Review your order and enter your details. You'll sign the service agreement before payment.
            </p>

            <div className='mt-8 grid gap-8 lg:grid-cols-2'>
              {/* Order Summary */}
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Order summary</h2>

                {oneTimeItems.length > 0 && (
                  <div>
                    {cart.items.some((i) => i.recurring) && (
                      <div className='mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]'>One-time projects</div>
                    )}
                    <div className='space-y-2'>
                      {oneTimeItems.map((item) => (
                        <div key={item.id} className='glass flex items-start justify-between rounded-xl p-4 gap-4'>
                          <div className='min-w-0'>
                            <div className='font-semibold text-[var(--text-primary)]'>{item.name}</div>
                            {item.description && <div className='text-xs text-[var(--text-muted)] mt-0.5'>{item.description}</div>}
                            <div className='mt-1 flex flex-wrap gap-2 text-xs text-[var(--text-faint)]'>
                              {item.delivery && <span>{item.delivery}</span>}
                              {item.revisions && <span>· {item.revisions}</span>}
                            </div>
                          </div>
                          <div className='shrink-0 text-right'>
                            <div className='text-gradient font-semibold'>{item.price}</div>
                            <div className='text-xs text-[var(--text-muted)]'>one-time</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recurringItems.length > 0 && (
                  <div>
                    {cart.items.some((i) => !i.recurring) && (
                      <div className='mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]'>Monthly subscriptions</div>
                    )}
                    <div className='space-y-2'>
                      {recurringItems.map((item) => (
                        <div key={item.id} className='glass flex items-start justify-between rounded-xl p-4 gap-4'>
                          <div className='min-w-0'>
                            <div className='font-semibold text-[var(--text-primary)]'>{item.name}</div>
                            {item.description && <div className='text-xs text-[var(--text-muted)] mt-0.5'>{item.description}</div>}
                          </div>
                          <div className='shrink-0 text-right'>
                            <div className='text-gradient font-semibold'>{item.price}</div>
                            <div className='text-xs text-[var(--text-muted)]'>/mo</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className='glass rounded-xl p-4 space-y-2'>
                  {cart.oneTimeTotal > 0 && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-[var(--text-secondary)]'>One-time total</span>
                      <span className='font-semibold text-[var(--text-primary)]'>{formatCents(cart.oneTimeTotal)}</span>
                    </div>
                  )}
                  {cart.recurringTotal > 0 && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-[var(--text-secondary)]'>Monthly recurring</span>
                      <span className='font-semibold text-[var(--text-primary)]'>{formatCents(cart.recurringTotal)}/mo</span>
                    </div>
                  )}
                </div>

                {/* What happens next */}
                <div className='rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2'>
                  <p className='text-xs font-semibold text-violet-400 uppercase tracking-wider'>What happens next</p>
                  <ol className='space-y-1.5 text-xs text-[var(--text-secondary)]'>
                    <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>1.</span>Submit your details below</li>
                    <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>2.</span>Review and e-sign the service agreement</li>
                    <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>3.</span>Complete payment via Stripe — first 40% deposit</li>
                    <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>4.</span>We kick off your project within 1–2 business days</li>
                  </ol>
                </div>
              </div>

              {/* Customer Info Form */}
              <div>
                <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Your details</h2>
                <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Full name *</label>
                    <input name='name' required className={inputClass} placeholder='John Doe' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Email *</label>
                    <input name='email' type='email' required className={inputClass} placeholder='john@business.com' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Business name *</label>
                    <input name='business' required className={inputClass} placeholder='Acme Plumbing Co.' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Phone</label>
                    <input name='phone' type='tel' className={inputClass} placeholder='(555) 123-4567' />
                  </div>

                  {error && (
                    <div className='rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                      {error}
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={submitting}
                    className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
                  >
                    {submitting ? (
                      <>
                        <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                        Preparing your agreement…
                      </>
                    ) : (
                      <>
                        Continue to agreement
                        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className='text-center text-xs text-[var(--text-faint)]'>
                    By continuing, you agree to review and sign our service agreement.
                    Payment is processed securely by Stripe.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </Container>
      </main>
      <CartDrawer />
    </div>
  )
}
