export type SiteConfig = {
  agencyName: string
  tagline: string
  description: string
  email: string
  location: string
  siteUrl: string
  ctas: { primary: string; secondary: string }
  formEndpoint: string
}

export const site: SiteConfig = {
  agencyName: 'Tycho Systems',
  tagline:
    'AI-assisted workflows, websites, integrations and internal tools for small businesses.',
  description:
    'Tycho Systems builds AI-assisted workflows, websites, integrations and internal tools that help small businesses reduce manual administration and operate more effectively.',
  email: 'felix@tychosystem.com',
  location: 'Remote (US clients welcome)',
  siteUrl: 'https://tychosystem.com',
  ctas: { primary: 'Get the AI Operations Pain Map', secondary: 'Explore our services' },
  formEndpoint: '',
}

/** Homepage hero copy (Web Observatory identity, systems positioning). */
export const hero = {
  eyebrow: 'AI AUTOMATION • WEBSITES • BUSINESS SYSTEMS',
  headline: 'Turn repetitive work into reliable systems.',
  supporting:
    'Tycho Systems designs and builds AI-assisted workflows, websites, integrations and internal tools for small businesses that want faster response times, less manual administration and clearer operations.',
  primaryCta: { label: 'Get the AI Operations Pain Map', href: '/resources/ai-operations-pain-map' },
  secondaryCta: { label: 'Explore our services', href: '#services' },
  trustLine:
    'Practical systems. Human review where it matters. Built around the tools you already use.',
} as const

/** Six-step delivery process. */
export const processSteps = [
  {
    index: '01',
    title: 'Diagnose',
    description: 'Understand the process, people, tools, volume and business impact.',
  },
  {
    index: '02',
    title: 'Prioritise',
    description: 'Choose the workflow with the clearest value and acceptable risk.',
  },
  {
    index: '03',
    title: 'Design',
    description:
      'Define the data flow, integrations, approvals, failure paths and success criteria.',
  },
  {
    index: '04',
    title: 'Build',
    description:
      'Implement the workflow using the most appropriate existing tools and custom code.',
  },
  {
    index: '05',
    title: 'Test and launch',
    description:
      'Test normal cases, edge cases and failures before controlled production release.',
  },
  {
    index: '06',
    title: 'Monitor and improve',
    description:
      'Measure performance, fix problems and improve the system as the business changes.',
  },
] as const

/** Ongoing maintenance offer — presented as its own section, not a fifth service. */
export const automationCare = {
  heading: 'Systems need ownership after launch.',
  supporting:
    'Tycho Systems can monitor workflow health, resolve failures, update integrations, review AI output quality and improve the system as your business changes.',
  includes: [
    'Workflow monitoring',
    'Failure alerts',
    'Integration maintenance',
    'Prompt and model updates',
    'Security and access reviews',
    'Monthly performance report',
    'Small monthly improvements',
    'Documented support boundaries',
  ],
  cta: 'Ask about Automation Care',
} as const
