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

    function buscar() {
      var q = ($("#forja-q").value || "").trim();
      var lista = $("#forja-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=objetos&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=16").then(function (d) {
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
        lista.innerHTML = '<p class="forja-vacio">' + esc(fm("nada")) + "</p>";
      });
    }

    $("#forja-q").addEventListener("input", function () {
      clearTimeout(buscaTimer);
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
    function buscar() {
      var q = ($("#oficio-q").value || "").trim();
      var lista = $("#oficio-lista");
      if (q.length < 2) { lista.innerHTML = ""; return; }
      api("GET", "/api/datos/buscar?q=" + encodeURIComponent(q) + "&tipo=todo&lang=" + encodeURIComponent(IDIOMA || "es") + "&limite=24").then(function (d) {
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
        lista.innerHTML = '<p class="forja-vacio">' + esc(fo("nada")) + "</p>";
      });
    }
    $("#oficio-q").addEventListener("input", function () {
      clearTimeout(buscaTimer);
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
    var keys = Object.keys(P.mana || {}).sort();
    var opts = keys.map(function (k) {
      var lab = P.labels[k] ? L(P.labels[k]) : k;
      return { v: k, t: lab };
    });
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.orden")) + "</h2><ol class=\"ht-lista\">" +
      (D.odds.order || []).map(function (o) { return "<li>" + esc(L(o)) + "</li>"; }).join("") +
      "</ol>" + aviso(L(D.odds.note)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.mana")) + "</h2>" +
      '<div class="ht-form">' + campo(t("ht.odds.stat"), selectHtml("o-stat", opts, opts[0] && opts[0].v)) + "</div>" +
      '<div id="o-mana" class="ht-resultado"></div>' + fuentes(["piedras"]) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.soul")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.hueco")) + "</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.odds.soulbind || []).map(function (r) {
        return "<tr><td>" + esc(L(r.slot)) + "</td><td>" + esc(L(r.opts)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.sync")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.hueco")) + "</th><th>" + esc(t("ht.col.opciones")) + "</th></tr></thead><tbody>" +
      (D.odds.syncEssentials || []).map(function (r) {
        return "<tr><td>" + esc(L(r.slot)) + "</td><td>" + esc(L(r.opt)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.odds.theo")) + "</h2>" +
      '<input type="search" id="o-theo-q" placeholder="' + esc(t("ht.odds.buscar")) + '">' +
      '<div id="o-theo" class="ht-lista-scroll"></div></div>';
    $("#main").innerHTML = shell("ht.odds.titulo", "ht.odds.sub", body, "progression__manastone-theostone-y-soul-binding");

    function showMana() {
      var k = $("#o-stat").value;
      var rows = P.mana[k] || [];
      var html = '<table class="ht-tabla"><thead><tr><th>' + esc(t("ht.col.grado")) +
        "</th><th>" + esc(t("ht.col.valor")) + "</th></tr></thead><tbody>";
      rows.forEach(function (pair) {
        html += "<tr><td>" + esc(gradeLabel(pair[1])) + " <span class=\"suave\">(" + pair[1] + ")</span></td><td><b>" + pair[0] + "</b></td></tr>";
      });
      html += "</tbody></table>";
      $("#o-mana").innerHTML = html || aviso(t("ht.sin_datos"));
    }
    function showTheo() {
      var q = ($("#o-theo-q").value || "").toLowerCase();
      var list = (P.divinas || []).filter(function (x) {
        var n = L(x.n).toLowerCase();
        var d = L(x.d).toLowerCase();
        return !q || n.indexOf(q) >= 0 || d.indexOf(q) >= 0;
      }).slice(0, 40);
      $("#o-theo").innerHTML = list.map(function (x) {
        return '<div class="ht-item"><b>' + esc(L(x.n)) + "</b><small>" + esc(L(x.d)) + "</small></div>";
      }).join("") || aviso(t("ht.sin_datos"));
    }
    $("#o-stat").addEventListener("change", showMana);
    $("#o-theo-q").addEventListener("input", showTheo);
    showMana();
    showTheo();
  }

  /* ---------- Drops ---------- */
  function renderDrops() {
    var body =
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.pity")) + "</h2>" +
      '<div class="ht-form">' +
      campo(t("ht.drops.tier"), selectHtml("d-tier", (D.drops.pity || []).map(function (p) {
        return { v: p.tier, t: t("ht.drops.nivel") + " " + p.tier };
      }), 1)) +
      campo(t("ht.drops.clears"), numInput("d-clears", 0, ' min="0" step="1"')) +
      "</div><div id=\"d-out\" class=\"ht-resultado\"></div></div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.reglas")) + "</h2><ul class=\"ht-lista\">" +
      (L(D.drops.rules) || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul>" + aviso(L(D.drops.odyle)) + "</div>" +
      '<div class="ht-panel"><h2>' + esc(t("ht.drops.farms")) + "</h2><table class=\"ht-tabla\"><thead><tr>" +
      "<th>" + esc(t("ht.col.item")) + "</th><th>" + esc(t("ht.col.donde")) + "</th></tr></thead><tbody>" +
      (D.drops.farms || []).map(function (f) {
        return "<tr><td>" + esc(L(f.item)) + "</td><td>" + esc(L(f.where)) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<p><a class="boton chico" href="mapa.html">' + esc(t("ht.drops.mapa")) + "</a></p>" +
      fuentes(["guiasOc"]) + "</div>";
    $("#main").innerHTML = shell("ht.drops.titulo", "ht.drops.sub", body, "dungeons__recompensas-de-mazmorra-el-cubo-y-el-contador-de-pity");
    function recalc() {
      var tier = +$("#d-tier").value;
      var clears = +$("#d-clears").value || 0;
      var row = (D.drops.pity || []).filter(function (p) { return p.tier === tier; })[0];
      if (!row) return;
      var left = Math.max(0, row.clears - clears);
      var pctDone = Math.min(100, (clears / row.clears) * 100);
      $("#d-out").innerHTML =
        '<div class="ht-totales">' +
        "<div><span>" + esc(t("ht.drops.garantia")) + "</span><b>" + row.clears + "</b></div>" +
        "<div><span>" + esc(t("ht.drops.faltan")) + "</span><b>" + left + "</b></div>" +
        "<div><span>" + esc(t("ht.drops.progreso")) + "</span><b>" + fmt(pctDone, 0) + "%</b></div></div>" +
        "<p>" + esc(L(row.reward)) + "</p>" +
        aviso(t("ht.drops.pity_nota"));
    }
    ["d-tier", "d-clears"].forEach(function (id) {
      $("#" + id).addEventListener("change", recalc);
      $("#" + id).addEventListener("input", recalc);
    });
    recalc();
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
