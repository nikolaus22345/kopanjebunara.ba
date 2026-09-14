import { site } from '../data/site.mjs'
import { regions } from '../data/regions.mjs'
import { page, icon, esc, faqBlock, faqSchema, ctaBand, priceFrom } from '../layout.mjs'
import { estimator } from '../components/estimator.mjs'
import { videoShowcase, gallery, photoBand, heroImage } from '../components/media.mjs'

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

export function homePage() {
  const tier1 = regions.filter(r => r.tier === 1).slice(0, 12)

  const body = `
<section class="hero-photo">
  <div class="hero-bg">
    ${heroImage({ alt: 'Bušaća garnitura u radu na brdskom imanju u Bosni i Hercegovini, u zoru' })}
  </div>
  <div class="wrap hero-inner">
    <div class="stack gap-md">
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
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kako ovo radi</h2>
      <span class="tag">Poziv i procjena su besplatni</span>
    </div>
    <p class="lede" style="max-width:58ch;margin-bottom:1.75rem">Da ne bude zabune: <strong>mi nismo bušačka firma.</strong> Nemamo garnituru i ne izlazimo na teren. Ono što radimo je da vas spojimo s ekipom koja radi na vašem terenu — i da vam prije toga kažemo šta vas realno čeka.</p>
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
      <h2>Provjerite za svoju općinu</h2>
      <span class="tag">Bez ostavljanja podataka</span>
    </div>
    <div class="stack gap-md">
      <p class="lede" style="max-width:58ch">Cijena bušenja je svugdje ista — <strong>${esc(priceFrom())}</strong>. Ono što se mijenja je dubina, a ona zavisi od toga šta je ispod vaše parcele.</p>
      ${estimator()}
      <p class="note">Dubine su <strong>orijentacione</strong>, izvedene iz geološke građe područja. Konačnu cijenu daje ekipa nakon izlaska na teren. Nije ponuda u pravnom smislu.</p>
    </div>
  </div>
</section>

<section class="band band-deep">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kako to izgleda na terenu</h2>
      <span class="tag">Snimci s bušotina</span>
    </div>
    <p class="lede" style="max-width:56ch;margin-bottom:1.75rem">Bušenje nije čist posao i ne pravimo se da jeste. Ovako izgleda isplaka, ovako stijena, i ovako trenutak kad voda krene.</p>
    ${videoShowcase()}
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.25rem">
      <div class="call">
        <span class="k">Cijena</span>
        <p><strong>${esc(priceFrom())}</strong>, ista za svaki teren. U cijeni su bušenje, kolona, filter, šljunčani zasip, tampon i ispiranje. Pumpa i elektro dolaze zasebno. <a href="/cijena/">Detaljno &rarr;</a></p>
      </div>
      <div class="call">
        <span class="k">Dozvola — najčešće ne treba</span>
        <p>Bunar na vlastitom zemljištu za kućne potrebe je <strong>opća upotreba voda</strong>, bez papira. Navodnjavanje i posao traže vodne akte. <a href="/dozvole/">Cijeli postupak &rarr;</a></p>
      </div>
      <div class="call warn">
        <span class="k">Kažemo i kad je teren loš</span>
        <p>Na kršu i fliškom terenu izdašnost zna izostati. To vam kažemo prvim pozivom, a ne na pola bušotine. <a href="/podrucja/">Šta je ispod vaše općine &rarr;</a></p>
      </div>
    </div>
  </div>
</section>

${photoBand('garnitura-njiva', 'Ekipa na terenu. Prvo procjena telefonom, pa izlazak na parcelu.')}

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Područja</h2>
      <span class="tag">Teren odlučuje o dubini</span>
    </div>
    <p class="lede" style="max-width:60ch;margin-bottom:1.5rem">Bušenje u Semberiji i bušenje u Širokom Brijegu nisu isti posao. Cijena po metru je ista, ali se broj metara zna utrostručiti.</p>
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
      <h2>Galerija</h2>
      <span class="tag">Strojevi, teren, materijal</span>
    </div>
    ${gallery()}
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>Česta pitanja</h2>
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
    schema: [faqSchema(homeFaq)],
  })
}
