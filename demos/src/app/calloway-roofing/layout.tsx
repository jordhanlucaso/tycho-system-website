import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./calloway-roofing.css";
import { CR_SCOPE } from "./fonts";
import { DemoProvider } from "@/components/demo/DemoLayer";
import { accentStyle } from "@/components/calloway-roofing/accent";
import Footer from "@/components/calloway-roofing/Footer";
import Header from "@/components/calloway-roofing/Header";
import UtilityBar from "@/components/calloway-roofing/UtilityBar";
import { siteConfig } from "@/data/calloway-roofing";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.businessName} — Roofing Contractor in ${siteConfig.city}`,
    template: "%s",
  },
  description: `Roof replacement, repair, storm damage and metal roofing in ${siteConfig.city}. Licensed and insured, written estimates in 24 hours.`,
  alternates: { canonical: absoluteUrl("/calloway-roofing") },
};

/**
 * Client layout, not a root layout. `.cr` is the scope every rule in
 * calloway-roofing.css hangs off, and the accent custom properties are set on the same
 * element — in the standalone template they sit on `<html>`, which this host owns.
 *
 * Chrome lives here rather than in the pages, so the two routes cannot drift. The header
 * works out which route it is on from the router.
 */
export default function CallowayRoofingLayout({ children }: LayoutProps<"/calloway-roofing">) {
  return (
    // lang="en" because the root layout declares nb-NO for the Norwegian concepts and
    // this one is English. Without it a screen reader reads "Get a Free Estimate" with
    // Norwegian phonemes.
    <div lang="en" className={CR_SCOPE} style={accentStyle(siteConfig.accent) as CSSProperties}>
      <DemoProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <UtilityBar phone={siteConfig.phone} email={siteConfig.email} />
        <Header
          businessName={siteConfig.businessName}
          tagline={siteConfig.tagline}
          phone={siteConfig.phone}
        />
        <main id="main">{children}</main>
        <Footer
          businessName={siteConfig.businessName}
          licenseNumber={siteConfig.licenseNumber}
          footerLinks={siteConfig.footerLinks}
        />
      </DemoProvider>
    </div>
  );
}
