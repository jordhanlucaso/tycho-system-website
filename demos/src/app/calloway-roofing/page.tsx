import { DemoNote } from "@/components/demo/DemoLayer";
import About from "@/components/calloway-roofing/About";
import Contact from "@/components/calloway-roofing/Contact";
import Hero from "@/components/calloway-roofing/Hero";
import InspectionBar from "@/components/calloway-roofing/InspectionBar";
import Projects from "@/components/calloway-roofing/Projects";
import Services from "@/components/calloway-roofing/Services";
import Stats from "@/components/calloway-roofing/Stats";
import Testimonial from "@/components/calloway-roofing/Testimonial";
import { siteConfig } from "@/data/calloway-roofing";
import { pageMetadata } from "@/lib/seo";
import { roofingContractorJsonLd } from "@/lib/jsonld";

export const metadata = pageMetadata({
  title: `${siteConfig.businessName} — Roofing Contractor in ${siteConfig.city}`,
  description: `Roof replacement, repair, storm damage and metal roofing across ${siteConfig.city}. Licensed and insured, ${siteConfig.yearsInBusiness} years, written estimates in 24 hours.`,
  path: "/calloway-roofing",
  siteName: siteConfig.businessName,
});

/**
 * The only file that sees the whole config — every section below takes its own slice as
 * props. That is what lets the same components render a different client's site with no
 * edit anywhere but the data module.
 */
export default function CallowayRoofingFront() {
  const c = siteConfig;

  return (
    <>
      <Hero hero={c.hero} phone={c.phone} city={c.city} />
      <DemoNote id="cr.01" />
      <InspectionBar />
      <DemoNote id="cr.02" />
      <Services services={c.services} />
      <DemoNote id="cr.03" />
      <About about={c.about} businessName={c.businessName} />
      <Stats stats={c.stats} yearsInBusiness={c.yearsInBusiness} />
      <Projects projects={c.projects} city={c.city} />
      <Testimonial testimonial={c.testimonial} city={c.city} />
      <DemoNote id="cr.04" />
      <Contact
        businessName={c.businessName}
        city={c.city}
        phone={c.phone}
        email={c.email}
        licenseNumber={c.licenseNumber}
      />
      <DemoNote id="cr.05" />
      <script
        type="application/ld+json"
        // Built from the same config as the page, so the structured data cannot drift
        // from what a visitor reads.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roofingContractorJsonLd(siteConfig)) }}
      />
    </>
  );
}
