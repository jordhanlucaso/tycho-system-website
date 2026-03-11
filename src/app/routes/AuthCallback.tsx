import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Subscribe first to avoid missing the SIGNED_IN event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/client-portal', { replace: true })
      } else if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true })
      }
    })

    // Also check immediately — session may already exist if the exchange
    // completed before this component mounted
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/client-portal', { replace: true })
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className='flex min-h-screen items-center justify-center bg-[var(--bg-primary)]'>
      <div className='text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent' />
        <p className='mt-4 text-sm text-[var(--text-muted)]'>Signing you in…</p>
      </div>
    </div>
  )
}
