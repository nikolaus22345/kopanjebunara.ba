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
import { mkdir, stat, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const ROOT = dirname(fileURLToPath(import.meta.url))
const SRC = process.argv[2] || 'C:\\Users\\windows11\\Downloads\\kopanje bunara'
const PHOTO_OUT = join(ROOT, 'public', 'assets', 'photo')
const VIDEO_OUT = join(ROOT, 'public', 'assets', 'video')

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
console.log('  FOTOGRAFIJE')
const photos = await doPhotos()
console.log('\n  VIDEO')
const videos = await doVideos()

/* The manifest is what the site imports — dimensions come from the real
   files so every <img> and <video> ships correct width/height and never
   causes layout shift. */
await writeFile(
  join(ROOT, 'src', 'data', 'media.mjs'),
  `/* GENERATED by media.mjs — do not edit by hand. Run \`node media.mjs\`. */

export const photos = ${JSON.stringify(photos, null, 2)}

export const videos = ${JSON.stringify(videos, null, 2)}

export const photoBySlug = Object.fromEntries(photos.map(p => [p.slug, p]))
`,
  'utf8'
)

console.log(`\n  → src/data/media.mjs  (${photos.length} fotografija, ${videos.length} videa)\n`)
