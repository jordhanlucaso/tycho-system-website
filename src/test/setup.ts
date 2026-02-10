import { vi } from 'vitest'

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
