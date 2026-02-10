export type Testimonial = {
  name: string
  title: string
  quote: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Local business owner',
    title: 'Service business',
    quote: 'Simple, clean, and customers started calling the same week.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
  },
  {
    name: 'Restaurant manager',
    title: 'Hospitality',
    quote: 'The mockup looked professional and the site was delivered fast.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'
  },
  {
    name: 'Home services',
    title: 'Trades',
    quote: 'Clear pricing and smooth process. Exactly what we needed.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
  }
]
