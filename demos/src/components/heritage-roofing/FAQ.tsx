import { DemoNote } from "@/components/demo/DemoLayer";
import type { Faq } from "@/data/heritage-roofing";
import { Eyebrow } from "./Primitives";

/**
 * Native <details>, not a JS accordion: it works before hydration, it is keyboard- and
 * screen-reader-correct for free, and it costs nothing on a phone.
 *
 * Every answer is general homeowner guidance about roofs. None answers a question about
 * *this* company — hours, pricing, warranty, response time — because none of those is
 * known. That is deliberate: an FAQ is where unverified company claims usually slip onto
 * a site, phrased as answers.
 */
export default function FAQ({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <Eyebrow>Questions</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.5rem)]">Common roofing questions</h2>
        <p className="mt-3 text-hr-ink-soft">
          General guidance for homeowners — not a substitute for someone looking at your
          roof.
          <DemoNote id="hr.11" />
        </p>
      </div>

      <div className="hr-faq">
        {faqs.map((f) => (
          <details key={f.q} className="border-b border-hr-hairline">
            <summary className="flex min-h-[64px] items-center justify-between gap-6 py-4 text-left font-hr-display text-[1.02rem] font-bold text-hr-ink">
              {f.q}
              <svg
                viewBox="0 0 24 24"
                className="hr-faq__chev h-5 w-5 flex-none text-hr-ink-soft"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="pb-5 pr-10 text-[0.94rem] leading-relaxed text-hr-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
