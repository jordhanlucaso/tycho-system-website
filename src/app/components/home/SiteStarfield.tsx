import { useEffect, useRef } from 'react'

type SiteStarfieldProps = {
  /** When false (or reduced-motion), draws a single static frame — no rotation. */
  animate?: boolean
  /** Number of points in the sphere. */
  count?: number
}

type Point = { x: number; y: number; z: number; gold: boolean }

/**
 * Site-wide background: a slowly rotating 3D sphere of points projected to a
 * fixed, full-viewport <canvas> that sits behind all page content (z-index -1).
 * Dependency-free (no three.js). Points are distributed in a sphere, rotated on
 * two axes each frame and drawn with perspective so nearer stars are larger and
 * brighter. Azure with ~8% gold "fixed stars". The rAF loop stops when `animate`
 * is false (reduced motion), leaving one static frame. The page background
 * colour (body → --bg-primary) shows through the transparent canvas.
 */
export function SiteStarfield({ animate = true, count = 2600 }: SiteStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    // Accumulated rotation angles (radians). Speeds mirror the reference
    // (rotation.x -= delta/10, rotation.y -= delta/15).
    let rx = 0
    let ry = 0
    // Constant tilt of the whole field, like the reference's z = PI/4.
    const TILT = Math.PI / 4
    const sinTilt = Math.sin(TILT)
    const cosTilt = Math.cos(TILT)

    // Points uniformly inside a unit sphere (rejection sampling).
    const points: Point[] = []
    while (points.length < count) {
      const x = Math.random() * 2 - 1
      const y = Math.random() * 2 - 1
      const z = Math.random() * 2 - 1
      if (x * x + y * y + z * z > 1) continue
      points.push({ x, y, z, gold: Math.random() < 0.08 })
    }

    const CAM_Z = 2.6 // camera distance; points sit within [-1, 1] on z

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = () => {
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      // Radius of the projected sphere on screen — keyed to the larger side so
      // the field spans the full width of the viewport.
      const scale = Math.max(w, h) * 0.72
      const sinX = Math.sin(rx)
      const cosX = Math.cos(rx)
      const sinY = Math.sin(ry)
      const cosY = Math.cos(ry)

      for (const p of points) {
        // Rotate around Y, then X.
        const x1 = p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        const y1 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX
        // Constant screen-space tilt.
        const xt = x1 * cosTilt - y1 * sinTilt
        const yt = x1 * sinTilt + y1 * cosTilt
        // Perspective projection.
        const persp = CAM_Z / (CAM_Z - z2)
        const sx = cx + xt * persp * scale
        const sy = cy + yt * persp * scale
        // Depth 0 (far) → 1 (near) for size/alpha attenuation.
        const depth = (z2 + 1) / 2
        const r = 0.5 + depth * 1.3
        const alpha = 0.1 + depth * 0.5
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
        ctx.fillStyle = p.gold ? '#E7B85C' : '#9CC4FF'
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      const delta = last ? (t - last) / 1000 : 0
      last = t
      ry -= delta / 15
      rx -= delta / 10
      paint()
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = 0
      if (animate) {
        raf = requestAnimationFrame(loop)
      } else {
        paint()
      }
    }

    const rebuild = () => {
      resize()
      if (!animate) paint()
    }

    resize()
    start()

    window.addEventListener('resize', rebuild)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', rebuild)
    }
  }, [animate, count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  )
}
