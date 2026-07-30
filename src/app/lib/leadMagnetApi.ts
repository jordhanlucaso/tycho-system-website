import type { AudienceSegment, ResourceSlug, RoleCategory } from '../../config/leadMagnets'
import type { Attribution } from './attribution'
import { API_BASE } from './api'

export type LeadMagnetSubscriptionRequest = {
  firstName: string
  lastName?: string
  email: string
  companyName?: string

  roleCategory: RoleCategory

  teamSize?: string
  primaryBusinessPain?: string
  hoursLostPerWeek?: string
  existingTools?: string

  aiExperience?: string
  primaryInterest?: string
  currentGoal?: string

  requestedResource: ResourceSlug
  marketingConsent: boolean
  consentTextVersion: string

  /** Honeypot — must stay empty; bots that fill it are rejected server-side. */
  website?: string

  /** reCAPTCHA v3 token, verified server-side. Omitted when reCAPTCHA is unconfigured. */
  recaptchaToken?: string

  source?: Attribution
}

export type LeadMagnetSubscriptionResponse = {
  ok: true
  audienceSegment: AudienceSegment
  deliveredResource: {
    slug: ResourceSlug
    title: string
    downloadUrl: string
  }
  marketingEnrolled: boolean
  redirectUrl: string
  /** Non-fatal delivery problems (e.g. the email could not be sent). */
  warnings?: string[]
}

export type LeadMagnetError = {
  ok: false
  error: string
  fieldErrors?: Record<string, string>
}

/** Stored for the thank-you page (sessionStorage survives the redirect). */
export const LEAD_MAGNET_RESULT_KEY = 'tycho_lead_magnet_result_v1'

export type StoredLeadMagnetResult = LeadMagnetSubscriptionResponse & {
  requestedResource: ResourceSlug
  firstName: string
  primaryBusinessPain?: string
}

export async function submitLeadMagnetRequest(
  body: LeadMagnetSubscriptionRequest
): Promise<LeadMagnetSubscriptionResponse> {
  const res = await fetch(`${API_BASE}/api/lead-magnets/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => null)) as
    | LeadMagnetSubscriptionResponse
    | LeadMagnetError
    | null

  if (!res.ok || !data || data.ok !== true) {
    const message =
      data && 'error' in data && data.error
        ? data.error
        : 'Something went wrong sending your request. Please try again.'
    throw new Error(message)
  }

  return data
}
