import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../../lib/auth'

const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-body)] outline-none placeholder:text-[var(--text-faint)] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30'

export function DashboardSettings() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'Settings — Tycho Systems'
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    // TODO: Save to /api/client/settings
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
    }, 800)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Settings</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Manage your account details.</p>
      </motion.div>

      <div className='mt-8 glass rounded-xl p-6'>
        <form onSubmit={handleSubmit} className='max-w-md space-y-4'>
          <div>
            <label className='block text-sm font-medium text-[var(--text-body)]'>Email</label>
            <input
              type='email'
              disabled
              value={user?.email ?? ''}
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-body)]'>Full name</label>
            <input name='full_name' className={inputClass} placeholder='Your full name' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-body)]'>Business name</label>
            <input name='business_name' className={inputClass} placeholder='Your business name' />
          </div>

          <div>
            <label className='block text-sm font-medium text-[var(--text-body)]'>Phone</label>
            <input name='phone' type='tel' className={inputClass} placeholder='(555) 123-4567' />
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='submit'
              disabled={saving}
              className='rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {saved && <span className='text-sm text-green-400'>Saved!</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
