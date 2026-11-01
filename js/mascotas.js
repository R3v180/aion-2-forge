/* Sección de mascotas: familias y ficha, con salto al mapa. */
(function () {
  var ICONO = "https://aion2data.com";
  var ORDEN = ["Fera", "Cogni", "Natura", "Varian", "Special"];
  var UI = {
    titulo: { es: "Mascotas", en: "Pets", fr: "Familiers", de: "Pets", pt: "Mascotes", ru: "Питомцы", ko: "펫", ja: "ペット" },
    sub: {
      es: "Elige una familia y una mascota. Los stats son de la familia. Las almas y el mapa son de esa mascota.",
      en: "Pick a family and a pet. The stats belong to the family. The souls and the map belong to that pet.",
      fr: "Choisis une famille et un familier. Les stats sont celles de la famille. Les âmes et la carte sont celles de ce familier.",
      de: "Wähle eine Familie und ein Pet. Die Werte gehören zur Familie. Seelen und Karte gehören zu diesem Pet.",
      pt: "Escolha uma família e um mascote. Os atributos são da família. As almas e o mapa são desse mascote.",
      ru: "Выбери семью и питомца. Статы у семьи. Души и карта — у этого питомца.",
      ko: "종족과 펫을 고르세요. 스탯은 종족 공통이고, 영혼과 지도는 그 펫의 것입니다.",
      ja: "種族とペットを選ぶ。ステータスは種族共通。魂とマップはそのペットのもの。"
    },
    buscar: { es: "Buscar mascota", en: "Search pets", fr: "Chercher un familier", de: "Pet suchen", pt: "Buscar mascote", ru: "Искать питомца", ko: "펫 검색", ja: "ペット検索" },
    ph: { es: "Nombre, por ejemplo Fossa", en: "Name, for example Fossa", fr: "Nom, par exemple Fossa", de: "Name, zum Beispiel Fossa", pt: "Nome, por exemplo Fuça", ru: "Имя, например Фосса", ko: "이름, 예: 포사", ja: "名前、例: ポサ" },
    nivel: { es: "Nivel", en: "Level", fr: "Niveau", de: "Stufe", pt: "Nível", ru: "Уровень", ko: "레벨", ja: "レベル" },
    familia: { es: "Los stats son de toda la familia", en: "Stats are shared by the whole family", fr: "Les stats sont celles de toute la famille", de: "Die Werte gelten für die ganze Familie", pt: "Os atributos são de toda a família", ru: "Статы общие для всей семьи", ko: "스탯은 종족 전체 공통", ja: "ステータスは種族共通" },
    almas: { es: "Almas", en: "Souls", fr: "Âmes", de: "Seelen", pt: "Almas", ru: "Души", ko: "영혼", ja: "魂" },
    invocar: { es: "Para invocar", en: "To summon", fr: "Pour invoquer", de: "Zum Beschwören", pt: "Para invocar", ru: "Чтобы призвать", ko: "소환", ja: "召喚" },
    hasta3: { es: "Hasta el nivel 3", en: "To level 3", fr: "Jusqu'au niveau 3", de: "Bis Stufe 3", pt: "Até o nível 3", ru: "До 3 уровня", ko: "3레벨까지", ja: "レベル3まで" },
    suelta: { es: "Quién suelta el alma", en: "Who drops the soul", fr: "Qui lâche l'âme", de: "Wer die Seele droppt", pt: "Quem solta a alma", ru: "Кто дропает душу", ko: "영혼을 주는 대상", ja: "魂を落とす相手" },
    otras: { es: "Otras formas", en: "Other ways", fr: "Autres façons", de: "Andere Wege", pt: "Outras formas", ru: "Другие способы", ko: "다른 방법", ja: "ほかの入手" },
    donde: { es: "Dónde farmear", en: "Where to farm", fr: "Où farmer", de: "Wo farmen", pt: "Onde farmar", ru: "Где фармить", ko: "파밍 위치", ja: "狩場" },
    puntos: { es: "puntos", en: "spots", fr: "points", de: "Punkte", pt: "pontos", ru: "точек", ko: "지점", ja: "地点" },
    ver_mapa: { es: "Ver en el mapa", en: "Open the map", fr: "Voir sur la carte", de: "Auf der Karte", pt: "Ver no mapa", ru: "На карте", ko: "지도에서 보기", ja: "マップで見る" },
    mas_puntos: { es: "Más puntos", en: "Most spots", fr: "Plus de points", de: "Meiste Punkte", pt: "Mais pontos", ru: "Больше точек", ko: "지점 최다", ja: "地点最多" },
    ver_ficha: { es: "Ver ficha", en: "Open sheet", fr: "Voir la fiche", de: "Steckbrief", pt: "Ver ficha", ru: "Карточка", ko: "정보 보기", ja: "詳細" },
    montura_3d: { es: "Montura en 3D", en: "3D mount", fr: "Monture en 3D", de: "3D-Reittier", pt: "Montaria em 3D", ru: "Маунт в 3D", ko: "3D 탈것", ja: "3Dマウント" },
    girar: { es: "Arrastra para girar", en: "Drag to turn", fr: "Glisse pour tourner", de: "Ziehen zum Drehen", pt: "Arraste para girar", ru: "Тяни, чтобы крутить", ko: "드래그해서 회전", ja: "ドラッグで回す" },
    todas: { es: "Todas", en: "All", fr: "Toutes", de: "Alle", pt: "Todas", ru: "Все", ko: "전체", ja: "すべて" },
    en_mapa: { es: "En el mapa", en: "On the map", fr: "Sur la carte", de: "Auf der Karte", pt: "No mapa", ru: "На карте", ko: "지도", ja: "マップ" },
    solo_cofre: { es: "Solo cofre", en: "Chest only", fr: "Coffre seul", de: "Nur Truhe", pt: "Só baú", ru: "Только сундук", ko: "상자만", ja: "箱のみ" },
    sin_mapa: { es: "Sin mapa", en: "No map", fr: "Sans carte", de: "Keine Karte", pt: "Sem mapa", ru: "Без карты", ko: "지도 없음", ja: "マップなし" },
    cualquier: { es: "Cualquier origen", en: "Any source", fr: "Toute origine", de: "Jede Quelle", pt: "Qualquer origem", ru: "Любой источник", ko: "모든 출처", ja: "入手先すべて" },
    tambien_cofre: { es: "también cofre", en: "also a chest", fr: "aussi un coffre", de: "auch Truhe", pt: "também baú", ru: "ещё сундук", ko: "상자에도", ja: "箱もあり" },
    tag_mapa: { es: "Mapa", en: "Map", fr: "Carte", de: "Karte", pt: "Mapa", ru: "Карта", ko: "지도", ja: "マップ" },
    tag_cofre: { es: "Cofre", en: "Chest", fr: "Coffre", de: "Truhe", pt: "Baú", ru: "Сундук", ko: "상자", ja: "箱" },
    tag_vacio: { es: "Especial", en: "Special", fr: "Spécial", de: "Spezial", pt: "Especial", ru: "Особая", ko: "특수", ja: "特殊" },
    sin_campo: { es: "Sin puntos de campo", en: "No field spots", fr: "Pas de points sur la carte", de: "Keine Feldpunkte", pt: "Sem pontos no mapa", ru: "Нет полевых точек", ko: "필드 지점 없음", ja: "フィールド地点なし" },
    nv3: { es: "nv 3", en: "lv 3", fr: "nv 3", de: "St. 3", pt: "nv 3", ru: "ур. 3", ko: "3렙", ja: "Lv3" },
    alma_de: { es: "Alma de", en: "Soul from", fr: "Âme de", de: "Seele von", pt: "Alma de", ru: "Душа", ko: "영혼", ja: "魂" },
    volver: { es: "Todas las mascotas", en: "All pets", fr: "Tous les familiers", de: "Alle Pets", pt: "Todos os mascotes", ru: "Все питомцы", ko: "모든 펫", ja: "すべてのペット" },
    nada: { es: "Ninguna mascota con ese nombre.", en: "No pet by that name.", fr: "Aucun familier sous ce nom.", de: "Kein Pet mit diesem Namen.", pt: "Nenhum mascote com esse nome.", ru: "Нет питомца с таким именем.", ko: "그 이름의 펫이 없습니다.", ja: "その名前のペットはいません。" },
    sin_puntos: { es: "El cliente global no pone puntos de campo para esta mascota.", en: "The global client has no field spots for this pet.", fr: "Le client global ne place pas de points pour ce familier.", de: "Der globale Client hat keine Feldpunkte für dieses Pet.", pt: "O cliente global não marca pontos de campo para este mascote.", ru: "В глобальном клиенте нет полевых точек для этого питомца.", ko: "글로벌 클라이언트에 필드 지점이 없습니다.", ja: "グローバル版にフィールド地点がありません。" },
    nv: { es: "Nv", en: "Lv", fr: "Nv", de: "Lv", pt: "Nv", ru: "Ур.", ko: "Lv", ja: "Lv" },
    Especial: { es: "Especial", en: "Special", fr: "Spéciale", de: "Spezial", pt: "Especial", ru: "Особая", ko: "특수", ja: "特殊" }
  };

  function ui(k) {
    var f = UI[k];
    if (!f) return k;
    return f[IDIOMA] || f.es || f.en || k;
  }
  function nom(p) {
    return (p.n && (p.n[IDIOMA] || p.n.es || p.n.en)) || p.id;
  }
  function nomDrop(d) {
    return (d.n && (d.n[IDIOMA] || d.n.en)) || "";
  }
  function famVisible(f) {
    return f === "Special" ? ui("Especial") : f;
  }
  function icono(p) {
    if (!p.icon) return "";
    return ICONO + p.icon;
  }
  function mejorZona(p) {
    var mejor = p.zonas[0];
    p.zonas.forEach(function (z) { if (z.puntos > mejor.puntos) mejor = z; });
    return mejor;
  }
  function hrefMapa(p) {
    if (!p.zonas || !p.zonas.length) return "";
    var mejor = mejorZona(p);
    var nombre = (p.n && p.n.en) || nom(p);
    return "mapa.html?z=" + encodeURIComponent(mejor.z) + "&c=mascotas&q=" + encodeURIComponent(nombre);
  }
  function cortoCofre(nombre) {
    return String(nombre || "").replace(/\s*[（(][^)）]*[)）]\s*$/, "").trim();
  }
  function nomOtro(o) {
    return (o.n && (o.n[IDIOMA] || o.n.es || o.n.en)) || "";
  }
  function origen(p) {
    if (p.zonas && p.zonas.length) {
      var z = mejorZona(p);
      var alma = (p.drops && p.drops.length) ? nomDrop(p.drops[0]) : (z.de || "");
      var extra = p.zonas.length > 1 ? " +" + (p.zonas.length - 1) : "";
      var txt = (alma ? alma + " · " : "") + z.zona + " · " + z.puntos + " " + ui("puntos") + extra;
      if (p.otros && p.otros.length) txt += " · " + ui("tambien_cofre");
      return { tipo: "mapa", tag: ui("tag_mapa"), texto: txt };
    }
    if (p.otros && p.otros.length) {
      var o = p.otros[0];
      return { tipo: "cofre", tag: ui("tag_cofre"), texto: cortoCofre(nomOtro(o)) + (o.pct ? " · " + o.pct : "") };
    }
    return { tipo: "vacio", tag: ui("tag_vacio"), texto: ui("sin_campo") };
  }
  function blobPet(p) {
    var partes = Object.keys(p.n || {}).map(function (k) { return p.n[k]; });
    partes.push(p.familia, famVisible(p.familia));
    (p.zonas || []).forEach(function (z) { partes.push(z.zona, z.de); });
    (p.drops || []).forEach(function (d) { partes.push(nomDrop(d)); });
    (p.otros || []).forEach(function (o) { partes.push(nomOtro(o)); });
    return partes.join(" ").toLowerCase();
  }
  function ordenar(lista) {
    return lista.slice().sort(function (a, b) {
      return nom(a).localeCompare(nom(b), IDIOMA || "es", { sensitivity: "base", numeric: true });
    });
  }

  function pintarHub(data) {
    var q = "";
    var famF = "";
    var via = "";
    var inicial = (param("fam") || "").toLowerCase();
    ORDEN.forEach(function (f) { if (f.toLowerCase() === inicial) famF = f; });
    var viaIni = param("via") || "";
    if (viaIni === "mapa" || viaIni === "cofre" || viaIni === "vacio") via = viaIni;
    var root = $("#mascotas-root");
    function coincide(p, fam, src) {
      if (fam && p.familia !== fam) return false;
      if (src && origen(p).tipo !== src) return false;
      if (!q) return true;
      return blobPet(p).indexOf(q.toLowerCase()) >= 0;
    }
    function chip(clave, valor, etiqueta, pulsado) {
      return '<button type="button" class="chip-filtro' + (pulsado ? " on" : "") + '" data-' + clave + '="' + esc(valor) + '" aria-pressed="' + (pulsado ? "true" : "false") + '">' +
        esc(etiqueta) + "</button>";
    }
    function pinta() {
      var html = "";
      var alguna = false;
      var fams = famF ? [famF] : ORDEN;
      fams.forEach(function (fam) {
        var lista = ordenar(data.mascotas.filter(function (p) { return coincide(p, fam, via); }));
        if (!lista.length) return;
        alguna = true;
        var niveles = (data.familias || {})[fam] || [];
        var top = niveles.length ? niveles[niveles.length - 1] : null;
        html += '<section class="mascotas-fam fam-' + esc(fam.toLowerCase()) + '"><header><h2>' + esc(famVisible(fam)) +
          ' <small>' + lista.length + "</small></h2>";
        if (top) {
          html += '<div class="mascota-chips">' + (top.lineas[IDIOMA] || top.lineas.en || []).map(function (l) {
            return "<span>" + esc(l) + "</span>";
          }).join("") + "</div>";
        }
        html += '</header><div class="mascotas-grid">' + lista.map(tarjeta).join("") + "</div></section>";
      });
      if (!alguna) html = '<p class="suave">' + esc(ui("nada")) + "</p>";
      $("#mascotas-lista").innerHTML = html;
      root.querySelectorAll("[data-fam]").forEach(function (b) {
        var on = (b.getAttribute("data-fam") || "") === famF;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      root.querySelectorAll("[data-via]").forEach(function (b) {
        var on = (b.getAttribute("data-via") || "") === via;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    function tarjeta(p) {
      var src = icono(p);
      var mapa = hrefMapa(p);
      var og = origen(p);
      var ficha = "mascota.html?p=" + encodeURIComponent(p.id);
      var accion = mapa
        ? '<a class="boton chico" href="' + mapa + '">' + esc(ui("ver_mapa")) + "</a>"
        : '<span class="mascota-sin">' + esc(og.tipo === "cofre" ? ui("solo_cofre") : ui("sin_mapa")) + "</span>";
      return '<article class="mascota-card">' +
        '<a class="mascota-ir" href="' + ficha + '">' +
        (src ? '<img alt="" width="84" height="84" loading="lazy" src="' + esc(src) + '">' : '<span class="mascota-letra">' + esc(nom(p).charAt(0)) + "</span>") +
        "<b>" + esc(nom(p)) + "</b><small>" + esc(famVisible(p.familia)) + "</small></a>" +
        '<p class="mascota-origen"><span class="mascota-tag ' + og.tipo + '">' + esc(og.tag) + '</span><span class="mascota-origen-txt" title="' + esc(og.texto) + '">' + esc(og.texto) + "</span></p>" +
        '<p class="mascota-mini"><b>' + esc(String(p.almas || "—")) + "</b> " + esc(ui("almas")) +
        " · <b>" + esc(String(p.almas3 || "—")) + "</b> " + esc(ui("nv3")) + "</p>" +
        '<div class="mascota-acciones"><a class="boton chico" href="' + ficha + '">' + esc(ui("ver_ficha")) + "</a>" + accion + "</div></article>";
    }
    function syncUrl() {
      var u = new URL(location.href);
      if (famF) u.searchParams.set("fam", famF.toLowerCase()); else u.searchParams.delete("fam");
      if (via) u.searchParams.set("via", via); else u.searchParams.delete("via");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
    var chipsFam = chip("fam", "", ui("todas"), !famF) + ORDEN.map(function (f) {
      return chip("fam", f, famVisible(f), famF === f);
    }).join("");
    var chipsVia = chip("via", "", ui("cualquier"), !via) +
      chip("via", "mapa", ui("en_mapa"), via === "mapa") +
      chip("via", "cofre", ui("solo_cofre"), via === "cofre") +
      chip("via", "vacio", ui("sin_mapa"), via === "vacio");
    root.innerHTML =
      '<section class="cabeza-seccion"><span class="antetitulo">AION 2</span><h1>' + esc(ui("titulo")) + "</h1>" +
      '<p class="suave">' + esc(ui("sub")) + "</p></section>" +
      '<label class="datos-label">' + esc(ui("buscar")) +
      '<input id="mascotas-q" type="search" placeholder="' + esc(ui("ph")) + '" autocomplete="off"></label>' +
      '<div class="cola-filtros mascotas-filtros" id="mascotas-fam">' + chipsFam + "</div>" +
      '<div class="cola-filtros mascotas-filtros" id="mascotas-via">' + chipsVia + "</div>" +
      '<div id="mascotas-lista"></div>';
    document.title = ui("titulo") + " · Aion 2 Forge";
    $("#mascotas-q").addEventListener("input", function () { q = this.value.trim(); pinta(); });
    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-fam], button[data-via]");
      if (!b || !root.contains(b)) return;
      if (b.hasAttribute("data-fam")) famF = b.getAttribute("data-fam") || "";
      else via = b.getAttribute("data-via") || "";
      syncUrl();
      pinta();
    });
    pinta();
  }

  function almaEn(p, bruto) {
    var clave = String(bruto || "").toLowerCase();
    var lista = p.drops || [];
    for (var i = 0; i < lista.length; i++) {
      var en = ((lista[i].n && lista[i].n.en) || "").toLowerCase();
      if (clave && en === clave) return nomDrop(lista[i]);
    }
    return bruto || "";
  }
  function lineaStat(l) {
    var m = String(l).match(/^(.*?)(\s+\+[0-9].*)$/);
    if (!m) return "<li><span>" + esc(l) + "</span></li>";
    return "<li><span>" + esc(m[1]) + "</span><b>" + esc(m[2].trim()) + "</b></li>";
  }
  function pintarFicha(data, id) {
    var p = null;
    for (var i = 0; i < data.mascotas.length; i++) if (data.mascotas[i].id === id) p = data.mascotas[i];
    var root = $("#mascota-root");
    if (!p) {
      root.innerHTML = '<p class="suave">' + esc(ui("nada")) + '</p><p><a href="mascotas.html">' + esc(ui("volver")) + "</a></p>";
      return;
    }
    document.title = nom(p) + " · " + ui("titulo") + " · Aion 2 Forge";
    var niveles = (data.familias || {})[p.familia] || [];
    var src = icono(p);
    var mapa = hrefMapa(p);
    var og = origen(p);
    var famCls = "fam-" + String(p.familia || "special").toLowerCase();
    var num = String(p.id).split("-")[0];
    var escena = /^\d+$/.test(num)
      ? '<div class="mascota-escena"><model-viewer src="api/mascota/' + num + '/modelo.glb" poster="' + esc(src) + '" camera-controls auto-rotate touch-action="pan-y" shadow-intensity="0.7" exposure="1.05" alt="' + esc(nom(p)) + '"></model-viewer>' +
        (src ? '<img class="mascota-escena-foto" alt="" width="148" height="148" src="' + esc(src) + '">' : "") +
        '<p class="mascota-credito"><span>' + esc(ui("girar")) + '</span> · <a href="https://aion2.gaming.tools/pets/' + num + '" target="_blank" rel="noopener">' + esc(ui("montura_3d")) + "</a></p></div>"
      : '<div class="mascota-retrato">' + (src ? '<img alt="" width="148" height="148" src="' + esc(src) + '">' : '<span class="mascota-letra">' + esc(nom(p).charAt(0)) + "</span>") + "</div>";
    var html = '<p class="mascota-volver"><a class="enlace" href="mascotas.html">' + esc(ui("volver")) + "</a></p>" +
      '<header class="mascota-hero ' + famCls + '">' + escena +
      '<div class="mascota-hero-texto"><p class="antetitulo">' + esc(famVisible(p.familia)) + "</p><h1>" + esc(nom(p)) + "</h1>" +
      '<p class="mascota-origen ficha"><span class="mascota-tag ' + og.tipo + '">' + esc(og.tag) + '</span><span class="mascota-origen-txt">' + esc(og.texto) + "</span></p>" +
      '<div class="mascota-hero-nums"><div><span>' + esc(ui("invocar")) + "</span><b>" + esc(String(p.almas || "—")) + "</b></div>" +
      "<div><span>" + esc(ui("hasta3")) + "</span><b>" + esc(String(p.almas3 || "—")) + "</b></div></div>" +
      (niveles.length ? '<p class="suave mascota-nota">' + esc(ui("familia")) + "</p>" : "") +
      (mapa ? '<p class="mascota-hero-acciones"><a class="boton oro" href="' + mapa + '">' + esc(ui("ver_mapa")) + "</a></p>" : "") +
      "</div></header>";
    if (niveles.length) {
      var ultimo = niveles[niveles.length - 1].nivel;
      html += '<div class="mascota-niveles">' + niveles.map(function (nv) {
        var lineas = nv.lineas[IDIOMA] || nv.lineas.en || [];
        return '<section class="' + (nv.nivel === ultimo ? "nv-top" : "") + '"><span class="nv-num">' + nv.nivel + "</span><h2>" +
          esc(ui("nivel")) + " " + nv.nivel + '</h2><ul class="mascota-stats">' + lineas.map(lineaStat).join("") + "</ul></section>";
      }).join("") + "</div>";
    }
    if (p.drops && p.drops.length) {
      html += '<section class="mascota-bloque"><h2>' + esc(ui("suelta")) + '</h2><ul class="datos-odds">';
      p.drops.forEach(function (d) {
        var pct = parseFloat(d.pct) || 0;
        html += '<li><span class="datos-barra" style="--w:' + Math.max(4, Math.min(100, pct)) + '%"><i></i></span>' +
          '<span class="datos-odds-nom">' + esc(nomDrop(d)) + " · " + esc(ui("nv")) + " " + esc(d.nivel) + "</span><b>" + esc(d.pct) + "</b></li>";
      });
      html += "</ul></section>";
    }
    if (p.otros && p.otros.length) {
      var cofres = p.otros.slice().sort(function (a, b) { return (parseFloat(b.pct) || 0) - (parseFloat(a.pct) || 0); });
      html += '<section class="mascota-bloque"><h2>' + esc(ui("otras")) + '</h2><div class="mascota-cofres">' +
        cofres.map(function (o) {
          var nombre = (o.n && (o.n[IDIOMA] || o.n.es || o.n.en)) || "";
          return '<article class="mascota-cofre"><b>' + esc(o.pct) + "</b><span>" + esc(nombre) + "</span></article>";
        }).join("") + "</div></section>";
    }
    html += '<section class="mascota-bloque"><h2>' + esc(ui("donde")) + "</h2>";
    if (!p.zonas || !p.zonas.length) {
      html += '<p class="suave">' + esc(ui("sin_puntos")) + "</p>";
    } else {
      var zonas = p.zonas.slice().sort(function (a, b) { return b.puntos - a.puntos; });
      var maxP = zonas[0].puntos;
      html += '<div class="mascotas-zonas">' + zonas.map(function (z) {
        var href = "mapa.html?z=" + encodeURIComponent(z.z) + "&c=mascotas&q=" + encodeURIComponent((p.n && p.n.en) || nom(p));
        var mejor = zonas.length > 1 && z.puntos === maxP;
        return '<a class="mascota-zona' + (mejor ? " mejor" : "") + '" data-z="' + esc(z.z) + '" href="' + href + '">' +
          '<span class="zona-mapa" aria-hidden="true"><span class="zona-lienzo"><img alt="" src="data/mapa/' + esc(z.z) + '.webp"><svg class="zona-pines"></svg></span></span>' +
          '<span class="zona-cuerpo">' +
          (mejor ? '<span class="mascota-tag mapa">' + esc(ui("mas_puntos")) + "</span>" : "") +
          "<b>" + esc(z.zona) + '</b><strong class="zona-pts">' + z.puntos + "<small> " + esc(ui("puntos")) + "</small></strong><small>" +
          esc(ui("alma_de")) + " " + esc(almaEn(p, z.de)) + "</small><em>" + esc(ui("ver_mapa")) + "</em></span></a>";
      }).join("") + "</div>";
    }
    html += "</section>";
    root.innerHTML = html;
    var visor = root.querySelector("model-viewer");
    var foto = root.querySelector(".mascota-escena-foto");
    if (visor && foto) {
      visor.addEventListener("load", function () { foto.hidden = true; });
      visor.addEventListener("error", function () { visor.hidden = true; });
    }
    montarMapas(root, p.id);
  }
  function montarMapas(root, petId) {
    var cards = root.querySelectorAll(".mascota-zona[data-z]");
    if (!cards.length) return;
    var porZona = {};
    cards.forEach(function (c) {
      var z = c.getAttribute("data-z");
      (porZona[z] = porZona[z] || []).push(c);
    });
    Object.keys(porZona).forEach(function (slug) {
      fetch("data/mapa/" + slug + ".json").then(function (r) { return r.json(); }).then(function (mapa) {
        var item = null;
        var lista = (mapa.capas && mapa.capas.mascotas) || [];
        for (var i = 0; i < lista.length; i++) {
          if (lista[i].id === petId) { item = lista[i]; break; }
        }
        var pts = (item && item.pts) || [];
        porZona[slug].forEach(function (card) { engancharMapa(card, mapa.crs || 9600, pts); });
      }).catch(function () {});
    });
    var timer = 0;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        cards.forEach(function (card) {
          if (card._mapa) colocarMapa(card, card._mapa.crs, card._mapa.pts);
        });
      }, 120);
    });
  }
  function engancharMapa(card, crs, pts) {
    card._mapa = { crs: crs, pts: pts };
    var img = card.querySelector(".zona-mapa img");
    function listo() { colocarMapa(card, crs, pts); }
    if (img && img.complete && img.naturalWidth) listo();
    else if (img) img.addEventListener("load", listo);
  }
  function colocarMapa(card, crs, pts) {
    var img = card.querySelector(".zona-mapa img");
    var box = card.querySelector(".zona-mapa");
    var lienzo = card.querySelector(".zona-lienzo");
    if (!img || !img.naturalWidth || !box || !lienzo) return;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var cw = box.clientWidth;
    var ch = box.clientHeight;
    if (!cw || !ch) return;
    var xs = [];
    var ys = [];
    (pts || []).forEach(function (pt) {
      xs.push(pt[0] / crs * iw);
      ys.push(ih * (1 - pt[1] / crs));
    });
    var l;
    var t;
    var r;
    var b;
    if (!xs.length) {
      l = iw * 0.18; t = ih * 0.18; r = iw * 0.82; b = ih * 0.82;
    } else {
      var minx = Math.min.apply(null, xs);
      var maxx = Math.max.apply(null, xs);
      var miny = Math.min.apply(null, ys);
      var maxy = Math.max.apply(null, ys);
      var dx = Math.max(iw * 0.045, (maxx - minx) * 0.5 + 28);
      var dy = Math.max(ih * 0.045, (maxy - miny) * 0.5 + 28);
      l = Math.max(0, minx - dx);
      t = Math.max(0, miny - dy);
      r = Math.min(iw, maxx + dx);
      b = Math.min(ih, maxy + dy);
    }
    var scale = Math.max(cw / (r - l), ch / (b - t));
    lienzo.style.width = (iw * scale) + "px";
    lienzo.style.height = (ih * scale) + "px";
    lienzo.style.left = (cw / 2 - ((l + r) / 2) * scale) + "px";
    // Los puntos quedan en la parte alta: el texto vive sobre el degradado de abajo.
    lienzo.style.top = (ch * 0.34 - ((t + b) / 2) * scale) + "px";
    var svg = card.querySelector(".zona-pines");
    if (!svg || !xs.length) return;
    svg.setAttribute("viewBox", "0 0 " + iw + " " + ih);
    var radio = Math.max(2.4, 7 / scale);
    svg.innerHTML = xs.map(function (x, i) {
      return '<circle cx="' + x.toFixed(1) + '" cy="' + ys[i].toFixed(1) + '" r="' + radio.toFixed(2) + '"/>';
    }).join("");
  }

  var rootHub = $("#mascotas-root");
  var rootFicha = $("#mascota-root");
  fetch("data/mascotas.json").then(function (r) { return r.json(); }).then(function (data) {
    if (rootFicha) pintarFicha(data, param("p") || "");
    else if (rootHub) pintarHub(data);
  }).catch(function () {
    var el = rootFicha || rootHub;
    if (el) el.innerHTML = '<p class="suave">' + esc(ui("nada")) + "</p>";
  });
})();
