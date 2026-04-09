# FIRA Website — Developer Notes & Suggestions

A running list of things to revisit, improve, or wire up before going live.
Each item is tagged with a rough effort level: 🟢 Quick / 🟡 Medium / 🔴 Involved.

---

## 1. Contact Form Backend 🟢
**File:** `kontak.html` — `<form id="contact-form" action="#">`

The form currently has no real submission endpoint.
**Fastest fix:** Sign up at https://formspree.io (free tier), create a form,
then replace `action="#"` with your Formspree URL:
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```
No server required. Alternatively use EmailJS for client-side delivery.

---

## 2. Google Maps Embed 🟢
**File:** `kontak.html` — `.map-split__map`

There's a placeholder comment where the Google Maps iframe should go.
1. Go to maps.google.com → search the office address
2. Click Share → Embed a map → copy the `<iframe>` HTML
3. Paste it inside `.map-split__map`, replacing the placeholder `<p>` tag

---

## 3. Real Logo File 🟢
**File:** `assets/logo.svg`

The current SVG is a placeholder using Arial Black — it approximates the brand
but won't match exactly. Replace it with the actual exported Fira logo SVG
from Figma. The nav uses `color: white` and the footer uses `color: #EDE8DC`
(cream) — if your logo SVG uses `fill="currentColor"` it will adapt automatically.

---

## 4. Product & Service Images 🟡
**Files:** `assets/products/`, `assets/services/`, `assets/images/`

Upload real images and add their paths to `data/products.json`:
```json
{ "id": "atap-001", "image": "assets/products/atap-spandek.jpg", ... }
```
Recommended sizes:
- Product cards: **800×800 px** (square)
- Service cards: **800×500 px** (16:10)
- About hero background: **1920×1080 px** (dark industrial photo)
- Split section photos (Latar Belakang, Visi, Misi): **900×700 px** minimum

---

## 5. CMS Integration (Scale-up path) 🔴
**File:** `js/cms.js` — `fetchData()` function

Currently reads from `data/products.json`. To move to a real CMS:

**Option A — Contentful (recommended)**
```js
const res = await fetch(
  `https://cdn.contentful.com/spaces/SPACE_ID/entries?content_type=product&access_token=TOKEN`
);
```
Map `data.items` → same shape as products.json categories.

**Option B — Sanity**
```js
const res = await fetch(
  `https://YOUR_PROJECT.api.sanity.io/v2021-10-21/data/query/production?query=*[_type=="product"]`
);
```

**Option C — Notion API** (if your team already uses Notion)
Use the Notion API to read a products database and map rows to the JSON schema.

No other code changes are needed — just swap out `fetchData()`.

---

## 6. Mobile Navigation Hamburger 🟡
**File:** `js/components.js` — `renderNav()`

On mobile the three nav links currently stack. Consider adding a hamburger
button that toggles a full-screen menu. The toggle logic can live in `main.js`.
CSS already has a media query at `600px` — add `.navbar--open` styles there.

---

## 7. Scroll Animations 🟢
**File:** `js/main.js` — IntersectionObserver already wired up

Elements with `data-animate` attribute get `.is-visible` added when scrolled
into view. Add CSS transitions to make them fade/slide in:
```css
[data-animate] { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
[data-animate].is-visible { opacity: 1; transform: none; }
```
Add `data-animate` to any section you want animated.

---

## 8. SEO & Open Graph 🟡
All four pages have basic `<meta name="description">` tags.
Before going live, add to each page:
```html
<meta property="og:image" content="https://yourdomain.com/assets/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com/page.html">
<link rel="canonical" href="https://yourdomain.com/page.html">
```
Also add a `sitemap.xml` and `robots.txt` to the root.

---

## 9. Certification Images 🟢
**File:** `data/products.json` — `certifications[]`

Upload scanned/exported cert images to `assets/certs/` and update the `image`
field in products.json. The cert grid on both index.html and about.html will
pick them up automatically via cms.js.

---

## 10. Product Detail Page (Future) 🔴
Currently clicking a product card does nothing. Consider adding a
`produk-detail.html` template page that reads a `?id=atap-001` URL parameter
and loads the matching product from products.json. This gives you a clean URL
pattern to later hand off to a CMS.

---

## 11. Color Accessibility 🟢
Check WCAG AA contrast ratios before launch:
- Yellow `#F5C518` on cream `#EDE8DC` — likely **fails** AA — keep yellow
  decorative only (not for body text)
- White on blue `#2563EB` — **passes** AA ✓
- Dark text on cream — **passes** AA ✓

Free checker: https://webaim.org/resources/contrastchecker/

---

## 12. Fonts — Self-host for Performance 🟡
Currently loading Space Grotesk & Playfair Display from Google Fonts CDN
(requires internet). For production, download the WOFF2 files and self-host
them to avoid the external request and improve load time.

---

## 13. Favicon 🟢
Add a favicon derived from the Fira logo mark:
```html
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="icon" type="image/png" href="assets/favicon.png">
```

---

## File Structure Reference

```
fira-website/
├── index.html          Home page
├── about.html          About / Tentang Kita
├── produk.html         Product catalogue
├── kontak.html         Contact form + map
├── css/
│   └── styles.css      All styles — edit :root variables to retheme
├── js/
│   ├── components.js   Shared nav + footer — edit once, updates everywhere
│   ├── cms.js          Product data rendering — swap fetchData() for CMS
│   └── main.js         General interactions (form, scroll, animations)
├── data/
│   └── products.json   Product catalogue data — the "database"
├── assets/
│   ├── logo.svg        Placeholder logo — replace with real SVG
│   ├── images/         Page hero / section photos
│   ├── products/       Product card images (800×800)
│   ├── services/       Service card images (800×500)
│   └── certs/          Certification images
└── NOTES.md            This file
```
