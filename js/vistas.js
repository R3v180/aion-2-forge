// Piezas de interfaz reutilizadas entre páginas
function chipModo(modo) {
  return '<span class="chip ' + esc(modo) + '">' + esc(t("modo." + modo)) + "</span>";
}

function esFuenteTop(fuente) {
  return !!(fuente && String(fuente).indexOf("top:") === 0);
}

function chipFuente(fuente) {
  if (!fuente) return "";
  var f = String(fuente);
  if (f.indexOf("top:live:") === 0) return '<span class="chip top">' + esc(t("builds.top_semana")) + "</span>";
  if (f.indexOf("top:was:") === 0 || f.indexOf("top:") === 0) return '<span class="chip top ex">' + esc(t("builds.ex_top")) + "</span>";
  return '<span class="chip referencia">' + esc(t("builds.referencia")) + "</span>";
}

function chipVotos(b) {
  var likes = b.likes || 0, dis = b.dislikes || 0;
  if (!likes && !dis) return "";
  return '<span class="chip votos" title="' + esc(t("builds.votos")) + '">▲ ' + likes + (dis ? " · ▼ " + dis : "") + "</span>";
}

function tarjetaBuild(b) {
  var c = claseInfo(b.clase);
  var top = esFuenteTop(b.fuente);
  // Tops: solo chip Top (sin JcE/JcJ). Comunidad: modo elegido por el autor.
  var chips = (top || !b.modo ? "" : chipModo(b.modo)) + chipFuente(b.fuente) + chipVotos(b);
  return '<a class="tarjeta-build con-arte" href="build.html?id=' + b.id + '">' +
    '<img class="tarjeta-arte" src="icons/clases/' + b.clase + '-arte.webp" alt="" loading="lazy">' +
    '<div class="cab"><img src="icons/clases/' + b.clase + '.webp" alt="">' +
    "<div><b>" + esc(b.nombre) + "</b><small>" + esc(tr(c)) + " · " + esc(t("builds.por")) + " " + esc(b.autor) + "</small></div></div>" +
    '<div class="chips">' + chips +
    '<span class="chip">' + esc(t("builds.actualizada")) + " " + esc(fecha(b.actualizado)) + "</span></div></a>";
}

function selectorClases(nombre, marcada) {
  return '<div class="selector-clase">' + CLASES_INFO.map(function (c) {
    return '<label><input type="radio" name="' + nombre + '" value="' + c.id + '"' + (c.id === marcada ? " checked" : "") + ">" +
      '<img src="icons/clases/' + c.id + '.webp" alt=""><span>' + esc(tr(c)) + "</span></label>";
  }).join("") + "</div>";
}

function opcionesModo(marcado, conTodos) {
  return (conTodos ? '<option value="">' + esc(t("modo.todos")) + "</option>" : "") + ["pve", "pvp", "farm", "otro"].map(function (m) {
    return '<option value="' + m + '"' + (m === marcado ? " selected" : "") + ">" + esc(t("modo." + m)) + "</option>";
  }).join("");
}

function idYoutube(url) {
  var m = String(url).match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{6,})/);
  return m && m[1];
}
function videosHTML(lista) {
  return '<div class="videos">' + (lista || []).map(function (u) {
    var id = idYoutube(u);
    return id ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '" loading="lazy" allowfullscreen ' +
      'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>' : "";
  }).join("") + "</div>";
}
