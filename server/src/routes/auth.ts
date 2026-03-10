import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../lib/auth-middleware.js'

export const authRouter = Router()

// GET /api/auth/me — returns current user's profile
authRouter.get('/me', requireAuth(), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, business_name, phone, role, created_at')
      .eq('id', req.user!.id)
      .single()

    if (error) throw error
    res.json({ user: data })
  } catch {
    res.status(500).json({ error: 'Failed to load profile' })
  }
})
