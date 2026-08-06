export type Milestone = {
  label: string
  amountInCents: number
}

export type ContractItem = {
  id: string
  sku: string
  name: string
  contractTitle: string
  invoiceLabel: string
  priceInCents: number
  depositPriceInCents?: number
  remainingMilestones?: Milestone[]
  recurring: boolean
  delivery?: string
  revisions?: string
  includedPages?: number | string
  features?: string[]
  outOfScope?: string[]
  description?: string
}

export type ContractContext = {
  customerName: string
  customerEmail: string
  customerBusiness: string
  customerPhone?: string
  items: ContractItem[]
  providerName: string
  providerAddress: string
  governingState: string
  governingCounty: string
  hourlyRate: string
}

function fmt(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US')}`
}

export type ContractTotals = {
  /** Full price of all one-time work. Excludes monthly plans. */
  oneTimeTotal: number
  /** What Stripe charges at checkout: one-time deposits only. */
  depositTotal: number
  /** Combined monthly plan price. Billed on its own schedule, never at checkout. */
  monthlyTotal: number
}

/**
 * The single source of truth for contract money.
 *
 * Monthly plans must never reach the deposit: they have no
 * `depositPriceInCents` (it is one-time only, see src/config/pricing.ts), so
 * summing the deposit across every item would silently fall back to the full
 * monthly price and bill it once, up front — producing a contract whose
 * "deposit due on signing" could exceed its "total project fee".
 *
 * Both the rendered agreement and the Stripe checkout session derive their
 * amounts from here, so the document and the charge cannot drift apart.
 */
export function computeContractTotals(items: ContractItem[]): ContractTotals {
  const oneTime = items.filter((i) => !i.recurring)
  const recurring = items.filter((i) => i.recurring)

  return {
    oneTimeTotal: oneTime.reduce((sum, i) => sum + i.priceInCents, 0),
    depositTotal: oneTime.reduce((sum, i) => sum + (i.depositPriceInCents ?? i.priceInCents), 0),
    monthlyTotal: recurring.reduce((sum, i) => sum + i.priceInCents, 0),
  }
}

/** Exhibit A. One-time work only — monthly plans are described in Exhibit B. */
function buildScopeOfWork(items: ContractItem[]): string {
  if (items.length === 0) {
    return 'No one-time project work is included in this Agreement.\n'
  }

  const lines: string[] = []

  for (const item of items) {
    const deposit = item.depositPriceInCents ?? item.priceInCents

    lines.push(`${item.contractTitle}`)
    lines.push('─'.repeat(50))
    lines.push(`SKU:              ${item.sku}`)
    lines.push(`Total price:      ${fmt(item.priceInCents)}`)
    lines.push(`Deposit due now:  ${fmt(deposit)}`)

    if (item.remainingMilestones?.length) {
      lines.push('Payment schedule:')
      lines.push(`  Deposit (now):  ${fmt(deposit)}`)
      for (const m of item.remainingMilestones) {
        lines.push(`  ${m.label}: ${fmt(m.amountInCents)}`)
      }
    }

    if (item.delivery)      lines.push(`Delivery:         ${item.delivery}`)
    if (item.revisions)     lines.push(`Revisions:        ${item.revisions}`)
    if (item.includedPages) lines.push(`Included pages:   ${item.includedPages}`)

    if (item.features?.length) {
      lines.push('')
      lines.push('Included in scope:')
      item.features.forEach((f) => lines.push(`  • ${f}`))
    }

    if (item.outOfScope?.length) {
      lines.push('')
      lines.push('Explicitly out of scope:')
      item.outOfScope.forEach((f) => lines.push(`  ✕ ${f}`))
    }

    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Exhibit B. Monthly plans, with their own pricing and cancellation terms.
 *
 * Always rendered, even when no plan is selected, so section and exhibit
 * numbering does not shift with the contents of the cart — a signed agreement
 * whose clause numbers depend on what was bought is a drafting hazard.
 */
function buildMonthlyPlanExhibit(items: ContractItem[], monthlyTotal: number): string {
  if (items.length === 0) {
    return 'No monthly plan is included in this Agreement.\n'
  }

  const lines: string[] = []

  for (const item of items) {
    lines.push(`${item.contractTitle}`)
    lines.push('─'.repeat(50))
    lines.push(`SKU:              ${item.sku}`)
    lines.push(`Monthly price:    ${fmt(item.priceInCents)} per month`)

    if (item.features?.length) {
      lines.push('')
      lines.push('Included in plan:')
      item.features.forEach((f) => lines.push(`  • ${f}`))
    }

    if (item.outOfScope?.length) {
      lines.push('')
      lines.push('Explicitly out of plan:')
      item.outOfScope.forEach((f) => lines.push(`  ✕ ${f}`))
    }

    lines.push('')
  }

  lines.push(`Total monthly:    ${fmt(monthlyTotal)} per month`)
  lines.push('Billing:          Monthly via Stripe auto-pay')
  lines.push('Starts:           After delivery and acceptance of the Exhibit A work')
  lines.push("Cancellation:     30 days' written notice")

  return lines.join('\n')
}

/** Returns the full rendered contract as a plain-text string with all values substituted. */
export function renderContractText(ctx: ContractContext): string {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const oneTimeItems = ctx.items.filter((i) => !i.recurring)
  const recurringItems = ctx.items.filter((i) => i.recurring)
  const { oneTimeTotal, depositTotal, monthlyTotal } = computeContractTotals(ctx.items)

  const deliveryTimeline = oneTimeItems[0]?.delivery ?? 'To be agreed'
  const revisionRounds = oneTimeItems[0]?.revisions ?? 'As per package'
  const scopeOfWork = buildScopeOfWork(oneTimeItems)
  const monthlyPlanExhibit = buildMonthlyPlanExhibit(recurringItems, monthlyTotal)

  // Section 9 always exists so the numbering of 10-15 is stable, whether or not
  // a plan was selected.
  const monthlyPlanClause = recurringItems.length
    ? `9.1 Monthly plan selected: ${recurringItems.map((i) => i.contractTitle).join(', ')} (see Exhibit B).
9.2 Monthly plan price: ${fmt(monthlyTotal)} per month, billed via Stripe auto-pay,
    beginning after delivery and acceptance of the work in Exhibit A.
9.3 Out-of-plan work is billed at ${ctx.hourlyRate}/hour or quoted as a fixed add-on.
9.4 Client may cancel the monthly plan on 30 days' written notice. Non-payment may
    result in suspension of the plan.
9.5 Monthly plan fees are separate from the project fee in 3.1 and are not included
    in the deposit in 3.2.`
    : `9.1 No monthly plan is included in this Agreement (see Exhibit B).
9.2 A monthly care plan may be added later by separate written agreement, at the
    rates then in effect.`

  const milestonesSection = oneTimeItems.flatMap((item) => {
    if (!item.remainingMilestones?.length) return []
    const deposit = item.depositPriceInCents ?? item.priceInCents
    return [
      `${item.contractTitle}:`,
      `  Deposit (on signing):  ${fmt(deposit)}`,
      ...item.remainingMilestones.map((m) => `  ${m.label}: ${fmt(m.amountInCents)}`),
    ]
  }).join('\n')

  return `WEB DEVELOPMENT SERVICES AGREEMENT
(Fixed-Price Project + Optional Monthly Plan)

This Web Development Services Agreement ("Agreement") is entered into on ${date}
by and between:

Provider: ${ctx.providerName}, located at ${ctx.providerAddress} ("Provider")
Client:   ${ctx.customerName} / ${ctx.customerBusiness} ("Client")
Email:    ${ctx.customerEmail}
Phone:    ${ctx.customerPhone || 'N/A'}

════════════════════════════════════════════════════════════════

1. SCOPE OF WORK
1.1 Provider will deliver the website/services described in Exhibit A ("Scope").
1.2 Anything not explicitly listed in Exhibit A is out of scope.
1.3 Items listed under "Explicitly out of scope" in Exhibit A require a separate
    written Change Request and are subject to additional fees.

2. TIMELINE & CLIENT RESPONSIBILITIES
2.1 Estimated start: TBD (within 5 business days of signing).
    Estimated delivery: ${deliveryTimeline}, subject to Client providing content,
    approvals, and access in a timely manner.
2.2 Delays caused by Client extend the schedule accordingly.

3. PRICING, INVOICING & PAYMENTS
3.1 Total project fee: ${fmt(oneTimeTotal)} (USD) + applicable taxes/fees (if any).
    Monthly plan fees, if any, are separate and are covered by Section 9.
3.2 Deposit due on signing: ${fmt(depositTotal)} (non-refundable; reserves schedule).
    This is the amount charged at checkout. It covers one-time work only and
    never includes a monthly plan.
3.3 Payment schedule per package (see Exhibit A for exact milestones):
${milestonesSection || '    As described in Exhibit A.'}
3.4 Payments will be made via Stripe (card/ACH where available).
3.5 Provider may pause work if any invoice is overdue by more than 7 days.

4. CHANGE REQUESTS (OUT-OF-SCOPE WORK)
4.1 Any change not included in Exhibit A requires a written Change Request.
4.2 Provider will provide updated pricing/timeline. Work begins only after Client's
    written approval and any required deposit.
4.3 Rush delivery may incur a rush rate: ${ctx.hourlyRate}/hour or a fixed fee agreed in writing.

5. REVISIONS & ACCEPTANCE
5.1 Included revisions: ${revisionRounds} as described in Exhibit A.
5.2 Client has 7 calendar days after each milestone delivery to accept or report
    specific defects in writing.
5.3 If Client does not respond within the review period, the milestone is deemed accepted.

6. INTELLECTUAL PROPERTY & LICENSES
6.1 Upon full payment, Client receives rights to the final deliverables, excluding:
    (a) third-party tools, templates, plugins, libraries (subject to their licenses),
    (b) Provider's pre-existing code, frameworks, and reusable components.
6.2 Provider retains the right to reuse generic components and know-how.

7. CLIENT CONTENT
7.1 Client represents it owns or has the right to use all text, images, logos, and
    other materials supplied to Provider.
7.2 Client is responsible for any claims arising from Client-supplied content.

8. THIRD-PARTY SERVICES
8.1 Third-party services (hosting, domain, email tools, booking systems, etc.) are
    billed to Client or paid directly by Client.
8.2 Provider is not responsible for downtime caused by third-party services.

9. MONTHLY PLAN (OPTIONAL)
${monthlyPlanClause}

10. CONFIDENTIALITY
Both parties agree to keep non-public information confidential and use it only to
perform this Agreement.

11. LIMITATION OF LIABILITY
Provider's total liability is limited to the total fees paid by Client under this
Agreement in the last 3 months. Provider is not liable for indirect, incidental,
or consequential damages.

12. TERMINATION
12.1 Client may terminate at any time. Client will pay for completed/accepted
     milestones and work in progress at ${ctx.hourlyRate}/hour. The initial deposit
     remains non-refundable.
12.2 Provider may terminate if Client materially breaches this Agreement and fails
     to cure within 7 days after written notice.
12.3 Termination of the project does not by itself cancel a monthly plan; a plan is
     cancelled under Section 9.4.

13. PORTFOLIO RIGHTS
Provider may display the completed work in its portfolio after launch, unless
Client requests confidentiality in writing.

14. ELECTRONIC SIGNATURES
This Agreement may be executed electronically. Electronic and typed signatures are
legally binding under the US ESIGN Act (15 U.S.C. § 7001) and applicable state law.

15. GOVERNING LAW & VENUE
This Agreement is governed by the laws of ${ctx.governingState}.
Any disputes shall be brought in the courts of ${ctx.governingCounty}.

════════════════════════════════════════════════════════════════

EXHIBIT A — SCOPE OF WORK

${scopeOfWork}
Total project price:  ${fmt(oneTimeTotal)}
Deposit due today:    ${fmt(depositTotal)}
Estimated delivery:   ${deliveryTimeline}
Revision rounds:      ${revisionRounds}

════════════════════════════════════════════════════════════════

EXHIBIT B — MONTHLY PLAN

${monthlyPlanExhibit}

════════════════════════════════════════════════════════════════

SIGNATURES

Provider: ${ctx.providerName}
(Counter-signed by Provider after document completion)

Client: ___________________________
Name/Title: ${ctx.customerName} / ${ctx.customerBusiness}
Date: ${date}`
}

export function buildDocumentName(businessName: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return `Web Development Agreement — ${businessName} (${date})`
}
