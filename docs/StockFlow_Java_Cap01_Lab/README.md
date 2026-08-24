# Capítulo 01 - Java esencial (StockFlow)

## Entidades elegidas
- **Tabla padre:** Producto
- **Tabla dependiente:** MovimientoInventario
- **Relación:** 1:N (Un producto puede tener muchos movimientos de inventario)
- **FK:** `movimiento_inventario.producto_id` -> `producto.id`

## Clases Java
- `com.stockflow.producto.domain.Producto`
- `com.stockflow.movimiento.domain.MovimientoInventario`
- `com.stockflow.movimiento.domain.TipoMovimiento` (Enum)

## Regla implementada
- El código del producto no puede estar vacío o ser nulo.
- La cantidad del movimiento siempre debe ser mayor a cero.
- El tipo de movimiento está restringido por un Enum (`ENTRADA`, `SALIDA`, `TRANSFERENCIA`).

## Decisiones
- **¿Por qué usamos enum?** Porque la base de datos restringe los tipos de movimiento mediante un CHECK, lo que se modela perfectamente en Java con un conjunto cerrado de valores, evitando errores de tipeo.
- **¿Por qué la colección es privada?** Para encapsular los movimientos. Sólo la clase `Producto` tiene la responsabilidad de añadir movimientos a su propia colección, validando reglas antes de hacerlo.
- **¿Qué NO implementamos todavía?** Spring Boot, JPA (no hay `@Entity`), ni conexión a PostgreSQL desde Java. Todo se ejecuta en memoria mediante `Main`.