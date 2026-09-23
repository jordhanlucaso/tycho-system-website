import { pageMetadata } from "@/lib/seo";
import ServicePage from "@/components/heritage-roofing/ServicePage";
import { faqsFor, services, siteConfig } from "@/data/heritage-roofing";

const service = services.find((s) => s.slug === "gutters")!;

export const metadata = pageMetadata({
  title: "Gutters in Montgomery, AL | Heritage Roofing",
  description:
    "Gutter installation and repair in Montgomery and the River Region, getting roof water away from the property instead of into it. Call (334) 354-8650.",
  path: "/heritage-roofing/gutters",
  siteName: "Heritage Roofing",
});

export default function GuttersPage() {

  return (
    <ServicePage
      service={service}
      intro="Gutters exist to put roof water somewhere other than against the building. When they stop doing that, the damage shows up slowly and a long way from the gutter — in the fascia, underneath the property, or the ground at the foundation."
      signsTitle="Signs the gutters need attention"
      signs={[
        "Water sheeting over the edge in heavy rain",
        "Gutters pulling away from the fascia board",
        "Staining or rot on the boards behind the gutter",
        "Soil washed out or trenched below the roofline",
        "Damp in a crawl space or basement after storms",
        "Downspouts emptying beside the foundation",
      ]}
      faqs={faqsFor("gutters", "signs", "estimate")}
      phone={siteConfig.phone}
      phoneHref={siteConfig.phoneHref}
    />
  );
}
