import { hasConsent } from './consent/manager'

/**
 * Lightweight typed analytics wrapper. Sends events to Plausible when its
 * script is present (`window.plausible`), otherwise no-ops (with a console
 * debug line in dev). Never pass emails or free-text form input as props —
 * only enum-like values defined in src/config/leadMagnets.ts.
 *
 * Consent is enforced here as well as at the loader, so an event fired during
 * hydration — or by a component that has not re-rendered since consent was
 * withdrawn — cannot reach a provider. The script itself is loaded by
 * `src/app/lib/consent/services.ts` only after the analytics category is
 * granted, so before consent there is no `window.plausible` to call anyway.
 */

export type AnalyticsEvent =
  | 'resource_selector_viewed'
  | 'resource_selected'
  | 'lead_magnet_page_viewed'
  | 'lead_magnet_form_started'
  | 'lead_magnet_step_completed'
  | 'lead_magnet_form_submitted'
  | 'lead_magnet_form_failed'
  | 'audience_classified'
  | 'lead_magnet_delivered'
  | 'pdf_download_clicked'
  | 'marketing_consent_given'
  | 'marketing_consent_declined'
  | 'service_card_clicked'
  | 'audit_cta_clicked'
  | 'booking_clicked'

export type AnalyticsProps = Record<string, string | number | boolean | undefined>

type PlausibleFn = (event: string, options?: { props?: AnalyticsProps }) => void

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!hasConsent('analytics')) return

  try {
    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
      window.plausible(event, props ? { props } : undefined)
    } else if (import.meta.env.DEV) {
      console.debug('[analytics]', event, props ?? {})
    }
  } catch {
    // Analytics must never break the page.
  }
}
