import { site } from '../data/site.mjs'
import { page, pageHead, crumbs, icon, esc, faqBlock, faqSchema, ctaBand } from '../layout.mjs'
import { photoBand } from '../components/media.mjs'

const faq = [
  {
    q: 'Treba li mi dozvola za bunar u dvorištu?',
    a: '<p>Ako je bunar na <strong>vašem zemljištu</strong> i voda se koristi za <strong>osnovne potrebe domaćinstva</strong> — piće, kuhanje, higijena, pranje — dozvola vam <strong>ne treba</strong>. To je opća upotreba voda i tako je uređeno u oba entiteta.</p><p>Izuzetak izričito ne pokriva navodnjavanje ni bilo kakvu upotrebu u proizvodnji ili djelatnosti.</p>',
  },
  {
    q: 'A ako zalijevam bašču iz tog bunara?',
    a: '<p>Ovdje je granica u praksi mutnija nego u zakonu. Zalijevanje kućne bašče kantom ili crijevom niko ne tretira kao navodnjavanje.</p><p>Ali <strong>organizovano navodnjavanje</strong> — sistem kap po kap, plastenik, voćnjak, njiva — je jasno izvan opće upotrebe i traži vodne akte. Ako planirate takvo nešto, bolje je riješiti papire nego kasnije objašnjavati.</p>',
  },
  {
    q: 'Ko izdaje dozvolu?',
    a: '<p>U <strong>Federaciji BiH</strong>: agencije za vodna područja — Agencija za vodno područje rijeke Save (Sarajevo) za savski sliv i Agencija za vodno područje Jadranskog mora (Mostar) za jadranski sliv. Za manje predmete i kantonalna ministarstva.</p><p>U <strong>Republici Srpskoj</strong>: JU „Vode Srpske“, Odjeljenje za vodopravne akte.</p><p>U <strong>Brčko distriktu</strong>: nadležni organ Distrikta, po vlastitim propisima.</p>',
  },
  {
    q: 'Koliko traje postupak?',
    a: '<p>Zavisi od predmeta i od toga koliko je zahtjev potpun. Postupak ide u koracima: predaja zahtjeva s dokumentacijom, provjera potpunosti, rješenje — uz mogućnost žalbe i, kao krajnje sredstvo, upravnog spora.</p><p>Najveći gubitak vremena je nepotpuna dokumentacija. Zato se isplati unaprijed provjeriti tačan spisak priloga kod nadležnog organa.</p>',
  },
  {
    q: 'Šta ako sam već izbušio bunar bez papira?',
    a: '<p>Ako ga koristite isključivo za domaćinstvo na svom zemljištu, najvjerovatnije niste ništa prekršili — to je opća upotreba.</p><p>Ako ga koristite za navodnjavanje ili posao, situacija se rješava naknadno i bolje je pokrenuti to sami nego čekati. Recite nam detalje pa ćemo vas uputiti na tačan organ.</p>',
  },
  {
    q: 'Treba li izvođač neku licencu?',
    a: '<p>Za ozbiljne poslove — da. Po <strong>Zakonu o geološkim istraživanjima FBiH</strong> istražno bušenje je geološko istraživanje, pa firma treba odobrenje za obavljanje registrovane djelatnosti u oblasti geologije, a program, projekt i završni izvještaj rade kvalifikovane osobe.</p><p>Za obični kućni bunar to se u praksi ne traži, ali za sve što ide uz vodne akte i koncesiju — traži se. Mi radimo isključivo s firmama koje imaju registrovanu djelatnost.</p>',
  },
]

const matrix = [
  ['Piće, kuhanje, higijena u domaćinstvu', 'Ne', 'Opća upotreba voda — bunar na vlastitom zemljištu.', true],
  ['Zalijevanje kućne bašče', 'Ne', 'U praksi se tretira kao dio kućnih potreba.', true],
  ['Organizovano navodnjavanje (kap po kap, plastenik, voćnjak, njiva)', 'Da', 'Izlazi iz opće upotrebe. Traže se vodni akti.', false],
  ['Napajanje stoke u komercijalnom uzgoju', 'Da', 'Gospodarska djelatnost.', false],
  ['Voda u proizvodnji, ugostiteljstvu, pogonu', 'Da', 'Tehnološka upotreba.', false],
  ['Vodosnabdijevanje više domaćinstava ili naselja', 'Da', 'Puni postupak, uključujući hidrogeološku studiju.', false],
  ['Punjenje i prodaja vode', 'Da', 'Koncesija i ovjera rezervi.', false],
  ['Geotermalna sonda (zatvoreni krug)', 'Ovisno', 'Ne zahvata vodu, ali ulazi u tlo — provjeriti kod nadležnog organa.', null],
]

export function dozvolePage() {
  const body = `
${crumbs([{ label: 'Početna', href: '/' }, { label: 'Dozvole' }])}
${pageHead({
    eyebrow: 'Vodni akti i dozvole za bunar',
    title: 'Treba li vam dozvola za bunar',
    lede: 'Za većinu ljudi odgovor je <strong>ne</strong>. Evo tačno gdje je granica, i šta treba onima koji je pređu — razdvojeno po entitetima, jer se propisi razlikuju.',
  })}

<section class="band">
  <div class="wrap">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.25rem">
      <div class="call">
        <span class="k">Kratak odgovor — ne treba</span>
        <p>Zahvatanje podzemne vode <strong>bunarom na vlastitom zemljištu</strong>, za <strong>osnovne potrebe domaćinstva</strong>, je <strong>opća upotreba voda</strong>. Ne traži se nikakav vodni akt, ni u Federaciji ni u Republici Srpskoj.</p>
      </div>
      <div class="call warn">
        <span class="k">Kratak odgovor — treba</span>
        <p>Čim voda ide u <strong>navodnjavanje, proizvodnju, djelatnost ili snabdijevanje drugih</strong>, izlazite iz opće upotrebe. Tada su potrebni vodni akti, a za veće zahvate i hidrogeološka studija i koncesija.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Kada treba, a kada ne</h2>
      <span class="tag">Po namjeni, ne po dubini</span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Namjena vode</th><th class="num">Dozvola</th><th>Obrazloženje</th></tr></thead>
        <tbody>
          ${matrix.map(([n, d, o, ok]) => `<tr class="${ok === true ? 'yes' : ok === false ? 'no' : ''}"><td><strong>${esc(n)}</strong></td><td class="num">${esc(d)}</td><td>${esc(o)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="call" style="margin-top:1.5rem">
      <span class="k">Ključna stvar koju većina ne zna</span>
      <p>Kriterij <strong>nije dubina bunara ni količina vode</strong>, nego <strong>namjena</strong>. Bunar od sto metara za kućne potrebe je opća upotreba. Bunar od petnaest metara za navodnjavanje njive nije.</p>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <h2>Federacija BiH</h2>
      <span class="tag">Zakon o vodama FBiH</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="prose">
        <p>Zahvatanje podzemne vode iz bunara na vlastitom zemljištu za osnovne potrebe domaćinstva spada u <strong>opću upotrebu voda</strong>. Izuzetak <strong>ne pokriva</strong> navodnjavanje ni upotrebu u tehnološkim procesima vezanim za gospodarsku djelatnost.</p>
        <h3>Tri vodna akta</h3>
        <p><strong>Prethodna vodna saglasnost</strong> — u fazi planiranja, prije izrade projektne dokumentacije. Utvrđuje uslove koje projekt mora ispuniti.</p>
        <p><strong>Vodna saglasnost</strong> — na projektnu dokumentaciju. Pribavlja se <strong>prije građevinske dozvole</strong> i dio je dokumentacije za nju.</p>
        <p><strong>Vodna dozvola</strong> — za samo korištenje vode, nakon izgradnje.</p>
        <h3>Ko izdaje</h3>
        <p><strong>Agencija za vodno područje rijeke Save</strong>, Sarajevo — za savski sliv, što je veći dio Federacije. Obrasci zahtjeva su objavljeni na njihovoj stranici.</p>
        <p><strong>Agencija za vodno područje Jadranskog mora</strong>, Mostar — za jadranski sliv, dakle Hercegovinu.</p>
        <p><strong>Kantonalna ministarstva</strong> za manje predmete. Svaki kanton uz to ima i vlastiti zakon o vodama povrh federalnog, pa vrijedi provjeriti i taj sloj.</p>
      </div>
      <div class="panel panel-accent">
        <h3>I ovo vrijedi znati</h3>
        <p>Po <strong>Zakonu o geološkim istraživanjima FBiH</strong> istražno bušenje je zakonski geološko istraživanje.</p>
        <p>To znači da firma koja ga izvodi treba odobrenje za obavljanje registrovane djelatnosti u oblasti geologije, a program, projekt i završni izvještaj o izvedenim radovima rade kvalifikovane osobe.</p>
        <p>Nadležno je <strong>Federalno ministarstvo energije, rudarstva i industrije</strong>.</p>
        <p class="note">Za obični kućni bunar ovo se u praksi ne primjenjuje. Za sve što ide uz vodne akte — primjenjuje se.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head">
      <h2>Republika Srpska</h2>
      <span class="tag">Zakon o vodama RS</span>
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(1.5rem,4vw,3rem);align-items:start" class="split">
      <div class="prose">
        <p>Ista logika: zahvatanje podzemne vode bunarom na vlastitom zemljištu za sopstvene potrebe je <strong>opšta upotreba vode</strong> i ne traži dozvolu.</p>
        <h3>Ko izdaje</h3>
        <p><strong>JU „Vode Srpske“</strong>, Odjeljenje za vodopravne akte.</p>
        <h3>Kako ide postupak</h3>
        <p>Postupak se vodi po posebnim pravilima iz Zakona o vodama, uz supsidijarnu primjenu Zakona o opštem upravnom postupku, u četiri koraka:</p>
        <ol>
          <li>Podnošenje zahtjeva s pratećom dokumentacijom</li>
          <li>Utvrđivanje potpunosti zahtjeva</li>
          <li>Rješavanje po zahtjevu</li>
          <li>Eventualni žalbeni postupak, s upravnim sporom kao krajnjim sredstvom</li>
        </ol>
        <h3>Obrasci</h3>
        <p><strong>VS-1</strong> — vodna saglasnost na projektnu dokumentaciju za izgradnju novih, rekonstrukciju ili uklanjanje postojećih objekata.</p>
        <p><strong>VS-2</strong> — vodna saglasnost za izgradnju novih ili proširenje postojećih izvorišta vodosnabdijevanja.</p>
        <p>Vodna saglasnost se pribavlja <strong>prije građevinske dozvole</strong> i sastavni je dio dokumentacije uz zahtjev za njeno izdavanje.</p>
      </div>
      <div class="panel panel-accent">
        <h3>Komercijalna ili komunalna upotreba</h3>
        <p>Za snabdijevanje naselja, prodaju vode ili veće zahvate u RS ide puni paket:</p>
        <ul style="padding-left:1.1rem;display:flex;flex-direction:column;gap:.5rem">
          <li>Detaljna hidrogeološka studija <strong>prije</strong> bušenja</li>
          <li>Studija ekonomske opravdanosti</li>
          <li>Koncesioni ugovor s nadležnim ministarstvom</li>
          <li>Završni izvještaj o bunaru s proračunom kapaciteta</li>
          <li>Ovjera rezervi i eksploataciona koncesija prije početka zahvatanja</li>
        </ul>
        <p class="note">Ovo je ozbiljan i dugotrajan postupak. Ako idete u tom smjeru, javite se rano — redoslijed koraka je bitan.</p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>Brčko distrikt</h2>
      <span class="tag">Vlastiti propisi</span>
    </div>
    <div class="prose">
      <p>Brčko distrikt ima <strong>vlastiti pravni režim</strong>, odvojen i od Federacije i od Republike Srpske. Načelo opće upotrebe za kućne potrebe je isto, ali se nadležnost i obrasci razlikuju.</p>
      <div class="call warn">
        <span class="k">Budite oprezni s informacijama</span>
        <p>Za Brčko vam nećemo prepisivati federalne ili republičke propise kao da vrijede — jer ne vrijede. Ako je vaš predmet u Distriktu i traži papire, uputit ćemo vas direktno na nadležni organ Distrikta umjesto da nagađamo.</p>
      </div>
    </div>
  </div>
</section>

${photoBand('garnitura-gusjenicar', 'Za kućni bunar na vlastitom zemljištu papiri ne trebaju. Za navodnjavanje i posao — trebaju.')}

<section class="band band-deep">
  <div class="wrap">
    <div class="sec-head">
      <h2>Šta mi tu radimo</h2>
      <span class="tag">Bez naplate savjeta</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1.25rem">
      <div class="call" style="background:var(--deep-2)">
        <span class="k">01 — Utvrdimo režim</span>
        <p style="color:var(--deep-ink)">Na osnovu namjene i lokacije kažemo vam da li ste u općoj upotrebi ili ne. To je besplatno i traje jedan telefonski razgovor.</p>
      </div>
      <div class="call" style="background:var(--deep-2)">
        <span class="k">02 — Uputimo na organ</span>
        <p style="color:var(--deep-ink)">Ako papiri trebaju, kažemo vam koji akt, koji obrazac i koji organ — po entitetu u kojem se parcela nalazi.</p>
      </div>
      <div class="call" style="background:var(--deep-2)">
        <span class="k">03 — Povežemo s ekipom</span>
        <p style="color:var(--deep-ink)">Za predmete koji traže projektnu dokumentaciju povezujemo vas s firmama koje imaju registrovanu geološku djelatnost i mogu potpisati ono što se traži.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap-narrow">
    <div class="sec-head"><h2>Česta pitanja o dozvolama</h2></div>
    ${faqBlock(faq)}
    <div class="call warn" style="margin-top:1.5rem">
      <span class="k">Napomena</span>
      <p>Ovaj tekst je informativni pregled, ne pravni savjet. Propisi se mijenjaju, a kantonalni i lokalni sloj može dodati uslove. Za obavezujuću informaciju obratite se nadležnom organu ili nas pozovite pa ćemo vas uputiti.</p>
    </div>
  </div>
</section>

${ctaBand('Recite nam namjenu — kažemo vam trebaju li papiri.')}
`

  return page({
    title: 'Dozvola za bunar u BiH — kada treba',
    description: 'Za kućni bunar na vlastitom zemljištu dozvola ne treba. Kada ipak treba, koji vodni akti i ko ih izdaje — FBiH, RS i Brčko distrikt.',
    path: '/dozvole/',
    body,
    schema: [faqSchema(faq)],
  })
}
