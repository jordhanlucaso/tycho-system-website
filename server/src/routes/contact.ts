import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { createEmailProviderFromEnv } from '../lib/email.js'
import { verifyRecaptcha } from '../lib/recaptcha.js'
import {
  categoryForFormSource,
  resolveNotificationRecipient,
} from '../config/contact.js'

export const contactRouter = Router()

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

    // Verify reCAPTCHA v3. Always runs; skipped internally when no secret is
    // configured (dev). Once a key is set, a missing/low-score token is rejected.
    const verification = await verifyRecaptcha(recaptchaToken, { expectedAction: 'website_check' })
    if (!verification.ok) {
      console.warn(`reCAPTCHA rejected (contact): reason=${verification.reason} score=${verification.score}`)
      res.status(400).json({ error: 'Bot verification failed. Please try again.' })
      return
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
