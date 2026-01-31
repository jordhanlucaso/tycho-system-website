export type Mockup = {
  slug: string
  name: string
  category: string
  city: string
  tagline: string
}

export const mockups: Mockup[] = [
  {
    slug: 'bright-salon-birmingham-al',
    name: 'Bright Salon',
    category: 'Hair Salon',
    city: 'Birmingham, AL',
    tagline: 'Elegant cuts, color & styling.'
  },
  {
    slug: 'flow-plumbing-montgomery-al',
    name: 'Flow Plumbing',
    category: 'Plumber',
    city: 'Montgomery, AL',
    tagline: 'Fast repairs, fair pricing.'
  },
  {
    slug: 'ace-electric-mobile-al',
    name: 'Ace Electric',
    category: 'Electrician',
    city: 'Mobile, AL',
    tagline: 'Safe installs & troubleshooting.'
  }
]
