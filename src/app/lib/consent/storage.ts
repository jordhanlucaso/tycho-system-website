import {
  CONSENT_CATEGORIES,
  CONSENT_SCHEMA_VERSION,
  DEFAULT_CONSENT,
  type ConsentMethod,
  type ConsentRecord,
  type ConsentState,
} from './types'

/**
 * Persistence for the consent record.
 *
 * localStorage rather than a cookie: the record only ever matters to the
 * browser, so there is no reason to attach it to every request. It is itself
 * strictly necessary — without it we would have to ask on every page view.
 *
 * Every access is guarded: Safari private mode, disabled storage and
 * cross-origin iframes all throw on access rather than returning null.
 */

export const CONSENT_STORAGE_KEY = 'tycho_consent_v1'

/** Fired on this window when the record changes, so non-React code can react. */
export const CONSENT_CHANGE_EVENT = 'tycho:consent-change'

function isConsentState(value: unknown): value is ConsentState {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return CONSENT_CATEGORIES.every((category) => typeof record[category] === 'boolean')
}

/**
 * Parse a stored record, rejecting anything malformed or written under an older
 * schema. Returning null means "no decision yet" — the banner shows again.
 */
export function parseConsentRecord(raw: string | null): ConsentRecord | null {
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null

    const candidate = parsed as Partial<ConsentRecord>
    if (candidate.v !== CONSENT_SCHEMA_VERSION) return null
    if (!isConsentState(candidate.categories)) return null
    if (typeof candidate.timestamp !== 'string') return null

    return {
      v: CONSENT_SCHEMA_VERSION,
      // Necessary is true by definition, whatever the stored value claims.
      categories: { ...candidate.categories, necessary: true },
      timestamp: candidate.timestamp,
      method: (candidate.method ?? 'custom') as ConsentMethod,
    }
  } catch {
    // Corrupt JSON — treat it as no decision rather than trusting it.
    return null
  }
}

export function readConsentRecord(): ConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    return parseConsentRecord(window.localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    // Storage unavailable — behave as if no decision has been made.
    return null
  }
}

export function writeConsentRecord(record: ConsentRecord): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Storage unavailable — the decision still applies for this page view.
  }
}

export function clearConsentRecord(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // Nothing to do — the key was never written.
  }
}

/** Build a record from a category selection. */
export function buildConsentRecord(
  categories: ConsentState,
  method: ConsentMethod,
  now: Date = new Date()
): ConsentRecord {
  return {
    v: CONSENT_SCHEMA_VERSION,
    categories: { ...DEFAULT_CONSENT, ...categories, necessary: true },
    timestamp: now.toISOString(),
    method,
  }
}
