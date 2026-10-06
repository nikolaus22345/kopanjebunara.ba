import { site } from '../data/site.mjs'
import { regions } from '../data/regions.mjs'
import { esc } from '../layout.mjs'

/* ==========================================================================
   The inquiry form: the only way to reach us. No phone number on the site.

   Five short steps instead of one long form, because a phone visitor
   finishes a sequence of easy taps far more often than a wall of fields,
   and every step collects something the drilling crew actually needs.

   Delivery: Web3Forms (site.form) forwards the submission to the owner's
   inbox. The inbox address never appears in the page; only the access key,
   which is public by design. Field names are written as readable Bosnian
   labels because they become the rows of the email.

   Without JavaScript all steps show at once and the form posts natively,
   then redirects to /hvala/. With JavaScript it steps, validates per step,
   prefills the municipality from ?opcina=, attaches where the visitor came
   from and the estimate for their municipality, and submits with fetch.
   ========================================================================== */

const radios = (name, opts, { required = false, cols = 2 } = {}) => `
  <div class="choice" style="--cols:${cols}" role="radiogroup">
    ${opts.map((o, i) => `<label class="opt"><input type="radio" name="${esc(name)}" value="${esc(o)}"${required && i === 0 ? ' required' : ''}><span>${esc(o)}</span></label>`).join('\n    ')}
  </div>`

export function upitForm() {
  const opts = [...regions].sort((a, b) => a.name.localeCompare(b.name, 'bs'))
  const origin = site.origin.replace(/\/$/, '')

  return `
<form class="upit" id="upit-form" action="${esc(site.form.endpoint)}" method="POST" novalidate data-rate="${site.pricing.from}">
  <input type="hidden" name="access_key" value="${esc(site.form.accessKey)}">
  <input type="hidden" name="subject" value="Novi upit za bunar">
  <input type="hidden" name="from_name" value="${esc(site.name)}">
  <input type="hidden" name="redirect" value="${origin}/hvala/">
  <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">

  <!-- filled in by main.js; plain posts simply leave them empty -->
  <input type="hidden" name="Okvirna procjena" value="">
  <input type="hidden" name="Poslano sa stranice" value="">
  <input type="hidden" name="Prva posjećena stranica" value="">
  <input type="hidden" name="Došao sa" value="">
  <input type="hidden" name="Kampanja (UTM)" value="">
  <input type="hidden" name="Uređaj" value="">

  <div class="upit-progress" aria-hidden="true"><i></i></div>
  <p class="upit-count" aria-live="polite"><span data-step-now>1</span> od <span data-step-total>5</span></p>

  <fieldset class="step" data-step="1">
    <legend>Gdje je parcela?</legend>
    <div class="field">
      <label for="u-opcina">Općina</label>
      <select id="u-opcina" name="Općina" required>
        <option value="">Odaberite općinu</option>
        ${opts.map(r => `<option value="${esc(r.name)}" data-slug="${r.slug}" data-depth="${r.depth[0]}-${r.depth[1]}" data-entity="${esc(r.entity)}">${esc(r.name)}</option>`).join('\n        ')}
        <option value="Druga općina">Druga općina</option>
      </select>
    </div>
    <div class="field">
      <label for="u-mjesto">Naselje ili mjesto</label>
      <input id="u-mjesto" name="Naselje" type="text" autocomplete="address-level3" placeholder="npr. Vitina">
      <p class="hint">Tačna adresa ne treba. Naselje je dovoljno za procjenu terena.</p>
    </div>
  </fieldset>

  <fieldset class="step" data-step="2">
    <legend>Za šta vam treba voda?</legend>
    ${radios('Namjena', ['Kuća i domaćinstvo', 'Vrt i okućnica', 'Navodnjavanje', 'Stoka i farma', 'Poslovni objekat', 'Toplotna pumpa (geosonda)', 'Stari bunar ne radi'], { required: true })}
    <div class="row2">
      <div class="field">
        <label for="u-osobe">Koliko ljudi živi u kući</label>
        <select id="u-osobe" name="Broj ukućana">
          <option value="">Ne odnosi se</option><option>1-2</option><option>3-4</option><option>5 i više</option>
        </select>
      </div>
      <div class="field">
        <label for="u-vodovod">Imate li gradski vodovod</label>
        <select id="u-vodovod" name="Gradski vodovod">
          <option value="">Odaberite</option><option>Nemamo</option><option>Imamo, ali je skup ili nestaje</option><option>Imamo</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label for="u-povrsina">Površina za navodnjavanje</label>
      <input id="u-povrsina" name="Površina za navodnjavanje" type="text" placeholder="npr. 5 dunuma, ako navodnjavate">
    </div>
  </fieldset>

  <fieldset class="step" data-step="3">
    <legend>Kakva je parcela?</legend>
    <p class="q">Može li kamion doći do mjesta bušenja?</p>
    ${radios('Pristup za kamion', ['Da, bez problema', 'Uzak ili strm prilaz', 'Ne znam'], { cols: 3 })}
    <p class="q">Kakav je teren?</p>
    ${radios('Teren', ['Ravan', 'Blagi nagib', 'Strm ili kamenit'], { cols: 3 })}
    <div class="row2">
      <div class="field">
        <label for="u-struja">Ima li struje na parceli</label>
        <select id="u-struja" name="Struja na parceli"><option value="">Odaberite</option><option>Ima</option><option>Nema</option><option>Ne znam</option></select>
      </div>
      <div class="field">
        <label for="u-septicka">Septička jama bliže od 30 m</label>
        <select id="u-septicka" name="Septička jama blizu"><option value="">Odaberite</option><option>Ne</option><option>Da</option><option>Ne znam</option></select>
      </div>
    </div>
    <div class="field">
      <label for="u-susjed">Koliko je dubok najbliži bunar</label>
      <input id="u-susjed" name="Dubina susjednog bunara" type="text" placeholder="npr. 35 m kod komšije, ako znate">
      <p class="hint">Ovo je najbolji besplatan pokazatelj koliko duboko ćete ići.</p>
    </div>
  </fieldset>

  <fieldset class="step" data-step="4">
    <legend>Kada i koliko?</legend>
    <p class="q">Kada biste htjeli bušiti?</p>
    ${radios('Kada', ['Što prije', 'U naredna 1-3 mjeseca', 'Ove godine', 'Samo se raspitujem'])}
    <p class="q">Okvirni budžet</p>
    ${radios('Budžet', ['Do 5.000 KM', '5.000-10.000 KM', '10.000-20.000 KM', 'Preko 20.000 KM', 'Ne znam još'], { cols: 2 })}
    <p class="estimate" data-estimate hidden></p>
    <div class="field">
      <label for="u-izvor">Kako ste čuli za nas</label>
      <select id="u-izvor" name="Kako je saznao"><option value="">Odaberite</option><option>Google</option><option>Preporuka</option><option>Facebook ili Instagram</option><option>Drugo</option></select>
    </div>
  </fieldset>

  <fieldset class="step" data-step="5">
    <legend>Kome da se javimo?</legend>
    <div class="row2">
      <div class="field">
        <label for="u-ime">Ime i prezime</label>
        <input id="u-ime" name="Ime i prezime" type="text" required autocomplete="name">
      </div>
      <div class="field">
        <label for="u-tel">Broj telefona</label>
        <input id="u-tel" name="Telefon" type="tel" required autocomplete="tel" inputmode="tel" placeholder="06X XXX XXX" pattern="[0-9+ ()/-]{6,}">
      </div>
    </div>
    <div class="field">
      <label for="u-email">Email</label>
      <input id="u-email" name="email" type="email" autocomplete="email" placeholder="Nije obavezno">
    </div>
    <p class="q">Kako vam je najlakše da se javimo?</p>
    ${radios('Kontakt preko', ['Poziv', 'Viber', 'WhatsApp', 'Email'], { cols: 4 })}
    <div class="field">
      <label for="u-vrijeme">Kada vam najviše odgovara</label>
      <select id="u-vrijeme" name="Najbolje vrijeme"><option value="">Bilo kada</option><option>Prijepodne</option><option>Poslijepodne</option><option>Navečer</option><option>Vikendom</option></select>
    </div>
    <div class="field">
      <label for="u-poruka">Još nešto što trebamo znati</label>
      <textarea id="u-poruka" name="Poruka" rows="3" placeholder="Stari bunar, rokovi, posebni uslovi..."></textarea>
    </div>
    <label class="consent"><input type="checkbox" name="Saglasnost" value="Da" required><span>Slažem se da se moji podaci koriste samo za odgovor na ovaj upit i dogovor posla.</span></label>
  </fieldset>

  <p class="upit-error" role="alert" hidden></p>

  <div class="upit-nav">
    <button type="button" class="btn btn-ghost" data-prev hidden>Nazad</button>
    <button type="button" class="btn btn-primary btn-lg" data-next>Dalje</button>
    <button type="submit" class="btn btn-primary btn-lg" data-submit>Pošalji upit</button>
  </div>
  <p class="note">Besplatno i bez obaveze. Javljamo se isti ili sljedeći radni dan.</p>
</form>

<div class="upit-done" id="upit-done" hidden tabindex="-1">
  <p class="eyebrow">Upit je poslan</p>
  <h2>Hvala. Javljamo se uskoro.</h2>
  <p class="lede">Pogledat ćemo teren u vašoj općini i javiti vam se s okvirnom dubinom i cijenom. Najčešće isti ili sljedeći radni dan.</p>
</div>`
}
