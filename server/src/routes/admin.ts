import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../lib/auth-middleware.js'

export const adminRouter = Router()

// All admin routes require admin role
adminRouter.use(requireAuth('admin'))

// GET /api/admin/stats
adminRouter.get('/stats', async (_req, res) => {
  try {
    const [
      { count: clients },
      { count: activeSites },
      { data: paidInvoices },
      { count: pendingInvoices },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('sites').select('*', { count: 'exact', head: true }).eq('status', 'live'),
      supabase.from('invoices').select('amount_cents').eq('status', 'paid'),
      supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    const revenue = (paidInvoices ?? []).reduce((sum, i) => sum + i.amount_cents, 0)

    res.json({
      clients: clients ?? 0,
      activeSites: activeSites ?? 0,
      revenue,
      pendingInvoices: pendingInvoices ?? 0,
    })
  } catch {
    res.json({ clients: 0, activeSites: 0, revenue: 0, pendingInvoices: 0 })
  }
})

// GET /api/admin/clients
adminRouter.get('/clients', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, business_name, phone, role, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ clients: data ?? [] })
  } catch {
    res.json({ clients: [] })
  }
})

// GET /api/admin/invoices
adminRouter.get('/invoices', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, client_id, amount_cents, currency, status, description, stripe_invoice_id, stripe_session_id, paid_at, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    res.json({ invoices: data ?? [] })
  } catch {
    res.json({ invoices: [] })
  }
})

// GET /api/admin/sites
adminRouter.get('/sites', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('id, name, domain, url, status, plan, notes, created_at, client_id')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ sites: data ?? [] })
  } catch {
    res.json({ sites: [] })
  }
})

// PATCH /api/admin/users/:id/role
adminRouter.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body as { role?: string }
  const { id } = req.params

  if (!role || !['admin', 'client', 'sales'].includes(role)) {
    res.status(400).json({ error: 'role must be admin, client, or sales' })
    return
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)

  if (error) {
    res.status(500).json({ error: 'Failed to update role' })
    return
  }

  res.json({ ok: true })
})

// GET /api/admin/contracts
adminRouter.get('/contracts', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    res.json({ contracts: data ?? [] })
  } catch {
    res.json({ contracts: [] })
  }
})
