/* ==========================================================================
   SITE CONFIG — edit this file, rebuild, done.
   ==========================================================================

   >>> KAD DOBIJEŠ BROJ / WHEN YOU HAVE YOUR NUMBER: change `phone` below. <<<
   Everything on the site (header, hero, call bar, footer, schema.org,
   contact page, region pages) reads from this one object.
   ========================================================================== */

export const site = {
  // --- brand ------------------------------------------------------------
  // Placeholder brand. Change `name` + `nameAccent` and the logo follows.
  name: 'Do Vode',
  nameLead: 'Do',            // rendered in ink
  nameAccent: 'Vode',        // rendered in accent colour
  tagline: 'Bušenje bunara u BiH',

  // --- contact — REPLACE THESE ------------------------------------------
  phone: '+387 63 050 308',            // display form
  phoneHref: '+38763050308',           // tel: form, no spaces
  viberHref: '+38763050308',           // usually same number
  whatsappHref: '38763050308',         // wa.me form, no plus
  email: 'info@dovode.ba',
  hours: 'Pon–Sub, 07:00–20:00',

  // --- deployment -------------------------------------------------------
  // Set this to your real domain before you go live (used in canonical
  // URLs, sitemap.xml, Open Graph tags and schema.org).
  origin: 'https://www.dovode.ba',

  // --- legal entity (fill in when the firm is registered) ---------------
  legalName: 'Do Vode d.o.o.',
  address: 'Adresa firme bb',
  city: 'Grad',
  postalCode: '00000',
  country: 'BA',
  vat: '',                             // ID/PDV broj

  // --- positioning ------------------------------------------------------
  // Honest description of what we are. See KNOWLEDGE-BASE.md §7.3 —
  // we must NOT present ourselves as the drilling contractor.
  role: 'Povezujemo vas s provjerenim bušačkim ekipama širom Bosne i Hercegovine.',
}

export const nav = [
  { href: '/busenje-bunara/', label: 'Bušenje bunara' },
  { href: '/cijena/', label: 'Cijena' },
  { href: '/dozvole/', label: 'Dozvole' },
  { href: '/postupak/', label: 'Postupak' },
  { href: '/podrucja/', label: 'Područja' },
  { href: '/usluge/', label: 'Usluge' },
  { href: '/kontakt/', label: 'Kontakt' },
]

export const footerNav = [
  {
    title: 'Usluge',
    links: [
      { href: '/busenje-bunara/', label: 'Bušenje bunara' },
      { href: '/usluge/geotermalne-sonde/', label: 'Geotermalne sonde' },
      { href: '/usluge/pumpe-i-hidrofori/', label: 'Pumpe i hidrofori' },
      { href: '/usluge/analiza-vode/', label: 'Analiza vode' },
      { href: '/usluge/ciscenje-bunara/', label: 'Čišćenje i regeneracija' },
    ],
  },
  {
    title: 'Prije nego naručite',
    links: [
      { href: '/cijena/', label: 'Cijena po metru' },
      { href: '/dozvole/', label: 'Treba li dozvola' },
      { href: '/postupak/', label: 'Kako ide postupak' },
      { href: '/pitanja/', label: 'Česta pitanja' },
    ],
  },
  {
    title: 'Područja',
    links: [
      { href: '/podrucja/', label: 'Sva područja' },
      { href: '/podrucja/bijeljina/', label: 'Bijeljina' },
      { href: '/podrucja/banja-luka/', label: 'Banja Luka' },
      { href: '/podrucja/tuzla/', label: 'Tuzla' },
      { href: '/podrucja/sarajevo/', label: 'Sarajevo' },
      { href: '/podrucja/mostar/', label: 'Mostar' },
    ],
  },
]
