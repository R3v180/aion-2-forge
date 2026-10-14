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
  function nombreRaza(f) {
    if (f.raza === "elyos") return t("espia.elyos");
    if (f.raza === "asmodian") return t("espia.asmodian");
    return f.raza_nombre || "";
  }
  function chipRazaFicha(f) {
    var n = nombreRaza(f);
    if (!n) return "";
    return '<span class="chip raza ' + esc(f.raza || "") + '">' + esc(n) + "</span>";
  }
  function botonesJsonNc() {
    return '<button type="button" class="boton" id="pj-json-copiar" title="' + esc(t("juego.json_hint")) + '">' +
      esc(t("juego.json_copiar")) + "</button>" +
      '<button type="button" class="boton" id="pj-json-descargar" title="' + esc(t("juego.json_hint")) + '">' +
      esc(t("juego.json_descargar")) + "</button>";
  }
  function payloadNc() {
    var B = CTX && CTX.B, p = (B && B.personaje) || {};
    var f = JSON.parse(JSON.stringify(p.ficha || {}));
    var porId = {};
    ((CTX.CAT && CTX.CAT.habilidades) || []).forEach(function (h) { porId[String(h.id)] = h; });
    var habs = {}, crudas = f.habilidades || {};
    Object.keys(crudas).forEach(function (id) {
      var h = crudas[id] || {}, info = porId[id] || {};
      habs[id] = {
        nivel: h.nivel,
        equipada: !!h.equipada,
        aprendida: !!h.aprendida,
        cat: h.cat || info.tipo || null,
        nombre: info.nombre ? tr(info.nombre) : null,
        tipo: info.tipo || h.cat || null
      };
    });
    f.habilidades = habs;
    return {
      fuente: "NCSOFT vía EspClown",
      aviso: t("juego.json_aviso"),
      exportado: new Date().toISOString(),
      personaje: {
        nombre: p.nombre || B.nombre || null,
        servidor: p.servidor || null,
        clase: p.clase || (B && B.clase) || null,
        nivel: p.nivel != null ? p.nivel : null,
        poder: p.poder != null ? p.poder : null,
        raza: p.raza || f.raza || null,
        character_id: p.character_id || null,
        server_id: p.server_id != null ? p.server_id : null,
        leido: p.leido || null
      },
      ficha: f
    };
  }
  function textoJsonNc() {
    return JSON.stringify(payloadNc(), null, 2);
  }
  function copiarJsonNc() {
    var txt = textoJsonNc();
    var ok = function () { aviso(t("juego.json_copiado"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(function () { fallbackCopiar(txt); });
    } else fallbackCopiar(txt);
  }
  function fallbackCopiar(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      aviso(t("juego.json_copiado"), "ok");
    } catch (e) {
      aviso(textoError(e) || t("juego.json_error"), "mal");
    }
    document.body.removeChild(ta);
  }
  function descargarJsonNc() {
    var p = (CTX.B && CTX.B.personaje) || {};
    var nombre = String(p.nombre || "personaje").replace(/[^\w\-]+/g, "_").slice(0, 40);
    var blob = new Blob([textoJsonNc()], { type: "application/json;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ncsoft-" + nombre + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    aviso(t("juego.json_descargado"), "ok");
  }
  function ranura(id) {
    var x = RANURA[id];
    return x ? (x[IDIOMA] || x.es) : id;
  }
  function fichaExtraHTML(p, f) {
    f = f || {};
    var filas = [];
    function add(eti, val) {
      if (val === null || val === undefined || val === "") return;
      filas.push('<div class="dato-ficha"><span>' + esc(eti) + "</span><b>" + val + "</b></div>");
    }
    add(t("espia.servidor"), esc(p.servidor || "—"));
    add(t("espia.facción"), esc(nombreRaza(f) || "—"));
    add(t("espia.clase"), esc((f.clase_nc || tr(claseInfo(p.clase)) || "—")));
    add(t("juego.nv"), esc(String(p.nivel || "—")));
    add(t("juego.poder"), esc(poder(p.poder)));
    if (f.nivel_objeto) add(t("espia.nivel_objeto"), esc(String(f.nivel_objeto)));
    add(t("espia.genero"), esc(f.genero_nombre || "—"));
    if (titulo(f)) add(t("espia.titulo_activo"), esc(titulo(f)) + (f.titulo_grado ? ' <small class="suave">(' + esc(f.titulo_grado) + ")</small>" : ""));
    if (f.gremio) add(t("espia.gremio"), esc(f.gremio));
    if (f.region) add(t("espia.region_nc"), esc(f.region));
    add(t("espia.server_id"), esc(String(p.server_id != null ? p.server_id : "—")));
    add(t("espia.pc_id"), esc(String(f.pc_id != null ? f.pc_id : "—")));
    add(t("espia.race_id"), esc(String(f.race_id != null ? f.race_id : "—")));
    if (f.titulo_id) add(t("espia.titulo_id"), esc(String(f.titulo_id)));
    if (p.character_id) add(t("espia.character_id"), '<code class="cid">' + esc(p.character_id) + "</code>");

    var attrs = (f.atributos || []).filter(function (a) { return a && (a.valor || a.valor === 0); });
    var attrsHtml = attrs.length
      ? '<div class="ficha-attrs">' + attrs.map(function (a) {
        return '<div class="attr"><span>' + esc(a.nombre || a.tipo) + "</span><b>" + esc(String(a.valor)) + "</b></div>";
      }).join("") + "</div>"
      : "";

    var dae = f.tableros_dae || [];
    var daeHtml = dae.length
      ? '<div class="ficha-dae">' + dae.map(function (b) {
        var ico = /^https:\/\/assets\.playnccdn\.com\//.test(b.icono || "")
          ? '<img src="' + esc(b.icono) + '" alt="">' : "";
        return '<div class="dae-board' + (b.abierto ? " on" : "") + '">' + ico +
          "<div><b>" + esc(b.nombre) + "</b><small>" + (b.abierto ? esc(t("espia.tablero_abierto")) : esc(t("espia.tablero_cerrado"))) +
          " · " + b.nodos + "/" + b.total + " (" + b.porcentaje + "%)</small></div></div>";
      }).join("") + "</div>"
      : "";

    var tit = f.titulos || {};
    var listaTit = tit.lista || [];
    var titHtml = "";
    if (tit.poseidos || listaTit.length) {
      titHtml = '<p class="suave">' + esc(re(t("espia.titulos_cuenta"), { n: tit.poseidos || listaTit.length, total: tit.total || "—" })) + "</p>";
      if (listaTit.length) {
        titHtml += '<details class="ficha-titulos"><summary>' + esc(t("espia.ver_titulos")) + " (" + listaTit.length + ")</summary>" +
          '<div class="titulos-lista">' + listaTit.map(function (x) {
            return '<div class="titulo-item"><div class="ti-top"><b>' + esc(x.nombre) + "</b>" +
              (x.grado ? '<span class="chip">' + esc(x.grado) + "</span>" : "") +
              (x.categoria ? '<span class="chip">' + esc(x.categoria) + "</span>" : "") + "</div>" +
              (x.efectos && x.efectos.length ? "<small>" + x.efectos.map(esc).join(" · ") + "</small>" : "") +
              ((x.poseidos_mundo || x.total_mundo)
                ? '<small class="suave">' + esc(re(t("espia.titulo_rareza"), { n: x.poseidos_mundo || 0, total: x.total_mundo || 0, p: x.porcentaje || 0 })) + "</small>"
                : "") + "</div>";
          }).join("") + "</div></details>";
      }
    }

    var rank = f.ranking || [];
    var rankHtml = rank.length
      ? '<div class="ficha-rank">' + rank.map(function (r) {
        return '<div class="dato-ficha"><span>' + esc(r.nombre || "—") + "</span><b>#" + esc(String(r.puesto != null ? r.puesto : "—")) +
          (r.valor != null ? " · " + esc(String(r.valor)) : "") + "</b></div>";
      }).join("") + "</div>"
      : "";

    return '<section class="panel ficha-extra">' +
      '<h3>' + esc(t("espia.ficha_titulo")) + "</h3>" +
      '<div class="datos-ficha">' + filas.join("") + "</div>" +
      (attrsHtml ? "<h4>" + esc(t("espia.atributos")) + "</h4>" + attrsHtml : "") +
      (daeHtml ? "<h4>" + esc(t("espia.tableros")) + "</h4>" + daeHtml : "") +
      (titHtml ? "<h4>" + esc(t("espia.titulos")) + "</h4>" + titHtml : "") +
      (rankHtml ? "<h4>" + esc(t("espia.ranking")) + "</h4>" + rankHtml : "") +
      "</section>";
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
    var ver = p && p.id ? '<a class="boton" href="build.html?pj=' + p.id + '">' + esc(t("juego.ver")) + "</a>" : "";
    var comparar = '<button class="boton oro" id="pj-comparar">' + esc(t("juego.comparar")) + "</button>";
    var jsonNc = botonesJsonNc();
    var botones;
    if (B.espia) {
      botones = comparar + jsonNc + '<a class="boton" href="espia.html">' + esc(t("espia.otro")) + "</a>";
    } else if (B.juego) {
      botones = comparar + jsonNc + (duena
        ? '<button class="boton" id="pj-refrescar">' + esc(t("juego.refrescar")) + "</button>" +
          '<button class="boton" id="pj-nueva">' + esc(t("juego.nueva")) + "</button>"
        : "");
    } else if (B.propia) {
      botones = comparar + jsonNc + ver +
        '<button class="boton" id="pj-refrescar">' + esc(t("juego.refrescar")) + "</button>" +
        '<button class="boton" id="pj-nueva">' + esc(t("juego.nueva")) + "</button>" +
        (p ? '<button class="enlace" id="pj-desvincular">' + esc(t("juego.desvincular")) + "</button>" : "");
    } else {
      botones = comparar + jsonNc + ver;
    }
    var publica = duena
      ? '<label class="interruptor vinculo-publica"><input type="checkbox" id="pj-publico"' + (p.publica_equipo ? " checked" : "") +
        "><span class=\"pista\"></span>" + esc(t("juego.mostrar")) + "</label>"
      : "";
    var equipo = B.juego ? equipoHTML(f) : "";
    var extra = (B.juego || B.espia) ? fichaExtraHTML(p, f) : "";
    if (B.espia) {
      var claseNom = f.clase_nc || tr(claseInfo(p.clase)) || "—";
      var titAct = titulo(f);
      var razaNom = nombreRaza(f);
      var fotoGrande = urlOk(f.imagen)
        ? '<img class="espia-heroe-foto" src="' + esc(f.imagen) + '" alt="">'
        : '<div class="espia-heroe-foto vacia"></div>';
      var metaBits = [claseNom, razaNom, f.genero_nombre, f.gremio].filter(Boolean);
      var daeTop = (f.tableros_dae || []).filter(function (b) { return b && b.abierto; })
        .sort(function (a, b) { return (b.porcentaje || 0) - (a.porcentaje || 0); })[0];
      var barra = [
        '<div><span>' + esc(t("espia.clase")) + "</span><b>" + esc(claseNom) + "</b></div>",
        '<div><span>' + esc(t("espia.facción")) + "</span><b>" + esc(razaNom || "—") + "</b></div>",
        '<div><span>' + esc(t("juego.nv")) + "</span><b>" + esc(String(p.nivel || "—")) + "</b></div>",
        '<div><span>' + esc(t("juego.poder")) + "</span><b>" + esc(poder(p.poder)) + "</b></div>"
      ];
      if (f.nivel_objeto) barra.push('<div><span>' + esc(t("espia.ilvl")) + "</span><b>" + esc(String(f.nivel_objeto)) + "</b></div>");
      if (daeTop) {
        barra.push('<div class="con-barra"><span>' + esc(daeTop.nombre) + "</span><b>" +
          daeTop.nodos + "/" + daeTop.total + " · " + daeTop.porcentaje + "%</b>" +
          '<i style="--p:' + Math.max(0, Math.min(100, daeTop.porcentaje || 0)) + '%"></i></div>');
      }
      hueco.innerHTML =
        '<section class="espia-heroe raza-' + esc(f.raza || p.raza || "x") + '">' +
        '<img class="arte" src="icons/clases/' + esc(p.clase || B.clase) + '-arte.webp" alt="" onerror="this.remove()">' +
        '<div class="espia-heroe-in">' +
        '<div class="espia-heroe-izq">' + fotoGrande +
        '<img class="espia-heroe-emb" src="icons/clases/' + esc(p.clase || B.clase) + '.webp" alt="">' +
        "</div>" +
        '<div class="espia-heroe-txt">' +
        '<div class="vinculo-chips"><span class="chip juego">' + esc(t("espia.chip")) + "</span>" +
        chipRazaFicha(f) +
        (f.genero_nombre ? '<span class="chip">' + esc(f.genero_nombre) + "</span>" : "") +
        (f.gremio ? '<span class="chip">' + esc(f.gremio) + "</span>" : "") + "</div>" +
        "<h1>" + esc(p.nombre) + "</h1>" +
        '<div class="espia-heroe-server">' + esc(p.servidor || "—") + "</div>" +
        (metaBits.length ? '<p class="espia-heroe-meta">' + esc(metaBits.join(" · ")) + "</p>" : "") +
        (titAct ? '<p class="espia-heroe-titulo">' + esc(titAct) +
          (f.titulo_grado ? ' <small>(' + esc(f.titulo_grado) + ")</small>" : "") + "</p>" : "") +
        '<div class="botones">' + botones + "</div>" +
        '<div class="pj-leido" id="pj-leido"><small class="suave">' + esc(t("juego.leido")) + " " +
        (p.leido ? new Date(p.leido).toLocaleString(IDIOMA === "es" ? "es-ES" : "en-GB") : "") + "</small></div>" +
        "</div>" +
        '<div class="espia-heroe-aside">' +
        '<div class="espia-kpi"><span>' + esc(t("juego.poder")) + "</span><b>" + esc(poder(p.poder)) + "</b></div>" +
        (f.nivel_objeto ? '<div class="espia-kpi"><span>' + esc(t("espia.ilvl")) + "</span><b>" + esc(String(f.nivel_objeto)) + "</b></div>" : "") +
        '<div class="espia-kpi"><span>' + esc(t("juego.nv")) + "</span><b>" + esc(String(p.nivel || "—")) + "</b></div>" +
        "</div></div>" +
        '<div class="espia-heroe-barra">' + barra.join("") + "</div>" +
        "</section>" +
        extra +
        (equipo ? '<section class="panel equipo-juego">' + equipo + "</section>" : "");
      return;
    }
    hueco.innerHTML = '<section class="vinculo' + (B.juego ? " en-juego" : "") + " raza-" + esc(f.raza || p.raza || "x") + '">' + foto +
      '<div class="txt"><span class="antetitulo">' + esc(t("juego.en_juego")) + " · " + esc(p.servidor) + "</span>" +
      '<div class="vinculo-chips">' + chipRazaFicha(f) +
      (f.genero_nombre ? '<span class="chip">' + esc(f.genero_nombre) + "</span>" : "") + "</div>" +
      "<h2>" + esc(p.nombre) + "</h2>" +
      "<p><b class=\"srv\">" + esc(p.servidor || "—") + "</b> · " + esc(f.clase_nc || tr(claseInfo(p.clase))) +
      " · " + esc(t("juego.nv")) + " " + (p.nivel || "—") + " · " + esc(t("juego.poder")) + " <b>" + poder(p.poder) + "</b>" +
      (f.nivel_objeto ? " · " + esc(t("espia.ilvl")) + " " + f.nivel_objeto : "") +
      (f.gremio ? " · " + esc(f.gremio) : "") + (titulo(f) ? " · " + esc(titulo(f)) : "") + "</p>" +
      '<div class="pj-leido" id="pj-leido"><small class="suave">' + esc(t("juego.leido")) + " " + (p.leido ? new Date(p.leido).toLocaleString(IDIOMA === "es" ? "es-ES" : "en-GB") : "") + "</small></div>" +
      '<div class="botones">' + botones + "</div>" + publica + "</div></section>" +
      extra +
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
      confirmar({
        titulo: t("juego.refrescar_titulo"),
        texto: t("juego.refrescar_conf"),
        hint: t("juego.actualizar_hint"),
        ok: t("juego.actualizar_si"),
        cancel: t("juego.cerrar"),
        onOk: function (ui) {
          ui.cerrar();
          lanzarRefresco(CTX.B.personaje.id);
        }
      });
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
    else if (id === "pj-json-copiar") copiarJsonNc();
    else if (id === "pj-json-descargar") descargarJsonNc();
  }

  document.addEventListener("click", alClick);
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "pj-form" && e.target.id !== "pj-cmp-form") return;
    e.preventDefault();
    var cmp = e.target.id === "pj-cmp-form";
    var q = $(cmp ? "#pj-cmp-q" : "#pj-q").value.trim(), estado = $(cmp ? "#pj-cmp-estado" : "#pj-estado"), caja = $(cmp ? "#pj-cmp-res" : "#pj-resultados");
    estado.textContent = t("juego.buscando");
    caja.innerHTML = "";
    api("GET", "/api/juego/buscar?q=" + encodeURIComponent(q)).then(function (data) {
      var lista = Array.isArray(data) ? data : (data.lista || []);
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

  function confirmar(opts) {
    var prev = $("#velo-dialogo");
    if (prev) prev.remove();
    var velo = document.createElement("div");
    velo.className = "velo dialogo-velo";
    velo.id = "velo-dialogo";
    velo.innerHTML =
      '<div class="panel dialogo-caja" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">' +
        '<span class="dialogo-marca"></span>' +
        '<h3 id="dlg-titulo">' + esc(opts.titulo || "") + "</h3>" +
        '<p class="dialogo-txt">' + esc(opts.texto || "") + "</p>" +
        (opts.hint ? '<p class="dialogo-hint">' + esc(opts.hint) + "</p>" : "") +
        '<div class="dialogo-acciones">' +
          '<button type="button" class="boton" id="dlg-no">' + esc(opts.cancel || t("juego.cerrar")) + "</button>" +
          '<button type="button" class="boton oro" id="dlg-si">' + esc(opts.ok || "OK") + "</button>" +
        "</div>" +
      "</div>";
    document.body.appendChild(velo);
    var caja = velo.querySelector(".dialogo-caja");
    var btnSi = $("#dlg-si"), btnNo = $("#dlg-no");
    function cerrar() { if (velo.parentNode) velo.remove(); }
    function ui() { return { cerrar: cerrar }; }
    btnNo.addEventListener("click", function () {
      cerrar();
      if (opts.onCancel) opts.onCancel();
    });
    btnSi.addEventListener("click", function () {
      if (!opts.onOk) { cerrar(); return; }
      opts.onOk(ui());
    });
    velo.addEventListener("click", function (e) {
      if (e.target === velo) {
        cerrar();
        if (opts.onCancel) opts.onCancel();
      }
    });
    setTimeout(function () { btnSi.focus(); }, 30);
  }

  var refrescoActivo = null;

  function faseRefresco(ms) {
    if (ms < 8000) return t("juego.prog_1");
    if (ms < 20000) return t("juego.prog_2");
    if (ms < 38000) return t("juego.prog_3");
    return t("juego.prog_4");
  }

  function pintarProgreso(pct, msg, mal) {
    var caja = $("#pj-leido");
    if (!caja) return;
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    caja.innerHTML =
      '<div class="pj-progreso' + (mal ? " mal" : "") + '" id="pj-progreso" role="status" aria-live="polite">' +
        '<div class="pj-progreso-top">' +
          '<span class="pj-progreso-txt">' + esc(msg || t("juego.actualizando")) + "</span>" +
          '<b class="pj-progreso-pct">' + pct + "%</b>" +
        "</div>" +
        '<div class="pj-progreso-barra"><i style="width:' + pct + '%"></i></div>' +
      "</div>";
  }

  function lanzarRefresco(pid) {
    if (refrescoActivo || !pid) return;
    var btn = $("#pj-refrescar");
    if (btn) {
      btn.disabled = true;
      btn.classList.add("en-curso");
      btn.textContent = t("juego.actualizando_corto");
    }
    var inicio = Date.now(), pct = 0, timer;
    pintarProgreso(2, faseRefresco(0));
    timer = setInterval(function () {
      var ms = Date.now() - inicio;
      // Sube rápido al principio y se frena ~92% hasta que responda el servidor
      var meta = 92 * (1 - Math.exp(-ms / 18000));
      if (meta > pct) pct = meta;
      pintarProgreso(pct, faseRefresco(ms));
    }, 180);
    refrescoActivo = api("POST", "/api/personajes/" + pid + "/refrescar", {})
      .then(function () {
        clearInterval(timer);
        pintarProgreso(100, t("juego.prog_ok"));
        setTimeout(function () { location.reload(); }, 450);
      })
      .catch(function (er) {
        clearInterval(timer);
        refrescoActivo = null;
        pintarProgreso(pct, textoError(er), true);
        if (btn) {
          btn.disabled = false;
          btn.classList.remove("en-curso");
          btn.textContent = t("juego.refrescar");
        }
      });
  }

  var DIA_MS = 24 * 60 * 60 * 1000;

  function clavePregunta(pid) { return "aion2-ask-refresh-" + pid; }

  function yaPreguntadoReciente(pid) {
    try {
      var t0 = Number(localStorage.getItem(clavePregunta(pid)) || 0);
      return t0 > 0 && (Date.now() - t0) < DIA_MS;
    } catch (e) { return false; }
  }

  function marcarPreguntado(pid) {
    try { localStorage.setItem(clavePregunta(pid), String(Date.now())); } catch (e) {}
  }

  function fichaFresca(p) {
    if (!p || !p.leido) return false;
    var age = Date.now() - new Date(p.leido).getTime();
    return !isNaN(age) && age >= 0 && age < DIA_MS;
  }

  function preguntarActualizar() {
    var B = CTX && CTX.B, p = B && B.personaje;
    if (!B || !B.juego || !p || !p.propio || !p.id) return;
    if (param("preguntar") !== "1") return;
    try {
      var u = new URL(location.href);
      u.searchParams.delete("preguntar");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) {}
    // Si la caché tiene < 24 h, o ya preguntamos hoy, no molestar (el botón manual sigue)
    if (fichaFresca(p) || yaPreguntadoReciente(p.id)) return;
    marcarPreguntado(p.id);
    var cuando = p.leido
      ? new Date(p.leido).toLocaleString(IDIOMA === "es" ? "es-ES" : "en-GB")
      : "—";
    confirmar({
      titulo: t("juego.actualizar_titulo"),
      texto: re(t("juego.actualizar_preg"), { cuando: cuando }),
      hint: t("juego.actualizar_hint"),
      ok: t("juego.actualizar_si"),
      cancel: t("juego.actualizar_no"),
      onOk: function (ui) {
        ui.cerrar();
        lanzarRefresco(p.id);
      }
    });
  }

  return {
    montar: function (ctx) {
      CTX = ctx;
      pintar();
      setTimeout(preguntarActualizar, 80);
    }
  };
})();
