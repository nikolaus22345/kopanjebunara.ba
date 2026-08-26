import { site } from '../data/site.mjs'
import { regions } from '../data/regions.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand } from '../layout.mjs'
import { photoBand, photo } from '../components/media.mjs'

/* ==========================================================================
   /pitanja/
   ========================================================================== */

const groups = [
  {
    title: 'Cijena i plaćanje',
    items: [
      { q: 'Koliko košta bunar u BiH?', a: '<p>U ravničarskim dijelovima <strong>50–100 KM po metru</strong> ključ u ruke, u središnjoj Bosni <strong>80–135 KM/m</strong>, u hercegovačkom kršu <strong>100–190 KM/m</strong>. Za prosječno domaćinstvo u Posavini to najčešće znači <strong>1.500–3.500 KM</strong> za samu bušotinu.</p><p><a href="/cijena/">Razrada po stavkama &rarr;</a></p>' },
      { q: 'Zašto se cijene toliko razlikuju?', a: '<p>Zato što se pod istom riječju prodaju različite stvari. Ponuda od 30 KM/m je najčešće samo bušotina — bez pravilne kolone, zasipa, tampona i razrade. Ponuda od 100 KM/m je gotov, obložen i ispitan bunar.</p><p>To nije razlika u marži nego u proizvodu.</p>' },
      { q: 'Da li je pumpa uključena u cijenu?', a: '<p>Gotovo nikad. Pumpa, hidrofor, elektroinstalacija i priključak se obračunavaju zasebno, i to je normalno — jer se pumpa bira tek kad se izmjeri stvarna izdašnost bunara.</p><p>Za domaćinstvo realno računajte dodatnih <strong>700–1.200 KM</strong>.</p>' },
      { q: 'Plaća se ako se ne nađe voda?', a: '<p>Zavisi od pismenog dogovora sklopljenog <strong>prije</strong> početka. Neke ekipe u BiH nude uslov „nema vode — nema naplate“, druge naplaćuju izvedene metre. Oba su legitimna ako ste znali unaprijed.</p><p>Mi taj uslov utvrđujemo prije izlaska na teren i kažemo vam koja varijanta vrijedi za vaš teren.</p>' },
    ],
  },
  {
    title: 'Dubina i teren',
    items: [
      { q: 'Koliko duboko treba bušiti?', a: '<p>Zavisi isključivo od geologije. Semberija i Posavina <strong>15–40 m</strong>, riječne doline i Krajina <strong>20–60 m</strong>, središnja Bosna <strong>25–80 m</strong>, hercegovački krš <strong>40–150 m</strong> i više.</p><p><a href="/podrucja/">Očekivana dubina za vašu općinu &rarr;</a></p>' },
      { q: 'Kako se zna gdje ima vode?', a: '<p>Najpouzdaniji besplatni podatak je <strong>dubina i izdašnost okolnih postojećih bunara</strong>. Uz to idu geološka građa područja, pozicija u odnosu na vodotok i iskustvo ekipe s tog terena.</p><p>Za ozbiljnije zahvate rade se hidrogeološka istraživanja. Za kućni bunar u aluviju to najčešće nije potrebno; u kršu itekako pomaže.</p>' },
      { q: 'Šta mislite o rašljanju?', a: '<p>Rašljanje je dio narodne tradicije u ovom kraju i mnogi ljudi u njega vjeruju, uključujući i neke iskusne bušače. Ne sporimo nikome to iskustvo.</p><p>Ali mi svoje procjene ne temeljimo na tome. Oslanjamo se na geološku građu područja i na podatke o postojećim bunarima — zato što to možemo objasniti, provjeriti i ponoviti.</p>' },
      { q: 'Može li bunar presušiti?', a: '<p>Može, ali se to rjeđe dešava nego što ljudi misle. Češći uzrok pada izdašnosti je zapušenje filtera taloženjem željeza i mulja — a to se rješava regeneracijom.</p><p><a href="/usluge/ciscenje-bunara/">Čišćenje i regeneracija &rarr;</a></p>' },
    ],
  },
  {
    title: 'Dozvole i propisi',
    items: [
      { q: 'Treba li dozvola za bunar?', a: '<p>Za bunar na vlastitom zemljištu za potrebe domaćinstva — <strong>ne</strong>. To je opća upotreba voda, u oba entiteta.</p><p>Za navodnjavanje i poslovnu namjenu — <strong>da</strong>. <a href="/dozvole/">Cijeli postupak &rarr;</a></p>' },
      { q: 'Da li se dozvola traži po dubini bunara?', a: '<p>Ne. Kriterij je <strong>namjena vode</strong>, ne dubina i ne količina. Bunar od sto metara za kućne potrebe je opća upotreba. Bunar od petnaest metara za navodnjavanje njive nije.</p>' },
      { q: 'Moram li prijaviti bunar?', a: '<p>Ako je u režimu opće upotrebe — ne. Za sve izvan toga ide postupak izdavanja vodnih akata kod nadležnog organa: u FBiH agencije za vodna područja, u RS JU „Vode Srpske“, u Brčkom organ Distrikta.</p>' },
    ],
  },
  {
    title: 'Voda i kvalitet',
    items: [
      { q: 'Je li voda iz bunara pitka?', a: '<p>Ne automatski. Najčešće jeste, ali se to zna tek nakon analize. Plitke izdani u poljoprivrednim krajevima znaju imati nitrate i bakteriološko opterećenje, a u Posavini gotovo redovno ima željeza i mangana.</p><p><a href="/usluge/analiza-vode/">Šta se analizira &rarr;</a></p>' },
      { q: 'Voda mi ostavlja narančasti talog — šta je to?', a: '<p>Željezo, ponekad uz mangan. U koncentracijama uobičajenim za BiH nije opasno po zdravlje, ali boji sanitariju i rublje i taloži se u instalaciji.</p><p>Rješava se filterom za željezo, dimenzioniranim prema nalazu analize i protoku.</p>' },
      { q: 'Koliko daleko bunar mora biti od septičke jame?', a: '<p>Što dalje, a naročito na plitkim aluvijalnim izdanima. Konkretna udaljenost zavisi od terena, nagiba i smjera toka podzemne vode.</p><p>Poziciju određuje ekipa na licu mjesta. Pravilno izveden tampon štiti bunar, ali ne poništava lošu poziciju.</p>' },
    ],
  },
  {
    title: 'Izvođenje',
    items: [
      { q: 'Koliko traje izrada bunara?', a: '<p>Bušenje u aluviju jedan do dva dana, u stijeni tri do sedam. Na to dolazi razrada i probno crpljenje (dan do dva) i ugradnja pumpe (dan).</p><p>Od poziva do vode u slavini realno računajte <strong>jednu do tri sedmice</strong>, ovisno o terminima.</p>' },
      { q: 'Koliko prostora treba stroju?', a: '<p>Bušaća garnitura je kamion ili gusjeničar. Treba joj prilaz i prostor za manevar i podupirače. Za teško dostupne parcele postoje manje garniture, ali s manjom dubinom.</p><p>Recite nam kakav je pristup — to mijenja izbor ekipe i cijenu.</p>' },
      { q: 'Pravi li bušenje veliku štetu u dvorištu?', a: '<p>Bušenje s isplakom stvara blato oko bušotine i treba prostor za taložnicu. Nije katastrofa, ali nije ni čist posao — računajte na sanaciju terena poslije.</p><p>U stijeni s pneumatskim čekićem manje je blata, ali ima prašine i buke.</p>' },
      { q: 'Radite li zimi?', a: '<p>U nizinama uglavnom da, osim po smrznutom terenu i jakom snijegu. U planinskim i visokim krškim područjima sezona je kraća.</p><p>Zima je najmirniji dio godine u ovom poslu — termini su kraći, a ekipe dostupnije nego u proljeće.</p>' },
    ],
  },
  {
    title: 'O nama',
    items: [
      { q: 'Vi bušite ili posredujete?', a: `<p>Budimo precizni: <strong>${esc(site.role)}</strong></p><p>Mi vodimo procjenu, provjeru terena i dogovor, a posao izvodi bušačka firma s vlastitim strojevima i registrovanom djelatnošću. To vam kažemo otvoreno jer mislimo da imate pravo znati s kim radite.</p>` },
      { q: 'Kako birate ekipe?', a: '<p>Registrovana djelatnost, vlastita mehanizacija, provjerljive reference i spremnost da sve dogovoreno stave na papir. Ekipe koje ne rade tampon i probno crpljenje ne uvrštavamo.</p>' },
      { q: 'Naplaćujete li procjenu?', a: '<p>Ne. Telefonska procjena — raspon dubine, cijene i odgovor treba li vam dozvola — je besplatna i ne obavezuje vas ni na šta.</p>' },
      { q: 'Radite li u cijeloj BiH?', a: `<p>Da. Trenutno imamo pisanu procjenu terena za <strong>${regions.length} općina i područja</strong>, a pokrivamo i sve ostalo — samo za ta područja procjenu radimo telefonom umjesto iz gotove analize.</p>` },
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
    lede: 'Sve što nas ljudi najčešće pitaju, odgovoreno bez uljepšavanja — uključujući ono što drugi ne vole spominjati.',
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

${ctaBand('Nema odgovora na vaše pitanje? Pozovite.')}
`
  return page({
    title: 'Česta pitanja o bušenju bunara u BiH',
    description: 'Cijena, dubina, dozvole, kvalitet vode i sam postupak bušenja bunara u BiH — odgovori na najčešća pitanja, bez uljepšavanja.',
    path: '/pitanja/',
    body,
    schema: [faqSchema(all)],
  })
}

/* ==========================================================================
   /kontakt/
   ========================================================================== */

export function kontaktPage() {
  const opts = [...regions].sort((a, b) => a.name.localeCompare(b.name, 'bs'))

  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Kontakt' }])}
${pageHead({
    eyebrow: 'Besplatna procjena',
    title: 'Kontakt',
    lede: 'Najbrže je da nazovete. Jedan razgovor i znate raspon dubine, cijene i treba li vam dozvola.',
  })}

<section class="band">
  <div class="wrap">
    <div class="contact-grid">

      <div class="stack gap-md">
        <div class="call-card">
          <p class="hours">Pozovite direktno</p>
          <a class="big" href="tel:${site.phoneHref}">${esc(site.phone)}</a>
          <p>${esc(site.hours)}</p>
          <div class="btn-row">
            <a class="btn btn-primary" href="viber://chat?number=${encodeURIComponent(site.viberHref)}">${icon.chat} Viber</a>
            <a class="btn btn-ghost" href="https://wa.me/${esc(site.whatsappHref)}">${icon.chat} WhatsApp</a>
          </div>
        </div>

        <div class="panel panel-accent">
          <h2>Šta pripremiti prije poziva</h2>
          <ol style="padding-left:1.1rem;display:flex;flex-direction:column;gap:.55rem;margin:0">
            <li><strong>Općinu i najbliže naselje</strong> — ne treba tačna adresa.</li>
            <li><strong>Namjenu vode</strong> — domaćinstvo, vrt, navodnjavanje ili posao.</li>
            <li><strong>Pristup parceli</strong> — može li kamion doći do mjesta bušenja.</li>
            <li><strong>Dubinu najbližeg bunara</strong>, ako je znate — najbolji besplatan pokazatelj u ovom poslu.</li>
          </ol>
        </div>

        <div class="panel">
          <h2>E-mail</h2>
          <p><a href="mailto:${esc(site.email)}" style="font-family:var(--mono)">${esc(site.email)}</a></p>
          <p class="note">${esc(site.role)}</p>
        </div>

        ${photo('garnitura-njiva', {
          sizes: '(max-width: 860px) 100vw, 34vw',
          ratio: '4/3',
          caption: 'Ekipa na terenu. Prvo procjena telefonom, pa izlazak na parcelu.',
        })}
      </div>

      <div>
        <div class="panel">
          <h2>Pošaljite upit</h2>
          <p class="note">Odgovaramo isti ili sljedeći radni dan. Ako vam se žuri — nazovite.</p>

          <!-- ==================================================================
               Forma sastavlja WhatsApp poruku — bez backenda i bez posrednika.
               Radi na Vercelu (i svugdje drugdje) bez ijedne postavke, a
               WhatsApp je kanal na kojem ovo tržište zapravo komunicira.

               Ako ikad zatreba klasična e-mail forma, vidi README.md
               sekciju "Forma" — Formspree ili Web3Forms je jedna linija.
               ================================================================== -->
          <noscript>
            <div class="call warn" style="margin:1rem 0">
              <span class="k">JavaScript je isključen</span>
              <p>Obrazac sastavlja WhatsApp poruku, pa bez JavaScripta ne radi.
                 Pozovite nas na <a href="tel:${site.phoneHref}">${esc(site.phone)}</a> — brže je ionako.</p>
            </div>
          </noscript>

          <form class="form" id="upit-form" data-wa="${esc(site.whatsappHref)}" style="margin-top:1rem">

            <div class="form-row">
              <div class="field">
                <label for="f-ime">Ime i prezime</label>
                <input id="f-ime" name="ime" type="text" required autocomplete="name">
              </div>
              <div class="field">
                <label for="f-tel">Telefon</label>
                <input id="f-tel" name="telefon" type="tel" required autocomplete="tel" placeholder="06X XXX XXX">
              </div>
            </div>

            <div class="field">
              <label for="f-opcina">Općina</label>
              <select id="f-opcina" name="opcina" required>
                <option value="">— odaberite —</option>
                ${opts.map(r => `<option value="${esc(r.name)}">${esc(r.name)}</option>`).join('\n                ')}
                <option value="ostalo">Druga općina</option>
              </select>
            </div>

            <div class="field">
              <label for="f-namjena">Za šta vam treba voda</label>
              <select id="f-namjena" name="namjena" required>
                <option value="domacinstvo">Domaćinstvo</option>
                <option value="kuca-vrt">Kuća i vrt</option>
                <option value="navodnjavanje">Navodnjavanje</option>
                <option value="stoka">Stočarstvo</option>
                <option value="posao">Poslovni objekt</option>
                <option value="geosonda">Geotermalna sonda</option>
                <option value="regeneracija">Čišćenje postojećeg bunara</option>
              </select>
            </div>

            <div class="form-row">
              <div class="field">
                <label for="f-pristup">Pristup za kamion</label>
                <select id="f-pristup" name="pristup">
                  <option value="da">Da, bez problema</option>
                  <option value="usko">Usko, ali moguće</option>
                  <option value="ne">Otežano / ne znam</option>
                </select>
              </div>
              <div class="field">
                <label for="f-susjed">Dubina susjednog bunara</label>
                <input id="f-susjed" name="susjedni_bunar" type="text" placeholder="npr. 22 m — ako znate">
              </div>
            </div>

            <div class="field">
              <label for="f-poruka">Poruka</label>
              <textarea id="f-poruka" name="poruka" rows="4" placeholder="Sve što mislite da nam pomaže."></textarea>
            </div>

            <button class="btn btn-primary btn-lg" type="submit">${icon.chat} Pošalji na WhatsApp</button>
            <p class="note">Klikom se otvara WhatsApp s već popunjenom porukom — samo je pošaljete. Ako vam je lakše, <a href="tel:${site.phoneHref}">pozovite ${esc(site.phone)}</a>.</p>
            <p class="note">Vaše podatke koristimo isključivo da vam odgovorimo na upit i dogovorimo posao. Ne prosljeđujemo ih trećim stranama osim izvođaču kojeg zajedno odaberemo.</p>
          </form>
        </div>
      </div>

    </div>
  </div>
</section>
`
  return page({
    title: 'Kontakt — besplatna procjena za bušenje bunara',
    description: `Pozovite ${site.phone} ili pošaljite upit. Besplatna procjena dubine i cijene bunara za vašu općinu, bez obaveze.`,
    path: '/kontakt/',
    body,
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
      <a class="card-link" href="/dozvole/"><span class="card-num">Pravno</span><h2>Treba li dozvola</h2><p>Kratak odgovor: za kućni bunar — ne treba.</p></a>
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
