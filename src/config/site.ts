export type SiteConfig = {
  agencyName: string
  tagline: string
  description: string
  email: string
  location: string
  ctas: { primary: string; secondary: string }
  formEndpoint: string
}

export const site: SiteConfig = {
  agencyName: 'Tycho Systems',
  tagline: 'Websites for local businesses — built fast, launched properly, and supported after go-live.',
  description: 'Tycho Systems helps local businesses get a professional website through a simple step-by-step process, from first call to launch, with optional ongoing support after the site goes live.',
  email: 'hello@tychosystems.com',
  location: 'Remote (US clients welcome)',
  ctas: { primary: 'Book a strategy call', secondary: 'See packages' },
  formEndpoint: ''
}
