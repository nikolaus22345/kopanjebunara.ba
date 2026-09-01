/* ==========================================================================
   Favicon — a BOLDER redraw of the logo mark, not a downscale of it.

   The supplied logo is fine line art. Scaled to 16 px it averages away to a
   pale smudge (verified: at 16 px the strata bars and the drop outline are
   barely distinguishable from the background). Favicons need their own
   drawing: fewer elements, much thicker strokes, and a solid ground so the
   mark has presence in a browser tab.

   So this keeps the identity — borehole stem, strata bars, water drop — but
   drops the third bar, thickens everything, and fills the drop rather than
   outlining it.
   ========================================================================== */

import { writePng } from './og.mjs'

const GROUND = [11, 22, 21, 255]      // #0B1615 — dark tile reads on light tab bars
const MARK   = [79, 199, 180, 255]    // #4FC7B4 — the logo teal, brightened for contrast
const CLEAR  = [0, 0, 0, 0]

/* Geometry in a 0..1 unit square, taken from the real logo's measured
   proportions (stems at 47.7% / 52.0%, bars at 32% / 45% / 59%) and then
   deliberately fattened. */
const STEM_W  = 0.085
const BAR_H   = 0.075
const BARS    = [
  { y: 0.30, x0: 0.20, x1: 0.80 },
  { y: 0.47, x0: 0.13, x1: 0.87 },
]
const STEM_TOP = 0.12
const DROP_CY  = 0.735
const DROP_R   = 0.185

/* Supersampled coverage so edges are smooth at any size.
   `px` is the pixel's size in unit space (1 / imageSize) — samples must fall
   INSIDE the pixel. Dividing by `samples` alone spreads them across a
   quarter of the whole image and turns the mark into a smear. */
function coverage(u, v, px, inside, samples = 4) {
  let hit = 0
  const step = px / samples
  for (let sy = 0; sy < samples; sy++) {
    for (let sx = 0; sx < samples; sx++) {
      if (inside(u + (sx + 0.5) * step, v + (sy + 0.5) * step)) hit++
    }
  }
  return hit / (samples * samples)
}

function markShape(u, v) {
  // vertical stem, from the top down into the drop
  if (Math.abs(u - 0.5) <= STEM_W / 2 && v >= STEM_TOP && v <= DROP_CY) return true
  // strata bars
  for (const b of BARS) {
    if (v >= b.y - BAR_H / 2 && v <= b.y + BAR_H / 2 && u >= b.x0 && u <= b.x1) return true
  }
  // filled drop: circle plus a tapering tip that meets the stem
  const dx = u - 0.5, dy = v - DROP_CY
  if (dx * dx + dy * dy <= DROP_R * DROP_R) return true
  const apex = DROP_CY - DROP_R * 2.0
  if (v >= apex && v <= DROP_CY) {
    const t = (v - apex) / (DROP_CY - apex)
    if (Math.abs(dx) <= DROP_R * t * t) return true
  }
  return false
}

/**
 * @param size      pixel size
 * @param rounded   corner radius as a fraction (0 = square, .18 = app icon)
 * @param ground    draw the dark tile, or leave transparent
 */
export function renderFaviconPng(size, { rounded = 0.16, ground = true } = {}) {
  const inTile = (u, v) => {
    if (!rounded) return true
    const r = rounded
    const cx = Math.min(Math.max(u, r), 1 - r)
    const cy = Math.min(Math.max(v, r), 1 - r)
    const dx = u - cx, dy = v - cy
    return dx * dx + dy * dy <= r * r
  }

  return writePng(size, size, (x, y) => {
    const u = x / size, v = y / size
    const step = 1 / size

    const tile = ground ? coverage(u, v, step, (a, b) => inTile(a, b)) : 0
    const mark = coverage(u, v, step, (a, b) => markShape(a, b) && inTile(a, b))

    if (!ground) {
      return mark > 0 ? [MARK[0], MARK[1], MARK[2], Math.round(mark * 255)] : CLEAR
    }

    // composite mark over ground, then the whole tile over transparency
    const r = Math.round(GROUND[0] * (1 - mark) + MARK[0] * mark)
    const g = Math.round(GROUND[1] * (1 - mark) + MARK[1] * mark)
    const b = Math.round(GROUND[2] * (1 - mark) + MARK[2] * mark)
    return [r, g, b, Math.round(tile * 255)]
  })
}

/* Matching SVG, for browsers that prefer it (crisp at every size). */
export function faviconSvg() {
  const bars = BARS.map(b =>
    `<rect x="${(b.x0 * 32).toFixed(1)}" y="${((b.y - BAR_H / 2) * 32).toFixed(1)}" width="${((b.x1 - b.x0) * 32).toFixed(1)}" height="${(BAR_H * 32).toFixed(1)}" rx=".6"/>`
  ).join('\n    ')

  const cx = 16
  const cy = (DROP_CY * 32).toFixed(2)
  const r = (DROP_R * 32).toFixed(2)
  const apex = ((DROP_CY - DROP_R * 2.0) * 32).toFixed(2)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${(0.16 * 32).toFixed(1)}" fill="#0B1615"/>
  <g fill="#4FC7B4">
    <rect x="${(16 - (STEM_W * 32) / 2).toFixed(1)}" y="${(STEM_TOP * 32).toFixed(1)}" width="${(STEM_W * 32).toFixed(1)}" height="${((DROP_CY - STEM_TOP) * 32).toFixed(1)}" rx=".6"/>
    ${bars}
    <path d="M${cx} ${apex} C ${cx + 1.6} ${(+cy - +r * 0.7).toFixed(2)} ${(cx + +r).toFixed(2)} ${(+cy - +r * 0.6).toFixed(2)} ${(cx + +r).toFixed(2)} ${cy} a ${r} ${r} 0 1 1 ${(-2 * r).toFixed(2)} 0 c 0 ${(-(+r) * 0.6).toFixed(2)} ${(+r - 1.6).toFixed(2)} ${(-(+r) * 0.7).toFixed(2)} ${(+r - 0).toFixed(2)} ${(apex - +cy).toFixed(2)} Z"/>
  </g>
</svg>`
}
