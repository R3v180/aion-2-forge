# -*- coding: utf-8 -*-
import re
from pathlib import Path

ENTRY_RE = re.compile(
    r'"([^"\\]+)"\s*:\s*\{((?:[^{}"]|"((?:\\.|[^"\\])*)")*)\}',
    re.S,
)
STR_RE = re.compile(r'\b(es|en|fr)\s*:\s*"((?:\\.|[^"\\])*)"')


def check(path: Path):
    t = path.read_text(encoding="utf-8")
    miss, empty = [], []
    for m in ENTRY_RE.finditer(t):
        fields = dict(STR_RE.findall(m.group(2)))
        if "es" not in fields and "en" not in fields:
            continue
        if "fr" not in fields:
            miss.append(m.group(1))
        elif not fields["fr"].strip():
            empty.append(m.group(1))
    return miss, empty


for rel in ("js/i18n.js", "js/equipo.js"):
    miss, empty = check(Path(rel))
    print(rel, "missing", len(miss), "empty", len(empty))
    if miss[:20]:
        print(" ", miss[:20])
