import { describe, it, expect } from 'vitest'
import { site } from '../config/site'
import { mockups } from '../config/mockups'
import { services } from '../config/services'
import { tiers } from '../config/pricing'
import { faq } from '../config/faq'
import { testimonials } from '../config/testimonials'

describe('site config', () => {
  it('has required fields', () => {
    expect(site.agencyName).toBeTruthy()
    expect(site.tagline).toBeTruthy()
    expect(site.description).toBeTruthy()
    expect(site.email).toBeTruthy()
    expect(site.ctas.primary).toBeTruthy()
    expect(site.ctas.secondary).toBeTruthy()
  })
})

describe('mockups config', () => {
  it('has at least one mockup', () => {
    expect(mockups.length).toBeGreaterThan(0)
  })

  it('all mockups have unique slugs', () => {
    const slugs = mockups.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('all mockups have required fields', () => {
    for (const m of mockups) {
      expect(m.slug).toBeTruthy()
      expect(m.name).toBeTruthy()
      expect(m.category).toBeTruthy()
      expect(m.city).toBeTruthy()
      expect(m.tagline).toBeTruthy()
    }
  })
})

describe('services config', () => {
  it('has at least one service', () => {
    expect(services.length).toBeGreaterThan(0)
  })
})

describe('pricing config', () => {
  it('has at least one tier', () => {
    expect(tiers.length).toBeGreaterThan(0)
  })

  it('all tiers have features', () => {
    for (const t of tiers) {
      expect(t.features.length).toBeGreaterThan(0)
    }
  })
})

describe('faq config', () => {
  it('has at least one FAQ item', () => {
    expect(faq.length).toBeGreaterThan(0)
  })
})

describe('testimonials config', () => {
  it('has at least one testimonial', () => {
    expect(testimonials.length).toBeGreaterThan(0)
  })
})
