# Rediseño del frontend de StockFlow

Fecha de cierre: 9 de octubre de 2026 · Alcance: sólo `webstorm/stockflow-frontend` (no se tocó el backend,
las migraciones, Docker ni los contratos REST).

## 1. Resumen

StockFlow pasó de tres pantallas (Inicio, Categorías, Productos) con formularios fijos en la página a una
aplicación de administración completa con 13 rutas, modo claro y oscuro, diseño responsive y una biblioteca de
componentes propia. Los CRUD de Categoría y Producto siguen funcionando contra el backend; se agregaron
Existencias, Movimientos (kardex), Almacenes y Reportes con **datos reales**, y Usuarios, Perfil y parte de
Configuración como vistas **demostrativas rotuladas**.

Regla seguida en todo el proyecto: **ninguna cifra inventada se presenta como real**. Lo que no tiene endpoint
lleva la etiqueta *Demo* y sus acciones explican que no están disponibles en lugar de aparentar que guardan.

## 2. Qué es real y qué es demo

| Módulo | Origen de los datos | Notas |
|---|---|---|
| Inicio, Dashboard | Real (derivado) | Indicadores calculados en el navegador con `/categorias`, `/productos` e `/inventario/stock` |
| Categorías, Productos | Real | CRUD completo; Productos muestra el stock real sumado por ubicación |
| Existencias | Real | Sólo lectura: la API no permite registrar movimientos |
| Movimientos | Real | Kardex paginado en el servidor |
| Almacenes | Real | Listar y crear; la API no tiene editar ni eliminar |
| Reportes | Real | CSV generados en el navegador; 3 reportes marcados "No disponible" |
| Alertas del header | Real | `GET /inventario/stock?soloBajoMinimo=true` (no son notificaciones simuladas) |
| Login | **Demo** | Sin verificación de credenciales; la espera de "Entrar" comprueba `GET /health` |
| Perfil | **Demo** | Nombre y correo guardados sólo en el navegador |
| Usuarios | **Demo** | Personas ficticias; los 4 roles son los de la semilla V2 del backend |
| Configuración | Mixto | Tema y estado de la API reales; datos de la organización demo y bloqueados |

Criterios que son **de la interfaz, no del backend** (y así se indica en pantalla):

- "Cerca del mínimo" = hasta 1,5 × el stock mínimo (`FACTOR_CERCA_MINIMO`).
- "Últimos productos registrados" se ordena por `id`, porque la API no expone fecha de alta.
- "Valor referencial" = Σ cantidad × precio referencial, sin moneda ni costo contable.
- Las cantidades no se suman entre productos (mezclarían cajas con litros): por ubicación se cuentan productos.

## 3. Design system

- **Tokens** en `src/styles/tokens.css`, con nombres semánticos (`--surface`, `--text-muted`, `--accent`…). El modo
  oscuro sólo redefine valores. El tema se aplica antes del primer pintado (script en `index.html`) para evitar destellos.
- **Identidad**: azul marino `#17365D` reservado a la sidebar y la marca; azul `#2563EB` sólo para acciones;
  neutros *slate*; Inter variable con base de 14 px y cifras tabulares en columnas.
- **Colores de estado** (verde / ámbar / rojo) validados con el script de daltonismo de la skill de visualización;
  siempre van con icono + texto, nunca solos.
- **Componentes** en `src/components/ui/`: Button, Field/Input/Select/Textarea, Checkbox, Switch, PasswordInput,
  Modal, ConfirmDialog, Toast, Dropdown, Popover, Tooltip, Tabs, DataTable (tabla → tarjetas en móvil), Pagination,
  SegmentedControl, SearchInput, Badge, DemoBadge, StatCard, BarList, StatusBar, Meter, Skeleton, EmptyState,
  PageHeader, RowActions, UnavailableButton.
- **Movimiento**: curvas *ease-out* fuertes, menos de 300 ms, sólo `transform`/`opacity`, sin `transition: all`,
  hover limitado a dispositivos con puntero. Con `prefers-reduced-motion` se eliminan desplazamientos y se
  conservan fundidos de 150 ms.

## 4. Fases realizadas

| Fase | Contenido |
|---|---|
| 1 | Diagnóstico de UI/UX y del backend (endpoints disponibles) |
| 2 | Tokens claro/oscuro, biblioteca de componentes, sidebar contraíble + cajón móvil, header con breadcrumbs, búsqueda de secciones, tema, alertas y menú de usuario |
| 3 | Inicio, Dashboard, Categorías y Productos: modales, menú de acciones, toasts, skeletons, filtros, paginación, errores 400/404/409/422 |
| 4 | Acceso en modo demostración y Perfil |
| 5 | Existencias, Movimientos, Almacenes, Reportes, Usuarios (demo) y Configuración |
| 6 | División del código por rutas, auditoría de accesibilidad, contraste, responsive y movimiento |
| 7 | Regresión funcional y visual completa, documentación |

## 5. Verificación (resultados del 9/10/2026)

| Prueba | Resultado |
|---|---|
| `npm run lint` (oxlint) | Sin avisos |
| `npm run build` | Correcto. Bundle inicial 299 kB (95 kB gzip); páginas en chunks de 5–13 kB |
| `npm run test:run` | **96 pruebas en 27 archivos, todas pasan** (eran 28 al empezar; no se eliminó ninguna) |
| Regresión E2E contra el backend real | **27/27 pasos**: login demo, layout, CRUD de categoría y producto, 409 reales, filtros por URL, kardex, dashboard, CSV, salida. Los registros de prueba se crean y eliminan en el propio recorrido |
| Red durante el E2E | Sólo los dos 409 provocados a propósito; ningún otro 4xx/5xx |
| Consola durante el E2E | Sin errores de JavaScript |
| Accesibilidad (axe-core 4.10, WCAG 2.1 AA + buenas prácticas) | **0 violaciones** en 12 rutas × 2 temas y en estados abiertos (modal, menú, popover, toast, errores) |
| Contraste de tokens | Todos los pares de texto ≥ 4,5:1 en ambos temas |
| Responsive (390 / 768 / 1024 / 1440 px) | **48/48** combinaciones sin scroll horizontal |
| Teclado | Foco visible en todas las paradas; menús, pestañas y modales con el patrón WAI-ARIA |

## 6. Limitaciones conocidas

- Los menús desplegables se renderizan en un portal fuera de los *landmarks* (aviso de buenas prácticas de axe,
  no un criterio WCAG). Es necesario para que las tablas con scroll no los recorten.
- Los *placeholders* usan un gris claro (2,56:1); WCAG no lo exige porque no es contenido.
- Lighthouse no pudo ejecutarse (las herramientas MCP no encuentran Chrome); se usó axe-core, el motor de reglas de
  accesibilidad que usa Lighthouse.
- Durante el desarrollo el servidor de Vite dejó de detectar un cambio de archivo y sirvió una versión antigua. Si
  la interfaz no refleja un cambio, reiniciar `npm run dev`.

## 7. Qué necesita el backend para completar las vistas demo

| Para… | Endpoint sugerido |
|---|---|
| Login real | `POST /auth/login` (+ refresh/logout) y un usuario autenticado (`GET /auth/me`) |
| Usuarios | `GET/POST/PUT /usuarios`, `GET /roles` (las tablas ya existen en V1/V2) |
| Registrar movimientos | `POST /inventario/movimientos` (entrada, salida, ajuste, transferencia) |
| Editar ubicaciones | `PUT /ubicaciones/{id}` y desactivación |
| Reportes por período | `GET /inventario/movimientos?desde&hasta` |
| Configuración | `GET/PUT /configuracion` (organización, moneda, zona horaria) |
| Dashboard con mucho volumen | Un endpoint agregado (totales y conteos) en lugar de descargar todas las colecciones |
| "Últimos productos" exactos | Incluir `createdAt` en `ProductoResponse` |

También convendría que el mensaje del 409 de categorías no mencione detalles técnicos ("desactívala con PUT
(activo = false)"), porque llega tal cual a la persona usuaria.

Cuando exista cada endpoint, el cambio en el frontend es local: un `service` nuevo en la feature y reemplazar la
fuente demo. La interfaz ya está construida con los mismos modelos.
