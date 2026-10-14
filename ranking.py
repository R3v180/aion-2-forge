"""Refresco suave de ranking_pj: lotes pequeños, TTL largo, sin martillar NC."""
import json
import threading
import time

import db
import juego

# Como máximo un lote por hora; solo filas con más de TTL horas.
CADA = 60 * 60
TTL_HORAS = 18
LOTE = 40
PAUSA = 0.85  # segundos entre fichas (1 llamada ligera a NC cada una)

_lock = threading.Lock()
_ultima = {"t": 0.0}


def _hace_falta():
    if time.time() - _ultima["t"] < 90:
        return False
    _ultima["t"] = time.time()
    f = db.uno("SELECT extract(epoch FROM now() - cambiado) AS s FROM ajustes WHERE clave = 'ranking_sync'")
    return not f or f["s"] is None or float(f["s"]) > CADA


def _candidatos():
    return db.todos(
        """SELECT character_id, server_id, nombre, servidor, clase, raza, nivel, imagen, poder, nivel_objeto
           FROM ranking_pj
           WHERE actualizado < now() - (%s * interval '1 hour')
              OR poder IS NULL
           ORDER BY CASE WHEN poder IS NULL THEN 0 ELSE 1 END,
                    poder DESC NULLS LAST,
                    actualizado ASC NULLS FIRST
           LIMIT %s""",
        (TTL_HORAS, LOTE),
    ) or []


def refrescar_lote():
    """Actualiza poder/iLvl de hasta LOTE carnets caducados. Prioriza top y sin poder."""
    filas = _candidatos()
    ok = fallos = 0
    for i, f in enumerate(filas):
        try:
            perfil = juego._perfil_rapido(f["character_id"], f["server_id"]) or {}
            poder = perfil.get("poder")
            ilvl = perfil.get("nivel_objeto")
            if poder is None and ilvl is None:
                fallos += 1
            else:
                db.uno(
                    """UPDATE ranking_pj SET
                         poder = COALESCE(%s, poder),
                         nivel_objeto = COALESCE(%s, nivel_objeto),
                         actualizado = now()
                       WHERE character_id = %s AND server_id = %s
                       RETURNING character_id""",
                    (poder, ilvl, f["character_id"], f["server_id"]),
                )
                ok += 1
        except Exception:  # noqa: BLE001
            fallos += 1
        if i + 1 < len(filas):
            time.sleep(PAUSA)
    db.uno(
        """INSERT INTO ajustes (clave, valor) VALUES ('ranking_sync', %s)
           ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
        (json.dumps({"ok": ok, "fallos": fallos, "lote": len(filas), "ttl_h": TTL_HORAS}),),
    )
    return {"ok": ok, "fallos": fallos, "lote": len(filas)}


def _en_segundo_plano():
    if not _lock.acquire(blocking=False):
        return
    try:
        refrescar_lote()
    except Exception:  # noqa: BLE001
        pass
    finally:
        _lock.release()


def al_dia():
    """Si toca (≈1×h), lanza un lote en background. No bloquea la petición."""
    if not _hace_falta():
        return
    # Sin filas caducadas: solo marca el tick para no reintentar en bucle
    hay = db.uno(
        """SELECT 1 AS x FROM ranking_pj
           WHERE actualizado < now() - (%s * interval '1 hour') OR poder IS NULL
           LIMIT 1""",
        (TTL_HORAS,),
    )
    if not hay:
        db.uno(
            """INSERT INTO ajustes (clave, valor) VALUES ('ranking_sync', %s)
               ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor, cambiado = now() RETURNING clave""",
            (json.dumps({"ok": 0, "fallos": 0, "lote": 0, "ttl_h": TTL_HORAS}),),
        )
        return
    threading.Thread(target=_en_segundo_plano, daemon=True).start()
