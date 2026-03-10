import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../lib/cart'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

export function CheckoutSuccess() {
  const cart = useCart()
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  // type: 'payment' (one-time) or 'subscription' (recurring)
  const type = params.get('type') as 'payment' | 'subscription' | null

  const hasRemainingRecurring = cart.items.some((i) => i.recurring)
  const hasRemainingOneTime = cart.items.some((i) => !i.recurring)

  useEffect(() => {
    document.title = 'Payment Successful — Tycho Systems'
    sessionStorage.removeItem('contract_id')
    sessionStorage.removeItem('contract_text')
    sessionStorage.removeItem('checkout_email')

    // Selectively clear only the items that were just paid for
    if (type === 'payment') {
      cart.items.filter((i) => !i.recurring).forEach((i) => cart.removeItem(i.id))
    } else if (type === 'subscription') {
      cart.items.filter((i) => i.recurring).forEach((i) => cart.removeItem(i.id))
    } else {
      cart.clear()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const documentId = params.get('id')
  const showSubscriptionPrompt = type === 'payment' && hasRemainingRecurring
  const showProjectsPrompt = type === 'subscription' && hasRemainingOneTime

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='flex items-center justify-center py-24'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-md text-center'
          >
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10'>
              <svg className='h-8 w-8 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>

            <h1 className='mt-6 text-gradient text-3xl font-semibold tracking-tight'>Payment confirmed!</h1>
            <p className='mt-3 text-sm text-[var(--text-secondary)]'>
              {showSubscriptionPrompt
                ? "Your project deposit is confirmed. Don't forget to set up your monthly plan too."
                : showProjectsPrompt
                  ? "Your subscription is active. Complete your project payment when you're ready."
                  : "Thank you for your purchase. We'll reach out within 1–2 business days to kick off your project."}
            </p>

            {sessionId && (
              <p className='mt-2 text-xs text-[var(--text-faint)]'>
                Ref: {sessionId.slice(0, 24)}…
              </p>
            )}

            <div className='mt-8 flex flex-col gap-3'>
              {/* Prompt to complete the other payment type if mixed cart */}
              {showSubscriptionPrompt && documentId && (
                <Link
                  to={`/checkout/sign?id=${documentId}`}
                  className='inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
                >
                  Set up monthly subscription →
                </Link>
              )}
              {showProjectsPrompt && documentId && (
                <Link
                  to={`/checkout/sign?id=${documentId}`}
                  className='inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
                >
                  Pay for projects →
                </Link>
              )}

              <Link
                to='/'
                className='inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-primary)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              >
                Back to home
              </Link>
            </div>

            <div className='mt-8 rounded-xl border border-[var(--border-subtle)] p-4 text-left space-y-2'>
              <p className='text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider'>What happens next</p>
              <ol className='space-y-1.5 text-xs text-[var(--text-secondary)]'>
                <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>1.</span>You'll receive a payment receipt from Stripe</li>
                <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>2.</span>A confirmation email with your signed agreement details</li>
                <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>3.</span>We'll email you within 1–2 business days with next steps</li>
              </ol>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
