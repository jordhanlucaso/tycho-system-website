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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
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
