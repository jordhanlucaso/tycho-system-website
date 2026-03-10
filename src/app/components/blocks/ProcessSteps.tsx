import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'

const steps = [
  {
    number: '01',
    title: 'Free website check',
    desc: "We review your current site (or a blank slate if you don't have one) and show you exactly what's holding you back.",
    cta: null,
  },
  {
    number: '02',
    title: 'Personalized mockup',
    desc: 'We send you a custom design preview for your business — real content, real layout — before you pay anything.',
    cta: null,
  },
  {
    number: '03',
    title: 'We build it',
    desc: 'You approve the design, we build and launch. Most sites go live within 2–3 weeks. Clear milestones, no surprises.',
    cta: null,
  },
  {
    number: '04',
    title: 'Optional ongoing care',
    desc: 'Keep the site fresh with our monthly Care plan — hosting, updates, and small edits included.',
    cta: null,
  },
]

export function ProcessSteps() {
  return (
    <section id='how-it-works' className='border-t border-[var(--border-subtle)] py-16'>
      <Container>
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>How it works</h2>
          <p className='max-w-prose text-sm text-[var(--text-secondary)]'>
            A simple 4-step process. No tech knowledge required on your end.
          </p>
        </motion.div>

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className='relative'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className='absolute left-full top-5 hidden h-px w-6 bg-gradient-to-r from-violet-500/30 to-transparent lg:block' />
              )}
              <div className='glass rounded-2xl p-5 h-full flex flex-col gap-3'>
                <div className='text-2xl font-semibold text-gradient leading-none'>{step.number}</div>
                <div className='text-sm font-semibold text-[var(--text-primary)]'>{step.title}</div>
                <div className='text-xs text-[var(--text-secondary)] leading-relaxed flex-1'>{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className='mt-8 flex justify-center'
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            to='/website-check'
            className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
          >
            Start with a free website check
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
