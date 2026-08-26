import { photoBySlug, videos } from '../data/media.mjs'
import { esc, icon } from '../layout.mjs'

/* --------------------------------------------------------------------------
   photo(slug, opts) — responsive <picture>.

   Dimensions come from src/data/media.mjs, which media.mjs generates from
   the real files, so every image ships correct width/height and reserves its
   own space. No layout shift, ever.

   opts.sizes     CSS `sizes` attribute (default: full width up to the grid)
   opts.priority  true for above-the-fold art — eager + high fetchpriority
   opts.ratio     force an aspect ratio via object-fit crop, e.g. '16/9'
   opts.cls       extra class on the <picture>
   opts.caption   renders a <figure> with <figcaption> instead of bare picture
   -------------------------------------------------------------------------- */
export function photo(slug, opts = {}) {
  const p = photoBySlug[slug]
  if (!p) return `<!-- nema fotografije: ${esc(slug)} -->`

  const { sizes = '(max-width: 860px) 100vw, 50vw', priority = false, ratio, cls = '', caption, alt } = opts
  const set = ext => p.widths.map(w => `/assets/photo/${p.slug}-${w}.${ext} ${w}w`).join(', ')
  const largest = p.widths[p.widths.length - 1]

  /* JPEG only, deliberately — measured, not assumed.
     WebP was generated and tested: it decodes fine in Chrome, so there is
     no compatibility problem. It just isn't worth it here. Against these
     mjpeg -q:v 4 files it saved 519 KB -> 480 KB, about 7.5%, nowhere near
     the ~30% WebP usually buys, because the JPEGs are already compressed
     hard. 7.5% does not justify a second format, double the files on disk
     and an extra <source> on every image.
     Worth revisiting only with a real encoder (sharp/cwebp) at a lower
     quality target, where the gap actually opens up. */
  const style = ratio ? ` style="aspect-ratio:${ratio}"` : ''
  const pic = `<picture class="ph${ratio ? ' ph-crop' : ''}${cls ? ' ' + cls : ''}"${style}>
  <img src="/assets/photo/${p.slug}-${largest}.jpg" srcset="${set('jpg')}" sizes="${esc(sizes)}"
       width="${p.w}" height="${p.h}" alt="${esc(alt || p.alt)}"
       loading="${priority ? 'eager' : 'lazy'}" decoding="${priority ? 'sync' : 'async'}"${priority ? ' fetchpriority="high"' : ''}>
</picture>`

  if (!caption) return pic
  return `<figure class="mfig">
  ${pic}
  <figcaption>${caption}</figcaption>
</figure>`
}

/* --------------------------------------------------------------------------
   Video showcase.

   preload="none" so nothing downloads until the visitor asks. The poster is
   an ordinary <img> rather than the video's own poster attribute, which lets
   it be lazy-loaded and responsive. Clicking swaps in the real <video>.
   -------------------------------------------------------------------------- */
export function videoCard(v, { priority = false } = {}) {
  return `<article class="vcard" data-video="/assets/video/${v.slug}.mp4">
  <button class="vcard-play" type="button" aria-label="Pusti video: ${esc(v.title)}">
    <img src="/assets/video/${v.slug}.jpg" width="${v.w}" height="${v.h}"
         alt="${esc(v.title)}" loading="${priority ? 'eager' : 'lazy'}" decoding="async">
    <span class="vcard-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>
    </span>
    <span class="vcard-dur">${v.duration}s</span>
  </button>
  <div class="vcard-meta">
    <h3>${esc(v.title)}</h3>
    <p>${esc(v.note)}</p>
  </div>
</article>`
}

export function videoShowcase() {
  return `<div class="vgrid">
  ${videos.map((v, i) => videoCard(v, { priority: i === 0 })).join('\n  ')}
</div>`
}

/* --------------------------------------------------------------------------
   Presjek bunara — our own cross-section diagram.

   Built rather than borrowed: the reference images supplied were either
   English-labelled, Serbian-spelled, or another company's branded
   infographic in a clashing palette. This one uses the site's own tokens,
   Bosnian terminology, and labels exactly the seven components the pricing
   page charges for — so the diagram and the copy reinforce each other.
   -------------------------------------------------------------------------- */
export function presjekBunara() {
  const L = [
    { n: 'Humus',                y: 74,  h: 26,  c: '#4A3B2A', ink: '#E7EEEC' },
    { n: 'Glina',                y: 100, h: 78,  c: '#8A7359', ink: '#E7EEEC' },
    { n: 'Sitni pijesak',        y: 178, h: 62,  c: '#B49A6E', ink: '#16211F' },
    { n: 'Krupni pijesak',       y: 240, h: 54,  c: '#C8A96B', ink: '#16211F' },
    { n: 'Šljunak — vodonosni',  y: 294, h: 118, c: '#8FA9A5', ink: '#16211F', water: true },
    { n: 'Glinena podina',       y: 412, h: 58,  c: '#6E6152', ink: '#E7EEEC' },
  ]

  const cx = 232                 // borehole centre
  const bore = 30                // casing half-width (outer)
  const packW = 21               // gravel pack width either side
  const filterTop = 312
  const filterBot = 400
  const tamponBot = filterTop - 12   // seal stops 0.5 m above the filter
  const waterY = 232                 // static level
  const pumpTop = 256                // below the water level, ABOVE the filter
  const pumpH = 44

  const label = (y, text, sub) => `
    <line x1="${cx + bore + packW + 8}" y1="${y}" x2="470" y2="${y}"/>
    <circle cx="${cx + bore + packW + 8}" cy="${y}" r="2.5" class="dot"/>
    <text x="478" y="${y - (sub ? 2 : 4)}" class="lb">${esc(text)}</text>
    ${sub ? `<text x="478" y="${y + 11}" class="lb-sub">${esc(sub)}</text>` : ''}`

  return `
<figure class="mfig xsec">
<svg viewBox="0 0 720 500" role="img" aria-labelledby="xsec-t xsec-d" class="xsec-svg">
  <title id="xsec-t">Presjek pravilno izvedenog bunara</title>
  <desc id="xsec-d">Shematski prikaz: zaštitna kolona, glineni tampon, šljunčani zasip, filterska cijev u vodonosnom šljunku, potapajuća pumpa i nivo podzemne vode.</desc>

  <!-- sky -->
  <rect x="0" y="0" width="720" height="74" class="sky"/>

  <!-- strata -->
  ${L.map(l => `<rect x="0" y="${l.y}" width="440" height="${l.h}" fill="${l.c}"/>`).join('\n  ')}
  <!-- hatch on the water-bearing layer -->
  <rect x="0" y="294" width="440" height="118" fill="url(#hatch)"/>
  ${L.map(l => `<text x="12" y="${l.y + l.h / 2 + 4}" class="ls" fill="${l.ink}">${esc(l.n)}</text>`).join('\n  ')}

  <defs>
    <pattern id="hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,.34)" stroke-width="2.5"/>
    </pattern>
  </defs>

  <!-- house + riser -->
  <path d="M60 74 V44 h58 V74" class="ho"/>
  <path d="M52 46 L89 24 L126 46" class="ho"/>
  <path d="M89 74 V62 H${cx - bore - 6}" class="pipe"/>

  <!-- gravel pack -->
  <rect x="${cx - bore - packW}" y="${tamponBot}" width="${packW}" height="${470 - tamponBot}" class="pack"/>
  <rect x="${cx + bore}" y="${tamponBot}" width="${packW}" height="${470 - tamponBot}" class="pack"/>

  <!-- tampon (surface seal) -->
  <rect x="${cx - bore - packW}" y="74" width="${packW}" height="${tamponBot - 74}" class="tampon"/>
  <rect x="${cx + bore}" y="74" width="${packW}" height="${tamponBot - 74}" class="tampon"/>

  <!-- borehole void -->
  <rect x="${cx - bore}" y="62" width="${bore * 2}" height="408" class="void"/>

  <!-- water column inside casing -->
  <rect x="${cx - bore + 4}" y="${waterY}" width="${bore * 2 - 8}" height="${470 - waterY}" class="water"/>

  <!-- casing walls -->
  <rect x="${cx - bore}" y="62" width="6" height="408" class="casing"/>
  <rect x="${cx + bore - 6}" y="62" width="6" height="408" class="casing"/>

  <!-- filter slots -->
  ${Array.from({ length: 11 }, (_, i) => {
    const y = filterTop + i * ((filterBot - filterTop) / 10)
    return `<line x1="${cx - bore}" y1="${y}" x2="${cx - bore + 6}" y2="${y}" class="slot"/>
  <line x1="${cx + bore - 6}" y1="${y}" x2="${cx + bore}" y2="${y}" class="slot"/>`
  }).join('\n  ')}

  <!-- static water level -->
  <line x1="${cx - bore - packW - 42}" y1="${waterY}" x2="${cx + bore + packW + 8}" y2="${waterY}" class="wl"/>
  <text x="${cx - bore - packW - 46}" y="${waterY - 6}" class="lb-sub" text-anchor="end">nivo vode</text>

  <!-- pump, hung below the water level and above the filter -->
  <rect x="${cx - 13}" y="${pumpTop}" width="26" height="${pumpH}" rx="3" class="pump"/>
  <path d="M${cx} ${pumpTop} V62" class="riser"/>

  <!-- labels — each leader must land inside the feature it names -->
  <g class="lead">
    ${label(120, 'Zaštitna kolona', 'PVC, pocinčano ili inox')}
    ${label(190, 'Glineni tampon', 'do 0,5 m iznad filtera')}
    ${label(278, 'Potapajuća pumpa', 'iznad filtera i dna')}
    ${label(344, 'Šljunčani zasip', '1–4 mm u pijesku')}
    ${label(396, 'Filterska cijev', 'otvori > 20 % površine')}
  </g>
</svg>
<figcaption>Presjek pravilno izvedenog bunara. Tampon i šljunčani zasip su nevidljivi kad je posao gotov — i upravo se na njima najčešće šteti.</figcaption>
</figure>`
}

/* --------------------------------------------------------------------------
   Gallery — mosaic of everything we have.

   Cell spans are assigned per slug so the mosaic is deliberate rather than
   whatever order the manifest happens to be in: portrait sources get tall
   cells, landscape ones get wide cells. Nothing is upscaled past its source
   width, so the low-resolution files are only ever given small cells.
   -------------------------------------------------------------------------- */
const GALLERY = [
  ['garnitura-brdo', 'g-big', 'Brdski teren — isplaka izlazi iz bušotine'],
  ['isplaka-blizu', 'g-wide', 'Rotaciono bušenje s isplakom, izbliza'],
  ['kolone-cijevi', 'g-wide', 'Zaštitne kolone i spojnice'],
  ['garnitura-njiva', 'g-tall', 'Kamionska garnitura na ravnom terenu'],
  ['garnitura-gusjenicar', '', 'Gusjeničar za teško dostupne parcele'],
  ['garnitura-velika', '', 'Velika garnitura na kamenitom terenu'],
  ['svrdlo-dvoriste', '', 'Rad u dvorištu kuće'],
  ['garnitura-sumrak', '', 'Garnitura na terenu u sumrak'],
]

export function gallery() {
  return `<div class="gallery">
  ${GALLERY.map(([slug, cls, cap]) => {
    const p = photoBySlug[slug]
    if (!p) return ''
    const big = cls === 'g-big'
    const set = p.widths.map(w => `/assets/photo/${p.slug}-${w}.jpg ${w}w`).join(', ')
    const largest = p.widths[p.widths.length - 1]
    return `<figure${cls ? ` class="${cls}"` : ''}>
    <picture class="ph">
      <img src="/assets/photo/${p.slug}-${largest}.jpg" srcset="${set}"
           sizes="${big ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw'}"
           width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
    </picture>
    <figcaption>${esc(cap)}</figcaption>
  </figure>`
  }).join('\n  ')}
</div>`
}

/* Full-width photo strip used to break up long stretches of text. */
export function photoBand(slug, caption) {
  const p = photoBySlug[slug]
  if (!p) return ''
  const set = p.widths.map(w => `/assets/photo/${p.slug}-${w}.jpg ${w}w`).join(', ')
  const largest = p.widths[p.widths.length - 1]
  return `<section class="photo-band">
  <picture class="ph">
    <img src="/assets/photo/${p.slug}-${largest}.jpg" srcset="${set}" sizes="100vw"
         width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
  </picture>
  ${caption ? `<div class="photo-band-cap">${esc(caption)}</div>` : ''}
</section>`
}
