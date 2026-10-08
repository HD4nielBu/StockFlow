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
| P1-06 | Como **Supervisor**, quiero **aprobar o rechazar solicitudes desde el móvil**, para **agilizar decisiones sin depender del escritorio**. |
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

## Criterios de aceptación

Formato: **Dado** (contexto) · **Cuando** (acción) · **Entonces** (resultado verificable). Cada criterio indica la regla o requisito que protege y el estado al 2026-10-03.

### P0 — Flujo crítico

| Historia | Criterios de aceptación | Trazabilidad | Estado |
|---|---|---|---|
| P0-01 Autenticación por rol | 1. Dado un usuario activo con credenciales válidas, cuando inicia sesión, entonces obtiene una sesión/token con su rol. 2. Dadas credenciales inválidas, entonces recibe 401 sin indicar cuál dato falló. 3. Dado un Solicitante, cuando invoca una operación de Supervisor, entonces recibe 403 aunque la UI oculte el botón. 4. Las contraseñas se guardan sólo como hash. | RF-01, RNF-02 | ❌ |
| P0-02 Registrar productos | 1. Dado un código nuevo y una categoría activa, cuando registro el producto, entonces responde 201 con `Location` y el código queda en mayúsculas. 2. Dado un código existente (sin importar mayúsculas), entonces 409 (RN-06). 3. Dada una categoría inexistente, 404; inactiva, 422. 4. Dado un campo obligatorio vacío o un stock mínimo negativo, entonces 400 con el error por campo. 5. El precio se devuelve con 2 decimales. | RF-05, RN-06, RN-07 | ✅ |
| P0-03 Registrar ubicaciones | 1. Dado un código nuevo, cuando registro una ubicación, entonces 201 y tipo `DEPOSITO` si no se indica. 2. Dado un código existente, 409. 3. Dado que ya existe un almacén central activo, cuando registro otro `ALMACEN_CENTRAL`, entonces 409. 4. Puedo listar filtrando por tipo. | RF-07 | ✅ |
| P0-04 Crear solicitud | 1. Dado un Solicitante, cuando crea una solicitud con al menos un ítem de cantidad > 0, entonces queda en `BORRADOR` con un código `SOL-AAAA-NNNN`. 2. Un mismo producto no puede repetirse en la solicitud. 3. Una solicitud sin ítems no puede enviarse. | RF-10, RN-05 | ❌ (🗄️ en SQL) |
| P0-05 Enviar solicitud | 1. Dada una solicitud en `BORRADOR` del propio solicitante, cuando la envía, entonces pasa a `ENVIADA` con `enviada_at` y queda una fila en el historial. 2. Desde cualquier otro estado, el envío se rechaza (422). | RF-10, RN-05, RF-04 | ❌ |
| P0-06 Aprobar o rechazar | 1. Dada una solicitud `ENVIADA`, cuando el Supervisor la aprueba, entonces pasa a `APROBADA` con supervisor y fecha. 2. Rechazar exige comentario. 3. Una solicitud sólo tiene una decisión. 4. Sin stock suficiente se puede aprobar, pero la pantalla muestra el disponible. | RF-12, RF-18, RN-05 | ❌ (🗄️) |
| P0-07 Atender solicitud | 1. Dada una solicitud `APROBADA` con stock suficiente, cuando el Encargado la atiende, entonces se registra una `SALIDA` por ítem con referencia a la solicitud, el stock baja y la solicitud pasa a `ATENDIDA`, todo en una transacción. 2. Si falla un ítem, no queda nada a medias. 3. Atender dos veces la misma solicitud no descuenta dos veces. | RF-16, RF-18, RN-01, RN-02 | ❌ (🗄️ demostrado en `03_verificacion`, sección 8) |
| P0-08 Stock transaccional | 1. Todo cambio de stock tiene un movimiento con tipo, cantidad > 0, fecha, usuario y referencia. 2. `saldo_resultante` coincide con el stock después del movimiento. 3. No existe endpoint para editar el stock directamente. 4. Un movimiento no se puede borrar ni modificar. | RF-16, RN-01, RN-02 | ⚠️ (3 y 4 ✅: stock de sólo lectura, triggers V1/V3) |
| P0-09 Sin stock negativo | 1. Dada una salida mayor que el stock disponible, cuando se registra, entonces se rechaza (422) y el stock no cambia. 2. Sólo si `PERMITIR_STOCK_NEGATIVO = TRUE` se admite. | RF-15, RN-03 | ⚠️ (protegido en la base; falta el caso de uso) |
| P0-10 Transferencia | 1. Dada una transferencia de A a B, cuando se confirma, entonces existe una `TRANSFERENCIA_SALIDA` en A y una `TRANSFERENCIA_ENTRADA` en B en la misma transacción. 2. Origen = destino se rechaza. 3. Si la salida falla, no se registra la entrada. | RF-17, RN-04 | ❌ |
| P0-11 Kardex | 1. Dado un producto, cuando consulto su kardex, entonces veo sus movimientos en orden cronológico con entrada, salida, saldo, ubicación y usuario. 2. La consulta está paginada. 3. Un producto inexistente da 404. | RF-19 | ✅ |
| P0-12 Docker Compose | 1. Con `docker compose up -d` y arrancar el backend, la base queda creada por migraciones sin pasos manuales. 2. Compose levanta también el backend (RNF-10). | RNF-10 | ⚠️ (1 ✅, 2 pendiente) |

### P1 — Historias ya iniciadas

| Historia | Criterios de aceptación | Estado |
|---|---|---|
| P1-01 Gestionar categorías | 1. Alta (201), edición completa con PUT (200, idempotente, sin 409 falso por su propio código o nombre), baja (204). 2. No se puede eliminar una categoría con productos (409); se desactiva con `activo = false`. 3. El nombre es único sin distinguir mayúsculas. | ✅ |
| P1-02 Stock mínimo por producto/ubicación | 1. Cada existencia tiene su `stock_minimo` (por defecto el del producto). 2. Puedo consultarlo junto a la cantidad actual. | ⚠️ (consulta ✅; configuración pendiente) |
| P1-03 Ver alertas de stock bajo | 1. Dada una existencia en o bajo su mínimo, cuando consulto las alertas, entonces aparece. 2. No se duplican alertas abiertas para el mismo producto/ubicación. | ⚠️ (backend ✅: `soloBajoMinimo=true`; falta UI) |

## Notas de priorización

- El **P0** cubre exactamente el flujo crítico oficial del proyecto: *Solicitante crea solicitud → Supervisor aprueba → Almacén atiende mediante movimiento → Stock se actualiza → Kardex y alerta reflejan el resultado*, más lo mínimo indispensable para que ese flujo sea persistente y reproducible (auth, catálogos base, Docker).
- El **P1** completa el alcance funcional exigido para la Parte III (Parcial 2): módulos restantes, reportes, CI, pruebas y experiencia móvil ampliada.
- El **P2** agrupa funciones que aportan valor pero no son bloqueantes para ninguna entrega crítica, incluyendo la función de Spring AI (uso acotado y opcional según el documento oficial).
