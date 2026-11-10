import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../content'
import { useSound } from '../audio/SoundContext'
import { LotusIcon } from './ui'

export function Nav() {
  const { on, toggle } = useSound()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="brand" aria-label="Mahesh Yadav, back to top">
          <LotusIcon className="h-7 w-7 text-moss" />
          <span>Mahesh Yadav</span>
        </a>
        <div className="flex items-center gap-8">
          <nav className="nav-links" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <button type="button" className="sound-btn" aria-pressed={on} onClick={toggle}>
            <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>{on ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
