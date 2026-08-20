import { processSteps } from '../../../config/site'
import { SectionLabel } from '../ui/SectionLabel'
import { StepCard } from '../ui/StepCard'

/**
 * The process section: a 6-step grid of joined cards (1px gaps over a hairline
 * background). Ongoing ownership after launch gets its own section
 * (AutomationCare), so no care callout here.
 */
export function Process() {
  return (
    <section
      id="process"
      className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]"
    >
      <div className="mb-[clamp(32px,4vw,52px)] flex flex-wrap items-baseline justify-between gap-6">
        <div>
          <SectionLabel className="mb-[14px]">The process · 01–06</SectionLabel>
          <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
            From diagnosis to a working system.
          </h2>
        </div>
        <p className="m-0 max-w-[300px] text-[15px] leading-[1.6] text-[var(--text-muted)]">
          A clear, calm route. You always know where the project is and what happens next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--border-primary)] sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step) => (
          <StepCard key={step.index} {...step} />
        ))}
      </div>
    </section>
  )
}
