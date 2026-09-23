import { siteConfig } from "@/data/heritage-roofing";

/**
 * Structured data for Heritage Roofing.
 *
 * The site is noindex, so this is not here for search visibility — it is here so the
 * markup is already correct on the day the demo becomes a real site on a real domain.
 * That is also why it is written conservatively: every property below is in the public
 * record, and the ones that usually get faked are simply absent.
 *
 * Deliberately NOT emitted:
 *   address       public records disagree (Brevard Ave vs Millbrook vs a PO box), and a
 *                 wrong address in machine-readable form is worse than no address
 *   email         none verified
 *   url           no verified official domain; the Tycho demo URL is not Heritage's
 *   openingHours  a listing reports them, but hours change and none is confirmed
 *   aggregateRating / review    the listing has very few reviews and none is attributable
 *   award, brand, hasCredential  nothing verified
 *
 * The earlier version of this demo emitted nothing at all, because the business identity
 * itself was unverified. It is verified now, so the block exists.
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: siteConfig.businessName,
    alternateName: siteConfig.extendedName,
    telephone: `+1${siteConfig.phoneHref.replace(/\D/g, "").replace(/^1/, "")}`,
    foundingDate: String(siteConfig.since),
    founder: { "@type": "Person", name: siteConfig.owner },
    areaServed: [
      { "@type": "City", name: `${siteConfig.city}, ${siteConfig.state}` },
      { "@type": "AdministrativeArea", name: `${siteConfig.region}, ${siteConfig.state}` },
    ],
    knowsAbout: [
      "Residential roofing",
      "Commercial roofing",
      "Roof repair",
      "Roof replacement",
      "Gutters",
      "Siding",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Static, author-controlled object — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
