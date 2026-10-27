"""SEO: metas SSR, JSON-LD y entradas dinámicas del sitemap (tops, builds, noticias)."""
import html as html_lib
import json
import re
from datetime import timezone
from urllib.parse import quote, urlencode

BASE = "https://aion-2-forge.onrender.com"
OG_IMAGE = f"{BASE}/img/og-aion-2-forge.jpg"
OG_IMAGE_W, OG_IMAGE_H = "1200", "630"

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
        # hreflang ES/EN en HTML (además del sitemap) para bots
        if lang in ("es", "en") and "hreflang=" not in html:
            try:
                from urllib.parse import urlsplit, parse_qsl, urlencode, urlunsplit
                parts = urlsplit(canonical)
                q = dict(parse_qsl(parts.query, keep_blank_values=True))
                alts = []
                for l in ("es", "en"):
                    q2 = dict(q)
                    q2["lang"] = l
                    href = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(q2), ""))
                    alts.append(f'<link rel="alternate" hreflang="{l}" href="{_esc(href)}">')
                q3 = dict(q)
                q3["lang"] = "es"
                href_def = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(q3), ""))
                alts.append(f'<link rel="alternate" hreflang="x-default" href="{_esc(href_def)}">')
                html = html.replace("</head>", "\n".join(alts) + "\n</head>", 1)
            except Exception:  # noqa: BLE001
                pass
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
        desc = ". ".join(bits) + ". Aion 2 Forge community fan site."
        titulo = f"{nombre} · AION 2 Spy / Top · Aion 2 Forge"
        keys = ", ".join(x for x in [nombre, "AION 2", servidor, cn, "top", "spy build", "Aion 2 Forge"] if x)
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
        desc = ". ".join(bits) + ". Web de la comunidad Aion 2 Forge."
        titulo = f"{nombre} · Espía / Top AION 2 · Aion 2 Forge"
        keys = ", ".join(x for x in [nombre, "AION 2", servidor, cn, "top", "espía builds", "Aion 2 Forge"] if x)
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
            titulo = f"{nombre} · Weekly AION 2 top build · Aion 2 Forge"
            desc = f"Community top snapshot for {nombre} ({cn}). Skills, stigmas and Daevanion from the Spy ranking."
        else:
            titulo = f"{nombre} · AION 2 build · Aion 2 Forge"
            desc = f"AION 2 {cn} build «{nombre}»" + (f" by {autor}" if autor else "") + ". Skills, stigmas and Daevanion."
        keys = f"{nombre}, AION 2 build, {cn}, {autor}, Aion 2 Forge".strip(", ")
    else:
        if top:
            titulo = f"{nombre} · Top semanal AION 2 · Aion 2 Forge"
            desc = f"Instantánea del top comunitario de {nombre} ({cn}). Habilidades, estigmas y Daevanion vía Espía."
        else:
            titulo = f"{nombre} · Build AION 2 · Aion 2 Forge"
            desc = f"Build de {cn} «{nombre}»" + (f" por {autor}" if autor else "") + ". Habilidades, estigmas y Daevanion."
        keys = f"{nombre}, AION 2 build, {cn}, {autor}, Aion 2 Forge".strip(", ")
    return titulo, desc[:320], keys


def meta_noticia(fila, lang="es"):
    titulo_n = (fila.get("titulo") or "Noticia AION 2").strip()
    if lang == "en":
        titulo = f"{titulo_n} · AION 2 news · Aion 2 Forge"
        desc = (fila.get("resumen") or fila.get("contenido") or "Official AION 2 news on Aion 2 Forge.")[:280]
        keys = f"{titulo_n}, AION 2 news, NCSOFT, Aion 2 Forge"
    else:
        titulo = f"{titulo_n} · Noticias AION 2 · Aion 2 Forge"
        desc = (fila.get("resumen") or fila.get("contenido") or "Noticia oficial de AION 2 en Aion 2 Forge.")[:280]
        # strip crude html
        desc = re.sub(r"<[^>]+>", " ", desc)
        desc = re.sub(r"\s+", " ", desc).strip()
        keys = f"{titulo_n}, AION 2 noticia, NCSOFT, Aion 2 Forge"
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
        "isPartOf": {"@type": "WebSite", "name": "Aion 2 Forge", "url": BASE + "/"},
    }


def json_ld_noticia(fila, canonical, lang="es"):
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": fila.get("titulo") or "",
        "datePublished": (fila.get("publicado").isoformat() if hasattr(fila.get("publicado"), "isoformat") else fila.get("publicado")),
        "url": canonical,
        "inLanguage": "en" if lang == "en" else "es",
        "publisher": {"@type": "Organization", "name": "Aion 2 Forge"},
        "isPartOf": {"@type": "WebSite", "name": "Aion 2 Forge", "url": BASE + "/"},
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
    vistos = set()

    def _seguro(nombre, fn):
        try:
            fn()
        except Exception as e:  # noqa: BLE001
            bloques.append(f"  <!-- {nombre}: {type(e).__name__} -->")

    def _tops():
        tops = db.todos(
            """SELECT DISTINCT ON (character_id, server_id)
                  character_id, server_id, nombre, clase, poder
               FROM top_log
               WHERE character_id IS NOT NULL AND character_id <> ''
               ORDER BY character_id, server_id, semana DESC
               LIMIT 400"""
        ) or []
        for f in tops:
            clave = (str(f["character_id"]), int(f["server_id"]))
            vistos.add(clave)
            bloques.append(_pair_entries({
                "_path": "build.html",
                "cid": f["character_id"],
                "server": int(f["server_id"]),
            }, "weekly", "0.85"))

    def _ranking():
        ranking = db.todos(
            """SELECT character_id, server_id, nombre FROM ranking_pj
               WHERE COALESCE(poder, 0) > 0
                 AND character_id IS NOT NULL AND character_id <> ''
               ORDER BY poder DESC NULLS LAST
               LIMIT 120"""
        ) or []
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

    def _builds():
        builds = db.todos(
            """SELECT id FROM builds WHERE publica
               ORDER BY CASE WHEN fuente LIKE %s THEN 0 ELSE 1 END, actualizado DESC
               LIMIT 400""",
            ("top:%",),
        ) or []
        for b in builds:
            bloques.append(_pair_entries({"_path": "build.html", "id": int(b["id"])}, "weekly", "0.65"))

    def _noticias():
        noticias = db.todos(
            """SELECT id, idioma FROM noticias
               ORDER BY publicado DESC NULLS LAST LIMIT 120"""
        ) or []
        for n in noticias:
            lang = n["idioma"] if n["idioma"] in ("es", "en") else "es"
            nid = str(n["id"])
            loc = url_pagina("noticia.html", lang, id=nid)
            other = "en" if lang == "es" else "es"
            alt = url_pagina("noticia.html", other, id=nid)
            bloques.append(_url_entry(loc, "weekly", "0.7", [(lang, loc), (other, alt)]))

    _seguro("tops", _tops)
    _seguro("ranking", _ranking)
    _seguro("builds", _builds)
    _seguro("noticias", _noticias)
    return "\n".join(bloques)
