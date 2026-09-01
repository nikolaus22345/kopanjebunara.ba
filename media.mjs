#!/usr/bin/env node
/* ==========================================================================
   MEDIA PIPELINE — run once, or whenever the source media changes.

     node media.mjs                              # uses SRC below
     node media.mjs "D:\\path\\to\\fotografije"   # or pass a folder

   Reads originals from a folder OUTSIDE the repo, writes optimised web
   versions into public/assets/photo and public/assets/video. Requires
   ffmpeg on PATH (it is already installed on this machine).

   Originals are deliberately NOT committed: 59 MB of source material would
   bloat the repo, and most of it is third-party material pending clearance
   (see MEDIA.md). Only the optimised derivatives are versioned.

   `build.mjs` never touches public/assets, so running the site build does
   not undo any of this.
   ========================================================================== */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, stat, readdir, writeFile, rm, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { renderFaviconPng, faviconSvg } from './src/favicon.mjs'
import { renderScrimPng, ogFilter, FONT_SOURCES, FONT_FILE } from './src/ogcard.mjs'

const run = promisify(execFile)
const ROOT = dirname(fileURLToPath(import.meta.url))
const SRC = process.argv[2] || 'C:\\Users\\windows11\\Downloads\\kopanje bunara'
// Heroes and the logo sit in the Downloads root, not the photo subfolder.
const SRC_BRAND = process.argv[3] || String.raw`C:\Users\windows11\Downloads`

const PHOTO_OUT = join(ROOT, 'public', 'assets', 'photo')
const VIDEO_OUT = join(ROOT, 'public', 'assets', 'video')
const IMG_OUT   = join(ROOT, 'public', 'assets', 'img')
const HERO_OUT  = join(ROOT, 'public', 'assets', 'hero')

/* --------------------------------------------------------------------------
   PHOTOS — approved set only.

   `slug` is the name the site references. `focus` is the crop gravity used
   when a fixed aspect ratio is needed. Rejected files and the reason are
   listed in MEDIA.md, not here.
   -------------------------------------------------------------------------- */
const PHOTOS = [
  { src: '334206040_585957576514124_1142153539871720047_n.jpg', slug: 'garnitura-brdo',   alt: 'Bušaća garnitura na brdskom terenu, isplaka izlazi iz bušotine' },
  { src: 'busenje-bunara-683x1024.png',                          slug: 'garnitura-njiva',  alt: 'Kamionska bušaća garnitura na ravnom terenu uz taložnicu' },
  { src: 'naslovna-shutterstock_2493162477.jpg',                  slug: 'isplaka-blizu',    alt: 'Rotaciono bušenje s isplakom — detalj bušotine' },
  { src: 'Kolone-za-busenje-bunari.jpg',                          slug: 'kolone-cijevi',    alt: 'Zaštitne kolone i spojnice za bušenje bunara' },
  { src: 'images (3).jpg',                                        slug: 'garnitura-gusjenicar', alt: 'Gusjeničarska bušaća garnitura uz objekat, za teško dostupne parcele' },
  { src: 'images.jpg',                                            slug: 'garnitura-velika', alt: 'Velika bušaća garnitura na kamenitom brdskom terenu' },
  { src: 'images (2).jpg',                                        slug: 'garnitura-sumrak', alt: 'Bušaća garnitura na terenu u sumrak' },
  { src: '205-5-m.jpg',                                           slug: 'svrdlo-dvoriste',  alt: 'Svrdlo bušilice u dvorištu kuće' },
]

/* --------------------------------------------------------------------------
   VIDEOS — only clips with no burned-in captions.

   The three excluded clips carry burned-in Serbian place names, depths and
   in one case another company's price (12.000 €). See MEDIA.md.
   -------------------------------------------------------------------------- */
/* `start` / `dur` trim each clip to its strongest segment. Web showcase
   clips want 12–15 s, not 46 s — and trimming is also what brings the two
   long files down to a sane weight; CRF alone barely dented them because
   dust and spray are expensive to encode. `poster` is a timestamp in the
   ORIGINAL timeline. */
const VIDEOS = [
  { src: 'ssstik.io_@busenje.bunara.geo_1787754931494.mp4', slug: 'busenje-isplaka',
    start: 0, dur: 13, poster: 6,
    title: 'Bušenje s isplakom', note: 'Isplaka iznosi izbušeni materijal i drži zid bušotine stabilnim.' },
  { src: 'ssstik.io_@busenje.bunara.geo_1787755030028.mp4', slug: 'busenje-stijena',
    start: 10, dur: 14, poster: 16,
    title: 'Bušenje u stijeni', note: 'Pneumatski čekić drobi stijenu, a komprimirani zrak izbacuje materijal.' },
  { src: 'ssstik.io_@stanimir.djukic7_1787754835459.mp4',   slug: 'voda-iz-busotine',
    start: 20, dur: 14, poster: 27,
    title: 'Voda iz bušotine', note: 'Trenutak zbog kojeg se sve radi — dotok nakon probijanja vodonosnog sloja.' },
]

/* --------------------------------------------------------------------------
   HERO — two separate crops, not one image squeezed. The landscape frame
   loses the sky and the valley when cropped to a phone, so the portrait
   version is served below 700px via <source media>.
   -------------------------------------------------------------------------- */
const HEROES = [
  { src: 'hero desktop.png', slug: 'hero-desktop', widths: [1280, 1920, 2560] },
  { src: 'hero mobile.png',  slug: 'hero-mobile',  widths: [640, 828, 1170] },
]

/* Logo: the supplied PNG is flattened onto white (colourType 2, no alpha),
   so the white has to be keyed out or it shows as a block on the dark
   header. colorkey keeps the original teal rather than re-tinting it. */
const LOGO_SRC = '41d4295e316786283e0edc13403fd58b_1788272523.png'
const LOGO_WIDTHS = [96, 192]

const WIDTHS = [640, 1100]   // srcset steps; never upscaled past the source

async function probe(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file,
  ])
  const [w, h] = stdout.trim().split(',').map(Number)
  return { w, h }
}

const kb = n => `${Math.round(n / 1024)} KB`

async function doPhotos() {
  await mkdir(PHOTO_OUT, { recursive: true })
  const manifest = []

  for (const p of PHOTOS) {
    const input = join(SRC, p.src)
    if (!existsSync(input)) { console.log(`  ! nema: ${p.src}`); continue }

    const { w, h } = await probe(input)
    const widths = [...new Set(WIDTHS.map(x => Math.min(x, w)))].sort((a, b) => a - b)
    const out = []

    /* JPEG only — no WebP, on measured grounds.
       ffmpeg's libwebp output was generated and verified as decodable in
       Chrome, so compatibility is not the issue. The issue is that it saves
       almost nothing here: 519 KB of JPEG became 480 KB of WebP (~7.5%),
       because -q:v 4 already compresses hard. Not worth a second format.
       If you install sharp or cwebp and target a lower quality, re-measure
       before adding it back. */
    for (const width of widths) {
      for (const [ext, args] of [
        ['jpg', ['-c:v', 'mjpeg', '-q:v', '4', '-pix_fmt', 'yuvj420p']],
      ]) {
        const dest = join(PHOTO_OUT, `${p.slug}-${width}.${ext}`)
        await run('ffmpeg', [
          '-v', 'error', '-i', input,
          '-vf', `scale=${width}:-2:flags=lanczos`,
          ...args, '-frames:v', '1', '-y', dest,
        ])
        out.push({ ext, width, size: (await stat(dest)).size })
      }
    }

    const biggest = Math.max(...widths)
    manifest.push({
      slug: p.slug, alt: p.alt,
      widths, w: biggest,
      h: Math.round((h / w) * biggest),
      ratio: +(w / h).toFixed(4),
    })

    const total = out.reduce((a, o) => a + o.size, 0)
    console.log(`  ✓ ${p.slug.padEnd(24)} ${w}×${h} → ${widths.join('/')}w  ${kb(total)}`)
  }
  return manifest
}

async function doVideos() {
  await mkdir(VIDEO_OUT, { recursive: true })
  const manifest = []

  for (const v of VIDEOS) {
    const input = join(SRC, v.src)
    if (!existsSync(input)) { console.log(`  ! nema: ${v.src}`); continue }

    const srcSize = (await stat(input)).size
    const mp4 = join(VIDEO_OUT, `${v.slug}.mp4`)
    const poster = join(VIDEO_OUT, `${v.slug}.jpg`)

    /* -an strips the audio track on purpose:
         1. these clips autoplay muted, so nobody ever hears it;
         2. the original audio is TikTok library music — a separate
            copyright problem we simply remove rather than carry. */
    await run('ffmpeg', [
      '-v', 'error',
      '-ss', String(v.start), '-t', String(v.dur), '-i', input,
      '-an',
      '-c:v', 'libx264', '-crf', '31', '-preset', 'slow',
      '-profile:v', 'main', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-y', mp4,
    ])

    await run('ffmpeg', [
      '-v', 'error', '-ss', String(v.poster), '-i', input,
      '-frames:v', '1', '-c:v', 'mjpeg', '-q:v', '4', '-pix_fmt', 'yuvj420p',
      '-y', poster,
    ])

    const { w, h } = await probe(mp4)
    const { stdout } = await run('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=nw=1:nk=1', mp4,
    ])
    const outSize = (await stat(mp4)).size

    manifest.push({
      slug: v.slug, title: v.title, note: v.note,
      w, h, duration: Math.round(+stdout.trim()),
    })

    const saved = Math.round((1 - outSize / srcSize) * 100)
    console.log(`  ✓ ${v.slug.padEnd(24)} ${kb(srcSize)} → ${kb(outSize)}  (−${saved}%)`)
  }
  return manifest
}

console.log(`\n  izvor: ${SRC}\n`)
/* --------------------------------------------------------------------------
   HERO — two separate crops rather than one image squeezed. The landscape
   frame loses the sky and the valley when cropped to a phone, so the
   portrait file is served below 700px via <source media>.
   -------------------------------------------------------------------------- */
async function doHeroes() {
  await mkdir(HERO_OUT, { recursive: true })
  const manifest = []

  for (const hero of HEROES) {
    const input = join(SRC_BRAND, hero.src)
    if (!existsSync(input)) { console.log(`  ! nema: ${hero.src}`); continue }

    const { w, h } = await probe(input)
    const widths = [...new Set(hero.widths.map(x => Math.min(x, w)))].sort((a, b) => a - b)
    let total = 0

    for (const width of widths) {
      const dest = join(HERO_OUT, `${hero.slug}-${width}.jpg`)
      await run('ffmpeg', [
        '-v', 'error', '-i', input,
        '-vf', `scale=${width}:-2:flags=lanczos`,
        '-c:v', 'mjpeg', '-q:v', '5', '-pix_fmt', 'yuvj420p',
        '-frames:v', '1', '-y', dest,
      ])
      total += (await stat(dest)).size
    }

    const biggest = widths[widths.length - 1]
    manifest.push({ slug: hero.slug, widths, w: biggest, h: Math.round((h / w) * biggest) })
    console.log(`  ✓ ${hero.slug.padEnd(22)} ${w}×${h} → ${widths.join('/')}w  ${kb(total)}`)
  }
  return manifest
}

async function doBrand() {
  await mkdir(IMG_OUT, { recursive: true })
  const input = join(SRC_BRAND, LOGO_SRC)
  const logoWidths = []

  if (existsSync(input)) {
    for (const width of LOGO_WIDTHS) {
      const dest = join(IMG_OUT, `logo-${width}.png`)
      await run('ffmpeg', [
        '-v', 'error', '-i', input,
        // key the flattened white out, then trim to the mark's bounding box
        '-vf', `colorkey=0xFAF7FA:0.26:0.12,crop=iw*0.68:ih*0.74:iw*0.16:ih*0.12,scale=${width}:-1:flags=lanczos`,
        '-frames:v', '1', '-y', dest,
      ])
      logoWidths.push(width)
      console.log(`  ✓ ${('logo-' + width + '.png').padEnd(22)} ${kb((await stat(dest)).size)}`)
    }
  } else {
    console.log(`  ! nema logo: ${LOGO_SRC}`)
  }

  /* Favicons are a separate, bolder drawing — the fine line art averages
     away to a smudge at 16px. See src/favicon.mjs. */
  for (const size of [32, 180, 512]) {
    const dest = join(IMG_OUT, `favicon-${size}.png`)
    await writeFile(dest, renderFaviconPng(size, { rounded: size >= 180 ? 0.18 : 0.16 }))
    console.log(`  ✓ ${('favicon-' + size + '.png').padEnd(22)} ${kb((await stat(dest)).size)}`)
  }
  await writeFile(join(IMG_OUT, 'favicon.svg'), faviconSvg(), 'utf8')
  console.log('  ✓ favicon.svg')

  return { logoWidths }
}

async function doOgCard() {
  await mkdir(IMG_OUT, { recursive: true })
  const input = join(SRC_BRAND, HEROES[0].src)
  if (!existsSync(input)) { console.log('  ! nema hero za OG karticu'); return }

  const scrim = join(IMG_OUT, '_scrim.png')
  await writeFile(scrim, renderScrimPng())

  const fontSrc = FONT_SOURCES.find(f => existsSync(f))
  if (!fontSrc) { console.log('  ! nema fonta za OG karticu'); return }
  await copyFile(fontSrc, join(IMG_OUT, FONT_FILE))

  const dest = join(IMG_OUT, 'og.jpg')
  await run('ffmpeg', [
    '-v', 'error',
    '-i', input,
    '-i', scrim,
    '-i', join(IMG_OUT, 'logo-192.png'),
    '-filter_complex', ogFilter(FONT_FILE, {
      domain: 'KOPANJEBUNARA.BA',
      title1: 'Bušenje i kopanje',
      title2: 'bunara',
      sub: 'Cijena i dubina za vašu općinu — prije izlaska na teren.',
      phone: '+387 63 050 308',
    }),
    '-frames:v', '1', '-q:v', '3', '-y', dest,
  ], { cwd: IMG_OUT })

  await rm(scrim, { force: true })
  await rm(join(IMG_OUT, FONT_FILE), { force: true })
  console.log(`  ✓ ${'og.jpg'.padEnd(22)} ${kb((await stat(dest)).size)}`)
}

console.log('  FOTOGRAFIJE')
const photos = await doPhotos()
console.log('\n  VIDEO')
const videos = await doVideos()
console.log('\n  HERO')
const heroes = await doHeroes()
console.log('\n  BREND')
const brand = await doBrand()
console.log('\n  OG KARTICA')
await doOgCard()

/* The manifest is what the site imports — dimensions come from the real
   files so every <img> and <video> ships correct width/height and never
   causes layout shift. */
await writeFile(
  join(ROOT, 'src', 'data', 'media.mjs'),
  `/* GENERATED by media.mjs — do not edit by hand. Run \`node media.mjs\`. */

export const photos = ${JSON.stringify(photos, null, 2)}

export const videos = ${JSON.stringify(videos, null, 2)}

export const heroes = ${JSON.stringify(heroes, null, 2)}

export const brand = ${JSON.stringify(brand, null, 2)}

export const photoBySlug = Object.fromEntries(photos.map(p => [p.slug, p]))
export const heroBySlug  = Object.fromEntries(heroes.map(h => [h.slug, h]))
`,
  'utf8'
)

console.log(`\n  → src/data/media.mjs  (${photos.length} fotografija, ${videos.length} videa)\n`)
