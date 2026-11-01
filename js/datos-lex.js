/* Nombres de categoría, modos y textos de la base en los 8 idiomas del sitio.
   Los nombres propios de objetos y monstruos llegan ya traducidos desde el cliente. */
(function () {
  function fila(es, fr, de, pt, ru, ko, ja) {
    return { es: es, fr: fr, de: de, pt: pt, ru: ru, ko: ko, ja: ja };
  }
  function pick(filaEn, en) {
    if (!filaEn || IDIOMA === "en") return en;
    return filaEn[IDIOMA] || filaEn.es || en;
  }

  var UI = {
    "datos.receta_de": fila("Receta:", "Recette :", "Rezept:", "Receita:", "Рецепт:", "제작법:", "レシピ:"),
    "datos.hab_de": fila("Habilidad de", "Compétence de", "Fertigkeit von", "Habilidade de", "Умение:", "스킬:", "スキル:"),
    "datos.comun": fila("Común", "Commune", "Gemeinsam", "Comum", "Общий", "공용", "共通"),
    "datos.brawler": fila("Luchador", "Bagarreur", "Faustkämpfer", "Lutador", "Кулачник", "권투사", "ナックル")
  };

  var RANGO = {
    Monster: fila("Monstruo", "Monstre", "Monster", "Monstro", "Монстр", "몬스터", "モンスター"),
    Boss: fila("Jefe", "Boss", "Boss", "Chefe", "Босс", "보스", "ボス"),
    "Elite monster": fila("Élite", "Élite", "Elite", "Elite", "Элита", "정예", "エリート"),
    "Field boss": fila("Jefe de zona", "Boss de zone", "Feldboss", "Chefe de zona", "Полевой босс", "필드 보스", "フィールドボス")
  };
  var NV = { es: "Nv", en: "Lv", fr: "Nv", de: "Lv", pt: "Nv", ru: "Ур.", ko: "Lv", ja: "Lv" };

  var CLASE = {
    Gladiator: "gladiator", Templar: "templar", Assassin: "assassin", Ranger: "ranger",
    Sorcerer: "sorcerer", Spiritmaster: "spiritmaster", Cleric: "cleric", Chanter: "chanter"
  };

  var CAT = {
    "Skin Reward Voucher": fila("Vale de aspecto", "Bon d'apparence", "Skin-Gutschein", "Vale de visual", "Купон облика", "외형 교환권", "外見引換券"),
    "Title Bestowing Item": fila("Objeto de título", "Objet de titre", "Titelgegenstand", "Item de título", "Предмет титула", "칭호 아이템", "称号アイテム"),
    "Duty (scroll) quest": fila("Misión de pergamino", "Quête parchemin", "Schriftrollen-Mission", "Missão de pergaminho", "Задание свитка", "스크롤 퀘스트", "巻物クエスト"),
    "Duty (mission) quest": fila("Misión de deber", "Quête de devoir", "Pflichtmission", "Missão de dever", "Долг", "의무 퀘스트", "義務クエスト"),
    "Exploration quest": fila("Misión de exploración", "Quête d'exploration", "Erkundungsmission", "Missão de exploração", "Исследование", "탐사 퀘스트", "探索クエスト"),
    "Episode quest": fila("Misión de episodio", "Quête d'épisode", "Episodenmission", "Missão de episódio", "Эпизод", "에피소드 퀘스트", "エピソードクエスト"),
    "Regional quest": fila("Misión regional", "Quête régionale", "Regionsmission", "Missão regional", "Региональное", "지역 퀘스트", "地域クエスト"),
    "Crafting quest": fila("Misión de craft", "Quête d'artisanat", "Herstellungsmission", "Missão de craft", "Ремесло", "제작 퀘스트", "製作クエスト"),
    "Ascension quest": fila("Misión de ascensión", "Quête d'ascension", "Aufstiegsmission", "Missão de ascensão", "Восхождение", "승급 퀘스트", "昇級クエスト"),
    "Daevagauge quest": fila("Misión Daevagauge", "Quête Daevagauge", "Daevagauge-Mission", "Missão Daevagauge", "Даевагейдж", "데바가이지 퀘스트", "デーヴァゲージクエスト"),
    Pet: fila("Mascota", "Familier", "Pet", "Mascote", "Питомец", "펫", "ペット"),
    Top: fila("Pecho", "Torse", "Brust", "Peito", "Нагрудник", "상의", "胴"),
    Legs: fila("Piernas", "Jambes", "Beine", "Perneiras", "Поножи", "하의", "脚"),
    Pauldrons: fila("Hombreras", "Épaulières", "Schultern", "Omoplatas", "Наплечники", "어깨", "肩"),
    Gloves: fila("Guantes", "Gants", "Handschuhe", "Luvas", "Перчатки", "장갑", "手袋"),
    Shoes: fila("Botas", "Bottes", "Stiefel", "Botas", "Сапоги", "신발", "靴"),
    Helm: fila("Yelmo", "Heaume", "Helm", "Elmo", "Шлем", "투구", "兜"),
    Cloak: fila("Capa", "Cape", "Umhang", "Capa", "Плащ", "망토", "マント"),
    "Usage Count Recharge Ticket": fila("Recarga de usos", "Recharge d'utilisations", "Aufladeticket", "Recarga de usos", "Билет зарядов", "사용 횟수 충전권", "使用回数チャージ"),
    "Usage Duration Recharge Ticket": fila("Recarga de duración", "Recharge de durée", "Zeitaufladung", "Recarga de duração", "Билет времени", "지속 시간 충전권", "持続時間チャージ"),
    "Reward Chest": fila("Cofre de recompensa", "Coffre de récompense", "Belohnungstruhe", "Baú de recompensa", "Сундук награды", "보상 상자", "報酬箱"),
    "Crafting Material": fila("Material de craft", "Matériau d'artisanat", "Herstellungsmaterial", "Material de craft", "Материал ремесла", "제작 재료", "製作素材"),
    "Gatherable Material": fila("Material de recolección", "Matériau de collecte", "Sammelmaterial", "Material de coleta", "Собираемый материал", "채집 재료", "採集素材"),
    "Substance Morph Material": fila("Material de transmutación", "Matériau de morphose", "Verwandlungsmaterial", "Material de transmutação", "Материал морфа", "변환 재료", "変換素材"),
    "Special Substance Morph Material": fila("Material especial de transmutación", "Matériau spécial de morphose", "Besonderes Verwandlungsmaterial", "Material especial de transmutação", "Особый материал морфа", "특수 변환 재료", "特殊変換素材"),
    "Pantheon Decor": fila("Decoración del Panteón", "Décor du Panthéon", "Pantheon-Deko", "Decoração do Panteão", "Декор Пантеона", "판테온 장식", "パンテオン装飾"),
    "Wings Unlocking Item": fila("Objeto de alas", "Objet d'ailes", "Flügel-Gegenstand", "Item de asas", "Предмет крыльев", "날개 해제 아이템", "翼解放アイテム"),
    Longsword: fila("Espada larga", "Épée longue", "Langschwert", "Espada longa", "Длинный меч", "장검", "長剣"),
    Theostone: fila("Piedra divina", "Pierre divine", "Theostein", "Pedra divina", "Теокамень", "신석", "神石"),
    Greatsword: fila("Mandoble", "Espadon", "Großschwert", "Montante", "Двуручный меч", "대검", "大剣"),
    Dagger: fila("Daga", "Dague", "Dolch", "Adaga", "Кинжал", "단검", "短剣"),
    Bow: fila("Arco", "Arc", "Bogen", "Arco", "Лук", "활", "弓"),
    Spellbook: fila("Libro de hechizos", "Grimoire", "Zauberbuch", "Livro de feitiços", "Книга заклинаний", "마법서", "魔導書"),
    Orb: fila("Orbe", "Orbe", "Kugel", "Orbe", "Сфера", "오브", "オーブ"),
    Mace: fila("Maza", "Masse", "Streitkolben", "Maça", "Булава", "메이스", "メイス"),
    Staff: fila("Báculo", "Bâton", "Stab", "Cajado", "Посох", "지팡이", "杖"),
    Guard: fila("Escudo", "Bouclier", "Schild", "Escudo", "Щит", "방패", "盾"),
    Armorsmithing: fila("Armería", "Armurerie", "Rüstungsschmiede", "Armaria", "Доспехи", "방어구 제작", "防具製作"),
    Handicrafting: fila("Artesanía", "Artisanat", "Handwerk", "Artesanato", "Рукоделие", "수공예", "手工芸"),
    Blacksmithing: fila("Herrería", "Forge", "Schmiede", "Ferraria", "Кузнечное дело", "대장간", "鍛冶"),
    Alchemy: fila("Alquimia", "Alchimie", "Alchemie", "Alquimia", "Алхимия", "연금술", "錬金"),
    Cooking: fila("Cocina", "Cuisine", "Kochen", "Culinária", "Кулинария", "요리", "料理"),
    "Battle Pass": fila("Pase de batalla", "Passe de combat", "Kampfpass", "Passe de batalha", "Боевой пропуск", "배틀 패스", "バトルパス"),
    Earrings: fila("Pendientes", "Boucles d'oreilles", "Ohrringe", "Brincos", "Серьги", "귀걸이", "耳飾り"),
    Ring: fila("Anillo", "Anneau", "Ring", "Anel", "Кольцо", "반지", "指輪"),
    Necklace: fila("Collar", "Collier", "Halskette", "Colar", "Ожерелье", "목걸이", "首飾り"),
    Food: fila("Comida", "Nourriture", "Nahrung", "Comida", "Еда", "음식", "食物"),
    Beverage: fila("Bebida", "Boisson", "Getränk", "Bebida", "Напиток", "음료", "飲料"),
    Potion: fila("Poción", "Potion", "Trank", "Poção", "Зелье", "물약", "ポーション"),
    Scroll: fila("Pergamino", "Parchemin", "Schriftrolle", "Pergaminho", "Свиток", "주문서", "巻物"),
    "Quest Scroll": fila("Pergamino de misión", "Parchemin de quête", "Questrolle", "Pergaminho de missão", "Свиток задания", "퀘스트 주문서", "クエスト巻物"),
    Manastone: fila("Manastone", "Pierre de mana", "Manastein", "Manastone", "Манакамень", "마나스톤", "マナストーン"),
    Arcana: fila("Arcana", "Arcana", "Arkana", "Arcana", "Аркана", "아르카나", "アルカナ"),
    Currencies: fila("Moneda", "Monnaie", "Währung", "Moeda", "Валюта", "화폐", "通貨"),
    Upgrade: fila("Mejora", "Amélioration", "Aufwertung", "Melhoria", "Улучшение", "강화 재료", "強化素材"),
    Transformation: fila("Transformación", "Transformation", "Verwandlung", "Transformação", "Трансформация", "변신", "変身"),
    Emote: fila("Gesto", "Emote", "Emote", "Emote", "Эмоция", "감정 표현", "エモート"),
    Key: fila("Llave", "Clé", "Schlüssel", "Chave", "Ключ", "열쇠", "鍵"),
    "Power Shard": fila("Fragmento de poder", "Éclat de puissance", "Machtsplitter", "Fragmento de poder", "Осколок силы", "파워 샤드", "パワーシャード"),
    "Transfer Stone": fila("Piedra de transferencia", "Pierre de transfert", "Transferstein", "Pedra de transferência", "Камень переноса", "전이석", "転移石"),
    "Soul Crystal": fila("Cristal de alma", "Cristal d'âme", "Seelenkristall", "Cristal de alma", "Кристалл души", "영혼 수정", "魂の結晶"),
    Bracelet: fila("Brazalete", "Bracelet", "Armreif", "Bracelete", "Браслет", "팔찌", "腕輪"),
    Belt: fila("Cinturón", "Ceinture", "Gürtel", "Cinto", "Пояс", "허리띠", "ベルト"),
    Fist: fila("Puño", "Poing", "Faust", "Punho", "Кулак", "권갑", "ナックル"),
    Chalice: fila("Cáliz", "Calice", "Kelch", "Cálice", "Чаша", "성배", "聖杯"),
    Parchment: fila("Pergamino", "Parchemin", "Pergament", "Pergaminho", "Пергамент", "양피지", "羊皮紙"),
    Compass: fila("Brújula", "Boussole", "Kompass", "Bússola", "Компас", "나침반", "羅針盤"),
    Bell: fila("Campana", "Cloche", "Glocke", "Sino", "Колокол", "종", "鈴"),
    Mirror: fila("Espejo", "Miroir", "Spiegel", "Espelho", "Зеркало", "거울", "鏡"),
    Quests: fila("Misiones", "Quêtes", "Quests", "Missões", "Задания", "퀘스트", "クエスト"),
    Items: fila("Objetos", "Objets", "Gegenstände", "Itens", "Предметы", "아이템", "アイテム"),
    Materials: fila("Materiales", "Matériaux", "Materialien", "Materiais", "Материалы", "재료", "素材"),
    "Item category": fila("Categoría", "Catégorie", "Kategorie", "Categoria", "Категория", "분류", "分類"),
    Miscellaneous: fila("Varios", "Divers", "Verschiedenes", "Diversos", "Разное", "기타", "その他"),
    Consumables: fila("Consumible", "Consommable", "Verbrauchbar", "Consumível", "Расходник", "소모품", "消耗品"),
    "Special Material": fila("Material especial", "Matériau spécial", "Sondermaterial", "Material especial", "Особый материал", "특수 재료", "特殊素材"),
    "Special Points": fila("Puntos especiales", "Points spéciaux", "Sonderpunkte", "Pontos especiais", "Особые очки", "특수 포인트", "特殊ポイント"),
    "Instant Clear Ticket": fila("Ticket de clear", "Ticket de clear", "Sofort-Ticket", "Ticket de clear", "Билет зачистки", "즉시 클리어권", "即クリア券"),
    Valuables: fila("Objeto valioso", "Objet de valeur", "Wertgegenstand", "Objeto valioso", "Ценность", "귀중품", "貴重品"),
    "Crafting Skill Learning Tool": fila("Aprendizaje de oficio", "Apprentissage d'artisanat", "Berufslehre", "Aprendizado de ofício", "Изучение ремесла", "제작 스킬 습득", "製作スキル習得"),
    "Potential Enhance Stone": fila("Piedra de potencial", "Pierre de potentiel", "Potenzialstein", "Pedra de potencial", "Камень потенциала", "잠재력 강화석", "潜在力強化石"),
    "Empyrean Trace": fila("Rastro empíreo", "Trace empyréenne", "Empyreische Spur", "Vestígio empíreo", "Эмпирейский след", "천공의 흔적", "天穹の痕跡"),
    "Philosopher's Stone": fila("Piedra filosofal", "Pierre philosophale", "Stein der Weisen", "Pedra filosofal", "Философский камень", "현자의 돌", "賢者の石"),
    Kisk: fila("Kisk", "Kisk", "Kisk", "Kisk", "Киск", "키스크", "キスク"),
    Amulet: fila("Amuleto", "Amulette", "Amulett", "Amuleto", "Амулет", "부적", "アミュレット"),
    Rune: fila("Runa", "Rune", "Rune", "Runa", "Руна", "룬", "ルーン"),
    Note: fila("Nota", "Note", "Notiz", "Nota", "Записка", "쪽지", "メモ"),
    Teleport: fila("Teletransporte", "Téléportation", "Teleport", "Teleporte", "Телепорт", "텔레포트", "テレポート"),
    Subscription: fila("Suscripción", "Abonnement", "Abo", "Assinatura", "Подписка", "구독", "サブスク"),
    Customization: fila("Personalización", "Personnalisation", "Anpassung", "Personalização", "Кастомизация", "커스터마이즈", "カスタム"),
    "Expansion Tool": fila("Expansión", "Extension", "Erweiterung", "Expansão", "Расширение", "확장 도구", "拡張ツール"),
    "Kina Chest": fila("Cofre de Kina", "Coffre de Kina", "Kina-Truhe", "Baú de Kina", "Сундук Кины", "키나 상자", "キナの箱"),
    Rebirth: fila("Renacimiento", "Renaissance", "Wiedergeburt", "Renascimento", "Перерождение", "환생", "転生"),
    Ascension: fila("Ascensión", "Ascension", "Aufstieg", "Ascensão", "Восхождение", "승급", "昇級"),
    "Transmutation Material": fila("Material de transmutación", "Matériau de transmutation", "Transmutationsmaterial", "Material de transmutação", "Материал трансмутации", "변환 재료", "変成素材"),
    "Quna Recharge": fila("Recarga de Quna", "Recharge de Quna", "Quna-Aufladung", "Recarga de Quna", "Заряд Куны", "큐나 충전", "キューナチャージ"),
    "Skin Combine": fila("Combinar aspectos", "Combiner des apparences", "Skins kombinieren", "Combinar visuais", "Сочетание обликов", "외형 합성", "外見合成"),
    "Extract Skin": fila("Extraer aspecto", "Extraire l'apparence", "Skin extrahieren", "Extrair visual", "Извлечь облик", "외형 추출", "外見抽出"),
    "Pet Transformation": fila("Transformación de mascota", "Transformation de familier", "Pet-Verwandlung", "Transformação de mascote", "Облик питомца", "펫 변신", "ペット変身"),
    "Unlock Character Slots": fila("Huecos de personaje", "Emplacements de personnage", "Charakterplätze", "Espaços de personagem", "Слоты персонажа", "캐릭터 슬롯", "キャラクタースロット"),
    "Daeva Express": fila("Daeva Express", "Daeva Express", "Daeva Express", "Daeva Express", "Даева Экспресс", "데바 익스프레스", "デーヴァエクスプレス"),
    "Essence Extraction Learning Tool": fila("Aprendizaje de extracción", "Apprentissage d'extraction", "Essenzlehre", "Aprendizado de extração", "Изучение извлечения", "정수 추출 습득", "精髄抽出習得"),
    "Substance Morph Design": fila("Diseño de transmutación", "Plan de morphose", "Verwandlungsplan", "Projeto de transmutação", "Чертёж морфа", "변환 도안", "変換設計図"),
    Section: fila("Sección", "Section", "Abschnitt", "Seção", "Раздел", "구역", "セクション"),
    World: fila("Mundo", "Monde", "Welt", "Mundo", "Мир", "월드", "ワールド")
  };

  var MODO = {
    Exploration: fila("Exploración", "Exploration", "Erkundung", "Exploração", "Исследование", "탐사", "探索"),
    Conquest: fila("Conquista", "Conquête", "Eroberung", "Conquista", "Завоевание", "정복", "征服"),
    Normal: fila("Normal", "Normal", "Normal", "Normal", "Обычный", "일반", "ノーマル"),
    Hard: fila("Difícil", "Difficile", "Schwer", "Difícil", "Сложный", "어려움", "ハード"),
    "Conquest [Hard]": fila("Conquista [Difícil]", "Conquête [Difficile]", "Eroberung [Schwer]", "Conquista [Difícil]", "Завоевание [Сложный]", "정복 [어려움]", "征服 [ハード]")
  };
  var TRANS = fila("Trascendencia", "Transcendance", "Transzendenz", "Transcendência", "Трансцендентность", "초월", "超越");

  var PREFIJO = [
    [/^(Dungeon)\b/, fila("Mazmorra", "Donjon", "Dungeon", "Masmorra", "Подземелье", "던전", "ダンジョン")],
    [/^(Crafted)\b/, fila("Fabricado", "Fabriqué", "Hergestellt", "Fabricado", "Создано", "제작", "製作")],
    [/^(Gathered)\b/, fila("Recolectado", "Récolté", "Gesammelt", "Coletado", "Собрано", "채집", "採集")],
    [/^(Sold by)\b/, fila("Lo vende", "Vendu par", "Verkauft von", "Vendido por", "Продаёт", "판매", "販売")],
    [/^(In chests)\b/, fila("En cofres", "Dans des coffres", "In Truhen", "Em baús", "В сундуках", "상자", "宝箱")],
    [/^(Quest)\b/, fila("Misión", "Quête", "Quest", "Missão", "Задание", "퀘스트", "クエスト")]
  ];

  var EN = {
    "datos.anti": "Client 2026.10.28",
    "datos.titulo": "Items, craft and odds",
    "datos.sub": "Search an item, skill or monster. The sheet shows soul binding, the chance per clear, the craft list minus what you already have, and which piece to enhance first.",
    "datos.buscar": "Search", "datos.ph": "Name or id, for example Ludra",
    "datos.fuente": "Official client names. Figures via",
    "datos.minimo": "Type at least 2 letters.", "datos.cargando": "Loading…",
    "datos.nada": "Nothing by that name.", "datos.abrir": "Open sheet",
    "datos.comparar": "Compare", "datos.en_comparar": "In compare",
    "datos.volver": "Back to search", "datos.abierto": "Source page",
    "datos.stats": "Fixed stats", "datos.mejor": "highest of its kind",
    "datos.soul": "Soul binding", "datos.soul_txt": "Chance one binding grants that line. Min and max of the roll.",
    "datos.skills": "Skill effect on binding", "datos.elige_stat": "Stat to compare",
    "datos.drops": "Chance per clear", "datos.como": "How to get it",
    "datos.adds": "What a full enhance adds", "datos.mas": "More tables",
    "datos.craft": "Materials", "datos.cantidad": "How many",
    "datos.calcular": "Calculate materials", "datos.calcular_mejora": "Calculate enhance",
    "datos.hace_falta": "Required", "datos.tengo": "I already have", "datos.falta": "Still need",
    "datos.sin_fee": "This recipe charges no Kinah.", "datos.fee": "Recipe Kinah",
    "datos.resta": "Still needed, minus what you marked", "datos.crafts": "Crafts",
    "datos.vacio_pin": "Empty slot", "datos.quitar": "Remove", "datos.ver_comparar": "See comparison",
    "datos.elige_dos": "Pin two pieces with Compare.",
    "datos.desde": "From", "datos.hasta": "To",
    "datos.kinah": "Expected Kinah", "datos.intentos": "Expected tries",
    "datos.por_kinah": "More stat per million Kinah", "datos.primero": "Enhance first",
    "datos.empate": "Tie on that stat per Kinah.", "datos.igual": "Enhancing either costs the same Kinah.",
    "datos.mas_barato": "Cheaper to enhance",
    "datos.rango_ratio": "Stat per Kinah uses the full climb the sheet publishes (from +0 up to that +).",
    "datos.cubos_txt": "Each mode: cube energy, cubes until the guaranteed reward, and Kinah the cube pays.",
    "datos.asterisco": "The asterisk: that mode's chest is not in the tables yet; the Kinah is the source's reference figure.",
    "datos.energia": "Energy", "datos.hasta_premio": "Cubes to reward",
    "datos.kinah_cubo": "Kinah in the cube", "datos.dias": "Days from empty", "datos.premio": "Guaranteed reward",
    "datos.tipo.todo": "All", "datos.tipo.objetos": "Items", "datos.tipo.skills": "Skills",
    "datos.tipo.monstruos": "Monsters", "datos.tipo.recetas": "Recipes", "datos.tipo.misiones": "Quests",
    "datos.tipo.cubos": "Odyle cube",
    "datos.receta_de": "Recipe:", "datos.hab_de": "Skill:", "datos.comun": "Shared", "datos.brawler": "Brawler"
  };
  var MAS = {
    "datos.anti": fila("Cliente 2026.10.28", "Client 2026.10.28", "Client 2026.10.28", "Cliente 2026.10.28", "Клиент 2026.10.28", "클라이언트 2026.10.28", "クライアント 2026.10.28"),
    "datos.titulo": fila("Objetos, craft y probabilidades", "Objets, craft et probabilités", "Gegenstände, Craft und Chancen", "Itens, craft e chances", "Предметы, крафт и шансы", "아이템, 제작, 확률", "アイテム、製作、確率"),
    "datos.sub": fila("Busca un objeto, skill o monstruo. La ficha muestra el soul binding, la probabilidad por clear, el craft restando lo que ya tienes y qué pieza subir primero.", "Cherchez un objet, une compétence ou un monstre. La fiche montre le lien d'âme, la chance par clear, le craft moins ce que vous avez déjà, et quoi améliorer d'abord.", "Suche Gegenstand, Fertigkeit oder Monster. Die Karte zeigt Seelenbindung, Chance pro Clear, Craft abzüglich dessen, was du hast, und was du zuerst verbesserst.", "Busque um item, skill ou monstro. A ficha mostra o vínculo da alma, a chance por clear, o craft menos o que você já tem e o que melhorar primeiro.", "Ищите предмет, умение или монстра. Карточка показывает связь души, шанс за зачистку, крафт минус то, что уже есть, и что улучшать первым.", "아이템, 스킬, 몬스터를 찾습니다. 카드에 영혼 결속, 클리어 확률, 가진 재료를 뺀 제작, 먼저 강화할 장비가 나옵니다.", "アイテム、スキル、モンスターを検索。魂の結縛、クリア確率、所持分を引いた製作、先に強化する装備を表示します。"),
    "datos.buscar": fila("Buscar", "Chercher", "Suchen", "Buscar", "Поиск", "검색", "検索"),
    "datos.ph": fila("Nombre o id, por ejemplo Ludra", "Nom ou id, par exemple Ludra", "Name oder ID, zum Beispiel Ludra", "Nome ou id, por exemplo Ludra", "Имя или id, например Ludra", "이름 또는 id, 예: 루드라", "名前かID、例: ルドラ"),
    "datos.fuente": fila("Nombres oficiales del cliente. Cifras vía", "Noms officiels du client. Chiffres via", "Offizielle Client-Namen. Zahlen über", "Nomes oficiais do cliente. Números via", "Официальные имена клиента. Цифры через", "클라이언트 공식 이름. 수치는", "クライアント公式名。数値は"),
    "datos.minimo": fila("Escribe al menos 2 letras.", "Écrivez au moins 2 lettres.", "Mindestens 2 Buchstaben.", "Digite pelo menos 2 letras.", "Введите хотя бы 2 буквы.", "두 글자 이상 입력하세요.", "2文字以上入力してください。"),
    "datos.cargando": fila("Leyendo…", "Lecture…", "Lädt…", "Lendo…", "Загрузка…", "읽는 중…", "読み込み中…"),
    "datos.nada": fila("Nada con ese nombre.", "Rien sous ce nom.", "Nichts mit diesem Namen.", "Nada com esse nome.", "Ничего с таким именем.", "그 이름이 없습니다.", "その名前はありません。"),
    "datos.abrir": fila("Ver ficha", "Voir la fiche", "Karte öffnen", "Ver ficha", "Открыть", "카드 보기", "詳細"),
    "datos.comparar": fila("Comparar", "Comparer", "Vergleichen", "Comparar", "Сравнить", "비교", "比較"),
    "datos.en_comparar": fila("En la comparación", "Dans la comparaison", "Im Vergleich", "Na comparação", "В сравнении", "비교 중", "比較中"),
    "datos.volver": fila("Volver a la búsqueda", "Retour à la recherche", "Zurück zur Suche", "Voltar à busca", "К поиску", "검색으로", "検索に戻る"),
    "datos.abierto": fila("Ficha de origen", "Page source", "Quellseite", "Página de origem", "Источник", "출처", "出典"),
    "datos.stats": fila("Stats fijos", "Stats fixes", "Feste Werte", "Atributos fixos", "Фикс. статы", "고정 스탯", "固定ステータス"),
    "datos.mejor": fila("el más alto de su tipo", "le plus haut de sa catégorie", "der höchste seiner Art", "o mais alto do tipo", "высший в своём типе", "같은 종류 중 최고", "同種で最高"),
    "datos.soul": fila("Soul binding", "Lien d'âme", "Seelenbindung", "Vínculo da alma", "Связь души", "영혼 결속", "魂の結縛"),
    "datos.soul_txt": fila("Probabilidad de que un binding te dé esa línea. Mínimo y máximo del valor.", "Chance qu'un lien donne cette ligne. Minimum et maximum.", "Chance, dass eine Bindung diese Zeile gibt. Minimum und Maximum.", "Chance de um vínculo dar essa linha. Mínimo e máximo.", "Шанс, что связь даст эту строку. Минимум и максимум.", "결속이 이 줄을 줄 확률. 최소와 최대.", "結縛でその行が出る確率。最小と最大。"),
    "datos.skills": fila("Efecto de skill al vincular", "Effet de compétence au lien", "Fertigkeitseffekt bei Bindung", "Efeito de skill no vínculo", "Эффект умения при связи", "결속 시 스킬 효과", "結縛時のスキル効果"),
    "datos.elige_stat": fila("Stat a comparar", "Stat à comparer", "Wert zum Vergleich", "Atributo a comparar", "Стат для сравнения", "비교할 스탯", "比べるステータス"),
    "datos.drops": fila("Probabilidad por clear", "Chance par clear", "Chance pro Clear", "Chance por clear", "Шанс за зачистку", "클리어당 확률", "クリアごとの確率"),
    "datos.como": fila("Cómo se consigue", "Comment l'obtenir", "So bekommt man es", "Como obter", "Как получить", "획득 방법", "入手方法"),
    "datos.adds": fila("Lo que suma la mejora completa", "Ce qu'ajoute l'amélioration complète", "Was die volle Verbesserung gibt", "O que a melhoria completa soma", "Что даёт полная заточка", "풀 강화가 더하는 것", "最大強化で増える値"),
    "datos.mas": fila("Más tablas", "Plus de tableaux", "Weitere Tabellen", "Mais tabelas", "Ещё таблицы", "표 더 보기", "ほかの表"),
    "datos.craft": fila("Materiales", "Matériaux", "Materialien", "Materiais", "Материалы", "재료", "素材"),
    "datos.cantidad": fila("Cuántos quieres", "Combien", "Wie viele", "Quantos", "Сколько", "수량", "個数"),
    "datos.calcular": fila("Calcular materiales", "Calculer les matériaux", "Material berechnen", "Calcular materiais", "Посчитать материалы", "재료 계산", "素材を計算"),
    "datos.calcular_mejora": fila("Calcular mejora", "Calculer l'amélioration", "Verbesserung berechnen", "Calcular melhoria", "Посчитать заточку", "강화 계산", "強化を計算"),
    "datos.hace_falta": fila("Hace falta", "Il faut", "Benötigt", "Precisa", "Нужно", "필요", "必要"),
    "datos.tengo": fila("Ya tengo", "J'ai déjà", "Habe schon", "Já tenho", "Уже есть", "보유", "所持"),
    "datos.falta": fila("Falta", "Reste", "Fehlt", "Falta", "Ещё", "부족", "不足"),
    "datos.sin_fee": fila("Esta receta no cobra kinah.", "Cette recette ne coûte pas de kinah.", "Dieses Rezept kostet kein Kinah.", "Esta receita não cobra kinah.", "Этот рецепт не берёт кина.", "이 제작은 키나를 안 받습니다.", "このレシピはキナ不要です。"),
    "datos.fee": fila("Kinah de la receta", "Kinah de la recette", "Rezept-Kinah", "Kinah da receita", "Кина рецепта", "제작 키나", "レシピのキナ"),
    "datos.resta": fila("Te falta, restando lo que marcaste", "Il reste, moins ce que vous avez coché", "Noch nötig, abzüglich markiert", "Ainda falta, menos o que marcou", "Ещё нужно, минус отмеченное", "표시한 수량을 뺀 부족분", "所持を引いた不足"),
    "datos.crafts": fila("Crafteos", "Crafts", "Herstellungen", "Crafts", "Крафты", "제작 횟수", "製作回数"),
    "datos.vacio_pin": fila("Hueco libre", "Place libre", "Frei", "Vaga", "Пусто", "빈 칸", "空き"),
    "datos.quitar": fila("Quitar", "Retirer", "Entfernen", "Tirar", "Убрать", "빼기", "外す"),
    "datos.ver_comparar": fila("Ver comparación", "Voir la comparaison", "Vergleich ansehen", "Ver comparação", "Смотреть сравнение", "비교 보기", "比較を見る"),
    "datos.elige_dos": fila("Fija dos piezas con Comparar.", "Épinglez deux pièces avec Comparer.", "Pinne zwei Teile mit Vergleichen.", "Fixe duas peças com Comparar.", "Закрепите две вещи кнопкой Сравнить.", "비교로 두 장비를 고정하세요.", "比較で二つ固定してください。"),
    "datos.desde": fila("Desde", "Depuis", "Von", "De", "От", "부터", "から"),
    "datos.hasta": fila("Hasta", "Jusqu'à", "Bis", "Até", "До", "까지", "まで"),
    "datos.kinah": fila("Kinah esperado", "Kinah attendu", "Erwartetes Kinah", "Kinah esperado", "Ожидаемая кина", "예상 키나", "期待キナ"),
    "datos.intentos": fila("Intentos esperados", "Essais attendus", "Erwartete Versuche", "Tentativas esperadas", "Ожидаемые попытки", "예상 시도", "期待試行"),
    "datos.por_kinah": fila("Más stat por millón de kinah", "Plus de stat par million de kinah", "Mehr Wert pro Million Kinah", "Mais atributo por milhão de kinah", "Больше стата на миллион кина", "키나 100만당 스탯", "キナ100万あたりのステータス"),
    "datos.primero": fila("Mejorar primero", "Améliorer d'abord", "Zuerst verbessern", "Melhorar primeiro", "Улучшать первым", "먼저 강화", "先に強化"),
    "datos.empate": fila("Empate en ese stat por kinah.", "Égalité sur ce stat par kinah.", "Gleichstand bei diesem Wert pro Kinah.", "Empate nesse atributo por kinah.", "Ничья по этому стату на кина.", "그 스탯은 키나당 동점입니다.", "そのステータスは同点です。"),
    "datos.igual": fila("Subirlas cuesta el mismo kinah.", "Les améliorer coûte le même kinah.", "Beide kosten gleich viel Kinah.", "Melhorá-las custa o mesmo kinah.", "Улучшение стоит одинаково.", "강화 키나가 같습니다.", "強化キナは同じです。"),
    "datos.mas_barato": fila("Sale más barato de subir", "Moins cher à améliorer", "Billiger zu verbessern", "Mais barato de melhorar", "Дешевле улучшать", "강화가 더 쌉니다", "強化が安い"),
    "datos.rango_ratio": fila("El stat por kinah usa la subida completa que publica la ficha (desde +0 hasta ese +).", "Le stat par kinah utilise la montée complète de la fiche (de +0 jusqu'à ce +).", "Der Wert pro Kinah nutzt den vollen Anstieg der Karte (von +0 bis zu diesem +).", "O atributo por kinah usa a subida completa da ficha (de +0 até esse +).", "Стат на кина берёт полный подъём карточки (с +0 до этого +).", "키나당 스탯은 카드의 전체 강화(+0부터 그 +까지)를 씁니다.", "キナあたりはカードの全強化（+0からその+）を使います。"),
    "datos.cubos_txt": fila("Cada modo: energía del cubo, cubos hasta el premio seguro y kinah que deja el cubo.", "Chaque mode : énergie du cube, cubes jusqu'à la récompense garantie et kinah du cube.", "Jeder Modus: Würfelenergie, Würfel bis zur Garantie und Kinah des Würfels.", "Cada modo: energia do cubo, cubos até o prêmio garantido e kinah do cubo.", "Каждый режим: энергия куба, кубы до гарантии и кина куба.", "모드마다 큐브 에너지, 확정 보상까지 큐브 수, 큐브 키나.", "各モードのキューブエネルギー、確定までの数、キューブのキナ。"),
    "datos.asterisco": fila("El asterisco: el cofre de ese modo aún no está en las tablas; el kinah es el de referencia de la fuente.", "L'astérisque : le coffre de ce mode n'est pas encore dans les tables ; le kinah est celui de référence de la source.", "Der Stern: die Truhe dieses Modus steht noch nicht in den Tabellen; das Kinah ist der Referenzwert der Quelle.", "O asterisco: o baú desse modo ainda não está nas tabelas; o kinah é o de referência da fonte.", "Звёздочка: сундук этого режима ещё не в таблицах; кина — опорная цифра источника.", "별표: 그 모드의 상자는 아직 표에 없고, 키나는 출처의 기준값입니다.", "星印: そのモードの箱はまだ表になく、キナは出典の基準値です。"),
    "datos.energia": fila("Energía", "Énergie", "Energie", "Energia", "Энергия", "에너지", "エネルギー"),
    "datos.hasta_premio": fila("Cubos al premio", "Cubes jusqu'au prix", "Würfel bis zur Belohnung", "Cubos até o prêmio", "Кубов до награды", "보상까지 큐브", "報酬までのキューブ"),
    "datos.kinah_cubo": fila("Kinah del cubo", "Kinah du cube", "Kinah des Würfels", "Kinah do cubo", "Кина куба", "큐브 키나", "キューブのキナ"),
    "datos.dias": fila("Días en vacío", "Jours à vide", "Tage aus leer", "Dias do zero", "Дней с нуля", "빈 상태에서 일수", "空からの日数"),
    "datos.premio": fila("Premio seguro", "Récompense garantie", "Garantierte Belohnung", "Prêmio garantido", "Гарантия", "확정 보상", "確定報酬"),
    "datos.tipo.todo": fila("Todo", "Tout", "Alles", "Tudo", "Всё", "전체", "すべて"),
    "datos.tipo.objetos": fila("Objetos", "Objets", "Gegenstände", "Itens", "Предметы", "아이템", "アイテム"),
    "datos.tipo.skills": fila("Skills", "Compétences", "Fertigkeiten", "Skills", "Умения", "스킬", "スキル"),
    "datos.tipo.monstruos": fila("Monstruos", "Monstres", "Monster", "Monstros", "Монстры", "몬스터", "モンスター"),
    "datos.tipo.recetas": fila("Recetas", "Recettes", "Rezepte", "Receitas", "Рецепты", "제작법", "レシピ"),
    "datos.tipo.misiones": fila("Misiones", "Quêtes", "Quests", "Missões", "Задания", "퀘스트", "クエスト"),
    "datos.tipo.cubos": fila("Cubo de Odyle", "Cube d'Odyle", "Odyle-Würfel", "Cubo de Odyle", "Куб Одила", "오딜 큐브", "オディールキューブ")
  };
  Object.keys(MAS).forEach(function (k) { UI[k] = MAS[k]; });

  window.datosUi = function (clave) {
    if (IDIOMA === "en") return EN[clave] || "";
    var f = UI[clave];
    if (!f) return "";
    return f[IDIOMA] || f.es || EN[clave] || "";
  };

  window.datosSub = function (sub) {
    var m = /^(Monster|Boss|Elite monster|Field boss) · Lv (\d+)$/.exec(sub || "");
    if (m) {
      var rango = pick(RANGO[m[1]], m[1]);
      var nv = NV[IDIOMA] || "Lv";
      return rango + " · " + nv + " " + m[2];
    }
    var sk = /^(.*) skill$/.exec(sub || "");
    if (sk) {
      var quien = sk[1];
      if (quien === "Shared") quien = window.datosUi("datos.comun");
      else if (quien === "Brawler") quien = window.datosUi("datos.brawler");
      else if (CLASE[quien] && typeof CLASES_INFO !== "undefined") {
        var info = null;
        for (var i = 0; i < CLASES_INFO.length; i++) if (CLASES_INFO[i].id === CLASE[quien]) info = CLASES_INFO[i];
        if (info) quien = info[IDIOMA] || info.es || quien;
      }
      if (IDIOMA === "en") return (sk[1] === "Shared" ? "Shared" : sk[1]) + " skill";
      return window.datosUi("datos.hab_de") + " " + quien;
    }
    if (CAT[sub]) return pick(CAT[sub], sub);
    return sub || "";
  };

  window.datosModo = function (modo) {
    if (MODO[modo]) return pick(MODO[modo], modo);
    var tr = /^Transcendence Stage (\d+)$/.exec(modo || "");
    if (tr) return pick(TRANS, "Transcendence") + " " + tr[1];
    return modo || "";
  };

  window.datosLinea = function (linea) {
    var texto = linea || "";
    if (IDIOMA === "en") return texto;
    for (var i = 0; i < PREFIJO.length; i++) {
      if (PREFIJO[i][0].test(texto)) {
        return texto.replace(PREFIJO[i][0], pick(PREFIJO[i][1], ""));
      }
    }
    return texto;
  };

  window.datosEtiqueta = function (label, tipo) {
    var base = label || "";
    var esReceta = tipo === "recipes" || /\srecipe$/i.test(base);
    if (!esReceta) return base;
    base = base.replace(/\srecipe$/i, "");
    if (IDIOMA === "en") return base + " recipe";
    return window.datosUi("datos.receta_de") + " " + base;
  };
})();
