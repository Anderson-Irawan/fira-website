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

// ─── LOGO ────────────────────────────────────────────────────
const LOGO_NAV    = `<img src="assets/logo-fira.svg" alt="Fira" class="navbar__logo-img">`;
const LOGO_FOOTER = `<img src="assets/logo-fira.svg" alt="Fira" class="footer__logo-img">`;

// ─── NAV CONFIG ──────────────────────────────────────────────
const NAV_LINKS = [
  { id: 'produk',  label: 'Produk',  href: 'produk.html' },
  { id: 'about',   label: 'About',   href: 'about.html'  },
  { id: 'kontak',  label: 'Kontak',  href: 'kontak.html' },
];

// ─── FOOTER CONFIG ───────────────────────────────────────────
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
  address: 'JL. Kedinding Tengah II No. 16<br>Surabaya 60129<br>Jawa Timur — Indonesia',
};

// ─── RENDER FUNCTIONS ────────────────────────────────────────

/**
 * Standard top navbar — used on About, Produk, Kontak pages.
 */
function renderNav(activePage = '') {
  const links = NAV_LINKS.map(({ id, label, href }) =>
    `<li><a href="${href}" class="navbar__link${activePage === id ? ' active' : ''}">${label}</a></li>`
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
      <span class="sidenav__label">${label}</span>
      <span class="sidenav__bar" aria-hidden="true"></span>
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
        <p class="footer__col-title">Produk</p>
        <ul>${produkLinks}</ul>
      </div>
      <div class="footer__col">
        <p class="footer__col-title">About</p>
        <ul>${aboutLinks}</ul>
      </div>
      <div class="footer__col footer__contact">
        <p class="footer__col-title">Kontak</p>
        <p>${phones}${CONTACT_INFO.address}</p>
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
    navSlot.outerHTML = renderNav(page);
  }
  if (sideNavSlot) {
    const page = sideNavSlot.dataset.page || '';
    sideNavSlot.outerHTML = renderSideNav(page);
  }
  if (footerSlot) {
    footerSlot.outerHTML = renderFooter();
  }
});
