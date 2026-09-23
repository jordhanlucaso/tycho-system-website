import { DemoNote } from "@/components/demo/DemoLayer";
import type { Service, Faq } from "@/data/heritage-roofing";
import CTA from "./CTA";
import FAQ from "./FAQ";
import Icon from "./Icon";
import { Button, Eyebrow, Section } from "./Primitives";

/**
 * One shell for the four service routes.
 *
 * Each of these pages exists to hold a distinct search intent — "roof repair Montgomery"
 * and "commercial roofing Montgomery" are different queries with different urgency — so
 * each gets its own title, description and H1 rather than a shared template page with a
 * swapped noun. What is genuinely shared is the shape: what this is, what it covers, what
 * the signs are, and the ask.
 */
export default function ServicePage({
  service,
  intro,
  signsTitle,
  signs,
  faqs,
  phone,
  phoneHref,
}: {
  service: Service;
  intro: string;
  signsTitle: string;
  signs: string[];
  faqs: Faq[];
  phone: string;
  phoneHref: string;
}) {
  return (
    <>
      <section className="hr-dark hr-shingles bg-hr-slate">
        <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
          <div className="max-w-[44rem]">
            <p className="hr-eyebrow">Montgomery, Alabama</p>
            <h1 className="mt-5 font-hr-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-extrabold text-white">
              {service.title} in Montgomery
            </h1>
            <p className="mt-5 max-w-[36rem] text-[1.04rem] leading-relaxed text-hr-muted">
              {intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/heritage-roofing/estimate">Get a Free Estimate</Button>
              <Button href={`tel:${phoneHref}`} variant="outline-dark">
                <span className="hr-tel">Call {phone}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What it covers</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.6rem,3.4vw,2.2rem)]">{service.title}</h2>
            <p className="mt-3 text-hr-ink-soft">{service.body}</p>
            <ul className="mt-7 space-y-3.5">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[0.96rem] text-hr-ink">
                  <span className="mt-1 flex-none text-hr-brass-ink">
                    <Icon name="shingle" className="h-4 w-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t-2 border-hr-brass bg-white p-7 lg:border-t-4">
            <h2 className="font-hr-display text-[1.2rem] font-bold text-hr-ink">{signsTitle}</h2>
            <p className="mt-2 text-[0.92rem] text-hr-ink-soft">
              Any one of these is worth a look. Several together usually means it has been
              going on a while.
              <DemoNote id="hr.13" />
            </p>
            <ul className="mt-5 space-y-3">
              {signs.map((s) => (
                <li key={s} className="flex gap-3 text-[0.94rem] leading-relaxed text-hr-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 flex-none bg-hr-ink-soft/45" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="green">
        <CTA phone={phone} phoneHref={phoneHref} />
      </Section>

      <Section tone="paper">
        <FAQ faqs={faqs} />
      </Section>
    </>
  );
}
