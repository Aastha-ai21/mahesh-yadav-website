import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ENTER } from '../content'
import { useSound } from '../audio/SoundContext'
import { LotusIcon } from './ui'

export function EnterScreen() {
  const { enable } = useSound()
  const [phase, setPhase] = useState<'open' | 'leaving' | 'gone'>('open')
  const primary = useRef<HTMLButtonElement>(null)
  const secondary = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    primary.current?.focus()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  const close = useCallback((withSound: boolean) => {
    if (withSound) enable() // must happen inside the click so the browser allows audio
    document.documentElement.style.overflow = ''
    setPhase('leaving')
  }, [enable])

  useEffect(() => {
    if (phase !== 'leaving') return
    const id = window.setTimeout(() => setPhase('gone'), 1650)
    return () => window.clearTimeout(id)
  }, [phase])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close(false)
    if (e.key === 'Tab') {
      // keep focus inside the dialog
      const a = primary.current
      const b = secondary.current
      if (!a || !b) return
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus() }
      else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus() }
    }
  }

  if (phase === 'gone') return null
  return (
    <div
      className={`enter ${phase === 'leaving' ? 'leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enter-title"
      aria-describedby="enter-line"
      onKeyDown={onKey}
    >
      <div style={{ maxWidth: 520 }}>
        <LotusIcon className="enter-lotus" strokeWidth={0.9} />
        <p className="label" style={{ marginBottom: 14 }}>{ENTER.greeting}</p>
        <h1 id="enter-title" style={{ fontSize: 'clamp(2.8rem, 8vw, 4.6rem)' }}>{ENTER.name}</h1>
        <p id="enter-line" className="italic-display" style={{ fontSize: '1.45rem', color: 'var(--muted-ink)', margin: '18px 0 36px', lineHeight: 1.45 }}>
          {ENTER.line}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <button ref={primary} type="button" className="btn btn-primary" onClick={() => close(true)}>{ENTER.withSound}</button>
          <button ref={secondary} type="button" className="btn-text" onClick={() => close(false)}>{ENTER.silent}</button>
        </div>
        <p style={{ marginTop: 30, fontSize: '0.85rem', letterSpacing: '0.06em', color: 'var(--muted-ink)' }}>{ENTER.hint}</p>
      </div>
    </div>
  )
}
