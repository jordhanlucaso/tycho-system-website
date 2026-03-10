import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { tiers } from '../../../config/pricing'
import { apiFetch } from '../../lib/api'

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'
const selectClass = inputClass + ' cursor-pointer'

const sources = ['Website', 'Referral', 'Cold outreach', 'Social media', 'Event', 'Other']
const statuses = ['new', 'contacted', 'quoted', 'closed', 'lost'] as const

export function SalesNewSale() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: form.get('phone') as string,
      businessName: form.get('businessName') as string,
      source: form.get('source') as string,
      status: form.get('status') as string,
      package: form.get('package') as string,
      estimatedValue: Math.round(parseFloat(form.get('estimatedValue') as string || '0') * 100),
      notes: form.get('notes') as string,
    }

    try {
      const res = await apiFetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save lead')
      setSuccess(true)
      setTimeout(() => navigate('/sales'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>New Sale</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Add a client lead or record a completed sale.</p>
      </motion.div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className='mt-8 flex flex-col items-center gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-12 text-center'
        >
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10'>
            <svg className='h-7 w-7 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <div>
            <p className='font-semibold text-[var(--text-primary)]'>Lead saved!</p>
            <p className='mt-1 text-sm text-[var(--text-muted)]'>Redirecting to overview…</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className='mt-8 glass rounded-2xl p-6'
        >
          <form onSubmit={handleSubmit} className='grid gap-5 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Contact name *</label>
              <input name='name' required className={inputClass} placeholder='Jane Smith' />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Business name *</label>
              <input name='businessName' required className={inputClass} placeholder='Smith Plumbing LLC' />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Email *</label>
              <input name='email' type='email' required className={inputClass} placeholder='jane@smithplumbing.com' />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Phone</label>
              <input name='phone' type='tel' className={inputClass} placeholder='(555) 123-4567' />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Package interested in</label>
              <select name='package' className={selectClass}>
                <option value=''>Select a package…</option>
                {tiers.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} — {t.price}</option>
                ))}
                <option value='Custom'>Custom / TBD</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Estimated value ($)</label>
              <input name='estimatedValue' type='number' min='0' step='0.01' className={inputClass} placeholder='1250' />
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Lead source</label>
              <select name='source' className={selectClass}>
                {sources.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Status</label>
              <select name='status' className={selectClass}>
                {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            <div className='sm:col-span-2'>
              <label className='block text-sm font-medium text-[var(--text-body)]'>Notes</label>
              <textarea
                name='notes'
                rows={4}
                className={inputClass + ' resize-none'}
                placeholder='Any relevant context about this lead…'
              />
            </div>

            {error && (
              <div className='sm:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                {error}
              </div>
            )}

            <div className='sm:col-span-2 flex gap-3'>
              <button
                type='submit'
                disabled={submitting}
                className='rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
              >
                {submitting ? 'Saving…' : 'Save lead'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/sales')}
                className='rounded-xl border border-[var(--border-primary)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  )
}
