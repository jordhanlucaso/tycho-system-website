import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXABLE } from "@/lib/site";

/**
 * On the demo host this is `Disallow: /`, and that is the point.
 *
 * Every concept here is a speculative redesign of a real, named business that has not
 * commissioned it. Indexed, they would compete with the client's own listing for the
 * client's own brand name and attribute copy to owners who never wrote it. The demo layer
 * and the proposals make it worse, not better.
 *
 * When a concept graduates to the client's own domain, NEXT_PUBLIC_INDEXABLE=true and a
 * real NEXT_PUBLIC_SITE_ORIGIN turn the normal rules back on. See lib/site.ts.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Sales material. Also noindexed at the page level — belt and braces, because a
        // proposal indexed under a client's name is a real commercial problem.
        disallow: ["/proposal"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
