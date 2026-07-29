/**
 * Generate the lead-magnet PDFs from their Markdown sources.
 *
 *   node scripts/generate-resource-pdfs.mjs
 *
 * Renders src/content/resources/*.md to styled HTML (marked + print CSS) in a
 * temp directory, then prints each to PDF with headless Chrome/Chromium —
 * the least invasive method available: no new npm dependencies, and the
 * output contains real selectable text. Final PDFs land in public/downloads/
 * (committed); the intermediate HTML stays in the OS temp dir.
 *
 * Requires a Chrome/Chromium binary (CHROME_BIN overrides autodetection).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const docs = [
  {
    md: 'ai-operations-pain-map.md',
    out: 'tycho-ai-operations-pain-map.pdf',
    lang: 'en',
  },
  {
    md: 'practical-ai-dictionary.md',
    out: 'tycho-practical-ai-dictionary.pdf',
    lang: 'en',
    // Reference document read entry-by-entry — roomier type than the guide.
    extraCss: 'html { font-size: 12pt; } body { line-height: 1.8; } p { margin-bottom: 5mm; }',
  },
]

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]
  const found = candidates.find((c) => existsSync(c))
  if (!found) {
    console.error('No Chrome/Chromium found. Set CHROME_BIN to a browser binary.')
    process.exit(1)
  }
  return found
}

// Print-friendly rendition of the Web Observatory identity: light paper,
// azure/gold accents, real text throughout (accessibility requirement).
const CSS = `
  :root {
    --ink: #16203a;
    --body: #2c3a5c;
    --muted: #5a6784;
    --azure: #2f5dbe;
    --gold: #9c6b1e;
    --hairline: #d7ddeb;
  }
  * { box-sizing: border-box; }
  @page { size: A4; margin: 22mm 19mm; }
  html { font-size: 10.6pt; }
  body {
    margin: 0;
    font-family: 'IBM Plex Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: var(--body);
    line-height: 1.62;
  }
  h1, h2, h3 { font-family: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif; color: var(--ink); line-height: 1.15; }
  h1 { font-size: 27pt; letter-spacing: -0.02em; margin: 42mm 0 8mm; }
  h1 + h2 { font-size: 13.5pt; font-weight: 500; color: var(--muted); letter-spacing: 0; margin: 0 0 10mm; }
  h2 { font-size: 16pt; letter-spacing: -0.01em; margin: 0 0 5mm; padding-bottom: 2.5mm; border-bottom: 1.5pt solid var(--azure); }
  h3 { font-size: 12pt; margin: 7mm 0 2.5mm; color: var(--azure); page-break-after: avoid; }
  p { margin: 0 0 3.2mm; }
  strong { color: var(--ink); }
  em { color: var(--muted); }
  ul, ol { margin: 0 0 3.2mm; padding-left: 5.5mm; }
  li { margin-bottom: 1.4mm; }
  hr { border: 0; height: 0; margin: 0; page-break-after: always; }
  table { width: 100%; border-collapse: collapse; margin: 4mm 0; font-size: 9.6pt; page-break-inside: avoid; }
  th { text-align: left; font-family: 'Space Grotesk', sans-serif; color: var(--ink); border-bottom: 1.5pt solid var(--azure); padding: 2mm 2.5mm; }
  td { border-bottom: 0.5pt solid var(--hairline); padding: 2mm 2.5mm; vertical-align: top; }
  code { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 0.9em; background: #eef1f8; border-radius: 2pt; padding: 0 1.2mm; }
  a { color: var(--azure); text-decoration: none; }
  /* Cover block: everything before the first page break */
  h1:first-of-type { border: 0; }
  body > p:nth-of-type(1) strong { color: var(--gold); font-weight: 600; }
`

function shell(title, body, lang, extraCss = '') {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>${CSS}${extraCss}</style>
</head>
<body>
${body}
</body>
</html>`
}

const chrome = findChrome()
const outDir = resolve(root, 'public/downloads')
mkdirSync(outDir, { recursive: true })
const tmp = mkdtempSync(join(tmpdir(), 'tycho-pdf-'))

try {
  for (const doc of docs) {
    const source = readFileSync(resolve(root, 'src/content/resources', doc.md), 'utf8')
    const title = (source.match(/^# (.+)$/m) ?? [, doc.out])[1]
    const body = marked.parse(source, { async: false })
    const htmlPath = join(tmp, doc.md.replace(/\.md$/, '.html'))
    writeFileSync(htmlPath, shell(title, body, doc.lang, doc.extraCss), 'utf8')

    const pdfPath = resolve(outDir, doc.out)
    execFileSync(
      chrome,
      [
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdfPath}`,
        `file://${htmlPath}`,
      ],
      { stdio: 'pipe' }
    )
    console.log(`generated ${doc.out}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
