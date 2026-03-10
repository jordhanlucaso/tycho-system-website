import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { quizQuestions, getRecommendation, type QuizAnswers } from '../../config/quiz'
import { useCart } from '../lib/cart'
import { Navbar } from '../components/layout/Navbar'
import { Container } from '../components/layout/Container'

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export function Quiz() {
  const cart = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0..n-1 = questions, n = result
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [pending, setPending] = useState<string | null>(null)

  const totalQuestions = quizQuestions.length
  const isResult = step === totalQuestions
  const currentQ = quizQuestions[step]
  const recommendation = isResult ? getRecommendation(answers) : null

  useEffect(() => {
    document.title = 'Find Your Perfect Plan — Tycho Systems'
  }, [])

  function handleAnswer(value: string) {
    setPending(value)
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: value }))
      setDirection(1)
      setStep((s) => s + 1)
      setPending(null)
    }, 280)
  }

  function handleBack() {
    setDirection(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  function handleRestart() {
    setDirection(-1)
    setAnswers({})
    setStep(0)
  }

  function addToCart(item: typeof recommendation extends null ? never : NonNullable<typeof recommendation>['package']) {
    cart.addItem(item)
  }

  const pkgInCart = recommendation ? cart.items.some((i) => i.id === recommendation.package.id) : false
  const planInCart = recommendation?.plan ? cart.items.some((i) => i.id === recommendation.plan!.id) : false

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='py-16'>
        <Container>

          {/* Progress bar */}
          <div className='mb-10 max-w-lg mx-auto'>
            <div className='flex items-center justify-between mb-2 text-xs text-[var(--text-muted)]'>
              <span>{isResult ? 'Your recommendation' : `Question ${step + 1} of ${totalQuestions}`}</span>
              {!isResult && (
                <span>{Math.round(((step) / totalQuestions) * 100)}% complete</span>
              )}
            </div>
            <div className='h-1.5 w-full rounded-full bg-[var(--bg-surface)]'>
              <motion.div
                className='h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500'
                animate={{ width: `${isResult ? 100 : (step / totalQuestions) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className='max-w-2xl mx-auto overflow-hidden'>
            <AnimatePresence mode='popLayout' custom={direction}>
              {!isResult ? (
                <motion.div
                  key={`q-${step}`}
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                >
                  {/* Question */}
                  <div className='text-center mb-8'>
                    <h1 className='text-2xl font-semibold text-[var(--text-primary)] leading-snug'>
                      {currentQ.question}
                    </h1>
                    {currentQ.hint && (
                      <p className='mt-2 text-sm text-[var(--text-muted)]'>{currentQ.hint}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        disabled={pending !== null}
                        className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                          pending === opt.value
                            ? 'border-violet-500 bg-violet-500/10 scale-[0.98]'
                            : 'border-[var(--border-primary)] bg-[var(--bg-surface)] hover:border-violet-500/50 hover:bg-violet-500/5'
                        }`}
                      >
                        <span className='text-2xl shrink-0'>{opt.emoji}</span>
                        <span className='text-sm font-medium text-[var(--text-body)]'>{opt.label}</span>
                        {pending === opt.value && (
                          <motion.div
                            className='absolute inset-0 rounded-2xl border-2 border-violet-500'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Back button */}
                  {step > 0 && (
                    <div className='mt-6 text-center'>
                      <button
                        onClick={handleBack}
                        className='text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors'
                      >
                        ← Back
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key='result'
                  custom={direction}
                  variants={slideVariants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                >
                  {/* Result header */}
                  <div className='text-center mb-8'>
                    <div className='inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-xs font-medium text-violet-400 mb-4'>
                      ✦ Personalized recommendation
                    </div>
                    <h1 className='text-2xl font-semibold text-[var(--text-primary)]'>
                      Here's what we recommend for you
                    </h1>
                    <p className='mt-2 text-sm text-[var(--text-muted)]'>
                      Based on your answers, this combination is the best fit.
                    </p>
                  </div>

                  <div className='space-y-4'>
                    {/* Recommended package */}
                    {recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='glass glow-border rounded-2xl p-6'
                      >
                        <div className='flex items-start justify-between gap-4 flex-wrap'>
                          <div>
                            <div className='text-xs font-medium uppercase tracking-wider text-violet-400 mb-1'>
                              Recommended package
                            </div>
                            <h2 className='text-xl font-semibold text-[var(--text-primary)]'>
                              {recommendation.package.name}
                            </h2>
                            <p className='mt-1 text-sm text-[var(--text-secondary)] max-w-sm'>
                              {recommendation.package.description}
                            </p>
                            <p className='mt-2 text-xs text-[var(--text-muted)] italic'>
                              This plan {recommendation.reason}.
                            </p>
                          </div>
                          <div className='text-right shrink-0'>
                            <div className='text-gradient text-2xl font-bold'>
                              {recommendation.package.price}
                            </div>
                            <div className='text-xs text-[var(--text-muted)]'>one-time</div>
                            {recommendation.package.note && (
                              <div className='text-xs text-[var(--text-faint)] mt-0.5'>
                                {recommendation.package.note}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Features */}
                        <ul className='mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
                          {recommendation.package.features.map((f) => (
                            <li key={f} className='flex items-start gap-2 text-sm text-[var(--text-secondary)]'>
                              <svg className='mt-0.5 h-4 w-4 shrink-0 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>

                        <div className='mt-5 flex flex-wrap gap-3'>
                          {pkgInCart ? (
                            <button
                              onClick={() => navigate('/checkout')}
                              className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white'
                            >
                              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                              </svg>
                              Go to checkout
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(recommendation.package)}
                              className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity'
                            >
                              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                              </svg>
                              Add to cart
                            </button>
                          )}
                          {recommendation.package.delivery && (
                            <div className='flex items-center gap-1.5 text-xs text-[var(--text-muted)]'>
                              <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                              </svg>
                              {recommendation.package.delivery}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Recommended plan */}
                    {recommendation?.plan && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='glass rounded-2xl p-6'
                      >
                        <div className='flex items-start justify-between gap-4 flex-wrap'>
                          <div>
                            <div className='text-xs font-medium uppercase tracking-wider text-cyan-400 mb-1'>
                              Recommended monthly plan
                            </div>
                            <h2 className='text-lg font-semibold text-[var(--text-primary)]'>
                              {recommendation.plan.name}
                            </h2>
                            <p className='mt-1 text-sm text-[var(--text-secondary)] max-w-sm'>
                              {recommendation.plan.description}
                            </p>
                            {recommendation.planReason && (
                              <p className='mt-2 text-xs text-[var(--text-muted)] italic'>
                                This plan {recommendation.planReason}.
                              </p>
                            )}
                          </div>
                          <div className='text-right shrink-0'>
                            <div className='text-gradient text-xl font-bold'>
                              {recommendation.plan.price}
                            </div>
                            <div className='text-xs text-[var(--text-muted)]'>/month</div>
                          </div>
                        </div>

                        <ul className='mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2'>
                          {recommendation.plan.features.slice(0, 4).map((f) => (
                            <li key={f} className='flex items-start gap-2 text-sm text-[var(--text-secondary)]'>
                              <svg className='mt-0.5 h-4 w-4 shrink-0 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>

                        <div className='mt-5'>
                          {planInCart ? (
                            <button
                              onClick={() => navigate('/checkout')}
                              className='flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400'
                            >
                              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                              </svg>
                              Added — go to checkout
                            </button>
                          ) : (
                            <button
                              onClick={() => cart.addItem(recommendation.plan!)}
                              className='flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-5 py-2.5 text-sm font-medium text-cyan-400 hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-colors'
                            >
                              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                              </svg>
                              Add plan to cart
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]'>
                    <button onClick={handleRestart} className='hover:text-[var(--text-secondary)] transition-colors'>
                      ← Retake quiz
                    </button>
                    <div className='flex items-center gap-4'>
                      <Link to='/#pricing' className='hover:text-[var(--text-secondary)] transition-colors'>
                        See all plans
                      </Link>
                      {(pkgInCart || planInCart) && (
                        <Link
                          to='/checkout'
                          className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity'
                        >
                          Proceed to checkout →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </main>
    </div>
  )
}
