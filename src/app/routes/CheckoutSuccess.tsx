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

            <h1 className='mt-6 text-gradient text-3xl font-semibold tracking-tight'>Payment successful!</h1>
            <p className='mt-3 text-sm text-[var(--text-secondary)]'>
              Thank you for your purchase. We&apos;ll be in touch shortly to get started on your project.
            </p>

            {sessionId && (
              <p className='mt-2 text-xs text-[var(--text-faint)]'>
                Session: {sessionId.slice(0, 20)}...
              </p>
            )}

            <Link
              to='/'
              className='mt-8 inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
            >
              Back to home
            </Link>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
