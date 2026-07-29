export type Service = {
  id: string
  title: string
  shortDesc: string
  longDesc: string
  /** Typical deliverables or examples shown under the description. */
  items: string[]
  cta: string
  /** Where the CTA points. */
  ctaHref: string
  icon: 'compass' | 'signal' | 'ledger' | 'orbit'
}

/**
 * The four primary Tycho Systems services. Rendered as exactly four cards on
 * the homepage; ongoing maintenance (Automation Care) is deliberately not a
 * fifth card — see src/config/site.ts `automationCare`.
 */
export const services: Service[] = [
  {
    id: 'workflow-audit',
    title: 'AI Workflow Audit and Roadmap',
    shortDesc:
      'Find the workflows worth automating before spending money building the wrong system.',
    longDesc:
      'We map the current process, identify bottlenecks, estimate the opportunity, review your tools and create a prioritised implementation roadmap.',
    items: [
      'Process map',
      'Workflow opportunity score',
      'Technical feasibility review',
      'Risk and approval requirements',
      'ROI or payback estimate',
      'Prioritised roadmap',
    ],
    cta: 'Request a workflow audit',
    ctaHref: '#contact',
    icon: 'compass',
  },
  {
    id: 'lead-response',
    title: 'Lead Response and Customer Operations',
    shortDesc:
      'Capture enquiries, route them correctly, prepare responses and make follow-up harder to forget.',
    longDesc:
      'We connect forms, inboxes, calendars, CRMs and communication tools so new enquiries reach the right person, receive a faster response and remain visible until the next action is complete.',
    items: [
      'Form-to-CRM workflows',
      'Lead routing',
      'Enquiry classification',
      'Reply drafting with human approval',
      'Appointment workflows',
      'Follow-up reminders',
      'Customer support triage',
      'Missed-lead recovery',
    ],
    cta: 'Improve lead response',
    ctaHref: '#contact',
    icon: 'signal',
  },
  {
    id: 'admin-automation',
    title: 'Admin, Data and Reporting Automation',
    shortDesc:
      'Replace repetitive copying, document processing and manual reporting with reliable workflows.',
    longDesc:
      'We automate the movement, validation and summarisation of information between documents, spreadsheets, databases, inboxes and business applications.',
    items: [
      'Document extraction',
      'PDF-to-database workflows',
      'Spreadsheet cleanup',
      'Data validation',
      'Recurring reports',
      'Exception alerts',
      'Invoice or quote processing',
      'Internal approval workflows',
      'Operations dashboards',
    ],
    cta: 'Reduce manual admin',
    ctaHref: '#contact',
    icon: 'ledger',
  },
  {
    id: 'websites-systems',
    title: 'Websites, CRM and Internal Systems',
    shortDesc: 'Build the customer-facing and internal systems your business actually needs.',
    longDesc:
      'We design websites, client portals, CRM integrations, dashboards and internal applications that connect your customer experience with the way your team works.',
    items: [
      'Conversion-focused websites',
      'Landing pages',
      'CRM implementation',
      'Custom dashboards',
      'Client portals',
      'Internal admin tools',
      'API integrations',
      'Lightweight business applications',
    ],
    cta: 'Plan a digital system',
    ctaHref: '#contact',
    icon: 'orbit',
  },
]
