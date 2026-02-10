export type Mockup = {
  slug: string
  name: string
  category: string
  city: string
  tagline: string
  previewUrl?: string
}

export const mockups: Mockup[] = [
  {
    slug: 'bright-salon-birmingham-al',
    name: 'Bright Salon',
    category: 'Hair Salon',
    city: 'Birmingham, AL',
    tagline: 'Elegant cuts, color & styling.',
    previewUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=375&fit=crop'
  },
  {
    slug: 'flow-plumbing-montgomery-al',
    name: 'Flow Plumbing',
    category: 'Plumber',
    city: 'Montgomery, AL',
    tagline: 'Fast repairs, fair pricing.',
    previewUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=375&fit=crop'
  },
  {
    slug: 'ace-electric-mobile-al',
    name: 'Ace Electric',
    category: 'Electrician',
    city: 'Mobile, AL',
    tagline: 'Safe installs & troubleshooting.',
    previewUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=375&fit=crop'
  }
]
