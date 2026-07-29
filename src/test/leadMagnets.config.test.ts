import { describe, it, expect } from 'vitest'
import {
  CONSENT_TEXT_VERSION,
  businessRoleOptions,
  dictionaryRoleOptions,
  leadMagnets,
  resourceSelector,
} from '../config/leadMagnets'
import { services } from '../config/services'

describe('lead magnet config', () => {
  it('defines exactly two resources with distinct paths and files', () => {
    const resources = Object.values(leadMagnets)
    expect(resources).toHaveLength(2)
    expect(new Set(resources.map((r) => r.path)).size).toBe(2)
    expect(new Set(resources.map((r) => r.downloadPath)).size).toBe(2)
    for (const r of resources) {
      expect(r.title).toBeTruthy()
      expect(r.page.heading).toBeTruthy()
      expect(r.page.submitCta).toBeTruthy()
      expect(r.thankYouPath.startsWith('/thank-you/')).toBe(true)
    }
  })

  it('has an audience choice for each resource', () => {
    for (const choice of resourceSelector.audienceChoices) {
      expect(leadMagnets[choice.slug]).toBeDefined()
    }
  })

  it('keeps role option values unique per form', () => {
    const business = businessRoleOptions.map((o) => o.value)
    const dictionary = dictionaryRoleOptions.map((o) => o.value)
    expect(new Set(business).size).toBe(business.length)
    expect(new Set(dictionary).size).toBe(dictionary.length)
  })

  it('has a dated consent text version', () => {
    expect(CONSENT_TEXT_VERSION).toMatch(/^\d{4}-\d{2}-/)
  })
})

describe('services config', () => {
  it('defines exactly four primary services', () => {
    expect(services).toHaveLength(4)
  })

  it('each service has full copy and a CTA', () => {
    for (const s of services) {
      expect(s.title).toBeTruthy()
      expect(s.shortDesc).toBeTruthy()
      expect(s.longDesc).toBeTruthy()
      expect(s.items.length).toBeGreaterThan(0)
      expect(s.cta).toBeTruthy()
    }
  })
})
