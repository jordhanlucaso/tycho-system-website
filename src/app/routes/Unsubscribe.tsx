import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Container } from '../components/layout/Container'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { API_BASE } from '../lib/api'
import { emails, mailto, emailSubjects } from '../../config/contact'

/**
 * Marketing unsubscribe confirmation page.
 *
 * Two steps on purpose. Opening the link only *checks* the token; nothing
 * changes until the visitor presses the button, because mail security gateways
 * routinely prefetch links and a state-changing GET would opt people out
 * without their knowledge. (Mail clients that offer their own one-click
 * control use the RFC 8058 POST endpoint instead, which is allowed to act
 * immediately.)
 *
 * No sign-in, and the page never displays or asks for an email address — the
 * token carries it, sealed.
 */

type Status = 'checking' | 'ready' | 'invalid' | 'submitting' | 'done' | 'error'

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-[11px] bg-[var(--azure)] px-[22px] py-[13px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]'

const secondaryLink =
  'inline-flex items-center justify-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[22px] py-[13px] text-[15px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]'

export function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('t') ?? ''
  // A missing token is knowable at first render — no need for a round trip.
  const [status, setStatus] = useState<Status>(token ? 'checking' : 'invalid')
  const [alreadyUnsubscribed, setAlreadyUnsubscribed] = useState(false)

  useEffect(() => {
    document.title = 'Unsubscribe — Tycho Systems'
  }, [])

  // Validate without changing anything.
  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function verify() {
      try {
        const res = await fetch(
          `${API_BASE}/api/unsubscribe/verify?t=${encodeURIComponent(token)}`
        )
        const data = (await res.json()) as { ok?: boolean }
        if (!cancelled) setStatus(data.ok ? 'ready' : 'invalid')
      } catch {
        // Can't reach the API — let them try the button rather than dead-end.
        if (!cancelled) setStatus('ready')
      }
    }

    void verify()
    return () => {
      cancelled = true
    }
  }, [token])

  const confirm = useCallback(async () => {
    setStatus('submitting')
    try {
      const res = await fetch(`${API_BASE}/api/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ t: token }),
      })
      const data = (await res.json()) as { ok?: boolean; alreadyUnsubscribed?: boolean }

      if (res.ok && data.ok) {
        setAlreadyUnsubscribed(Boolean(data.alreadyUnsubscribed))
        setStatus('done')
      } else {
        setStatus(res.status === 400 ? 'invalid' : 'error')
      }
    } catch {
      setStatus('error')
    }
  }, [token])

  return (
    <div className="min-h-dvh bg-[var(--bg-primary)] font-sans">
      <Navbar />
      <main className="py-[clamp(48px,8vw,96px)]">
        <Container>
          <div className="mx-auto max-w-[560px]">
            <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--azure)]">
              [ Email preferences ]
            </div>

            {/* aria-live so the outcome is announced without moving focus. */}
            <div aria-live="polite">
              {(status === 'checking' || status === 'submitting') && (
                <>
                  <h1 className="m-0 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                    {status === 'checking' ? 'Checking your link…' : 'Updating your preferences…'}
                  </h1>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-body)]">
                    One moment.
                  </p>
                </>
              )}

              {status === 'ready' && (
                <>
                  <h1 className="m-0 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                    Unsubscribe from marketing emails?
                  </h1>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-body)]">
                    Confirm below and we will stop sending you marketing and update emails from
                    Tycho Systems. It takes effect immediately.
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                    You will still receive necessary messages tied to something you asked for or
                    bought — a guide you requested, a receipt, a contract, or a direct reply from
                    us. Those are not marketing.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button type="button" onClick={confirm} className={primaryButton}>
                      Yes, unsubscribe me
                    </button>
                    <Link to="/" className={secondaryLink}>
                      No, keep me subscribed
                    </Link>
                  </div>
                </>
              )}

              {status === 'done' && (
                <>
                  <h1 className="m-0 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                    {alreadyUnsubscribed ? 'You were already unsubscribed' : 'You are unsubscribed'}
                  </h1>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-body)]">
                    Marketing emails from Tycho Systems are switched off for this address. Nothing
                    further is needed — and if you use this link again, it will keep working and
                    keep saying the same thing.
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                    We have not deleted your details, because we may still need them for an
                    existing contract, invoice or support conversation. To have your data removed
                    entirely, email{' '}
                    <a
                      href={mailto(emails.privacy, emailSubjects.privacy)}
                      className="text-[var(--azure)] underline underline-offset-2 hover:text-[var(--azure-hover)]"
                    >
                      {emails.privacy}
                    </a>
                    . See our{' '}
                    <Link
                      to="/privacy"
                      className="text-[var(--azure)] underline underline-offset-2 hover:text-[var(--azure-hover)]"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/" className={secondaryLink}>
                      Back to tychosystem.com
                    </Link>
                  </div>
                </>
              )}

              {status === 'invalid' && (
                <>
                  <h1 className="m-0 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                    This link is not valid
                  </h1>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-body)]">
                    The link may have been altered or truncated by an email client. Try the
                    unsubscribe link in a more recent email, or email{' '}
                    <a
                      href={mailto(emails.privacy, emailSubjects.privacy)}
                      className="text-[var(--azure)] underline underline-offset-2 hover:text-[var(--azure-hover)]"
                    >
                      {emails.privacy}
                    </a>{' '}
                    and we will unsubscribe you ourselves.
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <h1 className="m-0 font-display text-[clamp(26px,4vw,38px)] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                    Something went wrong
                  </h1>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-body)]">
                    We could not update your preferences just now — nothing has changed. Please try
                    again.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button type="button" onClick={confirm} className={primaryButton}>
                      Try again
                    </button>
                    <a
                      href={mailto(emails.privacy, emailSubjects.privacy)}
                      className={secondaryLink}
                    >
                      Email us instead
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
