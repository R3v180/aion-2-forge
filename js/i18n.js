// Textos de la interfaz. Clave -> { es, en, fr }
var TEXTOS = {
  "nav.inicio": { es: "Inicio", en: "Home", fr: "Accueil" },
  "nav.juego": { es: "Juego", en: "Game", fr: "Jeu" },
  "nav.progresion": { es: "Progresión", en: "Progression", fr: "Progresión" },
  "nav.utiles": { es: "Utilidades", en: "Utilities", fr: "Utilitaires" },
  "nav.comunidad": { es: "Comunidad", en: "Community", fr: "Communauté" },
  "nav.espia_grupo": { es: "Espía", en: "Spy", fr: "Espion" },
  "nav.clases": { es: "Clases", en: "Classes", fr: "Classes" },
  "nav.builds": { es: "Builds", en: "Builds", fr: "Builds" },
  "nav.espia": { es: "Espía Builds", en: "Spy Builds", fr: "Espion Builds" },
  "nav.tops": { es: "Tops", en: "Tops", fr: "Tops" },
  "nav.mapa": { es: "Mapa", en: "Map", fr: "Carte" },
  "nav.timers": { es: "Timers", en: "Timers", fr: "Timers" },
  "nav.herramientas": { es: "Herramientas", en: "Tools", fr: "Outils" },
  "nav.guias": { es: "Guías", en: "Guides", fr: "Guides" },
  "nav.hint.espia": { es: "Build real de cualquier PJ", en: "Anyone's real build", fr: "La build réelle de n’importe qui" },
  "nav.hint.tops": { es: "Ranking de poder e iLvl", en: "Power and iLvl ranking", fr: "Classement puissance et iLvl" },
  "nav.hint.clases": { es: "Habilidades y builds por clase", en: "Skills and builds by class", fr: "Compétences et builds par classe" },
  "nav.hint.builds": { es: "Builds de la comunidad", en: "Community builds", fr: "Builds de la communauté" },
  "nav.hint.guias": { es: "Progresión sin inventar datos", en: "Progression, no invented data", fr: "Progression, sans données inventées" },
  "nav.hint.mapa": { es: "Rubí, odyle y recolección", en: "Ruby, odyle and gathering", fr: "Rubis, odyle et récolte" },
  "nav.hint.timers": { es: "Grieta, jefes, Shugo, reset", en: "Rift, bosses, Shugo, reset", fr: "Grieta, jefes, Shugo, reset" },
  "nav.hint.herramientas": { es: "Mejora, craft, pity, Arcana…", en: "Enhance, craft, pity, Arcana…", fr: "Mejora, craft, pity, Arcana…" },
  "nav.hint.faq": { es: "Preguntas frecuentes", en: "Frequently asked questions", fr: "Foire aux questions" },
  "nav.hint.foro": { es: "Temas de la comunidad", en: "Community threads", fr: "Sujets de la communauté" },
  "nav.hint.chat": { es: "Chat en vivo", en: "Live chat", fr: "Chat en direct" },
  "nav.faq": { es: "Preguntas frecuentes", en: "FAQ", fr: "Foire aux questions" },
  "faq.antetitulo": { es: "Ayuda · AION 2", en: "Help · AION 2", fr: "Aide · AION 2" },
  "faq.titulo": { es: "Preguntas frecuentes", en: "Frequently asked questions", fr: "Foire aux questions" },
  "faq.titulo_doc": { es: "FAQ AION 2 · Preguntas frecuentes · Aion 2 Forge", en: "AION 2 FAQ · Frequently asked questions · Aion 2 Forge", fr: "FAQ AION 2 · Foire aux questions · Aion 2 Forge" },
  "faq.sub": {
    es: "Respuestas claras sobre Espía Builds, la web, el idioma y la comunidad. Pensado también para que Google entienda el sitio.",
    en: "Clear answers about Spy Builds, the site, language and community. Also structured so Google can understand the site.", fr: "Réponses claires sur Espion Builds, le site, la langue et la communauté. Aussi structurées pour que Google comprenne le site."
  },
  "faq.desc": {
    es: "Preguntas frecuentes sobre Aion 2 Forge: Espía Builds, tops, cuenta, idioma ES/EN, datos de NC y comunidad AION 2 Europa.",
    en: "FAQ about Aion 2 Forge: Spy Builds, tops, account, ES/EN language, NC data and the EU community.", fr: "FAQ sur Aion 2 Forge : Espion Builds, tops, compte, langues ES/EN/FR, données NC et communauté AION 2."
  },
  "faq.keywords": {
    es: "AION 2 FAQ, preguntas frecuentes, Espía Builds, Aion 2 Forge, EU",
    en: "AION 2 FAQ, Spy Builds, Aion 2 Forge, frequently asked questions, EU", fr: "AION 2 FAQ, foire aux questions, Espion Builds, Aion 2 Forge, EU"
  },
  "faq.ver_legal": { es: "Aviso legal", en: "Legal notice", fr: "Mentions légales" },
  "faq.ver_espia": { es: "Abrir Espía Builds", en: "Open Spy Builds", fr: "Ouvrir Espion Builds" },
  "faq.ver_todas": { es: "Ver todas →", en: "See all →", fr: "Voir tout →" },
  "faq.error": { es: "No se pudo cargar el FAQ.", en: "Could not load the FAQ.", fr: "Impossible de charger la FAQ." },
  "ht.antetitulo": { es: "AION 2 · herramientas", en: "AION 2 · tools", fr: "AION 2 · outils" },
  "ht.volver": { es: "← Todas las herramientas", en: "← All tools", fr: "← Tous les outils" },
  "ht.fuentes": { es: "Fuentes:", en: "Sources:", fr: "Fuentes:" },
  "ht.ver_guia": { es: "Ver guía relacionada →", en: "Related guide →", fr: "Guide associé →" },
  "ht.no_existe": { es: "Esa herramienta no existe.", en: "That tool does not exist.", fr: "Cet outil n’existe pas." },
  "ht.sin_datos": { es: "Sin datos para este filtro.", en: "No data for this filter.", fr: "Aucune donnée pour ce filtre." },
  "ht.hub_title": { es: "Herramientas AION 2", en: "AION 2 tools", fr: "Outils AION 2" },
  "ht.hub_desc": {
    es: "Calculadoras AION 2: mejora con pity, craft, manastones, pity de mazmorra, Amplify, Pantheon y Arcana. Aion 2 Forge.",
    en: "AION 2 calculators: enhancement with pity, craft, manastones, dungeon pity, Amplify, Pantheon and Arcana. Aion 2 Forge.", fr: "Calculateurs AION 2 : amélioration avec pity, craft, manastones, pity de donjon, Amplify, Panthéon et Arcana. Aion 2 Forge."
  },
  "ht.hub_titulo": { es: "Herramientas", en: "Tools", fr: "Outils" },
  "ht.hub_sub": {
    es: "Calculadoras para planificar en el móvil: tasas citadas del cliente/comunidad y de nuestras guías. Nada inventado.",
    en: "Mobile planning calculators: cited client/community rates and our guides. Nothing invented.", fr: "Calculateurs pour planifier sur mobile : taux cités du client/communauté et de nos guides. Rien d’inventé."
  },
  "ht.hub_nota": {
    es: "NC no publica todas las tablas. Donde usamos extracción de cliente (EnchantCost) lo marcamos. Los costes de Kina escalan con iLvl.",
    en: "NC does not publish every table. Client extracts (EnchantCost) are labelled. Kinah costs scale with item level.", fr: "NC ne publie pas toutes les tables. Les extractions client (EnchantCost) sont marquées. Les coûts en Kinah évoluent avec l’iLvl."
  },
  "ht.mejora.titulo": { es: "Calculadora de mejora", en: "Enhancement calculator", fr: "Calculateur d’amélioration" },
  "ht.mejora.card": { es: "Intentos medios, pity y coste estimado a +15", en: "Average tries, pity and estimated cost to +15", fr: "Tentatives moyennes, pity et coût estimé jusqu’à +15" },
  "ht.mejora.sub": {
    es: "Elige grado, rango y preset de coste. +0–+10 seguro; +11–+15 con pity +5 % por fallo.",
    en: "Pick grade, range and cost preset. +0–+10 safe; +11–+15 with +5% pity per fail.", fr: "Choisissez grade, plage et preset de coût. +0–+10 sûr ; +11–+15 avec +5 % de pity par échec."
  },
  "ht.mejora.desc": {
    es: "Calculadora de Enhancement AION 2: tasas Unique +11–+15 (65/50/35/25/20) con pity, intentos medios y Kina/piedras estimadas.",
    en: "AION 2 Enhancement calculator: Unique +11–+15 rates (65/50/35/25/20) with pity, average tries and estimated Kinah/stones.", fr: "Calculateur d’Enhancement AION 2 : taux Unique +11–+15 (65/50/35/25/20) avec pity, tentatives moyennes et Kinah/pierres estimés."
  },
  "ht.mejora.kw": { es: "AION 2 enhancement, calculadora mejora, pity, Enhance Stone", en: "AION 2 enhancement calculator, pity, Enhance Stone", fr: "AION 2 enhancement, cauculadora mejora, pity, Enhance Stone" },
  "ht.mejora.grado": { es: "Grado", en: "Grade", fr: "Grado" },
  "ht.mejora.desde": { es: "Desde +", en: "From +", fr: "De +" },
  "ht.mejora.hasta": { es: "Hasta +", en: "To +", fr: "À +" },
  "ht.mejora.coste": { es: "Coste (referencia)", en: "Cost (reference)", fr: "Coût (référence)" },
  "ht.mejora.sin_coste": { es: "Solo intentos (sin Kina)", en: "Tries only (no Kinah)", fr: "Tentatives seules (sans Kinah)" },
  "ht.mejora.rango_malo": { es: "El destino debe ser mayor que el inicio.", en: "Target must be higher than start.", fr: "La cible doit être supérieure au départ." },
  "ht.mejora.sin_dato": { es: "Sin curva publicada para este paso.", en: "No published curve for this step.", fr: "Aucune courbe publiée pour cette étape." },
  "ht.mejora.intentos": { es: "Intentos esperados", en: "Expected tries", fr: "Tentatives attendues" },
  "ht.mejora.seguros": { es: "Pasos seguros", en: "Safe steps", fr: "Étapes sûres" },
  "ht.mejora.coste_nota": {
    es: "Costes escalados desde iLvl 102 Unique (MetaBot/Aion2Data). Tu pieza puede diferir; mira el tooltip en juego.",
    en: "Costs scaled from iLvl 102 Unique (MetaBot/Aion2Data). Your piece may differ; check the in-game tooltip.", fr: "Coûts extrapolés depuis Unique iLvl 102 (MetaBot/Aion2Data). Votre pièce peut différer ; vérifiez l’infobulle en jeu."
  },
  "ht.craft.titulo": { es: "Estimador de craft", en: "Craft estimator", fr: "Estimateur de craft" },
  "ht.craft.card": { es: "Profesión por clase y materiales según tasa de éxito", en: "Profession by class and mats from success rate", fr: "Métier par classe et mats selon le taux de succès" },
  "ht.craft.sub": {
    es: "Sin dump completo de recetas: estima intentos/mats con tu % (o muestras KR) y elige profesión.",
    en: "No full recipe dump: estimate tries/mats with your % (or KR samples) and pick a profession.", fr: "Pas de dump complet de recettes : estimez tentatives/mats avec votre % (ou échantillons KR) et choisissez un métier."
  },
  "ht.craft.desc": {
    es: "Estimador de fabricación AION 2: profesiones, clases y materiales esperados según tasa de éxito (muestras Corea).",
    en: "AION 2 crafting estimator: professions, classes and expected materials from success rate (KR samples).", fr: "Estimateur de craft AION 2 : métiers, classes et matériaux attendus selon le taux de succès (échantillons KR)."
  },
  "ht.craft.kw": { es: "AION 2 craft, fabricación, blacksmithing, alchemy", en: "AION 2 craft, blacksmithing, alchemy", fr: "AION 2 craft, forge, alchimie" },
  "ht.craft.prof": { es: "Profesión", en: "Profession", fr: "Métier" },
  "ht.craft.exito": { es: "Éxito %", en: "Success %", fr: "Succès %" },
  "ht.craft.mats": { es: "Mats por intento", en: "Mats per try", fr: "Mats por intento" },
  "ht.craft.deseados": { es: "Éxitos deseados", en: "Desired successes", fr: "Succès désirés" },
  "ht.craft.muestras": { es: "Muestras Corea (toca para usar)", en: "KR samples (tap to use)", fr: "Échantillons KR (touchez pour utiliser)" },
  "ht.craft.nivel": { es: "Nivel craft", en: "Craft level", fr: "Niveau de craft" },
  "ht.craft.clases": { es: "Clases (consenso KR)", en: "Classes (KR consensus)", fr: "Classes (avecsenso KR)" },
  "ht.craft.intentos_esp": { es: "Intentos esperados", en: "Expected tries", fr: "Tentatives attendues" },
  "ht.craft.mats_esp": { es: "Mats esperados", en: "Expected mats", fr: "Mats attendus" },
  "ht.craft.p95": { es: "Mats ~p95 (1 éxito)", en: "Mats ~p95 (1 success)", fr: "Mats ~p95 (1 succès)" },
  "ht.craft.nota_calc": {
    es: "Geométrica simple (sin combo). Si tu receta usa combo, el éxito efectivo es menor: multiplica mats.",
    en: "Simple geometric (no combo). If your recipe uses combo, effective success is lower: multiply mats.", fr: "Géométrique simple (sans combo). Si votre recette utilise le combo, le succès effectif est plus bas : multipliez les mats."
  },
  "ht.odds.titulo": { es: "Manastone, Soul Binding y Sync", en: "Manastone, Soul Binding & Sync", fr: "Manastone, Soul Binding et Sync" },
  "ht.odds.card": { es: "Valores de piedras, prioridades de binding y Theostones", en: "Stone values, binding priorities and Theostones", fr: "Valeurs des pierres, priorités de binding et Theostones" },
  "ht.odds.sub": {
    es: "Orden de la capa horizontal, valores de Manastone del dump, prioridades KR y lista de Theostones.",
    en: "Horizontal layer order, Manastone dump values, KR priorities and Theostone list.", fr: "Ordre des couches, valeurs Manastone, priorités KR et liste Theostone."
  },
  "ht.odds.desc": {
    es: "Manastones AION 2 por estadística y grado, prioridades de Soul Binding/Sync (Corea) y catálogo de Theostones.",
    en: "AION 2 Manastones by stat and grade, Soul Binding/Sync priorities (KR) and Theostone catalogue.", fr: "Manastones AION 2 por cettedística et grado, prioridades de Soul Binding/Sync (Corea) et catálogo de Theostones."
  },
  "ht.odds.kw": { es: "AION 2 manastone, soul binding, theostone, sync", en: "AION 2 manastone, soul binding, theostone, sync", fr: "AION 2 manastone, soul binding, theostone, sync" },
  "ht.odds.orden": { es: "Orden recomendado", en: "Recommended order", fr: "Ordre recommandé" },
  "ht.odds.mana": { es: "Valores Manastone", en: "Manastone values", fr: "Valeurs Manastone" },
  "ht.odds.stat": { es: "Estadística", en: "Stat", fr: "Estadística" },
  "ht.odds.soul": { es: "Soul Binding (adopción KR)", en: "Soul Binding (KR uptake)", fr: "Soul Binding (adoption KR)" },
  "ht.odds.sync": { es: "Sync esenciales (PvE KR)", en: "Sync essentials (KR PvE)", fr: "Essentiels Sync (PvE KR)" },
  "ht.odds.theo": { es: "Theostones", en: "Theostones", fr: "Theostones" },
  "ht.odds.buscar": { es: "Buscar Theostone…", en: "Search Theostone…", fr: "Chercher une Theostone…" },
  "ht.drops.titulo": { es: "Pity y farms de mazmorra", en: "Dungeon pity & farms", fr: "Pity de donjon & farms" },
  "ht.drops.card": { es: "Contador de pity, Odyle y dónde farmear", en: "Pity counter, Odyle and where to farm", fr: "Compteur pity, Odyle et où farmer" },
  "ht.drops.sub": {
    es: "Calcula clears que te faltan para la garantía. Sin % de drop inventados: farms citados de guías.",
    en: "Compute clears left to pity. No invented drop %: farms cited from guides.", fr: "Calculez les clears restants jusqu’au pity. Pas de % de drop inventés : farms cités des guides."
  },
  "ht.drops.desc": {
    es: "Pity de cubo AION 2 (14/21/28 clears), reglas Odyle Energy y farms de Enhance Stones, Arcana y Theostones.",
    en: "AION 2 cube pity (14/21/28 clears), Odyle Energy rules and farms for Enhance Stones, Arcana and Theostones.", fr: "Pitet de cubo AION 2 (14/21/28 clears), reglas Odyle Energet et farms de Enhance Stones, Arcana et Theostones."
  },
  "ht.drops.kw": { es: "AION 2 pity, odyle, dungeon loot, enhance stones", en: "AION 2 pity, odyle, dungeon loot, enhance stones", fr: "AION 2 pity, odyle, dungeon loot, enhance stones" },
  "ht.drops.pity": { es: "Contador de pity", en: "Pity counter", fr: "Compteur pity" },
  "ht.drops.tier": { es: "Nivel de mazmorra", en: "Dungeon tier", fr: "Palier de donjon" },
  "ht.drops.nivel": { es: "Nivel", en: "Tier", fr: "Palier" },
  "ht.drops.clears": { es: "Clears hechos", en: "Clears done", fr: "Clears faits" },
  "ht.drops.garantia": { es: "Clears para garantía", en: "Clears to pity", fr: "Clears pour garantía" },
  "ht.drops.faltan": { es: "Faltan", en: "Left", fr: "Restants" },
  "ht.drops.progreso": { es: "Progreso", en: "Progress", fr: "Progression" },
  "ht.drops.reglas": { es: "Reglas del botín", en: "Loot rules", fr: "Règles de loot" },
  "ht.drops.farms": { es: "Dónde farmear (sin % inventados)", en: "Where to farm (no invented %)", fr: "Où farmer (sans % inventés)" },
  "ht.drops.mapa": { es: "Abrir mapa de recolección", en: "Open gathering map", fr: "Ouvrir la carte de récolte" },
  "ht.drops.pity_nota": {
    es: "Pity KR citado; no incluye armas. Céntrate en 1–2 mazmorras.",
    en: "Cited KR pity; weapons excluded. Focus on 1–2 dungeons.", fr: "Pity KR cité ; armes exclues. Concentrez-vous sur 1–2 donjons."
  },
  "ht.potential.titulo": { es: "Amplify, Potential y Transfer", en: "Amplify, Potential & Transfer", fr: "Amplify, Potentiau et Transfer" },
  "ht.potential.card": { es: "◆ Amplify con pity, Potential PvP y reglas Transfer", en: "◆ Amplify with pity, PvP Potential and Transfer rules", fr: "◆ Amplify avec pity, Potential PvP et règles de Transfer" },
  "ht.potential.sub": {
    es: "Curva Amplify del cliente, Potential seguro (+0,5 % PvP × 4) y checklist Transfer.",
    en: "Client Amplify curve, safe Potential (+0.5% PvP × 4) and Transfer checklist.", fr: "Courbe Amplify client, Potential sûr (+0,5 % PvP × 4) et checklist Transfer."
  },
  "ht.potential.desc": {
    es: "Calculadora Amplify AION 2 (66–20 % con pity), Potential PvP y qué mueve Transfer.",
    en: "AION 2 Amplify calculator (66–20% with pity), PvP Potential and what Transfer moves.", fr: "Calculateur Amplify AION 2 (66–20 % avec pity), Potential PvP et ce que Transfer déplace."
  },
  "ht.potential.kw": { es: "AION 2 amplify, potential, transfer", en: "AION 2 amplify, potential, transfer", fr: "AION 2 amplify, potentiau, transfer" },
  "ht.potential.amp": { es: "Amplify (◆)", en: "Amplify (◆)", fr: "Amplifet (◆)" },
  "ht.potential.pot": { es: "Potential", en: "Potential", fr: "Potentiau" },
  "ht.potential.nivel": { es: "Nivel Potential (0–4)", en: "Potential level (0–4)", fr: "Niveau Potential (0–4)" },
  "ht.potential.bonus": { es: "Bonus PvP", en: "PvP bonus", fr: "Bonus PvP" },
  "ht.potential.max": { es: "Máximo (4)", en: "Max (4)", fr: "Máximo (4)" },
  "ht.potential.transfer": { es: "Transfer (recordatorio)", en: "Transfer (reminder)", fr: "Transfer (rappel)" },
  "ht.potential.t1": {
    es: "Mueve Enhancement, Amplify y Soul Binding a una pieza de mejor grado.",
    en: "Moves Enhancement, Amplify and Soul Binding to a higher-grade piece.", fr: "Déplace Enhancement, Amplify et Soul Binding vers une pièce de grade supérieur."
  },
  "ht.potential.t2": {
    es: "Gasta Transfer Stones y un uso limitado por temporada.",
    en: "Spends Transfer Stones and a season-limited use.", fr: "Consomme des Transfer Stones et un usage limité par saison."
  },
  "ht.potential.t3": {
    es: "Mira engarces del destino antes: 4 sockets ganan a 2 aunque la base sea peor.",
    en: "Check destination sockets first: 4 sockets beat 2 even if the base looks worse.", fr: "Vérifiez d’abord les sockets de destination : 4 sockets battent 2 même si la base paraît pire."
  },
  "ht.potential.t4": {
    es: "No Transfer a un arma que luego no puedas Sync.",
    en: "Don't Transfer onto a weapon you cannot Sync later.", fr: "Ne Transferez pas sur une arme que vous ne pourrez pas Sync plus tard."
  },
  "ht.stats.titulo": { es: "Planificador de stats", en: "Stats planner", fr: "Planificateur de stats" },
  "ht.stats.card": { es: "Capas de poder, foco por rol y suma de Manastones", en: "Power layers, role focus and Manastone totals", fr: "Couches de puissance, focus de rôle et totaux Manastone" },
  "ht.stats.sub": {
    es: "Sin softcaps oficiales publicados: capas del personaje, foco por rol y suma de hasta 8 Manastones.",
    en: "No official softcaps published: character layers, role focus and up to 8 Manastone totals.", fr: "Pas de softcaps officiels publiés : couches du personnage, focus de rôle et jusqu’à 8 totaux Manastone."
  },
  "ht.stats.desc": {
    es: "Planificador de stats AION 2: capas (equipo, piedras, binding, pantheon, arcana) y suma de Manastones por engarce.",
    en: "AION 2 stats planner: layers (gear, stones, binding, pantheon, arcana) and per-socket Manastone totals.", fr: "Planificateur de stats AION 2 : couches (équipement, pierres, binding, panthéon, arcana) et totaux Manastone par socket."
  },
  "ht.stats.kw": { es: "AION 2 stats, manastone planner, softcap", en: "AION 2 stats, manastone planner, softcap", fr: "AION 2 stats, manastone planner, softcap" },
  "ht.stats.capas": { es: "Capas de poder", en: "Power layers", fr: "Couches de puissance" },
  "ht.stats.roles": { es: "Foco por rol", en: "Role focus", fr: "Focus de rôle" },
  "ht.stats.plan_mana": { es: "Suma de Manastones", en: "Manastone sum", fr: "Suma de Manastones" },
  "ht.stats.plan_sub": { es: "Elige hasta 8 engarces y grado; sumamos los valores del dump.", en: "Pick up to 8 sockets and grade; we sum dump values.", fr: "Choisissez jusqu’à 8 sockets et un grade ; on additionne les valeurs." },
  "ht.stats.hueco": { es: "Engarce", en: "Socket", fr: "Engarce" },
  "ht.stats.vacio": { es: "Elige al menos un engarce con estadística.", en: "Pick at least one socket with a stat.", fr: "Choisissez au moins un socket avec une stat." },
  "ht.pantheon.titulo": { es: "Planificador Pantheon", en: "Pantheon planner", fr: "Planificateur Panthéon" },
  "ht.pantheon.card": { es: "Huecos, dioses por rol y puntos por grado", en: "Slots, gods by role and points by grade", fr: "Emplacements, dieux par rôle et points par grade" },
  "ht.pantheon.sub": {
    es: "17 huecos, qué dios buscar según rol, y puntos = líneas × valor × cantidad.",
    en: "17 slots, which god to chase by role, and points = lines × value × count.", fr: "17 emplacements, quel dieu viser selon le rôle, et points = lignes × valeur × nombre."
  },
  "ht.pantheon.desc": {
    es: "Pantheon AION 2: coloso/estatuas/cuadros, dioses por rol y calculadora de puntos por grado de decoración.",
    en: "AION 2 Pantheon: colossus/statues/paintings, gods by role and decoration-grade point calculator.", fr: "Panthéon AION 2 : colosse/statues/tableaux, dieux par rôle et calculateur de points par grade de décoration."
  },
  "ht.pantheon.kw": { es: "AION 2 pantheon, housing stats, colossus", en: "AION 2 pantheon, housing stats, colossus", fr: "AION 2 panthéon, stats housing, colosse" },
  "ht.pantheon.huecos": { es: "Huecos", en: "Slots", fr: "Emplacements" },
  "ht.pantheon.roles": { es: "Dioses y roles", en: "Gods and roles", fr: "Dieux et rôles" },
  "ht.pantheon.plan": { es: "Puntos por decoraciones", en: "Points from decorations", fr: "Points des décorations" },
  "ht.pantheon.cuadro": { es: "Cuadro", en: "Painting", fr: "Tableau" },
  "ht.pantheon.estatua": { es: "Estatua", en: "Statue", fr: "Estavotrea" },
  "ht.pantheon.coloso": { es: "Coloso", en: "Colossus", fr: "Colosse" },
  "ht.pantheon.cantidad": { es: "Cantidad", en: "Count", fr: "Nombre" },
  "ht.pantheon.lineas": { es: "Líneas totales", en: "Total lines", fr: "Lignes totales" },
  "ht.pantheon.pts_pieza": { es: "Puntos / pieza", en: "Points / piece", fr: "Points / pièce" },
  "ht.pantheon.pts_total": { es: "Puntos totales", en: "Total points", fr: "Points totaux" },
  "ht.pantheon.formula": { es: "Fórmula", en: "Formula", fr: "Formule" },
  "ht.pantheon.nota": {
    es: "Busca grado, no cantidad. Un coloso Épico (165) supera diez cuadros Épicos.",
    en: "Chase grade, not count. One Epic colossus (165) beats ten Epic paintings.", fr: "Visez le grade, pas le nombre. Un colosse Epic (165) bat dix tableaux Epic."
  },
  "ht.pantheon.combo_malo": { es: "Esa combinación tipo/grado no está en la tabla citada.", en: "That type/grade combo is not in the cited table.", fr: "Cette combinaison type/grade n’est pas dans la table citée." },
  "ht.arcana.titulo": { es: "Checklist Arcana", en: "Arcana checklist", fr: "Checklist Arcana" },
  "ht.arcana.card": { es: "Piezas, mazmorra de origen y rareza → skills", en: "Pieces, source dungeon and rarity → skills", fr: "Pièces, donjon source et rareté → compétences" },
  "ht.arcana.sub": {
    es: "Marca lo que llevas. Solo Transcendence suelta Arcana; Scales es Season 2 KR.",
    en: "Tick what you wear. Only Transcendence drops Arcana; Scales is KR Season 2.", fr: "Cochez ce que vous portez. Seul Transcendence droppe de l’Arcana ; Scales est KR Saison 2."
  },
  "ht.arcana.desc": {
    es: "Arcana AION 2: brújula, campana, pergamino, espejo, cáliz, Scales; de dónde salen y skills por rareza.",
    en: "AION 2 Arcana: compass, bell, scroll, mirror, chalice, Scales; sources and skills by rarity.", fr: "Arcana AION 2 : boussole, cloche, parchemin, miroir, calice, Scales ; sources et compétences par rareté."
  },
  "ht.arcana.kw": { es: "AION 2 arcana, transcendence, daevanion", en: "AION 2 arcana, transcendence, daevanion", fr: "AION 2 arcana, transcendence, daevanion" },
  "ht.arcana.piezas": { es: "Piezas", en: "Pieces", fr: "Pièces" },
  "ht.arcana.rareza": { es: "Rareza → skills en la carta", en: "Rarity → skills on the card", fr: "Rareté → compétences sur la carte" },
  "ht.arcana.skills": { es: "Skills", en: "Skills", fr: "Compétences" },
  "ht.arcana.equipadas": { es: "Marcadas", en: "Checked", fr: "Cochées" },
  "ht.arcana.full": { es: "Set completo (incluye Scales S2). Prioriza skills que pulsas.", en: "Full set (includes S2 Scales). Prioritize skills you press.", fr: "Set complet (inclut Scales S2). Priorisez les compétences que vous utilisez." },
  "ht.arcana.set42": { es: "Con 4+ piezas ya puedes pensar en set; Scales habilita 4+2 en KR S2.", en: "With 4+ pieces you can plan a set; Scales enables 4+2 in KR S2.", fr: "Avec 4+ pièces vous pouvez planifier un set ; Scales permet le 4+2 en KR S2." },
  "ht.arcana.parcial": { es: "Buen comienzo: farméa la Transcendence que te falta.", en: "Good start: farm the Transcendence you're missing.", fr: "Bon début : farmez le Transcendence qui vous manque." },
  "ht.arcana.pocas": { es: "Empieza por Deus Research Base o Shattered Arkanis.", en: "Start with Deus Research Base or Shattered Arkanis.", fr: "Commencez par Deus Research Base ou Shattered Arkanis." },
  "ht.grado.common": { es: "Común", en: "Common", fr: "Común" },
  "ht.grado.rare": { es: "Raro", en: "Rare", fr: "Raro" },
  "ht.grado.legendary": { es: "Legendario", en: "Legendary", fr: "Legendario" },
  "ht.grado.unique": { es: "Único", en: "Unique", fr: "Único" },
  "ht.grado.epic": { es: "Épico (tope +10)", en: "Epic (cap +10)", fr: "Épico (tope +10)" },
  "ht.grado.heroic": { es: "Épico / Heroic (+20 KR)", en: "Epic / Heroic (+20 KR)", fr: "Épico / Heroic (+20 KR)" },
  "ht.col.paso": { es: "Paso", en: "Step", fr: "Étape" },
  "ht.col.tasa": { es: "Tasa base", en: "Base rate", fr: "Taux de base" },
  "ht.col.pity": { es: "Pity / fallo", en: "Pity / fail", fr: "Pity / échec" },
  "ht.col.media": { es: "Media", en: "Average", fr: "Moyenne" },
  "ht.col.techo": { es: "Techo", en: "Hard cap", fr: "Plafond" },
  "ht.col.kina": { es: "Kina esp.", en: "Exp. Kinah", fr: "Kina esp." },
  "ht.col.piedras": { es: "Piedras esp.", en: "Exp. stones", fr: "Pierres esp." },
  "ht.col.hueco": { es: "Hueco", en: "Slot", fr: "Emplacement" },
  "ht.col.opciones": { es: "Opciones", en: "Options", fr: "Opciones" },
  "ht.col.grado": { es: "Grado", en: "Grade", fr: "Grado" },
  "ht.col.valor": { es: "Valor", en: "Value", fr: "Valeur" },
  "ht.col.item": { es: "Qué", en: "What", fr: "Quoi" },
  "ht.col.donde": { es: "Dónde", en: "Where", fr: "Où" },
  "ht.col.tipo": { es: "Tipo", en: "Type", fr: "Tipo" },
  "timers.antetitulo": { es: "AION 2 · herramientas", en: "AION 2 · tools", fr: "AION 2 · outils" },
  "timers.titulo": { es: "Timers de eventos", en: "Event timers", fr: "Timers d’événements" },
  "timers.sub": {
    es: "Grieta espacio-tiempo, jefes del Abismo, Festival Shugo, invasión y resets. Horarios comunitarios (no oficiales). Elige tu región; por defecto Europa.",
    en: "Spacetime Rift, Abyss bosses, Shugo Festival, invasion and resets. Community schedules (not official). Pick your region; Europe by default.", fr: "Faille spatio-temporelle, bosses de l’Abysse, Festival Shugo, invasion et resets. Horaires communautaires (non officiels). Choisissez votre région ; Europe par défaut."
  },
  "timers.region": { es: "Región / reloj", en: "Region / clock", fr: "Région / horloge" },
  "timers.reloj": { es: "Reloj del servidor: {srv} · Tu zona: {local}", en: "Server clock: {srv} · Your zone: {local}", fr: "Server clock: {srv} · Your zone: {local}" },
  "timers.cat.all": { es: "Todo", en: "All", fr: "Tous" },
  "timers.cat.rift": { es: "Grieta", en: "Rift", fr: "Faille" },
  "timers.cat.boss": { es: "Jefes", en: "Bosses", fr: "Jefes" },
  "timers.cat.shugo": { es: "Shugo", en: "Shugo", fr: "Shugo" },
  "timers.cat.invasion": { es: "Invasión", en: "Invasion", fr: "Invasión" },
  "timers.cat.reset": { es: "Reset", en: "Reset", fr: "Reset" },
  "timers.siguiente": { es: "Siguiente", en: "Next up", fr: "À venir" },
  "timers.ahora": { es: "En curso", en: "Live now", fr: "En cours" },
  "timers.proximo": { es: "Próxima apertura:", en: "Next opening:", fr: "Prochaine ouverture :" },
  "timers.hasta": { es: "Termina:", en: "Ends:", fr: "Fin :" },
  "timers.abrio": { es: "Abrió:", en: "Opened:", fr: "Ouvert :" },
  "timers.termina_en": { es: "Termina en", en: "Ends in", fr: "Se termine dans" },
  "timers.abre_en": { es: "Abre en", en: "Opens in", fr: "Ouvre dans" },
  "timers.portal": { es: "Entrada abierta (10 min)", en: "Entry open (10 min)", fr: "Entrée ouverte (10 min)" },
  "timers.en_curso": { es: "Evento activo (60 min desde la apertura)", en: "Event running (60 min from open)", fr: "Événement en cours (60 min depuis l’ouverture)" },
  "timers.live_detalle": { es: "Abrió {inicio} · termina {fin}", en: "Opened {inicio} · ends {fin}", fr: "Opened {inicio} · ends {fin}" },
  "timers.hora_servidor": { es: "Horario servidor", en: "Server schedule", fr: "Horaire serveur" },
  "timers.en_servidor": { es: "Hora en el servidor", en: "Server time", fr: "Heure serveur" },
  "timers.confirmado": { es: "Fuentes de acuerdo", en: "Sources agree", fr: "Sources d’accord" },
  "timers.provisional": { es: "Provisional", en: "Unconfirmed", fr: "Non confirmé" },
  "timers.nota": {
    es: "Referencia comunitaria revisada el {d}. No es telemetría en vivo ni horario oficial de NCSOFT: manda el aviso del juego.",
    en: "Community reference checked on {d}. Not live telemetry or an official NCSOFT schedule — in-game notices win.", fr: "Community reference checked on {d}. Not live telemetry or an official NCSOFT schedule — in-game notices win."
  },
  "timers.fuentes": { es: "Fuentes:", en: "Sources:", fr: "Fuentes:" },
  "timers.ev.rift": { es: "Grieta espacio-tiempo", en: "Spacetime Rift", fr: "Faille spatio-temporelle" },
  "timers.ev.shugo": { es: "Festival Shugo", en: "Shugo Festival", fr: "Festivau Shugo" },
  "timers.ev.invasion": { es: "Invasión dimensional", en: "Dimensional Invasion", fr: "Invasion dimensionnelle" },
  "timers.ev.dailyReset": { es: "Reset diario", en: "Daily reset", fr: "Reset quotidien" },
  "timers.ev.weeklyReset": { es: "Reset semanal", en: "Weekly reset", fr: "Reset hebdomadaire" },
  "timers.ev.kaira": { es: "Vigilante Kaira", en: "Watcher Kaira", fr: "Vigilante Kaira" },
  "timers.ev.siege": { es: "Asedio de artefacto", en: "Artifact Siege", fr: "Siège d’artefact" },
  "timers.ev.siegeBosses": { es: "Jefes de asedio", en: "Siege Bosses", fr: "Bosses de siège" },
  "timers.ev.nahma": { es: "General guardián Nahma", en: "Guardian General Nahma", fr: "Generau guardián Nahma" },
  "timers.regla_hora": { es: "Cada hora a :{m}", en: "Every hour at :{m}", fr: "Every hour at :{m}" },
  "timers.dia.0": { es: "Dom", en: "Sun", fr: "Dim" },
  "timers.dia.1": { es: "Lun", en: "Mon", fr: "Lun" },
  "timers.dia.2": { es: "Mar", en: "Tue", fr: "Mar" },
  "timers.dia.3": { es: "Mié", en: "Wed", fr: "Mer" },
  "timers.dia.4": { es: "Jue", en: "Thu", fr: "Jeu" },
  "timers.dia.5": { es: "Vie", en: "Fri", fr: "Ven" },
  "timers.dia.6": { es: "Sáb", en: "Sat", fr: "Sam" },
  "mapa.titulo": { es: "Mapa AION 2: recolección y localizaciones", en: "AION 2 map: gathering and locations", fr: "Carte AION 2 : récolte et lieux" },
  "mapa.sub": { es: "Busca rubí, odyle, zaif, cubos ocultos, mascotas y jefes en Verteron, Altgard, Eltnen, Morheim y el Abismo.", en: "Find ruby, odyle, zaif, hidden cubes, pets and bosses in Verteron, Altgard, Eltnen, Morheim and the Abyss.", fr: "Trouvez rubis, odyle, zaif, cubes cachés, familiers et bosses à Verteron, Altgard, Eltnen, Morheim et l’Abysse." },
  "mapa.buscar": { es: "Buscar", en: "Search", fr: "Rechercher" },
  "mapa.buscar_ph": { es: "Ej. rubí, odyle, zaif, cubo…", en: "E.g. ruby, odyle, zaif, cube…", fr: "Ej. rubí, odyle, zaif, cubo…" },
  "mapa.zona": { es: "Zona", en: "Zone", fr: "Zona" },
  "mapa.todas": { es: "Todas", en: "All", fr: "Toutes" },
  "mapa.ninguna": { es: "Ninguna", en: "None", fr: "Aucune" },
  "mapa.defecto": { es: "Defecto", en: "Default", fr: "Par défaut" },
  "mapa.filtros": { es: "Filtros", en: "Filters", fr: "Filtres" },
  "mapa.marcadores": { es: "{n} marcadores en el mapa", en: "{n} markers on the map", fr: "{n} markers on the map" },
  "mapa.error": { es: "No se ha podido cargar el mapa.", en: "Could not load the map.", fr: "Impossible de charger la carte." },
  "mapa.nota": { es: "Spawns del cliente AION 2 (recolección, mascotas, rastros…). Cubos de Altgard: 59 grupos / 1371 puntos del datamine. Eltnen/Morheim casi sin mascotas en el cliente global. Fan site, sin relación con NCSOFT.", en: "AION 2 client spawns (gathering, pets, traces…). Altgard cubes: 59 groups / 1371 spots from datamine. Eltnen/Morheim barely have pets in the global client. Fan site, not affiliated with NCSOFT.", fr: "Spawns du client AION 2 (récolte, familiers, traces…). Cubes Altgard : 59 groupes / 1371 points issus du datamine. Eltnen/Morheim ont presque aucun familier dans le client global. Site de fans, non affilié à NCSOFT." },
  "mapa.fuente": { es: "Spawns · cliente + datamine (fan)", en: "Spawns · client + datamine (fan)", fr: "Spawns · cliente + datamine (fan)" },
  "mapa.tip_ruby": { es: "Prueba «rubí» o «ruby» con Recolección activada. También odyle, zaif, cubos ocultos y mascotas.", en: "Try “ruby” with Gathering on. Also odyle, zaif, hidden cubes and pets.", fr: "Essayez « ruby » avec Gathering activé. Aussi odyle, zaif, cubes cachés et familiers." },
  "region.eu": { es: "Europa (EU)", en: "Europe (EU)", fr: "Europe (EU)" },
  "region.naw": { es: "Norteamérica Oeste (NAW)", en: "North America West (NAW)", fr: "Amérique du Nord Ouest (NAW)" },
  "region.nae": { es: "Norteamérica Este (NAE)", en: "North America East (NAE)", fr: "Amérique du Nord Est (NAE)" },
  "region.la": { es: "Latinoamérica (LA)", en: "Latin America (LA)", fr: "Amérique latine (LA)" },
  "region.as": { es: "Asia (AS)", en: "Asia (AS)", fr: "Asie (AS)" },
  "espia.region": { es: "Región", en: "Region", fr: "Région" },
  "espia.antetitulo": { es: "AION 2 global · gratis", en: "AION 2 global · free", fr: "AION 2 global · gratuit" },
  "espia.titulo": { es: "Espía Builds", en: "Spy Builds", fr: "Espion Builds" },
  "espia.sub": { es: "Mira la build real de cualquier jugador (EU, NA, LA, Asia): equipo, skills, Daevanion, poder e iLvl. Sin cuenta. Elige región, busca por nombre y afina con filtros.", en: "See any player's real build (EU, NA, LA, Asia): gear, skills, Daevanion, power and iLvl. No account needed. Pick a region, search by name and refine with filters.", fr: "Voyez la build réelle de n’importe quel joueur (EU, NA, LA, Asie) : équipement, compétences, Daevanion, puissance et iLvl. Aucun compte requis. Choisissez une région, cherchez par nom et affinez avec les filtres." },
  "espia.ir_tops": { es: "Ver tops comunitarios", en: "View community tops", fr: "Voir les tops communautaires" },
  "tops.antetitulo": { es: "AION 2 · ranking comunitario", en: "AION 2 · community ranking", fr: "AION 2 · classement communautaire" },
  "tops.titulo": { es: "Tops de poder e iLvl", en: "Power and iLvl tops", fr: "Tops de puissance et iLvl" },
  "tops.sub": { es: "Ranking comunitario de personajes espiados en AION 2 (todas las regiones globales: poder o iLvl). Público, sin registro. No es el top oficial de NC.", en: "Community ranking of spied AION 2 characters (all global regions: power or iLvl). Public, no sign-up. Not the official NC leaderboard.", fr: "Classement communautaire des personnages espionnés sur AION 2 (toutes les régions globales : puissance ou iLvl). Public, sans inscription. Ce n’est pas le classement officiel NC." },
  "tops.aviso": { es: "Solo entran PJs que alguien haya buscado o abierto en Espía. Se guarda un carnet ligero (poder/iLvl), no la ficha completa.", en: "Only characters someone searched or opened in Spy appear. A light card (power/iLvl) is stored, not the full profile.", fr: "Seuls les personnages que quelqu’un a cherchés ou ouverts dans Espion apparaissent. On enregistre une fiche légère (puissance/iLvl), pas le profil complet." },
  "tops.login": { es: "Entra con tu cuenta para ver los tops.", en: "Sign in to view the tops.", fr: "Connectez-vous pour voir les tops." },
  "tops.ambito": { es: "Ámbito", en: "Scope", fr: "Périmètre" },
  "tops.ambito_all": { es: "Toda la región", en: "Whole region", fr: "Toute la région" },
  "tops.ambito_eu": { es: "Toda la región", en: "Whole region", fr: "Toute la région" },
  "tops.ambito_elyos": { es: "Elyos", en: "Elyos", fr: "Élyséens" },
  "tops.ambito_asmodian": { es: "Asmodian", en: "Asmodian", fr: "Asmodiens" },
  "tops.ambito_server": { es: "Un servidor", en: "One server", fr: "Un serveur" },
  "tops.elige_servidor": { es: "Elige un servidor", en: "Choose a server", fr: "Choisissez un serveur" },
  "tops.orden": { es: "Ordenar por", en: "Sort by", fr: "Trier par" },
  "tops.orden_poder": { es: "Poder", en: "Power", fr: "Puissance" },
  "tops.orden_ilvl": { es: "iLvl", en: "iLvl", fr: "iLvl" },
  "tops.ver": { es: "Ver top", en: "Show top", fr: "Voir le top" },
  "tops.cargando": { es: "Cargando top…", en: "Loading top…", fr: "Chargement du top…" },
  "tops.resultado": { es: "Mostrando {n} · {total} en este filtro", en: "Showing {n} · {total} in this filter", fr: "Affichage de {n} · {total} dans ce filtre" },
  "tops.vacio": { es: "Aún no hay nadie en este filtro. Espía builds y volverán a aparecer aquí.", en: "No one in this filter yet. Spy some builds and they will show up here.", fr: "Personne dans ce filtre pour l’instant. Espionnez des builds et elles apparaîtront ici." },
  "tops.ir_espia": { es: "← Ir a Espía Builds", en: "← Go to Spy Builds", fr: "← Aller à Espion Builds" },
  "tops.espia_build": { es: "Espía build", en: "Spy build", fr: "Espion build" },
  "espia.buscar": { es: "Espiar", en: "Spy", fr: "Espionner" },
  "espia.placeholder": { es: "Nombre del personaje (mín. 2 letras)…", en: "Character name (min. 2 letters)…", fr: "Nom du personnage (min. 2 lettres)…" },
  "espia.filtro_todas": { es: "Todas las clases", en: "All classes", fr: "Toutes las clases" },
  "espia.filtro_cualquier_nv": { es: "Cualquier nivel", en: "Any level", fr: "N’importe quel niveau" },
  "espia.filtro_cualquier_raza": { es: "Cualquier facción", en: "Any faction", fr: "N’importe quel facción" },
  "espia.filtro_cualquier_srv": { es: "Cualquier servidor", en: "Any server", fr: "N’importe quel serveur" },
  "espia.poder_min": { es: "Poder mínimo", en: "Min. power", fr: "Puissance min." },
  "espia.ordenar_poder": { es: "Ordenar por poder (tops)", en: "Sort by power (tops)", fr: "Trier par puissance (tops)" },
  "espia.filtros_hint": { es: "El nombre es obligatorio. Cada página lee poder e iLvl (unos segundos). El filtro de poder aplica a la página actual.", en: "Name is required. Each page reads power and iLvl (a few seconds). Power filter applies to the current page.", fr: "Le nom est obligatoire. Chaque page lit puissance et iLvl (quelques secondes). Le filtre de puissance s’applique à la page actuelle." },
  "espia.filtro_necesario": { es: "Escribe al menos 2 letras del nombre.", en: "Type at least 2 letters of the name.", fr: "Saisissez au moins 2 lettres du nom." },
  "espia.buscando_poder": { es: "Buscando y leyendo poder / iLvl…", en: "Searching and reading power / iLvl…", fr: "Recherche et lecture puissance / iLvl…" },
  "espia.parcial": { es: "Muestra parcial", en: "Partial sample", fr: "Échantillon partiel" },
  "espia.resultado": { es: "{n} en esta página · pág. {p}/{pages} · {total} en NC", en: "{n} on this page · p. {p}/{pages} · {total} on NC", fr: "{n} sur cette page · p. {p}/{pages} · {total} chez NC" },
  "espia.total": { es: "{n} en NC", en: "{n} on NC", fr: "{n} chez NC" },
  "espia.mostrando": { es: "{n} resultados", en: "{n} results", fr: "{n} résultats" },
  "espia.pagina": { es: "Página {p} de {n}", en: "Page {p} of {n}", fr: "Page {p} sur {n}" },
  "espia.anterior": { es: "Anterior", en: "Previous", fr: "Précédent" },
  "espia.siguiente": { es: "Siguiente", en: "Next", fr: "Suivant" },
  "espia.vacio_pagina": { es: "Nadie en esta página con esos filtros. Prueba otra página o quita el filtro de poder.", en: "No one on this page with those filters. Try another page or clear the power filter.", fr: "Personne sur cette page avec ces filtres. Essayez une autre page ou retirez le filtre de puissance." },
  "espia.login": { es: "Entra con tu cuenta para espiar builds de otros jugadores.", en: "Sign in to spy on other players' builds.", fr: "Connectez-vous pour espionner les builds des autres joueurs." },
  "espia.entrar": { es: "Entrar", en: "Sign in", fr: "Connexion" },
  "espia.vacio": { es: "Nadie con ese nombre en esta región. Prueba otra ortografía o cambia de región.", en: "No one with that name in this region. Try another spelling or switch region.", fr: "Personne avec ce nom dans cette région. Essayez une autre orthographe ou changez de région." },
  "espia.chip": { es: "Espiado", en: "Spied", fr: "Espionné" },
  "espia.otro": { es: "Espiar a otro", en: "Spy on another", fr: "Espionner un autre" },
  "espia.solo_lectura": {
    es: "Datos reales de NCSOFT: equipo, niveles de skill, Daevanion y poder. Las especializaciones elegidas, la barra y la macro no las publica NCSOFT: no las inventamos. Solo lectura.",
    en: "Live NCSOFT data: gear, skill levels, Daevanion and power. Chosen specializations, hotbar and macro are not published by NCSOFT — we don't invent them. View-only.", fr: "Données NCSOFT en direct : équipement, niveaux de compétences, Daevanion et puissance. Les spécialisations choisies, la barre et la macro ne sont pas publiées par NCSOFT — on ne les invente pas. Lecture seule."
  },
  "espia.sin_esp": {
    es: "Especializaciones elegidas: estos datos no los proporciona NCSOFT.",
    en: "Chosen specializations: NCSOFT does not provide this data.", fr: "Spécialisations choisies : NCSOFT ne fournit pas ces données."
  },
  "barra.aviso_espia_tit": { es: "Sin barra ni macro de NCSOFT", en: "No hotbar or macro from NCSOFT", fr: "Pas de barre ni de macro chez NCSOFT" },
  "barra.aviso_espia": {
    es: "Estos datos no los proporciona NCSOFT. No mostramos una plantilla inventada: la barra y la macro del jugador no están en la API.",
    en: "NCSOFT does not provide this data. We don't show an invented template: the player's hotbar and macro are not in the API.", fr: "NCSOFT ne fournit pas ces données. On n’affiche pas de modèle inventé : la barre et la macro du joueur ne sont pas dans l’API."
  },
  "barra.sin_nc": {
    es: "Sin barra ni macro: NCSOFT no publica esta información.",
    en: "No hotbar or macro: NCSOFT does not publish this information.", fr: "Pas de barre ni de macro : NCSOFT ne publie pas cette information."
  },
  "espia.ver": { es: "Ver build", en: "View build", fr: "Voir la build" },
  "espia.elyos": { es: "Elyos", en: "Elyos", fr: "Élyséens" },
  "espia.asmodian": { es: "Asmodian", en: "Asmodian", fr: "Asmodiens" },
  "espia.servidor": { es: "Servidor", en: "Server", fr: "Serveur" },
  "espia.facción": { es: "Facción", en: "Faction", fr: "Facción" },
  "espia.clase": { es: "Clase", en: "Class", fr: "Classe" },
  "espia.genero": { es: "Género", en: "Gender", fr: "Genre" },
  "espia.male": { es: "Masculino", en: "Male", fr: "Homme" },
  "espia.female": { es: "Femenino", en: "Female", fr: "Femme" },
  "espia.titulo_activo": { es: "Título activo", en: "Active title", fr: "Titre actif" },
  "espia.gremio": { es: "Legión", en: "Legion", fr: "Légion" },
  "espia.region_nc": { es: "Región NC", en: "NC region", fr: "Région NC" },
  "espia.server_id": { es: "ID servidor", en: "Server ID", fr: "ID serveur" },
  "espia.pc_id": { es: "ID clase (pcId)", en: "Class ID (pcId)", fr: "ID de classe (pcId)" },
  "espia.race_id": { es: "ID raza", en: "Race ID", fr: "ID raza" },
  "espia.titulo_id": { es: "ID título", en: "Title ID", fr: "ID de titre" },
  "espia.character_id": { es: "ID personaje", en: "Character ID", fr: "ID personnage" },
  "espia.nivel_objeto": { es: "Nivel de objeto", en: "Item level", fr: "Niveau d’objet" },
  "espia.ilvl": { es: "iLvl", en: "iLvl", fr: "iLvl" },
  "espia.ficha_titulo": { es: "Ficha completa", en: "Full profile", fr: "Profil complet" },
  "espia.atributos": { es: "Atributos y afinidades", en: "Attributes and affinities", fr: "Attributs et affinités" },
  "espia.tableros": { es: "Tableros Daevanion", en: "Daevanion boards", fr: "Tableaux Daevanion" },
  "espia.tablero_abierto": { es: "Abierto", en: "Open", fr: "Ouvert" },
  "espia.tablero_cerrado": { es: "Cerrado", en: "Closed", fr: "Fermé" },
  "espia.titulos": { es: "Títulos", en: "Titles", fr: "Titres" },
  "espia.titulos_cuenta": { es: "{n} de {total} títulos", en: "{n} of {total} titles", fr: "{n} sur {total} titres" },
  "espia.ver_titulos": { es: "Ver lista de títulos", en: "Show title list", fr: "Afficher la liste des titres" },
  "espia.titulo_rareza": { es: "{n}/{total} jugadores · {p}%", en: "{n}/{total} players · {p}%", fr: "{n}/{total} joueurs · {p} %" },
  "espia.ranking": { es: "Ranking", en: "Ranking", fr: "Classement" },
  "espia.carga_titulo": { es: "Consultando AION 2…", en: "Querying AION 2…", fr: "Interrogation d’AION 2…" },
  "espia.carga_1": { es: "Consultando la base de datos oficial de AION 2…", en: "Querying the official AION 2 database…", fr: "Interrogation de la base officielle AION 2…" },
  "espia.carga_2": { es: "Leyendo ficha, equipo y habilidades…", en: "Reading profile, gear and skills…", fr: "Lecture du profil, de l’équipement et des compétences…" },
  "espia.carga_3": { es: "Esto puede tardar unos segundos la primera vez…", en: "This can take a few seconds the first time…", fr: "Cela peut prendre quelques secondes la première fois…" },
  "espia.carga_4": { es: "La próxima vez saldrá más rápido (queda en caché)…", en: "Next time it will be faster (it stays cached)…", fr: "La prochaine fois ce sera plus rapide (mise en cache)…" },
  "espia.carga_catalogo": { es: "Preparando la vista de la build…", en: "Preparing the build view…", fr: "Préparation de la vue build…" },
  "espia.carga_hint": { es: "No cierres la página: estamos hablando con los servidores de NCSOFT.", en: "Don't close the page: we're talking to NCSOFT's servers.", fr: "Ne fermez pas la page : nous parlons aux serveurs NCSOFT." },
  "espia.carga_error": { es: "No se pudo leer la ficha", en: "Couldn't read the profile", fr: "Impossible de lire le profil" },
  "espia.carga_error_hint": { es: "A veces NC tarda o no responde. Prueba otra vez en unos segundos.", en: "Sometimes NC is slow or unresponsive. Try again in a few seconds.", fr: "Parfois NC est lent ou ne répond pas. Réessayez dans quelques secondes." },
  "espia.reintentar": { es: "Reintentar", en: "Retry", fr: "Réessayer" },
  "espia.abriendo": { es: "Abriendo ficha…", en: "Opening profile…", fr: "Ouverture du profil…" },
  "guias.antetitulo": { es: "Aion 2 Forge", en: "Aion 2 Forge", fr: "Aion 2 Forge" },
  "guias.sub": { es: "Resúmenes claros de AION 2: por dónde empezar, qué mejorar y qué ignorar.", en: "Clear AION 2 write-ups: where to start, what to upgrade and what to ignore.", fr: "Guides AION 2 clairs : par où commencer, quoi améliorer et quoi ignorer." },
  "guias.buscar": { es: "Buscar una guía…", en: "Search a guide…", fr: "Chercher un guide…" },
  "guias.todas": { es: "Todas", en: "All", fr: "Tous" },
  "guias.leer": { es: "Leer", en: "Read", fr: "Lire" },
  "guias.destacada": { es: "Empieza por aquí", en: "Start here", fr: "Commencer ici" },
  "guias.vacio": { es: "Ninguna guía coincide con esa búsqueda.", en: "No guide matches that search.", fr: "Aucun guide ne correspond à cette recherche." },
  "guias.n": { es: "{n} guías", en: "{n} guides", fr: "{n} guides" },
  "nav.mis": { es: "Mis builds", en: "My builds", fr: "Mes builds" },
  "nav.entrar": { es: "Entrar", en: "Sign in", fr: "Connexion" },
  "nav.salir": { es: "Salir", en: "Sign out", fr: "Déconnexion" },
  "nav.menu": { es: "Menú", en: "Menu", fr: "Menú" },
  "nav.idioma": { es: "Idioma", en: "Language", fr: "Langue" },
  "nav.gremio": { es: "Legión", en: "Legion", fr: "Légion" },
  "nav.comunidad_tag": { es: "Comunidad EU", en: "EU Community", fr: "Communauté EU" },
  "nav.foro": { es: "Foro", en: "Forum", fr: "Forum" },
  "nav.chat": { es: "Chat", en: "Chat", fr: "Chat" },
  "nav.panel": { es: "Panel", en: "Panel", fr: "Panel" },
  "nav.super": { es: "Super", en: "Super", fr: "Super" },
  "pest.habilidades": { es: "Habilidades", en: "Skills", fr: "Compétences" },
  "pest.barra": { es: "Barra y macro", en: "Hotbar & macro", fr: "Barre & macro" },
  "build.abrir_principal": { es: "Copiar o editar en Aion 2 Forge", en: "Copy or edit on Aion 2 Forge", fr: "Copier ou modifier sur Aion 2 Forge" },
  "pest.daevanion": { es: "Daevanion", en: "Daevanion", fr: "Daevanion" },
  "comun.cargando": { es: "Cargando…", en: "Loading…", fr: "Chargement…" },
  "dae.niveles": { es: "nv.", en: "lv.", fr: "nv." },
  "dae.inicio": { es: "Inicio del tablero", en: "Board start", fr: "Début du tableau" },
  "dae.coste": { es: "Coste", en: "Cost", fr: "Coût" },
  "dae.nivel": { es: "Nv.", en: "Lv.", fr: "Nv." },
  "dae.desde_nivel": { es: "desde nivel", en: "from level", fr: "à partir du niveau" },
  "dae.g_inicio": { es: "Inicio", en: "Start", fr: "Début" },
  "dae.g_comun": { es: "Común", en: "Common", fr: "Común" },
  "dae.g_raro": { es: "Raro", en: "Rare", fr: "Raro" },
  "dae.g_leyenda": { es: "Legendario", en: "Legendary", fr: "Legendario" },
  "dae.g_unico": { es: "Único", en: "Unique", fr: "Único" },
  "dae.puntos": { es: "Puntos gastados", en: "Points spent", fr: "Points dépensés" },
  "dae.p_cristal": { es: "Cristales de Daevanion", en: "Daevanion crystals", fr: "Cristaux Daevanion" },
  "dae.p_batalla": { es: "Cristales de batalla", en: "Battle crystals", fr: "Cristaux de bataille" },
  "dae.p_conquista": { es: "Cristales de conquista", en: "Conquest crystals", fr: "Cristaux de conquête" },
  "dae.estadisticas": { es: "Estadísticas totales", en: "Total stats", fr: "Stats totales" },
  "dae.habilidades": { es: "Niveles de habilidad extra", en: "Bonus skill levels", fr: "Niveaux de compétences bonus" },
  "dae.nada": { es: "Aún no hay nodos activados.", en: "No nodes activated yet.", fr: "Aucun nœud activé pour l’instant." },
  "dae.plantilla": { es: "Cargar plantilla de la clase", en: "Load class template", fr: "Charger le modèle de classe" },
  "dae.plantilla_conf": { es: "Esto sustituye tus presets de Daevanion por los de la build de referencia. ¿Seguir?", en: "This replaces your Daevanion presets with the reference build's. Continue?", fr: "Cela remplace vos presets Daevanion par la build de référence. Continuer ?" },
  "dae.sin_presets": { es: "Esta build no tiene Daevanion.", en: "This build has no Daevanion.", fr: "Cette build n’a pas de Daevanion." },
  "dae.sin_datos": { es: "El Daevanion de esta clase aún no está disponible.", en: "This class's Daevanion isn't available yet.", fr: "Le Daevanion de cette classe n’est pas encore disponible." },
  "dae.empieza": { es: "Crea un preset o carga la plantilla de tu clase para empezar.", en: "Create a preset or load your class template to start.", fr: "Créez un preset ou chargez le modèle de classe pour commencer." },
  "dae.llenar": { es: "Completar tablero", en: "Fill board", fr: "Remplir le tableau" },
  "dae.vaciar": { es: "Vaciar tablero", en: "Clear board", fr: "Vider le tableau" },
  "dae.no_enlaza": { es: "Ese nodo no enlaza con ninguno activo.", en: "That node isn't linked to an active one.", fr: "Ce nœud n’est pas lié à un nœud actif." },
  "dae.ayuda_ver": { es: "Pasa el ratón por un nodo para ver su efecto. Los tableros se desbloquean por nivel; Ariel usa cristales de conquista y Azphel de batalla.", en: "Hover a node to see its effect. Boards unlock by level; Ariel uses conquest crystals and Azphel battle crystals.", fr: "Survolez un nœud pour voir son effet. Les tableaux se débloquent par niveau ; Ariel utilise des cristaux de conquête et Azphel des cristaux de bataille." },
  "dae.ayuda_editar": { es: "Clic en un nodo enlazado (brillante) para activarlo; clic en uno activo para quitarlo junto con los que dependan de él.", en: "Click a linked (glowing) node to activate it; click an active one to remove it along with the nodes that depend on it.", fr: "Cliquez un nœud lié (lumineux) pour l’activer ; cliquez un nœud actif pour le retirer avec ceux qui en dépendent." },
  "barra.titulo_barra": { es: "Barra de habilidades", en: "Skill hotbar", fr: "Barre de compétences" },
  "barra.titulo_macro": { es: "Macro", en: "Macro", fr: "Macro" },
  "barra.vacia": { es: "Este preset aún no tiene barra.", en: "This preset has no hotbar yet.", fr: "Ce preset n’a pas encore de barre." },
  "barra.sin_macro": { es: "Sin macro: todo se pulsa a mano.", en: "No macro: everything is pressed manually.", fr: "Pas de macro : tout se joue à la main." },
  "barra.sin_presets": { es: "Esta build no tiene barra ni macro.", en: "This build has no hotbar or macro.", fr: "Cette build n’a ni barre ni macro." },
  "barra.empieza": { es: "Crea un preset o carga la plantilla de tu clase para empezar.", en: "Create a preset or load your class template to start.", fr: "Créez un preset ou chargez le modèle de classe pour commencer." },
  "barra.nota_prioridad": {
    es: "Cada tecla apila hasta 4 habilidades: la de abajo (fila 0) tiene más prioridad y el juego lanza la primera que no esté en enfriamiento.",
    en: "Each key stacks up to 4 skills: the bottom one (row 0) has top priority and the game fires the first one off cooldown.", fr: "Chaque touche empile jusqu’à 4 compétences : celle du bas (rang 0) a la priorité et le jeu lance la première disponible."
  },
  "barra.uso_macro": { es: "Macro", en: "Macro", fr: "Macro" },
  "barra.uso_mano": { es: "A mano", en: "Manual", fr: "Manuel" },
  "barra.uso_ambas": { es: "Macro y mano", en: "Macro & manual", fr: "Macro & manuel" },
  "barra.mantener": { es: "Mantén", en: "Hold", fr: "Maintenir" },
  "barra.bucle": { es: "Se repite mientras mantengas la tecla", en: "Repeats while you hold the key", fr: "Se répète tant que vous maintenez la touche" },
  "barra.editar": { es: "Editar preset", en: "Edit preset", fr: "Modifier le preset" },
  "barra.nombre_preset": { es: "Nombre del preset", en: "Preset name", fr: "Nom du preset" },
  "barra.quitar_preset": { es: "Borrar preset", en: "Delete preset", fr: "Supprimer le preset" },
  "barra.quitar_preset_conf": { es: "¿Borrar este preset con su barra y su macro?", en: "Delete this preset with its hotbar and macro?", fr: "Supprimer ce preset avec sa barre et sa macro ?" },
  "barra.nuevo_preset": { es: "Preset", en: "Preset", fr: "Preset" },
  "barra.preset": { es: "Preset", en: "Preset", fr: "Preset" },
  "barra.plantilla": { es: "Cargar plantilla de la clase", en: "Load class template", fr: "Charger le modèle de classe" },
  "barra.plantilla_conf": { es: "Esto sustituye la barra y la macro de este preset. ¿Seguir?", en: "This replaces this preset's hotbar and macro. Continue?", fr: "Cela remplace la barre et la macro de ce preset. Continuer ?" },
  "barra.plantilla_ok": { es: "Plantilla cargada (build de referencia)", en: "Template loaded (reference build)", fr: "Modèle chargé (build de référence)" },
  "barra.tecla": { es: "Tecla", en: "Key", fr: "Tecla" },
  "barra.nombre_linea": { es: "Nombre de la línea (opcional)", en: "Line name (optional)", fr: "Line Nonm (Facultatif)" },
  "barra.fila_0": { es: "Fila 0: máxima prioridad", en: "Row 0: top priority", fr: "Fila 0: máxima prioridad" },
  "barra.fila_n": { es: "Fila {n}", en: "Row {n}", fr: "Row {n}" },
  "barra.quitar": { es: "Quitar", en: "Remove", fr: "Retirer" },
  "barra.nueva_linea": { es: "Añadir tecla", en: "Add key", fr: "Añadir tecla" },
  "barra.tecla_macro": { es: "Tecla de la macro", en: "Macro key", fr: "Tecla de la macro" },
  "barra.nuevo_paso": { es: "Añadir paso", en: "Add step", fr: "Añadir paso" },
  "barra.notas": { es: "Notas (cuándo pulsar cada cosa, cancelaciones…)", en: "Notes (when to press what, cancels…)", fr: "Nontes (when à press what, Annulers…)" },
  "barra.buscar": { es: "Buscar habilidad…", en: "Search skill…", fr: "Rechercher compétence…" },
  "barra.vaciar": { es: "Vaciar hueco", en: "Clear slot", fr: "Vaciar hueco" },
  "barra.como": { es: "Cómo se configura en el juego", en: "How to set it up in game", fr: "How à set it up dans Jeu" },
  "barra.paso1": { es: "Asigna la tecla de macro en Ajustes → Teclas → General → Juego → Macro (viene sin asignar).", en: "Bind the macro key in Settings → Key settings → General → Gameplay → Macro (unbound by default).", fr: "Asigna la tecla de macro en Ajustes → Teclas → Generau → Jeu → Macro (viene sans asignar)." },
  "barra.paso2": { es: "En la barra, apila hasta 4 habilidades por tecla: abajo la más importante, arriba las de relleno sin enfriamiento.", en: "On the hotbar, stack up to 4 skills per key: the most important at the bottom, no-cooldown fillers on top.", fr: "En la barra, apila jusqu’à 4 habilidades por tecla: abajo la plus importante, arriba las de relleno sans enfriamiento." },
  "barra.paso3": { es: "Abre Habilidades (K) → Macro y añade teclas completas como pasos, con 10 ms de retraso (40-50 ms si tienes mucho ping).", en: "Open Skills (K) → Macro and add whole keys as steps, 10 ms delay each (40–50 ms on high ping).", fr: "Abre Compétences (K) → Macro et añade teclas completas como pasos, avec 10 ms de retraso (40-50 ms si as mucho ping)." },
  "barra.paso4": { es: "Cada uno de los 3 presets guarda sus niveles, estigmas y su macro (Alt + Num 4/5/6).", en: "Each of the 3 presets keeps its own levels, stigmas and macro (Alt + Num 4/5/6).", fr: "Cada uno des 3 presets guarda ses niveles, estigmas et son macro (Alt + Num 4/5/6)." },
  "barra.paso5": { es: "Deja fuera de la macro los buffs, defensivas, desplazamientos y habilidades cargadas. Usa el modo de control AION 2.", en: "Keep buffs, defensives, dashes and charged skills out of the macro. Use the AION 2 control mode.", fr: "Deja fuera de la macro los buffs, defensivas, desplazamientos et habilidades cargadas. Usa el modo de avectrol AION 2." },
  "barra.fuentes": { es: "Según las guías de", en: "Based on the guides from", fr: "Based sur le Guides de" },
  "legado.solo_es": { es: "", en: "This reference guide is only available in Spanish for now.", fr: "Ce reference guide is only available dans Spanish pour Nonw." },
  "legado.ref_titulo": { es: "Guía de referencia de la clase", en: "Class reference guide", fr: "Classe reference guide" },
  "legado.ver_clase": { es: "Todas las habilidades y builds de la clase", en: "All class skills and builds", fr: "Tous Classe Compétences et Builds" },
  "legado.abrir_build": { es: "Abrir como build (copiar a mis builds)", en: "Open as a build (copy to my builds)", fr: "Ouvrir como build (copiar a mis builds)" },
  "legado.volver_guias": { es: "← Todas las guías", en: "← All guides", fr: "← Toutes las guías" },
  "legado.no_existe": { es: "No existe esa guía.", en: "That guide does not exist.", fr: "No existe esa guía." },
  "legado.no_clase": { es: "No existe esa clase.", en: "That class does not exist.", fr: "Cela Classe does Nont exist." },

  "inicio.antetitulo": { es: "Comunidad · AION 2", en: "Community · AION 2", fr: "Communauté · AION 2" },
  "inicio.legion_server": { es: "Marchutan", en: "Marchutan", fr: "Marchutan" },
  "inicio.legion_faccion": { es: "Asmodianos", en: "Asmodians", fr: "Asmodiens" },
  "inicio.titulo": { es: "Comunidad Aion 2 Forge", en: "Aion 2 Forge community", fr: "Aion 2 Forge Communauté" },
  "inicio.sub": {
    es: "Web de fans de AION 2 en Europa: Espía Builds, tops, mapa, timers, guías y herramientas. Abierta a toda la comunidad, ES y EN.",
    en: "AION 2 fan site for Europe: Spy Builds, tops, map, timers, guides and tools. Open to the whole community, ES and EN.", fr: "Web de fans de AION 2 en Europe: Espion Builds, tops, mapa, timers, guías et herramientas. Abierta a toda la comunidad, ES et EN."
  },
  "inicio.cta_comunidad": { es: "Comunidad", en: "Community", fr: "Communauté" },
  "inicio.cta_discord": { es: "Discord", en: "Discord", fr: "Discord" },
  "inicio.cta_herramientas": { es: "Ver herramientas ↓", en: "See tools ↓", fr: "See Outils ↓" },
  "inicio.patrocinio": {
    es: "Herramientas abiertas a toda Europa · comunidad Aion 2 Forge.",
    en: "Tools open to all of Europe · Aion 2 Forge community.", fr: "Outils Ouvrir à Tous de Europe · Aion 2 Forge Communauté."
  },
  "inicio.slide.prev": { es: "Anterior", en: "Previous", fr: "Précédent" },
  "inicio.slide.next": { es: "Siguiente", en: "Next", fr: "Suivant" },
  "inicio.slide.legion_chip": { es: "Aion 2 Forge", en: "Aion 2 Forge", fr: "Aion 2 Forge" },
  "inicio.slide.espia_chip": { es: "Espía · compara · gratis", en: "Spy · compare · free", fr: "Espion · compare · gratuit" },
  "inicio.slide.espia_titulo": { es: "Espía Builds: la build real de cualquiera", en: "Spy Builds: anyone's real build", fr: "Espion Builds: la build reau de n’importe quela" },
  "inicio.slide.espia_txt": {
    es: "Busca un nombre EU y abre equipo, skills, Daevanion, poder e iLvl. Sin cuenta.",
    en: "Search an EU name and open gear, skills, Daevanion, power and iLvl. No account.", fr: "Rechercher an EU Nonm et Ouvrir Équipement, Compétences, Daevanion, Puissance et iLvl. Non Compte."
  },
  "inicio.slide.espia_cta": { es: "Abrir Espía Builds", en: "Open Spy Builds", fr: "Ouvrir Espion Builds" },
  "inicio.slide.tops_chip": { es: "Comunidad", en: "Community", fr: "Communauté" },
  "inicio.slide.tops_titulo": { es: "Tops de lo que la comunidad espía", en: "Tops from what the community spies", fr: "Tops de what le Communauté spies" },
  "inicio.slide.tops_txt": {
    es: "Ranking por poder e iLvl de personajes descubiertos al espiar.",
    en: "Rankings by power and iLvl from characters found while spying.", fr: "Classeements by Puissance et iLvl de personnages found while Espioning."
  },
  "inicio.slide.tops_cta": { es: "Ver tops", en: "See tops", fr: "Voir tops" },
  "inicio.slide.timers_chip": { es: "Utilidades", en: "Utilities", fr: "Utilidades" },
  "inicio.slide.timers_titulo": { es: "Timers: grieta, jefes y Shugo", en: "Timers: rift, bosses and Shugo", fr: "Timers: grieta, jefes et Shugo" },
  "inicio.slide.timers_txt": {
    es: "Horarios a tu zona. Europa por defecto; elige región y cuenta atrás en vivo.",
    en: "Schedules in your timezone. Europe by default; pick a region and live countdown.", fr: "Horarios a votre zona. Europe por defecto; choisissez región et cuenta atrás en vivo."
  },
  "inicio.slide.timers_cta": { es: "Abrir timers", en: "Open timers", fr: "Ouvrir Timers" },
  "inicio.slide.ht_chip": { es: "Calculadoras", en: "Calculators", fr: "Cauculadoras" },
  "inicio.slide.ht_titulo": { es: "Herramientas: mejora, craft y más", en: "Tools: enhance, craft and more", fr: "Outils: Améliorer, craft et plus" },
  "inicio.slide.ht_txt": {
    es: "Pity, Amplify, Manastones, Pantheon y Arcana con datos citados.",
    en: "Pity, Amplify, Manastones, Pantheon and Arcana with cited data.", fr: "Pity, Amplify, Manastones, Pantheon et Arcana avec datos citados."
  },
  "inicio.slide.ht_cta": { es: "Ver herramientas", en: "See tools", fr: "See Outils" },
  "inicio.slide.mapa_chip": { es: "Mundo", en: "World", fr: "Mundo" },
  "inicio.slide.mapa_titulo": { es: "Mapa de rubí, odyle y recolección", en: "Ruby, odyle and gathering map", fr: "Ruby, odyle et gatheAnneau Carte" },
  "inicio.slide.mapa_txt": {
    es: "Nodos por zona para farmear sin perderte. Filtros listos en el móvil.",
    en: "Nodes by zone so you farm without getting lost. Mobile-ready filters.", fr: "Nondes by zone so vous farm sans getting lost. Mobile-ready Filtrers."
  },
  "inicio.slide.mapa_cta": { es: "Abrir mapa", en: "Open map", fr: "Ouvrir Carte" },
  "inicio.slide.guias_chip": { es: "Progresión", en: "Progression", fr: "Progresión" },
  "inicio.slide.guias_titulo": { es: "Guías sin inventar datos de NC", en: "Guides with no invented NC data", fr: "Guides sans inventar datos de NC" },
  "inicio.slide.guias_txt": {
    es: "Progresión, mazmorras y sistemas con fuentes citadas. ES y EN.",
    en: "Progression, dungeons and systems with cited sources. ES and EN.", fr: "Progresión, mazmorras et sistemas avec fuentes citadas. ES et EN."
  },
  "inicio.slide.guias_cta": { es: "Leer guías", en: "Read guides", fr: "Leer guías" },
  "inicio.espia": { es: "Abrir Espía Builds", en: "Open Spy Builds", fr: "Ouvrir Espion Builds" },
  "inicio.espia_chip": { es: "Espía · compara · gratis", en: "Spy · compare · free", fr: "Espion · compare · gratuit" },
  "inicio.espia_titulo": { es: "Espía Builds y compara con la tuya", en: "Spy Builds and compare with yours", fr: "Espion Builds et compour avec la votredéjà" },
  "inicio.espia_txt": {
    es: "Elige región (EU, NA, LA, Asia), busca un nombre y ábrelo como build (equipo, skills, Daevanion, poder e iLvl). Luego compáralo con tu personaje o con una build tuya: ves qué te falta y qué sobra. Sin cuenta para espiar.",
    en: "Pick a region (EU, NA, LA, Asia), search a name and open it as a build (gear, skills, Daevanion, power and iLvl). Then compare it with your character or one of your builds: see what you're missing and what you can drop. No account needed to spy.", fr: "Pick a Région (EU, NA, LA, Asia), Rechercher a Nonm et Ouvrir it as a build (Équipement, Compétences, Daevanion, Puissance et iLvl). Then compare it avec votre personnage ou one de votre Builds: see what you're missing et what vous can drop. Aucun compte requis à Espion."
  },
  "inicio.espia_cta": { es: "Espiar un personaje", en: "Spy a character", fr: "Espion a personnage" },
  "inicio.espia_comparar": { es: "Comparar con tu build →", en: "Compare with your build →", fr: "Compare avec votre build →" },
  "inicio.espia_tops": { es: "Ver tops de lo espiado →", en: "See tops from spied characters →", fr: "See Tops de spied personnages →" },
  "inicio.dato_clases": { es: "clases", en: "classes", fr: "Classees" },
  "inicio.dato_habilidades": { es: "habilidades", en: "skills", fr: "Compétences" },
  "inicio.dato_builds": { es: "builds públicas", en: "public builds", fr: "builds públicas" },
  "inicio.dato_guias": { es: "guías", en: "guides", fr: "guías" },
  "inicio.dato_visitas": { es: "visitas", en: "visits", fr: "visitas" },
  "inicio.crear": { es: "Crear mi build", en: "Create my build", fr: "Créer my build" },
  "inicio.explorar": { es: "Explorar builds", en: "Browse builds", fr: "Explorar builds" },
  "inicio.tops": { es: "Tops comunitarios", en: "Community tops", fr: "Communauté Tops" },
  "inicio.tops_sub": { es: "Poder e iLvl de personajes descubiertos al espiar", en: "Power and iLvl from characters discovered while spying", fr: "Puissance et iLvl de personnages discovered while Espioning" },
  "inicio.clases": { es: "Elige tu clase", en: "Pick your class", fr: "Pick votre Classe" },
  "inicio.recientes": { es: "Builds publicadas recientemente", en: "Recently published builds", fr: "Builds publichaques recientemente" },
  "inicio.ver_todas": { es: "Ver todas", en: "See all", fr: "See Tous" },
  "inicio.ver_clases": { es: "Ver todas las clases", en: "See all classes", fr: "See Toutes les Classees" },
  "inicio.fuentes": { es: "Datos y recursos de", en: "Data and assets from", fr: "Data et assets de" },
  "inicio.explora_titulo": { es: "Herramientas de la comunidad", en: "Community tools", fr: "Communauté Outils" },
  "inicio.explora_sub": {
    es: "Espía, tops, progresión y utilidades para jugadores de AION 2 en EU. Proyecto de fans Aion 2 Forge.",
    en: "Spy, tops, progression and utilities for AION 2 players in EU. Aion 2 Forge fan project.", fr: "Espion, tops, progresión et utilidades pour jugadores de AION 2 en EU. Proyecto de fans Aion 2 Forge."
  },
  "inicio.card.espia": { es: "Espía y compara", en: "Spy and compare", fr: "Espion et compour" },
  "inicio.card.espia_txt": { es: "Build real de cualquiera y diff con la tuya", en: "Anyone's real build and diff vs yours", fr: "Build reau de n’importe quela et diff avec la votredéjà" },
  "inicio.card.tops": { es: "Tops", en: "Tops", fr: "Tops" },
  "inicio.card.tops_txt": { es: "Ranking comunitario por poder e iLvl", en: "Community ranking by power and iLvl", fr: "Communauté Classeement by Puissance et iLvl" },
  "inicio.card.timers": { es: "Timers", en: "Timers", fr: "Timers" },
  "inicio.card.timers_txt": { es: "Grieta, jefes, Shugo y resets a tu hora", en: "Rift, bosses, Shugo and resets in your time", fr: "Grieta, jefes, Shugo et resets a votre hora" },
  "inicio.card.herramientas": { es: "Herramientas", en: "Tools", fr: "Outils" },
  "inicio.card.herramientas_txt": { es: "Mejora, craft, pity, Pantheon, Arcana…", en: "Enhance, craft, pity, Pantheon, Arcana…", fr: "Mejora, craft, pity, Pantheon, Arcana…" },
  "inicio.card.mapa": { es: "Mapa", en: "Map", fr: "Carte" },
  "inicio.card.mapa_txt": { es: "Rubí, odyle y nodos de recolección", en: "Ruby, odyle and gathering nodes", fr: "Ruby, odyle et gatheAnneau Nondes" },
  "inicio.card.guias": { es: "Guías", en: "Guides", fr: "Guides" },
  "inicio.card.guias_txt": { es: "Progresión clara, fuentes citadas", en: "Clear progression, cited sources", fr: "Progresión clara, fuentes citadas" },
  "inicio.card.clases": { es: "Clases", en: "Classes", fr: "Classees" },
  "inicio.card.clases_txt": { es: "Las 8 clases, skills y builds", en: "All 8 classes, skills and builds", fr: "Tous 8 Classees, Compétences et Builds" },
  "inicio.card.comunidad": { es: "Comunidad", en: "Community", fr: "Communauté" },
  "inicio.card.comunidad_txt": { es: "Foro y chat de la comunidad", en: "Community forum and chat", fr: "Communauté Forum et Chat" },
  "inicio.card.faq": { es: "Preguntas frecuentes", en: "FAQ", fr: "Foire aux questions" },
  "inicio.card.faq_txt": { es: "Espía, cuenta, idioma y más", en: "Spy, account, language and more", fr: "Espion, Compte, Langue et plus" },

  "clases.antetitulo": { es: "AION 2", en: "AION 2", fr: "AION 2" },
  "clases.titulo": { es: "Clases", en: "Classes", fr: "Classees" },
  "clases.sub": { es: "Ocho caminos. Elige el tuyo: habilidades, builds de la comunidad y guía de referencia.", en: "Eight paths. Pick yours: skills, community builds and a reference guide.", fr: "Ocho caminos. Choisissez el votreyo: habilidades, builds de la comunidad et guía de referencia." },
  "clases.ver": { es: "Ver clase", en: "View class", fr: "Voir Classe" },

  "clase.habilidades": { es: "Habilidades", en: "Skills", fr: "Compétences" },
  "clase.builds": { es: "Builds públicas de esta clase", en: "Public builds for this class", fr: "Public Builds pour ce Classe" },
  "clase.guia_ref": { es: "Guía de referencia (barra, equipo y Daevanion)", en: "Reference guide (hotbar, gear and Daevanion)", fr: "Reference guide (Barre de raccourcis, Équipement et Daevanion)" },
  "clase.guia_ext": { es: "Guía en expcarry", en: "Guide on expcarry", fr: "Guía en expcarry" },
  "clase.nivel_vista": { es: "Ver valores a nivel", en: "Show values at level", fr: "Afficher values at Niveau" },
  "clase.crear": { es: "Crear build de", en: "Create build for", fr: "Créer build pour" },

  "nueva.antetitulo": { es: "Mis builds", en: "My builds", fr: "Mes builds" },
  "nueva.titulo": { es: "Nueva build", en: "New build", fr: "Nueva build" },
  "nueva.paso_clase": { es: "Elige la clase", en: "Pick the class", fr: "Pick le Classe" },
  "nueva.paso_clase_txt": { es: "La build queda ligada a esta clase. Luego podrás editar habilidades, barra y Daevanion.", en: "The build is tied to this class. You can then edit skills, hotbar and Daevanion.", fr: "Le build is tied à ce Classe. Vous can then Modifier Compétences, Barre de raccourcis et Daevanion." },
  "nueva.paso_datos": { es: "Nombre y modo", en: "Name and mode", fr: "Nonm et mode" },
  "nueva.paso_datos_txt": { es: "Ponle un nombre claro (por ejemplo el personaje o el rol) y el contenido para el que la usarás.", en: "Give it a clear name (e.g. character or role) and the content you'll use it for.", fr: "Give it a clear Nonm (e.g. personnage ou role) et le content you'll use it pour." },
  "nueva.nombre_ph": { es: "Ej. Mi Templario JcE", en: "E.g. My Templar PvE", fr: "Ej. Mi Templario JcE" },
  "nueva.modo_pve": { es: "Mazmorras, raids y JcE general", en: "Dungeons, raids and general PvE", fr: "Mazmorras, raids et JcE generau" },
  "nueva.modo_pvp": { es: "Abismo, campos y duelos", en: "Abyss, battlegrounds and duels", fr: "Abismo, campos et duelos" },
  "nueva.modo_farm": { es: "Farmeo y rutinas diarias", en: "Farming and daily routines", fr: "Farming et quotidien routines" },
  "nueva.modo_otro": { es: "Pruebas, híbrido u otro uso", en: "Tests, hybrid or other use", fr: "Pruebas, híbrido u autre uso" },
  "nueva.crear": { es: "Crear y editar", en: "Create and edit", fr: "Créer et Modifier" },
  "nueva.cancelar": { es: "Volver a mis builds", en: "Back to my builds", fr: "Retour à Mes Builds" },
  "nueva.otra_via": { es: "¿Prefieres partir del juego?", en: "Prefer to start from the game?", fr: "Prefer à start de le Jeu?" },
  "nueva.otra_via_txt": { es: "Importa tu personaje: se crea una copia editable con lo que llevas puesto ahora.", en: "Import your character: an editable copy is created with what you wear now.", fr: "Import votre personnage: an Modifierable copy is created avec what vous wear Nonw." },
  "nueva.abrir_creador": { es: "Abrir creador completo", en: "Open full creator", fr: "Ouvrir full creator" },

  "tipo.activa": { es: "Activas", en: "Actives", fr: "Activas" },
  "tipo.estigma": { es: "Estigmas", en: "Stigmas", fr: "Estigmas" },
  "tipo.pasiva": { es: "Pasivas", en: "Passives", fr: "Pasivas" },
  "tipo1.activa": { es: "Activa", en: "Active", fr: "Activa" },
  "tipo1.estigma": { es: "Estigma", en: "Stigma", fr: "Estigma" },
  "tipo1.pasiva": { es: "Pasiva", en: "Passive", fr: "Pasiva" },

  "modo.pve": { es: "JcE", en: "PvE", fr: "JcE" },
  "modo.pvp": { es: "JcJ", en: "PvP", fr: "JcJ" },
  "modo.farm": { es: "Farmeo", en: "Farming", fr: "Farmeo" },
  "modo.otro": { es: "Otro", en: "Other", fr: "Otro" },
  "modo.todos": { es: "Todos los modos", en: "All modes", fr: "Tous los modos" },
  "clase.todas": { es: "Todas las clases", en: "All classes", fr: "Toutes les Classees" },

  "builds.titulo": { es: "Builds de la comunidad", en: "Community builds", fr: "Communauté Builds" },
  "builds.buscar": { es: "Buscar por nombre o autor…", en: "Search by name or author…", fr: "Rechercher by Nonm ou author…" },
  "builds.vacio": { es: "Todavía no hay builds públicas con estos filtros.", en: "No public builds match these filters yet.", fr: "Todavía ne il et a builds públicas avec ces filtros." },
  "builds.vacio_cta": {
    es: "¿Quieres publicar la tuya? Entra o regístrate y créala en Mis builds.",
    en: "Want to publish yours? Sign in or register and create it in My builds.", fr: "Want à publish yours? Connexion ou register et créer it dans Mes Builds."
  },
  "builds.entrar": { es: "Entrar / registrarse", en: "Sign in / register", fr: "Connexion / register" },
  "builds.mis": { es: "Ir a Mis builds", en: "Go to My builds", fr: "Ir a Mes builds" },
  "builds.error_local": {
    es: "No se han podido cargar las builds. Comprueba la conexión o abre la web en Render.",
    en: "Could not load builds. Check your connection or open the site on Render.", fr: "Impossible de charger Builds. Check votre connection ou Ouvrir le site sur Render."
  },
  "builds.por": { es: "por", en: "by", fr: "por" },
  "builds.actualizada": { es: "Actualizada", en: "Updated", fr: "Acvotreauizada" },
  "builds.subtitulo": {
    es: "Arriba, tops de la semana por clase (Espía). Abajo, lo que publica la comunidad — filtra JcE o JcJ a tu gusto.",
    en: "Above, weekly tops by class (Spy). Below, community builds — filter PvE or PvP as you like.", fr: "Above, hebdomadaire Tops by Classe (Espion). Below, Communauté Builds — Filtrer PvE ou PvP as vous like."
  },
  "builds.sec_tops": { es: "Tops de la semana", en: "This week’s tops", fr: "Ce semaine’s Tops" },
  "builds.sec_tops_sub": {
    es: "Dos por clase. Instantánea del ranking; no marca JcE ni JcJ.",
    en: "Two per class. Ranking snapshot; not tagged PvE or PvP.", fr: "Two per classe. Classeement snapshot; Nont tagged PvE ou PvP."
  },
  "builds.sec_comunidad": { es: "De la comunidad", en: "From the community", fr: "De le Communauté" },
  "builds.sec_comunidad_sub": {
    es: "Builds publicadas por jugadores (con modo JcE/JcJ) y referencias de la comunidad.",
    en: "Builds published by players (with PvE/PvP mode) and guild references.", fr: "Builds published by joueurs (avec PvE/PvP mode) et guild references."
  },
  "builds.sec_archivo": { es: "Archivo de tops (votos conservados)", en: "Top archive (votes kept)", fr: "Archivo de tops (votos avecêtrevados)" },
  "builds.sec_archivo_sub": {
    es: "Quienes dejaron de ser top siguen aquí con sus me gusta.",
    en: "Former tops stay here with their likes.", fr: "Quienes dejaron de être top siguen ici avec ses me gusta."
  },
  "builds.vacio_filtro": { es: "Nada con ese filtro.", en: "Nothing matches that filter.", fr: "Nonthing matches cela Filtrer." },
  "builds.referencia": { es: "Referencia", en: "Reference", fr: "Referencia" },
  "builds.top": { es: "Top", en: "Top", fr: "Top" },
  "builds.top_semana": { es: "Top semana", en: "Weekly top", fr: "Hebdomadaire top" },
  "builds.ex_top": { es: "Ex-Top", en: "Former top", fr: "Ex-Top" },
  "builds.top_aviso": {
    es: "Instantánea del ranking (Espía). No indica si es JcE o JcJ: solo que ese personaje estaba en el top de la semana.",
    en: "Ranking snapshot (Spy). It does not say PvE or PvP — only that this character was in that week’s top.", fr: "Classeement snapshot (Espion). It does Nont say PvE ou PvP — only cela ce personnage was dans cela semaine’s top."
  },
  "builds.votos": { es: "Votos (👍 / 👎)", en: "Votes (👍 / 👎)", fr: "Votos (👍 / 👎)" },
  "titulo.top_semana": { es: "🏆 Top · {sem}", en: "🏆 Top · {sem}", fr: "🏆 Top · {sem}" },
  "titulo.leyenda": { es: "🏆 Leyenda ({n}× oro)", en: "🏆 Legend ({n}× gold)", fr: "🏆 Legend ({n}× gold)" },
  "titulo.ex_top1": { es: "🏆 Ex-oro ({n})", en: "🏆 Former gold ({n})", fr: "🏆 Former gold ({n})" },
  "titulo.ex_top": { es: "🏅 Ex-Top ({n} sem.)", en: "🏅 Former top ({n} wk)", fr: "🏅 Former top ({n} wk)" },
  "titulo.historial": { es: "Tops anteriores", en: "Past tops", fr: "Tops anteriores" },
  "build.vota": { es: "Vota", en: "Vote", fr: "Vota" },
  "build.like": { es: "Pulgar arriba", en: "Thumbs up", fr: "Jeumbs up" },
  "build.dislike": { es: "Pulgar abajo", en: "Thumbs down", fr: "Jeumbs down" },
  "build.voto_propia": { es: "No puedes votar tu propia build", en: "You can't vote on your own build", fr: "Vous can't vote sur votre own build" },
  "build.voto_entrar": { es: "Entra para votar", en: "Sign in to vote", fr: "Connexion à vote" },
  "build.ver_espia": { es: "Ficha en vivo (Espía)", en: "Live profile (Spy)", fr: "Live profil (Espion)" },
  "notif.titulo": { es: "Notificaciones", en: "Notifications", fr: "Nontifications" },
  "notif.vacio": { es: "Nada nuevo por aquí", en: "Nothing new here", fr: "Nonthing nouveau here" },
  "notif.leer_todas": { es: "Marcar leídas", en: "Mark all read", fr: "Marcar leídas" },
  "err.voto_propia": { es: "No puedes votar tu propia build.", en: "You can't vote on your own build.", fr: "Vous can't vote sur votre own build." },
  "err.dato_invalido": { es: "Dato no válido.", en: "Invalid data.", fr: "Dato ne válido." },
  "err.no_permitido": { es: "No permitido.", en: "Not allowed.", fr: "Nont TousoMer." },
  "noticias.error_local": {
    es: "No se han podido cargar las noticias (hace falta la API). En local usa el preview con datos de Render, o abre la web online.",
    en: "Could not load news (API required). Locally the preview uses Render data, or open the online site.", fr: "Impossible de charger news (API Obligatoire). LocTousy le preVoir uses Render data, ou Ouvrir le online site."
  },

  "build.nivel": { es: "Nv.", en: "Lv.", fr: "Nv." },
  "build.sin_aprender": { es: "Sin aprender", en: "Not learned", fr: "Sin aprender" },
  "build.extra_tit": { es: "En el juego: {total} ({base} con puntos + {extra} Daevanion)", en: "In game: {total} ({base} with points + {extra} Daevanion)", fr: "In game: {total} ({base} with points + {extra} Daevanion)" },
  "build.origen_hab": { es: "hab", en: "skill", fr: "compétence" },
  "build.origen_dae": { es: "daevanion", en: "daevanion", fr: "daevanion" },
  "build.origen_arm": { es: "armadura", en: "armor", fr: "armadura" },
  "build.origen_tit": {
    es: "En el juego: {total}. {hab} con puntos, {dae} de Daevanion, {arm} del equipo.",
    en: "In game: {total}. {hab} from points, {dae} from Daevanion, {arm} from gear.", fr: "In game: {total}. {hab} from points, {dae} from Daevanion, {arm} from gear."
  },
  "build.extra_arm": { es: "Niveles extra de equipo", en: "Extra gear levels", fr: "Extra Équipement Niveaus" },
  "build.tope_hab": { es: "Con puntos, el máximo es 10. Daevanion y el equipo se suman aparte, como en el juego.", en: "Skill points stop at 10. Daevanion and gear add on top, like in the game.", fr: "Compétence points stop at 10. Daevanion et Équipement add sur top, like dans le Jeu." },
  "build.tope_est": { es: "Las estigmas sí suben hasta 20 con fragmentos.", en: "Stigmas can go to 20 with shards.", fr: "Stigmas can go à 20 avec shards." },
  "build.tope_pj": { es: "Requiere personaje nv. {n}", en: "Requires character lv. {n}", fr: "Requires character lv. {n}" },
  "build.tope_puntos": { es: "Máximo {n} con puntos", en: "Max {n} with points", fr: "Max {n} with points" },
  "build.extra_dae": { es: "Niveles extra de Daevanion", en: "Extra Daevanion levels", fr: "Extra Daevanion Niveaus" },
  "build.en_juego": { es: "En el juego", en: "In game", fr: "Dans Jeu" },
  "build.solo_lectura": {
    es: "Así lo llevas ahora en el juego (datos NCSOFT). Especializaciones elegidas, barra y macro no las publica NCSOFT: no las inventamos. Crea una build de este personaje si quieres editarlas.",
    en: "This is what you have in game right now (NCSOFT data). Chosen specializations, hotbar and macro are not published by NCSOFT — we don't invent them. Create a build for this character if you want to edit them.", fr: "Ce is what vous have dans Jeu right Nonw (NCSOFT data). Chosen Specializations, Barre de raccourcis et Macro are Nont published by NCSOFT — we don't invent them. Créer a build pour ce personnage if vous want à Modifier them."
  },
  "build.pulsa_editar": { es: "Pulsa en cualquier habilidad, en la barra o en el tablero para editar.", en: "Click any skill, the hotbar or the board to edit.", fr: "Click any compétence, le Barre de raccourcis ou le board à Modifier." },
  "build.esp": { es: "Especializaciones", en: "Specialties", fr: "Especiauizaciones" },
  "build.propiedades": { es: "Propiedades", en: "Properties", fr: "Propiedades" },
  "build.huecos": { es: "huecos", en: "slots", fr: "huecos" },
  "build.puntos_hab": { es: "Puntos de habilidad", en: "Skill points", fr: "Compétence points" },
  "build.puntos_est": { es: "Puntos de estigma", en: "Stigma points", fr: "Puntos de estigma" },
  "build.editar": { es: "Editar", en: "Edit", fr: "Modifier" },
  "build.ver": { es: "Ver", en: "View", fr: "Voir" },
  "build.guardar": { es: "Guardar", en: "Save", fr: "Enregistrer" },
  "build.guardado": { es: "Guardado", en: "Saved", fr: "Enregistrerd" },
  "build.cambios": { es: "Cambios sin guardar", en: "Unsaved changes", fr: "UnEnregistrerd Changers" },
  "build.copiar": { es: "Copiar a mis builds", en: "Copy to my builds", fr: "Copiar a mis builds" },
  "build.compartir": { es: "Copiar enlace", en: "Copy link", fr: "Copiar enlace" },
  "build.enlace_copiado": { es: "Enlace copiado", en: "Link copied", fr: "Enlace copiado" },
  "build.publica": { es: "Pública", en: "Public", fr: "Pública" },
  "build.publicar": { es: "Publicar en Builds", en: "Publish on Builds", fr: "Publier en Builds" },
  "build.publicar_hint": {
    es: "Actívalo para que tu build salga en Builds de la comunidad. Se guarda al instante.",
    en: "Turn this on so your build appears on community Builds. Saves immediately.", fr: "Turn ce sur so votre build appears sur Communauté Builds. Enregistrers immediately."
  },
  "build.publica_hint": {
    es: "Visible en Builds de la comunidad. Se guarda al instante.",
    en: "Visible on community Builds. Saves immediately.", fr: "Visible sur Communauté Builds. Enregistrers immediately."
  },
  "build.publica_ok": { es: "Build publicada: ya sale en Builds.", en: "Build published: it now appears on Builds.", fr: "Build publichaque: déjà saue en Builds." },
  "build.privada_ok": { es: "Build privada: ya no sale en Builds.", en: "Build private: removed from Builds.", fr: "Build Privé: Retirerd de Builds." },
  "build.ver_en_builds": { es: "Ver en Builds →", en: "See on Builds →", fr: "Voir en Builds →" },
  "build.privada": { es: "Privada", en: "Private", fr: "Privé" },
  "build.ya_publica": { es: "Build publicada", en: "Build published", fr: "Build publichaque" },
  "build.nombre": { es: "Nombre de la build", en: "Build name", fr: "Build Nonm" },
  "build.modo": { es: "Modo", en: "Mode", fr: "Modo" },
  "build.descripcion": { es: "Descripción y notas", en: "Description and notes", fr: "Description et Nontes" },
  "build.videos": { es: "Vídeos", en: "Videos", fr: "Vídeos" },
  "build.videos_ayuda": { es: "Enlaces de YouTube, uno por línea (máx. 6).", en: "YouTube links, one per line (max 6).", fr: "Enlaces de YouTube, uno por línea (máx. 6)." },
  "build.nivel_pj": { es: "Nivel del personaje", en: "Character level", fr: "Personnage Niveau" },
  "build.fuente": { es: "Fuente", en: "Source", fr: "Fuente" },
  "build.cancelar": { es: "Cancelar", en: "Cancel", fr: "Annuler" },
  "build.cancelar_conf": {
    es: "Hay cambios sin guardar. ¿Salir sin guardar?",
    en: "You have unsaved changes. Leave without saving?", fr: "Vous have unEnregistrerd Changers. Leave sans saving?"
  },
  "build.borrar": { es: "Borrar", en: "Delete", fr: "Supprimer" },
  "build.borrar_conf": { es: "¿Borrar esta build? No se puede deshacer.", en: "Delete this build? This cannot be undone.", fr: "Supprimer ce build? Ce canNont be undone." },
  "build.borrar_escribe": {
    es: "Vas a borrar esta build para siempre. Escribe BORRAR para confirmar.",
    en: "This will permanently delete the build. Type DELETE to confirm.", fr: "Ce will permanently Supprimer le build. Type Supprimer à Confirmer."
  },
  "build.borrar_mal": {
    es: "No se ha borrado. Debes escribir exactamente BORRAR.",
    en: "Not deleted. You must type DELETE exactly.", fr: "Nont Supprimerd. Vous must type Supprimer exactly."
  },
  "build.no_existe": { es: "Esta build no existe o es privada.", en: "This build does not exist or is private.", fr: "Ce build does Nont exist ou is Privé." },
  "build.mostrar_todas": { es: "Mostrar también las no aprendidas", en: "Also show skills not learned", fr: "Also afficher Compétences Nont learned" },
  "build.auto": { es: "Se desbloquean solas al subir de nivel", en: "Unlock automatically when levelling", fr: "Unlock automaticTousy when Niveauling" },

  "mis.titulo": { es: "Mis builds", en: "My builds", fr: "Mes builds" },
  "mis.antetitulo": { es: "Tu cuenta", en: "Your account", fr: "Votre Compte" },
  "mis.sub": { es: "Importa tu personaje del juego para editar una copia, o crea una build en blanco. Puedes tener varias por personaje.", en: "Import your in-game character to edit a copy, or create a blank build. You can keep several per character.", fr: "Import votre dans-Jeu personnage à Modifier a copy, ou créer a blank build. Vous can keep several per personnage." },
  "mis.dato_builds": { es: "builds", en: "builds", fr: "builds" },
  "mis.dato_publicas": { es: "públicas", en: "public", fr: "públicas" },
  "mis.dato_habilidades": { es: "habilidades", en: "skills", fr: "Compétences" },
  "mis.dato_nodos": { es: "nodos Daevanion", en: "Daevanion nodes", fr: "Daevanion Nondes" },
  "mis.presets": { es: "presets de barra", en: "hotbar presets", fr: "Barre de raccourcis Presets" },
  "mis.nueva": { es: "Build en blanco", en: "Blank build", fr: "Build en blanco" },
  "mis.nueva_sub": { es: "Sin ficha del juego: empiezas de cero eligiendo clase y modo.", en: "No in-game profile: start from scratch with class and mode.", fr: "Non dans-Jeu profil: start de scratch avec Classe et mode." },
  "mis.crear": { es: "Crear", en: "Create", fr: "Créer" },
  "mis.vacio": { es: "Aún no tienes builds. Importa un personaje o crea una en blanco.", en: "You have no builds yet. Import a character or create a blank one.", fr: "Vous have Non Builds yet. Import a personnage ou créer a blank one." },
  "mis.importar": { es: "Importar del juego", en: "Import from game", fr: "Import de Jeu" },
  "mis.importar_sub": { es: "Busca tu personaje. Se crea una copia editable con habilidades y Daevanion actuales; la ficha del juego no se toca.", en: "Search your character. An editable copy is created with current skills and Daevanion; the live profile is left alone.", fr: "Rechercher votre personnage. An Modifierable copy is created avec current Compétences et Daevanion; le live profil is left alone." },
  "mis.buscar": { es: "Buscar", en: "Search", fr: "Rechercher" },
  "mis.importar_btn": { es: "Crear copia", en: "Create copy", fr: "Créer copy" },
  "mis.importando": { es: "Importando…", en: "Importing…", fr: "Importando…" },
  "mis.personajes": { es: "Tus personajes del juego", en: "Your in-game characters", fr: "Votre dans-Jeu personnages" },
  "mis.personajes_sub": { es: "Ya vinculados a tu cuenta. Ver abre la ficha en caché; Nueva copia crea una build editable.", en: "Already linked to your account. View opens the cached profile; New copy creates an editable build.", fr: "Already linked à votre Compte. Voir Ouvrirs le cached profil; Nouveau copy creates an Modifierable build." },
  "mis.nueva_copia": { es: "Nueva copia", en: "New copy", fr: "Nueva copia" },
  "mis.ver_pj": { es: "Ver", en: "View", fr: "Voir" },
  "mis.cuenta": { es: "Mi cuenta", en: "My account", fr: "My Compte" },
  "juego.actualizar_titulo": { es: "Ficha en caché", en: "Cached profile", fr: "Cached profil" },
  "juego.actualizar_preg": { es: "Última lectura: {cuando}. ¿Quieres pedirle al juego la ficha actual?", en: "Last read: {cuando}. Fetch the current profile from the game?", fr: "Last read: {cuando}. Fetch the current profile from the game?" },
  "juego.actualizar_hint": { es: "La actualización suele tardar 30–60 segundos.", en: "Updating usually takes 30–60 seconds.", fr: "La acvotreauización sonele tardar 30–60 segundos." },
  "juego.actualizar_si": { es: "Actualizar ahora", en: "Update now", fr: "Mettre à jour Nonw" },
  "juego.actualizar_no": { es: "Seguir con la caché", en: "Keep cached version", fr: "Seguir avec la caché" },
  "juego.actualizando": { es: "Actualizando ficha del juego… 30–60 s", en: "Updating in-game profile… 30–60 s", fr: "Updating dans-Jeu profil… 30–60 s" },
  "juego.actualizando_corto": { es: "Actualizando…", en: "Updating…", fr: "Acvotreauizando…" },
  "juego.prog_1": { es: "Contactando con AION 2…", en: "Contacting AION 2…", fr: "Contactando avec AION 2…" },
  "juego.prog_2": { es: "Leyendo equipo y atributos…", en: "Reading gear and attributes…", fr: "Reading Équipement et Attributs…" },
  "juego.prog_3": { es: "Sincronizando ficha…", en: "Syncing profile…", fr: "Syncing profil…" },
  "juego.prog_4": { es: "Casi listo, esperando respuesta…", en: "Almost done, waiting for response…", fr: "Casi listo, esperando respucette…" },
  "juego.prog_ok": { es: "Ficha actualizada", en: "Profile updated", fr: "Profil updated" },
  "juego.refrescar_titulo": { es: "Actualizar ficha", en: "Refresh profile", fr: "Refresh profil" },
  "juego.refrescar_conf": { es: "Se pedirá la ficha actual a AION 2. La que tienes ahora se sustituirá.", en: "The current profile will be fetched from AION 2. Your cached copy will be replaced.", fr: "Le current profil will be fetched de AION 2. Votre cached copy will be replaced." },
  "mis.cuenta_seguridad": { es: "Cuenta y seguridad", en: "Account & security", fr: "Compte & security" },
  "mis.cambiar_clave": { es: "Cambiar contraseña", en: "Change password", fr: "Changer Mot de passe" },
  "mis.clave_actual": { es: "Contraseña actual", en: "Current password", fr: "Current Mot de passe" },
  "mis.clave_nueva": { es: "Contraseña nueva (mín. 8)", en: "New password (min. 8)", fr: "Nouveau Mot de passe (min.. 8)" },
  "mis.clave_ok": { es: "Contraseña cambiada", en: "Password changed", fr: "Mot de passe Changerd" },
  "mis.vinculada": { es: "vinculada a", en: "linked to", fr: "vinculada a" },

  "juego.pregunta": { es: "¿Vincular esta build con tu personaje del juego?", en: "Link this build to your in-game character?", fr: "Link ce build à votre dans-Jeu personnage?" },
  "juego.pregunta_txt": { es: "Busca por nombre y servidor. Verás lo que llevas puesto al lado de esta build, y podrás crear más builds del mismo personaje.", en: "Search by name and server. You'll see what you have equipped next to this build, and you can create more builds for the same character.", fr: "Rechercher by Nonm et Serveur. You'll see what vous have equipped Suivant à ce build, et vous can créer plus Builds pour le same personnage." },
  "juego.buscar": { es: "Buscar personaje", en: "Search character", fr: "Rechercher personnage" },
  "juego.nombre": { es: "Nombre en el juego", en: "In-game name", fr: "Dans-Jeu Nonm" },
  "juego.buscando": { es: "Buscando…", en: "Searching…", fr: "RechercheAnneau…" },
  "juego.leyendo": { es: "Leyendo la ficha del juego…", en: "Reading the in-game profile…", fr: "Reading le dans-Jeu profil…" },
  "juego.vacio": { es: "No hay ningún personaje con ese nombre en esta región.", en: "No character with that name in this region.", fr: "Non personnage avec cela Nonm dans ce Région." },
  "juego.cerrar": { es: "Cerrar", en: "Close", fr: "Fermer" },
  "juego.nv": { es: "nv.", en: "lv.", fr: "nv." },
  "juego.poder": { es: "poder", en: "power", fr: "Puissance" },
  "juego.leido": { es: "Ficha leída", en: "Profile read", fr: "Profil read" },
  "juego.refrescar": { es: "Actualizar ficha", en: "Refresh profile", fr: "Refresh profil" },
  "juego.desvincular": { es: "Quitar vínculo", en: "Unlink", fr: "Quitar vínculo" },
  "juego.desvincular_conf": { es: "¿Quitar el vínculo? La build se queda como está.", en: "Unlink? The build itself stays as it is.", fr: "¿Quitar el vínculo? La build se queda como est." },
  "juego.nueva": { es: "Nueva build de este personaje", en: "New build for this character", fr: "Nouveau build pour ce personnage" },
  "juego.nueva_nombre": { es: "Nombre de la nueva build", en: "Name of the new build", fr: "Nonm de le nouveau build" },
  "juego.comparar": { es: "Comparar", en: "Compare", fr: "Compourr" },
  "juego.json_puntos": { es: "Copiar para puntos", en: "Copy for points", fr: "Copiar pour puntos" },
  "juego.json_puntos_hint": {
    es: "Resumen corto para repartir puntos de habilidad y estigmas. Daevanion y armadura ya van en cada línea.",
    en: "Short summary for spending skill points and stigma shards. Daevanion and armor are already on each line.", fr: "Resonmen corto pour repartir puntos de habilidad et estigmas. Daevanion et armadura déjà van en chaque línea."
  },
  "juego.json_puntos_copiado": { es: "Resumen de puntos copiado", en: "Point summary copied", fr: "Resonmen de puntos copiado" },
  "juego.puntos_puesto": { es: "puesto", en: "slotted", fr: "puesto" },
  "juego.puntos_leyenda": {
    es: "Libres (puntos de habilidad y fragmentos de estigma) no salen aquí: dílos tú. Nv. del cliente = hab + arm. Fr = dae y no va dentro del Nv. pantalla = Nv. + dae. No restes el dae. Tope de hab 10, estigma 20. Coste del rango hab (no de la pantalla): 2-4=1, 5-7=2, 8-10=4. Estigma: 1-5=1, 6-10=2, 11-15=4, 16-20=8. Activa: specs en pantalla 8/12/20. Estigma: propiedades en 5/10/15/20. puesto = estigma en ranura.",
    en: "Free skill points and stigma shards are not here: say them yourself. Client Lv. = skill + armor. Fr = dae and is not inside that Lv. screen = Lv. + dae. Do not subtract dae. Skill cap 10, stigma 20. Cost of the skill rank (not the screen number): 2-4=1, 5-7=2, 8-10=4. Stigma: 1-5=1, 6-10=2, 11-15=4, 16-20=8. Active specs at screen 8/12/20. Stigma properties at 5/10/15/20. slotted = stigma in a slot.", fr: "Libres (puntos de habilidad et fragmentos de estigma) ne sauen ici: dílos tú. Nv. du cliente = hab + arm. Fr = dae et ne va dentro du Nv. pantaula = Nv. + dae. No rces el dae. Tope de hab 10, estigma 20. Coste du rango hab (no de la pantaula): 2-4=1, 5-7=2, 8-10=4. Estigma: 1-5=1, 6-10=2, 11-15=4, 16-20=8. Activa: specs en pantaula 8/12/20. Estigma: propiedades en 5/10/15/20. puesto = estigma en ranura."
  },
  "juego.json_copiar": { es: "Copiar JSON NC", en: "Copy NC JSON", fr: "Copiar JSON NC" },
  "juego.json_descargar": { es: "Descargar JSON", en: "Download JSON", fr: "Descargar JSON" },
  "juego.json_hint": {
    es: "Exporta todos los datos que NCSOFT publica de este personaje (para pegarlos en una IA o guardarlos).",
    en: "Export all data NCSOFT publishes for this character (to paste into an AI or save).", fr: "Export Tous data NCSOFT publishes pour ce personnage (à paste into an AI ou Enregistrer)."
  },
  "juego.json_aviso": {
    es: "Datos publicados por NCSOFT vía Aion 2 Forge. nivel = hab + daevanion + armadura. El Nv. del cliente ya incluye la armadura y no el Daevanion (Fr). No restes el dae. Especializaciones elegidas, barra y macro no vienen en la API.",
    en: "Data published by NCSOFT via Aion 2 Forge. nivel = skill + daevanion + armor. The client Lv. already includes armor and not Daevanion (Fr). Do not subtract dae. Chosen specializations, hotbar and macro are not in the API.", fr: "Datos publicados por NCSOFT vía Aion 2 Forge. nivel = hab + daevanion + armadura. El Nv. du cliente déjà incluye la armadura et ne el Daevanion (Fr). No rces el dae. Especiauizaciones elegidas, barra et macro ne vienen en la API."
  },
  "juego.json_nivel": {
    es: "Nivel efectivo: hab + daevanion + armadura. El Nv. del cliente es hab + armadura; el Fr es el Daevanion, aparte.",
    en: "Effective level: skill + daevanion + armor. The client Lv. is skill + armor; Fr is Daevanion, on top.", fr: "Effective Niveau: compétence + daevanion + armor. Le client Lv. is compétence + armor; Fr is Daevanion, sur top."
  },
  "juego.json_hab": { es: "Puntos gastados. El Nv. del cliente menos la armadura.", en: "Points spent. Client Lv. minus armor.", fr: "Puntos gastados. El Nv. du cliente moins la armadura." },
  "juego.json_dae": { es: "Niveles que dan los nodos de Daevanion abiertos.", en: "Levels from open Daevanion nodes.", fr: "Niveaus de Ouvrir Daevanion Nondes." },
  "juego.json_arm": { es: "Niveles que dan las líneas de habilidad del equipo.", en: "Levels from gear skill lines.", fr: "Niveaus de Équipement compétence lines." },
  "juego.json_origen": {
    es: "Texto ya hecho. Úsalo tal cual; no sumes ni restes.",
    en: "Ready-made text. Use it as-is; do not add or subtract.", fr: "Texto déjà hecho. Úsauo tau cuau; ne sonmes ni rces."
  },
  "juego.json_bonus": { es: "Mapa solo de Daevanion, por id de habilidad. Ya está volcado en habilidades[].daevanion.", en: "Daevanion-only map, by skill id. Already copied into habilidades[].daevanion.", fr: "Carte seulement de Daevanion, por id de habilidad. Ya est volcado en habilidades[].daevanion." },
  "juego.json_bonus_eq": { es: "Mapa solo del equipo, por id de habilidad. Ya está volcado en habilidades[].armadura.", en: "Gear-only map, by skill id. Already copied into habilidades[].armadura.", fr: "Carte seulement du equipo, por id de habilidad. Ya est volcado en habilidades[].armadura." },
  "juego.json_copiado": { es: "JSON NC copiado al portapapeles", en: "NC JSON copied to clipboard", fr: "JSON NC copiado au portapapeles" },
  "juego.json_descargado": { es: "JSON NC descargado", en: "NC JSON downloaded", fr: "JSON NC descargado" },
  "juego.json_error": { es: "No se pudo copiar el JSON", en: "Couldn't copy the JSON", fr: "No se pudo copiar el JSON" },
  "juego.ver": { es: "Ver build del juego", en: "View in-game build", fr: "Voir dans-Jeu build" },
  "juego.mostrar": {
    es: "Dejar ver mi equipo a quien abra esta ficha",
    en: "Let visitors see my in-game gear on this profile", fr: "Let visitors see my dans-Jeu Équipement sur ce profil"
  },
  "juego.mostrar_aviso": {
    es: "Solo enseña armas/armadura. No publica la build. Primero publica con el interruptor de arriba.",
    en: "Only shows weapons/armor. Does not publish the build. Publish with the toggle above first.", fr: "Solo enseña armas/armadura. No publica la build. Primero publica avec el interruptor de arriba."
  },
  "juego.mostrar_aviso_ficha": {
    es: "Solo enseña el equipo en esta ficha. Para salir en Builds, abre o crea una build abajo.",
    en: "Only shows gear on this profile. To appear on Builds, open or create a build below.", fr: "Only shows Équipement sur ce profil. À appear sur Builds, Ouvrir ou créer a build below."
  },
  "juego.mostrar_bloqueado": {
    es: "Primero publica la build (interruptor de arriba). Luego podrás mostrar el equipo.",
    en: "Publish the build first (toggle above). Then you can show gear.", fr: "Primero publica la build (interruptor de arriba). Luego podrás mostrar el equipo."
  },
  "juego.publicar_ficha_tit": {
    es: "Esto es la ficha del juego, no una build",
    en: "This is the in-game profile, not a build", fr: "Ce is le dans-Jeu profil, Nont a build"
  },
  "juego.publicar_ficha_txt": {
    es: "Para que salga en Builds, abre una build tuya (o crea una nueva) y actívala como pública ahí.",
    en: "To appear on Builds, open one of your builds (or create one) and turn Public on there.", fr: "À appear sur Builds, Ouvrir one de votre builds (ou créer one) et turn Public sur there."
  },
  "juego.nueva_publicar": {
    es: "Crear build de este personaje",
    en: "Create a build from this character", fr: "Créer a build de ce personnage"
  },
  "juego.json_mas": { es: "Más opciones JSON", en: "More JSON options", fr: "Plus JSON options" },
  "juego.en_juego": { es: "En el juego", en: "In game", fr: "Dans Jeu" },
  "juego.esta": { es: "Esta build", en: "This build", fr: "Ce build" },
  "juego.contra": { es: "Comparar con", en: "Compare with", fr: "Compare avec" },
  "juego.equipo": { es: "Equipo puesto", en: "Equipped gear", fr: "Equipped Équipement" },
  "juego.daevanion": { es: "Daevanion", en: "Daevanion", fr: "Daevanion" },
  "juego.habilidades": { es: "Habilidades", en: "Skills", fr: "Compétences" },
  "juego.estigmas": { es: "Estigmas", en: "Stigmas", fr: "Estigmas" },
  "juego.aviso_dps": { es: "El daño por segundo lo calcula el servidor del juego y no sale en la ficha. Aquí ves qué sube y qué baja: habilidades, estigmas, Daevanion y el equipo que llevas ahora.", en: "Damage per second is calculated by the game server and is not in the profile. Here you see what goes up and what goes down: skills, stigmas, Daevanion and the gear you are wearing.", fr: "Damage per second is calculated by le Jeu Serveur et is Nont dans le profil. Here vous see what goes up et what goes down: Compétences, stigmas, Daevanion et le Équipement vous are weaAnneau." },
  "juego.aviso_esp": { es: "Las especializaciones no salen en la ficha. Solo están en tus builds.", en: "Specializations are not in the profile. They only exist on your builds.", fr: "Specializations are Nont dans le profil. They only exist sur votre Builds." },
  "juego.sin_dif": { es: "Habilidades, estigmas y Daevanion coinciden con lo que llevas puesto.", en: "Skills, stigmas and Daevanion match what you have equipped.", fr: "Compétences, estigmas et Daevanion coinciden avec lo que llevas puesto." },
  "juego.frase_hab": { es: "Esta build sube {mas} habilidades y baja {menos}.", en: "This build raises {mas} skills and lowers {menos}.", fr: "This build raises {mas} skills and lowers {menos}." },
  "juego.frase_hab_mas": { es: "Esta build sube {mas} habilidades respecto a lo que llevas puesto.", en: "This build raises {mas} skills above what you have equipped.", fr: "This build raises {mas} skills above what you have equipped." },
  "juego.frase_hab_menos": { es: "Esta build baja {menos} habilidades respecto a lo que llevas puesto.", en: "This build lowers {menos} skills below what you have equipped.", fr: "This build lowers {menos} skills below what you have equipped." },
  "juego.frase_est": { es: "Estigmas: {mas} solo en la build, {menos} solo en el juego.", en: "Stigmas: {mas} only on the build, {menos} only in game.", fr: "Stigmas: {mas} only on the build, {menos} only in game." },
  "juego.frase_est_mas": { es: "Estigmas: {mas} solo en la build.", en: "Stigmas: {mas} only on the build.", fr: "Stigmas: {mas} only on the build." },
  "juego.frase_est_menos": { es: "Estigmas: {menos} solo en el juego.", en: "Stigmas: {menos} only in game.", fr: "Stigmas: {menos} only in game." },
  "juego.frase_nodos": { es: "Daevanion: {mas} nodos que no llevas abiertos y {menos} que sí llevas y esta build no.", en: "Daevanion: {mas} nodes you don't have open, and {menos} you have open that this build skips.", fr: "Daevanion: {mas} nodes you don't have open, and {menos} you have open that this build skips." },
  "juego.frase_nodos_mas": { es: "Daevanion: {mas} nodos que no llevas abiertos.", en: "Daevanion: {mas} nodes you don't have open.", fr: "Daevanion: {mas} nodes you don't have open." },
  "juego.frase_nodos_menos": { es: "Daevanion: {menos} nodos que sí llevas abiertos y esta build no.", en: "Daevanion: {menos} nodes you have open that this build skips.", fr: "Daevanion: {menos} nodes you have open that this build skips." },
  "juego.frase_stats": { es: "Con ese tablero ganas {gana} y pierdes {pierde}.", en: "With that board you gain {gana} and lose {pierde}.", fr: "With that board you gain {gana} and lose {pierde}." },
  "juego.frase_stats_gana": { es: "Con ese tablero ganas {gana}.", en: "With that board you gain {gana}.", fr: "With that board you gain {gana}." },
  "juego.frase_stats_pierde": { es: "Con ese tablero pierdes {pierde}.", en: "With that board you lose {pierde}.", fr: "With that board you lose {pierde}." },
  "juego.frase_equipo": { es: "El equipo puesto no forma parte de la build. Ahora mismo suma {ataque} de ataque y {crit} de crítico.", en: "Worn gear is not part of the build. Right now it adds {ataque} attack and {crit} critical.", fr: "Worn gear is not part of the build. Right now it adds {ataque} attack and {crit} critical." },
  "juego.sin_detalle": { es: "De {n} piezas no se ha podido leer el detalle.", en: "Detail could not be read for {n} pieces.", fr: "Detail could not be read for {n} pieces." },
  "juego.base": { es: "sin el extra de Daevanion", en: "without the Daevanion bonus", fr: "sans le Daevanion bonus" },
  "juego.extra": { es: "extra de Daevanion", en: "Daevanion bonus", fr: "extra de Daevanion" },
  "juego.preset": { es: "Preset", en: "Preset", fr: "Preset" },
  "juego.lado_build": { es: "Esta build", en: "This build", fr: "Ce build" },
  "juego.lado_juego": { es: "En el juego", en: "In game", fr: "Dans Jeu" },
  "juego.lado_pj": { es: "Mis personajes", en: "My characters", fr: "My personnages" },
  "juego.lado_otro": { es: "Otro jugador…", en: "Another player…", fr: "ANonther joueur…" },
  "juego.vs": { es: "contra", en: "vs", fr: "avectra" },
  "juego.cambiar_lados": { es: "Intercambiar lados", en: "Swap sides", fr: "Interchanger lados" },
  "juego.elige_lado": { es: "Elige con qué comparar.", en: "Choose what to compare with.", fr: "Choisir what à compare avec." },
  "juego.pasando": { es: "Si pasaras de {a} a {b}:", en: "If you went from {a} to {b}:", fr: "If you went from {a} to {b}:" },
  "juego.cmp_stats": { es: "Estadísticas", en: "Stats", fr: "Estadísticas" },
  "juego.cmp_equipo": { es: "Equipo pieza a pieza", en: "Gear slot by slot", fr: "Équipement slot by slot" },
  "juego.cmp_habs": { es: "Habilidades y estigmas", en: "Skills and stigmas", fr: "Compétences et stigmas" },
  "juego.cmp_dae": { es: "Daevanion", en: "Daevanion", fr: "Daevanion" },
  "juego.cmp_mas": { es: "Ver el resto ({n})", en: "See the rest ({n})", fr: "See the rest ({n})" },
  "juego.sin_pieza": { es: "Vacío", en: "Empty", fr: "Vide" },
  "juego.sin_equipo_lado": { es: "Este lado no tiene equipo.", en: "This side has no gear.", fr: "Ce side has Non Équipement." },
  "juego.eq_igual": { es: "Misma pieza", en: "Same piece", fr: "Misma pieza" },
  "juego.solo_stats_eq": { es: "del equipo", en: "from gear", fr: "de Équipement" },
  "juego.solo_stats_dae": { es: "del Daevanion", en: "from Daevanion", fr: "de Daevanion" },
  "juego.frase_cmp_stats": { es: "Ganarías {gana} y perderías {pierde}.", en: "You would gain {gana} and lose {pierde}.", fr: "You would gain {gana} and lose {pierde}." },
  "juego.frase_cmp_stats_gana": { es: "Ganarías {gana}.", en: "You would gain {gana}.", fr: "You would gain {gana}." },
  "juego.frase_cmp_stats_pierde": { es: "Perderías {pierde}.", en: "You would lose {pierde}.", fr: "You would lose {pierde}." },
  "juego.frase_cmp_hab": { es: "{mas} habilidades subirían y {menos} bajarían.", en: "{mas} skills would go up and {menos} down.", fr: "{mas} skills would go up and {menos} down." },
  "juego.frase_cmp_hab_mas": { es: "{mas} habilidades subirían.", en: "{mas} skills would go up.", fr: "{mas} skills would go up." },
  "juego.frase_cmp_hab_menos": { es: "{menos} habilidades bajarían.", en: "{menos} skills would go down.", fr: "{menos} skills would go down." },
  "juego.frase_cmp_eq": { es: "{n} ranuras de equipo cambian.", en: "{n} gear slots change.", fr: "{n} gear slots change." },
  "juego.nv_hab": { es: "Nv. {n}", en: "Lv. {n}", fr: "Lv. {n}" },
  "juego.buscando_ficha": { es: "Leyendo a {nombre}…", en: "Reading {nombre}…", fr: "Reading {nombre}…" },
  "juego.nodos": { es: "nodos", en: "nodes", fr: "Nondes" },
  "juego.clase_distinta": { es: "{nombre} es {clase} en {servidor}. ¿Crear una build de esa clase, ya rellena con lo que lleva puesto?", en: "{nombre} is a {clase} on {servidor}. Create a build of that class, filled with what they have equipped?", fr: "{nombre} is a {clase} on {servidor}. Create a build of that class, filled with what they have equipped?" },

  "auth.entrar": { es: "Entrar", en: "Sign in", fr: "Connexion" },
  "auth.registro": { es: "Crear cuenta", en: "Create account", fr: "Créer Compte" },
  "auth.usuario": { es: "Usuario", en: "Username", fr: "Nonm d’utiliSameur" },
  "auth.clave": { es: "Contraseña", en: "Password", fr: "Mot de passe" },
  "auth.ayuda_usuario": { es: "3-24 caracteres: letras, números, punto, guion o guion bajo.", en: "3-24 characters: letters, numbers, dot, dash or underscore.", fr: "3-24 caracteres: letras, números, punto, guion ou guion bajo." },

  "err.credenciales": { es: "Usuario o contraseña incorrectos.", en: "Wrong username or password.", fr: "Wrong Nonm d’utiliSameur ou Mot de passe." },
  "err.usuario_invalido": { es: "Nombre de usuario no válido.", en: "Invalid username.", fr: "Invalid Nonm d’utiliSameur." },
  "err.usuario_existe": { es: "Ese usuario ya existe.", en: "That username is taken.", fr: "Cela Nonm d’utiliSameur is taken." },
  "err.clave_corta": { es: "La contraseña debe tener al menos 8 caracteres.", en: "Password must be at least 8 characters.", fr: "Mot de passe must be at least 8 personnages." },
  "err.demasiados_intentos": { es: "Demasiados intentos. Espera unos minutos.", en: "Too many attempts. Wait a few minutes.", fr: "Demasiados intentos. Espera unos minutos." },
  "err.captcha": { es: "Completa la verificación anti-bots e inténtalo de nuevo.", en: "Complete the anti-bot check and try again.", fr: "Completa la voirificación anti-bots e inténtauo de nouveau." },
  "err.bot": { es: "No se pudo crear la cuenta. Recarga la página e inténtalo de nuevo.", en: "Couldn't create the account. Reload the page and try again.", fr: "Couldn't créer le Compte. Reload le page et tentative again." },
  "auth.humano": { es: "¿Cuánto es {q}?", en: "What is {q}?", fr: "What is {q}?" },
  "auth.humano_ayuda": { es: "Anti-bots: escribe el resultado.", en: "Anti-bot: type the result.", fr: "Anti-bot: type le résultat." },
  "err.nombre_vacio": { es: "Ponle un nombre a la build.", en: "Give the build a name.", fr: "Give le build a Nonm." },
  "err.no_autenticado": { es: "Tienes que entrar con tu cuenta.", en: "You need to sign in.", fr: "Vous need à Connexion." },
  "err.sin_permiso": { es: "No tienes permiso para hacer eso.", en: "You don't have permission to do that.", fr: "Vous don't have permission à do cela." },
  "err.expulsado": { es: "Tu cuenta está suspendida temporalmente.", en: "Your account is temporarily suspended.", fr: "Votre Compte is temporarily suspended." },
  "err.texto_vacio": { es: "El texto no es válido o se pasa de largo.", en: "The text is empty or too long.", fr: "Le text is Vide ou too long." },
  "err.tema_cerrado": { es: "Este tema está cerrado.", en: "This thread is closed.", fr: "Ce thread is Fermerd." },
  "err.ya_denunciado": { es: "Ya habías avisado de esto.", en: "You already reported this.", fr: "Vous already reported ce." },
  "err.no_existe": { es: "No se ha encontrado.", en: "Not found.", fr: "No se ha enavectrado." },
  "err.clase_distinta": { es: "Ese personaje es de otra clase.", en: "That character is a different class.", fr: "Cela personnage is a different Classe." },
  "err.clase_no_soportada": { es: "Esa clase todavía no está en la web.", en: "That class is not on the site yet.", fr: "Cela Classe is Nont sur le site yet." },
  "err.juego_no_disponible": { es: "La ficha del juego no responde ahora. Prueba dentro de un momento.", en: "The game profile is not responding right now. Try again in a moment.", fr: "Le Jeu profil is Nont responding right Nonw. Tentative again dans a moment." },
  "err.busqueda_corta": { es: "Escribe al menos 2 letras del nombre.", en: "Type at least 2 letters of the name.", fr: "Saisissez au moins 2 letras du nombre." },
  "err.servidor_invalido": { es: "Elige un servidor válido.", en: "Choose a valid server.", fr: "Choisir a valid Serveur." },
  "err.generico": { es: "Algo ha fallado. Inténtalo de nuevo.", en: "Something went wrong. Try again.", fr: "Algo ha faulado. Inténtauo de nouveau." },

  "foro.titulo": { es: "Foro de la comunidad", en: "Community forum", fr: "Communauté Forum" },
  "foro.aviso": { es: "Se lee sin entrar. Para abrir un tema o responder hay que tener cuenta.", en: "Anyone can read. Opening a thread or replying needs an account.", fr: "Anyone can read. OuvriAnneau a thread ou replying needs an Compte." },
  "foro.nuevo": { es: "Nuevo tema", en: "New thread", fr: "Nuevo tema" },
  "foro.titulo_tema": { es: "Título", en: "Title", fr: "Titre" },
  "foro.texto": { es: "Mensaje", en: "Message", fr: "Message" },
  "foro.publicar": { es: "Publicar", en: "Post", fr: "Publier" },
  "foro.responder": { es: "Responder", en: "Reply", fr: "Responder" },
  "foro.vacio": { es: "Todavía no hay temas aquí.", en: "No threads here yet.", fr: "Todavía ne il et a temas ici." },
  "foro.respuestas": { es: "mensajes", en: "posts", fr: "mensajes" },
  "foro.cerrado": { es: "Cerrado", en: "Closed", fr: "Fermerd" },
  "foro.fijado": { es: "Fijado", en: "Pinned", fr: "Fijado" },
  "foro.cerrado_aviso": { es: "Este tema está cerrado.", en: "This thread is closed.", fr: "Ce thread is Fermerd." },
  "foro.entrar": { es: "Entra para participar", en: "Sign in to take part", fr: "Connexion à take part" },
  "foro.denunciar": { es: "Avisar", en: "Report", fr: "Avisar" },
  "foro.denuncia_motivo": { es: "¿Por qué avisas? Lo verá el equipo de moderación.", en: "Why are you reporting this? The moderation team will see it.", fr: "¿Por qué avisas? Lo voirá el equipo de moderación." },
  "foro.denuncia_ok": { es: "Aviso enviado", en: "Report sent", fr: "Aviso enviado" },
  "foro.citar": { es: "Citar", en: "Quote", fr: "Citar" },
  "foro.cat_avisos": { es: "Avisos", en: "Announcements", fr: "AnNonuncements" },
  "foro.cat_clases": { es: "Clases", en: "Classes", fr: "Classees" },
  "foro.cat_grupos": { es: "Grupos", en: "Groups", fr: "Grupos" },
  "foro.cat_reclutamiento": { es: "Reclutamiento", en: "Recruitment", fr: "Reclutamiento" },
  "foro.cat_offtopic": { es: "Off-topic", en: "Off-topic", fr: "Off-topic" },
  "foro.avisos_solo": { es: "Los avisos los publican los administradores.", en: "Announcements are posted by admins.", fr: "AnNonuncements are posted by Admins." },
  "foro.solo_staff": { es: "Solo el staff (moderadores y admins) puede abrir temas aquí.", en: "Only staff (moderators and admins) can open threads here.", fr: "Only staff (Modérateurs et Admins) can Ouvrir threads here." },
  "foro.solo_admin": { es: "Solo administradores pueden abrir temas aquí.", en: "Only admins can open threads here.", fr: "Solo administradores peuvent ouvrir temas ici." },
  "err.cat_existe": { es: "Ya existe una sección con ese id.", en: "A section with that id already exists.", fr: "A section avec cela id already exists." },
  "super.foro": { es: "Secciones del foro", en: "Forum sections", fr: "Secciones du foro" },
  "super.foro_txt": {
    es: "Crea o edita secciones. Quién puede abrir temas nuevos: Todos, Staff (mod+) o Solo admin. Desactivar oculta la sección sin borrar temas.",
    en: "Create or edit sections. Who can open new threads: Everyone, Staff (mod+) or Admin only. Deactivating hides the section without deleting threads.", fr: "Créer ou Modifier sections. Who can Ouvrir nouveau threads: Everyone, Staff (mod+) ou Admin only. Deactivating hides le section sans deleting threads."
  },
  "super.foro_id": { es: "Id (a-z, 0-9, _)", en: "Id (a-z, 0-9, _)", fr: "Id (a-z, 0-9, _)" },
  "super.foro_nombre_es": { es: "Nombre ES", en: "Name ES", fr: "Nonm ES" },
  "super.foro_nombre_en": { es: "Nombre EN", en: "Name EN", fr: "Nonm EN" },
  "super.foro_desc_es": { es: "Descripción ES", en: "Description ES", fr: "Descripción ES" },
  "super.foro_desc_en": { es: "Descripción EN", en: "Description EN", fr: "Descripción EN" },
  "super.foro_escribir": { es: "Quién escribe", en: "Who can post", fr: "Quién saisissez" },
  "super.foro_todos": { es: "Todos", en: "Everyone", fr: "Tous" },
  "super.foro_staff": { es: "Staff (mod+)", en: "Staff (mod+)", fr: "Staff (mod+)" },
  "super.foro_admin": { es: "Solo admin", en: "Admin only", fr: "Solo admin" },
  "super.foro_orden": { es: "Orden", en: "Order", fr: "Orden" },
  "super.foro_icono": { es: "Icono", en: "Icon", fr: "Iaveco" },
  "super.foro_activa": { es: "Activa", en: "Active", fr: "Activa" },
  "super.foro_crear": { es: "Crear sección", en: "Create section", fr: "Créer section" },
  "super.foro_temas": { es: "temas", en: "threads", fr: "temas" },

  "chat.titulo": { es: "Chat de la comunidad", en: "Community chat", fr: "Communauté Chat" },
  "chat.aviso": { es: "La sala se lee sin entrar. Para hablar hay que tener cuenta. Los mensajes se guardan 14 días.", en: "Anyone can read the room. Talking needs an account. Messages are kept for 14 days.", fr: "La saua se lee sans entrar. Para hablar il et a que tener cuenta. Los mensajes se guardan 14 días." },
  "chat.placeholder": { es: "Escribe a la comunidad…", en: "Message the community…", fr: "Message le Communauté…" },
  "chat.enviar": { es: "Enviar", en: "Send", fr: "Enviar" },
  "chat.vacio": { es: "Todavía no hay mensajes.", en: "No messages yet.", fr: "Todavía ne il et a mensajes." },
  "chat.entrar": { es: "Entra para hablar", en: "Sign in to talk", fr: "Connexion à talk" },

  "panel.titulo": { es: "Panel de moderación", en: "Moderation panel", fr: "Panel de moderación" },
  "panel.antetitulo": { es: "Staff", en: "Staff", fr: "Staff" },
  "panel.sub": { es: "Entraste como {rol}. Revisa la cola, oculta desde el chat/foro y actúa rápido.", en: "Signed in as {rol}. Clear the queue, hide from chat/forum, and act fast.", fr: "Signed in as {rol}. Clear the queue, hide from chat/forum, and act fast." },
  "panel.pendiente": { es: "Pendiente", en: "Pending", fr: "Pendiente" },
  "panel.atajos": { es: "¿Qué quieres hacer?", en: "What do you want to do?", fr: "¿Qué quieres faire?" },
  "panel.atajo_builds": { es: "Tus builds y personajes vinculados", en: "Your builds and linked characters", fr: "Votre Builds et linked personnages" },
  "panel.atajo_chat": { es: "Ir al chat", en: "Go to chat", fr: "Ir au chat" },
  "panel.atajo_foro": { es: "Temas y anuncios", en: "Threads and announcements", fr: "Threads et anNonuncements" },
  "panel.atajo_tops": { es: "Ranking comunitario", en: "Community ranking", fr: "Communauté Classeement" },
  "panel.atajo_espia": { es: "Mirar builds de otros", en: "Scout other builds", fr: "Mirar builds de autres" },
  "panel.atajo_noticias": { es: "Parches y avisos oficiales", en: "Patches and official news", fr: "Patchs et avisos oficiaues" },
  "panel.denuncias_txt": { es: "Si alguien marca un mensaje o chat, aparece aquí. Ocúltalo o márcalo visto.", en: "When someone flags a post or chat, it shows here. Hide it or mark it reviewed.", fr: "Si auguien marca un mensaje ou chat, aparece ici. Ocúltauo ou márcauo visto." },
  "panel.chat_txt": { es: "Últimos mensajes: oculta lo que no deba verse en público.", en: "Latest messages: hide anything that shouldn't stay public.", fr: "Últimos mensajes: oculta lo que ne deba voirse en público." },
  "panel.chat_vacio": { es: "Aún no hay mensajes recientes.", en: "No recent messages yet.", fr: "Aún ne il et a mensajes recientes." },
  "panel.ir_chat": { es: "Abrir chat →", en: "Open chat →", fr: "Ouvrir Chat →" },
  "panel.herramientas": { es: "Herramientas avanzadas", en: "Advanced tools", fr: "Advanced Outils" },
  "panel.mod_txt": { es: "Pon el ID del tema del foro y elige cerrar, ocultar o fijar.", en: "Enter the forum thread ID and choose close, hide, or pin.", fr: "Enter le Forum thread ID et Choisir Fermer, masquer, ou pin." },
  "panel.mod": { es: "Moderar tema del foro", en: "Moderate forum thread", fr: "Moderar tema du foro" },
  "panel.gente": { es: "Gente", en: "People", fr: "Gente" },
  "panel.denuncias": { es: "Avisos de los miembros", en: "Member reports", fr: "Membre reports" },
  "panel.sin_denuncias": { es: "Nada pendiente: buen trabajo.", en: "Nothing pending — nice.", fr: "Nonthing pending — nice." },
  "panel.chat_reciente": { es: "Chat reciente", en: "Recent chat", fr: "Chat reciente" },
  "panel.ocultar": { es: "Ocultar", en: "Hide", fr: "Masquer" },
  "panel.mostrar": { es: "Mostrar", en: "Show", fr: "Afficher" },
  "panel.cerrar": { es: "Cerrar tema", en: "Close thread", fr: "Fermer thread" },
  "panel.abrir": { es: "Reabrir tema", en: "Reopen thread", fr: "ReOuvrir thread" },
  "panel.fijar": { es: "Fijar", en: "Pin", fr: "Fijar" },
  "panel.soltar": { es: "Quitar fijado", en: "Unpin", fr: "Quitar fijado" },
  "panel.resolver": { es: "Marcar visto", en: "Mark reviewed", fr: "Mark reVoired" },
  "panel.oculto": { es: "oculto", en: "hidden", fr: "oculto" },
  "panel.rol": { es: "Rol", en: "Role", fr: "Rol" },
  "panel.guardar": { es: "Guardar", en: "Save", fr: "Enregistrer" },
  "panel.suspension": { es: "Suspensión (días, 0 la quita)", en: "Suspension (days, 0 clears it)", fr: "Suspension (jours, 0 clears it)" },
  "panel.tu": { es: "tú", en: "you", fr: "vous" },
  "panel.ok": { es: "Hecho", en: "Done", fr: "Hecho" },
  "panel.rol_usuario": { es: "Miembro", en: "Member", fr: "Membre" },
  "panel.rol_moderador": { es: "Moderador", en: "Moderator", fr: "Modérateur" },
  "panel.rol_admin": { es: "Admin", en: "Admin", fr: "Admin" },
  "panel.rol_superadmin": { es: "Superadmin", en: "Superadmin", fr: "Superadmin" },
  "panel.roles_titulo": { es: "Qué puede cada rol", en: "What each role can do", fr: "Qué peut chaque rol" },
  "panel.roles_txt": {
    es: "Roles fijos. Moderador no gestiona equipo. Admin sube/baja moderadores. Superadmin gestiona admins, Discord, bot y puede borrar cuentas.",
    en: "Fixed roles. Moderators don't manage the team. Admins promote/demote moderators. Superadmin manages admins, Discord, bot and can delete accounts.", fr: "Roles fijos. Modérateur ne gestiona equipo. Admin sonbe/baja moderadores. Superadmin gestiona admins, Discord, bot et peut borrar cuentas."
  },
  "panel.rol_usuario_txt": {
    es: "Cuenta normal: builds, chat, foro, Espía. Sin Panel.",
    en: "Normal account: builds, chat, forum, Spy. No Panel.", fr: "Nonrmal Compte: Builds, Chat, Forum, Espion. Non Panel."
  },
  "panel.rol_moderador_txt": {
    es: "Panel: ocultar chat/foro, cerrar temas, cola de avisos; suspender miembros (hasta 7 días). No gestiona roles.",
    en: "Panel: hide chat/forum, close threads, review queue; suspend members (up to 7 days). Can't manage roles.", fr: "Panel: masquer Chat/Forum, Fermer threads, reVoir queue; suspend Membres (up à 7 jours). Can't manage roles."
  },
  "panel.rol_admin_txt": {
    es: "Como moderador + fijar temas y categoría Avisos; dar de alta/bajar moderadores y suspenderlos (hasta 30 días). No crea admins ni borra cuentas.",
    en: "Like moderator + pin threads and Announcements; promote/demote moderators and suspend them (up to 30 days). Can't create admins or delete accounts.", fr: "Like Modérateur + pin threads et AnNonuncements; promote/demote Modérateurs et suspend them (up à 30 jours). Can't créer Admins ou Supprimer le comptes."
  },
  "panel.rol_superadmin_txt": {
    es: "Dueño: gestiona admins y mods, Discord, bot, tráfico; puede borrar cuentas. No se puede degradar desde la web.",
    en: "Owner: manages admins and mods, Discord, bot, traffic; can delete accounts. Can't be demoted from the site.", fr: "Dueño: gestiona admins et mods, Discord, bot, tráfico; peut borrar cuentas. No se peut degradar depuis la web."
  },
  "panel.matriz_mod": {
    es: "Chat/foro, cola, suspender miembros (hasta 7 días). Sin gestión de roles.",
    en: "Chat/forum, queue, suspend members (up to 7 days). No role management.", fr: "Chat/foro, cola, sespender miembros (jusqu’à 7 días). Sin gestión de roles."
  },
  "panel.matriz_admin": {
    es: "Lo de moderador + fijar/Avisos + subir, bajar y suspender moderadores (hasta 30 días).",
    en: "Moderator powers + pin/Announcements + promote, demote and suspend moderators (up to 30 days).", fr: "Modérateur Puissances + pin/AnNonuncements + promote, demote et suspend moderators (up à 30 jours)."
  },
  "panel.matriz_super": {
    es: "Lo de admin + gestionar admins, Discord, bot, tráfico y borrar cuentas.",
    en: "Admin powers + manage admins, Discord, bot, traffic and delete accounts.", fr: "Admin Puissances + manage admins, Discord, bot, traffic et Supprimer le comptes."
  },
  "panel.equipo": { es: "Equipo", en: "Team", fr: "Équipement" },
  "panel.equipo_admin": { es: "Equipo (moderadores)", en: "Team (moderators)", fr: "Team (Modérateurs)" },
  "panel.solo_super": { es: "Superadmin", en: "Superadmin", fr: "Superadmin" },
  "panel.equipo_txt": {
    es: "Staff actual abajo. Busca un miembro (mín. 2 letras) para subirlo a moderador o admin. Superadmin no se puede bajar aquí. Borrar cuenta: solo tú.",
    en: "Current staff below. Search a member (min. 2 letters) to promote to moderator or admin. Superadmin can't be demoted here. Delete account: you only.", fr: "Current staff below. Rechercher a Membre (min.. 2 letters) à promote à Modérateur ou Admin. SuperAdmin can't be demoted here. Supprimer le compte: vous only."
  },
  "panel.equipo_admin_txt": {
    es: "Busca un miembro para subirlo a moderador, o baja a un mod a miembro. No puedes tocar admins ni borrar cuentas.",
    en: "Search a member to promote to moderator, or demote a mod to member. You can't touch admins or delete accounts.", fr: "Rechercher a Membre à promote à Modérateur, ou demote a mod à Membre. Vous can't touch Admins ou Supprimer le comptes."
  },
  "panel.equipo_buscar": { es: "Buscar usuario…", en: "Search username…", fr: "Rechercher Nonm d’utiliSameur…" },
  "panel.equipo_buscar_txt": { es: "Escribe al menos 2 letras. No hace falta cargar miles de cuentas.", en: "Type at least 2 letters. No need to load thousands of accounts.", fr: "Type at least 2 letters. Non need à charger thousands de Comptes." },
  "panel.equipo_staff": { es: "Staff actual", en: "Current staff", fr: "Staff acvotreau" },
  "panel.equipo_resultados": { es: "Resultados", en: "Results", fr: "Résultats" },
  "panel.equipo_min": { es: "Escribe al menos 2 letras para buscar.", en: "Type at least 2 letters to search.", fr: "Saisissez au moins 2 letras pour buscar." },
  "panel.equipo_vacio": { es: "Nadie con ese nombre.", en: "No one with that name.", fr: "Non one avec cela Nonm." },
  "panel.equipo_vacio_staff": { es: "Aún no hay moderadores. Busca un miembro para darlo de alta.", en: "No moderators yet. Search a member to promote.", fr: "Non Modérateurs yet. Rechercher a Membre à promote." },
  "panel.borrar_cuenta": { es: "Borrar cuenta", en: "Delete account", fr: "Supprimer le compte" },
  "panel.borrar_cuenta_ok": {
    es: "¿Borrar DEFINITIVAMENTE la cuenta de {user}? Escribe BORRAR para confirmar.",
    en: "Permanently delete {user}'s account? Type DELETE to confirm.", fr: "Permanently delete {user}'s account? Type DELETE to confirm."
  },
  "panel.hint_rol": { es: "Este rol: {txt}", en: "This role: {txt}", fr: "This role: {txt}" },
  "panel.herramientas_txt": { es: "Moderar un tema del foro por su ID", en: "Moderate a forum thread by its ID", fr: "Moderar un tema du foro por son ID" },
  "panel.kpi_total": { es: "Pendientes", en: "Pending", fr: "Pendientes" },
  "panel.kpi_bot": { es: "Bot", en: "Bot", fr: "Bot" },
  "panel.kpi_denuncias": { es: "Avisos", en: "Reports", fr: "Avisos" },
  "panel.cola": { es: "Para revisar", en: "Review queue", fr: "ReVoir queue" },
  "panel.cola_txt": { es: "Avisos de miembros y detecciones del bot. Actúa o marca como visto.", en: "Member reports and bot hits. Act or mark reviewed.", fr: "Membre reports et bot hits. Act ou mark reVoired." },
  "panel.cola_vacia": { es: "Cola limpia. Nada pendiente.", en: "Queue clear. Nothing pending.", fr: "Cola limpia. Nada pendiente." },
  "panel.filtro_todos": { es: "Todos", en: "All", fr: "Tous" },
  "panel.filtro_bot": { es: "Bot", en: "Bot", fr: "Bot" },
  "panel.filtro_denuncia": { es: "Miembros", en: "Members", fr: "Membres" },
  "panel.origen_bot": { es: "Bot", en: "Bot", fr: "Bot" },
  "panel.origen_denuncia": { es: "Aviso", en: "Report", fr: "Aviso" },
  "panel.origen_flood": { es: "Flood", en: "Flood", fr: "Flood" },
  "panel.dejar": { es: "Dejar", en: "Keep", fr: "Dejar" },
  "panel.suspender": { es: "Suspender", en: "Suspend", fr: "Suspender" },
  "panel.suspender_dias": { es: "Días de suspensión (1–{max})", en: "Suspension days (1–{max})", fr: "Suspension days (1–{max})" },
  "panel.avisado_por": { es: "avisado por", en: "reported by", fr: "avisado por" },
  "super.antetitulo": { es: "Privado", en: "Private", fr: "Privé" },
  "super.titulo": { es: "Panel superadmin", en: "Superadmin panel", fr: "Panel sonperadmin" },
  "super.sub": { es: "Roles, Discord, visitas y reglas del bot. Un compañero en el Panel de moderación no ve esto.", en: "Roles, Discord, visits and bot rules. Someone on the mod Panel won't see this.", fr: "Roles, Discord, visitas et reglas du bot. Un compañero en el Panel de moderación ne ve esto." },
  "super.ir_panel": { es: "Ir al Panel de moderación", en: "Go to moderation Panel", fr: "Ir au Panel de moderación" },
  "super.visitas": { es: "Tráfico", en: "Traffic", fr: "Tráfico" },
  "super.visitas_txt": { es: "Entradas a la web (escaparate y principal). Útiles para medir audiencia antes de publicidad. Un mismo visitante no cuenta más de una vez cada 30 minutos por página.", en: "Site entries (showcase and main). Useful to gauge audience before ads. The same visitor isn't counted more than once every 30 minutes per page.", fr: "Entradas a la web (escapourte et principau). Útiles pour medir audiencia avant de publicidad. Un mismo visitante ne cuenta plus de una vez chaque 30 minutos por página." },
  "super.visitas_total": { es: "Visitas totales", en: "Total visits", fr: "Visitas totaues" },
  "super.visitas_unicos": { es: "Únicos (suma diaria)", en: "Uniques (daily sum)", fr: "Uniques (quotidien sum)" },
  "super.visitas_hoy": { es: "Hoy", en: "Today", fr: "Hoy" },
  "super.visitas_semana": { es: "Últimos 7 días", en: "Last 7 days", fr: "Last 7 jours" },
  "super.visitas_por_dia": { es: "Por día", en: "By day", fr: "By jour" },
  "super.visitas_por_ruta": { es: "Páginas más vistas", en: "Top pages", fr: "Páginas plus vistas" },
  "super.visitas_hits": { es: "hits", en: "hits", fr: "hits" },
  "super.visitas_vacio": { es: "Aún no hay datos de visitas.", en: "No visit data yet.", fr: "Aún ne il et a datos de visitas." },
  "super.bot": { es: "Bot de moderación", en: "Moderation bot", fr: "Bot de moderación" },
  "super.bot_txt": { es: "Añade o quita palabras. Bloquear = no se envía. Revisar = se publica y entra en la cola del Panel.", en: "Add or remove words. Block = not sent. Review = published and queued for the Panel.", fr: "Añade ou quita pauabras. Bloquear = ne se envía. Revisar = se publica et entra en la cola du Panel." },
  "super.patron": { es: "Palabra o frase…", en: "Word or phrase…", fr: "Pauabra ou frase…" },
  "super.nota": { es: "Etiqueta (estafa…)", en: "Label (scam…)", fr: "Etiqueta (cettefa…)" },
  "super.accion_bloquear": { es: "Bloquear", en: "Block", fr: "Bloquear" },
  "super.accion_revisar": { es: "Revisar", en: "Review", fr: "ReVoir" },
  "super.ambito_ambos": { es: "Chat + foro", en: "Chat + forum", fr: "Chat + foro" },
  "super.ambito_chat": { es: "Solo chat", en: "Chat only", fr: "Solo chat" },
  "super.ambito_foro": { es: "Solo foro", en: "Forum only", fr: "Solo foro" },
  "super.anadir": { es: "Añadir regla", en: "Add rule", fr: "Añadir regla" },
  "super.activar": { es: "Activar", en: "Enable", fr: "Activar" },
  "super.desactivar": { es: "Pausar", en: "Pause", fr: "Pautiliêtre" },
  "super.borrar": { es: "Borrar", en: "Delete", fr: "Supprimer" },
  "super.borrar_ok": { es: "¿Borrar esta regla?", en: "Delete this rule?", fr: "Supprimer ce rule?" },
  "panel.tipo_tema": { es: "Tema", en: "Thread", fr: "Sujet" },
  "panel.tipo_mensaje": { es: "Mensaje", en: "Post", fr: "Message" },
  "panel.tipo_chat": { es: "Chat", en: "Chat", fr: "Chat" },
  "panel.juego": { es: "Avisos del juego", en: "Game alerts", fr: "Jeu alerts" },
  "panel.juego_txt": { es: "Lo que la web ha detectado en la web oficial y conviene revisar.", en: "What the site picked up from the official site and is worth a look.", fr: "Lo que la web ha detectado en la web oficiau et avecviene revisar." },
  "panel.hab_nuevas": { es: "habilidades que la web aún no conoce", en: "skills the site does not know yet", fr: "Compétences le site does Nont kNonw yet" },
  "panel.discord_txt": { es: "Cuando tengáis el servidor, pon aquí el ID y la invitación. Mientras esté vacío, no se ve nada en la web.", en: "Once you have the server, paste its ID and invite here. While empty, nothing shows on the site.", fr: "Cuando tengáis el êtrevidor, pon ici el ID et la invitación. Mientras esté vacío, ne se ve nada en la web." },
  "panel.discord_id": { es: "ID del servidor", en: "Server ID", fr: "Serveur ID" },
  "panel.discord_voz": { es: "Mostrar acceso a voz", en: "Show voice access", fr: "Afficher voice access" },

  "nav.noticias": { es: "Noticias", en: "News", fr: "Acvotreauités" },
  "noticias.titulo": { es: "Noticias de AION 2", en: "AION 2 news", fr: "Acvotreauités de AION 2" },
  "noticias.antetitulo": { es: "Mantenimientos y parches oficiales", en: "Official maintenance and patches", fr: "Mantenimientos et parches oficiaues" },
  "noticias.sub": { es: "Lo esencial si no puedes entrar: avisos de mantenimiento y notas de parche, copiados de la web oficial. Se actualizan cada 15 minutos.", en: "What matters when you can't log in: maintenance notices and patch notes from the official site. Updated every 15 minutes.", fr: "Lo esenciau si ne peuts entrar: avisos de mantenimiento et notas de parche, copiados de la web oficiau. Se acvotreauizan chaque 15 minutos." },
  "noticias.todas": { es: "Todas", en: "All", fr: "Tous" },
  "noticias.utiles": { es: "Útiles", en: "Useful", fr: "Útiles" },
  "noticias.t_notice": { es: "Avisos", en: "Notices", fr: "Nontices" },
  "noticias.t_update": { es: "Actualizaciones", en: "Updates", fr: "Acvotreauizaciones" },
  "noticias.t_movie_clip": { es: "Vídeos", en: "Videos", fr: "Vídeos" },
  "noticias.en_ingles": { es: "En inglés", en: "In English", fr: "En inglés" },
  "noticias.en_ingles_largo": { es: "NCSOFT solo ha publicado esta noticia en inglés.", en: "NCSOFT only published this in English.", fr: "NCSOFT seulement ha publicado cette noticia en inglés." },
  "noticias.ultimo_parche": { es: "Último parche", en: "Latest patch", fr: "Último parche" },
  "noticias.estado_aviso": { es: "Último aviso", en: "Latest notice", fr: "Latest Nontice" },
  "noticias.estado_parche": { es: "Último parche", en: "Latest patch", fr: "Último parche" },
  "noticias.mantenimiento": { es: "Mantenimiento", en: "Maintenance", fr: "Mantenimiento" },
  "noticias.sin_dato": { es: "Sin novedades recientes", en: "No recent items", fr: "Non recent objets" },
  "noticias.web_oficial": { es: "Web oficial", en: "Official site", fr: "Web oficiau" },
  "noticias.cronica": { es: "Crónica de actualizaciones", en: "Update chronicle", fr: "Mettre à jour chronicle" },
  "noticias.fuente": { es: "Fuente: web oficial de AION 2 (NCSOFT)", en: "Source: official AION 2 site (NCSOFT)", fr: "Fuente: web oficiau de AION 2 (NCSOFT)" },
  "noticias.ver_original": { es: "Ver en la web oficial", en: "View on the official site", fr: "Voir sur le official site" },
  "noticias.comentar": { es: "Comentarlo en el foro", en: "Discuss it on the forum", fr: "Comentarlo en el foro" },
  "noticias.vacio": { es: "Todavía no hay noticias. Vuelve en un momento.", en: "No news yet. Check back in a moment.", fr: "Todavía ne il et a noticias. Vuelve en un momento." },
  "noticias.ver_todas": { es: "Ver todas las noticias", en: "See all news", fr: "Voir toutes las noticias" },

  "foro.antetitulo": { es: "Comunidad Aion 2 Forge", en: "Aion 2 Forge community", fr: "Aion 2 Forge Communauté" },
  "foro.cat_presentaciones": { es: "Presentaciones", en: "Introductions", fr: "Presentaciones" },
  "foro.cat_builds": { es: "Builds", en: "Builds", fr: "Builds" },
  "foro.desc_avisos": { es: "Avisos de la comunidad Aion 2 Forge.", en: "Aion 2 Forge community announcements.", fr: "Aion 2 Forge Communauté anNonuncements." },
  "foro.desc_presentaciones": { es: "Di hola: quién eres, qué clase juegas, a qué hora sueles entrar.", en: "Say hi: who you are, what you play, when you are usually on.", fr: "Di hola: quién eres, qué clase juegas, a qué hora soneles entrar." },
  "foro.desc_clases": { es: "Dudas y trucos de cada clase.", en: "Questions and tips for each class.", fr: "Dudas et trucos de chaque clase." },
  "foro.desc_builds": { es: "Enseña tu build y pide opinión. Pega el enlace y sale la tarjeta.", en: "Show your build and ask for feedback. Paste the link and the card appears.", fr: "Afficher votre build et ask pour feedRetour. Paste le link et le card appears." },
  "foro.desc_grupos": { es: "Mazmorras, jefes y quedadas.", en: "Dungeons, bosses and meetups.", fr: "Mazmorras, jefes et quedadas." },
  "foro.desc_reclutamiento": { es: "Buscas o ofreces legión. Publica requisitos aquí.", en: "Looking for or recruiting a legion. Post requirements here.", fr: "Buscas ou ofreces legión. Publica requisitos ici." },
  "foro.desc_offtopic": { es: "Todo lo demás.", en: "Everything else.", fr: "Todo lo deplus." },
  "foro.d_temas": { es: "temas", en: "threads", fr: "temas" },
  "foro.d_mensajes": { es: "mensajes", en: "posts", fr: "mensajes" },
  "foro.d_miembros": { es: "miembros", en: "members", fr: "Membres" },
  "foro.d_conectados": { es: "en línea", en: "online", fr: "en línea" },
  "foro.sin_temas": { es: "Sin temas todavía", en: "No threads yet", fr: "Sin temas todavía" },
  "foro.vistas": { es: "vistas", en: "views", fr: "Voirs" },
  "foro.d_respuestas": { es: "respuestas", en: "replies", fr: "respuces" },
  "foro.ahora": { es: "ahora", en: "now", fr: "Nonw" },
  "foro.mod": { es: "Mod", en: "Mod", fr: "Mod" },
  "foro.gremio_tit": { es: "Tiene un personaje vinculado de la legión Orden Celeste (en juego)", en: "Has a linked character in the Orden Celeste in-game legion", fr: "Has a linked personnage dans le Orden Celeste dans-Jeu Légion" },
  "foro.editado": { es: "editado", en: "edited", fr: "Modifiered" },
  "foro.editar": { es: "Editar", en: "Edit", fr: "Modifier" },
  "foro.reaccionar": { es: "Reaccionar", en: "React", fr: "Reaccionar" },
  "foro.denunciar_tema": { es: "Avisar de este tema", en: "Report this thread", fr: "Report ce thread" },
  "foro.negrita": { es: "Negrita", en: "Bold", fr: "Negrita" },
  "foro.cursiva": { es: "Cursiva", en: "Italic", fr: "Cursiva" },
  "foro.texto_ejemplo": { es: "texto", en: "text", fr: "texto" },
  "foro.ayuda_formato": { es: "**negrita** · *cursiva* · > cita · @usuario · pega el enlace de una build", en: "**bold** · *italic* · > quote · @user · paste a build link", fr: "**negrita** · *cursiva* · > cita · @usonario · pega el enlace de una build" },

  "chat.antetitulo": { es: "En directo", en: "Live", fr: "En directo" },
  "chat.placeholder_sala": { es: "Escribe en {sala}…", en: "Message {sala}…", fr: "Message {sala}…" },
  "chat.conectados": { es: "En línea", en: "Online", fr: "En línea" },
  "chat.nadie": { es: "Ahora mismo no hay nadie más.", en: "Nobody else right now.", fr: "Nonbody else right now." },
  "chat.respondiendo": { es: "Respondiendo a", en: "Replying to", fr: "Respondiendo a" },
  "chat.sala_general": { es: "General", en: "General", fr: "Generau" },
  "chat.sala_grupos": { es: "Busco grupo", en: "LFG", fr: "Busco grupo" },
  "chat.sala_clases": { es: "Clases", en: "Classes", fr: "Classees" },
  "chat.sala_comercio": { es: "Comercio", en: "Trade", fr: "Comercio" },
  "chat.sala_offtopic": { es: "Off-topic", en: "Off-topic", fr: "Off-topic" },
  "chat.sala_gremio": { es: "Sala privada", en: "Private room", fr: "Privé room" },
  "chat.sala_foro": { es: "En el foro", en: "On the forum", fr: "En el foro" },
  "chat.desc_general": { es: "Charla de toda la comunidad.", en: "Chat for the whole community.", fr: "Chat pour le whole Communauté." },
  "chat.desc_grupos": { es: "Monta un grupo y que se apunte la gente.", en: "Post a group and let people sign up.", fr: "Monta un grupo et que se apunte la gente." },
  "chat.desc_clases": { es: "Dudas rápidas de clases y builds.", en: "Quick class and build questions.", fr: "Dudas rápidas de clases et builds." },
  "chat.desc_comercio": { es: "Compra, venta e intercambio.", en: "Buy, sell and trade.", fr: "Compra, venta e intercambio." },
  "chat.desc_offtopic": { es: "Lo que no es del juego.", en: "Anything not about the game.", fr: "Anything Nont about le Jeu." },
  "chat.desc_gremio": { es: "Sala privada: miembros verificados de la legión Orden Celeste (en juego).", en: "Private room: verified Orden Celeste in-game legion members.", fr: "Privé room: verified Orden Celeste dans-Jeu Légion Membres." },
  "chat.gremio_tit": { es: "Sala privada", en: "Private room", fr: "Privé room" },
  "chat.gremio_cerrada": {
    es: "Sala privada para la legión Orden Celeste (en juego). Vincula en Mis builds un personaje de esa legión. Si te echan, al revalidar (cada pocas horas) se cierra sola.",
    en: "Private room for the Orden Celeste in-game legion. Link that legion character in My builds. If you're kicked, access closes on recheck (every few hours).", fr: "Privé room pour le Orden Celeste dans-Jeu Légion. Link cela Légion personnage dans Mes Builds. If you're kicked, access Fermers sur recheck (every few hours)."
  },
  "chat.busco": { es: "Busco grupo", en: "Looking for group", fr: "Busco grupo" },
  "chat.g_mazmorra": { es: "Mazmorra o jefe", en: "Dungeon or boss", fr: "Mazmorra ou jefe" },
  "chat.g_rol": { es: "Qué buscas (sanador, tanque…)", en: "Looking for (healer, tank…)", fr: "Qué buscas (sanador, tanque…)" },
  "chat.g_hora": { es: "Hora (ej. 21:30)", en: "Time (e.g. 21:30)", fr: "Hora (ej. 21:30)" },
  "chat.g_plazas": { es: "plazas", en: "slots", fr: "plazas" },
  "chat.g_nota": { es: "Nota opcional", en: "Optional note", fr: "Facultatif Nonte" },
  "chat.g_publicar": { es: "Publicar grupo", en: "Post group", fr: "Publier grupo" },
  "chat.g_busca": { es: "Busca", en: "Needs", fr: "Busca" },
  "chat.g_libre": { es: "Plaza libre", en: "Open slot", fr: "Ouvrir slot" },
  "chat.g_apuntar": { es: "Me apunto", en: "Join", fr: "Me apunto" },
  "chat.g_salir": { es: "Desapuntarme", en: "Leave", fr: "Desapuntarme" },
  "chat.g_lleno": { es: "Completo", en: "Full", fr: "Completo" },
  "chat.discord_entrar": { es: "Entrar al Discord", en: "Join the Discord", fr: "Entrar au Discord" },
  "err.grupo_lleno": { es: "El grupo ya está completo.", en: "The group is already full.", fr: "El grupo déjà est completo." },
  "err.discord_invalido": { es: "El ID del servidor o la invitación de Discord no son válidos.", en: "The Discord server ID or invite is not valid.", fr: "El ID du êtrevidor ou la invitación de Discord ne son válidos." },
  "err.texto_filtrado": { es: "Ese mensaje no se puede enviar (filtro de la comunidad).", en: "That message can't be sent (community filter).", fr: "Cela message can't be sent (Communauté Filtrer)." },

  "pie.aviso": {
    es: "Aion 2 Forge · web de fans AION 2 (EU), sin relación con NCSOFT. AION 2 y sus imágenes son de NCSOFT.",
    en: "Aion 2 Forge · AION 2 fan site (EU), not affiliated with NCSOFT. AION 2 and its images belong to NCSOFT.", fr: "Aion 2 Forge · web de fans AION 2 (EU), sans relación avec NCSOFT. AION 2 et ses imágenes son de NCSOFT."
  },

  "auth.acepto_legal": {
    es: "He leído y acepto la política de privacidad y el aviso legal.",
    en: "I have read and accept the privacy policy and legal notice.", fr: "I have read et accept le Politique de confidentialité et Mentions légales."
  },
  "err.acepto_legal": {
    es: "Debes aceptar la política de privacidad para crear la cuenta.",
    en: "You must accept the privacy policy to create an account.", fr: "Vous must accept le Politique de confidentialité à créer an Compte."
  },
  "err.cuenta_protegida": {
    es: "Esta cuenta del sistema no se puede borrar desde aquí.",
    en: "This system account cannot be deleted here.", fr: "Ce system Compte canNont be Supprimerd here."
  },
  "err.confirmacion_borrar": {
    es: "Escribe BORRAR (o DELETE) para confirmar.",
    en: "Type BORRAR (or DELETE) to confirm.", fr: "Type BORRAR (ou Supprimer) à Confirmer."
  },

  "mis.borrar_titulo": { es: "Borrar mi cuenta", en: "Delete my account", fr: "Supprimer my Compte" },
  "mis.borrar_aviso": {
    es: "Esto es irreversible. Se eliminan tu usuario, builds, personajes vinculados, votos y notificaciones.",
    en: "This cannot be undone. Your username, builds, linked characters, votes and notifications are removed.", fr: "Ce cannot be undone. Votre Nonm d’utiliSameur, Builds, linked personnages, votes et notifications are Retirerd."
  },
  "mis.borrar_li1": {
    es: "Mensajes del foro se anonimizan («Cuenta eliminada») para no romper hilos ajenos.",
    en: "Forum posts are anonymized (“Deleted account”) so other threads stay readable.", fr: "Forum posts are aNonnymized (“Supprimerd Compte”) so other threads stay readable."
  },
  "mis.borrar_li2": {
    es: "El chat reciente de tu cuenta se borra.",
    en: "Your recent chat messages are deleted.", fr: "Votre recent Chat messages are Supprimerd."
  },
  "mis.borrar_li3": {
    es: "No pedimos email: con borrar la cuenta basta para ejercer el derecho de supresión.",
    en: "We don’t ask for email: deleting the account is enough to exercise the right to erasure.", fr: "We don’t ask pour e-mail: deleting le Compte is eNonugh à exercise le right à erasure."
  },
  "mis.borrar_confirmar": {
    es: "Escribe BORRAR para confirmar",
    en: "Type BORRAR or DELETE to confirm", fr: "Type BORRAR ou Supprimer à Confirmer"
  },
  "mis.borrar_btn": { es: "Borrar cuenta definitivamente", en: "Permanently delete account", fr: "Permanently Supprimer le compte" },
  "mis.borrar_seguro": {
    es: "¿Seguro que quieres borrar tu cuenta y todos tus datos?",
    en: "Are you sure you want to delete your account and all your data?", fr: "Are vous sure vous want à Supprimer votre Compte et Tous votre data?"
  },
  "mis.borrar_ok": { es: "Cuenta borrada.", en: "Account deleted.", fr: "Compte Supprimerd." },
  "legal.ver_privacidad": { es: "Ver política de privacidad", en: "View privacy policy", fr: "Voir Politique de confidentialité" },

  "legal.titulo": { es: "Información legal", en: "Legal information", fr: "Información legau" },
  "legal.intro": {
    es: "Textos básicos de una web de fans sin ánimo de lucro. No sustituyen asesoramiento jurídico profesional.",
    en: "Basic texts for a non-profit fan site. They are not a substitute for professional legal advice.", fr: "Textos básicos de una web de fans sans ánimo de lucro. No sestivotreyen asesoramiento jurídico profesionau."
  },
  "legal.actualizado": { es: "Última actualización: octubre 2026.", en: "Last updated: October 2026.", fr: "Última acvotreauización: ocvotrebre 2026." },
  "legal.nav_aviso": { es: "Aviso legal", en: "Legal notice", fr: "Mentions légales" },
  "legal.nav_privacidad": { es: "Privacidad", en: "Privacy", fr: "Privacidad" },
  "legal.nav_cookies": { es: "Cookies", en: "Cookies", fr: "Cookies" },

  "legal.aviso_h": { es: "Aviso legal", en: "Legal notice", fr: "Mentions légales" },
  "legal.aviso_n": { es: "7", en: "7", fr: "7" },
  "legal.aviso_1": {
    es: "Esta web (Aion 2 Forge) es un proyecto de fans de AION 2. No es un servicio oficial de NCSOFT ni de sus socios.",
    en: "This site (Aion 2 Forge) is an AION 2 fan project. It is not an official NCSOFT service or partner.", fr: "Esta web (Aion 2 Forge) es un proyecto de fans de AION 2. No es un êtrevicio oficiau de NCSOFT ni de ses socios."
  },
  "legal.aviso_2": {
    es: "AION, AION 2, nombres de clases, personajes, logotipos e imágenes del juego son marcas o contenidos de NCSOFT / NC Company. Su uso aquí es informativo y de comunidad de fans.",
    en: "AION, AION 2, class names, characters, logos and game images are trademarks or content of NCSOFT / NC Company. Use here is informational for a fan community.", fr: "AION, AION 2, Classe Nonms, personnages, logos et Jeu images are trademarks ou content de NCSOFT / NC Company. Use here is informational pour a fan Communauté."
  },
  "legal.aviso_3": {
    es: "Los datos de fichas, ranking y equipo que se muestran vía Espía / Tops proceden de la API pública del juego (regiones globales EU/NA/LA/AS) y pueden estar incompletos o desactualizados. No garantizamos exactitud.",
    en: "Character, ranking and gear data shown via Spy / Tops come from the public game API (global regions EU/NA/LA/AS) and may be incomplete or outdated. Accuracy is not guaranteed.", fr: "Personnage, Classeement et Équipement data shown via Espion / Tops come de le Public Jeu API (global Régions EU/NA/LA/AS) et may be incomplete ou outdated. Accuracy is Nont guaranteed."
  },
  "legal.aviso_4": {
    es: "La web se ofrece «tal cual», sin garantía de disponibilidad continua. Builds, guías y herramientas son orientativas; úsalas bajo tu propia responsabilidad en el juego.",
    en: "The site is provided “as is”, with no guarantee of continuous availability. Builds, guides and tools are indicative; use them at your own risk in-game.", fr: "Le site is provided “as is”, avec Non guarantee de continuous availability. Builds, Guides et Outils are indicative; use them at votre own risk dans-Jeu."
  },
  "legal.aviso_5": {
    es: "El contenido publicado por usuarios (builds, foro, chat) es responsabilidad de quien lo publica. El equipo de la web puede moderar, ocultar o eliminar material abusivo, ilegal o que incumpla estas normas.",
    en: "User-published content (builds, forum, chat) is the responsibility of the poster. The site team may moderate, hide or remove abusive, illegal or non-compliant material.", fr: "El avectenido publicado por usonarios (builds, foro, chat) es responsabilidad de quien lo publica. El equipo de la web peut moderar, ocultar ou eliminar materiau abusivo, ilegau ou que incumpla ces normas."
  },
  "legal.aviso_6": {
    es: "Queda prohibido usar la web para estafas, RMT, phishing, acoso o cualquier actividad ilegal. El incumplimiento puede conllevar suspensión o borrado de cuenta.",
    en: "Using the site for scams, RMT, phishing, harassment or any illegal activity is forbidden. Breaches may lead to suspension or account deletion.", fr: "Queda prohibido utiliêtre la web pour cettefas, RMT, phishing, acoso ou n’importe quel actividad ilegau. El incumplimiento peut avecllevar sespensión ou borrado de cuenta."
  },
  "legal.aviso_7": {
    es: "Contacto de la comunidad: el Discord indicado en el pie de la web (cuando esté configurado). No hay atención comercial ni soporte oficial de NC.",
    en: "Community contact: the Discord linked in the site footer (when configured). There is no commercial support or official NC support.", fr: "Contacto de la comunidad: el Discord indicado en el pie de la web (cuando esté avecfigurado). No il et a atención comerciau ni soporte oficiau de NC."
  },

  "legal.privacidad_h": { es: "Política de privacidad", en: "Privacy policy", fr: "Politique de confidentialité" },
  "legal.privacidad_n": { es: "10", en: "10", fr: "10" },
  "legal.privacidad_1": {
    es: "Responsable del tratamiento: la comunidad de fans Aion 2 Forge, que opera esta web de forma no comercial. Contacto: Discord (enlace en el pie).",
    en: "Data controller: the Aion 2 Forge fan community operating this non-commercial site. Contact: Discord (footer link).", fr: "Responsable du tratamiento: la comunidad de fans Aion 2 Forge, que opera cette web de forma ne comerciau. Contacto: Discord (enlace en el pie)."
  },
  "legal.privacidad_2": {
    es: "No pedimos email ni datos de identidad civil. Al registrarte solo guardamos: nombre de usuario, hash de contraseña (no la contraseña en claro), rol y fecha de alta.",
    en: "We do not ask for email or civil identity data. On sign-up we only store: username, password hash (never plain password), role and sign-up date.", fr: "No pedimos email ni datos de identidad civil. Al registrarte seulement guardamos: nombre de usonario, hash de avectraseña (no la avectraseña en claro), rol et fecha de auta."
  },
  "legal.privacidad_3": {
    es: "Si usas la web logueado también podemos guardar: builds, personajes vinculados (IDs públicos del juego), mensajes de foro/chat, votos a builds, denuncias de moderación y notificaciones internas.",
    en: "If you use the site signed in we may also store: builds, linked characters (public game IDs), forum/chat messages, build votes, moderation reports and internal notifications.", fr: "Si usas la web logueado aussi podemos guardar: builds, personajes vinculados (IDs públicos du juego), mensajes de foro/chat, votos a builds, denuncias de moderación et notificaciones internas."
  },
  "legal.privacidad_4": {
    es: "Finalidad: prestar la comunidad (builds, Espía, foro, chat, tops), seguridad (anti-bots, límites de abuso) y moderación. Base: ejecución del servicio que solicitas al crear cuenta y, en su caso, interés legítimo de seguridad de la comunidad.",
    en: "Purpose: run the community (builds, Spy, forum, chat, tops), security (anti-bot, abuse limits) and moderation. Legal basis: performing the service you request by creating an account and, where needed, legitimate interest in community security.", fr: "Finauidad: prcetter la comunidad (builds, Espion, foro, chat, tops), seguridad (anti-bots, límites de abuso) et moderación. Base: ejecución du êtrevicio que solicitas au crear cuenta y, en son caso, interés legítimo de seguridad de la comunidad."
  },
  "legal.privacidad_5": {
    es: "Datos técnicos: cookie de sesión (imprescindible para entrar), IP para límites temporales anti-abuso, y contadores de visitas agregados con una huella anónima (no identifica tu cuenta).",
    en: "Technical data: session cookie (required to sign in), IP for temporary anti-abuse limits, and aggregated visit counters with an anonymous fingerprint (not tied to your account).", fr: "Technical data: session coOKie (Obligatoire à Connexion), IP pour temporary anti-abuse limits, et aggregated visit counters avec an aNonnymous fingerprint (Nont tied à votre Compte)."
  },
  "legal.privacidad_6": {
    es: "En el registro puede usarse Cloudflare Turnstile (anti-bots). Cloudflare trata el token según su propia política. No usamos publicidad ni redes de tracking de terceros en la web.",
    en: "Registration may use Cloudflare Turnstile (anti-bot). Cloudflare processes the token under its own policy. We do not use ads or third-party tracking networks on the site.", fr: "En el registro peut utiliêtrese Cloudflare Turnstile (anti-bots). Cloudflare trata el token selon son propia política. No usamos publicidad ni redes de tracking de terceros en la web."
  },
  "legal.privacidad_7": {
    es: "Encargados / alojamiento: la API y base de datos se alojan en proveedores cloud (p. ej. Render y Neon). El escaparate estático puede servirse desde GitHub Pages. Puede haber transferencia internacional; se usan proveedores habituales del sector.",
    en: "Processors / hosting: API and database run on cloud providers (e.g. Render and Neon). The static mirror may be served from GitHub Pages. International transfers may occur; common industry providers are used.", fr: "Encargados / auojamiento: la API et base de datos se auojan en proveedores cloud (p. ej. Render et Neon). El escapourte esttico peut êtrevirse depuis GitHub Pages. Puede haber transferencia internacionau; se usan proveedores habivotreaues du sector."
  },
  "legal.privacidad_8": {
    es: "Conservación: mientras mantengas la cuenta. Si la borras, eliminamos usuario, builds, personajes vinculados, votos y notificaciones. El foro se anonimiza («Cuenta eliminada»). El chat tuyo se borra. Agregados de visitas no personales pueden permanecer.",
    en: "Retention: while you keep the account. If you delete it, we remove username, builds, linked characters, votes and notifications. Forum posts are anonymized (“Deleted account”). Your chat is deleted. Non-personal visit aggregates may remain.", fr: "Conêtrevación: mientras mantengas la cuenta. Si la borras, eliminamos usonario, builds, personajes vinculados, votos et notificaciones. El foro se anonimiza («Compte eliminada»). El chat votreyo se borra. Agregados de visitas ne personaues peuvent permanecer."
  },
  "legal.privacidad_9": {
    es: "Tus derechos (RGPD): acceso, rectificación, supresión, limitación y oposición. Puedes cambiar la contraseña y borrar la cuenta en Mis builds → Cuenta y seguridad. También puedes pedir ayuda por Discord (pie).",
    en: "Your rights (GDPR): access, rectification, erasure, restriction and objection. You can change your password and delete the account under My builds → Account & security. You may also ask via Discord (footer).", fr: "Tus derechos (RGPD): acceso, rectificación, sonpresión, limitación et oposición. Puedes changer la avectraseña et borrar la cuenta en Mes builds → Compte et seguridad. También peuts pedir ayuda por Discord (pie)."
  },
  "legal.privacidad_10": {
    es: "Si crees que el tratamiento no es correcto, puedes reclamar ante la autoridad de protección de datos de tu país (en España, la AEPD). Esta web no está dirigida a menores de 14 años; no registres una cuenta si no cumples la edad mínima legal en tu país.",
    en: "If you believe processing is unlawful, you may complain to your national data protection authority (in Spain, the AEPD). This site is not aimed at children under 14; do not register if you are below the legal minimum age in your country.", fr: "Si crees que el tratamiento ne es correcto, peuts reclamar ante la autoridad de protección de datos de votre país (en España, la AEPD). Esta web ne est dirigida a menores de 14 años; ne registres una cuenta si ne cumples la edad mínima legau en votre país."
  },

  "legal.cookies_h": { es: "Cookies", en: "Cookies", fr: "Cookies" },
  "legal.cookies_n": { es: "5", en: "5", fr: "5" },
  "legal.cookies_1": {
    es: "Usamos cookies y almacenamiento técnico estrictamente necesarios para el funcionamiento de la web. No usamos cookies de publicidad ni de analítica de terceros con fines de marketing.",
    en: "We use cookies and technical storage strictly necessary for the site to work. We do not use advertising cookies or third-party analytics for marketing.", fr: "Usamos cookies et aumacenamiento técnico estrictamente necesarios pour el funcionamiento de la web. No usamos cookies de publicidad ni de anauítica de terceros avec fines de marketing."
  },
  "legal.cookies_2": {
    es: "Cookie de sesión: identifica tu login de forma segura (HTTP-only). Sin ella no puedes mantener la sesión. Caduca según la configuración del servidor (aprox. 30 días de inactividad máxima de sesión permanente).",
    en: "Session cookie: securely identifies your login (HTTP-only). Without it you cannot stay signed in. It expires per server settings (about 30 days for a permanent session).", fr: "Session coOKie: securely identifies votre connexion (HTTP-only). Sans it vous canNont stay signed dans. It expires per Serveur settings (about 30 jours pour a permanent session)."
  },
  "legal.cookies_3": {
    es: "Preferencia de idioma: se guarda en el navegador (localStorage) para recordar ES/EN. Puedes borrarla limpiando los datos del sitio.",
    en: "Language preference: stored in the browser (localStorage) to remember ES/EN. You can clear it by wiping site data.", fr: "Preferencia de idioma: se guarda en el navegador (locauStorage) pour recordar ES/EN. Puedes borrarla limpiando los datos du sitio."
  },
  "legal.cookies_4": {
    es: "Cloudflare Turnstile (solo al registrarte, si está activo) puede depositar cookies técnicas propias de Cloudflare para distinguir humanos de bots.",
    en: "Cloudflare Turnstile (only on registration, when enabled) may set Cloudflare’s own technical cookies to tell humans from bots.", fr: "Cloudflare Turnstile (seulement au registrarte, si est activo) peut depositar cookies técnicas propias de Cloudflare pour distinguir humanos de bots."
  },
  "legal.cookies_5": {
    es: "Al ser cookies necesarias para el servicio que pides (entrar / seguridad), no se muestra un muro de consentimiento de marketing. Más detalle en la política de privacidad.",
    en: "As these are necessary for the service you request (sign-in / security), we do not show a marketing consent wall. See the privacy policy for more detail.", fr: "As these are necessary pour le service vous request (sign-dans / security), we do Nont afficher a marketing consent wTous. See le Politique de confidentialité pour plus detail."
  }
};

/* Nombres oficiales NC (lista de clases): ES Arquero/Asesino; EN Ranger/Assassin. */
var CLASES_INFO = [
  { id: "gladiator", es: "Gladiador", en: "Gladiator", fr: "Gladiateur", rol: { es: "DPS cuerpo a cuerpo", en: "Melee DPS", fr: "DPS mêlée" } },
  { id: "templar", es: "Templario", en: "Templar", fr: "Templier", rol: { es: "Tanque", en: "Tank", fr: "Tank" } },
  { id: "assassin", es: "Asesino", en: "Assassin", fr: "Assassin", rol: { es: "DPS cuerpo a cuerpo (burst)", en: "Melee burst DPS", fr: "DPS mêlée (burst)" } },
  { id: "ranger", es: "Arquero", en: "Ranger", fr: "Ranger", rol: { es: "DPS a distancia", en: "Ranged DPS", fr: "DPS à distance" } },
  { id: "sorcerer", es: "Hechicero", en: "Sorcerer", fr: "Sorcier", rol: { es: "DPS mágico", en: "Magic DPS", fr: "DPS magique" } },
  { id: "spiritmaster", es: "Espiritualista", en: "Spiritmaster", fr: "Spiritualiste", rol: { es: "DPS invocador", en: "Summoner DPS", fr: "DPS invocateur" } },
  { id: "cleric", es: "Clérigo", en: "Cleric", fr: "Clerc", rol: { es: "Sanador", en: "Healer", fr: "Soigneur" } },
  { id: "chanter", es: "Cantor", en: "Chanter", fr: "Chanter", rol: { es: "Apoyo / ataque", en: "Support / damage", fr: "Soutien / dégâts" } }
];

/** Idiomas activos en el selector. Banderas SVG (Windows no pinta emoji). */
var IDIOMAS = [
  { id: "es", nombre: { es: "Español", en: "Spanish", fr: "Espagnol" } },
  { id: "en", nombre: { es: "Inglés", en: "English", fr: "Anglais" } },
  { id: "fr", nombre: { es: "Francés", en: "French", fr: "Français" } }
];
function htmlBanderaIdioma(id) {
  return '<img class="idioma-bandera" src="img/banderas/' + id + '.svg" alt="" width="18" height="12" decoding="async">';
}
function idiomaInfo(id) {
  for (var i = 0; i < IDIOMAS.length; i++) if (IDIOMAS[i].id === id) return IDIOMAS[i];
  return IDIOMAS[0];
}
function idiomaValido(id) {
  return IDIOMAS.some(function (x) { return x.id === id; });
}
function langDesdeUrl() {
  try {
    var p = new URLSearchParams(location.search).get("lang");
    return idiomaValido(p) ? p : null;
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
  if (idiomaValido(guardado)) return guardado;
  var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
  return idiomaValido(nav) ? nav : "es";
})();
document.documentElement.lang = IDIOMA;
if (!langDesdeUrl()) {
  try { history.replaceState(null, "", urlConIdioma(IDIOMA)); } catch (e) {}
}
(function enlacesHreflang() {
  if (!document.head) return;
  function linkAlt(lang, href) {
    var a = document.head.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
    if (!a) {
      a = document.createElement("link");
      a.rel = "alternate";
      a.hreflang = lang;
      document.head.appendChild(a);
    }
    a.href = href;
  }
  IDIOMAS.forEach(function (x) {
    linkAlt(x.id, new URL(urlConIdioma(x.id), location.origin).href);
  });
  linkAlt("x-default", new URL(urlConIdioma("es"), location.origin).href);
  var can = document.head.querySelector('link[rel="canonical"]');
  if (!can) {
    can = document.createElement("link");
    can.rel = "canonical";
    document.head.appendChild(can);
  }
  can.href = new URL(urlConIdioma(IDIOMA), location.origin).href;
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
  var ogLocale = { es: "es_ES", en: "en_GB", fr: "fr_FR" };
  _metaSet("property", "og:locale", ogLocale[IDIOMA] || "es_ES");
  try { _metaSet("property", "og:url", new URL(urlConIdioma(IDIOMA), location.origin).href); } catch (e) {}
  var base = (typeof WEB_PRINCIPAL !== "undefined" ? WEB_PRINCIPAL : "https://aion-2-forge.onrender.com");
  // Solo es/en tienen OG+PWA propios; el resto (fr, …) usa inglés.
  var suf = IDIOMA === "es" ? "es" : "en";
  var imgOg = opts.imagen || (base + "/img/og-aion-2-forge-" + suf + ".jpg");
  _metaSet("property", "og:image", imgOg);
  _metaSet("property", "og:image:width", "1200");
  _metaSet("property", "og:image:height", "630");
  _metaSet("name", "twitter:card", "summary_large_image");
  _metaSet("name", "twitter:title", titulo);
  _metaSet("name", "twitter:description", desc);
  _metaSet("name", "twitter:image", imgOg);
  if (opts.robots) _metaSet("name", "robots", opts.robots);
  // PWA / icono según idioma
  var man = document.head.querySelector('link[rel="manifest"]');
  if (man) man.href = "site-" + suf + ".webmanifest";
  var apple = document.head.querySelector('link[rel="apple-touch-icon"]');
  if (apple) apple.href = "img/pwa-icon-" + suf + "-192.png";
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
  if (!idiomaValido(l)) return;
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
