# StockFlow Modelo relacional v0.1

## 1. Criterios de transformación
- FK siempre en el lado N de las relaciones 1:N.
- Resoluciones N:M identificadas (Ej. Producto y Solicitud -> ItemSolicitud).

## 2. Tablas candidatas núcleo
### categoria
PK: categoria_id
Atributos: nombre

### producto
PK: producto_id
FK: categoria_id -> categoria.categoria_id
Atributos: codigo (UNIQUE), nombre, stock_minimo

### ubicacion
PK: ubicacion_id
Atributos: nombre, tipo

### stock
PK: stock_id
FK: producto_id -> producto.producto_id
FK: ubicacion_id -> ubicacion.ubicacion_id
Atributos: cantidad

### movimiento_inventario
PK: movimiento_id
FK: producto_id -> producto.producto_id
FK: ubicacion_id -> ubicacion.ubicacion_id
Atributos: tipo_movimiento, cantidad, fecha, referencia

### solicitud
PK: solicitud_id
Atributos: estado, fecha_creacion, solicitante_id

### item_solicitud (Tabla puente N:M)
PK: item_id
FK: solicitud_id -> solicitud.solicitud_id
FK: producto_id -> producto.producto_id
Atributos: cantidad_pedida

## 3. Claves naturales / UNIQUE
- `producto.codigo`: UNIQUE (Regla RN-06).
- `(stock.producto_id, stock.ubicacion_id)`: UNIQUE compuesto. Sólo debe haber un registro de stock por cada par producto/ubicación.
