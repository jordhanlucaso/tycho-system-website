import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { testimonials } from '../../../config/testimonials'

export function Testimonials() {
  return (
    <section id='testimonials' className='border-t border-white/[0.06] py-16'>
      <Container>
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>Results & trust</h2>
          <p className='max-w-prose text-sm text-slate-400'>What clients say about working with us.</p>
        </motion.div>

        <div className='mt-8 grid gap-4 md:grid-cols-3'>
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              className='glass rounded-2xl p-6'
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <blockquote className='text-sm text-slate-300'>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className='mt-4 text-sm'>
                <div className='font-semibold text-white'>{t.name}</div>
                <div className='text-slate-500'>{t.title}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
