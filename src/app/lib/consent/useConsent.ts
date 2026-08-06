import { useCallback, useSyncExternalStore } from 'react'
import {
  getConsentRecord,
  getConsentState,
  hasDecided,
  subscribeToConsent,
} from './manager'
import type { ConsentCategory, ConsentRecord, ConsentState } from './types'

/**
 * React bindings over the consent manager singleton.
 *
 * `useSyncExternalStore` keeps components in step with a store that lives
 * outside React, and gives correct behaviour under StrictMode double-mounting
 * (which `main.tsx` uses) without any extra guards.
 *
 * These live in a plain `.ts` module rather than alongside the provider so the
 * component files stay component-only (react-refresh/only-export-components).
 */

function subscribe(onChange: () => void): () => void {
  return subscribeToConsent(onChange)
}

/** Current grants. Re-renders the caller whenever the decision changes. */
export function useConsentState(): ConsentState {
  return useSyncExternalStore(subscribe, getConsentState, getConsentState)
}

/** Whether a single category is granted. */
export function useHasConsent(category: ConsentCategory): boolean {
  const getSnapshot = useCallback(() => getConsentState()[category], [category])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** False while the visitor still has to be asked. */
export function useHasDecidedConsent(): boolean {
  return useSyncExternalStore(subscribe, hasDecided, hasDecided)
}

/** The stored record, for the "last updated" line in the preference panel. */
export function useConsentRecord(): ConsentRecord | null {
  return useSyncExternalStore(subscribe, getConsentRecord, getConsentRecord)
}
