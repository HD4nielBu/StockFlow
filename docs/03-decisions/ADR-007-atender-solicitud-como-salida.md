# ADR-007 — Atender una solicitud es una SALIDA del almacén central para consumo
**Estado:** Aceptada · **Fecha:** 2026-10-03

## Contexto
`solicitud.ubicacion_destino_id` indica a dónde se entregan los materiales. En la semilla, `SOL-2026-0001` tiene destino `UB-DEP-SUR`, que no tiene filas de stock. Había que decidir si atender la solicitud mueve stock al destino.

## Decisión
- Atender una solicitud registra una **`SALIDA` en el almacén central** por cada ítem (`referencia_tipo = 'SOLICITUD'`). Los materiales se **consumen** en el área solicitante.
- `ubicacion_destino_id` es información de entrega, no genera una `ENTRADA`.
- Mover stock entre almacenes es otro proceso: la **transferencia** (RN-04), que sí genera salida en origen y entrada en destino.

## Alternativas consideradas
- **Salida en el central + entrada en el destino:** convertiría cada solicitud en una transferencia y mezclaría dos procesos con reglas distintas.

## Consecuencias
- El flujo de `03_verificacion_y_pruebas.sql` (sección 8) y el futuro caso de uso siguen esta regla.
- Si el cliente necesitara abastecer depósitos por solicitud, se haría con una transferencia vinculada.
