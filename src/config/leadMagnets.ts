/**
 * Lead-magnet funnel configuration: the two audience resources, their landing
 * pages, the two-step form definitions, and the consent copy. All funnel copy
 * lives here so the pages and forms render from one typed source of truth.
 *
 * The server owns the authoritative classification logic
 * (server/src/lib/lead-magnets/); the types here mirror its public contract.
 */

export type AudienceSegment = 'business_leader' | 'ai_builder_learner'

export type ResourceSlug = 'ai_operations_pain_map' | 'ai_dictionary'

export type RoleCategory =
  | 'ceo_founder'
  | 'cto_technical_leader'
  | 'coo_operations_leader'
  | 'head_director_manager'
  | 'individual_contributor'
  | 'developer'
  | 'freelancer_consultant'
  | 'student_job_seeker'
  | 'other'

export type SelectOption = { value: string; label: string }

/** Version string recorded with every consent decision. Bump when the consent copy changes. */
export const CONSENT_TEXT_VERSION = '2026-07-lead-magnet-v1'

export const consentCopy = {
  deliveryNotice:
    'We will use your email address to deliver the resource you requested and record the request.',
  marketingLabel:
    'I would also like to receive practical emails from Tycho Systems about AI, automation, websites and business systems. I can unsubscribe at any time.',
  privacyPolicyPath: '/privacy',
} as const

export type LeadMagnetResource = {
  slug: ResourceSlug
  /** Public route of the landing page. */
  path: string
  /** Route of the thank-you page shown after this resource is delivered. */
  thankYouPath: string
  /** Static download path under public/. */
  downloadPath: string
  fileName: string
  title: string
  audienceSegment: AudienceSegment
  card: {
    label: string
    description: string
    cta: string
  }
  page: {
    eyebrow: string
    heading: string
    supporting: string
    trust: string
    submitCta: string
    metaTitle: string
    metaDescription: string
  }
}

export const leadMagnets: Record<ResourceSlug, LeadMagnetResource> = {
  ai_operations_pain_map: {
    slug: 'ai_operations_pain_map',
    path: '/resources/ai-operations-pain-map',
    thankYouPath: '/thank-you/business-leader',
    downloadPath: '/downloads/tycho-ai-operations-pain-map.pdf',
    fileName: 'tycho-ai-operations-pain-map.pdf',
    title: 'The AI Operations Pain Map',
    audienceSegment: 'business_leader',
    card: {
      label: 'For CEOs, CTOs, COOs, founders and operations leaders',
      description:
        'A practical guide to the workflow problems most likely to waste time, delay customers, hide information and create avoidable operational risk.',
      cta: 'Get the Pain Map',
    },
    page: {
      eyebrow: 'FREE OPERATIONS GUIDE',
      heading:
        'Find the workflow problems most likely to cost your business time, leads and visibility.',
      supporting:
        'The AI Operations Pain Map explains the most common operational bottlenecks faced by growing small businesses and the practical systems that can address them.',
      trust:
        'No AI hype. No promise to replace your team. Just practical process and system recommendations.',
      submitCta: 'Send me the Pain Map',
      metaTitle: 'The AI Operations Pain Map — Free Guide | Tycho Systems',
      metaDescription:
        'A free guide to the operational bottlenecks that cost growing small businesses time, leads and visibility — and the practical systems that address them.',
    },
  },
  ai_dictionary: {
    slug: 'ai_dictionary',
    path: '/resources/ai-dictionary',
    thankYouPath: '/thank-you/ai-dictionary',
    downloadPath: '/downloads/tycho-practical-ai-dictionary.pdf',
    fileName: 'tycho-practical-ai-dictionary.pdf',
    title: 'The Practical AI Dictionary',
    audienceSegment: 'ai_builder_learner',
    card: {
      label: 'For developers, freelancers, employees, students and AI learners',
      description:
        'Clear definitions, examples and practical context for the AI, automation and agent terms you keep encountering.',
      cta: 'Get the AI Dictionary',
    },
    page: {
      eyebrow: 'FREE PRACTICAL GUIDE',
      heading: 'Understand the AI terms everyone keeps using.',
      supporting:
        'The Practical AI Dictionary explains modern AI, automation and agent terminology in clear language with examples of where each concept matters.',
      trust:
        'Written for people who want practical understanding without an academic or hype-heavy explanation.',
      submitCta: 'Send me the AI Dictionary',
      metaTitle: 'The Practical AI Dictionary — Free Guide | Tycho Systems',
      metaDescription:
        'Free plain-language definitions and practical examples for the AI, automation and agent terminology you keep encountering.',
    },
  },
}

export const resourceSelector = {
  heading: 'Choose the guide that fits your role.',
  supporting:
    'Business leaders need a map of operational risks and opportunities. People learning and working with AI need a shared vocabulary. Choose the resource that is most useful to you.',
  audienceChoices: [
    {
      slug: 'ai_operations_pain_map' as ResourceSlug,
      statement: 'I lead a business or team.',
    },
    {
      slug: 'ai_dictionary' as ResourceSlug,
      statement: 'I want to understand and use AI.',
    },
  ],
} as const

/* ── Form field options ──
   Values are the canonical machine values sent to the API; labels are the
   public copy. The server validates against the same value sets. */

export const businessRoleOptions: Array<SelectOption & { value: RoleCategory }> = [
  { value: 'ceo_founder', label: 'CEO or founder' },
  { value: 'cto_technical_leader', label: 'CTO or technical leader' },
  { value: 'coo_operations_leader', label: 'COO or operations leader' },
  { value: 'head_director_manager', label: 'Head, director or manager' },
  { value: 'developer', label: 'Developer or technical individual contributor' },
  { value: 'freelancer_consultant', label: 'Freelancer or consultant' },
  { value: 'student_job_seeker', label: 'Student or job seeker' },
  { value: 'other', label: 'Other' },
]

/* The dictionary form shows more granular roles than the canonical categories
   (students and job seekers share a category; educators map to "other"), so
   its options carry their own display values plus the canonical mapping. */
export type DictionaryRoleValue =
  | 'developer_engineer'
  | 'freelancer_consultant'
  | 'individual_contributor'
  | 'business_owner_founder'
  | 'manager_team_leader'
  | 'student'
  | 'job_seeker'
  | 'educator'
  | 'other'

export const dictionaryRoleOptions: Array<
  SelectOption & { value: DictionaryRoleValue; roleCategory: RoleCategory }
> = [
  { value: 'developer_engineer', label: 'Developer or engineer', roleCategory: 'developer' },
  { value: 'freelancer_consultant', label: 'Freelancer or consultant', roleCategory: 'freelancer_consultant' },
  { value: 'individual_contributor', label: 'Individual contributor', roleCategory: 'individual_contributor' },
  { value: 'business_owner_founder', label: 'Business owner or founder', roleCategory: 'ceo_founder' },
  { value: 'manager_team_leader', label: 'Manager or team leader', roleCategory: 'head_director_manager' },
  { value: 'student', label: 'Student', roleCategory: 'student_job_seeker' },
  { value: 'job_seeker', label: 'Job seeker', roleCategory: 'student_job_seeker' },
  { value: 'educator', label: 'Educator', roleCategory: 'other' },
  { value: 'other', label: 'Other', roleCategory: 'other' },
]

export const teamSizeOptions: SelectOption[] = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_5', label: '2–5' },
  { value: '6_10', label: '6–10' },
  { value: '11_25', label: '11–25' },
  { value: '26_50', label: '26–50' },
  { value: '51_100', label: '51–100' },
  { value: 'more_than_100', label: 'More than 100' },
]

export const businessPainOptions: SelectOption[] = [
  { value: 'slow_lead_response', label: 'Slow lead or customer response' },
  { value: 'repetitive_admin', label: 'Repetitive administration' },
  { value: 'manual_data_entry', label: 'Manual data entry or document processing' },
  { value: 'disconnected_tools', label: 'Disconnected tools' },
  { value: 'manual_reporting', label: 'Manual reporting' },
  { value: 'missed_follow_ups', label: 'Missed follow-ups' },
  { value: 'support_overload', label: 'Customer-support overload' },
  { value: 'poor_visibility', label: 'Poor operational visibility' },
  { value: 'knowledge_hard_to_find', label: 'Internal knowledge is difficult to find' },
  { value: 'not_sure', label: 'Not sure yet' },
]

export const hoursLostOptions: SelectOption[] = [
  { value: 'under_2', label: 'Less than 2 hours' },
  { value: '2_5', label: '2–5 hours' },
  { value: '5_10', label: '5–10 hours' },
  { value: '10_20', label: '10–20 hours' },
  { value: 'over_20', label: 'More than 20 hours' },
  { value: 'not_sure', label: 'Not sure' },
]

export const aiExperienceOptions: SelectOption[] = [
  { value: 'completely_new', label: 'Completely new' },
  { value: 'chat_user', label: 'I use ChatGPT or Claude' },
  { value: 'simple_automations', label: 'I have built simple automations' },
  { value: 'technical_builder', label: 'I build technical AI systems' },
  { value: 'not_sure', label: 'I am not sure' },
]

export const primaryInterestOptions: SelectOption[] = [
  { value: 'ai_at_work', label: 'Using AI at work' },
  { value: 'ai_automation', label: 'AI automation' },
  { value: 'ai_agents', label: 'AI agents' },
  { value: 'prompting', label: 'Prompting' },
  { value: 'ai_development', label: 'AI development' },
  { value: 'ai_for_business', label: 'AI for business' },
  { value: 'content_creation', label: 'Content creation' },
  { value: 'career_development', label: 'Career development' },
  { value: 'general_understanding', label: 'General understanding' },
]

export const currentGoalOptions: SelectOption[] = [
  { value: 'understand_terminology', label: 'Understand AI terminology' },
  { value: 'improve_current_work', label: 'Improve my current work' },
  { value: 'build_automations', label: 'Build automations' },
  { value: 'learn_technical_implementation', label: 'Learn technical implementation' },
  { value: 'offer_ai_services', label: 'Start offering AI services' },
  { value: 'evaluate_for_business', label: 'Evaluate AI for my business' },
  { value: 'explore_the_field', label: 'Explore the field' },
]

export function getLeadMagnetByPath(path: string): LeadMagnetResource | undefined {
  return Object.values(leadMagnets).find((r) => r.path === path)
}

export function labelFor(options: SelectOption[], value: string | undefined): string | undefined {
  return options.find((o) => o.value === value)?.label
}
