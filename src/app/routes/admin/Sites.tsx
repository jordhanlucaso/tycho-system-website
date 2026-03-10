import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { apiFetch } from '../../lib/api'

type Site = {
  id: string
  client_id: string
  name: string
  domain: string | null
  status: string
  plan: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  live:     'bg-green-500/10 text-green-400',
  building: 'bg-amber-500/10 text-amber-400',
  paused:   'bg-[var(--bg-surface)] text-[var(--text-muted)]',
  archived: 'bg-[var(--bg-surface)] text-[var(--text-faint)]',
}

export function AdminSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Sites — Admin — Tycho Systems'
    apiFetch('/api/admin/sites')
      .then((r) => r.json())
      .then((d) => setSites(d.sites || []))
      .catch(() => setSites([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Sites</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Managed client websites.</p>
      </motion.div>

      <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {loading ? (
          <div className='col-span-full text-center text-sm text-[var(--text-muted)] py-8'>Loading...</div>
        ) : sites.length === 0 ? (
          <div className='col-span-full glass rounded-xl p-8 text-center text-sm text-[var(--text-muted)]'>
            No sites yet.
          </div>
        ) : (
          sites.map((site, i) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className='glass glass-hover rounded-xl p-5'
            >
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <div className='font-semibold text-[var(--text-primary)]'>{site.name}</div>
                  {site.domain && (
                    <div className='mt-0.5 text-xs text-[var(--text-muted)]'>{site.domain}</div>
                  )}
                </div>
                <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[site.status] || statusColors.paused}`}>
                  {site.status}
                </span>
              </div>
              <div className='mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]'>
                {site.plan && <span className='rounded-md bg-violet-500/10 px-2 py-0.5 text-violet-400'>{site.plan}</span>}
                <span className='ml-auto'>Added {new Date(site.created_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
