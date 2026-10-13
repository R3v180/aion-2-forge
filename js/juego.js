// Vínculo con el personaje real y comparación con las builds guardadas.
var Juego = (function () {
  var CTX, tableros = {};
  var RANURAS = ["MainHand", "SubHand", "Helmet", "Shoulder", "Torso", "Pants", "Gloves", "Boots", "Cape", "Belt",
    "Necklace", "Earring1", "Earring2", "Ring1", "Ring2", "Bracelet1", "Bracelet2", "Rune1", "Rune2", "Amulet"];
  var RANURA = {
    MainHand: { es: "Arma", en: "Weapon" }, SubHand: { es: "Auxiliar", en: "Off-hand" }, Helmet: { es: "Yelmo", en: "Helm" },
    Shoulder: { es: "Hombreras", en: "Pauldrons" }, Torso: { es: "Pecho", en: "Chest" }, Pants: { es: "Piernas", en: "Legs" },
    Gloves: { es: "Guantes", en: "Gloves" }, Boots: { es: "Botas", en: "Boots" }, Cape: { es: "Capa", en: "Cloak" },
    Belt: { es: "Cinturón", en: "Belt" }, Necklace: { es: "Collar", en: "Necklace" }, Earring1: { es: "Pendiente", en: "Earring" },
    Earring2: { es: "Pendiente", en: "Earring" }, Ring1: { es: "Anillo", en: "Ring" }, Ring2: { es: "Anillo", en: "Ring" },
    Bracelet1: { es: "Brazalete", en: "Bracelet" }, Bracelet2: { es: "Brazalete", en: "Bracelet" }, Rune1: { es: "Runa", en: "Rune" },
    Rune2: { es: "Runa", en: "Rune" }, Amulet: { es: "Amuleto", en: "Amulet" }
  };
  var PESO = { weaponfixingdamage: 5, critical: 5, amplifyalldamage: 4, pveamplifydamage: 4, pvpamplifydamage: 3, armordefense: 3, hpmax: 2, hphealrate: 3 };

  function re(txt, mapa) {
    return String(txt).replace(/\{(\w+)\}/g, function (_, k) { return mapa[k] == null ? "" : mapa[k]; });
  }
  function poder(n) {
    n = Number(n) || 0;
    if (n >= 1000) return (Math.round(n / 100) / 10) + "K";
    return String(n);
  }
  function urlOk(u) {
    return /^https:\/\/(profileimg\.plaync\.com|assets\.playnccdn\.com)\//.test(u || "");
  }
  function nombrePieza(p) {
    var es = String(p.nombre_es || "").trim(), en = String(p.nombre || "").trim();
    return (IDIOMA === "es" && es) ? es : (en || es);
  }
  function gradoClase(g) {
    return window.EQ && EQ.claveGrado ? EQ.claveGrado(g) : (g || "");
  }
  function titulo(f) { return (IDIOMA === "es" && f.titulo_es) || f.titulo; }
  function ranura(id) {
    var x = RANURA[id];
    return x ? (x[IDIOMA] || x.es) : id;
  }
  function ocupado(btn, texto) {
    if (!btn) return;
    btn.disabled = true;
    btn.dataset.prev = btn.textContent;
    btn.textContent = texto;
  }
  function libre(btn) {
    if (!btn) return;
    btn.disabled = false;
    if (btn.dataset.prev) btn.textContent = btn.dataset.prev;
  }

  function pintar() {
    var hueco = $("#hueco-juego");
    if (!hueco) return;
    var B = CTX.B, p = B.personaje;
    var duena = B.propia || (B.juego && p && p.propio);
    if (!duena && !p) { hueco.innerHTML = ""; return; }
    if (!p) {
      hueco.innerHTML = '<section class="vinculo preguntar"><img class="arte" src="icons/clases/' + B.clase + '-arte.webp" alt="">' +
        '<div><span class="antetitulo">' + esc(t("juego.en_juego")) + "</span><h2>" + esc(t("juego.pregunta")) + "</h2><p>" +
        esc(t("juego.pregunta_txt")) + '</p><button class="boton oro" id="pj-abrir">' + esc(t("juego.buscar")) + "</button>" +
        (B.propia ? '<button class="boton" id="pj-comparar">' + esc(t("juego.comparar")) + "</button>" : "") + "</div></section>";
      return;
    }
    var f = p.ficha || {};
    var foto = urlOk(f.imagen) ? '<img class="retrato-pj" src="' + esc(f.imagen) + '" alt="">' : "";
    var ver = p ? '<a class="boton" href="build.html?pj=' + p.id + '">' + esc(t("juego.ver")) + "</a>" : "";
    var comparar = '<button class="boton oro" id="pj-comparar">' + esc(t("juego.comparar")) + "</button>";
    var botones;
    if (B.juego) {
      botones = comparar + (duena
        ? '<button class="boton" id="pj-refrescar">' + esc(t("juego.refrescar")) + "</button>" +
          '<button class="boton" id="pj-nueva">' + esc(t("juego.nueva")) + "</button>"
        : "");
    } else if (B.propia) {
      botones = comparar + ver +
        '<button class="boton" id="pj-refrescar">' + esc(t("juego.refrescar")) + "</button>" +
        '<button class="boton" id="pj-nueva">' + esc(t("juego.nueva")) + "</button>" +
        (p ? '<button class="enlace" id="pj-desvincular">' + esc(t("juego.desvincular")) + "</button>" : "");
    } else {
      botones = comparar + ver;
    }
    var publica = duena
      ? '<label class="interruptor vinculo-publica"><input type="checkbox" id="pj-publico"' + (p.publica_equipo ? " checked" : "") +
        "><span class=\"pista\"></span>" + esc(t("juego.mostrar")) + "</label>"
      : "";
    var equipo = B.juego ? equipoHTML(f) : "";
    hueco.innerHTML = '<section class="vinculo' + (B.juego ? " en-juego" : "") + '">' + foto +
      '<div class="txt"><span class="antetitulo">' + esc(t("juego.en_juego")) + " · " + esc(p.servidor) + "</span><h2>" + esc(p.nombre) + "</h2>" +
      "<p>" + esc(tr(claseInfo(p.clase))) + " · " + esc(t("juego.nv")) + " " + (p.nivel || "—") + " · " + esc(t("juego.poder")) + " <b>" + poder(p.poder) + "</b>" +
      (f.gremio ? " · " + esc(f.gremio) : "") + (titulo(f) ? " · " + esc(titulo(f)) : "") + "</p>" +
      '<small class="suave">' + esc(t("juego.leido")) + " " + (p.leido ? new Date(p.leido).toLocaleString(IDIOMA === "es" ? "es-ES" : "en-GB") : "") + "</small>" +
      '<div class="botones">' + botones + "</div>" + publica + "</div></section>" +
      (equipo ? '<section class="panel equipo-juego">' + equipo + "</section>" : "");
  }

  function abrirBusqueda() {
    var velo = document.createElement("div");
    velo.className = "velo";
    velo.id = "velo-juego";
    velo.innerHTML = '<div class="panel buscar-caja"><h3>' + esc(t("juego.buscar")) + "</h3>" +
      '<form id="pj-form"><input id="pj-q" maxlength="24" required placeholder="' + esc(t("juego.nombre")) + '">' +
      '<button class="boton oro" type="submit">' + esc(t("juego.buscar")) + "</button></form>" +
      '<div id="pj-resultados"></div><p class="suave" id="pj-estado"></p>' +
      '<button class="enlace" id="pj-cerrar" type="button">' + esc(t("juego.cerrar")) + "</button></div>";
    document.body.appendChild(velo);
    $("#pj-q").focus();
  }

  function elegir(cid, server, boton) {
    ocupado(boton, t("juego.leyendo"));
    var estado = $("#pj-estado");
    if (estado) estado.textContent = t("juego.leyendo");
    api("POST", "/api/juego/vincular", { build_id: CTX.B.id, character_id: cid, server_id: server, accion: "vincular", modo: CTX.B.modo })
      .then(function () { location.reload(); })
      .catch(function (e) {
        libre(boton);
        if (e.message === "clase_distinta" && e.datos && confirm(re(t("juego.clase_distinta"), {
          nombre: e.datos.nombre, servidor: e.datos.servidor, clase: tr(claseInfo(e.datos.clase))
        }))) {
          if (estado) estado.textContent = t("juego.leyendo");
          api("POST", "/api/juego/vincular", {
            character_id: cid, server_id: server, accion: "crear", modo: CTX.B.modo, nombre: e.datos.nombre
          }).then(function (r) { location.href = "build.html?id=" + r.id + "&editar=1"; })
            .catch(function (er) { if (estado) estado.textContent = textoError(er); });
          return;
        }
        if (estado) estado.textContent = textoError(e);
      });
  }

  function tablero(clase) {
    if (tableros[clase]) return Promise.resolve(tableros[clase]);
    return fetch("data/daevanion/" + clase + ".json").then(function (r) {
      if (!r.ok) return { tableros: [] };
      return r.json();
    }).then(function (d) { return (tableros[clase] = d); });
  }

  function statsNodos(data, ids) {
    var set = {}, stats = {};
    (ids || []).forEach(function (id) { set[String(id)] = 1; });
    (data.tableros || []).forEach(function (tb) {
      (tb.nodos || []).forEach(function (n) {
        if (!set[String(n.id)]) return;
        (n.ef || []).forEach(function (ef) {
          if (ef.s) stats[ef.s] = (stats[ef.s] || 0) + (ef.v || 0);
        });
      });
    });
    return stats;
  }

  function frase(frases, a, b, ambos, soloA, soloB, mapa) {
    if (a && b) frases.push(re(t(ambos), mapa));
    else if (a) frases.push(re(t(soloA), mapa));
    else if (b) frases.push(re(t(soloB), mapa));
  }
  function fmt(st, id, v) {
    var e = st[id];
    if (!e) return String(v);
    if (e.pct) {
      var n = Math.round(v) / 100;
      return (n > 0 ? "+" : "") + n + "%";
    }
    return (v > 0 ? "+" : "") + v;
  }
  function nombreStat(st, id) {
    var e = st[id];
    return e ? (e[IDIOMA] || e.es) : id;
  }

  function sumarPiezas(piezas) {
    if (window.EQ && EQ.sumar) return EQ.sumar(piezas);
    var tot = {};
    (piezas || []).forEach(function (c) {
      Object.keys(c.stats || {}).forEach(function (s) { tot[s] = (tot[s] || 0) + c.stats[s]; });
    });
    return tot;
  }
  function unirStats(a, b) {
    var o = {};
    Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function (k) { o[k] = (a && a[k] || 0) + (b && b[k] || 0); });
    return o;
  }
  function bonusNodos(tab, nodos) {
    var set = {}, b = {};
    (nodos || []).forEach(function (id) { set[String(id)] = 1; });
    (tab.tableros || []).forEach(function (tb) {
      (tb.nodos || []).forEach(function (n) {
        if (!set[String(n.id)]) return;
        (n.ef || []).forEach(function (ef) { if (ef.h) b[ef.h] = (b[ef.h] || 0) + (ef.n || 0); });
      });
    });
    return b;
  }
  function ladoBuild(build, tab) {
    var datos = build.datos || {};
    var preset = ((datos.daevanion || {}).presets || [])[0] || { nombre: "", nodos: [] };
    if (CTX.B && String(build.id) === String(CTX.B.id) && CTX.daevanion) {
      var d = CTX.daevanion();
      preset = (d.presets || [])[0] || preset;
    }
    var nodos = preset.nodos || [], equipo = datos.equipo || [], eq = sumarPiezas(equipo), sn = statsNodos(tab, nodos);
    return { tipo: "build", nombre: build.nombre, clase: build.clase, habilidades: datos.habilidades || {},
      bonus: bonusNodos(tab, nodos), nodos: nodos, equipo: equipo, stats_eq: eq, stats_nodos: sn, stats: unirStats(eq, sn),
      preset: preset.nombre || "" };
  }
  function ladoPj(p, tab) {
    var f = p.ficha || {}, eq = f.stats_equipo && Object.keys(f.stats_equipo).length ? f.stats_equipo : sumarPiezas(f.equipo);
    var sn = f.stats_nodos && Object.keys(f.stats_nodos).length ? f.stats_nodos : statsNodos(tab, f.nodos || []);
    return { tipo: "pj", nombre: p.nombre + (p.servidor ? " · " + p.servidor : ""), clase: p.clase,
      habilidades: f.habilidades || {}, bonus: f.bonus || bonusNodos(tab, f.nodos || []), nodos: f.nodos || [],
      equipo: f.equipo || [], stats_eq: eq, stats_nodos: sn, stats: unirStats(eq, sn), preset: "" };
  }
  function nvLado(lado, h) {
    var extra = (lado.bonus || {})[h.id] || 0;
    if (lado.tipo === "pj") {
      var j = (lado.habilidades || {})[h.id] || {};
      var total = j.aprendida ? (j.nivel || 0) : 0;
      var base = Math.max(0, total - extra);
      var puesta = h.tipo === "estigma" ? !!(j.aprendida && j.equipada) : !!j.aprendida;
      return { base: base, extra: puesta ? extra : 0, total: puesta ? total : 0, puesta: puesta };
    }
    var mia = ((lado.habilidades || {})[h.id] || {}).nivel || 0;
    return { base: mia, extra: mia ? extra : 0, total: mia ? mia + extra : 0, puesta: mia > 0 };
  }
  function filasStats(a, b, st, cual) {
    var sa = cual ? a[cual] || {} : a.stats, sb = cual ? b[cual] || {} : b.stats, claves = {};
    Object.keys(sa).concat(Object.keys(sb)).forEach(function (k) { if ((sa[k] || 0) !== (sb[k] || 0)) claves[k] = 1; });
    return Object.keys(claves).map(function (k) {
      return { id: k, a: sa[k] || 0, b: sb[k] || 0, d: (sb[k] || 0) - (sa[k] || 0) };
    }).sort(function (x, y) { return Math.abs(y.d) * (PESO[y.id] || 1) - Math.abs(x.d) * (PESO[x.id] || 1); });
  }
  function piezaSlot(eq, slot) {
    return (eq || []).filter(function (p) { return p.slot === slot; })[0];
  }
  function abrirComparar() {
    var velo = document.createElement("div");
    velo.className = "velo";
    velo.id = "velo-comparar";
    var p = CTX.B.personaje, hermanas = CTX.B.hermanas || [];
    var izq0, der0;
    if (CTX.B.juego) {
      izq0 = "pj";
      der0 = hermanas[0] ? "b:" + hermanas[0].id : "otro";
    } else if (p) {
      izq0 = "pj";
      der0 = "build";
    } else {
      izq0 = "build";
      der0 = "otro";
    }
    velo.innerHTML = '<div class="comparar pro"><header><div><span class="antetitulo">' + esc(t("juego.comparar")) +
      "</span><h2>" + esc(CTX.B.nombre) + '</h2></div><button class="boton" id="pj-cerrar-comparar" type="button">' +
      esc(t("juego.cerrar")) + "</button></header>" +
      '<div class="cmp-lados"><label>' + esc(t("juego.esta")) +
      ' <select id="cmp-a"></select></label>' +
      '<button type="button" class="boton chico" id="cmp-swap" title="' + esc(t("juego.cambiar_lados")) + '">⇄</button>' +
      '<label>' + esc(t("juego.vs")) + ' <select id="cmp-b"></select></label></div>' +
      '<div id="cmp-buscar" class="cmp-buscar" hidden><form id="pj-cmp-form"><input id="pj-cmp-q" maxlength="24" required placeholder="' +
      esc(t("juego.nombre")) + '"><button class="boton oro" type="submit">' + esc(t("juego.buscar")) +
      "</button></form><div id=\"pj-cmp-res\"></div><p class=\"suave\" id=\"pj-cmp-estado\"></p></div>" +
      '<div id="pj-cuerpo"><p class="suave">' + esc(t("juego.elige_lado")) + "</p></div></div>";
    document.body.appendChild(velo);
    var cache = { build: { id: CTX.B.id, nombre: CTX.B.nombre, clase: CTX.B.clase, datos: CTX.B.datos },
      pj: p ? { nombre: p.nombre, servidor: p.servidor, clase: p.clase, ficha: p.ficha, nivel: p.nivel, poder: p.poder } : null };
    var sel = { a: izq0, b: der0 }, tab, st, misPj = [];
    function opciones() {
      var html = CTX.B.juego ? "" : '<option value="build">' + esc(t("juego.lado_build")) + " · " + esc(CTX.B.nombre) + "</option>";
      if (cache.pj) html += '<option value="pj">' + esc(t("juego.lado_juego")) + " · " + esc(cache.pj.nombre) + "</option>";
      hermanas.forEach(function (h) { html += '<option value="b:' + h.id + '">' + esc(t("juego.esta")) + " · " + esc(h.nombre) + "</option>"; });
      misPj.forEach(function (x) {
        if (cache.pj && x.nombre === cache.pj.nombre) return;
        html += '<option value="p:' + x.id + '">' + esc(x.nombre) + (x.servidor ? " · " + esc(x.servidor) : "") + "</option>";
      });
      html += '<option value="otro">' + esc(t("juego.lado_otro")) + "</option>";
      Object.keys(cache).forEach(function (k) {
        if (k.indexOf("o:") !== 0) return;
        var x = cache[k];
        html += '<option value="' + k + '">' + esc(x.nombre) + (x.servidor ? " · " + esc(x.servidor) : "") + "</option>";
      });
      return html;
    }
    function llenar() {
      ["cmp-a", "cmp-b"].forEach(function (id) {
        var s = $("#" + id); s.innerHTML = opciones(); s.value = id === "cmp-a" ? sel.a : sel.b;
      });
    }
    function resolver(clave) {
      if (clave === "build") return Promise.resolve(ladoBuild(cache.build, tab));
      if (clave === "pj" && cache.pj) return Promise.resolve(ladoPj(cache.pj, tab));
      if (clave.indexOf("b:") === 0) {
        var id = clave.slice(2);
        if (cache["b:" + id]) return Promise.resolve(ladoBuild(cache["b:" + id], tab));
        return api("GET", "/api/builds/" + id).then(function (b) { cache["b:" + id] = b; return ladoBuild(b, tab); });
      }
      if (clave.indexOf("p:") === 0) {
        var pid = clave.slice(2), x = misPj.filter(function (m) { return String(m.id) === pid; })[0];
        return Promise.resolve(x ? ladoPj(x, tab) : null);
      }
      if (clave.indexOf("o:") === 0 && cache[clave]) return Promise.resolve(ladoPj(cache[clave], tab));
      return Promise.resolve(null);
    }
    function refrescar() {
      $("#cmp-buscar").hidden = sel.a !== "otro" && sel.b !== "otro";
      Promise.all([resolver(sel.a), resolver(sel.b)]).then(function (l) {
        if (!l[0] || !l[1]) { $("#pj-cuerpo").innerHTML = '<p class="suave">' + esc(t("juego.elige_lado")) + "</p>"; return; }
        pintarComparacion(l[0], l[1], st, tab);
      }).catch(function (e) { $("#pj-cuerpo").innerHTML = "<p>" + esc(textoError(e)) + "</p>"; });
    }
    Promise.all([tablero(CTX.B.clase), cargarEstadisticas(),
      api("GET", "/api/mis-personajes").catch(function () { return []; })]).then(function (res) {
      tab = res[0]; st = res[1]; misPj = res[2] || [];
      llenar();
      refrescar();
    }).catch(function (e) { $("#pj-cuerpo").innerHTML = "<p>" + esc(textoError(e)) + "</p>"; });
    velo.addEventListener("change", function (e) {
      if (e.target.id === "cmp-a") sel.a = e.target.value;
      if (e.target.id === "cmp-b") sel.b = e.target.value;
      if (e.target.id === "cmp-a" || e.target.id === "cmp-b") refrescar();
    });
    $("#cmp-swap").addEventListener("click", function () { var x = sel.a; sel.a = sel.b; sel.b = x; llenar(); refrescar(); });
    velo._cmp = { sel: sel, cache: cache, llenar: llenar, refrescar: refrescar, tab: function () { return tab; } };
  }

  function seccion(titulo, nSube, nBaja, cuerpo, abierta) {
    if (!cuerpo) return "";
    return '<details class="cmp-sec"' + (abierta === false ? "" : " open") + "><summary>" + esc(titulo) +
      (nSube ? ' <b class="sube">+' + nSube + "</b>" : "") + (nBaja ? ' <b class="baja">−' + nBaja + "</b>" : "") +
      "</summary>" + cuerpo + "</details>";
  }
  function listaCorta(filas, pintarFila, tope) {
    tope = tope || 12;
    if (filas.length <= tope) return filas.map(pintarFila).join("");
    return filas.slice(0, tope).map(pintarFila).join("") +
      '<details class="cmp-mas"><summary>' + esc(re(t("juego.cmp_mas"), { n: filas.length - tope })) + "</summary>" +
      filas.slice(tope).map(pintarFila).join("") + "</details>";
  }
  function pintarComparacion(A, B, st) {
    var mag = function (x) { return fmt(st, x.id, Math.abs(x.d)).replace(/^\+/, ""); };
    var stats = filasStats(A, B, st);
    var eqStats = filasStats(A, B, st, "stats_eq");
    var daeStats = filasStats(A, B, st, "stats_nodos");
    var habs = [], masHab = 0, menosHab = 0;
    (CTX.CAT.habilidades || []).forEach(function (h) {
      var a = nvLado(A, h), b = nvLado(B, h);
      if (!a.puesta && !b.puesta) return;
      if (a.total === b.total && a.puesta === b.puesta) return;
      if (b.total > a.total || (b.puesta && !a.puesta)) masHab++;
      else menosHab++;
      habs.push({ h: h, a: a, b: b });
    });
    var setA = {}, setB = {};
    A.nodos.forEach(function (id) { setA[String(id)] = 1; });
    B.nodos.forEach(function (id) { setB[String(id)] = 1; });
    var soloB = B.nodos.filter(function (id) { return !setA[String(id)]; }).length;
    var soloA = A.nodos.filter(function (id) { return !setB[String(id)]; }).length;
    var slots = [], nEq = 0;
    RANURAS.forEach(function (slot) {
      var pa = piezaSlot(A.equipo, slot), pb = piezaSlot(B.equipo, slot);
      if (!pa && !pb) return;
      var misma = pa && pb && pa.id && pb.id && String(pa.id) === String(pb.id) &&
        (pa.encantamiento || 0) === (pb.encantamiento || 0) && (pa.superado || 0) === (pb.superado || 0);
      var dif = {};
      Object.keys((pa && pa.stats) || {}).concat(Object.keys((pb && pb.stats) || {})).forEach(function (k) {
        var d = ((pb && pb.stats && pb.stats[k]) || 0) - ((pa && pa.stats && pa.stats[k]) || 0);
        if (d) dif[k] = d;
      });
      if (!misma || Object.keys(dif).length) nEq++;
      slots.push({ slot: slot, a: pa, b: pb, misma: misma, dif: dif });
    });
    var gana = stats.filter(function (x) { return x.d > 0; }).slice(0, 3);
    var pierde = stats.filter(function (x) { return x.d < 0; }).slice(0, 3);
    var frases = [re(t("juego.pasando"), { a: A.nombre, b: B.nombre })];
    var ganaTxt = gana.map(function (x) { return nombreStat(st, x.id) + " " + mag(x); }).join(", ");
    var pierdeTxt = pierde.map(function (x) { return nombreStat(st, x.id) + " " + mag(x); }).join(", ");
    frase(frases, ganaTxt, pierdeTxt, "juego.frase_cmp_stats", "juego.frase_cmp_stats_gana", "juego.frase_cmp_stats_pierde",
      { gana: ganaTxt, pierde: pierdeTxt });
    frase(frases, masHab, menosHab, "juego.frase_cmp_hab", "juego.frase_cmp_hab_mas", "juego.frase_cmp_hab_menos",
      { mas: masHab, menos: menosHab });
    if (nEq) frases.push(re(t("juego.frase_cmp_eq"), { n: nEq }));
    frase(frases, soloB, soloA, "juego.frase_nodos", "juego.frase_nodos_mas", "juego.frase_nodos_menos", { mas: soloB, menos: soloA });
    if (frases.length === 1) frases.push(t("juego.sin_dif"));
    function filaStat(x, extra) {
      return '<div class="stat-fila"><span>' + esc(nombreStat(st, x.id)) + (extra ? " <small>" + esc(extra) + "</small>" : "") +
        "</span><b class=\"" + (x.d > 0 ? "sube" : "baja") + "\">" + esc(fmt(st, x.id, x.d)) + "</b>" +
        "<small>" + esc(fmt(st, x.id, x.a)) + " → " + esc(fmt(st, x.id, x.b)) + "</small></div>";
    }
    function fichaPieza(p) {
      if (!p) return '<span class="suave">' + esc(t("juego.sin_pieza")) + "</span>";
      var nv = (p.encantamiento ? "+" + p.encantamiento : "") + (p.superado ? " ⟫" + p.superado : "");
      var ico = urlOk(p.icono) ? '<img src="' + esc(p.icono) + '" alt="">' : "";
      var tip = window.EQ ? ' data-tip="' + esc(EQ.tip(p)) + '"' : "";
      var g = gradoClase(p.grado);
      return '<div class="cmp-pieza g-' + esc(g) + '"' + tip + ">" + ico + "<span><b class=\"g-" +
        esc(g) + "\">" + esc(nombrePieza(p)) + "</b> " + nv + "<small>" +
        esc(window.EQ ? EQ.nombreGrado(g) : g) + "</small></span></div>";
    }
    var htmlEq;
    if (!A.equipo.length && !B.equipo.length) htmlEq = '<p class="suave">' + esc(t("juego.sin_equipo_lado")) + "</p>";
    else htmlEq = '<div class="cmp-eq">' + slots.map(function (s) {
      var deltas = Object.keys(s.dif).map(function (k) { return { id: k, d: s.dif[k] }; })
        .sort(function (x, y) { return Math.abs(y.d) - Math.abs(x.d); });
      return '<div class="cmp-eq-fila' + (s.misma ? " igual" : "") + '"><div class="cmp-eq-slot">' + esc(ranura(s.slot)) +
        "</div><div>" + fichaPieza(s.a) + "</div><div class=\"cmp-eq-difs\">" + (s.misma && !deltas.length
          ? '<small class="suave">' + esc(t("juego.eq_igual")) + "</small>"
          : deltas.map(function (x) {
            return '<span class="' + (x.d > 0 ? "sube" : "baja") + '">' + esc(nombreStat(st, x.id)) + " " +
              esc(fmt(st, x.id, x.d)) + "</span>";
          }).join("")) + "</div><div>" + fichaPieza(s.b) + "</div></div>";
    }).join("") + "</div>";
    var htmlHab = habs.length ? '<div class="lista-diff">' + listaCorta(habs, function (f) {
      var cls = f.b.total > f.a.total ? "sube" : "baja";
      function nv(x) {
        return x.puesta ? (x.total + (x.extra ? " <small>(+" + x.extra + ")</small>" : "")) : "—";
      }
      return '<div class="stat-fila"><span>' + esc(tr(f.h.nombre)) + (f.h.tipo === "estigma" ? " · " + esc(t("juego.estigmas")) : "") +
        "</span><b class=\"" + cls + "\">" + nv(f.a) + " → " + nv(f.b) + "</b></div>";
    }) + "</div>" : "";
    var htmlDae = '<p class="suave">' + esc(t("juego.en_juego")) + " " + A.nodos.length + " · " + esc(t("juego.esta")) + " " +
      B.nodos.length + (B.preset ? " · " + esc(t("juego.preset")) + " " + esc(B.preset) : "") +
      (A.preset ? " · " + esc(A.preset) : "") + "</p>" +
      (daeStats.length ? '<div class="stats-diff">' + listaCorta(daeStats, function (x) { return filaStat(x, t("juego.solo_stats_dae")); }) + "</div>" : "");
    var nSubeS = stats.filter(function (x) { return x.d > 0; }).length;
    var nBajaS = stats.filter(function (x) { return x.d < 0; }).length;
    $("#pj-cuerpo").innerHTML = '<div class="veredicto">' + frases.map(function (s) { return "<p>" + esc(s) + "</p>"; }).join("") +
      "<p class=\"suave\">" + esc(t("juego.aviso_dps")) + "</p></div>" +
      seccion(t("juego.cmp_stats"), nSubeS, nBajaS, stats.length
        ? '<div class="stats-diff">' + listaCorta(stats, function (x) { return filaStat(x); }) + "</div>" +
          (eqStats.length ? "<h4>" + esc(t("juego.solo_stats_eq")) + "</h4><div class=\"stats-diff\">" +
            listaCorta(eqStats, function (x) { return filaStat(x); }, 8) + "</div>" : "")
        : '<p class="suave">' + esc(t("juego.sin_dif")) + "</p>") +
      seccion(t("juego.cmp_equipo"), nEq, 0, htmlEq) +
      seccion(t("juego.cmp_habs"), masHab, menosHab, htmlHab || '<p class="suave">' + esc(t("juego.sin_dif")) + "</p>") +
      seccion(t("juego.cmp_dae"), soloB, soloA, htmlDae, false);
  }

  function equipoHTML(ficha) {
    var piezas = (ficha.equipo || []).slice().sort(function (a, b) {
      return RANURAS.indexOf(a.slot) - RANURAS.indexOf(b.slot);
    });
    if (!piezas.length) return "";
    var aviso = ficha.sin_detalle ? "<p class=\"suave\">" + esc(re(t("juego.sin_detalle"), { n: ficha.sin_detalle })) + "</p>" : "";
    return "<h3>" + esc(t("juego.equipo")) + "</h3>" + aviso + '<div class="equipo-rejilla">' + piezas.map(function (p) {
      var ico = urlOk(p.icono) ? '<img src="' + esc(p.icono) + '" alt="">' : "";
      var tip = window.EQ ? ' data-tip="' + esc(EQ.tip(p)) + '"' : ' title="' + esc(nombrePieza(p)) + '"';
      return '<div class="pieza g-' + esc(gradoClase(p.grado)) + '"' + tip + ">" + ico + "<b>" + (p.encantamiento ? "+" + p.encantamiento : "") + "</b><span>" +
        esc(ranura(p.slot)) + "</span><small>" + esc(nombrePieza(p)) + "</small></div>";
    }).join("") + "</div>";
  }

  function alClick(e) {
    var id = e.target.id;
    if (id === "pj-abrir") abrirBusqueda();
    else if (id === "pj-cerrar" || e.target.id === "velo-juego") { var v = $("#velo-juego"); if (v) v.remove(); }
    else if (id === "pj-cerrar-comparar" || e.target.id === "velo-comparar") { var c = $("#velo-comparar"); if (c) c.remove(); }
    else if (e.target.closest && e.target.closest("[data-cmp-cid]")) {
      var r = e.target.closest("[data-cmp-cid]"), velo = $("#velo-comparar"), cmp = velo && velo._cmp;
      if (!cmp) return;
      ocupado(r, t("juego.leyendo"));
      $("#pj-cmp-estado").textContent = re(t("juego.buscando_ficha"), { nombre: r.querySelector("b").textContent });
      api("GET", "/api/juego/ficha?cid=" + encodeURIComponent(r.dataset.cmpCid) + "&server=" + r.dataset.server)
        .then(function (leido) {
          var clave = "o:" + leido.character_id;
          cmp.cache[clave] = leido;
          if (cmp.sel.a === "otro") cmp.sel.a = clave; else cmp.sel.b = clave;
          var opt = '<option value="' + clave + '">' + esc(leido.nombre) + " · " + esc(leido.servidor) + "</option>";
          ["cmp-a", "cmp-b"].forEach(function (id) {
            if (!$("#" + id).querySelector('[value="' + clave + '"]')) $("#" + id).insertAdjacentHTML("beforeend", opt);
          });
          cmp.llenar(); cmp.refrescar();
        }).catch(function (er) { libre(r); $("#pj-cmp-estado").textContent = textoError(er); });
    } else if (e.target.closest && e.target.closest("[data-cid]")) {
      var b = e.target.closest("[data-cid]");
      elegir(b.dataset.cid, parseInt(b.dataset.server, 10), b);
    } else if (id === "pj-refrescar") {
      ocupado(e.target, t("juego.leyendo"));
      api("POST", "/api/personajes/" + CTX.B.personaje.id + "/refrescar", {}).then(function () { location.reload(); })
        .catch(function (er) { libre(e.target); aviso(textoError(er), "mal"); });
    } else if (id === "pj-desvincular") {
      if (!confirm(t("juego.desvincular_conf"))) return;
      api("POST", "/api/builds/" + CTX.B.id + "/desvincular", {}).then(function () { location.reload(); })
        .catch(function (er) { aviso(textoError(er), "mal"); });
    } else if (id === "pj-nueva") {
      var nombre = prompt(t("juego.nueva_nombre"), CTX.B.personaje.nombre);
      if (!nombre) return;
      api("POST", "/api/personajes/" + CTX.B.personaje.id + "/builds", { nombre: nombre, modo: CTX.B.modo })
        .then(function (r) { location.href = "build.html?id=" + r.id + "&editar=1"; })
        .catch(function (er) { aviso(textoError(er), "mal"); });
    } else if (id === "pj-comparar") abrirComparar();
  }

  document.addEventListener("click", alClick);
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "pj-form" && e.target.id !== "pj-cmp-form") return;
    e.preventDefault();
    var cmp = e.target.id === "pj-cmp-form";
    var q = $(cmp ? "#pj-cmp-q" : "#pj-q").value.trim(), estado = $(cmp ? "#pj-cmp-estado" : "#pj-estado"), caja = $(cmp ? "#pj-cmp-res" : "#pj-resultados");
    estado.textContent = t("juego.buscando");
    caja.innerHTML = "";
    api("GET", "/api/juego/buscar?q=" + encodeURIComponent(q)).then(function (lista) {
      estado.textContent = lista.length ? "" : t("juego.vacio");
      caja.innerHTML = lista.map(function (p) {
        var foto = urlOk(p.imagen) ? '<img src="' + esc(p.imagen) + '" alt="">' : "";
        return '<button type="button" class="resultado-pj" data-' + (cmp ? "cmp-cid" : "cid") + '="' + esc(p.character_id) + '" data-server="' + p.server_id + '">' +
          foto + "<span><b>" + esc(p.nombre) + "</b><small>" + esc(p.servidor) + " · " + esc(t("juego.nv")) + " " + p.nivel + "</small></span></button>";
      }).join("");
    }).catch(function (er) { estado.textContent = textoError(er); });
  });
  document.addEventListener("change", function (e) {
    if (e.target.id !== "pj-publico" || !CTX || !CTX.B.personaje) return;
    api("POST", "/api/personajes/" + CTX.B.personaje.id + "/equipo-publico", { publica: e.target.checked })
      .catch(function (er) { e.target.checked = !e.target.checked; aviso(textoError(er), "mal"); });
  });

  return {
    montar: function (ctx) { CTX = ctx; pintar(); }
  };
})();
