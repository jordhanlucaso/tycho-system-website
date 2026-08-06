import { vi } from 'vitest'

/**
 * localStorage polyfill.
 *
 * Node 22 defines a global `localStorage` that is inert unless the process is
 * started with --localstorage-file, and it shadows the implementation jsdom
 * would otherwise provide — so `window.localStorage` is undefined here while
 * `sessionStorage` works normally. Real browsers are unaffected; this only
 * restores the API for tests (consent preferences and the theme both use it).
 */
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()

  const polyfill: Storage = {
    get length() {
      return store.size
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    getItem: (key: string) => store.get(String(key)) ?? null,
    setItem: (key: string, value: string) => {
      store.set(String(key), String(value))
    },
    removeItem: (key: string) => {
      store.delete(String(key))
    },
    clear: () => store.clear(),
  }

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: polyfill,
  })
}

// Mock Supabase client for tests
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    }
  })
}))

// Mock IntersectionObserver for jsdom (used by Motion's whileInView)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  _callback: IntersectionObserverCallback

  constructor(
    callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {
    this._callback = callback
  }

  observe(target: Element) {
    this._callback(
      [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      this
    )
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

import '@testing-library/jest-dom'
