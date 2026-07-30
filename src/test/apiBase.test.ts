import { describe, it, expect } from 'vitest'
import { normalizeApiBase } from '../app/lib/api'

describe('normalizeApiBase', () => {
  it('returns empty for unset / blank values (dev proxy)', () => {
    expect(normalizeApiBase(undefined)).toBe('')
    expect(normalizeApiBase('')).toBe('')
    expect(normalizeApiBase('   ')).toBe('')
  })

  it('adds https:// to a bare host so fetch does not treat it as a path', () => {
    expect(normalizeApiBase('tycho-system-website-production.up.railway.app')).toBe(
      'https://tycho-system-website-production.up.railway.app'
    )
  })

  it('preserves an explicit scheme', () => {
    expect(normalizeApiBase('https://api.tychosystem.com')).toBe('https://api.tychosystem.com')
    expect(normalizeApiBase('http://localhost:3001')).toBe('http://localhost:3001')
  })

  it('strips trailing slashes to avoid //api', () => {
    expect(normalizeApiBase('https://api.tychosystem.com/')).toBe('https://api.tychosystem.com')
    expect(normalizeApiBase('api.tychosystem.com//')).toBe('https://api.tychosystem.com')
  })
})
