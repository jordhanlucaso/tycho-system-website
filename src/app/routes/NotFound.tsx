import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function NotFound() {
  return (
    <div className='min-h-dvh'>
      <Navbar />
      <main className='py-24'>
        <Container>
          <div className='mx-auto max-w-md text-center'>
            <div className='text-gradient text-6xl font-semibold'>404</div>
            <h1 className='mt-4 text-2xl font-semibold text-white'>Page not found</h1>
            <p className='mt-2 text-sm text-slate-400'>
              The page you're looking for doesn't exist or has been moved.
            </p>
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
