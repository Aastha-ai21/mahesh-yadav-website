import { drawLeaf, rng, TAU } from './util'
import type { SceneFactory, Ctx } from './util'

interface Mist { x: number; y: number; rx: number; ry: number; v: number; a: number }
interface Vine { side: 1 | -1; len: number; ph: number; amp: number; alpha: number; leaves: { at: number; size: number; dir: number; ph: number }[] }

export const vineMistScene: SceneFactory = (ctx, env) => {
  let W = 0
  let mists: Mist[] = []
  let vines: Vine[] = []

  const stemPoint = (v: Vine, y: number, t: number) => {
    const edge = v.side === 1 ? 6 : W - 6
    const k = y / v.len
    const base = Math.sin(y * 0.012 + v.ph) * v.amp
    const wind = Math.sin(t * 0.5 + y * 0.004 + v.ph) * 12 * k + Math.sin(t * 0.23 + v.ph) * 6 * k
    return edge + v.side * (base + 14) + wind * v.side
  }

  const drawVine = (v: Vine, t: number) => {
    ctx.save()
    ctx.globalAlpha = v.alpha
    ctx.strokeStyle = 'rgba(72,106,80,0.8)'
    ctx.lineWidth = 1.1
    ctx.lineCap = 'round'
    ctx.beginPath()
    for (let y = 0; y <= v.len; y += 10) {
      const x = stemPoint(v, y, t)
      if (y === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    for (const l of v.leaves) {
      const y = l.at * v.len
      const x = stemPoint(v, y, t)
      const flutter = Math.sin(t * 0.8 + l.ph) * 0.14
      const ang = (v.side === 1 ? 0 : Math.PI) + l.dir * (0.55 + flutter) + (v.side === 1 ? 0 : 0)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(v.side === 1 ? ang : Math.PI - (0.55 + flutter) * l.dir)
      drawLeaf(ctx, l.size, l.size * 0.3, 'rgba(110,146,102,0.8)', 'rgba(176,201,156,0.55)', 'rgba(50,84,58,0.35)')
      ctx.restore()
    }
    // tiny curling tendril at the tip
    const tipY = v.len
    const tx = stemPoint(v, tipY, t)
    ctx.beginPath()
    for (let a = 0; a < 9; a += 0.4) {
      const r = 7 - a * 0.7
      if (r <= 0) break
      ctx.lineTo(tx + Math.cos(a + t * 0.2) * r * v.side, tipY + Math.sin(a + t * 0.2) * r + a * 1.5)
    }
    ctx.stroke()
    ctx.restore()
  }

  return {
    resize(w, h) {
      W = w
      const r = rng(21)
      mists = Array.from({ length: env.mobile ? 4 : 7 }, (_, i) => ({
        x: r() * w, y: h * (0.1 + 0.8 * (i / 6)) + r() * 40, rx: 220 + r() * 220, ry: 40 + r() * 40,
        v: 7 + r() * 8, a: 0.4 + r() * 0.3,
      }))
      const mk = (side: 1 | -1, ph: number, alpha: number, lenK: number): Vine => {
        const len = h * lenK
        const n = Math.round(len / 54)
        return {
          side, ph, alpha, len, amp: 12 + r() * 10,
          leaves: Array.from({ length: n }, (_, i) => ({
            at: (i + 0.5) / n, size: 20 + r() * 14, dir: i % 2 === 0 ? 1 : -1, ph: r() * 6,
          })),
        }
      }
      vines = env.mobile
        ? [mk(1, 0.5, 0.6, 0.6), mk(-1, 2.2, 0.6, 0.6)]
        : [mk(1, 0.5, 0.75, 0.82), mk(1, 3, 0.4, 0.55), mk(-1, 2.2, 0.75, 0.82), mk(-1, 5, 0.4, 0.55)]
    },
    frame(t, dt) {
      for (const v of vines) drawVine(v, t)
      for (const m of mists) {
        if (dt > 0) {
          m.x += m.v * dt
          if (m.x - m.rx > W) m.x = -m.rx
        }
        drawMist(ctx, m)
      }
    },
  }
}

function drawMist(ctx: Ctx, m: Mist) {
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.scale(1, m.ry / m.rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, m.rx)
  g.addColorStop(0, `rgba(255,255,255,${m.a})`)
  g.addColorStop(0.5, `rgba(255,255,255,${m.a * 0.4})`)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, m.rx, 0, TAU)
  ctx.fill()
  ctx.restore()
}
