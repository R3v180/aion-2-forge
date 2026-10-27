"""SEO: metas SSR, JSON-LD y entradas dinámicas del sitemap (tops, builds, noticias)."""
import html as html_lib
import json
import re
from datetime import timezone
from urllib.parse import quote, urlencode

BASE = "https://orden-celeste-aion2.onrender.com"
OG_IMAGE = f"{BASE}/img/og-orden-celeste.jpg"
OG_IMAGE_W, OG_IMAGE_H = "1024", "535"

CLASE_ES = {
    "gladiator": "Gladiador", "templar": "Templario", "assassin": "Sicario",
    "ranger": "Ranger", "sorcerer": "Hechicero", "spiritmaster": "Espiritualista",
    "cleric": "Clérigo", "chanter": "Cantor",
}
CLASE_EN = {
    "gladiator": "Gladiator", "templar": "Templar", "assassin": "Assassin",
    "ranger": "Ranger", "sorcerer": "Sorcerer", "spiritmaster": "Spiritmaster",
    "cleric": "Cleric", "chanter": "Chanter",
}


def _esc(s):
    return html_lib.escape(str(s or ""), quote=True)


def _xml(u):
    return str(u).replace("&", "&amp;")


def url_pagina(path, lang=None, **params):
    q = dict(params)
    if lang:
        q["lang"] = lang
    qs = urlencode(q, doseq=True, quote_via=quote)
    return f"{BASE}/{path}" + (f"?{qs}" if qs else "")


def poder_txt(n):
    try:
        n = float(n)
    except (TypeError, ValueError):
        return None
    if n >= 1000:
        return f"{round(n / 100) / 10:.1f}".rstrip("0").rstrip(".") + "K"
    return str(int(n)) if n == int(n) else str(n)


def clase_nom(clase, lang="es"):
    return (CLASE_EN if lang == "en" else CLASE_ES).get(clase, clase or "")


def inyectar_head(html, *, titulo, descripcion, keywords=None, canonical=None, json_ld=None, lang=None):
    """Sustituye title/description/keywords y añade canonical + JSON-LD para bots."""
    if not html:
        return html
    if lang in ("es", "en"):
        html = re.sub(r'(<html[^>]*\slang=")[^"]*(")', rf"\1{lang}\2", html, count=1, flags=re.I)
    if titulo:
        html = re.sub(r"<title>[^<]*</title>", f"<title>{_esc(titulo)}</title>", html, count=1, flags=re.I)
        if re.search(r'property="og:title"', html, re.I):
            html = re.sub(
                r'(property="og:title"\s+content=")[^"]*(")',
                rf"\1{_esc(titulo)}\2", html, count=1, flags=re.I,
            )
        else:
            html = html.replace("</head>", f'<meta property="og:title" content="{_esc(titulo)}">\n</head>', 1)
    if descripcion:
        if re.search(r'name="description"', html, re.I):
            html = re.sub(
                r'(name="description"\s+content=")[^"]*(")',
                rf"\1{_esc(descripcion)}\2", html, count=1, flags=re.I,
            )
        else:
            html = html.replace("</head>", f'<meta name="description" content="{_esc(descripcion)}">\n</head>', 1)
        if re.search(r'property="og:description"', html, re.I):
            html = re.sub(
                r'(property="og:description"\s+content=")[^"]*(")',
                rf"\1{_esc(descripcion)}\2", html, count=1, flags=re.I,
            )
        else:
            html = html.replace("</head>", f'<meta property="og:description" content="{_esc(descripcion)}">\n</head>', 1)
    if keywords:
        if re.search(r'name="keywords"', html, re.I):
            html = re.sub(
                r'(name="keywords"\s+content=")[^"]*(")',
                rf"\1{_esc(keywords)}\2", html, count=1, flags=re.I,
            )
        else:
            html = html.replace("</head>", f'<meta name="keywords" content="{_esc(keywords)}">\n</head>', 1)
    if canonical:
        can = _esc(canonical)
        if re.search(r'rel="canonical"', html, re.I):
            html = re.sub(
                r'(rel="canonical"\s+href=")[^"]*(")',
                rf"\1{can}\2", html, count=1, flags=re.I,
            )
        else:
            html = html.replace("</head>", f'<link rel="canonical" href="{can}">\n</head>', 1)
    if json_ld:
        blob = json.dumps(json_ld, ensure_ascii=False, separators=(",", ":"))
        html = html.replace(
            "</head>",
            f'<script type="application/ld+json">{blob}</script>\n</head>',
            1,
        )
    # Imagen social fija (Facebook/WhatsApp) si la página no trae og:image
    if not re.search(r'property="og:image"', html, re.I):
        html = html.replace(
            "</head>",
            (
                f'<meta property="og:image" content="{_esc(OG_IMAGE)}">\n'
                f'<meta property="og:image:width" content="{OG_IMAGE_W}">\n'
                f'<meta property="og:image:height" content="{OG_IMAGE_H}">\n'
                f'<meta name="twitter:card" content="summary_large_image">\n'
                f'<meta name="twitter:image" content="{_esc(OG_IMAGE)}">\n'
                "</head>"
            ),
            1,
        )
    return html


def meta_jugador(fila, lang="es", puestos=None):
    """Título/desc SEO para ficha Espía (cid+server)."""
    nombre = (fila.get("nombre") or "Jugador").strip()
    servidor = (fila.get("servidor") or "").strip()
    clase = fila.get("clase") or ""
    cn = clase_nom(clase, lang)
    poder = poder_txt(fila.get("poder"))
    ilvl = fila.get("nivel_objeto")
    puestos = puestos or []
    if lang == "en":
        bits = [f"AION 2 spy profile of {nombre}"]
        if servidor:
            bits.append(f"on {servidor}")
        if cn:
            bits.append(cn)
        if poder:
            bits.append(f"power {poder}")
        if ilvl:
            bits.append(f"iLvl {ilvl}")
        if puestos:
            bits.append("community top: " + ", ".join(puestos[:4]))
        desc = ". ".join(bits) + ". Orden Celeste legion fan site."
        titulo = f"{nombre} · AION 2 Spy / Top · Orden Celeste"
        keys = ", ".join(x for x in [nombre, "AION 2", servidor, cn, "top", "spy build", "Orden Celeste"] if x)
    else:
        bits = [f"Ficha Espía de {nombre} en AION 2"]
        if servidor:
            bits.append(f"servidor {servidor}")
        if cn:
            bits.append(cn)
        if poder:
            bits.append(f"poder {poder}")
        if ilvl:
            bits.append(f"iLvl {ilvl}")
        if puestos:
            bits.append("top comunidad: " + ", ".join(puestos[:4]))
        desc = ". ".join(bits) + ". Web de la legión Orden Celeste."
        titulo = f"{nombre} · Espía / Top AION 2 · Orden Celeste"
        keys = ", ".join(x for x in [nombre, "AION 2", servidor, cn, "top", "espía builds", "Orden Celeste"] if x)
    return titulo, desc[:320], keys


def meta_build(fila, lang="es"):
    nombre = (fila.get("nombre") or "Build").strip()
    autor = (fila.get("autor") or "").strip()
    clase = fila.get("clase") or ""
    cn = clase_nom(clase, lang)
    fuente = fila.get("fuente") or ""
    top = isinstance(fuente, str) and fuente.startswith("top:")
    if lang == "en":
        if top:
            titulo = f"{nombre} · Weekly AION 2 top build · Orden Celeste"
            desc = f"Community top snapshot for {nombre} ({cn}). Skills, stigmas and Daevanion from the Spy ranking."
        else:
            titulo = f"{nombre} · AION 2 build · Orden Celeste"
            desc = f"AION 2 {cn} build «{nombre}»" + (f" by {autor}" if autor else "") + ". Skills, stigmas and Daevanion."
        keys = f"{nombre}, AION 2 build, {cn}, {autor}, Orden Celeste".strip(", ")
    else:
        if top:
            titulo = f"{nombre} · Top semanal AION 2 · Orden Celeste"
            desc = f"Instantánea del top comunitario de {nombre} ({cn}). Habilidades, estigmas y Daevanion vía Espía."
        else:
            titulo = f"{nombre} · Build AION 2 · Orden Celeste"
            desc = f"Build de {cn} «{nombre}»" + (f" por {autor}" if autor else "") + ". Habilidades, estigmas y Daevanion."
        keys = f"{nombre}, AION 2 build, {cn}, {autor}, Orden Celeste".strip(", ")
    return titulo, desc[:320], keys


def meta_noticia(fila, lang="es"):
    titulo_n = (fila.get("titulo") or "Noticia AION 2").strip()
    if lang == "en":
        titulo = f"{titulo_n} · AION 2 news · Orden Celeste"
        desc = (fila.get("resumen") or fila.get("contenido") or "Official AION 2 news on Orden Celeste.")[:280]
        keys = f"{titulo_n}, AION 2 news, NCSOFT, Orden Celeste"
    else:
        titulo = f"{titulo_n} · Noticias AION 2 · Orden Celeste"
        desc = (fila.get("resumen") or fila.get("contenido") or "Noticia oficial de AION 2 en Orden Celeste.")[:280]
        # strip crude html
        desc = re.sub(r"<[^>]+>", " ", desc)
        desc = re.sub(r"\s+", " ", desc).strip()
        keys = f"{titulo_n}, AION 2 noticia, NCSOFT, Orden Celeste"
    return titulo, desc[:320], keys


def json_ld_jugador(fila, canonical, lang="es"):
    nombre = fila.get("nombre") or ""
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": nombre,
        "url": canonical,
        "inLanguage": "en" if lang == "en" else "es",
        "mainEntity": {
            "@type": "Person",
            "name": nombre,
            "identifier": f"{fila.get('character_id')}:{fila.get('server_id')}",
            "description": meta_jugador(fila, lang)[1],
        },
        "isPartOf": {"@type": "WebSite", "name": "Orden Celeste AION 2", "url": BASE + "/"},
    }


def json_ld_noticia(fila, canonical, lang="es"):
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": fila.get("titulo") or "",
        "datePublished": (fila.get("publicado").isoformat() if hasattr(fila.get("publicado"), "isoformat") else fila.get("publicado")),
        "url": canonical,
        "inLanguage": "en" if lang == "en" else "es",
        "publisher": {"@type": "Organization", "name": "Orden Celeste"},
        "isPartOf": {"@type": "WebSite", "name": "Orden Celeste AION 2", "url": BASE + "/"},
    }


def _url_entry(loc, freq="weekly", pri="0.6", alternates=None):
    lines = [
        "  <url>",
        f"    <loc>{_xml(loc)}</loc>",
        f"    <changefreq>{freq}</changefreq><priority>{pri}</priority>",
    ]
    for lang, href in (alternates or []):
        lines.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{_xml(href)}"/>')
    if alternates:
        # x-default = es
        es = next((h for l, h in alternates if l == "es"), alternates[0][1])
        lines.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{_xml(es)}"/>')
    lines.append("  </url>")
    return "\n".join(lines)


def _pair_entries(path_params, freq, pri):
    """path_params: dict without lang, path is first key '_path'."""
    path = path_params.pop("_path")
    es = url_pagina(path, "es", **path_params)
    en = url_pagina(path, "en", **path_params)
    alts = [("es", es), ("en", en)]
    return _url_entry(es, freq, pri, alts) + "\n" + _url_entry(en, freq, pri, alts)


def entradas_dinamicas(db):
    """Tops históricos, builds públicas y noticias → URLs indexables ES/EN."""
    bloques = ["  <!-- Dinámico: tops / builds / noticias -->"]

    # Jugadores que han estado en top semanal (prioridad SEO de nombres famosos)
    tops = db.todos(
        """SELECT DISTINCT ON (character_id, server_id)
              character_id, server_id, nombre, servidor, clase, poder
           FROM top_log
           WHERE character_id IS NOT NULL AND character_id <> ''
           ORDER BY character_id, server_id, semana DESC
           LIMIT 400"""
    ) or []
    for f in tops:
        bloques.append(_pair_entries({
            "_path": "build.html",
            "cid": f["character_id"],
            "server": int(f["server_id"]),
        }, "weekly", "0.85"))

    # Ranking alto (por si aún no entraron en top_log semanal)
    ranking = db.todos(
        """SELECT character_id, server_id, nombre FROM ranking_pj
           WHERE COALESCE(poder, 0) > 0
             AND character_id IS NOT NULL AND character_id <> ''
           ORDER BY poder DESC NULLS LAST
           LIMIT 120"""
    ) or []
    vistos = {(str(f["character_id"]), int(f["server_id"])) for f in tops}
    for f in ranking:
        clave = (str(f["character_id"]), int(f["server_id"]))
        if clave in vistos:
            continue
        vistos.add(clave)
        bloques.append(_pair_entries({
            "_path": "build.html",
            "cid": f["character_id"],
            "server": int(f["server_id"]),
        }, "weekly", "0.7"))

    # Builds públicas (tops archivados + comunidad)
    builds = db.todos(
        """SELECT id FROM builds WHERE publica
           ORDER BY CASE WHEN fuente LIKE %s THEN 0 ELSE 1 END, actualizado DESC
           LIMIT 400""",
        ("top:%",),
    ) or []
    for b in builds:
        bloques.append(_pair_entries({"_path": "build.html", "id": int(b["id"])}, "weekly", "0.65"))

    # Noticias
    noticias = db.todos(
        """SELECT id, idioma FROM noticias
           ORDER BY publicado DESC NULLS LAST LIMIT 120"""
    ) or []
    for n in noticias:
        lang = n["idioma"] if n["idioma"] in ("es", "en") else "es"
        # Una entrada por idioma de la noticia + alternate al otro si existe
        loc = url_pagina("noticia.html", lang, id=int(n["id"]))
        other = "en" if lang == "es" else "es"
        alt = url_pagina("noticia.html", other, id=int(n["id"]))
        bloques.append(_url_entry(loc, "weekly", "0.7", [(lang, loc), (other, alt)]))

    return "\n".join(bloques)
