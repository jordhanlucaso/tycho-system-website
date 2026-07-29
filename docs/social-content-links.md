# Social Content → Resource Routing

Which content links where, with ready-made URLs. The landing pages capture
`utm_*`, `src`, `campaign`, `content_id` and the referrer on arrival
(`src/app/lib/attribution.ts`) and attach them to the form submission.

## Rule of thumb

- Content about **running a business** (operations, lead response, admin cost,
  reporting, hiring pressure) → **Pain Map** page.
- Content that **teaches AI** (terminology, prompting, agents, tutorials,
  career) → **AI Dictionary** page.
- Never rely on the link to segment the person — the form answers decide which
  guide is delivered.

## Business-leader content → /resources/ai-operations-pain-map

```text
https://tychosystem.com/resources/ai-operations-pain-map?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_ceo_operations
https://tychosystem.com/resources/ai-operations-pain-map?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_cto_systems
https://tychosystem.com/resources/ai-operations-pain-map?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_coo_workflows
https://tychosystem.com/resources/ai-operations-pain-map?utm_source=youtube&utm_medium=video&utm_campaign=youtube_business_automation
```

## AI-education content → /resources/ai-dictionary

```text
https://tychosystem.com/resources/ai-dictionary?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_ai_dictionary
https://tychosystem.com/resources/ai-dictionary?utm_source=youtube&utm_medium=video&utm_campaign=youtube_ai_fundamentals
https://tychosystem.com/resources/ai-dictionary?utm_source=youtube&utm_medium=video&utm_campaign=youtube_ai_automation
https://tychosystem.com/resources/ai-dictionary?utm_source=linkedin&utm_medium=social&utm_campaign=developer_education
```

Append `&utm_content=<post-id>` per post to compare individual pieces of
content, and optionally `&content_id=<video-or-post-id>` for the CRM-visible
content reference. Do not scrape or auto-message anyone on these platforms —
these are links for content you publish.
