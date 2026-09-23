import type { NextConfig } from "next";

/**
 * Heritage Roofing does not live in this app any more.
 *
 * It was rebuilt in the standalone Vite platform (`tycho-demos`) after the original demo
 * turned out to be built around a different company of a similar name. The concept was
 * retired from here so the incorrect version cannot be served — but the URL a prospect is
 * emailed is still demo.tychosystem.com/heritage-roofing, so this host proxies that path
 * to the new deployment.
 *
 * Set `HERITAGE_DEMO_ORIGIN` on the Vercel project to the tycho-demos deployment origin,
 * e.g. https://tycho-demos.vercel.app. Unset, the rewrite is simply not registered and
 * /heritage-roofing 404s here — which is the correct behaviour, because serving the old
 * version would be worse than serving nothing.
 */
const heritageOrigin = process.env.HERITAGE_DEMO_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this Turbopack walks up past the repo and picks up an
  // unrelated lockfile in the parent directory.
  turbopack: {
    root: __dirname,
  },

  async rewrites() {
    if (!heritageOrigin) return [];
    return [
      { source: "/heritage-roofing", destination: `${heritageOrigin}/heritage-roofing` },
      {
        source: "/heritage-roofing/:path*",
        destination: `${heritageOrigin}/heritage-roofing/:path*`,
      },
    ];
  },
};

export default nextConfig;
