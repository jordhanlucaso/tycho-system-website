import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/dashboard/sites', label: 'My Sites', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9', end: false },
  { to: '/dashboard/invoices', label: 'Invoices', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z', end: false },
  { to: '/dashboard/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', end: false }
]

function linkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? 'bg-violet-500/10 text-violet-400 font-medium'
      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
  }`
}

export function DashboardLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className='min-h-screen font-sans'>
      <div className='flex'>
        {/* Sidebar */}
        <aside className='sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-[var(--border-primary)] bg-[var(--bg-primary)]'>
          <div className='flex h-16 items-center border-b border-[var(--border-primary)] px-4'>
            <a href='/' className='inline-flex items-center gap-2'>
              <img src='/logo.svg' alt='Tycho Systems' className='h-8' />
            </a>
          </div>

          <nav className='flex-1 space-y-1 p-3'>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <svg className='h-4 w-4 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d={item.icon} />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className='border-t border-[var(--border-primary)] p-3'>
            {user && (
              <div className='mb-2 px-3 text-xs text-[var(--text-muted)] truncate'>
                {user.email}
              </div>
            )}
            <button
              onClick={() => signOut()}
              className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]'
            >
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
