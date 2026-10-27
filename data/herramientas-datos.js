/* Tablas para herramientas Aion 2 Forge. Fuentes citadas; no inventamos tasas oficiales NC. */
window.HERRAMIENTAS_DATOS = {
  fuentes: {
    enhanceClient: {
      es: "Tasas regeneradas del cliente (EnchantCost): aion2.gg / MetaBot / Aion2Data. No es nota oficial de NC para global.",
      en: "Rates regenerated from the client (EnchantCost): aion2.gg / MetaBot / Aion2Data. Not an NC official global notice."
    },
    guiasOc: {
      es: "Guías Aion 2 Forge (datos de Corea citados, sin inventar).",
      en: "Aion 2 Forge guides (cited Korean data, nothing invented)."
    },
    piedras: {
      es: "Valores de Manastone/Theostone del dump de equipo del sitio.",
      en: "Manastone/Theostone values from this site's gear dump."
    }
  },

  /* Enhancement Unique +0..+15; Epic safe to +10; Common/Rare to +5 */
  enhance: {
    safeUntil: { common: 5, rare: 5, epic: 10, unique: 10, heroic: 10 },
    cap: { common: 5, rare: 5, epic: 10, unique: 15, heroic: 20 },
    steps: {
      unique: [
        { from: 10, to: 11, rate: 0.65, pity: 0.05 },
        { from: 11, to: 12, rate: 0.50, pity: 0.05 },
        { from: 12, to: 13, rate: 0.35, pity: 0.05 },
        { from: 13, to: 14, rate: 0.25, pity: 0.05 },
        { from: 14, to: 15, rate: 0.20, pity: 0.05 }
      ],
      heroic: [
        { from: 10, to: 11, rate: 0.65, pity: 0.05 },
        { from: 11, to: 12, rate: 0.50, pity: 0.05 },
        { from: 12, to: 13, rate: 0.35, pity: 0.05 },
        { from: 13, to: 14, rate: 0.25, pity: 0.05 },
        { from: 14, to: 15, rate: 0.20, pity: 0.05 },
        { from: 15, to: 16, rate: 0.65, pity: 0.05 },
        { from: 16, to: 17, rate: 0.50, pity: 0.05 },
        { from: 17, to: 18, rate: 0.35, pity: 0.05 },
        { from: 18, to: 19, rate: 0.25, pity: 0.05 },
        { from: 19, to: 20, rate: 0.20, pity: 0.05 }
      ]
    },
    /* Coste por intento · iLvl 102 Unique (MetaBot / Aion2Data). Escala con iLvl. */
    costIlvl102: {
      11: { kina: 360000, stones: 9310 },
      12: { kina: 540000, stones: 10610 },
      13: { kina: 860000, stones: 11960 },
      14: { kina: 1340000, stones: 13360 },
      15: { kina: 1860000, stones: 14820 }
    },
    costPresets: [
      { id: "36", label: { es: "iLvl 36 (ej. Wisdom)", en: "iLvl 36 (e.g. Wisdom)" }, scale: 0.36 },
      { id: "70", label: { es: "iLvl 70 (ej. Aulamus)", en: "iLvl 70 (e.g. Aulamus)" }, scale: 0.70 },
      { id: "86", label: { es: "iLvl 86 (ej. Kromede)", en: "iLvl 86 (e.g. Kromede)" }, scale: 0.84 },
      { id: "102", label: { es: "iLvl 102 (ej. Ludra)", en: "iLvl 102 (e.g. Ludra)" }, scale: 1 }
    ],
    notes: {
      es: "+0 a +10 es seguro en Unique/Épico. Un fallo past +10 gasta piedras y Kina; no baja el nivel en equipo normal. Clash Rune es otra curva (baja 1 y sin pity).",
      en: "+0 to +10 is safe on Unique/Epic. A fail past +10 spends stones and Kinah; normal gear does not drop a level. Clash Rune is a different curve (drops 1, no pity)."
    }
  },

  amplify: {
    steps: [
      { from: 0, to: 1, rate: 0.66, pity: 0.05 },
      { from: 1, to: 2, rate: 0.50, pity: 0.04 },
      { from: 2, to: 3, rate: 0.33, pity: 0.03 },
      { from: 3, to: 4, rate: 0.25, pity: 0.02 },
      { from: 4, to: 5, rate: 0.20, pity: 0.01 }
    ],
    req: {
      es: "Solo Único o superior en mejora máxima (+15 Unique). Algunas piezas paran en ◆1 / ◆3 / ◆5.",
      en: "Only Unique+ at max enhancement (+15 Unique). Some items stop at ◆1 / ◆3 / ◆5."
    }
  },

  potential: {
    levels: 4,
    perLevel: { es: "+0,5 % stats PvP por nivel (seguro, siempre éxito).", en: "+0.5% PvP stats per level (guaranteed)." },
    note: {
      es: "Pista aparte de Enhancement/Amplify. Disponible en Unique; no gasta el mismo pity.",
      en: "Separate track from Enhancement/Amplify. Available on Unique; does not share pity."
    }
  },

  craft: {
    professions: [
      { id: "blacksmithing", name: { es: "Herrería (Blacksmithing)", en: "Blacksmithing" }, makes: { es: "Espadas, mandobles, dagas, bastones", en: "Swords, greatswords, daggers, staves" }, classes: ["gladiator", "templar", "assassin", "cleric"] },
      { id: "armorsmithing", name: { es: "Armería (Armorsmithing)", en: "Armorsmithing" }, makes: { es: "Armaduras", en: "Armor" }, classes: [] },
      { id: "handicrafting", name: { es: "Artesanía (Handicrafting)", en: "Handicrafting" }, makes: { es: "Arcos y bastones mágicos", en: "Bows and magic staves" }, classes: ["ranger"] },
      { id: "alchemy", name: { es: "Alquimia (Alchemy)", en: "Alchemy" }, makes: { es: "Libros mágicos y orbes", en: "Spellbooks and orbs" }, classes: ["sorcerer", "spiritmaster"] },
      { id: "cooking", name: { es: "Cocina (Cooking)", en: "Cooking" }, makes: { es: "Comida de buff", en: "Buff food" }, classes: [] }
    ],
    classNames: {
      gladiator: { es: "Gladiador", en: "Gladiator" },
      templar: { es: "Templario", en: "Templar" },
      assassin: { es: "Sicario", en: "Assassin" },
      cleric: { es: "Clérigo", en: "Cleric" },
      ranger: { es: "Ranger", en: "Ranger" },
      sorcerer: { es: "Hechicero", en: "Sorcerer" },
      spiritmaster: { es: "Espiritualista", en: "Spiritmaster" },
      chanter: { es: "Cantor (sin consenso KR)", en: "Chanter (no KR consensus)" }
    },
    /* Muestras KR ~1000 intentos (guía OC). El usuario puede poner su % medido. */
    samples: [
      { level: 10, success: 0.946, note: { es: "Con combos (Corea)", en: "With combos (KR)" } },
      { level: 45, success: 0.648, note: { es: "Con combos (Corea)", en: "With combos (KR)" } }
    ],
    combo: {
      es: "Combo = 3 tiradas: éxito base → activación combo (25 % brilliant / 20 % piedra superior KR) → segundo éxito. Calcula materiales en múltiplos.",
      en: "Combo = 3 rolls: base success → combo proc (25% brilliant / 20% higher stone KR) → second success. Buy materials in multiples."
    }
  },

  odds: {
    order: [
      { id: "manastone", es: "Manastone / Soulstone (engarces)", en: "Manastone / Soulstone (sockets)" },
      { id: "soulbind", es: "Soul Binding (pieza definitiva)", en: "Soul Binding (keeper piece)" },
      { id: "sync", es: "Sync (comprometido)", en: "Sync (committed)" },
      { id: "theostone", es: "Theostone (endgame)", en: "Theostone (endgame)" }
    ],
    soulbind: [
      { slot: { es: "Arma / offhand", en: "Weapon / offhand" }, opts: { es: "Vel. combate, poder, amplif. daño de arma (~98–100 % adopción KR)", en: "Atk speed, power, weapon dmg amp (~98–100% KR uptake)" } },
      { slot: { es: "Brazalete", en: "Bracelet" }, opts: { es: "Time [Siel], Destruction [Zikel], Illusion [Kaisinel]", en: "Time [Siel], Destruction [Zikel], Illusion [Kaisinel]" } },
      { slot: { es: "Broche", en: "Brooch" }, opts: { es: "Poder, precisión, golpe (broche = Sanctuary tardío KR)", en: "Power, accuracy, strike (brooch = late KR Sanctuary)" } }
    ],
    syncEssentials: [
      { slot: { es: "Casco", en: "Helm" }, opt: { es: "Golpe fuerte (poder de ataque)", en: "Powerful strike (attack power)" } },
      { slot: { es: "Pechera", en: "Chest" }, opt: { es: "Amplificación de daño", en: "Damage amplification" } },
      { slot: { es: "Piernas", en: "Legs" }, opt: { es: "Res. daño + poder de ataque", en: "Dmg resist + attack power" } },
      { slot: { es: "Pies", en: "Feet" }, opt: { es: "Vel. movimiento + perfección", en: "Move speed + perfection" } }
    ],
    note: {
      es: "Tasa de engarce y Sync no publicadas. Soul Binding: ~300k Kina reroll en Corea (no confirmado global). Pieza queda no comerciable.",
      en: "Socket and Sync rates unpublished. Soul Binding: ~300k Kinah reroll in KR (unconfirmed globally). Piece becomes untradeable."
    }
  },

  drops: {
    pity: [
      { tier: 1, clears: 14, reward: { es: "1 pieza (armadura/accesorio de esa mazmorra)", en: "1 piece (armor/acc from that dungeon)" } },
      { tier: 2, clears: 21, reward: { es: "1 pieza", en: "1 piece" } },
      { tier: 3, clears: 28, reward: { es: "1 pieza", en: "1 piece" } },
      { tier: 4, clears: 28, reward: { es: "2 piezas", en: "2 pieces" } }
    ],
    rules: {
      es: [
        "Paga el Odyle Energy Cube al salir, no el clear.",
        "Pity por mazmorra; no incluye armas.",
        "3 jefes con nombre; muerto = sin cofre.",
        "Mínimo de contribución 1 % (Chapter 1 KR).",
        "Fragmentos Sync Stone: Conquest Hard."
      ],
      en: [
        "You pay the Odyle Energy Cube on exit, not the clear.",
        "Pity is per dungeon; weapons excluded.",
        "3 named bosses; dead = no chest.",
        "1% contribution minimum (KR Chapter 1).",
        "Sync Stone fragments: Conquest Hard."
      ]
    },
    farms: [
      { item: { es: "Enhance Stones", en: "Enhance Stones" }, where: { es: "Misiones (cliente: cientos), Expedition (Krao, Fire Temple…), cofres, battle pass", en: "Quests (client: hundreds), Expedition (Krao, Fire Temple…), chests, battle pass" } },
      { item: { es: "Arcana (brújula, campana)", en: "Arcana (compass, bell)" }, where: { es: "Transcendence: Deus Research Base", en: "Transcendence: Deus Research Base" } },
      { item: { es: "Arcana (pergamino, espejo)", en: "Arcana (scroll, mirror)" }, where: { es: "Transcendence: Shattered Arkanis", en: "Transcendence: Shattered Arkanis" } },
      { item: { es: "Arcana (cáliz)", en: "Arcana (chalice)" }, where: { es: "Ambas Transcendence", en: "Both Transcendence dungeons" } },
      { item: { es: "Theostone", en: "Theostone" }, where: { es: "Transcendence y Sanctuary (endgame)", en: "Transcendence and Sanctuary (endgame)" } },
      { item: { es: "Odyle / Odyle Energy", en: "Odyle / Odyle Energy" }, where: { es: "Recolección en mapa (filtro Odyle) + límites diarios", en: "Gathering on the map (Odyle filter) + daily caps" } },
      { item: { es: "Rubí / materiales", en: "Ruby / mats" }, where: { es: "Mapa Aion 2 Forge (Verteron, Altgard…)", en: "Aion 2 Forge map (Verteron, Altgard…)" } }
    ],
    odyle: {
      es: "Con membresía ~80 energía/run (doble cofre), 15/3h; sin membresía 40 y 10/3h (números KR citados).",
      en: "With membership ~80 energy/run (double chest), 15/3h; without 40 and 10/3h (cited KR numbers)."
    }
  },

  pantheon: {
    slots: [
      { type: { es: "Coloso grande", en: "Large Colossus" }, n: 1, feeds: { es: "Stats de dios altas (puntos grandes)", en: "High god stats (large points)" } },
      { type: { es: "Estatuas", en: "Statues" }, n: 6, feeds: { es: "Death [Zikel] y similares", en: "Death [Zikel] and similar" } },
      { type: { es: "Cuadros", en: "Paintings" }, n: 10, feeds: { es: "Illusion, Wisdom, Destiny, Life…", en: "Illusion, Wisdom, Destiny, Life…" } }
    ],
    gods: [
      { id: "death", name: "Death [Zikel]", role: { es: "DPS (estatuas)", en: "DPS (statues)" }, effect: { es: "Daño / ofensiva", en: "Damage / offense" } },
      { id: "destruction", name: "Destruction [Zikel]", role: { es: "DPS (coloso)", en: "DPS (colossus)" }, effect: { es: "Destrucción", en: "Destruction" } },
      { id: "justice", name: "Justice [Nezekan]", role: { es: "Tanque (coloso)", en: "Tank (colossus)" }, effect: { es: "Defensa", en: "Defense" } },
      { id: "illusion", name: "Illusion [Kaisinel]", role: { es: "Caster (cuadros)", en: "Caster (paintings)" }, effect: { es: "CDR + pen. tenacidad", en: "CDR + tenacity pen" } },
      { id: "wisdom", name: "Wisdom [Lumiel]", role: { es: "Caster", en: "Caster" }, effect: { es: "Menos MP + golpe", en: "MP cost down + strike" } },
      { id: "destiny", name: "Destiny [Marchutan]", role: { es: "Soporte", en: "Support" }, effect: { es: "MP + proc tenacidad", en: "MP + tenacity proc" } },
      { id: "life", name: "Life [Yustiel]", role: { es: "Tanque / heal (cuadros)", en: "Tank / heal (paintings)" }, effect: { es: "HP + proc recuperación", en: "HP + recovery proc" } }
    ],
    grades: [
      { kind: { es: "Cuadro", en: "Painting" }, grade: { es: "Raro", en: "Rare" }, lines: 2, pts: 2 },
      { kind: { es: "Cuadro", en: "Painting" }, grade: { es: "Legendario", en: "Legendary" }, lines: 2, pts: 3 },
      { kind: { es: "Cuadro", en: "Painting" }, grade: { es: "Único", en: "Unique" }, lines: 3, pts: 4 },
      { kind: { es: "Cuadro", en: "Painting" }, grade: { es: "Épico", en: "Epic" }, lines: 3, pts: 5 },
      { kind: { es: "Estatua", en: "Statue" }, grade: { es: "Común", en: "Common" }, lines: 1, pts: 6 },
      { kind: { es: "Estatua", en: "Statue" }, grade: { es: "Raro", en: "Rare" }, lines: 2, pts: 8 },
      { kind: { es: "Estatua", en: "Statue" }, grade: { es: "Legendario", en: "Legendary" }, lines: 2, pts: 10 },
      { kind: { es: "Estatua", en: "Statue" }, grade: { es: "Único", en: "Unique" }, lines: 3, pts: 12 },
      { kind: { es: "Coloso", en: "Colossus" }, grade: { es: "Raro", en: "Rare" }, lines: 2, pts: 35 },
      { kind: { es: "Coloso", en: "Colossus" }, grade: { es: "Único", en: "Unique" }, lines: 3, pts: 45 },
      { kind: { es: "Coloso", en: "Colossus" }, grade: { es: "Épico", en: "Epic" }, lines: 3, pts: 55 }
    ]
  },

  arcana: {
    pieces: [
      { id: "compass", es: "Brújula", en: "Compass", from: "Deus Research Base", feeds: { es: "Activas", en: "Actives" } },
      { id: "bell", es: "Campana", en: "Bell", from: "Deus Research Base", feeds: { es: "Activas", en: "Actives" } },
      { id: "scroll", es: "Pergamino", en: "Scroll", from: "Shattered Arkanis", feeds: { es: "Activas / pasivas", en: "Actives / passives" } },
      { id: "mirror", es: "Espejo", en: "Mirror", from: "Shattered Arkanis", feeds: { es: "Pasivas", en: "Passives" } },
      { id: "chalice", es: "Cáliz", en: "Chalice", from: "Ambas / Both", feeds: { es: "Activas", en: "Actives" } },
      { id: "scales", es: "Scales (S2 KR)", en: "Scales (KR S2)", from: "Season 2 KR", feeds: { es: "Permite set 4+2", en: "Enables 4+2 set" } }
    ],
    rarity: [
      { g: { es: "Común", en: "Common" }, skills: 1 },
      { g: { es: "Raro", en: "Rare" }, skills: 2 },
      { g: { es: "Legendario", en: "Legendary" }, skills: 3 },
      { g: { es: "Único", en: "Unique" }, skills: 4 },
      { g: { es: "Épico", en: "Epic" }, skills: 5 }
    ],
    note: {
      es: "Solo Transcendence suelta Arcana. Skills por carta = suerte. Prioriza cartas de las habilidades que pulsas. Scales puede no estar el día 1 global.",
      en: "Only Transcendence drops Arcana. Skills per card = luck. Prioritize cards for skills you press. Scales may be missing on global day 1."
    }
  },

  stats: {
    roles: [
      {
        id: "melee",
        name: { es: "DPS cuerpo a cuerpo", en: "Melee DPS" },
        focus: { es: "Crit, precisión, amplif. daño / arma, soulbind ofensivo", en: "Crit, accuracy, dmg/weapon amp, offensive soulbind" }
      },
      {
        id: "caster",
        name: { es: "Caster", en: "Caster" },
        focus: { es: "Magic boost, precisión mágica, Illusion/Wisdom pantheon, Arcana de skills", en: "Magic boost, magical accuracy, Illusion/Wisdom pantheon, skill Arcana" }
      },
      {
        id: "tank",
        name: { es: "Tanque", en: "Tank" },
        focus: { es: "HP, bloqueo, res. crítico, Justice/Life pantheon", en: "HP, block, crit resist, Justice/Life pantheon" }
      },
      {
        id: "heal",
        name: { es: "Healer", en: "Healer" },
        focus: { es: "Heal boost, MP, CDR, Life pantheon", en: "Heal boost, MP, CDR, Life pantheon" }
      },
      {
        id: "pvp",
        name: { es: "PvP", en: "PvP" },
        focus: { es: "Potential (4×0,5 %), stats PvP de manastone, Azphel crystals", en: "Potential (4×0.5%), PvP manastones, Azphel crystals" }
      }
    ],
    layers: [
      { es: "Base + equipo + Enhancement/Amplify", en: "Base + gear + Enhancement/Amplify" },
      { es: "Manastone / Soulstone en engarces", en: "Manastone / Soulstone in sockets" },
      { es: "Soul Binding + Sync", en: "Soul Binding + Sync" },
      { es: "Pantheon + Wardrobe + títulos", en: "Pantheon + Wardrobe + titles" },
      { es: "Daevanion + Arcana (niveles de skill)", en: "Daevanion + Arcana (skill levels)" },
      { es: "Potential (PvP)", en: "Potential (PvP)" }
    ]
  },

  hub: [
    { id: "mejora", icon: "⬆", img: "img/oficial/ss_09.webp", guia: "progression__enhancement-amplify-y-transfer" },
    { id: "craft", icon: "⚒", img: "img/oficial/ss_01.webp", guia: "progression__fabricacion-cinco-profesiones-y-el-endgame-pve" },
    { id: "odds", icon: "◆", img: "img/oficial/ss_05.webp", guia: "progression__manastone-theostone-y-soul-binding" },
    { id: "drops", icon: "▣", img: "img/guias/d_kraocave.webp", guia: "dungeons__recompensas-de-mazmorra-el-cubo-y-el-contador-de-pity" },
    { id: "potential", icon: "★", img: "img/oficial/ss_13.webp", guia: "progression__enhancement-amplify-y-transfer" },
    { id: "stats", icon: "Σ", img: "img/oficial/library_hero.webp", guia: null },
    { id: "pantheon", icon: "⌂", img: "img/oficial/nc_teaser_og.webp", guia: "progression__pantheon-wardrobe-y-titulos-stats-ocultos" },
    { id: "arcana", icon: "◇", img: "img/oficial/ss_08.webp", guia: "progression__daevanion-y-arcana-mas-alla-del-techo-de-habilidad" }
  ]
};
