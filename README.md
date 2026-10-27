# Aion 2 Forge · AION 2

Comunidad **Aion 2 Forge** de AION 2 Europa (ES/EN). Fan site.

- Espía Builds, tops, timers, mapa y calculadoras.
- Builds de las 8 clases con habilidades, especializaciones y estigmas.
- Barra de habilidades, macro y hasta 3 presets por build.
- Planificador de Daevanion, guías y noticias.
- Zona privada: crea builds y decide si son públicas o privadas.

Web (API): https://aion-2-forge.onrender.com  
Escaparate (GitHub Pages): https://r3v180.github.io/aion-2-forge/  
Repo: https://github.com/R3v180/aion-2-forge  

GitHub Pages sigue publicada. Con `REDIRIGIR_ESCAPARATE_A_RENDER = true` en `js/app.js` redirige a Render; pon `false` para volver al espejo estático.

## Local

```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
copy .env.example .env   # y rellena DATABASE_URL y SECRET_KEY
.venv\Scripts\python scripts\sembrar.py --referencias
.venv\Scripts\python app.py
```

Datos del juego: [questlog.gg](https://questlog.gg/aion-2).
