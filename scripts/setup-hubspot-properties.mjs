#!/usr/bin/env node
/**
 * setup-hubspot-properties.mjs
 *
 * One-off, idempotent provisioning of the HubSpot contact properties the
 * lead-magnet funnel writes at runtime. This is an operator tool — it is NOT
 * part of the website or the runtime HubSpot integration
 * (server/src/lib/hubspot.ts), and it never changes contact data.
 *
 * The property/option definitions below are a faithful mirror of the
 * application enums that are the source of truth:
 *   - server/src/lib/lead-magnets/types.ts   (server authority for values)
 *   - src/config/leadMagnets.ts              (public labels)
 *   - server/src/lib/lead-magnets/service.ts (the exact property keys written)
 * Keep them in sync if those files change.
 *
 * Behaviour:
 *   - Creates the `tycho_funnel` property group ("Tycho Funnel") if missing.
 *   - Reads every existing contact property first, then batch-creates only the
 *     properties that are missing (idempotent — safe to re-run).
 *   - For properties that already exist it compares type / field type / options
 *     and REPORTS mismatches. It never edits, deletes or replaces anything.
 *   - Never prints the private-app token, and never echoes secrets on error.
 *
 * Usage:
 *   HUBSPOT_PRIVATE_APP_TOKEN=... node scripts/setup-hubspot-properties.mjs
 *   node scripts/setup-hubspot-properties.mjs --verify   # read-back summary
 *   node scripts/setup-hubspot-properties.mjs --dry-run  # plan only, no writes
 *
 * The token is read from the process environment. If it is not already set the
 * script will load it from server/.env or .env (values are never logged).
 *
 * Exit codes: 0 = success / nothing to do; 1 = failure or option/type mismatch.
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HUBSPOT_BASE = 'https://api.hubapi.com'
// HubSpot dated API version this script targets (Properties API, batch create).
const API_VERSION = '2026-03'
const OBJECT_TYPE = 'contacts'
const GROUP_NAME = 'tycho_funnel'
const GROUP_LABEL = 'Tycho Funnel'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')

/* ── Enum → option mappings (mirror of the application source of truth) ── */

const audienceSegmentOptions = [
  { value: 'business_leader', label: 'Business leader' },
  { value: 'ai_builder_learner', label: 'AI builder or learner' },
]

// The 9 canonical RoleCategory values (types.ts). Labels follow the public copy
// in leadMagnets.ts; individual_contributor only appears in the dictionary form.
const roleCategoryOptions = [
  { value: 'ceo_founder', label: 'CEO or founder' },
  { value: 'cto_technical_leader', label: 'CTO or technical leader' },
  { value: 'coo_operations_leader', label: 'COO or operations leader' },
  { value: 'head_director_manager', label: 'Head, director or manager' },
  { value: 'individual_contributor', label: 'Individual contributor' },
  { value: 'developer', label: 'Developer or technical individual contributor' },
  { value: 'freelancer_consultant', label: 'Freelancer or consultant' },
  { value: 'student_job_seeker', label: 'Student or job seeker' },
  { value: 'other', label: 'Other' },
]

const requestedResourceOptions = [
  { value: 'ai_operations_pain_map', label: 'The AI Operations Pain Map' },
  { value: 'ai_dictionary', label: 'The Practical AI Dictionary' },
]

const teamSizeOptions = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_5', label: '2–5' },
  { value: '6_10', label: '6–10' },
  { value: '11_25', label: '11–25' },
  { value: '26_50', label: '26–50' },
  { value: '51_100', label: '51–100' },
  { value: 'more_than_100', label: 'More than 100' },
]

const businessPainOptions = [
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

const hoursLostOptions = [
  { value: 'under_2', label: 'Less than 2 hours' },
  { value: '2_5', label: '2–5 hours' },
  { value: '5_10', label: '5–10 hours' },
  { value: '10_20', label: '10–20 hours' },
  { value: 'over_20', label: 'More than 20 hours' },
  { value: 'not_sure', label: 'Not sure' },
]

const aiExperienceOptions = [
  { value: 'completely_new', label: 'Completely new' },
  { value: 'chat_user', label: 'I use ChatGPT or Claude' },
  { value: 'simple_automations', label: 'I have built simple automations' },
  { value: 'technical_builder', label: 'I build technical AI systems' },
  { value: 'not_sure', label: 'I am not sure' },
]

const primaryInterestOptions = [
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

const currentGoalOptions = [
  { value: 'understand_terminology', label: 'Understand AI terminology' },
  { value: 'improve_current_work', label: 'Improve my current work' },
  { value: 'build_automations', label: 'Build automations' },
  { value: 'learn_technical_implementation', label: 'Learn technical implementation' },
  { value: 'offer_ai_services', label: 'Start offering AI services' },
  { value: 'evaluate_for_business', label: 'Evaluate AI for my business' },
  { value: 'explore_the_field', label: 'Explore the field' },
]

// service.ts writes String(boolean) → "true" / "false". Values must match; the
// labels are display-only. Segment and consent are deliberately separate.
const marketingConsentOptions = [
  { value: 'true', label: 'Consented' },
  { value: 'false', label: 'Not consented' },
]

/* ── Property definitions (17 total, all written by service.ts) ── */

function withOrder(options) {
  return options.map((o, i) => ({ label: o.label, value: o.value, displayOrder: i, hidden: false }))
}
function enumProp(name, label, options) {
  return {
    name,
    label,
    groupName: GROUP_NAME,
    type: 'enumeration',
    fieldType: 'select',
    options: withOrder(options),
  }
}
function textProp(name, label) {
  return { name, label, groupName: GROUP_NAME, type: 'string', fieldType: 'text' }
}
// service.ts writes ISO 8601 timestamps (new Date().toISOString()).
function datetimeProp(name, label) {
  return { name, label, groupName: GROUP_NAME, type: 'datetime', fieldType: 'date' }
}

const PROPERTIES = [
  enumProp('tycho_audience_segment', 'Tycho — Audience segment', audienceSegmentOptions),
  enumProp('tycho_role_category', 'Tycho — Role category', roleCategoryOptions),
  enumProp('tycho_requested_resource', 'Tycho — Requested resource', requestedResourceOptions),
  enumProp('tycho_primary_business_pain', 'Tycho — Primary business pain', businessPainOptions),
  enumProp('tycho_team_size', 'Tycho — Team size', teamSizeOptions),
  enumProp('tycho_hours_lost_per_week', 'Tycho — Hours lost per week', hoursLostOptions),
  enumProp('tycho_ai_experience', 'Tycho — AI experience', aiExperienceOptions),
  enumProp('tycho_primary_interest', 'Tycho — Primary interest', primaryInterestOptions),
  enumProp('tycho_current_goal', 'Tycho — Current goal', currentGoalOptions),
  textProp('tycho_source_platform', 'Tycho — Source platform'),
  textProp('tycho_source_campaign', 'Tycho — Source campaign'),
  textProp('tycho_source_content_id', 'Tycho — Source content ID'),
  datetimeProp('tycho_last_conversion', 'Tycho — Last conversion'),
  textProp('tycho_classification_reason', 'Tycho — Classification reason'),
  enumProp('tycho_marketing_consent', 'Tycho — Marketing consent', marketingConsentOptions),
  textProp('tycho_consent_text_version', 'Tycho — Consent text version'),
  datetimeProp('tycho_consent_timestamp', 'Tycho — Consent timestamp'),
  // Written by the unsubscribe flow alongside tycho_marketing_consent=false, so
  // an active list filtered on consent drops the contact on the next refresh.
  datetimeProp('tycho_unsubscribed_at', 'Tycho — Unsubscribed at'),
  textProp('tycho_unsubscribe_source', 'Tycho — Unsubscribe source'),
]

const MANAGED_NAMES = new Set(PROPERTIES.map((p) => p.name))

/* ── Token loading (never logged) ── */

function loadTokenFromEnvFiles() {
  for (const rel of ['server/.env', '.env']) {
    const file = join(repoRoot, rel)
    if (!existsSync(file)) continue
    let contents
    try {
      contents = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    for (const rawLine of contents.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      if (key !== 'HUBSPOT_PRIVATE_APP_TOKEN' || process.env[key]) continue
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (value) process.env[key] = value
    }
  }
}

function getToken() {
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) loadTokenFromEnvFiles()
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  if (!token) {
    console.error(
      'HUBSPOT_PRIVATE_APP_TOKEN is not set. Provide it in the environment or in\n' +
        'server/.env, then re-run. The token is never printed by this script.'
    )
    process.exit(1)
  }
  return token
}

/* ── HubSpot request helper (auth header only; token never surfaces in logs) ── */

async function hs(token, path, init = {}, retried = false) {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-HubSpot-Api-Version': API_VERSION,
      ...(init.headers ?? {}),
    },
  })
  if (res.status === 429 && !retried) {
    const retryAfter = Number(res.headers.get('Retry-After')) || 1
    await new Promise((r) => setTimeout(r, Math.min(retryAfter, 10) * 1000))
    return hs(token, path, init, true)
  }
  return res
}

async function readError(res) {
  // HubSpot error bodies describe the request, never the auth token.
  let detail = ''
  try {
    const body = await res.json()
    detail = body?.message ? ` — ${body.message}` : ''
  } catch {
    /* non-JSON body */
  }
  return `HTTP ${res.status}${detail}`
}

/* ── Reads ── */

async function fetchAllContactProperties(token) {
  const res = await hs(token, `/crm/v3/properties/${OBJECT_TYPE}`, { method: 'GET' })
  if (!res.ok) throw new Error(`Failed to read contact properties: ${await readError(res)}`)
  const data = await res.json()
  const map = new Map()
  for (const p of data.results ?? []) map.set(p.name, p)
  return map
}

async function ensureGroup(token, dryRun) {
  const res = await hs(token, `/crm/v3/properties/${OBJECT_TYPE}/groups`, { method: 'GET' })
  if (!res.ok) throw new Error(`Failed to read property groups: ${await readError(res)}`)
  const data = await res.json()
  const existing = (data.results ?? []).find((g) => g.name === GROUP_NAME)
  if (existing) {
    console.log(`✔ Property group "${GROUP_NAME}" already exists.`)
    return
  }
  if (dryRun) {
    console.log(`＋ [dry-run] Would create property group "${GROUP_NAME}" (${GROUP_LABEL}).`)
    return
  }
  const create = await hs(token, `/crm/v3/properties/${OBJECT_TYPE}/groups`, {
    method: 'POST',
    body: JSON.stringify({ name: GROUP_NAME, label: GROUP_LABEL, displayOrder: -1 }),
  })
  if (!create.ok) throw new Error(`Failed to create property group: ${await readError(create)}`)
  console.log(`＋ Created property group "${GROUP_NAME}" (${GROUP_LABEL}).`)
}

/* ── Mismatch detection (report-only, never mutate) ── */

function diffProperty(def, existing) {
  const issues = []
  if (existing.type !== def.type) {
    issues.push(`type is "${existing.type}", expected "${def.type}"`)
  }
  if (existing.fieldType !== def.fieldType) {
    issues.push(`fieldType is "${existing.fieldType}", expected "${def.fieldType}"`)
  }
  if (def.type === 'enumeration') {
    const expected = def.options.map((o) => o.value)
    const actual = (existing.options ?? []).map((o) => o.value)
    const missing = expected.filter((v) => !actual.includes(v))
    const extra = actual.filter((v) => !expected.includes(v))
    if (missing.length) issues.push(`missing options: ${missing.join(', ')}`)
    if (extra.length) issues.push(`unexpected options: ${extra.join(', ')}`)
    // Label drift on shared values (values already match here).
    const existingByValue = new Map((existing.options ?? []).map((o) => [o.value, o.label]))
    for (const o of def.options) {
      const label = existingByValue.get(o.value)
      if (label !== undefined && label !== o.label) {
        issues.push(`option "${o.value}" label is "${label}", expected "${o.label}"`)
      }
    }
  }
  if (def.groupName && existing.groupName && existing.groupName !== def.groupName) {
    issues.push(`group is "${existing.groupName}", expected "${def.groupName}"`)
  }
  return issues
}

/* ── Setup ── */

async function runSetup(token, dryRun) {
  await ensureGroup(token, dryRun)
  const existingProps = await fetchAllContactProperties(token)

  const toCreate = []
  const matched = []
  const mismatched = []

  for (const def of PROPERTIES) {
    const existing = existingProps.get(def.name)
    if (!existing) {
      toCreate.push(def)
      continue
    }
    const issues = diffProperty(def, existing)
    if (issues.length) mismatched.push({ name: def.name, issues })
    else matched.push(def.name)
  }

  console.log('')
  console.log(`Skipped (already correct): ${matched.length}`)
  for (const name of matched) console.log(`  ✔ ${name}`)

  if (toCreate.length) {
    if (dryRun) {
      console.log(`\n＋ [dry-run] Would create ${toCreate.length} propert${toCreate.length === 1 ? 'y' : 'ies'}:`)
      for (const p of toCreate) console.log(`  ＋ ${p.name} (${p.type}/${p.fieldType})`)
    } else {
      const res = await hs(token, `/crm/v3/properties/${OBJECT_TYPE}/batch/create`, {
        method: 'POST',
        body: JSON.stringify({ inputs: toCreate }),
      })
      if (!res.ok) throw new Error(`Batch create failed: ${await readError(res)}`)
      const data = await res.json()
      const created = (data.results ?? []).map((p) => p.name)
      console.log(`\n＋ Created ${created.length} propert${created.length === 1 ? 'y' : 'ies'}:`)
      for (const name of created) console.log(`  ＋ ${name}`)
    }
  } else {
    console.log('\nNo properties to create — all present.')
  }

  if (mismatched.length) {
    console.log(`\n⚠ ${mismatched.length} existing propert${mismatched.length === 1 ? 'y' : 'ies'} do not match the expected definition.`)
    console.log('  These were NOT modified. Review and fix them manually in HubSpot (see docs §5 rollback):')
    for (const m of mismatched) {
      console.log(`  ⚠ ${m.name}`)
      for (const issue of m.issues) console.log(`      - ${issue}`)
    }
    return { ok: false }
  }

  console.log('\n✔ HubSpot funnel properties are in sync.')
  return { ok: true }
}

/* ── Verify (read-back summary) ── */

async function runVerify(token) {
  const existingProps = await fetchAllContactProperties(token)
  console.log(`Tycho funnel properties (read back from HubSpot, group "${GROUP_NAME}"):\n`)

  let missing = 0
  let mismatched = 0
  for (const def of PROPERTIES) {
    const existing = existingProps.get(def.name)
    if (!existing) {
      missing += 1
      console.log(`  ✘ ${def.name} — MISSING`)
      continue
    }
    const issues = diffProperty(def, existing)
    const shape =
      existing.type === 'enumeration'
        ? `enumeration/${existing.fieldType} (${(existing.options ?? []).length} options)`
        : `${existing.type}/${existing.fieldType}`
    if (issues.length) {
      mismatched += 1
      console.log(`  ⚠ ${def.name} — ${shape} [${existing.groupName}] — ${issues.length} issue(s)`)
      for (const issue of issues) console.log(`      - ${issue}`)
    } else {
      console.log(`  ✔ ${def.name} — ${shape} [${existing.groupName}]`)
    }
  }

  // Surface any stray tycho_* properties not in our managed set.
  const strays = [...existingProps.keys()].filter((n) => n.startsWith('tycho_') && !MANAGED_NAMES.has(n))
  if (strays.length) {
    console.log(`\n  Extra tycho_* properties not managed by this script: ${strays.join(', ')}`)
  }

  console.log(`\nSummary: ${PROPERTIES.length - missing - mismatched} ok, ${mismatched} mismatched, ${missing} missing (of ${PROPERTIES.length}).`)
  return { ok: missing === 0 && mismatched === 0 }
}

/* ── Entry ── */

async function main() {
  const args = process.argv.slice(2)
  const verify = args.includes('--verify') || args.includes('verify')
  const dryRun = args.includes('--dry-run')
  const token = getToken()

  try {
    const result = verify ? await runVerify(token) : await runSetup(token, dryRun)
    process.exit(result.ok ? 0 : 1)
  } catch (err) {
    // err messages come from readError()/local strings — no token content.
    console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main()
