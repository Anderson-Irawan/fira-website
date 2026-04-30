/**
 * i18n.js — Language Switcher
 * ============================
 * English (EN) is the default. Language preference is stored in
 * localStorage so it persists across pages and sessions.
 *
 * Usage: add  data-i18n="key"            for textContent replacement
 *             data-i18n-html="key"        for innerHTML  replacement
 *             data-i18n-placeholder="key" for placeholder replacement
 */

const TRANSLATIONS = {

  en: {
    /* ── NAV ─────────────────────────────────────────── */
    'nav.produk':  'PRODUCTS',
    'nav.projek':  'PROJECTS',
    'nav.about':   'PROFILE',
    'nav.kontak':  'CONTACT',

    /* ── HOME HERO ───────────────────────────────────── */
    'home.hero.tagline': 'PT Bangun Citra Irawan is the sole manufacturer of "Fira" light steel — delivering the best quality, always innovating, and trustworthy.',

    /* ── HOME — TRUSTWORTHY SECTION ──────────────────── */
    'home.trust.body1': 'Light steel, commonly known as <strong>Galvalume / Zincalume</strong>, has recently played an important role in the construction of housing and other lightweight structures.',
    'home.trust.body2': 'Many construction projects today require wide spans or low-rise structures that are not too heavy. Light steel roof trusses are ideal for this — lightweight yet capable of supporting a range of roofing types. Fira continues to innovate, delivering the highest quality building materials for the people of Indonesia.',

    /* ── QIT SLIDES ──────────────────────────────────── */
    'qit.quality.body':    'Our factory is equipped with complete and advanced production facilities, including roll-forming machines, cranes, forklifts, and slitting machines to produce galvalume of the highest quality. Production capacity reaches 400 tonnes per month with a workforce of over 100 people.',
    'qit.innovation.body': 'Innovation and superior products are our speciality. We continuously strive to improve, innovating in both our products and customer services. We believe that outstanding service is the foundation of our continued growth and industry leadership.',
    'qit.trust.body':      'Fira brings a wide range of products trusted by our customers across Indonesia. Every product is carefully designed to meet market needs while fulfilling strict national and international quality standards.',
    'qit.trust.about.body':'Fira has developed a diverse range of Truss and Roof products tailored to market needs. We always guarantee products of high quality that meet both national and international standards.',

    /* ── SECTION HEADINGS ────────────────────────────── */
    'section.services':      'Our Services',
    'section.products':      'Products',
    'section.certifications':'Certifications',
    'section.testimonials':  'Testimonials',
    'section.background':    'Background',
    'section.vision':        'Vision',
    'section.mission':       'Mission',

    /* ── PRODUCTS SECTION ────────────────────────────── */
    'products.cta':                'View All Products',
    'products.desc':               'Light steel is high-strength, lightweight, and thin, yet has strength equivalent to conventional steel — 100% recyclable and produced to national standards.',
    'products.search.placeholder': 'Search our Product Catalogue ...',
    'products.notfound':           'Product not found. Try a different keyword.',

    /* ── ABOUT PAGE ──────────────────────────────────── */
    'about.quote':    'We are a light steel manufacturer that delivers the best quality, always innovating, and trustworthy.',
    'about.bg.body1': 'Today, light steel materials are widely used in construction thanks to the speed of work they enable, combined with good and strong quality. Buildings such as homes, offices, and industrial facilities all require light steel as a load-bearing structural support.',
    'about.bg.body2': 'PT Bangun Citra Irawan, brand owner of Fira, is a local manufacturer engaged in the production and construction of light steel for Eastern Indonesia specifically, and Indonesia as a whole.',

    /* ── VISION & MISSION ────────────────────────────── */
    'vision.1': 'To become a company that produces light steel materials with accountable quality.',
    'vision.2': 'To become a company capable of completing all light steel projects well, accurately, and with quality.',
    'vision.3': 'To become a well-integrated company capable of marketing its products throughout Indonesia.',
    'mission.1': 'Supporting consumers and increasing consumer confidence in Fira Truss & Roof products.',
    'mission.2': 'Prioritising distribution services by partnering with local distributors in various regions of Indonesia.',
    'mission.3': 'Expanding our network by developing new products from light steel materials.',
    'mission.4': 'Continuously innovating to create new light steel products.',

    /* ── STATS ───────────────────────────────────────── */
    'stat.products': 'Products',
    'stat.projects':  'Projects',
    'stat.years':     'Years of Experience',
    'stat.certs':     'Certifications',

    /* ── SERVICES (CMS-rendered) ─────────────────────── */
    'service.1.name': 'Residential Roofing',
    'service.1.desc': 'We install high-quality residential roofing that is durable and reflects your personal style.',
    'service.2.name': 'Commercial Roofing',
    'service.2.desc': 'We handle new roof installations, replacements, repairs, and maintenance for all commercial and industrial facilities.',
    'service.3.name': 'Galvalume Fabrication',
    'service.3.desc': 'Our galvalume fabricators deliver custom-ordered products offering precision, strength, and beauty.',

    /* ── PRODUCT / PROJECT CATEGORIES ───────────────── */
    'cat.atap':         'Roofing',
    'cat.truss':        'Truss',
    'cat.reng':         'Purlin',
    'cat.holo':         'Holo',
    'cat.wallpanel':    'Wall Panel',
    'cat.pvc':          'PVC',
    'cat.produk-lain':  'Other Products',
    'cat.residensial':  'Residential',
    'cat.komersial':    'Commercial',
    'cat.industrial':   'Industrial',
    'cat.institutional':'Institutional',

    /* ── SHOW MORE / LESS BUTTONS ────────────────────── */
    'btn.showmore': 'Show All',
    'btn.showless': 'Show Less',
    'btn.hide':     'Hide',

    /* ── PAGE HERO TITLES ────────────────────────────── */
    'produk.hero': 'Products',
    'projek.hero': 'Projects',

    /* ── FOOTER ──────────────────────────────────────── */
    'footer.products': 'Products',
    'footer.projects': 'Projects',
    'footer.profile':  'Profile',
    'footer.contact':  'Contact',
    'footer.follow':   'Follow Us',

    /* ── KONTAK SIDEBAR ──────────────────────────────── */
    'kontak.title':   'Work with<br>Fira',
    'kontak.send':    'SEND',
    'kontak.success': '✓ Message sent successfully!',
    'kontak.hours':   'Business Hours',
    'kontak.weekdays':'Monday — Friday',
    'kontak.saturday':'Saturday',
    'kontak.sunday':  'Sunday',
    'kontak.closed':  'CLOSED',
    'kontak.name.placeholder':  'Name ...',
    'kontak.dept.placeholder':  'Department ...',
    'kontak.phone.placeholder': 'Phone number ...',
    'kontak.email.placeholder': 'Email ...',
    'kontak.msg.placeholder':   'Message ...',
  },

  id: {
    /* ── NAV ─────────────────────────────────────────── */
    'nav.produk':  'PRODUK',
    'nav.projek':  'PROJEK',
    'nav.about':   'PROFIL',
    'nav.kontak':  'KONTAK',

    /* ── HOME HERO ───────────────────────────────────── */
    'home.hero.tagline': 'PT Bangun Citra Irawan adalah produsen tunggal atau baja ringan "Fira" yang memberikan kualitas terbaik, selalu berinovasi, dan dapat diandalkan.',

    /* ── HOME — TRUSTWORTHY SECTION ──────────────────── */
    'home.trust.body1': 'Baja ringan atau yang familiar kita sebut dengan <strong>Galvalume / Zincalume</strong> pada akhir-akhir ini mempunyai peranan yang penting dalam pembangunan perumahan maupun bangunan-bangunan tipis lainnya.',
    'home.trust.body2': 'Di rumahannya ini, banyak kebutuhan untuk bangunan yang membutuhkan dimensi yang lebar atau lantai yang tidak terlalu tinggi dan tidak terlalu berat. Rangka atap berbahan baja ringan dapat dibuat dengan rangka baja ringan karena ringan serta bisa memikul berbagai rangka atap yang terbuat dari bahan baja ringan terus berinovasi untuk memberikan bahan bangunan berkualitas terbaik untuk masyarakat Indonesia.',

    /* ── QIT SLIDES ──────────────────────────────────── */
    'qit.quality.body':    'Pabrik kami dilengkapi dengan fasilitas produksi yang lengkap dan berteknologi, seperti mesin roll-forming, crane, forklift, dan mesin slitting untuk memproduksi galvalume dengan kualitas terbaik. Kapasitas produksi mencapai 400 ton per bulan dengan tenaga kerja lebih dari 100 orang.',
    'qit.innovation.body': 'Inovasi dan produk yang unggul adalah keistimewaan kami. Kami terus berusaha untuk lebih baik, berinovasi dalam menghasilkan produk maupun layanan kepada pelanggan. Kami yakin bahwa kami harus didukung oleh pelayanan terbaik sehingga kami dapat semakin mantap dan selalu menjadi yang terdepan.',
    'qit.trust.body':      'Fira menghadirkan berbagai produk yang telah dipercaya oleh pelanggan kami di seluruh Indonesia. Setiap produk dirancang dengan cermat untuk memenuhi kebutuhan pasar, sekaligus memenuhi standar kualitas nasional dan internasional yang ketat.',
    'qit.trust.about.body':'Fira Trust pada saat ini telah membuat berbagai macam produk Truss dan Roof yang disesuaikan dengan kebutuhan pasar. Kami selalu menjamin menghasilkan produk yang berkualitas baik secara nasional maupun internasional.',

    /* ── SECTION HEADINGS ────────────────────────────── */
    'section.services':      'Servis Kita',
    'section.products':      'Produk',
    'section.certifications':'Sertifikasi',
    'section.testimonials':  'Testimoni',
    'section.background':    'Latar<br>Belakang',
    'section.vision':        'Visi',
    'section.mission':       'Misi',

    /* ── PRODUCTS SECTION ────────────────────────────── */
    'products.cta':                'Lihat Semua Produk',
    'products.desc':               'Baja ringan adalah baja mutu tinggi yang ringan dan tipis, namun memiliki kekuatan setara baja konvensional — 100% dapat didaur ulang dan diproduksi sesuai standar nasional.',
    'products.search.placeholder': 'Cari dari Katalog Produk Kami ...',
    'products.notfound':           'Produk tidak ditemukan. Coba kata kunci lain.',

    /* ── ABOUT PAGE ──────────────────────────────────── */
    'about.quote':    'Kami adalah produsen baja ringan yang memberikan kualitas terbaik, selalu berinovasi, dan dapat diandalkan.',
    'about.bg.body1': 'Di era saat ini, banyak kebutuhan bangunan yang menggunakan bahan baja ringan dikarenakan faktor kecepatan pengerjaan dengan kualitas yang baik dan kuat. Bangunan seperti rumah, perkantoran maupun industri amat membutuhkan bahan baja ringan ini sebagai penopang gaya yang saat ini sudah tidak bisa ditawarkan.',
    'about.bg.body2': 'PT Bangun Citra Irawan selaku pemegang merk Fira adalah produsen lokal yang bergerak di bidang produksi dan konstruksi baja ringan untuk daerah Indonesia Timur secara spesifik dan Indonesia secara keseluruhan.',

    /* ── VISION & MISSION ────────────────────────────── */
    'vision.1': 'Menjadi perusahaan yang memproduksi bahan baja ringan dengan kualitas yang dapat dipertanggungjawabkan.',
    'vision.2': 'Menjadi perusahaan yang dapat mengerjakan semua projek baja ringan dengan baik, tepat, dan berkualitas.',
    'vision.3': 'Menjadi perusahaan yang terintegrasi baik sehingga mampu memasarkan produknya ke seluruh Indonesia.',
    'mission.1': 'Mendukung konsumen dan meningkatkan kepercayaan konsumen dengan produk Fira Truss & Roof.',
    'mission.2': 'Mengutamakan jasa distribusi dengan mengandeng distributor lokal di berbagai daerah di Indonesia.',
    'mission.3': 'Memperluas jalinan relasi dengan membuat produk baru dari bahan baja ringan.',
    'mission.4': 'Terus berinovasi untuk membuat produk baru dari bahan baja ringan.',

    /* ── STATS ───────────────────────────────────────── */
    'stat.products': 'Produk',
    'stat.projects':  'Projek',
    'stat.years':     'Tahun Pengalaman',
    'stat.certs':     'Sertifikasi',

    /* ── SERVICES (CMS-rendered) ─────────────────────── */
    'service.1.name': 'Atap Residensial',
    'service.1.desc': 'Kami memasang atap rumah berkualitas tinggi yang tahan lama dan mencerminkan gaya pribadi Anda.',
    'service.2.name': 'Atap Komersial',
    'service.2.desc': 'Kami siap menangani pemasangan atap baru, penggantian atap, perbaikan, dan perawatan untuk seluruh fasilitas komersial dan industri.',
    'service.3.name': 'Fabrikasi Galvalume',
    'service.3.desc': 'Fabrikator galvalume kami menghadirkan produk pesanan khusus yang menawarkan presisi, kekuatan, dan keindahan.',

    /* ── PRODUCT / PROJECT CATEGORIES ───────────────── */
    'cat.atap':         'Atap',
    'cat.truss':        'Truss',
    'cat.reng':         'Reng',
    'cat.holo':         'Holo',
    'cat.wallpanel':    'Wallpanel',
    'cat.pvc':          'PVC',
    'cat.produk-lain':  'Produk Lain',
    'cat.residensial':  'Residensial',
    'cat.komersial':    'Komersial',
    'cat.industrial':   'Industrial',
    'cat.institutional':'Institutional',

    /* ── SHOW MORE / LESS BUTTONS ────────────────────── */
    'btn.showmore': 'Tampil Semua',
    'btn.showless': 'Tampil Lebih Sedikit',
    'btn.hide':     'Sembunyikan',

    /* ── PAGE HERO TITLES ────────────────────────────── */
    'produk.hero': 'Produk',
    'projek.hero': 'Projek',

    /* ── FOOTER ──────────────────────────────────────── */
    'footer.products': 'Produk',
    'footer.projects': 'Projek',
    'footer.profile':  'Profil',
    'footer.contact':  'Kontak',
    'footer.follow':   'Ikuti Kami',

    /* ── KONTAK SIDEBAR ──────────────────────────────── */
    'kontak.title':   'Kerja Sama<br>dengan Fira',
    'kontak.send':    'KIRIM',
    'kontak.success': '✓ Pesan berhasil terkirim!',
    'kontak.hours':   'Jam Operasional',
    'kontak.weekdays':'Senin — Jumat',
    'kontak.saturday':'Sabtu',
    'kontak.sunday':  'Minggu',
    'kontak.closed':  'TUTUP',
    'kontak.name.placeholder':  'Nama ...',
    'kontak.dept.placeholder':  'Departemen ...',
    'kontak.phone.placeholder': 'Nomor telfon ...',
    'kontak.email.placeholder': 'Email ...',
    'kontak.msg.placeholder':   'Isi Pesan ...',
  },
};

// ─── CORE ────────────────────────────────────────────────────
const DEFAULT_LANG = 'en';

function getLang() {
  return localStorage.getItem('fira-lang') || DEFAULT_LANG;
}

// ─── LOADING OVERLAY ─────────────────────────────────────────
function showLangOverlay(callback) {
  const base    = document.querySelector('meta[name="base-url"]')?.content || '';
  const overlay = document.createElement('div');
  overlay.className = 'lang-loader';
  overlay.innerHTML = `<img src="${base}assets/logos/logotype-square.svg" alt="Fira" class="lang-loader__logo">`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
      setTimeout(() => {
        callback();
        overlay.classList.remove('is-visible');
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      }, 420);
    });
  });
}

// ─── APPLY LANGUAGE ──────────────────────────────────────────
function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

  document.documentElement.lang = lang === 'en' ? 'en' : 'id';

  // Static text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Static HTML (for elements with inner markup)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // ── CMS-rendered: stat labels ──────────────────────────────
  const statKeys = ['stat.products', 'stat.projects', 'stat.years', 'stat.certs'];
  document.querySelectorAll('.stat__label').forEach((el, i) => {
    if (statKeys[i] && t[statKeys[i]]) el.textContent = t[statKeys[i]];
  });

  // ── CMS-rendered: service cards ────────────────────────────
  document.querySelectorAll('.servis-card__name').forEach((el, i) => {
    const key = `service.${i + 1}.name`;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('.servis-card__desc').forEach((el, i) => {
    const key = `service.${i + 1}.desc`;
    if (t[key]) el.textContent = t[key];
  });

  // ── CMS-rendered: category headings (products + projects) ──
  document.querySelectorAll('.cat-section .cat-name').forEach(el => {
    const section = el.closest('.cat-section');
    const catId   = section?.dataset.category || section?.id;
    if (catId && t[`cat.${catId}`]) el.textContent = t[`cat.${catId}`];
  });

  // ── CMS-rendered: home product card labels ─────────────────
  document.querySelectorAll('.home-prod-card .home-prod-card__label').forEach(el => {
    const link  = el.closest('a');
    const href  = link?.getAttribute('href') || '';
    const match = href.match(/#(.+)$/);
    if (match && t[`cat.${match[1]}`]) el.textContent = t[`cat.${match[1]}`];
  });

  // ── CMS-rendered: "Show All / Show Less" toggle labels ─────
  document.querySelectorAll('.cat-toggle').forEach(btn => {
    const lbl      = btn.querySelector('.cat-toggle__label');
    const isOpen   = btn.getAttribute('aria-expanded') === 'true';
    if (lbl) lbl.textContent = isOpen ? t['btn.hide'] : t['btn.showmore'];
  });

  // ── Update lang toggle button ──────────────────────────────
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.querySelectorAll('.lang-toggle__opt').forEach(opt => {
      opt.classList.toggle('is-active', opt.dataset.lang === lang);
    });
  });
}

// ─── TOGGLE ──────────────────────────────────────────────────
function toggleLanguage() {
  const next = getLang() === 'en' ? 'id' : 'en';
  showLangOverlay(() => {
    localStorage.setItem('fira-lang', next);
    applyLanguage(next);
  });
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(getLang());

  document.addEventListener('click', e => {
    if (e.target.closest('#lang-toggle')) toggleLanguage();
  });
});
