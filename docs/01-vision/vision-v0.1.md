# Visión del Proyecto — StockFlow (PA-06)

**Versión:** 0.1
**Estado:** Borrador inicial (Parte I — Parcial 1)

---

## 1. Contexto

Una pyme con un almacén central y dos depósitos gestiona actualmente sus existencias de forma manual: hojas de cálculo, comunicación informal y controles no centralizados. Esto provoca falta de visibilidad sobre el inventario real, descoordinación entre ubicaciones y ausencia de un proceso formal para solicitar y aprobar movimientos internos de productos.

El cliente requiere reemplazar este proceso por una plataforma digital que centralice el control de inventario y dé trazabilidad completa a cada movimiento de stock.

## 2. Problema

- No existe trazabilidad de quién movió qué producto, cuándo y por qué.
- No hay alertas confiables cuando el stock de un producto cae por debajo de un mínimo aceptable.
- Las solicitudes internas de productos no siguen un flujo formal de aprobación, generando descontrol y decisiones no auditadas.
- El stock no puede verificarse de forma confiable por ubicación (almacén central vs. depósitos).

## 3. Objetivo

Construir un sistema de inventario transaccional que:

- Centralice productos, categorías, ubicaciones y stock.
- Garantice que el stock **solo cambie mediante movimientos válidos y auditables** (entradas, salidas, transferencias).
- Formalice un flujo de **solicitudes internas con aprobación** (Solicitante → Supervisor → Almacén).
- Genere **alertas automáticas de stock mínimo** por producto/ubicación.
- Ofrezca **kardex y reportes** para dar visibilidad operativa a la gerencia.
- Se implemente como monolito modular con arquitectura hexagonal simplificada, disponible en web (uso administrativo/operativo) y móvil (consulta y solicitudes rápidas).

## 4. Actores detallados

| Actor | Descripción | Necesidades principales |
|---|---|---|
| **Administrador** | Responsable de configurar el sistema: catálogos de productos/categorías, ubicaciones, usuarios y parámetros de alertas. Supervisa toda la operación. | Configurar el sistema correctamente; tener visibilidad total; auditar cualquier operación. |
| **Encargado de almacén** | Ejecuta la operación diaria: registra entradas, salidas y transferencias; atiende solicitudes aprobadas. | Registrar movimientos rápido y sin errores; ver el stock actualizado al instante; atender solicitudes con claridad. |
| **Solicitante interno** | Usuario de otra área que necesita productos del almacén. Crea solicitudes y hace seguimiento de su estado. | Solicitar productos fácilmente (incluso desde el móvil); saber en qué estado está su solicitud. |
| **Supervisor** | Aprueba o rechaza solicitudes internas antes de que lleguen a almacén. Tiene visibilidad ampliada sobre movimientos y solicitudes. | Aprobar/rechazar con información suficiente (stock disponible, historial); trazabilidad de sus decisiones. |

## 5. Alcance del MVP

El MVP debe demostrar, de forma funcional y persistente (no simulada), el **flujo crítico completo**:

> Solicitante crea solicitud → Supervisor aprueba → Almacén atiende mediante movimiento → Stock se actualiza → Kardex y alerta reflejan el resultado.

Incluye como mínimo:
- Gestión de Productos, Categorías y Ubicaciones (CRUD básico).
- Registro de Stock por producto/ubicación, no editable directamente.
- Registro de Movimientos (entrada, salida, transferencia) con actualización transaccional del stock.
- Ciclo de vida completo de Solicitudes: BORRADOR → ENVIADA → APROBADA/RECHAZADA → ATENDIDA/CANCELADA.
- Transferencias entre ubicaciones (salida en origen + entrada en destino, en una sola transacción lógica).
- Alertas de stock mínimo por producto/ubicación.
- Consulta de kardex (historial de movimientos por producto).
- Autenticación y autorización diferenciada por rol.
- Versión web (operación/administración) y versión móvil (consulta de stock, crear/aprobar solicitudes, notificaciones de stock bajo).
- Ejecución reproducible vía Docker Compose (PostgreSQL + backend) y migraciones de base de datos.

**Fuera del MVP** (ver exclusiones en README.md): contabilidad, facturación fiscal, pagos, edición directa de stock, stock negativo no autorizado.

## 6. Criterio de éxito

El proyecto se considerará exitoso si, al finalizar el MVP, el sistema permite demostrar de punta a punta:

1. Un movimiento de inventario recalcula el stock correctamente y de forma transaccional (sin inconsistencias).
2. El sistema **impide activamente** el stock negativo (salvo configuración explícita).
3. Una transferencia entre ubicaciones nunca deja al sistema en un estado inconsistente (débito sin crédito, o viceversa).
4. Una solicitud puede recorrer todo su ciclo de vida (creación → aprobación → atención) con trazabilidad de usuario y fecha en cada paso.
5. El kardex de un producto refleja fielmente su historial de movimientos.
6. Las alertas de stock mínimo se generan correctamente por producto/ubicación.
7. Web y móvil consumen el mismo backend, respetando los mismos permisos por rol.
8. El sistema es reproducible por un tercero siguiendo únicamente el README y las migraciones (sin configuración manual oculta).
9. Las operaciones críticas (movimientos, transferencias, aprobaciones) cuentan con pruebas automáticas.
