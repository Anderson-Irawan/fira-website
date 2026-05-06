/**
 * main.js — General Interactions
 * ================================
 * Scroll effects, contact form handling,
 * and any small UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth <= 900;

  // ── Helpers ──────────────────────────────────────────────────

  // RAF-throttled scroll listener — prevents layout thrashing
  function onScroll(fn) {
    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { fn(); raf = null; });
    }, { passive: true });
  }

  // IntersectionObserver shorthand
  function observe(el, fn, opts = {}) {
    if (!el) return;
    new IntersectionObserver(fn, opts).observe(el);
  }

  // ─── VISI SLIDE — blue → black transition on mobile ──────────
  if (isMobile()) {
    const visiSlide = document.querySelector('.qit-track .qit-slide:nth-child(2)');
    observe(visiSlide, ([e]) => visiSlide?.classList.toggle('slide-dark', e.isIntersecting), { threshold: 0.3 });
  }

  // ─── TOPNAV ───────────────────────────────────────────────────
  const navbar   = document.querySelector('.navbar');
  const homeHero = document.querySelector('.home-hero');
  const footer   = document.querySelector('.footer');

  if (navbar && homeHero) {
    // Transparent background while hero is in view
    navbar.classList.add('navbar--transparent');
    observe(homeHero, ([e]) => navbar.classList.toggle('navbar--transparent', e.isIntersecting));

    // Nav logo hidden while hero logo is in view
    observe(homeHero.querySelector('.home-hero__img'),
      ([e]) => navbar.classList.toggle('logo-hidden', e.isIntersecting));
  }

  // Hide nav when footer enters; restore when footer leaves (home only: check hero is off-screen)
  observe(footer, ([e]) => {
    if (!navbar) return;
    if (!homeHero) {
      navbar.classList.toggle('is-hidden', e.isIntersecting);
    } else if (e.isIntersecting) {
      navbar.classList.add('is-hidden');
    } else if (homeHero.getBoundingClientRect().bottom <= 0) {
      navbar.classList.remove('is-hidden');
    }
  }, { threshold: 0.05 });

  // ─── PARALLAX — home hero background ─────────────────────────
  const heroBg = document.querySelector('.home-hero__bg');
  if (heroBg && !noMotion) {
    onScroll(() => { heroBg.style.transform = `translate3d(0,${window.scrollY * 0.35}px,0)`; });
  }

  // ─── HORIZONTAL SCROLL SECTIONS (.qit-pin) ───────────────────
  const hsPins = [...document.querySelectorAll('.qit-pin')];
  if (hsPins.length && !isMobile()) {
    const instances = hsPins.map(pinEl => {
      const track = pinEl.querySelector('.qit-track');
      if (!track) return null;
      return {
        pinEl,
        track,
        SLIDE_COUNT: track.querySelectorAll('.qit-slide').length,
        bgs: [...pinEl.querySelectorAll('.qit-bg')],
      };
    }).filter(Boolean);

    function updateHs() {
      instances.forEach(({ pinEl, track, SLIDE_COUNT, bgs }) => {
        const pinTop      = pinEl.getBoundingClientRect().top;
        const totalScroll = pinEl.offsetHeight - window.innerHeight;
        const scrolled    = Math.max(0, Math.min(-pinTop, totalScroll));
        const progress    = totalScroll > 0 ? scrolled / totalScroll : 0;
        const tx          = progress * (SLIDE_COUNT - 1) * window.innerWidth;
        track.style.transform = `translateX(${-tx.toFixed(1)}px)`;
        const activeIdx  = Math.round(progress * (SLIDE_COUNT - 1));
        const bgParallax = (progress - 0.5) * 60;
        bgs.forEach((bg, i) => {
          bg.classList.toggle('is-active', i === activeIdx);
          if (bg.tagName === 'IMG') bg.style.transform = `translateY(${bgParallax.toFixed(1)}px)`;
        });
      });
    }
    onScroll(updateHs);
    updateHs();
  }

  // ─── PARALLAX — QIT cards ─────────────────────────────────────
  const qitCards = [...document.querySelectorAll('.qit-card')];
  if (qitCards.length && !noMotion && !isMobile()) {
    const SPEEDS = [0.32, 0.20, 0.28];
    function updateQitCards() {
      const vh = window.innerHeight;
      qitCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const dist = (rect.top + rect.height / 2 - vh / 2) / vh;
        card.style.transform = `translateY(${(dist * vh * (SPEEDS[i] ?? 0.12)).toFixed(1)}px)`;
      });
    }
    onScroll(updateQitCards);
    updateQitCards();
  }

  // ─── PARALLAX — market sectors rows ──────────────────────────
  const sectorsSection = document.querySelector('.market-sectors');
  if (sectorsSection && !noMotion && !isMobile()) {
    const row1 = sectorsSection.querySelector('.sectors-row--1');
    const row2 = sectorsSection.querySelector('.sectors-row--2');
    if (row1 && row2) {
      function updateSectors() {
        const vh   = window.innerHeight;
        const vw   = window.innerWidth;
        const rect = sectorsSection.getBoundingClientRect();
        const tx   = Math.max(-vw * 0.25, Math.min(vw * 0.25,
          (rect.top + rect.height / 2 - vh / 2) / vh * vw * 0.22));
        row1.style.transform = `translateX(${tx.toFixed(1)}px)`;
        row2.style.transform = `translateX(${(-tx).toFixed(1)}px)`;
      }
      onScroll(updateSectors);
      updateSectors();
    }
  }

  // ─── PARALLAX — about hero + page hero + split images ────────
  const aboutHero = document.querySelector('.about-hero');
  if (aboutHero && !noMotion) {
    onScroll(() => aboutHero.style.setProperty('--ahero-ty', `${(window.scrollY * 0.35).toFixed(1)}px`));
  }

  const pageHero = document.querySelector('.page-hero');
  if (pageHero && !noMotion) {
    onScroll(() => pageHero.style.setProperty('--phero-ty', `${(window.scrollY * 0.35).toFixed(1)}px`));
  }

  const splitImgs = [...document.querySelectorAll('.split__media img')];
  if (splitImgs.length && !noMotion) {
    function updateSplit() {
      const vh = window.innerHeight;
      splitImgs.forEach(img => {
        const rect     = img.closest('.split__media').getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        img.style.transform = `translateY(${(progress * 140).toFixed(1)}px) scale(1.5)`;
      });
    }
    onScroll(updateSplit);
    updateSplit();
  }

  // ─── TRANSPARENT NAVBAR — interior hero pages ─────────────────
  const interiorHero = document.querySelector('.about-hero, .page-hero');
  if (interiorHero && navbar) {
    navbar.classList.add('navbar--transparent');
    observe(interiorHero, ([e]) => navbar.classList.toggle('navbar--transparent', e.isIntersecting));
  }

  // ─── CONTACT FORM ─────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn     = form.querySelector('button[type="submit"]');
      const success = document.getElementById('form-success');
      btn.disabled    = true;
      btn.textContent = 'Mengirim...';
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          if (success) success.classList.add('show');
          btn.textContent = 'Terkirim ✓';
        } else throw new Error();
      } catch {
        alert('Pesan gagal terkirim. Silakan coba lagi atau hubungi kami langsung.');
        btn.disabled    = false;
        btn.textContent = 'Kirim Pesan';
      }
    });
  }

  // ─── TYPEWRITER — cycling slogan ──────────────────────────────
  const typeTarget = document.getElementById('typewriter-text');
  const typeCursor = document.querySelector('.typewriter-cursor');
  if (typeTarget && typeCursor) {
    const words     = ['QUALITY.', 'INNOVATION.', 'TRUSTWORTHY.'];
    const delay     = ms => new Promise(res => setTimeout(res, ms));

    async function animateWord(word, ms, forward) {
      typeCursor.classList.add('typing');
      const steps = forward
        ? Array.from({ length: word.length + 1 }, (_, i) => i)
        : Array.from({ length: word.length + 1 }, (_, i) => word.length - i);
      for (const i of steps) { typeTarget.textContent = word.slice(0, i); await delay(ms / word.length); }
      typeCursor.classList.remove('typing');
    }

    (async () => {
      let i = 0;
      while (true) {
        await animateWord(words[i], 800, true);
        await delay(2000);
        await animateWord(words[i], 500, false);
        await delay(200);
        i = (i + 1) % words.length;
      }
    })();
  }

  // ─── STATS COUNT-UP ───────────────────────────────────────────
  function runStatCountup(container) {
    const els     = [...container.querySelectorAll('.stat__number')];
    const targets = els.map(el => parseInt(el.textContent, 10) || 0);
    const max     = Math.max(...targets);
    if (!max) return;
    els.forEach(el => { el.textContent = '0'; });
    const begin = performance.now();
    (function tick(now) {
      const rate = Math.min((now - begin) / 1800, 1);
      els.forEach((el, i) => { el.textContent = Math.min(Math.round(rate * max), targets[i]); });
      if (rate < 1) requestAnimationFrame(tick);
      else els.forEach((el, i) => { el.textContent = targets[i]; });
    }(performance.now()));
  }

  const statsContainer = document.querySelector('.stats__inner');
  if (statsContainer) {
    let counted = false, inView = false, hasData = false;
    const tryCount = () => { if (!counted && inView && hasData) { counted = true; runStatCountup(statsContainer); } };
    new MutationObserver(() => {
      if (statsContainer.querySelector('.stat__number')) { hasData = true; tryCount(); }
    }).observe(statsContainer, { childList: true });
    if (statsContainer.querySelector('.stat__number')) hasData = true;
    observe(statsContainer, ([e], obs) => {
      if (e.isIntersecting) { inView = true; tryCount(); obs.disconnect(); }
    }, { threshold: 0.4 });
  }

  // ─── SMOOTH SCROLL — anchor links ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      if (window._scrollTo) window._scrollTo(top);
      else window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── SCROLL-IN ANIMATIONS ─────────────────────────────────────
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); animateObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

  document.querySelectorAll('[data-stagger]').forEach(container => {
    let inView = false;
    const revealChildren = () => {
      [...container.children].forEach((child, i) => {
        if (!child.classList.contains('is-visible')) {
          child.style.transitionDelay = `${i * 0.08}s`;
          requestAnimationFrame(() => child.classList.add('is-visible'));
        }
      });
    };
    new MutationObserver(() => { if (inView) revealChildren(); }).observe(container, { childList: true });
    observe(container, ([e], obs) => {
      if (e.isIntersecting) { inView = true; revealChildren(); obs.disconnect(); }
    }, { threshold: 0.08 });
  });

});
