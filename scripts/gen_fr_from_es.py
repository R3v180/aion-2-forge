# -*- coding: utf-8 -*-
"""
Genera data/i18n-fr-map.json mezclando:
- fr-part-*.json (traducciones revisadas)
- para el resto: traducción EN→FR local por glosario + frases (sin API)
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Frases largas / términos (orden: más largas primero)
PHRASES = [
    ("Spy Builds", "Espion Builds"),
    ("Frequently asked questions", "Foire aux questions"),
    ("Sign in", "Connexion"),
    ("Sign out", "Déconnexion"),
    ("Sign up", "Créer un compte"),
    ("Loading…", "Chargement…"),
    ("Loading...", "Chargement…"),
    ("Could not load", "Impossible de charger"),
    ("No account needed", "Aucun compte requis"),
    ("Community", "Communauté"),
    ("Character name", "Nom du personnage"),
    ("All classes", "Toutes les classes"),
    ("Any level", "N’importe quel niveau"),
    ("Any faction", "N’importe quelle faction"),
    ("Any server", "N’importe quel serveur"),
    ("Choose a server", "Choisissez un serveur"),
    ("Sort by", "Trier par"),
    ("Show top", "Voir le top"),
    ("Previous", "Précédent"),
    ("Next", "Suivant"),
    ("View build", "Voir la build"),
    ("Item level", "Niveau d’objet"),
    ("Active title", "Titre actif"),
    ("Full profile", "Profil complet"),
    ("My builds", "Mes builds"),
    ("Language", "Langue"),
    ("Live chat", "Chat en direct"),
    ("Legal notice", "Mentions légales"),
    ("Privacy policy", "Politique de confidentialité"),
    ("Delete account", "Supprimer le compte"),
    ("Save", "Enregistrer"),
    ("Cancel", "Annuler"),
    ("Delete", "Supprimer"),
    ("Edit", "Modifier"),
    ("View", "Voir"),
    ("Search", "Rechercher"),
    ("Filter", "Filtrer"),
    ("Server", "Serveur"),
    ("Faction", "Faction"),
    ("Class", "Classe"),
    ("Gender", "Genre"),
    ("Male", "Homme"),
    ("Female", "Femme"),
    ("Power", "Puissance"),
    ("Region", "Région"),
    ("Guides", "Guides"),
    ("Forum", "Forum"),
    ("Panel", "Panel"),
    ("Skills", "Compétences"),
    ("Hotbar", "Barre de raccourcis"),
    ("Macro", "Macro"),
    ("Preset", "Preset"),
    ("Template", "Modèle"),
    ("Sources:", "Sources :"),
    ("Sources", "Sources"),
    ("Account", "Compte"),
    ("Password", "Mot de passe"),
    ("Username", "Nom d’utilisateur"),
    ("Public", "Public"),
    ("Private", "Privé"),
    ("Admin", "Admin"),
    ("Moderator", "Modérateur"),
    ("Member", "Membre"),
    ("Superadmin", "Superadmin"),
    ("Elyos", "Élyséens"),
    ("Asmodian", "Asmodiens"),
    ("Asmodians", "Asmodiens"),
    ("Europe (EU)", "Europe (EU)"),
    ("North America West (NAW)", "Amérique du Nord Ouest (NAW)"),
    ("North America East (NAE)", "Amérique du Nord Est (NAE)"),
    ("Latin America (LA)", "Amérique latine (LA)"),
    ("Asia (AS)", "Asie (AS)"),
    ("Whole region", "Toute la région"),
    ("One server", "Un serveur"),
    ("Min. power", "Puissance min."),
    ("Sort by power (tops)", "Trier par puissance (tops)"),
    ("Spy build", "Espionner la build"),
    ("Spy", "Espion"),
    ("Home", "Accueil"),
    ("Game", "Jeu"),
    ("Map", "Carte"),
    ("Tools", "Outils"),
    ("Help", "Aide"),
    ("Close", "Fermer"),
    ("Open", "Ouvrir"),
    ("Back", "Retour"),
    ("Continue", "Continuer"),
    ("Confirm", "Confirmer"),
    ("Error", "Erreur"),
    ("Success", "Succès"),
    ("Warning", "Avertissement"),
    ("Required", "Obligatoire"),
    ("Optional", "Facultatif"),
    ("None", "Aucun"),
    ("All", "Tous"),
    ("Yes", "Oui"),
    ("No", "Non"),
    ("OK", "OK"),
    ("FAQ", "FAQ"),
    ("Tops", "Tops"),
    ("Builds", "Builds"),
    ("Timers", "Timers"),
    ("Chat", "Chat"),
    ("Legion", "Légion"),
    ("Title", "Titre"),
    ("Titles", "Titres"),
    ("Ranking", "Classement"),
    ("Attributes", "Attributs"),
    ("Gear", "Équipement"),
    ("Enhance", "Améliorer"),
    ("Empty", "Vide"),
    ("Remove", "Retirer"),
    ("Change", "Changer"),
    ("Choose", "Choisir"),
    ("Name", "Nom"),
    ("Level", "Niveau"),
    ("Grade", "Grade"),
    ("Stats", "Stats"),
    ("Stat", "Stat"),
    ("Weapon", "Arme"),
    ("Helm", "Heaume"),
    ("Chest", "Torse"),
    ("Legs", "Jambes"),
    ("Gloves", "Gants"),
    ("Boots", "Bottes"),
    ("Cloak", "Cape"),
    ("Belt", "Ceinture"),
    ("Necklace", "Collier"),
    ("Amulet", "Amulette"),
    ("Earring", "Boucle d’oreille"),
    ("Ring", "Anneau"),
    ("Bracelet", "Bracelet"),
    ("Rune", "Rune"),
    ("Common", "Common"),
    ("Rare", "Rare"),
    ("Legendary", "Legendary"),
    ("Unique", "Unique"),
    ("Epic", "Epic"),
    ("Mythic", "Mythic"),
    ("Special", "Special"),
    ("Tradable", "Échangeable"),
    ("Untradable", "Non échangeable"),
    ("Binds on equip", "Lié à l’équipement"),
    ("Binds on pickup", "Lié à l’obtention"),
    ("Both factions", "Les deux factions"),
    ("All grades", "Tous les grades"),
    ("No item matches.", "Aucun objet ne correspond."),
    ("Loading items…", "Chargement des objets…"),
    ("Soul bind", "Lien d’âme"),
    ("Manastones", "Manastones"),
    ("Theostones", "Theostones"),
    ("Item level", "Niveau d’objet"),
    ("Required level", "Niveau requis"),
    ("Add Daevanion", "Ajouter Daevanion"),
    ("Gear only", "Équipement seul"),
    ("Sun", "Dim"),
    ("Mon", "Lun"),
    ("Tue", "Mar"),
    ("Wed", "Mer"),
    ("Thu", "Jeu"),
    ("Fri", "Ven"),
    ("Sat", "Sam"),
]

# Ordenar por longitud desc
PHRASES.sort(key=lambda x: len(x[0]), reverse=True)

WORD = {
    "the": "le",
    "and": "et",
    "or": "ou",
    "with": "avec",
    "without": "sans",
    "from": "de",
    "to": "à",
    "for": "pour",
    "of": "de",
    "in": "dans",
    "on": "sur",
    "your": "votre",
    "you": "vous",
    "this": "ce",
    "that": "cela",
    "not": "pas",
    "no": "aucun",
    "yes": "oui",
    "new": "nouveau",
    "old": "ancien",
    "more": "plus",
    "less": "moins",
    "page": "page",
    "pages": "pages",
    "result": "résultat",
    "results": "résultats",
    "error": "erreur",
    "load": "charger",
    "save": "enregistrer",
    "saved": "enregistré",
    "delete": "supprimer",
    "edit": "modifier",
    "create": "créer",
    "update": "mettre à jour",
    "search": "rechercher",
    "filter": "filtre",
    "sort": "trier",
    "show": "afficher",
    "hide": "masquer",
    "open": "ouvrir",
    "close": "fermer",
    "back": "retour",
    "next": "suivant",
    "previous": "précédent",
    "login": "connexion",
    "logout": "déconnexion",
    "account": "compte",
    "password": "mot de passe",
    "email": "e-mail",
    "user": "utilisateur",
    "users": "utilisateurs",
    "player": "joueur",
    "players": "joueurs",
    "character": "personnage",
    "characters": "personnages",
    "build": "build",
    "builds": "builds",
    "skill": "compétence",
    "skills": "compétences",
    "guide": "guide",
    "guides": "guides",
    "map": "carte",
    "server": "serveur",
    "servers": "serveurs",
    "region": "région",
    "regions": "régions",
    "class": "classe",
    "classes": "classes",
    "power": "puissance",
    "level": "niveau",
    "levels": "niveaux",
    "public": "public",
    "private": "privé",
    "free": "gratuit",
    "global": "global",
    "community": "communauté",
    "ranking": "classement",
    "profile": "profil",
    "gear": "équipement",
    "item": "objet",
    "items": "objets",
    "stone": "pierre",
    "stones": "pierres",
    "cost": "coût",
    "try": "tentative",
    "tries": "tentatives",
    "average": "moyenne",
    "total": "total",
    "min": "min.",
    "max": "max.",
    "day": "jour",
    "days": "jours",
    "week": "semaine",
    "hourly": "horaire",
    "daily": "quotidien",
    "weekly": "hebdomadaire",
}


def protect_tokens(s: str) -> tuple[str, list[str]]:
    held = []

    def hold(m):
        held.append(m.group(0))
        return f"⟦{len(held)-1}⟧"

    s = re.sub(r"\{[a-zA-Z0-9_]+\}", hold, s)
    s = re.sub(r"Aion 2 Forge|AION 2|NCSOFT|Daevanion|iLvl|Espion Builds|Spy Builds", hold, s)
    return s, held


def restore_tokens(s: str, held: list[str]) -> str:
    for i, v in enumerate(held):
        s = s.replace(f"⟦{i}⟧", v)
    # normalize Spy → Espion Builds if leftover
    s = s.replace("Spy Builds", "Espion Builds")
    return s


def translate_en(en: str) -> str:
    if not en:
        return en
    s, held = protect_tokens(en)
    # phrase replace (case-sensitive first, then ci for some)
    for a, b in PHRASES:
        if a in s:
            s = s.replace(a, b)
        else:
            # case-insensitive whole-ish
            s = re.sub(re.escape(a), b, s, flags=re.I)
    # word-ish for remaining english words (simple)
    def word_repl(m):
        w = m.group(0)
        low = w.lower()
        if low in WORD:
            frw = WORD[low]
            if w.isupper():
                return frw.upper()
            if w[0].isupper():
                return frw[:1].upper() + frw[1:]
            return frw
        return w

    s = re.sub(r"[A-Za-z']+", word_repl, s)
    s = restore_tokens(s, held)
    # tidy double spaces
    s = re.sub(r" {2,}", " ", s).strip()
    return s


def main():
    parts = {}
    for p in sorted((ROOT / "data").glob("fr-part-*.json")):
        parts.update(json.loads(p.read_text(encoding="utf-8")))
        print("loaded", p.name, len(parts))

    rows = json.loads((ROOT / "data" / "i18n-extract.json").read_text(encoding="utf-8"))
    rows += json.loads((ROOT / "data" / "i18n-equipo-extract.json").read_text(encoding="utf-8"))

    out = dict(parts)
    auto = 0
    for r in rows:
        k = r["key"]
        if k in out:
            continue
        out[k] = translate_en(r.get("en") or r.get("es") or k)
        auto += 1

    # Post polish critical keys if missing quality
    CRITICAL = {
        "espia.titulo": "Espion Builds",
        "espia.buscar": "Espionner",
        "espia.elyos": "Élyséens",
        "espia.asmodian": "Asmodiens",
        "espia.sub": "Voyez la build réelle de n’importe quel joueur (EU, NA, LA, Asie) : équipement, compétences, Daevanion, puissance et iLvl. Aucun compte requis. Choisissez une région, cherchez par nom et affinez avec les filtres.",
        "espia.antetitulo": "AION 2 global · gratuit",
        "tops.ambito_elyos": "Élyséens",
        "tops.ambito_asmodian": "Asmodiens",
        "eq.luz": "Élyséens",
        "eq.oscuridad": "Asmodiens",
        "nav.idioma": "Langue",
        "nav.mis": "Mes builds",
        "nav.entrar": "Connexion",
        "nav.salir": "Déconnexion",
        "comun.cargando": "Chargement…",
    }
    out.update(CRITICAL)

    path = ROOT / "data" / "i18n-fr-map.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", len(out), "auto", auto, "manual_parts", len(parts))


if __name__ == "__main__":
    main()
