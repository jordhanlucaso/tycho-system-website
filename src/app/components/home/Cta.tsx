import { site } from '../../../config/site'
import { Button } from '../ui/Button'
import { SectionLabel } from '../ui/SectionLabel'

/**
 * Closing call to action: centered copy over a bottom azure glow, with a
 * primary "Start a project" mailto button and a mono outline button surfacing
 * the contact email.
 */
export function Cta() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="obs-glow pointer-events-none absolute bottom-[-200px] left-1/2 h-[480px] w-[760px] -translate-x-1/2"
      />
      <div className="relative mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(72px,10vw,140px)] text-center">
        <SectionLabel className="mb-5">Set a course</SectionLabel>
        <h2 className="mx-auto m-0 max-w-[760px] text-balance font-display text-[clamp(32px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--text-primary)]">
          Ready to put your business on the map?
        </h2>
        <p className="mx-auto mt-[22px] max-w-[520px] text-[clamp(16px,1.4vw,18px)] leading-[1.6] text-[var(--text-body)]">
          Tell us where you are and where you want to be. We'll chart the route from there.
        </p>
        <div className="mt-[34px] flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${site.email}`} variant="primary" arrow className="px-[26px] py-[14px]">
            Start a project
          </Button>
          <Button
            href={`mailto:${site.email}`}
            variant="secondary"
            mono
            className="px-[22px] py-[14px]"
          >
            {site.email}
          </Button>
        </div>
      </div>
    </section>
  )
}
