import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { services } from '../../../config/services'

export function Services() {
  return (
    <section id='services' className='border-t border-[var(--border-subtle)] py-16'>
      <Container>
        <motion.div
          className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className='space-y-2'>
            <h2 className='text-gradient text-2xl font-semibold tracking-tight'>What I do</h2>
            <p className='max-w-prose text-sm text-[var(--text-secondary)]'>A simple process designed for busy business owners.</p>
          </div>
          <a href='#contact' className='text-sm font-medium text-[var(--text-body)] underline underline-offset-4 transition-colors hover:text-[var(--text-primary)]'>
            Get a quote
          </a>
        </motion.div>

        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className='glass glass-hover glow-border rounded-2xl p-6 transition-all'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className='space-y-2'>
                <div className='text-base font-semibold text-[var(--text-primary)]'>{s.title}</div>
                <div className='text-sm text-[var(--text-secondary)]'>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
