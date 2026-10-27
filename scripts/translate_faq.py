# -*- coding: utf-8 -*-
"""Traduce data/faq.json a los 8 idiomas soportados."""
import json
from pathlib import Path
import argostranslate.translate as tr

ROOT = Path(__file__).resolve().parents[1]
FAQ_PATH = ROOT / "data" / "faq.json"

LANGS = ["fr", "de", "pt", "ru", "ko", "ja"]


def main():
    data = json.loads(FAQ_PATH.read_text(encoding="utf-8"))
    items = data.get("items") or []

    for item in items:
        q_dict = item.setdefault("q", {})
        a_dict = item.setdefault("a", {})

        q_en = q_dict.get("en") or q_dict.get("es") or ""
        a_en = a_dict.get("en") or a_dict.get("es") or ""

        # Actualizar respuesta de idioma para que sea multilingüe
        if item.get("id") == "idioma":
            a_dict["es"] = "Usa el selector de idioma en la cabecera (con banderas). También puedes abrir cualquier página con el parámetro ?lang= (es, en, fr, de, pt, ru, ko, ja)."
            a_en = "Use the language selector in the header (with flags). You can also open any page with the ?lang= parameter (es, en, fr, de, pt, ru, ko, ja)."
            a_dict["en"] = a_en

        for l in LANGS:
            if l not in q_dict or not q_dict[l].strip():
                try:
                    q_dict[l] = tr.translate(q_en, "en", l)
                except Exception as e:
                    print(f"Error traduciendo pregunta a {l}: {e}")
                    q_dict[l] = q_en

            if l not in a_dict or not a_dict[l].strip():
                try:
                    a_dict[l] = tr.translate(a_en, "en", l)
                except Exception as e:
                    print(f"Error traduciendo respuesta a {l}: {e}")
                    a_dict[l] = a_en

    FAQ_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"data/faq.json actualizado con éxito con los 8 idiomas ({len(items)} preguntas).")


if __name__ == "__main__":
    main()
