import { pageMetadata } from "@/lib/seo";
import { DemoNote } from "@/components/demo/DemoLayer";
import CTA from "@/components/heritage-roofing/CTA";
import { Eyebrow, Section } from "@/components/heritage-roofing/Primitives";
import { siteConfig } from "@/data/heritage-roofing";

export const metadata = pageMetadata({
  title: "About | Heritage Roofing, Montgomery AL",
  description:
    "Heritage Roofing and Construction has served Central Alabama since 2010. Led by owner Justin Spivey, serving Montgomery and the River Region.",
  path: "/heritage-roofing/about",
  siteName: "Heritage Roofing",
});

/**
 * Deliberately the shortest page on the site.
 *
 * What is verified is a founding year, an owner's name, a licence number and a set of
 * services. That is a fact sheet, not a story. Rather than invent a biography, a military
 * record or a family line — all of which a roofing "about" page normally carries — this
 * page states what is true and shows the owner exactly where his own account will sit.
 * The three empty frames are the pitch: they are a question, not a placeholder.
 *
 * No portrait. There is no verified photograph of Justin Spivey, and a stock headshot
 * presented as the owner is the most straightforwardly dishonest thing a page like this
 * can do.
 */
export default function AboutPage() {

  return (
    <>
      <Section tone="paper" className="pt-28 sm:pt-32">
        <div className="max-w-[44rem]">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)]">Serving Central Alabama since 2010</h1>
          <p className="mt-5 text-[1.06rem] leading-relaxed text-hr-ink-soft">
            {siteConfig.extendedName} has served homeowners and property owners across
            Central Alabama since {siteConfig.since}. Led by owner {siteConfig.owner}, the
            company provides residential and commercial roofing along with gutter, siding
            and construction services throughout the {siteConfig.region}.
            <DemoNote id="hr.14" />
          </p>
          <p className="mt-4 leading-relaxed text-hr-ink-soft">
            That is the whole of what this page claims today, and it is deliberate. The rest
            of the story — why roofing, how the business has changed since {siteConfig.since},
            who turns up on the day — belongs to Heritage to tell, not to us to write.
          </p>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-hr-ink-soft">
            {siteConfig.license.authority} · License #{siteConfig.license.number}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {[
            {
              t: "Justin's story",
              b: "Why roofing, and what the business set out to do in 2010. The single most-read paragraph on any contractor's site — and the one only he can write.",
            },
            {
              t: "How the work is run",
              b: "Own crews or subcontractors, how a job is scheduled, who the customer actually speaks to.",
            },
            {
              t: "The crew, photographed",
              b: "A picture of the people who turn up on the day. Worth more than any other image on the site.",
            },
          ].map((slot) => (
            <div key={slot.t} className="border border-dashed border-hr-hairline bg-white p-6">
              <h2 className="font-hr-display text-[1.05rem] font-bold text-hr-ink">{slot.t}</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-hr-ink-soft">{slot.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="green">
        <CTA phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
      </Section>
    </>
  );
}
