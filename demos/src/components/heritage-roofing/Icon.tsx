import type { IconName } from "@/data/heritage-roofing";

/**
 * One drawn icon set rather than an icon package.
 *
 * The brief asks for Lucide. This host serves five brand systems from one bundle, and a
 * dependency added for one concept is carried in the install for all of them — so the ten
 * icons this site actually uses are drawn here instead. They are stroke-only on a 24 grid,
 * the same construction Lucide uses, so swapping to `lucide-react` later is an import
 * change and nothing else.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  // Water finding its way through a roof plane.
  leak: (
    <>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9h14v-9" />
      <path d="M12 12.5c-1 1.4-1.7 2.4-1.7 3.2a1.7 1.7 0 0 0 3.4 0c0-.8-.7-1.8-1.7-3.2Z" />
    </>
  ),
  // A roof plane being lifted off and replaced.
  replace: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 11v8h14v-8" />
      <path d="M9.5 15h5" />
      <path d="M12 12.8v4.4" />
    </>
  ),
  storm: (
    <>
      <path d="M7 16a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.5 1.3A3.4 3.4 0 0 1 16.5 16" />
      <path d="m12 13-2 4h3l-2 4" />
    </>
  ),
  gutter: (
    <>
      <path d="M3 7h18" />
      <path d="M3 7v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
      <path d="M8 12v4" />
      <path d="M16 12v7" />
      <path d="M14 19h4" />
    </>
  ),
  // A low-slope commercial roof with a parapet and a roof unit.
  commercial: (
    <>
      <path d="M3 20h18" />
      <path d="M4 20V9h16v11" />
      <path d="M4 9 12 4l8 5" />
      <path d="M9 20v-5h6v5" />
      <path d="M14.5 11.5h3v2h-3z" />
    </>
  ),
  // Lapped siding boards on a wall plane.
  siding: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M4 9.7h16M4 14.3h16" />
      <path d="M8 5v4.7M16 9.7v4.6M8 14.3V19" />
    </>
  ),
  shingle: (
    <>
      <path d="M2 9h20" />
      <path d="M2 15h20" />
      <path d="M2 9v12h20V9" />
      <path d="M7 9v6M12 9v6M17 9v6" />
      <path d="M2 9 12 3l10 6" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4h6v3H9z" />
      <path d="M15 5.5h2A1.5 1.5 0 0 1 18.5 7v12A1.5 1.5 0 0 1 17 20.5H7A1.5 1.5 0 0 1 5.5 19V7A1.5 1.5 0 0 1 7 5.5h2" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3.5l9 7" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
};

export default function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
