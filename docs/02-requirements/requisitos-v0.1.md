# Catálogo de requisitos — StockFlow (PA-06)

**Versión:** 0.1
**Fuente:** Banco Oficial de Proyectos 2026-2, ficha PA-06 (sección G, requisitos funcionales) y sección 5 (requisitos no funcionales comunes).
**Estado al:** 2026-10-17 (rama `Hector`).

Leyenda de estado: ✅ implementado y probado · ⚠️ parcial · ❌ pendiente · 🗄️ resuelto sólo en la base de datos (script SQL), todavía no en la aplicación.

---

## 1. Requisitos funcionales (RF)

| ID | Requisito (ficha PA-06) | Reglas | Estado | Dónde está / qué falta |
|---|---|---|---|---|
| RF-01 | Autenticar usuarios y resolver permisos según el rol vigente. | — | ❌ | Tablas `usuario`, `rol`, `usuario_rol` existen (V1). Sin login ni autorización en el backend (Parte III). |
| RF-02 | Consultar listados con filtros relevantes y mensajes claros cuando no hay resultados. | — | ✅ | API: `GET /api/categorias?nombre=`, `/api/ubicaciones?tipo=`, `/api/inventario/stock?productoId=&ubicacionId=&soloBajoMinimo=`, `/api/productos/categoria/{id}`. Web: búsqueda, filtros (categoría en la URL, estado) y paginación en Categorías, Productos y Existencias, con `EmptyState` "sin resultados" distinto del error. |
| RF-03 | Validar datos obligatorios en cliente y servidor; el backend es la autoridad final. | RN-06 | ⚠️ | Servidor: `@Valid` en todos los DTO (400), reglas en los casos de uso (404/409/422), constraints en PostgreSQL. Web: `productoValidation`, `categoriaValidation`, `ubicacionValidation` antes de enviar, y los `fieldErrors` del backend se muestran junto a cada campo. Falta el cliente móvil. |
| RF-04 | Registrar fecha/usuario en las operaciones que cambian el estado de un proceso. | RN-02, RN-05 | 🗄️ | Columnas `usuario_id`, `ocurrido_at`, `cambiado_por`, `cambiado_at`, `created_at/updated_at`. Sin usuario autenticado en el backend todavía. |
| RF-05 | Módulo de productos: crear, consultar, actualizar o transicionar. | RN-06 | ✅ | `product`: POST, GET, GET por categoría, PUT, DELETE (`/api/productos`). |
| RF-06 | Módulo de categorías. | — | ✅ | `category`: POST, GET, GET por id, PUT, DELETE (`/api/categorias`). |
| RF-07 | Módulo de ubicaciones. | — | ⚠️ | `location`: POST, GET, GET por id (`/api/ubicaciones`); regla de almacén central único. Web: pantalla Almacenes (listar y crear). Falta actualizar/desactivar (API y web). |
| RF-08 | Módulo de stock. | RN-01, RN-03 | ⚠️ | `inventory`: consulta de existencias por producto/ubicación (`/api/inventario/stock`). El stock no se edita directamente (RN-01); su alta y cambio llegan con los movimientos. |
| RF-09 | Módulo de movimientos. | RN-01, RN-02, RN-03 | 🗄️ | Tabla y CHECK en V1; triggers de inmutabilidad (V1, V3). Sin caso de uso (Parte II). |
| RF-10 | Módulo de solicitudes internas. | RN-05 | 🗄️ | Tablas `solicitud`, `item_solicitud`, `historial_estado_solicitud`. Sin caso de uso. |
| RF-11 | Módulo de transferencias. | RN-04 | 🗄️ | Tablas `transferencia`, `transferencia_detalle`, CHECK origen ≠ destino. Sin caso de uso. |
| RF-12 | Módulo de aprobaciones. | RN-05 | 🗄️ | Tabla `aprobacion` (1:0..1 con solicitud). Sin caso de uso. |
| RF-13 | Módulo de alertas. | RN-07 | ⚠️ | Consulta de existencias bajo mínimo (`soloBajoMinimo=true`); tabla `alerta_stock` con una alerta abierta por producto/ubicación (V3). Web: campana de alertas del Header y filtro "bajo mínimo" en Existencias. Falta gestionar alertas (resolver) desde la API. |
| RF-14 | Módulo de reportes. | — | ⚠️ | Web: exportaciones CSV generadas en el navegador (productos, categorías, existencias). Faltan reportes de movimientos desde el backend (Parte IV). |
| RF-15 | Impedir stock negativo. | RN-03 | 🗄️ | `ck_stock_no_negativo`, `ck_movimiento_saldo`, parámetro `PERMITIR_STOCK_NEGATIVO`. Falta la validación en el caso de uso de movimientos. |
| RF-16 | Registrar movimiento y recalcular stock de forma transaccional. | RN-01 | 🗄️ | Demostrado en `datagrip/03_verificacion_y_pruebas.sql` (sección 8, idempotente). Falta el caso de uso `@Transactional` (Parte II). |
| RF-17 | Transferir entre ubicaciones sin inconsistencias. | RN-04 | ❌ | Sólo CHECK origen ≠ destino. |
| RF-18 | Aprobar una solicitud y atenderla. | RN-05 | 🗄️ | Demostrado en SQL (sección 8). Sin caso de uso. |
| RF-19 | Consultar kardex. | RN-01 | ✅ | `GET /api/inventario/kardex/{productoId}` paginado sobre `vw_kardex` (`@Query` nativo). Web: pantalla Movimientos, paginada en el servidor. |
| RF-20 | Mostrar alertas de mínimos. | RN-07 | ✅ | `GET /api/inventario/stock?soloBajoMinimo=true`. Web: Inicio, Dashboard, Existencias y campana del Header. Falta el móvil. |

**Resumen:** 5 ✅ · 5 ⚠️ · 8 🗄️ · 2 ❌.

---

## 2. Requisitos no funcionales (RNF)

Los quince RNF son comunes a los diez proyectos del banco. La columna "En StockFlow" concreta cómo se aplican aquí.

| ID | Área | Requisito (banco) | En StockFlow | Estado |
|---|---|---|---|---|
| RNF-01 | Usabilidad | Navegación consistente, mensajes de error claros, estados de carga y validaciones visibles. | Web: navegación por menú lateral y migas, estados de carga (esqueletos), error con "Reintentar", vacío, confirmación antes de borrar y errores por campo. Falta el móvil. | ⚠️ |
| RNF-02 | Seguridad | Autenticación y autorización por roles; contraseñas nunca en texto plano; el backend valida permisos. | `usuario.password_hash` (hash, nunca texto plano). Sin login ni autorización todavía. | ❌ |
| RNF-03 | Integridad | PK, FK, UNIQUE, NOT NULL, CHECK e índices; reglas críticas no dependen de la UI. | 17 tablas con constraints nombradas, triggers de histórico, índices justificados (V1, V3). | ✅ |
| RNF-04 | Mantenibilidad | Monolito modular hexagonal; código por módulos y casos de uso. | Módulos `category`, `product`, `location`, `inventory`, `shared`; Ports IN/OUT. Ver ADR-001. | ✅ |
| RNF-05 | Calidad | Pruebas unitarias de reglas críticas y de integración para repositorios/endpoints. | Backend: 60 pruebas (dominio, casos de uso, `@WebMvcTest` y Testcontainers con PostgreSQL). Web: 107 pruebas con Vitest y Testing Library (lógica, componentes, hooks, services, páginas y cliente HTTP). Faltan las reglas de movimientos (aún no implementadas). | ⚠️ |
| RNF-06 | Trazabilidad | Registrar usuario, fecha y cambio de estado. | Columnas de auditoría e historial en la base; falta el usuario autenticado en el backend. | ⚠️ |
| RNF-07 | API | API prefijada o versionada; códigos HTTP correctos; DTO de entrada/salida; errores consistentes. | Prefijo `/api`; `record` DTO; `ApiErrorResponse` único (400/404/409/422/500). Ver ADR-006. | ✅ |
| RNF-08 | Web | React + TypeScript, sin `any`, componentes reutilizables, formularios tipados, API centralizada. | `webstorm/stockflow-frontend`: React 19 + TypeScript (strict), `apiClient` único, services y hooks por módulo, componentes en `components/ui`, formularios tipados (`FormData` → `Request`). | ✅ |
| RNF-09 | Móvil | React Native + TypeScript con navegación, autenticación, API y un flujo transaccional completo. | Pendiente. | ❌ |
| RNF-10 | DevOps | Docker Compose levanta al menos PostgreSQL y backend; CI compila y prueba backend y frontend. | `docker-compose.yml` levanta PostgreSQL; `nginx.conf` del frontend (fallback SPA y proxy de `/api/`). Falta el backend y el frontend en Compose (Dockerfile) y el pipeline de CI. | ⚠️ |
| RNF-11 | Configuración | Secretos por variables de entorno; sin credenciales reales versionadas. | `DB_*` y `CORS_ALLOWED_ORIGINS` por entorno; `.env`, `credenciales.env` y `application-local.yml` ignorados. | ✅ |
| RNF-12 | Documentación | README ejecutable, decisiones, modelo de datos, catálogo de API, pruebas y despliegue. | README raíz y del backend, `docs/03-decisions`, `docs/04-model`, Swagger (`/swagger-ui.html`). Falta manual de despliegue. | ⚠️ |
| RNF-13 | Rendimiento | Paginación donde el volumen crezca; sin N+1 evidente en flujos críticos. | Kardex paginado; `@ManyToOne(LAZY)` + proxy evita N+1 al listar productos. Falta paginar el listado de productos. | ⚠️ |
| RNF-14 | Observabilidad | Logging básico, manejo global de errores, correlación para diagnosticar una petición. | `GlobalExceptionHandler` con log de errores inesperados; SQL visible en desarrollo. Falta id de correlación. | ⚠️ |
| RNF-15 | IA responsable | Spring AI complementario, auditable, con fallback. | Parte IV (examen final). | — |

---

## 3. Trazabilidad mínima requisito → endpoint → prueba

| Requisito | Endpoint | Prueba automática (backend) | Pantalla web · prueba frontend |
|---|---|---|---|
| RF-05 / RN-06 | `POST /api/productos` (409 si el código existe) | `ProductoServiceTest.rechazaCodigoDuplicadoRN06`, `ProductoControllerTest.post409SiElCodigoEstaRepetido` | Productos · `productoValidation.test.ts` |
| RF-05 | `PUT /api/productos/{id}` | `ProductoServiceTest` (8 casos de PUT), `ProductoControllerTest.put422…` | Productos · `ProductosPage.test.tsx` (422 al guardar) |
| RF-05 / RN-01 | `DELETE /api/productos/{id}` (409 si tiene stock) | `PersistenciaPostgresTest.eliminarProductoConStockLanzaConflictoDeDominio` | Productos (aviso de stock en el diálogo) |
| RF-06 | `DELETE /api/categorias/{id}` (409 si tiene productos) | `CategoriaServiceTest`, `PersistenciaPostgresTest.eliminarCategoriaConProductos…` | Categorías · `CategoriasPage.test.tsx` (409 conserva la fila) |
| RF-07 | `POST /api/ubicaciones` (409 segundo almacén central) | `UbicacionServiceTest.rechazaUnSegundoAlmacenCentral` | Almacenes · `AlmacenesPage.test.tsx`, `ubicacionValidation.test.ts` |
| RF-19 | `GET /api/inventario/kardex/{productoId}` | `PersistenciaPostgresTest.kardexPaginadoLeeLaVistaYCalculaElTotal` | Movimientos · `InventarioPages.test.tsx`, `useKardex.test.ts`, `inventarioService.test.ts` |
| RF-20 / RN-07 | `GET /api/inventario/stock?soloBajoMinimo=true` | `PersistenciaPostgresTest.soloBajoMinimoDevuelveElBoligrafoDelDepositoNorte` | Existencias, Dashboard · `indicadores.test.ts` |
| RN-01 | (base de datos) | `PersistenciaPostgresTest.v3ImpideModificarUnMovimiento` | — |
