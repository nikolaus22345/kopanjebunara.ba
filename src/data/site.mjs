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
  name: 'Kopanje Bunara',
  nameLead: 'Kopanje',       // rendered in ink
  nameAccent: 'Bunara',      // rendered in accent colour
  tagline: 'Bušenje bunara u BiH',

  // --- contact ----------------------------------------------------------
  /* No phone number on the site (owner's decision, Oct 2026): every lead
     comes through the inquiry form, which collects far more than a call
     and lands in the owner's inbox. There is no public email either; the
     info@ mailbox was never created.

     Web3Forms forwards each submission to the inbox the access key was
     created for. The key is public by design (it can only send TO that
     inbox), so it is fine in the HTML. Get one at web3forms.com by
     entering the destination email; it arrives by email.
     The build refuses to ship without it, because a dead form on a site
     with no phone number would lose every lead. */
  form: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: '',
  },
  responseTime: 'Javljamo se isti ili sljedeći radni dan.',

  // --- deployment -------------------------------------------------------
  // Canonical origin. Feeds canonical URLs, sitemap.xml, llms.txt, Open
  // Graph tags and schema.org.
  //
  // MUST match the Primary domain set in Vercel. Vercel is serving www as
  // primary (the apex 308-redirects to it), so www is canonical here too.
  // When these disagree every canonical tag points at a redirect, which is
  // exactly the mismatch that stalls indexing.
  origin: 'https://www.kopanjebunara.ba',

  // --- legal entity (fill in when the firm is registered) ---------------
  legalName: '',                       // popuni kad firma bude registrovana
  address: 'Adresa firme bb',
  city: 'Grad',
  postalCode: '00000',
  country: 'BA',
  vat: '',                             // ID/PDV broj

  // --- cijena -----------------------------------------------------------
  /* ONE source of truth for price. Change `from` and it propagates to the
     home page, the estimator, every region page, /cijena/, the FAQs and
     llms.txt.

     Set from real quotes collected from drillers in Sep 2026, not from
     classified ads. The earlier 50–190 KM/m bands came from Daibau and OLX
     listings, which turned out to describe drilling-only jobs (no casing,
     no gravel pack, no development) or to be simply out of date. Every
     driller actually willing to take our work quoted 200 KM/m or more,
     mostly flat regardless of terrain. Publishing a floor is honest and it
     is also the only real number anyone in this market publishes. */
  pricing: {
    from: 200,                    // KM per running metre, turnkey — a FLOOR
    currency: 'KM',
  },

  // --- analytics & verification -----------------------------------------
  // Google Search Console verification. Emitted as a <meta> on every page.
  googleSiteVerification: 'B8xVjz_2WG_MG23zOVojJJlMdD57t8ncLOWk7ZL8gL4',

  // GA4 measurement ID. Empty string disables analytics entirely.
  ga4: 'G-979V3F3CS7',

  // GA4 only fires on hostnames ending in this, so localhost previews and
  // Vercel preview deployments don't pollute the property with fake traffic.
  // Set to '' to fire everywhere (Google's snippet verbatim).
  analyticsHost: 'kopanjebunara.ba',   // matches www.* too, via the suffix check

  // --- positioning ------------------------------------------------------
  // Honest description of what we are. See KNOWLEDGE-BASE.md §7.3 —
  // we must NOT present ourselves as the drilling contractor.
  role: 'Bušenje bunara s provjerenim ekipama širom Bosne i Hercegovine. Dubinu i cijenu znate unaprijed.',
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
