type Props = {
  status: 'up' | 'down' | 'unknown'
  label?: string
}

const colors = {
  up: 'bg-green-400',
  down: 'bg-red-400',
  unknown: 'bg-[var(--text-faint)]'
}

const labels = {
  up: 'Operational',
  down: 'Down',
  unknown: 'Unknown'
}

export function StatusIndicator({ status, label }: Props) {
  return (
    <div className='inline-flex items-center gap-2'>
      <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
      <span className='text-xs text-[var(--text-secondary)]'>{label ?? labels[status]}</span>
    </div>
  )
}
