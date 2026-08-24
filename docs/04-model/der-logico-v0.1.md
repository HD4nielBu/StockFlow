# DER lógico v0.1 StockFlow

## Convenciones
PK = clave primaria
FK = clave foránea
UQ = unicidad
NN = obligatorio

## categoria
PK categoria_id
NN nombre

## producto
PK producto_id
FK categoria_id -> categoria.categoria_id
NN codigo
UQ codigo
NN nombre

## ubicacion
PK ubicacion_id
NN nombre

## stock
PK stock_id
FK producto_id -> producto.producto_id
FK ubicacion_id -> ubicacion.ubicacion_id
NN cantidad
UQ (producto_id, ubicacion_id)
CHECK cantidad >= 0

## movimiento_inventario
PK movimiento_id
FK producto_id -> producto.producto_id
FK ubicacion_id -> ubicacion.ubicacion_id
NN tipo_movimiento
NN cantidad
CHECK cantidad > 0

## Reglas trazadas a constraints
- RN-03: `CHECK (cantidad >= 0)` en tabla stock.
- RN-06: `UQ (codigo)` en tabla producto.
- RN-02: `CHECK (cantidad > 0)` en tabla movimiento_inventario.
