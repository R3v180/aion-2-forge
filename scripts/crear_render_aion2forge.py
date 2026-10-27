# -*- coding: utf-8 -*-
"""Crea el servicio Render aion-2-forge sin tocar orden-celeste-aion2."""
from pathlib import Path
import json
import secrets
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OLD_ID = "srv-dbfv1r59fdbs73c92dug"
OWNER = "tea-db751fs9v7es73agemsg"
NAME = "aion-2-forge"


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
        raise SystemExit(f"HTTP {e.code}: {e.read().decode()[:2000]}")


def main():
    env = load_env()
    key = env["RENDER_API_KEY"]

    # Already exists?
    services = api(key, "GET", "/services?limit=50")
    for item in services:
        s = item["service"]
        if s["name"] == NAME:
            print("EXISTS", s["id"], (s.get("serviceDetails") or {}).get("url"))
            (ROOT / "scripts/_new_render_service.json").write_text(json.dumps(s, indent=2), encoding="utf-8")
            return

    ev = {
        (i.get("envVar") or i)["key"]: (i.get("envVar") or i).get("value", "")
        for i in api(key, "GET", f"/services/{OLD_ID}/env-vars")
    }

    start = "gunicorn app:app --workers 1 --threads 8 --bind 0.0.0.0:$PORT"
    body = {
        "type": "web_service",
        "name": NAME,
        "ownerId": OWNER,
        "repo": "https://github.com/R3v180/aion-2-forge",
        "autoDeploy": "yes",
        "branch": "main",
        "serviceDetails": {
            "runtime": "python",
            "plan": "free",
            "region": "frankfurt",
            "healthCheckPath": "/api/estadisticas",
            "envSpecificDetails": {
                "buildCommand": "pip install -r requirements.txt",
                "startCommand": start,
            },
        },
        "envVars": [
            {"key": "PYTHON_VERSION", "value": ev.get("PYTHON_VERSION") or "3.13.1"},
            {"key": "DATABASE_URL", "value": ev["DATABASE_URL"]},
            {"key": "SECRET_KEY", "value": secrets.token_hex(32)},
            {"key": "ENTORNO", "value": "produccion"},
            {"key": "TURNSTILE_SITE_KEY", "value": ev.get("TURNSTILE_SITE_KEY") or env.get("TURNSTILE_SITE_KEY", "")},
            {"key": "TURNSTILE_SECRET_KEY", "value": ev.get("TURNSTILE_SECRET_KEY") or env.get("TURNSTILE_SECRET_KEY", "")},
        ],
    }

    out = api(key, "POST", "/services", body)
    svc = out.get("service") or out
    print("CREATED", svc.get("id"))
    print("URL", (svc.get("serviceDetails") or {}).get("url"))
    print("DASH", svc.get("dashboardUrl"))
    (ROOT / "scripts/_new_render_service.json").write_text(json.dumps(out, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
