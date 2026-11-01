/* Hub + calculadoras AION 2 · Aion 2 Forge */
(function () {
  var D = window.HERRAMIENTAS_DATOS || {};
  var TOOLS = ["mejora", "craft", "odds", "drops", "potential", "stats", "pantheon", "arcana"];

  function L(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[IDIOMA] || obj.es || obj.en || "";
  }

  function fmt(n, dig) {
    if (n == null || isNaN(n)) return "—";
    var d = dig == null ? 2 : dig;
    return Number(n).toLocaleString(IDIOMA === "en" ? "en-US" : "es-ES", {
      maximumFractionDigits: d, minimumFractionDigits: d === 0 ? 0 : undefined
    });
  }

  function pct(x) { return fmt(x * 100, 1) + "%"; }

  /** Intentos esperados con pity lineal hasta 100%. */
  function expectedTries(rate, pity) {
    if (rate >= 1) return 1;
    var p = rate, fail = 1, e = 0, guard = 0;
    while (fail > 1e-12 && guard < 200) {
      e += fail;
      var hit = Math.min(1, p);
      fail *= (1 - hit);
      p += pity;
      guard++;
      if (hit >= 1) break;
    }
    return e;
  }

  function maxTries(rate, pity) {
    if (rate >= 1) return 1;
    if (pity <= 0) return Infinity;
    return Math.ceil((1 - rate) / pity) + 1;
  }

  function campo(label, inner) {
    return '<label class="ht-campo"><span>' + esc(label) + "</span>" + inner + "</label>";
  }

  function selectHtml(id, opts, val) {
    return '<select id="' + id + '">' + opts.map(function (o) {
      return '<option value="' + esc(o.v) + '"' + (String(o.v) === String(val) ? " selected" : "") + ">" + esc(o.t) + "</option>";
    }).join("") + "</select>";
  }

  function numInput(id, val, attrs) {
    return '<input type="number" id="' + id + '" value="' + (val == null ? "" : val) + '"' + (attrs || "") + ">";
  }

  function aviso(txt) {
    return '<p class="ht-aviso suave">' + esc(txt) + "</p>";
  }

  function fuentes(keys) {
    var bits = (keys || []).map(function (k) {
      return D.fuentes && D.fuentes[k] ? L(D.fuentes[k]) : "";
    }).filter(Boolean);
    if (!bits.length) return "";
    return '<p class="ht-fuentes suave">' + esc(t("ht.fuentes")) + " " + bits.map(esc).join(" · ") + "</p>";
  }

  function linkGuia(slug) {
    if (!slug) return "";
    return '<p class="ht-guia"><a href="guia.html?g=' + encodeURIComponent(slug) + '">' + esc(t("ht.ver_guia")) + "</a></p>";
  }

  function shell(titleKey, subKey, body, guia) {
    return '<section class="cabeza-seccion ht-cabeza">' +
      '<p class="suave"><a href="herramientas.html">' + esc(t("ht.volver")) + "</a></p>" +
      "<span class=\"antetitulo\">" + esc(t("ht.antetitulo")) + "</span>" +
      "<h1>" + esc(t(titleKey)) + "</h1>" +
      '<p class="suave">' + esc(t(subKey)) + "</p></section>" +
      '<div class="ht-body">' + body + linkGuia(guia) + "</div>";
  }

  /* ---------- Hub ---------- */
  function renderHub() {
    cabecera("herramientas");
    document.title = t("ht.hub_title") + " · Aion 2 Forge";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("ht.hub_desc"));
    var cards = (D.hub || []).map(function (h) {
      return '<a class="ht-card' + (h.img ? " con-foto" : "") + '" href="herramienta.html?t=' + encodeURIComponent(h.id) + '">' +
        (h.img ? '<span class="ht-foto" style="background-image:url(\'' + h.img + '\')"></span>' : "") +
        '<span class="ht-icon" aria-hidden="true">' + h.icon + "</span>" +
        "<b>" + esc(t("ht." + h.id + ".titulo")) + "</b>" +
        "<small>" + esc(t("ht." + h.id + ".card")) + "</small></a>";
    }).join("");
    $("#main").innerHTML =
      '<section class="cabeza-seccion ht-cabeza">' +
      '<span class="antetitulo">' + esc(t("ht.antetitulo")) + "</span>" +
      "<h1>" + esc(t("ht.hub_titulo")) + "</h1>" +
      '<p class="suave">' + esc(t("ht.hub_sub")) + "</p></section>" +
      '<div class="ht-grid">' + cards + "</div>" +
      '<p class="ht-fuentes suave">' + esc(t("ht.hub_nota")) + "</p>";
  }

  /* ---------- Mejora: banco, como en el cliente ---------- */
  var FORJA = {
    sub: { es: "Elige la pieza, ponla en el hueco y mejora como en el juego.", en: "Pick the piece, set it in the slot and enhance as in the game.", fr: "Choisis la pièce, pose-la et améliore comme dans le jeu.", de: "Wähle das Teil, leg es in den Slot und verbessere wie im Spiel.", pt: "Escolha a peça, coloque no encaixe e melhore como no jogo.", ru: "Выбери предмет, поставь в слот и улучшай как в игре.", ko: "장비를 골라 칸에 넣고 게임처럼 강화하세요.", ja: "装備を選んで枠に置き、ゲームと同じように強化する。" },
    buscar: { es: "Buscar pieza", en: "Find a piece", fr: "Chercher une pièce", de: "Teil suchen", pt: "Buscar peça", ru: "Найти предмет", ko: "장비 찾기", ja: "装備を探す" },
    ph: { es: "Nombre, por ejemplo Ludra", en: "Name, for example Ludra", fr: "Nom, par exemple Ludra", de: "Name, zum Beispiel Ludra", pt: "Nome, por exemplo Ludra", ru: "Имя, например Лудра", ko: "이름, 예: Ludra", ja: "名前、例: Ludra" },
    vacio: { es: "Elige un arma, una armadura o un accesorio.", en: "Pick a weapon, armor or accessory.", fr: "Choisis une arme, une armure ou un accessoire.", de: "Wähle eine Waffe, Rüstung oder ein Accessoire.", pt: "Escolha uma arma, armadura ou acessório.", ru: "Выбери оружие, броню или аксессуар.", ko: "무기, 방어구, 장신구를 고르세요.", ja: "武器、防具、アクセサリを選ぶ。" },
    nada: { es: "Ninguna pieza de equipo con ese nombre.", en: "No gear by that name.", fr: "Aucune pièce sous ce nom.", de: "Kein Ausrüstungsteil mit diesem Namen.", pt: "Nenhuma peça com esse nome.", ru: "Нет экипировки с таким именем.", ko: "그 이름의 장비가 없습니다.", ja: "その名前の装備はありません。" },
    buscando: { es: "Buscando…", en: "Searching…", fr: "Recherche…", de: "Suche…", pt: "A procurar…", ru: "Поиск…", ko: "검색 중…", ja: "検索中…" },
    cargando: { es: "Trayendo la tabla de esta pieza…", en: "Loading this piece's table…", fr: "Chargement de la table…", de: "Tabelle wird geladen…", pt: "Carregando a tabela…", ru: "Загрузка таблицы…", ko: "이 장비의 표를 불러오는 중…", ja: "この装備の表を読み込み中…" },
    mejorar: { es: "Mejorar", en: "Enhance", fr: "Améliorer", de: "Verbessern", pt: "Melhorar", ru: "Улучшить", ko: "강화", ja: "強化" },
    tope: { es: "Al máximo", en: "At the cap", fr: "Au maximum", de: "Am Maximum", pt: "No máximo", ru: "На максимуме", ko: "최대", ja: "最大" },
    exito: { es: "Éxito", en: "Success", fr: "Réussite", de: "Erfolg", pt: "Sucesso", ru: "Успех", ko: "성공", ja: "成功" },
    fallo: { es: "Fallo", en: "Fail", fr: "Échec", de: "Fehlschlag", pt: "Falha", ru: "Провал", ko: "실패", ja: "失敗" },
    seguro: { es: "Seguro", en: "Safe", fr: "Sûr", de: "Sicher", pt: "Seguro", ru: "Безопасно", ko: "안전", ja: "安全" },
    ahora: { es: "Este intento", en: "This try", fr: "Cet essai", de: "Dieser Versuch", pt: "Esta tentativa", ru: "Эта попытка", ko: "이번 시도", ja: "この試行" },
    gastado: { es: "Gastado", en: "Spent", fr: "Dépensé", de: "Ausgegeben", pt: "Gasto", ru: "Потрачено", ko: "소모", ja: "消費" },
    plan: { es: "Plan hasta", en: "Plan to", fr: "Plan jusqu'à", de: "Plan bis", pt: "Plano até", ru: "План до", ko: "목표까지", ja: "目標まで" },
    reiniciar: { es: "Volver a +0", en: "Back to +0", fr: "Revenir à +0", de: "Zurück auf +0", pt: "Voltar a +0", ru: "Снова +0", ko: "+0으로", ja: "+0に戻す" },
    detalle: { es: "Ver cada paso", en: "Each step", fr: "Chaque étape", de: "Jeder Schritt", pt: "Cada passo", ru: "Каждый шаг", ko: "단계별", ja: "各ステップ" },
    objetivo: { es: "Objetivo", en: "Goal", fr: "Objectif", de: "Ziel", pt: "Objetivo", ru: "Цель", ko: "목표", ja: "目標" },
    sin_tabla: { es: "Esta pieza no tiene tabla de mejora.", en: "This piece has no enhance table.", fr: "Cette pièce n'a pas de table.", de: "Dieses Teil hat keine Tabelle.", pt: "Esta peça não tem tabela.", ru: "У предмета нет таблицы.", ko: "강화 표가 없습니다.", ja: "強化表がありません。" },
    kinah: { es: "Kinah", en: "Kinah", fr: "Kinah", de: "Kinah", pt: "Kinah", ru: "Кинах", ko: "키나", ja: "キナ" },
    piedras: { es: "Piedras", en: "Stones", fr: "Pierres", de: "Steine", pt: "Pedras", ru: "Камни", ko: "돌", ja: "石" }
  };
  function fm(k) {
    var f = FORJA[k];
    return (f && (f[IDIOMA] || f.es || f.en)) || k;
  }
  function avisoBusca(texto) {
    return '<p class="forja-busca" role="status"><i></i>' + esc(texto) + "</p>";
  }
  function icoForja(p, grande) {
    var cls = grande ? "forja-ico" : "forja-mini";
    if (p.icon && String(p.icon).indexOf("/game/") === 0) {
      return '<img class="' + cls + '" alt="" src="https://aion2data.com' + esc(p.icon) + '">';
    }
    if (p.sprite && p.sprite.length === 3) {
      var hoja = Number(p.sprite[0]) === 1 ? " s1" : "";
      return '<span class="' + cls + " sprite" + hoja + '" style="--x:' + Number(p.sprite[1]) + ";--y:" + Number(p.sprite[2]) + '"></span>';
    }
    return '<span class="' + cls + ' letra">' + esc((p.label || "?").charAt(0)) + "</span>";
  }

  function renderMejora() {
    var pieza = null;
    var pasos = [];
    var nivel = 0;
    var fallos = 0;
    var objetivo = 0;
    var anim = false;
    var gasto = { kinah: 0, piedras: 0, tries: 0, ok: 0, fail: 0 };
    var buscaTimer = 0;
    var buscaGen = 0;

    var body =
      '<div class="forja">' +
      '<div class="forja-banco">' +
      '<label class="forja-buscar">' + esc(fm("buscar")) +
      '<input id="forja-q" type="search" placeholder="' + esc(fm("ph")) + '" autocomplete="off"></label>' +
      '<div id="forja-lista" class="forja-lista"></div>' +
      '<div id="forja-escena"></div>' +
      "</div>" +
      '<aside id="forja-lado" class="forja-lado"></aside>' +
      "</div>" +
      aviso(L(D.enhance.notes));
    $("#main").innerHTML = shell("ht.mejora.titulo", "ht.mejora.sub", body, "progression__enhancement-amplify-y-transfer");
    var subs = document.querySelectorAll("#main .cabeza-seccion > p.suave");
    if (subs.length > 1) subs[1].textContent = fm("sub");

    function statsPieza() {
      var stats = (pieza.bonos && pieza.bonos.stats) || [];
      if (!stats.length) return "";
      return '<ul class="forja-stats">' + stats.map(function (s) {
        var extra = Number((s.por_nivel && s.por_nivel[String(nivel)]) || 0);
        var total = s.base == null ? extra : s.base + extra;
        return "<li><span>" + esc(s.nombre) + "</span><b>" + fmt(total, 0) + "</b>" +
          (extra ? "<em>+" + fmt(extra, 0) + "</em>" : "") + "</li>";
      }).join("") + "</ul>";
    }
    function pasoDe(n) {
      for (var i = 0; i < pasos.length; i++) if (pasos[i].from === n) return pasos[i];
      return null;
    }
    function tope() {
      return pasos.length ? pasos[pasos.length - 1].to : 0;
    }
    function chance(p) {
      if (!p) return 0;
      return Math.min(1, p.rate + fallos * (p.pity || 0));
    }

    function pintar() {
      var escena = $("#forja-escena");
      var lado = $("#forja-lado");
      if (!pieza) {
        escena.innerHTML = '<p class="forja-vacio">' + esc(fm("vacio")) + "</p>";
        lado.innerHTML = "";
        return;
      }
      var p = pasoDe(nivel);
      var ch = chance(p);
      var cap = tope();
      var pips = "";
      for (var n = 1; n <= cap; n++) {
        var cls = "forja-pip";
        if (n <= nivel) cls += " hecho";
        if (n === nivel + 1) cls += " ahora";
        if (n === objetivo) cls += " meta";
        var st = pasoDe(n - 1);
        if (st && st.rate < 1) cls += " riesgo";
        pips += '<button type="button" class="' + cls + '" data-meta="' + n + '">+' + n + "</button>";
      }
      var grito = "";
      escena.innerHTML =
        '<div class="forja-hueco" id="forja-hueco">' +
        icoForja(pieza, true) +
        '<b class="forja-plus">+' + nivel + "</b>" +
        '<em class="forja-grito" id="forja-grito"></em></div>' +
        '<h2 class="forja-nombre">' + esc(pieza.label) + "</h2>" +
        '<p class="forja-sub">' + esc(pieza.sub || "") + "</p>" +
        statsPieza() +
        '<div class="forja-pips">' + pips + "</div>" +
        '<div class="forja-acciones">' +
        '<button type="button" class="boton oro forja-btn" id="forja-go"' + (p && !anim ? "" : " disabled") + ">" +
        esc(p ? fm("mejorar") + " +" + p.to : fm("tope")) + "</button>" +
        '<button type="button" class="boton chico" id="forja-reset">' + esc(fm("reiniciar")) + "</button></div>" +
        grito;

      var planE = 0, planK = 0, planS = 0;
      var filas = "";
      pasos.forEach(function (st) {
        if (st.from < nivel || st.to > objetivo) return;
        var esp = expectedTries(st.rate, st.pity);
        planE += esp;
        planK += st.kinah * esp;
        planS += st.piedras * esp;
        var ahora = st.from === nivel ? chance(st) : st.rate;
        filas += "<tr><td>+" + st.from + " → +" + st.to + "</td><td>" + pct(ahora) + "</td><td>" +
          (st.pity ? "+" + pct(st.pity) : "—") + "</td><td>" + fmt(st.kinah, 0) + "</td><td>" + fmt(st.piedras, 0) + "</td></tr>";
      });
      lado.innerHTML =
        (p
          ? '<section class="forja-carta"><span>' + esc(fm("ahora")) + "</span><b>" + pct(ch) + "</b>" +
            (p.rate >= 1 ? '<small>' + esc(fm("seguro")) + "</small>" : "<small>+" + pct(p.pity) + " / " + esc(fm("fallo")).toLowerCase() + "</small>") +
            "<p>" + fmt(p.kinah, 0) + " " + esc(fm("kinah")) + " · " + fmt(p.piedras, 0) + " " + esc(fm("piedras")) + "</p></section>"
          : '<section class="forja-carta"><span>' + esc(fm("tope")) + "</span><b>+" + nivel + "</b></section>") +
        '<section class="forja-carta"><span>' + esc(fm("gastado")) + "</span>" +
        "<p>" + fmt(gasto.kinah, 0) + " " + esc(fm("kinah")) + "</p>" +
        "<p>" + fmt(gasto.piedras, 0) + " " + esc(fm("piedras")) + "</p>" +
        "<p>" + gasto.tries + " · " + gasto.ok + " " + esc(fm("exito")).toLowerCase() + " · " + gasto.fail + " " + esc(fm("fallo")).toLowerCase() + "</p></section>" +
        '<section class="forja-carta"><span>' + esc(fm("plan")) + " +" + objetivo + "</span>" +
        "<p><b>" + fmt(planE, 1) + "</b> " + esc(t("ht.mejora.intentos")).toLowerCase() + "</p>" +
        "<p>" + fmt(Math.round(planK), 0) + " " + esc(fm("kinah")) + "</p>" +
        "<p>" + fmt(Math.round(planS), 0) + " " + esc(fm("piedras")) + "</p></section>" +
        "<details class=\"forja-detalle\"><summary>" + esc(fm("detalle")) + "</summary>" +
        '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.col.paso")) + "</th><th>" + esc(t("ht.col.tasa")) +
        "</th><th>" + esc(t("ht.col.pity")) + "</th><th>" + esc(fm("kinah")) + "</th><th>" + esc(fm("piedras")) +
        "</th></tr></thead><tbody>" + filas + "</tbody></table></details>";
    }

    function flash(ok) {
      var hueco = $("#forja-hueco");
      var grito = $("#forja-grito");
      if (!hueco) return;
      hueco.classList.remove("ok", "fail");
      void hueco.offsetWidth;
      hueco.classList.add(ok ? "ok" : "fail");
      if (grito) {
        grito.textContent = ok ? fm("exito") : fm("fallo");
        grito.className = "forja-grito " + (ok ? "ok" : "fail");
      }
    }

    function intentar() {
      var p = pasoDe(nivel);
      if (!p || anim) return;
      anim = true;
      var ch = chance(p);
      gasto.kinah += p.kinah || 0;
      gasto.piedras += p.piedras || 0;
      gasto.tries += 1;
      var ok = Math.random() < ch;
      if (ok) {
        nivel = p.to;
        fallos = 0;
        gasto.ok += 1;
        if (objetivo < nivel) objetivo = nivel;
      } else {
        gasto.fail += 1;
        if (p.baja) nivel = Math.max(0, nivel - 1);
        fallos += 1;
      }
      pintar();
      flash(ok);
      setTimeout(function () { anim = false; pintar(); }, 720);
    }

    function cargar(p) {
      pieza = p;
      pasos = [];
      nivel = 0;
      fallos = 0;
      objetivo = 0;
      gasto = { kinah: 0, piedras: 0, tries: 0, ok: 0, fail: 0 };
      $("#forja-lista").innerHTML = "";
      $("#forja-escena").innerHTML = '<p class="forja-vacio">' + esc(fm("cargando")) + "</p>";
      $("#forja-lado").innerHTML = "";
      var q = "/api/datos/mejora?item=" + encodeURIComponent(p.label_en || p.label) + "&desde=0&hasta=20&lang=" + encodeURIComponent(IDIOMA || "es");
      api("GET", "/api/datos/bonos?href=" + encodeURIComponent(p.href || "") + "&lang=" + encodeURIComponent(IDIOMA || "es")).then(function (b) {
        if (!pieza || pieza.href !== p.href) return;
        pieza.bonos = b || null;
        if (pasos.length) pintar();
      }).catch(function () {});
      api("GET", q).then(function (d) {
        if (!pieza || pieza.href !== p.href) return;
        pasos = d.pasos || [];
        objetivo = tope();
        if (!pasos.length) {
          $("#forja-escena").innerHTML = '<p class="forja-vacio">' + esc(fm("sin_tabla")) + "</p>";
          return;
        }
        pintar();
      }).catch(function () {
        $("#forja-escena").innerHTML = '<p class="forja-vacio">' + esc(fm("sin_tabla")) + "</p>";
      });
    }

    function pintarBusca() {
      var q = ($("#forja-q").value || "").trim();
      var lista = $("#forja-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fm("buscando"));
    }
    function buscar() {
      var q = ($("#forja-q").value || "").trim();
      var lista = $("#forja-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      var gen = ++buscaGen;
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fm("buscando"));
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=objetos&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=16").then(function (d) {
        if (gen !== buscaGen) return;
        var rows = (d.resultados || []).filter(function (r) {
          return String(r.icon || "").indexOf("/game/items/equip/") === 0;
        }).slice(0, 8);
        if (!rows.length) {
          lista.innerHTML = '<p class="forja-vacio">' + esc(fm("nada")) + "</p>";
          return;
        }
        lista.innerHTML = rows.map(function (r, i) {
          return '<button type="button" class="forja-op" data-i="' + i + '">' + icoForja(r, false) +
            "<span><b>" + esc(r.label) + "</b><small>" + esc(r.sub || "") + "</small></span></button>";
        }).join("");
        lista._rows = rows;
      }).catch(function () {
        if (gen !== buscaGen) return;
        lista.innerHTML = '<p class="forja-vacio">' + esc(fm("nada")) + "</p>";
      });
    }

    $("#forja-q").addEventListener("input", function () {
      clearTimeout(buscaTimer);
      pintarBusca();
      buscaTimer = setTimeout(buscar, 220);
    });
    $("#main").addEventListener("click", function (ev) {
      var op = ev.target.closest(".forja-op");
      if (op && $("#forja-lista").contains(op)) {
        var row = ($("#forja-lista")._rows || [])[+op.getAttribute("data-i")];
        if (row) cargar(row);
        return;
      }
      var pip = ev.target.closest("[data-meta]");
      if (pip) {
        var meta = +pip.getAttribute("data-meta");
        if (meta > nivel) objetivo = meta;
        pintar();
        return;
      }
      if (ev.target.closest("#forja-go")) intentar();
      if (ev.target.closest("#forja-reset")) {
        nivel = 0;
        fallos = 0;
        gasto = { kinah: 0, piedras: 0, tries: 0, ok: 0, fail: 0 };
        objetivo = tope();
        pintar();
      }
    });
    pintar();
  }

  /* ---------- Craft: banco de oficio con la receta del cliente ---------- */
  var OFICIO = {
    sub: { es: "Elige lo que quieres fabricar. La lista es la receta del cliente.", en: "Pick what you want to craft. The list is the client's recipe.", fr: "Choisis ce que tu veux fabriquer. La liste est la recette du client.", de: "Wähle, was du herstellen willst. Die Liste ist das Rezept des Clients.", pt: "Escolha o que quer fabricar. A lista é a receita do cliente.", ru: "Выбери, что крафтить. Список — рецепт клиента.", ko: "만들 물건을 고르세요. 목록은 클라이언트 제작법입니다.", ja: "作りたいものを選ぶ。一覧はクライアントのレシピ。" },
    buscar: { es: "Qué quieres fabricar", en: "What do you want to craft", fr: "Que veux-tu fabriquer", de: "Was willst du herstellen", pt: "O que quer fabricar", ru: "Что крафтить", ko: "무엇을 만들까요", ja: "何を作る" },
    ph: { es: "Nombre, por ejemplo orichalcum", en: "Name, for example orichalcum", fr: "Nom, par exemple orichalcum", de: "Name, zum Beispiel Orichalcum", pt: "Nome, por exemplo orichalcum", ru: "Имя, например орихалк", ko: "이름, 예: 오리하르콘", ja: "名前、例: オリハルコン" },
    vacio: { es: "Busca una receta o el objeto que fabrica.", en: "Search a recipe or the item it makes.", fr: "Cherche une recette ou l'objet.", de: "Suche ein Rezept oder den Gegenstand.", pt: "Busque uma receita ou o item.", ru: "Ищи рецепт или предмет.", ko: "제작법이나 결과 아이템을 찾으세요.", ja: "レシピか完成品を探す。" },
    nada: { es: "Nada fabricable con ese nombre.", en: "Nothing craftable by that name.", fr: "Rien à fabriquer sous ce nom.", de: "Nichts Herstellbares mit diesem Namen.", pt: "Nada fabricável com esse nome.", ru: "Нечего крафтить с таким именем.", ko: "그 이름으로 만들 수 있는 것이 없습니다.", ja: "その名前で作れるものはありません。" },
    buscando: { es: "Buscando…", en: "Searching…", fr: "Recherche…", de: "Suche…", pt: "A procurar…", ru: "Поиск…", ko: "검색 중…", ja: "検索中…" },
    sin: { es: "Ese objeto no tiene receta en el cliente.", en: "That item has no recipe in the client.", fr: "Cet objet n'a pas de recette.", de: "Dieser Gegenstand hat kein Rezept.", pt: "Esse item não tem receita.", ru: "У предмета нет рецепта.", ko: "클라이언트에 제작법이 없습니다.", ja: "クライアントにレシピがありません。" },
    cantidad: { es: "Cantidad", en: "Amount", fr: "Quantité", de: "Menge", pt: "Quantidade", ru: "Количество", ko: "수량", ja: "個数" },
    pide: { es: "Pide", en: "Needs", fr: "Demande", de: "Braucht", pt: "Pede", ru: "Нужно", ko: "필요", ja: "必要" },
    tengo: { es: "Ya tengo", en: "I have", fr: "J'ai", de: "Ich habe", pt: "Já tenho", ru: "Уже есть", ko: "보유", ja: "所持" },
    falta: { es: "Falta", en: "Missing", fr: "Manque", de: "Fehlt", pt: "Falta", ru: "Не хватает", ko: "부족", ja: "不足" },
    tasa: { es: "Tasa", en: "Fee", fr: "Taxe", de: "Gebühr", pt: "Taxa", ru: "Сбор", ko: "수수료", ja: "手数料" },
    oficios: { es: "Crafteos", en: "Crafts", fr: "Crafts", de: "Herstellungen", pt: "Crafts", ru: "Крафты", ko: "제작 횟수", ja: "製作回数" },
    cadena: { es: "También fabrica", en: "Also crafts", fr: "Fabrique aussi", de: "Stellt auch her", pt: "Também fabrica", ru: "Ещё крафтит", ko: "함께 제작", ja: "同時に製作" },
    bien: { es: "La lista cuenta que cada crafteo sale bien.", en: "The list assumes every craft succeeds.", fr: "La liste suppose que chaque craft réussit.", de: "Die Liste rechnet damit, dass jede Herstellung gelingt.", pt: "A lista conta que cada craft dá certo.", ru: "Список считает, что каждый крафт успешен.", ko: "목록은 제작이 모두 성공한다고 봅니다.", ja: "一覧はすべての製作が成功する前提です。" },
    sin_tasa: { es: "Sin kinah", en: "No Kinah", fr: "Sans kinah", de: "Kein Kinah", pt: "Sem kinah", ru: "Без кина", ko: "키나 없음", ja: "キナなし" },
    listos: { es: "Listos", en: "Ready", fr: "Prêts", de: "Bereit", pt: "Prontos", ru: "Готово", ko: "준비", ja: "揃った" },
    lista: { es: "Materiales", en: "Materials", fr: "Matériaux", de: "Materialien", pt: "Materiais", ru: "Материалы", ko: "재료", ja: "素材" }
  };
  var PROF = {
    Blacksmithing: { es: "Herrería", en: "Blacksmithing", fr: "Forge", de: "Schmiede", pt: "Ferraria", ru: "Кузнечное дело", ko: "대장간", ja: "鍛冶" },
    Armorsmithing: { es: "Armería", en: "Armorsmithing", fr: "Armurerie", de: "Rüstungsschmiede", pt: "Armaria", ru: "Доспехи", ko: "방어구 제작", ja: "防具製作" },
    Handicrafting: { es: "Artesanía", en: "Handicrafting", fr: "Artisanat", de: "Handwerk", pt: "Artesanato", ru: "Рукоделие", ko: "수공예", ja: "手工芸" },
    Alchemy: { es: "Alquimia", en: "Alchemy", fr: "Alchimie", de: "Alchemie", pt: "Alquimia", ru: "Алхимия", ko: "연금술", ja: "錬金" },
    Cooking: { es: "Cocina", en: "Cooking", fr: "Cuisine", de: "Kochen", pt: "Culinária", ru: "Кулинария", ko: "요리", ja: "料理" }
  };
  function profesion(sub) {
    var f = PROF[sub];
    return f ? (f[IDIOMA] || f.en || sub) : (sub || "");
  }
  function fo(k) {
    var f = OFICIO[k];
    return (f && (f[IDIOMA] || f.es || f.en)) || k;
  }
  function claveTengo(nombre) { return String(nombre || "").trim().toLowerCase(); }
  function leerTengo() {
    try { return JSON.parse(localStorage.getItem("forge-datos-tengo") || "{}") || {}; }
    catch (e) { return {}; }
  }
  function guardarTengo(map) {
    try { localStorage.setItem("forge-datos-tengo", JSON.stringify(map)); } catch (e) {}
  }

  function renderCraft() {
    var pieza = null;
    var receta = null;
    var n = 1;
    var tengo = leerTengo();
    var buscaTimer = 0;
    var buscaGen = 0;

    var body =
      '<div class="forja oficio">' +
      '<div class="forja-banco">' +
      '<label class="forja-buscar">' + esc(fo("buscar")) +
      '<input id="oficio-q" type="search" placeholder="' + esc(fo("ph")) + '" autocomplete="off"></label>' +
      '<div id="oficio-lista" class="forja-lista"></div>' +
      '<div id="oficio-escena"></div>' +
      "</div>" +
      '<aside id="oficio-lado" class="forja-lado"></aside>' +
      "</div>" +
      '<p class="suave oficio-nota">' + esc(fo("bien")) + "</p>";
    $("#main").innerHTML = shell("ht.craft.titulo", "ht.craft.sub", body, "progression__fabricacion-cinco-profesiones-y-el-endgame-pve");
    var subs = document.querySelectorAll("#main .cabeza-seccion > p.suave");
    if (subs.length > 1) subs[1].textContent = fo("sub");

    function nombreCalc(r) {
      return String(r.label_en || r.label || "").replace(/ recipe$/i, "");
    }
    function faltaDe(ln) {
      var need = Number(ln.qty) || 0;
      var hay = Math.max(0, Number(tengo[claveTengo(ln.clave)]) || 0);
      return { need: need, hay: hay, rest: Math.max(0, need - hay) };
    }
    function chipTasa() {
      if (receta.fee == null) return "";
      if (!Number(receta.fee)) {
        return "<div><span>" + esc(fo("tasa")) + '</span><b class="oficio-cero">' + esc(fo("sin_tasa")) + "</b></div>";
      }
      return "<div><span>" + esc(fo("tasa")) + "</span><b>" + fmt(receta.fee, 0) + "</b></div>";
    }
    function pintar() {
      var escena = $("#oficio-escena");
      var lado = $("#oficio-lado");
      if (!pieza || !receta) {
        escena.innerHTML = '<p class="forja-vacio">' + esc(fo("vacio")) + "</p>";
        lado.innerHTML = "";
        return;
      }
      var lineas = receta.lineas || [];
      var listos = 0;
      lineas.forEach(function (ln) { if (!faltaDe(ln).rest) listos++; });
      var ancho = lineas.length ? Math.round(listos / lineas.length * 100) : 0;
      var ofi = profesion(pieza.sub);
      escena.innerHTML =
        '<div class="forja-hueco oficio-hueco">' + icoForja(pieza, true) +
        '<b class="forja-plus">×' + n + "</b></div>" +
        '<h2 class="forja-nombre">' + esc(pieza.label) + "</h2>" +
        (ofi ? '<p class="oficio-chip">' + esc(ofi) + "</p>" : "") +
        '<div class="oficio-cantidad"><span>' + esc(fo("cantidad")) + "</span>" +
        '<button type="button" class="boton chico" id="oficio-menos">−</button>' +
        "<b>" + n + "</b>" +
        '<button type="button" class="boton chico" id="oficio-mas">+</button></div>' +
        '<div class="oficio-progreso" aria-hidden="true"><i id="oficio-barra" style="width:' + ancho + '%"></i></div>' +
        '<div class="oficio-resumen">' +
        '<div><span>' + esc(fo("listos")) + '</span><b id="oficio-listos">' + listos + " / " + lineas.length + "</b></div>" +
        chipTasa() +
        (receta.crafts != null ? "<div><span>" + esc(fo("oficios")) + "</span><b>" + fmt(receta.crafts, 0) + "</b></div>" : "") +
        "</div>";
      lado.innerHTML = '<h3 class="oficio-titulo">' + esc(fo("lista")) + "</h3>" + lineas.map(function (ln) {
        var c = faltaDe(ln);
        return '<article class="oficio-mat' + (c.rest ? "" : " listo") + '">' +
          icoForja({ icon: ln.icon, sprite: ln.sprite, label: ln.nombre }, false) +
          '<div class="oficio-txt"><b>' + esc(ln.nombre) + "</b>" +
          (ln.como ? '<small class="oficio-como" title="' + esc(ln.como) + '">' + esc(ln.como) + "</small>" : "") +
          '<p class="oficio-pide">' + esc(fo("pide")) + " <b>" + fmt(c.need, 0) + "</b></p></div>" +
          '<div class="oficio-tengo"><span>' + esc(fo("tengo")) + "</span>" +
          '<span class="oficio-step">' +
          '<button type="button" class="boton chico" data-mat="' + esc(ln.clave) + '" data-delta="-1">−</button>' +
          '<input type="number" min="0" inputmode="numeric" value="' + c.hay + '" data-mat-input="' + esc(ln.clave) + '">' +
          '<button type="button" class="boton chico" data-mat="' + esc(ln.clave) + '" data-delta="1">+</button></span>' +
          '<em class="' + (c.rest ? "falta" : "ok") + '">' + esc(fo("falta")) + " " + fmt(c.rest, 0) + "</em></div></article>";
      }).join("") + cadena();
    }
    function refrescar() {
      if (!receta) return;
      var lineas = receta.lineas || [];
      var listos = 0;
      document.querySelectorAll("#oficio-lado .oficio-mat").forEach(function (art, i) {
        var ln = lineas[i];
        if (!ln) return;
        var c = faltaDe(ln);
        if (!c.rest) listos++;
        art.classList.toggle("listo", !c.rest);
        var em = art.querySelector(".oficio-tengo em");
        if (em) {
          em.className = c.rest ? "falta" : "ok";
          em.textContent = fo("falta") + " " + fmt(c.rest, 0);
        }
        var inp = art.querySelector("[data-mat-input]");
        if (inp && document.activeElement !== inp) inp.value = String(c.hay);
      });
      var lb = $("#oficio-listos");
      if (lb) lb.textContent = listos + " / " + lineas.length;
      var bar = $("#oficio-barra");
      if (bar) bar.style.width = (lineas.length ? Math.round(listos / lineas.length * 100) : 0) + "%";
    }
    function cadena() {
      var hace = (receta && receta.hace) || [];
      if (hace.length < 2) return "";
      return '<details class="forja-detalle oficio-extra"><summary>' + esc(fo("cadena")) + "</summary><ul class=\"oficio-cadena\">" +
        hace.slice(1, 8).map(function (h) {
          return "<li>" + icoForja({ icon: h.icon, sprite: h.sprite, label: h.nombre }, false) +
            "<b>" + esc(h.nombre) + "</b><span>" + esc(String(h.crafts)) + " × " + esc(String(h.uds)) + "</span></li>";
        }).join("") + "</ul></details>";
    }
    function cargar(p) {
      pieza = p;
      receta = null;
      n = 1;
      $("#oficio-lista").innerHTML = "";
      $("#oficio-escena").innerHTML = '<p class="forja-vacio">' + esc(t("comun.cargando")) + "</p>";
      $("#oficio-lado").innerHTML = "";
      pedir();
    }
    function pedir() {
      if (!pieza) return;
      var item = nombreCalc(pieza);
      api("GET", "/api/datos/receta?item=" + encodeURIComponent(item) + "&n=" + n + "&lang=" + encodeURIComponent(IDIOMA || "es")).then(function (d) {
        if (!pieza || nombreCalc(pieza) !== item) return;
        receta = d;
        pintar();
      }).catch(function () {
        $("#oficio-escena").innerHTML = '<p class="forja-vacio">' + esc(fo("sin")) + "</p>";
        $("#oficio-lado").innerHTML = "";
      });
    }
    function pintarBusca() {
      var q = ($("#oficio-q").value || "").trim();
      var lista = $("#oficio-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fo("buscando"));
    }
    function buscar() {
      var q = ($("#oficio-q").value || "").trim();
      var lista = $("#oficio-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      var gen = ++buscaGen;
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fo("buscando"));
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=todo&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=24").then(function (d) {
        if (gen !== buscaGen) return;
        var rows = (d.resultados || []).filter(function (r) {
          return r.tipo === "recipes" || r.tipo === "items";
        });
        rows.sort(function (a, b) { return (a.tipo === "recipes" ? 0 : 1) - (b.tipo === "recipes" ? 0 : 1); });
        var vistos = {};
        rows = rows.filter(function (r) {
          var k = nombreCalc(r) + "|" + (r.sub || "");
          if (vistos[k]) return false;
          vistos[k] = 1;
          return true;
        }).slice(0, 8);
        if (!rows.length) {
          lista.innerHTML = '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
          return;
        }
        lista.innerHTML = rows.map(function (r, i) {
          return '<button type="button" class="forja-op" data-i="' + i + '">' + icoForja(r, false) +
            "<span><b>" + esc(r.label) + "</b><small>" + esc(profesion(r.sub)) + "</small></span></button>";
        }).join("");
        lista._rows = rows;
      }).catch(function () {
        if (gen !== buscaGen) return;
        lista.innerHTML = '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
      });
    }
    $("#oficio-q").addEventListener("input", function () {
      clearTimeout(buscaTimer);
      pintarBusca();
      buscaTimer = setTimeout(buscar, 220);
    });
    $("#main").addEventListener("click", function (ev) {
      var op = ev.target.closest(".forja-op");
      var lista = $("#oficio-lista");
      if (op && lista && lista.contains(op)) {
        var row = (lista._rows || [])[+op.getAttribute("data-i")];
        if (row) cargar(row);
        return;
      }
      if (ev.target.closest("#oficio-mas")) { n = Math.min(99, n + 1); pedir(); return; }
      if (ev.target.closest("#oficio-menos")) { n = Math.max(1, n - 1); pedir(); return; }
      var paso = ev.target.closest("[data-mat]");
      if (paso && receta) {
        var clave = paso.getAttribute("data-mat");
        var delta = Number(paso.getAttribute("data-delta")) || 0;
        var actual = Math.max(0, Number(tengo[claveTengo(clave)]) || 0);
        tengo[claveTengo(clave)] = Math.max(0, actual + delta);
        guardarTengo(tengo);
        refrescar();
      }
    });
    $("#main").addEventListener("input", function (ev) {
      var inp = ev.target.closest("[data-mat-input]");
      if (!inp || !receta) return;
      var valor = Math.max(0, Math.floor(Number(inp.value) || 0));
      tengo[claveTengo(inp.getAttribute("data-mat-input"))] = valor;
      guardarTengo(tengo);
      refrescar();
    });
    pintar();
  }

  /* ---------- Odds / Manastone ---------- */
  function gradeLabel(g) {
    var map = { 11: t("ht.grado.common"), 21: t("ht.grado.rare"), 31: t("ht.grado.legendary"), 41: t("ht.grado.unique"), 51: t("ht.grado.heroic") };
    return map[g] || ("G" + g);
  }

  function renderOdds() {
    var P = window.PIEDRAS_HERRAMIENTAS || { mana: {}, labels: {}, divinas: [] };
    var MANA_ICO = "https://aion2data.com/game/items/usable/Icon_Item_Usable_Enchant_MagicStone_A_c_003.webp";
    var GRADO = {
      11: { es: "Común", en: "Common", fr: "Commun", de: "Gewöhnlich", pt: "Comum", ru: "Обычный", ko: "일반", ja: "コモン", cls: "g11" },
      21: { es: "Raro", en: "Rare", fr: "Rare", de: "Selten", pt: "Raro", ru: "Редкий", ko: "희귀", ja: "レア", cls: "g21" },
      31: { es: "Legendario", en: "Legendary", fr: "Légendaire", de: "Legendär", pt: "Lendário", ru: "Легендарный", ko: "전설", ja: "レジェンド", cls: "g31" },
      41: { es: "Único", en: "Unique", fr: "Unique", de: "Einzigartig", pt: "Único", ru: "Уникальный", ko: "유니크", ja: "ユニーク", cls: "g41" }
    };
    var GRUPOS = {
      todas: { es: "Todas", en: "All", fr: "Toutes", de: "Alle", pt: "Todas", ru: "Все", ko: "전체", ja: "すべて" },
      stun: { es: "Aturdimiento", en: "Stun", fr: "Étourdissement", de: "Betäubung", pt: "Atordoamento", ru: "Оглушение", ko: "기절", ja: "スタン" },
      paralyze: { es: "Parálisis", en: "Paralyze", fr: "Paralysie", de: "Paralyse", pt: "Paralisia", ru: "Паралич", ko: "마비", ja: "麻痺" },
      seal: { es: "Sellado", en: "Seal", fr: "Sceau", de: "Siegel", pt: "Selamento", ru: "Печать", ko: "봉인", ja: "封印" },
      blind: { es: "Ceguera", en: "Blind", fr: "Cécité", de: "Blindheit", pt: "Cegueira", ru: "Слепота", ko: "실명", ja: "盲目" },
      root: { es: "Atadura", en: "Root", fr: "Entrave", de: "Fessel", pt: "Imobilizar", ru: "Оковы", ko: "속박", ja: "バインド" },
      slow: { es: "Velocidad", en: "Move speed", fr: "Vitesse", de: "Tempo", pt: "Velocidade", ru: "Скорость", ko: "이동 속도", ja: "移動速度" },
      cast: { es: "Casteo", en: "Combat speed", fr: "Incantation", de: "Zauber", pt: "Conjuração", ru: "Каст", ko: "시전", ja: "詠唱" },
      bleed: { es: "Sangrado", en: "Bleed", fr: "Saignement", de: "Blutung", pt: "Sangramento", ru: "Кровотечение", ko: "출혈", ja: "出血" },
      poison: { es: "Veneno", en: "Poison", fr: "Poison", de: "Gift", pt: "Veneno", ru: "Яд", ko: "독", ja: "毒" },
      aoe: { es: "Área", en: "Area", fr: "Zone", de: "Fläche", pt: "Área", ru: "Область", ko: "범위", ja: "範囲" },
      golpe: { es: "Golpe", en: "Hit", fr: "Coup", de: "Treffer", pt: "Golpe", ru: "Удар", ko: "타격", ja: "打撃" }
    };
    var RANURA = {
      Greatsword: { es: "Espadón", en: "Greatsword", fr: "Espadon", de: "Großschwert", pt: "Montante", ru: "Двуручный меч", ko: "대검", ja: "大剣" },
      Longsword: { es: "Espada larga", en: "Longsword", fr: "Épée longue", de: "Langschwert", pt: "Espada longa", ru: "Длинный меч", ko: "장검", ja: "長剣" },
      Dagger: { es: "Daga", en: "Dagger", fr: "Dague", de: "Dolch", pt: "Adaga", ru: "Кинжал", ko: "단검", ja: "短剣" },
      Bow: { es: "Arco", en: "Bow", fr: "Arc", de: "Bogen", pt: "Arco", ru: "Лук", ko: "활", ja: "弓" },
      Spellbook: { es: "Libro de hechizos", en: "Spellbook", fr: "Grimoire", de: "Zauberbuch", pt: "Livro de feitiços", ru: "Книга заклинаний", ko: "마법서", ja: "魔導書" },
      Orb: { es: "Orbe", en: "Orb", fr: "Orbe", de: "Kugel", pt: "Orbe", ru: "Сфера", ko: "오브", ja: "オーブ" },
      Mace: { es: "Maza", en: "Mace", fr: "Masse", de: "Streitkolben", pt: "Maça", ru: "Булава", ko: "메이스", ja: "メイス" },
      Staff: { es: "Báculo", en: "Staff", fr: "Bâton", de: "Stab", pt: "Cajado", ru: "Посох", ko: "지팡이", ja: "杖" },
      Guard: { es: "Escudo", en: "Guard", fr: "Bouclier", de: "Schild", pt: "Escudo", ru: "Щит", ko: "방패", ja: "盾" },
      Fist: { es: "Puño", en: "Fist", fr: "Poing", de: "Faust", pt: "Punho", ru: "Кулак", ko: "권갑", ja: "ナックル" },
      Helm: { es: "Yelmo", en: "Helm", fr: "Heaume", de: "Helm", pt: "Elmo", ru: "Шлем", ko: "투구", ja: "兜" },
      Top: { es: "Pecho", en: "Top", fr: "Torse", de: "Brust", pt: "Peito", ru: "Нагрудник", ko: "상의", ja: "胴" },
      Legs: { es: "Piernas", en: "Legs", fr: "Jambes", de: "Beine", pt: "Perneiras", ru: "Поножи", ko: "하의", ja: "脚" },
      Pauldrons: { es: "Hombreras", en: "Pauldrons", fr: "Épaulières", de: "Schultern", pt: "Omoplatas", ru: "Наплечники", ko: "어깨", ja: "肩" },
      Gloves: { es: "Guantes", en: "Gloves", fr: "Gants", de: "Handschuhe", pt: "Luvas", ru: "Перчатки", ko: "장갑", ja: "手袋" },
      Shoes: { es: "Botas", en: "Shoes", fr: "Bottes", de: "Stiefel", pt: "Botas", ru: "Сапоги", ko: "신발", ja: "靴" },
      Cloak: { es: "Capa", en: "Cloak", fr: "Cape", de: "Umhang", pt: "Capa", ru: "Плащ", ko: "망토", ja: "マント" },
      Earrings: { es: "Pendientes", en: "Earrings", fr: "Boucles d'oreilles", de: "Ohrringe", pt: "Brincos", ru: "Серьги", ko: "귀걸이", ja: "耳飾り" },
      Ring: { es: "Anillo", en: "Ring", fr: "Anneau", de: "Ring", pt: "Anel", ru: "Кольцо", ko: "반지", ja: "指輪" },
      Necklace: { es: "Collar", en: "Necklace", fr: "Collier", de: "Halskette", pt: "Colar", ru: "Ожерелье", ko: "목걸이", ja: "首飾り" },
      Bracelet: { es: "Brazalete", en: "Bracelet", fr: "Bracelet", de: "Armreif", pt: "Bracelete", ru: "Браслет", ko: "팔찌", ja: "腕輪" }
    };
    function ranura(sub) {
      var f = RANURA[sub];
      return f ? (f[IDIOMA] || f.en || sub) : (sub || "");
    }
    var ODDS = {
      sub: { es: "Elige la pieza. Los engarces, el vínculo y el Sync salen de su ficha.", en: "Pick the piece. Sockets, binding and Sync come from its sheet.", fr: "Choisis la pièce. Les sertissages, le lien et le Sync viennent de sa fiche.", de: "Wähle das Teil. Fassungen, Bindung und Sync stehen auf seinem Blatt.", pt: "Escolha a peça. Os engastes, o vínculo e o Sync vêm da ficha.", ru: "Выбери предмет. Слоты, привязка и Sync — с его листа.", ko: "장비를 고르세요. 소켓, 결속, 싱크는 그 장비의 정보입니다.", ja: "装備を選ぶ。ソケット、魂の結合、シンクはその装備の情報。" },
      p1: { es: "Manastone en los engarces", en: "Manastones in the sockets", fr: "Manastone dans les sertissages", de: "Manastone in den Fassungen", pt: "Manastone nos engastes", ru: "Манастоны в слотах", ko: "소켓의 마나스톤", ja: "ソケットのマナストーン" },
      p2: { es: "Soul Binding de esa pieza", en: "That piece's Soul Binding", fr: "Soul Binding de cette pièce", de: "Soul Binding dieses Teils", pt: "Soul Binding dessa peça", ru: "Soul Binding этой вещи", ko: "그 장비의 영혼 결속", ja: "その装備の魂の結合" },
      p3: { es: "Sync, si la ficha lo trae", en: "Sync, if the sheet has it", fr: "Sync, si la fiche l'a", de: "Sync, wenn das Blatt ihn hat", pt: "Sync, se a ficha tiver", ru: "Sync, если он есть в листе", ko: "싱크, 정보에 있을 때", ja: "シンク、情報にあるとき" },
      p4: { es: "Theostone al final", en: "Theostone last", fr: "Theostone à la fin", de: "Theostone zum Schluss", pt: "Theostone no fim", ru: "Теостон в конце", ko: "신석은 마지막", ja: "神石は最後" },
      buscar: { es: "Buscar pieza", en: "Find a piece", fr: "Chercher une pièce", de: "Teil suchen", pt: "Buscar peça", ru: "Найти предмет", ko: "장비 찾기", ja: "装備を探す" },
      ph: { es: "Nombre, por ejemplo Ludra", en: "Name, for example Ludra", fr: "Nom, par exemple Ludra", de: "Name, zum Beispiel Ludra", pt: "Nome, por exemplo Ludra", ru: "Имя, например Лудра", ko: "이름, 예: Ludra", ja: "名前、例: Ludra" },
      vacio: { es: "Elige un arma, una armadura o un accesorio.", en: "Pick a weapon, armor or accessory.", fr: "Choisis une arme, une armure ou un accessoire.", de: "Wähle eine Waffe, Rüstung oder ein Accessoire.", pt: "Escolha uma arma, armadura ou acessório.", ru: "Выбери оружие, броню или аксессуар.", ko: "무기, 방어구, 장신구를 고르세요.", ja: "武器、防具、アクセサリを選ぶ。" },
      nada: { es: "Ninguna pieza con ese nombre.", en: "No piece by that name.", fr: "Aucune pièce sous ce nom.", de: "Kein Teil mit diesem Namen.", pt: "Nenhuma peça com esse nome.", ru: "Нет предмета с таким именем.", ko: "그 이름의 장비가 없습니다.", ja: "その名前の装備はありません。" },
      buscando: { es: "Buscando…", en: "Searching…", fr: "Recherche…", de: "Suche…", pt: "A procurar…", ru: "Поиск…", ko: "검색 중…", ja: "検索中…" },
      cargando: { es: "Trayendo la ficha de esta pieza…", en: "Loading this piece's sheet…", fr: "Chargement de la fiche…", de: "Blatt wird geladen…", pt: "Carregando a ficha…", ru: "Загрузка листа…", ko: "이 장비 정보를 불러오는 중…", ja: "この装備の情報を読み込み中…" },
      sin: { es: "Esa pieza no tiene ficha.", en: "That piece has no sheet.", fr: "Cette pièce n'a pas de fiche.", de: "Dieses Teil hat kein Blatt.", pt: "Essa peça não tem ficha.", ru: "У предмета нет листа.", ko: "이 장비의 정보가 없습니다.", ja: "この装備の情報がありません。" },
      mana: { es: "Manastone", en: "Manastone", fr: "Manastone", de: "Manastone", pt: "Manastone", ru: "Манастон", ko: "마나스톤", ja: "マナストーン" },
      teo: { es: "Theostone", en: "Theostone", fr: "Theostone", de: "Theostone", pt: "Theostone", ru: "Теостон", ko: "신석", ja: "神石" },
      alma: { es: "Soul Binding", en: "Soul Binding", fr: "Soul Binding", de: "Soul Binding", pt: "Soul Binding", ru: "Soul Binding", ko: "영혼 결속", ja: "魂の結合" },
      sync: { es: "Sync", en: "Sync", fr: "Sync", de: "Sync", pt: "Sync", ru: "Sync", ko: "싱크", ja: "シンク" },
      sin_mana: { es: "Esta pieza no tiene engarces de manastone.", en: "This piece has no manastone sockets.", fr: "Cette pièce n'a pas de sertissage manastone.", de: "Dieses Teil hat keine Manastone-Fassungen.", pt: "Esta peça não tem engastes de manastone.", ru: "У предмета нет слотов манастона.", ko: "마나스톤 소켓이 없습니다.", ja: "マナストーンのソケットはありません。" },
      sin_teo: { es: "Esta pieza no tiene hueco de piedra sagrada.", en: "This piece has no theostone socket.", fr: "Cette pièce n'a pas d'emplacement theostone.", de: "Dieses Teil hat keine Theostone-Fassung.", pt: "Esta peça não tem encaixe de theostone.", ru: "Нет слота теостона.", ko: "신석 소켓이 없습니다.", ja: "神石のソケットはありません。" },
      sin_alma: { es: "Esta pieza no publica Soul Binding.", en: "This piece publishes no Soul Binding.", fr: "Cette pièce ne publie pas de Soul Binding.", de: "Dieses Teil hat kein Soul Binding.", pt: "Esta peça não publica Soul Binding.", ru: "Нет Soul Binding.", ko: "영혼 결속 정보가 없습니다.", ja: "魂の結合の情報がありません。" },
      alma_nota: { es: "Saca {n} propiedades de {lista}. La barra es el reparto de la ficha. Una propiedad puede ser un efecto de habilidad.", en: "It rolls {n} properties out of {lista}. The bar is the sheet's split. A property can be a skill effect.", fr: "Elle tire {n} propriétés sur {lista}. La barre est le partage de la fiche. Une propriété peut être un effet de compétence.", de: "Sie zieht {n} Eigenschaften aus {lista}. Der Balken ist die Aufteilung des Blatts. Eine Eigenschaft kann ein Skill-Effekt sein.", pt: "Tira {n} propriedades de {lista}. A barra é a partilha da ficha. Uma propriedade pode ser um efeito de habilidade.", ru: "Выпадает {n} свойств из {lista}. Полоса — доля из листа. Свойство может быть эффектом умения.", ko: "{lista}개 중 {n}속성이 나옵니다. 막대는 시트의 비율입니다. 속성은 스킬 효과일 수 있습니다.", ja: "{lista}個から{n}属性。バーはシートの配分。属性はスキル効果にもなります。" },
      alma_simple: { es: "La barra es el reparto de la ficha. Una propiedad puede ser un efecto de habilidad.", en: "The bar is the sheet's split. A property can be a skill effect.", fr: "La barre est le partage de la fiche. Une propriété peut être un effet de compétence.", de: "Der Balken ist die Aufteilung des Blatts. Eine Eigenschaft kann ein Skill-Effekt sein.", pt: "A barra é a partilha da ficha. Uma propriedade pode ser um efeito de habilidade.", ru: "Полоса — доля из листа. Свойство может быть эффектом умения.", ko: "막대는 시트의 비율입니다. 속성은 스킬 효과일 수 있습니다.", ja: "バーはシートの配分。属性はスキル効果にもなります。" },
      sync_si: { es: "Esta pieza tiene Sync. La ficha no publica las líneas ni la tasa.", en: "This piece has Sync. The sheet does not publish the lines or the rate.", fr: "Cette pièce a un Sync. La fiche ne publie ni les lignes ni le taux.", de: "Dieses Teil hat Sync. Das Blatt nennt weder Linien noch Chance.", pt: "Esta peça tem Sync. A ficha não publica as linhas nem a taxa.", ru: "У предмета есть Sync. Лист не публикует линии и шанс.", ko: "이 장비는 싱크가 있습니다. 시트에 라인과 확률이 없습니다.", ja: "この装備にはシンクがある。シートにラインと確率はない。" },
      sync_no: { es: "Esta pieza no trae Sync.", en: "This piece has no Sync.", fr: "Cette pièce n'a pas de Sync.", de: "Dieses Teil hat kein Sync.", pt: "Esta peça não tem Sync.", ru: "У предмета нет Sync.", ko: "이 장비는 싱크가 없습니다.", ja: "この装備にシンクはない。" },
      sync_na: { es: "La ficha no publica Sync.", en: "The sheet does not publish Sync.", fr: "La fiche ne publie pas le Sync.", de: "Das Blatt veröffentlicht kein Sync.", pt: "A ficha não publica Sync.", ru: "Лист не публикует Sync.", ko: "시트에 싱크가 없습니다.", ja: "シートにシンクはない。" },
      elige: { es: "Piedra de este engarce", en: "Stone for this socket", fr: "Pierre de ce sertissage", de: "Stein für diese Fassung", pt: "Pedra deste engaste", ru: "Камень этого слота", ko: "이 소켓의 돌", ja: "このソケットの石" },
      suma: { es: "Suma", en: "Total", fr: "Total", de: "Summe", pt: "Soma", ru: "Сумма", ko: "합계", ja: "合計" },
      catalogo: { es: "Piedras sagradas", en: "Theostones", fr: "Theostones", de: "Theostones", pt: "Theostones", ru: "Теостоны", ko: "신석", ja: "神石" },
      ph_stat: { es: "Estadística de la piedra", en: "Stone stat", fr: "Stat de la pierre", de: "Wert des Steins", pt: "Atributo da pedra", ru: "Стат камня", ko: "돌의 스탯", ja: "石のステータス" },
      ph_teo: { es: "Buscar piedra sagrada", en: "Search a theostone", fr: "Chercher une theostone", de: "Theostone suchen", pt: "Buscar theostone", ru: "Искать теостон", ko: "신석 검색", ja: "神石を探す" }
    };
    function fo(k) {
      var f = ODDS[k] || GRUPOS[k] || GRADO[k];
      if (!f) return k;
      return f[IDIOMA] || f.es || f.en || k;
    }
    function gradoDe(g) {
      return GRADO[g] || { cls: "", es: "G" + g, en: "G" + g };
    }
    function nombreGrado(g) {
      var f = gradoDe(g);
      return f[IDIOMA] || f.es || f.en || ("G" + g);
    }
    function nombreStat(k) {
      var lab = P.labels && P.labels[k];
      return lab ? (lab[IDIOMA] || lab.es || lab.en || k) : k;
    }
    function iconoTeo(i) {
      if (!i) return "";
      return "https://cdn.questlog.gg/aion-2/assets/Game/UI/Resource/Texture/" + i + ".webp";
    }
    function efectoDe(x) {
      var txt = (x.d && (x.d[IDIOMA] || x.d.es || x.d.en)) || "";
      var partes = String(txt).split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      return partes.length ? partes[partes.length - 1] : "";
    }
    function grupoTeo(x) {
      var d = ((x.d && x.d.en) || "").toLowerCase();
      if (d.indexOf("[stun]") >= 0) return "stun";
      if (d.indexOf("[paralyze]") >= 0) return "paralyze";
      if (d.indexOf("[seal]") >= 0) return "seal";
      if (d.indexOf("[blind]") >= 0) return "blind";
      if (d.indexOf("[root]") >= 0) return "root";
      if (d.indexOf("move speed") >= 0) return "slow";
      if (d.indexOf("combat speed") >= 0) return "cast";
      if (d.indexOf("bleed") >= 0) return "bleed";
      if (d.indexOf("poison") >= 0) return "poison";
      if (d.indexOf("aoe") >= 0) return "aoe";
      return "golpe";
    }
    function teosUnicos() {
      var vistos = {};
      var out = [];
      (P.divinas || []).forEach(function (x) {
        var nom = String((x.n && x.n.en) || "").replace(/\s*\(bound\)\s*/ig, "").trim();
        var k = nom + "|" + x.g;
        if (vistos[k]) return;
        vistos[k] = 1;
        out.push(x);
      });
      return out;
    }

    var pieza = null;
    var ficha = null;
    var manaSel = [];
    var teoSel = [];
    var activo = null;
    var statPick = "";
    var grupo = "todas";
    var buscaTimer = 0;
    var buscaGen = 0;
    var cargaGen = 0;
    var teos = teosUnicos();

    var body =
      '<ol class="piedra-pasos">' + ["p1", "p2", "p3", "p4"].map(function (k, i) {
        return "<li><b>" + (i + 1) + "</b><span>" + esc(fo(k)) + "</span></li>";
      }).join("") + "</ol>" +
      '<div class="forja">' +
      '<div class="forja-banco">' +
      '<label class="forja-buscar">' + esc(fo("buscar")) +
      '<input id="piedra-busca" type="search" placeholder="' + esc(fo("ph")) + '" autocomplete="off"></label>' +
      '<div id="piedra-lista" class="forja-lista"></div>' +
      '<div id="piedra-escena"></div>' +
      '<div id="piedra-huecos"></div>' +
      '<div id="piedra-picker" hidden>' +
      '<label class="forja-buscar">' + esc(fo("elige")) +
      '<input id="piedra-q" type="search" placeholder="' + esc(fo("ph_stat")) + '" autocomplete="off"></label>' +
      '<div id="piedra-stats" class="piedra-stats"></div>' +
      '<div id="piedra-pares" class="piedra-pares"></div></div>' +
      '<div id="piedra-suma" class="oficio-resumen"></div>' +
      "</div>" +
      '<aside id="piedra-lado" class="forja-lado"></aside></div>' +
      '<section class="piedra-catalogo"><h2>' + esc(fo("catalogo")) + "</h2>" +
      '<label class="forja-buscar">' + esc(fo("teo")) +
      '<input id="piedra-teo-q" type="search" placeholder="' + esc(fo("ph_teo")) + '" autocomplete="off"></label>' +
      '<div id="piedra-grupos" class="piedra-grupos"></div>' +
      '<div id="piedra-teo" class="teo-grid"></div></section>';
    $("#main").innerHTML = shell("ht.odds.titulo", "ht.odds.sub", body, "progression__manastone-theostone-y-soul-binding");
    var subs = document.querySelectorAll("#main .cabeza-seccion > p.suave");
    if (subs.length > 1) subs[1].textContent = fo("sub");

    function huecos() { return (ficha && ficha.huecos) || {}; }
    function pintarEscena() {
      var escena = $("#piedra-escena");
      if (!pieza) {
        escena.innerHTML = '<p class="forja-vacio">' + esc(fo("vacio")) + "</p>";
        return;
      }
      escena.innerHTML =
        '<div class="forja-hueco">' + icoForja(pieza, true) + "</div>" +
        '<h2 class="forja-nombre">' + esc(pieza.label) + "</h2>" +
        (pieza.sub ? '<p class="oficio-chip">' + esc(ranura(pieza.sub)) + "</p>" : "");
    }
    function socketHtml(tipo, i, sel) {
      var lleno = sel && (tipo === "mana" ? sel.stat : sel.id);
      var on = activo && activo.tipo === tipo && activo.i === i ? " on" : "";
      var cls = "piedra-socket" + on;
      var dentro = "<span>+</span>";
      var cap = "";
      if (tipo === "mana" && sel) {
        var g = gradoDe(sel.grado);
        cls += " " + (g.cls || "");
        dentro = '<img alt="" src="' + MANA_ICO + '"><b>+' + esc(String(sel.valor)) + "</b>" +
          '<button type="button" class="piedra-x" data-limpia="' + tipo + '" data-i="' + i + '" aria-label="×">×</button>';
        cap = nombreStat(sel.stat);
      } else if (tipo === "teo" && sel) {
        var g2 = gradoDe(sel.g);
        cls += " " + (g2.cls || "");
        var src = iconoTeo(sel.i);
        dentro = (src ? '<img alt="" src="' + esc(src) + '">' : "") +
          '<button type="button" class="piedra-x" data-limpia="' + tipo + '" data-i="' + i + '" aria-label="×">×</button>';
        cap = (sel.n && (sel.n[IDIOMA] || sel.n.es || sel.n.en)) || "";
      }
      return '<div class="piedra-cap"><div class="' + cls + '" role="button" tabindex="0" data-' + tipo + '="' + i + '">' +
        dentro + "</div><small>" + esc(cap) + "</small></div>";
    }
    function pintarHuecos() {
      var box = $("#piedra-huecos");
      var h = huecos();
      if (!ficha) { box.innerHTML = ""; return; }
      var html = '<h3 class="oficio-titulo">' + esc(fo("mana")) + "</h3>";
      var n = h.mana;
      if (!n) html += '<p class="forja-vacio">' + esc(fo("sin_mana")) + "</p>";
      else {
        html += '<div class="piedra-sockets">';
        for (var i = 0; i < n; i++) html += socketHtml("mana", i, manaSel[i]);
        html += "</div>";
      }
      html += '<h3 class="oficio-titulo">' + esc(fo("teo")) + "</h3>";
      var tN = h.teo;
      if (!tN) html += '<p class="forja-vacio">' + esc(fo("sin_teo")) + "</p>";
      else {
        html += '<div class="piedra-sockets">';
        for (var j = 0; j < tN; j++) html += socketHtml("teo", j, teoSel[j]);
        html += "</div>";
      }
      box.innerHTML = html;
      var pick = $("#piedra-picker");
      if (pick) pick.hidden = !(activo && activo.tipo === "mana" && n);
      pintarSuma();
      pintarPares();
    }
    function pintarSuma() {
      var box = $("#piedra-suma");
      var tot = {};
      manaSel.forEach(function (s) {
        if (!s) return;
        tot[s.stat] = (tot[s.stat] || 0) + Number(s.valor || 0);
      });
      var keys = Object.keys(tot);
      box.innerHTML = keys.map(function (k) {
        return "<div><span>" + esc(nombreStat(k)) + "</span><b>+" + esc(String(tot[k])) + "</b></div>";
      }).join("");
    }
    function pintarStats() {
      var q = (($("#piedra-q") && $("#piedra-q").value) || "").toLowerCase();
      var keys = Object.keys(P.mana || {}).filter(function (k) {
        return !q || nombreStat(k).toLowerCase().indexOf(q) >= 0 || k.indexOf(q) >= 0;
      }).sort(function (a, b) { return nombreStat(a).localeCompare(nombreStat(b), IDIOMA || "es"); });
      $("#piedra-stats").innerHTML = keys.slice(0, 14).map(function (k) {
        return '<button type="button" class="piedra-stat' + (k === statPick ? " on" : "") + '" data-stat="' + esc(k) + '">' +
          esc(nombreStat(k)) + "</button>";
      }).join("");
    }
    function pintarPares() {
      var box = $("#piedra-pares");
      if (!box) return;
      var pares = (statPick && P.mana[statPick]) || [];
      box.innerHTML = pares.map(function (par) {
        var g = gradoDe(par[1]);
        return '<button type="button" class="piedra-par ' + (g.cls || "") + '" data-valor="' + par[0] + '" data-grado="' + par[1] + '">' +
          esc(nombreGrado(par[1])) + " <b>+" + par[0] + "</b></button>";
      }).join("");
    }
    function notaAlma() {
      var h = huecos();
      if (h.propiedades && h.lista) {
        return fo("alma_nota").replace("{n}", h.propiedades).replace("{lista}", h.lista);
      }
      return fo("alma_simple");
    }
    function pintarLado() {
      var lado = $("#piedra-lado");
      if (!ficha) { lado.innerHTML = ""; return; }
      var lineas = (ficha.soul || []).slice().sort(function (a, b) { return (b.pct || 0) - (a.pct || 0); });
      var max = 0;
      lineas.forEach(function (s) { if ((s.pct || 0) > max) max = s.pct; });
      if (!max) max = 1;
      var alma = '<h3 class="oficio-titulo">' + esc(fo("alma")) + "</h3>";
      if (!lineas.length) alma += '<p class="forja-vacio">' + esc(fo("sin_alma")) + "</p>";
      else {
        alma += '<p class="suave piedra-nota">' + esc(notaAlma()) + "</p><ul class=\"piedra-lineas\">" +
          lineas.map(function (s) {
            var w = Math.max(4, Math.round(((s.pct || 0) / max) * 100));
            return '<li><span class="piedra-nom">' + esc(s.nombre) + '</span><span class="piedra-barra"><i style="width:' + w +
              '%"></i></span><b>' + esc(s.chance || "") + "</b><small>" + esc(s.min || "") + "–" + esc(s.max || "") + "</small></li>";
          }).join("") + "</ul>";
      }
      var sN = huecos().sync;
      var syncTxt = sN === true ? fo("sync_si") : (sN === false ? fo("sync_no") : fo("sync_na"));
      lado.innerHTML = alma + '<h3 class="oficio-titulo">' + esc(fo("sync")) + '</h3><p class="piedra-nota">' + esc(syncTxt) + "</p>";
    }
    function pintarTeo() {
      var q = (($("#piedra-teo-q") && $("#piedra-teo-q").value) || "").toLowerCase();
      var ids = {};
      teos.forEach(function (x) { ids[grupoTeo(x)] = 1; });
      var chips = ["todas"].concat(Object.keys(GRUPOS).filter(function (k) { return k !== "todas" && ids[k]; }));
      $("#piedra-grupos").innerHTML = chips.map(function (k) {
        return '<button type="button" class="piedra-grupo' + (k === grupo ? " on" : "") + '" data-grupo="' + k + '">' +
          esc(GRUPOS[k][IDIOMA] || GRUPOS[k].es) + "</button>";
      }).join("");
      var list = teos.filter(function (x) {
        if (grupo !== "todas" && grupoTeo(x) !== grupo) return false;
        if (!q) return true;
        var nom = ((x.n && (x.n[IDIOMA] || x.n.es || x.n.en)) || "").toLowerCase();
        return nom.indexOf(q) >= 0 || efectoDe(x).toLowerCase().indexOf(q) >= 0;
      });
      $("#piedra-teo").innerHTML = list.map(function (x) {
        var nom = (x.n && (x.n[IDIOMA] || x.n.es || x.n.en)) || "";
        var src = iconoTeo(x.i);
        var g = gradoDe(x.g);
        return '<button type="button" class="teo-card" data-id="' + esc(x.id) + '">' +
          (src ? '<img alt="" src="' + esc(src) + '">' : '<span class="forja-mini letra">' + esc(nom.charAt(0)) + "</span>") +
          "<span><b class=\"" + (g.cls || "") + "\">" + esc(nom) + "</b><small>" + esc(efectoDe(x)) + "</small></span></button>";
      }).join("") || '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
    }
    function cargar(p) {
      pieza = p;
      ficha = null;
      manaSel = [];
      teoSel = [];
      activo = null;
      statPick = "";
      $("#piedra-lista").innerHTML = "";
      $("#piedra-escena").innerHTML = '<p class="forja-vacio">' + esc(fo("cargando")) + "</p>";
      $("#piedra-huecos").innerHTML = "";
      $("#piedra-lado").innerHTML = "";
      $("#piedra-suma").innerHTML = "";
      $("#piedra-picker").hidden = true;
      var gen = ++cargaGen;
      api("GET", "/api/datos/ficha?href=" + encodeURIComponent(p.href || "") + "&lang=" + encodeURIComponent(IDIOMA || "es")).then(function (d) {
        if (gen !== cargaGen || !pieza || pieza.href !== p.href) return;
        ficha = d;
        if (d && d.icon) pieza.icon = d.icon;
        var h = huecos();
        manaSel = [];
        teoSel = [];
        var i;
        for (i = 0; i < (h.mana || 0); i++) manaSel.push(null);
        for (i = 0; i < (h.teo || 0); i++) teoSel.push(null);
        activo = h.mana ? { tipo: "mana", i: 0 } : (h.teo ? { tipo: "teo", i: 0 } : null);
        pintarEscena();
        pintarHuecos();
        pintarLado();
        pintarStats();
      }).catch(function () {
        if (gen !== cargaGen) return;
        $("#piedra-escena").innerHTML = '<p class="forja-vacio">' + esc(fo("sin")) + "</p>";
      });
    }
    function buscar() {
      var q = ($("#piedra-busca").value || "").trim();
      var lista = $("#piedra-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      var gen = ++buscaGen;
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fo("buscando"));
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=objetos&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=16").then(function (d) {
        if (gen !== buscaGen) return;
        var vistos = {};
        var rows = (d.resultados || []).filter(function (r) {
          if (String(r.icon || "").indexOf("/game/items/equip/") !== 0) return false;
          var k = (r.label_en || r.label) + "|" + (r.sub || "");
          if (vistos[k]) return false;
          vistos[k] = 1;
          return true;
        }).slice(0, 8);
        if (!rows.length) {
          lista.innerHTML = '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
          return;
        }
        lista.innerHTML = rows.map(function (r, i) {
          return '<button type="button" class="forja-op" data-i="' + i + '">' + icoForja(r, false) +
            "<span><b>" + esc(r.label) + "</b><small>" + esc(ranura(r.sub)) + "</small></span></button>";
        }).join("");
        lista._rows = rows;
      }).catch(function () {
        if (gen !== buscaGen) return;
        lista.innerHTML = '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
      });
    }
    function ponerTeo(stone) {
      var h = huecos();
      if (!h.teo) return;
      var i = activo && activo.tipo === "teo" ? activo.i : -1;
      if (i < 0) {
        for (var k = 0; k < teoSel.length; k++) if (!teoSel[k]) { i = k; break; }
      }
      if (i < 0) i = 0;
      teoSel[i] = stone;
      activo = { tipo: "teo", i: i };
      pintarHuecos();
    }

    $("#piedra-busca").addEventListener("input", function () {
      clearTimeout(buscaTimer);
      var q = ($("#piedra-busca").value || "").trim();
      var lista = $("#piedra-lista");
      if (q.length < 2) lista.innerHTML = "";
      else if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(fo("buscando"));
      buscaTimer = setTimeout(buscar, 220);
    });
    $("#piedra-q").addEventListener("input", pintarStats);
    $("#piedra-teo-q").addEventListener("input", pintarTeo);
    $("#main").addEventListener("click", function (ev) {
      var limpia = ev.target.closest("[data-limpia]");
      if (limpia) {
        ev.stopPropagation();
        var tipo = limpia.getAttribute("data-limpia");
        var idx = +limpia.getAttribute("data-i");
        if (tipo === "mana") manaSel[idx] = null;
        else teoSel[idx] = null;
        pintarHuecos();
        return;
      }
      var op = ev.target.closest("#piedra-lista .forja-op");
      if (op) {
        var row = ($("#piedra-lista")._rows || [])[+op.getAttribute("data-i")];
        if (row) cargar(row);
        return;
      }
      var mana = ev.target.closest("[data-mana]");
      if (mana && ficha) {
        activo = { tipo: "mana", i: +mana.getAttribute("data-mana") };
        pintarHuecos();
        pintarStats();
        return;
      }
      var teo = ev.target.closest("[data-teo]");
      if (teo && ficha) {
        activo = { tipo: "teo", i: +teo.getAttribute("data-teo") };
        pintarHuecos();
        return;
      }
      var st = ev.target.closest("[data-stat]");
      if (st) {
        statPick = st.getAttribute("data-stat");
        pintarStats();
        pintarPares();
        return;
      }
      var par = ev.target.closest("[data-valor]");
      if (par && statPick && activo && activo.tipo === "mana") {
        manaSel[activo.i] = { stat: statPick, valor: +par.getAttribute("data-valor"), grado: +par.getAttribute("data-grado") };
        var h = huecos();
        if (activo.i + 1 < (h.mana || 0)) activo = { tipo: "mana", i: activo.i + 1 };
        pintarHuecos();
        return;
      }
      var grupoBtn = ev.target.closest("[data-grupo]");
      if (grupoBtn) {
        grupo = grupoBtn.getAttribute("data-grupo");
        pintarTeo();
        return;
      }
      var card = ev.target.closest(".teo-card");
      if (card) {
        var id = card.getAttribute("data-id");
        var stone = null;
        teos.forEach(function (x) { if (String(x.id) === String(id)) stone = x; });
        if (stone) ponerTeo(stone);
      }
    });
    pintarEscena();
    pintarTeo();
  }

  /* ---------- Drops ---------- */
  function renderDrops() {
    var FOTO = {
      "Krao Cave": "img/guias/d_kraocave.webp",
      "Urugugu Canyon": "img/guias/d_urugugucanyon.webp",
      "Fire Temple": "img/guias/d_firetemple.webp",
      "Draupnir": "img/guias/d_draupnir.webp",
      "Vakron Sky Island": "img/guias/c07c.jpg",
      "Ferocious Horn Den": "img/guias/ss00.jpg",
      "Dying Dramata's Nest": "img/guias/c04b.jpg",
      "Cradle of Nihility": "img/guias/cmv3a.jpg",
      "Hall of Illusion": "img/guias/cmv1a.jpg",
      "Azure Breath Island": "img/guias/c04a.jpg",
      "Citadel of the Fallen Daeva": "img/guias/cmv4a.jpg",
      "Abyssal Forge: Ludra": "img/guias/c06a.jpg",
      "Chalice of Muspel": "img/guias/ss05.jpg",
      "Corroded Decontamination Facility": "img/guias/c06b.jpg"
    };
    var NOMBRE = {
      "Krao Cave": { es: "Cueva de Krao", fr: "Grotte de Krao", de: "Kraohöhle", pt: "Caverna de Krao", ru: "Пещера Крао", ko: "크라오 동굴", ja: "クラオ洞窟", en: "Krao Cave" },
      "Urugugu Canyon": { es: "Cañón de Urugugu", fr: "Canyon Urugugu", de: "Uruguguschlucht", pt: "Desfiladeiro de Urugugu", ru: "Ущелье Уругугу", ko: "우루구구 협곡", ja: "ウルググ峡谷", en: "Urugugu Canyon" },
      "Fire Temple": { es: "Templo de Fuego", fr: "Temple Divin du Feu", de: "Feuertempel", pt: "Templo Divino do Fogo", ru: "Храм огня", ko: "불의 신전", ja: "炎の神殿", en: "Fire Temple" },
      "Draupnir": { es: "Draupnir", fr: "Draupnir", de: "Draupnir", pt: "Draupnir", ru: "Драупнир", ko: "드라웁니르", ja: "ドラウプニル", en: "Draupnir" },
      "Vakron Sky Island": { es: "Isla Aérea de Vakron", fr: "Île Céleste de Vakron", de: "Vakrons Luftinsel", pt: "Ilha Aérea de Vakron", ru: "Парящий остров Вакрона", ko: "바크론의 공중섬", ja: "バクロンの空中島", en: "Vakron Sky Island" },
      "Ferocious Horn Den": { es: "Caverna del Cuerno Feroz", fr: "Grotte de la Corne Féroce", de: "Grimmhornhöhle", pt: "Gruta do Chifre Feroz", ru: "Логово Свирепого Рога", ko: "사나운 뿔 암굴", ja: "獰猛な角岩窟", en: "Ferocious Horn Den" },
      "Dying Dramata's Nest": { es: "Nido del Dramata Muerto", fr: "Nid du Dramata Mort", de: "Nest des toten Dramatha", pt: "Ninho de Dramata Morto", ru: "Гнездо мёртвой драматы", ko: "죽은 드라마타의 둥지", ja: "死んだドラマタの巣", en: "Dying Dramata's Nest" },
      "Cradle of Nihility": { es: "Cuna de la Nada", fr: "Berceau du Néant", de: "Wiege des Nichts", pt: "Berço do Vazio", ru: "Колыбели небытия", ko: "무의 요람", ja: "武の揺りかご", en: "Cradle of Nihility" },
      "Hall of Illusion": { es: "Corredor de la Ilusión", fr: "Corridor d'Illusion", de: "Illusionskorridor", pt: "Corredor da Ilusão", ru: "Галерея иллюзий", ko: "환영의 회랑", ja: "幻影の回廊", en: "Hall of Illusion" },
      "Azure Breath Island": { es: "Isla del Aliento Azur", fr: "Île du Souffle Azur", de: "Insel des Blauatems", pt: "Ilha do Sopro Azul", ru: "Остров лазурного дыхания", ko: "푸른 숨의 섬", ja: "青い息の島", en: "Azure Breath Island" },
      "Citadel of the Fallen Daeva": { es: "Ciudadela del Daeva Caído", en: "Citadel of the Fallen Daeva" },
      "Abyssal Forge: Ludra": { es: "Forja Abismal: Ludra", fr: "Reforge de l'Abîme : Ludra", de: "Abgrundsveredelung: Ludra", ko: "심연의 재련: 루드라", ja: "深淵の再錬：ルドラ", en: "Abyssal Forge: Ludra" },
      "Chalice of Muspel": { es: "Cáliz de Muspel", fr: "Calice de Muspel", de: "Kelch von Muspel", pt: "Cálice de Muspel", ru: "Чаша Мусфеля", ko: "무스펠의 성배", ja: "ムスフェルの聖杯", en: "Chalice of Muspel" },
      "Corroded Decontamination Facility": { es: "Purificatorio de Erosión", fr: "Sanctuaire de Purification de l'Érosion", de: "Läuterungsstätte der Korrosion", pt: "Posto de Purificação da Erosão", ru: "Чистилище скверны", ko: "침식의 정화소", ja: "侵食の浄化所", en: "Corroded Decontamination Facility" }
    };
    var MODO = {
      Exploration: { es: "Exploración", fr: "Exploration", de: "Erkundung", pt: "Exploração", ru: "Исследование", ko: "탐사", ja: "探索", en: "Exploration" },
      Conquest: { es: "Conquista", fr: "Conquête", de: "Eroberung", pt: "Conquista", ru: "Завоевание", ko: "정복", ja: "征服", en: "Conquest" },
      Normal: { es: "Normal", fr: "Normal", de: "Normal", pt: "Normal", ru: "Обычный", ko: "일반", ja: "ノーマル", en: "Normal" },
      Hard: { es: "Difícil", fr: "Difficile", de: "Schwer", pt: "Difícil", ru: "Сложный", ko: "어려움", ja: "ハード", en: "Hard" },
      "Conquest [Hard]": { es: "Conquista difícil", fr: "Conquête difficile", de: "Eroberung schwer", pt: "Conquista difícil", ru: "Завоевание сложное", ko: "정복 어려움", ja: "征服ハード", en: "Conquest Hard" }
    };
    var CUBO = {
      sub: { es: "Elige la mazmorra. El cubo, la energía y el premio son los de su ficha.", en: "Pick the dungeon. The cube, the energy and the prize are the ones on its sheet.", fr: "Choisis le donjon. Le cube, l'énergie et le prix sont ceux de sa fiche.", de: "Wähle den Dungeon. Würfel, Energie und Preis stehen auf seinem Blatt.", pt: "Escolha a masmorra. O cubo, a energia e o prémio são os da ficha.", ru: "Выбери подземелье. Куб, энергия и награда — с его листа.", ko: "던전을 고르세요. 큐브, 에너지, 보상은 그 시트의 값입니다.", ja: "ダンジョンを選ぶ。キューブ、エネルギー、報酬はその情報どおり。" },
      buscar: { es: "Buscar mazmorra", en: "Find a dungeon", fr: "Chercher un donjon", de: "Dungeon suchen", pt: "Buscar masmorra", ru: "Найти подземелье", ko: "던전 찾기", ja: "ダンジョンを探す" },
      ph: { es: "Nombre, por ejemplo Krao", en: "Name, for example Krao", fr: "Nom, par exemple Krao", de: "Name, zum Beispiel Krao", pt: "Nome, por exemplo Krao", ru: "Имя, например Крао", ko: "이름, 예: 크라오", ja: "名前、例: クラオ" },
      vacio: { es: "Elige una mazmorra.", en: "Pick a dungeon.", fr: "Choisis un donjon.", de: "Wähle einen Dungeon.", pt: "Escolha uma masmorra.", ru: "Выбери подземелье.", ko: "던전을 고르세요.", ja: "ダンジョンを選ぶ。" },
      nada: { es: "Ninguna mazmorra con ese nombre.", en: "No dungeon by that name.", fr: "Aucun donjon sous ce nom.", de: "Kein Dungeon mit diesem Namen.", pt: "Nenhuma masmorra com esse nome.", ru: "Нет подземелья с таким именем.", ko: "그 이름의 던전이 없습니다.", ja: "その名前のダンジョンはありません。" },
      buscando: { es: "Buscando…", en: "Searching…", fr: "Recherche…", de: "Suche…", pt: "A procurar…", ru: "Поиск…", ko: "검색 중…", ja: "検索中…" },
      cargando: { es: "Trayendo la tabla de cubos…", en: "Loading the cube table…", fr: "Chargement de la table des cubes…", de: "Würfeltabelle wird geladen…", pt: "Carregando a tabela de cubos…", ru: "Загрузка таблицы кубов…", ko: "큐브 표를 불러오는 중…", ja: "キューブ表を読み込み中…" },
      sin_tabla: { es: "La tabla de cubos no ha llegado.", en: "The cube table did not load.", fr: "La table des cubes n'est pas arrivée.", de: "Die Würfeltabelle kam nicht an.", pt: "A tabela de cubos não chegou.", ru: "Таблица кубов не загрузилась.", ko: "큐브 표를 불러오지 못했습니다.", ja: "キューブ表が届きませんでした。" },
      energia: { es: "Energía", en: "Energy", fr: "Énergie", de: "Energie", pt: "Energia", ru: "Энергия", ko: "에너지", ja: "エネルギー" },
      hasta: { es: "Cubos hasta el premio", en: "Cubes to the prize", fr: "Cubes jusqu'au prix", de: "Würfel bis zum Preis", pt: "Cubos até o prémio", ru: "Кубов до награды", ko: "보상까지 큐브", ja: "報酬までのキューブ" },
      kinah: { es: "Kinah del cubo", en: "Cube Kinah", fr: "Kinah du cube", de: "Kinah des Würfels", pt: "Kinah do cubo", ru: "Кина куба", ko: "큐브 키나", ja: "キューブのキナ" },
      premio: { es: "Premio", en: "Prize", fr: "Prix", de: "Preis", pt: "Prémio", ru: "Награда", ko: "보상", ja: "報酬" },
      abiertos: { es: "Cubos abiertos", en: "Cubes opened", fr: "Cubes ouverts", de: "Geöffnete Würfel", pt: "Cubos abertos", ru: "Открыто кубов", ko: "연 큐브", ja: "開けたキューブ" },
      falta: { es: "Faltan", en: "Left", fr: "Reste", de: "Fehlen", pt: "Faltam", ru: "Осталось", ko: "남음", ja: "残り" },
      sin_cubos: { es: "Esta ficha no publica cuántos cubos faltan para el premio.", en: "This sheet does not publish how many cubes are left to the prize.", fr: "Cette fiche ne publie pas combien de cubes manquent pour le prix.", de: "Dieses Blatt sagt nicht, wie viele Würfel bis zum Preis fehlen.", pt: "Esta ficha não publica quantos cubos faltam para o prémio.", ru: "Лист не пишет, сколько кубов до награды.", ko: "시트에 보상까지 남은 큐브 수가 없습니다.", ja: "シートに報酬までのキューブ数はありません。" },
      asterisco: { es: "El asterisco: ese cofre aún no está en la tabla. El kinah es la cifra de referencia.", en: "The asterisk: that chest is not in the table yet. The Kinah is the reference figure.", fr: "L'astérisque : ce coffre n'est pas encore dans la table. Le kinah est le chiffre de référence.", de: "Der Stern: diese Truhe steht noch nicht in der Tabelle. Das Kinah ist die Referenzzahl.", pt: "O asterisco: esse baú ainda não está na tabela. O kinah é o valor de referência.", ru: "Звёздочка: этого сундука ещё нет в таблице. Кина — справочная.", ko: "별표: 그 상자는 아직 표에 없습니다. 키나는 참고 수치입니다.", ja: "星印: その箱はまだ表にありません。キナは参考値です。" },
      farm: { es: "Dónde sale", en: "Where it drops", fr: "Où ça tombe", de: "Wo es fällt", pt: "Onde sai", ru: "Где падает", ko: "어디서 나오나", ja: "どこで出るか" },
      ph_item: { es: "Objeto, por ejemplo Ludra u odyle", en: "Item, for example Ludra or odyle", fr: "Objet, par exemple Ludra ou odyle", de: "Gegenstand, zum Beispiel Ludra oder Odyle", pt: "Item, por exemplo Ludra ou odyle", ru: "Предмет, например Лудра или одил", ko: "아이템, 예: Ludra 또는 오딜", ja: "アイテム、例: ルドラかオディル" },
      sin_drop: { es: "Esta ficha no publica botín de mazmorra.", en: "This sheet does not publish dungeon loot.", fr: "Cette fiche ne publie pas de butin de donjon.", de: "Dieses Blatt veröffentlicht keine Dungeon-Beute.", pt: "Esta ficha não publica saque de masmorra.", ru: "Лист не публикует добычу подземелья.", ko: "시트에 던전 전리품이 없습니다.", ja: "シートにダンジョン報酬はありません。" },
      mapa: { es: "Ver en el mapa", en: "See on the map", fr: "Voir sur la carte", de: "Auf der Karte", pt: "Ver no mapa", ru: "На карте", ko: "지도에서 보기", ja: "地図で見る" },
      por_vez: { es: "por vez", en: "per clear", fr: "par passage", de: "pro Lauf", pt: "por vez", ru: "за заход", ko: "1회당", ja: "1回あたり" }
    };
    function cu(k) {
      var f = CUBO[k];
      return (f && (f[IDIOMA] || f.es || f.en)) || k;
    }
    function nombreDun(en) {
      var f = NOMBRE[en];
      return f ? (f[IDIOMA] || f.en || en) : en;
    }
    function nombreModo(modo) {
      var f = MODO[modo];
      if (f) return f[IDIOMA] || f.en || modo;
      var tr = /^Transcendence Stage (\d+)$/.exec(modo || "");
      if (tr) {
        var base = { es: "Trascendencia", fr: "Transcendance", de: "Transzendenz", pt: "Transcendência", ru: "Трансцендентность", ko: "초월", ja: "超越", en: "Transcendence" };
        return (base[IDIOMA] || base.en) + " " + tr[1];
      }
      return modo || "";
    }
    function numCelda(texto) {
      var s = String(texto == null ? "" : texto).trim();
      if (!s || s === "—" || s === "-") return null;
      var m = s.replace(/[, ]/g, "").match(/\d+/);
      return m ? parseInt(m[0], 10) : null;
    }
    function claveCubo(dun, modo) { return dun + "|" + modo; }
    function leerAbiertos() {
      try { return JSON.parse(localStorage.getItem("forge-cubos-abiertos") || "{}") || {}; }
      catch (e) { return {}; }
    }
    function guardarAbiertos(map) {
      try { localStorage.setItem("forge-cubos-abiertos", JSON.stringify(map)); } catch (e) {}
    }

    var tabla = null;
    var mazmorras = [];
    var actual = null;
    var modoIdx = 0;
    var abiertos = leerAbiertos();
    var pieza = null;
    var fichaItem = null;
    var buscaTimer = 0;
    var buscaGen = 0;
    var itemGen = 0;

    var body =
      '<div class="forja">' +
      '<div class="forja-banco">' +
      '<label class="forja-buscar">' + esc(cu("buscar")) +
      '<input id="cubo-q" type="search" placeholder="' + esc(cu("ph")) + '" autocomplete="off"></label>' +
      '<div id="cubo-lista" class="forja-lista"></div>' +
      '<div id="cubo-escena"></div>' +
      "</div>" +
      '<aside id="cubo-lado" class="forja-lado"></aside></div>' +
      '<section class="piedra-catalogo">' +
      '<h2>' + esc(cu("farm")) + "</h2>" +
      '<label class="forja-buscar">' +
      '<input id="farm-q" type="search" placeholder="' + esc(cu("ph_item")) + '" autocomplete="off"></label>' +
      '<div id="farm-lista" class="forja-lista"></div>' +
      '<div id="farm-escena"></div></section>';
    $("#main").innerHTML = shell("ht.drops.titulo", "ht.drops.sub", body, "dungeons__recompensas-de-mazmorra-el-cubo-y-el-contador-de-pity");
    var subs = document.querySelectorAll("#main .cabeza-seccion > p.suave");
    if (subs.length > 1) subs[1].textContent = cu("sub");
    $("#cubo-escena").innerHTML = '<p class="forja-vacio">' + esc(cu("cargando")) + "</p>";

    function grupos(mods) {
      var out = [];
      var idx = {};
      (mods || []).forEach(function (m) {
        if (idx[m.dungeon] == null) {
          idx[m.dungeon] = out.length;
          out.push({ en: m.dungeon, modos: [] });
        }
        out[idx[m.dungeon]].modos.push(m);
      });
      return out;
    }
    function filaActual() {
      if (!actual) return null;
      return actual.modos[modoIdx] || actual.modos[0] || null;
    }
    function pintarLista(q) {
      var lista = $("#cubo-lista");
      var nq = (q || "").toLowerCase();
      var rows = mazmorras.filter(function (d) {
        if (!nq) return false;
        return nombreDun(d.en).toLowerCase().indexOf(nq) >= 0 || d.en.toLowerCase().indexOf(nq) >= 0;
      }).slice(0, 8);
      if ((q || "").trim().length < 2) { lista.innerHTML = ""; return; }
      if (!rows.length) {
        lista.innerHTML = '<p class="forja-vacio">' + esc(cu("nada")) + "</p>";
        return;
      }
      lista.innerHTML = rows.map(function (d, i) {
        var foto = FOTO[d.en] ? '<img class="forja-mini" alt="" src="' + esc(FOTO[d.en]) + '">' : '<span class="forja-mini letra">' + esc(nombreDun(d.en).charAt(0)) + "</span>";
        return '<button type="button" class="forja-op" data-dun="' + i + '">' + foto +
          "<span><b>" + esc(nombreDun(d.en)) + "</b><small>" + d.modos.length + "</small></span></button>";
      }).join("");
      lista._rows = rows;
    }
    function pintarCubo() {
      var escena = $("#cubo-escena");
      var lado = $("#cubo-lado");
      if (!actual) {
        escena.innerHTML = '<p class="forja-vacio">' + esc(cu("vacio")) + "</p>";
        lado.innerHTML = "";
        return;
      }
      var fila = filaActual();
      var foto = FOTO[actual.en];
      var chips = actual.modos.map(function (m, i) {
        return '<button type="button" class="piedra-grupo' + (i === modoIdx ? " on" : "") + '" data-modo="' + i + '">' +
          esc(nombreModo(m.modo)) + "</button>";
      }).join("");
      escena.innerHTML =
        '<div class="forja-hueco' + (foto ? " cubo-foto" : "") + '"' +
        (foto ? ' style="background-image:url(\'' + esc(foto) + '\')"' : "") + "></div>" +
        '<h2 class="forja-nombre">' + esc(nombreDun(actual.en)) + "</h2>" +
        '<div class="piedra-grupos cubo-modos">' + chips + "</div>";
      if (!fila) { lado.innerHTML = ""; return; }
      var tope = numCelda(fila.cubos);
      var estrella = /\*/.test(String(fila.kinah || "") + String(fila.premio || "") + String(fila.cubos || ""));
      var clave = claveCubo(actual.en, fila.modo);
      var n = Math.max(0, Number(abiertos[clave]) || 0);
      var falta = tope == null ? null : Math.max(0, tope - n);
      var ancho = tope ? Math.min(100, Math.round(n / tope * 100)) : 0;
      var premio = String(fila.premio || "").trim();
      var muestraPremio = premio && premio !== "—" && premio !== "-";
      lado.innerHTML =
        '<div class="oficio-resumen cubo-nums">' +
        '<div><span>' + esc(cu("energia")) + "</span><b>" + esc(String(fila.energia || "—")) + "</b></div>" +
        '<div><span>' + esc(cu("hasta")) + "</span><b>" + esc(tope == null ? "—" : String(tope)) + "</b></div>" +
        '<div><span>' + esc(cu("kinah")) + "</span><b>" + esc(String(fila.kinah || "—")) + "</b></div>" +
        (falta == null ? "" : '<div><span>' + esc(cu("falta")) + "</span><b class=\"oficio-cero\" id=\"cubo-falta\">" + falta + "</b></div>") +
        "</div>" +
        (tope == null ? '<p class="piedra-nota">' + esc(cu("sin_cubos")) + "</p>" :
          '<div class="oficio-progreso" aria-hidden="true"><i id="cubo-barra" style="width:' + ancho + '%"></i></div>' +
          '<div class="oficio-cantidad"><span>' + esc(cu("abiertos")) + "</span>" +
          '<button type="button" class="boton chico" id="cubo-menos">−</button>' +
          '<input id="cubo-n" type="number" min="0" inputmode="numeric" value="' + n + '">' +
          '<button type="button" class="boton chico" id="cubo-mas">+</button></div>') +
        (muestraPremio ? '<p class="piedra-nota"><b>' + esc(cu("premio")) + "</b> " + esc(premio) + "</p>" : "") +
        (estrella ? '<p class="piedra-nota">' + esc(cu("asterisco")) + "</p>" : "");
    }
    function fijarAbiertos(n) {
      var fila = filaActual();
      if (!actual || !fila) return;
      abiertos[claveCubo(actual.en, fila.modo)] = Math.max(0, n);
      guardarAbiertos(abiertos);
      var tope = numCelda(fila.cubos);
      var falta = tope == null ? null : Math.max(0, tope - abiertos[claveCubo(actual.en, fila.modo)]);
      var el = $("#cubo-falta");
      if (el && falta != null) el.textContent = String(falta);
      var bar = $("#cubo-barra");
      if (bar && tope) bar.style.width = Math.min(100, Math.round(abiertos[claveCubo(actual.en, fila.modo)] / tope * 100)) + "%";
      var inp = $("#cubo-n");
      if (inp && document.activeElement !== inp) inp.value = String(abiertos[claveCubo(actual.en, fila.modo)]);
    }
    function esRecoleccion(p) {
      var t = ((p && (p.label_en || p.label)) || "") + " " + ((p && p.sub) || "");
      return /odyle|ruby|rub[ií]|orichalcum|aria|asvata|zaif/i.test(t);
    }
    function qMapa(p) {
      var t = ((p && (p.label_en || p.label)) || "");
      if (/ruby|rub[ií]/i.test(t)) return "ruby";
      if (/odyle/i.test(t)) return "Odyle";
      if (/orichalcum/i.test(t)) return "Orichalcum";
      if (/aria/i.test(t)) return "Aria";
      if (/asvata/i.test(t)) return "Asvata";
      if (/zaif/i.test(t)) return "Zaif";
      return t;
    }
    function pintarFarm() {
      var box = $("#farm-escena");
      if (!pieza) { box.innerHTML = ""; return; }
      var drops = (fichaItem && fichaItem.drops) || [];
      var mapa = "";
      if (esRecoleccion(pieza)) {
        var lang = (typeof IDIOMA === "string" && IDIOMA) ? IDIOMA : "es";
        mapa = '<p><a class="boton chico" href="mapa.html?c=recoleccion&q=' + encodeURIComponent(qMapa(pieza)) +
          "&lang=" + encodeURIComponent(lang) + '">' + esc(cu("mapa")) + "</a></p>";
      }
      var max = 0;
      drops.forEach(function (s) { if ((s.pct || 0) > max) max = s.pct; });
      if (!max) max = 1;
      var lista = drops.length ? '<ul class="piedra-lineas">' + drops.map(function (s) {
        var w = Math.max(4, Math.round(((s.pct || 0) / max) * 100));
        return "<li><span class=\"piedra-nom\">" + esc(s.nombre) + '</span><span class="piedra-barra"><i style="width:' + w +
          '%"></i></span><b>' + esc(s.chance || "") + "</b></li>";
      }).join("") + "</ul>" : (mapa ? "" : '<p class="forja-vacio">' + esc(cu("sin_drop")) + "</p>");
      box.innerHTML =
        '<div class="forja-hueco cubo-item">' + icoForja(pieza, true) + "</div>" +
        '<h2 class="forja-nombre">' + esc(pieza.label) + "</h2>" +
        lista + mapa;
    }
    function cargarItem(p) {
      pieza = p;
      fichaItem = null;
      $("#farm-lista").innerHTML = "";
      $("#farm-escena").innerHTML = '<p class="forja-vacio">' + esc(cu("buscando")) + "</p>";
      var gen = ++itemGen;
      api("GET", "/api/datos/ficha?href=" + encodeURIComponent(p.href || "") + "&lang=" + encodeURIComponent(IDIOMA || "es")).then(function (d) {
        if (gen !== itemGen || !pieza || pieza.href !== p.href) return;
        fichaItem = d;
        if (d && d.icon) pieza.icon = d.icon;
        pintarFarm();
      }).catch(function () {
        if (gen !== itemGen) return;
        pintarFarm();
      });
    }
    function buscarItem() {
      var q = ($("#farm-q").value || "").trim();
      var lista = $("#farm-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      var gen = ++buscaGen;
      if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(cu("buscando"));
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=objetos&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=16").then(function (d) {
        if (gen !== buscaGen) return;
        var vistos = {};
        var rows = (d.resultados || []).filter(function (r) {
          var k = (r.label_en || r.label) + "|" + (r.sub || "");
          if (vistos[k]) return false;
          vistos[k] = 1;
          return true;
        }).slice(0, 8);
        if (!rows.length) {
          lista.innerHTML = '<p class="forja-vacio">' + esc(cu("nada")) + "</p>";
          return;
        }
        lista.innerHTML = rows.map(function (r, i) {
          return '<button type="button" class="forja-op" data-item="' + i + '">' + icoForja(r, false) +
            "<span><b>" + esc(r.label) + "</b><small>" + esc(r.sub || "") + "</small></span></button>";
        }).join("");
        lista._rows = rows;
      }).catch(function () {
        if (gen !== buscaGen) return;
        lista.innerHTML = '<p class="forja-vacio">' + esc(cu("nada")) + "</p>";
      });
    }

    api("GET", "/api/datos/cubos").then(function (d) {
      tabla = d;
      mazmorras = grupos(d.modos || []);
      var qLista = ($("#cubo-q").value || "").trim();
      if (qLista.length >= 2) pintarLista(qLista);
      else $("#cubo-escena").innerHTML = '<p class="forja-vacio">' + esc(cu("vacio")) + "</p>";
    }).catch(function () {
      $("#cubo-escena").innerHTML = '<p class="forja-vacio">' + esc(cu("sin_tabla")) + "</p>";
    });

    $("#cubo-q").addEventListener("input", function () {
      pintarLista(($("#cubo-q").value || "").trim());
    });
    $("#farm-q").addEventListener("input", function () {
      clearTimeout(buscaTimer);
      var q = ($("#farm-q").value || "").trim();
      var lista = $("#farm-lista");
      if (q.length < 2) lista.innerHTML = "";
      else if (!lista.querySelector(".forja-busca")) lista.innerHTML = avisoBusca(cu("buscando"));
      buscaTimer = setTimeout(buscarItem, 220);
    });
    $("#main").addEventListener("click", function (ev) {
      var dun = ev.target.closest("#cubo-lista .forja-op");
      if (dun) {
        var row = ($("#cubo-lista")._rows || [])[+dun.getAttribute("data-dun")];
        if (row) {
          actual = row;
          var pref = row.modos.findIndex(function (m) { return m.modo === "Conquest" || m.modo === "Normal"; });
          modoIdx = pref >= 0 ? pref : 0;
          $("#cubo-lista").innerHTML = "";
          pintarCubo();
        }
        return;
      }
      var modo = ev.target.closest("[data-modo]");
      if (modo && actual) {
        modoIdx = +modo.getAttribute("data-modo");
        pintarCubo();
        return;
      }
      if (ev.target.closest("#cubo-mas")) {
        var fila = filaActual();
        if (!fila) return;
        fijarAbiertos((Number(abiertos[claveCubo(actual.en, fila.modo)]) || 0) + 1);
        var inp = $("#cubo-n");
        if (inp) inp.value = String(abiertos[claveCubo(actual.en, fila.modo)]);
        return;
      }
      if (ev.target.closest("#cubo-menos")) {
        var fila2 = filaActual();
        if (!fila2) return;
        fijarAbiertos((Number(abiertos[claveCubo(actual.en, fila2.modo)]) || 0) - 1);
        var inp2 = $("#cubo-n");
        if (inp2) inp2.value = String(abiertos[claveCubo(actual.en, fila2.modo)]);
        return;
      }
      var item = ev.target.closest("#farm-lista .forja-op");
      if (item) {
        var piezaRow = ($("#farm-lista")._rows || [])[+item.getAttribute("data-item")];
        if (piezaRow) cargarItem(piezaRow);
      }
    });
    $("#main").addEventListener("input", function (ev) {
      if (ev.target.id !== "cubo-n" || !actual) return;
      var fila = filaActual();
      if (!fila) return;
      fijarAbiertos(Math.floor(Number(ev.target.value) || 0));
    });
  }

  /* ---------- Potential / Amplify / Transfer ---------- */
  function renderPotential() {
    var ampOpts = [0, 1, 2, 3, 4, 5].map(function (n) { return { v: n, t: "◆" + n }; });
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.amp")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.mejora.desde"), selectHtml("a-from", ampOpts, 0)) +
      campo(t("ht.mejora.hasta"), selectHtml("a-to", ampOpts, 3)) +
      '</div><div id="a-out" class="ht-resultado"></div>' +
      aviso(L(D.amplify.req)) + fuentes(["enhanceClient"]) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.pot")) + "</h2>" +
      '<div class="ht-form">' + campo(t("ht.potential.nivel"), numInput("p-lvl", 0, ' min="0" max="4"')) + "</div>" +
      '<div id="p-out" class="ht-resultado"></div>' +
      aviso(L(D.potential.note)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.potential.transfer")) + "</h2>" +
      '<ul class="ht-lista">' +
      "<li>" + esc(t("ht.potential.t1")) + "</li>" +
      "<li>" + esc(t("ht.potential.t2")) + "</li>" +
      "<li>" + esc(t("ht.potential.t3")) + "</li>" +
      "<li>" + esc(t("ht.potential.t4")) + "</li>" +
      "</ul></div>";
    $("#main").innerHTML = shell("ht.potential.titulo", "ht.potential.sub", body, "progression__enhancement-amplify-y-transfer");

    function recalcAmp() {
      var from = +$("#a-from").value;
      var to = +$("#a-to").value;
      if (to <= from) {
        $("#a-out").innerHTML = aviso(t("ht.mejora.rango_malo"));
        return;
      }
      var tot = 0;
      var html = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.col.paso")) +
        "</th><th>" + esc(t("ht.col.tasa")) + "</th><th>" + esc(t("ht.col.pity")) +
        "</th><th>" + esc(t("ht.col.media")) + "</th><th>" + esc(t("ht.col.techo")) +
        "</th></tr></thead><tbody>";
      for (var i = from; i < to; i++) {
        var st = D.amplify.steps.filter(function (s) { return s.from === i; })[0];
        if (!st) continue;
        var e = expectedTries(st.rate, st.pity);
        tot += e;
        html += "<tr><td>◆" + i + " → ◆" + (i + 1) + "</td><td>" + pct(st.rate) +
          "</td><td>+" + pct(st.pity) + "</td><td>" + fmt(e, 2) + "</td><td>" +
          fmt(maxTries(st.rate, st.pity), 0) + "</td></tr>";
      }
      html += '</tbody></table><div class="ht-totales"><div><span>' + esc(t("ht.mejora.intentos")) +
        "</span><b>" + fmt(tot, 2) + "</b></div></div>";
      $("#a-out").innerHTML = html;
    }
    function recalcPot() {
      var lvl = Math.max(0, Math.min(4, +$("#p-lvl").value || 0));
      var bonus = lvl * 0.5;
      $("#p-out").innerHTML =
        '<div class="ht-totales"><div><span>' + esc(t("ht.potential.bonus")) +
        "</span><b>+" + fmt(bonus, 1) + "%</b></div>" +
        "<div><span>" + esc(t("ht.potential.max")) + "</span><b>+2,0%</b></div></div>" +
        "<p class=\"suave\">" + esc(L(D.potential.perLevel)) + "</p>";
    }
    ["a-from", "a-to"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalcAmp);
    });
    $("#p-lvl").addEventListener("input", recalcPot);
    recalcAmp();
    recalcPot();
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    var P = window.PIEDRAS_HERRAMIENTAS || { mana: {}, labels: {} };
    var keys = Object.keys(P.mana || {}).sort();
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.capas")) + "</h2><ol class=\"ht-lista\">" +
      (D.stats.layers || []).map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") +
      "</ol></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.roles")) + "</h2><div class=\"ht-grid ht-grid-sm\">" +
      (D.stats.roles || []).map(function (r) {
        return '<div class="ht-card ht-card-static"><b>' + esc(L(r.name)) + "</b><small>" + esc(L(r.focus)) + "</small></div>";
      }).join("") + "</div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.stats.plan_mana")) + "</h2>" +
      '<p class="suave">' + esc(t("ht.stats.plan_sub")) + "</p>" +
      '<div id="s-slots" class="ht-slots"></div>' +
      '<div id="s-out" class="ht-resultado"></div>' + fuentes(["piedras"]) + "</div>";
    $("#main").innerHTML = shell("ht.stats.titulo", "ht.stats.sub", body, null);

    var slotN = 8;
    var html = "";
    for (var i = 0; i < slotN; i++) {
      html += '<div class="ht-form ht-slot-row">' +
        campo(t("ht.stats.hueco") + " " + (i + 1),
          selectHtml("s-stat-" + i, [{ v: "", t: "—" }].concat(keys.map(function (k) {
            return { v: k, t: P.labels[k] ? L(P.labels[k]) : k };
          })), "")) +
        campo(t("ht.col.grado"), selectHtml("s-gr-" + i, [
          { v: "11", t: gradeLabel(11) }, { v: "21", t: gradeLabel(21) },
          { v: "31", t: gradeLabel(31) }, { v: "41", t: gradeLabel(41) }
        ], "31")) +
        "</div>";
    }
    $("#s-slots").innerHTML = html;

    function recalc() {
      var totals = {};
      for (var i = 0; i < slotN; i++) {
        var k = $("#s-stat-" + i).value;
        var g = +$("#s-gr-" + i).value;
        if (!k) continue;
        var row = (P.mana[k] || []).filter(function (p) { return p[1] === g; })[0];
        if (!row) continue;
        totals[k] = (totals[k] || 0) + row[0];
      }
      var keysT = Object.keys(totals);
      if (!keysT.length) {
        $("#s-out").innerHTML = aviso(t("ht.stats.vacio"));
        return;
      }
      $("#s-out").innerHTML = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.odds.stat")) +
        "</th><th>" + esc(t("ht.col.valor")) + "</th></tr></thead><tbody>" +
        keysT.map(function (k) {
          var lab = P.labels[k] ? L(P.labels[k]) : k;
          return "<tr><td>" + esc(lab) + "</td><td><b>" + totals[k] + "</b></td></tr>";
        }).join("") + "</tbody></table>";
    }
    for (var j = 0; j < slotN; j++) {
      $("#s-stat-" + j).addEventListener("change", recalc);
      $("#s-gr-" + j).addEventListener("change", recalc);
    }
    recalc();
  }

  /* ---------- Pantheon ---------- */
  function renderPantheon() {
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.huecos")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.tipo")) + "</th><th>#</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.pantheon.slots || []).map(function (s) {
        return "<tr><td>" + esc(L(s.type)) + "</td><td>" + s.n + "</td><td>" + esc(L(s.feeds)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.roles")) + "</h2><div class=\"ht-grid ht-grid-sm\">" +
      (D.pantheon.gods || []).map(function (g) {
        return '<div class="ht-card ht-card-static"><b>' + esc(g.name) + "</b><small>" +
          esc(L(g.role)) + " · " + esc(L(g.effect)) + "</small></div>";
      }).join("") + "</div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.pantheon.plan")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.col.tipo"), selectHtml("ph-kind", [
        { v: "Cuadro", t: t("ht.pantheon.cuadro") },
        { v: "Estatua", t: t("ht.pantheon.estatua") },
        { v: "Coloso", t: t("ht.pantheon.coloso") }
      ], "Cuadro")) +
      campo(t("ht.col.grado"), selectHtml("ph-gr", [
        { v: "Raro", t: t("ht.grado.rare") },
        { v: "Legendario", t: t("ht.grado.legendary") },
        { v: "Único", t: t("ht.grado.unique") },
        { v: "Épico", t: t("ht.grado.heroic") },
        { v: "Común", t: t("ht.grado.common") }
      ], "Único")) +
      campo(t("ht.pantheon.cantidad"), numInput("ph-n", 1, ' min="1" max="17"')) +
      '</div><div id="ph-out" class="ht-resultado"></div>' +
      aviso(t("ht.pantheon.nota")) + fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.pantheon.titulo", "ht.pantheon.sub", body, "progression__pantheon-wardrobe-y-titulos-stats-ocultos");

    function recalc() {
      var kindEs = $("#ph-kind").value;
      var grEs = $("#ph-gr").value;
      var n = Math.max(1, +$("#ph-n").value || 1);
      var row = (D.pantheon.grades || []).filter(function (g) {
        return g.kind.es === kindEs && g.grade.es === grEs;
      })[0];
      if (!row) {
        $("#ph-out").innerHTML = aviso(t("ht.pantheon.combo_malo"));
        return;
      }
      var pts = row.lines * row.pts * n;
      $("#ph-out").innerHTML =
        '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.pantheon.lineas")) + "</span><b>" + (row.lines * n) + "</b></div>" +
        "<div><span>" + esc(t("ht.pantheon.pts_pieza")) + "</span><b>" + (row.lines * row.pts) + "</b></div>" +
        "<div><span>" + esc(t("ht.pantheon.pts_total")) + "</span><b>" + pts + "</b></div></div>" +
        "<p class=\"suave\">" + esc(t("ht.pantheon.formula")) + ": " + row.lines + " × " + row.pts + " × " + n + "</p>";
    }
    ["ph-kind", "ph-gr", "ph-n"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalc);
      $("#" + id).addEventListener("input", recalc);
    });
    recalc();
  }

  /* ---------- Arcana ---------- */
  function renderArcana() {
    var checked = {};
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.arcana.piezas")) + "</h2>" +
      '<div id="ar-list" class="ht-check-list"></div>' +
      '<div id="ar-out" class="ht-resultado"></div></div>' +
      '<div class="ht-panel"><h2>' + esc(t("ht.arcana.rareza")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.grado")) + "</th><th>" + esc(t("ht.arcana.skills")) + "</th></tr></thead><tbody>" +
      (D.arcana.rarity || []).map(function (r) {
        return "<tr><td>" + esc(L(r.g)) + "</td><td>" + r.skills + "</td></tr>";
      }).join("") + "</tbody></table>" + aviso(L(D.arcana.note)) + fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.arcana.titulo", "ht.arcana.sub", body, "progression__daevanion-y-arcana-mas-alla-del-techo-de-habilidad");

    var list = $("#ar-list");
    list.innerHTML = (D.arcana.pieces || []).map(function (p) {
      return '<label class="ht-check"><input type="checkbox" data-id="' + p.id + '"> <b>' +
        esc(L(p)) + "</b> <span class=\"suave\">· " + esc(p.from) + " · " + esc(L(p.feeds)) + "</span></label>";
    }).join("");

    function recalc() {
      var n = 0;
      list.querySelectorAll("input").forEach(function (inp) {
        if (inp.checked) n++;
      });
      var tip = n >= 6 ? t("ht.arcana.full") :
        n >= 4 ? t("ht.arcana.set42") :
          n >= 2 ? t("ht.arcana.parcial") : t("ht.arcana.pocas");
      $("#ar-out").innerHTML =
        '<div class="ht-totales"><div><span>' + esc(t("ht.arcana.equipadas")) +
        "</span><b>" + n + " / 6</b></div></div><p>" + esc(tip) + "</p>";
    }
    list.addEventListener("change", recalc);
    recalc();
  }

  /* ---------- Boot ---------- */
  function metaTool(id) {
    document.title = t("ht." + id + ".titulo") + " · Aion 2 Forge AION 2";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("ht." + id + ".desc"));
    var kw = document.querySelector('meta[name="keywords"]');
    if (kw) kw.setAttribute("content", t("ht." + id + ".kw"));
  }

  function renderTool(id) {
    cabecera("herramientas");
    metaTool(id);
    var map = {
      mejora: renderMejora,
      craft: renderCraft,
      odds: renderOdds,
      drops: renderDrops,
      potential: renderPotential,
      stats: renderStats,
      pantheon: renderPantheon,
      arcana: renderArcana
    };
    if (!map[id]) {
      $("#main").innerHTML = '<p class="suave">' + esc(t("ht.no_existe")) +
        ' <a href="herramientas.html">' + esc(t("ht.volver")) + "</a></p>";
      return;
    }
    map[id]();
  }

  window.OC_HERRAMIENTAS = { renderHub: renderHub, renderTool: renderTool, TOOLS: TOOLS };
})();
