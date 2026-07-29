import { useEffect } from 'react'
import { site } from '../../config/site'

type SeoInput = {
  title: string
  description: string
  /** Path beginning with "/" used for the canonical URL. */
  path: string
  /** Pages that should not be indexed (thank-you pages). */
  noindex?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-route SEO for the SPA: document title, meta description, canonical URL,
 * Open Graph and Twitter card tags. Values reset on every route that uses the
 * hook, so stale tags never linger between client-side navigations.
 */
export function useSeo({ title, description, path, noindex = false }: SeoInput): void {
  useEffect(() => {
    document.title = title
    const canonical = `${site.siteUrl}${path === '/' ? '/' : path}`

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
    upsertCanonical(canonical)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', site.agencyName)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
  }, [title, description, path, noindex])
}
