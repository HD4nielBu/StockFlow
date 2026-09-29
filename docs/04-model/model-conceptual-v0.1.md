# StockFlow — Modelo conceptual v0.1 (Clase 02)

Proyecto oficial: **PA-06 · StockFlow — Inventario, Compras Internas y Movimientos de Almacén**
Frontera: sin tablas, sin SQL, sin JPA.

## 1. Inventario conceptual

| Candidato | Clasificación | ¿Por qué? | Fuente |
|---|---|---|---|
| Categoria | Entidad (catálogo) | Agrupa productos; se configura y se consulta. | F, RF-06 |
| Producto | Entidad | Tiene código único, unidad de medida y datos propios. | RN-06, RF-05 |
| Ubicacion | Entidad | Almacén central y dos depósitos con identidad propia. | A, RF-07 |
| Stock | Entidad | Existencia de un producto EN una ubicación; tiene cantidad y mínimo. | RN-01, RN-07, RF-08 |
| MovimientoInventario | Entidad (evento) | Única forma de cambiar el stock; se conserva para el kardex. | RN-01, RN-02, RF-09 |
| Solicitud | Entidad | Pedido interno con ciclo de estados. | RN-05, RF-10 |
| ItemSolicitud | Entidad asociativa | Una solicitud pide varios productos; un producto aparece en muchas solicitudes. | RF-10 |
| Aprobacion | Entidad (evento) | Decisión del supervisor sobre una solicitud. | RF-12, RF-18 |
| Transferencia | Entidad | Traslado entre ubicaciones; genera dos movimientos. | RN-04, RF-11 |
| AlertaStock | Entidad | Se registra cuando la existencia baja del mínimo. | RN-07, RF-13, RF-20 |
| Usuario / Rol | Entidad | Cuentas y permisos de los actores. | C, RF-01 |
| Auditoria | Entidad | Traza de quién hizo qué y cuándo. | RF-04 |
| Administrador, Encargado, Solicitante, Supervisor | Actor / Rol | Filas de Rol, no tablas independientes. | C |
| Estado de solicitud / tipo de movimiento | Estado / dominio | Conjunto cerrado de valores, no entidad. | RN-05, RN-02 |
| Kardex | Resultado derivado | Se construye leyendo los movimientos; no se guarda aparte. | RF-19 |
| Reporte / Dashboard | Resultado derivado | Consulta agregada. | RF-14, RF-17 |
| Contabilidad, facturación | Fuera de alcance | Excluido explícitamente. | RN-08 |

## 2. Atributos conceptuales (núcleo)
- **Categoria**: código (único), nombre (único), descripción, activo.
- **Producto**: código (único, RN-06), nombre, descripción, unidad de medida, stock mínimo por defecto, precio referencial, activo.
- **Ubicacion**: código (único), nombre, tipo, dirección, activo.
- **Stock**: cantidad, stock mínimo; identificado por producto + ubicación.
- **MovimientoInventario**: tipo, cantidad (> 0), saldo resultante, fecha, usuario, referencia.
- **Solicitud**: código, solicitante, ubicación destino, estado, justificación, fechas.
- **ItemSolicitud**: cantidad solicitada, cantidad atendida.
- **Aprobacion**: decisión, comentario, supervisor, fecha.
- **Transferencia**: código, origen, destino, estado, motivo.
- **AlertaStock**: cantidad detectada, mínimo, estado, fechas.

## 3. Relaciones y cardinalidades
| Relación | Frase del negocio | Cardinalidad |
|---|---|---|
| **Categoria – Producto** | **Una categoría agrupa muchos productos; cada producto pertenece a una categoría.** | **1 : N (par elegido)** |
| Producto – Stock | Un producto tiene una existencia por cada ubicación donde se guarda. | 1 : N |
| Ubicacion – Stock | Una ubicación guarda muchos productos. | 1 : N |
| Producto – MovimientoInventario | Un producto acumula muchos movimientos. | 1 : N |
| Ubicacion – MovimientoInventario | Cada movimiento ocurre en una ubicación. | 1 : N |
| Solicitud – ItemSolicitud | Una solicitud tiene varias líneas. | 1 : N |
| Producto – ItemSolicitud | Un producto se pide en muchas solicitudes. | 1 : N |
| Solicitud – Aprobacion | Una solicitud recibe como máximo una decisión. | 1 : 0..1 |
| Solicitud – MovimientoInventario | Atender una solicitud genera movimientos. | 1 : 0..N |
| Transferencia – TransferenciaDetalle | Una transferencia mueve varios productos. | 1 : N |
| Transferencia – MovimientoInventario | Una transferencia genera salida y entrada. | 1 : N |
| Producto/Ubicacion – AlertaStock | Las alertas se calculan por producto y ubicación. | 1 : N |
| Usuario – Rol | Un usuario tiene varios roles y un rol varios usuarios. | N : M (UsuarioRol) |
| Usuario – Solicitud/Movimiento/Aprobacion | Toda operación queda atribuida a un usuario. | 1 : N |

## 4. Reglas de integridad conceptuales
- RN-01: el stock sólo cambia mediante movimientos válidos.
- RN-02: todo movimiento tiene tipo, cantidad positiva, fecha, usuario y referencia.
- RN-03: no se permite stock negativo (parámetro del sistema en FALSE por defecto).
- RN-04: una transferencia produce salida en origen y entrada en destino en la misma transacción.
- RN-05: las solicitudes siguen BORRADOR → ENVIADA → APROBADA/RECHAZADA → ATENDIDA/CANCELADA.
- RN-06: los productos tienen código único.
- RN-07: las alertas de mínimo se calculan por producto/ubicación.
- RN-08: no hay contabilidad ni facturación.

## 5. Dudas / decisiones
- D-01: ¿El mínimo vive en Producto o en Stock? **Decisión:** ambos; Producto guarda un valor por defecto y Stock el mínimo real por ubicación (RN-07).
- D-02: ¿El kardex es tabla? **Decisión:** no, es una vista sobre los movimientos (RF-19).
- D-03: ¿La solicitud descuenta stock al aprobarse? **Decisión:** no; sólo al atenderla con un movimiento (RN-01).

## 6. Par 1:N seleccionado para el backend (Cap. 01–07)
**Categoria (padre) 1 : N Producto (dependiente)**, porque es la relación estructural del catálogo y sostiene el resto del sistema (stock, movimientos, solicitudes).
