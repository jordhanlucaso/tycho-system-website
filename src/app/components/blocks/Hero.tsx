import { Container } from '../layout/Container'
import { site } from '../../../config/site'

export function Hero() {
  return (
    <section className='relative overflow-hidden bg-white py-20 sm:py-28'>
      <Container>
        <div className='grid gap-10 lg:grid-cols-2 lg:items-center'>
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600'>
              <span className='h-2 w-2 rounded-full bg-green-500' />
              Available for new projects
            </div>

            <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>{site.tagline}</h1>

            <p className='max-w-prose text-lg text-neutral-700'>{site.description}</p>

            <div className='flex flex-wrap gap-3'>
              <a href='#contact' className='rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90'>
                {site.ctas.primary}
              </a>
              <a href='#mockups' className='rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50'>
                {site.ctas.secondary}
              </a>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              {[
                { k: '24–48h', v: 'Mockup delivery' },
                { k: 'Mobile', v: 'First design' },
                { k: 'Simple', v: 'Pricing + process' }
              ].map((x) => (
                <div key={x.k} className='rounded-2xl border border-neutral-200 p-4'>
                  <div className='text-sm font-semibold'>{x.k}</div>
                  <div className='text-xs text-neutral-600'>{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm'>
            <div className='space-y-3'>
              <div className='h-44 rounded-2xl bg-white' />
              <div className='h-11 rounded-xl bg-white' />
              <div className='h-11 rounded-xl bg-white' />
              <div className='h-11 rounded-xl bg-white' />
              <p className='pt-2 text-xs text-neutral-500'>Preview area (replace with real screenshots later).</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
