import type { ReactNode } from 'react'

type ServiceCardProps = {
  /** Glyph or small SVG shown in the icon tile. */
  icon: ReactNode
  title: string
  description: string
  /** Tint of the icon tile border (gold for the personal/portfolio card). */
  tone?: 'azure' | 'gold'
  /** Accent treatment: azure gradient bg + brighter border (the AI agents card). */
  accent?: boolean
  /** Show the mono "New" pill in the top-right (the AI agents card). */
  isNew?: boolean
}

/**
 * A service offering: an icon tile, a display title, and muted copy. Supports
 * an optional accent background and "New" pill for the flagged AI-agents card.
 */
export function ServiceCard({
  icon,
  title,
  description,
  tone = 'azure',
  accent = false,
  isNew = false,
}: ServiceCardProps) {
  const tileBorder =
    tone === 'gold'
      ? 'border-[color-mix(in_srgb,var(--gold)_35%,transparent)]'
      : 'border-[color-mix(in_srgb,var(--azure)_30%,transparent)]'

  return (
    <div
      className={`rounded-2xl border px-6 py-[26px] ${
        accent
          ? 'border-[color-mix(in_srgb,var(--azure)_32%,transparent)]'
          : 'border-[var(--border-primary)] bg-[var(--surface-solid)]'
      }`}
      style={
        accent
          ? {
              background:
                'linear-gradient(180deg, rgba(111,168,255,0.07), rgba(111,168,255,0.02))',
            }
          : undefined
      }
    >
      <div className={`mb-[18px] flex items-center ${isNew ? 'justify-between' : ''}`}>
        <div
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border ${tileBorder} font-mono text-[15px]`}
          style={{ color: tone === 'gold' ? 'var(--gold)' : 'var(--azure)' }}
        >
          {icon}
        </div>
        {isNew && (
          <span className="rounded-full border border-[color-mix(in_srgb,var(--azure)_30%,transparent)] px-[9px] py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--azure)]">
            New
          </span>
        )}
      </div>
      <h3 className="mb-[9px] font-display text-[18px] font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-[14.5px] leading-[1.6] text-[var(--text-muted)]">{description}</p>
    </div>
  )
}
