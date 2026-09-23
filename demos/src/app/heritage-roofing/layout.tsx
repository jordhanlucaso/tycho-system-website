import type { Metadata } from "next";
import "./heritage-roofing.css";
import { HR_SCOPE } from "./fonts";
import { DemoProvider } from "@/components/demo/DemoLayer";
import Footer from "@/components/heritage-roofing/Footer";
import Header from "@/components/heritage-roofing/Header";
import JsonLd from "@/components/heritage-roofing/JsonLd";
import MobileActionBar from "@/components/heritage-roofing/MobileActionBar";
import { siteConfig } from "@/data/heritage-roofing";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.businessName} — Roofing Contractor in ${siteConfig.city}, ${siteConfig.stateCode}`,
    template: "%s",
  },
  description: `Residential and commercial roofing, roof repair, replacement, gutters and siding in ${siteConfig.serviceArea}.`,
  alternates: { canonical: absoluteUrl("/heritage-roofing") },
};

/**
 * Client layout, not a root layout. `.hr` is the scope every rule in heritage-roofing.css
 * hangs off, and the five brand systems on this host would overwrite each other's base
 * rules without it. Chrome lives here rather than in the pages so the ten routes cannot
 * drift; the header reads the active route from the router.
 *
 * `lang="en"` because the root layout declares nb-NO for the Norwegian concepts. Without
 * it a screen reader pronounces "Request an Estimate" with Norwegian phonemes.
 *
 * JSON-LD is emitted here, once per page. It carries only what the public record supports —
 * see components/heritage-roofing/JsonLd.tsx for what it deliberately leaves out, which is
 * most of what a roofing site normally claims.
 */
export default function HeritageRoofingLayout({ children }: LayoutProps<"/heritage-roofing">) {
  return (
    <div lang="en" className={HR_SCOPE}>
      <DemoProvider lang="en">
        <JsonLd />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
        <main id="main" className="pb-[58px] lg:pb-0">
          {children}
        </main>
        <Footer config={siteConfig} />
        <MobileActionBar phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
      </DemoProvider>
    </div>
  );
}
