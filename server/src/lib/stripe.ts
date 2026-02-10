import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey) {
  console.warn('STRIPE_SECRET_KEY not set. Payment features will be unavailable.')
}

export const stripe = new Stripe(secretKey || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil'
})
