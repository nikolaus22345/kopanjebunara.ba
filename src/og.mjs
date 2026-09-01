/* ==========================================================================
   Open Graph image generator — writes public/assets/img/og.png (1200×630).

   Why hand-rolled: an og:image must be a raster format. Facebook, WhatsApp
   and Viber all ignore SVG, and WhatsApp link previews are how this market
   actually shares things. There is no image library in this project, so the
   card is drawn per-pixel and encoded with Node's built-in zlib.

   The card is deliberately geometric — the brand's strata motif, borehole
   line and water drop. To get a card WITH TEXT (better click-through), open
   src/og-card.html in a browser at 1200×630, screenshot it, and save it over
   public/assets/img/og.png. Nothing else needs to change.
   ========================================================================== */

import { deflateSync } from 'node:zlib'

const W = 1200, H = 630

const hex = h => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]

const BG      = hex('#0B1615')
const ACCENT  = hex('#2FA091')
const ACCENT2 = hex('#55C7B4')
const RULE    = hex('#21332F')

// Same layer colours as the on-site strata graphic (aluvij profile).
const BANDS = [
  { c: hex('#4A3B2A'), h: 6 },
  { c: hex('#8A7359'), h: 22 },
  { c: hex('#B49A6E'), h: 17 },
  { c: hex('#C8A96B'), h: 15 },
  { c: hex('#8FA9A5'), h: 26, water: true },
  { c: hex('#6E6152'), h: 14 },
]

export function crc32(buf) {
  let c, crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = (crc ^ buf[i]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = c ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

export function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

export function renderOgPng() {
  // raw scanlines: 1 filter byte + RGB per pixel
  const raw = Buffer.alloc(H * (1 + W * 3))

  const stratTop = Math.round(H * 0.58)
  const stratH = H - stratTop
  const bandTotal = BANDS.reduce((a, b) => a + b.h, 0)

  // precompute band boundaries
  let acc = 0
  const bounds = BANDS.map(b => {
    const y0 = stratTop + Math.round((acc / bandTotal) * stratH)
    acc += b.h
    const y1 = stratTop + Math.round((acc / bandTotal) * stratH)
    return { ...b, y0, y1 }
  })

  const dropCx = W * 0.5
  const dropCy = stratTop - 132
  const dropR = 96

  for (let y = 0; y < H; y++) {
    const rowStart = y * (1 + W * 3)
    raw[rowStart] = 0 // filter: none

    const band = bounds.find(b => y >= b.y0 && y < b.y1)

    for (let x = 0; x < W; x++) {
      let px = BG

      if (band) {
        px = band.c
        // hatch the water-bearing layer, same as the site graphic
        if (band.water && (x + y) % 8 < 2) px = [
          Math.min(255, band.c[0] + 46),
          Math.min(255, band.c[1] + 46),
          Math.min(255, band.c[2] + 46),
        ]
        // thin rule between bands
        if (y === band.y0) px = RULE
      } else {
        // borehole line down the middle
        if (Math.abs(x - dropCx) <= 2) px = RULE
        // water drop: circle + tapering triangle above it
        const dx = x - dropCx, dy = y - dropCy
        const inCircle = dx * dx + dy * dy <= dropR * dropR
        const apex = dropCy - dropR * 2.05
        let inTip = false
        if (y >= apex && y <= dropCy) {
          const t = (y - apex) / (dropCy - apex)
          if (Math.abs(dx) <= dropR * t * t) inTip = true
        }
        if (inCircle || inTip) {
          // subtle vertical lift so the drop doesn't read as flat
          const f = (y - (dropCy - dropR)) / (dropR * 2)
          px = [
            Math.round(ACCENT2[0] + (ACCENT[0] - ACCENT2[0]) * f),
            Math.round(ACCENT2[1] + (ACCENT[1] - ACCENT2[1]) * f),
            Math.round(ACCENT2[2] + (ACCENT[2] - ACCENT2[2]) * f),
          ]
        }
      }

      // outer frame
      if (x < 4 || x >= W - 4 || y < 4 || y >= H - 4) px = ACCENT

      const o = rowStart + 1 + x * 3
      raw[o] = px[0]; raw[o + 1] = px[1]; raw[o + 2] = px[2]
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // colour type: truecolour RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}


/* Generic RGBA PNG writer, reused by the favicon generator.
   px(x, y) returns [r, g, b, a]. */
export function writePng(W, H, px) {
  const raw = Buffer.alloc(H * (1 + W * 4))
  for (let y = 0; y < H; y++) {
    const row = y * (1 + W * 4)
    raw[row] = 0
    for (let x = 0; x < W; x++) {
      const [r, g, b, a] = px(x, y)
      const o = row + 1 + x * 4
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8; ihdr[9] = 6            // 8-bit, truecolour + alpha
  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
