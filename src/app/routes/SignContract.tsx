import { useState, useEffect, type ChangeEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../lib/cart'
import { apiFetch } from '../lib/api'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { CartDrawer } from '../components/layout/CartDrawer'

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US')}`
}

type Step = 'reviewing' | 'signed'

export function SignContract() {
  const [params] = useSearchParams()
  const cart = useCart()
  const wasCancelled = params.get('cancelled') === 'true'

  const contractId   = sessionStorage.getItem('contract_id') ?? ''
  const contractText = sessionStorage.getItem('contract_text') ?? ''

  const [step, setStep]           = useState<Step>('reviewing')
  const [agreed, setAgreed]       = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signing, setSigning]     = useState(false)
  const [signError, setSignError] = useState('')
  const [payError, setPayError]   = useState('')
  const [paying, setPaying]       = useState(false)

  useEffect(() => {
    document.title = 'Sign Agreement — Tycho Systems'
  }, [])

  async function handleSign() {
    if (!agreed || !signerName.trim()) return
    setSigning(true)
    setSignError('')
    try {
      const res = await apiFetch(`/api/contracts/${contractId}/sign`, {
        method: 'POST',
        body: JSON.stringify({ signerName: signerName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record signature')
      setStep('signed')
    } catch (err) {
      setSignError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSigning(false)
    }
  }

  async function handlePay() {
    setPaying(true)
    setPayError('')
    try {
      const res = await apiFetch(`/api/contracts/${contractId}/payment`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment session failed')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  if (!contractId || !contractText) {
    return (
      <div className='min-h-screen font-sans'>
        <Navbar />
        <main className='flex items-center justify-center py-24'>
          <Container>
            <div className='mx-auto max-w-md text-center space-y-4'>
              <p className='text-[var(--text-secondary)]'>No agreement found. Please start from checkout.</p>
              <Link to='/checkout' className='inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white'>Back to checkout</Link>
            </div>
          </Container>
        </main>
      </div>
    )
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
            className='mx-auto max-w-2xl'
          >
            {/* Progress */}
            <div className='flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8'>
              <span className='flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/30 text-violet-400 text-xs font-medium'>✓</span>
              <span className='text-[var(--text-muted)]'>Your details</span>
              <span className='text-[var(--text-faint)]'>→</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${step === 'signed' ? 'bg-violet-500/30 text-violet-400' : 'bg-violet-500 text-white'}`}>
                {step === 'signed' ? '✓' : '2'}
              </span>
              <span className={step === 'signed' ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)] font-medium'}>Sign agreement</span>
              <span className='text-[var(--text-faint)]'>→</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-medium ${step === 'signed' ? 'border-violet-500 text-violet-400' : 'border-[var(--border-primary)] text-[var(--text-muted)]'}`}>3</span>
              <span className={step === 'signed' ? 'text-[var(--text-primary)] font-medium' : ''}>Payment</span>
            </div>

            {wasCancelled && step === 'signed' && (
              <div className='mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400'>
                Payment was cancelled. Complete payment below to confirm your project.
              </div>
            )}

            <AnimatePresence mode='wait'>
              {/* ── Step 1: Review & Sign ── */}
              {step === 'reviewing' && (
                <motion.div
                  key='reviewing'
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-6'
                >
                  <div>
                    <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Review your agreement</h1>
                    <p className='mt-2 text-sm text-[var(--text-secondary)]'>
                      Read the full service agreement below, then type your name to sign electronically.
                    </p>
                  </div>

                  {/* Contract text */}
                  <div className='glass rounded-xl overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]'>
                      <span className='text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider'>Service Agreement</span>
                      <span className='text-xs text-[var(--text-faint)]'>Scroll to read all terms</span>
                    </div>
                    <pre className='max-h-[55vh] overflow-y-auto p-5 text-xs leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap font-mono'>
                      {contractText}
                    </pre>
                  </div>

                  {/* Checkbox */}
                  <label className='flex items-start gap-3 cursor-pointer group'>
                    <input
                      type='checkbox'
                      checked={agreed}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
                      className='mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border-primary)] accent-violet-500'
                    />
                    <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>
                      I have read and agree to the terms of this service agreement
                    </span>
                  </label>

                  {/* Signature input */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>
                      Type your full name to sign
                    </label>
                    <input
                      type='text'
                      value={signerName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSignerName(e.target.value)}
                      placeholder='Your full legal name'
                      className='w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'
                    />
                    {signerName.trim() && (
                      <p className='text-base italic text-[var(--text-secondary)]' style={{ fontFamily: 'Georgia, serif' }}>
                        {signerName}
                      </p>
                    )}
                  </div>

                  {signError && (
                    <div className='rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                      {signError}
                    </div>
                  )}

                  <button
                    onClick={handleSign}
                    disabled={!agreed || !signerName.trim() || signing}
                    className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2'
                  >
                    {signing ? (
                      <>
                        <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                        Signing…
                      </>
                    ) : (
                      'Sign agreement'
                    )}
                  </button>

                  <p className='text-center text-xs text-[var(--text-faint)]'>
                    Your typed name constitutes a legally binding e-signature under the US ESIGN Act (15 U.S.C. § 7001).
                  </p>
                </motion.div>
              )}

              {/* ── Step 2: Signed → Payment ── */}
              {step === 'signed' && (
                <motion.div
                  key='signed'
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='space-y-6'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10'>
                      <svg className='h-5 w-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
                    </div>
                    <div>
                      <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Agreement signed!</h1>
                      <p className='text-sm text-[var(--text-secondary)]'>Complete payment to confirm your project.</p>
                    </div>
                  </div>

                  {/* Order recap */}
                  {cart.items.length > 0 && (
                    <div className='glass rounded-xl p-5 space-y-3'>
                      <h2 className='text-sm font-semibold text-[var(--text-primary)]'>Payment summary</h2>
                      {cart.items.map((item) => {
                        const deposit = item.depositPriceInCents ?? item.priceInCents
                        return (
                          <div key={item.id} className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span className='text-[var(--text-secondary)]'>{item.name}</span>
                              <span className='font-semibold text-[var(--text-primary)]'>{item.price}</span>
                            </div>
                            <div className='flex justify-between text-xs text-[var(--text-faint)]'>
                              <span>Deposit due today</span>
                              <span className='text-gradient font-semibold'>{formatCents(deposit)}</span>
                            </div>
                          </div>
                        )
                      })}
                      <div className='border-t border-[var(--border-subtle)] pt-2 flex justify-between text-sm'>
                        <span className='text-[var(--text-secondary)]'>Total due today</span>
                        <span className='text-gradient font-semibold'>{formatCents(cart.depositTotal)}</span>
                      </div>
                    </div>
                  )}

                  {payError && (
                    <div className='rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                      {payError}
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
                  >
                    {paying ? (
                      <>
                        <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>Pay deposit — {formatCents(cart.depositTotal)}</>
                    )}
                  </button>

                  <p className='text-center text-xs text-[var(--text-faint)]'>
                    Deposit only. Remaining balance invoiced at project milestones.
                    Secure checkout powered by Stripe.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Container>
      </main>
      <CartDrawer />
    </div>
  )
}
