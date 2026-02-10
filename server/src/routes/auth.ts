import { Router } from 'express'

export const authRouter = Router()

// Auth endpoints will be implemented with Supabase Auth
// For now, placeholder routes

authRouter.get('/me', (_req, res) => {
  // TODO: Verify JWT from Authorization header, return user profile
  res.status(401).json({ error: 'Not authenticated' })
})
