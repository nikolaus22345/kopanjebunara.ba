import { regions } from '../data/regions.mjs'
import { site } from '../data/site.mjs'
import { esc, icon, priceFrom } from '../layout.mjs'

/* --------------------------------------------------------------------------
   Estimator — deliberately simple.

   The earlier version modelled a price band per municipality and multiplied
   it by use-case factors. That was false precision: every driller we can
   actually book quotes a flat rate regardless of terrain, so the only thing
   that genuinely varies by location is DEPTH. Price is now a published
   floor, and the total is just depth × floor, labelled "od".

   Namjena stays because it decides the permit answer, which is real.
   -------------------------------------------------------------------------- */

export function estimatorData() {
  const out = {}
  for (const r of regions) {
    out[r.slug] = { name: r.name, entity: r.entity, depth: r.depth }
  }
  return out
}

export function estimator(defaultSlug = 'bijeljina') {
  const grouped = {}
  for (const r of regions) (grouped[r.area] ||= []).push(r)
  const sorted = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], 'bs'))

  return `
<div class="tool" id="estimator" data-rate="${site.pricing.from}">
  <div class="tool-input">
    <div class="field">
      <label for="est-region">Općina</label>
      <select id="est-region">
        ${sorted.map(([area, rs]) => `<optgroup label="${esc(area)}">
          ${rs.map(r => `<option value="${r.slug}"${r.slug === defaultSlug ? ' selected' : ''}>${esc(r.name)}</option>`).join('\n          ')}
        </optgroup>`).join('\n        ')}
      </select>
    </div>

    <div class="field">
      <label>Za šta vam treba voda</label>
      <div class="seg">
        <input type="radio" name="est-use" id="use-kuca" value="kuca" checked>
        <label for="use-kuca">Domaćinstvo</label>
        <input type="radio" name="est-use" id="use-navod" value="navod">
        <label for="use-navod">Navodnjavanje</label>
        <input type="radio" name="est-use" id="use-posao" value="posao">
        <label for="use-posao">Posao</label>
      </div>
    </div>
  </div>

  <div class="tool-out">
    <div class="readout">
      <div><span class="n" data-out="depth">—</span><span class="l">Očekivana dubina</span></div>
      <div><span class="n" data-out="price">—</span><span class="l">Cijena po metru</span></div>
      <div><span class="n" data-out="total">—</span><span class="l">Okvirno ukupno</span></div>
    </div>

    <div class="call" data-out="permit"></div>

    <div class="btn-row">
      <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
      <a class="btn btn-ghost" href="#" data-out="link">Detaljno o terenu</a>
    </div>
  </div>
</div>

<noscript>
  <div class="call warn">
    <span class="k">JavaScript je isključen</span>
    <p>Kalkulator ne radi bez JavaScripta. Cijena je <strong>${esc(priceFrom())}</strong> — pozovite nas i recite općinu, kažemo vam očekivanu dubinu.</p>
  </div>
</noscript>`
}
