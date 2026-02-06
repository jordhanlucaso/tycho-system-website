import { Container } from '../layout/Container'
import { faq } from '../../../config/faq'

export function FAQ() {
  return (
    <section id='faq' className='border-t border-neutral-200 bg-white py-16'>
      <Container>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>FAQ</h2>
          <p className='max-w-prose text-sm text-neutral-600'>Quick answers to common questions.</p>
        </div>

        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          {faq.map((item) => (
            <details key={item.q} className='group rounded-3xl border border-neutral-200 p-6 shadow-sm'>
              <summary className='cursor-pointer list-none text-sm font-semibold'>
                <div className='flex items-start justify-between gap-4'>
                  <span>{item.q}</span>
                  <span className='select-none text-neutral-500 group-open:rotate-45'>+</span>
                </div>
              </summary>
              <div className='mt-3 text-sm text-neutral-700'>{item.a}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
