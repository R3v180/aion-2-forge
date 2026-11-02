/* Panel único de staff. Cada rol ve solo sus pestañas. */
var TABS_PANEL = ["resumen", "moderacion", "chat", "gente", "audiencia", "foro", "bot"];

function fechaCorta(iso) {
  if (!iso) return "—";
  var d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(IDIOMA === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function tabsDeRol(rol) {
  return TABS_PANEL.filter(function (id) {
    if (id === "resumen" || id === "gente") return rol === "admin" || rol === "superadmin";
    if (id === "audiencia" || id === "foro" || id === "bot") return rol === "superadmin";
    return true;
  });
}

function panel() {
  var main = $("#main");
  var yo = null;
  var tab = param("tab") || "";
  var filtro = "todos";
  var maxDias = 7;
  var datos = null;
  var genteVista = "staff";
  var genteEspera = null;

  var activa0 = (tab === "resumen" || tab === "audiencia" || tab === "foro" || tab === "bot") ? "super" : "panel";
  cabecera(activa0).then(function (u) {
    if (!u) { location.href = "entrar.html?volver=" + encodeURIComponent("panel.html" + location.search); return; }
    if (!esStaff()) { location.href = "index.html"; return; }
    yo = u;
    var ok = tabsDeRol(u.rol);
    if (ok.indexOf(tab) < 0) tab = u.rol === "moderador" ? "moderacion" : "resumen";
    return api("GET", "/api/panel").then(function (d) {
      datos = d;
      maxDias = d.max_dias || (u.rol === "moderador" ? 7 : 30);
      pintarShell();
      return pintarVista();
    });
  }).catch(function (e) { main.innerHTML = '<div class="vacio-lista">' + esc(textoError(e)) + "</div>"; });

  function marcarNav() {
    var superOn = yo && yo.rol === "superadmin" && (tab === "resumen" || tab === "audiencia" || tab === "foro" || tab === "bot");
    document.querySelectorAll("#zona-usuario a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("tab=resumen") >= 0 || href.indexOf("panel-super") >= 0) a.classList.toggle("on", !!superOn);
      else if (href.indexOf("panel") >= 0) a.classList.toggle("on", !superOn);
    });
  }

  function syncUrl() {
    var q = new URLSearchParams(location.search);
    q.set("tab", tab);
    try { history.replaceState(null, "", "panel.html?" + q.toString()); } catch (e) {}
    marcarNav();
  }

  function pintarShell() {
    var rolTxt = t("panel.rol_" + yo.rol) || yo.rol;
    var titulo = yo.rol === "superadmin" ? t("super.titulo") : t("panel.titulo");
    var sub = yo.rol === "superadmin" ? t("panel.sub_super") : t("panel.sub").replace("{rol}", rolTxt);
    var kpi = (datos && datos.kpi) || { total: 0 };
    main.innerHTML =
      '<section class="panel-hero">' +
        '<div><span class="antetitulo">' + esc(t("panel.antetitulo")) + "</span>" +
        "<h1>" + esc(titulo) + "</h1>" +
        '<p class="suave">' + esc(sub) + "</p>" +
        '<span class="chip">' + esc(rolTxt) + '</span> ' +
        '<span class="chip' + (kpi.total ? " urg" : "") + '" id="kpi-pend">' + kpi.total + " " + esc(t("panel.kpi_total").toLowerCase()) + "</span></div>" +
      "</section>" +
      '<nav class="panel-tabs" id="panel-tabs">' + tabsDeRol(yo.rol).map(function (id) {
        return '<button type="button" data-tab="' + id + '">' + esc(t("panel.tab_" + id)) + "</button>";
      }).join("") + "</nav>" +
      matrizPermisosHTML() +
      '<div id="panel-vista"></div>';
    main.onclick = alClick;
    syncUrl();
    pintarTabs();
  }

  function pintarTabs() {
    main.querySelectorAll("[data-tab]").forEach(function (b) {
      b.classList.toggle("on", b.dataset.tab === tab);
    });
  }

  function ir(id, extra) {
    if (tabsDeRol(yo.rol).indexOf(id) < 0) return;
    tab = id;
    if (extra && extra.gente) genteVista = extra.gente;
    pintarTabs();
    syncUrl();
    pintarVista();
  }

  function alClick(e) {
    var tb = e.target.closest("[data-tab]");
    if (tb && tb.closest("#panel-tabs")) { ir(tb.dataset.tab); return; }
    var irG = e.target.closest("[data-ir]");
    if (irG) { ir(irG.dataset.ir, { gente: irG.dataset.gente }); return; }
    if (tab === "moderacion") clickMod(e);
    else if (tab === "chat") clickChat(e);
    else if (tab === "gente") clickGente(e);
    else if (tab === "foro") clickForo(e);
    else if (tab === "bot") clickBot(e);
  }

  function caja() { return $("#panel-vista"); }

  function pintarVista() {
    var v = caja();
    if (!v) return;
    v.innerHTML = '<p class="suave">' + esc(t("comun.cargando")) + "</p>";
    if (tab === "resumen") return vistaResumen();
    if (tab === "moderacion") return vistaMod();
    if (tab === "chat") return vistaChat(false);
    if (tab === "gente") return vistaGente();
    if (tab === "audiencia") return vistaAudiencia();
    if (tab === "foro") return vistaForo();
    if (tab === "bot") return vistaBot();
  }

  function ponerKpi(kpi) {
    var chip = $("#kpi-pend");
    if (!chip || !kpi) return;
    chip.textContent = kpi.total + " " + t("panel.kpi_total").toLowerCase();
    chip.classList.toggle("urg", !!kpi.total);
  }

  function avisosJuegoHTML(d) {
    var h = "";
    if (d.ultimo_parche) {
      h += '<div class="fila-panel"><span><b>' + esc(t("noticias.ultimo_parche")) + "</b><small>" + esc(d.ultimo_parche.titulo) + " · " +
        esc(fechaHora(d.ultimo_parche.publicado)) + '</small></span><a class="boton chico" href="noticia.html?id=' + d.ultimo_parche.id + '">' + esc(t("build.ver")) + "</a></div>";
    }
    var nuevas = d.habilidades_nuevas || {};
    Object.keys(nuevas).forEach(function (c) {
      var info = (typeof claseInfo === "function") ? claseInfo(c) : null;
      var nom = info ? tr(info) : c;
      h += '<div class="fila-panel"><span><b>' + esc(nom) + " · " + nuevas[c].length + " " + esc(t("panel.hab_nuevas")) + "</b><small>" +
        esc(nuevas[c].join(", ")) + "</small></span></div>";
    });
    return h;
  }

  function vistaResumen() {
    var pedido = tab;
    return api("GET", "/api/panel/resumen").then(function (d) {
      if (tab !== pedido) return;
      ponerKpi(d.kpi);
      var visitas = "";
      if (d.visitas) {
        visitas =
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_visitas_hoy")) + "</span><b>" + esc(fmtNum(d.visitas.hoy)) + "</b></div>" +
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_visitas_semana")) + "</span><b>" + esc(fmtNum(d.visitas.semana)) + "</b></div>";
      }
      var filas = d.recientes || [];
      var tabla = filas.length ? tablaGente(filas, false) :
        '<p class="suave">' + esc(t("panel.recientes_vacio")) + "</p>";
      var juego = avisosJuegoHTML(d);
      caja().innerHTML =
        '<section class="panel panel-caja"><div class="panel-kpi-grid">' +
          '<div class="panel-kpi' + (d.kpi.total ? " urg" : "") + '"><span>' + esc(t("panel.kpi_total")) + "</span><b>" + d.kpi.total + "</b></div>" +
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_bot")) + "</span><b>" + d.kpi.bot + "</b></div>" +
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_denuncias")) + "</span><b>" + d.kpi.denuncias + "</b></div>" +
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_cuentas")) + "</span><b>" + esc(fmtNum(d.cuentas)) + "</b></div>" +
          '<div class="panel-kpi"><span>' + esc(t("panel.kpi_altas")) + "</span><b>" + esc(fmtNum(d.altas_7d)) + "</b></div>" +
          visitas +
        "</div></section>" +
        '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.recientes")) + "</h2>" +
          '<button type="button" class="enlace" data-ir="gente" data-gente="recientes">' + esc(t("panel.ver_gente")) + "</button></div>" +
          '<div class="panel-scroll">' + tabla + "</div></section>" +
        (juego ? '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.juego")) + "</h2></div>" +
          '<p class="suave">' + esc(t("panel.juego_txt")) + "</p>" + juego + "</section>" : "");
    }).catch(function (er) { caja().innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function tablaGente(lista, editable) {
    var head = "<thead><tr><th>" + esc(t("panel.col_usuario")) + "</th><th>" + esc(t("panel.rol")) + "</th><th>" +
      esc(t("panel.col_alta")) + "</th><th>" + esc(t("panel.col_builds")) + "</th>" +
      (editable ? "<th>" + esc(t("panel.col_dias")) + "</th><th></th>" : "") + "</tr></thead>";
    var body = lista.map(function (p) {
      var rol = esc(t("panel.rol_" + p.rol) || p.rol);
      var quien = "<b>" + esc(p.usuario) + "</b>" + (p.propio ? ' <small class="suave">' + esc(t("panel.tu")) + "</small>" : "");
      if (p.expulsado_hasta) quien += '<small class="suave">' + esc(t("panel.suspendido_hasta")) + " " + esc(fechaCorta(p.expulsado_hasta)) + "</small>";
      if (!editable || !p.editable) {
        return "<tr><td>" + quien + "</td><td>" + rol + "</td><td>" + esc(fechaCorta(p.creado)) + "</td><td>" + (p.builds || 0) + "</td>" +
          (editable ? "<td></td><td></td>" : "") + "</tr>";
      }
      var roles = p.roles || [];
      var sel = '<select data-rol>' + roles.map(function (r) {
        return '<option value="' + r + '"' + (r === p.rol ? " selected" : "") + ">" + esc(t("panel.rol_" + r)) + "</option>";
      }).join("") + "</select>";
      var borrar = p.puede_borrar
        ? '<button type="button" class="boton chico peligro" data-borrar-cuenta="' + p.id + '" data-nombre="' + esc(p.usuario) + '">' + esc(t("panel.borrar_cuenta")) + "</button>"
        : "";
      return '<tr data-usuario="' + p.id + '"><td>' + quien + "</td><td>" + sel + "</td><td>" + esc(fechaCorta(p.creado)) +
        "</td><td>" + (p.builds || 0) + '</td><td><input data-dias type="number" min="0" max="' + maxDias + '" value="0" title="' + esc(t("panel.suspension")) + '"></td>' +
        '<td class="acc"><button type="button" class="boton chico" data-guardar-usuario="' + p.id + '">' + esc(t("panel.guardar")) + "</button>" + borrar + "</td></tr>";
    }).join("");
    return '<table class="panel-tabla">' + head + "<tbody>" + body + "</tbody></table>";
  }

  function vistaMod() {
    var kpi = (datos && datos.kpi) || { total: 0, bot: 0, denuncias: 0 };
    caja().innerHTML =
      '<section class="panel panel-caja' + (kpi.total ? " urgente" : "") + '">' +
        '<div class="panel-cabeza"><h2>' + esc(t("panel.cola")) + "</h2>" +
        (kpi.total ? '<span class="chip urg" id="cola-n">' + kpi.total + "</span>" : '<span class="chip" id="cola-n" hidden></span>') + "</div>" +
        '<p class="suave">' + esc(t("panel.cola_txt")) + "</p>" +
        '<div class="cola-filtros">' +
          [["todos", "panel.filtro_todos"], ["bot", "panel.filtro_bot"], ["denuncia", "panel.filtro_denuncia"]].map(function (x) {
            return '<button type="button" class="chip-filtro' + (filtro === x[0] ? " on" : "") + '" data-filtro="' + x[0] + '">' + esc(t(x[1])) + "</button>";
          }).join("") +
        "</div>" +
        '<div id="cola-casos"></div>' +
        '<details class="panel-plegado"><summary>' + esc(t("panel.mod")) + "</summary>" +
        '<p class="suave">' + esc(t("panel.mod_txt")) + '</p><form id="mod-tema" class="fila-form">' +
        '<input id="tema-id" type="number" min="1" placeholder="ID" required style="max-width:110px">' +
        '<label class="interruptor"><input type="checkbox" id="tema-cerrado"><span class="pista"></span>' + esc(t("panel.cerrar")) + "</label>" +
        '<label class="interruptor"><input type="checkbox" id="tema-oculto"><span class="pista"></span>' + esc(t("panel.ocultar")) + "</label>" +
        (yo.rol === "admin" || yo.rol === "superadmin"
          ? '<label class="interruptor"><input type="checkbox" id="tema-fijado"><span class="pista"></span>' + esc(t("panel.fijar")) + "</label>" : "") +
        '<button class="boton">' + esc(t("panel.guardar")) + "</button></form></details></section>";
    var form = $("#mod-tema");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cuerpo = { cerrado: $("#tema-cerrado").checked, oculto: $("#tema-oculto").checked };
      var fij = $("#tema-fijado");
      if (fij) cuerpo.fijado = fij.checked;
      api("POST", "/api/panel/temas/" + $("#tema-id").value, cuerpo)
        .then(function () { aviso(t("panel.ok"), "ok"); })
        .catch(function (er) { aviso(textoError(er), "mal"); });
    });
    return cargarCasos();
  }

  function casoHTML(x) {
    var origen = x.origen === "denuncia" ? "denuncia" : "bot";
    return '<article class="caso-card origen-' + origen + '">' +
      '<div class="caso-meta"><span class="chip ' + (origen === "bot" ? "bot" : "den") + '">' + esc(t("panel.origen_" + (x.origen === "flood" ? "flood" : origen))) + "</span>" +
      '<span class="chip">' + esc(t("panel.tipo_" + (x.tipo === "usuario" ? "chat" : x.tipo))) + "</span>" +
      (x.regla ? '<span class="chip regla">' + esc(x.regla) + "</span>" : "") +
      "<time>" + esc(haceRato(x.creado)) + "</time></div>" +
      '<p class="caso-extracto">' + esc(x.extracto || x.motivo || "—") + "</p>" +
      '<div class="caso-pie"><span><b>' + esc(x.autor || "?") + "</b>" +
      (x.denunciante ? " · " + esc(t("panel.avisado_por")) + " " + esc(x.denunciante) : "") +
      (x.motivo ? "<small>" + esc(x.motivo) + "</small>" : "") + "</span>" +
      '<span class="caso-acciones">' +
      (x.tipo === "chat" || x.tipo === "mensaje" || x.tipo === "tema"
        ? '<button type="button" class="boton chico peligro" data-caso-ocultar="' + x.id + '">' + esc(t("panel.ocultar")) + "</button>" : "") +
      '<button type="button" class="boton chico" data-caso-dejar="' + x.id + '">' + esc(t("panel.dejar")) + "</button>" +
      (x.autor_id || x.tipo === "usuario"
        ? '<button type="button" class="boton chico" data-caso-suspender="' + x.id + '">' + esc(t("panel.suspender")) + "</button>" : "") +
      "</span></div></article>";
  }

  function cargarCasos() {
    var zona = $("#cola-casos");
    if (!zona) return;
    zona.innerHTML = '<p class="suave">' + esc(t("comun.cargando")) + "</p>";
    var q = filtro === "todos" ? "" : "?origen=" + encodeURIComponent(filtro);
    return api("GET", "/api/panel/casos" + q).then(function (lista) {
      zona.innerHTML = lista.length ? lista.map(casoHTML).join("") : '<p class="suave ok-txt">' + esc(t("panel.cola_vacia")) + "</p>";
    }).catch(function (er) { zona.innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function clickMod(e) {
    var f = e.target.closest("[data-filtro]");
    if (f) {
      filtro = f.dataset.filtro;
      main.querySelectorAll("[data-filtro]").forEach(function (b) { b.classList.toggle("on", b.dataset.filtro === filtro); });
      cargarCasos();
      return;
    }
    var oc = e.target.closest("[data-caso-ocultar]");
    if (oc) resolverCaso(oc.dataset.casoOcultar, "ocultar");
    var dj = e.target.closest("[data-caso-dejar]");
    if (dj) resolverCaso(dj.dataset.casoDejar, "dejar");
    var sp = e.target.closest("[data-caso-suspender]");
    if (sp) {
      var dias = parseInt(prompt(t("panel.suspender_dias").replace("{max}", String(maxDias)), "1"), 10);
      if (!dias || dias < 1) return;
      resolverCaso(sp.dataset.casoSuspender, "suspender", dias);
    }
  }

  function resolverCaso(id, accion, dias) {
    var cuerpo = { accion: accion };
    if (dias) cuerpo.dias = dias;
    api("POST", "/api/panel/casos/" + id, cuerpo).then(function () {
      aviso(t("panel.ok"), "ok");
      return api("GET", "/api/panel").then(function (d) {
        datos = d;
        ponerKpi(d.kpi);
        var n = $("#cola-n");
        if (n) { n.hidden = !d.kpi.total; n.textContent = d.kpi.total; }
        return cargarCasos();
      });
    }).catch(function (er) { aviso(textoError(er), "mal"); });
  }

  function vistaChat(mas) {
    var pedido = tab;
    var antes = "";
    if (mas) {
      var filas = caja().querySelectorAll("[data-chat]");
      var ultimo = filas.length ? filas[filas.length - 1].dataset.chat : "";
      if (ultimo) antes = "&antes=" + encodeURIComponent(ultimo);
    }
    return api("GET", "/api/panel/chat?limit=20" + antes).then(function (d) {
      if (tab !== pedido) return;
      var msgs = d.mensajes || [];
      var html = msgs.map(function (c) {
        return '<div class="fila-panel' + (c.oculto ? " oculto" : "") + '" data-chat-fila="' + c.id + '"><span><b>' + esc(c.autor) + "</b> " + esc(c.texto) +
          (c.oculto ? " <i>" + esc(t("panel.oculto")) + "</i>" : "") +
          "<small>" + esc(fechaHora(c.creado)) + "</small></span>" +
          '<button type="button" class="boton chico' + (c.oculto ? "" : " peligro") + '" data-chat="' + c.id + '" data-oculto="' + (c.oculto ? "0" : "1") + '">' +
          esc(t(c.oculto ? "panel.mostrar" : "panel.ocultar")) + "</button></div>";
      }).join("");
      var masBtn = d.hay_mas ? '<p class="panel-mas"><button type="button" class="boton" data-chat-mas>' + esc(t("panel.chat_mas")) + "</button></p>" : "";
      if (!mas) {
        caja().innerHTML =
          '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.chat_reciente")) + "</h2>" +
          '<a class="enlace" href="chat.html">' + esc(t("panel.ir_chat")) + "</a></div>" +
          '<p class="suave">' + esc(t("panel.chat_txt")) + '</p><div id="chat-lista">' +
          (html || '<p class="suave">' + esc(t("panel.chat_vacio")) + "</p>") + "</div>" + masBtn + "</section>";
      } else {
        var lista = $("#chat-lista");
        var viejo = caja().querySelector("[data-chat-mas]");
        if (viejo && viejo.parentElement) viejo.parentElement.remove();
        if (lista && html) lista.insertAdjacentHTML("beforeend", html);
        if (masBtn) caja().querySelector(".panel-caja").insertAdjacentHTML("beforeend", masBtn);
      }
    }).catch(function (er) { if (!mas) caja().innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; else aviso(textoError(er), "mal"); });
  }

  function clickChat(e) {
    if (e.target.closest("[data-chat-mas]")) { vistaChat(true); return; }
    var c = e.target.closest("[data-chat]");
    if (!c) return;
    var ocultar = c.dataset.oculto === "1";
    api("POST", "/api/panel/chat/" + c.dataset.chat, { oculto: ocultar }).then(function () {
      var fila = c.closest("[data-chat-fila]");
      if (fila) {
        fila.classList.toggle("oculto", ocultar);
        c.dataset.oculto = ocultar ? "0" : "1";
        c.textContent = t(ocultar ? "panel.mostrar" : "panel.ocultar");
        c.classList.toggle("peligro", !ocultar);
        var marca = fila.querySelector("i");
        if (ocultar && !marca) fila.querySelector("b").insertAdjacentHTML("afterend", " <i>" + esc(t("panel.oculto")) + "</i>");
        else if (!ocultar && marca) marca.remove();
      }
    }).catch(function (er) { aviso(textoError(er), "mal"); });
  }

  function apiGente() {
    return yo.rol === "superadmin" ? "/api/super/usuarios" : "/api/panel/equipo";
  }

  function vistaGente() {
    var vistas = [["staff", "panel.vista_staff"], ["recientes", "panel.vista_recientes"], ["buscar", "panel.vista_buscar"]];
    caja().innerHTML =
      '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("panel.gente")) + "</h2></div>" +
      '<p class="suave">' + esc(t(yo.rol === "superadmin" ? "panel.equipo_txt" : "panel.equipo_admin_txt")) + "</p>" +
      '<div class="panel-subvista">' + vistas.map(function (x) {
        return '<button type="button" class="chip-filtro' + (genteVista === x[0] ? " on" : "") + '" data-gente-vista="' + x[0] + '">' + esc(t(x[1])) + "</button>";
      }).join("") + "</div>" +
      (genteVista === "buscar"
        ? '<div class="equipo-buscar"><input id="gente-q" type="search" autocomplete="off" placeholder="' + esc(t("panel.equipo_buscar")) + '">' +
          '<small class="suave">' + esc(t("panel.equipo_buscar_txt")) + "</small></div>" : "") +
      '<div class="panel-scroll" id="gente-tabla"><p class="suave">' + esc(t("comun.cargando")) + "</p></div></section>";
    var q = $("#gente-q");
    if (q) q.addEventListener("input", function () {
      clearTimeout(genteEspera);
      genteEspera = setTimeout(function () { cargarGente(q.value.trim()); }, 280);
    });
    if (genteVista === "buscar") {
      $("#gente-tabla").innerHTML = '<p class="suave">' + esc(t("panel.equipo_min")) + "</p>";
      return;
    }
    return cargarGente("");
  }

  function cargarGente(q) {
    var zona = $("#gente-tabla");
    if (!zona) return;
    if (genteVista === "buscar" && (!q || q.length < 2)) {
      zona.innerHTML = '<p class="suave">' + esc(t("panel.equipo_min")) + "</p>";
      return;
    }
    zona.innerHTML = '<p class="suave">' + esc(t("comun.cargando")) + "</p>";
    var url = apiGente() + "?vista=" + encodeURIComponent(genteVista);
    if (q) url += "&q=" + encodeURIComponent(q);
    return api("GET", url).then(function (resp) {
      var lista = (resp && resp.usuarios) || [];
      if (resp && resp.max_dias) maxDias = resp.max_dias;
      if (!lista.length) {
        zona.innerHTML = '<p class="suave">' + esc(t(genteVista === "staff" ? "panel.equipo_vacio_staff" : "panel.equipo_vacio")) + "</p>";
        return;
      }
      zona.innerHTML = tablaGente(lista, true);
    }).catch(function (er) { zona.innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function clickGente(e) {
    var v = e.target.closest("[data-gente-vista]");
    if (v) { genteVista = v.dataset.genteVista; vistaGente(); return; }
    var g = e.target.closest("[data-guardar-usuario]");
    if (g) {
      var tr = g.closest("[data-usuario]");
      api("POST", apiGente() + "/" + g.dataset.guardarUsuario, {
        rol: tr.querySelector("[data-rol]").value,
        dias: parseInt(tr.querySelector("[data-dias]").value, 10) || 0
      }).then(function () {
        aviso(t("panel.ok"), "ok");
        var q = $("#gente-q");
        cargarGente(q ? q.value.trim() : "");
      }).catch(function (er) { aviso(textoError(er), "mal"); });
      return;
    }
    var b = e.target.closest("[data-borrar-cuenta]");
    if (!b || yo.rol !== "superadmin") return;
    var msg = t("panel.borrar_cuenta_ok").replace("{user}", b.dataset.nombre || "");
    var conf = prompt(msg, "");
    if (!conf) return;
    api("POST", "/api/super/usuarios/" + b.dataset.borrarCuenta + "/borrar", { confirmacion: conf }).then(function () {
      aviso(t("panel.ok"), "ok");
      var q = $("#gente-q");
      cargarGente(q ? q.value.trim() : "");
    }).catch(function (er) { aviso(textoError(er), "mal"); });
  }

  function vistaAudiencia() {
    caja().innerHTML =
      '<section class="panel panel-caja panel-visitas"><div class="panel-cabeza"><h2>' + esc(t("super.visitas")) + "</h2></div>" +
      '<p class="suave">' + esc(t("super.visitas_txt")) + "</p>" +
      '<div id="visitas-resumen" class="visitas-kpi"><p class="suave">' + esc(t("comun.cargando")) + "</p></div>" +
      '<div class="visitas-grid"><div><h3>' + esc(t("super.visitas_por_dia")) + '</h3><div id="visitas-dias"></div></div>' +
      '<div><h3>' + esc(t("super.visitas_por_ruta")) + '</h3><div id="visitas-rutas"></div></div></div></section>';
    var pedido = tab;
    return api("GET", "/api/super/visitas?dias=30").then(function (d) {
      if (tab !== pedido || !$("#visitas-resumen")) return;
      var tot = d.total || {}, hoy = d.hoy || {}, sem = d.semana || {};
      $("#visitas-resumen").innerHTML =
        '<div><b>' + esc(fmtNum(tot.hits)) + "</b><span>" + esc(t("super.visitas_total")) + "</span></div>" +
        '<div><b>' + esc(fmtNum(tot.unicos)) + "</b><span>" + esc(t("super.visitas_unicos")) + "</span></div>" +
        '<div><b>' + esc(fmtNum(hoy.hits)) + "</b><span>" + esc(t("super.visitas_hoy")) + "</span></div>" +
        '<div><b>' + esc(fmtNum(sem.hits)) + "</b><span>" + esc(t("super.visitas_semana")) + "</span></div>";
      var listaDia = d.por_dia || [];
      var dias = $("#visitas-dias");
      if (!listaDia.length) dias.innerHTML = '<p class="suave">' + esc(t("super.visitas_vacio")) + "</p>";
      else {
        var max = Math.max.apply(null, listaDia.map(function (x) { return x.hits || 0; })) || 1;
        dias.innerHTML = '<div class="visitas-barras">' + listaDia.map(function (x) {
          var pct = Math.max(4, Math.round(100 * (x.hits || 0) / max));
          return '<div class="visita-barra" title="' + esc(x.dia) + ": " + (x.hits || 0) + '"><i style="height:' + pct + '%"></i><small>' + esc(String(x.dia).slice(5)) + "</small></div>";
        }).join("") + "</div>";
      }
      var rutas = $("#visitas-rutas");
      var listaRuta = d.por_ruta || [];
      if (!listaRuta.length) rutas.innerHTML = '<p class="suave">' + esc(t("super.visitas_vacio")) + "</p>";
      else rutas.innerHTML = listaRuta.map(function (x) {
        return '<div class="fila-panel visita-ruta"><b>' + esc(x.ruta) + "</b><span>" + esc(fmtNum(x.hits)) + " · " + esc(fmtNum(x.unicos)) + "</span></div>";
      }).join("");
    }).catch(function (er) { $("#visitas-resumen").innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function vistaForo() {
    caja().innerHTML =
      '<section class="panel panel-caja"><div class="panel-cabeza"><h2>' + esc(t("super.foro")) + "</h2></div>" +
      '<p class="suave">' + esc(t("super.foro_txt")) + "</p>" +
      '<details class="panel-plegado"><summary>' + esc(t("super.foro_nueva")) + "</summary>" +
      '<form id="nueva-cat" class="regla-form foro-cat-form">' +
        '<input id="fc-id" required maxlength="24" pattern="[a-z0-9_]{2,24}" placeholder="' + esc(t("super.foro_id")) + '">' +
        '<input id="fc-nombre-es" required maxlength="60" placeholder="' + esc(t("super.foro_nombre_es")) + '">' +
        '<input id="fc-nombre-en" maxlength="60" placeholder="' + esc(t("super.foro_nombre_en")) + '">' +
        '<input id="fc-desc-es" maxlength="200" placeholder="' + esc(t("super.foro_desc_es")) + '">' +
        '<input id="fc-desc-en" maxlength="200" placeholder="' + esc(t("super.foro_desc_en")) + '">' +
        '<input id="fc-icono" maxlength="8" placeholder="' + esc(t("super.foro_icono")) + '" value="📌">' +
        '<input id="fc-orden" type="number" min="0" max="999" value="50">' +
        '<select id="fc-escribir">' +
          '<option value="todos">' + esc(t("super.foro_todos")) + "</option>" +
          '<option value="staff">' + esc(t("super.foro_staff")) + "</option>" +
          '<option value="admin">' + esc(t("super.foro_admin")) + "</option></select>" +
        '<button class="boton oro">' + esc(t("super.foro_crear")) + "</button></form></details>" +
      '<div class="panel-scroll" id="lista-cats"></div></section>';
    $("#nueva-cat").addEventListener("submit", function (e) {
      e.preventDefault();
      api("POST", "/api/super/foro/categorias", {
        id: $("#fc-id").value.trim().toLowerCase(),
        nombre_es: $("#fc-nombre-es").value,
        nombre_en: $("#fc-nombre-en").value || $("#fc-nombre-es").value,
        desc_es: $("#fc-desc-es").value,
        desc_en: $("#fc-desc-en").value || $("#fc-desc-es").value,
        icono: $("#fc-icono").value || "📌",
        orden: parseInt($("#fc-orden").value, 10) || 50,
        escribir: $("#fc-escribir").value,
        activa: true
      }).then(function () {
        aviso(t("panel.ok"), "ok");
        return vistaForo();
      }).catch(function (er) { aviso(textoError(er), "mal"); });
    });
    return cargarForo();
  }

  function catFila(c) {
    var opts = [["todos", "super.foro_todos"], ["staff", "super.foro_staff"], ["admin", "super.foro_admin"]].map(function (x) {
      return '<option value="' + x[0] + '"' + (c.escribir === x[0] ? " selected" : "") + ">" + esc(t(x[1])) + "</option>";
    }).join("");
    return '<tr data-cat="' + esc(c.id) + '"><td><input name="icono" maxlength="8" value="' + esc(c.icono || "📌") + '"></td>' +
      "<td><b>" + esc(c.id) + "</b><small>" + (c.temas || 0) + " " + esc(t("super.foro_temas")) + "</small></td>" +
      '<td><input name="nombre_es" maxlength="60" value="' + esc(c.nombre_es || c.nombre || "") + '"></td>' +
      '<td><input name="nombre_en" maxlength="60" value="' + esc(c.nombre_en || "") + '"></td>' +
      '<td><select name="escribir">' + opts + "</select></td>" +
      '<td><input name="orden" type="number" min="0" max="999" value="' + (c.orden || 0) + '"></td>' +
      '<td><input type="checkbox" name="activa"' + (c.activa ? " checked" : "") + "></td>" +
      '<td><button type="button" class="boton chico" data-guardar-cat="' + esc(c.id) + '">' + esc(t("panel.guardar")) + "</button></td></tr>" +
      '<tr class="panel-cat-mas" data-cat-extra="' + esc(c.id) + '"><td colspan="8">' +
      '<input name="desc_es" maxlength="200" value="' + esc(c.desc_es || c.desc || "") + '" placeholder="' + esc(t("super.foro_desc_es")) + '"> ' +
      '<input name="desc_en" maxlength="200" value="' + esc(c.desc_en || "") + '" placeholder="' + esc(t("super.foro_desc_en")) + '"></td></tr>';
  }

  function cargarForo() {
    var zona = $("#lista-cats");
    return api("GET", "/api/super/foro/categorias").then(function (lista) {
      if (!zona || !$("#lista-cats")) return;
      if (!lista.length) { zona.innerHTML = '<p class="suave">' + esc(t("panel.equipo_vacio")) + "</p>"; return; }
      zona.innerHTML = '<table class="panel-tabla"><thead><tr><th>' + esc(t("super.foro_icono")) + "</th><th>Id</th><th>" +
        esc(t("super.foro_nombre_es")) + "</th><th>" + esc(t("super.foro_nombre_en")) + "</th><th>" +
        esc(t("super.foro_escribir")) + "</th><th>" + esc(t("super.foro_orden")) + "</th><th>" +
        esc(t("super.foro_activa")) + "</th><th></th></tr></thead><tbody>" + lista.map(catFila).join("") + "</tbody></table>";
    }).catch(function (er) { zona.innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function clickForo(e) {
    var b = e.target.closest("[data-guardar-cat]");
    if (!b) return;
    var id = b.dataset.guardarCat;
    var fila = b.closest("[data-cat]");
    var extra = caja().querySelector('[data-cat-extra="' + id + '"]');
    api("POST", "/api/super/foro/categorias/" + encodeURIComponent(id), {
      nombre_es: fila.querySelector('[name="nombre_es"]').value,
      nombre_en: fila.querySelector('[name="nombre_en"]').value,
      desc_es: extra.querySelector('[name="desc_es"]').value,
      desc_en: extra.querySelector('[name="desc_en"]').value,
      icono: fila.querySelector('[name="icono"]').value,
      orden: parseInt(fila.querySelector('[name="orden"]').value, 10) || 0,
      escribir: fila.querySelector('[name="escribir"]').value,
      activa: fila.querySelector('[name="activa"]').checked
    }).then(function () { aviso(t("panel.ok"), "ok"); return cargarForo(); })
      .catch(function (er) { aviso(textoError(er), "mal"); });
  }

  function vistaBot() {
    var pedido = tab;
    return api("GET", "/api/super").then(function (d) {
      if (tab !== pedido) return;
      var disc = d.discord || {};
      caja().innerHTML =
        '<section class="panel panel-caja" id="sec-discord"><h2>' + esc(t("panel.discord")) + "</h2>" +
        '<p class="suave">' + esc(t("panel.discord_txt")) + "</p>" +
        '<form id="discord" class="fila-form">' +
        '<input id="d-servidor" placeholder="' + esc(t("panel.discord_id")) + '" value="' + esc(disc.servidor || "") + '">' +
        '<input id="d-invitacion" placeholder="https://discord.gg/…" value="' + esc(disc.invitacion || "") + '">' +
        '<label class="interruptor"><input type="checkbox" id="d-voz"' + (disc.voz ? " checked" : "") + '><span class="pista"></span>' + esc(t("panel.discord_voz")) + "</label>" +
        '<button class="boton">' + esc(t("panel.guardar")) + "</button></form></section>" +
        '<section class="panel panel-caja panel-bot"><div class="panel-cabeza"><h2>' + esc(t("super.bot")) + "</h2></div>" +
        '<p class="suave">' + esc(t("super.bot_txt")) + "</p>" +
        '<details class="panel-plegado"><summary>' + esc(t("super.bot_nueva")) + "</summary>" +
        '<form id="nueva-regla" class="regla-form">' +
          '<input id="r-patron" required maxlength="80" placeholder="' + esc(t("super.patron")) + '">' +
          '<input id="r-nota" maxlength="40" placeholder="' + esc(t("super.nota")) + '">' +
          '<select id="r-accion"><option value="bloquear">' + esc(t("super.accion_bloquear")) + '</option>' +
            '<option value="revisar" selected>' + esc(t("super.accion_revisar")) + "</option></select>" +
          '<select id="r-ambito"><option value="ambos">' + esc(t("super.ambito_ambos")) + "</option>" +
            '<option value="chat">' + esc(t("super.ambito_chat")) + "</option>" +
            '<option value="foro">' + esc(t("super.ambito_foro")) + "</option></select>" +
          '<button class="boton oro">' + esc(t("super.anadir")) + "</button></form></details>" +
        '<div class="panel-scroll" id="lista-reglas"></div></section>';
      pintarReglas(d.reglas || []);
      $("#discord").addEventListener("submit", function (e) {
        e.preventDefault();
        api("POST", "/api/panel/discord", { servidor: $("#d-servidor").value, invitacion: $("#d-invitacion").value, voz: $("#d-voz").checked })
          .then(function () { aviso(t("panel.ok"), "ok"); })
          .catch(function (er) { aviso(textoError(er), "mal"); });
      });
      $("#nueva-regla").addEventListener("submit", function (e) {
        e.preventDefault();
        api("POST", "/api/super/reglas", {
          patron: $("#r-patron").value, nota: $("#r-nota").value,
          accion: $("#r-accion").value, ambito: $("#r-ambito").value, activa: true
        }).then(function () { aviso(t("panel.ok"), "ok"); return refrescarReglas(); })
          .catch(function (er) { aviso(textoError(er), "mal"); });
      });
    }).catch(function (er) { caja().innerHTML = '<p class="suave">' + esc(textoError(er)) + "</p>"; });
  }

  function reglaHTML(r) {
    return "<tr" + (r.activa ? "" : ' class="off"') + "><td><b>" + esc(r.patron) + "</b></td><td>" + esc(r.nota || "—") + "</td>" +
      "<td>" + esc(t("super.accion_" + r.accion)) + "</td><td>" + esc(t("super.ambito_" + r.ambito)) + "</td>" +
      '<td class="acc"><button type="button" class="boton chico" data-toggle="' + r.id + '" data-on="' + (r.activa ? "1" : "0") + '">' +
      esc(t(r.activa ? "super.desactivar" : "super.activar")) + "</button>" +
      '<button type="button" class="boton chico peligro" data-borrar-regla="' + r.id + '">' + esc(t("super.borrar")) + "</button></td></tr>";
  }

  function pintarReglas(lista) {
    var zona = $("#lista-reglas");
    if (!zona) return;
    if (!lista.length) { zona.innerHTML = '<p class="suave">' + esc(t("panel.equipo_vacio")) + "</p>"; return; }
    zona.innerHTML = '<table class="panel-tabla"><thead><tr><th>' + esc(t("super.patron")) + "</th><th>" + esc(t("super.nota")) +
      "</th><th>" + esc(t("super.accion_revisar")) + "</th><th>" + esc(t("super.ambito_ambos")) + "</th><th></th></tr></thead><tbody>" +
      lista.map(reglaHTML).join("") + "</tbody></table>";
  }

  function refrescarReglas() {
    return api("GET", "/api/super").then(function (n) { pintarReglas(n.reglas || []); });
  }

  function clickBot(e) {
    var tog = e.target.closest("[data-toggle]");
    if (tog) {
      api("POST", "/api/super/reglas/" + tog.dataset.toggle, { activa: tog.dataset.on !== "1" })
        .then(refrescarReglas).catch(function (er) { aviso(textoError(er), "mal"); });
      return;
    }
    var del = e.target.closest("[data-borrar-regla]");
    if (del && confirm(t("super.borrar_ok"))) {
      api("POST", "/api/super/reglas/" + del.dataset.borrarRegla + "/borrar", {})
        .then(refrescarReglas).catch(function (er) { aviso(textoError(er), "mal"); });
    }
  }
}
