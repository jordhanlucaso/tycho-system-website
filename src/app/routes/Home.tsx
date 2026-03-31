import { useEffect } from 'react'
import { site } from '../../config/site'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { CartDrawer } from '../components/layout/CartDrawer'
import { Hero } from '../components/blocks/Hero'
import { WhoItsFor } from '../components/blocks/WhoItsFor'
import { Pricing } from '../components/blocks/Pricing'
import { ProcessSteps } from '../components/blocks/ProcessSteps'
import { Services } from '../components/blocks/Services'
import { Testimonials } from '../components/blocks/Testimonials'
import { CTABanner } from '../components/blocks/CTABanner'
import { FAQ } from '../components/blocks/FAQ'
import { Contact } from '../components/blocks/Contact'

export function Home() {
  useEffect(() => {
    document.title = `${site.agencyName} | Websites for Local Businesses`
  }, [])

  return (
    <div className='min-h-screen font-sans'>
      <Navbar />
      <main>
        <Hero />
        <WhoItsFor />
        <Pricing />
        <ProcessSteps />
        <Services />
        <Testimonials />
        <FAQ />
        <CTABanner
          headline='Ready to get your business online properly?'
          subheadline="Book a call and we'll walk you through the fastest path from where you are now to a site you're proud of."
          primaryLabel='Book a strategy call'
          primaryTo='/website-check'
          secondaryLabel='See packages'
          secondaryHref='#packages'
        />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
