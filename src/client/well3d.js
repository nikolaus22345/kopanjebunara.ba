/* ==========================================================================
   Well 3D — "scroll to drill".

   A section model of the ground built from the same strata data the region
   pages use (src/data/regions.mjs -> aquiferTypes). Scale is real: 1 unit =
   10 m, so a karst well is visibly three times deeper than a Posavina one,
   which is the whole argument of the site — the price per metre is the same,
   the number of metres is not.

   Scroll drives the drill down the cut face; the camera follows the bit.
   When the bit reaches the water-bearing layer the casing, filter and
   gravel pack appear and water rises in the casing. Layer names are painted
   onto the cut face itself, so there is nothing to keep in sync in the DOM.
   ========================================================================== */

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Points, BufferGeometry,
  Float32BufferAttribute, PointsMaterial, BoxGeometry, CylinderGeometry, ConeGeometry,
  PlaneGeometry, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial,
  DirectionalLight, HemisphereLight, PointLight, CanvasTexture, SRGBColorSpace,
  RepeatWrapping, Color, PMREMGenerator, ACESFilmicToneMapping, PCFSoftShadowMap,
  AdditiveBlending, MathUtils,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const clamp01 = v => Math.min(1, Math.max(0, v))
const win = (t, a, b) => clamp01((t - a) / (b - a))
const ease = t => 1 - Math.pow(1 - t, 3)
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646 }

const U = 10          // metres per scene unit
const W = 6.2, D = 3.2, FRONT = D / 2
const HOLE = 0.36     // borehole width on the cut face

/* ---------- textures ---------- */

function tex(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

const shade = (hex, k) => {
  const c = new Color(hex)
  return `#${c.multiplyScalar(k).getHexString()}`
}

// the cut face of one layer: grain appropriate to the material, plus its name
function layerFace(layer, units, seed) {
  const pxPerUnit = 150
  const w = 930, h = Math.max(24, Math.round(units * pxPerUnit))
  return tex(w, h, (g) => {
    const r = rng(seed)
    g.fillStyle = layer.c; g.fillRect(0, 0, w, h)
    const n = layer.n.toLowerCase()
    const rocky = /vapnen|dolomit|lapor|fliš|pješčar|stijen|podina|pukotin|raspuca/.test(n)
    const grainy = /pijesak|šljunak/.test(n)
    // speckle
    for (let i = 0; i < w * h / 55; i++) {
      g.fillStyle = r() > 0.5 ? shade(layer.c, 0.82) : shade(layer.c, 1.14)
      const s = grainy ? 2 + r() * 4 : 1 + r() * 2
      g.fillRect(r() * w, r() * h, s, s * (grainy ? 0.8 : 0.6))
    }
    if (/šljunak/.test(n)) {                      // pebbles
      for (let i = 0; i < w * h / 900; i++) {
        g.fillStyle = r() > 0.5 ? shade(layer.c, 1.25) : shade(layer.c, 0.75)
        const s = 4 + r() * 9
        g.beginPath(); g.ellipse(r() * w, r() * h, s, s * 0.7, r() * 3, 0, 7); g.fill()
      }
    }
    if (rocky) {                                  // bedding and joints
      g.strokeStyle = shade(layer.c, 0.62); g.lineWidth = 1.5
      for (let y = 10 + r() * 20; y < h; y += 18 + r() * 26) {
        g.beginPath(); g.moveTo(0, y)
        for (let x = 0; x <= w; x += 40) g.lineTo(x, y + (r() - 0.5) * 5)
        g.stroke()
      }
      for (let i = 0; i < w * h / 6000; i++) {
        const x = r() * w, y = r() * h
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 12, y + 10 + r() * 22); g.stroke()
      }
    }
    if (layer.water) {                            // hatch = water-bearing, same code as the 2D strata
      g.strokeStyle = 'rgba(160,255,240,.30)'; g.lineWidth = 3
      for (let x = -h; x < w; x += 16) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + h, 0); g.stroke() }
    }
    // top edge line
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, w, 2)
    // label, left side, only if the layer is tall enough to carry it
    if (h >= 34) {
      g.font = `500 ${Math.min(28, h * 0.44)}px "Geist", system-ui, sans-serif`
      g.textBaseline = 'middle'
      const light = !layer.dark
      g.fillStyle = light ? 'rgba(10,20,18,.82)' : 'rgba(235,242,240,.9)'
      g.fillText(layer.n, 26, h / 2)
    }
  })
}

const grassTex = (base) => tex(512, 256, (g, w, h) => {
  const r = rng(3)
  g.fillStyle = base; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 5000; i++) { g.fillStyle = r() > 0.5 ? shade(base, 0.8) : shade(base, 1.2); g.fillRect(r() * w, r() * h, 2, 2) }
})

/* ========================================================================== */

export function mountWell({ canvas, types, initial, onFrame, onReady }) {
  const mobile = matchMedia('(max-width: 760px)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.5

  const camera = new PerspectiveCamera(32, 1, 0.1, 200)

  const sun = new DirectionalLight(new Color('#ffd9ad'), 2.6)
  sun.position.set(-6, 9, 8)
  sun.castShadow = true
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -3, near: 1, far: 40 })
  sun.shadow.bias = -0.0004
  // a cool fill from the front so deep layers are still readable
  const fill = new DirectionalLight(new Color('#bfe6ee'), 0.9)
  fill.position.set(2, -4, 10)
  scene.add(sun, fill, new HemisphereLight('#d8e6f0', '#3b3326', 0.55))

  // glow at the water, switched on when the bit strikes it
  const glow = new PointLight(new Color('#6fe3d0'), 0, 5, 1.6)
  scene.add(glow)

  /* ---------- static parts: rig, drill string ---------- */

  const rigMat = new MeshPhysicalMaterial({ color: '#d3822f', metalness: 0.35, roughness: 0.45, clearcoat: 0.5 })
  const darkMetal = new MeshStandardMaterial({ color: '#2a3031', metalness: 0.6, roughness: 0.4 })
  const steel = new MeshStandardMaterial({ color: '#9aa6a8', metalness: 0.85, roughness: 0.28 })

  const rig = new Group()
  const bed = new Mesh(new BoxGeometry(1.5, 0.28, 2.7), darkMetal); bed.position.set(0, 0.62, FRONT - 1.45)
  const cab = new Mesh(new BoxGeometry(1.45, 0.95, 0.95), rigMat); cab.position.set(0, 1.05, FRONT - 3.15)
  const glass = new Mesh(new BoxGeometry(1.2, 0.36, 0.02), new MeshPhysicalMaterial({ color: '#1b2a2e', roughness: 0.1, metalness: 0.2 }))
  glass.position.set(0, 1.25, FRONT - 3.635)
  const deck = new Mesh(new BoxGeometry(1.35, 0.5, 1.5), rigMat); deck.position.set(0, 1.0, FRONT - 1.7)
  const mastH = 3.6
  const mast = new Mesh(new BoxGeometry(0.2, mastH, 0.2), rigMat); mast.position.set(0, 0.76 + mastH / 2, FRONT - 0.18)
  const mastTop = new Mesh(new BoxGeometry(0.34, 0.2, 0.34), darkMetal); mastTop.position.set(0, 0.76 + mastH + 0.1, FRONT - 0.18)
  const brace = new Mesh(new BoxGeometry(0.08, 2.4, 0.08), rigMat); brace.position.set(0, 1.9, FRONT - 0.95); brace.rotation.x = 0.55
  for (const [x, z] of [[-0.62, FRONT - 0.6], [0.62, FRONT - 0.6], [-0.62, FRONT - 2.4], [0.62, FRONT - 2.4], [-0.62, FRONT - 3.1], [0.62, FRONT - 3.1]]) {
    const wh = new Mesh(new CylinderGeometry(0.3, 0.3, 0.24, 18), darkMetal)
    wh.rotation.z = Math.PI / 2; wh.position.set(x, 0.3, z); rig.add(wh)
  }
  rig.add(bed, cab, glass, deck, mast, mastTop, brace)
  rig.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } })
  scene.add(rig)

  // drill string: from the top of the mast down to the bit. Its length is
  // set every frame; the stripe texture makes the rotation visible.
  const stripe = tex(64, 256, (g, w, h) => {
    g.fillStyle = '#8c979a'; g.fillRect(0, 0, w, h)
    g.fillStyle = '#5b6467'
    for (let y = 0; y < h; y += 32) { g.save(); g.translate(0, y); g.transform(1, 0.5, 0, 1, 0, 0); g.fillRect(0, 0, w, 8); g.restore() }
  })
  stripe.wrapS = stripe.wrapT = RepeatWrapping
  const stringMat = new MeshStandardMaterial({ map: stripe, metalness: 0.8, roughness: 0.3 })
  const string = new Mesh(new CylinderGeometry(0.055, 0.055, 1, 16, 1, true), stringMat)
  string.castShadow = true
  const bit = new Mesh(new ConeGeometry(0.13, 0.28, 20), steel)
  bit.rotation.x = Math.PI
  scene.add(string, bit)

  // cuttings riding up the annulus
  const NP = mobile ? 70 : 140
  const cutPos = new Float32Array(NP * 3), cutSeed = new Float32Array(NP)
  const cr = rng(17)
  for (let i = 0; i < NP; i++) cutSeed[i] = cr()
  const cutGeo = new BufferGeometry()
  cutGeo.setAttribute('position', new Float32BufferAttribute(cutPos, 3))
  const cutMat = new PointsMaterial({ color: '#c9b089', size: mobile ? 0.05 : 0.04, transparent: true, opacity: 0.9, depthWrite: false })
  const cuttings = new Points(cutGeo, cutMat)
  scene.add(cuttings)

  /* ---------- per-terrain parts: rebuilt on switch ---------- */

  let ground = null, cfg = null

  function build(key) {
    if (ground) {
      scene.remove(ground)
      ground.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.map?.dispose(); m.dispose() })
      })
    }
    const t = types[key]
    const total = t.strata.reduce((a, l) => a + l.h, 0)
    const depthM = t.depth[1]
    const g = new Group()

    // stack layers; remember where water is
    let top = 0, waterTop = null, waterBot = null
    const layers = t.strata.map((l, i) => {
      const units = (l.h / total) * (depthM / U)
      const faceTex = layerFace(l, units, 11 + i * 7)
      const sideMat = new MeshStandardMaterial({ color: shade(l.c, 0.8), roughness: 1 })
      const face = new MeshStandardMaterial({ map: faceTex, roughness: 0.95 })
      const topMat = i === 0 ? new MeshStandardMaterial({ map: grassTex(t.surface), roughness: 1 }) : sideMat
      const mesh = new Mesh(new BoxGeometry(W, units, D), [sideMat, sideMat, topMat, sideMat, face, sideMat])
      mesh.position.y = -(top + units / 2)
      mesh.receiveShadow = true
      g.add(mesh)
      const rec = { n: l.n, water: !!l.water, top, bot: top + units }
      if (l.water && waterTop === null) { waterTop = top; waterBot = top + units }
      top += units
      return rec
    })

    // bedrock plinth below, so the model doesn't end on the water
    const plinth = new Mesh(new BoxGeometry(W, 0.5, D), new MeshStandardMaterial({ color: '#1a1f1e', roughness: 1 }))
    plinth.position.y = -(top + 0.25)
    g.add(plinth)

    // surface dressing
    const tr = rng(key.length * 13)
    for (let i = 0; i < 5; i++) {
      const s = 0.35 + tr() * 0.35
      const tree = new Mesh(new ConeGeometry(s * 0.55, s * 1.6, 7), new MeshStandardMaterial({ color: t.tree, roughness: 1 }))
      const x = (tr() > 0.5 ? 1 : -1) * (1.2 + tr() * 1.6)
      tree.position.set(x, s * 0.8, -0.4 - tr() * 1.1)
      tree.castShadow = true
      g.add(tree)
    }
    if (key === 'krs') for (let i = 0; i < 8; i++) {
      const s = 0.1 + tr() * 0.18
      const b = new Mesh(new BoxGeometry(s * 1.6, s, s * 1.2), new MeshStandardMaterial({ color: '#b6bab3', roughness: 0.9 }))
      b.position.set(-2.8 + tr() * 5.6, s / 2 - 0.02, -1.3 + tr() * 2.4); b.rotation.y = tr() * 3
      b.castShadow = true; g.add(b)
    }

    // the well itself, drawn on the cut face
    const zf = FRONT + 0.004
    const hole = new Mesh(new PlaneGeometry(HOLE, 1), new MeshBasicMaterial({ color: '#0b0f0f' }))
    hole.position.z = zf
    const casMat = new MeshStandardMaterial({ color: '#e9eeec', roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -1 })
    const casL = new Mesh(new PlaneGeometry(0.045, 1), casMat), casR = casL.clone()
    casL.position.set(-HOLE / 2 + 0.022, 0, zf + 0.002); casR.position.set(HOLE / 2 - 0.022, 0, zf + 0.002)
    // filter slots over the water-bearing layer
    const slots = new Group()
    const wt = waterTop ?? top * 0.7, wb = waterBot ?? top * 0.9
    for (let y = wt + 0.06; y < wb - 0.04; y += 0.07) for (const x of [-HOLE / 2 + 0.022, HOLE / 2 - 0.022]) {
      const s = new Mesh(new PlaneGeometry(0.03, 0.012), new MeshBasicMaterial({ color: '#23302e' }))
      s.position.set(x, -y, zf + 0.004); slots.add(s)
    }
    // gravel pack either side of the filter
    const packTex = tex(64, 256, (gg, w, h) => { const r = rng(5); gg.fillStyle = '#c5b28c'; gg.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { gg.fillStyle = r() > 0.5 ? '#9c8a66' : '#e3d4b0'; gg.beginPath(); gg.arc(r() * w, r() * h, 1.5 + r() * 2.5, 0, 7); gg.fill() } })
    const packMat = new MeshStandardMaterial({ map: packTex, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1 })
    const packL = new Mesh(new PlaneGeometry(0.16, wb - wt + 0.1), packMat), packR = packL.clone()
    packL.position.set(-HOLE / 2 - 0.08, -(wt + wb) / 2, zf + 0.001); packR.position.set(HOLE / 2 + 0.08, -(wt + wb) / 2, zf + 0.001)
    // water in the casing
    const waterMat = new MeshBasicMaterial({ color: '#5fe0cc', transparent: true, opacity: 0.88 })
    const water = new Mesh(new PlaneGeometry(HOLE - 0.09, 1), waterMat)
    water.position.z = zf + 0.003

    g.add(hole, casL, casR, slots, packL, packR, water)
    scene.add(g)
    ground = g

    // target: middle of the first water-bearing layer; static level a little above it
    const target = waterTop !== null ? (waterTop + waterBot) / 2 : top * 0.8
    const staticLvl = Math.max(0.25, (waterTop ?? target) * 0.55)
    cfg = { key, t, layers, top, target, staticLvl, waterTop: wt, waterBot: wb, hole, casL, casR, slots, packL, packR, water, waterMat }
  }

  build(initial)

  /* ---------- camera ---------- */

  let W_ = 1, H_ = 1
  function resize() {
    const r = canvas.getBoundingClientRect()
    W_ = Math.max(1, r.width); H_ = Math.max(1, r.height)
    renderer.setSize(W_, H_, false)
    camera.aspect = W_ / H_
  }
  resize()
  addEventListener('resize', resize)

  let p = 0, pT = 0, mx = 0, tmx = 0
  addEventListener('pointermove', e => { tmx = (e.clientX / innerWidth) * 2 - 1 }, { passive: true })

  function placeCamera(depth, done) {
    const portrait = W_ / H_ < 1
    const k = easeInOut(win(p, 0, 0.16))            // establishing -> drilling
    const az = MathUtils.lerp(-0.62, 0.12, k) + mx * 0.05
    const el = MathUtils.lerp(0.34, 0.03, k)
    let dist = MathUtils.lerp(17, 10.5, k) + done * 3.5
    const fit = 3.6 / (Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect)
    dist = Math.max(dist, fit)
    const ty = MathUtils.lerp(0.9, -depth + 0.9, k) + done * (depth * 0.45)
    camera.position.set(Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist)
    camera.lookAt(0, ty, 0)
    // leave room for the HUD: model sits right on desktop, low on phones
    const off = 1 - done * 0.6
    camera.setViewOffset(W_, H_, portrait ? 0 : -W_ * 0.2 * off, portrait ? -H_ * (0.12 + 0.12 * k) * off : 0, W_, H_)
    camera.updateProjectionMatrix()
  }

  /* ---------- loop ---------- */

  let running = true, raf = 0, last = performance.now(), spin = 0
  const t0 = performance.now()

  function frame(now) {
    raf = requestAnimationFrame(frame)
    if (!running) return
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    const time = (now - t0) / 1000
    p += (pT - p) * 0.1
    mx += (tmx - mx) * 0.05

    const c = cfg
    const drillK = ease(win(p, 0.12, 0.82))
    const depth = c.target * drillK                   // units below surface
    const struck = depth >= c.waterTop - 0.001 && drillK > 0.02
    const done = win(p, 0.84, 0.98)                    // water rises, camera backs off

    // borehole grows; casing follows slightly behind the bit
    c.hole.scale.y = Math.max(0.001, depth); c.hole.position.y = -depth / 2
    const cas = Math.max(0.001, depth - 0.25) * (0.35 + 0.65 * win(p, 0.3, 0.86))
    for (const m of [c.casL, c.casR]) { m.scale.y = cas; m.position.y = -cas / 2 }
    const packOn = win(p, 0.8, 0.9)
    c.packL.visible = c.packR.visible = c.slots.visible = packOn > 0
    c.packL.material.opacity = packOn; c.packL.material.transparent = packOn < 1

    // water: from the bit up to the static level
    const rise = struck ? ease(done) : 0
    const wTop = MathUtils.lerp(depth, c.staticLvl, rise)
    const wh = Math.max(0.001, depth - wTop)
    c.water.visible = struck && wh > 0.01
    c.water.scale.y = wh; c.water.position.y = -(wTop + wh / 2)
    c.waterMat.opacity = 0.75 + Math.sin(time * 3) * 0.08
    glow.intensity = struck ? 1.6 + rise * 2.2 : 0
    glow.position.set(0, -depth + 0.1, FRONT + 0.6)

    // drill string from the mast head to the bit, turning while it drills
    const headY = 0.76 + 3.6
    const drilling = drillK > 0.01 && drillK < 0.999
    spin += dt * (drilling ? 9 : 0.6)
    const len = headY + depth
    string.scale.y = len; string.position.set(0, headY - len / 2, FRONT + 0.02)
    stripe.offset.y = spin * 0.35
    string.visible = done < 0.5
    bit.position.set(0, -depth - 0.1, FRONT + 0.02); bit.rotation.y = spin
    bit.visible = done < 0.5

    // cuttings: only while actually cutting
    const a = cutGeo.attributes.position.array
    const layerNow = c.layers.find(l => depth >= l.top && depth < l.bot) || c.layers[c.layers.length - 1]
    for (let i = 0; i < NP; i++) {
      const f = (cutSeed[i] + time * (0.35 + cutSeed[i] * 0.4)) % 1
      const y = -depth + f * depth
      const x = (cutSeed[i] - 0.5) * (HOLE - 0.1)
      a.set([x + Math.sin(time * 4 + i) * 0.015, y, FRONT + 0.03], i * 3)
    }
    cutGeo.attributes.position.needsUpdate = true
    cutMat.opacity = drilling ? 0.85 : 0
    if (layerNow) cutMat.color.set(c.t.strata[c.layers.indexOf(layerNow)]?.c || '#c9b089').multiplyScalar(1.25)

    placeCamera(depth, done)
    renderer.render(scene, camera)

    onFrame && onFrame({
      metres: Math.round(depth * U),
      layer: layerNow?.n || '',
      struck, done,
      targetMetres: Math.round(c.target * U),
    })
  }
  raf = requestAnimationFrame(frame)
  requestAnimationFrame(() => onReady && onReady())

  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting && !document.hidden }, { threshold: 0 })
  io.observe(canvas)
  document.addEventListener('visibilitychange', () => { running = !document.hidden })

  return {
    setProgress(v) { pT = clamp01(v) },
    setType(key) { if (types[key] && key !== cfg.key) build(key) },
    dispose() { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); pmrem.dispose() },
  }
}
