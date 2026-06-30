import type { ReactNode } from 'react'

type ButtonProps = {
  href: string
  variant?: 'primary' | 'secondary'
  /** Append the mono "→" affix. */
  arrow?: boolean
  /** Render the label in IBM Plex Mono (used for the email outline button). */
  mono?: boolean
  children: ReactNode
  className?: string
}

const base =
  'inline-flex items-center gap-2 rounded-[11px] px-[22px] py-[13px] text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]'

const variants = {
  primary:
    'bg-[var(--azure)] text-[var(--bg-primary)] hover:bg-[var(--azure-hover)] hover:-translate-y-px',
  secondary:
    'font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-hover)] hover:bg-[var(--bg-surface-hover)] hover:border-[color-mix(in_srgb,var(--text-primary)_24%,transparent)]',
} as const

/**
 * Primary (azure) / secondary (translucent outline) action, rendered as an
 * anchor so it works for in-page hash links and mailto: targets alike.
 */
export function Button({
  href,
  variant = 'primary',
  arrow = false,
  mono = false,
  children,
  className = '',
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${mono ? 'font-mono text-[14px] font-normal' : ''} ${className}`}
    >
      {children}
      {arrow && <span className="font-mono">→</span>}
    </a>
  )
}
