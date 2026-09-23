import { DemoNote } from "@/components/demo/DemoLayer";
import type { GallerySlot } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";

/**
 * Work gallery — built as open slots, not as a portfolio.
 *
 * There are no verified photographs of this company's work. Rather than dress a stock roof
 * up as theirs, each card is an empty frame that states the photograph belonging in it and
 * carries a visible "Placeholder" chip.
 *
 * This is also the better sales artefact: it shows the owner the exact shot list, which is
 * a thing they can act on, rather than three stock roofs they will assume are someone
 * else's. When the real photographs arrive, drop `placeholder` in the data module and
 * delete the chip.
 */
export default function ProjectGallery({ slots }: { slots: GallerySlot[] }) {
  return (
    <>
      <div className="max-w-[44rem]">
        <Eyebrow>Recent work</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)]">Your work, not a stock photo</h2>
        <p className="mt-3 text-hr-ink-soft">
          These three frames are placeholders, and they are captioned with the photograph
          that belongs in each one. Nothing here is presented as a Heritage Roofing project.
          <DemoNote id="hr.07" />
        </p>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <li key={slot.id} className="hr-placeholder border border-hr-hairline bg-white">
            {/* An empty frame drawn as an empty frame. A stock roof here would be a
                claim about a house this company worked on; a grey box with the shot
                written on it is a work order. */}
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-hr-hairline bg-hr-paper-alt">
              <svg
                viewBox="0 0 120 60"
                className="w-1/2 text-hr-brass/45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 34 60 6l54 28" />
                <path d="M18 41 60 20l42 21" />
                <path d="M30 48 60 34l30 14" />
              </svg>
              <span className="absolute left-0 top-0 bg-hr-slate px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white">
                Placeholder
              </span>
            </div>
            <div className="p-5">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-hr-brass-ink">
                {slot.category}
              </span>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-hr-ink-soft">{slot.brief}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
