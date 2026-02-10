type CheckPoint = {
  is_up: boolean
  response_time_ms: number
  created_at: string
}

type Props = {
  history: CheckPoint[]
}

export function UptimeChart({ history }: Props) {
  if (history.length === 0) {
    return <div className='text-xs text-[var(--text-muted)]'>No data yet.</div>
  }

  // Show last 30 checks as a bar chart
  const points = history.slice(-30)
  const maxTime = Math.max(...points.map((p) => p.response_time_ms), 1)

  return (
    <div className='space-y-2'>
      {/* Uptime bars */}
      <div className='flex items-end gap-0.5' style={{ height: 48 }}>
        {points.map((p, i) => {
          const height = Math.max((p.response_time_ms / maxTime) * 100, 8)
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm transition-colors ${p.is_up ? 'bg-green-400/60 hover:bg-green-400' : 'bg-red-400/60 hover:bg-red-400'}`}
              style={{ height: `${height}%` }}
              title={`${p.is_up ? 'UP' : 'DOWN'} — ${p.response_time_ms}ms — ${new Date(p.created_at).toLocaleString()}`}
            />
          )
        })}
      </div>

      {/* Summary */}
      <div className='flex items-center justify-between text-xs text-[var(--text-muted)]'>
        <span>{points.filter((p) => p.is_up).length}/{points.length} checks passed</span>
        <span>
          Avg: {Math.round(points.reduce((s, p) => s + p.response_time_ms, 0) / points.length)}ms
        </span>
      </div>
    </div>
  )
}
