import { VERSE } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { vineMistScene } from '../scenes/vineMistScene'
import { Reveal } from './ui'

export function GitaVerse() {
  const ref = useNatureCanvas(vineMistScene)
  return (
    <section className="section verse" aria-label="Bhagavad Gita verse" style={{ padding: '130px 0' }}>
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x" style={{ maxWidth: 820 }}>
        <Reveal>
          <p className="sanskrit">{VERSE.sanskrit}</p>
          <p className="italic-display" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', color: 'var(--ink)', margin: '28px auto 26px', lineHeight: 1.4, maxWidth: 640 }}>
            {VERSE.english}
          </p>
          <p className="label">{VERSE.reference}</p>
        </Reveal>
      </div>
    </section>
  )
}
