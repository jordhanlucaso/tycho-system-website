/// <reference types="node" />
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { emails, mailto, emailSubjects, CONTACT_DOMAIN } from '../config/contact'
import privacyMd from '../content/legal/privacy-policy.md?raw'
import termsMd from '../content/legal/terms-of-service.md?raw'
import refundMd from '../content/legal/refund-policy.md?raw'
import emailLib from '../../server/src/lib/email.ts?raw'
import indexHtml from '../../index.html?raw'
import {
  emails as serverEmails,
  resolveNotificationRecipient,
  categoryForFormSource,
  notificationRecipients,
} from '../../server/src/config/contact'

/* ── 1. Central configuration addresses ── */

describe('central contact config', () => {
  it('uses the correct domain', () => {
    expect(CONTACT_DOMAIN).toBe('tychosystem.com')
  })

  it('has the exact required addresses', () => {
    expect(emails.founder).toBe('jordhan@tychosystem.com')
    expect(emails.contact).toBe('contact@tychosystem.com')
    expect(emails.hello).toBe('hello@tychosystem.com')
    expect(emails.info).toBe('info@tychosystem.com')
    expect(emails.support).toBe('support@tychosystem.com')
    expect(emails.billing).toBe('billing@tychosystem.com')
    expect(emails.privacy).toBe('privacy@tychosystem.com')
    expect(emails.resources).toBe('resources@tychosystem.com')
    expect(emails.partners).toBe('partners@tychosystem.com')
  })

  it('every address is on the correct domain', () => {
    for (const address of Object.values(emails)) {
      expect(address.endsWith(`@${CONTACT_DOMAIN}`)).toBe(true)
    }
  })

  it('builds accessible mailto links with encoded subjects', () => {
    expect(mailto(emails.support)).toBe('mailto:support@tychosystem.com')
    expect(mailto(emails.support, emailSubjects.support)).toBe(
      'mailto:support@tychosystem.com?subject=Support%20request'
    )
    expect(mailto(emails.privacy, emailSubjects.privacy)).toContain('?subject=Privacy%20request')
    expect(mailto(emails.partners, emailSubjects.partnership)).toContain('?subject=Partnership%20enquiry')
    expect(mailto(emails.billing, emailSubjects.billing)).toContain('?subject=Billing%20enquiry')
  })
})

/* ── 2. Frontend / server config are in sync ── */

describe('frontend and server contact config', () => {
  it('define identical addresses', () => {
    expect(serverEmails).toEqual(emails)
  })
})

/* ── 3. Legal page addresses ── */

describe('legal page addresses', () => {
  it('privacy policy uses the privacy address only', () => {
    expect(privacyMd).toContain('privacy@tychosystem.com')
    expect(privacyMd).not.toContain('felix@')
  })

  it('terms and refund policy use the billing address', () => {
    expect(termsMd).toContain('billing@tychosystem.com')
    expect(refundMd).toContain('billing@tychosystem.com')
    expect(termsMd).not.toContain('felix@')
    expect(refundMd).not.toContain('felix@')
  })
})

/* ── 4. Transactional sender / reply-to configuration ── */

describe('transactional email configuration', () => {
  // .env files cannot be imported via Vite (?raw is denied), so read from disk.
  const serverEnvExample = readFileSync(join(process.cwd(), 'server/.env.example'), 'utf8')

  it('recommends the resource-delivery sender and general reply-to', () => {
    expect(serverEnvExample).toContain(
      'TRANSACTIONAL_EMAIL_FROM="Tycho Systems <resources@tychosystem.com>"'
    )
    expect(serverEnvExample).toContain('TRANSACTIONAL_EMAIL_REPLY_TO=contact@tychosystem.com')
  })

  it('does not hard-code production sender addresses in server logic', () => {
    // The sender/reply-to must come from the environment, not a literal address.
    expect(emailLib).toContain('process.env.TRANSACTIONAL_EMAIL_FROM')
    expect(emailLib).not.toMatch(/@tychosystem\.com['"]/)
  })
})

/* ── 5. Server-side notification routing ── */

describe('server-side notification routing', () => {
  it('routes each category to the correct destination', () => {
    expect(notificationRecipients.general_contact).toBe('contact@tychosystem.com')
    expect(notificationRecipients.workflow_audit).toBe('contact@tychosystem.com')
    expect(notificationRecipients.support).toBe('support@tychosystem.com')
    expect(notificationRecipients.billing).toBe('billing@tychosystem.com')
    expect(notificationRecipients.privacy).toBe('privacy@tychosystem.com')
    expect(notificationRecipients.partnerships).toBe('partners@tychosystem.com')
    expect(notificationRecipients.pdf_delivery_failure).toBe('support@tychosystem.com')
    expect(notificationRecipients.critical_alert).toBe('jordhan@tychosystem.com')
  })

  it('classifies form sources server-side and resolves recipients', () => {
    expect(categoryForFormSource('strategy-call')).toBe('workflow_audit')
    expect(categoryForFormSource('support')).toBe('support')
    expect(categoryForFormSource('partnership')).toBe('partnerships')
    expect(categoryForFormSource(undefined)).toBe('general_contact')
    expect(resolveNotificationRecipient('billing')).toBe('billing@tychosystem.com')
  })

  it('falls back to general contact for unknown categories', () => {
    expect(resolveNotificationRecipient('nonsense')).toBe('contact@tychosystem.com')
    expect(resolveNotificationRecipient(undefined)).toBe('contact@tychosystem.com')
  })
})

/* ── 6 & 7. Repository hygiene scans (production-facing source only) ── */

const rawModules: Record<string, string> = {
  ...import.meta.glob('/src/**/*.{ts,tsx,md}', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('/server/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }),
}

// Exclude test files — hygiene rules apply to production-facing code only.
const productionEntries = Object.entries(rawModules).filter(
  ([path]) => !/\.test\.(ts|tsx)$/.test(path)
)
productionEntries.push(['/index.html', indexHtml])

describe('repository email hygiene', () => {
  it('contains no truncated tychosyste.com domain', () => {
    const offenders = productionEntries.filter(([, src]) => src.includes('tychosyste.com')).map(([p]) => p)
    expect(offenders).toEqual([])
  })

  it('contains no example placeholder email in production-facing code', () => {
    const offenders = productionEntries.filter(([, src]) => /@example\.com/.test(src)).map(([p]) => p)
    expect(offenders).toEqual([])
  })
})
