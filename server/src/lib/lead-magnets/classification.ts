import type { AudienceSegment, ResourceSlug, RoleCategory } from './types.js'
import { RESOURCES } from './types.js'

export type ClassificationInput = {
  requestedResource: ResourceSlug
  roleCategory: RoleCategory
  companyName?: string
  teamSize?: string
  primaryBusinessPain?: string
  /** Explicit "I manage a team, process, budget, technology or operations". */
  businessResponsibility?: boolean
}

export type ClassificationResult = {
  audienceSegment: AudienceSegment
  classificationReason: string
  deliveredResource: ResourceSlug
}

const LEADER_ROLES: readonly RoleCategory[] = [
  'ceo_founder',
  'cto_technical_leader',
  'coo_operations_leader',
  'head_director_manager',
]

/**
 * Signals that a real company or business problem exists. A named company, a
 * concrete operational pain, a team beyond one person, or an explicit
 * statement of business responsibility all count; "not sure" answers do not.
 */
function hasBusinessEvidence(input: ClassificationInput): boolean {
  if (input.businessResponsibility === true) return true
  if (input.companyName && input.companyName.trim().length > 1) return true
  if (input.primaryBusinessPain && input.primaryBusinessPain !== 'not_sure') return true
  if (input.teamSize && input.teamSize !== 'just_me') return true
  return false
}

/**
 * Deterministic audience classification. The form answers are authoritative —
 * never the landing page the visitor happened to open. The delivered resource
 * always follows the final segment, so a CEO who opened the dictionary form
 * still receives the Pain Map, and a student who opened the business form
 * receives the Dictionary.
 */
export function classifyAudience(input: ClassificationInput): ClassificationResult {
  const evidence = hasBusinessEvidence(input)
  const isLeaderRole = LEADER_ROLES.includes(input.roleCategory)

  let audienceSegment: AudienceSegment
  let reason: string

  if (isLeaderRole && evidence) {
    audienceSegment = 'business_leader'
    reason = `leadership_role_with_business_evidence:${input.roleCategory}`
  } else if (isLeaderRole && !evidence) {
    audienceSegment = 'ai_builder_learner'
    reason = `leadership_role_without_business_evidence:${input.roleCategory}`
  } else if (
    input.roleCategory === 'freelancer_consultant' &&
    input.businessResponsibility === true
  ) {
    audienceSegment = 'business_leader'
    reason = 'freelancer_with_explicit_business_responsibility'
  } else if (
    input.roleCategory === 'freelancer_consultant' &&
    Boolean(input.companyName?.trim()) &&
    Boolean(input.primaryBusinessPain) &&
    input.primaryBusinessPain !== 'not_sure'
  ) {
    audienceSegment = 'business_leader'
    reason = 'freelancer_managing_real_client_operation'
  } else if (input.businessResponsibility === true && evidence) {
    // Any role that explicitly manages a team, process, budget, technology or
    // operations — with supporting evidence — is treated as a business leader.
    audienceSegment = 'business_leader'
    reason = `explicit_business_responsibility:${input.roleCategory}`
  } else {
    audienceSegment = 'ai_builder_learner'
    reason = `learner_role_or_no_company_level_problem:${input.roleCategory}`
  }

  const deliveredResource: ResourceSlug =
    audienceSegment === 'business_leader' ? 'ai_operations_pain_map' : 'ai_dictionary'

  if (deliveredResource !== input.requestedResource) {
    reason += `;cross_delivered_from:${input.requestedResource}`
  }

  return { audienceSegment, classificationReason: reason, deliveredResource }
}

export function resourceFor(slug: ResourceSlug) {
  return RESOURCES[slug]
}
