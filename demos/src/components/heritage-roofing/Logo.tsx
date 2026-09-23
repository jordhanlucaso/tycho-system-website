import { siteConfig } from "@/data/heritage-roofing";

/**
 * Text wordmark plus a drawn roofline mark.
 *
 * No logo could be attributed to this business — see research §3 — and the brief is
 * explicit that another Heritage Roofing's mark must not be borrowed. So this is a
 * deliberate placeholder identity, and it is one component: when the real logo arrives,
 * replace the <svg> with an <Image> and the wordmark with nothing.
 *
 * The mark is a 4:12 pitch line over two courses, which is the same geometry as the
 * `.hr-roofline` divider used through the site.
 */
export default function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 34 26"
        className={`h-7 w-9 flex-none ${onDark ? "text-hr-brass-glow" : "text-hr-brass-ink"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12.5 17 2.5l15 10" />
        <path d="M6 15.5 17 8l11 7.5" />
        <path d="M10 18.5 17 14l7 4.5" />
      </svg>
      <span className="leading-none">
        <span
          className={`block font-hr-display text-[1.05rem] font-extrabold tracking-[0.02em] ${
            onDark ? "text-white" : "text-hr-ink"
          }`}
        >
          HERITAGE
        </span>
        <span
          className={`mt-0.5 block text-[0.6rem] font-semibold tracking-[0.22em] ${
            onDark ? "text-hr-muted" : "text-hr-ink-soft"
          }`}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
