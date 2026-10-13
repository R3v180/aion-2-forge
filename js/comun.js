// Utilidades de las guías de referencia (contenido solo en español).
// Va después de i18n.js y app.js, que ponen la cabecera, el tooltip y esc/param.
var CATEGORIAS = {
  "getting-started": "Primeros pasos",
  "progression": "Progresión",
  "dungeons": "Mazmorras",
  "raids": "Raids",
  "pvp": "JcJ",
  "economy": "Economía"
};

// solo **negrita**
function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }

function bloquesHTML(bloques) {
  return (bloques || []).map(function (b) {
    var h = b.titulo ? "<h3>" + md(b.titulo) + "</h3>" : "";
    if (b.tipo === "tabla") {
      h += '<div class="tabla-scroll"><table><thead><tr>' +
        (b.columnas || []).map(function (c) { return "<th>" + md(c) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        (b.filas || []).map(function (f) {
          return "<tr>" + f.map(function (c) { return "<td>" + md(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    } else if (b.tipo === "lista") {
      h += "<ul>" + (b.items || []).map(function (i) { return "<li>" + md(i) + "</li>"; }).join("") + "</ul>";
    } else if (b.tipo === "pasos") {
      h += '<ol class="pasos">' + (b.items || []).map(function (i) { return "<li>" + md(i) + "</li>"; }).join("") + "</ol>";
    } else if (b.tipo === "aviso") {
      h += '<div class="aviso">' + md(b.texto) + "</div>";
    } else if (b.texto) {
      h += "<p>" + md(b.texto) + "</p>";
    }
    return h;
  }).join("");
}

// cabecera común + aviso de idioma; con `clase`, barra con enlaces a la página de la clase y a su build de referencia
function cabeceraLegado(activa, clase) {
  cabecera(activa);
  document.documentElement.lang = "es";
  var main = document.getElementById("main"), extra = "";
  if (IDIOMA !== "es") extra += '<div class="aviso-idioma">' + esc(t("legado.solo_es")) + "</div>";
  if (clase) {
    extra += '<div class="barra-legado"><span>' + esc(t("legado.ref_titulo")) + '</span><div>' +
      '<a class="boton-legado" href="clase.html?c=' + encodeURIComponent(clase) + '">' + esc(t("legado.ver_clase")) + "</a>" +
      '<a class="boton-legado oro" id="abrir-ref" hidden>' + esc(t("legado.abrir_build")) + "</a></div></div>";
  }
  main.insertAdjacentHTML("beforebegin", extra);
  if (clase) {
    api("GET", "/api/builds?clase=" + encodeURIComponent(clase)).then(function (d) {
      var ref = (d || []).filter(function (b) { return b.fuente; })[0];
      if (ref) { var a = $("#abrir-ref"); a.href = "build.html?id=" + ref.id; a.hidden = false; }
    }).catch(function () {});
  }
}

function cargarScript(src, ok, fallo) {
  var s = document.createElement("script");
  s.src = src; s.onload = ok; s.onerror = fallo;
  document.head.appendChild(s);
}
