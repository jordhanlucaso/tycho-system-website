import { Container } from '../layout/Container'

const services = [
  { title: 'Free mockup first', desc: 'You see a preview before paying. If you like it, we ship fast.' },
  { title: 'Modern one-page sites', desc: 'Perfect for local businesses: services, trust, contact, and CTA.' },
  { title: 'Multi-page upgrades', desc: 'Add pages like Services, About, Gallery, Booking, and FAQs.' },
  { title: 'Copy + structure', desc: 'Clear text that converts: what you do, where you work, why you.' },
  { title: 'SEO basics', desc: 'Fast load, metadata, indexing-ready structure, and local keywords.' },
  { title: 'Maintenance', desc: 'Optional hosting + edits so the site stays updated.' }
]

export function Services() {
  return (
    <section id='services' className='border-t border-neutral-200 bg-white py-16'>
      <Container>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-semibold tracking-tight'>What I do</h2>
            <p className='max-w-prose text-sm text-neutral-600'>A simple process designed for busy business owners.</p>
          </div>
          <a href='#contact' className='text-sm font-medium text-neutral-900 underline underline-offset-4'>
            Get a quote
          </a>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map((s) => (
            <div key={s.title} className='rounded-3xl border border-neutral-200 p-6 shadow-sm'>
              <div className='space-y-2'>
                <div className='text-base font-semibold'>{s.title}</div>
                <div className='text-sm text-neutral-700'>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
