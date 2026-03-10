import { useEffect } from 'react'
import { site } from '../../config/site'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CartDrawer } from '../components/layout/CartDrawer'
import { Hero } from '../components/blocks/Hero'
import { ProcessSteps } from '../components/blocks/ProcessSteps'
import { Services } from '../components/blocks/Services'
import { Gallery } from '../components/blocks/Gallery'
import { Testimonials } from '../components/blocks/Testimonials'
import { Pricing } from '../components/blocks/Pricing'
import { CTABanner } from '../components/blocks/CTABanner'
import { FAQ } from '../components/blocks/FAQ'
import { Contact } from '../components/blocks/Contact'

export function Home() {
  useEffect(() => {
    document.title = `${site.agencyName} — Professional Websites for Local Businesses`
  }, [])

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main>
        <Hero />
        <ProcessSteps />
        <Services />
        <Gallery />
        <Testimonials />
        <Pricing />
        <CTABanner
          headline='Not sure where to start?'
          subheadline='Get a free 5-point check on your current website. No commitment, no hard sell — just honest feedback.'
          primaryLabel='Get my free website check'
          primaryTo='/website-check'
          secondaryLabel='See pricing'
          secondaryHref='#pricing'
        />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
