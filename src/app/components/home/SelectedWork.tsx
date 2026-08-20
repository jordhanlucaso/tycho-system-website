import { SectionLabel } from '../ui/SectionLabel'

type WorkItem = {
  /** Mono caption shown left of the year. */
  label: string
  year: string
  /** Real screenshot. When omitted, a labeled placeholder is shown instead. */
  image?: { src: string; alt: string }
}

// Real project screenshots are user-supplied — drop them in here when ready.
const work: WorkItem[] = [
  { label: 'RESTAURANT — full redesign', year: "'25" },
  { label: 'HOME SERVICES — new build', year: "'25" },
  { label: 'WELLNESS STUDIO — booking site', year: "'24" },
]

function WorkFigure({ item }: { item: WorkItem }) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-solid)]">
        {item.image ? (
          <img
            src={item.image.src}
            alt={item.image.alt}
            loading="lazy"
            className="block aspect-[16/11] w-full object-cover"
          />
        ) : (
          <div
            className="flex aspect-[16/11] w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]"
            role="img"
            aria-label={`${item.label} — screenshot coming soon`}
          >
            [ screenshot ]
          </div>
        )}
      </div>
      <figcaption className="mt-[14px] flex justify-between gap-3 font-mono text-[12px] tracking-[0.04em] text-[var(--text-faint)]">
        <span className="text-[var(--text-secondary)]">{item.label}</span>
        <span>{item.year}</span>
      </figcaption>
    </figure>
  )
}

/**
 * Selected work: a 3-up portfolio grid of 16:11 figures with mono captions.
 * Collapses to a single column on narrow widths.
 */
export function SelectedWork() {
  return (
    <section
      id="work"
      className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] pb-[clamp(56px,8vw,104px)] pt-[clamp(40px,5vw,64px)]"
    >
      <div className="mb-[clamp(28px,3.5vw,44px)]">
        <SectionLabel className="mb-[14px]">Selected work</SectionLabel>
        <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
          A few things we've built.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {work.map((item) => (
          <WorkFigure key={item.label} item={item} />
        ))}
      </div>
    </section>
  )
}
