import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { acceptAll, rejectNonEssential, setConsent } from '../../lib/consent/manager'
import { useConsentRecord, useConsentState } from '../../lib/consent/useConsent'
import { ACTIVE_CATEGORIES, type ConsentState } from '../../lib/consent/types'

type CookiePreferencesDialogProps = {
  onClose: () => void
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-[11px] bg-[var(--azure)] px-[22px] py-[13px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)]'

const neutralButton =
  'inline-flex items-center justify-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[22px] py-[13px] text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)] hover:border-[color-mix(in_srgb,var(--text-primary)_24%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)]'

/**
 * The preference panel behind "Manage preferences" and the footer "Cookie
 * settings" link.
 *
 * Accessibility: a real modal — focus moves in on open, Tab cycles inside it,
 * Escape and the backdrop close it, and focus returns to whatever opened it.
 * Toggles are ordinary checkboxes so screen readers and keyboards get the
 * behaviour they already know; the necessary row is disabled rather than
 * silently ignored.
 *
 * Only categories backed by something the site actually uses are listed
 * (`ACTIVE_CATEGORIES`) — there is no inert "Marketing" toggle to imply we run
 * advertising technology we do not.
 */
export function CookiePreferencesDialog({ onClose }: CookiePreferencesDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const current = useConsentState()
  const record = useConsentRecord()

  // Local working copy — nothing is applied until a button is pressed, so
  // flicking a toggle and pressing Escape changes nothing.
  const [draft, setDraft] = useState<ConsentState>(current)

  const toggle = useCallback((category: keyof ConsentState, value: boolean) => {
    setDraft((previous) => ({ ...previous, [category]: value }))
  }, [])

  // Remember the trigger, move focus into the dialog, and restore it on close.
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()

    return () => previouslyFocused.current?.focus?.()
  }, [])

  // Escape closes; Tab is confined to the dialog.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter((element) => element.offsetParent !== null || element === document.activeElement)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [onClose])

  // Stop the page behind the modal from scrolling.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  function save() {
    setConsent(draft, 'custom')
    onClose()
  }

  function handleAcceptAll() {
    acceptAll()
    onClose()
  }

  function handleRejectAll() {
    rejectNonEssential()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="max-h-[92dvh] w-full max-w-[640px] overflow-y-auto rounded-t-[16px] border border-[var(--border-primary)] bg-[var(--surface-solid)] p-[clamp(20px,4vw,32px)] shadow-[0_20px_70px_rgba(0,0,0,0.5)] sm:rounded-[16px]"
      >
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-fainter)]">
          Cookie settings
        </div>
        <h2
          id={titleId}
          className="m-0 font-display text-[clamp(20px,3vw,26px)] font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
        >
          Choose what Tycho Systems may store
        </h2>
        <p id={descriptionId} className="mb-0 mt-3 text-[13.5px] leading-[1.65] text-[var(--text-muted)]">
          Everything optional is off unless you switch it on. The site works the same either way.
          Full detail — including who each provider is and how long anything lasts — is in the{' '}
          <Link
            to="/cookies"
            className="text-[var(--azure)] underline underline-offset-2 hover:text-[var(--azure-hover)]"
          >
            cookie policy
          </Link>
          .
        </p>

        <ul className="my-6 list-none space-y-3 p-0">
          {ACTIVE_CATEGORIES.map((category) => {
            const inputId = `consent-category-${category.id}`
            const checked = category.required ? true : draft[category.id]

            return (
              <li
                key={category.id}
                className="rounded-[12px] border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    disabled={category.required}
                    onChange={(event) => toggle(category.id, event.target.checked)}
                    aria-describedby={`${inputId}-description`}
                    className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--azure)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)] disabled:opacity-60"
                  />
                  <div className="min-w-0">
                    <label
                      htmlFor={inputId}
                      className="block text-[14.5px] font-semibold text-[var(--text-primary)]"
                    >
                      {category.title}
                      {category.required && (
                        <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-fainter)]">
                          Always on
                        </span>
                      )}
                    </label>
                    <p
                      id={`${inputId}-description`}
                      className="mb-0 mt-1.5 text-[13px] leading-[1.6] text-[var(--text-muted)]"
                    >
                      {category.description}
                    </p>
                    <p className="mb-0 mt-2 text-[12.5px] leading-[1.55] text-[var(--text-faint)]">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-fainter)]">
                        Used for
                      </span>{' '}
                      {category.examples}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={save} className={primaryButton}>
            Save preferences
          </button>
          <button type="button" onClick={handleAcceptAll} className={neutralButton}>
            Accept all
          </button>
          <button type="button" onClick={handleRejectAll} className={neutralButton}>
            Reject non-essential
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-fainter)]">
            {record
              ? `Your choice was recorded ${new Date(record.timestamp).toLocaleDateString()}`
              : 'No choice recorded yet'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[9px] px-2 py-1 text-[13px] text-[var(--text-muted)] underline underline-offset-4 transition hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-solid)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
