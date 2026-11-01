/* Marquesina del hero: legion primero, luego tools. Rota ~5s; pausa al usar controles.
   Fotos en <img> con srcset (mismo patrón que el HTML estático del primer slide).
   El resto no pide la imagen hasta que el slide se va a ver. */
(function () {
  var INTERVAL = 5000;
  var slides = [];
  var dots = [];
  var idx = 0;
  var timer = null;
  var paused = false;

  var HERO_SIZES = "(max-width: 1220px) calc(100vw - 28px), 1100px";
  function urlHero(id, w) {
    return "https://res.cloudinary.com/dpp6gyfao/image/upload/f_auto,q_auto,w_" + w + ",c_limit/" + id;
  }
  function srcsetHero(id) {
    return [480, 720, 960, 1200].map(function (w) { return urlHero(id, w) + " " + w + "w"; }).join(", ");
  }
  var SLIDES = [
    {
      id: "forge",
      img: (typeof IDIOMA !== "undefined" && IDIOMA === "en" ? "aion2/hero-en" : "aion2/hero-es"),
      modo: "banner",
      href: "foro.html",
      chip: "inicio.slide.legion_chip",
      title: "inicio.titulo",
      txt: "inicio.sub",
      cta: "inicio.cta_comunidad",
      ctaClass: "boton oro"
    },
    {
      id: "espia",
      img: "aion2/oc-arquero",
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
      img: "aion2/ss_05",
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
      img: "aion2/ss_08",
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
      img: "aion2/ss_09",
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
      img: "aion2/ss_01",
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
      img: "aion2/library_hero",
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
      var activo = i === idx;
      el.classList.toggle("on", activo);
      el.setAttribute("aria-hidden", activo ? "false" : "true");
      // inert hace que los links/botones de slides ocultos no sean focusables
      if (activo) { el.removeAttribute("inert"); } else { el.setAttribute("inert", ""); }
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("on", i === idx);
      d.setAttribute("aria-current", i === idx ? "true" : "false");
    });
    var host = slides[0] && slides[0].closest(".heroe-carrusel");
    if (host) host.classList.toggle("en-banner", !!(slides[idx] && slides[idx].dataset.id === "forge"));
    cargarFoto(slides[idx]);
  }

  function cargarFoto(el) {
    if (!el) return;
    var media = el.querySelector(".heroe-media");
    if (!media || media.getAttribute("src")) return;
    var id = media.getAttribute("data-foto");
    if (!id) return;
    media.sizes = HERO_SIZES;
    media.srcset = srcsetHero(id);
    media.decoding = "async";
    if (!media.getAttribute("fetchpriority")) media.setAttribute("fetchpriority", "low");
    media.src = urlHero(id, 720);
  }

  function siguiente() { ir(idx + 1); }

  function parar() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  /* El primer pase es largo: si la foto grande cambia a los 5 s, Lighthouse
     la cuenta como LCP (el elemento anterior deja de verse). Luego, cada 5 s. */
  var autoplayInicial = true;
  function programar() {
    parar();
    if (paused) return;
    if (typeof document !== "undefined" && document.hidden) return;
    var espera = autoplayInicial ? 15000 : INTERVAL;
    autoplayInicial = false;
    timer = setTimeout(function () {
      if (!paused) {
        siguiente();
        programar();
      }
    }, espera);
  }

  function pausar(si) {
    paused = !!si;
    if (paused) parar();
    else programar();
  }

  function slideHtml(s, i) {
        var chips = '<span class="chip heroe-chip">' + esc(t(s.chip)) + "</span>";
        var botones = '<a class="' + s.ctaClass + '" href="' + s.href + '">' +
          (s.id === "espia" ? '<span class="boton-espia-ico" aria-hidden="true"></span>' : "") +
          "<span>" + esc(t(s.cta)) + "</span></a>";
        if (s.id === "forge") {
          botones += '<a class="boton" id="cta-discord" hidden target="_blank" rel="noopener">' + esc(t("inicio.cta_discord")) + "</a>" +
            '<a class="enlace" href="#herramientas">' + esc(t("inicio.cta_herramientas")) + "</a>";
        } else if (s.id === "espia") {
          botones += '<a class="boton" href="nueva-build.html">' + esc(t("inicio.crear")) + "</a>";
        }
        var copy = s.modo === "banner"
          ? '<div class="heroe-copy solo-cta"><div class="botones">' + botones + "</div></div>"
          : '<div class="heroe-copy">' + chips +
            "<h1>" + esc(t(s.title)) + "</h1>" +
            "<p>" + esc(t(s.txt)) + "</p>" +
            '<div class="botones">' + botones + "</div></div>";
        var foto = i === 0
          ? '<img class="heroe-media" alt="" width="720" height="405" data-foto="' + s.img + '" src="' + urlHero(s.img, 720) + '" srcset="' + srcsetHero(s.img) + '" sizes="' + HERO_SIZES + '" fetchpriority="high" decoding="async">'
          : '<img class="heroe-media" alt="" width="720" height="405" data-foto="' + s.img + '">';
        return '<article class="heroe-slide modo-' + s.modo + (i === 0 ? " on" : "") +
          '" data-id="' + s.id + '" aria-hidden="' + (i === 0 ? "false" : "true") + '"' + (i === 0 ? "" : " inert") + '>' +
          foto +
          copy + "</article>";
  }
  function controlesHtml() {
    return '<div class="heroe-controles" role="group" aria-label="Carrusel">' +
      '<button type="button" class="heroe-prev" aria-label="' + esc(t("inicio.slide.prev")) + '">&#8249;</button>' +
      '<div class="heroe-dots" role="tablist">' +
      SLIDES.map(function (s, i) {
        return '<button type="button" class="heroe-dot' + (i === 0 ? " on" : "") +
          '" role="tab" aria-label="' + esc(t(s.title)) + '" aria-current="' + (i === 0 ? "true" : "false") + '" data-i="' + i + '"></button>';
      }).join("") +
      "</div>" +
      '<button type="button" class="heroe-next" aria-label="' + esc(t("inicio.slide.next")) + '">&#8250;</button></div>';
  }

  function pintar(host) {
    if (!host) return;
    host.classList.add("heroe-carrusel");
    var vp = host.querySelector(".heroe-viewport");
    /* La home ya pinta el primer slide (LCP) y los datos. No se reescribe:
       sustituir el HTML movía los botones y subía el CLS. */
    if (vp && host.querySelector(".heroe-slide")) {
      SLIDES.forEach(function (s, i) {
        if (i === 0 || host.querySelector('.heroe-slide[data-id="' + s.id + '"]')) return;
        vp.insertAdjacentHTML("beforeend", slideHtml(s, i));
      });
      if (!host.querySelector(".heroe-controles")) vp.insertAdjacentHTML("beforeend", controlesHtml());
      if (!host.querySelector("#datos-heroe")) host.insertAdjacentHTML("beforeend", '<div class="datos-heroe" id="datos-heroe"></div>');
    } else {
      host.innerHTML = '<div class="heroe-marca">' +
        '<img class="emblema-grande" src="img/aion-2-forge-emblema.svg" alt="Aion 2 Forge">' +
        '<div><span class="antetitulo">' + esc(t("inicio.antetitulo")) + "</span>" +
        '<div class="nombre-gremio">Aion 2 <span>Forge</span></div></div></div>' +
        '<div class="heroe-viewport">' + SLIDES.map(slideHtml).join("") + controlesHtml() +
        '</div><div class="datos-heroe" id="datos-heroe"></div>';
    }
    if (host.querySelector('.heroe-slide.on[data-id="forge"]')) host.classList.add("en-banner");
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
