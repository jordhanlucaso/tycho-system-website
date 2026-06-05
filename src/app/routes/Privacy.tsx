import { useEffect } from 'react'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Tycho Systems'
  }, [])

  return (
    <div className='min-h-dvh'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <article className='mx-auto max-w-3xl text-[var(--text-body)]'>
            <h1 className='text-4xl font-semibold text-[var(--text-primary)]'>Privacy Policy — Tycho Systems</h1>
            <p className='mt-2 text-sm text-[var(--text-muted)]'><em>Last updated: 2026-06-04</em></p>

            <p className='mt-6 text-[var(--text-secondary)]'>
              This policy explains what data we collect when you visit <strong>tychosystem.com</strong> or buy a product, and what we do with it. We aim to collect as little as possible.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>1. Who is the data controller</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              <strong>Tycho Systems Oliveira e Silva ENK</strong>, a Norwegian sole proprietorship (enkeltpersonforetak). Contact: <strong>felix@tychosystem.com</strong>.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Because Norway is part of the EEA, the <strong>GDPR</strong> (and Norwegian Personal Data Act) apply to how we handle personal data.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>2. What we collect and why</h2>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>a. When you buy a product</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Your purchase is processed by <strong>Lemon Squeezy</strong>, which acts as our Merchant of Record. They collect the data they need to complete the sale: your email, name, billing/country info, and payment method. We receive a summary of the transaction (order ID, product, amount, customer email) so we can deliver your product and answer support questions.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              <strong>Legal basis:</strong> performance of the contract you entered into when you bought the product.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Lemon Squeezy's own privacy practices apply to the payment data they hold. See: <a href='https://www.lemonsqueezy.com/privacy' target='_blank' rel='noreferrer' className='text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80'>https://www.lemonsqueezy.com/privacy</a>.
            </p>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>b. When you sign up for a free lead magnet or newsletter</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We collect your <strong>email address</strong> and the date you subscribed. We use it only to deliver the resource you asked for and, if you opted in, occasional product updates. You can unsubscribe at any time using the link in any email.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              <strong>Legal basis:</strong> your consent.
            </p>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>c. When you visit the site</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We use <strong>Plausible Analytics</strong>, a privacy-friendly analytics tool that does not use cookies, does not track you across sites, and does not collect personally identifiable information. It records aggregate metrics like page views, referrer, country, and browser type. See: <a href='https://plausible.io/data-policy' target='_blank' rel='noreferrer' className='text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80'>https://plausible.io/data-policy</a>.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              <strong>Legal basis:</strong> legitimate interest in understanding how visitors find and use the site.
            </p>

            <h3 className='mt-6 text-xl font-semibold text-[var(--text-primary)]'>d. When you email us</h3>
            <p className='mt-3 text-[var(--text-secondary)]'>
              The email account that receives your message stores it for as long as it's relevant to support or our records.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              <strong>Legal basis:</strong> legitimate interest in responding to you.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>3. What we do NOT do</h2>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>We don't sell your data.</li>
              <li>We don't share it with advertisers.</li>
              <li>We don't run third-party tracking pixels (no Meta pixel, no Google Analytics, no remarketing).</li>
              <li>We don't enrich your data from external sources.</li>
            </ul>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>4. Who else sees your data</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>The minimum third parties needed to operate the business:</p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li><strong>Lemon Squeezy</strong> — payment processing + tax (Merchant of Record).</li>
              <li><strong>Plausible Analytics</strong> — anonymous site metrics.</li>
              <li><strong>Fastmail</strong> — email hosting for support correspondence.</li>
              <li><strong>Vercel</strong> — website hosting (logs request metadata such as IP and user agent for delivery and security; standard for any CDN-fronted site).</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Each operates under their own privacy terms. We pick providers that meet GDPR standards.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>5. Retention</h2>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li><strong>Order data:</strong> kept for as long as legally required for tax and consumer-protection records (typically 5 years in Norway), then deleted.</li>
              <li><strong>Newsletter / lead-magnet emails:</strong> kept until you unsubscribe.</li>
              <li><strong>Support emails:</strong> kept while they may still be relevant; deleted on request.</li>
            </ul>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>6. Your rights (GDPR)</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>You have the right to:</p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Correct</strong> any inaccuracies.</li>
              <li><strong>Delete</strong> your data (subject to legal-retention exceptions).</li>
              <li><strong>Export</strong> your data in a portable format.</li>
              <li><strong>Object</strong> to processing based on legitimate interest.</li>
              <li><strong>Withdraw consent</strong> at any time (for newsletter, lead magnet, etc.).</li>
              <li><strong>Complain</strong> to the Norwegian Data Protection Authority (Datatilsynet) if you think we've mishandled your data.</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>
              To exercise any of these, email <strong>felix@tychosystem.com</strong> and we'll respond within 30 days.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>7. International transfers</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Some of our providers are based outside the EEA. When that's the case, we rely on the provider's GDPR-compatible safeguards (Standard Contractual Clauses, Adequacy Decisions, or equivalent).
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>8. Updates to this policy</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              When this policy changes materially we'll update the <strong>Last updated</strong> date at the top and announce the change in our newsletter or on the site.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>9. Contact</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Privacy questions or rights requests: <strong>felix@tychosystem.com</strong>.
            </p>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
