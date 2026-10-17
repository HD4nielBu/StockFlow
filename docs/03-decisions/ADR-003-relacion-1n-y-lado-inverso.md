# ADR-003 — Relación Categoría 1:N Producto: lado propietario y lado inverso de sólo lectura
**Estado:** Aceptada · **Fecha:** 2026-09-29 · **Revisada:** 2026-10-03

## Contexto
La FK `producto.categoria_id` (constraint `fk_producto_categoria`, NOT NULL) materializa la relación 1:N. En JPA se puede mapear sólo desde el hijo (`@ManyToOne`, unidireccional) o en ambos sentidos (`@ManyToOne` + `@OneToMany(mappedBy = ...)`, bidireccional).

La versión inicial (2026-09-29) era **unidireccional**. El banco de preguntas del parcial 1 pide mostrar en el propio código el lado propietario, el nombre exacto del campo `mappedBy` y la `@JoinColumn` (pregunta 30, CRÍTICA), y predecir qué pasa si se elimina `mappedBy` (desafío 2). Por eso se revisó la decisión.

## Decisión
- **Lado propietario:** `ProductoJpaEntity.categoria` con `@ManyToOne(fetch = LAZY, optional = false)` + `@JoinColumn(name = "categoria_id")`. Es el **único** que Hibernate usa para escribir la FK.
- **Lado inverso:** `CategoriaJpaEntity.productos` con `@OneToMany(mappedBy = "categoria")`. `"categoria"` es el **atributo Java** del lado propietario, no la columna `categoria_id`.
- El lado inverso es **de sólo lectura**:
  - sin `cascade` (borrar o guardar una categoría no propaga nada a sus productos, ver ADR-004);
  - sin `orphanRemoval` (un producto no se borra por salir de la lista; cambia de categoría con el PUT de producto, que actualiza su propia FK);
  - sin setters ni helpers `addProducto`/`removeProducto`; `getProductos()` devuelve una lista inmodificable;
  - ningún mapper ni DTO lo usa: la API no cambia.
- El dominio `Producto` sigue guardando sólo `categoriaId` (un `Long`).

## Alternativas consideradas
- **Seguir unidireccional:** era suficiente para los casos de uso (para listar existe `GET /api/productos/categoria/{id}`), y el Capítulo 05 advierte *"No agregues una colección @OneToMany sólo porque JPA permite hacerlo"*. Se descartó porque el proyecto debe poder demostrar `mappedBy` en la defensa.
- **Bidireccional completa** (con `cascade`, `orphanRemoval` y helpers de sincronización): agrega comportamiento que el negocio no quiere (borrar productos con historia) y obliga a mantener los dos lados sincronizados en memoria.

## Consecuencias
- La relación ya existía completa en la base; ahora también se puede navegar de categoría a productos en Java (`categoria.getProductos()`), sólo dentro de una transacción.
- **LAZY:** `@OneToMany` es LAZY por defecto; la colección sólo se consulta al recorrerla (`SELECT ... FROM producto WHERE categoria_id = ?`). `@ManyToOne` es EAGER por defecto y aquí se configuró LAZY explícitamente.
- **Sin recursión JSON:** las entidades nunca se serializan; la API expone records DTO.
- **Acoplamiento:** `category` (infraestructura) ahora importa `ProductoJpaEntity`, además de que `product` ya importaba `CategoriaJpaEntity`: hay un **ciclo entre módulos a nivel de entidades JPA**. Queda confinado a infraestructura (dominio y casos de uso no lo ven) y es el primer acoplamiento a deshacer si se extrae `product` como servicio (ADR-001).
- Prueba: `PersistenciaPostgresTest.ladoInversoMappedByLeeLosProductosATravesDeLaFkYEsLazy`.

## Errores reales comprobados en este proyecto (2026-10-03)
| Cambio | Resultado al arrancar |
|---|---|
| `mappedBy = "categoria_id"` (nombre de la columna) | `AnnotationException: Collection '...CategoriaJpaEntity.productos' is 'mappedBy' a property named 'categoria_id' which does not exist in the target entity '...ProductoJpaEntity'` |
| Quitar `mappedBy` | Hibernate trata `@OneToMany` como un segundo lado propietario y espera una tabla intermedia: `Schema-validation: missing table [categoria_productos]` (gracias a `ddl-auto: validate`) |
| Quitar `@JoinColumn` | Hibernate infiere el nombre por defecto (atributo + `_` + PK del padre): `Schema-validation: missing column [categoria_categoria_id] in table [stockflow.producto]` |

En los tres casos la aplicación **no arranca**: el error aparece al construir el `EntityManagerFactory`, antes de atender cualquier petición. Por eso lo detecta una prueba de integración y nunca una prueba unitaria del servicio.
