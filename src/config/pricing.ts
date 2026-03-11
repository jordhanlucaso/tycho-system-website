export type Milestone = {
  label: string
  amountInCents: number
}

export type Package = {
  id: string
  sku: string
  name: string
  description?: string         // short display tagline for cart/drawer
  contractTitle: string        // used verbatim in the service agreement
  invoiceLabel: string         // used in Stripe product name and internal invoices
  category: 'one_time' | 'recurring'
  price: string                // display string e.g. "$1,990"
  priceInCents: number         // full project price (one-time) or monthly price (recurring)
  depositPriceInCents?: number // amount charged by Stripe at checkout (one-time only)
  remainingMilestones?: Milestone[] // remaining payment schedule after deposit
  recurring: boolean
  note: string                 // "one-time" | "per month"
  delivery?: string
  revisions?: string
  includedPages?: number | string
  features: string[]
  outOfScope?: string[]
  cta: string
  recommended?: boolean
  active: boolean
  inCheckout: boolean          // false for care plans — shown as info only, not cart-eligible
}

// Backward compat alias — tests and any legacy code using PricingTier still compile
export type PricingTier = Package

export type AddOn = {
  id: string
  name: string
  priceInCents: number
  price: string
}

// ── Website packages (one-time, cart-eligible) ───────────────────────────────

export const websitePackages: Package[] = [
  {
    id: 'starter-website',
    sku: 'TYS-STARTER',
    name: 'Starter Website',
    description: '1-page lead generation website',
    contractTitle: 'Starter Website Package',
    invoiceLabel: 'Starter Website Package — Deposit',
    category: 'one_time',
    price: '$1,990',
    priceInCents: 199000,
    depositPriceInCents: 99000,
    remainingMilestones: [
      { label: 'Remaining balance before launch', amountInCents: 100000 },
    ],
    recurring: false,
    note: 'one-time',
    delivery: '7–10 business days',
    revisions: '1 round',
    includedPages: 1,
    features: [
      '1-page lead generation website',
      'Hero, services, social proof, FAQ, contact section',
      'Contact form',
      'Click-to-call',
      'Google Maps embed',
      'Basic on-page SEO',
      'Mobile responsive',
      'Light copy polish',
      'Launch setup',
    ],
    outOfScope: [
      'Multi-page builds',
      'Custom booking systems',
      'Multi-location structures',
      'Advanced integrations',
      'Multilingual setup',
    ],
    cta: 'Start Starter',
    active: true,
    inCheckout: true,
  },
  {
    id: 'business-website',
    sku: 'TYS-BUSINESS',
    name: 'Business Website',
    description: 'Up to 5 pages',
    contractTitle: 'Business Website Package',
    invoiceLabel: 'Business Website Package — Deposit',
    category: 'one_time',
    price: '$3,990',
    priceInCents: 399000,
    depositPriceInCents: 149000,
    remainingMilestones: [
      { label: 'Design approval milestone', amountInCents: 125000 },
      { label: 'Remaining balance before launch', amountInCents: 125000 },
    ],
    recurring: false,
    note: 'one-time',
    delivery: '2–3 weeks',
    revisions: '2 rounds',
    includedPages: 5,
    features: [
      'Up to 5 pages',
      'Home, Services, About, Reviews/Portfolio, Contact',
      'Custom UI using reusable components',
      'Contact forms',
      'Basic auto-reply email',
      'GA4 setup',
      'Basic SEO structure',
      'Mobile responsive',
      'Launch setup',
    ],
    outOfScope: [
      'Blog/CMS-heavy builds',
      'Multi-location structures',
      'Advanced booking workflows',
      'Complex automations',
      'Multilingual setup',
    ],
    cta: 'Start Business',
    recommended: true,
    active: true,
    inCheckout: true,
  },
  {
    id: 'pro-website',
    sku: 'TYS-PRO',
    name: 'Pro Website',
    description: '8–12 pages + CMS + blog',
    contractTitle: 'Pro Website Package',
    invoiceLabel: 'Pro Website Package — Deposit',
    category: 'one_time',
    price: '$6,990',
    priceInCents: 699000,
    depositPriceInCents: 249000,
    remainingMilestones: [
      { label: 'Design approval milestone', amountInCents: 225000 },
      { label: 'Remaining balance before launch', amountInCents: 225000 },
    ],
    recurring: false,
    note: 'one-time',
    delivery: '3–5 weeks',
    revisions: '3 rounds',
    includedPages: '8–12',
    features: [
      '8–12 pages',
      'CMS/blog setup',
      'SEO-oriented service page structure',
      'Performance baseline pass',
      'Accessibility baseline pass',
      'Analytics setup',
      'Scalable structure for future growth',
    ],
    outOfScope: [
      'Ecommerce',
      'Advanced custom web app features',
      'Enterprise integrations',
      'Large multilingual/multi-region structures',
    ],
    cta: 'Start Pro',
    active: true,
    inCheckout: true,
  },
]

// ── Monthly care plans (recurring, NOT cart-eligible — available after launch) ─

export const carePlans: Package[] = [
  {
    id: 'care-plan',
    sku: 'TYS-CARE',
    name: 'Care',
    contractTitle: 'Care Plan',
    invoiceLabel: 'Care Plan',
    category: 'recurring',
    price: '$149',
    priceInCents: 14900,
    recurring: true,
    note: 'per month',
    features: [
      'Hosting',
      'Backups',
      'Updates',
      'Uptime monitoring',
      'Up to 1 hour/month of small edits',
      'Email support in 48–72 hours',
    ],
    cta: 'Start with Care',
    active: true,
    inCheckout: false,
  },
  {
    id: 'growth-plan',
    sku: 'TYS-GROWTH',
    name: 'Growth',
    contractTitle: 'Growth Plan',
    invoiceLabel: 'Growth Plan',
    category: 'recurring',
    price: '$349',
    priceInCents: 34900,
    recurring: true,
    note: 'per month',
    recommended: true,
    features: [
      'Everything in Care',
      'Up to 3 hours/month of improvements',
      'Monthly mini report',
      'Priority support',
      'Small conversion/content improvements',
    ],
    cta: 'Start Growing',
    active: true,
    inCheckout: false,
  },
  {
    id: 'performance-plan',
    sku: 'TYS-PERFORMANCE',
    name: 'Performance',
    contractTitle: 'Performance Plan',
    invoiceLabel: 'Performance Plan',
    category: 'recurring',
    price: '$699',
    priceInCents: 69900,
    recurring: true,
    note: 'per month',
    features: [
      'Everything in Growth',
      'Up to 6 hours/month',
      'Technical SEO improvements',
      'CRO improvements',
      'Quarterly roadmap',
      'Faster support SLA',
    ],
    cta: 'Go Full Performance',
    active: true,
    inCheckout: false,
  },
]

// ── Combined exports ──────────────────────────────────────────────────────────

export const allPackages: Package[] = [...websitePackages, ...carePlans]

// Backward compat aliases
export const tiers: Package[] = allPackages
export const oneTimePackages = websitePackages
export const monthlyPlans = carePlans

// ── Fixed-price add-ons ───────────────────────────────────────────────────────

export const addOns: AddOn[] = [
  { id: 'extra-page',           name: 'Extra page',                              priceInCents: 25000, price: '$250' },
  { id: 'seo-landing-page',     name: 'Extra SEO landing page',                  priceInCents: 35000, price: '$350' },
  { id: 'copywriting-5-pages',  name: 'Full copywriting (5 pages)',               priceInCents: 90000, price: '$900' },
  { id: 'gbp-optimization',     name: 'Google Business Profile optimization',    priceInCents: 35000, price: '$350' },
  { id: 'local-seo-starter',    name: 'Local SEO starter',                       priceInCents: 75000, price: '$750' },
  { id: 'advanced-tracking',    name: 'Advanced tracking (GTM + events + call)', priceInCents: 45000, price: '$450' },
  { id: 'extra-language-setup', name: 'Extra language setup (per language)',     priceInCents: 65000, price: '$650' },
]
