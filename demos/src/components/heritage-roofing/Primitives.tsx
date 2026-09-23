import Link from "next/link";
import type { ReactNode } from "react";

/** The pitched divider. Inherits colour from `.hr-roofline`. */
export function Roofline({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`hr-roofline ${className}`}
      viewBox="0 0 1200 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M0 9 600 1l600 8" />
    </svg>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="hr-eyebrow">{children}</p>;
}

/** Section shell. `tone` picks the ground; every colour pair was checked against AA. */
export function Section({
  children,
  tone = "paper",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "paper" | "paper-alt" | "slate" | "green";
  id?: string;
  className?: string;
}) {
  const grounds = {
    paper: "bg-hr-paper text-hr-ink",
    "paper-alt": "bg-hr-paper-alt text-hr-ink",
    slate: "hr-dark hr-shingles bg-hr-slate text-white",
    green: "hr-dark hr-shingles bg-hr-green text-white",
  } as const;

  return (
    <section id={id} className={`${grounds[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        {children}
      </div>
    </section>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** `solid` is the estimate CTA. One per screen — it is the page's single loudest thing. */
  variant?: "solid" | "outline" | "outline-dark";
  className?: string;
};

export function Button({ href, children, variant = "solid", className = "" }: ButtonProps) {
  const base =
    "inline-flex min-h-[52px] items-center justify-center gap-2 px-6 text-[0.82rem] font-bold uppercase tracking-[0.1em] transition-colors";
  const variants = {
    solid: "bg-hr-brass-solid text-white hover:bg-hr-brass-hover",
    outline: "border-2 border-hr-ink text-hr-ink hover:bg-hr-ink hover:text-white",
    "outline-dark": "border-2 border-white/45 text-white hover:border-white hover:bg-white/10",
  } as const;

  const cls = `${base} ${variants[variant]} ${className}`;

  // A tel: link is not a route — it has to be a plain anchor. Handing it to <Link>
  // produces an href the router tries to resolve against the current path.
  return href.startsWith("tel:") ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
