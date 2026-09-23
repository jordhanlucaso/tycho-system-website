import { confirmed, isConfirmed, pruneUnconfirmed, type FaqItem, type StudioProfile } from "@/data/types";
import { absoluteUrl } from "./site";

/**
 * Structured data assembly.
 *
 * Hard rules enforced here (see .claude/skills/local-business-seo/SKILL.md §5):
 *  - No unconfirmed value ever reaches the output. `pruneUnconfirmed` drops the key entirely
 *    rather than emitting `"TO_CONFIRM"` or an empty string.
 *  - No `aggregateRating` / `review`. Both studios' ratings live on Google, are not hosted
 *    by us, and self-serving review markup for third-party reviews is a manual-action risk.
 *  - No `priceRange`, `foundingDate`, `award` or `numberOfEmployees` — all TO_CONFIRM.
 *  - Every emitted claim is also visible on the page.
 */

export function studioJsonLd(studio: StudioProfile) {
  const base = absoluteUrl(`/${studio.slug}`);
  const sameAs = [confirmed(studio.instagram), confirmed(studio.facebook)].filter(
    (v): v is string => typeof v === "string",
  );

  return pruneUnconfirmed({
    "@context": "https://schema.org",
    "@type": studio.schemaType,
    "@id": `${base}#studio`,
    name: studio.name,
    url: base,
    telephone: confirmed(studio.phone),
    email: confirmed(studio.email),
    address: {
      "@type": "PostalAddress",
      streetAddress: studio.address.streetAddress,
      postalCode: studio.address.postalCode,
      addressLocality: studio.address.addressLocality,
      addressRegion: studio.address.addressRegion,
      addressCountry: studio.address.addressCountry,
    },
    areaServed: studio.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: isConfirmed(studio.hours)
      ? studio.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });
}

export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * FAQPage markup — only valid when the Q&A is genuinely rendered on the page.
 * Answers flagged `demo: true` are illustrative copy awaiting client approval and are
 * excluded, so we never publish structured data the client has not stood behind.
 */
export function faqJsonLd(items: readonly FaqItem[]) {
  const publishable = items.filter((item) => !item.demo);
  if (publishable.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishable.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceJsonLd(input: {
  studio: StudioProfile;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    serviceType: input.name,
    provider: { "@id": `${absoluteUrl(`/${input.studio.slug}`)}#studio` },
    areaServed: input.studio.areaServed.map((name) => ({ "@type": "City", name })),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════
   CALLOWAY ROOFING

   Built from the template's config so the structured data cannot drift from the page.

   Deliberately missing: `aggregateRating` and `address`. A rating invented in a template
   is a structured-data violation, and a street address that is not the client's real one
   is worse than none — both arrive in a client build, once they are real.
   ═══════════════════════════════════════════════════════════════════════════════════════ */

export function roofingContractorJsonLd(config: {
  businessName: string;
  city: string;
  phone: string;
  email: string;
  tagline: string;
  licenseNumber: string;
  yearsInBusiness: number;
  hero: { image: string };
  services: readonly { title: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${absoluteUrl("/calloway-roofing")}#business`,
    name: config.businessName,
    description: `Roof replacement, repair, storm damage and metal roofing in ${config.city}.`,
    url: absoluteUrl("/calloway-roofing"),
    telephone: config.phone,
    email: config.email,
    image: absoluteUrl(config.hero.image),
    areaServed: { "@type": "City", name: config.city },
    foundingDate: String(new Date().getFullYear() - config.yearsInBusiness),
    knowsAbout: config.services.map((service) => service.title),
    slogan: config.tagline,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Contractor license",
      value: config.licenseNumber,
    },
  };
}
