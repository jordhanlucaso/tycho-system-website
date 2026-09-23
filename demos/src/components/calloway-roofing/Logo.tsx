type LogoProps = {
  businessName: string;
  /** Omitted in the footer, where the name alone carries it. */
  tagline?: string;
  size?: "sm" | "md";
};

/**
 * Accent rounded square, white triangle, name in Archivo. The mark is the only place the
 * accent appears in the header, which is what makes a re-skin read instantly.
 */
export function Logo({ businessName, tagline, size = "md" }: LogoProps) {
  const box = size === "sm" ? "h-9 w-9 rounded-[10px]" : "h-11 w-11 rounded-xl";
  const name = size === "sm" ? "text-base" : "text-lg sm:text-xl";

  return (
    <span className="flex items-center gap-3">
      <span
        className={`${box} grid shrink-0 place-items-center bg-[var(--cr-accent)]`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="var(--cr-accent-solid-fg)">
          <path d="M12 5.5 21 18.5H3z" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`${name} font-cr-display font-extrabold tracking-[-0.02em] text-white`}>
          {businessName}
        </span>
        {tagline ? (
          <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-white/55">
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default Logo;
