# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OLD = '<link rel="icon" href="img/aion-2-forge-emblema.svg" type="image/svg+xml">'
NEW = """<link rel="icon" href="img/aion-2-forge-emblema.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="img/pwa-icon-192.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#0b111b">
<meta name="application-name" content="Aion 2 Forge">"""


def main():
    n = 0
    for p in sorted(ROOT.glob("*.html")):
        t = p.read_text(encoding="utf-8")
        if "site.webmanifest" in t:
            continue
        if OLD not in t:
            print("skip", p.name)
            continue
        t = t.replace(OLD, NEW, 1)
        t = t.replace('content="1024"', 'content="1200"')
        t = t.replace('content="535"', 'content="630"')
        p.write_text(t, encoding="utf-8")
        n += 1
        print("html", p.name)
    print("updated", n)


if __name__ == "__main__":
    main()
