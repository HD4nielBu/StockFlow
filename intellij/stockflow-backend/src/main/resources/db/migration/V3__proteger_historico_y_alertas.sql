-- =====================================================================
-- StockFlow (PA-06) · V3 · Endurecer el histórico, unicidad sin mayúsculas y alertas
-- Lo aplica Flyway después de V2. V1 y V2 no se editan: los cambios van aquí.
-- =====================================================================
SET search_path TO stockflow, public;

-- ---------------------------------------------------------------------
-- 1. RN-01: el histórico no sólo no se borra, tampoco se modifica.
--    V1 bloqueaba DELETE; quedaban abiertos UPDATE (reescribir cantidad o saldo
--    y falsear el kardex) y TRUNCATE (vaciar la tabla sin disparar triggers de fila).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_proteger_historico()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Los registros de % no se pueden modificar ni eliminar (trazabilidad, operación %)',
        TG_TABLE_NAME, TG_OP;
END;
$$;

CREATE TRIGGER trg_movimiento_no_update
    BEFORE UPDATE ON movimiento_inventario
    FOR EACH ROW EXECUTE FUNCTION fn_proteger_historico();

CREATE TRIGGER trg_movimiento_no_truncate
    BEFORE TRUNCATE ON movimiento_inventario
    FOR EACH STATEMENT EXECUTE FUNCTION fn_proteger_historico();

CREATE TRIGGER trg_auditoria_no_update
    BEFORE UPDATE ON auditoria
    FOR EACH ROW EXECUTE FUNCTION fn_proteger_historico();

CREATE TRIGGER trg_auditoria_no_truncate
    BEFORE TRUNCATE ON auditoria
    FOR EACH STATEMENT EXECUTE FUNCTION fn_proteger_historico();

CREATE TRIGGER trg_historial_solicitud_no_update
    BEFORE UPDATE ON historial_estado_solicitud
    FOR EACH ROW EXECUTE FUNCTION fn_proteger_historico();

CREATE TRIGGER trg_historial_solicitud_no_truncate
    BEFORE TRUNCATE ON historial_estado_solicitud
    FOR EACH STATEMENT EXECUTE FUNCTION fn_proteger_historico();

-- ---------------------------------------------------------------------
-- 2. Unicidad del nombre de categoría sin distinguir mayúsculas.
--    El backend ya considera "Limpieza" y "LIMPIEZA" duplicados (existsByNombreIgnoreCase);
--    uq_categoria_nombre (V1) sí los distinguía. Este índice alinea la base con la regla.
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX uq_categoria_nombre_ci ON categoria (lower(nombre));

-- ---------------------------------------------------------------------
-- 3. RN-07: como máximo UNA alerta abierta por producto/ubicación.
--    Índice único parcial: sólo aplica a las filas con estado = 'ABIERTA';
--    las alertas RESUELTAS se conservan como historia sin límite.
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX uq_alerta_abierta_producto_ubicacion
    ON alerta_stock (producto_id, ubicacion_id)
    WHERE estado = 'ABIERTA';

-- ---------------------------------------------------------------------
-- 4. RN-07: registrar las alertas que la semilla (V2) ya justificaba.
--    Criterio del glosario: alerta cuando la existencia alcanza o baja del mínimo.
--    En la semilla: Bolígrafo azul en Depósito Norte (25 frente a mínimo 100).
-- ---------------------------------------------------------------------
INSERT INTO alerta_stock (producto_id, ubicacion_id, cantidad_detectada, stock_minimo)
SELECT s.producto_id, s.ubicacion_id, s.cantidad, s.stock_minimo
FROM stock s
WHERE s.cantidad <= s.stock_minimo
  AND NOT EXISTS (SELECT 1
                  FROM alerta_stock a
                  WHERE a.producto_id = s.producto_id
                    AND a.ubicacion_id = s.ubicacion_id
                    AND a.estado = 'ABIERTA');
