import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../app/lib/auth'
import { CartProvider, useCart } from '../app/lib/cart'
import { ThemeProvider } from '../app/lib/theme'
import { Checkout } from '../app/routes/Checkout'
import { SignContract } from '../app/routes/SignContract'
import { tiers, oneTimePackages } from '../config/pricing'
import { useEffect } from 'react'

// Helper to pre-populate cart before rendering
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
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <CartSeeder items={items} />
            <Checkout />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

function renderSignContract(items = [tiers[0]]) {
  return render(
    <MemoryRouter initialEntries={['/checkout/sign']}>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <CartSeeder items={items} />
            <SignContract />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  sessionStorage.clear()
  vi.restoreAllMocks()
})

describe('Checkout (Step 1 — Customer Info)', () => {
  it('renders order summary with cart items', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getByText('Starter Site')).toBeInTheDocument()
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

  it('renders Continue to agreement button', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getByText('Continue to agreement')).toBeInTheDocument()
  })

  it('renders progress steps', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getAllByText('Your details').length).toBeGreaterThan(0)
    expect(screen.getByText('Sign agreement')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
  })

  it('renders What happens next section', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    expect(screen.getByText('What happens next')).toBeInTheDocument()
  })

  it('shows one-time total', async () => {
    await act(async () => {
      renderCheckout([tiers[0]])
    })
    // starter-website priceInCents=199000 → $1,990
    expect(screen.getAllByText(/\$1,990/).length).toBeGreaterThan(0)
  })
})

describe('SignContract (Step 2 — Agreement & Payment)', () => {
  it('renders fallback when sessionStorage is empty', async () => {
    await act(async () => {
      renderSignContract()
    })
    expect(screen.getByText('No agreement found. Please start from checkout.')).toBeInTheDocument()
  })

  it('renders contract review UI when contract data in sessionStorage', async () => {
    sessionStorage.setItem('contract_id', 'test-contract-id')
    sessionStorage.setItem('contract_text', 'WEB DEVELOPMENT SERVICES AGREEMENT\nThis is a test contract.')

    await act(async () => {
      renderSignContract()
    })

    expect(screen.getByText('Review your agreement')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your full legal name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign agreement/i })).toBeInTheDocument()
  })

  it('sign button is disabled until checkbox checked and name entered', async () => {
    sessionStorage.setItem('contract_id', 'test-contract-id')
    sessionStorage.setItem('contract_text', 'Test contract.')

    await act(async () => {
      renderSignContract()
    })

    const btn = screen.getByRole('button', { name: /sign agreement/i })
    expect(btn).toBeDisabled()

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'))
    })
    expect(btn).toBeDisabled() // still disabled — no name

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Your full legal name'), {
        target: { value: 'Jane Doe' },
      })
    })
    expect(btn).not.toBeDisabled()
  })

  it('transitions to payment step after signing', async () => {
    sessionStorage.setItem('contract_id', 'ctr-123')
    sessionStorage.setItem('contract_text', 'Test contract.')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ signed: true }), { status: 200 })
    )

    await act(async () => {
      renderSignContract()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'))
      fireEvent.change(screen.getByPlaceholderText('Your full legal name'), {
        target: { value: 'Jane Doe' },
      })
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign agreement/i }))
    })

    await waitFor(() => {
      expect(screen.getByText('Agreement signed!')).toBeInTheDocument()
    })
  })

  it('shows single deposit payment button after signing', async () => {
    sessionStorage.setItem('contract_id', 'ctr-deposit')
    sessionStorage.setItem('contract_text', 'Test contract.')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ signed: true }), { status: 200 })
    )

    render(
      <MemoryRouter initialEntries={['/checkout/sign']}>
        <AuthProvider><ThemeProvider>
          <CartProvider>
            <CartSeeder items={[oneTimePackages[0]]} />
            <SignContract />
          </CartProvider>
        </ThemeProvider></AuthProvider>
      </MemoryRouter>
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox'))
      fireEvent.change(screen.getByPlaceholderText('Your full legal name'), {
        target: { value: 'Jane Doe' },
      })
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign agreement/i }))
    })

    await waitFor(() => {
      expect(screen.getByText(/Pay deposit/i)).toBeInTheDocument()
    })
  })
})
