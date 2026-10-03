# Decisiones de integridad v0.1 — StockFlow (Clase 04)

| RN/RF | Regla | Protección prevista | Justificación |
|---|---|---|---|
| RN-01 | El stock sólo cambia por movimientos | Backend transaccional: INSERT movimiento + UPDATE stock juntos; trigger que impide borrar movimientos | Afecta dos tablas |
| RN-02 | Movimiento con tipo, cantidad > 0, fecha, usuario y referencia | NOT NULL + CHECK cantidad > 0 + CHECK referencia | Una sola fila |
| RN-03 | Sin stock negativo | CHECK cantidad >= 0 y saldo_resultante >= 0 + parámetro PERMITIR_STOCK_NEGATIVO | Fila + configuración |
| RN-04 | Transferencia = salida + entrada | CHECK origen ≠ destino + transacción en el backend | Varias filas |
| RN-05 | Estados de solicitud | CHECK del dominio + historial_estado_solicitud + validación de transición en backend | El CHECK no sabe cuál era el estado anterior |
| RN-06 | Código de producto único | UNIQUE producto.codigo | Una columna |
| RN-07 | Alertas por producto/ubicación | stock.stock_minimo NOT NULL + tabla alerta_stock + cálculo en backend | Comparación entre columnas |
| RN-08 | Sin contabilidad | Decisión de alcance: no existen tablas de facturación | Fuera de alcance |
| RF-04 | Fecha/usuario en cambios de estado | NOT NULL en usuario/fecha de movimiento, aprobación e historial | — |

## Prueba de contradicción
| Regla | Estado inválido posible | Protección |
|---|---|---|
| RN-03 | Salida de 200 unidades cuando hay 120 | ck_stock_no_negativo + validación previa en el caso de uso |
| RN-06 | Dos productos "PRD-OFI-001" | uq_producto_codigo |
| RN-02 | Movimiento con cantidad 0 o negativa | ck_movimiento_cantidad |
| RN-05 | Solicitud pasa de BORRADOR a ATENDIDA sin aprobación | Validación de transición + historial_estado_solicitud |
| RN-04 | Transferencia de UB-CENTRAL a UB-CENTRAL | ck_transferencia_ubicaciones |
| RN-01 | Alguien edita stock a mano sin movimiento | Sólo el caso de uso escribe stock; el movimiento queda como evidencia y no se puede borrar |
