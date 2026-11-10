import { rng, TAU } from './util'
import type { SceneFactory } from './util'
import { makeGrass } from './grass'

interface Blob { dx: number; dy: number; r: number; a: number }
interface Cloud { x: number; y: number; v: number; sx: number; blobs: Blob[]; w: number }

const FOOTER_PALETTE = [
  'rgba(168,194,150,0.5)',
  'rgba(132,166,116,0.6)',
  'rgba(100,138,92,0.68)',
  'rgba(74,112,78,0.78)',
]

/** Soft white cloud wisps above a thin strip of swaying grass. */
export const cloudGrassScene: SceneFactory = (ctx, env) => {
  const grass = makeGrass({ density: env.mobile ? 0.28 : 0.4, minH: 14, maxH: env.mobile ? 34 : 50, seed: 8, palette: FOOTER_PALETTE })
  const r = rng(606)
  let W = 0
  let H = 0
  let clouds: Cloud[] = []
  const makeCloud = (x: number): Cloud => {
    const w = 260 + r() * 260
    const blobs: Blob[] = Array.from({ length: 9 }, (_, i) => ({
      dx: (i / 8 - 0.5) * w + (r() - 0.5) * 30, dy: (r() - 0.5) * 14, r: 50 + r() * 60, a: 0.28 + r() * 0.22,
    }))
    return { x, y: H * (0.1 + 0.4 * r()), v: 6 + r() * 7, sx: 1, blobs, w }
  }
  return {
    resize(w, h) {
      W = w; H = h
      grass.resize(w)
      clouds = Array.from({ length: env.mobile ? 3 : 5 }, (_, i) => makeCloud((i / 5) * w + r() * 80))
    },
    frame(t, dt) {
      clouds.forEach((c, i) => {
        if (dt > 0) {
          c.x += c.v * dt
          if (c.x - c.w > W + 120) clouds[i] = { ...makeCloud(0), x: -c.w - 100 }
        }
        for (const b of c.blobs) {
          ctx.save()
          ctx.translate(c.x + b.dx, c.y + b.dy + Math.sin(t * 0.1 + b.dx) * 3)
          ctx.scale(1.7, 0.34)
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, b.r)
          g.addColorStop(0, `rgba(255,255,255,${b.a})`)
          g.addColorStop(0.55, `rgba(255,255,255,${b.a * 0.4})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.fill()
          ctx.restore()
        }
      })
      grass.draw(ctx, t, H)
    },
  }
}
