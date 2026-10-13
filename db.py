import logging
import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

RAIZ = Path(__file__).resolve().parent
load_dotenv(RAIZ / ".env")
logging.basicConfig(level=logging.WARNING, format="%(asctime)s %(name)s %(levelname)s %(message)s")
_pool = None
_pid = None


def _url():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("Falta DATABASE_URL en el entorno o en .env")
    return url


def pool():
    # gunicorn puede importar la app antes de crear los workers: un pool heredado por fork
    # no tiene sus hilos internos y nunca entrega conexiones, así que cada proceso abre el suyo
    global _pool, _pid
    if _pool is None or _pid != os.getpid():
        url = _url()
        _pid = os.getpid()
        # Neon cierra las conexiones inactivas: se comprueban antes de usarlas
        _pool = ConnectionPool(
            url,
            min_size=1,
            max_size=5,
            max_idle=240,
            check=ConnectionPool.check_connection,
            timeout=15,
            # el pooler de Neon (PgBouncer) no admite sentencias preparadas entre transacciones
            kwargs={"row_factory": dict_row, "autocommit": True, "connect_timeout": 10, "prepare_threshold": None},
            open=True,
        )
    return _pool


def cerrar():
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None


def crear_esquema():
    with psycopg.connect(_url(), autocommit=True, connect_timeout=10, prepare_threshold=None) as c:
        c.execute((RAIZ / "schema.sql").read_text(encoding="utf-8"))


def uno(sql, params=()):
    with pool().connection() as c:
        return c.execute(sql, params).fetchone()


def todos(sql, params=()):
    with pool().connection() as c:
        return c.execute(sql, params).fetchall()
