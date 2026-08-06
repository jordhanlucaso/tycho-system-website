/**
 * Prerender the legal pages to static HTML.
 *
 * This is a client-rendered SPA: a request to /terms is rewritten to the empty
 * index.html shell, so crawlers and payment-platform reviewers (and `curl`)
 * see no content. To guarantee real content in the served bytes — without JS —
 * we render the same markdown that the React routes use into standalone HTML
 * files at dist/<route>/index.html, which Vercel serves directly.
 *
 * Run as part of `build` (after `vite build`). Plain JS + node so it runs the
 * same locally and on Vercel without depending on bun being on PATH.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const pages = [
  { md: 'terms-of-service.md', route: 'terms', title: 'Terms of Service — Tycho Systems' },
  { md: 'privacy-policy.md', route: 'privacy', title: 'Privacy Policy — Tycho Systems' },
  { md: 'cookie-policy.md', route: 'cookies', title: 'Cookie Policy — Tycho Systems' },
  { md: 'refund-policy.md', route: 'refunds', title: 'Refund Policy — Tycho Systems' },
]

const FONTS =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap'

function shell(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="robots" content="index,follow" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0B1120; color: #A9B4CC; font-family: 'IBM Plex Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: #6FA8FF; }
  .wrap { max-width: 768px; margin: 0 auto; padding: 0 clamp(20px, 6vw, 48px); }
  header { border-bottom: 1px solid rgba(255,255,255,0.08); }
  header .wrap { display: flex; align-items: center; gap: 11px; padding-top: 16px; padding-bottom: 16px; }
  header .name { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; color: #E9EEF9; letter-spacing: -0.01em; text-decoration: none; }
  main { padding: clamp(48px, 8vw, 96px) 0; }
  .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #6FA8FF; margin-bottom: 16px; }
  h1 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: clamp(30px, 4vw, 46px); line-height: 1.05; letter-spacing: -0.025em; color: #E9EEF9; margin: 0; }
  h2 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 1.5rem; letter-spacing: -0.02em; color: #E9EEF9; margin-top: 2.5rem; }
  h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 1.2rem; color: #E9EEF9; margin-top: 1.5rem; }
  p { margin-top: 0.85rem; line-height: 1.7; color: #C7D0E4; }
  ul { margin-top: 0.85rem; padding-left: 1.5rem; }
  li { margin-top: 0.5rem; line-height: 1.7; color: #C7D0E4; }
  strong { color: #E9EEF9; font-weight: 600; }
  em { color: #93A0BD; }
  code { background: rgba(255,255,255,0.06); border-radius: 0.3rem; padding: 0.1rem 0.4rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.85em; }
  a { text-underline-offset: 4px; }
  table { display: block; overflow-x: auto; width: 100%; margin-top: 1.25rem; border-collapse: collapse; font-size: 0.9rem; -webkit-overflow-scrolling: touch; }
  th, td { padding: 0.6rem 0.85rem; border: 1px solid rgba(255,255,255,0.08); text-align: left; vertical-align: top; line-height: 1.6; color: #C7D0E4; min-width: 8rem; }
  th { background: rgba(255,255,255,0.03); font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #6B7795; white-space: nowrap; }
  footer { border-top: 1px solid rgba(255,255,255,0.08); }
  footer .wrap { display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: center; padding-top: 20px; padding-bottom: 20px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.04em; color: #6B7795; }
</style>
</head>
<body>
<header>
  <div class="wrap">
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11" stroke="#6FA8FF" stroke-width="1.4" />
      <circle cx="13" cy="13" r="5.4" fill="none" stroke="#6FA8FF" stroke-width="1.2" opacity="0.55" />
      <circle cx="16.4" cy="9.6" r="1.7" fill="#E7B85C" />
    </svg>
    <a href="/" class="name">Tycho Systems</a>
  </div>
</header>
<main>
  <div class="wrap">
    <div class="eyebrow">[ Legal ]</div>
    ${body}
  </div>
</main>
<footer>
  <div class="wrap">
    <span style="color:#93A0BD;">&copy; ${new Date().getFullYear()} Tycho Systems</span>
    <span style="flex:1;"></span>
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
    <a href="/cookies">Cookies</a>
    <a href="/refunds">Refunds</a>
    <!-- These pages are static HTML with no JavaScript, so the preference
         panel cannot be opened in place. /#cookie-settings boots the app and
         opens it there. -->
    <a href="/#cookie-settings">Cookie settings</a>
  </div>
</footer>
</body>
</html>
`
}

const dist = resolve(root, 'dist')

for (const page of pages) {
  const source = readFileSync(resolve(root, 'src/content/legal', page.md), 'utf8')
  const body = marked.parse(source, { async: false })
  const outDir = resolve(dist, page.route)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'index.html'), shell(page.title, body), 'utf8')
  console.log(`prerendered /${page.route} -> dist/${page.route}/index.html`)
}
