"""Reglas de AION 2 para validar builds en el servidor (las mismas que aplica js/reglas.js)."""
import json
import re
from functools import lru_cache
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
CLASES = ["gladiator", "templar", "assassin", "ranger", "sorcerer", "spiritmaster", "cleric", "chanter"]
MODOS = ["pve", "pvp", "farm", "otro"]
NIVEL_MAX = 20
VIDEO_RE = re.compile(r"^https://(www\.)?(youtube\.com/watch\?v=|youtu\.be/|youtube\.com/shorts/)[\w-]{6,}")


@lru_cache(maxsize=None)
def catalogo(clase):
    f = RAIZ / "data" / "catalogo" / f"{clase}.json"
    if not f.exists():
        return {}
    return {h["id"]: h for h in json.loads(f.read_text(encoding="utf-8"))["habilidades"]}


def huecos_activa(nivel):
    return 3 if nivel >= 20 else 2 if nivel >= 12 else 1 if nivel >= 8 else 0


def _entero(v, minimo, maximo):
    try:
        v = int(v)
    except (TypeError, ValueError):
        return None
    return max(minimo, min(maximo, v))


def limpiar_datos(clase, datos, admin=False):
    """Devuelve una copia válida de `datos`: descarta ids desconocidos y especializaciones no permitidas."""
    if not isinstance(datos, dict):
        datos = {}
    cat = catalogo(clase)
    habs = {}
    for sid, v in (datos.get("habilidades") or {}).items():
        h = cat.get(str(sid))
        if not h or not isinstance(v, dict):
            continue
        nivel = _entero(v.get("nivel"), 0, NIVEL_MAX) or 0
        esp = []
        if h["tipo"] == "activa":
            disponibles = {e["n"] for e in h["esp"] if (e["nivel"] or 99) <= nivel}
            for n in v.get("esp") or []:
                n = _entero(n, 1, 9)
                if n in disponibles and n not in esp:
                    esp.append(n)
            esp = esp[:huecos_activa(nivel)]
        if nivel or esp:
            habs[str(sid)] = {"nivel": nivel, "esp": esp}
    limpio = {"habilidades": habs}
    nivel_pj = _entero(datos.get("nivel_pj"), 1, 99)
    if nivel_pj:
        limpio["nivel_pj"] = nivel_pj
    limpio["videos"] = [u for u in (datos.get("videos") or []) if isinstance(u, str) and VIDEO_RE.match(u)][:6]
    presets = datos.get("presets")
    if presets is None and isinstance(datos.get("barra"), list):
        # formato antiguo: una barra y una lista de macros sueltas
        macros = datos.get("macros") or [{}]
        presets = [{"nombre": "Principal", "barra": datos["barra"], "macro": (macros[0] or {}).get("pasos") or [], "tecla_macro": "RMB"}]
    limpio["presets"] = limpiar_presets(cat, presets)
    limpio["daevanion"] = limpiar_daevanion(clase, datos.get("daevanion"))
    if admin and isinstance(datos.get("prioridad"), dict):
        limpio["prioridad"] = datos["prioridad"]
    return limpio


# ---------- Daevanion ----------
@lru_cache(maxsize=None)
def daevanion(clase):
    """{id_nodo: (id_tablero, fila, col, es_inicio)} de los tableros de la clase."""
    f = RAIZ / "data" / "daevanion" / f"{clase}.json"
    if not f.exists():
        return {}
    nodos = {}
    for t in json.loads(f.read_text(encoding="utf-8"))["tableros"]:
        for n in t["nodos"]:
            nodos[n["id"]] = (t["id"], n["f"], n["c"], n["tipo"] == "start")
    return nodos


def conectados(nodos, elegidos):
    """Nodos elegidos que llegan al inicio de su tablero pasando solo por nodos elegidos (vecinos en cruz)."""
    pos = {}
    for nid in elegidos:
        t, f, c, _ = nodos[nid]
        pos[(t, f, c)] = nid
    pendientes = [(t, f, c) for nid, (t, f, c, inicio) in nodos.items() if inicio]
    vistos = set()
    while pendientes:
        t, f, c = pendientes.pop()
        for df, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            k = (t, f + df, c + dc)
            if k in pos and pos[k] not in vistos:
                vistos.add(pos[k])
                pendientes.append(k)
    return vistos


def limpiar_daevanion(clase, d):
    nodos = daevanion(clase)
    presets = []
    for p in ((d or {}).get("presets") if isinstance(d, dict) and isinstance(d.get("presets"), list) else [])[:MAX_PRESETS]:
        if not isinstance(p, dict):
            continue
        elegidos = {str(n) for n in (p.get("nodos") if isinstance(p.get("nodos"), list) else []) if str(n) in nodos and not nodos[str(n)][3]}
        validos = conectados(nodos, elegidos)
        presets.append({"nombre": _texto(p.get("nombre"), 40) or f"Preset {len(presets) + 1}", "nodos": sorted(validos)})
    return {"presets": presets}


# ---------- barra, macro y presets ----------
TECLAS = ["LMB", "RMB", "M4", "M5", "Q", "E", "R", "F", "T", "G", "Z", "X", "C", "V", "Tab", "Shift", "Ctrl", "Alt", "Espacio",
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "F1", "F2", "F3", "F4", "Otra"]
USOS = ["macro", "mano", "ambas"]
MAX_PRESETS, MAX_LINEAS, MAX_PILA, MAX_PASOS = 3, 24, 4, 20


def _texto(v, maximo):
    return v.strip()[:maximo] if isinstance(v, str) else ""


def limpiar_presets(cat, presets):
    """Hasta 3 presets; cada línea de barra apila hasta 4 habilidades no pasivas de la clase y la macro solo pulsa teclas de la barra."""
    limpios = []
    for p in (presets if isinstance(presets, list) else [])[:MAX_PRESETS]:
        if not isinstance(p, dict):
            continue
        barra, usadas = [], set()
        for l in (p.get("barra") if isinstance(p.get("barra"), list) else [])[:MAX_LINEAS]:
            if not isinstance(l, dict) or l.get("tecla") not in TECLAS or l["tecla"] in usadas:
                continue
            pila = []
            for sid in (l.get("pila") if isinstance(l.get("pila"), list) else []):
                h = cat.get(str(sid))
                if h and h["tipo"] != "pasiva" and str(sid) not in pila:
                    pila.append(str(sid))
            if not pila:
                continue
            usadas.add(l["tecla"])
            barra.append({"tecla": l["tecla"], "nombre": _texto(l.get("nombre"), 40), "pila": pila[:MAX_PILA],
                          "uso": l.get("uso") if l.get("uso") in USOS else "mano"})
        macro = []
        for paso in (p.get("macro") if isinstance(p.get("macro"), list) else [])[:MAX_PASOS]:
            if isinstance(paso, dict) and paso.get("tecla") in usadas | {"LMB", "RMB"}:
                macro.append({"tecla": paso["tecla"], "ms": _entero(paso.get("ms"), 0, 1000) or 0})
        tecla_macro = p.get("tecla_macro") if p.get("tecla_macro") in TECLAS else "RMB"
        limpios.append({"nombre": _texto(p.get("nombre"), 40) or f"Preset {len(limpios) + 1}", "barra": barra, "macro": macro,
                        "tecla_macro": tecla_macro, "notas": _texto(p.get("notas"), 1000)})
    return limpios
