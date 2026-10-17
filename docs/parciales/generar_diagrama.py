"""Genera diagrama-flujo-2do-parcial.pdf: el flujo fullstack de StockFlow dibujado (preguntas 21, 25, 50).

Uso (desde la raíz del repositorio):
    python3 docs/parciales/generar_diagrama.py

Los diagramas se dibujan como SVG desde las listas de pasos de abajo; si cambia una línea de código,
se corrige aquí y se vuelve a generar. Usa el mismo Chrome headless que generar_pdf.py.
"""
import tempfile
from html import escape
from pathlib import Path

from generar_pdf import imprimir

AQUI = Path(__file__).resolve().parent
DESTINO = AQUI.parent.parent / "diagrama-flujo-2do-parcial.pdf"

AZUL, VERDE, CODIGO, TENUE, ROJO = "#1f3a5f", "#2f8f5b", "#8a1f4a", "#5b6470", "#b42318"


def secuencia(carriles, pasos, ancho=1000, fila=37, frontera=None):
    """Diagrama de secuencia en SVG.

    carriles: [(titulo, subtitulo)].
    pasos: ("fase", texto) | ("msg", desde, hasta, etiqueta, ref, vuelta) | ("nota", carril, etiqueta, ref).
    frontera: índice del primer carril del backend (se sombrea y se marca la línea HTTP).
    """
    n = len(carriles)
    sep = ancho / n
    xs = [sep * (i + 0.5) for i in range(n)]
    y0 = 62
    alto = y0 + fila * len(pasos) + 30
    o = [f'<svg viewBox="0 0 {ancho} {alto}" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans" font-size="11">',
         '<defs><marker id="f" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
         f'<path d="M0,0 L10,5 L0,10 z" fill="{AZUL}"/></marker>'
         '<marker id="fv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
         f'<path d="M0,0 L10,5 L0,10 z" fill="{VERDE}"/></marker></defs>']
    if frontera is not None:
        xb = sep * frontera
        o.append(f'<rect x="0" y="0" width="{xb}" height="{alto}" fill="#e8eef7" opacity="0.45"/>')
        o.append(f'<rect x="{xb}" y="0" width="{ancho - xb}" height="{alto}" fill="#e9f6ef" opacity="0.7"/>')
        o.append(f'<line x1="{xb}" y1="0" x2="{xb}" y2="{alto}" stroke="{ROJO}" stroke-width="1.6" stroke-dasharray="7 4"/>')
        o.append(f'<text x="{xb + 5}" y="{alto - 6}" fill="{ROJO}" font-size="10" font-weight="bold">HTTP · frontera frontend / backend</text>')
    for x, (titulo, sub) in zip(xs, carriles):
        o.append(f'<line x1="{x}" y1="44" x2="{x}" y2="{alto - 4}" stroke="#9aa5b4" stroke-dasharray="3 3"/>')
        o.append(f'<rect x="{x - sep / 2 + 6}" y="4" width="{sep - 12}" height="38" rx="4" fill="#fff" stroke="{AZUL}"/>')
        o.append(f'<text x="{x}" y="20" text-anchor="middle" font-weight="bold" fill="{AZUL}" font-size="11.5">{escape(titulo)}</text>')
        o.append(f'<text x="{x}" y="34" text-anchor="middle" fill="{TENUE}" font-size="9">{escape(sub)}</text>')
    halo = 'paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"'
    for k, p in enumerate(pasos):
        y = y0 + fila * k + fila * 0.62
        if p[0] == "fase":
            o.append(f'<rect x="2" y="{y - 15}" width="{ancho - 4}" height="20" fill="{AZUL}" rx="3"/>')
            o.append(f'<text x="10" y="{y - 1}" fill="#fff" font-weight="bold" font-size="11">{escape(p[1])}</text>')
            continue
        if p[0] == "nota":
            _, c, etiqueta, ref = p
            x = xs[c]
            o.append(f'<rect x="{x - 8}" y="{y - 12}" width="16" height="16" fill="{AZUL}" rx="2"/>')
            tx, anc = (x - 14, "end") if c >= n / 2 else (x + 14, "start")
            o.append(f'<text x="{tx}" y="{y - 2}" text-anchor="{anc}" fill="#111" {halo}>{escape(etiqueta)}</text>')
            o.append(f'<text x="{tx}" y="{y + 10}" text-anchor="{anc}" fill="{CODIGO}" font-family="DejaVu Sans Mono" font-size="9" {halo}>{escape(ref)}</text>')
            continue
        _, a, b, etiqueta, ref, vuelta = p
        xa, xb = xs[a], xs[b]
        d = 1 if xb > xa else -1
        color, marca = (VERDE, "fv") if vuelta else (AZUL, "f")
        dash = ' stroke-dasharray="6 3"' if vuelta else ""
        o.append(f'<line x1="{xa + 3 * d}" y1="{y}" x2="{xb - 3 * d}" y2="{y}" stroke="{color}" stroke-width="1.6"{dash} marker-end="url(#{marca})"/>')
        izq = min(xa, xb) + 8
        o.append(f'<text x="{izq}" y="{y - 5}" fill="#111" {halo}>{escape(etiqueta)}</text>')
        if ref:
            o.append(f'<text x="{izq}" y="{y + 12}" fill="{CODIGO}" font-family="DejaVu Sans Mono" font-size="9" {halo}>{escape(ref)}</text>')
    o.append("</svg>")
    return "\n".join(o)


def cadena(cajas, ancho=1000):
    """Fila de cajas unidas por flechas: la versión corta para dibujar en la pizarra."""
    n = len(cajas)
    paso = ancho / n
    w = paso - 22
    o = [f'<svg viewBox="0 0 {ancho} 92" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans">',
         f'<defs><marker id="c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{AZUL}"/></marker></defs>']
    for i, (titulo, sub, lado) in enumerate(cajas):
        x = i * paso + 4
        relleno, borde = ("#e9f6ef", VERDE) if lado == "b" else ("#e8eef7", AZUL)
        o.append(f'<rect x="{x}" y="8" width="{w}" height="74" rx="6" fill="{relleno}" stroke="{borde}" stroke-width="1.4"/>')
        for j, linea in enumerate(titulo.split("|")):
            o.append(f'<text x="{x + w / 2}" y="{30 + 13 * j}" text-anchor="middle" font-weight="bold" font-size="10" fill="{AZUL}">{escape(linea)}</text>')
        for j, linea in enumerate(sub.split("|")):
            o.append(f'<text x="{x + w / 2}" y="{62 + 11 * j}" text-anchor="middle" font-size="8" fill="{CODIGO}" font-family="DejaVu Sans Mono">{escape(linea)}</text>')
        if i < n - 1:
            o.append(f'<line x1="{x + w + 2}" y1="45" x2="{x + paso - 2}" y2="45" stroke="{AZUL}" stroke-width="1.8" marker-end="url(#c)"/>')
    o.append("</svg>")
    return "\n".join(o)


# --- Página 1: versión para la pizarra (pregunta 50 y "dibujar el flujo" del examen) ---
IDA = [
    ("Usuario", "clic en|Guardar", "f"),
    ("ProductoForm", "handleSubmit|validarProducto", "f"),
    ("productoService", "actualizar(|id, data)", "f"),
    ("apiClient", "apiFetch → fetch|URL + JSON", "f"),
    ("Controller", "@PutMapping|@Valid", "b"),
    ("ProductoService", "@Transactional|404·422·409", "b"),
    ("Adapter + JPA", "guardar → save|UPDATE", "b"),
    ("PostgreSQL", "FK · UNIQUE|commit", "b"),
]
VUELTA = [
    ("PostgreSQL", "fila guardada", "b"),
    ("Spring", "200 +|ProductoResponse", "b"),
    ("apiClient", "response.ok|response.json()", "f"),
    ("ProductoForm", "onSaved(p, 'edit')", "f"),
    ("ProductosPage", "handleSaved|setData(map)", "f"),
    ("React", "re-render|filtros → página", "f"),
    ("ProductoTable", "fila nueva|categoriasPorId", "f"),
    ("Usuario", "ve el cambio|+ toast", "f"),
]

# --- Página 2: PUT completo (editar un producto y cambiar su categoría) ---
CARRILES_PUT = [
    ("Usuario", "navegador"),
    ("Table / Form", "componentes"),
    ("ProductosPage", "dueña del estado"),
    ("productoService", "+ apiClient"),
    ("fetch / CORS", "Web API del navegador"),
    ("Spring Boot", "Controller → Service"),
    ("PostgreSQL", "esquema stockflow"),
]
PASOS_PUT = [
    ("fase", "A · Abrir la edición con datos frescos (GET /{id})"),
    ("msg", 0, 1, "1. Elige «Editar» en la fila", "ProductoTable.tsx:88", False),
    ("msg", 1, 2, "2. onEdit(p): sólo avisa", "ProductoTable.tsx:21-22", False),
    ("msg", 2, 3, "3. obtenerPorId(id)", "ProductosPage.tsx:110-113", False),
    ("msg", 3, 5, "4. GET /api/productos/{id}", "apiClient.ts:52-68", False),
    ("msg", 5, 2, "5. 200 + Producto → abrirFormulario: modal precargado", "ProductoForm.tsx:38-51 (aFormulario)", True),
    ("fase", "B · Editar y guardar (PUT)"),
    ("msg", 0, 1, "6. Cambia la categoría: handleChange → setFormData → re-render", "ProductoForm.tsx:90-95", False),
    ("nota", 1, "7. «Guardar cambios»: preventDefault → validarProducto → setSaving(true)", "ProductoForm.tsx:97-107"),
    ("msg", 1, 3, "8. actualizar(id, {...aPayload, activo})", "ProductoForm.tsx:110 · productoService.ts:16-19", False),
    ("msg", 3, 4, "9. apiFetch: URL + Content-Type JSON", "apiClient.ts:52-59", False),
    ("msg", 4, 5, "10. OPTIONS (preflight CORS) → 200", "CorsConfig.java:24-25", False),
    ("msg", 4, 5, "11. PUT /api/productos/{id} con el JSON", "", False),
    ("nota", 5, "12. @Valid (400) → actualizar @Transactional", "ProductoController.java:77-79"),
    ("nota", 5, "13. producto 404 · categoría 404 · inactiva 422 · código 409", "ProductoService.java:52-66"),
    ("msg", 5, 6, "14. UPDATE producto SET categoria_id …", "ProductoPersistenceAdapter.java:34-38", False),
    ("msg", 6, 5, "15. FK válida → commit", "", True),
    ("fase", "C · Volver a la pantalla"),
    ("msg", 5, 4, "16. 200 + ProductoResponse (JSON)", "", True),
    ("msg", 4, 3, "17. response.ok → response.json()", "apiClient.ts:61-67", True),
    ("msg", 3, 1, "18. Producto → onSaved(producto, 'edit')", "ProductoForm.tsx:110", True),
    ("msg", 1, 2, "19. handleSaved: setData(prev.map(...)), cierra el modal", "ProductosPage.tsx:122-126", True),
    ("nota", 2, "20. re-render: filtros → paginar → tabla", "ProductosPage.tsx:79-90"),
    ("msg", 2, 0, "21. La fila muestra la nueva categoría + toast", "ProductoTable.tsx:56 (categoriasPorId.get)", True),
]

# --- Página 3: GET al entrar a /productos, con cancelación ---
CARRILES_GET = [
    ("Usuario", "navegador"),
    ("ProductosPage", "Page"),
    ("useAsyncList", "vía useProductos"),
    ("productoService", "+ apiClient"),
    ("Spring + PostgreSQL", "backend"),
]
PASOS_GET = [
    ("fase", "Montaje: React Router elige la pantalla y el Effect sincroniza con la API"),
    ("msg", 0, 1, "1. Entra a /productos: Route monta ProductosPage", "AppRouter.tsx:43 · MainLayout <Outlet>", False),
    ("msg", 1, 2, "2. useProductos() → useAsyncList(listar)", "ProductosPage.tsx:42 · useProductos.ts:5-7", False),
    ("nota", 2, "3. useEffect: new AbortController · setLoading(true)", "useAsyncList.ts:21-26"),
    ("msg", 2, 3, "4. loader(signal) = productoService.listar(signal)", "useAsyncList.ts:27 · productoService.ts:7-9", False),
    ("msg", 3, 4, "5. GET /api/productos  (Origin: localhost:5173)", "apiClient.ts:52-60", False),
    ("msg", 4, 3, "6. 200 + JSON + Access-Control-Allow-Origin", "", True),
    ("msg", 3, 2, "7. response.ok → response.json() → Producto[]", "apiClient.ts:67", True),
    ("nota", 2, "8. si no se abortó: setData(resultado) · setLoading(false)", "useAsyncList.ts:29 y :33"),
    ("msg", 2, 1, "9. React re-renderiza: skeleton → tabla", "ProductosPage.tsx:231-293", True),
    ("fase", "Si el usuario sale antes (o StrictMode repite el Effect en desarrollo)"),
    ("nota", 2, "10. cleanup: controller.abort()", "useAsyncList.ts:37"),
    ("msg", 3, 2, "11. fetch rechaza con AbortError → se ignora", "useAsyncList.ts:31 · isAbortError.ts", True),
    ("nota", 2, "12. si la respuesta ya venía en camino, se descarta", "useAsyncList.ts:29 · probado en useAsyncList.test.ts:62"),
]

# --- Página 4: dónde se rompe (pregunta 50 y desafío 3) ---
FALLAS = [
    ("URL mal escrita dentro de /api", "4 / 11", "404 en /api/producto", "Backend (sin mapping) → ApiError", "Alert con el mensaje del backend + Reintentar"),
    ("Prefijo o puerto incorrecto", "4 / 11", "«CORS error» o ERR_CONNECTION_REFUSED", "Navegador → TypeError", "«No se pudo conectar con el backend…»"),
    ("Origen no permitido (CORS)", "10", "OPTIONS sin Access-Control-Allow-Origin; Console «blocked by CORS policy»", "Navegador → TypeError", "«No se pudo conectar con el backend…»"),
    ("Formulario inválido", "7", "Ninguna petición", "validarProducto (UI)", "Error junto al campo y foco en él"),
    ("Payload inválido para el backend", "12", "400 con fieldErrors", "Bean Validation (@Valid)", "Errores por campo en el formulario"),
    ("Producto o categoría inexistente", "13", "404", "ProductoService", "«El registro ya no existe» + reload()"),
    ("Mover a una categoría inactiva", "13", "422", "Regla de negocio", "«La operación no cumple una regla del inventario»"),
    ("Código repetido", "13 / 14", "409", "ProductoService o UNIQUE en PostgreSQL", "Mensaje en el modal; el formulario se conserva"),
    ("Error interno", "12-15", "500", "GlobalExceptionHandler", "«El servidor tuvo un problema»; no se finge éxito"),
    ("Respuesta con forma inesperada", "17", "200, pero el JSON no coincide con el modelo", "Nadie en runtime (TS no existe al ejecutar)", "Celdas vacías; si el render se rompe, AppErrorBoundary"),
    ("201/200 en Network pero la tabla no cambia", "18-20", "La respuesta está bien", "Estado del frontend", "Revisar onSaved, setData con array nuevo, filtros y página"),
]


def html() -> str:
    filas = "".join(
        f"<tr><td>{escape(a)}</td><td class='num'>{b}</td><td>{escape(c)}</td><td>{escape(d)}</td><td>{escape(e)}</td></tr>"
        for a, b, c, d, e in FALLAS
    )
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Diagrama del flujo fullstack · StockFlow</title>
<style>
  @page {{ size: A4 landscape; margin: 11mm 12mm; }}
  html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{ margin: 0; font-family: "DejaVu Sans", sans-serif; color: #1f2328; font-size: 9.2pt; line-height: 1.4; }}
  section {{ break-after: page; }}
  section:last-child {{ break-after: auto; }}
  h1 {{ color: {AZUL}; font-size: 19pt; margin: 0 0 2pt; }}
  h2 {{ color: {AZUL}; font-size: 14pt; margin: 0 0 3pt; }}
  .sub {{ color: {TENUE}; margin: 0 0 8pt; }}
  h3 {{ color: {AZUL}; font-size: 11pt; margin: 10pt 0 4pt; }}
  svg {{ width: 100%; display: block; }}
  .alto svg {{ max-height: 150mm; }}
  code {{ font-family: "DejaVu Sans Mono", monospace; color: {CODIGO}; font-size: 8.4pt; }}
  .leyenda {{ font-size: 8.4pt; color: {TENUE}; margin-top: 5pt; }}
  .leyenda b.f {{ color: {AZUL}; }} .leyenda b.v {{ color: {VERDE}; }} .leyenda b.r {{ color: {ROJO}; }}
  ul {{ margin: 4pt 0; padding-left: 15pt; }} li {{ margin-bottom: 3pt; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 8.6pt; }}
  th, td {{ border: 1px solid #c9d6e8; padding: 4pt 6pt; text-align: left; vertical-align: top; }}
  th {{ background: #e8eef7; color: {AZUL}; }}
  td.num {{ text-align: center; font-weight: bold; color: {AZUL}; white-space: nowrap; }}
  .caja {{ border: 1px solid #c9d6e8; background: #f6f8fa; border-radius: 4px; padding: 6pt 9pt; margin-top: 8pt; }}
</style></head><body>

<section>
  <h1>Flujo fullstack de StockFlow, dibujado</h1>
  <p class="sub">Programación Aplicada 2026-2 · 2do parcial · complemento de <code>respuestas-2do-parcial.pdf</code> (preguntas 21, 25, 50 y desafío 1).
  El examen pide «dibujar el flujo completo: usuario → React → hook/service → HTTP → Spring Boot → respuesta → estado → re-render».</p>
  <h3>Versión para la pizarra: editar un producto (PUT), ida</h3>
  {cadena(IDA)}
  <h3>Vuelta</h3>
  {cadena(VUELTA)}
  <p class="leyenda"><b class="f">Azul</b>: frontend (corre en el navegador) · <b class="v">Verde</b>: backend ya implementado en el parcial 1 · la frontera entre ambos es la petición HTTP.</p>
  <div class="caja">
    <b>Cómo usarlo en la defensa</b>
    <ul>
      <li>Dibuja primero estas dos filas (son 16 cajas) y marca la frontera HTTP. Después agrega el detalle de la página 2 sólo si te lo piden.</li>
      <li>Por cada caja, nombra la pieza real (archivo y función) y qué decide: «ProductoForm valida y arma el payload», «el service conoce la ruta», «apiClient revisa response.ok».</li>
      <li>Para la vuelta, el punto clave es que React re-renderiza porque se llamó a un setter con un array nuevo (<code>setData(prev.map(...))</code>), no «porque llegó la respuesta».</li>
      <li>La página 4 responde «¿dónde se rompería?»: cada falla apunta al número de paso de la página 2.</li>
    </ul>
  </div>
</section>

<section class="alto">
  <h2>Detalle: editar un producto y cambiarle la categoría (PUT)</h2>
  <p class="sub">Es la operación que sugiere la pregunta 50: toca formulario, relación 1:N, PUT, reglas de negocio y actualización de la tabla.</p>
  {secuencia(CARRILES_PUT, PASOS_PUT, fila=27, frontera=5)}
  <p class="leyenda"><b class="f">Flecha llena</b>: llamada o petición · <b class="v">flecha punteada verde</b>: respuesta · cuadrado azul: algo que pasa dentro de ese carril · <b class="r">línea roja</b>: frontera HTTP. Las rutas de frontend cuelgan de <code>webstorm/stockflow-frontend/src/</code> y las de backend de <code>intellij/stockflow-backend/src/main/java/com/stockflow/</code>.</p>
</section>

<section class="alto">
  <h2>Detalle: cargar la lista al entrar a /productos (GET)</h2>
  <p class="sub">Preguntas 21, 38 y 39: el Effect sincroniza la pantalla con la API y su cleanup cancela lo que ya no sirve.</p>
  {secuencia(CARRILES_GET, PASOS_GET, fila=34, frontera=4)}
  <p class="leyenda">En desarrollo, StrictMode ejecuta setup → cleanup → setup: en Network se ve un primer GET <i>(canceled)</i> y un segundo que completa. En producción hay uno solo.</p>
</section>

<section>
  <h2>Dónde se rompería el flujo</h2>
  <p class="sub">Pregunta 50 («diagnosticar dónde se rompería ante URL incorrecta, CORS, payload inválido, 404, 409, 500 o respuesta con forma inesperada») y desafío 3. La columna «Paso» apunta al diagrama del PUT.</p>
  <table>
    <tr><th style="width:21%">Falla</th><th style="width:6%">Paso</th><th style="width:24%">Qué se ve en Network / Console</th><th style="width:21%">Qué capa lo detecta</th><th>Qué ve el usuario</th></tr>
    {filas}
  </table>
  <div class="caja"><b>Método:</b> abre Network antes de reproducir. Si la petición no aparece, el problema está antes del paso 9 (validación o JavaScript). Si aparece, mira status, Payload y Response, y compáralos con el contrato probado en Swagger o Postman.</div>
</section>
</body></html>"""


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        fuente = Path(tmp) / "diagrama.html"
        fuente.write_text(html(), encoding="utf-8")
        imprimir(fuente, DESTINO)
    print(f"PDF generado: {DESTINO}")


if __name__ == "__main__":
    main()
