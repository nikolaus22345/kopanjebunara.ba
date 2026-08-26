import { site, nav, footerNav } from './data/site.mjs'
import { regions } from './data/regions.mjs'

/* ---------- small helpers ---------- */

export const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

export const icon = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 20.5l1.5-4.5a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12 3.5a8.4 8.4 0 0 1 9 8z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
}

export const logo = `<svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <rect x="1" y="1" width="30" height="30" stroke="currentColor" stroke-opacity=".28"/>
  <path d="M6 7h20M6 11h20M6 15h20" stroke="currentColor" stroke-opacity=".3" stroke-width="1.2"/>
  <path d="M16 5v14" stroke="var(--accent)" stroke-width="1.6"/>
  <path d="M16 27c-2.9 0-5.2-2.3-5.2-5.1C10.8 18.6 16 13 16 13s5.2 5.6 5.2 8.9c0 2.8-2.3 5.1-5.2 5.1Z" fill="var(--accent)"/>
</svg>`

/* ---------- header ---------- */

const header = (current) => `
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">
      ${logo}
      <span class="brand-name">${esc(site.nameLead)}<span>${esc(site.nameAccent)}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav">Meni</button>
    <nav class="nav" id="nav" aria-label="Glavna navigacija">
      ${nav.map(n => `<a href="${n.href}"${current && current.startsWith(n.href) && n.href !== '/' ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('\n      ')}
    </nav>
    <div class="header-cta">
      <a class="header-phone" href="tel:${site.phoneHref}">${icon.phone}<span>${esc(site.phone)}</span></a>
    </div>
  </div>
</header>`

/* ---------- footer ---------- */

const footer = () => `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="stack gap-sm">
        <a class="brand" href="/">${logo}<span class="brand-name">${esc(site.nameLead)}<span>${esc(site.nameAccent)}</span></span></a>
        <p style="max-width:34ch">${esc(site.role)}</p>
        <p><a href="tel:${site.phoneHref}" style="font-family:var(--mono);font-size:1.05rem;color:var(--accent);text-decoration:none">${esc(site.phone)}</a></p>
        <p style="font-family:var(--mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase">${esc(site.hours)}</p>
      </div>
      ${footerNav.map(col => `
      <div>
        <p class="footer-h">${esc(col.title)}</p>
        <ul>${col.links.map(l => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`).join('')}
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${esc(site.name)}</span>
      <span>Bušenje bunara &middot; Bosna i Hercegovina</span>
    </div>
  </div>
</footer>

<div class="callbar">
  <a class="c-call" href="tel:${site.phoneHref}">${icon.phone} Pozovi</a>
  <a class="c-viber" href="viber://chat?number=${encodeURIComponent(site.viberHref)}">${icon.chat} Viber</a>
</div>`

/* ---------- JSON-LD ---------- */

const orgSchema = () => {
  const o = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.origin}/#org`,
    name: site.name,
    description: site.role,
    url: site.origin,
    telephone: site.phone,
    email: site.email,
    image: `${site.origin}/assets/img/og.png`,
    priceRange: '50–190 KM/m',
    areaServed: { '@type': 'Country', name: 'Bosna i Hercegovina' },
    knowsAbout: ['Bušenje bunara', 'Kopanje bunara', 'Arteški bunari', 'Hidrogeologija', 'Geotermalne sonde', 'Vodna saglasnost'],
    makesOffer: [
      'Bušenje i kopanje bunara', 'Geotermalne sonde', 'Pumpe i hidrofori',
      'Analiza vode', 'Čišćenje i regeneracija bunara',
    ].map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  }
  // Only emit an address once real details exist — a placeholder locality is
  // worse than no address for both validators and humans.
  if (site.address && !/^adresa/i.test(site.address)) {
    o.address = {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.city,
      postalCode: site.postalCode,
      addressCountry: site.country,
    }
  }
  return JSON.stringify(o)
}

/* BreadcrumbList, derived from the URL path so it can never drift out of
   sync with the visible breadcrumbs. */
const SEG_LABELS = {
  'busenje-bunara': 'Bušenje bunara',
  cijena: 'Cijena',
  dozvole: 'Dozvole',
  postupak: 'Postupak',
  podrucja: 'Područja',
  usluge: 'Usluge',
  pitanja: 'Česta pitanja',
  kontakt: 'Kontakt',
  'geotermalne-sonde': 'Geotermalne sonde',
  'pumpe-i-hidrofori': 'Pumpe i hidrofori',
  'analiza-vode': 'Analiza vode',
  'ciscenje-bunara': 'Čišćenje i regeneracija',
  ...Object.fromEntries(regions.map(r => [r.slug, r.name])),
}

const breadcrumbSchema = (path) => {
  const segs = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  if (!segs.length || path.endsWith('.html')) return null
  const items = [{ name: 'Početna', url: `${site.origin}/` }]
  let acc = ''
  for (const s of segs) {
    acc += `/${s}`
    items.push({ name: SEG_LABELS[s] || s, url: `${site.origin}${acc}/` })
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.url,
    })),
  })
}

/* ---------- page shell ---------- */

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap'

/* GA4. Google's snippet loads gtag.js unconditionally; this wraps it in a
   hostname check so localhost builds and Vercel preview deployments don't
   file pageviews against the real property. Set site.analyticsHost = '' to
   get the verbatim behaviour. */
const analytics = () => {
  if (!site.ga4) return ''
  const id = site.ga4
  const host = site.analyticsHost
  const guardOpen = host ? `if (location.hostname === '${host}' || location.hostname.endsWith('.${host}')) {` : ''
  const guardClose = host ? '}' : ''
  /* Two deliberate departures from Google's verbatim snippet, both because
     it is now inside an `if` block:
       - `var gtag = function(){}` instead of `function gtag(){}`, since a
         function declaration in a block is block-scoped in strict mode
         (only Annex B hoisting saves it in sloppy mode).
       - `window.dataLayer.push` instead of bare `dataLayer.push`, so it
         never depends on the implicit global. */
  return `<!-- Google tag (gtag.js) -->
<script>
${guardOpen}
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', '${id}');
  var gs = document.createElement('script');
  gs.async = true;
  gs.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(gs);
${guardClose}
</script>`
}

export function page({
  title,
  description,
  path,
  body,
  schema = [],
  bodyClass = '',
  noindex = false,
}) {
  const origin = site.origin.replace(/\/$/, '')
  const canonical = origin + path
  const fullTitle = path === '/' ? title : `${title} | ${site.name}`
  const crumb = breadcrumbSchema(path)
  const jsonld = [
    orgSchema(),
    ...(crumb ? [crumb] : []),
    ...schema.map(s => typeof s === 'string' ? s : JSON.stringify(s)),
  ]

  return `<!doctype html>
<html lang="bs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">${site.googleSiteVerification ? `
<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">` : ''}
<meta name="theme-color" content="#0B1615">
<meta property="og:type" content="website">
<meta property="og:locale" content="bs_BA">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)} — bušenje i kopanje bunara u Bosni i Hercegovini">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${origin}/assets/img/og.png">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="preload" as="style" href="${FONT_CSS}">
<link rel="stylesheet" href="${FONT_CSS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONT_CSS}"></noscript>
${jsonld.map(j => `<script type="application/ld+json">${j}</script>`).join('\n')}
${analytics()}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Preskoči na sadržaj</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`
}

/* ---------- reusable blocks ---------- */

export const crumbs = (items) => `
<div class="wrap">
  <nav class="crumbs" aria-label="Putanja">
    ${items.map((c, i) => (i ? '<span aria-hidden="true">/</span>' : '') + (c.href ? `<a href="${c.href}">${esc(c.label)}</a>` : `<span>${esc(c.label)}</span>`)).join('\n    ')}
  </nav>
</div>`

export const pageHead = ({ eyebrow, title, lede, extra = '' }) => `
<section class="page-head">
  <div class="wrap">
    <div class="stack gap-md">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${extra}
    </div>
  </div>
</section>`

/* Strata column graphic — the signature device.
   layers: [{ n, h, c, dark, water }]  depth: [min,max] */
export const strata = (layers, depth, { light = false, caption = '' } = {}) => {
  const total = layers.reduce((a, l) => a + l.h, 0)
  const max = depth[1]
  let acc = 0
  const marks = [0, .25, .5, .75, 1].map(f => Math.round(max * f))
  return `
<figure class="strata${light ? ' strata-light' : ''}" style="margin:0">
  <div style="display:flex;gap:.85rem;width:100%">
    <div class="strata-scale" aria-hidden="true">
      ${marks.map(m => `<span>${m} m</span>`).join('\n      ')}
    </div>
    <div class="strata-col" style="height:19rem" role="img" aria-label="Tipičan geološki profil: ${esc(layers.map(l => l.n).join(', '))}">
      ${layers.map(l => {
        acc += l.h
        return `<div class="strata-layer${l.dark ? ' dark' : ''}${l.water ? ' strata-water' : ''}" style="flex:${l.h} 1 0;background:${l.c}"><span>${esc(l.n)}</span></div>`
      }).join('\n      ')}
    </div>
  </div>
  <figcaption class="strata-note"><b>&#9632;</b> Šrafirano = vodonosna zona.${caption ? ' ' + esc(caption) : ' Profil je tipičan za ovaj tip terena, ne mjeren podatak za pojedinu parcelu.'}</figcaption>
</figure>`
}

export const faqBlock = (items) => `
<div class="faq">
  ${items.map(f => `<details>
    <summary>${esc(f.q)}</summary>
    <div class="a">${f.a}</div>
  </details>`).join('\n  ')}
</div>`

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() },
  })),
})

/* CTA band, used at the bottom of most pages */
export const ctaBand = (heading = 'Recite nam gdje je parcela — mi vam kažemo šta očekivati.') => `
<section class="band band-deep">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(1.5rem,4vw,3.5rem);align-items:center" class="cta-grid">
      <div class="stack gap-md">
        <p class="eyebrow">Besplatna procjena</p>
        <h2>${esc(heading)}</h2>
        <p class="lede">Jedan poziv. Kažete nam općinu i namjenu, mi vam damo realan raspon dubine i cijene — i tek onda izlazak na teren.</p>
      </div>
      <div class="call-card">
        <p class="hours">Pozovite direktno</p>
        <a class="big" href="tel:${site.phoneHref}">${esc(site.phone)}</a>
        <p>${esc(site.hours)}</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="viber://chat?number=${encodeURIComponent(site.viberHref)}">${icon.chat} Viber</a>
          <a class="btn btn-ghost" href="/kontakt/">Pošalji upit</a>
        </div>
      </div>
    </div>
  </div>
</section>`
