import {
  buildConsentRecord,
  clearConsentRecord,
  readConsentRecord,
  writeConsentRecord,
  CONSENT_CHANGE_EVENT,
} from './storage'
import {
  ALL_GRANTED_CONSENT,
  CATEGORY_DEFINITIONS,
  DEFAULT_CONSENT,
  type ConsentCategory,
  type ConsentMethod,
  type ConsentRecord,
  type ConsentState,
} from './types'

/**
 * The central consent manager.
 *
 * Deliberately a framework-agnostic module singleton rather than React state:
 * `theme.tsx`, `attribution.ts` and `analytics.ts` all need to ask "may I?"
 * without caring where they sit in the component tree, and script loading must
 * not depend on a provider having mounted. React subscribes to this, not the
 * other way round.
 *
 * Nothing optional runs until `setConsent` is called with it granted. Services
 * register themselves once and the manager decides when — and whether — they
 * are switched on, so consent checks never get scattered through feature code.
 */

/**
 * A capability that must not run without consent.
 *
 * `enable` is called at most once per grant and `disable` at most once per
 * withdrawal, so implementations do not need their own idempotency guard —
 * though `enable` should still be safe to call after a disable/enable cycle.
 */
export type ConsentGatedService = {
  /** Stable id; registering the same id twice replaces the first registration. */
  id: string
  category: ConsentCategory
  /** Load the script / start writing storage. */
  enable: () => void
  /**
   * Stop future activity and remove whatever storage this service owns.
   * Called on withdrawal and must tolerate never having been enabled.
   */
  disable: () => void
}

type Listener = (state: ConsentState, record: ConsentRecord | null) => void

const INACTIVE_CATEGORIES = new Set(
  CATEGORY_DEFINITIONS.filter((category) => !category.active).map((category) => category.id)
)

let record: ConsentRecord | null = null
let hydrated = false

/**
 * Cached snapshot of the derived state.
 *
 * `useSyncExternalStore` compares snapshots by reference and loops forever if
 * `getSnapshot` returns a fresh object every call, so the state object must be
 * stable between changes — not rebuilt on read.
 */
let cachedState: ConsentState | null = null

const listeners = new Set<Listener>()
const openRequestListeners = new Set<() => void>()
const services = new Map<string, ConsentGatedService>()
/** Services currently switched on — the duplicate-initialisation guard. */
const enabledServices = new Set<string>()

/** Read from storage once, lazily, so importing this module has no side effects. */
function hydrate(): void {
  if (hydrated) return
  hydrated = true
  record = readConsentRecord()
  cachedState = null
}

/**
 * Force inactive categories off. A category with nothing behind it can never be
 * granted, whatever a hand-edited storage value or a stale record says.
 */
function normalise(state: ConsentState): ConsentState {
  const next: ConsentState = { ...state, necessary: true }
  for (const category of INACTIVE_CATEGORIES) next[category] = false
  return next
}

/** Current grants. Defaults (everything optional off) until a decision exists. */
export function getConsentState(): ConsentState {
  hydrate()
  if (cachedState === null) cachedState = normalise(record?.categories ?? DEFAULT_CONSENT)
  return cachedState
}

/** The stored decision, or null when the visitor has not chosen yet. */
export function getConsentRecord(): ConsentRecord | null {
  hydrate()
  return record
}

/** False while the banner still needs to be shown. */
export function hasDecided(): boolean {
  hydrate()
  return record !== null
}

/** The single question feature code should ask. */
export function hasConsent(category: ConsentCategory): boolean {
  return getConsentState()[category]
}

/**
 * Bring registered services in line with the current grants.
 * A service is only enabled on the transition into consent and only disabled on
 * the transition out, so a repeat "Accept all" cannot double-load a script.
 */
function syncServices(): void {
  const state = getConsentState()

  for (const service of services.values()) {
    const granted = state[service.category]
    const running = enabledServices.has(service.id)

    if (granted && !running) {
      enabledServices.add(service.id)
      service.enable()
    } else if (!granted && running) {
      enabledServices.delete(service.id)
      service.disable()
    }
  }
}

function notify(): void {
  const state = getConsentState()
  for (const listener of listeners) listener(state, record)

  // Lets non-React code outside this module observe changes too.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }))
  }
}

/**
 * Register a capability the manager owns. Returns an unregister function.
 *
 * If consent for the category already exists, the service is enabled
 * immediately — this is what makes preferences survive a reload.
 */
export function registerConsentService(service: ConsentGatedService): () => void {
  // Replacing an existing id must not leave the old instance running.
  const previous = services.get(service.id)
  if (previous && enabledServices.has(service.id)) {
    enabledServices.delete(service.id)
    previous.disable()
  }

  services.set(service.id, service)

  if (getConsentState()[service.category]) {
    enabledServices.add(service.id)
    service.enable()
  }

  return () => {
    if (services.get(service.id) !== service) return
    services.delete(service.id)
    if (enabledServices.has(service.id)) {
      enabledServices.delete(service.id)
      service.disable()
    }
  }
}

/** Record a decision, persist it, then switch services on or off to match. */
export function setConsent(categories: Partial<ConsentState>, method: ConsentMethod): void {
  const next = normalise({ ...DEFAULT_CONSENT, ...getConsentState(), ...categories })
  record = buildConsentRecord(next, method)
  hydrated = true
  cachedState = null
  writeConsentRecord(record)
  syncServices()
  notify()
}

export function acceptAll(): void {
  setConsent(ALL_GRANTED_CONSENT, 'accept_all')
}

export function rejectNonEssential(): void {
  setConsent(DEFAULT_CONSENT, 'reject_non_essential')
}

/**
 * Clear the decision entirely and tear down every optional service, so the
 * visitor is asked again from scratch. Used by "ask me again" and by tests.
 */
export function resetConsent(): void {
  record = null
  hydrated = true
  cachedState = null
  clearConsentRecord()
  syncServices()
  notify()
}

export function subscribeToConsent(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Ask the UI to open the preference panel. Kept on the manager so a footer
 * button anywhere in the tree can reach the dialog without prop drilling or a
 * shared React context.
 */
export function openConsentPreferences(): void {
  for (const listener of openRequestListeners) listener()
}

export function subscribeToPreferenceRequests(listener: () => void): () => void {
  openRequestListeners.add(listener)
  return () => openRequestListeners.delete(listener)
}

/**
 * Test-only: drop every registration and cached state so suites do not leak
 * services into one another.
 */
export function __resetConsentManagerForTests(): void {
  record = null
  hydrated = false
  cachedState = null
  listeners.clear()
  openRequestListeners.clear()
  services.clear()
  enabledServices.clear()
}
