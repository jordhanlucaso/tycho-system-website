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
  tagline: 'Vercel-style websites for local businesses — fast.',
  description: 'I build modern, mobile-first websites and quick mockups for small businesses. Clear design, fast delivery, simple process.',
  email: 'hello@tychosystems.com',
  location: 'Remote (US clients welcome)',
  ctas: { primary: 'Request a free mockup', secondary: 'See mockups' },
  // Set your Web3Forms access key here (get one free at https://web3forms.com)
  // Leave empty to use demo mode (shows success message without sending)
  formEndpoint: ''
}
