/**
 * main.js — General Interactions
 * ================================
 * Scroll effects, contact form handling,
 * and any small UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── TOPNAV: SHOW/HIDE BASED ON HERO VISIBILITY ───────────
  // On the home page the top navbar starts hidden (see components.js).
  // It slides in the moment the home-hero section is completely
  // off-screen, and hides again as soon as any part of the hero
  // re-enters the viewport (e.g. scroll back to top).
  const navbar   = document.querySelector('.navbar');
  const homeHero = document.querySelector('.home-hero');

  if (navbar && homeHero) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        const heroVisible = entries[0].isIntersecting;
        // Hero on-screen  → topnav hidden,  sidenav visible
        // Hero off-screen → topnav visible, sidenav hidden
        navbar.classList.toggle('is-hidden', heroVisible);
        sidenav?.classList.toggle('is-hidden', !heroVisible);
        sidenavLogo?.classList.toggle('is-hidden', !heroVisible);
      },
      { threshold: 0 }  // fires as soon as a single pixel leaves/enters
    );
    heroObserver.observe(homeHero);
  }

  // ─── ALL NAVS — HIDE ON FOOTER ─────────────────────────────
  // Sidenav, sidenav-logo AND the top navbar all fade / slide out
  // smoothly the moment the footer enters the viewport.
  const footer      = document.querySelector('.footer');
  const sidenav     = document.querySelector('.sidenav');
  const sidenavLogo = document.querySelector('.sidenav-logo');

  if (footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        const entering = entries[0].isIntersecting;
        sidenav?.classList.toggle('is-hidden', entering);
        sidenavLogo?.classList.toggle('is-hidden', entering);
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

  // ─── NAVBAR SUBTLE BORDER ON SCROLL ────────────────────────
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.borderBottom = window.scrollY > 40
        ? '1px solid rgba(255,255,255,0.06)'
        : 'none';
    }, { passive: true });
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
    const TYPE_MS     = 1500;   // total time to type one word
    const LINGER_MS   = 4000;   // how long the full word stays visible
    const ERASE_MS    = 700;    // total time to erase (fast wipe)

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

  // ─── SCROLL-IN ANIMATIONS (Intersection Observer) ──────────
  // Adds .is-visible class when elements enter viewport.
  // Hook CSS transitions onto [data-animate] elements.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

});
