"""Copia de las noticias oficiales de AION 2 (anuncios, parches y vídeos) en español e inglés."""
import html
import json
import re
import threading
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import db

API = "https://api-global-community.plaync.com/aion2_global/"
TABLONES = ("notice", "update", "movie_clip")
IDIOMAS = {"es": "es-es", "en": "en-us"}
CADA = 15 * 60
_UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json", "Referer": "https://aion2.plaync.com/"}
_lock = threading.Lock()
_ultima = {"t": 0.0}

PERMITIDAS = {"p", "br", "b", "strong", "i", "em", "u", "a", "img", "ul", "ol", "li", "h1", "h2", "h3", "h4",
              "table", "thead", "tbody", "tr", "td", "th", "hr", "span", "div", "blockquote"}
VACIAS = {"br", "img", "hr"}
SALTAR = {"script", "style", "noscript", "template"}
YOUTUBE = re.compile(r"^https://www\.youtube(-nocookie)?\.com/embed/([A-Za-z0-9_-]{6,20})")
PALABRAS_ES = {"el", "la", "de", "que", "los", "las", "para", "con", "una", "por", "del", "se", "en"}
PALABRAS_EN = {"the", "and", "to", "of", "you", "will", "is", "for", "with", "be", "this", "on", "are"}


def _host_ok(url):
    try:
        u = urlparse(url)
    except ValueError:
        return False
    return u.scheme == "https" and (u.hostname or "").endswith(("playnccdn.com", "plaync.com"))


class _Limpiador(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.salida, self.pila, self.saltando = [], [], 0
        self.primera_imagen = ""

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in SALTAR:
            self.saltando += 1
            return
        if self.saltando:
            return
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag == "iframe":
            m = YOUTUBE.match(a.get("src", ""))
            if m:
                self.salida.append('<div class="video-noticia"><iframe src="https://www.youtube-nocookie.com/embed/%s" '
                                   'loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
                                   % m.group(2))
            return
        if tag not in PERMITIDAS:
            return
        extra = ""
        if tag == "a":
            href = a.get("href", "")
            if not href.startswith(("https://", "http://")):
                return
            extra = ' href="%s" target="_blank" rel="noopener nofollow"' % html.escape(href, quote=True)
        elif tag == "img":
            src = a.get("src", "")
            if not _host_ok(src):
                return
            self.primera_imagen = self.primera_imagen or src
            extra = ' src="%s" alt="%s" loading="lazy"' % (html.escape(src, quote=True), html.escape(a.get("alt", "")[:120], quote=True))
        elif tag in ("td", "th"):
            for k in ("colspan", "rowspan"):
                if a.get(k, "").isdigit():
                    extra += ' %s="%s"' % (k, int(a[k]))
        self.salida.append("<%s%s>" % (tag, extra))
        if tag not in VACIAS:
            self.pila.append(tag)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in SALTAR:
            self.saltando = max(0, self.saltando - 1)
            return
        if self.saltando or tag not in self.pila:
            return
        while self.pila:
            t = self.pila.pop()
            self.salida.append("</%s>" % t)
            if t == tag:
                break

    def handle_data(self, data):
        if not self.saltando:
            self.salida.append(html.escape(data, quote=False))

    def resultado(self):
        while self.pila:
            self.salida.append("</%s>" % self.pila.pop())
        return "".join(self.salida)


def limpiar(fuente):
    p = _Limpiador()
    p.feed(fuente or "")
    p.close()
    return p.resultado(), p.primera_imagen


def _texto_en_ingles(contenido):
    palabras = re.findall(r"[a-záéíóúñ]+", re.sub(r"<[^>]+>", " ", contenido).lower())[:600]
    es = sum(1 for w in palabras if w in PALABRAS_ES)
    en = sum(1 for w in palabras if w in PALABRAS_EN)
    return en > es * 1.5 and en > 8


def _resumen(contenido):
    texto = html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"</(div|p|li|tr|h\d)>", " · ", contenido)))
    texto = re.sub(r"[\s\u200b]+", " ", texto)
    texto = re.sub(r"·(\s*·)+", "·", texto).strip(" ·")
    return texto[:260].rsplit(" ", 1)[0] + "…" if len(texto) > 260 else texto


def _get(ruta):
    with urlopen(Request(API + ruta, headers=_UA), timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))


def _fecha(epoch):
    return datetime.fromtimestamp(int(epoch or 0), tz=timezone.utc)


def _url(art, tablon, region):
    patron = ((art.get("categoryBoard") or {}).get("boardUrlPattern")
              or "https://aion2.plaync.com/{lang}-{country}/board/%s/view?articleId={articleId}" % tablon)
    lang, country = region.split("-")
    url = patron.replace("{lang}", lang).replace("{country}", country).replace("{articleId}", art["id"])
    if not url.startswith("https://aion2.plaync.com/"):
        url = "https://aion2.plaync.com/%s/board/%s/view?articleId=%s" % (region, tablon, art["id"])
    return url


def _norm_img(url):
    u = str(url or "").replace("/download_thumbnail/", "/download/")
    return u[:400] if _host_ok(u) else ""


def _candidatas(art):
    thumb = _norm_img(art.get("thumbnailUrl"))
    vistas, out = set(), []
    for u in art.get("thumbnailUrlList") or []:
        u = _norm_img(u)
        if u and u != thumb and u not in vistas:
            vistas.add(u)
            out.append(u)
    return thumb, out


def _imagen_art(art, primera="", permitir_banner=False, evitar=None, thumbs_ok=None):
    """Evita el banner del tablón y las fotos que NC reutiliza en varios avisos."""
    thumb, candidatas = _candidatas(art)
    evitar = evitar or set()
    thumbs_ok = thumbs_ok or set()
    for u in candidatas:
        if u not in evitar:
            return u
    if primera:
        u = _norm_img(primera)
        if u and u != thumb and u not in evitar:
            return u
    # Portada propia del post (thumbnailUrl único en la página) o banner de vídeo
    if thumb and thumb not in evitar and (thumb in thumbs_ok or permitir_banner):
        return thumb
    return ""


def sincronizar():
    """Trae lo nuevo o cambiado de cada tablón. Devuelve cuántas noticias se han guardado."""
    guardadas = 0
    existentes = {f["id"]: f["actualizado"] for f in db.todos("SELECT id, actualizado FROM noticias")}
    for idioma, region in IDIOMAS.items():
        for tablon in TABLONES:
            alias = "%s_%s" % (tablon, idioma)
            try:
                lista = _get("board/%s/article?page=1&size=12" % alias).get("contentList") or []
            except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
                continue
            # Fotos que NC reutiliza en varios posts = banners / cabeceras genéricas
            conteo, thumbs = {}, {}
            for art in lista:
                thumb, cands = _candidatas(art)
                if thumb:
                    thumbs[thumb] = thumbs.get(thumb, 0) + 1
                for u in cands:
                    conteo[u] = conteo.get(u, 0) + 1
            evitar = {u for u, n in conteo.items() if n > 1}
            thumbs_ok = {u for u, n in thumbs.items() if n == 1}
            for art in lista:
                aid = str(art.get("id") or "")
                if not re.match(r"^[0-9a-f]{16,40}$", aid):
                    continue
                ts = art.get("timestamps") or {}
                actualizado = _fecha(ts.get("updatedEpoch") or ts.get("postedEpoch"))
                banner_ok = tablon == "movie_clip"
                img_lista = _imagen_art(art, permitir_banner=banner_ok, evitar=evitar, thumbs_ok=thumbs_ok)
                if aid in existentes and existentes[aid] >= actualizado:
                    db.uno("UPDATE noticias SET imagen = %s WHERE id = %s RETURNING id", (img_lista, aid))
                    continue
                try:
                    det = _get("board/%s/article/%s" % (alias, aid))
                except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
                    continue
                fuente = (((det.get("article") or {}).get("content") or {}).get("content")) or ""
                contenido, primera = limpiar(fuente)
                imagen = _imagen_art(art, primera, permitir_banner=banner_ok, evitar=evitar, thumbs_ok=thumbs_ok)
                db.uno("""INSERT INTO noticias (id, tablon, idioma, titulo, resumen, imagen, contenido, texto_en, url, publicado, actualizado)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                          ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, resumen = EXCLUDED.resumen,
                            imagen = EXCLUDED.imagen, contenido = EXCLUDED.contenido, texto_en = EXCLUDED.texto_en,
                            url = EXCLUDED.url, actualizado = EXCLUDED.actualizado, leido = now()
                          RETURNING id""",
                       (aid, tablon, idioma, str(art.get("title") or "")[:300].strip(),
                        _resumen(contenido) or re.sub(r"\s+", " ", str(art.get("summary") or ""))[:400].strip(),
                        imagen, contenido[:300000],
                        idioma == "es" and _texto_en_ingles(contenido), _url(art, tablon, region),
                        _fecha(ts.get("postedEpoch")), actualizado))
                guardadas += 1
    db.uno("""INSERT INTO ajustes (clave, valor) VALUES ('noticias_sync', %s)
              ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
           (json.dumps({"guardadas": guardadas}),))
    return guardadas


def _hace_falta():
    if time.time() - _ultima["t"] < 60:
        return False
    _ultima["t"] = time.time()
    f = db.uno("SELECT extract(epoch FROM now() - cambiado) AS s FROM ajustes WHERE clave = 'noticias_sync'")
    return not f or f["s"] > CADA


def _en_segundo_plano():
    if not _lock.acquire(blocking=False):
        return
    try:
        sincronizar()
    except Exception:  # noqa: BLE001 - un fallo de NC no debe tirar la web
        pass
    finally:
        _lock.release()


def al_dia():
    """Si la copia tiene más de 15 minutos, la renueva sin hacer esperar a nadie. La primera vez sí espera."""
    if not _hace_falta():
        return
    vacia = not db.uno("SELECT 1 AS x FROM noticias LIMIT 1")
    if vacia:
        _en_segundo_plano()
    else:
        threading.Thread(target=_en_segundo_plano, daemon=True).start()
