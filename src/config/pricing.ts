export type PricingTier = {
  id: string
  name: string
  description?: string   // short tagline shown under name
  price: string          // display string, e.g. "$1,250 – $2,500"
  priceInCents: number   // minimum price for cart / Stripe
  recurring: boolean
  note: string           // "one-time" | "per month"
  features: string[]
  cta: string
  delivery?: string      // e.g. "7–10 business days"
  revisions?: string     // e.g. "1 round"
  recommended?: boolean  // highlights card with ring
}

export type AddOn = {
  id: string
  name: string
  price: string
}

// ── One-time project packages (cart-eligible) ────────────────────────────────

export const oneTimePackages: PricingTier[] = [
  {
    id: 'local-starter',
    name: 'Local Starter',
    description: '1-Page Lead Machine',
    price: '$1,250 – $2,500',
    priceInCents: 125000,
    recurring: false,
    note: 'one-time',
    delivery: '7–10 business days',
    revisions: '1 round',
    features: [
      '1 page: Hero + Services + Social proof + FAQ + Contact',
      'Conversion-focused copy polish (light rewrite)',
      'Contact form + click-to-call + Google Maps embed',
      'Basic on-page SEO (titles/meta/headers)',
      'Mobile responsive + speed basics',
    ],
    cta: 'Add to Cart',
  },
  {
    id: 'local-business',
    name: 'Local Business',
    description: '5-Page Website',
    price: '$2,900 – $5,500',
    priceInCents: 290000,
    recurring: false,
    note: 'one-time',
    delivery: '2–3 weeks',
    revisions: '2 rounds',
    features: [
      'Up to 5 pages: Home, Services, About, Reviews/Portfolio, Contact',
      'Modern UI + reusable components',
      'GA4 setup',
      'Lead capture + basic auto-reply email',
    ],
    cta: 'Add to Cart',
  },
  {
    id: 'local-pro',
    name: 'Local Pro',
    description: '8–12 Pages + CMS + Blog',
    price: '$6,500 – $12,500',
    priceInCents: 650000,
    recurring: false,
    note: 'one-time',
    delivery: '3–5 weeks',
    revisions: '3 rounds',
    features: [
      '8–12 pages + blog/news via CMS',
      'Service pages structured for SEO',
      'Performance & accessibility pass (baseline)',
    ],
    cta: 'Add to Cart',
  },
  {
    id: 'local-bookings',
    name: 'Local Bookings',
    description: 'Web + Booking Integration',
    price: '$5,500 – $14,000',
    priceInCents: 550000,
    recurring: false,
    note: 'one-time',
    delivery: '3–6 weeks',
    revisions: '2–3 rounds',
    features: [
      '5–10 pages depending on needs',
      'Booking integration (Calendly/Acuity/Square/etc.)',
      'Booking conversion tracking event',
    ],
    cta: 'Add to Cart',
  },
  {
    id: 'multi-location',
    name: 'Multi-Location',
    description: '2–10 Locations',
    price: '$8,500 – $25,000',
    priceInCents: 850000,
    recurring: false,
    note: 'one-time',
    delivery: '4–8 weeks',
    revisions: '2–3 rounds',
    features: [
      'Multi-location template',
      'Location landing pages (map/hours/reviews)',
      'Local SEO structure per city/area',
      'Scalable to add more locations',
    ],
    cta: 'Add to Cart',
  },
]

// ── Monthly subscription plans (fixed price, cart-eligible) ──────────────────

export const monthlyPlans: PricingTier[] = [
  {
    id: 'care-plan',
    name: 'Care',
    description: 'Maintenance',
    price: '$149 – $249',
    priceInCents: 14900,
    recurring: true,
    note: 'per month',
    features: [
      'Hosting + backups + updates',
      'Uptime monitoring',
      '1 hour/month small edits',
      'Email support (48–72h)',
    ],
    cta: 'Start with Care',
  },
  {
    id: 'growth-plan',
    name: 'Growth',
    description: 'Content + Conversion',
    price: '$399 – $699',
    priceInCents: 39900,
    recurring: true,
    note: 'per month',
    recommended: true,
    features: [
      'Everything in Care',
      '3–5 hours/month improvements',
      'Monthly mini report (traffic + leads)',
      'Priority support (24–48h)',
    ],
    cta: 'Start Growing',
  },
  {
    id: 'performance-plan',
    name: 'Performance',
    description: 'Local SEO + CRO',
    price: '$999 – $1,999',
    priceInCents: 99900,
    recurring: true,
    note: 'per month',
    features: [
      'Everything in Growth',
      '8–12 hours/month (CRO, technical SEO)',
      'Quarterly roadmap',
      'Fast response SLA (same/next business day)',
    ],
    cta: 'Go Full Performance',
  },
]

// ── Combined export used by cart, checkout, and tests ────────────────────────

export const tiers: PricingTier[] = [...oneTimePackages, ...monthlyPlans]

// ── Add-ons ──────────────────────────────────────────────────────────────────

export const addOns: AddOn[] = [
  { id: 'extra-page', name: 'Extra page', price: '$150 – $300' },
  { id: 'seo-landing', name: 'Extra service landing (SEO)', price: '$250 – $500' },
  { id: 'copywriting', name: 'Full copywriting (5 pages)', price: '$500 – $1,500' },
  { id: 'gbp', name: 'Google Business Profile optimization', price: '$250 – $750' },
  { id: 'local-seo', name: 'Local SEO starter', price: '$500 – $1,500' },
  { id: 'tracking', name: 'Advanced tracking (GTM + events + call)', price: '$300 – $1,200' },
  { id: 'multilingual', name: 'Multilingual', price: '+$400 – $1,500' },
  { id: 'rush', name: 'Rush delivery', price: '+20–40%' },
]
