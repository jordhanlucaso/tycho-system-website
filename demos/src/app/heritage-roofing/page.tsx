import { pageMetadata } from "@/lib/seo";
import CTA from "@/components/heritage-roofing/CTA";
import FAQ from "@/components/heritage-roofing/FAQ";
import Hero from "@/components/heritage-roofing/Hero";
import LocalSection from "@/components/heritage-roofing/LocalSection";
import MoreThanRoofing from "@/components/heritage-roofing/MoreThanRoofing";
import { Section } from "@/components/heritage-roofing/Primitives";
import ProblemSelector from "@/components/heritage-roofing/ProblemSelector";
import Process from "@/components/heritage-roofing/Process";
import ProjectGallery from "@/components/heritage-roofing/ProjectGallery";
import Reviews from "@/components/heritage-roofing/Reviews";
import ServiceGrid from "@/components/heritage-roofing/ServiceGrid";
import TrustSection from "@/components/heritage-roofing/TrustSection";
import {
  faqs,
  gallerySlots,
  heroTrust,
  pillars,
  problems,
  process,
  services,
  siteConfig,
} from "@/data/heritage-roofing";

export const metadata = pageMetadata({
  title: "Heritage Roofing | Roofing Contractor in Montgomery, AL",
  description:
    "Heritage Roofing provides residential and commercial roofing, roof repair, replacement, gutters and siding services in Montgomery and the surrounding River Region.",
  path: "/heritage-roofing",
  siteName: "Heritage Roofing",
});

/**
 * The home page carries the whole argument, in the order a worried homeowner needs it:
 * what this is and where → what is wrong with my roof → what that costs me to ignore →
 * who these people are → what happens next → ask.
 *
 * The estimate CTA appears four times on the way down (hero, mid-page band, gallery
 * follow-through, footer) because the moment someone decides to act is unpredictable and
 * scrolling back up to find a button is friction that loses the lead.
 */
export default function HomePage() {

  return (
    <>
      <Hero
        phone={siteConfig.phone}
        phoneHref={siteConfig.phoneHref}
        city={siteConfig.city}
        since={siteConfig.since}
        trust={heroTrust}
      />

      <div className="bg-hr-paper">
        <ProblemSelector problems={problems} />
      </div>

      <Section tone="paper-alt">
        <ServiceGrid services={services} />
        <div className="mt-16">
          <MoreThanRoofing extendedName={siteConfig.extendedName} />
        </div>
      </Section>

      <Section tone="slate">
        <TrustSection pillars={pillars} />
      </Section>

      <Section tone="paper">
        <Process steps={process} />
      </Section>

      <Section tone="green">
        <CTA phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
      </Section>

      <Section tone="paper">
        <ProjectGallery slots={gallerySlots} />
      </Section>

      <Section tone="paper-alt">
        <Reviews />
      </Section>

      <Section tone="slate">
        <LocalSection serviceArea={siteConfig.serviceArea} />
      </Section>

      <Section tone="paper">
        <FAQ faqs={faqs} />
      </Section>
    </>
  );
}
