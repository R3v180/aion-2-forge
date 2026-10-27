// Ver y editar una build. ?id=N  (&editar=1 para abrir en modo edición si es tuya)
(function () {
  var main = $("#main");
  var B, CAT, BARRA, DAE, editando = false, sucio = false, verTodas = false, BONUS = {}, ARMOR = {};
  var PESTANAS = ["habilidades", "barra", "daevanion", "equipo"], EQUIPO;

  cabecera(param("cid") ? "espia" : "builds").then(function () {
    var id = param("id"), pj = param("pj"), cid = param("cid"), server = param("server");
    if (!id && !pj && !(cid && server)) return noExiste();
    var esEspia = !!(cid && server);
    if (esEspia) pantallaCargaEspia();
    var ruta = esEspia
      ? "/api/juego/vista?cid=" + encodeURIComponent(cid) + "&server=" + encodeURIComponent(server)
      : (pj ? "/api/personajes/" + encodeURIComponent(pj) + "/build" : "/api/builds/" + encodeURIComponent(id));
    api("GET", ruta).then(function (b) {
      B = b;
      B.datos.habilidades = B.datos.habilidades || {};
      editando = B.propia && param("editar") === "1";
      verTodas = editando;
      if (esEspia) actualizarCargaEspia(t("espia.carga_catalogo"));
      return Promise.all([cargarCatalogo(B.clase), cargarEstadisticas().catch(function () { return null; })]);
    }).then(function (r) {
      CAT = r[0];
      pararCargaEspia();
      pintar();
    }).catch(function (e) {
      pararCargaEspia();
      if (esEspia) return errorEspia(e);
      noExiste();
    });
  });

  var _cargaTimer = null;
  function pantallaCargaEspia() {
    var pasos = ["espia.carga_1", "espia.carga_2", "espia.carga_3", "espia.carga_4"];
    var i = 0;
    main.innerHTML = '<section class="espia-carga" id="espia-carga" aria-live="polite" aria-busy="true">' +
      '<div class="espia-carga-caja">' +
      '<div class="espia-spinner" aria-hidden="true"></div>' +
      '<span class="antetitulo">' + esc(t("espia.antetitulo")) + "</span>" +
      "<h1>" + esc(t("espia.carga_titulo")) + "</h1>" +
      '<p class="espia-carga-msg" id="espia-carga-msg">' + esc(t(pasos[0])) + "</p>" +
      '<p class="suave">' + esc(t("espia.carga_hint")) + "</p>" +
      '<a class="enlace" href="espia.html">' + esc(t("espia.otro")) + "</a>" +
      "</div></section>";
    clearInterval(_cargaTimer);
    _cargaTimer = setInterval(function () {
      i = (i + 1) % pasos.length;
      var el = $("#espia-carga-msg");
      if (el) el.textContent = t(pasos[i]);
    }, 3200);
  }
  function actualizarCargaEspia(texto) {
    var el = $("#espia-carga-msg");
    if (el) el.textContent = texto;
  }
  function pararCargaEspia() {
    clearInterval(_cargaTimer);
    _cargaTimer = null;
  }
  function errorEspia(e) {
    var msg = textoError(e);
    main.innerHTML = '<section class="espia-carga">' +
      '<div class="espia-carga-caja error">' +
      "<h1>" + esc(t("espia.carga_error")) + "</h1>" +
      "<p>" + esc(msg) + "</p>" +
      '<p class="suave">' + esc(t("espia.carga_error_hint")) + "</p>" +
      '<div class="botones">' +
      '<button type="button" class="boton oro" id="espia-reintentar">' + esc(t("espia.reintentar")) + "</button>" +
      '<a class="boton" href="espia.html">' + esc(t("espia.otro")) + "</a>" +
      "</div></div></section>";
    var btn = $("#espia-reintentar");
    if (btn) btn.addEventListener("click", function () { location.reload(); });
  }

  function noExiste() { main.innerHTML = '<div class="vacio-lista">' + esc(t("build.no_existe")) + "</div>"; }

  function estado(id) { return B.datos.habilidades[id] || { nivel: 0, esp: [] }; }
  function nivelPj() {
    var n = (B.datos && B.datos.nivel_pj) || (B.personaje && B.personaje.nivel);
    return parseInt(n, 10) || 0;
  }
  function fijar(id, st) {
    if (!st.nivel && !st.esp.length) delete B.datos.habilidades[id];
    else B.datos.habilidades[id] = st;
    marcarSucio();
  }
  function marcarSucio() {
    sucio = true;
    var e = $("#estado-guardar");
    if (e) { e.textContent = t("build.cambios"); e.className = "estado sucio"; }
  }

  function mapaArmor() {
    if (!(B.espia || B.juego)) return {};
    var f = (B.personaje && B.personaje.ficha) || {}, m = {}, src = f.bonus_equipo || {};
    Object.keys(src).forEach(function (id) {
      var n = parseInt(src[id], 10) || 0;
      if (n) m[String(id)] = n;
    });
    if (!Object.keys(m).length) {
      (f.equipo || []).forEach(function (p) {
        (p.habilidades || []).forEach(function (h) {
          var n = parseInt(h && h.nivel, 10) || 0;
          if (h && h.id && n) m[String(h.id)] = (m[String(h.id)] || 0) + n;
        });
      });
    }
    return m;
  }
  function origen(id, nivel) {
    var dae = nivel ? (BONUS[id] || 0) : 0, arm = nivel ? (ARMOR[id] || 0) : 0;
    return { dae: dae, arm: arm, total: nivel + dae + arm };
  }
  function htmlOrigen(nivel, o) {
    if (!nivel || !(B.espia || B.juego) || (!o.dae && !o.arm)) return "";
    var tit = re(t("build.origen_tit"), { total: o.total, hab: nivel, dae: o.dae, arm: o.arm });
    function parte(n, clave, cls) {
      return '<span class="' + cls + (n ? "" : " origen-cero") + '">+' + n + " " + esc(t(clave)) + "</span>";
    }
    return '<span class="nv origen" title="' + esc(tit) + '"><b>' + nivel + "</b> " + esc(t("build.origen_hab")) +
      " " + parte(o.dae, "build.origen_dae", "extra-dae") + " " + parte(o.arm, "build.origen_arm", "extra-arm") + "</span>";
  }

  // ---------- tarjeta de habilidad ----------
  function tarjeta(h) {
    var st = estado(h.id), nivel = st.nivel || 0, o = origen(h.id, nivel), extra = o.dae, total = o.total;
    var chipExtra = extra ? ' <small class="extra-dae" title="' + esc(re(t("build.extra_tit"), { total: total, base: nivel, extra: extra })) + '">' +
      nivel + " +" + extra + "</small>" : "";
    var origenHtml = htmlOrigen(nivel, o);
    var cab = '<div class="linea"><span class="nombre">' + esc(tr(h.nombre)) + "</span>" +
      (editando
        ? '<span class="nv">' + (nivel ? esc(t("build.nivel")) + " " + total : esc(t("build.sin_aprender"))) + "</span>" +
          controlNivel(h) + (extra ? '<small class="extra-dae" title="' + esc(re(t("build.extra_tit"), { total: total, base: nivel, extra: extra })) + '">+' + extra + "</small>" : "")
        : (origenHtml || ('<span class="nv">' + (nivel ? esc(t("build.nivel")) + " " + total + chipExtra : esc(t("build.sin_aprender"))) + "</span>"))) + "</div>";
    var deNc = !!(B.espia || B.juego);
    var esp = "";
    if (h.tipo === "activa" && h.esp.length && !deNc) {
      var hu = huecosActiva(total);
      esp = '<div class="huecos">' + esc(t("build.esp")) + ": <b>" + st.esp.length + "/" + hu + "</b> " + esc(t("build.huecos")) + "</div>" +
        '<div class="esp-lista">' + h.esp.map(function (e) {
          var on = st.esp.indexOf(e.n) >= 0, bloq = (e.nivel || 99) > total;
          if (!editando && !on) return "";
          return '<div class="esp' + (on ? " on" : "") + (bloq ? " bloq" : "") + '" data-esp="' + e.n + '" data-hab="' + h.id + '"><span class="lv">' + (e.nivel || "") + "</span><span>" + esc(tr(e.texto)) + "</span></div>";
        }).join("") + "</div>";
    } else if (h.tipo === "estigma" && h.esp.length && (nivel || editando)) {
      esp = '<div class="esp-lista">' + h.esp.map(function (e) {
        var on = (e.nivel || 99) <= total;
        return '<div class="esp' + (on ? " on" : " bloq") + '"><span class="lv">' + (e.nivel || "") + "</span><span>" + esc(tr(e.texto)) + "</span></div>";
      }).join("") + "</div>";
    }
    var tipEsp = (deNc && h.tipo === "activa") ? null : st.esp;
    return '<div class="hab' + (nivel ? "" : " apagada") + '" id="hab-' + h.id + '">' + iconoHab(h, ' data-tip="' + esc(tipHabilidad(h, total || nivel, tipEsp)) + '"') +
      '<div class="cuerpo">' + cab + '<div class="desc">' + descripcion(h, total || 1) + "</div>" + esp + "</div></div>";
  }
  function re(txt, mapa) {
    return String(txt).replace(/\{(\w+)\}/g, function (_, k) { return mapa[k] == null ? "" : mapa[k]; });
  }
  function controlNivel(h) {
    var id = h.id, nivel = estado(id).nivel || 0, tope = topeHabilidad(h, nivelPj());
    var req = reqSiguiente(h, nivel);
    var bloqMas = nivel >= tope;
    var titMas = bloqMas
      ? (req && nivelPj() && req > nivelPj() ? re(t("build.tope_pj"), { n: req }) : re(t("build.tope_puntos"), { n: topePuntos(h) }))
      : "";
    return '<span class="nivel-ctrl"><button type="button" data-mas="-1" data-hab="' + id + '"' + (nivel <= 0 ? " disabled" : "") +
      ">−</button><input type=\"number\" min=\"0\" max=\"" + tope + '" value="' + nivel + '" data-nivel="' + id +
      '" title="' + esc(re(t("build.tope_puntos"), { n: topePuntos(h) })) + '"><button type="button" data-mas="1" data-hab="' + id + '"' +
      (bloqMas ? " disabled" : "") + (titMas ? ' title="' + esc(titMas) + '"' : "") + ">+</button></span>";
  }

  function grupo(tipo) {
    var lista = CAT.habilidades.filter(function (h) { return h.tipo === tipo; });
    var aprendidas = lista.filter(function (h) { return estado(h.id).nivel > 0; });
    var mostrar = verTodas ? lista : aprendidas;
    if (!mostrar.length) return "";
    mostrar = mostrar.slice().sort(function (a, b) { return (estado(b.id).nivel || 0) - (estado(a.id).nivel || 0); });
    return '<section class="grupo-hab"><h2>' + esc(t("tipo." + tipo)) + " <small>" + aprendidas.length + "/" + lista.length + "</small></h2>" +
      (tipo === "estigma" ? '<p class="suave" style="margin:-6px 0 10px;font-size:13px">' + esc(t("build.auto")) + " " + esc(t("build.tope_est")) + "</p>" :
        (editando && tipo === "activa" ? '<p class="suave" style="margin:-6px 0 10px;font-size:13px">' + esc(t("build.tope_hab")) + "</p>" :
          ((B.espia || B.juego) && tipo === "activa" ? '<p class="suave" style="margin:-6px 0 10px;font-size:13px">' + esc(t("espia.sin_esp")) + "</p>" : ""))) +
      '<div class="lista-hab">' + mostrar.map(tarjeta).join("") + "</div></section>";
  }

  function resumenPuntos() {
    var hab = 0, est = 0;
    CAT.habilidades.forEach(function (h) {
      var p = puntosGastados(h, estado(h.id).nivel || 0);
      hab += p[0]; est += p[1];
    });
    var extra = 0, arm = 0;
    Object.keys(BONUS).forEach(function (id) { if ((estado(id).nivel || 0) > 0) extra += BONUS[id]; });
    Object.keys(ARMOR).forEach(function (id) { if ((estado(id).nivel || 0) > 0) arm += ARMOR[id]; });
    return '<div class="panel resumen-puntos"><div class="fila"><span>' + esc(t("build.puntos_hab")) + "</span><b>" + hab + '</b></div>' +
      '<div class="fila"><span>' + esc(t("build.puntos_est")) + "</span><b>" + est + "</b></div>" +
      (extra ? '<div class="fila"><span>' + esc(t("build.extra_dae")) + (DAE && DAE.nombrePreset() ? " <small class=\"suave\">(" + esc(DAE.nombrePreset()) + ")</small>" : "") +
        '</span><b class="extra-dae">+' + extra + "</b></div>" : "") +
      (arm ? '<div class="fila"><span>' + esc(t("build.extra_arm")) + '</span><b class="extra-arm">+' + arm + "</b></div>" : "") +
      (B.datos.nivel_pj ? '<div class="fila"><span>' + esc(t("build.nivel_pj")) + "</span><b>" + B.datos.nivel_pj + "</b></div>" : "") + "</div>";
  }

  // ---------- página ----------
  function acotarHabilidades() {
    if (!CAT) return;
    CAT.habilidades.forEach(function (h) {
      var n = estado(h.id).nivel || 0, tope = topeHabilidad(h, nivelPj());
      if (n <= tope) return;
      var vis = tope ? origen(h.id, tope).total : 0;
      var esp = (estado(h.id).esp || []).filter(function (x) {
        return espDisponibles(h, vis).some(function (e) { return e.n === x; });
      }).slice(0, huecosActiva(vis));
      if (tope || esp.length) B.datos.habilidades[h.id] = { nivel: tope, esp: h.tipo === "activa" ? esp : [] };
      else delete B.datos.habilidades[h.id];
    });
  }

  function pintar() {
    ARMOR = mapaArmor();
    acotarHabilidades();
    var c = claseInfo(B.clase);
    var seoTitulo = B.nombre + " · Aion 2 Forge AION 2";
    var seoDesc = "";
    if (B.espia || B.juego) {
      var pj = B.personaje || {};
      seoTitulo = (pj.nombre || B.nombre) + (IDIOMA === "en"
        ? " · AION 2 Spy / Top · Aion 2 Forge"
        : " · Espía / Top AION 2 · Aion 2 Forge");
      seoDesc = IDIOMA === "en"
        ? ("AION 2 profile " + (pj.nombre || B.nombre) + (pj.servidor ? " on " + pj.servidor : "") + ". Spy build and community tops.")
        : ("Ficha AION 2 de " + (pj.nombre || B.nombre) + (pj.servidor ? " en " + pj.servidor : "") + ". Espía Builds y tops de la comunidad.");
    } else if (B.fuente && String(B.fuente).indexOf("top:") === 0) {
      seoTitulo = B.nombre + (IDIOMA === "en" ? " · Weekly AION 2 top · Aion 2 Forge" : " · Top semanal AION 2 · Aion 2 Forge");
      seoDesc = IDIOMA === "en"
        ? ("Weekly community top snapshot for " + B.nombre + ".")
        : ("Instantánea del top semanal de " + B.nombre + ".");
    } else {
      seoDesc = IDIOMA === "en"
        ? ("AION 2 build «" + B.nombre + "» by " + (B.autor || "") + ".")
        : ("Build AION 2 «" + B.nombre + "» por " + (B.autor || "") + ".");
    }
    try {
      seoSocial({
        titulo: seoTitulo,
        descripcion: seoDesc,
        keywords: [B.nombre, (B.personaje && B.personaje.nombre), B.clase, B.autor, "AION 2", "Aion 2 Forge"].filter(Boolean).join(", "),
        robots: (B.publica || B.espia || B.juego) ? "index,follow" : "noindex,nofollow"
      });
    } catch (e) { document.title = seoTitulo; }
    var botones = "";
    if (B.propia) {
      botones += editando ? '<a class="boton" href="build.html?id=' + B.id + '">' + esc(t("build.ver")) + "</a>" :
        '<a class="boton oro" href="build.html?id=' + B.id + '&editar=1">' + esc(t("build.editar")) + "</a>";
    }
    if (YO && !B.propia && !B.juego) botones += '<button class="boton" id="copiar">' + esc(t("build.copiar")) + "</button>";
    if (ESCAPARATE && !B.juego) botones += '<a class="boton oro" href="' + enPrincipal("build.html?id=" + B.id) + '">' + esc(t("build.abrir_principal")) + "</a>";
    if (B.publica) botones += '<button class="boton" id="compartir">' + esc(t("build.compartir")) + "</button>";
    if (B.top && B.top.character_id) {
      botones += '<a class="boton" href="build.html?cid=' + encodeURIComponent(B.top.character_id) +
        '&server=' + encodeURIComponent(B.top.server_id) + '">' + esc(t("build.ver_espia")) + "</a>";
    }

    var chipVis = B.espia ? '<span class="chip juego">' + esc(t("espia.chip")) + "</span>" :
      (B.juego ? '<span class="chip juego">' + esc(t("build.en_juego")) + "</span>" :
        '<span class="chip ' + (B.publica ? "publica" : "") + '" id="chip-vis">' + esc(t(B.publica ? "build.publica" : "build.privada")) + "</span>");
    var rankTop = B.top && B.top.rank;
    var medalla = rankTop === 1 ? "🏆" : (rankTop === 2 ? "🥈" : (rankTop ? "🏅" : "🏆"));
    if (B.fuente && String(B.fuente).indexOf("top:live:") === 0) chipVis += '<span class="chip top">' + medalla + " " + esc(t("builds.top_semana")) + "</span>";
    else if (B.fuente && String(B.fuente).indexOf("top:") === 0) chipVis += '<span class="chip top ex">' + medalla + " " + esc(t("builds.ex_top")) + "</span>";
    else if (B.fuente) chipVis += '<span class="chip referencia">' + esc(t("builds.referencia")) + "</span>";
    var esTop = !!(B.fuente && String(B.fuente).indexOf("top:") === 0);
    if (esTop && B.top && B.top.nombre) B.nombre = B.top.nombre;
    var togPub = "";
    if (B.propia && !B.juego && !B.espia) {
      togPub = '<div class="caja-publicar' + (B.publica ? " on" : "") + '">' +
        '<label class="interruptor build-pub-rapida" title="' + esc(t("build.publicar_hint")) + '">' +
        '<input type="checkbox" id="tog-publica"' + (B.publica ? " checked" : "") + ">" +
        '<span class="pista"></span><span><b>' + esc(t(B.publica ? "build.ya_publica" : "build.publicar")) +
        "</b></span></label>" +
        '<small class="suave build-pub-hint">' + esc(t("build.publicar_hint")) + "</small></div>";
    }
    var votosHtml = "";
    if (B.publica && !B.juego && !B.espia && B.id) {
      var mv = B.mi_voto || 0;
      votosHtml = '<div class="votos-build" id="votos-build">' +
        '<span class="votos-etiq">' + esc(t("build.vota")) + "</span>" +
        '<button type="button" class="voto like' + (mv === 1 ? " on" : "") + '" data-voto="1" ' +
        (B.propia ? "disabled " : "") + 'title="' + esc(t("build.like")) + '" aria-label="' + esc(t("build.like")) + '">' +
        '<span class="voto-ico" aria-hidden="true">👍</span> <span id="n-likes">' + (B.likes || 0) + "</span></button>" +
        '<button type="button" class="voto dislike' + (mv === -1 ? " on" : "") + '" data-voto="-1" ' +
        (B.propia ? "disabled " : "") + 'title="' + esc(t("build.dislike")) + '" aria-label="' + esc(t("build.dislike")) + '">' +
        '<span class="voto-ico" aria-hidden="true">👎</span> <span id="n-dislikes">' + (B.dislikes || 0) + "</span></button>" +
        (B.propia ? '<small class="suave">' + esc(t("build.voto_propia")) + "</small>" :
          (!YO ? '<a class="suave" href="entrar.html?volver=' + encodeURIComponent("build.html?id=" + B.id) + '">' + esc(t("build.voto_entrar")) + "</a>" : "")) +
        "</div>";
    }
    // Espía y ficha ?pj=: el héroe lo pinta juego.js (foto PJ). Build normal: banner + hueco.
    var arteBan = (typeof arteBuild === "function") ? arteBuild(B) : { src: "icons/clases/" + B.clase + "-arte.webp", foto: false };
    var h = (B.espia || B.juego) ? '<div id="hueco-juego"></div>' :
      ('<section class="banner"><img class="arte' + (arteBan.foto ? " foto-pj" : "") + '" src="' + esc(arteBan.src) + '" alt="" onerror="this.remove()">' +
        '<img class="emb" src="icons/clases/' + B.clase + '.webp" alt=""><div class="txt"><h1>' + esc(B.nombre) + "</h1>" +
        '<div class="meta">' + (esTop || !B.modo ? "" : chipModo(B.modo)) + chipVis +
        "<span>" + esc(tr(c)) + " · " + esc(t("builds.por")) + " <b>" + esc(B.autor) + "</b>" +
        " · " + esc(t("builds.actualizada")) + " " + esc(fecha(B.actualizado)) + "</span></div>" +
        (esTop ? '<p class="suave build-top-aviso">' + esc(t("builds.top_aviso")) + "</p>" : "") +
        togPub + votosHtml + "</div>" +
        '<div class="botones">' + botones + "</div></section>" +
        '<div id="hueco-juego"></div>');

    if (B.fuente) {
      h += '<div class="enlaces-ext"><a class="boton chico" href="referencia.html?c=' + B.clase + '">' + esc(t("clase.guia_ref")) + "</a></div>";
    }

    var cuerpo = "";
    if (B.espia) cuerpo += '<div class="panel aviso-lectura">' + esc(t("espia.solo_lectura")) + "</div>";
    else if (B.juego) cuerpo += '<div class="panel aviso-lectura">' + esc(t("build.solo_lectura")) + "</div>";
    else if (B.propia && !editando) cuerpo += '<p class="pista-editar">' + esc(t("build.pulsa_editar")) + "</p>";
    if (editando) cuerpo += formularioDatos();
    else if (B.descripcion) cuerpo += '<div class="panel descripcion-build" style="margin-bottom:22px">' + esc(B.descripcion) + "</div>";
    if (B.propia || !editando) {
      cuerpo += '<label class="interruptor" style="margin-bottom:14px"><input type="checkbox" id="ver-todas"' + (verTodas ? " checked" : "") +
        '><span class="pista"></span>' + esc(t("build.mostrar_todas")) + "</label>";
    }
    cuerpo += '<div id="grupos">' + grupo("activa") + grupo("estigma") + grupo("pasiva") + "</div>";
    if ((B.datos.videos || []).length && !editando) cuerpo += "<h2>" + esc(t("build.videos")) + "</h2>" + videosHTML(B.datos.videos);

    BARRA = Barra({ B: B, CAT: CAT, editando: editando, alCambiar: marcarSucio });
    DAE = Daevanion({ B: B, CAT: CAT, editando: editando, alCambiar: marcarSucio, alRepintar: function () {
      BONUS = DAE.bonus();
      var g = $("#grupos"), l = $("#lateral");
      if (g) g.innerHTML = grupo("activa") + grupo("estigma") + grupo("pasiva");
      if (l) l.innerHTML = resumenPuntos();
    } });
    var pest = PESTANAS.indexOf(location.hash.slice(1)) >= 0 ? location.hash.slice(1) : "habilidades";
    h += '<nav class="pestanas-build">' + PESTANAS.map(function (p) {
      return '<a href="#' + p + '" data-pestana="' + p + '"' + (p === pest ? ' class="on"' : "") + ">" + esc(t("pest." + p)) + "</a>";
    }).join("") + "</nav>";
    main.classList.toggle("clic-editar", !!(B.propia && !editando));
    h += '<div class="dos-col' + (editando ? " editando" : "") + '" data-panel="habilidades"' + (pest === "habilidades" ? "" : " hidden") + "><div>" + cuerpo +
      '</div><aside class="lateral" id="lateral">' + resumenPuntos() + "</aside></div>";
    h += '<div data-panel="barra" class="panel-barra"' + (pest === "barra" ? "" : " hidden") + '><div id="barra"></div></div>';
    h += '<div data-panel="daevanion"' + (pest === "daevanion" ? "" : " hidden") + '><div id="daevanion"></div></div>';
    h += '<div data-panel="equipo"' + (pest === "equipo" ? "" : " hidden") + '><div id="equipo"></div></div>';
    if (editando) {
      h += '<div class="barra-guardar"><span class="estado" id="estado-guardar">' + esc(t("build.guardado")) + '</span>' +
        '<div class="barra-guardar-acciones">' +
        '<button type="button" class="boton peligro chico" id="borrar">' + esc(t("build.borrar")) + "</button>" +
        '<button type="button" class="boton" id="cancelar">' + esc(t("build.cancelar")) + "</button>" +
        '<button type="button" class="boton oro" id="guardar">' + esc(t("build.guardar")) + "</button></div></div>";
    }
    main.innerHTML = h;
    var barra = $("#barra");
    barra.innerHTML = BARRA.html();
    BARRA.enlazar(barra);
    var dae = $("#daevanion");
    dae.innerHTML = DAE.html();
    DAE.enlazar(dae);
    DAE.cargar().then(DAE.repintar).catch(function () { dae.innerHTML = '<div class="vacio-lista">' + esc(t("dae.sin_datos")) + "</div>"; });
    EQUIPO = Equipo({ B: B, editando: editando, alCambiar: marcarSucio });
    var eq = $("#equipo");
    eq.innerHTML = EQUIPO.html();
    EQUIPO.enlazar(eq);
    EQUIPO.cargar().then(EQUIPO.repintar);
    enlazar();
    if (window.Juego) Juego.montar({ B: B, CAT: CAT, daevanion: function () { return DAE.datos(); } });
  }
  function verPestana(p) {
    main.querySelectorAll("[data-pestana]").forEach(function (a) { a.classList.toggle("on", a.dataset.pestana === p); });
    main.querySelectorAll("[data-panel]").forEach(function (d) { d.hidden = d.dataset.panel !== p; });
    if (p === "equipo" && EQUIPO) EQUIPO.repintar();
  }

  function formularioDatos() {
    return '<div class="panel" style="margin-bottom:22px"><div style="display:grid;grid-template-columns:1fr 160px 140px;gap:12px">' +
      '<div><label for="f-nombre">' + esc(t("build.nombre")) + '</label><input id="f-nombre" maxlength="80" value="' + esc(B.nombre) + '"></div>' +
      '<div><label for="f-modo">' + esc(t("build.modo")) + '</label><select id="f-modo">' + opcionesModo(B.modo) + "</select></div>" +
      '<div><label for="f-nivel">' + esc(t("build.nivel_pj")) + '</label><input id="f-nivel" type="number" min="1" max="99" value="' + esc(B.datos.nivel_pj || "") + '"></div></div>' +
      '<label for="f-desc">' + esc(t("build.descripcion")) + '</label><textarea id="f-desc" maxlength="4000">' + esc(B.descripcion) + "</textarea>" +
      '<label for="f-videos">' + esc(t("build.videos")) + '</label><textarea id="f-videos" style="min-height:70px" placeholder="https://www.youtube.com/watch?v=…">' +
      esc((B.datos.videos || []).join("\n")) + '</textarea><div class="campo-ayuda">' + esc(t("build.videos_ayuda")) + "</div>" +
      '<div style="margin-top:14px"><label class="interruptor"><input type="checkbox" id="f-publica"' + (B.publica ? " checked" : "") + '><span class="pista"></span>' +
      esc(t("build.publica")) + "</label>" +
      '<p class="campo-ayuda">' + esc(t("build.publica_hint")) + "</p></div></div>";
  }

  function aplicarPublica(on) {
    B.publica = !!on;
    var chip = $("#chip-vis");
    if (chip) {
      chip.className = "chip" + (B.publica ? " publica" : "");
      chip.textContent = t(B.publica ? "build.publica" : "build.privada");
    }
    var f = $("#f-publica"), tog = $("#tog-publica"), tog2 = $("#tog-publica-ficha");
    if (f && f.checked !== B.publica) f.checked = B.publica;
    if (tog && tog.checked !== B.publica) tog.checked = B.publica;
    if (tog2 && tog2.checked !== B.publica) tog2.checked = B.publica;
    var caja = document.querySelector(".caja-publicar");
    if (caja) caja.classList.toggle("on", !!on);
    var lab = caja && caja.querySelector("b");
    if (lab) lab.textContent = t(on ? "build.ya_publica" : "build.publicar");
    var eq = $("#pj-publico");
    if (eq) {
      eq.disabled = !on;
      var avisoEq = document.querySelector(".aviso-equipo-pub");
      if (avisoEq) avisoEq.textContent = t(on ? "juego.mostrar_aviso" : "juego.mostrar_bloqueado");
    }
  }

  // Para que la ficha del personaje (juego.js) pueda publicar sin duplicar lógica
  window.OC_aplicarPublica = aplicarPublica;
  window.OC_guardarPublica = function (on, origen) { return guardarPublica(on, origen); };

  function guardarPublica(on, origen) {
    if (origen) origen.disabled = true;
    api("PUT", "/api/builds/" + B.id, { publica: !!on }).then(function () {
      aplicarPublica(on);
      aviso(t(on ? "build.publica_ok" : "build.privada_ok") + (on ? " " + t("build.ver_en_builds") : ""), "ok");
    }).catch(function (e) {
      if (origen) origen.checked = !on;
      aviso(textoError(e), "mal");
    }).then(function () { if (origen) origen.disabled = false; });
  }

  function repintarHab(id) {
    var h = CAT.porId[id], el = $("#hab-" + id);
    if (el) el.outerHTML = tarjeta(h);
    $("#lateral").innerHTML = resumenPuntos();
  }

  function ponerNivel(id, nivel) {
    var h = CAT.porId[id], st = estado(id);
    if (!h) return;
    var tope = topeHabilidad(h, nivelPj());
    nivel = Math.max(0, Math.min(tope, parseInt(nivel, 10) || 0));
    var visible = origen(h.id, nivel).total;
    var esp = st.esp.filter(function (n) {
      return espDisponibles(h, visible).some(function (e) { return e.n === n; });
    }).slice(0, huecosActiva(visible));
    fijar(id, { nivel: nivel, esp: h.tipo === "activa" ? esp : [] });
    repintarHab(id);
  }

  function alternarEsp(id, n) {
    var h = CAT.porId[id], st = estado(id), nivel = st.nivel || 0;
    var visible = origen(h.id, nivel).total;
    var e = h.esp.filter(function (x) { return x.n === n; })[0];
    if (!e || (e.nivel || 99) > visible) return;
    var esp = st.esp.slice(), i = esp.indexOf(n);
    if (i >= 0) esp.splice(i, 1);
    else {
      if (esp.length >= huecosActiva(visible)) esp.shift();
      esp.push(n);
    }
    fijar(id, { nivel: nivel, esp: esp });
    repintarHab(id);
  }

  function guardar() {
    var cuerpo = {
      nombre: $("#f-nombre").value, modo: $("#f-modo").value, descripcion: $("#f-desc").value, publica: $("#f-publica").checked,
      datos: {
        habilidades: B.datos.habilidades,
        nivel_pj: $("#f-nivel").value ? parseInt($("#f-nivel").value, 10) : undefined,
        videos: $("#f-videos").value.split(/\s+/).filter(Boolean),
        presets: BARRA.datos(),
        daevanion: DAE.datos(),
        equipo: EQUIPO.datos()
      }
    };
    var bot = $("#guardar");
    bot.disabled = true;
    api("PUT", "/api/builds/" + B.id, cuerpo).then(function () {
      sucio = false;
      B.nombre = cuerpo.nombre; B.modo = cuerpo.modo; B.descripcion = cuerpo.descripcion; B.publica = cuerpo.publica;
      B.datos.nivel_pj = cuerpo.datos.nivel_pj; B.datos.videos = cuerpo.datos.videos;
      $("#estado-guardar").textContent = t("build.guardado");
      $("#estado-guardar").className = "estado";
      aviso(t("build.guardado"), "ok");
    }).catch(function (e) { aviso(textoError(e), "mal"); }).then(function () { bot.disabled = false; });
  }

  function enlazar() {
    main.addEventListener("click", function (e) {
      var pe = e.target.closest("[data-pestana]");
      if (pe) { e.preventDefault(); history.replaceState(null, "", "#" + pe.dataset.pestana); verPestana(pe.dataset.pestana); return; }
      var b = e.target.closest("[data-mas]");
      if (b) {
        if (b.disabled) return;
        ponerNivel(b.dataset.hab, (estado(b.dataset.hab).nivel || 0) + parseInt(b.dataset.mas, 10));
        return;
      }
      var es = e.target.closest("[data-esp]");
      if (es && editando) { alternarEsp(es.dataset.hab, parseInt(es.dataset.esp, 10)); return; }
      if (B.propia && !editando && !e.target.closest("a, input, select, label, textarea, .presets, .tableros-d, .velo, [data-preset], [data-accion]")) {
        var zona = e.target.closest(".hab, .marco-tablero, #barra");
        var panel = zona && zona.closest("[data-panel]");
        if (panel) location.href = "build.html?id=" + B.id + "&editar=1#" + panel.dataset.panel;
      }
    });
    main.addEventListener("change", function (e) {
      if (e.target.dataset.nivel) ponerNivel(e.target.dataset.nivel, e.target.value);
      else if (e.target.id === "ver-todas") { verTodas = e.target.checked; $("#grupos").innerHTML = grupo("activa") + grupo("estigma") + grupo("pasiva"); }
      else if (e.target.id === "f-nivel") {
        B.datos.nivel_pj = parseInt(e.target.value, 10) || undefined;
        acotarHabilidades();
        $("#grupos").innerHTML = grupo("activa") + grupo("estigma") + grupo("pasiva");
        $("#lateral").innerHTML = resumenPuntos();
        marcarSucio();
      }
      else if (editando && e.target.closest(".panel")) marcarSucio();
    });
    main.addEventListener("input", function (e) {
      if (editando && /^f-/.test(e.target.id)) marcarSucio();
    });
    var g = $("#guardar");
    if (g) g.addEventListener("click", guardar);
    var tog = $("#tog-publica");
    if (tog) tog.addEventListener("change", function () { guardarPublica(tog.checked, tog); });
    var fp = $("#f-publica");
    if (fp) fp.addEventListener("change", function () { guardarPublica(fp.checked, fp); });
    var ca = $("#cancelar");
    if (ca) ca.addEventListener("click", function () {
      if (sucio && !confirm(t("build.cancelar_conf"))) return;
      sucio = false;
      location.href = "build.html?id=" + B.id;
    });
    var br = $("#borrar");
    if (br) br.addEventListener("click", function () {
      var escrito = prompt(t("build.borrar_escribe"), "");
      if (escrito == null) return;
      var conf = String(escrito).trim().toUpperCase();
      if (conf !== "BORRAR" && conf !== "DELETE") {
        aviso(t("build.borrar_mal"), "mal");
        return;
      }
      br.disabled = true;
      api("DELETE", "/api/builds/" + B.id)
        .then(function () { sucio = false; location.href = "mis-builds.html"; })
        .catch(function (e) { br.disabled = false; aviso(textoError(e), "mal"); });
    });
    var cp = $("#copiar");
    if (cp) cp.addEventListener("click", function () {
      api("POST", "/api/builds/" + B.id + "/copiar", {}).then(function (r) { location.href = "build.html?id=" + r.id + "&editar=1"; })
        .catch(function (e) { aviso(textoError(e), "mal"); });
    });
    var sh = $("#compartir");
    if (sh) sh.addEventListener("click", function () {
      navigator.clipboard.writeText((ESCAPARATE ? WEB_PRINCIPAL : location.origin) + "/build.html?id=" + B.id).then(function () { aviso(t("build.enlace_copiado"), "ok"); });
    });
    var cajaV = $("#votos-build");
    if (cajaV) cajaV.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-voto]");
      if (!btn || btn.disabled) return;
      if (!YO) {
        location.href = "entrar.html?volver=" + encodeURIComponent("build.html?id=" + B.id);
        return;
      }
      var v = parseInt(btn.dataset.voto, 10);
      var nuevo = (B.mi_voto === v) ? 0 : v;
      btn.disabled = true;
      api("POST", "/api/builds/" + B.id + "/voto", { valor: nuevo }).then(function (r) {
        B.mi_voto = r.mi_voto;
        B.likes = r.likes;
        B.dislikes = r.dislikes;
        var nl = $("#n-likes"), nd = $("#n-dislikes");
        if (nl) nl.textContent = r.likes;
        if (nd) nd.textContent = r.dislikes;
        cajaV.querySelectorAll("[data-voto]").forEach(function (b) {
          b.classList.toggle("on", parseInt(b.dataset.voto, 10) === r.mi_voto);
          b.disabled = false;
        });
      }).catch(function (er) {
        aviso(textoError(er), "mal");
        btn.disabled = false;
      });
    });
    window.addEventListener("beforeunload", function (e) { if (sucio) { e.preventDefault(); e.returnValue = ""; } });
  }
})();
