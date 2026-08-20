import { SectionLabel } from '../ui/SectionLabel'

type WorkItem = {
  /** Mono caption shown left of the year. */
  label: string
  year: string
  /** Real screenshot. When omitted, a labeled placeholder is shown instead. */
  image?: { src: string; alt: string }
  /** Live site the figure links to. When set, the figure opens it in a new tab. */
  href?: string
}

// Real project screenshots live in public/work/. Placeholders stay until their
// screenshots are ready.
const work: WorkItem[] = [
  {
    label: 'RESTAURANT — full redesign',
    year: "'25",
    image: {
      src: '/work/restaurante-chino-playa.jpg',
      alt: 'Restaurante Chino Playa website homepage',
    },
    href: 'https://restaurantechinoplaya.com',
  },
  {
    label: 'HOME DESIGN — Shopify store',
    year: "'25",
    image: {
      src: '/work/elehomedesign.jpg',
      alt: 'EleHomeDesign Shopify storefront homepage',
    },
    href: 'https://elehomedesign.com',
  },
  { label: 'WELLNESS STUDIO — booking site', year: "'24" },
]

function WorkMedia({ item }: { item: WorkItem }) {
  return item.image ? (
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
  )
}

function WorkFigure({ item }: { item: WorkItem }) {
  const card = (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--surface-solid)] transition-colors group-hover:border-[color-mix(in_srgb,var(--azure)_45%,var(--border-primary))]">
      <WorkMedia item={item} />
    </div>
  )

  return (
    <figure className="m-0">
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.label} — visit the live site (opens in a new tab)`}
          className="group block rounded-2xl outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
        >
          {card}
        </a>
      ) : (
        <div className="group">{card}</div>
      )}
      <figcaption className="mt-[14px] flex justify-between gap-3 font-mono text-[12px] tracking-[0.04em] text-[var(--text-faint)]">
        <span className="text-[var(--text-secondary)]">{item.label}</span>
        <span>
          {item.year}
          {item.href ? <span aria-hidden="true"> ↗</span> : null}
        </span>
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
