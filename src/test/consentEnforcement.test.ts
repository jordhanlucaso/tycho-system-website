import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Enforcement, as opposed to the UI.
 *
 * The failure mode worth guarding against is a banner that records a choice and
 * then ignores it — so these check that scripts are absent from the document,
 * that storage keys are not written, and that withdrawal removes what was
 * written.
 *
 * Everything is loaded through `loadConsent()` rather than imported at the top
 * of the file. `services.ts` reads `VITE_PLAUSIBLE_DOMAIN` once at module
 * initialisation, so exercising the configured and unconfigured cases needs a
 * fresh module graph per test — and the manager must come from that same graph,
 * or the services would register against a different singleton.
 */

const ATTRIBUTION_KEY = 'tycho_attribution_v1'
const PLAUSIBLE_SCRIPT_ID = 'tycho-plausible-analytics'

type ConsentModules = typeof import('../app/lib/consent/manager') &
  typeof import('../app/lib/consent/services') &
  typeof import('../app/lib/attribution') &
  typeof import('../app/lib/analytics')

/**
 * @param plausibleDomain analytics domain to configure; omit for "not configured",
 *   which is how the site ships today.
 * @param register whether to register the gated services (ConsentProvider does
 *   this on mount in the real app).
 */
async function loadConsent(
  { plausibleDomain, register = true }: { plausibleDomain?: string; register?: boolean } = {}
): Promise<ConsentModules> {
  vi.stubEnv('VITE_PLAUSIBLE_DOMAIN', plausibleDomain ?? '')
  vi.resetModules()

  const manager = await import('../app/lib/consent/manager')
  const services = await import('../app/lib/consent/services')
  const attribution = await import('../app/lib/attribution')
  const analytics = await import('../app/lib/analytics')

  manager.__resetConsentManagerForTests()
  if (register) services.registerConsentServices()

  return { ...manager, ...services, ...attribution, ...analytics }
}

function setSearch(search: string) {
  window.history.replaceState({}, '', `/resources${search}`)
}

function plausibleScripts() {
  return document.querySelectorAll(`#${PLAUSIBLE_SCRIPT_ID}`)
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  document.getElementById(PLAUSIBLE_SCRIPT_ID)?.remove()
  delete window.plausible
  setSearch('')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('before consent', () => {
  it('does not capture campaign attribution', async () => {
    const { captureAttribution, getAttribution } = await loadConsent()
    setSearch('?utm_source=linkedin&utm_campaign=ceo_ops')

    captureAttribution()

    expect(sessionStorage.getItem(ATTRIBUTION_KEY)).toBeNull()
    expect(getAttribution()).toEqual({})
  })

  it('does not send analytics events even if a provider somehow exists', async () => {
    const { track } = await loadConsent()
    const plausible = vi.fn()
    window.plausible = plausible

    track('lead_magnet_page_viewed', { resource: 'ai_dictionary' })

    expect(plausible).not.toHaveBeenCalled()
  })

  it('loads no analytics script, even when one is configured', async () => {
    await loadConsent({ plausibleDomain: 'tychosystem.com' })

    expect(plausibleScripts()).toHaveLength(0)
  })
})

describe('after granting analytics', () => {
  it('captures attribution and reads it back', async () => {
    const { acceptAll, captureAttribution, getAttribution } = await loadConsent()
    setSearch('?utm_source=linkedin&utm_campaign=ceo_ops')

    acceptAll()
    captureAttribution()

    expect(getAttribution()).toMatchObject({ utmSource: 'linkedin', utmCampaign: 'ceo_ops' })
  })

  it('sends analytics events', async () => {
    const { acceptAll, track } = await loadConsent()
    const plausible = vi.fn()
    window.plausible = plausible

    acceptAll()
    track('pdf_download_clicked', { resource: 'ai_dictionary' })

    expect(plausible).toHaveBeenCalledWith('pdf_download_clicked', {
      props: { resource: 'ai_dictionary' },
    })
  })

  it('loads the script exactly once, however often consent is re-confirmed', async () => {
    const { acceptAll, setConsent } = await loadConsent({ plausibleDomain: 'tychosystem.com' })

    acceptAll()
    acceptAll()
    setConsent({ analytics: true }, 'custom')

    expect(plausibleScripts()).toHaveLength(1)
    expect(plausibleScripts()[0].getAttribute('data-domain')).toBe('tychosystem.com')
  })

  it('loads nothing when no analytics domain is configured — the current setup', async () => {
    const { acceptAll } = await loadConsent()

    acceptAll()

    expect(plausibleScripts()).toHaveLength(0)
  })
})

describe('withdrawing consent', () => {
  it('removes the analytics script and stops future events', async () => {
    const { acceptAll, rejectNonEssential, track } = await loadConsent({
      plausibleDomain: 'tychosystem.com',
    })

    acceptAll()
    expect(plausibleScripts()).toHaveLength(1)

    // Stand in for the queue function the real script would have defined.
    const plausible = vi.fn()
    window.plausible = plausible

    rejectNonEssential()

    expect(plausibleScripts()).toHaveLength(0)
    expect(window.plausible).toBeUndefined()

    track('booking_clicked')
    expect(plausible).not.toHaveBeenCalled()
  })

  it('deletes the stored attribution', async () => {
    const { acceptAll, rejectNonEssential, captureAttribution, getAttribution } =
      await loadConsent()

    setSearch('?utm_source=linkedin')
    acceptAll()
    captureAttribution()
    expect(sessionStorage.getItem(ATTRIBUTION_KEY)).not.toBeNull()

    rejectNonEssential()

    expect(sessionStorage.getItem(ATTRIBUTION_KEY)).toBeNull()
    expect(getAttribution()).toEqual({})
  })

  it('re-enables cleanly after a withdraw/grant cycle', async () => {
    const { acceptAll, rejectNonEssential } = await loadConsent({
      plausibleDomain: 'tychosystem.com',
    })

    acceptAll()
    rejectNonEssential()
    acceptAll()

    expect(plausibleScripts()).toHaveLength(1)
  })
})

describe('the service registry', () => {
  it('enables a service once per grant, not once per state change', async () => {
    const { registerConsentService, acceptAll, setConsent } = await loadConsent({ register: false })
    const enable = vi.fn()
    const disable = vi.fn()
    registerConsentService({ id: 'test:service', category: 'analytics', enable, disable })

    acceptAll()
    setConsent({ analytics: true, functional: false }, 'custom')
    setConsent({ analytics: true, functional: true }, 'custom')

    expect(enable).toHaveBeenCalledTimes(1)
    expect(disable).not.toHaveBeenCalled()
  })

  it('enables immediately when registered after consent already exists', async () => {
    const { registerConsentService, acceptAll } = await loadConsent({ register: false })
    acceptAll()

    const enable = vi.fn()
    registerConsentService({ id: 'test:late', category: 'analytics', enable, disable: vi.fn() })

    expect(enable).toHaveBeenCalledTimes(1)
  })

  it('never enables a service in a category the site does not use', async () => {
    const { registerConsentService, acceptAll, setConsent } = await loadConsent({ register: false })
    const enable = vi.fn()
    registerConsentService({ id: 'test:marketing', category: 'marketing', enable, disable: vi.fn() })

    acceptAll()
    // Even asking for it directly cannot grant an inactive category.
    setConsent({ marketing: true }, 'custom')

    expect(enable).not.toHaveBeenCalled()
  })

  it('tears a service down when its category is withdrawn, once', async () => {
    const { registerConsentService, acceptAll, rejectNonEssential } = await loadConsent({
      register: false,
    })
    const enable = vi.fn()
    const disable = vi.fn()
    registerConsentService({ id: 'test:teardown', category: 'functional', enable, disable })

    acceptAll()
    rejectNonEssential()
    rejectNonEssential()

    expect(enable).toHaveBeenCalledTimes(1)
    expect(disable).toHaveBeenCalledTimes(1)
  })
})
