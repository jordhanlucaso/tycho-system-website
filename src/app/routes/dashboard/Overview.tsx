import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../../lib/auth'

type DashboardData = {
  sites: { id: string; domain: string; status: string }[]
  invoices: { id: string; amount_cents: number; status: string; created_at: string }[]
  upcomingPayments: { id: string; amount_cents: number; due_date: string }[]
}

export function DashboardOverview() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    document.title = 'Dashboard — Tycho Systems'
    fetch('/api/client/overview')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ sites: [], invoices: [], upcomingPayments: [] }))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Here&apos;s an overview of your account.</p>
      </motion.div>

      <div className='mt-8 grid gap-4 sm:grid-cols-3'>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className='glass rounded-xl p-5'>
          <div className='text-xs font-medium text-[var(--text-muted)]'>Active Sites</div>
          <div className='mt-2 text-2xl font-semibold text-[var(--text-primary)]'>{data?.sites.length ?? '—'}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='glass rounded-xl p-5'>
          <div className='text-xs font-medium text-[var(--text-muted)]'>Invoices</div>
          <div className='mt-2 text-2xl font-semibold text-[var(--text-primary)]'>{data?.invoices.length ?? '—'}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass rounded-xl p-5'>
          <div className='text-xs font-medium text-[var(--text-muted)]'>Upcoming Payments</div>
          <div className='mt-2 text-2xl font-semibold text-[var(--text-primary)]'>{data?.upcomingPayments.length ?? '—'}</div>
        </motion.div>
      </div>

      <div className='mt-8 glass rounded-xl p-6'>
        <h2 className='text-lg font-semibold text-[var(--text-primary)]'>Your Sites</h2>
        {data?.sites.length === 0 ? (
          <p className='mt-4 text-sm text-[var(--text-muted)]'>No active sites yet. Once your project is live, it will appear here.</p>
        ) : (
          <div className='mt-4 space-y-3'>
            {data?.sites.map((site) => (
              <div key={site.id} className='flex items-center justify-between rounded-xl border border-[var(--border-subtle)] p-4'>
                <div className='font-medium text-[var(--text-primary)]'>{site.domain}</div>
                <span className='rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400'>
                  {site.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
