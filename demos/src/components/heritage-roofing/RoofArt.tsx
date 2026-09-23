/**
 * The hero backdrop, drawn rather than photographed.
 *
 * There is no photography of this company's work, and the roofing template's stock files
 * are generated placeholder graphics with "PLACEHOLDER — HERO" set across them in another
 * client's navy. Both routes to a photographic hero were therefore closed: one would be a
 * fabrication, the other looks broken.
 *
 * So the first screen is built from the trade's own geometry — overlapping roof planes at
 * a 4:12 pitch, courses of shingles, a ridge line. It costs no request, needs no licence,
 * and cannot be mistaken for a photograph of a house this business has worked on.
 *
 * When Heritage supplies real photography this becomes the fallback behind it: drop an
 * <Image> in Hero.tsx above this element and it keeps the ground dark if the photo fails.
 */
export default function RoofArt() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Courses of shingles, clipped to the planes below. */}
        <pattern id="hr-course" width="64" height="26" patternUnits="userSpaceOnUse">
          <rect width="64" height="26" fill="none" />
          <path d="M0 25.5h64" stroke="rgba(245,242,236,.07)" strokeWidth="1" />
          <path d="M0 0v25.5M32 0v25.5" stroke="rgba(245,242,236,.05)" strokeWidth="1" />
        </pattern>
        <pattern
          id="hr-course-offset"
          width="64"
          height="26"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(32 13)"
        >
          <path d="M0 25.5h64" stroke="rgba(245,242,236,.06)" strokeWidth="1" />
          <path d="M0 0v25.5M32 0v25.5" stroke="rgba(245,242,236,.04)" strokeWidth="1" />
        </pattern>

        <linearGradient id="hr-plane-a" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#2b3436" />
          <stop offset="100%" stopColor="#1b2223" />
        </linearGradient>
        <linearGradient id="hr-plane-b" x1="0.2" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#222a2b" />
          <stop offset="100%" stopColor="#161c1d" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="#171d1e" />

      {/* Far plane — the neighbour's roof, low and cool. */}
      <g>
        <path d="M760 470 1130 300l470 215v385H760Z" fill="url(#hr-plane-b)" />
        <path d="M760 470 1130 300l470 215v385H760Z" fill="url(#hr-course-offset)" />
        <path d="M760 470 1130 300l470 215" fill="none" stroke="rgba(245,242,236,.14)" strokeWidth="2" />
      </g>

      {/* Near plane — the main roof, catching the light along the ridge. */}
      <g>
        <path d="M600 620 1010 395l590 290v215H600Z" fill="url(#hr-plane-a)" />
        <path d="M600 620 1010 395l590 290v215H600Z" fill="url(#hr-course)" />
        <path
          d="M600 620 1010 395l590 290"
          fill="none"
          stroke="rgba(245,242,236,.22)"
          strokeWidth="2.5"
        />
        {/* Ridge highlight in brass — the one warm line in the whole composition. */}
        <path d="M1010 395 1600 685" fill="none" stroke="#b5872f" strokeOpacity=".5" strokeWidth="2" />
      </g>

      {/* Fascia and a gutter run along the near eave — the second verified trade. */}
      <path d="M600 620h1000" stroke="rgba(245,242,236,.10)" strokeWidth="6" fill="none" />
      <path d="M600 631h1000" stroke="rgba(181,135,47,.28)" strokeWidth="3" fill="none" />
    </svg>
  );
}
