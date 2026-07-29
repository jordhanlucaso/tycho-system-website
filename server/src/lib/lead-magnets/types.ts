/**
 * Canonical lead-magnet funnel types. The server is the authority for these
 * values; src/config/leadMagnets.ts on the frontend mirrors them.
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

export const ROLE_CATEGORIES: readonly RoleCategory[] = [
  'ceo_founder',
  'cto_technical_leader',
  'coo_operations_leader',
  'head_director_manager',
  'individual_contributor',
  'developer',
  'freelancer_consultant',
  'student_job_seeker',
  'other',
]

export const RESOURCE_SLUGS: readonly ResourceSlug[] = ['ai_operations_pain_map', 'ai_dictionary']

export const TEAM_SIZES = ['just_me', '2_5', '6_10', '11_25', '26_50', '51_100', 'more_than_100'] as const

export const BUSINESS_PAINS = [
  'slow_lead_response',
  'repetitive_admin',
  'manual_data_entry',
  'disconnected_tools',
  'manual_reporting',
  'missed_follow_ups',
  'support_overload',
  'poor_visibility',
  'knowledge_hard_to_find',
  'not_sure',
] as const

export const HOURS_LOST = ['under_2', '2_5', '5_10', '10_20', 'over_20', 'not_sure'] as const

export const AI_EXPERIENCES = [
  'completely_new',
  'chat_user',
  'simple_automations',
  'technical_builder',
  'not_sure',
] as const

export const PRIMARY_INTERESTS = [
  'ai_at_work',
  'ai_automation',
  'ai_agents',
  'prompting',
  'ai_development',
  'ai_for_business',
  'content_creation',
  'career_development',
  'general_understanding',
] as const

export const CURRENT_GOALS = [
  'understand_terminology',
  'improve_current_work',
  'build_automations',
  'learn_technical_implementation',
  'offer_ai_services',
  'evaluate_for_business',
  'explore_the_field',
] as const

export type SourceAttribution = {
  platform?: string
  campaign?: string
  contentId?: string
  referrer?: string
  landingPath?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

export type LeadMagnetSubscriptionRequest = {
  firstName: string
  lastName?: string
  email: string
  companyName?: string

  roleCategory: RoleCategory

  teamSize?: string
  primaryBusinessPain?: string
  hoursLostPerWeek?: string
  existingTools?: string

  aiExperience?: string
  primaryInterest?: string
  currentGoal?: string

  requestedResource: ResourceSlug
  marketingConsent: boolean
  consentTextVersion: string

  /** Honeypot — real users never fill it. */
  website?: string

  source?: SourceAttribution
}

export type ResourceDefinition = {
  slug: ResourceSlug
  title: string
  fileName: string
  downloadPath: string
  thankYouPath: string
  audienceSegment: AudienceSegment
}

export const RESOURCES: Record<ResourceSlug, ResourceDefinition> = {
  ai_operations_pain_map: {
    slug: 'ai_operations_pain_map',
    title: 'The AI Operations Pain Map',
    fileName: 'tycho-ai-operations-pain-map.pdf',
    downloadPath: '/downloads/tycho-ai-operations-pain-map.pdf',
    thankYouPath: '/thank-you/business-leader',
    audienceSegment: 'business_leader',
  },
  ai_dictionary: {
    slug: 'ai_dictionary',
    title: 'The Practical AI Dictionary',
    fileName: 'tycho-practical-ai-dictionary.pdf',
    downloadPath: '/downloads/tycho-practical-ai-dictionary.pdf',
    thankYouPath: '/thank-you/ai-dictionary',
    audienceSegment: 'ai_builder_learner',
  },
}

export type LeadMagnetSubscriptionResponse = {
  ok: true
  audienceSegment: AudienceSegment
  deliveredResource: {
    slug: ResourceSlug
    title: string
    downloadUrl: string
  }
  marketingEnrolled: boolean
  redirectUrl: string
  warnings?: string[]
}
