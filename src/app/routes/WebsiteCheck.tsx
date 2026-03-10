import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

const checks = [
  { icon: '⚡', label: 'Page speed', desc: 'Does it load fast on mobile?' },
  { icon: '📱', label: 'Mobile experience', desc: 'Is it easy to use on a phone?' },
  { icon: '✅', label: 'Trust signals', desc: 'Does it look professional and credible?' },
  { icon: '📞', label: 'Contact clarity', desc: 'Can customers easily call, book, or reach you?' },
  { icon: '📍', label: 'Local SEO basics', desc: 'Is it set up for Google to find you?' },
]

export function WebsiteCheck() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Free Website Check — Tycho Systems'
    if (!SITE_KEY || document.getElementById('recaptcha-script')) return
    const script = document.createElement('script')
    script.id = 'recaptcha-script'
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    document.head.appendChild(script)
  }, [])

  async function getToken(): Promise<string | undefined> {
    if (!SITE_KEY || !window.grecaptcha) return undefined
    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        try { resolve(await window.grecaptcha!.execute(SITE_KEY, { action: 'website_check' })) }
        catch { resolve(undefined) }
      })
    })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const recaptchaToken = await getToken()

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         data.get('name') as string,
          businessName: data.get('business') as string,
          websiteUrl:   data.get('url') as string || undefined,
          city:         data.get('city') as string,
          category:     data.get('category') as string,
          email:        data.get('email') as string,
          message:      `Website Check Request — ${data.get('business')} (${data.get('city')})`,
          source:       'website-check',
          recaptchaToken,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong.')

      navigate('/thank-you')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              className='grid gap-12 lg:grid-cols-2 lg:items-start'
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Left: explanation */}
              <div className='space-y-6'>
                <div>
                  <div className='inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--text-secondary)] mb-4'>
                    <span className='h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' />
                    Free — no credit card required
                  </div>
                  <h1 className='text-gradient text-3xl font-semibold tracking-tight'>
                    Free 5-Point Website Check
                  </h1>
                  <p className='mt-3 text-[var(--text-secondary)]'>
                    Tell us about your business and we'll review your current website (or audit a competitor's) across 5 areas that directly affect how many customers contact you.
                  </p>
                </div>

                <div className='space-y-3'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]'>What we check</p>
                  {checks.map((c) => (
                    <div key={c.label} className='glass flex items-start gap-3 rounded-xl p-4'>
                      <span className='text-lg leading-none mt-0.5'>{c.icon}</span>
                      <div>
                        <div className='text-sm font-medium text-[var(--text-primary)]'>{c.label}</div>
                        <div className='text-xs text-[var(--text-secondary)]'>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-1'>
                  <p className='text-xs font-semibold text-violet-400 uppercase tracking-wider'>What you get</p>
                  <p className='text-sm text-[var(--text-secondary)]'>
                    A plain-English summary of what's working, what's hurting you, and the 2–3 most important fixes — delivered to your inbox within 1–2 business days.
                  </p>
                </div>
              </div>

              {/* Right: form */}
              <motion.div
                className='glass rounded-2xl p-6'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h2 className='text-base font-semibold text-[var(--text-primary)] mb-5'>Tell us about your business</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Your name *</label>
                    <input name='name' required className={inputClass} placeholder='Jane Smith' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Business name *</label>
                    <input name='business' required className={inputClass} placeholder='Acme Plumbing Co.' />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>Email address *</label>
                    <input name='email' type='email' required className={inputClass} placeholder='jane@business.com' />
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                      <label className='block text-sm font-medium text-[var(--text-body)]'>City / Area *</label>
                      <input name='city' required className={inputClass} placeholder='Austin, TX' />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-[var(--text-body)]'>Business type *</label>
                      <input name='category' required className={inputClass} placeholder='Plumber / Salon / …' />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-[var(--text-body)]'>
                      Current website URL
                      <span className='ml-1 text-xs font-normal text-[var(--text-muted)]'>(optional)</span>
                    </label>
                    <input name='url' type='url' className={inputClass} placeholder='https://yourbusiness.com' />
                  </div>

                  {error && (
                    <div className='rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                      {error}
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={submitting}
                    className='w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
                  >
                    {submitting ? (
                      <>
                        <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Send me my free check'
                    )}
                  </button>

                  <p className='text-center text-xs text-[var(--text-faint)]'>
                    No spam. No hard sell. Just honest feedback on your website.
                  </p>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </main>
    </div>
  )
}
