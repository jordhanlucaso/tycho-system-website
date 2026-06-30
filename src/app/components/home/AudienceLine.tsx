/**
 * A single large statement marking the small-business → private-consumer
 * transition. Primary text leads, muted text continues.
 */
export function AudienceLine() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] pb-[clamp(8px,2vw,16px)] pt-[clamp(56px,8vw,96px)]">
      <p className="m-0 max-w-[840px] text-balance font-display text-[clamp(20px,2.6vw,30px)] font-normal leading-[1.45] tracking-[-0.01em] text-[var(--text-secondary)]">
        Built for the businesses that hold a neighborhood together —
        <span className="text-[var(--text-faint)]">
          {' '}
          restaurants, trades, studios, clinics, shops — and increasingly, the people behind them.
        </span>
      </p>
    </section>
  )
}
