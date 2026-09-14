import { site } from '../data/site.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand, priceFrom, km } from '../layout.mjs'
import { photo, presjekBunara, photoBand } from '../components/media.mjs'

const R = site.pricing.from

const faq = [
  {
    q: 'Zašto je cijena ista za svaki teren?',
    a: `<p>Zato što je tako ekipe naplaćuju. Bušač ne spušta cijenu jer je teren lakši — on naplaćuje metar. Ono što se mijenja je <strong>koliko metara treba</strong>.</p><p>U Posavini se voda nađe na dvadesetak metara, u hercegovačkom kršu i preko sto. Ista cijena po metru, tri puta veći račun.</p>`,
  },
  {
    q: 'Vidio sam oglase za 30 ili 50 KM po metru. Zašto ste vi skuplji?',
    a: `<p>Zato što to najčešće nije ista stvar. Za trideset maraka dobijete <strong>rupu</strong> — bez pravilne kolone, bez šljunčanog zasipa, bez tampona, bez ispiranja i bez ijednog mjerenja koliko bunar daje.</p><p>Za godinu-dvije voda počne nositi pijesak, pijesak uništi pumpu, a bez tampona vam površinska voda s njive ulazi ravno u bunar. Sanacija je skuplja od razlike koju ste uštedjeli.</p><p>Ne kažemo da je svaka jeftina ponuda loša. Kažemo da pitate šta je u njoj.</p>`,
  },
  {
    q: 'Može li ispasti skuplje od 200?',
    a: `<p>Može. Veći promjer, tvrda stijena, teško dostupna parcela ili velika dubina podižu cijenu. Zato pišemo <strong>„od ${R}"</strong> a ne „${R}".</p><p>Tačnu cijenu vam kaže ekipa nakon izlaska na teren, i to prije nego išta počne.</p>`,
  },
  {
    q: 'Plaća se ako se ne nađe voda?',
    a: `<p>To se dogovara <strong>prije</strong> početka i mora biti napisano. Neke ekipe naplaćuju izvedene metre, neke nude uslov „nema vode — nema naplate", neke pristanu na ograničenu dubinu.</p><p>Mi taj uslov utvrdimo prije nego iko izađe na parcelu i kažemo vam koja varijanta vrijedi za vaš teren. Na kršu je to pitanje najvažnije.</p>`,
  },
  {
    q: 'Koliko košta pumpa?',
    a: `<p>Za prosječno domaćinstvo <strong>700–1.200 KM</strong> s ugradnjom — pumpa, hidrofor i spajanje. Za navodnjavanje osjetno više.</p><p>Bira se tek kad se izmjeri koliko bunar stvarno daje, ne prije.</p>`,
  },
]

const inPrice = [
  ['Bušenje do dogovorene dubine', true],
  ['Zaštitna kolona', true],
  ['Filterska cijev u vodonosnom sloju', true],
  ['Šljunčani zasip oko filtera', true],
  ['Glineni ili cementni tampon', true],
  ['Ispiranje i mjerenje izdašnosti', true],
  ['Potapajuća pumpa i hidrofor', false],
  ['Elektroinstalacija i priključak', false],
  ['Šaht i uređenje oko bunara', false],
  ['Analiza vode', false],
  ['Vodni akti, ako trebaju', false],
]

const depths = [
  ['Posavina, Semberija, riječne doline', '15–40 m', 15, 40],
  ['Krajina, Sprečko polje, doline', '20–60 m', 20, 60],
  ['Središnja Bosna', '25–80 m', 25, 80],
  ['Hercegovina i zapadna Bosna (krš)', '40–120 m', 40, 120],
]

export function cijenaPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Cijena' }])}
${pageHead({
    eyebrow: 'Cijena bušenja bunara',
    title: `Bušenje je <em>${priceFrom()}</em>`,
    lede: 'Ista cijena bez obzira na općinu i teren. Ono što mijenja ukupan račun je dubina — a ona zavisi od toga gdje bušite.',
    extra: `<div class="btn-row">
      <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
      <a class="btn btn-ghost btn-lg" href="/podrucja/">Dubina za moju općinu</a>
    </div>`,
  })}

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Koliko to ispadne ukupno</h2>
      <span class="tag">Dubina × ${R} KM</span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Područje</th><th class="num">Očekivana dubina</th><th class="num">Bušotina okvirno</th></tr></thead>
        <tbody>
          ${depths.map(([n, d, lo, hi]) => `<tr><td><strong>${esc(n)}</strong></td><td class="num">${esc(d)}</td><td class="num">od ${km(lo * R)} do ${km(hi * R)} KM</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <p class="note" style="margin-top:.9rem">Bušotina s kolonom, filterom, zasipom, tamponom i ispiranjem — <strong>bez pumpe i elektroinstalacije</strong>. Orijentaciono, nije ponuda.</p>
    <p style="margin-top:1.25rem"><a class="btn btn-primary" href="/podrucja/">Očekivana dubina po općinama ${icon.arrow}</a></p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta je u cijeni, a šta nije</h2>
      <span class="tag">Pitajte ovo svakoga</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="tw">
        <table>
          <tbody>
            ${inPrice.map(([n, yes]) => `<tr class="${yes ? 'yes' : 'no'}"><td><strong>${esc(n)}</strong></td><td class="num">${yes ? 'U cijeni' : 'Zasebno'}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      ${presjekBunara()}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>Zašto niste jeftiniji</h2>
      <span class="tag">Pošteno pitanje</span>
    </div>
    <div class="prose">
      <p>Vidjet ćete oglase za trideset i pedeset maraka po metru. Nećemo se praviti da ih nema — nego ćemo vam reći šta je razlika.</p>
      <p>Za tu cijenu se najčešće dobije <strong>rupa u zemlji</strong>. Kolona tanka ili nikakva, filter improviziran, bez šljunčanog zasipa, bez tampona, bez ispiranja, i bez ijednog mjerenja koliko bunar stvarno daje. Prvih par mjeseci sve izgleda uredu.</p>
      <div class="call warn">
        <span class="k">Šta se dogodi kasnije</span>
        <p>Voda počne nositi pijesak. Pijesak uništi pumpu. A bez tampona površinska voda s njive ili iz septičke jame ulazi ravno u bunar. Popravka košta više nego razlika koju ste uštedjeli, a ponekad se bunar više ne može spasiti.</p>
      </div>
      <p>Nije svaka jeftina ponuda loša. Ali ako u njoj ne piše <strong>tampon</strong> i <strong>mjerenje izdašnosti</strong>, to nije kompletan bunar — bez obzira koliko dobro izgleda cijena po metru.</p>
    </div>
  </div>
</section>

${photoBand('kolone-cijevi', 'Kolona, filter i spojnice — materijal koji nestane iz jeftinih ponuda.')}

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Troškovi poslije bušenja</h2>
      <span class="tag">Uračunajte ih odmah</span>
    </div>
    <div class="grid grid-3">
      <div class="card">
        <span class="card-num">700–1.200 KM</span>
        <h3>Pumpa i hidrofor</h3>
        <p>Za prosječno domaćinstvo, s ugradnjom. Bira se tek kad se zna koliko bunar daje.</p>
      </div>
      <div class="card">
        <span class="card-num">200–600 KM</span>
        <h3>Elektro i priključak</h3>
        <p>Kabl, zaštita i spajanje na kućnu instalaciju. Ovisi o udaljenosti od objekta.</p>
      </div>
      <div class="card">
        <span class="card-num">60–400 KM</span>
        <h3>Analiza vode</h3>
        <p>Radi se jednom. Osnovna bakteriološka je jeftina, širi paket košta više.</p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Pitanja o cijeni</h2></div>
    ${faqBlock(faq)}
  </div>
</section>

${ctaBand('Recite nam općinu — kažemo vam dubinu i koliko to ispadne.')}
`

  return page({
    title: `Cijena bušenja bunara — ${priceFrom(true)}`,
    description: `Bušenje bunara u BiH je ${priceFrom()}, isto za svaki teren. Šta je u cijeni, šta dolazi zasebno i koliko ukupno ispadne po dubini.`,
    path: '/cijena/',
    body,
    schema: [faqSchema(faq)],
  })
}
