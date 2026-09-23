import Contact from "@/components/calloway-roofing/Contact";
import { siteConfig } from "@/data/calloway-roofing";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Contact — ${siteConfig.businessName}`,
  description: `Request a free roof estimate from ${siteConfig.businessName} in ${siteConfig.city}. Call ${siteConfig.phone} or send the form — written estimate within one business day.`,
  path: "/calloway-roofing/contact",
  siteName: siteConfig.businessName,
});

export default function CallowayRoofingContact() {
  const c = siteConfig;

  return (
    <>
      <Contact
        as="h1"
        businessName={c.businessName}
        city={c.city}
        phone={c.phone}
        email={c.email}
        licenseNumber={c.licenseNumber}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: c.businessName, path: "/calloway-roofing" },
              { name: "Contact", path: "/calloway-roofing/contact" },
            ]),
          ),
        }}
      />
    </>
  );
}
