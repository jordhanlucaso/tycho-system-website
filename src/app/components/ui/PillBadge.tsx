import type { ReactNode } from 'react'

type PillBadgeProps = {
  children: ReactNode
  /** Show the leading pulsing gold dot (hero variant). */
  dot?: boolean
  className?: string
}

/**
 * Translucent azure pill with a mono uppercase label and an optional pulsing
 * gold "fixed star" dot. Used for the hero eyebrow badge.
 */
export function PillBadge({ children, dot = false, className = '' }: PillBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-[9px] rounded-full border border-[color-mix(in_srgb,var(--azure)_28%,transparent)] bg-[color-mix(in_srgb,var(--azure)_6%,transparent)] px-[13px] py-[7px] font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--azure)] ${className}`}
    >
      {dot && (
        <span
          className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--gold)] motion-safe:animate-pulse"
          style={{ boxShadow: '0 0 10px var(--gold)' }}
        />
      )}
      {children}
    </span>
  )
}
