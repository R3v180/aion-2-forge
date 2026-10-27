# -*- coding: utf-8 -*-
import http.client
import re
import ssl

HOST = "aion-2-forge.onrender.com"
ctx = ssl.create_default_context()


def get(path):
    conn = http.client.HTTPSConnection(HOST, timeout=90, context=ctx)
    conn.request("GET", path, headers={"User-Agent": "Mozilla/5.0 (compatible; SEOCheck/1.0)"})
    r = conn.getresponse()
    b = r.read()
    conn.close()
    return r.status, b


def main():
    for path in ["/robots.txt", "/sitemap.xml"]:
        st, b = get(path)
        txt = b.decode("utf-8", "replace")
        print("===", path, st, "bytes", len(b))
        if path.endswith("robots.txt"):
            print(txt)
        else:
            print("orden-celeste", txt.count("orden-celeste"))
            print("aion-2-forge", txt.count("aion-2-forge.onrender.com"))
            print("loc", len(re.findall(r"<loc>", txt)))
            print("hreflang es", txt.count('hreflang="es"'))
            print("hreflang en", txt.count('hreflang="en"'))
            print("x-default", txt.count("x-default"))
            print("sample loc:", re.findall(r"<loc>([^<]+)</loc>", txt)[:3])
            # dynamic block markers
            print("dinamico tops?", "build.html?id=" in txt or "tops" in txt.lower())
            print("tail:", txt[-400:])


if __name__ == "__main__":
    main()
