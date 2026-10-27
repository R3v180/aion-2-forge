"""Tableros de Daevanion y diccionario de estadísticas desde la API de questlog.gg.

Genera data/daevanion/<clase>.json, data/estadisticas.json e icons/daevanion/*.webp.
Uso: python scripts/generar_daevanion.py [--refrescar]
"""
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = RAIZ / "scripts" / "fuentes" / "questlog"
API = "https://questlog.gg/aion-2/api/trpc/"
CDN = "https://cdn.questlog.gg/aion-2"
# questlog llama "elementalist" al Espiritualista; "fighter" es el Brawler, aún sin habilidades
CLASES = {"gladiator": "gladiator", "templar": "templar", "assassin": "assassin", "ranger": "ranger", "sorcerer": "sorcerer",
          "elementalist": "spiritmaster", "cleric": "cleric", "chanter": "chanter"}
REFRESCAR = "--refrescar" in sys.argv


def trpc(proc, lang):
    f = FUENTES / f"{proc}_{lang}.json"
    if f.exists() and not REFRESCAR:
        return json.loads(f.read_text(encoding="utf-8"))
    url = API + proc + "?input=" + urllib.parse.quote(json.dumps({"language": lang}))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Orden Celeste AION 2)"})
    datos = json.loads(urllib.request.urlopen(req, timeout=180).read())["result"]["data"]
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(datos, ensure_ascii=False), encoding="utf-8")
    return datos


def descargar_icono(ruta, destino):
    if destino.exists():
        return
    destino.parent.mkdir(parents=True, exist_ok=True)
    ruta = ruta.split(".")[0] + ".webp" if not ruta.endswith(".webp") else ruta
    req = urllib.request.Request(CDN + ruta, headers={"User-Agent": "Mozilla/5.0"})
    destino.write_bytes(urllib.request.urlopen(req, timeout=60).read())


def estadisticas():
    es, en = trpc("statFormat.getStatFormat", "es"), trpc("statFormat.getStatFormat", "en")
    salida = {}
    for k, s in es.items():
        salida[k] = {"es": s["name"], "en": (en.get(k) or s)["name"], "pct": s.get("indicator") == "plusminuspercent",
                     "cat": s.get("category") or "", "orden": s.get("sortOrder") or 0}
    (RAIZ / "data" / "estadisticas.json").write_text(json.dumps(salida, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return salida


def tableros():
    b_es, b_en = trpc("daevanionPlanner.getDaevanionBoards", "es"), trpc("daevanionPlanner.getDaevanionBoards", "en")
    n_es, n_en = trpc("daevanionPlanner.getDaevanionNodes", "es"), trpc("daevanionPlanner.getDaevanionNodes", "en")
    nombre_en = {x["id"]: x["name"] for x in b_en}
    nodo_en = {x["id"]: x["name"] for x in n_en}
    por_tablero = {}
    for x in n_es:
        por_tablero.setdefault(x["boardId"], []).append(x)
    iconos = {}
    for ql, clase in CLASES.items():
        salida = []
        for b in sorted((b for b in b_es if b["mainCategory"] == ql), key=lambda b: b["order"]):
            nodos = []
            for x in sorted(por_tablero.get(b["id"], []), key=lambda x: (x["row"], x["col"])):
                efectos = []
                for e in x.get("effect") or []:
                    if e["type"] == "stat":
                        efectos.append({"s": e["stat_name"], "v": e["stat_value"]})
                    elif e["type"] == "skill_level":
                        efectos.append({"h": str(e["skill_id"]), "n": e.get("level_increase", 1)})
                icono = Path(x["icon"]).name.split(".")[0] if x.get("icon") else ""
                if icono:
                    iconos[icono] = x["icon"]
                nodos.append({"id": x["id"], "f": x["row"], "c": x["col"], "g": x["grade"], "tipo": x["nodeType"],
                              "coste": x["costDaevanionPoint"], "icono": icono,
                              "nombre": {"es": x["name"], "en": nodo_en.get(x["id"], x["name"])}, "ef": efectos})
            salida.append({"id": b["id"], "nombre": {"es": b["name"], "en": nombre_en.get(b["id"], b["name"])}, "nivel": b["needLevel"],
                           "punto": b["costPointType"], "nodos": nodos})
        d = RAIZ / "data" / "daevanion"
        d.mkdir(parents=True, exist_ok=True)
        (d / f"{clase}.json").write_text(json.dumps({"clase": clase, "tableros": salida}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(f"  {clase}: {len(salida)} tableros, {sum(len(t['nodos']) for t in salida)} nodos")
    for nombre, ruta in iconos.items():
        descargar_icono(ruta, RAIZ / "icons" / "daevanion" / f"{nombre}.webp")
    print(f"  iconos de nodo: {len(iconos)}")


if __name__ == "__main__":
    print(f"estadísticas: {len(estadisticas())}")
    tableros()
