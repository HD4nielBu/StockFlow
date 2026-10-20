# Guía 03 · Pantallas y navegación con Expo Router

Adaptación de la Guía 03 de ParkFlow360 a StockFlow: del estado que alternaba paneles (Guía 02) a rutas reales con
historial. Sigue sobre el mismo proyecto; el respaldo previo es el commit de la Guía 02.

## Ficha de adaptación (capítulo 14)

| Elemento | ParkFlow360 | StockFlow |
|---|---|---|
| Problema que resuelve | Estacionamiento: clientes y sus vehículos | Inventario: categorías y sus productos |
| Entidad padre · ID · atributos mostrados | Cliente · `id` · nombre, correo, estado | Categoría · `id` · código, nombre, descripción, estado |
| Entidad hija · ID · clave foránea | Vehículo · `id` · `clienteId` | Producto · `id` · `categoriaId` |
| Inicio | `/` | `/` |
| Listado padre / detalle padre | `/clientes` · `/clientes/[id]` | `/categorias` · `/categorias/[id]` |
| Listado hijo / detalle hijo | `/vehiculos` · `/vehiculos/[id]` | `/productos` · `/productos/[id]` |
| Relación por ID, no por nombre | `vehiculo.clienteId === cliente.id` | `producto.categoriaId === categoria.id` |
| Padre sin hijos (prueba) | Diego | Mobiliario (`/categorias/5`) |
| ID inexistente / mal formado (prueba) | `/clientes/999` · `/vehiculos/abc` | `/categorias/999` · `/productos/abc` |
| Regreso sin historial | `ReturnButton` → `replace` al listado | Igual: `/categorias` o `/productos` |
| Backend futuro (Guía 09+) | `GET /clientes/{id}` | `GET /api/categorias/{id}`, `GET /api/productos/{id}`, `GET /api/productos/categoria/{id}` |

## Cambios de configuración

| Archivo | Cambio | Paso |
|---|---|---|
| `package.json` | `expo-router`, `react-native-screens`, `expo-linking`, `expo-constants` con `npx expo install`; `"main": "expo-router/entry"` | 06–07 |
| `app.json` | `"scheme": "stockflow"`, `"experiments": { "typedRoutes": true }`; `expo install` agregó `"plugins": ["expo-router", "expo-status-bar"]`, que la documentación actual de Expo también pide | 08 |
| `tsconfig.json` | Expo agregó `include` con `.expo/types/**/*.ts` y `expo-env.d.ts` al generar las rutas tipadas | 25 |
| `App.tsx`, `index.ts` | Eliminados: con `main` en `expo-router/entry` ya no son la entrada (error frecuente 01: "Expo sigue mostrando la antigua App.tsx"). Su versión queda en el commit de la Guía 02 | 10 |

`TabSelector.tsx` se conserva sin uso, como indica la guía, para comparar el cambio de estado local con la
navegación real.

## Archivos nuevos

| Archivo | Responsabilidad |
|---|---|
| `src/utils/routeParams.ts` | `leerIdPositivo`: rechaza `abc`, `0`, negativos, arrays y enteros fuera de rango |
| `src/components/ReturnButton.tsx` | `canGoBack()` → `back()`; si no hay historial, `replace` al listado |
| `src/components/ProductoNavegable.tsx` | `ProductoCard` envuelta en `Link` a `/productos/[id]`; se reutiliza en dos pantallas |
| `src/app/_layout.tsx` | `Stack` con cabeceras y títulos de todas las rutas |
| `src/app/index.tsx` | Inicio: métricas y accesos a Categorías, Productos y Ayuda |
| `src/app/categorias/index.tsx` | Lista con `FlatList`; `alSeleccionar` hace `router.push` a la ficha |
| `src/app/categorias/[id].tsx` | Ficha: valida el ID, `find` de la categoría y `filter` de sus productos |
| `src/app/productos/index.tsx` | Catálogo de productos con su categoría |
| `src/app/productos/[id].tsx` | Ficha del producto con enlace a su categoría |
| `src/app/ayuda.tsx` | Alcance de la práctica y enlaces de prueba (999 y `abc`) |
| `src/app/+not-found.tsx` | Ruta que no coincide con ningún archivo |

## Pruebas de aceptación (capítulo 11)

Evidencias en `evidencias/guia-03/` (capturas y `recorrido_texto.txt`).

| ID | Acción | Resultado esperado | Resultado |
|---|---|---|---|
| A01 | Inicio | Título y métricas 5 / 5 | ✅ |
| A02 | Inicio → Categorías | Lista de cinco con cabecera "Categorías" | ✅ |
| A03 | Material de oficina (ID 1) | PRD-OFI-001 y PRD-OFI-002 | ✅ |
| A04 | Limpieza (ID 2) | Solo PRD-LIM-001 | ✅ |
| A05 | Tecnología (ID 4) | INACTIVA con PRD-TEC-001 | ✅ |
| A06 | Mobiliario (ID 5) | `EmptyState` sin productos | ✅ |
| A07 | Categorías → Material de oficina → PRD-OFI-001 | Ficha del producto y su categoría | ✅ |
| A08 | Atrás desde PRD-OFI-001 | Regresa a la ficha de Material de oficina | ✅ |
| A09 | Inicio → Productos | Catálogo de cinco | ✅ |
| A10 | Producto 3 → categoría | Llega a Limpieza | ✅ |
| A11 | Ayuda → categoría 999 | Dato no encontrado y enlace de retorno | ✅ |
| A12 | Ayuda → producto `abc` | ID inválido y enlace de retorno | ✅ |
| A13 | Ruta no definida (`/inventario`, por deep link) | `+not-found` | ✅ |
| A14 | `npx tsc --noEmit` | Sin errores después de iniciar Expo | ✅ |
| A15 | Cambiar nombre en `demoData.ts` | Se actualiza en lista y ficha sin tocar rutas | ✅ (restaurado) |
| A16 | Atrás de Android | Orden correcto, sin quedar atrapado | ✅ |
| Caso D | Arranque en frío en `/productos/3` y "Volver" | Sin historial, `replace` a `/productos` | ✅ |

Las tres situaciones de error son distintas: `/categorias/999` coincide con `[id].tsx` pero el registro no existe;
`/productos/abc` coincide con `[id].tsx` pero `leerIdPositivo` devuelve `null` antes de buscar; `/inventario` no
coincide con ningún archivo y lo atiende `+not-found.tsx`.

## Registro de defectos

| Campo | Registro |
|---|---|
| Equipo | Emulador `Medium_Phone_API_37.0`, Android 17 |
| Paso | 24 (primer arranque tras la migración) |
| Esperado | La app abre en el Inicio de Expo Router |
| Observado | Expo Go quedó en su pantalla de inicio; Metro no recibió petición de bundle |
| Hipótesis | `am force-stop` cerró Expo Go justo antes de enviar la URL, que se perdió |
| Prueba | Reenviar `exp://127.0.0.1:8081` con Expo Go abierto |
| Causa demostrada | Metro registró `Android Bundled ... expo-router/entry.js` tras el reenvío |
| Solución | Abrir la URL con Expo Go en ejecución; no es un defecto del código |

Primera prueba del caso D: tras abrir `/inventario` y luego `/productos/3` por deep link, "Volver" regresó a
`/inventario` porque sí había historial (`canGoBack()` verdadero). Es el comportamiento correcto; el caso sin
historial se probó con arranque en frío.

## Qué NO implementa esta guía

Sin Spring Boot, PostgreSQL, autenticación ni persistencia: las pantallas siguen leyendo `demoData.ts`. No hay
Tabs ni Drawer. El deep link externo se probó con la URL de Expo Go (`exp://.../--/ruta`); el esquema `stockflow://`
solo aplicará con una development build.
