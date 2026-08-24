import type { Metadata } from "next";
import "./globals.css";
import { INDEXABLE, SITE_ORIGIN } from "@/lib/site";

/**
 * Root layout for every client concept on this host.
 *
 * It owns `<html>` and `<body>` and nothing else visual. Each client supplies its own
 * chrome, fonts and stylesheet from its own nested layout, scoped under a single wrapper
 * class (`.eik`, `.sbk`, `.mm`), so three brand systems can share one Next.js app without
 * their `:root` tokens or base element rules overwriting each other.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Tycho Systems — konseptdemo",
    template: "%s",
  },
  description: "Konseptdemoer utviklet av Tycho Systems for lokale bedrifter i Vestfold.",
  // Belt and braces with robots.ts and the per-page robots directive from pageMetadata:
  // these are speculative sites for businesses that have not approved them. See lib/site.ts.
  ...(INDEXABLE ? {} : { robots: { index: false, follow: false, nocache: true } }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb">
      <head>
        {/* Reveal animations must never leave content invisible without JavaScript. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>.reveal,.reveal>*{opacity:1!important;transform:none!important;clip-path:none!important}</style>`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
