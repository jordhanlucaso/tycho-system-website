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
    subheadline: 'More bookings, less phone tag — a professional site built through a simple process.',
    description: 'Most barber shops lose customers to competitors with better-looking websites. We build clean, fast sites through a guided process: discovery, proposal, build, launch, and optional ongoing support.',
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
      'A professional site that builds trust instantly',
    ],
    features: [
      'Mobile-first design',
      'Online booking integration',
      'Photo showcase',
      'Click-to-call + location map',
      'Basic local SEO setup',
      'Google review link',
    ],
    exampleServices: ['Haircuts', 'Beard trims', 'Fades', 'Hot towel shaves'],
    metaTitle: 'Websites for Barbers | Tycho Systems',
    metaDescription: 'Professional websites for barber shops — built through a simple process from discovery to launch, with optional ongoing support. Clear packages, fast delivery.',
  },
  {
    slug: 'restaurants',
    name: 'Restaurant',
    namePlural: 'Restaurants',
    headline: 'Websites for Restaurants That Drive Reservations',
    subheadline: 'Menus, hours, and bookings — everything a hungry customer needs, launched fast.',
    description: "Restaurant customers decide where to eat in seconds. We build clean, fast restaurant sites through a guided process — from first call to launch — so you get a site that works without the hassle.",
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
      'Food photography showcase',
      'Click-to-call + Google Maps embed',
      'Hours, address, and parking info',
      'Local SEO basics',
    ],
    exampleServices: ['Dine-in', 'Takeout', 'Catering', 'Private events'],
    metaTitle: 'Websites for Restaurants | Tycho Systems',
    metaDescription: 'Professional websites for restaurants — clear menus, online reservations, and a modern look. Simple process from discovery to launch, with optional ongoing support.',
  },
  {
    slug: 'cleaners',
    name: 'Cleaning Business',
    namePlural: 'Cleaning Businesses',
    headline: 'Websites for Cleaning Businesses That Book More Jobs',
    subheadline: 'Get more quote requests and look professional — with a site built through a clear, guided process.',
    description: "Homeowners and offices search online before they call. We build professional cleaning business websites through a simple step-by-step process — from discovery to launch — with optional ongoing support after go-live.",
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
      'Before/after photo showcase',
      'Click-to-call',
      'Local SEO basics',
    ],
    exampleServices: ['Residential cleaning', 'Office cleaning', 'Move-out cleaning', 'Deep clean'],
    metaTitle: 'Websites for Cleaning Businesses | Tycho Systems',
    metaDescription: 'Professional websites for cleaning companies — more quote requests, trust-building design, easy contact. Simple process, clear packages, optional ongoing support.',
  },
]

export function getNiche(slug: string): NicheConfig | undefined {
  return niches.find((n) => n.slug === slug)
}
