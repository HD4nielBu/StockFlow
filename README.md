# StockFlow — Gestión de Inventario, Compras Internas y Movimientos de Almacén

**Código de proyecto:** PA-06
**Asignatura:** Programación Aplicada 2026-2
**Tipo:** Proyecto integrador full-stack (Web + Móvil)

---

## 1. Problema

Una pyme con un almacén central y dos depósitos actualmente gestiona sus existencias de forma manual y desordenada, sin un sistema que centralice la información. Esto genera:

- Falta de trazabilidad sobre entradas, salidas y transferencias de productos entre ubicaciones.
- Ausencia de alertas confiables ante niveles críticos de stock.
- Descontrol en las solicitudes internas de materiales/productos, sin un flujo formal de aprobación.
- Imposibilidad de auditar quién movió qué, cuándo y por qué.

El cliente requiere una solución digital que reemplace este proceso manual por un sistema transaccional confiable y auditable.

## 2. Objetivo

Construir un sistema de inventario transaccional que permita:

- Gestionar productos, categorías y ubicaciones (almacén central + 2 depósitos).
- Registrar movimientos de stock (entradas, salidas, transferencias) de forma auditable.
- Mantener el stock por ubicación, actualizado únicamente a través de movimientos válidos (nunca editado directamente).
- Administrar solicitudes internas con un flujo de aprobación (Solicitante → Supervisor → Almacén).
- Generar alertas de stock mínimo por producto/ubicación.
- Ofrecer trazabilidad completa mediante kardex y reportes operativos.

El sistema se implementará como un **monolito modular con arquitectura hexagonal simplificada**, con backend en Java 21 + Spring Boot, base de datos PostgreSQL, frontend web en React + TypeScript y aplicación móvil en React Native + TypeScript.

## 3. Actores

| Actor | Responsabilidad principal |
|---|---|
| **Administrador** | Configura catálogos, usuarios y parámetros; supervisa la operación completa. |
| **Encargado de almacén** | Opera los procesos diarios: registra movimientos, atiende solicitudes, gestiona transferencias. |
| **Solicitante interno** | Crea solicitudes de productos/materiales, consulta su estado y stock disponible. |
| **Supervisor** | Aprueba o rechaza solicitudes; tiene visibilidad ampliada y trazabilidad de las operaciones. |

## 4. Alcance funcional

El sistema cubrirá los siguientes módulos:

- **Productos** — catálogo con código único.
- **Categorías** — clasificación de productos.
- **Ubicaciones** — almacén central y depósitos.
- **Stock** — existencias por producto/ubicación (modificable solo vía movimientos).
- **Movimientos** — entradas, salidas y transferencias, todos auditables.
- **Solicitudes internas** — ciclo BORRADOR → ENVIADA → APROBADA/RECHAZADA → ATENDIDA/CANCELADA.
- **Transferencias** — movimiento entre ubicaciones (salida en origen + entrada en destino, en una misma transacción lógica).
- **Aprobaciones** — flujo de autorización de solicitudes por parte del Supervisor.
- **Alertas** — notificación de stock por debajo del mínimo configurado, por producto/ubicación.
- **Reportes** — indicadores operativos y kardex de movimientos.

### Flujo crítico principal
> Solicitante crea solicitud → Supervisor aprueba → Almacén atiende mediante movimiento → Stock se actualiza → Kardex y alerta reflejan el resultado.

### Función de IA (Spring AI) — uso acotado
Asistente **opcional** y complementario para resumir tendencias de movimientos y explicar anomalías simples a partir de datos agregados. No participa en decisiones autónomas de compra ni sustituye reglas de negocio deterministas. Debe estar encapsulado detrás de una interfaz/puerto, con manejo de errores, timeout y fallback.

## 5. Exclusiones (fuera de alcance)

- **No se implementará contabilidad**, cuentas por pagar ni facturación fiscal.
- **No se procesarán pagos** ni información bancaria.
- **No se permitirá editar el stock directamente**: todo cambio debe originarse en un movimiento válido.
- **No se permitirá stock negativo**, salvo configuración explícita del proyecto (deshabilitada por defecto).
- No se construirán microservicios (arquitectura definida: monolito modular hexagonal simplificado).
- La función de IA no reemplaza validaciones ni reglas de negocio deterministas.

## 6. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 21 + Spring Boot |
| Base de datos | PostgreSQL (con migraciones) |
| Web | React + TypeScript |
| Móvil | React Native + TypeScript |
| Contenedores | Docker / Docker Compose |
| CI/CD | GitHub Actions |
| IA complementaria | Spring AI (uso acotado, con fallback) |
| Arquitectura | Monolito modular, hexagonal simplificada |

## 7. Estado actual

🔴 **Proyecto aún no iniciado.** Actualmente en etapa de planificación y levantamiento de requisitos, en preparación para la **Parte I – Parcial 1** (problema, requisitos, datos y backend fundacional).

Próximos pasos según el cronograma de entregas:
- [ ] Documento de visión y contexto del cliente
- [ ] Matriz de actores, objetivos y responsabilidades
- [ ] Catálogo de requisitos funcionales y no funcionales
- [ ] Reglas de negocio numeradas
- [ ] Modelo conceptual y DER lógico inicial
- [ ] Configuración de repositorio, Docker Compose y migraciones iniciales
- [ ] Backend con módulos base y al menos 3 casos de uso funcionando
- [ ] Shell de aplicación web y proyecto móvil compilable

---
