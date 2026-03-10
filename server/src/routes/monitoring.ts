import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../lib/auth-middleware.js'

export const monitoringRouter = Router()

// GET /api/health/sites — admin: all live sites + last 30 health checks each
monitoringRouter.get('/health/sites', requireAuth('admin'), async (_req, res) => {
  try {
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('id, name, domain')
      .eq('status', 'live')
      .order('created_at', { ascending: false })

    if (sitesError) throw sitesError
    if (!sites || sites.length === 0) {
      res.json({ sites: [] })
      return
    }

    const results = await Promise.all(
      sites.map(async (site) => {
        const { data: checks } = await supabase
          .from('health_checks')
          .select('is_up, response_time_ms, checked_at')
          .eq('site_id', site.id)
          .order('checked_at', { ascending: false })
          .limit(30)

        const history = (checks ?? []).map((c) => ({
          is_up: c.is_up,
          response_time_ms: c.response_time_ms ?? 0,
          created_at: c.checked_at,
        }))

        const latest = history[0]
        const status: 'up' | 'down' | 'unknown' = latest
          ? latest.is_up ? 'up' : 'down'
          : 'unknown'

        return {
          siteId: site.id,
          domain: site.domain ?? site.name,
          status,
          lastCheck: latest ? latest.created_at : null,
          history,
        }
      })
    )

    res.json({ sites: results })
  } catch {
    res.json({ sites: [] })
  }
})

// GET /api/sites/:id/status — per-site health (used by client dashboard)
monitoringRouter.get('/sites/:id/status', requireAuth(), async (req, res) => {
  try {
    const { data: site } = await supabase
      .from('sites')
      .select('id, domain, name')
      .eq('id', req.params.id)
      .single()

    if (!site) { res.status(404).json({ error: 'Not found' }); return }

    const { data: checks } = await supabase
      .from('health_checks')
      .select('is_up, response_time_ms, checked_at')
      .eq('site_id', site.id)
      .order('checked_at', { ascending: false })
      .limit(30)

    const history = (checks ?? []).map((c) => ({
      is_up: c.is_up,
      response_time_ms: c.response_time_ms ?? 0,
      created_at: c.checked_at,
    }))

    const latest = history[0]
    const status: 'up' | 'down' | 'unknown' = latest
      ? latest.is_up ? 'up' : 'down'
      : 'unknown'

    res.json({
      siteId: site.id,
      domain: site.domain ?? site.name,
      status,
      lastCheck: latest ? latest.created_at : null,
      history,
    })
  } catch {
    res.json({ siteId: req.params.id, status: 'unknown', lastCheck: null, history: [] })
  }
})
