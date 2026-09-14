import { site } from '../data/site.mjs'
import { regions, regionBySlug, aquiferTypes, oddsMeta } from '../data/regions.mjs'
import { page, pageHead, crumbs, icon, esc, strata, faqBlock, faqSchema, ctaBand, priceFrom, totalFrom, km } from '../layout.mjs'
import { estimator } from '../components/estimator.mjs'
import { photo, photoBand } from '../components/media.mjs'

/* One representative photo per terrain type, so a Posavina page and a
   Herzegovina page don't show the same rig on the same ground. */
const TYPE_PHOTO = {
  aluvij: 'garnitura-njiva',
  mjesovito: 'garnitura-brdo',
  flis: 'garnitura-gusjenicar',
  krs: 'garnitura-velika',
}

const ENTITY = {
  FBiH: {
    name: 'Federacija BiH',
    body: 'Agencija za vodno područje rijeke Save (Sarajevo), odnosno Agencija za vodno područje Jadranskog mora (Mostar) za hercegovački sliv',
    law: 'Zakonu o vodama FBiH',      // locative — used as "po ___"
  },
  RS: {
    name: 'Republika Srpska',
    body: 'JU „Vode Srpske“, Odjeljenje za vodopravne akte',
    law: 'Zakonu o vodama RS',
  },
  BD: {
    name: 'Brčko distrikt',
    body: 'nadležni organ Brčko distrikta, po propisima Distrikta',
    law: 'propisima Brčko distrikta',
  },
}

/* ---------------- /podrucja/ index ---------------- */

export function podrucjaIndexPage() {
  const byType = {}
  for (const r of regions) (byType[r.type] ||= []).push(r)

  const order = ['aluvij', 'mjesovito', 'flis', 'krs']

  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Područja' }])}
${pageHead({
    eyebrow: `${regions.length} općina i područja`,
    title: 'Bušenje i kopanje bunara <br><em>po područjima BiH</em>',
    lede: `Cijena bušenja je svugdje ista — ${priceFrom()}. Ono što se mijenja je dubina, a ona zavisi od terena. Za svaku općinu piše koliko se realno očekuje.`,
  })}

<section class="band band-tight band-alt">
  <div class="wrap">
    ${estimator()}
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Četiri tipa terena</h2>
      <span class="tag">Teren odlučuje o dubini</span>
    </div>
    <div class="grid grid-4">
      ${order.map(k => {
        const t = aquiferTypes[k]
        const rs = byType[k] || []
        return `<div class="card">
        <span class="badge badge-${t.badge}">${esc(t.short)}</span>
        <h3>${esc(t.label)}</h3>
        <p>${esc(t.headline)}</p>
        <p style="font-family:var(--mono);font-size:.72rem;color:var(--ink-faint);letter-spacing:.06em">${rs.length} područja</p>
      </div>`
      }).join('\n      ')}
    </div>
  </div>
</section>

${order.map(k => {
  const t = aquiferTypes[k]
  const rs = (byType[k] || []).sort((a, b) => a.name.localeCompare(b.name, 'bs'))
  if (!rs.length) return ''
  return `
<section class="band ${k === 'mjesovito' || k === 'krs' ? 'band-alt' : ''}">
  <div class="wrap">
    <div class="sec-head">
      <h2>${esc(t.label)}</h2>
      <span class="tag">${rs.length} područja</span>
    </div>
    <p class="lede" style="max-width:64ch;margin-bottom:1.5rem">${esc(t.body[0])}</p>
    <div class="regions-list">
      ${rs.map(r => `<a class="region-item" href="/podrucja/${r.slug}/">
        <span class="r-n">${esc(r.name)}</span>
        <span class="r-d">${r.depth[0]}–${r.depth[1]} m dubine</span>
        <span class="r-t">${esc(r.area)}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`
}).join('\n')}

${photoBand('garnitura-velika', 'Isti stroj, isti ljudi — potpuno različit rezultat u Semberiji i na Brotnju.')}

<section class="band">
  <div class="wrap-narrow">
    <div class="call warn">
      <span class="k">Ne vidite svoju općinu?</span>
      <p>Pokrivamo <strong>cijelu Bosnu i Hercegovinu</strong>. Ova lista prikazuje područja za koja imamo pisanu procjenu terena — dodajemo nova kako dolaze podaci s izvedenih bušotina. Za sve ostalo nas jednostavno pozovite.</p>
    </div>
  </div>
</section>

${ctaBand()}
`

  return page({
    title: 'Bušenje i kopanje bunara po područjima BiH',
    description: `Očekivana dubina bunara za ${regions.length} općina u BiH, od plitke Posavine do dubokog hercegovačkog krša. Cijena bušenja od ${site.pricing.from} KM po metru.`,
    path: '/podrucja/',
    body,
  })
}

/* ---------------- /podrucja/{slug}/ ---------------- */

export function regionPage(r) {
  const t = aquiferTypes[r.type]
  const odds = oddsMeta[r.odds]
  const ent = ENTITY[r.entity]
  const near = (r.near || []).map(s => regionBySlug[s]).filter(Boolean)

  const midDepth = Math.round((r.depth[0] + r.depth[1]) / 2)

  /* Price is a single published floor now, not a per-region band. Only
     depth genuinely varies by location, so the total is just depth × rate. */
  const total = totalFrom(r.depth)
  const lo = total.lo
  const hi = total.hi

  const faq = [
    {
      q: `Koliko duboko se buši bunar u ${r.loc}?`,
      a: `<p>Za tipično domaćinstvo očekujte <strong>${r.depth[0]}–${r.depth[1]} metara</strong>. To je raspon za ${t.label.toLowerCase()}, kakva prevladava u ovom području.</p><p>${esc(odds.note)}</p>`,
    },
    {
      q: `Koliko košta bunar u ${r.loc}?`,
      a: `<p>Cijena bušenja je <strong>${priceFrom()}</strong>, ista bez obzira na teren. Ono što se mijenja je dubina — ovdje se očekuje <strong>${r.depth[0]}–${r.depth[1]} m</strong>, pa je bušotina okvirno <strong>${total.text}</strong>.</p><p>Pumpa, hidrofor i elektroinstalacija dolaze zasebno. <a href="/cijena/">Šta ulazi u cijenu &rarr;</a></p>`,
    },
    {
      q: `Treba li dozvola za bunar u ${r.loc}?`,
      a: `<p>${r.name} je u ${ent.name}. Za bunar na vlastitom zemljištu za potrebe domaćinstva — <strong>ne treba</strong>, to je opća upotreba voda po ${ent.law}.</p><p>Za navodnjavanje ili poslovnu namjenu trebaju vodni akti, a izdaje ih ${ent.body}. <a href="/dozvole/">Detaljno &rarr;</a></p>`,
    },
    {
      q: `Kakva je voda u ${r.loc}?`,
      a: `<p>${esc(r.water)}</p><p>Analiza vode se radi jednom i kaže vam tačno šta imate. <a href="/usluge/analiza-vode/">Šta se analizira &rarr;</a></p>`,
    },
  ]

  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Područja', href: '/podrucja/' }, { label: r.name }])}

<section class="page-head">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,15rem);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="stack gap-md">
        <p class="eyebrow">${esc(r.area)} &middot; ${esc(ent.name)}</p>
        <h1>Bušenje i kopanje bunara <br><em>${esc(r.name)}</em></h1>
        <p class="lede">${esc(r.intro)}</p>
        <div class="readout" style="margin-top:.5rem">
          <div><span class="n">${r.depth[0]}–${r.depth[1]} <small>m</small></span><span class="l">Očekivana dubina</span></div>
          <div><span class="n">od ${site.pricing.from} <small>KM/m</small></span><span class="l">Cijena po metru</span></div>
          <div><span class="n">${km(lo)}–${km(hi)} <small>KM</small></span><span class="l">Okvirno ukupno</span></div>
        </div>
        <div class="btn-row" style="margin-top:.5rem">
          <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
          <a class="btn btn-ghost btn-lg" href="/kontakt/">Pošalji upit</a>
        </div>
      </div>
      ${strata(t.strata, [0, r.depth[1]], { light: true, caption: `Tipičan profil za ${esc(t.short.toLowerCase())} — orijentacioni prikaz, ne mjerenje za pojedinu parcelu.` })}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Teren</h2>
      <span class="tag">${esc(t.label)}</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,19rem);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="prose">
        <p style="font-family:var(--display);font-size:1.45rem;text-transform:uppercase;letter-spacing:.015em;color:var(--accent)">${esc(t.headline)}</p>
        ${t.body.map(p => `<p>${esc(p)}</p>`).join('\n        ')}
      </div>
      <div class="stack gap-md">
        <div class="panel panel-accent">
          <span class="badge badge-${odds.badge}">${esc(odds.label)}</span>
          <p>${esc(odds.note)}</p>
        </div>
        <div class="panel">
          <h3>Voda u ${esc(r.loc)}</h3>
          <p style="color:var(--ink-soft)">${esc(r.water)}</p>
        </div>
        ${photo(TYPE_PHOTO[r.type] || 'garnitura-njiva', {
          sizes: '(max-width: 860px) 100vw, 20rem',
          ratio: '4/3',
          caption: `Tipičan teren i mehanizacija za ${esc(t.short.toLowerCase())}.`,
        })}
      </div>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Dozvola za bunar u ${esc(r.loc)}</h2>
      <span class="tag">${esc(ent.name)}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.25rem">
      <div class="call">
        <span class="k">Domaćinstvo — ne treba</span>
        <p>Bunar na vlastitom zemljištu, voda za piće, kuhanje i higijenu. To je <strong>opća upotreba voda</strong> po ${esc(ent.law)} i ne traži nikakav papir.</p>
      </div>
      <div class="call warn">
        <span class="k">Navodnjavanje i posao — treba</span>
        <p>Vodne akte izdaje <strong>${esc(ent.body)}</strong>. Kriterij nije dubina bunara nego namjena vode.</p>
      </div>
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/dozvole/">Cijeli postupak za ${esc(ent.name)} ${icon.arrow}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Cijena za ${esc(r.name)}, po stavkama</h2>
      <span class="tag">Bez pumpe i elektro</span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Stavka</th><th class="num">Okvirno</th><th>Napomena</th></tr></thead>
        <tbody>
          <tr class="yes"><td><strong>Bušenje s kolonom i filterom</strong></td><td class="num">${priceFrom(true)}</td><td>Ključ u ruke, uključuje zasip, tampon i razradu.</td></tr>
          <tr class="yes"><td><strong>Tipična dubina</strong></td><td class="num">${r.depth[0]}–${r.depth[1]} m</td><td>Za domaćinstvo. Navodnjavanje traži veći promjer i često veću dubinu.</td></tr>
          <tr class="yes"><td><strong>Bušotina okvirno</strong></td><td class="num">${total.text}</td><td>Za ${r.depth[0]}–${r.depth[1]} m po objavljenoj cijeni.</td></tr>
          <tr class="no"><td>Pumpa i hidrofor</td><td class="num">700–1.200 KM</td><td>Bira se tek nakon mjerenja izdašnosti.</td></tr>
          <tr class="no"><td>Elektro i priključak</td><td class="num">200–600 KM</td><td>Ovisi o udaljenosti od objekta.</td></tr>
          <tr class="no"><td>Analiza vode</td><td class="num">60–400 KM</td><td>Radi se jednom.</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note" style="margin-top:.9rem">Rasponi su orijentacioni, izvedeni iz tipa izdani i objavljenih cijena na tržištu BiH. Nisu ponuda. <a href="/cijena/">Zašto cijena po metru sama za sebe ne znači ništa &rarr;</a></p>
  </div>
</section>

${photoBand(r.type === 'krs' ? 'garnitura-velika' : r.type === 'flis' ? 'garnitura-gusjenicar' : r.type === 'mjesovito' ? 'garnitura-brdo' : 'garnitura-njiva',
  `Bušenje u ${r.loc} — ${t.short.toLowerCase()}, očekivano ${r.depth[0]}–${r.depth[1]} m.`)}

${near.length ? `
<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Okolna područja</h2>
      <span class="tag">Teren se mijenja brzo</span>
    </div>
    <div class="regions-list">
      ${near.map(n => `<a class="region-item" href="/podrucja/${n.slug}/">
        <span class="r-n">${esc(n.name)}</span>
        <span class="r-d">${n.depth[0]}–${n.depth[1]} m dubine</span>
        <span class="r-t">${esc(aquiferTypes[n.type].short)}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>` : ''}

<section class="band">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Pitanja — ${esc(r.name)}</h2></div>
    ${faqBlock(faq)}
  </div>
</section>

${ctaBand(`Bušite u ${r.loc}? Recite nam namjenu i pristup parceli.`)}
`

  return page({
    title: `Bušenje i kopanje bunara ${r.name}`,
    description: `Bunar u ${r.loc}: očekivana dubina ${r.depth[0]}–${r.depth[1]} m, cijena ${priceFrom(true)}. Treba li dozvola i šta je ispod.`,
    path: `/podrucja/${r.slug}/`,
    body,
    schema: [
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Bušenje bunara',
        provider: { '@id': `${site.origin}/#org` },
        areaServed: { '@type': 'Place', name: `${r.name}, Bosna i Hercegovina` },
        description: r.intro,
      },
    ],
  })
}
