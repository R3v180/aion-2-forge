/* Hub + calculadoras AION 2 · Aion 2 Forge */
(function () {
  var D = window.HERRAMIENTAS_DATOS || {};
  var TOOLS = ["mejora", "craft", "odds", "drops", "potential", "stats", "pantheon", "arcana"];

  function L(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[IDIOMA] || obj.es || obj.en || "";
  }

  function fmt(n, dig) {
    if (n == null || isNaN(n)) return "—";
    var d = dig == null ? 2 : dig;
    return Number(n).toLocaleString(IDIOMA === "en" ? "en-US" : "es-ES", {
      maximumFractionDigits: d, minimumFractionDigits: d === 0 ? 0 : undefined
    });
  }

  function pct(x) { return fmt(x * 100, 1) + "%"; }

  /** Intentos esperados con pity lineal hasta 100%. */
  function expectedTries(rate, pity) {
    if (rate >= 1) return 1;
    var p = rate, fail = 1, e = 0, guard = 0;
    while (fail > 1e-12 && guard < 200) {
      e += fail;
      var hit = Math.min(1, p);
      fail *= (1 - hit);
      p += pity;
      guard++;
      if (hit >= 1) break;
    }
    return e;
  }

  function maxTries(rate, pity) {
    if (rate >= 1) return 1;
    if (pity <= 0) return Infinity;
    return Math.ceil((1 - rate) / pity) + 1;
  }

  function campo(label, inner) {
    return '<label class="ht-campo"><span>' + esc(label) + "</span>" + inner + "</label>";
  }

  function selectHtml(id, opts, val) {
    return '<select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + esc(o.v) + '"' + (String(o.v) === String(val) ? " selected" : "") + ">" + esc(o.t) + "</option>";
    }).join("") + "</select>";
  }

  function numInput(id, val, attrs) {
    return '<input type="number" id="' + id + '" value="' + (val == null ? "" : val) + '"' + (attrs || "") + ">";
  }

  function aviso(txt) {
    return '<p class="ht-aviso suave">' + esc(txt) + "</p>";
  }

  function fuentes(keys) {
    var bits = (keys || []).map(function (k) {
      return D.fuentes && D.fuentes[k] ? L(D.fuentes[k]) : "";
    }).filter(Boolean);
    if (!bits.length) return "";
    return '<p class="ht-fuentes suave">' + esc(t("ht.fuentes")) + " " + bits.map(esc).join(" · ") + "</p>";
  }

  function linkGuia(slug) {
    if (!slug) return "";
    return '<p class="ht-guia"><a href="guia.html?g=' + encodeURIComponent(slug) + '">' + esc(t("ht.ver_guia")) + "</a></p>";
  }

  function shell(titleKey, subKey, body, guia) {
    return '<section class="cabeza-seccion ht-cabeza">' +
      '<p class="suave"><a href="herramientas.html">' + esc(t("ht.volver")) + "</a></p>" +
      "<span class=\"antetitulo\">" + esc(t("ht.antetitulo")) + "</span>" +
      "<h1>" + esc(t(titleKey)) + "</h1>" +
      '<p class="suave">' + esc(t(subKey)) + "</p></section>" +
      '<div class="ht-body">' + body + linkGuia(guia) + "</div>";
  }

  /* ---------- Hub ---------- */
  function renderHub() {
    cabecera("herramientas");
    document.title = t("ht.hub_title") + " · Aion 2 Forge";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("ht.hub_desc"));
    var cards = (D.hub || []).map(function (h) {
      return '<a class="ht-card' + (h.img ? " con-foto" : "") + '" href="herramienta.html?t=' + encodeURIComponent(h.id) + '">' +
        (h.img ? '<span class="ht-foto" style="background-image:url(\'' + h.img + '\')"></span>' : "") +
        '<span class="ht-icon" aria-hidden="true">' + h.icon + "</span>" +
        "<b>" + esc(t("ht." + h.id + ".titulo")) + "</b>" +
        "<small>" + esc(t("ht." + h.id + ".card")) + "</small></a>";
    }).join("");
    $("#main").innerHTML =
      '<section class="cabeza-seccion ht-cabeza">' +
      '<span class="antetitulo">' + esc(t("ht.antetitulo")) + "</span>" +
      "<h1>" + esc(t("ht.hub_titulo")) + "</h1>" +
      '<p class="suave">' + esc(t("ht.hub_sub")) + "</p></section>" +
      '<div class="ht-grid">' + cards + "</div>" +
      '<p class="ht-fuentes suave">' + esc(t("ht.hub_nota")) + "</p>";
  }

  /* ---------- Mejora ---------- */
  function renderMejora() {
    var grades = [
      { v: "unique", t: t("ht.grado.unique") },
      { v: "heroic", t: t("ht.grado.heroic") },
      { v: "epic", t: t("ht.grado.epic") },
      { v: "rare", t: t("ht.grado.rare") }
    ];
    var presets = (D.enhance.costPresets || []).map(function (p) {
      return { v: p.id, t: L(p.label) };
    });
    var body =
      '<div class="ht-panel">' +
      '<div class="ht-form">' +
      campo(t("ht.mejora.grado"), selectHtml("m-grado", grades, "unique")) +
      campo(t("ht.mejora.desde"), numInput("m-from", 10, ' min="0" max="20"')) +
      campo(t("ht.mejora.hasta"), numInput("m-to", 15, ' min="1" max="20"')) +
      campo(t("ht.mejora.coste"), selectHtml("m-cost", presets.concat([{ v: "none", t: t("ht.mejora.sin_coste") }]), "102")) +
      "</div>" +
      '<div id="m-out" class="ht-resultado"></div>' +
      aviso(L(D.enhance.notes)) +
      fuentes(["enhanceClient"]) +
      "</div>";
    $("#main").innerHTML = shell("ht.mejora.titulo", "ht.mejora.sub", body, "progression__enhancement-amplify-y-transfer");
    function recalc() {
      var grade = $("#m-grado").value;
      var from = +$("#m-from").value;
      var to = +$("#m-to").value;
      var costId = $("#m-cost").value;
      var cap = D.enhance.cap[grade] || 15;
      var safe = D.enhance.safeUntil[grade] || 10;
      if (to > cap) to = cap;
      if (from < 0) from = 0;
      if (to <= from) {
        $("#m-out").innerHTML = aviso(t("ht.mejora.rango_malo"));
        return;
      }
      var steps = D.enhance.steps[grade === "heroic" ? "heroic" : "unique"] || [];
      var scale = 1;
      var useCost = costId !== "none";
      if (useCost) {
        var pr = (D.enhance.costPresets || []).filter(function (p) { return p.id === costId; })[0];
        scale = pr ? pr.scale : 1;
      }
      var rows = [];
      var totE = 0, totK = 0, totS = 0, safeSteps = 0;
      for (var lvl = from; lvl < to; lvl++) {
        var next = lvl + 1;
        if (next <= safe) {
          safeSteps++;
          totE += 1;
          rows.push({ step: "+" + lvl + " → +" + next, rate: 1, pity: 0, e: 1, max: 1, k: 0, s: 0, safe: true });
          continue;
        }
        var st = steps.filter(function (s) { return s.from === lvl; })[0];
        if (!st) {
          rows.push({ step: "+" + lvl + " → +" + next, missing: true });
          continue;
        }
        var e = expectedTries(st.rate, st.pity);
        var mx = maxTries(st.rate, st.pity);
        var c = useCost ? (D.enhance.costIlvl102[next] || null) : null;
        var k = c ? Math.round(c.kina * scale * e) : 0;
        var s = c ? Math.round(c.stones * scale * e) : 0;
        totE += e; totK += k; totS += s;
        rows.push({ step: "+" + lvl + " → +" + next, rate: st.rate, pity: st.pity, e: e, max: mx, k: k, s: s });
      }
      var html = '<table class="ht-tabla"><thead><tr>' +
        "<th>" + esc(t("ht.col.paso")) + "</th><th>" + esc(t("ht.col.tasa")) + "</th><th>" + esc(t("ht.col.pity")) + "</th>" +
        "<th>" + esc(t("ht.col.media")) + "</th><th>" + esc(t("ht.col.techo")) + "</th>" +
        (useCost ? "<th>" + esc(t("ht.col.kina")) + "</th><th>" + esc(t("ht.col.piedras")) + "</th>" : "") +
        "</tr></thead><tbody>";
      rows.forEach(function (r) {
        if (r.missing) {
          html += "<tr><td>" + esc(r.step) + '</td><td colspan="6" class="suave">' + esc(t("ht.mejora.sin_dato")) + "</td></tr>";
          return;
        }
        html += "<tr><td>" + esc(r.step) + "</td><td>" + pct(r.rate) + "</td><td>" +
          (r.safe ? "—" : "+" + pct(r.pity)) + "</td><td>" + fmt(r.e, 2) + "</td><td>" +
          (r.max === Infinity ? "—" : fmt(r.max, 0)) + "</td>" +
          (useCost ? "<td>" + (r.safe ? "—" : fmt(r.k, 0)) + "</td><td>" + (r.safe ? "—" : fmt(r.s, 0)) + "</td>" : "") +
          "</tr>";
      });
      html += "</tbody></table>";
      html += '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.mejora.intentos")) + "</span><b>" + fmt(totE, 2) + "</b></div>" +
        (useCost ? "<div><span>" + esc(t("ht.col.kina")) + "</span><b>" + fmt(totK, 0) + "</b></div>" +
          "<div><span>" + esc(t("ht.col.piedras")) + "</span><b>" + fmt(totS, 0) + "</b></div>" : "") +
        "<div><span>" + esc(t("ht.mejora.seguros")) + "</span><b>" + safeSteps + "</b></div></div>";
      if (useCost) html += aviso(t("ht.mejora.coste_nota"));
      $("#m-out").innerHTML = html;
    }
    ["m-grado", "m-from", "m-to", "m-cost"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalc);
      $("#" + id).addEventListener("input", recalc);
    });
    recalc();
  }

  /* ---------- Craft ---------- */
  function renderCraft() {
    var profOpts = (D.craft.professions || []).map(function (p) {
      return { v: p.id, t: L(p.name) };
    });
    var body =
      '<div class="ht-panel">' +
      '<div class="ht-form">' +
      campo(t("ht.craft.prof"), selectHtml("c-prof", profOpts, "blacksmithing")) +
      campo(t("ht.craft.exito"), numInput("c-rate", 65, ' min="1" max="100" step="0.1"')) +
      campo(t("ht.craft.mats"), numInput("c-mats", 10, ' min="1" step="1"')) +
      campo(t("ht.craft.deseados"), numInput("c-want", 1, ' min="1" step="1"')) +
      "</div>" +
      '<div id="c-out" class="ht-resultado"></div>' +
      '<div id="c-prof-info" class="ht-resultado"></div>' +
      aviso(L(D.craft.combo)) +
      fuentes(["guiasOc"]) +
      "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.craft.muestras")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.craft.nivel")) + "</th><th>" + esc(t("ht.col.tasa")) + "</th><th></th></tr></thead><tbody>" +
      (D.craft.samples || []).map(function (s) {
        return "<tr><td>" + s.level + "</td><td>" + pct(s.success) + "</td><td class=\"suave\">" + esc(L(s.note)) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>";
    $("#main").innerHTML = shell("ht.craft.titulo", "ht.craft.sub", body, "progression__fabricacion-cinco-profesiones-y-el-endgame-pve");

    function showProf() {
      var p = D.craft.professions.filter(function (x) { return x.id === $("#c-prof").value; })[0];
      if (!p) return;
      var clases = (p.classes || []).map(function (c) {
        return L(D.craft.classNames[c] || { es: c, en: c });
      }).join(", ") || "—";
      $("#c-prof-info").innerHTML =
        "<p><b>" + esc(L(p.name)) + "</b> · " + esc(L(p.makes)) + "</p>" +
        "<p class=\"suave\">" + esc(t("ht.craft.clases")) + ": " + esc(clases) + "</p>";
    }
    function recalc() {
      var rate = Math.max(0.01, Math.min(1, (+$("#c-rate").value || 0) / 100));
      var mats = Math.max(1, +$("#c-mats").value || 1);
      var want = Math.max(1, +$("#c-want").value || 1);
      var eTries = want / rate;
      var eMats = eTries * mats;
      var p95 = Math.ceil(Math.log(0.05) / Math.log(1 - rate));
      if (!isFinite(p95) || p95 < 1) p95 = want;
      $("#c-out").innerHTML =
        '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.craft.intentos_esp")) + "</span><b>" + fmt(eTries, 1) + "</b></div>" +
        "<div><span>" + esc(t("ht.craft.mats_esp")) + "</span><b>" + fmt(eMats, 0) + "</b></div>" +
        "<div><span>" + esc(t("ht.craft.p95")) + "</span><b>" + fmt(p95 * mats, 0) + "</b></div></div>" +
        aviso(t("ht.craft.nota_calc"));
    }
    ["c-prof", "c-rate", "c-mats", "c-want"].forEach(function (id) {
      var el = $("#" + id);
      el.addEventListener("change", function () { showProf(); recalc(); });
      el.addEventListener("input", recalc);
    });
    // sample click
    document.querySelectorAll(".ht-tabla tbody tr").forEach(function (tr, i) {
      tr.style.cursor = "pointer";
      tr.addEventListener("click", function () {
        var s = D.craft.samples[i];
        if (s) { $("#c-rate").value = (s.success * 100).toFixed(1); recalc(); }
      });
    });
    showProf();
    recalc();
  }

  /* ---------- Odds / Manastone ---------- */
  function gradeLabel(g) {
    var map = { 11: t("ht.grado.common"), 21: t("ht.grado.rare"), 31: t("ht.grado.legendary"), 41: t("ht.grado.unique"), 51: t("ht.grado.heroic") };
    return map[g] || ("G" + g);
  }

  function renderOdds() {
    var P = window.PIEDRAS_HERRAMIENTAS || { mana: {}, labels: {}, divinas: [] };
    var keys = Object.keys(P.mana || {}).sort();
    var opts = keys.map(function (k) {
      var lab = P.labels[k] ? L(P.labels[k]) : k;
      return { v: k, t: lab };
    });
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.orden")) + "</h2><ol class=\"ht-lista\">" +
      (D.odds.order || []).map(function (o) { return "<li>" + esc(L(o)) + "</li>"; }).join("") +
      "</ol>" + aviso(L(D.odds.note)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.mana")) + "</h2>" +
      '<div class="ht-form">' + campo(t("ht.odds.stat"), selectHtml("o-stat", opts, opts[0] && opts[0].v)) + "</div>" +
      '<div id="o-mana" class="ht-resultado"></div>' + fuentes(["piedras"]) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.soul")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.hueco")) + "</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.odds.soulbind || []).map(function (r) {
        return "<tr><td>" + esc(L(r.slot)) + "</td><td>" + esc(L(r.opts)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.sync")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.hueco")) + "</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.odds.syncEssentials || []).map(function (r) {
        return "<tr><td>" + esc(L(r.slot)) + "</td><td>" + esc(L(r.opt)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.theo")) + "</h2>" +
      '<input type="search" id="o-theo-q" placeholder="' + esc(t("ht.odds.buscar")) + '">' +
      '<div id="o-theo" class="ht-lista-scroll"></div></div>';
    $("#main").innerHTML = shell("ht.odds.titulo", "ht.odds.sub", body, "progression__manastone-theostone-y-soul-binding");

    function showMana() {
      var k = $("#o-stat").value;
      var rows = P.mana[k] || [];
      var html = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.col.grado")) +
        "</th><th>" + esc(t("ht.col.valor")) + "</th></tr></thead><tbody>";
      rows.forEach(function (pair) {
        html += "<tr><td>" + esc(gradeLabel(pair[1])) + " <span class=\"suave\">(" + pair[1] + ")</span></td><td><b>" + pair[0] + "</b></td></tr>";
      });
      html += "</tbody></table>";
      $("#o-mana").innerHTML = html || aviso(t("ht.sin_datos"));
    }
    function showTheo() {
      var q = ($("#o-theo-q").value || "").toLowerCase();
      var list = (P.divinas || []).filter(function (x) {
        var n = L(x.n).toLowerCase();
        var d = L(x.d).toLowerCase();
        return !q || n.indexOf(q) >= 0 || d.indexOf(q) >= 0;
      }).slice(0, 40);
      $("#o-theo").innerHTML = list.map(function (x) {
        return '<div class="ht-item"><b>' + esc(L(x.n)) + "</b><small>" + esc(L(x.d)) + "</small></div>";
      }).join("") || aviso(t("ht.sin_datos"));
    }
    $("#o-stat").addEventListener("change", showMana);
    $("#o-theo-q").addEventListener("input", showTheo);
    showMana();
    showTheo();
  }

  /* ---------- Drops ---------- */
  function renderDrops() {
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.pity")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.drops.tier"), selectHtml("d-tier", (D.drops.pity || []).map(function (p) {
        return { v: p.tier, t: t("ht.drops.nivel") + " " + p.tier };
      }), 1)) +
      campo(t("ht.drops.clears"), numInput("d-clears", 0, ' min="0" step="1"')) +
      "</div><div id=\"d-out\" class=\"ht-resultado\"></div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.reglas")) + "</h2><ul class=\"ht-lista\">" +
      (L(D.drops.rules) || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul>" + aviso(L(D.drops.odyle)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.farms")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.item")) + "</th><th>" + esc(t("ht.col.donde")) + "</th></tr></thead><tbody>" +
      (D.drops.farms || []).map(function (f) {
        return "<tr><td>" + esc(L(f.item)) + "</td><td>" + esc(L(f.where)) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<p><a class="boton chico" href="mapa.html">' + esc(t("ht.drops.mapa")) + "</a></p>" +
      fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.drops.titulo", "ht.drops.sub", body, "dungeons__recompensas-de-mazmorra-el-cubo-y-el-contador-de-pity");
    function recalc() {
      var tier = +$("#d-tier").value;
      var clears = +$("#d-clears").value || 0;
      var row = (D.drops.pity || []).filter(function (p) { return p.tier === tier; })[0];
      if (!row) return;
      var left = Math.max(0, row.clears - clears);
      var pctDone = Math.min(100, (clears / row.clears) * 100);
      $("#d-out").innerHTML =
        '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.drops.garantia")) + "</span><b>" + row.clears + "</b></div>" +
        "<div><span>" + esc(t("ht.drops.faltan")) + "</span><b>" + left + "</b></div>" +
        "<div><span>" + esc(t("ht.drops.progreso")) + "</span><b>" + fmt(pctDone, 0) + "%</b></div></div>" +
        "<p>" + esc(L(row.reward)) + "</p>" +
        aviso(t("ht.drops.pity_nota"));
    }
    ["d-tier", "d-clears"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalc);
      $("#" + id).addEventListener("input", recalc);
    });
    recalc();
  }

  /* ---------- Potential / Amplify / Transfer ---------- */
  function renderPotential() {
    var ampOpts = [0, 1, 2, 3, 4, 5].map(function (n) { return { v: n, t: "◆" + n }; });
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.amp")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.mejora.desde"), selectHtml("a-from", ampOpts, 0)) +
      campo(t("ht.mejora.hasta"), selectHtml("a-to", ampOpts, 3)) +
      '</div><div id="a-out" class="ht-resultado"></div>' +
      aviso(L(D.amplify.req)) + fuentes(["enhanceClient"]) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.pot")) + "</h2>" +
      '<div class="ht-form">' + campo(t("ht.potential.nivel"), numInput("p-lvl", 0, ' min="0" max="4"')) + "</div>" +
      '<div id="p-out" class="ht-resultado"></div>' +
      aviso(L(D.potential.note)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.transfer")) + "</h2>" +
      '<ul class="ht-lista">' +
      "<li>" + esc(t("ht.potential.t1")) + "</li>" +
      "<li>" + esc(t("ht.potential.t2")) + "</li>" +
      "<li>" + esc(t("ht.potential.t3")) + "</li>" +
      "<li>" + esc(t("ht.potential.t4")) + "</li>" +
      "</ul></div>";
    $("#main").innerHTML = shell("ht.potential.titulo", "ht.potential.sub", body, "progression__enhancement-amplify-y-transfer");

    function recalcAmp() {
      var from = +$("#a-from").value;
      var to = +$("#a-to").value;
      if (to <= from) {
        $("#a-out").innerHTML = aviso(t("ht.mejora.rango_malo"));
        return;
      }
      var tot = 0;
      var html = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.col.paso")) +
        "</th><th>" + esc(t("ht.col.tasa")) + "</th><th>" + esc(t("ht.col.pity")) +
        "</th><th>" + esc(t("ht.col.media")) + "</th><th>" + esc(t("ht.col.techo")) +
        "</th></tr></thead><tbody>";
      for (var i = from; i < to; i++) {
        var st = D.amplify.steps.filter(function (s) { return s.from === i; })[0];
        if (!st) continue;
        var e = expectedTries(st.rate, st.pity);
        tot += e;
        html += "<tr><td>◆" + i + " → ◆" + (i + 1) + "</td><td>" + pct(st.rate) +
          "</td><td>+" + pct(st.pity) + "</td><td>" + fmt(e, 2) + "</td><td>" +
          fmt(maxTries(st.rate, st.pity), 0) + "</td></tr>";
      }
      html += '</tbody></table><div class="ht-totales"><div><span>' + esc(t("ht.mejora.intentos")) +
        "</span><b>" + fmt(tot, 2) + "</b></div></div>";
      $("#a-out").innerHTML = html;
    }
    function recalcPot() {
      var lvl = Math.max(0, Math.min(4, +$("#p-lvl").value || 0));
      var bonus = lvl * 0.5;
      $("#p-out").innerHTML =
        '<div class="ht-totales"><div><span>' + esc(t("ht.potential.bonus")) +
        "</span><b>+" + fmt(bonus, 1) + "%</b></div>" +
        "<div><span>" + esc(t("ht.potential.max")) + "</span><b>+2,0%</b></div></div>" +
        "<p class=\"suave\">" + esc(L(D.potential.perLevel)) + "</p>";
    }
    ["a-from", "a-to"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalcAmp);
    });
    $("#p-lvl").addEventListener("input", recalcPot);
    recalcAmp();
    recalcPot();
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    var P = window.PIEDRAS_HERRAMIENTAS || { mana: {}, labels: {} };
    var keys = Object.keys(P.mana || {}).sort();
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.capas")) + "</h2><ol class=\"ht-lista\">" +
      (D.stats.layers || []).map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") +
      "</ol></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.roles")) + "</h2><div class=\"ht-grid ht-grid-sm\">" +
      (D.stats.roles || []).map(function (r) {
        return '<div class="ht-card ht-card-static"><b>' + esc(L(r.name)) + "</b><small>" + esc(L(r.focus)) + "</small></div>";
      }).join("") + "</div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.plan_mana")) + "</h2>" +
      '<p class="suave">' + esc(t("ht.stats.plan_sub")) + "</p>" +
      '<div id="s-slots" class="ht-slots"></div>' +
      '<div id="s-out" class="ht-resultado"></div>' + fuentes(["piedras"]) + "</div>";
    $("#main").innerHTML = shell("ht.stats.titulo", "ht.stats.sub", body, null);

    var slotN = 8;
    var html = "";
    for (var i = 0; i < slotN; i++) {
      html += '<div class="ht-form ht-slot-row">' +
        campo(t("ht.stats.hueco") + " " + (i + 1),
          selectHtml("s-stat-" + i, [{ v: "", t: "—" }].concat(keys.map(function (k) {
            return { v: k, t: P.labels[k] ? L(P.labels[k]) : k };
          })), "")) +
        campo(t("ht.col.grado"), selectHtml("s-gr-" + i, [
          { v: "11", t: gradeLabel(11) }, { v: "21", t: gradeLabel(21) },
          { v: "31", t: gradeLabel(31) }, { v: "41", t: gradeLabel(41) }
        ], "31")) +
        "</div>";
    }
    $("#s-slots").innerHTML = html;

    function recalc() {
      var totals = {};
      for (var i = 0; i < slotN; i++) {
        var k = $("#s-stat-" + i).value;
        var g = +$("#s-gr-" + i).value;
        if (!k) continue;
        var row = (P.mana[k] || []).filter(function (p) { return p[1] === g; })[0];
        if (!row) continue;
        totals[k] = (totals[k] || 0) + row[0];
      }
      var keysT = Object.keys(totals);
      if (!keysT.length) {
        $("#s-out").innerHTML = aviso(t("ht.stats.vacio"));
        return;
      }
      $("#s-out").innerHTML = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.odds.stat")) +
        "</th><th>" + esc(t("ht.col.valor")) + "</th></tr></thead><tbody>" +
        keysT.map(function (k) {
          var lab = P.labels[k] ? L(P.labels[k]) : k;
          return "<tr><td>" + esc(lab) + "</td><td><b>" + totals[k] + "</b></td></tr>";
        }).join("") + "</tbody></table>";
    }
    for (var j = 0; j < slotN; j++) {
      $("#s-stat-" + j).addEventListener("change", recalc);
      $("#s-gr-" + j).addEventListener("change", recalc);
    }
    recalc();
  }

  /* ---------- Pantheon ---------- */
  function renderPantheon() {
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.huecos")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.tipo")) + "</th><th>#</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.pantheon.slots || []).map(function (s) {
        return "<tr><td>" + esc(L(s.type)) + "</td><td>" + s.n + "</td><td>" + esc(L(s.feeds)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.roles")) + "</h2><div class=\"ht-grid ht-grid-sm\">" +
      (D.pantheon.gods || []).map(function (g) {
        return '<div class="ht-card ht-card-static"><b>' + esc(g.name) + "</b><small>" +
          esc(L(g.role)) + " · " + esc(L(g.effect)) + "</small></div>";
      }).join("") + "</div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.plan")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.col.tipo"), selectHtml("ph-kind", [
        { v: "Cuadro", t: t("ht.pantheon.cuadro") },
        { v: "Estatua", t: t("ht.pantheon.estatua") },
        { v: "Coloso", t: t("ht.pantheon.coloso") }
      ], "Cuadro")) +
      campo(t("ht.col.grado"), selectHtml("ph-gr", [
        { v: "Raro", t: t("ht.grado.rare") },
        { v: "Legendario", t: t("ht.grado.legendary") },
        { v: "Único", t: t("ht.grado.unique") },
        { v: "Épico", t: t("ht.grado.heroic") },
        { v: "Común", t: t("ht.grado.common") }
      ], "Único")) +
      campo(t("ht.pantheon.cantidad"), numInput("ph-n", 1, ' min="1" max="17"')) +
      '</div><div id="ph-out" class="ht-resultado"></div>' +
      aviso(t("ht.pantheon.nota")) + fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.pantheon.titulo", "ht.pantheon.sub", body, "progression__pantheon-wardrobe-y-titulos-stats-ocultos");

    function recalc() {
      var kindEs = $("#ph-kind").value;
      var grEs = $("#ph-gr").value;
      var n = Math.max(1, +$("#ph-n").value || 1);
      var row = (D.pantheon.grades || []).filter(function (g) {
        return g.kind.es === kindEs && g.grade.es === grEs;
      })[0];
      if (!row) {
        $("#ph-out").innerHTML = aviso(t("ht.pantheon.combo_malo"));
        return;
      }
      var pts = row.lines * row.pts * n;
      $("#ph-out").innerHTML =
        '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.pantheon.lineas")) + "</span><b>" + (row.lines * n) + "</b></div>" +
        "<div><span>" + esc(t("ht.pantheon.pts_pieza")) + "</span><b>" + (row.lines * row.pts) + "</b></div>" +
        "<div><span>" + esc(t("ht.pantheon.pts_total")) + "</span><b>" + pts + "</b></div></div>" +
        "<p class=\"suave\">" + esc(t("ht.pantheon.formula")) + ": " + row.lines + " × " + row.pts + " × " + n + "</p>";
    }
    ["ph-kind", "ph-gr", "ph-n"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalc);
      $("#" + id).addEventListener("input", recalc);
    });
    recalc();
  }

  /* ---------- Arcana ---------- */
  function renderArcana() {
    var checked = {};
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.arcana.piezas")) + "</h2>" +
      '<div id="ar-list" class="ht-check-list"></div>' +
      '<div id="ar-out" class="ht-resultado"></div></div>' +
      '<div class="ht-panel"><h2>' + esc(t("ht.arcana.rareza")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.grado")) + "</th><th>" + esc(t("ht.arcana.skills")) + "</th></tr></thead><tbody>" +
      (D.arcana.rarity || []).map(function (r) {
        return "<tr><td>" + esc(L(r.g)) + "</td><td>" + r.skills + "</td></tr>";
      }).join("") + "</tbody></table>" + aviso(L(D.arcana.note)) + fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.arcana.titulo", "ht.arcana.sub", body, "progression__daevanion-y-arcana-mas-alla-del-techo-de-habilidad");

    var list = $("#ar-list");
    list.innerHTML = (D.arcana.pieces || []).map(function (p) {
      return '<label class="ht-check"><input type="checkbox" data-id="' + p.id + '"> <b>' +
        esc(L(p)) + "</b> <span class=\"suave\">· " + esc(p.from) + " · " + esc(L(p.feeds)) + "</span></label>";
    }).join("");

    function recalc() {
      var n = 0;
      list.querySelectorAll("input").forEach(function (inp) {
        if (inp.checked) n++;
      });
      var tip = n >= 6 ? t("ht.arcana.full") :
        n >= 4 ? t("ht.arcana.set42") :
          n >= 2 ? t("ht.arcana.parcial") : t("ht.arcana.pocas");
      $("#ar-out").innerHTML =
        '<div class="ht-totales"><div><span>' + esc(t("ht.arcana.equipadas")) +
        "</span><b>" + n + " / 6</b></div></div><p>" + esc(tip) + "</p>";
    }
    list.addEventListener("change", recalc);
    recalc();
  }

  /* ---------- Boot ---------- */
  function metaTool(id) {
    document.title = t("ht." + id + ".titulo") + " · Aion 2 Forge AION 2";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("ht." + id + ".desc"));
    var kw = document.querySelector('meta[name="keywords"]');
    if (kw) kw.setAttribute("content", t("ht." + id + ".kw"));
  }

  function renderTool(id) {
    cabecera("herramientas");
    metaTool(id);
    var map = {
      mejora: renderMejora,
      craft: renderCraft,
      odds: renderOdds,
      drops: renderDrops,
      potential: renderPotential,
      stats: renderStats,
      pantheon: renderPantheon,
      arcana: renderArcana
    };
    if (!map[id]) {
      $("#main").innerHTML = '<p class="suave">' + esc(t("ht.no_existe")) +
        ' <a href="herramientas.html">' + esc(t("ht.volver")) + "</a></p>";
      return;
    }
    map[id]();
  }

  window.OC_HERRAMIENTAS = { renderHub: renderHub, renderTool: renderTool, TOOLS: TOOLS };
})();
