// Equipo de la build: ranuras, selector con buscador, mejoras y total de estadísticas.
// Catálogo en data/equipo (ids = los de NC). Mismos cálculos que equipo.py.
Object.assign(TEXTOS, {
  "pest.equipo": { es: "Equipo", en: "Gear", fr: "Équipement", de: "Getriebe", pt: "Artes", ru: "Гир", ko: "제품정보", ja: "ギヤ" },
  "eq.titulo": { es: "Equipo de la build", en: "Build gear", fr: "Équipement de la build", de: "Baugeräte", pt: "Equipamento de construção", ru: "Построить шестерню", ko: "연락처", ja: "ビルドギア" },
  "eq.vacio": { es: "Sin objeto", en: "Empty", fr: "Vide", de: "Leer", pt: "Vazio", ru: "пустой", ko: "뚱 베어", ja: "スタッフ" },
  "eq.ninguno": { es: "Esta build aún no tiene equipo. Pulsa una ranura para elegir.", en: "This build has no gear yet. Click a slot to choose.", fr: "Cette build n’a pas encore d’équipement. Cliquez un emplacement pour choisir.", de: "Dieser Build hat noch keine Ausrüstung. Klicken Sie auf einen Slot zur Auswahl.", pt: "Este edifício ainda não tem equipamento. Clique em um slot para escolher.", ru: "У этой сборки пока нет снаряжения. Нажмите слот, чтобы выбрать.", ko: "이 빌드는 아직 기어가 없습니다. 선택한 슬롯을 클릭합니다.", ja: "このビルドはまだギアはありません。 選択するスロットをクリックします。" },
  "eq.sin_cat": { es: "Esta pieza no está en el catálogo local; cámbiala o quítala.", en: "This piece is not in the local catalog; change or remove it.", fr: "Cette pièce n’est pas dans le catalogue local ; changez-la ou retirez-la.", de: "Dieses Stück ist nicht im lokalen Katalog; ändern oder entfernen Sie es.", pt: "Esta peça não está no catálogo local; altere- a ou remova- a.", ru: "Эта статья не в местном каталоге; изменить или удалить его.", ko: "이 작품은 로컬 카탈로그에 없습니다. 변경하거나 제거하십시오.", ja: "この作品は、ローカルカタログではなく、変更または削除します。" },
  "eq.pulsa": { es: "Pulsa una ranura para abrir el buscador de esa pieza. Abajo ajustas mejora y piedras.", en: "Click a slot to open the item picker for that piece. Below you adjust enhance and stones.", fr: "Cliquez un emplacement pour ouvrir le sélecteur de cette pièce. En dessous vous réglez amélioration et pierres.", de: "Klicken Sie auf einen Slot, um den Item Picker für dieses Stück zu öffnen. Unten passen Sie Enhance und Stones an.", pt: "Clique em um slot para abrir o seletor de itens para essa peça. Abaixo você ajustar o realce e pedras.", ru: "Нажмите на слот, чтобы открыть набор предметов для этой части. Ниже вы настраиваете усилители и камни.", ko: "그 조각에 대한 아이템 선택기를 열려면 슬롯을 클릭하십시오. 당신은 향상과 돌을 조정합니다.", ja: "スロットをクリックすると、アイテムのピッカーが開きます。 以下は、強化と石を調節します。" },
  "eq.pulsa_ver": { es: "Pulsa una pieza para ver todos sus detalles.", en: "Click a piece to see all its details.", fr: "Cliquez une pièce pour voir tous ses détails.", de: "Klicken Sie auf ein Stück, um alle Details zu sehen.", pt: "Clique em uma peça para ver todos os seus detalhes.", ru: "Нажмите на кусок, чтобы увидеть все его детали.", ko: "모든 세부 사항을 보려면 조각을 클릭하십시오.", ja: "作品をクリックすると、すべての詳細が表示されます。" },
  "eq.elegir": { es: "Elegir objeto", en: "Choose item", fr: "Choisir un objet", de: "Auswählen", pt: "Escolher item", ru: "Выберите пункт", ko: "아이템 선택", ja: "アイテムを選択" },
  "eq.cambiar": { es: "Cambiar objeto", en: "Change item", fr: "Changer d’objet", de: "Änderungsposition", pt: "Mudar item", ru: "Изменить пункт", ko: "공지사항", ja: "アイテムの変更" },
  "eq.quitar": { es: "Quitar", en: "Remove", fr: "Retirer", de: "Entfernen", pt: "Remover", ru: "Удалить", ko: "기타 제품", ja: "削除" },
  "eq.quitar_ranura": { es: "Quitar de la ranura", en: "Clear slot", fr: "Vider l’emplacement", de: "Freiraum", pt: "Limpar o espaço", ru: "Чистый слот", ko: "명확한 구멍", ja: "明確なスロット" },
  "eq.offline": { es: "Pulsa una ranura (casco, arma…) y elige en el buscador. Luego ajusta + y piedras abajo.", en: "Click a slot (helm, weapon…) and pick in the searcher. Then adjust + and stones below.", fr: "Cliquez un emplacement (heaume, arme…) et choisissez dans le chercheur. Puis réglez + et pierres en dessous.", de: "Klicken Sie auf einen Slot (Helm, Waffe ...) und wählen Sie den Sucher aus. Dann passen Sie + und Steine unten an.", pt: "Clique em um slot (helm, arma...) e escolha no pesquisador. Em seguida, ajustar + e pedras abaixo.", ru: "Нажмите слот (помощь, оружие...) и выберите в поисковике. Затем настройте + и камни внизу.", ko: "슬롯 (헬름, 무기...)을 클릭하고 검색기를 선택합니다. 그런 다음 아래 +와 돌을 조정합니다.", ja: "スロット(ヘルム、武器...)をクリックし、検索機で選ぶ。 それから+および石を次調節して下さい。" },
  "eq.ordenar": { es: "Orden", en: "Sort", fr: "Tri", de: "Sort", pt: "Ordenar", ru: "сортировать", ko: "제품정보", ja: "ツイート" },
  "eq.ord_il_desc": { es: "iLvl ↓", en: "iLvl ↓", fr: "iLvl ↓", de: "iLvl ↓", pt: "iLvl ↓", ru: "iLvl ↓", ko: "iLvl ↓", ja: "iLvlの ↓" },
  "eq.ord_il_asc": { es: "iLvl ↑", en: "iLvl ↑", fr: "iLvl ↑", de: "iLvl ↑", pt: "iLvl ↑", ru: "iLvl ↑", ko: "iLvl ↑", ja: "ログイン" },
  "eq.ord_nombre": { es: "Nombre", en: "Name", fr: "Nom", de: "Name", pt: "Nome", ru: "Имя", ko: "이름 *", ja: "お名前 (必須)" },
  "eq.il_min": { es: "iLvl mín.", en: "Min iLvl", fr: "iLvl min.", de: "Min iLvl", pt: "Min iLvl", ru: "Min iLvl", ko: "최소 iLvl", ja: "ミンiLvl" },
  "eq.grado_rapido": { es: "Grado", en: "Grade", fr: "Grade", de: "Grad", pt: "Grau", ru: "класс", ko: "주요 특징", ja: "グレード" },
  "eq.buscar": { es: "Buscar por nombre (ES o EN)…", en: "Search by name (EN or ES)…", fr: "Chercher par nom (EN ou ES)…", de: "Suche nach Namen (EN oder ES)...", pt: "Pesquisar pelo nome (EN ou ES)...", ru: "Поиск по имени (EN или ES)", ko: "이름으로 찾기 (EN 또는 ES)...", ja: "名称で検索(ENまたはES)..." },
  "eq.todos_grados": { es: "Todos los grados", en: "All grades", fr: "Tous les grades", de: "Alle Klassen", pt: "Todos os graus", ru: "Все оценки", ko: "모든 학년", ja: "すべてのグレード" },
  "eq.todas_facciones": { es: "Ambas facciones", en: "Both factions", fr: "Les deux factions", de: "Beide Fraktionen", pt: "Ambas as facções", ru: "Обе фракции", ko: "두 사실", ja: "両方の事実" },
  "eq.resultados": { es: "{n} objetos", en: "{n} items", fr: "{n} objets", de: "{n} Artikel", pt: "{n} itens", ru: "{n} пункты", ko: "{n} 항목", ja: "{n} アイテム" },
  "eq.max_res": { es: "Mostrando {n} de {total}: afina la búsqueda.", en: "Showing {n} of {total}: refine your search.", fr: "Affichage de {n} sur {total} : affinez la recherche.", de: "Zeigen {n} von {total}: verfeinern Sie Ihre Suche.", pt: "Mostrando {n} de {total}: refinar sua pesquisa.", ru: "Показать {n} {total}: усовершенствовать поиск.", ko: "{n} 의 {total}: 검색을 거부.", ja: "{total} の {n} を表示: 検索を拒否します。" },
  "eq.sin_res": { es: "Ningún objeto coincide.", en: "No item matches.", fr: "Aucun objet ne correspond.", de: "Keine Übereinstimmungen.", pt: "Nenhum item corresponde.", ru: "Никаких совпадений.", ko: "상품이 없습니다.", ja: "アイテムはマッチしません。" },
  "eq.cerrar": { es: "Cerrar", en: "Close", fr: "Fermer", de: "Schließen", pt: "Fechar", ru: "Закрыть", ko: "닫기", ja: "閉じる" },
  "eq.cargando": { es: "Cargando objetos…", en: "Loading items…", fr: "Chargement des objets…", de: "Ladegut...", pt: "Carregando itens...", ru: "Загрузка предметов...", ko: "관련 상품", ja: "アイテムの読み込み" },
  "eq.mejora": { es: "Mejora", en: "Enhance", fr: "Amélioration", de: "Verzauberung", pt: "Aprimoramento", ru: "Заточка", ko: "강화", ja: "強化" },
  "eq.superacion": { es: "Superación", en: "Amplify", fr: "Superación", de: "Amplifizieren", pt: "Amplificar", ru: "усиливать", ko: "채용정보", ja: "増幅器" },
  "eq.potencial": { es: "Potencial", en: "Potential", fr: "Potentiel", de: "Potenzial", pt: "Potencial", ru: "потенциал", ko: "주요 특징", ja: "潜在的な可能性" },
  "eq.sub": { es: "Vínculo de alma", en: "Soul bind", fr: "Lien d’âme", de: "Seelenbindung", pt: "Vínculo de alma", ru: "Привязка души", ko: "영혼 각인", ja: "ソウルバインド" },
  "eq.sub_fijo": { es: "Sub-estadísticas fijas", en: "Fixed sub-stats", fr: "Sous-stats fixes", de: "Feste Teilstatistiken", pt: "Substatos fixos", ru: "Фиксированные подстатусы", ko: "수정된 하위 통계", ja: "固定サブスタット" },
  "eq.sub_ayuda": { es: "Hasta {n} estadísticas, con el valor entre el mínimo y el máximo del objeto.", en: "Up to {n} stats, valued between the item's minimum and maximum.", fr: "Jusqu’à {n} stats, avec une valeur entre le minimum et le maximum de l’objet.", de: "Bis zu {n}-Statistiken, bewertet zwischen dem Minimum und Maximum des Elements.", pt: "Até {n} estatísticas, valorizadas entre o mínimo e o máximo do item.", ru: "До {n} статистики, оцениваемой между минимумом и максимумом объекта.", ko: "최대 {n} 통계, 항목의 최소 및 최대 값.", ja: "アイテムの最小値と最大値の{n} ステータスまで。" },
  "eq.alma": { es: "Piedra filosofal", en: "Philosopher's Stone", fr: "Pierre philosophale", de: "Stein der Weisen", pt: "Pedra Filosofal", ru: "Философский камень", ko: "Philosopher의 돌", ja: "哲学者の石" },
  "eq.hab_nivel": { es: "Nivel de habilidad", en: "Skill level", fr: "Niveau de compétence", de: "Qualifikationsniveau", pt: "Nível de habilidade", ru: "Уровень квалификации", ko: "기술 수준", ja: "スキルレベル" },
  "eq.piedras": { es: "Piedras de maná", en: "Manastones", fr: "Piedras de maná", de: "Manasteine", pt: "Pedras de Maná", ru: "Магические камни", ko: "마석", ja: "魔石" },
  "eq.divinas": { es: "Piedras sagradas", en: "Theostones", fr: "Piedras sagradas", de: "Gottsteine", pt: "Pedras Divinas", ru: "Божественные камни", ko: "신석", ja: "神石" },
  "eq.elige_stat": { es: "— Estadística —", en: "— Stat —", fr: "— Estadística —", de: "— Stat —", pt: "— Estatísticas", ru: "- Статус.", ko: "- 통계 -", ja: "— ステータス —" },
  "eq.elige_divina": { es: "— Piedra sagrada —", en: "— Theostone —", fr: "— Piedra sagrada —", de: "— Theostone —", pt: "— Theostone —", ru: "- Теостон -", ko: "— Theostone —", ja: "— テオストーン —" },
  "eq.stats": { es: "Estadísticas", en: "Stats", fr: "Estadísticas", de: "Stats", pt: "Estatísticas", ru: "Статистика", ko: "통계 정보", ja: "統計情報" },
  "eq.de_mejora": { es: "de la mejora", en: "from enhance", fr: "de l’amélioration", de: "von Enhance", pt: "da melhoria", ru: "от усиления", ko: "더 나은", ja: "強化から" },
  "eq.nv_objeto": { es: "Nv. de objeto", en: "Item level", fr: "Niveau d’objet", de: "Positionsstufe", pt: "Nível de item", ru: "Уровень пунктов", ko: "품목 수준", ja: "項目レベル" },
  "eq.nv_req": { es: "Nv. requerido", en: "Required level", fr: "Niveau requis", de: "Erforderliches Niveau", pt: "Nível exigido", ru: "Требуемый уровень", ko: "필수 수준", ja: "必須レベル" },
  "eq.total": { es: "Lo que da el equipo", en: "What the gear gives", fr: "Ce que donne l’équipement", de: "Was die Ausrüstung gibt", pt: "O que a arte dá", ru: "Что дает шестерня", ko: "어떤 기어 제공", ja: "ギアが与えるもの" },
  "eq.total_vacio": { es: "Elige piezas para ver la suma de estadísticas.", en: "Choose pieces to see the stat totals.", fr: "Choisissez des pièces pour voir la somme des stats.", de: "Wählen Sie Stücke, um die stat Summen zu sehen.", pt: "Escolha peças para ver os totais de estatísticas.", ru: "Выберите кусочки, чтобы увидеть общую статистику.", ko: "stat 합계를 보는 조각을 선택하십시오.", ja: "統計総数を見るために作品を選択します。" },
  "eq.sumar_dae": { es: "Sumar Daevanion", en: "Add Daevanion", fr: "Sumar Daevanion", de: "Daevanion hinzufügen", pt: "Adicionar Daevanion", ru: "Добавить Daevanion", ko: "Daevanion 소개", ja: "Daevanion を追加" },
  "eq.sin_dae": { es: "Solo equipo", en: "Gear only", fr: "Équipement seul", de: "Nur Fanggerät", pt: "Apenas artes", ru: "Только груша", ko: "기어 전용", ja: "ギアのみ" },
  "eq.piezas": { es: "{n} de {total} ranuras", en: "{n} of {total} slots", fr: "{n} sur {total} emplacements", de: "{n} von {total} slots", pt: "{n} de espaços {total}", ru: "{n} слотов {total}", ko: "{n} 의 {total} 슬롯", ja: "{total}スロットの{n}" },
  "eq.fuente": { es: "Datos de objetos: questlog.gg (mismos ids que NC). Las sub-estadísticas aleatorias y las piedras las eliges tú.",
    en: "Item data: questlog.gg (same ids as NC). Random sub-stats and stones are chosen by you.", fr: "Données d’objets : questlog.gg (mêmes ids que NC). Les sous-stats aléatoires et les pierres, c’est vous qui les choisissez.", de: "Elementdaten: questlog.gg (gleiche IDs wie NC). Zufällige Sub-Statistiken und Steine werden von Ihnen ausgewählt.", pt: "Dados do item: questlog.gg (os mesmos ids que NC). Substats e pedras aleatórias são escolhidos por você.", ru: "Данные по пунктам: questlog.gg (те же идентификаторы, что и NC). Случайные подстатусы и камни выбираются вами.", ko: "항목 데이터 : questlog.gg (NC와 같은 에이즈). 무작위 잠수함 및 돌은 당신에 의해 선택됩니다.", ja: "項目データ: questlog.gg (NC として同じ ids)。 ランダムサブスタットと石があなたによって選ばれています。" },
  "eq.luz": { es: "Elyos", en: "Elyos", fr: "Élyséens", de: "Elyos", pt: "Elyos", ru: "Элийцы", ko: "천족", ja: "天族" },
  "eq.oscuridad": { es: "Asmodian", en: "Asmodian", fr: "Asmodiens", de: "Asmodier", pt: "Asmodiano", ru: "Асмодиане", ko: "마족", ja: "魔族" },
  "eq.grado_x": { es: "Grado {n}", en: "Grade {n}", fr: "Grade {n}", de: "Grad {n}", pt: "Grau {n}", ru: "Класс {n}", ko: "학년 {n}", ja: "グレード {n}" },
  "eq.g.Common": { es: "Común", en: "Common", fr: "Común", de: "Allgemein", pt: "Frequentes", ru: "общий", ko: "- 한국어", ja: "よくある質問" },
  "eq.g.Rare": { es: "Superior", en: "Superior", fr: "Superior", de: "Überlegen", pt: "Superior", ru: "высший", ko: "주요 특징", ja: "スーペリア" },
  "eq.g.Legend": { es: "Raro", en: "Rare", fr: "Raro", de: "Selten", pt: "Raros", ru: "редко", ko: "이름 *", ja: "クチコミ" },
  "eq.g.Unique": { es: "Heroico", en: "Heroic", fr: "Heroico", de: "Heroisch", pt: "Heroico", ru: "героический", ko: "영웅", ja: "英雄" },
  "eq.g.Epic": { es: "Legendario", en: "Legendary", fr: "Legendario", de: "Legendär", pt: "Lendário", ru: "легендарный", ko: "한국어", ja: "レジェンダリー" },
  "eq.g.Mythic": { es: "Mítico", en: "Mythic", fr: "Mítico", de: "Mythisch", pt: "Mítico", ru: "мифический", ko: "이름 *", ja: "マイシック" },
  "eq.g.Special": { es: "Especial", en: "Special", fr: "Spécial", de: "Besonderes", pt: "Especial", ru: "Специальный", ko: "특별 할인", ja: "スペシャル" },
  "eq.v.soulbind": { es: "Se vincula al equipar", en: "Binds on equip", fr: "Lié à l’équipement", de: "Binden an Geräten", pt: "Ligas de equipamento", ru: "Связи на экипировке", ko: "장비에 Binds", ja: "エクイップ上のビンズ" },
  "eq.v.soulbind_acquire": { es: "Se vincula al obtener", en: "Binds on pickup", fr: "Lié à l’obtention", de: "Binden beim Pickup", pt: "Ligas na recolha", ru: "Связь на пикапе", ko: "픽업에 Binds", ja: "ピックアップのビンズ" },
  "eq.v.exchangeable": { es: "Comerciable", en: "Tradable", fr: "Échangeable", de: "handelbar", pt: "Tratável", ru: "изменяемый", ko: "기타 제품", ja: "トラディブル" },
  "eq.v.nonexchangeable": { es: "No comerciable", en: "Untradable", fr: "Non échangeable", de: "Nicht handelbar", pt: "Improvável", ru: "непреодолимый", ko: "옵션 정보", ja: "取引不能" },
  "eq.alma_pct": { es: "Vínculo de alma {n}%", en: "Soul bind {n}%", fr: "Lien d’âme {n} %", de: "Seelenbindung {n}%", pt: "Ligação da alma {n}%", ru: "Душа связывается {n}%", ko: "영혼 바인딩 {n}%", ja: "魂は {n}% を結合します" },
  "eq.r.MainHand": { es: "Arma", en: "Weapon", fr: "Arme", de: "Waffe", pt: "Arma", ru: "оружие", ko: "무기", ja: "ウェポン" }, "eq.r.SubHand": { es: "Guarda", en: "Guard", fr: "Garde", de: "Wache", pt: "Guarda", ru: "гвардия", ko: "Guard 정보", ja: "ガード" },
  "eq.r.Helmet": { es: "Yelmo", en: "Helm", fr: "Heaume", de: "Helm", pt: "Leme", ru: "шлем", ko: "사이트맵", ja: "エルム" }, "eq.r.Shoulder": { es: "Hombreras", en: "Pauldrons", fr: "Épaulières", de: "Pauldrons", pt: "Pauldrons", ru: "Полдонс", ko: "폴드론", ja: "ポールドロンズ" },
  "eq.r.Torso": { es: "Pecho", en: "Chest", fr: "Torse", de: "Brust", pt: "Peito", ru: "Грудь", ko: "뚱 베어", ja: "チェスト" }, "eq.r.Pants": { es: "Piernas", en: "Legs", fr: "Jambes", de: "Beine", pt: "Pernas", ru: "Ноги", ko: "한국어", ja: "レッグ" },
  "eq.r.Gloves": { es: "Guantes", en: "Gloves", fr: "Gants", de: "Handschuhe", pt: "Luvas", ru: "перчатки", ko: "전체장편", ja: "グローブ" }, "eq.r.Boots": { es: "Botas", en: "Boots", fr: "Bottes", de: "Stiefel", pt: "Botas", ru: "сапоги", ko: "뚱 베어", ja: "ブーツ" },
  "eq.r.Cape": { es: "Capa", en: "Cloak", fr: "Cape", de: "Umhang", pt: "Cloak", ru: "плащ", ko: "스낵 바", ja: "ログイン" }, "eq.r.Belt": { es: "Cinturón", en: "Belt", fr: "Ceinture", de: "Gürtel", pt: "Cinto", ru: "Пояс", ko: "벨트 벨트", ja: "ベルト" },
  "eq.r.Necklace": { es: "Collar", en: "Necklace", fr: "Collier", de: "Halskette", pt: "Colar", ru: "ожерелье", ko: "—— 크리스", ja: "ネックレス" }, "eq.r.Amulet": { es: "Amuleto", en: "Amulet", fr: "Amulette", de: "Amulett", pt: "Amuleto", ru: "Амулет", ko: "아뮬렛", ja: "アミュレット" },
  "eq.r.Earring1": { es: "Pendiente 1", en: "Earring 1", fr: "Boucle d’oreille 1", de: "Ohrring 1", pt: "Brinco 1", ru: "Заработок 1", ko: "귀걸이 1", ja: "イヤリング 1" }, "eq.r.Earring2": { es: "Pendiente 2", en: "Earring 2", fr: "Boucle d’oreille 2", de: "Ohrring 2", pt: "Brinco 2", ru: "Заработок 2", ko: "귀걸이 2", ja: "イヤリング 2" },
  "eq.r.Ring1": { es: "Anillo 1", en: "Ring 1", fr: "Anneau 1", de: "Ring 1", pt: "Anel 1", ru: "Кольцо 1", ko: "반지 1", ja: "リング 1" }, "eq.r.Ring2": { es: "Anillo 2", en: "Ring 2", fr: "Anneau 2", de: "Ring 2", pt: "Anel 2", ru: "Кольцо 2", ko: "반지 2", ja: "リング2" },
  "eq.r.Bracelet1": { es: "Brazalete 1", en: "Bracelet 1", fr: "Bracelet 1", de: "Armband 1", pt: "Pulseira 1", ru: "Браслет 1", ko: "팔찌 1", ja: "ブレスレット 1" }, "eq.r.Bracelet2": { es: "Brazalete 2", en: "Bracelet 2", fr: "Bracelet 2", de: "Armband 2", pt: "Pulseira 2", ru: "Браслет 2", ko: "팔찌 2", ja: "ブレスレット2" },
  "eq.r.Rune1": { es: "Runa 1", en: "Rune 1", fr: "Runa 1", de: "Rune 1", pt: "Runa 1", ru: "Руна 1", ko: "런 1", ja: "ルーン 1" }, "eq.r.Rune2": { es: "Runa 2", en: "Rune 2", fr: "Runa 2", de: "Rune 2", pt: "Runa 2", ru: "Руна 2", ko: "런 2", ja: "ルーン 2" }
});

var EQ = (function () {
  var RANURAS = ["MainHand", "SubHand", "Helmet", "Shoulder", "Torso", "Pants", "Gloves", "Boots", "Cape", "Belt",
    "Necklace", "Amulet", "Earring1", "Earring2", "Ring1", "Ring2", "Bracelet1", "Bracelet2", "Rune1", "Rune2"];
  var SUB = { SubHand: "guarder", Helmet: "helmet", Shoulder: "shoulder", Torso: "torso", Pants: "pants", Gloves: "gloves",
    Boots: "boots", Cape: "cape", Belt: "belt", Necklace: "necklace", Amulet: "amulet", Earring1: "earring", Earring2: "earring",
    Ring1: "ring", Ring2: "ring", Bracelet1: "bracelet", Bracelet2: "bracelet", Rune1: "rune", Rune2: "rune" };
  var ARMA = { gladiator: "greatsword", templar: "sword", assassin: "dagger", ranger: "bow", sorcerer: "magicbook",
    spiritmaster: "orb", cleric: "mace", chanter: "staff" };
  var GRADO = { 11: "Common", 21: "Rare", 31: "Legend", 41: "Unique", 51: "Epic", 61: "Mythic", 71: "Special" };
  var FUERA = { weaponmindamage: 1, maxweaponblock: 1, decreaseweaponblock: 1 };
  var PRIMERO = ["weaponfixingdamage", "weaponaccuracy", "critical", "armordefense", "hpmax", "mpmax"];
  var CODIGO = {};
  Object.keys(GRADO).forEach(function (k) { CODIGO[GRADO[k]] = +k; });
  var subs = {}, piedras = null;

  function sub(clase, slot) { return slot === "MainHand" ? ARMA[clase] : SUB[slot]; }
  function cargarSub(s) {
    if (!s) return Promise.resolve({ lista: [], porId: {} });
    if (subs[s]) return subs[s];
    return (subs[s] = fetch("data/equipo/" + s + ".json").then(function (r) { return r.ok ? r.json() : []; }).then(function (l) {
      var por = {};
      l.forEach(function (p) { por[p.id] = p; });
      return { lista: l, porId: por };
    }));
  }
  function cargarPiedras() {
    if (!piedras) piedras = fetch("data/equipo/piedras.json").then(function (r) { return r.json(); }).then(function (d) {
      d.divinaPorId = {};
      d.divinas.forEach(function (x) { d.divinaPorId[x.id] = x; });
      return d;
    });
    return piedras;
  }
  function claveGrado(g) {
    if (g == null || g === "") return "";
    if (typeof g === "number") return GRADO[g] || "";
    var s = String(g).trim();
    if (GRADO[+s]) return GRADO[+s];
    var alias = {
      common: "Common", comun: "Common", "común": "Common", normal: "Common",
      rare: "Rare", superior: "Rare",
      legend: "Legend", raro: "Legend",
      unique: "Unique", heroic: "Unique", heroico: "Unique",
      epic: "Epic", legendary: "Epic", legendario: "Epic",
      mythic: "Mythic", mitico: "Mythic", "mítico": "Mythic",
      special: "Special", especial: "Special"
    };
    if (CODIGO[s]) return s;
    return alias[s.toLowerCase()] || "";
  }
  function nombreGrado(g) {
    var k = claveGrado(g);
    return TEXTOS["eq.g." + k] ? t("eq.g." + k) : re(t("eq.grado_x"), { n: CODIGO[k] || g });
  }
  function re(txt, mapa) { return String(txt).replace(/\{(\w+)\}/g, function (_, k) { return mapa[k] == null ? "" : mapa[k]; }); }
  function iconoNC(p) { return "https://assets.playnccdn.com/static-aion2-gamedata/resources/" + p.i.split("/").pop() + ".png"; }
  function iconoQL(p) { return "https://cdn.questlog.gg/aion-2/assets/Game/UI/Resource/Texture/" + p.i + ".webp"; }
  function img(url, alt, respaldo) {
    if (!/^https:\/\/(assets\.playnccdn\.com|cdn\.questlog\.gg)\//.test(url || "")) return "";
    return '<img src="' + esc(url) + '" alt="' + esc(alt || "") + '" loading="lazy"' +
      (respaldo ? " onerror=\"this.onerror=null;this.src='" + esc(respaldo) + "'\"" : "") + ">";
  }
  function nombreStat(s) { var e = _estadisticas && _estadisticas[s]; return e ? tr(e) : s; }
  function valor(s, v) { return valorStat(s, v).valor; }

  // mismas reglas que equipo.calcular
  function calcular(p, c) {
    var total = {}, enc = {};
    function suma(a, s, v) {
      if (s === "weapondamage") s = "weaponfixingdamage";
      if (FUERA[s] || !v) return;
      a[s] = (a[s] || 0) + v;
    }
    function nivel(tabla, n, conEnc) {
      if (!n) return;
      Object.keys(tabla || {}).forEach(function (s) {
        var v = tabla[s][n - 1];
        if (v == null) return;
        suma(total, s, v);
        if (conEnc) suma(enc, s, v);
      });
    }
    Object.keys(p.m || {}).forEach(function (s) { suma(total, s, p.m[s]); });
    nivel(p.e, c.encantamiento, true);
    nivel(p.x, c.superado, true);
    nivel(p.p, c.potencial, false);
    (c.sub || []).concat(c.alma_stat ? [c.alma_stat] : [], c.piedras || []).forEach(function (x) { suma(total, x[0], x[1]); });
    return { stats: total, stats_enc: enc };
  }
  function completar(c, p) {
    var r = calcular(p, c);
    c.stats = r.stats; c.stats_enc = r.stats_enc;
    c.nombre = p.n.en; c.nombre_es = p.n.es; c.grado = GRADO[p.g] || claveGrado(c.grado) || ""; c.icono = iconoNC(p); c.alma = c.alma || 0;
    return c;
  }
  function filasStats(stats, enc) {
    var claves = Object.keys(stats || {}).sort(ordenStats);
    if (!claves.length) return "";
    return "<table class='tt-tabla'>" + claves.map(function (s) {
      var e = enc && enc[s] ? " <small class='eq-enc'>(" + valor(s, enc[s]) + ")</small>" : "";
      return "<tr><td>" + esc(nombreStat(s)) + "</td><td>" + esc(valor(s, stats[s])) + e + "</td></tr>";
    }).join("") + "</table>";
  }
  function ordenStats(a, b) {
    var ea = (_estadisticas || {})[a] || {}, eb = (_estadisticas || {})[b] || {};
    var pa = PRIMERO.indexOf(a), pb = PRIMERO.indexOf(b), ca = CATS.indexOf(ea.cat), cb = CATS.indexOf(eb.cat);
    return (pa < 0 ? 99 : pa) - (pb < 0 ? 99 : pb) || (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb) || (ea.orden || 99) - (eb.orden || 99) || nombreStat(a).localeCompare(nombreStat(b));
  }
  var CATS = ["MainStat", "BookMark", "Attack", "Defense", "Resist", "PVE", "PVP", ""];
  function lista(titulo, pares) {
    if (!pares || !pares.length) return "";
    return "<div class='tt-sec'>" + esc(titulo) + "</div>" + pares.map(function (x) {
      return "<div class='tt-esp on'>" + esc(nombreStat(x[0])) + " <b>" + esc(valor(x[0], x[1])) + "</b></div>";
    }).join("");
  }
  // tooltip de una pieza (de la build o de la ficha del personaje); `p` = objeto del catálogo si se conoce
  function tip(c, p, pd) {
    var nombre = (IDIOMA === "es" && String(c.nombre_es || "").trim()) || c.nombre || (p && tr(p.n)) || "";
    var nivel = (c.encantamiento ? " +" + c.encantamiento : "") + (c.superado ? " ⟫" + c.superado : "");
    var sub = [t("eq.r." + c.slot), nombreGrado(c.grado)];
    if (p && p.il) sub.push(t("eq.nv_objeto") + " " + p.il);
    if (p && p.nv) sub.push(t("eq.nv_req") + " " + p.nv);
    if (p && TEXTOS["eq.v." + p.v]) sub.push(t("eq.v." + p.v));
    var h = "<div class='tt-nombre g-" + esc(claveGrado(c.grado)) + "'>" + esc(nombre) + esc(nivel) + "</div><div class='tt-sub'>" + esc(sub.join(" · ")) + "</div>";
    if (p && p.m && p.m.weaponmindamage) {
      var n = c.encantamiento || 0, e = p.e || {};
      var mn = p.m.weaponmindamage + (n && e.weaponmindamage ? e.weaponmindamage[n - 1] || 0 : 0);
      var mx = (p.m.weapondamage || 0) + (n && e.weapondamage ? e.weapondamage[n - 1] || 0 : 0);
      h += "<div class='tt-sub'>" + esc(nombreStat("weaponfixingdamage")) + " " + mn + " ~ " + mx + "</div>";
    }
    if (c.potencial) h += "<div class='tt-sub'>" + esc(t("eq.potencial")) + " " + c.potencial + "</div>";
    h += filasStats(c.stats, c.stats_enc);
    if (c.stats_enc && Object.keys(c.stats_enc).length) h += "<div class='tt-sub'>(" + esc(t("eq.de_mejora")) + ")</div>";
    h += lista(t("eq.sub") + (c.alma ? " · " + c.alma + "%" : ""), c.sub);
    h += lista(t("eq.alma"), c.alma_stat ? [c.alma_stat] : []);
    h += lista(t("eq.piedras"), c.piedras);
    if (c.habilidades && c.habilidades.length) {
      h += "<div class='tt-sec'>" + esc(t("eq.hab_nivel")) + "</div>" + c.habilidades.map(function (s) {
        var nom = (IDIOMA === "es" && s.nombre_es) || s.nombre || s.id;
        return "<div class='tt-esp on'>" + esc(nom) + " <b>+" + esc(s.nivel) + "</b></div>";
      }).join("");
    }
    if (c.divinas && c.divinas.length && pd) {
      h += "<div class='tt-sec'>" + esc(t("eq.divinas")) + "</div>" + c.divinas.map(function (id) {
        var d = pd.divinaPorId[id];
        return d ? "<div class='tt-esp on'><b>" + esc(tr(d.n)) + "</b><br>" + esc(tr(d.d)).replace(/\n/g, "<br>") + "</div>" : "";
      }).join("");
    }
    if (p && p.d && tr(p.d)) h += "<div class='tt-desc'>" + esc(tr(p.d)).replace(/\n/g, "<br>") + "</div>";
    return h;
  }
  function sumar(piezas) {
    var tot = {};
    (piezas || []).forEach(function (c) {
      Object.keys(c.stats || {}).forEach(function (s) { tot[s] = (tot[s] || 0) + c.stats[s]; });
    });
    return tot;
  }

  return { RANURAS: RANURAS, GRADO: GRADO, claveGrado: claveGrado, sub: sub, cargarSub: cargarSub, cargarPiedras: cargarPiedras, nombreGrado: nombreGrado,
    iconoNC: iconoNC, iconoQL: iconoQL, img: img, calcular: calcular, completar: completar, tip: tip, sumar: sumar,
    filasStats: filasStats, ordenStats: ordenStats, nombreStat: nombreStat, valor: valor, re: re };
})();

// Pestaña "Equipo" de build.html
function Equipo(op) {
  var B = op.B, editando = op.editando, raiz = null, sel = null, listo = false, daeElegido = -1, D = null;
  B.datos.equipo = B.datos.equipo || [];
  var cat = {}, PD = null;
  function piezas() { return B.datos.equipo; }
  function pieza(slot) { return piezas().filter(function (c) { return c.slot === slot; })[0]; }
  function item(c) { var s = EQ.sub(B.clase, c.slot); return s && cat[s] ? cat[s].porId[c.id] : null; }
  function cambio() { if (op.alCambiar) op.alCambiar(); }

  function cargar() {
    var necesarios = {};
    EQ.RANURAS.forEach(function (r) { var s = EQ.sub(B.clase, r); if (s && (editando || pieza(r))) necesarios[s] = 1; });
    return Promise.all([cargarEstadisticas(), EQ.cargarPiedras(), fetch("data/daevanion/" + B.clase + ".json").then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })]
      .concat(Object.keys(necesarios).map(function (s) { return EQ.cargarSub(s).then(function (d) { cat[s] = d; }); })))
      .then(function (r) { PD = r[1]; D = r[2]; listo = true; });
  }

  function ranuraHTML(slot) {
    var c = pieza(slot), p = c && item(c);
    var on = sel === slot ? " on" : "";
    if (!c) {
      return '<button type="button" class="eq-ranura vacia' + on + '" data-eq="' + slot + '"' + (editando ? "" : " disabled") + '><span class="eq-hueco"></span>' +
        "<span class='eq-txt'><span class='eq-slot'>" + esc(t("eq.r." + slot)) + "</span><small>" + esc(t(editando ? "eq.elegir" : "eq.vacio")) + "</small></span></button>";
    }
    var nombre = (IDIOMA === "es" && String(c.nombre_es || "").trim()) || c.nombre;
    var ico = p ? EQ.img(EQ.iconoNC(p), nombre, EQ.iconoQL(p)) : EQ.img(c.icono, nombre);
    return '<button type="button" class="eq-ranura g-' + esc(EQ.claveGrado(c.grado)) + on + '" data-eq="' + slot + '" data-tip="' + esc(EQ.tip(c, p, PD)) + '">' +
      '<span class="eq-hueco">' + ico + (c.encantamiento ? "<b>+" + c.encantamiento + "</b>" : "") + "</span><span class='eq-txt'><span class='eq-slot'>" +
      esc(t("eq.r." + slot)) + "</span><span class='eq-nombre'>" + esc(nombre) + "</span><small>" + esc(EQ.nombreGrado(c.grado)) +
      (p && p.il ? " · " + esc(t("eq.nv_objeto")) + " " + p.il : "") + "</small></span></button>";
  }

  function statsDae() {
    var stats = {};
    if (daeElegido < 0 || !D) return stats;
    var pr = ((B.datos.daevanion || {}).presets || [])[daeElegido];
    if (!pr) return stats;
    var set = {};
    pr.nodos.forEach(function (n) { set[String(n)] = 1; });
    D.tableros.forEach(function (tb) {
      tb.nodos.forEach(function (n) {
        if (!set[String(n.id)]) return;
        (n.ef || []).forEach(function (ef) { if (ef.s) stats[ef.s] = (stats[ef.s] || 0) + (ef.v || 0); });
      });
    });
    return stats;
  }
  function totalHTML() {
    var eq = EQ.sumar(piezas()), dae = statsDae(), todo = {};
    Object.keys(eq).concat(Object.keys(dae)).forEach(function (s) { todo[s] = (eq[s] || 0) + (dae[s] || 0); });
    var presets = ((B.datos.daevanion || {}).presets || []);
    var selDae = presets.length && D ? '<select id="eq-dae" class="eq-dae"><option value="-1">' + esc(t("eq.sin_dae")) + "</option>" + presets.map(function (p, i) {
      return '<option value="' + i + '"' + (i === daeElegido ? " selected" : "") + ">" + esc(t("eq.sumar_dae")) + ": " + esc(p.nombre) + "</option>";
    }).join("") + "</select>" : "";
    var claves = Object.keys(todo).filter(function (s) { return todo[s]; }).sort(EQ.ordenStats);
    return '<div class="panel eq-total"><h3>' + esc(t("eq.total")) + "</h3><p class='suave'>" + esc(EQ.re(t("eq.piezas"), { n: piezas().length, total: EQ.RANURAS.length })) + "</p>" + selDae +
      (claves.length ? '<div class="eq-filas">' + claves.map(function (s) {
        var extra = dae[s] ? ' <small class="suave" title="Daevanion">(' + esc(EQ.valor(s, dae[s])) + ")</small>" : "";
        return '<div class="fila"><span>' + esc(EQ.nombreStat(s)) + "</span><b>" + esc(EQ.valor(s, todo[s])) + extra + "</b></div>";
      }).join("") + "</div>" : "<p class='suave'>" + esc(t("eq.total_vacio")) + "</p>") + "</div>";
  }

  function opcionesNivel(max, v) {
    var h = "";
    for (var i = 0; i <= max; i++) h += '<option value="' + i + '"' + (i === v ? " selected" : "") + ">+" + i + "</option>";
    return h;
  }
  function editorHTML() {
    if (!sel) return "<p class='suave eq-pista'>" + esc(t(editando ? "eq.pulsa" : "eq.pulsa_ver")) + "</p>";
    var c = pieza(sel), p = c && item(c);
    if (!editando) return c ? '<div class="panel eq-detalle">' + EQ.tip(c, p, PD) + "</div>" : "";
    var cab = '<div class="eq-ed-cab"><h3>' + esc(t("eq.r." + sel)) + '</h3><div class="eq-ed-bot"><button type="button" class="boton oro" data-eq-accion="elegir">' +
      esc(t(c ? "eq.cambiar" : "eq.elegir")) + "</button>" + (c ? '<button type="button" class="boton peligro" data-eq-accion="quitar">' + esc(t("eq.quitar")) + "</button>" : "") + "</div></div>";
    if (!c || !p) return '<div class="panel eq-editor">' + cab +
      (!c ? "<p class='suave'>" + esc(t("eq.pulsa")) + "</p>" : "<p class='suave'>" + esc(t("eq.sin_cat")) + "</p>") + "</div>";
    var h = '<div class="eq-ed-item">' + EQ.img(EQ.iconoNC(p), "", EQ.iconoQL(p)) + "<div><b class='g-" + esc(EQ.claveGrado(c.grado) || EQ.GRADO[p.g] || "") + "'>" + esc(tr(p.n)) + "</b><small>" +
      esc(EQ.nombreGrado(p.g)) + " · " + esc(t("eq.nv_objeto")) + " " + p.il + " · " + esc(t("eq.nv_req")) + " " + p.nv + "</small></div></div>";
    h += '<div class="eq-niveles">';
    if (p.emax) h += "<label>" + esc(t("eq.mejora")) + ' <select data-eq-campo="encantamiento">' + opcionesNivel(p.emax, c.encantamiento || 0) + "</select></label>";
    if (p.xmax) h += "<label>" + esc(t("eq.superacion")) + ' <select data-eq-campo="superado">' + opcionesNivel(p.xmax, c.superado || 0) + "</select></label>";
    if (p.pmax) h += "<label>" + esc(t("eq.potencial")) + ' <select data-eq-campo="potencial">' + opcionesNivel(p.pmax, c.potencial || 0) + "</select></label>";
    h += "</div>";
    if (p.sub && p.fijo) {
      h += "<h4>" + esc(t("eq.sub_fijo")) + "</h4>" + p.sub.map(function (s) {
        return '<div class="eq-fijo">' + esc(EQ.nombreStat(s[0])) + " <b>" + esc(EQ.valor(s[0], s[2])) + "</b></div>";
      }).join("");
    } else if (p.sub && p.ns) {
      h += "<h4>" + esc(t("eq.sub")) + " <small class='suave'>" + esc(EQ.re(t("eq.sub_ayuda"), { n: p.ns })) + "</small></h4>";
      for (var i = 0; i < p.ns; i++) h += filaSub("sub", i, (c.sub || [])[i], p.sub);
    }
    if (p.sa && p.sub) h += "<h4>" + esc(t("eq.alma")) + "</h4>" + filaSub("alma", 0, c.alma_stat, p.sub);
    if (p.ms && PD) {
      h += "<h4>" + esc(t("eq.piedras")) + " <small class='suave'>(" + p.ms + ")</small></h4>";
      for (var j = 0; j < p.ms; j++) h += filaPiedra(j, (c.piedras || [])[j]);
    }
    if (p.gs && PD) {
      h += "<h4>" + esc(t("eq.divinas")) + "</h4>";
      for (var k = 0; k < p.gs; k++) {
        var actual = (c.divinas || [])[k] || "";
        h += '<select class="eq-divina" data-eq-divina="' + k + '"><option value="">' + esc(t("eq.elige_divina")) + "</option>" + PD.divinas.map(function (d) {
          return '<option value="' + d.id + '"' + (d.id === actual ? " selected" : "") + ">" + esc(tr(d.n)) + " · " + esc(EQ.nombreGrado(d.g)) + "</option>";
        }).join("") + "</select>";
        if (actual && PD.divinaPorId[actual]) h += "<p class='suave eq-desc-divina'>" + esc(tr(PD.divinaPorId[actual].d)) + "</p>";
      }
    }
    h += "<h4>" + esc(t("eq.stats")) + "</h4>" + EQ.filasStats(c.stats, c.stats_enc);
    if (p.d && tr(p.d)) h += "<p class='suave'>" + esc(tr(p.d)) + "</p>";
    return '<div class="panel eq-editor">' + cab + h + "</div>";
  }
  function filaSub(tipo, i, actual, pool) {
    var st = actual ? actual[0] : "", rango = pool.filter(function (s) { return s[0] === st; })[0];
    return '<div class="eq-fila" data-eq-fila="' + tipo + '" data-i="' + i + '"><select data-eq-stat><option value="">' + esc(t("eq.elige_stat")) + "</option>" +
      pool.map(function (s) {
        return '<option value="' + s[0] + '"' + (s[0] === st ? " selected" : "") + ">" + esc(EQ.nombreStat(s[0])) + " (" + esc(EQ.valor(s[0], s[1]).replace(/^\+/, "")) +
          " ~ " + esc(EQ.valor(s[0], s[2]).replace(/^\+/, "")) + ")</option>";
      }).join("") + "</select>" +
      (rango ? '<input type="number" data-eq-valor min="' + rango[1] + '" max="' + rango[2] + '" value="' + actual[1] + '"><small class="suave">' +
        esc(EQ.valor(st, actual[1])) + "</small>" : "") + "</div>";
  }
  function filaPiedra(i, actual) {
    var st = actual ? actual[0] : "", stats = Object.keys(PD.mana).sort(EQ.ordenStats);
    var vals = st ? PD.mana[st] : [];
    return '<div class="eq-fila" data-eq-fila="piedra" data-i="' + i + '"><select data-eq-stat><option value="">' + esc(t("eq.elige_stat")) + "</option>" +
      stats.map(function (s) { return '<option value="' + s + '"' + (s === st ? " selected" : "") + ">" + esc(EQ.nombreStat(s)) + "</option>"; }).join("") + "</select>" +
      (st ? '<select data-eq-valor>' + vals.map(function (v) {
        return '<option value="' + v[0] + '"' + (v[0] === actual[1] ? " selected" : "") + ">" + esc(EQ.valor(st, v[0])) + " · " + esc(EQ.nombreGrado(v[1])) + "</option>";
      }).join("") + "</select>" : "") + "</div>";
  }

  function html() {
    return '<div class="eq-build">' + (editando ? '<p class="suave eq-offline">' + esc(t("eq.offline")) + "</p>" : "") +
      '<div class="eq-principal"><div class="eq-rejilla" id="eq-rejilla"></div><div id="eq-editor"></div>' +
      '<p class="suave eq-fuente">' + esc(t("eq.fuente")) + '</p></div><aside class="lateral" id="eq-total"></aside></div>';
  }
  function repintar() {
    if (!raiz || !listo) return;
    var rej = $("#eq-rejilla", raiz);
    rej.innerHTML = !editando && !piezas().length ? '<div class="vacio-lista">' + esc(t("eq.ninguno")) + "</div>" : EQ.RANURAS.map(ranuraHTML).join("");
    $("#eq-editor", raiz).innerHTML = editorHTML();
    $("#eq-total", raiz).innerHTML = totalHTML();
  }
  function nueva(slot, p) {
    var fijas = p.fijo ? p.sub.map(function (x) { return [x[0], x[2]]; }) : [];
    return EQ.completar({ slot: slot, id: p.id, encantamiento: 0, superado: 0, potencial: 0, sub: fijas, piedras: [], divinas: [] }, p);
  }
  function ponerPieza(slot, p) {
    var lista = piezas().filter(function (c) { return c.slot !== slot; });
    if (p) lista.push(nueva(slot, p));
    lista.sort(function (a, b) { return EQ.RANURAS.indexOf(a.slot) - EQ.RANURAS.indexOf(b.slot); });
    B.datos.equipo = lista;
    cambio();
    repintar();
  }

  // ---------- selector de objeto (modal, filtrado por ranura) ----------
  function abrirSelector(slot) {
    var s = EQ.sub(B.clase, slot);
    if (!s) return;
    var prev = document.getElementById("velo-equipo");
    if (prev) prev.remove();
    var actual = pieza(slot);
    var velo = document.createElement("div");
    velo.className = "velo";
    velo.id = "velo-equipo";
    velo.innerHTML = '<div class="panel eq-selector"><header><div><h3>' + esc(t("eq.r." + slot)) + "</h3>" +
      "<small class=\"suave\">" + esc(t("eq.offline")) + "</small></div><div class=\"eq-sel-cab-bot\">" +
      (actual ? '<button type="button" class="boton chico peligro" data-eq-limpiar>' + esc(t("eq.quitar_ranura")) + "</button>" : "") +
      '<button type="button" class="boton chico" data-eq-cerrar>' + esc(t("eq.cerrar")) + "</button></div></header>" +
      '<div class="eq-filtros">' +
      '<input id="eq-q" type="search" placeholder="' + esc(t("eq.buscar")) + '" autocomplete="off">' +
      '<select id="eq-raza"><option value="">' + esc(t("eq.todas_facciones")) + '</option><option value="light">' + esc(t("eq.luz")) +
      '</option><option value="dark">' + esc(t("eq.oscuridad")) + "</option></select>" +
      '<select id="eq-ord"><option value="il_desc">' + esc(t("eq.ord_il_desc")) + '</option><option value="il_asc">' +
      esc(t("eq.ord_il_asc")) + '</option><option value="nombre">' + esc(t("eq.ord_nombre")) + "</option></select>" +
      '<label class="eq-il-min">' + esc(t("eq.il_min")) + ' <input id="eq-il" type="number" min="0" max="999" placeholder="0"></label>' +
      "</div>" +
      '<div class="eq-grados" id="eq-grados" role="group" aria-label="' + esc(t("eq.grado_rapido")) + '"></div>' +
      '<p class="suave" id="eq-cuenta">' + esc(t("eq.cargando")) + '</p><div class="eq-lista" id="eq-lista"></div></div>';
    document.body.appendChild(velo);
    var q = $("#eq-q", velo), rz = $("#eq-raza", velo), ord = $("#eq-ord", velo), il = $("#eq-il", velo), chips = $("#eq-grados", velo);
    var gradoActivo = "";
    EQ.cargarSub(s).then(function (d) {
      cat[s] = d;
      var grados = {};
      d.lista.forEach(function (p) { grados[p.g] = 1; });
      var ordenG = Object.keys(grados).sort(function (a, b) { return b - a; });
      chips.innerHTML = '<button type="button" class="eq-chip on" data-eq-grado="">' + esc(t("eq.todos_grados")) + "</button>" +
        ordenG.map(function (g) {
          return '<button type="button" class="eq-chip g-' + esc(EQ.GRADO[g] || "") + '" data-eq-grado="' + g + '">' + esc(EQ.nombreGrado(+g)) + "</button>";
        }).join("");
      function filtrar() {
        var txt = q.value.trim().toLowerCase(), r = rz.value, ilMin = parseInt(il.value, 10) || 0;
        var res = d.lista.filter(function (p) {
          return (!gradoActivo || String(p.g) === gradoActivo) && (!r || p.r === "all" || p.r === r) &&
            (!ilMin || (p.il || 0) >= ilMin) &&
            (!txt || p.n.es.toLowerCase().indexOf(txt) >= 0 || p.n.en.toLowerCase().indexOf(txt) >= 0);
        });
        var modo = ord.value;
        res.sort(function (a, b) {
          if (modo === "il_asc") return (a.il || 0) - (b.il || 0) || tr(a.n).localeCompare(tr(b.n));
          if (modo === "nombre") return tr(a.n).localeCompare(tr(b.n));
          return (b.il || 0) - (a.il || 0) || tr(a.n).localeCompare(tr(b.n));
        });
        var MAX = 150;
        $("#eq-cuenta", velo).textContent = !res.length ? t("eq.sin_res") : res.length > MAX ? EQ.re(t("eq.max_res"), { n: MAX, total: res.length }) : EQ.re(t("eq.resultados"), { n: res.length });
        $("#eq-lista", velo).innerHTML = res.slice(0, MAX).map(function (p) {
          var grado = EQ.GRADO[p.g] || "", prev = nueva(slot, p);
          var on = actual && String(actual.id) === String(p.id) ? " on" : "";
          return '<button type="button" class="eq-opcion g-' + grado + on + '" data-eq-id="' + p.id + '" data-tip="' + esc(EQ.tip(prev, p, PD)) + '">' +
            '<span class="eq-hueco">' + EQ.img(EQ.iconoNC(p), "", EQ.iconoQL(p)) + "</span><span class='eq-txt'><span class='eq-nombre'>" + esc(tr(p.n)) +
            "</span><small>" + esc(EQ.nombreGrado(p.g)) + " · " + esc(t("eq.nv_objeto")) + " " + p.il + " · " + esc(t("eq.nv_req")) + " " + p.nv +
            (p.r !== "all" ? " · " + esc(t(p.r === "light" ? "eq.luz" : "eq.oscuridad")) : "") +
            (TEXTOS["eq.v." + p.v] ? " · " + esc(t("eq.v." + p.v)) : "") + "</small><small class='eq-otro'>" + esc(IDIOMA === "es" ? p.n.en : p.n.es) + "</small></span></button>";
        }).join("");
      }
      chips.addEventListener("click", function (e) {
        var b = e.target.closest("[data-eq-grado]");
        if (!b) return;
        gradoActivo = b.dataset.eqGrado;
        chips.querySelectorAll(".eq-chip").forEach(function (x) { x.classList.toggle("on", x === b); });
        filtrar();
      });
      q.addEventListener("input", filtrar);
      rz.addEventListener("change", filtrar);
      ord.addEventListener("change", filtrar);
      il.addEventListener("input", filtrar);
      filtrar();
      q.focus();
    });
    velo.addEventListener("click", function (e) {
      if (e.target === velo || e.target.closest("[data-eq-cerrar]")) { cerrar(); return; }
      if (e.target.closest("[data-eq-limpiar]")) { ponerPieza(slot, null); cerrar(); return; }
      var o = e.target.closest("[data-eq-id]");
      if (o) {
        ponerPieza(slot, cat[s].porId[o.dataset.eqId]);
        cerrar();
        var ed = $("#eq-editor", raiz);
        if (ed) ed.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    function cerrar() { velo.remove(); var tp = $("#tip"); if (tp) tp.style.display = "none"; }
    document.addEventListener("keydown", function escKey(ev) {
      if (ev.key === "Escape") { cerrar(); document.removeEventListener("keydown", escKey); }
    });
  }

  function leerFila(fila) {
    var st = fila.querySelector("[data-eq-stat]").value, v = fila.querySelector("[data-eq-valor]");
    return { stat: st, valor: v ? parseInt(v.value, 10) : null };
  }
  function enlazar(el) {
    raiz = el;
    el.addEventListener("click", function (e) {
      // Acciones del editor primero (no anidar en la ranura)
      var a = e.target.closest("[data-eq-accion]");
      if (a) {
        e.preventDefault();
        if (a.dataset.eqAccion === "elegir") {
          if (!sel) return;
          abrirSelector(sel);
        } else if (a.dataset.eqAccion === "quitar" && sel) {
          ponerPieza(sel, null);
        }
        return;
      }
      var r = e.target.closest("[data-eq]");
      if (!r) return;
      var slot = r.dataset.eq;
      if (!editando) {
        sel = sel === slot ? null : slot;
        repintar();
        return;
      }
      // Editar: un clic abre el buscador de esa ranura (casco, arma…)
      sel = slot;
      repintar();
      abrirSelector(slot);
    });
    el.addEventListener("change", function (e) {
      if (e.target.id === "eq-dae") { daeElegido = parseInt(e.target.value, 10); $("#eq-total", raiz).innerHTML = totalHTML(); return; }
      var c = pieza(sel), p = c && item(c);
      if (!c || !p) return;
      var campo = e.target.dataset.eqCampo;
      if (campo) c[campo] = parseInt(e.target.value, 10) || 0;
      var fila = e.target.closest("[data-eq-fila]");
      if (fila) {
        var f = leerFila(fila), i = parseInt(fila.dataset.i, 10), tipo = fila.dataset.eqFila;
        var pool = p.sub || [], rango = pool.filter(function (s) { return s[0] === f.stat; })[0];
        if (tipo === "piedra") {
          var vals = f.stat ? PD.mana[f.stat] : [];
          var v = vals.some(function (x) { return x[0] === f.valor; }) && e.target.hasAttribute("data-eq-valor") ? f.valor : (vals.length ? vals[vals.length - 1][0] : null);
          c.piedras = (c.piedras || []).slice();
          c.piedras[i] = f.stat ? [f.stat, v] : null;
          c.piedras = c.piedras.filter(Boolean);
        } else {
          var valor = rango ? (e.target.hasAttribute("data-eq-valor") && !isNaN(f.valor) ? Math.max(rango[1], Math.min(rango[2], f.valor)) : rango[2]) : null;
          if (tipo === "alma") c.alma_stat = rango ? [f.stat, valor] : undefined;
          else {
            var lista = (c.sub || []).slice();
            lista[i] = rango ? [f.stat, valor] : null;
            c.sub = lista.filter(function (x, j) { return x && !lista.slice(0, j).some(function (y) { return y && y[0] === x[0]; }); });
          }
        }
      }
      if (e.target.dataset.eqDivina != null) {
        var d = (c.divinas || []).slice();
        d[parseInt(e.target.dataset.eqDivina, 10)] = e.target.value;
        c.divinas = d.filter(Boolean);
      }
      cambio();
      EQ.completar(c, p);
      repintar();
    });
  }

  return {
    html: html, enlazar: enlazar, cargar: cargar, repintar: repintar,
    datos: function () {
      return piezas().map(function (c) {
        return { slot: c.slot, id: c.id, encantamiento: c.encantamiento || 0, superado: c.superado || 0, potencial: c.potencial || 0,
          sub: c.sub || [], alma_stat: c.alma_stat, piedras: c.piedras || [], divinas: c.divinas || [] };
      });
    },
    tip: function (c) { return EQ.tip(c, item(c), PD); }
  };
}
