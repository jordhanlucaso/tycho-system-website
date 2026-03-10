import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { apiFetch } from '../../lib/api'

type Stats = {
  totalLeads: number
  closedDeals: number
  pipelineValue: number
  conversionRate: number
}

type Lead = {
  id: string
  name: string
  businessName: string
  package: string
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'lost'
  estimatedValue: number
  createdAt: string
}

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-yellow-500/10 text-yellow-400',
  quoted: 'bg-violet-500/10 text-violet-400',
  closed: 'bg-green-500/10 text-green-400',
  lost: 'bg-red-500/10 text-red-400',
}

export function SalesOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    document.title = 'Sales — Tycho Systems'
    apiFetch('/api/sales/stats')
      .then((r: Response) => r.json())
      .then(setStats)
      .catch(() => setStats({ totalLeads: 0, closedDeals: 0, pipelineValue: 0, conversionRate: 0 }))

    apiFetch('/api/sales/leads?limit=5')
      .then((r: Response) => r.json())
      .then((d: { leads?: Lead[] }) => setLeads(d.leads ?? []))
      .catch(() => setLeads([]))
  }, [])

  const statCards = [
    { label: 'Total Leads', value: stats ? String(stats.totalLeads) : '—' },
    { label: 'Closed Deals', value: stats ? String(stats.closedDeals) : '—' },
    { label: 'Pipeline Value', value: stats ? `$${(stats.pipelineValue / 100).toLocaleString()}` : '—' },
    { label: 'Conversion Rate', value: stats ? `${stats.conversionRate}%` : '—' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Sales Overview</h1>
            <p className='mt-1 text-sm text-[var(--text-secondary)]'>Track leads, deals, and pipeline performance.</p>
          </div>
          <Link
            to='/sales/new'
            className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90'
          >
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
            </svg>
            New sale
          </Link>
        </div>
      </motion.div>

      <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className='glass rounded-xl p-5'
          >
            <div className='text-xs font-medium text-[var(--text-muted)]'>{card.label}</div>
            <div className='mt-2 text-2xl font-semibold text-[var(--text-primary)]'>{card.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className='mt-8 glass rounded-xl p-6'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Recent Leads</h2>
          <Link to='/sales/clients' className='text-sm text-violet-400 transition-colors hover:text-violet-300'>
            View all →
          </Link>
        </div>

        {leads.length === 0 ? (
          <p className='mt-4 text-sm text-[var(--text-muted)]'>No leads yet. <Link to='/sales/new' className='text-violet-400 hover:text-violet-300'>Add your first sale →</Link></p>
        ) : (
          <div className='mt-4 space-y-3'>
            {leads.map((lead) => (
              <div key={lead.id} className='flex items-center justify-between rounded-xl border border-[var(--border-subtle)] p-4'>
                <div className='min-w-0'>
                  <div className='font-medium text-[var(--text-primary)]'>{lead.name}</div>
                  <div className='text-sm text-[var(--text-muted)]'>{lead.businessName} · {lead.package}</div>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-semibold text-[var(--text-primary)]'>
                    ${(lead.estimatedValue / 100).toLocaleString()}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
