import { marked } from 'marked'
import md from '../../content/legal/refund-policy.md?raw'
import { LegalLayout } from '../components/layout/LegalLayout'

const html = marked.parse(md, { async: false })

export function Refunds() {
  return <LegalLayout title="Refund Policy — Tycho Systems" html={html} />
}
