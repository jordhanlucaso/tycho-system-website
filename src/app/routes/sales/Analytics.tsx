import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { apiFetch } from '../../lib/api'

type RevenuePoint = { month: string; revenue: number; deals: number }
type SourceBreakdown = { source: string; count: number; value: number }
type PackageBreakdown = { package: string; count: number; value: number }

type AnalyticsData = {
  revenueByMonth: RevenuePoint[]
  bySource: SourceBreakdown[]
  byPackage: PackageBreakdown[]
  avgDealSize: number
  totalClosed: number
  totalLost: number
}

function Bar({ value, max, color = 'from-violet-500 to-cyan-500' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className='h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-hover)]'>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function SalesAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    document.title = 'Analytics — Sales — Tycho Systems'
    apiFetch('/api/sales/analytics')
      .then((r: Response) => r.json())
      .then(setData)
      .catch(() => setData({
        revenueByMonth: [],
        bySource: [],
        byPackage: [],
        avgDealSize: 0,
        totalClosed: 0,
        totalLost: 0,
      }))
  }, [])

  const maxRevenue = Math.max(...(data?.revenueByMonth.map((p) => p.revenue) ?? [1]))
  const maxSource = Math.max(...(data?.bySource.map((s) => s.count) ?? [1]))
  const maxPackage = Math.max(...(data?.byPackage.map((p) => p.count) ?? [1]))

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Analytics</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Sales performance and pipeline insights.</p>
      </motion.div>

      <div className='mt-6 grid gap-4 sm:grid-cols-3'>
        {[
          { label: 'Avg. Deal Size', value: data ? `$${(data.avgDealSize / 100).toLocaleString()}` : '—' },
          { label: 'Closed Deals', value: data ? String(data.totalClosed) : '—', accent: 'text-green-400' },
          { label: 'Lost Leads', value: data ? String(data.totalLost) : '—', accent: 'text-red-400' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className='glass rounded-xl p-5'
          >
            <div className='text-xs font-medium text-[var(--text-muted)]'>{card.label}</div>
            <div className={`mt-2 text-2xl font-semibold ${card.accent ?? 'text-[var(--text-primary)]'}`}>{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        {/* Revenue by month */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className='glass rounded-xl p-6'
        >
          <h2 className='font-semibold text-[var(--text-primary)]'>Revenue by Month</h2>
          <div className='mt-4 space-y-3'>
            {!data || data.revenueByMonth.length === 0 ? (
              <p className='text-sm text-[var(--text-muted)]'>No data yet.</p>
            ) : (
              data.revenueByMonth.map((point) => (
                <div key={point.month}>
                  <div className='flex justify-between text-xs text-[var(--text-muted)] mb-1'>
                    <span>{point.month}</span>
                    <span className='font-medium text-[var(--text-body)]'>${(point.revenue / 100).toLocaleString()} · {point.deals} deal{point.deals !== 1 ? 's' : ''}</span>
                  </div>
                  <Bar value={point.revenue} max={maxRevenue} />
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* By source */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='glass rounded-xl p-6'
        >
          <h2 className='font-semibold text-[var(--text-primary)]'>Leads by Source</h2>
          <div className='mt-4 space-y-3'>
            {!data || data.bySource.length === 0 ? (
              <p className='text-sm text-[var(--text-muted)]'>No data yet.</p>
            ) : (
              data.bySource.map((s) => (
                <div key={s.source}>
                  <div className='flex justify-between text-xs text-[var(--text-muted)] mb-1'>
                    <span>{s.source}</span>
                    <span className='font-medium text-[var(--text-body)]'>{s.count} lead{s.count !== 1 ? 's' : ''}</span>
                  </div>
                  <Bar value={s.count} max={maxSource} color='from-cyan-500 to-violet-500' />
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* By package */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className='glass rounded-xl p-6 lg:col-span-2'
        >
          <h2 className='font-semibold text-[var(--text-primary)]'>Sales by Package</h2>
          <div className='mt-4 space-y-3'>
            {!data || data.byPackage.length === 0 ? (
              <p className='text-sm text-[var(--text-muted)]'>No data yet.</p>
            ) : (
              data.byPackage.map((p) => (
                <div key={p.package}>
                  <div className='flex justify-between text-xs text-[var(--text-muted)] mb-1'>
                    <span>{p.package}</span>
                    <span className='font-medium text-[var(--text-body)]'>{p.count} sale{p.count !== 1 ? 's' : ''} · ${(p.value / 100).toLocaleString()}</span>
                  </div>
                  <Bar value={p.count} max={maxPackage} />
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
