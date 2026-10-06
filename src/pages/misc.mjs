import { upitForm } from '../components/upit.mjs'
import { site } from '../data/site.mjs'
import { regions } from '../data/regions.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand, priceFrom } from '../layout.mjs'
import { photoBand, photo } from '../components/media.mjs'

/* ==========================================================================
   /pitanja/
   ========================================================================== */

const groups = [
  {
    title: 'Cijena i plaćanje',
    items: [
      { q: 'Koliko košta bunar u BiH?', a: `<p>Bušenje je <strong>${priceFrom()}</strong>, isto za svaki teren. Ukupan račun zavisi od dubine: u Posavini 15-40 m pa oko 3.000-8.000 KM, u kršu 40-120 m pa znatno više.</p><p><a href="/cijena/">Šta je u cijeni</a></p>` },
      { q: 'Zašto se cijene u oglasima toliko razlikuju?', a: '<p>Zato što se pod istom riječju prodaju različite stvari. Oglas od 30 KM/m je najčešće samo rupa. Nema pravilne kolone, zasipa, tampona ni ispiranja. Kompletan bunar je nešto drugo.</p><p>To nije razlika u marži nego u proizvodu. <a href="/cijena/">Šta ulazi u cijenu</a></p>' },
      { q: 'Da li je pumpa uključena u cijenu?', a: '<p>Gotovo nikad. Pumpa, hidrofor, elektroinstalacija i priključak se obračunavaju zasebno. To je normalno, jer se pumpa bira tek kad se izmjeri koliko bunar stvarno daje.</p><p>Za domaćinstvo realno računajte dodatnih <strong>700-1.200 KM</strong>.</p>' },
      { q: 'Plaća se ako se ne nađe voda?', a: '<p>Zavisi od pismenog dogovora sklopljenog <strong>prije</strong> početka. Neke ekipe u BiH nude uslov "nema vode, nema naplate". Druge naplaćuju izbušene metre. Oba su legitimna ako ste znali unaprijed.</p><p>Mi taj uslov utvrđujemo prije izlaska na teren i kažemo vam koja varijanta vrijedi za vaš teren.</p>' },
    ],
  },
  {
    title: 'Dubina i teren',
    items: [
      { q: 'Koliko duboko treba bušiti?', a: '<p>Zavisi isključivo od geologije. Semberija i Posavina <strong>15-40 m</strong>, riječne doline i Krajina <strong>20-60 m</strong>, središnja Bosna <strong>25-80 m</strong>, hercegovački krš <strong>40-150 m</strong> i više.</p><p><a href="/podrucja/">Očekivana dubina za vašu općinu</a></p>' },
      { q: 'Kako se zna gdje ima vode?', a: '<p>Najpouzdaniji besplatni podatak je <strong>dubina i izdašnost okolnih postojećih bunara</strong>. Uz to idu geološka građa područja, pozicija u odnosu na vodotok i iskustvo ekipe s tog terena.</p><p>Za ozbiljnije zahvate rade se hidrogeološka istraživanja. Za kućni bunar u aluviju to najčešće nije potrebno. U kršu itekako pomaže.</p>' },
      { q: 'Šta mislite o rašljanju?', a: '<p>Rašljanje je dio narodne tradicije u ovom kraju i mnogi ljudi u njega vjeruju, uključujući i neke iskusne bušače. Ne sporimo nikome to iskustvo.</p><p>Ali mi svoje procjene ne temeljimo na tome. Oslanjamo se na geološku građu područja i na podatke o postojećim bunarima. To možemo objasniti, provjeriti i ponoviti.</p>' },
      { q: 'Može li bunar presušiti?', a: '<p>Može, ali se to rjeđe dešava nego što ljudi misle. Češći uzrok je zapušen filter, od željeza i mulja. To se rješava regeneracijom.</p><p><a href="/usluge/ciscenje-bunara/">Čišćenje i regeneracija</a></p>' },
    ],
  },
  {
    title: 'Dozvole i propisi',
    items: [
      { q: 'Treba li dozvola za bunar?', a: '<p>Za bunar na vlastitom zemljištu za potrebe domaćinstva, <strong>ne</strong>. To je opća upotreba voda, u oba entiteta.</p><p>Za navodnjavanje i poslovnu namjenu, <strong>da</strong>. <a href="/dozvole/">Cijeli postupak</a></p>' },
      { q: 'Da li se dozvola traži po dubini bunara?', a: '<p>Ne. Kriterij je <strong>namjena vode</strong>, ne dubina i ne količina. Bunar od sto metara za kućne potrebe je opća upotreba. Bunar od petnaest metara za navodnjavanje njive nije.</p>' },
      { q: 'Moram li prijaviti bunar?', a: '<p>Ako je u režimu opće upotrebe, ne. Za sve izvan toga ide postupak za vodne akte kod nadležnog organa. U FBiH su to agencije za vodna područja. U RS je to JU "Vode Srpske", a u Brčkom organ Distrikta.</p>' },
    ],
  },
  {
    title: 'Voda i kvalitet',
    items: [
      { q: 'Je li voda iz bunara pitka?', a: '<p>Ne automatski. Najčešće jeste, ali se to zna tek nakon analize. Plitke izdani u poljoprivrednim krajevima znaju imati nitrate i bakteriološko opterećenje, a u Posavini gotovo redovno ima željeza i mangana.</p><p><a href="/usluge/analiza-vode/">Šta se analizira</a></p>' },
      { q: 'Voda mi ostavlja narančasti talog. Šta je to?', a: '<p>Željezo, ponekad uz mangan. U količinama uobičajenim za BiH nije opasno po zdravlje. Ali boji sanitariju i rublje i taloži se u instalaciji.</p><p>Rješava se filterom za željezo, dimenzioniranim prema nalazu analize i protoku.</p>' },
      { q: 'Koliko daleko bunar mora biti od septičke jame?', a: '<p>Što dalje, a naročito na plitkim aluvijalnim izdanima. Konkretna udaljenost zavisi od terena, nagiba i smjera toka podzemne vode.</p><p>Poziciju određuje ekipa na licu mjesta. Pravilno izveden tampon štiti bunar, ali ne poništava lošu poziciju.</p>' },
    ],
  },
  {
    title: 'Izvođenje',
    items: [
      { q: 'Koliko traje izrada bunara?', a: '<p>Bušenje u aluviju jedan do dva dana, u stijeni tri do sedam. Na to dolazi razrada i probno crpljenje (dan do dva) i ugradnja pumpe (dan).</p><p>Od upita do vode u slavini realno računajte <strong>jednu do tri sedmice</strong>, ovisno o terminima.</p>' },
      { q: 'Koliko prostora treba stroju?', a: '<p>Bušaća garnitura je kamion ili gusjeničar. Treba joj prilaz i prostor za manevar i podupirače. Za teško dostupne parcele postoje manje garniture, ali s manjom dubinom.</p><p>Recite nam kakav je pristup. To mijenja izbor ekipe i cijenu.</p>' },
      { q: 'Pravi li bušenje veliku štetu u dvorištu?', a: '<p>Bušenje s isplakom stvara blato oko bušotine i treba prostor za taložnicu. Nije katastrofa, ali nije ni čist posao. Računajte na sređivanje terena poslije.</p><p>U stijeni s pneumatskim čekićem manje je blata, ali ima prašine i buke.</p>' },
      { q: 'Radite li zimi?', a: '<p>U nizinama uglavnom da, osim po smrznutom terenu i jakom snijegu. U planinskim i visokim krškim područjima sezona je kraća.</p><p>Zima je najmirniji dio godine u ovom poslu. Termini su kraći, a ekipe dostupnije nego u proljeće.</p>' },
    ],
  },
  {
    title: 'O nama',
    items: [
      { q: 'Da li vi sami bušite?', a: `<p><strong>Ne. Bušimo preko partnerskih ekipa.</strong> Mi radimo procjenu, provjeru terena i dogovor. Sam posao izvodi bušačka firma s vlastitim strojevima i registrovanom djelatnošću.</p><p>Kažemo vam to otvoreno, jer imate pravo znati s kim radite. Ugovor potpisujete direktno s njima.</p>` },
      { q: 'Kako birate ekipe?', a: '<p>Registrovana djelatnost, vlastita mehanizacija, provjerljive reference i spremnost da sve dogovoreno stave na papir. Ekipe koje ne rade tampon i probno crpljenje ne uvrštavamo.</p>' },
      { q: 'Naplaćujete li procjenu?', a: '<p>Ne. Procjena je besplatna. Dobijete raspon dubine, cijenu i odgovor treba li vam dozvola. Ni na šta se ne obavezujete.</p>' },
      { q: 'Radite li u cijeloj BiH?', a: `<p>Da. Pisanu procjenu terena imamo za <strong>${regions.length} općina i područja</strong>. Pokrivamo i sve ostalo. Za ta mjesta procjenu radimo iz vašeg upita.</p>` },
    ],
  },
]

export function pitanjaPage() {
  const all = groups.flatMap(g => g.items)
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Česta pitanja' }])}
${pageHead({
    eyebrow: `${all.length} pitanja`,
    title: 'Česta pitanja',
    lede: 'Sve što nas ljudi najčešće pitaju, bez uljepšavanja. I ono što drugi ne vole spominjati.',
  })}

${groups.map((g, i) => `${i === 2 ? photoBand('svrdlo-dvoriste', 'Većina naših poslova su obični kućni bunari u dvorištu.') : ''}
<section class="band ${i % 2 ? 'band-alt' : ''}">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>${esc(g.title)}</h2>
      <span class="tag">${g.items.length} pitanja</span>
    </div>
    ${faqBlock(g.items)}
  </div>
</section>`).join('\n')}

${ctaBand('Nema odgovora na vaše pitanje? Pošaljite upit.')}
`
  return page({
    title: 'Česta pitanja o bušenju bunara u BiH',
    description: 'Cijena, dubina, dozvole, kvalitet vode i postupak bušenja bunara u BiH. Odgovori na najčešća pitanja, bez uljepšavanja.',
    path: '/pitanja/',
    body,
    schema: [faqSchema(all)],
  })
}

/* ==========================================================================
   /kontakt/
   ========================================================================== */

export function kontaktPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Kontakt' }])}
${pageHead({
    eyebrow: 'Besplatna procjena',
    title: 'Pošaljite upit',
    lede: 'Par minuta i pet kratkih koraka. Što više nam kažete, to je procjena dubine i cijene tačnija.',
  })}

<section class="band">
  <div class="wrap">
    <div class="contact-grid">

      <div class="stack gap-md">
        <div class="panel panel-accent">
          <h2>Šta dobijete</h2>
          <ul class="ticks">
            <li>${icon.check} Okvirnu dubinu za vašu parcelu, iz geologije područja i okolnih bunara</li>
            <li>${icon.check} Cijenu prije nego iko izađe na teren</li>
            <li>${icon.check} Odgovor treba li vam dozvola, za vaš entitet</li>
            <li>${icon.check} Ekipu koja radi baš na vašem terenu</li>
          </ul>
          <p class="note">${esc(site.responseTime)} Besplatno i bez obaveze.</p>
        </div>

        <div class="panel">
          <h2>Zašto toliko pitanja</h2>
          <p>Dubina ovisi o terenu, a cijena o dubini. Pristup za kamion odlučuje koji stroj ide na parcelu. Dubina susjednog bunara je najbolji besplatan pokazatelj koji postoji. Svaki odgovor skraćuje razgovor i čini procjenu pouzdanijom.</p>
          <p class="note">${esc(site.role)}</p>
        </div>

        ${photo('garnitura-njiva', {
          sizes: '(max-width: 860px) 100vw, 34vw',
          ratio: '4/3',
          caption: 'Prvo procjena iz vašeg upita, pa izlazak na parcelu.',
        })}
      </div>

      <div class="panel upit-panel" id="upit">
        ${upitForm()}
      </div>

    </div>
  </div>
</section>
`
  return page({
    title: 'Pošaljite upit: besplatna procjena bunara',
    description: 'Pošaljite upit za bušenje bunara. Dobijete okvirnu dubinu, cijenu i odgovor oko dozvole za vašu općinu. Besplatno i bez obaveze.',
    path: '/kontakt/',
    body,
  })
}

/* Thank-you page: where the no-JavaScript form post lands, and a clean
   URL for counting conversions. Not indexed. */
export function hvalaPage() {
  const body = `
${pageHead({
    eyebrow: 'Upit je poslan',
    title: 'Hvala. Javljamo se uskoro.',
    lede: `Pogledat ćemo teren u vašoj općini i javiti vam se s okvirnom dubinom i cijenom. ${esc(site.responseTime)}`,
    extra: `<div class="btn-row"><a class="btn btn-primary" href="/podrucja/">Pogledajte svoju općinu</a><a class="btn btn-ghost" href="/cijena/">Šta ulazi u cijenu</a></div>`,
  })}
`
  return page({
    title: 'Hvala na upitu',
    description: 'Vaš upit za bušenje bunara je poslan. Javljamo se s okvirnom dubinom i cijenom za vašu općinu.',
    path: '/hvala/',
    body,
    noindex: true,
  })
}

/* ==========================================================================
   404
   ========================================================================== */

export function notFoundPage() {
  const body = `
${pageHead({
    eyebrow: 'Greška 404',
    title: 'Ova stranica ne postoji',
    lede: 'Vjerovatno je link stari ili je adresa pogrešno upisana. Evo gdje većina ljudi ide.',
  })}
<section class="band">
  <div class="wrap">
    <div class="grid grid-3">
      <a class="card-link" href="/cijena/"><span class="card-num">Najčitanije</span><h2>Cijena bušenja</h2><p>Realni rasponi po metru i razrada svake stavke.</p></a>
      <a class="card-link" href="/dozvole/"><span class="card-num">Pravno</span><h2>Treba li dozvola</h2><p>Kratak odgovor: za kućni bunar ne treba.</p></a>
      <a class="card-link" href="/podrucja/"><span class="card-num">Po općinama</span><h2>Područja</h2><p>Šta je stvarno ispod vaše općine.</p></a>
    </div>
    <p style="margin-top:1.5rem"><a class="btn btn-primary" href="/">Nazad na početnu ${icon.arrow}</a></p>
  </div>
</section>
`
  return page({
    title: 'Stranica nije pronađena',
    description: 'Tražena stranica ne postoji.',
    path: '/404.html',
    noindex: true,
    body,
  })
}
