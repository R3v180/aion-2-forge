# -*- coding: utf-8 -*-
"""
Pipeline de internacionalización para Aion 2 Forge.
Traduce, genera mapas e inyecta idiomas faltantes (de, pt, ru, ko, ja).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Activar buffer de línea para ver progreso inmediato
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)
import argostranslate.translate as tr

ROOT = Path(__file__).resolve().parents[1]

ENTRY_RE = re.compile(
    r'("([^"\\]+)"\s*:\s*\{)((?:[^{}"]|"((?:\\.|[^"\\])*)")*)(\})',
    re.S,
)
STR_RE = re.compile(r'\b([a-z]{2})\s*:\s*"((?:\\.|[^"\\])*)"')

GLOSARIOS = {
    "de": {
        "Spy Builds": "Spy Builds",
        "Open Spy Builds": "Spy Builds öffnen",
        "Classes": "Klassen",
        "Class": "Klasse",
        "Gladiator": "Gladiator",
        "Templar": "Templer",
        "Assassin": "Assassine",
        "Ranger": "Jäger",
        "Sorcerer": "Zauberer",
        "Spiritmaster": "Beschwörer",
        "Cleric": "Kleriker",
        "Chanter": "Kantor",
        "Elyos": "Elyos",
        "Asmodian": "Asmodier",
        "Asmodians": "Asmodier",
        "Manastones": "Manasteine",
        "Theostones": "Gottsteine",
        "Kinah": "Kinah",
        "Daevanion": "Daevanion",
        "Enhance": "Verzauberung",
        "Soul bind": "Seelenbindung",
        "Power and iLvl ranking": "Rangliste für Macht und iLvl",
        "Home": "Startseite",
        "Game": "Spiel",
        "Map": "Karte",
        "Tools": "Werkzeuge",
        "Guides": "Leitfäden",
        "Help": "Hilfe",
        "FAQ": "FAQ",
        "Frequently asked questions": "Häufig gestellte Fragen",
        "Legal notice": "Impressum",
        "Privacy policy": "Datenschutz",
        "Live chat": "Live-Chat",
        "Community": "Community",
        "Search": "Suchen",
        "Cancel": "Abbrechen",
        "Save": "Speichern",
        "Delete": "Löschen",
        "Close": "Schließen",
        "Tops": "Tops",
    },
    "pt": {
        "Spy Builds": "Spy Builds",
        "Open Spy Builds": "Abrir Spy Builds",
        "Classes": "Classes",
        "Class": "Classe",
        "Gladiator": "Gladiador",
        "Templar": "Templário",
        "Assassin": "Assassino",
        "Ranger": "Arqueiro",
        "Sorcerer": "Feiticeiro",
        "Spiritmaster": "Invocador",
        "Cleric": "Clérigo",
        "Chanter": "Cantor",
        "Elyos": "Elyos",
        "Asmodian": "Asmodiano",
        "Asmodians": "Asmodianos",
        "Manastones": "Pedras de Maná",
        "Theostones": "Pedras Divinas",
        "Kinah": "Kinah",
        "Daevanion": "Daevanion",
        "Enhance": "Aprimoramento",
        "Soul bind": "Vínculo de alma",
        "Power and iLvl ranking": "Classificação de poder e iLvl",
        "Home": "Início",
        "Game": "Jogo",
        "Map": "Mapa",
        "Tools": "Ferramentas",
        "Guides": "Guias",
        "Help": "Ajuda",
        "FAQ": "Perguntas Frequentes",
        "Frequently asked questions": "Perguntas frequentes",
        "Legal notice": "Aviso legal",
        "Privacy policy": "Política de privacidade",
        "Live chat": "Chat ao vivo",
        "Community": "Comunidade",
        "Search": "Pesquisar",
        "Cancel": "Cancelar",
        "Save": "Salvar",
        "Delete": "Excluir",
        "Close": "Fechar",
        "Tops": "Tops",
    },
    "ru": {
        "Spy Builds": "Spy Builds",
        "Open Spy Builds": "Открыть Spy Builds",
        "Classes": "Классы",
        "Class": "Класс",
        "Gladiator": "Гладиатор",
        "Templar": "Страж",
        "Assassin": "Убийца",
        "Ranger": "Стрелок",
        "Sorcerer": "Волшебник",
        "Spiritmaster": "Заклинатель",
        "Cleric": "Целитель",
        "Chanter": "Чародей",
        "Elyos": "Элийцы",
        "Asmodian": "Асмодиане",
        "Asmodians": "Асмодиане",
        "Manastones": "Магические камни",
        "Theostones": "Божественные камни",
        "Kinah": "Кинары",
        "Daevanion": "Даэванион",
        "Enhance": "Заточка",
        "Soul bind": "Привязка души",
        "Power and iLvl ranking": "Рейтинг силы и iLvl",
        "Home": "Главная",
        "Game": "Игра",
        "Map": "Карта",
        "Tools": "Инструменты",
        "Guides": "Гайды",
        "Help": "Помощь",
        "FAQ": "Частые вопросы",
        "Frequently asked questions": "Часто задаваемые вопросы",
        "Legal notice": "Юридическая информация",
        "Privacy policy": "Политика конфиденциальности",
        "Live chat": "Онлайн-чат",
        "Community": "Сообщество",
        "Search": "Поиск",
        "Cancel": "Отмена",
        "Save": "Сохранить",
        "Delete": "Удалить",
        "Close": "Закрыть",
        "Tops": "Топы",
    },
    "ko": {
        "Spy Builds": "스파이 빌드",
        "Open Spy Builds": "스파이 빌드 열기",
        "Classes": "직업",
        "Class": "직업",
        "Gladiator": "검성",
        "Templar": "수호성",
        "Assassin": "살성",
        "Ranger": "궁성",
        "Sorcerer": "마도성",
        "Spiritmaster": "정령성",
        "Cleric": "치유성",
        "Chanter": "호법성",
        "Elyos": "천족",
        "Asmodian": "마족",
        "Asmodians": "마족",
        "Manastones": "마석",
        "Theostones": "신석",
        "Kinah": "키나",
        "Daevanion": "데바니온",
        "Enhance": "강화",
        "Soul bind": "영혼 각인",
        "Power and iLvl ranking": "전투력 및 iLvl 랭킹",
        "Home": "홈",
        "Game": "게임",
        "Map": "지도",
        "Tools": "도구",
        "Guides": "가이드",
        "Help": "도움말",
        "FAQ": "자주 묻는 질문",
        "Frequently asked questions": "자주 묻는 질문",
        "Legal notice": "법적 고지",
        "Privacy policy": "개인정보처리방침",
        "Live chat": "실시간 채팅",
        "Community": "커뮤니티",
        "Search": "검색",
        "Cancel": "취소",
        "Save": "저장",
        "Delete": "삭제",
        "Close": "닫기",
        "Tops": "랭킹",
    },
    "ja": {
        "Spy Builds": "スパイビルド",
        "Open Spy Builds": "スパイビルドを開く",
        "Classes": "クラス",
        "Class": "クラス",
        "Gladiator": "ソードウイング",
        "Templar": "シールドウイング",
        "Assassin": "シャドウウイング",
        "Ranger": "ボウウイング",
        "Sorcerer": "スペルウイング",
        "Spiritmaster": "スピリットウイング",
        "Cleric": "キュアウイング",
        "Chanter": "チャントウイング",
        "Elyos": "天族",
        "Asmodian": "魔族",
        "Asmodians": "魔族",
        "Manastones": "魔石",
        "Theostones": "神石",
        "Kinah": "ギーナ",
        "Daevanion": "ディーヴァニオン",
        "Enhance": "強化",
        "Soul bind": "ソウルバインド",
        "Power and iLvl ranking": "戦闘力・iLvlランキング",
        "Home": "ホーム",
        "Game": "ゲーム",
        "Map": "マップ",
        "Tools": "ツール",
        "Guides": "ガイド",
        "Help": "ヘルプ",
        "FAQ": "よくある質問",
        "Frequently asked questions": "よくある質問",
        "Legal notice": "法的通知",
        "Privacy policy": "プライバシーポリシー",
        "Live chat": "ライブチャット",
        "Community": "コミュニティ",
        "Search": "検索",
        "Cancel": "キャンセル",
        "Save": "保存",
        "Delete": "削除",
        "Close": "閉じる",
        "Tops": "トップ",
    },
}


def esc_js(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "")
    )


def unesc_js(s: str) -> str:
    return (
        s.replace('\\"', '"')
        .replace("\\n", "\n")
        .replace("\\\\", "\\")
    )


def postprocess_placeholders(text: str) -> str:
    # Restaura { n }, { total }, etc.
    text = re.sub(r'\{\s*([a-zA-Z0-9_]+)\s*\}', r'{\1}', text)
    # Arregla espacios alrededor de % si los añade
    text = re.sub(r'(\d+)\s*%', r'\1 %', text)
    return text


def extract_entries() -> list[tuple[str, str, dict[str, str]]]:
    """Retorna lista de (archivo, clave, {lang: val})"""
    res = []
    for rel in ("js/i18n.js", "js/equipo.js"):
        content = (ROOT / rel).read_text(encoding="utf-8")
        for m in ENTRY_RE.finditer(content):
            key = m.group(2)
            body = m.group(3)
            fields = {k: unesc_js(v) for k, v in STR_RE.findall(body)}
            if "es" in fields or "en" in fields:
                res.append((rel, key, fields))
    return res


def translate_text(text: str, target_lang: str) -> str:
    glossary = GLOSARIOS.get(target_lang, {})
    if text in glossary:
        return glossary[text]

    # Reemplazos exactos de frases / palabras dentro del texto
    # Traducir con Argos
    try:
        translated = tr.translate(text, "en", target_lang)
    except Exception as e:
        print(f"Error traduciendo '{text}': {e}")
        translated = text

    # Si Argos devuelve vacío
    if not translated or not translated.strip():
        translated = text

    translated = postprocess_placeholders(translated)

    # Reemplazos específicos de glosario que pudieran haberse desvirtuado
    for term, repl in glossary.items():
        if len(term) >= 4 and term in text and term not in translated:
            # Reemplazo si procede
            pass

    return translated


def build_language_map(target_lang: str) -> dict[str, str]:
    entries = extract_entries()
    print(f"Total entradas extraídas: {len(entries)}")

    lang_map = {}
    total = len(entries)
    for idx, (rel, key, fields) in enumerate(entries):
        en_val = fields.get("en") or fields.get("es") or key
        translated = translate_text(en_val, target_lang)
        lang_map[key] = translated
        if (idx + 1) % 200 == 0 or idx + 1 == total:
            print(f"[{target_lang}] Traducidas {idx + 1}/{total} entradas...")

    map_file = ROOT / "data" / f"i18n-{target_lang}-map.json"
    map_file.write_text(json.dumps(lang_map, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Mapa guardado en {map_file} ({len(lang_map)} claves)")
    return lang_map


def inject_language(target_lang: str, lang_map: dict[str, str]):
    for rel in ("js/i18n.js", "js/equipo.js"):
        path = ROOT / rel
        content = path.read_text(encoding="utf-8")

        n_ok = n_miss = 0

        def repl(m):
            nonlocal n_ok, n_miss
            head, key, body, tail = m.group(1), m.group(2), m.group(3), m.group(5)
            fields = {k: v for k, v in STR_RE.findall(body)}
            if "es" not in fields and "en" not in fields:
                return m.group(0)

            val = lang_map.get(key)
            if val is None:
                n_miss += 1
                en = fields.get("en") or fields.get("es") or key
                val = en.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
            else:
                n_ok += 1

            val_js = esc_js(val)

            # Quitar target_lang si ya existía para evitar duplicados
            body2 = re.sub(rf',?\s*{target_lang}\s*:\s*"(?:\\.|[^"\\])*"', "", body)
            body2 = re.sub(r",\s*,", ",", body2)

            # Añadir tras el último par de idioma
            matches = list(re.finditer(r'\b[a-z]{2}\s*:\s*"(?:\\.|[^"\\])*"', body2))
            if matches:
                end_pos = matches[-1].end()
                body2 = body2[:end_pos] + f', {target_lang}: "{val_js}"' + body2[end_pos:]
            else:
                body2 = body2 + f', {target_lang}: "{val_js}"'

            return head + body2 + tail

        new_content = ENTRY_RE.sub(repl, content)
        path.write_text(new_content, encoding="utf-8", newline="\n")
        print(f"[{target_lang}] Inyectado en {rel}: {n_ok} ok, {n_miss} fallback")


def check_language(target_lang: str):
    print(f"--- Verificando cobertura de {target_lang} ---")
    total_miss = total_empty = 0
    for rel in ("js/i18n.js", "js/equipo.js"):
        content = (ROOT / rel).read_text(encoding="utf-8")
        miss, empty = [], []
        for m in ENTRY_RE.finditer(content):
            key = m.group(2)
            fields = dict(STR_RE.findall(m.group(3)))
            if "es" not in fields and "en" not in fields:
                continue
            if target_lang not in fields:
                miss.append(key)
            elif not fields[target_lang].strip():
                empty.append(key)
        print(f"{rel}: missing={len(miss)}, empty={len(empty)}")
        if miss:
            print("  Faltantes:", miss[:10])
        total_miss += len(miss)
        total_empty += len(empty)
    return total_miss == 0 and total_empty == 0


if __name__ == "__main__":
    import sys
    lang = sys.argv[1] if len(sys.argv) > 1 else "de"
    print(f"Iniciando pipeline para idioma: {lang}")
    lmap = build_language_map(lang)
    inject_language(lang, lmap)
    ok = check_language(lang)
    print("Resultado:", "SUCCESS" if ok else "FAILED")
