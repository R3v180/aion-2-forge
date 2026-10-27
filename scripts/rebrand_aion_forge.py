# -*- coding: utf-8 -*-
"""Rebrand Orden Celeste -> Aion 2 Forge (HTML, JS, CSS, SEO, schema)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BRAND = "Aion 2 Forge"
EMBLEM = "img/aion-2-forge-emblema.svg"
OG = "img/og-aion-2-forge.jpg"

# Keep Render host for now (API URL); only public brand text changes.
HOST = "https://aion-2-forge.onrender.com"

VERSION_BUMPS = [
    (r"js/i18n\.js\?v=\d+", "js/i18n.js?v=68"),
    (r"js/app\.js\?v=\d+", "js/app.js?v=31"),
    (r"js/hero-carrusel\.js\?v=\d+", "js/hero-carrusel.js?v=6"),
    (r"js/comunidad\.js\?v=\d+", "js/comunidad.js?v=13"),
    (r"js/juego\.js\?v=\d+", "js/juego.js?v=32"),
    (r"js/build\.js\?v=\d+", "js/build.js?v=27"),
    (r"js/noticias\.js\?v=\d+", "js/noticias.js?v=8"),
    (r"css/app\.css\?v=\d+", "css/app.css?v=86"),
    (r"css/marco\.css\?v=\d+", "css/marco.css?v=14"),
]


def sub_file(path: Path, pairs):
    t = path.read_text(encoding="utf-8")
    o = t
    for a, b in pairs:
        if a.startswith("re:"):
            t = re.sub(a[3:], b, t)
        else:
            t = t.replace(a, b)
    if t != o:
        path.write_text(t, encoding="utf-8")
        print("upd", path.relative_to(ROOT))
        return True
    return False


def main():
    # OG asset
    src = ROOT / "img" / "og-orden-celeste.jpg"
    dst = ROOT / "img" / "og-aion-2-forge.jpg"
    if src.exists():
        dst.write_bytes(src.read_bytes())
        print("og ready")

    # --- HTML ---
    html_pairs = [
        ("img/orden-celeste-emblema.svg", EMBLEM),
        ("img/aion-forge-emblema.svg", EMBLEM),
        ("img/og-orden-celeste.jpg", OG),
        ("img/og-aion-forge.jpg", OG),
        ("Orden Celeste · Legión AION 2 Marchutan · Espía Builds EU",
         f"{BRAND} · AION 2 Community · Spy Builds EU"),
        ("Legión Orden Celeste (asmodianos, Marchutan). Web de fans con Espía Builds, tops, mapa, timers y herramientas abiertas a toda Europa.",
         f"{BRAND}: comunidad AION 2 con Espía Builds, tops, mapa, timers y herramientas para Europa. Fan site ES/EN."),
        ("AION 2, Orden Celeste, legión Marchutan, asmodianos, Espía Builds, tops poder, mapa rubí, timers grieta, builds",
         f"AION 2, {BRAND}, Spy Builds, tops, mapa rubí, timers, builds, comunidad, EU"),
        ("Chat legión Orden Celeste · AION 2", f"Chat {BRAND} · AION 2"),
        ("Chat de la comunidad Orden Celeste para jugadores de AION 2 Europa.",
         f"Chat de la comunidad {BRAND} para jugadores de AION 2 Europa."),
        ("AION 2 chat, legión Orden Celeste", f"AION 2 chat, {BRAND}"),
        ("Foro legión Orden Celeste · AION 2", f"Foro {BRAND} · AION 2"),
        ("Foro de la legión Orden Celeste en AION 2: avisos, reclutamiento, builds y grupos.",
         f"Foro {BRAND} de AION 2: avisos, reclutamiento, builds y grupos."),
        ("AION 2 foro, legión Orden Celeste, reclutamiento",
         f"AION 2 foro, {BRAND}, reclutamiento, builds"),
        ("Super · Orden Celeste AION 2", f"Super · {BRAND}"),
        ("Tema · Orden Celeste AION 2", f"Tema · {BRAND}"),
        ("Build AION 2 · Orden Celeste", f"Build AION 2 · {BRAND}"),
        ("Panel · Orden Celeste AION 2", f"Panel · {BRAND}"),
        ("Nueva build · Orden Celeste AION 2", f"Nueva build · {BRAND}"),
        ("Mis builds · Orden Celeste AION 2", f"Mis builds · {BRAND}"),
        ("Referencia de clase AION 2 · Orden Celeste", f"Referencia de clase AION 2 · {BRAND}"),
        ("Guía de referencia de clase AION 2 con builds de la legión Orden Celeste.",
         f"Guía de referencia de clase AION 2 con builds de la comunidad {BRAND}."),
        ("Noticias oficiales AION 2 · Orden Celeste", f"Noticias oficiales AION 2 · {BRAND}"),
        ("Noticias, parches y avisos oficiales de AION 2 recopilados para la comunidad Orden Celeste.",
         f"Noticias, parches y avisos oficiales de AION 2 recopilados para la comunidad {BRAND}."),
        ("Noticia AION 2 · Orden Celeste", f"Noticia AION 2 · {BRAND}"),
        ("Noticia oficial de AION 2 publicada en Orden Celeste.",
         f"Noticia oficial de AION 2 publicada en {BRAND}."),
        ("Sin registro. Legión Orden Celeste.", f"Sin registro. Comunidad {BRAND}."),
        ("Público, sin registro. Legión Orden Celeste.", f"Público, sin registro. Comunidad {BRAND}."),
        ("Fan map Orden Celeste.", f"Fan map {BRAND}."),
        ("Legión Orden Celeste.", f"Comunidad {BRAND}."),
        (" · Orden Celeste", f" · {BRAND}"),
        ("Orden Celeste", BRAND),
        ('aria-label="Orden Celeste"', f'aria-label="{BRAND}"'),
        ("re:js/i18n\\.js\\?v=\\d+", "js/i18n.js?v=68"),
        ("re:js/app\\.js\\?v=\\d+", "js/app.js?v=31"),
        ("re:js/hero-carrusel\\.js\\?v=\\d+", "js/hero-carrusel.js?v=6"),
        ("re:js/comunidad\\.js\\?v=\\d+", "js/comunidad.js?v=13"),
        ("re:js/juego\\.js\\?v=\\d+", "js/juego.js?v=32"),
        ("re:js/build\\.js\\?v=\\d+", "js/build.js?v=27"),
        ("re:js/noticias\\.js\\?v=\\d+", "js/noticias.js?v=8"),
        ("re:css/app\\.css\\?v=\\d+", "css/app.css?v=86"),
        ("re:css/marco\\.css\\?v=\\d+", "css/marco.css?v=14"),
    ]
    for p in sorted(ROOT.glob("*.html")):
        sub_file(p, html_pairs)

    # --- app.js logo ---
    sub_file(ROOT / "js" / "app.js", [
        ("img/orden-celeste-emblema.svg", EMBLEM),
        ("img/aion-forge-emblema.svg", EMBLEM),
        ('<span class="logo-a">Orden <span class="logo-2">Celeste</span></span><small>AION 2 · \' + esc(t("nav.gremio")) + "</small>',
         '<span class="logo-a">Aion 2 <span class="logo-2">Forge</span></span><small>\' + esc(t("nav.comunidad_tag")) + "</small>'),
    ])

    # --- hero ---
    sub_file(ROOT / "js" / "hero-carrusel.js", [
        ("img/orden-celeste-emblema.svg", EMBLEM),
        ('alt="Orden Celeste"', f'alt="{BRAND}"'),
        ("'<div class=\"nombre-gremio\">Orden <span>Celeste</span></div></div></div>' +",
         "'<div class=\"nombre-gremio\">Aion 2 <span>Forge</span></div></div></div>' +"),
        ("s.id === \"legion\"", "s.id === \"forge\""),
        ('id: "legion"', 'id: "forge"'),
    ])

    # --- comunidad / build / juego ---
    sub_file(ROOT / "js" / "comunidad.js", [
        ('">Orden Celeste ✓</span>', f'">Legión ✓</span>'),
        ('" · Orden Celeste AION 2"', f'" · {BRAND}"'),
        ("orden-celeste-aion2\\.onrender\\.com|espclown-aion2\\.onrender\\.com|orden-celeste|r3v180\\.github\\.io",
         "orden-celeste-aion2\\.onrender\\.com|espclown-aion2\\.onrender\\.com|aion-2-forge|orden-celeste|r3v180\\.github\\.io"),
    ])
    # Fix regex if replace failed on escaped string - do raw file edit carefully
    cjs = (ROOT / "js" / "comunidad.js").read_text(encoding="utf-8")
    cjs2 = cjs.replace("Orden Celeste ✓", "Legión ✓").replace("Orden Celeste AION 2", BRAND)
    cjs2 = cjs2.replace("|orden-celeste|", "|aion-2-forge|orden-celeste|")
    if cjs2 != cjs:
        (ROOT / "js" / "comunidad.js").write_text(cjs2, encoding="utf-8")
        print("upd js/comunidad.js (extra)")

    sub_file(ROOT / "js" / "build.js", [
        (" · Orden Celeste", f" · {BRAND}"),
        (", \"Orden Celeste\"", f", \"{BRAND}\""),
        ("Orden Celeste", BRAND),
    ])
    sub_file(ROOT / "js" / "juego.js", [
        ('fuente: "NCSOFT vía Orden Celeste"', f'fuente: "NCSOFT vía {BRAND}"'),
        ("Orden Celeste", BRAND),
    ])
    sub_file(ROOT / "css" / "app.css", [
        ("img/orden-celeste-emblema.svg", EMBLEM),
        ("img/aion-forge-emblema.svg", EMBLEM),
    ])

    # --- seo.py ---
    sub_file(ROOT / "seo.py", [
        ("og-orden-celeste.jpg", "og-aion-2-forge.jpg"),
        ("og-aion-forge.jpg", "og-aion-2-forge.jpg"),
        ("Orden Celeste legion fan site.", f"{BRAND} community fan site."),
        (" · Orden Celeste", f" · {BRAND}"),
        ("Web de la legión Orden Celeste.", f"Web de la comunidad {BRAND}."),
        (", Orden Celeste", f", {BRAND}"),
        ("on Orden Celeste.", f"on {BRAND}."),
        ("en Orden Celeste.", f"en {BRAND}."),
        ('"name": "Orden Celeste AION 2"', f'"name": "{BRAND}"'),
        ('"name": "Orden Celeste"', f'"name": "{BRAND}"'),
        ("Orden Celeste", BRAND),
    ])

    # Other py/js that mention brand in user-facing strings
    for rel in [
        "js/noticias.js", "js/timers.js", "js/herramientas.js",
        "data/herramientas-datos.js", "tops_builds.py", "README.md",
    ]:
        p = ROOT / rel
        if not p.exists():
            continue
        t = p.read_text(encoding="utf-8")
        o = t
        t = t.replace("img/orden-celeste-emblema.svg", EMBLEM)
        t = t.replace("img/og-orden-celeste.jpg", OG)
        t = t.replace("Orden Celeste", BRAND)
        if t != o:
            p.write_text(t, encoding="utf-8")
            print("upd", rel)

    # schema: community forum descriptions + force update if still legion-branded
    schema = ROOT / "schema.sql"
    st = schema.read_text(encoding="utf-8")
    st2 = st.replace(
        "WHEN 'avisos' THEN 'Lo que tiene que saber toda la legión.'",
        "WHEN 'avisos' THEN 'Avisos de la comunidad Aion 2 Forge.'",
    ).replace(
        "WHEN 'avisos' THEN 'What the whole legion needs to know.'",
        "WHEN 'avisos' THEN 'Aion 2 Forge community announcements.'",
    ).replace(
        "WHEN 'reclutamiento' THEN '¿Quieres entrar en Orden Celeste? Empieza aquí.'",
        "WHEN 'reclutamiento' THEN 'Buscas o ofreces legión. Publica requisitos aquí.'",
    ).replace(
        "WHEN 'reclutamiento' THEN 'Want to join Orden Celeste? Start here.'",
        "WHEN 'reclutamiento' THEN 'Looking for or recruiting a legion. Post requirements here.'",
    )
    # Append idempotent fix for live DBs that already have nombre_es filled
    marker = "-- aion2forge-rebrand-cats"
    if marker not in st2:
        st2 += f"""
{marker}
UPDATE categorias_foro SET desc_es = 'Avisos de la comunidad Aion 2 Forge.', desc_en = 'Aion 2 Forge community announcements.'
WHERE id = 'avisos' AND (desc_es ILIKE '%legión%' OR desc_es ILIKE '%Orden Celeste%' OR desc_es ILIKE '%Aion Forge%');
UPDATE categorias_foro SET desc_es = 'Buscas o ofreces legión. Publica requisitos aquí.', desc_en = 'Looking for or recruiting a legion. Post requirements here.'
WHERE id = 'reclutamiento' AND (desc_es ILIKE '%Orden Celeste%' OR desc_es ILIKE '%Aion Forge%');
"""
    if st2 != st:
        schema.write_text(st2, encoding="utf-8")
        print("upd schema.sql")

    # i18n heavy patch
    patch_i18n(ROOT / "js" / "i18n.js")
    print("done")


def patch_i18n(path: Path):
    t = path.read_text(encoding="utf-8")
    pairs = [
        ('"nav.hint.builds": { es: "Builds de la legión", en: "Legion community builds" }',
         '"nav.hint.builds": { es: "Builds de la comunidad", en: "Community builds" }'),
        ('"nav.hint.foro": { es: "Temas de la legión", en: "Legion threads" }',
         '"nav.hint.foro": { es: "Temas de la comunidad", en: "Community threads" }'),
        ('es: "Calculadoras AION 2: mejora con pity, craft, manastones, pity de mazmorra, Amplify, Pantheon y Arcana. Legión Orden Celeste.",\n    en: "AION 2 calculators: enhancement with pity, craft, manastones, dungeon pity, Amplify, Pantheon and Arcana. Orden Celeste legion."',
         f'es: "Calculadoras AION 2: mejora con pity, craft, manastones, pity de mazmorra, Amplify, Pantheon y Arcana. {BRAND}.",\n    en: "AION 2 calculators: enhancement with pity, craft, manastones, dungeon pity, Amplify, Pantheon and Arcana. {BRAND}."'),
        ('"guias.antetitulo": { es: "Legión Orden Celeste", en: "Orden Celeste legion" }',
         f'"guias.antetitulo": {{ es: "{BRAND}", en: "{BRAND}" }}'),
        ('"nav.gremio": { es: "Legión", en: "Legion" }',
         '"nav.gremio": { es: "Legión", en: "Legion" },\n  "nav.comunidad_tag": { es: "Comunidad EU", en: "EU Community" }'),
        ('"build.abrir_principal": { es: "Copiar o editar en la web de la legión", en: "Copy or edit on the legion site" }',
         f'"build.abrir_principal": {{ es: "Copiar o editar en {BRAND}", en: "Copy or edit on {BRAND}" }}'),
        ('"inicio.antetitulo": { es: "Legión · AION 2", en: "Legion · AION 2" }',
         '"inicio.antetitulo": { es: "Comunidad · AION 2", en: "Community · AION 2" }'),
        ('"inicio.titulo": { es: "Casa de la legión Orden Celeste", en: "Home of the Orden Celeste legion" }',
         f'"inicio.titulo": {{ es: "Comunidad {BRAND}", en: "{BRAND} community" }}'),
        ('es: "Asmodianos en Marchutan. Jugamos AION 2 en Europa y mantenemos esta web abierta para toda la comunidad: Espía Builds, tops, mapa, timers y herramientas.",\n    en: "Asmodians on Marchutan. We play AION 2 in Europe and keep this site open for the whole community: Spy Builds, tops, map, timers and tools."',
         'es: "Web de fans de AION 2 en Europa: Espía Builds, tops, mapa, timers, guías y herramientas. Abierta a toda la comunidad, ES y EN.",\n    en: "AION 2 fan site for Europe: Spy Builds, tops, map, timers, guides and tools. Open to the whole community, ES and EN."'),
        ('es: "Herramientas abiertas a toda Europa · hechas y mantenidas por la legión Orden Celeste (Marchutan).",\n    en: "Tools open to all of Europe · built and maintained by the Orden Celeste legion (Marchutan)."',
         f'es: "Herramientas abiertas a toda Europa · comunidad {BRAND}.",\n    en: "Tools open to all of Europe · {BRAND} community."'),
        ('"inicio.slide.legion_chip": { es: "Legión · Marchutan", en: "Legion · Marchutan" }',
         f'"inicio.slide.legion_chip": {{ es: "{BRAND}", en: "{BRAND}" }}'),
        ('"inicio.slide.tops_titulo": { es: "Tops de lo que la legión espía", en: "Tops from what the legion spies" }',
         '"inicio.slide.tops_titulo": { es: "Tops de lo que la comunidad espía", en: "Tops from what the community spies" }'),
        ('"inicio.explora_titulo": { es: "Herramientas de la legión, para todos", en: "Legion tools, for everyone" }',
         '"inicio.explora_titulo": { es: "Herramientas de la comunidad", en: "Community tools" }'),
        ('es: "Espía, tops, progresión y utilidades. Úsalas aunque no seas de Marchutan: el proyecto es de Orden Celeste y está abierto a EU.",\n    en: "Spy, tops, progression and utilities. Use them even if you\'re not on Marchutan: Orden Celeste runs the project and it\'s open to EU."',
         f'es: "Espía, tops, progresión y utilidades para jugadores de AION 2 en EU. Proyecto de fans {BRAND}.",\n    en: "Spy, tops, progression and utilities for AION 2 players in EU. {BRAND} fan project."'),
        ('"inicio.card.comunidad_txt": { es: "Foro y chat de la legión", en: "Legion forum and chat" }',
         '"inicio.card.comunidad_txt": { es: "Foro y chat de la comunidad", en: "Community forum and chat" }'),
        ('es: "Builds publicadas por jugadores (con modo JcE/JcJ) y referencias del gremio.",',
         'es: "Builds publicadas por jugadores (con modo JcE/JcJ) y referencias de la comunidad.",'),
        ('"foro.titulo": { es: "Foro de la legión", en: "Legion forum" }',
         '"foro.titulo": { es: "Foro de la comunidad", en: "Community forum" }'),
        ('"foro.denuncia_motivo": { es: "¿Por qué avisas? Se lo verá el equipo de la legión.", en: "Why are you reporting this? The legion team will see it." }',
         '"foro.denuncia_motivo": { es: "¿Por qué avisas? Lo verá el equipo de moderación.", en: "Why are you reporting this? The moderation team will see it." }'),
        ('"chat.titulo": { es: "Chat de la legión", en: "Legion chat" }',
         '"chat.titulo": { es: "Chat de la comunidad", en: "Community chat" }'),
        ('"chat.placeholder": { es: "Escribe a la legión…", en: "Message the legion…" }',
         '"chat.placeholder": { es: "Escribe a la comunidad…", en: "Message the community…" }'),
        ('"panel.atajo_chat": { es: "Hablar con la legión", en: "Talk with the legion" }',
         '"panel.atajo_chat": { es: "Ir al chat", en: "Go to chat" }'),
        ('"foro.antetitulo": { es: "Comunidad Orden Celeste", en: "Orden Celeste community" }',
         f'"foro.antetitulo": {{ es: "Comunidad {BRAND}", en: "{BRAND} community" }}'),
        ('"foro.desc_avisos": { es: "Lo que tiene que saber toda la legión.", en: "What the whole legion needs to know." }',
         f'"foro.desc_avisos": {{ es: "Avisos de la comunidad {BRAND}.", en: "{BRAND} community announcements." }}'),
        ('"foro.desc_reclutamiento": { es: "¿Quieres entrar en Orden Celeste? Empieza aquí.", en: "Want to join Orden Celeste? Start here." }',
         '"foro.desc_reclutamiento": { es: "Buscas o ofreces legión. Publica requisitos aquí.", en: "Looking for or recruiting a legion. Post requirements here." }'),
        ('"foro.gremio_tit": { es: "Tiene un personaje vinculado de la legión Orden Celeste", en: "Has a linked character in the Orden Celeste legion" }',
         '"foro.gremio_tit": { es: "Tiene un personaje vinculado de la legión Orden Celeste (en juego)", en: "Has a linked character in the Orden Celeste in-game legion" }'),
        ('"chat.sala_gremio": { es: "Solo legión", en: "Legion only" }',
         '"chat.sala_gremio": { es: "Sala privada", en: "Private room" }'),
        ('"chat.desc_general": { es: "Charla de toda la legión.", en: "Chat for the whole legion." }',
         '"chat.desc_general": { es: "Charla de toda la comunidad.", en: "Chat for the whole community." }'),
        ('"chat.desc_gremio": { es: "Solo miembros verificados de Orden Celeste.", en: "Verified Orden Celeste members only." }',
         '"chat.desc_gremio": { es: "Sala privada: miembros verificados de la legión Orden Celeste (en juego).", en: "Private room: verified Orden Celeste in-game legion members." }'),
        ('"chat.gremio_tit": { es: "Solo para la legión", en: "Legion only" }',
         '"chat.gremio_tit": { es: "Sala privada", en: "Private room" }'),
        ('es: "Esta sala es solo para la legión. Vincula en Mis builds un personaje de Orden Celeste. Si te echan, al revalidar el gremio (cada pocas horas) se cierra sola.",\n    en: "This room is legion only. Link an Orden Celeste character in My builds. If you\'re kicked, access closes when the guild is rechecked (every few hours)."',
         'es: "Sala privada para la legión Orden Celeste (en juego). Vincula en Mis builds un personaje de esa legión. Si te echan, al revalidar (cada pocas horas) se cierra sola.",\n    en: "Private room for the Orden Celeste in-game legion. Link that legion character in My builds. If you\'re kicked, access closes on recheck (every few hours)."'),
        ('"err.texto_filtrado": { es: "Ese mensaje no se puede enviar (filtro de la legión).", en: "That message can\'t be sent (legion filter)." }',
         '"err.texto_filtrado": { es: "Ese mensaje no se puede enviar (filtro de la comunidad).", en: "That message can\'t be sent (community filter)." }'),
        ('es: "Orden Celeste · asmodianos Marchutan · Web de fans (EU), sin relación con NCSOFT. AION 2 y sus imágenes son de NCSOFT.",\n    en: "Orden Celeste · Asmodians on Marchutan · Fan site (EU), not affiliated with NCSOFT. AION 2 and its images belong to NCSOFT."',
         f'es: "{BRAND} · web de fans AION 2 (EU), sin relación con NCSOFT. AION 2 y sus imágenes son de NCSOFT.",\n    en: "{BRAND} · AION 2 fan site (EU), not affiliated with NCSOFT. AION 2 and its images belong to NCSOFT."'),
        ('es: "Esta web (Orden Celeste · AION 2) es un proyecto de fans de la legión Orden Celeste. No es un servicio oficial de NCSOFT ni de sus socios.",\n    en: "This site (Orden Celeste · AION 2) is a fan project of the Orden Celeste legion. It is not an official NCSOFT service or partner."',
         f'es: "Esta web ({BRAND}) es un proyecto de fans de AION 2. No es un servicio oficial de NCSOFT ni de sus socios.",\n    en: "This site ({BRAND}) is an AION 2 fan project. It is not an official NCSOFT service or partner."'),
        ('es: "El contenido publicado por usuarios (builds, foro, chat) es responsabilidad de quien lo publica. La legión puede moderar, ocultar o eliminar material abusivo, ilegal o que incumpla estas normas.",\n    en: "User-published content (builds, forum, chat) is the responsibility of the poster. The legion may moderate, hide or remove abusive, illegal or non-compliant material."',
         'es: "El contenido publicado por usuarios (builds, foro, chat) es responsabilidad de quien lo publica. El equipo de la web puede moderar, ocultar o eliminar material abusivo, ilegal o que incumpla estas normas.",\n    en: "User-published content (builds, forum, chat) is the responsibility of the poster. The site team may moderate, hide or remove abusive, illegal or non-compliant material."'),
        ('es: "Responsable del tratamiento: la comunidad de fans Orden Celeste, que opera esta web de forma no comercial. Contacto: Discord de la legión (enlace en el pie).",\n    en: "Data controller: the Orden Celeste fan community operating this non-commercial site. Contact: the legion Discord (footer link)."',
         f'es: "Responsable del tratamiento: la comunidad de fans {BRAND}, que opera esta web de forma no comercial. Contacto: Discord (enlace en el pie).",\n    en: "Data controller: the {BRAND} fan community operating this non-commercial site. Contact: Discord (footer link)."'),
        ('es: "Tus derechos (RGPD): acceso, rectificación, supresión, limitación y oposición. Puedes cambiar la contraseña y borrar la cuenta en Mis builds → Cuenta y seguridad. También puedes pedir ayuda por Discord de la legión.",\n    en: "Your rights (GDPR): access, rectification, erasure, restriction and objection. You can change your password and delete the account under My builds → Account & security. You may also ask via the legion Discord."',
         'es: "Tus derechos (RGPD): acceso, rectificación, supresión, limitación y oposición. Puedes cambiar la contraseña y borrar la cuenta en Mis builds → Cuenta y seguridad. También puedes pedir ayuda por Discord (pie).",\n    en: "Your rights (GDPR): access, rectification, erasure, restriction and objection. You can change your password and delete the account under My builds → Account & security. You may also ask via Discord (footer)."'),
        ('og-orden-celeste.jpg', 'og-aion-2-forge.jpg'),
        ('og-aion-forge.jpg', 'og-aion-2-forge.jpg'),
        # leftover brand strings
        ("Orden Celeste", BRAND),
        ("vía Aion 2 Forge", f"vía {BRAND}"),  # noop if already
    ]
    o = t
    for a, b in pairs:
        t = t.replace(a, b)
    # Avoid double "Aion 2 Forge" from replacing inside already-branded text wrongly
    # Fix nav.comunidad_tag duplicate if script re-run
    t = re.sub(
        r'("nav\.gremio": \{ es: "Legión", en: "Legion" \},?\s*)+("nav\.comunidad_tag": \{ es: "Comunidad EU", en: "EU Community" \},?\s*)+',
        '"nav.gremio": { es: "Legión", en: "Legion" },\n  "nav.comunidad_tag": { es: "Comunidad EU", en: "EU Community" },\n  ',
        t,
        count=1,
    )
    if t != o:
        path.write_text(t, encoding="utf-8")
        print("upd js/i18n.js")
    else:
        print("i18n unchanged?")


if __name__ == "__main__":
    main()
