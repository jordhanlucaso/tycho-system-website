import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../../lib/cart'
import { useNavigate } from 'react-router-dom'

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

export function CartDrawer() {
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cart.setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className='fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--border-primary)] bg-[var(--bg-primary)]'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-4'>
              <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Your cart ({cart.itemCount})</h2>
              <button
                onClick={() => cart.setOpen(false)}
                className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
                aria-label='Close cart'
              >
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              {cart.items.length === 0 ? (
                <div className='flex h-full items-center justify-center'>
                  <p className='text-sm text-[var(--text-muted)]'>Your cart is empty</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  <AnimatePresence mode='popLayout'>
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className='glass rounded-xl p-4'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <div className='font-semibold text-[var(--text-primary)]'>{item.name}</div>
                            <div className='mt-1 text-sm text-[var(--text-secondary)]'>
                              <span className='text-gradient font-semibold'>{item.price}</span>
                              <span className='text-[var(--text-muted)]'> /{item.note}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => cart.removeItem(item.id)}
                            className='inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-red-400'
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                              <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with totals */}
            {cart.items.length > 0 && (
              <div className='border-t border-[var(--border-primary)] px-6 py-4 space-y-3'>
                {cart.oneTimeTotal > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-[var(--text-secondary)]'>One-time</span>
                    <span className='font-semibold text-[var(--text-primary)]'>{formatCents(cart.oneTimeTotal)}</span>
                  </div>
                )}
                {cart.recurringTotal > 0 && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-[var(--text-secondary)]'>Monthly recurring</span>
                    <span className='font-semibold text-[var(--text-primary)]'>{formatCents(cart.recurringTotal)}/mo</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    cart.setOpen(false)
                    navigate('/checkout')
                  }}
                  className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
                >
                  Proceed to checkout
                </button>

                <button
                  onClick={() => cart.clear()}
                  className='w-full rounded-xl border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
