-- =====================================================================
-- StockFlow (PA-06) · 03 · Verificaciones y pruebas negativas
-- Ejecutar conectado como stockflow_admin / stockflow
-- Ejecuta cada bloque por separado (Ctrl+Enter en DataGrip).
-- =====================================================================
SET search_path TO stockflow, public;

-- ---------------------------------------------------------------------
-- 1. ¿Dónde estoy? (Cap. 05, paso 4)
-- ---------------------------------------------------------------------
SELECT current_database() AS base_actual,
       current_schema()   AS schema_actual,
       current_user       AS usuario_actual;

-- ---------------------------------------------------------------------
-- 2. Tablas creadas (17) y vistas (1)
-- ---------------------------------------------------------------------
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'stockflow'
ORDER BY table_type, table_name;

-- ---------------------------------------------------------------------
-- 3. Columnas reales de la tabla PADRE y DEPENDIENTE (Cap. 05, paso 9)
-- ---------------------------------------------------------------------
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'stockflow' AND table_name = 'categoria'
ORDER BY ordinal_position;

SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'stockflow' AND table_name = 'producto'
ORDER BY ordinal_position;

-- ---------------------------------------------------------------------
-- 4. Constraints del par 1:N
-- ---------------------------------------------------------------------
SELECT conrelid::regclass AS tabla, conname AS constraint, pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid IN ('stockflow.categoria'::regclass, 'stockflow.producto'::regclass)
ORDER BY tabla, conname;

-- ---------------------------------------------------------------------
-- 5. Prueba de persistencia (Cap. 05/06): lo último guardado desde Spring
-- ---------------------------------------------------------------------
SELECT * FROM categoria ORDER BY categoria_id DESC;
SELECT * FROM producto  ORDER BY producto_id DESC;

-- ---------------------------------------------------------------------
-- 6. JOIN obligatorio del Cap. 07: cada producto apunta a una categoría
-- ---------------------------------------------------------------------
SELECT p.producto_id,
       p.codigo        AS codigo_producto,
       p.nombre        AS producto,
       p.unidad_medida,
       p.categoria_id  AS fk_categoria_id,
       c.categoria_id  AS pk_categoria_id,
       c.codigo        AS codigo_categoria,
       c.nombre        AS categoria
FROM stockflow.producto p
JOIN stockflow.categoria c
  ON c.categoria_id = p.categoria_id
ORDER BY p.producto_id;

-- Productos por categoría (1:N)
SELECT c.codigo, c.nombre, COUNT(p.producto_id) AS productos
FROM categoria c
LEFT JOIN producto p ON p.categoria_id = c.categoria_id
GROUP BY c.categoria_id, c.codigo, c.nombre
ORDER BY c.codigo;

-- ---------------------------------------------------------------------
-- 7. PRUEBAS NEGATIVAS (cada una DEBE fallar)
-- ---------------------------------------------------------------------

-- 7.1 UNIQUE (RN-06): código de producto repetido
INSERT INTO producto (categoria_id, codigo, nombre) VALUES (1, 'PRD-OFI-001', 'Duplicado');

-- 7.2 NOT NULL: producto sin nombre
INSERT INTO producto (categoria_id, codigo, nombre) VALUES (1, 'PRD-XXX-999', NULL);

-- 7.3 FK: producto con categoría inexistente
INSERT INTO producto (categoria_id, codigo, nombre) VALUES (9999, 'PRD-XXX-998', 'Sin categoría');

-- 7.4 CHECK: unidad de medida fuera del dominio
INSERT INTO producto (categoria_id, codigo, nombre, unidad_medida)
VALUES (1, 'PRD-XXX-997', 'Unidad rara', 'BARRIL');

-- 7.5 CHECK: stock mínimo negativo
INSERT INTO producto (categoria_id, codigo, nombre, stock_minimo_default)
VALUES (1, 'PRD-XXX-996', 'Mínimo negativo', -5);

-- 7.6 CHECK (RN-03): stock negativo
UPDATE stock SET cantidad = -1 WHERE stock_id = 1;

-- 7.7 CHECK (RN-02): movimiento con cantidad cero
INSERT INTO movimiento_inventario (producto_id, ubicacion_id, tipo, cantidad, saldo_resultante, usuario_id)
VALUES (1, 1, 'ENTRADA', 0, 10, 1);

-- 7.8 CHECK: tipo de movimiento inválido
INSERT INTO movimiento_inventario (producto_id, ubicacion_id, tipo, cantidad, saldo_resultante, usuario_id)
VALUES (1, 1, 'PRESTAMO', 5, 10, 1);

-- 7.9 CHECK: movimiento con referencia SOLICITUD pero sin solicitud_id
INSERT INTO movimiento_inventario (producto_id, ubicacion_id, tipo, cantidad, saldo_resultante,
                                   usuario_id, referencia_tipo)
VALUES (1, 1, 'SALIDA', 5, 10, 1, 'SOLICITUD');

-- 7.10 UNIQUE: la misma existencia producto+ubicación dos veces
INSERT INTO stock (producto_id, ubicacion_id, cantidad) VALUES (1, 1, 50);

-- 7.11 CHECK (RN-05): estado de solicitud inválido
UPDATE solicitud SET estado = 'EN_TRAMITE' WHERE codigo = 'SOL-2026-0001';

-- 7.12 CHECK (RN-04): transferencia con origen = destino
INSERT INTO transferencia (codigo, ubicacion_origen_id, ubicacion_destino_id, created_by)
VALUES ('TRF-MAL-01', 1, 1, 1);

-- 7.13 CHECK: item de solicitud con cantidad cero
INSERT INTO item_solicitud (solicitud_id, producto_id, cantidad_solicitada) VALUES (1, 3, 0);

-- 7.14 TRIGGER: los movimientos no se eliminan
DELETE FROM movimiento_inventario WHERE movimiento_id = 1;

-- 7.15 FK: no se puede borrar una categoría con productos
DELETE FROM categoria WHERE codigo = 'CAT-OFI';

-- ---------------------------------------------------------------------
-- 8. Flujo crítico: atender la solicitud aprobada de forma transaccional
--    (RN-01 + RN-04 + RF-16: movimiento y stock en una sola transacción)
-- ---------------------------------------------------------------------
BEGIN;

WITH datos AS (
    SELECT i.item_solicitud_id, i.producto_id, i.cantidad_solicitada,
           s.stock_id, s.cantidad AS saldo_actual
    FROM item_solicitud i
    JOIN solicitud so ON so.solicitud_id = i.solicitud_id
    JOIN stock s ON s.producto_id = i.producto_id
                AND s.ubicacion_id = (SELECT ubicacion_id FROM ubicacion WHERE codigo = 'UB-CENTRAL')
    WHERE so.codigo = 'SOL-2026-0001'
)
INSERT INTO movimiento_inventario
    (producto_id, ubicacion_id, tipo, cantidad, saldo_resultante, usuario_id,
     referencia_tipo, solicitud_id, motivo)
SELECT d.producto_id,
       (SELECT ubicacion_id FROM ubicacion WHERE codigo = 'UB-CENTRAL'),
       'SALIDA', d.cantidad_solicitada, d.saldo_actual - d.cantidad_solicitada,
       (SELECT usuario_id FROM usuario WHERE username = 'almacen1'),
       'SOLICITUD',
       (SELECT solicitud_id FROM solicitud WHERE codigo = 'SOL-2026-0001'),
       'Atención de solicitud interna'
FROM datos d;

UPDATE stock s
SET cantidad = s.cantidad - i.cantidad_solicitada,
    updated_at = now()
FROM item_solicitud i
JOIN solicitud so ON so.solicitud_id = i.solicitud_id
WHERE so.codigo = 'SOL-2026-0001'
  AND s.producto_id = i.producto_id
  AND s.ubicacion_id = (SELECT ubicacion_id FROM ubicacion WHERE codigo = 'UB-CENTRAL');

UPDATE item_solicitud i
SET cantidad_atendida = i.cantidad_solicitada
FROM solicitud so
WHERE so.solicitud_id = i.solicitud_id AND so.codigo = 'SOL-2026-0001';

UPDATE solicitud SET estado = 'ATENDIDA', cerrada_at = now()
WHERE codigo = 'SOL-2026-0001';

INSERT INTO historial_estado_solicitud (solicitud_id, estado_anterior, estado_nuevo, motivo, cambiado_por)
VALUES ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'), 'APROBADA', 'ATENDIDA',
        'Salida de almacén', (SELECT usuario_id FROM usuario WHERE username='almacen1'));

COMMIT;

-- ---------------------------------------------------------------------
-- 9. RF-19 · Kardex de un producto
-- ---------------------------------------------------------------------
SELECT * FROM vw_kardex
WHERE codigo_producto = 'PRD-OFI-001'
ORDER BY ocurrido_at, movimiento_id;

-- ---------------------------------------------------------------------
-- 10. RF-20 · Alertas de stock mínimo (por producto/ubicación, RN-07)
-- ---------------------------------------------------------------------
SELECT p.codigo, p.nombre, u.codigo AS ubicacion, s.cantidad, s.stock_minimo
FROM stock s
JOIN producto p  ON p.producto_id = s.producto_id
JOIN ubicacion u ON u.ubicacion_id = s.ubicacion_id
WHERE s.cantidad <= s.stock_minimo
ORDER BY p.codigo;
