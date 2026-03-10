import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { User, Session, Provider } from '@supabase/supabase-js'

// Enabled social providers — add/remove here to control what shows on login/register
export const OAUTH_PROVIDERS: { id: Provider; label: string; icon: string }[] = [
  { id: 'google', label: 'Continue with Google', icon: 'google' }
  // { id: 'apple',    label: 'Continue with Apple',    icon: 'apple'    },
  // { id: 'facebook', label: 'Continue with Facebook', icon: 'facebook' },
  // { id: 'linkedin_oidc', label: 'Continue with LinkedIn', icon: 'linkedin' },
]

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error as Error | null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  async function signInWithOAuth(provider: Provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error: error as Error | null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return <AuthContext value={{ user, session, loading, signUp, signIn, signInWithOAuth, signOut }}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
