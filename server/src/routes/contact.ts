import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { createEmailProviderFromEnv } from '../lib/email.js'
import {
  categoryForFormSource,
  resolveNotificationRecipient,
} from '../config/contact.js'

export const contactRouter = Router()

interface RecaptchaResponse {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    // No key configured — allow in dev/demo mode
    console.warn('RECAPTCHA_SECRET_KEY not set, skipping verification')
    return { success: true, score: 1 }
  }

  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data: RecaptchaResponse = await res.json()
  return { success: data.success, score: data.score ?? 0 }
}

// POST /api/contact
// Verifies reCAPTCHA v3 token, saves lead, returns success
contactRouter.post('/', async (req, res) => {
  try {
    const {
      businessName,
      city,
      category,
      email,
      message,
      source,
      recaptchaToken,
    } = req.body as {
      businessName?: string
      city?: string
      category?: string
      email?: string
      message?: string
      source?: string
      recaptchaToken?: string
    }

    if (!businessName || !email || !message) {
      res.status(400).json({ error: 'businessName, email, and message are required' })
      return
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const { success, score } = await verifyRecaptcha(recaptchaToken)
      if (!success || score < 0.5) {
        console.warn(`reCAPTCHA rejected: success=${success}, score=${score}`)
        res.status(400).json({ error: 'Bot verification failed. Please try again.' })
        return
      }
      console.log(`reCAPTCHA passed: score=${score}`)
    }

    // Insert into leads table
    const { error } = await supabase.from('leads').insert({
      name: businessName,
      email,
      business_name: businessName,
      source: 'contact_form',
      status: 'new',
      notes: [
        city ? `City: ${city}` : '',
        category ? `Category: ${category}` : '',
        message,
      ].filter(Boolean).join('\n'),
    })

    if (error) {
      console.error('Contact form lead insert error:', error)
      // Don't expose DB errors to client — still return success if it was a non-critical error
    }

    // Internal notification. The SERVER decides the destination from the form's
    // source hint (never a client-supplied address), so the browser can neither
    // choose nor see where the notification is routed. Best-effort: a delivery
    // failure must never fail the visitor's submission.
    const notificationCategory = categoryForFormSource(source)
    const notifyTo = resolveNotificationRecipient(notificationCategory)
    const emailProvider = createEmailProviderFromEnv()
    if (emailProvider) {
      try {
        await emailProvider.send({
          to: notifyTo,
          subject: `New ${notificationCategory.replace(/_/g, ' ')} — ${businessName}`,
          text: [
            `Category: ${notificationCategory}`,
            `Business: ${businessName}`,
            city ? `City: ${city}` : '',
            category ? `Category tag: ${category}` : '',
            `Reply-to: ${email}`,
            '',
            message,
          ]
            .filter(Boolean)
            .join('\n'),
        })
      } catch (err) {
        console.error('Contact notification email failed:', err instanceof Error ? err.message : 'unknown')
      }
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    res.status(500).json({ error: 'Failed to process your request. Please try again.' })
  }
})
