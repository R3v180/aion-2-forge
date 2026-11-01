"""Arma data/mascotas.json desde los Markdown ya descargados en /tmp/pets-md
y los nombres oficiales de data/nombres-cliente.json. No llama a la red."""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
MD = Path("/tmp/pets-md")
LANGS = ("es", "en", "fr", "de", "pt", "ru", "ko", "ja")
ZONAS = [
    ("verteron", "Verteron"),
    ("altgard", "Altgard"),
    ("eltnen", "Eltnen"),
    ("morheim", "Morheim"),
    ("chaotic-lower-reshanta", "Abismo inferior"),
    ("chaotic-middle-reshanta", "Abismo medio"),
]


def corto(nombre):
    if not nombre:
        return ""
    partes = re.split(r"\s*[:：]\s*", nombre, maxsplit=1)
    if len(partes) == 2:
        return partes[1].strip()
    return nombre.strip()


def traducir_linea(linea, stats, lang):
    m = re.match(r"^(.*?)(\s+\+[0-9].*)$", linea)
    if not m:
        return linea
    nombre, resto = m.group(1), m.group(2)
    loc = (stats.get(nombre) or {}).get(lang) or nombre
    return loc + resto


def familia_stats(texto):
    m = re.search(r"## .+ family stats by pet level\n(.*?)(?:\n## |\Z)", texto, re.S)
    if not m:
        return []
    nivel = None
    out = []
    actual = None
    for line in m.group(1).splitlines():
        bruto = line.strip()
        mv = re.match(r"Level (\d+)$", bruto)
        if mv:
            if actual:
                out.append(actual)
            nivel = int(mv.group(1))
            actual = {"nivel": nivel, "lineas": []}
            continue
        if bruto.startswith("- ") and actual is not None:
            actual["lineas"].append(bruto[2:].strip())
    if actual:
        out.append(actual)
    return out


def drops(texto):
    out = []
    lines = texto.splitlines()
    for i, line in enumerate(lines):
        if not line.startswith("| Monster |"):
            continue
        j = i + 2
        while j < len(lines) and lines[j].startswith("|"):
            celdas = [c.strip() for c in lines[j].strip("|").split("|")]
            if len(celdas) >= 3:
                nombre = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", celdas[0])
                href = ""
                hm = re.search(r"\((?:https://aion2data.com)?(/monsters/[^)]+)\)", celdas[0])
                if hm:
                    href = hm.group(1)
                out.append({
                    "nombre": nombre,
                    "nivel": celdas[1],
                    "pct": celdas[2],
                    "href": href,
                })
            j += 1
        break
    return out


def otros(texto, items):
    """Cofres y fuentes con porcentaje, fuera de la tabla de almas."""
    inicio = texto.find("## How to get")
    if inicio < 0:
        return []
    resto = texto[inicio:]
    fin = resto.find("\n## ")
    trozo = resto[:fin] if fin > 0 else resto
    vistos = []
    for enlace, href in re.findall(r"\[([^\]]+)\]\((?:https://aion2data.com)?(/items/[^)]+)\)", trozo):
        pct_m = re.search(re.escape(href) + r"\)\s*\(([0-9.]+%)\)", trozo)
        if not pct_m:
            continue
        hid = href.split("/")[-1].split("-", 1)[0]
        nombres = (items.get(hid) or {}).get("n") or {}
        vistos.append({
            "href": href,
            "pct": pct_m.group(1),
            "n": {lang: (nombres.get(lang) or enlace) for lang in LANGS},
        })
    # únicos por href
    unico = []
    ya = set()
    for v in vistos:
        if v["href"] in ya:
            continue
        ya.add(v["href"])
        unico.append(v)
    return unico[:8]


def main():
    pack = json.loads((RAIZ / "data" / "nombres-cliente.json").read_text(encoding="utf-8"))
    items = pack["items"]
    npcs = pack["npcs"]
    stats = pack["stats"]
    por_en = {}
    for rec in items.values():
        en = (rec.get("n") or {}).get("en") or ""
        if en.startswith("Pet: ") and "(Bound)" not in en and en not in por_en:
            por_en[en[5:].strip().lower()] = rec["n"]

    zonas_por_id = {}
    for slug, nombre in ZONAS:
        ruta = RAIZ / "data" / "mapa" / f"{slug}.json"
        if not ruta.is_file():
            continue
        datos = json.loads(ruta.read_text(encoding="utf-8"))
        for pet in datos.get("capas", {}).get("mascotas") or []:
            zonas_por_id.setdefault(pet["id"], []).append({
                "z": slug,
                "zona": nombre,
                "puntos": len(pet.get("pts") or []),
                "de": (pet.get("s") or "").replace("soul from ", ""),
            })

    familias = {}
    mascotas = []
    for ruta in sorted(MD.glob("*.md")):
        texto = ruta.read_text(encoding="utf-8")
        slug = ruta.stem
        titulo = ""
        hm = re.search(r"^#\s+(.+)$", texto, re.M)
        if hm:
            titulo = hm.group(1).strip()
        fam = ""
        fm = re.search(r"^(Fera|Cogni|Natura|Varian|Special) pet", texto, re.M)
        if fm:
            fam = fm.group(1)
        almas = 0
        almas3 = 0
        sm = re.search(r"Souls to summon\s+(\d+)", texto)
        if sm:
            almas = int(sm.group(1))
        s3 = re.search(r"Souls to level 3\s+(\d+)", texto)
        if s3:
            almas3 = int(s3.group(1))
        if fam and fam not in familias:
            niveles = []
            for bloque in familia_stats(texto):
                niveles.append({
                    "nivel": bloque["nivel"],
                    "lineas": {
                        lang: [traducir_linea(l, stats, lang) for l in bloque["lineas"]]
                        for lang in LANGS
                    },
                })
            if niveles:
                familias[fam] = niveles
        icono = ""
        # el retrato vive en el índice de búsqueda; lo rellena el llamador si hace falta
        nombres = por_en.get(titulo.lower()) or {}
        n = {}
        for lang in LANGS:
            n[lang] = corto(nombres.get(lang) or "") or titulo
        lista_drops = []
        for d in drops(texto):
            hid = ""
            if d["href"].startswith("/monsters/"):
                hid = d["href"].split("/")[-1].split("-", 1)[0]
            npc = npcs.get(hid) or {}
            dn = {lang: npc.get(lang) or d["nombre"] for lang in LANGS}
            lista_drops.append({
                "n": dn,
                "nivel": d["nivel"],
                "pct": d["pct"],
                "href": d["href"],
            })
        mascotas.append({
            "id": slug,
            "familia": fam or "Special",
            "n": n,
            "almas": almas,
            "almas3": almas3,
            "drops": lista_drops,
            "otros": otros(texto, items),
            "zonas": zonas_por_id.get(slug, []),
        })

    # iconos del índice de búsqueda si está a mano
    indice = Path("/tmp/a2search.json")
    if indice.is_file():
        por_slug = {}
        for row in json.loads(indice.read_text(encoding="utf-8")):
            href = row.get("href") or ""
            if href.startswith("/pets/"):
                por_slug[href.split("/")[-1]] = row.get("icon") or ""
        for pet in mascotas:
            pet["icon"] = por_slug.get(pet["id"]) or ""

    orden = {"Fera": 0, "Cogni": 1, "Natura": 2, "Varian": 3, "Special": 4}
    mascotas.sort(key=lambda p: (orden.get(p["familia"], 9), p["n"]["en"].lower()))
    out = {"familias": familias, "mascotas": mascotas}
    dest = RAIZ / "data" / "mascotas.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(dest, dest.stat().st_size, "pets", len(mascotas), "familias", list(familias))


if __name__ == "__main__":
    main()
