import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { site } from '../../../config/site'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Hero() {
  return (
    <section className='relative overflow-hidden py-20 sm:py-28'>
      {/* Glow orbs */}
      <motion.div
        className='glow-orb -top-32 left-1/4 h-96 w-96 bg-violet-600'
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className='glow-orb -top-20 right-1/4 h-80 w-80 bg-cyan-500'
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.3, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern overlay */}
      <div className='bg-grid absolute inset-0' />

      <Container>
        <div className='relative grid gap-10 lg:grid-cols-2 lg:items-center'>
          <motion.div
            className='space-y-6'
            initial='hidden'
            animate='visible'
            transition={{ staggerChildren: 0.12 }}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className='inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--text-secondary)]'>
              <span className='h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' />
              Available for new projects
            </motion.div>

            <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }} className='text-gradient text-4xl font-semibold tracking-tight sm:text-5xl'>
              {site.tagline}
            </motion.h1>

            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className='max-w-prose text-lg text-[var(--text-secondary)]'>
              {site.description}
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className='flex flex-wrap gap-3'>
              <a href='#contact' className='rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'>
                {site.ctas.primary}
              </a>
              <a href='#mockups' className='rounded-2xl border border-[var(--border-primary)] px-5 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'>
                {site.ctas.secondary}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className='grid gap-3 sm:grid-cols-3'>
              {[
                { k: '24\u201348h', v: 'Mockup delivery' },
                { k: 'Mobile', v: 'First design' },
                { k: 'Simple', v: 'Pricing + process' }
              ].map((x) => (
                <div key={x.k} className='glass rounded-2xl p-4'>
                  <div className='text-sm font-semibold text-[var(--text-primary)]'>{x.k}</div>
                  <div className='text-xs text-[var(--text-muted)]'>{x.v}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Preview panel */}
          <motion.div
            className='glass rounded-3xl p-6'
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            <div className='space-y-3'>
              {/* Browser chrome with preview image */}
              <div className='rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]'>
                <div className='flex items-center gap-1.5 border-b border-[var(--border-subtle)] px-3 py-2'>
                  <span className='h-2 w-2 rounded-full bg-red-400/60' />
                  <span className='h-2 w-2 rounded-full bg-yellow-400/60' />
                  <span className='h-2 w-2 rounded-full bg-green-400/60' />
                  <div className='ml-2 h-4 flex-1 rounded-md bg-[var(--bg-surface)] px-2 text-[10px] leading-4 text-[var(--text-faint)]'>tychosystems.com</div>
                </div>
                <img
                  src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
                  alt='Website design preview'
                  className='w-full rounded-b-2xl object-cover'
                  loading='lazy'
                />
              </div>
              <p className='text-center text-xs text-[var(--text-faint)]'>Clean, modern designs for local businesses</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
