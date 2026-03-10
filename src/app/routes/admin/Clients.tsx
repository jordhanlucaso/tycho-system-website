import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { apiFetch } from '../../lib/api'

type Role = 'admin' | 'client' | 'sales'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  business_name: string | null
  phone: string | null
  role: Role
  created_at: string
}

const ROLES: Role[] = ['client', 'sales', 'admin']

const roleBadge: Record<Role, string> = {
  admin:  'bg-violet-500/10 text-violet-400',
  sales:  'bg-cyan-500/10 text-cyan-400',
  client: 'bg-[var(--bg-surface)] text-[var(--text-muted)]',
}

export function AdminClients() {
  const [users, setUsers]       = useState<UserProfile[]>([])
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)  // user id being updated
  const [error, setError]       = useState('')

  useEffect(() => {
    document.title = 'Users — Admin — Tycho Systems'
    apiFetch('/api/admin/clients')
      .then((r) => r.json())
      .then((d) => setUsers(d.clients || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  async function changeRole(userId: string, newRole: Role) {
    setUpdating(userId)
    setError('')
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error('Failed to update role')
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
    } catch {
      setError('Could not update role. Try again.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className='text-gradient text-2xl font-semibold tracking-tight'>Users</h1>
        <p className='mt-1 text-sm text-[var(--text-secondary)]'>Manage user accounts and roles.</p>
      </motion.div>

      {error && (
        <div className='mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
          {error}
        </div>
      )}

      <div className='mt-6 glass rounded-xl overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-[var(--border-primary)]'>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Name</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Email</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Business</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Joined</th>
              <th className='px-4 py-3 font-medium text-[var(--text-muted)]'>Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='px-4 py-8 text-center text-[var(--text-muted)]'>Loading…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-4 py-8 text-center text-[var(--text-muted)]'>No users yet.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className='border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-surface-hover)]'>
                  <td className='px-4 py-3 text-[var(--text-primary)]'>{u.full_name || '—'}</td>
                  <td className='px-4 py-3 text-[var(--text-body)]'>{u.email}</td>
                  <td className='px-4 py-3 text-[var(--text-body)]'>{u.business_name || '—'}</td>
                  <td className='px-4 py-3 text-[var(--text-muted)]'>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      {/* Current role badge */}
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge[u.role] ?? roleBadge.client}`}>
                        {u.role}
                      </span>
                      {/* Role selector */}
                      <select
                        value={u.role}
                        disabled={updating === u.id}
                        onChange={(e) => changeRole(u.id, e.target.value as Role)}
                        className='rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-body)] outline-none focus:border-violet-500/50 disabled:opacity-50 cursor-pointer'
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      {updating === u.id && (
                        <svg className='h-3.5 w-3.5 animate-spin text-violet-400' fill='none' viewBox='0 0 24 24'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                        </svg>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
