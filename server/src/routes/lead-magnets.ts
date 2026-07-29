import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { createCrmClientFromEnv } from '../lib/hubspot.js'
import { createEmailProviderFromEnv } from '../lib/email.js'
import { processLeadMagnetSubscription } from '../lib/lead-magnets/service.js'
import type {
  LeadMagnetDeps,
  LeadMagnetRequestRecord,
  LeadMagnetStore,
  Logger,
} from '../lib/lead-magnets/service.js'

export const leadMagnetsRouter = Router()

/* ── Rate limiting: 5 submissions per IP per 10 minutes (in-memory). ── */
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const submissions = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const cutoff = Date.now() - RATE_WINDOW_MS
  const recent = (submissions.get(ip) ?? []).filter((t) => t > cutoff)
  if (recent.length >= RATE_LIMIT) {
    submissions.set(ip, recent)
    return true
  }
  recent.push(Date.now())
  submissions.set(ip, recent)
  // Opportunistic cleanup so the map cannot grow unbounded.
  if (submissions.size > 5000) {
    for (const [key, times] of submissions) {
      if (times.every((t) => t <= cutoff)) submissions.delete(key)
    }
  }
  return false
}

/** Structured logs with no personal data — emails only ever appear hashed. */
const log: Logger = (level, message, meta) => {
  const line = JSON.stringify({ level, message, ...meta })
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

const store: LeadMagnetStore = {
  async upsertRequest(record: LeadMagnetRequestRecord) {
    const { error } = await supabase
      .from('lead_magnet_requests')
      .upsert(
        { ...record, updated_at: new Date().toISOString() },
        { onConflict: 'email_hash,requested_resource' }
      )
    if (error) throw new Error(error.message)
  },
}

function buildDeps(): LeadMagnetDeps {
  return {
    crm: createCrmClientFromEnv(),
    email: createEmailProviderFromEnv(),
    store,
    siteUrl: (process.env.PUBLIC_SITE_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
    log,
  }
}

// POST /api/lead-magnets/subscribe
leadMagnetsRouter.post('/subscribe', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip || 'unknown'
    if (isRateLimited(ip)) {
      res.status(429).json({
        ok: false,
        error: 'Too many requests. Please wait a few minutes and try again.',
      })
      return
    }

    const result = await processLeadMagnetSubscription(buildDeps(), req.body)
    res.status(result.status).json(result.body)
  } catch (err) {
    log('error', 'lead_magnet.unhandled_error', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    res.status(500).json({
      ok: false,
      error: 'Something went wrong processing your request. Please try again.',
    })
  }
})
