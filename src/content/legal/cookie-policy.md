# Cookie Policy — Tycho Systems

_Last updated: 2026-08-06_

This policy explains the cookies and similar technologies used on **tychosystem.com**, what each one is for, and how to change or withdraw your choice. It sits alongside our [Privacy Policy](/privacy), which explains how we handle personal data more generally.

## 1. What cookies and similar technologies are

A **cookie** is a small text file a website asks your browser to store, which is sent back to that website on later visits.

Websites can also store data using **localStorage** and **sessionStorage**, which keep information in your browser without sending it back automatically. They are not technically cookies, but the same consent rules apply, so we treat them identically here and refer to all of them as "cookies and similar technologies".

Something is **first-party** when it is set by tychosystem.com itself, and **third-party** when it is set by another company whose service is embedded in the page.

Most of what this site stores is first-party browser storage rather than actual cookies. **Tycho Systems sets no first-party cookies at all**, and we run no advertising, remarketing or cross-site tracking technology of any kind.

## 2. How we ask for consent

The first time you visit, a notice appears with three equally available choices: accept everything, reject everything that is not strictly necessary, or open the preference panel and decide category by category.

Until you make a choice:

- Nothing in the Functional or Analytics categories runs.
- No optional value is written to your browser.
- No optional third-party script is downloaded.

We do not treat scrolling, continued browsing, closing the notice or doing nothing as consent. Optional categories are never pre-ticked.

When you choose, we store your decision (see `tycho_consent_v1` below). It records the schema version, which categories you allowed, the time, and which button you used — nothing that identifies you.

## 3. Strictly necessary

These are required for the site to work and for us to keep it secure. They cannot be switched off, and we rely on them without consent because the site cannot deliver what you asked for without them.

| Name | Provider | Purpose | Type | Duration |
| --- | --- | --- | --- | --- |
| `tycho_consent_v1` | Tycho Systems | Remembers your cookie choice so you are not asked on every page | First-party localStorage | Until you clear browser storage, or until this policy's categories change materially |
| `sb-<project>-auth-token` | Supabase (our database and authentication provider) | Keeps you signed in to the client, admin or sales portal | First-party localStorage | Until you sign out. The underlying session is refreshed automatically — **the exact refresh-token lifetime is a Supabase project setting and should be confirmed against your project configuration** |
| `tycho-cart` | Tycho Systems | Holds the contents of your basket while you move between pages | First-party sessionStorage | Until you close the browser tab |
| `contract_id`, `contract_text`, `checkout_email` | Tycho Systems | Carries your contract and checkout details between the checkout, signature and confirmation steps | First-party sessionStorage | Cleared when checkout completes, or when you close the tab |
| `tycho_lead_magnet_result_v1` | Tycho Systems | Carries the result of a guide request through to the thank-you page so your download link survives a refresh | First-party sessionStorage | Until you close the browser tab |
| `_GRECAPTCHA` and related storage | Google (reCAPTCHA v3) | Distinguishes people from automated scripts on the strategy-call and guide-request forms, so the forms cannot be abused | Third-party, set on Google's domain | Google documents approximately 6 months — **duration is set by Google and should be re-verified against their current documentation** |

**About reCAPTCHA.** We treat it as strictly necessary because it exists to protect the forms against abuse rather than to learn anything about you, and the forms cannot safely be offered without it. It is still a Google service: using those pages means your browser contacts Google, and Google's own [privacy policy](https://policies.google.com/privacy) and [terms](https://policies.google.com/terms) apply. It loads only on pages that contain a protected form.

## 4. Functional

Off unless you turn it on. These remember a preference so the site behaves the way you left it.

| Name | Provider | Purpose | Type | Duration |
| --- | --- | --- | --- | --- |
| `tycho-theme` | Tycho Systems | Remembers whether you chose the light or dark appearance | First-party localStorage | Until you clear browser storage or withdraw consent |

If you decline this category the light/dark toggle still works — your choice simply resets to the default when you close the tab. If you later withdraw consent, we delete this value from your browser immediately.

## 5. Analytics

Off unless you turn it on. These help us understand which pages and campaigns are worth keeping, in aggregate.

| Name | Provider | Purpose | Type | Duration |
| --- | --- | --- | --- | --- |
| `tycho_attribution_v1` | Tycho Systems | Records the campaign tags (UTM parameters), referring site and landing page of your current visit, so that if you later request a guide we know which campaign brought you | First-party sessionStorage | Until you close the browser tab |
| Plausible Analytics | Plausible Insights OÜ (Estonia, EU) | Aggregate page statistics | Third-party script | **Not currently in use** — see below |

**Plausible is not enabled today.** The site is built to support it, but no analytics script is configured, so no analytics provider is contacted at all. If we enable it, it will load only after you have allowed the Analytics category. Plausible is cookieless, stores nothing on your device, does not track visitors across websites and collects no personally identifiable information — see their [data policy](https://plausible.io/data-policy). We will update this page and the "last updated" date before switching it on.

If you withdraw analytics consent, we delete `tycho_attribution_v1` and stop loading any analytics script. Statistics already collected in aggregate cannot be traced back to you and therefore cannot be individually deleted.

## 6. Marketing

**We use none.** There is no advertising pixel, no remarketing tag, no conversion tracking and no data broker on this site — so there is no Marketing toggle in the preference panel. We would rather show you nothing than an inert switch that implies otherwise. If that ever changes, this policy and the preference panel will change with it, and you will be asked again.

## 7. Other third parties your browser contacts

These do not store anything on your device through this site, but they are requests to another company and are listed for completeness.

| Provider | Purpose | Notes |
| --- | --- | --- |
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Serves the site's typefaces | Sets no cookies, but your IP address is necessarily visible to Google when the fonts are fetched. **Whether to self-host these instead is a decision worth reviewing** |
| Stripe | Payment processing for project deposits, invoices and monthly plans | Only when you proceed to checkout. Payment happens on Stripe's own hosted page, not on ours, so any cookies Stripe sets are governed by [Stripe's privacy policy](https://stripe.com/privacy) |
| Lemon Squeezy | Digital-product storefront (Merchant of Record) | Only when you buy a digital product. Checkout happens on Lemon Squeezy's own hosted page, not on ours, so any cookies they set are governed by [their privacy policy](https://www.lemonsqueezy.com/privacy) |

## 8. Cookies we cannot remove for you

Withdrawing consent stops us loading a third party and deletes everything we set ourselves. It cannot reach into storage another company has already set on **its own** domain:

- **Google (`_GRECAPTCHA`)** — set on `google.com`. Clear it through your browser's site-data settings, or via Google's own [privacy controls](https://myaccount.google.com/privacy).
- **Stripe** — set on Stripe's checkout domain if you have visited it. See Stripe's privacy policy for their controls.
- **Lemon Squeezy** — set on their storefront/checkout domain if you have bought a digital product. See their privacy policy for their controls.

## 9. How to change or withdraw your consent

Select **"Cookie settings"** in the footer of any page. It is there before you decide, after you accept and after you reject, and it reopens the same panel every time. Withdrawing takes exactly one click, the same as consenting.

You can also clear all site data through your browser's settings, which erases your recorded choice — the notice will then appear again on your next visit.

Your browser also lets you block or delete cookies and storage globally. If you block strictly necessary storage, signing in and checkout will not work.

## 10. Changes to this policy

If we add, remove or change a technology in a way that affects you, we will update this page and the **Last updated** date. Where the change affects an optional category, we also reset recorded choices so you are asked again rather than assumed to agree.

## 11. Contact

Questions about this policy, or any privacy request: **privacy@tychosystem.com**.

See also our [Privacy Policy](/privacy) for how we handle personal data, including email marketing and how to unsubscribe.
