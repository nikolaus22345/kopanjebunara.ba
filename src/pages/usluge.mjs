import { site } from '../data/site.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand } from '../layout.mjs'
import { photo } from '../components/media.mjs'

const SERVICE_PHOTO = {
  'geotermalne-sonde': ['garnitura-velika', 'Dublje bušenje u stijenu — geosonde traže 80 do 150 metara.'],
  'pumpe-i-hidrofori': ['kolone-cijevi', 'Oprema se bira nakon mjerenja izdašnosti, ne prije.'],
  'analiza-vode': ['isplaka-blizu', 'Voda odmah nakon bušenja je mutna — bistri se razradom, a ispravnost pokazuje analiza.'],
  'ciscenje-bunara': ['svrdlo-dvoriste', 'Regeneracija postojećeg bunara u dvorištu.'],
}

const services = [
  {
    slug: 'geotermalne-sonde',
    nav: 'Geotermalne sonde',
    title: 'Geotermalne sonde i bušotine za toplotnu pumpu',
    eyebrow: 'Grijanje i hlađenje',
    lede: 'Bušotine za sistem zemlja-voda i voda-voda. Ista mehanizacija kao za bunar, potpuno drugi proračun.',
    meta: 'Bušenje geotermalnih sondi u BiH za toplotne pumpe zemlja-voda i voda-voda. Dubine, broj sondi, cijena po metru i razlika u odnosu na bunar.',
    body: `
<div class="prose">
  <p>Toplotna pumpa <strong>zemlja-voda</strong> ne treba podzemnu vodu. Ona koristi stabilnu temperaturu tla, koja se ispod petnaestak metara gotovo ne mijenja kroz godinu. Zato geosonda radi i tamo gdje bunar ne bi uspio — na fliškom terenu, u glini, na parceli bez ijedne kapi iskoristive vode.</p>
  <p>Toplotna pumpa <strong>voda-voda</strong> je druga priča: ona zahvata podzemnu vodu, koristi njenu toplinu i vraća je nazad. Efikasnija je, ali traži stvarnu izdašnost — i pravni režim koji ide uz zahvatanje vode.</p>
  <h2>Šta se buši</h2>
  <p>Geosonda je zatvoreni krug: u bušotinu se spušta U-cijev kroz koju kruži nosilac toplote, a prostor oko nje se ispunjava bentonitnom smjesom za dobar prenos topline. Voda iz tla ne ulazi u sistem.</p>
  <p>Dubine sondi su tipično <strong>80–150 metara</strong>, a broj sondi ovisi o toplotnom opterećenju objekta — ne o njegovoj kvadraturi napamet. Za prosječnu kuću to je najčešće dvije do četiri bušotine s razmakom od barem šest metara.</p>
  <h2>Šta odlučuje o cijeni</h2>
  <p>Cijena po metru je viša nego kod običnog bunara, jer se buši dublje i gotovo uvijek u stijenu. Na to dolazi cijena sondi, bentonita, razvoda i same toplotne pumpe — koja je najskuplji dio sistema.</p>
  <div class="call warn">
    <span class="k">Prije nego bušite</span>
    <p>Proračun toplotnog opterećenja objekta mora doći <strong>prije</strong> bušenja, ne poslije. Podimenzionirano polje sondi se u toku zime „ohladi“ i pumpa gubi efikasnost — a to se ne popravlja bez novog bušenja.</p>
  </div>
  <h2>Kada ima smisla</h2>
  <p>Kod novogradnje s podnim grijanjem i dobrom izolacijom — gotovo uvijek. Kod postojećeg objekta s radijatorima na visokom režimu — treba računati, jer efikasnost pada s temperaturom polaza.</p>
</div>`,
    faq: [
      { q: 'Treba li dozvola za geotermalnu sondu?', a: '<p>Zatvoreni sistem ne zahvata vodu, ali ulazi u tlo i može doći u dodir s izdani, pa se režim provjerava kod nadležnog organa. Sistem <strong>voda-voda</strong> zahvata podzemnu vodu i tu vodni akti gotovo sigurno trebaju.</p><p><a href="/dozvole/">Više o vodnim aktima &rarr;</a></p>' },
      { q: 'Koliko sondi treba za kuću od 150 m²?', a: '<p>Ne može se odgovoriti iz kvadrature. Treba proračun toplotnog opterećenja — izolacija, stolarija, režim grijanja i tip tla mijenjaju rezultat višestruko.</p><p>Ali kao red veličine: za dobro izolovanu kuću te veličine najčešće se radi o dvije do tri sonde po stotinjak metara.</p>' },
      { q: 'Može li se koristiti postojeći bunar za toplotnu pumpu?', a: '<p>Ponekad da, ako ima dovoljnu i stabilnu izdašnost i ako postoji način da se voda vrati u izdan. Treba i bunar za vraćanje, ne samo za zahvatanje.</p><p>Prvo se mjeri stvarna izdašnost — ako je bunar nikad nije imao izmjerenu, to je prvi korak.</p>' },
    ],
  },
  {
    slug: 'pumpe-i-hidrofori',
    nav: 'Pumpe i hidrofori',
    title: 'Pumpe i hidrofori za bunar',
    eyebrow: 'Oprema',
    lede: 'Pumpa se bira prema izmjerenoj izdašnosti bunara i visini dizanja — ne prema tome šta je bilo na akciji.',
    meta: 'Kako se bira potapajuća pumpa i hidrofor za bunar: snaga, protok, visina dizanja, cijene u BiH i najčešće greške pri izboru.',
    body: `
<div class="prose">
  <p>Najčešća greška poslije bušenja nije loš bunar — nego pogrešna pumpa. Prejaka pumpa isisa bunar brže nego što se puni, radi na suho i pregori. Preslaba ne diže vodu do gornjeg sprata. Obje koštaju isto koliko i prava.</p>
  <h2>Tri broja koja odlučuju</h2>
  <ul>
    <li><strong>Izmjerena izdašnost bunara</strong> — koliko m³/h bunar stvarno daje u kontinuiranom radu. Ovo dolazi iz probnog crpljenja. Bez tog podatka izbor pumpe je nagađanje.</li>
    <li><strong>Ukupna visina dizanja</strong> — dubina ugradnje pumpe, plus visina do najvišeg izljeva, plus gubici u cijevima.</li>
    <li><strong>Potrebna količina</strong> — koliko vam treba u vršnom trenutku, a ne prosječno.</li>
  </ul>
  <h2>Tipično za domaćinstvo</h2>
  <p>Za prosječnu kuću u BiH: potapajuća pumpa <span class="fig">0,75–1,1 kW</span>, protok <span class="fig">2–3 m³/h</span>, visina dizanja <span class="fig">50–60 m</span>, uz hidrofor od najmanje <span class="fig">60 litara</span>. Realan trošak s ugradnjom je <strong>700–1.200 KM</strong>.</p>
  <p>Za navodnjavanje se računa drugačije — tu je bitan protok koji sistem traži u špici, i pumpa je osjetno jača i skuplja.</p>
  <div class="call">
    <span class="k">Zaštita koja se isplati</span>
    <p>Zaštita od rada na suho i pravilno postavljen nepovratni ventil koštaju malo, a spašavaju pumpu. Kod bunara sa slabijom izdašnošću to nije opcija nego uslov.</p>
  </div>
  <h2>Hidrofor</h2>
  <p>Hidrofor drži pritisak u instalaciji i sprječava da pumpa pali i gasi pri svakom otvaranju slavine. Premali hidrofor znači stalno paljenje i kratak vijek pumpe. Za domaćinstvo šezdeset litara je donja granica, sto je udobnije.</p>
</div>`,
    faq: [
      { q: 'Koliko duboko se spušta pumpa?', a: '<p>Ispod dinamičkog nivoa vode — dakle nivoa kad pumpa radi, ne kad miruje — ali iznad dna bunara i iznad filtera, da ne uvlači talog.</p><p>Tačna kota se određuje iz podataka probnog crpljenja.</p>' },
      { q: 'Zašto mi pumpa stalno pali i gasi?', a: '<p>Najčešće premali hidrofor ili pogrešno podešen pritisak u membrani. Ponekad i pumpa prejaka za izdašnost bunara.</p><p>To se rješava podešavanjem ili zamjenom hidrofora — rijetko treba dirati pumpu.</p>' },
      { q: 'Treba li mi filter na pumpi?', a: '<p>Ako bunar pješči, filter je krpljenje simptoma — problem je u izvedbi bunara, najčešće u nedostatku ili pogrešnoj granulaciji šljunčanog zasipa.</p><p>Filter za željezo i mangan je druga stvar i u Posavini se gotovo uvijek isplati, ali tek nakon analize vode.</p>' },
    ],
  },
  {
    slug: 'analiza-vode',
    nav: 'Analiza vode',
    title: 'Analiza vode iz bunara',
    eyebrow: 'Kvalitet',
    lede: 'Bunarska voda nije automatski pitka. Analiza se radi jednom i kaže vam tačno šta imate.',
    meta: 'Analiza vode iz bunara u BiH: bakteriološka i fizičko-hemijska, šta se ispituje, koliko košta i šta znače željezo, mangan i nitrati u nalazu.',
    body: `
<div class="prose">
  <p>Voda može biti bistra, hladna i ukusna — i istovremeno neispravna. Bakteriološko opterećenje se ne vidi i ne osjeti, a nitrati nemaju ni boju ni miris.</p>
  <h2>Dvije vrste analize</h2>
  <p><strong>Bakteriološka</strong> — traži se prisustvo bakterija fekalnog porijekla. Jeftina je, radi se preko zavoda za javno zdravstvo, i za novi bunar je apsolutni minimum.</p>
  <p><strong>Fizičko-hemijska</strong> — mutnoća, pH, tvrdoća, željezo, mangan, nitrati, nitriti, amonijak, provodljivost i ostalo, ovisno o paketu. Cijena raste s obimom: osnovni paket je jeftin, širi paket može ići i preko <strong>400 KM</strong>.</p>
  <h2>Tri stvari koje se najčešće nađu u BiH</h2>
  <div class="grid grid-3" style="margin:.5rem 0">
    <div class="card">
      <span class="card-num">Posavina</span>
      <h3>Željezo i mangan</h3>
      <p>Narančasti ili crni talog na sanitariji i rublju. Nije opasno po zdravlje u uobičajenim koncentracijama, ali je neugodno i uništava opremu. Rješava se filterom.</p>
    </div>
    <div class="card">
      <span class="card-num">Poljoprivredni krajevi</span>
      <h3>Nitrati</h3>
      <p>Dolaze iz đubriva i stočarstva, najviše na plitkim izdanima. Za odrasle su problem tek u visokim koncentracijama, za bebe znatno ranije. Ovo je razlog zbog kojeg se analiza radi.</p>
    </div>
    <div class="card">
      <span class="card-num">Plitki bunari</span>
      <h3>Bakteriologija</h3>
      <p>Skoro uvijek posljedica loše izvedenog tampona ili preblizu postavljene septičke jame. Dezinfekcija pomaže privremeno; uzrok se rješava sanacijom bušotine.</p>
    </div>
  </div>
  <div class="call warn">
    <span class="k">Kada ponoviti analizu</span>
    <p>Nakon izrade bunara, pa ponovo nakon prve godine. Zatim svake dvije do tri godine, i obavezno nakon poplave, velikih radova u blizini ili svake primjetne promjene boje, mirisa ili okusa vode.</p>
  </div>
</div>`,
    faq: [
      { q: 'Koliko dugo se čeka nalaz?', a: '<p>Bakteriološki nalaz obično nekoliko dana. Širi fizičko-hemijski paket može trajati i do dvije sedmice, ovisno o laboratoriji i obimu.</p>' },
      { q: 'Ko uzima uzorak?', a: '<p>Uzorak mora biti uzet pravilno — sterilna posuda, ispuštanje vode prije uzimanja, brz transport do laboratorije. Loše uzet uzorak daje lažan nalaz u oba smjera.</p><p>Ekipa to radi na kraju posla ili vas uputi u tačan postupak.</p>' },
      { q: 'Šta ako nalaz nije dobar?', a: '<p>Ovisi šta je nađeno. Željezo i mangan se rješavaju filterom. Bakteriologija traži da se nađe uzrok — najčešće je to tampon ili pozicija bunara. Visoki nitrati na plitkom bunaru ponekad znače da treba ići dublje, u zaštićeniju izdan.</p><p>Recite nam šta piše u nalazu pa ćemo vam reći šta je realno.</p>' },
    ],
  },
  {
    slug: 'ciscenje-bunara',
    nav: 'Čišćenje i regeneracija',
    title: 'Čišćenje i regeneracija bunara',
    eyebrow: 'Održavanje',
    lede: 'Stari bunar koji je izgubio izdašnost često se može vratiti u funkciju — znatno jeftinije nego bušiti novi.',
    meta: 'Čišćenje i regeneracija starih bunara u BiH: zašto bunar gubi izdašnost, kako se regeneriše i kada se ipak isplati bušiti novi.',
    body: `
<div class="prose">
  <p>Bunar koji je nekad davao dovoljno vode, a sada se prazni za pola sata, najčešće nije „presušio“. Izdan je tu — zapušio se ulaz u bunar.</p>
  <h2>Zašto bunar gubi izdašnost</h2>
  <ul>
    <li><strong>Kolmiranje filtera</strong> — sitne čestice i mulj postupno zapune proreze filterske cijevi i šljunčani zasip oko nje.</li>
    <li><strong>Inkrustacija</strong> — taloženje željeza i kalcijuma stvara naslage koje sužavaju otvore. Tipično za vode bogate željezom, dakle za veći dio Posavine.</li>
    <li><strong>Zapješčavanje</strong> — pijesak se nakuplja na dnu i postupno prekriva filtersku zonu.</li>
    <li><strong>Biološko obrastanje</strong> — bakterije željeza stvaraju sluzave naslage na filteru.</li>
  </ul>
  <h2>Kako se regeneriše</h2>
  <p>Mehanički — četkanje, ispiranje pod pritiskom, air-lift i erlifting kojim se izbacuje nakupljeni materijal. Hemijski — otapanje inkrustacija odgovarajućim sredstvom, uz obavezno ispiranje i dezinfekciju poslije. Nakon regeneracije radi se novo mjerenje izdašnosti, da se vidi koliko se vratilo.</p>
  <div class="call">
    <span class="k">Realno očekivanje</span>
    <p>Dobro izveden bunar se regeneracijom često vrati blizu prvobitne izdašnosti. Loše izveden bunar — bez zasipa i tampona — se najčešće ne isplati spašavati, jer se problem vraća za godinu dana.</p>
  </div>
  <h2>Kada se ipak buši novi</h2>
  <p>Ako je kolona propala, ako je bušotina nepovratno zapunjena, ako je izdan stvarno pala zbog šireg pada nivoa u području, ili ako je bunar loše pozicioniran u odnosu na izvor zagađenja. U tim slučajevima regeneracija je bačen novac i mi ćemo vam to reći.</p>
</div>`,
    faq: [
      { q: 'Koliko košta regeneracija?', a: '<p>Osjetno manje od novog bunara, ali cijena ovisi o dubini, promjeru, stanju bunara i metodi. Prvi korak je pregled i procjena je li uopšte izvodljiva.</p>' },
      { q: 'Koliko dugo traje?', a: '<p>Za tipičan kućni bunar najčešće jedan do dva dana, uključujući ispiranje i dezinfekciju. Nakon toga treba pustiti vodu da se izbistri prije uzimanja uzorka za analizu.</p>' },
      { q: 'Radite li i sanaciju starih kopanih bunara?', a: '<p>Da, uz ograničenja. Stari kopani bunari su najčešće problematični zbog širokog otvora i loše zaštite od površinske vode. Ponekad je bolje rješenje probušiti novi uski bunar nego sanirati stari.</p>' },
    ],
  },
]

export function uslugeIndexPage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Usluge' }])}
${pageHead({
    eyebrow: 'Šta sve radimo',
    title: 'Usluge',
    lede: 'Bunar je najčešći razlog zbog kojeg nas zovu, ali nije jedini. Sve ostalo vezano za podzemnu vodu i bušenje rješavamo s istim ekipama.',
  })}

<section class="band">
  <div class="wrap">
    <div class="grid grid-2">
      <a class="card-link" href="/busenje-bunara/">
        <span class="card-num">Osnovna usluga</span>
        <h2>Bušenje bunara</h2>
        <p>Bušenje, opremanje i ispitivanje bunara za domaćinstva, poljoprivredu i poslovne objekte, u cijeloj BiH.</p>
      </a>
      ${services.map(s => `<a class="card-link" href="/usluge/${s.slug}/">
        <span class="card-num">${esc(s.eyebrow)}</span>
        <h2>${esc(s.nav)}</h2>
        <p>${esc(s.lede)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand()}
`
  return page({
    title: 'Usluge — bunari, geosonde, pumpe, analiza vode',
    description: 'Bušenje bunara, geotermalne sonde, pumpe i hidrofori, analiza vode te čišćenje i regeneracija starih bunara — u cijeloj BiH.',
    path: '/usluge/',
    body,
  })
}

export function servicePages() {
  return services.map(s => ({
    path: `/usluge/${s.slug}/`,
    html: page({
      title: s.title,
      description: s.meta,
      path: `/usluge/${s.slug}/`,
      schema: [faqSchema(s.faq)],
      body: `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Usluge', href: '/usluge/' }, { label: s.nav }])}
${pageHead({ eyebrow: s.eyebrow, title: esc(s.title), lede: esc(s.lede) })}

<section class="band">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      ${s.body}
      ${SERVICE_PHOTO[s.slug] ? photo(SERVICE_PHOTO[s.slug][0], { sizes: '(max-width: 860px) 100vw, 28vw', ratio: '3/4', caption: SERVICE_PHOTO[s.slug][1] }) : ''}
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Česta pitanja</h2></div>
    ${faqBlock(s.faq)}
  </div>
</section>

${ctaBand()}
`,
    }),
  }))
}

export const serviceList = services
