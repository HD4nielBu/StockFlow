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
1. En DataGrip ejecuta `datagrip/00`, luego `V1` y `V2` (conexión stockflow_admin → stockflow).
2. IntelliJ: File > Open > `stockflow-backend` (Maven). SDK Java 21.
3. Si cambiaste la contraseña, crea variables de entorno en Run Configuration:
   `DB_USERNAME=stockflow_admin; DB_PASSWORD=tu_clave`
4. Ejecuta `StockFlowApplication`. Hibernate valida el esquema (`ddl-auto: validate`).
5. Abre `requests.http` y ejecuta las peticiones en orden.
6. Pruebas unitarias: `ProductoServiceTest` (no necesita base de datos).

> Si IntelliJ crea el proyecto con otra versión de Spring Boot en tu clase, sólo cambia `<version>` del parent en `pom.xml`.

## Estructura
```
com.stockflow
├── StockFlowApplication.java
├── shared
│   ├── application/ProjectInfoService            (Cap. 03 Bean)
│   ├── domain/exception/ (bases 404 / 409 / 422)
│   └── web/ HealthController, ApiErrorResponse, GlobalExceptionHandler
├── category                                      (PADRE)
│   ├── domain
│   │   ├── model/Categoria
│   │   ├── exception/ CategoriaNoEncontrada, CategoriaDuplicada, CategoriaInactiva
│   │   └── port
│   │       ├── in/  RegistrarCategoriaUseCase, ConsultarCategoriaUseCase
│   │       └── out/ CategoriaRepositoryPort
│   ├── application
│   │   ├── CategoriaDemoService                  (Cap. 03)
│   │   └── service/CategoriaService
│   └── infrastructure/adapter
│       ├── in/web/  CategoriaController, CategoriaDemoController, dto/, mapper/
│       └── out/persistence/ CategoriaPersistenceAdapter, entity/, mapper/, repository/
└── product                                       (DEPENDIENTE)
    ├── domain/model/ Producto, UnidadMedida
    ├── domain/exception/ ProductoNoEncontrado, CodigoProductoDuplicado, StockMinimoInvalido
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
| (08 adelanto) | `GlobalExceptionHandler` con 400/404/409/422 y `@Transactional` |

## Contrato HTTP
| Verbo | Ruta | Entrada | Salida | Status |
|---|---|---|---|---|
| GET | /api/health | — | JSON estado | 200 |
| GET | /api/categorias/demo | — | CategoriaDemoResponse | 200 |
| POST | /api/categorias | CrearCategoriaRequest | CategoriaResponse | 201 / 400 / 409 |
| GET | /api/categorias?nombre= | query opcional | List<CategoriaResponse> | 200 |
| GET | /api/categorias/{id} | path variable | CategoriaResponse | 200 / 404 |
| POST | /api/productos | CrearProductoRequest | ProductoResponse | 201 / 400 / 404 / 409 / 422 |
| GET | /api/productos/{id} | path variable | ProductoResponse | 200 / 404 |
| GET | /api/productos/categoria/{categoriaId} | path variable | List<ProductoResponse> | 200 / 404 |

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
- **¿Cómo evita el sistema un estado inválido?** Los estados de solicitud tienen CHECK en base, enum en Java y validación de transición en el caso de uso; el historial deja la traza.

## Commits sugeridos
```
git commit -m "feat: bootstrap Spring Boot backend and first REST endpoints"
git commit -m "feat: add REST API and validation for categoria"
git commit -m "feat: conectar backend con PostgreSQL y mapear entidad principal con JPA"
git commit -m "feat: aplicar arquitectura hexagonal a categoria"
git commit -m "feat: implement product relation with category"
```
