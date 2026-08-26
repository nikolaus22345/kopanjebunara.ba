import { site } from '../data/site.mjs'
import { regions, aquiferTypes } from '../data/regions.mjs'
import { page, pageHead, strata, icon, esc, faqBlock, faqSchema, ctaBand } from '../layout.mjs'
import { estimator } from '../components/estimator.mjs'

const homeFaq = [
  {
    q: 'Treba li mi dozvola za bunar?',
    a: '<p>Za bunar na <strong>vlastitom zemljištu, za potrebe domaćinstva</strong> — piće, higijena, kuhinja — dozvola vam <strong>ne treba</strong>. To je opća upotreba voda i tako je uređeno i u Federaciji BiH i u Republici Srpskoj.</p><p>Dozvola postaje obavezna čim pređete u <strong>navodnjavanje ili poslovnu namjenu</strong>. <a href="/dozvole/">Cijeli postupak, razdvojen po entitetima &rarr;</a></p>',
  },
  {
    q: 'Koliko košta bunar?',
    a: '<p>U ravničarskim dijelovima BiH realno <strong>50–100 KM po metru</strong> ključ u ruke, u hercegovačkom kršu <strong>110–190 KM po metru</strong>. Bunar za prosječno domaćinstvo u Posavini najčešće završi između <strong>1.500 i 3.500 KM</strong>.</p><p>Ali cijena po metru sama za sebe ne znači ništa dok ne znate šta je u njoj. <a href="/cijena/">Razrada svake stavke &rarr;</a></p>',
  },
  {
    q: 'Koliko duboko se buši?',
    a: '<p>Zavisi isključivo od geologije. U Semberiji i Posavini <strong>15–40 m</strong>. U središnjoj Bosni <strong>30–80 m</strong>. U hercegovačkom kršu <strong>50–150 m</strong>, ponekad i više.</p><p>Zato ne dajemo jednu brojku za cijelu zemlju. <a href="/podrucja/">Pogledajte očekivanu dubinu za svoju općinu &rarr;</a></p>',
  },
  {
    q: 'Šta ako se ne nađe voda?',
    a: '<p>To se dešava — najčešće u kršu i na fliškom terenu. Zato uslove za takav slučaj <strong>dogovaramo unaprijed i pismeno</strong>, prije nego iko izađe na parcelu, a ne poslije.</p><p>Na terenima gdje je rizik stvaran mi vam to kažemo prvim pozivom. To je razlika između izvođača koji hoće posao i izvođača koji hoće da budete zadovoljni.</p>',
  },
  {
    q: 'Je li voda iz bunara pitka?',
    a: '<p>Ne automatski. Bunarska voda u BiH je najčešće ispravna, ali <strong>plitke aluvijalne izdani</strong> u poljoprivrednim krajevima znaju imati nitrate i bakteriološko opterećenje, a gotovo svugdje u Posavini ima željeza i mangana.</p><p>Analiza košta malo u odnosu na bunar i radi se jednom. <a href="/usluge/analiza-vode/">Šta se analizira i koliko košta &rarr;</a></p>',
  },
  {
    q: 'Koliko traje izrada bunara?',
    a: '<p>U aluviju najčešće <strong>jedan do dva dana</strong> za bušenje i opremanje. U stijeni i kršu <strong>tri do sedam dana</strong>, ponekad duže.</p><p>Na to dolazi razrada i probno crpljenje, pa priključenje pumpe. <a href="/postupak/">Korak po korak &rarr;</a></p>',
  },
]

const trust = [
  {
    n: '01',
    t: 'Kažemo cijenu prije izlaska',
    b: 'Na osnovu općine i namjene dobijete realan raspon dubine i cijene istog dana, telefonom. Bez „doći ćemo pa ćemo vidjeti“.',
  },
  {
    n: '02',
    t: 'Kažemo i kad je teren loš',
    b: 'Na fliškom i laporovitom terenu izdašnost je ograničena. To vam kažemo unaprijed. Radije ćemo izgubiti posao nego vas razočarati na pola bušotine.',
  },
  {
    n: '03',
    t: 'Provjerene ekipe, ne oglasi',
    b: 'Radimo s bušačkim firmama koje imaju registrovanu djelatnost, vlastite strojeve i reference koje se mogu provjeriti. Ne prosljeđujemo vaš broj bilo kome.',
  },
  {
    n: '04',
    t: 'Sve pismeno, prije početka',
    b: 'Dubina, promjer, materijal kolone, šta ulazi u cijenu i šta se dešava ako nema vode — dogovoreno i zapisano prije nego stroj krene.',
  },
]

const components = [
  ['01', 'Bušenje', 'Sama bušotina. Promjer mora biti najmanje 5 cm veći od kolone, kod većih cijevi 10 cm.'],
  ['02', 'Zaštitna kolona', 'PVC, pocinčana ili nehrđajuća cijev. Ovdje se najlakše uštedi tako da vi ne primijetite.'],
  ['03', 'Filterska cijev', 'Prorezani dio u vodonosnom sloju. Otvorena površina treba prelaziti 20% razvijene površine filtera.'],
  ['04', 'Šljunčani zasip', 'Granulacija 1–4 mm u pijesku, 4–8 mm u šljunku. Sprječava ulazak sitnog materijala u bunar.'],
  ['05', 'Tampon', 'Glineni ili cementni čep od površine do 0,5 m iznad filtera. Bez njega površinsko zagađenje ulazi ravno u izdan.'],
  ['06', 'Razrada i probno crpljenje', 'Step-test na tri kapaciteta pa kontinuirano crpljenje. Tek to pokazuje koliko bunar stvarno daje.'],
  ['07', 'Oprema', 'Pumpa, hidrofor, elektro i priključak. Gotovo uvijek se obračunava odvojeno — provjerite je li u ponudi.'],
]

const steps = [
  { n: '1', when: 'Isti dan', t: 'Poziv i procjena', b: 'Kažete nam općinu, najbliže naselje, namjenu i — ako znate — koliko je dubok najbliži postojeći bunar. Dobijete realan raspon dubine, cijene i procjenu izvodljivosti.' },
  { n: '2', when: '2–7 dana', t: 'Izlazak na teren', b: 'Ekipa provjerava pristup za kamion, poziciju u odnosu na objekte, septičku jamu i granicu parcele, te potvrđuje mjesto bušenja i konačnu ponudu.' },
  { n: '3', when: '1–7 dana', t: 'Bušenje', b: 'U aluviju rotacijom s isplakom, u stijeni pneumatskim čekićem. Ugrađuje se kolona, filter, šljunčani zasip i tampon.' },
  { n: '4', when: '1–2 dana', t: 'Razrada i test', b: 'Bunar se ispira dok voda ne bude bistra, pa se mjeri stvarna izdašnost. Tek sada se zna koja pumpa vam treba.' },
  { n: '5', when: '1 dan', t: 'Pumpa i predaja', b: 'Ugradnja pumpe i hidrofora, spajanje na instalaciju, uzorak za analizu vode. Dobijate podatke o bunaru: dubinu, izdašnost, nivo vode.' },
]

export function homePage() {
  const tier1 = regions.filter(r => r.tier === 1).slice(0, 12)
  const al = aquiferTypes.aluvij

  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="stack gap-md">
      <p class="eyebrow">Provjerene bušačke ekipe &middot; sve općine</p>
      <h1>Bušenje i kopanje bunara <br><em>Bosna i Hercegovina</em></h1>
      <p class="kicker">Voda je ispod vas. Pitanje je samo koliko duboko.</p>
      <p class="lede">Recite nam općinu i šta vam voda treba. Dobijete realan raspon dubine, cijene i procjenu hoće li uspjeti — telefonom, prije nego iko izađe na teren.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
        <a class="btn btn-ghost btn-lg" href="#procjena">Procijeni cijenu ${icon.arrow}</a>
      </div>
      <div class="hero-answers">
        <div><span class="n">50–190</span><span class="l">KM po metru, ovisno o terenu</span></div>
        <div><span class="n">15–150</span><span class="l">Metara dubine, ovisno o regiji</span></div>
        <div><span class="n">0</span><span class="l">Dozvola za kućni bunar na svom zemljištu</span></div>
      </div>
    </div>
    <div class="hero-figure">
      ${strata(al.strata, [0, 40], { caption: 'Prikazan je aluvijalni profil — tipičan za Posavinu i riječne doline.' })}
    </div>
  </div>
</section>

<section class="band" id="procjena">
  <div class="wrap">
    <div class="sec-head">
      <h2>Procjena za vašu općinu</h2>
      <span class="tag">Bez ostavljanja podataka</span>
    </div>
    <div class="stack gap-md">
      <p class="lede" style="max-width:60ch">Većina izvođača vam neće reći cijenu dok ne dođe na teren. Mi mislimo da imate pravo znati red veličine odmah — pa smo posložili očekivanja po općinama na osnovu geologije i objavljenih cijena na tržištu BiH.</p>
      ${estimator()}
      <p class="note">Rasponi su <strong>orijentacioni</strong> i temelje se na tipu izdani i objavljenim cijenama na tržištu BiH. Konačna cijena zavisi od stvarne dubine, promjera, materijala kolone i pristupa parceli. Nisu ponuda u pravnom smislu.</p>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kako radimo</h2>
      <span class="tag">Bez naplate procjene</span>
    </div>
    <div class="grid grid-4 reveal">
      ${trust.map(t => `<div class="card">
        <span class="card-num">${t.n}</span>
        <h3>${esc(t.t)}</h3>
        <p>${esc(t.b)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Bunar nije rupa u zemlji</h2>
      <span class="tag">Sedam stavki koje plaćate</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="prose">
        <p>Kad vidite ponudu od <strong class="fig">30 KM/m</strong> i ponudu od <strong class="fig">130 KM/m</strong>, ne gledate isti proizvod po različitoj cijeni. Gledate dvije različite stvari.</p>
        <p>Jeftinija je najčešće samo bušotina u mekom tlu — bez pravilne kolone, bez šljunčanog zasipa, bez tampona, bez razrade i bez ijednog mjerenja izdašnosti. Skuplja je gotov, obložen, zabrtvljen i ispitan bunar.</p>
        <p>Kupac to ne može razlikovati golim okom. Zato smo napisali razradu svake stavke i napravili listu koju možete ponijeti <strong>bilo kojem</strong> izvođaču u BiH, i našem i tuđem.</p>
        <div class="call">
          <span class="k">Naše pravilo</span>
          <p>Ako u ponudi nema stavke „tampon“ i „probno crpljenje“, to nije kompletan bunar — bez obzira koliko dobro izgleda cijena po metru.</p>
        </div>
        <p><a class="btn btn-primary" href="/cijena/">Razrada cijene i lista za provjeru ${icon.arrow}</a></p>
      </div>
      <ol class="anat reveal">
        ${components.map(([d, t, b]) => `<li><span class="d">${d}</span><span class="t">${esc(t)}</span><span class="b">${esc(b)}</span></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>

<section class="band band-deep">
  <div class="wrap">
    <div class="sec-head">
      <h2>Treba li vam dozvola?</h2>
      <span class="tag">Kratak odgovor: najčešće ne</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(17rem,1fr));gap:1.25rem">
      <div class="call" style="background:var(--deep-2);border-left-color:var(--accent)">
        <span class="k">Ne treba</span>
        <p style="color:var(--deep-ink)"><strong>Bunar na vlastitom zemljištu za potrebe domaćinstva</strong> — piće, higijena, kuhinja. To je opća upotreba voda, u oba entiteta, bez ijednog papira.</p>
      </div>
      <div class="call warn" style="background:var(--deep-2);border-left-color:var(--ochre)">
        <span class="k">Treba</span>
        <p style="color:var(--deep-ink)"><strong>Navodnjavanje, poslovna namjena, vodosnabdijevanje drugih.</strong> Tu se izlazi iz opće upotrebe i traže se vodni akti — u FBiH preko agencija za vodna područja, u RS preko JU „Vode Srpske“.</p>
      </div>
      <div class="call" style="background:var(--deep-2);border-left-color:var(--deep-rule)">
        <span class="k">Pomažemo</span>
        <p style="color:var(--deep-ink)">Ako vaš slučaj traži papire, kažemo vam tačno koji obrazac, kojem organu i kojim redoslijedom. To je posao koji većina ljudi ne treba raditi sama.</p>
      </div>
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/dozvole/">Dozvole razdvojene po entitetima ${icon.arrow}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kako ide postupak</h2>
      <span class="tag">Od poziva do vode</span>
    </div>
    <ol class="steps">
      ${steps.map(s => `<li>
        <div><div class="s-n">${s.n}</div><div class="s-when">${esc(s.when)}</div></div>
        <div class="s-body"><h3>${esc(s.t)}</h3><p>${esc(s.b)}</p></div>
      </li>`).join('\n      ')}
    </ol>
    <p style="margin-top:1.5rem"><a class="btn btn-ghost" href="/postupak/">Detaljno o svakom koraku ${icon.arrow}</a></p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Područja</h2>
      <span class="tag">Geologija odlučuje o cijeni</span>
    </div>
    <p class="lede" style="max-width:62ch;margin-bottom:1.5rem">Bušenje u Semberiji i bušenje u Širokom Brijegu nisu isti posao — ni po dubini, ni po metodi, ni po cijeni, ni po tome hoće li uspjeti. Za svaku općinu smo napisali šta je stvarno ispod.</p>
    <div class="regions-list reveal">
      ${tier1.map(r => `<a class="region-item" href="/podrucja/${r.slug}/">
        <span class="r-n">${esc(r.name)}</span>
        <span class="r-d">${r.depth[0]}–${r.depth[1]} m &middot; ${r.price[0]}–${r.price[1]} KM/m</span>
        <span class="r-t">${esc(r.area)}</span>
      </a>`).join('\n      ')}
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/podrucja/">Sve općine i tipovi terena ${icon.arrow}</a></p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Ostale usluge</h2>
      <span class="tag">Uz bunar ili zasebno</span>
    </div>
    <div class="grid grid-2">
      <a class="card-link" href="/usluge/geotermalne-sonde/">
        <span class="card-num">Geotermija</span>
        <h3>Geotermalne sonde</h3>
        <p>Bušotine za toplotnu pumpu zemlja-voda. Rade i tamo gdje nema podzemne vode, jer koriste stabilnu temperaturu tla, a ne dotok.</p>
      </a>
      <a class="card-link" href="/usluge/pumpe-i-hidrofori/">
        <span class="card-num">Oprema</span>
        <h3>Pumpe i hidrofori</h3>
        <p>Izbor potapajuće pumpe prema stvarnoj izdašnosti bunara i visini dizanja — ne prema onome što je bilo na akciji.</p>
      </a>
      <a class="card-link" href="/usluge/analiza-vode/">
        <span class="card-num">Kvalitet</span>
        <h3>Analiza vode</h3>
        <p>Bakteriološka i hemijska analiza, tumačenje nalaza i prijedlog tretmana ako voda ima željezo, mangan ili nitrate.</p>
      </a>
      <a class="card-link" href="/usluge/ciscenje-bunara/">
        <span class="card-num">Održavanje</span>
        <h3>Čišćenje i regeneracija</h3>
        <p>Stari bunar koji je izgubio izdašnost često se može vratiti u funkciju. Jeftinije nego bušiti novi.</p>
      </a>
    </div>
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
    description: 'Bušenje i kopanje bunara u cijeloj BiH. Realan raspon cijene i dubine za vašu općinu prije izlaska na teren — i treba li vam dozvola.',
    path: '/',
    body,
    schema: [faqSchema(homeFaq)],
  })
}
