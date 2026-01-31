import { Container } from '../layout/Container'
import { mockups } from '../../../config/mockups'

export function Gallery() {
  return (
    <section id='mockups' className='border-t border-neutral-200 bg-neutral-50 py-16'>
      <Container>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>Mockup showcase</h2>
          <p className='max-w-prose text-sm text-neutral-600'>Click any mockup to open a shareable preview page.</p>
        </div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {mockups.map((m) => (
            <a key={m.slug} href={`/m/${m.slug}`} className='group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
              <div className='aspect-[16/10] rounded-2xl border border-neutral-200 bg-neutral-50' />
              <div className='mt-4 space-y-1'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='text-base font-semibold'>{m.name}</div>
                  <span className='rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600'>{m.category}</span>
                </div>
                <div className='text-sm text-neutral-600'>{m.city}</div>
                <div className='text-sm text-neutral-700'>{m.tagline}</div>
                <div className='pt-2 text-xs text-neutral-500 group-hover:text-neutral-700'>Open preview →</div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
