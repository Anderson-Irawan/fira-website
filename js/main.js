/**
 * main.js — General Interactions
 * ================================
 * Scroll effects, contact form handling,
 * and any small UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL OPACITY ─────────────────────────────────
  // Subtly increases navbar opacity / adds border on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      } else {
        navbar.style.borderBottom = 'none';
      }
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
