import type { IconName } from "@/data/calloway-roofing";

/**
 * The whole icon set, inline. No icon library: six service glyphs plus the handful of UI
 * marks the layout needs is not worth a dependency, and inline SVG costs no request and
 * inherits `currentColor` — which is how the accent reaches them.
 */
export type GlyphName =
  | IconName
  | "phone"
  | "mail"
  | "pin"
  | "star"
  | "check"
  | "arrow"
  | "menu"
  | "close"
  | "clock"
  | "shield";

const STROKE: Record<string, string[]> = {
  shingle: ["M2.5 10.5 12 4.5l9.5 6", "M4.5 13.5h15", "M4.5 17h15", "M4.5 20.5h15"],
  storm: [
    "M7.5 15.5a4 4 0 0 1 .6-8A5.5 5.5 0 0 1 18.6 9.4 3.6 3.6 0 0 1 17.8 16H8",
    "M13 15.5l-2.5 4h3L12 23",
  ],
  repair: [
    "M17.5 3.5a4.5 4.5 0 0 0-4.2 6.1L4 18.9a1.9 1.9 0 1 0 2.7 2.7l9.3-9.3a4.5 4.5 0 0 0 5.6-5.7l-2.6 2.6-2.5-.6-.6-2.5 2.6-2.6a4.6 4.6 0 0 0-1-.1Z",
  ],
  metal: ["M2.5 11 12 4.5l9.5 6.5", "M4 20h16", "M5.5 20v-8", "M9.8 20v-8.6", "M14.2 20v-8.6", "M18.5 20v-8"],
  gutter: [
    "M2.5 7.5h13.5",
    "M4 7.5v2.8a2.4 2.4 0 0 0 2.4 2.4h5.7a2.4 2.4 0 0 0 2.4-2.4V7.5",
    "M16 9.8h3.3v9.4",
    "M17.2 21.2h4.3",
  ],
  inspection: ["M9 4.5h6v3H9z", "M15 6h3v14.5H6V6h3", "M8.8 13.2l2.2 2.2 4.2-4.4"],
  siding: ["M3 5.5h18v13H3z", "M3 9.8h18", "M3 14.2h18"],
  flat: ["M2.5 11.5 21.5 8.7", "M4.5 11.8V20h15V9.4", "M4.5 20h15"],
  phone: [
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z",
  ],
  mail: ["M3 6h18v12H3z", "m3.5 7 8.5 6 8.5-6"],
  pin: ["M12 21.5s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z", "M14.6 10.4a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0Z"],
  check: ["m4.5 12.5 5 5 10-11"],
  arrow: ["M4 12h15", "m13 6 6 6-6 6"],
  menu: ["M3.5 7h17", "M3.5 12h17", "M3.5 17h17"],
  close: ["m5.5 5.5 13 13", "M18.5 5.5l-13 13"],
  clock: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", "M12 6.5V12l3.8 2"],
  shield: ["M12 2.8 4.5 6v6c0 4.6 3.2 8 7.5 9.2 4.3-1.2 7.5-4.6 7.5-9.2V6z"],
};

const FILLED: Record<string, string> = {
  star: "m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9z",
};

type IconProps = {
  name: GlyphName;
  className?: string;
  /** Give a label only when the icon is the sole carrier of meaning. */
  title?: string;
};

export function Icon({ name, className = "h-6 w-6", title }: IconProps) {
  const filled = FILLED[name];
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...a11y}>
        <path d={filled} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {(STROKE[name] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default Icon;
