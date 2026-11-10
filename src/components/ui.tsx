import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export function LotusIcon({ className = '', strokeWidth = 1.3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M24 7c5.5 7.5 5.5 18 0 27-5.5-9-5.5-19.500 0-27Z" />
      <path d="M24 34C16 33.500 9.500 28 8 18.500 15.500 18 21.500 23 24 34Z" />
      <path d="M24 34c8-.5 14.500-6 16-15.500-7.500-.5-13.500 4.500-16 15.500Z" />
      <path d="M24 35C15 37 7.500 35 3.500 29c6-1 14 1 20.500 6Z" />
      <path d="M24 35c9 2 16.500 0 20.500-6-6-1-14 1-20.500 6Z" />
      <path d="M13 41q11 4.500 22 0" />
    </svg>
  )
}

/** Fades content up when it scrolls into view. Stays visible if JS or IntersectionObserver is unavailable. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'header' | 'p' }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const style = { '--rd': `${delay}s` } as CSSProperties
  const Any = Tag as 'div'
  return (
    <Any ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${className}`} style={style}>
      {children}
    </Any>
  )
}
