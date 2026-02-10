import type { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase.js'

// Extend Request to carry user data
declare module 'express' {
  interface Request {
    user?: { id: string; email?: string }
  }
}

// Verify Supabase JWT and attach user to request
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' })
    return
  }

  const token = authHeader.slice(7)

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return
  }

  req.user = { id: data.user.id, email: data.user.email }
  next()
}

// Require admin role
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (!req.user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()

    if (profile?.role !== 'admin') {
      res.status(403).json({ error: 'Admin access required' })
      return
    }

    next()
  })
}
