/* Marquesina del hero: Espía primero. Rota sola; pausa solo al interactuar con controles. */
(function () {
  var INTERVAL = 5500;
  var slides = [];
  var dots = [];
  var idx = 0;
  var timer = null;
  var paused = false;

  var SLIDES = [
    {
      id: "espia",
      img: "img/oficial/oc-arquero.webp",
      modo: "foto",
      href: "espia.html",
      chip: "inicio.slide.espia_chip",
      title: "inicio.slide.espia_titulo",
      txt: "inicio.slide.espia_txt",
      cta: "inicio.slide.espia_cta",
      ctaClass: "boton boton-espia"
    },
    {
      id: "tops",
      img: "img/oficial/ss_05.webp",
      modo: "foto",
      href: "tops.html",
      chip: "inicio.slide.tops_chip",
      title: "inicio.slide.tops_titulo",
      txt: "inicio.slide.tops_txt",
      cta: "inicio.slide.tops_cta",
      ctaClass: "boton oro"
    },
    {
      id: "timers",
      img: "img/oficial/ss_08.webp",
      modo: "foto",
      href: "timers.html",
      chip: "inicio.slide.timers_chip",
      title: "inicio.slide.timers_titulo",
      txt: "inicio.slide.timers_txt",
      cta: "inicio.slide.timers_cta",
      ctaClass: "boton"
    },
    {
      id: "herramientas",
      img: "img/oficial/ss_09.webp",
      modo: "foto",
      href: "herramientas.html",
      chip: "inicio.slide.ht_chip",
      title: "inicio.slide.ht_titulo",
      txt: "inicio.slide.ht_txt",
      cta: "inicio.slide.ht_cta",
      ctaClass: "boton oro"
    },
    {
      id: "mapa",
      img: "img/oficial/ss_01.webp",
      modo: "foto",
      href: "mapa.html",
      chip: "inicio.slide.mapa_chip",
      title: "inicio.slide.mapa_titulo",
      txt: "inicio.slide.mapa_txt",
      cta: "inicio.slide.mapa_cta",
      ctaClass: "boton"
    },
    {
      id: "guias",
      img: "img/oficial/library_hero.webp",
      modo: "foto",
      href: "guias.html",
      chip: "inicio.slide.guias_chip",
      title: "inicio.slide.guias_titulo",
      txt: "inicio.slide.guias_txt",
      cta: "inicio.slide.guias_cta",
      ctaClass: "boton"
    }
  ];

  function ir(n) {
    if (!slides.length) return;
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (el, i) {
      el.classList.toggle("on", i === idx);
      el.setAttribute("aria-hidden", i === idx ? "false" : "true");
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("on", i === idx);
      d.setAttribute("aria-current", i === idx ? "true" : "false");
    });
  }

  function siguiente() { ir(idx + 1); }

  function parar() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function programar() {
    parar();
    if (paused) return;
    if (typeof document !== "undefined" && document.hidden) return;
    timer = setTimeout(function () {
      if (!paused) {
        siguiente();
        programar();
      }
    }, INTERVAL);
  }

  function pausar(si) {
    paused = !!si;
    if (paused) parar();
    else programar();
  }

  function pintar(host) {
    if (!host) return;
    var html =
      '<div class="heroe-marca">' +
      '<img class="emblema-grande" src="img/orden-celeste-emblema.svg" alt="Orden Celeste">' +
      '<div><span class="antetitulo">' + esc(t("inicio.antetitulo")) + "</span>" +
      '<div class="nombre-gremio">Orden <span>Celeste</span></div></div></div>' +
      '<div class="heroe-viewport">' +
      SLIDES.map(function (s, i) {
        return '<article class="heroe-slide modo-' + s.modo + (i === 0 ? " on" : "") +
          '" data-id="' + s.id + '" aria-hidden="' + (i === 0 ? "false" : "true") + '">' +
          '<div class="heroe-media" style="background-image:url(\'' + s.img + '\')"></div>' +
          '<div class="heroe-copy">' +
          '<span class="chip heroe-chip">' + esc(t(s.chip)) + "</span>" +
          "<h1>" + esc(t(s.title)) + "</h1>" +
          "<p>" + esc(t(s.txt)) + "</p>" +
          '<div class="botones"><a class="' + s.ctaClass + '" href="' + s.href + '">' +
          (s.id === "espia" ? '<span class="boton-espia-ico" aria-hidden="true"></span>' : "") +
          "<span>" + esc(t(s.cta)) + "</span></a>" +
          (i === 0 ? '<a class="boton" href="nueva-build.html">' + esc(t("inicio.crear")) + "</a>" : "") +
          "</div></div></article>";
      }).join("") +
      '<div class="heroe-controles" role="group" aria-label="Carrusel">' +
      '<button type="button" class="heroe-prev" aria-label="' + esc(t("inicio.slide.prev")) + '">‹</button>' +
      '<div class="heroe-dots" role="tablist">' +
      SLIDES.map(function (s, i) {
        return '<button type="button" class="heroe-dot' + (i === 0 ? " on" : "") +
          '" role="tab" aria-label="' + esc(t(s.title)) + '" aria-current="' + (i === 0 ? "true" : "false") + '" data-i="' + i + '"></button>';
      }).join("") +
      "</div>" +
      '<button type="button" class="heroe-next" aria-label="' + esc(t("inicio.slide.next")) + '">›</button>' +
      "</div></div>" +
      '<p class="heroe-cred suave">' + esc(t("inicio.slide.creditos")) + "</p>" +
      '<div class="datos-heroe" id="datos-heroe"></div>';

    host.classList.add("heroe-carrusel");
    host.innerHTML = html;
    slides = Array.prototype.slice.call(host.querySelectorAll(".heroe-slide"));
    dots = Array.prototype.slice.call(host.querySelectorAll(".heroe-dot"));
    var controles = host.querySelector(".heroe-controles");

    host.querySelector(".heroe-prev").addEventListener("click", function () {
      ir(idx - 1);
      programar();
    });
    host.querySelector(".heroe-next").addEventListener("click", function () {
      ir(idx + 1);
      programar();
    });
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        ir(+d.dataset.i);
        programar();
      });
    });

    /* Pausa solo al usar flechas/puntos, no al leer el hero */
    controles.addEventListener("mouseenter", function () { pausar(true); });
    controles.addEventListener("mouseleave", function () { pausar(false); });
    controles.addEventListener("focusin", function () { pausar(true); });
    controles.addEventListener("focusout", function () {
      setTimeout(function () {
        if (!controles.contains(document.activeElement)) pausar(false);
      }, 0);
    });

    var startX = 0;
    host.querySelector(".heroe-viewport").addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
      pausar(true);
    }, { passive: true });
    host.querySelector(".heroe-viewport").addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1));
      pausar(false);
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) parar();
      else if (!paused) programar();
    });

    programar();
  }

  window.OC_HERO = { pintar: pintar, SLIDES: SLIDES };
})();
