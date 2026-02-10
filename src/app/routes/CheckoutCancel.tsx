import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

export function CheckoutCancel() {
  useEffect(() => {
    document.title = 'Payment Cancelled — Tycho Systems'
  }, [])

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
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10'>
              <svg className='h-8 w-8 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </div>

            <h1 className='mt-6 text-gradient text-3xl font-semibold tracking-tight'>Payment cancelled</h1>
            <p className='mt-3 text-sm text-[var(--text-secondary)]'>
              Your payment was not processed. Your cart items are still saved if you&apos;d like to try again.
            </p>

            <div className='mt-8 flex items-center justify-center gap-4'>
              <Link
                to='/checkout'
                className='inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
              >
                Return to checkout
              </Link>
              <Link
                to='/'
                className='text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
