/* Base de datos del cliente: buscar, ficha, craft, cubos y comparar. */
(function () {
  var TIPOS = ["todo", "objetos", "skills", "monstruos", "recetas", "misiones", "cubos"];
  var HREF_OK = /^\/(items|skills|monsters|recipes|quests)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
  var ESTADO = { q: "", tipo: "objetos", href: "", vista: "buscar" };
  var PINES = [];
  var TENGO = {};
  var FICHAS = {};
  var HITS = {};
  var CUBOS = null;
  var TIMER = null;
  var MEJORAS = {};

  function locale() { return IDIOMA === "en" ? "en-US" : "es-ES"; }
  function fmt(n, dec) {
    if (n == null || isNaN(Number(n))) return "—";
    return Number(n).toLocaleString(locale(), { maximumFractionDigits: dec == null ? 0 : dec });
  }
  function numDe(v) {
    if (v == null) return null;
    var n = parseFloat(String(v).replace(/,/g, "").replace("%", ""));
    return isNaN(n) ? null : n;
  }
  function urlIcono(path) {
    if (!path || path.indexOf("/game/") !== 0 || path.indexOf("..") >= 0) return "";
    return "https://aion2data.com" + path;
  }
  function fuenteOk(url) {
    return typeof url === "string" && url.indexOf("https://aion2data.com/") === 0;
  }
  function enlaceFuente(url, texto) {
    if (!fuenteOk(url)) return esc(texto || "");
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(texto || url) + "</a>";
  }
  function letraDe(nombre) {
    var ch = String(nombre || "").trim().charAt(0).toUpperCase();
    return /[0-9A-ZÁÉÍÓÚÜÑ]/.test(ch) ? ch : "·";
  }
  function imgIcono(path, nombre, sprite) {
    var u = urlIcono(path);
    var letra = letraDe(nombre);
    if (u) {
      return '<img class="datos-ico" alt="" width="40" height="40" src="' + esc(u) + '" loading="lazy" decoding="async" data-letra="' + esc(letra) + '" onerror="this.outerHTML=\'<span class=&quot;datos-ico letra&quot;>\'+this.dataset.letra+\'</span>\'">';
    }
    if (sprite && sprite.length === 3) {
      var hoja = Number(sprite[0]) === 1 ? " s1" : "";
      return '<span class="datos-ico sprite' + hoja + '" style="--x:' + Number(sprite[1]) + ';--y:' + Number(sprite[2]) + '" aria-hidden="true"></span>';
    }
    return '<span class="datos-ico letra" aria-hidden="true">' + esc(letra) + "</span>";
  }
  function qlang(url) {
    return url + (url.indexOf("?") >= 0 ? "&" : "?") + "lang=" + encodeURIComponent(typeof IDIOMA === "string" ? IDIOMA : "es");
  }
  function ui(clave) {
    if (window.datosUi) {
      var propio = datosUi(clave);
      if (propio) return propio;
    }
    return t(clave);
  }
  function etiqueta(label, tipo) {
    return window.datosEtiqueta ? datosEtiqueta(label, tipo) : (label || "");
  }
  function subLocal(sub) {
    return window.datosSub ? datosSub(sub) : (sub || "");
  }
  function guardarPines() {
    try { localStorage.setItem("forge-datos-pines", JSON.stringify(PINES)); } catch (e) {}
  }
  function guardarTengo() {
    try { localStorage.setItem("forge-datos-tengo", JSON.stringify(TENGO)); } catch (e) {}
  }
  function claveTengo(nombre) { return String(nombre || "").trim().toLowerCase(); }

  function leerUrl() {
    var p = new URLSearchParams(location.search);
    var tipo = p.get("tipo") || "objetos";
    ESTADO.tipo = TIPOS.indexOf(tipo) >= 0 ? tipo : "objetos";
    ESTADO.q = (p.get("q") || "").slice(0, 80);
    var href = p.get("href") || "";
    ESTADO.href = HREF_OK.test(href) ? href : "";
    ESTADO.vista = p.get("vista") === "comparar" ? "comparar" : (ESTADO.href ? "ficha" : "buscar");
  }
  function syncUrl() {
    var p = new URLSearchParams();
    var lang = new URLSearchParams(location.search).get("lang");
    if (lang) p.set("lang", lang);
    if (ESTADO.tipo && ESTADO.tipo !== "objetos") p.set("tipo", ESTADO.tipo);
    if (ESTADO.q) p.set("q", ESTADO.q);
    if (ESTADO.vista === "ficha" && ESTADO.href) p.set("href", ESTADO.href);
    if (ESTADO.vista === "comparar") p.set("vista", "comparar");
    var s = p.toString();
    history.replaceState(null, "", "datos.html" + (s ? "?" + s : ""));
  }

  function shell() {
    var chips = TIPOS.map(function (id) {
      return '<button type="button" class="datos-chip' + (id === ESTADO.tipo ? " on" : "") + '" data-tipo="' + id + '" aria-pressed="' + (id === ESTADO.tipo ? "true" : "false") + '">' + esc(ui("datos.tipo." + id)) + "</button>";
    }).join("");
    $("#datos-app").innerHTML =
      '<div class="datos-busca panel">' +
        '<label class="datos-label" for="datos-q">' + esc(ui("datos.buscar")) + "</label>" +
        '<input id="datos-q" type="search" enterkeyhint="search" autocomplete="off" maxlength="80" placeholder="' + esc(ui("datos.ph")) + '" value="' + esc(ESTADO.q) + '">' +
        '<div class="datos-chips" role="tablist">' + chips + "</div>" +
        '<p class="datos-estado" id="datos-estado" role="status"></p>' +
        '<p class="datos-fuente suave">' + esc(ui("datos.fuente")) + " " + enlaceFuente("https://aion2data.com/about", "aion2data.com") + "</p>" +
      "</div>" +
      '<div id="datos-cuerpo"></div>' +
      '<div id="datos-bandeja"></div>';
    $("#datos-q").addEventListener("input", function () {
      ESTADO.q = this.value;
      if (ESTADO.vista !== "buscar") {
        ESTADO.vista = "buscar";
        ESTADO.href = "";
      }
      clearTimeout(TIMER);
      TIMER = setTimeout(function () {
        if (ESTADO.tipo === "cubos") pintarCubos();
        else buscar();
      }, 220);
    });
    $("#datos-app").addEventListener("click", alClick);
    $("#datos-app").addEventListener("change", alChange);
  }

  function estado(msg) {
    var el = $("#datos-estado");
    if (el) el.textContent = msg || "";
  }
  function cuerpo() { return $("#datos-cuerpo"); }

  function buscar() {
    syncUrl();
    if (ESTADO.tipo === "cubos") { pintarCubos(); return; }
    var q = ESTADO.q.trim();
    if (q.length < 2) {
      estado(ui("datos.minimo"));
      cuerpo().innerHTML = "";
      return;
    }
    estado(ui("datos.cargando"));
    api("GET", qlang("/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=" + encodeURIComponent(ESTADO.tipo)))
      .then(function (d) {
        if (ESTADO.q.trim() !== q || ESTADO.tipo === "cubos") return;
        pintarResultados(d.resultados || []);
        estado((d.resultados || []).length ? "" : ui("datos.nada"));
      })
      .catch(function (e) { estado(textoError(e)); cuerpo().innerHTML = ""; });
  }

  function pintarResultados(lista) {
    if (ESTADO.vista === "ficha" || ESTADO.vista === "comparar") return;
    lista.forEach(function (r) { HITS[r.href] = r; });
    cuerpo().innerHTML = '<div class="datos-grid">' + lista.map(function (r) {
      var pin = PINES.some(function (p) { return p.href === r.href; });
      return '<article class="datos-card panel">' +
        imgIcono(r.icon, etiqueta(r.label, r.tipo), r.sprite) +
        '<div class="datos-card-txt"><b>' + esc(etiqueta(r.label, r.tipo)) + "</b><small>" + esc(subLocal(r.sub)) + "</small></div>" +
        '<div class="datos-card-acc">' +
          '<button type="button" class="boton chico oro" data-abrir="' + esc(r.href) + '">' + esc(ui("datos.abrir")) + "</button>" +
          '<button type="button" class="boton chico' + (pin ? " on" : "") + '" data-pin="' + esc(r.href) + '" data-label="' + esc(etiqueta(r.label, r.tipo)) + '" data-en="' + esc(r.label_en || r.label) + '" data-sub="' + esc(subLocal(r.sub)) + '" data-icon="' + esc(r.icon || "") + '" data-sprite="' + esc((r.sprite || []).join(",")) + '">' + esc(pin ? ui("datos.en_comparar") : ui("datos.comparar")) + "</button>" +
        "</div></article>";
    }).join("") + "</div>";
    pintarBandeja();
  }

  function abrir(href) {
    if (!HREF_OK.test(href)) return;
    ESTADO.href = href;
    ESTADO.vista = "ficha";
    syncUrl();
    estado(ui("datos.cargando"));
    var lista = api("GET", qlang("/api/datos/ficha?href=" + encodeURIComponent(href)));
    lista.then(function (f) {
      FICHAS[href] = f;
      if (HITS[href]) f.icon = HITS[href].icon;
      if (ESTADO.href !== href) return;
      pintarFicha(f);
      estado("");
    }).catch(function (e) { estado(textoError(e)); });
  }

  function barra(pct, max) {
    var n = Number(pct);
    if (!isFinite(n) || n < 0) n = 0;
    var ancho = max > 0 ? Math.max(4, Math.min(100, n / max * 100)) : 0;
    return '<span class="datos-barra" style="--w:' + ancho.toFixed(1) + '%"><i></i></span>';
  }

  function pintarFicha(f) {
    var pin = PINES.some(function (p) { return p.href === f.href; });
    var icon = f.icon || "";
    PINES.forEach(function (p) { if (p.href === f.href && p.icon) icon = p.icon; });
    var html = '<article class="base-ficha panel">' +
      '<p><button type="button" class="enlace" data-volver="1">' + esc(ui("datos.volver")) + "</button></p>" +
      '<header class="datos-ficha-cab">' + imgIcono(icon, f.titulo, f.sprite) +
        "<div><h2>" + esc(f.titulo || "") + "</h2>" +
        (f.lead ? '<p class="suave">' + esc(f.lead) + "</p>" : "") +
        '<p class="datos-fuente">' + enlaceFuente(f.fuente, ui("datos.abierto")) +
        (f.build ? ' <span class="chip">' + esc(f.build) + "</span>" : "") + "</p></div></header>" +
      '<div class="datos-ficha-acc">' +
        '<button type="button" class="boton chico' + (pin ? " on" : "") + '" data-pin="' + esc(f.href) + '" data-label="' + esc(f.titulo || "") + '" data-sub="" data-icon="' + esc(icon) + '">' + esc(pin ? ui("datos.en_comparar") : ui("datos.comparar")) + "</button>" +
        '<button type="button" class="boton chico oro" data-craft="' + esc(f.titulo_en || f.titulo || "") + '">' + esc(ui("datos.craft")) + "</button>" +
      "</div>";
    if ((f.stats && f.stats.length) || (f.soul && f.soul.length)) {
      html += '<div class="datos-duo">';
      if (f.stats && f.stats.length) {
        html += '<section><h3>' + esc(ui("datos.stats")) + '</h3><ul class="datos-stats">';
        f.stats.forEach(function (s) {
          html += "<li><span>" + esc(s.nombre) + "</span><b>" + esc(s.valor) +
            (s.mejor ? ' <span class="datos-mejor" title="' + esc(ui("datos.mejor")) + '">★</span>' : "") + "</b></li>";
        });
        html += "</ul></section>";
      }
      if (f.soul && f.soul.length) {
        var maxS = f.soul.reduce(function (m, s) { return Math.max(m, s.pct || 0); }, 0);
        html += '<section><h3>' + esc(ui("datos.soul")) + '</h3><p class="suave datos-nota">' + esc(ui("datos.soul_txt")) + '</p><ul class="datos-odds">';
        f.soul.forEach(function (s) {
          html += "<li>" + barra(s.pct, maxS) + '<span class="datos-odds-nom">' + esc(s.nombre) + "</span>" +
            '<b>' + esc(s.chance) + "</b><small>" + esc(s.min) + "–" + esc(s.max) + "</small></li>";
        });
        html += "</ul></section>";
      }
      html += "</div>";
    }
    if (f.skills && f.skills.length) {
      html += '<section><h3>' + esc(ui("datos.skills")) + "</h3>" +
        '<label class="datos-label">' + esc(ui("datos.elige_stat")) +
        '<select id="datos-clase-skill">' + f.skills.map(function (g, i) {
          return '<option value="' + i + '">' + esc(g.clase) + "</option>";
        }).join("") + '</select></label><ul class="datos-odds" id="datos-skills-lista"></ul></section>';
    }
    if (f.drops && f.drops.length) {
      var maxD = f.drops.reduce(function (m, s) { return Math.max(m, s.pct || 0); }, 0);
      html += '<section><h3>' + esc(ui("datos.drops")) + '</h3><ul class="datos-odds">';
      f.drops.forEach(function (s) {
        html += "<li>" + barra(s.pct, maxD) + '<span class="datos-odds-nom">' + esc(s.nombre) + "</span><b>" + esc(s.chance) + "</b></li>";
      });
      html += "</ul></section>";
    }
    if (f.como && f.como.length) {
      html += '<section><h3>' + esc(ui("datos.como")) + '</h3><ul class="datos-como">' +
        f.como.map(function (l) { return "<li>" + esc(window.datosLinea ? datosLinea(l) : l) + "</li>"; }).join("") + "</ul></section>";
    }
    if (f.adds && f.adds.length) {
      html += '<section><h3>' + esc(ui("datos.adds")) + " +" + esc(String(f.adds[0].en)) + '</h3><ul class="datos-stats">' +
        f.adds.map(function (a) { return "<li><span>" + esc(a.stat) + "</span><b>+" + esc(a.delta) + "</b></li>"; }).join("") +
        "</ul></section>";
    }
    html += '<section id="datos-craft" hidden></section>';
    if (f.extra && f.extra.length) {
      html += '<details class="datos-mas"><summary>' + esc(ui("datos.mas")) + "</summary>" +
        f.extra.map(function (ex) {
          return "<h3>" + esc(ex.titulo) + '</h3><div class="datos-tabla-wrap"><table class="ht-tabla"><thead><tr>' +
            (ex.head || []).map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
            "</tr></thead><tbody>" + (ex.rows || []).map(function (row) {
              return "<tr>" + row.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
            }).join("") + "</tbody></table></div>";
        }).join("") + "</details>";
    }
    html += "</article>";
    cuerpo().innerHTML = html;
    if (f.skills && f.skills.length) pintarSkills(f, 0);
    pintarBandeja();
  }

  function pintarSkills(f, idx) {
    var lista = $("#datos-skills-lista");
    var g = (f.skills || [])[idx];
    if (!lista || !g) return;
    var maxS = g.skills.reduce(function (m, s) { return Math.max(m, s.pct || 0); }, 0);
    lista.innerHTML = g.skills.map(function (s) {
      return "<li>" + barra(s.pct, maxS) + '<span class="datos-odds-nom">' + esc(s.nombre) + " " + esc(s.bonus) + "</span><b>" + esc(s.chance) + "</b></li>";
    }).join("");
  }

  function pintarCraft(nombre) {
    var box = $("#datos-craft");
    if (!box) return;
    box.hidden = false;
    box.innerHTML = '<h3>' + esc(ui("datos.craft")) + "</h3>" +
      '<div class="datos-craft-top"><label>' + esc(ui("datos.cantidad")) +
      '<input id="datos-n" type="number" min="1" max="99" value="1"></label>' +
      '<button type="button" class="boton oro" id="datos-calc" data-nombre="' + esc(nombre) + '">' + esc(ui("datos.calcular")) + "</button></div>" +
      '<div id="datos-mats"></div>';
    pedirReceta(nombre, 1);
  }

  function comoMaterial(tablas, nombre) {
    var tabla = (tablas || [])[0];
    if (!tabla || !tabla.rows) return "";
    for (var i = 0; i < tabla.rows.length; i++) {
      var row = tabla.rows[i];
      if (row && String(row[0]) === String(nombre)) return String(row[2] || "");
    }
    return "";
  }

  function pedirReceta(nombre, n) {
    var box = $("#datos-mats");
    if (box) box.innerHTML = '<p class="suave">' + esc(ui("datos.cargando")) + "</p>";
    api("GET", qlang("/api/datos/receta?item=" + encodeURIComponent(nombre) + "&n=" + encodeURIComponent(n)))
      .then(function (d) { pintarMats(d); })
      .catch(function (e) {
        if (box) box.innerHTML = '<p class="error">' + esc(textoError(e)) + "</p>";
      });
  }

  function pintarMats(d) {
    var box = $("#datos-mats");
    if (!box) return;
    var base = d.base || {};
    var fuentes = (d.lineas && d.lineas.length) ? d.lineas : Object.keys(base).map(function (nom) {
      return { clave: nom, nombre: nom, qty: base[nom], como: comoMaterial(d.tablas, nom) };
    });
    var falta = 0;
    var filas = fuentes.map(function (ln) {
      var nom = ln.clave;
      var need = Number(ln.qty) || 0;
      var tengo = Math.max(0, Number(TENGO[claveTengo(nom)]) || 0);
      var rest = Math.max(0, need - tengo);
      falta += rest;
      var como = ln.como || "";
      return '<li class="datos-mat"><div><b>' + esc(ln.nombre || nom) + "</b>" +
        (como ? "<small>" + esc(como) + "</small>" : "") + "</div>" +
        '<span class="datos-need">' + esc(ui("datos.hace_falta")) + " <b>" + fmt(need) + "</b></span>" +
        '<span class="datos-step"><span>' + esc(ui("datos.tengo")) + "</span>" +
          '<button type="button" class="boton chico" data-mas="-1" data-mat="' + esc(nom) + '" data-need="' + need + '">−</button>' +
          '<input type="number" min="0" value="' + tengo + '" data-mat-input="' + esc(nom) + '" data-need="' + need + '">' +
          '<button type="button" class="boton chico" data-mas="1" data-mat="' + esc(nom) + '" data-need="' + need + '">+</button></span>' +
        '<span class="datos-falta' + (rest ? "" : " cero") + '">' + esc(ui("datos.falta")) + " <b data-falta>" + fmt(rest) + "</b></span></li>";
    }).join("");
    var fee = d.fee;
    var feeHtml = fee === 0 || fee === "0"
      ? '<p class="suave">' + esc(ui("datos.sin_fee")) + "</p>"
      : (fee != null ? '<p><b>' + esc(ui("datos.fee")) + "</b> " + fmt(fee) + "</p>" : "");
    box.innerHTML =
      (d.respuesta ? '<p class="datos-respuesta">' + esc(d.respuesta) + "</p>" : "") +
      '<div class="datos-totales"><div><span>' + esc(ui("datos.resta")) + '</span><b id="datos-falta-total">' + fmt(falta) + "</b></div>" +
        (d.crafts != null ? '<div><span>' + esc(ui("datos.crafts")) + "</span><b>" + fmt(d.crafts) + "</b></div>" : "") +
      "</div>" + feeHtml +
      '<ul class="datos-mats">' + filas + "</ul>" +
      (fuenteOk(d.fuente) ? '<p class="datos-fuente">' + enlaceFuente(d.fuente, ui("datos.abierto")) + "</p>" : "");
    box._receta = d;
  }

  function repintarFaltas() {
    var total = 0;
    document.querySelectorAll(".datos-mat").forEach(function (li) {
      var input = li.querySelector("[data-mat-input]");
      var need = Number(input && input.getAttribute("data-need")) || 0;
      var tengo = Math.max(0, Number(input && input.value) || 0);
      var rest = Math.max(0, need - tengo);
      total += rest;
      var b = li.querySelector("[data-falta]");
      if (b) b.textContent = fmt(rest);
      var falta = li.querySelector(".datos-falta");
      if (falta) falta.classList.toggle("cero", rest === 0);
    });
    var tot = $("#datos-falta-total");
    if (tot) tot.textContent = fmt(total);
  }

  function fijar(href, label, sub, icon) {
    if (!HREF_OK.test(href)) return;
    var ya = PINES.filter(function (p) { return p.href === href; });
    if (ya.length) {
      PINES = PINES.filter(function (p) { return p.href !== href; });
    } else {
      if (PINES.length >= 2) PINES.shift();
      PINES.push({ href: href, label: label || href, sub: sub || "", icon: icon || "" });
    }
    guardarPines();
    pintarBandeja();
    if (ESTADO.vista === "buscar") buscar();
    else if (ESTADO.vista === "ficha" && FICHAS[ESTADO.href]) pintarFicha(FICHAS[ESTADO.href]);
  }

  function pintarBandeja() {
    var el = $("#datos-bandeja");
    if (!el) return;
    if (!PINES.length && ESTADO.vista !== "comparar") { el.innerHTML = ""; return; }
    var huecos = PINES.slice();
    while (huecos.length < 2) huecos.push(null);
    el.innerHTML = '<div class="datos-bandeja panel">' +
      huecos.map(function (p) {
        if (!p) return '<span class="datos-hueco">' + esc(ui("datos.vacio_pin")) + "</span>";
        return '<span class="datos-pin">' + imgIcono(p.icon) + "<b>" + esc(p.label) + "</b>" +
          '<button type="button" class="enlace" data-unpin="' + esc(p.href) + '">' + esc(ui("datos.quitar")) + "</button></span>";
      }).join('<span class="datos-vs">vs</span>') +
      '<button type="button" class="boton oro" data-comparar="1"' + (PINES.length < 2 ? " disabled" : "") + ">" + esc(ui("datos.ver_comparar")) + "</button></div>";
  }

  function pintarComparar() {
    ESTADO.vista = "comparar";
    ESTADO.href = "";
    syncUrl();
    if (PINES.length < 2) {
      cuerpo().innerHTML = '<p class="panel suave">' + esc(ui("datos.elige_dos")) + "</p>";
      pintarBandeja();
      return;
    }
    estado(ui("datos.cargando"));
    Promise.all(PINES.map(function (p) {
      return FICHAS[p.href] ? Promise.resolve(FICHAS[p.href]) : api("GET", qlang("/api/datos/ficha?href=" + encodeURIComponent(p.href)));
    })).then(function (fichas) {
      fichas.forEach(function (f, i) { FICHAS[PINES[i].href] = f; });
      dibujarComparar(fichas);
      estado("");
    }).catch(function (e) { estado(textoError(e)); });
  }

  function statMap(f) {
    var m = {};
    (f.stats || []).forEach(function (s) { m[s.nombre] = s.valor; });
    return m;
  }

  function dibujarComparar(fichas) {
    var mapas = fichas.map(statMap);
    var nombres = [];
    mapas.forEach(function (m) {
      Object.keys(m).forEach(function (k) { if (nombres.indexOf(k) < 0) nombres.push(k); });
    });
    var cols = fichas.map(function (f, i) {
      return '<div class="datos-col"><header>' + imgIcono(PINES[i].icon) + "<h2>" + esc(f.titulo || PINES[i].label) + "</h2></header>" +
        '<div class="datos-mejora" id="datos-mejora-' + i + '"><p class="suave">' + esc(ui("datos.cargando")) + "</p></div></div>";
    }).join("");
    var filas = nombres.map(function (nom) {
      var vals = mapas.map(function (m) { return m[nom]; });
      var nums = vals.map(numDe);
      var max = nums.reduce(function (m, n) { return n == null ? m : Math.max(m, n); }, 0);
      return "<tr><th>" + esc(nom) + "</th>" + vals.map(function (v, i) {
        var n = nums[i];
        var gana = n != null && n === max && nums.filter(function (x) { return x === max; }).length === 1;
        var ancho = n == null || max <= 0 ? 0 : Math.max(6, n / max * 100);
        return '<td class="' + (gana ? "gana" : "") + '"><b>' + esc(v || "—") + "</b>" +
          (n == null ? "" : '<span class="datos-barra mini" style="--w:' + ancho.toFixed(1) + '%"><i></i></span>') + "</td>";
      }).join("") + "</tr>";
    }).join("");
    cuerpo().innerHTML =
      '<p><button type="button" class="enlace" data-volver="1">' + esc(ui("datos.volver")) + "</button></p>" +
      '<div class="datos-mejora-form">' +
        '<label>' + esc(ui("datos.desde")) + '<input id="datos-desde" type="number" min="0" max="20" value="0"></label>' +
        '<label>' + esc(ui("datos.hasta")) + '<input id="datos-hasta" type="number" min="1" max="25" value="15"></label>' +
        '<button type="button" class="boton oro" id="datos-calc-mejora">' + esc(ui("datos.calcular_mejora")) + "</button>" +
      "</div>" +
      '<p class="suave datos-nota" id="datos-veredicto"></p>' +
      '<div class="datos-cols">' + cols + "</div>" +
      (filas ? '<div class="datos-tabla-wrap"><table class="ht-tabla datos-cmp"><thead><tr><th>' + esc(ui("datos.stats")) + "</th>" +
        fichas.map(function (f) { return "<th>" + esc(f.titulo || "") + "</th>"; }).join("") +
        "</tr></thead><tbody>" + filas + "</tbody></table></div>" : "");
    pintarBandeja();
    pedirMejoras(fichas);
  }

  function pedirMejoras(fichas) {
    var desde = Number($("#datos-desde") && $("#datos-desde").value);
    var hasta = Number($("#datos-hasta") && $("#datos-hasta").value);
    if (!(desde >= 0 && hasta > desde && hasta <= 25)) {
      estado(t("err.datos_rango"));
      return;
    }
    Promise.all(fichas.map(function (f) {
      var nombre = f.titulo_en || f.titulo || "";
      return api("GET", qlang("/api/datos/mejora?item=" + encodeURIComponent(nombre) + "&desde=" + desde + "&hasta=" + hasta))
        .then(function (d) { return d; })
        .catch(function (e) { return { error: textoError(e) }; });
    })).then(function (lista) {
      MEJORAS = { desde: desde, hasta: hasta, lista: lista, fichas: fichas };
      lista.forEach(function (d, i) {
        var el = $("#datos-mejora-" + i);
        if (!el) return;
        if (d.error) { el.innerHTML = '<p class="error">' + esc(d.error) + "</p>"; return; }
        el.innerHTML =
          '<p class="datos-respuesta">' + esc(d.respuesta || "") + "</p>" +
          '<div class="datos-totales"><div><span>' + esc(ui("datos.kinah")) + "</span><b>" + fmt(d.kinah) + "</b></div>" +
          '<div><span>' + esc(ui("datos.intentos")) + "</span><b>" + fmt(d.intentos, 1) + "</b></div></div>" +
          (fuenteOk(d.fuente) ? '<p class="datos-fuente">' + enlaceFuente(d.fuente, ui("datos.abierto")) + "</p>" : "");
      });
      veredicto(fichas, lista, desde, hasta);
    });
  }

  function ratiosDe(ficha, mejora) {
    if (!mejora || mejora.error || !(Number(mejora.kinah) > 0) || Number(mejora.desde) !== 0) return [];
    return (ficha.adds || []).filter(function (a) { return Number(a.en) === Number(mejora.hasta); }).map(function (a) {
      var n = numDe(a.delta);
      return n == null ? null : { stat: a.stat, delta: a.delta, por: n / Number(mejora.kinah) * 1e6 };
    }).filter(Boolean);
  }

  function veredicto(fichas, lista, desde, hasta) {
    var el = $("#datos-veredicto");
    if (!el) return;
    var ratios = lista.map(function (d, i) { return ratiosDe(fichas[i], d); });
    var comunes = [];
    if (ratios[0] && ratios[1]) {
      ratios[0].forEach(function (a) {
        if (ratios[1].some(function (b) { return b.stat === a.stat; })) comunes.push(a.stat);
      });
    }
    var stat = (el.getAttribute("data-stat") && comunes.indexOf(el.getAttribute("data-stat")) >= 0) ? el.getAttribute("data-stat") : (comunes[0] || "");
    var html = "";
    if (comunes.length && desde === 0) {
      html += '<label class="datos-label">' + esc(ui("datos.elige_stat")) +
        '<select id="datos-stat-cmp">' + comunes.map(function (s) {
          return '<option' + (s === stat ? " selected" : "") + ">" + esc(s) + "</option>";
        }).join("") + "</select></label>";
      var a = ratios[0].filter(function (r) { return r.stat === stat; })[0];
      var b = ratios[1].filter(function (r) { return r.stat === stat; })[0];
      if (a && b) {
        var gana = a.por === b.por ? -1 : (a.por > b.por ? 0 : 1);
        html += "<p><b>" + esc(ui("datos.por_kinah")) + " · " + esc(stat) + ":</b> " +
          esc(fichas[0].titulo) + " " + fmt(a.por, 2) + " · " + esc(fichas[1].titulo) + " " + fmt(b.por, 2) + "</p>";
        if (gana >= 0) {
          html += '<p class="datos-veredicto"><b>' + esc(ui("datos.primero")) + ":</b> " + esc(fichas[gana].titulo) + "</p>";
        } else {
          html += '<p class="datos-veredicto">' + esc(ui("datos.empate")) + "</p>";
        }
        html += '<p class="suave">' + esc(ui("datos.rango_ratio")) + "</p>";
      }
    }
    var ks = lista.map(function (d) { return d && !d.error ? Number(d.kinah) : null; });
    if (ks[0] > 0 && ks[1] > 0) {
      if (ks[0] === ks[1]) {
        html += "<p>" + esc(ui("datos.igual")) + "</p>";
      } else {
        var barato = ks[0] < ks[1] ? 0 : 1;
        html += "<p><b>" + esc(ui("datos.mas_barato")) + ":</b> " + esc(fichas[barato].titulo) + " · " + fmt(ks[barato]) + " kinah</p>";
      }
    }
    el.innerHTML = html;
    if (stat) el.setAttribute("data-stat", stat);
  }

  function cargarCubos() {
    if (CUBOS) { pintarCubos(); return; }
    estado(ui("datos.cargando"));
    api("GET", qlang("/api/datos/cubos")).then(function (d) {
      CUBOS = d;
      pintarCubos();
      estado("");
    }).catch(function (e) { estado(textoError(e)); });
  }

  function pintarCubos() {
    if (!CUBOS) { cargarCubos(); return; }
    var q = _normJs(ESTADO.q);
    var modos = (CUBOS.modos || []).filter(function (m) {
      if (!q) return true;
      return _normJs(m.dungeon + " " + m.modo).indexOf(q) >= 0;
    });
    cuerpo().innerHTML =
      '<p class="suave datos-nota">' + esc(ui("datos.cubos_txt")) + "</p>" +
      '<p class="suave datos-nota">' + esc(ui("datos.asterisco")) + " " +
        enlaceFuente(CUBOS.fuente, ui("datos.abierto")) + "</p>" +
      '<div class="datos-grid cubos">' + modos.map(function (m) {
        var estrella = /\*/.test(m.kinah || "");
        return '<article class="datos-card panel datos-cubo">' +
          "<div><b>" + esc(m.dungeon) + "</b><small>" + esc(window.datosModo ? datosModo(m.modo) : m.modo) + "</small></div>" +
          '<ul class="datos-cubo-nums">' +
            "<li><span>" + esc(ui("datos.energia")) + "</span><b>" + esc(m.energia) + "</b></li>" +
            "<li><span>" + esc(ui("datos.hasta_premio")) + "</span><b>" + esc(m.cubos) + "</b></li>" +
            "<li><span>" + esc(ui("datos.kinah_cubo")) + "</span><b>" + esc(m.kinah) + (estrella ? "" : "") + "</b></li>" +
            "<li><span>" + esc(ui("datos.dias")) + "</span><b>" + esc(m.dias) + "</b></li>" +
          "</ul>" +
          (m.premio && m.premio !== "—" ? "<p>" + esc(ui("datos.premio")) + ": " + esc(m.premio) + "</p>" : "") +
          (fuenteOk("https://aion2data.com" + (m.href || "")) && m.href ? '<p class="datos-fuente">' + enlaceFuente("https://aion2data.com" + m.href, ui("datos.abierto")) + "</p>" : "") +
        "</article>";
      }).join("") + "</div>";
    estado(modos.length ? "" : ui("datos.nada"));
    pintarBandeja();
  }

  function _normJs(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function alClick(e) {
    var abrirBtn = e.target.closest("[data-abrir]");
    if (abrirBtn) { abrir(abrirBtn.getAttribute("data-abrir")); return; }
    var pin = e.target.closest("[data-pin]");
    if (pin) {
      fijar(pin.getAttribute("data-pin"), pin.getAttribute("data-label"), pin.getAttribute("data-sub"), pin.getAttribute("data-icon"));
      return;
    }
    var unpin = e.target.closest("[data-unpin]");
    if (unpin) { fijar(unpin.getAttribute("data-unpin"), "", "", ""); return; }
    if (e.target.closest("[data-volver]")) {
      ESTADO.vista = "buscar";
      ESTADO.href = "";
      syncUrl();
      if (ESTADO.tipo === "cubos") pintarCubos();
      else buscar();
      return;
    }
    if (e.target.closest("[data-comparar]")) { pintarComparar(); return; }
    var tipo = e.target.closest("[data-tipo]");
    if (tipo) {
      ESTADO.tipo = tipo.getAttribute("data-tipo");
      ESTADO.vista = "buscar";
      ESTADO.href = "";
      document.querySelectorAll(".datos-chip").forEach(function (b) {
        var on = b.getAttribute("data-tipo") === ESTADO.tipo;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      syncUrl();
      if (ESTADO.tipo === "cubos") cargarCubos();
      else buscar();
      return;
    }
    var craft = e.target.closest("[data-craft]");
    if (craft) { pintarCraft(craft.getAttribute("data-craft")); return; }
    if (e.target.id === "datos-calc") {
      var n = Math.max(1, Math.min(99, Number($("#datos-n").value) || 1));
      pedirReceta(e.target.getAttribute("data-nombre"), n);
      return;
    }
    if (e.target.id === "datos-calc-mejora" && MEJORAS.fichas) {
      pedirMejoras(MEJORAS.fichas);
      return;
    }
    var mas = e.target.closest("[data-mas]");
    if (mas) {
      var nom = mas.getAttribute("data-mat");
      var input = document.querySelector('[data-mat-input="' + CSS.escape(nom) + '"]');
      if (!input) return;
      var v = Math.max(0, (Number(input.value) || 0) + Number(mas.getAttribute("data-mas")));
      input.value = String(v);
      TENGO[claveTengo(nom)] = v;
      guardarTengo();
      repintarFaltas();
    }
  }

  function alChange(e) {
    if (e.target.id === "datos-clase-skill") {
      var f = FICHAS[ESTADO.href];
      if (f) pintarSkills(f, Number(e.target.value) || 0);
      return;
    }
    if (e.target.id === "datos-stat-cmp" && MEJORAS.fichas) {
      var box = $("#datos-veredicto");
      if (box) box.setAttribute("data-stat", e.target.value);
      veredicto(MEJORAS.fichas, MEJORAS.lista, MEJORAS.desde, MEJORAS.hasta);
      return;
    }
    var mat = e.target.getAttribute && e.target.getAttribute("data-mat-input");
    if (mat) {
      var v = Math.max(0, Number(e.target.value) || 0);
      e.target.value = String(v);
      TENGO[claveTengo(mat)] = v;
      guardarTengo();
      repintarFaltas();
    }
  }

  try { PINES = JSON.parse(localStorage.getItem("forge-datos-pines") || "[]"); } catch (e) { PINES = []; }
  if (!Array.isArray(PINES)) PINES = [];
  PINES = PINES.filter(function (p) { return p && HREF_OK.test(p.href); }).slice(-2);
  try { TENGO = JSON.parse(localStorage.getItem("forge-datos-tengo") || "{}"); } catch (e2) { TENGO = {}; }
  if (!TENGO || typeof TENGO !== "object") TENGO = {};

  cabecera("datos");
  traducirPagina();
  document.querySelectorAll("[data-t^='datos.']").forEach(function (el) {
    var v = window.datosUi && datosUi(el.getAttribute("data-t"));
    if (v) el.textContent = v;
  });
  leerUrl();
  shell();
  if (ESTADO.vista === "comparar") pintarComparar();
  else if (ESTADO.vista === "ficha" && ESTADO.href) abrir(ESTADO.href);
  else if (ESTADO.tipo === "cubos") cargarCubos();
  else if (ESTADO.q.trim().length >= 2) buscar();
  else estado(ui("datos.minimo"));
  pintarBandeja();
})();
