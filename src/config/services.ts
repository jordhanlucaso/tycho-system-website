export type Service = {
  title: string
  desc: string
  icon: string
}

export const services: Service[] = [
  {
    title: 'More calls & bookings',
    desc: 'Clear CTAs, click-to-call, and contact forms that make it easy for customers to reach you.',
    icon: 'phone',
  },
  {
    title: 'Better first impression',
    desc: 'A clean, professional look that builds trust before a customer even calls or walks in.',
    icon: 'star',
  },
  {
    title: 'Mobile-first design',
    desc: 'Most customers find you on their phone. Your site will look great on every screen.',
    icon: 'device',
  },
  {
    title: 'Copy that converts',
    desc: "We write clear, simple words that explain what you do and why customers should choose you.",
    icon: 'edit',
  },
  {
    title: 'Local SEO basics',
    desc: 'Fast load times, proper structure, and Google-ready setup so more people find you online.',
    icon: 'search',
  },
  {
    title: 'Ongoing care plan',
    desc: 'Optional monthly plan — hosting, updates, and small edits so your site never falls behind.',
    icon: 'shield',
  },
]
