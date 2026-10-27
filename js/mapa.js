/* Mapa interactivo Orden Celeste: filtros por capa + marcadores Leaflet */
(function () {
  var COLORES = {
    recoleccion: "#5ec8ff",
    mascotas: "#c084fc",
    jefes: "#ef6b6b",
    cubos: "#e0b864",
    rastros: "#6fd39a",
    kibelisks: "#5fd3e8",
    lugares: "#a8b0c0",
    mazmorras: "#f0a060",
    grietas: "#d48cff",
    monolitos: "#ffe08a"
  };
  var DEFECTO_ON = { kibelisks: true };

  var indice = null;
  var mapaDatos = null;
  var zona = param("z") || "altgard";
  var q = "";
  var activo = {};
  var map = null;
  var overlay = null;
  var layerGroup = null;
  var imgSize = { w: 2303, h: 2400 };
  var abiertas = { recoleccion: true };

  function nombreItem(it) {
    var base = (IDIOMA === "es" && it.nes) ? it.nes : it.n;
    // Fallback: si el título sigue genérico, anteponer zona/tipo del detalle
    if (/^(empyrean trace|rastro empyreo|hidden cube|cubo oculto)/i.test(base)) {
      var extra = [];
      if (it.s && !/posibles|gathering|rastros|level\s+\d+/i.test(it.s) && base.toLowerCase().indexOf(String(it.s).toLowerCase()) < 0) extra.push(it.s);
      if (it.f && !/hidden cube/i.test(it.f) && base.toLowerCase().indexOf(String(it.f).toLowerCase()) < 0) extra.push(it.f);
      if (extra.length) base = extra.join(" · ") + " · " + base;
    }
    return base;
  }
  function claveItem(capaId, it) {
    return capaId + "::" + it.id;
  }
  function loadJSON(ruta) {
    return fetch(ruta).then(function (r) {
      if (!r.ok) throw new Error("mapa");
      return r.json();
    });
  }
  function imgNatural(src) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res({ w: im.naturalWidth || 2303, h: im.naturalHeight || 2400 }); };
      im.onerror = function () { res({ w: 2303, h: 2400 }); };
      im.src = src;
    });
  }
  function toLatLng(pt, crs, size) {
    var x = pt[0] / crs * size.w;
    var y = pt[1] / crs * size.h;
    return [size.h - y, x];
  }
  function facLabel(fac) {
    if (fac === "elyos") return "Elyos";
    if (fac === "asmodian") return "Asmodian";
    if (fac === "abyss") return IDIOMA === "es" ? "Abismo" : "Abyss";
    return fac || "";
  }
  function pintarSelect() {
    var sel = $("#mapa-zona");
    sel.innerHTML = (indice.mapas || []).map(function (m) {
      return '<option value="' + esc(m.slug) + '"' + (m.slug === zona ? " selected" : "") + ">" +
        esc(m.nombre) + " · " + facLabel(m.fac) + "</option>";
    }).join("");
  }
  function asegurarActivos() {
    Object.keys(activo).forEach(function (k) {
      if (activo[k] == null) delete activo[k];
    });
  }
  function itemsVisibles(capaId) {
    var lista = (mapaDatos.capas && mapaDatos.capas[capaId]) || [];
    if (!q) return lista;
    var qq = q.toLowerCase();
    return lista.filter(function (it) {
      return nombreItem(it).toLowerCase().indexOf(qq) >= 0 ||
        (it.f && String(it.f).toLowerCase().indexOf(qq) >= 0) ||
        (it.s && String(it.s).toLowerCase().indexOf(qq) >= 0);
    });
  }
  function contarActivos(capaId) {
    var items = itemsVisibles(capaId);
    var on = 0;
    items.forEach(function (it) {
      if (activo[claveItem(capaId, it)]) on++;
    });
    return { on: on, total: items.length };
  }
  function pintarCapas() {
    var caja = $("#mapa-capas");
    if (!indice || !mapaDatos) { caja.innerHTML = ""; return; }
    caja.innerHTML = (indice.capas || []).map(function (c) {
      var items = itemsVisibles(c.id);
      if (!items.length && q) return "";
      var ct = contarActivos(c.id);
      var abierta = !!abiertas[c.id] || (!!q && items.length > 0);
      return '<section class="mapa-capa' + (abierta ? " abierta" : "") + '" data-capa="' + c.id + '">' +
        '<header>' +
          '<button type="button" class="mapa-capa-toggle" data-toggle="' + c.id + '">' +
            '<b style="--c:' + (COLORES[c.id] || "#fff") + '">' + esc(tr(c)) + "</b>" +
            "<small>" + ct.on + " / " + ct.total + "</small>" +
          "</button>" +
          '<span class="mapa-capa-acciones">' +
            '<button type="button" data-capa-all="' + c.id + '">' + esc(t("mapa.todas")) + "</button>" +
            '<button type="button" data-capa-none="' + c.id + '">' + esc(t("mapa.ninguna")) + "</button>" +
          "</span>" +
        "</header>" +
        '<ul>' + items.map(function (it) {
          var k = claveItem(c.id, it);
          var checked = !!activo[k];
          var nom = nombreItem(it);
          var tip = [nom, it.f && it.f !== it.n ? it.f : "", it.s || ""].filter(Boolean).join(" · ");
          return '<li><label title="' + esc(tip) + '">' +
            '<input type="checkbox" data-item="' + esc(k) + '"' + (checked ? " checked" : "") + ">" +
            '<span class="punto" style="background:' + (COLORES[c.id] || "#fff") + '"></span>' +
            '<span class="nom">' + esc(nom) + "</span>" +
            "<em>" + it.pts.length + "</em></label></li>";
        }).join("") + "</ul></section>";
    }).join("");
  }
  function setRapido(modo) {
    activo = {};
    if (modo === "none") { pintarCapas(); pintarMarcadores(); return; }
    (indice.capas || []).forEach(function (c) {
      var encender = modo === "all" || !!DEFECTO_ON[c.id];
      if (!encender) return;
      ((mapaDatos.capas && mapaDatos.capas[c.id]) || []).forEach(function (it) {
        activo[claveItem(c.id, it)] = true;
      });
    });
    pintarCapas();
    pintarMarcadores();
  }
  function pintarMarcadores() {
    if (!map || !mapaDatos) return;
    if (layerGroup) layerGroup.clearLayers();
    else layerGroup = L.layerGroup().addTo(map);
    var crs = mapaDatos.crs || 9600;
    var n = 0;
    (indice.capas || []).forEach(function (c) {
      var color = COLORES[c.id] || "#fff";
      ((mapaDatos.capas && mapaDatos.capas[c.id]) || []).forEach(function (it) {
        if (!activo[claveItem(c.id, it)]) return;
        if (q) {
          var qq = q.toLowerCase();
          var hit = nombreItem(it).toLowerCase().indexOf(qq) >= 0 ||
            (it.f && String(it.f).toLowerCase().indexOf(qq) >= 0);
          if (!hit) return;
        }
        it.pts.forEach(function (pt) {
          var ll = toLatLng(pt, crs, imgSize);
          L.circleMarker(ll, {
            radius: c.id === "recoleccion" || c.id === "mascotas" ? 4 : 6,
            color: "#0b0d12",
            weight: 1,
            fillColor: color,
            fillOpacity: 0.92
          }).bindTooltip(
            "<b>" + esc(nombreItem(it)) + "</b><br>" + esc(tr(c)) +
            (it.s ? "<br>" + esc(it.s) : "") +
            (it.f ? "<br>" + esc(it.f) : ""),
            { sticky: true }
          ).addTo(layerGroup);
          n++;
        });
      });
    });
    $("#mapa-estado").textContent = t("mapa.marcadores").replace("{n}", String(n));
  }
  function montarMapa() {
    return imgNatural(mapaDatos.img).then(function (size) {
      imgSize = size;
      var bounds = [[0, 0], [size.h, size.w]];
      if (!map) {
        map = L.map("mapa-leaflet", {
          crs: L.CRS.Simple,
          minZoom: -2,
          maxZoom: 3,
          zoomSnap: 0.25,
          attributionControl: true
        });
        map.attributionControl.setPrefix("");
        map.attributionControl.addAttribution(esc(t("mapa.fuente")));
      } else {
        map.eachLayer(function (ly) {
          if (ly === overlay) map.removeLayer(ly);
        });
      }
      if (overlay) map.removeLayer(overlay);
      overlay = L.imageOverlay(mapaDatos.img, bounds).addTo(map);
      map.fitBounds(bounds);
      if (layerGroup) { map.removeLayer(layerGroup); layerGroup = null; }
      pintarMarcadores();
    });
  }
  function cargarZona(slug) {
    zona = slug;
    history.replaceState(null, "", "mapa.html?z=" + encodeURIComponent(zona) + (q ? "&q=" + encodeURIComponent(q) : ""));
    $("#mapa-estado").textContent = t("comun.cargando");
    return loadJSON("data/mapa/" + slug + ".json").then(function (d) {
      mapaDatos = d;
      setRapido("default");
      return montarMapa();
    }).catch(function () {
      $("#mapa-estado").textContent = t("mapa.error");
    });
  }

  cabecera("mapa");
  traducirPagina();
  document.querySelectorAll("[data-t-ph]").forEach(function (el) {
    el.placeholder = t(el.getAttribute("data-t-ph"));
  });

  $("#mapa-toggle").addEventListener("click", function () {
    var open = document.body.classList.toggle("mapa-panel-cerrado");
    this.setAttribute("aria-expanded", open ? "false" : "true");
  });
  $("#mapa-zona").addEventListener("change", function () {
    cargarZona(this.value);
  });
  $("#mapa-q").addEventListener("input", function () {
    q = this.value.trim();
    pintarCapas();
    pintarMarcadores();
  });
  document.querySelector(".mapa-rapidos").addEventListener("click", function (e) {
    var b = e.target.closest("[data-rapido]");
    if (!b) return;
    document.querySelectorAll(".mapa-rapidos button").forEach(function (x) { x.classList.toggle("on", x === b); });
    setRapido(b.getAttribute("data-rapido"));
  });
  $("#mapa-capas").addEventListener("click", function (e) {
    var tog = e.target.closest("[data-toggle]");
    if (tog) {
      var idt = tog.getAttribute("data-toggle");
      var abrir = !abiertas[idt];
      abiertas = {};
      if (abrir) abiertas[idt] = true;
      pintarCapas();
      return;
    }
    var all = e.target.closest("[data-capa-all]");
    if (all) {
      var id = all.getAttribute("data-capa-all");
      itemsVisibles(id).forEach(function (it) { activo[claveItem(id, it)] = true; });
      asegurarActivos(); pintarCapas(); pintarMarcadores(); return;
    }
    var none = e.target.closest("[data-capa-none]");
    if (none) {
      var idn = none.getAttribute("data-capa-none");
      itemsVisibles(idn).forEach(function (it) { delete activo[claveItem(idn, it)]; });
      pintarCapas(); pintarMarcadores();
    }
  });
  $("#mapa-capas").addEventListener("change", function (e) {
    var inp = e.target.closest("input[data-item]");
    if (!inp) return;
    var k = inp.getAttribute("data-item");
    if (inp.checked) activo[k] = true;
    else delete activo[k];
    pintarCapas();
    pintarMarcadores();
  });

  var q0 = param("q");
  if (q0) { q = q0; $("#mapa-q").value = q0; }

  loadJSON("data/mapa/indice.json").then(function (ix) {
    indice = ix;
    if (!(indice.mapas || []).some(function (m) { return m.slug === zona; })) zona = (indice.mapas[0] || {}).slug || "altgard";
    pintarSelect();
    return cargarZona(zona);
  }).catch(function () {
    $("#mapa-estado").textContent = t("mapa.error");
  });
})();
