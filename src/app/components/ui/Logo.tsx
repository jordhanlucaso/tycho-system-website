type LogoProps = {
  /** Pixel size of the orbital mark (min 20). Defaults to 26. */
  size?: number
  className?: string
}

/**
 * The Tycho orbital brand mark: an outer ring, an inner ring, and a single
 * gold "fixed star" dot — a planet observed. Strokes use the azure accent so
 * the mark recolors correctly in light mode via CSS variables.
 */
export function Logo({ size = 26, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="13" cy="13" r="11" stroke="var(--azure)" strokeWidth="1.4" />
      <circle
        cx="13"
        cy="13"
        r="5.4"
        fill="none"
        stroke="var(--azure)"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <circle cx="16.4" cy="9.6" r="1.7" fill="var(--gold)" />
    </svg>
  )
}
