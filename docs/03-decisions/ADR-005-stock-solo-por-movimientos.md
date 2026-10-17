# ADR-005 — El stock es de sólo lectura y cambia sólo por movimientos
**Estado:** Aceptada · **Fecha:** 2026-10-03

## Contexto
RN-01: "El stock no se edita directamente; cambia únicamente mediante movimientos válidos". RN-02 exige que cada movimiento tenga tipo, cantidad positiva, fecha, usuario y referencia.

## Decisión
- **Base de datos:** `stock` tiene CHECK de no negativo; `movimiento_inventario` guarda `saldo_resultante`; los triggers impiden **borrar** (V1) y **modificar o truncar** (V3) movimientos, auditoría e historial.
- **Backend:** no existe endpoint para crear o editar stock. `StockJpaEntity` es `@Immutable` (Hibernate nunca genera UPDATE sobre `stock`). El módulo `inventory` sólo consulta existencias y kardex.
- El caso de uso que insertará el movimiento y actualizará el stock **en una misma transacción** (`SELECT ... FOR UPDATE`, validación de RN-03) se implementará en la Parte II, siguiendo la secuencia ya demostrada en `datagrip/03_verificacion_y_pruebas.sql`.

## Alternativas consideradas
- **Calcular el stock sumando movimientos en cada consulta:** sin redundancia, pero lento a medida que crece la historia.
- **CRUD de stock:** contradice RN-01.

## Consecuencias
- El kardex es reproducible y no se puede falsear desde la aplicación ni con SQL de usuario (salvo un superusuario que desactive triggers).
- Corregir un error de carga requiere un movimiento de ajuste (`AJUSTE_POSITIVO`/`AJUSTE_NEGATIVO`), nunca editar el movimiento original.
