import json
import os
import re
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import Flask, abort, jsonify, request, send_from_directory, session
from psycopg.types.json import Jsonb
from werkzeug.security import check_password_hash, generate_password_hash

import db
import juego
import noticias
import reglas

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


@app.after_request
def cors_escaparate(resp):
    if request.method == "GET" and request.path.startswith("/api/") and request.headers.get("Origin") in ORIGENES_ESCAPARATE:
        resp.headers["Access-Control-Allow-Origin"] = request.headers["Origin"]
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


def build_publica(fila, con_datos=True):
    b = {
        "id": fila["id"], "clase": fila["clase"], "nombre": fila["nombre"], "modo": fila["modo"],
        "descripcion": fila["descripcion"], "publica": fila["publica"], "fuente": fila["fuente"],
        "autor": fila["autor"], "creado": fila["creado"].isoformat(), "actualizado": fila["actualizado"].isoformat(),
    }
    if con_datos:
        b["datos"] = fila["datos"]
    return b


SELECT_BUILD = """SELECT b.*, u.usuario AS autor FROM builds b JOIN usuarios u ON u.id = b.usuario_id"""


# ---------- cuenta ----------
@app.get("/api/yo")
def api_yo():
    u = usuario_actual()
    return jsonify({"usuario": u and {"usuario": u["usuario"], "rol": u["rol"], "expulsado": esta_expulsado(u)}})


@app.post("/api/registro")
def api_registro():
    d = json_body()
    if not limitar("registro:" + (request.remote_addr or ""), 5, 3600):
        return error("demasiados_intentos", 429)
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
    usuario, clave = str(d.get("usuario", "")).strip(), str(d.get("clave", ""))
    if not limitar("entrar:" + (request.remote_addr or "") + ":" + usuario.lower()):
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


# ---------- builds ----------
@app.get("/api/builds")
def api_builds_publicas():
    clase, modo, q = request.args.get("clase"), request.args.get("modo"), (request.args.get("q") or "").strip()
    sql, params = SELECT_BUILD + " WHERE b.publica", []
    if clase in reglas.CLASES:
        sql += " AND b.clase = %s"
        params.append(clase)
    if modo in reglas.MODOS:
        sql += " AND b.modo = %s"
        params.append(modo)
    if q:
        sql += " AND (b.nombre ILIKE %s OR u.usuario ILIKE %s)"
        params += ["%" + q[:60] + "%"] * 2
    sql += " ORDER BY b.actualizado DESC LIMIT 200"
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
    b = build_publica(f)
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
    return jsonify(b)


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
    try:
        c = campos_build(json_body(), actual, admin=u["rol"] in ROLES_ADMIN)
    except ValueError as e:
        return error(str(e))
    db.uno("""UPDATE builds SET nombre = %s, modo = %s, descripcion = %s, publica = %s, datos = %s, actualizado = now()
              WHERE id = %s RETURNING id""",
           (c["nombre"], c["modo"], c["descripcion"], c["publica"], Jsonb(c["datos"]), bid))
    return jsonify({"ok": True})


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


@app.get("/api/juego/buscar")
@requiere_login
def api_juego_buscar(u):
    if not limitar("juego:" + str(u["id"]), 30, 600):
        return error("demasiados_intentos", 429)
    try:
        return jsonify(juego.buscar(request.args.get("q")))
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)


@app.get("/api/juego/ficha")
@requiere_login
def api_juego_ficha(u):
    """Ficha pública de cualquier personaje para el comparador. No se guarda ni se vincula."""
    if not limitar("verjuego:" + str(u["id"]), 20, 600):
        return error("demasiados_intentos", 429)
    try:
        leido = juego.leer(request.args.get("cid"), request.args.get("server"))
    except juego.JuegoError as e:
        return error(str(e), 502 if str(e) == "juego_no_disponible" else 400)
    leido["ficha"] = juego.completar_ficha(leido["clase"], leido.get("ficha") or {})
    return jsonify({**leido, "leido": datetime.now(timezone.utc).isoformat()})


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


@app.get("/api/estadisticas")
def api_estadisticas():
    filas = db.todos("SELECT clase, count(*) AS n FROM builds WHERE publica GROUP BY clase")
    return jsonify({f["clase"]: f["n"] for f in filas})


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
GREMIO = "espclowns"


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


def denunciar(u, tipo, objetivo, motivo):
    if tipo not in ("tema", "mensaje", "chat"):
        return error("no_existe", 404)
    motivo = texto_ok(motivo, 200)
    if not motivo:
        return error("texto_vacio")
    tabla = {"tema": "temas", "mensaje": "mensajes", "chat": "chat"}[tipo]
    fila = db.uno(f"SELECT id, usuario_id FROM {tabla} WHERE id = %s", (objetivo,))
    if not fila or fila["usuario_id"] == u["id"]:
        return error("no_existe", 404)
    if db.uno("SELECT 1 FROM denuncias WHERE usuario_id = %s AND tipo = %s AND objetivo_id = %s AND NOT resuelta",
              (u["id"], tipo, objetivo)):
        return error("ya_denunciado", 409)
    db.uno("INSERT INTO denuncias (usuario_id, tipo, objetivo_id, motivo) VALUES (%s, %s, %s, %s) RETURNING id",
           (u["id"], tipo, objetivo, motivo))
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
        return error("demasiados_intentos", 429)
    d = json_body()
    titulo, texto = texto_ok(d.get("titulo"), 120), texto_ok(d.get("texto"), 6000)
    if not titulo or not texto:
        return error("texto_vacio")
    tema = db.uno("""INSERT INTO temas (categoria, usuario_id, titulo) VALUES (%s, %s, %s) RETURNING id""",
                  (categoria, u["id"], titulo))
    db.uno("INSERT INTO mensajes (tema_id, usuario_id, texto) VALUES (%s, %s, %s) RETURNING id",
           (tema["id"], u["id"], texto))
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
        return error("demasiados_intentos", 429)
    texto = texto_ok(json_body().get("texto"), 6000)
    if not texto:
        return error("texto_vacio")
    m = db.uno("INSERT INTO mensajes (tema_id, usuario_id, texto) VALUES (%s, %s, %s) RETURNING id", (tid, u["id"], texto))
    db.uno("UPDATE temas SET actualizado = now() WHERE id = %s RETURNING id", (tid,))
    return jsonify({"id": m["id"]}), 201


@app.put("/api/foro/mensaje/<int:mid>")
@requiere_escribir
def api_foro_editar(u, mid):
    texto = texto_ok(json_body().get("texto"), 6000)
    if not texto:
        return error("texto_vacio")
    if not db.uno("""UPDATE mensajes SET texto = %s, editado = now()
                     WHERE id = %s AND usuario_id = %s AND NOT oculto RETURNING id""", (texto, mid, u["id"])):
        return error("no_existe", 404)
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
    return jsonify(_config["valor"])


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
@app.get("/api/panel")
@requiere_rol(*ROLES_MOD)
def api_panel(u):
    denuncias = db.todos("""SELECT d.id, d.tipo, d.objetivo_id, d.motivo, d.creado, u.usuario AS autor
                            FROM denuncias d JOIN usuarios u ON u.id = d.usuario_id
                            WHERE NOT d.resuelta ORDER BY d.id DESC LIMIT 50""")
    chat = db.todos("""SELECT c.id, c.texto, c.oculto, c.motivo, c.creado, u.usuario AS autor
                       FROM chat c JOIN usuarios u ON u.id = c.usuario_id
                       ORDER BY c.id DESC LIMIT 40""")
    return jsonify({
        "rol": u["rol"],
        "denuncias": [{"id": d["id"], "tipo": d["tipo"], "objetivo": d["objetivo_id"], "motivo": d["motivo"],
                       "autor": d["autor"], "creado": iso(d["creado"])} for d in denuncias],
        "chat": [{"id": c["id"], "texto": c["texto"], "oculto": c["oculto"], "motivo": c["motivo"],
                  "autor": c["autor"], "creado": iso(c["creado"])} for c in chat],
        "habilidades_nuevas": ajuste("habilidades_nuevas", {}) if u["rol"] in ROLES_ADMIN else {},
        "discord": ajuste("discord", {}) if u["rol"] == "superadmin" else None,
        "ultimo_parche": fila_noticia(p) if (p := db.uno(
            "SELECT * FROM noticias WHERE tablon = 'update' AND idioma = 'es' ORDER BY publicado DESC LIMIT 1")) else None,
    })


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
        db.todos("UPDATE denuncias SET resuelta = TRUE WHERE tipo = 'tema' AND objetivo_id = %s AND NOT resuelta RETURNING id", (tid,))
    return jsonify({"ok": True})


@app.post("/api/panel/mensajes/<int:mid>")
@requiere_rol(*ROLES_MOD)
def api_panel_mensaje(u, mid):
    if not db.uno("SELECT id FROM mensajes WHERE id = %s", (mid,)):
        return error("no_existe", 404)
    d = json_body()
    db.uno("UPDATE mensajes SET oculto = %s, motivo = %s WHERE id = %s RETURNING id",
           (bool(d.get("oculto", True)), recortar(d.get("motivo"), 200) or None, mid))
    db.todos("UPDATE denuncias SET resuelta = TRUE WHERE tipo = 'mensaje' AND objetivo_id = %s AND NOT resuelta RETURNING id", (mid,))
    return jsonify({"ok": True})


@app.post("/api/panel/chat/<int:cid>")
@requiere_rol(*ROLES_MOD)
def api_panel_chat(u, cid):
    if not db.uno("SELECT id FROM chat WHERE id = %s", (cid,)):
        return error("no_existe", 404)
    d = json_body()
    db.uno("UPDATE chat SET oculto = %s, motivo = %s WHERE id = %s RETURNING id",
           (bool(d.get("oculto", True)), recortar(d.get("motivo"), 200) or None, cid))
    db.todos("UPDATE denuncias SET resuelta = TRUE WHERE tipo = 'chat' AND objetivo_id = %s AND NOT resuelta RETURNING id", (cid,))
    return jsonify({"ok": True})


@app.post("/api/panel/denuncias/<int:did>")
@requiere_rol(*ROLES_MOD)
def api_panel_denuncia(u, did):
    if not db.uno("UPDATE denuncias SET resuelta = TRUE WHERE id = %s RETURNING id", (did,)):
        return error("no_existe", 404)
    return jsonify({"ok": True})


@app.get("/api/panel/usuarios")
@requiere_rol("superadmin")
def api_panel_usuarios(u):
    filas = db.todos("""SELECT id, usuario, rol, creado, expulsado_hasta FROM usuarios
                        WHERE rol <> 'sistema' ORDER BY lower(usuario)""")
    return jsonify([{"id": f["id"], "usuario": f["usuario"], "rol": f["rol"], "creado": iso(f["creado"]),
                     "expulsado_hasta": iso(f["expulsado_hasta"]), "propio": f["id"] == u["id"]} for f in filas])


@app.post("/api/panel/usuarios/<int:uid>")
@requiere_rol("superadmin")
def api_panel_usuario(u, uid):
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


# ---------- páginas y estáticos ----------
@app.get("/")
def inicio():
    return send_from_directory(RAIZ, "index.html")


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
