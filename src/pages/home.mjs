import { site } from '../data/site.mjs'
import { regions, aquiferTypes } from '../data/regions.mjs'
import { page, icon, esc, faqBlock, faqSchema, ctaBand, priceFrom } from '../layout.mjs'
import { estimator } from '../components/estimator.mjs'
import { videoShowcase, gallery, heroImage } from '../components/media.mjs'

/* Copy leads with what the visitor came for — depth and price before the
   first metre. How we work (partner crews, not our own rig) is stated
   plainly, just lower down: KNOWLEDGE-BASE §7.3 still applies, we never
   present ourselves as the contractor. */

const homeFaq = [
  {
    q: 'Koliko košta bušenje bunara?',
    a: `<p><strong>${priceFrom()}</strong>, i to je ista cijena u cijeloj BiH.</p><p>Ukupan račun ovisi samo o tome koliko se duboko ide. U Posavini voda dođe na 15-40 metara, u hercegovačkom kršu zna se ići i preko sto. <a href="/cijena/">Šta sve ulazi u cijenu</a></p>`,
  },
  {
    q: 'Koliko duboko se buši kod mene?',
    a: '<p>Ovisi o terenu ispod vaše parcele. Semberija i Posavina <strong>15-40 m</strong>, doline središnje Bosne <strong>25-80 m</strong>, hercegovački krš <strong>40-120 m</strong>, nekad i više.</p><p><a href="/podrucja/">Pogledajte svoju općinu</a></p>',
  },
  {
    q: 'Treba li mi dozvola?',
    a: '<p>Ako je bunar na <strong>vašem zemljištu i za kuću</strong>, ne treba. Isto je i u Federaciji i u Republici Srpskoj.</p><p>Dozvola treba tek kad voda ide za <strong>navodnjavanje ili posao</strong>. <a href="/dozvole/">Kako to ide</a></p>',
  },
  {
    q: 'Šta ako se ne nađe voda?',
    a: '<p>O tome se dogovara <strong>prije</strong> nego iko dođe na parcelu, i to napismeno. Neke ekipe naplaćuju izbušene metre, neke pristanu na gornju granicu dubine.</p><p>Na kršu je to najvažnije pitanje, pa vam otvoreno kažemo koliki je rizik.</p>',
  },
  {
    q: 'Da li vi sami bušite?',
    a: `<p>Ne. Radimo s bušačkim ekipama koje imaju svoje strojeve i registrovanu djelatnost, širom BiH.</p><p>Mi vam kažemo šta da očekujete, nađemo ekipu koja poznaje vaš teren i ostanemo na vezi dok posao ne bude gotov. Ugovor potpisujete direktno s njima.</p>`,
  },
  {
    q: 'Naplaćujete li procjenu?',
    a: '<p>Ne. Kažete općinu i za šta vam treba voda, a dobijete dubinu, cijenu i odgovor oko dozvole. Ni na šta se ne obavezujete.</p>',
  },
]

const steps = [
  ['01', 'Javite nam se', 'Kažete gdje je parcela i za šta vam treba voda. Odmah dobijete očekivanu dubinu, cijenu i odgovor oko dozvole.'],
  ['02', 'Dogovorimo ekipu', 'Šaljemo bušače koji rade baš na vašem terenu. Ravnica i krš traže različite strojeve i različito iskustvo.'],
  ['03', 'Buši se, a mi smo na vezi', 'Ekipa izađe, potvrdi ponudu i radi. Mi pratimo posao do kraja i tu smo ako nešto zapne.'],
]

/* The three grounds the 3D model can show. Strata come straight from
   aquiferTypes and the depth ranges are the ones quoted everywhere on the
   site, so the model can never tell a different story from the copy. */
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
      <p class="eyebrow">Bušenje bunara u cijeloj BiH</p>
      <h1>Bušenje i kopanje bunara <br><em>Bosna i Hercegovina</em></h1>
      <p class="kicker">Prije prvog metra znate koliko duboko i koliko košta.</p>
      <p class="lede">Recite nam općinu i za šta vam treba voda. Za par minuta imate očekivanu dubinu, cijenu i odgovor treba li vam dozvola.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
        <a class="btn btn-ghost btn-lg" href="#procjena">Izračunaj za svoju općinu ${icon.arrow}</a>
      </div>
      <div class="hero-answers">
        <div><span class="n">od ${site.pricing.from}</span><span class="l">KM po metru, ista cijena svugdje</span></div>
        <div><span class="n">15-120</span><span class="l">Metara, ovisno o terenu</span></div>
        <div><span class="n">Bez papira</span><span class="l">Za kućni bunar na svom zemljištu</span></div>
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
        <p class="hud-k">Račun do ove dubine</p>
        <p class="hud-price">od <span data-hud="price">0</span> <small>KM</small></p>
      </div>
      <p class="hud-layer" data-hud="layer"></p>
      <p class="hud-status"><i></i><span class="st-drill">Buši se. Voda na oko <span data-hud="target">0</span> m</span><span class="st-water">Voda! Filter i zasip su na mjestu</span></p>
      <p class="terrain-note">${esc(priceFrom(true))} puta broj metara. Slojevi su tipični za taj teren, ne izmjereni na vašoj parceli.</p>
    </div>

    <p class="hero3d-caption"><span class="c1">Metar svugdje košta isto.</span> <em class="s c2">Broj metara ne.</em></p>
    <div class="scroll-hint"><i></i>Skrolajte i bušite</div>
  </div>
  <script type="application/json" id="well-data">${wellData()}</script>
</section>

<section class="band">
  <div class="wrap">
    <p class="eyebrow" data-rv>Zašto dubina, a ne cijena</p>
    <p class="manifesto" style="margin-top:1.6rem">Metar košta isto u Bijeljini i u Ljubuškom. Razlika je <span class="hl">koliko metara treba</span>. To čujete <em class="s">odmah</em>, a ne kad je garnitura već na placu.</p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kako do bunara</h2>
      <span class="tag">Poziv i procjena su besplatni</span>
    </div>
    <p class="lede" style="max-width:58ch;margin-bottom:1.75rem">Nemamo svoju garnituru, i to je namjerno. Radimo s bušačkim ekipama širom BiH i za svaki posao biramo onu koja poznaje vaš teren i ima pravi stroj za njega.</p>
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
      <h2 data-split>Koliko duboko kod vas?</h2>
      <span class="tag">Bez ostavljanja podataka</span>
    </div>
    <div class="stack gap-md">
      <p class="lede" style="max-width:58ch">Metar je svugdje <strong>${esc(priceFrom())}</strong>. Mijenja se samo dubina. Izaberite općinu i vidite okvirno koliko metara i koliki račun.</p>
      ${estimator()}
      <p class="note">Dubine su <strong>okvirne</strong> i izvedene iz geološke građe područja. Konačnu cijenu daje ekipa kad izađe na teren. Ovo nije ponuda u pravnom smislu.</p>
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
      <p>Zbog toga se sve i radi. Naše je da do tog trenutka dođete bez iznenađenja na računu.</p>
    </div>
  </div>
</section>

<section class="band band-deep">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Kako izgleda bušenje</h2>
      <span class="tag">Isplaka, stijena, voda</span>
    </div>
    <p class="lede" style="max-width:56ch;margin-bottom:1.75rem">Bušenje nije čist posao. Isplaka, prašina iz stijene i blato na sve strane. I onda voda.</p>
    ${videoShowcase()}
    <p class="swipe-hint">Povucite za još</p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem">
      <div class="call" data-rv>
        <span class="k">Cijena</span>
        <p><strong>${esc(priceFrom())}</strong>, ista za svaki teren. U cijenu ulaze bušenje, kolona, filter, šljunčani zasip, tampon i ispiranje. Pumpa i struja idu posebno. <a href="/cijena/">Detaljno</a></p>
      </div>
      <div class="call" data-rv=".08">
        <span class="k">Dozvola uglavnom ne treba</span>
        <p>Za kućni bunar na svom zemljištu papiri ne trebaju. Navodnjavanje i posao traže vodne akte. <a href="/dozvole/">Kako to ide</a></p>
      </div>
      <div class="call warn" data-rv=".16">
        <span class="k">Kažemo i kad teren nije dobar</span>
        <p>Na kršu i laporu voda zna izostati. To čujete u prvom razgovoru, a ne na pola bušotine. <a href="/podrucja/">Šta je ispod vaše općine</a></p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt" style="padding-bottom:0" aria-labelledby="podrucja-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="podrucja-h" data-split>${regions.length} općina, od plitkog do dubokog</h2>
      <span class="tag">Obrub = dublje od 80 m</span>
    </div>
  </div>
  ${rows.map(row => `<div class="marquee"><div class="marquee-track">
    ${row.map(r => `<a href="/podrucja/${r.slug}/"${r.depth[1] > 80 ? ' class="deep"' : ''}>${esc(r.name)}<small>${r.depth[0]}-${r.depth[1]} m</small></a>`).join('')}
  </div></div>`).join('\n  ')}
  <div class="wrap" style="padding-block:2.5rem 4rem">
    <div class="regions-list reveal">
      ${tier1.map(r => `<a class="region-item" href="/podrucja/${r.slug}/">
        <span class="r-n">${esc(r.name)}</span>
        <span class="r-d">${r.depth[0]}-${r.depth[1]} m dubine</span>
        <span class="r-t">${esc(r.area)}</span>
      </a>`).join('\n      ')}
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/podrucja/">Pronađite svoju općinu ${icon.arrow}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2 data-split>Strojevi, teren, materijal</h2>
      <span class="tag">Ilustracije</span>
    </div>
    ${gallery()}
    <p class="swipe-hint">Povucite za još</p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2 data-split>Česta pitanja</h2>
      <span class="tag">Kratko i jasno</span>
    </div>
    ${faqBlock(homeFaq)}
    <p style="margin-top:1.25rem"><a class="btn btn-ghost" href="/pitanja/">Sva pitanja ${icon.arrow}</a></p>
  </div>
</section>

${ctaBand()}
`

  return page({
    title: `Bušenje i kopanje bunara Bosna i Hercegovina | ${site.name}`,
    description: `Bušenje i kopanje bunara u cijeloj BiH, ${priceFrom()}. Dubinu, cijenu i odgovor oko dozvole znate prije nego krene bušenje.`,
    path: '/',
    body,
    bodyClass: 'home',
    schema: [faqSchema(homeFaq)],
  })
}
