import { useEffect, useRef } from 'react'
import type { SceneFactory } from './util'

/**
 * Runs a Canvas 2D scene inside the canvas' parent element. The loop only
 * runs while the parent is on screen, resizes with ResizeObserver, caps the
 * device pixel ratio at 2, and draws a single still frame for users who
 * prefer reduced motion.
 */
export function useNatureCanvas(factory: SceneFactory) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = factory(ctx, { mobile: window.innerWidth < 768 })
    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let last = 0
    let clock = 0

    const still = () => {
      ctx.clearRect(0, 0, w, h)
      scene.frame(6, 0)
    }

    const size = () => {
      const nw = host.clientWidth
      const nh = host.clientHeight
      if (nw < 2 || nh < 2) return
      w = nw
      h = nh
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene.resize(w, h)
      if (reduce) still()
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      ctx.clearRect(0, 0, w, h)
      scene.frame(clock, dt)
    }

    const start = () => {
      if (reduce || raf || w === 0) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const ro = new ResizeObserver(() => {
      size()
      if (visible) start()
    })
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    ro.observe(host)
    io.observe(host)
    size()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
