# Diccionario de datos v0.1 StockFlow

| Campo | Significado | Obligatorio | PK/FK/UQ | Dominio/Regla |
|---|---|---|---|---|
| producto.codigo | Identificador SKU de negocio | Sí | UQ | Alfanumérico, no repetible |
| stock.cantidad | Existencia actual del producto | Sí | - | >= 0 (No stock negativo) |
| movimiento.tipo_movimiento | Naturaleza de la transacción | Sí | - | ENTRADA, SALIDA, TRANSFERENCIA |
| movimiento.cantidad | Cantidad afectada | Sí | - | > 0 |
| solicitud.estado | Fase de la petición | Sí | - | BORRADOR, ENVIADA, APROBADA, RECHAZADA, ATENDIDA |
