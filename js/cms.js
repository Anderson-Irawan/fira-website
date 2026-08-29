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
  return `<div class="prod-card__thumb" aria-label="${name} placeholder" aria-hidden="true">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>`;
}

// ─── SEARCH TEXT NORMALIZATION ────────────────────────────────
// Shared by card indexing (render time) and the search input (query time)
// so "ctruss", "C-Truss", "c  truss" and "C Truss" all normalize the same way.

// Extra words each category should also match on — covers the English
// labels used on the homepage (Roof/Truss/Panel) differing from the
// Indonesian category names used here (Atap/Wallpanel/Plafond).
const CATEGORY_SEARCH_ALIASES = {
  atap:     ['roof'],
  wallpanel:['panel'],
  plafond:  ['panel', 'plafon', 'ceiling'],
  holo:     ['plafon', 'ceiling'],
};

function normalizeSearchText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, ' ')                       // punctuation/hyphens → space
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * True if `haystack` (already normalized) matches `rawQuery`.
 * Matches both "glued" queries (no spaces, e.g. "ctruss") via a compact
 * substring check, and multi-word queries in any order via per-token AND.
 */
function searchTextMatches(haystack, rawQuery) {
  const q = normalizeSearchText(rawQuery);
  if (!q) return true;
  const haystackCompact = haystack.replace(/\s+/g, '');
  const qCompact = q.replace(/\s+/g, '');
  if (haystackCompact.includes(qCompact)) return true;
  return q.split(' ').filter(Boolean).every(tok => haystack.includes(tok));
}

// ─── RENDERERS ───────────────────────────────────────────────

/**
 * Product catalogue (produk.html) — tabs stand in for numbered pages
 * (Roof / Truss / Holo / Panel / Plafond), with subtype pills for
 * categories that have subgroups (Truss, Panel, Plafond). Search runs
 * across the whole catalogue regardless of the active tab.
 */
const CATALOGUE_TABS = [
  { key: 'atap',      label: 'Roof' },
  { key: 'truss',     label: 'Truss' },
  { key: 'holo',      label: 'Holo' },
  { key: 'wallpanel', label: 'Panel' },
  { key: 'plafond',   label: 'Plafond' },
];

let _catalogueData = null;
let _catActiveTab  = CATALOGUE_TABS[0].key;
let _catActiveSub  = 'all';

/** Builds { hasSub, groups: { subLabel: [product...] } } for one tab. */
function catalogueTabGroups(tabKey) {
  const cats  = _catalogueData.categories;
  const tab   = CATALOGUE_TABS.find(t => t.key === tabKey);
  const cat   = cats.find(c => c.id === tabKey);

  if (cat && cat.type !== 'group-header') {
    return {
      hasSub: false,
      groups: { [tab.label]: cat.products.map(p => ({ ...p, catId: cat.id, tagLabel: tab.label, showType: false })) },
    };
  }

  const groups = {};
  cats.filter(c => c.group === tabKey).forEach(sub => {
    groups[sub.name] = sub.products.map(p => ({ ...p, catId: sub.id, groupId: tabKey, tagLabel: sub.name, showType: true }));
  });
  return { hasSub: true, groups };
}

/** Flat list of every product across every tab, tagged for search + the card label. */
function catalogueAllProducts() {
  return CATALOGUE_TABS.flatMap(t => {
    const { groups } = catalogueTabGroups(t.key);
    return Object.values(groups).flat();
  });
}

/**
 * Renders a single product card — name below the photo, with its spec line
 * beneath that. The spec line leads with the subtype (e.g. "C Truss") only
 * when the product belongs to a subtype group; when the card's only "type"
 * is the tab it's already under (e.g. every Roof card just saying "Roof"),
 * that label is redundant and is left off.
 */
function renderProdCard(p) {
  const specParts = [p.showType ? p.tagLabel : null, p.material, p.thickness].filter(Boolean);
  const spec = specParts.join(' · ');
  const searchable = normalizeSearchText([
    p.name,
    p.material,
    p.thickness,
    p.description,
    p.tagLabel,
    ...(CATEGORY_SEARCH_ALIASES[p.catId] || []),
    ...(CATEGORY_SEARCH_ALIASES[p.groupId] || []),
  ].filter(Boolean).join(' '));
  return `
    <article class="prod-card" data-search="${searchable}">
      <div class="prod-card__photo">
        ${p.image
          ? `<img class="prod-card__img" src="${p.image}" alt="${p.name}" loading="lazy">`
          : placeholderThumb(p.name)
        }
      </div>
      <div class="prod-card__info">
        <p class="prod-card__name">${p.name}</p>
        ${spec ? `<p class="prod-card__spec">${spec}</p>` : ''}
      </div>
    </article>`;
}

async function renderCatalogue() {
  const root = document.getElementById('catalogue-root');
  if (!root) return;

  try {
    _catalogueData = await fetchData();

    const hash = window.location.hash.slice(1);
    if (CATALOGUE_TABS.some(t => t.key === hash)) _catActiveTab = hash;

    root.innerHTML = `
      <div class="cat-tabs-row">
        <nav class="tabs" id="cat-tabs" aria-label="Kategori produk"></nav>
        <p class="result-count" id="cat-count"></p>
      </div>
      <nav class="subtabs" id="cat-subtabs" aria-label="Subkategori"></nav>
      <div class="prod-grid" id="prod-grid"></div>
    `;

    renderCatTabs();
    renderCatSubtabs();
    renderCatalogueGrid();

    if (hash && CATALOGUE_TABS.some(t => t.key === hash)) {
      setTimeout(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  } catch (e) {
    root.innerHTML = `<p style="color:red;padding:24px">${i18nText('error.produk', { msg: e.message }, `Gagal memuat katalog produk. (${e.message})`)}</p>`;
  }
}

function renderCatTabs() {
  const tabsEl = document.getElementById('cat-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = CATALOGUE_TABS.map(t => `
    <button class="tab" data-cat="${t.key}" aria-selected="${t.key === _catActiveTab}">${i18nText('tab.' + t.key, null, t.label)}</button>
  `).join('');
  tabsEl.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _catActiveTab = btn.dataset.cat;
      _catActiveSub = 'all';
      const input = document.getElementById('search-input');
      if (input) input.value = '';
      renderCatTabs();
      renderCatSubtabs();
      renderCatalogueGrid();
    });
  });
}

function renderCatSubtabs() {
  const subtabsEl = document.getElementById('cat-subtabs');
  if (!subtabsEl) return;
  const { hasSub, groups } = catalogueTabGroups(_catActiveTab);
  if (!hasSub) { subtabsEl.innerHTML = ''; return; }

  const names = Object.keys(groups);
  subtabsEl.innerHTML = [`<button class="subtab" data-sub="all" aria-selected="${_catActiveSub === 'all'}">${i18nText('subtab.all', null, 'Semua')}</button>`]
    .concat(names.map(n => `<button class="subtab" data-sub="${n}" aria-selected="${_catActiveSub === n}">${n}</button>`))
    .join('');
  subtabsEl.querySelectorAll('.subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      _catActiveSub = btn.dataset.sub;
      renderCatSubtabs();
      renderCatalogueGrid();
    });
  });
}

function renderCatalogueGrid() {
  const gridEl  = document.getElementById('prod-grid');
  const countEl = document.getElementById('cat-count');
  const empty   = document.getElementById('search-empty');
  if (!gridEl || !_catalogueData) return;

  const input = document.getElementById('search-input');
  const q     = input ? input.value.trim() : '';

  let items;
  if (q) {
    items = catalogueAllProducts().filter(p => searchTextMatches(
      normalizeSearchText([p.name, p.material, p.thickness, p.description, p.tagLabel].filter(Boolean).join(' ')),
      q
    ));
  } else {
    const { groups } = catalogueTabGroups(_catActiveTab);
    items = Object.entries(groups)
      .filter(([name]) => _catActiveSub === 'all' || name === _catActiveSub)
      .flatMap(([, list]) => list);
  }

  gridEl.style.display = items.length ? 'grid' : 'none';
  if (countEl) {
    countEl.textContent = q
      ? i18nText('catalogue.searchcount', { n: items.length, q: input.value.trim() }, `${items.length} hasil untuk "${input.value.trim()}"`)
      : i18nText('catalogue.count', { n: items.length }, `${items.length} produk`);
  }
  if (empty) empty.classList.toggle('visible', items.length === 0);

  gridEl.innerHTML = items.map(renderProdCard).join('');
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
    <button class="lightbox-close" aria-label="${i18nText('lightbox.close', null, 'Tutup')}">&times;</button>
    <button class="lightbox-prev" aria-label="${i18nText('lightbox.prev', null, 'Sebelumnya')}">&#8249;</button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-next" aria-label="${i18nText('lightbox.next', null, 'Berikutnya')}">&#8250;</button>
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

    // Make the entire sec-header the toggle (same pattern as cat-header--toggle)
    const secHeader = g.closest('.container')?.querySelector('.sec-header');
    if (secHeader && !secHeader.classList.contains('cat-header--toggle')) {
      const arrowSVG = `<svg class="cat-toggle__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
      secHeader.classList.add('cat-header--toggle');
      secHeader.setAttribute('role', 'button');
      secHeader.setAttribute('tabindex', '0');
      secHeader.insertAdjacentHTML('beforeend', arrowSVG);

      if (isAbout) {
        secHeader.setAttribute('aria-expanded', 'false');

        const toggle = () => {
          const expanded = secHeader.getAttribute('aria-expanded') === 'true';
          Array.from(g.querySelectorAll('.cert-card')).forEach((c, i) => {
            c.classList.toggle('cert-hidden', expanded && i >= 4);
          });
          secHeader.setAttribute('aria-expanded', String(!expanded));
        };

        secHeader.addEventListener('click', toggle);
        secHeader.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });

        if (new URLSearchParams(location.search).has('certs')) {
          toggle();
        }
      } else {
        secHeader.addEventListener('click', () => {
          window.location.href = 'about.html?certs=open#sertifikasi';
        });
        secHeader.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = 'about.html?certs=open#sertifikasi'; }
        });
      }
    }
    // Kept fresh on every render (including a language switch), unlike
    // the one-time setup above which only runs the first time.
    if (secHeader && isAbout) {
      secHeader.setAttribute('aria-label', i18nText('cert.toggle.aria', null, 'Tampil semua Sertifikasi'));
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
    <div class="stat">${ICON_PRODUK}<p class="stat__number">${s.products}</p><p class="stat__label">${i18nText('stat.products', null, 'Produk')}</p></div>
    <div class="stat">${ICON_PROJEK}<p class="stat__number">${s.projects}</p><p class="stat__label">${i18nText('stat.projects', null, 'Projek')}</p></div>
    <div class="stat">${ICON_TAHUN}<p class="stat__number">${s.yearsExperience}</p><p class="stat__label">${i18nText('stat.years', null, 'Tahun Pengalaman')}</p></div>
    <div class="stat">${ICON_SERTIF}<p class="stat__number">${s.certifications}</p><p class="stat__label">${i18nText('stat.certs', null, 'Sertifikasi')}</p></div>
  `;
}

/**
 * Renders services (about page)
 */
async function renderServices() {
  const root = document.querySelector('[data-cms="services"]');
  if (!root) return;

  const data = await fetchData();
  root.innerHTML = data.services.map((s, i) => {
    const name = i18nText(`service.${i + 1}.name`, null, s.name);
    const desc = i18nText(`service.${i + 1}.desc`, null, s.description);
    return `
    <article class="servis-card">
      <div class="servis-card__img">
        ${s.image
          ? `<img src="${s.image}" alt="${name}" loading="lazy">`
          : ''
        }
      </div>
      <p class="servis-card__name">${name}</p>
      ${desc ? `<p class="servis-card__desc">${desc}</p>` : ''}
    </article>
  `;
  }).join('');
}

/**
 * Renders the 3-section product overview (Roof / Truss / Panel) on the homepage
 */
async function renderAboutProducts() {
  const root = document.querySelector('[data-cms="home-products"]');
  if (!root) return;

  const data = await fetchData();

  const getCategoryImage = (catId) => {
    const cat = data.categories.find(c => c.id === catId);
    if (!cat) return null;
    if (cat.type === 'group-header') {
      const firstChild = data.categories.find(c => c.group === cat.id);
      return firstChild?.products?.[0]?.image || null;
    }
    return cat.products?.[0]?.image || null;
  };

  const sections = [
    { anchor: 'atap',      name: 'Roof',  catIds: ['atap'] },
    { anchor: 'truss',     name: 'Truss', catIds: ['truss', 'holo'] },
    { anchor: 'wallpanel', name: 'Panel', catIds: ['wallpanel', 'plafond'] },
  ];

  root.innerHTML = sections.map(sec => {
    const image = sec.catIds.map(getCategoryImage).find(Boolean) || null;
    const label = i18nText('homeprod.' + sec.anchor, null, sec.name);
    return `
    <a href="produk.html#${sec.anchor}" class="home-prod-card">
      ${image
        ? `<img src="${image}" alt="${label}" loading="lazy">`
        : ''
      }
      <div class="home-prod-card__overlay" aria-hidden="true"></div>
      <span class="home-prod-card__label">${label}</span>
    </a>
  `;
  }).join('');
}

// ─── PROJECT CATALOGUE ───────────────────────────────────────
// Flat, paginated grid — no category sections. Sorted newest → oldest,
// PROJ_PER_PAGE items per page, on both desktop and mobile.

const PROJ_PER_PAGE = 8;
let _projItems = [];
let _projPage  = 1;

function placeholderProjThumb(name) {
  return `<div class="proj-card__thumb" aria-label="${name} placeholder" aria-hidden="true">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>`;
}

function renderProjCard(item) {
  const categoryLabel = i18nText('cat.' + item.categoryId, null, item.category);
  return `
    <article class="proj-card">
      <p class="proj-card__category">${categoryLabel}</p>
      <div class="proj-card__photo">
        ${item.image
          ? `<img class="proj-card__img" src="${item.image}" alt="${item.name}" loading="lazy">`
          : placeholderProjThumb(item.name)
        }
      </div>
      <div class="proj-card__info">
        <p class="proj-card__name">${item.name}</p>
        <p class="proj-card__meta">${item.location}</p>
      </div>
    </article>`;
}

/** Every project across every category, flattened and sorted newest → oldest. */
function getAllProjectsSorted(data) {
  return data.projects
    .flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name, categoryId: cat.id })))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

async function renderProjects() {
  const root = document.getElementById('projek-root');
  if (!root) return;

  try {
    const data = await fetchData();
    _projItems = getAllProjectsSorted(data);

    root.innerHTML = `
      <div class="proj-grid" id="proj-grid"></div>
      <nav class="pager" id="proj-pager" aria-label="Pagination"></nav>
    `;

    _projPage = 1;
    renderProjPage();
  } catch (e) {
    root.innerHTML = `<p style="color:red;padding:24px">${i18nText('error.projek', { msg: e.message }, `Gagal memuat katalog projek. (${e.message})`)}</p>`;
  }
}

function renderProjPage() {
  const grid  = document.getElementById('proj-grid');
  const pager = document.getElementById('proj-pager');
  if (!grid || !pager) return;

  const pageCount = Math.max(1, Math.ceil(_projItems.length / PROJ_PER_PAGE));
  _projPage = Math.min(Math.max(_projPage, 1), pageCount);
  const start = (_projPage - 1) * PROJ_PER_PAGE;

  grid.innerHTML = _projItems.slice(start, start + PROJ_PER_PAGE).map(renderProjCard).join('');

  const prevDisabled = _projPage === 1;
  const nextDisabled = _projPage === pageCount;

  let nums = '';
  for (let n = 1; n <= pageCount; n++) {
    nums += `<button class="pager__num" aria-current="${n === _projPage}" data-page="${n}">${n}</button>`;
  }

  pager.setAttribute('aria-label', i18nText('pager.aria', null, 'Pagination'));
  pager.innerHTML = `
    <button class="pager__btn pager__btn--prev" id="proj-prev" ${prevDisabled ? 'disabled' : ''} aria-label="${i18nText('pager.prev.aria', null, 'Halaman sebelumnya')}">
      <span aria-hidden="true">←</span><span class="pager__btn-label">${i18nText('pager.prev', null, 'Sebelumnya')}</span>
    </button>
    <div class="pager__nums">${nums}</div>
    <button class="pager__btn pager__btn--next" id="proj-next" ${nextDisabled ? 'disabled' : ''} aria-label="${i18nText('pager.next.aria', null, 'Halaman berikutnya')}">
      <span class="pager__btn-label">${i18nText('pager.next', null, 'Berikutnya')}</span><span aria-hidden="true">→</span>
    </button>
  `;

  document.getElementById('proj-prev').addEventListener('click', () => goToProjPage(_projPage - 1));
  document.getElementById('proj-next').addEventListener('click', () => goToProjPage(_projPage + 1));
  pager.querySelectorAll('.pager__num').forEach(btn => {
    btn.addEventListener('click', () => goToProjPage(+btn.dataset.page));
  });
}

function goToProjPage(n) {
  const pageCount = Math.max(1, Math.ceil(_projItems.length / PROJ_PER_PAGE));
  if (n < 1 || n > pageCount || n === _projPage) return;
  _projPage = n;
  renderProjPage();
  document.getElementById('projek-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── HOME PAGE — PROJECTS OVERVIEW SLIDESHOW ──────────────────
// Most recent 6 projects (by year), auto-advancing crossfade with dots.
// Re-reads data/products.json each render, so it stays in sync as
// projects are added — no hardcoded list to maintain.

const HOME_PROJ_COUNT = 6;
let _homeProjSlides  = [];
let _homeProjDots    = [];
let _homeProjIdx     = 0;
let _homeProjTimer   = null;

const PIN_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

function goHomeProjSlide(idx) {
  if (!_homeProjSlides.length) return;
  _homeProjSlides[_homeProjIdx]?.classList.remove('is-active');
  _homeProjDots[_homeProjIdx]?.classList.remove('is-active');
  _homeProjIdx = idx;
  _homeProjSlides[_homeProjIdx]?.classList.add('is-active');
  _homeProjDots[_homeProjIdx]?.classList.add('is-active');
}

async function renderHomeProjects() {
  const root = document.querySelector('[data-cms="home-projects-show"]');
  if (!root) return;

  if (_homeProjTimer) { clearInterval(_homeProjTimer); _homeProjTimer = null; }

  const data  = await fetchData();
  const items = getAllProjectsSorted(data).slice(0, HOME_PROJ_COUNT);

  root.innerHTML = `
    <div class="home-projects__dots" id="home-projects-dots"></div>
    ${items.map(item => `
      <div class="home-projects__slide">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" loading="lazy">`
          : placeholderProjThumb(item.name)
        }
        <div class="home-projects__scrim" aria-hidden="true"></div>
        <div class="home-projects__cap">
          <p class="home-projects__cap-name">${item.name}</p>
          <p class="home-projects__cap-loc">${PIN_SVG}${item.location}</p>
        </div>
      </div>
    `).join('')}
  `;

  _homeProjSlides = Array.from(root.querySelectorAll('.home-projects__slide'));
  const dotsEl = document.getElementById('home-projects-dots');
  _homeProjDots = items.map((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'home-projects__dot';
    dot.setAttribute('aria-label', i18nText('a11y.slide', { n: idx + 1 }, `Slide ${idx + 1}`));
    dot.addEventListener('click', () => goHomeProjSlide(idx));
    dotsEl.appendChild(dot);
    return dot;
  });

  _homeProjIdx = -1;
  goHomeProjSlide(0);

  if (items.length > 1) {
    _homeProjTimer = setInterval(() => goHomeProjSlide((_homeProjIdx + 1) % items.length), 4200);
  }
}

// ─── SEARCH ──────────────────────────────────────────────────

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  // Searching runs across the whole catalogue regardless of the active tab —
  // see renderCatalogueGrid().
  input.addEventListener('input', renderCatalogueGrid);
}

/**
 * Re-renders every CMS-driven, dynamically-built piece of UI so it picks
 * up the current language. Plain data-i18n swaps (handled in i18n.js)
 * can't reach this content because it's assembled from data/products.json
 * at render time rather than sitting in the HTML as static text. Called
 * from applyLanguage() in i18n.js on both initial load and language toggle.
 */
function refreshCmsLanguage() {
  if (_catalogueData) {
    renderCatTabs();
    renderCatSubtabs();
    renderCatalogueGrid();
  }
  if (_projItems.length) renderProjPage();
  if (document.querySelector('[data-cms="home-projects-show"]')) renderHomeProjects();
  if (document.querySelector('[data-cms="stats"]')) renderStats();
  if (document.querySelector('[data-cms="services"]')) renderServices();
  if (document.querySelector('[data-cms="home-products"]')) renderAboutProducts();
  if (document.querySelectorAll('[data-cms="certifications"]').length) renderCertifications();

  const lb = document.getElementById('cert-lightbox');
  if (lb) {
    lb.querySelector('.lightbox-close')?.setAttribute('aria-label', i18nText('lightbox.close', null, 'Tutup'));
    lb.querySelector('.lightbox-prev')?.setAttribute('aria-label', i18nText('lightbox.prev', null, 'Sebelumnya'));
    lb.querySelector('.lightbox-next')?.setAttribute('aria-label', i18nText('lightbox.next', null, 'Berikutnya'));
  }
}

// ─── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  await renderCatalogue();
  await renderProjects();
  await Promise.all([
    renderCertifications(),
    renderTestimonials(),
    renderStats(),
    renderServices(),
    renderAboutProducts(),
    renderHomeProjects(),
  ]);
  initSearch();

  // The above is async (data fetch), so i18n.js's own DOMContentLoaded
  // listener can fire and apply the saved language before any of this
  // content exists. Re-apply now that it's actually in the DOM.
  if (typeof applyLanguage === 'function') applyLanguage(getLang());
});
