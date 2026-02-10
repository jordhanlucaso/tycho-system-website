import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

type Site = {
  id: string
  client_id: string
  domain: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400',
  building: 'bg-amber-500/10 text-amber-400',
  inactive: 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
}

export function AdminSites() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Sites — Admin — Tycho Systems'
    fetch('/api/admin/sites')
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
              <div className='flex items-center justify-between'>
                <div className='font-semibold text-[var(--text-primary)]'>{site.domain}</div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[site.status] || statusColors.inactive}`}>
                  {site.status}
                </span>
              </div>
              <div className='mt-2 text-xs text-[var(--text-muted)]'>
                Created {new Date(site.created_at).toLocaleDateString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
