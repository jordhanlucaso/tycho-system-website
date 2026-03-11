import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
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
import { SalesLayout } from '../app/components/layout/SalesLayout'
import { SalesNewSale } from '../app/routes/sales/NewSale'
import { site } from '../config/site'
import { mockups } from '../config/mockups'
import { services } from '../config/services'
import { oneTimePackages } from '../config/pricing'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter><AuthProvider><ThemeProvider><CartProvider>{ui}</CartProvider></ThemeProvider></AuthProvider></BrowserRouter>)
}

function renderWithSalesRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/sales']}>
      <AuthProvider><ThemeProvider><CartProvider>{ui}</CartProvider></ThemeProvider></AuthProvider>
    </MemoryRouter>
  )
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
    renderWithRouter(<Hero />)
    expect(screen.getByText(site.tagline)).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    renderWithRouter(<Hero />)
    expect(screen.getByText(site.ctas.primary)).toBeInTheDocument()
    expect(screen.getByText(site.ctas.secondary)).toBeInTheDocument()
  })
})

describe('Services', () => {
  it('renders all service items from config', () => {
    renderWithRouter(<Services />)
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
  it('renders one-time packages by default', () => {
    renderWithRouter(<Pricing />)
    for (const pkg of oneTimePackages) {
      expect(screen.getByText(pkg.name)).toBeInTheDocument()
    }
  })

  it('renders care plans section', () => {
    renderWithRouter(<Pricing />)
    expect(screen.getByText('Monthly care plans')).toBeInTheDocument()
  })

  it('renders CTA buttons for one-time packages', () => {
    renderWithRouter(<Pricing />)
    for (const pkg of oneTimePackages) {
      expect(screen.getByText(pkg.cta)).toBeInTheDocument()
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
  it('renders the contact section heading', () => {
    renderWithRouter(<Contact />)
    expect(screen.getByText('Have a question?')).toBeInTheDocument()
  })

  it('renders the website check CTA', () => {
    renderWithRouter(<Contact />)
    expect(screen.getByText('Free 5-Point Website Check')).toBeInTheDocument()
    expect(screen.getByText('Get my free website check')).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('renders the agency name', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(site.agencyName)).toBeInTheDocument()
  })
})

describe('SalesLayout', () => {
  it('renders sales navigation links', () => {
    renderWithSalesRouter(<SalesLayout />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('New Sale')).toBeInTheDocument()
    expect(screen.getByText('Clients')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders the Sales badge', () => {
    renderWithSalesRouter(<SalesLayout />)
    expect(screen.getByText('Sales')).toBeInTheDocument()
  })
})

describe('SalesNewSale', () => {
  it('renders the new sale form', () => {
    // Mock fetch to prevent unhandled promise rejections
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
    renderWithSalesRouter(<SalesNewSale />)
    expect(screen.getByText('New Sale')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Smith Plumbing LLC')).toBeInTheDocument()
    expect(screen.getByText('Save lead')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
