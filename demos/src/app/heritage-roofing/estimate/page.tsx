import { pageMetadata } from "@/lib/seo";
import { DemoNote } from "@/components/demo/DemoLayer";
import EstimateForm from "@/components/heritage-roofing/EstimateForm";
import { Eyebrow, Section } from "@/components/heritage-roofing/Primitives";
import Icon from "@/components/heritage-roofing/Icon";
import { estimateTopics, process, siteConfig } from "@/data/heritage-roofing";

export const metadata = pageMetadata({
  title: "Request an Estimate | Heritage Roofing, Montgomery AL",
  description:
    "Tell us what your roof needs and get an estimate. Residential and commercial roofing, repairs, replacement, gutters and siding in Montgomery, AL.",
  path: "/heritage-roofing/estimate",
  siteName: "Heritage Roofing",
});

/**
 * The conversion page. Every CTA on the site lands here.
 *
 * The form sits in the left, wider column and above the fold on a phone — nothing is
 * stacked in front of it. The right column carries only what reduces hesitation: the phone
 * number for people who would rather talk, and the four steps so nobody wonders what
 * happens after they press the button.
 */
export default function EstimatePage() {

  return (
    <Section tone="paper-alt" className="pt-28 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Free estimate</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,4.6vw,2.8rem)]">Request an estimate</h1>
          <p className="mt-4 max-w-[34rem] text-hr-ink-soft">
            Tell us what&rsquo;s happening. You do not need to know what is wrong — that is
            what the estimate is for.
            <DemoNote id="hr.15" />
          </p>

          <div className="mt-9">
            <EstimateForm topics={estimateTopics} />
          </div>
        </div>

        <aside className="lg:pt-2">
          <div className="bg-hr-slate p-7 text-white hr-dark">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-hr-brass-glow">
              Rather talk?
            </p>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="hr-tel mt-3 block font-hr-display text-[1.75rem] font-extrabold text-white"
            >
              {siteConfig.phone}
            </a>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-hr-muted">
              If there is water coming in right now, calling is faster than a form.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-hr-display text-[1.05rem] font-bold text-hr-ink">
              What happens next
            </h2>
            <ol className="mt-5 space-y-5">
              {process.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center bg-hr-paper text-[0.74rem] font-bold text-hr-brass-ink">
                    {step.n}
                  </span>
                  <span>
                    <span className="block font-hr-display text-[0.98rem] font-bold text-hr-ink">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-[0.9rem] leading-relaxed text-hr-ink-soft">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 flex gap-3 border-t border-hr-hairline pt-6 text-[0.88rem] leading-relaxed text-hr-ink-soft">
            <span className="mt-0.5 flex-none text-hr-brass-ink">
              <Icon name="shield" className="h-5 w-5" />
            </span>
            Your details are not sent anywhere from this concept site. Nothing is stored.
          </p>
        </aside>
      </div>
    </Section>
  );
}
