// Planificador de Daevanion (mismas reglas que reglas.limpiar_daevanion: cada nodo debe enlazar en cruz con el inicio)
var _estadisticas = null;
function cargarEstadisticas() {
  if (_estadisticas) return Promise.resolve(_estadisticas);
  return fetch("data/estadisticas.json").then(function (r) { return r.json(); }).then(function (s) { return (_estadisticas = s); });
}
function valorStat(s, v) {
  var e = _estadisticas && _estadisticas[s];
  var txt = e && e.pct ? numFmt(v / 100) + "%" : numFmt(v);
  return { nombre: e ? tr(e) : s, valor: (v >= 0 ? "+" : "") + txt };
}
var GRADOS = { 0: "inicio", 11: "comun", 21: "raro", 31: "leyenda", 41: "unico" };
var PUNTOS_DAEV = { daevanion_crystal: "cristal", battle_crystal: "batalla" };

function Daevanion(op) {
  var B = op.B, CAT = op.CAT, editando = op.editando, actual = 0, tablero = 0, raiz = null, D = null;
  var porId = {}, porPos = {};
  B.datos.daevanion = B.datos.daevanion || { presets: [] };
  function presets() { return B.datos.daevanion.presets; }
  function P() { return presets()[actual]; }
  function cambio() { if (op.alCambiar) op.alCambiar(); }
  function tomados() { var s = {}; (P() ? P().nodos : []).forEach(function (n) { s[n] = true; }); return s; }

  function cargar() {
    return Promise.all([
      fetch("data/daevanion/" + B.clase + ".json").then(function (r) { if (!r.ok) throw new Error("no_existe"); return r.json(); }),
      cargarEstadisticas()
    ]).then(function (r) {
      D = r[0];
      D.tableros.forEach(function (t, ti) {
        t.total = 0;
        t.f0 = Math.min.apply(null, t.nodos.map(function (n) { return Math.min(n.f, n.c); }));
        t.k = Math.max.apply(null, t.nodos.map(function (n) { return Math.max(n.f, n.c); })) - t.f0 + 1;
        t.nodos.forEach(function (n) {
          n.t = ti; porId[n.id] = n; porPos[ti + ":" + n.f + ":" + n.c] = n;
          if (n.tipo === "start") t.inicio = n; else t.total += n.coste;
        });
      });
    });
  }

  // nodos que siguen enlazados con el inicio de su tablero
  function conectados(set) {
    var vistos = {}, cola = D.tableros.map(function (t) { return t.inicio; });
    while (cola.length) {
      var n = cola.pop();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var v = porPos[n.t + ":" + (n.f + d[0]) + ":" + (n.c + d[1])];
        if (v && set[v.id] && !vistos[v.id]) { vistos[v.id] = true; cola.push(v); }
      });
    }
    return vistos;
  }
  function vecinos(n) {
    return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(function (d) { return porPos[n.t + ":" + (n.f + d[0]) + ":" + (n.c + d[1])]; }).filter(Boolean);
  }
  function activo(n, set) { return n.tipo === "start" || set[n.id]; }

  // ---------- textos ----------
  function efectoTxt(e) {
    if (e.h) { var h = CAT.porId[e.h]; return (h ? tr(h.nombre) : "#" + e.h) + " +" + e.n + " " + t("dae.niveles"); }
    var v = valorStat(e.s, e.v);
    return v.nombre + " " + v.valor;
  }
  function tip(n) {
    if (n.tipo === "start") return "<div class='tt-nombre'>" + esc(t("dae.inicio")) + "</div>";
    return "<div class='tt-nombre'>" + esc(tr(n.nombre)) + "</div><div class='tt-sub'>" + esc(t("dae.g_" + GRADOS[n.g])) + " · " + esc(t("dae.coste")) + " " + n.coste +
      "</div><div class='tt-desc'>" + n.ef.map(function (e) { return esc(efectoTxt(e)); }).join("<br>") + "</div>";
  }

  function gastado(set, ti) {
    return D.tableros[ti].nodos.reduce(function (s, n) { return s + (set[n.id] && n.tipo !== "start" ? n.coste : 0); }, 0);
  }

  // ---------- tablero ----------
  function nodoHTML(n, set, f0) {
    var on = activo(n, set), libre = !on && vecinos(n).some(function (v) { return activo(v, set); });
    var h = n.ef[0] && n.ef[0].h ? CAT.porId[n.ef[0].h] : null;
    var abrev = "";
    if (!h && n.tipo === "stat" && n.ef[0]) abrev = '<i class="v">' + esc(valorStat(n.ef[0].s, n.ef[0].v).valor.replace("+", "")) + "</i>";
    return '<button class="nodo-d g' + n.g + (on ? " on" : libre ? " libre" : " bloq") + (n.tipo === "start" ? " inicio" : "") + '" data-nodo="' + n.id +
      '" style="grid-row:' + ((n.f - f0) * 2 + 1) + ";grid-column:" + ((n.c - f0) * 2 + 1) + '" data-tip="' + esc(tip(n)) + '"' + (editando && n.tipo !== "start" ? "" : ' tabindex="-1"') + ">" +
      '<img class="marco" src="icons/daevanion/' + n.icono + '.webp" alt="">' +
      (h && h.icono ? '<img class="ico-nodo" src="icons/habilidades/' + h.icono + '.webp" alt="">' : "") + abrev + "</button>";
  }
  function enlaces(t, ti, set) {
    var h = "";
    t.nodos.forEach(function (n) {
      [[0, 1], [1, 0]].forEach(function (d) {
        var v = porPos[ti + ":" + (n.f + d[0]) + ":" + (n.c + d[1])];
        if (!v) return;
        var on = activo(n, set) && activo(v, set);
        h += '<span class="enlace-d ' + (d[0] ? "vert" : "hori") + (on ? " on" : "") + '" style="grid-row:' + ((n.f - t.f0) * 2 + 1 + d[0]) + ";grid-column:" + ((n.c - t.f0) * 2 + 1 + d[1]) + '"></span>';
      });
    });
    return h;
  }
  function tableroHTML(set) {
    var tb = D.tableros[tablero];
    return '<div class="tablero-d" style="--k:' + tb.k + ';--k1:' + (tb.k - 1) + '">' + enlaces(tb, tablero, set) + tb.nodos.map(function (n) { return nodoHTML(n, set, tb.f0); }).join("") + "</div>";
  }
  function pestanasTablero(set) {
    return '<nav class="tableros-d">' + D.tableros.map(function (tb, i) {
      var g = gastado(set, i);
      return '<button data-tablero="' + i + '" class="' + (i === tablero ? "on" : "") + (tb.punto === "battle_crystal" ? " batalla" : "") + '"><b>' + esc(tr(tb.nombre)) + "</b>" +
        "<small>" + esc(t("dae.nivel")) + " " + tb.nivel + " · " + g + "/" + tb.total + "</small><i style=\"width:" + Math.round(100 * g / tb.total) + '%"></i></button>';
    }).join("") + "</nav>";
  }

  // ---------- resumen ----------
  function resumen(set) {
    var puntos = {}, maximos = {}, stats = {}, habs = {};
    D.tableros.forEach(function (tb, i) {
      puntos[tb.punto] = (puntos[tb.punto] || 0) + gastado(set, i);
      maximos[tb.punto] = (maximos[tb.punto] || 0) + tb.total;
    });
    Object.keys(set).forEach(function (id) {
      var n = porId[id];
      if (!n) return;
      n.ef.forEach(function (e) {
        if (e.h) habs[e.h] = (habs[e.h] || 0) + e.n;
        else stats[e.s] = (stats[e.s] || 0) + e.v;
      });
    });
    var h = '<div class="panel resumen-dae"><h3>' + esc(t("dae.puntos")) + "</h3>" + Object.keys(maximos).map(function (k) {
      return '<div class="barra-puntos ' + PUNTOS_DAEV[k] + '"><span>' + esc(t("dae.p_" + PUNTOS_DAEV[k])) + "</span><b>" + (puntos[k] || 0) + " / " + maximos[k] + "</b>" +
        '<i style="width:' + Math.round(100 * (puntos[k] || 0) / maximos[k]) + '%"></i></div>';
    }).join("");
    var ls = Object.keys(stats).sort(function (a, b) {
      var x = _estadisticas[a] || {}, y = _estadisticas[b] || {};
      return (x.orden || 999) - (y.orden || 999);
    });
    h += "<h3>" + esc(t("dae.estadisticas")) + "</h3>" + (ls.length ? '<div class="lista-stats">' + ls.map(function (s) {
      var v = valorStat(s, stats[s]);
      return '<div class="fila"><span>' + esc(v.nombre) + "</span><b>" + esc(v.valor) + "</b></div>";
    }).join("") + "</div>" : '<p class="suave">' + esc(t("dae.nada")) + "</p>");
    var lh = Object.keys(habs).sort(function (a, b) { return habs[b] - habs[a]; });
    if (lh.length) {
      h += "<h3>" + esc(t("dae.habilidades")) + '</h3><div class="lista-habs-dae">' + lh.map(function (id) {
        var x = CAT.porId[id];
        return '<div class="fila">' + (x ? iconoHab(x) : "") + "<span>" + esc(x ? tr(x.nombre) : id) + "</span><b>+" + habs[id] + "</b></div>";
      }).join("") + "</div>";
    }
    return h + "</div>";
  }

  // ---------- página ----------
  function pestanasPresets() {
    var l = presets();
    if (!l.length && !editando) return "";
    return '<div class="presets">' + l.map(function (p, i) {
      return '<button class="preset' + (i === actual ? " on" : "") + '" data-preset="' + i + '">' + esc(p.nombre) + " <small>" + p.nodos.length + "</small></button>";
    }).join("") + (editando && l.length < MAX_PRESETS ? '<button class="preset nuevo" data-accion="nuevo-preset">+ ' + esc(t("barra.nuevo_preset")) + "</button>" : "") +
      (editando ? '<button class="boton chico plantilla" data-accion="plantilla">' + esc(t("dae.plantilla")) + "</button>" : "") + "</div>";
  }
  function html() {
    if (!D) return '<div class="vacio-lista">' + esc(t("comun.cargando")) + "</div>";
    var p = P(), set = tomados();
    var h = pestanasPresets();
    if (!p && !editando) return h + '<div class="vacio-lista">' + esc(t("dae.sin_presets")) + "</div>";
    if (!p) return h + '<div class="vacio-lista">' + esc(t("dae.empieza")) + "</div>";
    var tb = D.tableros[tablero];
    h += '<div class="planificador-dae' + (editando ? " editando-dae" : "") + '"><div class="zona-tablero">' + pestanasTablero(set);
    if (editando) {
      h += '<div class="herramientas-dae"><input data-dae="nombre" maxlength="40" value="' + esc(p.nombre) + '" aria-label="' + esc(t("barra.nombre_preset")) + '">' +
        '<button class="boton chico" data-accion="llenar">' + esc(t("dae.llenar")) + '</button><button class="boton chico" data-accion="vaciar">' + esc(t("dae.vaciar")) + "</button>" +
        '<button class="boton chico peligro" data-accion="quitar-preset">' + esc(t("barra.quitar_preset")) + "</button></div>";
    }
    h += '<div class="marco-tablero ' + (tb.punto === "battle_crystal" ? "batalla" : "") + '"><div class="titulo-tablero"><b>' + esc(tr(tb.nombre)) + "</b><span>" +
      esc(t("dae.p_" + PUNTOS_DAEV[tb.punto])) + " · " + esc(t("dae.desde_nivel")) + " " + tb.nivel + "</span></div>" + tableroHTML(set) + "</div>" +
      '<p class="nota-barra">' + esc(t(editando ? "dae.ayuda_editar" : "dae.ayuda_ver")) + "</p></div>" +
      '<aside class="lateral">' + resumen(set) + "</aside></div>";
    return h;
  }
  function repintar() { if (raiz) raiz.innerHTML = html(); }

  // ---------- acciones ----------
  function alternar(n) {
    var p = P(), set = tomados();
    if (n.tipo === "start") return;
    if (set[n.id]) delete set[n.id];
    else if (vecinos(n).some(function (v) { return activo(v, set); })) set[n.id] = true;
    else return aviso(t("dae.no_enlaza"), "mal");
    var ok = conectados(set);
    p.nodos = Object.keys(ok);
    cambio(); repintar();
  }
  function llenar(todo) {
    var p = P(), set = tomados();
    D.tableros[tablero].nodos.forEach(function (n) {
      if (n.tipo === "start") return;
      if (todo) set[n.id] = true; else delete set[n.id];
    });
    p.nodos = Object.keys(conectados(set));
    cambio(); repintar();
  }
  function cargarPlantilla() {
    api("GET", "/api/builds?clase=" + B.clase).then(function (l) {
      var ref = l.filter(function (b) { return b.fuente; })[0];
      if (!ref) throw new Error("no_existe");
      return api("GET", "/api/builds/" + ref.id);
    }).then(function (r) {
      var ps = ((r.datos.daevanion || {}).presets || []);
      if (!ps.length) throw new Error("no_existe");
      if (presets().some(function (p) { return p.nodos.length; }) && !confirm(t("dae.plantilla_conf"))) return;
      B.datos.daevanion.presets = JSON.parse(JSON.stringify(ps)).slice(0, MAX_PRESETS);
      actual = 0;
      cambio(); repintar(); aviso(t("barra.plantilla_ok"), "ok");
    }).catch(function (e) { aviso(textoError(e), "mal"); });
  }

  function enlazar(el) {
    raiz = el;
    raiz.addEventListener("click", function (e) {
      var pr = e.target.closest("[data-preset]");
      if (pr) { actual = +pr.dataset.preset; repintar(); return; }
      var tb = e.target.closest("[data-tablero]");
      if (tb) { tablero = +tb.dataset.tablero; repintar(); return; }
      var nd = e.target.closest("[data-nodo]");
      if (nd && editando) { alternar(porId[nd.dataset.nodo]); return; }
      var a = e.target.closest("[data-accion]");
      if (!a || !editando) return;
      switch (a.dataset.accion) {
        case "nuevo-preset":
          presets().push({ nombre: t("barra.preset") + " " + (presets().length + 1), nodos: [] });
          actual = presets().length - 1; break;
        case "quitar-preset":
          if (!confirm(t("barra.quitar_preset_conf"))) return;
          presets().splice(actual, 1); actual = Math.max(0, actual - 1); break;
        case "plantilla": cargarPlantilla(); return;
        case "llenar": llenar(true); return;
        case "vaciar": llenar(false); return;
        default: return;
      }
      cambio(); repintar();
    });
    raiz.addEventListener("input", function (e) {
      if (e.target.dataset.dae === "nombre" && P()) {
        P().nombre = e.target.value;
        var b = raiz.querySelector('[data-preset="' + actual + '"]');
        if (b) b.firstChild.textContent = e.target.value + " ";
        cambio();
      }
    });
  }

  function datos() { return presets().map(function (p) { return { nombre: p.nombre, nodos: p.nodos }; }); }

  return { cargar: cargar, html: html, enlazar: enlazar, datos: function () { return { presets: datos() }; }, repintar: repintar };
}
