import { marked } from 'marked'
import md from '../../content/legal/terms-of-service.md?raw'
import { LegalLayout } from '../components/layout/LegalLayout'

const html = marked.parse(md, { async: false })

export function Terms() {
  return <LegalLayout title="Terms of Service — Tycho Systems" html={html} />
}
