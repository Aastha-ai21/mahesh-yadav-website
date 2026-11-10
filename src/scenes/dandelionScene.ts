import { rng, TAU } from './util'
import type { SceneFactory } from './util'

interface Seed {
  x: number; y: number; vy: number; vx: number; ph: number; fx: number
  size: number; tilt: number; a: number
}

/** Dandelion seeds (pappus parachutes) drifting up on the wind. */
export const dandelionScene: SceneFactory = (ctx, env) => {
  const r = rng(303)
  let W = 0
  let H = 0
  let seeds: Seed[] = []
  const make = (initial: boolean): Seed => ({
    x: initial ? r() * W : -20 + r() * W * 0.6,
    y: initial ? r() * H : H + 30,
    vy: -(9 + r() * 10), vx: 6 + r() * 8, ph: r() * 6.28, fx: 0.3 + r() * 0.3,
    size: 0.8 + r() * 0.7, tilt: (r() - 0.5) * 0.7, a: 0.55 + r() * 0.35,
  })
  return {
    resize(w, h) {
      W = w; H = h
      seeds = Array.from({ length: env.mobile ? 7 : 13 }, () => make(true))
    },
    frame(t, dt) {
      seeds.forEach((s, i) => {
        if (dt > 0) {
          s.y += s.vy * dt
          s.x += (s.vx + Math.sin(t * 0.4 + s.ph) * 5) * dt
          if (s.y < -50 || s.x > W + 50) seeds[i] = make(false)
        }
        const sx = s.x + Math.sin(t * s.fx + s.ph) * 10
        const rot = s.tilt + Math.sin(t * 0.6 + s.ph) * 0.25
        ctx.save()
        ctx.translate(sx, s.y)
        ctx.rotate(rot)
        ctx.scale(s.size, s.size)
        ctx.globalAlpha = s.a
        // soft pappus glow
        const g = ctx.createRadialGradient(0, -14, 0, 0, -14, 17)
        g.addColorStop(0, 'rgba(255,255,255,0.85)')
        g.addColorStop(0.6, 'rgba(255,255,255,0.35)')
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(0, -14, 17, 0, TAU); ctx.fill()
        // filaments fanning above the beak
        ctx.strokeStyle = 'rgba(120,138,112,0.55)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        for (let k = -9; k <= 9; k++) {
          const a = -Math.PI / 2 + k * 0.16
          const len = 15 + Math.cos(k * 0.17) * 2
          ctx.moveTo(0, -5)
          ctx.quadraticCurveTo(Math.cos(a) * len * 0.5, -5 + Math.sin(a) * len * 0.62, Math.cos(a) * len, -5 + Math.sin(a) * len)
        }
        ctx.stroke()
        // tiny tuft nodes at filament tips
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        for (let k = -9; k <= 9; k += 2) {
          const a = -Math.PI / 2 + k * 0.16
          const len = 15 + Math.cos(k * 0.17) * 2
          ctx.beginPath(); ctx.arc(Math.cos(a) * len, -5 + Math.sin(a) * len, 0.9, 0, TAU); ctx.fill()
        }
        // stalk and seed
        ctx.strokeStyle = 'rgba(110,125,100,0.7)'
        ctx.lineWidth = 0.7
        ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 6); ctx.stroke()
        ctx.fillStyle = 'rgba(120,100,70,0.75)'
        ctx.beginPath(); ctx.ellipse(0, 8, 0.9, 2.4, 0, 0, TAU); ctx.fill()
        ctx.restore()
      })
    },
  }
}
