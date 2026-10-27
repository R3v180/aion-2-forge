"""Publica/refresca 1–2 builds de tops por clase (ranking_pj → ficha NC → builds públicas).

Se dispara en background ≈1×/día al listar builds. No bloquea la petición.
Fuente estable por hueco: top:{clase}:{rank} (1 o 2).
"""
import json
import threading
import time

from psycopg.types.json import Jsonb
from werkzeug.security import generate_password_hash
import secrets

import db
import juego
import reglas

CADA = 24 * 60 * 60
TOP_N = 2
PAUSA = 2.2
CLAVE = "tops_builds_sync"
AUTOR = "Orden Celeste"

_lock = threading.Lock()
_ultima = {"t": 0.0}


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
    f = db.uno("SELECT extract(epoch FROM now() - cambiado) AS s FROM ajustes WHERE clave = %s", (CLAVE,))
    return not f or f["s"] is None or float(f["s"]) > CADA


def _marcar(extra=None):
    db.uno(
        """INSERT INTO ajustes (clave, valor) VALUES (%s, %s)
           ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
        (CLAVE, json.dumps(extra or {"ok": True})),
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


def _guardar_hueco(uid, clase, rank, fila, datos):
    fuente = f"top:{clase}:{rank}"
    nombre = f"Top #{rank} · {fila['nombre']}"
    poder = fila.get("poder")
    ilvl = fila.get("nivel_objeto")
    desc = (
        f"Instantánea del ranking comunitario (Espía). "
        f"{fila.get('servidor') or 'EU'} · poder {poder if poder is not None else '—'} · "
        f"iLvl {ilvl if ilvl is not None else '—'}."
    )
    datos = dict(datos or {})
    datos["_top"] = {
        "rank": rank,
        "character_id": str(fila["character_id"]),
        "server_id": int(fila["server_id"]),
        "nombre": fila["nombre"],
        "servidor": fila.get("servidor") or "",
        "poder": poder,
        "nivel_objeto": ilvl,
    }
    actual = db.uno("SELECT id FROM builds WHERE usuario_id = %s AND fuente = %s", (uid, fuente))
    if actual:
        db.uno(
            """UPDATE builds SET clase = %s, nombre = %s, descripcion = %s, publica = TRUE, modo = 'pve',
                      datos = %s, actualizado = now() WHERE id = %s RETURNING id""",
            (clase, nombre, desc, Jsonb(datos), actual["id"]),
        )
        return actual["id"]
    f = db.uno(
        """INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, fuente, datos)
           VALUES (%s, %s, %s, 'pve', %s, TRUE, %s, %s) RETURNING id""",
        (uid, clase, nombre, desc, fuente, Jsonb(datos)),
    )
    return f["id"]


def _ocultar_hueco(uid, clase, rank):
    fuente = f"top:{clase}:{rank}"
    db.uno(
        "UPDATE builds SET publica = FALSE, actualizado = now() WHERE usuario_id = %s AND fuente = %s RETURNING id",
        (uid, fuente),
    )


def refrescar():
    """Lee top N por clase desde ranking_pj y publica/actualiza builds."""
    uid = _usuario_sistema()
    ok = fallos = 0
    for clase in reglas.CLASES:
        tops = _tops_clase(clase)
        for rank in range(1, TOP_N + 1):
            if rank > len(tops):
                _ocultar_hueco(uid, clase, rank)
                continue
            fila = tops[rank - 1]
            try:
                leido = juego.leer(fila["character_id"], fila["server_id"])
                ficha = juego.completar_ficha(leido["clase"], leido.get("ficha") or {})
                datos = juego.datos_desde_ficha(leido["clase"], ficha, leido.get("nivel"))
                # Preferir poder/iLvl frescos de la ficha si vienen
                if leido.get("poder") is not None:
                    fila = {**fila, "poder": leido["poder"]}
                if ficha.get("nivel_objeto") is not None:
                    fila = {**fila, "nivel_objeto": ficha["nivel_objeto"]}
                if leido.get("servidor"):
                    fila = {**fila, "servidor": leido["servidor"]}
                _guardar_hueco(uid, clase, rank, fila, datos)
                ok += 1
            except Exception:  # noqa: BLE001
                fallos += 1
            time.sleep(PAUSA)
    _marcar({"ok": ok, "fallos": fallos, "top_n": TOP_N})
    return {"ok": ok, "fallos": fallos}


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
    """Si toca (≈1×/día), lanza el refresco en background."""
    if not _hace_falta():
        return
    threading.Thread(target=_en_segundo_plano, daemon=True).start()
