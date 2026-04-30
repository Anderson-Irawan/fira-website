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
const LOGO_NAV    = `<img src="assets/logos/logotype.svg" alt="Fira" class="navbar__logo-img">`;
const LOGO_FOOTER = `<img src="assets/logos/logotype.svg" alt="Fira" class="footer__logo-img">`;

// ─── NAV CONFIG ──────────────────────────────────────────────
const NAV_LINKS = [
  { id: 'produk',  label: 'PRODUK',  href: 'produk.html',  i18nKey: 'nav.produk' },
  { id: 'projek',  label: 'PROJEK',  href: 'projek.html',  i18nKey: 'nav.projek' },
  { id: 'about',   label: 'PROFIL',  href: 'about.html',   i18nKey: 'nav.about'  },
  { id: 'kontak',  label: 'KONTAK',  href: 'kontak.html',  i18nKey: 'nav.kontak' },
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

function renderKontakSidebar() {
  const phones = CONTACT_INFO.phones.map(p => `<p>${p}</p>`).join('');
  return `
<aside id="kontak-sidebar" class="ksb" role="dialog" aria-label="Hubungi Kami" aria-modal="true" aria-hidden="true">
  <div class="ksb__form-col">
    <h2 class="ksb__title" data-i18n-html="kontak.title">Kerja Sama<br>dengan Fira</h2>
    <form id="ksb-form" class="ksb-form" action="#" method="POST" novalidate>
      <div><input type="text"  name="nama"       placeholder="Nama ..."         required autocomplete="name"  data-i18n-placeholder="kontak.name.placeholder"></div>
      <div><input type="text"  name="departemen" placeholder="Departemen ..."                                  data-i18n-placeholder="kontak.dept.placeholder"></div>
      <div><input type="tel"   name="telepon"    placeholder="Nomor telfon ..."          autocomplete="tel"    data-i18n-placeholder="kontak.phone.placeholder"></div>
      <div><input type="email" name="email"      placeholder="Email ..."        required autocomplete="email"  data-i18n-placeholder="kontak.email.placeholder"></div>
      <div><textarea name="deskripsi" placeholder="Isi Pesan ..." rows="4"                                     data-i18n-placeholder="kontak.msg.placeholder"></textarea></div>
      <button type="submit" class="ksb__submit">
        <span data-i18n="kontak.send">KIRIM</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <p id="ksb-success" class="ksb__success" role="status" aria-live="polite" data-i18n="kontak.success">✓ Pesan berhasil terkirim!</p>
    </form>
  </div>
  <div class="ksb__info-col">
    <button class="ksb__close" id="ksb-close" aria-label="Tutup">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="ksb__section ksb__section--top">
      <address class="ksb__address" style="font-style:normal">${CONTACT_INFO.address}</address>
      <div class="ksb__phones">${phones}</div>
    </div>
    <div class="ksb__divider" role="separator"></div>
    <div class="ksb__section">
      <h3 class="ksb__hours-title" data-i18n="kontak.hours">Jam Operasional</h3>
      <div class="ksb__hours-rows">
        <div><p class="hours__day" data-i18n="kontak.weekdays">Senin — Jumat</p><p class="hours__time">08:00 — 17:00</p></div>
        <div><p class="hours__day" data-i18n="kontak.saturday">Sabtu</p><p class="hours__time">08:00 — 16:00</p></div>
        <div><p class="hours__day" data-i18n="kontak.sunday">Minggu</p><p class="hours__time hours__time--closed" data-i18n="kontak.closed">TUTUP</p></div>
      </div>
    </div>
  </div>
</aside>
<div id="kontak-overlay" class="kontak-overlay" aria-hidden="true"></div>`;
}

/**
 * Standard top navbar — used on About, Produk, Kontak pages.
 */
function renderNav(activePage = '') {
  const links = NAV_LINKS.map(({ id, label, href, i18nKey }) =>
    `<li>
      <a href="${href}" class="navbar__link${activePage === id ? ' active' : ''}">
        <span class="navbar__link-inner">
          <span data-i18n="${i18nKey}">${label}</span>
          <span aria-hidden="true" data-i18n="${i18nKey}">${label}</span>
        </span>
      </a>
    </li>`
  ).join('');

  return `
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar__inner">
    <a href="index.html" class="navbar__logo" aria-label="Fira — Home">${LOGO_NAV}</a>
    <ul class="navbar__links">${links}</ul>
    <button class="lang-toggle" id="lang-toggle" aria-label="Switch language">
      <span class="lang-toggle__opt" data-lang="en">
        <span class="lang-toggle__opt-inner">
          <span>EN</span>
          <span aria-hidden="true">EN</span>
        </span>
      </span>
      <span class="lang-toggle__sep" aria-hidden="true">|</span>
      <span class="lang-toggle__opt" data-lang="id">
        <span class="lang-toggle__opt-inner">
          <span>ID</span>
          <span aria-hidden="true">ID</span>
        </span>
      </span>
    </button>
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
        <a href="about.html" class="footer__col-title footer__col-title--link">Profil</a>
        <ul>${aboutLinks}</ul>
      </div>
      <div class="footer__col footer__contact">
        <a href="kontak.html" class="footer__col-title footer__col-title--link">Kontak</a>
        <p>${phones}${CONTACT_INFO.address}</p>
      </div>
      <div class="footer__col footer__social-col">
        <p class="footer__col-title" data-i18n="footer.follow">Ikuti Kami</p>
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
        <a href="produk.html" class="footer__col-title footer__col-title--link" data-i18n="footer.products">Produk</a>
        <ul>${produkLinks}</ul>
      </div>
      <div class="footer__col">
        <a href="projek.html" class="footer__col-title footer__col-title--link" data-i18n="footer.projects">Projek</a>
        <ul>${projekLinks}</ul>
      </div>
      <div class="footer__col">
        <a href="about.html" class="footer__col-title footer__col-title--link" data-i18n="footer.profile">Profil</a>
        <ul>${aboutLinks}</ul>
      </div>
      <div class="footer__col footer__contact">
        <a href="kontak.html" class="footer__col-title footer__col-title--link" data-i18n="footer.contact">Kontak</a>
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
        .replace('<nav class="navbar"', '<nav class="navbar logo-hidden"')
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

  // ── Kontak sidebar ─────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', renderKontakSidebar());

  const sidebar  = document.getElementById('kontak-sidebar');
  const overlay  = document.getElementById('kontak-overlay');
  const ksbClose = document.getElementById('ksb-close');

  function openSidebar() {
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const navbar = document.querySelector('.navbar');
    document.body.style.paddingRight = scrollbarW + 'px';
    if (navbar) navbar.style.right = scrollbarW + 'px';
    document.body.style.overflow = 'hidden';
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
    ksbClose.focus();
  }
  function closeSidebar() {
    const navbar = document.querySelector('.navbar');
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (navbar) navbar.style.right = '';
  }

  // Intercept every Kontak link across nav + footer
  document.querySelectorAll('a[href="kontak.html"]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); openSidebar(); });
  });

  ksbClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  // Sidebar form submission (same placeholder as kontak.html form)
  const ksbForm    = document.getElementById('ksb-form');
  const ksbSuccess = document.getElementById('ksb-success');
  if (ksbForm) {
    ksbForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = ksbForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const res = await fetch(ksbForm.action, {
          method: 'POST',
          body: new FormData(ksbForm),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          ksbForm.reset();
          if (ksbSuccess) ksbSuccess.classList.add('show');
        } else throw new Error();
      } catch {
        alert('Pesan gagal terkirim. Silakan coba lagi.');
        btn.disabled = false;
      }
    });
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
