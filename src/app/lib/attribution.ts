import { hasConsent } from './consent/manager'

/**
 * Source/campaign attribution for the lead-magnet funnel. UTM parameters,
 * referrer and landing path are captured once per session (first page that
 * carries them wins) and stored in sessionStorage so they survive client-side
 * navigation until the form is submitted.
 *
 * This is campaign measurement, not something the visitor asked for, so it sits
 * behind the `analytics` category: nothing is written until consent is granted,
 * and withdrawing consent purges what was written. The lead-magnet form works
 * exactly the same either way — it just submits without a campaign source.
 */

export type Attribution = {
  platform?: string
  campaign?: string
  contentId?: string
  referrer?: string
  landingPath?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

const STORAGE_KEY = 'tycho_attribution_v1'

export function captureAttribution(): void {
  if (!hasConsent('analytics')) return

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const params = new URLSearchParams(window.location.search)
    const attribution: Attribution = {
      platform: params.get('src') ?? undefined,
      campaign: params.get('campaign') ?? undefined,
      contentId: params.get('content_id') ?? undefined,
      referrer: document.referrer || undefined,
      landingPath: window.location.pathname,
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      utmTerm: params.get('utm_term') ?? undefined,
    }

    const hasSignal = Object.values(attribution).some(Boolean)
    if (hasSignal) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Storage unavailable (private mode etc.) — attribution is best-effort.
  }
}

export function getAttribution(): Attribution {
  if (!hasConsent('analytics')) return {}

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

/** Remove the stored attribution. Called when analytics consent is withdrawn. */
export function clearAttribution(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable — nothing was ever written.
  }
}
