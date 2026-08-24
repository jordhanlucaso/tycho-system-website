import type { Metadata } from "next";
import { absoluteUrl, INDEXABLE } from "./site";

interface PageMetaInput {
  /** 50–60 chars. Service + city first, brand last. */
  title: string;
  /** 140–160 chars. Ad copy, not a ranking factor. */
  description: string;
  /** Absolute path, e.g. "/eik/piercing". Becomes canonical + og:url. */
  path: string;
  siteName: string;
  /** Set on any route that must never be indexed (demo hubs, proposal, thank-you). */
  noindex?: boolean;
}

/**
 * Builds per-route metadata with a self-referencing canonical.
 *
 * Every commercial route gets a unique title and description — duplicated metadata
 * across routes actively suppresses the weaker page.
 *
 * `noindex` marks routes that must never be indexed *wherever* they are hosted. On top of
 * that, the whole deployment is forced to noindex unless INDEXABLE is explicitly on, which
 * is what keeps three speculative client concepts off Google while they live on
 * demo.tychosystem.com. See lib/site.ts.
 */
export function pageMetadata({
  title,
  description,
  path,
  siteName,
  noindex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "nb_NO",
      siteName,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex || !INDEXABLE
      ? { robots: { index: false, follow: false, nocache: true } }
      : { robots: { index: true, follow: true } }),
  };
}
