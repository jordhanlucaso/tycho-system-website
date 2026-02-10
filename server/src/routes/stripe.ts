import { Router } from 'express'
import express from 'express'
import { stripe } from '../lib/stripe.js'

export const stripeRouter = Router()

// Create Stripe Checkout Session
stripeRouter.post('/checkout', async (req, res) => {
  try {
    const { items, customerEmail, customerName } = req.body

    if (!items?.length) {
      res.status(400).json({ error: 'No items provided' })
      return
    }

    const lineItems = items.map((item: { name: string; priceInCents: number; recurring: boolean }) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.priceInCents,
        ...(item.recurring ? { recurring: { interval: 'month' as const } } : {})
      },
      quantity: 1
    }))

    const session = await stripe.checkout.sessions.create({
      mode: items.some((i: { recurring: boolean }) => i.recurring) ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: { customerName },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/cancel`
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// Stripe webhook handler
stripeRouter.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set, skipping webhook verification')
    res.status(400).json({ error: 'Webhook secret not configured' })
    return
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout completed:', session.id)
        // TODO: Create invoice record in Supabase, update client profile
        break
      }
      case 'invoice.paid': {
        console.log('Invoice paid:', event.data.object.id)
        // TODO: Update subscription status in Supabase
        break
      }
      default:
        console.log('Unhandled webhook event:', event.type)
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(400).json({ error: 'Webhook verification failed' })
  }
})
