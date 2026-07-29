import { Link } from 'react-router'
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
            <h1 className='mt-4 text-2xl font-semibold text-[var(--text-primary)]'>Page not found</h1>
            <p className='mt-2 text-sm text-[var(--text-secondary)]'>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to='/' className='mt-6 inline-flex rounded-xl bg-[var(--azure)] px-5 py-3 text-sm font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--azure-hover)]'>
              Back to home
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
