import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../lib/cart'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { CartDrawer } from '../components/layout/CartDrawer'

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
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

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.itemCount === 0) navigate('/', { replace: true })
  }, [cart.itemCount, navigate])

  if (cart.itemCount === 0) return null

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const customerName = form.get('name') as string
    const customerEmail = form.get('email') as string

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            name: i.name,
            priceInCents: i.priceInCents,
            recurring: i.recurring
          })),
          customerEmail,
          customerName
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
            <h1 className='text-gradient text-3xl font-semibold tracking-tight'>Checkout</h1>
            <p className='mt-2 text-sm text-[var(--text-secondary)]'>Review your order and enter your details.</p>

            <div className='mt-8 grid gap-8 lg:grid-cols-2'>
              {/* Order Summary */}
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Order summary</h2>
                <div className='space-y-3'>
                  {cart.items.map((item) => (
                    <div key={item.id} className='glass flex items-center justify-between rounded-xl p-4'>
                      <div>
                        <div className='font-semibold text-[var(--text-primary)]'>{item.name}</div>
                        <div className='text-xs text-[var(--text-muted)]'>{item.recurring ? 'Monthly subscription' : 'One-time payment'}</div>
                      </div>
                      <div className='text-right'>
                        <div className='text-gradient font-semibold'>{item.price}</div>
                        <div className='text-xs text-[var(--text-muted)]'>/{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

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
                  <div className='border-t border-[var(--border-primary)] pt-2 flex justify-between'>
                    <span className='font-semibold text-[var(--text-primary)]'>Due today</span>
                    <span className='text-gradient text-lg font-semibold'>{formatCents(cart.oneTimeTotal + cart.recurringTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info Form */}
              <div>
                <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Your details</h2>
                <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Full name</label>
                    <input name='name' required className={inputClass} placeholder='John Doe' />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Email</label>
                    <input name='email' type='email' required className={inputClass} placeholder='john@business.com' />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Business name</label>
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
                    className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
                  >
                    {submitting ? 'Processing...' : 'Pay with Stripe'}
                  </button>

                  <p className='text-center text-xs text-[var(--text-faint)]'>Secure payment powered by Stripe. You will be redirected to complete payment.</p>
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
