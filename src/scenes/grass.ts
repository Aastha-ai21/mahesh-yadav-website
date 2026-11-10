import { rng } from './util'
import type { Ctx } from './util'

interface Blade { x: number; h: number; w: number; g: number; ph: number; lean: number }

export interface GrassOpts {
  /** blades per horizontal pixel */
  density: number
  minH: number
  maxH: number
  seed: number
  /** colour groups, drawn back to front */
  palette: string[]
}

export const MEADOW_PALETTE = [
  'rgba(150,178,128,0.55)',
  'rgba(120,152,104,0.62)',
  'rgba(98,134,88,0.7)',
  'rgba(78,114,76,0.78)',
  'rgba(58,96,66,0.85)',
]

/** Slow travelling wave used by blades, stalks and flowers. */
export function sway(t: number, x: number, h: number, ph: number): number {
  const wave = Math.sin(t * 0.7 - x * 0.009 + ph * 0.25) * 0.65 + Math.sin(t * 0.33 - x * 0.0035) * 0.35
  return wave * h * 0.14
}

export function makeGrass(o: GrassOpts) {
  let blades: Blade[][] = o.palette.map(() => [])
  return {
    resize(w: number) {
      const r = rng(o.seed)
      blades = o.palette.map(() => [])
      const n = Math.round(w * o.density)
      for (let i = 0; i < n; i++) {
        const g = Math.floor(Math.pow(r(), 0.8) * o.palette.length)
        const tall = 0.45 + 0.55 * r()
        blades[Math.min(g, o.palette.length - 1)].push({
          x: r() * w,
          h: o.minH + (o.maxH - o.minH) * tall * (0.7 + 0.3 * (g / o.palette.length)),
          w: 1.4 + r() * 2.2,
          g,
          ph: r() * 6.28,
          lean: (r() - 0.5) * 0.12,
        })
      }
    },
    draw(ctx: Ctx, t: number, baseY: number) {
      for (let gi = 0; gi < blades.length; gi++) {
        ctx.beginPath()
        for (const b of blades[gi]) {
          const s = sway(t, b.x, b.h, b.ph) + b.lean * b.h
          const tx = b.x + s
          const ty = baseY - b.h
          ctx.moveTo(b.x - b.w / 2, baseY + 2)
          ctx.quadraticCurveTo(b.x - b.w / 2 + s * 0.2, baseY - b.h * 0.55, tx, ty)
          ctx.quadraticCurveTo(b.x + b.w / 2 + s * 0.45, baseY - b.h * 0.5, b.x + b.w / 2, baseY + 2)
        }
        ctx.fillStyle = o.palette[gi]
        ctx.fill()
      }
    },
  }
}

