"""Siembra ranking_pj con carnets ligeros frescos (poder/iLvl de NC).

Uso:
  py -3 scripts/sembrar_ranking.py
  py -3 scripts/sembrar_ranking.py --solo 5   # prueba corta
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import db  # noqa: E402
import juego  # noqa: E402

# Nombre, clase_id, servidor (como en SERVIDORES_EU)
LISTA = [
    ("gigawhaleYT", "chanter", "Israphel"),
    ("shiguanggg", "ranger", "Israphel"),
    ("GaiusSezarTR", "gladiator", "Kaisinel"),
    ("Free", "gladiator", "Lumiel"),
    ("Minibarbie", "chanter", "Israphel"),
    ("Noush", "ranger", "Vaizel"),
    ("WildKing", "ranger", "Kaisinel"),
    ("Tadas", "ranger", "Nezekan"),
    ("Asulgard", "ranger", "Siel"),
    ("Chixy", "gladiator", "Israphel"),
    ("Sweetfox", "spiritmaster", "Siel"),
    ("Fry", "gladiator", "Israphel"),
    ("dieyoung", "ranger", "Israphel"),
    ("Wenya", "chanter", "Nezekan"),
    ("Axe", "assassin", "Zikel"),
    ("dori", "chanter", "Israphel"),
    ("qmjs", "spiritmaster", "Nezekan"),
    ("大机霸", "gladiator", "Zikel"),
    ("Papi", "assassin", "Vaizel"),
    ("Narkzul", "sorcerer", "Siel"),
    ("Rhap", "gladiator", "Israphel"),
    ("Murmuriel", "gladiator", "Nezekan"),
    ("DaBaiCai", "ranger", "Israphel"),
    ("DooDinette", "chanter", "Vaizel"),
    ("qingwuZ", "ranger", "Israphel"),
    ("Lyna", "ranger", "Kaisinel"),
    ("miyaxi", "gladiator", "Israphel"),
    ("minusdkp", "templar", "Kromede"),
    ("Healfree", "sorcerer", "Kaisinel"),
    ("Neverpaws", "cleric", "Israphel"),
    ("Akyran", "sorcerer", "Triniel"),
    ("Chuck", "sorcerer", "Israphel"),
    ("ipro", "spiritmaster", "Israphel"),
    ("DerZo0st", "ranger", "Vaizel"),
    ("VIPBALTA", "assassin", "Yustiel"),
    ("Cata", "ranger", "Marchutan"),
    ("Birkin", "ranger", "Siel"),
    ("Мокрая", "gladiator", "Lumiel"),
    ("CuteWangi", "spiritmaster", "Zikel"),
    ("Wellyoz", "chanter", "Triniel"),
    ("Ardent", "templar", "Triniel"),
    ("Warning", "spiritmaster", "Vaizel"),
    ("Livsy", "gladiator", "Israphel"),
    ("Feyi", "assassin", "Israphel"),
    ("Permira", "ranger", "Marchutan"),
    ("Krix", "assassin", "Israphel"),
    ("jamclub", "ranger", "Vaizel"),
    ("Blvckshark", "ranger", "Zikel"),
    ("qingwuzzz", "spiritmaster", "Israphel"),
    ("DEVILL", "gladiator", "Israphel"),
    ("Sn1per", "ranger", "Zikel"),
    ("Freezy", "ranger", "Israphel"),
    ("Hiashi", "ranger", "Triniel"),
    ("GOONER", "chanter", "Zikel"),
    ("lvl0mod", "ranger", "Azphel"),
    ("Hawkid", "gladiator", "Kaisinel"),
    ("Feng", "gladiator", "Israphel"),
    ("Hela", "sorcerer", "Zikel"),
    ("NoLootDrop", "ranger", "Israphel"),
    ("Roxi", "chanter", "Zikel"),
    ("Chanter", "chanter", "Marchutan"),
    ("ahegao", "ranger", "Israphel"),
    ("LEVO", "gladiator", "Lumiel"),
    ("Sinister", "assassin", "Israphel"),
    ("verante", "gladiator", "Zikel"),
    ("ElowenSeraph", "gladiator", "Israphel"),
    ("Magerion", "gladiator", "Triniel"),
    ("Aphev", "ranger", "Lumiel"),
    ("xYOLLYx", "ranger", "Israphel"),
    ("Sam", "chanter", "Lumiel"),
    ("supermu", "gladiator", "Vaizel"),
    ("NotFound", "assassin", "Triniel"),
    ("AnXin", "ranger", "Israphel"),
    ("joneez", "ranger", "Zikel"),
    ("Gaddemnit", "assassin", "Lumiel"),
    ("elzzu", "chanter", "Vaizel"),
    ("MardEEn", "ranger", "Israphel"),
    ("Jibril", "assassin", "Marchutan"),
    ("Requiem", "chanter", "Vaizel"),
    ("NicoRobln", "ranger", "Israphel"),
    ("Hams1", "gladiator", "Nezekan"),
    ("DENZE", "sorcerer", "Kaisinel"),
    ("eXdig0", "templar", "Azphel"),
    ("Bazelus", "ranger", "Azphel"),
    ("Dare", "ranger", "Zikel"),
    ("Eyos", "chanter", "Israphel"),
    ("XoT", "templar", "Israphel"),
    ("Deftones", "ranger", "Zikel"),
    ("ProRastaPL", "cleric", "Kaisinel"),
    ("Keypopka", "templar", "Siel"),
    ("HolyBalls", "gladiator", "Israphel"),
    ("Hotsaucee", "templar", "Triniel"),
    ("HerculesTM", "assassin", "Zikel"),
]

SQL_UPSERT = """INSERT INTO ranking_pj
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


def mapa_servidores():
    out = {}
    for s in juego.SERVIDORES_EU:
        out[s["nombre"].lower()] = s
    return out


def con_reintento(fn, intentos=3, pausa=1.2):
    ultimo = None
    for i in range(intentos):
        try:
            return fn()
        except Exception as e:
            ultimo = e
            time.sleep(pausa * (i + 1))
    raise ultimo


def encontrar(nombre, clase, server_id):
    filas, _ = con_reintento(lambda: juego._buscar_nc(nombre, page=1, size=40, server_id=server_id))
    nombre_l = nombre.casefold()
    mismos = [f for f in filas if (f.get("nombre") or "").casefold() == nombre_l and f.get("server_id") == server_id]
    if not mismos:
        # NC a veces no hace match exacto: nombre contenido
        mismos = [f for f in filas if nombre_l in (f.get("nombre") or "").casefold() and f.get("server_id") == server_id]
    if not mismos:
        return None
    con_clase = [f for f in mismos if f.get("clase") == clase]
    return (con_clase or mismos)[0]


def resolver_raza(fila, info_srv=None):
    raza = str(fila.get("raza") or "")
    if raza in ("elyos", "asmodian"):
        return raza
    raza = juego.raza_servidor(fila.get("server_id"), fila.get("servidor"))
    if raza in ("elyos", "asmodian"):
        return raza
    if info_srv and info_srv.get("raza") in ("elyos", "asmodian"):
        return info_srv["raza"]
    return ""


def upsert_carnet(fila, perfil, info_srv=None):
    imagen = str(fila.get("imagen") or "")[:300]
    if imagen and not imagen.startswith("https://"):
        imagen = ""
    raza = resolver_raza(fila, info_srv)
    db.uno(SQL_UPSERT, (
        fila["character_id"],
        int(fila["server_id"]),
        str(fila.get("nombre") or "")[:40],
        str(fila.get("servidor") or "")[:40],
        str(fila.get("clase") or "")[:24],
        raza,
        fila.get("nivel"),
        perfil.get("poder"),
        perfil.get("nivel_objeto"),
        imagen,
    ))
    return raza


def log(msg):
    try:
        print(msg, flush=True)
    except UnicodeEncodeError:
        print(msg.encode("ascii", "backslashreplace").decode("ascii"), flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", type=int, default=0, help="Procesar solo los N primeros")
    ap.add_argument("--pausa", type=float, default=0.7, help="Segundos entre personajes")
    args = ap.parse_args()

    db.crear_esquema()
    srv = mapa_servidores()
    lista = LISTA[: args.solo] if args.solo > 0 else LISTA
    ok, fallos = [], []

    log("Sembrando %d personajes en ranking_pj..." % len(lista))
    for i, (nombre, clase, servidor) in enumerate(lista, 1):
        info_srv = srv.get(servidor.lower())
        etiqueta = "%s | %s | %s" % (nombre, clase, servidor)
        if not info_srv:
            fallos.append((etiqueta, "servidor_desconocido"))
            log("[%d/%d] FAIL %s - servidor desconocido" % (i, len(lista), etiqueta))
            continue
        try:
            fila = encontrar(nombre, clase, int(info_srv["id"]))
            if not fila:
                fallos.append((etiqueta, "no_encontrado"))
                log("[%d/%d] FAIL %s - no encontrado en NC" % (i, len(lista), etiqueta))
                time.sleep(args.pausa)
                continue
            if not fila.get("clase"):
                fila["clase"] = clase
            elif fila.get("clase") != clase:
                log("[%d/%d] aviso: NC clase=%s (pedido %s)" % (i, len(lista), fila.get("clase"), clase))
            if not fila.get("servidor"):
                fila["servidor"] = info_srv["nombre"]
            if fila.get("raza") not in ("elyos", "asmodian"):
                fila["raza"] = info_srv.get("raza") or ""
            perfil = con_reintento(lambda: juego._perfil_rapido(fila["character_id"], fila["server_id"]))
            if not perfil or perfil.get("poder") is None:
                time.sleep(1.5)
                perfil = juego._perfil_rapido(fila["character_id"], fila["server_id"])
            raza = upsert_carnet(fila, perfil or {}, info_srv)
            ok.append((etiqueta, perfil.get("poder"), perfil.get("nivel_objeto"), raza))
            log("[%d/%d] OK %s - poder=%s iLvl=%s raza=%s" % (
                i, len(lista), etiqueta, perfil.get("poder"), perfil.get("nivel_objeto"), raza or "?"))
        except Exception as e:
            fallos.append((etiqueta, str(e)[:120]))
            log("[%d/%d] FAIL %s - %s" % (i, len(lista), etiqueta, e))
        time.sleep(args.pausa)

    # Backfill raza vacía desde mapa de servidores EU
    try:
        vacios = db.todos("SELECT character_id, server_id, servidor FROM ranking_pj WHERE raza IS NULL OR raza = ''") or []
        for v in vacios:
            r = juego.raza_servidor(v.get("server_id"), v.get("servidor"))
            if r in ("elyos", "asmodian"):
                db.uno("UPDATE ranking_pj SET raza = %s WHERE character_id = %s AND server_id = %s RETURNING character_id",
                       (r, v["character_id"], v["server_id"]))
    except Exception as e:
        log("aviso backfill raza: %s" % e)

    con_raza = db.uno("SELECT count(*) AS n FROM ranking_pj WHERE raza IN ('elyos', 'asmodian')") or {}
    total = db.uno("SELECT count(*) AS n FROM ranking_pj") or {}
    log("\n=== Informe ===")
    log("OK: %d" % len(ok))
    log("Fallidos: %d" % len(fallos))
    log("En BD: %s filas · con raza: %s" % (total.get("n"), con_raza.get("n")))
    if fallos:
        log("\nNo encontrados / errores:")
        for et, motivo in fallos:
            log(" - %s -> %s" % (et, motivo))
    try:
        db.cerrar()
    except Exception:
        pass
    return 0 if not fallos else 1


if __name__ == "__main__":
    raise SystemExit(main())
