"""Regenera sitemap.xml con pares ES/EN + hreflang."""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE = "https://aion-2-forge.onrender.com"
CLASES = [
    "chanter", "cleric", "gladiator", "templar",
    "assassin", "ranger", "sorcerer", "spiritmaster",
]
TOOLS = [
    ("mejora", "0.8"), ("craft", "0.75"), ("odds", "0.75"), ("drops", "0.75"),
    ("potential", "0.75"), ("stats", "0.75"), ("pantheon", "0.75"), ("arcana", "0.75"),
]
PAGES = [
    ("index.html", "daily", "1"),
    ("espia.html", "daily", "0.9"),
    ("builds.html", "daily", "0.8"),
    ("clases.html", "weekly", "0.8"),
    ("tops.html", "daily", "0.8"),
    ("timers.html", "daily", "0.9"),
    ("herramientas.html", "weekly", "0.9"),
    ("mapa.html", "weekly", "0.9"),
    ("guias.html", "weekly", "0.7"),
    ("noticias.html", "daily", "0.7"),
    ("foro.html", "daily", "0.6"),
    ("chat.html", "weekly", "0.5"),
    ("legal.html?s=aviso", "yearly", "0.4"),
    ("legal.html?s=privacidad", "yearly", "0.5"),
    ("legal.html?s=cookies", "yearly", "0.4"),
]
MAPA = [
    "mapa.html?z=verteron&q=rub%C3%AD",
    "mapa.html?z=altgard&q=ruby",
    "mapa.html?z=eltnen&q=odyle",
    "mapa.html?z=morheim&q=zaif",
    "mapa.html?z=chaotic-lower-reshanta",
    "mapa.html?z=chaotic-middle-reshanta",
]


def url(path: str, lang: str) -> str:
    sep = "&" if "?" in path else "?"
    return f"{BASE}/{path}{sep}lang={lang}"


def xml_url(u: str) -> str:
    return u.replace("&", "&amp;")


def pair(path: str, freq: str, pri: str) -> str:
    es, en = url(path, "es"), url(path, "en")
    esx, enx = xml_url(es), xml_url(en)
    blocks = []
    for loc in (esx, enx):
        blocks.append(
            f"""  <url>
    <loc>{loc}</loc>
    <changefreq>{freq}</changefreq><priority>{pri}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="{esx}"/>
    <xhtml:link rel="alternate" hreflang="en" href="{enx}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{esx}"/>
  </url>"""
        )
    return "\n".join(blocks)


def main():
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for path, freq, pri in PAGES:
        out.append(pair(path, freq, pri))
    for tool, pri in TOOLS:
        out.append(pair(f"herramienta.html?t={tool}", "weekly", pri))
    for path in MAPA:
        out.append(pair(path, "monthly", "0.75"))
    for c in CLASES:
        out.append(pair(f"clase.html?c={c}", "weekly", "0.6"))
        out.append(pair(f"referencia.html?c={c}", "weekly", "0.55"))
    out.append("</urlset>")
    text = "\n".join(out) + "\n"
    (RAIZ / "sitemap.xml").write_text(text, encoding="utf-8")
    print(f"sitemap.xml: {text.count('<url>')} urls")


if __name__ == "__main__":
    main()
