# -*- coding: utf-8 -*-
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
n = 0
for p in sorted(ROOT.glob("*.html")):
    t = p.read_text(encoding="utf-8")
    t2 = t.replace("/img/og-aion-2-forge.jpg", "/img/og-aion-2-forge-es.jpg")
    t2 = t2.replace('href="img/pwa-icon-192.png"', 'href="img/pwa-icon-es-192.png"')
    t2 = t2.replace('href="site.webmanifest"', 'href="site-es.webmanifest"')
    t2 = re.sub(r"js/i18n\.js\?v=\d+", "js/i18n.js?v=71", t2)
    t2 = re.sub(r"js/hero-carrusel\.js\?v=\d+", "js/hero-carrusel.js?v=8", t2)
    if t2 != t:
        p.write_text(t2, encoding="utf-8")
        n += 1
        print(p.name)
print("ok", n)
