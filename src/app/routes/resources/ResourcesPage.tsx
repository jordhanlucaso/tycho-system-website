import { useEffect } from 'react'
import { site } from '../../../config/site'
import { captureAttribution } from '../../lib/attribution'
import { useSeo } from '../../lib/seo'
import { SiteNav } from '../../components/home/SiteNav'
import { SiteFooter } from '../../components/home/SiteFooter'
import { ResourceSelector } from '../../components/resources/ResourceSelector'

export function ResourcesPage() {
  useSeo({
    title: `Free Guides & Resources | ${site.agencyName}`,
    description:
      'Choose the free guide that fits your role: the AI Operations Pain Map for business leaders, or the Practical AI Dictionary for AI builders and learners.',
    path: '/resources',
  })

  useEffect(() => {
    captureAttribution()
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg-primary)] font-sans text-[var(--text-body)]">
      <SiteNav />
      <main>
        <section className="relative">
          <div
            aria-hidden="true"
            className="obs-glow pointer-events-none absolute left-1/2 top-[-160px] z-0 h-[420px] w-[800px] -translate-x-1/2"
          />
          <div className="relative z-[2] mx-auto max-w-[1200px] px-[clamp(20px,6vw,80px)] py-[clamp(56px,8vw,104px)]">
            <ResourceSelector context="resources_page" showAudienceStatements />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
