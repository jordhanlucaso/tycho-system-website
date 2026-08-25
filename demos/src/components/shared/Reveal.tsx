"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Scroll-entry reveal. One IntersectionObserver per element, disconnected on first hit —
 * cheaper than a shared observer with a registry, and there are never more than ~20 per page.
 *
 * The visual expression is set entirely by CSS custom properties, so Eik gets a 200ms
 * fade-rise and Stabukk gets a 520ms clip-path print wipe from the same component.
 * `prefers-reduced-motion` is handled in globals.css, not here, so it also covers the
 * no-JS `<noscript>` path.
 *
 * The observer on its own is not enough, and the failure is the worst kind: a reveal that
 * never fires leaves real content at `opacity: 0` for the life of the page. Both ways it
 * happens are ordinary browsing, not edge cases:
 *
 *  1. Scroll restoration. Reload while scrolled down and the browser puts the viewport back
 *     *after* this effect has run. Everything the jump skipped was never intersected, and
 *     everything now above the viewport never will be — scrolling back up gives you a page
 *     of blank sections.
 *  2. bfcache restore, which replays that jump without a fresh mount.
 *
 * So geometry is also checked directly: once on the frame after mount, which is where scroll
 * restoration lands, and again on `pageshow`. Anything already at or past the reveal line is
 * shown without waiting for an intersection.
 */
export function Reveal({
  as: Tag = "div",
  children,
  delay = 0,
  className = "",
  style,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Write the attribute straight to the DOM rather than through state: this is a
      // last-resort fallback that must never leave content invisible, and it has no
      // reason to schedule a render.
      node.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      // threshold 0, not a fraction: a reveal taller than the viewport can never reach a
      // fractional threshold, and where the reveal fires is already decided by rootMargin.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    observer.observe(node);

    /** Has the element's top crossed the reveal line, or is it already scrolled past it? */
    const reached = () => ref.current!.getBoundingClientRect().top < window.innerHeight * 0.92;

    const settle = () => {
      if (!ref.current) return;
      if (reached()) {
        setShown(true);
        observer.disconnect();
      }
    };

    const frame = requestAnimationFrame(settle);
    window.addEventListener("pageshow", settle);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", settle);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-shown={shown ? "true" : "false"}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
