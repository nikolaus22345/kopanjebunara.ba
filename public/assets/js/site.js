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

  /* ---------- estimator ----------
     Simple by design: depth comes from the municipality, price is the
     published floor from site.pricing.from, the total is just the two
     multiplied and labelled 'od'. Namjena only decides the permit answer. */
  var tool = document.getElementById('estimator')
  if (!tool) return

  var dataEl = document.getElementById('estimator-data')
  if (!dataEl) return
  var DATA = JSON.parse(dataEl.textContent)
  var RATE = parseInt(tool.getAttribute('data-rate'), 10) || 200

  var select = tool.querySelector('#est-region')
  var useInputs = tool.querySelectorAll('input[name="est-use"]')
  var out = {
    depth: tool.querySelector('[data-out="depth"]'),
    price: tool.querySelector('[data-out="price"]'),
    total: tool.querySelector('[data-out="total"]'),
    permit: tool.querySelector('[data-out="permit"]'),
    link: tool.querySelector('[data-out="link"]')
  }

  var USE = {
    kuca:  { label: 'domaćinstvo',      permit: false },
    navod: { label: 'navodnjavanje',    permit: true },
    posao: { label: 'poslovnu namjenu', permit: true }
  }

  var ENTITY = {
    FBiH: { body: 'Agencija za vodno područje rijeke Save, odnosno Jadranskog mora za Hercegovinu', law: 'Zakonu o vodama FBiH' },
    RS:   { body: 'JU „Vode Srpske“', law: 'Zakonu o vodama RS' },
    BD:   { body: 'nadležni organ Brčko distrikta', law: 'propisima Brčko distrikta' }
  }

  /* Bosnian thousands separator is a dot; bs-BA locale data is not reliably
     present in browsers, so do it by hand. */
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

  function currentUse() {
    for (var i = 0; i < useInputs.length; i++) if (useInputs[i].checked) return useInputs[i].value
    return 'kuca'
  }

  function render() {
    var r = DATA[select.value]
    if (!r) return
    var use = USE[currentUse()]

    var lo = Math.round(r.depth[0] * RATE / 100) * 100
    var hi = Math.round(r.depth[1] * RATE / 100) * 100

    out.depth.innerHTML = r.depth[0] + '–' + r.depth[1] + ' <small>m</small>'
    out.price.innerHTML = 'od ' + RATE + ' <small>KM/m</small>'
    out.total.innerHTML = 'od ' + fmt(lo) + ' <small>do</small> ' + fmt(hi) + ' <small>KM</small>'

    var ent = ENTITY[r.entity] || ENTITY.FBiH
    if (use.permit) {
      out.permit.className = 'call warn'
      out.permit.innerHTML = '<span class="k">Dozvola je potrebna</span>' +
        '<p>Za <strong>' + use.label + '</strong> trebaju vodni akti, a izdaje ih ' + ent.body +
        '. <a href="/dozvole/">Šta tačno treba &rarr;</a></p>'
    } else {
      out.permit.className = 'call'
      out.permit.innerHTML = '<span class="k">Dozvola vam ne treba</span>' +
        '<p>Bunar na vlastitom zemljištu za <strong>' + use.label + '</strong> je opća upotreba voda po ' +
        ent.law + '. <a href="/dozvole/">Pročitajte izuzetak &rarr;</a></p>'
    }

    out.link.setAttribute('href', '/podrucja/' + select.value + '/')
    out.link.textContent = 'Detaljno — ' + r.name
  }

  select.addEventListener('change', render)
  for (var i = 0; i < useInputs.length; i++) useInputs[i].addEventListener('change', render)
  render()
})()
