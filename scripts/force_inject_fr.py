# -*- coding: utf-8 -*-
"""Fuerza fr: desde data/i18n-fr-map.json (soporta placeholders {n} en strings)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP = json.loads((ROOT / "data" / "i18n-fr-map.json").read_text(encoding="utf-8"))

# "key": { ... } permitiendo {n} dentro de strings
ENTRY_RE = re.compile(
    r'("([^"\\]+)"\s*:\s*\{)((?:[^{}"]|"((?:\\.|[^"\\])*)")*)(\})',
    re.S,
)
STR_RE = re.compile(r'\b(es|en|fr)\s*:\s*"((?:\\.|[^"\\])*)"')


def esc_js(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "")
    )


def inject(text: str) -> tuple[str, int, int]:
    n_ok = n_miss = 0

    def repl(m):
        nonlocal n_ok, n_miss
        head, key, body, tail = m.group(1), m.group(2), m.group(3), m.group(5)
        fields = {k: v for k, v in STR_RE.findall(body)}
        if "es" not in fields and "en" not in fields:
            return m.group(0)
        fr = MAP.get(key)
        if fr is None:
            n_miss += 1
            en = fields.get("en") or fields.get("es") or key
            fr = en.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
        else:
            n_ok += 1
        fr_js = esc_js(fr)
        body2 = re.sub(r',?\s*fr\s*:\s*"(?:\\.|[^"\\])*"', "", body)
        body2 = re.sub(r",\s*,", ",", body2)
        if re.search(r'\ben\s*:\s*"', body2):
            body2 = re.sub(
                r'(\ben\s*:\s*"(?:\\.|[^"\\])*")',
                rf'\1, fr: "{fr_js}"',
                body2,
                count=1,
            )
        else:
            body2 = re.sub(
                r'(\bes\s*:\s*"(?:\\.|[^"\\])*")',
                rf'\1, fr: "{fr_js}"',
                body2,
                count=1,
            )
        return head + body2 + tail

    return ENTRY_RE.sub(repl, text), n_ok, n_miss


def main():
    print("map keys", len(MAP))
    for rel in ("js/i18n.js", "js/equipo.js"):
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        new, ok, miss = inject(text)
        path.write_text(new, encoding="utf-8", newline="\n")
        print(rel, "from_map", ok, "fallback", miss)


if __name__ == "__main__":
    main()
