# Glosario del Dominio — StockFlow (PA-06)

**Versión:** 0.1
**Estado:** Borrador inicial (Parte I — Parcial 1)

---

## Entidades principales

| Término | Definición |
|---|---|
| **Producto** | Ítem gestionable en el inventario. Tiene un código único, pertenece a una categoría y puede tener stock en una o varias ubicaciones. |
| **Categoría** | Clasificación que agrupa productos con características o tratamiento similar (ej. herramientas, insumos, repuestos). |
| **Ubicación** | Lugar físico donde se almacena stock: el almacén central o uno de los dos depósitos. |
| **Stock** | Cantidad disponible de un producto en una ubicación específica. No se edita directamente; solo cambia como consecuencia de un movimiento válido. |
| **Movimiento (MovimientoInventario)** | Registro auditable de un cambio de stock: entrada, salida o transferencia. Siempre incluye tipo, cantidad positiva, fecha, usuario y referencia. |
| **Transferencia** | Tipo particular de movimiento que traslada stock de una ubicación origen a una ubicación destino, generando una salida y una entrada dentro de una misma transacción lógica. |
| **Solicitud** | Petición formal de un Solicitante interno para obtener productos del almacén. Sigue un flujo de estados hasta ser atendida o cancelada. |
| **Ítem de solicitud (ItemSolicitud)** | Línea de detalle dentro de una solicitud: producto solicitado y cantidad requerida. |
| **Aprobación** | Decisión (aprobar/rechazar) que un Supervisor registra sobre una solicitud, con trazabilidad de quién y cuándo la tomó. |
| **Alerta de stock (AlertaStock)** | Notificación generada automáticamente cuando el stock de un producto en una ubicación cae por debajo del mínimo configurado. |
| **Kardex** | Historial cronológico de movimientos de un producto, usado para auditar y reconstruir su trazabilidad. |

## Estados del dominio

| Término | Definición |
|---|---|
| **BORRADOR** | Estado inicial de una solicitud, aún no enviada para aprobación. |
| **ENVIADA** | La solicitud fue remitida y está pendiente de decisión del Supervisor. |
| **APROBADA** | El Supervisor autorizó la solicitud; queda pendiente de ser atendida por almacén. |
| **RECHAZADA** | El Supervisor no autorizó la solicitud; el flujo termina en este estado. |
| **ATENDIDA** | El Encargado de almacén completó la entrega/movimiento asociado a la solicitud aprobada. |
| **CANCELADA** | La solicitud fue anulada antes de completarse (por el solicitante o por administración). |

## Reglas y conceptos asociados

| Término | Definición |
|---|---|
| **Stock negativo** | Situación en la que el stock de un producto/ubicación cae por debajo de cero. Está prohibida por defecto (RN-03); solo se permite si el proyecto habilita una configuración explícita. |
| **Transaccionalidad** | Propiedad que garantiza que operaciones compuestas (como una transferencia) se completen íntegramente o no se apliquen en absoluto, evitando estados inconsistentes de stock. |
| **Trazabilidad** | Capacidad del sistema de registrar y reconstruir quién hizo qué, cuándo y sobre qué recurso (movimientos, aprobaciones, cambios de estado). |
| **Referencia** | Dato que vincula un movimiento con su origen (por ejemplo, la solicitud que lo generó), necesario para auditar el porqué de cada cambio de stock. |
| **Stock mínimo** | Umbral configurado por producto/ubicación que, al ser alcanzado o superado hacia abajo, dispara una alerta. |

## Actores (referencia rápida)

| Término | Definición |
|---|---|
| **Administrador** | Configura catálogos, usuarios y parámetros; supervisa la operación completa. |
| **Encargado de almacén** | Ejecuta movimientos y atiende solicitudes aprobadas. |
| **Solicitante interno** | Crea y da seguimiento a solicitudes de productos. |
| **Supervisor** | Aprueba o rechaza solicitudes internas. |
