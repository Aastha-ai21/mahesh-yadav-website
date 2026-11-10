import { useEffect, useRef, useState } from 'react'
import { HERO } from '../content'
import { LotusIcon, Reveal } from './ui'

export function Hero() {
  const box = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    let handle: { dispose(): void } | undefined
    let cancelled = false
    import('../three/lotusScene')
      .then(({ createLotusScene }) => {
        if (cancelled) return
        handle = createLotusScene(el, {
          reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          mobile: window.innerWidth < 768,
        })
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
      handle?.dispose()
    }
  }, [])

  return (
    <section id="top" className="section hero" style={{ padding: 0 }}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-sun" />
        <div className="mist-band mist-a" />
        <svg className="hero-hills" viewBox="0 0 1440 360" preserveAspectRatio="none">
          <defs>
            <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfdcc6" stopOpacity="0.55" /><stop offset="1" stopColor="#dfe8d7" stopOpacity="0.9" /></linearGradient>
            <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bdd0b3" stopOpacity="0.6" /><stop offset="1" stopColor="#d3e0cb" stopOpacity="0.95" /></linearGradient>
            <linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9c19f" stopOpacity="0.55" /><stop offset="1" stopColor="#edf2e8" stopOpacity="1" /></linearGradient>
          </defs>
          <path d="M0 150 C180 90 320 120 520 100 C760 70 900 150 1120 110 C1260 85 1360 110 1440 90 L1440 360 L0 360Z" fill="url(#h1)" />
          <path d="M0 220 C220 160 400 210 620 180 C860 150 1010 230 1210 190 C1320 170 1390 180 1440 170 L1440 360 L0 360Z" fill="url(#h2)" />
          <path d="M0 290 C240 250 420 295 700 270 C960 245 1160 300 1440 262 L1440 360 L0 360Z" fill="url(#h3)" />
        </svg>
        <div className="mist-band mist-b" />
      </div>

      <div className="container-x hero-grid">
        <div>
          <Reveal>
            <p className="label" style={{ marginBottom: 22 }}>{HERO.eyebrow}</p>
            <h1>{HERO.name}</h1>
            <p className="italic-display" style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', color: 'var(--moss-ink)', margin: '14px 0 26px' }}>
              {HERO.tagline}
            </p>
            <p style={{ maxWidth: 480, color: 'var(--ink)' }}>{HERO.intro}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 38 }}>
              <a className="btn btn-primary" href="#book">{HERO.primary}</a>
              <a className="btn btn-ghost" href="#wisdom">{HERO.secondary}</a>
            </div>
          </Reveal>
        </div>
        <div className="hero-3d" ref={box} aria-hidden="true">
          {failed && <LotusIcon className="mx-auto h-64 w-64 text-lotus" strokeWidth={0.6} />}
        </div>
      </div>
    </section>
  )
}
