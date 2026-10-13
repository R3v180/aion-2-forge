// Espía Builds: busca un personaje y abre su build del juego en solo lectura.
function chipRaza(raza) {
  if (raza === "elyos") return '<span class="chip raza elyos">' + esc(t("espia.elyos")) + "</span>";
  if (raza === "asmodian") return '<span class="chip raza asmodian">' + esc(t("espia.asmodian")) + "</span>";
  return "";
}

function paginaEspia() {
  var main = $("#main");
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
      '<form class="espia-form" id="espia-form">' +
      '<input id="espia-q" maxlength="24" required autocomplete="off" placeholder="' + esc(t("espia.placeholder")) + '">' +
      '<button class="boton oro" type="submit">' + esc(t("espia.buscar")) + "</button></form>" +
      '<p class="suave" id="espia-estado"></p>' +
      '<div class="espia-res" id="espia-res"></div>';
    $("#espia-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("#espia-q").value.trim(), estado = $("#espia-estado"), caja = $("#espia-res");
      if (!q) return;
      estado.textContent = t("juego.buscando");
      caja.innerHTML = "";
      api("GET", "/api/juego/buscar?q=" + encodeURIComponent(q)).then(function (lista) {
        estado.textContent = lista.length ? "" : t("espia.vacio");
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
          return '<a class="espia-card raza-' + esc(p.raza || "x") + '" href="build.html?cid=' + encodeURIComponent(p.character_id) +
            "&server=" + encodeURIComponent(p.server_id) + '">' +
            '<div class="espia-foto">' + foto + emb + "</div>" +
            '<div class="espia-txt">' +
            '<div class="espia-top"><b>' + esc(p.nombre) + "</b>" + chipRaza(p.raza) + "</div>" +
            '<div class="espia-server">' + esc(p.servidor || "—") + "</div>" +
            '<div class="espia-meta">' + meta.join(" · ") + "</div>" +
            '<em>' + esc(t("espia.ver")) + " →</em></div></a>";
        }).join("");
        caja.querySelectorAll(".espia-card").forEach(function (a) {
          a.addEventListener("click", function () {
            a.classList.add("abriendo");
            var em = a.querySelector("em");
            if (em) em.textContent = t("espia.abriendo");
          });
        });
      }).catch(function (er) { estado.textContent = textoError(er); });
    });
    var pre = param("q");
    if (pre) {
      $("#espia-q").value = pre;
      $("#espia-form").dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });
}
