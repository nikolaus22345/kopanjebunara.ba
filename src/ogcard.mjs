/* ==========================================================================
   Open Graph card — the real hero photograph with a scrim and text.

   Replaces the earlier hand-drawn geometric card. WhatsApp and Viber
   previews are how links get shared in this market, and a photograph of an
   actual rig at dawn earns a click that an abstract mark does not.

   Text is drawn with ffmpeg's drawtext + Bahnschrift (the closest system
   face to the site's Barlow Condensed). The scrim is generated as an RGBA
   PNG rather than an ffmpeg gradient so the falloff is exactly controllable.
   ========================================================================== */

import { writePng } from './og.mjs'

export const OG_W = 1200
export const OG_H = 630

/* Left-weighted scrim so the headline sits on near-solid ground while the
   right side of the photo stays visible. */
export function renderScrimPng() {
  return writePng(OG_W, OG_H, (x, y) => {
    const u = x / OG_W, v = y / OG_H

    // horizontal: opaque at the left edge, clear by ~72% across
    const h = Math.max(0, 1 - Math.pow(u / 0.72, 1.35))
    // vertical: a little extra weight top and bottom to settle the edges
    const vt = Math.max(0, 1 - v / 0.22) * 0.35
    const vb = Math.max(0, (v - 0.72) / 0.28) * 0.45
    // a low global tint so the photo never fights the text
    const base = 0.18

    const a = Math.min(1, base + h * 0.82 + vt + vb)
    return [11, 22, 21, Math.round(a * 255)]
  })
}

/* Font stack: Bahnschrift is condensed and present on every modern Windows
   install; Arial Bold is the fallback if it ever isn't. */
/* Referenced as a BARE FILENAME, resolved via the ffmpeg process cwd.
   An absolute Windows path cannot be used here: the drive-letter colon is
   also the filtergraph option separator, and escaping it does not survive
   ffmpeg's two-stage unescaping. media.mjs copies the font next to the
   output and runs ffmpeg from that directory. */
export const FONT_SOURCES = [
  'C:/Windows/Fonts/bahnschrift.ttf',
  'C:/Windows/Fonts/arialbd.ttf',
]
export const FONT_FILE = '_ogfont.ttf'

/**
 * Build the ffmpeg filtergraph for the card.
 * @param font  escaped font path
 * @param lines { title1, title2, sub, phone }
 */
export function ogFilter(font, lines) {
  const t = (text, opts) => {
    const o = {
      fontfile: font,
      text: text.replace(/[:\\']/g, m => '\\' + m),
      fontcolor: opts.color,
      fontsize: opts.size,
      x: opts.x,
      y: opts.y,
      ...(opts.extra || {}),
    }
    return 'drawtext=' + Object.entries(o).map(([k, v]) => `${k}=${v}`).join(':')
  }

  return [
    // photo: cover 1200x630, biased slightly above centre to keep the sky
    `[0:v]scale=${OG_W}:-2:flags=lanczos,crop=${OG_W}:${OG_H}:0:(ih-${OG_H})*0.42[bg]`,
    `[bg][1:v]overlay=0:0[scrimmed]`,
    // the logo mark, top-left, scaled to a 62px cap height
    `[2:v]scale=-1:62[logo]`,
    `[scrimmed][logo]overlay=68:56[branded]`,
    `[branded]` + [
      t(lines.title1, { color: '0xE7EEEC', size: 68, x: 68, y: 150 }),
      t(lines.title2, { color: '0x55C7B4', size: 68, x: 68, y: 226 }),
      t(lines.sub,    { color: '0xB9C9C5', size: 29, x: 70, y: 330 }),
      t(lines.phone,  { color: '0xE7EEEC', size: 40, x: 70, y: 470 }),
      t(lines.domain, { color: '0x55C7B4', size: 26, x: 148, y: 74 }),
      // teal keyline
      `drawbox=x=0:y=0:w=${OG_W}:h=${OG_H}:color=0x2FA091@1.0:t=6`,
    ].join(','),
  ].join(';')
}
