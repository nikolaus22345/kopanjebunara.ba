import { site } from '../data/site.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand } from '../layout.mjs'

const faq = [
  {
    q: 'Zašto mi niko neće reći cijenu preko telefona?',
    a: '<p>Zato što cijena stvarno zavisi od dubine, a dubina se ne zna sa sigurnošću dok se ne buši. To je tačno.</p><p>Ali <strong>raspon</strong> se zna. Geologija vaše općine je poznata, dubine okolnih bunara su poznate, cijene materijala su poznate. Izvođač koji vam ne želi dati ni okvir najčešće ne želi da uspoređujete.</p>',
  },
  {
    q: 'Je li najjeftinija ponuda uvijek loša?',
    a: '<p>Ne. Ali najjeftinija ponuda <em>po metru</em> gotovo nikad nije najjeftiniji bunar.</p><p>Ako u njoj nema kolone, zasipa, tampona i razrade, te stavke ne nestaju — one se ili dodaju kasnije, ili se ne urade, pa se plate kroz mutnu vodu i pumpu koja crkne za dvije godine.</p>',
  },
  {
    q: 'Plaća li se bušenje ako se ne nađe voda?',
    a: '<p>Zavisi od dogovora, i baš zato dogovor mora biti pismen <strong>prije</strong> početka. Neki izvođači u BiH nude uslov „nema vode — nema naplate“; drugi naplaćuju izvedene metre.</p><p>Oba su legitimna, ali samo ako ste to znali unaprijed. Mi taj uslov utvrđujemo prije izlaska na teren i kažemo vam koja varijanta vrijedi za vaš teren.</p>',
  },
  {
    q: 'Koliko košta pumpa i ostala oprema?',
    a: '<p>Za prosječno domaćinstvo potapajuća pumpa <span class="fig">0,75–1,1 kW</span> s hidroforom realno je <strong>700–1.200 KM</strong> s ugradnjom, ovisno o proizvođaču i dubini ugradnje.</p><p>Jače pumpe za navodnjavanje idu znatno više. <a href="/usluge/pumpe-i-hidrofori/">Kako se bira pumpa &rarr;</a></p>',
  },
  {
    q: 'Može li se platiti na rate?',
    a: '<p>Uslovi plaćanja se dogovaraju direktno s izvođačem koji radi vaš posao. Uobičajeno je avans pa ostatak po završetku, a dio ekipa prihvata i podjelu na dvije do tri rate za veće poslove.</p><p>Recite nam ako vam je to bitno — uzet ćemo u obzir pri izboru ekipe.</p>',
  },
]

const inOut = [
  ['Bušenje do projektovane dubine', true, 'Osnovna stavka, obračunata po metru.'],
  ['Zaštitna kolona (cijev)', true, 'Provjerite materijal i debljinu stijenke, ne samo prečnik.'],
  ['Filterska cijev u vodonosnom sloju', true, 'Pitajte kolika je otvorena površina filtera.'],
  ['Šljunčani zasip', true, 'Granulacija mora odgovarati sloju. Bez toga bunar pješči.'],
  ['Glineni ili cementni tampon', true, 'Najvažnija nevidljiva stavka. Bez nje voda nije zaštićena.'],
  ['Razrada i ispiranje bunara', true, 'Dok voda ne bude bistra — mutnoća ispod 1 NTU.'],
  ['Probno crpljenje i mjerenje izdašnosti', true, 'Bez ovoga niko ne zna koliko bunar daje ni koja pumpa treba.'],
  ['Zaštitna glava / šaht bunara', false, 'Često zasebno. Provjerite.'],
  ['Potapajuća pumpa', false, 'Gotovo uvijek zasebno.'],
  ['Hidrofor i automatika', false, 'Zasebno.'],
  ['Elektroinstalacija i priključak', false, 'Zasebno, često rad drugog majstora.'],
  ['Razvod do kuće i zemljani radovi', false, 'Zasebno.'],
  ['Analiza vode', false, 'Zasebno, ali jeftino u odnosu na bunar.'],
  ['Vodni akti (ako su potrebni)', false, 'Samo za navodnjavanje i poslovnu namjenu.'],
]

const bands = [
  ['Posavina i riječne doline', 'Aluvij — šljunak i pijesak', '10–45 m', '50–100 KM/m', '1.000–3.500 KM'],
  ['Sprečko polje, Krajina, doline', 'Mješovit teren, terase', '20–60 m', '65–125 KM/m', '1.800–5.500 KM'],
  ['Središnja Bosna, veliki basensi', 'Fliš, lapor, glina', '25–80 m', '80–135 KM/m', '2.500–8.000 KM'],
  ['Hercegovina i zapadna Bosna', 'Krš — vapnenac', '40–150 m', '100–190 KM/m', '5.000–20.000 KM'],
]

const flags = [
  ['Ponuda samo s jednom brojkom', 'Ako u ponudi piše samo „X KM po metru“ i ništa više, to nije ponuda za bunar nego za rupu.'],
  ['Nema stavke tampon', 'Najskuplja stvar koju možete uštedjeti je zaštita vlastite vode od septičke jame.'],
  ['Nema probnog crpljenja', 'Bez mjerenja izdašnosti nemate pojma šta ste kupili — a ni izvođač nema kako da vam preporuči pumpu.'],
  ['Cijena „dogovorićemo se na licu mjesta“', 'Cijena dogovorena kad je stroj već na parceli nije dogovorena cijena.'],
  ['Nema ništa u pisanom obliku', 'Usmeni dogovor u ovom zanatu se u sporu svodi na riječ protiv riječi.'],
  ['Garancija „sigurno ima vode“ u kršu', 'U kršu niko to ne može garantovati. Izvođač koji tvrdi suprotno ili ne razumije teren ili računa da vi ne razumijete.'],
]

export function cijenaPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Cijena bušenja bunara' }])}
${pageHead({
    eyebrow: 'Cijena bušenja bunara u BiH',
    title: 'Koliko stvarno košta bunar',
    lede: 'Cijene na tržištu BiH idu od <span class="fig">30</span> do <span class="fig">190 KM</span> po metru. Ta razlika nije prevara — to su različiti proizvodi. Evo tačno gdje ide razlika.',
  })}

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Realni rasponi po tipu terena</h2>
      <span class="tag">Ključ u ruke, bez pumpe</span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Područje</th><th>Tip izdani</th><th class="num">Dubina</th><th class="num">Po metru</th><th class="num">Ukupno, domaćinstvo</th></tr></thead>
        <tbody>
          ${bands.map(b => `<tr><td><strong>${esc(b[0])}</strong></td><td>${esc(b[1])}</td><td class="num">${esc(b[2])}</td><td class="num">${esc(b[3])}</td><td class="num">${esc(b[4])}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <p class="note" style="margin-top:.9rem">„Ukupno“ je bušotina s kolonom, filterom, zasipom, tamponom i razradom — <strong>bez pumpe, hidrofora i elektroinstalacije</strong>. Rasponi su orijentacioni i ne predstavljaju ponudu.</p>
    <p style="margin-top:1.25rem"><a class="btn btn-primary" href="/#procjena">Procjena za vašu općinu ${icon.arrow}</a></p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Zašto „cijena po metru“ sama za sebe ne znači ništa</h2>
      <span class="tag">Najvažniji dio ove stranice</span>
    </div>
    <div class="prose">
      <p>Zamislite dvije ponude za istu parcelu u Semberiji, dubina trideset metara.</p>
      <p><strong>Ponuda A: 35 KM po metru. Ukupno 1.050 KM.</strong> U cijeni: bušenje. To je sve. Kolona tanka, filter improviziran ili nikakav, bez šljunčanog zasipa, bez tampona, bez ispiranja, bez ijednog mjerenja. Voda će prvih mjeseci izgledati u redu.</p>
      <p><strong>Ponuda B: 85 KM po metru. Ukupno 2.550 KM.</strong> U cijeni: bušenje odgovarajućeg promjera, kolona s deklarisanom debljinom stijenke, filterska cijev projektovana za taj sloj, šljunčani zasip odgovarajuće granulacije, tampon do pola metra iznad filtera, ispiranje do bistre vode i probno crpljenje s izmjerenom izdašnošću.</p>
      <div class="call warn">
        <span class="k">Šta se dešava kasnije</span>
        <p>Bunar A za godinu-dvije počne davati mutnu vodu s pijeskom. Pijesak uništi pumpu. Bez tampona, površinska voda s njive ili iz septičke jame ulazi u bušotinu. Sanacija je često skuplja od razlike koju ste „uštedjeli“, a ponekad se bunar više ne može spasiti.</p>
      </div>
      <p>Zato mi ne uspoređujemo cijene po metru. Uspoređujemo <strong>ponude po stavkama</strong> — i tako biste trebali i vi, bez obzira radite li s nama ili ne.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta jeste, a šta nije u cijeni</h2>
      <span class="tag">Ponesite ovo svakom izvođaču</span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Stavka</th><th>Obično uključeno</th><th>Na šta paziti</th></tr></thead>
        <tbody>
          ${inOut.map(([n, yes, note]) => `<tr class="${yes ? 'yes' : 'no'}"><td><strong>${esc(n)}</strong></td><td class="num">${yes ? 'Da' : 'Ne — zasebno'}</td><td>${esc(note)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="call" style="margin-top:1.5rem">
      <span class="k">Jedno pitanje koje otkriva sve</span>
      <p>Pitajte izvođača: <strong>„Kolika je izmjerena izdašnost i kako ćete je izmjeriti?“</strong> Ozbiljan izvođač zna odgovor i objasni step-test. Onaj koji kaže „vidjet ćemo koliko ide“ nije spreman za posao koji naplaćuje.</p>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Troškovi koji dolaze poslije bušenja</h2>
      <span class="tag">Uračunajte ih odmah</span>
    </div>
    <div class="grid grid-3">
      <div class="card">
        <span class="card-num">700–1.200 KM</span>
        <h3>Pumpa i hidrofor</h3>
        <p>Potapajuća pumpa 0,75–1,1 kW, protok 2–3 m³/h, dizanje 50–60 m, hidrofor minimalno 60 l. Za navodnjavanje osjetno više.</p>
      </div>
      <div class="card">
        <span class="card-num">200–600 KM</span>
        <h3>Elektro i priključak</h3>
        <p>Kabl, zaštita, automatika i spajanje na kućnu instalaciju. Zavisi od udaljenosti bunara od objekta.</p>
      </div>
      <div class="card">
        <span class="card-num">60–400 KM</span>
        <h3>Analiza vode</h3>
        <p>Osnovna bakteriološka je jeftina. Šira fizičko-hemijska analiza košta više, ali se radi jednom i kaže vam treba li tretman.</p>
      </div>
      <div class="card">
        <span class="card-num">300–900 KM</span>
        <h3>Šaht i uređenje</h3>
        <p>Zaštitna glava bunara, šaht, betoniranje i zemljani radovi oko bušotine.</p>
      </div>
      <div class="card">
        <span class="card-num">Ovisno</span>
        <h3>Filter za željezo</h3>
        <p>U Posavini se skoro uvijek isplati. Cijena zavisi od protoka i stepena opterećenja — zna se tek nakon analize.</p>
      </div>
      <div class="card">
        <span class="card-num">Ovisno</span>
        <h3>Vodni akti</h3>
        <p>Samo za navodnjavanje i poslovnu namjenu. <a href="/dozvole/">Šta tačno treba &rarr;</a></p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šest znakova da ponuda nije ozbiljna</h2>
      <span class="tag">Vrijedi i za nas — provjerite i nas</span>
    </div>
    <div class="grid grid-2">
      ${flags.map((f, i) => `<div class="card">
        <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(f[0])}</h3>
        <p>${esc(f[1])}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="band band-deep">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>Lista za provjeru</h2>
      <span class="tag">Ponesite je bilo kome</span>
    </div>
    <p class="lede">Ovih devet pitanja postavite svakom izvođaču, uključujući nas. Ako neko ne želi odgovoriti na sva, imate odgovor.</p>
    <ol class="steps" style="margin-top:1.25rem">
      ${[
        ['Koji je promjer bušotine, a koji promjer kolone?', 'Razlika mora biti najmanje 5 cm, kod većih cijevi 10 cm.'],
        ['Koji materijal kolone i kolika debljina stijenke?', 'PVC, pocinčano ili inox — i tačna specifikacija, ne „dobra cijev“.'],
        ['Kolika je otvorena površina filtera?', 'Treba prelaziti 20% razvijene površine.'],
        ['Kakva granulacija šljunčanog zasipa?', '1–4 mm u pijesku, 4–8 mm u šljunku.'],
        ['Do koje visine ide tampon?', 'Od površine do najmanje 0,5 m iznad filtera.'],
        ['Koliko dugo traje razrada i probno crpljenje?', 'Aluvij minimalno 36 sati, pukotinska stijena znatno duže.'],
        ['Dobijam li pismene podatke o bunaru?', 'Dubina, nivo vode, izmjerena izdašnost, profil bušenja.'],
        ['Šta se plaća ako se ne nađe voda?', 'Utvrditi prije početka, u pisanom obliku.'],
        ['Šta nije uključeno u ovu cijenu?', 'Neka izvođač sam nabroji. Odgovor vam kaže sve.'],
      ].map(([q, a], i) => `<li>
        <div><div class="s-n">${i + 1}</div></div>
        <div class="s-body"><h3 style="color:var(--deep-ink)">${esc(q)}</h3><p style="color:var(--deep-soft)">${esc(a)}</p></div>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Pitanja o cijeni</h2></div>
    ${faqBlock(faq)}
  </div>
</section>

${ctaBand('Dajte nam općinu i namjenu — dobijete raspon isti dan.')}
`

  return page({
    title: 'Cijena bušenja bunara u BiH — razrada po stavkama',
    description: 'Koliko košta bunar u BiH: realni rasponi po metru po tipu terena, šta jeste a šta nije u cijeni, i lista pitanja za svakog izvođača.',
    path: '/cijena/',
    body,
    schema: [faqSchema(faq)],
  })
}
