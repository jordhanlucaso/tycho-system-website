import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — Tycho Systems'
  }, [])

  return (
    <div className='min-h-dvh'>
      <Navbar />
      <main className='py-16'>
        <Container>
          <article className='mx-auto max-w-3xl text-[var(--text-body)]'>
            <h1 className='text-4xl font-semibold text-[var(--text-primary)]'>Terms of Service — Tycho Systems</h1>
            <p className='mt-2 text-sm text-[var(--text-muted)]'><em>Last updated: 2026-06-04</em></p>

            <p className='mt-6 text-[var(--text-secondary)]'>
              These terms govern your use of the Tycho Systems website (<strong>tychosystem.com</strong>) and any digital products you purchase through it, including products sold through our checkout partner Lemon Squeezy.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>1. Who we are</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              The Tycho Systems brand is operated by <strong>Tycho Systems Oliveira e Silva ENK</strong>, a Norwegian sole proprietorship (enkeltpersonforetak). You can contact us at <strong>felix@tychosystem.com</strong> for any question about these terms, your purchase, or your account.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              For the purposes of payment processing, <strong>Lemon Squeezy</strong> acts as the Merchant of Record. They handle the transaction, collect any applicable VAT/sales tax, and issue your receipt.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>2. What we sell</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We sell <strong>digital products</strong> — primarily downloadable Markdown/PDF documents, prompt packs, and setup kits related to OpenClaw, AI agents, and small-business automation. Products are delivered as instant downloads after payment. Each product page lists exactly what's included.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We do <strong>not</strong> sell subscriptions on this storefront unless a product is explicitly labelled as a subscription on its sales page.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>3. Your purchase</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>When you buy a product:</p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>You receive a license to use the contents for your own personal or internal business use.</li>
              <li>You may not resell, redistribute, or relicense the product or its contents.</li>
              <li>Reasonable internal sharing within your own team or company is fine.</li>
              <li>Sharing publicly (uploading to public repos, content farms, etc.) is not.</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>
              If a product includes a separate <code className='rounded bg-[var(--bg-surface)] px-1.5 py-0.5 text-sm'>LICENSE</code> file in the download, that file takes precedence over this section for that specific product.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>4. What we don't promise</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Our products are <strong>independent companions</strong> to the third-party tools they cover (e.g. OpenClaw). We are not affiliated with, endorsed by, or operated by those projects unless explicitly stated.
            </p>
            <p className='mt-3 text-[var(--text-secondary)]'>We do <strong>not</strong> guarantee:</p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>That a product will fix every issue you encounter.</li>
              <li>Specific income, uptime, or business outcomes from using a product.</li>
              <li>That upstream tools will keep behaving the way our docs describe.</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We do our best to keep content accurate and updated, and we publish change logs. But you use our products at your own discretion.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>5. Refunds</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              See our <Link to='/refunds' className='text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80'>Refund Policy</Link>. In short: if a product isn't useful to you, email us within <strong>14 days</strong> of purchase and we'll refund it.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>6. Acceptable use</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>Don't use our products or website to:</p>
            <ul className='mt-3 list-disc space-y-2 pl-6 text-[var(--text-secondary)]'>
              <li>Break the law.</li>
              <li>Infringe anyone's rights (privacy, IP, etc.).</li>
              <li>Misrepresent our products as official or as your own work.</li>
              <li>Try to access accounts or data that aren't yours.</li>
            </ul>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We may refuse service or revoke a license if these terms are clearly violated.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>7. Updates to these terms</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              We may update these terms when the product catalog, payment partner, or legal context changes. The <strong>Last updated</strong> date at the top reflects the latest revision. Material changes affecting purchases already made will not apply retroactively.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>8. Governing law</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              These terms are governed by Norwegian law. If a dispute can't be resolved amicably by email, it will be handled by the competent courts of the seller's domicile in Norway, except where consumer-protection law in your jurisdiction requires otherwise.
            </p>

            <h2 className='mt-10 text-2xl font-semibold text-[var(--text-primary)]'>9. Contact</h2>
            <p className='mt-3 text-[var(--text-secondary)]'>
              Questions, refunds, or anything else: <strong>felix@tychosystem.com</strong>.
            </p>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
