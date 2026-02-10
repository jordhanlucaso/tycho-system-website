import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { mockups } from '../../../config/mockups'

export function Gallery() {
  return (
    <section id='mockups' className='relative border-t border-[var(--border-subtle)] py-16'>
      {/* Subtle glow behind the section */}
      <div className='glow-orb left-1/2 top-0 h-64 w-64 -translate-x-1/2 bg-violet-600' />

      <Container>
        <motion.div
          className='relative space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Mockup showcase</h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>Click any mockup to open a shareable preview page.</p>
        </motion.div>

        <div className='relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {mockups.map((m, i) => (
            <motion.a
              key={m.slug}
              href={`/m/${m.slug}`}
              className='glass glass-hover glow-border group rounded-2xl p-5 transition-all'
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              {m.previewUrl ? (
                <img src={m.previewUrl} alt={m.name} className='aspect-[16/10] w-full rounded-xl border border-[var(--border-subtle)] object-cover' loading='lazy' />
              ) : (
                <div className='aspect-[16/10] rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-violet-500/5 to-cyan-500/5' />
              )}
              <div className='mt-4 space-y-1'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='text-base font-semibold text-[var(--text-primary)]'>{m.name}</div>
                  <span className='rounded-full border border-[var(--border-primary)] px-2 py-0.5 text-xs text-[var(--text-muted)]'>{m.category}</span>
                </div>
                <div className='text-sm text-[var(--text-muted)]'>{m.city}</div>
                <div className='text-sm text-[var(--text-secondary)]'>{m.tagline}</div>
                <div className='pt-2 text-xs text-[var(--text-faint)] transition-colors group-hover:text-cyan-400'>Open preview &rarr;</div>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  )
}
