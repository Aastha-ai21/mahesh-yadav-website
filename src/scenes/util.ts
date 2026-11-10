export type Ctx = CanvasRenderingContext2D

export interface Scene {
  resize(w: number, h: number): void
  /** t = seconds since start, dt = seconds since last frame (0 for a still frame) */
  frame(t: number, dt: number): void
}
export interface Env {
  mobile: boolean
}
export type SceneFactory = (ctx: Ctx, env: Env) => Scene

export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const TAU = Math.PI * 2
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Leaf pointing along +x from the origin, with gradient and midrib. */
export function drawLeaf(ctx: Ctx, len: number, wid: number, c1: string, c2: string, rib = 'rgba(40,70,48,0.35)') {
  const g = ctx.createLinearGradient(0, 0, len, 0)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(len * 0.22, -wid, len * 0.7, -wid * 0.95, len, 0)
  ctx.bezierCurveTo(len * 0.7, wid * 0.95, len * 0.22, wid, 0, 0)
  ctx.fillStyle = g
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(len * 0.5, wid * 0.04, len * 0.96, 0)
  ctx.strokeStyle = rib
  ctx.lineWidth = 0.7
  ctx.stroke()
}

/** Pointed lotus-style petal along +x. */
export function drawPetal(ctx: Ctx, len: number, wid: number, c1: string, c2: string) {
  const g = ctx.createLinearGradient(0, 0, len, 0)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(len * 0.3, -wid * 1.05, len * 0.8, -wid * 0.75, len, 0)
  ctx.bezierCurveTo(len * 0.8, wid * 0.75, len * 0.3, wid * 1.05, 0, 0)
  ctx.fillStyle = g
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(len * 0.08, 0)
  ctx.lineTo(len * 0.9, 0)
  ctx.strokeStyle = 'rgba(199,124,142,0.28)'
  ctx.lineWidth = 0.6
  ctx.stroke()
}
