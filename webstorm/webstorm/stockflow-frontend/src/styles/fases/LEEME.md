# Plantillas de diseño "fases"

Sólo estilos y animaciones. El código del proyecto no cambió: lo único agregado fuera de esta carpeta es
una línea en `src/main.tsx`:

```ts
import './styles/fases/index.css';
```

Si la borras, la app vuelve a verse como antes. Las 28 pruebas originales siguen pasando.

| Archivo | Sección | Diseño | Animación |
|---|---|---|---|
| `layout.css` | Menú y barra superior | Menú negro con pestañas inclinadas del color de la sección | La franja se despliega en la sección activa; barrido diagonal al abrir cada pantalla |
| `inicio.css` | Inicio | Noche azul con agua y luna, números en cursiva | Los paneles suben y las filas de stock bajo entran inclinadas |
| `categorias.css` | Categorías | Amarillo eléctrico; estantería con cajas y placas (código + nombre) | La caja nueva cae sobre la viga y se estampa la placa |
| `productos.css` | Productos | Rojo y negro con rayos; tarjetas recortadas | Las tarjetas entran de golpe |
| `modulos.css` | Ubicaciones, Existencias y Kardex | Mapa azul con puntos, tablas en amarillo y libro de registro en rojo | Las tarjetas suben y su punto late; las filas entran inclinadas; las barras de nivel se llenan |
| `no-encontrada.css` | 404 | Tarjeta recortada sobre rayas | Aparece girando |
| `componentes.css` | Botones, campos, avisos, diálogo | Botones en paralelogramo, aviso flotante | El diálogo aparece girando |
| `tokens.css` / `fuentes.css` / `animaciones.css` | Todo | Paleta por sección, tipografías incluidas (sin internet), animaciones comunes | Respeta "reducir movimiento" |

Cada pantalla se reconoce con `:has()` (por ejemplo, Categorías es la que contiene el formulario de categoría),
por eso no hizo falta tocar ningún componente.
