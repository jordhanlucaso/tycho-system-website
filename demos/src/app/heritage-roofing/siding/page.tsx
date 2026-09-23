import { pageMetadata } from "@/lib/seo";
import ServicePage from "@/components/heritage-roofing/ServicePage";
import { faqsFor, services, siteConfig } from "@/data/heritage-roofing";

const service = services.find((s) => s.slug === "siding")!;

export const metadata = pageMetadata({
  title: "Siding in Montgomery, AL | Heritage Roofing",
  description:
    "Exterior siding repair and replacement across Montgomery and the River Region, protecting the structure underneath. Call (334) 354-8650.",
  path: "/heritage-roofing/siding",
  siteName: "Heritage Roofing",
});

export default function SidingPage() {

  return (
    <ServicePage
      service={service}
      intro="Siding is the other half of keeping weather out of a building. It takes the same rain and wind the roof does, and when it fails the damage happens behind it — which is why it is usually found late."
      signsTitle="Signs the siding needs attention"
      signs={[
        "Boards that are cracked, warped or coming loose",
        "Soft spots, or damp showing on the inside wall",
        "Paint or finish failing across a whole elevation",
        "Gaps at trim, corners or around windows",
        "Damage after wind or hail",
        "Siding that no longer matches after earlier repairs",
      ]}
      faqs={faqsFor("signs", "gutters", "estimate")}
      phone={siteConfig.phone}
      phoneHref={siteConfig.phoneHref}
    />
  );
}
