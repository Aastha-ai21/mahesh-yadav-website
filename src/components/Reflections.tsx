import { REFLECTIONS } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { dandelionScene } from '../scenes/dandelionScene'
import { Reveal } from './ui'

export function Reflections() {
  const ref = useNatureCanvas(dandelionScene)
  return (
    <section id="reflections" className="section reflections">
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x">
        <Reveal>
          <p className="label" style={{ marginBottom: 16 }}>{REFLECTIONS.label}</p>
          <h2 style={{ maxWidth: 640 }}>{REFLECTIONS.heading}</h2>
        </Reveal>
        <div className="rows">
          {REFLECTIONS.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.12}>
              <article className="row">
                <p className="label" style={{ paddingTop: 10 }}>{it.time}</p>
                <div>
                  <h3>{it.title}</h3>
                  <p>{it.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
