import { motion } from 'motion/react'
import { Container } from '../layout/Container'
import { faq } from '../../../config/faq'

export function FAQ() {
  return (
    <section id='faq' className='border-t border-white/[0.06] py-16'>
      <Container>
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-gradient text-2xl font-semibold tracking-tight'>FAQ</h2>
          <p className='max-w-prose text-sm text-slate-400'>Quick answers to common questions.</p>
        </motion.div>

        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          {faq.map((item, i) => (
            <motion.details
              key={item.q}
              className='glass glass-hover group rounded-2xl p-6 transition-all'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <summary className='cursor-pointer list-none text-sm font-semibold text-white'>
                <div className='flex items-start justify-between gap-4'>
                  <span>{item.q}</span>
                  <span className='select-none text-slate-500 transition-transform group-open:rotate-45'>+</span>
                </div>
              </summary>
              <div className='mt-3 text-sm text-slate-400'>{item.a}</div>
            </motion.details>
          ))}
        </div>
      </Container>
    </section>
  )
}
