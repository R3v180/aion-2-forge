"""Regenera sitemap.xml (Render) y sitemapgithub.xml (GitHub Pages) con pares ES/EN + hreflang."""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BASE_RENDER = "https://aion-2-forge.onrender.com"
BASE_PAGES = "https://r3v180.github.io/aion-2-forge"
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
    ("faq.html", "weekly", "0.85"),
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


LANGS = ("es", "en", "fr", "de", "pt", "ru", "ko", "ja")


def url(base: str, path: str, lang: str) -> str:
    sep = "&" if "?" in path else "?"
    return f"{base}/{path}{sep}lang={lang}"


def xml_url(u: str) -> str:
    return u.replace("&", "&amp;")


def multi_lang_block(base: str, path: str, freq: str, pri: str) -> str:
    links = {l: xml_url(url(base, path, l)) for l in LANGS}
    def_x = links["es"]
    alt_links = "\n".join(
        [f'    <xhtml:link rel="alternate" hreflang="{l}" href="{links[l]}"/>' for l in LANGS]
        + [f'    <xhtml:link rel="alternate" hreflang="x-default" href="{def_x}"/>']
    )
    blocks = []
    for l in LANGS:
        loc = links[l]
        blocks.append(
            f"""  <url>
    <loc>{loc}</loc>
    <changefreq>{freq}</changefreq><priority>{pri}</priority>
{alt_links}
  </url>"""
        )
    return "\n".join(blocks)



def generar(base: str) -> str:
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for path, freq, pri in PAGES:
        out.append(multi_lang_block(base, path, freq, pri))
    for tool, pri in TOOLS:
        out.append(multi_lang_block(base, f"herramienta.html?t={tool}", "weekly", pri))
    for path in MAPA:
        out.append(multi_lang_block(base, path, "monthly", "0.75"))
    for c in CLASES:
        out.append(multi_lang_block(base, f"clase.html?c={c}", "weekly", "0.6"))
        out.append(multi_lang_block(base, f"referencia.html?c={c}", "weekly", "0.55"))
    out.append("</urlset>")
    return "\n".join(out) + "\n"


def main():
    for nombre, base in (
        ("sitemap.xml", BASE_RENDER),
        ("sitemapgithub.xml", BASE_PAGES),
    ):
        text = generar(base)
        (RAIZ / nombre).write_text(text, encoding="utf-8")
        print(f"{nombre}: {text.count('<url>')} urls ({base})")


if __name__ == "__main__":
    main()
