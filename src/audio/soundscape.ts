// Procedural soundscape built entirely with the Web Audio API (no audio files).
// Must be started from a user gesture (a click).

const MASTER_LEVEL = 0.6
const TANPURA: number[] = [98, 130.81, 130.81, 65.41] // Pa, Sa, Sa, low Sa
const TANPURA_INTERVAL = 1.45
const BOWL_BASES = [196, 220, 261.63]
const BOWL_RATIOS = [1, 2.71, 5.15, 8.2]

function makeNoise(ctx: AudioContext, kind: 'brown' | 'pink', seconds = 8): AudioBuffer {
  const sr = ctx.sampleRate
  const fade = Math.floor(sr * 0.4)
  const total = Math.floor(sr * seconds)
  const raw = new Float32Array(total + fade)
  if (kind === 'brown') {
    let last = 0
    for (let i = 0; i < raw.length; i++) {
      const w = Math.random() * 2 - 1
      last = (last + 0.02 * w) / 1.02
      raw[i] = last * 3.5
    }
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < raw.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      raw[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  }
  // Cross-fade the tail into the head so the loop has no audible seam.
  const out = ctx.createBuffer(1, total, sr)
  const d = out.getChannelData(0)
  for (let i = 0; i < total; i++) d[i] = raw[i]
  for (let i = 0; i < fade; i++) {
    const k = i / fade
    d[i] = raw[i] * k + raw[total + i] * (1 - k)
  }
  return out
}

function makeImpulse(ctx: AudioContext, seconds = 4.5): AudioBuffer {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buf = ctx.createBuffer(2, len, sr)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6)
  }
  return buf
}

export class Soundscape {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private reverbSend!: GainNode
  private sources: AudioScheduledSourceNode[] = []
  private schedTimer = 0
  private bowlTimer = 0
  private suspendTimer = 0
  private nextPluck = 0
  private pluckIdx = 0
  private tapNoise: AudioBuffer | null = null
  active = false

  /** Returns false if audio could not be started. */
  start(): boolean {
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return false
      if (!this.ctx) {
        this.ctx = new Ctor()
        this.build(this.ctx)
      }
      window.clearTimeout(this.suspendTimer)
      void this.ctx.resume().catch(() => undefined)
      this.fadeTo(MASTER_LEVEL, 4)
      this.active = true
      this.startScheduler()
      this.scheduleBowl(7000)
      return true
    } catch {
      this.teardown()
      return false
    }
  }

  stop(): void {
    if (!this.ctx) return
    this.active = false
    this.fadeTo(0, 1.5)
    this.clearTimers()
    window.clearTimeout(this.suspendTimer)
    this.suspendTimer = window.setTimeout(() => void this.ctx?.suspend().catch(() => undefined), 1700)
  }

  /** Tab hidden: silence quickly and suspend, keeping `active` true. */
  pause(): void {
    if (!this.ctx || !this.active) return
    this.fadeTo(0, 0.25)
    this.clearTimers()
    window.clearTimeout(this.suspendTimer)
    this.suspendTimer = window.setTimeout(() => void this.ctx?.suspend().catch(() => undefined), 400)
  }

  resume(): void {
    if (!this.ctx || !this.active) return
    window.clearTimeout(this.suspendTimer)
    void this.ctx.resume().catch(() => undefined)
    this.fadeTo(MASTER_LEVEL, 1.5)
    this.startScheduler()
    this.scheduleBowl(12000)
  }

  /** Soft wooden bead tap. */
  beadTap(): void {
    const ctx = this.ctx
    if (!ctx || !this.active || ctx.state !== 'running') return
    const t = ctx.currentTime
    if (!this.tapNoise) {
      this.tapNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.12), ctx.sampleRate)
      const d = this.tapNoise.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    }
    const src = ctx.createBufferSource()
    src.buffer = this.tapNoise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1500
    bp.Q.value = 5
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.16, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    src.connect(bp).connect(g)
    g.connect(this.master)
    g.connect(this.reverbSend)
    src.start(t)
    src.stop(t + 0.12)

    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(420, t)
    o.frequency.exponentialRampToValueAtTime(190, t + 0.09)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.1, t)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    o.connect(og).connect(this.master)
    o.start(t)
    o.stop(t + 0.15)
  }

  /** Rings the singing bowl (louder when a round completes). */
  bowl(strong = false): void {
    const ctx = this.ctx
    if (!ctx || !this.active || ctx.state !== 'running') return
    const base = strong ? 220 : BOWL_BASES[Math.floor(Math.random() * BOWL_BASES.length)]
    this.ringBowl(base, strong ? 0.15 : 0.09)
  }

  // ---------------------------------------------------------------- internals

  private build(ctx: AudioContext): void {
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -22
    comp.knee.value = 24
    comp.ratio.value = 3
    comp.attack.value = 0.02
    comp.release.value = 0.35
    comp.connect(ctx.destination)

    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(comp)

    const convolver = ctx.createConvolver()
    convolver.buffer = makeImpulse(ctx, 4.5)
    const reverbReturn = ctx.createGain()
    reverbReturn.gain.value = 0.7
    convolver.connect(reverbReturn).connect(this.master)
    this.reverbSend = ctx.createGain()
    this.reverbSend.gain.value = 0.55
    this.reverbSend.connect(convolver)

    const brown = makeNoise(ctx, 'brown')
    const pink = makeNoise(ctx, 'pink')
    const loop = (buf: AudioBuffer) => {
      const s = ctx.createBufferSource()
      s.buffer = buf
      s.loop = true
      this.sources.push(s)
      return s
    }
    const lfo = (rate: number, depth: number, target: AudioParam) => {
      const o = ctx.createOscillator()
      o.frequency.value = rate
      const g = ctx.createGain()
      g.gain.value = depth
      o.connect(g).connect(target)
      o.start()
      this.sources.push(o)
    }

    // 1. Stream: brown noise, bandpass 480Hz, slow volume wobble
    const stream = loop(brown)
    const sBp = ctx.createBiquadFilter()
    sBp.type = 'bandpass'
    sBp.frequency.value = 480
    sBp.Q.value = 0.55
    const sG = ctx.createGain()
    sG.gain.value = 0.55
    stream.connect(sBp).connect(sG).connect(this.master)
    sG.connect(this.reverbSend)
    lfo(0.13, 0.12, sG.gain)
    stream.start()

    // 2. Water sparkle: pink noise, bandpass 2300Hz, very low volume
    const spark = loop(pink)
    const spBp = ctx.createBiquadFilter()
    spBp.type = 'bandpass'
    spBp.frequency.value = 2300
    spBp.Q.value = 1.4
    const spG = ctx.createGain()
    spG.gain.value = 0.02
    spark.connect(spBp).connect(spG).connect(this.master)
    lfo(0.07, 520, spBp.frequency)
    spark.start(0, 3)

    // 3. Breeze through leaves: pink noise, lowpass 650Hz with drifting cutoff
    const breeze = loop(pink)
    const bLp = ctx.createBiquadFilter()
    bLp.type = 'lowpass'
    bLp.frequency.value = 650
    const bG = ctx.createGain()
    bG.gain.value = 0.3
    breeze.connect(bLp).connect(bG).connect(this.master)
    lfo(0.05, 260, bLp.frequency)
    lfo(0.09, 0.08, bG.gain)
    breeze.start(0, 5)

    // 4. Warm low drone on Sa (65.41Hz) and Pa (98Hz), slightly detuned
    const drone = ctx.createGain()
    drone.gain.value = 0.045
    drone.connect(this.master)
    for (const f of [65.41, 65.62, 98, 98.25]) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(drone)
      o.start()
      this.sources.push(o)
    }
  }

  private fadeTo(level: number, seconds: number): void {
    if (!this.ctx) return
    const g = this.master.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setValueAtTime(g.value, t)
    g.linearRampToValueAtTime(level, t + seconds)
  }

  private startScheduler(): void {
    const ctx = this.ctx
    if (!ctx) return
    window.clearInterval(this.schedTimer)
    this.nextPluck = ctx.currentTime + 0.3
    this.schedTimer = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return
      const now = this.ctx.currentTime
      if (this.nextPluck < now - 0.5) this.nextPluck = now + 0.1
      while (this.nextPluck < now + 0.6) {
        this.pluck(TANPURA[this.pluckIdx % TANPURA.length], this.nextPluck)
        this.pluckIdx++
        this.nextPluck += TANPURA_INTERVAL
      }
    }, 200)
  }

  private pluck(f: number, when: number): void {
    const ctx = this.ctx
    if (!ctx) return
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.Q.value = 1.1
    lp.frequency.setValueAtTime(Math.min(f * 8, 1500), when)
    lp.frequency.exponentialRampToValueAtTime(f * 2.2, when + 3)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.linearRampToValueAtTime(0.075, when + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, when + 5.5)
    for (const detune of [0, 5]) {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = f
      o.detune.value = detune
      o.connect(lp)
      o.start(when)
      o.stop(when + 5.6)
    }
    lp.connect(g)
    g.connect(this.master)
    g.connect(this.reverbSend)
  }

  private scheduleBowl(firstDelayMs?: number): void {
    window.clearTimeout(this.bowlTimer)
    const delay = firstDelayMs ?? 30000 + Math.random() * 18000
    this.bowlTimer = window.setTimeout(() => {
      this.bowl(false)
      this.scheduleBowl()
    }, delay)
  }

  private ringBowl(base: number, peak: number): void {
    const ctx = this.ctx
    if (!ctx) return
    const t = ctx.currentTime + 0.02
    const amps = [0.5, 0.28, 0.14, 0.07]
    BOWL_RATIOS.forEach((r, i) => {
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(peak * amps[i], t + 0.06)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 11 - i * 1.5)
      g.connect(this.master)
      g.connect(this.reverbSend)
      // two slightly detuned sines per partial give the slow beating
      const beat = 0.4 + i * 0.25
      for (const off of [0, beat]) {
        const o = ctx.createOscillator()
        o.type = 'sine'
        o.frequency.value = base * r + off
        o.connect(g)
        o.start(t)
        o.stop(t + 11.5)
      }
    })
  }

  private clearTimers(): void {
    window.clearInterval(this.schedTimer)
    window.clearTimeout(this.bowlTimer)
  }

  private teardown(): void {
    this.clearTimers()
    window.clearTimeout(this.suspendTimer)
    this.active = false
    try {
      this.sources.forEach((s) => s.stop())
      void this.ctx?.close()
    } catch {
      /* ignore */
    }
    this.sources = []
    this.ctx = null
  }
}
