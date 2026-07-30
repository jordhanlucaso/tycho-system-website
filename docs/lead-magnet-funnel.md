# Lead-Magnet Funnel — Setup & Operations Guide

The segmented lead-magnet funnel that repositions Tycho Systems around AI
automation, websites, integrations and internal systems. Two audiences, two
resources, one deterministic router.

## 1. Funnel overview

| Audience | Resource | Landing page | Thank-you page |
| --- | --- | --- | --- |
| Business Leaders (CEO/CTO/COO/founder/manager with a real business problem) | The AI Operations Pain Map | `/resources/ai-operations-pain-map` | `/thank-you/business-leader` |
| AI Builders and Learners (developers, freelancers, employees, students, learners) | The Practical AI Dictionary | `/resources/ai-dictionary` | `/thank-you/ai-dictionary` |

`/resources` is the audience selector (two cards); the homepage carries the
same selector as a section. Social content links to the audience-specific
landing page with UTM parameters (see `docs/social-content-links.md`).

## 2. Architecture

```text
Social content (LinkedIn / YouTube)
        ↓  utm_* + src/campaign/content_id params
Landing page (React SPA, Vercel)
        ↓  attribution captured to sessionStorage (src/app/lib/attribution.ts)
Two-step form (src/app/components/resources/LeadMagnetForm.tsx)
        ↓  POST /api/lead-magnets/subscribe (Express server, Railway)
server/src/routes/lead-magnets.ts        — rate limit, wiring
server/src/lib/lead-magnets/validate.ts  — validation, honeypot, disposable check
server/src/lib/lead-magnets/classification.ts — deterministic segmenting
server/src/lib/lead-magnets/service.ts   — orchestration + failure policy
        ├─ server/src/lib/hubspot.ts     — contact upsert, company association
        ├─ server/src/lib/email.ts       — transactional delivery (Resend adapter)
        └─ Supabase lead_magnet_requests — hashed audit record (migration 005)
        ↓
JSON response { audienceSegment, deliveredResource, redirectUrl }
        ↓
Thank-you page (download + cross-delivery explanation)
```

Failure policy: a configured-but-failing CRM fails the request loudly (502 —
never silent success). Store or email failures degrade to `warnings` in the
response and are logged; the visitor still gets the PDF. When CRM/email are
not configured (dev), those steps are skipped with a logged warning.

## 3. Form field definitions

Both forms are two-step. Canonical machine values live in
`src/config/leadMagnets.ts` (frontend) and `server/src/lib/lead-magnets/types.ts`
(server authority) — keep them in sync.

**Pain Map form** — Step 1: firstName*, lastName, email* (work), roleCategory*
(ceo_founder | cto_technical_leader | coo_operations_leader |
head_director_manager | developer | freelancer_consultant | student_job_seeker
| other), companyName. Step 2: teamSize* (just_me…more_than_100),
primaryBusinessPain* (10 options incl. not_sure), hoursLostPerWeek*
(under_2…over_20, not_sure), existingTools, marketingConsent (optional,
default off).

**Dictionary form** — Step 1: firstName*, lastName, email*, role* (display
values developer_engineer…other, each mapped to a canonical RoleCategory),
company/organisation. Step 2: aiExperience*, primaryInterest*, currentGoal*,
marketingConsent (optional, default off).

Hidden: `website` honeypot (must stay empty), `source` attribution object.

## 4. Classification rules

Implemented in `server/src/lib/lead-magnets/classification.ts`; recalculated
server-side on every submission; landing page is never a factor.

1. Leadership role (ceo_founder, cto_technical_leader, coo_operations_leader,
   head_director_manager) **and** business evidence → `business_leader`.
2. Leadership role without evidence → `ai_builder_learner`.
3. Freelancer with explicit business responsibility, or with a company **and**
   a concrete pain → `business_leader`.
4. Any role with explicit business responsibility + evidence → `business_leader`.
5. Everyone else → `ai_builder_learner`.

“Business evidence” = named company, a concrete pain (≠ not_sure), team size
beyond just_me, or the explicit responsibility flag. Delivered resource always
follows the final segment; cross-delivery is appended to
`classificationReason` and explained on the thank-you page. Tests:
`server/src/lib/lead-magnets/classification.test.ts`.

## 5. HubSpot contact properties (provisioned by script)

The 17 `tycho_*` contact properties are created by
`scripts/setup-hubspot-properties.mjs` — do **not** hand-create them. The script
derives every property, label and dropdown option from the application source of
truth (`server/src/lib/lead-magnets/types.ts` and `src/config/leadMagnets.ts`)
and writes them into the `tycho_funnel` group ("Tycho Funnel").

Dropdown (enumeration) properties, with the exact internal values the server
writes: `tycho_audience_segment` (business_leader, ai_builder_learner),
`tycho_role_category` (the 9 RoleCategory values), `tycho_requested_resource`
(ai_operations_pain_map, ai_dictionary), `tycho_primary_business_pain`,
`tycho_team_size`, `tycho_hours_lost_per_week`, `tycho_ai_experience`,
`tycho_primary_interest`, `tycho_current_goal`, and `tycho_marketing_consent`
(true, false). Text properties: `tycho_source_platform`, `tycho_source_campaign`,
`tycho_source_content_id`, `tycho_classification_reason`,
`tycho_consent_text_version`. Datetime properties (server writes ISO 8601):
`tycho_last_conversion`, `tycho_consent_timestamp`.

Audience segment and marketing consent are deliberately separate properties.
**Never treat the segment as consent.**

### 5.1 Setup

```bash
# Token is read from the environment, or from server/.env / .env if present.
# It is never printed by the script.
HUBSPOT_PRIVATE_APP_TOKEN=... npm run hubspot:setup-properties

# Preview without writing anything:
node scripts/setup-hubspot-properties.mjs --dry-run
```

The script is idempotent: it creates the group if missing, reads all existing
contact properties first, batch-creates only the ones that are absent, and skips
those already present. If an existing property's type, field type or dropdown
options differ from the expected definition it **reports the mismatch and exits
non-zero without changing anything** — resolve those by hand (see rollback).

### 5.2 Verify

```bash
npm run hubspot:verify-properties     # reads every tycho_* property back and
                                      # prints an ok / mismatched / missing summary
```

### 5.3 Rollback / fixing mismatches

The script never deletes or edits properties, so rollback is manual and
deliberate. In HubSpot: **Settings → Properties → Contact properties**, filter by
the "Tycho Funnel" group.

- **Remove a property:** open it → *Delete*. Deleting a property permanently
  removes its stored values on all contacts — export first if you need the data.
- **Remove everything:** delete each `tycho_*` property, then delete the
  "Tycho Funnel" group (a group can only be deleted once it is empty).
- **Fix a mismatch the script flagged:** dropdown options can be added/renamed
  in place (Edit → the option list). A property's *type* or *field type* cannot
  be changed after creation — to correct those you must delete the property and
  re-run `npm run hubspot:setup-properties` to recreate it cleanly.

A private app token with `crm.schemas.contacts.read` +
`crm.schemas.contacts.write` scopes is required to create/inspect properties
(the runtime funnel only needs the contacts/companies object scopes).

## 6. HubSpot active lists (segments)

- **Tycho — Business Leaders**: `tycho_audience_segment = business_leader`
  AND `tycho_marketing_consent = true`
- **Tycho — AI Builders and Learners**: `tycho_audience_segment = ai_builder_learner`
  AND `tycho_marketing_consent = true`

## 7. Subscription types

Where the HubSpot plan supports subscription types, create:

- **Business Systems Briefing** — used by the Business Leader nurture emails.
- **Practical AI Learning** — used by the Builder/Learner nurture emails.

Set the corresponding subscription on the contact from the workflow that
enrols them (manual setup, see §8). Unsubscribe handling is HubSpot's standard
link in every marketing email.

## 8. Email workflow setup

**Transactional delivery** is sent by the server (Resend-compatible adapter;
copy in `server/src/lib/lead-magnets/emails.ts`). No HubSpot setup needed.

**Nurture sequences** are HubSpot workflows (manual setup — build only after
delivery + segmentation are verified). Enrolment trigger: joins the matching
active list from §6. Full copy outlines: `docs/email-sequences.md`.

- Business Leaders: Day 0 delivery follow-up → Day 2 “four signs a workflow is
  worth automating” → Day 5 “what a safe AI-assisted workflow looks like” →
  Day 8 “estimate the value before building” → Day 12 “would a workflow audit
  help?”. No false scarcity.
- Builders/Learners: Day 0 delivery → Day 2 “prompts vs workflows vs agents” →
  Day 5 “a practical AI system has more than a model” → Day 8 “a build-first
  learning path” → Day 12 “choose your next practical project”. Do not push
  everyone toward a consulting call.

If a learner later shows a leadership role + real business problem, the next
form submission re-segments the same contact (no duplicate is created) and the
list membership follows automatically.

## 9. Environment variables

Frontend (`.env.example`): `VITE_API_URL`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `VITE_RECAPTCHA_SITE_KEY`.

Server (`server/.env.example`): `PUBLIC_SITE_URL`,
`HUBSPOT_PRIVATE_APP_TOKEN`, `TRANSACTIONAL_EMAIL_API_KEY`,
`TRANSACTIONAL_EMAIL_FROM`, `TRANSACTIONAL_EMAIL_REPLY_TO`, plus the existing
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CLIENT_URL`, Stripe and reCAPTCHA
variables. CRM and email are optional: unset = skipped with a logged warning
(useful in dev), set = failures surface.

Recommended production transactional values (domain **tychosystem.com**):

```bash
TRANSACTIONAL_EMAIL_FROM="Tycho Systems <resources@tychosystem.com>"
TRANSACTIONAL_EMAIL_REPLY_TO=contact@tychosystem.com
```

These are configuration only — the server reads them from the environment and
never hard-codes production addresses in logic.

## 9a. Business email + notification routing

Public addresses are centralised in `src/config/contact.ts`; the server mirrors
them in `server/src/config/contact.ts`, which owns the notification routing
table (`notificationRecipients`). The **server** decides every destination — a
form may hint at a category, but it can never supply or read the target address.

| Notification category | Destination |
| --- | --- |
| General contact / workflow audit | contact@tychosystem.com |
| Support | support@tychosystem.com |
| Billing | billing@tychosystem.com |
| Privacy | privacy@tychosystem.com |
| Partnerships | partners@tychosystem.com |
| PDF delivery failures | support@tychosystem.com |
| Critical system alerts | jordhan@tychosystem.com |

Billing and the founder/critical-alert address are intentionally **not**
exposed in the site's structured data (only customer support, general contact
and privacy appear as Schema.org `ContactPoint` entries).

## 10. PDF generation

Sources: `src/content/resources/ai-operations-pain-map.md` and
`practical-ai-dictionary.md`. Generate with `npm run gen:pdfs` (or
`bun run gen:pdfs`) — renders Markdown → styled HTML → PDF via headless
Chrome/Chromium (`CHROME_BIN` overrides autodetection). Output is committed at
`public/downloads/*.pdf` and served statically; intermediate HTML lives in the
OS temp dir only. Regenerate and commit whenever the Markdown changes. Both
PDFs contain real selectable text.

## 11. Analytics events

Typed wrapper: `src/app/lib/analytics.ts` (sends to Plausible when its script
is present; no-ops otherwise). Events: resource_selector_viewed,
resource_selected, lead_magnet_page_viewed, lead_magnet_form_started,
lead_magnet_step_completed, lead_magnet_form_submitted,
lead_magnet_form_failed, audience_classified, lead_magnet_delivered,
pdf_download_clicked, marketing_consent_given, marketing_consent_declined,
service_card_clicked, audit_cta_clicked, booking_clicked. Props are enum-like
values only — never emails or free text.

## 12. Testing procedure

```bash
npm run test        # vitest: classification, validation, service orchestration,
                    # form behaviour, config integrity (server + frontend suites)
npx tsc -b          # frontend typecheck
cd server && npx tsc --noEmit   # server typecheck
npm run lint
npm run build       # production build + legal prerender
```

Manual end-to-end (dev): `npm run dev` + `npm run dev:server`, submit each
form with a test address, verify classification, redirect, and (with env vars
set) the HubSpot contact and delivery email. **Always test HubSpot with a
non-production contact** (e.g. `yourname+test@yourdomain`) and delete it
afterwards.

## 13. Deployment checklist

1. Run migration `server/supabase/migrations/005_lead_magnet_requests.sql`.
2. Create HubSpot properties with `npm run hubspot:setup-properties`, verify with
   `npm run hubspot:verify-properties` (§5), then create lists (§6) and
   subscription types (§7).
3. Set server env vars on Railway; set `PUBLIC_SITE_URL`.
4. Verify sender domain with the email provider (SPF/DKIM) before setting
   `TRANSACTIONAL_EMAIL_API_KEY`.
5. `npm run gen:pdfs` if resource content changed; commit PDFs.
6. Deploy frontend (Vercel) and server (Railway).
7. Submit both forms with a test contact; check contact, email, audit row.
8. Build nurture workflows in HubSpot (§8) only after step 7 passes.

## 14. Privacy considerations

- PDF delivery never depends on the optional marketing checkbox; consent
  wording, version (`CONSENT_TEXT_VERSION`) and timestamp are recorded.
- Local audit rows store a SHA-256 email hash, not the address; full contact
  data lives only in HubSpot.
- Logs never contain raw form data or email addresses (hashed only).
- Analytics receives no PII. The privacy policy
  (`src/content/legal/privacy-policy.md`) lists HubSpot, the email provider
  and Supabase, plus retention (audit rows ≤ 24 months) and deletion contact.
- Deletion request: remove the HubSpot contact, delete the
  `lead_magnet_requests` rows for the email hash, and remove the address from
  the email provider's suppression/log data where applicable.

## 15. Manual tasks still to complete in HubSpot

- [ ] Create the 17 contact properties: `npm run hubspot:setup-properties`,
      then confirm with `npm run hubspot:verify-properties` (§5).
- [ ] Create the two active lists (§6).
- [ ] Create the two subscription types (§7) if the plan supports them.
- [ ] Create a private app with contacts+companies read/write scopes; copy the
      token to `HUBSPOT_PRIVATE_APP_TOKEN`.
- [ ] Build the two nurture workflows (§8) with the copy in
      `docs/email-sequences.md`.
- [ ] Confirm the marketing-email footer includes the unsubscribe link and
      company details.
