# Backlog Priorizado — StockFlow (PA-06)

**Versión:** 0.1
**Estado:** Borrador inicial (Parte I — Parcial 1)
**Formato de historia:** Como [actor], quiero [necesidad] para [valor].

Prioridades:
- **P0** — Crítico. Forma parte del flujo transaccional principal; sin esto no hay MVP demostrable.
- **P1** — Importante. Necesario para completar el alcance funcional, pero no bloquea la demo del flujo crítico.
- **P2** — Deseable. Mejora la experiencia o cubre casos secundarios; puede quedar para entregas posteriores.

---

## P0 — Flujo crítico y base transaccional

| # | Historia |
|---|---|
| P0-01 | Como **Administrador**, quiero **autenticarme y que el sistema resuelva mis permisos según mi rol**, para **acceder solo a las funciones que me corresponden**. |
| P0-02 | Como **Administrador**, quiero **registrar productos con código único y categoría**, para **tener un catálogo confiable de inventario**. |
| P0-03 | Como **Administrador**, quiero **registrar ubicaciones (almacén central y depósitos)**, para **controlar el stock por lugar físico**. |
| P0-04 | Como **Solicitante interno**, quiero **crear una solicitud de productos con las cantidades que necesito**, para **pedir formalmente lo que requiero sin usar canales informales**. |
| P0-05 | Como **Solicitante interno**, quiero **enviar mi solicitud para aprobación**, para **iniciar el flujo formal de atención**. |
| P0-06 | Como **Supervisor**, quiero **ver las solicitudes pendientes y aprobarlas o rechazarlas**, para **controlar qué se entrega y evitar salidas no autorizadas**. |
| P0-07 | Como **Encargado de almacén**, quiero **atender una solicitud aprobada registrando el movimiento correspondiente**, para **completar la entrega con trazabilidad**. |
| P0-08 | Como **Encargado de almacén**, quiero **que el stock se recalcule automáticamente y de forma transaccional al registrar un movimiento**, para **evitar inconsistencias entre lo físico y lo registrado**. |
| P0-09 | Como **Encargado de almacén**, quiero **que el sistema impida que el stock quede negativo**, para **no comprometer entregas sobre inventario inexistente**. |
| P0-10 | Como **Encargado de almacén**, quiero **registrar una transferencia entre ubicaciones que genere salida en origen y entrada en destino en una sola operación**, para **mover stock sin dejar el inventario en un estado inconsistente**. |
| P0-11 | Como **Administrador**, quiero **consultar el kardex de un producto**, para **auditar su historial completo de movimientos**. |
| P0-12 | Como **Administrador**, quiero **ejecutar toda la aplicación mediante Docker Compose**, para **levantar el entorno de forma reproducible**. |

## P1 — Alcance funcional completo

| # | Historia |
|---|---|
| P1-01 | Como **Administrador**, quiero **gestionar categorías de productos**, para **mantener el catálogo organizado**. |
| P1-02 | Como **Administrador**, quiero **configurar un stock mínimo por producto/ubicación**, para **habilitar alertas automáticas**. |
| P1-03 | Como **Encargado de almacén**, quiero **ver alertas de stock bajo por producto/ubicación**, para **anticipar quiebres de inventario**. |
| P1-04 | Como **Solicitante interno**, quiero **consultar el stock disponible antes de solicitar**, para **pedir cantidades realistas**. |
| P1-05 | Como **Solicitante interno**, quiero **ver el estado de mis solicitudes (enviada, aprobada, rechazada, atendida)**, para **hacer seguimiento sin preguntar directamente**. |
| P1-06 | Como **Solicitante interno**, quiero **aprobar o rechazar solicitudes desde el móvil** *(rol Supervisor)*, para **agilizar decisiones sin depender del escritorio**. |
| P1-07 | Como **Encargado de almacén**, quiero **registrar movimientos desde el móvil de forma autorizada**, para **operar directamente desde el punto de almacenaje**. |
| P1-08 | Como **Administrador**, quiero **consultar reportes de movimientos filtrados por producto, ubicación y fecha**, para **tomar decisiones operativas informadas**. |
| P1-09 | Como **Supervisor**, quiero **ver el historial de aprobaciones que he tomado**, para **justificar mis decisiones ante una auditoría**. |
| P1-10 | Como **cualquier usuario autenticado**, quiero **ver mensajes claros de error y estados de carga/vacío en la interfaz**, para **entender qué está pasando en cada operación**. |
| P1-11 | Como **Administrador**, quiero **que el sistema cuente con pruebas unitarias sobre las reglas críticas (stock negativo, transferencias)**, para **garantizar que no se rompan al evolucionar el código**. |
| P1-12 | Como **Administrador**, quiero **que exista un pipeline de CI que compile y pruebe backend y frontend**, para **detectar errores antes de integrar cambios**. |

## P2 — Mejoras y funciones complementarias

| # | Historia |
|---|---|
| P2-01 | Como **Encargado de almacén**, quiero **escanear un código (QR/manual) al registrar un movimiento**, para **agilizar el registro y reducir errores de tipeo**. |
| P2-02 | Como **Administrador**, quiero **recibir un resumen generado por IA sobre tendencias de movimientos y anomalías**, para **detectar patrones sin revisar manualmente cada reporte**. |
| P2-03 | Como **Solicitante interno**, quiero **recibir notificaciones cuando cambie el estado de mi solicitud**, para **enterarme sin tener que consultar activamente**. |
| P2-04 | Como **Administrador**, quiero **ver un dashboard visual con indicadores de stock bajo y movimientos recientes**, para **tener una vista rápida del estado del inventario**. |
| P2-05 | Como **Supervisor**, quiero **ver un histórico consolidado de solicitudes por solicitante o por período**, para **identificar patrones de consumo interno**. |
| P2-06 | Como **Administrador**, quiero **configurar excepcionalmente si un producto/ubicación puede aceptar stock negativo**, para **cubrir casos especiales de operación**. |
| P2-07 | Como **Encargado de almacén**, quiero **adjuntar observaciones a un movimiento**, para **documentar circunstancias no estándar de una entrada o salida**. |

---

## Notas de priorización

- El **P0** cubre exactamente el flujo crítico oficial del proyecto: *Solicitante crea solicitud → Supervisor aprueba → Almacén atiende mediante movimiento → Stock se actualiza → Kardex y alerta reflejan el resultado*, más lo mínimo indispensable para que ese flujo sea persistente y reproducible (auth, catálogos base, Docker).
- El **P1** completa el alcance funcional exigido para la Parte III (Parcial 2): módulos restantes, reportes, CI, pruebas y experiencia móvil ampliada.
- El **P2** agrupa funciones que aportan valor pero no son bloqueantes para ninguna entrega crítica, incluyendo la función de Spring AI (uso acotado y opcional según el documento oficial).
