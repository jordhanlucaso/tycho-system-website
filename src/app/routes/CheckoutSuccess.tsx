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

  useEffect(() => {
    document.title = 'Payment Successful — Tycho Systems'
    sessionStorage.removeItem('contract_id')
    sessionStorage.removeItem('contract_text')
    sessionStorage.removeItem('checkout_email')
    cart.clear()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

            <h1 className='mt-6 text-gradient text-3xl font-semibold tracking-tight'>Deposit confirmed!</h1>
            <p className='mt-3 text-sm text-[var(--text-secondary)]'>
              Thank you! Your deposit is confirmed and your service agreement is signed. We'll reach out within 1–2 business days to kick off your project.
            </p>

            {sessionId && (
              <p className='mt-2 text-xs text-[var(--text-faint)]'>
                Ref: {sessionId.slice(0, 24)}…
              </p>
            )}

            <div className='mt-8 flex flex-col gap-3'>
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
                <li className='flex gap-2'><span className='shrink-0 font-semibold text-violet-400'>4.</span>Remaining balance invoiced at project milestones</li>
              </ol>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
