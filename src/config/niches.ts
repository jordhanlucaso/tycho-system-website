export type NicheConfig = {
  slug: string
  name: string
  namePlural: string
  headline: string
  subheadline: string
  description: string
  painPoints: string[]
  outcomes: string[]
  features: string[]
  exampleServices: string[]
  metaTitle: string
  metaDescription: string
  heroImage?: string
}

export const niches: NicheConfig[] = [
  {
    slug: 'barbers',
    name: 'Barber',
    namePlural: 'Barbers',
    headline: 'Websites for Barbers That Fill Your Chair',
    subheadline: 'More bookings. Less phone tag. A site that works while you cut.',
    description: 'Most barber shops lose customers to competitors with better-looking websites. We build clean, fast sites that show your work, let customers book online, and make you easy to find on Google.',
    painPoints: [
      "Customers can't find your hours or location",
      'No way to book appointments online',
      'Instagram looks good but Google finds nothing',
      'Your site looks outdated on a phone',
    ],
    outcomes: [
      'Customers find you on Google Maps and book directly',
      'Click-to-call button on every page',
      'Online booking integration (optional)',
      'Gallery of your cuts that builds trust instantly',
    ],
    features: [
      'Mobile-first design',
      'Online booking integration',
      'Photo gallery',
      'Click-to-call + location map',
      'Basic local SEO setup',
      'Google review link',
    ],
    exampleServices: ['Haircuts', 'Beard trims', 'Fades', 'Hot towel shaves'],
    metaTitle: 'Websites for Barbers | Tycho Systems',
    metaDescription: 'Professional websites for barber shops. Get more bookings, show your work, and be easy to find on Google. Fast delivery, clear pricing.',
  },
  {
    slug: 'restaurants',
    name: 'Restaurant',
    namePlural: 'Restaurants',
    headline: 'Websites for Restaurants That Drive Reservations',
    subheadline: 'Menus, hours, bookings — everything a hungry customer needs.',
    description: "Restaurant customers decide where to eat in seconds. A slow, outdated website sends them to your competitor. We build clean, fast restaurant sites that make ordering or booking a table easy.",
    painPoints: [
      'Menu is a scanned PDF that nobody can read on a phone',
      'No way to take reservations online',
      'Yelp page looks better than your own website',
      'Google shows wrong hours or no info',
    ],
    outcomes: [
      'Clean mobile menu customers can actually read',
      'Reservation or takeout order link built in',
      'Photos of your food that make people hungry',
      'Correct hours and location shown on Google',
    ],
    features: [
      'Mobile-friendly menu pages',
      'Reservation / ordering link integration',
      'Food photography gallery',
      'Click-to-call + Google Maps embed',
      'Hours, address, and parking info',
      'Local SEO basics',
    ],
    exampleServices: ['Dine-in', 'Takeout', 'Catering', 'Private events'],
    metaTitle: 'Websites for Restaurants | Tycho Systems',
    metaDescription: 'Professional websites for restaurants. Clear menus, online reservations, and a look that makes customers want to visit. Fast delivery, clear pricing.',
  },
  {
    slug: 'cleaners',
    name: 'Cleaning Business',
    namePlural: 'Cleaning Businesses',
    headline: 'Websites for Cleaning Businesses That Book More Jobs',
    subheadline: 'Get more quote requests and look professional before you even show up.',
    description: "Homeowners and offices search online before they call. A professional cleaning business website builds trust, explains your services, and makes it easy to request a quote — 24/7.",
    painPoints: [
      'Potential customers find competitors first',
      'No clear way to request a quote online',
      "Site looks cheap but your service isn't",
      'Hard to explain what makes you different',
    ],
    outcomes: [
      'More quote requests from Google',
      'Clear service list with pricing structure',
      'Trust-building: insurance, experience, reviews',
      'Easy contact for repeat clients',
    ],
    features: [
      'Service area pages',
      'Quote request form',
      'Trust signals (insured, bonded, years experience)',
      'Before/after photo gallery',
      'Click-to-call',
      'Local SEO basics',
    ],
    exampleServices: ['Residential cleaning', 'Office cleaning', 'Move-out cleaning', 'Deep clean'],
    metaTitle: 'Websites for Cleaning Businesses | Tycho Systems',
    metaDescription: 'Professional websites for cleaning companies. More quote requests, trust-building design, easy contact. Fast delivery, clear pricing.',
  },
]

export function getNiche(slug: string): NicheConfig | undefined {
  return niches.find((n) => n.slug === slug)
}
