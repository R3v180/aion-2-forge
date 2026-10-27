from pathlib import Path

for rel in ("js/i18n.js", "js/equipo.js"):
    text = Path(rel).read_text(encoding="utf-8")
    # Balance de llaves
    open_b = text.count("{")
    close_b = text.count("}")
    print(f"{rel}: open={open_b}, close={close_b}, diff={open_b - close_b}")
    assert open_b == close_b, f"Mismatch in {rel}"

print("All JS brackets perfectly balanced!")
