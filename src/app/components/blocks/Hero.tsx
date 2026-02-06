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
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className='inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-slate-400'>
              <span className='h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' />
              Available for new projects
            </motion.div>

            <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }} className='text-gradient text-4xl font-semibold tracking-tight sm:text-5xl'>
              {site.tagline}
            </motion.h1>

            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className='max-w-prose text-lg text-slate-400'>
              {site.description}
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className='flex flex-wrap gap-3'>
              <a href='#contact' className='rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'>
                {site.ctas.primary}
              </a>
              <a href='#mockups' className='rounded-2xl border border-white/[0.15] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white'>
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
                  <div className='text-sm font-semibold text-white'>{x.k}</div>
                  <div className='text-xs text-slate-500'>{x.v}</div>
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
              {/* Browser chrome skeleton */}
              <div className='rounded-2xl border border-white/[0.06] bg-white/[0.02]'>
                <div className='flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2'>
                  <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                  <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                  <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                  <div className='ml-2 h-4 flex-1 rounded-md bg-white/[0.04]' />
                </div>
                <div className='space-y-3 p-4'>
                  <div className='h-28 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10' />
                  <div className='h-3 w-3/4 rounded bg-white/[0.06]' />
                  <div className='h-3 w-1/2 rounded bg-white/[0.04]' />
                  <div className='grid grid-cols-3 gap-2'>
                    <div className='h-14 rounded-lg bg-white/[0.04]' />
                    <div className='h-14 rounded-lg bg-white/[0.04]' />
                    <div className='h-14 rounded-lg bg-white/[0.04]' />
                  </div>
                </div>
              </div>
              <p className='text-center text-xs text-slate-600'>Live preview area</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
