import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

type Stats = {
  clients: number
  activeSites: number
  revenue: number
  pendingInvoices: number
}

const statCards = [
  { key: 'clients' as const, label: 'Total Clients', format: (v: number) => String(v) },
  { key: 'activeSites' as const, label: 'Active Sites', format: (v: number) => String(v) },
  { key: 'revenue' as const, label: 'Revenue', format: (v: number) => `$${(v / 100).toLocaleString()}` },
  { key: 'pendingInvoices' as const, label: 'Pending Invoices', format: (v: number) => String(v) }
]

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    document.title = 'Admin — Tycho Systems'
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ clients: 0, activeSites: 0, revenue: 0, pendingInvoices: 0 }))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Dashboard</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Overview of your business.</p>
      </motion.div>

      <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className='glass rounded-xl p-5'
          >
            <div className='text-xs font-medium text-[var(--text-muted)]'>{card.label}</div>
            <div className='mt-2 text-2xl font-semibold text-[var(--text-primary)]'>
              {stats ? card.format(stats[card.key]) : '—'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className='mt-8 glass rounded-xl p-6'>
        <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Recent Activity</h2>
        <p className='mt-4 text-sm text-[var(--text-muted)]'>No recent activity to display.</p>
      </div>
    </div>
  )
}
