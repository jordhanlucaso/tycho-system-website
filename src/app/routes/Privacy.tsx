import { marked } from 'marked'
import md from '../../content/legal/privacy-policy.md?raw'
import { LegalLayout } from '../components/layout/LegalLayout'

const html = marked.parse(md, { async: false })

export function Privacy() {
  return <LegalLayout title="Privacy Policy — Tycho Systems" html={html} />
}
