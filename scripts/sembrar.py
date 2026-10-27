"""Prepara la base de datos: esquema, builds de referencia del gremio, usuario admin y build desde Excel.

Uso:
  python scripts/sembrar.py --referencias
  python scripts/sembrar.py --admin USUARIO [--clave CLAVE]
  python scripts/sembrar.py --excel RUTA.xlsx --usuario USUARIO [--nombre "Mi Cantor"] [--clase chanter]
"""
import argparse
import json
import re
import secrets
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from psycopg.types.json import Jsonb  # noqa: E402
from werkzeug.security import generate_password_hash  # noqa: E402

import db  # noqa: E402
import reglas  # noqa: E402

RAIZ = db.RAIZ
REPO_REF = "referencia.html?c="
AUTOR_REF = "Orden Celeste"


def usuario(nombre, rol="usuario", clave=None):
    fila = db.uno("SELECT id FROM usuarios WHERE lower(usuario) = lower(%s)", (nombre,))
    if fila:
        if clave:
            db.uno("UPDATE usuarios SET clave_hash = %s, rol = %s WHERE id = %s RETURNING id",
                   (generate_password_hash(clave), rol, fila["id"]))
        return fila["id"], None
    clave = clave or secrets.token_urlsafe(12)
    fila = db.uno("INSERT INTO usuarios (usuario, clave_hash, rol) VALUES (%s, %s, %s) RETURNING id",
                  (nombre, generate_password_hash(clave), rol))
    return fila["id"], clave


def guardar_build(uid, clase, nombre, datos, publica, descripcion="", modo="pve", fuente=None, admin=False):
    datos = reglas.limpiar_datos(clase, datos, admin=admin)
    fila = db.uno("SELECT id FROM builds WHERE usuario_id = %s AND clase = %s AND nombre = %s", (uid, clase, nombre))
    if fila:
        db.uno("""UPDATE builds SET datos = %s, publica = %s, descripcion = %s, modo = %s, fuente = %s, actualizado = now()
                  WHERE id = %s RETURNING id""", (Jsonb(datos), publica, descripcion, modo, fuente, fila["id"]))
        return fila["id"], datos
    fila = db.uno("""INSERT INTO builds (usuario_id, clase, nombre, modo, descripcion, publica, fuente, datos)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                  (uid, clase, nombre, modo, descripcion, publica, fuente, Jsonb(datos)))
    return fila["id"], datos


PRESET_DAEV = {"Launch priority": "Prioridad de lanzamiento", "Full PvE": "JcE completo"}


def referencias():
    uid, _ = usuario(AUTOR_REF, rol="sistema")
    for clase in reglas.CLASES:
        f = RAIZ / "data" / "builds" / f"{clase}.js"
        s = f.read_text(encoding="utf-8")
        b = json.loads(s[s.index("{"): s.rindex("}") + 1])
        habs = {h["id"]: {"nivel": h.get("nivel") or 0,
                          "esp": [e["n"] for e in h.get("especializaciones", []) if e.get("elegida")]}
                for h in b["habilidades"]}
        dae = [{"nombre": PRESET_DAEV.get(p.get("nombre_en"), p.get("nombre_en")),
                "nodos": [n for t in p["tableros"].values() for n in t["tomados"]]} for p in (b.get("daevanion") or {}).get("presets", [])]
        datos = {"habilidades": habs, "nivel_pj": b.get("nivel"), "daevanion": {"presets": dae},
                 "barra": b.get("barra"), "macros": b.get("macros"), "prioridad": b.get("prioridad")}
        resumen = re.sub(r"\*\*(.+?)\*\*", r"\1", (b.get("textos") or {}).get("resumen", ""))
        bid, d = guardar_build(uid, clase, f"Referencia JcE nivel {b.get('nivel')}", datos, True, resumen,
                               fuente=REPO_REF + clase, admin=True)
        print(f"  referencia {clase}: build {bid} con {len(d['habilidades'])} habilidades")


def desde_excel(ruta, nombre_usuario, nombre_build, clase):
    import openpyxl
    fila = db.uno("SELECT id FROM usuarios WHERE lower(usuario) = lower(%s)", (nombre_usuario,))
    if not fila:
        sys.exit(f"No existe el usuario {nombre_usuario}")
    cat = reglas.catalogo(clase)
    por_nombre = {h["nombre"]["es"].lower(): h for h in cat.values()}
    wb = openpyxl.load_workbook(ruta, read_only=True)
    filas = list(wb.worksheets[0].iter_rows(values_only=True))
    cab = [str(c or "").strip() for c in filas[0]]
    col = {k: cab.index(k) for k in cab}
    habs, fuera = {}, []
    for r in filas[1:]:
        if not r or not r[0]:
            continue
        h = por_nombre.get(str(r[0]).strip().lower())
        if not h:
            fuera.append(str(r[0]))
            continue
        nivel = int(r[col["Nv Actual"]] or 0)
        esp = []
        if h["tipo"] == "activa":
            # columnas «Esp. 1/2/3 (X)»: la X marca el hueco ocupado, no qué especialización; se elige en la web
            pass
        if nivel:
            habs[h["id"]] = {"nivel": nivel, "esp": esp}
    bid, d = guardar_build(fila["id"], clase, nombre_build, {"habilidades": habs}, False,
                           "Importada desde el Excel de habilidades.")
    print(f"  build {bid} «{nombre_build}»: {len(d['habilidades'])} habilidades con nivel")
    if fuera:
        print("  no están en el catálogo:", ", ".join(fuera))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--referencias", action="store_true")
    ap.add_argument("--admin")
    ap.add_argument("--clave")
    ap.add_argument("--excel")
    ap.add_argument("--usuario")
    ap.add_argument("--nombre", default="Mi Cantor")
    ap.add_argument("--clase", default="chanter")
    a = ap.parse_args()
    db.crear_esquema()
    if a.referencias:
        referencias()
    if a.admin:
        _, clave = usuario(a.admin, rol="admin", clave=a.clave)
        print(f"  admin {a.admin}" + (f" creado. Contraseña: {clave}" if clave else " actualizado"))
    if a.excel:
        desde_excel(a.excel, a.usuario or a.admin, a.nombre, a.clase)
    db.cerrar()


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
