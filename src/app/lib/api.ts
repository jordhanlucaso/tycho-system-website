import { supabase } from './supabase'

// In production, set VITE_API_URL to your backend URL (e.g. https://api.tychosystem.com).
// In development, leave it unset — Vite's proxy forwards /api to localhost:3001.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

/**
 * Authenticated fetch wrapper for all /api/* calls.
 * Automatically attaches the current Supabase session token as Bearer.
 * Drop-in replacement for fetch() — returns a standard Response.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) ?? {}),
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  return fetch(`${API_BASE}${path}`, { ...init, headers })
}
