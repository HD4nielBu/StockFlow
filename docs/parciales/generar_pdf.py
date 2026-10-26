"""Genera respuestas-2do-parcial.pdf desde respuestas-2do-parcial.html.

Uso (desde la raíz del repositorio):
    python3 docs/parciales/generar_pdf.py

Hace dos pasadas con Google Chrome en modo headless:
  1. imprime el HTML y busca en qué página quedó cada sección y cada pregunta;
  2. escribe esos números en el índice y vuelve a imprimir.
Requiere google-chrome (o chromium) y pdftotext (paquete poppler-utils).
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
FUENTE = AQUI / "respuestas-2do-parcial.html"
DESTINO = AQUI / "respuestas-2do-parcial.pdf"

# id del índice -> texto con el que empieza el título en el cuerpo del documento
SECCIONES = {
    "como-usar": "Las 5 exigencias de cada respuesta",
    "mapa": "Mapa del proyecto",
    "bloque-a": "Bloque A — Arquitectura",
    "bloque-b": "Bloque B — Componentes",
    "bloque-c": "Bloque C — HTTP",
    "bloque-d": "Bloque D — Relación",
    "bloque-e": "Bloque E — Testing",
    "desafios": "Los 5 desafíos prácticos",
    "checklist": "Señales de alerta y checklist final",
    "pendientes": "Pendientes conocidos del frontend",
    "glosario": "Glosario de términos técnicos",
}


def chrome() -> str:
    for nombre in ("google-chrome", "chromium", "chromium-browser"):
        ruta = shutil.which(nombre)
        if ruta:
            return ruta
    sys.exit("No se encontró google-chrome ni chromium")


def imprimir(html: Path, pdf: Path) -> None:
    subprocess.run(
        [chrome(), "--headless", "--no-pdf-header-footer", f"--print-to-pdf={pdf}", html.as_uri()],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def paginas(pdf: Path) -> list[str]:
    texto = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], check=True,
                           capture_output=True, text=True).stdout
    return texto.split("\f")


def ubicar(textos: list[str]) -> dict[str, int]:
    inicio = next(i for i, t in enumerate(textos) if SECCIONES["como-usar"] in t)
    numeros = {"como-usar": inicio + 1}
    for clave, titulo in SECCIONES.items():
        if clave == "como-usar":
            continue
        for i in range(inicio, len(textos)):
            if titulo in textos[i]:
                numeros[clave] = i + 1
                break
    for i in range(inicio, len(textos)):
        for n in re.findall(r"^\s*Pregunta (\d{2})\b", textos[i], re.MULTILINE):
            numeros.setdefault(f"p{n}", i + 1)
    return numeros


def con_numeros(html: str, numeros: dict[str, int]) -> str:
    html = re.sub(r'<span class="pg">\d*</span>', "", html)

    def poner(m: re.Match) -> str:
        n = numeros.get(m.group(2), "")
        return f'{m.group(1)}<span class="pg">{n}</span></div>'

    return re.sub(r'(<div class="[bq]"><a href="#([\w-]+)">.*?</a>)</div>', poner, html)


def main() -> None:
    original = FUENTE.read_text(encoding="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        borrador_html = AQUI / ".borrador-indice.html"  # junto al original para conservar rutas relativas
        borrador_pdf = Path(tmp) / "borrador.pdf"
        try:
            borrador_html.write_text(con_numeros(original, {}), encoding="utf-8")
            imprimir(borrador_html, borrador_pdf)
            numeros = ubicar(paginas(borrador_pdf))
        finally:
            borrador_html.unlink(missing_ok=True)
    final = con_numeros(original, numeros)
    if final != original:
        FUENTE.write_text(final, encoding="utf-8")
    imprimir(FUENTE, DESTINO)
    faltan = [k for k in [*SECCIONES, *(f"p{i:02d}" for i in range(1, 51))] if k not in numeros]
    print(f"PDF generado: {DESTINO} ({len(paginas(DESTINO)) - 1} páginas)")
    if faltan:
        print("Sin número de página en el índice:", ", ".join(faltan))


if __name__ == "__main__":
    main()
