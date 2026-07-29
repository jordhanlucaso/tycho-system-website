import type { ResourceSlug } from './types.js'
import type { TransactionalEmail } from '../email.js'

type DeliveryEmailInput = {
  to: string
  firstName: string
  downloadUrl: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapHtml(paragraphs: string[], downloadUrl: string): string {
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px;">${p}</p>`).join('\n')
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2a44;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;line-height:1.65;font-size:15px;">
    ${body}
    <p style="margin:0 0 24px;">
      <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#3C6FD6;color:#ffffff;text-decoration:none;border-radius:9px;padding:12px 22px;font-weight:600;">Download the guide</a>
    </p>
    <p style="margin:0;color:#64748b;">— Tycho Systems</p>
  </div>
</body>
</html>`
}

export function buildPainMapDeliveryEmail(input: DeliveryEmailInput): TransactionalEmail {
  const firstName = escapeHtml(input.firstName)
  return {
    to: input.to,
    subject: 'Your AI Operations Pain Map',
    text: `Hi ${input.firstName},

Here is your copy of The AI Operations Pain Map.

It covers the operational problems most likely to create slow responses, repeated administration, disconnected information and limited visibility as a business grows.

Download the guide:
${input.downloadUrl}

A useful first exercise is to identify the one workflow that occurs most often and creates the most delay or manual effort.

— Tycho Systems`,
    html: wrapHtml(
      [
        `Hi ${firstName},`,
        'Here is your copy of <strong>The AI Operations Pain Map</strong>.',
        'It covers the operational problems most likely to create slow responses, repeated administration, disconnected information and limited visibility as a business grows.',
        'A useful first exercise is to identify the one workflow that occurs most often and creates the most delay or manual effort.',
      ],
      input.downloadUrl
    ),
  }
}

export function buildDictionaryDeliveryEmail(input: DeliveryEmailInput): TransactionalEmail {
  const firstName = escapeHtml(input.firstName)
  return {
    to: input.to,
    subject: 'Your Practical AI Dictionary',
    text: `Hi ${input.firstName},

Here is your copy of The Practical AI Dictionary.

It explains the AI, automation and agent terminology you are most likely to encounter, with clear definitions and practical examples.

Download the guide:
${input.downloadUrl}

You do not need to memorise every term. Use the dictionary as a reference while you learn, work or build.

— Tycho Systems`,
    html: wrapHtml(
      [
        `Hi ${firstName},`,
        'Here is your copy of <strong>The Practical AI Dictionary</strong>.',
        'It explains the AI, automation and agent terminology you are most likely to encounter, with clear definitions and practical examples.',
        'You do not need to memorise every term. Use the dictionary as a reference while you learn, work or build.',
      ],
      input.downloadUrl
    ),
  }
}

export function buildDeliveryEmail(
  resource: ResourceSlug,
  input: DeliveryEmailInput
): TransactionalEmail {
  return resource === 'ai_operations_pain_map'
    ? buildPainMapDeliveryEmail(input)
    : buildDictionaryDeliveryEmail(input)
}
