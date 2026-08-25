import type { MetadataRoute } from "next";
import { CLIENT_ROUTES } from "@/data/engagements";
import { absoluteUrl, INDEXABLE } from "@/lib/site";

/**
 * Canonical, indexable 200s only. The hub (`/`) and everything under `/proposal` are
 * deliberately absent — all noindex, and listing a noindex URL in a sitemap is a
 * contradictory signal.
 *
 * On the demo host the whole file is empty, because nothing here may be indexed at all
 * (see lib/site.ts). The generator still runs and the route list is the real one, derived
 * from the engagement registry, so the day a concept moves to the client's own domain its
 * sitemap is already correct.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];

  const lastModified = new Date();
  return CLIENT_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
