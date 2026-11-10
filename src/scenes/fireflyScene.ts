import { rng, TAU } from './util'
import type { SceneFactory } from './util'

interface F { x: number; y: number; vy: number; ph: number; fx: number; pulse: number; po: number; r: number }

/** Warm golden fireflies, glowing on and off, drifting slowly upward. */
export const fireflyScene: SceneFactory = (ctx, env) => {
  const rand = rng(909)
  let W = 0
  let H = 0
  let fs: F[] = []
  const make = (initial: boolean): F => ({
    x: rand() * W, y: initial ? rand() * H : H + 20, vy: -(5 + rand() * 7), ph: rand() * 6.28,
    fx: 0.2 + rand() * 0.3, pulse: 0.25 + rand() * 0.25, po: rand() * 6.28, r: 9 + rand() * 9,
  })
  return {
    resize(w, h) {
      W = w; H = h
      fs = Array.from({ length: env.mobile ? 11 : 22 }, () => make(true))
    },
    frame(t, dt) {
      fs.forEach((f, i) => {
        if (dt > 0) {
          f.y += f.vy * dt
          if (f.y < -20) fs[i] = make(false)
        }
        const x = f.x + Math.sin(t * f.fx + f.ph) * 22
        const glow = Math.pow(Math.max(0, Math.sin(t * f.pulse * TAU * 0.5 + f.po)), 2)
        const a = 0.06 + 0.94 * glow
        const g = ctx.createRadialGradient(x, f.y, 0, x, f.y, f.r * (0.7 + 0.5 * glow))
        g.addColorStop(0, `rgba(255,226,140,${0.85 * a})`)
        g.addColorStop(0.35, `rgba(240,196,96,${0.38 * a})`)
        g.addColorStop(1, 'rgba(230,180,80,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, f.y, f.r * 1.3, 0, TAU); ctx.fill()
        ctx.fillStyle = `rgba(255,246,206,${0.35 + 0.65 * a})`
        ctx.beginPath(); ctx.arc(x, f.y, 1.5, 0, TAU); ctx.fill()
      })
    },
  }
}
