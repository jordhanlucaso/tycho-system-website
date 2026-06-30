import { useEffect, useRef } from 'react'

export type StarfieldDensity = 'Dense' | 'Balanced' | 'Sparse' | 'Off'

type StarfieldProps = {
  density?: StarfieldDensity
  /** When false (or reduced-motion), draws a single static frame — no twinkle. */
  animate?: boolean
  className?: string
}

type Star = {
  x: number
  y: number
  r: number
  a: number
  tw: number
  sp: number
  gold: boolean
}

// Values are area-per-star divisors: a smaller divisor yields more stars.
const DENSITY: Record<StarfieldDensity, number> = {
  Dense: 5500,
  Balanced: 8500,
  Sparse: 14000,
  Off: 0,
}

/**
 * Full-bleed twinkling starfield drawn to a <canvas>, sized to its container.
 * DPR-aware, rebuilds on resize. ~10% of stars are gold ("fixed stars"), the
 * rest azure. The rAF twinkle loop stops when `animate` is false (reduced
 * motion), leaving one static frame.
 */
export function Starfield({ density = 'Balanced', animate = true, className }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let stars: Star[] = []
    let raf = 0

    const divisor = DENSITY[density]

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = divisor ? Math.max(30, Math.round((w * h) / divisor)) : 0
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.5 + 0.18,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.9 + 0.25,
        gold: Math.random() < 0.1,
      }))
    }

    const paint = (t: number, twinkle: boolean) => {
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = twinkle ? s.a + Math.sin((t / 1000) * s.sp + s.tw) * 0.2 : s.a
        ctx.globalAlpha = Math.max(0, Math.min(1, a))
        ctx.fillStyle = s.gold ? '#E7B85C' : '#9CC4FF'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      paint(t, true)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      if (animate && divisor) {
        raf = requestAnimationFrame(loop)
      } else {
        paint(0, false)
      }
    }

    const rebuild = () => {
      build()
      start()
    }

    build()
    start()

    window.addEventListener('resize', rebuild)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', rebuild)
    }
  }, [density, animate])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
