import type { CSSProperties } from 'react'

export type HeroVisualVariant = '3D solar system' | '2D orbit'

type HeroVisualProps = {
  variant?: HeroVisualVariant
}

type PlanetProps = {
  /** Orbit period in seconds (also the counter-rotation period). */
  duration: number
  /** Distance from centre, as a top:% on the full-size rotor. */
  top: string
  size: number
  /** Radial-gradient fill of the sphere. */
  gradient: string
  glow: string
}

/**
 * One orbiting body. A full-size rotor spins at `duration`; a nested
 * counter-rotation (reverse, same period) plus `rotateX(-60deg)` keeps the
 * sphere upright and camera-facing as it travels the tilted plane.
 */
function Planet({ duration, top, size, gradient, glow }: PlanetProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        animation: `tycho-spin ${duration}s linear infinite`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            animation: `tycho-spin-rev ${duration}s linear infinite`,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: 'rotateX(-60deg)',
              borderRadius: '50%',
              background: gradient,
              boxShadow: glow,
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ring = (sizePct: string, borderAlpha: number): CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: sizePct,
  height: sizePct,
  transform: 'translate(-50%,-50%)',
  border: `1px solid rgba(111,168,255,${borderAlpha})`,
  borderRadius: '50%',
})

/**
 * The hero "orbital instrument". Default is a CSS-3D solar system; the 2D
 * variant is a flat SVG orbit diagram. Both are decorative (aria-hidden) — the
 * surrounding float and spins are paused via the page's reduced-motion toggle.
 */
export function HeroVisual({ variant = '3D solar system' }: HeroVisualProps) {
  if (variant === '2D orbit') {
    return (
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 420 420"
        style={{ maxWidth: 440 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="tycho-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8DBBFF" />
            <stop offset="100%" stopColor="#3C6FD6" />
          </radialGradient>
        </defs>
        <g stroke="rgba(147,160,189,0.28)" strokeWidth="1">
          <line x1="210" y1="8" x2="210" y2="26" />
          <line x1="210" y1="394" x2="210" y2="412" />
          <line x1="8" y1="210" x2="26" y2="210" />
          <line x1="394" y1="210" x2="412" y2="210" />
        </g>
        <circle cx="210" cy="210" r="190" fill="none" stroke="rgba(111,168,255,0.12)" strokeWidth="1" />
        <circle
          cx="210"
          cy="210"
          r="150"
          fill="none"
          stroke="rgba(111,168,255,0.20)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <circle cx="210" cy="210" r="108" fill="none" stroke="rgba(111,168,255,0.28)" strokeWidth="1" />
        <circle cx="210" cy="210" r="64" fill="none" stroke="rgba(111,168,255,0.34)" strokeWidth="1" />
        <g style={{ transformOrigin: '210px 210px', animation: 'tycho-spin 26s linear infinite' }}>
          <circle cx="210" cy="60" r="6" fill="#E7B85C" />
        </g>
        <g style={{ transformOrigin: '210px 210px', animation: 'tycho-spin-rev 18s linear infinite' }}>
          <circle cx="210" cy="102" r="4" fill="#9CC4FF" />
        </g>
        <g style={{ transformOrigin: '210px 210px', animation: 'tycho-spin 12s linear infinite' }}>
          <circle cx="210" cy="146" r="3" fill="#6FA8FF" />
        </g>
        <circle cx="210" cy="210" r="26" fill="url(#tycho-core)" />
        <circle cx="218" cy="202" r="7" fill="rgba(11,17,32,0.34)" />
        <circle cx="200" cy="216" r="3.4" fill="rgba(11,17,32,0.28)" />
      </svg>
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{ position: 'relative', width: 440, maxWidth: '84vw', aspectRatio: 1, perspective: '1100px' }}
    >
      {/* soft elliptical ground-glow under the system */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '56%',
          width: '64%',
          height: '30%',
          transform: 'translate(-50%,-50%)',
          background:
            'radial-gradient(ellipse at center, rgba(111,168,255,0.20), rgba(111,168,255,0) 70%)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: 'rotateX(60deg)' }}>
        {/* orbit rings */}
        <div style={ring('72.7%', 0.16)} />
        <div style={ring('52.3%', 0.22)} />
        <div style={ring('34%', 0.3)} />

        {/* sun */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 54,
            height: 54,
            transform: 'translate(-50%,-50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 36%, #C7DEFF, #6FA8FF 46%, #2F5DBE)',
            boxShadow: '0 0 34px rgba(111,168,255,0.55), 0 0 70px rgba(111,168,255,0.22)',
          }}
        />

        {/* outer planet (gold) @30s */}
        <Planet
          duration={30}
          top="13.6%"
          size={20}
          gradient="radial-gradient(circle at 32% 30%, #F6DA92, #E7B85C 55%, #9C6B1E)"
          glow="0 0 14px rgba(231,184,92,0.5)"
        />
        {/* mid planet (azure) @20s */}
        <Planet
          duration={20}
          top="23.9%"
          size={13}
          gradient="radial-gradient(circle at 32% 30%, #D8E8FF, #6FA8FF 55%, #3157A8)"
          glow="0 0 10px rgba(111,168,255,0.45)"
        />
        {/* inner planet (azure) @12s */}
        <Planet
          duration={12}
          top="33%"
          size={9}
          gradient="radial-gradient(circle at 32% 30%, #CFE2FF, #6FA8FF 60%, #2C50A0)"
          glow="0 0 8px rgba(111,168,255,0.4)"
        />
      </div>
    </div>
  )
}
