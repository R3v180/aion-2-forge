# -*- coding: utf-8 -*-
"""Actualiza TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY en el servicio de Render."""
import json
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_env():
    env = {}
    for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k] = v
    return env


def api(key, method, path, body=None):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        "https://api.render.com/v1" + path,
        data=data,
        method=method,
        headers={
            "Authorization": "Bearer " + key,
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()[:2000]}")
        return None


def main():
    env = load_env()
    key = env.get("RENDER_API_KEY")
    if not key:
        print("No RENDER_API_KEY in .env")
        return

    services = api(key, "GET", "/services?limit=50")
    if not services:
        print("No se pudieron listar servicios en Render.")
        return

    target_svc = None
    for item in services:
        s = item["service"]
        print("Servicio Render encontrado:", s["name"], s["id"])
        if s["name"] == "aion-2-forge":
            target_svc = s

    if not target_svc:
        print("No se encontró el servicio aion-2-forge.")
        return

    svc_id = target_svc["id"]
    print(f"Actualizando variables en servicio {svc_id}...")

    # Render API PUT /services/{serviceId}/env-vars
    new_vars = [
        {"key": "TURNSTILE_SITE_KEY", "value": env["TURNSTILE_SITE_KEY"]},
        {"key": "TURNSTILE_SECRET_KEY", "value": env["TURNSTILE_SECRET_KEY"]},
    ]
    # En la API v1 de Render, PUT /services/{id}/env-vars reemplaza o añade variables
    # Consultemos las variables actuales primero
    curr = api(key, "GET", f"/services/{svc_id}/env-vars") or []
    var_dict = {}
    for c in curr:
        ev = c.get("envVar") or c
        var_dict[ev["key"]] = ev.get("value", "")

    var_dict["TURNSTILE_SITE_KEY"] = env["TURNSTILE_SITE_KEY"]
    var_dict["TURNSTILE_SECRET_KEY"] = env["TURNSTILE_SECRET_KEY"]

    payload = [{"key": k, "value": v} for k, v in var_dict.items()]
    res = api(key, "PUT", f"/services/{svc_id}/env-vars", payload)
    if res is not None:
        print("Variables actualizadas con éxito en Render:", [x["key"] for x in res if "key" in x or ("envVar" in x and "key" in x["envVar"])])
    else:
        print("No se pudo actualizar vía PUT /env-vars.")


if __name__ == "__main__":
    main()
