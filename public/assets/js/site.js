/* Do Vode — progressive enhancement only. The site works without this file. */

(function () {
  'use strict'

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle')
  var nav = document.getElementById('nav')
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open')
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      toggle.textContent = open ? 'Zatvori' : 'Meni'
    })
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open')
        toggle.setAttribute('aria-expanded', 'false')
        toggle.textContent = 'Meni'
      }
    })
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal')
  if (reveals.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    reveals.forEach(function (el) { io.observe(el) })
  } else {
    reveals.forEach(function (el) { el.classList.add('in') })
  }

  /* ---------- contact form -> prefilled WhatsApp message ----------
     No backend, no third-party form processor, nothing to configure. The
     fields are assembled into a readable message and handed to WhatsApp,
     which is where this market actually replies. */
  var upit = document.getElementById('upit-form')
  if (upit) {
    upit.addEventListener('submit', function (e) {
      e.preventDefault()

      var label = function (id) {
        var el = upit.querySelector(id)
        if (!el) return ''
        if (el.tagName === 'SELECT') {
          return el.selectedOptions.length ? el.selectedOptions[0].text : ''
        }
        return el.value.trim()
      }

      var rows = [
        ['Ime', label('#f-ime')],
        ['Telefon', label('#f-tel')],
        ['Općina', label('#f-opcina')],
        ['Namjena', label('#f-namjena')],
        ['Pristup za kamion', label('#f-pristup')],
        ['Dubina susjednog bunara', label('#f-susjed')],
        ['Poruka', label('#f-poruka')],
      ].filter(function (r) { return r[1] && r[1].indexOf('—') !== 0 })

      var text = 'Upit sa sajta kopanjebunara.ba\n\n' +
        rows.map(function (r) { return r[0] + ': ' + r[1] }).join('\n')

      var num = upit.getAttribute('data-wa')
      window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(text), '_blank', 'noopener')
    })
  }

  /* ---------- video cards: click to play ----------
     Posters are plain <img>, so nothing video-related is fetched until the
     visitor actually asks for it. On click we swap in a real <video> with
     the poster still showing underneath until the first frame decodes. */
  document.querySelectorAll('.vcard').forEach(function (card) {
    var btn = card.querySelector('.vcard-play')
    if (!btn) return
    btn.addEventListener('click', function () {
      var src = card.getAttribute('data-video')
      var poster = card.querySelector('.vcard-play img')
      var v = document.createElement('video')
      v.src = src
      v.controls = true
      v.autoplay = true
      v.loop = true
      v.muted = true                 // required for autoplay on mobile
      v.playsInline = true
      v.setAttribute('playsinline', '')
      if (poster) v.poster = poster.getAttribute('src')
      /* Stays muted — the clips have no audio track at all (stripped in
         media.mjs), and a video that unmutes itself is hostile anyway. */
      btn.replaceWith(v)
      var p = v.play()
      if (p && p.catch) p.catch(function () { v.controls = true })
    }, { once: true })
  })

  /* ---------- estimator ---------- */
  var tool = document.getElementById('estimator')
  if (!tool) return

  var dataEl = document.getElementById('estimator-data')
  if (!dataEl) return
  var DATA = JSON.parse(dataEl.textContent)

  var select = tool.querySelector('#est-region')
  var useInputs = tool.querySelectorAll('input[name="est-use"]')
  var out = {
    depth: tool.querySelector('[data-out="depth"]'),
    price: tool.querySelector('[data-out="price"]'),
    total: tool.querySelector('[data-out="total"]'),
    odds: tool.querySelector('[data-out="odds"]'),
    type: tool.querySelector('[data-out="type"]'),
    note: tool.querySelector('[data-out="note"]'),
    permit: tool.querySelector('[data-out="permit"]'),
    link: tool.querySelector('[data-out="link"]'),
  }

  /* Irrigation and commercial wells need more yield, so a wider bore and
     usually a bit more depth. Keep the factors modest — stacking depth and
     price multipliers compounds fast and produces figures no BiH contractor
     would ever quote. */
  var USE = {
    kuca:  { label: 'domaćinstvo',       dMult: 1,    pMult: 1,    permit: false },
    vrt:   { label: 'kuću i vrt',        dMult: 1,    pMult: 1.03, permit: false },
    navod: { label: 'navodnjavanje',     dMult: 1.1,  pMult: 1.15, permit: true },
    posao: { label: 'poslovnu namjenu',  dMult: 1.15, pMult: 1.25, permit: true },
  }

  var ENTITY = {
    FBiH: { body: 'Agencija za vodno područje rijeke Save (odnosno Jadranskog mora za Hercegovinu)', law: 'Zakonu o vodama FBiH' },
    RS:   { body: 'JU „Vode Srpske“', law: 'Zakonu o vodama RS' },
    BD:   { body: 'nadležni organ Brčko distrikta', law: 'propisima Brčko distrikta' },
  }

  /* Bosnian thousands separator is a dot. Don't rely on Intl locale data
     being present in the browser — bs-BA silently falls back to en-US. */
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

  function currentUse() {
    for (var i = 0; i < useInputs.length; i++) if (useInputs[i].checked) return useInputs[i].value
    return 'kuca'
  }

  function render() {
    var r = DATA[select.value]
    if (!r) return
    var useKey = currentUse()
    var use = USE[useKey]

    var d0 = Math.round(r.depth[0] * use.dMult)
    var d1 = Math.round(r.depth[1] * use.dMult)
    var p0 = Math.round(r.price[0] * use.pMult)
    var p1 = Math.round(r.price[1] * use.pMult)

    // The full envelope (d0×p0 … d1×p1) is arithmetically true but spans 4×
    // and reads as useless. Show the middle band instead — where most jobs
    // actually land — and label it as such.
    var band = function (a, b) { return [a + 0.3 * (b - a), a + 0.75 * (b - a)] }
    var db = band(d0, d1), pb = band(p0, p1)
    var step = d1 * p1 > 10000 ? 100 : 50
    var lo = Math.round((db[0] * pb[0]) / step) * step
    var hi = Math.round((db[1] * pb[1]) / step) * step

    out.depth.innerHTML = d0 + '–' + d1 + ' <small>m</small>'
    out.price.innerHTML = p0 + '–' + p1 + ' <small>KM/m</small>'
    out.total.innerHTML = fmt(lo) + '–' + fmt(hi) + ' <small>KM</small>'

    out.odds.textContent = r.oddsLabel
    out.odds.className = 'badge badge-' + r.oddsBadge
    out.type.textContent = r.typeLabel
    out.note.textContent = r.oddsNote

    var ent = ENTITY[r.entity] || ENTITY.FBiH
    if (use.permit) {
      out.permit.innerHTML = '<span class="k">Dozvola je potrebna</span>' +
        '<p>Za <strong>' + use.label + '</strong> izlazite iz opće upotrebe voda. Trebate vodne akte, a izdaje ih ' +
        ent.body + ' po ' + ent.law + '. <a href="/dozvole/">Šta tačno treba &rarr;</a></p>'
      out.permit.className = 'call warn'
    } else {
      out.permit.innerHTML = '<span class="k">Dozvola vam ne treba</span>' +
        '<p>Bunar na vlastitom zemljištu za <strong>' + use.label + '</strong> je opća upotreba voda po ' + ent.law +
        '. Nema papirologije. <a href="/dozvole/">Pročitajte izuzetak &rarr;</a></p>'
      out.permit.className = 'call'
    }

    out.link.setAttribute('href', '/podrucja/' + select.value + '/')
    out.link.textContent = 'Detaljno o terenu — ' + r.name
  }

  select.addEventListener('change', render)
  for (var i = 0; i < useInputs.length; i++) useInputs[i].addEventListener('change', render)
  render()
})()
