export type ContractItem = {
  name: string
  priceInCents: number
  recurring: boolean
  delivery?: string
  revisions?: string
  features?: string[]
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
  const oneTime = items.filter((i) => !i.recurring)
  const recurring = items.filter((i) => i.recurring)
  const lines: string[] = []

  if (oneTime.length > 0) {
    lines.push('ONE-TIME DELIVERABLES')
    lines.push('─'.repeat(40))
    for (const item of oneTime) {
      lines.push('')
      lines.push(`${item.name} — ${fmt(item.priceInCents)}`)
      if (item.description) lines.push(item.description)
      const meta: string[] = []
      if (item.delivery)  meta.push(`Delivery: ${item.delivery}`)
      if (item.revisions) meta.push(`Revisions: ${item.revisions}`)
      if (meta.length) lines.push(meta.join(' | '))
      if (item.features?.length) {
        lines.push('Includes:')
        item.features.forEach((f) => lines.push(`  • ${f}`))
      }
    }
  }

  if (recurring.length > 0) {
    if (lines.length) lines.push('')
    lines.push('ONGOING SERVICES (Monthly)')
    lines.push('─'.repeat(40))
    for (const item of recurring) {
      lines.push('')
      lines.push(`${item.name} — ${fmt(item.priceInCents)}/mo`)
      if (item.description) lines.push(item.description)
      if (item.features?.length) {
        lines.push('Includes:')
        item.features.forEach((f) => lines.push(`  • ${f}`))
      }
    }
  }

  return lines.join('\n')
}

/** Returns the full rendered contract as a plain-text string with all values substituted. */
export function renderContractText(ctx: ContractContext): string {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const oneTimeItems = ctx.items.filter((i) => !i.recurring)
  const recurringItems = ctx.items.filter((i) => i.recurring)
  const oneTimeTotal = oneTimeItems.reduce((s, i) => s + i.priceInCents, 0)
  const recurringTotal = recurringItems.reduce((s, i) => s + i.priceInCents, 0)

  const deliveryTimeline = oneTimeItems[0]?.delivery ?? 'To be agreed'
  const revisionRounds = oneTimeItems[0]?.revisions ?? 'As per package'
  const monthlyPlan = recurringItems.length
    ? recurringItems.map((i) => `${i.name} — ${fmt(i.priceInCents)}/mo`).join(', ')
    : 'N/A (no monthly plan selected)'
  const monthlyAmount = recurringTotal > 0 ? fmt(recurringTotal) : 'N/A'
  const scopeOfWork = buildScopeOfWork(ctx.items)

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

2. TIMELINE & CLIENT RESPONSIBILITIES
2.1 Estimated start: TBD (within 5 business days of signing).
    Estimated delivery: ${deliveryTimeline}, subject to Client providing content,
    approvals, and access in a timely manner.
2.2 Delays caused by Client extend the schedule accordingly.

3. PRICING, INVOICING & PAYMENTS
3.1 Project fee: ${fmt(oneTimeTotal)} (USD) + applicable taxes/fees (if any).
3.2 Payment schedule:
    - 40% due upon signing (reserves schedule; non-refundable),
    - 40% due upon delivery of Milestone 1,
    - 20% due prior to final handoff / go-live.
3.3 Payments will be made via Stripe (card/ACH where available).
3.4 Provider may pause work if any invoice is overdue by more than 7 days.

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
9.1 Monthly plan selected: ${monthlyPlan}.
9.2 Monthly plan price: ${monthlyAmount}/month (billed via Stripe auto-pay).
9.3 Out-of-plan work is billed at ${ctx.hourlyRate}/hour.
9.4 Client may cancel with 30 days' notice. Non-payment may result in suspension.

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

One-time project fee:   ${fmt(oneTimeTotal)}
Monthly plan (if any):  ${monthlyPlan} — ${monthlyAmount}/mo
Estimated delivery:     ${deliveryTimeline}
Revision rounds:        ${revisionRounds}

════════════════════════════════════════════════════════════════

EXHIBIT B — MILESTONES & TIMELINE

To be defined in the project kick-off document delivered within 5 business days of signing.

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
