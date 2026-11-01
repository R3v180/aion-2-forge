/* Script bloqueante y mínimo: elige un idioma y inserta solo ese paquete
   (js/i18n-<lang>.min.js) antes de js/i18n.min.js.
   document.write solo funciona mientras el parser está en este script. */
(function () {
  var LANGS = { es: 1, en: 1, fr: 1, de: 1, pt: 1, ru: 1, ko: 1, ja: 1 };
  var l = null;
  try { l = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (!LANGS[l]) {
    try { l = localStorage.getItem("idioma"); } catch (e2) {}
  }
  if (!LANGS[l]) {
    var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    l = LANGS[nav] ? nav : "es";
  }
  window.__IDIOMA_BOOT = l;
  if (document.documentElement) document.documentElement.lang = l;
  /* En la home (__I18N_DEFER) el paquete va con defer, delante de i18n.min.js.
     En el resto de páginas tiene que ejecutarse ya: el script siguiente es síncrono. */
  var extra = window.__I18N_DEFER ? " defer" : "";
  document.write('<script src="js/i18n-' + l + '.min.js?v=81"' + extra + '><\/script>');
})();
