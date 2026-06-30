import { SectionLabel } from '../ui/SectionLabel'
import { ServiceCard } from '../ui/ServiceCard'

/** Small constellation mark for the AI-agents card (gold "star" + azure nodes). */
function ConstellationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <line x1="4" y1="14.5" x2="10" y2="5" stroke="var(--azure)" strokeWidth="1" />
      <line x1="10" y1="5" x2="16" y2="11" stroke="var(--azure)" strokeWidth="1" />
      <line x1="10" y1="5" x2="13" y2="15.5" stroke="var(--azure)" strokeWidth="1" opacity="0.5" />
      <circle cx="4" cy="14.5" r="1.6" fill="var(--azure)" />
      <circle cx="16" cy="11" r="1.6" fill="var(--azure)" />
      <circle cx="13" cy="15.5" r="1.5" fill="var(--azure)" />
      <circle cx="10" cy="5" r="2.1" fill="var(--gold)" />
    </svg>
  )
}

/**
 * What we build: five service cards. The AI-agents card is flagged with an
 * accent background, a "New" pill, and the constellation icon — emphasized but
 * still within the azure system (no second gold accent).
 */
export function Services() {
  return (
    <section
      id="services"
      className="border-t border-[var(--border-primary)]"
      style={{ background: 'rgba(255,255,255,0.012)' }}
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]">
        <SectionLabel className="mb-[14px]">What we build</SectionLabel>
        <h2 className="m-0 mb-[clamp(32px,4vw,52px)] max-w-[680px] font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)]">
          Everything a small business needs to look like a big one.
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]">
          <ServiceCard
            icon="+"
            title="New websites"
            description="A modern site built from scratch around your goals and your customers."
          />
          <ServiceCard
            icon="↺"
            title="Redesigns"
            description="A faster, sharper version of the site you already have — without the headache."
          />
          <ServiceCard
            icon={<ConstellationIcon />}
            title="AI agents"
            description="Smart assistants that answer questions, book appointments, and follow up with customers — on your site, around the clock."
            accent
            isNew
          />
          <ServiceCard
            icon="★"
            tone="gold"
            title="Personal & portfolio"
            description="For individuals and creators, not just businesses — a home for your name online."
          />
          <ServiceCard
            icon="↻"
            title="Ongoing care"
            description="Hosting, updates, and support so your site never goes stale or breaks quietly."
          />
        </div>
      </div>
    </section>
  )
}
