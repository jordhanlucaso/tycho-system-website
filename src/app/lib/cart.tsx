import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { PricingTier } from '../../config/pricing'

export type CartItem = PricingTier

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_OPEN'; open: boolean }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.some((i) => i.id === action.item.id)) return state
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR':
      return { ...state, items: [], isOpen: false }
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen }
    case 'SET_OPEN':
      return { ...state, isOpen: action.open }
  }
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
  toggleDrawer: () => void
  setOpen: (open: boolean) => void
  hasItem: (id: string) => boolean
  oneTimeTotal: number
  recurringTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem('tycho-cart')
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false
  })

  useEffect(() => {
    sessionStorage.setItem('tycho-cart', JSON.stringify(state.items))
  }, [state.items])

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    clear: () => dispatch({ type: 'CLEAR' }),
    toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
    setOpen: (open) => dispatch({ type: 'SET_OPEN', open }),
    hasItem: (id) => state.items.some((i) => i.id === id),
    oneTimeTotal: state.items.filter((i) => !i.recurring).reduce((sum, i) => sum + i.priceInCents, 0),
    recurringTotal: state.items.filter((i) => i.recurring).reduce((sum, i) => sum + i.priceInCents, 0),
    itemCount: state.items.length
  }

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
