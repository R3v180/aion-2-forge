import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]

ENTRY_RE = re.compile(
    r'"([^"\\]+)"\s*:\s*\{((?:[^{}"]|"((?:\\.|[^"\\])*)")*)\}',
    re.S,
)
STR_RE = re.compile(r'\b([a-z]{2})\s*:\s*"((?:\\.|[^"\\])*)"')

ALL_LANGS = ["es", "en", "fr", "de", "pt", "ru", "ko", "ja"]


def check_file(path: Path):
    t = path.read_text(encoding="utf-8")
    stats = {l: {"miss": 0, "empty": 0} for l in ALL_LANGS}
    total_entries = 0
    for m in ENTRY_RE.finditer(t):
        fields = dict(STR_RE.findall(m.group(2)))
        if "es" not in fields and "en" not in fields:
            continue
        total_entries += 1
        for l in ALL_LANGS:
            if l not in fields:
                stats[l]["miss"] += 1
            elif not fields[l].strip():
                stats[l]["empty"] += 1
    return total_entries, stats


for rel in ("js/i18n.js", "js/equipo.js"):
    total, stats = check_file(ROOT / rel)
    print(f"\nArchivo: {rel} (Total entradas válidas: {total})")
    for l in ALL_LANGS:
        s = stats[l]
        status = "OK" if s["miss"] == 0 and s["empty"] == 0 else f"FAIL (miss={s['miss']}, empty={s['empty']})"
        print(f"  [{l}]: {status}")
        if s["empty"] > 0 or s["miss"] > 0:
            # Encontrar cuáles
            t = (ROOT / rel).read_text(encoding="utf-8")
            for m in ENTRY_RE.finditer(t):
                f = dict(STR_RE.findall(m.group(2)))
                if "es" not in f and "en" not in f:
                    continue
                if l not in f or not f[l].strip():
                    print(f"    -> clave: {m.group(1)} = {f}")

