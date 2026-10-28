// Tops comunitarios: carnets avistados en Espía (poder / iLvl).
var TOPS_REGIONES = ["eu", "naw", "nae", "la", "as"];
var TOPS_REGION_STORE = "oc:espia:region";

function poderFmtTop(n) {
  if (n == null || n === "") return "—";
  n = Number(n);
  if (!isFinite(n)) return "—";
  if (n >= 1000) return (Math.round(n / 100) / 10) + "K";
  return String(n);
}

function chipRazaTop(raza) {
  if (raza === "elyos") return '<span class="chip raza elyos">' + esc(t("espia.elyos")) + "</span>";
  if (raza === "asmodian") return '<span class="chip raza asmodian">' + esc(t("espia.asmodian")) + "</span>";
  return "";
}

function leerRegionTops() {
  var q = param("region");
  if (q && TOPS_REGIONES.indexOf(q) >= 0) return q;
  try {
    var s = localStorage.getItem(TOPS_REGION_STORE);
    if (s && TOPS_REGIONES.indexOf(s) >= 0) return s;
  } catch (e) {}
  return "eu";
}

function guardarRegionTops(r) {
  try { localStorage.setItem(TOPS_REGION_STORE, r); } catch (e) {}
}

function optsRegionTops(sel) {
  return TOPS_REGIONES.map(function (r) {
    return '<option value="' + r + '"' + (sel === r ? " selected" : "") + ">" +
      esc(t("region." + r)) + "</option>";
  }).join("");
}

function optsClaseTop(sel) {
  return '<option value="">' + esc(t("espia.filtro_todas")) + "</option>" +
    CLASES_INFO.map(function (c) {
      return '<option value="' + c.id + '"' + (sel === c.id ? " selected" : "") + ">" + esc(tr(c)) + "</option>";
    }).join("");
}

function optsServidorTop(lista, sel) {
  var h = '<option value="">' + esc(t("tops.elige_servidor")) + "</option>";
  (lista || []).forEach(function (s) {
    var marca = s.raza === "elyos" ? " · E" : (s.raza === "asmodian" ? " · A" : "");
    h += '<option value="' + s.id + '"' + (String(sel) === String(s.id) ? " selected" : "") + ">" +
      esc(s.nombre) + marca + "</option>";
  });
  return h;
}

function pintarCardTop(p, puesto) {
  var foto = /^https:\/\/(profileimg\.plaync\.com|assets\.playnccdn\.com)\//.test(p.imagen || "")
    ? '<img src="' + esc(p.imagen) + '" alt="">' : '<span class="espia-sin-foto"></span>';
  var clase = p.clase ? claseInfo(p.clase) : null;
  var emb = clase
    ? '<img class="espia-clase" src="icons/clases/' + clase.id + '.webp" alt="" title="' + esc(tr(clase)) + '">'
    : "";
  var meta = [];
  if (clase) meta.push(esc(tr(clase)));
  meta.push(esc(t("juego.nv")) + " " + (p.nivel || "—"));
  if (p.region) meta.push(esc(String(p.region).toUpperCase()));
  var puestoNum = Number(puesto != null ? puesto : p.puesto) || 0;
  var medalla = puestoNum <= 3 ? " top-" + puestoNum : "";
  var podioClass = puestoNum <= 3 ? " top-podio-" + puestoNum : "";
  var href = "build.html?cid=" + encodeURIComponent(p.character_id) +
    "&server=" + encodeURIComponent(p.server_id) +
    "&region=" + encodeURIComponent(p.region || "eu");
  return '<a class="tops-card raza-' + esc(p.raza || "x") + podioClass + '" href="' + href + '" title="' + esc(t("tops.espia_build")) + '">' +
    '<div class="tops-puesto' + medalla + '">#' + puestoNum + "</div>" +
    '<div class="espia-foto">' + foto + emb + "</div>" +
    '<div class="espia-txt">' +
    '<div class="espia-top"><b>' + esc(p.nombre) + "</b>" + chipRazaTop(p.raza) + "</div>" +
    '<div class="espia-server">' + esc(p.servidor || "—") + "</div>" +
    '<div class="espia-meta">' + meta.join(" · ") + "</div>" +
    '<em class="tops-cta"><span class="boton-espia-ico" aria-hidden="true"></span>' + esc(t("tops.espia_build")) + " →</em>" +
    "</div>" +
    '<div class="espia-card-kpis">' +
    '<div class="espia-card-kpi"><span>' + esc(t("juego.poder")) + "</span><b>" + esc(poderFmtTop(p.poder)) + "</b></div>" +
    '<div class="espia-card-kpi"><span>' + esc(t("espia.ilvl")) + "</span><b>" + esc(p.nivel_objeto != null ? String(p.nivel_objeto) : "—") + "</b></div>" +
    "</div></a>";
}

function pintarListaTops(caja, data, claseFiltro) {
  var lista = (data && data.lista) || [];
  if (!lista.length && (!data || !data.por_clase)) {
    caja.innerHTML = '<p class="suave">' + esc(t("tops.vacio")) + "</p>";
    return;
  }

  // Si hay filtro por clase específica, pintamos la lista directa de esa clase
  if (claseFiltro || !data.por_clase) {
    caja.innerHTML = '<div class="tops-res">' + lista.map(function (p) {
      return pintarCardTop(p);
    }).join("") + "</div>";
    return;
  }

  // Vista estructurada: 1) Top 10 General + 2) Top 4 por clase
  var general = (data.general && data.general.length) ? data.general : lista.slice(0, 10);
  var porClase = data.por_clase || {};

  var html = "";

  // 1. Top 10 General
  if (general.length) {
    html += '<section class="tops-bloque tops-bloque-general">' +
      '<div class="tops-bloque-cab">' +
      '<div class="tops-bloque-txt">' +
      '<span class="antetitulo">' + esc(t("tops.sec_general_antetitulo")) + "</span>" +
      "<h2>🏆 " + esc(t("tops.sec_top_general")) + "</h2>" +
      '<p class="suave">' + esc(t("tops.sec_top_general_sub")) + "</p>" +
      "</div>" +
      "</div>" +
      '<div class="tops-res tops-res-general">' +
      general.map(function (p, idx) { return pintarCardTop(p, idx + 1); }).join("") +
      "</div>" +
      "</section>";
  }

  // 2. Top 4 por clase
  html += '<section class="tops-bloque tops-bloque-clases">' +
    '<div class="tops-bloque-cab">' +
    '<div class="tops-bloque-txt">' +
    '<span class="antetitulo">' + esc(t("tops.sec_clases_antetitulo")) + "</span>" +
    "<h2>⚔️ " + esc(t("tops.sec_top_clases")) + "</h2>" +
    '<p class="suave">' + esc(t("tops.sec_top_clases_sub")) + "</p>" +
    "</div>" +
    "</div>" +
    '<div class="tops-clases-rejilla">';

  CLASES_INFO.forEach(function (c) {
    var pjs = porClase[c.id] || [];
    if (!pjs.length) return;
    html += '<div class="tops-clase-grupo">' +
      '<div class="tops-clase-cab">' +
      '<img class="tops-clase-ico" src="icons/clases/' + c.id + '.webp" alt="">' +
      "<div>" +
      "<h3>" + esc(tr(c)) + "</h3>" +
      '<small class="suave">' + esc(tr(c.rol) || "") + "</small>" +
      "</div>" +
      "</div>" +
      '<div class="tops-res tops-res-clase">' +
      pjs.map(function (p, idx) { return pintarCardTop(p, idx + 1); }).join("") +
      "</div>" +
      "</div>";
  });

  html += "</div></section>";

  caja.innerHTML = html;
}


function paginaTops() {
  var main = $("#main");
  var regionActiva = leerRegionTops();
  cabecera("tops").then(function () {
    main.innerHTML = '<section class="cabeza-seccion tops-cabeza"><span class="antetitulo">' + esc(t("tops.antetitulo")) +
      "</span><h1>" + esc(t("tops.titulo")) + '</h1><p class="suave">' + esc(t("tops.sub")) + "</p></section>" +
      '<form class="tops-filtros" id="tops-form">' +
      '<label><span>' + esc(t("espia.region")) + '</span><select name="region" id="tops-region">' +
      optsRegionTops(regionActiva) + "</select></label>" +
      '<label><span>' + esc(t("tops.ambito")) + '</span><select name="ambito" id="tops-ambito">' +
      '<option value="all">' + esc(t("tops.ambito_all")) + "</option>" +
      '<option value="elyos">' + esc(t("tops.ambito_elyos")) + "</option>" +
      '<option value="asmodian">' + esc(t("tops.ambito_asmodian")) + "</option>" +
      '<option value="server">' + esc(t("tops.ambito_server")) + "</option>" +
      "</select></label>" +
      '<label id="tops-server-wrap" hidden><span>' + esc(t("espia.servidor")) + "</span>" +
      '<select name="server" id="tops-server"><option value="">...</option></select></label>' +
      '<label><span>' + esc(t("espia.clase")) + '</span><select name="clase" id="tops-clase">' + optsClaseTop("") + "</select></label>" +
      '<label><span>' + esc(t("tops.orden")) + '</span><select name="orden" id="tops-orden">' +
      '<option value="poder">' + esc(t("tops.orden_poder")) + "</option>" +
      '<option value="ilvl">' + esc(t("tops.orden_ilvl")) + "</option>" +
      "</select></label>" +
      '<button class="boton oro" type="submit">' + esc(t("tops.ver")) + "</button>" +
      "</form>" +
      '<p class="suave tops-aviso">' + esc(t("tops.aviso")) + "</p>" +
      '<p class="suave" id="tops-estado"></p>' +
      '<div id="tops-res" class="tops-contenedor"></div>' +
      '<p class="suave tops-pie"><a href="espia.html">' + esc(t("tops.ir_espia")) + "</a></p>";


    var form = $("#tops-form"), ambito = $("#tops-ambito"), wrapSrv = $("#tops-server-wrap"), selSrv = $("#tops-server");
    var selRegion = $("#tops-region");

    function syncServer() {
      wrapSrv.hidden = ambito.value !== "server";
    }
    ambito.addEventListener("change", syncServer);
    syncServer();

    function cargarServidores(region) {
      if (!selSrv) return;
      selSrv.innerHTML = '<option value="">...</option>';
      api("GET", "/api/juego/servidores?region=" + encodeURIComponent(region)).then(function (data) {
        var lista = Array.isArray(data) ? data : (data.lista || []);
        selSrv.innerHTML = optsServidorTop(lista, "");
      }).catch(function () {});
    }

    cargarServidores(regionActiva);
    selRegion.addEventListener("change", function () {
      regionActiva = this.value || "eu";
      guardarRegionTops(regionActiva);
      cargarServidores(regionActiva);
    });

    function cargar() {
      var estado = $("#tops-estado"), caja = $("#tops-res");
      var p = new URLSearchParams();
      regionActiva = (selRegion || {}).value || "eu";
      guardarRegionTops(regionActiva);
      p.set("region", regionActiva);
      p.set("ambito", ambito.value || "all");
      p.set("orden", ($("#tops-orden") || {}).value || "poder");
      var clase = ($("#tops-clase") || {}).value;
      if (clase) p.set("clase", clase);
      if (ambito.value === "server") {
        var sid = (selSrv || {}).value;
        if (!sid) {
          estado.textContent = t("tops.elige_servidor");
          caja.innerHTML = "";
          return;
        }
        p.set("server", sid);
      }
      p.set("limit", "50");
      estado.textContent = t("tops.cargando");
      caja.innerHTML = "";
      api("GET", "/api/tops?" + p.toString()).then(function (data) {
        var lista = (data && data.lista) || [];
        estado.textContent = t("tops.resultado")
          .replace("{n}", String(lista.length))
          .replace("{total}", String(data.total || 0));
        pintarListaTops(caja, data, clase);
      }).catch(function (er) {

        estado.textContent = textoError(er);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      cargar();
    });
    cargar();
  });
}
