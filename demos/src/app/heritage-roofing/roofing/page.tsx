import { pageMetadata } from "@/lib/seo";
import CTA from "@/components/heritage-roofing/CTA";
import FAQ from "@/components/heritage-roofing/FAQ";
import { Button, Section } from "@/components/heritage-roofing/Primitives";
import ProjectGallery from "@/components/heritage-roofing/ProjectGallery";
import ServiceGrid from "@/components/heritage-roofing/ServiceGrid";
import Process from "@/components/heritage-roofing/Process";
import { faqs, gallerySlots, process, services, siteConfig } from "@/data/heritage-roofing";

/** The overview page the nav's "Roofing" item points at — the hub above the three details. */
export const metadata = pageMetadata({
  title: "Residential Roofing in Montgomery, AL | Heritage Roofing",
  description:
    "Residential roofing across Montgomery and the River Region — repairs, replacements and storm damage. Serving Central Alabama since 2010. Call (334) 354-8650.",
  path: "/heritage-roofing/roofing",
  siteName: "Heritage Roofing",
});

export default function RoofingPage() {

  return (
    <>
      <section className="hr-dark hr-shingles bg-hr-slate">
        <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
          <div className="max-w-[44rem]">
            <p className="hr-eyebrow">Montgomery, Alabama</p>
            <h1 className="mt-5 font-hr-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-extrabold text-white">
              Residential roofing in Montgomery
            </h1>
            <p className="mt-5 max-w-[36rem] text-[1.04rem] leading-relaxed text-hr-muted">
              Roofing, gutter and siding work for homes across Montgomery and the
              surrounding River Region. Start wherever your problem is — or call and
              describe it, and we will work out which of these it turns out to be.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/heritage-roofing/estimate">Get a Free Estimate</Button>
              <Button href={`tel:${siteConfig.phoneHref}`} variant="outline-dark">
                <span className="hr-tel">Call {siteConfig.phone}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper">
        <ServiceGrid services={services} />
      </Section>

      <Section tone="paper-alt">
        <Process steps={process} />
      </Section>

      <Section tone="green">
        <CTA phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
      </Section>

      <Section tone="paper">
        <ProjectGallery slots={gallerySlots} />
      </Section>

      <Section tone="paper-alt">
        <FAQ faqs={faqs} />
      </Section>
    </>
  );
}
