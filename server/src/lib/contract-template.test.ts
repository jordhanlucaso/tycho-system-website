import { describe, it, expect } from 'vitest'
import {
  computeContractTotals,
  renderContractText,
  buildDocumentName,
  type ContractContext,
  type ContractItem,
} from './contract-template.js'

/**
 * Contract template.
 *
 * The money assertions matter most: a monthly plan must never leak into the
 * deposit, because the deposit is both the figure the client signs and the
 * amount Stripe charges.
 */

const website: ContractItem = {
  id: 'starter-website',
  sku: 'TYS-START',
  name: 'Starter Site',
  contractTitle: 'Starter Site Package',
  invoiceLabel: 'Starter Site Package — Deposit',
  priceInCents: 199000,
  depositPriceInCents: 99000,
  remainingMilestones: [{ label: 'On delivery', amountInCents: 100000 }],
  recurring: false,
  delivery: '3 weeks',
  revisions: '2 rounds',
  features: ['5 pages', 'Contact form'],
  outOfScope: ['Custom illustration'],
}

const carePlan: ContractItem = {
  id: 'care-plan',
  sku: 'TYS-CARE',
  name: 'Care',
  contractTitle: 'Care Plan',
  invoiceLabel: 'Care Plan',
  priceInCents: 14900,
  // Deliberately no depositPriceInCents — deposits are one-time only.
  recurring: true,
  features: ['Monitoring', 'Monthly report'],
}

function makeCtx(items: ContractItem[]): ContractContext {
  return {
    customerName: 'Ada Lovelace',
    customerEmail: 'ada@example.com',
    customerBusiness: 'Analytical Engines Ltd',
    items,
    providerName: 'Tycho Systems',
    providerAddress: 'Test Address',
    governingState: 'Texas',
    governingCounty: 'Travis County, Texas',
    hourlyRate: '$150',
  }
}

describe('computeContractTotals', () => {
  it('excludes monthly plans from the project fee and the deposit', () => {
    expect(computeContractTotals([website, carePlan])).toEqual({
      oneTimeTotal: 199000,
      depositTotal: 99000,
      monthlyTotal: 14900,
    })
  })

  it('never lets a deposit exceed the project fee', () => {
    const { oneTimeTotal, depositTotal } = computeContractTotals([website, carePlan])
    expect(depositTotal).toBeLessThanOrEqual(oneTimeTotal)
  })

  it('falls back to the full price when a one-time item has no deposit', () => {
    const noDeposit: ContractItem = { ...website, depositPriceInCents: undefined }
    expect(computeContractTotals([noDeposit]).depositTotal).toBe(199000)
  })

  it('charges nothing up front for a plan-only contract', () => {
    expect(computeContractTotals([carePlan])).toEqual({
      oneTimeTotal: 0,
      depositTotal: 0,
      monthlyTotal: 14900,
    })
  })

  it('sums multiple plans into the monthly total', () => {
    const second: ContractItem = { ...carePlan, id: 'growth-plan', priceInCents: 29900 }
    expect(computeContractTotals([carePlan, second]).monthlyTotal).toBe(44800)
  })

  it('is empty for an empty cart', () => {
    expect(computeContractTotals([])).toEqual({
      oneTimeTotal: 0,
      depositTotal: 0,
      monthlyTotal: 0,
    })
  })
})

describe('rendered agreement — money', () => {
  it('quotes the deposit without the monthly plan folded in', () => {
    const text = renderContractText(makeCtx([website, carePlan]))

    expect(text).toContain('3.1 Total project fee: $1,990')
    expect(text).toContain('3.2 Deposit due on signing: $990')
    // The regression this guards: $990 + $149 = $1,139.
    expect(text).not.toContain('$1,139')
  })

  it('states the deposit covers one-time work only', () => {
    const text = renderContractText(makeCtx([website, carePlan]))
    expect(text).toContain('never includes a monthly plan')
  })
})

describe('rendered agreement — Section 9 and Exhibit B', () => {
  it('describes the selected plan, its price and how to cancel', () => {
    const text = renderContractText(makeCtx([website, carePlan]))

    expect(text).toContain('9. MONTHLY PLAN (OPTIONAL)')
    expect(text).toContain('Monthly plan selected: Care Plan')
    expect(text).toContain('$149 per month')
    expect(text).toContain('billed via Stripe auto-pay')
    expect(text).toContain("30 days' written notice")
    expect(text).toContain(`Out-of-plan work is billed at $150/hour`)
  })

  it('says so explicitly when no plan was selected', () => {
    const text = renderContractText(makeCtx([website]))

    expect(text).toContain('9. MONTHLY PLAN (OPTIONAL)')
    expect(text).toContain('No monthly plan is included in this Agreement')
    expect(text).not.toContain('billed via Stripe auto-pay')
  })

  it('lists the plan in Exhibit B, not in the Exhibit A scope of work', () => {
    const text = renderContractText(makeCtx([website, carePlan]))
    const exhibitA = text.slice(text.indexOf('EXHIBIT A'), text.indexOf('EXHIBIT B'))
    const exhibitB = text.slice(text.indexOf('EXHIBIT B'))

    expect(exhibitA).toContain('Starter Site Package')
    expect(exhibitA).not.toContain('Care Plan')

    expect(exhibitB).toContain('Care Plan')
    expect(exhibitB).toContain('Monthly price:    $149 per month')
    expect(exhibitB).toContain('Monitoring')
    // A monthly plan has no deposit, so Exhibit B must not imply one.
    expect(exhibitB).not.toContain('Deposit due now')
  })

  it('renders Exhibit B even with no plan, so numbering never shifts', () => {
    const withPlan = renderContractText(makeCtx([website, carePlan]))
    const without = renderContractText(makeCtx([website]))

    for (const text of [withPlan, without]) {
      expect(text).toContain('EXHIBIT A — SCOPE OF WORK')
      expect(text).toContain('EXHIBIT B — MONTHLY PLAN')
      expect(text).toContain('10. CONFIDENTIALITY')
      expect(text).toContain('15. GOVERNING LAW & VENUE')
    }
    expect(without).toContain('No monthly plan is included')
  })

  it('keeps every section number unique and in order', () => {
    const text = renderContractText(makeCtx([website, carePlan]))
    const numbers = [...text.matchAll(/^(\d{1,2})\. [A-Z]/gm)].map((m) => Number(m[1]))

    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  })

  it('points termination at the plan cancellation clause', () => {
    const text = renderContractText(makeCtx([website, carePlan]))
    expect(text).toContain('a plan is\n     cancelled under Section 9.4')
  })
})

describe('rendered agreement — structure', () => {
  it('is titled for both a project and an optional plan', () => {
    expect(renderContractText(makeCtx([website]))).toContain(
      '(Fixed-Price Project + Optional Monthly Plan)'
    )
  })

  it('handles a plan-only contract without claiming project work', () => {
    const text = renderContractText(makeCtx([carePlan]))

    expect(text).toContain('No one-time project work is included in this Agreement')
    expect(text).toContain('3.2 Deposit due on signing: $0')
    expect(text).toContain('Monthly plan selected: Care Plan')
  })

  it('carries the parties and the scope through', () => {
    const text = renderContractText(makeCtx([website]))

    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('Analytical Engines Ltd')
    expect(text).toContain('5 pages')
    expect(text).toContain('Custom illustration')
    expect(text).toContain('On delivery: $1,000')
  })
})

describe('buildDocumentName', () => {
  it('includes the business name and an ISO date', () => {
    expect(buildDocumentName('Analytical Engines Ltd')).toMatch(
      /^Web Development Agreement — Analytical Engines Ltd \(\d{4}-\d{2}-\d{2}\)$/
    )
  })
})
