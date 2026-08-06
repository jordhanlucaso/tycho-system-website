# Nurture Email Sequences (HubSpot workflows — manual setup)

Enrolment: joining the matching active list (segment + explicit marketing
consent). Contacts without marketing consent receive only the transactional
delivery email. No false scarcity anywhere.

> **Unsubscribe is mandatory in every email below.** Any of these sent from the
> application must go through `sendMarketingEmail()`, which checks the
> suppression list at the sending boundary and appends the unsubscribe footer
> and one-click headers. Any sent from HubSpot must carry HubSpot's own
> unsubscribe link. Opting out clears `tycho_marketing_consent`, which is what
> these active lists filter on. See `docs/consent-and-unsubscribe.md`.

## Business Leaders — "Business Systems Briefing"

**Email 1 — Immediate (delivery follow-up).**
Subject: `Your AI Operations Pain Map`
The PDF link again, plus one question:
> Which workflow currently creates the most delay or manual work in your business?

**Email 2 — Day 2.** Topic: `The four signs a workflow is worth automating`
Explain: high frequency · repeatable input · clear output · meaningful time,
delay or error cost. CTA: `Reply with the process you are evaluating.`

**Email 3 — Day 5.** Topic: `What a safe AI-assisted workflow actually looks like`
Explain the shape: `Trigger → data → rules → AI assistance → human approval →
action → log`. CTA: `View a workflow example.`

**Email 4 — Day 8.** Topic: `Estimate the operational value before building`
Link to the scorecard section of the Pain Map (or a future ROI calculator).
CTA: `Score one workflow.`

**Email 5 — Day 12.** Topic: `Would a workflow audit help?`
Plain offer, no pressure. CTA: `Book a 20-minute workflow audit.`

## AI Builders and Learners — "Practical AI Learning"

**Email 1 — Immediate (delivery follow-up).**
Subject: `Your Practical AI Dictionary` — the PDF link again and a pointer to
the "ten terms first" page.

**Email 2 — Day 2.** Topic: `Prompts, workflows and agents are not the same thing`
One practical example of each.

**Email 3 — Day 5.** Topic: `A practical AI system has more than a model`
Walk the parts: input · context · rules · model · tool · validation · output ·
logging.

**Email 4 — Day 8.** Topic: `A build-first path for learning AI automation`
Recommend, in order: one trigger-action workflow → one structured LLM step →
one human approval → one external integration → one error path.

**Email 5 — Day 12.** Topic: `Choose your next practical project`
Link tutorials, templates, workflow examples, and the future mini-course
waitlist. Do **not** push every subscriber toward a consulting call.

## Re-segmentation

When a learner later submits a form with a leadership role and a real business
problem, the server updates the same contact (no duplicate) and list
membership moves them into the Business Leaders sequence automatically. Add a
workflow guard so a contact active in one sequence is unenrolled from the
other on segment change.
