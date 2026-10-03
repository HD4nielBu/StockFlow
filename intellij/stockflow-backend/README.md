# stockflow-backend (Capítulos 03 al 07)

Spring Boot 3.5 · Java 21 · Maven · PostgreSQL · Arquitectura hexagonal · Monolito modular

## Par 1:N
| Dato | StockFlow |
|---|---|
| Package base | `com.stockflow` |
| Entidad padre | `Categoria` → tabla `categoria`, PK `categoria_id`, módulo `category` |
| Entidad dependiente | `Producto` → tabla `producto`, PK `producto_id`, módulo `product` |
| FK | `producto.categoria_id` (constraint `fk_producto_categoria`) |
| UNIQUE | `producto.codigo` (RN-06), `categoria.codigo`, `categoria.nombre` |
| CHECK / enum | `producto.unidad_medida` → `UnidadMedida` |
| Base / schema | `stockflow` / `stockflow` |

## Cómo ejecutarlo
1. Desde la raíz del repositorio: `docker compose up -d` (PostgreSQL 16 con la base `stockflow` y el usuario `stockflow_admin`).
   - Sin Docker: ejecuta `datagrip/00_admin_crear_usuario_y_base.sql` en tu PostgreSQL local y sigue en el paso 2.
2. IntelliJ: File > Open > `stockflow-backend` (Maven). SDK Java 21.
3. Si cambiaste la contraseña, crea variables de entorno en Run Configuration:
   `DB_USERNAME=stockflow_admin; DB_PASSWORD=tu_clave`
4. Ejecuta `StockFlowApplication`. **Flyway** aplica `db/migration/V1` (esquema) y `V2` (semilla) la primera vez
   y las registra en `stockflow.flyway_schema_history`; después Hibernate valida el esquema (`ddl-auto: validate`).
5. Abre `requests.http` y ejecuta las peticiones en orden (los POST guardan `{{categoriaId}}` y `{{productoId}}` para los PUT/DELETE).
6. Pruebas unitarias: `ProductoServiceTest` y `CategoriaServiceTest` (no necesitan base de datos).

> **Si tu base ya tenía las tablas creadas a mano en DataGrip**, Flyway se niega a migrar un esquema no vacío
> sin historial. Empieza de cero: `docker compose down -v`, o en tu PostgreSQL local `DROP SCHEMA stockflow CASCADE;`.
>
> **Migraciones:** una migración ya aplicada no se edita (Flyway detecta el cambio por checksum y no arranca).
> Cualquier cambio de esquema va en un archivo nuevo: `V3__descripcion.sql`.

> Si IntelliJ crea el proyecto con otra versión de Spring Boot en tu clase, sólo cambia `<version>` del parent en `pom.xml`.

## Estructura
```
com.stockflow
├── StockFlowApplication.java
├── shared
│   ├── application/ProjectInfoService            (Cap. 03 Bean)
│   ├── domain/exception/ (bases 404 / 409 / 422)
│   └── web/ HealthController, ApiErrorResponse, GlobalExceptionHandler, CorsConfig
├── category                                      (PADRE)
│   ├── domain
│   │   ├── model/Categoria
│   │   ├── exception/ CategoriaNoEncontrada, CategoriaDuplicada, CategoriaInactiva, CategoriaConProductos
│   │   └── port
│   │       ├── in/  Registrar/Consultar/Actualizar/EliminarCategoriaUseCase
│   │       └── out/ CategoriaRepositoryPort
│   ├── application
│   │   ├── CategoriaDemoService                  (Cap. 03: devuelve dominio; el controller arma el DTO)
│   │   └── service/CategoriaService
│   └── infrastructure/adapter
│       ├── in/web/  CategoriaController, CategoriaDemoController, dto/, mapper/
│       └── out/persistence/ CategoriaPersistenceAdapter, entity/, mapper/, repository/
└── product                                       (DEPENDIENTE)
    ├── domain/model/ Producto, UnidadMedida
    ├── domain/exception/ ProductoNoEncontrado, CodigoProductoDuplicado, StockMinimoInvalido, ProductoEnUso
    ├── domain/port/in, out
    ├── application/service/ProductoService
    └── infrastructure/adapter/in/web, out/persistence (@ManyToOne)
```

## Recorrido por capítulo
| Capítulo | Qué quedó implementado |
|---|---|
| 03 | `/api/health`, `ProjectInfoService` inyectado por constructor, `GET /api/categorias/demo` |
| 04 | `CrearCategoriaRequest` / `CategoriaResponse` (records), `@Valid`, `@PathVariable`, `@RequestParam`, 201/200/400/404 |
| 05 | `application.yml` con validate, `CategoriaJpaEntity`, `SpringDataCategoriaRepository`, mapper de persistencia |
| 06 | Port IN / Port OUT, `CategoriaService` implementa los casos de uso, `CategoriaPersistenceAdapter`, controller depende de Ports IN |
| 07 | Módulo `product` hexagonal, `@ManyToOne` + `@JoinColumn(categoria_id)`, validación del padre vía `ConsultarCategoriaUseCase`, `findByCategoria_Id` |
| 08 | `GlobalExceptionHandler` con 400/404/409/422 y `@Transactional` |
| Defensa parcial 1 | PUT y DELETE de categoría y producto, CORS (`CorsConfig`), migraciones Flyway, Docker Compose |

## Contrato HTTP
| Verbo | Ruta | Entrada | Salida | Status |
|---|---|---|---|---|
| GET | /api/health | — | JSON estado | 200 |
| GET | /api/categorias/demo | — | CategoriaDemoResponse | 200 |
| POST | /api/categorias | CrearCategoriaRequest | CategoriaResponse | 201 / 400 / 409 |
| GET | /api/categorias?nombre= | query opcional | List<CategoriaResponse> | 200 |
| GET | /api/categorias/{id} | path variable | CategoriaResponse | 200 / 404 |
| PUT | /api/categorias/{id} | ActualizarCategoriaRequest | CategoriaResponse | 200 / 400 / 404 / 409 |
| DELETE | /api/categorias/{id} | path variable | sin cuerpo | 204 / 404 / 409 (tiene productos) |
| POST | /api/productos | CrearProductoRequest | ProductoResponse | 201 / 400 / 404 / 409 / 422 |
| GET | /api/productos/{id} | path variable | ProductoResponse | 200 / 404 |
| GET | /api/productos/categoria/{categoriaId} | path variable | List<ProductoResponse> | 200 / 404 |
| PUT | /api/productos/{id} | ActualizarProductoRequest | ProductoResponse | 200 / 400 / 404 / 409 / 422 |
| DELETE | /api/productos/{id} | path variable | sin cuerpo | 204 / 404 / 409 (tiene stock o movimientos) |

### Decisiones de PUT y DELETE
- **PUT es un reemplazo completo e idempotente.** El `id` viaja en la ruta, nunca en el cuerpo. Si no existe responde 404: PUT no crea.
- **La unicidad excluye al propio registro** (`existsByCodigoAndIdNot`): editar una categoría sin cambiar su código no da un 409 falso.
- **El PUT usa dirty checking**: el adaptador carga la entidad (`findById`, queda *managed*), la modifica y hace `flush()`.
  Hibernate genera el `UPDATE` sin llamar a `save()`; el `flush` adelanta a ese punto el error de la base (UNIQUE/CHECK).
- **DELETE físico protegido por las FK, sin `CascadeType`.** Borrar una categoría con productos, o un producto con stock
  o movimientos, viola una FK y el adaptador lo traduce a 409. Borrar en cascada destruiría el kardex (RN-01).
  Para retirar algo con historia se usa el PUT con `activo = false`.
- **Una categoría inactiva no admite productos nuevos** (422), tampoco por PUT al cambiar de categoría.
  Un producto que ya estaba en ella sí puede seguir editándose.
- **CORS** (`shared/web/CorsConfig`): sólo los orígenes de `stockflow.cors.allowed-origins`
  (por defecto `http://localhost:5173`, el puerto de Vite). Se cambia con la variable `CORS_ALLOWED_ORIGINS`.

## Recorrido POST /api/productos → PostgreSQL
1. `ProductoController` recibe JSON y `@Valid` revisa formato (400 si falla).
2. `ProductoWebMapper` crea el dominio `Producto` (normaliza el código a mayúsculas).
3. `RegistrarProductoUseCase` → `ProductoService` (`@Transactional`).
4. Pregunta al módulo padre con `ConsultarCategoriaUseCase` (404 si no existe, 422 si está inactiva).
5. Verifica el UNIQUE del código con el Port OUT (409, RN-06).
6. `ProductoPersistenceAdapter` obtiene `getReferenceById(categoriaId)` y guarda `ProductoJpaEntity`.
7. Hibernate ejecuta `INSERT INTO stockflow.producto (...)`; la FK física vuelve a proteger el dato.
8. Se devuelve `201 Created` con `Location` y el JSON.

## Respuestas de defensa rápidas
- **¿Qué regla considera más crítica?** RN-01: el stock sólo cambia por movimientos. En la base está protegida por el trigger que impide borrar movimientos y por los CHECK de cantidad y saldo; en el backend, por la transacción que inserta el movimiento y actualiza el stock juntos.
- **¿Qué restricción existe también en base de datos y por qué no basta con React?** `uq_producto_codigo` (RN-06). El navegador se puede saltar; cualquier cliente (móvil, Postman, script) escribe contra la misma base.
- **¿Por qué el dominio no tiene @Entity?** Para que las reglas no dependan de JPA; si cambia la persistencia sólo cambia `infrastructure`.
- **¿Qué clase conoce el nombre de la tabla?** Sólo `CategoriaJpaEntity` y `ProductoJpaEntity`.
- **¿Por qué @ManyToOne y no @OneToMany?** La FK vive en `producto`; muchos productos apuntan a una categoría.
- **¿Qué significa LAZY?** La categoría no se carga con SELECT hasta que se usa; para leer su id basta el proxy.
- **¿Por qué validate?** El esquema lo define el DDL del grupo; Java se adapta, no al revés.
- **¿Cómo evita el sistema un estado inválido?** Hoy, en la base: `ck_solicitud_estado` limita los valores y `historial_estado_solicitud` deja la traza. El enum Java y la validación de transiciones en el caso de uso todavía **no están implementados** (llegan con el módulo de solicitudes).

## Commits sugeridos
```
git commit -m "feat: bootstrap Spring Boot backend and first REST endpoints"
git commit -m "feat: add REST API and validation for categoria"
git commit -m "feat: conectar backend con PostgreSQL y mapear entidad principal con JPA"
git commit -m "feat: aplicar arquitectura hexagonal a categoria"
git commit -m "feat: implement product relation with category"
git commit -m "feat: agregar PUT y DELETE, CORS, Flyway y Docker Compose"
```
