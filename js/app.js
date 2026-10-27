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
var WEB_PRINCIPAL = "https://aion-2-forge.onrender.com";
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

function htmlSelectorIdioma() {
  var actual = idiomaInfo(IDIOMA);
  var opciones = IDIOMAS.map(function (x) {
    var sel = x.id === IDIOMA;
    return '<button type="button" role="option" data-idioma="' + x.id + '"' +
      (sel ? ' aria-selected="true" class="on"' : ' aria-selected="false"') + ">" +
      htmlBanderaIdioma(x.id) +
      '<span class="idioma-nombre">' + esc(tr(x.nombre)) + "</span></button>";
  }).join("");
  return '<div class="idioma">' +
    '<button type="button" class="idioma-tog" aria-haspopup="listbox" aria-expanded="false" aria-label="' +
      esc(t("nav.idioma")) + ": " + esc(tr(actual.nombre)) + '">' +
    htmlBanderaIdioma(actual.id) +
    '<span class="idioma-cod">' + actual.id.toUpperCase() + "</span>" +
    '<i class="idioma-flecha" aria-hidden="true"></i></button>' +
    '<div class="idioma-menu" role="listbox" aria-label="' + esc(t("nav.idioma")) + '">' + opciones + "</div></div>";
}
function cerrarSelectorIdioma(raiz) {
  var caja = $(".idioma", raiz || document);
  if (!caja) return;
  caja.classList.remove("abierto");
  var tog = $(".idioma-tog", caja);
  if (tog) tog.setAttribute("aria-expanded", "false");
}
function enlazarSelectorIdioma(top) {
  var caja = $(".idioma", top);
  if (!caja) return;
  var tog = $(".idioma-tog", caja);
  tog.addEventListener("click", function (e) {
    e.stopPropagation();
    top.querySelectorAll(".nav-grupo.abierto").forEach(function (x) {
      x.classList.remove("abierto");
      var nt = $(".nav-tog", x); if (nt) nt.setAttribute("aria-expanded", "false");
    });
    var abrir = !caja.classList.contains("abierto");
    cerrarSelectorIdioma(top);
    if (abrir) {
      caja.classList.add("abierto");
      tog.setAttribute("aria-expanded", "true");
    }
  });
  caja.querySelectorAll("[data-idioma]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      cambiarIdioma(b.dataset.idioma);
    });
  });
}
function cabecera(activa) {
  function enlaceNav(href, key, id, extra, hintKey) {
    var clases = [];
    if (id === activa) clases.push("on");
    if (extra) clases.push(extra);
    if (hintKey) clases.push("con-hint");
    var txt = esc(t(key));
    if (hintKey) {
      txt = '<span class="nav-label">' + txt + '</span><small class="nav-hint">' + esc(t(hintKey)) + "</small>";
    }
    return '<a href="' + href + '"' + (clases.length ? ' class="' + clases.join(" ") + '"' : "") + ">" + txt + "</a>";
  }
  function grupoNav(key, hijos, extra) {
    var on = hijos.some(function (h) { return h[2] === activa; });
    var clases = ["nav-grupo"];
    if (on) clases.push("on");
    if (extra) clases.push(extra);
    return '<div class="' + clases.join(" ") + '">' +
      '<button type="button" class="nav-tog" aria-expanded="false">' + esc(t(key)) + "<i></i></button>" +
      '<div class="nav-sub">' + hijos.map(function (h) {
        return enlaceNav(h[0], h[1], h[2], h[3], h[4]);
      }).join("") + "</div></div>";
  }
  /* Menú por intención: Espía · Progresión · Utilidades · Noticias · Comunidad */
  var nav =
    enlaceNav("index.html", "nav.inicio", "inicio") +
    grupoNav("nav.espia_grupo", [
      ["espia.html", "nav.espia", "espia", "nav-espia", "nav.hint.espia"],
      ["tops.html", "nav.tops", "tops", null, "nav.hint.tops"]
    ], "nav-espia-grupo") +
    grupoNav("nav.progresion", [
      ["clases.html", "nav.clases", "clases", null, "nav.hint.clases"],
      ["builds.html", "nav.builds", "builds", null, "nav.hint.builds"],
      ["guias.html", "nav.guias", "guias", null, "nav.hint.guias"]
    ]) +
    grupoNav("nav.utiles", [
      ["mapa.html", "nav.mapa", "mapa", null, "nav.hint.mapa"],
      ["timers.html", "nav.timers", "timers", null, "nav.hint.timers"],
      ["herramientas.html", "nav.herramientas", "herramientas", null, "nav.hint.herramientas"]
    ]) +
    enlaceNav("noticias.html", "nav.noticias", "noticias") +
    grupoNav("nav.comunidad", [
      ["foro.html", "nav.foro", "foro", null, "nav.hint.foro"],
      ["chat.html", "nav.chat", "chat", null, "nav.hint.chat"]
    ]);
  var html = '<header class="top"><div class="in">' +
    '<a class="logo" href="index.html"><img class="emblema" src="img/aion-2-forge-emblema.svg" alt="">' +
    '<span class="logo-txt"><span class="logo-a">Aion 2 <span class="logo-2">Forge</span></span><small>' + esc(t("nav.comunidad_tag")) + "</small></span></a>" +
    '<button class="menu-movil" aria-label="' + esc(t("nav.menu")) + '" aria-expanded="false">☰</button>' +
    '<nav class="principal">' + nav + "</nav>" +
    '<div class="acciones">' + htmlSelectorIdioma() + '<span id="zona-usuario"></span></div></div></header>';
  document.body.insertAdjacentHTML("afterbegin", html);
  document.body.insertAdjacentHTML("beforeend",
    '<footer class="pie"><div class="in"><span>' + esc(t("pie.aviso")) + '</span>' +
    '<span class="pie-legal">' +
      '<a href="faq.html">' + esc(t("nav.faq")) + "</a>" +
      '<a href="legal.html?s=aviso">' + esc(t("legal.nav_aviso")) + "</a>" +
      '<a href="legal.html?s=privacidad">' + esc(t("legal.nav_privacidad")) + "</a>" +
      '<a href="legal.html?s=cookies">' + esc(t("legal.nav_cookies")) + "</a>" +
    "</span><span>" + esc(t("inicio.fuentes")) +
    ' <a href="https://questlog.gg/aion-2" target="_blank" rel="noopener">questlog.gg</a> · ' +
    '<a href="https://expcarry.com/aion-2-chanter-guide" target="_blank" rel="noopener">expcarry</a></span><span id="pie-discord"></span></div></footer><div id="tip"></div><div id="aviso"></div>');
  api("GET", "/api/config").then(function (c) {
    if (c.discord && c.discord.invitacion) $("#pie-discord").innerHTML = '<a class="boton chico" href="' + esc(c.discord.invitacion) + '" target="_blank" rel="noopener">Discord</a>';
  }).catch(function () {});
  var top = $("header.top"), menu = $(".menu-movil", top);
  enlazarSelectorIdioma(top);
  menu.addEventListener("click", function () {
    menu.setAttribute("aria-expanded", top.classList.toggle("abierta"));
  });
  top.querySelectorAll(".nav-tog").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      cerrarSelectorIdioma(top);
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
    cerrarSelectorIdioma(top);
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
      var nNotif = u.notificaciones || 0;
      var badgeNotif = nNotif ? '<i class="badge-nav">' + (nNotif > 99 ? "99+" : nNotif) + "</i>" : "";
      var campana = '<div class="campana-wrap">' +
        '<button type="button" class="boton chico campana" id="btn-campana" aria-expanded="false" title="' + esc(t("notif.titulo")) + '">🔔' + badgeNotif + "</button>" +
        '<div class="campana-panel" id="campana-panel" hidden><div class="campana-cab"><b>' + esc(t("notif.titulo")) +
        '</b><button type="button" class="enlace" id="notif-leer-todas">' + esc(t("notif.leer_todas")) + "</button></div>" +
        '<div class="campana-lista" id="campana-lista"><div class="suave">' + esc(t("comun.cargando")) + "</div></div></div></div>";
      z.innerHTML = panel + superL + campana + '<a class="boton chico' + (activa === "mis" ? " on" : "") + '" href="mis-builds.html">' + esc(t("nav.mis")) + '</a>' +
        '<span class="quien">' + esc(u.usuario) + '</span><button class="enlace" id="salir">' + esc(t("nav.salir")) + "</button>";
      $("#salir").addEventListener("click", function () {
        api("POST", "/api/salir", {}).then(function () { location.href = "index.html"; });
      });
      montarCampana();
    } else {
      var volver = SIN_SESION_LOCAL ? "/" + paginaActual() + location.search : location.pathname + location.search;
      z.innerHTML = '<a class="boton chico oro" href="' + (SIN_SESION_LOCAL ? WEB_PRINCIPAL + "/" : "") + "entrar.html?volver=" + encodeURIComponent(volver) + '">' + esc(t("nav.entrar")) + "</a>";
    }
    z.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrarMenuMovil); });
    return u;
  });
}

function montarCampana() {
  var btn = $("#btn-campana"), panel = $("#campana-panel"), lista = $("#campana-lista");
  if (!btn || !panel) return;
  function pintarBadge(n) {
    if (YO) YO.notificaciones = n;
    var badge = btn.querySelector(".badge-nav");
    if (n > 0) {
      if (!badge) {
        badge = document.createElement("i");
        badge.className = "badge-nav";
        btn.appendChild(badge);
      }
      badge.textContent = n > 99 ? "99+" : n;
    } else if (badge) badge.remove();
  }
  function cargarLista() {
    lista.innerHTML = '<div class="suave">' + esc(t("comun.cargando")) + "</div>";
    api("GET", "/api/notificaciones?limit=20").then(function (filas) {
      if (!filas.length) {
        lista.innerHTML = '<div class="suave">' + esc(t("notif.vacio")) + "</div>";
        return;
      }
      lista.innerHTML = filas.map(function (n) {
        var href = n.url || "#";
        return '<a class="campana-item' + (n.leida ? "" : " nueva") + '" href="' + esc(href) + '" data-nid="' + n.id + '">' +
          "<b>" + esc(n.titulo) + "</b><small>" + esc(n.cuerpo || "") + "</small>" +
          "<span>" + esc(fecha(n.creado)) + "</span></a>";
      }).join("");
      var ids = filas.filter(function (n) { return !n.leida; }).map(function (n) { return n.id; });
      if (ids.length) {
        api("POST", "/api/notificaciones/leer", { ids: ids }).then(function (r) {
          pintarBadge(r.notificaciones || 0);
        }).catch(function () {});
      }
    }).catch(function () {
      lista.innerHTML = '<div class="suave">' + esc(t("err.generico")) + "</div>";
    });
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var abrir = panel.hidden;
    panel.hidden = !abrir;
    btn.setAttribute("aria-expanded", abrir ? "true" : "false");
    if (abrir) cargarLista();
  });
  var leerTodas = $("#notif-leer-todas");
  if (leerTodas) leerTodas.addEventListener("click", function (e) {
    e.stopPropagation();
    api("POST", "/api/notificaciones/leer", { todas: true }).then(function (r) {
      pintarBadge(r.notificaciones || 0);
      cargarLista();
    }).catch(function () {});
  });
  document.addEventListener("click", function () {
    if (!panel.hidden) {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });
  panel.addEventListener("click", function (e) { e.stopPropagation(); });
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
