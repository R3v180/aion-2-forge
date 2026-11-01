/* Arranque de la home. Va en un script con defer, después de i18n, app,
   hero, vistas y noticias: así el parser no se bloquea y las funciones
   ya existen (un defer suelto en noticias/vistas rompía este orden). */
cabecera("inicio");
traducirPagina();
OC_HERO.pintar($("#heroe-carrusel"));
bloqueNoticiasInicio($("#noticias-inicio"));
api("GET", "/api/config").then(function (c) {
  var a = $("#cta-discord");
  if (a && c && c.discord && c.discord.invitacion) {
    a.href = c.discord.invitacion;
    a.hidden = false;
  }
}).catch(function () {});
var CDN_CLASES = "https://res.cloudinary.com/dpp6gyfao/image/upload/f_auto,q_auto,w_120/aion2/clases/";
var CDN_EMB = "https://res.cloudinary.com/dpp6gyfao/image/upload/f_auto,q_auto,w_64/aion2/clases/";
api("GET", "/api/estadisticas").catch(function () { return {}; }).then(function (n) {
  var total = CLASES_INFO.reduce(function (s, c) { return s + (n[c.id] || 0); }, 0);
  var visitas = typeof n.visitas === "number" ? n.visitas : 0;
  var dh = $("#datos-heroe");
  if (dh) {
    dh.innerHTML = [[CLASES_INFO.length, "inicio.dato_clases"], [CLASES_INFO.length * 35, "inicio.dato_habilidades"],
      [total, "inicio.dato_builds"], [fmtNum(visitas), "inicio.dato_visitas"]].map(function (d) {
      return "<div><b>" + d[0] + "</b><span>" + esc(t(d[1])) + "</span></div>";
    }).join("");
  }
  $("#lista-clases").innerHTML = CLASES_INFO.map(function (c) {
    return '<a class="tarjeta-clase" href="clase.html?c=' + c.id + '"><img class="arte" src="' + CDN_CLASES + c.id + '-arte" alt="" loading="lazy">' +
      (n[c.id] ? '<span class="chip cuenta">' + n[c.id] + " " + (n[c.id] === 1 ? "build" : "builds") + "</span>" : "") +
      '<div class="info"><img class="emb" src="' + CDN_EMB + c.id + '" alt="" width="38" height="38" loading="lazy" decoding="async"><div><b>' + esc(tr(c)) + "</b><small>" + esc(tr(c.rol)) + "</small></div></div></a>";
  }).join("");
});
api("GET", "/api/builds").then(function (l) {
  $("#recientes").innerHTML = l.length ? l.slice(0, 9).map(tarjetaBuild).join("") : '<div class="vacio-lista">' + esc(t("builds.vacio")) + "</div>";
});
function textoFaq(obj) {
  if (!obj) return "";
  return obj[IDIOMA] || obj.es || obj.en || "";
}
fetch("data/faq.json").then(function (r) { return r.json(); }).then(function (d) {
  var items = ((d && d.items) || []).slice(0, 6);
  var caja = $("#faq-lista");
  if (!caja) return;
  caja.innerHTML = items.map(function (it) {
    return '<details class="faq-item" id="faq-' + esc(it.id) + '">' +
      "<summary>" + esc(textoFaq(it.q)) + "</summary>" +
      "<div class=\"faq-a\"><p>" + esc(textoFaq(it.a)) + "</p></div></details>";
  }).join("");
}).catch(function () {});
