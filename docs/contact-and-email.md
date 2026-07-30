# Business Email & Contact Routing

Single reference for every Tycho Systems address, where it is used, and how
internal notifications are routed. Domain: **tychosystem.com** (singular).

## Address book

Source of truth: `src/config/contact.ts` (frontend), mirrored in
`server/src/config/contact.ts` (server). The two are kept identical by a test.

| Key | Address | Purpose |
| --- | --- | --- |
| `founder` | jordhan@tychosystem.com | Founder / primary mailbox; critical system alerts |
| `contact` | contact@tychosystem.com | General enquiries (default) |
| `hello` | hello@tychosystem.com | Friendly top-of-funnel "start a project" |
| `info` | info@tychosystem.com | General information alias |
| `support` | support@tychosystem.com | Client / customer support |
| `billing` | billing@tychosystem.com | Billing, invoices, refunds |
| `privacy` | privacy@tychosystem.com | Privacy / GDPR rights requests |
| `resources` | resources@tychosystem.com | Transactional resource delivery (sender) |
| `partners` | partners@tychosystem.com | Partnership enquiries |

Use `emails.*` and `mailto(address, subject?)` — never hard-code an address.
Prefilled subjects (`emailSubjects`): support, privacy, partnership, billing.

## Where each address appears (public site)

- **Footer** — contact@, support@
- **Contact section** — contact@ (general), jordhan@ (founder), support@
- **Closing CTA** — hello@
- **Automation Care CTA** — contact@ (subject "Automation Care")
- **Resource thank-you** — contact@ (workflow audit + resource support)
- **Client portal help** — support@
- **Privacy policy** — privacy@
- **Terms / Refund policy** — billing@
- **Structured data (Schema.org `ContactPoint`)** — support@ (customer support),
  contact@ (customer service), privacy@ (privacy)

Billing and the founder/critical-alert address are deliberately **not** in the
structured data.

## Notification routing (server-authoritative)

The browser never chooses or sees a destination. A form may send a `source`
hint; the server maps it via `categoryForFormSource` →
`resolveNotificationRecipient` using `notificationRecipients` in
`server/src/config/contact.ts`.

| Category | Destination |
| --- | --- |
| `general_contact` | contact@tychosystem.com |
| `workflow_audit` | contact@tychosystem.com |
| `support` | support@tychosystem.com |
| `billing` | billing@tychosystem.com |
| `privacy` | privacy@tychosystem.com |
| `partnerships` | partners@tychosystem.com |
| `pdf_delivery_failure` | support@tychosystem.com |
| `critical_alert` | jordhan@tychosystem.com |

Unknown/missing categories fall back to `contact@` so nothing is dropped.

## Transactional email (env, not code)

Recommended production values (`server/.env.example`):

```bash
TRANSACTIONAL_EMAIL_FROM="Tycho Systems <resources@tychosystem.com>"
TRANSACTIONAL_EMAIL_REPLY_TO=contact@tychosystem.com
```

`server/src/lib/email.ts` reads these from the environment; production values
are never hard-coded in server logic.

## Changing an address

1. Edit `src/config/contact.ts`.
2. Mirror the change in `server/src/config/contact.ts`.
3. Run `npm run test` — the sync test fails if the two drift.
