import { useEffect } from 'react'

/**
 * reCAPTCHA v3 (invisible, score-based) client helper. Shared by every public
 * form so the script loads once and tokens are fetched the same way.
 *
 * Configured with VITE_RECAPTCHA_SITE_KEY (public). When it is unset the helper
 * no-ops and getToken resolves `undefined` — the server treats a missing token
 * as "verification skipped" only when it, too, has no secret configured, so dev
 * still works without keys.
 */

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined
const SCRIPT_ID = 'recaptcha-v3-script'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

/** True when a site key is configured and reCAPTCHA will actually run. */
export const RECAPTCHA_ENABLED = Boolean(SITE_KEY)

/** Idempotently inject the reCAPTCHA v3 script (no-op when unconfigured or already present). */
export function loadRecaptcha(): void {
  if (!SITE_KEY || typeof document === 'undefined') return
  if (document.getElementById(SCRIPT_ID)) return
  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

/**
 * Execute reCAPTCHA v3 for a named action and resolve a one-time token.
 * Resolves `undefined` when unconfigured or the script is unavailable, so a
 * caller can still submit (the server decides whether a token is required).
 */
export function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!SITE_KEY || typeof window === 'undefined' || !window.grecaptcha) {
    return Promise.resolve(undefined)
  }
  return new Promise((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        resolve(await window.grecaptcha!.execute(SITE_KEY, { action }))
      } catch {
        resolve(undefined)
      }
    })
  })
}

/** Load the script on mount and expose a token getter bound to an action. */
export function useRecaptcha(): { getToken: (action: string) => Promise<string | undefined> } {
  useEffect(() => {
    loadRecaptcha()
  }, [])
  return { getToken: getRecaptchaToken }
}
