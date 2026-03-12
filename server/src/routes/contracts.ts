import { Router } from 'express'
import { renderContractText, buildDocumentName, type ContractItem } from '../lib/contract-template.js'
import { supabase } from '../lib/supabase.js'
import { stripe } from '../lib/stripe.js'

export const contractsRouter = Router()

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US')}`
}

function buildCtx(
  customerName: string,
  customerEmail: string,
  customerBusiness: string,
  customerPhone: string | undefined,
  items: ContractItem[],
) {
  return {
    customerName,
    customerEmail,
    customerBusiness,
    customerPhone,
    items,
    providerName:    process.env.COMPANY_NAME     || 'Tycho Systems',
    providerAddress: process.env.COMPANY_ADDRESS  || 'Remote (US)',
    governingState:  process.env.GOVERNING_STATE  || 'Texas',
    governingCounty: process.env.GOVERNING_COUNTY || 'Travis County, Texas',
    hourlyRate:      process.env.HOURLY_RATE       || '$150',
  }
}

// ─── POST /api/contracts/create ─────────────────────────────────────────────
// Step 1 of funnel: persist contract record and return rendered contract text.
contractsRouter.post('/create', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerBusiness,
      customerPhone,
      items,
    } = req.body as {
      customerName: string
      customerEmail: string
      customerBusiness: string
      customerPhone?: string
      items: ContractItem[]
    }

    if (!customerName || !customerEmail || !customerBusiness || !items?.length) {
      res.status(400).json({ error: 'customerName, customerEmail, customerBusiness, and items are required' })
      return
    }

    const ctx = buildCtx(customerName, customerEmail, customerBusiness, customerPhone, items)
    const contractText = renderContractText(ctx)

    const oneTimeTotal = items.filter((i) => !i.recurring).reduce((s, i) => s + i.priceInCents, 0)
    const depositTotal = items.reduce((s, i) => s + (i.depositPriceInCents ?? i.priceInCents), 0)

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        pandadoc_document_id: null,
        pandadoc_status:      'pending',
        signing_status:       'pending',
        customer_name:        customerName,
        customer_email:       customerEmail,
        customer_business:    customerBusiness,
        customer_phone:       customerPhone || null,
        items_json:           items,
        one_time_total_cents: oneTimeTotal,
        recurring_total_cents: depositTotal,
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Contract insert error:', error)
      res.status(500).json({ error: 'Failed to create contract record', detail: error?.message, code: error?.code })
      return
    }

    res.json({ contractId: data.id, contractText })
  } catch (err) {
    console.error('contracts/create error:', err)
    res.status(500).json({ error: 'Failed to create contract' })
  }
})

// ─── POST /api/contracts/:id/sign ───────────────────────────────────────────
// Step 2: record typed-name e-signature. Legally binding under the ESIGN Act.
contractsRouter.post('/:id/sign', async (req, res) => {
  try {
    const { signerName } = req.body as { signerName?: string }
    const contractId = req.params.id

    if (!signerName?.trim()) {
      res.status(400).json({ error: 'signerName is required' })
      return
    }

    // Fetch contract
    const { data: contract, error: fetchErr } = await supabase
      .from('contracts')
      .select('id, signing_status')
      .eq('id', contractId)
      .single()

    if (fetchErr || !contract) {
      res.status(404).json({ error: 'Contract not found' })
      return
    }

    if (contract.signing_status === 'signed') {
      res.status(409).json({ error: 'Contract already signed' })
      return
    }

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket.remoteAddress
      || 'unknown'

    const { error: updateErr } = await supabase
      .from('contracts')
      .update({
        signing_status: 'signed',
        pandadoc_status: 'completed',   // kept for backward-compat with Stripe webhook logic
        signer_name: signerName.trim(),
        signer_ip:   ip,
        signed_at:   new Date().toISOString(),
      })
      .eq('id', contractId)

    if (updateErr) {
      console.error('Contract sign error:', updateErr)
      res.status(500).json({ error: 'Failed to record signature' })
      return
    }

    console.log(`Contract ${contractId} signed by "${signerName}" from ${ip}`)
    res.json({ signed: true })
  } catch (err) {
    console.error('contracts/sign error:', err)
    res.status(500).json({ error: 'Failed to record signature' })
  }
})

// ─── POST /api/contracts/:id/payment ────────────────────────────────────────
// Step 3: verify contract is signed, create a single Stripe Checkout session.
// Mixed carts (one-time + recurring) are handled in one subscription session —
// Stripe charges one-time items on the first invoice automatically.
contractsRouter.post('/:id/payment', async (req, res) => {
  try {
    const contractId = req.params.id

    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()

    if (error || !contract) {
      res.status(404).json({ error: 'Contract not found' })
      return
    }

    if (contract.signing_status !== 'signed') {
      res.status(402).json({
        error: 'Contract has not been signed yet. Please sign the agreement before proceeding to payment.',
        status: contract.signing_status,
      })
      return
    }

    const allItems: ContractItem[] = contract.items_json

    // Checkout is deposit-only, always one-time payment mode.
    // Stripe charges depositPriceInCents (not full project price).
    const lineItems = allItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.invoiceLabel || item.name },
        unit_amount: item.depositPriceInCents ?? item.priceInCents,
      },
      quantity: 1,
    }))

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: contract.customer_email,
      metadata: { customerName: contract.customer_name, contractId },
      success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&id=${contractId}`,
      cancel_url:  `${clientUrl}/checkout/sign?id=${contractId}&cancelled=true`,
    })

    await supabase
      .from('contracts')
      .update({ stripe_session_id: session.id })
      .eq('id', contractId)

    res.json({ url: session.url, mode: 'payment' })
  } catch (err) {
    console.error('contracts/payment error:', err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create payment session' })
  }
})
