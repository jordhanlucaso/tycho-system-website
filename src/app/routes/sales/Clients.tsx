import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { apiFetch } from '../../lib/api'

type Lead = {
  id: string
  name: string
  email: string
  phone?: string
  businessName: string
  source: string
  status: 'new' | 'contacted' | 'quoted' | 'closed' | 'lost'
  package: string
  estimatedValue: number
  notes?: string
  createdAt: string
}

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-blue-500/10 text-blue-400',
  contacted: 'bg-yellow-500/10 text-yellow-400',
  quoted: 'bg-violet-500/10 text-violet-400',
  closed: 'bg-green-500/10 text-green-400',
  lost: 'bg-red-500/10 text-red-400',
}

export function SalesClients() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    document.title = 'Clients — Sales — Tycho Systems'
    loadLeads()
  }, [])

  function loadLeads() {
    setLoading(true)
    apiFetch('/api/sales/leads')
      .then((r: Response) => r.json())
      .then((d: { leads?: Lead[] }) => setLeads(d.leads ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false))
  }

  async function updateStatus(id: string, status: Lead['status']) {
    setUpdatingStatus(true)
    try {
      await apiFetch(`/api/sales/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filtered = leads.filter((l) => {
    const matchesSearch = !search || [l.name, l.businessName, l.email].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Clients & Leads</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Manage your sales pipeline and client database.</p>
      </motion.div>

      {/* Filters */}
      <div className='mt-6 flex flex-wrap gap-3'>
        <input
          type='search'
          placeholder='Search by name, business, or email…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 w-72'
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Lead['status'] | 'all')}
          className='rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-body)] outline-none cursor-pointer'
        >
          <option value='all'>All statuses</option>
          <option value='new'>New</option>
          <option value='contacted'>Contacted</option>
          <option value='quoted'>Quoted</option>
          <option value='closed'>Closed</option>
          <option value='lost'>Lost</option>
        </select>
        <div className='ml-auto text-sm text-[var(--text-muted)] flex items-center'>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className='mt-4 flex gap-6'>
        {/* Table */}
        <div className={`flex-1 glass rounded-xl overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className='p-8 text-center text-sm text-[var(--text-muted)]'>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className='p-8 text-center text-sm text-[var(--text-muted)]'>No leads found.</div>
          ) : (
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[var(--border-primary)] text-left text-xs font-medium text-[var(--text-muted)]'>
                  <th className='px-5 py-3'>Contact</th>
                  <th className='px-5 py-3'>Package</th>
                  <th className='px-5 py-3'>Value</th>
                  <th className='px-5 py-3'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`border-b border-[var(--border-subtle)] cursor-pointer transition-colors hover:bg-[var(--bg-surface-hover)] ${selected?.id === lead.id ? 'bg-[var(--bg-surface-hover)]' : ''}`}
                  >
                    <td className='px-5 py-3.5'>
                      <div className='font-medium text-[var(--text-primary)]'>{lead.name}</div>
                      <div className='text-xs text-[var(--text-muted)]'>{lead.businessName}</div>
                    </td>
                    <td className='px-5 py-3.5 text-sm text-[var(--text-secondary)]'>{lead.package || '—'}</td>
                    <td className='px-5 py-3.5 text-sm font-semibold text-[var(--text-primary)]'>
                      ${(lead.estimatedValue / 100).toLocaleString()}
                    </td>
                    <td className='px-5 py-3.5'>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className='w-full lg:w-80 shrink-0 glass rounded-xl p-5 space-y-4'
          >
            <div className='flex items-start justify-between'>
              <div>
                <div className='font-semibold text-[var(--text-primary)]'>{selected.name}</div>
                <div className='text-sm text-[var(--text-muted)]'>{selected.businessName}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className='text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                aria-label='Close detail panel'
              >
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='space-y-2 text-sm'>
              <div className='flex gap-2'>
                <span className='text-[var(--text-muted)] w-20 shrink-0'>Email</span>
                <a href={`mailto:${selected.email}`} className='text-violet-400 hover:text-violet-300 truncate'>{selected.email}</a>
              </div>
              {selected.phone && (
                <div className='flex gap-2'>
                  <span className='text-[var(--text-muted)] w-20 shrink-0'>Phone</span>
                  <span className='text-[var(--text-body)]'>{selected.phone}</span>
                </div>
              )}
              <div className='flex gap-2'>
                <span className='text-[var(--text-muted)] w-20 shrink-0'>Package</span>
                <span className='text-[var(--text-body)]'>{selected.package || '—'}</span>
              </div>
              <div className='flex gap-2'>
                <span className='text-[var(--text-muted)] w-20 shrink-0'>Value</span>
                <span className='font-semibold text-[var(--text-primary)]'>${(selected.estimatedValue / 100).toLocaleString()}</span>
              </div>
              <div className='flex gap-2'>
                <span className='text-[var(--text-muted)] w-20 shrink-0'>Source</span>
                <span className='text-[var(--text-body)]'>{selected.source}</span>
              </div>
            </div>

            {selected.notes && (
              <div>
                <div className='text-xs font-medium text-[var(--text-muted)] mb-1'>Notes</div>
                <p className='text-sm text-[var(--text-secondary)]'>{selected.notes}</p>
              </div>
            )}

            <div>
              <div className='text-xs font-medium text-[var(--text-muted)] mb-2'>Update status</div>
              <div className='flex flex-wrap gap-2'>
                {(['new', 'contacted', 'quoted', 'closed', 'lost'] as const).map((s) => (
                  <button
                    key={s}
                    disabled={updatingStatus || selected.status === s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity disabled:opacity-50 ${
                      selected.status === s ? statusColors[s] + ' ring-1 ring-current' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
