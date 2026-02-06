export type PricingTier = {
  name: string
  price: string
  note: string
  features: string[]
  cta: string
}

export const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$399',
    note: 'one-time',
    features: ['One-page site', 'Mobile-first', 'Services + CTA', 'Contact section', 'Delivered fast'],
    cta: 'Request a free mockup'
  },
  {
    name: 'Business',
    price: '$799',
    note: 'one-time',
    features: ['Up to 4 pages', 'Gallery + reviews', 'Contact form', 'SEO basics', '1 revision round'],
    cta: "See what's included"
  },
  {
    name: 'Care',
    price: '$49',
    note: 'per month',
    features: ['Hosting + updates', 'Monthly edits', 'Backup + security', 'Support', 'Advice as you grow'],
    cta: 'Ask about maintenance'
  }
]
