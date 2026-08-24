import { business } from "@/data/marine";
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
   MARINE MAX

   Same rules as above, plus two the marine engagement adds because so little about the
   business is verified:
     - Never emit `openingHoursSpecification`. Hours are TO_CONFIRM, and a wrong hour sends
       a customer to a closed workshop.
     - Never emit `hasCredential` or `brand`. Authorised-dealer status and supported engine
       brands are exactly the claims a competitor would check first.
   ═══════════════════════════════════════════════════════════════════════════════════════ */

export const MM_ID = `${absoluteUrl("/marine-max")}#business`;

/**
 * `ProfessionalService`, not `Store` (no verified retail premises) and not `AutoRepair`
 * (that type is for road vehicles). It is the honest supertype for a boat workshop.
 */
export function businessJsonLd() {
  return pruneUnconfirmed({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": MM_ID,
    /**
     * The trading name, not the registered one. For an enkeltpersonforetak the registered
     * name is the owner's personal name, and emitting it here would publish it in
     * view-source on every page even though it appears nowhere in the design.
     *
     * Nothing is lost for entity matching: `identifier` below is the organisasjonsnummer,
     * which resolves to the same registry record and is the stronger signal anyway.
     */
    name: `${business.displayName} ${business.descriptor}`,
    url: absoluteUrl("/marine-max"),
    telephone: business.phoneE164,
    // Organisasjonsnummer: a uniquely Norwegian, machine-checkable entity signal.
    identifier: business.orgNumber.replace(/\s/g, ""),
    // Verified against Enhetsregisteret and stated visibly on the page.
    foundingDate: business.registeredSince,
    knowsLanguage: "no",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.locality,
      addressRegion: business.address.municipality,
      addressCountry: business.address.country,
    },
    areaServed: business.areaServed.map((name) => ({ "@type": "Place", name })),
  });
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/marine-max")}#website`,
    url: absoluteUrl("/marine-max"),
    name: `${business.displayName} ${business.descriptor}`,
    inLanguage: "nb-NO",
    publisher: { "@id": MM_ID },
  };
}

/** Distinct from the studio `serviceJsonLd` above: the provider is a person, not a studio. */
export function mmServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: { "@id": MM_ID },
    areaServed: business.areaServed.map((n) => ({ "@type": "Place", name: n })),
  };
}
