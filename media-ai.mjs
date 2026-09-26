#!/usr/bin/env node
/* ==========================================================================
   AI media pipeline — media-src/ -> public/assets/{photo,video} + manifest.

   Replaces the third-party photos and TikTok clips documented in MEDIA.md
   with our own AI-generated ones, under the SAME slugs, so every page that
   calls photo('garnitura-brdo') etc. picks them up without a code change.

   Leaves alone: the client's hero art (public/assets/hero), logo, favicon
   and OG card — those come from media.mjs and belong to the client.

   Photos: JPEG + WebP at 640/1280/1920 (WebP is ~40% smaller at these
   sizes; the old note against it measured tiny, pre-compressed sources).
   Video:  vertical showcase clips at 720x1280, cinematic band at 1280/1920.

   Run: node media-ai.mjs     (needs ffmpeg + ffprobe on PATH)
   ========================================================================== */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { heroes, brand } from './src/data/media.mjs'

const SRC = 'media-src'
const PHOTO = 'public/assets/photo'
const VIDEO = 'public/assets/video'
const WIDTHS = [640, 1280, 1920]

const PHOTOS = [
  ['garnitura-brdo', 'Bušaća garnitura na brdskom terenu, isplaka izlazi iz bušotine'],
  ['garnitura-njiva', 'Kamionska bušaća garnitura na ravnom terenu uz taložnicu'],
  ['isplaka-blizu', 'Rotaciono bušenje s isplakom — detalj bušotine'],
  ['kolone-cijevi', 'Zaštitne kolone, filterska cijev i šljunak za zasip'],
  ['garnitura-gusjenicar', 'Gusjeničarska bušaća garnitura uz kuću, za teško dostupne parcele'],
  ['garnitura-velika', 'Velika bušaća garnitura na kamenitom terenu u Hercegovini'],
  ['garnitura-sumrak', 'Bušaća garnitura na terenu u sumrak'],
  ['svrdlo-dvoriste', 'Bušenje bunara u dvorištu kuće'],
  ['voda', 'Probno crpljenje — voda izlazi iz novog bunara'],
  ['krs-teren', 'Hercegovački krš: vapnenac, suhozidi i planine'],
  ['posavina', 'Ravnica Posavine s rijekom i poljima'],
]

// showcase clips keep their old slugs, titles and notes
const CLIPS = [
  ['v-isplaka', 'busenje-isplaka', 'Bušenje s isplakom', 'Isplaka iznosi izbušeni materijal i drži zid bušotine stabilnim.'],
  ['v-stijena', 'busenje-stijena', 'Bušenje u stijeni', 'Pneumatski čekić drobi stijenu, a komprimirani zrak izbacuje materijal.'],
  ['v-voda', 'voda-iz-busotine', 'Voda iz bušotine', 'Trenutak zbog kojeg se sve radi — dotok nakon probijanja vodonosnog sloja.'],
]

const ff = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
const probe = f => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f]).toString().trim().split(',').map(Number)
const kb = f => Math.round(statSync(f).size / 1024)

mkdirSync(PHOTO, { recursive: true })
mkdirSync(VIDEO, { recursive: true })

/* clear the old third-party derivatives first, so nothing borrowed lingers */
for (const d of [PHOTO, VIDEO]) for (const f of readdirSync(d)) rmSync(join(d, f))

const photos = []
for (const [slug, alt] of PHOTOS) {
  const src = join(SRC, `${slug}.jpg`)
  if (!existsSync(src)) { console.log(`  - ${slug}: nema izvora, preskačem`); continue }
  const [sw, sh] = probe(src)
  const widths = WIDTHS.filter(w => w <= sw)
  for (const w of widths) {
    ff(['-i', src, '-vf', `scale=${w}:-2:flags=lanczos`, '-q:v', '4', join(PHOTO, `${slug}-${w}.jpg`)])
    ff(['-i', src, '-vf', `scale=${w}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '76', '-compression_level', '6', join(PHOTO, `${slug}-${w}.webp`)])
  }
  const top = widths[widths.length - 1]
  const [w, h] = probe(join(PHOTO, `${slug}-${top}.jpg`))
  photos.push({ slug, alt, widths, w, h, ratio: +(w / h).toFixed(4) })
  console.log(`  ✓ ${slug.padEnd(22)} ${widths.join('/')}  jpg ${kb(join(PHOTO, `${slug}-1280.jpg`))}k  webp ${kb(join(PHOTO, `${slug}-1280.webp`))}k`)
}

const videos = []
for (const [src, slug, title, note] of CLIPS) {
  const file = join(SRC, `${src}.mp4`)
  if (!existsSync(file)) { console.log(`  - ${slug}: nema izvora`); continue }
  const mp4 = join(VIDEO, `${slug}.mp4`)
  ff(['-i', file, '-an', '-vf', 'scale=720:-2:flags=lanczos,fps=24', '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '29', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', mp4])
  ff(['-ss', '1', '-i', file, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '4', join(VIDEO, `${slug}.jpg`)])
  const [w, h] = probe(mp4)
  videos.push({ slug, title, note, w, h, duration: 8 })
  console.log(`  ✓ ${slug.padEnd(22)} ${w}x${h}  ${kb(mp4)}k`)
}

const cine = join(SRC, 'v-cine.mp4')
if (existsSync(cine)) {
  for (const [w, crf] of [[1280, 30], [1920, 29]]) {
    ff(['-i', cine, '-an', '-vf', `scale=${w}:-2:flags=lanczos,fps=24`, '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'film', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', join(VIDEO, `cine-voda-${w}.mp4`)])
  }
  ff(['-i', cine, '-frames:v', '1', '-vf', 'scale=1280:-2', '-c:v', 'libwebp', '-quality', '72', join(VIDEO, 'cine-voda-poster.webp')])
  console.log(`  ✓ cine-voda              1280 ${kb(join(VIDEO, 'cine-voda-1280.mp4'))}k  1920 ${kb(join(VIDEO, 'cine-voda-1920.mp4'))}k`)
}

writeFileSync('src/data/media.mjs', `/* GENERATED by media-ai.mjs (photos, videos) — heroes and brand carried over
   from media.mjs. Do not edit by hand. */

export const photos = ${JSON.stringify(photos, null, 2)}

export const videos = ${JSON.stringify(videos, null, 2)}

export const heroes = ${JSON.stringify(heroes, null, 2)}

export const brand = ${JSON.stringify(brand, null, 2)}

export const photoBySlug = Object.fromEntries(photos.map(p => [p.slug, p]))
export const heroBySlug  = Object.fromEntries(heroes.map(h => [h.slug, h]))
`)
console.log(`manifest: ${photos.length} fotografija, ${videos.length} videa`)
