// Ver y editar una build. ?id=N  (&editar=1 para abrir en modo edición si es tuya)
(function () {
  var main = $("#main");
  var B, CAT, BARRA, DAE, editando = false, sucio = false, verTodas = false;
  var PESTANAS = ["habilidades", "barra", "daevanion"];

  cabecera("builds").then(function () {
    var id = param("id");
    if (!id) return noExiste();
    api("GET", "/api/builds/" + encodeURIComponent(id)).then(function (b) {
      B = b;
      B.datos.habilidades = B.datos.habilidades || {};
      editando = B.propia && param("editar") === "1";
      verTodas = editando;
      return cargarCatalogo(B.clase);
    }).then(function (c) {
      CAT = c;
      pintar();
    }).catch(noExiste);
  });

  function noExiste() { main.innerHTML = '<div class="vacio-lista">' + esc(t("build.no_existe")) + "</div>"; }

  function estado(id) { return B.datos.habilidades[id] || { nivel: 0, esp: [] }; }
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

  // ---------- tarjeta de habilidad ----------
  function tarjeta(h) {
    var st = estado(h.id), nivel = st.nivel || 0;
    var cab = '<div class="linea"><span class="nombre">' + esc(tr(h.nombre)) + "</span>" +
      (editando ? controlNivel(h.id, nivel) : '<span class="nv">' + (nivel ? esc(t("build.nivel")) + " " + nivel : esc(t("build.sin_aprender"))) + "</span>") + "</div>";
    var esp = "";
    if (h.tipo === "activa" && h.esp.length) {
      var hu = huecosActiva(nivel);
      esp = '<div class="huecos">' + esc(t("build.esp")) + ": <b>" + st.esp.length + "/" + hu + "</b> " + esc(t("build.huecos")) + "</div>" +
        '<div class="esp-lista">' + h.esp.map(function (e) {
          var on = st.esp.indexOf(e.n) >= 0, bloq = (e.nivel || 99) > nivel;
          if (!editando && !on) return "";
          return '<div class="esp' + (on ? " on" : "") + (bloq ? " bloq" : "") + '" data-esp="' + e.n + '" data-hab="' + h.id + '"><span class="lv">' + (e.nivel || "") + "</span><span>" + esc(tr(e.texto)) + "</span></div>";
        }).join("") + "</div>";
    } else if (h.tipo === "estigma" && h.esp.length && (nivel || editando)) {
      esp = '<div class="esp-lista">' + h.esp.map(function (e) {
        var on = (e.nivel || 99) <= nivel;
        return '<div class="esp' + (on ? " on" : " bloq") + '"><span class="lv">' + (e.nivel || "") + "</span><span>" + esc(tr(e.texto)) + "</span></div>";
      }).join("") + "</div>";
    }
    return '<div class="hab' + (nivel ? "" : " apagada") + '" id="hab-' + h.id + '">' + iconoHab(h, ' data-tip="' + esc(tipHabilidad(h, nivel, st.esp)) + '"') +
      '<div class="cuerpo">' + cab + '<div class="desc">' + descripcion(h, nivel || 1) + "</div>" + esp + "</div></div>";
  }
  function controlNivel(id, nivel) {
    return '<span class="nivel-ctrl"><button data-mas="-1" data-hab="' + id + '">−</button><input type="number" min="0" max="' + NIVEL_MAX +
      '" value="' + nivel + '" data-nivel="' + id + '"><button data-mas="1" data-hab="' + id + '">+</button></span>';
  }

  function grupo(tipo) {
    var lista = CAT.habilidades.filter(function (h) { return h.tipo === tipo; });
    var aprendidas = lista.filter(function (h) { return estado(h.id).nivel > 0; });
    var mostrar = verTodas ? lista : aprendidas;
    if (!mostrar.length) return "";
    mostrar = mostrar.slice().sort(function (a, b) { return (estado(b.id).nivel || 0) - (estado(a.id).nivel || 0); });
    return '<section class="grupo-hab"><h2>' + esc(t("tipo." + tipo)) + " <small>" + aprendidas.length + "/" + lista.length + "</small></h2>" +
      (tipo === "estigma" ? '<p class="suave" style="margin:-6px 0 10px;font-size:13px">' + esc(t("build.auto")) + "</p>" : "") +
      '<div class="lista-hab">' + mostrar.map(tarjeta).join("") + "</div></section>";
  }

  function resumenPuntos() {
    var hab = 0, est = 0;
    CAT.habilidades.forEach(function (h) {
      var p = puntosGastados(h, estado(h.id).nivel || 0);
      hab += p[0]; est += p[1];
    });
    return '<div class="panel resumen-puntos"><div class="fila"><span>' + esc(t("build.puntos_hab")) + "</span><b>" + hab + '</b></div>' +
      '<div class="fila"><span>' + esc(t("build.puntos_est")) + "</span><b>" + est + "</b></div>" +
      (B.datos.nivel_pj ? '<div class="fila"><span>' + esc(t("build.nivel_pj")) + "</span><b>" + B.datos.nivel_pj + "</b></div>" : "") + "</div>";
  }

  // ---------- página ----------
  function pintar() {
    var c = claseInfo(B.clase);
    document.title = B.nombre + " · EspClown AION 2";
    var botones = "";
    if (B.propia) {
      botones += editando ? '<a class="boton" href="build.html?id=' + B.id + '">' + esc(t("build.ver")) + "</a>" :
        '<a class="boton oro" href="build.html?id=' + B.id + '&editar=1">' + esc(t("build.editar")) + "</a>";
    }
    if (YO && !B.propia) botones += '<button class="boton" id="copiar">' + esc(t("build.copiar")) + "</button>";
    if (ESCAPARATE) botones += '<a class="boton oro" href="' + enPrincipal("build.html?id=" + B.id) + '">' + esc(t("build.abrir_principal")) + "</a>";
    if (B.publica) botones += '<button class="boton" id="compartir">' + esc(t("build.compartir")) + "</button>";

    var h = '<section class="banner"><img class="arte" src="icons/clases/' + B.clase + '-arte.webp" alt="" onerror="this.remove()">' +
      '<img class="emb" src="icons/clases/' + B.clase + '.webp" alt=""><div class="txt"><h1>' + esc(B.nombre) + "</h1>" +
      '<div class="meta">' + chipModo(B.modo) + '<span class="chip ' + (B.publica ? "publica" : "") + '">' + esc(t(B.publica ? "build.publica" : "build.privada")) + "</span>" +
      "<span>" + esc(tr(c)) + " · " + esc(t("builds.por")) + " <b>" + esc(B.autor) + "</b> · " + esc(t("builds.actualizada")) + " " + esc(fecha(B.actualizado)) + "</span></div></div>" +
      '<div class="botones">' + botones + "</div></section>";

    if (B.fuente) {
      h += '<div class="enlaces-ext"><a class="boton chico" href="referencia.html?c=' + B.clase + '">' + esc(t("clase.guia_ref")) + "</a></div>";
    }

    var cuerpo = "";
    if (editando) cuerpo += formularioDatos();
    else if (B.descripcion) cuerpo += '<div class="panel descripcion-build" style="margin-bottom:22px">' + esc(B.descripcion) + "</div>";
    if (B.propia || !editando) {
      cuerpo += '<label class="interruptor" style="margin-bottom:14px"><input type="checkbox" id="ver-todas"' + (verTodas ? " checked" : "") +
        '><span class="pista"></span>' + esc(t("build.mostrar_todas")) + "</label>";
    }
    cuerpo += '<div id="grupos">' + grupo("activa") + grupo("estigma") + grupo("pasiva") + "</div>";
    if ((B.datos.videos || []).length && !editando) cuerpo += "<h2>" + esc(t("build.videos")) + "</h2>" + videosHTML(B.datos.videos);

    BARRA = Barra({ B: B, CAT: CAT, editando: editando, alCambiar: marcarSucio });
    DAE = Daevanion({ B: B, CAT: CAT, editando: editando, alCambiar: marcarSucio });
    var pest = PESTANAS.indexOf(location.hash.slice(1)) >= 0 ? location.hash.slice(1) : "habilidades";
    h += '<nav class="pestanas-build">' + PESTANAS.map(function (p) {
      return '<a href="#' + p + '" data-pestana="' + p + '"' + (p === pest ? ' class="on"' : "") + ">" + esc(t("pest." + p)) + "</a>";
    }).join("") + "</nav>";
    h += '<div class="dos-col' + (editando ? " editando" : "") + '" data-panel="habilidades"' + (pest === "habilidades" ? "" : " hidden") + "><div>" + cuerpo +
      '</div><aside class="lateral" id="lateral">' + resumenPuntos() + "</aside></div>";
    h += '<div data-panel="barra" class="panel-barra"' + (pest === "barra" ? "" : " hidden") + '><div id="barra"></div></div>';
    h += '<div data-panel="daevanion"' + (pest === "daevanion" ? "" : " hidden") + '><div id="daevanion"></div></div>';
    if (editando) {
      h += '<div class="barra-guardar"><span class="estado" id="estado-guardar">' + esc(t("build.guardado")) + '</span><div style="display:flex;gap:8px">' +
        '<button class="boton peligro chico" id="borrar">' + esc(t("build.borrar")) + '</button><button class="boton oro" id="guardar">' + esc(t("build.guardar")) + "</button></div></div>";
    }
    main.innerHTML = h;
    var barra = $("#barra");
    barra.innerHTML = BARRA.html();
    BARRA.enlazar(barra);
    var dae = $("#daevanion");
    dae.innerHTML = DAE.html();
    DAE.enlazar(dae);
    DAE.cargar().then(DAE.repintar).catch(function () { dae.innerHTML = '<div class="vacio-lista">' + esc(t("dae.sin_datos")) + "</div>"; });
    enlazar();
  }
  function verPestana(p) {
    main.querySelectorAll("[data-pestana]").forEach(function (a) { a.classList.toggle("on", a.dataset.pestana === p); });
    main.querySelectorAll("[data-panel]").forEach(function (d) { d.hidden = d.dataset.panel !== p; });
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
      esc(t("build.publica")) + "</label></div></div>";
  }

  function repintarHab(id) {
    var h = CAT.porId[id], el = $("#hab-" + id);
    if (el) el.outerHTML = tarjeta(h);
    $("#lateral").innerHTML = resumenPuntos();
  }

  function ponerNivel(id, nivel) {
    var h = CAT.porId[id], st = estado(id);
    nivel = Math.max(0, Math.min(NIVEL_MAX, parseInt(nivel, 10) || 0));
    var esp = st.esp.filter(function (n) {
      return espDisponibles(h, nivel).some(function (e) { return e.n === n; });
    }).slice(0, huecosActiva(nivel));
    fijar(id, { nivel: nivel, esp: h.tipo === "activa" ? esp : [] });
    repintarHab(id);
  }

  function alternarEsp(id, n) {
    var h = CAT.porId[id], st = estado(id), nivel = st.nivel || 0;
    var e = h.esp.filter(function (x) { return x.n === n; })[0];
    if (!e || (e.nivel || 99) > nivel) return;
    var esp = st.esp.slice(), i = esp.indexOf(n);
    if (i >= 0) esp.splice(i, 1);
    else {
      if (esp.length >= huecosActiva(nivel)) esp.shift();
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
        daevanion: DAE.datos()
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
      if (b) { ponerNivel(b.dataset.hab, (estado(b.dataset.hab).nivel || 0) + parseInt(b.dataset.mas, 10)); return; }
      var es = e.target.closest("[data-esp]");
      if (es && editando) { alternarEsp(es.dataset.hab, parseInt(es.dataset.esp, 10)); return; }
    });
    main.addEventListener("change", function (e) {
      if (e.target.dataset.nivel) ponerNivel(e.target.dataset.nivel, e.target.value);
      else if (e.target.id === "ver-todas") { verTodas = e.target.checked; $("#grupos").innerHTML = grupo("activa") + grupo("estigma") + grupo("pasiva"); }
      else if (editando && e.target.closest(".panel")) marcarSucio();
    });
    main.addEventListener("input", function (e) {
      if (editando && /^f-/.test(e.target.id)) marcarSucio();
    });
    var g = $("#guardar");
    if (g) g.addEventListener("click", guardar);
    var br = $("#borrar");
    if (br) br.addEventListener("click", function () {
      if (!confirm(t("build.borrar_conf"))) return;
      api("DELETE", "/api/builds/" + B.id).then(function () { location.href = "mis-builds.html"; });
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
    window.addEventListener("beforeunload", function (e) { if (sucio) { e.preventDefault(); e.returnValue = ""; } });
  }
})();
