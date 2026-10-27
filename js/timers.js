// Timers AION 2: grieta, jefes, Shugo, invasión y resets. Horario comunitario, diseño Orden Celeste.
(function () {
  var STORE = "oc:timers:region";
  var CATS = ["all", "rift", "boss", "shugo", "invasion", "reset"];
  var region = "eu";
  var filtro = "all";
  var tick = null;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function partesTz(ms, tz) {
    var parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      weekday: "short", hourCycle: "h23"
    }).formatToParts(new Date(ms)).forEach(function (p) {
      if (p.type !== "literal") parts[p.type] = p.value;
    });
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      y: +parts.year, m: +parts.month, d: +parts.day,
      h: +parts.hour, mi: +parts.minute, s: +parts.second,
      wd: wd[parts.weekday] != null ? wd[parts.weekday] : 0
    };
  }

  // Epoch UTC aproximado de y-m-d h:mi en zona tz (refina el offset).
  function epochEnTz(y, m, d, h, mi, tz) {
    var guess = Date.UTC(y, m - 1, d, h, mi, 0);
    for (var i = 0; i < 3; i++) {
      var p = partesTz(guess, tz);
      var asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
      var want = Date.UTC(y, m - 1, d, h, mi, 0);
      guess += want - asUtc;
    }
    return guess;
  }

  function parseHM(hm) {
    var a = String(hm).split(":");
    return { h: +a[0], mi: +a[1] || 0 };
  }

  function perfilRegion(id) {
    var r = (window.TIMERS_REGIONS || {})[id];
    return r || window.TIMERS_REGIONS.eu;
  }

  function eventosDe(id) {
    var r = perfilRegion(id);
    return (window.TIMERS_EVENTS && window.TIMERS_EVENTS[r.profile]) || [];
  }

  function tzEvento(ev, regionId) {
    if (ev.tzFixed) return ev.tzFixed;
    return perfilRegion(regionId).tz;
  }

  function candidatos(ev, regionId, fromMs, horizonDays) {
    var tz = tzEvento(ev, regionId);
    var out = [];
    var base = partesTz(fromMs - 2 * 86400000, tz);
    var start = epochEnTz(base.y, base.m, base.d, 0, 0, tz);
    horizonDays = horizonDays || 8;
    for (var day = 0; day < horizonDays; day++) {
      var noon = start + day * 86400000 + 12 * 3600000;
      var p = partesTz(noon, tz);
      if (ev.type === "hourly") {
        for (var h = 0; h < 24; h++) {
          out.push(epochEnTz(p.y, p.m, p.d, h, ev.minute || 0, tz));
        }
      } else if (ev.type === "daily") {
        (ev.times || []).forEach(function (hm) {
          var t = parseHM(hm);
          out.push(epochEnTz(p.y, p.m, p.d, t.h, t.mi, tz));
        });
      } else if (ev.type === "weekly") {
        if ((ev.days || []).indexOf(p.wd) < 0) continue;
        (ev.times || []).forEach(function (hm) {
          var t = parseHM(hm);
          out.push(epochEnTz(p.y, p.m, p.d, t.h, t.mi, tz));
        });
      }
    }
    return out.sort(function (a, b) { return a - b; });
  }

  function estadoEvento(ev, regionId, now) {
    var starts = candidatos(ev, regionId, now, 10);
    var dur = (ev.durationMin || 0) * 60000;
    var portal = (ev.portalMin || 0) * 60000;
    var live = null, next = null, prev = null;
    for (var i = 0; i < starts.length; i++) {
      var s = starts[i];
      var end = s + Math.max(dur, portal || 0);
      if (s <= now && now < end) {
        live = { start: s, end: end, phase: portal && now < s + portal ? "portal" : "live" };
      }
      if (s > now && !next) next = s;
      if (s <= now) prev = s;
    }
    if (!next && starts.length) next = starts[starts.length - 1] + 7 * 86400000;
    var target = live ? live.end : next;
    return { live: live, next: next, prev: prev, target: target };
  }

  function fmtCountdown(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600); s %= 3600;
    var m = Math.floor(s / 60); s %= 60;
    if (d > 0) return d + "d " + pad(h) + ":" + pad(m) + ":" + pad(s);
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  function fmtCuando(ms, tz) {
    try {
      return new Intl.DateTimeFormat(IDIOMA === "es" ? "es-ES" : "en-GB", {
        timeZone: tz, weekday: "short", day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      }).format(new Date(ms));
    } catch (e) {
      return new Date(ms).toISOString();
    }
  }

  function nombreEv(id) { return t("timers.ev." + id); }
  function reglaEv(ev) {
    if (ev.type === "hourly") {
      return t("timers.regla_hora").replace("{m}", pad(ev.minute || 0));
    }
    if (ev.type === "weekly") {
      var dias = (ev.days || []).map(function (d) { return t("timers.dia." + d); }).join(" · ");
      return dias + " · " + (ev.times || []).join(" / ");
    }
    return (ev.times || []).join(" · ");
  }

  function leerRegion() {
    try {
      var q = new URLSearchParams(location.search).get("r");
      if (q && window.TIMERS_REGIONS[q]) return q;
      var g = localStorage.getItem(STORE);
      if (g && window.TIMERS_REGIONS[g]) return g;
    } catch (e) {}
    return "eu";
  }

  function guardarRegion(id) {
    region = id;
    try { localStorage.setItem(STORE, id); } catch (e) {}
    try {
      var u = new URL(location.href);
      u.searchParams.set("r", id);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) {}
  }

  function pintarShell() {
    var main = $("#main");
    var regs = window.TIMERS_REGIONS || {};
    var opts = Object.keys(regs).map(function (id) {
      return '<option value="' + id + '"' + (id === region ? " selected" : "") + ">" +
        esc(tr(regs[id])) + "</option>";
    }).join("");
    var tabs = CATS.map(function (c) {
      return '<button type="button" class="timers-tab' + (filtro === c ? " on" : "") +
        '" data-filtro="' + c + '">' + esc(t("timers.cat." + c)) + "</button>";
    }).join("");
    main.innerHTML =
      '<section class="cabeza-seccion timers-cabeza">' +
      '<span class="antetitulo">' + esc(t("timers.antetitulo")) + "</span>" +
      "<h1>" + esc(t("timers.titulo")) + "</h1>" +
      '<p class="suave">' + esc(t("timers.sub")) + "</p>" +
      "</section>" +
      '<div class="timers-barra panel">' +
      '<label class="timers-campo"><span>' + esc(t("timers.region")) + "</span>" +
      '<select id="timers-region">' + opts + "</select></label>" +
      '<p class="suave timers-tz" id="timers-tz"></p>' +
      '<div class="timers-tabs">' + tabs + "</div>" +
      "</div>" +
      '<div class="timers-hero panel" id="timers-hero"></div>' +
      '<div class="timers-grid" id="timers-grid"></div>' +
      '<p class="suave timers-nota">' + esc(t("timers.nota").replace("{d}", (window.TIMERS_META || {}).verified || "—")) + "</p>" +
      '<p class="suave timers-fuentes" id="timers-fuentes"></p>';

    var fu = $("#timers-fuentes");
    if (fu && window.TIMERS_META && window.TIMERS_META.sources) {
      fu.innerHTML = esc(t("timers.fuentes")) + " " + window.TIMERS_META.sources.map(function (s) {
        return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
      }).join(" · ");
    }

    $("#timers-region").addEventListener("change", function () {
      guardarRegion(this.value);
      refrescar();
    });
    main.querySelectorAll("[data-filtro]").forEach(function (b) {
      b.addEventListener("click", function () {
        filtro = b.dataset.filtro;
        main.querySelectorAll("[data-filtro]").forEach(function (x) {
          x.classList.toggle("on", x.dataset.filtro === filtro);
        });
        refrescar();
      });
    });
  }

  function etiquetaCd(live) {
    return live ? t("timers.termina_en") : t("timers.abre_en");
  }

  function detalleCuando(ev, st, tzLocal) {
    if (st.live) {
      return t("timers.live_detalle")
        .replace("{inicio}", fmtCuando(st.live.start, tzLocal))
        .replace("{fin}", fmtCuando(st.live.end, tzLocal));
    }
    return t("timers.proximo") + " " + fmtCuando(st.next, tzLocal);
  }

  var IMG_EV = {
    rift: "img/oficial/ss_08.webp",
    shugo: "img/oficial/ss_00.webp",
    invasion: "img/oficial/ss_05.webp",
    kaira: "img/guias/d_kraocave.webp",
    siege: "img/oficial/ss_13.webp",
    siegeBosses: "img/oficial/ss_13.webp",
    nahma: "img/oficial/ss_09.webp",
    dailyReset: "img/oficial/page_bg.webp",
    weeklyReset: "img/oficial/library_hero.webp"
  };

  function imgEv(id) {
    return IMG_EV[id] || "img/oficial/ss_01.webp";
  }

  function tarjeta(ev, st, now, tzLocal, tzSrv) {
    var live = !!st.live;
    var target = st.target;
    var cd = fmtCountdown(target - now);
    var chip = ev.status === "confirmed"
      ? '<span class="chip timers-ok">' + esc(t("timers.confirmado")) + "</span>"
      : '<span class="chip timers-warn">' + esc(t("timers.provisional")) + "</span>";
    var fase = "";
    if (live && st.live.phase === "portal") fase = '<em class="timers-fase">' + esc(t("timers.portal")) + "</em>";
    else if (live) fase = '<em class="timers-fase">' + esc(t("timers.en_curso")) + "</em>";
    return '<article class="timers-card' + (live ? " live" : "") + '" data-id="' + esc(ev.id) + '" data-cat="' + esc(ev.cat) + '">' +
      '<div class="timers-thumb" style="background-image:url(\'' + imgEv(ev.id) + '\')"></div>' +
      '<div class="timers-card-body">' +
      '<div class="timers-card-top">' +
      "<h2>" + esc(nombreEv(ev.id)) + "</h2>" + chip +
      "</div>" +
      '<span class="suave timers-cd-label">' + esc(etiquetaCd(live)) + "</span>" +
      '<div class="timers-cd" aria-live="polite">' + esc(cd) + "</div>" +
      fase +
      '<p class="timers-cuando">' + esc(detalleCuando(ev, st, tzLocal)) + "</p>" +
      '<p class="suave timers-regla">' + esc(t("timers.hora_servidor")) + ": " + esc(reglaEv(ev)) +
      (ev.tzFixed ? " (UTC)" : "") + "</p>" +
      '<p class="suave timers-srv">' + esc(t("timers.en_servidor")) + ": " +
      esc(fmtCuando(live ? st.live.start : st.next, tzSrv)) + "</p>" +
      "</div></article>";
  }

  function refrescar() {
    var now = Date.now();
    var perfil = perfilRegion(region);
    var tzSrv = perfil.tz;
    var tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    var tzLabel = $("#timers-tz");
    if (tzLabel) {
      tzLabel.textContent = t("timers.reloj")
        .replace("{srv}", tzSrv)
        .replace("{local}", tzLocal);
    }

    var lista = eventosDe(region).filter(function (ev) {
      return filtro === "all" || ev.cat === filtro;
    });

    var estados = lista.map(function (ev) {
      return { ev: ev, st: estadoEvento(ev, region, now) };
    });
    estados.sort(function (a, b) {
      var ta = a.st.live ? -1 : (a.st.target || 0);
      var tb = b.st.live ? -1 : (b.st.target || 0);
      if (a.st.live && !b.st.live) return -1;
      if (!a.st.live && b.st.live) return 1;
      if (a.st.live && b.st.live) return (a.st.live.end - now) - (b.st.live.end - now);
      return ta - tb;
    });

    var hero = $("#timers-hero");
    if (hero && estados.length) {
      var top = estados[0];
      var live = !!top.st.live;
      hero.style.backgroundImage = "url('" + imgEv(top.ev.id) + "')";
      hero.classList.add("con-foto");
      hero.innerHTML =
        '<span class="chip">' + esc(t(live ? "timers.ahora" : "timers.siguiente")) + "</span>" +
        "<h2>" + esc(nombreEv(top.ev.id)) + "</h2>" +
        '<span class="suave timers-cd-label">' + esc(etiquetaCd(live)) + "</span>" +
        '<div class="timers-cd grande">' + esc(fmtCountdown(top.st.target - now)) + "</div>" +
        '<p class="suave">' + esc(detalleCuando(top.ev, top.st, tzLocal)) + "</p>";
    }

    var grid = $("#timers-grid");
    if (grid) {
      grid.innerHTML = estados.map(function (x) {
        return tarjeta(x.ev, x.st, now, tzLocal, tzSrv);
      }).join("");
    }
  }

  cabecera("timers").then(function () {
    region = leerRegion();
    pintarShell();
    refrescar();
    clearInterval(tick);
    tick = setInterval(refrescar, 1000);
  });
})();
