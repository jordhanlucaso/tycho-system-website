# Cookie Consent & Marketing Unsubscribe

Reference for the two privacy systems: what the site actually stores in a
visitor's browser, and how marketing opt-out is enforced.

Legal wording lives in `src/content/legal/cookie-policy.md` and
`privacy-policy.md`. This document is the engineering view.

---

## Part 1 — Cookie consent

### What the site actually uses

The audit behind this found **no analytics, no pixels, no tag manager, no chat
widget and no embeds**. Tycho Systems sets **no first-party cookies at all** —
everything first-party is localStorage or sessionStorage.

| Category | What is in it | Notes |
| --- | --- | --- |
| Strictly necessary | `tycho_consent_v1`, Supabase auth token, `tycho-cart`, checkout hand-off keys, `tycho_lead_magnet_result_v1`, Google reCAPTCHA v3 | No consent required |
| Functional | `tycho-theme` | Off by default |
| Analytics | `tycho_attribution_v1`, Plausible (**not enabled**) | Off by default |
| Marketing | *nothing* | Category exists in the schema but is inert — see below |

`src/app/lib/consent/types.ts` is the machine-readable version of this table and
is the single place to change it. Keep it and the cookie policy in step.

### Why there is no Marketing toggle

`marketing` is declared in `CONSENT_CATEGORIES` so the record shape stays stable
if a pixel is ever added, but its definition carries `active: false`. Inactive
categories are filtered out of the UI and forced to `false` in the manager, so
they cannot be granted even by hand-editing storage. Showing an inert toggle
would imply we run advertising technology that we do not.

**To add a marketing technology later:** flip `active: true`, register a gated
service for it, update the cookie policy, and bump `CONSENT_SCHEMA_VERSION` so
existing visitors are asked again.

### Architecture

```
src/app/lib/consent/
  types.ts      the category inventory + record shape
  storage.ts    localStorage read/write/parse, version-checked
  manager.ts    framework-agnostic singleton: state, listeners, service registry
  services.ts   the actual gated services (Plausible loader, attribution)
  useConsent.ts React bindings (useSyncExternalStore)

src/app/components/consent/
  ConsentProvider.tsx        mounted once in App.tsx, inside the router
  CookieBanner.tsx           first-run notice
  CookiePreferencesDialog.tsx modal with focus trap
  CookieSettingsButton.tsx   footer entry point
```

The manager is a **module singleton, not React state**. `theme.tsx`,
`attribution.ts` and `analytics.ts` need to ask "may I?" without caring where
they sit in the tree, and script loading must not wait for a provider to mount.
React subscribes to the manager, never the reverse.

Two consequences worth knowing:

- `getConsentState()` returns a **cached** object. `useSyncExternalStore`
  compares snapshots by reference and loops forever otherwise.
- Services are enabled on the *transition* into consent and disabled on the
  *transition* out, tracked in `enabledServices`. That is the duplicate-init
  guard — pressing "Accept all" twice cannot load a script twice.

### Enforcement, not decoration

| Technology | Blocked before consent by |
| --- | --- |
| Plausible | Never injected; `services.ts` only appends the script on grant, and removes it plus `window.plausible` on withdrawal |
| `track()` events | `analytics.ts` returns early without analytics consent — belt and braces, so an event fired during hydration cannot reach a provider |
| UTM attribution | `captureAttribution()` and `getAttribution()` both check consent; withdrawal deletes the key |
| Theme persistence | `theme.tsx` writes only while functional consent stands, and removes the key when it is withdrawn. The toggle still works in-session either way |

### The static legal pages

`scripts/prerender-legal.mjs` emits `/terms`, `/privacy`, `/cookies` and
`/refunds` as standalone HTML with **no JavaScript**, and Vercel serves those
files directly. The preference panel cannot open there, so their footer links to
`/#cookie-settings`; `ConsentProvider` derives the open state from that hash and
strips it on close.

### reCAPTCHA is treated as strictly necessary

It exists to stop form abuse, not to learn anything about the visitor, and the
public forms cannot safely be offered without it. It is loaded only on pages
carrying a protected form. This is a judgement call and is flagged as such in
the cookie policy — if it is ever reclassified, it becomes a gated service like
any other.

---

## Part 2 — Marketing unsubscribe

### Source of truth

**HubSpot decides who receives a campaign.** Nurture enrolment is HubSpot active
lists filtered on the `tycho_marketing_consent` contact property (see
`email-sequences.md`).

**The application holds a suppression list that can only ever remove people.**
`marketing_subscriptions` (migration 006) is checked by `sendMarketingEmail()`
immediately before handing a message to the provider. If the two ever disagree,
the app's "no" wins — a stale HubSpot list cannot cause a send.

Both are written on every opt-out. A CRM failure is recorded as
`crm_sync_status: 'pending'` for retry, never swallowed and never allowed to
block the local opt-out.

### Tokens

`server/src/lib/marketing/tokens.ts`. AES-256-GCM, keyed off
`UNSUBSCRIBE_TOKEN_SECRET`.

- The address is **encrypted**, not encoded — the token is genuinely opaque and
  no address or database id appears in a URL.
- GCM authenticates, so a modified token fails to open rather than resolving to
  some other contact.
- **No expiry.** A marketing email from two years ago must still unsubscribe.
  `iat` is carried for audit and key rotation and is deliberately not enforced.

Encryption rather than a database lookup because the app stores only a SHA-256
hash of each address, and the plaintext is needed to tell HubSpot who opted out.

Rotating the secret invalidates unsubscribe links in already-sent mail. Treat it
as long-lived.

### Why GET never unsubscribes

Mail security gateways prefetch links. A state-changing GET would silently opt
people out. So:

- `GET /api/unsubscribe/verify` — validates only, changes nothing.
- `POST /api/unsubscribe` — the confirmed action from the page.
- `POST /api/unsubscribe/one-click` — RFC 8058 only. `List-Unsubscribe-Post`
  promises no confirmation step, which is exactly why it is a separate endpoint
  from the page. Always answers 200, so a mail client cannot show the recipient
  an error they can do nothing about.

The visible footer link is required regardless of the headers.

### The sending boundary

Every marketing email goes through `sendMarketingEmail()`. Nothing else may call
`email.send()` with marketing content.

It checks suppression **at send time, not at audience-selection time** — a
campaign assembled on Monday and sent on Thursday would otherwise mail everyone
who opted out in between. It also appends the shared footer and sets the
one-click headers, so a new campaign cannot ship without an unsubscribe link by
forgetting to add one.

It fails **closed**. No token service, no suppression store, a database error,
or an address that never opted in all mean "do not send".

Transactional mail does not pass through here. Receipts, contracts, password
resets and lead-magnet delivery are unaffected by an opt-out, and must not carry
an unsubscribe link.

### Resubscription

Only an explicit marketing opt-in resubscribes. Requesting a guide, buying
something or contacting support never does — `/api/contact` has no subscription
path at all, and the lead-magnet service subscribes only when the separate,
unticked marketing checkbox was ticked.

Leaving that box unticked records an opt-out, mirroring the
`tycho_marketing_consent: 'false'` written to HubSpot in the same request, so
the two systems cannot drift.

### Environment

| Variable | Required | Effect |
| --- | --- | --- |
| `UNSUBSCRIBE_TOKEN_SECRET` | **Yes**, before any marketing send | Unset ⇒ `sendMarketingEmail()` refuses to send. Transactional is unaffected |
| `MARKETING_EMAIL_FROM` | Optional | Separate bulk sender; falls back to `TRANSACTIONAL_EMAIL_FROM` |
| `HUBSPOT_MARKETING_SUBSCRIPTION_ID` | Optional | Also calls HubSpot's communication-preferences API for a portal-wide opt-out, not just the `tycho_marketing_consent` property |
