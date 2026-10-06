/* ==========================================================================
   Orion Stil — client. Progressive enhancement only: every page is complete
   HTML without this file, and every effect here backs off for reduced
   motion, touch, and browsers without WebGL.
   ========================================================================== */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const mq = q => matchMedia(q).matches
const REDUCED = mq('(prefers-reduced-motion: reduce)')
const FINE = mq('(hover: hover) and (pointer: fine)')
const DESKTOP = () => mq('(min-width: 901px)') && FINE

document.documentElement.classList.add('js')

/* ---------- smooth scroll (desktop pointer only; touch keeps native) ---------- */

let lenis = null
if (!REDUCED && FINE) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  // in-page anchors go through Lenis so they glide too
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || a.getAttribute('href').length < 2) return
    const el = document.querySelector(a.getAttribute('href'))
    if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80 }) }
  })
}

/* ---------- header: solid after the fold, hides while reading down ---------- */

const header = $('.site-header')
if (header) {
  let last = 0
  const onScroll = () => {
    const y = scrollY
    header.classList.toggle('scrolled', y > 40)
    header.classList.toggle('hide', y > 600 && y > last && !document.body.classList.contains('nav-open'))
    last = y
  }
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

/* ---------- mobile nav ---------- */

const toggle = $('.nav-toggle'), nav = $('#nav')
if (toggle && nav) {
  const set = open => {
    toggle.setAttribute('aria-expanded', String(open))
    toggle.textContent = open ? 'Zatvori' : 'Izbornik'
    nav.classList.toggle('open', open)
    document.body.classList.toggle('nav-open', open)
    open ? lenis?.stop() : lenis?.start()
  }
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'))
  nav.addEventListener('click', e => { if (e.target.closest('a')) set(false) })
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) set(false) })
}

/* ---------- reveals ---------- */

const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })

// line-by-line headline reveal: words are grouped by the line they land on
function splitLines(el) {
  // Top-level text becomes one span per word; inline elements (em.s) stay
  // whole units. Spacing is recorded per unit so "jedro." never gains a gap.
  for (const n of [...el.childNodes]) {
    if (n.nodeType !== 3) continue
    const frag = document.createDocumentFragment()
    n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return
      if (/^\s+$/.test(part)) frag.append(' ')
      else { const s = document.createElement('span'); s.className = 'wd'; s.textContent = part; frag.append(s) }
    })
    n.replaceWith(frag)
  }
  const units = []
  let gap = false
  for (const n of el.childNodes) {
    if (n.nodeType === 3) { if (/\s/.test(n.textContent)) gap = true; continue }
    units.push({ n, gap }); gap = false
  }
  if (!units.length) return
  // group by rendered line; tolerance scales with the type size
  const tol = parseFloat(getComputedStyle(el).fontSize) * 0.45
  const lines = []
  let top = null
  for (const u of units) {
    const y = u.n.getBoundingClientRect().top
    const punct = /^[.,:;!?...—–-]+$/.test(u.n.textContent)
    if (top === null || (!punct && Math.abs(y - top) > tol)) { lines.push([]); top = y }
    lines[lines.length - 1].push(u)
  }
  el.innerHTML = lines.map((ln, i) =>
    `<span class="ln"><span style="--d:${(i * 0.09).toFixed(2)}s">${ln.map((u, j) => (j && u.gap ? ' ' : '') + u.n.outerHTML).join('')}</span></span>`).join('')
  el.classList.add('split')
}

// the original site's .reveal blocks: same observer, so they never stay hidden
$$('.reveal').forEach(el => (REDUCED ? el.classList.add('in') : io.observe(el)))

if (!REDUCED) {
  const splitTargets = $$('[data-split]')
  document.fonts?.ready.then(() => {
    for (const el of splitTargets) { splitLines(el); io.observe(el) }
  })
  $$('[data-rv]').forEach((el, i) => {
    el.classList.add('rv')
    if (el.dataset.rv) el.style.setProperty('--d', el.dataset.rv + 's')
    io.observe(el)
  })
  $$('.grid > *, .areas > *, .pgrid > *, .faq details').forEach((el, i, all) => {
    el.classList.add('rv')
    const idx = [...el.parentElement.children].indexOf(el)
    el.style.setProperty('--d', `${Math.min(idx, 6) * 0.06}s`)
    io.observe(el)
  })
}

/* ---------- 3D hero ---------- */

/* Scroll to drill. The HUD (metres, price, layer) is plain DOM fed by the
   3D loop; without WebGL the section collapses to the photo hero. */
const hero = $('.hero3d')
if (hero) {
  const canvas = $('canvas', hero)
  const copy = $('.hero3d-copy', hero)
  const hud = $('.well-hud', hero)
  const caption = $('.hero3d-caption', hero)
  const hint = $('.scroll-hint', hero)
  const rate = Number(hero.dataset.rate) || 200
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const out = k => $(`[data-hud="${k}"]`, hero)
  const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } })()
  const saveData = navigator.connection?.saveData
  let api = null

  const st = ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: self => {
      const p = self.progress
      if (copy) { copy.style.opacity = String(1 - gsap.utils.clamp(0, 1, (p - 0.04) / 0.14)); copy.style.transform = `translateY(${-p * 90}px)` }
      const hv = api ? gsap.utils.clamp(0, 1, (p - 0.1) / 0.08) : 0
      if (hud) hud.style.opacity = String(hv)
      hero.style.setProperty('--hudbg', String(hv))
      if (caption) caption.style.opacity = String(gsap.utils.clamp(0, 1, (p - 0.86) / 0.08))
      if (hint) hint.style.opacity = String(1 - p * 8)
      api?.setProgress(p)
    },
  })

  // terrain switch
  const buttons = $$('[data-type]', hero)
  for (const b of buttons) b.addEventListener('click', () => {
    buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)))
    api?.setType(b.dataset.type)
  })

  let lastM = -1, lastStruck = null
  const onFrame = ({ metres, layer, struck, targetMetres }) => {
    if (metres !== lastM) {
      out('metres').textContent = metres
      out('price').textContent = fmt(Math.round((metres * rate) / 100) * 100)
      out('layer').textContent = layer
      out('target').textContent = targetMetres
      lastM = metres
    }
    if (struck !== lastStruck) { hud?.classList.toggle('struck', struck); lastStruck = struck }
  }

  if (gl && !REDUCED && !saveData && canvas) {
    const types = JSON.parse($('#well-data')?.textContent || '{}')
    const initial = buttons.find(b => b.getAttribute('aria-pressed') === 'true')?.dataset.type || Object.keys(types)[0]
    // Start straight away: the headline is plain HTML and the chunk is
    // modulepreloaded, so waiting for idle only delayed the model. If the
    // chunk fails, drop the .gl flag so the photo fallback comes back.
    // layer names are painted into canvas textures once, so the face must
    // be loaded first or they'd bake in the fallback font
    Promise.all([import('./well3d.js'), document.fonts?.load('500 28px "Geist"').catch(() => {})]).then(([{ mountWell }]) => {
      api = mountWell({ canvas, types, initial, onFrame, onReady: () => hero.classList.add('gl-on') })
      api.setProgress(st.progress)
    }).catch(() => document.documentElement.classList.remove('gl'))
  } else {
    document.documentElement.classList.remove('gl')
  }
}

/* ---------- manifesto: words light up with scroll ---------- */

for (const m of $$('.manifesto')) {
  if (REDUCED) break
  const walker = document.createTreeWalker(m, NodeFilter.SHOW_TEXT)
  const texts = []
  while (walker.nextNode()) texts.push(walker.currentNode)
  for (const t of texts) {
    const frag = document.createDocumentFragment()
    t.textContent.split(/(\s+)/).forEach(p => {
      if (!p) return
      if (/^\s+$/.test(p)) frag.append(' ')
      else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.append(s) }
    })
    t.replaceWith(frag)
  }
  const ws = $$('.w', m)
  ScrollTrigger.create({
    trigger: m, start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: ({ progress }) => {
      const lit = progress * ws.length
      ws.forEach((w, i) => { w.style.opacity = String(0.14 + 0.86 * gsap.utils.clamp(0, 1, lit - i)) })
    },
  })
}

/* ---------- product rail: vertical scroll drives it sideways ---------- */

const railWrap = $('.rail-wrap')
if (railWrap && !REDUCED) {
  const rail = $('.rail', railWrap)
  const bar = $('.rail-progress i', railWrap)
  ScrollTrigger.matchMedia({
    '(min-width: 901px) and (hover: hover)': () => {
      const dist = () => Math.max(0, rail.scrollWidth - innerWidth)
      const tw = gsap.to(rail, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: railWrap, start: 'center center', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => bar && (bar.style.transform = `scaleX(${s.progress})`),
        },
      })
      return () => tw.scrollTrigger?.kill()
    },
  })
  if (FINE) for (const card of $$('.rail-card', railWrap)) {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      card.style.setProperty('--ry', `${x * 8}deg`); card.style.setProperty('--rx', `${-y * 8}deg`)
    })
    card.addEventListener('pointerleave', () => { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg') })
  }
}

/* ---------- lazy video: load near the viewport, pause off it ---------- */

const vio = new IntersectionObserver(entries => {
  for (const { target: v, isIntersecting } of entries) {
    if (isIntersecting) {
      if (!v.dataset.loaded) {
        const wide = innerWidth > 1300 && !navigator.connection?.saveData
        v.src = wide ? v.dataset.srcHd : v.dataset.src
        v.dataset.loaded = '1'
      }
      if (!REDUCED) v.play().catch(() => {})
    } else v.pause()
  }
}, { rootMargin: '25% 0px' })
$$('video[data-src]').forEach(v => vio.observe(v))

/* ---------- cinematic band: the frame opens up as you scroll into it ---------- */

for (const cine of $$('.cine')) {
  if (REDUCED) break
  const media = $('.cine-media', cine)
  gsap.fromTo(media, { '--ci': '14%', '--cs': 1.18 }, {
    '--ci': '0%', '--cs': 1, ease: 'none',
    scrollTrigger: { trigger: cine, start: 'top top', end: 'bottom bottom', scrub: true },
  })
  gsap.fromTo($('.cine-copy', cine), { y: 60, opacity: 0 }, {
    y: 0, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: cine, start: 'top top', end: '45% bottom', scrub: true },
  })
}

/* ---------- parallax media ---------- */

if (!REDUCED) {
  for (const el of $$('.bura-media, .page-head .ph-bg')) {
    gsap.fromTo(el, { yPercent: -6 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
  }
}

/* ---------- ground comparison: an <input type=range> does the work ---------- */

for (const c of $$('.compare')) {
  const input = $('input', c)
  const set = v => c.style.setProperty('--pos', v + '%')
  input?.addEventListener('input', () => set(input.value))
  // nudge on first view so people see it moves
  if (!REDUCED && input) {
    ScrollTrigger.create({
      trigger: c, start: 'top 70%', once: true,
      onEnter: () => gsap.fromTo({ v: 50 }, { v: 50 }, { v: 28, duration: 0.9, ease: 'power2.inOut', yoyo: true, repeat: 1, onUpdate() { const v = this.targets()[0].v; set(v); input.value = v } }),
    })
  }
}

/* ---------- process: the line draws, the steps light up ---------- */

for (const list of $$('.steps')) {
  const line = document.createElement('i')
  line.className = 'line'
  list.prepend(line)
  if (REDUCED) { line.style.transform = 'none'; continue }
  gsap.to(line, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: true } })
  for (const li of $$('li', list)) ScrollTrigger.create({ trigger: li, start: 'top 65%', onToggle: s => li.classList.toggle('on', s.isActive || s.progress > 0), end: 'max' })
}

/* ---------- marquee: drifts on its own, speeds and leans with scroll ---------- */

const marquees = $$('.marquee')
if (marquees.length && !REDUCED) {
  const tracks = marquees.map((m, i) => {
    const t = $('.marquee-track', m)
    t.innerHTML += t.innerHTML                          // seamless loop
    $$('a', t).slice(t.children.length / 2).forEach(a => { a.setAttribute('tabindex', '-1'); a.setAttribute('aria-hidden', 'true') })
    return { m, t, x: 0, dir: i % 2 ? 1 : -1 }
  })
  let vel = 0
  ScrollTrigger.create({ onUpdate: s => { vel = s.getVelocity() } })
  gsap.ticker.add((_, dt) => {
    vel *= 0.92
    const boost = 1 + Math.min(6, Math.abs(vel) / 400)
    const skew = gsap.utils.clamp(-8, 8, vel / -200)
    for (const k of tracks) {
      const half = k.t.scrollWidth / 2
      k.x += k.dir * 0.04 * dt * boost
      if (k.x <= -half) k.x += half
      if (k.x > 0) k.x -= half
      k.t.style.transform = `translate3d(${k.x}px,0,0) skewX(${skew}deg)`
    }
  })
}

/* ---------- magnetic primary buttons ---------- */

if (FINE && !REDUCED) {
  for (const b of $$('.btn-lg, .cta-big .btn')) {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect()
      b.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`)
      b.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * 0.3}px`)
    })
    b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px') })
  }
}

/* ---------- where the visitor came from ----------
   Remembered once per visit, on whichever page they land, so the inquiry
   email can say "came from Google, landed on /podrucja/mostar/". Storage
   can be blocked (private mode), so every access is guarded. */

const FIRST = 'kb-first-touch'
const store = {
  get() { try { return JSON.parse(sessionStorage.getItem(FIRST) || 'null') } catch { return null } },
  set(v) { try { sessionStorage.setItem(FIRST, JSON.stringify(v)) } catch {} },
}
if (!store.get()) {
  const q = new URLSearchParams(location.search)
  const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(k => q.get(k)).filter(Boolean).join(' / ')
  let ref = ''
  try { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) ref = r.host + r.pathname } catch {}
  store.set({ page: location.pathname, ref: ref || 'direktno', utm })
}

/* ---------- inquiry form: five steps, then Web3Forms -> owner's inbox ---------- */

const upit = $('#upit-form')
if (upit) {
  const steps = $$('.step', upit)
  const prev = $('[data-prev]', upit), next = $('[data-next]', upit), submit = $('[data-submit]', upit)
  const bar = $('.upit-progress i', upit), now = $('[data-step-now]', upit)
  const err = $('.upit-error', upit), done = $('#upit-done')
  const opcina = $('#u-opcina', upit), estimate = $('[data-estimate]', upit)
  const rate = Number(upit.dataset.rate) || 200
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const set = (name, v) => { const el = upit.elements.namedItem(name); if (el) el.value = v }
  let i = 0

  upit.classList.add('is-stepped')
  $('[data-step-total]', upit).textContent = steps.length

  // ?opcina=<slug> from the estimator or a region page
  const want = new URLSearchParams(location.search).get('opcina')
  if (want) {
    const o = [...opcina.options].find(x => x.dataset.slug === want)
    if (o) opcina.value = o.value
  }

  const estimateText = () => {
    const o = opcina.selectedOptions[0]
    if (!o?.dataset.depth) return ''
    const [a, b] = o.dataset.depth.split('-').map(Number)
    return `${o.value}: ${a}-${b} m, od ${fmt(Math.round(a * rate / 100) * 100)} do ${fmt(Math.round(b * rate / 100) * 100)} KM`
  }
  const showEstimate = () => {
    const t = estimateText()
    estimate.hidden = !t
    if (t) estimate.textContent = `Okvirno za vašu općinu: ${t.split(': ')[1]}. Konačnu cijenu daje ekipa na terenu.`
  }
  opcina.addEventListener('change', showEstimate)

  const show = n => {
    i = Math.max(0, Math.min(steps.length - 1, n))
    steps.forEach((s, k) => { s.hidden = k !== i })
    prev.hidden = i === 0
    next.hidden = i === steps.length - 1
    submit.hidden = i !== steps.length - 1
    bar.style.transform = `scaleX(${(i + 1) / steps.length})`
    now.textContent = i + 1
    err.hidden = true
    if (i === 3) showEstimate()
  }

  // validate only the fields of the current step
  const valid = () => {
    for (const el of $$('input, select, textarea', steps[i])) {
      if (!el.checkValidity()) {
        err.textContent = el.type === 'radio' ? 'Odaberite jednu od ponuđenih opcija.'
          : el.type === 'checkbox' ? 'Potrebna je saglasnost da bismo vam mogli odgovoriti.'
          : el.type === 'tel' ? 'Upišite broj telefona na koji vas možemo dobiti.'
          : 'Ovo polje je potrebno.'
        err.hidden = false
        ;(el.type === 'radio' ? el.closest('.choice') : el).scrollIntoView({ block: 'center', behavior: 'smooth' })
        if (el.type !== 'radio') el.focus({ preventScroll: true })
        return false
      }
    }
    return true
  }

  const top = () => upit.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' })
  next.addEventListener('click', () => { if (valid()) { show(i + 1); top() } })
  prev.addEventListener('click', () => { show(i - 1); top() })
  // Enter in a text field moves forward instead of submitting half a form
  upit.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && i < steps.length - 1) { e.preventDefault(); next.click() }
  })

  upit.addEventListener('submit', async e => {
    e.preventDefault()
    if (!valid()) return
    const ft = store.get() || {}
    set('Okvirna procjena', estimateText())
    set('Poslano sa stranice', location.pathname + location.search)
    set('Prva posjećena stranica', ft.page || '')
    set('Došao sa', ft.ref || '')
    set('Kampanja (UTM)', ft.utm || '')
    set('Uređaj', `${matchMedia('(pointer: coarse)').matches ? 'mobitel' : 'računar'}, ${innerWidth}x${innerHeight}`)
    const data = Object.fromEntries(new FormData(upit))
    const where = [data['Općina'], data['Naselje']].filter(Boolean).join(', ')
    data.subject = `Novi upit: ${where || 'bunar'}${data['Namjena'] ? `, ${data['Namjena']}` : ''}`
    delete data.redirect
    delete data.botcheck
    // unanswered fields stay out of the email; an empty "email" would also
    // fail Web3Forms' reply-to validation
    for (const k of Object.keys(data)) if (data[k] === '') delete data[k]
    if (upit.elements.namedItem('botcheck').checked) return       // a bot ticked the hidden box

    submit.disabled = true
    submit.textContent = 'Šaljem...'
    try {
      const r = await fetch(upit.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || j.success === false) throw new Error(j.message || r.status)
      window.gtag?.('event', 'generate_lead', { method: 'upit', opcina: data['Općina'] || '', namjena: data['Namjena'] || '' })
      upit.hidden = true
      done.hidden = false
      done.focus()
      done.scrollIntoView({ block: 'center' })
    } catch {
      err.textContent = 'Slanje nije uspjelo. Provjerite internet vezu i pokušajte ponovo za minutu.'
      err.hidden = false
      submit.disabled = false
      submit.textContent = 'Pošalji upit'
    }
  })

  show(0)
}

/* ---------- video cards: click to play ----------
   Posters are plain <img>; nothing video-related loads until asked. */

for (const card of $$('.vcard')) {
  const btn = $('.vcard-play', card)
  if (!btn) continue
  btn.addEventListener('click', () => {
    const v = document.createElement('video')
    Object.assign(v, { src: card.dataset.video, controls: true, autoplay: true, loop: true, muted: true, playsInline: true })
    v.setAttribute('playsinline', '')
    const poster = $('.vcard-play img', card)
    if (poster) v.poster = poster.getAttribute('src')
    btn.replaceWith(v)
    v.play()?.catch(() => { v.controls = true })
  }, { once: true })
}

/* ---------- estimator ----------
   Depth comes from the municipality, price is the published floor, the
   total is the two multiplied and labelled "od". Namjena only decides the
   permit answer. */

const tool = $('#estimator')
const estData = $('#estimator-data')
if (tool && estData) {
  const DATA = JSON.parse(estData.textContent)
  const RATE = parseInt(tool.dataset.rate, 10) || 200
  const select = $('#est-region', tool)
  const useInputs = $$('input[name="est-use"]', tool)
  const out = k => $(`[data-out="${k}"]`, tool)
  const USE = {
    kuca: { label: 'domaćinstvo', permit: false },
    navod: { label: 'navodnjavanje', permit: true },
    posao: { label: 'poslovnu namjenu', permit: true },
  }
  const ENTITY = {
    FBiH: { body: 'Agencija za vodno područje rijeke Save, odnosno Jadranskog mora za Hercegovinu', law: 'Zakonu o vodama FBiH' },
    RS: { body: 'JU "Vode Srpske"', law: 'Zakonu o vodama RS' },
    BD: { body: 'nadležni organ Brčko distrikta', law: 'propisima Brčko distrikta' },
  }
  // bs-BA locale data is not reliably in browsers: dot separator by hand
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const render = () => {
    const r = DATA[select.value]
    if (!r) return
    const use = USE[useInputs.find(i => i.checked)?.value || 'kuca']
    const lo = Math.round((r.depth[0] * RATE) / 100) * 100
    const hi = Math.round((r.depth[1] * RATE) / 100) * 100
    out('depth').innerHTML = `${r.depth[0]}-${r.depth[1]} <small>m</small>`
    out('price').innerHTML = `od ${RATE} <small>KM/m</small>`
    out('total').innerHTML = `od ${fmt(lo)} <small>do</small> ${fmt(hi)} <small>KM</small>`
    const ent = ENTITY[r.entity] || ENTITY.FBiH
    const permit = out('permit')
    if (use.permit) {
      permit.className = 'call warn'
      permit.innerHTML = `<span class="k">Dozvola je potrebna</span><p>Za <strong>${use.label}</strong> trebaju vodni akti, a izdaje ih ${ent.body}. <a href="/dozvole/">Šta tačno treba</a></p>`
    } else {
      permit.className = 'call'
      permit.innerHTML = `<span class="k">Dozvola vam ne treba</span><p>Bunar na vlastitom zemljištu za <strong>${use.label}</strong> je opća upotreba voda po ${ent.law}. <a href="/dozvole/">Pročitajte izuzetak</a></p>`
    }
    const link = out('link')
    link.setAttribute('href', `/podrucja/${select.value}/`)
    link.textContent = `Detaljno: ${r.name}`
    out('upit')?.setAttribute('href', `/kontakt/?opcina=${encodeURIComponent(select.value)}#upit`)
  }
  select.addEventListener('change', render)
  useInputs.forEach(i => i.addEventListener('change', render))
  render()
}

/* fonts and images shift layout: re-measure pinned sections once settled */
addEventListener('load', () => ScrollTrigger.refresh())
