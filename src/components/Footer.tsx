import { FOOTER } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { cloudGrassScene } from '../scenes/cloudGrassScene'
import { Reveal } from './ui'

export function Footer() {
  const ref = useNatureCanvas(cloudGrassScene)
  return (
    <footer className="footer">
      <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
      <div className="container-x">
        <Reveal>
          <p className="sanskrit" lang="sa">{FOOTER.mantra}</p>
          <p className="roman">{FOOTER.romanised}</p>
          <small>{FOOTER.copyright}</small>
        </Reveal>
      </div>
    </footer>
  )
}
