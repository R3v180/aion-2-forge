"""Equipo de las builds con el catálogo local data/equipo (ids de objeto = los de NC).

Cada pieza guardada tiene el mismo formato que la ficha del personaje (juego.py) para poder compararlas:
{"slot", "id", "nombre", "nombre_es", "grado", "encantamiento", "superado", "icono", "alma", "stats", "stats_enc"}
más lo que elige el usuario: "potencial", "sub", "alma_stat", "piedras", "divinas".
"""
import json
from functools import lru_cache
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
DIR = RAIZ / "data" / "equipo"
ARMA = {"gladiator": "greatsword", "templar": "sword", "assassin": "dagger", "ranger": "bow", "sorcerer": "magicbook",
        "spiritmaster": "orb", "cleric": "mace", "chanter": "staff"}
RANURAS = {"MainHand": None, "SubHand": "guarder", "Helmet": "helmet", "Shoulder": "shoulder", "Torso": "torso", "Pants": "pants",
           "Gloves": "gloves", "Boots": "boots", "Cape": "cape", "Belt": "belt", "Necklace": "necklace", "Earring1": "earring",
           "Earring2": "earring", "Ring1": "ring", "Ring2": "ring", "Bracelet1": "bracelet", "Bracelet2": "bracelet",
           "Amulet": "amulet", "Rune1": "rune", "Rune2": "rune"}
GRADO_NC = {11: "Common", 21: "Rare", 31: "Legend", 41: "Unique", 51: "Epic", 61: "Mythic", 71: "Special"}
# NC manda el código (21/31) o el nombre interno. In-game: Rare=Superior verde, Legend=Rare azul.
_GRADO_ALIAS = {
    "common": "Common", "comun": "Common", "común": "Common", "normal": "Common",
    "rare": "Rare", "superior": "Rare",
    "legend": "Legend", "raro": "Legend",
    "unique": "Unique", "heroic": "Unique", "heroico": "Unique",
    "epic": "Epic", "legendary": "Epic", "legendario": "Epic",
    "mythic": "Mythic", "mitico": "Mythic", "mítico": "Mythic",
    "special": "Special", "especial": "Special",
}


def nombre_grado(g):
    if g is None or g == "":
        return ""
    if isinstance(g, bool):
        return ""
    if isinstance(g, (int, float)) or (isinstance(g, str) and str(g).strip().isdigit()):
        try:
            return GRADO_NC.get(int(g), "")
        except (TypeError, ValueError):
            return ""
    return _GRADO_ALIAS.get(str(g).strip().lower(), "")


ICONO_NC = "https://assets.playnccdn.com/static-aion2-gamedata/resources/"
# NC da el ataque del arma como "Ataque" (mín ~ máx); se cuenta el máximo, como en la ficha del personaje.
# Los topes de bloqueo del arma no salen en la ficha de NC.
RENOMBRE = {"weapondamage": "weaponfixingdamage"}
FUERA = {"weaponmindamage", "maxweaponblock", "decreaseweaponblock"}


def sub_de(clase, slot):
    return ARMA.get(clase) if slot == "MainHand" else RANURAS.get(slot)


@lru_cache(maxsize=None)
def lista(sub):
    f = DIR / f"{sub}.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else []


@lru_cache(maxsize=None)
def por_id(sub):
    return {p["id"]: p for p in lista(sub)}


@lru_cache(maxsize=1)
def piedras():
    f = DIR / "piedras.json"
    d = json.loads(f.read_text(encoding="utf-8")) if f.exists() else {"mana": {}, "divinas": []}
    mana = {(s, v) for s, valores in d["mana"].items() for v, _ in valores}
    return mana, {x["id"] for x in d["divinas"]}


def _entero(v, minimo, maximo):
    try:
        v = int(v)
    except (TypeError, ValueError):
        return None
    return max(minimo, min(maximo, v))


def _sumar(acum, stat, v):
    stat = RENOMBRE.get(stat, stat)
    if stat in FUERA or not v:
        return
    acum[stat] = acum.get(stat, 0) + int(v)


def _nivel(tabla, nivel, acum, *otros):
    if not nivel:
        return
    for stat, valores in (tabla or {}).items():
        if 0 < nivel <= len(valores):
            for a in (acum,) + otros:
                _sumar(a, stat, valores[nivel - 1])


def calcular(p, c):
    """Estadísticas totales y la parte del encantamiento (+ superación) de la pieza `p` con las elecciones `c`."""
    total, enc = {}, {}
    for stat, v in (p.get("m") or {}).items():
        _sumar(total, stat, v)
    _nivel(p.get("e"), c.get("encantamiento"), total, enc)
    _nivel(p.get("x"), c.get("superado"), total, enc)
    _nivel(p.get("p"), c.get("potencial"), total)
    for stat, v in c.get("sub") or []:
        _sumar(total, stat, v)
    if c.get("alma_stat"):
        _sumar(total, *c["alma_stat"])
    for stat, v in c.get("piedras") or []:
        _sumar(total, stat, v)
    return {k: v for k, v in total.items() if v}, {k: v for k, v in enc.items() if v}


def limpiar_pieza(clase, slot, d):
    sub = sub_de(clase, slot)
    p = por_id(sub).get(str(d.get("id") or "")) if sub else None
    if not p:
        return None
    c = {"slot": slot, "id": p["id"],
         "encantamiento": _entero(d.get("encantamiento"), 0, p.get("emax", 0)) or 0,
         "superado": _entero(d.get("superado"), 0, p.get("xmax", 0)) or 0,
         "potencial": _entero(d.get("potencial"), 0, p.get("pmax", 0)) or 0}
    pool = {s: (lo, hi) for s, lo, hi in p.get("sub") or []}
    elegidas = []
    for x in d.get("sub") if isinstance(d.get("sub"), list) else []:
        if not isinstance(x, list) or len(x) != 2 or x[0] not in pool or any(e[0] == x[0] for e in elegidas):
            continue
        v = _entero(x[1], *pool[x[0]])
        if v is not None:
            elegidas.append([x[0], v])
    # sin impronta aleatoria el objeto trae siempre todas sus sub-estadísticas (mín = máx)
    c["sub"] = [[s, hi] for s, lo, hi in p["sub"]] if p.get("fijo") else elegidas[:p.get("ns", 0)]
    a = d.get("alma_stat")
    if p.get("sa") and isinstance(a, list) and len(a) == 2 and a[0] in pool:
        c["alma_stat"] = [a[0], _entero(a[1], *pool[a[0]])]
    mana, divinas = piedras()
    c["piedras"] = [[x[0], int(x[1])] for x in (d.get("piedras") if isinstance(d.get("piedras"), list) else [])
                    if isinstance(x, list) and len(x) == 2 and str(x[1]).lstrip("-").isdigit() and (x[0], int(x[1])) in mana][:p.get("ms", 0)]
    c["divinas"] = [str(x) for x in (d.get("divinas") if isinstance(d.get("divinas"), list) else []) if str(x) in divinas][:p.get("gs", 0)]
    c["stats"], c["stats_enc"] = calcular(p, c)
    c.update({"nombre": p["n"]["en"], "nombre_es": p["n"]["es"], "grado": GRADO_NC.get(p["g"], ""),
              "icono": ICONO_NC + p["i"].split("/")[-1] + ".png", "alma": 0})
    return c


def limpiar(clase, piezas):
    """Lista de piezas válidas para la clase: ranuras conocidas, ids del catálogo y mejoras dentro del rango del objeto."""
    salida, usadas = [], set()
    for d in (piezas if isinstance(piezas, list) else [])[:len(RANURAS)]:
        if not isinstance(d, dict) or d.get("slot") not in RANURAS or d["slot"] in usadas:
            continue
        c = limpiar_pieza(clase, d["slot"], d)
        if c:
            usadas.add(d["slot"])
            salida.append(c)
    return salida


def desde_ficha(clase, equipo):
    """Piezas de la ficha de NC que existen en el catálogo, con su encantamiento, sub-estadísticas y piedras."""
    piezas = []
    for f in equipo or []:
        if not isinstance(f, dict):
            continue
        slot = f.get("slot")
        sub = sub_de(clase, slot)
        if not sub:
            continue
        p = por_id(sub).get(str(f.get("id") or ""))
        if not p:
            # fichas leídas antes de guardar el id: se busca por nombre y grado
            p = next((x for x in lista(sub) if x["n"]["en"] == f.get("nombre") and GRADO_NC.get(x["g"]) == f.get("grado")), None)
        if not p:
            continue
        piezas.append({"slot": slot, "id": p["id"], "encantamiento": f.get("encantamiento"), "superado": f.get("superado"),
                       "sub": f.get("sub") or [], "piedras": f.get("piedras") or []})
    return limpiar(clase, piezas)
