import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Opaque, authenticated unsubscribe tokens.
 *
 * Requirements this satisfies:
 * - The recipient's address never appears in the URL. It is AES-256-GCM
 *   encrypted, so the token is opaque rather than merely encoded.
 * - No database id is exposed, sequential or otherwise.
 * - Tampering is detected: GCM authenticates the ciphertext, so a modified
 *   token fails to decrypt rather than resolving to some other contact.
 * - **No expiry.** A marketing email sent two years ago must still be
 *   unsubscribable. `iat` is carried for audit and future key rotation only and
 *   is deliberately never enforced.
 *
 * We encrypt rather than store-and-look-up because the application holds only a
 * SHA-256 hash of each address (see migration 005) — the plaintext address is
 * needed to tell HubSpot, the source of truth for marketing sends, who opted
 * out. The token is the only place it travels, and it travels sealed.
 *
 * Env: UNSUBSCRIBE_TOKEN_SECRET — any high-entropy string, e.g.
 * `openssl rand -base64 48`. Unset = tokens unavailable, which makes
 * `sendMarketingEmail` refuse to send rather than send a broken footer.
 */

const VERSION = 'u1'
const IV_BYTES = 12
const MIN_SECRET_LENGTH = 24

export type UnsubscribePayload = {
  /** Normalised (lower-cased, trimmed) email address. */
  email: string
  /** Issued-at, epoch seconds. Audit only — never used to reject a token. */
  iat: number
}

export class UnsubscribeTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnsubscribeTokenError'
  }
}

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url')
}

/** Derive a stable 32-byte key from the configured secret. */
function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret, 'utf8').digest()
}

export interface UnsubscribeTokenService {
  /** Seal an address into a URL-safe token. */
  create(email: string, issuedAt?: Date): string
  /** Open a token, or return null when it is absent, malformed or tampered with. */
  read(token: string | undefined | null): UnsubscribePayload | null
}

export function createUnsubscribeTokenService(secret: string): UnsubscribeTokenService {
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new UnsubscribeTokenError(
      `UNSUBSCRIBE_TOKEN_SECRET must be at least ${MIN_SECRET_LENGTH} characters`
    )
  }

  const key = deriveKey(secret)

  return {
    create(email: string, issuedAt: Date = new Date()): string {
      const payload: UnsubscribePayload = {
        email: email.trim().toLowerCase(),
        iat: Math.floor(issuedAt.getTime() / 1000),
      }

      const iv = randomBytes(IV_BYTES)
      const cipher = createCipheriv('aes-256-gcm', key, iv)
      const ciphertext = Buffer.concat([
        cipher.update(JSON.stringify(payload), 'utf8'),
        cipher.final(),
      ])

      return [VERSION, base64url(iv), base64url(ciphertext), base64url(cipher.getAuthTag())].join('.')
    },

    read(token: string | undefined | null): UnsubscribePayload | null {
      if (typeof token !== 'string' || token.length === 0) return null

      const parts = token.split('.')
      if (parts.length !== 4) return null

      const [version, ivPart, ciphertextPart, tagPart] = parts
      // Constant-time compare on the version so probing cannot be timed.
      const expected = Buffer.from(VERSION)
      const actual = Buffer.from(version)
      if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null

      try {
        const decipher = createDecipheriv(
          'aes-256-gcm',
          key,
          Buffer.from(ivPart, 'base64url')
        )
        decipher.setAuthTag(Buffer.from(tagPart, 'base64url'))
        const plaintext = Buffer.concat([
          decipher.update(Buffer.from(ciphertextPart, 'base64url')),
          decipher.final(),
        ]).toString('utf8')

        const parsed: unknown = JSON.parse(plaintext)
        if (typeof parsed !== 'object' || parsed === null) return null

        const candidate = parsed as Partial<UnsubscribePayload>
        if (typeof candidate.email !== 'string' || candidate.email.length === 0) return null

        return {
          email: candidate.email,
          iat: typeof candidate.iat === 'number' ? candidate.iat : 0,
        }
      } catch {
        // Wrong key, truncated token, flipped bit, bad JSON — all the same
        // answer to the caller, and nothing about which is logged.
        return null
      }
    },
  }
}

/** Returns null when no secret is configured. */
export function createUnsubscribeTokenServiceFromEnv(): UnsubscribeTokenService | null {
  const secret = process.env.UNSUBSCRIBE_TOKEN_SECRET
  if (!secret) return null
  return createUnsubscribeTokenService(secret)
}

/** Build the visitor-facing unsubscribe URL for a token. */
export function buildUnsubscribeUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/+$/, '')}/unsubscribe?t=${encodeURIComponent(token)}`
}
