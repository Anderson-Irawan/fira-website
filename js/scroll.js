// Lenis handles all smooth scrolling (loaded inline in each HTML page).
// This file exposes _scrollTo so back-to-top and anchor links use Lenis too.
window._scrollTo = function (y) {
  if (window.lenis) window.lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: 'smooth' });
};
