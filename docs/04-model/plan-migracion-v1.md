# Plan de Migración V1 StockFlow

## Objetivo
Implementar el núcleo del inventario que soporta creación de productos, ubicaciones y gestión de stock.

## Tablas incluidas y orden
1. `categoria` (Sin dependencias)
2. `ubicacion` (Sin dependencias)
3. `producto` (Depende de categoria)
4. `stock` (Depende de producto, ubicacion)
5. `movimiento_inventario` (Depende de producto, ubicacion)

## Restricciones previstas
- PK en todas las tablas (`id`).
- FK en las relaciones documentadas.
- UQ: `producto.codigo`, `(stock.producto_id, stock.ubicacion_id)`.
- CHECK: `stock.cantidad >= 0`, `movimiento.cantidad > 0`.

## Fuera de V1
- Solicitudes internas y Aprobaciones.
- Transferencias complejas (tabla específica).
- Alertas (cálculo dinámico).
