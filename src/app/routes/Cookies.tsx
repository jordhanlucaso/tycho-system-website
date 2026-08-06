import { marked } from 'marked'
import md from '../../content/legal/cookie-policy.md?raw'
import { LegalLayout } from '../components/layout/LegalLayout'

const html = marked.parse(md, { async: false })

export function Cookies() {
  return <LegalLayout title="Cookie Policy — Tycho Systems" html={html} />
}
