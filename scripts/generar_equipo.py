"""Catálogo de equipo de AION 2 (armas, armaduras y accesorios) desde la API de questlog.gg.

Los ids de objeto son los mismos que usa NC en la ficha del personaje.
Genera data/equipo/<subcategoria>.json, data/equipo/piedras.json y data/equipo/indice.json.
Uso: python scripts/generar_equipo.py [--refrescar]
"""
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = RAIZ / "scripts" / "fuentes" / "questlog"
DESTINO = RAIZ / "data" / "equipo"
API = "https://questlog.gg/aion-2/api/trpc/"
REFRESCAR = "--refrescar" in sys.argv
SUBS = ["sword", "greatsword", "dagger", "bow", "magicbook", "orb", "mace", "staff", "guarder",
        "helmet", "shoulder", "torso", "pants", "gloves", "boots", "cape", "belt",
        "necklace", "earring", "ring", "bracelet", "amulet", "rune"]
HTML_RE = re.compile(r"<[^>]+>")


def trpc(proc, lang):
    f = FUENTES / f"{proc}_{lang}.json"
    if f.exists() and not REFRESCAR:
        return json.loads(f.read_text(encoding="utf-8"))
    url = API + proc + "?input=" + urllib.parse.quote(json.dumps({"language": lang}))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (EspClown AION 2)"})
    datos = json.loads(urllib.request.urlopen(req, timeout=300).read())["result"]["data"]
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(datos, ensure_ascii=False), encoding="utf-8")
    return datos


def icono(ruta):
    """'/assets/Game/UI/Resource/Texture/Item/Weapon/Icon_X.Icon_X' -> 'Item/Weapon/Icon_X'."""
    ruta = (ruta or "").split(".")[0]
    return ruta.replace("/assets/Game/UI/Resource/Texture/", "")


def tabla(niveles, clave="stats"):
    """Lista de niveles 1..N -> {stat: [v1..vN]} con el valor acumulado de cada nivel."""
    niveles = sorted((n for n in niveles or [] if int(n.get("level") or 0) > 0), key=lambda n: n["level"])
    salida = {}
    for i, n in enumerate(niveles):
        for k, v in (n.get(clave) or {}).items():
            v = v.get("value") if isinstance(v, dict) else v
            salida.setdefault(k, [0] * len(niveles))[i] = int(v or 0)
    return salida


def pieza(x, es):
    st = x.get("itemStats") or {}
    info = x.get("equipmentInfo") or {}
    p = {
        "id": x["id"], "n": {"es": es.get("name") or x["name"], "en": x["name"]}, "i": icono(x.get("icon")),
        "g": int(x.get("grade") or 0), "nv": int(x.get("minLevelRequirement") or 0), "il": int(info.get("itemLevel") or 0),
        "t": x.get("itemTier") or "", "r": x.get("raceId") or "all", "v": x.get("exchangeType") or "",
        "m": {k: int(v) for k, v in (st.get("mainStats") or {}).items() if v},
    }
    enc = tabla(st.get("enchants"))
    if enc:
        p["e"] = enc
        p["emax"] = max(int(n["level"]) for n in st["enchants"])
    exc = tabla(st.get("exceedEnchants"))
    if exc:
        p["x"] = exc
        p["xmax"] = max(int(n["level"]) for n in st["exceedEnchants"])
    sup = tabla(st.get("surpasses"))
    if sup:
        p["p"] = sup
        p["pmax"] = max(int(n["level"]) for n in st["surpasses"])
    sub = [[s["id"], int(s["minValue"]), int(s["maxValue"])] for s in st.get("subStats") or [] if s.get("type") == "stat"]
    if sub:
        p["sub"] = sub
        p["ns"] = int(info.get("soulbindRandomStatCount") or 0)
        if not info.get("soulbindRandomStat"):
            p["fijo"] = 1
    if info.get("magicStoneSlotCount"):
        p["ms"] = int(info["magicStoneSlotCount"])
    if info.get("godStoneSlotCount"):
        p["gs"] = int(info["godStoneSlotCount"])
    if x.get("itemSoulAdd") and sub:
        p["sa"] = 1
    if es.get("description") or x.get("description"):
        p["d"] = {"es": HTML_RE.sub("", es.get("description") or "")[:600], "en": HTML_RE.sub("", x.get("description") or "")[:600]}
    return p


def piedras(en, es_por_id):
    """Piedras de maná (pares estadística/valor posibles) y piedras divinas (teostones)."""
    pares = {}
    for x in en:
        if x["subCategory"] != "magicstone":
            continue
        for m in (x.get("usableInfo") or {}).get("magicStoneStats") or []:
            for s in m.get("stats") or []:
                clave = (m["statId"], int(s["value"]))
                pares[clave] = max(pares.get(clave, 0), int(s["grade"]))
    mana = {}
    for (stat, valor), grado in sorted(pares.items()):
        mana.setdefault(stat, []).append([valor, grado])
    divinas = []
    for x in en:
        if x["subCategory"] != "getgodstone":
            continue
        es = es_por_id.get(x["id"], {})
        divinas.append({"id": x["id"], "n": {"es": (es.get("name") or x["name"]), "en": x["name"]}, "i": icono(x.get("icon")),
                        "g": int(x.get("grade") or 0),
                        "d": {"es": HTML_RE.sub("", es.get("description") or "")[:600], "en": HTML_RE.sub("", x.get("description") or "")[:600]}})
    divinas.sort(key=lambda d: (-d["g"], d["n"]["en"]))
    return {"mana": mana, "divinas": divinas}


def main():
    en, es = trpc("characterBuilder.getEquipmentItems", "en"), trpc("characterBuilder.getEquipmentItems", "es")
    es_por_id = {x["id"]: x for x in es}
    DESTINO.mkdir(parents=True, exist_ok=True)
    indice = {}
    for sub in SUBS:
        lista = [pieza(x, es_por_id.get(x["id"], {})) for x in en if x["subCategory"] == sub and x.get("itemStats")]
        lista.sort(key=lambda p: (-p["il"], -p["g"], p["n"]["en"]))
        (DESTINO / f"{sub}.json").write_text(json.dumps(lista, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        indice[sub] = len(lista)
        print(f"  {sub}: {len(lista)}")
    pd = piedras(en, es_por_id)
    (DESTINO / "piedras.json").write_text(json.dumps(pd, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"  piedras de maná: {len(pd['mana'])} estadísticas · piedras divinas: {len(pd['divinas'])}")
    (DESTINO / "indice.json").write_text(json.dumps({"fuente": "questlog.gg", "subcategorias": indice}, ensure_ascii=False), encoding="utf-8")
    print(f"total: {sum(indice.values())} objetos")


if __name__ == "__main__":
    main()
