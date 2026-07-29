import type { ReactNode } from 'react'
import { Link } from 'react-router'

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
 * Primary (azure) / secondary (translucent outline) action. Internal routes
 * (href starting with "/") render as a client-side <Link>; hash and mailto:
 * targets stay plain anchors.
 */
export function Button({
  href,
  variant = 'primary',
  arrow = false,
  mono = false,
  children,
  className = '',
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${mono ? 'font-mono text-[14px] font-normal' : ''} ${className}`
  const content = (
    <>
      {children}
      {arrow && <span className="font-mono">→</span>}
    </>
  )

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}
