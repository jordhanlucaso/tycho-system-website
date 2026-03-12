import { Router } from 'express'
import express from 'express'
import { stripe } from '../lib/stripe.js'
import { supabase } from '../lib/supabase.js'

export const stripeRouter = Router()

type CartItem = { name: string; priceInCents: number; recurring: boolean }

// Create Stripe Checkout Session
// Accepts optional `filter: 'one-time' | 'recurring'` to handle mixed carts.
stripeRouter.post('/checkout', async (req, res) => {
  try {
    const { items, customerEmail, customerName, filter } = req.body as {
      items: CartItem[]
      customerEmail: string
      customerName: string
      filter?: 'one-time' | 'recurring'
    }

    if (!items?.length) {
      res.status(400).json({ error: 'No items provided' })
      return
    }

    const filteredItems: CartItem[] = filter === 'one-time'
      ? items.filter((i) => !i.recurring)
      : filter === 'recurring'
        ? items.filter((i) => i.recurring)
        : items

    if (!filteredItems.length) {
      res.status(400).json({ error: 'No items match the specified filter' })
      return
    }

    const hasRecurring = filteredItems.some((i) => i.recurring)
    const hasOneTime = filteredItems.some((i) => !i.recurring)

    if (hasRecurring && hasOneTime) {
      res.status(400).json({ error: 'Cannot mix one-time and recurring items. Use the filter parameter.' })
      return
    }

    const mode = hasRecurring ? 'subscription' : 'payment'

    const lineItems = filteredItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.priceInCents,
        ...(item.recurring ? { recurring: { interval: 'month' as const } } : {}),
      },
      quantity: 1,
    }))

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: { customerName, filter: filter ?? 'all' },
      success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=${mode}`,
      cancel_url: `${clientUrl}/checkout/cancel`,
    })

    res.json({ url: session.url, mode })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// Stripe webhook handler
stripeRouter.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY

  if (!webhookSecret || webhookSecret === 'whsec_...') {
    console.warn('STRIPE_WEBHOOK_SECRET_KEY not configured — skipping verification')
    res.json({ received: true })
    return
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error:', err)
    res.status(400).json({ error: 'Webhook verification failed' })
    return
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const documentId = session.metadata?.documentId
        const customerEmail = session.customer_email ?? ''
        const amountTotal = session.amount_total ?? 0
        const mode = session.mode // 'payment' | 'subscription'

        // Update contract record if this payment came from PandaDoc funnel
        if (documentId) {
          await supabase
            .from('contracts')
            .update({
              stripe_session_id: session.id,
              stripe_payment_status: session.payment_status,
              ...(mode === 'subscription' && session.subscription
                ? { stripe_subscription_id: String(session.subscription) }
                : {}),
            })
            .eq('pandadoc_document_id', documentId)
        }

        // Find the client profile by email to create an invoice record
        if (customerEmail && amountTotal > 0) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .single()

          if (profile) {
            const description = mode === 'subscription'
              ? 'Monthly subscription payment'
              : `Project deposit — ${session.metadata?.customerName ?? ''}`

            await supabase.from('invoices').insert({
              client_id: profile.id,
              stripe_session_id: session.id,
              amount_cents: amountTotal,
              currency: session.currency ?? 'usd',
              status: session.payment_status === 'paid' ? 'paid' : 'pending',
              description,
              items: [],
              paid_at: session.payment_status === 'paid' ? new Date().toISOString() : null,
            })
          }
        }

        console.log('Checkout completed:', session.id, '| Mode:', mode, '| Status:', session.payment_status)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object
        const subscriptionId = invoice.parent?.subscription_details?.subscription

        // Update subscription status
        if (subscriptionId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_start: new Date(invoice.period_start * 1000).toISOString(),
              current_period_end: new Date(invoice.period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', String(subscriptionId))
        }

        console.log('Invoice paid:', invoice.id)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', sub.id)

        console.log('Subscription cancelled:', sub.id)
        break
      }

      default:
        console.log('Unhandled webhook event:', event.type)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  res.json({ received: true })
})
