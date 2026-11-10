import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Soundscape } from './soundscape'

interface SoundApi {
  on: boolean
  enable: () => void
  disable: () => void
  toggle: () => void
  beadTap: () => void
  bowl: () => void
}

const Ctx = createContext<SoundApi | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const scape = useRef<Soundscape | null>(null)
  const [on, setOn] = useState(false)

  const enable = useCallback(() => {
    scape.current ??= new Soundscape()
    // If the AudioContext fails, the site simply stays silent.
    setOn(scape.current.start())
  }, [])

  const disable = useCallback(() => {
    scape.current?.stop()
    setOn(false)
  }, [])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) scape.current?.pause()
      else scape.current?.resume()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const api = useMemo<SoundApi>(
    () => ({
      on,
      enable,
      disable,
      toggle: () => (on ? disable() : enable()),
      beadTap: () => scape.current?.beadTap(),
      bowl: () => scape.current?.bowl(true),
    }),
    [on, enable, disable],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useSound(): SoundApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSound must be used inside SoundProvider')
  return v
}
