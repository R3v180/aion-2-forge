// Noticias oficiales de AION 2: avisos y parches primero (útil si no puedes entrar).
var TABLONES_NC = ["notice", "update", "movie_clip"];
var RE_MANTENIMIENTO = /mantenimiento|maintenance|interrupci[oó]n|outage|downtime|servidores?\s+afect|ca[ií]da|compensaci[oó]n/i;
var URL_CRONICA = { es: "https://aion2.plaync.com/es-es/history/index", en: "https://aion2.plaync.com/en-us/history/index" };
var URL_OFICIAL = { es: "https://aion2.plaync.com/es-es/board/notice/list", en: "https://aion2.plaync.com/en-us/board/notice/list" };

function idiomaNoticias() { return IDIOMA === "en" ? "en" : "es"; }
function fechaNoticia(iso) {
  return new Date(iso).toLocaleDateString(IDIOMA === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function fechaCorta(iso) {
  return new Date(iso).toLocaleDateString(IDIOMA === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "short" });
}
function imagenNoticia(n) {
  return /^https:\/\/[a-z0-9.-]*(playnccdn|plaync)\.com\//.test(n.imagen || "")
    ? n.imagen.replace("/download_thumbnail/", "/download/") : "";
}
function esMantenimiento(n) {
  return n.tablon === "notice" && RE_MANTENIMIENTO.test((n.titulo || "") + " " + (n.resumen || ""));
}
function tarjetaNoticia(n, grande, conFoto) {
  var foto = conFoto ? imagenNoticia(n) : "";
  return '<a class="noticia' + (grande ? " grande" : "") + (foto ? "" : " sin-foto") + " t-" + n.tablon + '" href="noticia.html?id=' + n.id + '">' +
    (foto ? '<div class="foto"><img src="' + esc(foto) + '" alt="" loading="lazy">' +
      '<span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>" +
      (n.tablon === "movie_clip" ? '<span class="play">▶</span>' : "") + "</div>" : "") +
    '<div class="txt">' +
    (foto ? "" : '<span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>") +
    "<time>" + esc(fechaNoticia(n.publicado)) + "</time><h3>" + esc(n.titulo) + "</h3>" +
    (n.resumen && n.tablon !== "movie_clip" ? "<p>" + esc(n.resumen) + "</p>" : "") +
    (n.texto_en ? '<small class="chip en">' + esc(t("noticias.en_ingles")) + "</small>" : "") + "</div></a>";
}

function filaNoticia(n) {
  // NC reutiliza el banner «Anuncios» con URLs distintas: en lista no aportan y confunden
  var urg = esMantenimiento(n);
  return '<a class="noticia-fila t-' + n.tablon + (urg ? " urg" : "") + '" href="noticia.html?id=' + n.id + '">' +
    '<div class="nf-meta"><time>' + esc(fechaCorta(n.publicado)) + '</time>' +
    '<span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>" +
    (urg ? '<span class="chip urg">' + esc(t("noticias.mantenimiento")) + "</span>" : "") +
    (n.texto_en ? '<span class="chip en">' + esc(t("noticias.en_ingles")) + "</span>" : "") + "</div>" +
    "<h3>" + esc(n.titulo) + "</h3>" +
    (n.resumen && n.tablon !== "movie_clip" ? "<p>" + esc(n.resumen) + "</p>" : "") +
    "</a>";
}

function tarjetaEstado(n, tipo) {
  if (!n) {
    return '<div class="estado-card vacia t-' + tipo + '"><span class="antetitulo">' + esc(t("noticias.estado_" + tipo)) +
      "</span><b>—</b><small>" + esc(t("noticias.sin_dato")) + "</small></div>";
  }
  return '<a class="estado-card t-' + tipo + '" href="noticia.html?id=' + n.id + '">' +
    '<span class="antetitulo">' + esc(t("noticias.estado_" + tipo)) + "</span>" +
    "<b>" + esc(n.titulo) + "</b>" +
    "<small>" + esc(fechaNoticia(n.publicado)) + "</small></a>";
}

function elegirEstado(lista) {
  var mant = null, parche = null, aviso = null;
  lista.forEach(function (n) {
    if (!parche && n.tablon === "update") parche = n;
    if (!mant && esMantenimiento(n)) mant = n;
    if (!aviso && n.tablon === "notice") aviso = n;
  });
  return { mant: mant || aviso, parche: parche };
}

function bloqueNoticiasInicio(caja) {
  Promise.all([
    api("GET", "/api/noticias?limite=12&idioma=" + idiomaNoticias()),
    api("GET", "/api/noticias?limite=1&tablon=update&idioma=" + idiomaNoticias())
  ]).then(function (r) {
    var l = r[0] || [];
    if (!l.length) { caja.closest("section").hidden = true; return; }
    var est = elegirEstado(l);
    if (!est.parche && r[1] && r[1][0]) est.parche = r[1][0];
    var utiles = l.filter(function (n) { return n.tablon !== "movie_clip"; }).slice(0, 5);
    caja.innerHTML = '<div class="noticias-estado">' + tarjetaEstado(est.mant, "aviso") + tarjetaEstado(est.parche, "parche") + "</div>" +
      '<div class="lista-noticias compacta">' + utiles.map(filaNoticia).join("") + "</div>" +
      '<p class="noticias-mas"><a href="noticias.html">' + esc(t("noticias.ver_todas")) + "</a></p>";
  }).catch(function () { caja.closest("section").hidden = true; });
}

function paginaNoticias() {
  var main = $("#main"), tablon = param("t");
  if (TABLONES_NC.indexOf(tablon) < 0) tablon = "";
  var lang = idiomaNoticias();
  cabecera("noticias").then(function () {
    main.innerHTML = '<section class="cabeza-seccion"><span class="antetitulo">' + esc(t("noticias.antetitulo")) + "</span><h1>" +
      esc(t("noticias.titulo")) + '</h1><p class="suave">' + esc(t("noticias.sub")) + "</p>" +
      '<p class="noticias-enlaces"><a href="' + esc(URL_OFICIAL[lang]) + '" target="_blank" rel="noopener">' + esc(t("noticias.web_oficial")) +
      '</a> · <a href="' + esc(URL_CRONICA[lang]) + '" target="_blank" rel="noopener">' + esc(t("noticias.cronica")) + "</a></p></section>" +
      '<div class="noticias-estado" id="estado"></div>' +
      '<nav class="pestanas-foro">' + [""].concat(TABLONES_NC).map(function (tb) {
        return '<a href="noticias.html' + (tb ? "?t=" + tb : "") + '"' + (tb === tablon ? ' class="on"' : "") + ">" +
          esc(t(tb ? "noticias.t_" + tb : "noticias.utiles")) + "</a>";
      }).join("") + "</nav>" +
      '<div class="lista-noticias" id="lista"><div class="vacio-lista">' + esc(t("comun.cargando")) + "</div></div>";
    return Promise.all([
      api("GET", "/api/noticias?limite=40&idioma=" + lang + (tablon ? "&tablon=" + tablon : "")),
      api("GET", "/api/noticias?limite=24&idioma=" + lang)
    ]);
  }).then(function (r) {
    var l = r[0] || [];
    var est = elegirEstado(r[1] || l);
    $("#estado").innerHTML = tarjetaEstado(est.mant, "aviso") + tarjetaEstado(est.parche, "parche");
    var mostrar = tablon ? l : l.filter(function (n) { return n.tablon !== "movie_clip"; });
    if (tablon === "movie_clip") {
      $("#lista").className = "rejilla-noticias";
      $("#lista").innerHTML = mostrar.length
        ? mostrar.map(function (n) { return tarjetaNoticia(n, false, !!imagenNoticia(n)); }).join("")
        : '<div class="vacio-lista">' + esc(t("noticias.vacio")) + "</div>";
      return;
    }
    $("#lista").className = "lista-noticias";
    $("#lista").innerHTML = mostrar.length
      ? mostrar.map(filaNoticia).join("")
      : '<div class="vacio-lista">' + esc(t("noticias.vacio")) + "</div>";
  }).catch(function (e) {
    var lista = $("#lista");
    if (!lista) return;
    lista.innerHTML = '<div class="vacio-lista vacio-cta"><p><b>' + esc(textoError(e)) + "</b></p><p>" +
      esc(t("noticias.error_local")) + '</p><p class="noticias-enlaces"><a href="' + esc(URL_OFICIAL[idiomaNoticias()]) +
      '" target="_blank" rel="noopener">' + esc(t("noticias.web_oficial")) + "</a> · <a href=\"" +
      esc(WEB_PRINCIPAL + "/noticias.html") + '">' + esc(t("noticias.ver_todas")) + "</a></p></div>";
  });
}

function paginaNoticia() {
  var main = $("#main");
  cabecera("noticias").then(function () {
    return api("GET", "/api/noticias/" + encodeURIComponent(param("id") || ""));
  }).then(function (n) {
    try {
      seoSocial({
        titulo: n.titulo + " · Orden Celeste AION 2",
        descripcion: (n.titulo || "") + " — AION 2 · Orden Celeste",
        keywords: [n.titulo, "AION 2", "noticia", "Orden Celeste"].filter(Boolean).join(", "),
        robots: "index,follow"
      });
    } catch (e) { document.title = n.titulo + " · Orden Celeste AION 2"; }
    main.innerHTML = '<p class="sub"><a href="noticias.html?t=' + n.tablon + '">← ' + esc(t("noticias.t_" + n.tablon)) + "</a></p>" +
      '<article class="articulo-noticia"><header><span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>" +
      (esMantenimiento(n) ? ' <span class="chip urg">' + esc(t("noticias.mantenimiento")) + "</span>" : "") +
      "<h1>" + esc(n.titulo) + '</h1><div class="meta"><time>' + esc(fechaNoticia(n.publicado)) + "</time> · " +
      esc(t("noticias.fuente")) + ' <a href="' + esc(n.url) + '" target="_blank" rel="noopener">AION 2 · NC</a></div>' +
      (n.texto_en ? '<p class="aviso-en">' + esc(t("noticias.en_ingles_largo")) + "</p>" : "") +
      "</header>" +
      '<div class="cuerpo-noticia">' + n.contenido + "</div>" +
      '<footer><a class="boton oro" href="' + esc(n.url) + '" target="_blank" rel="noopener">' + esc(t("noticias.ver_original")) + "</a>" +
      '<a class="boton" href="foro.html?c=avisos">' + esc(t("noticias.comentar")) + "</a></footer></article>";
  }).catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });
}
