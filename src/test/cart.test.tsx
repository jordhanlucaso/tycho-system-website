import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../app/lib/cart'
import { tiers } from '../config/pricing'

function CartTestHarness() {
  const cart = useCart()
  return (
    <div>
      <span data-testid='count'>{cart.itemCount}</span>
      <span data-testid='one-time'>{cart.oneTimeTotal}</span>
      <span data-testid='recurring'>{cart.recurringTotal}</span>
      <span data-testid='is-open'>{String(cart.isOpen)}</span>
      {tiers.map((t) => (
        <button key={t.id} data-testid={`add-${t.id}`} onClick={() => cart.addItem(t)}>
          Add {t.name}
        </button>
      ))}
      {cart.items.map((item) => (
        <button key={item.id} data-testid={`remove-${item.id}`} onClick={() => cart.removeItem(item.id)}>
          Remove {item.name}
        </button>
      ))}
      <button data-testid='clear' onClick={() => cart.clear()}>Clear</button>
      <button data-testid='toggle' onClick={() => cart.toggleDrawer()}>Toggle</button>
      {tiers.map((t) => (
        <span key={t.id} data-testid={`has-${t.id}`}>{String(cart.hasItem(t.id))}</span>
      ))}
    </div>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <CartTestHarness />
    </CartProvider>
  )
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('Cart', () => {
  it('starts empty', () => {
    renderCart()
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('adds items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter-website'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('has-starter-website').textContent).toBe('true')
  })

  it('prevents duplicate items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter-website'))
      await userEvent.click(screen.getByTestId('add-starter-website'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('removes items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter-website'))
    })
    // Adding a second one_time package replaces the first (category enforcement)
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-business-website'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
    await act(async () => {
      await userEvent.click(screen.getByTestId('remove-business-website'))
    })
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('has-business-website').textContent).toBe('false')
  })

  it('clears all items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter-website'))
    })
    await act(async () => {
      await userEvent.click(screen.getByTestId('clear'))
    })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('calculates one-time and recurring totals', async () => {
    renderCart()
    // starter-website: one-time 199000 cents; care-plan: recurring 14900 cents
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter-website'))
      await userEvent.click(screen.getByTestId('add-care-plan'))
    })
    expect(screen.getByTestId('one-time').textContent).toBe('199000')
    expect(screen.getByTestId('recurring').textContent).toBe('14900')
  })

  it('toggles drawer open state', async () => {
    renderCart()
    expect(screen.getByTestId('is-open').textContent).toBe('false')
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle'))
    })
    expect(screen.getByTestId('is-open').textContent).toBe('true')
  })
})
