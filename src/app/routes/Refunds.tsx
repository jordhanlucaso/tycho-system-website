import { useEffect } from 'react'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function Refunds() {
  useEffect(() => {
    document.title = 'Refund Policy — Tycho Systems'
  }, [])

  return (
    <div className='min-h-dvh'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <article className='mx-auto max-w-3xl text-[var(--text-body)]'>
            <h1 className='text-4xl font-semibold text-[var(--text-primary)]'>Refund Policy — Tycho Systems</h1>
            <p className='mt-2 text-sm text-[var(--text-muted)]'><em>Last updated: 2026-06-04</em></p>

            <p className='mt-6 text-[var(--text-secondary)]'>
              We sell digital downloads. Once a product is delivered, it's yours — but we believe a fair refund policy makes more sense than locking people in.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>The short version</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              If a product isn't useful to you, email <strong>felix@tychosystem.com</strong> within <strong>14 days</strong> of your purchase and we'll refund it. No interrogation, no hoops.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>The detail</h2>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>What's covered</h3>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>Any one-time digital product purchased through tychosystem.com or through our Lemon Squeezy store, requested within 14 days of the receipt date.</li>
            </ul>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>What we ask</h3>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>A one-line reason. Optional, but appreciated — it helps us improve.</li>
            </ul>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>What's not covered</h3>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>Refunds requested more than 14 days after purchase.</li>
              <li>Repeated refund-then-rebuy patterns on the same product (we may decline future refunds for the same item).</li>
              <li>Issues that are clearly upstream bugs in third-party tools the product covers. We'll always tell you when that's the case, and point you to the project's issue tracker — but we can't refund based on someone else's broken software.</li>
            </ul>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>How refunds are processed</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Refunds are issued through our payment processor, <strong>Lemon Squeezy</strong>, back to the original payment method. Processing typically takes a few business days depending on your bank or card issuer.
            </p>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>EEA consumer-law note</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              If you're in the EEA, you may have additional statutory rights. Under EU consumer-protection law, the 14-day right of withdrawal for digital content can be waived once you've started the download — but our 14-day refund offer above applies regardless. If your local law gives you a stronger right, that local right also applies.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>How to ask for a refund</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Just email <strong>felix@tychosystem.com</strong> with:
            </p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>The email address you used to purchase, OR</li>
              <li>Your order ID from the receipt</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>That's it. We'll confirm and process it.</p>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
