import { Container } from '../layout/Container'

const tiers = [
  {
    name: 'Starter',
    price: '$399',
    note: 'one-time',
    features: ['One-page site', 'Mobile-first', 'Services + CTA', 'Contact section', 'Delivered fast'],
    cta: 'Request a free mockup'
  },
  {
    name: 'Business',
    price: '$799',
    note: 'one-time',
    features: ['Up to 4 pages', 'Gallery + reviews', 'Contact form', 'SEO basics', '1 revision round'],
    cta: 'See what’s included'
  },
  {
    name: 'Care',
    price: '$49',
    note: 'per month',
    features: ['Hosting + updates', 'Monthly edits', 'Backup + security', 'Support'],
    cta: 'Ask about maintenance'
  }
]

export function Pricing() {
  return (
    <section id='pricing' className='border-t border-neutral-200 bg-white py-16'>
      <Container>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>Simple pricing</h2>
          <p className='max-w-prose text-sm text-neutral-600'>Clear packages. You can always customize if needed.</p>
        </div>

        <div className='mt-8 grid gap-4 lg:grid-cols-3'>
          {tiers.map((t) => (
            <div key={t.name} className='rounded-3xl border border-neutral-200 p-6 shadow-sm'>
              <div className='space-y-2'>
                <div className='text-base font-semibold'>{t.name}</div>
                <div className='flex items-end gap-2'>
                  <div className='text-3xl font-semibold'>{t.price}</div>
                  <div className='pb-1 text-sm text-neutral-600'>/{t.note}</div>
                </div>
              </div>

              <ul className='mt-5 space-y-2 text-sm text-neutral-700'>
                {t.features.map((f) => (
                  <li key={f} className='flex gap-2'>
                    <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500' />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a href='#contact' className='mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90'>
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <p className='mt-6 text-xs text-neutral-500'>*Prices shown are starting points. Final quote depends on scope and content.</p>
      </Container>
    </section>
  )
}
