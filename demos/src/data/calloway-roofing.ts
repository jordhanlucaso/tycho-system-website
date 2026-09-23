/**
 * Calloway Roofing — the white-label roofing template, running on the demo host.
 *
 * Unlike the other concepts here, this one is not a speculative redesign of a real local
 * business. It is a resellable template: `siteConfig` below is the entire client surface,
 * and swapping it re-skins every section, the favicon and the JSON-LD. The demo carries
 * fictional US content (Charlotte, NC) because that is what the template ships with —
 * nothing here is a claim about anyone's actual business.
 *
 * The standalone version lives at ~/code/roofing-template, where the same config drives a
 * second example client and a `/api/lead` route. On this host the forms validate and
 * confirm locally: there is no CRM behind a sales demo. See Forms in the layout.
 */

/* ── The contract ───────────────────────────────────────────────────────────────────
   Nothing in components/calloway-roofing imports this module for its values — each
   section takes its own slice as props, which is what lets one config render a second
   client with no other edit.                                                          */

/** Icons available to service cards. Drawn in `components/Icon.tsx`. */
export type IconName =
  | "shingle"
  | "storm"
  | "repair"
  | "metal"
  | "gutter"
  | "inspection"
  | "siding"
  | "flat";

export type Service = {
  title: string;
  /** Two lines at card width. Roughly 90–140 characters. */
  body: string;
  icon: IconName;
};

export type AboutTab = {
  /** Tab button text, e.g. "Mission". */
  label: string;
  body: string;
  /** Exactly four, rendered as a two-column checklist. */
  points: string[];
};

export type Stat = {
  /**
   * Displayed as written, with one substitution: the token `{years}` becomes
   * `yearsInBusiness`. That keeps the band's four cells declarative while the
   * years cell stays derived from the single number at the top of the config.
   */
  value: string;
  label: string;
};

export type Project = {
  title: string;
  /** One line of specifics under the title — material, size, duration. */
  meta: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  /** Neighbourhood or suburb. Rendered as "Homeowner · {location} · {city}". */
  location: string;
  /** Omit for initials on an accent-tinted circle. */
  avatar?: string;
};

export type SiteConfig = {
  businessName: string;
  /** Small caps under the logo, e.g. "ROOFING & EXTERIORS". */
  tagline: string;
  /** Feeds the hero trust badge, the projects heading and the testimonial byline. */
  city: string;
  phone: string;
  email: string;
  licenseNumber: string;
  yearsInBusiness: number;
  /**
   * The one brand colour. Set on `<html>` as `--accent`; every accent surface in the
   * site reads `var(--accent)`, so changing this hex re-skins buttons, eyebrows, icon
   * chips, stat numbers, tab underlines and the logo mark. Nothing else is themed.
   *
   * Shipped alternatives: "#f5b312" (yellow), "#d92d20" (red), "#2f6fd0" (blue).
   */
  accent: string;
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    image: string;
    /**
     * The frosted pill under the hero CTAs, rendered as "{value} {claim} in {city}".
     * In config because it is a claim about this client's work — a number left hardcoded
     * in the component would follow the template onto the next client's site and be a lie
     * there.
     */
    trust: { value: string; claim: string };
  };
  /** Six. The grid is auto-fit, but six is what the layout is drawn for. */
  services: Service[];
  about: { tabs: AboutTab[]; image: string };
  /** Four. */
  stats: Stat[];
  /** Three. */
  projects: Project[];
  testimonial: Testimonial;
  /**
   * Footer link labels. A label matching a section name links to that section;
   * anything else links to /contact. See `lib/nav.ts`.
   */
  footerLinks: string[];
};

/**
 * The default build. Copy this file per client — the README lists the eight fields that
 * actually have to change. `config/examples/metal-roof-co.ts` is the same shape with a
 * different name, city, trade emphasis and accent, kept as proof the skin is data.
 */
export const siteConfig: SiteConfig = {
  businessName: "Calloway Roofing",
  tagline: "ROOFING & EXTERIORS",
  city: "Charlotte",
  phone: "(704) 555-0148",
  email: "office@callowayroofing.com",
  licenseNumber: "NC-74120",
  yearsInBusiness: 27,
  accent: "#e8622a",

  hero: {
    eyebrow: "LICENSED, BONDED & INSURED",
    headline: "Your roof gets one shot at the next storm.",
    subhead:
      "Tear-offs, repairs and full replacements, done by the crew that quoted the job. Written estimate in 24 hours, no subcontractors, no surprises on the invoice.",
    image: "/calloway-roofing/hero-roofer-wide.jpg",
    trust: { value: "2,400+", claim: "Roofs completed" },
  },

  services: [
    {
      title: "Roof Replacement",
      body: "Full tear-off to the deck. Rotten sheathing gets replaced before anything new goes down, and you see it first.",
      icon: "shingle",
    },
    {
      title: "Storm & Hail Damage",
      body: "We document the damage, meet your adjuster on the roof, and rebuild what the claim covers. You pay the deductible.",
      icon: "storm",
    },
    {
      title: "Roof Repair",
      body: "Leaks traced to the source — failed flashing, split boots, lifted shingles. Repaired properly, not sealed over.",
      icon: "repair",
    },
    {
      title: "Metal Roofing",
      body: "Standing-seam and exposed-fastener panels in 24-gauge steel, with trim, drip edge and vents colour-matched.",
      icon: "metal",
    },
    {
      title: "Gutters & Drainage",
      body: "Seamless aluminium runs on hidden hangers, with downspouts that put water past the footing instead of beside it.",
      icon: "gutter",
    },
    {
      title: "Inspections & Maintenance",
      body: "A written report with a photo of every valley, seam and penetration, plus what needs doing now and what can wait.",
      icon: "inspection",
    },
  ],

  about: {
    image: "/calloway-roofing/crew-reviewing-plans.jpg",
    tabs: [
      {
        label: "Mission",
        body: "We put roofs on houses people intend to keep. That means the quote you sign is the invoice you pay, the crew on your roof works for us, and anything we find under the old shingles gets photographed and explained before we carry on.",
        points: [
          "Written estimate within 24 hours",
          "One crew, start to finish",
          "Deck damage photographed before repair",
          "Site cleared and magnet-swept daily",
        ],
      },
      {
        label: "Expertise",
        body: "Asphalt, architectural, standing-seam metal, low-slope TPO and the flashing details that decide whether any of them last. Our foremen average eleven years on the tools, and every install follows the manufacturer spec that keeps your warranty valid.",
        points: [
          "Manufacturer-certified installers",
          "Low-slope and steep-slope both",
          "Insurance claims documented properly",
          "Ice-and-water in every valley",
        ],
      },
      {
        label: "Values",
        body: "A roof is the most expensive thing most people buy without being able to see it. So we photograph the work as it happens, price in daylight, and tell you when a repair will do instead of a replacement — even when the replacement pays better.",
        points: [
          "Repair quoted before replacement",
          "No door-knocking after storms",
          "Fixed price, no change-order games",
          "Workmanship warranty in writing",
        ],
      },
    ],
  },

  stats: [
    { value: "{years}+", label: "Years in business" },
    { value: "2,400+", label: "Roofs completed" },
    { value: "48hr", label: "Emergency response" },
    { value: "10yr", label: "Workmanship warranty" },
  ],

  projects: [
    {
      title: "Craftsman Re-Roof, Dilworth",
      meta: "Architectural shingle · 34 squares · 2 days",
      image: "/calloway-roofing/project-shingle-replacement.jpg",
    },
    {
      title: "Standing-Seam Retrofit, Myers Park",
      meta: "24-gauge steel · 18 squares · 4 days",
      image: "/calloway-roofing/project-metal-roof.jpg",
    },
    {
      title: "Hail Claim Rebuild, Ballantyne",
      meta: "Full replacement · insurance-funded · 3 days",
      image: "/calloway-roofing/project-storm-repair.jpg",
    },
  ],

  testimonial: {
    quote:
      "They found rot over the porch that two other companies had quoted straight over. Calloway photographed it, priced the repair the same afternoon, and still finished inside the original window.",
    name: "Dana Whitfield",
    location: "Plaza Midwood",
  },

  footerLinks: ["Home", "About", "Services", "Projects", "Reviews", "Contact"],
};
