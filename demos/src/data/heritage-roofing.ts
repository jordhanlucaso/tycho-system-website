/**
 * Heritage Roofing (Heritage Roofing and Construction) — Montgomery, Alabama.
 *
 * A speculative concept for a business that has not commissioned it. The owner allowed a
 * proposal by email and nothing more, so the governing rule of this module is unchanged:
 * the site may only assert what a public source supports.
 *
 * ── Correction, 2026-09 ──────────────────────────────────────────────────────────────
 * An earlier version of this demo was built around a different company of a similar name,
 * in another Alabama city, from a trade-directory listing under another owner's name. All
 * of it has been removed — phone, person, city, address, association membership, and every
 * line of copy and search intent tied to that market.
 *
 * Several other roofing businesses trade under "Heritage Roofing" and own similar domains.
 * None of them is this prospect, and none is a source for anything in this file. Verify
 * against the phone number below before adding any fact here.
 *
 * ── What is verified ─────────────────────────────────────────────────────────────────
 * Owner Justin Spivey · phone (334) 354-8650 · Montgomery, Alabama and the River Region ·
 * trading since 2010 · residential and commercial roofing, gutters, siding, and selected
 * construction and home-improvement work · Alabama Home Builders Licensure Board licence
 * 24351 · BBB rating A+ (not accredited).
 *
 * ── What is still absent, deliberately ───────────────────────────────────────────────
 * Street address (public records disagree — see `address`), email, opening hours as a page
 * element, employee count, manufacturer certifications, warranties, awards, review quotes
 * and review counts. None is invented. See `openQuestions`.
 */

/* ── Confirmation state ──────────────────────────────────────────────────────────────
   `confirmed: false` never reaches the visitor. It drives what the questionnaire lists as
   outstanding, and what a single edit switches off if the owner says "we don't do that".
   It is deliberately not rendered as a badge — a site covered in "unverified" chips is an
   audit report, not a sales demo.                                                       */

export type Confirmable<T> = T & {
  /** Verified against a public source, or confirmed by the owner. Never rendered. */
  confirmed: boolean;
};

export type IconName =
  | "leak"
  | "replace"
  | "storm"
  | "gutter"
  | "siding"
  | "commercial"
  | "shingle"
  | "clipboard"
  | "phone"
  | "shield"
  | "home";

export type Service = Confirmable<{
  slug: string;
  title: string;
  /** Two lines at card width, roughly 90–140 characters. */
  body: string;
  icon: IconName;
  /** Shown on the service page only. Four to six entries. */
  includes: string[];
}>;

export type Problem = {
  title: string;
  body: string;
  icon: IconName;
  href: string;
};

export type Pillar = { title: string; body: string; icon: IconName };

export type Step = { n: string; title: string; body: string };

export type Faq = { id: string; q: string; a: string };

/**
 * Pick FAQs by id. The service pages used to slice this array by index, which silently
 * shows the wrong questions the moment an entry is added — exactly what happened when
 * commercial roofing went in.
 */
export function faqsFor(...ids: string[]): Faq[] {
  return ids.map((id) => {
    const found = faqs.find((f) => f.id === id);
    if (!found) throw new Error(`heritage-roofing: no FAQ with id "${id}"`);
    return found;
  });
}

/**
 * A gallery slot. There are no verified photographs of this company's work, so each slot
 * carries the brief for the photograph that belongs in it and renders as an empty frame
 * with a visible placeholder label. Nothing here is described as this company's work. Add
 * an `image` field alongside `brief` when the real photographs arrive.
 */
export type GallerySlot = {
  id: string;
  /** What the photograph should show. Shown to the visitor as the slot caption. */
  brief: string;
  category: string;
  placeholder: true;
};

export type SiteConfig = {
  businessName: string;
  /** Used where the full trading name reads better — the footer, About, structured data. */
  extendedName: string;
  shortName: string;
  owner: string;
  /** Small caps under the wordmark. Three verified capabilities. */
  tagline: string;
  phone: string;
  phoneHref: string;
  city: string;
  state: string;
  stateCode: string;
  region: string;
  location: string;
  serviceArea: string;
  /** First year of trading. Rendered as "since 2010", never as a computed age. */
  since: number;
  license: { authority: string; number: string };
  /**
   * No street address is published, and this is a decision rather than an omission.
   * One local listing gives 2783 Brevard Ave, Montgomery AL 36109; other public records
   * associate the business with Millbrook addresses and a PO box. Until the owner says
   * which one customers should use, the site shows a city and a region and no pin — and
   * no address goes into structured data either.
   */
  address: null;
  /** No verified address exists, so none is invented. See `openQuestions`. */
  email: null;
  /**
   * No verified official domain. The similarly-named domains that surface in search belong
   * to other Heritage-branded roofing businesses and must never be presented as this one's.
   */
  website: null;
  /** BBB rating is A+; the business is NOT accredited. Never render an accreditation claim. */
  bbbRating: string;
  demoMode: true;
};

export const siteConfig: SiteConfig = {
  businessName: "Heritage Roofing",
  extendedName: "Heritage Roofing and Construction",
  shortName: "Heritage Roofing",
  owner: "Justin Spivey",
  tagline: "ROOFING · GUTTERS · SIDING",
  phone: "(334) 354-8650",
  phoneHref: "+13343548650",
  city: "Montgomery",
  state: "Alabama",
  stateCode: "AL",
  region: "River Region",
  location: "Montgomery, Alabama",
  serviceArea: "Montgomery and the surrounding River Region",
  since: 2010,
  license: { authority: "Alabama Home Builders Licensure Board", number: "24351" },
  address: null,
  email: null,
  website: null,
  bbbRating: "A+",
  demoMode: true,
};

/**
 * The hero's trust row. Three chips, each backed by the verified record: the founding
 * year, the two markets served, and the three capabilities. No counts, no certifications,
 * no accreditation.
 */
export const heroTrust: string[] = [
  "Serving Central Alabama since 2010",
  "Residential & commercial",
  "Roofing · Gutters · Siding",
];

/** Problem-led entry. These describe common roofing situations, not services claimed. */
export const problems: Problem[] = [
  {
    title: "Roof Leak or Damage",
    body: "Water coming in, a stain spreading on the ceiling, or shingles you can see are gone.",
    icon: "leak",
    href: "/heritage-roofing/roof-repair",
  },
  {
    title: "Roof Replacement",
    body: "An older roof, or one damaged past the point where patching it is worth the money.",
    icon: "replace",
    href: "/heritage-roofing/roof-replacement",
  },
  {
    title: "Commercial Property",
    body: "A business, rental or commercial building that needs roofing work scheduled around it.",
    icon: "commercial",
    href: "/heritage-roofing/commercial-roofing",
  },
  {
    title: "Gutters & Siding",
    body: "Overflowing gutters, water against the foundation, or exterior siding that needs work.",
    icon: "gutter",
    href: "/heritage-roofing/gutters",
  },
];

/**
 * Services, in the order the business leads with. All six are in the public record for
 * Heritage Roofing and Construction, so all six are `confirmed: true` — what remains
 * unverified is the detail *inside* each one, which is why no material, brand, warranty or
 * turnaround is claimed anywhere below.
 */
export const services: Service[] = [
  {
    slug: "roofing",
    title: "Residential Roofing",
    body: "Roofing for homes across Montgomery and the River Region, from a single failed detail to a full roof.",
    icon: "home",
    confirmed: true,
    includes: [
      "New roofs and full replacements",
      "Repairs traced to the actual source",
      "Storm and wind damage",
      "Work explained before it starts",
    ],
  },
  {
    slug: "commercial-roofing",
    title: "Commercial Roofing",
    body: "Roofing for commercial properties and businesses, scheduled around the people who use the building.",
    icon: "commercial",
    confirmed: true,
    includes: [
      "Commercial and multi-unit properties",
      "Repairs and full replacements",
      "Work staged around opening hours",
      "A written scope before anything begins",
    ],
  },
  {
    slug: "roof-repair",
    title: "Roof Repair",
    body: "Finding where the water is actually getting in, and fixing that — not sealing over the symptom.",
    icon: "leak",
    confirmed: true,
    includes: [
      "Tracing a leak back to its source",
      "Flashing, valleys and pipe boots",
      "Missing, lifted or cracked shingles",
      "Making the repair before the decking goes",
    ],
  },
  {
    slug: "roof-replacement",
    title: "Roof Replacement",
    body: "A complete replacement when a repair is no longer the practical long-term answer.",
    icon: "replace",
    confirmed: true,
    includes: [
      "Walking you through repair versus replacement",
      "What the existing roof is telling us",
      "Your options set out in plain terms",
      "A written estimate before anything starts",
    ],
  },
  {
    slug: "gutters",
    title: "Gutters",
    body: "Gutter installation and repair, to get roof water away from the property instead of into it.",
    icon: "gutter",
    confirmed: true,
    includes: [
      "Gutter installation and replacement",
      "Downspouts and where water is put",
      "Fascia damage from long-term overflow",
      "Drainage away from the foundation",
    ],
  },
  {
    slug: "siding",
    title: "Siding",
    body: "Exterior siding work to protect the structure underneath and tidy up how the property looks.",
    icon: "siding",
    confirmed: true,
    includes: [
      "Siding repair and replacement",
      "Damage behind the existing siding",
      "Trim and exterior detailing",
      "Matching what is already there",
    ],
  },
];

/**
 * Construction and home-improvement work, kept deliberately secondary. It is in the public
 * record, but roofing is the lead-generation objective and this section must never compete
 * with it — see the layout note in sections/MoreThanRoofing.tsx.
 */
export const additionalServices: { title: string; body: string }[] = [
  {
    title: "Remodeling",
    body: "Interior and exterior remodeling work alongside the roofing side of the business.",
  },
  {
    title: "Home Improvements",
    body: "Selected improvement work on properties across the River Region.",
  },
  {
    title: "Additions",
    body: "Building out additional space, with the roof and exterior handled by the same company.",
  },
];

/**
 * Trust. Every line is anchored in the verified record — the founding year, the two
 * markets, the three capabilities, and the licence number. No manufacturer certification,
 * no BBB accreditation (the rating is A+, the business is *not* accredited), no counts.
 */
export const pillars: Pillar[] = [
  {
    title: "Serving since 2010",
    body: "More than a decade of roofing and exterior work across Central Alabama.",
    icon: "shield",
  },
  {
    title: "Residential & commercial",
    body: "Roofing for homes and for the businesses and rental properties around them.",
    icon: "commercial",
  },
  {
    title: "Roofing and exteriors",
    body: "Roofing, gutters and siding handled by one company, so nothing falls between trades.",
    icon: "home",
  },
  {
    title: "Local to the River Region",
    body: "Montgomery and the surrounding communities — close enough to come and look at it.",
    icon: "phone",
  },
];

export const process: Step[] = [
  {
    n: "01",
    title: "Get in touch",
    body: "Call, or send an estimate request with what you are seeing. Either one starts the same conversation.",
  },
  {
    n: "02",
    title: "Discuss your project",
    body: "Talk through the roofing or exterior issue — when it started, where it shows, what the property has been through.",
  },
  {
    n: "03",
    title: "Assess the property",
    body: "Look at the roof and work out the scope of the work, rather than guessing from the ground.",
  },
  {
    n: "04",
    title: "Review the estimate",
    body: "What can be done, what each option involves, and what it costs — so the decision is yours to make.",
  },
];

/**
 * Photography. No verified photographs of this company's work exist, so nothing here is
 * presented as theirs — each slot states the shot it is holding open.
 */
export const gallerySlots: GallerySlot[] = [
  {
    id: "g1",
    brief: "A finished residential roof, shot from the ground at an angle that shows a full plane and the ridge.",
    category: "Residential Roofing",
    placeholder: true,
  },
  {
    id: "g2",
    brief: "Work under way on a commercial or multi-unit property — the scale of the job visible.",
    category: "Commercial Roofing",
    placeholder: true,
  },
  {
    id: "g3",
    brief: "A new gutter run or siding elevation, with the downspout showing where the water is put.",
    category: "Gutters & Siding",
    placeholder: true,
  },
];

export const faqs: Faq[] = [
  {
    id: "repair-or-replace",
    q: "How do I know whether I need roof repair or replacement?",
    a: "It usually comes down to how much of the roof is affected and how old it is. Damage in one area on a roof with years left in it is normally a repair. Widespread wear, bald patches across several planes, or a roof near the end of its expected life tends to point to replacement. The honest answer is that it needs looking at before anyone can tell you.",
  },
  {
    id: "leaking",
    q: "What should I do if my roof starts leaking?",
    a: "Put something under it to catch the water and move anything that can be damaged. If part of a ceiling is sagging or holding water, stay out from under it. Take photos of where the water is showing, and note when it started and whether it only happens in certain weather — that helps considerably in finding the source.",
  },
  {
    id: "after-storm",
    q: "When should a roof be looked at after severe weather?",
    a: "Once it is safe to be outside and you can look without climbing on anything. Wind and hail damage is often not visible from the ground, and a roof can be missing its protective surface without any water coming in yet. If a storm was strong enough to bring down limbs nearby, it is worth having the roof looked at.",
  },
  {
    id: "signs",
    q: "What are common signs of roof damage?",
    a: "Shingles that are missing, lifted, curled or cracked. Granules collecting in the gutters or at the bottom of downspouts. Stains on ceilings or in the attic. Daylight visible through the roof boards. Flashing that has pulled away around a chimney or vent. Any of these is worth a look.",
  },
  {
    id: "commercial",
    q: "Do you work on commercial properties as well as homes?",
    a: "Yes. Heritage Roofing and Construction works on both residential and commercial roofing. Commercial work is usually about staging the job around the people using the building, so that gets discussed up front rather than after the crew arrives.",
  },
  {
    id: "gutters",
    q: "How can damaged gutters affect my property?",
    a: "Gutters exist to put roof water somewhere other than against the building. When they overflow or come away from the fascia, that water ends up running down the wall and soaking the ground at the foundation. Over time that shows up as rotted fascia, damp underneath, and settling — problems that cost considerably more to fix than the gutters did.",
  },
  {
    id: "estimate",
    q: "How do I request an estimate?",
    a: "Call the number at the top of this page, or send the estimate request form with a description of what you need. Photographs help if you have them. Either way the next step is a conversation about the property before anyone quotes anything.",
  },
];

/** Estimate form — the categories a property owner picks from. */
export const estimateTopics: string[] = [
  "Residential Roofing",
  "Commercial Roofing",
  "Roof Repair",
  "Roof Replacement",
  "Gutters",
  "Siding",
  "Home Improvement / Remodeling",
  "Not Sure",
];

/** Footer link labels. */
export const footerLinks = [
  { label: "Residential Roofing", href: "/heritage-roofing/roofing" },
  { label: "Commercial Roofing", href: "/heritage-roofing/commercial-roofing" },
  { label: "Roof Repair", href: "/heritage-roofing/roof-repair" },
  { label: "Roof Replacement", href: "/heritage-roofing/roof-replacement" },
  { label: "Gutters", href: "/heritage-roofing/gutters" },
  { label: "Siding", href: "/heritage-roofing/siding" },
];

/**
 * What the owner has to answer. Drives the questionnaire and the proposal's closing
 * section. Ordered by how much each one unblocks.
 */
export type OpenQuestion = { field: string; why: string; impact: "high" | "medium" };

export const openQuestions: OpenQuestion[] = [
  {
    field: "Business address for publication",
    why: "One local listing gives 2783 Brevard Ave, Montgomery; other records point at Millbrook and a PO box. Nothing is published, and no map pin is placed, until Justin says which address customers should use.",
    impact: "high",
  },
  {
    field: "Business email address",
    why: "The form has nowhere to send a lead without one. This is the single answer that turns the demo into a working site.",
    impact: "high",
  },
  {
    field: "Trading name on the website",
    why: "The business appears publicly as both Heritage Roofing and Heritage Roofing and Construction. The site leads with the short form and uses the long one in the footer and About — worth confirming that is the right way round.",
    impact: "medium",
  },
  {
    field: "Service area — named towns",
    why: "The site says Montgomery and the River Region, which is honest but ranks for nothing specific. Named towns are what win local searches.",
    impact: "high",
  },
  {
    field: "Commercial roofing scope",
    why: "Commercial is in the public record and has its own page. What kinds of buildings, and whether there is a size the business does not take on, decides the copy.",
    impact: "medium",
  },
  {
    field: "Insurance and storm claim work",
    why: "Whether Heritage documents damage and deals with adjusters. Heavily searched in Alabama and not claimed until confirmed.",
    impact: "medium",
  },
  {
    field: "Manufacturer certifications",
    why: "None is claimed anywhere on the site. If Heritage holds one, it is a strong trust element and belongs on the page.",
    impact: "medium",
  },
  {
    field: "Insurance cover, and the licence as displayed",
    why: "Alabama Home Builders Licensure Board #24351 is on the BBB profile and appears in the footer. Confirm it is current, and supply the insurance carrier — the site makes no insurance claim today.",
    impact: "high",
  },
  {
    field: "Business hours",
    why: "A listing reports Monday to Saturday, 7am to 5pm. Hours change, so none are published; they go in the config the day they are confirmed.",
    impact: "medium",
  },
  {
    field: "Photographs of completed work",
    why: "Three slots are open and captioned with the shot each one needs. Own photography is the strongest asset a contractor site has.",
    impact: "high",
  },
  {
    field: "Google Business Profile and reviews",
    why: "The Montgomery listing carries very few reviews, and none is reproduced on the site. Growing that profile matters more to the phone ringing than the website does.",
    impact: "high",
  },
  {
    field: "How much construction work to show",
    why: "Remodeling, improvements and additions are in the record and sit in one small secondary band. If that side of the business is bigger than roofing, the whole hierarchy changes.",
    impact: "medium",
  },
];
