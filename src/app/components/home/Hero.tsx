import { Button } from '../ui/Button'
import { PillBadge } from '../ui/PillBadge'
import { Starfield, type StarfieldDensity } from './Starfield'
import { HeroVisual, type HeroVisualVariant } from './HeroVisual'

type HeroProps = {
  heroVisual?: HeroVisualVariant
  starfield?: StarfieldDensity
  /** Master motion switch — false pauses starfield twinkle + orbital float. */
  animate?: boolean
}

const ribbon: Array<{ label: string; gold?: boolean }> = [
  { label: 'Discovery' },
  { label: 'Design' },
  { label: 'Build' },
  { label: 'Launch' },
  { label: 'Care', gold: true },
]

/**
 * Hero: a night-sky scene with a twinkling starfield, an azure top-glow, the
 * headline + CTAs on the left, and the orbital instrument on the right. A
 * full-width process ribbon sits below.
 */
export function Hero({ heroVisual = '3D solar system', starfield = 'Balanced', animate = true }: HeroProps) {
  return (
    <section id="top" className="relative">
      <Starfield density={starfield} animate={animate} />
      {/* azure top-glow */}
      <div
        aria-hidden="true"
        className="obs-glow pointer-events-none absolute left-1/2 top-[-160px] z-0 h-[520px] w-[900px] -translate-x-1/2"
      />

      <div className="relative z-[2] mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-center gap-[clamp(40px,6vw,72px)] px-[clamp(20px,6vw,80px)] pb-[clamp(40px,6vw,72px)] pt-[clamp(56px,9vw,108px)]">
        <div>
          <PillBadge dot>Tycho Systems · Web Observatory</PillBadge>
          <h1 className="mt-[22px] text-balance font-display text-[clamp(40px,6.2vw,76px)] font-semibold leading-[1.02] tracking-[-0.025em] text-[var(--text-primary)]">
            Websites, charted
            <br />
            with precision.
          </h1>
          <p className="mt-[22px] max-w-[520px] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-[var(--text-body)]">
            We build modern websites — and the AI agents that run on them — for local businesses,
            mapped from first discovery to launch and watched over on every orbit after.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#contact" variant="primary" arrow>
              Start a project
            </Button>
            <Button href="#work" variant="secondary">
              See the work
            </Button>
          </div>
        </div>

        <div
          className="flex min-h-[440px] items-center justify-center motion-safe:[animation:tycho-float_7s_ease-in-out_infinite]"
        >
          <HeroVisual variant={heroVisual} />
        </div>
      </div>

      {/* process ribbon */}
      <div
        className="relative z-[2] border-y border-[var(--border-primary)]"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-[18px] gap-y-[10px] px-[clamp(20px,6vw,80px)] py-[18px] font-mono text-[12.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
          {ribbon.map((item, i) => (
            <span key={item.label} className="flex items-center gap-x-[18px]">
              <span style={{ color: item.gold ? 'var(--gold)' : 'var(--text-muted)' }}>{item.label}</span>
              {i < ribbon.length - 1 && <span aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
