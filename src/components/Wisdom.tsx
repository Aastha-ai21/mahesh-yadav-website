import { useId, useState } from 'react'
import { WISDOM } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { petalScene } from '../scenes/petalScene'
import { Reveal } from './ui'

type Tab = (typeof WISDOM.tabs)[number]

export function Wisdom() {
  const ref = useNatureCanvas(petalScene)
  const [tab, setTab] = useState<Tab>('All')
  const base = useId()
  const shown = WISDOM.quotes.filter((q) => tab === 'All' || q.category === tab)

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = WISDOM.tabs.length
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % n
    if (e.key === 'ArrowLeft') next = (i - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next < 0) return
    e.preventDefault()
    setTab(WISDOM.tabs[next])
    document.getElementById(`${base}-tab-${next}`)?.focus()
  }

  return (
    <section id="wisdom" className="section wisdom">
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x">
        <Reveal className="text-center">
          <p className="label" style={{ marginBottom: 16 }}>{WISDOM.label}</p>
          <h2>{WISDOM.heading}</h2>
          <div role="tablist" aria-label="Filter quotes" className="tabs" style={{ marginTop: 34 }}>
            {WISDOM.tabs.map((t, i) => (
              <button
                key={t}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                className="tab"
                aria-selected={tab === t}
                aria-controls={`${base}-panel`}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        <ul
          className="quote-grid"
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${WISDOM.tabs.indexOf(tab)}`}
        >
          {shown.map((q, i) => (
            <li key={`${tab}-${q.label}`} className="quote-item" style={{ ['--ci' as string]: `${i * 0.08}s` }}>
              <figure className="glass quote-card breathe" style={{ ['--bd' as string]: `${-(i * 1.7 + 1)}s`, margin: 0 }}>
                <blockquote>&ldquo;{q.text}&rdquo;</blockquote>
                <figcaption className="label">{q.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
