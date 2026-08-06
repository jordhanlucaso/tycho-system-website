import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { ConsentProvider } from '../app/components/consent/ConsentProvider'
import { CookieSettingsButton } from '../app/components/consent/CookieSettingsButton'
import { SiteFooter } from '../app/components/home/SiteFooter'
import { Footer } from '../app/components/layout/Footer'
import {
  __resetConsentManagerForTests,
  getConsentRecord,
  getConsentState,
  hasConsent,
  hasDecided,
} from '../app/lib/consent/manager'
import { CONSENT_SCHEMA_VERSION } from '../app/lib/consent/types'
import { CONSENT_STORAGE_KEY } from '../app/lib/consent/storage'

/**
 * Cookie-consent behaviour.
 *
 * The point of these is that consent actually *controls* something — that the
 * banner is not decoration. Enforcement of individual services lives in
 * consentEnforcement.test.ts; this file covers the decision, its persistence
 * and the UI around it.
 */

/**
 * The provider plus a footer entry point, which is how every real page is
 * assembled — the banner is transient, the "Cookie settings" link is not.
 */
function renderConsentUI() {
  return render(
    <MemoryRouter>
      <ConsentProvider />
      <footer>
        <CookieSettingsButton />
      </footer>
    </MemoryRouter>
  )
}

function storedRecord() {
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  __resetConsentManagerForTests()
})

afterEach(() => {
  document.body.style.overflow = ''
})

describe('cookie banner', () => {
  it('appears when no consent record exists', () => {
    renderConsentUI()

    expect(screen.getByRole('dialog', { name: /cookies and similar technologies/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept all' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject non-essential' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Manage preferences' })).toBeInTheDocument()
  })

  it('links to both the cookie policy and the privacy policy', () => {
    renderConsentUI()
    const banner = screen.getByRole('dialog', { name: /cookies and similar technologies/i })

    expect(within(banner).getByRole('link', { name: /cookie policy/i })).toHaveAttribute(
      'href',
      '/cookies'
    )
    expect(within(banner).getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })

  it('gives accepting and rejecting identical prominence and a single click each', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    const accept = screen.getByRole('button', { name: 'Accept all' })
    const reject = screen.getByRole('button', { name: 'Reject non-essential' })

    // Same element type and the same class string — no styling asymmetry that
    // could nudge a visitor toward accepting.
    expect(accept.tagName).toBe(reject.tagName)
    expect(accept.className).toBe(reject.className)

    // One interaction is enough for either.
    await user.click(reject)
    expect(hasDecided()).toBe(true)
  })

  it('does not appear once a decision exists', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        v: CONSENT_SCHEMA_VERSION,
        categories: { necessary: true, functional: false, analytics: false, marketing: false },
        timestamp: new Date().toISOString(),
        method: 'reject_non_essential',
      })
    )

    renderConsentUI()
    expect(screen.queryByRole('dialog', { name: /cookies and similar technologies/i })).toBeNull()
  })

  it('treats a record from an older schema version as no decision', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        v: CONSENT_SCHEMA_VERSION - 1,
        categories: { necessary: true, functional: true, analytics: true, marketing: true },
        timestamp: new Date().toISOString(),
        method: 'accept_all',
      })
    )

    renderConsentUI()

    expect(screen.getByRole('dialog', { name: /cookies and similar technologies/i })).toBeInTheDocument()
    // And the stale grants are not honoured in the meantime.
    expect(hasConsent('analytics')).toBe(false)
  })
})

describe('before any decision', () => {
  it('grants nothing optional', () => {
    expect(hasDecided()).toBe(false)
    expect(getConsentState()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  })

  it('writes nothing to storage just by rendering', () => {
    renderConsentUI()
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull()
    expect(localStorage.length).toBe(0)
  })
})

describe('recording a decision', () => {
  it('accept all enables every category the site actually uses', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Accept all' }))

    expect(getConsentState()).toEqual({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false, // nothing marketing exists, so it can never be granted
    })
    expect(storedRecord()).toMatchObject({ v: CONSENT_SCHEMA_VERSION, method: 'accept_all' })
  })

  it('reject non-essential keeps everything optional off', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Reject non-essential' }))

    expect(getConsentState()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
    expect(storedRecord()).toMatchObject({ method: 'reject_non_essential' })
  })

  it('stores a schema version and timestamp but nothing identifying', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Accept all' }))

    const record = storedRecord()
    expect(record.v).toBe(CONSENT_SCHEMA_VERSION)
    expect(() => new Date(record.timestamp).toISOString()).not.toThrow()
    expect(Object.keys(record).sort()).toEqual(['categories', 'method', 'timestamp', 'v'])
  })

  it('survives a reload', async () => {
    const user = userEvent.setup()
    const { unmount } = renderConsentUI()
    await user.click(screen.getByRole('button', { name: 'Accept all' }))
    unmount()

    // Simulate a fresh page load: manager caches are dropped, storage is not.
    __resetConsentManagerForTests()
    renderConsentUI()

    expect(hasConsent('analytics')).toBe(true)
    expect(screen.queryByRole('dialog', { name: /cookies and similar technologies/i })).toBeNull()
  })
})

describe('preference panel', () => {
  async function openPanel(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: 'Manage preferences' }))
    return screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
  }

  it('lists only categories backed by a technology in use', async () => {
    const user = userEvent.setup()
    renderConsentUI()
    const panel = await openPanel(user)

    expect(within(panel).getByLabelText(/strictly necessary/i)).toBeInTheDocument()
    expect(within(panel).getByLabelText(/^functional/i)).toBeInTheDocument()
    expect(within(panel).getByLabelText(/^analytics/i)).toBeInTheDocument()
    // No marketing technology exists, so no misleading toggle for one.
    expect(within(panel).queryByLabelText(/^marketing/i)).toBeNull()
  })

  it('has necessary always on and not switchable, and everything else off by default', async () => {
    const user = userEvent.setup()
    renderConsentUI()
    const panel = await openPanel(user)

    const necessary = within(panel).getByLabelText(/strictly necessary/i)
    expect(necessary).toBeChecked()
    expect(necessary).toBeDisabled()

    expect(within(panel).getByLabelText(/^functional/i)).not.toBeChecked()
    expect(within(panel).getByLabelText(/^analytics/i)).not.toBeChecked()
  })

  it('respects a granular selection', async () => {
    const user = userEvent.setup()
    renderConsentUI()
    const panel = await openPanel(user)

    await user.click(within(panel).getByLabelText(/^analytics/i))
    await user.click(within(panel).getByRole('button', { name: 'Save preferences' }))

    expect(getConsentState()).toEqual({
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    })
    expect(getConsentRecord()?.method).toBe('custom')
  })

  it('applies nothing when dismissed with Escape', async () => {
    const user = userEvent.setup()
    renderConsentUI()
    const panel = await openPanel(user)

    await user.click(within(panel).getByLabelText(/^analytics/i))
    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog', { name: /choose what/i })).toBeNull())
    expect(hasDecided()).toBe(false)
    expect(hasConsent('analytics')).toBe(false)
  })

  it('moves focus into the dialog and restores it on close', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    const trigger = screen.getByRole('button', { name: 'Manage preferences' })
    trigger.focus()
    await user.click(trigger)

    const panel = screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
    await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true))

    await user.keyboard('{Escape}')
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup()
    renderConsentUI()
    await openPanel(user)

    const panel = screen.getByRole('dialog', { name: /choose what tycho systems may store/i })

    // Cycle well past the number of controls; focus must never escape.
    for (let i = 0; i < 25; i += 1) {
      await user.tab()
      expect(panel.contains(document.activeElement)).toBe(true)
    }
  })

  it('can withdraw consent after having accepted', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Accept all' }))
    expect(hasConsent('analytics')).toBe(true)

    // The banner is gone; reopening is what the footer link is for.
    await user.click(screen.getByRole('button', { name: 'Cookie settings' }))
    const panel = screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
    await user.click(within(panel).getByRole('button', { name: 'Reject non-essential' }))

    expect(getConsentState()).toEqual({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  })

  it('reflects the current selection when reopened', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Accept all' }))
    await user.click(screen.getByRole('button', { name: 'Cookie settings' }))

    const panel = screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
    expect(within(panel).getByLabelText(/^analytics/i)).toBeChecked()
    expect(within(panel).getByLabelText(/^functional/i)).toBeChecked()
  })
})

describe('cookie settings entry point', () => {
  it('is rendered by both site footers', () => {
    const { unmount } = render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/cookies')
    unmount()

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Cookie settings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/cookies')
  })

  it('reopens the panel from a footer rendered outside the provider', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ConsentProvider />
        <div>
          <CookieSettingsButton />
        </div>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Reject non-essential' }))
    await user.click(screen.getByRole('button', { name: 'Cookie settings' }))

    expect(
      screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
    ).toBeInTheDocument()
  })

  it('opens the panel from the /#cookie-settings hash used by the static legal pages', async () => {
    render(
      <MemoryRouter initialEntries={['/#cookie-settings']}>
        <ConsentProvider />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(
        screen.getByRole('dialog', { name: /choose what tycho systems may store/i })
      ).toBeInTheDocument()
    )
  })
})

describe('the rest of the site stays usable', () => {
  it('does not block the page when non-essential consent is refused', async () => {
    const user = userEvent.setup()
    renderConsentUI()

    await user.click(screen.getByRole('button', { name: 'Reject non-essential' }))

    // No overlay left behind, and scrolling is not locked.
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('survives storage being unavailable', async () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

    try {
      const user = userEvent.setup()
      renderConsentUI()
      await user.click(screen.getByRole('button', { name: 'Accept all' }))

      // The decision still applies for this page view even though it could not
      // be written down.
      expect(hasConsent('analytics')).toBe(true)
    } finally {
      setItem.mockRestore()
    }
  })
})
