# -*- coding: utf-8 -*-
"""Mejora entradas del mapa donde fr ≈ en, traduciendo desde es con glosario ES→FR."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ES_PHRASES = [
    ("Preguntas frecuentes", "Foire aux questions"),
    ("Espía Builds", "Espion Builds"),
    ("Espía", "Espion"),
    ("Mis builds", "Mes builds"),
    ("Iniciar sesión", "Se connecter"),
    ("Cerrar sesión", "Se déconnecter"),
    ("Crear cuenta", "Créer un compte"),
    ("Contraseña", "Mot de passe"),
    ("Usuario", "Nom d’utilisateur"),
    ("Comunidad", "Communauté"),
    ("Herramientas", "Outils"),
    ("Guías", "Guides"),
    ("Clases", "Classes"),
    ("Servidor", "Serveur"),
    ("Personaje", "Personnage"),
    ("Habilidades", "Compétences"),
    ("Equipamiento", "Équipement"),
    ("Equipo", "Équipement"),
    ("Poder", "Puissance"),
    ("Nivel", "Niveau"),
    ("Buscar", "Rechercher"),
    ("Guardar", "Enregistrer"),
    ("Cancelar", "Annuler"),
    ("Eliminar", "Supprimer"),
    ("Borrar", "Supprimer"),
    ("Editar", "Modifier"),
    ("Crear", "Créer"),
    ("Publicar", "Publier"),
    ("Privado", "Privé"),
    ("Público", "Public"),
    ("Cargando…", "Chargement…"),
    ("Cargando", "Chargement"),
    ("Error", "Erreur"),
    ("Aviso legal", "Mentions légales"),
    ("Política de privacidad", "Politique de confidentialité"),
    ("Cookies", "Cookies"),
    ("Idioma", "Langue"),
    ("Región", "Région"),
    ("Europa", "Europe"),
    ("Inicio", "Accueil"),
    ("Juego", "Jeu"),
    ("Mapa", "Carte"),
    ("Foro", "Forum"),
    ("Tema", "Sujet"),
    ("Temas", "Sujets"),
    ("Mensaje", "Message"),
    ("Mensajes", "Messages"),
    ("Moderador", "Modérateur"),
    ("Miembro", "Membre"),
    ("Cuenta", "Compte"),
    ("Seguridad", "Sécurité"),
    ("Noticias", "Actualités"),
    ("Parche", "Patch"),
    ("Sin cuenta", "Sans compte"),
    ("gratis", "gratuit"),
    ("Gratis", "Gratuit"),
    ("cualquier", "n’importe quel"),
    ("Cualquier", "N’importe quel"),
    ("todas", "toutes"),
    ("Todas", "Toutes"),
    ("todos", "tous"),
    ("Todos", "Tous"),
    ("ningún", "aucun"),
    ("Ningún", "Aucun"),
    ("ninguna", "aucune"),
    ("Ninguna", "Aucune"),
    ("también", "aussi"),
    ("para", "pour"),
    ("con", "avec"),
    ("sin", "sans"),
    ("desde", "depuis"),
    ("hasta", "jusqu’à"),
    ("sobre", "sur"),
    ("según", "selon"),
    ("después", "après"),
    ("antes", "avant"),
    ("ahora", "maintenant"),
    ("aquí", "ici"),
    ("esta", "cette"),
    ("este", "ce"),
    ("estos", "ces"),
    ("estas", "ces"),
    ("tu", "votre"),
    ("tus", "vos"),
    ("su", "son"),
    ("sus", "ses"),
    ("del", "du"),
    ("al", "au"),
    ("de la", "de la"),
    ("de los", "des"),
    ("de las", "des"),
    ("y ", "et "),
    (" o ", " ou "),
    (" no ", " ne "),
    ("más", "plus"),
    ("menos", "moins"),
    ("muy", "très"),
    ("ya", "déjà"),
    ("aún", "encore"),
    ("solo", "seulement"),
    ("sólo", "seulement"),
    ("cada", "chaque"),
    ("otro", "autre"),
    ("otra", "autre"),
    ("otros", "autres"),
    ("otras", "autres"),
    ("nuevo", "nouveau"),
    ("nueva", "nouvelle"),
    ("abrir", "ouvrir"),
    ("Abrir", "Ouvrir"),
    ("cerrar", "fermer"),
    ("Cerrar", "Fermer"),
    ("ver", "voir"),
    ("Ver", "Voir"),
    ("elige", "choisissez"),
    ("Elige", "Choisissez"),
    ("escribe", "saisissez"),
    ("Escribe", "Saisissez"),
    ("pulsa", "cliquez"),
    ("Pulsa", "Cliquez"),
    ("pincha", "cliquez"),
    ("debe", "doit"),
    ("pueden", "peuvent"),
    ("puede", "peut"),
    ("tiene", "a"),
    ("tienen", "ont"),
    ("hay", "il y a"),
    ("Hay", "Il y a"),
    ("está", "est"),
    ("están", "sont"),
    ("ser", "être"),
    ("hacer", "faire"),
    ("usar", "utiliser"),
    ("cambiar", "changer"),
    ("Cambiar", "Changer"),
]
ES_PHRASES.sort(key=lambda x: len(x[0]), reverse=True)


def from_es(es: str) -> str:
    if not es:
        return es
    s = es
    # protect tokens
    held = []

    def hold(m):
        held.append(m.group(0))
        return f"⟦{len(held)-1}⟧"

    s = re.sub(r"\{[a-zA-Z0-9_]+\}", hold, s)
    s = re.sub(r"Aion 2 Forge|AION 2|NCSOFT|Daevanion|iLvl|Espía Builds|Espion Builds", hold, s)
    for a, b in ES_PHRASES:
        s = s.replace(a, b)
    for i, v in enumerate(held):
        s = s.replace(f"⟦{i}⟧", v)
    s = s.replace("Espía Builds", "Espion Builds").replace("Espía", "Espion")
    return s


def mostly_english(fr: str, en: str) -> bool:
    if not fr or not en:
        return True
    if fr.strip() == en.strip():
        return True
    # si comparte muchas palabras inglesas largas
    ew = set(re.findall(r"[A-Za-z]{4,}", en.lower()))
    fw = set(re.findall(r"[A-Za-z]{4,}", fr.lower()))
    if not ew:
        return False
    return len(ew & fw) / len(ew) > 0.72


def main():
    path = ROOT / "data" / "i18n-fr-map.json"
    mp = json.loads(path.read_text(encoding="utf-8"))
    rows = json.loads((ROOT / "data" / "i18n-extract.json").read_text(encoding="utf-8"))
    rows += json.loads((ROOT / "data" / "i18n-equipo-extract.json").read_text(encoding="utf-8"))
    by_key = {r["key"]: r for r in rows}
    fixed = 0
    for k, fr in list(mp.items()):
        r = by_key.get(k)
        if not r:
            continue
        en, es = r.get("en") or "", r.get("es") or ""
        if mostly_english(fr, en) and es:
            mp[k] = from_es(es)
            fixed += 1
    path.write_text(json.dumps(mp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("improved", fixed, "of", len(mp))


if __name__ == "__main__":
    main()
