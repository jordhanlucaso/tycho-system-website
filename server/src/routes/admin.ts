import { Router } from 'express'

export const adminRouter = Router()

// TODO: Add auth middleware to verify admin role

adminRouter.get('/stats', (_req, res) => {
  // TODO: Return dashboard stats from Supabase
  res.json({
    clients: 0,
    activeSites: 0,
    revenue: 0,
    pendingInvoices: 0
  })
})

adminRouter.get('/clients', (_req, res) => {
  // TODO: List all clients from Supabase
  res.json({ clients: [] })
})

adminRouter.get('/invoices', (_req, res) => {
  // TODO: List all invoices from Supabase
  res.json({ invoices: [] })
})

adminRouter.get('/sites', (_req, res) => {
  // TODO: List all managed sites from Supabase
  res.json({ sites: [] })
})
