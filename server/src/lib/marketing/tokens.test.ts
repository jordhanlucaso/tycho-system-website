import { describe, it, expect } from 'vitest'
import {
  buildUnsubscribeUrl,
  createUnsubscribeTokenService,
  UnsubscribeTokenError,
} from './tokens.js'

const SECRET = 'test-secret-value-long-enough-for-the-check'
const OTHER_SECRET = 'a-completely-different-secret-of-good-length'

describe('unsubscribe tokens', () => {
  const tokens = createUnsubscribeTokenService(SECRET)

  it('round-trips an address', () => {
    const token = tokens.create('Ada@Example.com')
    expect(tokens.read(token)).toMatchObject({ email: 'ada@example.com' })
  })

  it('normalises case and whitespace so one address means one contact', () => {
    expect(tokens.read(tokens.create('  ADA@example.com  '))?.email).toBe('ada@example.com')
  })

  it('does not expose the address anywhere in the token', () => {
    const token = tokens.create('ada@example.com')

    expect(token).not.toContain('ada')
    expect(token).not.toContain('example.com')
    expect(token).not.toContain('@')
    // Not merely base64-encoded either.
    expect(Buffer.from(token, 'base64url').toString('utf8')).not.toContain('ada')
  })

  it('exposes no database identifier', () => {
    const payload = tokens.read(tokens.create('ada@example.com'))
    expect(Object.keys(payload ?? {}).sort()).toEqual(['email', 'iat'])
  })

  it('produces a different token each time for the same address', () => {
    // Random IV per token — two recipients' links are not comparable, and a
    // token cannot be recognised as "the one for that address".
    expect(tokens.create('ada@example.com')).not.toBe(tokens.create('ada@example.com'))
  })

  it('builds a URL that carries only the token', () => {
    const url = buildUnsubscribeUrl('https://tychosystem.com/', tokens.create('ada@example.com'))

    expect(url.startsWith('https://tychosystem.com/unsubscribe?t=')).toBe(true)
    expect(url).not.toContain('ada')
    expect(url).not.toContain('%40')
  })

  it('does not expire — an old marketing email must still work', () => {
    const twoYearsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 730)
    const token = tokens.create('ada@example.com', twoYearsAgo)

    expect(tokens.read(token)?.email).toBe('ada@example.com')
  })
})

describe('rejecting bad tokens', () => {
  const tokens = createUnsubscribeTokenService(SECRET)

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty', ''],
    ['nonsense', 'not-a-token'],
    ['wrong segment count', 'u1.aaa.bbb'],
    ['wrong version', tokens.create('ada@example.com').replace(/^u1/, 'u2')],
  ])('rejects %s', (_label, value) => {
    expect(tokens.read(value as string | undefined)).toBeNull()
  })

  it('rejects a tampered ciphertext rather than resolving to another address', () => {
    const [version, iv, ciphertext, tag] = tokens.create('ada@example.com').split('.')
    const flipped = Buffer.from(ciphertext, 'base64url')
    flipped[0] ^= 0xff

    expect(tokens.read([version, iv, flipped.toString('base64url'), tag].join('.'))).toBeNull()
  })

  it('rejects a tampered auth tag', () => {
    const [version, iv, ciphertext, tag] = tokens.create('ada@example.com').split('.')
    const flipped = Buffer.from(tag, 'base64url')
    flipped[0] ^= 0xff

    expect(tokens.read([version, iv, ciphertext, flipped.toString('base64url')].join('.'))).toBeNull()
  })

  it('rejects a token signed with a different secret', () => {
    const foreign = createUnsubscribeTokenService(OTHER_SECRET).create('ada@example.com')
    expect(tokens.read(foreign)).toBeNull()
  })

  it('refuses to start with a weak secret', () => {
    expect(() => createUnsubscribeTokenService('short')).toThrow(UnsubscribeTokenError)
  })
})
