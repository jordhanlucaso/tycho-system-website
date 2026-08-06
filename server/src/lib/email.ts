/**
 * Transactional email provider abstraction. The default adapter speaks the
 * Resend HTTP API, but anything implementing TransactionalEmailProvider can be
 * swapped in. Credentials never leave the server.
 *
 * Env:
 *   TRANSACTIONAL_EMAIL_API_KEY   — provider API key (unset = email disabled)
 *   TRANSACTIONAL_EMAIL_FROM      — e.g. "Tycho Systems <resources@tychosystem.com>"
 *   TRANSACTIONAL_EMAIL_REPLY_TO  — optional reply-to address (e.g. contact@tychosystem.com)
 */

export type TransactionalEmail = {
  to: string
  subject: string
  text: string
  html?: string
  /**
   * Extra SMTP headers. Used by the marketing sender for RFC 8058 one-click
   * unsubscribe (`List-Unsubscribe` / `List-Unsubscribe-Post`), which Resend
   * passes through via its `headers` field. Never set these by hand on a
   * transactional message.
   */
  headers?: Record<string, string>
}

export interface TransactionalEmailProvider {
  readonly name: string
  send(email: TransactionalEmail): Promise<void>
}

export class EmailDeliveryError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'EmailDeliveryError'
  }
}

export class ResendEmailProvider implements TransactionalEmailProvider {
  readonly name = 'resend'

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly replyTo?: string
  ) {}

  async send(email: TransactionalEmail): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [email.to],
        subject: email.subject,
        text: email.text,
        ...(email.html ? { html: email.html } : {}),
        ...(email.headers ? { headers: email.headers } : {}),
        ...(this.replyTo ? { reply_to: this.replyTo } : {}),
      }),
    })

    if (!res.ok) {
      // Never include the recipient address in the error.
      throw new EmailDeliveryError(`Email provider responded ${res.status}`, res.status)
    }
  }
}

/** Returns null when no provider is configured (dev / demo mode). */
export function createEmailProviderFromEnv(): TransactionalEmailProvider | null {
  const apiKey = process.env.TRANSACTIONAL_EMAIL_API_KEY
  const from = process.env.TRANSACTIONAL_EMAIL_FROM
  if (!apiKey || !from) return null
  return new ResendEmailProvider(apiKey, from, process.env.TRANSACTIONAL_EMAIL_REPLY_TO)
}

/**
 * Provider for marketing sends. Identical transport, but a separate `from` so
 * bulk mail can use its own address (commonly a subdomain) without putting the
 * reputation of transactional delivery — receipts, contracts, password resets —
 * at risk. Falls back to the transactional sender when MARKETING_EMAIL_FROM is
 * unset.
 */
export function createMarketingEmailProviderFromEnv(): TransactionalEmailProvider | null {
  const apiKey = process.env.TRANSACTIONAL_EMAIL_API_KEY
  const from = process.env.MARKETING_EMAIL_FROM || process.env.TRANSACTIONAL_EMAIL_FROM
  if (!apiKey || !from) return null
  return new ResendEmailProvider(apiKey, from, process.env.TRANSACTIONAL_EMAIL_REPLY_TO)
}
