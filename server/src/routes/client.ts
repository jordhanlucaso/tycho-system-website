import { Router } from 'express'

export const clientRouter = Router()

// TODO: Add auth middleware to verify client role

clientRouter.get('/overview', (_req, res) => {
  // TODO: Return client dashboard data from Supabase
  res.json({
    sites: [],
    invoices: [],
    upcomingPayments: []
  })
})

clientRouter.get('/invoices', (_req, res) => {
  // TODO: Return client's invoices from Supabase
  res.json({ invoices: [] })
})

clientRouter.get('/sites', (_req, res) => {
  // TODO: Return client's sites from Supabase
  res.json({ sites: [] })
})

clientRouter.get('/settings', (_req, res) => {
  // TODO: Return client profile/settings from Supabase
  res.json({ profile: null })
})
