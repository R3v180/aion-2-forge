"""Proxy de la base del cliente (aion2data.com).

Las cifras no se inventan: se reenvían el índice, el Markdown de la ficha
y las calculadoras públicas, con enlace a la página de origen.
Cache en disco (no se versiona). Términos de la fuente: citar con enlace.
"""
import hashlib
import html as html_lib
import json
import re
import threading
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ORIGEN = "https://aion2data.com"
UA = "Aion2Forge/1.0 (+https://aion-2-forge.onrender.com)"
RAIZ = Path(__file__).resolve().parent
CACHE = RAIZ / "cache" / "aion2data"
TTL = 24 * 3600
MAX_MD = 400_000
MAX_JSON = 8_000_000

TIPOS = {
    "objetos": ("items",),
    "skills": ("skills",),
    "monstruos": ("monsters",),
    "recetas": ("recipes",),
    "misiones": ("quests",),
    "todo": ("items", "skills", "monsters", "recipes", "quests"),
}
HREF_OK = re.compile(r"^/(items|skills|monsters|recipes|quests)/[a-z0-9]+(?:-[a-z0-9]+)*$")
ITEM_OK = re.compile(r"^[\w .,'’:+()/-]{1,80}$", re.UNICODE)

_lock = threading.Lock()
_indice = None
_por_nombre = None
_EQUIPO_HUECO = None
_NOMBRES = None
LANGS_NOMBRE = ("es", "en", "fr", "de", "pt", "ru", "ko", "ja")


class DatosError(Exception):
    def __init__(self, codigo, http=400):
        super().__init__(codigo)
        self.codigo = codigo
        self.http = http


def _norm(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.lower().replace("'", " ")
    return re.sub(r"[^a-z0-9]+", " ", texto).strip()


def _ruta_cache(url):
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:24]
    return CACHE / (digest + ".bin")


def _leer_origen(url, maximo):
    """Lee una URL de aion2data, con cache de un día y respaldo si falla."""
    if not url.startswith(ORIGEN + "/"):
        raise DatosError("datos_origen", 400)
    CACHE.mkdir(parents=True, exist_ok=True)
    ruta = _ruta_cache(url)
    ahora = time.time()
    fresco = ruta.is_file() and ahora - ruta.stat().st_mtime < TTL
    if fresco:
        return ruta.read_bytes()
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read(maximo + 1)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        if ruta.is_file():
            return ruta.read_bytes()
        raise DatosError("datos_origen", 502) from exc
    if len(data) > maximo:
        raise DatosError("datos_origen", 502)
    tmp = ruta.with_suffix(".tmp")
    tmp.write_bytes(data)
    tmp.replace(ruta)
    return data


def _lang(lang):
    lang = (lang or "es").lower()[:2]
    return lang if lang in LANGS_NOMBRE else "es"


def _tabla_nombres():
    global _NOMBRES
    if _NOMBRES is None:
        ruta = RAIZ / "data" / "nombres-cliente.json"
        try:
            _NOMBRES = json.loads(ruta.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            _NOMBRES = {}
        for clave in ("items", "npcs", "recipes", "stats"):
            _NOMBRES.setdefault(clave, {})
    return _NOMBRES


def _id_href(href):
    slug = (href or "").strip("/").split("/")[-1]
    num = slug.split("-", 1)[0]
    return num if num.isdigit() else ""


def _nombres_de(pref, href):
    """Todos los nombres oficiales (los 8 idiomas) de esa ficha, si existen."""
    tabla = _tabla_nombres()
    hid = _id_href(href)
    if pref == "items":
        return ((tabla["items"].get(hid) or {}).get("n") or {})
    if pref == "monsters":
        return tabla["npcs"].get(hid) or {}
    if pref == "recipes":
        prod = tabla["recipes"].get(hid)
        if not prod:
            return {}
        return ((tabla["items"].get(str(prod)) or {}).get("n") or {})
    return {}


def _sprite_de(pref, href, tiene_icono):
    if tiene_icono:
        return None
    tabla = _tabla_nombres()
    hid = _id_href(href)
    rec = None
    if pref == "items":
        rec = tabla["items"].get(hid)
    elif pref == "recipes":
        prod = tabla["recipes"].get(hid)
        rec = tabla["items"].get(str(prod)) if prod else None
    icono = (rec or {}).get("i")
    if isinstance(icono, list) and len(icono) == 3:
        return icono
    return None


def _indice_filas():
    global _indice
    with _lock:
        if _indice is not None:
            return _indice
        crudo = _leer_origen(ORIGEN + "/search.json", MAX_JSON)
        try:
            filas = json.loads(crudo.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise DatosError("datos_origen", 502) from exc
        if not isinstance(filas, list):
            raise DatosError("datos_origen", 502)
        out = []
        for row in filas:
            if not isinstance(row, dict):
                continue
            href = str(row.get("href") or "")
            pref = href.strip("/").split("/", 1)[0]
            if pref not in ("items", "skills", "monsters", "recipes", "quests"):
                continue
            label = str(row.get("label") or "")
            icon = str(row.get("icon") or "")
            if not icon.startswith("/game/"):
                icon = ""
            oficiales = _nombres_de(pref, href)
            extras = [v for v in oficiales.values() if v]
            blob = _norm(" ".join([label, str(row.get("words") or ""), str(row.get("sub") or "")] + extras))
            vistos = []
            for texto in [label] + extras:
                plano = _norm(texto)
                if plano and plano not in vistos:
                    vistos.append(plano)
            out.append({
                "label": label,
                "sub": str(row.get("sub") or ""),
                "href": href,
                "icon": icon,
                "sprite": _sprite_de(pref, href, bool(icon)),
                "rank": int(row.get("rank") or 0),
                "tipo": pref,
                "blob": blob,
                "label_n": vistos or [_norm(label)],
                "oficiales": oficiales,
            })
        _indice = out
        return out


def _etiqueta(row, lang):
    """Nombre en el idioma pedido. En recetas es el del objeto que fabrica."""
    oficiales = row.get("oficiales") or {}
    nombre = oficiales.get(lang) or oficiales.get("en") or row["label"]
    if row["tipo"] == "recipes" and oficiales:
        return nombre
    return nombre


def buscar(q, tipo, limite=24, lang="es"):
    tipo = tipo if tipo in TIPOS else "todo"
    lang = _lang(lang)
    qn = _norm(q)
    tokens = [t for t in qn.split() if len(t) >= 1]
    if len(qn) < 2:
        raise DatosError("datos_corto", 400)
    prefijos = set(TIPOS[tipo])
    limite = max(1, min(int(limite or 24), 30))
    hits = []
    for row in _indice_filas():
        if row["tipo"] not in prefijos:
            continue
        if not all(tok in row["blob"] for tok in tokens):
            continue
        score = row["rank"] * 10
        nombres = row["label_n"]
        if any(n.startswith(qn) for n in nombres):
            score += 120
        elif any(all(tok in n for tok in tokens) for n in nombres):
            score += 50
        hits.append((score, row))
    hits.sort(key=lambda par: (-par[0], _etiqueta(par[1], lang).lower()))
    resultados = []
    for _score, row in hits[:limite]:
        item = {
            "label": _etiqueta(row, lang),
            "label_en": row["label"],
            "sub": row["sub"],
            "href": row["href"],
            "icon": row["icon"],
            "tipo": row["tipo"],
        }
        if row.get("sprite"):
            item["sprite"] = row["sprite"]
        resultados.append(item)
    return {
        "q": q.strip(),
        "tipo": tipo,
        "lang": lang,
        "build": "2026.10.28",
        "fuente": ORIGEN + "/search.json",
        "resultados": resultados,
    }


_LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
_STAT = re.compile(r"^\[([^\]]+)\]\((https://aion2data.com/stats/[^)\s]+)\)\s*(.*?)\s*$")
_NUM_FIN = re.compile(r"([0-9][0-9,]*(?:\.[0-9]+)?%?)\s*$")
_SKILL = re.compile(
    r"^-\s+\[([^\]]+)\]\((https://aion2data.com/skills/[^)\s]+)\)\s+([0-9]+(?:\.[0-9]+)?%)\s+·\s+(\+\d+)\s*$"
)
_ADD = re.compile(r"^(.+?)\s+\+([0-9][0-9,]*(?:\.[0-9]+)?%?)$")
_SKIP = re.compile(r"faq|compared with|best |other versions|nearby", re.I)


def _celda(raw):
    raw = (raw or "").replace("**", "").strip()
    enlace = _LINK.search(raw)
    texto = _LINK.sub(r"\1", raw)
    texto = re.sub(r"\s+", " ", texto).strip()
    href = None
    if enlace and "aion2data.com" in enlace.group(2):
        path = enlace.group(2).split("aion2data.com", 1)[1]
        if path.startswith("/") and " " not in path:
            href = path.split("#", 1)[0]
    out = {"t": texto}
    if href:
        out["h"] = href
    return out


def _fila(line):
    inner = line.strip()
    if inner.startswith("|"):
        inner = inner[1:]
    if inner.endswith("|"):
        inner = inner[:-1]
    return [_celda(c) for c in inner.split("|")]


def _tablas(texto):
    lines = texto.splitlines()
    tablas = []
    i = 0
    while i < len(lines):
        sep = i + 1 < len(lines) and re.match(r"^\|\s*-+", lines[i + 1] or "")
        if lines[i].startswith("|") and sep:
            head = _fila(lines[i])
            i += 2
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(_fila(lines[i]))
                i += 1
                if len(rows) >= 40:
                    break
            tablas.append({"head": head, "rows": rows})
        else:
            i += 1
    return tablas


def _pct(texto):
    m = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*%", texto or "")
    return float(m.group(1)) if m else None


def _seccion_stats(cuerpo):
    stats = []
    for line in cuerpo.splitlines():
        m = _STAT.match(line.strip())
        if not m:
            continue
        resto = m.group(3)
        n = _NUM_FIN.search(resto)
        if not n:
            continue
        stats.append({
            "nombre": m.group(1),
            "href": m.group(2).split("aion2data.com", 1)[1],
            "valor": n.group(1),
            "mejor": "★" in resto or "best" in resto.lower(),
        })
    return stats


def _seccion_soul(tablas):
    for tabla in tablas:
        heads = [c["t"].lower() for c in tabla["head"]]
        if not heads or "chance" not in heads[-1]:
            continue
        if "stat" not in heads[0] and "stat" not in " ".join(heads):
            continue
        filas = []
        for row in tabla["rows"]:
            if len(row) < 5:
                continue
            filas.append({
                "nombre": row[0]["t"],
                "href": row[0].get("h") or "",
                "min": row[1]["t"],
                "max": row[2]["t"],
                "peso": row[3]["t"],
                "chance": row[4]["t"],
                "pct": _pct(row[4]["t"]),
            })
        if filas:
            return filas
    return []


def _seccion_drops(tablas):
    for tabla in tablas:
        heads = [c["t"].lower() for c in tabla["head"]]
        unido = " ".join(heads)
        if "chance" not in unido:
            continue
        if "clear" not in unido and "kill" not in unido:
            continue
        filas = []
        for row in tabla["rows"]:
            if len(row) < 2:
                continue
            chance = next((c["t"] for c in row if _pct(c["t"]) is not None), row[1]["t"])
            filas.append({
                "nombre": row[0]["t"],
                "href": row[0].get("h") or "",
                "chance": chance,
                "pct": _pct(chance),
                "resto": [c["t"] for c in row[1:] if c["t"] != chance],
            })
        if filas:
            return filas
    return []


def _seccion_skills(cuerpo):
    grupos = []
    actual = None
    for line in cuerpo.splitlines():
        m = re.match(r"^\*\*(.+)\*\*\s*$", line.strip())
        if m and "skill" in m.group(1).lower():
            actual = {"clase": m.group(1), "skills": []}
            grupos.append(actual)
            continue
        s = _SKILL.match(line.strip())
        if s and actual is not None:
            actual["skills"].append({
                "nombre": s.group(1),
                "href": s.group(2).split("aion2data.com", 1)[1],
                "chance": s.group(3),
                "pct": _pct(s.group(3)),
                "bonus": s.group(4),
            })
    return [g for g in grupos if g["skills"]]


def _seccion_adds(cuerpo):
    adds = []
    nivel = None
    grab = False
    for line in cuerpo.splitlines():
        bruto = line.strip()
        m = re.match(r"Adds at \+(\d+)", bruto)
        if m:
            grab = True
            nivel = int(m.group(1))
            continue
        if not grab or not bruto:
            continue
        if bruto.startswith(("#", "|", "**", "[", "-")):
            break
        a = _ADD.match(bruto)
        if not a:
            break
        adds.append({"stat": a.group(1).strip(), "delta": a.group(2), "en": nivel})
    return adds


def _lineas_utiles(cuerpo, maximo=6):
    out = []
    for line in cuerpo.splitlines():
        bruto = line.strip()
        if not bruto or bruto.startswith(("#", "|")) or bruto.startswith("**How"):
            continue
        if bruto.lower().startswith("how it's counted"):
            continue
        texto = _celda(bruto.lstrip("- ").strip()).get("t") or ""
        if len(texto) < 2:
            continue
        out.append(texto)
        if len(out) >= maximo:
            break
    return out


def parsear_ficha(md, href):
    md = md.replace("\r\n", "\n")
    if "\n---\n" in md:
        md = md.split("\n---\n", 1)[0]
    titulo = ""
    m = re.search(r"^#\s+(.+)$", md, re.M)
    if m:
        titulo = m.group(1).strip()
    fuente = ""
    mf = re.search(r"Source:\s+(https://aion2data.com/\S+)", md)
    if mf:
        fuente = mf.group(1)
    build = ""
    mb = re.search(r"game version (\d{4}\.\d{2}\.\d{2})", md)
    if mb:
        build = mb.group(1)
    lead = ""
    for line in md.splitlines():
        bruto = line.strip()
        if not bruto or bruto.startswith("#") or bruto.startswith("Source:"):
            continue
        if bruto == titulo:
            continue
        lead = _celda(bruto).get("t") or bruto
        if len(lead) > 40:
            break
        lead = ""
    lead = lead[:500]

    partes = re.split(r"\n(?=## )", md)
    stats, soul, drops, skills, adds = [], [], [], [], []
    como = []
    extra = []
    for parte in partes[1:]:
        linea = parte.splitlines()[0]
        nombre = re.sub(r"^##\s+", "", linea).strip()
        cuerpo = "\n".join(parte.splitlines()[1:])
        if _SKIP.search(nombre):
            continue
        bajo = nombre.lower()
        tablas = _tablas(cuerpo)
        if bajo.startswith("fixed stats") and not stats:
            stats = _seccion_stats(cuerpo)
        elif bajo.startswith("skill effect") and not skills:
            skills = _seccion_skills(cuerpo)
        elif "soul binding" in bajo and not soul:
            soul = _seccion_soul(tablas)
        elif not drops and ("from dungeon" in bajo or "drop" in bajo):
            drops = _seccion_drops(tablas) or drops
        elif bajo.startswith("enhance") and not adds:
            adds = _seccion_adds(cuerpo)
        elif bajo.startswith("how to get") and not como:
            como = _lineas_utiles(cuerpo)
        elif tablas and len(extra) < 4:
            extra.append({
                "titulo": nombre,
                "head": [c["t"] for c in tablas[0]["head"]],
                "rows": [[{"t": c["t"], "h": c.get("h") or ""} for c in row] for row in tablas[0]["rows"][:16]],
            })
        if not drops:
            halladas = _seccion_drops(tablas)
            if halladas:
                drops = halladas
    return {
        "href": href,
        "titulo": titulo,
        "lead": lead,
        "fuente": fuente or (ORIGEN + href),
        "build": build or "2026.10.28",
        "stats": stats,
        "soul": soul,
        "skills": skills,
        "drops": drops,
        "adds": adds,
        "como": como,
        "extra": extra,
    }


def _stat_local(nombre, lang):
    tabla = _tabla_nombres()["stats"].get(nombre) or {}
    return tabla.get(lang) or tabla.get("en") or nombre


def _L(lang, es, fr, de, pt, ru, ko, ja, en):
    return {"es": es, "fr": fr, "de": de, "pt": pt, "ru": ru, "ko": ko, "ja": ja, "en": en}[lang]


# Frases fijas del Markdown en inglés. Las largas van primero.
_PIEZAS = [
    ("Material and where to get it", lambda lang: _L(
        lang, "Material y de dónde sale", "Matériau et où l'obtenir", "Material und Herkunft",
        "Material e onde obter", "Материал и где взять", "재료와 얻는 곳", "素材と入手先",
        "Material and where to get it")),
    ("Success chance by proficiency gap", lambda lang: _L(
        lang, "Probabilidad según la diferencia de oficio", "Chance selon l'écart de maîtrise",
        "Chance nach Fertigkeitsabstand", "Chance pela diferença de perícia",
        "Шанс по разрыву мастерства", "숙련 차이에 따른 확률", "熟練差ごとの成功率",
        "Success chance by proficiency gap")),
    ("Where to get the materials", lambda lang: _L(
        lang, "De dónde salen los materiales", "D'où viennent les matériaux",
        "Woher die Materialien kommen", "De onde vêm os materiais",
        "Откуда берутся материалы", "재료를 얻는 곳", "素材の入手先",
        "Where to get the materials")),
    ("How to get", lambda lang: _L(
        lang, "Cómo se consigue", "Comment l'obtenir", "So bekommt man es",
        "Como obter", "Как получить", "획득 방법", "入手方法", "How to get")),
    ("How many", lambda lang: _L(
        lang, "Cuántos", "Combien", "Wie viele", "Quantos", "Сколько", "수량", "個数", "How many")),
    ("Units per craft", lambda lang: _L(
        lang, "Unidades por crafteo", "Unités par craft", "Einheiten pro Herstellung",
        "Unidades por craft", "Штук за крафт", "제작당 개수", "製作あたり", "Units per craft")),
    ("Handicraft Merchant", lambda lang: _L(
        lang, "Mercader de artesanía", "Marchand d'artisanat", "Handwerkshändler",
        "Mercador de artesanato", "Торговец рукоделием", "수공예 상인", "手工芸商人",
        "Handicraft Merchant")),
    ("Alchemy Merchant", lambda lang: _L(
        lang, "Mercader de alquimia", "Marchand d'alchimie", "Alchemiehändler",
        "Mercador de alquimia", "Алхимик-торговец", "연금 상인", "錬金商人", "Alchemy Merchant")),
    ("Cooking Merchant", lambda lang: _L(
        lang, "Mercader de cocina", "Marchand de cuisine", "Kochhändler",
        "Mercador de culinária", "Торговец едой", "요리 상인", "料理商人", "Cooking Merchant")),
    ("Blacksmith Merchant", lambda lang: _L(
        lang, "Herrero", "Marchand forgeron", "Schmiedehändler",
        "Ferreiro", "Кузнец", "대장 상인", "鍛冶商人", "Blacksmith Merchant")),
    ("Armorsmith Merchant", lambda lang: _L(
        lang, "Mercader de armería", "Marchand d'armures", "Rüstungshändler",
        "Mercador de armaduras", "Торговец доспехами", "방어구 상인", "防具商人",
        "Armorsmith Merchant")),
    ("General Merchant", lambda lang: _L(
        lang, "Mercader general", "Marchand général", "Allgemeiner Händler",
        "Mercador geral", "Общий торговец", "잡화 상인", "雑貨商人", "General Merchant")),
    ("Weapon Merchant", lambda lang: _L(
        lang, "Mercader de armas", "Marchand d'armes", "Waffenhändler",
        "Mercador de armas", "Торговец оружием", "무기 상인", "武器商人", "Weapon Merchant")),
    ("Gathered:", lambda lang: _L(
        lang, "Recolección:", "Récolte :", "Gesammelt:", "Coleta:", "Сбор:", "채집:", "採集:", "Gathered:")),
    ("Drops:", lambda lang: _L(
        lang, "Cae de:", "Tombe de :", "Drop:", "Dropa:", "Падает:", "드랍:", "ドロップ:", "Drops:")),
    ("Dungeon:", lambda lang: _L(
        lang, "Mazmorra:", "Donjon :", "Dungeon:", "Masmorra:", "Подземелье:", "던전:", "ダンジョン:", "Dungeon:")),
    ("per kill", lambda lang: _L(
        lang, "por muerte", "par mort", "pro Tötung", "por morte", "за убийство", "처치당", "討伐ごと", "per kill")),
    ("Sold by:", lambda lang: _L(
        lang, "Lo vende:", "Vendu par :", "Verkauft von:", "Vendido por:", "Продаёт:", "판매:", "販売:", "Sold by:")),
    ("Quests:", lambda lang: _L(
        lang, "Misiones:", "Quêtes :", "Quests:", "Missões:", "Задания:", "퀘스트:", "クエスト:", "Quests:")),
    ("per clear", lambda lang: _L(
        lang, "por vez", "par passage", "pro Lauf", "por vez", "за заход", "1회당", "1回あたり", "per clear")),
    ("a week", lambda lang: _L(
        lang, "a la semana", "par semaine", "pro Woche", "por semana", "в неделю", "주당", "週", "a week")),
    ("Handicrafting", lambda lang: _L(
        lang, "Artesanía", "Artisanat", "Handwerk", "Artesanato", "Рукоделие", "수공예", "手工芸", "Handicrafting")),
    ("Armorsmithing", lambda lang: _L(
        lang, "Armería", "Armurerie", "Rüstungsschmiede", "Armaria", "Доспехи", "방어구 제작", "防具製作", "Armorsmithing")),
    ("Blacksmithing", lambda lang: _L(
        lang, "Herrería", "Forge", "Schmiede", "Ferraria", "Кузнечное дело", "대장간", "鍛冶", "Blacksmithing")),
    ("Alchemy", lambda lang: _L(
        lang, "Alquimia", "Alchimie", "Alchemie", "Alquimia", "Алхимия", "연금술", "錬金", "Alchemy")),
    ("Cooking", lambda lang: _L(
        lang, "Cocina", "Cuisine", "Kochen", "Culinária", "Кулинария", "요리", "料理", "Cooking")),
]
_EXACTOS = {
    "Needed": lambda lang: _L(lang, "Hace falta", "Il faut", "Benötigt", "Precisa", "Нужно", "필요", "必要", "Needed"),
    "Success": lambda lang: _L(lang, "Éxito", "Réussite", "Erfolg", "Sucesso", "Успех", "성공", "成功", "Success"),
    "Gap": lambda lang: _L(lang, "Diferencia", "Écart", "Abstand", "Diferença", "Разрыв", "차이", "差", "Gap"),
    "Material": lambda lang: _L(lang, "Material", "Matériau", "Material", "Material", "Материал", "재료", "素材", "Material"),
    "Makes": lambda lang: _L(lang, "Fabrica", "Fabrique", "Stellt her", "Faz", "Создаёт", "제작", "製作", "Makes"),
    "Crafts": lambda lang: _L(lang, "Crafteos", "Crafts", "Herstellungen", "Crafts", "Крафты", "제작", "製作", "Crafts"),
    "Normal": lambda lang: _L(lang, "Normal", "Normal", "Normal", "Normal", "Обычный", "일반", "ノーマル", "Normal"),
    "Hard": lambda lang: _L(lang, "Difícil", "Difficile", "Schwer", "Difícil", "Сложный", "어려움", "ハード", "Hard"),
}
_NODOS = {
    "Ruby": lambda lang: _L(lang, "Rubí", "Rubis", "Rubin", "Rubi", "Рубин", "루비", "ルビー", "Ruby"),
}
_CLASES_TXT = {
    "Gladiator": ("Gladiador", "Gladiateur", "Gladiator", "Gladiador", "Гладиатор", "검성", "ソードウイング", "Gladiator"),
    "Templar": ("Templario", "Templier", "Templer", "Templário", "Страж", "수호성", "シールドウイング", "Templar"),
    "Assassin": ("Asesino", "Assassin", "Assassine", "Assassino", "Убийца", "살성", "シャドウウイング", "Assassin"),
    "Ranger": ("Arquero", "Ranger", "Jäger", "Arqueiro", "Стрелок", "궁성", "ボウウイング", "Ranger"),
    "Sorcerer": ("Hechicero", "Sorcier", "Zauberer", "Feiticeiro", "Волшебник", "마도성", "スペルウイング", "Sorcerer"),
    "Spiritmaster": ("Espiritualista", "Spiritualiste", "Beschwörer", "Invocador", "Заклинатель", "정령성", "スピリットウイング", "Spiritmaster"),
    "Cleric": ("Clérigo", "Clerc", "Kleriker", "Clérigo", "Целитель", "치유성", "キュアウイング", "Cleric"),
    "Chanter": ("Cantor", "Chanter", "Kantor", "Cantor", "Чародей", "호법성", "チャントウイング", "Chanter"),
    "Shared": ("Común", "Commune", "Gemeinsam", "Comum", "Общий", "공용", "共通", "Shared"),
    "Brawler": ("Luchador", "Bagarreur", "Faustkämpfer", "Lutador", "Кулачник", "권투사", "ナックル", "Brawler"),
}
_HAB = ("habilidades", "compétences", "Fertigkeiten", "habilidades", "умений", "스킬", "スキル", "skills")
_IDX_EN = None


def _idx_en():
    global _IDX_EN
    if _IDX_EN is None:
        idx = {}
        for rec in _tabla_nombres()["items"].values():
            nombres = rec.get("n") or {}
            en = nombres.get("en")
            if en and en not in idx:
                idx[en] = nombres
        _IDX_EN = idx
    return _IDX_EN


def _nombre_texto(texto, lang):
    limpio = re.sub(r"\s+[×x]\s*\d+\s*$", "", (texto or "").strip(), flags=re.I)
    nombres = _idx_en().get(limpio)
    if not nombres:
        return texto
    return nombres.get(lang) or nombres.get("en") or texto


def _frases(texto, lang):
    if not texto or lang == "en":
        return texto
    if texto.strip() in _EXACTOS:
        return _EXACTOS[texto.strip()](lang)
    for ingles, trad in _PIEZAS:
        if ingles in texto:
            texto = texto.replace(ingles, trad(lang))
    for nodo, trad in _NODOS.items():
        texto = re.sub(r"\b" + re.escape(nodo) + r"\b", trad(lang), texto)
    for palabra in ("Normal", "Hard"):
        texto = re.sub(r"\b" + palabra + r"\b", _EXACTOS[palabra](lang), texto)
    texto = re.sub(
        r"\(\+(\d+) more\)",
        lambda m: _L(
            lang,
            f"(+{m.group(1)} más)",
            f"(+{m.group(1)} de plus)",
            f"(+{m.group(1)} mehr)",
            f"(+{m.group(1)} a mais)",
            f"(ещё {m.group(1)})",
            f"(+{m.group(1)}개 더)",
            f"(ほか{m.group(1)})",
            f"(+{m.group(1)} more)",
        ),
        texto,
    )
    return texto


def _titulo_tabla(titulo, lang):
    if lang == "en":
        return titulo
    m = re.match(r"All materials for (.+): the full shopping list$", titulo, re.I)
    if m:
        nombre = _nombre_texto(m.group(1).strip(), lang)
        return _L(
            lang,
            f"Todos los materiales de {nombre}",
            f"Tous les matériaux de {nombre}",
            f"Alle Materialien für {nombre}",
            f"Todos os materiais de {nombre}",
            f"Все материалы для {nombre}",
            f"{nombre} 재료 전부",
            f"{nombre}の素材一覧",
            titulo,
        )
    m = re.match(r"Other ways to craft (.+)$", titulo, re.I)
    if m:
        nombre = _nombre_texto(m.group(1).strip(), lang)
        return _L(
            lang,
            f"Otras formas de fabricar {nombre}",
            f"Autres façons de fabriquer {nombre}",
            f"Andere Wege, {nombre} herzustellen",
            f"Outras formas de fabricar {nombre}",
            f"Другие способы создать {nombre}",
            f"{nombre}의 다른 제작법",
            f"{nombre}の別レシピ",
            titulo,
        )
    fijo = _frases(titulo, lang)
    return fijo


def _texto_celda(celda, lang):
    texto = celda["t"] if isinstance(celda, dict) else str(celda)
    if lang == "en":
        return texto
    href = (celda.get("h") or "") if isinstance(celda, dict) else ""
    if "aion2data.com" in href:
        href = href.split("aion2data.com", 1)[1]
    if href.startswith("/items/"):
        nombres = (_tabla_nombres()["items"].get(_id_href(href)) or {}).get("n") or {}
        en = nombres.get("en") or ""
        loc = nombres.get(lang) or en
        if en and texto.lower().startswith(en.lower()):
            resto = texto[len(en):].strip(" ·")
            resto = _frases(resto, lang)
            return (loc + (" · " + resto if resto else "")).strip()
    return _frases(texto, lang)


def _clase_grupo(texto, lang):
    m = re.match(r"^(.+?) · (\d+) skills\b", texto or "")
    if not m or lang == "en":
        return texto
    fila = _CLASES_TXT.get(m.group(1))
    if not fila:
        return _frases(texto, lang)
    clase = _L(lang, *fila)
    hab = _L(lang, *_HAB)
    return f"{clase} · {m.group(2)} {hab}"


def _localizar_extra(ficha_d, lang):
    for ex in ficha_d.get("extra") or []:
        ex["titulo"] = _titulo_tabla(ex.get("titulo") or "", lang)
        ex["head"] = [_frases(h, lang) for h in ex.get("head") or []]
        filas = []
        for row in ex.get("rows") or []:
            if row and isinstance(row[0], dict):
                filas.append([_texto_celda(c, lang) for c in row])
            else:
                filas.append([_frases(c, lang) for c in row])
        ex["rows"] = filas
    ficha_d["como"] = [_frases(l, lang) for l in ficha_d.get("como") or []]
    for drop in ficha_d.get("drops") or []:
        drop["nombre"] = _frases(drop.get("nombre") or "", lang)
    for grupo in ficha_d.get("skills") or []:
        grupo["clase"] = _clase_grupo(grupo.get("clase") or "", lang)


def _equipo_huecos():
    """Huecos del cliente: manastone, theostone, propiedades de vínculo y si hay Sync."""
    global _EQUIPO_HUECO
    if _EQUIPO_HUECO is not None:
        return _EQUIPO_HUECO
    mapa = {}
    carpeta = RAIZ / "data" / "equipo"
    for ruta in sorted(carpeta.glob("*.json")):
        if ruta.name in ("piedras.json", "indice.json"):
            continue
        try:
            filas = json.loads(ruta.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if not isinstance(filas, list):
            continue
        for row in filas:
            if not isinstance(row, dict):
                continue
            pid = str(row.get("id") or "")
            if not pid.isdigit():
                continue

            def _n(clave, fila=row):
                valor = fila.get(clave)
                return valor if isinstance(valor, int) else None

            mapa[pid] = {
                "mana": _n("ms"),
                "teo": _n("gs"),
                "propiedades": _n("ns"),
                "sync": bool(row.get("sa")),
                "conocido": True,
            }
    _EQUIPO_HUECO = mapa
    return mapa


def _huecos_texto(md):
    mana = re.search(r"\*{0,2}Manastone slots\*{0,2}\s*:?\s*(\d+)", md or "", re.I)
    teo = re.search(r"\*{0,2}Theostone slots\*{0,2}\s*:?\s*(\d+)", md or "", re.I)
    prop = re.search(r"Soul binding:\s*(\d+)\s+properties from\s+(\d+)", md or "", re.I)
    return {
        "mana": int(mana.group(1)) if mana else None,
        "teo": int(teo.group(1)) if teo else None,
        "propiedades": int(prop.group(1)) if prop else None,
        "lista": int(prop.group(2)) if prop else None,
    }


def _huecos_de(href, md):
    local = _equipo_huecos().get(_id_href(href)) or {}
    texto = _huecos_texto(md)

    def elige(clave):
        if clave in local and local.get(clave) is not None:
            return local.get(clave)
        return texto.get(clave)

    return {
        "mana": elige("mana"),
        "teo": elige("teo"),
        "propiedades": elige("propiedades"),
        "lista": texto.get("lista"),
        "sync": local.get("sync") if local.get("conocido") else None,
    }


def ficha(href, lang="es"):
    href = (href or "").strip()
    lang = _lang(lang)
    if not HREF_OK.match(href):
        raise DatosError("datos_href", 400)
    crudo = _leer_origen(ORIGEN + "/md" + href, MAX_MD)
    try:
        md = crudo.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise DatosError("datos_origen", 502) from exc
    if "answered 404" in md[:180]:
        raise DatosError("datos_href", 404)
    ficha_d = parsear_ficha(md, href)
    ficha_d["huecos"] = _huecos_de(href, md)
    pref = href.strip("/").split("/", 1)[0]
    oficiales = _nombres_de(pref, href)
    ficha_d["titulo_en"] = ficha_d.get("titulo") or ""
    local = oficiales.get(lang) or oficiales.get("en")
    if local:
        ficha_d["titulo"] = local
    if lang != "en":
        ficha_d["lead"] = ""
    for stat in ficha_d.get("stats") or []:
        stat["nombre"] = _stat_local(stat.get("nombre") or "", lang)
    for stat in ficha_d.get("soul") or []:
        stat["nombre"] = _stat_local(stat.get("nombre") or "", lang)
    for alta in ficha_d.get("adds") or []:
        alta["stat"] = _stat_local(alta.get("stat") or "", lang)
    _localizar_extra(ficha_d, lang)
    sprite = _sprite_de(pref, href, False)
    if sprite and pref in ("items", "recipes"):
        ficha_d["sprite"] = sprite
    return ficha_d


def _calc(ruta):
    crudo = _leer_origen(ORIGEN + ruta, 200_000)
    try:
        data = json.loads(crudo.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise DatosError("datos_origen", 502) from exc
    if not isinstance(data, dict):
        raise DatosError("datos_origen", 502)
    return data


def _item_param(item):
    item = (item or "").strip()
    if not ITEM_OK.match(item):
        raise DatosError("datos_item", 400)
    return item


def _respuesta_receta(n, item, lineas, lang):
    if lang == "en":
        return ""
    nombre = _nombre_texto(item, lang)
    mats = ", ".join(f"{ln['qty']} × {ln['nombre']}" for ln in lineas)
    return _L(
        lang,
        f"Para {n} × {nombre}: {mats}. Si cada crafteo sale bien.",
        f"Pour {n} × {nombre} : {mats}. Si chaque craft réussit.",
        f"Für {n} × {nombre}: {mats}. Wenn jede Herstellung gelingt.",
        f"Para {n} × {nombre}: {mats}. Se cada craft der certo.",
        f"Для {n} × {nombre}: {mats}. Если каждый крафт успешен.",
        f"{nombre} {n}개: {mats}. 제작이 모두 성공할 때.",
        f"{nombre}を{n}個: {mats}。すべての製作が成功した場合。",
        "",
    )


def _indice_por_nombre():
    """Nombre inglés normalizado → fila de objeto, para ponerle icono a los materiales."""
    global _por_nombre
    if _por_nombre is not None:
        return _por_nombre
    mapa = {}
    for row in _indice_filas():
        if row["tipo"] != "items":
            continue
        mapa.setdefault(_norm(row["label"]), row)
    _por_nombre = mapa
    return mapa


def _icono_nombre(nombre_en):
    row = _indice_por_nombre().get(_norm(nombre_en))
    if not row:
        return "", None
    return row.get("icon") or "", row.get("sprite")


def receta(item, n, lang="es"):
    item = _item_param(item)
    lang = _lang(lang)
    try:
        n = int(n)
    except (TypeError, ValueError):
        n = 1
    n = max(1, min(n, 99))
    q = urllib.parse.urlencode({"item": item, "n": n, "format": "json"})
    data = _calc("/calc/recipes?" + q)
    if not data.get("ok"):
        raise DatosError("datos_receta", 404)
    base = (data.get("data") or {}).get("base") or {}
    como = {}
    tablas = data.get("tables") or []
    if tablas and tablas[0].get("rows"):
        for row in tablas[0]["rows"]:
            if row and len(row) >= 3:
                como[str(row[0])] = str(row[2])
    lineas = []
    for en, qty in base.items():
        icono, sprite = _icono_nombre(en)
        fila = {
            "clave": en,
            "nombre": _nombre_texto(en, lang) if lang != "en" else en,
            "qty": qty,
            "como": _frases(como.get(en, ""), lang),
            "icon": icono,
        }
        if sprite:
            fila["sprite"] = sprite
        lineas.append(fila)
    hace = []
    if len(tablas) > 1 and tablas[1].get("rows"):
        for row in tablas[1]["rows"]:
            if not row or len(row) < 3:
                continue
            nombre_en = str(row[0])
            icono_h, sprite_h = _icono_nombre(nombre_en)
            hecho = {
                "nombre": _nombre_texto(nombre_en, lang) if lang != "en" else nombre_en,
                "crafts": row[1],
                "uds": row[2],
            }
            if icono_h:
                hecho["icon"] = icono_h
            if sprite_h:
                hecho["sprite"] = sprite_h
            hace.append(hecho)
    respuesta = data.get("answer") or ""
    if lang != "en":
        respuesta = _respuesta_receta(n, item, lineas, lang)
    return {
        "build": data.get("build") or "",
        "titulo": _nombre_texto(data.get("title") or "", lang) if lang != "en" else (data.get("title") or ""),
        "respuesta": respuesta,
        "notas": [],
        "open": data.get("open") or "",
        "tablas": [],
        "base": base,
        "lineas": lineas,
        "hace": hace,
        "fee": (data.get("data") or {}).get("fee"),
        "crafts": (data.get("data") or {}).get("crafts"),
        "n": n,
        "fuente": ORIGEN + (data.get("open") or ("/calc/recipes?" + q)),
    }


def _pct_celda(texto):
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", str(texto or ""))
    if not m:
        return 0.0
    return float(m.group(1)) / 100.0


def _coste_intento(texto):
    m = re.search(
        r"([\d,]+)\s+Kinah(?:\s*\+\s*([\d,]+)\s+(.+))?$",
        str(texto or "").strip(),
    )
    if not m:
        return 0, 0, ""
    kinah = int(m.group(1).replace(",", ""))
    piedras = int(m.group(2).replace(",", "")) if m.group(2) else 0
    nombre = (m.group(3) or "").strip()
    return kinah, piedras, nombre


def _pasos_mejora(tablas):
    """Cada paso de la tabla del cliente: probabilidad, pity y coste por intento."""
    for tabla in tablas or []:
        head = " ".join(str(h).lower() for h in (tabla.get("head") or []))
        if "chance" not in head and "step" not in head:
            continue
        pasos = []
        for row in tabla.get("rows") or []:
            if len(row) < 6:
                continue
            salto = re.match(r"\+(\d+)\s*→\s*\+(\d+)", str(row[0]))
            if not salto:
                continue
            kinah, piedras, piedra = _coste_intento(row[5])
            baja = bool(re.search(r"drop|baja|down", str(row[3]), re.I))
            pasos.append({
                "from": int(salto.group(1)),
                "to": int(salto.group(2)),
                "rate": _pct_celda(row[1]),
                "pity": _pct_celda(row[2]),
                "baja": baja,
                "kinah": kinah,
                "piedras": piedras,
                "piedra": piedra,
            })
        if pasos:
            return pasos
    return []


_SLOT_MR = {
    "top": "torso", "legs": "pants", "pauldrons": "shoulder", "gloves": "gloves",
    "shoes": "boots", "helm": "helmet", "cloak": "cape", "longsword": "sword",
    "greatsword": "greatsword", "dagger": "dagger", "bow": "bow", "spellbook": "magicbook",
    "orb": "orb", "mace": "mace", "guard": "guarder", "staff": "staff",
    "earrings": "earring", "ring": "ring", "necklace": "necklace",
    "bracelet": "bracelet", "amulet": "amulet", "belt": "belt", "rune": "rune",
    "fist": "gauntlet",
}
_MR = "https://metaroad.gg"


def _leer_mr(ruta, maximo):
    if not ruta.startswith("/aion2/"):
        raise DatosError("datos_origen", 400)
    return _leer_origen_url(_MR + ruta, maximo)


def _leer_origen_url(url, maximo):
    """Cache de un día para una URL concreta ya validada."""
    CACHE.mkdir(parents=True, exist_ok=True)
    ruta = _ruta_cache(url)
    ahora = time.time()
    if ruta.is_file() and ahora - ruta.stat().st_mtime < TTL:
        return ruta.read_bytes()
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = resp.read(maximo + 1)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        if ruta.is_file():
            return ruta.read_bytes()
        raise DatosError("datos_origen", 502) from exc
    if len(data) > maximo:
        raise DatosError("datos_origen", 502)
    ruta.write_bytes(data)
    return data


def _texto_plano(fragmento):
    texto = fragmento.replace("<!-- -->", "")
    texto = re.sub(r"<[^>]+>", "", texto)
    return html_lib.unescape(re.sub(r"\s+", " ", texto)).strip()


def _tabla_bono(html):
    """Curva acumulada de la ficha: cada + y lo que suma de verdad."""
    inicio = html.find("Enchant")
    if inicio < 0:
        return "", []
    fin = html.find("</table>", inicio)
    trozo = html[inicio:fin if fin > 0 else inicio + 12000]
    grupo = ""
    gm = re.search(r"((?:Weapon|Armor)_[A-Za-z0-9_]+)", trozo)
    if gm:
        grupo = gm.group(1)
    cabezas = [_texto_plano(h) for h in re.findall(r"<th[^>]*>(.*?)</th>", trozo, re.S)]
    niveles = []
    for fila in re.findall(r"<tr[^>]*>(.*?)</tr>", trozo, re.S):
        celdas = [_texto_plano(c) for c in re.findall(r"<td[^>]*>(.*?)</td>", fila, re.S)]
        if len(celdas) < 2:
            continue
        nv = re.match(r"\+(\d+)$", celdas[0])
        if not nv:
            continue
        valores = {}
        for i, nombre in enumerate(cabezas[1:], start=1):
            if i >= len(celdas) or not nombre or nombre.lower() == "level":
                continue
            num = re.search(r"\+?([\d,]+)", celdas[i])
            if num:
                valores[nombre] = int(num.group(1).replace(",", ""))
        if valores:
            niveles.append({"n": int(nv.group(1)), "valores": valores})
    return grupo, niveles


def _ficha_equipo(href):
    crudo = _leer_origen(ORIGEN + "/md" + href, MAX_MD)
    md = crudo.decode("utf-8")
    titulo = ""
    hm = re.search(r"^#\s+(.+)$", md, re.M)
    if hm:
        titulo = hm.group(1).strip()
    ilvl = 0
    im = re.search(r"^Item level (\d+)\s*$", md, re.M)
    if im:
        ilvl = int(im.group(1))
    slot = ""
    sm = re.search(
        r"^([A-Za-z][A-Za-z ]*?) · (?:Unique|Epic|Rare|Common|Heroic|Legendary)\s*$",
        md,
        re.M,
    )
    if sm:
        slot = _SLOT_MR.get(sm.group(1).strip().lower(), "")
    bono_nv = 0
    bm = re.search(r"item level \+(\d+)", md, re.I)
    if bm:
        bono_nv = int(bm.group(1))
    bases = {}
    for linea in md.splitlines():
        sm = re.match(r"^([A-Za-z][A-Za-z ]+?)\s+([\d,]+)\s*$", linea.strip())
        if sm:
            bases[sm.group(1)] = int(sm.group(2).replace(",", ""))
    return titulo, ilvl, slot, bono_nv, bases


def bonos_mejora(href, lang="es"):
    """Bonus acumulado de cada + según la tabla del cliente para el grupo de esa pieza."""
    href = (href or "").strip()
    lang = _lang(lang)
    if not HREF_OK.match(href) or not href.startswith("/items/"):
        raise DatosError("datos_href", 400)
    titulo, ilvl, slot, bono_nv, bases = _ficha_equipo(href)
    if not slot or not titulo:
        return {"grupo": "", "stats": []}
    indice = _indice_mr(slot)
    clave = _norm(titulo)
    candidatos = [x for x in indice if _norm(x["name"]) == clave]
    if ilvl:
        mismos = [x for x in candidatos if x["ilvl"] == ilvl]
        if mismos:
            candidatos = mismos
    if not candidatos:
        return {"grupo": "", "stats": []}
    html = _leer_mr(candidatos[0]["href"], 900_000).decode("utf-8", "replace")
    grupo, niveles = _tabla_bono(html)
    if not niveles:
        return {"grupo": grupo, "stats": []}
    columnas = []
    for nv in niveles:
        for nombre in nv["valores"]:
            if nombre not in columnas:
                columnas.append(nombre)
    stats = []
    for nombre in columnas:
        por = {str(nv["n"]): nv["valores"][nombre] for nv in niveles if nombre in nv["valores"]}
        if not por:
            continue
        stats.append({
            "nombre": _stat_local(nombre, lang),
            "base": bases.get(nombre),
            "por_nivel": por,
        })
    tope = max(nv["n"] for nv in niveles)
    if bono_nv and bono_nv == tope and ilvl:
        por_nv = {str(n): n for n in range(1, tope + 1)}
        stats.append({
            "nombre": _stat_local("Item Level", lang) if _stat_local("Item Level", lang) != "Item Level" else _L(
                lang, "Nivel de objeto", "Niveau d'objet", "Gegenstandsstufe",
                "Nível do item", "Уровень предмета", "아이템 레벨", "アイテムレベル", "Item level"),
            "base": ilvl,
            "por_nivel": por_nv,
        })
    return {"grupo": grupo, "stats": stats}


def _indice_mr(slot):
    html = _leer_mr(f"/aion2/database/items/{slot}", 1_200_000).decode("utf-8", "replace")
    vistos = []
    for href, inner in re.findall(
        rf'href="(/aion2/database/items/{re.escape(slot)}/[^"]+)"[^>]*>(.*?)</a>',
        html,
        re.S,
    ):
        texto = _texto_plano(inner)
        m = re.match(r"(.+?)Lv\s+(\d+)", texto)
        if not m:
            continue
        vistos.append({"name": m.group(1).strip(), "ilvl": int(m.group(2)), "href": href})
    return vistos


def mejora(item, desde, hasta, lang="es"):
    item = _item_param(item)
    lang = _lang(lang)
    try:
        desde = int(desde)
        hasta = int(hasta)
    except (TypeError, ValueError):
        raise DatosError("datos_rango", 400)
    if not (0 <= desde < hasta <= 25):
        raise DatosError("datos_rango", 400)
    q = urllib.parse.urlencode({"item": item, "from": desde, "to": hasta, "format": "json"})
    data = _calc("/calc/tools/enchant?" + q)
    if not data.get("ok"):
        raise DatosError("datos_mejora", 404)
    bruto = data.get("data") or {}
    return {
        "build": data.get("build") or "",
        "titulo": data.get("title") or "",
        "respuesta": (data.get("answer") or "") if lang == "en" else "",
        "notas": data.get("notes") or [],
        "open": data.get("open") or "",
        "tablas": data.get("tables") or [],
        "intentos": bruto.get("tries"),
        "kinah": bruto.get("kinah"),
        "materiales": bruto.get("materials") or {},
        "desde": desde,
        "hasta": hasta,
        "pasos": _pasos_mejora(data.get("tables") or []),
        "fuente": ORIGEN + (data.get("open") or ""),
    }


def parsear_cubos(md):
    md = md.replace("\r\n", "\n")
    if "\n---\n" in md:
        md = md.split("\n---\n", 1)[0]
    build = ""
    mb = re.search(r"game version (\d{4}\.\d{2}\.\d{2})", md)
    if mb:
        build = mb.group(1)
    filas = []
    for tabla in _tablas(md):
        heads = [c["t"].lower() for c in tabla["head"]]
        if len(heads) < 7 or "dungeon" not in heads[0] or "mode" not in heads[1]:
            continue
        for row in tabla["rows"]:
            if len(row) < 7:
                continue
            filas.append({
                "dungeon": row[0]["t"],
                "href": row[0].get("h") or "",
                "modo": row[1]["t"],
                "energia": row[2]["t"],
                "cubos": row[3]["t"],
                "dias": row[4]["t"],
                "dias_lleno": row[5]["t"],
                "premio": row[6]["t"] if len(row) > 6 else "",
                "kinah": row[7]["t"] if len(row) > 7 else "",
            })
    return {
        "build": build or "2026.10.28",
        "fuente": ORIGEN + "/odyle-energy",
        "modos": filas,
    }


CDN_GT = "https://cdn-hosted.gaming.tools/aion2"
CACHE_GT = RAIZ / "cache" / "gaming-tools"
RIDE_OK = re.compile(r"^ride-V_[A-Za-z0-9_]+$")
GLB_OK = re.compile(r"^/models/[A-Za-z0-9_./-]+\.glb$")
PNG_OK = re.compile(r"^/images/materials/[a-f0-9]+\.png$")
MAX_GLB = 20_000_000


def _leer_gt(url, maximo):
    """Un archivo del visor de aion2.gaming.tools. Cache de un día, sin versionar."""
    if not url.startswith(CDN_GT + "/"):
        raise DatosError("datos_origen", 400)
    CACHE_GT.mkdir(parents=True, exist_ok=True)
    ruta = CACHE_GT / (hashlib.sha256(url.encode("utf-8")).hexdigest()[:24] + ".bin")
    ahora = time.time()
    if ruta.is_file() and ahora - ruta.stat().st_mtime < TTL:
        return ruta.read_bytes()
    try:
        from curl_cffi import requests as creq
    except ImportError as exc:
        raise DatosError("datos_origen", 502) from exc
    try:
        resp = creq.get(
            url,
            impersonate="chrome",
            timeout=25,
            allow_redirects=False,
            headers={"Referer": "https://aion2.gaming.tools/", "Accept": "*/*"},
        )
    except OSError as exc:
        if ruta.is_file():
            return ruta.read_bytes()
        raise DatosError("datos_origen", 502) from exc
    if resp.status_code != 200 or len(resp.content) > maximo:
        if ruta.is_file():
            return ruta.read_bytes()
        raise DatosError("datos_origen", 502)
    ruta.write_bytes(resp.content)
    return resp.content


def _valor_gt(meta, indice):
    if isinstance(indice, int) and 0 <= indice < len(meta):
        return meta[indice]
    return indice


def _colores_gt(meta):
    """Nombre de material → PNG de color. El GLB llega sin la textura."""
    out = {}
    for item in meta:
        if not isinstance(item, dict) or "path" not in item:
            continue
        tipo = _valor_gt(meta, item.get("type"))
        ruta = _valor_gt(meta, item.get("path"))
        slot = _valor_gt(meta, item.get("slot"))
        if tipo == "Color" and isinstance(ruta, str) and PNG_OK.fullmatch(ruta):
            out[slot if isinstance(slot, str) else ""] = ruta
    return out


def _incrustar_color(glb, pngs):
    """pngs: nombre de material → bytes PNG. Devuelve un GLB con el color dentro."""
    import struct
    if not pngs or not glb.startswith(b"glTF"):
        return glb
    off = 12
    ln, typ = struct.unpack_from("<II", glb, off)
    if typ != 0x4E4F534A:
        return glb
    doc = json.loads(glb[off + 8:off + 8 + ln].rstrip(b" \x00"))
    off = off + 8 + ln
    ln2, typ2 = struct.unpack_from("<II", glb, off)
    if typ2 != 0x004E4942:
        return glb
    blob = bytearray(glb[off + 8:off + 8 + ln2])
    doc.setdefault("images", [])
    doc.setdefault("textures", [])
    doc.setdefault("bufferViews", [])
    vistos = {}
    for nombre, png in pngs.items():
        if nombre in vistos or not png.startswith(b"\x89PNG"):
            continue
        inicio = len(blob)
        blob.extend(png)
        if len(blob) % 4:
            blob.extend(b"\x00" * (4 - len(blob) % 4))
        doc["bufferViews"].append({"buffer": 0, "byteOffset": inicio, "byteLength": len(png)})
        doc["images"].append({"bufferView": len(doc["bufferViews"]) - 1, "mimeType": "image/png"})
        doc["textures"].append({"source": len(doc["images"]) - 1})
        vistos[nombre] = len(doc["textures"]) - 1
    if not vistos:
        return glb
    primero = next(iter(vistos.values()))
    for mat in doc.get("materials") or []:
        tex = vistos.get(mat.get("name"), primero)
        pbr = mat.setdefault("pbrMetallicRoughness", {})
        pbr["baseColorTexture"] = {"index": tex}
        pbr["metallicFactor"] = 0
        pbr["roughnessFactor"] = 0.82
        mat["alphaMode"] = "MASK"
        mat["alphaCutoff"] = 0.5
        mat["doubleSided"] = True
    if doc.get("buffers"):
        doc["buffers"][0]["byteLength"] = len(blob)
    js = json.dumps(doc, separators=(",", ":")).encode("utf-8")
    if len(js) % 4:
        js += b" " * (4 - len(js) % 4)
    def trozo(tipo, data):
        return struct.pack("<II", len(data), tipo) + data
    cuerpo = trozo(0x4E4F534A, js) + trozo(0x004E4942, bytes(blob))
    return b"glTF" + struct.pack("<II", 2, 12 + len(cuerpo)) + cuerpo


def modelo_glb(pet_id):
    """GLB de la montura de una mascota, con el color incrustado. El id es el de aion2.gaming.tools."""
    if not re.fullmatch(r"\d{1,6}", str(pet_id or "")):
        raise DatosError("datos_origen", 404)
    CACHE_GT.mkdir(parents=True, exist_ok=True)
    salida = CACHE_GT / f"modelo-{pet_id}.glb"
    if salida.is_file() and time.time() - salida.stat().st_mtime < TTL:
        return salida.read_bytes()
    pet = json.loads(_leer_gt(f"{CDN_GT}/data/en/pets/{pet_id}.d.json", 200_000))
    ride = next((x for x in pet if isinstance(x, str) and x.startswith("ride-V_")), None)
    if not ride or not RIDE_OK.fullmatch(ride):
        raise DatosError("datos_origen", 404)
    meta = json.loads(_leer_gt(f"{CDN_GT}/data/en/npc-models/{ride}.d.json", 200_000))
    glb_ruta = next((x for x in meta if isinstance(x, str) and GLB_OK.fullmatch(x)), None)
    if not glb_ruta:
        raise DatosError("datos_origen", 404)
    glb = _leer_gt(CDN_GT + glb_ruta, MAX_GLB)
    pngs = {}
    for nombre, ruta in _colores_gt(meta).items():
        pngs[nombre] = _leer_gt(CDN_GT + ruta, 8_000_000)
    hecho = _incrustar_color(glb, pngs)
    salida.write_bytes(hecho)
    return hecho


def cubos():
    crudo = _leer_origen(ORIGEN + "/md/odyle-energy", MAX_MD)
    try:
        md = crudo.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise DatosError("datos_origen", 502) from exc
    return parsear_cubos(md)


def autocomprobar():
    """Comprueba el parser con el Markdown ya descargado, sin red."""
    md = Path("/tmp/item.md").read_text(encoding="utf-8")
    f = parsear_ficha(md, "/items/110120003-ludras-blade-of-extinction")
    assert f["titulo"].startswith("Ludra"), f["titulo"]
    assert any(s["nombre"] == "Min Attack" and s["valor"] == "446" for s in f["stats"]), f["stats"][:3]
    assert f["soul"] and f["soul"][0]["pct"] == 18.8, f["soul"][:1]
    assert f["drops"] and f["drops"][0]["pct"] == 0.56, f["drops"]
    assert any(a["stat"] == "Min Attack" and a["delta"] == "174" and a["en"] == 15 for a in f["adds"]), f["adds"]
    assert f["skills"] and f["skills"][0]["skills"], f["skills"][:1]
    cub = parsear_cubos(Path("/tmp/odyle.md").read_text(encoding="utf-8"))
    assert len(cub["modos"]) >= 20, len(cub["modos"])
    assert cub["modos"][0]["dungeon"].startswith("Krao"), cub["modos"][0]
    print("parser ok", len(f["stats"]), "stats", len(f["soul"]), "soul", len(cub["modos"]), "cubos")


if __name__ == "__main__":
    autocomprobar()
