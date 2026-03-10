# PandaDoc Template Setup Guide

Copy this contract text into a new PandaDoc template.
Replace each `{{token_name}}` with a Token field in the PandaDoc editor.
Add a **Signature** field (role: "Client") and a **Date** field (role: "Client")
where the signature lines appear at the bottom.

---

# WEB DEVELOPMENT SERVICES AGREEMENT
(Fixed-Price Project + Optional Monthly Plan)

This Web Development Services Agreement ("Agreement") is entered into on **{{current_date}}**
by and between:

**Provider:** {{provider_name}}, located at {{provider_address}} ("Provider")
**Client:** {{client_name}} / {{client_business}}, ("Client")

---

## 1. Scope of Work
1.1 Provider will deliver the website/services described in Exhibit A ("Scope").
1.2 Anything not explicitly listed in Exhibit A is out of scope.

## 2. Timeline & Client Responsibilities
2.1 Estimated start: {{delivery_start}}. Estimated delivery: {{delivery_date}},
subject to Client providing content, approvals, and access in a timely manner.
2.2 Delays caused by Client (late feedback, missing materials, access issues)
extend the schedule accordingly.

## 3. Pricing, Invoicing & Payments
3.1 Project fee: {{project_amount}} (USD) + applicable taxes/fees (if any).
3.2 Payment schedule:
- 40% due upon signing (reserves schedule; non-refundable),
- 40% due upon delivery of Milestone 1,
- 20% due prior to final handoff / go-live.
3.3 Payments will be made via Stripe (card/ACH where available).
3.4 Provider may pause work if any invoice is overdue by more than 7 days.

## 4. Change Requests (Out-of-Scope Work)
4.1 Any change not included in Exhibit A requires a written Change Request.
4.2 Provider will provide updated pricing/timeline. Work begins only after Client's
written approval and any required deposit.
4.3 If Client requests urgent delivery, Provider may charge a rush rate:
{{hourly_rate}}/hour or a fixed fee agreed in writing.

## 5. Revisions & Acceptance
5.1 Included revisions: {{revision_rounds}} as described in Exhibit A.
5.2 Client has 7 calendar days after each milestone delivery to accept or report
specific defects in writing.
5.3 If Client does not respond within the review period, the milestone is deemed accepted.

## 6. Intellectual Property & Licenses
6.1 Upon full payment, Client receives rights to the final deliverables, excluding:
(a) third-party tools, templates, plugins, libraries (subject to their licenses),
(b) Provider's pre-existing code, frameworks, and reusable components.
6.2 Provider retains the right to reuse generic components and know-how, provided
Client confidential information is not disclosed.

## 7. Client Content
7.1 Client represents it owns or has the right to use all text, images, logos, and
other materials supplied to Provider.
7.2 Client is responsible for any claims arising from Client-supplied content.

## 8. Third-Party Services (Hosting, Domains, Integrations)
8.1 Unless stated otherwise, third-party services (hosting, domain, email tools,
booking systems, analytics tools, etc.) are billed to Client or paid directly by Client.
8.2 Provider is not responsible for downtime or changes caused by third-party services,
but will reasonably assist in troubleshooting.

## 9. Monthly Plan (Optional)
9.1 Monthly plan selected: {{monthly_plan}}.
9.2 Monthly plan price: {{monthly_amount}}/month (billed via Stripe auto-pay).
9.3 Out-of-plan work is billed at {{hourly_rate}}/hour or quoted as a fixed add-on.
9.4 Client may cancel with 30 days' notice. Non-payment may result in suspension.

## 10. Confidentiality
Both parties agree to keep non-public information confidential and use it only to
perform this Agreement.

## 11. Limitation of Liability
To the maximum extent allowed by law, Provider's total liability is limited to the
total fees paid by Client under this Agreement in the last 3 months.
Provider is not liable for indirect, incidental, or consequential damages.

## 12. Termination
12.1 Client may terminate at any time. Client will pay for:
(a) completed/accepted milestones, and
(b) work in progress at {{hourly_rate}}/hour proportional to milestones,
and the initial deposit remains non-refundable.
12.2 Provider may terminate if Client materially breaches this Agreement and fails
to cure within 7 days after written notice.

## 13. Portfolio Rights
Provider may display the completed work (screenshots/link) in its portfolio after
launch, unless Client requests confidentiality in writing.

## 14. E-Signatures
This Agreement may be executed electronically. Electronic signatures are binding.

## 15. Governing Law & Venue
This Agreement is governed by the laws of {{governing_state}}.
Any disputes shall be brought in the courts of {{governing_county}}.

---

## SIGNATURES

**Provider:** {{provider_name}}
*(Counter-signed by Provider after document completion)*

**Client:** *(Signature field — role: Client)*
**Name/Title:** {{client_name}} / {{client_business}}
**Date:** *(Date field — role: Client)*

---

## EXHIBIT A — Scope of Work

{{scope_of_work}}

**One-time project fee:** {{project_amount}}
**Monthly plan (if any):** {{monthly_plan}} — {{monthly_amount}}/mo
**Estimated delivery:** {{delivery_date}}
**Revision rounds:** {{revision_rounds}}

---

## EXHIBIT B — Milestones & Timeline

*To be defined in the project kick-off document delivered within 5 business days of signing.*

---

## EXHIBIT C — Monthly Plan

**Plan selected:** {{monthly_plan}}
**Monthly price:** {{monthly_amount}}
**Billing:** Monthly via Stripe auto-pay
**Cancellation:** 30 days' written notice required

---

## Token Reference (for PandaDoc template setup)

| Token name | Description |
|---|---|
| `{{current_date}}` | Agreement signing date |
| `{{provider_name}}` | Your company name |
| `{{provider_address}}` | Your company address |
| `{{client_name}}` | Client's full name |
| `{{client_business}}` | Client's business name |
| `{{client_email}}` | Client's email address |
| `{{client_phone}}` | Client's phone number |
| `{{project_package}}` | Selected package name(s) |
| `{{project_amount}}` | One-time project fee |
| `{{monthly_plan}}` | Monthly plan name + price |
| `{{monthly_amount}}` | Monthly plan price |
| `{{delivery_start}}` | Estimated project start date |
| `{{delivery_date}}` | Estimated delivery / timeline |
| `{{revision_rounds}}` | Number of revision rounds |
| `{{hourly_rate}}` | Hourly rate for out-of-scope work |
| `{{governing_state}}` | State for governing law |
| `{{governing_county}}` | County/venue for disputes |
| `{{scope_of_work}}` | Full dynamically generated scope block (packages + features + deliverables) |
