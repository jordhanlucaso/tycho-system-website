import { useState, type FormEvent } from 'react'
import { Container } from '../layout/Container'
import { site } from '../../../config/site'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = new FormData(form)

    if (!site.formEndpoint) {
      // Demo mode — simulate success
      await new Promise((r) => setTimeout(r, 800))
      setStatus('success')
      form.reset()
      return
    }

    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data))
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id='contact' className='border-t border-neutral-200 bg-neutral-50 py-16'>
      <Container>
        <div className='grid gap-10 lg:grid-cols-2'>
          <div className='space-y-3'>
            <h2 className='text-2xl font-semibold tracking-tight'>Request a free mockup</h2>
            <p className='max-w-prose text-sm text-neutral-600'>Send a few details and I'll reply with next steps. For outreach, keep it simple.</p>

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

            <p className='text-xs text-neutral-500'>Tip: include your business name, city, services, and any photos you have.</p>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm'>
            {status === 'success' ? (
              <div className='flex min-h-[320px] flex-col items-center justify-center gap-3 text-center'>
                <div className='grid h-12 w-12 place-items-center rounded-full bg-green-50'>
                  <svg className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold'>Request sent!</h3>
                <p className='max-w-xs text-sm text-neutral-600'>Thanks for reaching out. I'll get back to you within 24 hours with a mockup preview or next steps.</p>
                <button onClick={() => setStatus('idle')} className='mt-2 text-sm font-medium text-neutral-900 underline underline-offset-4'>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium'>Business name</label>
                  <input name='business' className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200' placeholder='Example Plumbing Co.' required />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <label className='block text-sm font-medium'>City</label>
                    <input name='city' className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200' placeholder='Birmingham, AL' required />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Category</label>
                    <input
                      name='category'
                      className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                      placeholder='Plumber / Salon / Restaurant'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium'>Email</label>
                  <input
                    name='email'
                    type='email'
                    className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                    placeholder='owner@business.com'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium'>Message</label>
                  <textarea
                    name='message'
                    className='mt-2 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200'
                    placeholder='Tell me what services you want highlighted...'
                    rows={5}
                    required
                  />
                </div>

                {status === 'error' && (
                  <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                    Something went wrong. Please try again or email me directly at {site.email}.
                  </div>
                )}

                <button
                  type='submit'
                  disabled={status === 'submitting'}
                  className='inline-flex w-full items-center justify-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60'
                >
                  {status === 'submitting' ? 'Sending...' : 'Send request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
