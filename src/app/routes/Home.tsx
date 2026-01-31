import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/blocks/Hero'
import { Services } from '../components/blocks/Services'
import { Gallery } from '../components/blocks/Gallery'
import { Testimonials } from '../components/blocks/Testimonials'
import { Pricing } from '../components/blocks/Pricing'
import { FAQ } from '../components/blocks/FAQ'
import { Contact } from '../components/blocks/Contact'

export function Home() {
  return (
    <div className='min-h-screen font-sans bg-white text-neutral-900'>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
