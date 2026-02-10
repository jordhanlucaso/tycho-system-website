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
      await userEvent.click(screen.getByTestId('add-starter'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('has-starter').textContent).toBe('true')
  })

  it('prevents duplicate items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter'))
      await userEvent.click(screen.getByTestId('add-starter'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('removes items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter'))
      await userEvent.click(screen.getByTestId('add-business'))
    })
    expect(screen.getByTestId('count').textContent).toBe('2')
    await act(async () => {
      await userEvent.click(screen.getByTestId('remove-starter'))
    })
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('has-starter').textContent).toBe('false')
  })

  it('clears all items', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter'))
      await userEvent.click(screen.getByTestId('add-business'))
    })
    await act(async () => {
      await userEvent.click(screen.getByTestId('clear'))
    })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('calculates one-time and recurring totals', async () => {
    renderCart()
    await act(async () => {
      await userEvent.click(screen.getByTestId('add-starter'))
      await userEvent.click(screen.getByTestId('add-care'))
    })
    expect(screen.getByTestId('one-time').textContent).toBe('39900')
    expect(screen.getByTestId('recurring').textContent).toBe('4900')
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
