# Media — what's on the site, and what needs clearing

The originals live outside the repo (`~/Downloads/kopanje bunara`). Only optimised derivatives are committed. Regenerate with:

```bash
node media.mjs
```

Optionally pass a different source folder: `node media.mjs "D:\fotografije"`.

That script writes `public/assets/photo/`, `public/assets/video/` and `src/data/media.mjs` (the manifest the site reads for real dimensions). `build.mjs` never touches `public/assets`, so rebuilding the site won't undo it.

**58 MB of source became 7.3 MB of web media.** Photos are WebP + JPG at two widths with correct `width`/`height` so nothing shifts on load. Videos are trimmed to their strongest 13–14 seconds, re-encoded at CRF 31, and **stripped of audio**. Nothing video-related downloads until a visitor clicks a poster.

---

## ⚠️ Rights — read before launch

This is the part I can't fix in code, so I'm putting it plainly rather than burying it.

**Every file supplied came from somewhere else.** The filenames record it: `naslovna-shutterstock_2493162477.jpg` is a Shutterstock asset; `334206040_585957576514124_…` is a Facebook CDN filename; `images (1).jpg` are Google Images downloads; and all six videos are `ssstik.io_@…` — TikTok downloads from four named accounts:

- `@busenje.bunara.geo`
- `@busenje.bunara.im`
- `@busenjebunarajokic`
- `@stanimir.djukic7`

Those are **other well-drilling businesses**, some of them direct competitors in this exact market. Two risks, and the second is the one that actually costs money:

1. **Copyright.** Using this material commercially without a licence is infringement. Shutterstock in particular actively enforces.
2. **Credibility.** These accounts have followers who are your customers. Footage presented as "our work" that a visitor recognises from a competitor's TikTok does more damage than having no video at all. [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md) §8.7 identified authentic own-rig footage as the single biggest trust differentiator in this trade — borrowed footage inverts that.

**What I'd do, in order:**

1. **Get your partners filming.** A phone is enough. One drilling day yields more usable footage than everything here, it's free, it's yours, and it's genuinely better because it's real. The plumbing is already built — drop files in, adjust the lists in `media.mjs`, run it.
2. **Licence the one image worth paying for.** `isplaka-blizu` (the Shutterstock mud-flush close-up) is the most on-message shot in the set — it illustrates *rotaciono bušenje s isplakom* precisely. A standard licence is roughly €10–30. Cheapest problem on this list to make go away.
3. **Or ask the TikTok accounts.** Some will say yes for a credit and a link. Costs a message.

Until then, treat the current media as **placeholder that happens to look finished**. Swapping it is a one-line change per file.

---

## Photos — used (8)

| Slug | Used on | Note |
|---|---|---|
| `garnitura-brdo` | Home hero, postupak step 3 | Best of the set — a real Balkan hillside, mud flushing out. Facebook-sourced. |
| `garnitura-njiva` | Region pages (aluvij), home strip | Truck rig on flat ground with settling pit. |
| `isplaka-blizu` | Home, /busenje-bunara/, /usluge/analiza-vode/ | **Shutterstock — licence this one.** |
| `kolone-cijevi` | Home, /cijena/, postupak step 4, /usluge/pumpe-i-hidrofori/ | Casing and couplings. Highest-resolution source (1600×1200). |
| `garnitura-gusjenicar` | Region pages (fliš), /busenje-bunara/, postupak step 2 | Tracked rig beside a building — matches the "difficult access" copy exactly. |
| `garnitura-velika` | Region pages (krš), /busenje-bunara/, /usluge/geotermalne-sonde/ | Large rig on stony hillside. |
| `garnitura-sumrak` | Home strip | Rig at dusk, no branding. Low-res (365 px) so used small only. |
| `svrdlo-dvoriste` | Home strip, postupak step 6, /usluge/ciscenje-bunara/ | Auger in a garden — the household scenario. |

## Photos — rejected (5)

| File | Why |
|---|---|
| `About_Well_Drilling_Blog_with_Keller.jpg` | **"KELLER WELL DRILLING" and phone (810) 227-2550 clearly legible on the truck.** A US competitor's branding on a Bosnian site. |
| `images (1).jpg` | US jobsite — Tyvek house wrap and a partially readable US phone number on the rig. |
| `mag-ponuda-cijevi-za-bunar-7-o_*.jpg` | A supplier's branded product catalogue sheet. Someone else's marketing collateral, and its blue palette fights the site's teal. |
| `busenje-bunara-srbija.jpg` | Well cross-section labelled in **English** ("Water Table", "Well Screen"), low resolution. |
| `hidrogeology-expertise-03-srb.png` | Another company's branded infographic, **Serbian** spellings (*arterski*, *pesak*, *cevovod* vs *arteški*, *pijesak*, *cjevovod*) and a cartoon style that clashes badly. |

**Replaced with something better:** the last two were both well cross-sections, so rather than borrow one I built [`presjekBunara()`](src/components/media.mjs) — our own diagram, in Bosnian, using the site's own palette, labelling exactly the components the pricing page itemises. It appears on the home page, `/cijena/` and `/busenje-bunara/`. It's fully ours, it themes with dark mode, and no competitor has anything like it.

## Videos — used (3)

| Slug | Trim | Size | Note |
|---|---|---|---|
| `busenje-isplaka` | 0–13 s | 2.1 MB | Mud-flush drilling. |
| `busenje-stijena` | 10–24 s | 1.8 MB | Dust plume off a tracked rig — the 46 s original was mostly dead air. |
| `voda-iz-busotine` | 20–34 s | 0.9 MB | Water gushing from the hose. The emotional payoff; the first 20 s of the source were just the rig standing still. |

## Videos — held back (3)

All three have **burned-in captions** naming Serbian locations and job data:

- `…busenje.bunara.geo_…030028` — "Mravska 95m 250l/min"
- `…busenje.bunara.im_…961816` — "Provo 30m"
- `…busenje.bunara.im_…084001` — "Bunar Mladenovac 120m **12000e**"

Three reasons not to ship them: the places are in Serbia, the numbers are someone else's job records, and that last one advertises a **€12,000 price** that flatly contradicts our own pricing page. I deliberately did **not** crop the captions out — obscuring another company's markings is worse than not using the clip.

If you get permission from the accounts, the first two are good footage and I can add them in minutes.

---

## Adding your own media

**Photos.** Drop them in the source folder, then add an entry to `PHOTOS` in [`media.mjs`](media.mjs):

```js
{ src: 'IMG_4821.jpg', slug: 'bunar-bijeljina-01', alt: 'Opis za čitače ekrana i SEO' },
```

**Videos.** Add to `VIDEOS`, picking the best 12–15 seconds:

```js
{ src: 'VID_0093.mp4', slug: 'bunar-gradiska', start: 8, dur: 14, poster: 12,
  title: 'Bušenje u Gradišci', note: 'Kratak opis ispod videa.' },
```

`start`/`dur` trim the clip; `poster` is a timestamp in the **original** timeline. Then `node media.mjs && node build.mjs`.

Where photos appear is controlled by small maps near the top of the page modules — `TYPE_PHOTO` in `src/pages/regions.mjs`, `STEP_PHOTO` in `src/pages/service.mjs`, `SERVICE_PHOTO` in `src/pages/usluge.mjs`.

**Worth knowing:** region pages pick their photo by terrain type, so a Posavina page and a Herzegovina page never show the same rig on the same ground. Once you have real photos from actual jobs, giving individual municipalities their own shot is the single strongest version of this — a customer in Bijeljina seeing a rig in Bijeljina is worth more than any stock image.
