import { ResourceSelector } from '../resources/ResourceSelector'

/** Homepage wrapper for the lead-magnet selector section. */
export function GuideSelector() {
  return (
    <section
      id="resources"
      className="border-t border-[var(--border-primary)]"
      style={{ background: 'rgba(255,255,255,0.012)' }}
    >
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]">
        <ResourceSelector context="home" />
      </div>
    </section>
  )
}
