// Piezas de interfaz reutilizadas entre páginas
function chipModo(modo) {
  return '<span class="chip ' + esc(modo) + '">' + esc(t("modo." + modo)) + "</span>";
}

function esFuenteTop(fuente) {
  return !!(fuente && String(fuente).indexOf("top:") === 0);
}

/** Puesto del top: copa / plata (sin almohadilla). */
function medallaTop(rank) {
  var r = parseInt(rank, 10);
  if (r === 1) return "🏆";
  if (r === 2) return "🥈";
  if (r === 3) return "🥉";
  return "🏅";
}

function chipFuente(fuente, rank) {
  if (!fuente) return "";
  var f = String(fuente);
  if (f.indexOf("top:live:") === 0) {
    return '<span class="chip top">' + medallaTop(rank) + " " + esc(t("builds.top_semana")) + "</span>";
  }
  if (f.indexOf("top:was:") === 0 || f.indexOf("top:") === 0) {
    return '<span class="chip top ex">' + medallaTop(rank) + " " + esc(t("builds.ex_top")) + "</span>";
  }
  return '<span class="chip referencia">' + esc(t("builds.referencia")) + "</span>";
}

function chipVotos(b) {
  var likes = b.likes || 0, dis = b.dislikes || 0;
  if (!likes && !dis) return "";
  return '<span class="chip votos" title="' + esc(t("builds.votos")) + '">▲ ' + likes + (dis ? " · ▼ " + dis : "") + "</span>";
}

/** Retrato NC remoto (sin descargar). Vacío si no es URL válida. */
function urlFotoPj(u) {
  return /^https:\/\/(profileimg\.plaync\.com|assets\.playnccdn\.com)\//.test(u || "") ? u : "";
}
/** Arte de tarjeta: foto del PJ si hay; si no, arte de clase. */
function arteBuild(b) {
  var foto = urlFotoPj(b.imagen) || urlFotoPj(b.personaje && b.personaje.imagen);
  if (foto) return { src: foto, foto: true };
  return { src: "icons/clases/" + b.clase + "-arte.webp", foto: false };
}

function fmtPoder(n) {
  n = Number(n);
  if (!isFinite(n) || n <= 0) return "";
  if (n >= 1000) {
    var k = Math.round(n / 100) / 10;
    return (k % 1 ? k.toFixed(1) : String(Math.round(k))) + "K";
  }
  return fmtNum(n);
}

function tarjetaBuildTop(b) {
  var c = claseInfo(b.clase);
  var top = b.top || {};
  var rank = top.rank;
  var nombre = top.nombre || b.nombre;
  var semana = top.semana;
  var arte = arteBuild(b);
  var poder = top.poder != null ? top.poder : null;
  var ilvl = top.nivel_objeto != null ? top.nivel_objeto : null;
  var stats = "";
  if (poder != null || ilvl != null) {
    stats = '<div class="top-stats">' +
      (poder != null ? '<span class="top-stat poder"><em>' + esc(t("tops.orden_poder")) + "</em><b>" + esc(fmtPoder(poder)) + "</b></span>" : "") +
      (ilvl != null ? '<span class="top-stat ilvl"><em>' + esc(t("espia.ilvl")) + "</em><b>" + esc(fmtNum(ilvl)) + "</b></span>" : "") +
      "</div>";
  }
  var sub = [];
  if (top.servidor) sub.push(top.servidor);
  if (semana) sub.push(semana);
  return '<a class="tarjeta-build tarjeta-top con-arte" href="build.html?id=' + b.id + '">' +
    '<img class="tarjeta-arte' + (arte.foto ? " foto-pj" : "") + '" src="' + esc(arte.src) + '" alt="" loading="lazy">' +
    '<span class="medalla-top" aria-hidden="true">' + medallaTop(rank) + "</span>" +
    '<div class="cab"><img src="icons/clases/' + b.clase + '.webp" alt="">' +
    "<div><b>" + esc(nombre) + "</b><small>" + esc(tr(c)) +
    (sub.length ? " · " + esc(sub.join(" · ")) : "") + "</small></div></div>" +
    stats +
    '<div class="chips">' + chipFuente(b.fuente, rank) + chipVotos(b) + "</div></a>";
}

function tarjetaBuild(b) {
  var c = claseInfo(b.clase);
  if (esFuenteTop(b.fuente)) return tarjetaBuildTop(b);
  var chips = (b.modo ? chipModo(b.modo) : "") + chipFuente(b.fuente) + chipVotos(b);
  var arte = arteBuild(b);
  return '<a class="tarjeta-build con-arte" href="build.html?id=' + b.id + '">' +
    '<img class="tarjeta-arte' + (arte.foto ? " foto-pj" : "") + '" src="' + esc(arte.src) + '" alt="" loading="lazy">' +
    '<div class="cab"><img src="icons/clases/' + b.clase + '.webp" alt="">' +
    "<div><b>" + esc(b.nombre) + "</b><small>" + esc(tr(c)) + " · " + esc(t("builds.por")) + " " + esc(b.autor) + "</small></div></div>" +
    '<div class="chips">' + chips + "</div>" +
    '<small class="tarjeta-fecha">' + esc(t("builds.actualizada")) + " " + esc(fecha(b.actualizado)) + "</small></a>";
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
