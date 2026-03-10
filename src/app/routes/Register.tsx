import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth, OAUTH_PROVIDERS } from '../lib/auth'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import type { Provider } from '@supabase/supabase-js'

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

import type { ReactElement } from 'react'

const providerIcons: Record<string, ReactElement> = {
  google: (
    <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
      <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
      <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/>
      <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
    </svg>
  ),
  facebook: (
    <svg className='h-4 w-4' viewBox='0 0 24 24' fill='#1877F2'>
      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
    </svg>
  ),
}

export function Register() {
  const { signUp, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<Provider | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm  = form.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }

    const { error } = await signUp(form.get('email') as string, password)
    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      navigate('/login', { replace: true, state: { registered: true } })
    }
  }

  async function handleOAuth(provider: Provider) {
    setOauthLoading(provider)
    const { error } = await signInWithOAuth(provider)
    if (error) {
      setError(error.message)
      setOauthLoading(null)
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
            <h1 className='text-gradient text-3xl font-semibold tracking-tight'>Create account</h1>
            <p className='mt-2 text-sm text-[var(--text-secondary)]'>Get access to your client portal.</p>

            {error && (
              <div className='mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                {error}
              </div>
            )}

            {/* Social sign-up */}
            {OAUTH_PROVIDERS.length > 0 && (
              <div className='mt-6 space-y-3'>
                {OAUTH_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleOAuth(p.id)}
                    disabled={oauthLoading !== null}
                    className='flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-50'
                  >
                    {oauthLoading === p.id ? (
                      <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                      </svg>
                    ) : (
                      providerIcons[p.icon]
                    )}
                    {p.label}
                  </button>
                ))}
                <div className='relative flex items-center gap-3 py-2'>
                  <div className='h-px flex-1 bg-[var(--border-primary)]' />
                  <span className='text-xs text-[var(--text-faint)]'>or</span>
                  <div className='h-px flex-1 bg-[var(--border-primary)]' />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={OAUTH_PROVIDERS.length ? 'space-y-4' : 'mt-6 space-y-4'}>
              <div>
                <label className='block text-sm font-medium text-[var(--text-body)]'>Email</label>
                <input name='email' type='email' required className={inputClass} placeholder='you@example.com' />
              </div>
              <div>
                <label className='block text-sm font-medium text-[var(--text-body)]'>Password</label>
                <input name='password' type='password' required minLength={6} className={inputClass} placeholder='••••••••' />
              </div>
              <div>
                <label className='block text-sm font-medium text-[var(--text-body)]'>Confirm password</label>
                <input name='confirm' type='password' required minLength={6} className={inputClass} placeholder='••••••••' />
              </div>
              <button
                type='submit'
                disabled={submitting || oauthLoading !== null}
                className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-[var(--text-muted)]'>
              Already have an account?{' '}
              <Link to='/login' className='text-violet-400 hover:text-violet-300 transition-colors'>
                Sign in
              </Link>
            </p>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
