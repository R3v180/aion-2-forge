// Espia Builds: busca un personaje (con filtros) y abre su build en solo lectura.
function chipRaza(raza) {
  if (raza === "elyos") return '<span class="chip raza elyos">' + esc(t("espia.elyos")) + "</span>";
  if (raza === "asmodian") return '<span class="chip raza asmodian">' + esc(t("espia.asmodian")) + "</span>";
  return "";
}

function parseListaBusqueda(data) {
  if (Array.isArray(data)) {
    return { lista: data, total: data.length, page: 1, pages: 1, size: data.length, parcial: false, con_poder: false };
  }
  var size = data.size || 20;
  var total = data.total || 0;
  var page = data.page || 1;
  var pages = data.pages || (total ? Math.max(1, Math.ceil(total / size)) : 1);
  return {
    lista: data.lista || [],
    total: total,
    page: page,
    pages: pages,
    size: size,
    parcial: !!data.parcial,
    con_poder: !!data.con_poder
  };
}

function optsClase(sel) {
  return '<option value="">' + esc(t("espia.filtro_todas")) + "</option>" +
    CLASES_INFO.map(function (c) {
      return '<option value="' + c.id + '"' + (sel === c.id ? " selected" : "") + ">" + esc(tr(c)) + "</option>";
    }).join("");
}

function optsNivel(sel) {
  var h = '<option value="">' + esc(t("espia.filtro_cualquier_nv")) + "</option>";
  for (var n = 45; n >= 1; n--) {
    h += '<option value="' + n + '"' + (String(sel) === String(n) ? " selected" : "") + ">" + n + "</option>";
  }
  return h;
}

function optsRaza(sel) {
  return '<option value="">' + esc(t("espia.filtro_cualquier_raza")) + "</option>" +
    '<option value="elyos"' + (sel === "elyos" ? " selected" : "") + ">" + esc(t("espia.elyos")) + "</option>" +
    '<option value="asmodian"' + (sel === "asmodian" ? " selected" : "") + ">" + esc(t("espia.asmodian")) + "</option>";
}

function optsServidor(lista, sel) {
  var h = '<option value="">' + esc(t("espia.filtro_cualquier_srv")) + "</option>";
  (lista || []).forEach(function (s) {
    var marca = s.raza === "elyos" ? " · E" : (s.raza === "asmodian" ? " · A" : "");
    h += '<option value="' + s.id + '"' + (String(sel) === String(s.id) ? " selected" : "") + ">" +
      esc(s.nombre) + marca + "</option>";
  });
  return h;
}

function poderFmt(n) {
  if (n == null || n === "") return "";
  n = Number(n);
  if (!isFinite(n)) return "";
  if (n >= 1000) return (Math.round(n / 100) / 10) + "K";
  return String(n);
}

function pintarResultadosEspia(caja, lista) {
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
    if (p.region) meta.push(esc(String(p.region).toUpperCase()));
    var kpis = "";
    if (p.poder != null || p.nivel_objeto) {
      kpis = '<div class="espia-card-kpis">';
      if (p.poder != null) {
        kpis += '<div class="espia-card-kpi"><span>' + esc(t("juego.poder")) + "</span><b>" + esc(poderFmt(p.poder)) + "</b></div>";
      }
      if (p.nivel_objeto) {
        kpis += '<div class="espia-card-kpi"><span>' + esc(t("espia.ilvl")) + "</span><b>" + esc(String(p.nivel_objeto)) + "</b></div>";
      }
      kpis += "</div>";
    }
    return '<a class="espia-card raza-' + esc(p.raza || "x") + '" href="build.html?cid=' + encodeURIComponent(p.character_id) +
      "&server=" + encodeURIComponent(p.server_id) + '">' +
      '<div class="espia-foto">' + foto + emb + "</div>" +
      '<div class="espia-txt">' +
      '<div class="espia-top"><b>' + esc(p.nombre) + "</b>" + chipRaza(p.raza) + "</div>" +
      '<div class="espia-server">' + esc(p.servidor || "—") + "</div>" +
      '<div class="espia-meta">' + meta.join(" · ") + "</div>" +
      '<em>' + esc(t("espia.ver")) + " →</em></div>" + kpis + "</a>";
  }).join("");
  caja.querySelectorAll(".espia-card").forEach(function (a) {
    a.addEventListener("click", function () {
      a.classList.add("abriendo");
      var em = a.querySelector("em");
      if (em) em.textContent = t("espia.abriendo");
    });
  });
}

function pintarPaginacionEspia(nav, r, onPage, sufijo) {
  if (!nav) return;
  sufijo = sufijo || "";
  if (!r || r.pages <= 1) {
    nav.innerHTML = "";
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  var idPrev = "espia-prev" + sufijo, idNext = "espia-next" + sufijo;
  var prevDis = r.page <= 1 ? " disabled" : "";
  var nextDis = r.page >= r.pages ? " disabled" : "";
  nav.innerHTML =
    '<button type="button" class="boton" id="' + idPrev + '"' + prevDis + ">" + esc(t("espia.anterior")) + "</button>" +
    '<span class="espia-pag-info">' + esc(t("espia.pagina").replace("{p}", String(r.page)).replace("{n}", String(r.pages))) + "</span>" +
    '<button type="button" class="boton" id="' + idNext + '"' + nextDis + ">" + esc(t("espia.siguiente")) + "</button>";
  var prev = $("#" + idPrev), next = $("#" + idNext);
  if (prev) prev.addEventListener("click", function () { if (r.page > 1) onPage(r.page - 1); });
  if (next) next.addEventListener("click", function () { if (r.page < r.pages) onPage(r.page + 1); });
}

function refrescarPaginacionEspia(r, onPage) {
  pintarPaginacionEspia($("#espia-pag"), r, onPage, "");
  pintarPaginacionEspia($("#espia-pag-bajo"), r, onPage, "-b");
}

function queryBusquedaEspia(form) {
  var qEl = form.querySelector("[name=q]") || form.querySelector("#espia-q");
  var q = qEl ? String(qEl.value || "").trim() : "";
  var p = new URLSearchParams();
  if (q) p.set("q", q);
  var clase = (form.querySelector("[name=clase]") || {}).value;
  var nivel = (form.querySelector("[name=nivel]") || {}).value;
  var raza = (form.querySelector("[name=raza]") || {}).value;
  var server = (form.querySelector("[name=server]") || {}).value;
  var poderMin = (form.querySelector("[name=poder_min]") || {}).value;
  var ordenar = form.querySelector("[name=ordenar_poder]");
  if (clase) p.set("clase", clase);
  if (nivel) p.set("nivel", nivel);
  if (raza) p.set("raza", raza);
  if (server) p.set("server", server);
  if (poderMin) p.set("poder_min", poderMin);
  if (ordenar && ordenar.checked) p.set("ordenar", "poder");
  return p;
}

function paginaEspia() {
  var main = $("#main");
  var ultima = { params: null, page: 1 };

  cabecera("espia").then(function () {
    if (!YO) {
      main.innerHTML = '<section class="cabeza-seccion espia-cabeza"><span class="antetitulo">' + esc(t("espia.antetitulo")) +
        "</span><h1>" + esc(t("espia.titulo")) + '</h1><p class="suave">' + esc(t("espia.sub")) + "</p></section>" +
        '<div class="panel espia-login"><p>' + esc(t("espia.login")) + '</p>' +
        '<a class="boton oro" href="entrar.html?volver=' + encodeURIComponent("/espia.html") + '">' + esc(t("espia.entrar")) + "</a></div>";
      return;
    }
    main.innerHTML = '<section class="cabeza-seccion espia-cabeza"><span class="antetitulo">' + esc(t("espia.antetitulo")) +
      "</span><h1>" + esc(t("espia.titulo")) + '</h1><p class="suave">' + esc(t("espia.sub")) + "</p></section>" +
      '<form class="espia-busqueda" id="espia-form">' +
      '<div class="espia-form">' +
      '<input name="q" id="espia-q" maxlength="24" minlength="2" required autocomplete="off" placeholder="' + esc(t("espia.placeholder")) + '">' +
      '<button class="boton oro" type="submit">' + esc(t("espia.buscar")) + "</button></div>" +
      '<div class="espia-filtros">' +
      '<label><span>' + esc(t("espia.clase")) + '</span><select name="clase" id="espia-clase">' + optsClase("") + "</select></label>" +
      '<label><span>' + esc(t("juego.nv")) + '</span><select name="nivel" id="espia-nivel">' + optsNivel("") + "</select></label>" +
      '<label><span>' + esc(t("espia.facción")) + '</span><select name="raza" id="espia-raza">' + optsRaza("") + "</select></label>" +
      '<label><span>' + esc(t("espia.servidor")) + '</span><select name="server" id="espia-server"><option value="">...</option></select></label>' +
      '<label><span>' + esc(t("espia.poder_min")) + '</span><input name="poder_min" id="espia-poder" type="number" min="0" step="1000" placeholder="50000"></label>' +
      '<label class="espia-check"><input type="checkbox" name="ordenar_poder" id="espia-ordenar"> <span>' + esc(t("espia.ordenar_poder")) + "</span></label>" +
      "</div>" +
      '<p class="suave espia-filtro-hint">' + esc(t("espia.filtros_hint")) + "</p>" +
      "</form>" +
      '<div class="espia-estado-fila">' +
      '<p class="suave" id="espia-estado"></p>' +
      '<nav class="espia-pag" id="espia-pag" hidden></nav>' +
      "</div>" +
      '<div class="espia-res" id="espia-res"></div>' +
      '<nav class="espia-pag" id="espia-pag-bajo" hidden></nav>';

    api("GET", "/api/juego/servidores").then(function (lista) {
      var sel = $("#espia-server");
      if (sel) sel.innerHTML = optsServidor(lista, "");
    }).catch(function () {});

    function ejecutarBusqueda(page) {
      var form = $("#espia-form"), estado = $("#espia-estado"), caja = $("#espia-res");
      if (!form) return;
      var params = queryBusquedaEspia(form);
      var q = (params.get("q") || "").trim();
      if (q.length < 2) {
        estado.textContent = t("espia.filtro_necesario");
        var inp = $("#espia-q");
        if (inp) inp.focus();
        return;
      }
      page = Math.max(1, parseInt(page, 10) || 1);
      params.set("page", String(page));
      params.set("size", "20");
      ultima = { params: params, page: page };
      estado.textContent = t("espia.buscando_poder");
      caja.innerHTML = "";
      refrescarPaginacionEspia({ pages: 0 }, ejecutarBusqueda);
      api("GET", "/api/juego/buscar?" + params.toString()).then(function (data) {
        var r = parseListaBusqueda(data);
        if (!r.lista.length) {
          estado.textContent = page > 1 ? t("espia.vacio_pagina") : t("espia.vacio");
          refrescarPaginacionEspia(r, ejecutarBusqueda);
          return;
        }
        var msg = t("espia.resultado")
          .replace("{n}", String(r.lista.length))
          .replace("{p}", String(r.page))
          .replace("{pages}", String(r.pages))
          .replace("{total}", String(r.total));
        estado.textContent = msg;
        pintarResultadosEspia(caja, r.lista);
        refrescarPaginacionEspia(r, ejecutarBusqueda);
        try { window.scrollTo({ top: form.offsetTop - 12, behavior: "smooth" }); } catch (e) {}
      }).catch(function (er) { estado.textContent = textoError(er); });
    }

    $("#espia-form").addEventListener("submit", function (e) {
      e.preventDefault();
      ejecutarBusqueda(1);
    });

    var pre = param("q");
    if (pre) {
      $("#espia-q").value = pre;
      ejecutarBusqueda(1);
    }
  });
}
