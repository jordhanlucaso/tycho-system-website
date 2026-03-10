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
  tagline: "Get more calls, more bookings, and a website you're proud of.",
  description: 'We build fast, professional websites for local businesses. More customers find you. More of them contact you. Simple process, clear pricing.',
  email: 'hello@tychosystems.com',
  location: 'Remote (US clients welcome)',
  ctas: { primary: 'Get a free website check', secondary: 'See examples' },
  formEndpoint: ''
}
