import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'

const steps = [
  {
    number: '01',
    title: 'Book a call',
    desc: 'We learn about your business, goals, and what you need from your website.',
  },
  {
    number: '02',
    title: 'Get a clear proposal',
    desc: 'You receive a fixed-price proposal with a defined scope, timeline, and deliverables.',
  },
  {
    number: '03',
    title: 'Send assets & access',
    desc: 'Share your logo, photos, and any content you have. We handle the rest.',
  },
  {
    number: '04',
    title: 'Review on staging',
    desc: 'You review your site on a private staging link before anything goes live.',
  },
  {
    number: '05',
    title: 'Launch',
    desc: 'We handle the go-live process — domain, DNS, hosting — and make sure everything works.',
  },
  {
    number: '06',
    title: 'Ongoing support',
    desc: 'Optional monthly care plan for hosting, updates, and small edits after launch.',
  },
]

export function ProcessSteps() {
  return (
    <section id='process' className='border-t border-[var(--border-subtle)] py-16'>
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
            A simple 6-step process from first call to launch. No tech knowledge required.
          </p>
        </motion.div>

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className='relative'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
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
            Book a strategy call
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
