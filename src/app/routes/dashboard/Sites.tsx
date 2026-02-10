import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

type Site = {
  id: string
  domain: string
  status: string
  created_at: string
}

export function DashboardSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'My Sites — Tycho Systems'
    fetch('/api/client/sites')
      .then((r) => r.json())
      .then((d) => setSites(d.sites || []))
      .catch(() => setSites([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>My Sites</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Your managed websites.</p>
      </motion.div>

      <div className='mt-8'>
        {loading ? (
          <div className='text-sm text-[var(--text-muted)]'>Loading...</div>
        ) : sites.length === 0 ? (
          <div className='glass rounded-xl p-8 text-center text-sm text-[var(--text-muted)]'>
            No sites yet. Your project will appear here once it&apos;s set up.
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2'>
            {sites.map((site, i) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className='glass glass-hover rounded-xl p-5'
              >
                <div className='font-semibold text-[var(--text-primary)]'>{site.domain}</div>
                <div className='mt-1 text-xs text-[var(--text-muted)]'>Status: {site.status}</div>
                <div className='mt-1 text-xs text-[var(--text-faint)]'>
                  Created {new Date(site.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
