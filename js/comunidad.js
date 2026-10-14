// Foro, chat y panel. La lectura es pública; escribir exige sesión (en el escaparate, se abre la web principal).
function fechaHora(iso) {
  return new Date(iso).toLocaleString(IDIOMA === "es" ? "es-ES" : "en-GB",
    { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
function hora(iso) {
  return new Date(iso).toLocaleTimeString(IDIOMA === "es" ? "es-ES" : "en-GB", { hour: "2-digit", minute: "2-digit" });
}
function haceRato(iso) {
  var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return t("foro.ahora");
  if (s < 3600) return Math.floor(s / 60) + " min";
  if (s < 86400) return Math.floor(s / 3600) + " h";
  return fechaHora(iso);
}
var CATEGORIAS = { avisos: "📢", presentaciones: "👋", clases: "⚔️", builds: "🛠️", grupos: "🛡️", reclutamiento: "📜", offtopic: "🍻" };
function catNombre(id) { return t("foro.cat_" + id); }
function irAEntrar() {
  var destino = paginaActual() + location.search;
  location.href = (ESCAPARATE ? WEB_PRINCIPAL + "/" : "") + "entrar.html?volver=" + encodeURIComponent(ESCAPARATE ? "/" + destino : location.pathname + location.search);
}
function cajaEscribir(accion) {
  if (ESCAPARATE) return '<p><a class="boton oro" href="' + enPrincipal(paginaActual() + location.search) + '">' + esc(t(accion)) + "</a></p>";
  if (!YO) return '<p><button class="boton oro" id="ir-entrar">' + esc(t(accion)) + "</button></p>";
  return "";
}
function pedirMotivo() {
  var m = prompt(t("foro.denuncia_motivo"));
  return m && m.trim();
}
function puedeEscribir() { return YO && !ESCAPARATE && YO.rol !== "sistema"; }

// ---------- emojis ----------
var EMOJIS = {
  caras: "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😛 😜 🤪 😎 🤩 🥳 😏 😒 😔 😟 🙁 😣 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😓 🤗 🤔 🤭 🤫 😶 😐 😑 😬 🙄 😮 😲 🥱 😴 🤤 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 🤡 💩 👻 💀 👽 🤖",
  gestos: "👍 👎 👏 🙌 🤝 🙏 ✌️ 🤞 🤟 🤘 👌 🤌 🤏 👈 👉 👆 👇 ☝️ ✋ 🖐️ 🖖 👋 🤙 💪 🫡 🫶",
  juego: "⚔️ 🗡️ 🛡️ 🏹 🪄 🔮 📜 🧪 💎 🪙 💰 🏆 🥇 🥈 🥉 🎯 🎮 🐉 🐲 🔥 ⚡ ❄️ 🌪️ 💥 ✨ 🌟 ⭐ 💫 ☄️ 🌙 ☀️ 👑 🧙 🧝 🧛 🪽 🐺 🦅",
  corazones: "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💔 💕 💞 💖 💘",
  cosas: "🎉 🎊 🎁 🍻 🍺 🍕 ☕ 🎵 📢 🔔 ⏰ ⌛ 📅 📌 ✅ ❌ ⚠️ ❓ ❗ 💯 🆙"
};
var REACCIONES = ["👍", "❤️", "😂", "🔥", "😮", "😢", "🎉", "👏"];
function insertarEnCaja(caja, texto) {
  var i = caja.selectionStart == null ? caja.value.length : caja.selectionStart, f = caja.selectionEnd == null ? i : caja.selectionEnd;
  caja.value = caja.value.slice(0, i) + texto + caja.value.slice(f);
  caja.focus();
  caja.selectionStart = caja.selectionEnd = i + texto.length;
  caja.dispatchEvent(new Event("input", { bubbles: true }));
}
function envolver(caja, a, b) {
  var i = caja.selectionStart, f = caja.selectionEnd, sel = caja.value.slice(i, f) || t("foro.texto_ejemplo");
  caja.value = caja.value.slice(0, i) + a + sel + b + caja.value.slice(f);
  caja.focus();
  caja.selectionStart = i + a.length;
  caja.selectionEnd = i + a.length + sel.length;
}
function abrirEmojis(boton, alElegir) {
  cerrarEmojis();
  var caja = document.createElement("div");
  caja.className = "emojis";
  caja.id = "emojis";
  caja.innerHTML = '<nav>' + Object.keys(EMOJIS).map(function (k, i) {
    return '<button type="button" data-grupo="' + k + '"' + (i ? "" : ' class="on"') + ">" + EMOJIS[k].split(" ")[0] + "</button>";
  }).join("") + "</nav>" + '<div class="rejilla-emojis">' + rejilla("caras") + "</div>";
  document.body.appendChild(caja);
  var r = boton.getBoundingClientRect();
  var top = r.top - caja.offsetHeight - 8;
  caja.style.top = (top < 8 ? r.bottom + 8 : top) + window.scrollY + "px";
  caja.style.left = Math.max(8, Math.min(r.left, window.innerWidth - caja.offsetWidth - 8)) + "px";
  caja.addEventListener("click", function (e) {
    e.stopPropagation();
    var g = e.target.closest("[data-grupo]");
    if (g) {
      caja.querySelectorAll("[data-grupo]").forEach(function (b) { b.classList.toggle("on", b === g); });
      caja.querySelector(".rejilla-emojis").innerHTML = rejilla(g.dataset.grupo);
      return;
    }
    var em = e.target.closest("[data-emoji]");
    if (em) { alElegir(em.dataset.emoji); cerrarEmojis(); }
  });
  setTimeout(function () { document.addEventListener("click", cerrarEmojis, { once: true }); }, 0);
  function rejilla(k) {
    return EMOJIS[k].split(" ").map(function (e) { return '<button type="button" data-emoji="' + e + '">' + e + "</button>"; }).join("");
  }
}
function cerrarEmojis() { var e = $("#emojis"); if (e) e.remove(); }
function barraFormato(id) {
  return '<div class="barra-formato" data-para="' + id + '">' +
    '<button type="button" data-fmt="b" title="' + esc(t("foro.negrita")) + '"><b>B</b></button>' +
    '<button type="button" data-fmt="i" title="' + esc(t("foro.cursiva")) + '"><i>I</i></button>' +
    '<button type="button" data-fmt="cita" title="' + esc(t("foro.citar")) + '">❝</button>' +
    '<button type="button" data-fmt="emoji" title="Emoji">😊</button>' +
    '<span class="suave">' + esc(t("foro.ayuda_formato")) + "</span></div>";
}
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-fmt]");
  if (!b) return;
  var caja = document.getElementById(b.closest("[data-para]").dataset.para);
  if (!caja) return;
  var f = b.dataset.fmt;
  if (f === "b") envolver(caja, "**", "**");
  else if (f === "i") envolver(caja, "*", "*");
  else if (f === "cita") insertarEnCaja(caja, (caja.value && !/\n$/.test(caja.value) ? "\n" : "") + "> ");
  else if (f === "emoji") { e.stopPropagation(); abrirEmojis(b, function (em) { insertarEnCaja(caja, em); }); }
});

// ---------- texto con formato (siempre se escapa primero) ----------
function esBuildNuestra(u) {
  return /build\.html\?id=\d+/.test(u) && (u.indexOf(location.host) >= 0 || /espclown-aion2\.onrender\.com|r3v180\.github\.io/.test(u));
}
function enLinea(s) {
  s = s.replace(/(https?:\/\/[^\s<]+)/g, function (u) {
    if (esBuildNuestra(u)) {
      var id = u.match(/build\.html\?id=(\d+)/)[1];
      return '<a href="build.html?id=' + id + '" data-build="' + id + '">' + u + "</a>";
    }
    return '<a href="' + u + '" target="_blank" rel="noopener nofollow">' + u + "</a>";
  });
  s = s.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])\*([^*\s][^*\n]*)\*/g, "$1<i>$2</i>");
  return s.replace(/(^|\s)@([A-Za-z0-9_.-]{3,24})/g, function (_, a, n) {
    var yo = YO && YO.usuario.toLowerCase() === n.toLowerCase();
    return a + '<span class="mencion' + (yo ? " yo" : "") + '">@' + n + "</span>";
  });
}
function formato(txt) {
  var html = "", cita = [];
  function cerrar() { if (cita.length) { html += "<blockquote>" + cita.join("<br>") + "</blockquote>"; cita = []; } }
  esc(txt).split("\n").forEach(function (l) {
    if (/^&gt;\s?/.test(l)) cita.push(enLinea(l.replace(/^&gt;\s?/, "")));
    else { cerrar(); html += enLinea(l) + "<br>"; }
  });
  cerrar();
  return html.replace(/(<br>)+$/, "");
}
function soloEmojis(txt) { return /^(\p{Extended_Pictographic}|\uFE0F|\u200D|\s){1,12}$/u.test(txt.trim()); }
function pintarTarjetas(raiz) {
  var ids = [];
  raiz.querySelectorAll("a[data-build]").forEach(function (a) { if (ids.indexOf(a.dataset.build) < 0) ids.push(a.dataset.build); });
  if (!ids.length) return;
  api("GET", "/api/tarjetas?ids=" + ids.join(",")).then(function (d) {
    raiz.querySelectorAll("a[data-build]").forEach(function (a) {
      var b = d[a.dataset.build];
      if (!b || a.dataset.pintada) return;
      a.dataset.pintada = "1";
      var r = b.resumen || {};
      a.insertAdjacentHTML("afterend", '<a class="tarjeta-mini" href="build.html?id=' + b.id + '"><img class="arte" src="icons/clases/' + b.clase +
        '-arte.webp" alt=""><img class="emb" src="icons/clases/' + b.clase + '.webp" alt=""><span><b>' + esc(b.nombre) + "</b><small>" +
        esc(tr(claseInfo(b.clase))) + " · " + esc(b.autor) + "</small><em>" + (r.habilidades || 0) + " " + esc(t("mis.dato_habilidades")) + " · " +
        (r.daevanion || 0) + " " + esc(t("mis.dato_nodos")) + "</em></span>" + chipModo(b.modo) + "</a>");
    });
  }).catch(function () {});
}

// ---------- autores ----------
function avatar(p, tam) {
  p = p || {};
  var c = "avatar" + (tam ? " " + tam : "");
  if (p.pj && p.pj.imagen) return '<img class="' + c + ' foto" src="' + esc(p.pj.imagen) + '" alt="">';
  if (p.clase) return '<span class="' + c + ' clase"><img src="icons/clases/' + esc(p.clase) + '.webp" alt=""></span>';
  return '<span class="' + c + ' letra">' + esc((p.usuario || "?").charAt(0).toUpperCase()) + "</span>";
}
function insignias(p) {
  p = p || {};
  var h = "";
  if (p.rol === "superadmin" || p.rol === "admin") h += '<span class="insignia admin">' + esc(t("panel.rol_admin")) + "</span>";
  else if (p.rol === "moderador") h += '<span class="insignia mod">' + esc(t("foro.mod")) + "</span>";
  if (p.gremio) h += '<span class="insignia gremio" title="' + esc(t("foro.gremio_tit")) + '">EspClown ✓</span>';
  return h;
}
function poderK(n) { n = Number(n) || 0; return n >= 1000 ? (Math.round(n / 100) / 10) + "K" : String(n); }
function firma(p) {
  if (!p || !p.pj) return p && p.clase ? '<small class="firma">' + esc(tr(claseInfo(p.clase))) + "</small>" : "";
  return '<small class="firma">' + esc(p.pj.nombre) + " · " + esc(tr(claseInfo(p.pj.clase))) + " " + esc(t("juego.nv")) + " " + (p.pj.nivel || "—") +
    " · ⚔ " + poderK(p.pj.poder) + (p.pj.servidor ? " · " + esc(p.pj.servidor) : "") + "</small>";
}

// ---------- foro ----------
function foro() {
  var main = $("#main"), cat = param("c");
  cabecera("foro").then(function () {
    return api("GET", "/api/foro");
  }).then(function (d) {
    if (cat && !d.categorias.some(function (c) { return c.id === cat; })) cat = null;
    if (!cat) return portadaForo(d);
    return categoriaForo(d);
  }).catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });

  function cabezaForo(d) {
    var x = d.total || {};
    return '<section class="heroe-comunidad"><img class="arte" src="icons/clases/cleric-arte.webp" alt="">' +
      '<div><span class="antetitulo">' + esc(t("foro.antetitulo")) + "</span><h1>" + esc(t("foro.titulo")) + "</h1><p>" + esc(t("foro.aviso")) + "</p>" +
      '<div class="datos-comunidad"><span><b>' + (x.temas || 0) + "</b>" + esc(t("foro.d_temas")) + "</span><span><b>" + (x.mensajes || 0) + "</b>" +
      esc(t("foro.d_mensajes")) + "</span><span><b>" + (x.miembros || 0) + "</b>" + esc(t("foro.d_miembros")) + '</span><span class="vivo"><b>' +
      (d.conectados || 0) + "</b>" + esc(t("foro.d_conectados")) + "</span></div></div></section>";
  }
  function portadaForo(d) {
    main.innerHTML = cabezaForo(d) + '<div class="categorias-foro">' + d.categorias.map(function (c) {
      var u = c.ultimo;
      return '<a class="categoria-foro" href="foro.html?c=' + c.id + '"><span class="ico-cat">' + CATEGORIAS[c.id] + "</span>" +
        '<span class="txt"><b>' + esc(catNombre(c.id)) + "</b><small>" + esc(t("foro.desc_" + c.id)) + "</small></span>" +
        '<span class="cifras"><b>' + c.temas + "</b><small>" + esc(t("foro.d_temas")) + "</small></span>" +
        '<span class="cifras c2"><b>' + c.mensajes + "</b><small>" + esc(t("foro.d_mensajes")) + "</small></span>" +
        '<span class="ultimo">' + (u ? "<b>" + esc(u.titulo) + "</b><small>" + esc(u.autor || "") + " · " + esc(haceRato(u.fecha)) + "</small>"
          : '<small class="suave">' + esc(t("foro.sin_temas")) + "</small>") + "</span></a>";
    }).join("") + "</div>";
  }
  function categoriaForo(d) {
    var puede = puedeEscribir() && (cat !== "avisos" || YO.rol === "admin" || YO.rol === "superadmin");
    main.innerHTML = '<p class="sub"><a href="foro.html">← ' + esc(t("foro.titulo")) + "</a></p>" +
      '<section class="cabeza-categoria"><span class="ico-cat grande">' + CATEGORIAS[cat] + "</span><div><h1>" + esc(catNombre(cat)) + "</h1><p class=\"suave\">" +
      esc(t("foro.desc_" + cat)) + "</p></div>" + (puede ? '<button class="boton oro" id="abrir-nuevo">+ ' + esc(t("foro.nuevo")) + "</button>" : "") + "</section>" +
      '<nav class="pestanas-foro">' + d.categorias.map(function (c) {
        return '<a href="foro.html?c=' + c.id + '"' + (c.id === cat ? ' class="on"' : "") + ">" + CATEGORIAS[c.id] + " " + esc(catNombre(c.id)) + " <small>" + c.temas + "</small></a>";
      }).join("") + "</nav>" +
      (puede ? '<form class="panel editor-foro" id="nuevo" hidden><h3>' + esc(t("foro.nuevo")) + '</h3><input id="f-titulo" maxlength="120" required placeholder="' +
        esc(t("foro.titulo_tema")) + '">' + barraFormato("f-texto") + '<textarea id="f-texto" maxlength="6000" required placeholder="' + esc(t("foro.texto")) +
        '"></textarea><div class="error" id="f-error"></div><div class="fila-form"><button type="button" class="boton" id="cerrar-nuevo">' +
        esc(t("juego.cerrar")) + '</button><button class="boton oro">' + esc(t("foro.publicar")) + "</button></div></form>"
        : (cat === "avisos" ? '<p class="suave">' + esc(t("foro.avisos_solo")) + "</p>" : cajaEscribir("foro.entrar"))) +
      '<div id="temas"><div class="vacio-lista">' + esc(t("comun.cargando")) + "</div></div>";
    var entrar = $("#ir-entrar");
    if (entrar) entrar.addEventListener("click", irAEntrar);
    var form = $("#nuevo");
    if (form) {
      $("#abrir-nuevo").addEventListener("click", function () { form.hidden = false; $("#f-titulo").focus(); });
      $("#cerrar-nuevo").addEventListener("click", function () { form.hidden = true; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        api("POST", "/api/foro/" + cat, { titulo: $("#f-titulo").value, texto: $("#f-texto").value }).then(function (r) {
          location.href = "tema.html?id=" + r.id;
        }).catch(function (er) { $("#f-error").textContent = textoError(er); });
      });
    }
    return api("GET", "/api/foro/" + cat).then(function (temas) {
      $("#temas").innerHTML = temas.length ? temas.map(function (x) {
        return '<a class="tema-fila' + (x.fijado ? " fijado" : "") + '" href="tema.html?id=' + x.id + '">' + avatar(x.autor) +
          '<span class="txt"><span class="titulo">' + (x.fijado ? '<i class="chip fijo">📌 ' + esc(t("foro.fijado")) + "</i> " : "") +
          (x.cerrado ? '<i class="chip">🔒 ' + esc(t("foro.cerrado")) + "</i> " : "") + "<b>" + esc(x.titulo) + "</b></span>" +
          "<small>" + esc(x.extracto.replace(/\*+/g, "").replace(/(^|\n)>\s?/g, " ").replace(/\s+/g, " ")) + "</small><em>" + esc((x.autor || {}).usuario || "") + " " + insignias(x.autor) + "</em></span>" +
          '<span class="cifras"><b>' + x.respuestas + "</b><small>" + esc(t("foro.d_respuestas")) + "</small></span>" +
          '<span class="cifras c2"><b>' + x.vistas + "</b><small>" + esc(t("foro.vistas")) + "</small></span>" +
          '<span class="ultimo"><b>' + esc(x.ultimo_autor || "") + "</b><small>" + esc(haceRato(x.actualizado)) + "</small></span></a>";
      }).join("") : '<div class="vacio-lista">' + esc(t("foro.vacio")) + "</div>";
    });
  }
}

function tema() {
  var main = $("#main"), id = param("id");
  function reaccionesHTML(m) {
    return '<div class="reacciones" data-reac="' + m.id + '">' + m.reacciones.map(function (r) {
      return '<button class="reac' + (r.mia ? " mia" : "") + '" data-emoji="' + r.e + '"' + (puedeEscribir() ? "" : " disabled") + ">" + r.e + " <b>" + r.n + "</b></button>";
    }).join("") + (puedeEscribir() ? '<button class="reac mas" data-mas-reac="' + m.id + '" title="' + esc(t("foro.reaccionar")) + '">😊+</button>' : "") + "</div>";
  }
  function mensaje(m, i) {
    var a = m.autor || {};
    return '<article class="mensaje-foro" id="m-' + m.id + '"><aside class="autor">' + avatar(a, "grande") + "<b>" + esc(a.usuario || "?") + "</b>" +
      insignias(a) + firma(a) + '<small class="suave">' + (a.mensajes || 0) + " " + esc(t("foro.d_mensajes")) + "</small></aside>" +
      '<div class="contenido"><header><time>' + esc(fechaHora(m.creado)) + "</time>" + (m.editado ? '<small class="suave">· ' + esc(t("foro.editado")) + "</small>" : "") +
      '<a class="num" href="#m-' + m.id + '">#' + (i + 1) + "</a></header>" +
      '<div class="texto' + (soloEmojis(m.texto) ? " gigante" : "") + '">' + formato(m.texto) + "</div>" +
      "<footer>" + reaccionesHTML(m) + '<span class="acciones-msg">' +
      (puedeEscribir() ? '<button class="enlace" data-citar="' + m.id + '">❝ ' + esc(t("foro.citar")) + "</button>" +
        '<button class="enlace" data-mencionar="' + esc(a.usuario || "") + '">@ ' + esc(t("foro.responder")) + "</button>" : "") +
      (m.propio ? '<button class="enlace" data-editar="' + m.id + '">✎ ' + esc(t("foro.editar")) + "</button>" : "") +
      (puedeEscribir() && !m.propio ? '<button class="enlace" data-denunciar="mensaje:' + m.id + '">⚑ ' + esc(t("foro.denunciar")) + "</button>" : "") +
      "</span></footer></div></article>";
  }
  var datos;
  function pintar(d) {
    datos = d;
    document.title = d.titulo + " · EspClown AION 2";
    var escribir = "";
    if (d.cerrado) escribir = '<p class="suave">🔒 ' + esc(t("foro.cerrado_aviso")) + "</p>";
    else if (puedeEscribir()) escribir = '<form class="panel editor-foro" id="respuesta"><h3>' + esc(t("foro.responder")) + "</h3>" + barraFormato("r-texto") +
      '<textarea id="r-texto" maxlength="6000" required placeholder="' + esc(t("foro.texto")) + '"></textarea><div class="error" id="r-error"></div>' +
      '<div class="fila-form"><button class="boton oro">' + esc(t("foro.responder")) + "</button></div></form>";
    else escribir = cajaEscribir("foro.entrar");
    main.innerHTML = '<p class="sub"><a href="foro.html?c=' + d.categoria + '">← ' + CATEGORIAS[d.categoria] + " " + esc(catNombre(d.categoria)) + "</a></p>" +
      '<section class="cabeza-tema"><h1>' + esc(d.titulo) + '</h1><p class="suave">' + (d.fijado ? "📌 " + esc(t("foro.fijado")) + " · " : "") +
      (d.cerrado ? "🔒 " + esc(t("foro.cerrado")) + " · " : "") + esc((d.autor || {}).usuario || "") + " · " + esc(fechaHora(d.creado)) + " · " +
      d.vistas + " " + esc(t("foro.vistas")) + " · " + (d.mensajes.length - 1) + " " + esc(t("foro.d_respuestas")) + "</p></section>" +
      d.mensajes.map(mensaje).join("") +
      (puedeEscribir() ? '<p><button class="enlace" data-denunciar="tema:' + d.id + '">⚑ ' + esc(t("foro.denunciar_tema")) + "</button></p>" : "") + escribir;
    pintarTarjetas(main);
    var entrar = $("#ir-entrar");
    if (entrar) entrar.addEventListener("click", irAEntrar);
    var form = $("#respuesta");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      api("POST", "/api/foro/tema/" + id, { texto: $("#r-texto").value }).then(function (r) {
        return api("GET", "/api/foro/tema/" + id).then(function (n) { pintar(n); var el = $("#m-" + r.id); if (el) el.scrollIntoView({ behavior: "smooth" }); });
      }).catch(function (er) { $("#r-error").textContent = textoError(er); });
    });
    if (location.hash) { var el = $(location.hash); if (el) el.scrollIntoView(); }
  }
  function reaccionar(mid, emoji) {
    api("POST", "/api/reacciones", { tipo: "mensaje", id: +mid, emoji: emoji }).then(function (lista) {
      var m = datos.mensajes.filter(function (x) { return String(x.id) === String(mid); })[0];
      if (!m) return;
      m.reacciones = lista;
      $('[data-reac="' + mid + '"]').outerHTML = reaccionesHTML(m);
    }).catch(function (er) { aviso(textoError(er), "mal"); });
  }
  main.addEventListener("click", function (e) {
    var r = e.target.closest(".reac[data-emoji]");
    if (r) { reaccionar(r.closest("[data-reac]").dataset.reac, r.dataset.emoji); return; }
    var mas = e.target.closest("[data-mas-reac]");
    if (mas) {
      e.stopPropagation();
      cerrarEmojis();
      var p = document.createElement("div");
      p.className = "emojis rapidas";
      p.id = "emojis";
      p.innerHTML = REACCIONES.map(function (x) { return '<button type="button" data-emoji="' + x + '">' + x + "</button>"; }).join("");
      document.body.appendChild(p);
      var rc = mas.getBoundingClientRect();
      p.style.top = rc.top + window.scrollY - p.offsetHeight - 6 + "px";
      p.style.left = Math.max(8, rc.left) + "px";
      p.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-emoji]");
        if (b) { reaccionar(mas.dataset.masReac, b.dataset.emoji); cerrarEmojis(); }
      });
      setTimeout(function () { document.addEventListener("click", cerrarEmojis, { once: true }); }, 0);
      return;
    }
    var c = e.target.closest("[data-citar]");
    if (c) {
      var m = datos.mensajes.filter(function (x) { return String(x.id) === c.dataset.citar; })[0];
      var caja = $("#r-texto");
      if (m && caja) {
        caja.value += (caja.value ? "\n" : "") + "> @" + ((m.autor || {}).usuario || "") + ":\n> " + m.texto.split("\n").slice(0, 6).join("\n> ") + "\n\n";
        caja.focus();
        caja.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    var mc = e.target.closest("[data-mencionar]");
    if (mc) { var cj = $("#r-texto"); if (cj) { insertarEnCaja(cj, "@" + mc.dataset.mencionar + " "); cj.scrollIntoView({ behavior: "smooth", block: "center" }); } return; }
    var ed = e.target.closest("[data-editar]");
    if (ed) { editar(ed.dataset.editar); return; }
    var gu = e.target.closest("[data-guardar-edicion]");
    if (gu) {
      var mid = gu.dataset.guardarEdicion;
      api("PUT", "/api/foro/mensaje/" + mid, { texto: $("#e-" + mid).value }).then(function () { return api("GET", "/api/foro/tema/" + id); })
        .then(pintar).catch(function (er) { aviso(textoError(er), "mal"); });
      return;
    }
    if (e.target.closest("[data-cancelar-edicion]")) { pintar(datos); return; }
    var den = e.target.closest("[data-denunciar]");
    if (!den) return;
    var motivo = pedirMotivo();
    if (!motivo) return;
    var trozo = den.dataset.denunciar.split(":");
    var ruta = trozo[0] === "tema" ? "/api/foro/tema/" + trozo[1] + "/denunciar" : "/api/foro/mensaje/" + trozo[1] + "/denunciar";
    api("POST", ruta, { motivo: motivo }).then(function () { aviso(t("foro.denuncia_ok"), "ok"); }).catch(function (er) { aviso(textoError(er), "mal"); });
  });
  function editar(mid) {
    var m = datos.mensajes.filter(function (x) { return String(x.id) === String(mid); })[0];
    var caja = $("#m-" + mid + " .texto");
    if (!m || !caja) return;
    caja.outerHTML = '<div class="editor-foro">' + barraFormato("e-" + mid) + '<textarea id="e-' + mid + '" maxlength="6000">' + esc(m.texto) + "</textarea>" +
      '<div class="fila-form"><button class="boton" data-cancelar-edicion>' + esc(t("juego.cerrar")) + '</button><button class="boton oro" data-guardar-edicion="' +
      mid + '">' + esc(t("panel.guardar")) + "</button></div></div>";
  }
  cabecera("foro").then(function () { return api("GET", "/api/foro/tema/" + encodeURIComponent(id)); }).then(pintar)
    .catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });
}

// ---------- chat por salas ----------
var SALAS_CHAT = [["general", "💬"], ["grupos", "🛡️"], ["clases", "⚔️"], ["comercio", "💰"], ["offtopic", "🍻"], ["gremio", "🏰"]];
function chat() {
  var main = $("#main"), sala = location.hash.slice(1) || "general", ultimo = 0, version = -1, caja, responde = null, temporizador, mensajes = {};
  if (!SALAS_CHAT.some(function (s) { return s[0] === sala; })) sala = "general";
  var vistos = {};
  try { vistos = JSON.parse(localStorage.getItem("chat_vistos") || "{}"); } catch (e) { vistos = {}; }
  cabecera("chat").then(function () {
    return api("GET", "/api/config").catch(function () { return {}; });
  }).then(function (cfg) {
    main.innerHTML = '<section class="heroe-comunidad compacto"><img class="arte" src="icons/clases/chanter-arte.webp" alt=""><div><span class="antetitulo">' +
      esc(t("chat.antetitulo")) + "</span><h1>" + esc(t("chat.titulo")) + "</h1><p>" + esc(t("chat.aviso")) + "</p></div></section>" +
      '<div class="chat-pro"><nav class="salas" id="salas"></nav><section class="chat-centro"><header class="cabeza-sala" id="cabeza-sala"></header>' +
      '<div class="chat-sala" id="sala"></div><div id="zona-escribir"></div></section>' +
      '<aside class="chat-lado"><div class="panel"><h3>' + esc(t("chat.conectados")) + ' <small id="n-conectados"></small></h3><div id="conectados"></div></div>' +
      discordHTML(cfg && cfg.discord) + "</aside></div>";
    caja = $("#sala");
    pintarSalas({});
    entrarSala(sala);
    $("#salas").addEventListener("click", function (e) {
      var b = e.target.closest("[data-sala]");
      if (!b) return;
      e.preventDefault();
      history.replaceState(null, "", "#" + b.dataset.sala);
      entrarSala(b.dataset.sala);
    });
    caja.addEventListener("click", alClickSala);
    temporizador = setInterval(traer, 4000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) traer(); });
  });

  function discordHTML(d) {
    if (!d) return "";
    return '<div class="panel discord"><h3>Discord</h3>' + (d.servidor ? '<iframe src="https://discord.com/widget?id=' + esc(d.servidor) +
      '&theme=dark" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" loading="lazy"></iframe>' : "") +
      (d.invitacion ? '<a class="boton oro" href="' + esc(d.invitacion) + '" target="_blank" rel="noopener">' + esc(t("chat.discord_entrar")) + "</a>" : "") + "</div>";
  }
  function pintarSalas(ultimos) {
    $("#salas").innerHTML = SALAS_CHAT.map(function (s) {
      var nuevo = ultimos[s[0]] && ultimos[s[0]] > (vistos[s[0]] || 0) && s[0] !== sala;
      return '<a href="#' + s[0] + '" data-sala="' + s[0] + '" class="' + (s[0] === sala ? "on" : "") + (nuevo ? " nuevo" : "") + '"><span>' + s[1] +
        "</span><b>" + esc(t("chat.sala_" + s[0])) + "</b>" + (s[0] === "gremio" ? '<i title="' + esc(t("chat.gremio_tit")) + '">🔒</i>' : "") + "</a>";
    }).join("");
  }
  function entrarSala(s) {
    sala = s;
    ultimo = 0;
    version = -1;
    responde = null;
    mensajes = {};
    $("#cabeza-sala").innerHTML = '<span class="ico">' + SALAS_CHAT.filter(function (x) { return x[0] === s; })[0][1] + "</span><div><b>" +
      esc(t("chat.sala_" + s)) + "</b><small>" + esc(t("chat.desc_" + s)) + "</small></div>" +
      (s === "grupos" && puedeEscribir() ? '<button class="boton oro chico" id="busco-grupo">🛡️ ' + esc(t("chat.busco")) + "</button>" : "");
    caja.innerHTML = '<div class="vacio-lista">' + esc(t("comun.cargando")) + "</div>";
    pintarEscribir();
    pintarSalas({});
    var bg = $("#busco-grupo");
    if (bg) bg.addEventListener("click", formularioGrupo);
    traer();
  }
  function pintarEscribir() {
    var z = $("#zona-escribir");
    if (!puedeEscribir()) { z.innerHTML = cajaEscribir("chat.entrar"); var en = $("#ir-entrar"); if (en) en.addEventListener("click", irAEntrar); return; }
    z.innerHTML = '<div class="respondiendo" id="respondiendo" hidden></div><form class="chat-escribir" id="decir">' +
      '<button type="button" class="boton-emoji" id="c-emoji" title="Emoji">😊</button>' +
      '<input id="c-texto" maxlength="500" autocomplete="off" placeholder="' + esc(t("chat.placeholder_sala")).replace("{sala}", esc(t("chat.sala_" + sala))) + '" required>' +
      '<button class="boton oro">' + esc(t("chat.enviar")) + "</button></form>";
    $("#c-emoji").addEventListener("click", function (e) { e.stopPropagation(); abrirEmojis(e.currentTarget, function (em) { insertarEnCaja($("#c-texto"), em); }); });
    $("#decir").addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = $("#c-texto"), texto = inp.value;
      inp.value = "";
      api("POST", "/api/chat", { sala: sala, texto: texto, responde_a: responde }).then(function () {
        quitarRespuesta();
        version = -1;
        traer();
      }).catch(function (er) { inp.value = texto; aviso(textoError(er), "mal"); });
    });
  }
  function quitarRespuesta() {
    responde = null;
    var r = $("#respondiendo");
    if (r) r.hidden = true;
  }
  function formularioGrupo() {
    if ($("#form-grupo")) return;
    $("#zona-escribir").insertAdjacentHTML("afterbegin", '<form class="panel form-grupo" id="form-grupo"><h3>🛡️ ' + esc(t("chat.busco")) + "</h3>" +
      '<div class="rejilla-grupo"><input id="g-mazmorra" maxlength="60" required placeholder="' + esc(t("chat.g_mazmorra")) + '">' +
      '<input id="g-rol" maxlength="40" placeholder="' + esc(t("chat.g_rol")) + '"><input id="g-hora" maxlength="30" placeholder="' + esc(t("chat.g_hora")) + '">' +
      '<select id="g-plazas">' + [2, 3, 4, 5, 6, 8].map(function (n) { return '<option value="' + n + '"' + (n === 4 ? " selected" : "") + ">" + n + " " + esc(t("chat.g_plazas")) + "</option>"; }).join("") +
      '</select></div><input id="g-texto" maxlength="300" placeholder="' + esc(t("chat.g_nota")) + '">' +
      '<div class="fila-form"><button type="button" class="boton" id="g-cerrar">' + esc(t("juego.cerrar")) + '</button><button class="boton oro">' + esc(t("chat.g_publicar")) + "</button></div></form>");
    $("#g-mazmorra").focus();
    $("#g-cerrar").addEventListener("click", function () { $("#form-grupo").remove(); });
    $("#form-grupo").addEventListener("submit", function (e) {
      e.preventDefault();
      api("POST", "/api/chat", { sala: sala, texto: $("#g-texto").value, grupo: {
        mazmorra: $("#g-mazmorra").value, rol: $("#g-rol").value, hora: $("#g-hora").value, plazas: +$("#g-plazas").value } })
        .then(function () { $("#form-grupo").remove(); version = -1; traer(); }).catch(function (er) { aviso(textoError(er), "mal"); });
    });
  }
  function grupoHTML(m) {
    var g = m.grupo, ap = g.apuntados || [], yo = YO && ap.indexOf(YO.usuario) >= 0, lleno = ap.length >= g.plazas;
    return '<div class="grupo-chat" data-grupo="' + m.id + '"><div class="cab"><b>🛡️ ' + esc(g.mazmorra) + "</b>" +
      (g.hora ? '<span class="chip">⏰ ' + esc(g.hora) + "</span>" : "") + (g.rol ? '<span class="chip">' + esc(t("chat.g_busca")) + " " + esc(g.rol) + "</span>" : "") + "</div>" +
      '<div class="plazas">' + Array.apply(null, Array(g.plazas)).map(function (_, i) {
        return '<span class="plaza' + (ap[i] ? " llena" : "") + '" title="' + esc(ap[i] || t("chat.g_libre")) + '">' + (ap[i] ? esc(ap[i].charAt(0).toUpperCase()) : "+") + "</span>";
      }).join("") + "<small>" + ap.length + "/" + g.plazas + " · " + esc(ap.join(", ")) + "</small></div>" +
      (puedeEscribir() ? '<button class="boton chico' + (yo ? "" : " oro") + '" data-apuntar="' + m.id + '"' + (lleno && !yo ? " disabled" : "") + ">" +
        esc(t(yo ? "chat.g_salir" : lleno ? "chat.g_lleno" : "chat.g_apuntar")) + "</button>" : "") + "</div>";
  }
  function linea(m, anterior) {
    mensajes[m.id] = m;
    var a = m.autor || {}, seguido = anterior && anterior.autor && a.usuario === anterior.autor.usuario && !m.grupo && !m.responde &&
      (new Date(m.creado) - new Date(anterior.creado)) < 5 * 60000;
    var mio = YO && a.usuario === YO.usuario, menciona = YO && !mio && new RegExp("@" + YO.usuario.replace(/[.]/g, "\\.") + "\\b", "i").test(m.texto);
    return '<div class="chat-msg' + (seguido ? " seguido" : "") + (menciona ? " menciona" : "") + '" data-id="' + m.id + '">' +
      (seguido ? '<span class="hueco-avatar"><time>' + esc(hora(m.creado)) + "</time></span>" : avatar(a)) + '<div class="cuerpo">' +
      (seguido ? "" : '<div class="cab"><b>' + esc(a.usuario || "?") + "</b>" + insignias(a) + "<time>" + esc(fechaHora(m.creado)) + "</time></div>") +
      (m.responde ? '<div class="cita-chat">↪ <b>' + esc(m.responde.autor) + "</b> " + esc(m.responde.texto) + "</div>" : "") +
      (m.texto ? '<div class="texto' + (soloEmojis(m.texto) ? " gigante" : "") + '">' + formato(m.texto) + "</div>" : "") + (m.grupo ? grupoHTML(m) : "") +
      "</div>" + (puedeEscribir() ? '<span class="acciones-chat"><button data-responder="' + m.id + '" title="' + esc(t("foro.responder")) + '">↩</button>' +
        (mio ? "" : '<button data-denunciar="' + m.id + '" title="' + esc(t("foro.denunciar")) + '">⚑</button>') + "</span>" : "") + "</div>";
  }
  function pintarConectados(lista) {
    $("#n-conectados").textContent = lista.length;
    $("#conectados").innerHTML = lista.length ? lista.map(function (p) {
      return '<div class="conectado"><span class="punto"></span><b>' + esc(p.usuario) + "</b>" + insignias({ rol: p.rol }) + "<small>" +
        esc(t("chat.sala_" + p.sala)) + "</small></div>";
    }).join("") : '<p class="suave">' + esc(t("chat.nadie")) + "</p>";
  }
  function traer() {
    if (document.hidden && ultimo) return;
    var pedida = sala;
    api("GET", "/api/chat?sala=" + sala + (ultimo ? "&desde=" + ultimo + "&v=" + version : "")).then(function (d) {
      if (pedida !== sala) return;
      pintarConectados(d.conectados || []);
      if (d.sin_cambios) { pintarSalas(d.ultimos || {}); return; }
      version = d.v;
      var lista = d.mensajes || [], abajo = caja.scrollHeight - caja.scrollTop - caja.clientHeight < 80;
      if (!ultimo) {
        caja.innerHTML = lista.length ? lista.map(function (m, i) { return linea(m, lista[i - 1]); }).join("")
          : '<div class="vacio-lista">' + esc(t("chat.vacio")) + "</div>";
        abajo = true;
      } else if (lista.length) {
        var vacio = caja.querySelector(".vacio-lista");
        if (vacio) vacio.remove();
        var previo = mensajes[ultimo];
        lista.forEach(function (m) { caja.insertAdjacentHTML("beforeend", linea(m, previo)); previo = m; });
      }
      Object.keys(d.grupos || {}).concat(Object.keys(mensajes).filter(function (k) { return mensajes[k].grupo; })).forEach(function (k) {
        var m = mensajes[k], el = caja.querySelector('[data-grupo="' + k + '"]');
        if (!m || !m.grupo || !el) return;
        m.grupo.apuntados = (d.grupos || {})[k] || [];
        el.outerHTML = grupoHTML(m);
      });
      lista.forEach(function (m) { if (m.id > ultimo) ultimo = m.id; });
      vistos[sala] = Math.max(vistos[sala] || 0, ultimo);
      try { localStorage.setItem("chat_vistos", JSON.stringify(vistos)); } catch (e) { /* sin almacenamiento */ }
      pintarSalas(d.ultimos || {});
      pintarTarjetas(caja);
      if (abajo) caja.scrollTop = caja.scrollHeight;
    }).catch(function (e) {
      if (pedida !== sala) return;
      if (e.codigo === 403) caja.innerHTML = '<div class="vacio-lista sala-cerrada">🔒 ' + esc(t("chat.gremio_cerrada")) + "</div>";
    });
  }
  function alClickSala(e) {
    var r = e.target.closest("[data-responder]");
    if (r) {
      var m = mensajes[r.dataset.responder];
      responde = +r.dataset.responder;
      var z = $("#respondiendo");
      if (z && m) {
        z.hidden = false;
        z.innerHTML = "↪ " + esc(t("chat.respondiendo")) + " <b>" + esc((m.autor || {}).usuario || "") + "</b> " + esc((m.texto || "").slice(0, 80)) +
          ' <button type="button" class="enlace" id="quitar-resp">✕</button>';
        $("#quitar-resp").addEventListener("click", quitarRespuesta);
        $("#c-texto").focus();
      }
      return;
    }
    var ap = e.target.closest("[data-apuntar]");
    if (ap) {
      api("POST", "/api/chat/" + ap.dataset.apuntar + "/apuntar", {}).then(function (lista) {
        var m = mensajes[ap.dataset.apuntar];
        if (!m) return;
        m.grupo.apuntados = lista;
        var el = caja.querySelector('[data-grupo="' + m.id + '"]');
        if (el) el.outerHTML = grupoHTML(m);
      }).catch(function (er) { aviso(textoError(er), "mal"); });
      return;
    }
    var b = e.target.closest("[data-denunciar]");
    if (!b) return;
    var motivo = pedirMotivo();
    if (!motivo) return;
    api("POST", "/api/chat/" + b.dataset.denunciar + "/denunciar", { motivo: motivo })
      .then(function () { aviso(t("foro.denuncia_ok"), "ok"); }).catch(function (er) { aviso(textoError(er), "mal"); });
  }
}

function panel() {
  var main = $("#main");
  cabecera("panel").then(function (u) {
    if (!u) { location.href = "entrar.html?volver=" + encodeURIComponent("panel.html"); return; }
    if (["moderador", "admin", "superadmin"].indexOf(u.rol) < 0) { location.href = "index.html"; return; }
    return api("GET", "/api/panel").then(function (d) { pintar(u, d); });
  }).catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });

  function avisosJuegoHTML(d) {
    var h = "";
    if (d.ultimo_parche) {
      h += '<div class="fila-panel"><span><b>' + esc(t("noticias.ultimo_parche")) + "</b><small>" + esc(d.ultimo_parche.titulo) + " · " +
        esc(fechaHora(d.ultimo_parche.publicado)) + '</small></span><a class="boton chico" href="noticia.html?id=' + d.ultimo_parche.id + '">' + esc(t("build.ver")) + "</a></div>";
    }
    var nuevas = d.habilidades_nuevas || {};
    Object.keys(nuevas).forEach(function (c) {
      h += '<div class="fila-panel"><span><b>' + esc(tr(claseInfo(c))) + " · " + nuevas[c].length + " " + esc(t("panel.hab_nuevas")) + "</b><small>" +
        esc(nuevas[c].join(", ")) + "</small></span></div>";
    });
    return h;
  }
  function discordForm(d) {
    if (!d) return "";
    return '<section class="panel panel-caja" id="sec-discord"><h2>Discord</h2><p class="suave">' + esc(t("panel.discord_txt")) + '</p><form id="discord" class="fila-form">' +
      '<input id="d-servidor" placeholder="' + esc(t("panel.discord_id")) + '" value="' + esc(d.servidor || "") + '" style="max-width:240px">' +
      '<input id="d-invitacion" placeholder="https://discord.gg/…" value="' + esc(d.invitacion || "") + '" style="max-width:280px">' +
      '<label class="interruptor"><input type="checkbox" id="d-voz"' + (d.voz ? " checked" : "") + '><span class="pista"></span>' + esc(t("panel.discord_voz")) + "</label>" +
      '<button class="boton">' + esc(t("panel.guardar")) + "</button></form></section>";
  }
  function pintar(u, d) {
    var nDen = (d.denuncias || []).length;
    var juegoHTML = avisosJuegoHTML(d);
    var nJuego = (juegoHTML.match(/fila-panel/g) || []).length;
    var atencion = nDen + nJuego;
    var rolTxt = t("panel.rol_" + u.rol) || u.rol;

    main.innerHTML =
      '<section class="panel-hero">' +
        '<div><span class="antetitulo">' + esc(t("panel.antetitulo")) + "</span>" +
        "<h1>" + esc(t("panel.titulo")) + "</h1>" +
        '<p class="suave">' + esc(t("panel.sub").replace("{rol}", rolTxt)) + "</p></div>" +
        '<div class="panel-kpi' + (atencion ? " urg" : "") + '"><span>' + esc(t("panel.pendiente")) + "</span><b>" + atencion + "</b></div>" +
      "</section>" +

      '<section class="panel-atajos">' +
        '<h2 class="panel-sec">' + esc(t("panel.atajos")) + "</h2>" +
        '<div class="panel-atajos-grid">' +
          '<a class="panel-atajo" href="mis-builds.html"><b>' + esc(t("nav.mis")) + "</b><small>" + esc(t("panel.atajo_builds")) + "</small></a>" +
          '<a class="panel-atajo" href="chat.html"><b>' + esc(t("nav.chat")) + "</b><small>" + esc(t("panel.atajo_chat")) + "</small></a>" +
          '<a class="panel-atajo" href="foro.html"><b>' + esc(t("nav.foro")) + "</b><small>" + esc(t("panel.atajo_foro")) + "</small></a>" +
          '<a class="panel-atajo" href="tops.html"><b>' + esc(t("nav.tops")) + "</b><small>" + esc(t("panel.atajo_tops")) + "</small></a>" +
          '<a class="panel-atajo" href="espia.html"><b>' + esc(t("nav.espia")) + "</b><small>" + esc(t("panel.atajo_espia")) + "</small></a>" +
          '<a class="panel-atajo" href="noticias.html"><b>' + esc(t("nav.noticias")) + "</b><small>" + esc(t("panel.atajo_noticias")) + "</small></a>" +
        "</div>" +
      "</section>" +

      '<section class="panel panel-caja' + (nDen ? " urgente" : "") + '">' +
        '<div class="panel-cabeza"><h2>' + esc(t("panel.denuncias")) + "</h2>" +
        (nDen ? '<span class="chip urg">' + nDen + "</span>" : "") + "</div>" +
        '<p class="suave">' + esc(t("panel.denuncias_txt")) + "</p>" +
        (nDen ? d.denuncias.map(function (x) {
          return '<div class="fila-panel"><span><b>' + esc(t("panel.tipo_" + x.tipo)) + " #" + x.objetivo + "</b> · " + esc(x.autor) +
            "<small>" + esc(x.motivo) + "</small></span>" +
            (x.tipo === "mensaje" ? '<button class="boton chico peligro" data-ocultar-msg="' + x.objetivo + '">' + esc(t("panel.ocultar")) + "</button>" : "") +
            (x.tipo === "chat" ? '<button class="boton chico peligro" data-chat="' + x.objetivo + '" data-oculto="1">' + esc(t("panel.ocultar")) + "</button>" : "") +
            '<button class="boton chico" data-resolver="' + x.id + '">' + esc(t("panel.resolver")) + "</button></div>";
        }).join("") : '<p class="suave ok-txt">' + esc(t("panel.sin_denuncias")) + "</p>") +
      "</section>" +

      (juegoHTML
        ? '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.juego")) + "</h2>" +
          (nJuego ? '<span class="chip">' + nJuego + "</span>" : "") + "</div>" +
          '<p class="suave">' + esc(t("panel.juego_txt")) + "</p>" + juegoHTML + "</section>"
        : "") +

      '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.chat_reciente")) + "</h2>" +
        '<a class="enlace" href="chat.html">' + esc(t("panel.ir_chat")) + "</a></div>" +
        '<p class="suave">' + esc(t("panel.chat_txt")) + "</p>" +
        ((d.chat || []).length ? d.chat.map(function (c) {
          return '<div class="fila-panel' + (c.oculto ? " oculto" : "") + '"><span><b>' + esc(c.autor) + "</b> " + esc(c.texto) +
            (c.oculto ? " <i>" + esc(t("panel.oculto")) + "</i>" : "") + "</span>" +
            '<button class="boton chico' + (c.oculto ? "" : " peligro") + '" data-chat="' + c.id + '" data-oculto="' + (c.oculto ? "0" : "1") + '">' +
            esc(t(c.oculto ? "panel.mostrar" : "panel.ocultar")) + "</button></div>";
        }).join("") : '<p class="suave">' + esc(t("panel.chat_vacio")) + "</p>") +
      "</section>" +

      '<section class="panel panel-caja panel-roles">' +
        '<div class="panel-cabeza"><h2>' + esc(t("panel.roles_titulo")) + "</h2></div>" +
        '<p class="suave">' + esc(t("panel.roles_txt")) + "</p>" +
        '<div class="panel-roles-grid">' +
          '<div class="panel-rol-card"><b>' + esc(t("panel.rol_usuario")) + "</b><small>" + esc(t("panel.rol_usuario_txt")) + "</small></div>" +
          '<div class="panel-rol-card"><b>' + esc(t("panel.rol_moderador")) + "</b><small>" + esc(t("panel.rol_moderador_txt")) + "</small></div>" +
          '<div class="panel-rol-card"><b>' + esc(t("panel.rol_admin")) + "</b><small>" + esc(t("panel.rol_admin_txt")) + "</small></div>" +
          '<div class="panel-rol-card on"><b>' + esc(t("panel.rol_superadmin")) + "</b><small>" + esc(t("panel.rol_superadmin_txt")) + "</small></div>" +
        "</div>" +
      "</section>" +

      (u.rol === "superadmin"
        ? '<section class="panel panel-caja panel-equipo" id="sec-equipo">' +
            '<div class="panel-cabeza"><h2>' + esc(t("panel.equipo")) + "</h2>" +
            '<span class="chip">' + esc(t("panel.solo_super")) + "</span></div>" +
            '<p class="suave">' + esc(t("panel.equipo_txt")) + "</p>" +
            '<div id="gente"><p class="suave">' + esc(t("comun.cargando")) + "</p></div>" +
            discordForm(d.discord) +
          "</section>"
        : "") +

      '<details class="panel panel-caja panel-avanzado"><summary><h2>' + esc(t("panel.herramientas")) + '</h2><span class="suave">' + esc(t("panel.herramientas_txt")) + '</span></summary>' +
        '<div class="panel-avanzado-in">' +
          '<h3>' + esc(t("panel.mod")) + '</h3>' +
          '<p class="suave">' + esc(t("panel.mod_txt")) + '</p><form id="mod-tema" class="fila-form">' +
          '<input id="tema-id" type="number" min="1" placeholder="ID" required style="max-width:110px">' +
          "<label class=\"interruptor\"><input type=\"checkbox\" id=\"tema-cerrado\"><span class=\"pista\"></span>" + esc(t("panel.cerrar")) + "</label>" +
          "<label class=\"interruptor\"><input type=\"checkbox\" id=\"tema-oculto\"><span class=\"pista\"></span>" + esc(t("panel.ocultar")) + "</label>" +
          (u.rol === "admin" || u.rol === "superadmin"
            ? "<label class=\"interruptor\"><input type=\"checkbox\" id=\"tema-fijado\"><span class=\"pista\"></span>" + esc(t("panel.fijar")) + "</label>" : "") +
          '<button class="boton">' + esc(t("panel.guardar")) + "</button></form>" +
        "</div></details>";

    main.onclick = function (e) {
      var r = e.target.closest("[data-resolver]");
      if (r) api("POST", "/api/panel/denuncias/" + r.dataset.resolver, {}).then(recargar).catch(function (er) { aviso(textoError(er), "mal"); });
      var om = e.target.closest("[data-ocultar-msg]");
      if (om) api("POST", "/api/panel/mensajes/" + om.dataset.ocultarMsg, { oculto: true }).then(recargar).catch(function (er) { aviso(textoError(er), "mal"); });
      var c = e.target.closest("[data-chat]");
      if (c) api("POST", "/api/panel/chat/" + c.dataset.chat, { oculto: c.dataset.oculto === "1" }).then(recargar).catch(function (er) { aviso(textoError(er), "mal"); });
    };
    var modTema = $("#mod-tema");
    if (modTema) modTema.addEventListener("submit", function (e) {
      e.preventDefault();
      var cuerpo = { cerrado: $("#tema-cerrado").checked, oculto: $("#tema-oculto").checked };
      var fij = $("#tema-fijado");
      if (fij) cuerpo.fijado = fij.checked;
      api("POST", "/api/panel/temas/" + $("#tema-id").value, cuerpo).then(function () { aviso(t("panel.ok"), "ok"); }).catch(function (er) { aviso(textoError(er), "mal"); });
    });
    var dc = $("#discord");
    if (dc) dc.addEventListener("submit", function (e) {
      e.preventDefault();
      api("POST", "/api/panel/discord", { servidor: $("#d-servidor").value, invitacion: $("#d-invitacion").value, voz: $("#d-voz").checked })
        .then(function () { aviso(t("panel.ok"), "ok"); }).catch(function (er) { aviso(textoError(er), "mal"); });
    });
    if (u.rol === "superadmin") api("GET", "/api/panel/usuarios").then(gente);
  }
  function gente(lista) {
    var caja = $("#gente");
    if (!caja) return;
    caja.innerHTML = lista.map(function (p) {
      if (p.propio || p.rol === "superadmin") {
        return '<div class="fila-panel"><b>' + esc(p.usuario) + "</b><span>" + esc(t("panel.rol_" + p.rol)) +
          (p.propio ? " · " + esc(t("panel.tu")) : "") + "</span></div>";
      }
      return '<form class="fila-panel" data-usuario="' + p.id + '"><b>' + esc(p.usuario) + "</b>" +
        '<select data-rol>' + ["usuario", "moderador", "admin"].map(function (r) {
          return '<option value="' + r + '"' + (r === p.rol ? " selected" : "") + ">" + esc(t("panel.rol_" + r)) + "</option>";
        }).join("") + "</select>" +
        '<label class="dias">' + esc(t("panel.suspension")) + '<input data-dias type="number" min="0" max="30" value="0"></label>' +
        '<button class="boton chico">' + esc(t("panel.guardar")) + "</button></form>";
    }).join("");
    caja.addEventListener("submit", function (e) {
      var f = e.target.closest("[data-usuario]");
      if (!f) return;
      e.preventDefault();
      api("POST", "/api/panel/usuarios/" + f.dataset.usuario, { rol: f.querySelector("[data-rol]").value, dias: parseInt(f.querySelector("[data-dias]").value, 10) || 0 })
        .then(function () { aviso(t("panel.ok"), "ok"); }).catch(function (er) { aviso(textoError(er), "mal"); });
    });
  }
  function recargar() { location.reload(); }
}
