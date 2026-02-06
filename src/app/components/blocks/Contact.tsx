import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

  const inputClass = 'mt-2 w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

  return (
    <section id='contact' className='relative border-t border-white/[0.06] py-16'>
      <div className='glow-orb left-1/3 top-0 h-48 w-48 bg-cyan-500' />

      <Container>
        <div className='relative grid gap-10 lg:grid-cols-2'>
          <motion.div
            className='space-y-3'
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Request a free mockup</h2>
            <p className='max-w-prose text-sm text-slate-400'>Send a few details and I'll reply with next steps. For outreach, keep it simple.</p>

            <div className='mt-6 space-y-3 text-sm'>
              <div className='glass rounded-xl p-4'>
                <div className='text-xs font-semibold text-slate-500'>Email</div>
                <div className='font-medium text-white'>{site.email}</div>
              </div>
              <div className='glass rounded-xl p-4'>
                <div className='text-xs font-semibold text-slate-500'>Location</div>
                <div className='font-medium text-white'>{site.location}</div>
              </div>
            </div>

            <p className='text-xs text-slate-600'>Tip: include your business name, city, services, and any photos you have.</p>
          </motion.div>

          <motion.div
            className='glass rounded-2xl p-6'
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AnimatePresence mode='wait'>
              {status === 'success' ? (
                <motion.div
                  key='success'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className='flex min-h-[320px] flex-col items-center justify-center gap-3 text-center'
                >
                  <motion.div
                    className='grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                  >
                    <svg className='h-6 w-6 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                    </svg>
                  </motion.div>
                  <h3 className='text-lg font-semibold text-white'>Request sent!</h3>
                  <p className='max-w-xs text-sm text-slate-400'>Thanks for reaching out. I'll get back to you within 24 hours with a mockup preview or next steps.</p>
                  <button onClick={() => setStatus('idle')} className='mt-2 text-sm font-medium text-slate-300 underline underline-offset-4 transition-colors hover:text-white'>
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key='form'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className='space-y-4'
                >
                  <div>
                    <label className='block text-sm font-medium text-slate-300'>Business name</label>
                    <input name='business' className={inputClass} placeholder='Example Plumbing Co.' required />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                      <label className='block text-sm font-medium text-slate-300'>City</label>
                      <input name='city' className={inputClass} placeholder='Birmingham, AL' required />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-slate-300'>Category</label>
                      <input name='category' className={inputClass} placeholder='Plumber / Salon / Restaurant' required />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-300'>Email</label>
                    <input name='email' type='email' className={inputClass} placeholder='owner@business.com' required />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-300'>Message</label>
                    <textarea name='message' className={inputClass} placeholder='Tell me what services you want highlighted...' rows={5} required />
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300'
                      >
                        Something went wrong. Please try again or email me directly at {site.email}.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type='submit'
                    disabled={status === 'submitting'}
                    className='inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send request'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
