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

function buildScopeOfWork(items: ContractItem[]): string {
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

/** Returns the full rendered contract as a plain-text string with all values substituted. */
export function renderContractText(ctx: ContractContext): string {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const oneTimeItems = ctx.items.filter((i) => !i.recurring)
  const oneTimeTotal = oneTimeItems.reduce((s, i) => s + i.priceInCents, 0)
  const depositTotal = ctx.items.reduce((s, i) => s + (i.depositPriceInCents ?? i.priceInCents), 0)

  const deliveryTimeline = oneTimeItems[0]?.delivery ?? 'To be agreed'
  const revisionRounds = oneTimeItems[0]?.revisions ?? 'As per package'
  const scopeOfWork = buildScopeOfWork(ctx.items)

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
(Fixed-Price Project)

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
3.2 Deposit due on signing: ${fmt(depositTotal)} (non-refundable; reserves schedule).
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

9. CONFIDENTIALITY
Both parties agree to keep non-public information confidential and use it only to
perform this Agreement.

10. LIMITATION OF LIABILITY
Provider's total liability is limited to the total fees paid by Client under this
Agreement in the last 3 months. Provider is not liable for indirect, incidental,
or consequential damages.

11. TERMINATION
11.1 Client may terminate at any time. Client will pay for completed/accepted
     milestones and work in progress at ${ctx.hourlyRate}/hour. The initial deposit
     remains non-refundable.
11.2 Provider may terminate if Client materially breaches this Agreement and fails
     to cure within 7 days after written notice.

12. PORTFOLIO RIGHTS
Provider may display the completed work in its portfolio after launch, unless
Client requests confidentiality in writing.

13. ELECTRONIC SIGNATURES
This Agreement may be executed electronically. Electronic and typed signatures are
legally binding under the US ESIGN Act (15 U.S.C. § 7001) and applicable state law.

14. GOVERNING LAW & VENUE
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
