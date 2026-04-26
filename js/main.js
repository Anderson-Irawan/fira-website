/**
 * main.js — General Interactions
 * ================================
 * Scroll effects, contact form handling,
 * and any small UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── TOPNAV: SHOW/HIDE BASED ON HERO VISIBILITY ───────────
  // On the home page the top navbar starts hidden (see components.js).
  // It slides in the moment the home-hero section is completely
  // off-screen, and hides again as soon as any part of the hero
  // re-enters the viewport (e.g. scroll back to top).
  const navbar   = document.querySelector('.navbar');
  const homeHero = document.querySelector('.home-hero');

  if (navbar && homeHero) {
    // Logo in nav only appears once the hero logo has scrolled off-screen
    const heroLogo = homeHero.querySelector('.home-hero__img');
    if (heroLogo) {
      new IntersectionObserver(
        (entries) => { navbar.classList.toggle('logo-hidden', entries[0].isIntersecting); },
        { threshold: 0 }
      ).observe(heroLogo);
    }
  }

  // ─── ALL NAVS — HIDE ON FOOTER ─────────────────────────────
  // Sidenav, sidenav-logo AND the top navbar all fade / slide out
  // smoothly the moment the footer enters the viewport.
  const footer = document.querySelector('.footer');

  if (footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        const entering = entries[0].isIntersecting;
        if (navbar && !homeHero) {
          // Non-home pages: topnav follows footer — hide when footer
          // is visible, reappear when footer leaves.
          navbar.classList.toggle('is-hidden', entering);
        } else if (navbar && homeHero) {
          if (entering) {
            // Footer entering → always hide topnav
            navbar.classList.add('is-hidden');
          } else {
            // Footer leaving — restore topnav only if the hero is
            // completely off-screen (i.e. user is mid-page, not at top)
            const heroRect = homeHero.getBoundingClientRect();
            if (heroRect.bottom <= 0) {
              navbar.classList.remove('is-hidden');
            }
          }
        }
      },
      { threshold: 0.05 }
    );
    footerObserver.observe(footer);
  }

  // ─── HERO PARALLAX ─────────────────────────────────────────
  const heroBg = document.querySelector('.home-hero__bg');
  if (heroBg && !noMotion) {
    let rafParallax = null;
    window.addEventListener('scroll', () => {
      if (rafParallax) return;
      rafParallax = requestAnimationFrame(() => {
        heroBg.style.transform = `translate3d(0,${window.scrollY * 0.35}px,0)`;
        rafParallax = null;
      });
    }, { passive: true });
  }

  // ─── HORIZONTAL SCROLL SECTIONS (.qit-pin) ─────────────────
  // Generic — drives any number of pinned horizontal tracks on
  // the same page (index: QIT values; about: LVM sections).
  const hsPins = [...document.querySelectorAll('.qit-pin')];

  if (hsPins.length) {
    const hsInstances = hsPins.map(pinEl => {
      const track = pinEl.querySelector('.qit-track');
      if (!track) return null;
      return {
        pinEl,
        track,
        SLIDE_COUNT: track.querySelectorAll('.qit-slide').length,
        bgs: [...pinEl.querySelectorAll('.qit-bg')],
      };
    }).filter(Boolean);

    function updateAllHs() {
      hsInstances.forEach(({ pinEl, track, SLIDE_COUNT, bgs }) => {
        const pinTop      = pinEl.getBoundingClientRect().top;
        const totalScroll = pinEl.offsetHeight - window.innerHeight;
        const scrolled    = Math.max(0, Math.min(-pinTop, totalScroll));
        const progress    = totalScroll > 0 ? scrolled / totalScroll : 0;
        const tx          = progress * (SLIDE_COUNT - 1) * window.innerWidth;

        track.style.transform = `translateX(${-tx.toFixed(1)}px)`;

        const activeIdx = Math.round(progress * (SLIDE_COUNT - 1));
        bgs.forEach((bg, i) => bg.classList.toggle('is-active', i === activeIdx));
      });
    }

    let rafHs = null;
    window.addEventListener('scroll', () => {
      if (rafHs) return;
      rafHs = requestAnimationFrame(() => { updateAllHs(); rafHs = null; });
    }, { passive: true });
    updateAllHs();
  }

  // ─── ABOUT-HERO PARALLAX ───────────────────────────────────
  // Same scroll-from-top pattern as the home hero.
  const aboutHero = document.querySelector('.about-hero');
  if (aboutHero && !noMotion) {
    let rafAbout = null;
    window.addEventListener('scroll', () => {
      if (rafAbout) return;
      rafAbout = requestAnimationFrame(() => {
        aboutHero.style.setProperty('--ahero-ty', `${(window.scrollY * 0.35).toFixed(1)}px`);
        rafAbout = null;
      });
    }, { passive: true });
  }

  // ─── PAGE-HERO PARALLAX (Produk / Projek) ──────────────────
  const pageHero = document.querySelector('.page-hero');
  if (pageHero && !noMotion) {
    let rafPage = null;
    window.addEventListener('scroll', () => {
      if (rafPage) return;
      rafPage = requestAnimationFrame(() => {
        pageHero.style.setProperty('--phero-ty', `${(window.scrollY * 0.35).toFixed(1)}px`);
        rafPage = null;
      });
    }, { passive: true });
  }

  // ─── SPLIT MEDIA PARALLAX ──────────────────────────────────
  // Visi / Misi images on about.html — viewport-centre approach,
  // same as QIT. Images are oversized via CSS (inset: -20% 0) so
  // translateY never reveals a gap.
  const splitImgs = [...document.querySelectorAll('.split__media img')];
  if (splitImgs.length && !noMotion) {
    function updateSplitParallax() {
      const vh = window.innerHeight;
      splitImgs.forEach(img => {
        const wrap    = img.closest('.split__media');
        const rect    = wrap.getBoundingClientRect();
        const center  = rect.top + rect.height / 2;
        const progress = (center - vh / 2) / vh;
        img.style.transform = `translateY(${(progress * 140).toFixed(1)}px) scale(1.5)`;
      });
    }
    let rafSplit = null;
    window.addEventListener('scroll', () => {
      if (rafSplit) return;
      rafSplit = requestAnimationFrame(() => { updateSplitParallax(); rafSplit = null; });
    }, { passive: true });
    updateSplitParallax();
  }

  // ─── CONTACT FORM ──────────────────────────────────────────
  // Intercepts submission for a smooth UX.
  // Replace the action attribute on the <form> with your
  // Formspree / EmailJS endpoint to send real emails.
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
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          form.reset();
          if (success) success.classList.add('show');
          btn.textContent = 'Terkirim ✓';
        } else {
          throw new Error('Server error');
        }
      } catch {
        // Fallback: show basic alert if fetch fails
        alert('Pesan gagal terkirim. Silakan coba lagi atau hubungi kami langsung.');
        btn.disabled    = false;
        btn.textContent = 'Kirim Pesan';
      }
    });
  }

  // ─── TYPEWRITER — "We are ___." cycling slogan ─────────────
  // Cycles: QUALITY → INNOVATION → TRUSTWORTHY.
  // Each word types in over 1.5 s, lingers for 4 s, then erases.
  const typeTarget = document.getElementById('typewriter-text');
  const typeCursor = document.querySelector('.typewriter-cursor');

  if (typeTarget && typeCursor) {
    const words       = ['QUALITY.', 'INNOVATION.', 'TRUSTWORTHY.'];
    const TYPE_MS     = 800;    // total time to type one word
    const LINGER_MS   = 2000;   // how long the full word stays visible
    const ERASE_MS    = 500;    // total time to erase (fast wipe)

    let wordIndex = 0;

    function delay(ms) {
      return new Promise(res => setTimeout(res, ms));
    }

    async function typeWord(word) {
      const charDelay = TYPE_MS / word.length;
      typeCursor.classList.add('typing');       // solid cursor while typing
      for (let i = 0; i <= word.length; i++) {
        typeTarget.textContent = word.slice(0, i);
        await delay(charDelay);
      }
      typeCursor.classList.remove('typing');    // resume blinking while lingering
    }

    async function eraseWord(word) {
      const charDelay = ERASE_MS / word.length;
      typeCursor.classList.add('typing');
      for (let i = word.length; i >= 0; i--) {
        typeTarget.textContent = word.slice(0, i);
        await delay(charDelay);
      }
      typeCursor.classList.remove('typing');
    }

    async function runLoop() {
      while (true) {
        const word = words[wordIndex];
        await typeWord(word);
        await delay(LINGER_MS);
        await eraseWord(word);
        await delay(200);                       // brief pause before next word
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    runLoop();
  }

  // ─── STATS COUNT-UP ─────────────────────────────────────────
  // All numbers increment at the same absolute rate, so smaller
  // values finish first — 14 locks in before 20, then 22, then 26.
  function runStatCountup(container) {
    const els = [...container.querySelectorAll('.stat__number')];
    if (!els.length) return;

    const targets = els.map(el => parseInt(el.textContent, 10) || 0);
    const max     = Math.max(...targets);
    if (!max) return;

    // Reset all to 0 before animating
    els.forEach(el => { el.textContent = '0'; });

    const DURATION = 1800; // ms — time for the largest number to finish
    const begin    = performance.now();

    (function tick(now) {
      const rate    = Math.min((now - begin) / DURATION, 1);
      const current = rate * max;                          // same speed for all
      els.forEach((el, i) => {
        el.textContent = Math.min(Math.round(current), targets[i]);
      });
      if (rate < 1) requestAnimationFrame(tick);
      else els.forEach((el, i) => { el.textContent = targets[i]; }); // exact final
    }(performance.now()));
  }

  const statsContainer = document.querySelector('.stats__inner');
  if (statsContainer) {
    let counted = false;
    let inView  = false;
    let hasData = false;

    const tryCount = () => {
      if (counted || !inView || !hasData) return;
      counted = true;
      runStatCountup(statsContainer);
    };

    // Handle CMS rendering stats asynchronously
    new MutationObserver(() => {
      if (statsContainer.querySelector('.stat__number')) {
        hasData = true;
        tryCount();
      }
    }).observe(statsContainer, { childList: true });

    // Also check if stats are already in the DOM (non-CMS fallback)
    if (statsContainer.querySelector('.stat__number')) hasData = true;

    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        inView = true;
        tryCount();
        obs.disconnect();
      }
    }, { threshold: 0.4 }).observe(statsContainer);
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // account for fixed navbar
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL-IN: single elements [data-animate] ─────────────
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    animateObserver.observe(el);
  });

  // ─── SCROLL-IN: stagger grid children [data-stagger] ────────
  // Works for both static HTML and CMS-rendered children —
  // a MutationObserver watches for late-arriving DOM nodes and
  // animates them the moment they appear (if already in view).
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

    // Watch for CMS injecting children after the observer fires
    new MutationObserver(() => {
      if (inView) revealChildren();
    }).observe(container, { childList: true });

    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        inView = true;
        revealChildren();
        obs.disconnect();
      }
    }, { threshold: 0.08 }).observe(container);
  });

});
