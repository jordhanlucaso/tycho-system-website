import { describe, it, expect } from 'vitest'
import { classifyAudience } from './classification.js'

describe('classifyAudience', () => {
  it('classifies a CEO requesting the Pain Map as business_leader', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'ceo_founder',
      companyName: 'Acme Plumbing',
      teamSize: '6_10',
      primaryBusinessPain: 'slow_lead_response',
    })
    expect(result.audienceSegment).toBe('business_leader')
    expect(result.deliveredResource).toBe('ai_operations_pain_map')
  })

  it('cross-delivers the Pain Map to a CEO who requested the Dictionary', () => {
    const result = classifyAudience({
      requestedResource: 'ai_dictionary',
      roleCategory: 'ceo_founder',
      companyName: 'Acme Plumbing',
    })
    expect(result.audienceSegment).toBe('business_leader')
    expect(result.deliveredResource).toBe('ai_operations_pain_map')
    expect(result.classificationReason).toContain('cross_delivered_from:ai_dictionary')
  })

  it('classifies a CTO requesting the Dictionary as business_leader when a company exists', () => {
    const result = classifyAudience({
      requestedResource: 'ai_dictionary',
      roleCategory: 'cto_technical_leader',
      companyName: 'Northwind',
    })
    expect(result.audienceSegment).toBe('business_leader')
    expect(result.deliveredResource).toBe('ai_operations_pain_map')
  })

  it('classifies a COO requesting the Pain Map as business_leader', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'coo_operations_leader',
      teamSize: '26_50',
      primaryBusinessPain: 'manual_reporting',
    })
    expect(result.audienceSegment).toBe('business_leader')
  })

  it('classifies a manager with company and operational pain as business_leader', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'head_director_manager',
      companyName: 'Globex',
      primaryBusinessPain: 'missed_follow_ups',
    })
    expect(result.audienceSegment).toBe('business_leader')
    expect(result.classificationReason).toContain('leadership_role_with_business_evidence')
  })

  it('classifies a manager with no company context as ai_builder_learner', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'head_director_manager',
      teamSize: 'just_me',
      primaryBusinessPain: 'not_sure',
    })
    expect(result.audienceSegment).toBe('ai_builder_learner')
    expect(result.deliveredResource).toBe('ai_dictionary')
    expect(result.classificationReason).toContain('leadership_role_without_business_evidence')
  })

  it('classifies a developer requesting the Pain Map as ai_builder_learner (cross-delivery)', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'developer',
      companyName: 'BigCorp',
      primaryBusinessPain: 'repetitive_admin',
    })
    expect(result.audienceSegment).toBe('ai_builder_learner')
    expect(result.deliveredResource).toBe('ai_dictionary')
    expect(result.classificationReason).toContain('cross_delivered_from:ai_operations_pain_map')
  })

  it('classifies a student requesting the Pain Map as ai_builder_learner', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'student_job_seeker',
    })
    expect(result.audienceSegment).toBe('ai_builder_learner')
    expect(result.deliveredResource).toBe('ai_dictionary')
  })

  it('classifies a freelancer with no business problem as ai_builder_learner', () => {
    const result = classifyAudience({
      requestedResource: 'ai_dictionary',
      roleCategory: 'freelancer_consultant',
      primaryBusinessPain: 'not_sure',
      teamSize: 'just_me',
    })
    expect(result.audienceSegment).toBe('ai_builder_learner')
  })

  it('classifies a freelancer managing a real client operation as business_leader', () => {
    const result = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'freelancer_consultant',
      companyName: 'Freelance Ops Studio',
      primaryBusinessPain: 'disconnected_tools',
    })
    expect(result.audienceSegment).toBe('business_leader')
    expect(result.classificationReason).toContain('freelancer_managing_real_client_operation')
  })

  it('honours explicit business responsibility for a freelancer', () => {
    const result = classifyAudience({
      requestedResource: 'ai_dictionary',
      roleCategory: 'freelancer_consultant',
      businessResponsibility: true,
    })
    expect(result.audienceSegment).toBe('business_leader')
  })

  it('never classifies from the landing page alone', () => {
    // Same answers, different requested resources → same segment.
    const fromBusinessPage = classifyAudience({
      requestedResource: 'ai_operations_pain_map',
      roleCategory: 'individual_contributor',
    })
    const fromDictionaryPage = classifyAudience({
      requestedResource: 'ai_dictionary',
      roleCategory: 'individual_contributor',
    })
    expect(fromBusinessPage.audienceSegment).toBe(fromDictionaryPage.audienceSegment)
    expect(fromBusinessPage.deliveredResource).toBe(fromDictionaryPage.deliveredResource)
  })

  it('is deterministic for identical input', () => {
    const input = {
      requestedResource: 'ai_operations_pain_map' as const,
      roleCategory: 'ceo_founder' as const,
      companyName: 'Acme',
    }
    expect(classifyAudience(input)).toEqual(classifyAudience(input))
  })
})
