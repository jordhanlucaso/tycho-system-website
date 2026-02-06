import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function NotFound() {
  return (
    <div className='min-h-dvh bg-white text-neutral-900'>
      <Navbar />
      <main className='py-24'>
        <Container>
          <div className='mx-auto max-w-md text-center'>
            <div className='text-6xl font-semibold text-neutral-300'>404</div>
            <h1 className='mt-4 text-2xl font-semibold tracking-tight'>Page not found</h1>
            <p className='mt-2 text-sm text-neutral-600'>
              The page you're looking for doesn't exist or has been moved.
            </p>
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
