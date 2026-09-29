-- =====================================================================
-- StockFlow (PA-06) · V2 · Datos semilla mínimos
-- Ejecutar DESPUÉS de V1, conectado como stockflow_admin / stockflow
-- Los password_hash son de EJEMPLO (no son contraseñas reales).
-- Incluye el flujo crítico: solicitud -> aprobación -> movimiento -> stock.
-- =====================================================================
SET search_path TO stockflow, public;

BEGIN;

-- Parámetros (RN-03: stock negativo deshabilitado por defecto)
INSERT INTO parametro_sistema (clave, valor, descripcion) VALUES
 ('PERMITIR_STOCK_NEGATIVO', 'FALSE', 'RN-03: por defecto no se permite stock negativo'),
 ('DIAS_ALERTA_REVISION',    '7',     'Frecuencia sugerida de revisión de alertas');

-- Roles (actores de la ficha, sección C)
INSERT INTO rol (codigo, nombre, descripcion) VALUES
 ('ADMINISTRADOR',      'Administrador',        'Configura catálogos, usuarios y parámetros'),
 ('ENCARGADO_ALMACEN',  'Encargado de almacén', 'Registra movimientos y atiende solicitudes'),
 ('SOLICITANTE',        'Solicitante interno',  'Crea y consulta solicitudes internas'),
 ('SUPERVISOR',         'Supervisor',           'Aprueba o rechaza solicitudes');

-- Usuarios
INSERT INTO usuario (username, email, password_hash, nombre_completo) VALUES
 ('admin',      'admin@stockflow.bo',      '$2a$10$HASH.DE.EJEMPLO.admin',      'Administrador General'),
 ('almacen1',   'almacen1@stockflow.bo',   '$2a$10$HASH.DE.EJEMPLO.almacen',    'Marcos Villarroel'),
 ('solicita1',  'solicita1@stockflow.bo',  '$2a$10$HASH.DE.EJEMPLO.solicita',   'Daniela Ortiz'),
 ('supervisor', 'supervisor@stockflow.bo', '$2a$10$HASH.DE.EJEMPLO.supervisor', 'Rubén Camacho');

INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.usuario_id, r.rol_id
FROM usuario u
JOIN rol r ON (u.username, r.codigo) IN (
    ('admin','ADMINISTRADOR'), ('almacen1','ENCARGADO_ALMACEN'),
    ('solicita1','SOLICITANTE'), ('supervisor','SUPERVISOR'));

-- Categorías (entidad padre)
INSERT INTO categoria (codigo, nombre, descripcion) VALUES
 ('CAT-OFI', 'Material de oficina', 'Papelería y útiles'),
 ('CAT-LIM', 'Limpieza',            'Insumos de limpieza e higiene'),
 ('CAT-EPP', 'Seguridad industrial','Equipos de protección personal'),
 ('CAT-TEC', 'Tecnología',          'Consumibles y accesorios informáticos');

-- Productos (entidad dependiente) · RN-06 código único
INSERT INTO producto (categoria_id, codigo, nombre, unidad_medida, stock_minimo_default, precio_referencial) VALUES
 ((SELECT categoria_id FROM categoria WHERE codigo='CAT-OFI'), 'PRD-OFI-001', 'Resma papel bond A4 75g', 'PAQUETE',  20,  38.50),
 ((SELECT categoria_id FROM categoria WHERE codigo='CAT-OFI'), 'PRD-OFI-002', 'Bolígrafo azul',          'UNIDAD',  100,   2.50),
 ((SELECT categoria_id FROM categoria WHERE codigo='CAT-LIM'), 'PRD-LIM-001', 'Detergente líquido 5L',   'LITRO',    10,  75.00),
 ((SELECT categoria_id FROM categoria WHERE codigo='CAT-EPP'), 'PRD-EPP-001', 'Guantes de nitrilo',      'CAJA',     15,  95.00),
 ((SELECT categoria_id FROM categoria WHERE codigo='CAT-TEC'), 'PRD-TEC-001', 'Tóner negro HP 85A',      'UNIDAD',    5, 420.00);

-- Ubicaciones (un almacén central y dos depósitos, como pide la ficha)
INSERT INTO ubicacion (codigo, nombre, tipo, direccion) VALUES
 ('UB-CENTRAL', 'Almacén central',    'ALMACEN_CENTRAL', 'Parque Industrial Mz 8'),
 ('UB-DEP-NOR', 'Depósito Norte',     'DEPOSITO',        'Av. Banzer km 9'),
 ('UB-DEP-SUR', 'Depósito Sur',       'DEPOSITO',        'Av. Santos Dumont 6to anillo');

-- Stock inicial por producto/ubicación
INSERT INTO stock (producto_id, ubicacion_id, cantidad, stock_minimo)
SELECT p.producto_id, u.ubicacion_id,
       CASE WHEN u.codigo = 'UB-CENTRAL' THEN 120 ELSE 25 END,
       p.stock_minimo_default
FROM producto p
CROSS JOIN ubicacion u
WHERE u.codigo IN ('UB-CENTRAL','UB-DEP-NOR');

-- Movimiento de carga inicial (RN-01: el stock sólo cambia por movimientos)
INSERT INTO movimiento_inventario
    (producto_id, ubicacion_id, tipo, cantidad, saldo_resultante, usuario_id, referencia_tipo, motivo)
SELECT s.producto_id, s.ubicacion_id, 'ENTRADA', s.cantidad, s.cantidad,
       (SELECT usuario_id FROM usuario WHERE username='almacen1'), 'MANUAL', 'Carga inicial (semilla)'
FROM stock s;

-- ---------------------------------------------------------------------
-- Flujo crítico de ejemplo: solicitud -> aprobación -> atención
-- ---------------------------------------------------------------------
INSERT INTO solicitud (codigo, solicitante_id, ubicacion_destino_id, estado, justificacion, enviada_at)
VALUES ('SOL-2026-0001',
        (SELECT usuario_id FROM usuario WHERE username='solicita1'),
        (SELECT ubicacion_id FROM ubicacion WHERE codigo='UB-DEP-SUR'),
        'APROBADA', 'Reposición mensual de oficina', now());

INSERT INTO item_solicitud (solicitud_id, producto_id, cantidad_solicitada, cantidad_atendida) VALUES
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'),
  (SELECT producto_id FROM producto WHERE codigo='PRD-OFI-001'), 10, 0),
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'),
  (SELECT producto_id FROM producto WHERE codigo='PRD-OFI-002'), 30, 0);

INSERT INTO aprobacion (solicitud_id, supervisor_id, decision, comentario) VALUES
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'),
  (SELECT usuario_id FROM usuario WHERE username='supervisor'), 'APROBADA', 'Dentro del presupuesto');

INSERT INTO historial_estado_solicitud (solicitud_id, estado_anterior, estado_nuevo, motivo, cambiado_por) VALUES
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'), NULL, 'BORRADOR', 'Creación',
  (SELECT usuario_id FROM usuario WHERE username='solicita1')),
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'), 'BORRADOR', 'ENVIADA', 'Envío a supervisión',
  (SELECT usuario_id FROM usuario WHERE username='solicita1')),
 ((SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'), 'ENVIADA', 'APROBADA', 'Aprobada por supervisor',
  (SELECT usuario_id FROM usuario WHERE username='supervisor'));

INSERT INTO auditoria (usuario_id, entidad, entidad_id, accion, detalle) VALUES
 ((SELECT usuario_id FROM usuario WHERE username='supervisor'), 'solicitud',
  (SELECT solicitud_id FROM solicitud WHERE codigo='SOL-2026-0001'), 'APROBAR', '{"origen":"semilla"}');

COMMIT;

-- Resumen
SELECT 'categoria' AS tabla, COUNT(*) FROM categoria
UNION ALL SELECT 'producto', COUNT(*) FROM producto
UNION ALL SELECT 'ubicacion', COUNT(*) FROM ubicacion
UNION ALL SELECT 'stock', COUNT(*) FROM stock
UNION ALL SELECT 'movimiento_inventario', COUNT(*) FROM movimiento_inventario
UNION ALL SELECT 'solicitud', COUNT(*) FROM solicitud;
