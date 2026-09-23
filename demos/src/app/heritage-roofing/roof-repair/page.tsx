import { pageMetadata } from "@/lib/seo";
import ServicePage from "@/components/heritage-roofing/ServicePage";
import { faqsFor, services, siteConfig } from "@/data/heritage-roofing";

const service = services.find((s) => s.slug === "roof-repair")!;

export const metadata = pageMetadata({
  title: "Roof Repair in Montgomery, AL | Heritage Roofing",
  description:
    "Roof leak repair across Montgomery and the River Region — tracing water back to its source and fixing the cause, not the stain. Call (334) 354-8650.",
  path: "/heritage-roofing/roof-repair",
  siteName: "Heritage Roofing",
});

export default function RoofRepairPage() {

  return (
    <ServicePage
      service={service}
      intro="A leak almost never starts where the stain appears. Water travels along decking and rafters before it finds a way through a ceiling, so the first job is working out where it is actually getting in."
      signsTitle="Signs you need a repair"
      signs={[
        "A stain on a ceiling or wall that grows after rain",
        "Shingles missing, lifted, curled or cracked",
        "Granules collecting in the gutters or at the downspout",
        "Damp, daylight or visible drips in the attic",
        "Flashing pulled away from a chimney, vent or skylight",
        "Water only appearing in certain wind directions",
      ]}
      faqs={faqsFor("repair-or-replace", "leaking", "after-storm", "signs")}
      phone={siteConfig.phone}
      phoneHref={siteConfig.phoneHref}
    />
  );
}
