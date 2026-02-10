import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

type Client = {
  id: string
  email: string
  full_name: string | null
  business_name: string | null
  created_at: string
}

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Clients — Admin — Tycho Systems'
    fetch('/api/admin/clients')
      .then((r) => r.json())
      .then((d) => setClients(d.clients || []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Clients</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Manage your client accounts.</p>
      </motion.div>

      <div className='mt-8 glass rounded-xl overflow-hidden'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-[var(--border-primary)]'>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Name</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Email</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Business</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className='px-4 py-8 text-center text-[var(--text-muted)]'>Loading...</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={4} className='px-4 py-8 text-center text-[var(--text-muted)]'>No clients yet.</td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className='border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-surface-hover)]'>
                  <td className='px-4 py-3 text-[var(--text-primary)]'>{c.full_name || '—'}</td>
                  <td className='px-4 py-3 text-[var(--text-body)]'>{c.email}</td>
                  <td className='px-4 py-3 text-[var(--text-body)]'>{c.business_name || '—'}</td>
                  <td className='px-4 py-3 text-[var(--text-muted)]'>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
