import { pageMetadata } from "@/lib/seo";
import ServicePage from "@/components/heritage-roofing/ServicePage";
import { faqsFor, services, siteConfig } from "@/data/heritage-roofing";

const service = services.find((s) => s.slug === "commercial-roofing")!;

export const metadata = pageMetadata({
  title: "Commercial Roofing in Montgomery, AL | Heritage Roofing",
  description:
    "Commercial roofing for businesses and property owners in Montgomery and the River Region, staged around the people using the building. Call (334) 354-8650.",
  path: "/heritage-roofing/commercial-roofing",
  siteName: "Heritage Roofing",
});

export default function CommercialRoofingPage() {

  return (
    <ServicePage
      service={service}
      intro="A commercial roof is a building that people need to keep using while the work happens. So the scheduling matters as much as the roofing — when the crew is on site, which areas are affected, and what the building has to carry on doing around them."
      signsTitle="When a commercial roof needs looking at"
      signs={[
        "Ponding water that is still there days after rain",
        "Staining on ceiling tiles or along an interior wall",
        "Seams, flashing or penetrations that have opened up",
        "Damage after a storm, on a roof nobody can see from the ground",
        "A roof approaching the end of its service life",
        "A building changing use or ownership",
      ]}
      faqs={faqsFor("commercial", "repair-or-replace", "estimate")}
      phone={siteConfig.phone}
      phoneHref={siteConfig.phoneHref}
    />
  );
}
