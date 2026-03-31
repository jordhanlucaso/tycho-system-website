import { motion } from 'motion/react'
import { Container } from '../layout/Container'

const audiences = [
  {
    title: 'Restaurants',
    desc: 'Menus, hours, and reservations in one clean site that brings in walk-ins and online orders.',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
  },
  {
    title: 'Salons & Beauty',
    desc: 'Showcase your work, list your services, and make it easy for clients to book their next appointment.',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
  {
    title: 'Trades & Home Services',
    desc: 'A professional site that builds trust, shows your work, and turns Google searches into phone calls.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: 'Local Professional Services',
    desc: 'Accountants, lawyers, consultants — a credible web presence that reflects the quality of your work.',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
]

export function WhoItsFor() {
  return (
    <section id='who-its-for' className='border-t border-[var(--border-subtle)] py-16'>
      <Container>
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Built for local businesses</h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>
            We work with business owners who need a real website — not a template, not a DIY builder.
          </p>
        </motion.div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              className='glass glass-hover glow-border rounded-2xl p-6 transition-all'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10'>
                <svg className='h-5 w-5 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d={a.icon} />
                </svg>
              </div>
              <div className='space-y-1.5'>
                <div className='text-sm font-semibold text-[var(--text-primary)]'>{a.title}</div>
                <div className='text-xs text-[var(--text-secondary)] leading-relaxed'>{a.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
