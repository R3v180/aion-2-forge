// Equipo de la build: ranuras, selector con buscador, mejoras y total de estadísticas.
// Catálogo en data/equipo (ids = los de NC). Mismos cálculos que equipo.py.
Object.assign(TEXTOS, {
  "pest.equipo": { es: "Equipo", en: "Gear" },
  "eq.titulo": { es: "Equipo de la build", en: "Build gear" },
  "eq.vacio": { es: "Sin objeto", en: "Empty" },
  "eq.ninguno": { es: "Esta build aún no tiene equipo.", en: "This build has no gear yet." },
  "eq.pulsa": { es: "Pulsa una ranura para elegir el objeto.", en: "Click a slot to choose an item." },
  "eq.pulsa_ver": { es: "Pulsa una pieza para ver todos sus detalles.", en: "Click a piece to see all its details." },
  "eq.elegir": { es: "Elegir objeto", en: "Choose item" },
  "eq.cambiar": { es: "Cambiar objeto", en: "Change item" },
  "eq.quitar": { es: "Quitar", en: "Remove" },
  "eq.buscar": { es: "Buscar por nombre (ES o EN)…", en: "Search by name (EN or ES)…" },
  "eq.todos_grados": { es: "Todos los grados", en: "All grades" },
  "eq.todas_facciones": { es: "Ambas facciones", en: "Both factions" },
  "eq.resultados": { es: "{n} objetos", en: "{n} items" },
  "eq.max_res": { es: "Mostrando {n} de {total}: afina la búsqueda.", en: "Showing {n} of {total}: refine your search." },
  "eq.sin_res": { es: "Ningún objeto coincide.", en: "No item matches." },
  "eq.cerrar": { es: "Cerrar", en: "Close" },
  "eq.cargando": { es: "Cargando objetos…", en: "Loading items…" },
  "eq.mejora": { es: "Mejora", en: "Enhance" },
  "eq.superacion": { es: "Superación", en: "Amplify" },
  "eq.potencial": { es: "Potencial", en: "Potential" },
  "eq.sub": { es: "Vínculo de alma", en: "Soul bind" },
  "eq.sub_fijo": { es: "Sub-estadísticas fijas", en: "Fixed sub-stats" },
  "eq.sub_ayuda": { es: "Hasta {n} estadísticas, con el valor entre el mínimo y el máximo del objeto.", en: "Up to {n} stats, valued between the item's minimum and maximum." },
  "eq.alma": { es: "Piedra filosofal", en: "Philosopher's Stone" },
  "eq.piedras": { es: "Piedras de maná", en: "Manastones" },
  "eq.divinas": { es: "Piedras sagradas", en: "Theostones" },
  "eq.elige_stat": { es: "— Estadística —", en: "— Stat —" },
  "eq.elige_divina": { es: "— Piedra sagrada —", en: "— Theostone —" },
  "eq.stats": { es: "Estadísticas", en: "Stats" },
  "eq.de_mejora": { es: "de la mejora", en: "from enhance" },
  "eq.nv_objeto": { es: "Nv. de objeto", en: "Item level" },
  "eq.nv_req": { es: "Nv. requerido", en: "Required level" },
  "eq.total": { es: "Lo que da el equipo", en: "What the gear gives" },
  "eq.total_vacio": { es: "Elige piezas para ver la suma de estadísticas.", en: "Choose pieces to see the stat totals." },
  "eq.sumar_dae": { es: "Sumar Daevanion", en: "Add Daevanion" },
  "eq.sin_dae": { es: "Solo equipo", en: "Gear only" },
  "eq.piezas": { es: "{n} de {total} ranuras", en: "{n} of {total} slots" },
  "eq.fuente": { es: "Datos de objetos: questlog.gg (mismos ids que NC). Las sub-estadísticas aleatorias y las piedras las eliges tú.",
    en: "Item data: questlog.gg (same ids as NC). Random sub-stats and stones are chosen by you." },
  "eq.luz": { es: "Elyos", en: "Elyos" },
  "eq.oscuridad": { es: "Asmodian", en: "Asmodian" },
  "eq.grado_x": { es: "Grado {n}", en: "Grade {n}" },
  "eq.g.Common": { es: "Común", en: "Common" },
  "eq.g.Rare": { es: "Superior", en: "Superior" },
  "eq.g.Legend": { es: "Raro", en: "Rare" },
  "eq.g.Unique": { es: "Heroico", en: "Heroic" },
  "eq.g.Epic": { es: "Legendario", en: "Legendary" },
  "eq.g.Mythic": { es: "Mítico", en: "Mythic" },
  "eq.g.Special": { es: "Especial", en: "Special" },
  "eq.v.soulbind": { es: "Se vincula al equipar", en: "Binds on equip" },
  "eq.v.soulbind_acquire": { es: "Se vincula al obtener", en: "Binds on pickup" },
  "eq.v.exchangeable": { es: "Comerciable", en: "Tradable" },
  "eq.v.nonexchangeable": { es: "No comerciable", en: "Untradable" },
  "eq.alma_pct": { es: "Vínculo de alma {n}%", en: "Soul bind {n}%" },
  "eq.r.MainHand": { es: "Arma", en: "Weapon" }, "eq.r.SubHand": { es: "Guarda", en: "Guard" },
  "eq.r.Helmet": { es: "Yelmo", en: "Helm" }, "eq.r.Shoulder": { es: "Hombreras", en: "Pauldrons" },
  "eq.r.Torso": { es: "Pecho", en: "Chest" }, "eq.r.Pants": { es: "Piernas", en: "Legs" },
  "eq.r.Gloves": { es: "Guantes", en: "Gloves" }, "eq.r.Boots": { es: "Botas", en: "Boots" },
  "eq.r.Cape": { es: "Capa", en: "Cloak" }, "eq.r.Belt": { es: "Cinturón", en: "Belt" },
  "eq.r.Necklace": { es: "Collar", en: "Necklace" }, "eq.r.Amulet": { es: "Amuleto", en: "Amulet" },
  "eq.r.Earring1": { es: "Pendiente 1", en: "Earring 1" }, "eq.r.Earring2": { es: "Pendiente 2", en: "Earring 2" },
  "eq.r.Ring1": { es: "Anillo 1", en: "Ring 1" }, "eq.r.Ring2": { es: "Anillo 2", en: "Ring 2" },
  "eq.r.Bracelet1": { es: "Brazalete 1", en: "Bracelet 1" }, "eq.r.Bracelet2": { es: "Brazalete 2", en: "Bracelet 2" },
  "eq.r.Rune1": { es: "Runa 1", en: "Rune 1" }, "eq.r.Rune2": { es: "Runa 2", en: "Rune 2" }
});

var EQ = (function () {
  var RANURAS = ["MainHand", "SubHand", "Helmet", "Shoulder", "Torso", "Pants", "Gloves", "Boots", "Cape", "Belt",
    "Necklace", "Amulet", "Earring1", "Earring2", "Ring1", "Ring2", "Bracelet1", "Bracelet2", "Rune1", "Rune2"];
  var SUB = { SubHand: "guarder", Helmet: "helmet", Shoulder: "shoulder", Torso: "torso", Pants: "pants", Gloves: "gloves",
    Boots: "boots", Cape: "cape", Belt: "belt", Necklace: "necklace", Amulet: "amulet", Earring1: "earring", Earring2: "earring",
    Ring1: "ring", Ring2: "ring", Bracelet1: "bracelet", Bracelet2: "bracelet", Rune1: "rune", Rune2: "rune" };
  var ARMA = { gladiator: "greatsword", templar: "sword", assassin: "dagger", ranger: "bow", sorcerer: "magicbook",
    spiritmaster: "orb", cleric: "mace", chanter: "staff" };
  var GRADO = { 11: "Common", 21: "Rare", 31: "Legend", 41: "Unique", 51: "Epic", 61: "Mythic", 71: "Special" };
  var FUERA = { weaponmindamage: 1, maxweaponblock: 1, decreaseweaponblock: 1 };
  var PRIMERO = ["weaponfixingdamage", "weaponaccuracy", "critical", "armordefense", "hpmax", "mpmax"];
  var CODIGO = {};
  Object.keys(GRADO).forEach(function (k) { CODIGO[GRADO[k]] = +k; });
  var subs = {}, piedras = null;

  function sub(clase, slot) { return slot === "MainHand" ? ARMA[clase] : SUB[slot]; }
  function cargarSub(s) {
    if (!s) return Promise.resolve({ lista: [], porId: {} });
    if (subs[s]) return subs[s];
    return (subs[s] = fetch("data/equipo/" + s + ".json").then(function (r) { return r.ok ? r.json() : []; }).then(function (l) {
      var por = {};
      l.forEach(function (p) { por[p.id] = p; });
      return { lista: l, porId: por };
    }));
  }
  function cargarPiedras() {
    if (!piedras) piedras = fetch("data/equipo/piedras.json").then(function (r) { return r.json(); }).then(function (d) {
      d.divinaPorId = {};
      d.divinas.forEach(function (x) { d.divinaPorId[x.id] = x; });
      return d;
    });
    return piedras;
  }
  function claveGrado(g) {
    if (g == null || g === "") return "";
    if (typeof g === "number") return GRADO[g] || "";
    var s = String(g).trim();
    if (GRADO[+s]) return GRADO[+s];
    var alias = {
      common: "Common", comun: "Common", "común": "Common", normal: "Common",
      rare: "Rare", superior: "Rare",
      legend: "Legend", raro: "Legend",
      unique: "Unique", heroic: "Unique", heroico: "Unique",
      epic: "Epic", legendary: "Epic", legendario: "Epic",
      mythic: "Mythic", mitico: "Mythic", "mítico": "Mythic",
      special: "Special", especial: "Special"
    };
    if (CODIGO[s]) return s;
    return alias[s.toLowerCase()] || "";
  }
  function nombreGrado(g) {
    var k = claveGrado(g);
    return TEXTOS["eq.g." + k] ? t("eq.g." + k) : re(t("eq.grado_x"), { n: CODIGO[k] || g });
  }
  function re(txt, mapa) { return String(txt).replace(/\{(\w+)\}/g, function (_, k) { return mapa[k] == null ? "" : mapa[k]; }); }
  function iconoNC(p) { return "https://assets.playnccdn.com/static-aion2-gamedata/resources/" + p.i.split("/").pop() + ".png"; }
  function iconoQL(p) { return "https://cdn.questlog.gg/aion-2/assets/Game/UI/Resource/Texture/" + p.i + ".webp"; }
  function img(url, alt, respaldo) {
    if (!/^https:\/\/(assets\.playnccdn\.com|cdn\.questlog\.gg)\//.test(url || "")) return "";
    return '<img src="' + esc(url) + '" alt="' + esc(alt || "") + '" loading="lazy"' +
      (respaldo ? " onerror=\"this.onerror=null;this.src='" + esc(respaldo) + "'\"" : "") + ">";
  }
  function nombreStat(s) { var e = _estadisticas && _estadisticas[s]; return e ? tr(e) : s; }
  function valor(s, v) { return valorStat(s, v).valor; }

  // mismas reglas que equipo.calcular
  function calcular(p, c) {
    var total = {}, enc = {};
    function suma(a, s, v) {
      if (s === "weapondamage") s = "weaponfixingdamage";
      if (FUERA[s] || !v) return;
      a[s] = (a[s] || 0) + v;
    }
    function nivel(tabla, n, conEnc) {
      if (!n) return;
      Object.keys(tabla || {}).forEach(function (s) {
        var v = tabla[s][n - 1];
        if (v == null) return;
        suma(total, s, v);
        if (conEnc) suma(enc, s, v);
      });
    }
    Object.keys(p.m || {}).forEach(function (s) { suma(total, s, p.m[s]); });
    nivel(p.e, c.encantamiento, true);
    nivel(p.x, c.superado, true);
    nivel(p.p, c.potencial, false);
    (c.sub || []).concat(c.alma_stat ? [c.alma_stat] : [], c.piedras || []).forEach(function (x) { suma(total, x[0], x[1]); });
    return { stats: total, stats_enc: enc };
  }
  function completar(c, p) {
    var r = calcular(p, c);
    c.stats = r.stats; c.stats_enc = r.stats_enc;
    c.nombre = p.n.en; c.nombre_es = p.n.es; c.grado = GRADO[p.g] || claveGrado(c.grado) || ""; c.icono = iconoNC(p); c.alma = c.alma || 0;
    return c;
  }
  function filasStats(stats, enc) {
    var claves = Object.keys(stats || {}).sort(ordenStats);
    if (!claves.length) return "";
    return "<table class='tt-tabla'>" + claves.map(function (s) {
      var e = enc && enc[s] ? " <small class='eq-enc'>(" + valor(s, enc[s]) + ")</small>" : "";
      return "<tr><td>" + esc(nombreStat(s)) + "</td><td>" + esc(valor(s, stats[s])) + e + "</td></tr>";
    }).join("") + "</table>";
  }
  function ordenStats(a, b) {
    var ea = (_estadisticas || {})[a] || {}, eb = (_estadisticas || {})[b] || {};
    var pa = PRIMERO.indexOf(a), pb = PRIMERO.indexOf(b), ca = CATS.indexOf(ea.cat), cb = CATS.indexOf(eb.cat);
    return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb) || (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb) || (ea.orden || 99) - (eb.orden || 99) || nombreStat(a).localeCompare(nombreStat(b));
  }
  var CATS = ["MainStat", "BookMark", "Attack", "Defense", "Resist", "PVE", "PVP", ""];
  function lista(titulo, pares) {
    if (!pares || !pares.length) return "";
    return "<div class='tt-sec'>" + esc(titulo) + "</div>" + pares.map(function (x) {
      return "<div class='tt-esp on'>" + esc(nombreStat(x[0])) + " <b>" + esc(valor(x[0], x[1])) + "</b></div>";
    }).join("");
  }
  // tooltip de una pieza (de la build o de la ficha del personaje); `p` = objeto del catálogo si se conoce
  function tip(c, p, pd) {
    var nombre = (IDIOMA === "es" && String(c.nombre_es || "").trim()) || c.nombre || (p && tr(p.n)) || "";
    var nivel = (c.encantamiento ? " +" + c.encantamiento : "") + (c.superado ? " ⟫" + c.superado : "");
    var sub = [t("eq.r." + c.slot), nombreGrado(c.grado)];
    if (p && p.il) sub.push(t("eq.nv_objeto") + " " + p.il);
    if (p && p.nv) sub.push(t("eq.nv_req") + " " + p.nv);
    if (p && TEXTOS["eq.v." + p.v]) sub.push(t("eq.v." + p.v));
    var h = "<div class='tt-nombre g-" + esc(claveGrado(c.grado)) + "'>" + esc(nombre) + esc(nivel) + "</div><div class='tt-sub'>" + esc(sub.join(" · ")) + "</div>";
    if (p && p.m && p.m.weaponmindamage) {
      var n = c.encantamiento || 0, e = p.e || {};
      var mn = p.m.weaponmindamage + (n && e.weaponmindamage ? e.weaponmindamage[n - 1] || 0 : 0);
      var mx = (p.m.weapondamage || 0) + (n && e.weapondamage ? e.weapondamage[n - 1] || 0 : 0);
      h += "<div class='tt-sub'>" + esc(nombreStat("weaponfixingdamage")) + " " + mn + " ~ " + mx + "</div>";
    }
    if (c.potencial) h += "<div class='tt-sub'>" + esc(t("eq.potencial")) + " " + c.potencial + "</div>";
    h += filasStats(c.stats, c.stats_enc);
    if (c.stats_enc && Object.keys(c.stats_enc).length) h += "<div class='tt-sub'>(" + esc(t("eq.de_mejora")) + ")</div>";
    h += lista(t("eq.sub") + (c.alma ? " · " + c.alma + "%" : ""), c.sub);
    h += lista(t("eq.alma"), c.alma_stat ? [c.alma_stat] : []);
    h += lista(t("eq.piedras"), c.piedras);
    if (c.divinas && c.divinas.length && pd) {
      h += "<div class='tt-sec'>" + esc(t("eq.divinas")) + "</div>" + c.divinas.map(function (id) {
        var d = pd.divinaPorId[id];
        return d ? "<div class='tt-esp on'><b>" + esc(tr(d.n)) + "</b><br>" + esc(tr(d.d)).replace(/\n/g, "<br>") + "</div>" : "";
      }).join("");
    }
    if (p && p.d && tr(p.d)) h += "<div class='tt-desc'>" + esc(tr(p.d)).replace(/\n/g, "<br>") + "</div>";
    return h;
  }
  function sumar(piezas) {
    var tot = {};
    (piezas || []).forEach(function (c) {
      Object.keys(c.stats || {}).forEach(function (s) { tot[s] = (tot[s] || 0) + c.stats[s]; });
    });
    return tot;
  }

  return { RANURAS: RANURAS, GRADO: GRADO, claveGrado: claveGrado, sub: sub, cargarSub: cargarSub, cargarPiedras: cargarPiedras, nombreGrado: nombreGrado,
    iconoNC: iconoNC, iconoQL: iconoQL, img: img, calcular: calcular, completar: completar, tip: tip, sumar: sumar,
    filasStats: filasStats, ordenStats: ordenStats, nombreStat: nombreStat, valor: valor, re: re };
})();

// Pestaña "Equipo" de build.html
function Equipo(op) {
  var B = op.B, editando = op.editando, raiz = null, sel = null, listo = false, daeElegido = -1, D = null;
  B.datos.equipo = B.datos.equipo || [];
  var cat = {}, PD = null;
  function piezas() { return B.datos.equipo; }
  function pieza(slot) { return piezas().filter(function (c) { return c.slot === slot; })[0]; }
  function item(c) { var s = EQ.sub(B.clase, c.slot); return s && cat[s] ? cat[s].porId[c.id] : null; }
  function cambio() { if (op.alCambiar) op.alCambiar(); }

  function cargar() {
    var necesarios = {};
    EQ.RANURAS.forEach(function (r) { var s = EQ.sub(B.clase, r); if (s && (editando || pieza(r))) necesarios[s] = 1; });
    return Promise.all([cargarEstadisticas(), EQ.cargarPiedras(), fetch("data/daevanion/" + B.clase + ".json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })]
      .concat(Object.keys(necesarios).map(function (s) { return EQ.cargarSub(s).then(function (d) { cat[s] = d; }); })))
      .then(function (r) { PD = r[1]; D = r[2]; listo = true; });
  }

  function ranuraHTML(slot) {
    var c = pieza(slot), p = c && item(c);
    var on = sel === slot ? " on" : "";
    if (!c) {
      return '<button type="button" class="eq-ranura vacia' + on + '" data-eq="' + slot + '"' + (editando ? "" : " disabled") + '><span class="eq-hueco"></span>' +
        "<span class='eq-txt'><span class='eq-slot'>" + esc(t("eq.r." + slot)) + "</span><small>" + esc(t(editando ? "eq.elegir" : "eq.vacio")) + "</small></span></button>";
    }
    var nombre = (IDIOMA === "es" && String(c.nombre_es || "").trim()) || c.nombre;
    var ico = p ? EQ.img(EQ.iconoNC(p), nombre, EQ.iconoQL(p)) : EQ.img(c.icono, nombre);
    return '<button type="button" class="eq-ranura g-' + esc(EQ.claveGrado(c.grado)) + on + '" data-eq="' + slot + '" data-tip="' + esc(EQ.tip(c, p, PD)) + '">' +
      '<span class="eq-hueco">' + ico + (c.encantamiento ? "<b>+" + c.encantamiento + "</b>" : "") + "</span><span class='eq-txt'><span class='eq-slot'>" +
      esc(t("eq.r." + slot)) + "</span><span class='eq-nombre'>" + esc(nombre) + "</span><small>" + esc(EQ.nombreGrado(c.grado)) +
      (p && p.il ? " · " + esc(t("eq.nv_objeto")) + " " + p.il : "") + "</small></span></button>";
  }

  function statsDae() {
    var stats = {};
    if (daeElegido < 0 || !D) return stats;
    var pr = ((B.datos.daevanion || {}).presets || [])[daeElegido];
    if (!pr) return stats;
    var set = {};
    pr.nodos.forEach(function (n) { set[String(n)] = 1; });
    D.tableros.forEach(function (tb) {
      tb.nodos.forEach(function (n) {
        if (!set[String(n.id)]) return;
        (n.ef || []).forEach(function (ef) { if (ef.s) stats[ef.s] = (stats[ef.s] || 0) + (ef.v || 0); });
      });
    });
    return stats;
  }
  function totalHTML() {
    var eq = EQ.sumar(piezas()), dae = statsDae(), todo = {};
    Object.keys(eq).concat(Object.keys(dae)).forEach(function (s) { todo[s] = (eq[s] || 0) + (dae[s] || 0); });
    var presets = ((B.datos.daevanion || {}).presets || []);
    var selDae = presets.length && D ? '<select id="eq-dae" class="eq-dae"><option value="-1">' + esc(t("eq.sin_dae")) + "</option>" + presets.map(function (p, i) {
      return '<option value="' + i + '"' + (i === daeElegido ? " selected" : "") + ">" + esc(t("eq.sumar_dae")) + ": " + esc(p.nombre) + "</option>";
    }).join("") + "</select>" : "";
    var claves = Object.keys(todo).filter(function (s) { return todo[s]; }).sort(EQ.ordenStats);
    return '<div class="panel eq-total"><h3>' + esc(t("eq.total")) + "</h3><p class='suave'>" + esc(EQ.re(t("eq.piezas"), { n: piezas().length, total: EQ.RANURAS.length })) + "</p>" + selDae +
      (claves.length ? '<div class="eq-filas">' + claves.map(function (s) {
        var extra = dae[s] ? ' <small class="suave" title="Daevanion">(' + esc(EQ.valor(s, dae[s])) + ")</small>" : "";
        return '<div class="fila"><span>' + esc(EQ.nombreStat(s)) + "</span><b>" + esc(EQ.valor(s, todo[s])) + extra + "</b></div>";
      }).join("") + "</div>" : "<p class='suave'>" + esc(t("eq.total_vacio")) + "</p>") + "</div>";
  }

  function opcionesNivel(max, v) {
    var h = "";
    for (var i = 0; i <= max; i++) h += '<option value="' + i + '"' + (i === v ? " selected" : "") + ">+" + i + "</option>";
    return h;
  }
  function editorHTML() {
    if (!sel) return "<p class='suave eq-pista'>" + esc(t(editando ? "eq.pulsa" : "eq.pulsa_ver")) + "</p>";
    var c = pieza(sel), p = c && item(c);
    if (!editando) return c ? '<div class="panel eq-detalle">' + EQ.tip(c, p, PD) + "</div>" : "";
    var cab = '<div class="eq-ed-cab"><h3>' + esc(t("eq.r." + sel)) + '</h3><div class="eq-ed-bot"><button type="button" class="boton chico oro" data-eq-accion="elegir">' +
      esc(t(c ? "eq.cambiar" : "eq.elegir")) + "</button>" + (c ? '<button type="button" class="boton chico peligro" data-eq-accion="quitar">' + esc(t("eq.quitar")) + "</button>" : "") + "</div></div>";
    if (!c || !p) return '<div class="panel eq-editor">' + cab + "</div>";
    var h = '<div class="eq-ed-item">' + EQ.img(EQ.iconoNC(p), "", EQ.iconoQL(p)) + "<div><b class='g-" + esc(EQ.claveGrado(c.grado) || EQ.GRADO[p.g] || "") + "'>" + esc(tr(p.n)) + "</b><small>" +
      esc(EQ.nombreGrado(p.g)) + " · " + esc(t("eq.nv_objeto")) + " " + p.il + " · " + esc(t("eq.nv_req")) + " " + p.nv + "</small></div></div>";
    h += '<div class="eq-niveles">';
    if (p.emax) h += "<label>" + esc(t("eq.mejora")) + ' <select data-eq-campo="encantamiento">' + opcionesNivel(p.emax, c.encantamiento || 0) + "</select></label>";
    if (p.xmax) h += "<label>" + esc(t("eq.superacion")) + ' <select data-eq-campo="superado">' + opcionesNivel(p.xmax, c.superado || 0) + "</select></label>";
    if (p.pmax) h += "<label>" + esc(t("eq.potencial")) + ' <select data-eq-campo="potencial">' + opcionesNivel(p.pmax, c.potencial || 0) + "</select></label>";
    h += "</div>";
    if (p.sub && p.fijo) {
      h += "<h4>" + esc(t("eq.sub_fijo")) + "</h4>" + p.sub.map(function (s) {
        return '<div class="eq-fijo">' + esc(EQ.nombreStat(s[0])) + " <b>" + esc(EQ.valor(s[0], s[2])) + "</b></div>";
      }).join("");
    } else if (p.sub && p.ns) {
      h += "<h4>" + esc(t("eq.sub")) + " <small class='suave'>" + esc(EQ.re(t("eq.sub_ayuda"), { n: p.ns })) + "</small></h4>";
      for (var i = 0; i < p.ns; i++) h += filaSub("sub", i, (c.sub || [])[i], p.sub);
    }
    if (p.sa && p.sub) h += "<h4>" + esc(t("eq.alma")) + "</h4>" + filaSub("alma", 0, c.alma_stat, p.sub);
    if (p.ms && PD) {
      h += "<h4>" + esc(t("eq.piedras")) + " <small class='suave'>(" + p.ms + ")</small></h4>";
      for (var j = 0; j < p.ms; j++) h += filaPiedra(j, (c.piedras || [])[j]);
    }
    if (p.gs && PD) {
      h += "<h4>" + esc(t("eq.divinas")) + "</h4>";
      for (var k = 0; k < p.gs; k++) {
        var actual = (c.divinas || [])[k] || "";
        h += '<select class="eq-divina" data-eq-divina="' + k + '"><option value="">' + esc(t("eq.elige_divina")) + "</option>" + PD.divinas.map(function (d) {
          return '<option value="' + d.id + '"' + (d.id === actual ? " selected" : "") + ">" + esc(tr(d.n)) + " · " + esc(EQ.nombreGrado(d.g)) + "</option>";
        }).join("") + "</select>";
        if (actual && PD.divinaPorId[actual]) h += "<p class='suave eq-desc-divina'>" + esc(tr(PD.divinaPorId[actual].d)) + "</p>";
      }
    }
    h += "<h4>" + esc(t("eq.stats")) + "</h4>" + EQ.filasStats(c.stats, c.stats_enc);
    if (p.d && tr(p.d)) h += "<p class='suave'>" + esc(tr(p.d)) + "</p>";
    return '<div class="panel eq-editor">' + cab + h + "</div>";
  }
  function filaSub(tipo, i, actual, pool) {
    var st = actual ? actual[0] : "", rango = pool.filter(function (s) { return s[0] === st; })[0];
    return '<div class="eq-fila" data-eq-fila="' + tipo + '" data-i="' + i + '"><select data-eq-stat><option value="">' + esc(t("eq.elige_stat")) + "</option>" +
      pool.map(function (s) {
        return '<option value="' + s[0] + '"' + (s[0] === st ? " selected" : "") + ">" + esc(EQ.nombreStat(s[0])) + " (" + esc(EQ.valor(s[0], s[1]).replace(/^\+/, "")) +
          " ~ " + esc(EQ.valor(s[0], s[2]).replace(/^\+/, "")) + ")</option>";
      }).join("") + "</select>" +
      (rango ? '<input type="number" data-eq-valor min="' + rango[1] + '" max="' + rango[2] + '" value="' + actual[1] + '"><small class="suave">' +
        esc(EQ.valor(st, actual[1])) + "</small>" : "") + "</div>";
  }
  function filaPiedra(i, actual) {
    var st = actual ? actual[0] : "", stats = Object.keys(PD.mana).sort(EQ.ordenStats);
    var vals = st ? PD.mana[st] : [];
    return '<div class="eq-fila" data-eq-fila="piedra" data-i="' + i + '"><select data-eq-stat><option value="">' + esc(t("eq.elige_stat")) + "</option>" +
      stats.map(function (s) { return '<option value="' + s + '"' + (s === st ? " selected" : "") + ">" + esc(EQ.nombreStat(s)) + "</option>"; }).join("") + "</select>" +
      (st ? '<select data-eq-valor>' + vals.map(function (v) {
        return '<option value="' + v[0] + '"' + (v[0] === actual[1] ? " selected" : "") + ">" + esc(EQ.valor(st, v[0])) + " · " + esc(EQ.nombreGrado(v[1])) + "</option>";
      }).join("") + "</select>" : "") + "</div>";
  }

  function html() {
    return '<div class="eq-build"><div class="eq-principal"><div class="eq-rejilla" id="eq-rejilla"></div><div id="eq-editor"></div>' +
      '<p class="suave eq-fuente">' + esc(t("eq.fuente")) + '</p></div><aside class="lateral" id="eq-total"></aside></div>';
  }
  function repintar() {
    if (!raiz || !listo) return;
    var rej = $("#eq-rejilla", raiz);
    rej.innerHTML = !editando && !piezas().length ? '<div class="vacio-lista">' + esc(t("eq.ninguno")) + "</div>" : EQ.RANURAS.map(ranuraHTML).join("");
    $("#eq-editor", raiz).innerHTML = editorHTML();
    $("#eq-total", raiz).innerHTML = totalHTML();
  }
  function nueva(slot, p) {
    var fijas = p.fijo ? p.sub.map(function (x) { return [x[0], x[2]]; }) : [];
    return EQ.completar({ slot: slot, id: p.id, encantamiento: 0, superado: 0, potencial: 0, sub: fijas, piedras: [], divinas: [] }, p);
  }
  function ponerPieza(slot, p) {
    var lista = piezas().filter(function (c) { return c.slot !== slot; });
    if (p) lista.push(nueva(slot, p));
    lista.sort(function (a, b) { return EQ.RANURAS.indexOf(a.slot) - EQ.RANURAS.indexOf(b.slot); });
    B.datos.equipo = lista;
    cambio();
    repintar();
  }

  // ---------- selector de objeto ----------
  function abrirSelector(slot) {
    var s = EQ.sub(B.clase, slot);
    var velo = document.createElement("div");
    velo.className = "velo";
    velo.id = "velo-equipo";
    velo.innerHTML = '<div class="panel eq-selector"><header><h3>' + esc(t("eq.r." + slot)) + '</h3><button type="button" class="boton chico" data-eq-cerrar>' + esc(t("eq.cerrar")) + "</button></header>" +
      '<div class="eq-filtros"><input id="eq-q" type="search" placeholder="' + esc(t("eq.buscar")) + '" autocomplete="off">' +
      '<select id="eq-grado"><option value="">' + esc(t("eq.todos_grados")) + "</option></select>" +
      '<select id="eq-raza"><option value="">' + esc(t("eq.todas_facciones")) + '</option><option value="light">' + esc(t("eq.luz")) + '</option><option value="dark">' +
      esc(t("eq.oscuridad")) + '</option></select></div><p class="suave" id="eq-cuenta">' + esc(t("eq.cargando")) + '</p><div class="eq-lista" id="eq-lista"></div></div>';
    document.body.appendChild(velo);
    var q = $("#eq-q", velo), gr = $("#eq-grado", velo), rz = $("#eq-raza", velo);
    EQ.cargarSub(s).then(function (d) {
      cat[s] = d;
      var grados = {};
      d.lista.forEach(function (p) { grados[p.g] = 1; });
      gr.innerHTML += Object.keys(grados).sort(function (a, b) { return b - a; }).map(function (g) {
        return '<option value="' + g + '">' + esc(EQ.nombreGrado(+g)) + "</option>";
      }).join("");
      function filtrar() {
        var txt = q.value.trim().toLowerCase(), g = gr.value, r = rz.value;
        var res = d.lista.filter(function (p) {
          return (!g || String(p.g) === g) && (!r || p.r === "all" || p.r === r) &&
            (!txt || p.n.es.toLowerCase().indexOf(txt) >= 0 || p.n.en.toLowerCase().indexOf(txt) >= 0);
        });
        var MAX = 120;
        $("#eq-cuenta", velo).textContent = !res.length ? t("eq.sin_res") : res.length > MAX ? EQ.re(t("eq.max_res"), { n: MAX, total: res.length }) : EQ.re(t("eq.resultados"), { n: res.length });
        $("#eq-lista", velo).innerHTML = res.slice(0, MAX).map(function (p) {
          var grado = EQ.GRADO[p.g] || "", prev = nueva(slot, p);
          return '<button type="button" class="eq-opcion g-' + grado + '" data-eq-id="' + p.id + '" data-tip="' + esc(EQ.tip(prev, p, PD)) + '">' +
            '<span class="eq-hueco">' + EQ.img(EQ.iconoNC(p), "", EQ.iconoQL(p)) + "</span><span class='eq-txt'><span class='eq-nombre'>" + esc(tr(p.n)) +
            "</span><small>" + esc(EQ.nombreGrado(p.g)) + " · " + esc(t("eq.nv_objeto")) + " " + p.il + " · " + esc(t("eq.nv_req")) + " " + p.nv +
            (p.r !== "all" ? " · " + esc(t(p.r === "light" ? "eq.luz" : "eq.oscuridad")) : "") +
            (TEXTOS["eq.v." + p.v] ? " · " + esc(t("eq.v." + p.v)) : "") + "</small><small class='eq-otro'>" + esc(IDIOMA === "es" ? p.n.en : p.n.es) + "</small></span></button>";
        }).join("");
      }
      q.addEventListener("input", filtrar);
      gr.addEventListener("change", filtrar);
      rz.addEventListener("change", filtrar);
      filtrar();
      q.focus();
    });
    velo.addEventListener("click", function (e) {
      if (e.target === velo || e.target.closest("[data-eq-cerrar]")) { cerrar(); return; }
      var o = e.target.closest("[data-eq-id]");
      if (o) { ponerPieza(slot, cat[s].porId[o.dataset.eqId]); cerrar(); }
    });
    function cerrar() { velo.remove(); var tp = $("#tip"); if (tp) tp.style.display = "none"; }
  }

  function leerFila(fila) {
    var st = fila.querySelector("[data-eq-stat]").value, v = fila.querySelector("[data-eq-valor]");
    return { stat: st, valor: v ? parseInt(v.value, 10) : null };
  }
  function enlazar(el) {
    raiz = el;
    el.addEventListener("click", function (e) {
      var r = e.target.closest("[data-eq]");
      if (r) {
        sel = sel === r.dataset.eq && !editando ? null : r.dataset.eq;
        if (editando && !pieza(sel)) { repintar(); abrirSelector(sel); return; }
        repintar();
        return;
      }
      var a = e.target.closest("[data-eq-accion]");
      if (a && a.dataset.eqAccion === "elegir") abrirSelector(sel);
      else if (a && a.dataset.eqAccion === "quitar") ponerPieza(sel, null);
    });
    el.addEventListener("change", function (e) {
      if (e.target.id === "eq-dae") { daeElegido = parseInt(e.target.value, 10); $("#eq-total", raiz).innerHTML = totalHTML(); return; }
      var c = pieza(sel), p = c && item(c);
      if (!c || !p) return;
      var campo = e.target.dataset.eqCampo;
      if (campo) c[campo] = parseInt(e.target.value, 10) || 0;
      var fila = e.target.closest("[data-eq-fila]");
      if (fila) {
        var f = leerFila(fila), i = parseInt(fila.dataset.i, 10), tipo = fila.dataset.eqFila;
        var pool = p.sub || [], rango = pool.filter(function (s) { return s[0] === f.stat; })[0];
        if (tipo === "piedra") {
          var vals = f.stat ? PD.mana[f.stat] : [];
          var v = vals.some(function (x) { return x[0] === f.valor; }) && e.target.hasAttribute("data-eq-valor") ? f.valor : (vals.length ? vals[vals.length - 1][0] : null);
          c.piedras = (c.piedras || []).slice();
          c.piedras[i] = f.stat ? [f.stat, v] : null;
          c.piedras = c.piedras.filter(Boolean);
        } else {
          var valor = rango ? (e.target.hasAttribute("data-eq-valor") && !isNaN(f.valor) ? Math.max(rango[1], Math.min(rango[2], f.valor)) : rango[2]) : null;
          if (tipo === "alma") c.alma_stat = rango ? [f.stat, valor] : undefined;
          else {
            var lista = (c.sub || []).slice();
            lista[i] = rango ? [f.stat, valor] : null;
            c.sub = lista.filter(function (x, j) { return x && !lista.slice(0, j).some(function (y) { return y && y[0] === x[0]; }); });
          }
        }
      }
      if (e.target.dataset.eqDivina != null) {
        var d = (c.divinas || []).slice();
        d[parseInt(e.target.dataset.eqDivina, 10)] = e.target.value;
        c.divinas = d.filter(Boolean);
      }
      cambio();
      EQ.completar(c, p);
      repintar();
    });
  }

  return {
    html: html, enlazar: enlazar, cargar: cargar, repintar: repintar,
    datos: function () {
      return piezas().map(function (c) {
        return { slot: c.slot, id: c.id, encantamiento: c.encantamiento || 0, superado: c.superado || 0, potencial: c.potencial || 0,
          sub: c.sub || [], alma_stat: c.alma_stat, piedras: c.piedras || [], divinas: c.divinas || [] };
      });
    },
    tip: function (c) { return EQ.tip(c, item(c), PD); }
  };
}
