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
  function hrefMapa(p) {
    if (!p.zonas || !p.zonas.length) return "";
    var mejor = p.zonas[0];
    p.zonas.forEach(function (z) { if (z.puntos > mejor.puntos) mejor = z; });
    var nombre = (p.n && p.n.en) || nom(p);
    return "mapa.html?z=" + encodeURIComponent(mejor.z) + "&c=mascotas&q=" + encodeURIComponent(nombre);
  }

  function pintarHub(data) {
    var q = "";
    var root = $("#mascotas-root");
    function pinta() {
      var qq = q.toLowerCase();
      var html = "";
      var alguna = false;
      ORDEN.forEach(function (fam) {
        var lista = data.mascotas.filter(function (p) {
          if (p.familia !== fam) return false;
          if (!qq) return true;
          var blob = Object.keys(p.n || {}).map(function (k) { return p.n[k]; }).join(" ").toLowerCase();
          return blob.indexOf(qq) >= 0 || fam.toLowerCase().indexOf(qq) >= 0;
        });
        if (!lista.length) return;
        alguna = true;
        var niveles = (data.familias || {})[fam] || [];
        var top = niveles.length ? niveles[niveles.length - 1] : null;
        html += '<section class="mascotas-fam fam-' + esc(fam.toLowerCase()) + '"><header><h2>' + esc(famVisible(fam)) + "</h2>";
        if (top) {
          html += '<div class="mascota-chips">' + (top.lineas[IDIOMA] || top.lineas.en || []).map(function (l) {
            return "<span>" + esc(l) + "</span>";
          }).join("") + "</div>";
        }
        html += "</header><div class=\"mascotas-grid\">" + lista.map(function (p) {
          var src = icono(p);
          var mapa = hrefMapa(p);
          return '<article class="mascota-card">' +
            '<a class="mascota-ir" href="mascota.html?p=' + encodeURIComponent(p.id) + '">' +
            (src ? '<img alt="" width="84" height="84" loading="lazy" src="' + esc(src) + '">' : '<span class="mascota-letra">' + esc(nom(p).charAt(0)) + "</span>") +
            "<b>" + esc(nom(p)) + "</b><small>" + esc(famVisible(p.familia)) + "</small></a>" +
            (mapa ? '<a class="boton chico mascota-mapa" href="' + mapa + '">' + esc(ui("ver_mapa")) + "</a>" : "") +
            "</article>";
        }).join("") + "</div></section>";
      });
      if (!alguna) html = '<p class="suave">' + esc(ui("nada")) + "</p>";
      $("#mascotas-lista").innerHTML = html;
    }
    root.innerHTML =
      '<section class="cabeza-seccion"><span class="antetitulo">AION 2</span><h1>' + esc(ui("titulo")) + "</h1>" +
      '<p class="suave">' + esc(ui("sub")) + "</p></section>" +
      '<label class="datos-label">' + esc(ui("buscar")) +
      '<input id="mascotas-q" type="search" placeholder="' + esc(ui("ph")) + '" autocomplete="off"></label>' +
      '<div id="mascotas-lista"></div>';
    document.title = ui("titulo") + " · Aion 2 Forge";
    $("#mascotas-q").addEventListener("input", function () { q = this.value.trim(); pinta(); });
    pinta();
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
    var html = '<p><a class="enlace" href="mascotas.html">' + esc(ui("volver")) + "</a></p>" +
      '<header class="mascota-hero">' +
      (src ? '<img alt="" width="120" height="120" src="' + esc(src) + '">' : "") +
      "<div><h1>" + esc(nom(p)) + "</h1><p class=\"chip\">" + esc(famVisible(p.familia)) + "</p>" +
      (niveles.length ? '<p class="suave">' + esc(ui("familia")) + "</p>" : "") +
      (mapa ? '<p class="mascota-hero-acciones"><a class="boton oro" href="' + mapa + '">' + esc(ui("ver_mapa")) + "</a></p>" : "") +
      "</div></header>";
    if (niveles.length) {
      html += '<div class="mascota-niveles">' + niveles.map(function (nv) {
        var lineas = nv.lineas[IDIOMA] || nv.lineas.en || [];
        return "<section><h2>" + esc(ui("nivel")) + " " + nv.nivel + "</h2><ul>" +
          lineas.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></section>";
      }).join("") + "</div>";
    }
    html += '<section class="mascota-almas"><h2>' + esc(ui("almas")) + "</h2><div class=\"datos-totales\">" +
      "<div><span>" + esc(ui("invocar")) + "</span><b>" + esc(String(p.almas || "—")) + "</b></div>" +
      "<div><span>" + esc(ui("hasta3")) + "</span><b>" + esc(String(p.almas3 || "—")) + "</b></div></div>";
    if (p.drops && p.drops.length) {
      html += "<h3>" + esc(ui("suelta")) + "</h3><ul class=\"datos-odds\">";
      p.drops.forEach(function (d) {
        var pct = parseFloat(d.pct) || 0;
        html += "<li><span class=\"datos-barra\" style=\"--w:" + Math.max(4, Math.min(100, pct)) + "%\"><i></i></span>" +
          '<span class="datos-odds-nom">' + esc(nomDrop(d)) + " · " + esc(ui("nv")) + " " + esc(d.nivel) + "</span><b>" + esc(d.pct) + "</b></li>";
      });
      html += "</ul>";
    }
    html += "</section>";
    if (p.otros && p.otros.length) {
      html += "<section><h2>" + esc(ui("otras")) + "</h2><ul class=\"datos-como\">" +
        p.otros.map(function (o) {
          var nombre = (o.n && (o.n[IDIOMA] || o.n.en)) || "";
          return "<li>" + esc(nombre) + " · " + esc(o.pct) + "</li>";
        }).join("") + "</ul></section>";
    }
    html += "<section><h2>" + esc(ui("donde")) + "</h2>";
    if (!p.zonas || !p.zonas.length) {
      html += '<p class="suave">' + esc(ui("sin_puntos")) + "</p>";
    } else {
      html += '<div class="mascotas-zonas">' + p.zonas.map(function (z) {
        var href = "mapa.html?z=" + encodeURIComponent(z.z) + "&c=mascotas&q=" + encodeURIComponent(p.n.en || nom(p));
        return '<a class="mascota-zona" href="' + href + '"><b>' + esc(z.zona) + "</b><span>" +
          z.puntos + " " + esc(ui("puntos")) + "</span><small>" + esc(ui("alma_de")) + " " + esc(z.de) + "</small><em>" +
          esc(ui("ver_mapa")) + "</em></a>";
      }).join("") + "</div>";
    }
    html += "</section>";
    root.innerHTML = html;
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
