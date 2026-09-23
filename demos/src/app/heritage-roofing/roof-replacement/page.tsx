import { pageMetadata } from "@/lib/seo";
import ServicePage from "@/components/heritage-roofing/ServicePage";
import { faqsFor, services, siteConfig } from "@/data/heritage-roofing";

const service = services.find((s) => s.slug === "roof-replacement")!;

export const metadata = pageMetadata({
  title: "Roof Replacement in Montgomery, AL | Heritage Roofing",
  description:
    "Roof replacement for homes and businesses in Montgomery and the River Region, with your options explained before anything starts. Call (334) 354-8650.",
  path: "/heritage-roofing/roof-replacement",
  siteName: "Heritage Roofing",
});

export default function RoofReplacementPage() {

  return (
    <ServicePage
      service={service}
      intro="Replacing a roof is one of the larger things a homeowner pays for, and it is the one they can see least of. So the useful conversation happens before the decision: what the current roof is doing, whether a repair would genuinely hold, and what each option involves."
      signsTitle="Signs a repair may not be enough"
      signs={[
        "Wear spread across several planes rather than one area",
        "A roof at or near the end of its expected life",
        "Bald patches where the surface granules have gone",
        "Shingles that crack or crumble when handled",
        "Repeated repairs in different places each year",
        "Sagging along a ridge or between rafters",
      ]}
      faqs={faqsFor("repair-or-replace", "signs", "estimate")}
      phone={siteConfig.phone}
      phoneHref={siteConfig.phoneHref}
    />
  );
}
