import { site } from '../data/site.mjs'
import { regions, aquiferTypes } from '../data/regions.mjs'
import { page, icon, esc, faqBlock, faqSchema, ctaBand, priceFrom } from '../layout.mjs'
import { estimator } from '../components/estimator.mjs'
import { videoShowcase, gallery, heroImage } from '../components/media.mjs'

const homeFaq = [
  {
    q: 'Vi bušite ili posredujete?',
    a: `<p><strong>Ne bušimo sami.</strong> Povezujemo vas s bušačkim ekipama koje imaju vlastite strojeve i registrovanu djelatnost.</p><p>Mi uzmemo podatke, kažemo vam očekivanu dubinu i cijenu, i pošaljemo ekipu koja radi na vašem terenu. Posao ugovarate s njima, a mi ostajemo na vezi dok se ne završi.</p>`,
  },
  {
    q: 'Koliko košta?',
    a: `<p>Bušenje je <strong>${priceFrom()}</strong> — ista cijena za svaki teren u BiH.</p><p>Ukupan račun zavisi od dubine. U Posavini se voda nađe na 15–40 m, u hercegovačkom kršu se ide i preko sto. <a href="/cijena/">Šta ulazi u cijenu &rarr;</a></p>`,
  },
  {
    q: 'Treba li mi dozvola?',
    a: '<p>Za bunar na <strong>vlastitom zemljištu, za potrebe domaćinstva</strong> — ne treba. Tako je i u Federaciji i u Republici Srpskoj.</p><p>Treba čim pređete u <strong>navodnjavanje ili posao</strong>. <a href="/dozvole/">Cijeli postupak &rarr;</a></p>',
  },
  {
    q: 'Koliko duboko se buši?',
    a: '<p>Zavisi od terena. Semberija i Posavina <strong>15–40 m</strong>, središnja Bosna <strong>25–80 m</strong>, hercegovački krš <strong>40–120 m</strong> i više.</p><p><a href="/podrucja/">Očekivana dubina za vašu općinu &rarr;</a></p>',
  },
  {
    q: 'Šta ako se ne nađe voda?',
    a: '<p>To se dogovara <strong>prije</strong> nego iko izađe na parcelu, i mora biti napisano. Neke ekipe naplaćuju izvedene metre, neke pristanu na ograničenu dubinu.</p><p>Na kršu je to najvažnije pitanje, i tu vam otvoreno kažemo koliki je rizik.</p>',
  },
  {
    q: 'Košta li vaša procjena?',
    a: '<p>Ne. Kažete nam općinu i za šta vam treba voda, dobijete dubinu, cijenu i odgovor o dozvoli. Ne obavezuje vas ni na šta.</p>',
  },
]

const steps = [
  ['01', 'Nazovete nas', 'Kažete općinu i za šta vam treba voda. Dobijete očekivanu dubinu, cijenu i odgovor treba li dozvola — odmah, telefonom.'],
  ['02', 'Nađemo ekipu', 'Biramo bušača koji radi na vašem terenu i ima pravu mehanizaciju za njega. Krš i ravnica nisu isti posao ni isti stroj.'],
  ['03', 'Oni buše, mi ostajemo na vezi', 'Ekipa izlazi, daje konačnu ponudu i radi. Mi pratimo posao do kraja i tu smo ako nešto zapne.'],
]

/* The three grounds the 3D model can show. Strata come straight from
   aquiferTypes, the depth ranges are the ones quoted everywhere on the site,
   so the model can never tell a different story from the copy. */
const WELL_TYPES = {
  aluvij: { label: 'Posavina i Semberija', depth: [15, 40], surface: '#56663a', tree: '#3b5a2e' },
  mjesovito: { label: 'Doline središnje Bosne', depth: [25, 80], surface: '#566a3a', tree: '#355230' },
  krs: { label: 'Hercegovački krš', depth: [40, 120], surface: '#84867a', tree: '#4f6338' },
}
const wellData = () => JSON.stringify(Object.fromEntries(Object.entries(WELL_TYPES).map(([k, v]) => [k, {
  ...v, strata: aquiferTypes[k].strata.map(({ n, h, c, dark, water }) => ({ n, h, c, dark: !!dark, water: !!water })),
}])))

export function homePage() {
  const tier1 = regions.filter(r => r.tier === 1).slice(0, 12)
  const byDepth = [...regions].sort((a, b) => a.depth[1] - b.depth[1])
  const half = Math.ceil(byDepth.length / 2)
  const rows = [byDepth.slice(0, half), byDepth.slice(half)]

  const body = `
<section class="hero3d" data-rate="${site.pricing.from}" aria-label="Uvod">
  <div class="hero3d-stage">
    <div class="hero3d-sky"></div>
    <div class="hero3d-fallback">
      ${heroImage({ alt: 'Bušaća garnitura u radu na brdskom imanju u Bosni i Hercegovini, u zoru' })}
    </div>
    <canvas aria-hidden="true"></canvas>

    <div class="wrap hero3d-copy">
      <p class="eyebrow">Cijela Bosna i Hercegovina</p>
      <h1>Bušenje i kopanje bunara <br><em>Bosna i Hercegovina</em></h1>
      <p class="kicker">Nismo bušači — povezujemo vas s ekipama koje buše.</p>
      <p class="lede">Kažete nam općinu i za šta vam treba voda. Dobijete očekivanu dubinu, cijenu i odgovor treba li dozvola — prije nego iko izađe na teren.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
        <a class="btn btn-ghost btn-lg" href="#procjena">Provjeri za svoju općinu ${icon.arrow}</a>
      </div>
      <div class="hero-answers">
        <div><span class="n">od ${site.pricing.from}</span><span class="l">KM po metru, ista cijena svugdje</span></div>
        <div><span class="n">15–120</span><span class="l">Metara dubine, ovisno o terenu</span></div>
        <div><span class="n">0</span><span class="l">Dozvola za kućni bunar na svom zemljištu</span></div>
      </div>
    </div>

    <div class="well-hud" aria-live="off">
      <div class="terrain" role="group" aria-label="Teren">
        ${Object.entries(WELL_TYPES).map(([k, v], i) => `<button type="button" data-type="${k}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join('\n        ')}
      </div>
      <div>
        <p class="hud-k">Dubina</p>
        <p class="hud-metres"><span data-hud="metres">0</span><small>m</small></p>
      </div>
      <div>
        <p class="hud-k">Cijena do ove dubine</p>
        <p class="hud-price">od <span data-hud="price">0</span> <small>KM</small></p>
      </div>
      <p class="hud-layer" data-hud="layer"></p>
      <p class="hud-status"><i></i><span class="st-drill">Buši se · voda oko <span data-hud="target">0</span> m</span><span class="st-water">Voda! Filter i zasip na mjestu</span></p>
      <p class="terrain-note">${esc(priceFrom(true))} × metri. Profil je tipičan za teren, ne mjeren za vašu parcelu.</p>
    </div>

    <p class="hero3d-caption">Cijena po metru je ista. <em class="s">Broj metara nije.</em></p>
    <div class="scroll-hint"><i></i>Skrolajte da bušite</div>
  </div>
  <script type="application/json" id="well-data">${wellData()}</script>
</section>

<section class="band">
  <div class="wrap">
    <p class="eyebrow" data-rv>Da ne bude zabune</p>
    <p class="manifesto" style="margin-top:1.6rem">Mi nismo bušačka firma. Spojimo vas s ekipom koja radi na <em class="s">vašem</em> terenu — i prije toga vam kažemo koliko duboko, koliko košta i treba li dozvola.</p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kako ovo radi</h2>
      <span class="tag">Poziv i procjena su besplatni</span>
    </div>
    <div class="grid grid-3 reveal">
      ${steps.map(([n, t, b]) => `<div class="card">
        <span class="card-num">${n}</span>
        <h3>${esc(t)}</h3>
        <p>${esc(b)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="band" id="procjena">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Provjerite za svoju općinu</h2>
      <span class="tag">Bez ostavljanja podataka</span>
    </div>
    <div class="stack gap-md">
      <p class="lede" style="max-width:58ch">Cijena bušenja je svugdje ista — <strong>${esc(priceFrom())}</strong>. Ono što se mijenja je dubina, a ona zavisi od toga šta je ispod vaše parcele.</p>
      ${estimator()}
      <p class="note">Dubine su <strong>orijentacione</strong>, izvedene iz geološke građe područja. Konačnu cijenu daje ekipa nakon izlaska na teren. Nije ponuda u pravnom smislu.</p>
    </div>
  </div>
</section>

<section class="cine" aria-label="Voda iz bušotine">
  <div class="cine-stage">
    <div class="cine-media">
      <video muted loop playsinline preload="none" poster="/assets/video/cine-voda-poster.webp"
        data-src="/assets/video/cine-voda-1280.mp4" data-src-hd="/assets/video/cine-voda-1920.mp4" aria-hidden="true"></video>
    </div>
    <div class="cine-copy">
      <p class="eyebrow">Probno crpljenje</p>
      <h2>Trenutak kad <em class="s">voda krene</em>.</h2>
      <p>Zbog tog trenutka se sve radi. Naš posao je da do njega dođete bez iznenađenja u cijeni.</p>
    </div>
  </div>
</section>

<section class="band band-deep">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kako izgleda bušenje</h2>
      <span class="tag">Isplaka, stijena, voda</span>
    </div>
    <p class="lede" style="max-width:56ch;margin-bottom:1.75rem">Bušenje nije čist posao i ne pravimo se da jeste. Ovako izgleda isplaka, ovako stijena, i ovako trenutak kad voda krene.</p>
    ${videoShowcase()}
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.25rem">
      <div class="call" data-rv>
        <span class="k">Cijena</span>
        <p><strong>${esc(priceFrom())}</strong>, ista za svaki teren. U cijeni su bušenje, kolona, filter, šljunčani zasip, tampon i ispiranje. Pumpa i elektro dolaze zasebno. <a href="/cijena/">Detaljno &rarr;</a></p>
      </div>
      <div class="call" data-rv=".08">
        <span class="k">Dozvola — najčešće ne treba</span>
        <p>Bunar na vlastitom zemljištu za kućne potrebe je <strong>opća upotreba voda</strong>, bez papira. Navodnjavanje i posao traže vodne akte. <a href="/dozvole/">Cijeli postupak &rarr;</a></p>
      </div>
      <div class="call warn" data-rv=".16">
        <span class="k">Kažemo i kad je teren loš</span>
        <p>Na kršu i fliškom terenu izdašnost zna izostati. To vam kažemo prvim pozivom, a ne na pola bušotine. <a href="/podrucja/">Šta je ispod vaše općine &rarr;</a></p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt" style="padding-bottom:0" aria-labelledby="podrucja-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="podrucja-h" data-split>${regions.length} općina. Od plitkog do dubokog.</h2>
      <span class="tag">Obrub = preko 80 m</span>
    </div>
  </div>
  ${rows.map(row => `<div class="marquee"><div class="marquee-track">
    ${row.map(r => `<a href="/podrucja/${r.slug}/"${r.depth[1] > 80 ? ' class="deep"' : ''}>${esc(r.name)}<small>${r.depth[0]}–${r.depth[1]} m</small></a>`).join('')}
  </div></div>`).join('\n  ')}
  <div class="wrap" style="padding-block:2.5rem 4rem">
    <div class="regions-list reveal">
      ${tier1.map(r => `<a class="region-item" href="/podrucja/${r.slug}/">
        <span class="r-n">${esc(r.name)}</span>
        <span class="r-d">${r.depth[0]}–${r.depth[1]} m dubine</span>
        <span class="r-t">${esc(r.area)}</span>
      </a>`).join('\n      ')}
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/podrucja/">Sve općine ${icon.arrow}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Strojevi, teren, materijal</h2>
      <span class="tag">Ilustracije</span>
    </div>
    ${gallery()}
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2 data-split>Česta pitanja</h2>
      <span class="tag">Kratki odgovori</span>
    </div>
    ${faqBlock(homeFaq)}
    <p style="margin-top:1.25rem"><a class="btn btn-ghost" href="/pitanja/">Sva pitanja ${icon.arrow}</a></p>
  </div>
</section>

${ctaBand()}
`

  return page({
    title: `Bušenje i kopanje bunara Bosna i Hercegovina | ${site.name}`,
    description: `Bušenje i kopanje bunara u cijeloj BiH, ${priceFrom()}. Povezujemo vas s provjerenim bušačkim ekipama — dubina, cijena i dozvola prije izlaska na teren.`,
    path: '/',
    body,
    bodyClass: 'home',
    schema: [faqSchema(homeFaq)],
  })
}
