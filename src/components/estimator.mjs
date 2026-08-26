import { regions, aquiferTypes, oddsMeta } from '../data/regions.mjs'
import { esc, icon } from '../layout.mjs'

/* Data the client-side estimator reads. Inlined as JSON so the tool works
   from the filesystem and on any host, with no fetch and no API. */
export function estimatorData() {
  const out = {}
  for (const r of regions) {
    out[r.slug] = {
      name: r.name,
      entity: r.entity,
      depth: r.depth,
      price: r.price,
      typeLabel: aquiferTypes[r.type].label,
      oddsLabel: oddsMeta[r.odds].label,
      oddsBadge: oddsMeta[r.odds].badge,
      oddsNote: oddsMeta[r.odds].note,
    }
  }
  return out
}

export function estimator(defaultSlug = 'bijeljina') {
  const grouped = {}
  for (const r of regions) (grouped[r.area] ||= []).push(r)

  const sorted = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], 'bs'))

  return `
<div class="tool" id="estimator">
  <div class="tool-input">
    <div class="field">
      <label for="est-region">Općina / područje</label>
      <select id="est-region">
        ${sorted.map(([area, rs]) => `<optgroup label="${esc(area)}">
          ${rs.map(r => `<option value="${r.slug}"${r.slug === defaultSlug ? ' selected' : ''}>${esc(r.name)}</option>`).join('\n          ')}
        </optgroup>`).join('\n        ')}
      </select>
      <span class="hint">Ne vidite svoju općinu? Pozovite — pokrivamo cijelu BiH, lista prikazuje područja za koja imamo pisanu procjenu terena.</span>
    </div>

    <div class="field">
      <label>Za šta vam treba voda</label>
      <div class="seg">
        <input type="radio" name="est-use" id="use-kuca" value="kuca" checked>
        <label for="use-kuca">Domaćinstvo</label>
        <input type="radio" name="est-use" id="use-vrt" value="vrt">
        <label for="use-vrt">Kuća i vrt</label>
        <input type="radio" name="est-use" id="use-navod" value="navod">
        <label for="use-navod">Navodnjavanje</label>
        <input type="radio" name="est-use" id="use-posao" value="posao">
        <label for="use-posao">Posao</label>
      </div>
      <span class="hint">Namjena mijenja potrebnu izdašnost, promjer bušotine — i pravni režim.</span>
    </div>
  </div>

  <div class="tool-out">
    <div class="readout">
      <div><span class="n" data-out="depth">—</span><span class="l">Očekivana dubina</span></div>
      <div><span class="n" data-out="price">—</span><span class="l">Cijena po metru</span></div>
      <div><span class="n" data-out="total">—</span><span class="l">Najčešće ukupno</span></div>
    </div>

    <div class="stack gap-xs">
      <span class="badge badge-good" data-out="odds">—</span>
      <p style="font-family:var(--mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint)" data-out="type">—</p>
      <p style="font-size:.94rem;color:var(--ink-soft)" data-out="note">—</p>
    </div>

    <div class="call" data-out="permit"></div>

    <div class="btn-row">
      <a class="btn btn-primary" href="#" data-out="link">Detaljno o terenu</a>
      <a class="btn btn-ghost" href="/cijena/">Šta ulazi u cijenu ${icon.arrow}</a>
    </div>
  </div>
</div>

<noscript>
  <div class="call warn">
    <span class="k">JavaScript je isključen</span>
    <p>Kalkulator ne radi bez JavaScripta, ali svi podaci postoje i u pisanom obliku — <a href="/podrucja/">pogledajte stranicu svoje općine</a> ili nas jednostavno pozovite.</p>
  </div>
</noscript>`
}
