import os
import re
import time
from collections import defaultdict, deque
from datetime import timedelta
from functools import wraps

from flask import Flask, abort, jsonify, request, send_from_directory, session
from psycopg.types.json import Jsonb
from werkzeug.security import check_password_hash, generate_password_hash

import db
import reglas

RAIZ = db.RAIZ
CARPETAS_PUBLICAS = {"css", "js", "data", "icons", "i18n", "img"}
USUARIO_RE = re.compile(r"^[A-Za-z0-9_.-]{3,24}$")

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
    return db.uno("SELECT id, usuario, rol FROM usuarios WHERE id = %s", (uid,))


def requiere_login(f):
    @wraps(f)
    def envoltura(*a, **k):
        u = usuario_actual()
        if not u:
            return error("no_autenticado", 401)
        return f(u, *a, **k)
    return envoltura


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
    return jsonify({"usuario": u and {"usuario": u["usuario"], "rol": u["rol"]}})


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
    u = db.uno("SELECT id, clave_hash FROM usuarios WHERE lower(usuario) = lower(%s)", (usuario,))
    if not u or not check_password_hash(u["clave_hash"], clave):
        return error("credenciales", 401)
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


@app.get("/api/mis-builds")
@requiere_login
def api_mis_builds(u):
    filas = db.todos(SELECT_BUILD + " WHERE b.usuario_id = %s ORDER BY b.actualizado DESC", (u["id"],))
    return jsonify([build_publica(f, False) for f in filas])


@app.get("/api/builds/<int:bid>")
def api_build(bid):
    f = db.uno(SELECT_BUILD + " WHERE b.id = %s", (bid,))
    u = usuario_actual()
    propia = bool(u and f and f["usuario_id"] == u["id"])
    if not f or not (f["publica"] or propia):
        return error("no_existe", 404)
    b = build_publica(f)
    b["propia"] = propia
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
        c = campos_build(json_body(), admin=u["rol"] == "admin")
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
        c = campos_build(json_body(), actual, admin=u["rol"] == "admin")
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
    n = db.uno("""INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, datos)
                  VALUES (%s, %s, %s, %s, %s, FALSE, %s) RETURNING id""",
               (u["id"], f["clase"], (f["nombre"] + " (copia)")[:80], f["modo"], f["descripcion"], Jsonb(datos)))
    return jsonify({"id": n["id"]}), 201


@app.get("/api/estadisticas")
def api_estadisticas():
    filas = db.todos("SELECT clase, count(*) AS n FROM builds WHERE publica GROUP BY clase")
    return jsonify({f["clase"]: f["n"] for f in filas})


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
