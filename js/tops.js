// Tops comunitarios: carnets avistados en Espía (poder / iLvl).
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

function pintarListaTops(caja, lista) {
  if (!lista.length) {
    caja.innerHTML = '<p class="suave">' + esc(t("tops.vacio")) + "</p>";
    return;
  }
  caja.innerHTML = lista.map(function (p) {
    var foto = /^https:\/\/(profileimg\.plaync\.com|assets\.playnccdn\.com)\//.test(p.imagen || "")
      ? '<img src="' + esc(p.imagen) + '" alt="">' : '<span class="espia-sin-foto"></span>';
    var clase = p.clase ? claseInfo(p.clase) : null;
    var emb = clase
      ? '<img class="espia-clase" src="icons/clases/' + clase.id + '.webp" alt="" title="' + esc(tr(clase)) + '">'
      : "";
    var meta = [];
    if (clase) meta.push(esc(tr(clase)));
    meta.push(esc(t("juego.nv")) + " " + (p.nivel || "—"));
    var puesto = Number(p.puesto) || 0;
    var medalla = puesto <= 3 ? " top-" + puesto : "";
    return '<a class="tops-card raza-' + esc(p.raza || "x") + '" href="build.html?cid=' + encodeURIComponent(p.character_id) +
      "&server=" + encodeURIComponent(p.server_id) + '">' +
      '<div class="tops-puesto' + medalla + '">#' + puesto + "</div>" +
      '<div class="espia-foto">' + foto + emb + "</div>" +
      '<div class="espia-txt">' +
      '<div class="espia-top"><b>' + esc(p.nombre) + "</b>" + chipRazaTop(p.raza) + "</div>" +
      '<div class="espia-server">' + esc(p.servidor || "—") + "</div>" +
      '<div class="espia-meta">' + meta.join(" · ") + "</div>" +
      "</div>" +
      '<div class="espia-card-kpis">' +
      '<div class="espia-card-kpi"><span>' + esc(t("juego.poder")) + "</span><b>" + esc(poderFmtTop(p.poder)) + "</b></div>" +
      '<div class="espia-card-kpi"><span>' + esc(t("espia.ilvl")) + "</span><b>" + esc(p.nivel_objeto != null ? String(p.nivel_objeto) : "—") + "</b></div>" +
      "</div></a>";
  }).join("");
}

function paginaTops() {
  var main = $("#main");
  cabecera("tops").then(function () {
    if (!YO) {
      main.innerHTML = '<section class="cabeza-seccion tops-cabeza"><span class="antetitulo">' + esc(t("tops.antetitulo")) +
        "</span><h1>" + esc(t("tops.titulo")) + '</h1><p class="suave">' + esc(t("tops.sub")) + "</p></section>" +
        '<div class="panel espia-login"><p>' + esc(t("tops.login")) + '</p>' +
        '<a class="boton oro" href="entrar.html?volver=' + encodeURIComponent("/tops.html") + '">' + esc(t("espia.entrar")) + "</a></div>";
      return;
    }
    main.innerHTML = '<section class="cabeza-seccion tops-cabeza"><span class="antetitulo">' + esc(t("tops.antetitulo")) +
      "</span><h1>" + esc(t("tops.titulo")) + '</h1><p class="suave">' + esc(t("tops.sub")) + "</p></section>" +
      '<form class="tops-filtros" id="tops-form">' +
      '<label><span>' + esc(t("tops.ambito")) + '</span><select name="ambito" id="tops-ambito">' +
      '<option value="eu">' + esc(t("tops.ambito_eu")) + "</option>" +
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
      '<div class="tops-res" id="tops-res"></div>' +
      '<p class="suave tops-pie"><a href="espia.html">' + esc(t("tops.ir_espia")) + "</a></p>";

    var form = $("#tops-form"), ambito = $("#tops-ambito"), wrapSrv = $("#tops-server-wrap"), selSrv = $("#tops-server");

    function syncServer() {
      wrapSrv.hidden = ambito.value !== "server";
    }
    ambito.addEventListener("change", syncServer);
    syncServer();

    api("GET", "/api/juego/servidores").then(function (lista) {
      if (selSrv) selSrv.innerHTML = optsServidorTop(lista, "");
    }).catch(function () {});

    function cargar() {
      var estado = $("#tops-estado"), caja = $("#tops-res");
      var p = new URLSearchParams();
      p.set("ambito", ambito.value || "eu");
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
        pintarListaTops(caja, lista);
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
