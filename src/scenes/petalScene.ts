import { drawLeaf, drawPetal, rng, TAU } from './util'
import type { SceneFactory } from './util'

interface P {
  x: number; y: number; vy: number; amp: number; fx: number; ph: number
  rot: number; vr: number; flip: number; vf: number; size: number; petal: boolean; tone: number
}

/** Lotus petals and leaves falling slowly, turning and flipping in 3D. */
export const petalScene: SceneFactory = (ctx, env) => {
  const r = rng(77)
  let W = 0
  let H = 0
  let ps: P[] = []
  const make = (initial: boolean, i: number): P => {
    const petal = i % 5 < 3
    return {
      x: r() * W, y: initial ? r() * H : -40 - r() * 80, vy: 14 + r() * 14, amp: 18 + r() * 26,
      fx: 0.25 + r() * 0.3, ph: r() * 6.28, rot: r() * TAU, vr: (r() - 0.5) * 0.5,
      flip: r() * TAU, vf: 0.5 + r() * 0.5, size: petal ? 24 + r() * 14 : 20 + r() * 12, petal, tone: r(),
    }
  }
  return {
    resize(w, h) {
      W = w; H = h
      const n = env.mobile ? 9 : 16
      ps = Array.from({ length: n }, (_, i) => make(true, i))
    },
    frame(t, dt) {
      ps.forEach((p, i) => {
        if (dt > 0) {
          p.y += p.vy * dt
          p.rot += p.vr * dt
          p.flip += p.vf * dt
          if (p.y > H + 50) ps[i] = make(false, i)
        }
        const x = p.x + Math.sin(t * p.fx + p.ph) * p.amp
        const f = Math.cos(p.flip)
        ctx.save()
        ctx.translate(x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(1, Math.max(0.12, Math.abs(f)) * Math.sign(f || 1))
        ctx.translate(-p.size * 0.5, 0)
        ctx.globalAlpha = 0.55 + 0.35 * Math.abs(f)
        if (p.petal) {
          drawPetal(ctx, p.size, p.size * 0.34, 'rgba(255,248,248,0.95)', p.tone > 0.5 ? 'rgba(232,160,178,0.95)' : 'rgba(240,184,198,0.95)')
        } else {
          drawLeaf(ctx, p.size, p.size * 0.3, 'rgba(112,150,98,0.95)', p.tone > 0.5 ? 'rgba(168,190,120,0.9)' : 'rgba(150,186,134,0.9)')
        }
        ctx.restore()
      })
    },
  }
}
