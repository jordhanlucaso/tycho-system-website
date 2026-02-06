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
      <div className='min-h-dvh bg-white text-neutral-900'>
        <Navbar />
        <main className='py-24'>
          <Container>
            <div className='mx-auto max-w-md text-center'>
              <div className='text-6xl font-semibold text-neutral-300'>404</div>
              <h1 className='mt-4 text-2xl font-semibold'>Mockup not found</h1>
              <p className='mt-2 text-sm text-neutral-600'>This preview link doesn't exist. Go back to the homepage and pick a mockup.</p>
              <a href='/' className='mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90'>
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
    <div className='min-h-dvh bg-white text-neutral-900'>
      <Navbar />

      <main className='py-16'>
        <Container>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-3'>
              <div className='inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600'>Preview page</div>
              <h1 className='text-3xl font-semibold tracking-tight'>{mockup.name}</h1>
              <p className='text-sm text-neutral-600'>
                {mockup.category} &middot; {mockup.city}
              </p>
              <p className='max-w-prose text-base text-neutral-700'>{mockup.tagline}</p>

              <div className='flex flex-wrap gap-3 pt-3'>
                <a href='/#contact' className='rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90'>
                  Request this style
                </a>
                <a href='/#mockups' className='rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50'>
                  Back to mockups
                </a>
              </div>
            </div>

            {/* Preview panel */}
            <div className='w-full max-w-xl rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm'>
              {mockup.previewUrl ? (
                <img
                  src={mockup.previewUrl}
                  alt={`${mockup.name} website preview`}
                  className='w-full rounded-2xl border border-neutral-200'
                />
              ) : (
                <div className='space-y-3'>
                  {/* Skeleton: browser chrome mockup */}
                  <div className='rounded-2xl border border-neutral-200 bg-white'>
                    <div className='flex items-center gap-1.5 border-b border-neutral-100 px-3 py-2'>
                      <span className='h-2 w-2 rounded-full bg-neutral-300' />
                      <span className='h-2 w-2 rounded-full bg-neutral-300' />
                      <span className='h-2 w-2 rounded-full bg-neutral-300' />
                      <div className='ml-2 h-4 flex-1 rounded-md bg-neutral-100' />
                    </div>
                    <div className='space-y-3 p-4'>
                      <div className='h-32 rounded-xl bg-neutral-100' />
                      <div className='h-4 w-3/4 rounded bg-neutral-100' />
                      <div className='h-4 w-1/2 rounded bg-neutral-100' />
                      <div className='grid grid-cols-3 gap-2'>
                        <div className='h-16 rounded-lg bg-neutral-100' />
                        <div className='h-16 rounded-lg bg-neutral-100' />
                        <div className='h-16 rounded-lg bg-neutral-100' />
                      </div>
                      <div className='h-4 w-2/3 rounded bg-neutral-100' />
                    </div>
                  </div>
                  <p className='text-center text-xs text-neutral-500'>
                    Preview screenshot coming soon. <a href='/#contact' className='underline underline-offset-2'>Request this mockup</a> to see the full design.
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
