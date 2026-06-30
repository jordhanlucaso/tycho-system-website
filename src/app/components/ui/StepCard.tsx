type StepCardProps = {
  /** Two-digit index, e.g. "01". */
  index: string
  title: string
  description: string
}

/**
 * One cell of the process grid: a mono azure index, a display title, and muted
 * copy. Rendered on the solid surface so the 1px parent gaps read as hairlines.
 */
export function StepCard({ index, title, description }: StepCardProps) {
  return (
    <div className="bg-[var(--surface-solid)] px-6 pb-8 pt-7">
      <div className="mb-[18px] font-mono text-[13px] text-[var(--azure)]">{index}</div>
      <h3 className="mb-[10px] font-display text-[19px] font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-[14.5px] leading-[1.6] text-[var(--text-muted)]">{description}</p>
    </div>
  )
}
