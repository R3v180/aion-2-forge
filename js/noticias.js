// Noticias oficiales de AION 2, copiadas de la comunidad de NC con su fuente.
var TABLONES_NC = ["notice", "update", "movie_clip"];
function idiomaNoticias() { return IDIOMA === "en" ? "en" : "es"; }
function fechaNoticia(iso) {
  return new Date(iso).toLocaleDateString(IDIOMA === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function imagenNoticia(n) {
  return /^https:\/\/[a-z0-9.-]*(playnccdn|plaync)\.com\//.test(n.imagen || "") ? n.imagen.replace("/download_thumbnail/", "/download/") : "icons/clases/templar-arte.webp";
}
function tarjetaNoticia(n, grande) {
  return '<a class="noticia' + (grande ? " grande" : "") + " t-" + n.tablon + '" href="noticia.html?id=' + n.id + '">' +
    '<div class="foto"><img src="' + esc(imagenNoticia(n)) + '" alt="" loading="lazy">' +
    '<span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>" +
    (n.tablon === "movie_clip" ? '<span class="play">▶</span>' : "") + "</div>" +
    '<div class="txt"><time>' + esc(fechaNoticia(n.publicado)) + "</time><h3>" + esc(n.titulo) + "</h3>" +
    (n.resumen && n.tablon !== "movie_clip" ? "<p>" + esc(n.resumen) + "</p>" : "") +
    (n.texto_en ? '<small class="chip en">' + esc(t("noticias.en_ingles")) + "</small>" : "") + "</div></a>";
}

function bloqueNoticiasInicio(caja) {
  Promise.all([api("GET", "/api/noticias?limite=7&idioma=" + idiomaNoticias()),
    api("GET", "/api/noticias?limite=1&tablon=update&idioma=" + idiomaNoticias())]).then(function (r) {
    var l = r[0];
    if (!l.length) { caja.closest("section").hidden = true; return; }
    var parche = r[1][0];
    var resto = l.filter(function (n) { return n !== parche && n.tablon !== "movie_clip"; }).slice(0, 3);
    caja.innerHTML = '<div class="noticias-inicio">' + (resto[0] ? tarjetaNoticia(resto[0], true) : "") +
      '<div class="noticias-lado">' + resto.slice(1).map(function (n) { return tarjetaNoticia(n); }).join("") +
      (parche ? '<a class="parche" href="noticia.html?id=' + parche.id + '"><span class="antetitulo">' + esc(t("noticias.ultimo_parche")) +
        "</span><b>" + esc(parche.titulo) + "</b><small>" + esc(fechaNoticia(parche.publicado)) + "</small></a>" : "") + "</div></div>";
  }).catch(function () { caja.closest("section").hidden = true; });
}

function paginaNoticias() {
  var main = $("#main"), tablon = param("t");
  if (TABLONES_NC.indexOf(tablon) < 0) tablon = "";
  cabecera("noticias").then(function () {
    main.innerHTML = '<section class="cabeza-seccion"><span class="antetitulo">' + esc(t("noticias.antetitulo")) + "</span><h1>" +
      esc(t("noticias.titulo")) + '</h1><p class="suave">' + esc(t("noticias.sub")) + "</p></section>" +
      '<nav class="pestanas-foro">' + [""].concat(TABLONES_NC).map(function (tb) {
        return '<a href="noticias.html' + (tb ? "?t=" + tb : "") + '"' + (tb === tablon ? ' class="on"' : "") + ">" +
          esc(t(tb ? "noticias.t_" + tb : "noticias.todas")) + "</a>";
      }).join("") + "</nav>" +
      '<div class="rejilla-noticias" id="lista"><div class="vacio-lista">' + esc(t("comun.cargando")) + "</div></div>";
    return api("GET", "/api/noticias?limite=40&idioma=" + idiomaNoticias() + (tablon ? "&tablon=" + tablon : ""));
  }).then(function (l) {
    $("#lista").innerHTML = l.length ? l.map(function (n, i) { return tarjetaNoticia(n, i === 0 && !tablon); }).join("")
      : '<div class="vacio-lista">' + esc(t("noticias.vacio")) + "</div>";
  }).catch(function (e) { $("#lista").innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });
}

function paginaNoticia() {
  var main = $("#main");
  cabecera("noticias").then(function () {
    return api("GET", "/api/noticias/" + encodeURIComponent(param("id") || ""));
  }).then(function (n) {
    document.title = n.titulo + " · EspClown AION 2";
    main.innerHTML = '<p class="sub"><a href="noticias.html?t=' + n.tablon + '">← ' + esc(t("noticias.t_" + n.tablon)) + "</a></p>" +
      '<article class="articulo-noticia"><header><span class="chip tablon">' + esc(t("noticias.t_" + n.tablon)) + "</span>" +
      "<h1>" + esc(n.titulo) + '</h1><div class="meta"><time>' + esc(fechaNoticia(n.publicado)) + "</time> · " +
      esc(t("noticias.fuente")) + ' <a href="' + esc(n.url) + '" target="_blank" rel="noopener">AION 2 · NC</a></div>' +
      (n.texto_en ? '<p class="aviso-en">' + esc(t("noticias.en_ingles_largo")) + "</p>" : "") + "</header>" +
      '<div class="cuerpo-noticia">' + n.contenido + "</div>" +
      '<footer><a class="boton oro" href="' + esc(n.url) + '" target="_blank" rel="noopener">' + esc(t("noticias.ver_original")) + "</a>" +
      '<a class="boton" href="foro.html?c=avisos">' + esc(t("noticias.comentar")) + "</a></footer></article>";
  }).catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });
}
