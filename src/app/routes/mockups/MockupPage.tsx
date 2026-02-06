import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { mockups } from '../../../config/mockups'
import { site } from '../../../config/site'
import { Container } from '../../components/layout/Container'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'

export function MockupPage() {
  const { slug } = useParams()
  const mockup = useMemo(() => mockups.find((m) => m.slug === slug), [slug])

  useEffect(() => {
    document.title = mockup
      ? `${mockup.name} — ${mockup.category} in ${mockup.city} | ${site.agencyName}`
      : `Mockup not found | ${site.agencyName}`
  }, [mockup])

  if (!mockup) {
    return (
      <div className='min-h-dvh'>
        <Navbar />
        <main className='py-24'>
          <Container>
            <div className='mx-auto max-w-md text-center'>
              <div className='text-gradient text-6xl font-semibold'>404</div>
              <h1 className='mt-4 text-2xl font-semibold text-white'>Mockup not found</h1>
              <p className='mt-2 text-sm text-slate-400'>This preview link doesn't exist. Go back to the homepage and pick a mockup.</p>
              <a href='/' className='mt-6 inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'>
                Back to home
              </a>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className='min-h-dvh'>
      <Navbar />

      <main className='py-16'>
        <Container>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-slate-400'>Preview page</div>
              <h1 className='text-gradient text-3xl font-semibold tracking-tight'>{mockup.name}</h1>
              <p className='text-sm text-slate-400'>
                {mockup.category} &middot; {mockup.city}
              </p>
              <p className='max-w-prose text-base text-slate-300'>{mockup.tagline}</p>

              <div className='flex flex-wrap gap-3 pt-3'>
                <a href='/#contact' className='rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'>
                  Request this style
                </a>
                <a href='/#mockups' className='rounded-xl border border-white/[0.15] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white'>
                  Back to mockups
                </a>
              </div>
            </div>

            {/* Preview panel */}
            <div className='glass w-full max-w-xl rounded-2xl p-6'>
              {mockup.previewUrl ? (
                <img
                  src={mockup.previewUrl}
                  alt={`${mockup.name} website preview`}
                  className='w-full rounded-xl border border-white/[0.08]'
                />
              ) : (
                <div className='space-y-3'>
                  <div className='rounded-xl border border-white/[0.06] bg-white/[0.02]'>
                    <div className='flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2'>
                      <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                      <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                      <span className='h-2 w-2 rounded-full bg-white/[0.15]' />
                      <div className='ml-2 h-4 flex-1 rounded-md bg-white/[0.04]' />
                    </div>
                    <div className='space-y-3 p-4'>
                      <div className='h-32 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10' />
                      <div className='h-4 w-3/4 rounded bg-white/[0.06]' />
                      <div className='h-4 w-1/2 rounded bg-white/[0.04]' />
                      <div className='grid grid-cols-3 gap-2'>
                        <div className='h-16 rounded-lg bg-white/[0.04]' />
                        <div className='h-16 rounded-lg bg-white/[0.04]' />
                        <div className='h-16 rounded-lg bg-white/[0.04]' />
                      </div>
                      <div className='h-4 w-2/3 rounded bg-white/[0.04]' />
                    </div>
                  </div>
                  <p className='text-center text-xs text-slate-600'>
                    Preview screenshot coming soon. <a href='/#contact' className='text-cyan-400 underline underline-offset-2'>Request this mockup</a> to see the full design.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
