/**
 * A single large statement marking the two audiences the site serves:
 * small-business leaders, and the people learning to work with AI.
 */
export function AudienceLine() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] pb-[clamp(8px,2vw,16px)] pt-[clamp(56px,8vw,96px)]">
      <p className="m-0 max-w-[840px] text-balance font-display text-[clamp(20px,2.6vw,30px)] font-normal leading-[1.45] tracking-[-0.01em] text-[var(--text-secondary)]">
        Built for small businesses that run on people, not platforms —
        <span className="text-[var(--text-faint)]">
          {' '}
          and for the leaders, teams and learners working out what AI should actually do for them.
        </span>
      </p>
    </section>
  )
}
