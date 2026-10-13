"""Lectura de la ficha pública de un personaje de AION 2. No pide contraseña de NC."""
import json
import re
import time
from collections import defaultdict
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

import equipo
import reglas

CID_RE = re.compile(r"^[A-Za-z0-9_-]{16,160}={0,2}$")
HTML_RE = re.compile(r"<[^>]+>")
CLASE_NC = {
    "gladiator": "gladiator", "templar": "templar", "assassin": "assassin", "ranger": "ranger",
    "sorcerer": "sorcerer", "elementalist": "spiritmaster", "spiritmaster": "spiritmaster",
    "cleric": "cleric", "chanter": "chanter",
}
CAT_NC = {"active": "activa", "passive": "pasiva", "dp": "estigma"}
_UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json", "Referer": "https://aion2.plaync.com/"}
_cache = {}


class JuegoError(Exception):
    pass


@lru_cache(maxsize=1)
def _stats():
    ruta = reglas.RAIZ / "data" / "estadisticas.json"
    return json.loads(ruta.read_text(encoding="utf-8"))


def _get(url):
    req = Request(url, headers=_UA)
    with urlopen(req, timeout=12) as r:
        return json.loads(r.read().decode("utf-8"))


def _numero(texto):
    s = str(texto or "").strip().replace("+", "").replace("%", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


def _sumar(acum, stat_id, texto):
    clave = str(stat_id or "").lower()
    info = _stats().get(clave)
    if not info:
        return
    bruto = str(texto or "")
    num = _numero(bruto)
    if info.get("pct") or "%" in bruto:
        num = round(num * 100)
    else:
        num = round(num)
    if num:
        acum[clave] += int(num)


def buscar(texto):
    q = HTML_RE.sub("", str(texto or "")).strip()
    if len(q) < 2 or len(q) > 24:
        raise JuegoError("busqueda_corta")
    url = ("https://api-search.plaync.com/aion2global/search/v2/character?keyword="
           + quote(q) + "&region=eu&localeInfo=en-US&page=1&size=20")
    try:
        data = _get(url)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as e:
        raise JuegoError("juego_no_disponible") from e
    salida = []
    for f in (data.get("list") or [])[:20]:
        cid = HTML_RE.sub("", str(f.get("characterId") or ""))
        cid = cid.replace("%3D", "=").replace("%3d", "=")
        if not CID_RE.match(cid):
            continue
        imagen = str(f.get("profileImageUrl") or "")
        if imagen.startswith("/"):
            imagen = "https://profileimg.plaync.com" + imagen
        salida.append({
            "character_id": cid,
            "server_id": int(f.get("serverId") or 0),
            "nombre": HTML_RE.sub("", str(f.get("name") or "")).strip()[:40],
            "servidor": str(f.get("serverName") or "")[:40],
            "nivel": int(f.get("level") or 0),
            "imagen": imagen,
        })
    return salida


def _detalle_item(cid, server_id, pieza):
    # NC da 404 a ratos en el detalle, y según el momento con lang=en o con lang=en-US
    for intento, lang in enumerate(("en", "en-US", "en", "en-US")):
        url = ("https://aion2.plaync.com/api/character/equipment/item?id=%s&enchantLevel=%s&characterId=%s"
               "&serverId=%s&slotPos=%s&lang=%s&region=eu&_=%s") % (
            pieza["id"], int(pieza.get("enchantLevel") or 0), quote(cid, safe=""), server_id, pieza.get("slotPos") or 0,
            lang, int(time.time() * 1000))
        try:
            return _get(url)
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            if intento < 3:
                time.sleep(0.3)
    return None


def _stats_pieza(det):
    """Estadísticas de una pieza: total (valor + encantamiento) y la parte que da el encantamiento."""
    total, extra = defaultdict(int), defaultdict(int)
    for grupo in ("mainStats", "subStats", "magicStoneStat"):
        for st in det.get(grupo) or []:
            _sumar(total, st.get("id"), st.get("value"))
            if st.get("extra"):
                _sumar(total, st.get("id"), st.get("extra"))
                _sumar(extra, st.get("id"), st.get("extra"))
    return dict(total), dict(extra)


def _pares(lista):
    """[[stat, valor]] de las sub-estadísticas o piedras de maná de una pieza, para copiarlas a una build."""
    salida = []
    for st in lista or []:
        acum = defaultdict(int)
        _sumar(acum, st.get("id"), st.get("value"))
        salida.extend([k, v] for k, v in acum.items())
    return salida[:8]


def _grado(valor):
    if valor in equipo.GRADO_NC.values():
        return valor
    try:
        return equipo.GRADO_NC.get(int(valor), str(valor or "")[:24])
    except (TypeError, ValueError):
        return str(valor or "")[:24]


def _completar_pieza(item, clase):
    """Nombre ES si falta, y grado canónico (Rare/Legend/…) aunque NC guardara 21/31."""
    sub = equipo.sub_de(clase, item.get("slot"))
    cat = equipo.por_id(sub).get(str(item.get("id") or "")) if sub else None
    es = (item.get("nombre_es") or "").strip()
    if es:
        item["nombre_es"] = es[:80]
    elif cat:
        item["nombre_es"] = (cat["n"].get("es") or cat["n"].get("en") or item.get("nombre") or "")[:80]
        if not item.get("nombre"):
            item["nombre"] = (cat["n"].get("en") or "")[:80]
    else:
        item["nombre_es"] = (item.get("nombre") or "")[:80]
    gcat = equipo.nombre_grado(cat.get("g")) if cat else ""
    item["grado"] = gcat or equipo.nombre_grado(item.get("grado")) or str(item.get("grado") or "")[:24]
    return item


def completar_ficha(clase, ficha):
    """Rellena nombre_es vacío y normaliza el grado. No escribe en la base."""
    f = dict(ficha or {})
    f["equipo"] = [_completar_pieza(dict(x), clase) if isinstance(x, dict) else x for x in (f.get("equipo") or [])]
    return f


def _tableros(clase):
    """Cada clase tiene sus propios tableros en NC (Clérigo 71-76, Cantor 81-86…)."""
    ruta = reglas.RAIZ / "data" / "daevanion" / f"{clase}.json"
    if not ruta.exists():
        return []
    return [int(t["id"]) for t in json.loads(ruta.read_text(encoding="utf-8")).get("tableros") or [] if str(t.get("id")).isdigit()]


def _tablero(cid, server_id, board):
    lista = []
    for _ in range(4):
        url = ("https://aion2.plaync.com/api/character/daevanion/detail?region=eu&lang=en-US&characterId=%s"
               "&serverId=%s&boardId=%s&_=%s") % (quote(cid, safe=""), server_id, board, int(time.time() * 1000))
        try:
            lista = _get(url).get("nodeList") or []
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            lista = []
        if lista:
            break
        time.sleep(0.4)
    return [str(n.get("nodeId")) for n in lista if n.get("open") and n.get("nodeId")]


def _efectos(clase, nodos):
    """Extra de nivel y estadísticas de los nodos abiertos, con el catálogo local."""
    bonus, stats = defaultdict(int), defaultdict(int)
    ruta = reglas.RAIZ / "data" / "daevanion" / f"{clase}.json"
    if not ruta.exists():
        return {}, {}
    abiertos = set(nodos)
    data = json.loads(ruta.read_text(encoding="utf-8"))
    for tab in data.get("tableros") or []:
        for n in tab.get("nodos") or []:
            if str(n.get("id")) not in abiertos:
                continue
            for ef in n.get("ef") or []:
                if ef.get("h"):
                    bonus[str(ef["h"])] += int(ef.get("n") or 0)
                elif ef.get("s"):
                    stats[str(ef["s"])] += int(ef.get("v") or 0)
    return dict(bonus), {k: v for k, v in stats.items() if v}


def leer(character_id, server_id, forzar=False):
    cid = str(character_id or "").strip()
    if not CID_RE.match(cid):
        raise JuegoError("no_existe")
    try:
        server_id = int(server_id)
    except (TypeError, ValueError):
        raise JuegoError("no_existe")
    if server_id <= 0 or server_id > 999999:
        raise JuegoError("no_existe")
    q = quote(cid, safe="")
    clave = (cid, server_id)
    guardado = _cache.get(clave)
    if not forzar and guardado and time.time() - guardado[0] < 180:
        return guardado[1]
    try:
        info = _get(f"https://aion2.plaync.com/api/character/info?region=eu&lang=en-US&characterId={q}&serverId={server_id}")
        # NC responde a ratos con listas vacías: se pide varias veces y se queda la mejor de cada una
        habs_nc, piezas_nc = [], []
        for _ in range(6):
            r = _get(f"https://aion2.plaync.com/api/character/equipment?region=eu&lang=en-US&characterId={q}"
                     f"&serverId={server_id}&_={int(time.time() * 1000)}")
            habs_nc = max(habs_nc, (r.get("skill") or {}).get("skillList") or [], key=len)
            piezas_nc = max(piezas_nc, (r.get("equipment") or {}).get("equipmentList") or [], key=len)
            if habs_nc and piezas_nc:
                break
            time.sleep(0.5)
        eq = {"skill": {"skillList": habs_nc}, "equipment": {"equipmentList": piezas_nc}}
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as e:
        raise JuegoError("juego_no_disponible") from e
    nombres_es, titulo_es = {}, ""
    try:
        for _ in range(3):
            eq_es = _get(f"https://aion2.plaync.com/api/character/equipment?region=eu&lang=es-es&characterId={q}"
                         f"&serverId={server_id}&_={int(time.time() * 1000)}")
            for p in (eq_es.get("equipment") or {}).get("equipmentList") or []:
                nombres_es[str(p.get("slotPosName") or "")] = str(p.get("name") or "")[:80]
            if nombres_es:
                break
            time.sleep(0.5)
        info_es = _get(f"https://aion2.plaync.com/api/character/info?region=eu&lang=es-es&characterId={q}&serverId={server_id}")
        titulo_es = str((info_es.get("profile") or {}).get("titleName") or "")[:80]
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
        pass
    perfil = info.get("profile") or {}
    clase = CLASE_NC.get(str(perfil.get("className") or "").strip().lower())
    if clase not in reglas.CLASES:
        raise JuegoError("clase_no_soportada")
    habilidades = {}
    for s in ((eq.get("skill") or {}).get("skillList") or [])[:80]:
        sid = str(s.get("id") or "")
        if not sid.isdigit():
            continue
        habilidades[sid] = {
            "nivel": int(s.get("skillLevel") or 0),
            "equipada": bool(s.get("equip")),
            "aprendida": bool(s.get("acquired")),
            "cat": CAT_NC.get(str(s.get("category") or "").lower(), "activa"),
        }
    piezas = ((eq.get("equipment") or {}).get("equipmentList") or [])[:24]
    with ThreadPoolExecutor(max_workers=6) as ex:
        detalles = list(ex.map(lambda p: _detalle_item(cid, server_id, p), piezas))
        nodos = []
        for grupo in ex.map(lambda b: _tablero(cid, server_id, b), _tableros(clase)):
            nodos.extend(grupo)
    equipo, stats_eq, sin_detalle = [], defaultdict(int), 0

    def con_detalle(item, det):
        item["nombre"] = str(det.get("name") or item["nombre"])[:80]
        item["alma"] = int(round(_numero(det.get("soulBindRate"))))
        item["stats"], item["stats_enc"] = _stats_pieza(det)
        item["sub"], item["piedras"] = _pares(det.get("subStats")), _pares(det.get("magicStoneStat"))
        for k, v in item["stats"].items():
            stats_eq[k] += v

    for pieza, det in zip(piezas, detalles):
        item = {
            "slot": str(pieza.get("slotPosName") or "")[:24],
            "id": str(pieza.get("id") or "")[:12],
            "nombre": str(pieza.get("name") or "")[:80],
            "nombre_es": (nombres_es.get(str(pieza.get("slotPosName") or ""), "") or "").strip()[:80],
            "grado": _grado(pieza.get("grade")),
            "encantamiento": int(pieza.get("enchantLevel") or 0),
            "superado": int(pieza.get("exceedLevel") or 0),
            "icono": str(pieza.get("icon") or "")[:300],
            "alma": 0,
        }
        _completar_pieza(item, clase)
        if det:
            con_detalle(item, det)
        else:
            sin_detalle += 1
        equipo.append(item)
    for i, pieza in enumerate(piezas):
        if detalles[i]:
            continue
        time.sleep(0.2)
        det = _detalle_item(cid, server_id, pieza)
        if det:
            con_detalle(equipo[i], det)
            sin_detalle -= 1
    bonus, stats_nodos = _efectos(clase, nodos)
    imagen = str(perfil.get("profileImage") or "")
    if not habilidades and not equipo and int(perfil.get("characterLevel") or 0) >= 8:
        raise JuegoError("juego_no_disponible")
    resultado = {
        "character_id": cid,
        "server_id": server_id,
        "nombre": str(perfil.get("characterName") or "")[:40],
        "servidor": str(perfil.get("serverName") or "")[:40],
        "clase": clase,
        "nivel": int(perfil.get("characterLevel") or 0),
        "poder": int(perfil.get("combatPower") or 0),
        "ficha": {
            "titulo": str(perfil.get("titleName") or "")[:80],
            "titulo_es": titulo_es,
            "gremio": str(perfil.get("regionName") or "")[:40],
            "imagen": imagen[:300],
            "habilidades": habilidades,
            "nodos": nodos[:600],
            "bonus": bonus,
            "stats_nodos": stats_nodos,
            "stats_equipo": dict(stats_eq),
            "equipo": equipo,
            "sin_detalle": sin_detalle,
        },
    }
    if len(_cache) > 200:
        for k in [k for k, v in _cache.items() if time.time() - v[0] >= 180]:
            _cache.pop(k, None)
    _cache[clave] = (time.time(), resultado)
    return resultado


def _barra_referencia(clase):
    """Barra y macro de la build de referencia de la clase (NC no envía la barra)."""
    f = reglas.RAIZ / "data" / "builds" / f"{clase}.js"
    if not f.exists():
        return [], []
    s = f.read_text(encoding="utf-8")
    b = json.loads(s[s.index("{"): s.rindex("}") + 1])
    pasos = ((b.get("macros") or [{}])[0] or {}).get("pasos") or []
    return b.get("barra") or [], pasos


def presets_desde_ficha(clase, habs, ficha_habs=None):
    """Barra de la referencia filtrada a las habilidades que el personaje tiene, más las equipadas que falten."""
    conocidas = set(habs)
    cat = reglas.catalogo(clase)
    barra_ref, pasos_ref = _barra_referencia(clase)
    usadas, teclas, barra = set(), set(), []
    for l in barra_ref:
        if not isinstance(l, dict):
            continue
        pila = [str(sid) for sid in (l.get("pila") or []) if str(sid) in conocidas]
        if not pila or l.get("tecla") in teclas:
            continue
        teclas.add(l["tecla"])
        usadas.update(pila)
        barra.append({"tecla": l["tecla"], "nombre": l.get("nombre") or "", "pila": pila,
                      "uso": l.get("uso") if l.get("uso") in reglas.USOS else "mano"})
    libres = [t for t in ("1", "2", "3", "4", "5", "6", "7", "8", "9", "0") if t not in teclas]
    for sid, h in (ficha_habs or {}).items():
        sid = str(sid)
        if sid in usadas or sid not in conocidas or not isinstance(h, dict) or not h.get("equipada"):
            continue
        info = cat.get(sid) or {}
        if info.get("tipo") == "pasiva":
            continue
        if not libres:
            break
        tecla = libres.pop(0)
        teclas.add(tecla)
        usadas.add(sid)
        barra.append({"tecla": tecla, "nombre": "", "pila": [sid], "uso": "mano"})
    if not barra:
        return []
    macro = [{"tecla": p["tecla"], "ms": int(p.get("ms") or 10)}
             for p in pasos_ref if isinstance(p, dict) and p.get("tecla") in teclas | {"LMB", "RMB"}]
    notas = ("Mantén Clic izq. (ataque) y Clic der. (macro). Los mantras van a mano: si los pulsas otra vez se apagan."
             if clase == "chanter" else "")
    return [{"nombre": "En el juego", "barra": barra, "macro": macro, "tecla_macro": "RMB", "notas": notas}]


def datos_desde_ficha(clase, ficha, nivel=None):
    """Habilidades, Daevanion, equipo y barra (de la referencia, filtrada) para una build nueva.

    El nivel de NC ya incluye el extra del tablero. La macro no viene de NC: se toma la de la referencia.
    """
    ficha = ficha or {}
    bonus = ficha.get("bonus") or {}
    habs, ficha_habs, cat = {}, ficha.get("habilidades") or {}, reglas.catalogo(clase)
    for sid, h in ficha_habs.items():
        if not isinstance(h, dict) or not h.get("aprendida"):
            continue
        nv = int(h.get("nivel") or 0) - int(bonus.get(str(sid)) or 0)
        info = cat.get(str(sid)) or {"tipo": h.get("cat") or "activa"}
        nv = max(1, min(reglas.tope_habilidad(info, nivel), nv))
        if nv:
            habs[str(sid)] = {"nivel": nv, "esp": []}
    datos = {
        "habilidades": habs,
        "daevanion": {"presets": [{"nombre": "En el juego", "nodos": ficha.get("nodos") or []}]},
        "presets": presets_desde_ficha(clase, habs, ficha_habs),
        "equipo": equipo.desde_ficha(clase, ficha.get("equipo")),
    }
    if nivel:
        datos["nivel_pj"] = int(nivel)
    return reglas.limpiar_datos(clase, datos)
