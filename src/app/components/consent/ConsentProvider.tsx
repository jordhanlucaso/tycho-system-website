import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { subscribeToPreferenceRequests } from '../../lib/consent/manager'
import { registerConsentServices } from '../../lib/consent/services'
import { useHasDecidedConsent } from '../../lib/consent/useConsent'
import { CookieBanner } from './CookieBanner'
import { CookiePreferencesDialog } from './CookiePreferencesDialog'

/**
 * Mounts the consent UI and connects the manager to the app.
 *
 * Rendered once inside the router (it links to /cookies and /privacy) and
 * outside <Routes>, so the banner and the settings dialog are available on
 * every page without each route knowing about them.
 *
 * Registering the gated services here — rather than at module scope — keeps
 * importing the consent modules side-effect free, which is what lets tests and
 * the prerender script pull in the manager without loading anything.
 */
/** Deep link that opens the preference panel. */
const SETTINGS_HASH = '#cookie-settings'

export function ConsentProvider() {
  const [openedByUser, setOpenedByUser] = useState(false)
  const decided = useHasDecidedConsent()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => registerConsentServices(), [])

  /**
   * The panel is open either because something asked for it, or because the URL
   * says so. Deriving the second case rather than mirroring it into state keeps
   * the two in step and avoids a render cascade on load.
   *
   * The hash matters because the prerendered legal pages are static HTML with
   * no React on them — their footer links to `/#cookie-settings`, and this is
   * what makes that land somewhere useful once the app has booted.
   */
  const openedByHash = location.hash === SETTINGS_HASH
  const isDialogOpen = openedByUser || openedByHash

  const openDialog = useCallback(() => setOpenedByUser(true), [])

  const closeDialog = useCallback(() => {
    setOpenedByUser(false)
    // Drop the hash too, or the panel would immediately reopen — and a shared
    // or reloaded link should not keep reopening it either.
    if (location.hash === SETTINGS_HASH) {
      navigate({ pathname: location.pathname, search: location.search }, { replace: true })
    }
  }, [location.hash, location.pathname, location.search, navigate])

  // Footer buttons (and anything else) ask the manager to open the panel.
  useEffect(() => subscribeToPreferenceRequests(openDialog), [openDialog])

  return (
    <>
      {/* The banner stays mounted while the panel is open — the modal covers
          it and traps focus, and keeping it means "Manage preferences" still
          exists to hand focus back to when the panel closes. */}
      {!decided && <CookieBanner onManage={openDialog} />}
      {isDialogOpen && <CookiePreferencesDialog onClose={closeDialog} />}
    </>
  )
}
