# Privacy Policy — Tycho Systems

_Last updated: 2026-08-06_

This policy explains what data we collect when you visit **tychosystem.com** or buy a product, and what we do with it. We aim to collect as little as possible.

## 1. Who is the data controller

**Tycho Systems Oliveira e Silva ENK**, a Norwegian sole proprietorship (enkeltpersonforetak). Contact: **privacy@tychosystem.com**.

Because Norway is part of the EEA, the **GDPR** (and Norwegian Personal Data Act) apply to how we handle personal data.

## 2. What we collect and why

We take payment in two different ways depending on what you are buying, and the two work differently — so they are described separately.

### a. When you buy a digital product
Digital products (downloadable guides, prompt packs and setup kits) are sold through our **Lemon Squeezy** storefront, which acts as our Merchant of Record. They collect the data they need to complete the sale: your email, name, billing/country info, and payment method. We receive a summary of the transaction (order ID, product, amount, customer email) so we can deliver your product and answer support questions.

**Legal basis:** performance of the contract you entered into when you bought the product.

Lemon Squeezy's own privacy practices apply to the payment data they hold. See: https://www.lemonsqueezy.com/privacy.

### a2. When you pay for a project or a monthly plan
Project deposits, invoices and monthly plans are handled separately, through **Stripe**. You are taken to Stripe's own hosted checkout page to pay, so your **card details are entered on Stripe's systems and never reach our servers** — we cannot see them and we do not store them.

We pass Stripe only what it needs to take the payment: the items and amounts, your email address and your name.

Stripe sends us back a summary of the transaction: a payment reference, the amount and currency, whether the payment succeeded, and — for monthly plans — a subscription reference. We store that against your invoice and, where relevant, your signed contract, so that we can deliver the work, show your billing history in the client portal, and answer support questions.

Unlike the digital-product storefront above, this is not a merchant-of-record arrangement: for project work **Tycho Systems is the seller and the data controller**, and Stripe processes the payment on our behalf.

**Legal basis:** performance of the contract you entered into when you engaged us.

Stripe's own privacy practices apply to the payment data they hold, including your card details. See: https://stripe.com/privacy. Stripe also sets its own cookies on its checkout pages, which we cannot control — see our [Cookie Policy](/cookies).

### b. When you request a free guide (lead magnet)
When you request one of our free guides (such as *The AI Operations Pain Map* or *The Practical AI Dictionary*), we collect the details you enter in the form: your **name**, **email address**, **role**, and — depending on the guide — optional context such as company name, team size, your main operational bottleneck, or your AI learning goals. We also record the campaign or page that brought you to the form (UTM parameters and referrer).

We use this data to:

- **Deliver the guide you asked for** and record that the request happened. *Legal basis: performance of your request (and our legitimate interest in keeping a record of it).*
- **Choose which of the two guides fits your role**, using a simple deterministic rule — no profiling beyond the answers you gave.
- **Send you occasional practical emails** about AI, automation, websites and business systems — **only if you tick the separate marketing checkbox**. That checkbox is optional and unticked by default; you receive the guide either way. We record the wording version and timestamp of your consent. You can unsubscribe at any time using the link in any email or by contacting us. *Legal basis: your consent.*

Your contact details and form answers are stored in **HubSpot**, our customer-relationship system. On our own server we keep a minimal audit record that contains a **hashed** (unreadable) form of your email address rather than the address itself, together with the guide requested, the consent state, and the campaign attribution.

### b2. When you sign up for marketing emails
We collect your **email address**, the date you subscribed, and the wording version of the consent you gave, and we use it only for the updates you asked for. Marketing consent is always a separate, unticked checkbox — never bundled with terms, a purchase or a support request, and never a condition of getting the thing you actually came for.

**You can unsubscribe at any time.** Every marketing email carries a visible unsubscribe link in its footer, and supports one-click unsubscribe in email clients that offer it. The link needs no login and no password. It uses a signed, opaque token — your email address is not exposed in the link.

When you unsubscribe we record that you have opted out and stop sending marketing email. We do **not** delete your customer or enquiry records, because we may still need them for a contract, an invoice or a support conversation — but they are excluded from every marketing send from that point on. Submitting another form, buying something or contacting support will **not** resubscribe you; that takes a new, explicit opt-in from you.

You will still receive **transactional** messages where they are necessary — a guide you asked for, a receipt, a contract, a password reset or a direct reply. Those are not marketing and do not stop when you unsubscribe.

**Legal basis:** your consent (marketing); performance of a contract or our legitimate interest in responding to you (transactional).

### c. When you visit the site
**We currently run no analytics on this site.** No analytics provider is contacted and no analytics script is loaded. Our code is built to support **Plausible Analytics** — a privacy-friendly, cookieless tool that does not track visitors across sites and collects no personally identifiable information (see https://plausible.io/data-policy) — but it is not enabled. If we turn it on, we will update this policy and the [Cookie Policy](/cookies) first, and it will load only for visitors who have allowed the Analytics category.

What the site does store in your browser, and when, is set out in full in our **[Cookie Policy](/cookies)**. In short: strictly necessary storage keeps you signed in, holds your basket and checkout together, remembers your cookie choice and protects our forms from bots. Everything else — a remembered light/dark preference, and campaign attribution for your current visit — is off until you switch it on.

**Legal basis:** strictly necessary technologies — our legitimate interest in operating and securing the site (no consent required). Everything optional — your consent, which you can withdraw at any time via **"Cookie settings"** in the footer of any page. Withdrawing takes one click, exactly like giving it, and we delete the optional values we set as soon as you do.

### d. When you email us
The email account that receives your message stores it for as long as it's relevant to support or our records.

**Legal basis:** legitimate interest in responding to you.

## 3. What we do NOT do

- We don't sell your data.
- We don't share it with advertisers.
- We don't run third-party tracking pixels (no Meta pixel, no Google Analytics, no remarketing).
- We don't enrich your data from external sources.

## 4. Who else sees your data

The minimum third parties needed to operate the business:

- **Lemon Squeezy** — digital-product storefront: payment processing + tax (Merchant of Record).
- **Stripe** — payment processing for project deposits, invoices and monthly plans. Card details are entered on, and held by, Stripe; we never receive them. See: https://stripe.com/privacy.
- **Plausible Analytics** — anonymous site metrics. *Not currently enabled; see section 2c.*
- **Fastmail** — email hosting for support correspondence.
- **HubSpot** — customer-relationship management: stores lead-magnet and enquiry contact details, form answers, and consent records. See: https://legal.hubspot.com/privacy-policy.
- **Resend** (or an equivalent email provider) — sends the one-off email that delivers a guide you requested, and any marketing email we send directly.
- **Supabase** — database hosting for our minimal audit records (hashed email, requested guide, consent state, attribution) and our marketing opt-out list, which stores a hashed email address rather than the address itself.
- **Vercel** — website hosting (logs request metadata such as IP and user agent for delivery and security; standard for any CDN-fronted site).
- **Google reCAPTCHA** — invisible spam/bot protection on our contact and resource-request forms. Google may process the interaction (including IP and device signals) to score the request. See: https://policies.google.com/privacy.

Each operates under their own privacy terms. We pick providers that meet GDPR standards.

## 5. Retention

- **Order data:** kept for as long as legally required for tax and consumer-protection records (typically 5 years in Norway), then deleted.
- **Newsletter / lead-magnet contacts:** kept while the relationship is active; if you unsubscribe (or never consented to marketing), we keep only what is needed to honour the unsubscribe and record that the guide was delivered. You can request full deletion at any time.
- **Lead-magnet audit records:** the hashed request records on our server are kept for up to 24 months, then deleted.
- **Support emails:** kept while they may still be relevant; deleted on request.

## 6. Your rights (GDPR)

You have the right to:

- **Access** the personal data we hold about you.
- **Correct** any inaccuracies.
- **Delete** your data (subject to legal-retention exceptions).
- **Export** your data in a portable format.
- **Object** to processing based on legitimate interest.
- **Withdraw consent** at any time (for newsletter, lead magnet, etc.).
- **Complain** to the Norwegian Data Protection Authority (Datatilsynet) if you think we've mishandled your data.

To exercise any of these, email **privacy@tychosystem.com** and we'll respond within 30 days.

## 7. International transfers

Some of our providers are based outside the EEA. When that's the case, we rely on the provider's GDPR-compatible safeguards (Standard Contractual Clauses, Adequacy Decisions, or equivalent).

## 8. Updates to this policy

When this policy changes materially we'll update the **Last updated** date at the top and announce the change in our newsletter or on the site.

## 9. Contact

Privacy questions or rights requests: **privacy@tychosystem.com**.

See also our **[Cookie Policy](/cookies)** for the full list of what this site stores in your browser, and how to change or withdraw that consent.
