# Guía 02 · Componentes, props, estado y estilos

Adaptación de la Guía 02 de ParkFlow360 a StockFlow: `App.tsx` dividido en componentes reutilizables con datos
locales de ejemplo. Sigue sobre el mismo proyecto de la Guía 01; el respaldo previo es el commit de la Guía 01.

## Ficha de adaptación (capítulo 20)

| Pregunta | ParkFlow360 | StockFlow |
|---|---|---|
| Proyecto | ParkFlow360 | StockFlow |
| Entidad padre (1) y su PK | Cliente · `Cliente.id` | Categoría · `Categoria.id` |
| Entidad hija (N) | Vehículo | Producto |
| Campo que vincula hija con padre | `Vehiculo.clienteId` | `Producto.categoriaId` (en BD: `producto.categoria_id`) |
| Propiedad que identifica al padre | nombre | `nombre` y `codigo` (`CategoriaCard`) |
| Propiedad clave de cada hijo | placa | `codigo` (`ProductoCard`) |
| Padre con cero hijos | Diego | Mobiliario (`CAT-MUE`) |
| Regla de estado propia | Cliente activo/inactivo | Categoría activa/inactiva: una inactiva conserva sus productos pero el backend no acepta productos nuevos en ella (422) |

Los modelos usan los mismos campos que `CategoriaResponse` y `ProductoResponse` del backend (y que los modelos de
la web), para que en la Guía 09 solo cambie la fuente de datos. Los datos parten de la semilla
`V2__datos_semilla.sql`; se agregaron dos casos que la semilla no tiene: Tecnología inactiva y Mobiliario sin
productos.

## Archivos (9)

| Archivo | Responsabilidad |
|---|---|
| `src/models/inventario.ts` | Tipos `Categoria`, `Producto`, `UnidadMedida` y `Seccion` |
| `src/data/demoData.ts` | 5 categorías y 5 productos de ejemplo (no vienen de PostgreSQL) |
| `src/theme/palette.ts` | Colores compartidos |
| `src/components/MetricCard.tsx` | Indicador numérico reutilizable |
| `src/components/TabSelector.tsx` | Elegir sección con props y callback |
| `src/components/CategoriaCard.tsx` | Tarjeta pulsable de categoría; avisa la selección con `alSeleccionar` |
| `src/components/ProductoCard.tsx` | Tarjeta informativa de producto |
| `src/components/EmptyState.tsx` | Mensaje de lista vacía |
| `App.tsx` | Dueño del estado (`seccion`, `categoriaId`); compone y filtra |

## Matriz de aceptación (capítulo 21)

Evidencias en `evidencias/guia-02/`.

| ID | Prueba | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|
| A01 | Abrir la app en Android | Título y componentes nuevos | ✅ | `g2_a01.png` |
| A02 | Indicadores iniciales | 5 categorías y 5 productos (`CATEGORIAS.length`, `PRODUCTOS.length`) | ✅ | `g2_a01.png` |
| A03 | Seleccionar Material de oficina | Solo PRD-OFI-001 y PRD-OFI-002 | ✅ | `g2_a03.png` |
| A04 | Seleccionar Limpieza | Solo PRD-LIM-001; la selección anterior se reemplaza | ✅ | `g2_a04.png` |
| A05 | Seleccionar Mobiliario | `EmptyState` "Sin resultados" | ✅ | `g2_a05.png` |
| A06 | Seleccionar Tecnología | INACTIVA y su producto PRD-TEC-001 | ✅ | `g2_a06.png` |
| A07 | Cambiar a Productos | 5 productos, cada uno con su categoría | ✅ | `g2_a07.png` |
| A08 | Cambiar acento a `#176AA6` y revertir | Cambian botón, borde, etiqueta y acciones; la lógica no | ✅ | `a08_acento_cambiado.png` |
| A09 | `npx tsc --noEmit` | Sin errores | ✅ | `paso24_error_typescript.txt` (exit=0) |
| A10 | Variante personal 1:N | Filtra el dominio propio y muestra vacío | ✅ | Toda la guía usa Categoría/Producto; A05 |

Experimentos de los pasos 24 y 25:
- Paso 24: con `valor: string` en `MetricCard`, `tsc` marca `App.tsx(36,58)` y `(37,57)`:
  `Type 'number' is not assignable to type 'string'`. Restaurado el tipo, `exit=0`.
- Paso 25: con `categoriaId: 999` en PRD-LIM-001 la tarjeta muestra "Categoría no encontrada" sin romper la app
  (`?.` y `??`). TypeScript no lo detecta porque valida tipos, no la integridad: eso lo hace la FK
  `fk_producto_categoria` en PostgreSQL. Restaurado el dato.

## Bitácora técnica

| Campo | Registro |
|---|---|
| Guía | 02 |
| Proyecto y carpeta | `androidstudio/stockflow-mobile` |
| Archivos creados | Los 9 de la tabla anterior |
| Experimentos realizados | A01–A10, pasos 24 y 25 |
| Error real encontrado | Al reabrir la app, Metro registró "Project is incompatible with this version of Expo Go" de un intento de apertura anterior. Hipótesis: la URL abierta no correspondía a la sesión activa de Metro. Verificación: reabrir con `adb reverse tcp:8081 tcp:8081` y `exp://127.0.0.1:8081` carga la app sin error. |
| Cambio propio | Dominio Categoría/Producto con campos del contrato real; tarjetas renombradas (`CategoriaCard`, `ProductoCard`); categoría inactiva y categoría sin productos agregadas a la semilla |
| Limitación actual | Datos locales de ejemplo: sin API, sin CRUD, sin persistencia y sin navegación entre pantallas (llega en la Guía 03) |
