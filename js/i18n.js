// Textos de la interfaz en español e inglés. Clave -> { es, en }
var TEXTOS = {
  "nav.inicio": { es: "Inicio", en: "Home" },
  "nav.juego": { es: "Juego", en: "Game" },
  "nav.progresion": { es: "Progresión", en: "Progression" },
  "nav.utiles": { es: "Utilidades", en: "Utilities" },
  "nav.comunidad": { es: "Comunidad", en: "Community" },
  "nav.espia_grupo": { es: "Espía", en: "Spy" },
  "nav.clases": { es: "Clases", en: "Classes" },
  "nav.builds": { es: "Builds", en: "Builds" },
  "nav.espia": { es: "Espía Builds", en: "Spy Builds" },
  "nav.tops": { es: "Tops", en: "Tops" },
  "nav.mapa": { es: "Mapa", en: "Map" },
  "nav.timers": { es: "Timers", en: "Timers" },
  "nav.herramientas": { es: "Herramientas", en: "Tools" },
  "nav.guias": { es: "Guías", en: "Guides" },
  "nav.hint.espia": { es: "Build real de cualquier PJ", en: "Anyone's real build" },
  "nav.hint.tops": { es: "Ranking de poder e iLvl", en: "Power and iLvl ranking" },
  "nav.hint.clases": { es: "Habilidades y builds por clase", en: "Skills and builds by class" },
  "nav.hint.builds": { es: "Builds de la legión", en: "Legion community builds" },
  "nav.hint.guias": { es: "Progresión sin inventar datos", en: "Progression, no invented data" },
  "nav.hint.mapa": { es: "Rubí, odyle y recolección", en: "Ruby, odyle and gathering" },
  "nav.hint.timers": { es: "Grieta, jefes, Shugo, reset", en: "Rift, bosses, Shugo, reset" },
  "nav.hint.herramientas": { es: "Mejora, craft, pity, Arcana…", en: "Enhance, craft, pity, Arcana…" },
  "nav.hint.foro": { es: "Temas de la legión", en: "Legion threads" },
  "nav.hint.chat": { es: "Chat en vivo", en: "Live chat" },
  "ht.antetitulo": { es: "AION 2 · herramientas", en: "AION 2 · tools" },
  "ht.volver": { es: "← Todas las herramientas", en: "← All tools" },
  "ht.fuentes": { es: "Fuentes:", en: "Sources:" },
  "ht.ver_guia": { es: "Ver guía relacionada →", en: "Related guide →" },
  "ht.no_existe": { es: "Esa herramienta no existe.", en: "That tool does not exist." },
  "ht.sin_datos": { es: "Sin datos para este filtro.", en: "No data for this filter." },
  "ht.hub_title": { es: "Herramientas AION 2", en: "AION 2 tools" },
  "ht.hub_desc": {
    es: "Calculadoras AION 2: mejora con pity, craft, manastones, pity de mazmorra, Amplify, Pantheon y Arcana. Legión Orden Celeste.",
    en: "AION 2 calculators: enhancement with pity, craft, manastones, dungeon pity, Amplify, Pantheon and Arcana. Orden Celeste legion."
  },
  "ht.hub_titulo": { es: "Herramientas", en: "Tools" },
  "ht.hub_sub": {
    es: "Calculadoras para planificar en el móvil: tasas citadas del cliente/comunidad y de nuestras guías. Nada inventado.",
    en: "Mobile planning calculators: cited client/community rates and our guides. Nothing invented."
  },
  "ht.hub_nota": {
    es: "NC no publica todas las tablas. Donde usamos extracción de cliente (EnchantCost) lo marcamos. Los costes de Kina escalan con iLvl.",
    en: "NC does not publish every table. Client extracts (EnchantCost) are labelled. Kinah costs scale with item level."
  },
  "ht.mejora.titulo": { es: "Calculadora de mejora", en: "Enhancement calculator" },
  "ht.mejora.card": { es: "Intentos medios, pity y coste estimado a +15", en: "Average tries, pity and estimated cost to +15" },
  "ht.mejora.sub": {
    es: "Elige grado, rango y preset de coste. +0–+10 seguro; +11–+15 con pity +5 % por fallo.",
    en: "Pick grade, range and cost preset. +0–+10 safe; +11–+15 with +5% pity per fail."
  },
  "ht.mejora.desc": {
    es: "Calculadora de Enhancement AION 2: tasas Unique +11–+15 (65/50/35/25/20) con pity, intentos medios y Kina/piedras estimadas.",
    en: "AION 2 Enhancement calculator: Unique +11–+15 rates (65/50/35/25/20) with pity, average tries and estimated Kinah/stones."
  },
  "ht.mejora.kw": { es: "AION 2 enhancement, calculadora mejora, pity, Enhance Stone", en: "AION 2 enhancement calculator, pity, Enhance Stone" },
  "ht.mejora.grado": { es: "Grado", en: "Grade" },
  "ht.mejora.desde": { es: "Desde +", en: "From +" },
  "ht.mejora.hasta": { es: "Hasta +", en: "To +" },
  "ht.mejora.coste": { es: "Coste (referencia)", en: "Cost (reference)" },
  "ht.mejora.sin_coste": { es: "Solo intentos (sin Kina)", en: "Tries only (no Kinah)" },
  "ht.mejora.rango_malo": { es: "El destino debe ser mayor que el inicio.", en: "Target must be higher than start." },
  "ht.mejora.sin_dato": { es: "Sin curva publicada para este paso.", en: "No published curve for this step." },
  "ht.mejora.intentos": { es: "Intentos esperados", en: "Expected tries" },
  "ht.mejora.seguros": { es: "Pasos seguros", en: "Safe steps" },
  "ht.mejora.coste_nota": {
    es: "Costes escalados desde iLvl 102 Unique (MetaBot/Aion2Data). Tu pieza puede diferir; mira el tooltip en juego.",
    en: "Costs scaled from iLvl 102 Unique (MetaBot/Aion2Data). Your piece may differ; check the in-game tooltip."
  },
  "ht.craft.titulo": { es: "Estimador de craft", en: "Craft estimator" },
  "ht.craft.card": { es: "Profesión por clase y materiales según tasa de éxito", en: "Profession by class and mats from success rate" },
  "ht.craft.sub": {
    es: "Sin dump completo de recetas: estima intentos/mats con tu % (o muestras KR) y elige profesión.",
    en: "No full recipe dump: estimate tries/mats with your % (or KR samples) and pick a profession."
  },
  "ht.craft.desc": {
    es: "Estimador de fabricación AION 2: profesiones, clases y materiales esperados según tasa de éxito (muestras Corea).",
    en: "AION 2 crafting estimator: professions, classes and expected materials from success rate (KR samples)."
  },
  "ht.craft.kw": { es: "AION 2 craft, fabricación, blacksmithing, alchemy", en: "AION 2 craft, blacksmithing, alchemy" },
  "ht.craft.prof": { es: "Profesión", en: "Profession" },
  "ht.craft.exito": { es: "Éxito %", en: "Success %" },
  "ht.craft.mats": { es: "Mats por intento", en: "Mats per try" },
  "ht.craft.deseados": { es: "Éxitos deseados", en: "Desired successes" },
  "ht.craft.muestras": { es: "Muestras Corea (toca para usar)", en: "KR samples (tap to use)" },
  "ht.craft.nivel": { es: "Nivel craft", en: "Craft level" },
  "ht.craft.clases": { es: "Clases (consenso KR)", en: "Classes (KR consensus)" },
  "ht.craft.intentos_esp": { es: "Intentos esperados", en: "Expected tries" },
  "ht.craft.mats_esp": { es: "Mats esperados", en: "Expected mats" },
  "ht.craft.p95": { es: "Mats ~p95 (1 éxito)", en: "Mats ~p95 (1 success)" },
  "ht.craft.nota_calc": {
    es: "Geométrica simple (sin combo). Si tu receta usa combo, el éxito efectivo es menor: multiplica mats.",
    en: "Simple geometric (no combo). If your recipe uses combo, effective success is lower: multiply mats."
  },
  "ht.odds.titulo": { es: "Manastone, Soul Binding y Sync", en: "Manastone, Soul Binding & Sync" },
  "ht.odds.card": { es: "Valores de piedras, prioridades de binding y Theostones", en: "Stone values, binding priorities and Theostones" },
  "ht.odds.sub": {
    es: "Orden de la capa horizontal, valores de Manastone del dump, prioridades KR y lista de Theostones.",
    en: "Horizontal layer order, Manastone dump values, KR priorities and Theostone list."
  },
  "ht.odds.desc": {
    es: "Manastones AION 2 por estadística y grado, prioridades de Soul Binding/Sync (Corea) y catálogo de Theostones.",
    en: "AION 2 Manastones by stat and grade, Soul Binding/Sync priorities (KR) and Theostone catalogue."
  },
  "ht.odds.kw": { es: "AION 2 manastone, soul binding, theostone, sync", en: "AION 2 manastone, soul binding, theostone, sync" },
  "ht.odds.orden": { es: "Orden recomendado", en: "Recommended order" },
  "ht.odds.mana": { es: "Valores Manastone", en: "Manastone values" },
  "ht.odds.stat": { es: "Estadística", en: "Stat" },
  "ht.odds.soul": { es: "Soul Binding (adopción KR)", en: "Soul Binding (KR uptake)" },
  "ht.odds.sync": { es: "Sync esenciales (PvE KR)", en: "Sync essentials (KR PvE)" },
  "ht.odds.theo": { es: "Theostones", en: "Theostones" },
  "ht.odds.buscar": { es: "Buscar Theostone…", en: "Search Theostone…" },
  "ht.drops.titulo": { es: "Pity y farms de mazmorra", en: "Dungeon pity & farms" },
  "ht.drops.card": { es: "Contador de pity, Odyle y dónde farmear", en: "Pity counter, Odyle and where to farm" },
  "ht.drops.sub": {
    es: "Calcula clears que te faltan para la garantía. Sin % de drop inventados: farms citados de guías.",
    en: "Compute clears left to pity. No invented drop %: farms cited from guides."
  },
  "ht.drops.desc": {
    es: "Pity de cubo AION 2 (14/21/28 clears), reglas Odyle Energy y farms de Enhance Stones, Arcana y Theostones.",
    en: "AION 2 cube pity (14/21/28 clears), Odyle Energy rules and farms for Enhance Stones, Arcana and Theostones."
  },
  "ht.drops.kw": { es: "AION 2 pity, odyle, dungeon loot, enhance stones", en: "AION 2 pity, odyle, dungeon loot, enhance stones" },
  "ht.drops.pity": { es: "Contador de pity", en: "Pity counter" },
  "ht.drops.tier": { es: "Nivel de mazmorra", en: "Dungeon tier" },
  "ht.drops.nivel": { es: "Nivel", en: "Tier" },
  "ht.drops.clears": { es: "Clears hechos", en: "Clears done" },
  "ht.drops.garantia": { es: "Clears para garantía", en: "Clears to pity" },
  "ht.drops.faltan": { es: "Faltan", en: "Left" },
  "ht.drops.progreso": { es: "Progreso", en: "Progress" },
  "ht.drops.reglas": { es: "Reglas del botín", en: "Loot rules" },
  "ht.drops.farms": { es: "Dónde farmear (sin % inventados)", en: "Where to farm (no invented %)" },
  "ht.drops.mapa": { es: "Abrir mapa de recolección", en: "Open gathering map" },
  "ht.drops.pity_nota": {
    es: "Pity KR citado; no incluye armas. Céntrate en 1–2 mazmorras.",
    en: "Cited KR pity; weapons excluded. Focus on 1–2 dungeons."
  },
  "ht.potential.titulo": { es: "Amplify, Potential y Transfer", en: "Amplify, Potential & Transfer" },
  "ht.potential.card": { es: "◆ Amplify con pity, Potential PvP y reglas Transfer", en: "◆ Amplify with pity, PvP Potential and Transfer rules" },
  "ht.potential.sub": {
    es: "Curva Amplify del cliente, Potential seguro (+0,5 % PvP × 4) y checklist Transfer.",
    en: "Client Amplify curve, safe Potential (+0.5% PvP × 4) and Transfer checklist."
  },
  "ht.potential.desc": {
    es: "Calculadora Amplify AION 2 (66–20 % con pity), Potential PvP y qué mueve Transfer.",
    en: "AION 2 Amplify calculator (66–20% with pity), PvP Potential and what Transfer moves."
  },
  "ht.potential.kw": { es: "AION 2 amplify, potential, transfer", en: "AION 2 amplify, potential, transfer" },
  "ht.potential.amp": { es: "Amplify (◆)", en: "Amplify (◆)" },
  "ht.potential.pot": { es: "Potential", en: "Potential" },
  "ht.potential.nivel": { es: "Nivel Potential (0–4)", en: "Potential level (0–4)" },
  "ht.potential.bonus": { es: "Bonus PvP", en: "PvP bonus" },
  "ht.potential.max": { es: "Máximo (4)", en: "Max (4)" },
  "ht.potential.transfer": { es: "Transfer (recordatorio)", en: "Transfer (reminder)" },
  "ht.potential.t1": {
    es: "Mueve Enhancement, Amplify y Soul Binding a una pieza de mejor grado.",
    en: "Moves Enhancement, Amplify and Soul Binding to a higher-grade piece."
  },
  "ht.potential.t2": {
    es: "Gasta Transfer Stones y un uso limitado por temporada.",
    en: "Spends Transfer Stones and a season-limited use."
  },
  "ht.potential.t3": {
    es: "Mira engarces del destino antes: 4 sockets ganan a 2 aunque la base sea peor.",
    en: "Check destination sockets first: 4 sockets beat 2 even if the base looks worse."
  },
  "ht.potential.t4": {
    es: "No Transfer a un arma que luego no puedas Sync.",
    en: "Don't Transfer onto a weapon you cannot Sync later."
  },
  "ht.stats.titulo": { es: "Planificador de stats", en: "Stats planner" },
  "ht.stats.card": { es: "Capas de poder, foco por rol y suma de Manastones", en: "Power layers, role focus and Manastone totals" },
  "ht.stats.sub": {
    es: "Sin softcaps oficiales publicados: capas del personaje, foco por rol y suma de hasta 8 Manastones.",
    en: "No official softcaps published: character layers, role focus and up to 8 Manastone totals."
  },
  "ht.stats.desc": {
    es: "Planificador de stats AION 2: capas (equipo, piedras, binding, pantheon, arcana) y suma de Manastones por engarce.",
    en: "AION 2 stats planner: layers (gear, stones, binding, pantheon, arcana) and per-socket Manastone totals."
  },
  "ht.stats.kw": { es: "AION 2 stats, manastone planner, softcap", en: "AION 2 stats, manastone planner, softcap" },
  "ht.stats.capas": { es: "Capas de poder", en: "Power layers" },
  "ht.stats.roles": { es: "Foco por rol", en: "Role focus" },
  "ht.stats.plan_mana": { es: "Suma de Manastones", en: "Manastone sum" },
  "ht.stats.plan_sub": { es: "Elige hasta 8 engarces y grado; sumamos los valores del dump.", en: "Pick up to 8 sockets and grade; we sum dump values." },
  "ht.stats.hueco": { es: "Engarce", en: "Socket" },
  "ht.stats.vacio": { es: "Elige al menos un engarce con estadística.", en: "Pick at least one socket with a stat." },
  "ht.pantheon.titulo": { es: "Planificador Pantheon", en: "Pantheon planner" },
  "ht.pantheon.card": { es: "Huecos, dioses por rol y puntos por grado", en: "Slots, gods by role and points by grade" },
  "ht.pantheon.sub": {
    es: "17 huecos, qué dios buscar según rol, y puntos = líneas × valor × cantidad.",
    en: "17 slots, which god to chase by role, and points = lines × value × count."
  },
  "ht.pantheon.desc": {
    es: "Pantheon AION 2: coloso/estatuas/cuadros, dioses por rol y calculadora de puntos por grado de decoración.",
    en: "AION 2 Pantheon: colossus/statues/paintings, gods by role and decoration-grade point calculator."
  },
  "ht.pantheon.kw": { es: "AION 2 pantheon, housing stats, colossus", en: "AION 2 pantheon, housing stats, colossus" },
  "ht.pantheon.huecos": { es: "Huecos", en: "Slots" },
  "ht.pantheon.roles": { es: "Dioses y roles", en: "Gods and roles" },
  "ht.pantheon.plan": { es: "Puntos por decoraciones", en: "Points from decorations" },
  "ht.pantheon.cuadro": { es: "Cuadro", en: "Painting" },
  "ht.pantheon.estatua": { es: "Estatua", en: "Statue" },
  "ht.pantheon.coloso": { es: "Coloso", en: "Colossus" },
  "ht.pantheon.cantidad": { es: "Cantidad", en: "Count" },
  "ht.pantheon.lineas": { es: "Líneas totales", en: "Total lines" },
  "ht.pantheon.pts_pieza": { es: "Puntos / pieza", en: "Points / piece" },
  "ht.pantheon.pts_total": { es: "Puntos totales", en: "Total points" },
  "ht.pantheon.formula": { es: "Fórmula", en: "Formula" },
  "ht.pantheon.nota": {
    es: "Busca grado, no cantidad. Un coloso Épico (165) supera diez cuadros Épicos.",
    en: "Chase grade, not count. One Epic colossus (165) beats ten Epic paintings."
  },
  "ht.pantheon.combo_malo": { es: "Esa combinación tipo/grado no está en la tabla citada.", en: "That type/grade combo is not in the cited table." },
  "ht.arcana.titulo": { es: "Checklist Arcana", en: "Arcana checklist" },
  "ht.arcana.card": { es: "Piezas, mazmorra de origen y rareza → skills", en: "Pieces, source dungeon and rarity → skills" },
  "ht.arcana.sub": {
    es: "Marca lo que llevas. Solo Transcendence suelta Arcana; Scales es Season 2 KR.",
    en: "Tick what you wear. Only Transcendence drops Arcana; Scales is KR Season 2."
  },
  "ht.arcana.desc": {
    es: "Arcana AION 2: brújula, campana, pergamino, espejo, cáliz, Scales; de dónde salen y skills por rareza.",
    en: "AION 2 Arcana: compass, bell, scroll, mirror, chalice, Scales; sources and skills by rarity."
  },
  "ht.arcana.kw": { es: "AION 2 arcana, transcendence, daevanion", en: "AION 2 arcana, transcendence, daevanion" },
  "ht.arcana.piezas": { es: "Piezas", en: "Pieces" },
  "ht.arcana.rareza": { es: "Rareza → skills en la carta", en: "Rarity → skills on the card" },
  "ht.arcana.skills": { es: "Skills", en: "Skills" },
  "ht.arcana.equipadas": { es: "Marcadas", en: "Checked" },
  "ht.arcana.full": { es: "Set completo (incluye Scales S2). Prioriza skills que pulsas.", en: "Full set (includes S2 Scales). Prioritize skills you press." },
  "ht.arcana.set42": { es: "Con 4+ piezas ya puedes pensar en set; Scales habilita 4+2 en KR S2.", en: "With 4+ pieces you can plan a set; Scales enables 4+2 in KR S2." },
  "ht.arcana.parcial": { es: "Buen comienzo: farméa la Transcendence que te falta.", en: "Good start: farm the Transcendence you're missing." },
  "ht.arcana.pocas": { es: "Empieza por Deus Research Base o Shattered Arkanis.", en: "Start with Deus Research Base or Shattered Arkanis." },
  "ht.grado.common": { es: "Común", en: "Common" },
  "ht.grado.rare": { es: "Raro", en: "Rare" },
  "ht.grado.legendary": { es: "Legendario", en: "Legendary" },
  "ht.grado.unique": { es: "Único", en: "Unique" },
  "ht.grado.epic": { es: "Épico (tope +10)", en: "Epic (cap +10)" },
  "ht.grado.heroic": { es: "Épico / Heroic (+20 KR)", en: "Epic / Heroic (+20 KR)" },
  "ht.col.paso": { es: "Paso", en: "Step" },
  "ht.col.tasa": { es: "Tasa base", en: "Base rate" },
  "ht.col.pity": { es: "Pity / fallo", en: "Pity / fail" },
  "ht.col.media": { es: "Media", en: "Average" },
  "ht.col.techo": { es: "Techo", en: "Hard cap" },
  "ht.col.kina": { es: "Kina esp.", en: "Exp. Kinah" },
  "ht.col.piedras": { es: "Piedras esp.", en: "Exp. stones" },
  "ht.col.hueco": { es: "Hueco", en: "Slot" },
  "ht.col.opciones": { es: "Opciones", en: "Options" },
  "ht.col.grado": { es: "Grado", en: "Grade" },
  "ht.col.valor": { es: "Valor", en: "Value" },
  "ht.col.item": { es: "Qué", en: "What" },
  "ht.col.donde": { es: "Dónde", en: "Where" },
  "ht.col.tipo": { es: "Tipo", en: "Type" },
  "timers.antetitulo": { es: "AION 2 · herramientas", en: "AION 2 · tools" },
  "timers.titulo": { es: "Timers de eventos", en: "Event timers" },
  "timers.sub": {
    es: "Grieta espacio-tiempo, jefes del Abismo, Festival Shugo, invasión y resets. Horarios comunitarios (no oficiales). Elige tu región; por defecto Europa.",
    en: "Spacetime Rift, Abyss bosses, Shugo Festival, invasion and resets. Community schedules (not official). Pick your region; Europe by default."
  },
  "timers.region": { es: "Región / reloj", en: "Region / clock" },
  "timers.reloj": { es: "Reloj del servidor: {srv} · Tu zona: {local}", en: "Server clock: {srv} · Your zone: {local}" },
  "timers.cat.all": { es: "Todo", en: "All" },
  "timers.cat.rift": { es: "Grieta", en: "Rift" },
  "timers.cat.boss": { es: "Jefes", en: "Bosses" },
  "timers.cat.shugo": { es: "Shugo", en: "Shugo" },
  "timers.cat.invasion": { es: "Invasión", en: "Invasion" },
  "timers.cat.reset": { es: "Reset", en: "Reset" },
  "timers.siguiente": { es: "Siguiente", en: "Next up" },
  "timers.ahora": { es: "En curso", en: "Live now" },
  "timers.proximo": { es: "Próxima apertura:", en: "Next opening:" },
  "timers.hasta": { es: "Termina:", en: "Ends:" },
  "timers.abrio": { es: "Abrió:", en: "Opened:" },
  "timers.termina_en": { es: "Termina en", en: "Ends in" },
  "timers.abre_en": { es: "Abre en", en: "Opens in" },
  "timers.portal": { es: "Entrada abierta (10 min)", en: "Entry open (10 min)" },
  "timers.en_curso": { es: "Evento activo (60 min desde la apertura)", en: "Event running (60 min from open)" },
  "timers.live_detalle": { es: "Abrió {inicio} · termina {fin}", en: "Opened {inicio} · ends {fin}" },
  "timers.hora_servidor": { es: "Horario servidor", en: "Server schedule" },
  "timers.en_servidor": { es: "Hora en el servidor", en: "Server time" },
  "timers.confirmado": { es: "Fuentes de acuerdo", en: "Sources agree" },
  "timers.provisional": { es: "Provisional", en: "Unconfirmed" },
  "timers.nota": {
    es: "Referencia comunitaria revisada el {d}. No es telemetría en vivo ni horario oficial de NCSOFT: manda el aviso del juego.",
    en: "Community reference checked on {d}. Not live telemetry or an official NCSOFT schedule — in-game notices win."
  },
  "timers.fuentes": { es: "Fuentes:", en: "Sources:" },
  "timers.ev.rift": { es: "Grieta espacio-tiempo", en: "Spacetime Rift" },
  "timers.ev.shugo": { es: "Festival Shugo", en: "Shugo Festival" },
  "timers.ev.invasion": { es: "Invasión dimensional", en: "Dimensional Invasion" },
  "timers.ev.dailyReset": { es: "Reset diario", en: "Daily reset" },
  "timers.ev.weeklyReset": { es: "Reset semanal", en: "Weekly reset" },
  "timers.ev.kaira": { es: "Vigilante Kaira", en: "Watcher Kaira" },
  "timers.ev.siege": { es: "Asedio de artefacto", en: "Artifact Siege" },
  "timers.ev.siegeBosses": { es: "Jefes de asedio", en: "Siege Bosses" },
  "timers.ev.nahma": { es: "General guardián Nahma", en: "Guardian General Nahma" },
  "timers.regla_hora": { es: "Cada hora a :{m}", en: "Every hour at :{m}" },
  "timers.dia.0": { es: "Dom", en: "Sun" },
  "timers.dia.1": { es: "Lun", en: "Mon" },
  "timers.dia.2": { es: "Mar", en: "Tue" },
  "timers.dia.3": { es: "Mié", en: "Wed" },
  "timers.dia.4": { es: "Jue", en: "Thu" },
  "timers.dia.5": { es: "Vie", en: "Fri" },
  "timers.dia.6": { es: "Sáb", en: "Sat" },
  "mapa.titulo": { es: "Mapa AION 2: recolección y localizaciones", en: "AION 2 map: gathering and locations" },
  "mapa.sub": { es: "Busca rubí, odyle, zaif, cubos ocultos, mascotas y jefes en Verteron, Altgard, Eltnen, Morheim y el Abismo.", en: "Find ruby, odyle, zaif, hidden cubes, pets and bosses in Verteron, Altgard, Eltnen, Morheim and the Abyss." },
  "mapa.buscar": { es: "Buscar", en: "Search" },
  "mapa.buscar_ph": { es: "Ej. rubí, odyle, zaif, cubo…", en: "E.g. ruby, odyle, zaif, cube…" },
  "mapa.zona": { es: "Zona", en: "Zone" },
  "mapa.todas": { es: "Todas", en: "All" },
  "mapa.ninguna": { es: "Ninguna", en: "None" },
  "mapa.defecto": { es: "Defecto", en: "Default" },
  "mapa.filtros": { es: "Filtros", en: "Filters" },
  "mapa.marcadores": { es: "{n} marcadores en el mapa", en: "{n} markers on the map" },
  "mapa.error": { es: "No se ha podido cargar el mapa.", en: "Could not load the map." },
  "mapa.nota": { es: "Spawns del cliente AION 2 (recolección, mascotas, rastros…). Cubos de Altgard: 59 grupos / 1371 puntos del datamine. Eltnen/Morheim casi sin mascotas en el cliente global. Fan site, sin relación con NCSOFT.", en: "AION 2 client spawns (gathering, pets, traces…). Altgard cubes: 59 groups / 1371 spots from datamine. Eltnen/Morheim barely have pets in the global client. Fan site, not affiliated with NCSOFT." },
  "mapa.fuente": { es: "Spawns · cliente + datamine (fan)", en: "Spawns · client + datamine (fan)" },
  "mapa.tip_ruby": { es: "Prueba «rubí» o «ruby» con Recolección activada. También odyle, zaif, cubos ocultos y mascotas.", en: "Try “ruby” with Gathering on. Also odyle, zaif, hidden cubes and pets." },
  "espia.antetitulo": { es: "AION 2 Europa · gratis", en: "AION 2 Europe · free" },
  "espia.titulo": { es: "Espía Builds", en: "Spy Builds" },
  "espia.sub": { es: "Mira la build real de cualquier jugador EU (equipo, skills, Daevanion, poder e iLvl). Sin cuenta. Busca por nombre y afina con filtros.", en: "See any EU player's real build (gear, skills, Daevanion, power and iLvl). No account needed. Search by name and refine with filters." },
  "espia.ir_tops": { es: "Ver tops comunitarios", en: "View community tops" },
  "tops.antetitulo": { es: "AION 2 · ranking comunitario", en: "AION 2 · community ranking" },
  "tops.titulo": { es: "Tops de poder e iLvl", en: "Power and iLvl tops" },
  "tops.sub": { es: "Ranking comunitario de personajes espiados en AION 2 Europa (poder o iLvl). Público, sin registro. No es el top oficial de NC.", en: "Community ranking of spied AION 2 Europe characters (power or iLvl). Public, no sign-up. Not the official NC leaderboard." },
  "tops.aviso": { es: "Solo entran PJs que alguien haya buscado o abierto en Espía. Se guarda un carnet ligero (poder/iLvl), no la ficha completa.", en: "Only characters someone searched or opened in Spy appear. A light card (power/iLvl) is stored, not the full profile." },
  "tops.login": { es: "Entra con tu cuenta para ver los tops.", en: "Sign in to view the tops." },
  "tops.ambito": { es: "Ámbito", en: "Scope" },
  "tops.ambito_eu": { es: "Europa (todos)", en: "Europe (all)" },
  "tops.ambito_elyos": { es: "Elyos", en: "Elyos" },
  "tops.ambito_asmodian": { es: "Asmodian", en: "Asmodian" },
  "tops.ambito_server": { es: "Un servidor", en: "One server" },
  "tops.elige_servidor": { es: "Elige un servidor", en: "Choose a server" },
  "tops.orden": { es: "Ordenar por", en: "Sort by" },
  "tops.orden_poder": { es: "Poder", en: "Power" },
  "tops.orden_ilvl": { es: "iLvl", en: "iLvl" },
  "tops.ver": { es: "Ver top", en: "Show top" },
  "tops.cargando": { es: "Cargando top…", en: "Loading top…" },
  "tops.resultado": { es: "Mostrando {n} · {total} en este filtro", en: "Showing {n} · {total} in this filter" },
  "tops.vacio": { es: "Aún no hay nadie en este filtro. Espía builds y volverán a aparecer aquí.", en: "No one in this filter yet. Spy some builds and they will show up here." },
  "tops.ir_espia": { es: "← Ir a Espía Builds", en: "← Go to Spy Builds" },
  "tops.espia_build": { es: "Espía build", en: "Spy build" },
  "espia.buscar": { es: "Espiar", en: "Spy" },
  "espia.placeholder": { es: "Nombre del personaje (mín. 2 letras)…", en: "Character name (min. 2 letters)…" },
  "espia.filtro_todas": { es: "Todas las clases", en: "All classes" },
  "espia.filtro_cualquier_nv": { es: "Cualquier nivel", en: "Any level" },
  "espia.filtro_cualquier_raza": { es: "Cualquier facción", en: "Any faction" },
  "espia.filtro_cualquier_srv": { es: "Cualquier servidor", en: "Any server" },
  "espia.poder_min": { es: "Poder mínimo", en: "Min. power" },
  "espia.ordenar_poder": { es: "Ordenar por poder (tops)", en: "Sort by power (tops)" },
  "espia.filtros_hint": { es: "El nombre es obligatorio. Cada página lee poder e iLvl (unos segundos). El filtro de poder aplica a la página actual.", en: "Name is required. Each page reads power and iLvl (a few seconds). Power filter applies to the current page." },
  "espia.filtro_necesario": { es: "Escribe al menos 2 letras del nombre.", en: "Type at least 2 letters of the name." },
  "espia.buscando_poder": { es: "Buscando y leyendo poder / iLvl…", en: "Searching and reading power / iLvl…" },
  "espia.parcial": { es: "Muestra parcial", en: "Partial sample" },
  "espia.resultado": { es: "{n} en esta página · pág. {p}/{pages} · {total} en NC", en: "{n} on this page · p. {p}/{pages} · {total} on NC" },
  "espia.total": { es: "{n} en NC", en: "{n} on NC" },
  "espia.mostrando": { es: "{n} resultados", en: "{n} results" },
  "espia.pagina": { es: "Página {p} de {n}", en: "Page {p} of {n}" },
  "espia.anterior": { es: "Anterior", en: "Previous" },
  "espia.siguiente": { es: "Siguiente", en: "Next" },
  "espia.vacio_pagina": { es: "Nadie en esta página con esos filtros. Prueba otra página o quita el filtro de poder.", en: "No one on this page with those filters. Try another page or clear the power filter." },
  "espia.login": { es: "Entra con tu cuenta para espiar builds de otros jugadores.", en: "Sign in to spy on other players' builds." },
  "espia.entrar": { es: "Entrar", en: "Sign in" },
  "espia.vacio": { es: "Nadie con ese nombre en Europa. Prueba otra ortografía.", en: "No one with that name in Europe. Try another spelling." },
  "espia.chip": { es: "Espiado", en: "Spied" },
  "espia.otro": { es: "Espiar a otro", en: "Spy on another" },
  "espia.solo_lectura": {
    es: "Datos reales de NCSOFT: equipo, niveles de skill, Daevanion y poder. Las especializaciones elegidas, la barra y la macro no las publica NCSOFT: no las inventamos. Solo lectura.",
    en: "Live NCSOFT data: gear, skill levels, Daevanion and power. Chosen specializations, hotbar and macro are not published by NCSOFT — we don't invent them. View-only."
  },
  "espia.sin_esp": {
    es: "Especializaciones elegidas: estos datos no los proporciona NCSOFT.",
    en: "Chosen specializations: NCSOFT does not provide this data."
  },
  "barra.aviso_espia_tit": { es: "Sin barra ni macro de NCSOFT", en: "No hotbar or macro from NCSOFT" },
  "barra.aviso_espia": {
    es: "Estos datos no los proporciona NCSOFT. No mostramos una plantilla inventada: la barra y la macro del jugador no están en la API.",
    en: "NCSOFT does not provide this data. We don't show an invented template: the player's hotbar and macro are not in the API."
  },
  "barra.sin_nc": {
    es: "Sin barra ni macro: NCSOFT no publica esta información.",
    en: "No hotbar or macro: NCSOFT does not publish this information."
  },
  "espia.ver": { es: "Ver build", en: "View build" },
  "espia.elyos": { es: "Elyos", en: "Elyos" },
  "espia.asmodian": { es: "Asmodian", en: "Asmodian" },
  "espia.servidor": { es: "Servidor", en: "Server" },
  "espia.facción": { es: "Facción", en: "Faction" },
  "espia.clase": { es: "Clase", en: "Class" },
  "espia.genero": { es: "Género", en: "Gender" },
  "espia.titulo_activo": { es: "Título activo", en: "Active title" },
  "espia.gremio": { es: "Legión", en: "Legion" },
  "espia.region_nc": { es: "Región NC", en: "NC region" },
  "espia.server_id": { es: "ID servidor", en: "Server ID" },
  "espia.pc_id": { es: "ID clase (pcId)", en: "Class ID (pcId)" },
  "espia.race_id": { es: "ID raza", en: "Race ID" },
  "espia.titulo_id": { es: "ID título", en: "Title ID" },
  "espia.character_id": { es: "ID personaje", en: "Character ID" },
  "espia.nivel_objeto": { es: "Nivel de objeto", en: "Item level" },
  "espia.ilvl": { es: "iLvl", en: "iLvl" },
  "espia.ficha_titulo": { es: "Ficha completa", en: "Full profile" },
  "espia.atributos": { es: "Atributos y afinidades", en: "Attributes and affinities" },
  "espia.tableros": { es: "Tableros Daevanion", en: "Daevanion boards" },
  "espia.tablero_abierto": { es: "Abierto", en: "Open" },
  "espia.tablero_cerrado": { es: "Cerrado", en: "Closed" },
  "espia.titulos": { es: "Títulos", en: "Titles" },
  "espia.titulos_cuenta": { es: "{n} de {total} títulos", en: "{n} of {total} titles" },
  "espia.ver_titulos": { es: "Ver lista de títulos", en: "Show title list" },
  "espia.titulo_rareza": { es: "{n}/{total} jugadores · {p}%", en: "{n}/{total} players · {p}%" },
  "espia.ranking": { es: "Ranking", en: "Ranking" },
  "espia.carga_titulo": { es: "Consultando AION 2…", en: "Querying AION 2…" },
  "espia.carga_1": { es: "Consultando la base de datos oficial de AION 2…", en: "Querying the official AION 2 database…" },
  "espia.carga_2": { es: "Leyendo ficha, equipo y habilidades…", en: "Reading profile, gear and skills…" },
  "espia.carga_3": { es: "Esto puede tardar unos segundos la primera vez…", en: "This can take a few seconds the first time…" },
  "espia.carga_4": { es: "La próxima vez saldrá más rápido (queda en caché)…", en: "Next time it will be faster (it stays cached)…" },
  "espia.carga_catalogo": { es: "Preparando la vista de la build…", en: "Preparing the build view…" },
  "espia.carga_hint": { es: "No cierres la página: estamos hablando con los servidores de NCSOFT.", en: "Don't close the page: we're talking to NCSOFT's servers." },
  "espia.carga_error": { es: "No se pudo leer la ficha", en: "Couldn't read the profile" },
  "espia.carga_error_hint": { es: "A veces NC tarda o no responde. Prueba otra vez en unos segundos.", en: "Sometimes NC is slow or unresponsive. Try again in a few seconds." },
  "espia.reintentar": { es: "Reintentar", en: "Retry" },
  "espia.abriendo": { es: "Abriendo ficha…", en: "Opening profile…" },
  "guias.antetitulo": { es: "Legión Orden Celeste", en: "Orden Celeste legion" },
  "guias.sub": { es: "Resúmenes claros de AION 2: por dónde empezar, qué mejorar y qué ignorar.", en: "Clear AION 2 write-ups: where to start, what to upgrade and what to ignore." },
  "guias.buscar": { es: "Buscar una guía…", en: "Search a guide…" },
  "guias.todas": { es: "Todas", en: "All" },
  "guias.leer": { es: "Leer", en: "Read" },
  "guias.destacada": { es: "Empieza por aquí", en: "Start here" },
  "guias.vacio": { es: "Ninguna guía coincide con esa búsqueda.", en: "No guide matches that search." },
  "guias.n": { es: "{n} guías", en: "{n} guides" },
  "nav.mis": { es: "Mis builds", en: "My builds" },
  "nav.entrar": { es: "Entrar", en: "Sign in" },
  "nav.salir": { es: "Salir", en: "Sign out" },
  "nav.menu": { es: "Menú", en: "Menu" },
  "nav.gremio": { es: "Legión", en: "Legion" },
  "nav.foro": { es: "Foro", en: "Forum" },
  "nav.chat": { es: "Chat", en: "Chat" },
  "nav.panel": { es: "Panel", en: "Panel" },
  "nav.super": { es: "Super", en: "Super" },
  "pest.habilidades": { es: "Habilidades", en: "Skills" },
  "pest.barra": { es: "Barra y macro", en: "Hotbar & macro" },
  "build.abrir_principal": { es: "Copiar o editar en la web de la legión", en: "Copy or edit on the legion site" },
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
  "dae.p_conquista": { es: "Cristales de conquista", en: "Conquest crystals" },
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
  "dae.ayuda_ver": { es: "Pasa el ratón por un nodo para ver su efecto. Los tableros se desbloquean por nivel; Ariel usa cristales de conquista y Azphel de batalla.", en: "Hover a node to see its effect. Boards unlock by level; Ariel uses conquest crystals and Azphel battle crystals." },
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

  "inicio.antetitulo": { es: "Legión · AION 2", en: "Legion · AION 2" },
  "inicio.legion_server": { es: "Marchutan", en: "Marchutan" },
  "inicio.legion_faccion": { es: "Asmodianos", en: "Asmodians" },
  "inicio.titulo": { es: "Casa de la legión Orden Celeste", en: "Home of the Orden Celeste legion" },
  "inicio.sub": {
    es: "Asmodianos en Marchutan. Jugamos AION 2 en Europa y mantenemos esta web abierta para toda la comunidad: Espía Builds, tops, mapa, timers y herramientas.",
    en: "Asmodians on Marchutan. We play AION 2 in Europe and keep this site open for the whole community: Spy Builds, tops, map, timers and tools."
  },
  "inicio.cta_comunidad": { es: "Comunidad", en: "Community" },
  "inicio.cta_discord": { es: "Discord", en: "Discord" },
  "inicio.cta_herramientas": { es: "Ver herramientas ↓", en: "See tools ↓" },
  "inicio.patrocinio": {
    es: "Herramientas abiertas a toda Europa · hechas y mantenidas por la legión Orden Celeste (Marchutan).",
    en: "Tools open to all of Europe · built and maintained by the Orden Celeste legion (Marchutan)."
  },
  "inicio.slide.prev": { es: "Anterior", en: "Previous" },
  "inicio.slide.next": { es: "Siguiente", en: "Next" },
  "inicio.slide.legion_chip": { es: "Legión · Marchutan", en: "Legion · Marchutan" },
  "inicio.slide.espia_chip": { es: "Espía · compara · gratis", en: "Spy · compare · free" },
  "inicio.slide.espia_titulo": { es: "Espía Builds: la build real de cualquiera", en: "Spy Builds: anyone's real build" },
  "inicio.slide.espia_txt": {
    es: "Busca un nombre EU y abre equipo, skills, Daevanion, poder e iLvl. Sin cuenta.",
    en: "Search an EU name and open gear, skills, Daevanion, power and iLvl. No account."
  },
  "inicio.slide.espia_cta": { es: "Abrir Espía Builds", en: "Open Spy Builds" },
  "inicio.slide.tops_chip": { es: "Comunidad", en: "Community" },
  "inicio.slide.tops_titulo": { es: "Tops de lo que la legión espía", en: "Tops from what the legion spies" },
  "inicio.slide.tops_txt": {
    es: "Ranking por poder e iLvl de personajes descubiertos al espiar.",
    en: "Rankings by power and iLvl from characters found while spying."
  },
  "inicio.slide.tops_cta": { es: "Ver tops", en: "See tops" },
  "inicio.slide.timers_chip": { es: "Utilidades", en: "Utilities" },
  "inicio.slide.timers_titulo": { es: "Timers: grieta, jefes y Shugo", en: "Timers: rift, bosses and Shugo" },
  "inicio.slide.timers_txt": {
    es: "Horarios a tu zona. Europa por defecto; elige región y cuenta atrás en vivo.",
    en: "Schedules in your timezone. Europe by default; pick a region and live countdown."
  },
  "inicio.slide.timers_cta": { es: "Abrir timers", en: "Open timers" },
  "inicio.slide.ht_chip": { es: "Calculadoras", en: "Calculators" },
  "inicio.slide.ht_titulo": { es: "Herramientas: mejora, craft y más", en: "Tools: enhance, craft and more" },
  "inicio.slide.ht_txt": {
    es: "Pity, Amplify, Manastones, Pantheon y Arcana con datos citados.",
    en: "Pity, Amplify, Manastones, Pantheon and Arcana with cited data."
  },
  "inicio.slide.ht_cta": { es: "Ver herramientas", en: "See tools" },
  "inicio.slide.mapa_chip": { es: "Mundo", en: "World" },
  "inicio.slide.mapa_titulo": { es: "Mapa de rubí, odyle y recolección", en: "Ruby, odyle and gathering map" },
  "inicio.slide.mapa_txt": {
    es: "Nodos por zona para farmear sin perderte. Filtros listos en el móvil.",
    en: "Nodes by zone so you farm without getting lost. Mobile-ready filters."
  },
  "inicio.slide.mapa_cta": { es: "Abrir mapa", en: "Open map" },
  "inicio.slide.guias_chip": { es: "Progresión", en: "Progression" },
  "inicio.slide.guias_titulo": { es: "Guías sin inventar datos de NC", en: "Guides with no invented NC data" },
  "inicio.slide.guias_txt": {
    es: "Progresión, mazmorras y sistemas con fuentes citadas. ES y EN.",
    en: "Progression, dungeons and systems with cited sources. ES and EN."
  },
  "inicio.slide.guias_cta": { es: "Leer guías", en: "Read guides" },
  "inicio.espia": { es: "Abrir Espía Builds", en: "Open Spy Builds" },
  "inicio.espia_chip": { es: "Espía · compara · gratis", en: "Spy · compare · free" },
  "inicio.espia_titulo": { es: "Espía Builds y compara con la tuya", en: "Spy Builds and compare with yours" },
  "inicio.espia_txt": {
    es: "Busca un nombre en EU y ábrelo como build (equipo, skills, Daevanion, poder e iLvl). Luego compáralo con tu personaje o con una build tuya: ves qué te falta y qué sobra. Sin cuenta para espiar.",
    en: "Search an EU name and open it as a build (gear, skills, Daevanion, power and iLvl). Then compare it with your character or one of your builds: see what you're missing and what you can drop. No account needed to spy."
  },
  "inicio.espia_cta": { es: "Espiar un personaje", en: "Spy a character" },
  "inicio.espia_comparar": { es: "Comparar con tu build →", en: "Compare with your build →" },
  "inicio.espia_tops": { es: "Ver tops de lo espiado →", en: "See tops from spied characters →" },
  "inicio.dato_clases": { es: "clases", en: "classes" },
  "inicio.dato_habilidades": { es: "habilidades", en: "skills" },
  "inicio.dato_builds": { es: "builds públicas", en: "public builds" },
  "inicio.dato_guias": { es: "guías", en: "guides" },
  "inicio.dato_visitas": { es: "visitas", en: "visits" },
  "inicio.crear": { es: "Crear mi build", en: "Create my build" },
  "inicio.explorar": { es: "Explorar builds", en: "Browse builds" },
  "inicio.tops": { es: "Tops comunitarios", en: "Community tops" },
  "inicio.tops_sub": { es: "Poder e iLvl de personajes descubiertos al espiar", en: "Power and iLvl from characters discovered while spying" },
  "inicio.clases": { es: "Elige tu clase", en: "Pick your class" },
  "inicio.recientes": { es: "Builds publicadas recientemente", en: "Recently published builds" },
  "inicio.ver_todas": { es: "Ver todas", en: "See all" },
  "inicio.ver_clases": { es: "Ver todas las clases", en: "See all classes" },
  "inicio.fuentes": { es: "Datos y recursos de", en: "Data and assets from" },
  "inicio.explora_titulo": { es: "Herramientas de la legión, para todos", en: "Legion tools, for everyone" },
  "inicio.explora_sub": {
    es: "Espía, tops, progresión y utilidades. Úsalas aunque no seas de Marchutan: el proyecto es de Orden Celeste y está abierto a EU.",
    en: "Spy, tops, progression and utilities. Use them even if you're not on Marchutan: Orden Celeste runs the project and it's open to EU."
  },
  "inicio.card.espia": { es: "Espía y compara", en: "Spy and compare" },
  "inicio.card.espia_txt": { es: "Build real de cualquiera y diff con la tuya", en: "Anyone's real build and diff vs yours" },
  "inicio.card.tops": { es: "Tops", en: "Tops" },
  "inicio.card.tops_txt": { es: "Ranking comunitario por poder e iLvl", en: "Community ranking by power and iLvl" },
  "inicio.card.timers": { es: "Timers", en: "Timers" },
  "inicio.card.timers_txt": { es: "Grieta, jefes, Shugo y resets a tu hora", en: "Rift, bosses, Shugo and resets in your time" },
  "inicio.card.herramientas": { es: "Herramientas", en: "Tools" },
  "inicio.card.herramientas_txt": { es: "Mejora, craft, pity, Pantheon, Arcana…", en: "Enhance, craft, pity, Pantheon, Arcana…" },
  "inicio.card.mapa": { es: "Mapa", en: "Map" },
  "inicio.card.mapa_txt": { es: "Rubí, odyle y nodos de recolección", en: "Ruby, odyle and gathering nodes" },
  "inicio.card.guias": { es: "Guías", en: "Guides" },
  "inicio.card.guias_txt": { es: "Progresión clara, fuentes citadas", en: "Clear progression, cited sources" },
  "inicio.card.clases": { es: "Clases", en: "Classes" },
  "inicio.card.clases_txt": { es: "Las 8 clases, skills y builds", en: "All 8 classes, skills and builds" },
  "inicio.card.comunidad": { es: "Comunidad", en: "Community" },
  "inicio.card.comunidad_txt": { es: "Foro y chat de la legión", en: "Legion forum and chat" },

  "clases.antetitulo": { es: "AION 2", en: "AION 2" },
  "clases.titulo": { es: "Clases", en: "Classes" },
  "clases.sub": { es: "Ocho caminos. Elige el tuyo: habilidades, builds de la comunidad y guía de referencia.", en: "Eight paths. Pick yours: skills, community builds and a reference guide." },
  "clases.ver": { es: "Ver clase", en: "View class" },

  "clase.habilidades": { es: "Habilidades", en: "Skills" },
  "clase.builds": { es: "Builds públicas de esta clase", en: "Public builds for this class" },
  "clase.guia_ref": { es: "Guía de referencia (barra, equipo y Daevanion)", en: "Reference guide (hotbar, gear and Daevanion)" },
  "clase.guia_ext": { es: "Guía en expcarry", en: "Guide on expcarry" },
  "clase.nivel_vista": { es: "Ver valores a nivel", en: "Show values at level" },
  "clase.crear": { es: "Crear build de", en: "Create build for" },

  "nueva.antetitulo": { es: "Mis builds", en: "My builds" },
  "nueva.titulo": { es: "Nueva build", en: "New build" },
  "nueva.paso_clase": { es: "Elige la clase", en: "Pick the class" },
  "nueva.paso_clase_txt": { es: "La build queda ligada a esta clase. Luego podrás editar habilidades, barra y Daevanion.", en: "The build is tied to this class. You can then edit skills, hotbar and Daevanion." },
  "nueva.paso_datos": { es: "Nombre y modo", en: "Name and mode" },
  "nueva.paso_datos_txt": { es: "Ponle un nombre claro (por ejemplo el personaje o el rol) y el contenido para el que la usarás.", en: "Give it a clear name (e.g. character or role) and the content you'll use it for." },
  "nueva.nombre_ph": { es: "Ej. Mi Templario JcE", en: "E.g. My Templar PvE" },
  "nueva.modo_pve": { es: "Mazmorras, raids y JcE general", en: "Dungeons, raids and general PvE" },
  "nueva.modo_pvp": { es: "Abismo, campos y duelos", en: "Abyss, battlegrounds and duels" },
  "nueva.modo_farm": { es: "Farmeo y rutinas diarias", en: "Farming and daily routines" },
  "nueva.modo_otro": { es: "Pruebas, híbrido u otro uso", en: "Tests, hybrid or other use" },
  "nueva.crear": { es: "Crear y editar", en: "Create and edit" },
  "nueva.cancelar": { es: "Volver a mis builds", en: "Back to my builds" },
  "nueva.otra_via": { es: "¿Prefieres partir del juego?", en: "Prefer to start from the game?" },
  "nueva.otra_via_txt": { es: "Importa tu personaje: se crea una copia editable con lo que llevas puesto ahora.", en: "Import your character: an editable copy is created with what you wear now." },
  "nueva.abrir_creador": { es: "Abrir creador completo", en: "Open full creator" },

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
  "builds.vacio_cta": {
    es: "¿Quieres publicar la tuya? Entra o regístrate y créala en Mis builds.",
    en: "Want to publish yours? Sign in or register and create it in My builds."
  },
  "builds.entrar": { es: "Entrar / registrarse", en: "Sign in / register" },
  "builds.mis": { es: "Ir a Mis builds", en: "Go to My builds" },
  "builds.error_local": {
    es: "No se han podido cargar las builds. Comprueba la conexión o abre la web en Render.",
    en: "Could not load builds. Check your connection or open the site on Render."
  },
  "builds.por": { es: "por", en: "by" },
  "builds.actualizada": { es: "Actualizada", en: "Updated" },
  "builds.subtitulo": {
    es: "Arriba, tops de la semana por clase (Espía). Abajo, lo que publica la comunidad — filtra JcE o JcJ a tu gusto.",
    en: "Above, weekly tops by class (Spy). Below, community builds — filter PvE or PvP as you like."
  },
  "builds.sec_tops": { es: "Tops de la semana", en: "This week’s tops" },
  "builds.sec_tops_sub": {
    es: "Dos por clase. Instantánea del ranking; no marca JcE ni JcJ.",
    en: "Two per class. Ranking snapshot; not tagged PvE or PvP."
  },
  "builds.sec_comunidad": { es: "De la comunidad", en: "From the community" },
  "builds.sec_comunidad_sub": {
    es: "Builds publicadas por jugadores (con modo JcE/JcJ) y referencias del gremio.",
    en: "Builds published by players (with PvE/PvP mode) and guild references."
  },
  "builds.sec_archivo": { es: "Archivo de tops (votos conservados)", en: "Top archive (votes kept)" },
  "builds.sec_archivo_sub": {
    es: "Quienes dejaron de ser top siguen aquí con sus me gusta.",
    en: "Former tops stay here with their likes."
  },
  "builds.vacio_filtro": { es: "Nada con ese filtro.", en: "Nothing matches that filter." },
  "builds.referencia": { es: "Referencia", en: "Reference" },
  "builds.top": { es: "Top", en: "Top" },
  "builds.top_semana": { es: "Top semana", en: "Weekly top" },
  "builds.ex_top": { es: "Ex-Top", en: "Former top" },
  "builds.top_aviso": {
    es: "Instantánea del ranking (Espía). No indica si es JcE o JcJ: solo que ese personaje estaba en el top de la semana.",
    en: "Ranking snapshot (Spy). It does not say PvE or PvP — only that this character was in that week’s top."
  },
  "builds.votos": { es: "Votos (👍 / 👎)", en: "Votes (👍 / 👎)" },
  "titulo.top_semana": { es: "🏆 Top · {sem}", en: "🏆 Top · {sem}" },
  "titulo.leyenda": { es: "🏆 Leyenda ({n}× oro)", en: "🏆 Legend ({n}× gold)" },
  "titulo.ex_top1": { es: "🏆 Ex-oro ({n})", en: "🏆 Former gold ({n})" },
  "titulo.ex_top": { es: "🏅 Ex-Top ({n} sem.)", en: "🏅 Former top ({n} wk)" },
  "titulo.historial": { es: "Tops anteriores", en: "Past tops" },
  "build.vota": { es: "Vota", en: "Vote" },
  "build.like": { es: "Pulgar arriba", en: "Thumbs up" },
  "build.dislike": { es: "Pulgar abajo", en: "Thumbs down" },
  "build.voto_propia": { es: "No puedes votar tu propia build", en: "You can't vote on your own build" },
  "build.voto_entrar": { es: "Entra para votar", en: "Sign in to vote" },
  "build.ver_espia": { es: "Ficha en vivo (Espía)", en: "Live profile (Spy)" },
  "notif.titulo": { es: "Notificaciones", en: "Notifications" },
  "notif.vacio": { es: "Nada nuevo por aquí", en: "Nothing new here" },
  "notif.leer_todas": { es: "Marcar leídas", en: "Mark all read" },
  "err.voto_propia": { es: "No puedes votar tu propia build.", en: "You can't vote on your own build." },
  "err.dato_invalido": { es: "Dato no válido.", en: "Invalid data." },
  "err.no_permitido": { es: "No permitido.", en: "Not allowed." },
  "noticias.error_local": {
    es: "No se han podido cargar las noticias (hace falta la API). En local usa el preview con datos de Render, o abre la web online.",
    en: "Could not load news (API required). Locally the preview uses Render data, or open the online site."
  },

  "build.nivel": { es: "Nv.", en: "Lv." },
  "build.sin_aprender": { es: "Sin aprender", en: "Not learned" },
  "build.extra_tit": { es: "En el juego: {total} ({base} con puntos + {extra} Daevanion)", en: "In game: {total} ({base} with points + {extra} Daevanion)" },
  "build.origen_hab": { es: "hab", en: "skill" },
  "build.origen_dae": { es: "daevanion", en: "daevanion" },
  "build.origen_arm": { es: "armadura", en: "armor" },
  "build.origen_tit": {
    es: "En el juego: {total}. {hab} con puntos, {dae} de Daevanion, {arm} del equipo.",
    en: "In game: {total}. {hab} from points, {dae} from Daevanion, {arm} from gear."
  },
  "build.extra_arm": { es: "Niveles extra de equipo", en: "Extra gear levels" },
  "build.tope_hab": { es: "Con puntos, el máximo es 10. Daevanion y el equipo se suman aparte, como en el juego.", en: "Skill points stop at 10. Daevanion and gear add on top, like in the game." },
  "build.tope_est": { es: "Las estigmas sí suben hasta 20 con fragmentos.", en: "Stigmas can go to 20 with shards." },
  "build.tope_pj": { es: "Requiere personaje nv. {n}", en: "Requires character lv. {n}" },
  "build.tope_puntos": { es: "Máximo {n} con puntos", en: "Max {n} with points" },
  "build.extra_dae": { es: "Niveles extra de Daevanion", en: "Extra Daevanion levels" },
  "build.en_juego": { es: "En el juego", en: "In game" },
  "build.solo_lectura": {
    es: "Así lo llevas ahora en el juego (datos NCSOFT). Especializaciones elegidas, barra y macro no las publica NCSOFT: no las inventamos. Crea una build de este personaje si quieres editarlas.",
    en: "This is what you have in game right now (NCSOFT data). Chosen specializations, hotbar and macro are not published by NCSOFT — we don't invent them. Create a build for this character if you want to edit them."
  },
  "build.pulsa_editar": { es: "Pulsa en cualquier habilidad, en la barra o en el tablero para editar.", en: "Click any skill, the hotbar or the board to edit." },
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
  "build.publicar": { es: "Publicar en Builds", en: "Publish on Builds" },
  "build.publicar_hint": {
    es: "Actívalo para que tu build salga en Builds de la comunidad. Se guarda al instante.",
    en: "Turn this on so your build appears on community Builds. Saves immediately."
  },
  "build.publica_hint": {
    es: "Visible en Builds de la comunidad. Se guarda al instante.",
    en: "Visible on community Builds. Saves immediately."
  },
  "build.publica_ok": { es: "Build publicada: ya sale en Builds.", en: "Build published: it now appears on Builds." },
  "build.privada_ok": { es: "Build privada: ya no sale en Builds.", en: "Build private: removed from Builds." },
  "build.ver_en_builds": { es: "Ver en Builds →", en: "See on Builds →" },
  "build.privada": { es: "Privada", en: "Private" },
  "build.ya_publica": { es: "Build publicada", en: "Build published" },
  "build.nombre": { es: "Nombre de la build", en: "Build name" },
  "build.modo": { es: "Modo", en: "Mode" },
  "build.descripcion": { es: "Descripción y notas", en: "Description and notes" },
  "build.videos": { es: "Vídeos", en: "Videos" },
  "build.videos_ayuda": { es: "Enlaces de YouTube, uno por línea (máx. 6).", en: "YouTube links, one per line (max 6)." },
  "build.nivel_pj": { es: "Nivel del personaje", en: "Character level" },
  "build.fuente": { es: "Fuente", en: "Source" },
  "build.cancelar": { es: "Cancelar", en: "Cancel" },
  "build.cancelar_conf": {
    es: "Hay cambios sin guardar. ¿Salir sin guardar?",
    en: "You have unsaved changes. Leave without saving?"
  },
  "build.borrar": { es: "Borrar", en: "Delete" },
  "build.borrar_conf": { es: "¿Borrar esta build? No se puede deshacer.", en: "Delete this build? This cannot be undone." },
  "build.borrar_escribe": {
    es: "Vas a borrar esta build para siempre. Escribe BORRAR para confirmar.",
    en: "This will permanently delete the build. Type DELETE to confirm."
  },
  "build.borrar_mal": {
    es: "No se ha borrado. Debes escribir exactamente BORRAR.",
    en: "Not deleted. You must type DELETE exactly."
  },
  "build.no_existe": { es: "Esta build no existe o es privada.", en: "This build does not exist or is private." },
  "build.mostrar_todas": { es: "Mostrar también las no aprendidas", en: "Also show skills not learned" },
  "build.auto": { es: "Se desbloquean solas al subir de nivel", en: "Unlock automatically when levelling" },

  "mis.titulo": { es: "Mis builds", en: "My builds" },
  "mis.antetitulo": { es: "Tu cuenta", en: "Your account" },
  "mis.sub": { es: "Importa tu personaje del juego para editar una copia, o crea una build en blanco. Puedes tener varias por personaje.", en: "Import your in-game character to edit a copy, or create a blank build. You can keep several per character." },
  "mis.dato_builds": { es: "builds", en: "builds" },
  "mis.dato_publicas": { es: "públicas", en: "public" },
  "mis.dato_habilidades": { es: "habilidades", en: "skills" },
  "mis.dato_nodos": { es: "nodos Daevanion", en: "Daevanion nodes" },
  "mis.presets": { es: "presets de barra", en: "hotbar presets" },
  "mis.nueva": { es: "Build en blanco", en: "Blank build" },
  "mis.nueva_sub": { es: "Sin ficha del juego: empiezas de cero eligiendo clase y modo.", en: "No in-game profile: start from scratch with class and mode." },
  "mis.crear": { es: "Crear", en: "Create" },
  "mis.vacio": { es: "Aún no tienes builds. Importa un personaje o crea una en blanco.", en: "You have no builds yet. Import a character or create a blank one." },
  "mis.importar": { es: "Importar del juego", en: "Import from game" },
  "mis.importar_sub": { es: "Busca tu personaje. Se crea una copia editable con habilidades y Daevanion actuales; la ficha del juego no se toca.", en: "Search your character. An editable copy is created with current skills and Daevanion; the live profile is left alone." },
  "mis.buscar": { es: "Buscar", en: "Search" },
  "mis.importar_btn": { es: "Crear copia", en: "Create copy" },
  "mis.importando": { es: "Importando…", en: "Importing…" },
  "mis.personajes": { es: "Tus personajes del juego", en: "Your in-game characters" },
  "mis.personajes_sub": { es: "Ya vinculados a tu cuenta. Ver abre la ficha en caché; Nueva copia crea una build editable.", en: "Already linked to your account. View opens the cached profile; New copy creates an editable build." },
  "mis.nueva_copia": { es: "Nueva copia", en: "New copy" },
  "mis.ver_pj": { es: "Ver", en: "View" },
  "mis.cuenta": { es: "Mi cuenta", en: "My account" },
  "juego.actualizar_titulo": { es: "Ficha en caché", en: "Cached profile" },
  "juego.actualizar_preg": { es: "Última lectura: {cuando}. ¿Quieres pedirle al juego la ficha actual?", en: "Last read: {cuando}. Fetch the current profile from the game?" },
  "juego.actualizar_hint": { es: "La actualización suele tardar 30–60 segundos.", en: "Updating usually takes 30–60 seconds." },
  "juego.actualizar_si": { es: "Actualizar ahora", en: "Update now" },
  "juego.actualizar_no": { es: "Seguir con la caché", en: "Keep cached version" },
  "juego.actualizando": { es: "Actualizando ficha del juego… 30–60 s", en: "Updating in-game profile… 30–60 s" },
  "juego.actualizando_corto": { es: "Actualizando…", en: "Updating…" },
  "juego.prog_1": { es: "Contactando con AION 2…", en: "Contacting AION 2…" },
  "juego.prog_2": { es: "Leyendo equipo y atributos…", en: "Reading gear and attributes…" },
  "juego.prog_3": { es: "Sincronizando ficha…", en: "Syncing profile…" },
  "juego.prog_4": { es: "Casi listo, esperando respuesta…", en: "Almost done, waiting for response…" },
  "juego.prog_ok": { es: "Ficha actualizada", en: "Profile updated" },
  "juego.refrescar_titulo": { es: "Actualizar ficha", en: "Refresh profile" },
  "juego.refrescar_conf": { es: "Se pedirá la ficha actual a AION 2. La que tienes ahora se sustituirá.", en: "The current profile will be fetched from AION 2. Your cached copy will be replaced." },
  "mis.cuenta_seguridad": { es: "Cuenta y seguridad", en: "Account & security" },
  "mis.cambiar_clave": { es: "Cambiar contraseña", en: "Change password" },
  "mis.clave_actual": { es: "Contraseña actual", en: "Current password" },
  "mis.clave_nueva": { es: "Contraseña nueva (mín. 8)", en: "New password (min. 8)" },
  "mis.clave_ok": { es: "Contraseña cambiada", en: "Password changed" },
  "mis.vinculada": { es: "vinculada a", en: "linked to" },

  "juego.pregunta": { es: "¿Vincular esta build con tu personaje del juego?", en: "Link this build to your in-game character?" },
  "juego.pregunta_txt": { es: "Busca por nombre y servidor. Verás lo que llevas puesto al lado de esta build, y podrás crear más builds del mismo personaje.", en: "Search by name and server. You'll see what you have equipped next to this build, and you can create more builds for the same character." },
  "juego.buscar": { es: "Buscar personaje", en: "Search character" },
  "juego.nombre": { es: "Nombre en el juego", en: "In-game name" },
  "juego.buscando": { es: "Buscando…", en: "Searching…" },
  "juego.leyendo": { es: "Leyendo la ficha del juego…", en: "Reading the in-game profile…" },
  "juego.vacio": { es: "No hay ningún personaje con ese nombre en Europa.", en: "No character with that name in Europe." },
  "juego.cerrar": { es: "Cerrar", en: "Close" },
  "juego.nv": { es: "nv.", en: "lv." },
  "juego.poder": { es: "poder", en: "power" },
  "juego.leido": { es: "Ficha leída", en: "Profile read" },
  "juego.refrescar": { es: "Actualizar ficha", en: "Refresh profile" },
  "juego.desvincular": { es: "Quitar vínculo", en: "Unlink" },
  "juego.desvincular_conf": { es: "¿Quitar el vínculo? La build se queda como está.", en: "Unlink? The build itself stays as it is." },
  "juego.nueva": { es: "Nueva build de este personaje", en: "New build for this character" },
  "juego.nueva_nombre": { es: "Nombre de la nueva build", en: "Name of the new build" },
  "juego.comparar": { es: "Comparar", en: "Compare" },
  "juego.json_puntos": { es: "Copiar para puntos", en: "Copy for points" },
  "juego.json_puntos_hint": {
    es: "Resumen corto para repartir puntos de habilidad y estigmas. Daevanion y armadura ya van en cada línea.",
    en: "Short summary for spending skill points and stigma shards. Daevanion and armor are already on each line."
  },
  "juego.json_puntos_copiado": { es: "Resumen de puntos copiado", en: "Point summary copied" },
  "juego.puntos_puesto": { es: "puesto", en: "slotted" },
  "juego.puntos_leyenda": {
    es: "Libres (puntos de habilidad y fragmentos de estigma) no salen aquí: dílos tú. Nv. del cliente = hab + arm. Fr = dae y no va dentro del Nv. pantalla = Nv. + dae. No restes el dae. Tope de hab 10, estigma 20. Coste del rango hab (no de la pantalla): 2-4=1, 5-7=2, 8-10=4. Estigma: 1-5=1, 6-10=2, 11-15=4, 16-20=8. Activa: specs en pantalla 8/12/20. Estigma: propiedades en 5/10/15/20. puesto = estigma en ranura.",
    en: "Free skill points and stigma shards are not here: say them yourself. Client Lv. = skill + armor. Fr = dae and is not inside that Lv. screen = Lv. + dae. Do not subtract dae. Skill cap 10, stigma 20. Cost of the skill rank (not the screen number): 2-4=1, 5-7=2, 8-10=4. Stigma: 1-5=1, 6-10=2, 11-15=4, 16-20=8. Active specs at screen 8/12/20. Stigma properties at 5/10/15/20. slotted = stigma in a slot."
  },
  "juego.json_copiar": { es: "Copiar JSON NC", en: "Copy NC JSON" },
  "juego.json_descargar": { es: "Descargar JSON", en: "Download JSON" },
  "juego.json_hint": {
    es: "Exporta todos los datos que NCSOFT publica de este personaje (para pegarlos en una IA o guardarlos).",
    en: "Export all data NCSOFT publishes for this character (to paste into an AI or save)."
  },
  "juego.json_aviso": {
    es: "Datos publicados por NCSOFT vía Orden Celeste. nivel = hab + daevanion + armadura. El Nv. del cliente ya incluye la armadura y no el Daevanion (Fr). No restes el dae. Especializaciones elegidas, barra y macro no vienen en la API.",
    en: "Data published by NCSOFT via Orden Celeste. nivel = skill + daevanion + armor. The client Lv. already includes armor and not Daevanion (Fr). Do not subtract dae. Chosen specializations, hotbar and macro are not in the API."
  },
  "juego.json_nivel": {
    es: "Nivel efectivo: hab + daevanion + armadura. El Nv. del cliente es hab + armadura; el Fr es el Daevanion, aparte.",
    en: "Effective level: skill + daevanion + armor. The client Lv. is skill + armor; Fr is Daevanion, on top."
  },
  "juego.json_hab": { es: "Puntos gastados. El Nv. del cliente menos la armadura.", en: "Points spent. Client Lv. minus armor." },
  "juego.json_dae": { es: "Niveles que dan los nodos de Daevanion abiertos.", en: "Levels from open Daevanion nodes." },
  "juego.json_arm": { es: "Niveles que dan las líneas de habilidad del equipo.", en: "Levels from gear skill lines." },
  "juego.json_origen": {
    es: "Texto ya hecho. Úsalo tal cual; no sumes ni restes.",
    en: "Ready-made text. Use it as-is; do not add or subtract."
  },
  "juego.json_bonus": { es: "Mapa solo de Daevanion, por id de habilidad. Ya está volcado en habilidades[].daevanion.", en: "Daevanion-only map, by skill id. Already copied into habilidades[].daevanion." },
  "juego.json_bonus_eq": { es: "Mapa solo del equipo, por id de habilidad. Ya está volcado en habilidades[].armadura.", en: "Gear-only map, by skill id. Already copied into habilidades[].armadura." },
  "juego.json_copiado": { es: "JSON NC copiado al portapapeles", en: "NC JSON copied to clipboard" },
  "juego.json_descargado": { es: "JSON NC descargado", en: "NC JSON downloaded" },
  "juego.json_error": { es: "No se pudo copiar el JSON", en: "Couldn't copy the JSON" },
  "juego.ver": { es: "Ver build del juego", en: "View in-game build" },
  "juego.mostrar": {
    es: "Dejar ver mi equipo a quien abra esta ficha",
    en: "Let visitors see my in-game gear on this profile"
  },
  "juego.mostrar_aviso": {
    es: "Solo enseña armas/armadura. No publica la build. Primero publica con el interruptor de arriba.",
    en: "Only shows weapons/armor. Does not publish the build. Publish with the toggle above first."
  },
  "juego.mostrar_aviso_ficha": {
    es: "Solo enseña el equipo en esta ficha. Para salir en Builds, abre o crea una build abajo.",
    en: "Only shows gear on this profile. To appear on Builds, open or create a build below."
  },
  "juego.mostrar_bloqueado": {
    es: "Primero publica la build (interruptor de arriba). Luego podrás mostrar el equipo.",
    en: "Publish the build first (toggle above). Then you can show gear."
  },
  "juego.publicar_ficha_tit": {
    es: "Esto es la ficha del juego, no una build",
    en: "This is the in-game profile, not a build"
  },
  "juego.publicar_ficha_txt": {
    es: "Para que salga en Builds, abre una build tuya (o crea una nueva) y actívala como pública ahí.",
    en: "To appear on Builds, open one of your builds (or create one) and turn Public on there."
  },
  "juego.nueva_publicar": {
    es: "Crear build de este personaje",
    en: "Create a build from this character"
  },
  "juego.json_mas": { es: "Más opciones JSON", en: "More JSON options" },
  "juego.en_juego": { es: "En el juego", en: "In game" },
  "juego.esta": { es: "Esta build", en: "This build" },
  "juego.contra": { es: "Comparar con", en: "Compare with" },
  "juego.equipo": { es: "Equipo puesto", en: "Equipped gear" },
  "juego.daevanion": { es: "Daevanion", en: "Daevanion" },
  "juego.habilidades": { es: "Habilidades", en: "Skills" },
  "juego.estigmas": { es: "Estigmas", en: "Stigmas" },
  "juego.aviso_dps": { es: "El daño por segundo lo calcula el servidor del juego y no sale en la ficha. Aquí ves qué sube y qué baja: habilidades, estigmas, Daevanion y el equipo que llevas ahora.", en: "Damage per second is calculated by the game server and is not in the profile. Here you see what goes up and what goes down: skills, stigmas, Daevanion and the gear you are wearing." },
  "juego.aviso_esp": { es: "Las especializaciones no salen en la ficha. Solo están en tus builds.", en: "Specializations are not in the profile. They only exist on your builds." },
  "juego.sin_dif": { es: "Habilidades, estigmas y Daevanion coinciden con lo que llevas puesto.", en: "Skills, stigmas and Daevanion match what you have equipped." },
  "juego.frase_hab": { es: "Esta build sube {mas} habilidades y baja {menos}.", en: "This build raises {mas} skills and lowers {menos}." },
  "juego.frase_hab_mas": { es: "Esta build sube {mas} habilidades respecto a lo que llevas puesto.", en: "This build raises {mas} skills above what you have equipped." },
  "juego.frase_hab_menos": { es: "Esta build baja {menos} habilidades respecto a lo que llevas puesto.", en: "This build lowers {menos} skills below what you have equipped." },
  "juego.frase_est": { es: "Estigmas: {mas} solo en la build, {menos} solo en el juego.", en: "Stigmas: {mas} only on the build, {menos} only in game." },
  "juego.frase_est_mas": { es: "Estigmas: {mas} solo en la build.", en: "Stigmas: {mas} only on the build." },
  "juego.frase_est_menos": { es: "Estigmas: {menos} solo en el juego.", en: "Stigmas: {menos} only in game." },
  "juego.frase_nodos": { es: "Daevanion: {mas} nodos que no llevas abiertos y {menos} que sí llevas y esta build no.", en: "Daevanion: {mas} nodes you don't have open, and {menos} you have open that this build skips." },
  "juego.frase_nodos_mas": { es: "Daevanion: {mas} nodos que no llevas abiertos.", en: "Daevanion: {mas} nodes you don't have open." },
  "juego.frase_nodos_menos": { es: "Daevanion: {menos} nodos que sí llevas abiertos y esta build no.", en: "Daevanion: {menos} nodes you have open that this build skips." },
  "juego.frase_stats": { es: "Con ese tablero ganas {gana} y pierdes {pierde}.", en: "With that board you gain {gana} and lose {pierde}." },
  "juego.frase_stats_gana": { es: "Con ese tablero ganas {gana}.", en: "With that board you gain {gana}." },
  "juego.frase_stats_pierde": { es: "Con ese tablero pierdes {pierde}.", en: "With that board you lose {pierde}." },
  "juego.frase_equipo": { es: "El equipo puesto no forma parte de la build. Ahora mismo suma {ataque} de ataque y {crit} de crítico.", en: "Worn gear is not part of the build. Right now it adds {ataque} attack and {crit} critical." },
  "juego.sin_detalle": { es: "De {n} piezas no se ha podido leer el detalle.", en: "Detail could not be read for {n} pieces." },
  "juego.base": { es: "sin el extra de Daevanion", en: "without the Daevanion bonus" },
  "juego.extra": { es: "extra de Daevanion", en: "Daevanion bonus" },
  "juego.preset": { es: "Preset", en: "Preset" },
  "juego.lado_build": { es: "Esta build", en: "This build" },
  "juego.lado_juego": { es: "En el juego", en: "In game" },
  "juego.lado_pj": { es: "Mis personajes", en: "My characters" },
  "juego.lado_otro": { es: "Otro jugador…", en: "Another player…" },
  "juego.vs": { es: "contra", en: "vs" },
  "juego.cambiar_lados": { es: "Intercambiar lados", en: "Swap sides" },
  "juego.elige_lado": { es: "Elige con qué comparar.", en: "Choose what to compare with." },
  "juego.pasando": { es: "Si pasaras de {a} a {b}:", en: "If you went from {a} to {b}:" },
  "juego.cmp_stats": { es: "Estadísticas", en: "Stats" },
  "juego.cmp_equipo": { es: "Equipo pieza a pieza", en: "Gear slot by slot" },
  "juego.cmp_habs": { es: "Habilidades y estigmas", en: "Skills and stigmas" },
  "juego.cmp_dae": { es: "Daevanion", en: "Daevanion" },
  "juego.cmp_mas": { es: "Ver el resto ({n})", en: "See the rest ({n})" },
  "juego.sin_pieza": { es: "Vacío", en: "Empty" },
  "juego.sin_equipo_lado": { es: "Este lado no tiene equipo.", en: "This side has no gear." },
  "juego.eq_igual": { es: "Misma pieza", en: "Same piece" },
  "juego.solo_stats_eq": { es: "del equipo", en: "from gear" },
  "juego.solo_stats_dae": { es: "del Daevanion", en: "from Daevanion" },
  "juego.frase_cmp_stats": { es: "Ganarías {gana} y perderías {pierde}.", en: "You would gain {gana} and lose {pierde}." },
  "juego.frase_cmp_stats_gana": { es: "Ganarías {gana}.", en: "You would gain {gana}." },
  "juego.frase_cmp_stats_pierde": { es: "Perderías {pierde}.", en: "You would lose {pierde}." },
  "juego.frase_cmp_hab": { es: "{mas} habilidades subirían y {menos} bajarían.", en: "{mas} skills would go up and {menos} down." },
  "juego.frase_cmp_hab_mas": { es: "{mas} habilidades subirían.", en: "{mas} skills would go up." },
  "juego.frase_cmp_hab_menos": { es: "{menos} habilidades bajarían.", en: "{menos} skills would go down." },
  "juego.frase_cmp_eq": { es: "{n} ranuras de equipo cambian.", en: "{n} gear slots change." },
  "juego.nv_hab": { es: "Nv. {n}", en: "Lv. {n}" },
  "juego.buscando_ficha": { es: "Leyendo a {nombre}…", en: "Reading {nombre}…" },
  "juego.nodos": { es: "nodos", en: "nodes" },
  "juego.clase_distinta": { es: "{nombre} es {clase} en {servidor}. ¿Crear una build de esa clase, ya rellena con lo que lleva puesto?", en: "{nombre} is a {clase} on {servidor}. Create a build of that class, filled with what they have equipped?" },

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
  "err.captcha": { es: "Completa la verificación anti-bots e inténtalo de nuevo.", en: "Complete the anti-bot check and try again." },
  "err.bot": { es: "No se pudo crear la cuenta. Recarga la página e inténtalo de nuevo.", en: "Couldn't create the account. Reload the page and try again." },
  "auth.humano": { es: "¿Cuánto es {q}?", en: "What is {q}?" },
  "auth.humano_ayuda": { es: "Anti-bots: escribe el resultado.", en: "Anti-bot: type the result." },
  "err.nombre_vacio": { es: "Ponle un nombre a la build.", en: "Give the build a name." },
  "err.no_autenticado": { es: "Tienes que entrar con tu cuenta.", en: "You need to sign in." },
  "err.sin_permiso": { es: "No tienes permiso para hacer eso.", en: "You don't have permission to do that." },
  "err.expulsado": { es: "Tu cuenta está suspendida temporalmente.", en: "Your account is temporarily suspended." },
  "err.texto_vacio": { es: "El texto no es válido o se pasa de largo.", en: "The text is empty or too long." },
  "err.tema_cerrado": { es: "Este tema está cerrado.", en: "This thread is closed." },
  "err.ya_denunciado": { es: "Ya habías avisado de esto.", en: "You already reported this." },
  "err.no_existe": { es: "No se ha encontrado.", en: "Not found." },
  "err.clase_distinta": { es: "Ese personaje es de otra clase.", en: "That character is a different class." },
  "err.clase_no_soportada": { es: "Esa clase todavía no está en la web.", en: "That class is not on the site yet." },
  "err.juego_no_disponible": { es: "La ficha del juego no responde ahora. Prueba dentro de un momento.", en: "The game profile is not responding right now. Try again in a moment." },
  "err.busqueda_corta": { es: "Escribe al menos 2 letras del nombre.", en: "Type at least 2 letters of the name." },
  "err.servidor_invalido": { es: "Elige un servidor válido.", en: "Choose a valid server." },
  "err.generico": { es: "Algo ha fallado. Inténtalo de nuevo.", en: "Something went wrong. Try again." },

  "foro.titulo": { es: "Foro de la legión", en: "Legion forum" },
  "foro.aviso": { es: "Se lee sin entrar. Para abrir un tema o responder hay que tener cuenta.", en: "Anyone can read. Opening a thread or replying needs an account." },
  "foro.nuevo": { es: "Nuevo tema", en: "New thread" },
  "foro.titulo_tema": { es: "Título", en: "Title" },
  "foro.texto": { es: "Mensaje", en: "Message" },
  "foro.publicar": { es: "Publicar", en: "Post" },
  "foro.responder": { es: "Responder", en: "Reply" },
  "foro.vacio": { es: "Todavía no hay temas aquí.", en: "No threads here yet." },
  "foro.respuestas": { es: "mensajes", en: "posts" },
  "foro.cerrado": { es: "Cerrado", en: "Closed" },
  "foro.fijado": { es: "Fijado", en: "Pinned" },
  "foro.cerrado_aviso": { es: "Este tema está cerrado.", en: "This thread is closed." },
  "foro.entrar": { es: "Entra para participar", en: "Sign in to take part" },
  "foro.denunciar": { es: "Avisar", en: "Report" },
  "foro.denuncia_motivo": { es: "¿Por qué avisas? Se lo verá el equipo de la legión.", en: "Why are you reporting this? The legion team will see it." },
  "foro.denuncia_ok": { es: "Aviso enviado", en: "Report sent" },
  "foro.citar": { es: "Citar", en: "Quote" },
  "foro.cat_avisos": { es: "Avisos", en: "Announcements" },
  "foro.cat_clases": { es: "Clases", en: "Classes" },
  "foro.cat_grupos": { es: "Grupos", en: "Groups" },
  "foro.cat_reclutamiento": { es: "Reclutamiento", en: "Recruitment" },
  "foro.cat_offtopic": { es: "Off-topic", en: "Off-topic" },
  "foro.avisos_solo": { es: "Los avisos los publican los administradores.", en: "Announcements are posted by admins." },
  "foro.solo_staff": { es: "Solo el staff (moderadores y admins) puede abrir temas aquí.", en: "Only staff (moderators and admins) can open threads here." },
  "foro.solo_admin": { es: "Solo administradores pueden abrir temas aquí.", en: "Only admins can open threads here." },
  "err.cat_existe": { es: "Ya existe una sección con ese id.", en: "A section with that id already exists." },
  "super.foro": { es: "Secciones del foro", en: "Forum sections" },
  "super.foro_txt": {
    es: "Crea o edita secciones. Quién puede abrir temas nuevos: Todos, Staff (mod+) o Solo admin. Desactivar oculta la sección sin borrar temas.",
    en: "Create or edit sections. Who can open new threads: Everyone, Staff (mod+) or Admin only. Deactivating hides the section without deleting threads."
  },
  "super.foro_id": { es: "Id (a-z, 0-9, _)", en: "Id (a-z, 0-9, _)" },
  "super.foro_nombre_es": { es: "Nombre ES", en: "Name ES" },
  "super.foro_nombre_en": { es: "Nombre EN", en: "Name EN" },
  "super.foro_desc_es": { es: "Descripción ES", en: "Description ES" },
  "super.foro_desc_en": { es: "Descripción EN", en: "Description EN" },
  "super.foro_escribir": { es: "Quién escribe", en: "Who can post" },
  "super.foro_todos": { es: "Todos", en: "Everyone" },
  "super.foro_staff": { es: "Staff (mod+)", en: "Staff (mod+)" },
  "super.foro_admin": { es: "Solo admin", en: "Admin only" },
  "super.foro_orden": { es: "Orden", en: "Order" },
  "super.foro_icono": { es: "Icono", en: "Icon" },
  "super.foro_activa": { es: "Activa", en: "Active" },
  "super.foro_crear": { es: "Crear sección", en: "Create section" },
  "super.foro_temas": { es: "temas", en: "threads" },

  "chat.titulo": { es: "Chat de la legión", en: "Legion chat" },
  "chat.aviso": { es: "La sala se lee sin entrar. Para hablar hay que tener cuenta. Los mensajes se guardan 14 días.", en: "Anyone can read the room. Talking needs an account. Messages are kept for 14 days." },
  "chat.placeholder": { es: "Escribe a la legión…", en: "Message the legion…" },
  "chat.enviar": { es: "Enviar", en: "Send" },
  "chat.vacio": { es: "Todavía no hay mensajes.", en: "No messages yet." },
  "chat.entrar": { es: "Entra para hablar", en: "Sign in to talk" },

  "panel.titulo": { es: "Panel de moderación", en: "Moderation panel" },
  "panel.antetitulo": { es: "Staff", en: "Staff" },
  "panel.sub": { es: "Entraste como {rol}. Revisa la cola, oculta desde el chat/foro y actúa rápido.", en: "Signed in as {rol}. Clear the queue, hide from chat/forum, and act fast." },
  "panel.pendiente": { es: "Pendiente", en: "Pending" },
  "panel.atajos": { es: "¿Qué quieres hacer?", en: "What do you want to do?" },
  "panel.atajo_builds": { es: "Tus builds y personajes vinculados", en: "Your builds and linked characters" },
  "panel.atajo_chat": { es: "Hablar con la legión", en: "Talk with the legion" },
  "panel.atajo_foro": { es: "Temas y anuncios", en: "Threads and announcements" },
  "panel.atajo_tops": { es: "Ranking comunitario", en: "Community ranking" },
  "panel.atajo_espia": { es: "Mirar builds de otros", en: "Scout other builds" },
  "panel.atajo_noticias": { es: "Parches y avisos oficiales", en: "Patches and official news" },
  "panel.denuncias_txt": { es: "Si alguien marca un mensaje o chat, aparece aquí. Ocúltalo o márcalo visto.", en: "When someone flags a post or chat, it shows here. Hide it or mark it reviewed." },
  "panel.chat_txt": { es: "Últimos mensajes: oculta lo que no deba verse en público.", en: "Latest messages: hide anything that shouldn't stay public." },
  "panel.chat_vacio": { es: "Aún no hay mensajes recientes.", en: "No recent messages yet." },
  "panel.ir_chat": { es: "Abrir chat →", en: "Open chat →" },
  "panel.herramientas": { es: "Herramientas avanzadas", en: "Advanced tools" },
  "panel.mod_txt": { es: "Pon el ID del tema del foro y elige cerrar, ocultar o fijar.", en: "Enter the forum thread ID and choose close, hide, or pin." },
  "panel.mod": { es: "Moderar tema del foro", en: "Moderate forum thread" },
  "panel.gente": { es: "Gente", en: "People" },
  "panel.denuncias": { es: "Avisos de los miembros", en: "Member reports" },
  "panel.sin_denuncias": { es: "Nada pendiente: buen trabajo.", en: "Nothing pending — nice." },
  "panel.chat_reciente": { es: "Chat reciente", en: "Recent chat" },
  "panel.ocultar": { es: "Ocultar", en: "Hide" },
  "panel.mostrar": { es: "Mostrar", en: "Show" },
  "panel.cerrar": { es: "Cerrar tema", en: "Close thread" },
  "panel.abrir": { es: "Reabrir tema", en: "Reopen thread" },
  "panel.fijar": { es: "Fijar", en: "Pin" },
  "panel.soltar": { es: "Quitar fijado", en: "Unpin" },
  "panel.resolver": { es: "Marcar visto", en: "Mark reviewed" },
  "panel.oculto": { es: "oculto", en: "hidden" },
  "panel.rol": { es: "Rol", en: "Role" },
  "panel.guardar": { es: "Guardar", en: "Save" },
  "panel.suspension": { es: "Suspensión (días, 0 la quita)", en: "Suspension (days, 0 clears it)" },
  "panel.tu": { es: "tú", en: "you" },
  "panel.ok": { es: "Hecho", en: "Done" },
  "panel.rol_usuario": { es: "Miembro", en: "Member" },
  "panel.rol_moderador": { es: "Moderador", en: "Moderator" },
  "panel.rol_admin": { es: "Admin", en: "Admin" },
  "panel.rol_superadmin": { es: "Superadmin", en: "Superadmin" },
  "panel.roles_titulo": { es: "Qué puede cada rol", en: "What each role can do" },
  "panel.roles_txt": {
    es: "Roles fijos. Moderador no gestiona equipo. Admin sube/baja moderadores. Superadmin gestiona admins, Discord, bot y puede borrar cuentas.",
    en: "Fixed roles. Moderators don't manage the team. Admins promote/demote moderators. Superadmin manages admins, Discord, bot and can delete accounts."
  },
  "panel.rol_usuario_txt": {
    es: "Cuenta normal: builds, chat, foro, Espía. Sin Panel.",
    en: "Normal account: builds, chat, forum, Spy. No Panel."
  },
  "panel.rol_moderador_txt": {
    es: "Panel: ocultar chat/foro, cerrar temas, cola de avisos; suspender miembros (hasta 7 días). No gestiona roles.",
    en: "Panel: hide chat/forum, close threads, review queue; suspend members (up to 7 days). Can't manage roles."
  },
  "panel.rol_admin_txt": {
    es: "Como moderador + fijar temas y categoría Avisos; dar de alta/bajar moderadores y suspenderlos (hasta 30 días). No crea admins ni borra cuentas.",
    en: "Like moderator + pin threads and Announcements; promote/demote moderators and suspend them (up to 30 days). Can't create admins or delete accounts."
  },
  "panel.rol_superadmin_txt": {
    es: "Dueño: gestiona admins y mods, Discord, bot, tráfico; puede borrar cuentas. No se puede degradar desde la web.",
    en: "Owner: manages admins and mods, Discord, bot, traffic; can delete accounts. Can't be demoted from the site."
  },
  "panel.matriz_mod": {
    es: "Chat/foro, cola, suspender miembros (hasta 7 días). Sin gestión de roles.",
    en: "Chat/forum, queue, suspend members (up to 7 days). No role management."
  },
  "panel.matriz_admin": {
    es: "Lo de moderador + fijar/Avisos + subir, bajar y suspender moderadores (hasta 30 días).",
    en: "Moderator powers + pin/Announcements + promote, demote and suspend moderators (up to 30 days)."
  },
  "panel.matriz_super": {
    es: "Lo de admin + gestionar admins, Discord, bot, tráfico y borrar cuentas.",
    en: "Admin powers + manage admins, Discord, bot, traffic and delete accounts."
  },
  "panel.equipo": { es: "Equipo", en: "Team" },
  "panel.equipo_admin": { es: "Equipo (moderadores)", en: "Team (moderators)" },
  "panel.solo_super": { es: "Superadmin", en: "Superadmin" },
  "panel.equipo_txt": {
    es: "Staff actual abajo. Busca un miembro (mín. 2 letras) para subirlo a moderador o admin. Superadmin no se puede bajar aquí. Borrar cuenta: solo tú.",
    en: "Current staff below. Search a member (min. 2 letters) to promote to moderator or admin. Superadmin can't be demoted here. Delete account: you only."
  },
  "panel.equipo_admin_txt": {
    es: "Busca un miembro para subirlo a moderador, o baja a un mod a miembro. No puedes tocar admins ni borrar cuentas.",
    en: "Search a member to promote to moderator, or demote a mod to member. You can't touch admins or delete accounts."
  },
  "panel.equipo_buscar": { es: "Buscar usuario…", en: "Search username…" },
  "panel.equipo_buscar_txt": { es: "Escribe al menos 2 letras. No hace falta cargar miles de cuentas.", en: "Type at least 2 letters. No need to load thousands of accounts." },
  "panel.equipo_staff": { es: "Staff actual", en: "Current staff" },
  "panel.equipo_resultados": { es: "Resultados", en: "Results" },
  "panel.equipo_min": { es: "Escribe al menos 2 letras para buscar.", en: "Type at least 2 letters to search." },
  "panel.equipo_vacio": { es: "Nadie con ese nombre.", en: "No one with that name." },
  "panel.equipo_vacio_staff": { es: "Aún no hay moderadores. Busca un miembro para darlo de alta.", en: "No moderators yet. Search a member to promote." },
  "panel.borrar_cuenta": { es: "Borrar cuenta", en: "Delete account" },
  "panel.borrar_cuenta_ok": {
    es: "¿Borrar DEFINITIVAMENTE la cuenta de {user}? Escribe BORRAR para confirmar.",
    en: "Permanently delete {user}'s account? Type DELETE to confirm."
  },
  "panel.hint_rol": { es: "Este rol: {txt}", en: "This role: {txt}" },
  "panel.herramientas_txt": { es: "Moderar un tema del foro por su ID", en: "Moderate a forum thread by its ID" },
  "panel.kpi_total": { es: "Pendientes", en: "Pending" },
  "panel.kpi_bot": { es: "Bot", en: "Bot" },
  "panel.kpi_denuncias": { es: "Avisos", en: "Reports" },
  "panel.cola": { es: "Para revisar", en: "Review queue" },
  "panel.cola_txt": { es: "Avisos de miembros y detecciones del bot. Actúa o marca como visto.", en: "Member reports and bot hits. Act or mark reviewed." },
  "panel.cola_vacia": { es: "Cola limpia. Nada pendiente.", en: "Queue clear. Nothing pending." },
  "panel.filtro_todos": { es: "Todos", en: "All" },
  "panel.filtro_bot": { es: "Bot", en: "Bot" },
  "panel.filtro_denuncia": { es: "Miembros", en: "Members" },
  "panel.origen_bot": { es: "Bot", en: "Bot" },
  "panel.origen_denuncia": { es: "Aviso", en: "Report" },
  "panel.origen_flood": { es: "Flood", en: "Flood" },
  "panel.dejar": { es: "Dejar", en: "Keep" },
  "panel.suspender": { es: "Suspender", en: "Suspend" },
  "panel.suspender_dias": { es: "Días de suspensión (1–{max})", en: "Suspension days (1–{max})" },
  "panel.avisado_por": { es: "avisado por", en: "reported by" },
  "super.antetitulo": { es: "Privado", en: "Private" },
  "super.titulo": { es: "Panel superadmin", en: "Superadmin panel" },
  "super.sub": { es: "Roles, Discord, visitas y reglas del bot. Un compañero en el Panel de moderación no ve esto.", en: "Roles, Discord, visits and bot rules. Someone on the mod Panel won't see this." },
  "super.ir_panel": { es: "Ir al Panel de moderación", en: "Go to moderation Panel" },
  "super.visitas": { es: "Tráfico", en: "Traffic" },
  "super.visitas_txt": { es: "Entradas a la web (escaparate y principal). Útiles para medir audiencia antes de publicidad. Un mismo visitante no cuenta más de una vez cada 30 minutos por página.", en: "Site entries (showcase and main). Useful to gauge audience before ads. The same visitor isn't counted more than once every 30 minutes per page." },
  "super.visitas_total": { es: "Visitas totales", en: "Total visits" },
  "super.visitas_unicos": { es: "Únicos (suma diaria)", en: "Uniques (daily sum)" },
  "super.visitas_hoy": { es: "Hoy", en: "Today" },
  "super.visitas_semana": { es: "Últimos 7 días", en: "Last 7 days" },
  "super.visitas_por_dia": { es: "Por día", en: "By day" },
  "super.visitas_por_ruta": { es: "Páginas más vistas", en: "Top pages" },
  "super.visitas_hits": { es: "hits", en: "hits" },
  "super.visitas_vacio": { es: "Aún no hay datos de visitas.", en: "No visit data yet." },
  "super.bot": { es: "Bot de moderación", en: "Moderation bot" },
  "super.bot_txt": { es: "Añade o quita palabras. Bloquear = no se envía. Revisar = se publica y entra en la cola del Panel.", en: "Add or remove words. Block = not sent. Review = published and queued for the Panel." },
  "super.patron": { es: "Palabra o frase…", en: "Word or phrase…" },
  "super.nota": { es: "Etiqueta (estafa…)", en: "Label (scam…)" },
  "super.accion_bloquear": { es: "Bloquear", en: "Block" },
  "super.accion_revisar": { es: "Revisar", en: "Review" },
  "super.ambito_ambos": { es: "Chat + foro", en: "Chat + forum" },
  "super.ambito_chat": { es: "Solo chat", en: "Chat only" },
  "super.ambito_foro": { es: "Solo foro", en: "Forum only" },
  "super.anadir": { es: "Añadir regla", en: "Add rule" },
  "super.activar": { es: "Activar", en: "Enable" },
  "super.desactivar": { es: "Pausar", en: "Pause" },
  "super.borrar": { es: "Borrar", en: "Delete" },
  "super.borrar_ok": { es: "¿Borrar esta regla?", en: "Delete this rule?" },
  "panel.tipo_tema": { es: "Tema", en: "Thread" },
  "panel.tipo_mensaje": { es: "Mensaje", en: "Post" },
  "panel.tipo_chat": { es: "Chat", en: "Chat" },
  "panel.juego": { es: "Avisos del juego", en: "Game alerts" },
  "panel.juego_txt": { es: "Lo que la web ha detectado en la web oficial y conviene revisar.", en: "What the site picked up from the official site and is worth a look." },
  "panel.hab_nuevas": { es: "habilidades que la web aún no conoce", en: "skills the site does not know yet" },
  "panel.discord_txt": { es: "Cuando tengáis el servidor, pon aquí el ID y la invitación. Mientras esté vacío, no se ve nada en la web.", en: "Once you have the server, paste its ID and invite here. While empty, nothing shows on the site." },
  "panel.discord_id": { es: "ID del servidor", en: "Server ID" },
  "panel.discord_voz": { es: "Mostrar acceso a voz", en: "Show voice access" },

  "nav.noticias": { es: "Noticias", en: "News" },
  "noticias.titulo": { es: "Noticias de AION 2", en: "AION 2 news" },
  "noticias.antetitulo": { es: "Mantenimientos y parches oficiales", en: "Official maintenance and patches" },
  "noticias.sub": { es: "Lo esencial si no puedes entrar: avisos de mantenimiento y notas de parche, copiados de la web oficial. Se actualizan cada 15 minutos.", en: "What matters when you can't log in: maintenance notices and patch notes from the official site. Updated every 15 minutes." },
  "noticias.todas": { es: "Todas", en: "All" },
  "noticias.utiles": { es: "Útiles", en: "Useful" },
  "noticias.t_notice": { es: "Avisos", en: "Notices" },
  "noticias.t_update": { es: "Actualizaciones", en: "Updates" },
  "noticias.t_movie_clip": { es: "Vídeos", en: "Videos" },
  "noticias.en_ingles": { es: "En inglés", en: "In English" },
  "noticias.en_ingles_largo": { es: "NCSOFT solo ha publicado esta noticia en inglés.", en: "NCSOFT only published this in English." },
  "noticias.ultimo_parche": { es: "Último parche", en: "Latest patch" },
  "noticias.estado_aviso": { es: "Último aviso", en: "Latest notice" },
  "noticias.estado_parche": { es: "Último parche", en: "Latest patch" },
  "noticias.mantenimiento": { es: "Mantenimiento", en: "Maintenance" },
  "noticias.sin_dato": { es: "Sin novedades recientes", en: "No recent items" },
  "noticias.web_oficial": { es: "Web oficial", en: "Official site" },
  "noticias.cronica": { es: "Crónica de actualizaciones", en: "Update chronicle" },
  "noticias.fuente": { es: "Fuente: web oficial de AION 2 (NCSOFT)", en: "Source: official AION 2 site (NCSOFT)" },
  "noticias.ver_original": { es: "Ver en la web oficial", en: "View on the official site" },
  "noticias.comentar": { es: "Comentarlo en el foro", en: "Discuss it on the forum" },
  "noticias.vacio": { es: "Todavía no hay noticias. Vuelve en un momento.", en: "No news yet. Check back in a moment." },
  "noticias.ver_todas": { es: "Ver todas las noticias", en: "See all news" },

  "foro.antetitulo": { es: "Comunidad Orden Celeste", en: "Orden Celeste community" },
  "foro.cat_presentaciones": { es: "Presentaciones", en: "Introductions" },
  "foro.cat_builds": { es: "Builds", en: "Builds" },
  "foro.desc_avisos": { es: "Lo que tiene que saber toda la legión.", en: "What the whole legion needs to know." },
  "foro.desc_presentaciones": { es: "Di hola: quién eres, qué clase juegas, a qué hora sueles entrar.", en: "Say hi: who you are, what you play, when you are usually on." },
  "foro.desc_clases": { es: "Dudas y trucos de cada clase.", en: "Questions and tips for each class." },
  "foro.desc_builds": { es: "Enseña tu build y pide opinión. Pega el enlace y sale la tarjeta.", en: "Show your build and ask for feedback. Paste the link and the card appears." },
  "foro.desc_grupos": { es: "Mazmorras, jefes y quedadas.", en: "Dungeons, bosses and meetups." },
  "foro.desc_reclutamiento": { es: "¿Quieres entrar en Orden Celeste? Empieza aquí.", en: "Want to join Orden Celeste? Start here." },
  "foro.desc_offtopic": { es: "Todo lo demás.", en: "Everything else." },
  "foro.d_temas": { es: "temas", en: "threads" },
  "foro.d_mensajes": { es: "mensajes", en: "posts" },
  "foro.d_miembros": { es: "miembros", en: "members" },
  "foro.d_conectados": { es: "en línea", en: "online" },
  "foro.sin_temas": { es: "Sin temas todavía", en: "No threads yet" },
  "foro.vistas": { es: "vistas", en: "views" },
  "foro.d_respuestas": { es: "respuestas", en: "replies" },
  "foro.ahora": { es: "ahora", en: "now" },
  "foro.mod": { es: "Mod", en: "Mod" },
  "foro.gremio_tit": { es: "Tiene un personaje vinculado de la legión Orden Celeste", en: "Has a linked character in the Orden Celeste legion" },
  "foro.editado": { es: "editado", en: "edited" },
  "foro.editar": { es: "Editar", en: "Edit" },
  "foro.reaccionar": { es: "Reaccionar", en: "React" },
  "foro.denunciar_tema": { es: "Avisar de este tema", en: "Report this thread" },
  "foro.negrita": { es: "Negrita", en: "Bold" },
  "foro.cursiva": { es: "Cursiva", en: "Italic" },
  "foro.texto_ejemplo": { es: "texto", en: "text" },
  "foro.ayuda_formato": { es: "**negrita** · *cursiva* · > cita · @usuario · pega el enlace de una build", en: "**bold** · *italic* · > quote · @user · paste a build link" },

  "chat.antetitulo": { es: "En directo", en: "Live" },
  "chat.placeholder_sala": { es: "Escribe en {sala}…", en: "Message {sala}…" },
  "chat.conectados": { es: "En línea", en: "Online" },
  "chat.nadie": { es: "Ahora mismo no hay nadie más.", en: "Nobody else right now." },
  "chat.respondiendo": { es: "Respondiendo a", en: "Replying to" },
  "chat.sala_general": { es: "General", en: "General" },
  "chat.sala_grupos": { es: "Busco grupo", en: "LFG" },
  "chat.sala_clases": { es: "Clases", en: "Classes" },
  "chat.sala_comercio": { es: "Comercio", en: "Trade" },
  "chat.sala_offtopic": { es: "Off-topic", en: "Off-topic" },
  "chat.sala_gremio": { es: "Solo legión", en: "Legion only" },
  "chat.sala_foro": { es: "En el foro", en: "On the forum" },
  "chat.desc_general": { es: "Charla de toda la legión.", en: "Chat for the whole legion." },
  "chat.desc_grupos": { es: "Monta un grupo y que se apunte la gente.", en: "Post a group and let people sign up." },
  "chat.desc_clases": { es: "Dudas rápidas de clases y builds.", en: "Quick class and build questions." },
  "chat.desc_comercio": { es: "Compra, venta e intercambio.", en: "Buy, sell and trade." },
  "chat.desc_offtopic": { es: "Lo que no es del juego.", en: "Anything not about the game." },
  "chat.desc_gremio": { es: "Solo miembros verificados de Orden Celeste.", en: "Verified Orden Celeste members only." },
  "chat.gremio_tit": { es: "Solo para la legión", en: "Legion only" },
  "chat.gremio_cerrada": { es: "Esta sala es solo para la legión. Vincula en Mis builds un personaje que esté en Orden Celeste y se abre sola.", en: "This room is legion only. Link a character in the Orden Celeste legion from My builds and it opens up." },
  "chat.busco": { es: "Busco grupo", en: "Looking for group" },
  "chat.g_mazmorra": { es: "Mazmorra o jefe", en: "Dungeon or boss" },
  "chat.g_rol": { es: "Qué buscas (sanador, tanque…)", en: "Looking for (healer, tank…)" },
  "chat.g_hora": { es: "Hora (ej. 21:30)", en: "Time (e.g. 21:30)" },
  "chat.g_plazas": { es: "plazas", en: "slots" },
  "chat.g_nota": { es: "Nota opcional", en: "Optional note" },
  "chat.g_publicar": { es: "Publicar grupo", en: "Post group" },
  "chat.g_busca": { es: "Busca", en: "Needs" },
  "chat.g_libre": { es: "Plaza libre", en: "Open slot" },
  "chat.g_apuntar": { es: "Me apunto", en: "Join" },
  "chat.g_salir": { es: "Desapuntarme", en: "Leave" },
  "chat.g_lleno": { es: "Completo", en: "Full" },
  "chat.discord_entrar": { es: "Entrar al Discord", en: "Join the Discord" },
  "err.grupo_lleno": { es: "El grupo ya está completo.", en: "The group is already full." },
  "err.discord_invalido": { es: "El ID del servidor o la invitación de Discord no son válidos.", en: "The Discord server ID or invite is not valid." },
  "err.texto_filtrado": { es: "Ese mensaje no se puede enviar (filtro de la legión).", en: "That message can't be sent (legion filter)." },

  "pie.aviso": {
    es: "Orden Celeste · asmodianos Marchutan · Web de fans (EU), sin relación con NCSOFT. AION 2 y sus imágenes son de NCSOFT.",
    en: "Orden Celeste · Asmodians on Marchutan · Fan site (EU), not affiliated with NCSOFT. AION 2 and its images belong to NCSOFT."
  },

  "auth.acepto_legal": {
    es: "He leído y acepto la política de privacidad y el aviso legal.",
    en: "I have read and accept the privacy policy and legal notice."
  },
  "err.acepto_legal": {
    es: "Debes aceptar la política de privacidad para crear la cuenta.",
    en: "You must accept the privacy policy to create an account."
  },
  "err.cuenta_protegida": {
    es: "Esta cuenta del sistema no se puede borrar desde aquí.",
    en: "This system account cannot be deleted here."
  },
  "err.confirmacion_borrar": {
    es: "Escribe BORRAR (o DELETE) para confirmar.",
    en: "Type BORRAR (or DELETE) to confirm."
  },

  "mis.borrar_titulo": { es: "Borrar mi cuenta", en: "Delete my account" },
  "mis.borrar_aviso": {
    es: "Esto es irreversible. Se eliminan tu usuario, builds, personajes vinculados, votos y notificaciones.",
    en: "This cannot be undone. Your username, builds, linked characters, votes and notifications are removed."
  },
  "mis.borrar_li1": {
    es: "Mensajes del foro se anonimizan («Cuenta eliminada») para no romper hilos ajenos.",
    en: "Forum posts are anonymized (“Deleted account”) so other threads stay readable."
  },
  "mis.borrar_li2": {
    es: "El chat reciente de tu cuenta se borra.",
    en: "Your recent chat messages are deleted."
  },
  "mis.borrar_li3": {
    es: "No pedimos email: con borrar la cuenta basta para ejercer el derecho de supresión.",
    en: "We don’t ask for email: deleting the account is enough to exercise the right to erasure."
  },
  "mis.borrar_confirmar": {
    es: "Escribe BORRAR para confirmar",
    en: "Type BORRAR or DELETE to confirm"
  },
  "mis.borrar_btn": { es: "Borrar cuenta definitivamente", en: "Permanently delete account" },
  "mis.borrar_seguro": {
    es: "¿Seguro que quieres borrar tu cuenta y todos tus datos?",
    en: "Are you sure you want to delete your account and all your data?"
  },
  "mis.borrar_ok": { es: "Cuenta borrada.", en: "Account deleted." },
  "legal.ver_privacidad": { es: "Ver política de privacidad", en: "View privacy policy" },

  "legal.titulo": { es: "Información legal", en: "Legal information" },
  "legal.intro": {
    es: "Textos básicos de una web de fans sin ánimo de lucro. No sustituyen asesoramiento jurídico profesional.",
    en: "Basic texts for a non-profit fan site. They are not a substitute for professional legal advice."
  },
  "legal.actualizado": { es: "Última actualización: octubre 2026.", en: "Last updated: October 2026." },
  "legal.nav_aviso": { es: "Aviso legal", en: "Legal notice" },
  "legal.nav_privacidad": { es: "Privacidad", en: "Privacy" },
  "legal.nav_cookies": { es: "Cookies", en: "Cookies" },

  "legal.aviso_h": { es: "Aviso legal", en: "Legal notice" },
  "legal.aviso_n": { es: "7", en: "7" },
  "legal.aviso_1": {
    es: "Esta web (Orden Celeste · AION 2) es un proyecto de fans de la legión Orden Celeste. No es un servicio oficial de NCSOFT ni de sus socios.",
    en: "This site (Orden Celeste · AION 2) is a fan project of the Orden Celeste legion. It is not an official NCSOFT service or partner."
  },
  "legal.aviso_2": {
    es: "AION, AION 2, nombres de clases, personajes, logotipos e imágenes del juego son marcas o contenidos de NCSOFT / NC Company. Su uso aquí es informativo y de comunidad de fans.",
    en: "AION, AION 2, class names, characters, logos and game images are trademarks or content of NCSOFT / NC Company. Use here is informational for a fan community."
  },
  "legal.aviso_3": {
    es: "Los datos de fichas, ranking y equipo que se muestran vía Espía / Tops proceden de la API pública del juego (región EU) y pueden estar incompletos o desactualizados. No garantizamos exactitud.",
    en: "Character, ranking and gear data shown via Spy / Tops come from the public game API (EU region) and may be incomplete or outdated. Accuracy is not guaranteed."
  },
  "legal.aviso_4": {
    es: "La web se ofrece «tal cual», sin garantía de disponibilidad continua. Builds, guías y herramientas son orientativas; úsalas bajo tu propia responsabilidad en el juego.",
    en: "The site is provided “as is”, with no guarantee of continuous availability. Builds, guides and tools are indicative; use them at your own risk in-game."
  },
  "legal.aviso_5": {
    es: "El contenido publicado por usuarios (builds, foro, chat) es responsabilidad de quien lo publica. La legión puede moderar, ocultar o eliminar material abusivo, ilegal o que incumpla estas normas.",
    en: "User-published content (builds, forum, chat) is the responsibility of the poster. The legion may moderate, hide or remove abusive, illegal or non-compliant material."
  },
  "legal.aviso_6": {
    es: "Queda prohibido usar la web para estafas, RMT, phishing, acoso o cualquier actividad ilegal. El incumplimiento puede conllevar suspensión o borrado de cuenta.",
    en: "Using the site for scams, RMT, phishing, harassment or any illegal activity is forbidden. Breaches may lead to suspension or account deletion."
  },
  "legal.aviso_7": {
    es: "Contacto de la comunidad: el Discord indicado en el pie de la web (cuando esté configurado). No hay atención comercial ni soporte oficial de NC.",
    en: "Community contact: the Discord linked in the site footer (when configured). There is no commercial support or official NC support."
  },

  "legal.privacidad_h": { es: "Política de privacidad", en: "Privacy policy" },
  "legal.privacidad_n": { es: "10", en: "10" },
  "legal.privacidad_1": {
    es: "Responsable del tratamiento: la comunidad de fans Orden Celeste, que opera esta web de forma no comercial. Contacto: Discord de la legión (enlace en el pie).",
    en: "Data controller: the Orden Celeste fan community operating this non-commercial site. Contact: the legion Discord (footer link)."
  },
  "legal.privacidad_2": {
    es: "No pedimos email ni datos de identidad civil. Al registrarte solo guardamos: nombre de usuario, hash de contraseña (no la contraseña en claro), rol y fecha de alta.",
    en: "We do not ask for email or civil identity data. On sign-up we only store: username, password hash (never plain password), role and sign-up date."
  },
  "legal.privacidad_3": {
    es: "Si usas la web logueado también podemos guardar: builds, personajes vinculados (IDs públicos del juego), mensajes de foro/chat, votos a builds, denuncias de moderación y notificaciones internas.",
    en: "If you use the site signed in we may also store: builds, linked characters (public game IDs), forum/chat messages, build votes, moderation reports and internal notifications."
  },
  "legal.privacidad_4": {
    es: "Finalidad: prestar la comunidad (builds, Espía, foro, chat, tops), seguridad (anti-bots, límites de abuso) y moderación. Base: ejecución del servicio que solicitas al crear cuenta y, en su caso, interés legítimo de seguridad de la comunidad.",
    en: "Purpose: run the community (builds, Spy, forum, chat, tops), security (anti-bot, abuse limits) and moderation. Legal basis: performing the service you request by creating an account and, where needed, legitimate interest in community security."
  },
  "legal.privacidad_5": {
    es: "Datos técnicos: cookie de sesión (imprescindible para entrar), IP para límites temporales anti-abuso, y contadores de visitas agregados con una huella anónima (no identifica tu cuenta).",
    en: "Technical data: session cookie (required to sign in), IP for temporary anti-abuse limits, and aggregated visit counters with an anonymous fingerprint (not tied to your account)."
  },
  "legal.privacidad_6": {
    es: "En el registro puede usarse Cloudflare Turnstile (anti-bots). Cloudflare trata el token según su propia política. No usamos publicidad ni redes de tracking de terceros en la web.",
    en: "Registration may use Cloudflare Turnstile (anti-bot). Cloudflare processes the token under its own policy. We do not use ads or third-party tracking networks on the site."
  },
  "legal.privacidad_7": {
    es: "Encargados / alojamiento: la API y base de datos se alojan en proveedores cloud (p. ej. Render y Neon). El escaparate estático puede servirse desde GitHub Pages. Puede haber transferencia internacional; se usan proveedores habituales del sector.",
    en: "Processors / hosting: API and database run on cloud providers (e.g. Render and Neon). The static mirror may be served from GitHub Pages. International transfers may occur; common industry providers are used."
  },
  "legal.privacidad_8": {
    es: "Conservación: mientras mantengas la cuenta. Si la borras, eliminamos usuario, builds, personajes vinculados, votos y notificaciones. El foro se anonimiza («Cuenta eliminada»). El chat tuyo se borra. Agregados de visitas no personales pueden permanecer.",
    en: "Retention: while you keep the account. If you delete it, we remove username, builds, linked characters, votes and notifications. Forum posts are anonymized (“Deleted account”). Your chat is deleted. Non-personal visit aggregates may remain."
  },
  "legal.privacidad_9": {
    es: "Tus derechos (RGPD): acceso, rectificación, supresión, limitación y oposición. Puedes cambiar la contraseña y borrar la cuenta en Mis builds → Cuenta y seguridad. También puedes pedir ayuda por Discord de la legión.",
    en: "Your rights (GDPR): access, rectification, erasure, restriction and objection. You can change your password and delete the account under My builds → Account & security. You may also ask via the legion Discord."
  },
  "legal.privacidad_10": {
    es: "Si crees que el tratamiento no es correcto, puedes reclamar ante la autoridad de protección de datos de tu país (en España, la AEPD). Esta web no está dirigida a menores de 14 años; no registres una cuenta si no cumples la edad mínima legal en tu país.",
    en: "If you believe processing is unlawful, you may complain to your national data protection authority (in Spain, the AEPD). This site is not aimed at children under 14; do not register if you are below the legal minimum age in your country."
  },

  "legal.cookies_h": { es: "Cookies", en: "Cookies" },
  "legal.cookies_n": { es: "5", en: "5" },
  "legal.cookies_1": {
    es: "Usamos cookies y almacenamiento técnico estrictamente necesarios para el funcionamiento de la web. No usamos cookies de publicidad ni de analítica de terceros con fines de marketing.",
    en: "We use cookies and technical storage strictly necessary for the site to work. We do not use advertising cookies or third-party analytics for marketing."
  },
  "legal.cookies_2": {
    es: "Cookie de sesión: identifica tu login de forma segura (HTTP-only). Sin ella no puedes mantener la sesión. Caduca según la configuración del servidor (aprox. 30 días de inactividad máxima de sesión permanente).",
    en: "Session cookie: securely identifies your login (HTTP-only). Without it you cannot stay signed in. It expires per server settings (about 30 days for a permanent session)."
  },
  "legal.cookies_3": {
    es: "Preferencia de idioma: se guarda en el navegador (localStorage) para recordar ES/EN. Puedes borrarla limpiando los datos del sitio.",
    en: "Language preference: stored in the browser (localStorage) to remember ES/EN. You can clear it by wiping site data."
  },
  "legal.cookies_4": {
    es: "Cloudflare Turnstile (solo al registrarte, si está activo) puede depositar cookies técnicas propias de Cloudflare para distinguir humanos de bots.",
    en: "Cloudflare Turnstile (only on registration, when enabled) may set Cloudflare’s own technical cookies to tell humans from bots."
  },
  "legal.cookies_5": {
    es: "Al ser cookies necesarias para el servicio que pides (entrar / seguridad), no se muestra un muro de consentimiento de marketing. Más detalle en la política de privacidad.",
    en: "As these are necessary for the service you request (sign-in / security), we do not show a marketing consent wall. See the privacy policy for more detail."
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

function langDesdeUrl() {
  try {
    var p = new URLSearchParams(location.search).get("lang");
    return (p === "es" || p === "en") ? p : null;
  } catch (e) { return null; }
}
function urlConIdioma(lang, href) {
  var u = new URL(href || location.href, location.href);
  u.searchParams.set("lang", lang);
  return u.pathname + u.search + u.hash;
}
var IDIOMA = (function () {
  var deUrl = langDesdeUrl();
  if (deUrl) {
    try { localStorage.setItem("idioma", deUrl); } catch (e) {}
    return deUrl;
  }
  var guardado = null;
  try { guardado = localStorage.getItem("idioma"); } catch (e) {}
  if (guardado === "es" || guardado === "en") return guardado;
  return (navigator.language || "es").slice(0, 2) === "es" ? "es" : "en";
})();
document.documentElement.lang = IDIOMA;
if (!langDesdeUrl()) {
  try { history.replaceState(null, "", urlConIdioma(IDIOMA)); } catch (e) {}
}
(function enlacesHreflang() {
  if (!document.head) return;
  ["es", "en"].forEach(function (l) {
    var a = document.createElement("link");
    a.rel = "alternate";
    a.hreflang = l;
    a.href = new URL(urlConIdioma(l), location.origin).href;
    document.head.appendChild(a);
  });
  var def = document.createElement("link");
  def.rel = "alternate";
  def.hreflang = "x-default";
  def.href = new URL(urlConIdioma("es"), location.origin).href;
  document.head.appendChild(def);
  var can = document.createElement("link");
  can.rel = "canonical";
  can.href = new URL(urlConIdioma(IDIOMA), location.origin).href;
  document.head.appendChild(can);
})();

function _metaSet(attr, clave, valor) {
  if (!document.head || !valor) return;
  var sel = attr === "property" ? 'meta[property="' + clave + '"]' : 'meta[name="' + clave + '"]';
  var el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, clave);
    document.head.appendChild(el);
  }
  el.setAttribute("content", valor);
}
/** Completa Open Graph / Twitter a partir del title y description ya en el HTML (o overrides). */
function seoSocial(opts) {
  opts = opts || {};
  var titulo = opts.titulo || document.title || "";
  var descEl = document.querySelector('meta[name="description"]');
  var desc = opts.descripcion || (descEl && descEl.getAttribute("content")) || "";
  if (opts.titulo) document.title = opts.titulo;
  if (opts.descripcion) _metaSet("name", "description", opts.descripcion);
  if (opts.keywords) _metaSet("name", "keywords", opts.keywords);
  _metaSet("property", "og:title", titulo);
  _metaSet("property", "og:description", desc);
  _metaSet("property", "og:type", "website");
  _metaSet("property", "og:locale", IDIOMA === "en" ? "en_GB" : "es_ES");
  try { _metaSet("property", "og:url", new URL(urlConIdioma(IDIOMA), location.origin).href); } catch (e) {}
  var imgOg = opts.imagen || ((typeof WEB_PRINCIPAL !== "undefined" ? WEB_PRINCIPAL : "https://orden-celeste-aion2.onrender.com") + "/img/og-orden-celeste.jpg");
  _metaSet("property", "og:image", imgOg);
  _metaSet("property", "og:image:width", "1024");
  _metaSet("property", "og:image:height", "535");
  _metaSet("name", "twitter:card", "summary_large_image");
  _metaSet("name", "twitter:title", titulo);
  _metaSet("name", "twitter:description", desc);
  _metaSet("name", "twitter:image", imgOg);
  if (opts.robots) _metaSet("name", "robots", opts.robots);
}
try { seoSocial(); } catch (e) {}

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
  if (l !== "es" && l !== "en") return;
  try { localStorage.setItem("idioma", l); } catch (e) {}
  location.assign(urlConIdioma(l));
}
function traducirPagina(raiz) {
  (raiz || document).querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.dataset.t); });
  (raiz || document).querySelectorAll("[data-t-ph]").forEach(function (el) { el.placeholder = t(el.dataset.tPh); });
}
function claseInfo(id) {
  return CLASES_INFO.filter(function (c) { return c.id === id; })[0] || { id: id, es: id, en: id, rol: {} };
}
