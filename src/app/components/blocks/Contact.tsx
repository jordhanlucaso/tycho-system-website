import { Container } from '../layout/Container'
import { site } from '../../../config/site'

export function Contact() {
  return (
    <section id='contact' className='border-t border-neutral-200 bg-neutral-50 py-16'>
      <Container>
        <div className='grid gap-10 lg:grid-cols-2'>
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold tracking-tight'>Request a free mockup</h2>
            <p className='max-w-prose text-sm text-neutral-600'>Send a few details and I’ll reply with next steps. For outreach, keep it simple.</p>

            <div className='mt-6 space-y-3 text-sm'>
              <div className='rounded-2xl border border-neutral-200 bg-white p-4'>
                <div className='text-xs font-semibold text-neutral-500'>Email</div>
                <div className='font-medium'>{site.email}</div>
              </div>
              <div className='rounded-2xl border border-neutral-200 bg-white p-4'>
                <div className='text-xs font-semibold text-neutral-500'>Location</div>
                <div className='font-medium'>{site.location}</div>
              </div>
            </div>

            <p className='text-xs text-neutral-500'>Tip: ask for business name, city, services, and any photos they have.</p>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm'>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Mockup form (demo). Next: connect to an email provider or backend.')
              }}
              className='space-y-4'
            >
              <div>
                <label className='block text-sm font-medium'>Business name</label>
                <input className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200' placeholder='Example Plumbing Co.' required />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block text-sm font-medium'>City</label>
                  <input className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200' placeholder='Birmingham, AL' required />
                </div>
                <div>
                  <label className='block text-sm font-medium'>Category</label>
                  <input
                    className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                    placeholder='Plumber / Salon / Restaurant'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium'>Email</label>
                <input
                  type='email'
                  className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                  placeholder='owner@business.com'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium'>Message</label>
                <textarea
                  className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                  placeholder='Tell me what services you want highlighted...'
                  rows={5}
                  required
                />
              </div>

              <button type='submit' className='inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90'>
                Send request
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
