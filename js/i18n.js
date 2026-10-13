// Textos de la interfaz en español e inglés. Clave -> { es, en }
var TEXTOS = {
  "nav.inicio": { es: "Inicio", en: "Home" },
  "nav.clases": { es: "Clases", en: "Classes" },
  "nav.builds": { es: "Builds", en: "Builds" },
  "nav.guias": { es: "Guías", en: "Guides" },
  "nav.mis": { es: "Mis builds", en: "My builds" },
  "nav.entrar": { es: "Entrar", en: "Sign in" },
  "nav.salir": { es: "Salir", en: "Sign out" },
  "nav.menu": { es: "Menú", en: "Menu" },
  "nav.gremio": { es: "Gremio", en: "Guild" },
  "pest.habilidades": { es: "Habilidades", en: "Skills" },
  "pest.barra": { es: "Barra y macro", en: "Hotbar & macro" },
  "build.abrir_principal": { es: "Copiar o editar en la web del gremio", en: "Copy or edit on the guild site" },
  "pest.daevanion": { es: "Daevanion", en: "Daevanion" },
  "comun.cargando": { es: "Cargando…", en: "Loading…" },
  "dae.niveles": { es: "nv.", en: "lv." },
  "dae.inicio": { es: "Inicio del tablero", en: "Board start" },
  "dae.coste": { es: "Coste", en: "Cost" },
  "dae.nivel": { es: "Nv.", en: "Lv." },
  "dae.desde_nivel": { es: "desde nivel", en: "from level" },
  "dae.g_inicio": { es: "Inicio", en: "Start" },
  "dae.g_comun": { es: "Común", en: "Common" },
  "dae.g_raro": { es: "Raro", en: "Rare" },
  "dae.g_leyenda": { es: "Legendario", en: "Legendary" },
  "dae.g_unico": { es: "Único", en: "Unique" },
  "dae.puntos": { es: "Puntos gastados", en: "Points spent" },
  "dae.p_cristal": { es: "Cristales de Daevanion", en: "Daevanion crystals" },
  "dae.p_batalla": { es: "Cristales de batalla", en: "Battle crystals" },
  "dae.estadisticas": { es: "Estadísticas totales", en: "Total stats" },
  "dae.habilidades": { es: "Niveles de habilidad extra", en: "Bonus skill levels" },
  "dae.nada": { es: "Aún no hay nodos activados.", en: "No nodes activated yet." },
  "dae.plantilla": { es: "Cargar plantilla de la clase", en: "Load class template" },
  "dae.plantilla_conf": { es: "Esto sustituye tus presets de Daevanion por los de la build de referencia. ¿Seguir?", en: "This replaces your Daevanion presets with the reference build's. Continue?" },
  "dae.sin_presets": { es: "Esta build no tiene Daevanion.", en: "This build has no Daevanion." },
  "dae.sin_datos": { es: "El Daevanion de esta clase aún no está disponible.", en: "This class's Daevanion isn't available yet." },
  "dae.empieza": { es: "Crea un preset o carga la plantilla de tu clase para empezar.", en: "Create a preset or load your class template to start." },
  "dae.llenar": { es: "Completar tablero", en: "Fill board" },
  "dae.vaciar": { es: "Vaciar tablero", en: "Clear board" },
  "dae.no_enlaza": { es: "Ese nodo no enlaza con ninguno activo.", en: "That node isn't linked to an active one." },
  "dae.ayuda_ver": { es: "Pasa el ratón por un nodo para ver su efecto. Los tableros se desbloquean por nivel; Azphel usa cristales de batalla.", en: "Hover a node to see its effect. Boards unlock by level; Azphel uses battle crystals." },
  "dae.ayuda_editar": { es: "Clic en un nodo enlazado (brillante) para activarlo; clic en uno activo para quitarlo junto con los que dependan de él.", en: "Click a linked (glowing) node to activate it; click an active one to remove it along with the nodes that depend on it." },
  "barra.titulo_barra": { es: "Barra de habilidades", en: "Skill hotbar" },
  "barra.titulo_macro": { es: "Macro", en: "Macro" },
  "barra.vacia": { es: "Este preset aún no tiene barra.", en: "This preset has no hotbar yet." },
  "barra.sin_macro": { es: "Sin macro: todo se pulsa a mano.", en: "No macro: everything is pressed manually." },
  "barra.sin_presets": { es: "Esta build no tiene barra ni macro.", en: "This build has no hotbar or macro." },
  "barra.empieza": { es: "Crea un preset o carga la plantilla de tu clase para empezar.", en: "Create a preset or load your class template to start." },
  "barra.nota_prioridad": {
    es: "Cada tecla apila hasta 4 habilidades: la de abajo (fila 0) tiene más prioridad y el juego lanza la primera que no esté en enfriamiento.",
    en: "Each key stacks up to 4 skills: the bottom one (row 0) has top priority and the game fires the first one off cooldown."
  },
  "barra.uso_macro": { es: "Macro", en: "Macro" },
  "barra.uso_mano": { es: "A mano", en: "Manual" },
  "barra.uso_ambas": { es: "Macro y mano", en: "Macro & manual" },
  "barra.mantener": { es: "Mantén", en: "Hold" },
  "barra.bucle": { es: "Se repite mientras mantengas la tecla", en: "Repeats while you hold the key" },
  "barra.editar": { es: "Editar preset", en: "Edit preset" },
  "barra.nombre_preset": { es: "Nombre del preset", en: "Preset name" },
  "barra.quitar_preset": { es: "Borrar preset", en: "Delete preset" },
  "barra.quitar_preset_conf": { es: "¿Borrar este preset con su barra y su macro?", en: "Delete this preset with its hotbar and macro?" },
  "barra.nuevo_preset": { es: "Preset", en: "Preset" },
  "barra.preset": { es: "Preset", en: "Preset" },
  "barra.plantilla": { es: "Cargar plantilla de la clase", en: "Load class template" },
  "barra.plantilla_conf": { es: "Esto sustituye la barra y la macro de este preset. ¿Seguir?", en: "This replaces this preset's hotbar and macro. Continue?" },
  "barra.plantilla_ok": { es: "Plantilla cargada (build de referencia)", en: "Template loaded (reference build)" },
  "barra.tecla": { es: "Tecla", en: "Key" },
  "barra.nombre_linea": { es: "Nombre de la línea (opcional)", en: "Line name (optional)" },
  "barra.fila_0": { es: "Fila 0: máxima prioridad", en: "Row 0: top priority" },
  "barra.fila_n": { es: "Fila {n}", en: "Row {n}" },
  "barra.quitar": { es: "Quitar", en: "Remove" },
  "barra.nueva_linea": { es: "Añadir tecla", en: "Add key" },
  "barra.tecla_macro": { es: "Tecla de la macro", en: "Macro key" },
  "barra.nuevo_paso": { es: "Añadir paso", en: "Add step" },
  "barra.notas": { es: "Notas (cuándo pulsar cada cosa, cancelaciones…)", en: "Notes (when to press what, cancels…)" },
  "barra.buscar": { es: "Buscar habilidad…", en: "Search skill…" },
  "barra.vaciar": { es: "Vaciar hueco", en: "Clear slot" },
  "barra.como": { es: "Cómo se configura en el juego", en: "How to set it up in game" },
  "barra.paso1": { es: "Asigna la tecla de macro en Ajustes → Teclas → General → Juego → Macro (viene sin asignar).", en: "Bind the macro key in Settings → Key settings → General → Gameplay → Macro (unbound by default)." },
  "barra.paso2": { es: "En la barra, apila hasta 4 habilidades por tecla: abajo la más importante, arriba las de relleno sin enfriamiento.", en: "On the hotbar, stack up to 4 skills per key: the most important at the bottom, no-cooldown fillers on top." },
  "barra.paso3": { es: "Abre Habilidades (K) → Macro y añade teclas completas como pasos, con 10 ms de retraso (40-50 ms si tienes mucho ping).", en: "Open Skills (K) → Macro and add whole keys as steps, 10 ms delay each (40–50 ms on high ping)." },
  "barra.paso4": { es: "Cada uno de los 3 presets guarda sus niveles, estigmas y su macro (Alt + Num 4/5/6).", en: "Each of the 3 presets keeps its own levels, stigmas and macro (Alt + Num 4/5/6)." },
  "barra.paso5": { es: "Deja fuera de la macro los buffs, defensivas, desplazamientos y habilidades cargadas. Usa el modo de control AION 2.", en: "Keep buffs, defensives, dashes and charged skills out of the macro. Use the AION 2 control mode." },
  "barra.fuentes": { es: "Según las guías de", en: "Based on the guides from" },
  "legado.solo_es": { es: "", en: "This reference guide is only available in Spanish for now." },
  "legado.ref_titulo": { es: "Guía de referencia de la clase", en: "Class reference guide" },
  "legado.ver_clase": { es: "Todas las habilidades y builds de la clase", en: "All class skills and builds" },
  "legado.abrir_build": { es: "Abrir como build (copiar a mis builds)", en: "Open as a build (copy to my builds)" },
  "legado.volver_guias": { es: "← Todas las guías", en: "← All guides" },
  "legado.no_existe": { es: "No existe esa guía.", en: "That guide does not exist." },
  "legado.no_clase": { es: "No existe esa clase.", en: "That class does not exist." },

  "inicio.antetitulo": { es: "Gremio oficial · AION 2", en: "Official guild · AION 2" },
  "inicio.titulo": { es: "Builds, macros y guías de AION 2", en: "AION 2 builds, macros and guides" },
  "inicio.sub": {
    es: "La casa del gremio EspClown. Crea tus builds con los datos oficiales de cada habilidad, guárdalas en tu área privada y publica las que quieras compartir.",
    en: "Home of the EspClown guild. Create builds with official skill data, keep them in your private area and publish the ones you want to share."
  },
  "inicio.dato_clases": { es: "clases", en: "classes" },
  "inicio.dato_habilidades": { es: "habilidades", en: "skills" },
  "inicio.dato_builds": { es: "builds públicas", en: "public builds" },
  "inicio.dato_guias": { es: "guías", en: "guides" },
  "inicio.crear": { es: "Crear mi build", en: "Create my build" },
  "inicio.explorar": { es: "Explorar builds", en: "Browse builds" },
  "inicio.clases": { es: "Elige tu clase", en: "Pick your class" },
  "inicio.recientes": { es: "Builds publicadas recientemente", en: "Recently published builds" },
  "inicio.ver_todas": { es: "Ver todas", en: "See all" },
  "inicio.fuentes": { es: "Datos y recursos de", en: "Data and assets from" },

  "clase.habilidades": { es: "Habilidades", en: "Skills" },
  "clase.builds": { es: "Builds públicas de esta clase", en: "Public builds for this class" },
  "clase.guia_ref": { es: "Guía de referencia (barra, equipo y Daevanion)", en: "Reference guide (hotbar, gear and Daevanion)" },
  "clase.guia_ext": { es: "Guía en expcarry", en: "Guide on expcarry" },
  "clase.nivel_vista": { es: "Ver valores a nivel", en: "Show values at level" },
  "clase.crear": { es: "Crear build de", en: "Create build for" },

  "tipo.activa": { es: "Activas", en: "Actives" },
  "tipo.estigma": { es: "Estigmas", en: "Stigmas" },
  "tipo.pasiva": { es: "Pasivas", en: "Passives" },
  "tipo1.activa": { es: "Activa", en: "Active" },
  "tipo1.estigma": { es: "Estigma", en: "Stigma" },
  "tipo1.pasiva": { es: "Pasiva", en: "Passive" },

  "modo.pve": { es: "JcE", en: "PvE" },
  "modo.pvp": { es: "JcJ", en: "PvP" },
  "modo.farm": { es: "Farmeo", en: "Farming" },
  "modo.otro": { es: "Otro", en: "Other" },
  "modo.todos": { es: "Todos los modos", en: "All modes" },
  "clase.todas": { es: "Todas las clases", en: "All classes" },

  "builds.titulo": { es: "Builds de la comunidad", en: "Community builds" },
  "builds.buscar": { es: "Buscar por nombre o autor…", en: "Search by name or author…" },
  "builds.vacio": { es: "Todavía no hay builds públicas con estos filtros.", en: "No public builds match these filters yet." },
  "builds.por": { es: "por", en: "by" },
  "builds.actualizada": { es: "Actualizada", en: "Updated" },
  "builds.referencia": { es: "Referencia", en: "Reference" },

  "build.nivel": { es: "Nv.", en: "Lv." },
  "build.sin_aprender": { es: "Sin aprender", en: "Not learned" },
  "build.esp": { es: "Especializaciones", en: "Specialties" },
  "build.propiedades": { es: "Propiedades", en: "Properties" },
  "build.huecos": { es: "huecos", en: "slots" },
  "build.puntos_hab": { es: "Puntos de habilidad", en: "Skill points" },
  "build.puntos_est": { es: "Puntos de estigma", en: "Stigma points" },
  "build.editar": { es: "Editar", en: "Edit" },
  "build.ver": { es: "Ver", en: "View" },
  "build.guardar": { es: "Guardar", en: "Save" },
  "build.guardado": { es: "Guardado", en: "Saved" },
  "build.cambios": { es: "Cambios sin guardar", en: "Unsaved changes" },
  "build.copiar": { es: "Copiar a mis builds", en: "Copy to my builds" },
  "build.compartir": { es: "Copiar enlace", en: "Copy link" },
  "build.enlace_copiado": { es: "Enlace copiado", en: "Link copied" },
  "build.publica": { es: "Pública", en: "Public" },
  "build.privada": { es: "Privada", en: "Private" },
  "build.nombre": { es: "Nombre de la build", en: "Build name" },
  "build.modo": { es: "Modo", en: "Mode" },
  "build.descripcion": { es: "Descripción y notas", en: "Description and notes" },
  "build.videos": { es: "Vídeos", en: "Videos" },
  "build.videos_ayuda": { es: "Enlaces de YouTube, uno por línea (máx. 6).", en: "YouTube links, one per line (max 6)." },
  "build.nivel_pj": { es: "Nivel del personaje", en: "Character level" },
  "build.fuente": { es: "Fuente", en: "Source" },
  "build.borrar": { es: "Borrar", en: "Delete" },
  "build.borrar_conf": { es: "¿Borrar esta build? No se puede deshacer.", en: "Delete this build? This cannot be undone." },
  "build.no_existe": { es: "Esta build no existe o es privada.", en: "This build does not exist or is private." },
  "build.mostrar_todas": { es: "Mostrar también las no aprendidas", en: "Also show skills not learned" },
  "build.auto": { es: "Se desbloquean solas al subir de nivel", en: "Unlock automatically when levelling" },

  "mis.titulo": { es: "Mis builds", en: "My builds" },
  "mis.nueva": { es: "Nueva build", en: "New build" },
  "mis.crear": { es: "Crear", en: "Create" },
  "mis.vacio": { es: "Aún no tienes builds. Crea la primera.", en: "You have no builds yet. Create your first one." },
  "mis.cuenta": { es: "Mi cuenta", en: "My account" },
  "mis.cambiar_clave": { es: "Cambiar contraseña", en: "Change password" },
  "mis.clave_actual": { es: "Contraseña actual", en: "Current password" },
  "mis.clave_nueva": { es: "Contraseña nueva (mín. 8)", en: "New password (min. 8)" },
  "mis.clave_ok": { es: "Contraseña cambiada", en: "Password changed" },

  "auth.entrar": { es: "Entrar", en: "Sign in" },
  "auth.registro": { es: "Crear cuenta", en: "Create account" },
  "auth.usuario": { es: "Usuario", en: "Username" },
  "auth.clave": { es: "Contraseña", en: "Password" },
  "auth.ayuda_usuario": { es: "3-24 caracteres: letras, números, punto, guion o guion bajo.", en: "3-24 characters: letters, numbers, dot, dash or underscore." },

  "err.credenciales": { es: "Usuario o contraseña incorrectos.", en: "Wrong username or password." },
  "err.usuario_invalido": { es: "Nombre de usuario no válido.", en: "Invalid username." },
  "err.usuario_existe": { es: "Ese usuario ya existe.", en: "That username is taken." },
  "err.clave_corta": { es: "La contraseña debe tener al menos 8 caracteres.", en: "Password must be at least 8 characters." },
  "err.demasiados_intentos": { es: "Demasiados intentos. Espera unos minutos.", en: "Too many attempts. Wait a few minutes." },
  "err.nombre_vacio": { es: "Ponle un nombre a la build.", en: "Give the build a name." },
  "err.no_autenticado": { es: "Tienes que entrar con tu cuenta.", en: "You need to sign in." },
  "err.generico": { es: "Algo ha fallado. Inténtalo de nuevo.", en: "Something went wrong. Try again." },

  "pie.aviso": {
    es: "Gremio EspClown · Web de fans, sin relación con NCSOFT. AION 2 y sus imágenes son de NCSOFT.",
    en: "EspClown guild · Fan site, not affiliated with NCSOFT. AION 2 and its images belong to NCSOFT."
  }
};

var CLASES_INFO = [
  { id: "gladiator", es: "Gladiador", en: "Gladiator", rol: { es: "DPS cuerpo a cuerpo", en: "Melee DPS" } },
  { id: "templar", es: "Templario", en: "Templar", rol: { es: "Tanque", en: "Tank" } },
  { id: "assassin", es: "Sicario", en: "Assassin", rol: { es: "DPS cuerpo a cuerpo (burst)", en: "Melee burst DPS" } },
  { id: "ranger", es: "Ranger", en: "Ranger", rol: { es: "DPS a distancia", en: "Ranged DPS" } },
  { id: "sorcerer", es: "Hechicero", en: "Sorcerer", rol: { es: "DPS mágico", en: "Magic DPS" } },
  { id: "spiritmaster", es: "Espiritualista", en: "Spiritmaster", rol: { es: "DPS invocador", en: "Summoner DPS" } },
  { id: "cleric", es: "Clérigo", en: "Cleric", rol: { es: "Sanador", en: "Healer" } },
  { id: "chanter", es: "Cantor", en: "Chanter", rol: { es: "Apoyo / ataque", en: "Support / damage" } }
];

var IDIOMA = (function () {
  var guardado = localStorage.getItem("idioma");
  if (guardado === "es" || guardado === "en") return guardado;
  return (navigator.language || "es").slice(0, 2) === "es" ? "es" : "en";
})();
document.documentElement.lang = IDIOMA;

function t(clave) {
  var x = TEXTOS[clave];
  return x ? x[IDIOMA] || x.es : clave;
}
function tr(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[IDIOMA] || obj.es || obj.en || "";
}
function cambiarIdioma(l) {
  localStorage.setItem("idioma", l);
  location.reload();
}
function traducirPagina(raiz) {
  (raiz || document).querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.dataset.t); });
  (raiz || document).querySelectorAll("[data-t-ph]").forEach(function (el) { el.placeholder = t(el.dataset.tPh); });
}
function claseInfo(id) {
  return CLASES_INFO.filter(function (c) { return c.id === id; })[0] || { id: id, es: id, en: id, rol: {} };
}
