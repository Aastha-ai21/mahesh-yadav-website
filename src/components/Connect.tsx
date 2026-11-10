import type { ReactNode } from 'react'
import { CONNECT } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { birdScene } from '../scenes/birdScene'
import { Reveal } from './ui'

const svgProps = { className: 'ic', viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false }

const ICONS: Record<string, ReactNode> = {
  youtube: (
    <svg {...svgProps}><rect x="3" y="7" width="26" height="18" rx="6" /><path d="M13 12l7 4-7 4z" /></svg>
  ),
  instagram: (
    <svg {...svgProps}><rect x="4" y="4" width="24" height="24" rx="7" /><circle cx="16" cy="16" r="5.5" /><circle cx="23" cy="9" r="0.8" fill="currentColor" /></svg>
  ),
  whatsapp: (
    <svg {...svgProps}><path d="M5 27l1.700-6A11 11 0 1 1 11 25.300z" /><path d="M12 11c0 5 4 9 9 9l1.500-2-3-1.500-1.200 1c-1.300-.6-2.400-1.700-3-3l1-1.200L15 9.500z" /></svg>
  ),
  email: (
    <svg {...svgProps}><rect x="3" y="7" width="26" height="18" rx="3" /><path d="M4 9l12 9 12-9" /></svg>
  ),
}

export function Connect() {
  const ref = useNatureCanvas(birdScene)
  return (
    <section id="connect" className="section connect">
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x" style={{ maxWidth: 860 }}>
        <Reveal>
          <p className="label" style={{ marginBottom: 16 }}>{CONNECT.label}</p>
          <h2 style={{ maxWidth: 620, margin: '0 auto' }}>{CONNECT.heading}</h2>
        </Reveal>
        <div className="links-grid">
          {CONNECT.links.map((l, i) => (
            <Reveal key={l.key} delay={i * 0.1}>
              <a className="link-tile" href={l.href} target={l.key === 'email' ? undefined : '_blank'} rel="noopener noreferrer">
                {ICONS[l.key]}
                <span>
                  <h3>{l.title}</h3>
                  <span className="muted" style={{ fontSize: '0.95rem' }}>{l.note}</span>
                </span>
                <svg className="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
