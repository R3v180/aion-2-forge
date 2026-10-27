import hashlib
import json
import os
import random
import re
import secrets
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict, deque
from datetime import date, datetime, timedelta, timezone
from functools import wraps

from flask import Flask, abort, jsonify, request, send_from_directory, session
from psycopg.types.json import Jsonb
from werkzeug.security import check_password_hash, generate_password_hash

import db
import juego
import noticias
import ranking
import reglas
import seo
import tops_builds

RAIZ = db.RAIZ
CARPETAS_PUBLICAS = {"css", "js", "data", "icons", "i18n", "img"}
USUARIO_RE = re.compile(r"^[A-Za-z0-9_.-]{3,24}$")
ROLES_MOD = {"moderador", "admin", "superadmin"}
ROLES_ADMIN = {"admin", "superadmin"}
ROLES_ASIGNABLES = {"usuario", "moderador", "admin"}
CATEGORIAS_FORO = {"avisos", "presentaciones", "clases", "builds", "grupos", "reclutamiento", "offtopic"}

app = Flask(__name__, static_folder=None)
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY") or os.urandom(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("ENTORNO") == "produccion",
    PERMANENT_SESSION_LIFETIME=timedelta(days=30),
    MAX_CONTENT_LENGTH=512 * 1024,
)
db.crear_esquema()

# El escaparate de GitHub Pages solo puede leer la API pública, sin cookies
ORIGENES_ESCAPARATE = {"https://r3v180.github.io"}


def origen_cors_ok(origin):
    if not origin:
        return False
    if origin in ORIGENES_ESCAPARATE:
        return True
    # Preview estático local (python http.server / tools/preview_estatico.py)
    return origin.startswith("http://127.0.0.1:") or origin.startswith("http://localhost:")


@app.before_request
def cors_preflight_visita():
    """Escaparate / preview: permitir ping de visitas sin cookies."""
    if request.method != "OPTIONS" or request.path != "/api/visita":
        return None
    origin = request.headers.get("Origin")
    if not origen_cors_ok(origin):
        return ("", 204)
    resp = app.make_response(("", 204))
    resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Max-Age"] = "86400"
    resp.headers.add("Vary", "Origin")
    return resp


@app.after_request
def cors_escaparate(resp):
    origin = request.headers.get("Origin")
    if not origen_cors_ok(origin) or not request.path.startswith("/api/"):
        return resp
    if request.method == "GET" or request.path == "/api/visita":
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers.add("Vary", "Origin")
    return resp


# ---------- utilidades ----------
def error(msg, codigo=400):
    return jsonify({"error": msg}), codigo


def usuario_actual():
    uid = session.get("uid")
    if not uid:
        return None
    return db.uno("SELECT id, usuario, rol, expulsado_hasta FROM usuarios WHERE id = %s", (uid,))


def esta_expulsado(u):
    hasta = u and u.get("expulsado_hasta")
    return bool(hasta and hasta > datetime.now(timezone.utc))


def requiere_login(f):
    @wraps(f)
    def envoltura(*a, **k):
        u = usuario_actual()
        if not u:
            return error("no_autenticado", 401)
        if esta_expulsado(u):
            return error("expulsado", 403)
        return f(u, *a, **k)
    return envoltura


def requiere_escribir(f):
    """Escribir en el foro o el chat: cuenta real, no la de las builds de referencia."""
    @wraps(f)
    def envoltura(*a, **k):
        u = usuario_actual()
        if not u:
            return error("no_autenticado", 401)
        if esta_expulsado(u):
            return error("expulsado", 403)
        if u["rol"] == "sistema":
            return error("sin_permiso", 403)
        return f(u, *a, **k)
    return envoltura


def requiere_rol(*roles):
    def deco(f):
        @wraps(f)
        def envoltura(*a, **k):
            u = usuario_actual()
            if not u:
                return error("no_autenticado", 401)
            if esta_expulsado(u):
                return error("expulsado", 403)
            if u["rol"] not in roles:
                return error("sin_permiso", 403)
            return f(u, *a, **k)
        return envoltura
    return deco


def json_body():
    # exigir JSON también evita CSRF desde formularios de otras webs
    if not request.is_json:
        abort(415)
    return request.get_json(silent=True) or {}


_intentos = defaultdict(deque)


def limitar(clave, maximo=10, ventana=600):
    ahora = time.time()
    q = _intentos[clave]
    while q and ahora - q[0] > ventana:
        q.popleft()
    if len(q) >= maximo:
        return False
    q.append(ahora)
    return True


def es_fuente_top(fuente):
    return tops_builds.es_top(fuente)


def build_publica(fila, con_datos=True, mi_voto=None):
    es_top = es_fuente_top(fila.get("fuente"))
    b = {
        "id": fila["id"], "clase": fila["clase"], "nombre": fila["nombre"],
        # Tops: no JcE/JcJ (no lo sabemos). Comunidad/refs sí llevan modo.
        "modo": None if es_top else fila["modo"],
        "descripcion": fila["descripcion"], "publica": fila["publica"], "fuente": fila["fuente"],
        "autor": fila["autor"], "creado": fila["creado"].isoformat(), "actualizado": fila["actualizado"].isoformat(),
        "likes": int(fila.get("likes") or 0),
        "dislikes": int(fila.get("dislikes") or 0),
    }
    if es_top:
        pj = (fila.get("top_pj") or "").strip()
        if not pj and isinstance(fila.get("datos"), dict):
            pj = str(((fila["datos"].get("_top") or {}).get("nombre") or "")).strip()
        rank = fila.get("top_rank")
        if rank is None and isinstance(fila.get("datos"), dict):
            rank = (fila["datos"].get("_top") or {}).get("rank")
        semana = fila.get("top_semana") or (
            ((fila.get("datos") or {}).get("_top") or {}).get("semana") if isinstance(fila.get("datos"), dict) else None
        )
        b["top"] = {
            "nombre": pj or fila["nombre"],
            "rank": int(rank) if rank else None,
            "semana": semana,
            "vigente": tops_builds.es_top_live(fila.get("fuente")),
        }
        # Nombre limpio para UI (sin «Top #1 · …»)
        b["nombre"] = b["top"]["nombre"]
    if mi_voto is not None:
        b["mi_voto"] = mi_voto
    if con_datos:
        b["datos"] = fila["datos"]
    return b


SELECT_BUILD = """SELECT b.*, u.usuario AS autor,
  COALESCE((SELECT count(*)::int FROM build_votos v WHERE v.build_id = b.id AND v.valor = 1), 0) AS likes,
  COALESCE((SELECT count(*)::int FROM build_votos v WHERE v.build_id = b.id AND v.valor = -1), 0) AS dislikes,
  b.datos->'_top'->>'nombre' AS top_pj,
  NULLIF(b.datos->'_top'->>'rank', '')::int AS top_rank,
  b.datos->'_top'->>'semana' AS top_semana
  FROM builds b JOIN usuarios u ON u.id = b.usuario_id"""


def notificar(usuario_id, tipo, titulo, cuerpo="", url=""):
    if not usuario_id:
        return
    db.uno(
        """INSERT INTO notificaciones (usuario_id, tipo, titulo, cuerpo, url)
           VALUES (%s, %s, %s, %s, %s) RETURNING id""",
        (usuario_id, tipo, (titulo or "")[:120], (cuerpo or "")[:280], (url or "")[:200]),
    )


# ---------- cuenta ----------
@app.get("/api/yo")
def api_yo():
    u = usuario_actual()
    if not u:
        return jsonify({"usuario": None})
    datos = {"id": u["id"], "usuario": u["usuario"], "rol": u["rol"], "expulsado": esta_expulsado(u)}
    if u["rol"] in ROLES_MOD:
        n = db.uno("SELECT count(*) AS n FROM mod_casos WHERE estado = 'pendiente'")
        datos["pendientes"] = int(n["n"]) if n else 0
    n = db.uno("SELECT count(*) AS n FROM notificaciones WHERE usuario_id = %s AND NOT leida", (u["id"],))
    datos["notificaciones"] = int(n["n"]) if n else 0
    return jsonify({"usuario": datos})


TURNSTILE_SITE = (os.environ.get("TURNSTILE_SITE_KEY") or "").strip()
TURNSTILE_SECRET = (os.environ.get("TURNSTILE_SECRET_KEY") or "").strip()


def _ip_cliente():
    return (request.headers.get("X-Forwarded-For") or request.remote_addr or "").split(",")[0].strip() or "x"


def rate_clave(prefijo, u=None):
    """Límite por usuario si hay sesión; si no, por IP (Espía/Tops públicos)."""
    if u and u.get("id"):
        return f"{prefijo}:u:{u['id']}"
    return f"{prefijo}:ip:{_ip_cliente()}"


def verificar_turnstile(token):
    if not TURNSTILE_SECRET:
        return True
    token = str(token or "").strip()
    if not token:
        return False
    cuerpo = urllib.parse.urlencode({
        "secret": TURNSTILE_SECRET,
        "response": token,
        "remoteip": _ip_cliente(),
    }).encode()
    try:
        with urllib.request.urlopen(
            urllib.request.Request(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data=cuerpo,
                method="POST",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            ),
            timeout=8,
        ) as r:
            data = json.loads(r.read().decode() or "{}")
        return bool(data.get("success"))
    except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError):
        return False


def emitir_reto_humano():
    a, b = random.randint(2, 9), random.randint(1, 8)
    session["humano"] = {"r": a + b, "t": time.time()}
    return {"tipo": "suma", "pregunta": f"{a} + {b}"}


def anti_bot_registro(d):
    """Honeypot + tiempo mínimo + Turnstile (si hay clave) o reto de suma."""
    # Campo trampa: los bots suelen rellenarlo
    if str(d.get("web") or d.get("empresa") or d.get("url") or "").strip():
        return "bot"
    nacido = session.get("auth_nacido")
    if not isinstance(nacido, (int, float)) or time.time() - nacido < 2.5:
        return "bot"
    if TURNSTILE_SECRET:
        if not verificar_turnstile(d.get("captcha") or d.get("cf-turnstile-response")):
            return "captcha"
        return None
    humano = session.get("humano") or {}
    try:
        resp = int(str(d.get("humano") or "").strip())
    except (TypeError, ValueError):
        return "captcha"
    if not humano or humano.get("r") != resp or time.time() - float(humano.get("t") or 0) > 1800:
        return "captcha"
    session.pop("humano", None)
    return None


@app.get("/api/auth-reto")
def api_auth_reto():
    session["auth_nacido"] = time.time()
    out = {"turnstile": TURNSTILE_SITE or None}
    if not TURNSTILE_SECRET:
        out["humano"] = emitir_reto_humano()
    return jsonify(out)


@app.post("/api/registro")
def api_registro():
    d = json_body()
    if not limitar("registro:" + _ip_cliente(), 3, 3600):
        return error("demasiados_intentos", 429)
    if not d.get("acepto_legal"):
        return error("acepto_legal")
    fallo = anti_bot_registro(d)
    if fallo:
        return error(fallo, 400)
    usuario, clave = str(d.get("usuario", "")).strip(), str(d.get("clave", ""))
    if not USUARIO_RE.match(usuario):
        return error("usuario_invalido")
    if len(clave) < 8:
        return error("clave_corta")
    if db.uno("SELECT 1 FROM usuarios WHERE lower(usuario) = lower(%s)", (usuario,)):
        return error("usuario_existe", 409)
    u = db.uno("INSERT INTO usuarios (usuario, clave_hash) VALUES (%s, %s) RETURNING id",
               (usuario, generate_password_hash(clave)))
    session.clear()
    session.permanent = True
    session["uid"] = u["id"]
    return jsonify({"ok": True})


@app.post("/api/entrar")
def api_entrar():
    d = json_body()
    # Honeypot también en login (sin captcha visual para no molestar)
    if str(d.get("web") or d.get("empresa") or "").strip():
        return error("credenciales", 401)
    usuario, clave = str(d.get("usuario", "")).strip(), str(d.get("clave", ""))
    if not limitar("entrar:" + _ip_cliente() + ":" + usuario.lower(), 8, 600):
        return error("demasiados_intentos", 429)
    u = db.uno("SELECT id, clave_hash, expulsado_hasta FROM usuarios WHERE lower(usuario) = lower(%s)", (usuario,))
    if not u or not check_password_hash(u["clave_hash"], clave):
        return error("credenciales", 401)
    if esta_expulsado(u):
        return error("expulsado", 403)
    session.clear()
    session.permanent = True
    session["uid"] = u["id"]
    return jsonify({"ok": True})


@app.post("/api/salir")
def api_salir():
    json_body()
    session.clear()
    return jsonify({"ok": True})


@app.post("/api/clave")
@requiere_login
def api_clave(u):
    d = json_body()
    fila = db.uno("SELECT clave_hash FROM usuarios WHERE id = %s", (u["id"],))
    if not check_password_hash(fila["clave_hash"], str(d.get("actual", ""))):
        return error("credenciales", 401)
    nueva = str(d.get("nueva", ""))
    if len(nueva) < 8:
        return error("clave_corta")
    db.uno("UPDATE usuarios SET clave_hash = %s WHERE id = %s RETURNING id", (generate_password_hash(nueva), u["id"]))
    return jsonify({"ok": True})


def _usuario_anonimo():
    """Cuenta técnica para dejar foro legible tras un borrado de cuenta."""
    nombre = "Cuenta eliminada"
    f = db.uno("SELECT id FROM usuarios WHERE lower(usuario) = lower(%s)", (nombre,))
    if f:
        return f["id"]
    f = db.uno(
        "INSERT INTO usuarios (usuario, clave_hash, rol) VALUES (%s, %s, 'sistema') RETURNING id",
        (nombre, generate_password_hash(secrets.token_urlsafe(24))),
    )
    return f["id"]


@app.post("/api/cuenta/borrar")
@requiere_login
def api_borrar_cuenta(u):
    """Derecho de supresión: borra la cuenta y datos personales. Foro → anonimizado."""
    if u["rol"] == "sistema" or str(u["usuario"]).lower() in ("admin", "orden celeste", "cuenta eliminada"):
        return error("cuenta_protegida", 403)
    d = json_body()
    fila = db.uno("SELECT clave_hash FROM usuarios WHERE id = %s", (u["id"],))
    if not fila or not check_password_hash(fila["clave_hash"], str(d.get("clave", ""))):
        return error("credenciales", 401)
    conf = str(d.get("confirmacion") or "").strip().upper()
    if conf not in ("BORRAR", "DELETE"):
        return error("confirmacion_borrar")
    uid = u["id"]
    anon = _usuario_anonimo()
    # Foro/chat: no romper hilos ajenos; se anonimiza la autoría
    db.todos("UPDATE temas SET usuario_id = %s WHERE usuario_id = %s RETURNING id", (anon, uid))
    db.todos("UPDATE mensajes SET usuario_id = %s WHERE usuario_id = %s RETURNING id", (anon, uid))
    db.todos("DELETE FROM chat WHERE usuario_id = %s RETURNING id", (uid,))
    db.todos("DELETE FROM denuncias WHERE usuario_id = %s RETURNING id", (uid,))
    # builds, personajes, votos, notifs, reacciones, apuntados → CASCADE
    if not db.uno("DELETE FROM usuarios WHERE id = %s RETURNING id", (uid,)):
        return error("no_existe", 404)
    session.clear()
    return jsonify({"ok": True})


# ---------- builds ----------
@app.get("/api/builds")
def api_builds_publicas():
    tops_builds.al_dia()
    clase, modo, q = request.args.get("clase"), request.args.get("modo"), (request.args.get("q") or "").strip()
    sql, params = SELECT_BUILD + " WHERE b.publica", []
    if clase in reglas.CLASES:
        sql += " AND b.clase = %s"
        params.append(clase)
    if modo in reglas.MODOS:
        # JcE/JcJ/… solo aplica a builds de la gente (y referencias). Los tops no tienen modo de juego.
        sql += " AND (b.fuente IS NULL OR b.fuente NOT LIKE %s) AND b.modo = %s"
        params.extend(["top:%", modo])
    if q:
        sql += " AND (b.nombre ILIKE %s OR u.usuario ILIKE %s)"
        params += ["%" + q[:60] + "%"] * 2
    # Tops de la semana → ex-tops (votos conservados) → resto por likes
    sql += """ ORDER BY CASE
                 WHEN b.fuente LIKE %s THEN 0
                 WHEN b.fuente LIKE %s THEN 1
                 ELSE 2 END,
               likes DESC, b.actualizado DESC LIMIT 200"""
    params.extend(["top:live:%", "top:was:%"])
    return jsonify([build_publica(f, False) for f in db.todos(sql, params)])


def resumen_build(datos):
    """Cifras cortas para la lista, sin enviar la build entera."""
    if not isinstance(datos, dict):
        datos = {}
    habs = datos.get("habilidades") or {}
    aprendidas = sum(1 for v in habs.values() if isinstance(v, dict) and v.get("nivel")) if isinstance(habs, dict) else 0
    presets = datos.get("presets") or []
    nodos = 0
    dae = datos.get("daevanion") or {}
    if isinstance(dae, dict):
        for p in dae.get("presets") or []:
            if isinstance(p, dict):
                nodos = max(nodos, len(p.get("nodos") or []))
    return {
        "habilidades": aprendidas,
        "presets": len(presets) if isinstance(presets, list) else 0,
        "daevanion": nodos,
    }


@app.get("/api/mis-builds")
@requiere_login
def api_mis_builds(u):
    filas = db.todos("""SELECT b.*, u.usuario AS autor, p.nombre AS pj_nombre, p.servidor AS pj_servidor
                        FROM builds b JOIN usuarios u ON u.id = b.usuario_id
                        LEFT JOIN personajes p ON p.id = b.personaje_id
                        WHERE b.usuario_id = %s ORDER BY b.actualizado DESC""", (u["id"],))
    salida = []
    for f in filas:
        b = build_publica(f, False)
        b["resumen"] = resumen_build(f["datos"])
        if f.get("pj_nombre"):
            b["personaje"] = {"nombre": f["pj_nombre"], "servidor": f["pj_servidor"]}
        salida.append(b)
    return jsonify(salida)


def hermanas_de(personaje_id, propio, excluir_id=None, usuario_id=None, clase=None):
    """Otras builds del mismo personaje, o del dueño y la misma clase. El visitante que no es dueño solo ve las públicas."""
    if usuario_id and clase:
        if excluir_id:
            filas = db.todos("""SELECT id, nombre, modo, publica FROM builds
                                WHERE usuario_id = %s AND clase = %s AND id <> %s ORDER BY actualizado DESC""",
                             (usuario_id, clase, excluir_id))
        else:
            filas = db.todos("""SELECT id, nombre, modo, publica FROM builds
                                WHERE usuario_id = %s AND clase = %s ORDER BY actualizado DESC""",
                             (usuario_id, clase))
    elif excluir_id:
        filas = db.todos("""SELECT id, nombre, modo, publica FROM builds
                            WHERE personaje_id = %s AND id <> %s ORDER BY actualizado DESC""",
                         (personaje_id, excluir_id))
    else:
        filas = db.todos("""SELECT id, nombre, modo, publica FROM builds
                            WHERE personaje_id = %s ORDER BY actualizado DESC""", (personaje_id,))
    if not propio:
        filas = [h for h in filas if h["publica"]]
    return [{"id": h["id"], "nombre": h["nombre"], "modo": h["modo"], "publica": h["publica"]} for h in filas]


@app.get("/api/builds/<int:bid>")
def api_build(bid):
    f = db.uno(SELECT_BUILD + " WHERE b.id = %s", (bid,))
    u = usuario_actual()
    propia = bool(u and f and f["usuario_id"] == u["id"])
    if not f or not (f["publica"] or propia):
        return error("no_existe", 404)
    mi_voto = 0
    if u:
        v = db.uno("SELECT valor FROM build_votos WHERE build_id = %s AND usuario_id = %s", (bid, u["id"]))
        mi_voto = int(v["valor"]) if v else 0
    b = build_publica(f, mi_voto=mi_voto)
    b["propia"] = propia
    b["personaje"] = None
    b["hermanas"] = []
    if f.get("personaje_id"):
        p = db.uno("SELECT * FROM personajes WHERE id = %s", (f["personaje_id"],))
        ver = p and (propia or (p["publica_equipo"] and f["publica"]))
        if ver:
            b["personaje"] = {
                "id": p["id"], "nombre": p["nombre"], "servidor": p["servidor"], "clase": p["clase"],
                "nivel": p["nivel"], "poder": p["poder"], "publica_equipo": p["publica_equipo"],
                "leido": iso(p["leido"]), "ficha": juego.completar_ficha(p["clase"], p["ficha"] or {}),
            }
            b["hermanas"] = hermanas_de(p["id"], propia, f["id"])
    # Enlace vivo Espía si es build Top
    top = (f.get("datos") or {}).get("_top") if isinstance(f.get("datos"), dict) else None
    if es_fuente_top(f.get("fuente")) and isinstance(top, dict) and top.get("character_id"):
        b["top"] = {
            "rank": top.get("rank"), "character_id": top.get("character_id"),
            "server_id": top.get("server_id"), "poder": top.get("poder"),
            "nombre": top.get("nombre"), "servidor": top.get("servidor"),
            "semana": top.get("semana"), "vigente": bool(top.get("vigente")),
        }
        b["modo"] = None  # no inventar JcE/JcJ en tops
    return jsonify(b)


@app.post("/api/builds/<int:bid>/voto")
@requiere_login
def api_votar_build(u, bid):
    """valor: 1 like, -1 dislike, 0 quitar. Solo registrados; no en builds propias."""
    if u["rol"] == "sistema":
        return error("no_permitido", 403)
    f = db.uno("SELECT id, usuario_id, nombre, publica FROM builds WHERE id = %s", (bid,))
    if not f or not f["publica"]:
        return error("no_existe", 404)
    if f["usuario_id"] == u["id"]:
        return error("voto_propia", 400)
    d = json_body()
    try:
        valor = int(d.get("valor", 0))
    except (TypeError, ValueError):
        return error("dato_invalido")
    if valor not in (-1, 0, 1):
        return error("dato_invalido")
    anterior = db.uno("SELECT valor FROM build_votos WHERE build_id = %s AND usuario_id = %s", (bid, u["id"]))
    prev = int(anterior["valor"]) if anterior else 0
    if valor == 0:
        db.uno("DELETE FROM build_votos WHERE build_id = %s AND usuario_id = %s RETURNING build_id", (bid, u["id"]))
    else:
        db.uno(
            """INSERT INTO build_votos (build_id, usuario_id, valor) VALUES (%s, %s, %s)
               ON CONFLICT (build_id, usuario_id) DO UPDATE SET valor = EXCLUDED.valor, creado = now()
               RETURNING build_id""",
            (bid, u["id"], valor),
        )
        # Notificar solo likes nuevos (no dislikes ni quitar)
        if valor == 1 and prev != 1:
            notificar(
                f["usuario_id"], "build_like",
                f"{u['usuario']} · me gusta",
                f"Le gusta tu build «{f['nombre']}».",
                f"build.html?id={bid}",
            )
    cont = db.uno(
        """SELECT
             COALESCE(sum(CASE WHEN valor = 1 THEN 1 ELSE 0 END), 0)::int AS likes,
             COALESCE(sum(CASE WHEN valor = -1 THEN 1 ELSE 0 END), 0)::int AS dislikes
           FROM build_votos WHERE build_id = %s""",
        (bid,),
    )
    return jsonify({"ok": True, "mi_voto": valor, "likes": cont["likes"], "dislikes": cont["dislikes"]})


@app.get("/api/notificaciones")
@requiere_login
def api_notificaciones(u):
    try:
        limite = min(40, max(1, int(request.args.get("limit") or 20)))
    except (TypeError, ValueError):
        limite = 20
    filas = db.todos(
        """SELECT id, tipo, titulo, cuerpo, url, leida, creado
           FROM notificaciones WHERE usuario_id = %s
           ORDER BY creado DESC LIMIT %s""",
        (u["id"], limite),
    )
    return jsonify([
        {
            "id": f["id"], "tipo": f["tipo"], "titulo": f["titulo"], "cuerpo": f["cuerpo"],
            "url": f["url"], "leida": f["leida"], "creado": f["creado"].isoformat(),
        }
        for f in filas
    ])


@app.post("/api/notificaciones/leer")
@requiere_login
def api_notificaciones_leer(u):
    d = json_body()
    if d.get("todas"):
        db.uno(
            "UPDATE notificaciones SET leida = TRUE WHERE usuario_id = %s AND NOT leida RETURNING id",
            (u["id"],),
        )
    else:
        ids = [int(x) for x in (d.get("ids") or []) if str(x).isdigit()][:40]
        if ids:
            db.uno(
                "UPDATE notificaciones SET leida = TRUE WHERE usuario_id = %s AND id = ANY(%s) RETURNING id",
                (u["id"], ids),
            )
    n = db.uno("SELECT count(*) AS n FROM notificaciones WHERE usuario_id = %s AND NOT leida", (u["id"],))
    return jsonify({"ok": True, "notificaciones": int(n["n"]) if n else 0})


def campos_build(d, actual=None, admin=False):
    actual = actual or {}
    clase = actual.get("clase") or d.get("clase")
    if clase not in reglas.CLASES:
        raise ValueError("clase_invalida")
    nombre = str(d.get("nombre", actual.get("nombre", ""))).strip()[:80]
    if not nombre:
        raise ValueError("nombre_vacio")
    modo = d.get("modo", actual.get("modo", "pve"))
    if modo not in reglas.MODOS:
        modo = "pve"
    return {
        "clase": clase, "nombre": nombre, "modo": modo,
        "descripcion": str(d.get("descripcion", actual.get("descripcion", "")))[:4000],
        "publica": bool(d.get("publica", actual.get("publica", False))),
        "datos": reglas.limpiar_datos(clase, d.get("datos", actual.get("datos", {})), admin),
    }


@app.post("/api/builds")
@requiere_login
def api_crear_build(u):
    try:
        c = campos_build(json_body(), admin=u["rol"] in ROLES_ADMIN)
    except ValueError as e:
        return error(str(e))
    if (db.uno("SELECT count(*) AS n FROM builds WHERE usuario_id = %s", (u["id"],))["n"]) >= 100:
        return error("limite_builds")
    f = db.uno("""INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, datos)
                  VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
               (u["id"], c["clase"], c["nombre"], c["modo"], c["descripcion"], c["publica"], Jsonb(c["datos"])))
    return jsonify({"id": f["id"]}), 201


@app.put("/api/builds/<int:bid>")
@requiere_login
def api_guardar_build(u, bid):
    actual = db.uno("SELECT * FROM builds WHERE id = %s AND usuario_id = %s", (bid, u["id"]))
    if not actual:
        return error("no_existe", 404)
    d = json_body()
    # Solo cambiar visibilidad: no reescribir datos (Mis builds / interruptor rápido).
    if "publica" in d and not any(k in d for k in ("nombre", "modo", "descripcion", "datos", "clase")):
        pub = bool(d.get("publica"))
        db.uno("UPDATE builds SET publica = %s, actualizado = now() WHERE id = %s RETURNING id", (pub, bid))
        return jsonify({"ok": True, "publica": pub})
    try:
        c = campos_build(d, actual, admin=u["rol"] in ROLES_ADMIN)
    except ValueError as e:
        return error(str(e))
    db.uno("""UPDATE builds SET nombre = %s, modo = %s, descripcion = %s, publica = %s, datos = %s, actualizado = now()
              WHERE id = %s RETURNING id""",
           (c["nombre"], c["modo"], c["descripcion"], c["publica"], Jsonb(c["datos"]), bid))
    return jsonify({"ok": True, "publica": c["publica"]})


@app.delete("/api/builds/<int:bid>")
@requiere_login
def api_borrar_build(u, bid):
    if not db.uno("DELETE FROM builds WHERE id = %s AND usuario_id = %s RETURNING id", (bid, u["id"])):
        return error("no_existe", 404)
    return jsonify({"ok": True})


@app.post("/api/builds/<int:bid>/copiar")
@requiere_login
def api_copiar_build(u, bid):
    f = db.uno("SELECT * FROM builds WHERE id = %s AND (publica OR usuario_id = %s)", (bid, u["id"]))
    if not f:
        return error("no_existe", 404)
    datos = reglas.limpiar_datos(f["clase"], f["datos"])
    mismo = f["usuario_id"] == u["id"]
    n = db.uno("""INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, datos, personaje_id)
                  VALUES (%s, %s, %s, %s, %s, FALSE, %s, %s) RETURNING id""",
               (u["id"], f["clase"], (f["nombre"] + " (copia)")[:80], f["modo"], f["descripcion"], Jsonb(datos),
                f.get("personaje_id") if mismo else None))
    return jsonify({"id": n["id"]}), 201


def _guardar_personaje(u, leido):
    ficha = leido["ficha"]
    grupos = {"equipo": ("equipo", "stats_equipo", "sin_detalle"), "habilidades": ("habilidades",),
              "nodos": ("nodos", "bonus", "stats_nodos")}
    huecos = [g for g in grupos if not ficha.get(g)]
    if huecos:
        # NC a veces devuelve listas vacías aunque el personaje las tenga: se conserva lo último bueno
        antes = db.uno("SELECT ficha FROM personajes WHERE usuario_id = %s AND character_id = %s AND server_id = %s",
                       (u["id"], leido["character_id"], leido["server_id"]))
        previa = (antes or {}).get("ficha") or {}
        for g in huecos:
            if previa.get(g):
                for k in grupos[g]:
                    if k in previa:
                        ficha[k] = previa[k]
    fila = db.uno("""INSERT INTO personajes
                       (usuario_id, character_id, server_id, nombre, servidor, clase, nivel, poder, leido, ficha)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, now(), %s)
                     ON CONFLICT (usuario_id, character_id, server_id) DO UPDATE SET
                       nombre = EXCLUDED.nombre, servidor = EXCLUDED.servidor, clase = EXCLUDED.clase,
                       nivel = EXCLUDED.nivel, poder = EXCLUDED.poder, leido = now(), ficha = EXCLUDED.ficha
                     RETURNING id, publica_equipo""",
                  (u["id"], leido["character_id"], leido["server_id"], leido["nombre"], leido["servidor"],
                   leido["clase"], leido["nivel"], leido["poder"], Jsonb(ficha)))
    conocidas = reglas.catalogo(leido["clase"])
    nuevas = sorted(sid for sid in (ficha.get("habilidades") or {}) if sid not in conocidas)
    if nuevas:
        avisos = ajuste("habilidades_nuevas", {}) or {}
        avisos[leido["clase"]] = sorted(set(avisos.get(leido["clase"], [])) | set(nuevas))[:200]
        db.uno("""INSERT INTO ajustes (clave, valor) VALUES ('habilidades_nuevas', %s)
                  ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
               (json.dumps(avisos),))
    return fila


def _crear_desde_personaje(u, pid, nombre, modo):
    p = db.uno("SELECT * FROM personajes WHERE id = %s AND usuario_id = %s", (pid, u["id"]))
    if not p:
        return error("no_existe", 404)
    if (db.uno("SELECT count(*) AS n FROM builds WHERE usuario_id = %s", (u["id"],))["n"]) >= 100:
        return error("limite_builds")
    nombre = (str(nombre or p["nombre"]).strip() or p["nombre"])[:80]
    if modo not in reglas.MODOS:
        modo = "pve"
    datos = juego.datos_desde_ficha(p["clase"], p["ficha"], p["nivel"])
    f = db.uno("""INSERT INTO builds (usuario_id, clase, nombre, modo, publica, datos, personaje_id)
                  VALUES (%s, %s, %s, %s, FALSE, %s, %s) RETURNING id""",
               (u["id"], p["clase"], nombre, modo, Jsonb(datos), p["id"]))
    return jsonify({"id": f["id"]}), 201


@app.get("/api/juego/servidores")
def api_juego_servidores():
    return jsonify(juego.SERVIDORES_EU)


def _carnet_ranking(p):
    """Normaliza un dict ligero para ranking_pj (sin ficha completa)."""
    if not isinstance(p, dict):
        return None
    cid = str(p.get("character_id") or "").strip()
    if not juego.CID_RE.match(cid):
        return None
    try:
        sid = int(p.get("server_id") or 0)
    except (TypeError, ValueError):
        return None
    if sid <= 0:
        return None
    ficha = p.get("ficha") if isinstance(p.get("ficha"), dict) else {}
    servidor = str(p.get("servidor") or "")[:40]
    raza = str(p.get("raza") or ficha.get("raza") or "")[:16]
    if raza not in ("elyos", "asmodian"):
        raza = juego.raza_servidor(sid, servidor) or ""
    imagen = str(p.get("imagen") or ficha.get("imagen") or "")[:300]
    if imagen and not imagen.startswith("https://"):
        imagen = ""
    ilvl = p.get("nivel_objeto")
    if ilvl is None and ficha:
        ilvl = ficha.get("nivel_objeto")
    try:
        ilvl = int(ilvl) if ilvl not in (None, "") else None
    except (TypeError, ValueError):
        ilvl = None
    try:
        poder = int(p["poder"]) if p.get("poder") not in (None, "") else None
    except (TypeError, ValueError):
        poder = None
    try:
        nivel = int(p["nivel"]) if p.get("nivel") not in (None, "") else None
    except (TypeError, ValueError):
        nivel = None
    return {
        "character_id": cid,
        "server_id": sid,
        "nombre": str(p.get("nombre") or "")[:40],
        "servidor": servidor,
        "clase": str(p.get("clase") or "")[:24],
        "raza": raza if raza in ("elyos", "asmodian") else "",
        "nivel": nivel,
        "poder": poder,
        "nivel_objeto": ilvl,
        "imagen": imagen,
    }


def registrar_ranking(filas):
    """UPSERT best-effort del carnet ligero. No propaga errores."""
    if not filas:
        return
    if isinstance(filas, dict):
        filas = [filas]
    sql = """INSERT INTO ranking_pj
             (character_id, server_id, nombre, servidor, clase, raza, nivel, poder, nivel_objeto, imagen, actualizado)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now())
             ON CONFLICT (character_id, server_id) DO UPDATE SET
               nombre = CASE WHEN EXCLUDED.nombre <> '' THEN EXCLUDED.nombre ELSE ranking_pj.nombre END,
               servidor = CASE WHEN EXCLUDED.servidor <> '' THEN EXCLUDED.servidor ELSE ranking_pj.servidor END,
               clase = CASE WHEN EXCLUDED.clase <> '' THEN EXCLUDED.clase ELSE ranking_pj.clase END,
               raza = CASE WHEN EXCLUDED.raza <> '' THEN EXCLUDED.raza ELSE ranking_pj.raza END,
               nivel = COALESCE(EXCLUDED.nivel, ranking_pj.nivel),
               poder = COALESCE(EXCLUDED.poder, ranking_pj.poder),
               nivel_objeto = COALESCE(EXCLUDED.nivel_objeto, ranking_pj.nivel_objeto),
               imagen = CASE WHEN EXCLUDED.imagen <> '' THEN EXCLUDED.imagen ELSE ranking_pj.imagen END,
               actualizado = now()
             RETURNING character_id"""
    for bruto in filas:
        c = _carnet_ranking(bruto)
        if not c:
            continue
        try:
            db.uno(sql, (
                c["character_id"], c["server_id"], c["nombre"], c["servidor"], c["clase"], c["raza"],
                c["nivel"], c["poder"], c["nivel_objeto"], c["imagen"],
            ))
        except Exception:
            pass


@app.get("/api/juego/buscar")
def api_juego_buscar():
    # Público (SEO / sin cuenta). Filtros + poder hacen más trabajo.
    u = usuario_actual()
    if not limitar(rate_clave("juego", u), 40, 600):
        return error("demasiados_intentos", 429)
    ordenar = str(request.args.get("ordenar") or "") in ("poder", "1", "true")
    poder_min = request.args.get("poder_min")
    if ordenar or poder_min:
        if not limitar(rate_clave("juego_poder", u), 12, 600):
            return error("demasiados_intentos", 429)
    try:
        data = juego.buscar(
            request.args.get("q"),
            clase=request.args.get("clase"),
            server_id=request.args.get("server"),
            raza=request.args.get("raza"),
            nivel=request.args.get("nivel"),
            page=request.args.get("page") or 1,
            size=request.args.get("size") or 20,
            poder_min=poder_min,
            ordenar_poder=ordenar,
        )
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    registrar_ranking(data.get("lista") or [])
    return jsonify(data)


@app.get("/api/juego/ficha")
def api_juego_ficha():
    """Ficha pública de cualquier personaje para el comparador. No se guarda ni se vincula."""
    u = usuario_actual()
    if not limitar(rate_clave("verjuego", u), 20, 600):
        return error("demasiados_intentos", 429)
    try:
        leido = juego.leer(request.args.get("cid"), request.args.get("server"))
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    leido["ficha"] = juego.completar_ficha(leido["clase"], leido.get("ficha") or {})
    registrar_ranking(leido)
    return jsonify({**leido, "leido": datetime.now(timezone.utc).isoformat()})


@app.get("/api/juego/vista")
def api_juego_vista():
    """Build en solo lectura de cualquier personaje (Espía Builds). No se guarda ni se vincula."""
    u = usuario_actual()
    if not limitar(rate_clave("verjuego", u), 20, 600):
        return error("demasiados_intentos", 429)
    try:
        leido = juego.leer(request.args.get("cid"), request.args.get("server"))
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    ficha = juego.completar_ficha(leido["clase"], leido.get("ficha") or {})
    cuando = datetime.now(timezone.utc).isoformat()
    registrar_ranking({**leido, "ficha": ficha, "nivel_objeto": ficha.get("nivel_objeto")})
    tops_builds.al_dia()
    return jsonify({
        "id": None, "juego": True, "espia": True, "propia": False, "publica": False, "fuente": None,
        "clase": leido["clase"], "nombre": leido["nombre"], "modo": None, "descripcion": "",
        "autor": "AION 2", "creado": cuando, "actualizado": cuando,
        "datos": juego.datos_desde_ficha(leido["clase"], ficha, leido.get("nivel")),
        "personaje": {
            "id": None, "nombre": leido["nombre"], "servidor": leido["servidor"], "clase": leido["clase"],
            "nivel": leido.get("nivel"), "poder": leido.get("poder"), "raza": leido.get("raza") or ficha.get("raza"),
            "publica_equipo": False, "leido": cuando, "ficha": ficha, "propio": False,
            "character_id": leido.get("character_id"), "server_id": leido.get("server_id"),
        },
        "hermanas": [],
        "palmares": tops_builds.palmares(leido.get("character_id"), leido.get("server_id")),
    })


@app.get("/api/tops")
def api_tops():
    """Ranking comunitario de carnets avistados en Espía (no es el top oficial de NC)."""
    u = usuario_actual()
    if not limitar(rate_clave("tops", u), 40, 600):
        return error("demasiados_intentos", 429)
    # Refresco suave en background: ≤40 fichas/h, solo si llevan ≥18 h sin actualizar
    ranking.al_dia()
    ambito = str(request.args.get("ambito") or "eu").lower()
    if ambito not in ("eu", "elyos", "asmodian", "server"):
        ambito = "eu"
    orden = str(request.args.get("orden") or "poder").lower()
    if orden not in ("poder", "ilvl"):
        orden = "poder"
    clase = str(request.args.get("clase") or "").strip()
    if clase and clase not in reglas.CLASES:
        clase = ""
    try:
        server_id = int(request.args.get("server") or 0) if ambito == "server" else None
    except (TypeError, ValueError):
        server_id = None
    if ambito == "server" and not server_id:
        return error("servidor_invalido")
    try:
        limit = min(100, max(1, int(request.args.get("limit") or 50)))
    except (TypeError, ValueError):
        limit = 50

    where, params = ["1=1"], []
    if ambito in ("elyos", "asmodian"):
        where.append("raza = %s")
        params.append(ambito)
    elif ambito == "server":
        where.append("server_id = %s")
        params.append(server_id)
    if clase:
        where.append("clase = %s")
        params.append(clase)
    # Solo filas con la métrica pedida
    if orden == "ilvl":
        where.append("nivel_objeto IS NOT NULL AND nivel_objeto > 0")
        order_sql = "nivel_objeto DESC NULLS LAST, poder DESC NULLS LAST, nombre ASC"
    else:
        where.append("poder IS NOT NULL AND poder > 0")
        order_sql = "poder DESC NULLS LAST, nivel_objeto DESC NULLS LAST, nombre ASC"

    sql = ("SELECT character_id, server_id, nombre, servidor, clase, raza, nivel, poder, nivel_objeto, imagen, actualizado "
           "FROM ranking_pj WHERE " + " AND ".join(where) + " ORDER BY " + order_sql + " LIMIT %s")
    params.append(limit)
    filas = db.todos(sql, tuple(params))
    total_n = db.uno(
        "SELECT count(*) AS n FROM ranking_pj WHERE " + " AND ".join(where),
        tuple(params[:-1]),
    )
    lista = []
    for i, f in enumerate(filas or [], 1):
        lista.append({
            "puesto": i,
            "character_id": f["character_id"],
            "server_id": f["server_id"],
            "nombre": f["nombre"],
            "servidor": f["servidor"],
            "clase": f["clase"],
            "raza": f["raza"],
            "nivel": f["nivel"],
            "poder": f["poder"],
            "nivel_objeto": f["nivel_objeto"],
            "imagen": f["imagen"],
            "actualizado": iso(f["actualizado"]),
        })
    return jsonify({
        "lista": lista,
        "total": int((total_n or {}).get("n") or 0),
        "ambito": ambito,
        "orden": orden,
        "clase": clase or None,
        "server_id": server_id,
    })


@app.get("/api/mis-personajes")
@requiere_login
def api_mis_personajes(u):
    filas = db.todos("""SELECT id, nombre, servidor, clase, nivel, poder, leido, ficha FROM personajes
                        WHERE usuario_id = %s ORDER BY leido DESC NULLS LAST""", (u["id"],))
    return jsonify([{**f, "leido": iso(f["leido"]), "ficha": juego.completar_ficha(f["clase"], f["ficha"] or {})} for f in filas])


@app.post("/api/juego/vincular")
@requiere_login
def api_juego_vincular(u):
    d = json_body()
    if not limitar("leerjuego:" + str(u["id"]), 8, 600):
        return error("demasiados_intentos", 429)
    try:
        leido = juego.leer(d.get("character_id"), d.get("server_id"))
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    accion = d.get("accion") if d.get("accion") in ("vincular", "crear") else "vincular"
    if accion == "vincular":
        try:
            bid = int(d.get("build_id"))
        except (TypeError, ValueError):
            return error("no_existe", 404)
        build = db.uno("SELECT id, clase FROM builds WHERE id = %s AND usuario_id = %s", (bid, u["id"]))
        if not build:
            return error("no_existe", 404)
        if build["clase"] != leido["clase"]:
            return jsonify({"error": "clase_distinta", "clase": leido["clase"], "nombre": leido["nombre"],
                            "servidor": leido["servidor"]}), 409
        p = _guardar_personaje(u, leido)
        db.uno("UPDATE builds SET personaje_id = %s WHERE id = %s RETURNING id", (p["id"], bid))
        return jsonify({"ok": True, "id": bid})
    p = _guardar_personaje(u, leido)
    return _crear_desde_personaje(u, p["id"], d.get("nombre") or leido["nombre"], d.get("modo"))


@app.post("/api/builds/<int:bid>/desvincular")
@requiere_login
def api_desvincular(u, bid):
    json_body()
    if not db.uno("UPDATE builds SET personaje_id = NULL WHERE id = %s AND usuario_id = %s RETURNING id", (bid, u["id"])):
        return error("no_existe", 404)
    return jsonify({"ok": True})


@app.post("/api/personajes/<int:pid>/refrescar")
@requiere_login
def api_refrescar_personaje(u, pid):
    json_body()
    p = db.uno("SELECT character_id, server_id FROM personajes WHERE id = %s AND usuario_id = %s", (pid, u["id"]))
    if not p:
        return error("no_existe", 404)
    if not limitar("leerjuego:" + str(u["id"]), 8, 600):
        return error("demasiados_intentos", 429)
    try:
        leido = juego.leer(p["character_id"], p["server_id"], forzar=True)
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    _guardar_personaje(u, leido)
    return jsonify({"ok": True})


@app.post("/api/personajes/<int:pid>/equipo-publico")
@requiere_login
def api_equipo_publico(u, pid):
    d = json_body()
    if not db.uno("UPDATE personajes SET publica_equipo = %s WHERE id = %s AND usuario_id = %s RETURNING id",
                  (bool(d.get("publica")), pid, u["id"])):
        return error("no_existe", 404)
    return jsonify({"ok": True})


@app.post("/api/personajes/<int:pid>/builds")
@requiere_login
def api_build_de_personaje(u, pid):
    d = json_body()
    return _crear_desde_personaje(u, pid, d.get("nombre"), d.get("modo"))


@app.get("/api/personajes/<int:pid>/build")
def api_build_del_juego(pid):
    p = db.uno("""SELECT p.*, u.usuario AS autor FROM personajes p JOIN usuarios u ON u.id = p.usuario_id
                  WHERE p.id = %s""", (pid,))
    u = usuario_actual()
    propio = bool(p and u and u["id"] == p["usuario_id"])
    if not p or not (propio or p["publica_equipo"]):
        return error("no_existe", 404)
    leido = iso(p["leido"])
    ficha = juego.completar_ficha(p["clase"], p["ficha"] or {})
    return jsonify({
        "id": None, "juego": True, "propia": False, "publica": False, "fuente": None,
        "clase": p["clase"], "nombre": p["nombre"], "modo": "pve", "descripcion": "", "autor": p["autor"],
        "creado": leido, "actualizado": leido,
        "datos": juego.datos_desde_ficha(p["clase"], ficha, p["nivel"]),
        "personaje": {
            "id": p["id"], "nombre": p["nombre"], "servidor": p["servidor"], "clase": p["clase"],
            "nivel": p["nivel"], "poder": p["poder"], "publica_equipo": p["publica_equipo"],
            "leido": leido, "ficha": ficha, "propio": propio,
        },
        "hermanas": hermanas_de(p["id"], propio, usuario_id=p["usuario_id"], clase=p["clase"]),
    })


def _ruta_visita(raw):
    s = str(raw or "/").strip() or "/"
    s = s.split("?")[0].split("#")[0]
    if ".." in s or "/api" in s:
        return "/index.html"
    nombre = (s.rsplit("/", 1)[-1] or "index.html").lower()
    if not nombre.endswith(".html"):
        nombre = "index.html"
    if not re.match(r"^[a-z0-9._-]{1,64}\.html$", nombre):
        nombre = "index.html"
    return "/" + nombre


def _clave_visita(vid):
    vid = re.sub(r"[^a-zA-Z0-9_-]", "", str(vid or ""))[:64]
    ip = (request.headers.get("X-Forwarded-For") or request.remote_addr or "").split(",")[0].strip()
    ua = (request.headers.get("User-Agent") or "")[:160]
    base = vid or f"{ip}|{ua}"
    secreto = app.config["SECRET_KEY"]
    if isinstance(secreto, bytes):
        secreto = secreto.hex()
    return hashlib.sha256(f"{base}|{secreto}".encode()).hexdigest()[:40]


def registrar_visita(ruta, vid=""):
    """Cuenta un hit (con throttle 30 min) y unicos diarios por huella+ruta."""
    ruta = _ruta_visita(ruta)
    clave = _clave_visita(vid)
    hoy = date.today()
    reciente = db.uno(
        """SELECT 1 AS ok FROM visitas_throttle
           WHERE clave = %s AND ruta = %s AND visto > now() - interval '30 minutes'""",
        (clave, ruta),
    )
    if reciente:
        total = db.uno("SELECT coalesce(sum(hits), 0) AS n FROM visitas_dia")
        return {"ok": True, "contado": False, "total": int(total["n"]) if total else 0}
    db.uno(
        """INSERT INTO visitas_throttle (clave, ruta, visto) VALUES (%s, %s, now())
           ON CONFLICT (clave, ruta) DO UPDATE SET visto = now()
           RETURNING clave""",
        (clave, ruta),
    )
    db.uno(
        """INSERT INTO visitas_dia (dia, ruta, hits, unicos) VALUES (%s, %s, 1, 0)
           ON CONFLICT (dia, ruta) DO UPDATE SET hits = visitas_dia.hits + 1
           RETURNING dia""",
        (hoy, ruta),
    )
    nuevo = db.uno(
        """INSERT INTO visitas_clave (dia, ruta, clave) VALUES (%s, %s, %s)
           ON CONFLICT DO NOTHING RETURNING clave""",
        (hoy, ruta, clave),
    )
    if nuevo:
        db.uno(
            "UPDATE visitas_dia SET unicos = unicos + 1 WHERE dia = %s AND ruta = %s RETURNING dia",
            (hoy, ruta),
        )
    total = db.uno("SELECT coalesce(sum(hits), 0) AS n FROM visitas_dia")
    return {"ok": True, "contado": True, "total": int(total["n"]) if total else 0}


@app.post("/api/visita")
def api_visita():
    d = json_body() if request.is_json else {}
    try:
        return jsonify(registrar_visita(d.get("ruta") or request.args.get("ruta") or "/", d.get("vid") or ""))
    except Exception:
        return jsonify({"ok": False, "total": 0}), 200


@app.get("/api/estadisticas")
def api_estadisticas():
    filas = db.todos("SELECT clase, count(*) AS n FROM builds WHERE publica GROUP BY clase")
    out = {f["clase"]: f["n"] for f in filas}
    try:
        total = db.uno("SELECT coalesce(sum(hits), 0) AS n FROM visitas_dia")
        hoy = db.uno("SELECT coalesce(sum(hits), 0) AS n FROM visitas_dia WHERE dia = %s", (date.today(),))
        out["visitas"] = int(total["n"]) if total else 0
        out["visitas_hoy"] = int(hoy["n"]) if hoy else 0
    except Exception:
        out["visitas"] = 0
        out["visitas_hoy"] = 0
    return jsonify(out)


# ---------- foro y chat ----------
def iso(v):
    return v.isoformat() if v else None


def recortar(valor, maximo):
    return str(valor or "").strip()[:maximo]


def texto_ok(valor, maximo, minimo=1):
    s = str(valor or "").strip()
    if len(s) < minimo or len(s) > maximo:
        return None
    return s


EMOJIS_REACCION = ["👍", "❤️", "😂", "🔥", "😮", "😢", "🎉", "👏"]
GREMIO = "orden celeste"


def perfiles(ids):
    """Firma de cada autor: rol, clase, si es del gremio y su personaje si lo ha hecho público."""
    ids = sorted({i for i in ids if i})
    if not ids:
        return {}
    filas = db.todos("""SELECT u.id, u.usuario, u.rol, u.creado,
        (SELECT count(*) FROM mensajes m WHERE m.usuario_id = u.id AND NOT m.oculto) AS mensajes,
        (SELECT b.clase FROM builds b WHERE b.usuario_id = u.id ORDER BY b.actualizado DESC LIMIT 1) AS clase_build,
        (SELECT bool_or(lower(p.ficha->>'gremio') = %s) FROM personajes p WHERE p.usuario_id = u.id) AS del_gremio,
        pj.nombre AS pj_nombre, pj.nivel AS pj_nivel, pj.poder AS pj_poder, pj.clase AS pj_clase,
        pj.ficha->>'gremio' AS pj_gremio, pj.ficha->>'imagen' AS pj_imagen, pj.servidor AS pj_servidor
        FROM usuarios u
        LEFT JOIN LATERAL (SELECT * FROM personajes p WHERE p.usuario_id = u.id AND p.publica_equipo
                           ORDER BY p.leido DESC NULLS LAST LIMIT 1) pj ON TRUE
        WHERE u.id = ANY(%s)""", (GREMIO, ids))
    salida = {}
    for f in filas:
        pj = None
        if f["pj_nombre"]:
            imagen = f["pj_imagen"] or ""
            pj = {"nombre": f["pj_nombre"], "nivel": f["pj_nivel"], "poder": f["pj_poder"], "clase": f["pj_clase"],
                  "gremio": f["pj_gremio"] or "", "servidor": f["pj_servidor"] or "",
                  "imagen": imagen if imagen.startswith(("https://profileimg.plaync.com/", "https://assets.playnccdn.com/")) else ""}
        salida[f["id"]] = {
            "usuario": f["usuario"], "rol": f["rol"], "desde": iso(f["creado"]), "mensajes": f["mensajes"],
            "clase": (pj and pj["clase"]) or f["clase_build"], "gremio": bool(f["del_gremio"]), "pj": pj,
        }
    return salida


def reacciones_de(tipo, ids, uid=None):
    ids = list({i for i in ids if i})
    if not ids:
        return {}
    filas = db.todos("""SELECT objetivo_id, emoji, count(*) AS n, bool_or(usuario_id = %s) AS mia
                        FROM reacciones WHERE tipo = %s AND objetivo_id = ANY(%s)
                        GROUP BY objetivo_id, emoji""", (uid or 0, tipo, ids))
    salida = defaultdict(list)
    for f in filas:
        salida[f["objetivo_id"]].append({"e": f["emoji"], "n": f["n"], "mia": bool(f["mia"])})
    for lista in salida.values():
        lista.sort(key=lambda r: EMOJIS_REACCION.index(r["e"]) if r["e"] in EMOJIS_REACCION else 99)
    return salida


_reglas_bot = {"t": 0, "lista": []}
_flood_avisos = defaultdict(deque)


def invalidar_reglas_bot():
    _reglas_bot["t"] = 0


def lista_reglas_bot():
    if time.time() - _reglas_bot["t"] > 30:
        _reglas_bot["lista"] = db.todos(
            """SELECT id, patron, accion, ambito, nota FROM mod_reglas
               WHERE activa ORDER BY length(patron) DESC, id""")
        _reglas_bot["t"] = time.time()
    return _reglas_bot["lista"]


def aplicar_bot(u, texto, ambito):
    """Devuelve ('bloquear'|'revisar', regla) o (None, None). El staff no se filtra."""
    if not texto or u["rol"] in ROLES_MOD:
        return None, None
    bajo = texto.lower()
    revisar = None
    for r in lista_reglas_bot():
        if r["ambito"] not in (ambito, "ambos"):
            continue
        p = (r["patron"] or "").strip().lower()
        if len(p) < 2 or p not in bajo:
            continue
        if r["accion"] == "bloquear":
            return "bloquear", r
        if revisar is None:
            revisar = r
    return ("revisar", revisar) if revisar else (None, None)


def crear_caso(origen, tipo, objetivo_id, autor_id=None, motivo="", extracto="", regla_id=None, denunciante_id=None):
    if db.uno("""SELECT id FROM mod_casos WHERE estado = 'pendiente' AND tipo = %s AND objetivo_id = %s
                 AND origen = %s LIMIT 1""", (tipo, objetivo_id, origen)):
        return None
    return db.uno(
        """INSERT INTO mod_casos (origen, tipo, objetivo_id, regla_id, motivo, extracto, autor_id, denunciante_id)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (origen, tipo, objetivo_id, regla_id, recortar(motivo, 200) or "", recortar(extracto, 280) or "",
         autor_id, denunciante_id),
    )


def filtro_o_caso(u, texto, ambito, tipo, objetivo_id, autor_id):
    """Tras insertar: crea caso si revisar. Antes de insertar: llamar aplicar_bot para bloquear."""
    accion, regla = aplicar_bot(u, texto, ambito)
    if accion == "revisar" and regla:
        crear_caso("bot", tipo, objetivo_id, autor_id=autor_id,
                   motivo=regla.get("nota") or regla["patron"], extracto=texto, regla_id=regla["id"])
    return accion, regla


def aviso_flood(u):
    """Si un usuario dispara rate-limit a menudo, abre un caso para el staff."""
    ahora = time.time()
    q = _flood_avisos[u["id"]]
    while q and ahora - q[0] > 600:
        q.popleft()
    q.append(ahora)
    if len(q) < 3:
        return
    crear_caso("flood", "usuario", u["id"], autor_id=u["id"], motivo="flood",
               extracto=f"Rate limit repetido: {u['usuario']}")
    q.clear()


def denunciar(u, tipo, objetivo, motivo):
    if tipo not in ("tema", "mensaje", "chat"):
        return error("no_existe", 404)
    motivo = texto_ok(motivo, 200)
    if not motivo:
        return error("texto_vacio")
    tabla = {"tema": "temas", "mensaje": "mensajes", "chat": "chat"}[tipo]
    fila = db.uno(f"SELECT id, usuario_id, {'titulo' if tipo == 'tema' else 'texto'} AS extracto FROM {tabla} WHERE id = %s", (objetivo,))
    if not fila or fila["usuario_id"] == u["id"]:
        return error("no_existe", 404)
    if db.uno("SELECT 1 FROM denuncias WHERE usuario_id = %s AND tipo = %s AND objetivo_id = %s AND NOT resuelta",
              (u["id"], tipo, objetivo)):
        return error("ya_denunciado", 409)
    db.uno("INSERT INTO denuncias (usuario_id, tipo, objetivo_id, motivo) VALUES (%s, %s, %s, %s) RETURNING id",
           (u["id"], tipo, objetivo, motivo))
    crear_caso("denuncia", tipo, objetivo, autor_id=fila["usuario_id"], motivo=motivo,
               extracto=fila.get("extracto") or "", denunciante_id=u["id"])
    return jsonify({"ok": True}), 201


@app.get("/api/foro")
def api_foro():
    marcar_presencia(usuario_actual(), "foro")
    cats = db.todos("""SELECT c.id,
        (SELECT count(*) FROM temas t WHERE t.categoria = c.id AND NOT t.oculto) AS temas,
        (SELECT count(*) FROM mensajes m JOIN temas t ON t.id = m.tema_id
          WHERE t.categoria = c.id AND NOT t.oculto AND NOT m.oculto) AS mensajes,
        ult.id AS ult_id, ult.titulo AS ult_titulo, ult.actualizado AS ult_fecha, ult.autor AS ult_autor
        FROM categorias_foro c
        LEFT JOIN LATERAL (SELECT t.id, t.titulo, t.actualizado,
              (SELECT u.usuario FROM mensajes m JOIN usuarios u ON u.id = m.usuario_id
                WHERE m.tema_id = t.id AND NOT m.oculto ORDER BY m.id DESC LIMIT 1) AS autor
            FROM temas t WHERE t.categoria = c.id AND NOT t.oculto ORDER BY t.actualizado DESC LIMIT 1) ult ON TRUE
        ORDER BY c.orden""")
    total = db.uno("""SELECT (SELECT count(*) FROM temas WHERE NOT oculto) AS temas,
        (SELECT count(*) FROM mensajes WHERE NOT oculto) AS mensajes,
        (SELECT count(*) FROM usuarios WHERE rol <> 'sistema') AS miembros""")
    return jsonify({
        "categorias": [{"id": c["id"], "temas": c["temas"], "mensajes": c["mensajes"],
                        "ultimo": {"id": c["ult_id"], "titulo": c["ult_titulo"], "autor": c["ult_autor"],
                                   "fecha": iso(c["ult_fecha"])} if c["ult_id"] else None} for c in cats],
        "total": total,
        "conectados": len(conectados_chat()),
    })


@app.get("/api/foro/<categoria>")
def api_foro_categoria(categoria):
    if categoria not in CATEGORIAS_FORO:
        return error("no_existe", 404)
    filas = db.todos("""SELECT t.id, t.categoria, t.titulo, t.cerrado, t.fijado, t.creado, t.actualizado, t.vistas,
        t.usuario_id,
        (SELECT count(*) - 1 FROM mensajes m WHERE m.tema_id = t.id AND NOT m.oculto) AS respuestas,
        (SELECT u2.usuario FROM mensajes m JOIN usuarios u2 ON u2.id = m.usuario_id
          WHERE m.tema_id = t.id AND NOT m.oculto ORDER BY m.id DESC LIMIT 1) AS ultimo_autor,
        (SELECT left(m.texto, 160) FROM mensajes m WHERE m.tema_id = t.id AND NOT m.oculto ORDER BY m.id LIMIT 1) AS extracto
        FROM temas t
        WHERE t.categoria = %s AND NOT t.oculto
        ORDER BY t.fijado DESC, t.actualizado DESC LIMIT 80""", (categoria,))
    autores = perfiles(f["usuario_id"] for f in filas)
    return jsonify([{
        "id": f["id"], "categoria": f["categoria"], "titulo": f["titulo"], "autor": autores.get(f["usuario_id"]),
        "cerrado": f["cerrado"], "fijado": f["fijado"], "respuestas": max(0, f["respuestas"]), "vistas": f["vistas"],
        "ultimo_autor": f["ultimo_autor"], "extracto": f["extracto"] or "",
        "creado": iso(f["creado"]), "actualizado": iso(f["actualizado"]),
    } for f in filas])


@app.post("/api/foro/<categoria>")
@requiere_escribir
def api_foro_abrir(u, categoria):
    if categoria not in CATEGORIAS_FORO:
        return error("no_existe", 404)
    if categoria == "avisos" and u["rol"] not in ROLES_ADMIN:
        return error("sin_permiso", 403)
    if not limitar("foro:" + str(u["id"]), 8, 600):
        aviso_flood(u)
        return error("demasiados_intentos", 429)
    d = json_body()
    titulo, texto = texto_ok(d.get("titulo"), 120), texto_ok(d.get("texto"), 6000)
    if not titulo or not texto:
        return error("texto_vacio")
    accion, _ = aplicar_bot(u, titulo + "\n" + texto, "foro")
    if accion == "bloquear":
        return error("texto_filtrado", 400)
    tema = db.uno("""INSERT INTO temas (categoria, usuario_id, titulo) VALUES (%s, %s, %s) RETURNING id""",
                  (categoria, u["id"], titulo))
    m = db.uno("INSERT INTO mensajes (tema_id, usuario_id, texto) VALUES (%s, %s, %s) RETURNING id",
               (tema["id"], u["id"], texto))
    filtro_o_caso(u, texto, "foro", "mensaje", m["id"], u["id"])
    return jsonify({"id": tema["id"]}), 201


@app.get("/api/foro/tema/<int:tid>")
def api_foro_tema(tid):
    t = db.uno("""UPDATE temas SET vistas = vistas + 1 WHERE id = %s AND NOT oculto
                  RETURNING id, categoria, titulo, cerrado, fijado, creado, vistas, usuario_id""", (tid,))
    if not t:
        return error("no_existe", 404)
    msgs = db.todos("""SELECT m.id, m.texto, m.creado, m.editado, m.usuario_id
                       FROM mensajes m WHERE m.tema_id = %s AND NOT m.oculto ORDER BY m.id""", (tid,))
    u = usuario_actual()
    marcar_presencia(u, "foro")
    autores = perfiles([t["usuario_id"]] + [m["usuario_id"] for m in msgs])
    reac = reacciones_de("mensaje", [m["id"] for m in msgs], u and u["id"])
    return jsonify({
        "id": t["id"], "categoria": t["categoria"], "titulo": t["titulo"], "autor": autores.get(t["usuario_id"]),
        "cerrado": t["cerrado"], "fijado": t["fijado"], "creado": iso(t["creado"]), "vistas": t["vistas"],
        "mensajes": [{
            "id": m["id"], "texto": m["texto"], "autor": autores.get(m["usuario_id"]), "creado": iso(m["creado"]),
            "editado": iso(m["editado"]), "propio": bool(u and u["id"] == m["usuario_id"]),
            "reacciones": reac.get(m["id"], []),
        } for m in msgs],
    })


@app.post("/api/foro/tema/<int:tid>")
@requiere_escribir
def api_foro_responder(u, tid):
    t = db.uno("SELECT id, cerrado, oculto FROM temas WHERE id = %s", (tid,))
    if not t or t["oculto"]:
        return error("no_existe", 404)
    if t["cerrado"]:
        return error("tema_cerrado", 403)
    if not limitar("foro:" + str(u["id"]), 8, 600):
        aviso_flood(u)
        return error("demasiados_intentos", 429)
    texto = texto_ok(json_body().get("texto"), 6000)
    if not texto:
        return error("texto_vacio")
    accion, _ = aplicar_bot(u, texto, "foro")
    if accion == "bloquear":
        return error("texto_filtrado", 400)
    m = db.uno("INSERT INTO mensajes (tema_id, usuario_id, texto) VALUES (%s, %s, %s) RETURNING id", (tid, u["id"], texto))
    db.uno("UPDATE temas SET actualizado = now() WHERE id = %s RETURNING id", (tid,))
    filtro_o_caso(u, texto, "foro", "mensaje", m["id"], u["id"])
    return jsonify({"id": m["id"]}), 201


@app.put("/api/foro/mensaje/<int:mid>")
@requiere_escribir
def api_foro_editar(u, mid):
    texto = texto_ok(json_body().get("texto"), 6000)
    if not texto:
        return error("texto_vacio")
    accion, _ = aplicar_bot(u, texto, "foro")
    if accion == "bloquear":
        return error("texto_filtrado", 400)
    if not db.uno("""UPDATE mensajes SET texto = %s, editado = now()
                     WHERE id = %s AND usuario_id = %s AND NOT oculto RETURNING id""", (texto, mid, u["id"])):
        return error("no_existe", 404)
    filtro_o_caso(u, texto, "foro", "mensaje", mid, u["id"])
    return jsonify({"ok": True})


@app.post("/api/reacciones")
@requiere_escribir
def api_reaccionar(u):
    d = json_body()
    emoji = d.get("emoji")
    try:
        oid = int(d.get("id"))
    except (TypeError, ValueError):
        return error("no_existe", 404)
    if emoji not in EMOJIS_REACCION or d.get("tipo") != "mensaje":
        return error("no_existe", 404)
    if not db.uno("SELECT id FROM mensajes WHERE id = %s AND NOT oculto", (oid,)):
        return error("no_existe", 404)
    if not limitar("reac:" + str(u["id"]), 60, 60):
        return error("demasiados_intentos", 429)
    if not db.uno("""DELETE FROM reacciones WHERE tipo = 'mensaje' AND objetivo_id = %s AND usuario_id = %s AND emoji = %s
                     RETURNING objetivo_id""", (oid, u["id"], emoji)):
        db.uno("""INSERT INTO reacciones (tipo, objetivo_id, usuario_id, emoji) VALUES ('mensaje', %s, %s, %s)
                  ON CONFLICT DO NOTHING RETURNING objetivo_id""", (oid, u["id"], emoji))
    return jsonify(reacciones_de("mensaje", [oid], u["id"]).get(oid, []))


@app.get("/api/tarjetas")
def api_tarjetas():
    """Resumen de builds públicas para pintarlas como tarjeta dentro del foro y el chat."""
    try:
        ids = [int(x) for x in str(request.args.get("ids") or "").split(",") if x.strip()][:12]
    except ValueError:
        return jsonify({})
    if not ids:
        return jsonify({})
    filas = db.todos(SELECT_BUILD + " WHERE b.id = ANY(%s) AND b.publica", (ids,))
    salida = {}
    for f in filas:
        salida[f["id"]] = {"id": f["id"], "nombre": f["nombre"], "clase": f["clase"], "modo": f["modo"],
                           "autor": f["autor"], "resumen": resumen_build(f["datos"]), "actualizado": iso(f["actualizado"])}
    return jsonify(salida)


@app.post("/api/foro/tema/<int:tid>/denunciar")
@requiere_escribir
def api_denunciar_tema(u, tid):
    return denunciar(u, "tema", tid, json_body().get("motivo"))


@app.post("/api/foro/mensaje/<int:mid>/denunciar")
@requiere_escribir
def api_denunciar_mensaje(u, mid):
    return denunciar(u, "mensaje", mid, json_body().get("motivo"))


# ---------- chat por salas ----------
# Un solo proceso (gunicorn --workers 1 --threads 8): la memoria evita ir a Neon en cada consulta del chat.
SALAS = ["general", "grupos", "clases", "comercio", "offtopic", "gremio"]
_chat = {"version": defaultdict(int), "visto_bd": 0.0, "ultimos": {}, "limpieza": 0.0}
_presencia = {}
_chat_lock = threading.Lock()


def puede_sala(u, sala):
    if sala != "gremio":
        return True
    if not u:
        return False
    if u["rol"] in ROLES_MOD:
        return True
    return bool(db.uno("SELECT 1 AS x FROM personajes WHERE usuario_id = %s AND lower(ficha->>'gremio') = %s LIMIT 1",
                       (u["id"], GREMIO)))


def marcar_presencia(u, sala):
    if u:
        _presencia[u["id"]] = {"t": time.time(), "usuario": u["usuario"], "rol": u["rol"], "sala": sala}


def conectados_chat():
    ahora = time.time()
    return [p for p in _presencia.values() if ahora - p["t"] < 45]


def _fila_chat(f, autores, citas, apuntes):
    m = {"id": f["id"], "texto": f["texto"], "autor": autores.get(f["usuario_id"]), "creado": iso(f["creado"])}
    if f["responde_a"] and f["responde_a"] in citas:
        m["responde"] = citas[f["responde_a"]]
    if f["grupo"]:
        g = dict(f["grupo"])
        g["apuntados"] = apuntes.get(f["id"], [])
        m["grupo"] = g
    return m


def _leer_chat(sala, desde):
    if desde > 0:
        filas = db.todos("""SELECT id, texto, creado, usuario_id, responde_a, grupo FROM chat
                            WHERE sala = %s AND NOT oculto AND id > %s ORDER BY id LIMIT 100""", (sala, desde))
    else:
        filas = db.todos("""SELECT * FROM (SELECT id, texto, creado, usuario_id, responde_a, grupo FROM chat
                              WHERE sala = %s AND NOT oculto ORDER BY id DESC LIMIT 80) x ORDER BY id""", (sala,))
    refs = [f["responde_a"] for f in filas if f["responde_a"]]
    citas = {}
    if refs:
        for c in db.todos("""SELECT c.id, left(c.texto, 120) AS texto, u.usuario FROM chat c
                             JOIN usuarios u ON u.id = c.usuario_id WHERE c.id = ANY(%s) AND NOT c.oculto""", (refs,)):
            citas[c["id"]] = {"id": c["id"], "autor": c["usuario"], "texto": c["texto"]}
    grupos = db.todos("""SELECT a.chat_id, u.usuario FROM apuntados a JOIN usuarios u ON u.id = a.usuario_id
                         JOIN chat c ON c.id = a.chat_id
                         WHERE c.sala = %s AND c.grupo IS NOT NULL AND c.creado > now() - interval '24 hours'
                         ORDER BY u.usuario""", (sala,))
    apuntes = defaultdict(list)
    for g in grupos:
        apuntes[g["chat_id"]].append(g["usuario"])
    autores = perfiles(f["usuario_id"] for f in filas)
    return [_fila_chat(f, autores, citas, apuntes) for f in filas], dict(apuntes)


def _cambio_chat(sala):
    with _chat_lock:
        _chat["version"][sala] += 1


@app.get("/api/chat")
def api_chat():
    sala = request.args.get("sala") or "general"
    if sala not in SALAS:
        return error("no_existe", 404)
    u = usuario_actual()
    if not puede_sala(u, sala):
        return error("sin_permiso", 403)
    ahora = time.time()
    marcar_presencia(u, sala)
    try:
        desde = int(request.args.get("desde") or 0)
        version = int(request.args.get("v") or -1)
    except ValueError:
        desde, version = 0, -1
    gente = sorted(({"usuario": p["usuario"], "rol": p["rol"], "sala": p["sala"]} for p in conectados_chat()),
                   key=lambda p: p["usuario"].lower())
    actual = _chat["version"][sala]
    if desde > 0 and version == actual and ahora - _chat["visto_bd"] < 20:
        return jsonify({"sin_cambios": True, "v": actual, "conectados": gente, "ultimos": _chat["ultimos"]})
    if ahora - _chat["limpieza"] > 3600:
        _chat["limpieza"] = ahora
        db.todos("DELETE FROM chat WHERE creado < now() - interval '14 days' RETURNING id")
    mensajes, grupos = _leer_chat(sala, desde)
    _chat["ultimos"] = {f["sala"]: f["id"] for f in db.todos(
        "SELECT sala, max(id) AS id FROM chat WHERE NOT oculto GROUP BY sala")}
    _chat["visto_bd"] = ahora
    return jsonify({"mensajes": mensajes, "grupos": grupos, "v": actual, "conectados": gente, "ultimos": _chat["ultimos"]})


@app.post("/api/chat")
@requiere_escribir
def api_chat_escribir(u):
    if not limitar("chat:" + str(u["id"]), 15, 60):
        aviso_flood(u)
        return error("demasiados_intentos", 429)
    d = json_body()
    sala = d.get("sala") or "general"
    if sala not in SALAS:
        return error("no_existe", 404)
    if not puede_sala(u, sala):
        return error("sin_permiso", 403)
    grupo = None
    if d.get("grupo"):
        g = d["grupo"] if isinstance(d["grupo"], dict) else {}
        grupo = {"mazmorra": recortar(g.get("mazmorra"), 60), "rol": recortar(g.get("rol"), 40),
                 "hora": recortar(g.get("hora"), 30)}
        try:
            grupo["plazas"] = max(1, min(8, int(g.get("plazas") or 4)))
        except (TypeError, ValueError):
            grupo["plazas"] = 4
        if not grupo["mazmorra"]:
            return error("texto_vacio")
        texto = texto_ok(d.get("texto"), 300, 0) or ""
    else:
        texto = texto_ok(d.get("texto"), 500)
        if not texto:
            return error("texto_vacio")
    comprobar = (texto + " " + (grupo["mazmorra"] if grupo else "")).strip()
    accion, _ = aplicar_bot(u, comprobar, "chat")
    if accion == "bloquear":
        return error("texto_filtrado", 400)
    responde = None
    try:
        responde = int(d.get("responde_a")) if d.get("responde_a") else None
    except (TypeError, ValueError):
        responde = None
    if responde and not db.uno("SELECT id FROM chat WHERE id = %s AND sala = %s", (responde, sala)):
        responde = None
    f = db.uno("""INSERT INTO chat (usuario_id, texto, sala, responde_a, grupo) VALUES (%s, %s, %s, %s, %s)
                  RETURNING id""", (u["id"], texto, sala, responde, Jsonb(grupo) if grupo else None))
    if grupo:
        db.uno("INSERT INTO apuntados (chat_id, usuario_id) VALUES (%s, %s) RETURNING chat_id", (f["id"], u["id"]))
    filtro_o_caso(u, comprobar, "chat", "chat", f["id"], u["id"])
    _cambio_chat(sala)
    return jsonify({"id": f["id"]}), 201


@app.post("/api/chat/<int:cid>/apuntar")
@requiere_escribir
def api_chat_apuntar(u, cid):
    json_body()
    c = db.uno("SELECT id, sala, grupo FROM chat WHERE id = %s AND NOT oculto AND grupo IS NOT NULL", (cid,))
    if not c or not puede_sala(u, c["sala"]):
        return error("no_existe", 404)
    if not db.uno("DELETE FROM apuntados WHERE chat_id = %s AND usuario_id = %s RETURNING chat_id", (cid, u["id"])):
        n = db.uno("SELECT count(*) AS n FROM apuntados WHERE chat_id = %s", (cid,))["n"]
        if n >= int((c["grupo"] or {}).get("plazas") or 4):
            return error("grupo_lleno", 409)
        db.uno("INSERT INTO apuntados (chat_id, usuario_id) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING chat_id",
               (cid, u["id"]))
    _cambio_chat(c["sala"])
    return jsonify([f["usuario"] for f in db.todos(
        """SELECT u.usuario FROM apuntados a JOIN usuarios u ON u.id = a.usuario_id
           WHERE a.chat_id = %s ORDER BY u.usuario""", (cid,))])


@app.post("/api/chat/<int:cid>/denunciar")
@requiere_escribir
def api_denunciar_chat(u, cid):
    return denunciar(u, "chat", cid, json_body().get("motivo"))


# ---------- noticias oficiales y ajustes ----------
def fila_noticia(f, contenido=False):
    n = {"id": f["id"], "tablon": f["tablon"], "idioma": f["idioma"], "titulo": f["titulo"], "resumen": f["resumen"],
         "imagen": f["imagen"], "texto_en": f["texto_en"], "url": f["url"], "publicado": iso(f["publicado"])}
    if contenido:
        n["contenido"] = f["contenido"]
    return n


@app.get("/api/noticias")
def api_noticias():
    noticias.al_dia()
    idioma = "en" if request.args.get("idioma") == "en" else "es"
    tablon = request.args.get("tablon")
    try:
        limite = max(1, min(40, int(request.args.get("limite") or 24)))
    except ValueError:
        limite = 24
    if tablon in noticias.TABLONES:
        filas = db.todos("""SELECT * FROM noticias WHERE idioma = %s AND tablon = %s
                            ORDER BY publicado DESC LIMIT %s""", (idioma, tablon, limite))
    else:
        filas = db.todos("SELECT * FROM noticias WHERE idioma = %s ORDER BY publicado DESC LIMIT %s", (idioma, limite))
    return jsonify([fila_noticia(f) for f in filas])


@app.get("/api/noticias/<nid>")
def api_noticia(nid):
    if not re.fullmatch(r"[0-9a-f]{16,40}", nid):
        return error("no_existe", 404)
    f = db.uno("SELECT * FROM noticias WHERE id = %s", (nid,))
    if not f:
        return error("no_existe", 404)
    return jsonify(fila_noticia(f, True))


def ajuste(clave, defecto=None):
    f = db.uno("SELECT valor FROM ajustes WHERE clave = %s", (clave,))
    if not f:
        return defecto
    try:
        return json.loads(f["valor"])
    except ValueError:
        return defecto


_config = {"t": 0, "valor": None}


@app.get("/api/config")
def api_config():
    if time.time() - _config["t"] > 60:
        d = ajuste("discord", {}) or {}
        discord = None
        if d.get("servidor") or d.get("invitacion"):
            discord = {"servidor": d.get("servidor") or "", "invitacion": d.get("invitacion") or ""}
        _config["valor"] = {"discord": discord, "voz": bool(d.get("voz")) and bool(discord)}
        _config["t"] = time.time()
    out = dict(_config["valor"] or {})
    out["turnstile"] = TURNSTILE_SITE or None
    return jsonify(out)


@app.post("/api/panel/discord")
@requiere_rol("superadmin")
def api_panel_discord(u):
    d = json_body()
    servidor = str(d.get("servidor") or "").strip()
    invitacion = str(d.get("invitacion") or "").strip()
    if servidor and not re.fullmatch(r"\d{15,22}", servidor):
        return error("discord_invalido")
    if invitacion and not re.fullmatch(r"https://(discord\.gg|discord\.com/invite)/[A-Za-z0-9-]{2,40}", invitacion):
        return error("discord_invalido")
    valor = json.dumps({"servidor": servidor, "invitacion": invitacion, "voz": bool(d.get("voz"))})
    db.uno("""INSERT INTO ajustes (clave, valor) VALUES ('discord', %s)
              ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""", (valor,))
    _config["t"] = 0
    return jsonify({"ok": True})


# ---------- panel ----------
def _ocultar_contenido(tipo, oid, oculto=True, motivo=None):
    if tipo == "chat":
        db.uno("UPDATE chat SET oculto = %s, motivo = %s WHERE id = %s RETURNING id", (oculto, motivo, oid))
    elif tipo == "mensaje":
        db.uno("UPDATE mensajes SET oculto = %s, motivo = %s WHERE id = %s RETURNING id", (oculto, motivo, oid))
    elif tipo == "tema":
        db.uno("""UPDATE temas SET oculto = %s, motivo = %s, actualizado = now() WHERE id = %s RETURNING id""",
               (oculto, motivo, oid))
    if oculto and tipo in ("chat", "mensaje", "tema"):
        db.todos("""UPDATE denuncias SET resuelta = TRUE WHERE tipo = %s AND objetivo_id = %s AND NOT resuelta RETURNING id""",
                 (tipo, oid))


def _max_dias_suspension(rol):
    if rol == "moderador":
        return 7
    if rol in ROLES_ADMIN:
        return 30
    return 0


@app.get("/api/panel")
@requiere_rol(*ROLES_MOD)
def api_panel(u):
    contadores = db.uno("""SELECT
        count(*) FILTER (WHERE origen IN ('bot', 'flood')) AS bot,
        count(*) FILTER (WHERE origen = 'denuncia') AS denuncias,
        count(*) AS total
        FROM mod_casos WHERE estado = 'pendiente'""")
    chat = db.todos("""SELECT c.id, c.texto, c.oculto, c.motivo, c.creado, u.usuario AS autor
                       FROM chat c JOIN usuarios u ON u.id = c.usuario_id
                       ORDER BY c.id DESC LIMIT 40""")
    return jsonify({
        "rol": u["rol"],
        "kpi": {"bot": int(contadores["bot"] or 0), "denuncias": int(contadores["denuncias"] or 0),
                "total": int(contadores["total"] or 0)},
        "chat": [{"id": c["id"], "texto": c["texto"], "oculto": c["oculto"], "motivo": c["motivo"],
                  "autor": c["autor"], "creado": iso(c["creado"])} for c in chat],
        "habilidades_nuevas": ajuste("habilidades_nuevas", {}) if u["rol"] in ROLES_ADMIN else {},
        "ultimo_parche": fila_noticia(p) if (p := db.uno(
            "SELECT * FROM noticias WHERE tablon = 'update' AND idioma = 'es' ORDER BY publicado DESC LIMIT 1")) else None,
        "max_dias": _max_dias_suspension(u["rol"]),
    })


@app.get("/api/panel/casos")
@requiere_rol(*ROLES_MOD)
def api_panel_casos(u):
    origen = (request.args.get("origen") or "").strip().lower()
    sql = """SELECT c.id, c.origen, c.tipo, c.objetivo_id, c.motivo, c.extracto, c.creado, c.autor_id,
                    a.usuario AS autor, d.usuario AS denunciante, r.patron AS regla, r.nota AS regla_nota
             FROM mod_casos c
             LEFT JOIN usuarios a ON a.id = c.autor_id
             LEFT JOIN usuarios d ON d.id = c.denunciante_id
             LEFT JOIN mod_reglas r ON r.id = c.regla_id
             WHERE c.estado = 'pendiente'"""
    args = []
    if origen == "bot":
        sql += " AND c.origen IN ('bot', 'flood')"
    elif origen == "denuncia":
        sql += " AND c.origen = 'denuncia'"
    sql += " ORDER BY c.id DESC LIMIT 60"
    filas = db.todos(sql, tuple(args))
    return jsonify([{
        "id": f["id"], "origen": f["origen"], "tipo": f["tipo"], "objetivo": f["objetivo_id"],
        "motivo": f["motivo"], "extracto": f["extracto"], "creado": iso(f["creado"]),
        "autor": f["autor"], "autor_id": f["autor_id"], "denunciante": f["denunciante"],
        "regla": f["regla_nota"] or f["regla"],
    } for f in filas])


@app.post("/api/panel/casos/<int:cid>")
@requiere_rol(*ROLES_MOD)
def api_panel_caso_resolver(u, cid):
    caso = db.uno("SELECT * FROM mod_casos WHERE id = %s AND estado = 'pendiente'", (cid,))
    if not caso:
        return error("no_existe", 404)
    d = json_body()
    accion = d.get("accion")
    if accion not in ("ocultar", "dejar", "suspender"):
        return error("texto_vacio")
    motivo = recortar(d.get("motivo"), 200) or caso["motivo"] or "moderación"
    if accion == "ocultar" and caso["tipo"] in ("chat", "mensaje", "tema"):
        _ocultar_contenido(caso["tipo"], caso["objetivo_id"], True, motivo)
    elif accion == "suspender":
        autor_id = caso["autor_id"]
        if not autor_id and caso["tipo"] == "usuario":
            autor_id = caso["objetivo_id"]
        if not autor_id:
            return error("no_existe", 404)
        try:
            dias = int(d.get("dias") or 1)
        except (TypeError, ValueError):
            return error("texto_vacio")
        max_d = _max_dias_suspension(u["rol"])
        if dias < 1 or dias > max_d:
            return error("texto_vacio")
        otro = db.uno("SELECT id, rol FROM usuarios WHERE id = %s", (autor_id,))
        if not otro or otro["rol"] in ROLES_MOD or otro["id"] == u["id"]:
            return error("sin_permiso", 403)
        hasta = datetime.now(timezone.utc) + timedelta(days=dias)
        db.uno("UPDATE usuarios SET expulsado_hasta = %s WHERE id = %s RETURNING id", (hasta, autor_id))
        if caso["tipo"] in ("chat", "mensaje", "tema") and d.get("ocultar", True):
            _ocultar_contenido(caso["tipo"], caso["objetivo_id"], True, motivo)
    db.uno("""UPDATE mod_casos SET estado = 'resuelto', resuelto_por = %s, resuelto_en = now(), accion_final = %s
              WHERE id = %s RETURNING id""", (u["id"], accion, cid))
    if caso["origen"] == "denuncia" and caso["tipo"] in ("chat", "mensaje", "tema"):
        db.todos("""UPDATE denuncias SET resuelta = TRUE WHERE tipo = %s AND objetivo_id = %s AND NOT resuelta RETURNING id""",
                 (caso["tipo"], caso["objetivo_id"]))
    return jsonify({"ok": True})


@app.post("/api/panel/temas/<int:tid>")
@requiere_rol(*ROLES_MOD)
def api_panel_tema(u, tid):
    t = db.uno("SELECT id FROM temas WHERE id = %s", (tid,))
    if not t:
        return error("no_existe", 404)
    d = json_body()
    cerrado = bool(d.get("cerrado"))
    oculto = bool(d.get("oculto"))
    motivo = recortar(d.get("motivo"), 200) or None
    fijado = bool(d.get("fijado")) if u["rol"] in ROLES_ADMIN else None
    if fijado is None:
        db.uno("""UPDATE temas SET cerrado = %s, oculto = %s, motivo = %s, actualizado = now()
                  WHERE id = %s RETURNING id""", (cerrado, oculto, motivo, tid))
    else:
        db.uno("""UPDATE temas SET cerrado = %s, oculto = %s, motivo = %s, fijado = %s, actualizado = now()
                  WHERE id = %s RETURNING id""", (cerrado, oculto, motivo, fijado, tid))
    if oculto:
        _ocultar_contenido("tema", tid, True, motivo)
        db.todos("""UPDATE mod_casos SET estado = 'resuelto', resuelto_por = %s, resuelto_en = now(), accion_final = 'ocultar'
                    WHERE estado = 'pendiente' AND tipo = 'tema' AND objetivo_id = %s RETURNING id""", (u["id"], tid))
    return jsonify({"ok": True})


@app.post("/api/panel/mensajes/<int:mid>")
@requiere_rol(*ROLES_MOD)
def api_panel_mensaje(u, mid):
    if not db.uno("SELECT id FROM mensajes WHERE id = %s", (mid,)):
        return error("no_existe", 404)
    d = json_body()
    oculto = bool(d.get("oculto", True))
    motivo = recortar(d.get("motivo"), 200) or None
    _ocultar_contenido("mensaje", mid, oculto, motivo)
    if oculto:
        db.todos("""UPDATE mod_casos SET estado = 'resuelto', resuelto_por = %s, resuelto_en = now(), accion_final = 'ocultar'
                    WHERE estado = 'pendiente' AND tipo = 'mensaje' AND objetivo_id = %s RETURNING id""", (u["id"], mid))
    return jsonify({"ok": True})


@app.post("/api/panel/chat/<int:cid>")
@requiere_rol(*ROLES_MOD)
def api_panel_chat(u, cid):
    if not db.uno("SELECT id FROM chat WHERE id = %s", (cid,)):
        return error("no_existe", 404)
    d = json_body()
    oculto = bool(d.get("oculto", True))
    motivo = recortar(d.get("motivo"), 200) or None
    _ocultar_contenido("chat", cid, oculto, motivo)
    if oculto:
        db.todos("""UPDATE mod_casos SET estado = 'resuelto', resuelto_por = %s, resuelto_en = now(), accion_final = 'ocultar'
                    WHERE estado = 'pendiente' AND tipo = 'chat' AND objetivo_id = %s RETURNING id""", (u["id"], cid))
    return jsonify({"ok": True})


@app.post("/api/panel/suspender/<int:uid>")
@requiere_rol(*ROLES_MOD)
def api_panel_suspender(u, uid):
    otro = db.uno("SELECT id, rol FROM usuarios WHERE id = %s", (uid,))
    if not otro or otro["rol"] in ROLES_MOD or otro["id"] == u["id"]:
        return error("sin_permiso", 403)
    try:
        dias = int(json_body().get("dias") or 0)
    except (TypeError, ValueError):
        return error("texto_vacio")
    max_d = _max_dias_suspension(u["rol"])
    if dias < 0 or dias > max_d:
        return error("texto_vacio")
    hasta = None if dias == 0 else datetime.now(timezone.utc) + timedelta(days=dias)
    db.uno("UPDATE usuarios SET expulsado_hasta = %s WHERE id = %s RETURNING id", (hasta, uid))
    return jsonify({"ok": True})


@app.get("/api/super")
@requiere_rol("superadmin")
def api_super(u):
    return jsonify({
        "discord": ajuste("discord", {}) or {},
        "reglas": [{
            "id": r["id"], "patron": r["patron"], "accion": r["accion"], "ambito": r["ambito"],
            "activa": r["activa"], "nota": r["nota"],
        } for r in db.todos("SELECT * FROM mod_reglas ORDER BY id")],
    })


@app.get("/api/super/visitas")
@requiere_rol("superadmin")
def api_super_visitas(u):
    try:
        dias = min(90, max(7, int(request.args.get("dias") or 30)))
    except (TypeError, ValueError):
        dias = 30
    desde = date.today() - timedelta(days=dias - 1)
    hoy = date.today()
    total = db.uno("SELECT coalesce(sum(hits), 0) AS hits, coalesce(sum(unicos), 0) AS unicos FROM visitas_dia")
    hoy_f = db.uno(
        "SELECT coalesce(sum(hits), 0) AS hits, coalesce(sum(unicos), 0) AS unicos FROM visitas_dia WHERE dia = %s",
        (hoy,),
    )
    semana = db.uno(
        """SELECT coalesce(sum(hits), 0) AS hits, coalesce(sum(unicos), 0) AS unicos
           FROM visitas_dia WHERE dia >= %s""",
        (hoy - timedelta(days=6),),
    )
    por_dia = db.todos(
        """SELECT dia::text AS dia, sum(hits)::int AS hits, sum(unicos)::int AS unicos
           FROM visitas_dia WHERE dia >= %s GROUP BY dia ORDER BY dia""",
        (desde,),
    )
    por_ruta = db.todos(
        """SELECT ruta, sum(hits)::int AS hits, sum(unicos)::int AS unicos
           FROM visitas_dia WHERE dia >= %s
           GROUP BY ruta ORDER BY hits DESC LIMIT 20""",
        (desde,),
    )
    return jsonify({
        "dias": dias,
        "total": {"hits": int(total["hits"]), "unicos": int(total["unicos"])},
        "hoy": {"hits": int(hoy_f["hits"]), "unicos": int(hoy_f["unicos"])},
        "semana": {"hits": int(semana["hits"]), "unicos": int(semana["unicos"])},
        "por_dia": por_dia,
        "por_ruta": por_ruta,
    })


@app.get("/api/super/usuarios")
@requiere_rol("superadmin")
def api_super_usuarios(u):
    q = (request.args.get("q") or "").strip()[:40]
    if q:
        if len(q) < 2:
            return jsonify([])
        filas = db.todos(
            """SELECT id, usuario, rol, creado, expulsado_hasta FROM usuarios
               WHERE rol <> 'sistema' AND usuario ILIKE %s
               ORDER BY CASE rol WHEN 'superadmin' THEN 0 WHEN 'admin' THEN 1 WHEN 'moderador' THEN 2 ELSE 3 END,
                        lower(usuario)
               LIMIT 40""",
            (f"%{q}%",),
        )
    else:
        filas = db.todos(
            """SELECT id, usuario, rol, creado, expulsado_hasta FROM usuarios
               WHERE rol IN ('superadmin', 'admin', 'moderador')
               ORDER BY CASE rol WHEN 'superadmin' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, lower(usuario)"""
        )
    return jsonify([
        {"id": f["id"], "usuario": f["usuario"], "rol": f["rol"], "creado": iso(f["creado"]),
         "expulsado_hasta": iso(f["expulsado_hasta"]), "propio": f["id"] == u["id"]}
        for f in filas
    ])


@app.post("/api/super/usuarios/<int:uid>")
@requiere_rol("superadmin")
def api_super_usuario(u, uid):
    otro = db.uno("SELECT id, rol FROM usuarios WHERE id = %s", (uid,))
    if not otro or otro["rol"] in ("sistema", "superadmin") or otro["id"] == u["id"]:
        return error("sin_permiso", 403)
    d = json_body()
    rol = d.get("rol", otro["rol"])
    if rol not in ROLES_ASIGNABLES:
        return error("sin_permiso", 403)
    dias = d.get("dias")
    if dias is None:
        hasta = None if "dias" in d else db.uno("SELECT expulsado_hasta FROM usuarios WHERE id = %s", (uid,))["expulsado_hasta"]
    else:
        try:
            dias = int(dias)
        except (TypeError, ValueError):
            return error("texto_vacio")
        if dias < 0 or dias > 30:
            return error("texto_vacio")
        hasta = None if dias == 0 else datetime.now(timezone.utc) + timedelta(days=dias)
    db.uno("UPDATE usuarios SET rol = %s, expulsado_hasta = %s WHERE id = %s RETURNING id", (rol, hasta, uid))
    return jsonify({"ok": True})


@app.post("/api/super/reglas")
@requiere_rol("superadmin")
def api_super_regla_crear(u):
    d = json_body()
    patron = recortar(d.get("patron"), 80)
    if len(patron) < 2:
        return error("texto_vacio")
    accion = d.get("accion") if d.get("accion") in ("bloquear", "revisar") else "revisar"
    ambito = d.get("ambito") if d.get("ambito") in ("chat", "foro", "ambos") else "ambos"
    nota = recortar(d.get("nota"), 40) or ""
    f = db.uno("""INSERT INTO mod_reglas (patron, accion, ambito, activa, nota) VALUES (%s, %s, %s, %s, %s)
                  RETURNING id""", (patron, accion, ambito, bool(d.get("activa", True)), nota))
    invalidar_reglas_bot()
    return jsonify({"id": f["id"]}), 201


@app.post("/api/super/reglas/<int:rid>")
@requiere_rol("superadmin")
def api_super_regla_editar(u, rid):
    if not db.uno("SELECT id FROM mod_reglas WHERE id = %s", (rid,)):
        return error("no_existe", 404)
    d = json_body()
    campos, args = [], []
    if "patron" in d:
        patron = recortar(d.get("patron"), 80)
        if len(patron) < 2:
            return error("texto_vacio")
        campos.append("patron = %s"); args.append(patron)
    if "accion" in d:
        if d["accion"] not in ("bloquear", "revisar"):
            return error("texto_vacio")
        campos.append("accion = %s"); args.append(d["accion"])
    if "ambito" in d:
        if d["ambito"] not in ("chat", "foro", "ambos"):
            return error("texto_vacio")
        campos.append("ambito = %s"); args.append(d["ambito"])
    if "nota" in d:
        campos.append("nota = %s"); args.append(recortar(d.get("nota"), 40) or "")
    if "activa" in d:
        campos.append("activa = %s"); args.append(bool(d.get("activa")))
    if not campos:
        return error("texto_vacio")
    args.append(rid)
    db.uno(f"UPDATE mod_reglas SET {', '.join(campos)} WHERE id = %s RETURNING id", tuple(args))
    invalidar_reglas_bot()
    return jsonify({"ok": True})


@app.post("/api/super/reglas/<int:rid>/borrar")
@requiere_rol("superadmin")
def api_super_regla_borrar(u, rid):
    if not db.uno("DELETE FROM mod_reglas WHERE id = %s RETURNING id", (rid,)):
        return error("no_existe", 404)
    invalidar_reglas_bot()
    return jsonify({"ok": True})


# ---------- páginas y estáticos ----------
@app.get("/")
def inicio():
    return send_from_directory(RAIZ, "index.html")


@app.get("/robots.txt")
def robots_txt():
    return send_from_directory(RAIZ, "robots.txt", mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap_xml():
    """Sitemap estático (ES/EN) + URLs dinámicas de tops, builds y noticias."""
    base = (RAIZ / "sitemap.xml").read_text(encoding="utf-8")
    # Quita el cierre para insertar el bloque dinámico
    if "</urlset>" in base:
        base = base.rsplit("</urlset>", 1)[0]
    try:
        dinamico = seo.entradas_dinamicas(db)
    except Exception:  # noqa: BLE001
        dinamico = "  <!-- dinamico no disponible -->"
    cuerpo = base.rstrip() + "\n" + dinamico + "\n</urlset>\n"
    return app.response_class(cuerpo, mimetype="application/xml; charset=utf-8")


def _lang_req():
    l = (request.args.get("lang") or "").lower()
    return l if l in ("es", "en") else "es"


def _leer_html(nombre):
    """Lee HTML del repo tolerando Latin-1 residual (p. ej. ·) sin tumbar la ruta SSR."""
    raw = (RAIZ / nombre).read_bytes()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("latin-1")


@app.get("/build.html")
def build_html_seo():
    """SSR de title/description para que Google indexe nombres de tops / builds."""
    html = _leer_html("build.html")
    lang = _lang_req()
    cid = (request.args.get("cid") or "").strip()
    server = request.args.get("server")
    bid = request.args.get("id")
    try:
        if cid and server is not None and str(server).strip() != "":
            sid = int(server)
            fila = db.uno(
                """SELECT character_id, server_id, nombre, servidor, clase, poder, nivel_objeto
                   FROM ranking_pj WHERE character_id = %s AND server_id = %s""",
                (cid, sid),
            )
            if not fila:
                fila = db.uno(
                    """SELECT character_id, server_id, nombre, servidor, clase, poder
                       FROM top_log WHERE character_id = %s AND server_id = %s
                       ORDER BY semana DESC LIMIT 1""",
                    (cid, sid),
                )
            if fila:
                hist = db.todos(
                    """SELECT semana, puesto FROM top_log
                       WHERE character_id = %s AND server_id = %s
                       ORDER BY semana DESC LIMIT 6""",
                    (cid, sid),
                ) or []
                puestos = [
                    (f"🏆 {h['semana']}" if int(h["puesto"]) == 1 else f"🥈 {h['semana']}")
                    for h in hist
                ]
                titulo, desc, keys = seo.meta_jugador(fila, lang, puestos)
                can = seo.url_pagina("build.html", lang, cid=cid, server=sid)
                html = seo.inyectar_head(
                    html, titulo=titulo, descripcion=desc, keywords=keys,
                    canonical=can, lang=lang,
                    json_ld=seo.json_ld_jugador(fila, can, lang),
                )
        elif bid and str(bid).isdigit():
            f = db.uno(
                """SELECT b.id, b.nombre, b.clase, b.fuente, b.publica, u.usuario AS autor
                   FROM builds b JOIN usuarios u ON u.id = b.usuario_id
                   WHERE b.id = %s AND b.publica""",
                (int(bid),),
            )
            if f:
                titulo, desc, keys = seo.meta_build(f, lang)
                can = seo.url_pagina("build.html", lang, id=int(bid))
                html = seo.inyectar_head(
                    html, titulo=titulo, descripcion=desc, keywords=keys,
                    canonical=can, lang=lang,
                )
    except Exception:  # noqa: BLE001
        pass
    return app.response_class(html, mimetype="text/html; charset=utf-8")


@app.get("/noticia.html")
def noticia_html_seo():
    html = _leer_html("noticia.html")
    lang = _lang_req()
    nid = request.args.get("id")
    try:
        if nid and str(nid).isdigit():
            f = db.uno("SELECT * FROM noticias WHERE id = %s", (int(nid),))
            if f:
                # Preferir meta en el idioma de la noticia si no hay ?lang
                lang_n = f["idioma"] if f.get("idioma") in ("es", "en") else lang
                if not request.args.get("lang"):
                    lang = lang_n
                titulo, desc, keys = seo.meta_noticia(f, lang)
                can = seo.url_pagina("noticia.html", lang, id=int(nid))
                html = seo.inyectar_head(
                    html, titulo=titulo, descripcion=desc, keywords=keys,
                    canonical=can, lang=lang,
                    json_ld=seo.json_ld_noticia(f, can, lang),
                )
    except Exception:  # noqa: BLE001
        pass
    return app.response_class(html, mimetype="text/html; charset=utf-8")


@app.get("/<pagina>.html")
def pagina(pagina):
    if not re.fullmatch(r"[a-z0-9-]+", pagina) or not (RAIZ / f"{pagina}.html").is_file():
        abort(404)
    return send_from_directory(RAIZ, f"{pagina}.html")


@app.get("/<carpeta>/<path:ruta>")
def estatico(carpeta, ruta):
    if carpeta not in CARPETAS_PUBLICAS:
        abort(404)
    return send_from_directory(RAIZ / carpeta, ruta, max_age=3600)


@app.errorhandler(415)
def no_json(_):
    return error("se_esperaba_json", 415)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 5000)), debug=os.environ.get("ENTORNO") == "local")
