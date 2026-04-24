/**
 * components.js — Shared Nav & Footer
 * ====================================
 * Edit the nav links, footer columns, and contact info
 * here — it updates across all pages automatically.
 *
 * Usage in HTML:
 *   <div id="nav-placeholder" data-page="home"></div>
 *   <div id="footer-placeholder"></div>
 *   <script src="js/components.js"></script>
 */

// ─── INSTANT PRE-RENDER FROM CACHE ──────────────────────────
// Runs synchronously at script-parse time — before DOMContentLoaded
// fires — so nav and footer exist on the very first paint and never
// flash in. Only uses sessionStorage + vanilla DOM; no reference to
// the constants/functions defined below (safe at top of file).
(function () {
  try {
    var ns  = document.getElementById('nav-placeholder');
    var nav = sessionStorage.getItem('fira-nav');

    if (ns && nav) {
      var page = ns.dataset.page || '';
      var html = nav;
      if (page) {
        // Activate the link that matches this page
        html = html.replace(
          'href="' + page + '.html" class="navbar__link"',
          'href="' + page + '.html" class="navbar__link active"'
        );
      } else {
        // Home page: nav hides behind hero, spacer not needed
        html = html
          .replace('class="navbar"', 'class="navbar is-hidden"')
          .replace('<div class="nav-spacer" aria-hidden="true"></div>', '');
      }
      ns.outerHTML = html;
    }
  } catch (_) { /* sessionStorage blocked (private mode etc.) — graceful fallback */ }
}());

// ─── LOGO ────────────────────────────────────────────────────
const LOGO_NAV    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226.64 127.06" aria-label="Fira" role="img"><path fill="#ffce00" d="M93.67,19.47c0,10.47-6.64,14.83-14.83,14.83-12.99,0-14.83-9.23-14.83-14.83,0-9.37,6.64-14.83,14.83-14.83,11.42,0,14.83,6.64,14.83,14.83Z"/><rect fill="#f7f4eb" x="64.89" y="40.96" width="27.91" height="83.82"/><path fill="#f7f4eb" d="M153.15,38.38c-4.93.56-12.13,1.8-17.24,4.92-4.69,2.87-8.71,8.75-10.48,14.66l-2.72-17.01h-20.77v83.83h27.91v-36.87c1.45-6.92,3.92-12.16,6.75-15.39,2.89-3.31,7.68-5.2,12.7-5.2l3.86-28.94Z"/><path fill="#f7f4eb" d="M199.9,39.01c-1.96-.3-3.98-.5-6.02-.63-19.17-1.78-36.19,4.42-36.19,4.42l4.75,19.33c13.12-3.54,36.59-11.06,36.3,10.54-13.7-.59-32.42,1.17-40.35,7.32-19.5,13.71-11.02,47.07,18.24,47.07,14.06,0,18.86-4.06,24.55-12.16l-.97,9.88h26.45v-58.52c-.44-17.28-12.07-24.99-26.74-27.26ZM198.74,100.88c-1.34,2.08-3.04,3.71-5.1,4.91-18.98,9.44-25.08-22.09,5.1-18.31v13.4Z"/><path fill="#f7f4eb" d="M56.35,28.18L61.35.61C36.45-3.19,12.56,10.93,11.28,41.41v10.79H0v27.91h11.28v44.57h27.93v-44.57h17.69l1.97-27.91h-19.66v-10.31c.68-11.8,8.57-14.98,17.14-13.71Z"/></svg>`;
const LOGO_FOOTER = `<img src="assets/logo-fira.svg" alt="Fira" class="footer__logo-img">`;

// ─── NAV CONFIG ──────────────────────────────────────────────
const NAV_LINKS = [
  { id: 'produk',  label: 'PRODUK',  href: 'produk.html' },
  { id: 'projek',  label: 'PROJEK',  href: 'projek.html' },
  { id: 'about',   label: 'ABOUT',   href: 'about.html'  },
  { id: 'kontak',  label: 'KONTAK',  href: 'kontak.html' },
];

// ─── FOOTER CONFIG ───────────────────────────────────────────
const FOOTER_PROJEK = [
  { label: 'Residensial',  href: 'projek.html#residensial'  },
  { label: 'Komersial',    href: 'projek.html#komersial'    },
  { label: 'Industrial',   href: 'projek.html#industrial'   },
  { label: 'Institutional',href: 'projek.html#institutional'},
];
const FOOTER_PRODUK = [
  { label: 'Atap',         href: 'produk.html#atap'       },
  { label: 'Truss',        href: 'produk.html#truss'      },
  { label: 'Reng',         href: 'produk.html#reng'       },
  { label: 'Holo',         href: 'produk.html#holo'       },
  { label: 'Wallpanel',    href: 'produk.html#wallpanel'  },
  { label: 'PVC',          href: 'produk.html#pvc'        },
  { label: 'Produk Lain',  href: 'produk.html'            },
];
const FOOTER_ABOUT = [
  { label: 'Tentang Kita',  href: 'about.html'              },
  { label: 'Visi & Misi',   href: 'about.html#visi-misi'   },
  { label: 'Sertifikasi',   href: 'about.html#sertifikasi'  },
  { label: 'Testimoni',     href: 'about.html#testimoni'    },
];
const CONTACT_INFO = {
  phones:  ['+62 313 714 362', '+62 811 325 4929'],
  address: 'Jalan Kedinding Tengah II No. 16<br>Surabaya, Jawa Timur<br>60129, Indonesia',
};

// ─── RENDER FUNCTIONS ────────────────────────────────────────

/**
 * Standard top navbar — used on About, Produk, Kontak pages.
 */
function renderNav(activePage = '') {
  const links = NAV_LINKS.map(({ id, label, href }) =>
    `<li>
      <a href="${href}" class="navbar__link${activePage === id ? ' active' : ''}">
        <span class="navbar__link-inner">
          <span>${label}</span>
          <span aria-hidden="true">${label}</span>
        </span>
      </a>
    </li>`
  ).join('');

  return `
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar__inner">
    <a href="index.html" class="navbar__logo" aria-label="Fira — Home">${LOGO_NAV}</a>
    <ul class="navbar__links">${links}</ul>
  </div>
</nav>
<div class="nav-spacer" aria-hidden="true"></div>`;
}

/**
 * Side nav — used on the Home page (index.html) only.
 * Logo floats top-left; 3 nav items with blue bars sit on the right edge.
 */
function renderSideNav(activePage = '') {
  const items = NAV_LINKS.map(({ id, label, href }) =>
    `<a href="${href}" class="sidenav__item${activePage === id ? ' active' : ''}" aria-label="${label}">
      <span class="sidenav__bar" aria-hidden="true"></span>
      <span class="sidenav__label">${label}</span>
    </a>`
  ).join('');

  const logoHTML = activePage === ''
    ? ''
    : `<a href="index.html" class="sidenav-logo" aria-label="Fira — Home">${LOGO_NAV}</a>`;

  return `${logoHTML}
<nav class="sidenav" role="navigation" aria-label="Main navigation">
  ${items}
</nav>`;
}

function renderFooter() {
  const produkLinks = FOOTER_PRODUK.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const aboutLinks = FOOTER_ABOUT.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const phones = CONTACT_INFO.phones.map(p =>
    `<span>${p}</span><br>`).join('');

  return `
<footer class="footer" role="contentinfo">
  <div class="footer__inner">
    <div class="footer__logo-wrap">
      <a href="index.html" aria-label="Fira — Home">${LOGO_FOOTER}</a>
    </div>
    <div class="footer__cols">
      <div class="footer__col">
        <a href="produk.html" class="footer__col-title footer__col-title--link">Produk</a>
        <ul>${produkLinks}</ul>
      </div>
      <div class="footer__col">
        <a href="about.html" class="footer__col-title footer__col-title--link">About</a>
        <ul>${aboutLinks}</ul>
      </div>
      <div class="footer__col footer__contact">
        <a href="kontak.html" class="footer__col-title footer__col-title--link">Kontak</a>
        <p>${phones}${CONTACT_INFO.address}</p>
      </div>
      <div class="footer__col footer__social-col">
        <p class="footer__col-title">Ikuti Kami</p>
        <div class="footer__social">
          <a href="#" class="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="TikTok" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="mailto:#" class="footer__social-link" aria-label="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>`;
}

/**
 * Revised footer layout used on projek.html (and eventually all pages).
 * Grid: [Projek][Produk] / [About][Kontak + social icons]
 */
function renderFooterV2() {
  const projekLinks = FOOTER_PROJEK.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const produkLinks = FOOTER_PRODUK.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const aboutLinks  = FOOTER_ABOUT.map(l =>
    `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const phones = CONTACT_INFO.phones.map(p =>
    `<span>${p}</span><br>`).join('');

  return `
<footer class="footer footer--v2" role="contentinfo">
  <div class="footer__inner">
    <div class="footer__logo-wrap">
      <a href="index.html" aria-label="Fira — Home">${LOGO_FOOTER}</a>
    </div>
    <div class="footer__cols">
      <div class="footer__col">
        <a href="produk.html" class="footer__col-title footer__col-title--link">Produk</a>
        <ul>${produkLinks}</ul>
      </div>
      <div class="footer__col">
        <a href="projek.html" class="footer__col-title footer__col-title--link">Projek</a>
        <ul>${projekLinks}</ul>
      </div>
      <div class="footer__col">
        <a href="about.html" class="footer__col-title footer__col-title--link">About</a>
        <ul>${aboutLinks}</ul>
      </div>
      <div class="footer__col footer__contact">
        <a href="kontak.html" class="footer__col-title footer__col-title--link">Kontak</a>
        <p>${phones}${CONTACT_INFO.address}</p>
        <div class="footer__social footer__social--inline">
          <a href="#" class="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="WhatsApp" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="TikTok" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
          </a>
          <a href="#" class="footer__social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="mailto:#" class="footer__social-link" aria-label="Email">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>`;
}

// ─── AUTO-INJECT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const navSlot     = document.getElementById('nav-placeholder');
  const sideNavSlot = document.getElementById('sidenav-placeholder');
  const footerSlot  = document.getElementById('footer-placeholder');

  if (navSlot) {
    const page = navSlot.dataset.page || '';
    let navHTML = renderNav(page);
    // On the home page the topnav starts hidden; it slides in once
    // the hero section scrolls fully out of view (see main.js).
    // The nav-spacer is also removed — the full-screen hero needs no
    // offset, and we don't want a layout jump when the navbar appears.
    if (page === '') {
      navHTML = navHTML
        .replace('<nav class="navbar"', '<nav class="navbar is-hidden"')
        .replace('<div class="nav-spacer" aria-hidden="true"></div>', '');
    }
    navSlot.outerHTML = navHTML;
  }
  if (sideNavSlot) {
    const page = sideNavSlot.dataset.page || '';
    sideNavSlot.outerHTML = renderSideNav(page);
  }
  if (footerSlot) {
    footerSlot.outerHTML = footerSlot.dataset.footer === 'v2'
      ? renderFooterV2()
      : renderFooter();
  }

  // ── Back-to-top button ─────────────────────────────────────
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Kembali ke atas');
  btt.innerHTML = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btt);

  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    btt.classList.toggle('back-to-top--visible', window.scrollY > 400);
  }, { passive: true });

  // ── Populate sessionStorage cache for subsequent navigations ──
  // renderNav('__none__') produces a base nav: no active link, no
  // is-hidden — the pre-render IIFE applies those per-page at runtime.
  try {
    sessionStorage.setItem('fira-nav', renderNav('__none__'));
  } catch (_) {}
});
