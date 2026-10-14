// Barra de habilidades, macro y presets de una build (mismas reglas que reglas.limpiar_presets)
var TECLAS = ["LMB", "RMB", "M4", "M5", "Q", "E", "R", "F", "T", "G", "Z", "X", "C", "V", "Tab", "Shift", "Ctrl", "Alt", "Espacio",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "F1", "F2", "F3", "F4", "Otra"];
var USOS = ["macro", "mano", "ambas"];
var MAX_PRESETS = 3, MAX_LINEAS = 24, MAX_PILA = 4, MAX_PASOS = 20;
var TECLA_TXT = {
  LMB: { es: "Clic izq.", en: "LMB" }, RMB: { es: "Clic der.", en: "RMB" }, M4: { es: "Ratón 4", en: "Mouse 4" }, M5: { es: "Ratón 5", en: "Mouse 5" },
  Espacio: { es: "Espacio", en: "Space" }, Otra: { es: "Otra", en: "Other" }, Ctrl: { es: "Ctrl", en: "Ctrl" }
};
function nombreTecla(k) { return TECLA_TXT[k] ? tr(TECLA_TXT[k]) : k; }
function teclaHTML(k, extra) { return '<span class="tecla-juego' + (extra ? " " + extra : "") + '">' + esc(nombreTecla(k)) + "</span>"; }

function Barra(op) {
  var B = op.B, CAT = op.CAT, editando = op.editando, actual = 0, raiz = null;
  B.datos.presets = B.datos.presets || [];
  function presets() { return B.datos.presets; }
  function P() { return presets()[actual]; }
  function cambio() { if (op.alCambiar) op.alCambiar(); }
  function hab(id) { return CAT.porId[id]; }
  function nivelDe(id) { var s = B.datos.habilidades[id]; return s ? s.nivel || 0 : 0; }

  function icono(id, clase) {
    var h = hab(id);
    if (!h) return '<span class="celda-hab vacia"></span>';
    var st = B.datos.habilidades[id] || { esp: [] };
    return '<span class="celda-hab ' + (clase || "") + (h.tipo === "estigma" ? " estigma" : "") + '" data-tip="' + esc(tipHabilidad(h, nivelDe(id), st.esp)) + '">' +
      (h.icono ? '<img src="icons/habilidades/' + h.icono + '.webp" alt="" loading="lazy">' : "") + "</span>";
  }

  // ---------- vista estilo juego ----------
  function vistaBarra(p) {
    if (!p.barra.length) return '<div class="vacio-lista">' + esc(t("barra.vacia")) + "</div>";
    return '<div class="hotbar">' + p.barra.map(function (l) {
      var celdas = [];
      for (var i = MAX_PILA - 1; i >= 0; i--) celdas.push(l.pila[i] ? icono(l.pila[i], i === 0 ? "base" : "") : '<span class="celda-hab hueco"></span>');
      return '<div class="linea-hotbar uso-' + l.uso + '"><div class="pila">' + celdas.join("") + "</div>" + teclaHTML(l.tecla) +
        '<span class="uso-chip">' + esc(t("barra.uso_" + l.uso)) + "</span>" +
        (l.nombre ? '<small class="linea-nombre">' + esc(l.nombre) + "</small>" : "") + "</div>";
    }).join("") + "</div>" +
      '<p class="nota-barra">' + esc(t("barra.nota_prioridad")) + "</p>";
  }

  function vistaMacro(p) {
    if (!p.macro.length) return '<div class="vacio-lista">' + esc(t("barra.sin_macro")) + "</div>";
    var porTecla = {};
    p.barra.forEach(function (l) { porTecla[l.tecla] = l; });
    return '<div class="macro-cadena"><div class="macro-tecla"><small>' + esc(t("barra.mantener")) + "</small>" + teclaHTML(p.tecla_macro, "oro") + "</div>" +
      p.macro.map(function (s, i) {
        var l = porTecla[s.tecla];
        return (i ? '<span class="macro-flecha">→</span>' : '<span class="macro-flecha">⇒</span>') +
          '<div class="macro-paso"><b>' + (i + 1) + "</b>" + teclaHTML(s.tecla) +
          '<div class="mini-pila">' + (l ? l.pila.map(function (id) { return icono(id, "mini"); }).join("") : "") + "</div>" +
          "<small>" + s.ms + " ms</small></div>";
      }).join("") + '<span class="macro-flecha bucle" title="' + esc(t("barra.bucle")) + '">↻</span></div>';
  }

  function vista() {
    var p = P();
    if (!p) return "";
    return '<div class="panel bloque-barra"><h3>' + esc(t("barra.titulo_barra")) + "</h3>" + vistaBarra(p) + "</div>" +
      '<div class="panel bloque-barra"><h3>' + esc(t("barra.titulo_macro")) + "</h3>" + vistaMacro(p) +
      (p.notas ? '<p class="descripcion-build" style="margin-top:14px">' + esc(p.notas) + "</p>" : "") + "</div>";
  }

  // ---------- editor ----------
  function opciones(lista, marcado, texto) {
    return lista.map(function (v) { return '<option value="' + esc(v) + '"' + (v === marcado ? " selected" : "") + ">" + esc(texto ? texto(v) : v) + "</option>"; }).join("");
  }
  function editorBarra(p) {
    return '<div class="editor-lineas">' + p.barra.map(function (l, i) {
      var libres = TECLAS.filter(function (k) { return k === l.tecla || !p.barra.some(function (o) { return o.tecla === k; }); });
      var slots = "";
      for (var j = 0; j < MAX_PILA; j++) {
        slots += '<button class="slot' + (l.pila[j] ? " lleno" : "") + '" data-slot="' + i + ":" + j + '" title="' + esc(t(j ? "barra.fila_n" : "barra.fila_0").replace("{n}", j)) + '">' +
          (l.pila[j] ? icono(l.pila[j]) : "<span>+</span>") + '<i class="fila">' + j + "</i></button>";
      }
      return '<div class="editor-linea" data-linea="' + i + '"><select data-campo="tecla" aria-label="' + esc(t("barra.tecla")) + '">' + opciones(libres, l.tecla, nombreTecla) + "</select>" +
        '<input data-campo="nombre" maxlength="40" placeholder="' + esc(t("barra.nombre_linea")) + '" value="' + esc(l.nombre) + '">' +
        '<div class="slots">' + slots + "</div>" +
        '<select data-campo="uso">' + opciones(USOS, l.uso, function (u) { return t("barra.uso_" + u); }) + "</select>" +
        '<div class="mover"><button data-accion="subir-linea" title="↑">↑</button><button data-accion="bajar-linea" title="↓">↓</button>' +
        '<button data-accion="quitar-linea" class="quitar" title="' + esc(t("barra.quitar")) + '">✕</button></div></div>';
    }).join("") + "</div>" +
      (p.barra.length < MAX_LINEAS ? '<button class="boton chico" data-accion="nueva-linea">+ ' + esc(t("barra.nueva_linea")) + "</button>" : "");
  }
  function editorMacro(p) {
    var teclas = p.barra.map(function (l) { return l.tecla; });
    ["LMB", "RMB"].forEach(function (k) { if (teclas.indexOf(k) < 0) teclas.push(k); });
    return '<div class="fila-form"><label>' + esc(t("barra.tecla_macro")) + '</label><select data-macro="tecla_macro">' + opciones(TECLAS, p.tecla_macro, nombreTecla) + "</select></div>" +
      '<div class="editor-pasos">' + p.macro.map(function (s, i) {
        return '<div class="editor-paso" data-paso="' + i + '"><b>' + (i + 1) + "</b>" +
          '<select data-campo="tecla">' + opciones(teclas.indexOf(s.tecla) < 0 ? teclas.concat([s.tecla]) : teclas, s.tecla, nombreTecla) + "</select>" +
          '<label class="ms"><input type="number" min="0" max="1000" step="10" data-campo="ms" value="' + s.ms + '"> ms</label>' +
          '<div class="mover"><button data-accion="subir-paso">↑</button><button data-accion="bajar-paso">↓</button><button data-accion="quitar-paso" class="quitar">✕</button></div></div>';
      }).join("") + "</div>" +
      (p.macro.length < MAX_PASOS ? '<button class="boton chico" data-accion="nuevo-paso">+ ' + esc(t("barra.nuevo_paso")) + "</button>" : "") +
      '<label>' + esc(t("barra.notas")) + '</label><textarea data-macro="notas" maxlength="1000" style="min-height:70px">' + esc(p.notas || "") + "</textarea>";
  }

  function pestanasPresets() {
    var l = presets();
    if (!l.length && !editando) return "";
    return '<div class="presets">' + l.map(function (p, i) {
      return '<button class="preset' + (i === actual ? " on" : "") + '" data-preset="' + i + '">' + esc(p.nombre) + "</button>";
    }).join("") + (editando && l.length < MAX_PRESETS ? '<button class="preset nuevo" data-accion="nuevo-preset">+ ' + esc(t("barra.nuevo_preset")) + "</button>" : "") +
      (editando ? '<button class="boton chico plantilla" data-accion="plantilla">' + esc(t("barra.plantilla")) + "</button>" : "") + "</div>";
  }

  function html() {
    var p = P();
    var h = pestanasPresets();
    if (B.espia) {
      h += '<div class="panel aviso-lectura aviso-barra-espia"><b>' + esc(t("barra.aviso_espia_tit")) + "</b> " +
        esc(t("barra.aviso_espia")) + "</div>";
    }
    if (!p) {
      return h + '<div class="vacio-lista">' + esc(t(editando ? "barra.empieza" : "barra.sin_presets")) + "</div>" + guiaRapida();
    }
    h += '<div id="vista-barra">' + vista() + "</div>";
    if (editando) {
      h += '<div class="panel bloque-barra editor"><div class="cab-editor"><h3>' + esc(t("barra.editar")) + "</h3>" +
        '<input data-macro="nombre" maxlength="40" value="' + esc(p.nombre) + '" aria-label="' + esc(t("barra.nombre_preset")) + '">' +
        '<button class="boton chico peligro" data-accion="quitar-preset">' + esc(t("barra.quitar_preset")) + "</button></div>" +
        '<h4>' + esc(t("barra.titulo_barra")) + "</h4>" + editorBarra(p) +
        '<h4>' + esc(t("barra.titulo_macro")) + "</h4>" + editorMacro(p) + "</div>";
    }
    return h + guiaRapida();
  }

  function guiaRapida() {
    return '<details class="panel guia-macro"><summary>' + esc(t("barra.como")) + "</summary><ol>" +
      [1, 2, 3, 4, 5].map(function (n) { return "<li>" + esc(t("barra.paso" + n)) + "</li>"; }).join("") + "</ol>" +
      '<p class="suave" style="font-size:12px">' + esc(t("barra.fuentes")) + ' <a href="https://aion2.grimvane.app/companion/wiki/macros-guide/" target="_blank" rel="noopener">Grimvane</a> · ' +
      '<a href="https://daevaguides.com/en/guides/macros/" target="_blank" rel="noopener">Daeva Guides</a> · <a href="https://corpus.gg/blog/aion-2/macros-guide" target="_blank" rel="noopener">Corpus</a></p></details>';
  }

  function repintar(soloVista) {
    if (!raiz) return;
    if (soloVista) { var v = $("#vista-barra", raiz); if (v) v.innerHTML = vista(); return; }
    raiz.innerHTML = html();
  }

  // ---------- selector de habilidad ----------
  function abrirSelector(boton, i, j) {
    cerrarSelector();
    var p = P(), l = p.barra[i];
    var lista = CAT.habilidades.filter(function (h) { return h.tipo !== "pasiva"; }).sort(function (a, b) {
      return (nivelDe(b.id) > 0) - (nivelDe(a.id) > 0) || (a.tipo === b.tipo ? 0 : a.tipo === "activa" ? -1 : 1);
    });
    var caja = document.createElement("div");
    caja.id = "selector-hab";
    caja.innerHTML = '<input placeholder="' + esc(t("barra.buscar")) + '">' + '<div class="opciones">' + lista.map(function (h) {
      var ya = l.pila.indexOf(h.id) >= 0 && l.pila[j] !== h.id;
      return '<button data-elegir="' + h.id + '"' + (ya ? " disabled" : "") + ' class="' + (nivelDe(h.id) ? "" : "no-aprendida") + '">' + iconoHab(h) +
        "<span>" + esc(tr(h.nombre)) + "<small>" + esc(t("tipo1." + h.tipo)) + (nivelDe(h.id) ? " · " + esc(t("build.nivel")) + " " + nivelDe(h.id) : "") + "</small></span></button>";
    }).join("") + "</div>" + (l.pila[j] ? '<button class="boton chico peligro" data-elegir="">' + esc(t("barra.vaciar")) + "</button>" : "");
    document.body.appendChild(caja);
    var r = boton.getBoundingClientRect();
    caja.style.top = Math.min(window.innerHeight - caja.offsetHeight - 8, r.bottom + 6) + "px";
    caja.style.left = Math.max(8, Math.min(window.innerWidth - caja.offsetWidth - 8, r.left)) + "px";
    var buscador = caja.querySelector("input");
    buscador.focus();
    buscador.addEventListener("input", function () {
      var q = buscador.value.toLowerCase();
      caja.querySelectorAll("[data-elegir]").forEach(function (b) { if (b.dataset.elegir) b.hidden = b.textContent.toLowerCase().indexOf(q) < 0; });
    });
    caja.addEventListener("click", function (e) {
      var b = e.target.closest("[data-elegir]");
      if (!b || b.disabled) return;
      if (b.dataset.elegir) l.pila[j] = b.dataset.elegir; else l.pila.splice(j, 1);
      l.pila = l.pila.filter(Boolean);
      cerrarSelector(); cambio(); repintar();
    });
    setTimeout(function () { document.addEventListener("mousedown", fueraSelector); }, 0);
  }
  function fueraSelector(e) { if (!e.target.closest("#selector-hab")) cerrarSelector(); }
  function cerrarSelector() {
    var c = $("#selector-hab");
    if (c) c.remove();
    document.removeEventListener("mousedown", fueraSelector);
  }

  // ---------- acciones ----------
  function mover(lista, i, d) {
    var j = i + d;
    if (j < 0 || j >= lista.length) return;
    var x = lista[i]; lista[i] = lista[j]; lista[j] = x;
  }
  function nuevoPreset(base) {
    presets().push(base || { nombre: t("barra.preset") + " " + (presets().length + 1), barra: [], macro: [], tecla_macro: "RMB", notas: "" });
    actual = presets().length - 1;
  }
  function cargarPlantilla() {
    api("GET", "/api/builds?clase=" + B.clase).then(function (l) {
      var ref = l.filter(function (b) { return b.fuente; })[0];
      if (!ref) throw new Error("no_existe");
      return api("GET", "/api/builds/" + ref.id);
    }).then(function (r) {
      var p = (r.datos.presets || [])[0];
      if (!p) throw new Error("no_existe");
      if (P() && (P().barra.length || P().macro.length) && !confirm(t("barra.plantilla_conf"))) return;
      var copia = JSON.parse(JSON.stringify(p));
      copia.nombre = P() ? P().nombre : t("barra.preset") + " 1";
      if (P()) presets()[actual] = copia; else nuevoPreset(copia);
      cambio(); repintar(); aviso(t("barra.plantilla_ok"), "ok");
    }).catch(function (e) { aviso(textoError(e), "mal"); });
  }

  function enlazar(el) {
    raiz = el;
    raiz.addEventListener("click", function (e) {
      var pr = e.target.closest("[data-preset]");
      if (pr) { actual = parseInt(pr.dataset.preset, 10); repintar(); return; }
      var s = e.target.closest("[data-slot]");
      if (s && editando) { var ij = s.dataset.slot.split(":"); abrirSelector(s, +ij[0], Math.min(+ij[1], P().barra[+ij[0]].pila.length)); return; }
      var a = e.target.closest("[data-accion]");
      if (!a) return;
      var p = P(), li = a.closest("[data-linea]"), pa = a.closest("[data-paso]");
      var i = li ? +li.dataset.linea : pa ? +pa.dataset.paso : -1;
      switch (a.dataset.accion) {
        case "nuevo-preset": nuevoPreset(); break;
        case "quitar-preset":
          if (!confirm(t("barra.quitar_preset_conf"))) return;
          presets().splice(actual, 1); actual = Math.max(0, actual - 1); break;
        case "plantilla": cargarPlantilla(); return;
        case "nueva-linea":
          var libre = TECLAS.filter(function (k) { return !p.barra.some(function (l) { return l.tecla === k; }); })[0];
          p.barra.push({ tecla: libre, nombre: "", pila: [], uso: "mano" }); break;
        case "quitar-linea": p.barra.splice(i, 1); break;
        case "subir-linea": mover(p.barra, i, -1); break;
        case "bajar-linea": mover(p.barra, i, 1); break;
        case "nuevo-paso":
          var conMacro = p.barra.filter(function (l) { return l.uso !== "mano"; })[0] || p.barra[0];
          p.macro.push({ tecla: conMacro ? conMacro.tecla : "LMB", ms: 10 }); break;
        case "quitar-paso": p.macro.splice(i, 1); break;
        case "subir-paso": mover(p.macro, i, -1); break;
        case "bajar-paso": mover(p.macro, i, 1); break;
        default: return;
      }
      cambio(); repintar();
    });
    raiz.addEventListener("change", function (e) {
      var p = P(), c = e.target.dataset.campo, m = e.target.dataset.macro;
      if (!p) return;
      if (m) { p[m] = e.target.value; cambio(); repintar(m === "tecla_macro"); return; }
      var li = e.target.closest("[data-linea]"), pa = e.target.closest("[data-paso]");
      if (li && c) {
        var l = p.barra[+li.dataset.linea], antes = l.tecla;
        l[c] = e.target.value;
        if (c === "tecla") p.macro.forEach(function (s) { if (s.tecla === antes) s.tecla = l.tecla; });
        cambio(); repintar(c === "nombre");
      } else if (pa && c) {
        var s = p.macro[+pa.dataset.paso];
        s[c] = c === "ms" ? Math.max(0, Math.min(1000, parseInt(e.target.value, 10) || 0)) : e.target.value;
        cambio(); repintar(true);
      }
    });
    raiz.addEventListener("input", function (e) { if (e.target.dataset.macro === "notas" || e.target.dataset.campo === "nombre" || e.target.dataset.macro === "nombre") cambio(); });
  }

  // limpia como el servidor antes de guardar
  function datos() {
    return presets().map(function (p) {
      return { nombre: p.nombre, tecla_macro: p.tecla_macro, notas: p.notas || "", macro: p.macro,
        barra: p.barra.filter(function (l) { return l.pila.length; }) };
    });
  }

  return { html: html, enlazar: enlazar, datos: datos };
}
