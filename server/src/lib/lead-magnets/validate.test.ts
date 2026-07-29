import { describe, it, expect } from 'vitest'
import { validateLeadMagnetRequest, isDisposableEmail, normalizeEmail } from './validate.js'

const validBody = {
  firstName: 'Ada',
  email: 'ada@example.com',
  roleCategory: 'ceo_founder',
  requestedResource: 'ai_operations_pain_map',
  marketingConsent: false,
  consentTextVersion: '2026-07-lead-magnet-v1',
}

describe('validateLeadMagnetRequest', () => {
  it('accepts a minimal valid request', () => {
    const result = validateLeadMagnetRequest(validBody)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.email).toBe('ada@example.com')
      expect(result.value.roleCategory).toBe('ceo_founder')
    }
  })

  it('rejects missing required fields with field errors', () => {
    const result = validateLeadMagnetRequest({ requestedResource: 'ai_dictionary' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        firstName: expect.any(String),
        email: expect.any(String),
        roleCategory: expect.any(String),
      })
    }
  })

  it('rejects an invalid role', () => {
    const result = validateLeadMagnetRequest({ ...validBody, roleCategory: 'supreme_leader' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors?.roleCategory).toBeTruthy()
  })

  it('rejects an invalid email', () => {
    const result = validateLeadMagnetRequest({ ...validBody, email: 'not-an-email' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors?.email).toBeTruthy()
  })

  it('rejects disposable email domains', () => {
    const result = validateLeadMagnetRequest({ ...validBody, email: 'x@mailinator.com' })
    expect(result.ok).toBe(false)
  })

  it('rejects a filled honeypot without field errors', () => {
    const result = validateLeadMagnetRequest({ ...validBody, website: 'https://spam.example' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors).toBeUndefined()
  })

  it('normalises the email to lowercase', () => {
    const result = validateLeadMagnetRequest({ ...validBody, email: '  Ada@Example.COM ' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.email).toBe('ada@example.com')
  })

  it('drops unknown enum values on optional fields instead of failing', () => {
    const result = validateLeadMagnetRequest({
      ...validBody,
      teamSize: 'a-zillion',
      primaryBusinessPain: 'slow_lead_response',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.teamSize).toBeUndefined()
      expect(result.value.primaryBusinessPain).toBe('slow_lead_response')
    }
  })

  it('rejects a missing consent state', () => {
    const withoutConsent: Record<string, unknown> = { ...validBody }
    delete withoutConsent.marketingConsent
    const result = validateLeadMagnetRequest(withoutConsent)
    expect(result.ok).toBe(false)
  })

  it('caps overlong free-text fields', () => {
    const result = validateLeadMagnetRequest({
      ...validBody,
      existingTools: 'x'.repeat(1000),
    })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.existingTools!.length).toBeLessThanOrEqual(300)
  })
})

describe('helpers', () => {
  it('normalizeEmail lowercases and trims', () => {
    expect(normalizeEmail(' A@B.co ')).toBe('a@b.co')
  })
  it('isDisposableEmail flags known throwaway domains', () => {
    expect(isDisposableEmail('a@yopmail.com')).toBe(true)
    expect(isDisposableEmail('a@gmail.com')).toBe(false)
  })
})
