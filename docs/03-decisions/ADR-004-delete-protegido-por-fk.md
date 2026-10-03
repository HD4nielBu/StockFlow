# ADR-004 — DELETE físico protegido por las FK, sin `CascadeType`
**Estado:** Aceptada · **Fecha:** 2026-10-03

## Contexto
Borrar una categoría con productos, o un producto con stock y movimientos, destruiría información que el kardex necesita (RN-01, trazabilidad).

## Decisión
- `DELETE /api/categorias/{id}` y `/api/productos/{id}` hacen un borrado físico con `deleteById` + `flush()`.
- Las FK de V1 **no tienen CASCADE**. Si hay filas dependientes, PostgreSQL rechaza el DELETE; el adaptador de persistencia traduce `DataIntegrityViolationException` a una excepción de dominio (`CategoriaConProductosException`, `ProductoEnUsoException`) → **409**.
- Para retirar algo que tiene historia se usa **PUT con `activo = false`**.

## Alternativas consideradas
- **`CascadeType.REMOVE` / `ALL`:** borraría productos (y su historia) en cadena; es una decisión de negocio peligrosa, no un arreglo técnico.
- **Borrado lógico siempre:** más seguro, pero deja registros sin uso que nunca tuvieron historia; se usa sólo cuando hay historia.
- **Preguntar a `product` desde `category` antes de borrar:** daría un mensaje propio, pero crearía una dependencia circular entre módulos.

## Consecuencias
- 204 si no hay dependientes, 404 si no existe, 409 si una FK lo impide. El segundo DELETE del mismo id da 404: el estado del servidor no cambia (idempotencia del efecto).
- El `flush()` adelanta el error de la FK al adaptador, dentro de la transacción del caso de uso.
