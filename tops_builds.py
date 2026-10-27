"""Tops semanales → builds públicas votables.

- Huecos vivos: fuente top:live:{clase}:{rank} (1–2 por clase, semana ISO).
- Si cambia el pj o la semana: se archiva a top:was:… (sigue pública, votos intactos).
- Historial en top_log → títulos en Espía («Top semana», «Ex-Top #1», «Leyenda», …).
"""
import json
import secrets
import threading
import time
from datetime import datetime, timezone

from psycopg.types.json import Jsonb
from werkzeug.security import generate_password_hash

import db
import juego
import reglas

# Revisa cada día; solo crea/archiva si cambia semana o el ocupante del hueco.
CADA = 24 * 60 * 60
TOP_N = 2
PAUSA = 2.2
CLAVE = "tops_builds_sync"
AUTOR = "Aion 2 Forge"

_lock = threading.Lock()
_ultima = {"t": 0.0}


def semana_iso(dt=None):
    d = dt or datetime.now(timezone.utc)
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def _usuario_sistema():
    f = db.uno("SELECT id FROM usuarios WHERE lower(usuario) = lower(%s)", (AUTOR,))
    if f:
        return f["id"]
    f = db.uno(
        "INSERT INTO usuarios (usuario, clave_hash, rol) VALUES (%s, %s, 'sistema') RETURNING id",
        (AUTOR, generate_password_hash(secrets.token_urlsafe(16))),
    )
    return f["id"]


def _hace_falta():
    if time.time() - _ultima["t"] < 120:
        return False
    _ultima["t"] = time.time()
    f = db.uno("SELECT valor, extract(epoch FROM now() - cambiado) AS s FROM ajustes WHERE clave = %s", (CLAVE,))
    if not f or f["s"] is None or float(f["s"]) > CADA:
        return True
    try:
        prev = json.loads(f["valor"] or "{}")
    except (TypeError, ValueError, json.JSONDecodeError):
        prev = {}
    return prev.get("semana") != semana_iso()


def _marcar(extra=None):
    payload = {"ok": True, "semana": semana_iso()}
    if extra:
        payload.update(extra)
    db.uno(
        """INSERT INTO ajustes (clave, valor) VALUES (%s, %s)
           ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
        (CLAVE, json.dumps(payload)),
    )


def _tops_clase(clase):
    return db.todos(
        """SELECT character_id, server_id, nombre, servidor, clase, raza, nivel, poder, nivel_objeto
           FROM ranking_pj
           WHERE clase = %s AND COALESCE(poder, 0) > 0
           ORDER BY poder DESC NULLS LAST, nivel_objeto DESC NULLS LAST, actualizado DESC
           LIMIT %s""",
        (clase, TOP_N),
    ) or []


def _meta_top(datos):
    if not isinstance(datos, dict):
        return {}
    t = datos.get("_top")
    return t if isinstance(t, dict) else {}


def _fuente_live(clase, rank):
    return f"top:live:{clase}:{rank}"


def _fuente_was(semana, clase, rank, cid, sid):
    return f"top:was:{semana}:{clase}:{rank}:{cid}:{sid}"


def _migrar_legacy(uid, clase, rank):
    """Antiguo top:{clase}:{rank} → top:live:…"""
    vieja = f"top:{clase}:{rank}"
    f = db.uno("SELECT id, datos FROM builds WHERE usuario_id = %s AND fuente = %s", (uid, vieja))
    if not f:
        return
    live = _fuente_live(clase, rank)
    if db.uno("SELECT id FROM builds WHERE usuario_id = %s AND fuente = %s", (uid, live)):
        # Ya hay live: archiva la legacy
        top = _meta_top(f["datos"])
        sem = top.get("semana") or semana_iso()
        cid = str(top.get("character_id") or "x")
        sid = int(top.get("server_id") or 0)
        db.uno(
            """UPDATE builds SET fuente = %s, nombre = %s, publica = TRUE, actualizado = now()
               WHERE id = %s RETURNING id""",
            (_fuente_was(sem, clase, rank, cid, sid), (top.get("nombre") or f"Ex-Top · {sem}")[:80], f["id"]),
        )
        return
    db.uno("UPDATE builds SET fuente = %s, actualizado = now() WHERE id = %s RETURNING id", (live, f["id"]))


def _archivar_live(uid, clase, rank):
    fuente = _fuente_live(clase, rank)
    b = db.uno("SELECT id, nombre, datos FROM builds WHERE usuario_id = %s AND fuente = %s", (uid, fuente))
    if not b:
        return None
    top = _meta_top(b["datos"])
    sem = str(top.get("semana") or semana_iso())
    cid = str(top.get("character_id") or "x")
    try:
        sid = int(top.get("server_id") or 0)
    except (TypeError, ValueError):
        sid = 0
    nombre_pj = top.get("nombre") or b["nombre"]
    nombre = str(nombre_pj or "Ex-Top")[:80]
    datos = dict(b["datos"] or {})
    datos["_top"] = {**top, "vigente": False, "archivado": True, "rank": rank, "semana": sem}
    was = _fuente_was(sem, clase, rank, cid, sid)
    # Evitar choque de fuente única lógica
    if db.uno("SELECT id FROM builds WHERE fuente = %s AND id <> %s", (was, b["id"])):
        was = f"{was}:{b['id']}"
    db.uno(
        """UPDATE builds SET fuente = %s, nombre = %s, descripcion = %s, datos = %s, publica = TRUE, actualizado = now()
           WHERE id = %s RETURNING id""",
        (
            was,
            nombre,
            f"Archivo del top semanal {sem}. Los votos se conservan.",
            Jsonb(datos),
            b["id"],
        ),
    )
    db.todos("UPDATE top_log SET vigente = FALSE WHERE build_id = %s RETURNING id", (b["id"],))
    return b["id"]


def _registrar_log(semana, clase, rank, fila, build_id, vigente=True):
    db.uno(
        """INSERT INTO top_log (semana, clase, puesto, character_id, server_id, nombre, poder, build_id, vigente)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
           ON CONFLICT (semana, clase, puesto) DO UPDATE SET
             character_id = EXCLUDED.character_id,
             server_id = EXCLUDED.server_id,
             nombre = EXCLUDED.nombre,
             poder = EXCLUDED.poder,
             build_id = EXCLUDED.build_id,
             vigente = EXCLUDED.vigente
           RETURNING id""",
        (
            semana,
            clase,
            rank,
            str(fila["character_id"]),
            int(fila["server_id"]),
            str(fila.get("nombre") or "")[:80],
            fila.get("poder"),
            build_id,
            vigente,
        ),
    )


def _actualizar_meta_poder(build_id, fila, semana, rank):
    b = db.uno("SELECT datos, nombre FROM builds WHERE id = %s", (build_id,))
    if not b:
        return
    datos = dict(b["datos"] or {})
    top = _meta_top(datos)
    top.update({
        "rank": rank,
        "semana": semana,
        "vigente": True,
        "archivado": False,
        "character_id": str(fila["character_id"]),
        "server_id": int(fila["server_id"]),
        "nombre": fila["nombre"],
        "servidor": fila.get("servidor") or top.get("servidor") or "",
        "poder": fila.get("poder"),
        "nivel_objeto": fila.get("nivel_objeto"),
    })
    datos["_top"] = top
    poder = fila.get("poder")
    ilvl = fila.get("nivel_objeto")
    desc = (
        f"Top semanal {semana} (ranking comunitario Espía). "
        f"{fila.get('servidor') or 'EU'} · poder {poder if poder is not None else '—'} · "
        f"iLvl {ilvl if ilvl is not None else '—'}."
    )
    nombre = str(fila["nombre"] or "Top")[:80]
    db.uno(
        """UPDATE builds SET nombre = %s, descripcion = %s, modo = 'otro', datos = %s, publica = TRUE, actualizado = now()
           WHERE id = %s RETURNING id""",
        (nombre, desc, Jsonb(datos), build_id),
    )


def _crear_live(uid, clase, rank, fila, semana, datos):
    fuente = _fuente_live(clase, rank)
    poder = fila.get("poder")
    ilvl = fila.get("nivel_objeto")
    nombre = str(fila["nombre"] or "Top")[:80]
    desc = (
        f"Top semanal {semana} (ranking comunitario Espía). "
        f"{fila.get('servidor') or 'EU'} · poder {poder if poder is not None else '—'} · "
        f"iLvl {ilvl if ilvl is not None else '—'}. Vota esta instantánea."
    )
    datos = dict(datos or {})
    datos["_top"] = {
        "rank": rank,
        "semana": semana,
        "vigente": True,
        "archivado": False,
        "character_id": str(fila["character_id"]),
        "server_id": int(fila["server_id"]),
        "nombre": fila["nombre"],
        "servidor": fila.get("servidor") or "",
        "poder": poder,
        "nivel_objeto": ilvl,
    }
    # modo 'otro': no sabemos si es JcE/JcJ; en Builds solo se etiqueta como Top
    f = db.uno(
        """INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, fuente, datos)
           VALUES (%s, %s, %s, 'otro', %s, TRUE, %s, %s) RETURNING id""",
        (uid, clase, nombre, desc, fuente, Jsonb(datos)),
    )
    return f["id"]


def _asegurar_hueco(uid, clase, rank, fila, semana):
    """Mantiene el hueco vivo: archiva si cambia pj/semana; si es el mismo, no regenera la build."""
    _migrar_legacy(uid, clase, rank)
    fuente = _fuente_live(clase, rank)
    actual = db.uno("SELECT id, datos FROM builds WHERE usuario_id = %s AND fuente = %s", (uid, fuente))
    top = _meta_top((actual or {}).get("datos"))
    mismo = bool(
        actual
        and str(top.get("character_id")) == str(fila["character_id"])
        and int(top.get("server_id") or -1) == int(fila["server_id"])
        and top.get("semana") == semana
    )
    if mismo:
        _actualizar_meta_poder(actual["id"], fila, semana, rank)
        _registrar_log(semana, clase, rank, fila, actual["id"], vigente=True)
        return actual["id"], False
    if actual:
        _archivar_live(uid, clase, rank)
    leido = juego.leer(fila["character_id"], fila["server_id"])
    ficha = juego.completar_ficha(leido["clase"], leido.get("ficha") or {})
    datos = juego.datos_desde_ficha(leido["clase"], ficha, leido.get("nivel"))
    if leido.get("poder") is not None:
        fila = {**fila, "poder": leido["poder"]}
    if ficha.get("nivel_objeto") is not None:
        fila = {**fila, "nivel_objeto": ficha["nivel_objeto"]}
    if leido.get("servidor"):
        fila = {**fila, "servidor": leido["servidor"]}
    if leido.get("nombre"):
        fila = {**fila, "nombre": leido["nombre"]}
    bid = _crear_live(uid, clase, rank, fila, semana, datos)
    _registrar_log(semana, clase, rank, fila, bid, vigente=True)
    return bid, True


def _vaciar_hueco(uid, clase, rank, semana):
    _migrar_legacy(uid, clase, rank)
    _archivar_live(uid, clase, rank)
    db.todos(
        """UPDATE top_log SET vigente = FALSE
           WHERE semana = %s AND clase = %s AND puesto = %s RETURNING id""",
        (semana, clase, rank),
    )


def refrescar():
    uid = _usuario_sistema()
    semana = semana_iso()
    ok = fallos = nuevas = 0
    for clase in reglas.CLASES:
        tops = _tops_clase(clase)
        for rank in range(1, TOP_N + 1):
            if rank > len(tops):
                _vaciar_hueco(uid, clase, rank, semana)
                continue
            fila = tops[rank - 1]
            try:
                _, creada = _asegurar_hueco(uid, clase, rank, fila, semana)
                ok += 1
                if creada:
                    nuevas += 1
                    time.sleep(PAUSA)
            except Exception:  # noqa: BLE001
                fallos += 1
                time.sleep(PAUSA)
    # Cualquier live de otra semana residual → archivar
    vivos = db.todos(
        """SELECT id, clase, fuente, datos FROM builds
           WHERE usuario_id = %s AND fuente LIKE 'top:live:%%'""",
        (uid,),
    ) or []
    for b in vivos:
        top = _meta_top(b["datos"])
        if top.get("semana") and top.get("semana") != semana:
            partes = str(b["fuente"]).split(":")
            # top:live:clase:rank
            if len(partes) >= 4:
                _archivar_live(uid, partes[2], int(partes[3]))
    _marcar({"ok": ok, "fallos": fallos, "nuevas": nuevas, "top_n": TOP_N, "semana": semana})
    return {"ok": ok, "fallos": fallos, "nuevas": nuevas, "semana": semana}


def palmares(character_id, server_id):
    """Títulos + historial de tops para un personaje (Espía / búsqueda)."""
    cid = str(character_id or "").strip()
    try:
        sid = int(server_id)
    except (TypeError, ValueError):
        return {"badges": [], "top1": 0, "semanas": 0, "historial": [], "semana_actual": semana_iso()}
    if not cid:
        return {"badges": [], "top1": 0, "semanas": 0, "historial": [], "semana_actual": semana_iso()}
    filas = db.todos(
        """SELECT t.semana, t.clase, t.puesto, t.poder, t.vigente, t.build_id, t.nombre,
                  COALESCE(v.likes, 0) AS likes, COALESCE(v.dislikes, 0) AS dislikes
           FROM top_log t
           LEFT JOIN LATERAL (
             SELECT
               count(*) FILTER (WHERE valor = 1)::int AS likes,
               count(*) FILTER (WHERE valor = -1)::int AS dislikes
             FROM build_votos WHERE build_id = t.build_id
           ) v ON TRUE
           WHERE t.character_id = %s AND t.server_id = %s
           ORDER BY t.semana DESC, t.puesto ASC
           LIMIT 40""",
        (cid, sid),
    ) or []
    top1 = sum(1 for f in filas if int(f["puesto"]) == 1)
    top2 = sum(1 for f in filas if int(f["puesto"]) == 2)
    vigente = next((f for f in filas if f["vigente"]), None)
    badges = []
    if vigente:
        badges.append({
            "id": "top_semana",
            "puesto": int(vigente["puesto"]),
            "semana": vigente["semana"],
            "clase": vigente["clase"],
        })
    if top1 >= 4:
        badges.append({"id": "leyenda", "top1": top1})
    elif top1 >= 1 and not (vigente and int(vigente["puesto"]) == 1):
        badges.append({"id": "ex_top1", "top1": top1})
    elif (top1 + top2) >= 1 and not vigente:
        badges.append({"id": "ex_top", "semanas": top1 + top2})
    historial = [
        {
            "semana": f["semana"],
            "clase": f["clase"],
            "puesto": int(f["puesto"]),
            "poder": f["poder"],
            "vigente": bool(f["vigente"]),
            "build_id": f["build_id"],
            "likes": int(f["likes"] or 0),
            "dislikes": int(f["dislikes"] or 0),
        }
        for f in filas
    ]
    return {
        "badges": badges,
        "top1": top1,
        "semanas": top1 + top2,
        "historial": historial,
        "semana_actual": semana_iso(),
    }


def es_top_live(fuente):
    return bool(fuente) and str(fuente).startswith("top:live:")


def es_top_was(fuente):
    return bool(fuente) and str(fuente).startswith("top:was:")


def es_top(fuente):
    return bool(fuente) and str(fuente).startswith("top:")


def _en_segundo_plano():
    if not _lock.acquire(blocking=False):
        return
    try:
        refrescar()
    except Exception:  # noqa: BLE001
        pass
    finally:
        _lock.release()


def al_dia():
    """Si toca (cada día o al cambiar de semana), refresca en background."""
    if not _hace_falta():
        return
    threading.Thread(target=_en_segundo_plano, daemon=True).start()
