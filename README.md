# Orden Celeste · AION 2

Web oficial dla legión **Orden Celeste** de AION 2 (ES/EN).

- Builds de las 8 clases con habilidades, especializaciones y estigmas.
- Barra de habilidades, macro y hasta 3 presets por build.
- Planificador de Daevanion con los 5 tableros de cada clase y suma de estadísticas.
- Guías de primeros pasos, progresión, mazmorras, raids, JcJ y economía.
- Zona privada: cada miembro crea sus builds y decide si son públicas o privadas.

Web: https://orden-celeste-aion2.onrender.com · Escaparate: https://r3v180.github.io/orden-celeste-aion2/

## Local

```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env   # y rellena DATABASE_URL y SECRET_KEY
.venv\Scripts\python scripts\sembrar.py --referencias
.venv\Scripts\python app.py
```

Datos del juego: [questlog.gg](https://questlog.gg/aion-2).
