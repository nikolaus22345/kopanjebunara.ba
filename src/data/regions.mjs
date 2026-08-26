/* ==========================================================================
   REGIONS — the content moat.

   Every entry drives one page at /podrucja/{slug}/ with real geology,
   realistic depth expectation and a price band. This is what beats the
   templated competitor city pages (see KNOWLEDGE-BASE.md §6.1, §8.4).

   Figures are INDICATIVE ranges for typical household wells, derived from
   the aquifer type and published BiH market pricing. They are framed on
   the page as expectations, never guarantees. Refine them as our partners
   report real job data back — that is how this moat gets deeper.

   Fields:
     slug     URL segment
     name     nominative ("Bijeljina")
     loc      locative — "bušenje bunara u ___" ("Bijeljini")
     entity   'FBiH' | 'RS' | 'BD'  → drives the permit block
     type     'aluvij' | 'krs' | 'flis' | 'mjesovito'
     area     the wider geographic unit, shown as an eyebrow
     depth    [min, max] metres, typical household well
     price    [min, max] KM per running metre, turnkey
     odds     'visoka' | 'dobra' | 'srednja' | 'promjenjiva'
     tier     1 | 2 | 3 — build/priority order
     intro    2–3 sentences, specific to this place
     water    what the water is typically like here
     near     slugs of neighbouring areas
   ========================================================================== */

export const aquiferTypes = {
  aluvij: {
    label: 'Međuzrnska (aluvijalna) izdan',
    short: 'Aluvij',
    badge: 'good',
    headline: 'Najpovoljniji teren u BiH za bunar.',
    body: [
      'Voda se ovdje nalazi u šljunku i pijesku koje su rijeke nanosile hiljadama godina. Takva izdan se zove međuzrnska: voda popunjava prostor između zrna i kreće se ravnomjerno kroz cijeli sloj. Za bušenje je to najbolji mogući scenarij.',
      'Zato što je vodonosni sloj rasprostranjen, a ne u izoliranim kanalima, bušotina gotovo uvijek pogodi vodu. Dubine su male, bušenje je brzo, koristi se rotaciona metoda s isplakom, a cijena po metru je najniža u zemlji.',
      'Ograničenje nije količina nego kvalitet. Plitke aluvijalne izdani su izložene onome što se događa na površini — poljoprivredi, septičkim jamama, stočarstvu. Zato su ispravno izveden tampon i analiza vode ovdje važniji nego bilo gdje drugdje.',
    ],
    strata: [
      { n: 'Humus i oranica', h: 6, c: '#4A3B2A', dark: true },
      { n: 'Glina i glinoviti prah', h: 22, c: '#8A7359', dark: true },
      { n: 'Sitni pijesak', h: 17, c: '#B49A6E', dark: false },
      { n: 'Krupni pijesak', h: 15, c: '#C8A96B', dark: false },
      { n: 'Šljunak — vodonosni sloj', h: 26, c: '#8FA9A5', dark: false, water: true },
      { n: 'Glinena podina', h: 14, c: '#6E6152', dark: true },
    ],
  },

  krs: {
    label: 'Karstno-pukotinska izdan',
    short: 'Krš',
    badge: 'mid',
    headline: 'Voda ima, ali putuje kanalima — ne ravnomjerno.',
    body: [
      'U kršu voda ne stoji u sloju nego teče kroz pukotine i kanale koje je milionima godina razgrađivala u vapnencu. To znači da dvije bušotine udaljene dvadeset metara mogu dati potpuno različit rezultat: jedna prazna, druga s izdašnošću kakvu aluvij nikad ne daje.',
      'Bušenje ide sporije i skuplje. Koristi se pneumatski udarni čekić (DTH), jer rotacija s isplakom u zbijenom vapnencu ne napreduje. Dubine su veće — sto metara je ovdje uobičajeno, a strojevi na ovom tržištu idu i preko tri stotine.',
      'Kvalitet karstne vode je prirodno najbolji u BiH, jer je filtrirana kroz stijenu i hladna cijele godine. Ista ta otvorenost kanala je i njena slabost: zagađenje s površine putuje brzo i daleko, bez prirodnog prečišćavanja koje pijesak pruža.',
      'Zbog svega toga u kršu se ne buši napamet. Prethodni pregled terena, podaci o okolnim bušotinama i pozicija u odnosu na poznate pravce oticanja odlučuju hoće li posao uspjeti.',
    ],
    strata: [
      { n: 'Crvenica (terra rossa)', h: 6, c: '#8C4A2F', dark: true },
      { n: 'Površinski raspadnuti vapnenac', h: 20, c: '#B8BEBA', dark: false },
      { n: 'Zbijeni vapnenac', h: 28, c: '#A2AAA6', dark: false },
      { n: 'Raspucala zona — vodonosni kanali', h: 24, c: '#7FA8A1', dark: false, water: true },
      { n: 'Dolomitna podina', h: 22, c: '#8E9995', dark: false },
    ],
  },

  flis: {
    label: 'Slabo vodopropusne naslage (fliš, lapor, glina)',
    short: 'Fliš i lapor',
    badge: 'hard',
    headline: 'Najzahtjevniji teren. Ovdje se najviše ljudi razočara.',
    body: [
      'Fliš je izmjena pješčara, lapora i glinaca — stijena koja vodu slabo propušta i slabo predaje. Nema pravog vodonosnog sloja u smislu u kojem ga ima Posavina; ima pukotinskih zona i visećih izdani koje daju ograničenu, ponekad sezonski promjenjivu količinu.',
      'Praktična posljedica: buši se dublje za manje vode, a cijena po metru je viša jer se ulazi u stijenu. Bušotina koja u Semberiji staje na dvadeset metara ovdje često ide na šezdeset ili više.',
      'To ne znači da bunar nema smisla. Za domaćinstvo, zalijevanje vrta i pomoćne potrebe često je sasvim dovoljan. Ali obećavati veliku izdašnost na ovakvom terenu je neozbiljno, i to je razlika između izvođača koji hoće posao i izvođača koji hoće zadovoljnog kupca.',
      'Naš pristup je jednostavan: na ovakvom terenu vam to kažemo unaprijed, prije nego bilo ko izađe na parcelu.',
    ],
    strata: [
      { n: 'Humus', h: 5, c: '#4A3B2A', dark: true },
      { n: 'Deluvijalna glina', h: 24, c: '#7E6E58', dark: true },
      { n: 'Lapor', h: 26, c: '#78827A', dark: false },
      { n: 'Fliš — pješčar i glinac', h: 28, c: '#616D66', dark: true },
      { n: 'Pukotinska zona — slaba izdašnost', h: 17, c: '#7E9B96', dark: false, water: true },
    ],
  },

  mjesovito: {
    label: 'Riječna terasa u brdskom okruženju',
    short: 'Mješovit teren',
    badge: 'mid',
    headline: 'Dvije mogućnosti u istoj bušotini.',
    body: [
      'Ovo su doline i terase rijeka usječene u brdovito zaleđe. U samoj dolini ispod površine leži šljunak riječne terase — plitak, izdašan i jeftin za doseći. Nekoliko stotina metara dalje, na padini, tog sloja više nema i buši se u stijenu.',
      'Zbog toga je ovdje lokacija parcele važnija nego bilo gdje. Razlika između bušotine u dolini i bušotine na koti iznad nje zna biti trostruka u dubini i dvostruka u cijeni.',
      'Ako terasa ne da dovoljno vode, ide se dublje u pukotinsku zonu ispod nje. Ta druga izdan je slabija ali stabilnija i manje osjetljiva na sušu i na površinsko zagađenje.',
      'Prva stvar koju pitamo na ovakvom terenu je gdje tačno stoji kuća u odnosu na rijeku i koliko je duboko išao najbliži postojeći bunar.',
    ],
    strata: [
      { n: 'Humus', h: 6, c: '#4A3B2A', dark: true },
      { n: 'Terasna glina', h: 19, c: '#87745C', dark: true },
      { n: 'Šljunak terase — vodonosni', h: 21, c: '#8FA9A5', dark: false, water: true },
      { n: 'Lapor i glinac', h: 28, c: '#6F7A73', dark: true },
      { n: 'Pukotinska zona u podini', h: 26, c: '#7E9B96', dark: false, water: true },
    ],
  },
}

export const regions = [
  /* ---------------- Tier 1 — aluvij, visoka uspješnost ---------------- */
  {
    slug: 'bijeljina', name: 'Bijeljina', loc: 'Bijeljini', entity: 'RS', type: 'aluvij',
    area: 'Semberija', depth: [15, 40], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Semberija je najzahvalniji teren za bunar u cijeloj Bosni i Hercegovini. Debeli nanosi Drine i Save ostavili su široku i izdašnu šljunkovitu izdan koja se doseže već na petnaestak metara, a rijetko traži više od četrdeset.',
    water: 'Voda je obično mekana i obilna, ali s povišenim željezom i manganom — otud narančasti talog na sanitariji. To se rješava filterom, nije razlog za brigu, ali je razlog da se uradi analiza prije nego se voda pusti u kuću.',
    near: ['brcko', 'zvornik', 'modrica'],
  },
  {
    slug: 'banja-luka', name: 'Banja Luka', loc: 'Banjoj Luci', entity: 'RS', type: 'aluvij',
    area: 'Dolina Vrbasa', depth: [20, 50], price: [60, 95], odds: 'visoka', tier: 1,
    intro: 'Grad leži na naslagama Vrbasa, i u ravničarskom dijelu — prema Lijevču, Trnu i Laktašima — izdan je plitka i pouzdana. Prema jugu, kako se ulazi u brdsko zaleđe, teren se mijenja i dubine rastu.',
    water: 'U dolinskom dijelu voda je kvalitetna, s uobičajenim željezom. Bliže gradskoj zoni treba računati na uticaj urbane površine, pa je bakteriološka analiza obavezna prije upotrebe za piće.',
    near: ['laktasi', 'gradiska', 'prnjavor'],
  },
  {
    slug: 'gradiska', name: 'Gradiška', loc: 'Gradišci', entity: 'RS', type: 'aluvij',
    area: 'Lijevče polje', depth: [12, 35], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Lijevče polje je udžbenički primjer aluvijalne izdani: ravno, savsko, s krupnim šljunkom na maloj dubini. Bunari se ovdje rade brzo i gotovo bez neizvjesnosti, što je i razlog zašto je ovo jedan od najaktivnijih terena za navodnjavanje u Republici Srpskoj.',
    water: 'Očekivano visok sadržaj željeza. Zbog intenzivne poljoprivrede u polju, nitrate treba provjeriti — to je ovdje relevantniji pokazatelj od svega ostalog.',
    near: ['laktasi', 'srbac', 'kozarska-dubica'],
  },
  {
    slug: 'laktasi', name: 'Laktaši', loc: 'Laktašima', entity: 'RS', type: 'aluvij',
    area: 'Lijevče polje', depth: [12, 35], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Laktaši sjede na istoj savsko-vrbaskoj izdani kao i Gradiška, s plitkim i izdašnim šljunkom. Područje je poznato i po termalnoj vodi na većim dubinama, ali za obično vodosnabdijevanje se ne ide ni blizu tako duboko.',
    water: 'Kvalitetna i obilna, uz uobičajeno željezo. Ako se u toku bušenja naiđe na toplu vodu, to mijenja i namjenu i pravni režim bušotine — javite nam odmah.',
    near: ['gradiska', 'banja-luka', 'srbac'],
  },
  {
    slug: 'srbac', name: 'Srbac', loc: 'Srpcu', entity: 'RS', type: 'aluvij',
    area: 'Lijevče polje / ušće Vrbasa', depth: [10, 30], price: [50, 80], odds: 'visoka', tier: 1,
    intro: 'Na samom ušću Vrbasa u Savu izdan je plitka koliko uopšte može biti. Bunari od deset do dvadeset metara su ovdje pravilo, a ne izuzetak, i cijena posla je među najnižima u zemlji.',
    water: 'Vrlo plitka izdan znači i vrlo brz uticaj površine. Tampon mora biti izveden kako treba, inače se u bunaru završi ono što padne na njivu.',
    near: ['gradiska', 'laktasi', 'derventa'],
  },
  {
    slug: 'brcko', name: 'Brčko', loc: 'Brčkom', entity: 'BD', type: 'aluvij',
    area: 'Posavina', depth: [12, 35], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Posavska ravnica oko Brčkog ima široku savsku izdan na maloj dubini. Uz to, Brčko distrikt ima vlastiti pravni režim — različit i od Federacije i od Republike Srpske — pa se papirologija za sve što prelazi kućnu upotrebu rješava lokalno.',
    water: 'Obilna, s izraženim željezom i manganom. Poljoprivredno okruženje traži provjeru nitrata.',
    near: ['bijeljina', 'modrica', 'gradacac'],
  },
  {
    slug: 'prijedor', name: 'Prijedor', loc: 'Prijedoru', entity: 'RS', type: 'aluvij',
    area: 'Dolina Sane', depth: [20, 45], price: [60, 90], odds: 'visoka', tier: 1,
    intro: 'Dolina Sane daje dobru aluvijalnu izdan, a šire prijedorsko područje je jedno od aktivnijih za bušenje u Krajini. Prema Kozari se teren podiže i dubine osjetno rastu.',
    water: 'Dobra izdašnost i kvalitet u dolini. Na područjima s rudarskom prošlošću vrijedi uraditi širu hemijsku analizu, ne samo osnovnu.',
    near: ['kozarska-dubica', 'novi-grad', 'sanski-most'],
  },
  {
    slug: 'doboj', name: 'Doboj', loc: 'Doboju', entity: 'RS', type: 'mjesovito',
    area: 'Ušće Spreče u Bosnu', depth: [15, 45], price: [60, 95], odds: 'dobra', tier: 1,
    intro: 'Doboj stoji na spoju dolina Bosne i Spreče, i to se vidi u rezultatima bušenja. U samoj dolini terasni šljunak daje vodu plitko i pouzdano; već na prvim padinama iznad grada ulazi se u lapor i dubine se udvostruče.',
    water: 'U dolini dobra, uz uobičajeno željezo. Na padinama slabija izdašnost i veća sezonska promjenjivost.',
    near: ['derventa', 'modrica', 'gracanica'],
  },
  {
    slug: 'derventa', name: 'Derventa', loc: 'Derventi', entity: 'RS', type: 'aluvij',
    area: 'Posavina / dolina Ukrine', depth: [15, 40], price: [60, 90], odds: 'visoka', tier: 1,
    intro: 'Dolina Ukrine i prelaz prema savskoj ravnici daju solidnu i predvidivu izdan. Prema sjeveru, bliže Savi, dubine padaju; prema jugu i brdima rastu.',
    water: 'Uobičajena za posavski aluvij — dobra izdašnost, željezo prisutno.',
    near: ['modrica', 'srbac', 'prnjavor'],
  },
  {
    slug: 'prnjavor', name: 'Prnjavor', loc: 'Prnjavoru', entity: 'RS', type: 'mjesovito',
    area: 'Dolina Ukrine', depth: [20, 50], price: [65, 100], odds: 'dobra', tier: 1,
    intro: 'Prnjavorsko područje je prelazna zona: dolinski dijelovi imaju terasni šljunak, a brdsko zaleđe laporovitu podlogu. Postoje i poznate arteške bušotine u široj okolini, što je razlog zašto se ovdje često pita za dublje bunare.',
    water: 'U dolini dobra. Dublje bušotine mogu dati vodu pod pritiskom — ako se to desi, mijenja se i način opremanja bunara.',
    near: ['derventa', 'banja-luka', 'teslic'],
  },
  {
    slug: 'modrica', name: 'Modriča', loc: 'Modriči', entity: 'RS', type: 'aluvij',
    area: 'Posavina', depth: [12, 35], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Posavska ravnica uz Bosnu i Savu, s plitkom i širokom izdani. Jedan od terena gdje se bunar završi za jedan do dva dana.',
    water: 'Obilna, izraženo željezo. Nitrate provjeriti zbog okolne poljoprivrede.',
    near: ['samac', 'doboj', 'brcko'],
  },
  {
    slug: 'samac', name: 'Šamac', loc: 'Šamcu', entity: 'RS', type: 'aluvij',
    area: 'Posavina', depth: [10, 30], price: [50, 80], odds: 'visoka', tier: 1,
    intro: 'Uz samu Savu izdan je najplića u zemlji. Bunari od deset do dvadeset metara pokrivaju kućne potrebe bez problema, a i navodnjavanje manjih parcela.',
    water: 'Plitko znači i ranjivo. Ovdje je pravilno zabrtvljena bušotina razlika između zdrave vode i vode iz njive.',
    near: ['modrica', 'orasje', 'odzak'],
  },
  {
    slug: 'zvornik', name: 'Zvornik', loc: 'Zvorniku', entity: 'RS', type: 'mjesovito',
    area: 'Dolina Drine', depth: [15, 45], price: [60, 95], odds: 'dobra', tier: 1,
    intro: 'Uz Drinu terasni nanosi daju dobru vodu na maloj dubini. Kako se odmiče od rijeke u brdsko zaleđe, teren prelazi u stijenu i uslovi se brzo mijenjaju.',
    water: 'Uz rijeku kvalitetna i izdašna. Na padinama promjenjiva i sezonski osjetljiva.',
    near: ['bijeljina', 'tuzla', 'zivinice'],
  },
  {
    slug: 'kozarska-dubica', name: 'Kozarska Dubica', loc: 'Kozarskoj Dubici', entity: 'RS', type: 'aluvij',
    area: 'Posavina / dolina Une', depth: [12, 35], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Ravnica uz Unu i Savu s plitkom šljunkovitom izdani. Predvidiv teren i kratki rokovi.',
    water: 'Dobra izdašnost, prisutno željezo.',
    near: ['prijedor', 'novi-grad', 'gradiska'],
  },
  {
    slug: 'novi-grad', name: 'Novi Grad', loc: 'Novom Gradu', entity: 'RS', type: 'aluvij',
    area: 'Ušće Sane u Unu', depth: [15, 40], price: [60, 90], odds: 'visoka', tier: 1,
    intro: 'Spoj Une i Sane daje širok aluvijalni nanos i pouzdanu izdan na maloj do srednjoj dubini.',
    water: 'Kvalitetna, uz uobičajeno željezo za riječni aluvij.',
    near: ['prijedor', 'kozarska-dubica', 'bosanska-krupa'],
  },
  {
    slug: 'orasje', name: 'Orašje', loc: 'Orašju', entity: 'FBiH', type: 'aluvij',
    area: 'Posavina', depth: [10, 30], price: [50, 80], odds: 'visoka', tier: 1,
    intro: 'Najsjeverniji dio Federacije, uz samu Savu, s najplićom izdani u zemlji. Teren je toliko predvidiv da je glavno pitanje obično ne hoće li biti vode, nego koliko je duboko treba tražiti da bi bila čista.',
    water: 'Vrlo plitka izdan i intenzivna poljoprivreda — nitrati i bakteriologija su ovdje ključna provjera, ne željezo.',
    near: ['odzak', 'samac', 'gradacac'],
  },
  {
    slug: 'odzak', name: 'Odžak', loc: 'Odžaku', entity: 'FBiH', type: 'aluvij',
    area: 'Posavina', depth: [12, 32], price: [55, 85], odds: 'visoka', tier: 1,
    intro: 'Posavska ravnica uz Bosnu, plitka i izdašna izdan, kratki poslovi i niska cijena po metru.',
    water: 'Obilna, uz željezo. Poljoprivredno okruženje traži provjeru nitrata.',
    near: ['orasje', 'samac', 'modrica'],
  },
  {
    slug: 'gradacac', name: 'Gradačac', loc: 'Gradačcu', entity: 'FBiH', type: 'aluvij',
    area: 'Posavina', depth: [15, 40], price: [60, 90], odds: 'visoka', tier: 1,
    intro: 'Voćarski kraj s velikom potražnjom za vodom za navodnjavanje. Aluvijalna izdan je dobra, a upravo zbog navodnjavanja ovdje se najčešće ulazi u režim koji traži dozvolu.',
    water: 'Dobra izdašnost. Za navodnjavanje voćnjaka bitna je stabilnost izdašnosti u julu i augustu, ne samo trenutni rezultat pumpanja.',
    near: ['brcko', 'gracanica', 'orasje'],
  },
  {
    slug: 'gracanica', name: 'Gračanica', loc: 'Gračanici', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Spreče', depth: [20, 50], price: [65, 100], odds: 'dobra', tier: 1,
    intro: 'Sprečko polje ima dobru terasnu izdan, ali je okruženo brdima gdje se uslovi naglo mijenjaju. Pozicija parcele u odnosu na polje odlučuje o dubini.',
    water: 'U polju dobra. Bliže brdima slabija i sezonski promjenjiva.',
    near: ['doboj', 'lukavac', 'gradacac'],
  },
  {
    slug: 'zivinice', name: 'Živinice', loc: 'Živinicama', entity: 'FBiH', type: 'mjesovito',
    area: 'Sprečko polje', depth: [20, 55], price: [70, 105], odds: 'dobra', tier: 1,
    intro: 'Sprečko polje daje solidnu terasnu izdan, ali šire tuzlansko područje ima rudarsku prošlost koja se odražava i na podzemne vode i na stabilnost terena.',
    water: 'U polju upotrebljiva i dovoljna. Zbog rudarskog naslijeđa preporučujemo širu hemijsku analizu, ne samo osnovni paket.',
    near: ['tuzla', 'lukavac', 'gracanica'],
  },
  {
    slug: 'lukavac', name: 'Lukavac', loc: 'Lukavcu', entity: 'FBiH', type: 'mjesovito',
    area: 'Sprečko polje', depth: [20, 50], price: [65, 100], odds: 'dobra', tier: 1,
    intro: 'Dolina Spreče s terasnim šljunkom ispod površine. Industrijsko okruženje čini analizu vode ovdje obaveznim korakom, a ne opcijom.',
    water: 'Izdašnost obično zadovoljavajuća. Kvalitet provjeriti šire nego drugdje.',
    near: ['tuzla', 'zivinice', 'gracanica'],
  },

  /* ---------------- Tier 2 — velika populacija, mješovito ---------------- */
  {
    slug: 'tuzla', name: 'Tuzla', loc: 'Tuzli', entity: 'FBiH', type: 'flis',
    area: 'Tuzlanski basen', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Tuzlanski basen je geološki poseban slučaj. Ispod grada su laporovite i slane naslage, a stoljetna eksploatacija slane vode ostavila je slijeganje terena koje i danas traje. To je jedan od rijetkih terena u BiH gdje lokacija bušotine ima i pravnu i sigurnosnu dimenziju.',
    water: 'Moguća povišena mineralizacija i slanost, posebno u centralnoj zoni. Analiza vode ovdje nije formalnost — ona odlučuje da li je bunar uopšte upotrebljiv za ono što ste planirali.',
    near: ['lukavac', 'zivinice', 'gracanica'],
  },
  {
    slug: 'sarajevo', name: 'Sarajevo', loc: 'Sarajevu', entity: 'FBiH', type: 'mjesovito',
    area: 'Sarajevsko polje', depth: [25, 80], price: [85, 135], odds: 'promjenjiva', tier: 2,
    intro: 'Sarajevsko polje — Ilidža, Hrasnica, Butmir, Rajlovac — leži na aluvijalnim naslagama Željeznice i Bosne i tu izdan postoji i koristi se. Padine i viši dijelovi grada su druga priča: tu se ulazi u lapor i fliš, buši se duplo dublje za manje vode.',
    water: 'U polju dobra izdašnost. Gusta urbana i industrijska površina znači da je bakteriološka i hemijska analiza obavezna prije bilo kakve upotrebe za piće.',
    near: ['visoko', 'konjic', 'zenica'],
  },
  {
    slug: 'zenica', name: 'Zenica', loc: 'Zenici', entity: 'FBiH', type: 'flis',
    area: 'Zeničko-dobojski basen', depth: [30, 80], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Zenički basen je pretežno laporovit i fliški — teren na kojem se buši dublje nego što ljudi očekuju. U samoj dolini Bosne postoji terasni šljunak koji spašava situaciju, ali izvan njega treba računati na stijenu.',
    water: 'Industrijsko naslijeđe grada traži širu hemijsku analizu. Izdašnost izvan doline obično skromna, dovoljna za domaćinstvo.',
    near: ['kakanj', 'visoko', 'travnik'],
  },
  {
    slug: 'visoko', name: 'Visoko', loc: 'Visokom', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Bosne', depth: [25, 65], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Dolina Bosne kod Visokog ima terasni šljunak koji daje vodu razumno plitko. Brdski dio općine je laporovit i tu se dubine i cijena osjetno mijenjaju.',
    water: 'U dolini zadovoljavajuća. Na padinama slabija i sezonski promjenjiva.',
    near: ['kakanj', 'sarajevo', 'zenica'],
  },
  {
    slug: 'kakanj', name: 'Kakanj', loc: 'Kaknju', entity: 'FBiH', type: 'flis',
    area: 'Zeničko-dobojski basen', depth: [30, 80], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Ugljonosni basen s laporovitim naslagama. Buši se u stijenu, dubine su veće, a izdašnost obično dovoljna za domaćinstvo ali ne i za ozbiljno navodnjavanje.',
    water: 'Rudarsko okruženje — preporučena šira hemijska analiza.',
    near: ['zenica', 'visoko', 'busovaca'],
  },
  {
    slug: 'travnik', name: 'Travnik', loc: 'Travniku', entity: 'FBiH', type: 'mjesovito',
    area: 'Lašvanska dolina', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Lašvanska dolina ima terasni nanos uz rijeku, a Vlašić iznad nje karbonatni masiv s jakim izvorima. Rezultat bušenja ovdje presudno zavisi od toga da li je parcela u dolini ili na padini.',
    water: 'U dolini dobra. Bliže planinskom masivu moguć i vrlo kvalitetan pukotinski dotok, ali je pozicija odlučujuća.',
    near: ['vitez', 'busovaca', 'bugojno'],
  },
  {
    slug: 'vitez', name: 'Vitez', loc: 'Vitezu', entity: 'FBiH', type: 'mjesovito',
    area: 'Lašvanska dolina', depth: [20, 60], price: [75, 120], odds: 'srednja', tier: 2,
    intro: 'Uska dolina Lašve s terasnim šljunkom uz samu rijeku. Izvan tog pojasa vrlo brzo se ulazi u laporovitu podlogu.',
    water: 'Uz rijeku zadovoljavajuća. Industrijska zona traži provjeru kvaliteta.',
    near: ['travnik', 'busovaca', 'zenica'],
  },
  {
    slug: 'busovaca', name: 'Busovača', loc: 'Busovači', entity: 'FBiH', type: 'flis',
    area: 'Središnja Bosna', depth: [30, 75], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Brdovito središnjobosansko područje s laporovitom i fliškom podlogom. Bunari za domaćinstvo su izvedivi, ali se ide dublje nego u dolinama.',
    water: 'Umjerena izdašnost, obično stabilna kroz godinu.',
    near: ['vitez', 'kakanj', 'travnik'],
  },
  {
    slug: 'bugojno', name: 'Bugojno', loc: 'Bugojnu', entity: 'FBiH', type: 'mjesovito',
    area: 'Skopaljska dolina', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Gornji tok Vrbasa i skopaljska kotlina daju terasnu izdan u dolinskom dijelu, dok okolna brda traže bušenje u stijenu.',
    water: 'U dolini dobra i hladna. Na padinama promjenjiva.',
    near: ['travnik', 'jajce', 'livno'],
  },
  {
    slug: 'jajce', name: 'Jajce', loc: 'Jajcu', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Vrbasa i Plive', depth: [25, 75], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Spoj Plive i Vrbasa, uz karbonatni masiv u zaleđu. Teren gdje se u dolini nalazi terasni šljunak, a više se ulazi u vapnenac s pukotinskom vodom.',
    water: 'Vrlo kvalitetna kad se pogodi pukotinska zona. Pozicija odlučuje.',
    near: ['bugojno', 'mrkonjic-grad', 'travnik'],
  },
  {
    slug: 'mrkonjic-grad', name: 'Mrkonjić Grad', loc: 'Mrkonjić Gradu', entity: 'RS', type: 'krs',
    area: 'Zapadna Bosna', depth: [35, 100], price: [95, 150], odds: 'promjenjiva', tier: 2,
    intro: 'Karbonatni teren zapadne Bosne — voda je u pukotinama, ne u sloju. Buši se dublje, sporije i s pneumatskim čekićem.',
    water: 'Odlična kada se pogodi, hladna cijele godine. Neizvjesnost je stvarna i mi je ne skrivamo.',
    near: ['jajce', 'banja-luka', 'drvar'],
  },
  {
    slug: 'teslic', name: 'Teslić', loc: 'Tesliću', entity: 'RS', type: 'mjesovito',
    area: 'Dolina Usore', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Dolina Usore s terasnim nanosom, okružena brdskim terenom. Područje je poznato po termomineralnoj vodi u Vrućici, što povremeno stvara pogrešna očekivanja o tome šta se dobija običnim bušenjem.',
    water: 'U dolini upotrebljiva i dovoljna. Termalna voda je poseban režim i posebna dubina — to nije isto što i kućni bunar.',
    near: ['doboj', 'prnjavor', 'banja-luka'],
  },
  {
    slug: 'bihac', name: 'Bihać', loc: 'Bihaću', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Une', depth: [20, 60], price: [75, 120], odds: 'dobra', tier: 2,
    intro: 'Bihaćko polje ima aluvijalni nanos Une, dok je šire područje izrazito karstno. To je klasičan primjer terena gdje se dvije potpuno različite geologije dodiruju na par kilometara razdaljine.',
    water: 'U polju vrlo kvalitetna. Karstno zaleđe znači da zagađenje putuje brzo — zaštitna zona oko bunara je ovdje važnija nego drugdje.',
    near: ['bosanska-krupa', 'cazin', 'sanski-most'],
  },
  {
    slug: 'cazin', name: 'Cazin', loc: 'Cazinu', entity: 'FBiH', type: 'mjesovito',
    area: 'Cazinska krajina', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Brdovita Cazinska krajina s mješovitom podlogom. Dubine su veće nego u dolinama Une i Sane, a rezultat zavisi od toga koliko je parcela udaljena od vodotoka.',
    water: 'Umjerena izdašnost, obično dobrog kvaliteta.',
    near: ['velika-kladusa', 'bihac', 'bosanska-krupa'],
  },
  {
    slug: 'velika-kladusa', name: 'Velika Kladuša', loc: 'Velikoj Kladuši', entity: 'FBiH', type: 'mjesovito',
    area: 'Cazinska krajina', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Sjeverozapadni ugao zemlje, brdovit i s promjenjivom podlogom. Bunar za domaćinstvo je izvediv gotovo svugdje, ali se dubina teško procjenjuje bez podataka o okolnim bušotinama.',
    water: 'Umjerena izdašnost. Poljoprivredno okruženje traži provjeru nitrata.',
    near: ['cazin', 'bihac'],
  },
  {
    slug: 'bosanska-krupa', name: 'Bosanska Krupa', loc: 'Bosanskoj Krupi', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Une', depth: [20, 60], price: [75, 120], odds: 'dobra', tier: 2,
    intro: 'Uz Unu terasni nanos daje vodu razumno plitko; izvan doline teren se podiže i prelazi u karbonatnu podlogu.',
    water: 'Kvalitetna uz rijeku. Karstno zaleđe traži pažnju na zaštitnu zonu.',
    near: ['bihac', 'cazin', 'novi-grad'],
  },
  {
    slug: 'sanski-most', name: 'Sanski Most', loc: 'Sanskom Mostu', entity: 'FBiH', type: 'aluvij',
    area: 'Dolina Sane', depth: [15, 45], price: [65, 100], odds: 'dobra', tier: 2,
    intro: 'Dolina Sane s dobrim aluvijalnim nanosom. Jedan od povoljnijih terena u Krajini, s predvidivim dubinama u samoj dolini.',
    water: 'Dobra izdašnost i kvalitet, uz uobičajeno željezo.',
    near: ['prijedor', 'bihac', 'kljuc'],
  },
  {
    slug: 'kljuc', name: 'Ključ', loc: 'Ključu', entity: 'FBiH', type: 'mjesovito',
    area: 'Gornji tok Sane', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Gornji tok Sane u karbonatnom okruženju. U dolini se voda nalazi razumno plitko, na padinama se ulazi u vapnenac.',
    water: 'Kvalitetna i hladna, izdašnost zavisi od pozicije.',
    near: ['sanski-most', 'mrkonjic-grad', 'bihac'],
  },
  {
    slug: 'konjic', name: 'Konjic', loc: 'Konjicu', entity: 'FBiH', type: 'mjesovito',
    area: 'Gornja Neretva', depth: [30, 85], price: [90, 140], odds: 'srednja', tier: 2,
    intro: 'Dolina gornje Neretve, uska i stisnuta između masiva. Terasni nanos postoji uz rijeku, ali je pojas uzak — nekoliko stotina metara od Neretve već se buši u stijenu.',
    water: 'Uz rijeku vrlo kvalitetna. Izvan doline neizvjesno i skupo.',
    near: ['jablanica', 'sarajevo', 'mostar'],
  },
  {
    slug: 'jablanica', name: 'Jablanica', loc: 'Jablanici', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Neretve', depth: [30, 85], price: [90, 140], odds: 'srednja', tier: 2,
    intro: 'Uska dolina Neretve između karbonatnih masiva. Teren gdje pozicija parcele u odnosu na rijeku određuje gotovo sve.',
    water: 'Kvalitetna, hladna. Izdašnost jako zavisi od lokacije.',
    near: ['konjic', 'mostar', 'jajce'],
  },
  {
    slug: 'gorazde', name: 'Goražde', loc: 'Goraždu', entity: 'FBiH', type: 'mjesovito',
    area: 'Dolina Drine', depth: [25, 70], price: [80, 125], odds: 'srednja', tier: 2,
    intro: 'Dolina Drine s terasnim nanosom uz rijeku i brdskim zaleđem koje brzo mijenja uslove.',
    water: 'Uz rijeku dobra i kvalitetna. Na padinama slabija.',
    near: ['foca', 'sarajevo', 'visegrad'],
  },
  {
    slug: 'foca', name: 'Foča', loc: 'Foči', entity: 'RS', type: 'mjesovito',
    area: 'Ušće Ćehotine u Drinu', depth: [25, 75], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Spoj Drine i Ćehotine, okružen karbonatnim masivima. U dolini terasni nanos, više pukotinska voda u vapnencu.',
    water: 'Vrlo kvalitetna kad se pogodi. Pozicija odlučuje.',
    near: ['gorazde', 'visegrad', 'nevesinje'],
  },
  {
    slug: 'visegrad', name: 'Višegrad', loc: 'Višegradu', entity: 'RS', type: 'mjesovito',
    area: 'Dolina Drine', depth: [25, 75], price: [85, 130], odds: 'srednja', tier: 2,
    intro: 'Uska dolina Drine u karbonatnom okruženju. Terasni pojas je ograničen, a izvan njega se buši u stijenu.',
    water: 'Kvalitetna i hladna, izdašnost promjenjiva.',
    near: ['gorazde', 'foca'],
  },

  /* ---------------- Tier 3 — krš, visok račun i visok rizik ---------------- */
  {
    slug: 'mostar', name: 'Mostar', loc: 'Mostaru', entity: 'FBiH', type: 'krs',
    area: 'Hercegovački krš', depth: [40, 120], price: [110, 180], odds: 'promjenjiva', tier: 3,
    intro: 'Mostarsko područje je karstno u punom smislu: voda se kreće kroz kanale u vapnencu, a ne kroz sloj. Uz samu Neretvu postoji uzak aluvijalni pojas gdje je situacija povoljnija, ali izvan njega bušenje je ozbiljan tehnički zahvat s realnom neizvjesnošću.',
    water: 'Karstna voda je prirodno najbolja u zemlji — hladna, čista, bez tretmana. Ali kanali provode zagađenje brzo i daleko, pa se zaštita okoline bunara ovdje ne preskače.',
    near: ['citluk', 'capljina', 'siroki-brijeg'],
  },
  {
    slug: 'capljina', name: 'Čapljina', loc: 'Čapljini', entity: 'FBiH', type: 'krs',
    area: 'Donja Neretva', depth: [25, 80], price: [95, 155], odds: 'srednja', tier: 3,
    intro: 'Donja Neretva ima široko polje s aluvijalnim naslagama preko karstne podloge — povoljnije od okolnog krša i jedan od boljih hercegovačkih terena. Izvan polja vrijede sva pravila krša.',
    water: 'U polju dobra izdašnost. Blizina mora i niska nadmorska visina znače da vrijedi provjeriti i mineralizaciju.',
    near: ['stolac', 'mostar', 'ljubuski'],
  },
  {
    slug: 'ljubuski', name: 'Ljubuški', loc: 'Ljubuškom', entity: 'FBiH', type: 'krs',
    area: 'Zapadna Hercegovina', depth: [40, 120], price: [110, 180], odds: 'promjenjiva', tier: 3,
    intro: 'Zapadnohercegovački krš s vapnenačkom podlogom i jakim ali neravnomjerno raspoređenim pukotinskim tokovima. Potražnja je velika zbog vinogradarstva i navodnjavanja.',
    water: 'Izuzetnog kvaliteta kad se pogodi. Za navodnjavanje je ključno da izdašnost izdrži juli i august, a ne samo probno pumpanje.',
    near: ['siroki-brijeg', 'citluk', 'capljina'],
  },
  {
    slug: 'siroki-brijeg', name: 'Široki Brijeg', loc: 'Širokom Brijegu', entity: 'FBiH', type: 'krs',
    area: 'Zapadna Hercegovina', depth: [50, 150], price: [115, 190], odds: 'promjenjiva', tier: 3,
    intro: 'Jedan od zahtjevnijih terena u zemlji. Debele vapnenačke naslage znače duboko bušenje pneumatskim čekićem, a raspored pukotinskih zona je neujednačen.',
    water: 'Vrhunska kad se pogodi. Ovdje je predbušna procjena terena razlika između uspjeha i skupe rupe.',
    near: ['ljubuski', 'mostar', 'citluk'],
  },
  {
    slug: 'citluk', name: 'Čitluk', loc: 'Čitluku', entity: 'FBiH', type: 'krs',
    area: 'Brotnjo', depth: [50, 140], price: [115, 185], odds: 'promjenjiva', tier: 3,
    intro: 'Brotnjo je vinogradarska visoravan na vapnencu. Potreba za vodom za navodnjavanje je stalna, a teren je jedan od najzahtjevnijih — bez površinskih tokova i s dubokim nivoom podzemne vode.',
    water: 'Odlična kvaliteta. Ključno pitanje nije kvalitet nego da li ima dovoljno i da li izdrži kroz sezonu.',
    near: ['mostar', 'ljubuski', 'siroki-brijeg'],
  },
  {
    slug: 'stolac', name: 'Stolac', loc: 'Stocu', entity: 'FBiH', type: 'krs',
    area: 'Istočna Hercegovina', depth: [40, 120], price: [110, 180], odds: 'promjenjiva', tier: 3,
    intro: 'Karstni teren s poljima i jakim izvorima u okolini. Kao i drugdje u Hercegovini, rezultat presudno zavisi od toga da li bušotina pogodi provodnu zonu.',
    water: 'Izvrsna kvaliteta, hladna cijele godine.',
    near: ['capljina', 'mostar', 'nevesinje'],
  },
  {
    slug: 'trebinje', name: 'Trebinje', loc: 'Trebinju', entity: 'RS', type: 'krs',
    area: 'Istočna Hercegovina', depth: [50, 150], price: [115, 190], odds: 'promjenjiva', tier: 3,
    intro: 'Duboki krš istočne Hercegovine. Trebinjsko polje ima povoljnije uslove od okolne visoravni, ali generalno je ovo teren gdje se buši duboko i gdje predbušna procjena vrijedi svaki uloženi sat.',
    water: 'Karstna voda vrhunskog kvaliteta. Ljetni pad nivoa je stvaran i treba ga uračunati u dubinu bušotine.',
    near: ['bileca', 'stolac', 'nevesinje'],
  },
  {
    slug: 'bileca', name: 'Bileća', loc: 'Bileći', entity: 'RS', type: 'krs',
    area: 'Istočna Hercegovina', depth: [60, 160], price: [120, 195], odds: 'promjenjiva', tier: 3,
    intro: 'Jedan od najdubljih karstnih terena u zemlji. Nivo podzemne vode je nizak, a bušenje ozbiljna investicija koja se ne pokreće bez prethodne procjene.',
    water: 'Odlična kvaliteta. Izražena sezonska oscilacija nivoa.',
    near: ['trebinje', 'gacko', 'nevesinje'],
  },
  {
    slug: 'gacko', name: 'Gacko', loc: 'Gacku', entity: 'RS', type: 'krs',
    area: 'Gatačko polje', depth: [40, 120], price: [110, 180], odds: 'srednja', tier: 3,
    intro: 'Gatačko polje je karstno polje s naslagama preko vapnenačke podloge, što ga čini povoljnijim od okolne visoravni. Rudarsko i energetsko okruženje traži pažljiviju analizu vode.',
    water: 'U polju upotrebljiva izdašnost. Šira hemijska analiza je ovdje preporuka, ne formalnost.',
    near: ['bileca', 'nevesinje', 'trebinje'],
  },
  {
    slug: 'nevesinje', name: 'Nevesinje', loc: 'Nevesinju', entity: 'RS', type: 'krs',
    area: 'Nevesinjsko polje', depth: [50, 140], price: [115, 185], odds: 'promjenjiva', tier: 3,
    intro: 'Nevesinjsko polje ima kvartarne naslage preko krša, a okolna visoravan je čisti vapnenac. Razlika u rezultatu između polja i visoravni je dramatična.',
    water: 'Vrlo kvalitetna. Sezonske oscilacije nivoa su izražene.',
    near: ['gacko', 'bileca', 'stolac'],
  },
  {
    slug: 'livno', name: 'Livno', loc: 'Livnu', entity: 'FBiH', type: 'krs',
    area: 'Livanjsko polje', depth: [30, 100], price: [100, 165], odds: 'srednja', tier: 3,
    intro: 'Livanjsko polje je najveće krško polje u BiH, s naslagama preko karstne podloge i visokim nivoom podzemne vode u dijelovima polja. To ga čini znatno povoljnijim od okolnog planinskog krša.',
    water: 'U polju dobra izdašnost i kvalitet. Na rubovima polja uslovi se brzo mijenjaju.',
    near: ['tomislavgrad', 'glamoc', 'kupres'],
  },
  {
    slug: 'tomislavgrad', name: 'Tomislavgrad', loc: 'Tomislavgradu', entity: 'FBiH', type: 'krs',
    area: 'Duvanjsko polje', depth: [40, 120], price: [110, 180], odds: 'srednja', tier: 3,
    intro: 'Duvanjsko polje s kvartarnim naslagama preko vapnenca. U polju su uslovi znatno bolji nego na okolnim padinama.',
    water: 'Kvalitetna, sezonski promjenjiva izdašnost.',
    near: ['livno', 'kupres', 'siroki-brijeg'],
  },
  {
    slug: 'kupres', name: 'Kupres', loc: 'Kupresu', entity: 'FBiH', type: 'krs',
    area: 'Kupreško polje', depth: [40, 120], price: [110, 180], odds: 'srednja', tier: 3,
    intro: 'Visoko krško polje s naslagama preko vapnenca. Visoka nadmorska visina znači i kraću sezonu bušenja — zimi se ovdje ne radi.',
    water: 'Vrlo kvalitetna i hladna.',
    near: ['livno', 'tomislavgrad', 'bugojno'],
  },
  {
    slug: 'glamoc', name: 'Glamoč', loc: 'Glamoču', entity: 'FBiH', type: 'krs',
    area: 'Glamočko polje', depth: [40, 120], price: [110, 180], odds: 'srednja', tier: 3,
    intro: 'Glamočko polje, jedno od velikih krških polja zapadne Bosne, s naslagama preko karstne podloge.',
    water: 'Kvalitetna, sa sezonskim oscilacijama.',
    near: ['livno', 'drvar', 'kupres'],
  },
  {
    slug: 'drvar', name: 'Drvar', loc: 'Drvaru', entity: 'FBiH', type: 'krs',
    area: 'Zapadna Bosna', depth: [35, 110], price: [105, 170], odds: 'srednja', tier: 3,
    intro: 'Karstni teren zapadne Bosne uz dolinu Unca. U dolini su uslovi povoljniji, na visoravni vrijede sva pravila krša.',
    water: 'Izvrsna kvaliteta, hladna cijele godine.',
    near: ['glamoc', 'mrkonjic-grad', 'bihac'],
  },
]

export const regionBySlug = Object.fromEntries(regions.map(r => [r.slug, r]))

export const oddsMeta = {
  visoka:      { label: 'Visoka uspješnost', badge: 'good', note: 'Bušotina gotovo uvijek nađe vodu u očekivanom rasponu.' },
  dobra:       { label: 'Dobra uspješnost', badge: 'good', note: 'Uspješnost je visoka u dolinskom dijelu, niža na padinama.' },
  srednja:     { label: 'Srednja uspješnost', badge: 'mid', note: 'Rezultat zavisi od pozicije parcele — procjena prije bušenja se isplati.' },
  promjenjiva: { label: 'Promjenjiva uspješnost', badge: 'hard', note: 'Krš je nepredvidiv. Procjena terena prije bušenja ovdje nije opcija nego uslov.' },
}
