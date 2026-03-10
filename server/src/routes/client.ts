import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../lib/auth-middleware.js'

export const clientRouter = Router()

// All client routes require authentication
clientRouter.use(requireAuth())

// GET /api/client/overview
clientRouter.get('/overview', async (req, res) => {
  const userId = req.user!.id
  try {
    const [{ data: sites }, { data: invoices }, { data: subscriptions }] = await Promise.all([
      supabase.from('sites').select('id, name, domain, status, plan').eq('client_id', userId),
      supabase.from('invoices').select('id, amount_cents, status, created_at').eq('client_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('subscriptions').select('id, plan, amount_cents, status, current_period_end').eq('client_id', userId).eq('status', 'active'),
    ])

    const upcomingPayments = (subscriptions ?? [])
      .filter((s) => s.current_period_end)
      .map((s) => ({ id: s.id, amount_cents: s.amount_cents, due_date: s.current_period_end }))

    res.json({ sites: sites ?? [], invoices: invoices ?? [], upcomingPayments })
  } catch {
    res.json({ sites: [], invoices: [], upcomingPayments: [] })
  }
})

// GET /api/client/sites
clientRouter.get('/sites', async (req, res) => {
  const userId = req.user!.id
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ sites: data ?? [] })
  } catch {
    res.json({ sites: [] })
  }
})

// GET /api/client/invoices
clientRouter.get('/invoices', async (req, res) => {
  const userId = req.user!.id
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, amount_cents, currency, status, description, stripe_invoice_id, paid_at, created_at')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ invoices: data ?? [] })
  } catch {
    res.json({ invoices: [] })
  }
})

// GET /api/client/settings
clientRouter.get('/settings', async (req, res) => {
  const userId = req.user!.id
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, business_name, phone, role, created_at')
      .eq('id', userId)
      .single()

    if (error) throw error
    res.json({ profile: data })
  } catch {
    res.json({ profile: null })
  }
})

// PUT /api/client/settings
clientRouter.put('/settings', async (req, res) => {
  const userId = req.user!.id
  const { full_name, business_name, phone } = req.body
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, business_name, phone })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    res.json({ profile: data })
  } catch {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// GET /api/client/contracts
clientRouter.get('/contracts', async (req, res) => {
  const email = req.user!.email
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, pandadoc_document_id, pandadoc_status, one_time_total_cents, recurring_total_cents, stripe_payment_status, created_at')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ contracts: data ?? [] })
  } catch {
    res.json({ contracts: [] })
  }
})
