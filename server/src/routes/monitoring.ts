import { Router } from 'express'

export const monitoringRouter = Router()

// Get health status for a specific site
monitoringRouter.get('/sites/:id/status', (_req, res) => {
  // TODO: Query health_checks table from Supabase
  res.json({
    siteId: _req.params.id,
    status: 'unknown',
    lastCheck: null,
    history: []
  })
})

// Get health overview for all sites (admin)
monitoringRouter.get('/health/sites', (_req, res) => {
  // TODO: Return aggregated health data for all monitored sites
  res.json({ sites: [] })
})
