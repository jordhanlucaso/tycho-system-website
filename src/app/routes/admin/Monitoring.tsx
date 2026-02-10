import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { StatusIndicator } from '../../components/StatusIndicator'
import { UptimeChart } from '../../components/UptimeChart'

type SiteHealth = {
  siteId: string
  domain: string
  status: 'up' | 'down' | 'unknown'
  lastCheck: string | null
  history: {
    is_up: boolean
    response_time_ms: number
    created_at: string
  }[]
}

export function AdminMonitoring() {
  const [sites, setSites] = useState<SiteHealth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Monitoring — Admin — Tycho Systems'
    fetch('/api/health/sites')
      .then((r) => r.json())
      .then((d) => setSites(d.sites || []))
      .catch(() => setSites([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Site Monitoring</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Health checks and uptime tracking.</p>
      </motion.div>

      <div className='mt-8 space-y-4'>
        {loading ? (
          <div className='text-sm text-[var(--text-muted)]'>Loading...</div>
        ) : sites.length === 0 ? (
          <div className='glass rounded-xl p-8 text-center text-sm text-[var(--text-muted)]'>
            No monitored sites. Active sites will be health-checked automatically.
          </div>
        ) : (
          sites.map((site, i) => (
            <motion.div
              key={site.siteId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className='glass rounded-xl p-5'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-semibold text-[var(--text-primary)]'>{site.domain}</div>
                  {site.lastCheck && (
                    <div className='mt-0.5 text-xs text-[var(--text-faint)]'>
                      Last checked: {new Date(site.lastCheck).toLocaleString()}
                    </div>
                  )}
                </div>
                <StatusIndicator status={site.status} />
              </div>

              <div className='mt-4'>
                <UptimeChart history={site.history} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
