export type Testimonial = {
  name: string
  title: string
  quote: string
  result?: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Maria S.',
    title: 'Owner, Clean Home Services',
    quote: 'I started getting calls the first week the site went live. Before, we had nothing online. Now customers find us on Google and call right away.',
    result: 'First calls within a week',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'James R.',
    title: 'Manager, Route 7 BBQ',
    quote: "They showed us a mockup in two days. We approved it, they built it, and it was live in under three weeks. We didn't have to figure out anything technical.",
    result: 'Live in under 3 weeks',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Derek T.',
    title: 'Owner, Precision Cuts Barbershop',
    quote: 'Professional, fast, and the price was clear from the start. Customers tell me they booked because the website looked legit. That was the goal.',
    result: 'More bookings from Google',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  },
]
