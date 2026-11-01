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
(function () {
  var caja = $("#inicio-tops-res");
  if (!caja) return;
  var region = "eu";
  try {
    var r = localStorage.getItem("oc:espia:region");
    if (r) region = r;
  } catch (e) {}
  api("GET", "/api/tops?region=" + encodeURIComponent(region) + "&ambito=all&orden=poder&limit=5")
    .then(function (data) {
      var lista = (data && data.general && data.general.length ? data.general : (data && data.lista) || []).slice(0, 5);
      if (!lista.length) {
        caja.innerHTML = "";
        return;
      }
      var medallas = ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49", "", ""];
      var html = '<ol class="inicio-tops-lista">';
      lista.forEach(function (p, idx) {
        var puestoNum = idx + 1;
        var medalla = medallas[idx] || ("#" + puestoNum);
        var ci = (typeof claseInfo === "function") ? claseInfo(p.clase) : null;
        var claseNombre = esc((typeof tr === "function" && ci) ? tr(ci) : (p.clase || ""));
        var foto = /^https:\/\/(profileimg\.plaync\.com|assets\.playnccdn\.com)\//.test(p.imagen || "")
          ? '<img class="pj-avatar" src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async">'
          : '<span class="espia-sin-foto"></span>';
        var emb = ci && ci.id
          ? '<img class="espia-clase" src="icons/clases/' + esc(ci.id) + '.webp" alt="" width="16" height="16">'
          : '';
        var meta = [];
        if (claseNombre) meta.push(claseNombre);
        if (p.servidor) meta.push(esc(p.servidor));
        if (p.region) meta.push(esc(String(p.region).toUpperCase()));
        var poderTxt = (typeof fmtPoder === "function") ? fmtPoder(p.poder) : (p.poder ? String(p.poder) : "");
        var ilvlTxt = p.nivel_objeto != null ? ((typeof fmtNum === "function") ? fmtNum(p.nivel_objeto) : String(p.nivel_objeto)) : "";
        var href = "build.html?cid=" + encodeURIComponent(p.character_id) +
          "&server=" + encodeURIComponent(p.server_id) +
          "&region=" + encodeURIComponent(p.region || region);

        html += '<li class="inicio-top-fila">' +
          '<a href="' + href + '" title="' + esc(t("tops.espia_build")) + '">' +
          '<span class="inicio-top-puesto' + (puestoNum <= 3 ? ' top-' + puestoNum : '') + '">' + medalla + '</span>' +
          '<span class="inicio-top-foto">' + foto + emb + '</span>' +
          '<span class="inicio-top-info">' +
            '<b>' + esc(p.nombre) + '</b>' +
            '<small>' + meta.join(' \u00B7 ') + '</small>' +
          '</span>' +
          '<span class="inicio-top-stats">' +
            (poderTxt ? '<span class="inicio-top-stat poder"><em>' + esc(t("tops.orden_poder")) + '</em><b>' + esc(poderTxt) + '</b></span>' : '') +
            (ilvlTxt ? '<span class="inicio-top-stat ilvl"><em>' + esc(t("espia.ilvl")) + '</em><b>' + esc(ilvlTxt) + '</b></span>' : '') +
          '</span>' +
          '</a></li>';
      });
      html += '</ol>';
      caja.innerHTML = html;
    })
    .catch(function () {
      caja.innerHTML = "";
    });
})();
