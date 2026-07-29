import {
  AI_EXPERIENCES,
  BUSINESS_PAINS,
  CURRENT_GOALS,
  HOURS_LOST,
  PRIMARY_INTERESTS,
  RESOURCE_SLUGS,
  ROLE_CATEGORIES,
  TEAM_SIZES,
} from './types.js'
import type { LeadMagnetSubscriptionRequest } from './types.js'

export type ValidationResult =
  | { ok: true; value: LeadMagnetSubscriptionRequest }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_TEXT = 200

/** Common throwaway-address domains. Not exhaustive — just the obvious ones. */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'sharklasers.com',
  '10minutemail.com',
  'temp-mail.org',
  'tempmail.dev',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
])

function asTrimmedString(value: unknown, max = MAX_TEXT): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, max)
}

function oneOf(value: unknown, allowed: readonly string[]): string | undefined {
  return typeof value === 'string' && allowed.includes(value) ? value : undefined
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false
}

/**
 * Validates and normalises an untrusted request body into a typed
 * LeadMagnetSubscriptionRequest. Hidden client fields (honeypot, source) are
 * sanitised but never trusted for classification — the server reclassifies
 * from the validated form answers.
 */
export function validateLeadMagnetRequest(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid request body.' }
  }

  const b = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  // Honeypot: silently reject bots that fill the hidden field.
  if (typeof b.website === 'string' && b.website.trim() !== '') {
    return { ok: false, error: 'Your request could not be processed.' }
  }

  const firstName = asTrimmedString(b.firstName, 80)
  if (!firstName) fieldErrors.firstName = 'First name is required.'

  const rawEmail = asTrimmedString(b.email, 254)
  let email: string | undefined
  if (!rawEmail) {
    fieldErrors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(rawEmail)) {
    fieldErrors.email = 'Please enter a valid email address.'
  } else if (isDisposableEmail(normalizeEmail(rawEmail))) {
    fieldErrors.email = 'Please use a non-disposable email address so we can deliver the guide.'
  } else {
    email = normalizeEmail(rawEmail)
  }

  const roleCategory = oneOf(b.roleCategory, ROLE_CATEGORIES)
  if (!roleCategory) fieldErrors.roleCategory = 'Please select a valid role.'

  const requestedResource = oneOf(b.requestedResource, RESOURCE_SLUGS)
  if (!requestedResource) fieldErrors.requestedResource = 'Unknown resource.'

  if (typeof b.marketingConsent !== 'boolean') {
    fieldErrors.marketingConsent = 'Consent state is missing.'
  }

  const consentTextVersion = asTrimmedString(b.consentTextVersion, 60)
  if (!consentTextVersion) fieldErrors.consentTextVersion = 'Consent version is missing.'

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Some fields need attention.', fieldErrors }
  }

  const source =
    typeof b.source === 'object' && b.source !== null
      ? (() => {
          const s = b.source as Record<string, unknown>
          return {
            platform: asTrimmedString(s.platform, 60),
            campaign: asTrimmedString(s.campaign, 100),
            contentId: asTrimmedString(s.contentId, 100),
            referrer: asTrimmedString(s.referrer, 300),
            landingPath: asTrimmedString(s.landingPath, 200),
            utmSource: asTrimmedString(s.utmSource, 100),
            utmMedium: asTrimmedString(s.utmMedium, 100),
            utmCampaign: asTrimmedString(s.utmCampaign, 100),
            utmContent: asTrimmedString(s.utmContent, 100),
            utmTerm: asTrimmedString(s.utmTerm, 100),
          }
        })()
      : undefined

  return {
    ok: true,
    value: {
      firstName: firstName!,
      lastName: asTrimmedString(b.lastName, 80),
      email: email!,
      companyName: asTrimmedString(b.companyName, 120),
      roleCategory: roleCategory as LeadMagnetSubscriptionRequest['roleCategory'],
      teamSize: oneOf(b.teamSize, TEAM_SIZES),
      primaryBusinessPain: oneOf(b.primaryBusinessPain, BUSINESS_PAINS),
      hoursLostPerWeek: oneOf(b.hoursLostPerWeek, HOURS_LOST),
      existingTools: asTrimmedString(b.existingTools, 300),
      aiExperience: oneOf(b.aiExperience, AI_EXPERIENCES),
      primaryInterest: oneOf(b.primaryInterest, PRIMARY_INTERESTS),
      currentGoal: oneOf(b.currentGoal, CURRENT_GOALS),
      requestedResource: requestedResource as LeadMagnetSubscriptionRequest['requestedResource'],
      marketingConsent: b.marketingConsent as boolean,
      consentTextVersion: consentTextVersion!,
      source,
    },
  }
}
