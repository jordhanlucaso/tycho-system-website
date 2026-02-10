import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

type Invoice = {
  id: string
  amount_cents: number
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-500/10 text-green-400',
  pending: 'bg-amber-500/10 text-amber-400',
  overdue: 'bg-red-500/10 text-red-400'
}

export function DashboardInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Invoices — Tycho Systems'
    fetch('/api/client/invoices')
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Invoices</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Your billing history.</p>
      </motion.div>

      <div className='mt-8 glass rounded-xl overflow-hidden'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-[var(--border-primary)]'>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Invoice</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Amount</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Status</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className='px-4 py-8 text-center text-[var(--text-muted)]'>Loading...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={4} className='px-4 py-8 text-center text-[var(--text-muted)]'>No invoices yet.</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className='border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-surface-hover)]'>
                  <td className='px-4 py-3 font-mono text-xs text-[var(--text-body)]'>{inv.id.slice(0, 8)}</td>
                  <td className='px-4 py-3 font-semibold text-[var(--text-primary)]'>${(inv.amount_cents / 100).toFixed(2)}</td>
                  <td className='px-4 py-3'>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[inv.status] || 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-[var(--text-muted)]'>{new Date(inv.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
