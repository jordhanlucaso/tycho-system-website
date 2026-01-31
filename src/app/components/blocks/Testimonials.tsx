import { Container } from '../layout/Container'

const items = [
  { name: 'Local business owner', title: 'Service business', quote: 'Simple, clean, and customers started calling the same week.' },
  { name: 'Restaurant manager', title: 'Hospitality', quote: 'The mockup looked professional and the site was delivered fast.' },
  { name: 'Home services', title: 'Trades', quote: 'Clear pricing and smooth process. Exactly what we needed.' }
]

export function Testimonials() {
  return (
    <section id='testimonials' className='border-t border-neutral-200 bg-white py-16'>
      <Container>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>Results & trust</h2>
          <p className='max-w-prose text-sm text-neutral-600'>Replace these with real testimonials as you get clients.</p>
        </div>

        <div className='mt-8 grid gap-4 md:grid-cols-3'>
          {items.map((t) => (
            <figure key={t.name} className='rounded-3xl border border-neutral-200 p-6 shadow-sm'>
              <blockquote className='text-sm text-neutral-800'>“{t.quote}”</blockquote>
              <figcaption className='mt-4 text-sm'>
                <div className='font-semibold'>{t.name}</div>
                <div className='text-neutral-600'>{t.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
