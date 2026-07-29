import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { site } from '../../config/site'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { useSeo } from '../lib/seo'
import { SiteNav } from '../components/home/SiteNav'
import { Hero } from '../components/home/Hero'
import { AudienceLine } from '../components/home/AudienceLine'
import { Process } from '../components/home/Process'
import { SelectedWork } from '../components/home/SelectedWork'
import { Services } from '../components/home/Services'
import { AutomationCare } from '../components/home/AutomationCare'
import { GuideSelector } from '../components/home/GuideSelector'
import { Cta } from '../components/home/Cta'
import { SiteFooter } from '../components/home/SiteFooter'

export function Home() {
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()

  useSeo({
    title: `${site.agencyName} | AI Automation, Websites and Business Systems`,
    description: site.description,
    path: '/',
  })

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const target = document.getElementById(id)
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
  }, [location.hash])

  return (
    <div
      className="min-h-screen overflow-hidden bg-[var(--bg-primary)] font-sans text-[var(--text-body)]"
      data-tycho-motion={prefersReducedMotion ? 'off' : 'on'}
    >
      <SiteNav />
      <main>
        <Hero heroVisual="2D orbit" animate={!prefersReducedMotion} />
        <AudienceLine />
        <Process />
        <SelectedWork />
        <Services />
        <AutomationCare />
        <GuideSelector />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
