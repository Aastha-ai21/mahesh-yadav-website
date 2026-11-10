import { rng } from './util'
import type { SceneFactory, Ctx } from './util'

interface Bird { x: number; y: number; v: number; s: number; ph: number; bob: number; flapAt: number; a: number }

/** Wing path for one side; `lift` is the wing angle (-1 down … 1 up). */
function wing(ctx: Ctx, side: 1 | -1, L: number, lift: number) {
  const tipY = -lift * L * 0.55
  ctx.beginPath()
  ctx.moveTo(0, -L * 0.04)
  ctx.bezierCurveTo(side * L * 0.3, -L * 0.28 - lift * L * 0.12, side * L * 0.75, tipY - L * 0.1, side * L, tipY + L * 0.04)
  ctx.bezierCurveTo(side * L * 0.7, tipY + L * 0.04 + L * 0.06, side * L * 0.35, L * 0.02 - lift * L * 0.02, 0, L * 0.06)
  ctx.closePath()
  ctx.fill()
}

/** Distant soft bird silhouettes, gliding mostly with an occasional slow flap. */
export const birdScene: SceneFactory = (ctx, env) => {
  const r = rng(404)
  let W = 0
  let H = 0
  let birds: Bird[] = []
  const make = (i: number, initial: boolean): Bird => ({
    x: initial ? r() * W : -60, y: H * (0.1 + 0.28 * r()) + i * 3, v: 16 + r() * 12, s: 18 + r() * 12,
    ph: r() * 20, bob: r() * 6, flapAt: 8 + r() * 14, a: 0.28 + r() * 0.18,
  })
  return {
    resize(w, h) {
      W = w; H = h
      birds = Array.from({ length: env.mobile ? 3 : 5 }, (_, i) => make(i, true))
    },
    frame(t, dt) {
      birds.forEach((b, i) => {
        if (dt > 0) {
          b.x += b.v * dt
          if (b.x > W + 70) birds[i] = make(i, false)
        }
        // a gentle glide with a short, slow flap every so often
        const cyc = (t + b.ph) % b.flapAt
        const flapping = cyc < 2.6
        const lift = flapping ? Math.sin((cyc / 2.6) * Math.PI * 2 * 1.5) * 0.85 : 0.5 + Math.sin(t * 0.4 + b.bob) * 0.06
        const y = b.y + Math.sin(t * 0.35 + b.bob) * 6
        ctx.save()
        ctx.translate(b.x, y)
        ctx.fillStyle = `rgba(52,80,64,${b.a})`
        wing(ctx, 1, b.s, lift)
        wing(ctx, -1, b.s, lift)
        ctx.beginPath()
        ctx.ellipse(0, 0, b.s * 0.07, b.s * 0.13, Math.PI / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    },
  }
}
