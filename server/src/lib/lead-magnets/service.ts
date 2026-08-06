import { createHash } from 'node:crypto'
import { classifyAudience } from './classification.js'
import { validateLeadMagnetRequest } from './validate.js'
import { buildDeliveryEmail } from './emails.js'
import { RESOURCES } from './types.js'
import type { LeadMagnetSubscriptionResponse } from './types.js'
import type { CrmClient } from '../hubspot.js'
import type { TransactionalEmailProvider } from '../email.js'
import type { MarketingSubscriptionStore } from '../marketing/subscriptions.js'

export type LeadMagnetRequestRecord = {
  email_hash: string
  crm_contact_id: string | null
  requested_resource: string
  delivered_resource: string
  audience_segment: string
  classification_reason: string
  role_category: string
  marketing_consent: boolean
  consent_text_version: string
  source_platform: string | null
  source_campaign: string | null
  source_content_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  crm_status: 'synced' | 'failed' | 'skipped'
  email_status: 'sent' | 'failed' | 'skipped'
}

export interface LeadMagnetStore {
  /** Idempotent upsert keyed on (email_hash, requested_resource). */
  upsertRequest(record: LeadMagnetRequestRecord): Promise<void>
}

export type Logger = (
  level: 'info' | 'warn' | 'error',
  message: string,
  meta?: Record<string, unknown>
) => void

export type LeadMagnetDeps = {
  crm: CrmClient | null
  email: TransactionalEmailProvider | null
  store: LeadMagnetStore | null
  /**
   * The application's own marketing suppression list. Kept in step with the
   * `tycho_marketing_consent` property written to HubSpot below, so the
   * final-boundary guard in sendMarketingEmail agrees with the CRM.
   */
  subscriptions?: MarketingSubscriptionStore | null
  /** Public site origin used to build absolute download URLs, no trailing slash. */
  siteUrl: string
  log: Logger
  now?: () => Date
}

export type ServiceResult =
  | { status: 200; body: LeadMagnetSubscriptionResponse }
  | { status: number; body: { ok: false; error: string; fieldErrors?: Record<string, string> } }

export function hashEmail(email: string): string {
  return createHash('sha256').update(email).digest('hex')
}

/**
 * Full lead-magnet subscription workflow: validate → classify (server-side,
 * authoritative) → CRM upsert → local audit record → transactional delivery.
 *
 * Failure policy:
 * - CRM configured but failing → the request fails loudly (502); a CRM outage
 *   must never silently report success.
 * - Local store or email failure → the PDF is still delivered via the
 *   response, the problem is logged and surfaced in `warnings`.
 * - Marketing enrolment happens only with explicit consent; PDF delivery never
 *   depends on it.
 */
export async function processLeadMagnetSubscription(
  deps: LeadMagnetDeps,
  body: unknown
): Promise<ServiceResult> {
  const validation = validateLeadMagnetRequest(body)
  if (!validation.ok) {
    return {
      status: 400,
      body: { ok: false, error: validation.error, fieldErrors: validation.fieldErrors },
    }
  }

  const input = validation.value
  const now = (deps.now ?? (() => new Date()))()
  const classification = classifyAudience({
    requestedResource: input.requestedResource,
    roleCategory: input.roleCategory,
    companyName: input.companyName,
    teamSize: input.teamSize,
    primaryBusinessPain: input.primaryBusinessPain,
  })

  const resource = RESOURCES[classification.deliveredResource]
  const downloadUrl = `${deps.siteUrl}${resource.downloadPath}`
  const emailHash = hashEmail(input.email)
  const warnings: string[] = []

  // 1. CRM upsert — one contact per email address, audience and consent kept
  //    as separate properties. Consent state is recorded either way; only
  //    consent=true may lead to marketing enrolment (via HubSpot active lists).
  let contactId: string | null = null
  let crmStatus: LeadMagnetRequestRecord['crm_status'] = 'skipped'

  if (deps.crm) {
    const properties: Record<string, string> = {
      firstname: input.firstName,
      ...(input.lastName ? { lastname: input.lastName } : {}),
      ...(input.companyName ? { company: input.companyName } : {}),
      tycho_audience_segment: classification.audienceSegment,
      tycho_role_category: input.roleCategory,
      tycho_requested_resource: input.requestedResource,
      ...(input.primaryBusinessPain
        ? { tycho_primary_business_pain: input.primaryBusinessPain }
        : {}),
      ...(input.teamSize ? { tycho_team_size: input.teamSize } : {}),
      ...(input.hoursLostPerWeek ? { tycho_hours_lost_per_week: input.hoursLostPerWeek } : {}),
      ...(input.aiExperience ? { tycho_ai_experience: input.aiExperience } : {}),
      ...(input.primaryInterest ? { tycho_primary_interest: input.primaryInterest } : {}),
      ...(input.currentGoal ? { tycho_current_goal: input.currentGoal } : {}),
      ...(input.source?.platform ? { tycho_source_platform: input.source.platform } : {}),
      ...(input.source?.campaign ? { tycho_source_campaign: input.source.campaign } : {}),
      ...(input.source?.contentId ? { tycho_source_content_id: input.source.contentId } : {}),
      tycho_last_conversion: now.toISOString(),
      tycho_classification_reason: classification.classificationReason,
      tycho_marketing_consent: String(input.marketingConsent),
      tycho_consent_text_version: input.consentTextVersion,
      tycho_consent_timestamp: now.toISOString(),
    }

    try {
      const result = await deps.crm.upsertContactByEmail(input.email, properties)
      contactId = result.contactId
      crmStatus = 'synced'
      deps.log('info', 'lead_magnet.crm_upserted', {
        emailHash,
        created: result.created,
        segment: classification.audienceSegment,
      })

      if (input.companyName) {
        try {
          await deps.crm.upsertCompanyAndAssociate(result.contactId, input.companyName)
        } catch (err) {
          warnings.push('company_association_failed')
          deps.log('warn', 'lead_magnet.company_association_failed', {
            emailHash,
            error: err instanceof Error ? err.message : 'unknown',
          })
        }
      }
    } catch (err) {
      deps.log('error', 'lead_magnet.crm_failed', {
        emailHash,
        error: err instanceof Error ? err.message : 'unknown',
      })
      // A configured CRM that fails must not silently report success.
      return {
        status: 502,
        body: {
          ok: false,
          error:
            'We could not record your request just now. Please try again in a minute — nothing was lost.',
        },
      }
    }
  } else {
    deps.log('warn', 'lead_magnet.crm_skipped_not_configured', { emailHash })
  }

  // 2. Transactional delivery email (never conditioned on marketing consent).
  let emailStatus: LeadMagnetRequestRecord['email_status'] = 'skipped'
  if (deps.email) {
    try {
      await deps.email.send(
        buildDeliveryEmail(classification.deliveredResource, {
          to: input.email,
          firstName: input.firstName,
          downloadUrl,
        })
      )
      emailStatus = 'sent'
    } catch (err) {
      emailStatus = 'failed'
      warnings.push('delivery_email_failed')
      deps.log('error', 'lead_magnet.email_failed', {
        emailHash,
        error: err instanceof Error ? err.message : 'unknown',
      })
    }
  } else {
    deps.log('warn', 'lead_magnet.email_skipped_not_configured', { emailHash })
  }

  // 3. Marketing subscription state, mirroring exactly what was written to
  //    HubSpot above so the two never disagree about who is marketable.
  //
  //    Ticking the box is an explicit opt-in, and is the only thing that can
  //    (re)subscribe someone — requesting a guide, buying, or contacting
  //    support never does. Leaving it unticked records an opt-out, matching
  //    `tycho_marketing_consent: 'false'`, which is what the nurture lists
  //    filter on. Failure here is logged and surfaced but never blocks the
  //    guide the visitor actually asked for.
  if (deps.subscriptions) {
    try {
      if (input.marketingConsent) {
        await deps.subscriptions.subscribe({
          emailHash,
          crmContactId: contactId,
          consentSource: `lead_magnet:${input.requestedResource}`,
          consentTextVersion: input.consentTextVersion,
          at: now,
        })
      } else {
        await deps.subscriptions.unsubscribe({
          emailHash,
          source: 'form_not_opted_in',
          at: now,
          crmSyncStatus: crmStatus === 'synced' ? 'synced' : 'skipped',
        })
      }
    } catch (err) {
      warnings.push('subscription_state_failed')
      deps.log('error', 'lead_magnet.subscription_state_failed', {
        emailHash,
        error: err instanceof Error ? err.message : 'unknown',
      })
    }
  }

  // 4. Local audit record (idempotent). Failure degrades the audit trail but
  //    should not block delivery.
  if (deps.store) {
    try {
      await deps.store.upsertRequest({
        email_hash: emailHash,
        crm_contact_id: contactId,
        requested_resource: input.requestedResource,
        delivered_resource: classification.deliveredResource,
        audience_segment: classification.audienceSegment,
        classification_reason: classification.classificationReason,
        role_category: input.roleCategory,
        marketing_consent: input.marketingConsent,
        consent_text_version: input.consentTextVersion,
        source_platform: input.source?.platform ?? null,
        source_campaign: input.source?.campaign ?? null,
        source_content_id: input.source?.contentId ?? null,
        utm_source: input.source?.utmSource ?? null,
        utm_medium: input.source?.utmMedium ?? null,
        utm_campaign: input.source?.utmCampaign ?? null,
        utm_content: input.source?.utmContent ?? null,
        crm_status: crmStatus,
        email_status: emailStatus,
      })
    } catch (err) {
      warnings.push('audit_record_failed')
      deps.log('error', 'lead_magnet.store_failed', {
        emailHash,
        error: err instanceof Error ? err.message : 'unknown',
      })
    }
  }

  deps.log('info', 'lead_magnet.processed', {
    emailHash,
    requested: input.requestedResource,
    delivered: classification.deliveredResource,
    segment: classification.audienceSegment,
    marketingConsent: input.marketingConsent,
    crmStatus,
    emailStatus,
  })

  return {
    status: 200,
    body: {
      ok: true,
      audienceSegment: classification.audienceSegment,
      deliveredResource: {
        slug: resource.slug,
        title: resource.title,
        downloadUrl,
      },
      marketingEnrolled: input.marketingConsent,
      redirectUrl: resource.thankYouPath,
      ...(warnings.length > 0 ? { warnings } : {}),
    },
  }
}
