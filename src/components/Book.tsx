import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { BOOK } from '../content'
import { useNatureCanvas } from '../scenes/useNatureCanvas'
import { fireflyScene } from '../scenes/fireflyScene'
import { LotusIcon, Reveal } from './ui'

const LAUNCH = new Date(BOOK.launchDate).getTime()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function remaining() {
  const ms = Math.max(0, LAUNCH - Date.now())
  const mins = Math.floor(ms / 60000)
  return { done: ms === 0, days: Math.floor(mins / 1440), hours: Math.floor((mins % 1440) / 60), minutes: mins % 60 }
}

export function Book() {
  const ref = useNatureCanvas(fireflyScene)
  const [left, setLeft] = useState(remaining)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setLeft(remaining()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!EMAIL_RE.test(v)) {
      setError(BOOK.invalid)
      return
    }
    setError('')
    // TODO(waitlist): FRONT-END ONLY. The email is NOT stored or sent anywhere yet.
    // Connect this to a real service (Formspree, Google Sheets via Apps Script, or Supabase)
    // by POSTing `v` here and only calling setSent(true) after the request succeeds.
    setSent(true)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section id="book" className="section">
      <div className="container-x">
        <Reveal>
          <div className="panel">
            <canvas ref={ref} className="canvas-layer" aria-hidden="true" />
            <div className="book-grid">
              <div className="book-stage" aria-hidden="true">
                <div className="book-float">
                  <div className="book">
                    <div className="front">
                      <LotusIcon className="h-14 w-14" strokeWidth={0.9} />
                      <div>
                        <div className="book-title">{BOOK.title}</div>
                        <div style={{ width: 28, height: 1, background: 'rgba(201,165,90,0.8)', margin: '14px auto 0' }} />
                      </div>
                      <div className="book-author">{BOOK.author}</div>
                    </div>
                    <div className="back" />
                    <div className="side-r" />
                    <div className="side-l" />
                  </div>
                </div>
              </div>

              <div>
                <p className="label" style={{ marginBottom: 14 }}>{BOOK.label}</p>
                <h2>{BOOK.title}</h2>
                <p style={{ marginTop: 18, maxWidth: 520, color: 'var(--ink)' }}>{BOOK.summary}</p>

                {left.done ? (
                  <p className="ok">{BOOK.released}</p>
                ) : (
                  <div className="count" role="timer" aria-label="Time until the book launches">
                    <div><b>{left.days}</b><span>Days</span></div>
                    <div><b>{pad(left.hours)}</b><span>Hours</span></div>
                    <div><b>{pad(left.minutes)}</b><span>Minutes</span></div>
                  </div>
                )}

                {sent ? (
                  <p className="ok" role="status">{BOOK.success}</p>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <label htmlFor="waitlist-email" className="label" style={{ display: 'block', marginBottom: 10 }}>
                      {BOOK.waitlistHeading}
                    </label>
                    <div className="form-row">
                      <input
                        id="waitlist-email"
                        className="input"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder={BOOK.emailPlaceholder}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                        aria-invalid={error ? true : undefined}
                        aria-describedby="waitlist-err"
                      />
                      <button type="submit" className="btn btn-primary">{BOOK.submit}</button>
                    </div>
                    <p id="waitlist-err" className="err" role="alert">{error}</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
