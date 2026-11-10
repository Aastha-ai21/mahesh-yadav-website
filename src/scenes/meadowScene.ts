import { rng, TAU } from './util'
import type { SceneFactory, Ctx } from './util'
import { makeGrass, MEADOW_PALETTE, sway } from './grass'

interface Flower { x: number; h: number; r: number; ph: number; pink: boolean }

class Butterfly {
  x: number; y: number; heading: number; speed: number; seed: number
  flap = 0; s: number; tone: [string, string]
  constructor(x: number, y: number, seed: number, s: number, tone: [string, string]) {
    this.x = x; this.y = y; this.seed = seed; this.s = s; this.tone = tone
    this.heading = 0.2 + seed * 0.3
    this.speed = 20 + seed * 3
  }
  update(t: number, dt: number, w: number, h: number) {
    const turn = Math.sin(t * 0.37 + this.seed * 5) * 0.7 + Math.sin(t * 0.93 + this.seed * 2.3) * 0.5
    this.heading += turn * dt * 0.9
    // gently steer back into the flight band
    const top = h * 0.4
    const bottom = h * 0.86
    if (this.y < top || this.y > bottom) {
      const want = this.y < top ? Math.PI / 2 : -Math.PI / 2
      let d = want - this.heading
      d = Math.atan2(Math.sin(d), Math.cos(d))
      this.heading += d * dt * 0.9
    }
    const flutter = 0.65 + 0.35 * Math.sin(t * 0.45 + this.seed)
    this.x += Math.cos(this.heading) * this.speed * dt
    this.y += Math.sin(this.heading) * this.speed * dt * 0.8 + Math.sin(t * 1.6 + this.seed) * 5 * dt
    this.flap += dt * TAU * (1.5 + flutter * 0.9)
    if (this.x > w + 30) this.x = -30
    if (this.x < -30) this.x = w + 30
  }
  draw(ctx: Ctx, t: number) {
    const open = 0.5 + 0.5 * Math.cos(this.flap)
    const amp = 0.7 + 0.3 * Math.sin(t * 0.45 + this.seed)
    const sx = 0.22 + 0.78 * open * amp
    const s = this.s
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.heading + Math.PI / 2)
    for (const side of [1, -1]) {
      ctx.save()
      ctx.scale(side * sx, 1)
      const g = ctx.createRadialGradient(0, 0, 0.5, s * 0.5, -s * 0.1, s * 1.1)
      g.addColorStop(0, this.tone[0])
      g.addColorStop(1, this.tone[1])
      ctx.fillStyle = g
      ctx.strokeStyle = 'rgba(120,112,80,0.28)'
      ctx.lineWidth = 0.6
      // forewing
      ctx.beginPath()
      ctx.moveTo(0.6, -s * 0.15)
      ctx.bezierCurveTo(s * 0.35, -s * 1.15, s * 1.1, -s * 1.0, s * 1.02, -s * 0.5)
      ctx.bezierCurveTo(s * 0.98, -s * 0.12, s * 0.45, s * 0.04, 0.6, s * 0.05)
      ctx.closePath()
      ctx.fill(); ctx.stroke()
      // hindwing
      ctx.beginPath()
      ctx.moveTo(0.6, 0)
      ctx.bezierCurveTo(s * 0.7, -s * 0.05, s * 0.9, s * 0.25, s * 0.68, s * 0.68)
      ctx.bezierCurveTo(s * 0.5, s * 0.98, s * 0.15, s * 0.8, 0.6, s * 0.3)
      ctx.closePath()
      ctx.fill(); ctx.stroke()
      // wing veins
      ctx.strokeStyle = 'rgba(130,120,85,0.22)'
      ctx.beginPath()
      ctx.moveTo(0.6, -s * 0.1); ctx.lineTo(s * 0.9, -s * 0.55)
      ctx.moveTo(0.6, -s * 0.05); ctx.lineTo(s * 0.95, -s * 0.2)
      ctx.moveTo(0.6, s * 0.1); ctx.lineTo(s * 0.62, s * 0.62)
      ctx.stroke()
      ctx.restore()
    }
    // body + antennae
    ctx.fillStyle = 'rgba(80,70,50,0.75)'
    ctx.beginPath()
    ctx.ellipse(0, 0, 0.9, s * 0.55, 0, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = 'rgba(80,70,50,0.6)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.5); ctx.quadraticCurveTo(-s * 0.15, -s * 0.85, -s * 0.28, -s * 0.9)
    ctx.moveTo(0, -s * 0.5); ctx.quadraticCurveTo(s * 0.15, -s * 0.85, s * 0.28, -s * 0.9)
    ctx.stroke()
    ctx.restore()
  }
}

export const meadowScene: SceneFactory = (ctx, env) => {
  const grass = makeGrass({
    density: env.mobile ? 0.2 : 0.3,
    minH: env.mobile ? 34 : 46,
    maxH: env.mobile ? 78 : 118,
    seed: 11,
    palette: MEADOW_PALETTE,
  })
  let flowers: Flower[] = []
  let W = 0
  let H = 0
  const flies: Butterfly[] = []

  return {
    resize(w, h) {
      W = w; H = h
      grass.resize(w)
      const r = rng(5)
      const n = env.mobile ? 7 : 16
      flowers = Array.from({ length: n }, () => ({
        x: 20 + r() * (w - 40), h: 54 + r() * 70, r: 2.6 + r() * 1.6, ph: r() * 6, pink: r() > 0.55,
      }))
      if (flies.length === 0) {
        flies.push(
          new Butterfly(w * 0.2, h * 0.62, 1.3, 9, ['rgba(255,252,238,0.9)', 'rgba(244,236,196,0.62)']),
          new Butterfly(w * 0.7, h * 0.52, 2.1, 7.5, ['rgba(255,255,255,0.88)', 'rgba(248,226,170,0.6)']),
        )
      }
    },
    frame(t, dt) {
      const base = H
      grass.draw(ctx, t, base)
      // wildflowers: thin stalk, tiny five-petal head
      for (const f of flowers) {
        const s = sway(t, f.x, f.h, f.ph) * 1.1
        const tx = f.x + s, ty = base - f.h
        ctx.strokeStyle = 'rgba(88,122,82,0.7)'
        ctx.lineWidth = 0.9
        ctx.beginPath()
        ctx.moveTo(f.x, base + 2)
        ctx.quadraticCurveTo(f.x + s * 0.2, base - f.h * 0.55, tx, ty)
        ctx.stroke()
        const petal = f.pink ? 'rgba(244,214,222,0.95)' : 'rgba(255,255,255,0.95)'
        ctx.fillStyle = petal
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * TAU + f.ph
          ctx.beginPath()
          ctx.ellipse(tx + Math.cos(a) * f.r * 0.9, ty + Math.sin(a) * f.r * 0.9, f.r * 0.72, f.r * 0.42, a, 0, TAU)
          ctx.fill()
        }
        ctx.fillStyle = 'rgba(201,165,90,0.95)'
        ctx.beginPath(); ctx.arc(tx, ty, f.r * 0.38, 0, TAU); ctx.fill()
      }
      for (const b of flies) {
        if (dt > 0) b.update(t, dt, W, H)
        b.draw(ctx, t)
      }
    },
  }
}
