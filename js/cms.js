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

const CAT_PREVIEW = 4; // cards shown before "Tampil Semua"

/** Renders a single product card */
function renderProdCard(p, catId) {
  return `
    <article class="prod-card" data-name="${p.name.toLowerCase()}" data-category="${catId}">
      ${p.image
        ? `<div class="prod-card__thumb"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>`
        : placeholderThumb(p.name)
      }
      <div class="prod-card__info">
        <p class="prod-card__name">${p.name}</p>
        <p class="prod-card__spec">${p.material} · ${p.thickness}</p>
      </div>
    </article>`;
}

/**
 * Renders the full product catalogue on produk.html.
 * Categories with >CAT_PREVIEW products show a toggle to expand/collapse.
 * Only one category can be expanded at a time (accordion).
 */
async function renderCatalogue() {
  const root = document.getElementById('catalogue-root');
  if (!root) return;

  try {
    const data = await fetchData();
    root.innerHTML = data.categories.map(cat => {
      const preview = cat.products.slice(0, CAT_PREVIEW);
      const extra   = cat.products.slice(CAT_PREVIEW);
      const hasMore = extra.length > 0;

      return `
        <section class="cat-section" id="${cat.id}" data-category="${cat.id}">
          <div class="cat-header">
            <h2 class="cat-name">${cat.name}</h2>
            ${hasMore ? `
              <button class="cat-toggle" aria-expanded="false" data-cat="${cat.id}">
                <span class="cat-toggle__label">Tampil Semua</span>
                <span class="cat-toggle__count">(${cat.products.length})</span>
                <svg class="cat-toggle__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
              </button>` : ''}
          </div>
          <div class="prod-grid">
            ${preview.map(p => renderProdCard(p, cat.id)).join('')}
          </div>
          ${hasMore ? `
            <div class="prod-overflow" id="overflow-${cat.id}">
              <div class="prod-overflow__inner">
                <div class="prod-grid">
                  ${extra.map(p => renderProdCard(p, cat.id)).join('')}
                </div>
              </div>
            </div>` : ''}
        </section>`;
    }).join('');

    initCatAccordion();
  } catch (e) {
    root.innerHTML = `<p style="color:red;padding:24px">Gagal memuat katalog produk. (${e.message})</p>`;
  }
}

/**
 * Expands a category section (collapses all others first).
 * @param {string} catId  — category id
 * @param {boolean} scroll — whether to scroll the section into view
 */
function expandCat(catId, scroll = false) {
  const root = document.getElementById('catalogue-root');
  if (!root) return;

  // Collapse all
  root.querySelectorAll('.cat-toggle').forEach(b => {
    b.setAttribute('aria-expanded', 'false');
    const lbl = b.querySelector('.cat-toggle__label');
    if (lbl) lbl.textContent = 'Tampil Semua';
    document.getElementById(`overflow-${b.dataset.cat}`)?.classList.remove('prod-overflow--open');
  });

  // Expand target
  const section  = document.getElementById(catId);
  const btn      = section?.querySelector('.cat-toggle');
  const overflow = document.getElementById(`overflow-${catId}`);
  if (btn && overflow) {
    btn.setAttribute('aria-expanded', 'true');
    const lbl = btn.querySelector('.cat-toggle__label');
    if (lbl) lbl.textContent = 'Sembunyikan';
    overflow.classList.add('prod-overflow--open');
  }

  if (scroll && section) {
    // Wait one frame so layout settles before scrolling
    requestAnimationFrame(() =>
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  }
}

/** Wires up accordion toggle clicks and hash-based auto-expand */
function initCatAccordion() {
  const root = document.getElementById('catalogue-root');
  if (!root) return;

  root.addEventListener('click', e => {
    const btn = e.target.closest('.cat-toggle');
    if (!btn) return;

    const catId  = btn.dataset.cat;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      // Collapse this one
      btn.setAttribute('aria-expanded', 'false');
      const lbl = btn.querySelector('.cat-toggle__label');
      if (lbl) lbl.textContent = 'Tampil Semua';
      document.getElementById(`overflow-${catId}`)?.classList.remove('prod-overflow--open');
    } else {
      expandCat(catId);
    }
  });

  // Auto-expand from URL hash (e.g. produk.html#atap)
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    // Small delay so grid has painted before we scroll
    setTimeout(() => expandCat(hash, true), 100);
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
 * - index.html: shows 4, central button navigates to about.html cert section (expanded)
 * - about.html: shows 4 initially, toggle expands/collapses all; auto-expands if
 *               arriving with ?certs=open in the URL
 * - All pages: clicking a cert opens a lightbox with prev/next navigation
 */
async function renderCertifications() {
  const grids = document.querySelectorAll('[data-cms="certifications"]');
  if (!grids.length) return;

  const data    = await fetchData();
  const certs   = data.certifications;
  const isAbout = window.location.pathname.endsWith('about.html');

  _lbCerts = certs.filter(c => c.image);
  if (_lbCerts.length) _lbBuild();

  grids.forEach(g => {
    const list = isAbout ? certs : certs.slice(0, 4);

    g.innerHTML = list.map((c, i) => {
      const lbIdx     = _lbCerts.findIndex(lc => lc.id === c.id);
      const hidden    = isAbout && i >= 4 ? ' cert-hidden' : '';
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

    // Remove any previously-injected toggle
    g.parentElement.querySelector('.cert-toggle')?.remove();
    g.closest('.container')?.querySelector('.sec-header .cat-toggle')?.remove();

    const btn = document.createElement('button');
    btn.className = 'cat-toggle';
    btn.innerHTML = `
      <span class="cat-toggle__label">Tampil Semua</span>
      <span class="cat-toggle__count">(${certs.length})</span>
      <svg class="cat-toggle__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    `;
    btn.setAttribute('aria-expanded', 'false');

    if (isAbout) {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        Array.from(g.querySelectorAll('.cert-card')).forEach((c, i) => {
          c.classList.toggle('cert-hidden', expanded && i >= 4);
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        const lbl = btn.querySelector('.cat-toggle__label');
        if (lbl) lbl.textContent = expanded ? 'Tampil Semua' : 'Sembunyikan';
      });

      if (new URLSearchParams(location.search).has('certs')) {
        btn.click();
      }

      // Place inside sec-header so it sits inline with the title, right-aligned
      const secHeader = g.closest('.container')?.querySelector('.sec-header');
      if (secHeader) secHeader.appendChild(btn);
      else g.insertAdjacentElement('afterend', btn);
    } else {
      btn.addEventListener('click', () => {
        window.location.href = 'about.html?certs=open#sertifikasi';
      });
      const secHeader = g.closest('.container')?.querySelector('.sec-header');
      if (secHeader) secHeader.appendChild(btn);
      else g.insertAdjacentElement('afterend', btn);
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
  const html = data.testimonials.map(t => `
    <article class="testi-card">
      <p class="testi-card__name">${t.name}</p>
      <p class="testi-card__stars" aria-label="${t.rating} stars">${starRating(t.rating)}</p>
      <p class="testi-card__text">${t.text}</p>
    </article>
  `).join('');

  grids.forEach(g => {
    // Duplicate cards so the marquee loops seamlessly
    g.innerHTML = `<div class="testi-track" aria-hidden="false">${html + html}</div>`;
  });
}

/**
 * Renders stats (about page)
 */
async function renderStats() {
  const root = document.querySelector('[data-cms="stats"]');
  if (!root) return;

  const data  = await fetchData();
  const s     = data.stats;
  const ICON_PRODUK = `<svg class="stat__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>`;

  const ICON_PROJEK = `<svg class="stat__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
  </svg>`;

  const ICON_TAHUN = `<svg class="stat__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>`;

  const ICON_SERTIF = `<svg class="stat__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>`;

  root.innerHTML = `
    <div class="stat">${ICON_PRODUK}<p class="stat__number">${s.products}</p><p class="stat__label">Produk</p></div>
    <div class="stat">${ICON_PROJEK}<p class="stat__number">${s.projects}</p><p class="stat__label">Projek</p></div>
    <div class="stat">${ICON_TAHUN}<p class="stat__number">${s.yearsExperience}</p><p class="stat__label">Tahun Pengalaman</p></div>
    <div class="stat">${ICON_SERTIF}<p class="stat__number">${s.certifications}</p><p class="stat__label">Sertifikasi</p></div>
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
      ${s.description ? `<p class="servis-card__desc">${s.description}</p>` : ''}
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
  const input = document.getElementById('search-input');
  const empty = document.getElementById('search-empty');
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

    secs.forEach(sec => {
      const allCards   = [...sec.querySelectorAll('.prod-card')];
      const hasVisible = allCards.some(c => c.style.display !== 'none');
      sec.style.display = hasVisible ? '' : 'none';

      if (!hasVisible) return;

      const overflow = sec.querySelector('.prod-overflow');
      const btn      = sec.querySelector('.cat-toggle');
      if (!overflow || !btn) return;

      if (q) {
        // Auto-expand if any overflow card matches
        const overflowMatch = [...overflow.querySelectorAll('.prod-card')]
          .some(c => c.style.display !== 'none');
        if (overflowMatch) {
          overflow.classList.add('prod-overflow--open');
          btn.setAttribute('aria-expanded', 'true');
          const lbl = btn.querySelector('.cat-toggle__label');
          if (lbl) lbl.textContent = 'Sembunyikan';
        }
      } else {
        // Search cleared — collapse back to default
        overflow.classList.remove('prod-overflow--open');
        btn.setAttribute('aria-expanded', 'false');
        const lbl = btn.querySelector('.cat-toggle__label');
        if (lbl) lbl.textContent = 'Tampil Semua';
      }
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
