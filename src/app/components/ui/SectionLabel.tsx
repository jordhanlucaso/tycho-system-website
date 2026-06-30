type SectionLabelProps = {
  /** Inner text; the surrounding "[ … ]" brackets are added automatically. */
  children: string
  className?: string
}

/**
 * The recurring mono eyebrow rendered as `[ Label ]` in azure, e.g.
 * `[ The process · 01–04 ]`.
 */
export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--azure)] ${className}`}
    >
      [ {children} ]
    </div>
  )
}
