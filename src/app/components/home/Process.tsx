import { SectionLabel } from '../ui/SectionLabel'
import { StepCard } from '../ui/StepCard'

const steps = [
  {
    index: '01',
    title: 'Discovery',
    description: 'We learn your business, your customers, and what a win actually looks like.',
  },
  {
    index: '02',
    title: 'Design',
    description: 'We chart the layout, voice, and look — and agree on the map before a line is built.',
  },
  {
    index: '03',
    title: 'Build',
    description: 'We construct a fast, accessible site, tested on every screen it will live on.',
  },
  {
    index: '04',
    title: 'Launch',
    description: 'We go live, hand over the keys, and make sure everything holds steady.',
  },
]

/**
 * The process section: a 4-step grid of joined cards (1px gaps over a hairline
 * background) followed by the gold-bordered "after launch" care callout.
 */
export function Process() {
  return (
    <section
      id="process"
      className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]"
    >
      <div className="mb-[clamp(32px,4vw,52px)] flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <SectionLabel className="mb-[14px]">The process · 01–04</SectionLabel>
          <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
            From first contact to launch day.
          </h2>
        </div>
        <p className="m-0 max-w-[300px] text-[15px] leading-[1.6] text-[var(--text-muted)]">
          A clear, calm route. You always know where the project is and what happens next.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-px overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--border-primary)]">
        {steps.map((step) => (
          <StepCard key={step.index} {...step} />
        ))}
      </div>

      <div
        className="mt-5 flex flex-wrap items-center gap-[18px] rounded-2xl border px-[26px] py-[22px]"
        style={{
          borderColor: 'color-mix(in srgb, var(--gold) 28%, transparent)',
          background: 'color-mix(in srgb, var(--gold) 5%, transparent)',
        }}
      >
        <div className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--gold)]">
          ↻ After launch
        </div>
        <p className="m-0 min-w-[240px] flex-1 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
          We keep watch. Updates, fixes, and improvements on a simple monthly plan — whenever you
          need them, for as long as you need them.
        </p>
      </div>
    </section>
  )
}
