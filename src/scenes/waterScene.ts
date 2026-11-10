import { drawLeaf, TAU } from './util'
import type { SceneFactory } from './util'

/** Still water with slow elliptical ripples and two leaves circling. */
export const waterScene: SceneFactory = (ctx) => {
  let W = 0
  let H = 0
  const leaves = [
    { rx: 0.3, speed: 0.11, ph: 0.4, dir: 1, len: 26 },
    { rx: 0.2, speed: 0.085, ph: 3.3, dir: -1, len: 20 },
  ]
  const PERIOD = 3.2
  const LIFE = 11

  return {
    resize(w, h) { W = w; H = h },
    frame(t) {
      const cx = W / 2
      const cy = H - 62
      const R = W * 0.52
      const sq = 0.2
      // water body
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(1, sq)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
      g.addColorStop(0, 'rgba(150,186,172,0.55)')
      g.addColorStop(0.6, 'rgba(176,206,190,0.35)')
      g.addColorStop(1, 'rgba(183,203,174,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill()
      ctx.restore()

      // ripples
      for (let k = 0; k < 4; k++) {
        const age = (t + k * PERIOD) % (PERIOD * 4)
        if (age > LIFE) continue
        const p = age / LIFE
        const rr = 18 + p * R * 0.95
        const a = Math.pow(1 - p, 1.7) * 0.5 * Math.min(1, p * 8)
        ctx.strokeStyle = `rgba(86,122,100,${a})`
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * sq, 0, 0, TAU); ctx.stroke()
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.9})`
        ctx.beginPath(); ctx.ellipse(cx, cy + 1.4, rr, rr * sq, 0, 0, TAU); ctx.stroke()
      }

      // leaves
      for (const l of leaves) {
        const a = t * l.speed * l.dir + l.ph
        const x = cx + Math.cos(a) * R * l.rx * 1.9
        const y = cy + Math.sin(a) * R * l.rx * 1.9 * sq
        const heading = a + (l.dir > 0 ? Math.PI / 2 : -Math.PI / 2)
        // shadow on the water
        ctx.fillStyle = 'rgba(46,82,64,0.12)'
        ctx.beginPath(); ctx.ellipse(x + 1, y + 3, l.len * 0.5, l.len * 0.14, 0, 0, TAU); ctx.fill()
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(1, 0.42)
        ctx.rotate(heading + Math.sin(t * 0.5 + l.ph) * 0.12)
        ctx.translate(-l.len / 2, 0)
        drawLeaf(ctx, l.len, l.len * 0.32, 'rgba(98,138,92,0.95)', 'rgba(160,188,128,0.95)')
        ctx.restore()
      }
    },
  }
}
