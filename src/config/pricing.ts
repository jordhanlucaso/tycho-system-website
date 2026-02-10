export type PricingTier = {
  id: string
  name: string
  price: string
  priceInCents: number
  recurring: boolean
  note: string
  features: string[]
  cta: string
}

export const tiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$399',
    priceInCents: 39900,
    recurring: false,
    note: 'one-time',
    features: ['One-page site', 'Mobile-first', 'Services + CTA', 'Contact section', 'Delivered fast'],
    cta: 'Request a free mockup'
  },
  {
    id: 'business',
    name: 'Business',
    price: '$799',
    priceInCents: 79900,
    recurring: false,
    note: 'one-time',
    features: ['Up to 4 pages', 'Gallery + reviews', 'Contact form', 'SEO basics', '1 revision round'],
    cta: "See what's included"
  },
  {
    id: 'care',
    name: 'Care',
    price: '$49',
    priceInCents: 4900,
    recurring: true,
    note: 'per month',
    features: ['Hosting + updates', 'Monthly edits', 'Backup + security', 'Support', 'Advice as you grow'],
    cta: 'Ask about maintenance'
  }
]
