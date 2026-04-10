/**
 * cms.js — Data Layer & Product Rendering
 * =========================================
 * Loads product data from data/products.json and
 * renders it into the DOM on produk.html, about.html,
 * and index.html.
 *
 * ─── CMS INTEGRATION NOTE ───────────────────────────
 * Currently reads from a local JSON file.
 * To connect a real CMS (Contentful, Sanity, etc.):
 *   1. Replace `fetchData()` with an API call to your
 *      CMS endpoint.
 *   2. Map the API response to the same shape as
 *      data/products.json — no other changes needed.
 *
 * Example Contentful swap:
 *   const res = await fetch(
 *     `https://cdn.contentful.com/spaces/YOUR_SPACE/entries?content_type=product&access_token=YOUR_TOKEN`
 *   );
 *   const data = await res.json();
 *   // map data.items → same shape as products.json categories
 * ─────────────────────────────────────────────────────
 */

// ─── DATA FETCH ──────────────────────────────────────────────

/**
 * Fetches and caches the product data.
 * @returns {Promise<Object>} The full products.json object
 */
async function fetchData() {
  if (window.__firaData) return window.__firaData;
  // Resolve path relative to any page depth
  const base = document.querySelector('meta[name="base-url"]')?.content || '';
  const res  = await fetch(`${base}data/products.json`);
  if (!res.ok) throw new Error('Could not load product data.');
  window.__firaData = await res.json();
  return window.__firaData;
}

// ─── HELPERS ─────────────────────────────────────────────────

function starRating(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function placeholderThumb(name) {
  return `<div class="prod-card__thumb" aria-label="${name} placeholder">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>`;
}

// ─── RENDERERS ───────────────────────────────────────────────

/**
 * Renders the full product catalogue on produk.html
 */
async function renderCatalogue() {
  const root = document.getElementById('catalogue-root');
  if (!root) return;

  try {
    const data = await fetchData();
    root.innerHTML = data.categories.map(cat => `
      <section class="cat-section" id="${cat.id}" data-category="${cat.id}">
        <div class="cat-header">
          <h2 class="cat-name">${cat.name}</h2>
          <a href="#${cat.id}" class="sec-link">Tampil Semua</a>
        </div>
        <div class="prod-grid">
          ${cat.products.map(p => `
            <article class="prod-card" data-name="${p.name.toLowerCase()}" data-category="${cat.id}">
              ${p.image
                ? `<div class="prod-card__thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>`
                : placeholderThumb(p.name)
              }
              <div class="prod-card__info">
                <p class="prod-card__name">${p.name}</p>
                <p class="prod-card__spec">${p.material} · ${p.thickness}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');
  } catch (e) {
    root.innerHTML = `<p style="color:red;padding:24px">Gagal memuat katalog produk. (${e.message})</p>`;
  }
}

// ─── CERT LIGHTBOX ───────────────────────────────────────────
let _lbCerts = [];
let _lbIdx   = 0;

function _lbBuild() {
  if (document.getElementById('cert-lightbox')) return;
  const el = document.createElement('div');
  el.id        = 'cert-lightbox';
  el.className = 'lightbox-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <button class="lightbox-close" aria-label="Tutup">&times;</button>
    <button class="lightbox-prev" aria-label="Sebelumnya">&#8249;</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-next" aria-label="Berikutnya">&#8250;</button>
  `;
  document.body.appendChild(el);
  el.querySelector('.lightbox-close').addEventListener('click', _lbClose);
  el.querySelector('.lightbox-prev').addEventListener('click', () => _lbNav(-1));
  el.querySelector('.lightbox-next').addEventListener('click', () => _lbNav(1));
  el.addEventListener('click', e => { if (e.target === el) _lbClose(); });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('cert-lightbox')?.classList.contains('is-open')) return;
    if (e.key === 'Escape')    _lbClose();
    if (e.key === 'ArrowLeft') _lbNav(-1);
    if (e.key === 'ArrowRight') _lbNav(1);
  });
}

function _lbOpen(idx) {
  _lbIdx = idx;
  const el  = document.getElementById('cert-lightbox');
  const img = el.querySelector('.lightbox-img');
  img.src = _lbCerts[_lbIdx].image;
  img.alt = _lbCerts[_lbIdx].name;
  el.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function _lbClose() {
  document.getElementById('cert-lightbox').classList.remove('is-open');
  document.body.style.overflow = '';
}

function _lbNav(dir) {
  _lbIdx = (_lbIdx + dir + _lbCerts.length) % _lbCerts.length;
  const img = document.querySelector('#cert-lightbox .lightbox-img');
  img.src = _lbCerts[_lbIdx].image;
  img.alt = _lbCerts[_lbIdx].name;
}

/**
 * Renders certifications grid.
 * - index.html (data-page=""): shows 4, no toggle
 * - about.html (data-page="about"): shows 4 initially, toggle to expand all
 * - All pages: clicking a cert opens a lightbox with prev/next navigation
 */
async function renderCertifications() {
  const grids = document.querySelectorAll('[data-cms="certifications"]');
  if (!grids.length) return;

  const data   = await fetchData();
  const certs  = data.certifications;
  const isHome = !!document.querySelector('[data-page=""]');

  _lbCerts = certs.filter(c => c.image);
  if (_lbCerts.length) _lbBuild();

  grids.forEach(g => {
    const list = isHome ? certs.slice(0, 4) : certs;

    g.innerHTML = list.map((c, i) => {
      const lbIdx   = _lbCerts.findIndex(lc => lc.id === c.id);
      const hidden  = !isHome && i >= 4 ? ' cert-hidden' : '';
      const clickable = lbIdx >= 0
        ? `data-lb-idx="${lbIdx}" role="button" tabindex="0"`
        : '';
      return `
        <div class="cert-card${hidden}" ${clickable} aria-label="${c.name}">
          ${c.image
            ? `<img src="${c.image}" alt="${c.name}" loading="lazy">`
            : `<span>${c.name}</span>`
          }
        </div>`;
    }).join('');

    // Lightbox click handlers
    g.querySelectorAll('.cert-card[data-lb-idx]').forEach(card => {
      card.addEventListener('click', () => _lbOpen(+card.dataset.lbIdx));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _lbOpen(+card.dataset.lbIdx); }
      });
    });

    // Expand/collapse toggle — about page only
    if (!isHome && certs.length > 4) {
      g.parentElement.querySelector('.cert-toggle')?.remove();
      const btn = document.createElement('button');
      btn.className = 'cert-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Tampil Semua';
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        Array.from(g.querySelectorAll('.cert-card')).forEach((c, i) => {
          c.classList.toggle('cert-hidden', expanded && i >= 4);
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        btn.textContent = expanded ? 'Tampil Semua' : 'Tampilkan Lebih Sedikit';
      });
      g.insertAdjacentElement('afterend', btn);
    }
  });
}

/**
 * Renders testimonials (index + about)
 */
async function renderTestimonials() {
  const grids = document.querySelectorAll('[data-cms="testimonials"]');
  if (!grids.length) return;

  const data  = await fetchData();
  const html  = data.testimonials.map(t => `
    <article class="testi-card">
      <p class="testi-card__name">${t.name}</p>
      <p class="testi-card__stars" aria-label="${t.rating} stars">${starRating(t.rating)}</p>
      <p class="testi-card__text">${t.text}</p>
    </article>
  `).join('');
  grids.forEach(g => g.innerHTML = html);
}

/**
 * Renders stats (about page)
 */
async function renderStats() {
  const root = document.querySelector('[data-cms="stats"]');
  if (!root) return;

  const data  = await fetchData();
  const s     = data.stats;
  root.innerHTML = `
    <div class="stat"><p class="stat__number">${s.products}</p><p class="stat__label">Produk</p></div>
    <div class="stat"><p class="stat__number">${s.projects}</p><p class="stat__label">Projek</p></div>
    <div class="stat"><p class="stat__number">${s.yearsExperience}</p><p class="stat__label">Tahun Pengalaman</p></div>
    <div class="stat"><p class="stat__number">${s.certifications}</p><p class="stat__label">Sertifikasi</p></div>
  `;
}

/**
 * Renders services (about page)
 */
async function renderServices() {
  const root = document.querySelector('[data-cms="services"]');
  if (!root) return;

  const data = await fetchData();
  root.innerHTML = data.services.map(s => `
    <article class="servis-card">
      <div class="servis-card__img">
        ${s.image
          ? `<img src="${s.image}" alt="${s.name}" loading="lazy">`
          : ''
        }
      </div>
      <p class="servis-card__name">${s.name}</p>
    </article>
  `).join('');
}

/**
 * Renders featured product overview on about page
 */
async function renderAboutProducts() {
  const root = document.querySelector('[data-cms="home-products"]');
  if (!root) return;

  const data = await fetchData();
  // Show one card per category
  root.innerHTML = data.categories.map(cat => `
    <a href="produk.html#${cat.id}" class="home-prod-card">
      ${cat.products[0]?.image
        ? `<img src="${cat.products[0].image}" alt="${cat.name}" loading="lazy">`
        : ''
      }
      <span class="home-prod-card__label">${cat.name}</span>
    </a>
  `).join('');
}

// ─── SEARCH ──────────────────────────────────────────────────

function initSearch() {
  const input   = document.getElementById('search-input');
  const empty   = document.getElementById('search-empty');
  if (!input) return;

  input.addEventListener('input', () => {
    const q     = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.prod-card');
    const secs  = document.querySelectorAll('.cat-section');
    let   total = 0;

    cards.forEach(card => {
      const match = !q || card.dataset.name.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) total++;
    });

    // Hide empty category sections
    secs.forEach(sec => {
      const visible = [...sec.querySelectorAll('.prod-card')]
        .some(c => c.style.display !== 'none');
      sec.style.display = visible ? '' : 'none';
    });

    if (empty) empty.classList.toggle('visible', total === 0 && q.length > 0);
  });
}

// ─── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await renderCatalogue();
  await Promise.all([
    renderCertifications(),
    renderTestimonials(),
    renderStats(),
    renderServices(),
    renderAboutProducts(),
  ]);
  initSearch();
});
