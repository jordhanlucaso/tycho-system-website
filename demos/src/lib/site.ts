/**
 * Single source of truth for the deployment origin and for whether this deployment may be
 * indexed at all.
 *
 * Every canonical, OpenGraph URL and JSON-LD `@id` derives from `SITE_ORIGIN`. On handover
 * a client's concept moves to their own apex domain and only these two variables change.
 */

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/$/, "") ?? "https://demo.tychosystem.com";

/**
 * Indexing is opt-in, and the safe state is the default.
 *
 * These are speculative redesigns of real, named businesses that have not commissioned or
 * approved them. Indexed under demo.tychosystem.com they would compete with the client's own
 * listing for their own brand name, and put words the owner never said in front of their
 * customers. So the demo host serves `Disallow: /`, a page-level `noindex` on every route,
 * and an empty sitemap.
 *
 * The SEO architecture itself is unaffected and stays fully inspectable in view-source —
 * canonicals, structured data and the sitemap generator all still run. Setting
 * NEXT_PUBLIC_INDEXABLE=true alongside a real NEXT_PUBLIC_SITE_ORIGIN is what turns the
 * whole thing on, and that flip belongs to the client's launch, not to a sales demo.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export function absoluteUrl(path: string): string {
  if (path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
