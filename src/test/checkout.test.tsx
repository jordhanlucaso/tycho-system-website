import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider, useCart } from '../app/lib/cart'
import { ThemeProvider } from '../app/lib/theme'
import { Checkout } from '../app/routes/Checkout'
import { tiers } from '../config/pricing'
import { useEffect } from 'react'

// Helper to pre-populate cart before rendering Checkout
function CartSeeder({ items }: { items: typeof tiers }) {
  const cart = useCart()
  useEffect(() => {
    for (const item of items) cart.addItem(item)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function renderCheckout(items = tiers.slice(0, 2)) {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <ThemeProvider>
        <CartProvider>
          <CartSeeder items={items} />
          <Checkout />
        </CartProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('Checkout', () => {
  it('renders order summary with cart items', async () => {
    await act(async () => {
      renderCheckout([tiers[0], tiers[1]])
    })
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders customer info form fields', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@business.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Acme Plumbing Co.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('(555) 123-4567')).toBeInTheDocument()
  })

  it('renders pay button', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getByText('Pay with Stripe')).toBeInTheDocument()
  })

  it('shows order totals', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getAllByText('$399').length).toBeGreaterThan(0)
  })
})
