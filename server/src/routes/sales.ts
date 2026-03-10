import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../lib/auth-middleware.js'

export const salesRouter = Router()

// All sales routes require admin or sales role
salesRouter.use(requireAuth('admin', 'sales'))

// GET /api/sales/stats
salesRouter.get('/stats', async (_req, res) => {
  try {
    const { data: leads } = await supabase.from('leads').select('status, estimated_value')

    const totalLeads = leads?.length ?? 0
    const closedDeals = leads?.filter((l) => l.status === 'closed').length ?? 0
    const pipelineValue = leads
      ?.filter((l) => l.status !== 'lost')
      .reduce((sum, l) => sum + (l.estimated_value ?? 0), 0) ?? 0
    const conversionRate = totalLeads > 0 ? Math.round((closedDeals / totalLeads) * 100) : 0

    res.json({ totalLeads, closedDeals, pipelineValue, conversionRate })
  } catch {
    res.json({ totalLeads: 0, closedDeals: 0, pipelineValue: 0, conversionRate: 0 })
  }
})

// GET /api/sales/leads
salesRouter.get('/leads', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string || '100')
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Map snake_case to camelCase for frontend
    const mapped = (leads ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      businessName: l.business_name,
      source: l.source,
      status: l.status,
      package: l.package,
      estimatedValue: l.estimated_value,
      notes: l.notes,
      createdAt: l.created_at,
    }))

    res.json({ leads: mapped })
  } catch {
    res.json({ leads: [] })
  }
})

// POST /api/sales/leads
salesRouter.post('/leads', async (req, res) => {
  try {
    const { name, email, phone, businessName, source, status, package: pkg, estimatedValue, notes } = req.body

    if (!name || !email || !businessName) {
      res.status(400).json({ error: 'name, email, and businessName are required' })
      return
    }

    const { data, error } = await supabase.from('leads').insert({
      name,
      email,
      phone: phone || null,
      business_name: businessName,
      source: source || 'Other',
      status: status || 'new',
      package: pkg || null,
      estimated_value: estimatedValue || 0,
      notes: notes || null,
    }).select().single()

    if (error) throw error

    res.status(201).json({ lead: data })
  } catch (err) {
    console.error('Create lead error:', err)
    res.status(500).json({ error: 'Failed to create lead' })
  }
})

// PATCH /api/sales/leads/:id
salesRouter.patch('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ lead: data })
  } catch (err) {
    console.error('Update lead error:', err)
    res.status(500).json({ error: 'Failed to update lead' })
  }
})

// GET /api/sales/analytics
salesRouter.get('/analytics', async (_req, res) => {
  try {
    const { data: leads } = await supabase
      .from('leads')
      .select('status, estimated_value, source, package, created_at')

    if (!leads?.length) {
      res.json({
        revenueByMonth: [],
        bySource: [],
        byPackage: [],
        avgDealSize: 0,
        totalClosed: 0,
        totalLost: 0,
      })
      return
    }

    const closed = leads.filter((l) => l.status === 'closed')
    const totalClosed = closed.length
    const totalLost = leads.filter((l) => l.status === 'lost').length
    const avgDealSize = totalClosed > 0
      ? Math.round(closed.reduce((s, l) => s + (l.estimated_value ?? 0), 0) / totalClosed)
      : 0

    // Revenue by month (last 6 months of closed deals)
    const revenueByMonthMap = new Map<string, { revenue: number; deals: number }>()
    for (const lead of closed) {
      const month = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const existing = revenueByMonthMap.get(month) ?? { revenue: 0, deals: 0 }
      revenueByMonthMap.set(month, {
        revenue: existing.revenue + (lead.estimated_value ?? 0),
        deals: existing.deals + 1,
      })
    }
    const revenueByMonth = Array.from(revenueByMonthMap.entries())
      .map(([month, v]) => ({ month, ...v }))
      .slice(-6)

    // By source
    const sourceMap = new Map<string, { count: number; value: number }>()
    for (const lead of leads) {
      const src = lead.source || 'Other'
      const existing = sourceMap.get(src) ?? { count: 0, value: 0 }
      sourceMap.set(src, { count: existing.count + 1, value: existing.value + (lead.estimated_value ?? 0) })
    }
    const bySource = Array.from(sourceMap.entries())
      .map(([source, v]) => ({ source, ...v }))
      .sort((a, b) => b.count - a.count)

    // By package
    const packageMap = new Map<string, { count: number; value: number }>()
    for (const lead of closed) {
      const pkg = lead.package || 'Custom'
      const existing = packageMap.get(pkg) ?? { count: 0, value: 0 }
      packageMap.set(pkg, { count: existing.count + 1, value: existing.value + (lead.estimated_value ?? 0) })
    }
    const byPackage = Array.from(packageMap.entries())
      .map(([pkg, v]) => ({ package: pkg, ...v }))
      .sort((a, b) => b.value - a.value)

    res.json({ revenueByMonth, bySource, byPackage, avgDealSize, totalClosed, totalLost })
  } catch {
    res.json({ revenueByMonth: [], bySource: [], byPackage: [], avgDealSize: 0, totalClosed: 0, totalLost: 0 })
  }
})
