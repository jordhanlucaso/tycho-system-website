import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase exchanges the URL hash/code for a session automatically.
    // onAuthStateChange fires once it's done — redirect to client portal.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/client-portal', { replace: true })
      } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        navigate('/login', { replace: true })
      }
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
