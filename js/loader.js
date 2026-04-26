/**
 * loader.js — Page entry loading screen
 * =======================================
 * Injects a full-screen blue overlay with the Fira logo and a
 * 0 % → 99 % counter. Runs on every page load, then slides up
 * to reveal the content once the count finishes.
 */
(function () {

  // ── Build the overlay element immediately ──────────────────
  const overlay = document.createElement('div');
  overlay.id        = 'page-loader';
  overlay.className = 'page-loader';
  overlay.innerHTML = `
    <img
      src="assets/logos/logotype-square.svg"
      alt="Fira"
      class="page-loader__logo"
    >
    <p class="page-loader__pct" id="loader-pct">0%</p>
  `;

  // Only show once per browser session — skip on all subsequent pages
  if (sessionStorage.getItem('fira_loaded')) return;
  sessionStorage.setItem('fira_loaded', '1');

  // Prepend before anything else so it covers the page instantly
  document.addEventListener('DOMContentLoaded', () => {
    document.body.prepend(overlay);
    runCounter();
  });

  // ── Counter animation: 0 % → 99 % with ease-out decel ─────
  function runCounter() {
    const pctEl    = document.getElementById('loader-pct');
    const DURATION = 2200; // ms — total count time
    const begin    = performance.now();

    // Cubic ease-out: starts fast, decelerates toward 99
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const t = Math.min((now - begin) / DURATION, 1);
      const n = Math.floor(easeOut(t) * 99);
      if (pctEl) pctEl.textContent = n + '%';

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // Hold at 99 % briefly, then slide the overlay away
        if (pctEl) pctEl.textContent = '99%';
        setTimeout(dismiss, 220);
      }
    }

    requestAnimationFrame(tick);
  }

  // ── Dismiss: slide overlay up off-screen ──────────────────
  function dismiss() {
    overlay.classList.add('page-loader--done');
    // Remove from DOM after the CSS transition completes
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

})();
