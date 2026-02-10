import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../lib/auth'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='flex items-center justify-center py-24'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-sm'
          >
            <h1 className='text-gradient text-3xl font-semibold tracking-tight'>Sign in</h1>
            <p className='mt-2 text-sm text-[var(--text-secondary)]'>Welcome back. Sign in to your account.</p>

            {error && (
              <div className='mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-[var(--text-body)]'>Email</label>
                <input name='email' type='email' required className={inputClass} placeholder='you@example.com' />
              </div>

              <div>
                <label className='block text-sm font-medium text-[var(--text-body)]'>Password</label>
                <input name='password' type='password' required minLength={6} className={inputClass} placeholder='••••••••' />
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-[var(--text-muted)]'>
              Don&apos;t have an account?{' '}
              <Link to='/register' className='text-violet-400 hover:text-violet-300 transition-colors'>
                Create one
              </Link>
            </p>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
