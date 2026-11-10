import * as THREE from 'three'

const DEG = Math.PI / 180

interface PetalSpec {
  count: number; L: number; W: number; a0: number; a1: number; cup: number; y0: number; r0: number; offset: number; pink: number
}

/** A cupped, curved lotus petal with a white-to-pink vertex gradient. */
function petalGeometry(s: PetalSpec): THREE.BufferGeometry {
  const rows = 18
  const cols = 10
  const pos: number[] = []
  const col: number[] = []
  const idx: number[] = []
  const white = new THREE.Color('#fffaf6')
  const warm = new THREE.Color('#fff1e0')
  const pink = new THREE.Color('#e98fab')
  const deep = new THREE.Color('#d96b92')
  const c = new THREE.Color()

  let r = s.r0
  let h = 0
  const ds = s.L / rows
  for (let i = 0; i <= rows; i++) {
    const u = i / rows
    const alpha = (s.a0 + (s.a1 - s.a0) * Math.pow(u, 1.15)) * DEG
    const wu = s.W * Math.sin(Math.PI * Math.pow(0.1 + 0.9 * u, 0.85))
    const nx = -Math.sin(alpha)
    const ny = Math.cos(alpha)
    for (let j = 0; j <= cols; j++) {
      const v = -1 + (2 * j) / cols
      const cupLift = s.cup * v * v * wu
      pos.push(r + nx * cupLift, h + ny * cupLift, v * wu)
      // white at the base → pink at the tip, a touch deeper along the rim
      const t = THREE.MathUtils.clamp(Math.pow(u, 1.4) * s.pink + Math.pow(Math.abs(v), 3) * 0.18 * u, 0, 1)
      c.copy(white).lerp(warm, Math.max(0, 0.35 - u) * 1.2).lerp(pink, t * 0.9).lerp(deep, Math.pow(t, 3) * 0.35)
      col.push(c.r, c.g, c.b)
    }
    r += Math.cos(alpha) * ds
    h += Math.sin(alpha) * ds
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j
      const b = a + 1
      const d = a + cols + 1
      idx.push(a, b, d, b, d + 1, d)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function leafGeometry(): THREE.BufferGeometry {
  const rows = 10
  const cols = 6
  const pos: number[] = []
  const col: number[] = []
  const idx: number[] = []
  const rib = new THREE.Color('#2f5a3a')
  const edge = new THREE.Color('#7fa86a')
  const tip = new THREE.Color('#a9c27e')
  const c = new THREE.Color()
  for (let i = 0; i <= rows; i++) {
    const u = i / rows
    const w = 0.24 * Math.sin(Math.PI * Math.pow(u, 0.78)) * (1 - 0.1 * u)
    for (let j = 0; j <= cols; j++) {
      const v = -1 + (2 * j) / cols
      const fold = 0.35 * Math.abs(v) * w
      pos.push(u, fold - 0.12 * u * u + 0.05 * Math.sin(Math.PI * u), v * w)
      c.copy(edge).lerp(tip, u * 0.6).lerp(rib, Math.max(0, 1 - Math.abs(v) * 4.5) * 0.85)
      col.push(c.r, c.g, c.b)
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j
      idx.push(a, a + 1, a + cols + 1, a + 1, a + cols + 2, a + cols + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  g.translate(-0.5, 0, 0)
  return g
}

function padGeometry(): THREE.BufferGeometry {
  const notch = 0.2
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.absarc(0, 0, 1, notch, Math.PI * 2 - notch, false)
  shape.lineTo(0, 0)
  const g = new THREE.ShapeGeometry(shape, 56)
  g.rotateX(-Math.PI / 2)
  const p = g.attributes.position
  const cols: number[] = []
  const inner = new THREE.Color('#6f9f66')
  const outer = new THREE.Color('#3f7552')
  const c = new THREE.Color()
  for (let i = 0; i < p.count; i++) {
    const d = Math.hypot(p.getX(i), p.getZ(i))
    c.copy(inner).lerp(outer, Math.pow(d, 1.6))
    cols.push(c.r, c.g, c.b)
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  return g
}

function spriteTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 64
  const x = cv.getContext('2d')!
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,236,160,1)')
  g.addColorStop(0.3, 'rgba(240,200,100,0.7)')
  g.addColorStop(1, 'rgba(225,180,80,0)')
  x.fillStyle = g
  x.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(cv)
}

export interface LotusHandle { dispose(): void }

export function createLotusScene(container: HTMLElement, opts: { reduced: boolean; mobile: boolean }): LotusHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  const camBase = new THREE.Vector3(0, 2.7, 7.4)
  const look = new THREE.Vector3(0, 0.55, 0)
  camera.position.copy(camBase)

  scene.add(new THREE.HemisphereLight(0xfff7ee, 0xeacbd4, 1.15))
  const sun = new THREE.DirectionalLight(0xffefd2, 2.1)
  sun.position.set(3.5, 5, 2.5)
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0xffd6e2, 0.9)
  rim.position.set(-3, 2, -3)
  scene.add(rim)

  // ---- water
  const waterMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uR: { value: 2.9 } },
    vertexShader: `varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform float uR; varying vec2 vP;
      void main(){
        float d = length(vec2(vP.x, vP.y*1.25));
        float a = smoothstep(uR, uR*0.32, d);
        vec3 deep = vec3(0.50,0.66,0.62);
        vec3 light = vec3(0.80,0.89,0.85);
        float w = sin(vP.x*2.2+uTime*0.35)*sin(vP.y*1.9-uTime*0.28)*0.5+0.5;
        vec3 col = mix(light, deep, smoothstep(0.0,3.0,d)*0.75) + (w-0.5)*0.03;
        col += vec3(0.12,0.09,0.02)*smoothstep(4.0,0.0,length(vP-vec2(2.6,-3.4)));
        gl_FragColor = vec4(col, a*0.86);
      }`,
  })
  const water = new THREE.Mesh(new THREE.CircleGeometry(7.2, 96).rotateX(-Math.PI / 2), waterMat)
  scene.add(water)

  // ---- ripples
  const rippleGeo = new THREE.RingGeometry(0.94, 1, 96).rotateX(-Math.PI / 2)
  const ripples = Array.from({ length: 4 }, () => {
    const m = new THREE.Mesh(rippleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }))
    m.position.y = 0.006
    scene.add(m)
    return m
  })

  // ---- lotus
  const lotus = new THREE.Group()
  const petalMat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.55, metalness: 0, side: THREE.DoubleSide,
    emissive: new THREE.Color(0xffd9e4), emissiveIntensity: 0.32,
  })
  const layers: PetalSpec[] = [
    { count: 9, L: 1.08, W: 0.31, a0: 42, a1: 2, cup: 0.34, y0: 0.0, r0: 0.14, offset: 0, pink: 1.0 },
    { count: 8, L: 0.96, W: 0.28, a0: 64, a1: 30, cup: 0.5, y0: 0.04, r0: 0.11, offset: 0.35, pink: 0.95 },
    { count: 7, L: 0.72, W: 0.23, a0: 82, a1: 70, cup: 0.62, y0: 0.08, r0: 0.08, offset: 0.1, pink: 0.85 },
  ]
  const petalGeos: THREE.BufferGeometry[] = []
  for (const spec of layers) {
    const geo = petalGeometry(spec)
    petalGeos.push(geo)
    for (let i = 0; i < spec.count; i++) {
      const m = new THREE.Mesh(geo, petalMat)
      m.rotation.y = (i / spec.count) * Math.PI * 2 + spec.offset
      m.position.y = spec.y0
      lotus.add(m)
    }
  }
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9b24f, roughness: 0.5 })
  const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.14, 24), gold)
  pod.position.y = 0.3
  lotus.add(pod)
  const podTop = new THREE.Mesh(new THREE.CircleGeometry(0.155, 24).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xe6c466, roughness: 0.6 }))
  podTop.position.y = 0.372
  lotus.add(podTop)
  const dotGeo = new THREE.SphereGeometry(0.014, 8, 6)
  const dotMat = new THREE.MeshStandardMaterial({ color: 0x9a7a2c, roughness: 0.7 })
  for (let i = 0; i < 9; i++) {
    const a = (i / 8) * Math.PI * 2
    const rad = i === 8 ? 0 : 0.085
    const d = new THREE.Mesh(dotGeo, dotMat)
    d.position.set(Math.cos(a) * rad, 0.376, Math.sin(a) * rad)
    lotus.add(d)
  }
  const stamenGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.24, 5)
  const antherGeo = new THREE.SphereGeometry(0.014, 6, 5)
  const stamenMat = new THREE.MeshStandardMaterial({ color: 0xf2d27a, roughness: 0.6 })
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2
    const g = new THREE.Group()
    const s = new THREE.Mesh(stamenGeo, stamenMat)
    s.position.y = 0.12
    const t = new THREE.Mesh(antherGeo, stamenMat)
    t.position.y = 0.245
    g.add(s, t)
    g.position.set(Math.cos(a) * 0.2, 0.22, Math.sin(a) * 0.2)
    g.rotation.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18)
    lotus.add(g)
  }
  lotus.scale.setScalar(1.4)
  scene.add(lotus)

  // ---- lily pads
  const padGeo = padGeometry()
  const padMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, side: THREE.DoubleSide })
  const pads = [
    { x: -1.25, z: 1.0, s: 0.5, r: 1.2 },
    { x: 1.25, z: 0.95, s: 0.55, r: 3.4 },
    { x: -1.0, z: -1.4, s: 0.42, r: 5.0 },
    { x: 1.2, z: -1.4, s: 0.5, r: 0.4 },
  ].map((p, i) => {
    const m = new THREE.Mesh(padGeo, padMat)
    m.position.set(p.x, 0.015, p.z)
    m.scale.setScalar(p.s)
    m.rotation.y = p.r
    scene.add(m)
    return { m, base: p.r, ph: i * 1.7, bx: p.x, bz: p.z }
  })

  // ---- falling leaves
  const leafGeo = leafGeometry()
  const leafMats = [0xffffff, 0xe3efc8, 0xd2e6b4].map((c) => new THREE.MeshStandardMaterial({ color: c, vertexColors: true, roughness: 0.75, side: THREE.DoubleSide }))
  const leafCount = opts.mobile ? 12 : 20
  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const m = new THREE.Mesh(leafGeo, leafMats[i % 3])
    const sc = 0.2 + Math.random() * 0.16
    const l = {
      m, sc,
      x: (Math.random() - 0.5) * 8, z: -2.8 + Math.random() * 4.8, y: Math.random() * 5.2,
      vy: 0.12 + Math.random() * 0.14, ax: 0.2 + Math.random() * 0.3, ph: Math.random() * 6.28,
      rx: Math.random() * 6.28, ry: Math.random() * 6.28, rz: Math.random() * 6.28,
      vrx: 0.15 + Math.random() * 0.3, vry: 0.1 + Math.random() * 0.25, vrz: 0.1 + Math.random() * 0.2,
    }
    scene.add(m)
    return l
  })

  // ---- pollen
  const pollenCount = opts.mobile ? 36 : 70
  const pPos = new Float32Array(pollenCount * 3)
  const pSeed = Array.from({ length: pollenCount }, () => ({ x: (Math.random() - 0.5) * 5, z: -1.8 + Math.random() * 3.4, y: Math.random() * 3.4, v: 0.1 + Math.random() * 0.14, ph: Math.random() * 6.28 }))
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  const tex = spriteTexture()
  const pollen = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ map: tex, size: 0.12, transparent: true, depthWrite: false, sizeAttenuation: true, opacity: 0.9 }),
  )
  scene.add(pollen)

  // ---- interaction + sizing
  const mouse = new THREE.Vector2()
  const target = new THREE.Vector2()
  const onMove = (e: PointerEvent) => {
    target.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
  }
  if (!opts.reduced) window.addEventListener('pointermove', onMove, { passive: true })

  const resize = () => {
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setSize(w, h, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    camera.aspect = w / h
    // pull the camera back on narrow containers so the lotus stays framed
    camBase.z = 7.4 * Math.max(1, 0.8 / camera.aspect)
    const hw = Math.tan((15 * Math.PI) / 180) * camBase.z * camera.aspect
    waterMat.uniforms.uR.value = Math.min(2.9, hw * 1.02)
    padK = Math.min(1, hw / 2.7)
    camera.updateProjectionMatrix()
    if (opts.reduced || !running) render(2)
  }

  let padK = 1
  const clock = new THREE.Clock()
  let running = false
  let raf = 0
  let t = 0

  function update(time: number, dt: number) {
    waterMat.uniforms.uTime.value = time
    // lotus bobs and turns very slowly
    lotus.position.y = Math.sin(time * 0.55) * 0.035
    lotus.rotation.y = time * 0.045
    lotus.rotation.x = Math.sin(time * 0.31) * 0.012
    lotus.rotation.z = Math.cos(time * 0.27) * 0.012
    pads.forEach((p) => {
      p.m.position.set(p.bx * padK, 0.015 + Math.sin(time * 0.5 + p.ph) * 0.008, p.bz)
      p.m.rotation.y = p.base + Math.sin(time * 0.1 + p.ph) * 0.12
    })
    ripples.forEach((m, i) => {
      const p = (time / 11 + i / 4) % 1
      m.scale.setScalar(0.5 + p * 4.2)
      ;(m.material as THREE.MeshBasicMaterial).opacity = 0.5 * Math.pow(1 - p, 1.7) * Math.min(1, p * 9)
    })
    for (const l of leaves) {
      l.y -= l.vy * dt
      if (l.y < 0.05) {
        l.y = 5 + Math.random() * 0.6
        l.x = (Math.random() - 0.5) * 8
        l.z = -2.8 + Math.random() * 4.8
      }
      l.rx += l.vrx * dt; l.ry += l.vry * dt; l.rz += l.vrz * dt
      l.m.position.set(l.x + Math.sin(time * l.ax + l.ph) * 0.5, l.y, l.z + Math.cos(time * l.ax * 0.8 + l.ph) * 0.3)
      l.m.rotation.set(l.rx, l.ry, l.rz)
      const fade = Math.min(1, l.y / 0.5, (5.7 - l.y) / 0.5)
      l.m.scale.setScalar(l.sc * Math.max(0.001, fade))
    }
    for (let i = 0; i < pollenCount; i++) {
      const s = pSeed[i]
      s.y += s.v * dt
      if (s.y > 3.6) s.y = 0.15
      pPos[i * 3] = s.x + Math.sin(time * 0.3 + s.ph) * 0.25
      pPos[i * 3 + 1] = s.y
      pPos[i * 3 + 2] = s.z + Math.cos(time * 0.25 + s.ph) * 0.2
    }
    pGeo.attributes.position.needsUpdate = true
    // gentle parallax (drifts by itself when there is no pointer)
    mouse.lerp(target, 0.04)
    const mx = mouse.x + Math.sin(time * 0.12) * 0.25
    const my = mouse.y + Math.cos(time * 0.1) * 0.15
    camera.position.set(camBase.x + mx * 0.7, camBase.y - my * 0.35, camBase.z)
    camera.lookAt(look)
  }

  function render(time: number) {
    update(time, 0)
    renderer.render(scene, camera)
  }

  function loop() {
    raf = requestAnimationFrame(loop)
    const dt = Math.min(0.05, clock.getDelta())
    t += dt
    update(t, dt)
    renderer.render(scene, camera)
  }
  const start = () => {
    if (opts.reduced || raf) return
    clock.getDelta()
    running = true
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
    raf = 0
  }

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
  io.observe(container)
  resize()
  render(2)

  return {
    dispose() {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      petalGeos.forEach((g) => g.dispose())
      ;[rippleGeo, padGeo, leafGeo, pGeo, dotGeo, stamenGeo, antherGeo].forEach((g) => g.dispose())
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
      })
      tex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
