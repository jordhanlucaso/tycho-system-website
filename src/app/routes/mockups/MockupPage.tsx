import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { mockups } from '../../../config/mockups'
import { Container } from '../../components/layout/Container'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'

export function MockupPage() {
  const { slug } = useParams()

  const mockup = useMemo(() => mockups.find((m) => m.slug === slug), [slug])

  if (!mockup) {
    return (
      <div className='min-h-dvh bg-white text-neutral-900'>
        <Navbar />
        <main className='py-16'>
          <Container>
            <h1 className='text-2xl font-semibold'>Mockup not found</h1>
            <p className='mt-2 text-sm text-neutral-600'>This preview link doesn’t exist. Go back to the homepage and pick a mockup.</p>
            <a href='/' className='mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90'>
              Back to home
            </a>
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
                {mockup.category} · {mockup.city}
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
              <div className='space-y-3'>
                <div className='h-44 rounded-2xl bg-white' />
                <div className='h-11 rounded-xl bg-white' />
                <div className='h-11 rounded-xl bg-white' />
                <div className='h-11 rounded-xl bg-white' />
                <p className='pt-2 text-xs text-neutral-500'>Replace this placeholder with a screenshot later (or render a real template).</p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
