/**
 * transitions.js — Seamless page-to-page fades
 * =============================================
 * Strategy (same as Turner Construction and similar sites):
 *   On click → cover with black curtain instantly
 *             → fetch() the destination page
 *             → preload its critical images into the browser cache
 *             → navigate (cached page = ~instant browser load)
 *             → new page: curtain stays up until window.load
 *             → curtain fades out to a fully-painted page
 *
 * First load  → loader.js handles the reveal; curtain stays hidden.
 * Subsequent  → curtain opaque on click; images preloaded; navigate;
 *               window.load on new page → curtain fades out.
 */
(function () {
  var FADE        = 280;   // ms — curtain fade-out duration
  var MAX_WAIT    = 4000;  // ms — reveal anyway if load is very slow
  var MAX_PRELOAD = 3000;  // ms — max time spent prefetching before navigating

  // ── Curtain element ─────────────────────────────────────────
  var curtain = document.createElement('div');
  curtain.id = 'pg-curtain';
  curtain.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:#120F0D',
    'z-index:9998',
    'pointer-events:none',
    'opacity:1',
  ].join(';');
  document.documentElement.appendChild(curtain);

  // First load: loader.js handles the reveal; curtain starts hidden
  var firstLoad = !sessionStorage.getItem('fira_loaded');
  if (firstLoad) {
    curtain.style.opacity = '0';
  }

  // ── Reveal ───────────────────────────────────────────────────
  var revealed = false;
  var fallback;

  function reveal() {
    if (revealed) return;
    revealed = true;
    clearTimeout(fallback);
    curtain.style.transition = 'opacity ' + FADE + 'ms ease';
    // Extra rAF pair ensures images are composited, not just decoded
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.style.opacity = '0';
      });
    });
  }

  if (!firstLoad) {
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          reveal();
        });
      });
    }, { once: true });
    fallback = setTimeout(reveal, MAX_WAIT);
  }

  // ── CSS ::before hero backgrounds — not in <img> tags, mapped manually ─
  var HERO_BG = {
    'produk.html': 'assets/images/produk-1.jpg',
    'projek.html': 'assets/images/pexels-rezwan-1145434.jpg',
  };

  // ── Image preloader ──────────────────────────────────────────
  function preloadImg(url) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = i.onerror = res;
      i.src = url;
    });
  }

  // ── Click interception ───────────────────────────────────────
  window.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;

      var a = e.target.closest('a[href]');
      if (!a) return;

      var href = a.getAttribute('href');
      if (
        !href ||
        href.charAt(0) === '#' ||
        /^(https?:|mailto:|tel:)/.test(href) ||
        a.target === '_blank'
      ) return;

      e.preventDefault();

      // Cover instantly — no fade-in so the old page disappears in one frame
      curtain.style.transition  = 'none';
      curtain.style.opacity     = '1';
      curtain.style.pointerEvents = 'all';

      var destHref = a.href;
      var destFile = destHref.replace(/[?#].*$/, '').split('/').pop() || 'index.html';

      // Guard against the timeout and the fetch both calling go()
      var gone = false;
      function go() {
        if (gone) return;
        gone = true;
        window.location.href = destHref;
      }

      // Never hold the curtain longer than MAX_PRELOAD ms
      var safeTimer = setTimeout(go, MAX_PRELOAD);

      // Fetch the page, preload all its images, then navigate from cache
      fetch(destHref)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc  = new DOMParser().parseFromString(html, 'text/html');
          var base = destHref;
          var loads = [];

          // 1. Every <img src> in the page
          doc.querySelectorAll('img[src]').forEach(function (img) {
            var src = img.getAttribute('src');
            if (!src) return;
            try { loads.push(preloadImg(new URL(src, base).href)); } catch (err) {}
          });

          // 2. Inline style="background-image:url(...)" (e.g. qit-static items)
          doc.querySelectorAll('[style*="background-image"]').forEach(function (el) {
            var m = (el.getAttribute('style') || '').match(/url\(['"]?([^'")\s]+)['"]?\)/i);
            if (m) try { loads.push(preloadImg(new URL(m[1], base).href)); } catch (err) {}
          });

          // 3. CSS ::before hero background (produk / projek pages)
          if (HERO_BG[destFile]) {
            try { loads.push(preloadImg(new URL(HERO_BG[destFile], base).href)); } catch (err) {}
          }

          clearTimeout(safeTimer);
          return Promise.all(loads);
        })
        .then(go)
        .catch(function () { clearTimeout(safeTimer); go(); });
    });
  });
}());
