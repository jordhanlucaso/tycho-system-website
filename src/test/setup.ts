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
