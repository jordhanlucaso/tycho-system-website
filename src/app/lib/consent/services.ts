import { registerConsentService } from './manager'
import { clearAttribution, captureAttribution } from '../attribution'

/**
 * The consent-gated services for this site.
 *
 * Each one is registered with the manager exactly once (from `ConsentProvider`)
 * and is switched on only when its category is granted. Nothing here runs at
 * import time.
 */

const PLAUSIBLE_SCRIPT_ID = 'tycho-plausible-analytics'

/**
 * Plausible is the analytics tool this codebase is written against
 * (`src/app/lib/analytics.ts`), but it is **not enabled today**: with
 * `VITE_PLAUSIBLE_DOMAIN` unset the loader is a no-op and no request is made.
 * Setting the variable is what turns it on — and even then it loads only after
 * analytics consent.
 */
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined
const PLAUSIBLE_SRC =
  (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) || 'https://plausible.io/js/script.js'

/** True when a Plausible domain is configured, i.e. analytics can actually run. */
export const ANALYTICS_CONFIGURED = Boolean(PLAUSIBLE_DOMAIN)

function loadPlausible(): void {
  if (!PLAUSIBLE_DOMAIN || typeof document === 'undefined') return
  // The manager already guarantees one enable per grant; this also covers a
  // script left behind by a previous page in the same document.
  if (document.getElementById(PLAUSIBLE_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = PLAUSIBLE_SCRIPT_ID
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  script.src = PLAUSIBLE_SRC
  document.head.appendChild(script)
}

function unloadPlausible(): void {
  if (typeof document === 'undefined') return
  document.getElementById(PLAUSIBLE_SCRIPT_ID)?.remove()
  // Drop the queue function so `track()` cannot reach a half-torn-down script.
  if (typeof window !== 'undefined') delete window.plausible
}

/**
 * Register every gated service. Returns a teardown that unregisters them all.
 *
 * Safe to call more than once: the manager keys registrations by id, so a
 * second call replaces rather than duplicates.
 */
export function registerConsentServices(): () => void {
  const unregister = [
    registerConsentService({
      id: 'analytics:plausible',
      category: 'analytics',
      enable: loadPlausible,
      disable: unloadPlausible,
    }),
    registerConsentService({
      id: 'analytics:attribution',
      category: 'analytics',
      // Capture immediately on grant: the UTM parameters are still in the URL,
      // so consenting mid-visit does not lose the campaign that brought them.
      enable: captureAttribution,
      disable: clearAttribution,
    }),
  ]

  return () => {
    for (const off of unregister) off()
  }
}
