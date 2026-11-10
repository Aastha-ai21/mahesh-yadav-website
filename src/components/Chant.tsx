import { useMemo, useState } from 'react'
import { CHANT } from '../content'
import { useSound } from '../audio/SoundContext'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { waterScene } from '../scenes/waterScene'
import { Reveal } from './ui'

const CX = 200
const CY = 190
const R = 150
const N = CHANT.total

export function Chant() {
  const [count, setCount] = useState(0)
  const { beadTap, bowl } = useSound()
  const water = useNatureCanvas(waterScene)

  const beads = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        // bead 1 sits just after the head bead (at the bottom) and the round runs clockwise
        const a = (Math.PI / 2) + ((i + 1) * 2 * Math.PI) / (N + 1)
        return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) }
      }),
    [],
  )

  const done = count >= N
  const tap = () => {
    if (done) return
    const next = count + 1
    setCount(next)
    beadTap()
    if (next === N) window.setTimeout(bowl, 350)
  }

  return (
    <section id="chant" className="section">
      <div className="container-x">
        <div className="chant-grid">
          <Reveal>
            <div className="mala-wrap">
              <canvas ref={water} className="canvas-layer" aria-hidden="true" />
              <div className="mala-box breathe">
                <svg viewBox="0 0 400 470" aria-hidden="true" focusable="false">
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(107,138,92,0.35)" strokeWidth="0.8" />
                  {beads.map((b, i) => {
                    const n = i + 1
                    const current = n === count
                    const filled = n < count
                    return (
                      <circle
                        key={n}
                        cx={b.x}
                        cy={b.y}
                        r={current ? 6.2 : 4}
                        fill={current ? '#C77C8E' : filled ? '#2E5240' : '#B7CBAE'}
                        stroke={current ? 'rgba(199,124,142,0.35)' : 'none'}
                        strokeWidth="4"
                        style={{ transition: 'fill 0.7s ease, r 0.7s ease, stroke 0.7s ease' }}
                      />
                    )
                  })}
                  {/* head bead + tassel */}
                  <line x1={CX} y1={CY + R + 8} x2={CX} y2={CY + R + 26} stroke="#C77C8E" strokeWidth="1.2" />
                  <circle cx={CX} cy={CY + R} r="9" fill="#C9A55A" />
                  <circle cx={CX - 2.5} cy={CY + R - 2.5} r="3" fill="rgba(255,255,255,0.4)" />
                  <path d={`M${CX - 7} ${CY + R + 24} h14 q2 22 0 44 q-7 6 -14 0 q-2 -22 0 -44Z`} fill="#C77C8E" opacity="0.9" />
                  {[-4.5, -1.5, 1.5, 4.5].map((dx) => (
                    <path key={dx} d={`M${CX + dx} ${CY + R + 40} v26`} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                  ))}
                </svg>
                <div className="mala-center" aria-live="polite">
                  <div className="mala-count">{count} of {N}</div>
                  <div className="mala-note">{done ? CHANT.complete : ''}</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="label" style={{ marginBottom: 16 }}>{CHANT.label}</p>
            <h2>{CHANT.heading}</h2>
            <p style={{ margin: '22px 0 0', maxWidth: 460 }}>{CHANT.body}</p>
            <p className="sanskrit mantra-pink" lang="sa">{CHANT.mantra}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={tap} aria-disabled={done}>{CHANT.tap}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setCount(0)}>{CHANT.reset}</button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
