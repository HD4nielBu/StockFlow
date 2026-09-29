# Plan de Migración V1 — StockFlow (Clase 05)

## Objetivo
Representar el catálogo (categorías, productos, ubicaciones), las existencias, los movimientos que las cambian, las solicitudes internas con su aprobación, las transferencias, las alertas y la trazabilidad.

## Tablas incluidas y orden (por dependencias)
1. usuario (raíz)
2. rol (raíz)
3. usuario_rol (depende de usuario, rol)
4. parametro_sistema (raíz)
5. categoria (raíz)
6. producto (depende de categoria)
7. ubicacion (raíz)
8. stock (depende de producto, ubicacion)
9. solicitud (depende de usuario, ubicacion)
10. item_solicitud (depende de solicitud, producto)
11. aprobacion (depende de solicitud, usuario)
12. transferencia (depende de ubicacion, usuario)
13. transferencia_detalle (depende de transferencia, producto)
14. movimiento_inventario (depende de producto, ubicacion, usuario, solicitud, transferencia)
15. alerta_stock (depende de producto, ubicacion)
16. historial_estado_solicitud (depende de solicitud, usuario)
17. auditoria (depende de usuario)
+ vista `vw_kardex` (depende de movimiento_inventario, producto, ubicacion, usuario)

## Restricciones previstas
- PK: `<tabla>_id` IDENTITY en todas las tablas.
- FK: sin CASCADE; el histórico no se borra en cadena.
- NOT NULL: según diccionario.
- UNIQUE: producto.codigo, categoria.codigo/nombre, ubicacion.codigo, (producto_id, ubicacion_id), (solicitud_id, producto_id), aprobacion.solicitud_id, solicitud.codigo, transferencia.codigo, (usuario_id, rol_id).
- CHECK: cantidades, saldos, estados, tipos, origen ≠ destino, referencia condicional.
- TRIGGER: no se eliminan movimientos, auditoría ni historial.

## Reglas que requerirán lógica posterior
- RN-01 y RF-16: movimiento + recálculo de stock en una transacción.
- RN-04: dos movimientos por transferencia.
- RN-05: validación de transiciones de estado.
- RN-07: generación y cierre de alertas.

## Fuera de V1
- Autenticación real (JWT), Spring AI, reportes agregados materializados.

## Criterio de salida
V1 ejecutado sin errores: 17 tablas + vista en el schema `stockflow` y pruebas negativas fallando como se espera.
