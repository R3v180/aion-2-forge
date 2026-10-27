// Utilidades comunes: API, sesión, cabecera, tooltips y reglas de habilidades
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function param(n) { return new URLSearchParams(location.search).get(n); }
function $(sel, raiz) { return (raiz || document).querySelector(sel); }

// Sin backend propio: GitHub Pages lee API en Render. El preview :8766 usa proxy local /api → Render.
// Sesión (entrar, mis builds) siempre en la web principal.
var WEB_PRINCIPAL = "https://orden-celeste-aion2.onrender.com";
var ESCAPARATE = /\.github\.io$/.test(location.hostname) || location.protocol === "file:";
var PREVIEW_PROXY = location.port === "8766";
var SIN_SESION_LOCAL = ESCAPARATE || PREVIEW_PROXY;
function paginaActual() { return location.pathname.split("/").pop() || "index.html"; }
function enPrincipal(ruta) { return WEB_PRINCIPAL + "/" + ruta.replace(/^\//, ""); }
function apiBase() { return ESCAPARATE ? WEB_PRINCIPAL : ""; }
if (SIN_SESION_LOCAL && /^(mis-builds|nueva-build|entrar|panel|panel-super)\.html$/.test(paginaActual())) {
  location.replace(enPrincipal(paginaActual() + location.search));
}
if (SIN_SESION_LOCAL) {
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (a && /^(mis-builds|nueva-build|entrar|panel|panel-super)\.html/.test(a.getAttribute("href"))) a.href = enPrincipal(a.getAttribute("href"));
  }, true);
}

function api(metodo, ruta, cuerpo) {
  var op = { method: metodo, headers: {}, credentials: SIN_SESION_LOCAL ? "omit" : "same-origin" };
  if (cuerpo !== undefined) {
    op.headers["Content-Type"] = "application/json";
    op.body = JSON.stringify(cuerpo);
  }
  return fetch(apiBase() + ruta, op).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (d) {
      if (!r.ok) { var e = new Error(d.error || "generico"); e.codigo = r.status; e.datos = d; throw e; }
      return d;
    });
  });
}
function textoError(e) {
  var k = "err." + (e && e.message);
  return TEXTOS[k] ? t(k) : t("err.generico");
}

var YO = null;
function cargarYo() {
  if (SIN_SESION_LOCAL) return Promise.resolve(null);
  return api("GET", "/api/yo").then(function (d) { YO = d.usuario; return YO; }).catch(function () { return null; });
}

function cabecera(activa) {
  function enlaceNav(href, key, id, extra) {
    var clases = [];
    if (id === activa) clases.push("on");
    if (extra) clases.push(extra);
    return '<a href="' + href + '"' + (clases.length ? ' class="' + clases.join(" ") + '"' : "") + ">" + esc(t(key)) + "</a>";
  }
  function grupoNav(key, hijos, extra) {
    var on = hijos.some(function (h) { return h[2] === activa; });
    var clases = ["nav-grupo"];
    if (on) clases.push("on");
    if (extra) clases.push(extra);
    return '<div class="' + clases.join(" ") + '">' +
      '<button type="button" class="nav-tog" aria-expanded="false">' + esc(t(key)) + "<i></i></button>" +
      '<div class="nav-sub">' + hijos.map(function (h) {
        return enlaceNav(h[0], h[1], h[2], h[3]);
      }).join("") + "</div></div>";
  }
  var nav =
    enlaceNav("index.html", "nav.inicio", "inicio") +
    grupoNav("nav.juego", [
      ["clases.html", "nav.clases", "clases"],
      ["builds.html", "nav.builds", "builds"],
      ["guias.html", "nav.guias", "guias"],
      ["mapa.html", "nav.mapa", "mapa"],
      ["timers.html", "nav.timers", "timers"]
    ]) +
    grupoNav("nav.espia_grupo", [
      ["espia.html", "nav.espia", "espia", "nav-espia"],
      ["tops.html", "nav.tops", "tops"]
    ], "nav-espia-grupo") +
    enlaceNav("noticias.html", "nav.noticias", "noticias") +
    grupoNav("nav.comunidad", [
      ["foro.html", "nav.foro", "foro"],
      ["chat.html", "nav.chat", "chat"]
    ]);
  var html = '<header class="top"><div class="in">' +
    '<a class="logo" href="index.html"><img class="emblema" src="img/orden-celeste-emblema.svg" alt="">' +
    '<span class="logo-txt"><span class="logo-a">Orden <span class="logo-2">Celeste</span></span><small>AION 2 · ' + esc(t("nav.gremio")) + "</small></span></a>" +
    '<button class="menu-movil" aria-label="' + esc(t("nav.menu")) + '" aria-expanded="false">☰</button>' +
    '<nav class="principal">' + nav + "</nav>" +
    '<div class="acciones"><div class="idioma">' + ["es", "en"].map(function (l) {
      return '<button data-idioma="' + l + '"' + (l === IDIOMA ? ' class="on"' : "") + ">" + l.toUpperCase() + "</button>";
    }).join("") + '</div><span id="zona-usuario"></span></div></div></header>';
  document.body.insertAdjacentHTML("afterbegin", html);
  document.body.insertAdjacentHTML("beforeend",
    '<footer class="pie"><div class="in"><span>' + esc(t("pie.aviso")) + '</span><span>' + esc(t("inicio.fuentes")) +
    ' <a href="https://questlog.gg/aion-2" target="_blank" rel="noopener">questlog.gg</a> · ' +
    '<a href="https://expcarry.com/aion-2-chanter-guide" target="_blank" rel="noopener">expcarry</a></span><span id="pie-discord"></span></div></footer><div id="tip"></div><div id="aviso"></div>');
  api("GET", "/api/config").then(function (c) {
    if (c.discord && c.discord.invitacion) $("#pie-discord").innerHTML = '<a class="boton chico" href="' + esc(c.discord.invitacion) + '" target="_blank" rel="noopener">Discord</a>';
  }).catch(function () {});
  document.querySelectorAll("[data-idioma]").forEach(function (b) {
    b.addEventListener("click", function () { cambiarIdioma(b.dataset.idioma); });
  });
  var top = $("header.top"), menu = $(".menu-movil", top);
  menu.addEventListener("click", function () {
    menu.setAttribute("aria-expanded", top.classList.toggle("abierta"));
  });
  top.querySelectorAll(".nav-tog").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var g = btn.closest(".nav-grupo");
      var abrir = !g.classList.contains("abierto");
      top.querySelectorAll(".nav-grupo.abierto").forEach(function (x) {
        x.classList.remove("abierto");
        var t = $(".nav-tog", x); if (t) t.setAttribute("aria-expanded", "false");
      });
      if (abrir) {
        g.classList.add("abierto");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", function () {
    top.querySelectorAll(".nav-grupo.abierto").forEach(function (x) {
      x.classList.remove("abierto");
      var t = $(".nav-tog", x); if (t) t.setAttribute("aria-expanded", "false");
    });
  });
  function cerrarMenuMovil() {
    top.classList.remove("abierta");
    menu.setAttribute("aria-expanded", "false");
  }
  top.querySelectorAll("nav.principal a").forEach(function (a) {
    a.addEventListener("click", cerrarMenuMovil);
  });
  activarTips();
  pingVisita();
  return cargarYo().then(function (u) {
    var z = $("#zona-usuario");
    if (u) {
      var staff = u.rol === "moderador" || u.rol === "admin" || u.rol === "superadmin";
      var badge = staff && u.pendientes ? '<i class="badge-nav">' + (u.pendientes > 99 ? "99+" : u.pendientes) + "</i>" : "";
      var panel = staff
        ? '<a class="boton chico' + (activa === "panel" ? " on" : "") + '" href="panel.html">' + esc(t("nav.panel")) + badge + "</a>" : "";
      var superL = u.rol === "superadmin"
        ? '<a class="boton chico' + (activa === "super" ? " on" : "") + '" href="panel-super.html">' + esc(t("nav.super")) + "</a>" : "";
      z.innerHTML = panel + superL + '<a class="boton chico' + (activa === "mis" ? " on" : "") + '" href="mis-builds.html">' + esc(t("nav.mis")) + '</a>' +
        '<span class="quien">' + esc(u.usuario) + '</span><button class="enlace" id="salir">' + esc(t("nav.salir")) + "</button>";
      $("#salir").addEventListener("click", function () {
        api("POST", "/api/salir", {}).then(function () { location.href = "index.html"; });
      });
    } else {
      var volver = SIN_SESION_LOCAL ? "/" + paginaActual() + location.search : location.pathname + location.search;
      z.innerHTML = '<a class="boton chico oro" href="' + (SIN_SESION_LOCAL ? WEB_PRINCIPAL + "/" : "") + "entrar.html?volver=" + encodeURIComponent(volver) + '">' + esc(t("nav.entrar")) + "</a>";
    }
    z.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrarMenuMovil); });
    return u;
  });
}

function aviso(texto, tipo) {
  var a = $("#aviso");
  a.textContent = texto;
  a.className = "visible " + (tipo || "");
  clearTimeout(aviso._t);
  aviso._t = setTimeout(function () { a.className = ""; }, 2600);
}

function vidVisita() {
  try {
    var k = "oc_vid", v = localStorage.getItem(k);
    if (!v || !/^[a-zA-Z0-9_-]{8,64}$/.test(v)) {
      v = (crypto.randomUUID ? crypto.randomUUID() : "v" + Date.now() + Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
      localStorage.setItem(k, v);
    }
    return v;
  } catch (e) { return ""; }
}

function pingVisita() {
  var ruta = "/" + paginaActual();
  api("POST", "/api/visita", { ruta: ruta, vid: vidVisita() }).catch(function () {});
}

function fmtNum(n) {
  n = Math.max(0, parseInt(n, 10) || 0);
  try { return n.toLocaleString(IDIOMA === "en" ? "en-GB" : "es-ES"); }
  catch (e) { return String(n); }
}

function activarTips() {
  var tip = $("#tip");
  document.addEventListener("mouseover", function (e) {
    var el = e.target.closest && e.target.closest("[data-tip]");
    if (!el) { tip.style.display = "none"; return; }
    tip.innerHTML = el.getAttribute("data-tip");
    tip.style.display = "block";
  });
  document.addEventListener("mousemove", function (e) {
    if (tip.style.display !== "block") return;
    var x = Math.min(e.clientX + 16, window.innerWidth - tip.offsetWidth - 10);
    var y = e.clientY + 18;
    if (y + tip.offsetHeight > window.innerHeight - 6) y = e.clientY - tip.offsetHeight - 12;
    tip.style.left = Math.max(6, x) + "px";
    tip.style.top = Math.max(6, y) + "px";
  });
}

function fecha(iso) {
  return new Date(iso).toLocaleDateString(IDIOMA === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ---------- catálogo y reglas (mismas que reglas.py) ----------
var _catalogos = {};
function cargarCatalogo(clase) {
  if (_catalogos[clase]) return Promise.resolve(_catalogos[clase]);
  return fetch("data/catalogo/" + clase + ".json").then(function (r) { return r.json(); }).then(function (c) {
    c.porId = {};
    c.habilidades.forEach(function (h) { c.porId[h.id] = h; });
    return (_catalogos[clase] = c);
  });
}
var NIVEL_MAX = 20;
var NIVEL_MAX_HABILIDAD = 10;
var NIVEL_MAX_ESTIGMA = 20;
function huecosActiva(nivel) { return nivel >= 20 ? 3 : nivel >= 12 ? 2 : nivel >= 8 ? 1 : 0; }
function topePuntos(h) {
  if ((h || {}).tipo === "estigma") {
    var m = 0;
    (h.coste || []).forEach(function (c) { if (c && c[0] > m) m = c[0]; });
    return m || NIVEL_MAX_ESTIGMA;
  }
  return NIVEL_MAX_HABILIDAD;
}
function topeHabilidad(h, nivelPj) {
  var maximo = topePuntos(h);
  if (!h || !nivelPj) return maximo;
  var tope = 0;
  (h.coste || []).forEach(function (c) {
    if (c && c[0] <= maximo && (c[3] || 1) <= nivelPj) tope = Math.max(tope, c[0]);
  });
  return tope;
}
function reqSiguiente(h, nivel) {
  var fila = (h.coste || []).filter(function (c) { return c && c[0] === (nivel || 0) + 1; })[0];
  return fila ? (fila[3] || 1) : 0;
}
function espDisponibles(h, nivel) { return h.esp.filter(function (e) { return (e.nivel || 99) <= nivel; }); }

function numFmt(n) {
  return IDIOMA === "es" ? String(n).replace(".", ",") : String(n);
}
// descripción con los valores de daño del nivel indicado
function descripcion(h, nivel) {
  var txt = tr(h.desc);
  return esc(txt).replace(/\{(d\d+)\}/g, function (_, k) {
    var tabla = h.dano && h.dano[k];
    if (!tabla) return "?";
    var f = tabla[Math.max(0, Math.min(tabla.length, nivel || 1) - 1)];
    return '<b class="valor">' + numFmt(f[0]) + "% ATQ + " + f[1] + (f[2] > 1 ? " ×" + f[2] : "") + "</b>";
  }).replace(/\n/g, "<br>");
}
// puntos gastados hasta `nivel` (columna 1 = habilidad, 2 = estigma)
function puntosGastados(h, nivel) {
  var hab = 0, est = 0;
  (h.coste || []).forEach(function (c) {
    if (c[0] <= nivel) { hab += c[1] || 0; est += c[2] || 0; }
  });
  return [hab, est];
}
function arteGuia(g) {
  var mapa = window.GUIAS_ARTE || {}, cats = window.GUIAS_ARTE_CAT || {};
  if (g && g.slug && mapa[g.slug]) return mapa[g.slug];
  if (g && g.categoria && cats[g.categoria]) return cats[g.categoria];
  return mapa.cabecera || "img/guias/ss07.jpg";
}
function iconoHab(h, extra) {
  return h.icono ? '<img class="ico" src="icons/habilidades/' + h.icono + '.webp" alt="" loading="lazy"' + (extra || "") + ">" :
    '<span class="ico vacio"></span>';
}
function tipHabilidad(h, nivel, elegidas) {
  var n = nivel || 1;
  var html = "<div class='tt-nombre'>" + esc(tr(h.nombre)) + "</div><div class='tt-sub'>" + esc(t("tipo1." + h.tipo)) +
    " · " + esc(t("build.nivel")) + " " + n + (h.enfriamiento ? " · " + numFmt(h.enfriamiento) + " s" : "") + "</div>" +
    "<div class='tt-desc'>" + descripcion(h, n) + "</div>";
  // elegidas === null → ficha NC: no sabemos las especializaciones de activas
  if (h.esp && h.esp.length && !(h.tipo === "activa" && elegidas === null)) {
    html += "<div class='tt-sec'>" + esc(t(h.tipo === "estigma" ? "build.propiedades" : "build.esp")) + "</div>" +
      h.esp.map(function (e) {
        var on = h.tipo === "estigma" ? (e.nivel || 99) <= (nivel || 0) : (elegidas || []).indexOf(e.n) >= 0;
        return "<div class='tt-esp" + (on ? " on" : "") + "'><span>" + (e.nivel || "") + "</span>" + esc(tr(e.texto)) + "</div>";
      }).join("");
  }
  return html;
}
