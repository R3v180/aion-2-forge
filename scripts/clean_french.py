# -*- coding: utf-8 -*-
"""Limpia sustituciones corruptas en francés en i18n.js y data/i18n-fr-map.json."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    (r"Acvotreauités de AION 2", "Actualités d’AION 2"),
    (r"Acvotreauités", "Actualités"),
    (r"Acvotreauizaciones", "Mises à jour"),
    (r"Acvotreauizada", "Mise à jour"),
    (r"Acvotreauizando…", "Mise à jour…"),
    (r"Staff acvotreau", "Équipe actuelle"),
    (r"La acvotreauización sonele tardar 30–60 segundos\.", "La mise à jour prend généralement 30 à 60 secondes."),
    (r"Se acvotreauizan chaque 15 minutos\.", "Mises à jour toutes les 15 minutes."),
    (r"Última acvotreauización: octobre 2026\.", "Dernière mise à jour : octobre 2026."),
    (r"habivotreaues", "habituels"),
    (r"internacionau", "internationale"),
    (r"escapourte esttico", "vitrine statique"),
    (r"peut êtrevirse", "peut être servi"),
    (r"ne peuts", "ne peux pas"),
    (r"esenciau", "essentiel"),
    (r"Lo esenciau", "L’essentiel"),
    (r"Nonm d’utiliSameur", "Nom d’utilisateur"),
    (r"Nonm d'utiliSameur", "Nom d’utilisateur"),
    (r"utiliSameur", "utilisateur"),
    (r"Nonm", "Nom"),
    (r"Nonw", "maintenant"),
    (r"Nont", "pas"),
    (r"sestivotreyen", "constituent"),
    (r"avectenido", "contenu"),
    (r"usonarios", "utilisateurs"),
    (r"usonario", "utilisateur"),
    (r"avectraseña", "mot de passe"),
    (r"avectrol", "contrôle"),
    (r"êtrevicio", "service"),
    (r"êtrevidor", "serveur"),
    (r"auojamiento", "hébergement"),
    (r"auojan", "hébergent"),
    (r"prcetter", "protéger"),
    (r"sonpresión", "suppression"),
    (r"votreyo", "vôtre"),
    (r"cettefas", "escroqueries"),
    (r"Brazauete", "Bracelet"),
    (r"Potenciau", "Potentiel"),
    (r"Especiau", "Spécial"),
    (r"oficiau", "officiel"),
    (r"legau", "légal"),
    (r"Generau", "Général"),
]


def clean_file(path: Path):
    t = path.read_text(encoding="utf-8")
    count = 0
    for pat, rep in REPLACEMENTS:
        matches = len(re.findall(pat, t))
        if matches:
            t = re.sub(pat, rep, t)
            count += matches
    path.write_text(t, encoding="utf-8", newline="\n")
    print(f"{path.name}: {count} sustituciones aplicadas.")


def main():
    clean_file(ROOT / "js" / "i18n.js")
    clean_file(ROOT / "js" / "equipo.js")
    clean_file(ROOT / "data" / "i18n-fr-map.json")


if __name__ == "__main__":
    main()
