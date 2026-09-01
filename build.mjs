#!/usr/bin/env node
/* ==========================================================================
   Do Vode — static site build.

   Usage:  node build.mjs
   Output: ./public   (plain static HTML — deploy this folder anywhere)

   Nothing here needs a server, a database or a framework. The output is
   ordinary HTML/CSS/JS that works on any host, including basic cPanel.
   ========================================================================== */

import { writeFile, mkdir, rm, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { site } from './src/data/site.mjs'
import { regions, aquiferTypes } from './src/data/regions.mjs'
import { estimatorData } from './src/components/estimator.mjs'

import { homePage } from './src/pages/home.mjs'
import { cijenaPage } from './src/pages/cijena.mjs'
import { dozvolePage } from './src/pages/dozvole.mjs'
import { busenjeBunaraPage, postupakPage } from './src/pages/service.mjs'
import { podrucjaIndexPage, regionPage } from './src/pages/regions.mjs'
import { uslugeIndexPage, servicePages } from './src/pages/usluge.mjs'
import { pitanjaPage, kontaktPage, notFoundPage } from './src/pages/misc.mjs'

const ROOT = dirname(fileURLToPath(import.meta.url))
const OUT = join(ROOT, 'public')

/* ---------- collect every page ---------- */

const pages = [
  { path: '/', html: homePage() },
  { path: '/busenje-bunara/', html: busenjeBunaraPage() },
  { path: '/cijena/', html: cijenaPage() },
  { path: '/dozvole/', html: dozvolePage() },
  { path: '/postupak/', html: postupakPage() },
  { path: '/podrucja/', html: podrucjaIndexPage() },
  { path: '/usluge/', html: uslugeIndexPage() },
  ...servicePages(),
  { path: '/pitanja/', html: pitanjaPage() },
  { path: '/kontakt/', html: kontaktPage() },
  ...regions.map(r => ({ path: `/podrucja/${r.slug}/`, html: regionPage(r) })),
  { path: '/404.html', html: notFoundPage(), noIndex: true },
]

/* ---------- inject estimator data where the tool is used ---------- */

const EST_JSON = JSON.stringify(estimatorData())

function injectEstimator(html) {
  if (!html.includes('id="estimator"')) return html
  return html.replace(
    '<script src="/assets/js/site.js" defer></script>',
    `<script type="application/json" id="estimator-data">${EST_JSON}</script>\n<script src="/assets/js/site.js" defer></script>`
  )
}

/* ---------- write ---------- */

function outPathFor(p) {
  if (p === '/') return join(OUT, 'index.html')
  if (p.endsWith('.html')) return join(OUT, p.replace(/^\//, ''))
  return join(OUT, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html')
}

async function write(p, contents) {
  await mkdir(dirname(p), { recursive: true })
  await writeFile(p, contents, 'utf8')
}

/* ---------- sitemap + robots ---------- */

function sitemap() {
  const origin = site.origin.replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)
  const priority = p =>
    p === '/' ? '1.0'
    : ['/cijena/', '/dozvole/', '/busenje-bunara/'].includes(p) ? '0.9'
    : p.startsWith('/podrucja/') && p !== '/podrucja/' ? '0.7'
    : '0.8'

  const urls = pages
    .filter(p => !p.noIndex)
    .map(p => `  <url>
    <loc>${origin}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority(p.path)}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/* robots.txt — explicitly welcome the AI crawlers too. SEOStack's AI
   Visibility check looks for exactly this plus llms.txt. */
const robots = () => `User-agent: *
Allow: /

# AI / answer engines — explicitly allowed
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${site.origin.replace(/\/$/, '')}/sitemap.xml
`

/* llms.txt — a plain-language map of the site for answer engines.
   Spec: llmstxt.org */
const llms = () => {
  const origin = site.origin.replace(/\/$/, '')
  const byType = {}
  for (const r of regions) (byType[r.type] ||= []).push(r)

  return `# ${site.name}

> ${site.role} Bušenje i kopanje bunara u cijeloj Bosni i Hercegovini — procjena dubine i cijene po općini, razrada cijene po stavkama i tačan odgovor treba li dozvola.

Kontakt: ${site.phone} · ${site.email}

## Ključne činjenice

- Cijena bušenja bunara u BiH: 50–100 KM/m u ravnici (aluvij), 80–135 KM/m u središnjoj Bosni (fliš i lapor), 100–190 KM/m u hercegovačkom kršu. Rasponi su orijentacioni, ključ u ruke, bez pumpe.
- Dubina: 15–40 m u Posavini i Semberiji, 25–80 m u središnjoj Bosni, 40–150 m u kršu.
- Dozvola: bunar na vlastitom zemljištu za potrebe domaćinstva je opća upotreba voda i NE traži dozvolu, ni u FBiH ni u RS. Navodnjavanje i poslovna namjena traže vodne akte. Kriterij je namjena vode, a ne dubina bunara.
- Vodne akte izdaju: u FBiH agencije za vodna područja (Sava — Sarajevo, Jadransko more — Mostar); u RS JU „Vode Srpske“; u Brčko distriktu organ Distrikta.
- Kompletan bunar sadrži sedam stavki: bušenje, zaštitnu kolonu, filtersku cijev, šljunčani zasip, tampon, razradu s probnim crpljenjem, i opremu. Ponuda bez tampona i probnog crpljenja nije kompletan bunar.

## Glavne stranice

- [Bušenje i kopanje bunara](${origin}/busenje-bunara/): vrste bunara, metode bušenja, četiri tipa terena u BiH.
- [Cijena](${origin}/cijena/): realni rasponi po tipu terena, šta jeste a šta nije u cijeni, lista pitanja za izvođača.
- [Dozvole](${origin}/dozvole/): opća upotreba voda, vodni akti, razdvojeno po FBiH / RS / Brčko distrikt.
- [Postupak](${origin}/postupak/): sedam koraka od poziva do vode.
- [Područja](${origin}/podrucja/): ${regions.length} općina s procjenom dubine, cijene i tipa izdani.
- [Česta pitanja](${origin}/pitanja/)
- [Kontakt](${origin}/kontakt/)

## Usluge

- [Geotermalne sonde](${origin}/usluge/geotermalne-sonde/)
- [Pumpe i hidrofori](${origin}/usluge/pumpe-i-hidrofori/)
- [Analiza vode](${origin}/usluge/analiza-vode/)
- [Čišćenje i regeneracija bunara](${origin}/usluge/ciscenje-bunara/)

## Područja po tipu terena

${['aluvij', 'mjesovito', 'flis', 'krs'].map(k => {
  const rs = byType[k] || []
  if (!rs.length) return ''
  return `### ${aquiferTypes[k].label}\n\n` + rs
    .sort((a, b) => a.name.localeCompare(b.name, 'bs'))
    .map(r => `- [${r.name}](${origin}/podrucja/${r.slug}/): ${r.depth[0]}–${r.depth[1]} m, ${r.price[0]}–${r.price[1]} KM/m, ${r.entity}.`)
    .join('\n')
}).filter(Boolean).join('\n\n')}
`
}

/* Vercel config — trailing slashes must match the canonical URLs, or every
   internal link becomes a 308 redirect hop. */
const vercelJson = () => JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  buildCommand: 'node build.mjs',
  outputDirectory: 'public',
  trailingSlash: true,
  cleanUrls: false,
  headers: [
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    },
  ],
}, null, 2) + '\n'

/* ---------- run ---------- */

async function build() {
  const t0 = Date.now()

  // clear generated HTML but keep /assets
  if (existsSync(OUT)) {
    for (const entry of await readdir(OUT)) {
      if (entry === 'assets') continue
      await rm(join(OUT, entry), { recursive: true, force: true })
    }
  }

  /* SEO guards — titles and descriptions drift long as copy gets edited, and
     Google truncates around 60 / 160 characters. Warn loudly instead of
     silently shipping clipped snippets. */
  const warnings = []
  for (const p of pages) {
    const html = p.html
    const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || ''
    const d = (html.match(/name="description" content="([^"]*)"/) || [])[1] || ''
    if (t.length > 62) warnings.push(`${p.path} — title ${t.length} zn.: ${t}`)
    if (d.length > 160) warnings.push(`${p.path} — description ${d.length} zn.`)
    if (!d) warnings.push(`${p.path} — nema description`)
    await write(outPathFor(p.path), injectEstimator(html))
  }

  await write(join(OUT, 'sitemap.xml'), sitemap())
  await write(join(OUT, 'robots.txt'), robots())
  await write(join(OUT, 'llms.txt'), llms())
  /* favicon.svg / favicon-*.png / og.jpg / logo-*.png are produced by
     media.mjs (they need ffmpeg and the source art) and live in
     public/assets/img, which this build never touches. */

  // Netlify 404 rule (ignored by Vercel, harmless)
  await write(join(OUT, '_redirects'), '/*  /404.html  404\n')

  // Vercel config lives at the repo root, not in the output folder. Only
  // scaffold it once — it is configuration, so a hand edit must survive.
  if (!existsSync(join(ROOT, 'vercel.json'))) {
    await write(join(ROOT, 'vercel.json'), vercelJson())
  }

  const kb = (await Promise.all(pages.map(async p => (await stat(outPathFor(p.path))).size)))
    .reduce((a, b) => a + b, 0) / 1024

  if (warnings.length) {
    console.log(`\n  ⚠ ${warnings.length} SEO upozorenja:`)
    for (const w of warnings.slice(0, 12)) console.log(`    · ${w}`)
    if (warnings.length > 12) console.log(`    · … i još ${warnings.length - 12}`)
  }

  console.log(`\n  ✓ ${pages.length} stranica  ·  ${regions.length} područja  ·  ${kb.toFixed(0)} KB  ·  ${Date.now() - t0} ms`)
  console.log(`  → ${OUT}`)
  console.log(`\n  Pregled:  npx serve public\n`)
}

build().catch(err => { console.error(err); process.exit(1) })
