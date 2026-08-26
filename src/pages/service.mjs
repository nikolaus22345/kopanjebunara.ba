import { site } from '../data/site.mjs'
import { aquiferTypes } from '../data/regions.mjs'
import { page, pageHead, crumbs, icon, esc, strata, faqBlock, faqSchema, ctaBand } from '../layout.mjs'

/* ==========================================================================
   /busenje-bunara/  — main service page
   ========================================================================== */

const sFaq = [
  {
    q: 'Koja je razlika između kopanja i bušenja bunara?',
    a: '<p>Kopani bunar se radi ručno ili mini-bagerom, širok je i plitak, i obziđuje se. Danas se praktički ne radi — opasan je za izvođenje i lako se zagadi s površine.</p><p><strong>Bušeni bunar</strong> se izvodi strojem, uzak je i dubok, obložen kolonom i zabrtvljen. To je ono što danas znači „bunar“, iako ljudi i dalje govore „kopanje bunara“.</p>',
  },
  {
    q: 'Šta je arteški bunar?',
    a: '<p>Pravi arteški bunar je onaj kod kojeg je voda pod pritiskom pa sama izlazi na površinu bez pumpe. Takvi uslovi u BiH postoje, ali su rijetki i vezani za određene geološke strukture.</p><p>U svakodnevnom govoru „arteški bunar“ znači <strong>svaki dublji bušeni bunar</strong>. Ako ste to tražili — tražili ste bušeni bunar, i to je ono što radimo.</p>',
  },
  {
    q: 'Može li stroj doći do moje parcele?',
    a: '<p>To je jedno od prvih pitanja koje ćemo vam postaviti. Bušaća garnitura je kamion ili gusjeničar i treba joj prilaz i prostor za manevar.</p><p>Za teško dostupne parcele postoje manji strojevi, ali imaju ograničenu dubinu. Recite nam kakav je pristup — to mijenja i izbor ekipe i cijenu.</p>',
  },
  {
    q: 'Koliko daleko od kuće ili septičke jame mora biti bunar?',
    a: '<p>Što dalje od septičke jame, štale i đubrišta — to je pravilo koje vrijedi svugdje, a najviše na plitkim aluvijalnim izdanima. Konkretna udaljenost zavisi od terena i lokalnih uslova.</p><p>Ekipa to određuje na licu mjesta, prije nego stroj krene. Pravilno izveden tampon štiti bunar, ali ne poništava lošu poziciju.</p>',
  },
  {
    q: 'Radite li i zimi?',
    a: '<p>U nizinskim krajevima uglavnom da, osim po smrznutom terenu i jakom snijegu. U planinskim i visokim krškim područjima sezona je kraća.</p><p>Zima je inače najmirniji dio godine u ovom poslu, pa su termini kraći, a ekipe dostupnije nego u proljeće.</p>',
  },
]

const forWhom = [
  ['Domaćinstvo', 'Vlastita voda za kuću, bez mjesečnog računa i bez zavisnosti od gradske mreže. Najčešći razlog zbog kojeg nas ljudi zovu.'],
  ['Vikendica i objekt van mreže', 'Tamo gdje vodovod ne dolazi ili je priključenje skuplje od bunara. Često i jedina realna opcija.'],
  ['Poljoprivreda', 'Navodnjavanje voćnjaka, plastenika i njiva. Ovdje je ključna stabilnost izdašnosti u julu i augustu, ne trenutna brojka.'],
  ['Stočarstvo', 'Napajanje stoke traži stalan i pouzdan dotok. Bunar se dimenzionira prema vršnoj potrošnji, ne prosjeku.'],
  ['Poslovni objekti', 'Pogoni, ugostiteljstvo, autopraonice. Ovdje gotovo uvijek trebaju vodni akti — planirajte ih od početka.'],
  ['Toplotne pumpe', 'Bušotine za geotermalne sonde ili sistem voda-voda. Drugi proračun i druga oprema, ali ista mehanizacija.'],
]

export function busenjeBunaraPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Bušenje bunara' }])}
${pageHead({
    eyebrow: 'Osnovna usluga',
    title: 'Bušenje i kopanje bunara u BiH',
    lede: 'Bušenje, opremanje i ispitivanje bunara za domaćinstva, poljoprivredu i poslovne objekte — u cijeloj Bosni i Hercegovini, s ekipama koje imaju vlastite strojeve i registrovanu djelatnost.',
    extra: `<div class="btn-row">
      <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icon.phone} ${esc(site.phone)}</a>
      <a class="btn btn-ghost btn-lg" href="/#procjena">Procijeni za svoju općinu</a>
    </div>`,
  })}

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Tri vrste bunara — i zašto se danas radi samo jedna</h2>
      <span class="tag">Kopani, pobijeni, bušeni</span>
    </div>
    <div class="grid grid-3">
      <div class="card">
        <span class="card-num">Zastarjelo</span>
        <h3>Kopani bunar</h3>
        <p>Ručno kopan i obziđen, historijski do šezdesetak metara. Širok otvor znači i laku kontaminaciju s površine, a samo kopanje je opasno. Danas se radi izuzetno rijetko, uglavnom kao obnova starog.</p>
      </div>
      <div class="card">
        <span class="card-num">Ograničeno</span>
        <h3>Pobijeni bunar</h3>
        <p>Uska cijev zabijena u tlo, brzo i jeftino, ali samo do oko devet metara i samo u dobro propusnom pjeskovitom tlu. Dovoljno za baštu, nedovoljno za kuću.</p>
      </div>
      <div class="card">
        <span class="card-num">Standard</span>
        <h3>Bušeni bunar</h3>
        <p>Izveden strojem, obložen kolonom, s filterom u vodonosnom sloju, zasipom i tamponom. Doseže dubine na kojima je voda čista i stabilna. Ovo je ono što danas znači bunar.</p>
      </div>
    </div>

    <div class="call" style="margin-top:1.75rem">
      <span class="k">O riječi „arteški“</span>
      <p>Većina ljudi u BiH kaže <strong>arteški bunar</strong> misleći na svaki dublji bušeni bunar. Tehnički, arteški je samo onaj kod kojeg voda pod pritiskom sama izlazi na površinu — a to je rijetkost. Ne ispravljamo vas kad zovete; samo da znate da nije svaka duboka bušotina arteška, i da vam niko ne bi trebao naplatiti „arteški“ kao poseban proizvod.</p>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kako se buši</h2>
      <span class="tag">Metoda ovisi o stijeni</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(17rem,1fr));gap:1.25rem">
      <div class="panel panel-accent">
        <h3>Rotaciono s isplakom</h3>
        <p>Standard u mekim naslagama — glina, pijesak, šljunak. Isplaka hladi alat, iznosi izbušeni materijal i drži zid bušotine stabilnim dok se ne ugradi kolona.</p>
        <p class="note">Koristi se u Posavini, Semberiji, Lijevču i riječnim dolinama.</p>
      </div>
      <div class="panel panel-accent">
        <h3>Pneumatski udarni čekić (DTH)</h3>
        <p>Za stijenu i krš. Komprimirani zrak pokreće čekić na dnu bušotine i drobi vapnenac. Rotacija s isplakom u zbijenoj stijeni jednostavno ne napreduje.</p>
        <p class="note">Koristi se u Hercegovini i zapadnoj Bosni. Promjeri na tržištu BiH idu do Ø500 mm, dubine do 200 m i više.</p>
      </div>
      <div class="panel panel-accent">
        <h3>Jezgrovanje</h3>
        <p>Vadi se neporemećeni uzorak stijene. Ne koristi se za vodosnabdijevanje nego za geotehniku i istražne radove kad treba znati tačan sastav podloge.</p>
        <p class="note">Za bunar vam ovo najčešće ne treba.</p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta odlučuje o uspjehu</h2>
      <span class="tag">Četiri tipa terena u BiH</span>
    </div>
    <p class="lede" style="max-width:62ch;margin-bottom:1.75rem">Bosna i Hercegovina ima izrazito različite hidrogeološke uslove na malim udaljenostima. Isti stroj i ista ekipa daju potpuno različit rezultat u Semberiji i na Brotnju. Zato prvo pitamo gdje je parcela.</p>

    <div class="stack gap-lg">
      ${Object.entries(aquiferTypes).map(([key, t]) => `
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,16rem);gap:clamp(1.25rem,3vw,2.5rem);align-items:start" class="split">
        <div class="prose">
          <span class="badge badge-${t.badge}">${esc(t.short)}</span>
          <h3>${esc(t.label)}</h3>
          <p style="font-family:var(--display);font-size:1.3rem;text-transform:uppercase;letter-spacing:.015em;color:var(--accent)">${esc(t.headline)}</p>
          ${t.body.map(p => `<p>${esc(p)}</p>`).join('\n          ')}
        </div>
        ${strata(t.strata, key === 'aluvij' ? [0, 40] : key === 'krs' ? [0, 140] : key === 'flis' ? [0, 80] : [0, 70], { light: true })}
      </div>`).join('\n      <hr class="hr">')}
    </div>

    <p style="margin-top:2rem"><a class="btn btn-primary" href="/podrucja/">Šta je ispod vaše općine ${icon.arrow}</a></p>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Za koga radimo</h2>
      <span class="tag">Namjena mijenja sve</span>
    </div>
    <div class="grid grid-3">
      ${forWhom.map(([t, b], i) => `<div class="card">
        <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(t)}</h3>
        <p>${esc(b)}</p>
      </div>`).join('\n      ')}
    </div>
    <div class="call warn" style="margin-top:1.75rem">
      <span class="k">Namjena određuje i pravni režim</span>
      <p>Kućne potrebe su opća upotreba voda i ne traže dozvolu. Navodnjavanje i poslovna namjena traže vodne akte. <a href="/dozvole/">Provjerite u koju grupu spadate &rarr;</a></p>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Česta pitanja</h2></div>
    ${faqBlock(sFaq)}
  </div>
</section>

${ctaBand()}
`

  return page({
    title: 'Bušenje i kopanje bunara u cijeloj BiH',
    description: 'Bušenje i kopanje bunara za domaćinstva, poljoprivredu i posao. Rotaciono bušenje i pneumatski čekić, od Posavine do hercegovačkog krša.',
    path: '/busenje-bunara/',
    body,
    schema: [faqSchema(sFaq)],
  })
}

/* ==========================================================================
   /postupak/
   ========================================================================== */

const steps = [
  {
    n: '1', when: 'Isti dan', t: 'Poziv i procjena',
    b: 'Trebamo četiri stvari: općinu i najbliže naselje, namjenu vode, pristup parceli za kamion, i — ako znate — dubinu najbližeg postojećeg bunara. Ta zadnja informacija je najbolji besplatan pokazatelj u ovom poslu i često nam kaže više od svega ostalog.',
    out: 'Dobijate: realan raspon dubine i cijene, procjenu izvodljivosti i odgovor treba li vam dozvola.',
  },
  {
    n: '2', when: '2–7 dana', t: 'Izlazak na teren',
    b: 'Ekipa provjerava pristup i prostor za manevar, poziciju u odnosu na objekte, granicu parcele, septičku jamu i podzemne instalacije. Određuje se tačno mjesto bušenja i potvrđuje konačna ponuda.',
    out: 'Dobijate: pismenu ponudu sa specifikacijom — dubina, promjer, materijal kolone, šta ulazi u cijenu.',
  },
  {
    n: '3', when: '1–7 dana', t: 'Bušenje',
    b: 'U aluviju rotacijom s isplakom, u stijeni pneumatskim čekićem. Tokom bušenja se prati profil — koji sloj na kojoj dubini — jer to određuje gdje ide filter. U aluviju posao traje dan do dva, u stijeni i do sedam dana.',
    out: 'Dobijate: profil bušotine — koji materijal je nabušen na kojoj dubini.',
  },
  {
    n: '4', when: 'Isti dan', t: 'Ugradnja kolone i filtera',
    b: 'Spušta se zaštitna kolona s filterskom cijevi pozicioniranom tačno u vodonosnom sloju. Oko filtera se ugrađuje šljunčani zasip odgovarajuće granulacije, a od površine do pola metra iznad filtera glineni ili cementni tampon.',
    out: 'Ovo je korak koji se najčešće preskače kod jeftinih ponuda. Tražite da bude u ponudi.',
  },
  {
    n: '5', when: '1–2 dana', t: 'Razrada i probno crpljenje',
    b: 'Bunar se ispira dok voda ne bude bistra, pa se mjeri stvarna izdašnost: prvo step-test na tri različita kapaciteta, zatim kontinuirano crpljenje. U aluviju najmanje 36 sati, u pukotinskoj stijeni znatno duže.',
    out: 'Dobijate: izmjerenu izdašnost i nivo vode. Tek sada se zna koja pumpa vam treba.',
  },
  {
    n: '6', when: '1 dan', t: 'Pumpa, hidrofor, priključenje',
    b: 'Pumpa se bira prema izmjerenoj izdašnosti i visini dizanja, ne prema tome šta je bilo na akciji. Ugrađuje se hidrofor, automatika i spaja na kućnu instalaciju.',
    out: 'Dobijate: funkcionalan sistem i podatke o ugrađenoj opremi.',
  },
  {
    n: '7', when: '5–15 dana', t: 'Analiza vode',
    b: 'Uzorak se šalje na bakteriološku i hemijsku analizu. Nalaz kaže je li voda ispravna za piće i treba li tretman — u Posavini je najčešće filter za željezo i mangan.',
    out: 'Dobijate: nalaz i, ako treba, prijedlog tretmana s cijenom.',
  },
]

export function postupakPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Postupak' }])}
${pageHead({
    eyebrow: 'Od poziva do vode u slavini',
    title: 'Kako ide postupak',
    lede: 'Sedam koraka, s tim šta se u svakom dešava, koliko traje i — što je najvažnije — šta vi dobijete na kraju svakog.',
  })}

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Sedam koraka do vode</h2>
      <span class="tag">Šta se dešava i šta dobijete</span>
    </div>
    <ol class="steps">
      ${steps.map(s => `<li>
        <div><div class="s-n">${s.n}</div><div class="s-when">${esc(s.when)}</div></div>
        <div class="s-body">
          <h3>${esc(s.t)}</h3>
          <p>${esc(s.b)}</p>
          <p style="font-family:var(--mono);font-size:.78rem;line-height:1.5;color:var(--accent)">${esc(s.out)}</p>
        </div>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta nam treba od vas</h2>
      <span class="tag">Prije prvog poziva</span>
    </div>
    <div class="grid grid-4">
      <div class="card"><span class="card-num">01</span><h3>Lokacija</h3><p>Općina i najbliže naselje ili rijeka. Ne treba nam tačna adresa dok ne dogovorimo posao.</p></div>
      <div class="card"><span class="card-num">02</span><h3>Namjena</h3><p>Domaćinstvo, vrt, navodnjavanje ili posao. Ovo određuje i izdašnost i papire.</p></div>
      <div class="card"><span class="card-num">03</span><h3>Pristup</h3><p>Može li kamion do mjesta bušenja i koliko ima prostora za manevar.</p></div>
      <div class="card"><span class="card-num">04</span><h3>Susjedni bunar</h3><p>Ako znate koliko je dubok najbliži postojeći bunar — to je zlata vrijedan podatak.</p></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta može poći po zlu</h2>
      <span class="tag">Bolje da znate unaprijed</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.25rem">
      <div class="call warn">
        <span class="k">Nema dovoljno vode</span>
        <p>Realno se dešava, najviše u kršu i na fliškom terenu. Zato uslove za taj slučaj utvrđujemo <strong>pismeno prije početka</strong>, a na rizičnim terenima vam to kažemo prvim pozivom.</p>
      </div>
      <div class="call warn">
        <span class="k">Dublje nego procijenjeno</span>
        <p>Procjena je procjena. Ako se ide dublje, to se plaća po ugovorenoj cijeni po metru — ali se <strong>dogovara prije nego se nastavi</strong>, ne saopštava na kraju.</p>
      </div>
      <div class="call warn">
        <span class="k">Voda nije za piće</span>
        <p>Izdašnost i kvalitet su dvije različite stvari. Analiza može pokazati nitrate, bakteriologiju ili previše željeza. Najčešće se rješava tretmanom.</p>
      </div>
      <div class="call warn">
        <span class="k">Nedostupan teren</span>
        <p>Ako stroj ne može doći, postoje manje garniture s manjom dubinom. Provjerava se prije, ne na dan bušenja.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand('Prvi korak je jedan telefonski razgovor.')}
`

  return page({
    title: 'Bušenje bunara — postupak korak po korak',
    description: 'Sedam koraka izrade bunara: procjena, bušenje, kolona i filter, razrada i probno crpljenje, pumpa i analiza vode. Šta traje koliko i šta dobijete.',
    path: '/postupak/',
    body,
  })
}
