import type { Request, Response, NextFunction } from 'express'
import { supabase } from './supabase.js'

/** Reads the Bearer token from Authorization header and attaches req.user if valid. */
export async function extractUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (!error && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        req.user = { id: user.id, email: user.email!, role: profile?.role ?? 'client' }
      }
    } catch { /* ignore — user stays undefined */ }
  }
  next()
}

/** Requires a valid session. Returns 401 if unauthenticated. */
export function requireAuth(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await extractUser(req, res, () => {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      next()
    })
  }
}
