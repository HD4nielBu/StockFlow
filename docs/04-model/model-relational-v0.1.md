# StockFlow — Modelo relacional v0.1 (Clase 03)

## 1. Fuente
- Proyecto oficial: PA-06 · StockFlow
- Modelo conceptual base: model-conceptual-v0.1.md
- Flujo crítico: Solicitante crea solicitud → supervisor aprueba → almacén atiende mediante movimiento → stock se actualiza → kardex y alerta reflejan el resultado.

## 2. Criterios de transformación
- 1:N → FK en el lado N.
- N:M → tabla puente (item_solicitud, transferencia_detalle, usuario_rol).
- PK técnica `<tabla>_id`; claves naturales como UNIQUE.
- Los datos derivados (kardex, alertas calculadas) no se duplican como columnas.

## 3. Tablas candidatas núcleo
### categoria
Propósito: agrupación del catálogo.
- categoria_id [PK] · codigo [UQ] · nombre [UQ] · descripcion · activo

### producto
Propósito: artículo que se almacena y se mueve.
- producto_id [PK] · categoria_id [FK → categoria] · codigo [UQ] · nombre · unidad_medida · stock_minimo_default · precio_referencial · activo

### ubicacion
- ubicacion_id [PK] · codigo [UQ] · nombre · tipo · direccion · activo

### stock
Propósito: existencia de un producto en una ubicación.
- stock_id [PK] · producto_id [FK] · ubicacion_id [FK] · cantidad · stock_minimo · UQ (producto_id, ubicacion_id)

### movimiento_inventario
Propósito: evento que cambia el stock.
- movimiento_id [PK] · producto_id [FK] · ubicacion_id [FK] · tipo · cantidad · saldo_resultante · usuario_id [FK] · referencia_tipo · solicitud_id [FK opc.] · transferencia_id [FK opc.] · ocurrido_at

### solicitud / item_solicitud
- solicitud_id [PK] · codigo [UQ] · solicitante_id [FK] · ubicacion_destino_id [FK] · estado · enviada_at · cerrada_at
- item_solicitud_id [PK] · solicitud_id [FK] · producto_id [FK] · cantidad_solicitada · cantidad_atendida · UQ (solicitud_id, producto_id)

### aprobacion / transferencia / transferencia_detalle / alerta_stock
- aprobacion_id [PK] · solicitud_id [FK, UQ] · supervisor_id [FK] · decision · comentario
- transferencia_id [PK] · codigo [UQ] · ubicacion_origen_id [FK] · ubicacion_destino_id [FK] · estado
- transferencia_detalle_id [PK] · transferencia_id [FK] · producto_id [FK] · cantidad · UQ (transferencia_id, producto_id)
- alerta_id [PK] · producto_id [FK] · ubicacion_id [FK] · cantidad_detectada · stock_minimo · estado

## 4. Relaciones
- categoria 1:N producto — RN-06, RF-05/06
- producto 1:N stock y ubicacion 1:N stock — RF-08
- producto 1:N movimiento_inventario — RN-01, RF-09
- solicitud 1:N item_solicitud — RF-10
- solicitud 1:0..1 aprobacion — RF-12
- transferencia 1:N transferencia_detalle — RN-04

## 5. Relaciones N:M
- solicitud N:M producto → **item_solicitud** (atributos propios: cantidad_solicitada, cantidad_atendida)
- transferencia N:M producto → **transferencia_detalle** (atributo propio: cantidad)
- producto N:M ubicacion → **stock** (atributos propios: cantidad, stock_minimo)
- usuario N:M rol → **usuario_rol**

## 6. Claves naturales / UNIQUE candidatas
- producto.codigo — RN-06 lo exige explícitamente.
- categoria.codigo y categoria.nombre — evitan catálogos duplicados.
- ubicacion.codigo — identificador operativo del almacén.
- (producto_id, ubicacion_id) en stock — una sola existencia por par.
- solicitud.codigo, transferencia.codigo — códigos visibles.
- aprobacion.solicitud_id — una decisión por solicitud.

## 7. Optionalidad
- producto.categoria_id **obligatoria**: no hay producto sin clasificación.
- movimiento.solicitud_id / transferencia_id **opcionales**: hay movimientos manuales.
- solicitud.enviada_at **opcional** mientras está en BORRADOR.
- aprobacion.comentario **obligatorio sólo si RECHAZADA**.

## 8. Reglas iniciales de integridad
- cantidad de movimiento > 0 (RN-02); stock ≥ 0 (RN-03).
- estados dentro de su conjunto permitido (RN-05).
- origen ≠ destino en transferencias (RN-04).

## 9. Decisiones pendientes
- ¿El saldo resultante se guarda en el movimiento o se recalcula? **Decisión provisional:** se guarda, para que el kardex sea reproducible sin recorrer toda la historia.

## 10. Revisión de normalización
- Listas multivaluadas: los productos pedidos no se guardan como texto → item_solicitud.
- Columnas repetitivas: no existe producto1/producto2 en solicitud.
- Redundancia: el nombre del producto no se copia en stock ni en movimiento; se obtiene por la FK.
