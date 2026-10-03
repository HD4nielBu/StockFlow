# ADR-003 — Relación Categoría 1:N Producto unidireccional
**Estado:** Aceptada · **Fecha:** 2026-09-29

## Contexto
La FK `producto.categoria_id` materializa la relación 1:N. En JPA puede mapearse sólo desde el hijo (`@ManyToOne`) o en ambos sentidos (`@ManyToOne` + `@OneToMany(mappedBy = "categoria")`).

## Decisión
- Sólo `ProductoJpaEntity` tiene `@ManyToOne(fetch = LAZY, optional = false)` + `@JoinColumn(name = "categoria_id")`. Es el **lado propietario**: el único que Hibernate usa para escribir la FK.
- **No** se agrega `@OneToMany` en `CategoriaJpaEntity`.
- El dominio `Producto` guarda `categoriaId` (un `Long`), no un objeto JPA.

## Alternativas consideradas
- **Bidireccional:** permitiría `categoria.getProductos()`, pero ningún caso de uso lo necesita (para eso existe `GET /api/productos/categoria/{id}`), obligaría a sincronizar ambos lados en memoria (`addProducto`/`removeProducto`), abriría riesgos de N+1 y de recursión al serializar, y crearía un **ciclo de imports** entre `category` y `product`. El Capítulo 05 lo advierte: *"No agregues una colección @OneToMany sólo porque JPA permite hacerlo"*.

## Consecuencias
- La relación existe completa en la base (FK `fk_producto_categoria`); en Java sólo se pierde la navegación padre → hijos.
- `LAZY` + proxy: leer `getCategoria().getId()` no dispara un SELECT, así que listar productos no produce N+1.
- Si en la defensa se pide `mappedBy`: apuntaría al **atributo Java** `categoria` de `ProductoJpaEntity`, no a la columna `categoria_id`.
