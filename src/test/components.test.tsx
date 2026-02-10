import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../app/lib/auth'
import { CartProvider } from '../app/lib/cart'
import { ThemeProvider } from '../app/lib/theme'
import { Navbar } from '../app/components/layout/Navbar'
import { Footer } from '../app/components/layout/Footer'
import { Hero } from '../app/components/blocks/Hero'
import { Services } from '../app/components/blocks/Services'
import { Gallery } from '../app/components/blocks/Gallery'
import { Pricing } from '../app/components/blocks/Pricing'
import { FAQ } from '../app/components/blocks/FAQ'
import { Contact } from '../app/components/blocks/Contact'
import { Testimonials } from '../app/components/blocks/Testimonials'
import { site } from '../config/site'
import { mockups } from '../config/mockups'
import { services } from '../config/services'
import { tiers } from '../config/pricing'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter><AuthProvider><ThemeProvider><CartProvider>{ui}</CartProvider></ThemeProvider></AuthProvider></BrowserRouter>)
}

function renderWithCart(ui: React.ReactElement) {
  return render(<AuthProvider><ThemeProvider><CartProvider>{ui}</CartProvider></ThemeProvider></AuthProvider>)
}

describe('Navbar', () => {
  it('renders the agency logo', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByAltText(site.agencyName)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Mockups').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pricing').length).toBeGreaterThan(0)
  })

  it('renders the mobile menu button', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    renderWithRouter(<Navbar />)
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })
})

describe('Hero', () => {
  it('renders the tagline', () => {
    render(<Hero />)
    expect(screen.getByText(site.tagline)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Hero />)
    expect(screen.getByText(site.ctas.primary)).toBeInTheDocument()
    expect(screen.getByText(site.ctas.secondary)).toBeInTheDocument()
  })
})

describe('Services', () => {
  it('renders all service items from config', () => {
    render(<Services />)
    for (const s of services) {
      expect(screen.getByText(s.title)).toBeInTheDocument()
    }
  })
})

describe('Gallery', () => {
  it('renders all mockup cards', () => {
    renderWithRouter(<Gallery />)
    for (const m of mockups) {
      expect(screen.getByText(m.name)).toBeInTheDocument()
    }
  })

  it('links to mockup preview pages', () => {
    renderWithRouter(<Gallery />)
    const links = screen.getAllByText('Open preview →')
    expect(links.length).toBe(mockups.length)
  })
})

describe('Pricing', () => {
  it('renders all pricing tiers from config', () => {
    renderWithCart(<Pricing />)
    for (const t of tiers) {
      expect(screen.getByText(t.name)).toBeInTheDocument()
      expect(screen.getByText(t.price)).toBeInTheDocument()
    }
  })
})

describe('FAQ', () => {
  it('renders FAQ section heading', () => {
    render(<FAQ />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })
})

describe('Testimonials', () => {
  it('renders testimonial section', () => {
    render(<Testimonials />)
    expect(screen.getByText('Results & trust')).toBeInTheDocument()
  })
})

describe('Contact', () => {
  it('renders the contact form', () => {
    render(<Contact />)
    expect(screen.getByText('Request a free mockup')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Example Plumbing Co.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('owner@business.com')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<Contact />)
    expect(screen.getByText('Send request')).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('renders the agency name', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(site.agencyName)).toBeInTheDocument()
  })
})
