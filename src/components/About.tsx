import { ABOUT } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { meadowScene } from '../scenes/meadowScene'
import { LotusIcon, Reveal } from './ui'

function Column({ data, delay }: { data: typeof ABOUT.left; delay: number }) {
  return (
    <Reveal delay={delay}>
      <p className="label">{data.label}</p>
      <h3 style={{ margin: '12px 0 16px' }}>{data.title}</h3>
      <p>{data.body}</p>
      <ul className="points">
        {data.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </Reveal>
  )
}

export function About() {
  const ref = useNatureCanvas(meadowScene)
  return (
    <section id="about" className="section" style={{ paddingBottom: 230 }}>
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x">
        <Reveal className="text-center" >
          <p className="label" style={{ marginBottom: 16 }}>Journey</p>
          <h2>{ABOUT.heading}</h2>
          <p className="muted" style={{ maxWidth: 600, margin: '20px auto 0' }}>{ABOUT.sub}</p>
        </Reveal>

        <div className="about-grid" style={{ marginTop: 80 }}>
          <Column data={ABOUT.left} delay={0} />
          <Reveal delay={0.15} className="text-center">
            <div className="vline" aria-hidden="true" />
            <LotusIcon className="mx-auto my-6 h-12 w-12 text-lotus" strokeWidth={1} />
            <p className="sanskrit" style={{ fontSize: '1.9rem', color: 'var(--forest)' }}>{ABOUT.centre.sanskrit}</p>
            <p className="italic-display" style={{ fontSize: '1.45rem', lineHeight: 1.4, margin: '10px 0 14px', color: 'var(--ink)' }}>
              {ABOUT.centre.english}
            </p>
            <p className="label">{ABOUT.centre.reference}</p>
            <div className="vline" aria-hidden="true" style={{ marginTop: 24 }} />
          </Reveal>
          <Column data={ABOUT.right} delay={0.3} />
        </div>

        <Reveal className="text-center" >
          <figure style={{ margin: '110px 0 0' }}>
            <blockquote className="pull breathe" style={{ margin: 0 }}>&ldquo;{ABOUT.pullQuote}&rdquo;</blockquote>
            <figcaption className="label" style={{ marginTop: 22 }}>— {ABOUT.pullQuoteBy}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
